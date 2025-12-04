/**
 * ThemeToggle - Beautiful sun/moon toggle for light/dark mode
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className={`relative w-14 h-7 rounded-full p-1 transition-colors duration-300 ${
        isDark 
          ? 'bg-slate-700' 
          : 'bg-slate-200 border border-slate-300'
      } ${className}`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {/* Track icons */}
      <div className="absolute inset-0 flex items-center justify-between px-1.5">
        <Sun size={14} className={`transition-opacity ${isDark ? 'opacity-30' : 'opacity-0'} text-amber-400`} />
        <Moon size={14} className={`transition-opacity ${isDark ? 'opacity-0' : 'opacity-30'} text-slate-400`} />
      </div>
      
      {/* Sliding indicator */}
      <motion.div
        className={`w-5 h-5 rounded-full flex items-center justify-center shadow-md ${
          isDark 
            ? 'bg-slate-900' 
            : 'bg-white'
        }`}
        animate={{
          x: isDark ? 0 : 28,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30,
        }}
      >
        {isDark ? (
          <Moon size={12} className="text-blue-400" />
        ) : (
          <Sun size={12} className="text-amber-500" />
        )}
      </motion.div>
    </button>
  );
};

export default ThemeToggle;

