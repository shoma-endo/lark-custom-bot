import {
  IOpenCheckbox,
  IOpenSegment,
  IOpenUser,
  bitable
} from "@lark-opdev/block-bitable-api";

/**
 * テンプレートから作成されたマルチディメンショナルテーブル
 * フィールドIDはテンプレートと一致することが保証されています
 */

/** タスク説明フィールドID */
const descriptionFieldId = "fldaxqIJ1m";

/** タスク担当者フィールド名 */
const userFieldName = "任务执行人";

/** 完了フラグフィールドID */
const completedFieldId = "fld9cvGzic";

/** TODO: 期限超過フラグフィールドIDの実装 */
// const exceedingFieldId = "todo"

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
 * 現在選択されているタスクの情報を取得する
 * @returns タスク情報（説明、担当者名、完了状態）
 * @throws 選択状態の取得に失敗した場合
 */
export async function getCurrentTask() {
  // 1. 選択されているテーブルとレコードを取得
  const { tableId, recordId } = await bitable.base.getSelection();
  if (!tableId || !recordId) throw new Error("選択状態の取得に失敗しました");
  const table = await bitable.base.getTableById(tableId);

  // 2. 各フィールドの値を取得
  const completedValue = (await table.getCellValue(
    completedFieldId,
    recordId
  )) as IOpenCheckbox;
  const userField = await table.getFieldByName(userFieldName);
  const userValue = (await table.getCellValue(
    userField.id,
    recordId
  )) as IOpenUser[];
  const descriptionValue = (await table.getCellValue(
    descriptionFieldId,
    recordId
  )) as IOpenSegment[];

  // TODO: 期限超過フラグの取得処理
  // 単一選択の値型は IOpenSingleSelect
  // const exceedingValue = (await table.getCellValue(exceedingFieldId, recordId)) as IOpenSingleSelect;

  // TODO: exceedingValue を選択されたオプションの文字列に変換
  // const exceedingText = doYourCustomTransform(exceedingValue)

  // 3. セル構造をビジネスロジック用のデータに変換
  return {
    description: getDescription(descriptionValue),
    userName: getUserName(userValue),
    completed: completedValue,
    // TODO: 期限超過情報の返却
    // exceeding: exceedingText
  };
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

  // 2. ビジネスデータをセル構造に変換して書き込み
  table.setCellValue(completedFieldId, recordId, completed as IOpenCheckbox);
}
