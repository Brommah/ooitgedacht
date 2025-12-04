import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

interface AnimatedIconProps {
  size?: number;
  color?: string;
  className?: string;
}

/**
 * Shield with animated checkmark - "Veilig & Transparant"
 */
export const ShieldCheckIcon: React.FC<AnimatedIconProps> = ({ 
  size = 48, 
  color = '#60a5fa',
  className = '' 
}) => {
  const shieldRef = useRef<SVGPathElement>(null);
  const checkRef = useRef<SVGPathElement>(null);
  const glowRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    if (!shieldRef.current || !checkRef.current || !glowRef.current) return;

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 3 });

    // Shield pulse
    tl.to(shieldRef.current, {
      scale: 1.05,
      duration: 0.3,
      ease: 'power2.out',
      transformOrigin: 'center center',
    })
    .to(shieldRef.current, {
      scale: 1,
      duration: 0.3,
      ease: 'power2.in',
    })
    // Check draw animation
    .fromTo(checkRef.current, 
      { strokeDashoffset: 30 },
      { strokeDashoffset: 0, duration: 0.4, ease: 'power2.out' },
      '-=0.2'
    )
    // Glow pulse
    .to(glowRef.current, {
      opacity: 0.6,
      scale: 1.5,
      duration: 0.3,
      ease: 'power2.out',
    })
    .to(glowRef.current, {
      opacity: 0,
      scale: 1,
      duration: 0.5,
      ease: 'power2.in',
    });

    return () => { tl.kill(); };
  }, []);

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 48 48" 
      fill="none" 
      className={className}
    >
      {/* Glow effect */}
      <circle 
        ref={glowRef}
        cx="24" 
        cy="24" 
        r="16" 
        fill={color}
        opacity="0"
      />
      {/* Shield */}
      <path
        ref={shieldRef}
        d="M24 4L6 12v12c0 11.1 7.7 21.5 18 24 10.3-2.5 18-12.9 18-24V12L24 4z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={`${color}15`}
      />
      {/* Checkmark */}
      <path
        ref={checkRef}
        d="M16 24l6 6 10-12"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        strokeDasharray="30"
        strokeDashoffset="0"
      />
    </svg>
  );
};

/**
 * Certificate/Stamp with animated seal - "Expert Gevalideerd"
 */
export const CertifiedStampIcon: React.FC<AnimatedIconProps> = ({ 
  size = 48, 
  color = '#60a5fa',
  className = '' 
}) => {
  const stampRef = useRef<SVGGElement>(null);
  const starRef = useRef<SVGPathElement>(null);
  const ribbonLeftRef = useRef<SVGPathElement>(null);
  const ribbonRightRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!stampRef.current || !starRef.current) return;

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 3 });

    // Stamp press animation
    tl.from(stampRef.current, {
      scale: 1.3,
      opacity: 0,
      duration: 0.4,
      ease: 'back.out(2)',
      transformOrigin: 'center center',
    })
    // Star rotate and glow
    .to(starRef.current, {
      rotation: 360,
      duration: 0.6,
      ease: 'power2.out',
      transformOrigin: 'center center',
    })
    // Ribbons wave
    .to([ribbonLeftRef.current, ribbonRightRef.current], {
      y: 2,
      duration: 0.3,
      ease: 'power1.inOut',
      stagger: 0.1,
      yoyo: true,
      repeat: 2,
    }, '-=0.3');

    return () => { tl.kill(); };
  }, []);

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 48 48" 
      fill="none" 
      className={className}
    >
      <g ref={stampRef}>
        {/* Outer badge circle */}
        <circle 
          cx="24" 
          cy="20" 
          r="14" 
          stroke={color}
          strokeWidth="2"
          fill={`${color}15`}
        />
        {/* Inner decorative circle */}
        <circle 
          cx="24" 
          cy="20" 
          r="10" 
          stroke={color}
          strokeWidth="1"
          strokeDasharray="3 2"
          fill="none"
        />
        {/* Star/checkmark in center */}
        <path
          ref={starRef}
          d="M24 12l2.5 5 5.5.8-4 3.9.9 5.3-4.9-2.6-4.9 2.6.9-5.3-4-3.9 5.5-.8z"
          fill={color}
          stroke={color}
          strokeWidth="1"
        />
      </g>
      {/* Ribbon left */}
      <path
        ref={ribbonLeftRef}
        d="M14 32l-4 10 6-3 2 4 2-11"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={`${color}30`}
      />
      {/* Ribbon right */}
      <path
        ref={ribbonRightRef}
        d="M34 32l4 10-6-3-2 4-2-11"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={`${color}30`}
      />
    </svg>
  );
};

/**
 * Live data pulse/chart - "Actuele Data"
 */
