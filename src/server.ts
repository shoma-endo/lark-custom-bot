import express from 'express';
import { webhookHandler } from './webhook';
import { CONFIG } from './config';

const app = express();
app.use(express.json());

app.post('/webhook', webhookHandler);

app.listen(CONFIG.PORT, () => {
  console.log(`Server is running on port ${CONFIG.PORT}`);
});
