import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface AnimatedUnderlineProps {
  delay?: number;
}

/**
 * Animated SVG underline component
 */
export const AnimatedUnderline: React.FC<AnimatedUnderlineProps> = ({ delay = 0.5 }) => {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!pathRef.current) return;
    
    const path = pathRef.current;
    const length = path.getTotalLength();
    
    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length,
    });
    
    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 1.2,
      delay,
      ease: 'power2.inOut',
    });
  }, [delay]);

  return (
    <svg 
      className="absolute -bottom-1 md:-bottom-2 left-0 w-full h-2 md:h-3" 
      viewBox="0 0 200 12" 
      preserveAspectRatio="none"
    >
      <path
        ref={pathRef}
        d="M0,6 C20,2 40,10 60,6 C80,2 100,10 120,6 C140,2 160,10 180,6 L200,6"
        stroke="rgba(96, 165, 250, 0.6)"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};




