import { useState, useEffect } from 'react';

export type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeConfig {
  mode: ThemeMode;
  isDark: boolean;
}

const THEME_STORAGE_KEY = 'office-tools-theme';

// 获取当前时间是否为夜晚（18:00 - 6:00）
const isNightTime = (): boolean => {
  const hour = new Date().getHours();
  return hour >= 18 || hour < 6;
};

// 应用主题到document
const applyTheme = (isDark: boolean) => {
  if (isDark) {
    document.documentElement.classList.add('dark');
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    document.documentElement.setAttribute('data-theme', 'light');
  }
};

export const useTheme = (): {
  theme: ThemeConfig;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
} => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return (saved as ThemeMode) || 'auto';
  });

  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
    return isNightTime();
  });

  // 监听系统主题变化
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (themeMode === 'auto') {
        setIsDark(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [themeMode]);

  // 监听时间变化（用于auto模式）
  useEffect(() => {
    if (themeMode !== 'auto') return;

    const checkTime = () => {
      const nightTime = isNightTime();
      if (nightTime !== isDark) {
        setIsDark(nightTime);
      }
    };

    // 每分钟检查一次时间
    const interval = setInterval(checkTime, 60000);
    
    // 立即检查一次
    checkTime();

    return () => clearInterval(interval);
  }, [themeMode, isDark]);

  // 应用主题
  useEffect(() => {
    applyTheme(isDark);
  }, [isDark]);

  // 保存主题设置
  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, themeMode);
  }, [themeMode]);

  const handleSetThemeMode = (mode: ThemeMode) => {
    setThemeMode(mode);
    
    if (mode === 'light') {
      setIsDark(false);
    } else if (mode === 'dark') {
      setIsDark(true);
    } else {
      // auto模式：根据时间或系统偏好设置
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const nightTime = isNightTime();
      setIsDark(systemPrefersDark || nightTime);
    }
  };

  const toggleTheme = () => {
    if (themeMode === 'auto') {
      handleSetThemeMode(isDark ? 'light' : 'dark');
    } else {
      handleSetThemeMode(themeMode === 'light' ? 'dark' : 'light');
    }
  };

  return {
    theme: {
      mode: themeMode,
      isDark
    },
    setThemeMode: handleSetThemeMode,
    toggleTheme
  };
};