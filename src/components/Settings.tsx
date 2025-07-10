import React, { useState } from 'react';
import { Card, Typography, Form, Input, Button, message, Tabs, Divider } from 'antd';
import { SettingOutlined, UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';

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
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
        <Card>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <UserOutlined style={{ fontSize: '48px', color: '#6366f1', marginBottom: '16px' }} />
            <Title level={3}>欢迎回来，{currentUser.username}！</Title>
            <Text type="secondary">邮箱：{currentUser.email}</Text>
          </div>
          
          <Divider />
          
          <div style={{ textAlign: 'center' }}>
            <Button type="primary" danger onClick={handleLogout}>
              退出登录
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <SettingOutlined style={{ fontSize: '48px', color: '#6366f1', marginBottom: '16px' }} />
        <Title level={2}>用户中心</Title>
        <Text type="secondary">登录或注册您的账户</Text>
      </div>
      
      <Card>
        <Tabs defaultActiveKey="login" centered>
          <TabPane tab="登录" key="login">
            <Form
              form={loginForm}
              name="login"
              onFinish={handleLogin}
              layout="vertical"
              size="large"
            >
              <Form.Item
                name="username"
                label="用户名/邮箱"
                rules={[{ required: true, message: '请输入用户名或邮箱' }]}
              >
                <Input 
                  prefix={<UserOutlined />} 
                  placeholder="请输入用户名或邮箱" 
                />
              </Form.Item>
              
              <Form.Item
                name="password"
                label="密码"
                rules={[{ required: true, message: '请输入密码' }]}
              >
                <Input.Password 
                  prefix={<LockOutlined />} 
                  placeholder="请输入密码" 
                />
              </Form.Item>
              
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  style={{ width: '100%' }}
                >
                  登录
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
          
          <TabPane tab="注册" key="register">
            <Form
              form={registerForm}
              name="register"
              onFinish={handleRegister}
              layout="vertical"
              size="large"
            >
              <Form.Item
                name="username"
                label="用户名"
                rules={[
                  { required: true, message: '请输入用户名' },
                  { min: 3, message: '用户名至少3个字符' }
                ]}
              >
                <Input 
                  prefix={<UserOutlined />} 
                  placeholder="请输入用户名" 
                />
              </Form.Item>
              
              <Form.Item
                name="email"
                label="邮箱"
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '请输入有效的邮箱地址' }
                ]}
              >
                <Input 
                  prefix={<MailOutlined />} 
                  placeholder="请输入邮箱" 
                />
              </Form.Item>
              
              <Form.Item
                name="password"
                label="密码"
                rules={[
                  { required: true, message: '请输入密码' },
                  { min: 6, message: '密码至少6个字符' }
                ]}
              >
                <Input.Password 
                  prefix={<LockOutlined />} 
                  placeholder="请输入密码" 
                />
              </Form.Item>
              
              <Form.Item
                name="confirmPassword"
                label="确认密码"
                rules={[{ required: true, message: '请确认密码' }]}
              >
                <Input.Password 
                  prefix={<LockOutlined />} 
                  placeholder="请再次输入密码" 
                />
              </Form.Item>
              
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  style={{ width: '100%' }}
                >
                  注册
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default Settings;