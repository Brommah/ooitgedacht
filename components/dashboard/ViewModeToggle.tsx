/**
 * ViewModeToggle - Pill toggle to switch between Customer and Builder views
 * 
 * Animated selection indicator with smooth transitions.
 * Compact design for header placement.
 * Theme-aware styling.
 */
import React from 'react';
import { motion } from 'framer-motion';
import { User, HardHat } from 'lucide-react';
import { ViewMode, ViewModeToggleProps } from './types';
import { useTheme } from '../../context/ThemeContext';

export const ViewModeToggle: React.FC<ViewModeToggleProps> = ({
  viewMode,
  onViewModeChange,
  className = '',
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const options: { value: ViewMode; label: string; icon: React.ReactNode }[] = [
    { value: 'customer', label: 'Bewoner', icon: <User size={14} /> },
    { value: 'builder', label: 'Bouwer', icon: <HardHat size={14} /> },
  ];

  return (
    <div 
      className={`relative flex items-center border rounded-full p-1 ${
        isDark 
          ? 'bg-white/5 border-white/10' 
          : 'bg-slate-100 border-slate-200'
      } ${className}`}
    >
      {/* Animated background pill */}
      <motion.div
        className={`absolute inset-y-1 w-[calc(50%-2px)] border rounded-full pointer-events-none ${
          isDark 
            ? 'bg-blue-500/15 border-blue-500/40' 
            : 'bg-sky-200 border-sky-300'
        }`}
        initial={false}
        animate={{
          left: viewMode === 'customer' ? 4 : 'calc(50% - 2px)',
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 35,
        }}
      />

      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onViewModeChange(option.value)}
          className={`relative z-10 flex-1 flex items-center justify-center gap-1 px-2 lg:px-4 py-1 lg:py-1.5 rounded-full text-xs lg:text-sm font-medium transition-colors whitespace-nowrap ${
            viewMode === option.value
              ? isDark ? 'text-blue-400' : 'text-sky-700'
              : isDark ? 'text-white/50 hover:text-white/70' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          {React.cloneElement(option.icon as React.ReactElement, { size: 12 })}
          <span>{option.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ViewModeToggle;
