import React, { useState, useCallback } from 'react';
import { Card, Button, Input, Space, Typography, Row, Col, message, Divider } from 'antd';
import { CopyOutlined, BgColorsOutlined } from '@ant-design/icons';

// 移除未使用的Title导入
const { Text } = Typography;

interface ColorInfo {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  hsv: { h: number; s: number; v: number };
}

const ColorPicker: React.FC = () => {
  const [selectedColor, setSelectedColor] = useState<string>('#6366f1');
  const [colorInfo, setColorInfo] = useState<ColorInfo | null>(null);

  // 预设颜色调色板
  const presetColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2',
    '#A3E4D7', '#F9E79F', '#D5A6BD', '#AED6F1', '#A9DFBF',
    '#FAD7A0', '#E8DAEF', '#D1F2EB', '#FCF3CF', '#FADBD8',
    '#EBF5FB', '#E8F8F5', '#FEF9E7', '#FDEDEC', '#EAF2F8',
    '#000000', '#333333', '#666666', '#999999', '#CCCCCC',
    '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
    '#FF00FF', '#00FFFF', '#800000', '#008000', '#000080',
    '#808000', '#800080', '#008080', '#C0C0C0', '#808080'
  ];

  // 颜色转换函数
  const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const rgbToHsv = (r: number, g: number, b: number): { h: number; s: number; v: number } => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, v = max;

    const d = max - min;
    s = max === 0 ? 0 : d / max;

    if (max === min) {
      h = 0;
    } else {
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      v: Math.round(v * 100)
    };
  };

  const updateColorInfo = useCallback((color: string) => {
    const rgb = hexToRgb(color);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
    
    setColorInfo({
      hex: color.toUpperCase(),
      rgb,
      hsl,
      hsv
    });
  }, []);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    updateColorInfo(color);
  };

  const handleInputChange = (value: string) => {
    if (/^#[0-9A-F]{6}$/i.test(value)) {
      handleColorChange(value);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    message.success(`${label} 已复制到剪贴板`);
  };

  React.useEffect(() => {
    updateColorInfo(selectedColor);
  }, [selectedColor, updateColorInfo]);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Row gutter={[24, 24]}>
        {/* 颜色选择器 */}
        <Col xs={24} lg={12}>
          <Card 
            title={<span><BgColorsOutlined /> 颜色选择器</span>}
            style={{ height: '100%' }}
          >
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              {/* 当前选中颜色显示 */}
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: '120px',
                    height: '120px',
                    backgroundColor: selectedColor,
                    border: '3px solid #e2e8f0',
                    borderRadius: '12px',
                    margin: '0 auto 16px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'color';
                    input.value = selectedColor;
                    input.onchange = (e) => {
                      const target = e.target as HTMLInputElement;
                      handleColorChange(target.value);
                    };
                    input.click();
                  }}
                />
                <Text strong style={{ fontSize: '16px' }}>
                  点击选择颜色
                </Text>
              </div>

              {/* 手动输入颜色值 */}
              <div>
                <Text strong>HEX 颜色值:</Text>
                <Input
                  value={selectedColor}
                  onChange={(e) => {
                    setSelectedColor(e.target.value);
                    if (e.target.value.length === 7) {
                      handleInputChange(e.target.value);
                    }
                  }}
                  placeholder="#000000"
                  style={{ marginTop: '8px' }}
                  addonBefore="#"
                />
              </div>

              {/* 预设颜色调色板 */}
              <div>
                <Text strong>预设颜色:</Text>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(10, 1fr)', 
                  gap: '8px', 
                  marginTop: '12px' 
                }}>
                  {presetColors.map((color, index) => (
                    <div
                      key={index}
                      style={{
                        width: '32px',
                        height: '32px',
                        backgroundColor: color,
                        borderRadius: '6px',
                        cursor: 'pointer',
                        border: selectedColor.toUpperCase() === color.toUpperCase() 
                          ? '3px solid #6366f1' 
                          : '2px solid #e2e8f0',
                        transition: 'all 0.2s'
                      }}
                      onClick={() => handleColorChange(color)}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </Space>
          </Card>
        </Col>

        {/* 颜色信息显示 */}
        <Col xs={24} lg={12}>
          <Card title="颜色信息" style={{ height: '100%' }}>
            {colorInfo && (
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                {/* HEX */}
                <div>
                  <Text strong>HEX:</Text>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <Input 
                      value={colorInfo.hex} 
                      readOnly 
                      style={{ flex: 1 }}
                    />
                    <Button 
                      icon={<CopyOutlined />} 
                      onClick={() => copyToClipboard(colorInfo.hex, 'HEX值')}
                    />
                  </div>
                </div>

                <Divider style={{ margin: '12px 0' }} />

                {/* RGB */}
                <div>
                  <Text strong>RGB:</Text>
                  <Row gutter={8} style={{ marginTop: '8px' }}>
                    <Col span={6}>
                      <Input 
                        addonBefore="R" 
                        value={colorInfo.rgb.r} 
                        readOnly 
                      />
                    </Col>
                    <Col span={6}>
                      <Input 
                        addonBefore="G" 
                        value={colorInfo.rgb.g} 
                        readOnly 
                      />
                    </Col>
                    <Col span={6}>
                      <Input 
                        addonBefore="B" 
                        value={colorInfo.rgb.b} 
                        readOnly 
                      />
                    </Col>
                    <Col span={6}>
                      <Button 
                        icon={<CopyOutlined />} 
                        onClick={() => copyToClipboard(
                          `rgb(${colorInfo.rgb.r}, ${colorInfo.rgb.g}, ${colorInfo.rgb.b})`, 
                          'RGB值'
                        )}
                        block
                      />
                    </Col>
                  </Row>
                </div>

                <Divider style={{ margin: '12px 0' }} />

                {/* HSL */}
                <div>
                  <Text strong>HSL:</Text>
                  <Row gutter={8} style={{ marginTop: '8px' }}>
                    <Col span={6}>
                      <Input 
                        addonBefore="H" 
                        value={colorInfo.hsl.h} 
                        readOnly 
                      />
                    </Col>
                    <Col span={6}>
                      <Input 
                        addonBefore="S" 
                        value={`${colorInfo.hsl.s}%`} 
                        readOnly 
                      />
                    </Col>
                    <Col span={6}>
                      <Input 
                        addonBefore="L" 
                        value={`${colorInfo.hsl.l}%`} 
                        readOnly 
                      />
                    </Col>
                    <Col span={6}>
                      <Button 
                        icon={<CopyOutlined />} 
                        onClick={() => copyToClipboard(
                          `hsl(${colorInfo.hsl.h}, ${colorInfo.hsl.s}%, ${colorInfo.hsl.l}%)`, 
                          'HSL值'
                        )}
                        block
                      />
                    </Col>
                  </Row>
                </div>

                <Divider style={{ margin: '12px 0' }} />

                {/* HSV */}
                <div>
                  <Text strong>HSV:</Text>
                  <Row gutter={8} style={{ marginTop: '8px' }}>
                    <Col span={6}>
                      <Input 
                        addonBefore="H" 
                        value={colorInfo.hsv.h} 
                        readOnly 
                      />
                    </Col>
                    <Col span={6}>
                      <Input 
                        addonBefore="S" 
                        value={`${colorInfo.hsv.s}%`} 
                        readOnly 
                      />
                    </Col>
                    <Col span={6}>
                      <Input 
                        addonBefore="V" 
                        value={`${colorInfo.hsv.v}%`} 
                        readOnly 
                      />
                    </Col>
                    <Col span={6}>
                      <Button 
                        icon={<CopyOutlined />} 
                        onClick={() => copyToClipboard(
                          `hsv(${colorInfo.hsv.h}, ${colorInfo.hsv.s}%, ${colorInfo.hsv.v}%)`, 
                          'HSV值'
                        )}
                        block
                      />
                    </Col>
                  </Row>
                </div>

                <Divider style={{ margin: '12px 0' }} />

                {/* 快速复制所有格式 */}
                <div>
                  <Text strong>快速复制:</Text>
                  <Space wrap style={{ marginTop: '8px' }}>
                    <Button 
                      size="small"
                      onClick={() => copyToClipboard(colorInfo.hex, 'HEX')}
                    >
                      复制 HEX
                    </Button>
                    <Button 
                      size="small"
                      onClick={() => copyToClipboard(
                        `${colorInfo.rgb.r}, ${colorInfo.rgb.g}, ${colorInfo.rgb.b}`, 
                        'RGB'
                      )}
                    >
                      复制 RGB
                    </Button>
                    <Button 
                      size="small"
                      onClick={() => copyToClipboard(
                        `${colorInfo.hsl.h}, ${colorInfo.hsl.s}%, ${colorInfo.hsl.l}%`, 
                        'HSL'
                      )}
                    >
                      复制 HSL
                    </Button>
                  </Space>
                </div>
              </Space>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ColorPicker;