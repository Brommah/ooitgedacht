import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { ArrowRight, ArrowDown, ShieldCheck, Hammer, XCircle, CheckCircle2, ChevronDown, FileText, Leaf, Zap, Shield, BarChart3, AlertTriangle, ChevronRight, Mail, Star, Quote, Plus, Minus, Eye, Clock, Lock, Users, RefreshCw, FileCheck, Sparkles, Home, LayoutDashboard } from 'lucide-react';
import { AppState } from '../types';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import rough from 'roughjs';
import { PrimaryButton, TextButton } from './PrimaryButton';
import { useTranslation } from '../i18n';
import { LanguageToggle } from './LanguageToggle';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const BROERSMA_LOGO = "https://www.bureau-broersma.nl/wp-content/uploads/2015/09/logo-broersma-bouwadvies.png";

// Subtle grid pattern (very light, not overdone)
const subtleGridPattern = {
  backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px)`,
  backgroundSize: '60px 60px',
};

// ============================================
// ANIMATED COUNTER HOOK (with GSAP)
// ============================================
const useAnimatedCounter = (end: number, duration: number = 2, startOnView: boolean = true) => {
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

// ============================================
// HAND-DRAWN SVG ICON COMPONENT (Rough.js)
// ============================================
interface HandDrawnIconProps {
  type: 'lock' | 'users' | 'clock' | 'document';
  size?: number;
  color?: string;
  className?: string;
}

const HandDrawnIcon: React.FC<HandDrawnIconProps> = ({ type, size = 48, color = '#60a5fa', className = '' }) => {
  const canvasRef = useRef<SVGSVGElement>(null);
  const [paths, setPaths] = useState<string[]>([]);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const rc = rough.svg(canvasRef.current);
    const generatedPaths: string[] = [];
    
    const options = {
      stroke: color,
      strokeWidth: 1.5,
      roughness: 1.2,
      bowing: 2,
      fill: 'none',
    };

    let shapes: SVGElement[] = [];
    
    switch (type) {
      case 'lock':
        // Lock body
        shapes.push(rc.rectangle(12, 22, 24, 20, { ...options, fill: `${color}15`, fillStyle: 'solid' }));
        // Lock shackle (arc)
        shapes.push(rc.arc(24, 22, 16, 16, Math.PI, 0, false, options));
        // Keyhole
        shapes.push(rc.circle(24, 30, 4, { ...options, fill: color, fillStyle: 'solid' }));
        break;
      case 'users':
        // Person 1 (left)
        shapes.push(rc.circle(16, 16, 10, options));
        shapes.push(rc.arc(16, 40, 20, 16, Math.PI, 0, false, options));
        // Person 2 (right)
        shapes.push(rc.circle(32, 16, 10, options));
        shapes.push(rc.arc(32, 40, 20, 16, Math.PI, 0, false, options));
        break;
      case 'clock':
        // Clock face
        shapes.push(rc.circle(24, 24, 18, options));
        // Clock hands
        shapes.push(rc.line(24, 24, 24, 14, options)); // Hour
        shapes.push(rc.line(24, 24, 32, 28, options)); // Minute
        // Center dot
        shapes.push(rc.circle(24, 24, 3, { ...options, fill: color, fillStyle: 'solid' }));
        break;
      case 'document':
        // Document body
        shapes.push(rc.rectangle(10, 6, 28, 36, options));
        // Folded corner
        shapes.push(rc.line(30, 6, 38, 14, options));
        shapes.push(rc.line(38, 14, 38, 6, options));
        // Lines
        shapes.push(rc.line(14, 18, 30, 18, options));
        shapes.push(rc.line(14, 24, 30, 24, options));
        shapes.push(rc.line(14, 30, 24, 30, options));
        // Checkmark
        shapes.push(rc.circle(32, 36, 8, { ...options, fill: `${color}30`, fillStyle: 'solid' }));
        break;
    }
    
    shapes.forEach(shape => {
      if (shape instanceof SVGPathElement || shape instanceof SVGElement) {
        generatedPaths.push(shape.outerHTML);
      }
    });
    
    setPaths(generatedPaths);
  }, [type, color]);

  return (
    <svg
      ref={canvasRef}
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      dangerouslySetInnerHTML={{ __html: paths.join('') }}
    />
  );
};

// ============================================
// ANIMATED UNDERLINE SVG COMPONENT
// ============================================
const AnimatedUnderline: React.FC<{ delay?: number }> = ({ delay = 0.5 }) => {
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

// ============================================
// ANIMATED SPARKLE COMPONENT
// ============================================
const AnimatedSparkle: React.FC<{ 
  className?: string; 
  delay?: number;
  size?: 'sm' | 'md' | 'lg';
}> = ({ className = '', delay = 0, size = 'md' }) => {
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

interface HeroProps {
  setAppState: (state: AppState) => void;
}

// ============================================
// HERO CONTENT WITH GSAP ANIMATIONS
// Storytelling sequence:
// 1. Image reveals with subtle zoom (user is captivated)
// 2. "OoitGedacht" appears - the hook (user is intrigued)
// 3. Pause - let the brand sink in
// 4. "dat je een huis" - building anticipation
// 5. "Kon Toveren?" - the payoff with sparkles (delight moment)
// 6. Description fades in - answering "how?"
// 7. CTA pulses into view - clear next step
// ============================================
const HeroContent: React.FC<{ setAppState: (state: AppState) => void }> = ({ setAppState }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="relative z-10 flex-1 flex flex-col justify-center max-w-[1400px] mx-auto px-5 md:px-12 w-full pt-24 md:pt-0">
      
      <div className="max-w-2xl">
        {/* Main Headline - The Story */}
        <h1 className="text-[2rem] sm:text-4xl md:text-5xl lg:text-[3.5rem] xl:text-6xl font-medium text-white leading-[1.08] tracking-[-0.02em] mb-5 md:mb-6 mt-8 md:mt-12">
          {/* Line 1: "OoitGedacht" - The hook/brand */}
          <span className="block overflow-hidden">
            <span className="relative inline-block font-semibold">
              OoitGedacht
            </span>
          </span>
          
          {/* Line 2: "dat je een huis" - Building narrative */}
          <span className="block font-light text-white/90 mt-1">
            dat je een huis
          </span>
          
          {/* Line 3: "Kon Toveren?" - The magical payoff */}
          <span className="block mt-1">
            <span className="relative inline-block whitespace-nowrap">
              <span className="font-semibold bg-gradient-to-r from-[#60a5fa] via-[#3b82f6] to-[#2563eb] bg-clip-text text-transparent">
                Kon Toveren?
              </span>
              <span className="relative">
                {/* Animated Sparkles - timed with line 3 reveal */}
                <AnimatedSparkle 
                  className="absolute -top-4 -right-2 md:-top-6 md:-right-3 text-[#60a5fa]" 
                  delay={2.0} 
                  size="lg" 
                />
                <AnimatedSparkle 
                  className="absolute -top-8 right-4 md:-top-12 md:right-6 text-[#3b82f6] opacity-70" 
                  delay={2.15} 
                  size="md" 
                />
                <AnimatedSparkle 
                  className="absolute -top-2 -right-8 md:-top-3 md:-right-12 text-[#2563eb] opacity-50" 
                  delay={2.3} 
                  size="sm" 
                />
              </span>
            </span>
          </span>
        </h1>
        
        {/* Value Proposition - The Answer */}
        <div className="text-lg md:text-xl leading-relaxed mb-10 md:mb-12 max-w-lg">
          <p className="text-white/60 font-light mb-2">
            Van droom naar bouwplan — helder, eerlijk, op maat
          </p>
          <p className="font-semibold text-white/90">
            precies op <span className="bg-gradient-to-r from-[#60a5fa] to-[#3b82f6] bg-clip-text text-transparent">jouw situatie</span> toegepast.
          </p>
        </div>

        {/* CTAs - The Invitation */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
          {/* Primary CTA - Prominent */}
          <PrimaryButton 
            onClick={() => setAppState(AppState.WIZARD_HOUSEHOLD)}
            size="lg"
          >
            Ontdek je mogelijkheden
          </PrimaryButton>
          
          {/* Secondary CTA - Subtle */}
          <TextButton 
            onClick={() => {
              const element = document.getElementById('how-it-works');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Hoe werkt het?
          </TextButton>
        </div>
      </div>
    </div>
  );
};

// ============================================
// HERO SECTION
// ============================================
const HeroSection: React.FC<{ setAppState: (state: AppState) => void }> = ({ setAppState }) => {
  return (
    <div className="relative h-screen flex flex-col">
      {/* Background Image - Full bleed */}
      <div className="absolute inset-0 overflow-hidden">
        <img 
          src="/generated/hero-windmill-sunset.jpeg" 
          alt="Modern Dutch house with windmill at sunset" 
          className="w-full h-full object-cover object-top"
        />
        <div 
          className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/45 to-black/65 md:bg-gradient-to-r md:from-black/70 md:via-black/45 md:via-40% md:to-transparent md:to-75%"
        />
      </div>

      {/* Hero Content */}
      <HeroContent setAppState={setAppState} />

      {/* Partner bar - AT THE BOTTOM OF HERO */}
      <div className="relative z-40 mt-auto border-t border-white/10 bg-gradient-to-t from-black/40 to-transparent">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-5 flex items-center justify-center gap-5">
          <span className="text-[11px] uppercase tracking-[0.2em] text-white/40 font-medium">In samenwerking met</span>
          <div className="w-px h-4 bg-white/20" />
          <a href="https://www.bureau-broersma.nl" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 hover:opacity-100 transition-opacity">
            <img src={BROERSMA_LOGO} alt="Bureau Broersma" className="h-7 md:h-8 brightness-0 invert opacity-60 group-hover:opacity-90 transition-opacity" />
          </a>
        </div>
      </div>
    </div>
  );
};

// ============================================
// GSAP-POWERED ANIMATED SECTION WRAPPER
// ============================================
const AnimatedSection: React.FC<{ 
  children: React.ReactNode; 
  className?: string; 
  delay?: number;
  animation?: 'fade-up' | 'fade-left' | 'fade-right' | 'scale' | 'stagger';
}> = ({ 
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

// ============================================
// SCROLL-TRIGGERED PROGRESS LINE
// ============================================
const ScrollProgressLine: React.FC<{ containerRef: React.RefObject<HTMLDivElement | null> }> = ({ containerRef }) => {
  const lineRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!lineRef.current || !containerRef.current) return;

    gsap.fromTo(lineRef.current,
      { scaleY: 0, transformOrigin: 'top' },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top center',
          end: 'bottom center',
          scrub: 0.5,
        },
      }
    );
  }, { scope: containerRef });
  
  return (
    <div
      ref={lineRef} 
      className="absolute left-[35px] top-8 bottom-8 w-[2px] bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600"
      style={{ scaleY: 0 }}
    />
  );
};

// ============================================
// ANIMATED STAT CARD
// ============================================
const AnimatedStatCard: React.FC<{
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  sublabel?: string;
  delay?: number;
}> = ({ value, suffix = '', prefix = '', label, sublabel, delay = 0 }) => {
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

// ============================================
// TRUST INDICATORS WITH BEAUTIFUL STATIC SVGS
// ============================================

// Shield with checkmark - Security & Transparency
const ShieldIcon = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#93c5fd" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
    </defs>
    <path 
      d="M22 4L6 10v12c0 9.55 6.84 18.48 16 20.5 9.16-2.02 16-10.95 16-20.5V10L22 4z" 
      stroke="url(#shieldGrad)" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      fill="none"
    />
    <path 
      d="M14 22l5 5 11-11" 
      stroke="url(#shieldGrad)" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

// Certificate badge - Expert validated
const CertifiedIcon = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="certGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#93c5fd" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
    </defs>
    <circle cx="22" cy="18" r="12" stroke="url(#certGrad)" strokeWidth="2.5" fill="none" />
    <path d="M17 18l3.5 3.5L25 14" stroke="url(#certGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 28l-2 12 8-4 8 4-2-12" stroke="url(#certGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

// Live chart - Real-time data
const LiveDataIcon = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="dataGrad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#93c5fd" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
    </defs>
    <rect x="6" y="28" width="6" height="10" rx="1" fill="url(#dataGrad)" opacity="0.6" />
    <rect x="15" y="20" width="6" height="18" rx="1" fill="url(#dataGrad)" opacity="0.8" />
    <rect x="24" y="12" width="6" height="26" rx="1" fill="url(#dataGrad)" />
    <rect x="33" y="6" width="6" height="32" rx="1" fill="url(#dataGrad)" opacity="0.9" />
    <circle cx="36" cy="6" r="3" fill="#60a5fa">
      <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite" />
    </circle>
  </svg>
);

// Document with stamp - Permit ready
const PermitIcon = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="permitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#93c5fd" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
    </defs>
    <path 
      d="M10 6h18l8 8v24a2 2 0 01-2 2H10a2 2 0 01-2-2V8a2 2 0 012-2z" 
      stroke="url(#permitGrad)" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      fill="none"
    />
    <path d="M28 6v8h8" stroke="url(#permitGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="14" y1="20" x2="30" y2="20" stroke="url(#permitGrad)" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    <line x1="14" y1="26" x2="26" y2="26" stroke="url(#permitGrad)" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    <circle cx="30" cy="32" r="6" stroke="url(#permitGrad)" strokeWidth="2" fill="none" />
    <path d="M27.5 32l2 2 3.5-3.5" stroke="url(#permitGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TrustIndicatorsSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useGSAP(() => {
    if (!sectionRef.current || cardsRef.current.length === 0) return;

    gsap.from(cardsRef.current, {
      y: 40,
      opacity: 0,
      scale: 0.9,
      duration: 0.6,
      stagger: 0.1,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });
  }, { scope: sectionRef });

  const indicators = [
    {
      icon: <ShieldIcon />,
      title: 'Veilig & Transparant',
      subtitle: 'Elke wijziging wordt gelogd',
    },
    {
      icon: <CertifiedIcon />,
      title: 'Expert Gevalideerd',
      subtitle: 'Door erkende constructeurs',
    },
    {
      icon: <LiveDataIcon />,
      title: 'Actuele Data',
      subtitle: 'Prijzen van vandaag',
    },
    {
      icon: <PermitIcon />,
      title: 'Vergunningsklaar',
      subtitle: 'Direct bruikbaar dossier',
    },
  ];

  return (
    <AnimatedSection delay={200} className="mt-16 md:mt-24">
      <div ref={sectionRef} className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
        {indicators.map((item, index) => (
          <div
            key={item.title}
            ref={(el) => { if (el) cardsRef.current[index] = el; }}
            className="group text-center"
          >
            <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-5 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-2xl flex items-center justify-center group-hover:border-blue-400/40 group-hover:from-blue-500/15 group-hover:to-blue-600/10 transition-all duration-300 shadow-lg shadow-blue-500/5">
              <div className="group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
            </div>
            <div className="text-sm md:text-base font-medium text-white mb-1.5">{item.title}</div>
            <div className="text-xs md:text-sm text-blue-200/50 font-light">{item.subtitle}</div>
          </div>
        ))}
      </div>
    </AnimatedSection>
  );
};

// ============================================
// ANIMATED HOUSE GRID FOR DASHBOARD
// ============================================
const AnimatedHouseGrid: React.FC<{ rows?: number; cols?: number }> = ({ rows = 4, cols = 8 }) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const housesRef = useRef<HTMLDivElement[]>([]);
  const total = rows * cols;
  const filledCount = Math.floor(total * 0.35); // 35% complete

  useGSAP(() => {
    if (!gridRef.current || housesRef.current.length === 0) return;

    // Staggered reveal animation
    gsap.from(housesRef.current, {
      scale: 0,
      opacity: 0,
      duration: 0.3,
      stagger: {
        each: 0.02,
        from: 'start',
      },
      ease: 'back.out(2)',
      scrollTrigger: {
        trigger: gridRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });

    // Pulse animation for active houses
    gsap.to(housesRef.current.slice(0, filledCount), {
      scale: 1.1,
      duration: 0.8,
      stagger: {
        each: 0.05,
        repeat: -1,
        yoyo: true,
      },
      ease: 'sine.inOut',
      delay: 1,
    });
  }, { scope: gridRef });

  return (
    <div ref={gridRef} className="flex flex-wrap gap-1 justify-center max-w-[200px]">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          ref={(el) => { if (el) housesRef.current[i] = el; }}
          className={`w-4 h-4 rounded-sm transition-colors duration-300 ${
            i < filledCount
              ? 'bg-blue-400 shadow-sm shadow-blue-400/50'
              : 'bg-blue-500/20'
          }`}
        />
      ))}
    </div>
  );
};

// ============================================
// ANIMATED TIMELINE STEP
// ============================================
const TimelineStep: React.FC<{
  number: string;
  title: string;
  description: string;
  image: string;
  isLast?: boolean;
  onClick: () => void;
  delay?: number;
  hasOverlay?: boolean;
}> = ({ number, title, description, image, isLast, onClick, delay = 0, hasOverlay }) => {
  const stepRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!stepRef.current) return;

    gsap.from(stepRef.current, {
      y: 60,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: stepRef.current,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });

    // Image parallax effect
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: {
          trigger: stepRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }
  }, { scope: stepRef });

  return (
    <div ref={stepRef} className="group cursor-pointer" onClick={onClick}>
      {/* Mobile: horizontal card layout, Desktop: vertical */}
      <div className="flex flex-row md:flex-col gap-4 md:gap-0">
        {/* Image Container */}
        <div className="flex-shrink-0 w-24 h-24 md:w-full md:h-auto md:mb-5 overflow-hidden md:aspect-[4/3] bg-blue-500/10 rounded-xl md:rounded-2xl relative">
          <div ref={imageRef} className="w-full h-full">
            <img 
              src={image} 
              loading="lazy" 
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" 
              alt={title}
            />
          </div>
          {/* Step number badge - mobile only */}
          <div className="md:hidden absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <span className="font-mono text-[10px] font-bold text-white">{number}</span>
          </div>
          {hasOverlay && (
            <div className="absolute inset-0 bg-[#0a1628]/30 group-hover:bg-[#0a1628]/15 transition-colors flex items-center justify-center">
              <Hammer size={24} strokeWidth={1.5} className="md:w-10 md:h-10 text-white group-hover:scale-110 transition-transform drop-shadow-lg" />
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1 flex flex-col justify-center md:justify-start">
          {/* Step number - desktop only */}
          <div className="hidden md:flex items-center gap-3 mb-3">
            <span className="font-mono text-xs text-blue-400 tracking-wider">{number}</span>
            <div className="h-[1px] bg-gradient-to-r from-blue-500/40 to-transparent w-10 group-hover:w-14 transition-all duration-300" />
          </div>
          <h3 className="text-lg md:text-xl font-semibold mb-1.5 md:mb-2 text-white group-hover:text-blue-400 transition-colors tracking-[-0.01em]">
            {title}
          </h3>
          <p className="text-[13px] md:text-sm text-blue-200/50 font-light leading-relaxed line-clamp-2 md:line-clamp-none">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

// ============================================
// DASHBOARD PREVIEW SECTION WITH ANIMATED TIMELINE
// ============================================
const DashboardPreviewSection: React.FC<{ setAppState: (state: AppState) => void }> = ({ setAppState }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement[]>([]);
  const progressLineRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current || stepsRef.current.length === 0) return;

    // Animate progress line
    if (progressLineRef.current) {
      gsap.fromTo(progressLineRef.current,
        { scaleY: 0, transformOrigin: 'top' },
        {
          scaleY: 1,
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: timelineRef.current,
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
        }
      );
    }

    // Staggered step reveal
    gsap.from(stepsRef.current, {
      x: -30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: timelineRef.current,
        start: 'top 70%',
        toggleActions: 'play none none none',
      },
    });
  }, { scope: sectionRef });

  const workflowSteps = [
    { title: 'Grondonderzoek & Sondering', subtitle: 'Gevalideerd door Bureau Broersma', status: 'done' },
    { title: 'Wapeningskeuring', subtitle: 'Foto upload geverifieerd • Betaling vrijgegeven', status: 'done' },
    { title: 'Storten Fundering', subtitle: 'Wacht op: Betonstort Logboek Upload', status: 'active' },
    { title: 'Casco Opbouw', subtitle: 'Start pas na uitharding validatie', status: 'locked' },
  ];

  return (
    <div ref={sectionRef} className="bg-[#0c1a2e] py-24 md:py-32 px-6 relative overflow-hidden">
      {/* Tinted background image */}
      <div className="absolute inset-0">
        <img 
          src="/generated/polder-dak-gevel.png" 
          alt="" 
          className="w-full h-full object-cover opacity-[0.04]"
        />
      </div>
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 opacity-50" style={subtleGridPattern} />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <AnimatedSection className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-semibold leading-tight mb-4 text-white tracking-[-0.02em]">
            Jouw Bouwsysteem
          </h2>
          <div className="text-base md:text-lg text-blue-200/60 font-light leading-relaxed max-w-2xl mx-auto">
            <p>Volg elke fase van je bouwproject in realtime.</p>
            <p>Transparant, gevalideerd en volledig onder controle.</p>
          </div>
        </AnimatedSection>
        
        {/* Dashboard Preview Card */}
        <AnimatedSection delay={100} className="bg-blue-500/10 backdrop-blur-sm border border-blue-500/20 rounded-2xl overflow-hidden max-w-3xl mx-auto">
          {/* Mini header with house grid visualization */}
          <div className="text-white px-6 py-4 flex justify-between items-center bg-blue-500/10 border-b border-blue-500/20">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-sm font-medium text-blue-100">Project Veluwse Heide</span>
            </div>
            <div className="flex items-center gap-4">
              <AnimatedHouseGrid rows={2} cols={6} />
              <div className="text-xs text-blue-300/60 font-mono">35% Voltooid</div>
            </div>
          </div>
          
          {/* Workflow Timeline Preview */}
          <div ref={timelineRef} className="p-8 space-y-0 relative">
            {/* Animated progress line */}
            <div className="absolute left-[35px] top-8 bottom-8 w-[1px] bg-blue-500/20" />
            <div 
              ref={progressLineRef}
              className="absolute left-[35px] top-8 w-[2px] bg-gradient-to-b from-blue-400 via-blue-500 to-blue-400/0"
              style={{ height: '65%', scaleY: 0 }}
            />
            
            {workflowSteps.map((step, index) => (
              <div 
                key={step.title}
                ref={(el) => { if (el) stepsRef.current[index] = el; }}
                className="flex gap-4 items-start py-4 relative z-10"
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  step.status === 'done' 
                    ? 'border-blue-400 bg-blue-400' 
                    : step.status === 'active'
                    ? 'border-blue-400 bg-blue-500/20'
                    : 'border-blue-500/30 bg-blue-500/5'
                }`}>
                  {step.status === 'done' && <CheckCircle2 size={12} className="text-[#0a1628]" />}
                  {step.status === 'active' && <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />}
                </div>
                <div>
                  <div className={`text-sm font-medium ${
                    step.status === 'locked' ? 'text-blue-400/40' : 'text-blue-100'
                  }`}>{step.title}</div>
                  <div className={`text-xs mt-1 font-light ${
                    step.status === 'locked' ? 'text-blue-400/30' : 'text-blue-300/50'
                  }`}>{step.subtitle}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom action bar */}
          <div className="bg-blue-500/5 px-6 py-4 border-t border-blue-500/20 flex justify-between items-center">
            <div className="text-xs text-blue-300/50">Laatste update: Vandaag, 09:41</div>
            <button 
              onClick={() => setAppState(AppState.WORKSPACE)}
              className="group flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
            >
              Open Overzicht <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </AnimatedSection>
        
        {/* Powered by Broersma + CTA */}
        <AnimatedSection delay={200} className="flex flex-col items-center justify-center mt-12 md:mt-16 gap-6">
          <div className="flex flex-col items-center gap-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-300/50">Met ondersteuning van</span>
            <a 
              href="https://www.bureau-broersma.nl" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group px-6 md:px-8 py-3 md:py-4 bg-blue-500/10 border border-blue-500/20 hover:border-blue-400/40 transition-all rounded-xl"
            >
              <img 
                src={BROERSMA_LOGO} 
                alt="Bureau Broersma" 
                className="h-8 md:h-10 brightness-0 invert opacity-60 group-hover:opacity-90 transition-opacity"
              />
            </a>
          </div>
          <PrimaryButton 
            onClick={() => setAppState(AppState.WIZARD_HOUSEHOLD)}
            size="lg"
          >
            Start je droomhuis ontwerp
          </PrimaryButton>
        </AnimatedSection>
      </div>
    </div>
  );
};

