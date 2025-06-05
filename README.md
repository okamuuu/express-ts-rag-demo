# 🧠 RAG-based Q&A API with Node.js, TypeScript, and OpenAI

このプロジェクトは、**RAG (Retrieval-Augmented Generation)** を使って、独自ドキュメントに基づく質問応答をするデモアプリです。

## ✅ 技術スタック

- Node.js + TypeScript
- Express (API サーバー)
- OpenAI API (Embeddings & Chat)
- ベクトル検索：自前の cosine similarity
- ファイルベースのシンプルなベクトルストレージ（`data.json`）

---

## 📘 RAG とは？

RAG（Retrieval-Augmented Generation）は、**質問に対して関連する外部ドキュメントから情報を取得し、その情報を使って生成モデルに回答を作らせる手法**です。

この構成により、以下のような活用が可能になります：

- 社内ドキュメントに基づいた質問応答
- 非公開情報を元にした回答
- より正確で根拠のある生成回答

## 動作方法

はい、動作方法としてはおおむねその理解で合っています！以下に正確な手順を整理しておきます。

---

## ✅ 動作手順まとめ（ローカル開発編）

### 1. `.env` ファイルを作成

プロジェクトのルートディレクトリに `.env` ファイルを作り、OpenAI API キーを設定します：

```env
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 2. 必要パッケージをインストール

```bash
npm install
```

### 3. ベクトルデータを生成（ドキュメントのチャンク＋ Embedding）

```bash
npx ts-node src/embed.ts
```

これにより、`sample.txt` の内容がチャンク分割され、`data.json` にベクトルが保存されます。

### 4. サーバーを起動

```bash
npx ts-node src/index.ts
```

または（開発中のみ自動再起動にしたい場合）：

```bash
npx ts-node-dev src/index.ts
```

### 5. 質問してみる（curl などで）

```bash
curl -X POST http://localhost:3000/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "富士山の高さは？"}'
```

類似するチャンクが検索され、その情報をもとに ChatGPT が回答を生成します。
