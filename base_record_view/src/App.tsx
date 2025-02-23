import { bitable } from "@lark-opdev/block-bitable-api";
import { FC, useEffect } from "react";
import { useAsync } from "react-async-hook";
import { getCurrentTask, setCompleted } from "./utils";
import {
  Typography,
  Tag,
  Button,
  Divider,
  Space,
  Toast,
} from "@douyinfe/semi-ui";

const { Title, Text } = Typography;

/**
 * デフォルトのタスク状態
 * タスクデータ取得前や取得失敗時に使用される
 */
const defaultTask = {
  description: "",
  userName: "",
  completed: false,
};

/**
 * メインアプリケーションコンポーネント
 * タスクの取得、状態管理、UIの表示を担当
 */
export const App = () => {
  // タスク情報を非同期で取得
  const task = useAsync(getCurrentTask, []);
  const { description, userName, completed } = task.result ?? defaultTask;

  // レコード選択変更時のイベントハンドラを設定
  useEffect(() => {
    return bitable.base.onSelectionChange(({ data }) =>
      task.execute()
    );
  }, []);

  /**
   * タスクの完了状態を切り替える
   * 成功/失敗時にトースト通知を表示
   */
  const toggleCompleted = () => {
    setCompleted(!completed)
      .then(() => task.execute())
      .then(() => Toast.success("タスクの状態を更新しました"))
      .catch(() => Toast.error("タスクの状態更新に失敗しました"));
  };

  // ローディング中の表示
  if (task.loading) return <div>読み込み中...</div>;
  // エラー時の表示
  if (task.error) return <div>エラー: {task.error.message}</div>;

  return (
    <PureTaskComponment
      description={description}
      userName={userName}
      completed={completed}
      toggleCompleted={toggleCompleted}
    />
  );
};

/**
 * タスク表示コンポーネントのプロパティ定義
 */
interface PureTaskComponmentProps {
  description: string;  // タスクの説明
  userName: string;     // 担当者名
  completed: boolean;   // 完了状態
  toggleCompleted: () => void;  // 完了状態切り替え関数
}

/**
 * タスク表示用の純粋コンポーネント
 * タスクの詳細情報と操作UIを表示
 */
const PureTaskComponment: FC<PureTaskComponmentProps> = ({
  description,
  userName,
  completed,
  toggleCompleted,
}) => {
  return (
    <Space vertical align="start">
      <div>
        <Title heading={2}>タスク管理アプリ</Title>
      </div>
      <div>
        <Text>説明：</Text>
        <Text>{description}</Text>
      </div>
      <div>
        <Text>担当者：</Text>
        <Text>{userName}</Text>
      </div>
      <div>
        <Text>完了状態：</Text>
        <Tag color={completed ? "green" : "blue"}>
          {completed ? "完了" : "未完了"}
        </Tag>
      </div>
      <Divider />
      <div>
        <Button
          type={completed ? "danger" : "primary"}
          onClick={toggleCompleted}
        >
          {completed ? "タスクを未完了に戻す" : "タスクを完了にする"}
        </Button>
      </div>
    </Space>
  );
};
