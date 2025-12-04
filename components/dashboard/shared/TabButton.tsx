import React from 'react';
import { useTheme } from '../../../context/ThemeContext';

interface TabButtonProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  badge?: number;
}

export const TabButton: React.FC<TabButtonProps> = ({ icon, label, active, onClick, badge }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl relative transition-colors ${
        active 
          ? isDark 
            ? 'text-blue-400 bg-blue-500/10' 
            : 'text-sky-600 bg-sky-50'
          : isDark 
            ? 'text-white/40' 
            : 'text-slate-400'
      }`}
    >
      <div className="relative">
        {icon}
        {badge && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {badge}
          </span>
        )}
      </div>
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
};
