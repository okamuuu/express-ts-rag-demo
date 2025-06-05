import express from "express";
import dotenv from "dotenv";
import { OpenAI } from "openai";
import { getAnswer } from "./utils/ask";

import type { Request, Response } from "express";

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());

// OpenAI 初期化
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello from Express + TypeScript!");
});

app.post("/ask", async (req, res) => {
  const { question } = req.body;
  if (!question) {
    res.status(400).json({ error: "question is required" });
    return;
  }

  try {
    const answer = await getAnswer(question);
    res.json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
