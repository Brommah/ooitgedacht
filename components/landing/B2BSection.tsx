import React from 'react';
import { ArrowRight, Hammer, CheckCircle2, Eye } from 'lucide-react';
import { AppState } from '../../types';
import { useTranslation } from '../../i18n';
import { AnimatedSection } from './animations/AnimatedSection';

interface B2BSectionProps {
  setAppState: (state: AppState) => void;
}

/**
 * B2B Section - For Builders
 */
export const B2BSection: React.FC<B2BSectionProps> = ({ setAppState }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-[#060a12] py-24 md:py-32 px-6 relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img 
          src="/generated/b2b/smart-glasses-on-site.jpg" 
          alt="" 
          className="w-full h-full object-cover opacity-[0.15]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060a12] via-[#060a12]/95 to-[#060a12]/80" />
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left content */}
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full text-xs font-bold uppercase tracking-[0.15em] mb-6 text-amber-400">
              <Hammer size={14} />
              {t('hero.forBuilders')}
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white leading-[1.1] tracking-[-0.02em] mb-6">
              {t('hero.doYouBuildHomes')}
              <br />
              <span className="text-white/40">{t('hero.weHandlePaperwork')}</span>
            </h2>
            
            <p className="text-lg text-white/60 leading-relaxed mb-8 max-w-lg">
              {t('hero.b2bDesc')}
              <strong className="text-white"> {t('hero.building')}</strong>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button 
                onClick={() => setAppState(AppState.B2B_BUILDERS)}
                className="group bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 font-semibold rounded-full shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all flex items-center justify-center gap-2"
              >
                {t('hero.discoverBouwborg')}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2 text-white/50">
                <CheckCircle2 size={16} className="text-amber-400" />
                {t('hero.lessAdmin')}
              </div>
              <div className="flex items-center gap-2 text-white/50">
                <CheckCircle2 size={16} className="text-amber-400" />
                {t('hero.wkbCompliant')}
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
                loading="lazy"
              />
              {/* Floating card */}
              <div className="absolute -bottom-6 -left-6 bg-[#0a1628] border border-amber-500/20 rounded-xl p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                    <Eye size={20} className="text-amber-400" />
                  </div>
                  <div>
                    <div className="text-xs text-white/50">{t('hero.automatic')}</div>
                    <div className="text-sm font-semibold text-white">{t('hero.wkbDocumentation')}</div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
};




