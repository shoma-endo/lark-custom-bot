import React from 'react';
import { useAsync } from 'react-async-hook';
import { Table } from '@douyinfe/semi-ui';
import { getTableData } from './utils';

/**
 * メインアプリケーションコンポーネント
 * Bitableのデータをテーブル形式で表示します
 */
export const App = () => {
  // Bitableからデータを非同期で取得
  const response = useAsync(getTableData, []);
  console.log('response：', response);

  // データが取得できていない場合は空を表示
  if (!response.result) return <></>;

  // 取得したデータを分割代入
  const {
    result: { columns, dataSource },
  } = response;

  // Semi UIのTableコンポーネントでデータを表示
  return <Table columns={columns} dataSource={dataSource} />;
};
