import { Request, Response } from 'express';
import { sendLarkMessage } from './lark/sendMessage';
import { getOpenAIResponse } from './openai';
import { getBitableTables, formatTableList, getBitableRecords, formatRecordList } from './lark/base';
import { LarkEvent, LarkMessageContent } from './types';

// メッセージの重複チェック用のメモリキャッシュ
const messageCache = new Map<string, number>();
const MESSAGE_TIMEOUT = 60000; // 1分以内の同一メッセージを無視

/**
 * メッセージの重複をチェック
 */
function isDuplicateMessage(messageId: string): boolean {
  const now = Date.now();
  const lastProcessed = messageCache.get(messageId);

  // キャッシュのクリーンアップ（5秒以上経過したメッセージを削除）
  for (const [id, timestamp] of messageCache.entries()) {
    if (now - timestamp > MESSAGE_TIMEOUT) {
      messageCache.delete(id);
    }
  }

  if (lastProcessed && now - lastProcessed < MESSAGE_TIMEOUT) {
    return true;
  }

  messageCache.set(messageId, now);
  return false;
}

export async function webhookHandler(req: Request, res: Response) {
  try {
    const requestData: LarkEvent = req.body;
    
    if (requestData.challenge) {
      return res.json({ challenge: requestData.challenge });
    }

    const message = requestData.event?.message;
    if (!message) {
      return res.status(400).json({ error: 'メッセージデータなし' });
    }

    const chatId = message.chat_id;
    const messageId = message.message_id;

    // メモリ上での重複チェック
    if (isDuplicateMessage(messageId)) {
      console.log(`重複メッセージをスキップ: ${messageId}`);
      return res.json({ message: '重複メッセージ' });
    }

    const messageContent: LarkMessageContent = JSON.parse(message.content || '{}');
    const userMessage = messageContent.text?.trim() || '';

    if (!userMessage) {
      return res.status(400).json({ error: 'メッセージが空です' });
    }

    let responseText = '';

    // コマンドの処理
    if (userMessage === '/tables' || userMessage === 'テーブル一覧') {
      try {
        const tables = await getBitableTables();
        responseText = formatTableList(tables);
      } catch (error) {
        console.error('テーブル一覧取得エラー:', error);
        responseText = 'テーブル一覧の取得に失敗しました。';
      }
    } else if (userMessage.startsWith('/records ') || userMessage.startsWith('レコード一覧 ')) {
      try {
        const tableId = userMessage.split(' ')[1];
        if (!tableId) {
          responseText = 'テーブルIDを指定してください。\n例: レコード一覧 tbl3j90PZ5zu4HgG';
        } else {
          const records = await getBitableRecords(tableId);

          responseText = formatRecordList(records);
        }
      } catch (error) {
        console.error('レコード一覧取得エラー:', error);
        responseText = 'レコード一覧の取得に失敗しました。';
      }
    } else {
      // 通常のメッセージ処理
      responseText = await getOpenAIResponse(userMessage);
    }

    await sendLarkMessage(chatId, responseText);
    res.json({ message: '成功' });
  } catch (error) {
    console.error('Webhookエラー:', error);
    res.status(500).json({ error: 'サーバーエラー' });
  }
}
