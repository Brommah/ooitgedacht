import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'highlight' | 'success' | 'warning' | 'gradient';
  hover?: boolean;
  tilt?: boolean;
  glow?: boolean;
  delay?: number;
  onClick?: () => void;
}

/**
 * GlassCard - Theme-aware glassmorphism card component
 * Features:
 * - Dark mode: Frosted glass background with blur
 * - Light mode: Clean white/cream card with subtle shadows
 * - Multiple color variants
 * - Staggered entrance animations
 */
export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  variant = 'default',
  delay = 0,
  onClick,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Dark mode variants
  const darkVariants = {
    default: {
      bg: 'bg-white/[0.08]',
      border: 'border-white/[0.15]',
    },
    highlight: {
      bg: 'bg-blue-500/[0.15]',
      border: 'border-blue-500/30',
    },
    success: {
      bg: 'bg-emerald-500/[0.15]',
      border: 'border-emerald-500/30',
    },
    warning: {
      bg: 'bg-amber-500/[0.15]',
      border: 'border-amber-500/30',
    },
    gradient: {
      bg: 'bg-gradient-to-br from-blue-500/15 via-purple-500/10 to-emerald-500/15',
      border: 'border-white/15',
    },
  };

  // Light mode variants - clean white with subtle borders
  const lightVariants = {
    default: {
      bg: 'bg-white',
      border: 'border-slate-200',
      shadow: 'shadow-sm',
    },
    highlight: {
      bg: 'bg-white',
      border: 'border-sky-300',
      shadow: 'shadow-sm',
    },
    success: {
      bg: 'bg-white',
      border: 'border-emerald-200',
      shadow: 'shadow-sm',
    },
    warning: {
      bg: 'bg-white',
      border: 'border-amber-200',
      shadow: 'shadow-sm',
    },
    gradient: {
      bg: 'bg-white',
      border: 'border-slate-200',
      shadow: 'shadow-sm',
    },
  };

  const currentVariant = isDark ? darkVariants[variant] : lightVariants[variant];
  const shadow = !isDark && 'shadow' in currentVariant ? currentVariant.shadow : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      }}
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-2xl border 
        ${isDark ? 'backdrop-blur-xl' : ''}
        ${currentVariant.bg} ${currentVariant.border}
        ${shadow}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {/* Noise texture overlay - dark mode only */}
      {isDark && (
        <div 
          className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      )}

      {/* Inner gradient border - dark mode only */}
      {isDark && (
        <div className="absolute inset-0 rounded-2xl opacity-50 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)`,
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

/**
 * GlassCardHeader - Theme-aware header styling for glass cards
 */
export const GlassCardHeader: React.FC<{
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}> = ({ title, subtitle, icon, action }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        {icon && (
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isDark ? 'bg-white/10' : 'bg-sky-100'
          }`}>
            {icon}
          </div>
        )}
        <div>
          <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>{title}</h3>
          {subtitle && <p className={`text-xs mt-0.5 ${isDark ? 'text-white/50' : 'text-slate-500'}`}>{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
};

export default GlassCard;
