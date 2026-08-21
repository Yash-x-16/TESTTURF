import * as dotenv from "dotenv";

dotenv.config();

export const WS_PORT = Number(process.env.WS_PORT) || 8080;
export const JWT_SECRET = process.env.JWT_SECRET || "testturf-super-secret-jwt-key-2026";
export const QUESTION_TIME_LIMIT_SEC = 15; // 15 seconds per question
export const REVIEW_TIME_LIMIT_SEC = 3;   // 3 seconds to review results before next question
export const COUNTDOWN_SEC = 3;            // 3 second pre-match countdown
export const QUESTIONS_PER_MATCH = 5;      // 5 questions per 1v1 battle

// NEET Exam Scoring Rules
export const NEET_SCORING = {
  CORRECT: 4,      // +4 points for correct answer
  WRONG: -1,       // -1 point for incorrect answer
  UNANSWERED: 0,   // 0 points for unanswered/skipped/timeout
} as const;
