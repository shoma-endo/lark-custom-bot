import express from 'express';
import { webhookHandler } from './webhook';
import { CONFIG } from './config';
import baseRouter from './routes/base';

const app = express();
app.use(express.json());

// Webhookエンドポイント
app.post('/webhook', webhookHandler);

// Bitable関連のAPIエンドポイント
app.use('/base', baseRouter);

app.listen(CONFIG.PORT, () => {
  console.log(`Server is running on port ${CONFIG.PORT}`);
});
