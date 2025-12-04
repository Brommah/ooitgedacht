import React, { useRef } from 'react';
import { AppState } from '../../types';
import { useTranslation } from '../../i18n';
import { PrimaryButton } from '../PrimaryButton';
import { AnimatedSection } from './animations/AnimatedSection';
import { TimelineStep } from './shared/TimelineStep';

interface HowItWorksSectionProps {
  setAppState: (state: AppState) => void;
}

/**
 * How it works section with timeline steps
 */
export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ setAppState }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const steps = [
    {
      number: '01',
      title: t('hero.vibeStyle'),
      description: t('hero.vibeStyleDesc'),
      image: '/generated/steps/step-01-vibe-stijl.jpg',
      onClick: () => setAppState(AppState.WIZARD_STEP_TYPE),
    },
    {
      number: '02',
      title: t('hero.plotCheck'),
      description: t('hero.plotCheckDesc'),
      image: '/generated/steps/step-02-kavel-check.jpg',
      onClick: () => setAppState(AppState.WIZARD_STEP_TYPE),
    },
    {
      number: '03',
      title: t('hero.thePassport'),
      description: t('hero.thePassportDesc'),
      image: '/generated/steps/step-03-paspoort.jpg',
      onClick: () => {
        const passportSection = document.getElementById('passport-section');
        passportSection?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      number: '04',
      title: t('hero.theBuildDashboard'),
      description: t('hero.theBuildDashboardDesc'),
      image: '/generated/steps/step-04-bouw-os.jpg',
      onClick: () => setAppState(AppState.WIZARD_STEP_TYPE),
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
            <div>
              <span className="inline-block text-[10px] md:text-xs uppercase tracking-[0.3em] text-blue-400/70 font-medium mb-4 md:mb-5">
                {t('hero.theProcess')}
              </span>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-semibold mb-4 md:mb-6 text-white tracking-[-0.03em]">
                {t('hero.howItWorksTitle')}
              </h2>
              <p className="text-base md:text-lg text-blue-200/50 font-light max-w-xl mx-auto leading-relaxed">
                {t('hero.howItWorksSectionSubtitle')}
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
              onClick={() => setAppState(AppState.WIZARD_STEP_TYPE)}
              size="lg"
            >
              {t('hero.startTheProcess')}
            </PrimaryButton>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
};

