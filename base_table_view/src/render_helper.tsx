import React from 'react';
import {
  AvatarGroup,
  Avatar,
  Typography,
  Checkbox,
  Select,
  DatePicker,
} from '@douyinfe/semi-ui';
import {
  FieldType,
  ISelectFieldMeta,
  IOpenSegment,
  IOpenUser,
  IOpenSegmentType,
  IOpenMultiSelect,
  IWidgetTable,
  IFieldMeta,
  IOpenSingleSelect,
  ISelectFieldOption,
} from '@lark-opdev/block-bitable-api';
const { Text } = Typography;
const colors = [
  'amber',
  'blue',
  'cyan',
  'green',
  'grey',
  'indigo',
  'light-blue',
  'light-green',
  'lime',
  'orange',
  'pink',
  'purple',
  'red',
  'teal',
  'violet',
  'yellow',
];

/**
 * レンダリング関数のコンテキストインターフェース
 */
interface IRenderFuncContext {
  table: IWidgetTable;  // テーブルインスタンス
  meta: IFieldMeta;     // フィールドのメタ情報
}

/**
 * 名前から一意の色を生成するヘルパー関数
 * @param name 名前
 * @returns 色名
 */
function colorHelper(name?: string) {
  return colors[(name?.codePointAt(0) || 0) % colors.length];
}

/**
 * テキストタイプのレンダリング関数
 * URLの場合はリンクとして表示
 */
function renderSegment(context: IRenderFuncContext) {
  return (segs: IOpenSegment[]) => {
    return (
      <>
        {(segs || []).map((segs) => (
          <Text
            link={
              segs.type === IOpenSegmentType.Url
                ? { href: segs.link, target: '_blank' }
                : void 0
            }
          >
            {segs.text}
          </Text>
        ))}
      </>
    );
  };
}

/**
 * ユーザーフィールドのレンダリング関数
 * アバターグループとして表示
 */
function renderUser(context: IRenderFuncContext) {
  return (users: IOpenUser[]) => {
    return (
      <AvatarGroup size="small">
        {(users || []).map((user) => (
          <Avatar alt={user.name} color={colorHelper(user.name) as any}>
            {user.name}
          </Avatar>
        ))}
      </AvatarGroup>
    );
  };
}

/**
 * チェックボックスのレンダリング関数
 * 値の変更時にBitableに反映
 */
function renderCheckBox(context: IRenderFuncContext) {
  return (checked: boolean, record: { recordId: string }) => {
    return (
      <Checkbox
        defaultChecked={!!checked}
        onChange={(checked) => {
          if (!record || !record.recordId) return;
          // Bitableのセル値を更新
          context.table.setCellValue(
            context.meta.id,
            record.recordId,
            !!checked.target.checked
          );
        }}
      ></Checkbox>
    );
  };
}

/**
 * 単一選択/複数選択フィールドのレンダリング関数
 * セレクトボックスとして表示
 */
function renderOption(context: IRenderFuncContext) {
  const { table, meta } = context;
  const {
    id,
    type,
    property: { options },
  } = meta as ISelectFieldMeta;
  const optionMap = new Map<string, ISelectFieldOption>();
  options.forEach((option) => optionMap.set(option.id, option));
  return (
    option: IOpenMultiSelect | IOpenSingleSelect,
    record: { recordId: string }
  ) => {
    const multiple = FieldType.MultiSelect === type;
    option = option
      ? ((Array.isArray(option) ? option : [option]) as IOpenMultiSelect)
      : [];
    return (
      <>
        <Select
          style={{ width: '150px' }}
          multiple={multiple}
          defaultValue={option.map((op) => (multiple ? op.id : op.text))}
          onChange={(value) => {
            value = Array.isArray(value) ? value : [value];
            const cellValues = (value as string[])
              .map((id) => optionMap.get(id)!)
              .map((option) => ({
                id: option.id,
                text: option.name,
              }));

            table.setCellValue<IOpenSingleSelect | IOpenMultiSelect>(
              id,
              record.recordId,
              multiple ? cellValues : cellValues[0]
            );
          }}
        >
          {options.map((option) => (
            <Select.Option value={option.id}>{option.name}</Select.Option>
          ))}
        </Select>
      </>
    );
  };
}

/**
 * 日付フィールドのレンダリング関数
 * DatePickerとして表示
 */
function renderDate(context: IRenderFuncContext) {
  return (time: number, record: { recordId: string }) => {
    return (
      <DatePicker
        defaultValue={time}
        disabled={context.meta.type !== FieldType.DateTime}
        onChange={(date) => {
          const dateString = date?.toLocaleString() || '';
          if (!dateString) return;
          const time = new Date(dateString).getTime();

          context.table.setCellValue(context.meta.id, record.recordId, time);
        }}
      />
    );
  };
}

/**
 * フィールドタイプごとのレンダリング関数マップ
 */
const RenderFuncMap: Partial<
  Record<
    FieldType,
    (context: IRenderFuncContext) => (...args: any[]) => React.ReactNode
  >
> = {
  [FieldType.User]: renderUser,
  [FieldType.CreatedUser]: renderUser,
  [FieldType.ModifiedUser]: renderUser,
  [FieldType.Text]: renderSegment,
  [FieldType.Url]: renderSegment,
  [FieldType.Checkbox]: renderCheckBox,
  [FieldType.SingleSelect]: renderOption,
  [FieldType.MultiSelect]: renderOption,
  [FieldType.DateTime]: renderDate,
  [FieldType.CreatedTime]: renderDate,
  [FieldType.ModifiedTime]: renderDate,
};

/**
 * デフォルトのレンダリング関数
 * 値を適切な形式で表示
 */
const renderDefault =
  () =>
  (...args: unknown[]) => {
    const value = args[0];
    if (value === null || value === undefined) {
      return <></>;
    }
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return <>{String(value)}</>;
    }
    if (Array.isArray(value)) {
      return <>{value.map(v => String(v)).join(', ')}</>;
    }
    if (typeof value === 'object') {
      // オブジェクトの場合は適切なプロパティを表示
      const obj = value as any;
      if (obj.text) return <>{obj.text}</>;
      if (obj.name) return <>{obj.name}</>;
      if (obj.id) return <>{obj.id}</>;
      if (obj.url) return <>{obj.url}</>;
      // PDFファイルの場合はファイル名を表示
      if (obj.type === 'application/pdf') {
        return <>{obj.token}</>;
      }
      // 数式の場合は数式を表示
      if (obj.type === 'text') {
        return <>{obj.text}</>;
      }
      return <>{JSON.stringify(value)}</>;
    }
    return <>{String(value)}</>;
  };

/**
 * フィールドタイプに応じたレンダリング関数を取得
 * @param context レンダリングコンテキスト
 * @returns レンダリング関数
 */
export function getRenderFunc(context: IRenderFuncContext) {
  const { meta } = context;
  const render = RenderFuncMap[meta.type] || renderDefault;
  return render(context) as (...args: any[]) => React.ReactNode;
}
