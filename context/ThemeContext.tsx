/**
 * ThemeContext - Light/Dark mode support
 * 
 * Light mode: Light blue (#e0f2fe) and cream white (#fefce8)
 * Dark mode: Deep navy (#0a1628)
 */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  colors: {
    // Backgrounds
    bg: string;
    bgSecondary: string;
    bgCard: string;
    bgHover: string;
    
    // Text
    text: string;
    textSecondary: string;
    textMuted: string;
    
    // Accents
    accent: string;
    accentLight: string;
    accentDark: string;
    
    // Borders
    border: string;
    borderLight: string;
    
    // Status colors
    success: string;
    warning: string;
    error: string;
  };
}

const lightColors = {
  bg: '#fefce8', // Cream white
  bgSecondary: '#fef9c3', // Light cream
  bgCard: '#ffffff',
  bgHover: '#e0f2fe', // Light sky blue
  
  text: '#1e293b', // Slate 800
  textSecondary: '#475569', // Slate 600
  textMuted: '#94a3b8', // Slate 400
  
  accent: '#0ea5e9', // Sky 500
  accentLight: '#e0f2fe', // Sky 100
  accentDark: '#0284c7', // Sky 600
  
  border: '#e0f2fe', // Sky 100
  borderLight: '#f0f9ff', // Sky 50
  
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
};

const darkColors = {
  bg: '#0a1628',
  bgSecondary: '#0d1525',
  bgCard: '#0d1525',
  bgHover: 'rgba(255, 255, 255, 0.05)',
  
  text: '#ffffff',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  textMuted: 'rgba(255, 255, 255, 0.4)',
  
  accent: '#3b82f6',
  accentLight: 'rgba(59, 130, 246, 0.2)',
  accentDark: '#2563eb',
  
  border: 'rgba(255, 255, 255, 0.1)',
  borderLight: 'rgba(255, 255, 255, 0.05)',
  
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'ooit-gedacht-theme';

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') {
        return saved;
      }
      // Check system preference
      if (window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light';
      }
    }
    return 'dark';
  });

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    
    // Update document class for global styling
    if (theme === 'light') {
      document.documentElement.classList.add('light-mode');
      document.documentElement.classList.remove('dark-mode');
    } else {
      document.documentElement.classList.add('dark-mode');
      document.documentElement.classList.remove('light-mode');
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const colors = theme === 'light' ? lightColors : darkColors;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    // Return default dark theme if not in provider
    return {
      theme: 'dark',
      toggleTheme: () => {},
      setTheme: () => {},
      colors: darkColors,
    };
  }
  return context;
};

export default ThemeContext;




