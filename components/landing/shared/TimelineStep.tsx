import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Hammer } from 'lucide-react';

interface TimelineStepProps {
  number: string;
  title: string;
  description: string;
  image: string;
  isLast?: boolean;
  onClick: () => void;
  delay?: number;
  hasOverlay?: boolean;
}

/**
 * Timeline step component with GSAP animations
 */
export const TimelineStep: React.FC<TimelineStepProps> = ({ 
  number, 
  title, 
  description, 
  image, 
  isLast, 
  onClick, 
  delay = 0, 
  hasOverlay 
}) => {
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




