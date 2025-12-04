import React, { useRef, useEffect, useState } from 'react';
import rough from 'roughjs';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Hand-drawn progress bar using Rough.js
 */
interface RoughProgressBarProps {
  percentage: number;
  label: string;
  color?: string;
  backgroundColor?: string;
  className?: string;
  delay?: number;
}

export const RoughProgressBar: React.FC<RoughProgressBarProps> = ({
  percentage,
  label,
  color = '#ef4444',
  backgroundColor = 'rgba(255,255,255,0.1)',
  className = '',
  delay = 0
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [delay, isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 1500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setAnimatedPercentage(Math.floor(eased * percentage));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, percentage]);

  useEffect(() => {
    if (!svgRef.current || !isVisible) return;

    const svg = svgRef.current;
    const rc = rough.svg(svg);
    
    // Clear previous drawings
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    const width = 400;
    const height = 16;
    const fillWidth = (animatedPercentage / 100) * width;

    // Background bar (sketchy)
    const bgBar = rc.rectangle(2, 2, width - 4, height - 4, {
      stroke: backgroundColor,
      strokeWidth: 1,
      fill: backgroundColor,
      fillStyle: 'solid',
      roughness: 1.5,
    });
    svg.appendChild(bgBar);

    // Progress bar (sketchy, hand-drawn feel)
    if (fillWidth > 4) {
      const progressBar = rc.rectangle(2, 2, fillWidth - 4, height - 4, {
        stroke: color,
        strokeWidth: 2,
        fill: color,
        fillStyle: 'zigzag',
        fillWeight: 2,
        hachureGap: 4,
        roughness: 2,
      });
      svg.appendChild(progressBar);
    }
  }, [animatedPercentage, color, backgroundColor, isVisible]);

  return (
    <div ref={containerRef} className={`space-y-2 ${className}`}>
      <div className="flex justify-between text-sm">
        <span className="text-white/60">{label}</span>
        <span className="font-mono font-bold text-white">{animatedPercentage}%</span>
      </div>
      <svg
        ref={svgRef}
        viewBox="0 0 400 16"
        className="w-full h-4"
        preserveAspectRatio="none"
      />
    </div>
  );
};

/**
 * Hand-drawn circle chart (donut)
 */
interface RoughDonutProps {
  value: number;
  max: number;
  label: string;
  color?: string;
  size?: number;
  className?: string;
}

export const RoughDonut: React.FC<RoughDonutProps> = ({
  value,
  max,
  label,
  color = '#22c55e',
  size = 120,
  className = ''
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    if (!svgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(svgRef.current);
    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 1500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedValue(Math.floor(eased * value));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, value]);

  useEffect(() => {
    if (!svgRef.current || !isVisible) return;

    const svg = svgRef.current;
    const rc = rough.svg(svg);
    
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    const cx = size / 2;
    const cy = size / 2;
    const radius = size / 2 - 10;

    // Background circle
    const bgCircle = rc.circle(cx, cy, radius * 2, {
      stroke: 'rgba(255,255,255,0.1)',
      strokeWidth: 8,
      fill: 'none',
      roughness: 1.5,
    });
    svg.appendChild(bgCircle);

    // Progress arc
    const percentage = animatedValue / max;
    if (percentage > 0) {
      const startAngle = -Math.PI / 2;
      const endAngle = startAngle + (percentage * 2 * Math.PI);
      
      const arc = rc.arc(cx, cy, radius * 2, radius * 2, startAngle, endAngle, false, {
        stroke: color,
        strokeWidth: 8,
        roughness: 1.5,
      });
      svg.appendChild(arc);
    }
  }, [animatedValue, max, color, size, isVisible]);

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative">
        <svg
          ref={svgRef}
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-mono font-bold text-white">{animatedValue}</span>
          <span className="text-xs text-white/40">/ {max}</span>
        </div>
      </div>
      <span className="text-sm text-white/60 mt-2">{label}</span>
    </div>
  );
};

/**
 * Hand-drawn stat card
 */
