import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { WebSocket } from "ws";
import { prisma } from "@repo/db";
import { User } from "./User.js";
import { Game, QuestionItem } from "./Game.js";
import {
  INIT_GAME,
  WAITING_FOR_OPPONENT,
  SUBMIT_ANSWER,
  LEADERBOARD,
  LEADERBOARD_UPDATE,
  PING,
  PONG,
} from "./messages.js";
import { QUESTIONS_PER_MATCH } from "./config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load questions from questions.json (checking current directory and src directory)
function loadQuestionsFromJson(): QuestionItem[] {
  const possiblePaths = [
    path.join(__dirname, "questions.json"),
    path.join(__dirname, "../src/questions.json"),
    path.join(process.cwd(), "apps/Ws/src/questions.json"),
    path.join(process.cwd(), "src/questions.json"),
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      try {
        const data = fs.readFileSync(p, "utf-8");
        return JSON.parse(data);
      } catch (err) {
        // continue
      }
    }
  }

  return [];
}

const DEFAULT_QUESTIONS: QuestionItem[] = loadQuestionsFromJson();

export class GameManager {
  private games: Game[];
  private pendingUser: User | null;
  private users: User[];
  private inMemoryScores: Map<string, { points: number; matchesWon: number; matchesPlayed: number }>;

  constructor() {
    this.games = [];
    this.pendingUser = null;
    this.users = [];
    this.inMemoryScores = new Map();
  }

  public addUser(user: User) {
    this.users.push(user);

    if (!this.inMemoryScores.has(user.id)) {
      this.inMemoryScores.set(user.id, {
        points: user.points || 0,
        matchesWon: 0,
        matchesPlayed: 0,
      });
    }

    this.addHandler(user);
    this.sendLeaderboard(user);
  }

  public removeUser(socket: WebSocket) {
    const user = this.users.find((u) => u.socket === socket);
    if (!user) return;

    this.users = this.users.filter((u) => u.socket !== socket);

    if (this.pendingUser && this.pendingUser.socket === socket) {
      this.pendingUser = null;
    }

    const game = this.games.find(
      (g) => g.player1.id === user.id || g.player2.id === user.id
    );
    if (game) {
      game.handleDisconnect(user);
    }
  }

  public removeGame(gameId: string) {
    this.games = this.games.filter((g) => g.gameId !== gameId);
  }

  private addHandler(user: User) {
    user.socket.on("message", async (data) => {
      try {
        const message = JSON.parse(data.toString());

        // 1. Start match request from frontend
        if (message.type === INIT_GAME) {
          const existingGame = this.games.find(
            (g) => g.player1.id === user.id || g.player2.id === user.id
          );
          if (existingGame) {
            user.send({
              type: "already_in_game",
              payload: { gameId: existingGame.gameId },
            });
            return;
          }

          if (this.pendingUser) {
            if (this.pendingUser.id === user.id) {
              user.send({
                type: WAITING_FOR_OPPONENT,
                payload: { message: "Already in queue waiting for an opponent" },
              });
              return;
            }

            const opponent = this.pendingUser;
            this.pendingUser = null;

            // Pick random questions from questions.json / DB
            const questions = await this.getQuestions(QUESTIONS_PER_MATCH);

            const game = new Game(opponent, user, questions, (gameId) => {
              this.updateScoresAfterGame(game);
              this.removeGame(gameId);
              this.broadcastLeaderboard();
            });

            this.games.push(game);
          } else {
            this.pendingUser = user;
            user.send({
              type: WAITING_FOR_OPPONENT,
              payload: { message: "Waiting for an opponent to join..." },
            });
          }
        }

        // 2. Submit MCQ answer
        if (message.type === SUBMIT_ANSWER && message.payload) {
          const game = this.games.find(
            (g) => g.player1.id === user.id || g.player2.id === user.id
          );
          if (game) {
            game.submitAnswer(
              user,
              message.payload.questionId,
              message.payload.selectedOption
            );
          }
        }

        // 3. Request Leaderboard
        if (message.type === LEADERBOARD) {
          await this.sendLeaderboard(user);
        }

        // 4. Ping/Pong Heartbeat
        if (message.type === PING) {
          user.send({ type: PONG, timestamp: Date.now() });
        }
      } catch (e) {
        console.error("Error handling WS message:", e);
      }
    });
  }

