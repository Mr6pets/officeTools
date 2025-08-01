import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Space, Typography, Row, Col, message, ColorPicker } from 'antd';
import { CopyOutlined, BgColorsOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface ColorValues {
  hex: string;
  rgb: string;
  hsl: string;
  hsv: string;
  cmyk: string;
}

const ColorConverter: React.FC = () => {
  const [colorValues, setColorValues] = useState<ColorValues>({
    hex: '#FF0000',
    rgb: 'rgb(255, 0, 0)',
    hsl: 'hsl(0, 100%, 50%)',
    hsv: 'hsv(0, 100%, 100%)',
    cmyk: 'cmyk(0%, 100%, 100%, 0%)'
  });
  const [selectedColor, setSelectedColor] = useState<string>('#FF0000');

  // 颜色转换函数
  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
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

  const rgbToCmyk = (r: number, g: number, b: number): { c: number; m: number; y: number; k: number } => {
    r /= 255;
    g /= 255;
    b /= 255;

    const k = 1 - Math.max(r, Math.max(g, b));
    const c = (1 - r - k) / (1 - k) || 0;
    const m = (1 - g - k) / (1 - k) || 0;
    const y = (1 - b - k) / (1 - k) || 0;

    return {
      c: Math.round(c * 100),
      m: Math.round(m * 100),
      y: Math.round(y * 100),
      k: Math.round(k * 100)
    };
  };

  // 更新所有颜色格式
  const updateAllFormats = (hex: string) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return;

    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
    const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

    setColorValues({
      hex: hex.toUpperCase(),
      rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
      hsv: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`,
      cmyk: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`
    });
  };

  // 处理颜色选择器变化
  const handleColorChange = (color: any) => {
    const hexColor = color.toHexString();
    setSelectedColor(hexColor);
    updateAllFormats(hexColor);
  };

  // 处理手动输入
  const handleManualInput = (format: keyof ColorValues, value: string) => {
    setColorValues(prev => ({ ...prev, [format]: value }));
    
    // 尝试解析并更新其他格式
    if (format === 'hex' && /^#[0-9A-F]{6}$/i.test(value)) {
      setSelectedColor(value);
      updateAllFormats(value);
    }
  };

  // 复制到剪贴板
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      message.success('已复制到剪贴板');
    }).catch(() => {
      message.error('复制失败');
    });
  };

  // 生成随机颜色
  const generateRandomColor = () => {
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    setSelectedColor(randomColor);
    updateAllFormats(randomColor);
  };

  useEffect(() => {
    updateAllFormats(selectedColor);
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>颜色转换工具</Title>
      
      <Card>
        {/* 颜色选择器 */}
        <Row gutter={[16, 16]} style={{ marginBottom: '30px' }}>
          <Col span={12}>
            <Text strong>颜色选择器：</Text>
            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <ColorPicker
                value={selectedColor}
                onChange={handleColorChange}
                size="large"
                showText
              />
              <div 
                style={{
                  width: '100px',
                  height: '40px',
                  backgroundColor: selectedColor,
                  border: '1px solid #d9d9d9',
                  borderRadius: '6px'
                }}
              />
            </div>
          </Col>
          <Col span={12}>
            <Text strong>操作：</Text>
            <div style={{ marginTop: '16px' }}>
              <Space>
                <Button 
                  icon={<BgColorsOutlined />}
                  onClick={generateRandomColor}
                >
                  随机颜色
                </Button>
              </Space>
            </div>
          </Col>
        </Row>

        {/* 颜色格式转换 */}
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Title level={4}>颜色格式</Title>
          </Col>
          
          {/* HEX */}
          <Col span={12}>
            <Text strong>HEX：</Text>
            <Input
              value={colorValues.hex}
              onChange={(e) => handleManualInput('hex', e.target.value)}
              style={{ marginTop: '8px' }}
              suffix={
                <Button 
                  type="link" 
                  icon={<CopyOutlined />}
                  onClick={() => copyToClipboard(colorValues.hex)}
                />
              }
            />
          </Col>
          
          {/* RGB */}
          <Col span={12}>
            <Text strong>RGB：</Text>
            <Input
              value={colorValues.rgb}
              onChange={(e) => handleManualInput('rgb', e.target.value)}
              style={{ marginTop: '8px' }}
              suffix={
                <Button 
                  type="link" 
                  icon={<CopyOutlined />}
                  onClick={() => copyToClipboard(colorValues.rgb)}
                />
              }
            />
          </Col>
          
          {/* HSL */}
          <Col span={12}>
            <Text strong>HSL：</Text>
            <Input
              value={colorValues.hsl}
              onChange={(e) => handleManualInput('hsl', e.target.value)}
              style={{ marginTop: '8px' }}
              suffix={
                <Button 
                  type="link" 
                  icon={<CopyOutlined />}
                  onClick={() => copyToClipboard(colorValues.hsl)}
                />
              }
            />
          </Col>
          
          {/* HSV */}
          <Col span={12}>
            <Text strong>HSV：</Text>
            <Input
              value={colorValues.hsv}
              onChange={(e) => handleManualInput('hsv', e.target.value)}
              style={{ marginTop: '8px' }}
              suffix={
                <Button 
                  type="link" 
                  icon={<CopyOutlined />}
                  onClick={() => copyToClipboard(colorValues.hsv)}
                />
              }
            />
          </Col>
          
          {/* CMYK */}
          <Col span={12}>
            <Text strong>CMYK：</Text>
            <Input
              value={colorValues.cmyk}
              onChange={(e) => handleManualInput('cmyk', e.target.value)}
              style={{ marginTop: '8px' }}
              suffix={
                <Button 
                  type="link" 
                  icon={<CopyOutlined />}
                  onClick={() => copyToClipboard(colorValues.cmyk)}
                />
              }
            />
          </Col>
        </Row>

        {/* 颜色预览 */}
        <Row gutter={[16, 16]} style={{ marginTop: '30px' }}>
          <Col span={24}>
            <Title level={4}>颜色预览</Title>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {[0.1, 0.3, 0.5, 0.7, 0.9].map(opacity => (
                <div key={opacity} style={{ textAlign: 'center' }}>
                  <div 
                    style={{
                      width: '80px',
                      height: '80px',
                      backgroundColor: selectedColor,
                      opacity: opacity,
                      border: '1px solid #d9d9d9',
                      borderRadius: '6px',
                      marginBottom: '8px'
                    }}
                  />
                  <Text type="secondary">{Math.round(opacity * 100)}%</Text>
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ColorConverter;