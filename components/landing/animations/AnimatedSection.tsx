import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  animation?: 'fade-up' | 'fade-left' | 'fade-right' | 'scale' | 'stagger';
}

/**
 * GSAP-powered animated section wrapper
 * Triggers animation when element enters viewport
 */
export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className = '',
  delay = 0,
  animation = 'fade-up'
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;

    const animations: Record<string, gsap.TweenVars> = {
      'fade-up': { y: 40, opacity: 0 },
      'fade-left': { x: -40, opacity: 0 },
      'fade-right': { x: 40, opacity: 0 },
      'scale': { scale: 0.9, opacity: 0 },
      'stagger': { y: 30, opacity: 0 },
    };

    gsap.from(sectionRef.current, {
      ...animations[animation],
      duration: 0.8,
      delay: delay / 1000,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  }, { scope: sectionRef });

  return (
    <div ref={sectionRef} className={className}>
      {children}
    </div>
  );
};




