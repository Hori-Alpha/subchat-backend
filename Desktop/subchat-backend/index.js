import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors({ origin: '*' }));        // 一旦全 Origin 許可
app.use(express.json());

// ルート GET
app.get('/', (_, res) => res.send('OK'));

// /suggest もエコー
app.post('/suggest', (req, res) => {
  res.json({ suggestions: ['test-ok'] });
});

// Render が注入する PORT を必ず使う
const port = process.env.PORT || 8080;
app.listen(port, () => console.log('API listening on', port));

app.post('/suggest', async (req, res) => {
  const { history } = req.body;
  // OpenAI へプロンプト生成
  const completion = await openai.chat.completions.create({
    model: 'gpt-4.1-nano-2025-04-14',
    max_tokens: 100,
    temperature: 0.7,
    messages: [
      { role: 'system', content: 'あなたはプロンプトを提案するアシスタントです。' },
      ...history,
      { role: 'user', content: '次に送ると良いプロンプトを3案ください。' }
    ]
  });
  const text = completion.choices[0].message.content.split('\n').filter(x=>x.trim());
  res.json({ suggestions: text.slice(0,3) });
});
