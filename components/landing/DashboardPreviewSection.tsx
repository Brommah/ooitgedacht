import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { AppState } from '../../types';
import { useTranslation } from '../../i18n';
import { PrimaryButton } from '../PrimaryButton';
import { AnimatedSection } from './animations/AnimatedSection';
import { BROERSMA_LOGO, subtleGridPattern } from './constants';

interface DashboardPreviewSectionProps {
  setAppState: (state: AppState) => void;
}

/**
 * Animated house grid for dashboard visualization
 */
const AnimatedHouseGrid: React.FC<{ rows?: number; cols?: number }> = ({ rows = 4, cols = 8 }) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const housesRef = useRef<HTMLDivElement[]>([]);
  const total = rows * cols;
  const filledCount = Math.floor(total * 0.35); // 35% complete

  useGSAP(() => {
    if (!gridRef.current || housesRef.current.length === 0) return;

    // Staggered reveal animation
    gsap.from(housesRef.current, {
      scale: 0,
      opacity: 0,
      duration: 0.3,
      stagger: {
        each: 0.02,
        from: 'start',
      },
      ease: 'back.out(2)',
      scrollTrigger: {
        trigger: gridRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });

    // Pulse animation for active houses
    gsap.to(housesRef.current.slice(0, filledCount), {
      scale: 1.1,
      duration: 0.8,
      stagger: {
        each: 0.05,
        repeat: -1,
        yoyo: true,
      },
      ease: 'sine.inOut',
      delay: 1,
    });
  }, { scope: gridRef });

  return (
    <div ref={gridRef} className="flex flex-wrap gap-1 justify-center max-w-[200px]">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          ref={(el) => { if (el) housesRef.current[i] = el; }}
          className={`w-4 h-4 rounded-sm transition-colors duration-300 ${
            i < filledCount
              ? 'bg-blue-400 shadow-sm shadow-blue-400/50'
              : 'bg-blue-500/20'
          }`}
        />
      ))}
    </div>
  );
};

/**
 * Dashboard preview section - "Jouw Bouwsysteem"
 */
