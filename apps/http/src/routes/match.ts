import { Router, Response } from "express";
import { prisma } from "@repo/db";
import { authMiddleware, AuthenticatedRequest } from "../middleware/auth.js";

const router = Router();

// GET /api/v1/match/history (Protected)
router.get("/history", authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const limit = Math.min(Number(req.query.limit) || 15, 50);
    const page = Math.max(Number(req.query.page) || 1, 1);
    const skip = (page - 1) * limit;

    const [matches, totalMatches] = await Promise.all([
      prisma.match.findMany({
        where: {
          OR: [{ player1Id: userId }, { player2Id: userId }],
        },
        orderBy: { startedAt: "desc" },
        skip,
        take: limit,
        include: {
          player1: {
            select: { id: true, username: true, name: true, avatar: true },
          },
          player2: {
            select: { id: true, username: true, name: true, avatar: true },
          },
          winner: {
            select: { id: true, username: true, name: true },
          },
        },
      }),
      prisma.match.count({
        where: {
          OR: [{ player1Id: userId }, { player2Id: userId }],
        },
      }),
    ]);

    const formattedMatches = matches.map((m) => {
      const isPlayer1 = m.player1Id === userId;
      const opponent = isPlayer1 ? m.player2 : m.player1;
      const userScore = isPlayer1 ? m.player1Score : m.player2Score;
      const opponentScore = isPlayer1 ? m.player2Score : m.player1Score;
      const result =
        m.status === "ABANDONED"
          ? "ABANDONED"
          : m.winnerId === userId
          ? "WON"
          : m.winnerId === null
          ? "DRAW"
          : "LOST";

      return {
        id: m.id,
        status: m.status,
        opponent,
        userScore,
        opponentScore,
        result,
        startedAt: m.startedAt,
        endedAt: m.endedAt,
      };
    });

    res.status(200).json({
      success: true,
      matches: formattedMatches,
      pagination: {
        page,
        limit,
        totalMatches,
        totalPages: Math.ceil(totalMatches / limit),
      },
    });
  } catch (error) {
    console.error("Match history error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error fetching match history",
    });
  }
});

// GET /api/v1/match/:id (Protected)
router.get("/:id", authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const match = await prisma.match.findUnique({
      where: { id },
      include: {
        player1: {
          select: { id: true, username: true, name: true, avatar: true },
        },
        player2: {
          select: { id: true, username: true, name: true, avatar: true },
        },
        winner: {
          select: { id: true, username: true, name: true },
        },
        submissions: {
          include: {
            question: {
              select: {
                id: true,
                questionText: true,
                options: true,
                correctAnswer: true,
                subject: true,
                explanation: true,
              },
            },
          },
        },
      },
    });

    if (!match) {
      res.status(404).json({ success: false, error: "Match not found" });
      return;
    }

    // Check if user was part of the match
    if (match.player1Id !== userId && match.player2Id !== userId) {
      res.status(403).json({ success: false, error: "Forbidden: You were not a participant in this match" });
      return;
    }

    res.status(200).json({
      success: true,
      match,
    });
  } catch (error) {
    console.error("Match details error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error fetching match details",
    });
  }
});

export default router;
