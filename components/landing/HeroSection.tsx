import React from 'react';
import { AppState } from '../../types';
import { useTranslation } from '../../i18n';
import { HeroContent } from './HeroContent';
import { BROERSMA_LOGO } from './constants';

interface HeroSectionProps {
  setAppState: (state: AppState) => void;
}

/**
 * Main hero section with background image and content
 */
export const HeroSection: React.FC<HeroSectionProps> = ({ setAppState }) => {
  const { t } = useTranslation();
  
  return (
    <div className="relative h-screen flex flex-col">
      {/* Background Image - Full bleed */}
      <div className="absolute inset-0 overflow-hidden">
        <img 
          src="/generated/hero-fietspad.jpeg" 
          alt="Modern Dutch house with windmill along bike path at sunset" 
          className="w-full h-full object-cover"
          style={{ objectPosition: '50% 50%' }}
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
          <span className="text-[11px] uppercase tracking-[0.2em] text-white/40 font-medium">{t('hero.inCollaborationWith')}</span>
          <div className="w-px h-4 bg-white/20" />
          <a href="https://www.bureau-broersma.nl" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 hover:opacity-100 transition-opacity">
            <img src={BROERSMA_LOGO} alt="Bureau Broersma" className="h-7 md:h-8 brightness-0 invert opacity-60 group-hover:opacity-90 transition-opacity" />
          </a>
        </div>
      </div>
    </div>
  );
};




