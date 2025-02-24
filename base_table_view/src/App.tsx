import React from 'react';
import { useAsync } from 'react-async-hook';
import { Table, LocaleProvider } from '@douyinfe/semi-ui';
import jaJP from '@douyinfe/semi-ui/lib/es/locale/source/ja_JP';
import { getTableData } from './utils';

/**
 * メインアプリケーションコンポーネント
 * Bitableのデータをテーブル形式で表示します
 */
export const App = () => {
  // Bitableからデータを非同期で取得
  const response = useAsync(getTableData, []);
  console.log('response:', response);

  // データが取得できていない場合は空を表示
  if (!response.result) return <></>;

  // 取得したデータを分割代入
  const {
    result: { columns, dataSource },
  } = response;

  // Semi UIのTableコンポーネントでデータを表示
  return (
    <LocaleProvider locale={jaJP}>
      <div style={{ position: 'relative' }}>
        <Table 
          columns={columns} 
          dataSource={dataSource}
          size="middle"
          bordered={true}
          sticky={true}
          style={{ 
            backgroundColor: '#fff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            width: 'auto'
          }}
          onRow={(record, index) => ({
            style: {
              backgroundColor: index! % 2 === 1 ? '#E3F2FD' : '#fff',
              transition: 'all 0.3s ease'
            }
          })}
          pagination={{
            pageSize: 50,
            showTotal: true,
            showSizeChanger: true,
            pageSizeOpts: [10, 20, 40, 50, 100],
            showQuickJumper: true,
          }}
        />
        <style>
          {`
            .semi-table-thead > tr > th {
              background-color: #8C9DB5 !important;
              color: white !important;
              position: sticky;
              top: 0;
              z-index: 100;
            }
            .semi-table-row {
              position: relative;
              z-index: 1;
            }
            .semi-table-row:hover {
              background-color: #f0f0f0 !important;
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
              z-index: 2;
            }
          `}
        </style>
      </div>
    </LocaleProvider>
  );
};
