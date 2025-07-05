import React, { useState } from 'react';
import { Card, Upload, Button, Space, Tabs, message } from 'antd';
import { FilePdfOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';

const { TabPane } = Tabs;

const PDFTools: React.FC = () => {
  return (
    <Tabs defaultActiveKey="merge">
      <TabPane tab="PDF合并" key="merge">
        <PDFMerger />
      </TabPane>
      <TabPane tab="PDF分割" key="split">
        <PDFSplitter />
      </TabPane>
    </Tabs>
  );
};

const PDFMerger: React.FC = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [processing, setProcessing] = useState(false);

  const handleUpload = (info: any) => {
    setFileList(info.fileList);
  };

  const mergePDFs = () => {
    if (fileList.length < 2) {
      message.warning('请至少上传2个PDF文件');
      return;
    }
    setProcessing(true);
    // PDF合并逻辑
    setTimeout(() => {
      setProcessing(false);
      message.success('PDF合并完成');
    }, 2000);
  };

  return (
    <Card title="PDF合并">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Upload.Dragger
          multiple
          accept=".pdf"
          fileList={fileList}
          onChange={handleUpload}
          beforeUpload={() => false}
        >
          <p className="ant-upload-drag-icon">
            <FilePdfOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽PDF文件到此区域上传</p>
          <p className="ant-upload-hint">支持多个PDF文件同时上传</p>
        </Upload.Dragger>
        
        <Button 
          type="primary" 
          onClick={mergePDFs} 
          loading={processing}
          disabled={fileList.length < 2}
          block
        >
          合并PDF
        </Button>
      </Space>
    </Card>
  );
};

const PDFSplitter: React.FC = () => {
  const [file, setFile] = useState<UploadFile | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleUpload = (info: any) => {
    setFile(info.file);
  };

  const splitPDF = () => {
    if (!file) {
      message.warning('请先上传PDF文件');
      return;
    }
    setProcessing(true);
    // PDF分割逻辑
    setTimeout(() => {
      setProcessing(false);
      message.success('PDF分割完成');
    }, 2000);
  };

  return (
    <Card title="PDF分割">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Upload.Dragger
          accept=".pdf"
          maxCount={1}
          onChange={handleUpload}
          beforeUpload={() => false}
        >
          <p className="ant-upload-drag-icon">
            <FilePdfOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽PDF文件到此区域上传</p>
          <p className="ant-upload-hint">仅支持单个PDF文件</p>
        </Upload.Dragger>
        
        <Button 
          type="primary" 
          onClick={splitPDF} 
          loading={processing}
          disabled={!file}
          block
        >
          分割PDF
        </Button>
      </Space>
    </Card>
  );
};

export default PDFTools;