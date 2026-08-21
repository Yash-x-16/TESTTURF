import { createServer } from "http";
import jwt from "jsonwebtoken";
import { WebSocket } from "ws";
import { app } from "../apps/http/dist/index.js";
import { GameManager } from "../apps/Ws/dist/GameManager.js";
import { Game } from "../apps/Ws/dist/Game.js";
import { User } from "../apps/Ws/dist/User.js";
import {
  INIT_GAME,
  GAME_STARTED,
  QUESTION,
  SUBMIT_ANSWER,
  ANSWER_ACCEPTED,
  QUESTION_RESULT,
  SCORE_UPDATE,
  GAME_OVER,
  WAITING_FOR_OPPONENT,
} from "../apps/Ws/dist/messages.js";
import { JWT_SECRET, NEET_SCORING } from "../apps/Ws/dist/config.js";

const TEST_PORT = 3099;

function logPass(msg: string) {
  console.log(`\x1b[32m✔ PASS: ${msg}\x1b[0m`);
}

function logFail(msg: string, err?: any) {
  console.error(`\x1b[31m✖ FAIL: ${msg}\x1b[0m`, err || "");
}

async function runTests() {
  console.log("\n==================================================");
  console.log("🧪 TESTTURF (CODE100X STYLE) SYSTEM VERIFICATION");
  console.log("==================================================\n");

  let passed = 0;
  let failed = 0;

  // ----------------------------------------------------
  // TEST 1: HTTP Server Endpoints & Routing
  // ----------------------------------------------------
  console.log("--- TEST SUITE 1: HTTP API Routes ---");
  const httpServer = createServer(app);
  await new Promise<void>((resolve) => httpServer.listen(TEST_PORT, resolve));
  logPass(`HTTP Server started on port ${TEST_PORT}`);
  passed++;

  try {
    // 1. Health check
    const healthRes = await fetch(`http://localhost:${TEST_PORT}/health`);
    const healthData = await healthRes.json();
    if (healthRes.status === 200 && healthData.status === "ok") {
      logPass("GET /health returned status: ok");
      passed++;
    } else {
      throw new Error(`Health check returned ${healthRes.status}`);
    }

    // 2. Auth Signup validation
    const invalidSignupRes = await fetch(`http://localhost:${TEST_PORT}/api/v1/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "ab", email: "invalid", password: "123" }),
    });
    const invalidSignupData = await invalidSignupRes.json();
    if (invalidSignupRes.status === 400 && invalidSignupData.success === false) {
      logPass("POST /api/v1/auth/signup correctly validates required fields and formats");
      passed++;
    } else {
      throw new Error(`Expected 400 validation error but got ${invalidSignupRes.status}`);
    }

    // 3. Auth Protected Route without token
    const unauthorizedRes = await fetch(`http://localhost:${TEST_PORT}/api/v1/user/profile`);
    if (unauthorizedRes.status === 401) {
      logPass("GET /api/v1/user/profile correctly blocks unauthenticated requests (401)");
      passed++;
    } else {
      throw new Error(`Expected 401 but got ${unauthorizedRes.status}`);
    }
  } catch (err: any) {
    logFail("HTTP API Routes verification failed", err.message);
    failed++;
  } finally {
    httpServer.close();
  }

  // ----------------------------------------------------
  // TEST 2: JWT Token Generation & Verification
  // ----------------------------------------------------
  console.log("\n--- TEST SUITE 2: JWT Authentication ---");
  const testUser1 = {
    id: "usr_1",
    username: "neet_student_1",
    email: "student1@testturf.com",
    name: "Rohan Gupta",
    points: 100,
  };

  const testUser2 = {
    id: "usr_2",
    username: "neet_student_2",
    email: "student2@testturf.com",
    name: "Sneha Reddy",
    points: 80,
  };

  const token1 = jwt.sign(
    { userId: testUser1.id, username: testUser1.username, email: testUser1.email },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  const decoded = jwt.verify(token1, JWT_SECRET) as any;
  if (decoded.userId === testUser1.id) {
    logPass("JWT token generated and verified with secret");
    passed++;
  } else {
    logFail("JWT verification failed");
    failed++;
  }

  // ----------------------------------------------------
  // TEST 3: In-Memory 1v1 Game & NEET Scoring (+4 / -1)
  // ----------------------------------------------------
  console.log("\n--- TEST SUITE 3: Code100x 1v1 Game & NEET Scoring (+4 / -1) ---");

  const mockQuestions = [
    {
      id: "q1",
      questionText: "What is the powerhouse of the cell?",
      options: ["Ribosome", "Mitochondria", "Lysosome", "Nucleus"],
      correctAnswer: 1, // Option index 1 (Mitochondria)
      subject: "Biology",
      difficulty: "EASY",
      explanation: "Mitochondria produces ATP.",
    },
    {
      id: "q2",
      questionText: "What is the SI unit of Electric Potential?",
      options: ["Ohm", "Ampere", "Volt", "Coulomb"],
      correctAnswer: 2, // Option index 2 (Volt)
      subject: "Physics",
      difficulty: "EASY",
      explanation: "Volt is the SI unit of potential difference.",
    },
  ];

  const p1Messages: any[] = [];
  const p2Messages: any[] = [];

  const mockSocket1 = {
    readyState: WebSocket.OPEN,
    send: (data: string) => {
      p1Messages.push(JSON.parse(data));
    },
    on: () => {},
  } as unknown as WebSocket;

  const mockSocket2 = {
    readyState: WebSocket.OPEN,
    send: (data: string) => {
      p2Messages.push(JSON.parse(data));
    },
    on: () => {},
  } as unknown as WebSocket;

  const user1 = new User(mockSocket1, testUser1);
  const user2 = new User(mockSocket2, testUser2);

  let isGameOverCalled = false;
  const game = new Game(user1, user2, mockQuestions, () => {
    isGameOverCalled = true;
  });

  // Verify GAME_STARTED
  const p1Start = p1Messages.find((m) => m.type === GAME_STARTED);
  const p2Start = p2Messages.find((m) => m.type === GAME_STARTED);

  if (p1Start && p2Start && p1Start.payload.opponent.id === testUser2.id) {
    logPass("GAME_STARTED delivered to both players with opponent payload");
    passed++;
  } else {
    logFail("GAME_STARTED failed", p1Start);
    failed++;
  }

  // Force first question
  (game as any).sendQuestion();

  // Verify QUESTION received without correctAnswer
  const qMsg = p1Messages.find((m) => m.type === QUESTION);
  if (qMsg && qMsg.payload.question.id === "q1" && qMsg.payload.question.correctAnswer === undefined) {
    logPass("QUESTION delivered without leaking the correct answer to clients");
    passed++;
  } else {
    logFail("QUESTION event failed or leaked answer", qMsg);
    failed++;
  }

  // Player 1 submits CORRECT answer (Option 1) -> NEET +4
  game.submitAnswer(user1, "q1", 1);
  const p1Ack = p1Messages.find((m) => m.type === ANSWER_ACCEPTED);
  if (p1Ack && p1Ack.payload.isCorrect === true && p1Ack.payload.scoreDelta === 4 && game.player1Score === 4) {
    logPass("Player 1 scored +4 points for correct answer (NEET rule)");
    passed++;
  } else {
    logFail("Player 1 scoring failed", p1Ack);
    failed++;
  }

  // Player 2 submits WRONG answer (Option 0) -> NEET -1
  game.submitAnswer(user2, "q1", 0);
  const p2Ack = p2Messages.find((m) => m.type === ANSWER_ACCEPTED);
  if (p2Ack && p2Ack.payload.isCorrect === false && p2Ack.payload.scoreDelta === -1 && game.player2Score === -1) {
    logPass("Player 2 received -1 negative marking for wrong answer (NEET rule)");
    passed++;
  } else {
    logFail("Player 2 negative marking failed", p2Ack);
    failed++;
  }

  // Verify QUESTION_RESULT and SCORE_UPDATE broadcast
  const resultMsg = p1Messages.find((m) => m.type === QUESTION_RESULT);
  const scoreUpdateMsg = p1Messages.find((m) => m.type === SCORE_UPDATE);

  if (resultMsg && resultMsg.payload.correctAnswer === 1) {
    logPass("QUESTION_RESULT broadcast with correct answer and breakdown");
    passed++;
  } else {
    logFail("QUESTION_RESULT failed", resultMsg);
    failed++;
  }

  if (
    scoreUpdateMsg &&
    scoreUpdateMsg.payload.scores[testUser1.id] === 4 &&
    scoreUpdateMsg.payload.scores[testUser2.id] === -1
  ) {
    logPass("SCORE_UPDATE live scores broadcast: Player 1 = 4, Player 2 = -1");
    passed++;
  } else {
    logFail("SCORE_UPDATE failed", scoreUpdateMsg);
    failed++;
  }

  game.clearTimers();

  // ----------------------------------------------------
  // TEST 4: GameManager (INIT_GAME Matchmaking)
  // ----------------------------------------------------
  console.log("\n--- TEST SUITE 4: GameManager Matchmaking (INIT_GAME) ---");
  const gameManager = new GameManager();

  const p1SocketListeners: { [evt: string]: Function } = {};
  const p2SocketListeners: { [evt: string]: Function } = {};

  const p1Ws = {
    readyState: WebSocket.OPEN,
    send: (data: string) => p1Messages.push(JSON.parse(data)),
    on: (evt: string, fn: Function) => {
      p1SocketListeners[evt] = fn;
    },
  } as unknown as WebSocket;

  const p2Ws = {
    readyState: WebSocket.OPEN,
    send: (data: string) => p2Messages.push(JSON.parse(data)),
    on: (evt: string, fn: Function) => {
      p2SocketListeners[evt] = fn;
    },
  } as unknown as WebSocket;

  const u1 = new User(p1Ws, testUser1);
  const u2 = new User(p2Ws, testUser2);

  gameManager.addUser(u1);
  gameManager.addUser(u2);

  // Player 1 clicks start match -> sends INIT_GAME
  p1SocketListeners["message"]!(Buffer.from(JSON.stringify({ type: INIT_GAME })));
  const waitMsg = p1Messages.find((m) => m.type === WAITING_FOR_OPPONENT);
  if (waitMsg) {
    logPass("Player 1 sent INIT_GAME -> received WAITING_FOR_OPPONENT");
    passed++;
  } else {
    logFail("WAITING_FOR_OPPONENT not received");
    failed++;
  }

  // Player 2 clicks start match -> sends INIT_GAME
  await p2SocketListeners["message"]!(Buffer.from(JSON.stringify({ type: INIT_GAME })));
  const newGameStarted = p2Messages.find((m) => m.type === GAME_STARTED);
  if (newGameStarted) {
    logPass("Player 2 sent INIT_GAME -> paired with Player 1 into new 1v1 Game");
    passed++;
  } else {
    logFail("Player 2 failed to pair into new Game", newGameStarted);
    failed++;
  }

  console.log("\n==================================================");
  console.log(`📊 FINAL RESULT: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================\n");

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch((e) => {
  console.error("Fatal test error:", e);
  process.exit(1);
});

