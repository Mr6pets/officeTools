import React, { useState, useRef, useEffect } from 'react';
import {
  Card,
  Upload,
  Button,
  Slider,
  Row,
  Col,
  Space,
  message,
  Divider,
  Input,
  Select,
  ColorPicker,
  Tooltip
} from 'antd';
import {
  UploadOutlined,
  DownloadOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  SwapOutlined,
  UndoOutlined,
  RedoOutlined,
  FontSizeOutlined,
  BgColorsOutlined
} from '@ant-design/icons';
import type { UploadFile } from 'antd';

interface FilterSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  sepia: number;
  grayscale: number;
}

interface TextOverlay {
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontFamily: string;
}

const ImageEditor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [currentImage, setCurrentImage] = useState<HTMLImageElement | null>(null);
  const [filters, setFilters] = useState<FilterSettings>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    sepia: 0,
    grayscale: 0
  });
  const [rotation, setRotation] = useState(0);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);
  const [textOverlay, setTextOverlay] = useState<TextOverlay>({
    text: '',
    x: 50,
    y: 50,
    fontSize: 24,
    color: '#000000',
    fontFamily: 'Arial'
  });
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [exportFormat, setExportFormat] = useState<string>('png');

  // 保存历史记录
  const saveToHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(imageData);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // 撤销
  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (canvas && ctx && history[historyIndex - 1]) {
        ctx.putImageData(history[historyIndex - 1], 0, 0);
      }
    }
  };

  // 重做
  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (canvas && ctx && history[historyIndex + 1]) {
        ctx.putImageData(history[historyIndex + 1], 0, 0);
      }
    }
  };

  // 应用滤镜
  const applyFilters = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !originalImage) return;

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 保存当前状态
    ctx.save();
    
    // 应用变换
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    ctx.translate(centerX, centerY);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipHorizontal ? -1 : 1, flipVertical ? -1 : 1);
    
    // 应用CSS滤镜
    const filterString = `
      brightness(${filters.brightness}%)
      contrast(${filters.contrast}%)
      saturate(${filters.saturation}%)
      blur(${filters.blur}px)
      sepia(${filters.sepia}%)
      grayscale(${filters.grayscale}%)
    `;
    ctx.filter = filterString;
    
    // 绘制图片
    ctx.drawImage(
      originalImage,
      -originalImage.width / 2,
      -originalImage.height / 2,
      originalImage.width,
      originalImage.height
    );
    
    // 恢复状态
    ctx.restore();
    
    // 添加文字覆盖
    if (textOverlay.text) {
      ctx.font = `${textOverlay.fontSize}px ${textOverlay.fontFamily}`;
      ctx.fillStyle = textOverlay.color;
      ctx.fillText(textOverlay.text, textOverlay.x, textOverlay.y);
    }
  };

  // 处理图片上传
  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setOriginalImage(img);
        setCurrentImage(img);
        
        const canvas = canvasRef.current;
        if (canvas) {
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            saveToHistory();
          }
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
    return false;
  };

  // 重置所有设置
  const resetAll = () => {
    setFilters({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      blur: 0,
      sepia: 0,
      grayscale: 0
    });
    setRotation(0);
    setFlipHorizontal(false);
    setFlipVertical(false);
    setTextOverlay({
      text: '',
      x: 50,
      y: 50,
      fontSize: 24,
      color: '#000000',
      fontFamily: 'Arial'
    });
    
    if (originalImage) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(originalImage, 0, 0);
        saveToHistory();
      }
    }
  };

  // 导出图片
  const exportImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      message.error('没有可导出的图片');
      return;
    }

    const link = document.createElement('a');
    link.download = `edited-image.${exportFormat}`;
    link.href = canvas.toDataURL(`image/${exportFormat}`);
    link.click();
    message.success('图片导出成功');
  };

  // 当滤镜设置改变时重新应用
  useEffect(() => {
    if (originalImage) {
      applyFilters();
    }
  }, [filters, rotation, flipHorizontal, flipVertical, textOverlay, originalImage]);

  return (
    <div className="image-editor">
      <Card title="图片编辑器" className="tool-card">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* 上传区域 */}
          <Card size="small" title="上传图片">
            <Upload
              beforeUpload={handleImageUpload}
              showUploadList={false}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>选择图片</Button>
            </Upload>
          </Card>

          {/* 画布区域 */}
          {originalImage && (
            <Card size="small" title="编辑区域">
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <canvas
                  ref={canvasRef}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '400px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '6px'
                  }}
                />
              </div>
              
              {/* 操作按钮 */}
              <Space wrap>
                <Tooltip title="撤销">
                  <Button 
                    icon={<UndoOutlined />} 
                    onClick={undo}
                    disabled={historyIndex <= 0}
                  />
                </Tooltip>
                <Tooltip title="重做">
                  <Button 
                    icon={<RedoOutlined />} 
                    onClick={redo}
                    disabled={historyIndex >= history.length - 1}
                  />
                </Tooltip>
                <Tooltip title="向左旋转">
                  <Button 
                    icon={<RotateLeftOutlined />} 
                    onClick={() => {
                      setRotation(rotation - 90);
                      saveToHistory();
                    }}
                  />
                </Tooltip>
                <Tooltip title="向右旋转">
                  <Button 
                    icon={<RotateRightOutlined />} 
                    onClick={() => {
                      setRotation(rotation + 90);
                      saveToHistory();
                    }}
                  />
                </Tooltip>
                <Tooltip title="水平翻转">
                  <Button 
                    icon={<SwapOutlined />} 
                    onClick={() => {
                      setFlipHorizontal(!flipHorizontal);
                      saveToHistory();
                    }}
                  />
                </Tooltip>
                <Button onClick={resetAll}>重置</Button>
              </Space>
            </Card>
          )}

          {/* 滤镜控制 */}
          {originalImage && (
            <Card size="small" title="滤镜调整">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <div>亮度: {filters.brightness}%</div>
                  <Slider
                    min={0}
                    max={200}
                    value={filters.brightness}
                    onChange={(value) => setFilters({...filters, brightness: value})}
                  />
                </Col>
                <Col span={12}>
                  <div>对比度: {filters.contrast}%</div>
                  <Slider
                    min={0}
                    max={200}
                    value={filters.contrast}
                    onChange={(value) => setFilters({...filters, contrast: value})}
                  />
                </Col>
                <Col span={12}>
                  <div>饱和度: {filters.saturation}%</div>
                  <Slider
                    min={0}
                    max={200}
                    value={filters.saturation}
                    onChange={(value) => setFilters({...filters, saturation: value})}
                  />
                </Col>
                <Col span={12}>
                  <div>模糊: {filters.blur}px</div>
                  <Slider
                    min={0}
                    max={10}
                    value={filters.blur}
                    onChange={(value) => setFilters({...filters, blur: value})}
                  />
                </Col>
                <Col span={12}>
                  <div>复古效果: {filters.sepia}%</div>
                  <Slider
                    min={0}
                    max={100}
                    value={filters.sepia}
                    onChange={(value) => setFilters({...filters, sepia: value})}
                  />
                </Col>
                <Col span={12}>
                  <div>灰度: {filters.grayscale}%</div>
                  <Slider
                    min={0}
                    max={100}
                    value={filters.grayscale}
                    onChange={(value) => setFilters({...filters, grayscale: value})}
                  />
                </Col>
              </Row>
            </Card>
          )}

          {/* 文字覆盖 */}
          {originalImage && (
            <Card size="small" title="添加文字">
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Input
                    placeholder="输入要添加的文字"
                    value={textOverlay.text}
                    onChange={(e) => setTextOverlay({...textOverlay, text: e.target.value})}
                    prefix={<FontSizeOutlined />}
                  />
                </Col>
                <Col span={8}>
                  <div>字体大小: {textOverlay.fontSize}px</div>
                  <Slider
                    min={12}
                    max={72}
                    value={textOverlay.fontSize}
                    onChange={(value) => setTextOverlay({...textOverlay, fontSize: value})}
                  />
                </Col>
                <Col span={8}>
                  <div>X位置: {textOverlay.x}px</div>
                  <Slider
                    min={0}
                    max={originalImage?.width || 500}
                    value={textOverlay.x}
                    onChange={(value) => setTextOverlay({...textOverlay, x: value})}
                  />
                </Col>
                <Col span={8}>
                  <div>Y位置: {textOverlay.y}px</div>
                  <Slider
                    min={0}
                    max={originalImage?.height || 500}
                    value={textOverlay.y}
                    onChange={(value) => setTextOverlay({...textOverlay, y: value})}
                  />
                </Col>
                <Col span={12}>
                  <div>字体颜色:</div>
                  <ColorPicker
                    value={textOverlay.color}
                    onChange={(color) => setTextOverlay({...textOverlay, color: color.toHexString()})}
                  />
                </Col>
                <Col span={12}>
                  <div>字体:</div>
                  <Select
                    value={textOverlay.fontFamily}
                    onChange={(value) => setTextOverlay({...textOverlay, fontFamily: value})}
                    style={{ width: '100%' }}
                  >
                    <Select.Option value="Arial">Arial</Select.Option>
                    <Select.Option value="Microsoft YaHei">微软雅黑</Select.Option>
                    <Select.Option value="SimSun">宋体</Select.Option>
                    <Select.Option value="SimHei">黑体</Select.Option>
                  </Select>
                </Col>
              </Row>
            </Card>
          )}

          {/* 导出设置 */}
          {originalImage && (
            <Card size="small" title="导出图片">
              <Row gutter={[16, 16]} align="middle">
                <Col span={12}>
                  <div>导出格式:</div>
                  <Select
                    value={exportFormat}
                    onChange={setExportFormat}
                    style={{ width: '100%' }}
                  >
                    <Select.Option value="png">PNG</Select.Option>
                    <Select.Option value="jpeg">JPEG</Select.Option>
                    <Select.Option value="webp">WebP</Select.Option>
                  </Select>
                </Col>
                <Col span={12}>
                  <Button 
                    type="primary" 
                    icon={<DownloadOutlined />}
                    onClick={exportImage}
                    block
                  >
                    导出图片
                  </Button>
                </Col>
              </Row>
            </Card>
          )}
        </Space>
      </Card>
    </div>
  );
};

export default ImageEditor;