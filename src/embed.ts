import fs from "fs-extra";
import dotenv from "dotenv";
import { OpenAI } from "openai";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const CHUNK_SIZE = 500;

async function main() {
  const text = await fs.readFile("./docs/sample.txt", "utf-8");

  console.log(text);

  // チャンク分割
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += CHUNK_SIZE) {
    chunks.push(text.slice(i, i + CHUNK_SIZE));
  }

  console.log(`🔹 ${chunks.length} チャンクに分割されました`);

  // ベクトル化
  const vectors = await Promise.all(
    chunks.map(async (chunk, i) => {
      const res = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: chunk,
      });
      return {
        id: `chunk-${i}`,
        text: chunk,
        embedding: res.data[0].embedding,
      };
    })
  );

  console.log("✅ ベクトル化完了");
  console.log(vectors.slice(0, 1)); // 1件だけ表示（デバッグ用）
}

main().catch(console.error);
