import {
  IOpenCheckbox,
  IOpenSegment,
  IOpenUser,
  bitable,
  FieldType,
  IWidgetTable,
  IFieldMeta,
} from "@lark-opdev/block-bitable-api";

/**
 * テンプレートから作成されたマルチディメンショナルテーブル
 * フィールドIDはテンプレートと一致することが保証されています
 */

/**
 * フィールド情報を取得する
 * @param table テーブルインスタンス
 * @returns フィールド情報の配列
 */
async function getFieldMetaList(table: IWidgetTable) {
  const fields = await table.getFieldMetaList();
  return fields.map(field => ({
    id: field.id,
    name: field.name,
    type: field.type,
  }));
}

/**
 * フィールド値を取得する
 * @param table テーブルインスタンス
 * @param fieldId フィールドID
 * @param recordId レコードID
 * @returns フィールド値
 */
async function getFieldValue(table: IWidgetTable, fieldId: string, recordId: string) {
  const value = await table.getCellValue(fieldId, recordId);
  return value;
}

/**
 * ユーザー情報から表示名を取得する
 * @param userValue ユーザー情報の配列
 * @returns ユーザー名または未設定メッセージ
 */
function getUserName(userValue: IOpenUser[] | null) {
  if (!userValue || userValue.length === 0) {
    return "任務担当者が設定されていません";
  }
  return userValue[0].name ?? "ユーザー名が設定されていません";
}

/**
 * タスク説明テキストを取得する
 * @param descriptionValue 説明テキストセグメントの配列
 * @returns 結合された説明テキストまたは未設定メッセージ
 */
function getDescription(descriptionValue: IOpenSegment[] | null) {
  if (!descriptionValue || descriptionValue.length === 0) {
    return "タスク説明が設定されていません";
  }
  return descriptionValue.map((segment) => segment.text).join("");
}

/**
 * 現在選択されているレコードの情報を取得する
 * @returns レコード情報
 * @throws 選択状態の取得に失敗した場合
 */
export async function getCurrentRecord() {
  // 1. 選択されているテーブルとレコードを取得
  const { tableId, recordId } = await bitable.base.getSelection();
  if (!tableId || !recordId) throw new Error("選択状態の取得に失敗しました");
  
  const table = await bitable.base.getTableById(tableId);

  // 2. フィールド情報を取得
  const fieldMetas = await getFieldMetaList(table);

  // 3. 各フィールドの値を取得
  const fields = await Promise.all(
    fieldMetas.map(async (field) => ({
      ...field,
      value: await getFieldValue(table, field.id, recordId)
    }))
  );

  // 4. レコード情報を返却
  return {
    recordId,
    fields,
    table // テーブルインスタンスも返却（編集時に使用）
  };
}

/**
 * フィールド値を更新する
 * @param table テーブルインスタンス
 * @param fieldId フィールドID
 * @param recordId レコードID
 * @param value 新しい値
 */
export async function updateFieldValue(
  table: IWidgetTable,
  fieldId: string,
  recordId: string,
  value: any
) {
  await table.setCellValue(fieldId, recordId, value);
}

/**
 * タスクの完了状態を更新する
 * @param completed 新しい完了状態
 * @throws 選択状態の取得に失敗した場合
 */
export async function setCompleted(completed: boolean) {
  // 1. 選択されているテーブルとレコードを取得
  const { tableId, recordId } = await bitable.base.getSelection();
  if (!tableId || !recordId) throw new Error("選択状態の取得に失敗しました");
  const table = await bitable.base.getTableById(tableId);

  // フィールド情報を動的に取得
  const fields = await getFieldMetaList(table);

  // 2. ビジネスデータをセル構造に変換して書き込み
  for (const field of fields) {
    if (field.type === FieldType.Checkbox) {
      await table.setCellValue(field.id, recordId, completed as IOpenCheckbox);
    }
  }
}