// ============================================
// HOW IT WORKS SECTION WITH SCROLL ANIMATIONS
// ============================================
const HowItWorksSection: React.FC<{ setAppState: (state: AppState) => void }> = ({ setAppState }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const steps = [
    {
      number: '01',
      title: 'Vibe & Stijl',
      description: 'Bepaal je esthetiek. Onze AI vertaalt jouw smaak naar een architectonisch ontwerp.',
      image: '/generated/steps/step-01-vibe-stijl.jpg',
      onClick: () => setAppState(AppState.WIZARD_HOUSEHOLD),
    },
    {
      number: '02',
      title: 'Kaveltoets',
      description: 'Wij scannen het bestemmingsplan. Mag je hier bouwen? Wat zijn de regels? Direct antwoord.',
      image: '/generated/steps/step-02-kavel-check.jpg',
      onClick: () => setAppState(AppState.WIZARD_HOUSEHOLD),
    },
    {
      number: '03',
      title: 'Het Paspoort',
      description: 'Je ontvangt een Woningpaspoort. Kosten, materialen en duurzaamheid in één dossier.',
      image: '/generated/steps/step-03-paspoort.jpg',
      onClick: () => {
        const passportSection = document.getElementById('passport-section');
        passportSection?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      number: '04',
      title: 'Het Bouwdashboard',
      description: 'Geen gedoe. Volg de bouw via je dashboard. Betalingen gaan pas weg als het werk af is.',
      image: '/generated/steps/step-04-bouw-os.jpg',
      onClick: () => setAppState(AppState.WIZARD_HOUSEHOLD),
      hasOverlay: true,
    },
  ];

  return (
    <div id="how-it-works" ref={sectionRef} className="relative overflow-hidden">
      {/* Premium dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#080f1a] via-[#0c1a2e] to-[#0e1d33]" />
      
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />

      <div className="relative z-10 py-20 md:py-32 px-5 md:px-8">
        <div className="max-w-[1200px] mx-auto">
          {/* Header Section */}
          <AnimatedSection className="text-center mb-16 md:mb-20">
            <div ref={headerRef}>
              <span className="inline-block text-[10px] md:text-xs uppercase tracking-[0.3em] text-blue-400/70 font-medium mb-4 md:mb-5">
                Het Proces
              </span>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-semibold mb-4 md:mb-6 text-white tracking-[-0.03em]">
                Hoe werkt het?
              </h2>
              <p className="text-base md:text-lg text-blue-200/50 font-light max-w-xl mx-auto leading-relaxed">
                Van eerste idee naar sleuteloverdracht in vier stappen.
              </p>
            </div>
          </AnimatedSection>
          
          {/* Steps Grid - Mobile: vertical cards, Desktop: horizontal grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 mb-16 md:mb-20">
            {steps.map((step, index) => (
              <TimelineStep
                key={step.number}
                {...step}
                delay={index * 100}
              />
            ))}
          </div>

          {/* CTA Section */}
          <AnimatedSection className="text-center">
            <PrimaryButton 
              onClick={() => setAppState(AppState.WIZARD_HOUSEHOLD)}
              size="lg"
            >
              Start het proces
            </PrimaryButton>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
};

// FAQ Accordion Item
const FAQItem: React.FC<{ question: string; answer: string; isOpen: boolean; onToggle: () => void }> = ({
  question,
  answer,
  isOpen,
  onToggle
}) => (
  <div className="border-b border-blue-500/20">
    <button
      onClick={onToggle}
      className="w-full py-6 flex items-center justify-between text-left hover:bg-blue-500/5 transition-colors px-2 -mx-2 rounded-lg"
    >
      <span className="font-medium text-white pr-8">{question}</span>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-all ${isOpen ? 'bg-blue-400 border-blue-400' : 'border-blue-500/30'}`}>
        {isOpen ? <Minus size={14} className="text-[#0a1628]" /> : <Plus size={14} className="text-blue-400" />}
      </div>
    </button>
    <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-6' : 'max-h-0'}`}>
      <p className="text-blue-200/60 font-light leading-relaxed px-2">{answer}</p>
    </div>
  </div>
);

export const Hero: React.FC<HeroProps> = ({ setAppState }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);
  const [email, setEmail] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMenuMounted, setMobileMenuMounted] = useState(false); // Prevents flicker on initial load
  const [scrollProgress, setScrollProgress] = useState(0);
  const [passportExpanded, setPassportExpanded] = useState(false);
  const { t, language } = useTranslation();

  // Sticky header on scroll + reading progress
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
      
      // Calculate reading progress
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = Math.min(Math.round((scrolled / documentHeight) * 100), 100);
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Memoized dots for State of Market banner (fixes random re-render issue)
  const marketDots = useMemo(() => 
    [...Array(15)].map((_, i) => ({
      left: `${10 + Math.random() * 80}%`,
      top: `${10 + Math.random() * 80}%`,
      delay: `${Math.random() * 2}s`
    })), []
  );

  const faqs = [
    {
      question: "Wat kost het om te starten?",
      answer: "Het eerste ontwerp en je Woningpaspoort zijn volledig gratis. Je betaalt pas wanneer je besluit door te gaan met de bouw. Geen verborgen kosten, geen verplichtingen."
    },
    {
      question: "Hoe lang duurt het hele traject van ontwerp tot sleutel?",
      answer: "Gemiddeld 10-14 maanden van eerste ontwerp tot sleuteloverdracht. Dit is significant sneller dan traditioneel bouwen (18-24 maanden) dankzij onze voorgevalideerde processen en gestroomlijnde vergunningsaanvraag."
    },
    {
      question: "Werkt dit ook als ik nog geen kavel heb?",
      answer: "Jazeker! Je kunt alvast je droomhuis ontwerpen en wij helpen je met onze Kavelzoeker om de perfecte locatie te vinden die past bij jouw ontwerp en budget."
    },
    {
      question: "Is dit voor particulieren of ook projectontwikkelaars?",
      answer: "Beide. Particulieren gebruiken ons platform voor hun droomhuis, terwijl ontwikkelaars profiteren van onze schaalbare workflows en gevalideerde processen voor meerdere projecten tegelijk."
    },
    {
      question: "Wat als mijn ontwerp niet past binnen het bestemmingsplan?",
      answer: "Ons systeem checkt dit automatisch voordat je tijd investeert. We geven direct feedback over wat wel en niet mogelijk is, inclusief suggesties voor aanpassingen die wél binnen de regels vallen."
    }
  ];

  return (
    <div className="bg-[#0a1628] w-full text-white">
      {/* 1. HERO SECTION */}
      <HeroSection setAppState={setAppState} />

        {/* Navigation - Premium, floating glassmorphism design */}
        <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled ? 'py-2 md:py-3' : 'py-3 md:py-5'}`}>
          <div className="max-w-[1400px] mx-auto px-4 md:px-8">
            <div className={`relative flex items-center justify-between px-4 md:px-8 py-2.5 md:py-4 rounded-xl md:rounded-2xl transition-all duration-500 ${
              isScrolled 
                ? 'bg-[#0a1628]/95 backdrop-blur-xl shadow-2xl shadow-[#0a1628]/40 border border-[#1e3a5f]/30' 
                : 'bg-white/[0.03] backdrop-blur-md border border-white/[0.06]'
            }`}>
              
              {/* Progress bar at top of nav */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/[0.05] rounded-t-2xl overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300 ease-out"
                  style={{ width: `${scrollProgress}%` }}
                />
              </div>

              {/* Left: Logo */}
              <a href="#" className="relative group z-10 flex items-center">
                {/* OG Logo */}
                <div className="relative w-10 h-10 md:w-11 md:h-11 flex items-center justify-center">
                  <img 
                    src="/generated/og-logo.png" 
                    alt="Ooit Gedacht" 
                    className="w-full h-full object-contain brightness-0 invert"
                  />
                </div>
              </a>
              
              {/* Center: Navigation Links */}
              <div className="hidden md:flex items-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="flex items-center bg-white/[0.04] rounded-full px-2 py-1.5 border border-white/[0.06]">
                  <button 
                    onClick={() => setAppState(AppState.WORKSPACE)}
                    className="relative px-4 md:px-5 py-2 text-[12px] md:text-[13px] text-white/70 hover:text-white transition-all duration-300 rounded-full hover:bg-white/[0.08] group"
                  >
                    <span className="relative z-10 flex items-center gap-1.5">
                      <Home size={14} />
                      <span className="hidden lg:inline">{t('nav.overview')}</span>
                    </span>
                  </button>
                  <button 
                    onClick={() => setAppState(AppState.STATE_OF_MARKET)}
                    className="relative px-4 md:px-5 py-2 text-[12px] md:text-[13px] text-white/70 hover:text-white transition-all duration-300 rounded-full hover:bg-white/[0.08] group"
                  >
                    <span className="relative z-10 flex items-center gap-1.5">
                      <BarChart3 size={14} />
                      <span className="hidden lg:inline">{t('nav.market')}</span>
                    </span>
                  </button>
                  <button 
                    onClick={() => setAppState(AppState.INVESTOR_PITCH)}
                    className="relative px-4 md:px-5 py-2 text-[12px] md:text-[13px] text-white/70 hover:text-white transition-all duration-300 rounded-full hover:bg-white/[0.08] group"
                  >
                    <span className="relative z-10 flex items-center gap-1.5">
                      <FileText size={14} />
                      <span className="hidden lg:inline">{t('nav.presentation')}</span>
                    </span>
                  </button>
                  <button 
                    onClick={() => setAppState(AppState.B2B_BUILDERS)}
                    className="relative px-4 md:px-5 py-2 text-[12px] md:text-[13px] text-white/70 hover:text-white transition-all duration-300 rounded-full hover:bg-white/[0.08] group bg-amber-500/10 border border-amber-500/20"
                  >
                    <span className="relative z-10 flex items-center gap-1.5 text-amber-400">
                      <Hammer size={14} />
                      <span className="hidden xl:inline">Voor Aannemers</span>
                      <span className="xl:hidden">B2B</span>
                    </span>
                  </button>
                </div>
              </div>

              {/* Right: CTA + Mobile Menu */}
              <div className="flex items-center gap-3 z-10">
                {/* Language Toggle */}
                <LanguageToggle variant="pill" />
                
                {/* Desktop CTA */}
                <PrimaryButton 
                  onClick={() => setAppState(AppState.WIZARD_HOUSEHOLD)}
                  size="sm"
                  className="hidden md:flex"
                >
                  {t('nav.startBuilding')}
                </PrimaryButton>

                {/* Mobile Menu Button */}
                <button 
                  onClick={() => {
                    setMobileMenuMounted(true);
                    setMobileMenuOpen(!mobileMenuOpen);
                  }}
                  className="lg:hidden flex items-center justify-center w-11 h-11 rounded-2xl bg-white/[0.08] border border-white/[0.15] hover:bg-white/[0.15] transition-all duration-300 backdrop-blur-sm"
                >
                  <div className="relative w-5 h-5 flex flex-col items-center justify-center">
                    <span className={`absolute w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${mobileMenuOpen ? 'rotate-45' : '-translate-y-1.5'}`} />
                    <span className={`absolute w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
                    <span className={`absolute w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${mobileMenuOpen ? '-rotate-45' : 'translate-y-1.5'}`} />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile Menu - Full Screen Glassmorphic Overlay (only rendered after first interaction) */}
        {mobileMenuMounted && (
        <div 
          className={`fixed inset-0 z-[100] lg:hidden transition-all duration-500 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        >
          {/* Backdrop blur */}
          <div 
            className="absolute inset-0 bg-[#030712]/60 backdrop-blur-2xl"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Gradient overlays for depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-cyan-500/5 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.1),transparent_50%)] pointer-events-none" />
          
          {/* Animated grid pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }} />
          
          {/* Menu Content */}
          <div className={`relative h-full flex flex-col px-6 pt-24 pb-8 transition-all duration-500 delay-100 ${mobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
            
            {/* Close button in top right */}
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-6 right-6 w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center hover:bg-white/[0.1] transition-all"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-white/70">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            
            {/* Logo */}
            <div className="mb-12 flex items-center">
              {/* OG Logo */}
              <div className="w-14 h-14 flex items-center justify-center">
                <img 
                  src="/generated/og-logo.png" 
                  alt="Ooit Gedacht" 
                  className="w-full h-full object-contain brightness-0 invert"
                />
              </div>
            </div>
            
            {/* Navigation Links */}
            <nav className="flex-1">
              <ul className="space-y-3">
                {/* Voor Aannemers - Featured */}
                <li>
                  <button 
                    onClick={() => {
                      setAppState(AppState.B2B_BUILDERS);
                      setMobileMenuOpen(false);
                    }}
                    className="group w-full flex items-center gap-5 p-5 rounded-3xl bg-gradient-to-r from-amber-500/20 to-orange-500/10 border border-amber-500/30 hover:from-amber-500/30 hover:to-orange-500/20 hover:border-amber-500/50 transition-all duration-300"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 p-[1px]">
                      <div className="w-full h-full rounded-2xl bg-[#0a0f1a] flex items-center justify-center text-amber-400 group-hover:text-amber-300 transition-colors">
                        <Hammer size={24} />
                      </div>
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-lg font-bold text-amber-400 group-hover:text-amber-300 transition-colors">Voor Aannemers</p>
                      <p className="text-sm text-amber-400/60 group-hover:text-amber-300/70 transition-colors">BouwBorg B2B Platform</p>
                    </div>
                    <ChevronRight size={20} className="text-amber-400/40 group-hover:text-amber-300/70 group-hover:translate-x-1 transition-all" />
                  </button>
                </li>
                
                {/* Other nav items */}
                {[
                  { 
                    icon: <Home size={22} />, 
                    label: 'Overzicht', 
                    sublabel: 'Dashboard & Status',
                    color: 'from-blue-400 to-cyan-400',
                    onClick: () => {
                      setAppState(AppState.WORKSPACE);
                      setMobileMenuOpen(false);
                    }
                  },
                  { 
                    icon: <BarChart3 size={22} />, 
                    label: 'Markt Analyse', 
                    sublabel: 'Actuele marktdata',
                    color: 'from-emerald-400 to-teal-400',
                    onClick: () => {
                      setAppState(AppState.STATE_OF_MARKET);
                      setMobileMenuOpen(false);
                    }
                  },
                  { 
                    icon: <FileText size={22} />, 
                    label: 'Presentatie', 
                    sublabel: 'Investor Pitch Deck',
                    color: 'from-purple-400 to-violet-400',
                    onClick: () => {
                      setAppState(AppState.INVESTOR_PITCH);
                      setMobileMenuOpen(false);
                    }
                  },
                ].map((item, i) => (
                  <li key={i}>
                    <button 
                      onClick={item.onClick}
                      className="group w-full flex items-center gap-5 p-5 rounded-3xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-300"
                      style={{ transitionDelay: `${i * 50}ms` }}
                    >
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} p-[1px]`}>
                        <div className="w-full h-full rounded-2xl bg-[#0a0f1a] flex items-center justify-center text-white/80 group-hover:text-white transition-colors">
                          {item.icon}
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="text-lg font-semibold text-white/90 group-hover:text-white transition-colors">{item.label}</p>
                        <p className="text-sm text-white/40 group-hover:text-white/60 transition-colors">{item.sublabel}</p>
                      </div>
                      <ChevronRight size={20} className="ml-auto text-white/20 group-hover:text-white/50 group-hover:translate-x-1 transition-all" />
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
            
            {/* Bottom CTA */}
            <div className="mt-auto space-y-4">
              <PrimaryButton 
                onClick={() => {
                  setAppState(AppState.WIZARD_HOUSEHOLD);
                  setMobileMenuOpen(false);
                }}
                size="lg"
                fullWidth
                icon={<Sparkles size={22} />}
              >
                Start je droomhuis
              </PrimaryButton>
              
              <p className="text-center text-white/30 text-sm">
                Gratis • Geen account nodig
              </p>
            </div>
          </div>
        </div>
        )}

      {/* 2. DIT IS WAT JE KRIJGT - Result Showcase */}
      <div id="result-showcase" className="bg-[#0a1628] py-20 md:py-28 relative overflow-hidden">
        {/* Subtle background image */}
        <div className="absolute inset-0">
          <img src="/generated/coastal-modern-blueprint.png" alt="" className="w-full h-full object-cover opacity-[0.04]" />
        </div>
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          
          {/* Header */}
          <AnimatedSection className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-semibold text-white tracking-[-0.02em] mb-4">
              Wat je gratis krijgt van OoitGedacht
            </h2>
            <p className="text-white/50 font-light max-w-xl mx-auto text-base md:text-lg">
              Een volledig gevalideerd ontwerp met realistische kosten en specificaties.
            </p>
          </AnimatedSection>

          {/* Clean Image Display */}
          <AnimatedSection delay={100} className="mb-12 md:mb-16">
            <div className="rounded-2xl overflow-hidden">
              <img 
                src="/generated/result-showcase.png" 
                alt="Voorbeeld woningontwerp"
                className="w-full h-auto"
              />
            </div>
          </AnimatedSection>

          {/* Simple CTA */}
          <AnimatedSection delay={200} className="text-center flex flex-col items-center">
            <PrimaryButton 
              onClick={() => setAppState(AppState.WIZARD_HOUSEHOLD)}
              size="lg"
            >
              Start jouw ontwerp
            </PrimaryButton>
            <p className="text-white/40 text-sm mt-4">
              Gratis • 3 minuten • Geen account nodig
            </p>
          </AnimatedSection>
        </div>
      </div>

      {/* 3. DASHBOARD WORKFLOW PREVIEW - Jouw Bouwsysteem */}
      <DashboardPreviewSection setAppState={setAppState} />

      {/* 4. HOUSING PASSPORT SECTION - Provenance & Authenticity */}
      <div id="passport-section" className="bg-[#0a1628] py-24 md:py-32 px-6 border-b border-blue-500/10 relative overflow-hidden">
          {/* Tinted background image */}
          <div className="absolute inset-0">
            <img 
              src="/generated/blueprint-wood-house.png" 
              alt="" 
              className="w-full h-full object-cover opacity-[0.03]"
            />
          </div>
          {/* Subtle background image */}
          <div className="absolute inset-0">
            <img src="/generated/blueprint-wood-house.png" alt="" className="w-full h-full object-cover opacity-[0.05]" />
          </div>
          <div className="max-w-7xl mx-auto relative z-10">
              
              {/* Section Header */}
              <AnimatedSection className="text-center mb-16 md:mb-20">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-xs font-bold uppercase tracking-[0.2em] mb-6 text-blue-300">
                      <Shield size={12} /> Certificaat van Authenticiteit
                  </div>
                  <h2 className="text-4xl md:text-6xl font-semibold leading-tight mb-6 text-white tracking-[-0.02em]">
                      Het Woningpaspoort
             </h2>
                  <div className="text-lg md:text-xl text-blue-200/60 max-w-2xl mx-auto font-light">
                      <p>Elk ontwerp krijgt een uniek, geverifieerd document</p>
                      <p>met volledige traceerbaarheid van idee tot vergunning.</p>
                  </div>
              </AnimatedSection>

              {/* Main Passport Document */}
              <AnimatedSection delay={100} className="max-w-5xl mx-auto">
                  <div className="bg-[#0d1f3c] border border-blue-500/20 shadow-2xl shadow-blue-500/10 rounded-2xl relative overflow-hidden">
                      
                      {/* Security Pattern Watermark */}
                      <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
                          backgroundImage: `repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)`,
                          backgroundSize: '10px 10px'
                      }} />
                      
                      {/* Document Header - Always visible */}
                      <div className="text-white px-6 md:px-10 py-6 md:py-8 bg-gradient-to-r from-[#0d1f3c] to-[#0a1628]">
                          <div className="flex items-center gap-4 md:gap-6">
                              <div className="w-14 h-14 md:w-16 md:h-16 border-2 border-white/20 flex items-center justify-center">
                                  <FileText size={28} className="text-white" strokeWidth={1} />
                              </div>
                              <div>
                                  <div className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-1">Ooit Gedacht × Bureau Broersma</div>
                                  <div className="text-xl md:text-2xl font-medium tracking-[-0.01em]">Woningpaspoort</div>
                              </div>
                          </div>
                      </div>
                          
                      {/* Stats Grid - Always visible */}
                      <div className="px-6 md:px-10 py-6 md:py-8 border-t border-blue-500/10">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                            <AnimatedStatCard 
                              value={485000} 
                              prefix="€" 
                              label="Totale Bouwkosten" 
                              sublabel="excl. BTW & grond"
                              delay={0}
                            />
                            <div>
                                <div className="text-[9px] uppercase tracking-[0.2em] text-blue-300/50 mb-1">Energielabel</div>
                                <div className="font-mono text-xl md:text-2xl font-medium text-blue-400">A++++</div>
                                <div className="text-[10px] text-blue-300/40 mt-0.5">BENG-proof</div>
                            </div>
                            <AnimatedStatCard 
                              value={8} 
                              suffix=" mnd" 
                              label="Bouwtijd" 
                              sublabel="vanaf start bouw"
                              delay={200}
                            />
                            <div>
                                <div className="text-[9px] uppercase tracking-[0.2em] text-blue-300/50 mb-1">MPG Score</div>
                                <div className="font-mono text-xl md:text-2xl font-medium text-white">0.48</div>
                                <div className="text-[10px] text-blue-300/40 mt-0.5">norm: &lt;0.8</div>
                            </div>
                          </div>
                      </div>

                      {/* Expand Button - Animated call to action */}
                      <button 
                        onClick={() => setPassportExpanded(!passportExpanded)}
                        className="w-full px-6 md:px-10 py-4 border-t border-blue-500/10 bg-blue-500/5 hover:bg-blue-500/10 transition-all cursor-pointer group"
                      >
                          <div className="flex items-center justify-center gap-3">
                              <span className="text-sm text-blue-300/70 group-hover:text-blue-300 transition-colors">
                                {passportExpanded ? 'Verberg details' : 'Bekijk volledige validatie & herkomst'}
                              </span>
                              <div className={`w-6 h-6 rounded-full border border-blue-400/50 flex items-center justify-center transition-all duration-300 group-hover:border-blue-400 group-hover:bg-blue-400/20 ${passportExpanded ? 'rotate-180' : 'animate-bounce'}`}>
                                <ChevronDown size={14} className="text-blue-400" />
                              </div>
                          </div>
                      </button>
                          
                      {/* Collapsible Content */}
                      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${passportExpanded ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                      {/* Document Body - Detailed Info */}
                      <div className="px-6 md:px-10 py-8 md:py-10 border-t border-blue-500/10">
                          
                          {/* Provenance Timeline */}
                          <div className="mb-10">
                              <div className="flex items-center gap-2 mb-6">
                                  <Clock size={14} className="text-blue-400/60" />
                                  <span className="text-[10px] uppercase tracking-[0.2em] text-blue-300/50 font-medium">Validatie Timeline</span>
      </div>

                              <div className="relative">
                                  {/* Timeline Line */}
                                  <div className="absolute left-[11px] top-3 bottom-3 w-px bg-gradient-to-b from-blue-400 via-blue-500/50 to-blue-500/20" />
                                  
                                  {/* Timeline Items */}
                                  <div className="space-y-6">
                                      {/* Step 1 */}
                                      <div className="flex gap-4 md:gap-6">
                                          <div className="relative">
                                              <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center">
                                                  <CheckCircle2 size={14} className="text-[#0a1628]" />
                              </div>
                                          </div>
                                          <div className="flex-1 pb-6">
                                              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-4 mb-2">
                                                  <span className="font-medium text-white text-sm md:text-base">AI Ontwerp Gegenereerd</span>
                                                  <span className="font-mono text-[10px] md:text-xs text-blue-300/50">2024-11-15 • 14:32:07 CET</span>
                                              </div>
                                              <p className="text-xs md:text-sm text-blue-200/50">Stijlprofiel geanalyseerd, bouwvolume berekend, eerste 3D model gegenereerd op basis van 47 voorkeuren.</p>
                                              <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 bg-blue-500/10 text-[9px] font-mono text-blue-300/60">
                                                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                                                  SHA256: 7f8a2b...e4c1
                                              </div>
                              </div>
                          </div>
                          
                                      {/* Step 2 */}
                                      <div className="flex gap-4 md:gap-6">
                                          <div className="relative">
                                              <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center">
                                                  <CheckCircle2 size={14} className="text-[#0a1628]" />
                                              </div>
                                          </div>
                                          <div className="flex-1 pb-6">
                                              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-4 mb-2">
                                                  <span className="font-medium text-white text-sm md:text-base">Bestemmingsplan Getoetst</span>
                                                  <span className="font-mono text-[10px] md:text-xs text-blue-300/50">2024-11-15 • 14:32:12 CET</span>
                                              </div>
                                              <p className="text-xs md:text-sm text-blue-200/50">Automatische check tegen gemeentelijk bestemmingsplan. Bouwvlak, goothoogte, en bebouwingspercentage gevalideerd.</p>
                                              <div className="mt-2 flex flex-wrap gap-2">
                                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-500/10 border border-blue-500/30 text-blue-300 text-[9px] font-medium uppercase tracking-wider">
                                                      <CheckCircle2 size={10} /> Bouwvlak OK
                                                  </span>
                                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-500/10 border border-blue-500/30 text-blue-300 text-[9px] font-medium uppercase tracking-wider">
                                                      <CheckCircle2 size={10} /> Goothoogte OK
                                                  </span>
                                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-500/10 border border-blue-500/30 text-blue-300 text-[9px] font-medium uppercase tracking-wider">
                                                      <CheckCircle2 size={10} /> Nokhoogte OK
                                                  </span>
                                              </div>
                                          </div>
                      </div>
                      
                                      {/* Step 3 */}
                                      <div className="flex gap-4 md:gap-6">
                                          <div className="relative">
                                              <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center">
                                                  <CheckCircle2 size={14} className="text-[#0a1628]" />
                      </div>
                                          </div>
                                          <div className="flex-1 pb-6">
                                              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-4 mb-2">
                                                  <span className="font-medium text-white text-sm md:text-base">Constructieve Haalbaarheid</span>
                                                  <span className="font-mono text-[10px] md:text-xs text-blue-300/50">2024-11-15 • 14:33:45 CET</span>
                                              </div>
                                              <p className="text-xs md:text-sm text-blue-200/50">Preliminaire constructieberekening door Bureau Broersma. Fundering, draagstructuur en spanwijdtes gecontroleerd.</p>
                                              <div className="mt-3 flex items-center gap-3 p-3 text-white bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                                  <img src={BROERSMA_LOGO} alt="Bureau Broersma" className="h-5 brightness-0 invert opacity-80" />
                                                  <div className="text-[10px]">
                                                      <div className="text-blue-300/50 uppercase tracking-wider">Gevalideerd door</div>
                                                      <div className="font-medium text-blue-100">Bureau Broersma Constructie B.V.</div>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                      
                                      {/* Step 4 */}
                                      <div className="flex gap-4 md:gap-6">
                                          <div className="relative">
                                              <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center">
                                                  <CheckCircle2 size={14} className="text-[#0a1628]" />
                          </div>
                                          </div>
                                          <div className="flex-1 pb-6">
                                              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-4 mb-2">
                                                  <span className="font-medium text-white text-sm md:text-base">Kostenraming Gegenereerd</span>
                                                  <span className="font-mono text-[10px] md:text-xs text-blue-300/50">2024-11-15 • 14:34:02 CET</span>
                                              </div>
                                              <p className="text-xs md:text-sm text-blue-200/50">Gedetailleerde kostenopbouw op basis van actuele marktprijzen Q4 2024. Inclusief 10% onvoorzien.</p>
                                              <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px]">
                                                  <div className="p-2 bg-blue-500/10 rounded"><span className="text-blue-300/50">Ruwbouw</span><br/><span className="font-mono font-medium text-white">€198.500</span></div>
                                                  <div className="p-2 bg-blue-500/10 rounded"><span className="text-blue-300/50">Installaties</span><br/><span className="font-mono font-medium text-white">€127.300</span></div>
                                                  <div className="p-2 bg-blue-500/10 rounded"><span className="text-blue-300/50">Afbouw</span><br/><span className="font-mono font-medium text-white">€114.700</span></div>
                                                  <div className="p-2 bg-blue-500/10 rounded"><span className="text-blue-300/50">Onvoorzien</span><br/><span className="font-mono font-medium text-white">€44.500</span></div>
                                              </div>
                                          </div>
                      </div>
                      
                                      {/* Step 5 */}
                                      <div className="flex gap-4 md:gap-6">
                                          <div className="relative">
                                              <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center">
                                                  <CheckCircle2 size={14} className="text-[#0a1628]" />
                              </div>
                              </div>
                                          <div className="flex-1">
                                              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-4 mb-2">
                                                  <span className="font-medium text-white text-sm md:text-base">Paspoort Afgegeven</span>
                                                  <span className="font-mono text-[10px] md:text-xs text-blue-300/50">2024-11-15 • 14:34:18 CET</span>
                          </div>
                                              <p className="text-xs md:text-sm text-blue-200/50">Document cryptografisch ondertekend en opgeslagen. Geldig voor 90 dagen, automatisch verlengbaar.</p>
                              </div>
                              </div>
                          </div>
                              </div>
                              </div>
                          
                          {/* Document Footer - Authenticity Section */}
                          <div className="pt-8 border-t border-blue-500/10">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                                  
                                  {/* QR Verification */}
                                  <div className="flex items-start gap-4">
                                      <div className="w-20 h-20 bg-blue-500/10 p-2 flex-shrink-0 rounded">
                                          {/* Simulated QR Code */}
                                          <div className="w-full h-full grid grid-cols-5 gap-0.5">
                                              {[...Array(25)].map((_, i) => (
                                                  <div key={i} className={`${[0,1,2,3,4,5,9,10,14,15,19,20,21,22,23,24].includes(i) ? 'bg-blue-400' : 'bg-transparent'}`} />
                                              ))}
                          </div>
                              </div>
                                      <div className="text-[10px] text-blue-200/50">
                                          <div className="font-medium text-blue-300 mb-1 uppercase tracking-wider">Verificatie</div>
                                          <div className="mb-2">Scan om authenticiteit te controleren op passport.ooitgedacht.nl</div>
                                          <div className="font-mono text-blue-300/40">ID: OG-2024-NL-0847</div>
                                      </div>
                                  </div>
                                  
                                  {/* Digital Signature */}
                              <div>
                                      <div className="text-[10px] font-medium text-blue-300 mb-2 uppercase tracking-wider">Digitale Handtekening</div>
                                      <div className="font-mono text-[9px] text-blue-300/40 break-all leading-relaxed bg-blue-500/10 p-2 rounded">
                                          0x7f8a2b4c9e1d3f5a8b7c6d9e2f4a1b3c5d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7
                              </div>
                                      <div className="text-[9px] text-blue-300/40 mt-1">ECDSA P-256 • Timestamped</div>
                                  </div>
                                  
                                  {/* Issuer */}
                                  <div>
                                      <div className="text-[10px] font-medium text-blue-300 mb-2 uppercase tracking-wider">Uitgegeven door</div>
                                      <div className="flex items-center gap-3">
                                          <img src={BROERSMA_LOGO} alt="Bureau Broersma" className="h-8 brightness-0 invert opacity-60" />
                                          <div className="text-[10px]">
                                              <div className="font-medium text-blue-100">Bureau Broersma</div>
                                              <div className="text-blue-300/40">Constructie & Advies sinds 1932</div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                      
                      {/* Official Stamps */}
                      <div className="px-6 md:px-10 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-white bg-blue-500/5 border-t border-blue-500/10 rounded-b-2xl">
                          <div className="flex flex-wrap gap-3">
                              <div className="flex items-center gap-2 px-3 py-1.5 border border-blue-400/30 bg-blue-400/10 rounded">
                                  <CheckCircle2 size={12} className="text-blue-400" />
                                  <span className="text-[9px] uppercase tracking-wider text-blue-300 font-medium">Constructie Gevalideerd</span>
                              </div>
                              <div className="flex items-center gap-2 px-3 py-1.5 border border-blue-400/30 bg-blue-400/10 rounded">
                                  <CheckCircle2 size={12} className="text-blue-400" />
                                  <span className="text-[9px] uppercase tracking-wider text-blue-300 font-medium">Bestemmingsplan OK</span>
                              </div>
                              <div className="flex items-center gap-2 px-3 py-1.5 border border-blue-400/30 bg-blue-400/10 rounded">
                                  <CheckCircle2 size={12} className="text-blue-400" />
                                  <span className="text-[9px] uppercase tracking-wider text-blue-300 font-medium">Kosten Geverifieerd</span>
                              </div>
                          </div>
                          <div className="text-[9px] text-blue-300/50 uppercase tracking-wider">
                              Geldig t/m: 2025-02-15
                          </div>
                          </div>
                      </div>
                      </div>{/* End collapsible content */}
                  </AnimatedSection>
              
              {/* Bottom Trust Indicators with Hand-Drawn Icons */}
              <TrustIndicatorsSection />

              {/* CTA Section */}
              <AnimatedSection delay={300} className="mt-16 md:mt-20 flex flex-col items-center text-center">
                  <p className="text-blue-200/60 text-sm md:text-base mb-6 max-w-md font-light">
                      Klaar om jouw droomhuis te ontwerpen?
                  </p>
                  <button 
                      onClick={() => setAppState(AppState.WIZARD_HOUSEHOLD)}
                      className="group px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full transition-all duration-200"
                  >
                      <span className="flex items-center gap-3">
                          Start Gratis Configuratie
                          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                  </button>
                  <p className="text-blue-200/40 text-xs mt-4">
                      Geen account nodig • 3 minuten • 100% gratis
                  </p>
              </AnimatedSection>
          </div>
      </div>

      {/* 5. HOW IT WORKS - Timeline with GSAP Animations */}
      <HowItWorksSection setAppState={setAppState} />

      {/* STAKEHOLDER COLLABORATION SECTION */}
      <div className="text-white py-24 md:py-32 px-6 relative overflow-hidden bg-[#0a1628]">
        {/* Tinted background image */}
        <div className="absolute inset-0">
          <img 
            src="/generated/thatched-systems.png" 
            alt="" 
            className="w-full h-full object-cover opacity-[0.1]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628]/50 via-transparent to-[#0a1628]/50" />
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <AnimatedSection className="text-center mb-16 md:mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-6">
              <Users size={14} /> Voor Iedereen in het Proces
        </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.05] mb-6 tracking-[-0.02em]">
              Ongekende samenwerking.<br/>
              <span className="text-blue-400">Volledige transparantie.</span>
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto font-light">
              Eén platform waar bouwheer, architect, constructeur, gemeente en aannemer samen werken aan hetzelfde dossier. Realtime. Auditeerbaar. Foutloos.
            </p>
          </AnimatedSection>

          {/* Stakeholder Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {/* Bouwheer */}
            <AnimatedSection delay={100} className="group">
              <div className="bg-white/5 border border-white/10 p-6 md:p-8 h-full hover:bg-white/10 transition-colors">
                <div className="w-14 h-14 bg-[#1e3a5f]/20 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-[#5b8ac7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
      </div>
                <h3 className="text-xl font-medium mb-3 tracking-[-0.01em]">Bouwheer</h3>
                <p className="text-white/50 text-sm leading-relaxed mb-4">
                  Volledige controle over je project. Zie precies waar elke euro naartoe gaat en volg de voortgang realtime.
                </p>
                <ul className="space-y-2 text-sm text-white/70">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[#5b8ac7] flex-shrink-0" />
                    Realtime kosteninzicht
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[#5b8ac7] flex-shrink-0" />
                    Directe besluitvorming
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[#5b8ac7] flex-shrink-0" />
                    Complete documentatie
                  </li>
                </ul>
              </div>
            </AnimatedSection>

            {/* Architect */}
            <AnimatedSection delay={200} className="group">
              <div className="bg-white/5 border border-white/10 p-6 md:p-8 h-full hover:bg-white/10 transition-colors">
                <div className="w-14 h-14 bg-cyan-500/20 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-3 tracking-[-0.01em]">Architect</h3>
                <p className="text-white/50 text-sm leading-relaxed mb-4">
                  Focus op ontwerp, niet op papierwerk. AI-assistentie voor snelle iteraties met directe validatie.
                </p>
                <ul className="space-y-2 text-sm text-white/70">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-cyan-400 flex-shrink-0" />
                    Directe haalbaarheidscheck
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-cyan-400 flex-shrink-0" />
                    Gedeelde ontwerpomgeving
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-cyan-400 flex-shrink-0" />
                    Versiebeheer & wijzigingslog
                  </li>
                </ul>
              </div>
            </AnimatedSection>

            {/* Constructeur */}
            <AnimatedSection delay={300} className="group">
              <div className="bg-white/5 border border-white/10 p-6 md:p-8 h-full hover:bg-white/10 transition-colors">
                <div className="w-14 h-14 bg-amber-500/20 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-3 tracking-[-0.01em]">Constructeur</h3>
                <p className="text-white/50 text-sm leading-relaxed mb-4">
                  Efficiënte validatie met vooraf gestructureerde data. Minder heen-en-weer, snellere goedkeuring.
                </p>
                <ul className="space-y-2 text-sm text-white/70">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-amber-400 flex-shrink-0" />
                    Gestandaardiseerde input
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-amber-400 flex-shrink-0" />
                    Digitale handtekening
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-amber-400 flex-shrink-0" />
                    Aansprakelijkheid bijhouden
                  </li>
                </ul>
              </div>
            </AnimatedSection>

            {/* Gemeente */}
            <AnimatedSection delay={400} className="group">
              <div className="bg-white/5 border border-white/10 p-6 md:p-8 h-full hover:bg-white/10 transition-colors">
                <div className="w-14 h-14 bg-purple-500/20 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-3 tracking-[-0.01em]">Gemeente</h3>
                <p className="text-white/50 text-sm leading-relaxed mb-4">
                  Complete, gevalideerde dossiers die direct voldoen aan bestemmingsplan eisen. Snellere afhandeling.
                </p>
                <ul className="space-y-2 text-sm text-white/70">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-purple-400 flex-shrink-0" />
                    Voorgevalideerde dossiers
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-purple-400 flex-shrink-0" />
                    Bestemmingsplan check
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-purple-400 flex-shrink-0" />
                    Minder bezwaren
                  </li>
                </ul>
              </div>
            </AnimatedSection>
          </div>

          {/* Auditability highlight */}
          <AnimatedSection delay={500} className="mt-16 md:mt-20">
            <div className="bg-blue-500/5 border border-blue-500/20 p-8 md:p-12 rounded-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                  <div className="flex items-center gap-2 text-blue-400 text-sm font-bold uppercase tracking-wider mb-4">
                    <Lock size={16} />
                    Volledige Audit Trail
                  </div>
                  <h3 className="text-2xl md:text-3xl font-medium mb-4 tracking-[-0.01em]">Elke beslissing. Elke wijziging. Gedocumenteerd.</h3>
                  <p className="text-white/60 leading-relaxed mb-6">
                    Van eerste schets tot oplevering: elk document, elke goedkeuring, elke wijziging wordt vastgelegd. Nooit meer discussie over wie wat wanneer heeft besloten.
                  </p>
                  <PrimaryButton 
                    onClick={() => setAppState(AppState.WIZARD_HOUSEHOLD)}
                    size="md"
                  >
                    Begin nu met ontwerpen
                  </PrimaryButton>
                </div>
                <div className="font-mono text-xs space-y-2 bg-[#06101f]/50 p-6 rounded-lg border border-[#1e3a5f]/30">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-[#5b8ac7] rounded-full" />
                    <span className="text-white/40">2024-11-15 14:32:07</span>
                    <span className="text-white/80">Ontwerp gegenereerd</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-[#5b8ac7] rounded-full" />
                    <span className="text-white/40">2024-11-15 14:33:45</span>
                    <span className="text-white/80">Constructie gevalideerd</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-[#5b8ac7] rounded-full" />
                    <span className="text-white/40">2024-11-16 09:12:33</span>
                    <span className="text-white/80">Bouwheer akkoord</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                    <span className="text-white/40">Nu</span>
                    <span className="text-cyan-400">Wacht op gemeente...</span>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
              </div>

      {/* MARKET REPORT SECTION */}
      <div className="bg-gradient-to-b from-[#0a1628] to-[#060a12] py-24 md:py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-red-950/10 via-transparent to-blue-950/10" />
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <AnimatedSection className="relative">
              <div className="relative rounded-2xl overflow-hidden border border-red-500/20 shadow-2xl shadow-red-500/10 group">
                <img 
                  src="/generated/market-report-preview.png" 
                  alt="Markt Analyse Rapport"
                  className="w-full transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-xs text-white/70 font-medium">Live Data 2025</span>
                  </div>
                </div>
              </div>
            </AnimatedSection>
            
            {/* Content */}
            <AnimatedSection delay={100}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full mb-6">
                <BarChart3 size={14} className="text-red-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-red-400">Marktrapport 2025</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white leading-[1.1] tracking-[-0.02em] mb-6">
                De Nederlandse<br />
                <span className="text-red-400">Woningmarkt</span>
              </h2>
              
              <div className="space-y-4 mb-8">
                <p className="text-lg text-white/60 leading-relaxed">
                  <span className="text-red-400 font-bold">401.000</span> woningen tekort. 
                  <span className="text-red-400 font-bold"> €5 miljard</span> aan faalkosten per jaar. 
                  <span className="text-red-400 font-bold"> 77%</span> van projecten over budget.
                </p>
                <p className="text-white/50">
                  Wat betekent dit voor jouw bouwplannen? Ontdek de cijfers, de oorzaken, en hoe je tot €50.000 kunt besparen.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <PrimaryButton 
                  onClick={() => setAppState(AppState.STATE_OF_MARKET)}
                  size="lg"
                >
                  Bekijk Volledige Analyse
                </PrimaryButton>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>

      {/* DASHBOARD PREVIEW SECTION */}
      <div className="bg-[#060a12] py-24 md:py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-tl from-emerald-950/10 via-transparent to-blue-950/10" />
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <AnimatedSection>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6">
                <LayoutDashboard size={14} className="text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Bouwbesturingssysteem</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white leading-[1.1] tracking-[-0.02em] mb-6">
                Volg je project<br />
                <span className="text-emerald-400">in realtime</span>
              </h2>
              
              <div className="space-y-4 mb-8">
                <p className="text-lg text-white/60 leading-relaxed">
                  Elke fase, elke betaling, elk document — transparant en gevalideerd door Bureau Broersma.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-white/50">
                    <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />
                    <span>Alle bouwfases met milestones en verificatie</span>
                  </li>
                  <li className="flex items-center gap-3 text-white/50">
                    <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />
                    <span>Woning Paspoort met energielabel en certificeringen</span>
                  </li>
                  <li className="flex items-center gap-3 text-white/50">
                    <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />
                    <span>Direct chatten met aannemer en keurmeester</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <PrimaryButton 
                  onClick={() => setAppState(AppState.DASHBOARD)}
                  variant="secondary"
                  size="lg"
                >
                  Bekijk Demo Dashboard
                </PrimaryButton>
              </div>
            </AnimatedSection>
            
            {/* Image */}
            <AnimatedSection delay={100} className="relative">
              <div className="relative rounded-2xl overflow-hidden border border-emerald-500/20 shadow-2xl shadow-emerald-500/10 group">
                <img 
                  src="/generated/dashboard-preview.png" 
                  alt="Dashboard Preview"
                  className="w-full transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-xs text-white/70 font-medium">Live Demo</span>
                  </div>
                  <span className="px-2 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                    Constructie OK
                  </span>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
              
      {/* 6. FAQ SECTION */}
      <div className="bg-[#0a1628] py-24 md:py-32 px-6 relative overflow-hidden">
        {/* Tinted background image */}
        <div className="absolute inset-0">
          <img 
            src="/generated/coastal-modern-blueprint.png" 
            alt="" 
            className="w-full h-full object-cover opacity-[0.03]"
          />
        </div>
        <div className="max-w-3xl mx-auto relative z-10">
          <AnimatedSection className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-white tracking-[-0.02em]">Veelgestelde vragen</h2>
            <p className="text-blue-200/60 font-light">Alles wat je wilt weten over de OoitGedacht-methode.</p>
          </AnimatedSection>
          
          <AnimatedSection delay={100}>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 md:p-8">
              {faqs.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openFAQ === index}
                  onToggle={() => setOpenFAQ(openFAQ === index ? null : index)}
                />
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* B2B SECTION - For Builders */}
      <div className="bg-[#060a12] py-24 md:py-32 px-6 relative overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img 
            src="/generated/b2b/smart-glasses-on-site.jpg" 
            alt="" 
            className="w-full h-full object-cover opacity-[0.15]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#060a12] via-[#060a12]/95 to-[#060a12]/80" />
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left content */}
            <AnimatedSection>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full text-xs font-bold uppercase tracking-[0.15em] mb-6 text-amber-400">
                <Hammer size={14} />
                Voor Bouwers
              </div>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white leading-[1.1] tracking-[-0.02em] mb-6">
                Bouwt u huizen?
                <br />
                <span className="text-white/40">Wij regelen het papierwerk.</span>
              </h2>
              
              <p className="text-lg text-white/60 leading-relaxed mb-8 max-w-lg">
                De Wkb maakt u 20 jaar aansprakelijk. Onze smart glasses + AI documenteren 
                automatisch elke stap die u zet. Zodat u kunt focussen op wat u het beste doet: 
                <strong className="text-white"> bouwen.</strong>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button 
                  onClick={() => setAppState(AppState.B2B_BUILDERS)}
                  className="group bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 font-semibold rounded-full shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all flex items-center justify-center gap-2"
                >
                  Ontdek BouwBorg
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Quick stats */}
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2 text-white/50">
                  <CheckCircle2 size={16} className="text-amber-400" />
                  80% minder administratie
                </div>
                <div className="flex items-center gap-2 text-white/50">
                  <CheckCircle2 size={16} className="text-amber-400" />
                  WKB compliant
                </div>
              </div>
            </AnimatedSection>

            {/* Right - Image showcase */}
            <AnimatedSection delay={200} className="hidden lg:block">
              <div className="relative">
                <img 
                  src="/generated/b2b/smart-glasses-workflow.jpg" 
                  alt="BouwBorg smart glasses in actie" 
                  className="rounded-2xl shadow-2xl shadow-black/50"
                />
                {/* Floating card */}
                <div className="absolute -bottom-6 -left-6 bg-[#0a1628] border border-amber-500/20 rounded-xl p-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                      <Eye size={20} className="text-amber-400" />
                    </div>
                    <div>
                      <div className="text-xs text-white/50">Automatische</div>
                      <div className="text-sm font-semibold text-white">WKB Documentatie</div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>

      {/* 7. NEWSLETTER / LEAD CAPTURE */}
      <div className="py-24 md:py-32 px-6 relative overflow-hidden bg-[#0a1628]">
        {/* Background image */}
        <div className="absolute inset-0">
          <img 
            src="/generated/forest-house-systems.jpg" 
            alt="" 
            className="w-full h-full object-cover opacity-[0.12]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/70 to-[#0a1628]/50" />
        </div>
        
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-xs font-bold uppercase tracking-widest mb-8 text-white/80">
              <Mail size={14} /> Blijf op de hoogte
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4 tracking-[-0.02em]">
              Wekelijks kavelnieuws & tips
            </h2>
            <p className="text-lg text-white/60 font-light mb-8 leading-relaxed">
              Ontvang de beste kavels in jouw regio, bouwtrends en slimme bespaartips. Geen spam, altijd waardevol.
            </p>
            
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                // Handle newsletter signup
                alert('Bedankt voor je aanmelding!');
                setEmail('');
              }}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jouw@email.nl"
                required
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 text-white placeholder:text-white/40 outline-none focus:border-white/40 transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white text-[#0a1628] font-medium hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
              >
                Aanmelden <ArrowRight size={16} />
              </button>
            </form>
            
            <p className="text-xs text-white/40 mt-4">
              1.247 bouwers ontvangen onze nieuwsbrief al
            </p>
          </AnimatedSection>
        </div>
      </div>

      {/* 8. FOOTER */}
      <footer className="text-white py-16 md:py-20 px-6 bg-[#06101f] relative overflow-hidden">
          {/* Subtle grid */}
          <div className="absolute inset-0 opacity-30" style={subtleGridPattern} />
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10 md:gap-12 relative z-10">
              <div className="max-w-xs">
                  <div className="mb-6 flex items-center">
                      {/* OG Logo */}
                      <div className="w-12 h-12 flex items-center justify-center">
                        <img 
                          src="/generated/og-logo.png" 
                          alt="Ooit Gedacht" 
                          className="w-full h-full object-contain brightness-0 invert opacity-80"
                        />
                      </div>
                  </div>
                  <p className="text-gray-500 text-sm font-light mb-6">
                      Samen bouwen aan betaalbaar wonen.
                  </p>
                  <a 
                    href="https://www.bureau-broersma.nl" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 group"
                  >
                      <span className="text-[10px] uppercase tracking-widest text-gray-600 group-hover:text-gray-400 transition-colors">Met ondersteuning van</span>
                      <img src={BROERSMA_LOGO} alt="Bureau Broersma" className="h-5 md:h-6 brightness-0 invert opacity-60 group-hover:opacity-80 transition-opacity" />
                  </a>
              </div>
              
              <div className="grid grid-cols-2 gap-8 md:gap-12">
                  <div className="space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500">Platform</h4>
                      <ul className="space-y-3 text-sm text-gray-400 font-light">
                          <li>
                            <button 
                              onClick={() => setAppState(AppState.WORKSPACE)}
                              className="hover:text-white transition-colors"
                            >
                              Overzicht
                            </button>
                          </li>
                          <li>
                            <button 
                              onClick={() => setAppState(AppState.STATE_OF_MARKET)}
                              className="hover:text-white transition-colors"
                            >
                              Markt Analyse
                            </button>
                          </li>
                          <li>
                            <button 
                              onClick={() => setAppState(AppState.WIZARD_HOUSEHOLD)}
                              className="hover:text-white transition-colors"
                            >
                              Start Ontwerp
                            </button>
                          </li>
                          <li>
                            <a href="mailto:gemeenten@ooitgedacht.nl" className="hover:text-white transition-colors">
                              Voor Gemeenten
                            </a>
                          </li>
                          <li>
                            <button 
                              onClick={() => setAppState(AppState.B2B_BUILDERS)}
                              className="hover:text-white transition-colors text-amber-400 hover:text-amber-300"
                            >
                              Voor Aannemers
                            </button>
                          </li>
                      </ul>
                  </div>
                  <div className="space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500">Legal</h4>
                      <ul className="space-y-3 text-sm text-gray-400 font-light">
                          <li><a href="#" className="hover:text-white transition-colors">Algemene Voorwaarden</a></li>
                          <li><a href="#" className="hover:text-white transition-colors">Privacy Statement</a></li>
                          <li><a href="#" className="hover:text-white transition-colors">Disclaimer</a></li>
                      </ul>
                  </div>
              </div>

              <div className="w-full md:w-auto">
                 <button 
                    onClick={() => setAppState(AppState.WIZARD_HOUSEHOLD)}
                    className="w-full md:w-auto bg-white text-[#0a1628] px-6 md:px-8 py-3 md:py-4 font-bold text-sm hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
                 >
                     Start Project <ArrowRight size={16} />
                 </button>
              </div>
          </div>
          <div className="max-w-6xl mx-auto mt-12 md:mt-20 pt-6 md:pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-xs text-gray-600">© 2025 Ooit Gedacht B.V. • Den Haag, Nederland</p>
              <div className="flex items-center gap-4 text-xs text-gray-600">
                <button 
                  onClick={() => setAppState(AppState.STATE_OF_MARKET)}
                  className="hover:text-gray-400 transition-colors flex items-center gap-1"
                >
                  <BarChart3 size={12} /> State of Market
                </button>
                <button 
                  onClick={() => setAppState(AppState.INVESTOR_PITCH)}
                  className="hover:text-gray-400 transition-colors flex items-center gap-1"
                >
                  <BarChart3 size={12} /> Investor Deck
                </button>
              </div>
          </div>
      </footer>
    </div>
  );
};