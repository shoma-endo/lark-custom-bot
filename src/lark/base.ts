import axios from 'axios';
import { CONFIG } from '../config';

interface LarkResponse<T> {
  code: number;
  msg: string;
  data: T;
}

interface TableInfo {
  table_id: string;
  name: string;
}

interface TablesResponse {
  items: TableInfo[];
}

interface RecordInfo {
  record_id: string;
  fields: { [key: string]: any };
}

interface RecordsResponse {
  has_more: boolean;
  items: RecordInfo[];
  total: number;
}

/**
 * Larkのアクセストークンを取得
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
 * Bitableのテーブル一覧を取得
 */
export async function getBitableTables(): Promise<TableInfo[]> {
  try {
    const token = await getLarkToken();
    if (!token) throw new Error('トークンの取得に失敗しました');

    if (!CONFIG.BITABLE_APP_TOKEN) {
      throw new Error('Bitable App Tokenが設定されていません');
    }

    const response = await axios.get<LarkResponse<TablesResponse>>(
      `${CONFIG.LARK_BITABLE_BASE_URL}/apps/${CONFIG.BITABLE_APP_TOKEN}/tables`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.code !== 0) {
      throw new Error(`APIエラー: ${response.data.msg}`);
    }

    return response.data.data.items;
  } catch (error) {
    console.error('Bitable一覧取得エラー:', error);
    throw error;
  }
}

/**
 * テーブル一覧をメッセージ形式に変換
 */
export function formatTableList(items: TableInfo[]): string {
  if (items.length === 0) {
    return 'テーブルが見つかりませんでした。';
  }

  const tableList = items
    .map(item => `📊 ${item.name}\nID: ${item.table_id}`)
    .join('\n\n');

  return `【Bitableテーブル一覧】\n\n${tableList}`;
}

/**
 * Bitableのレコード一覧を取得
 */
export async function getBitableRecords(tableId: string): Promise<RecordInfo[]> {
  try {
    const token = await getLarkToken();
    if (!token) throw new Error('トークンの取得に失敗しました');

    if (!CONFIG.BITABLE_APP_TOKEN) {
      throw new Error('Bitable App Tokenが設定されていません');
    }

    const response = await axios.get<LarkResponse<RecordsResponse>>(
      `${CONFIG.LARK_BITABLE_BASE_URL}/apps/${CONFIG.BITABLE_APP_TOKEN}/tables/${tableId}/records`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.code !== 0) {
      throw new Error(`APIエラー: ${response.data.msg}`);
    }
    console.log('records response', response);

    return response.data.data.items;
  } catch (error) {
    console.error('Bitableレコード一覧取得エラー:', error);
    throw error;
  }
}

/**
 * レコード一覧をメッセージ形式に変換
 */
export function formatRecordList(records: RecordInfo[]): string {
  if (records.length === 0) {
    return 'レコードが見つかりませんでした。';
  }

  const recordList = records
    .map(record => {
      const fields = Object.entries(record.fields)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');
      return `📝 レコードID: ${record.record_id}\n${fields}`;
    })
    .join('\n\n');

  return `【Bitableレコード一覧】\n\n${recordList}`;
}
