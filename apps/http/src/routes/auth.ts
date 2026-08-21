import { Router, Request, Response } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@repo/db";
import { JWT_SECRET } from "../config.js";
import { authMiddleware, AuthenticatedRequest, AuthJwtPayload } from "../middleware/auth.js";

const router = Router();

const signupSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must not exceed 30 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain alphanumeric characters and underscores"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required").max(50, "Name must not exceed 50 characters"),
});

const loginSchema = z.object({
  identifier: z.string().min(1, "Email or username is required"), // Can be email or username
  password: z.string().min(1, "Password is required"),
});

// POST /api/v1/auth/signup
router.post("/signup", async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = signupSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        error: "Validation failed",
        details: parseResult.error.errors.map((e) => e.message),
      });
      return;
    }

    const { username, email, password, name } = parseResult.data;

    // Check if user or email already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { username: username.toLowerCase() },
        ],
      },
    });

    if (existingUser) {
      if (existingUser.email.toLowerCase() === email.toLowerCase()) {
        res.status(409).json({
          success: false,
          error: "A user with this email already exists",
        });
        return;
      }
      res.status(409).json({
        success: false,
        error: "This username is already taken",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        password: hashedPassword,
        name,
        points: 0,
      },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        points: true,
        matchesPlayed: true,
        matchesWon: true,
        matchesLost: true,
        createdAt: true,
      },
    });

    const payload: AuthJwtPayload = {
      userId: newUser.id,
      username: newUser.username,
      email: newUser.email,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: newUser,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error during registration",
    });
  }
});

// POST /api/v1/auth/login
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        error: "Validation failed",
        details: parseResult.error.errors.map((e) => e.message),
      });
      return;
    }

    const { identifier, password } = parseResult.data;
    const lowerIdentifier = identifier.toLowerCase();

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: lowerIdentifier },
          { username: lowerIdentifier },
        ],
      },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        error: "Invalid credentials (user not found)",
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        error: "Invalid credentials (incorrect password)",
      });
      return;
    }

    const payload: AuthJwtPayload = {
      userId: user.id,
      username: user.username,
      email: user.email,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        points: user.points,
        matchesPlayed: user.matchesPlayed,
        matchesWon: user.matchesWon,
        matchesLost: user.matchesLost,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error during login",
    });
  }
});

// GET /api/v1/auth/me
router.get("/me", authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

export default router;
