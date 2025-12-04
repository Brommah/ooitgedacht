import React from 'react';
import { AppState } from '../../types';
import { useTranslation } from '../../i18n';
import { PrimaryButton } from '../PrimaryButton';
import { AnimatedSection } from './animations/AnimatedSection';

interface ResultShowcaseProps {
  setAppState: (state: AppState) => void;
}

/**
 * Result showcase section - "Dit is wat je krijgt"
 */
export const ResultShowcase: React.FC<ResultShowcaseProps> = ({ setAppState }) => {
  const { t } = useTranslation();

  return (
    <div id="result-showcase" className="bg-[#0a1628] py-20 md:py-28 relative overflow-hidden">
      {/* Subtle background image */}
      <div className="absolute inset-0">
        <img src="/generated/coastal-modern-blueprint.png" alt="" className="w-full h-full object-cover opacity-[0.04]" />
      </div>
      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        
        {/* Header */}
        <AnimatedSection className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-semibold text-white tracking-[-0.02em] mb-4">
            {t('hero.whatYouGet')}
          </h2>
          <p className="text-white/50 font-light max-w-xl mx-auto text-base md:text-lg">
            {t('hero.whatYouGetSubtitle')}
          </p>
        </AnimatedSection>

        {/* Clean Image Display */}
        <AnimatedSection delay={100} className="mb-12 md:mb-16">
          <div className="rounded-2xl overflow-hidden">
            <img 
              src="/generated/result-showcase.png" 
              alt={t('hero.whatYouGet')}
              className="w-full h-auto"
              loading="lazy"
            />
          </div>
        </AnimatedSection>

        {/* Simple CTA */}
        <AnimatedSection delay={200} className="text-center flex flex-col items-center">
          <PrimaryButton 
            onClick={() => setAppState(AppState.WIZARD_STEP_TYPE)}
            size="lg"
          >
            {t('hero.startYourDesign')}
          </PrimaryButton>
          <p className="text-white/40 text-sm mt-4">
            {t('hero.free3MinNoAccount')}
          </p>
        </AnimatedSection>
      </div>
    </div>
  );
};




