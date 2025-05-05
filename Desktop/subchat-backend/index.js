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

