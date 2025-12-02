import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Animated Dutch House SVG - draws itself on scroll
 */
export const AnimatedHouseSVG: React.FC<{ className?: string }> = ({ className = '' }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathsRef = useRef<SVGPathElement[]>([]);

  useEffect(() => {
    if (!svgRef.current) return;

    const paths = pathsRef.current;
    
    // Set initial state - paths are invisible
    paths.forEach(path => {
      const length = path.getTotalLength();
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
        opacity: 1
      });
    });

    // Animate on scroll
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: svgRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1,
      }
    });

    paths.forEach((path, index) => {
      tl.to(path, {
        strokeDashoffset: 0,
        duration: 1,
        ease: 'power2.inOut'
      }, index * 0.1);
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  const addPathRef = (el: SVGPathElement | null, index: number) => {
    if (el) pathsRef.current[index] = el;
  };

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 200 200"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* House base */}
      <path
        ref={(el) => addPathRef(el, 0)}
        d="M40 100 L40 170 L160 170 L160 100"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0"
      />
      {/* Roof */}
      <path
        ref={(el) => addPathRef(el, 1)}
        d="M30 100 L100 40 L170 100"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0"
      />
      {/* Door */}
      <path
        ref={(el) => addPathRef(el, 2)}
        d="M85 170 L85 130 L115 130 L115 170"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0"
      />
      {/* Window left */}
      <path
        ref={(el) => addPathRef(el, 3)}
        d="M50 110 L50 140 L75 140 L75 110 Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0"
      />
      {/* Window right */}
      <path
        ref={(el) => addPathRef(el, 4)}
        d="M125 110 L125 140 L150 140 L150 110 Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0"
      />
      {/* Chimney */}
      <path
        ref={(el) => addPathRef(el, 5)}
        d="M130 70 L130 45 L150 45 L150 60"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0"
      />
    </svg>
  );
};

/**
 * Animated Euro symbol that pulses and draws
 */
export const AnimatedEuroSVG: React.FC<{ className?: string }> = ({ className = '' }) => {
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
      duration: 2,
      ease: 'power2.inOut',
      scrollTrigger: {
        trigger: path,
        start: 'top 80%',
      }
    });

    // Pulse animation
    gsap.to(path, {
      scale: 1.05,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
      transformOrigin: 'center center'
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <svg viewBox="0 0 100 100" className={className} fill="none">
      <path
        ref={pathRef}
        d="M70 25 C45 25 30 40 30 50 C30 60 45 75 70 75 M20 45 L55 45 M20 55 L55 55"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

/**
 * Staggered grid animation component
 */
interface StaggeredGridProps {
  total: number;
  highlighted: number;
  highlightColor?: string;
  baseColor?: string;
  className?: string;
}

export const StaggeredHousingGrid: React.FC<StaggeredGridProps> = ({
  total,
  highlighted,
  highlightColor = '#ef4444',
  baseColor = 'rgba(255,255,255,0.2)',
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const items = itemsRef.current;

    // Set initial state
    gsap.set(items, { scale: 0, opacity: 0 });

    // Staggered reveal animation
    gsap.to(items, {
      scale: 1,
      opacity: 1,
      duration: 0.3,
      stagger: {
        each: 0.02,
        from: 'random',
        grid: [10, 10],
      },
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 70%',
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [total]);

  const addItemRef = (el: HTMLDivElement | null, index: number) => {
    if (el) itemsRef.current[index] = el;
  };

  const highlightStart = total - highlighted;

  return (
    <div ref={containerRef} className={`grid grid-cols-10 gap-1 ${className}`}>
      {[...Array(total)].map((_, i) => (
        <div
          key={i}
          ref={(el) => addItemRef(el, i)}
          className="aspect-square rounded-sm transition-colors duration-300"
          style={{
            backgroundColor: i >= highlightStart ? highlightColor : baseColor
          }}
        />
      ))}
    </div>
  );
};

/**
 * Animated counter with GSAP
 */
interface AnimatedCounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  formatter?: (value: number) => string;
}

export const GSAPCounter: React.FC<AnimatedCounterProps> = ({
  end,
  duration = 2,
  prefix = '',
  suffix = '',
  className = '',
  formatter = (v) => v.toLocaleString('nl-NL')
}) => {
  const counterRef = useRef<HTMLSpanElement>(null);
  const valueRef = useRef({ value: 0 });

  useEffect(() => {
    if (!counterRef.current) return;

    gsap.to(valueRef.current, {
      value: end,
      duration,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: counterRef.current,
        start: 'top 80%',
      },
      onUpdate: () => {
        if (counterRef.current) {
          counterRef.current.textContent = `${prefix}${formatter(Math.floor(valueRef.current.value))}${suffix}`;
        }
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [end, duration, prefix, suffix, formatter]);

  return <span ref={counterRef} className={className}>{prefix}0{suffix}</span>;
};

/**
 * Morphing shape component - transitions between two SVG paths
 */
interface MorphingSVGProps {
  pathA: string;
  pathB: string;
  duration?: number;
  className?: string;
  strokeColor?: string;
  fillColor?: string;
}

export const MorphingSVG: React.FC<MorphingSVGProps> = ({
  pathA,
  pathB,
  duration = 1,
  className = '',
  strokeColor = 'currentColor',
  fillColor = 'none'
}) => {
  const pathRef = useRef<SVGPathElement>(null);
  const [isPathA, setIsPathA] = React.useState(true);

  useEffect(() => {
    if (!pathRef.current) return;

    const interval = setInterval(() => {
      setIsPathA(prev => !prev);
    }, duration * 1000 + 500);

    return () => clearInterval(interval);
  }, [duration]);

  useEffect(() => {
    if (!pathRef.current) return;

    gsap.to(pathRef.current, {
      attr: { d: isPathA ? pathA : pathB },
      duration,
      ease: 'power2.inOut'
    });
  }, [isPathA, pathA, pathB, duration]);

  return (
    <svg viewBox="0 0 100 100" className={className}>
      <path
        ref={pathRef}
        d={pathA}
        stroke={strokeColor}
        fill={fillColor}
        strokeWidth="2"
      />
    </svg>
  );
};

/**
 * Scroll-triggered progress line
 */
interface ScrollProgressLineProps {
  className?: string;
  color?: string;
}

export const ScrollProgressLine: React.FC<ScrollProgressLineProps> = ({
  className = '',
  color = '#22c55e'
}) => {
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!lineRef.current) return;

    gsap.to(lineRef.current, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3,
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div className={`fixed top-0 left-0 w-full h-1 z-[100] ${className}`}>
      <div
        ref={lineRef}
        className="h-full origin-left"
        style={{
          background: `linear-gradient(90deg, ${color}, ${color}88)`,
          transform: 'scaleX(0)'
        }}
      />
    </div>
  );
};

