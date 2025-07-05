import React, { useState } from 'react';
import { Layout, Menu, Typography, theme, ConfigProvider } from 'antd';
import { 
  FileZipOutlined, 
  FileImageOutlined, 
  FilePdfOutlined,
  FontSizeOutlined,
  QrcodeOutlined,
  CalculatorOutlined,
  ToolOutlined
} from '@ant-design/icons';
import FileCompressor from './components/FileCompressor';
import ImageOCR from './components/ImageOCR';
import ImageCompressor from './components/ImageCompressor';
import PDFTools from './components/PDFTools';
import TextTools from './components/TextTools';
import QRCodeTools from './components/QRCodeTools';
import Calculator from './components/Calculator';
import Generator from './components/Generator';
import zhCN from 'antd/locale/zh_CN';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

type MenuKey = 'compress' | 'ocr' | 'imageCompress' | 'pdf' | 'text' | 'qrcode' | 'calculator' | 'generator';

const App: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState<MenuKey>('compress');
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: 'file',
      label: '文件处理',
      type: 'group',
      children: [
        {
          key: 'compress',
          icon: <FileZipOutlined />,
          label: '文件压缩',
        },
        {
          key: 'pdf',
          icon: <FilePdfOutlined />,
          label: 'PDF工具',
        },
      ],
    },
    {
      key: 'image',
      label: '图片工具',
      type: 'group',
      children: [
        {
          key: 'ocr',
          icon: <FileImageOutlined />,
          label: '图片识字',
        },
        {
          key: 'imageCompress',
          icon: <FileImageOutlined />,
          label: '图片压缩',
        },
      ],
    },
    {
      key: 'text',
      label: '文本工具',
      type: 'group',
      children: [
        {
          key: 'text',
          icon: <FontSizeOutlined />,
          label: '文本处理',
        },
        {
          key: 'qrcode',
          icon: <QrcodeOutlined />,
          label: '二维码',
        },
      ],
    },
    {
      key: 'utility',
      label: '实用工具',
      type: 'group',
      children: [
        {
          key: 'calculator',
          icon: <CalculatorOutlined />,
          label: '计算器',
        },
        {
          key: 'generator',
          icon: <ToolOutlined />,
          label: '生成器',
        },
      ],
    },
  ];

  const getPageTitle = () => {
    const titles = {
      compress: '文件压缩',
      ocr: '图片识字',
      imageCompress: '图片压缩',
      pdf: 'PDF工具',
      text: '文本处理',
      qrcode: '二维码工具',
      calculator: '计算器',
      generator: '生成器'
    };
    return titles[selectedKey] || '办公工具';
  };

  const renderContent = () => {
    switch (selectedKey) {
      case 'compress':
        return <FileCompressor />;
      case 'ocr':
        return <ImageOCR />;
      case 'imageCompress':
        return <ImageCompressor />;
      case 'pdf':
        return <PDFTools />;
      case 'text':
        return <TextTools />;
      case 'qrcode':
        return <QRCodeTools />;
      case 'calculator':
        return <Calculator />;
      case 'generator':
        return <Generator />;
      default:
        return <FileCompressor />;
    }
  };

  return (
    <ConfigProvider locale={zhCN}>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider width={250} style={{ background: colorBgContainer }}>
          <div style={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid #f0f0f0' }}>
            <Title level={4} style={{ margin: 0, color: '#1890ff' }}>Office Tools</Title>
            <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#666' }}>多功能办公工具集</p>
          </div>
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            items={menuItems}
            onClick={({ key }) => setSelectedKey(key as MenuKey)}
            style={{ borderRight: 0, height: 'calc(100vh - 80px)', overflowY: 'auto' }}
          />
        </Sider>
        <Layout>
          <Header style={{ 
            padding: '0 24px', 
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            borderBottom: '1px solid #f0f0f0'
          }}>
            <Title level={3} style={{ margin: 0 }}>
              {getPageTitle()}
            </Title>
          </Header>
          <Content style={{ 
            margin: '24px 16px', 
            padding: 24, 
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            overflow: 'auto'
          }}>
            {renderContent()}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default App;