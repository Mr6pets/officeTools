import React, { useState } from 'react';
import { Upload, Slider, Button, Card, Progress, message, Space, Typography, Row, Col } from 'antd';
import { InboxOutlined, DownloadOutlined, DeleteOutlined } from '@ant-design/icons';
import { saveAs } from 'file-saver';

const { Dragger } = Upload;
const { Text, Title } = Typography;

interface CompressedImage {
  original: File;
  compressed: Blob;
  originalSize: number;
  compressedSize: number;
  url: string;
}

const ImageCompressor: React.FC = () => {
  const [images, setImages] = useState<CompressedImage[]>([]);
  const [quality, setQuality] = useState(80);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const compressImage = (file: File, quality: number): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
          resolve(blob!);
        }, 'image/jpeg', quality / 100);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      message.error('请选择图片文件');
      return false;
    }

    setProcessing(true);
    try {
      const compressed = await compressImage(file, quality);
      const compressedImage: CompressedImage = {
        original: file,
        compressed,
        originalSize: file.size,
        compressedSize: compressed.size,
        url: URL.createObjectURL(compressed)
      };
      
      setImages(prev => [...prev, compressedImage]);
      message.success(`图片压缩完成，压缩率: ${((1 - compressed.size / file.size) * 100).toFixed(1)}%`);
    } catch (error) {
      message.error('图片压缩失败');
    } finally {
      setProcessing(false);
    }
    
    return false;
  };

  const downloadImage = (image: CompressedImage) => {
    const fileName = image.original.name.replace(/\.[^/.]+$/, '') + '_compressed.jpg';
    saveAs(image.compressed, fileName);
  };

  const downloadAll = () => {
    images.forEach((image, index) => {
      setTimeout(() => {
        downloadImage(image);
      }, index * 100);
    });
  };

  const clearAll = () => {
    images.forEach(image => URL.revokeObjectURL(image.url));
    setImages([]);
  };

  const totalOriginalSize = images.reduce((sum, img) => sum + img.originalSize, 0);
  const totalCompressedSize = images.reduce((sum, img) => sum + img.compressedSize, 0);
  const totalSavings = totalOriginalSize - totalCompressedSize;

  return (
    <div>
      <Card title="图片压缩" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={12}>
            <div style={{ marginBottom: 16 }}>
              <Text>压缩质量: {quality}%</Text>
              <Slider
                min={10}
                max={100}
                value={quality}
                onChange={setQuality}
                marks={{
                  10: '最小',
                  50: '平衡',
                  80: '高质量',
                  100: '原始'
                }}
              />
            </div>
          </Col>
          <Col span={12}>
            {images.length > 0 && (
              <div>
                <Text>总计: {images.length} 张图片</Text><br/>
                <Text>原始大小: {formatFileSize(totalOriginalSize)}</Text><br/>
                <Text>压缩后: {formatFileSize(totalCompressedSize)}</Text><br/>
                <Text type="success">节省: {formatFileSize(totalSavings)} ({((totalSavings / totalOriginalSize) * 100).toFixed(1)}%)</Text>
              </div>
            )}
          </Col>
        </Row>
        
        <Dragger
          multiple
          accept="image/*"
          beforeUpload={handleImageUpload}
          showUploadList={false}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽图片到此区域进行压缩</p>
          <p className="ant-upload-hint">支持 JPG、PNG、WebP 等格式，可批量处理</p>
        </Dragger>
        
        {processing && <Progress percent={progress} style={{ marginTop: 16 }} />}
        
        {images.length > 0 && (
          <Space style={{ marginTop: 16 }}>
            <Button type="primary" icon={<DownloadOutlined />} onClick={downloadAll}>
              下载全部
            </Button>
            <Button onClick={clearAll}>
              清空列表
            </Button>
          </Space>
        )}
      </Card>

      {images.length > 0 && (
        <Card title="压缩结果">
          <Row gutter={[16, 16]}>
            {images.map((image, index) => (
              <Col key={index} xs={24} sm={12} md={8} lg={6}>
                <Card
                  size="small"
                  cover={
                    <img
                      src={image.url}
                      alt="compressed"
                      style={{ height: 120, objectFit: 'cover' }}
                    />
                  }
                  actions={[
                    <Button 
                      type="text" 
                      icon={<DownloadOutlined />} 
                      onClick={() => downloadImage(image)}
                    />,
                    <Button 
                      type="text" 
                      danger 
                      icon={<DeleteOutlined />} 
                      onClick={() => {
                        URL.revokeObjectURL(image.url);
                        setImages(prev => prev.filter((_, i) => i !== index));
                      }}
                    />
                  ]}
                >
                  <Card.Meta
                    title={image.original.name}
                    description={
                      <div>
                        <div>原始: {formatFileSize(image.originalSize)}</div>
                        <div>压缩: {formatFileSize(image.compressedSize)}</div>
                        <div style={{ color: '#52c41a' }}>
                          节省: {((1 - image.compressedSize / image.originalSize) * 100).toFixed(1)}%
                        </div>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      )}
    </div>
  );
};

export default ImageCompressor;