import { WebSocket } from "ws";

export interface AuthenticatedUser {
  id: string;
  username: string;
  email: string;
  name: string;
  points: number;
  avatar?: string | null;
}

export interface CustomWebSocket extends WebSocket {
  user?: AuthenticatedUser;
  isAlive?: boolean;
}

export interface QuestionData {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: number;
  subject: string;
  topic?: string | null;
  difficulty: string;
  explanation?: string | null;
}

export interface PlayerAnswerRecord {
  questionId: string;
  questionIndex: number;
  selectedOption: number; // 0-3 or -1 for timeout
  isCorrect: boolean;
  scoreDelta: number;     // +4, -1, or 0
  answeredAt: number;     // timestamp in ms
}

export interface PlayerState {
  ws: CustomWebSocket;
  user: AuthenticatedUser;
  score: number;
  currentAnswer: number | null; // null if not yet answered for current question
  answeredAt: number | null;
  answers: PlayerAnswerRecord[];
  totalCorrect: number;
  totalWrong: number;
  totalUnanswered: number;
  isConnected: boolean;
}

export type GameRoomStatus =
  | "WAITING"
  | "COUNTDOWN"
  | "QUESTION_ACTIVE"
  | "QUESTION_REVIEW"
  | "MATCH_FINISHED"
  | "ABANDONED";

export interface LeaderboardEntry {
  rank: number;
  id: string;
  username: string;
  name: string;
  points: number;
  avatar?: string | null;
  matchesWon: number;
  matchesPlayed: number;
}

// Client to Server Action Types
export type ClientMessageType =
  | "START_MATCH"
  | "CANCEL_MATCH"
  | "SUBMIT_ANSWER"
  | "GET_LEADERBOARD"
  | "PING";

export interface ClientMessage {
  type: ClientMessageType;
  data?: {
    matchId?: string;
    questionId?: string;
    questionIndex?: number;
    selectedOption?: number;
  };
}

// Server to Client Event Types
export type ServerMessageType =
  | "AUTH_SUCCESS"
  | "AUTH_ERROR"
  | "QUEUE_STATUS"
  | "MATCH_FOUND"
  | "COUNTDOWN"
  | "QUESTION"
  | "ANSWER_ACCEPTED"
  | "QUESTION_RESULT"
  | "SCORE_UPDATE"
  | "MATCH_OVER"
  | "OPPONENT_DISCONNECTED"
  | "LEADERBOARD_UPDATE"
  | "PONG"
  | "ERROR";

export interface ServerMessage<T = unknown> {
  type: ServerMessageType;
  data?: T;
  message?: string;
  timestamp?: number;
}
