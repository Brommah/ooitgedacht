import React, { useState } from 'react';
import { FileText, Shield, CheckCircle2, ChevronDown, Clock, ArrowRight } from 'lucide-react';
import { AppState } from '../../types';
import { useTranslation } from '../../i18n';
import { AnimatedSection } from './animations/AnimatedSection';
import { AnimatedStatCard } from './shared/AnimatedStatCard';
import { TrustIndicatorsSection } from './TrustIndicatorsSection';
import { BROERSMA_LOGO } from './constants';

interface PassportSectionProps {
  setAppState: (state: AppState) => void;
}

/**
 * Housing passport section with validation timeline
 */
export const PassportSection: React.FC<PassportSectionProps> = ({ setAppState }) => {
  const [passportExpanded, setPassportExpanded] = useState(false);
  const { t, language } = useTranslation();

  return (
    <div id="passport-section" className="bg-[#0a1628] py-24 md:py-32 px-6 border-b border-blue-500/10 relative overflow-hidden">
      {/* Tinted background image */}
      <div className="absolute inset-0">
        <img 
          src="/generated/blueprint-wood-house.png" 
          alt="" 
          className="w-full h-full object-cover opacity-[0.03]"
          loading="lazy"
        />
      </div>
      {/* Subtle background image */}
      <div className="absolute inset-0">
        <img src="/generated/blueprint-wood-house.png" alt="" className="w-full h-full object-cover opacity-[0.05]" loading="lazy" />
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <AnimatedSection className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-xs font-bold uppercase tracking-[0.2em] mb-6 text-blue-300">
            <Shield size={12} /> {t('hero.certificateOfAuthenticity')}
          </div>
          <h2 className="text-4xl md:text-6xl font-semibold leading-tight mb-6 text-white tracking-[-0.02em]">
            {t('hero.housingPassport')}
          </h2>
          <div className="text-lg md:text-xl text-blue-200/60 max-w-2xl mx-auto font-light">
            <p>{t('hero.passportSubtitle1')}</p>
            <p>{t('hero.passportSubtitle2')}</p>
          </div>
        </AnimatedSection>

        {/* Main Passport Document */}
        <AnimatedSection delay={100} className="max-w-5xl mx-auto">
          <div className="bg-[#0d1f3c] border border-blue-500/20 shadow-2xl shadow-blue-500/10 rounded-2xl relative overflow-hidden">
            
            {/* Security Pattern Watermark */}
            <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
              backgroundImage: `repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)`,
              backgroundSize: '10px 10px'
            }} />
            
            {/* Document Header - Always visible */}
            <div className="text-white px-6 md:px-10 py-6 md:py-8 bg-gradient-to-r from-[#0d1f3c] to-[#0a1628]">
              <div className="flex items-center gap-4 md:gap-6">
                <div className="w-14 h-14 md:w-16 md:h-16 border-2 border-white/20 flex items-center justify-center">
                  <FileText size={28} className="text-white" strokeWidth={1} />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-1">Ooit Gedacht × Bureau Broersma</div>
                  <div className="text-xl md:text-2xl font-medium tracking-[-0.01em]">Woningpaspoort</div>
                </div>
              </div>
            </div>
            
            {/* Stats Grid - Always visible */}
            <div className="px-6 md:px-10 py-6 md:py-8 border-t border-blue-500/10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <AnimatedStatCard 
                  value={485000} 
                  prefix="€" 
                  label={t('hero.totalBuildCost')} 
                  sublabel={t('hero.exclVatLand')}
                  delay={0}
                />
                <div>
                  <div className="text-[9px] uppercase tracking-[0.2em] text-blue-300/50 mb-1">{t('hero.energyLabel')}</div>
                  <div className="font-mono text-xl md:text-2xl font-medium text-blue-400">A++++</div>
                  <div className="text-[10px] text-blue-300/40 mt-0.5">BENG-proof</div>
                </div>
                <AnimatedStatCard 
                  value={8} 
                  suffix={language === 'en' ? ' mo' : ' mnd'} 
                  label={t('hero.buildTime')} 
                  sublabel={t('hero.fromBuildStart')}
                  delay={200}
                />
                <div>
                  <div className="text-[9px] uppercase tracking-[0.2em] text-blue-300/50 mb-1">{t('hero.mpgScore')}</div>
                  <div className="font-mono text-xl md:text-2xl font-medium text-white">0.48</div>
                  <div className="text-[10px] text-blue-300/40 mt-0.5">norm: &lt;0.8</div>
                </div>
              </div>
            </div>

            {/* Expand Button - Animated call to action */}
            <button 
              onClick={() => setPassportExpanded(!passportExpanded)}
              className="w-full px-6 md:px-10 py-4 border-t border-blue-500/10 bg-blue-500/5 hover:bg-blue-500/10 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-center gap-3">
                <span className="text-sm text-blue-300/70 group-hover:text-blue-300 transition-colors">
                  {passportExpanded ? t('hero.hideDetails') : t('hero.viewFullValidation')}
                </span>
                <div className={`w-6 h-6 rounded-full border border-blue-400/50 flex items-center justify-center transition-all duration-300 group-hover:border-blue-400 group-hover:bg-blue-400/20 ${passportExpanded ? 'rotate-180' : 'animate-bounce'}`}>
                  <ChevronDown size={14} className="text-blue-400" />
                </div>
              </div>
            </button>
            
            {/* Collapsible Content */}
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${passportExpanded ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'}`}>
              {/* Document Body - Detailed Info */}
              <div className="px-6 md:px-10 py-8 md:py-10 border-t border-blue-500/10">
                
                {/* Provenance Timeline */}
                <div className="mb-10">
                  <div className="flex items-center gap-2 mb-6">
                    <Clock size={14} className="text-blue-400/60" />
                    <span className="text-[10px] uppercase tracking-[0.2em] text-blue-300/50 font-medium">Validatie Timeline</span>
                  </div>

                  <div className="relative">
                    {/* Timeline Line */}
                    <div className="absolute left-[11px] top-3 bottom-3 w-px bg-gradient-to-b from-blue-400 via-blue-500/50 to-blue-500/20" />
                    
                    {/* Timeline Items */}
                    <div className="space-y-6">
                      {/* Step 1 */}
                      <div className="flex gap-4 md:gap-6">
                        <div className="relative">
                          <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center">
                            <CheckCircle2 size={14} className="text-[#0a1628]" />
                          </div>
                        </div>
                        <div className="flex-1 pb-6">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-4 mb-2">
                            <span className="font-medium text-white text-sm md:text-base">AI Ontwerp Gegenereerd</span>
                            <span className="font-mono text-[10px] md:text-xs text-blue-300/50">2024-11-15 • 14:32:07 CET</span>
                          </div>
                          <p className="text-xs md:text-sm text-blue-200/50">Stijlprofiel geanalyseerd, bouwvolume berekend, eerste 3D model gegenereerd op basis van 47 voorkeuren.</p>
                          <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 bg-blue-500/10 text-[9px] font-mono text-blue-300/60">
                            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                            SHA256: 7f8a2b...e4c1
                          </div>
                        </div>
                      </div>
                      
                      {/* Step 2 */}
                      <div className="flex gap-4 md:gap-6">
                        <div className="relative">
                          <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center">
                            <CheckCircle2 size={14} className="text-[#0a1628]" />
                          </div>
                        </div>
                        <div className="flex-1 pb-6">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-4 mb-2">
                            <span className="font-medium text-white text-sm md:text-base">Bestemmingsplan Getoetst</span>
                            <span className="font-mono text-[10px] md:text-xs text-blue-300/50">2024-11-15 • 14:32:12 CET</span>
                          </div>
                          <p className="text-xs md:text-sm text-blue-200/50">Automatische check tegen gemeentelijk bestemmingsplan. Bouwvlak, goothoogte, en bebouwingspercentage gevalideerd.</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-500/10 border border-blue-500/30 text-blue-300 text-[9px] font-medium uppercase tracking-wider">
                              <CheckCircle2 size={10} /> Bouwvlak OK
                            </span>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-500/10 border border-blue-500/30 text-blue-300 text-[9px] font-medium uppercase tracking-wider">
                              <CheckCircle2 size={10} /> Goothoogte OK
                            </span>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-500/10 border border-blue-500/30 text-blue-300 text-[9px] font-medium uppercase tracking-wider">
                              <CheckCircle2 size={10} /> Nokhoogte OK
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Step 3 */}
                      <div className="flex gap-4 md:gap-6">
                        <div className="relative">
                          <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center">
                            <CheckCircle2 size={14} className="text-[#0a1628]" />
                          </div>
                        </div>
                        <div className="flex-1 pb-6">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-4 mb-2">
                            <span className="font-medium text-white text-sm md:text-base">Constructieve Haalbaarheid</span>
                            <span className="font-mono text-[10px] md:text-xs text-blue-300/50">2024-11-15 • 14:33:45 CET</span>
                          </div>
                          <p className="text-xs md:text-sm text-blue-200/50">Preliminaire constructieberekening door Bureau Broersma. Fundering, draagstructuur en spanwijdtes gecontroleerd.</p>
                          <div className="mt-3 flex items-center gap-3 p-3 text-white bg-blue-500/10 border border-blue-500/20 rounded-lg">
                            <img src={BROERSMA_LOGO} alt="Bureau Broersma" className="h-5 brightness-0 invert opacity-80" />
                            <div className="text-[10px]">
                              <div className="text-blue-300/50 uppercase tracking-wider">Gevalideerd door</div>
                              <div className="font-medium text-blue-100">Bureau Broersma Constructie B.V.</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Step 4 */}
                      <div className="flex gap-4 md:gap-6">
                        <div className="relative">
                          <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center">
                            <CheckCircle2 size={14} className="text-[#0a1628]" />
                          </div>
                        </div>
                        <div className="flex-1 pb-6">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-4 mb-2">
                            <span className="font-medium text-white text-sm md:text-base">Kostenraming Gegenereerd</span>
                            <span className="font-mono text-[10px] md:text-xs text-blue-300/50">2024-11-15 • 14:34:02 CET</span>
                          </div>
                          <p className="text-xs md:text-sm text-blue-200/50">Gedetailleerde kostenopbouw op basis van actuele marktprijzen Q4 2024. Inclusief 10% onvoorzien.</p>
                          <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px]">
                            <div className="p-2 bg-blue-500/10 rounded"><span className="text-blue-300/50">Ruwbouw</span><br/><span className="font-mono font-medium text-white">€198.500</span></div>
                            <div className="p-2 bg-blue-500/10 rounded"><span className="text-blue-300/50">Installaties</span><br/><span className="font-mono font-medium text-white">€127.300</span></div>
                            <div className="p-2 bg-blue-500/10 rounded"><span className="text-blue-300/50">Afbouw</span><br/><span className="font-mono font-medium text-white">€114.700</span></div>
                            <div className="p-2 bg-blue-500/10 rounded"><span className="text-blue-300/50">Onvoorzien</span><br/><span className="font-mono font-medium text-white">€44.500</span></div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Step 5 */}
                      <div className="flex gap-4 md:gap-6">
                        <div className="relative">
                          <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center">
                            <CheckCircle2 size={14} className="text-[#0a1628]" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-4 mb-2">
                            <span className="font-medium text-white text-sm md:text-base">Paspoort Afgegeven</span>
                            <span className="font-mono text-[10px] md:text-xs text-blue-300/50">2024-11-15 • 14:34:18 CET</span>
                          </div>
                          <p className="text-xs md:text-sm text-blue-200/50">Document cryptografisch ondertekend en opgeslagen. Geldig voor 90 dagen, automatisch verlengbaar.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Document Footer - Authenticity Section */}
                <div className="pt-8 border-t border-blue-500/10">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    
                    {/* QR Verification */}
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 bg-blue-500/10 p-2 flex-shrink-0 rounded">
                        {/* Simulated QR Code */}
                        <div className="w-full h-full grid grid-cols-5 gap-0.5">
                          {[...Array(25)].map((_, i) => (
                            <div key={i} className={`${[0,1,2,3,4,5,9,10,14,15,19,20,21,22,23,24].includes(i) ? 'bg-blue-400' : 'bg-transparent'}`} />
                          ))}
                        </div>
                      </div>
                      <div className="text-[10px] text-blue-200/50">
                        <div className="font-medium text-blue-300 mb-1 uppercase tracking-wider">Verificatie</div>
                        <div className="mb-2">Scan om authenticiteit te controleren op passport.ooitgedacht.nl</div>
                        <div className="font-mono text-blue-300/40">ID: OG-2024-NL-0847</div>
                      </div>
                    </div>
                    
                    {/* Digital Signature */}
                    <div>
                      <div className="text-[10px] font-medium text-blue-300 mb-2 uppercase tracking-wider">Digitale Handtekening</div>
                      <div className="font-mono text-[9px] text-blue-300/40 break-all leading-relaxed bg-blue-500/10 p-2 rounded">
                        0x7f8a2b4c9e1d3f5a8b7c6d9e2f4a1b3c5d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7
                      </div>
                      <div className="text-[9px] text-blue-300/40 mt-1">ECDSA P-256 • Timestamped</div>
                    </div>
                    
                    {/* Issuer */}
                    <div>
                      <div className="text-[10px] font-medium text-blue-300 mb-2 uppercase tracking-wider">Uitgegeven door</div>
                      <div className="flex items-center gap-3">
                        <img src={BROERSMA_LOGO} alt="Bureau Broersma" className="h-8 brightness-0 invert opacity-60" />
                        <div className="text-[10px]">
                          <div className="font-medium text-blue-100">Bureau Broersma</div>
                          <div className="text-blue-300/40">Constructie & Advies sinds 1932</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Official Stamps */}
              <div className="px-6 md:px-10 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-white bg-blue-500/5 border-t border-blue-500/10 rounded-b-2xl">
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 border border-blue-400/30 bg-blue-400/10 rounded">
                    <CheckCircle2 size={12} className="text-blue-400" />
                    <span className="text-[9px] uppercase tracking-wider text-blue-300 font-medium">Constructie Gevalideerd</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 border border-blue-400/30 bg-blue-400/10 rounded">
                    <CheckCircle2 size={12} className="text-blue-400" />
                    <span className="text-[9px] uppercase tracking-wider text-blue-300 font-medium">Bestemmingsplan OK</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 border border-blue-400/30 bg-blue-400/10 rounded">
                    <CheckCircle2 size={12} className="text-blue-400" />
                    <span className="text-[9px] uppercase tracking-wider text-blue-300 font-medium">Kosten Geverifieerd</span>
                  </div>
                </div>
                <div className="text-[9px] text-blue-300/50 uppercase tracking-wider">
                  Geldig t/m: 2025-02-15
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Bottom Trust Indicators with Hand-Drawn Icons */}
        <TrustIndicatorsSection />

        {/* CTA Section */}
        <AnimatedSection delay={300} className="mt-16 md:mt-20 flex flex-col items-center text-center">
          <p className="text-blue-200/60 text-sm md:text-base mb-6 max-w-md font-light">
            {t('hero.readyToDesignDream')}
          </p>
          <button 
            onClick={() => setAppState(AppState.WIZARD_STEP_TYPE)}
            className="group px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full transition-all duration-200"
          >
            <span className="flex items-center gap-3">
              {t('hero.startFreeConfig')}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
          <p className="text-blue-200/40 text-xs mt-4">
            {t('hero.noAccount3MinFree')}
          </p>
        </AnimatedSection>
      </div>
    </div>
  );
};




