import { bitable, FieldType, IOpenCellValue } from "@lark-opdev/block-bitable-api";
import { FC, useEffect, useState } from "react";
import { useAsync } from "react-async-hook";
import { getCurrentRecord } from "./utils";
import {
  Typography,
  Card,
  Button,
  Divider,
  Space,
  Toast,
  Tabs,
  TabPane,
  List,
  Avatar,
  Tag,
  Descriptions,
  Spin,
} from "@douyinfe/semi-ui";
import { IconEdit, IconHistory, IconLink, IconSetting } from '@douyinfe/semi-icons';

const { Title, Text } = Typography;

interface FieldValue {
  id: string;
  name: string;
  type: FieldType;
  value: IOpenCellValue;
}

/**
 * メインアプリケーションコンポーネント
 * レコードの表示と編集を担当
 */
export const App = () => {
  // レコード情報を非同期で取得
  const record = useAsync(getCurrentRecord, []);
  const [activeTab, setActiveTab] = useState('details');
  const [isEditing, setIsEditing] = useState(false);

  // レコード選択変更時のイベントハンドラを設定
  useEffect(() => {
    return bitable.base.onSelectionChange(({ data }) => {
      record.execute();
      setIsEditing(false);
    });
  }, []);

  // ローディング中の表示
  if (record.loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Spin size="large" />
    </div>
  );

  // エラー時の表示
  if (record.error) return (
    <Card style={{ margin: '16px' }}>
      <div style={{ textAlign: 'center', color: 'var(--semi-color-danger)' }}>
        <Text>エラー: {record.error.message}</Text>
      </div>
    </Card>
  );

  // データが取得できていない場合
  if (!record.result) return <></>;

  const { fields, recordId } = record.result;

  return (
    <div style={{ padding: '16px' }}>
      {/* ヘッダー部分 */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <Title heading={4}>レコード詳細</Title>
            <Tag>ID: {recordId}</Tag>
          </Space>
          <Space>
            <Button icon={<IconEdit />} onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? '編集を完了' : '編集'}
            </Button>
            <Button icon={<IconSetting />} type="tertiary">設定</Button>
          </Space>
        </div>
      </Card>

      {/* メインコンテンツ */}
      <Card style={{ marginTop: '16px' }}>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          {/* 詳細タブ */}
          <TabPane tab="詳細" itemKey="details">
            <Descriptions align="left" size="small" row>
              {fields.map((field: FieldValue) => (
                <Descriptions.Item itemKey={field.name} key={field.id}>
                  {renderFieldValue(field, isEditing)}
                </Descriptions.Item>
              ))}
            </Descriptions>
          </TabPane>

          {/* 履歴タブ */}
          <TabPane tab="履歴" itemKey="history" icon={<IconHistory />}>
            <List
              dataSource={[
                { time: '2024-02-23 15:30', user: 'User A', action: 'フィールドを更新' },
                { time: '2024-02-23 14:20', user: 'User B', action: 'レコードを作成' },
              ]}
              renderItem={item => (
                <List.Item>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar size="small" style={{ marginRight: '8px' }}>{item.user[0]}</Avatar>
                    <div>
                      <div>{item.action}</div>
                      <div style={{ fontSize: '12px', color: 'var(--semi-color-text-2)' }}>{item.time}</div>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </TabPane>

          {/* 関連レコードタブ */}
          <TabPane tab="関連レコード" itemKey="related" icon={<IconLink />}>
            <List
              dataSource={[
                { title: '関連タスク #1', table: 'タスク管理' },
                { title: '関連文書 #2', table: 'ドキュメント管理' },
              ]}
              renderItem={item => (
                <List.Item>
                  <div>
                    <div>{item.title}</div>
                    <Tag size="small" style={{ marginTop: '4px' }}>{item.table}</Tag>
                  </div>
                </List.Item>
              )}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* アクションパネル */}
      <Card style={{ marginTop: '16px' }}>
        <Space>
          <Button type="primary">保存</Button>
          <Button type="secondary">複製</Button>
          <Button type="danger">削除</Button>
        </Space>
      </Card>
    </div>
  );
};

/**
 * フィールド値のレンダリング
 * @param field フィールド情報
 * @param isEditing 編集モードかどうか
 */
function renderFieldValue(field: FieldValue, isEditing: boolean) {
  // フィールドタイプに応じたレンダリングロジックをここに実装
  return <Text>{String(field.value)}</Text>;
}
