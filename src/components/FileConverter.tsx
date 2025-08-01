import React, { useState } from 'react';
import { Upload, Button, Card, Select, message, Progress, Space, List } from 'antd';
import { FileOutlined, SwapOutlined, DownloadOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Dragger } = Upload;

interface ConvertFile {
  uid: string;
  name: string;
  file: File;
  targetFormat: string;
}

const FileConverter: React.FC = () => {
  const [files, setFiles] = useState<ConvertFile[]>([]);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);

  const supportedFormats = {
    document: ['pdf', 'docx', 'txt', 'rtf'],
    image: ['jpg', 'png', 'webp', 'gif', 'bmp'],
    data: ['csv', 'xlsx', 'json', 'xml']
  };

  const handleUpload = (info: any) => {
    const { fileList } = info;
    const newFiles = fileList.map((file: any) => ({
      uid: file.uid,
      name: file.name,
      file: file.originFileObj || file,
      targetFormat: ''
    }));
    setFiles(newFiles);
  };

  const updateTargetFormat = (uid: string, format: string) => {
    setFiles(prev => prev.map(file => 
      file.uid === uid ? { ...file, targetFormat: format } : file
    ));
  };

  const handleConvert = async () => {
    if (files.some(f => !f.targetFormat)) {
      message.warning('请为所有文件选择目标格式');
      return;
    }

    setConverting(true);
    setProgress(0);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        await convertFile(file);
        setProgress(((i + 1) / files.length) * 100);
      }
      message.success('转换完成！');
    } catch (error) {
      message.error('转换失败：' + error.message);
    } finally {
      setConverting(false);
    }
  };

  const convertFile = async (file: ConvertFile) => {
    // 这里实现具体的文件转换逻辑
    // 可以使用不同的库来处理不同格式的转换
    return new Promise(resolve => setTimeout(resolve, 1000));
  };

  const getFormatOptions = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext || '')) {
      return supportedFormats.image;
    }
    if (['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(ext || '')) {
      return supportedFormats.document;
    }
    if (['csv', 'xlsx', 'xls', 'json', 'xml'].includes(ext || '')) {
      return supportedFormats.data;
    }
    return [];
  };

  return (
    <div className="fade-in">
      <Card title="文件上传" style={{ marginBottom: 16 }}>
        <Dragger
          multiple
          onChange={handleUpload}
          beforeUpload={() => false}
          showUploadList={false}
        >
          <p className="ant-upload-drag-icon">
            <FileOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
          <p className="ant-upload-hint">
            支持文档、图片、数据文件格式转换
          </p>
        </Dragger>
      </Card>

      {files.length > 0 && (
        <Card title="转换设置" style={{ marginBottom: 16 }}>
          <List
            dataSource={files}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Select
                    placeholder="选择目标格式"
                    style={{ width: 120 }}
                    value={item.targetFormat}
                    onChange={(value) => updateTargetFormat(item.uid, value)}
                  >
                    {getFormatOptions(item.name).map(format => (
                      <Option key={format} value={format}>
                        .{format}
                      </Option>
                    ))}
                  </Select>
                ]}
              >
                <List.Item.Meta
                  avatar={<FileOutlined />}
                  title={item.name}
                  description={`转换为: ${item.targetFormat || '未选择'}`}
                />
              </List.Item>
            )}
          />
        </Card>
      )}

      <Card title="转换操作">
        {converting && (
          <Progress 
            percent={Math.round(progress)} 
            status="active"
            style={{ marginBottom: 16 }}
          />
        )}
        
        <Button 
          type="primary" 
          icon={<SwapOutlined />}
          onClick={handleConvert}
          loading={converting}
          disabled={files.length === 0}
          size="large"
          block
        >
          {converting ? '转换中...' : `开始转换 (${files.length} 个文件)`}
        </Button>
      </Card>
    </div>
  );
};

export default FileConverter;