import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Card, Button, Input, Space, Typography, Row, Col, message, Divider, Slider, Tabs } from 'antd';
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
  const [hsvValues, setHsvValues] = useState({ h: 0, s: 0, v: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wheelCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);

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

  const hsvToRgb = (h: number, s: number, v: number): { r: number; g: number; b: number } => {
    h = h / 360;
    s = s / 100;
    v = v / 100;

    const c = v * s;
    const x = c * (1 - Math.abs((h * 6) % 2 - 1));
    const m = v - c;

    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 1/6) {
      r = c; g = x; b = 0;
    } else if (1/6 <= h && h < 2/6) {
      r = x; g = c; b = 0;
    } else if (2/6 <= h && h < 3/6) {
      r = 0; g = c; b = x;
    } else if (3/6 <= h && h < 4/6) {
      r = 0; g = x; b = c;
    } else if (4/6 <= h && h < 5/6) {
      r = x; g = 0; b = c;
    } else if (5/6 <= h && h < 1) {
      r = c; g = 0; b = x;
    }

    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255)
    };
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
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
    setHsvValues(hsv);
  }, []);

  // 绘制色轮
  const drawColorWheel = useCallback(() => {
    const canvas = wheelCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制色轮
    for (let angle = 0; angle < 360; angle += 1) {
      const startAngle = (angle - 1) * Math.PI / 180;
      const endAngle = angle * Math.PI / 180;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.lineWidth = 2;
      
      const hue = angle;
      const rgb = hsvToRgb(hue, 100, 100);
      ctx.strokeStyle = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
      ctx.stroke();
    }

    // 绘制当前选中的色相指示器
    const currentAngle = (hsvValues.h * Math.PI) / 180;
    const indicatorX = centerX + Math.cos(currentAngle) * radius;
    const indicatorY = centerY + Math.sin(currentAngle) * radius;
    
    ctx.beginPath();
    ctx.arc(indicatorX, indicatorY, 8, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [hsvValues.h]);

  // 绘制饱和度-亮度选择器
  const drawSaturationBrightness = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // 清除画布
    ctx.clearRect(0, 0, width, height);

    // 创建渐变
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const saturation = (x / width) * 100;
        const brightness = ((height - y) / height) * 100;
        
        const rgb = hsvToRgb(hsvValues.h, saturation, brightness);
        ctx.fillStyle = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }

    // 绘制当前选中的饱和度-亮度指示器
    const x = (hsvValues.s / 100) * width;
    const y = height - (hsvValues.v / 100) * height;
    
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, 2 * Math.PI);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.stroke();
  }, [hsvValues]);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    updateColorInfo(color);
  };

  // 处理HSV值变化
  const handleHsvChange = (newHsv: { h?: number; s?: number; v?: number }) => {
    const updatedHsv = { ...hsvValues, ...newHsv };
    setHsvValues(updatedHsv);
    
    const rgb = hsvToRgb(updatedHsv.h, updatedHsv.s, updatedHsv.v);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    setSelectedColor(hex);
    updateColorInfo(hex);
  };

  // 色轮点击事件
  const handleWheelClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = wheelCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    
    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance <= radius + 10 && distance >= radius - 10) {
      let angle = Math.atan2(dy, dx) * 180 / Math.PI;
      if (angle < 0) angle += 360;
      
      handleHsvChange({ h: Math.round(angle) });
    }
  };

  // 饱和度-亮度选择器点击事件
  const handleSaturationBrightnessClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const saturation = Math.round((x / canvas.width) * 100);
    const brightness = Math.round(((canvas.height - y) / canvas.height) * 100);
    
    handleHsvChange({ s: Math.max(0, Math.min(100, saturation)), v: Math.max(0, Math.min(100, brightness)) });
  };

  // 鼠标拖拽事件
  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      handleSaturationBrightnessClick(event);
    }
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

  // 绘制画布
  useEffect(() => {
    drawColorWheel();
  }, [drawColorWheel]);

  useEffect(() => {
    drawSaturationBrightness();
  }, [drawSaturationBrightness]);

  // 添加全局鼠标事件监听
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mouseup', handleGlobalMouseUp);
      return () => {
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging]);

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

              {/* 颜色选择方式选项卡 */}
              <Tabs
                defaultActiveKey="preset"
                items={[
                  {
                    key: 'preset',
                    label: '预设颜色',
                    children: (
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(32px, 1fr))', 
                        gap: '8px',
                        maxWidth: '100%',
                        overflow: 'hidden'
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
                    )
                  },
                  {
                    key: 'wheel',
                    label: '色轮选择',
                    children: (
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ marginBottom: '16px' }}>
                          <canvas
                            ref={wheelCanvasRef}
                            width={200}
                            height={200}
                            style={{ cursor: 'pointer', border: '1px solid #e2e8f0', borderRadius: '50%' }}
                            onClick={handleWheelClick}
                          />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                          <Text strong>饱和度 & 亮度:</Text>
                          <canvas
                            ref={canvasRef}
                            width={200}
                            height={150}
                            style={{ 
                              cursor: 'crosshair', 
                              border: '1px solid #e2e8f0', 
                              borderRadius: '4px',
                              display: 'block',
                              margin: '8px auto'
                            }}
                            onClick={handleSaturationBrightnessClick}
                            onMouseDown={handleMouseDown}
                            onMouseUp={handleMouseUp}
                            onMouseMove={handleMouseMove}
                          />
                        </div>
                      </div>
                    )
                  },
                  {
                    key: 'sliders',
                    label: 'HSV 滑块',
                    children: (
                      <Space direction="vertical" style={{ width: '100%' }} size="middle">
                        <div>
                          <Text strong>色相 (H): {hsvValues.h}°</Text>
                          <Slider
                            min={0}
                            max={360}
                            value={hsvValues.h}
                            onChange={(value) => handleHsvChange({ h: value })}
                            tooltip={{ formatter: (value) => `${value}°` }}
                            trackStyle={{ background: `linear-gradient(to right, 
                              hsl(0, 100%, 50%), hsl(60, 100%, 50%), hsl(120, 100%, 50%), 
                              hsl(180, 100%, 50%), hsl(240, 100%, 50%), hsl(300, 100%, 50%), hsl(360, 100%, 50%))` }}
                          />
                        </div>
                        <div>
                          <Text strong>饱和度 (S): {hsvValues.s}%</Text>
                          <Slider
                            min={0}
                            max={100}
                            value={hsvValues.s}
                            onChange={(value) => handleHsvChange({ s: value })}
                            tooltip={{ formatter: (value) => `${value}%` }}
                          />
                        </div>
                        <div>
                          <Text strong>亮度 (V): {hsvValues.v}%</Text>
                          <Slider
                            min={0}
                            max={100}
                            value={hsvValues.v}
                            onChange={(value) => handleHsvChange({ v: value })}
                            tooltip={{ formatter: (value) => `${value}%` }}
                          />
                        </div>
                      </Space>
                    )
                  }
                ]}
              />
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