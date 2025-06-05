import express from "express";
import dotenv from "dotenv";
import { OpenAI } from "openai";

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

// 質問応答エンドポイント
app.post("/ask", async (req: Request, res: Response) => {
  const { question } = req.body;

  if (!question) {
    res.status(400).json({ error: "質問が空です" });
    return;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: question,
        },
      ],
    });

    const answer = completion.choices[0]?.message?.content;
    res.json({ answer });
  } catch (error) {
    console.error("OpenAI API エラー:", error);
    res.status(500).json({ error: "OpenAI API 呼び出し失敗" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