export const LiveDataIcon: React.FC<AnimatedIconProps> = ({ 
  size = 48, 
  color = '#60a5fa',
  className = '' 
}) => {
  const line1Ref = useRef<SVGPathElement>(null);
  const line2Ref = useRef<SVGPathElement>(null);
  const pulseRef = useRef<SVGCircleElement>(null);
  const barsRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (!line1Ref.current || !pulseRef.current || !barsRef.current) return;

    // Continuous pulse animation
    gsap.to(pulseRef.current, {
      scale: 1.5,
      opacity: 0,
      duration: 1,
      repeat: -1,
      ease: 'power2.out',
      transformOrigin: 'center center',
    });

    // Line drawing animation
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });
    
    tl.fromTo(line1Ref.current,
      { strokeDashoffset: 60 },
      { strokeDashoffset: 0, duration: 1, ease: 'power2.out' }
    )
    .fromTo(line2Ref.current,
      { strokeDashoffset: 40 },
      { strokeDashoffset: 0, duration: 0.8, ease: 'power2.out' },
      '-=0.5'
    );

    // Bars animation
    const bars = barsRef.current.children;
    gsap.to(bars, {
      scaleY: 1.2,
      duration: 0.4,
      stagger: {
        each: 0.1,
        repeat: -1,
        yoyo: true,
      },
      ease: 'power1.inOut',
      transformOrigin: 'bottom center',
    });

    return () => { tl.kill(); };
  }, []);

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 48 48" 
      fill="none" 
      className={className}
    >
      {/* Background grid */}
      <path
        d="M8 38h32M8 30h32M8 22h32"
        stroke={`${color}30`}
        strokeWidth="1"
        strokeDasharray="2 4"
      />
      
      {/* Data bars */}
      <g ref={barsRef}>
        <rect x="10" y="28" width="4" height="10" rx="1" fill={`${color}40`} />
        <rect x="18" y="22" width="4" height="16" rx="1" fill={`${color}50`} />
        <rect x="26" y="18" width="4" height="20" rx="1" fill={`${color}60`} />
        <rect x="34" y="14" width="4" height="24" rx="1" fill={color} />
      </g>
      
      {/* Trend line */}
      <path
        ref={line1Ref}
        d="M12 26 L20 20 L28 16 L36 10"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        strokeDasharray="60"
        strokeDashoffset="0"
      />
      
      {/* Live pulse dot */}
      <circle 
        cx="36" 
        cy="10" 
        r="3" 
        fill={color}
      />
      <circle 
        ref={pulseRef}
        cx="36" 
        cy="10" 
        r="3" 
        fill={color}
        opacity="0.6"
      />
    </svg>
  );
};

/**
 * Document with official stamp - "Vergunningsklaar"
 */
export const PermitReadyIcon: React.FC<AnimatedIconProps> = ({ 
  size = 48, 
  color = '#60a5fa',
  className = '' 
}) => {
  const docRef = useRef<SVGGElement>(null);
  const stampRef = useRef<SVGGElement>(null);
  const linesRef = useRef<SVGGElement>(null);
  const checkRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!docRef.current || !stampRef.current || !checkRef.current) return;

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 3 });

    // Document slide in
    tl.from(docRef.current, {
      x: -10,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.out',
    })
    // Lines write in
    .from(linesRef.current?.children || [], {
      scaleX: 0,
      duration: 0.3,
      stagger: 0.1,
      ease: 'power2.out',
      transformOrigin: 'left center',
    })
    // Stamp slam down
    .from(stampRef.current, {
      scale: 2,
      opacity: 0,
      rotation: -30,
      duration: 0.3,
      ease: 'back.out(2)',
      transformOrigin: 'center center',
    })
    // Checkmark draw
    .fromTo(checkRef.current,
      { strokeDashoffset: 20 },
      { strokeDashoffset: 0, duration: 0.3, ease: 'power2.out' }
    );

    return () => { tl.kill(); };
  }, []);

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 48 48" 
      fill="none" 
      className={className}
    >
      <g ref={docRef}>
        {/* Document */}
        <path
          d="M10 6h20l8 8v28a2 2 0 01-2 2H12a2 2 0 01-2-2V8a2 2 0 012-2z"
          stroke={color}
          strokeWidth="2"
          fill={`${color}10`}
        />
        {/* Folded corner */}
        <path
          d="M30 6v8h8"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={`${color}20`}
        />
        
        {/* Text lines */}
        <g ref={linesRef}>
          <rect x="14" y="18" width="16" height="2" rx="1" fill={`${color}40`} />
          <rect x="14" y="24" width="12" height="2" rx="1" fill={`${color}40`} />
          <rect x="14" y="30" width="14" height="2" rx="1" fill={`${color}40`} />
        </g>
      </g>
      
      {/* Approval stamp */}
      <g ref={stampRef}>
        <circle 
          cx="32" 
          cy="34" 
          r="8" 
          stroke={color}
          strokeWidth="2"
          fill={`${color}20`}
        />
        <circle 
          cx="32" 
          cy="34" 
          r="5" 
          stroke={color}
          strokeWidth="1"
          fill="none"
        />
        {/* Checkmark in stamp */}
        <path
          ref={checkRef}
          d="M28 34l3 3 5-6"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          strokeDasharray="20"
          strokeDashoffset="0"
        />
      </g>
    </svg>
  );
};

/**
 * Combined export for all trust indicator icons
 */
export const TrustIndicatorIcon: React.FC<{
  type: 'shield' | 'certified' | 'livedata' | 'permit';
  size?: number;
  color?: string;
  className?: string;
}> = ({ type, ...props }) => {
  switch (type) {
    case 'shield':
      return <ShieldCheckIcon {...props} />;
    case 'certified':
      return <CertifiedStampIcon {...props} />;
    case 'livedata':
      return <LiveDataIcon {...props} />;
    case 'permit':
      return <PermitReadyIcon {...props} />;
    default:
      return <ShieldCheckIcon {...props} />;
  }
};





