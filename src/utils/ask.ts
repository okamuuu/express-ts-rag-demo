import { OpenAI } from "openai";
import fs from "fs";
import path from "path";
import { cosineSimilarity } from "./similarity";

const openai = new OpenAI();

type ChunkData = {
  text: string;
  embedding: number[];
};

// ユーザーの質問からembedding生成
export async function getAnswer(question: string): Promise<string> {
  const questionEmbeddingRes = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: question,
  });

  const questionEmbedding = questionEmbeddingRes.data[0].embedding;

  // 埋め込み済みのデータを読み込む
  const dataPath = path.join(__dirname, "data.json");
  const chunks: ChunkData[] = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

  // 類似度の高いチャンクを上位3件抽出
  const similarChunks = chunks
    .map((chunk) => ({
      ...chunk,
      similarity: cosineSimilarity(chunk.embedding, questionEmbedding),
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 3);

  const context = similarChunks.map((c) => c.text).join("\n---\n");

  // GPTに回答を生成させる
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "以下の文書を参考にユーザーの質問に回答してください。",
      },
      {
        role: "user",
        content: `参考文書:\n${context}\n\n質問:\n${question}`,
      },
    ],
  });

  return (
    completion.choices[0].message.content || "回答が生成できませんでした。"
  );
}
