import React from 'react';
import { ArrowRight, BarChart3 } from 'lucide-react';
import { AppState } from '../../types';
import { useTranslation } from '../../i18n';
import { BROERSMA_LOGO, subtleGridPattern } from './constants';

interface FooterProps {
  setAppState: (state: AppState) => void;
}

/**
 * Footer component
 */
export const Footer: React.FC<FooterProps> = ({ setAppState }) => {
  const { t } = useTranslation();

  return (
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
            {t('hero.togetherBuilding')}
          </p>
          <a 
            href="https://www.bureau-broersma.nl" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 group"
          >
            <span className="text-[10px] uppercase tracking-widest text-gray-600 group-hover:text-gray-400 transition-colors">{t('hero.withSupportFrom')}</span>
            <img src={BROERSMA_LOGO} alt="Bureau Broersma" className="h-5 md:h-6 brightness-0 invert opacity-60 group-hover:opacity-80 transition-opacity" />
          </a>
        </div>
        
        <div className="grid grid-cols-2 gap-8 md:gap-12">
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500">{t('hero.platform')}</h4>
            <ul className="space-y-3 text-sm text-gray-400 font-light">
              <li>
                <button 
                  onClick={() => setAppState(AppState.DASHBOARD)}
                  className="hover:text-white transition-colors"
                >
                  {t('nav.overview')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setAppState(AppState.STATE_OF_MARKET)}
                  className="hover:text-white transition-colors"
                >
                  {t('hero.marketAnalysis')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setAppState(AppState.WIZARD_STEP_TYPE)}
                  className="hover:text-white transition-colors"
                >
                  {t('hero.startDesign')}
                </button>
              </li>
              <li>
                <a href="mailto:gemeenten@ooitgedacht.nl" className="hover:text-white transition-colors">
                  {t('hero.forMunicipalities')}
                </a>
              </li>
              <li>
                <button 
                  onClick={() => setAppState(AppState.B2B_BUILDERS)}
                  className="hover:text-white transition-colors text-amber-400 hover:text-amber-300"
                >
                  {t('nav.forBuilders')}
                </button>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500">{t('hero.legal')}</h4>
            <ul className="space-y-3 text-sm text-gray-400 font-light">
              <li><a href="#" className="hover:text-white transition-colors">{t('hero.termsAndConditions')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('hero.privacyStatement')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('hero.disclaimer')}</a></li>
            </ul>
          </div>
        </div>

        <div className="w-full md:w-auto">
          <button 
            onClick={() => setAppState(AppState.WIZARD_STEP_TYPE)}
            className="w-full md:w-auto bg-white text-[#0a1628] px-6 md:px-8 py-3 md:py-4 font-bold text-sm hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
          >
            {t('hero.startProject')} <ArrowRight size={16} />
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
            <BarChart3 size={12} /> {t('hero.stateOfMarket')}
          </button>
          <button 
            onClick={() => setAppState(AppState.INVESTOR_PITCH)}
            className="hover:text-gray-400 transition-colors flex items-center gap-1"
          >
            <BarChart3 size={12} /> {t('hero.investorDeck')}
          </button>
        </div>
      </div>
    </footer>
  );
};




