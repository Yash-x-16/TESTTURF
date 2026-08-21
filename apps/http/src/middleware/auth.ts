import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";
import { prisma } from "@repo/db";

export interface AuthJwtPayload {
  userId: string;
  username: string;
  email: string;
  name?: string;
  points?: number;
}

export interface AuthenticatedRequest extends Request {
  userId?: string;
  user?: {
    id: string;
    username: string;
    email: string;
    name: string;
    points: number;
    matchesPlayed: number;
    matchesWon: number;
    matchesLost: number;
  };
}

export async function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      error: "Unauthorized: Missing or invalid Authorization header",
    });
    return;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({
      success: false,
      error: "Unauthorized: Token not provided",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthJwtPayload;

    try {
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          username: true,
          email: true,
          name: true,
          points: true,
          matchesPlayed: true,
          matchesWon: true,
          matchesLost: true,
        },
      });

      if (user) {
        req.userId = user.id;
        req.user = user;
        next();
        return;
      }
    } catch {
      // Database is offline - fallback to decoded token
    }

    req.userId = decoded.userId;
    req.user = {
      id: decoded.userId,
      username: decoded.username,
      email: decoded.email,
      name: decoded.name || decoded.username,
      points: decoded.points ?? 0,
      matchesPlayed: 0,
      matchesWon: 0,
      matchesLost: 0,
    };
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: "Unauthorized: Invalid or expired token",
    });
  }
}
