import { Router, Request, Response } from "express";
import { prisma } from "@repo/db";
import { authMiddleware, AuthenticatedRequest } from "../middleware/auth.js";

const router = Router();

// GET /api/v1/user/profile (Protected)
router.get("/profile", authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        avatar: true,
        points: true,
        matchesPlayed: true,
        matchesWon: true,
        matchesLost: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ success: false, error: "User not found" });
      return;
    }

    // Calculate rank
    const higherRankedCount = await prisma.user.count({
      where: {
        points: { gt: user.points },
      },
    });
    const rank = higherRankedCount + 1;

    // Fetch recent 10 matches
    const recentMatches = await prisma.match.findMany({
      where: {
        OR: [{ player1Id: userId }, { player2Id: userId }],
        status: "COMPLETED",
      },
      orderBy: { startedAt: "desc" },
      take: 10,
      include: {
        player1: {
          select: { id: true, username: true, name: true },
        },
        player2: {
          select: { id: true, username: true, name: true },
        },
        winner: {
          select: { id: true, username: true, name: true },
        },
      },
    });

    const winRate =
      user.matchesPlayed > 0
        ? Number(((user.matchesWon / user.matchesPlayed) * 100).toFixed(1))
        : 0;

    res.status(200).json({
      success: true,
      profile: {
        ...user,
        rank,
        winRate,
        recentMatches: recentMatches.map((m) => {
          const isPlayer1 = m.player1Id === userId;
          const opponent = isPlayer1 ? m.player2 : m.player1;
          const userScore = isPlayer1 ? m.player1Score : m.player2Score;
          const opponentScore = isPlayer1 ? m.player2Score : m.player1Score;
          const result =
            m.winnerId === userId
              ? "WON"
              : m.winnerId === null
              ? "DRAW"
              : "LOST";

          return {
            matchId: m.id,
            opponent: {
              id: opponent.id,
              username: opponent.username,
              name: opponent.name,
            },
            userScore,
            opponentScore,
            result,
            startedAt: m.startedAt,
            endedAt: m.endedAt,
          };
        }),
      },
    });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error fetching profile",
    });
  }
});

// GET /api/v1/user/leaderboard (Public)
router.get("/leaderboard", async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const page = Math.max(Number(req.query.page) || 1, 1);
    const skip = (page - 1) * limit;

    const [users, totalUsers] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          username: true,
          name: true,
          avatar: true,
          points: true,
          matchesPlayed: true,
          matchesWon: true,
          matchesLost: true,
        },
        orderBy: [
          { points: "desc" },
          { matchesWon: "desc" },
        ],
        skip,
        take: limit,
      }),
      prisma.user.count(),
    ]);

    const rankedLeaderboard = users.map((u, index) => ({
      rank: skip + index + 1,
      id: u.id,
      username: u.username,
      name: u.name,
      avatar: u.avatar,
      points: u.points,
      matchesPlayed: u.matchesPlayed,
      matchesWon: u.matchesWon,
      matchesLost: u.matchesLost,
      winRate:
        u.matchesPlayed > 0
          ? Number(((u.matchesWon / u.matchesPlayed) * 100).toFixed(1))
          : 0,
    }));

    res.status(200).json({
      success: true,
      leaderboard: rankedLeaderboard,
      pagination: {
        page,
        limit,
        totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
      },
    });
  } catch (error) {
    console.error("Leaderboard error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error fetching leaderboard",
    });
  }
});

// GET /api/v1/user/:id (Public)
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ success: false, error: "User ID is required" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        name: true,
        avatar: true,
        points: true,
        matchesPlayed: true,
        matchesWon: true,
        matchesLost: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ success: false, error: "User not found" });
      return;
    }

    const higherRankedCount = await prisma.user.count({
      where: {
        points: { gt: user.points },
      },
    });

    const winRate =
      user.matchesPlayed > 0
        ? Number(((user.matchesWon / user.matchesPlayed) * 100).toFixed(1))
        : 0;

    res.status(200).json({
      success: true,
      user: {
        ...user,
        rank: higherRankedCount + 1,
        winRate,
      },
    });
  } catch (error) {
    console.error("User profile error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error fetching user profile",
    });
  }
});

export default router;
