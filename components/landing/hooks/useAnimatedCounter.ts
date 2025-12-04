import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Hook for animating a counter with GSAP
 * Triggers animation when element enters viewport
 */
export const useAnimatedCounter = (
  end: number, 
  duration: number = 2, 
  startOnView: boolean = true
) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!ref.current || hasAnimated.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const counter = { value: 0 };
          gsap.to(counter, {
            value: end,
            duration,
            ease: 'power2.out',
            onUpdate: () => setCount(Math.floor(counter.value)),
          });
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return { count, ref };
};




