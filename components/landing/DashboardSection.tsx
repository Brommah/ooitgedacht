import React from 'react';
import { LayoutDashboard, CheckCircle2 } from 'lucide-react';
import { AppState } from '../../types';
import { useTranslation } from '../../i18n';
import { PrimaryButton } from '../PrimaryButton';
import { AnimatedSection } from './animations/AnimatedSection';

interface DashboardSectionProps {
  setAppState: (state: AppState) => void;
}

/**
 * Dashboard preview section - separate from the workflow preview
 */
export const DashboardSection: React.FC<DashboardSectionProps> = ({ setAppState }) => {
  const { t } = useTranslation();

  return (
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
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">{t('hero.buildControlSys')}</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white leading-[1.1] tracking-[-0.02em] mb-6">
              {t('hero.followProject')}<br />
              <span className="text-emerald-400">{t('hero.inRealtimeWord')}</span>
            </h2>
            
            <div className="space-y-4 mb-8">
              <p className="text-lg text-white/60 leading-relaxed">
                {t('hero.dashboardDescText')}
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-white/50">
                  <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />
                  <span>{t('hero.allPhaseMilestones')}</span>
                </li>
                <li className="flex items-center gap-3 text-white/50">
                  <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />
                  <span>{t('hero.passportEnergyCert')}</span>
                </li>
                <li className="flex items-center gap-3 text-white/50">
                  <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />
                  <span>{t('hero.chatContractorInspector')}</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <PrimaryButton 
                onClick={() => setAppState(AppState.DASHBOARD)}
                variant="secondary"
                size="lg"
              >
                {t('hero.viewDemoBoard')}
              </PrimaryButton>
            </div>
          </AnimatedSection>
          
          {/* Image */}
          <AnimatedSection delay={100} className="relative">
            <div className="relative rounded-2xl overflow-hidden border border-emerald-500/20 shadow-2xl shadow-emerald-500/10 group">
              <img 
                src="/generated/dashboard-preview.png" 
                alt={t('hero.viewDemoBoard')}
                className="w-full transition-transform duration-500 group-hover:scale-[1.02]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-xs text-white/70 font-medium">{t('hero.liveDemoLabel')}</span>
                </div>
                <span className="px-2 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                  {t('hero.constructionOkLabel')}
                </span>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
};




