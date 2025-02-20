import { Storage } from '@google-cloud/storage';
import { CONFIG } from './config';

const storage = new Storage();
const bucket = storage.bucket(CONFIG.BUCKET_NAME);

/**
 * GCS から処理済みメッセージIDリストを取得
 */
export async function loadProcessedMessages(): Promise<Set<string>> {
  try {
    const file = bucket.file('processed_messages.json');
    const [exists] = await file.exists();

    if (!exists) return new Set();

    const [data] = await file.download();
    return new Set(JSON.parse(data.toString()));
  } catch (error) {
    console.error('処理済みメッセージの読み込みエラー:', error);
    return new Set();
  }
}

/**
 * GCS に処理済みメッセージIDリストを保存
 */
export async function saveProcessedMessages(processedMessages: Set<string>): Promise<void> {
  try {
    const file = bucket.file('processed_messages.json');
    await file.save(JSON.stringify([...processedMessages]), {
      contentType: 'application/json',
    });
  } catch (error) {
    console.error('処理済みメッセージの保存エラー:', error);
  }
}
