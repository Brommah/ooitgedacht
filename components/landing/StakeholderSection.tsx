import React from 'react';
import { Users, CheckCircle2, Lock } from 'lucide-react';
import { AppState } from '../../types';
import { useTranslation } from '../../i18n';
import { PrimaryButton } from '../PrimaryButton';
import { AnimatedSection } from './animations/AnimatedSection';

interface StakeholderSectionProps {
  setAppState: (state: AppState) => void;
}

/**
 * Stakeholder collaboration section
 */
export const StakeholderSection: React.FC<StakeholderSectionProps> = ({ setAppState }) => {
  const { t } = useTranslation();

  const stakeholders = [
    {
      icon: (
        <svg className="w-7 h-7 text-[#5b8ac7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      ),
      iconBg: 'bg-[#1e3a5f]/20',
      title: t('hero.buildOwner'),
      description: t('hero.buildOwnerDesc'),
      features: [t('hero.realtimeCost'), t('hero.directDecision'), t('hero.completeDoc')],
      checkColor: 'text-[#5b8ac7]',
      delay: 100,
    },
    {
      icon: (
        <svg className="w-7 h-7 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
        </svg>
      ),
      iconBg: 'bg-cyan-500/20',
      title: t('hero.architectTitle'),
      description: t('hero.architectDescText'),
      features: [t('hero.directFeasibility'), t('hero.sharedDesign'), t('hero.versionControl')],
      checkColor: 'text-cyan-400',
      delay: 200,
    },
    {
      icon: (
        <svg className="w-7 h-7 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
        </svg>
      ),
      iconBg: 'bg-amber-500/20',
      title: t('hero.structEngineer'),
      description: t('hero.structEngineerDesc'),
      features: [t('hero.standardInput'), t('hero.digitalSig'), t('hero.liabilityTrack')],
      checkColor: 'text-amber-400',
      delay: 300,
    },
    {
      icon: (
        <svg className="w-7 h-7 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
        </svg>
      ),
      iconBg: 'bg-purple-500/20',
      title: t('hero.municipalityTitle'),
      description: t('hero.municipalityDescText'),
      features: [t('hero.prevalidatedDoss'), t('hero.zoningCheck'), t('hero.fewerObj')],
      checkColor: 'text-purple-400',
      delay: 400,
    },
  ];

  return (
    <div className="text-white py-24 md:py-32 px-6 relative overflow-hidden bg-[#0a1628]">
      {/* Tinted background image */}
      <div className="absolute inset-0">
        <img 
          src="/generated/thatched-systems.png" 
          alt="" 
          className="w-full h-full object-cover opacity-[0.1]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628]/50 via-transparent to-[#0a1628]/50" />
      </div>
      <div className="max-w-6xl mx-auto relative z-10">
        <AnimatedSection className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-6">
            <Users size={14} /> {t('hero.forEveryoneProcess')}
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.05] mb-6 tracking-[-0.02em]">
            {t('hero.unprecedentedCollab')}<br/>
            <span className="text-blue-400">{t('hero.fullTransp')}</span>
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto font-light">
            {t('hero.onePlatformDesc')}
          </p>
        </AnimatedSection>

        {/* Stakeholder Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stakeholders.map((stakeholder) => (
            <AnimatedSection key={stakeholder.title} delay={stakeholder.delay} className="group">
              <div className="bg-white/5 border border-white/10 p-6 md:p-8 h-full hover:bg-white/10 transition-colors">
                <div className={`w-14 h-14 ${stakeholder.iconBg} rounded-full flex items-center justify-center mb-6`}>
                  {stakeholder.icon}
                </div>
                <h3 className="text-xl font-medium mb-3 tracking-[-0.01em]">{stakeholder.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed mb-4">
                  {stakeholder.description}
                </p>
                <ul className="space-y-2 text-sm text-white/70">
                  {stakeholder.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <CheckCircle2 size={14} className={`${stakeholder.checkColor} flex-shrink-0`} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Auditability highlight */}
        <AnimatedSection delay={500} className="mt-16 md:mt-20">
          <div className="bg-blue-500/5 border border-blue-500/20 p-8 md:p-12 rounded-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-2 text-blue-400 text-sm font-bold uppercase tracking-wider mb-4">
                  <Lock size={16} />
                  {t('hero.fullAudit')}
                </div>
                <h3 className="text-2xl md:text-3xl font-medium mb-4 tracking-[-0.01em]">{t('hero.everyDecisionEveryChange')}</h3>
                <p className="text-white/60 leading-relaxed mb-6">
                  {t('hero.auditDesc')}
                </p>
                <PrimaryButton 
                  onClick={() => setAppState(AppState.WIZARD_STEP_TYPE)}
                  size="md"
                >
                  {t('hero.startDesignNow')}
                </PrimaryButton>
              </div>
              <div className="font-mono text-xs space-y-2 bg-[#06101f]/50 p-6 rounded-lg border border-[#1e3a5f]/30">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-[#5b8ac7] rounded-full" />
                  <span className="text-white/40">2024-11-15 14:32:07</span>
                  <span className="text-white/80">{t('hero.designGeneratedLog')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-[#5b8ac7] rounded-full" />
                  <span className="text-white/40">2024-11-15 14:33:45</span>
                  <span className="text-white/80">{t('hero.constructionValidatedLog2')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-[#5b8ac7] rounded-full" />
                  <span className="text-white/40">2024-11-16 09:12:33</span>
                  <span className="text-white/80">{t('hero.ownerApprovedLog')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                  <span className="text-white/40">{t('hero.nowLabel')}</span>
                  <span className="text-cyan-400">{t('hero.waitingMunicipality')}</span>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};




