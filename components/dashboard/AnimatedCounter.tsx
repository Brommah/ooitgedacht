import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  decimals?: number;
  className?: string;
  once?: boolean;
}

/**
 * AnimatedCounter - Smooth number animation on scroll into view
 * Features:
 * - Spring-based animation for natural feel
 * - Triggers on scroll into view
 * - Supports prefix/suffix (€, %, etc.)
 * - Configurable decimals
 */
export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  prefix = '',
  suffix = '',
  duration = 2,
  decimals = 0,
  className = '',
  once = true,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once, margin: '-50px' });
  
  const spring = useSpring(0, {
    duration: duration * 1000,
    bounce: 0,
  });

  const display = useTransform(spring, (current) => {
    return `${prefix}${current.toFixed(decimals)}${suffix}`;
  });

  useEffect(() => {
    if (isInView) {
      spring.set(value);
    }
  }, [isInView, value, spring]);

  return (
    <motion.span ref={ref} className={className}>
      {display}
    </motion.span>
  );
};

/**
 * AnimatedPercentage - Circular progress with animated percentage
 */
export const AnimatedPercentage: React.FC<{
  value: number;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}> = ({ value, size = 'md', color = '#3b82f6', className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  
  const sizes = {
    sm: { width: 60, stroke: 4, fontSize: 'text-sm' },
    md: { width: 80, stroke: 5, fontSize: 'text-lg' },
    lg: { width: 120, stroke: 6, fontSize: 'text-2xl' },
  };

  const { width, stroke, fontSize } = sizes[size];
  const radius = (width - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div ref={ref} className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={width} height={width} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={stroke}
        />
        {/* Progress circle */}
        <motion.circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: isInView ? offset : circumference }}
          transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
          style={{
            filter: `drop-shadow(0 0 6px ${color})`,
          }}
        />
      </svg>
      {/* Percentage text */}
      <div className={`absolute inset-0 flex items-center justify-center ${fontSize} font-mono font-bold text-white`}>
        <AnimatedCounter value={value} suffix="%" />
      </div>
    </div>
  );
};

/**
 * SparklineChart - Mini inline chart for stat cards
 */
export const SparklineChart: React.FC<{
  data: number[];
  color?: string;
  height?: number;
  className?: string;
}> = ({ data, color = '#3b82f6', height = 32, className = '' }) => {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true });
  
  const width = 100;
  const padding = 2;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((value, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((value - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `${padding},${height - padding} ${points} ${width - padding},${height - padding}`;

  return (
    <svg ref={ref} viewBox={`0 0 ${width} ${height}`} className={`w-full ${className}`} style={{ height }}>
      {/* Gradient fill */}
      <defs>
        <linearGradient id={`sparkline-gradient-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      
      {/* Area fill */}
      <motion.polygon
        points={areaPoints}
        fill={`url(#sparkline-gradient-${color.replace('#', '')})`}
        initial={{ opacity: 0 }}
        animate={{ opacity: isInView ? 1 : 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      />
      
      {/* Line */}
      <motion.polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: isInView ? 1 : 0, opacity: isInView ? 1 : 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
      
      {/* End dot */}
      <motion.circle
        cx={width - padding}
        cy={height - padding - ((data[data.length - 1] - min) / range) * (height - padding * 2)}
        r="3"
        fill={color}
        initial={{ scale: 0 }}
        animate={{ scale: isInView ? 1 : 0 }}
        transition={{ duration: 0.3, delay: 1 }}
        style={{ filter: `drop-shadow(0 0 4px ${color})` }}
      />
    </svg>
  );
};

export default AnimatedCounter;

