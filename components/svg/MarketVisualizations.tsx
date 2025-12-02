import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import rough from 'roughjs';

gsap.registerPlugin(ScrollTrigger);

/**
 * Animated money flow visualization showing where faalkosten go
 */
export const FaalkostenFlow: React.FC<{ className?: string }> = ({ className = '' }) => {
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
      { threshold: 0.2 }
    );

    observer.observe(svgRef.current);
    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!svgRef.current || !isVisible) return;

    const svg = svgRef.current;
    const rc = rough.svg(svg);

    // Clear previous
    const group = svg.querySelector('.flow-group');
    if (group) {
      while (group.firstChild) {
        group.removeChild(group.firstChild);
      }
    }

    // Main input
    const mainBar = rc.rectangle(20, 180, 100, 40, {
      stroke: '#22c55e',
      fill: '#22c55e',
      fillStyle: 'solid',
      roughness: 1.5,
      strokeWidth: 2,
    });
    group?.appendChild(mainBar);

    // Flow paths to different costs
    const flows = [
      { to: { x: 280, y: 60 }, width: 25, color: '#ef4444', label: 'Herwerk' },
      { to: { x: 280, y: 140 }, width: 30, color: '#f97316', label: 'Miscommunicatie' },
      { to: { x: 280, y: 220 }, width: 20, color: '#eab308', label: 'Materiaalverspilling' },
      { to: { x: 280, y: 300 }, width: 25, color: '#ef4444', label: 'Vertragingen' },
    ];

    flows.forEach((flow, index) => {
      const startY = 180 + (index - 1.5) * 12;
      const path = `M 120 ${200} Q 200 ${200}, 200 ${flow.to.y} T ${flow.to.x} ${flow.to.y}`;
      
      const flowPath = rc.path(path, {
        stroke: flow.color,
        strokeWidth: flow.width / 3,
        roughness: 1,
        bowing: 2,
      });
      group?.appendChild(flowPath);

      // End box
      const endBox = rc.rectangle(flow.to.x, flow.to.y - 20, 100, 40, {
        stroke: flow.color,
        fill: `${flow.color}33`,
        fillStyle: 'solid',
        roughness: 1.5,
        strokeWidth: 2,
      });
      group?.appendChild(endBox);
    });

    // Animate paths
    const paths = svg.querySelectorAll('path');
    paths.forEach((path, i) => {
      const length = path.getTotalLength();
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
      });
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 1.5,
        delay: i * 0.1,
        ease: 'power2.out',
      });
    });

  }, [isVisible]);

  return (
    <div className={className}>
      <svg
        ref={svgRef}
        viewBox="0 0 400 360"
        className="w-full h-auto"
      >
        <g className="flow-group" />
        
        {/* Labels */}
        <text x="70" y="175" fill="white" fontSize="12" textAnchor="middle" className="font-bold">
          €5B
        </text>
        <text x="70" y="240" fill="white" fontSize="10" textAnchor="middle" opacity="0.6">
          Jaarlijkse
        </text>
        <text x="70" y="252" fill="white" fontSize="10" textAnchor="middle" opacity="0.6">
          Faalkosten
        </text>

        <text x="330" y="65" fill="#ef4444" fontSize="11" textAnchor="middle">Herwerk</text>
        <text x="330" y="145" fill="#f97316" fontSize="11" textAnchor="middle">Miscommunicatie</text>
        <text x="330" y="225" fill="#eab308" fontSize="11" textAnchor="middle">Materiaal</text>
        <text x="330" y="305" fill="#ef4444" fontSize="11" textAnchor="middle">Vertragingen</text>

        <text x="330" y="80" fill="white" fontSize="10" textAnchor="middle" opacity="0.5">25%</text>
        <text x="330" y="160" fill="white" fontSize="10" textAnchor="middle" opacity="0.5">30%</text>
        <text x="330" y="240" fill="white" fontSize="10" textAnchor="middle" opacity="0.5">20%</text>
        <text x="330" y="320" fill="white" fontSize="10" textAnchor="middle" opacity="0.5">25%</text>
      </svg>
    </div>
  );
};

/**
 * Animated timeline showing construction phases
 */
