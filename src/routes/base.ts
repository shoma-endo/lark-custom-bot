import { Router } from 'express';
import { getBitableTables, getBitableRecords } from '../lark/base';

const router = Router();

/**
 * テーブル一覧を取得
 */
router.get('/tables', async (req, res) => {
  try {
    const tables = await getBitableTables();
    res.json({ success: true, data: tables });
  } catch (error) {
    console.error('テーブル一覧取得エラー:', error);
    res.status(500).json({ 
      success: false, 
      error: 'テーブル一覧の取得に失敗しました',
      details: error instanceof Error ? error.message : '不明なエラー'
    });
  }
});

/**
 * 指定されたテーブルのレコード一覧を取得
 */
router.get('/tables/:tableId/records', async (req, res) => {
  try {
    const { tableId } = req.params;
    const records = await getBitableRecords(tableId);
    res.json({ success: true, data: records });
  } catch (error) {
    console.error('レコード一覧取得エラー:', error);
    res.status(500).json({ 
      success: false, 
      error: 'レコード一覧の取得に失敗しました',
      details: error instanceof Error ? error.message : '不明なエラー'
    });
  }
});

export default router; 