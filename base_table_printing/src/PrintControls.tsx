import React from 'react';
import { Select, InputNumber, Checkbox, Button, Row, Col } from '@douyinfe/semi-ui';

export interface PrintSettings {
  pageSize: 'A4' | 'A3' | 'Letter';
  orientation: 'portrait' | 'landscape';
  margins: { top: number; right: number; bottom: number; left: number };
  includeHeader: boolean;
  includeFooter: boolean;
  scaling: number;
}

interface PrintControlsProps {
  settings: PrintSettings;
  onSettingsChange: (newSettings: PrintSettings) => void;
  onPrint: () => void;
}

type PageSizeType = 'A4' | 'A3' | 'Letter';
type OrientationType = 'portrait' | 'landscape';

export const PrintControls: React.FC<PrintControlsProps> = ({
  settings,
  onSettingsChange,
  onPrint
}) => {
  // マージン値変更ハンドラー
  const handleMarginChange = (key: string, value: number) => {
    onSettingsChange({
      ...settings,
      margins: {
        ...settings.margins,
        [key]: value
      }
    });
  };

  // 用紙サイズ変更ハンドラー
  const handlePageSizeChange = (value: string | number | any[] | Record<string, any> | undefined) => {
    if (typeof value === 'string') {
      onSettingsChange({
        ...settings,
        pageSize: value as PageSizeType
      });
    }
  };

  // 向き変更ハンドラー
  const handleOrientationChange = (value: string | number | any[] | Record<string, any> | undefined) => {
    if (typeof value === 'string') {
      onSettingsChange({
        ...settings,
        orientation: value as OrientationType
      });
    }
  };

  return (
    <div className="print-controls">
      <div className="print-form-container">
        <form>
          <div className="print-form-section">
            <h4>印刷設定</h4>
            <Row>
              <Col span={12}>
                <div className="form-field">
                  <label>用紙サイズ</label>
                  <Select
                    style={{ width: 160 }}
                    value={settings.pageSize}
                    onChange={handlePageSizeChange}
                  >
                    <Select.Option value="A4">A4</Select.Option>
                    <Select.Option value="A3">A3</Select.Option>
                    <Select.Option value="Letter">レター</Select.Option>
                  </Select>
                </div>
              </Col>
              <Col span={12}>
                <div className="form-field">
                  <label>向き</label>
                  <Select
                    style={{ width: 160 }}
                    value={settings.orientation}
                    onChange={handleOrientationChange}
                  >
                    <Select.Option value="portrait">縦向き</Select.Option>
                    <Select.Option value="landscape">横向き</Select.Option>
                  </Select>
                </div>
              </Col>
            </Row>
            
            <div className="print-form-subsection">
              <h5>余白 (mm)</h5>
              <Row>
                <Col span={6}>
                  <div className="form-field">
                    <label>上</label>
                    <InputNumber
                      value={settings.margins.top}
                      min={0}
                      max={50}
                      style={{ width: 120 }}
                      onChange={(value) => handleMarginChange('top', value as number)}
                    />
                  </div>
                </Col>
                <Col span={6}>
                  <div className="form-field">
                    <label>右</label>
                    <InputNumber
                      value={settings.margins.right}
                      min={0}
                      max={50}
                      style={{ width: 120 }}
                      onChange={(value) => handleMarginChange('right', value as number)}
                    />
                  </div>
                </Col>
                <Col span={6}>
                  <div className="form-field">
                    <label>下</label>
                    <InputNumber
                      value={settings.margins.bottom}
                      min={0}
                      max={50}
                      style={{ width: 120 }}
                      onChange={(value) => handleMarginChange('bottom', value as number)}
                    />
                  </div>
                </Col>
                <Col span={6}>
                  <div className="form-field">
                    <label>左</label>
                    <InputNumber
                      value={settings.margins.left}
                      min={0}
                      max={50}
                      style={{ width: 120 }}
                      onChange={(value) => handleMarginChange('left', value as number)}
                    />
                  </div>
                </Col>
              </Row>
            </div>
            
            <Row>
              <Col span={12}>
                <div className="form-field">
                  <Checkbox
                    checked={settings.includeHeader}
                    onChange={(e) => onSettingsChange({ ...settings, includeHeader: Boolean(e.target.checked) })}
                  >
                    ヘッダーを含める
                  </Checkbox>
                </div>
              </Col>
              <Col span={12}>
                <div className="form-field">
                  <Checkbox
                    checked={settings.includeFooter}
                    onChange={(e) => onSettingsChange({ ...settings, includeFooter: Boolean(e.target.checked) })}
                  >
                    フッターを含める
                  </Checkbox>
                </div>
              </Col>
            </Row>
            
            <Row>
              <Col span={12}>
                <div className="form-field">
                  <label>拡大縮小 (%)</label>
                  <InputNumber
                    value={settings.scaling}
                    min={50}
                    max={150}
                    style={{ width: 160 }}
                    onChange={(value) => onSettingsChange({ ...settings, scaling: value as number })}
                  />
                </div>
              </Col>
            </Row>
          </div>
          
          <div style={{ marginTop: 20 }}>
            <Button type="primary" onClick={(e) => { e.preventDefault(); onPrint(); }}>
              印刷プレビュー
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}; 