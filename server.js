const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();

// ミドルウェアの設定
app.use(cors());
app.use(express.json());

// OpenAIクライアントの初期化
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ルートエンドポイント
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'SubChat API is running' });
});

// 提案生成エンドポイント
app.post('/suggest', async (req, res) => {
  try {
    const { history } = req.body;
    
    if (!history || !Array.isArray(history)) {
      return res.status(400).json({
        status: 'error',
        message: '履歴が正しく指定されていません'
      });
    }

    console.log('受信した履歴:', history);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-nano-2025-04-14',
      messages: [
        {
          role: 'system',
          content: 'あなたは会話の文脈を理解し、次の質問やトピックを提案するアシスタントです。提案は簡潔で具体的に、3つまで生成してください。各提案は「〜について詳しく教えてください」という形式で統一してください。'
        },
        ...history,
        {
          role: 'system',
          content: '上記の会話を踏まえて、次の質問やトピックを3つ提案してください。各提案は「〜について詳しく教えてください」という形式で統一してください。'
        }
      ],
      temperature: 0.7,
      max_tokens: 200
    });

    console.log('APIレスポンス:', completion);

    const suggestions = completion.choices[0].message.content
      .split('\n')
      .filter(line => line.trim())
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .filter(line => line.length > 0);

    res.json({ suggestions });
  } catch (error) {
    console.error('提案生成エラー:', error);
    res.status(500).json({ 
      status: 'error',
      message: '提案の生成に失敗しました',
      details: error.message
    });
  }
});

// サーバーの起動
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});