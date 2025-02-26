import dotenv from 'dotenv';

dotenv.config();

export const CONFIG = {
  PORT: process.env.PORT || 8080,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  LARK_APP_ID: process.env.LARK_APP_ID || '',
  LARK_APP_SECRET: process.env.LARK_APP_SECRET || '',
  BITABLE_APP_TOKEN: process.env.LARK_BITABLE_APP_TOKEN || '',
  BUCKET_NAME: 'geminituning-data',
  LARK_API_URL: 'https://open.larksuite.com/open-apis/auth/v3/tenant_access_token/internal',
  LARK_MESSAGE_URL: 'https://open.larksuite.com/open-apis/im/v1/messages',
  LARK_BITABLE_BASE_URL: 'https://open.larksuite.com/open-apis/bitable/v1',
};
