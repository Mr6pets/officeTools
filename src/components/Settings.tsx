import React from 'react';
import { Card, Typography, Space } from 'antd';
import { SettingOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Settings: React.FC = () => {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ textAlign: 'center' }}>
          <SettingOutlined style={{ fontSize: '48px', color: '#6366f1', marginBottom: '16px' }} />
          <Title level={2} style={{ margin: 0 }}>
            应用设置
          </Title>
          <Text type="secondary" style={{ fontSize: '16px' }}>
            设置页面正在开发中...
          </Text>
        </div>
        
        <Card 
          style={{ 
            textAlign: 'center',
            minHeight: '300px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Space direction="vertical" size="middle">
            <Title level={4} type="secondary">
              🚧 功能开发中
            </Title>
            <Text type="secondary">
              这里将来会包含各种应用设置选项
            </Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              敬请期待后续更新
            </Text>
          </Space>
        </Card>
      </Space>
    </div>
  );
};

export default Settings;