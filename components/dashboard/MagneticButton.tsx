import React from 'react';
import { motion } from 'framer-motion';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  magnetic?: boolean;
  onClick?: () => void;
}

/**
 * MagneticButton - Interactive button component
 * Features:
 * - Multiple variants and sizes
 * - Loading state with shimmer
 * - Icon support
 */
export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
}) => {
  // Variant styles (removed hover effects)
  const variants = {
    primary: `
      bg-gradient-to-r from-blue-500 to-blue-600
      text-white shadow-lg shadow-blue-500/25
    `,
    secondary: `
      bg-white/10 border border-white/20
      text-white
    `,
    ghost: `
      bg-transparent
      text-white/70
    `,
    success: `
      bg-gradient-to-r from-emerald-500 to-emerald-600
      text-white shadow-lg shadow-emerald-500/25
    `,
    warning: `
      bg-gradient-to-r from-amber-500 to-orange-500
      text-white shadow-lg shadow-amber-500/25
    `,
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
    md: 'px-4 py-2.5 text-sm rounded-xl gap-2',
    lg: 'px-6 py-3.5 text-base rounded-xl gap-2.5',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        relative inline-flex items-center justify-center font-semibold
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {/* Loading shimmer overlay */}
      {loading && (
        <motion.div
          className="absolute inset-0 rounded-inherit overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      )}

      {/* Content */}
      <span className="relative flex items-center gap-inherit">
        {icon && iconPosition === 'left' && (
          <span className={loading ? 'opacity-0' : ''}>{icon}</span>
        )}
        <span className={loading ? 'opacity-0' : ''}>{children}</span>
        {icon && iconPosition === 'right' && (
          <span className={loading ? 'opacity-0' : ''}>{icon}</span>
        )}
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <LoadingSpinner size={size === 'sm' ? 14 : size === 'md' ? 16 : 20} />
          </span>
        )}
      </span>
    </button>
  );
};

/**
 * LoadingSpinner - Animated loading indicator
 */
const LoadingSpinner: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className="animate-spin"
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      className="opacity-25"
    />
    <path
      d="M12 2a10 10 0 0 1 10 10"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      className="opacity-75"
    />
  </svg>
);

/**
 * ShimmerEffect - Reusable shimmer/skeleton loading effect
 */
export const ShimmerEffect: React.FC<{
  width?: string | number;
  height?: string | number;
  rounded?: string;
  className?: string;
}> = ({ width = '100%', height = 20, rounded = 'rounded-lg', className = '' }) => (
  <div
    className={`relative overflow-hidden bg-white/5 ${rounded} ${className}`}
    style={{ width, height }}
  >
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
      animate={{ x: ['-100%', '100%'] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
    />
  </div>
);

/**
 * PulseRing - Animated ring effect for notifications/alerts
 */
export const PulseRing: React.FC<{
  color?: string;
  size?: number;
  className?: string;
}> = ({ color = '#3b82f6', size = 12, className = '' }) => (
  <span className={`relative inline-flex ${className}`}>
    <span
      className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
      style={{ backgroundColor: color }}
    />
    <span
      className="relative inline-flex rounded-full"
      style={{ backgroundColor: color, width: size, height: size }}
    />
  </span>
);

/**
 * FloatingActionButton - FAB component
 */
export const FloatingActionButton: React.FC<{
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
  badge?: number;
}> = ({ icon, onClick, className = '', badge }) => {
  return (
    <button
      onClick={onClick}
      className={`
        relative w-14 h-14 rounded-full
        bg-gradient-to-br from-blue-500 to-blue-600
        shadow-lg shadow-blue-500/30
        flex items-center justify-center
        overflow-hidden
        ${className}
      `}
    >
      <span className="relative text-white">{icon}</span>

      {/* Badge */}
      {badge !== undefined && badge > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </button>
  );
};

export default MagneticButton;

