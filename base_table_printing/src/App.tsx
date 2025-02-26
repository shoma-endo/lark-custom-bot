import React, { useState, useRef } from 'react';
import { useAsync } from 'react-async-hook';
import { Table, Button, Divider, Toast } from '@douyinfe/semi-ui';
import { getTableData } from './utils';
import { PrintableTable } from './PrintableTable';
import { PrintControls, PrintSettings } from './PrintControls';
import './PrintStyles.css';

// デフォルトの印刷設定
const defaultPrintSettings: PrintSettings = {
  pageSize: 'A4',
  orientation: 'landscape',
  margins: { top: 10, right: 10, bottom: 10, left: 10 },
  includeHeader: true,
  includeFooter: true,
  scaling: 100
};

export const App = () => {
  // Bitableデータ取得
  const response = useAsync(getTableData, []);
  // 印刷設定の状態
  const [printSettings, setPrintSettings] = useState<PrintSettings>(defaultPrintSettings);
  // 印刷モード（プレビューを表示するかどうか）
  const [printMode, setPrintMode] = useState(false);
  // PrintableTableのリファレンス
  const printableTableRef = useRef<HTMLDivElement>(null);

  // 印刷モード切り替え
  const togglePrintMode = () => {
    setPrintMode(!printMode);
    if (!printMode) {
      Toast.info('印刷モードに切り替えました。設定を確認して印刷してください。');
    }
  };

  // 印刷実行ハンドラー - PrintableTableの印刷ボタンまでスクロール
  const handlePrint = () => {
    if (printableTableRef.current) {
      // PrintableTableの印刷ボタンまでスクロール
      printableTableRef.current.scrollIntoView({ behavior: 'smooth' });
      // スクロール後に注意を表示
      Toast.info('下の「印刷する」ボタンをクリックしてください');
    }
  };

  // データが読み込まれていない場合は空を表示
  if (!response.result) return <></>;

  // データが読み込まれている場合の処理
  const { columns, dataSource, table } = response.result;
  
  // 印刷用に最適化された列定義
  const optimizedPrintColumns = columns.map(column => ({
    ...column,
    // 表示幅を最適化
    width: undefined,
  }));

  return (
    <div className="app-container">
      {!printMode ? (
        <>
          {/* 通常表示モード */}
          <div className="table-container">
            <Button type="primary" onClick={togglePrintMode} style={{ margin: '12px 0' }}>
              印刷モードへ
            </Button>
            <Divider />
            <Table columns={columns} dataSource={dataSource} />
          </div>
        </>
      ) : (
        <>
          {/* 印刷プレビューモード */}
          <div className="print-preview-container">
            <Button onClick={togglePrintMode} style={{ margin: '12px 0' }}>
              通常表示に戻る
            </Button>
            <Divider />
            <PrintControls
              settings={printSettings}
              onSettingsChange={setPrintSettings}
              onPrint={handlePrint}
            />
            <Divider />
            <div className="print-preview" ref={printableTableRef}>
              <PrintableTable
                columns={optimizedPrintColumns}
                dataSource={dataSource}
                printSettings={printSettings}
                table={table}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
