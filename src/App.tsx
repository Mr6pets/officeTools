import React, { useState } from 'react';
import { Layout, Menu, Typography, ConfigProvider, Avatar, Dropdown, theme as antdTheme, App as AntdApp } from 'antd';
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
  BgColorsOutlined,
  SwapOutlined,
  EditOutlined,
  CodeOutlined,
  GlobalOutlined,
  SafetyOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  DiffOutlined
} from '@ant-design/icons';
import { useTheme } from './hooks/useTheme';
import ThemeToggle from './components/ThemeToggle';

// 导入样式
import './styles/modern.css';
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
import FileConverter from './components/FileConverter';
import ImageEditor from './components/ImageEditor';
import JSONFormatter from './components/JSONFormatter';
import NetworkTools from './components/NetworkTools';
import RegexTester from './components/RegexTester';
import TimestampConverter from './components/TimestampConverter';
import CryptoTools from './components/CryptoTools';
import ColorConverter from './components/ColorConverter';
import MarkdownEditor from './components/MarkdownEditor';
import CodeFormatter from './components/CodeFormatter';
import TextDiff from './components/TextDiff';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

type MenuKey = 'compress' | 'convert' | 'ocr' | 'imageCompress' | 'imageEditor' | 'pdf' | 'text' | 'qrcode' | 'calculator' | 'generator' | 'colorpicker' | 'jsonFormatter' | 'networkTools' | 'regexTester' | 'timestampConverter' | 'cryptoTools' | 'colorConverter' | 'markdownEditor' | 'codeFormatter' | 'textDiff' | 'settings';

