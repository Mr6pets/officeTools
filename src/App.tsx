import React, { useState } from 'react';
import { Layout, Menu, Typography, ConfigProvider, Avatar, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { 
  FileZipOutlined, 
  FileImageOutlined, 
  FilePdfOutlined,
  FontSizeOutlined,
  QrcodeOutlined,
  CalculatorOutlined,
  ToolOutlined,
  SettingOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BgColorsOutlined
} from '@ant-design/icons';
import FileCompressor from './components/FileCompressor';
import ImageOCR from './components/ImageOCR';
import ImageCompressor from './components/ImageCompressor';
import PDFTools from './components/PDFTools';
import TextTools from './components/TextTools';
import QRCodeTools from './components/QRCodeTools';
import Calculator from './components/Calculator';
import Generator from './components/Generator';
import ColorPicker from './components/ColorPicker';
import zhCN from 'antd/locale/zh_CN';
import Settings from './components/Settings';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

// 移除重复的导入语句
// import Settings from './components/Settings';

type MenuKey = 'compress' | 'ocr' | 'imageCompress' | 'pdf' | 'text' | 'qrcode' | 'calculator' | 'generator' | 'colorpicker' | 'settings';

const App: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState<MenuKey>('compress');
  const [collapsed, setCollapsed] = useState(false);
  // 移除未使用的变量
  // const {
  //   token: { colorBgContainer, borderRadiusLG },
  // } = theme.useToken();

  const menuItems: MenuProps['items'] = [
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
        {
          key: 'colorpicker',
          icon: <BgColorsOutlined />,
          label: '颜色取值器',
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
      generator: '生成器',
      colorpicker: '颜色取值器',
      settings: '应用设置'
    };
    return titles[selectedKey] || '办公工具';
  };

  const getPageDescription = () => {
    const descriptions = {
      compress: '快速压缩各种格式文件，节省存储空间',
      ocr: '智能识别图片中的文字内容',
      imageCompress: '无损压缩图片，保持质量的同时减小文件大小',
      pdf: '全面的PDF处理工具集',
      text: '强大的文本编辑和格式化工具',
      qrcode: '生成和识别二维码',
      calculator: '多功能科学计算器',
      generator: '随机数据生成工具',
      colorpicker: '专业的颜色选择和转换工具',
      settings: '个性化配置您的办公工具体验'
    };
    return descriptions[selectedKey] || '高效的办公工具集合';
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
      case 'colorpicker':
        return <ColorPicker />;
      case 'settings':
        return <Settings />;
      default:
        return <FileCompressor />;
    }
  };

  const userMenuItems = [
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
    },
  ];

  return (
    <ConfigProvider 
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#6366f1',
          borderRadius: 8,
          colorBgContainer: '#ffffff',
        },
        components: {
          Layout: {
            siderBg: '#ffffff',
            headerBg: '#ffffff',
          },
          Menu: {
            itemBg: 'transparent',
            itemSelectedBg: '#f0f4ff',
            itemSelectedColor: '#6366f1',
            itemHoverBg: '#f8fafc',
          },
        },
      }}
    >
      <Layout style={{ minHeight: '100vh' }}>
        <Sider 
          width={280} 
          collapsed={collapsed}
          style={{ 
            background: '#ffffff',
            boxShadow: '2px 0 8px 0 rgba(29, 35, 42, 0.05)',
            borderRight: '1px solid #f0f0f0',
            position: 'relative',
            zIndex: 10
          }}
          className="glass-effect"
        >
          <div style={{ 
            padding: collapsed ? '16px 8px' : '24px 20px', 
            textAlign: collapsed ? 'center' : 'left',
            borderBottom: '1px solid #f0f0f0',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            color: 'white'
          }}>
            {!collapsed ? (
              <>
                <Title level={3} style={{ margin: 0, color: 'white', fontWeight: 600 }}>
                  Office Tools
                </Title>
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>
                  现代化办公工具集
                </Text>
              </>
            ) : (
              <Title level={4} style={{ margin: 0, color: 'white' }}>OT</Title>
            )}
          </div>
          
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            items={menuItems}
            onClick={({ key }) => setSelectedKey(key as MenuKey)}
            style={{ 
              borderRight: 0, 
              height: 'calc(100vh - 120px)', 
              overflowY: 'auto',
              padding: '16px 8px'
            }}
          />
        </Sider>
        
        <Layout>
          <Header style={{ 
            padding: '0 32px', 
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #f0f0f0',
            boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.05)',
            height: '80px', // 增加Header高度
            minHeight: '80px' // 确保最小高度
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '16px',
              flex: 1, // 让左侧内容占据可用空间
              minWidth: 0 // 防止内容溢出
            }}>
              <button
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  fontSize: '16px',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#64748b',
                  transition: 'all 0.2s',
                  flexShrink: 0 // 防止按钮被压缩
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              </button>
              
              <div style={{
                minWidth: 0, // 防止内容溢出
                flex: 1 // 让文字区域占据剩余空间
              }}>
                <Title level={3} style={{ 
                  margin: 0, 
                  color: '#1e293b', 
                  fontWeight: 600,
                  lineHeight: '1.2',
                  fontSize: '20px',
                  whiteSpace: 'nowrap', // 防止标题换行
                  overflow: 'hidden',
                  textOverflow: 'ellipsis' // 超长文字显示省略号
                }}>
                  {getPageTitle()}
                </Title>
                <Text style={{ 
                  color: '#64748b', 
                  fontSize: '14px',
                  lineHeight: '1.4',
                  display: 'block',
                  marginTop: '2px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {getPageDescription()}
                </Text>
              </div>
            </div>
            
            <div style={{ flexShrink: 0 }}>
              <Dropdown 
                menu={{ 
                  items: userMenuItems,
                  onClick: ({ key }) => {
                    if (key === 'settings') {
                      setSelectedKey('settings');
                    }
                  }
                }} 
                placement="bottomRight"
              >
                <Avatar 
                  icon={<UserOutlined />} 
                  style={{ 
                    backgroundColor: '#6366f1',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)'
                  }} 
                />
              </Dropdown>
            </div>
          </Header>
          
          <Content style={{ 
            margin: '24px', 
            padding: '32px', 
            background: '#ffffff',
            borderRadius: '12px',
            overflow: 'auto',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
            position: 'relative',
            height: 'calc(100vh - 128px)' // 调整内容区域高度，考虑Header的新高度
          }}>
            <div className="fade-in">
              {renderContent()}
            </div>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default App;