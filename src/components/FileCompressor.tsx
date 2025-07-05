import React, { useState } from 'react';
import { Upload, Button, Progress, message, Card, List, Space, Typography } from 'antd';
import { InboxOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const { Dragger } = Upload;
const { Text } = Typography;

interface FileItem {
  uid: string;
  name: string;
  size: number;
  file: File;
}

const FileCompressor: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [compressing, setCompressing] = useState(false);
  const [progress, setProgress] = useState(0);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileUpload = (file: File) => {
    const fileItem: FileItem = {
      uid: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      file: file
    };
    setFiles(prev => [...prev, fileItem]);
    return false;
  };

  const removeFile = (uid: string) => {
    setFiles(prev => prev.filter(file => file.uid !== uid));
  };

  const clearAllFiles = () => {
    setFiles([]);
  };

  const handleCompress = async () => {
    if (files.length === 0) {
      message.warning('请先选择文件');
      return;
    }

    setCompressing(true);
    setProgress(0);
    
    try {
      const zip = new JSZip();

      // 添加文件到压缩包
      files.forEach((fileItem, index) => {
        zip.file(fileItem.name, fileItem.file);
        setProgress(((index + 1) / files.length) * 50);
      });

      // 生成压缩包
      const content = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
      }, (metadata) => {
        setProgress(50 + (metadata.percent || 0) / 2);
      });

      // 下载文件
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      saveAs(content, `compressed_${timestamp}.zip`);
      message.success('压缩完成！');
    } catch (error) {
      console.error('压缩失败:', error);
      message.error('压缩失败，请重试');
    } finally {
      setCompressing(false);
      setProgress(0);
    }
  };

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);

  return (
    <div>
      <Card title="文件上传" style={{ marginBottom: 16 }}>
        <Dragger
          multiple
          beforeUpload={handleFileUpload}
          showUploadList={false}
          style={{ marginBottom: 16 }}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽文件到此区域</p>
          <p className="ant-upload-hint">支持单个或批量上传，支持所有文件格式</p>
        </Dragger>
        
        {files.length > 0 && (
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Text>已选择 {files.length} 个文件，总大小: {formatFileSize(totalSize)}</Text>
            <Button onClick={clearAllFiles} size="small">清空所有</Button>
          </Space>
        )}
      </Card>

      {files.length > 0 && (
        <Card title="文件列表" style={{ marginBottom: 16 }}>
          <List
            dataSource={files}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button 
                    type="text" 
                    danger 
                    icon={<DeleteOutlined />} 
                    onClick={() => removeFile(item.uid)}
                    size="small"
                  >
                    删除
                  </Button>
                ]}
              >
                <List.Item.Meta
                  title={item.name}
                  description={formatFileSize(item.size)}
                />
              </List.Item>
            )}
          />
        </Card>
      )}

      <Card title="压缩操作">
        {compressing && (
          <Progress 
            percent={Math.round(progress)} 
            status="active"
            style={{ marginBottom: 16 }}
          />
        )}
        
        <Button 
          type="primary" 
          icon={<DownloadOutlined />}
          onClick={handleCompress}
          loading={compressing}
          disabled={files.length === 0}
          size="large"
          block
        >
          {compressing ? '压缩中...' : `开始压缩 (${files.length} 个文件)`}
        </Button>
      </Card>
    </div>
  );
};

export default FileCompressor;