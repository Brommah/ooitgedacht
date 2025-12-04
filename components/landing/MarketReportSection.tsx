import React from 'react';
import { BarChart3 } from 'lucide-react';
import { AppState } from '../../types';
import { useTranslation } from '../../i18n';
import { PrimaryButton } from '../PrimaryButton';
import { AnimatedSection } from './animations/AnimatedSection';

interface MarketReportSectionProps {
  setAppState: (state: AppState) => void;
}

/**
 * Market report section
 */
export const MarketReportSection: React.FC<MarketReportSectionProps> = ({ setAppState }) => {
  const { t, language } = useTranslation();

  return (
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
                alt={t('hero.marketReport')}
                className="w-full transition-transform duration-500 group-hover:scale-[1.02]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-xs text-white/70 font-medium">{t('hero.liveData2')}</span>
                </div>
              </div>
            </div>
          </AnimatedSection>
          
          {/* Content */}
          <AnimatedSection delay={100}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full mb-6">
              <BarChart3 size={14} className="text-red-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-red-400">{t('hero.marketReport')}</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white leading-[1.1] tracking-[-0.02em] mb-6">
              {t('hero.theDutchWord')}<br />
              <span className="text-red-400">{t('hero.housingMarketWord')}</span>
            </h2>
            
            <div className="space-y-4 mb-8">
              <p className="text-lg text-white/60 leading-relaxed">
                <span className="text-red-400 font-bold">401.000</span> {t('hero.housingShortageNum')} 
                <span className="text-red-400 font-bold"> €5 {language === 'en' ? 'billion' : 'miljard'}</span> {t('hero.failureCostsNum')} 
                <span className="text-red-400 font-bold"> 77%</span> {t('hero.projectsOverBudgetNum')}
              </p>
              <p className="text-white/50">
                {t('hero.whatMeansForPlans')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <PrimaryButton 
                onClick={() => setAppState(AppState.STATE_OF_MARKET)}
                size="lg"
              >
                {t('hero.viewFullAnalysis2')}
              </PrimaryButton>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
};




