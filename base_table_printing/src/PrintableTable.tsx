import React, { useRef, useCallback } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Table, Typography, Button } from '@douyinfe/semi-ui';
import { IWidgetTable } from '@lark-opdev/block-bitable-api';
import { PrintSettings } from './PrintControls';
import './PrintStyles.css';

const { Text, Title } = Typography;

interface PrintableTableProps {
  columns: any[];
  dataSource: any[];
  printSettings: PrintSettings;
  table?: IWidgetTable;
}

export const PrintableTable: React.FC<PrintableTableProps> = ({
  columns,
  dataSource,
  printSettings,
  table
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  
  // 印刷ハンドラー
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    pageStyle: `
      @page {
        size: ${printSettings.pageSize} ${printSettings.orientation};
        margin: ${printSettings.margins.top}mm ${printSettings.margins.right}mm ${printSettings.margins.bottom}mm ${printSettings.margins.left}mm;
        scale: ${printSettings.scaling / 100};
      }
    `,
    onBeforeGetContent: () => {
      // 印刷前の処理
      console.log('印刷を準備中...');
    },
    onAfterPrint: () => {
      // 印刷後の処理
      console.log('印刷が完了しました');
    }
  });

  // 印刷ボタンクリックハンドラー
  const onPrintButtonClick = useCallback(() => {
    if (printRef.current) {
      handlePrint();
    }
  }, [handlePrint]);

  // 列の最適化処理
  const optimizedColumns = columns.map(column => ({
    ...column,
    className: 'printable-cell',
    // 印刷用にレンダラーをラップして最適化
    render: column.render ? 
      (...args: any[]) => <div className="print-cell-content">{column.render(...args)}</div> :
      undefined
  }));

  // データソースが非常に大きい場合は分割（例：100行ごと）
  const paginateData = (data: any[], rowsPerPage = 100) => {
    const pages = [];
    for (let i = 0; i < data.length; i += rowsPerPage) {
      pages.push(data.slice(i, i + rowsPerPage));
    }
    return pages;
  };

  // データの分割（データ量が多い場合）
  const paginatedData = paginateData(dataSource);
  const hasMultiplePages = paginatedData.length > 1;

  return (
    <div>
      <div className="print-button-container">
        <Button type="primary" onClick={onPrintButtonClick} className="print-button">
          印刷する
        </Button>
      </div>
      
      <div ref={printRef} className={`printable-content ${printSettings.orientation}`}>
        {/* ヘッダー */}
        {printSettings.includeHeader && (
          <div className="print-header">
            <Title heading={4}>Lark Bitable データ印刷</Title>
            <Text>印刷日時: {new Date().toLocaleString('ja-JP')}</Text>
          </div>
        )}
        
        {/* テーブル本体 */}
        <div className="print-table-container">
          {hasMultiplePages ? (
            // 複数ページの場合
            paginatedData.map((pageData, index) => (
              <div key={index} className="table-page">
                {index > 0 && <div className="page-break"></div>}
                {index > 0 && printSettings.includeHeader && (
                  <div className="page-header">
                    <Text>ページ {index + 1} / {paginatedData.length}</Text>
                  </div>
                )}
                <Table
                  columns={optimizedColumns}
                  dataSource={pageData}
                  pagination={false}
                  className="printable-table"
                  size="small"
                  bordered
                />
              </div>
            ))
          ) : (
            // 単一ページの場合
            <Table
              columns={optimizedColumns}
              dataSource={dataSource}
              pagination={false}
              className="printable-table"
              size="small"
              bordered
            />
          )}
        </div>
        
        {/* フッター */}
        {printSettings.includeFooter && (
          <div className="print-footer">
            <div className="page-number">ページ: <span className="page-counter"></span></div>
          </div>
        )}
      </div>
    </div>
  );
}; 