export const ConstructionTimeline: React.FC<{ className?: string }> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!containerRef.current || !lineRef.current) return;

    gsap.to({}, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 60%',
        end: 'bottom 40%',
        scrub: 1,
        onUpdate: (self) => {
          setProgress(self.progress * 100);
        }
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  const phases = [
    { name: 'Vergunning', duration: '8-26 wk', position: 0, color: '#f97316' },
    { name: 'Aannemer', duration: '4-12 wk', position: 20, color: '#eab308' },
    { name: 'Wachten', duration: '8-16 wk', position: 40, color: '#ef4444' },
    { name: 'Bouw', duration: '6-10 mnd', position: 60, color: '#22c55e' },
    { name: 'Oplevering', duration: '2-4 wk', position: 90, color: '#3b82f6' },
  ];

  return (
    <div ref={containerRef} className={`relative py-8 ${className}`}>
      {/* Background line */}
      <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -translate-y-1/2" />
      
      {/* Progress line */}
      <div
        ref={lineRef}
        className="absolute top-1/2 left-0 h-1 -translate-y-1/2 transition-all duration-100"
        style={{
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #22c55e, #3b82f6)',
          boxShadow: '0 0 20px rgba(34, 197, 94, 0.5)'
        }}
      />

      {/* Phase markers */}
      <div className="relative flex justify-between">
        {phases.map((phase, index) => {
          const isActive = progress >= phase.position;
          return (
            <div
              key={index}
              className="flex flex-col items-center"
              style={{ 
                position: 'absolute', 
                left: `${phase.position}%`,
                transform: 'translateX(-50%)'
              }}
            >
              <div
                className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                  isActive ? 'scale-125' : 'scale-100'
                }`}
                style={{
                  borderColor: phase.color,
                  backgroundColor: isActive ? phase.color : 'transparent',
                  boxShadow: isActive ? `0 0 15px ${phase.color}` : 'none'
                }}
              />
              <div className="mt-3 text-center">
                <div className={`text-xs font-medium transition-colors ${isActive ? 'text-white' : 'text-white/40'}`}>
                  {phase.name}
                </div>
                <div className="text-[10px] text-white/30 mt-0.5">{phase.duration}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * Animated Netherlands map with housing shortage hotspots
 */
export const NetherlandsHeatmap: React.FC<{ className?: string }> = ({ className = '' }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);

  // Simplified NL provinces as paths (approximated)
  const provinces = [
    { 
      id: 'noord-holland', 
      name: 'Noord-Holland',
      shortage: 5.8,
      path: 'M 120 60 L 140 50 L 160 60 L 155 90 L 145 100 L 120 95 L 110 80 Z',
      center: { x: 135, y: 75 }
    },
    { 
      id: 'zuid-holland', 
      name: 'Zuid-Holland',
      shortage: 6.2,
      path: 'M 100 100 L 145 100 L 150 130 L 130 150 L 95 140 L 90 115 Z',
      center: { x: 120, y: 125 }
    },
    { 
      id: 'utrecht', 
      name: 'Utrecht',
      shortage: 5.5,
      path: 'M 145 100 L 175 95 L 180 120 L 165 140 L 150 130 Z',
      center: { x: 160, y: 115 }
    },
    { 
      id: 'flevoland', 
      name: 'Flevoland',
      shortage: 3.2,
      path: 'M 160 60 L 190 55 L 195 85 L 175 95 L 155 90 Z',
      center: { x: 175, y: 75 }
    },
    { 
      id: 'gelderland', 
      name: 'Gelderland',
      shortage: 4.1,
      path: 'M 175 95 L 230 85 L 240 130 L 200 160 L 165 140 L 180 120 Z',
      center: { x: 200, y: 120 }
    },
    { 
      id: 'noord-brabant', 
      name: 'Noord-Brabant',
      shortage: 4.8,
      path: 'M 130 150 L 200 160 L 210 190 L 150 200 L 120 180 Z',
      center: { x: 165, y: 175 }
    },
    { 
      id: 'limburg', 
      name: 'Limburg',
      shortage: 3.5,
      path: 'M 200 160 L 220 155 L 230 220 L 210 230 L 195 200 Z',
      center: { x: 212, y: 190 }
    },
  ];

  const getColor = (shortage: number) => {
    if (shortage >= 6) return '#ef4444';
    if (shortage >= 5) return '#f97316';
    if (shortage >= 4) return '#eab308';
    return '#22c55e';
  };

  useEffect(() => {
    if (!svgRef.current) return;

    const paths = svgRef.current.querySelectorAll('.province-path');
    
    gsap.fromTo(paths, 
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: 'back.out(1.5)',
        scrollTrigger: {
          trigger: svgRef.current,
          start: 'top 80%',
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <svg
        ref={svgRef}
        viewBox="0 0 300 260"
        className="w-full h-auto"
      >
        {/* Background glow effect */}
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {provinces.map((province) => (
          <g key={province.id}>
            <path
              className="province-path cursor-pointer transition-all duration-300"
              d={province.path}
              fill={getColor(province.shortage)}
              fillOpacity={hoveredProvince === province.id ? 0.9 : 0.6}
              stroke="white"
              strokeWidth={hoveredProvince === province.id ? 2 : 1}
              strokeOpacity={0.3}
              filter={hoveredProvince === province.id ? 'url(#glow)' : undefined}
              onMouseEnter={() => setHoveredProvince(province.id)}
              onMouseLeave={() => setHoveredProvince(null)}
              style={{
                transformOrigin: `${province.center.x}px ${province.center.y}px`,
                transform: hoveredProvince === province.id ? 'scale(1.05)' : 'scale(1)'
              }}
            />
            {/* Shortage percentage */}
            <text
              x={province.center.x}
              y={province.center.y}
              fill="white"
              fontSize="10"
              fontWeight="bold"
              textAnchor="middle"
              dominantBaseline="middle"
              className="pointer-events-none"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
            >
              {province.shortage}%
            </text>
          </g>
        ))}
      </svg>

      {/* Hover tooltip */}
      {hoveredProvince && (
        <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg p-3 text-sm">
          <div className="font-bold text-white">
            {provinces.find(p => p.id === hoveredProvince)?.name}
          </div>
          <div className="text-white/60">
            Tekort: {provinces.find(p => p.id === hoveredProvince)?.shortage}%
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex justify-center gap-4 mt-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-[#22c55e]" />
          <span className="text-white/40">&lt;4%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-[#eab308]" />
          <span className="text-white/40">4-5%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-[#f97316]" />
          <span className="text-white/40">5-6%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-[#ef4444]" />
          <span className="text-white/40">&gt;6%</span>
        </div>
      </div>
    </div>
  );
};

/**
 * Animated percentage ring comparison
 */
interface ComparisonRingsProps {
  traditional: number;
  improved: number;
  labels: { traditional: string; improved: string };
  className?: string;
}

export const ComparisonRings: React.FC<ComparisonRingsProps> = ({
  traditional,
  improved,
  labels,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [animatedTraditional, setAnimatedTraditional] = useState(0);
  const [animatedImproved, setAnimatedImproved] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    gsap.to({}, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
        onEnter: () => {
          // Animate traditional
          gsap.to({ value: 0 }, {
            value: traditional,
            duration: 1.5,
            ease: 'power2.out',
            onUpdate: function() {
              setAnimatedTraditional(Math.floor(this.targets()[0].value));
            }
          });
          // Animate improved
          gsap.to({ value: 0 }, {
            value: improved,
            duration: 1.5,
            delay: 0.3,
            ease: 'power2.out',
            onUpdate: function() {
              setAnimatedImproved(Math.floor(this.targets()[0].value));
            }
          });
        }
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [traditional, improved]);

  const createRingPath = (percentage: number, radius: number) => {
    const angle = (percentage / 100) * 360;
    const largeArc = angle > 180 ? 1 : 0;
    const endX = 60 + radius * Math.sin((angle * Math.PI) / 180);
    const endY = 60 - radius * Math.cos((angle * Math.PI) / 180);
    
    if (percentage >= 100) {
      return `M 60 ${60 - radius} A ${radius} ${radius} 0 1 1 59.99 ${60 - radius}`;
    }
    
    return `M 60 ${60 - radius} A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY}`;
  };

  return (
    <div ref={containerRef} className={`flex justify-center gap-8 ${className}`}>
      {/* Traditional ring */}
      <div className="text-center">
        <svg viewBox="0 0 120 120" className="w-28 h-28">
          {/* Background ring */}
          <circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="8"
          />
          {/* Progress ring */}
          <path
            d={createRingPath(animatedTraditional, 45)}
            fill="none"
            stroke="#ef4444"
            strokeWidth="8"
            strokeLinecap="round"
            style={{
              filter: 'drop-shadow(0 0 8px rgba(239,68,68,0.5))'
            }}
          />
          {/* Center text */}
          <text
            x="60"
            y="55"
            fill="white"
            fontSize="18"
            fontWeight="bold"
            textAnchor="middle"
            fontFamily="monospace"
          >
            {animatedTraditional}%
          </text>
          <text
            x="60"
            y="72"
            fill="rgba(255,255,255,0.4)"
            fontSize="8"
            textAnchor="middle"
          >
            over budget
          </text>
        </svg>
        <div className="text-sm text-red-400 mt-2">{labels.traditional}</div>
      </div>

      {/* VS divider */}
      <div className="flex items-center text-white/20 text-2xl font-light">vs</div>

      {/* Improved ring */}
      <div className="text-center">
        <svg viewBox="0 0 120 120" className="w-28 h-28">
          {/* Background ring */}
          <circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="8"
          />
          {/* Progress ring */}
          <path
            d={createRingPath(animatedImproved, 45)}
            fill="none"
            stroke="#22c55e"
            strokeWidth="8"
            strokeLinecap="round"
            style={{
              filter: 'drop-shadow(0 0 8px rgba(34,197,94,0.5))'
            }}
          />
          {/* Center text */}
          <text
            x="60"
            y="55"
            fill="white"
            fontSize="18"
            fontWeight="bold"
            textAnchor="middle"
            fontFamily="monospace"
          >
            {animatedImproved}%
          </text>
          <text
            x="60"
            y="72"
            fill="rgba(255,255,255,0.4)"
            fontSize="8"
            textAnchor="middle"
          >
            over budget
          </text>
        </svg>
        <div className="text-sm text-green-400 mt-2">{labels.improved}</div>
      </div>
    </div>
  );
};

/**
 * Particle background effect for hero sections
 */
export const ParticleBackground: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }

    const particles: Particle[] = [];
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.offsetWidth) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.offsetHeight) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34, 197, 94, ${p.opacity})`;
        ctx.fill();
      });

      // Draw connections
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(34, 197, 94, ${0.1 * (1 - dist / 100)})`;
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  );
};