  private updateScoresAfterGame(game: Game) {
    const s1 = this.inMemoryScores.get(game.player1.id);
    if (s1) {
      s1.points += Math.max(0, game.player1Score);
      s1.matchesPlayed += 1;
      if (game.player1Score > game.player2Score) s1.matchesWon += 1;
    }

    const s2 = this.inMemoryScores.get(game.player2.id);
    if (s2) {
      s2.points += Math.max(0, game.player2Score);
      s2.matchesPlayed += 1;
      if (game.player2Score > game.player1Score) s2.matchesWon += 1;
    }
  }

  public async getQuestions(count: number = 5): Promise<QuestionItem[]> {
    try {
      const dbQuestions = await prisma.question.findMany({ take: 50 });
      if (dbQuestions && dbQuestions.length > 0) {
        const shuffled = [...dbQuestions].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count).map((q) => ({
          id: q.id,
          questionText: q.questionText,
          options: Array.isArray(q.options)
            ? (q.options as string[])
            : typeof q.options === "string"
            ? JSON.parse(q.options)
            : ["A", "B", "C", "D"],
          correctAnswer: q.correctAnswer,
          subject: q.subject,
          topic: q.topic,
          difficulty: q.difficulty,
          explanation: q.explanation,
        }));
      }
    } catch {
      // Offline fallback: load from questions.json
    }

    const pool = DEFAULT_QUESTIONS.length > 0 ? DEFAULT_QUESTIONS : this.getFallbackHardcoded();
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  private getFallbackHardcoded(): QuestionItem[] {
    return [
      {
        id: "q1",
        questionText: "Which organelle is known as the 'Powerhouse of the Cell'?",
        options: ["Ribosome", "Mitochondria", "Endoplasmic Reticulum", "Golgi"],
        correctAnswer: 1,
        subject: "Biology",
        difficulty: "EASY",
        explanation: "Mitochondria produce ATP.",
      },
    ];
  }

  public async sendLeaderboard(user: User) {
    const leaderboard = await this.getLeaderboardData();
    user.send({
      type: LEADERBOARD_UPDATE,
      payload: { leaderboard },
    });
  }

  public async broadcastLeaderboard() {
    const leaderboard = await this.getLeaderboardData();
    const payload = {
      type: LEADERBOARD_UPDATE,
      payload: { leaderboard },
    };
    this.users.forEach((u) => u.send(payload));
  }

  private async getLeaderboardData() {
    try {
      const topUsers = await prisma.user.findMany({
        take: 20,
        orderBy: [{ points: "desc" }, { matchesWon: "desc" }],
        select: {
          id: true,
          username: true,
          name: true,
          avatar: true,
          points: true,
          matchesWon: true,
          matchesPlayed: true,
        },
      });

      if (topUsers && topUsers.length > 0) {
        return topUsers.map((u, i) => ({ rank: i + 1, ...u }));
      }
    } catch {
      // In-memory fallback
    }

    const list = this.users.map((u) => {
      const stats = this.inMemoryScores.get(u.id) || { points: u.points, matchesWon: 0, matchesPlayed: 0 };
      return {
        id: u.id,
        username: u.username,
        name: u.name,
        avatar: u.avatar || null,
        points: stats.points,
        matchesWon: stats.matchesWon,
        matchesPlayed: stats.matchesPlayed,
      };
    });

    list.sort((a, b) => b.points - a.points);
    return list.map((u, i) => ({ rank: i + 1, ...u }));
  }
}
