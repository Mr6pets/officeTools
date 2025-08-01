import React, { useState } from 'react';
import { Card, Typography, Form, Input, Button, message, Tabs, Divider, Space } from 'antd';
import { SettingOutlined, UserOutlined, LockOutlined, MailOutlined, BgColorsOutlined } from '@ant-design/icons';
import ThemeToggle from './ThemeToggle';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

// API 配置常量 - 移到文件顶部
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3088';

interface LoginForm {
  username: string;
  password: string;
}

interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Settings: React.FC = () => {
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const handleLogin = async (values: LoginForm) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        message.success(data.message);
        setIsLoggedIn(true);
        setCurrentUser(data.user);
        loginForm.resetFields();
      } else {
        message.error(data.error);
      }
    } catch (error) {
      message.error('网络错误，请检查后端服务是否启动');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values: RegisterForm) => {
    if (values.password !== values.confirmPassword) {
      message.error('两次输入的密码不一致');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: values.username,
          email: values.email,
          password: values.password,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        message.success(data.message);
        registerForm.resetFields();
      } else {
        message.error(data.error);
      }
    } catch (error) {
      message.error('网络错误，请检查后端服务是否启动');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    message.success('已退出登录');
  };

  if (isLoggedIn && currentUser) {
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px' }} className="fade-in">
        <Card 
          className="modern-card hover-lift scale-in"
          style={{ 
            textAlign: 'center',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
            maxWidth: '500px',
            margin: '0 auto'
          }}
        >
          <div style={{ marginBottom: '32px', padding: '24px 0' }}>
            <UserOutlined style={{ fontSize: '48px', color: '#6366f1', marginBottom: '16px' }} />
            <Title level={3} style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontSize: '28px',
              fontWeight: '700',
              marginBottom: '16px'
            }}>🎉 欢迎回来，{currentUser.username}！</Title>
            <Text style={{ 
              fontSize: '16px',
              color: '#6b7280',
              background: 'rgba(16, 185, 129, 0.1)',
              padding: '8px 16px',
              borderRadius: '20px',
              display: 'inline-block'
            }}>✅ 邮箱：{currentUser.email}</Text>
          </div>
          
          <Divider />
          
          <div style={{ textAlign: 'center' }}>
            <Button 
              type="primary" 
              danger 
              onClick={handleLogout}
              size="large"
              style={{
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                border: 'none',
                borderRadius: '8px',
                height: '48px',
                fontSize: '16px',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                marginTop: '16px'
              }}
              className="modern-button hover-lift"
            >
              🚪 安全退出
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const tabItems = [
    {
      key: 'theme',
      label: '🎨 主题设置',
      children: (
        <div style={{ padding: '24px 0', textAlign: 'center' }}>
          <BgColorsOutlined style={{ fontSize: '48px', color: '#6366f1', marginBottom: '16px' }} />
          <Title level={4} style={{ marginBottom: '24px', color: '#374151' }}>
            个性化主题设置
          </Title>
          <Text type="secondary" style={{ display: 'block', marginBottom: '32px' }}>
            选择您喜欢的主题模式，让工具更符合您的使用习惯
          </Text>
          
          <div style={{ 
            maxWidth: '400px', 
            margin: '0 auto',
            padding: '24px',
            background: 'rgba(99, 102, 241, 0.05)',
            borderRadius: '12px',
            border: '1px solid rgba(99, 102, 241, 0.1)'
          }}>
            <ThemeToggle variant="segmented" size="large" />
          </div>
          
          <div style={{ marginTop: '24px', textAlign: 'left', maxWidth: '400px', margin: '24px auto 0' }}>
            <Title level={5} style={{ marginBottom: '12px', color: '#374151' }}>主题说明：</Title>
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <Text type="secondary">☀️ <strong>浅色模式</strong>：适合白天使用，界面明亮清晰</Text>
              <Text type="secondary">🌙 <strong>暗黑模式</strong>：适合夜晚使用，减少眼部疲劳</Text>
              <Text type="secondary">🕐 <strong>自动模式</strong>：根据时间自动切换（6:00-18:00为浅色，18:00-6:00为暗黑）</Text>
            </Space>
          </div>
        </div>
      )
    },
    {
      key: 'login',
      label: '🔐 登录',
      children: (
        <Form
          form={loginForm}
          name="login"
          onFinish={handleLogin}
          layout="vertical"
          size="large"
          style={{ marginTop: '16px' }}
        >
          <Form.Item
            name="username"
            label={<span style={{ fontWeight: '500', color: '#374151' }}>用户名/邮箱</span>}
            rules={[{ required: true, message: '请输入用户名或邮箱' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="请输入用户名或邮箱" 
              size="large"
              style={{ 
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                transition: 'all 0.3s'
              }}
              className="hover-lift"
            />
          </Form.Item>
          
          <Form.Item
            name="password"
            label={<span style={{ fontWeight: '500', color: '#374151' }}>密码</span>}
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="请输入密码" 
              size="large"
              style={{ 
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                transition: 'all 0.3s'
              }}
              className="hover-lift"
            />
          </Form.Item>
          
          <Form.Item style={{ marginTop: '24px' }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              size="large"
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                border: 'none',
                borderRadius: '8px',
                height: '48px',
                fontSize: '16px',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
              }}
              className="modern-button hover-lift"
            >
              🚀 立即登录
            </Button>
          </Form.Item>
        </Form>
      )
    },
    {
      key: 'register',
      label: '📝 注册',
      children: (
        <Form
          form={registerForm}
          name="register"
          onFinish={handleRegister}
          layout="vertical"
          size="large"
          style={{ marginTop: '16px' }}
        >
          <Form.Item
            name="username"
            label={<span style={{ fontWeight: '500', color: '#374151' }}>用户名</span>}
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, message: '用户名至少3个字符' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="请输入用户名" 
              size="large"
              style={{ 
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                transition: 'all 0.3s'
              }}
              className="hover-lift"
            />
          </Form.Item>
          
          <Form.Item
            name="email"
            label={<span style={{ fontWeight: '500', color: '#374151' }}>邮箱</span>}
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="请输入邮箱" 
              size="large"
              style={{ 
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                transition: 'all 0.3s'
              }}
              className="hover-lift"
            />
          </Form.Item>
          
          <Form.Item
            name="password"
            label={<span style={{ fontWeight: '500', color: '#374151' }}>密码</span>}
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6个字符' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="请输入密码" 
              size="large"
              style={{ 
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                transition: 'all 0.3s'
              }}
              className="hover-lift"
            />
          </Form.Item>
          
          <Form.Item
            name="confirmPassword"
            label={<span style={{ fontWeight: '500', color: '#374151' }}>确认密码</span>}
            rules={[{ required: true, message: '请确认密码' }]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="请再次输入密码" 
              size="large"
              style={{ 
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                transition: 'all 0.3s'
              }}
              className="hover-lift"
            />
          </Form.Item>
          
          <Form.Item style={{ marginTop: '24px' }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              size="large"
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                border: 'none',
                borderRadius: '8px',
                height: '48px',
                fontSize: '16px',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(6, 182, 212, 0.3)'
              }}
              className="modern-button hover-lift"
            >
              ✨ 创建账户
            </Button>
          </Form.Item>
        </Form>
      )
    }
  ];

  return (
    <div>
      <Card className="modern-card hover-lift" style={{ 
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <Tabs defaultActiveKey="theme" centered items={tabItems} />
      </Card>
    </div>
  );
};

export default Settings;