interface RoughStatCardProps {
  value: string | number;
  label: string;
  sublabel?: string;
  icon?: React.ReactNode;
  color?: string;
  className?: string;
}

export const RoughStatCard: React.FC<RoughStatCardProps> = ({
  value,
  label,
  sublabel,
  icon,
  color = '#ef4444',
  className = ''
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!svgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(svgRef.current);
    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!svgRef.current || !isVisible) return;

    const svg = svgRef.current;
    const rc = rough.svg(svg);
    
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    // Draw sketchy border
    const rect = rc.rectangle(2, 2, 196, 126, {
      stroke: color,
      strokeWidth: 2,
      fill: 'none',
      roughness: 2,
    });
    svg.appendChild(rect);

    // Decorative corner accent
    const corner = rc.line(170, 2, 198, 30, {
      stroke: color,
      strokeWidth: 2,
      roughness: 1.5,
    });
    svg.appendChild(corner);
  }, [color, isVisible]);

  return (
    <div className={`relative ${className}`}>
      <svg
        ref={svgRef}
        viewBox="0 0 200 130"
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="none"
      />
      <div className="relative p-5 backdrop-blur-sm">
        {icon && <div className="mb-2" style={{ color }}>{icon}</div>}
        <div className="text-2xl md:text-3xl font-mono font-bold text-white">
          {value}
        </div>
        <div className="text-xs text-white/40 mt-1">{label}</div>
        {sublabel && (
          <div className="text-xs mt-1" style={{ color: `${color}99` }}>{sublabel}</div>
        )}
      </div>
    </div>
  );
};

/**
 * Animated flow/sankey-style connector lines
 */
interface FlowLineProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
  color?: string;
  className?: string;
  animated?: boolean;
}

export const RoughFlowLine: React.FC<FlowLineProps> = ({
  from,
  to,
  color = '#ef4444',
  className = '',
  animated = true
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const rc = rough.svg(svg);
    
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    // Create curved path
    const midX = (from.x + to.x) / 2;
    const controlY1 = from.y;
    const controlY2 = to.y;

    const path = `M ${from.x} ${from.y} C ${midX} ${controlY1}, ${midX} ${controlY2}, ${to.x} ${to.y}`;
    
    const line = rc.path(path, {
      stroke: color,
      strokeWidth: 3,
      roughness: 1.5,
      bowing: 2,
    });
    
    svg.appendChild(line);
    pathRef.current = line;

    if (animated && pathRef.current) {
      const paths = pathRef.current.querySelectorAll('path');
      paths.forEach(p => {
        const length = p.getTotalLength();
        gsap.set(p, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
        gsap.to(p, {
          strokeDashoffset: 0,
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: svg,
            start: 'top 80%',
          }
        });
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [from, to, color, animated]);

  const width = Math.abs(to.x - from.x) + 40;
  const height = Math.abs(to.y - from.y) + 40;

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      style={{ width, height }}
    />
  );
};

/**
 * Hand-drawn comparison bars (side by side)
 */
interface ComparisonBarsProps {
  items: Array<{
    label: string;
    traditional: number;
    improved: number;
  }>;
  maxValue?: number;
  className?: string;
}

export const RoughComparisonBars: React.FC<ComparisonBarsProps> = ({
  items,
  maxValue,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isVisible]);

  const max = maxValue || Math.max(...items.flatMap(i => [i.traditional, i.improved]));

  return (
    <div ref={containerRef} className={`space-y-6 ${className}`}>
      {items.map((item, index) => (
        <div key={index} className="space-y-2">
          <div className="text-sm text-white/60 font-medium">{item.label}</div>
          <div className="grid grid-cols-2 gap-4">
            <RoughProgressBar
              percentage={(item.traditional / max) * 100}
              label="Traditioneel"
              color="#ef4444"
              delay={index * 200}
            />
            <RoughProgressBar
              percentage={(item.improved / max) * 100}
              label="Met OoitGedacht"
              color="#22c55e"
              delay={index * 200 + 100}
            />
          </div>
        </div>
      ))}
    </div>
  );
};