export const DashboardPreviewSection: React.FC<DashboardPreviewSectionProps> = ({ setAppState }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement[]>([]);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  useGSAP(() => {
    if (!sectionRef.current || stepsRef.current.length === 0) return;

    // Animate progress line
    if (progressLineRef.current) {
      gsap.fromTo(progressLineRef.current,
        { scaleY: 0, transformOrigin: 'top' },
        {
          scaleY: 1,
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: timelineRef.current,
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
        }
      );
    }

    // Staggered step reveal
    gsap.from(stepsRef.current, {
      x: -30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: timelineRef.current,
        start: 'top 70%',
        toggleActions: 'play none none none',
      },
    });
  }, { scope: sectionRef });

  const workflowSteps = [
    { title: t('hero.groundResearch'), subtitle: t('hero.groundResearchSub'), status: 'done' },
    { title: t('hero.reinforcementInspection'), subtitle: t('hero.reinforcementInspectionSub'), status: 'done' },
    { title: t('hero.pourFoundation'), subtitle: t('hero.pourFoundationSub'), status: 'active' },
    { title: t('hero.shellConstruction2'), subtitle: t('hero.shellConstructionSub'), status: 'locked' },
  ];

  return (
    <div ref={sectionRef} className="bg-[#0c1a2e] py-24 md:py-32 px-6 relative overflow-hidden">
      {/* Tinted background image */}
      <div className="absolute inset-0">
        <img 
          src="/generated/polder-dak-gevel.png" 
          alt="" 
          className="w-full h-full object-cover opacity-[0.04]"
          loading="lazy"
        />
      </div>
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 opacity-50" style={subtleGridPattern} />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <AnimatedSection className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-semibold leading-tight mb-4 text-white tracking-[-0.02em]">
            {t('hero.yourBuildSystem')}
          </h2>
          <div className="text-base md:text-lg text-blue-200/60 font-light leading-relaxed max-w-2xl mx-auto">
            <p>{t('hero.followEveryPhase')}</p>
            <p>{t('hero.transparentValidated')}</p>
          </div>
        </AnimatedSection>
        
        {/* Dashboard Preview Card */}
        <AnimatedSection delay={100} className="bg-blue-500/10 backdrop-blur-sm border border-blue-500/20 rounded-2xl overflow-hidden max-w-3xl mx-auto">
          {/* Mini header with house grid visualization */}
          <div className="text-white px-6 py-4 flex justify-between items-center bg-blue-500/10 border-b border-blue-500/20">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-sm font-medium text-blue-100">{t('hero.projectName')}</span>
            </div>
            <div className="flex items-center gap-4">
              <AnimatedHouseGrid rows={2} cols={6} />
              <div className="text-xs text-blue-300/60 font-mono">35% {t('hero.completed')}</div>
            </div>
          </div>
          
          {/* Workflow Timeline Preview */}
          <div ref={timelineRef} className="p-8 space-y-0 relative">
            {/* Animated progress line */}
            <div className="absolute left-[35px] top-8 bottom-8 w-[1px] bg-blue-500/20" />
            <div 
              ref={progressLineRef}
              className="absolute left-[35px] top-8 w-[2px] bg-gradient-to-b from-blue-400 via-blue-500 to-blue-400/0"
              style={{ height: '65%', scaleY: 0 }}
            />
            
            {workflowSteps.map((step, index) => (
              <div 
                key={step.title}
                ref={(el) => { if (el) stepsRef.current[index] = el; }}
                className="flex gap-4 items-start py-4 relative z-10"
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  step.status === 'done' 
                    ? 'border-blue-400 bg-blue-400' 
                    : step.status === 'active'
                    ? 'border-blue-400 bg-blue-500/20'
                    : 'border-blue-500/30 bg-blue-500/5'
                }`}>
                  {step.status === 'done' && <CheckCircle2 size={12} className="text-[#0a1628]" />}
                  {step.status === 'active' && <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />}
                </div>
                <div>
                  <div className={`text-sm font-medium ${
                    step.status === 'locked' ? 'text-blue-400/40' : 'text-blue-100'
                  }`}>{step.title}</div>
                  <div className={`text-xs mt-1 font-light ${
                    step.status === 'locked' ? 'text-blue-400/30' : 'text-blue-300/50'
                  }`}>{step.subtitle}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom action bar */}
          <div className="bg-blue-500/5 px-6 py-4 border-t border-blue-500/20 flex justify-between items-center">
            <div className="text-xs text-blue-300/50">{t('hero.lastUpdate')}: {t('hero.today')}, 09:41</div>
            <button 
              onClick={() => setAppState(AppState.DASHBOARD)}
              className="group flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
            >
              {t('hero.openOverview')} <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </AnimatedSection>
        
        {/* Powered by Broersma + CTA */}
        <AnimatedSection delay={200} className="flex flex-col items-center justify-center mt-12 md:mt-16 gap-6">
          <div className="flex flex-col items-center gap-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-300/50">{t('hero.withSupportOf')}</span>
            <a 
              href="https://www.bureau-broersma.nl" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group px-6 md:px-8 py-3 md:py-4 bg-blue-500/10 border border-blue-500/20 hover:border-blue-400/40 transition-all rounded-xl"
            >
              <img 
                src={BROERSMA_LOGO} 
                alt="Bureau Broersma" 
                className="h-8 md:h-10 brightness-0 invert opacity-60 group-hover:opacity-90 transition-opacity"
              />
            </a>
          </div>
          <PrimaryButton 
            onClick={() => setAppState(AppState.WIZARD_STEP_TYPE)}
            size="lg"
          >
            {t('hero.startDreamHomeDesign')}
          </PrimaryButton>
        </AnimatedSection>
      </div>
    </div>
  );
};




