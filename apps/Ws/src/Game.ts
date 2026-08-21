import crypto from "crypto";
import { prisma } from "@repo/db";
import { User } from "./User.js";
import {
  GAME_STARTED,
  QUESTION,
  ANSWER_ACCEPTED,
  QUESTION_RESULT,
  SCORE_UPDATE,
  GAME_OVER,
  OPPONENT_DISCONNECTED,
} from "./messages.js";
import { NEET_SCORING, QUESTION_TIME_LIMIT_SEC, REVIEW_TIME_LIMIT_SEC } from "./config.js";

export interface QuestionItem {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: number;
  subject: string;
  topic?: string | null;
  difficulty: string;
  explanation?: string | null;
}

export class Game {
  public gameId: string;
  public player1: User;
  public player2: User;
  public player1Score: number = 0;
  public player2Score: number = 0;
  public player1Answer: number | null = null;
  public player2Answer: number | null = null;
  public questions: QuestionItem[];
  public currentQuestionIndex: number = 0;
  public startTime: Date;

  private timer: NodeJS.Timeout | null = null;
  private reviewTimer: NodeJS.Timeout | null = null;
  private isFinished: boolean = false;
  private onGameOver: (gameId: string) => void;

  constructor(
    player1: User,
    player2: User,
    questions: QuestionItem[],
    onGameOver: (gameId: string) => void
  ) {
    this.gameId = `game_${crypto.randomUUID().replace(/-/g, "").substring(0, 10)}`;
    this.player1 = player1;
    this.player2 = player2;
    this.questions = questions;
    this.startTime = new Date();
    this.onGameOver = onGameOver;

    this.start();
  }

  private start() {
    // Notify Player 1
    this.player1.send({
      type: GAME_STARTED,
      payload: {
        gameId: this.gameId,
        opponent: {
          id: this.player2.id,
          username: this.player2.username,
          name: this.player2.name,
          points: this.player2.points,
          avatar: this.player2.avatar,
        },
        totalQuestions: this.questions.length,
        timeLimit: QUESTION_TIME_LIMIT_SEC,
        scoring: {
          correct: `+${NEET_SCORING.CORRECT}`,
          wrong: `${NEET_SCORING.WRONG}`,
          unanswered: `${NEET_SCORING.UNANSWERED}`,
        },
      },
    });

    // Notify Player 2
    this.player2.send({
      type: GAME_STARTED,
      payload: {
        gameId: this.gameId,
        opponent: {
          id: this.player1.id,
          username: this.player1.username,
          name: this.player1.name,
          points: this.player1.points,
          avatar: this.player1.avatar,
        },
        totalQuestions: this.questions.length,
        timeLimit: QUESTION_TIME_LIMIT_SEC,
        scoring: {
          correct: `+${NEET_SCORING.CORRECT}`,
          wrong: `${NEET_SCORING.WRONG}`,
          unanswered: `${NEET_SCORING.UNANSWERED}`,
        },
      },
    });

    // Send first question
    setTimeout(() => {
      this.sendQuestion();
    }, 1500);
  }

