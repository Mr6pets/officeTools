import React, { useState } from 'react';
import { Upload, Button, Card, Input, message, Progress, Space, Select } from 'antd';
import { FileImageOutlined, CopyOutlined, DownloadOutlined } from '@ant-design/icons';
import { createWorker } from 'tesseract.js';

const { TextArea } = Input;
const { Option } = Select;

const ImageOCR: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [extractedText, setExtractedText] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [language, setLanguage] = useState<string>('chi_sim+eng');

  const languageOptions = [
    { value: 'chi_sim+eng', label: '中文+英文' },
    { value: 'eng', label: '英文' },
    { value: 'chi_sim', label: '简体中文' },
    { value: 'chi_tra', label: '繁体中文' },
  ];

  const handleImageUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setExtractedText('');
    return false;
  };

  const extractText = async () => {
    if (!imageUrl) {
      message.warning('请先上传图片');
      return;
    }

    setProcessing(true);
    setProgress(0);
    
    try {
      const worker = await createWorker(language, 1, {
        logger: m => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        }
      });
      
      const { data: { text } } = await worker.recognize(imageUrl);
      setExtractedText(text.trim());
      await worker.terminate();
      message.success('文字提取完成！');
    } catch (error) {
      console.error('OCR失败:', error);
      message.error('文字提取失败，请重试');
    } finally {
      setProcessing(false);
      setProgress(0);
    }
  };

  const copyToClipboard = async () => {
    if (!extractedText) {
      message.warning('没有可复制的文字');
      return;
    }
    
    try {
      await navigator.clipboard.writeText(extractedText);
      message.success('文字已复制到剪贴板');
    } catch (error) {
      message.error('复制失败');
    }
  };

  const downloadText = () => {
    if (!extractedText) {
      message.warning('没有可下载的文字');
      return;
    }
    
    const blob = new Blob([extractedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `extracted_text_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    message.success('文字已下载');
  };

  return (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      <Card title="图片上传" style={{ flex: '1 1 400px', minWidth: 400 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <label style={{ marginRight: 8 }}>识别语言:</label>
            <Select 
              value={language} 
              onChange={setLanguage}
              style={{ width: 150 }}
            >
              {languageOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </div>
          
          <Upload
            accept="image/*"
            beforeUpload={handleImageUpload}
            showUploadList={false}
          >
            <Button icon={<FileImageOutlined />} block>
              选择图片
            </Button>
          </Upload>
          
          {imageUrl && (
            <div style={{ textAlign: 'center' }}>
              <img 
                src={imageUrl} 
                alt="preview" 
                style={{ 
                  width: '100%', 
                  maxHeight: 300, 
                  objectFit: 'contain',
                  border: '1px solid #d9d9d9',
                  borderRadius: 6
                }}
              />
            </div>
          )}
          
          {processing && (
            <Progress 
              percent={progress} 
              status="active"
              format={percent => `识别中 ${percent}%`}
            />
          )}
          
          <Button 
            type="primary" 
            onClick={extractText}
            loading={processing}
            disabled={!imageUrl}
            block
            size="large"
          >
            {processing ? '识别中...' : '开始识别'}
          </Button>
        </Space>
      </Card>
      
      <Card 
        title="识别结果" 
        style={{ flex: '1 1 400px', minWidth: 400 }}
        extra={
          <Space>
            <Button 
              icon={<CopyOutlined />}
              onClick={copyToClipboard}
              disabled={!extractedText}
              size="small"
            >
              复制
            </Button>
            <Button 
              icon={<DownloadOutlined />}
              onClick={downloadText}
              disabled={!extractedText}
              size="small"
            >
              下载
            </Button>
          </Space>
        }
      >
        <TextArea 
          value={extractedText}
          onChange={(e) => setExtractedText(e.target.value)}
          rows={12}
          placeholder="识别的文字将显示在这里...\n\n支持手动编辑和修改"
          style={{ resize: 'vertical' }}
        />
        
        {extractedText && (
          <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
            字符数: {extractedText.length}
          </div>
        )}
      </Card>
    </div>
  );
};

export default ImageOCR;