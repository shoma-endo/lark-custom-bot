import axios from 'axios';
import { CONFIG } from '../config';

/**
 * Lark API のアクセストークンを取得
 */
export async function getLarkToken(): Promise<string | null> {
  try {
    const response = await axios.post(CONFIG.LARK_API_URL, {
      app_id: CONFIG.LARK_APP_ID,
      app_secret: CONFIG.LARK_APP_SECRET,
    });

    return response.data?.tenant_access_token || null;
  } catch (error) {
    console.error('Larkトークン取得エラー:', error);
    return null;
  }
}

/**
 * Lark にメッセージを送信
 */
export async function sendLarkMessage(chatId: string, message: string): Promise<void> {
  try {
    console.log(`Larkメッセージ送信開始: chat_id=${chatId}`);
    const token = await getLarkToken();
    if (!token) throw new Error('Larkトークン取得に失敗');

    await axios.post(
      `${CONFIG.LARK_MESSAGE_URL}?receive_id_type=chat_id`,
      {
        receive_id: chatId,
        msg_type: 'text',
        content: JSON.stringify({ text: message + '\n\n' + 'このメッセージはAIが生成したものです。'}),
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error('Larkメッセージ送信エラー:', error);
  }
}
