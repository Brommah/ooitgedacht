import React, { useRef } from 'react';
import { AppState } from '../../types';
import { PrimaryButton, TextButton } from '../PrimaryButton';
import { useTranslation } from '../../i18n';
import { AnimatedSparkle } from './animations/AnimatedSparkle';

interface HeroContentProps {
  setAppState: (state: AppState) => void;
}

/**
 * Hero content component with animated headline and CTAs
 */
export const HeroContent: React.FC<HeroContentProps> = ({ setAppState }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  return (
    <div ref={containerRef} className="relative z-10 flex-1 flex flex-col justify-center max-w-[1400px] mx-auto px-5 md:px-12 w-full pt-24 md:pt-0">
      
      <div className="max-w-2xl">
        {/* Main Headline - The Story */}
        <h1 className="text-[2rem] sm:text-4xl md:text-5xl lg:text-[3.5rem] xl:text-6xl font-medium text-white leading-[1.08] tracking-[-0.02em] mb-5 md:mb-6 mt-8 md:mt-12">
          {/* Line 1: Brand name */}
          <span className="block overflow-hidden">
            <span className="relative inline-block font-semibold">
              {t('hero.heroLine1')}
            </span>
          </span>
          
          {/* Line 2: Building narrative */}
          <span className="block font-light text-white/90 mt-1">
            {t('hero.heroLine2')}
          </span>
          
          {/* Line 3: The magical payoff */}
          <span className="block mt-1">
            <span className="relative inline-block whitespace-nowrap">
              <span className="font-semibold bg-gradient-to-r from-[#60a5fa] via-[#3b82f6] to-[#2563eb] bg-clip-text text-transparent">
                {t('hero.heroLine3')}
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
            {t('hero.heroTagline1')}
          </p>
          <p className="font-semibold text-white/90">
            {t('hero.heroTagline2')} <span className="bg-gradient-to-r from-[#60a5fa] to-[#3b82f6] bg-clip-text text-transparent">{t('hero.heroTagline3')}</span>
          </p>
        </div>

        {/* CTAs - The Invitation */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
          {/* Primary CTA - Prominent */}
          <PrimaryButton 
            onClick={() => setAppState(AppState.WIZARD_STEP_TYPE)}
            size="lg"
          >
            {t('hero.discoverPossibilities')}
          </PrimaryButton>
          
          {/* Secondary CTA - Subtle */}
          <TextButton 
            onClick={() => {
              const element = document.getElementById('how-it-works');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {t('hero.howItWorksLink')}
          </TextButton>
        </div>
      </div>
    </div>
  );
};

