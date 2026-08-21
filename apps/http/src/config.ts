import * as dotenv from "dotenv";

dotenv.config();

export const PORT = Number(process.env.PORT) || 3001;
export const JWT_SECRET = process.env.JWT_SECRET || "testturf-super-secret-jwt-key-2026";
export const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";
