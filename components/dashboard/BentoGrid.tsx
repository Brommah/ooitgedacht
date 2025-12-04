import React from 'react';
import { motion } from 'framer-motion';

interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * BentoGrid - Asymmetric grid layout system
 * Use with BentoItem children to create Apple-style bento layouts
 */
export const BentoGrid: React.FC<BentoGridProps> = ({ children, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-5 ${className}`}>
      {children}
    </div>
  );
};

interface BentoItemProps {
  children: React.ReactNode;
  className?: string;
  /** 
   * Size variants:
   * - 1x1: Single cell (default)
   * - 2x1: Wide cell (spans 2 columns)
   * - 1x2: Tall cell (spans 2 rows)
   * - 2x2: Large cell (spans 2x2)
   */
  size?: '1x1' | '2x1' | '1x2' | '2x2';
  delay?: number;
}

/**
 * BentoItem - Grid item with size variants and entrance animation
 */
export const BentoItem: React.FC<BentoItemProps> = ({ 
  children, 
  className = '', 
  size = '1x1',
  delay = 0,
}) => {
  const sizeClasses = {
    '1x1': '',
    '2x1': 'md:col-span-2',
    '1x2': 'md:row-span-2',
    '2x2': 'md:col-span-2 md:row-span-2',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      }}
      className={`${sizeClasses[size]} ${className}`}
    >
      {children}
    </motion.div>
  );
};

/**
 * Container animation variants for staggered children
 */
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
};

/**
 * StaggeredGrid - Grid with automatic staggered entrance animations
 */
export const StaggeredGrid: React.FC<{
  children: React.ReactNode;
  className?: string;
  columns?: 1 | 2 | 3 | 4;
}> = ({ children, className = '', columns = 4 }) => {
  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 lg:grid-cols-2',
    3: 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3',
    4: 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-4',
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`grid ${colClasses[columns]} gap-4 lg:gap-5 ${className}`}
    >
      {React.Children.map(children, (child) => (
        <motion.div variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default BentoGrid;

