import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useAnimatedCounter } from '../hooks/useAnimatedCounter';

interface AnimatedStatCardProps {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  sublabel?: string;
  delay?: number;
}

/**
 * Animated stat card with counter animation
 */
export const AnimatedStatCard: React.FC<AnimatedStatCardProps> = ({ 
  value, 
  suffix = '', 
  prefix = '', 
  label, 
  sublabel, 
  delay = 0 
}) => {
  const { count, ref } = useAnimatedCounter(value, 2);
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!cardRef.current) return;

    gsap.from(cardRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 0.6,
      delay: delay / 1000,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: cardRef.current,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  }, { scope: cardRef });

  return (
    <div ref={cardRef}>
      <div ref={ref} className="text-[9px] uppercase tracking-[0.2em] text-blue-300/50 mb-1">{label}</div>
      <div className="font-mono text-xl md:text-2xl font-medium text-white">
        {prefix}{count.toLocaleString()}{suffix}
      </div>
      {sublabel && <div className="text-[10px] text-blue-300/40 mt-0.5">{sublabel}</div>}
    </div>
  );
};




