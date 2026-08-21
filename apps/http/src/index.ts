import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { PORT, CORS_ORIGIN } from "./config.js";
import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.js";
import matchRouter from "./routes/match.js";
import questionsRouter from "./routes/questions.js";

const app = express();

// Middlewares
app.use(
  cors({
    origin: CORS_ORIGIN === "*" ? true : CORS_ORIGIN.split(","),
    credentials: true,
  })
);
app.use(express.json());

// Request logging in development
if (process.env.NODE_ENV !== "production") {
  app.use((req: Request, _res: Response, next: NextFunction) => {
    console.log(`[HTTP] ${req.method} ${req.path}`);
    next();
  });
}

// Health Check
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    service: "TESTTURF HTTP Backend",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to TESTTURF 1v1 Battle API",
    version: "1.0.0",
    docs: "/api/v1",
    endpoints: {
      auth: ["POST /api/v1/auth/signup", "POST /api/v1/auth/login", "GET /api/v1/auth/me"],
      user: ["GET /api/v1/user/profile", "GET /api/v1/user/leaderboard", "GET /api/v1/user/:id"],
      match: ["GET /api/v1/match/history", "GET /api/v1/match/:id"],
      questions: ["GET /api/v1/questions/sample", "GET /api/v1/questions/random"],
    },
  });
});

// API Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/match", matchRouter);
app.use("/api/v1/questions", questionsRouter);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

// Global Error Handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled HTTP error:", err);
  res.status(500).json({
    success: false,
    error: "Internal Server Error",
    message: err.message,
  });
});

const server = app.listen(PORT, () => {
  console.log(`🚀 HTTP Backend server running on http://localhost:${PORT}`);
});

export { app, server };
export default app;