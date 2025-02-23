import {
  bitable,
  IOpenCellValue,
  ViewType,
} from '@lark-opdev/block-bitable-api';
import { getRenderFunc } from './render_helper';

/**
 * Bitableからテーブルデータを取得する関数
 * @returns {Promise<{table: any, columns: any[], dataSource: any[]}>} テーブル情報、列設定、データソース
 */
export const getTableData = async () => {
  // 現在選択中のテーブルIDを取得
  const selection = await bitable.base.getSelection();
  // テーブル一覧を取得
  const tableList = await bitable.base.getTableList();

  if (!selection.tableId) return null;

  // テーブルインスタンスを取得
  const table = await bitable.base.getTableById(selection.tableId);

  // ビュー一覧を取得し、最初のグリッドビューを選択
  const views = await table.getViewMetaList();
  const GridViewMeta = views.find((view) => view.type === ViewType.Grid);
  const view = await table.getViewById(GridViewMeta!.id);

  // 表示可能なレコードIDとフィールド情報を取得
  const records = await view.getVisibleRecordIdList();
  const fieldMetas = await view.getFieldMetaList();

  // 各セルの値を取得
  const recordValues = await Promise.all(
    records.filter(Boolean).map(async (recordId) => {
      if (!recordId) return;
      const recordValue: Record<string, IOpenCellValue> = {};
      await Promise.all(
        fieldMetas.map(async (fieldMeta) => {
          const cellValue = await table.getCellValue(fieldMeta.id, recordId);
          recordValue[fieldMeta.id] = cellValue;
          return cellValue;
        })
      );
      recordValue['recordId'] = recordId;
      return recordValue;
    })
  );

  // テーブルのカラム設定を生成
  const columns = fieldMetas.map((meta) => {
    return {
      title: meta.name,
      dataIndex: meta.id,
      // セル値のレンダリング関数を取得
      render: getRenderFunc({ meta, table }),
    };
  });

  // テーブルのデータソースを生成
  const dataSource = recordValues.filter(Boolean) as Record<
    string,
    IOpenCellValue
  >[];

  // テーブル情報、カラム設定、データソースを返却
  return {
    table,
    columns,
    dataSource,
  };
};
