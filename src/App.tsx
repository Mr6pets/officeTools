import React, { useState } from 'react';
import { Layout, Menu, Typography, ConfigProvider, Avatar, Dropdown, theme as antdTheme } from 'antd';
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

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

// 移除重复的导入语句
// import Settings from './components/Settings';

type MenuKey = 'compress' | 'ocr' | 'imageCompress' | 'pdf' | 'text' | 'qrcode' | 'calculator' | 'generator' | 'colorpicker' | 'settings';

const App: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState<MenuKey>('compress');
  const [collapsed, setCollapsed] = useState(false);
  const { theme } = useTheme();
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
        },
      }}
    >
      <Layout style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e8edf3 0%, #f4f7fa 100%)' }} className="fade-in">
        <Sider 
            width={280} 
            collapsed={collapsed}
            style={{ 
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              boxShadow: '4px 0 24px rgba(0, 0, 0, 0.1)',
              borderRight: '1px solid rgba(255, 255, 255, 0.2)',
              position: 'relative',
              zIndex: 10
            }}
            className="glass-effect"
          >
          <div style={{ 
            padding: collapsed ? '20px 12px' : '32px 24px', 
            textAlign: collapsed ? 'center' : 'left',
            borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
            background: `
              linear-gradient(135deg, #8b8fb8 0%, #7db3c7 50%, #9ca3d4 100%),
              radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.08) 0%, transparent 50%)
            `,
            color: 'white',
            boxShadow: `
              0 8px 32px rgba(139, 143, 184, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.2),
              inset 0 -1px 0 rgba(0, 0, 0, 0.1)
            `,
            position: 'relative',
            overflow: 'hidden'
          }} className="hover-lift">
            {/* 装饰性背景元素 */}
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
                      fontSize: '20px',
                      letterSpacing: '0.5px',
                      background: 'linear-gradient(135deg, #fff 0%, #e2e8f0 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
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
                      Professional Suite
                    </div>
                  </div>
                </div>
                
                <div style={{
                  position: 'relative',
                  zIndex: 1
                }}>
                  <Text style={{ 
                    color: 'rgba(255,255,255,0.95)', 
                    fontSize: '13px',
                    fontWeight: 500,
                    background: `
                      linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%)
                    `,
                    padding: '8px 16px',
                    borderRadius: '20px',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: `
                      0 4px 16px rgba(0, 0, 0, 0.1),
                      inset 0 1px 0 rgba(255, 255, 255, 0.2)
                    `,
                    display: 'inline-block',
                    letterSpacing: '0.2px'
                  }}>
                    现代化办公工具集
                  </Text>
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
            background: 'linear-gradient(135deg, #8b8fb8 0%, #7a7fb0 100%)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
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
                onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
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
                  fontWeight: 600,
                  lineHeight: '1.2',
                  fontSize: '24px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  background: 'linear-gradient(135deg, #fff, #e2e8f0)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  maxWidth: '100%',
                  width: '100%'
                }}>
                  {getPageTitle()}
                </Title>
                <Text style={{ 
                  color: 'rgba(255, 255, 255, 0.9)', 
                  fontSize: '14px',
                  lineHeight: '1.4',
                  display: 'block',
                  marginTop: '2px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)',
                  maxWidth: '100%',
                  width: 'fit-content'
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
            background: 'rgba(255, 255, 255, 0.98)',
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
    </ConfigProvider>
  );
};

export default App;