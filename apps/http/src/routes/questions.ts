import fs from "fs";
import { Router, Request, Response } from "express";
import { prisma } from "@repo/db";

const router = Router();

function loadQuestionsFromJson() {
  try {
    const jsonPath = new URL("../questions.json", import.meta.url);
    const data = fs.readFileSync(jsonPath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

const LOCAL_QUESTIONS = loadQuestionsFromJson();

// GET /api/v1/questions/sample
router.get("/sample", async (_req: Request, res: Response): Promise<void> => {
  try {
    const totalQuestions = await prisma.question.count();
    const subjects = await prisma.question.groupBy({
      by: ["subject"],
      _count: { id: true },
    });

    res.status(200).json({
      success: true,
      totalQuestions,
      subjects: subjects.map((s) => ({
        subject: s.subject,
        count: s._count.id,
      })),
    });
  } catch {
    // Fallback to questions.json summary
    res.status(200).json({
      success: true,
      totalQuestions: LOCAL_QUESTIONS.length,
      subjects: [
        { subject: "Biology", count: LOCAL_QUESTIONS.filter((q: any) => q.subject === "Biology").length },
        { subject: "Physics", count: LOCAL_QUESTIONS.filter((q: any) => q.subject === "Physics").length },
        { subject: "Chemistry", count: LOCAL_QUESTIONS.filter((q: any) => q.subject === "Chemistry").length },
      ],
    });
  }
});

// GET /api/v1/questions/random (for offline practice)
router.get("/random", async (req: Request, res: Response): Promise<void> => {
  const limit = Math.min(Number(req.query.limit) || 5, 20);
  const subject = req.query.subject as string | undefined;

  try {
    const where = subject ? { subject } : {};
    const questions = await prisma.question.findMany({
      where,
      take: limit,
      select: {
        id: true,
        questionText: true,
        options: true,
        subject: true,
        topic: true,
        difficulty: true,
      },
    });

    if (questions && questions.length > 0) {
      res.status(200).json({ success: true, questions });
      return;
    }
  } catch {
    // Fallback to questions.json
  }

  let filtered = LOCAL_QUESTIONS;
  if (subject) {
    filtered = filtered.filter((q: any) => q.subject.toLowerCase() === subject.toLowerCase());
  }

  const shuffled = [...filtered].sort(() => 0.5 - Math.random()).slice(0, limit);
  const sanitized = shuffled.map(({ correctAnswer, explanation, ...rest }: any) => rest);

  res.status(200).json({
    success: true,
    questions: sanitized,
  });
});

export default router;
