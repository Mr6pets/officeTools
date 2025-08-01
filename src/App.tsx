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
          colorPrimary: theme.isDark ? '#9ca3c4' : '#8b8fb8',
          borderRadius: 8,
          colorBgContainer: theme.isDark ? '#2d3748' : '#fdfdfe',
          colorText: theme.isDark ? '#f1f5f9' : '#4a5568',
          colorTextSecondary: theme.isDark ? '#e2e8f0' : '#718096',
          colorBorder: theme.isDark ? '#4a5568' : '#e8edf3',
          colorBgBase: theme.isDark ? '#1a202c' : '#ffffff',
          colorBgLayout: theme.isDark ? '#1a202c' : '#f8fafc',
        },
        components: {
          Layout: {
            siderBg: theme.isDark ? 'rgba(26, 32, 44, 0.98)' : 'rgba(255, 255, 255, 0.98)',
            headerBg: theme.isDark ? 'rgba(45, 55, 72, 0.95)' : 'rgba(139, 143, 184, 0.95)',
            bodyBg: theme.isDark ? '#1a202c' : '#ffffff',
          },
          Menu: {
            itemBg: 'transparent',
            itemSelectedBg: theme.isDark ? 'rgba(156, 163, 196, 0.2)' : 'rgba(139, 143, 184, 0.1)',
            itemSelectedColor: theme.isDark ? '#ffffff' : '#8b8fb8',
            itemHoverBg: theme.isDark ? 'rgba(156, 163, 196, 0.1)' : 'rgba(139, 143, 184, 0.05)',
            colorText: theme.isDark ? '#e2e8f0' : '#4a5568',
            colorTextSecondary: theme.isDark ? '#cbd5e1' : '#718096',
          },
          Card: {
            colorBgContainer: theme.isDark ? 'rgba(45, 55, 72, 0.8)' : 'rgba(255, 255, 255, 0.95)',
            colorBorder: theme.isDark ? 'rgba(74, 85, 104, 0.5)' : 'rgba(226, 232, 240, 0.8)',
          },
          Button: {
            colorText: theme.isDark ? '#f1f5f9' : '#4a5568',
            colorBorder: theme.isDark ? 'rgba(74, 85, 104, 0.5)' : 'rgba(226, 232, 240, 0.8)',
          },
          Modal: {
            contentBg: theme.isDark ? '#2d3748' : '#ffffff',
            headerBg: theme.isDark ? '#2d3748' : '#ffffff',
            footerBg: theme.isDark ? '#2d3748' : '#ffffff',
          },
          Dropdown: {
            colorBgElevated: theme.isDark ? '#2d3748' : '#ffffff',
            colorBorder: theme.isDark ? 'rgba(74, 85, 104, 0.5)' : 'rgba(226, 232, 240, 0.8)',
          },
          Tooltip: {
            colorBgSpotlight: theme.isDark ? '#4a5568' : '#1f2937',
            colorTextLightSolid: theme.isDark ? '#f1f5f9' : '#ffffff',
          },
          Popover: {
            colorBgElevated: theme.isDark ? '#2d3748' : '#ffffff',
            colorBorder: theme.isDark ? 'rgba(74, 85, 104, 0.5)' : 'rgba(226, 232, 240, 0.8)',
          },
          Message: {
            colorBgElevated: theme.isDark ? '#2d3748' : '#ffffff',
            colorText: theme.isDark ? '#f1f5f9' : '#4a5568',
            colorBorder: theme.isDark ? 'rgba(74, 85, 104, 0.5)' : 'rgba(226, 232, 240, 0.8)',
          },
          Notification: {
            colorBgElevated: theme.isDark ? '#2d3748' : '#ffffff',
            colorBorder: theme.isDark ? 'rgba(74, 85, 104, 0.5)' : 'rgba(226, 232, 240, 0.8)',
            colorText: theme.isDark ? '#f1f5f9' : '#4a5568',
          },
          Select: {
            colorBgElevated: theme.isDark ? '#2d3748' : '#ffffff',
            optionSelectedBg: theme.isDark ? 'rgba(156, 163, 196, 0.2)' : 'rgba(139, 143, 184, 0.1)',
          },
          DatePicker: {
            colorBgElevated: theme.isDark ? '#2d3748' : '#ffffff',
            colorBorder: theme.isDark ? 'rgba(74, 85, 104, 0.5)' : 'rgba(226, 232, 240, 0.8)',
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
                  ? 'rgba(26, 32, 44, 0.95)' 
                  : 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                boxShadow: theme.isDark 
                  ? '4px 0 24px rgba(0, 0, 0, 0.3)' 
                  : '4px 0 24px rgba(0, 0, 0, 0.1)',
                borderRight: theme.isDark 
                  ? '1px solid rgba(74, 85, 104, 0.3)' 
                  : '1px solid rgba(255, 255, 255, 0.2)',
                position: 'relative',
                zIndex: 10
              }}
              className="glass-effect"
            >
            <div style={{ 
              padding: collapsed ? '24px 16px' : '40px 32px', 
              textAlign: collapsed ? 'center' : 'left',
              borderBottom: theme.isDark 
                ? '1px solid rgba(74, 85, 104, 0.2)' 
                : '1px solid rgba(255, 255, 255, 0.12)',
              background: theme.isDark 
                ? `
                  linear-gradient(135deg, #4a5568 0%, #2d3748 30%, #1a202c 70%, #0f1419 100%),
                  radial-gradient(ellipse at 25% 75%, rgba(156, 163, 196, 0.15) 0%, transparent 60%),
                  radial-gradient(ellipse at 75% 25%, rgba(156, 163, 196, 0.12) 0%, transparent 60%),
                  radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.03) 0%, transparent 70%)
                `
                : `
                  linear-gradient(135deg, #8b8fb8 0%, #7db3c7 25%, #9ca3d4 50%, #a8b2e5 75%, #b5c4f0 100%),
                  radial-gradient(ellipse at 25% 75%, rgba(255, 255, 255, 0.15) 0%, transparent 60%),
                  radial-gradient(ellipse at 75% 25%, rgba(255, 255, 255, 0.12) 0%, transparent 60%),
                  radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.08) 0%, transparent 70%)
                `,
              color: 'white',
              boxShadow: theme.isDark 
                ? `
                  0 16px 48px rgba(0, 0, 0, 0.5),
                  0 8px 24px rgba(0, 0, 0, 0.3),
                  inset 0 1px 0 rgba(156, 163, 196, 0.25),
                  inset 0 -1px 0 rgba(0, 0, 0, 0.3),
                  inset 1px 0 0 rgba(156, 163, 196, 0.1),
                  inset -1px 0 0 rgba(0, 0, 0, 0.2)
                `
                : `
                  0 16px 48px rgba(139, 143, 184, 0.25),
                  0 8px 24px rgba(139, 143, 184, 0.15),
                  inset 0 1px 0 rgba(255, 255, 255, 0.3),
                  inset 0 -1px 0 rgba(0, 0, 0, 0.08),
                  inset 1px 0 0 rgba(255, 255, 255, 0.15),
                  inset -1px 0 0 rgba(0, 0, 0, 0.05)
                `,
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              backdropFilter: 'blur(30px)'
            }} className="hover-lift">
              {/* 装饰性背景元素 */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: theme.isDark 
                  ? `
                    radial-gradient(ellipse 120% 80% at 30% 40%, rgba(156, 163, 196, 0.08) 0%, transparent 60%),
                    radial-gradient(ellipse 100% 60% at 70% 60%, rgba(156, 163, 196, 0.06) 0%, transparent 50%),
                    linear-gradient(45deg, transparent 30%, rgba(156, 163, 196, 0.02) 50%, transparent 70%),
                    conic-gradient(from 45deg at 80% 20%, transparent 0deg, rgba(156, 163, 196, 0.03) 90deg, transparent 180deg)
                  `
                  : `
                    radial-gradient(ellipse 120% 80% at 30% 40%, rgba(255, 255, 255, 0.12) 0%, transparent 60%),
                    radial-gradient(ellipse 100% 60% at 70% 60%, rgba(255, 255, 255, 0.08) 0%, transparent 50%),
                    linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.04) 50%, transparent 70%),
                    conic-gradient(from 45deg at 80% 20%, transparent 0deg, rgba(255, 255, 255, 0.05) 90deg, transparent 180deg)
                  `,
                pointerEvents: 'none',
                opacity: 0.8
              }} />
              
              {/* 动态光效元素 */}
              <div style={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: theme.isDark
                  ? 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(156, 163, 196, 0.02) 60deg, transparent 120deg, rgba(156, 163, 196, 0.01) 180deg, transparent 240deg, rgba(156, 163, 196, 0.02) 300deg, transparent 360deg)'
                  : 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(255, 255, 255, 0.03) 60deg, transparent 120deg, rgba(255, 255, 255, 0.02) 180deg, transparent 240deg, rgba(255, 255, 255, 0.03) 300deg, transparent 360deg)',
                animation: 'rotate 20s linear infinite',
                pointerEvents: 'none',
                opacity: 0.6
              }} />
              
              <div style={{
                position: 'absolute',
                top: '-50%',
                right: '-20%',
                width: '100px',
                height: '100px',
                background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
                borderRadius: '50%',
                pointerEvents: 'none'
              }} />
              <div style={{
                position: 'absolute',
                bottom: '-30%',
                left: '-10%',
                width: '80px',
                height: '80px',
                background: 'radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%)',
                borderRadius: '50%',
                pointerEvents: 'none'
              }} />
              
              {!collapsed ? (
                <>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '12px',
                    position: 'relative',
                    zIndex: 1
                  }}>
                    <div style={{
                      fontSize: '28px',
                      background: 'linear-gradient(135deg, #fff 0%, #f0f4f8 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
                      lineHeight: 1
                    }}>
                      🛠️
                    </div>
                    <div>
                      <Title level={3} style={{ 
                        margin: 0, 
                        color: 'white', 
                        fontWeight: 700,
                        fontSize: collapsed ? '20px' : '32px',
                        letterSpacing: '-0.02em',
                        background: theme.isDark
                          ? 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 25%, #cbd5e0 50%, #a0aec0 75%, #718096 100%)'
                          : 'linear-gradient(135deg, #ffffff 0%, #f7fafc 20%, #edf2f7 40%, #e2e8f0 60%, #cbd5e0 80%, #a0aec0 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 3s ease-in-out infinite',
                        textShadow: theme.isDark
                          ? '0 4px 8px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2)'
                          : '0 4px 8px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.05)',
                        lineHeight: '1.2'
                      }}>
                        Office Tools
                      </Title>
                      <div style={{
                        fontSize: '11px',
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontWeight: 500,
                        letterSpacing: '0.3px',
                        marginTop: '2px'
                      }}>
                        多功能办公工具集
                      </div>
                    </div>
                  </div>
                  
                  <div style={{
                    position: 'relative',
                    zIndex: 1
                  }}>
                    <div className="hero-section">
                    </div>
                  </div>
                  
                  {/* 底部装饰线 */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '60%',
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)',
                    borderRadius: '1px'
                  }} />
                </>
              ) : (
                <div style={{
                  position: 'relative',
                  zIndex: 1
                }}>
                  <Title level={4} style={{ 
                    margin: 0, 
                    color: 'white',
                    fontSize: '24px',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                  }}>🛠️</Title>
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
                ? 'linear-gradient(135deg, #4a5568 0%, #2d3748 100%)' 
                : 'linear-gradient(135deg, #8b8fb8 0%, #7a7fb0 100%)',
              backdropFilter: 'blur(20px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: theme.isDark 
                ? '1px solid rgba(74, 85, 104, 0.3)' 
                : '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: theme.isDark 
                ? '0 2px 8px rgba(0, 0, 0, 0.3)' 
                : '0 2px 8px rgba(0, 0, 0, 0.1)',
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
                    color: '#64748b',
                    transition: 'all 0.2s',
                    flexShrink: 0 // 防止按钮被压缩
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = theme.isDark ? 'rgba(74, 85, 104, 0.3)' : '#f1f5f9'}
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
                  color: '#fff', 
                  fontWeight: 700,
                  lineHeight: '1.2',
                  fontSize: '28px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  background: theme.isDark
                    ? 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 25%, #cbd5e0 50%, #a0aec0 75%, #718096 100%)'
                    : 'linear-gradient(135deg, #ffffff 0%, #f7fafc 20%, #edf2f7 40%, #e2e8f0 60%, #cbd5e0 80%, #a0aec0 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 3s ease-in-out infinite',
                  textShadow: theme.isDark
                    ? '0 4px 8px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2)'
                    : '0 4px 8px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.05)',
                  letterSpacing: '-0.02em',
                  maxWidth: '100%',
                  width: '100%'
                }}>
                    {getPageTitle()}
                  </Title>
                  <Text style={{ 
                    color: 'rgba(255, 255, 255, 0.95)', 
                    fontSize: '15px',
                    lineHeight: '1.5',
                    display: 'block',
                    marginTop: '4px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    background: 'rgba(255, 255, 255, 0.15)',
                    padding: '4px 12px',
                    borderRadius: '16px',
                    backdropFilter: 'blur(15px)',
                    maxWidth: '100%',
                    width: 'fit-content',
                    fontWeight: '500',
                    letterSpacing: '0.02em',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
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
              ? 'rgba(26, 32, 44, 0.98)' 
              : 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
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