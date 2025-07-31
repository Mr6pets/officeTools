import React from 'react';
import { Button, Segmented, Tooltip } from 'antd';
import { SunOutlined, MoonOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useTheme, ThemeMode } from '../hooks/useTheme';

interface ThemeToggleProps {
  variant?: 'button' | 'segmented';
  size?: 'small' | 'middle' | 'large';
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  variant = 'segmented', 
  size = 'middle' 
}) => {
  const { theme, setThemeMode, toggleTheme } = useTheme();

  const themeOptions = [
    {
      label: (
        <Tooltip title="浅色模式">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <SunOutlined />
            <span>浅色</span>
          </div>
        </Tooltip>
      ),
      value: 'light' as ThemeMode,
    },
    {
      label: (
        <Tooltip title="暗黑模式">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MoonOutlined />
            <span>暗黑</span>
          </div>
        </Tooltip>
      ),
      value: 'dark' as ThemeMode,
    },
    {
      label: (
        <Tooltip title="跟随时间自动切换（白天浅色，夜晚暗黑）">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ClockCircleOutlined />
            <span>自动</span>
          </div>
        </Tooltip>
      ),
      value: 'auto' as ThemeMode,
    },
  ];

  if (variant === 'button') {
    return (
      <Tooltip title={`当前：${theme.isDark ? '暗黑' : '浅色'}模式，点击切换`}>
        <Button
          type="text"
          icon={theme.isDark ? <MoonOutlined /> : <SunOutlined />}
          onClick={toggleTheme}
          size={size}
          style={{
            color: theme.isDark ? '#fbbf24' : '#f59e0b',
            border: 'none',
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            fontSize: '16px',
            width: '40px',
            height: '40px'
          }}
          className="hover-lift"
        />
      </Tooltip>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ 
        fontSize: '14px', 
        fontWeight: '500', 
        color: theme.isDark ? '#e2e8f0' : '#374151',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span>🎨 主题模式</span>
        {theme.mode === 'auto' && (
          <span style={{ 
            fontSize: '12px', 
            color: theme.isDark ? '#94a3b8' : '#6b7280',
            background: theme.isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(107, 114, 128, 0.1)',
            padding: '2px 8px',
            borderRadius: '12px'
          }}>
            当前：{theme.isDark ? '夜晚模式' : '白天模式'}
          </span>
        )}
      </div>
      <Segmented
        options={themeOptions}
        value={theme.mode}
        onChange={(value) => setThemeMode(value as ThemeMode)}
        size={size}
        style={{
          background: theme.isDark ? 'rgba(51, 65, 85, 0.5)' : 'rgba(243, 244, 246, 0.8)',
          border: theme.isDark ? '1px solid rgba(71, 85, 105, 0.5)' : '1px solid rgba(209, 213, 219, 0.5)',
          borderRadius: '12px',
          padding: '4px',
          backdropFilter: 'blur(10px)'
        }}
      />
    </div>
  );
};

export default ThemeToggle;