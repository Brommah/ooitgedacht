import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface AnimatedSparkleProps {
  className?: string;
  delay?: number;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Animated sparkle component with GSAP animations
 */
export const AnimatedSparkle: React.FC<AnimatedSparkleProps> = ({ 
  className = '', 
  delay = 0, 
  size = 'md' 
}) => {
  const sparkleRef = useRef<HTMLSpanElement>(null);
  
  useEffect(() => {
    if (!sparkleRef.current) return;
    
    gsap.fromTo(sparkleRef.current,
      { scale: 0, rotation: -180, opacity: 0 },
      {
        scale: 1,
        rotation: 0,
        opacity: 1,
        duration: 0.6,
        delay,
        ease: 'back.out(1.7)',
      }
    );
    
    // Continuous subtle pulse
    gsap.to(sparkleRef.current, {
      scale: 1.2,
      opacity: 0.7,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: delay + 0.6,
    });
  }, [delay]);

  const sizeClasses = {
    sm: 'text-sm md:text-base',
    md: 'text-lg md:text-xl',
    lg: 'text-2xl md:text-3xl',
  };

  return (
    <span 
      ref={sparkleRef} 
      className={`inline-block ${sizeClasses[size]} ${className}`}
      style={{ opacity: 0 }}
    >
      ✦
    </span>
  );
};




