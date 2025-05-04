// index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();                // .env を読み込む

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,   // 秘密キーは後で設定
});

const app = express();
app.use(cors());                 // どこからでも受け付ける
app.use(express.json());         // JSON を自動で読み取る

// POST /suggest でプロンプト候補を返す
app.post("/suggest", async (req, res) => {
  try {
    const { history } = req.body;      // [{role, content}, ...]
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-nano-2025-04-14",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        ...history,
      ],
      max_tokens: 150,
      temperature: 0.7,
    });
    const text = completion.choices[0].message.content;
    res.json({ suggestions: text.split("\n").filter(Boolean) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "OpenAI Error" });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