  private sendQuestion() {
    if (this.isFinished) return;

    if (this.currentQuestionIndex >= this.questions.length) {
      this.endGame();
      return;
    }

    this.player1Answer = null;
    this.player2Answer = null;

    const currentQ = this.questions[this.currentQuestionIndex]!;

    const questionPayload = {
      type: QUESTION,
      payload: {
        gameId: this.gameId,
        questionIndex: this.currentQuestionIndex + 1,
        totalQuestions: this.questions.length,
        timeLimit: QUESTION_TIME_LIMIT_SEC,
        question: {
          id: currentQ.id,
          questionText: currentQ.questionText,
          options: currentQ.options,
          subject: currentQ.subject,
          topic: currentQ.topic,
          difficulty: currentQ.difficulty,
        },
      },
    };

    this.player1.send(questionPayload);
    this.player2.send(questionPayload);

    // Question timeout timer
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.evaluateQuestion();
    }, QUESTION_TIME_LIMIT_SEC * 1000);
  }

  public submitAnswer(user: User, questionId: string, selectedOption: number) {
    if (this.isFinished) return;

    const currentQ = this.questions[this.currentQuestionIndex];
    if (!currentQ || currentQ.id !== questionId) return;

    const isP1 = user.id === this.player1.id;
    const isP2 = user.id === this.player2.id;
    if (!isP1 && !isP2) return;

    // Check if already answered
    if (isP1 && this.player1Answer !== null) return;
    if (isP2 && this.player2Answer !== null) return;

    const isCorrect = selectedOption === currentQ.correctAnswer;
    const scoreDelta = isCorrect ? NEET_SCORING.CORRECT : NEET_SCORING.WRONG;

    if (isP1) {
      this.player1Answer = selectedOption;
      this.player1Score += scoreDelta;
      this.player1.send({
        type: ANSWER_ACCEPTED,
        payload: {
          questionId,
          selectedOption,
          isCorrect,
          scoreDelta,
          totalScore: this.player1Score,
        },
      });
    } else {
      this.player2Answer = selectedOption;
      this.player2Score += scoreDelta;
      this.player2.send({
        type: ANSWER_ACCEPTED,
        payload: {
          questionId,
          selectedOption,
          isCorrect,
          scoreDelta,
          totalScore: this.player2Score,
        },
      });
    }

    // If both players have answered, evaluate question immediately
    if (this.player1Answer !== null && this.player2Answer !== null) {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.evaluateQuestion();
    }
  }

  private evaluateQuestion() {
    if (this.isFinished) return;

    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    const currentQ = this.questions[this.currentQuestionIndex]!;

    const p1Ans = this.player1Answer;
    const p2Ans = this.player2Answer;

    const p1Correct = p1Ans === currentQ.correctAnswer;
    const p2Correct = p2Ans === currentQ.correctAnswer;

    const p1Delta = p1Ans === null ? NEET_SCORING.UNANSWERED : p1Correct ? NEET_SCORING.CORRECT : NEET_SCORING.WRONG;
    const p2Delta = p2Ans === null ? NEET_SCORING.UNANSWERED : p2Correct ? NEET_SCORING.CORRECT : NEET_SCORING.WRONG;

    const resultPayload = {
      type: QUESTION_RESULT,
      payload: {
        questionId: currentQ.id,
        correctAnswer: currentQ.correctAnswer,
        explanation: currentQ.explanation,
        player1: {
          id: this.player1.id,
          name: this.player1.name,
          selectedOption: p1Ans,
          isCorrect: p1Correct,
          scoreDelta: p1Delta,
          totalScore: this.player1Score,
        },
        player2: {
          id: this.player2.id,
          name: this.player2.name,
          selectedOption: p2Ans,
          isCorrect: p2Correct,
          scoreDelta: p2Delta,
          totalScore: this.player2Score,
        },
      },
    };

    const scoreUpdatePayload = {
      type: SCORE_UPDATE,
      payload: {
        gameId: this.gameId,
        scores: {
          [this.player1.id]: this.player1Score,
          [this.player2.id]: this.player2Score,
        },
      },
    };

    this.player1.send(resultPayload);
    this.player2.send(resultPayload);
    this.player1.send(scoreUpdatePayload);
    this.player2.send(scoreUpdatePayload);

    // Advance to next question after review timeout
    if (this.reviewTimer) clearTimeout(this.reviewTimer);
    this.reviewTimer = setTimeout(() => {
      this.currentQuestionIndex++;
      this.sendQuestion();
    }, REVIEW_TIME_LIMIT_SEC * 1000);
  }

  private async endGame() {
    this.isFinished = true;
    this.clearTimers();

    let winnerId: string | null = null;
    if (this.player1Score > this.player2Score) {
      winnerId = this.player1.id;
    } else if (this.player2Score > this.player1Score) {
      winnerId = this.player2.id;
    }

    const gameOverPayload = {
      type: GAME_OVER,
      payload: {
        gameId: this.gameId,
        winnerId,
        isDraw: this.player1Score === this.player2Score,
        finalScores: {
          [this.player1.id]: this.player1Score,
          [this.player2.id]: this.player2Score,
        },
      },
    };

    this.player1.send(gameOverPayload);
    this.player2.send(gameOverPayload);

    // Save to Database
    try {
      await prisma.match.create({
        data: {
          id: this.gameId,
          player1Id: this.player1.id,
          player2Id: this.player2.id,
          player1Score: this.player1Score,
          player2Score: this.player2Score,
          winnerId,
          status: "COMPLETED",
          startedAt: this.startTime,
          endedAt: new Date(),
        },
      });

      // Update player stats
      await prisma.user.update({
        where: { id: this.player1.id },
        data: {
          points: { increment: Math.max(0, this.player1Score) },
          matchesPlayed: { increment: 1 },
          matchesWon: { increment: winnerId === this.player1.id ? 1 : 0 },
          matchesLost: { increment: winnerId === this.player2.id ? 1 : 0 },
        },
      });

      await prisma.user.update({
        where: { id: this.player2.id },
        data: {
          points: { increment: Math.max(0, this.player2Score) },
          matchesPlayed: { increment: 1 },
          matchesWon: { increment: winnerId === this.player2.id ? 1 : 0 },
          matchesLost: { increment: winnerId === this.player1.id ? 1 : 0 },
        },
      });
    } catch (e) {
      console.error("Error saving game to database:", e);
    }

    this.onGameOver(this.gameId);
  }

  public async handleDisconnect(user: User) {
    if (this.isFinished) return;
    this.isFinished = true;
    this.clearTimers();

    const remainingPlayer = user.id === this.player1.id ? this.player2 : this.player1;
    const winnerId = remainingPlayer.id;

    remainingPlayer.send({
      type: OPPONENT_DISCONNECTED,
      payload: {
        gameId: this.gameId,
        winnerId,
        message: "Opponent disconnected. You win by default!",
      },
    });

    try {
      await prisma.match.create({
        data: {
          id: this.gameId,
          player1Id: this.player1.id,
          player2Id: this.player2.id,
          player1Score: this.player1Score,
          player2Score: this.player2Score,
          winnerId,
          status: "ABANDONED",
          startedAt: this.startTime,
          endedAt: new Date(),
        },
      });
    } catch (e) {
      console.error("Error saving abandoned game:", e);
    }

    this.onGameOver(this.gameId);
  }

  public clearTimers() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.reviewTimer) {
      clearTimeout(this.reviewTimer);
      this.reviewTimer = null;
    }
  }
}
