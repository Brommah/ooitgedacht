import React from 'react';
import { ArrowRight } from 'lucide-react';

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  showArrow?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

/**
 * Unified button component for the OoitGedacht app.
 * Light blue pill-shaped buttons with arrow.
 */
export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  showArrow = true,
  fullWidth = false,
  icon,
}) => {
  const baseStyles = 'group font-semibold transition-all duration-300 flex items-center justify-between gap-4 rounded-full relative overflow-hidden';
  
  const sizeStyles = {
    sm: 'px-5 py-2.5 text-sm',
    md: 'px-6 py-3.5 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variantStyles = {
    primary: 'bg-blue-400 hover:bg-blue-300 text-[#0a1628] shadow-lg shadow-blue-400/25 hover:shadow-blue-300/40 hover:scale-[1.02]',
    secondary: 'bg-blue-500/15 hover:bg-blue-500/25 text-blue-400 border border-blue-500/30 hover:border-blue-400/50',
    outline: 'bg-transparent hover:bg-blue-500/10 text-blue-400 border border-blue-400/50 hover:border-blue-400',
    ghost: 'bg-transparent hover:bg-blue-500/10 text-blue-400',
  };

  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : '';
  const widthStyles = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${disabledStyles} ${widthStyles} ${className}`}
    >
      {/* Shimmer effect on hover */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
      
      <span className="relative flex items-center gap-2">
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
      </span>
      
      {showArrow && (
        <ArrowRight 
          size={size === 'sm' ? 16 : size === 'lg' ? 22 : 18} 
          className="relative flex-shrink-0 group-hover:translate-x-1 transition-transform duration-300" 
        />
      )}
    </button>
  );
};

/**
 * Secondary/text button with just text and optional arrow
 */
export const TextButton: React.FC<Omit<PrimaryButtonProps, 'variant'>> = ({
  children,
  onClick,
  size = 'md',
  className = '',
  showArrow = false,
}) => {
  const sizeStyles = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <button
      onClick={onClick}
      className={`group text-white/60 hover:text-white transition-colors flex items-center gap-2 ${sizeStyles[size]} ${className}`}
    >
      {children}
      {showArrow && (
        <ArrowRight 
          size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} 
          className="group-hover:translate-x-1 transition-transform" 
        />
      )}
    </button>
  );
};

export default PrimaryButton;