const App: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState<MenuKey>('compress');
  const [collapsed, setCollapsed] = useState(false);
  const { theme } = useTheme();

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
          key: 'convert',
          icon: <SwapOutlined />,
          label: '格式转换',
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
        {
          key: 'imageEditor',
          icon: <EditOutlined />,
          label: '图片编辑',
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
          key: 'markdownEditor',
          icon: <FileTextOutlined />,
          label: 'Markdown编辑器',
        },
        {
          key: 'textDiff',
          icon: <DiffOutlined />,
          label: '文本对比',
        },
        {
          key: 'qrcode',
          icon: <QrcodeOutlined />,
          label: '二维码',
        },
      ],
    },
    {
      key: 'developer',
      label: '开发工具',
      type: 'group',
      children: [
        {
          key: 'jsonFormatter',
          icon: <CodeOutlined />,
          label: 'JSON格式化',
        },
        {
          key: 'codeFormatter',
          icon: <CodeOutlined />,
          label: '代码格式化',
        },
        {
          key: 'regexTester',
          icon: <CodeOutlined />,
          label: '正则测试',
        },
      ],
    },
    {
      key: 'network',
      label: '网络工具',
      type: 'group',
      children: [
        {
          key: 'networkTools',
          icon: <GlobalOutlined />,
          label: '网络工具',
        },
        {
          key: 'cryptoTools',
          icon: <SafetyOutlined />,
          label: '加密解密',
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
          key: 'timestampConverter',
          icon: <ClockCircleOutlined />,
          label: '时间戳转换',
        },
        {
          key: 'colorpicker',
          icon: <BgColorsOutlined />,
          label: '颜色取值器',
        },
        {
          key: 'colorConverter',
          icon: <BgColorsOutlined />,
          label: '颜色转换',
        },
      ],
    },
  ];

  const getPageTitle = () => {
    const titles = {
      compress: '文件压缩',
      convert: '格式转换',
      ocr: '图片识字',
      imageCompress: '图片压缩',
      imageEditor: '图片编辑器',
      pdf: 'PDF工具',
      text: '文本处理',
      markdownEditor: 'Markdown编辑器',
      textDiff: '文本差异对比',
      qrcode: '二维码工具',
      calculator: '计算器',
      generator: '生成器',
      timestampConverter: '时间戳转换',
      colorpicker: '颜色取值器',
      colorConverter: '颜色转换器',
      jsonFormatter: 'JSON格式化',
      codeFormatter: '代码格式化',
      regexTester: '正则表达式测试',
      networkTools: '网络工具',
      cryptoTools: '加密解密工具',
      settings: '应用设置'
    };
    return titles[selectedKey] || '办公工具';
  };

  const getPageDescription = () => {
    const descriptions = {
      compress: '快速压缩各种格式文件，节省存储空间',
      convert: '支持多种文件格式之间的转换',
      ocr: '智能识别图片中的文字内容',
      imageCompress: '无损压缩图片，保持质量的同时减小文件大小',
      imageEditor: '功能强大的在线图片编辑器，支持滤镜、文字等',
      pdf: '全面的PDF处理工具集',
      text: '强大的文本编辑和格式化工具',
      markdownEditor: '实时预览的Markdown编辑器',
      textDiff: '对比两个文本的差异，支持多种对比模式',
      qrcode: '生成和识别二维码',
      calculator: '多功能科学计算器',
      generator: '随机数据生成工具',
      timestampConverter: '时间戳与日期时间的双向转换工具',
      colorpicker: '专业的颜色选择和转换工具',
      colorConverter: '多种颜色格式转换工具',
      jsonFormatter: 'JSON数据格式化、验证和分析工具',
      codeFormatter: '多语言代码格式化和美化工具',
      regexTester: '正则表达式测试和验证工具',
      networkTools: 'URL编码、Base64、Hash等网络工具集',
      cryptoTools: 'AES、DES加密解密和Hash计算工具',
      settings: '个性化配置您的办公工具体验'
    };
    return descriptions[selectedKey] || '高效的办公工具集合';
  };

  const renderContent = () => {
    switch (selectedKey) {
      case 'compress':
        return <FileCompressor />;
      case 'convert':
        return <FileConverter />;
      case 'ocr':
        return <ImageOCR />;
      case 'imageCompress':
        return <ImageCompressor />;
      case 'imageEditor':
        return <ImageEditor />;
      case 'pdf':
        return <PDFTools />;
      case 'text':
        return <TextTools />;
      case 'markdownEditor':
        return <MarkdownEditor />;
      case 'textDiff':
        return <TextDiff />;
      case 'qrcode':
        return <QRCodeTools />;
      case 'calculator':
        return <Calculator />;
      case 'generator':
        return <Generator />;
      case 'timestampConverter':
        return <TimestampConverter />;
      case 'colorpicker':
        return <ColorPicker />;
      case 'colorConverter':
        return <ColorConverter />;
      case 'jsonFormatter':
        return <JSONFormatter />;
      case 'codeFormatter':
        return <CodeFormatter />;
      case 'regexTester':
        return <RegexTester />;
      case 'networkTools':
        return <NetworkTools />;
      case 'cryptoTools':
        return <CryptoTools />;
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
        algorithm: theme.isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: theme.isDark ? '#3b82f6' : '#2563eb',
          borderRadius: 6,
          colorBgContainer: theme.isDark ? '#1f2937' : '#ffffff',
          colorText: theme.isDark ? '#f9fafb' : '#374151',
          colorTextSecondary: theme.isDark ? '#d1d5db' : '#6b7280',
          colorBorder: theme.isDark ? '#374151' : '#e5e7eb',
          colorBgBase: theme.isDark ? '#111827' : '#ffffff',
          colorBgLayout: theme.isDark ? '#111827' : '#f9fafb',
        },
        components: {
          Layout: {
            siderBg: theme.isDark ? '#1f2937' : '#ffffff',
            headerBg: theme.isDark ? '#1f2937' : '#ffffff',
            bodyBg: theme.isDark ? '#111827' : '#ffffff',
          },
          Menu: {
            itemBg: 'transparent',
            itemSelectedBg: theme.isDark ? '#3b82f6' : '#2563eb',
            itemSelectedColor: '#ffffff',
            itemHoverBg: theme.isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(37, 99, 235, 0.1)',
            colorText: theme.isDark ? '#d1d5db' : '#6b7280',
            colorTextSecondary: theme.isDark ? '#9ca3af' : '#9ca3af',
          },
          Card: {
            colorBgContainer: theme.isDark ? '#1f2937' : '#ffffff',
            colorBorder: theme.isDark ? '#374151' : '#e5e7eb',
          },
          Button: {
            colorText: theme.isDark ? '#f9fafb' : '#374151',
            colorBorder: theme.isDark ? '#374151' : '#e5e7eb',
          },
          Modal: {
            contentBg: theme.isDark ? '#1f2937' : '#ffffff',
            headerBg: theme.isDark ? '#1f2937' : '#ffffff',
            footerBg: theme.isDark ? '#1f2937' : '#ffffff',
          },
          Dropdown: {
            colorBgElevated: theme.isDark ? '#1f2937' : '#ffffff',
            colorBorder: theme.isDark ? '#374151' : '#e5e7eb',
          },
          Tooltip: {
            colorBgSpotlight: theme.isDark ? '#374151' : '#1f2937',
            colorTextLightSolid: '#ffffff',
          },
          Popover: {
            colorBgElevated: theme.isDark ? '#1f2937' : '#ffffff',
            colorBorder: theme.isDark ? '#374151' : '#e5e7eb',
          },
          Message: {
            colorBgElevated: theme.isDark ? '#1f2937' : '#ffffff',
            colorText: theme.isDark ? '#f9fafb' : '#374151',
            colorBorder: theme.isDark ? '#374151' : '#e5e7eb',
          },
          Notification: {
            colorBgElevated: theme.isDark ? '#1f2937' : '#ffffff',
            colorBorder: theme.isDark ? '#374151' : '#e5e7eb',
            colorText: theme.isDark ? '#f9fafb' : '#374151',
          },
          Select: {
            colorBgElevated: theme.isDark ? '#1f2937' : '#ffffff',
            optionSelectedBg: theme.isDark ? '#3b82f6' : '#2563eb',
          },
          DatePicker: {
            colorBgElevated: theme.isDark ? '#1f2937' : '#ffffff',
            colorBorder: theme.isDark ? '#374151' : '#e5e7eb',
          },

        },
      }}
    >
      <AntdApp>
        <Layout style={{ minHeight: '100vh' }}>
          <Sider 
              width={280} 
              collapsed={collapsed}
              style={{ 
                background: theme.isDark 
                  ? '#1f2937' 
                  : '#ffffff',
                backdropFilter: 'blur(20px)',
                boxShadow: theme.isDark 
                  ? '4px 0 24px rgba(0, 0, 0, 0.2)' 
                  : '4px 0 24px rgba(0, 0, 0, 0.05)',
                borderRight: theme.isDark 
                  ? '1px solid #374151' 
                  : '1px solid #e5e7eb',
                position: 'relative',
                zIndex: 10
              }}
              className="glass-effect"
            >
            <div style={{ 
              padding: collapsed ? '20px 16px' : '24px 20px', 
              textAlign: collapsed ? 'center' : 'left',
              borderBottom: theme.isDark 
                ? '1px solid #374151' 
                : '1px solid #e5e7eb',
              background: theme.isDark 
                ? 'linear-gradient(135deg, #374151 0%, #1f2937 100%)'
                : '#ffffff',
              color: theme.isDark ? '#f9fafb' : '#374151',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
            }} className="hover-lift">
              {!collapsed ? (
                <>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px',
                    position: 'relative',
                    zIndex: 1
                  }}>
                    <div style={{
                      fontSize: '20px',
                      filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))',
                      lineHeight: 1
                    }}>
                      🛠️
                    </div>
                    <Title level={4} style={{ 
                      margin: 0, 
                      color: theme.isDark ? '#f9fafb' : '#374151', 
                      fontWeight: 600,
                      fontSize: '20px',
                      letterSpacing: '0px',
                      lineHeight: '1.3'
                    }}>
                      Office Tools
                    </Title>
                  </div>
                  
                  {/* 底部简单分割线 */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: '20%',
                    right: '20%',
                    height: '1px',
                    background: theme.isDark ? '#4b5563' : '#d1d5db'
                  }} />
                </>
              ) : (
                <div style={{
                  position: 'relative',
                  zIndex: 1
                }}>
                  <div style={{ 
                    fontSize: '18px',
                    textAlign: 'center'
                  }}>🛠️</div>
                </div>
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
                padding: '16px 8px',
                background: 'transparent',
                fontSize: '14px'
              }}
              className="modern-menu"
            />
          </Sider>
          
          <Layout style={{ background: 'transparent' }}>
            <Header style={{ 
              padding: '0 32px', 
              background: theme.isDark 
                ? '#1f2937' 
                : '#ffffff',
              backdropFilter: 'blur(20px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: theme.isDark 
                ? '1px solid #374151' 
                : '1px solid #e5e7eb',
              boxShadow: theme.isDark 
                ? '0 2px 8px rgba(0, 0, 0, 0.2)' 
                : '0 2px 8px rgba(0, 0, 0, 0.05)',
              height: '80px',
              minHeight: '80px'
            }} className="glass-effect">
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
                    color: theme.isDark ? '#9ca3af' : '#6b7280',
                    transition: 'all 0.2s',
                    flexShrink: 0 // 防止按钮被压缩
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = theme.isDark ? '#374151' : '#f3f4f6'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                </button>
                
                <div style={{
                  minWidth: 0,
                  flex: 1,
                  maxWidth: 'calc(100% - 100px)', // 为右侧按钮预留空间
                  overflow: 'hidden'
                }}>
                  <Title level={3} style={{ 
                  margin: 0, 
                  color: theme.isDark ? '#f9fafb' : '#374151', 
                  fontWeight: 700,
                  lineHeight: '1.2',
                  fontSize: '28px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  letterSpacing: '-0.02em',
                  maxWidth: '100%',
                  width: '100%'
                }}>
                    {getPageTitle()}
                  </Title>
                  <Text style={{ 
                    color: theme.isDark ? 'rgba(209, 213, 219, 0.8)' : 'rgba(107, 114, 128, 0.8)', 
                    fontSize: '15px',
                    lineHeight: '1.5',
                    display: 'block',
                    marginTop: '4px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    background: theme.isDark ? 'rgba(55, 65, 81, 0.5)' : 'rgba(243, 244, 246, 0.8)',
                    padding: '4px 12px',
                    borderRadius: '16px',
                    maxWidth: '100%',
                    width: 'fit-content',
                    fontWeight: '500',
                    letterSpacing: '0.02em',
                    border: theme.isDark ? '1px solid rgba(75, 85, 99, 0.3)' : '1px solid rgba(229, 231, 235, 0.5)',
                    boxShadow: theme.isDark ? '0 2px 8px rgba(0, 0, 0, 0.1)' : '0 2px 8px rgba(0, 0, 0, 0.05)'
                  }}>
                    {getPageDescription()}
                  </Text>
                </div>
              </div>
            
            <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
              <ThemeToggle variant="button" size="middle" />
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
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    color: '#fff'
                  }}
                  className="hover-lift" 
                />
              </Dropdown>
            </div>
          </Header>
          
          <Content style={{ 
            margin: '0', 
            padding: '24px', 
            background: theme.isDark 
              ? '#111827' 
              : '#f9fafb',
            borderRadius: '0',
            overflow: 'hidden',
            boxShadow: 'none',
            border: 'none',
            position: 'relative',
            height: 'calc(100vh - 80px)',
            maxWidth: '100%'
          }} className="modern-card glass-effect">
            <div className="fade-in">
              {renderContent()}
            </div>
          </Content>
        </Layout>
      </Layout>
    </AntdApp>
  </ConfigProvider>
);
}
export default App;