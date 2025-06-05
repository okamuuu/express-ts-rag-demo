import fs from "fs/promises";
import path from "path";
import { config } from "dotenv";
import OpenAI from "openai";

config(); // .env の読み込み

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const CHUNK_SIZE = 500; // 文字数チャンクサイズ

async function main() {
  const filePath = path.resolve(__dirname, "../data/sample.txt");
  const text = await fs.readFile(filePath, "utf-8");

  // チャンク分割
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += CHUNK_SIZE) {
    chunks.push(text.slice(i, i + CHUNK_SIZE));
  }

  console.log(`🔹 ${chunks.length} チャンクに分割されました`);

  const embeddings = [];

  for (const chunk of chunks) {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: chunk,
    });
    embeddings.push({
      text: chunk,
      embedding: response.data[0].embedding,
    });
  }

  const outPath = path.resolve(__dirname, "../data/embeddings.json");
  await fs.writeFile(outPath, JSON.stringify(embeddings, null, 2));

  console.log(`✅ embeddings.json に保存しました`);
}

main().catch(console.error);
