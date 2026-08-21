import jwt from "jsonwebtoken";
import { prisma } from "@repo/db";
import { JWT_SECRET } from "./config.js";

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  name: string;
  points: number;
  avatar?: string | null;
}

export async function extractAuthUser(token: string): Promise<AuthUser | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      username: string;
      email: string;
      name?: string;
      points?: number;
      avatar?: string | null;
    };

    if (!decoded || !decoded.userId) {
      return null;
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          username: true,
          email: true,
          name: true,
          points: true,
          avatar: true,
        },
      });

      if (user) {
        return user;
      }
    } catch {
      // Database is offline/unreachable - fallback to token payload
    }

    // In-memory fallback user from JWT
    return {
      id: decoded.userId,
      username: decoded.username || `user_${decoded.userId.substring(0, 6)}`,
      email: decoded.email || `${decoded.userId}@testturf.com`,
      name: decoded.name || decoded.username || "Contestant",
      points: decoded.points ?? 100,
      avatar: decoded.avatar ?? null,
    };
  } catch (error) {
    return null;
  }
}
