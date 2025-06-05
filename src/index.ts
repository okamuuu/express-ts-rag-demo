import express from "express";
import type { Request, Response } from "express";

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello from Express + TypeScript!");
});

// POSTで質問を受け付けるエンドポイント例
app.post("/ask", (req: Request, res: Response) => {
  const { question } = req.body;
  if (!question) {
    res.status(400).json({ error: "質問を送ってください" });
    return;
  }
  // 今はダミー応答
  res.json({
    answer: `質問「${question}」を受け付けました。`,
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
