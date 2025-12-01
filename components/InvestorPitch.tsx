import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, ArrowLeft, ArrowDown, CheckCircle2, Shield, Eye, Zap, Clock, Camera, 
  Cpu, Building2, HardHat, Glasses, Users, BadgeCheck, ChevronRight, ChevronDown,
  Mail, Phone, AlertTriangle, XCircle, CheckCheck, Play, Quote, Heart, Coffee, 
  Sun, Home, Globe, TrendingUp, Lock, FileText, Database, Layers, Target,
  Rocket, Award, BarChart3, Calendar, MapPin, Sparkles, Network, Box, Hammer
} from 'lucide-react';
import { AppState } from '../types';

const BROERSMA_LOGO = "https://www.bureau-broersma.nl/wp-content/uploads/2015/09/logo-broersma-bouwadvies.png";

interface InvestorPitchProps {
  setAppState: (state: AppState) => void;
}

// Intersection Observer hook
const useInView = (threshold = 0.1) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsInView(true); observer.disconnect(); } },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, isInView };
};

const AnimatedSection: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ 
  children, className = '', delay = 0 
}) => {
  const { ref, isInView } = useInView(0.05); // Lower threshold for easier triggering
  return (
    <div ref={ref} className={`transition-all duration-700 ${className}`}
      style={{ 
        opacity: isInView ? 1 : 0.1, // Start slightly visible so IntersectionObserver can detect
        transform: isInView ? 'translateY(0)' : 'translateY(20px)', 
        transitionDelay: `${delay}ms`,
        minHeight: '1px' // Ensure element has height for observation
      }}>
      {children}
    </div>
  );
};

// Table of contents data
const tocItems = [
  { id: 'vision', label: '0. Visie & Strategie', icon: <Target size={14} /> },
  { id: 'b2c', label: '1. OoitGedacht (B2C)', icon: <Home size={14} /> },
  { id: 'b2b', label: '2. Homie (B2B)', icon: <HardHat size={14} /> },
  { id: 'tech', label: '3. Technologie', icon: <Cpu size={14} /> },
  { id: 'market', label: '4. Marktvalidatie', icon: <TrendingUp size={14} /> },
  { id: 'team', label: '5. Team & Autoriteit', icon: <Users size={14} /> },
  { id: 'business', label: '6. Businessmodel', icon: <BarChart3 size={14} /> },
  { id: 'roadmap', label: '7. Roadmap', icon: <Calendar size={14} /> },
  { id: 'international', label: '8. Internationaal', icon: <Globe size={14} /> },
  { id: 'ask', label: '9. The Ask', icon: <Rocket size={14} /> },
];

export const InvestorPitch: React.FC<InvestorPitchProps> = ({ setAppState }) => {
  const [activeSection, setActiveSection] = useState('vision');
  const [tocOpen, setTocOpen] = useState(true);

  // Scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const sections = tocItems.map(item => document.getElementById(item.id));
      const scrollPos = window.scrollY + 200;
      sections.forEach((section, i) => {
        if (section && section.offsetTop <= scrollPos) {
          setActiveSection(tocItems[i].id);
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-[#030712] min-h-screen text-white">
      {/* Fixed Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#030712]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <button onClick={() => setAppState(AppState.LANDING)} className="flex items-center gap-3 group">
            <ArrowLeft size={18} className="text-white/40 group-hover:text-white transition-colors" />
            <img src="/generated/og-logo.png" alt="OoitGedacht" className="h-6 brightness-0 invert opacity-70 group-hover:opacity-100 transition-opacity" />
          </button>
          <div className="hidden md:flex items-center gap-1 text-xs">
            <span className="text-white/30 uppercase tracking-wider mr-2">Investor Deck</span>
            <span className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded text-[10px] font-bold">v1.0</span>
            <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-[10px] font-bold ml-1">CONFIDENTIAL</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setAppState(AppState.WIZARD_HOUSEHOLD)} className="text-xs text-white/50 hover:text-white transition-colors">
              Demo →
            </button>
          </div>
        </div>
      </nav>

      {/* Floating TOC */}
      <div className={`fixed left-0 top-20 z-50 transition-all duration-300 ${tocOpen ? 'translate-x-0' : '-translate-x-[calc(100%-40px)]'}`}>
        <div className="bg-[#0a1628]/95 backdrop-blur-xl border border-white/5 rounded-r-2xl overflow-hidden shadow-2xl">
          <button 
            onClick={() => setTocOpen(!tocOpen)}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full bg-[#0a1628] border border-white/5 border-l-0 rounded-r-lg p-2"
          >
            <ChevronRight size={16} className={`text-white/40 transition-transform ${tocOpen ? 'rotate-180' : ''}`} />
          </button>
          <div className="p-4 border-b border-white/5">
            <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Inhoud</span>
          </div>
          <div className="p-2 space-y-0.5 max-h-[70vh] overflow-y-auto">
            {tocItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs transition-all ${
                  activeSection === item.id 
                    ? 'bg-blue-500/20 text-blue-400' 
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className={activeSection === item.id ? 'text-blue-400' : 'text-white/30'}>{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* HERO - Title Slide */}
      {/* ============================================ */}
      <section className="relative min-h-screen flex flex-col justify-center pt-16">
        <div className="absolute inset-0">
          <img src="/generated/investor-pitch/hero/hero-title.png" alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#030712]/70 to-[#030712]" />
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(16, 185, 129, 0.08) 0%, transparent 40%)'
          }} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <AnimatedSection>
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full mb-8">
              <img src={BROERSMA_LOGO} alt="Bureau Broersma" className="h-5 brightness-0 invert opacity-60" />
              <span className="text-white/30">×</span>
              <img src="/generated/og-logo.png" alt="OoitGedacht" className="h-5 brightness-0 invert opacity-80" />
            </div>
          </AnimatedSection>

          <AnimatedSection delay={100}>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-[0.95]">
              <span className="block text-white">OoitGedacht</span>
              <span className="block text-white/30">&</span>
              <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">Homie</span>
            </h1>
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <p className="text-xl md:text-2xl text-white/50 max-w-2xl mx-auto leading-relaxed font-light mb-4">
              Het besturingssysteem voor de nieuwe Nederlandse woonvorm
            </p>
            <p className="text-sm text-white/30 mb-12">
              Strategisch Projectdossier • November 2025 • Versie 1.0
            </p>
          </AnimatedSection>

          <AnimatedSection delay={300}>
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              <div className="px-5 py-3 bg-white/5 border border-white/10 rounded-xl">
                <div className="text-2xl font-bold text-white">€390B</div>
                <div className="text-xs text-white/40">NL Woningmarkt</div>
              </div>
              <div className="px-5 py-3 bg-white/5 border border-white/10 rounded-xl">
                <div className="text-2xl font-bold text-emerald-400">19.000+</div>
                <div className="text-xs text-white/40">Projecten Archief</div>
              </div>
              <div className="px-5 py-3 bg-white/5 border border-white/10 rounded-xl">
                <div className="text-2xl font-bold text-blue-400">70+ jaar</div>
                <div className="text-xs text-white/40">Broersma Ervaring</div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={400}>
            <button 
              onClick={() => scrollTo('vision')}
              className="group flex flex-col items-center gap-2 text-white/30 hover:text-white/60 transition-colors"
            >
              <span className="text-xs uppercase tracking-widest">Begin presentatie</span>
              <ArrowDown size={20} className="animate-bounce" />
            </button>
          </AnimatedSection>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 0: VISION & IMMEDIATE ACTION */}
      {/* ============================================ */}
      <section id="vision" className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent" />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <AnimatedSection>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Target size={24} className="text-blue-400" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-blue-400 font-bold">Sectie 0</div>
                <h2 className="text-3xl md:text-4xl font-bold">Directe Actiepunten</h2>
              </div>
            </div>
            {/* Vision Hero Image */}
            <div className="rounded-2xl overflow-hidden mb-12 border border-white/10">
              <img src="/generated/investor-pitch/vision/vision-partnership.png" alt="Broersma Partnership" className="w-full h-64 md:h-80 object-cover" />
            </div>
          </AnimatedSection>

          {/* Three columns of immediate actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <AnimatedSection delay={100}>
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 h-full">
                <div className="flex items-center gap-2 text-amber-400 text-sm font-bold mb-4">
                  <Building2 size={16} />
                  Business & Partnership
                </div>
                <ul className="space-y-3 text-sm text-white/60">
                  <li className="flex gap-2"><span className="text-amber-400">•</span>Formeel partnerschap Broersma uitwerken</li>
                  <li className="flex gap-2"><span className="text-amber-400">•</span>19.000+ projectarchieven ontsluiten</li>
                  <li className="flex gap-2"><span className="text-amber-400">•</span>Eerste pilotproject selecteren</li>
                  <li className="flex gap-2"><span className="text-amber-400">•</span>Naampositionering vastleggen</li>
                </ul>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 h-full">
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold mb-4">
                  <Rocket size={16} />
                  Go-to-Market
                </div>
                <ul className="space-y-3 text-sm text-white/60">
                  <li className="flex gap-2"><span className="text-emerald-400">•</span><strong className="text-white">Cooplink</strong> - hoogste prioriteit</li>
                  <li className="flex gap-2"><span className="text-emerald-400">•</span>Zelfbouw-platforms benaderen</li>
                  <li className="flex gap-2"><span className="text-emerald-400">•</span>LinkedIn founder-led sales</li>
                  <li className="flex gap-2"><span className="text-emerald-400">•</span>Bouw- & verzekeraars gesprekken</li>
                </ul>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={300}>
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 h-full">
                <div className="flex items-center gap-2 text-cyan-400 text-sm font-bold mb-4">
                  <Cpu size={16} />
                  Product & Tech
                </div>
                <ul className="space-y-3 text-sm text-white/60">
                  <li className="flex gap-2"><span className="text-cyan-400">•</span>MVP-scope: OG Wizard + Homie Dashboard</li>
                  <li className="flex gap-2"><span className="text-cyan-400">•</span>Smart glasses platform kiezen</li>
                  <li className="flex gap-2"><span className="text-cyan-400">•</span>Gemini Enterprise licenties</li>
                  <li className="flex gap-2"><span className="text-cyan-400">•</span>Eerste FSM-bibliotheek definiëren</li>
                </ul>
              </div>
            </AnimatedSection>
          </div>

          {/* Positioning Infographic */}
          <AnimatedSection delay={350}>
            <div className="rounded-2xl overflow-hidden border border-white/10 mb-12">
              <img src="/generated/investor-pitch/vision/vision-positioning.png" alt="Two Brands Positioning" className="w-full h-48 md:h-64 object-cover" />
              <div className="p-4 bg-white/5"><span className="text-sm text-white/60">B2C + B2B: Twee gezichten, één platform</span></div>
            </div>
          </AnimatedSection>

          {/* Positioning diagram */}
          <AnimatedSection delay={400}>
            <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-emerald-500/10 border border-white/10 rounded-3xl p-8 md:p-12">
              <h3 className="text-xl font-bold mb-8 text-center">Naampositionering</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-[#030712]/50 rounded-2xl p-6 border border-blue-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <Home size={24} className="text-blue-400" />
                    <div className="text-xl font-bold">OoitGedacht</div>
                  </div>
                  <div className="text-sm text-white/60 mb-4">B2C / Zelfbouw & Lifestyle</div>
                  <p className="text-white/50 text-sm leading-relaxed">
                    Het droomhuisplatform voor jonge professionals. Van eerste idee tot sleuteloverdracht,
                    volledig begeleid met AI-visualisaties en expert-validatie.
                  </p>
                </div>
                <div className="bg-[#030712]/50 rounded-2xl p-6 border border-amber-500/20">
                  <div className="flex items-center gap-3 mb-4">
                    <HardHat size={24} className="text-amber-400" />
                    <div className="text-xl font-bold">Homie</div>
                  </div>
                  <div className="text-sm text-white/60 mb-4">B2B / Construction OS (powered by BouwBorg)</div>
                  <p className="text-white/50 text-sm leading-relaxed">
                    AI-gedreven bouw-besturingssysteem voor aannemers en kwaliteitsborgers.
                    WKB-compliance engine met smart glasses en FSM-workflows.
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 1: B2C - OoitGedacht */}
      {/* ============================================ */}
      <section id="b2c" className="py-32 bg-[#0a1628]/30 relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="/generated/investor-pitch/b2c/b2c-lifestyle-hero.png" alt="" className="w-full h-full object-cover opacity-[0.08]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#030712] via-[#030712]/95 to-[#030712]/90" />
        </div>
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <AnimatedSection>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Home size={24} className="text-blue-400" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-blue-400 font-bold">Sectie 1</div>
                <h2 className="text-3xl md:text-4xl font-bold">OoitGedacht — B2C</h2>
              </div>
            </div>
            <p className="text-xl text-white/50 max-w-2xl mb-8 font-light">
              Tech-enabled zelfbouwplatform dat de zelfbouwmarkt democratiseert voor jonge professionals.
            </p>
            {/* B2C Hero Images Grid */}
            <div className="grid md:grid-cols-2 gap-4 mb-12">
              <div className="rounded-2xl overflow-hidden border border-white/10">
                <img src="/generated/investor-pitch/b2c/b2c-lifestyle-hero.png" alt="Dream Home Lifestyle" className="w-full h-48 object-cover" />
                <div className="p-3 bg-white/5"><span className="text-xs text-white/50">De droom: eigen huis in het groen</span></div>
              </div>
              <div className="rounded-2xl overflow-hidden border border-white/10">
                <img src="/generated/investor-pitch/b2c/b2c-yup-target.png" alt="Target Audience" className="w-full h-48 object-cover" />
                <div className="p-3 bg-white/5"><span className="text-xs text-white/50">Doelgroep: YUP 25-40 jaar</span></div>
              </div>
            </div>
          </AnimatedSection>

          {/* Core promise */}
          <AnimatedSection delay={100}>
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border border-blue-500/20 rounded-3xl p-8 md:p-12 mb-12">
              <Quote size={40} className="text-blue-500/20 mb-4" />
              <blockquote className="text-2xl md:text-3xl font-light leading-relaxed text-white/90 mb-6">
                "Ontwerp en realiseer je droomhuis op een specifieke kavel, met een strak begeleid proces, 
                waar experts én AI samen je risico's beperken — zonder dat jij bouwexpert hoeft te zijn."
              </blockquote>
              <div className="text-sm text-blue-400 font-medium">Kernbelofte voor de eindklant</div>
            </div>
          </AnimatedSection>

          {/* Target audience */}
          <AnimatedSection delay={200}>
            <h3 className="text-xl font-bold mb-6">Doelgroep: De "YUP-trend"</h3>
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[
                { title: '25-40 jaar', desc: 'Hoogopgeleid, stedelijk georiënteerd, prijsbewust maar niet generiek' },
                { title: 'De "5km shift"', desc: 'Niet in oververhitte binnenstad, maar 5km daarbuiten in "straat in het weiland"' },
                { title: 'Huis als identiteit', desc: 'Zien huis als uitdrukking van wie ze zijn én als lange termijn asset' }
              ].map((item, i) => (
                <div key={i} className="bg-white/[0.02] border border-white/5 rounded-xl p-6">
                  <div className="font-bold text-blue-400 mb-2">{item.title}</div>
                  <div className="text-sm text-white/50">{item.desc}</div>
                </div>
              ))}
            </div>
          </AnimatedSection>

          {/* Wizard Flow Visualization */}
          <AnimatedSection delay={250}>
            <div className="rounded-2xl overflow-hidden border border-blue-500/20 mb-12">
              <img src="/generated/investor-pitch/b2c/b2c-wizard-flow.png" alt="Digital Wizard Flow" className="w-full h-48 md:h-64 object-cover" />
              <div className="p-4 bg-blue-500/10"><span className="text-sm text-blue-400">OG Wizard: Van eerste idee tot Bouwpaspoort in 5 stappen</span></div>
            </div>
          </AnimatedSection>

          {/* User Journey */}
          <AnimatedSection delay={300}>
            <h3 className="text-xl font-bold mb-6">First Time User Experience</h3>
            <div className="grid md:grid-cols-5 gap-4 mb-12">
              {[
                { num: '1', title: 'Hook', desc: 'Ad / social: "Ontwerp je huis in 5 minuten"', color: 'blue' },
                { num: '2', title: 'Wizard', desc: 'Locatie → Budget → Stijl → Prioriteiten', color: 'cyan' },
                { num: '3', title: 'AI Render', desc: 'Hyperrealistische visualisatie op concrete kavel', color: 'emerald' },
                { num: '4', title: 'Gate', desc: 'Email → Full-res render + Bouwpaspoort', color: 'amber' },
                { num: '5', title: 'CTA', desc: 'Haalbaarheid-sessie of uitgebreid paspoort', color: 'purple' }
              ].map((step, i) => (
                <div key={i} className="relative">
                  {i < 4 && <div className="hidden md:block absolute top-8 right-0 w-full h-px bg-gradient-to-r from-white/20 to-transparent" />}
                  <div className={`bg-${step.color}-500/10 border border-${step.color}-500/20 rounded-xl p-4`}>
                    <div className={`text-${step.color}-400 text-xs font-bold mb-1`}>STAP {step.num}</div>
                    <div className="font-semibold text-sm mb-1">{step.title}</div>
                    <div className="text-xs text-white/40">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>

          {/* Growth channels */}
          <AnimatedSection delay={400}>
            <h3 className="text-xl font-bold mb-6">Growth-strategieën</h3>
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { icon: <TrendingUp size={20} />, title: 'Performance', items: ['Facebook/Instagram/TikTok ads', 'A/B test hooks', 'Retargeting'] },
                { icon: <Users size={20} />, title: 'Partnerships', items: ['Cooplink, VrijCoop', 'Zelfbouw portals', 'Gemeenten'] },
                { icon: <FileText size={20} />, title: 'Content', items: ['YouTube serie', 'Webinars', 'Community platform'] },
                { icon: <Sparkles size={20} />, title: 'Viral', items: ['Deelbare renders', 'Referral korting', 'Social proof'] }
              ].map((channel, i) => (
                <div key={i} className="bg-white/[0.02] border border-white/5 rounded-xl p-5">
                  <div className="text-blue-400 mb-3">{channel.icon}</div>
                  <div className="font-semibold mb-2">{channel.title}</div>
                  <ul className="space-y-1">
                    {channel.items.map((item, j) => (
                      <li key={j} className="text-xs text-white/40 flex items-center gap-1">
                        <span className="w-1 h-1 bg-blue-400 rounded-full" />{item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 2: B2B - Homie/BouwBorg */}
      {/* ============================================ */}
      <section id="b2b" className="py-32 relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="/generated/investor-pitch/b2b/b2b-wkb-pain.png" alt="" className="w-full h-full object-cover opacity-[0.1]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#030712] via-[#030712]/95 to-[#030712]/90" />
        </div>
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <AnimatedSection>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <HardHat size={24} className="text-amber-400" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-amber-400 font-bold">Sectie 2</div>
                <h2 className="text-3xl md:text-4xl font-bold">Homie — B2B</h2>
              </div>
            </div>
            <p className="text-xl text-white/50 max-w-2xl mb-8 font-light">
              Het Construction Operating System voor aannemers & kwaliteitsborgers, powered by BouwBorg.
            </p>
            {/* B2B Hero - Smart Glasses */}
            <div className="grid md:grid-cols-3 gap-4 mb-12">
              <div className="rounded-2xl overflow-hidden border border-amber-500/20">
                <img src="/generated/investor-pitch/b2b/b2b-smart-glasses.png" alt="Smart Safety Glasses" className="w-full h-40 object-cover" />
                <div className="p-3 bg-amber-500/10"><span className="text-xs text-amber-400">Smart Safety Glasses</span></div>
              </div>
              <div className="rounded-2xl overflow-hidden border border-amber-500/20">
                <img src="/generated/investor-pitch/b2b/b2b-dashboard.png" alt="Quality Dashboard" className="w-full h-40 object-cover" />
                <div className="p-3 bg-amber-500/10"><span className="text-xs text-amber-400">Kwaliteitsborger Dashboard</span></div>
              </div>
              <div className="rounded-2xl overflow-hidden border border-amber-500/20">
                <img src="/generated/investor-pitch/b2b/b2b-fsm-workflow.png" alt="FSM Workflow" className="w-full h-40 object-cover" />
                <div className="p-3 bg-amber-500/10"><span className="text-xs text-amber-400">FSM Workflow Engine</span></div>
              </div>
            </div>
          </AnimatedSection>

          {/* Problem statement */}
          <AnimatedSection delay={100}>
            <div className="bg-gradient-to-br from-red-500/10 to-orange-500/5 border border-red-500/20 rounded-3xl p-8 mb-12">
              <h3 className="text-xl font-bold mb-4 text-red-400">Het Probleem</h3>
              <div className="grid md:grid-cols-3 gap-6 text-center mb-6">
                <div>
                  <div className="text-3xl font-bold text-red-400">20 jaar</div>
                  <div className="text-sm text-white/50">Aansprakelijkheid onder Wkb</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-400">10-15%</div>
                  <div className="text-sm text-white/50">Faalkosten van bouwsom</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-400">73%</div>
                  <div className="text-sm text-white/50">Mist goed bewijssysteem</div>
                </div>
              </div>
              <p className="text-white/60 text-center">
                WhatsApp, e-mails, losse foto's op telefoons. Excel-lijsten achteraf invullen. 
                Kwaliteitsborgers in busjes het land door. <strong className="text-white">Het tegenovergestelde van "audit-proof".</strong>
              </p>
            </div>
          </AnimatedSection>

          {/* Solution components */}
          <AnimatedSection delay={200}>
            <h3 className="text-xl font-bold mb-6">De Oplossing</h3>
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-4">
                  <Glasses size={28} className="text-white" />
                </div>
                <h4 className="font-bold mb-2">Smart Safety Glasses</h4>
                <p className="text-sm text-white/50 mb-4">
                  Veiligheidsbrillen met ingebouwde camera. Handsfree foto's/video's van kritische fasen.
                </p>
                <ul className="space-y-1 text-xs text-white/40">
                  <li>• Wapening voor storten</li>
                  <li>• Isolatie vóór afwerken</li>
                  <li>• Dakopbouw documentatie</li>
                </ul>
              </div>

              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4">
                  <Cpu size={28} className="text-white" />
                </div>
                <h4 className="font-bold mb-2">Vakman App</h4>
                <p className="text-sm text-white/50 mb-4">
                  Big-button interface (handschoenen-proof). Verkeerslichtstatus voor alle taken.
                </p>
                <ul className="space-y-1 text-xs text-white/40">
                  <li>• 🔴 Geblokkeerd</li>
                  <li>• 🟡 In review</li>
                  <li>• 🟢 Doorgaan + betaling vrij</li>
                </ul>
              </div>

              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center mb-4">
                  <BadgeCheck size={28} className="text-white" />
                </div>
                <h4 className="font-bold mb-2">Broersma Dashboard</h4>
                <p className="text-sm text-white/50 mb-4">
                  Overzicht van 10-100 projecten. Eén klik voor volledig Dossier Bevoegd Gezag.
                </p>
                <ul className="space-y-1 text-xs text-white/40">
                  <li>• Risicoprofiel per project</li>
                  <li>• Filter op urgentie</li>
                  <li>• Automatische rapportage</li>
                </ul>
              </div>
            </div>
          </AnimatedSection>

          {/* FSM concept */}
          <AnimatedSection delay={300}>
            <div className="bg-[#0a1628] border border-blue-500/20 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-blue-500/20 flex items-center justify-between">
                <h4 className="font-bold">FSM-Engine: "Geen foto, geen stort"</h4>
                <div className="text-xs text-blue-400 font-mono">FINITE STATE MACHINE</div>
              </div>
              <div className="p-6 font-mono text-sm">
                <div className="text-white/40 mb-2">// Voorbeeld state transition</div>
                <div className="text-emerald-400">ALS Foto_Fundering_Geüpload = WAAR</div>
                <div className="text-cyan-400 pl-4">EN AI_Check = GESLAAGD</div>
                <div className="text-cyan-400 pl-4">EN Ingenieur_Goedkeuring = WAAR</div>
                <div className="text-amber-400">DAN</div>
                <div className="text-white pl-4">FSM_State: Fundering_LOCKED → Fundering_UNLOCKED</div>
                <div className="text-white pl-4">Actie: Beton_storten toegestaan</div>
                <div className="text-emerald-400 pl-4">Betaling: Deelbetaling vrijgeven</div>
              </div>
            </div>
          </AnimatedSection>

          {/* Pricing */}
          <AnimatedSection delay={400}>
            <h3 className="text-xl font-bold mt-12 mb-6">Businessmodel Homie/BouwBorg</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: 'Klein werk', price: '~€450', desc: 'Dakkapel, aanbouw' },
                { name: 'Nieuwbouwwoning', price: '~€1.500', desc: 'Complete woning', featured: true },
                { name: 'Complex project', price: 'Maatwerk', desc: 'Meerdere woningen' }
              ].map((plan, i) => (
                <div key={i} className={`rounded-2xl p-6 text-center ${plan.featured ? 'bg-amber-500/10 border-2 border-amber-500/30' : 'bg-white/[0.02] border border-white/5'}`}>
                  <div className="font-semibold mb-1">{plan.name}</div>
                  <div className="text-3xl font-bold mb-2">{plan.price}</div>
                  <div className="text-xs text-white/40">{plan.desc}</div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 3: TECHNOLOGY */}
      {/* ============================================ */}
      <section id="tech" className="py-32 bg-[#0a1628]/30 relative">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Cpu size={24} className="text-purple-400" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-purple-400 font-bold">Sectie 3</div>
                <h2 className="text-3xl md:text-4xl font-bold">Technische Architectuur</h2>
              </div>
            </div>
            <p className="text-xl text-white/50 max-w-2xl mb-8 font-light">
              Verticale integratie: Hardware + Software + AI + Blockchain — geïnspireerd door Apple en Anduril.
            </p>
            {/* Tech Architecture Visualization */}
            <div className="rounded-2xl overflow-hidden border border-purple-500/20 mb-12">
              <img src="/generated/investor-pitch/tech/tech-architecture.png" alt="System Architecture" className="w-full h-64 md:h-80 object-cover" />
              <div className="p-4 bg-purple-500/10 flex items-center justify-between">
                <span className="text-sm text-purple-400">4-Layer Architectuur: Experience → Workflow → Intelligence → Data</span>
              </div>
            </div>
          </AnimatedSection>

          {/* Architecture layers */}
          <AnimatedSection delay={100}>
            <div className="grid md:grid-cols-4 gap-4 mb-12">
              {[
                { layer: '1', name: 'Experience', icon: <Eye size={20} />, items: ['OG Wizard (B2C)', 'Vakman App', 'Broersma Dashboard', 'Eindklantportaal'], color: 'blue' },
                { layer: '2', name: 'Workflow (FSM)', icon: <Network size={20} />, items: ['States per project', 'Transities met keys', 'Policy-profielen', 'Event-driven betaling'], color: 'cyan' },
                { layer: '3', name: 'Intelligence (AI)', icon: <Sparkles size={20} />, items: ['Multi-agent orkestratie', 'Gemini 2.5 Flash', 'Beeldgeneratie', 'Structureel Agent'], color: 'purple' },
                { layer: '4', name: 'Data & Blockchain', icon: <Database size={20} />, items: ['Project states', 'Object storage', 'CERE Network hashes', 'Audit-proof logging'], color: 'emerald' }
              ].map((layer, i) => (
                <div key={i} className={`bg-${layer.color}-500/5 border border-${layer.color}-500/20 rounded-2xl p-5`}>
                  <div className={`text-${layer.color}-400 mb-3`}>{layer.icon}</div>
                  <div className="text-xs text-white/40 mb-1">Layer {layer.layer}</div>
                  <div className="font-bold mb-3">{layer.name}</div>
                  <ul className="space-y-1">
                    {layer.items.map((item, j) => (
                      <li key={j} className="text-xs text-white/50 flex items-center gap-1">
                        <span className={`w-1 h-1 bg-${layer.color}-400 rounded-full`} />{item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </AnimatedSection>

          {/* AI capabilities */}
          <AnimatedSection delay={200}>
            <h3 className="text-xl font-bold mb-6">AI Capaciteiten per Stakeholder</h3>
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6">
                <h4 className="font-bold mb-3 text-blue-400">Voor Eindklanten</h4>
                <ul className="space-y-2 text-sm text-white/60">
                  <li>• AI-visualisaties op specifieke kavels</li>
                  <li>• Persoonlijke begeleiding: budget, energielabel</li>
                  <li>• Direct antwoord op "kan dit binnen mijn budget?"</li>
                </ul>
              </div>
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6">
                <h4 className="font-bold mb-3 text-amber-400">Voor Aannemers</h4>
                <ul className="space-y-2 text-sm text-white/60">
                  <li>• Automatische classificatie foto's/documenten</li>
                  <li>• Directe fit-checks op wapening/bewijs</li>
                  <li>• Spraak → gestructureerde notities</li>
                </ul>
              </div>
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6">
                <h4 className="font-bold mb-3 text-emerald-400">Voor Kwaliteitsborgers</h4>
                <ul className="space-y-2 text-sm text-white/60">
                  <li>• Pre-filter: alleen kritieke situaties naar boven</li>
                  <li>• Semi-automatische WKB-dossiers</li>
                  <li>• Uitlegbare beslislogica met verwijzing naar norm</li>
                </ul>
              </div>
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6">
                <h4 className="font-bold mb-3 text-purple-400">Voor Gemeenten & Verzekeraars</h4>
                <ul className="space-y-2 text-sm text-white/60">
                  <li>• Machineleesbare data over doorlooptijden</li>
                  <li>• Foutenpatronen en risicoprofielen</li>
                  <li>• Beleidssimulatiesop historische data</li>
                </ul>
              </div>
            </div>
          </AnimatedSection>

          {/* AI & Blockchain Visualizations */}
          <AnimatedSection delay={250}>
            <div className="grid md:grid-cols-2 gap-4 mb-12">
              <div className="rounded-2xl overflow-hidden border border-purple-500/20">
                <img src="/generated/investor-pitch/tech/tech-ai-agents.png" alt="Multi-Agent AI" className="w-full h-48 object-cover" />
                <div className="p-3 bg-purple-500/10"><span className="text-xs text-purple-400">Multi-Agent AI Orkestratie</span></div>
              </div>
              <div className="rounded-2xl overflow-hidden border border-purple-500/20">
                <img src="/generated/investor-pitch/tech/tech-blockchain-passport.png" alt="Blockchain Passport" className="w-full h-48 object-cover" />
                <div className="p-3 bg-purple-500/10"><span className="text-xs text-purple-400">Housing Passport & Blockchain</span></div>
              </div>
            </div>
          </AnimatedSection>

          {/* Blockchain / Housing Passport */}
          <AnimatedSection delay={300}>
            <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/5 border border-purple-500/20 rounded-3xl p-8">
              <h3 className="text-xl font-bold mb-4">Housing Passport & Permissioned AI (CEF)</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-purple-400 mb-3">Woningpaspoort</h4>
                  <ul className="space-y-2 text-sm text-white/60">
                    <li>• Elk artefact (foto, rapport) krijgt hash op CERE Network</li>
                    <li>• Chronologische events: fundering, gevel, isolatie</li>
                    <li>• Onweerlegbare audit trail</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-400 mb-3">Permissioned AI Access</h4>
                  <ul className="space-y-2 text-sm text-white/60">
                    <li>• Eigenaar geeft tijdelijk, doelgebonden toegang</li>
                    <li>• AI-agent valideert voor bank/verzekeraar</li>
                    <li>• Machineleesbaar certificaat, geen ruwe data</li>
                  </ul>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 4: MARKET VALIDATION */}
      {/* ============================================ */}
      <section id="market" className="py-32 relative">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <TrendingUp size={24} className="text-emerald-400" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-emerald-400 font-bold">Sectie 4</div>
                <h2 className="text-3xl md:text-4xl font-bold">Marktvalidatie: Wkb als Hefboom</h2>
              </div>
            </div>
            {/* Market Infographics */}
            <div className="grid md:grid-cols-2 gap-4 mb-12">
              <div className="rounded-2xl overflow-hidden border border-emerald-500/20">
                <img src="/generated/investor-pitch/market/market-wkb-leverage.png" alt="Wkb as Leverage" className="w-full h-48 object-cover" />
                <div className="p-3 bg-emerald-500/10"><span className="text-xs text-emerald-400">Wkb: van barrière naar vraag-generator</span></div>
              </div>
              <div className="rounded-2xl overflow-hidden border border-emerald-500/20">
                <img src="/generated/investor-pitch/market/market-two-sided.png" alt="Two-Sided Mirror" className="w-full h-48 object-cover" />
                <div className="p-3 bg-emerald-500/10"><span className="text-xs text-emerald-400">Zelfde data, andere emotie</span></div>
              </div>
            </div>
          </AnimatedSection>

          {/* Wkb explanation */}
          <AnimatedSection delay={100}>
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-8 mb-12">
              <h3 className="text-xl font-bold mb-4">Wat is de Wkb?</h3>
              <p className="text-white/60 mb-6">
                <strong className="text-white">Wet kwaliteitsborging voor het bouwen</strong> — sinds 1 januari 2024. 
                Verlegt de nadruk van "toets vooraf" naar "borging tijdens en bewijs achteraf".
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-[#030712]/50 rounded-xl p-5">
                  <div className="text-emerald-400 font-bold text-2xl mb-2">20 jaar</div>
                  <div className="text-sm text-white/50">Aansprakelijkheid bouwer voor verborgen gebreken</div>
                </div>
                <div className="bg-[#030712]/50 rounded-xl p-5">
                  <div className="text-emerald-400 font-bold text-2xl mb-2">Bewijslast</div>
                  <div className="text-sm text-white/50">Bij de bouwer: aantoonbare kwaliteit vereist</div>
                </div>
                <div className="bg-[#030712]/50 rounded-xl p-5">
                  <div className="text-emerald-400 font-bold text-2xl mb-2">Dossierplicht</div>
                  <div className="text-sm text-white/50">Consumentendossier + Dossier Bevoegd Gezag</div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Two-sided mirror */}
          <AnimatedSection delay={200}>
            <h3 className="text-xl font-bold mb-6">"Two-sided Mirror" — Zelfde Data, Andere Emotie</h3>
            <div className="overflow-x-auto mb-12">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-white/40 font-medium">Datapunt</th>
                    <th className="text-left py-3 px-4 text-amber-400 font-medium">Homie (B2B)</th>
                    <th className="text-left py-3 px-4 text-blue-400 font-medium">OoitGedacht (B2C)</th>
                  </tr>
                </thead>
                <tbody className="text-white/60">
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-4">Foto wapening vóór storten</td>
                    <td className="py-3 px-4">Bewijsstuk tegen 20 jaar aansprakelijkheid</td>
                    <td className="py-3 px-4">"Kijk, je fundering is écht veilig"</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-4">Bon betoncentrale</td>
                    <td className="py-3 px-4">Vastlegging sterkteklasse/batchnummer</td>
                    <td className="py-3 px-4">"We hebben geleverd wat beloofd is"</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Goedgekeurde FSM-state</td>
                    <td className="py-3 px-4">Mag door + deelbetaling vrijgeven</td>
                    <td className="py-3 px-4">"Hoera, fase 1 is af!" 🎉</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </AnimatedSection>

          {/* Rated opportunities */}
          <AnimatedSection delay={300}>
            <h3 className="text-xl font-bold mb-6">Rated Business Opportunities (NL)</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold">Homie/BouwBorg</h4>
                  <div className="text-2xl font-bold text-amber-400">9.5/10</div>
                </div>
                <p className="text-sm text-white/50 mb-4">
                  "Boring but billions" — Wkb is wettelijke verplichting, voorspelbare vraag, SaaS-achtige marges.
                </p>
                <div className="text-xs text-amber-400/60">Stabiele B2B cashflow, financiert OG moonshot</div>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold">OoitGedacht</h4>
                  <div className="text-2xl font-bold text-blue-400">9.0/10</div>
                </div>
                <p className="text-sm text-white/50 mb-4">
                  Hoge viraliteitspotentie, enorm maatschappelijk probleem. Operationeel complexer.
                </p>
                <div className="text-xs text-blue-400/60">Moonshot met enorm commercieel potentieel</div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 5: TEAM & AUTHORITY */}
      {/* ============================================ */}
      <section id="team" className="py-32 bg-[#0a1628]/30 relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="/generated/investor-pitch/team/team-broersma-legacy.png" alt="" className="w-full h-full object-cover opacity-[0.1]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#030712] via-[#030712]/95 to-[#030712]/80" />
        </div>
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <AnimatedSection>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <Users size={24} className="text-cyan-400" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-cyan-400 font-bold">Sectie 5</div>
                <h2 className="text-3xl md:text-4xl font-bold">Team & Autoriteit</h2>
              </div>
            </div>
            <p className="text-xl text-white/50 max-w-2xl mb-8 font-light">
              "Why us?" — De combinatie van 70 jaar deep engineering + 10+ jaar workflowtech.
            </p>
            {/* Team Images */}
            <div className="grid md:grid-cols-2 gap-4 mb-12">
              <div className="rounded-2xl overflow-hidden border border-cyan-500/20">
                <img src="/generated/investor-pitch/team/team-broersma-legacy.png" alt="70 Years of Engineering" className="w-full h-48 object-cover" />
                <div className="p-3 bg-cyan-500/10"><span className="text-xs text-cyan-400">70 jaar engineering erfenis</span></div>
              </div>
              <div className="rounded-2xl overflow-hidden border border-cyan-500/20">
                <img src="/generated/investor-pitch/team/team-network.png" alt="Professional Network" className="w-full h-48 object-cover" />
                <div className="p-3 bg-cyan-500/10"><span className="text-xs text-cyan-400">Uitgebreid professioneel netwerk</span></div>
              </div>
            </div>
          </AnimatedSection>

          {/* Founders */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <AnimatedSection delay={100}>
              <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-500/20 flex items-center justify-center">
                    <Building2 size={36} className="text-blue-400" />
                  </div>
                  <div>
                    <div className="font-bold text-xl">Ir. Andries Broersma</div>
                    <div className="text-sm text-white/40">De "Vaderfactor"</div>
                  </div>
                </div>
                <ul className="space-y-3 text-sm text-white/60">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
                    Civiel ingenieur, 40 jaar ervaring constructieve veiligheid
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
                    Trekker digitaliseringsgolf jaren '80: rekenliniaal → computer
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
                    Bureau Broersma: 19.000+ projecten — bruggen tot complexe gebouwen
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
                    Reputatie: "Als Broersma het tekent, staat het."
                  </li>
                </ul>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/20 flex items-center justify-center">
                    <Cpu size={36} className="text-purple-400" />
                  </div>
                  <div>
                    <div className="font-bold text-xl">Martijn Broersma</div>
                    <div className="text-sm text-white/40">De "Zoonfactor"</div>
                  </div>
                </div>
                <ul className="space-y-3 text-sm text-white/60">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-purple-400 mt-0.5 flex-shrink-0" />
                    Voormalig COO LegalThings.io — pionier FSM-workflows
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-purple-400 mt-0.5 flex-shrink-0" />
                    Multi-partij juridische processen (justitie, notariaat)
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-purple-400 mt-0.5 flex-shrink-0" />
                    Visie: "Bouwen is een juridische workflow met stenen en tijdsdruk"
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-purple-400 mt-0.5 flex-shrink-0" />
                    10+ jaar ervaring in workflowtech en digitale transformatie
                  </li>
                </ul>
              </div>
            </AnimatedSection>
          </div>

          {/* Unfair advantage */}
          <AnimatedSection delay={300}>
            <div className="bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-500/20 rounded-3xl p-8">
              <h3 className="text-xl font-bold mb-6 text-center">Unique Unfair Advantage</h3>
              <p className="text-center text-white/60 max-w-2xl mx-auto mb-8">
                Waar andere bouwtech-startups óf uit de bouw óf uit de tech komen, 
                combineert OG/Homie <strong className="text-white">70 jaar deep engineering + 10+ jaar workflowtech</strong>.
              </p>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl mb-2">🏗️</div>
                  <div className="text-sm text-white/60">Wkb & bestemmingsplannen <strong className="text-white">juridisch/technisch correct</strong> vertalen naar software</div>
                </div>
                <div>
                  <div className="text-3xl mb-2">🤝</div>
                  <div className="text-sm text-white/60">Geloofwaardigheid bij <strong className="text-white">gemeenten, aannemers én verzekeraars</strong></div>
                </div>
                <div>
                  <div className="text-3xl mb-2">📚</div>
                  <div className="text-sm text-white/60">Toegang tot <strong className="text-white">19.000+ projecten</strong> als trainingsdata</div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Continue with remaining sections... */}
      {/* SECTION 6: BUSINESS MODEL */}
      <section id="business" className="py-32 relative">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <BarChart3 size={24} className="text-amber-400" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-amber-400 font-bold">Sectie 6</div>
                <h2 className="text-3xl md:text-4xl font-bold">Businessmodel</h2>
              </div>
            </div>
            {/* Business Model Images */}
            <div className="grid md:grid-cols-3 gap-4 mb-12">
              <div className="rounded-2xl overflow-hidden border border-amber-500/20">
                <img src="/generated/investor-pitch/business/business-demand-aggregation.png" alt="Demand Aggregation" className="w-full h-40 object-cover" />
                <div className="p-3 bg-amber-500/10"><span className="text-xs text-amber-400">Vraagaggregatie Heatmap</span></div>
              </div>
              <div className="rounded-2xl overflow-hidden border border-amber-500/20">
                <img src="/generated/investor-pitch/business/business-revenue-model.png" alt="Revenue Model" className="w-full h-40 object-cover" />
                <div className="p-3 bg-amber-500/10"><span className="text-xs text-amber-400">Revenue Streams</span></div>
              </div>
              <div className="rounded-2xl overflow-hidden border border-amber-500/20">
                <img src="/generated/investor-pitch/business/business-passport-product.png" alt="Bouwpaspoort" className="w-full h-40 object-cover" />
                <div className="p-3 bg-amber-500/10"><span className="text-xs text-amber-400">Bouwpaspoort als Asset</span></div>
              </div>
            </div>
          </AnimatedSection>

          {/* Demand aggregation */}
          <AnimatedSection delay={100}>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-8 mb-12">
              <h3 className="text-xl font-bold mb-4">Vraagaggregatie: "Kickstarter voor Grond"</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <div className="text-amber-400 font-bold mb-2">1. Heatmaps</div>
                  <p className="text-sm text-white/50">Elke pin op de kaart voedt een anonieme vraagkaart. 300-500 mensen = harde data.</p>
                </div>
                <div>
                  <div className="text-amber-400 font-bold mb-2">2. Pitch naar Gemeente</div>
                  <p className="text-sm text-white/50">Heatmap + profiel + programma. "Hier is vraag én een gecontroleerd proces."</p>
                </div>
                <div>
                  <div className="text-amber-400 font-bold mb-2">3. Van Plan naar Deal</div>
                  <p className="text-sm text-white/50">In ruil voor ambtelijke capaciteit: procesbeheersing via FSM, Wkb-proof uitvoering.</p>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Revenue model */}
          <AnimatedSection delay={200}>
            <h3 className="text-xl font-bold mb-6">Verdienmodel: "Ontwikkelaarsmarge met SaaS-marges"</h3>
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                <h4 className="font-bold text-blue-400 mb-4">B2C (OoitGedacht)</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/50">Gratis fase</span>
                    <span className="text-white">Visualisatie + Bouwpaspoort Light</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Betaalde fase</span>
                    <span className="text-white">Fee in aanneemsom (ontwikkelaarsfee)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Wkb-fee</span>
                    <span className="text-white">~€1.500 per woning</span>
                  </div>
                </div>
              </div>
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                <h4 className="font-bold text-amber-400 mb-4">B2B (Homie)</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/50">Per project</span>
                    <span className="text-white">€450 - €1.500+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Abonnement</span>
                    <span className="text-white">~€50/maand voor remote checks</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Verzekeraars</span>
                    <span className="text-white">Fee per polis/project</span>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Bouwpaspoort as product */}
          <AnimatedSection delay={300}>
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border border-blue-500/20 rounded-3xl p-8">
              <h3 className="text-xl font-bold mb-4">Het Bouwpaspoort als Product</h3>
              <p className="text-white/50 mb-6">
                Meer dan een rapport — een <strong className="text-white">verhandelbaar asset</strong> met 90 dagen geldigheid.
              </p>
              <div className="grid md:grid-cols-4 gap-4 text-sm">
                <div className="bg-[#030712]/50 rounded-xl p-4">
                  <div className="text-blue-400 font-bold mb-1">Document-ID</div>
                  <div className="text-white/40">OG-2025-NL-XXXX</div>
                </div>
                <div className="bg-[#030712]/50 rounded-xl p-4">
                  <div className="text-blue-400 font-bold mb-1">Ontwerp</div>
                  <div className="text-white/40">Kavel, massa, GBO/BVO</div>
                </div>
                <div className="bg-[#030712]/50 rounded-xl p-4">
                  <div className="text-blue-400 font-bold mb-1">Regulatoir</div>
                  <div className="text-white/40">Bestemmingsplan-check</div>
                </div>
                <div className="bg-[#030712]/50 rounded-xl p-4">
                  <div className="text-blue-400 font-bold mb-1">Financieel</div>
                  <div className="text-white/40">Kosten + maandlasten</div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* SECTION 7: ROADMAP */}
      <section id="roadmap" className="py-32 bg-[#0a1628]/30 relative">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Calendar size={24} className="text-purple-400" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-purple-400 font-bold">Sectie 7</div>
                <h2 className="text-3xl md:text-4xl font-bold">Roadmap (12 maanden)</h2>
              </div>
            </div>
            {/* Roadmap Visualization */}
            <div className="grid md:grid-cols-2 gap-4 mb-12">
              <div className="rounded-2xl overflow-hidden border border-purple-500/20">
                <img src="/generated/investor-pitch/roadmap/roadmap-timeline.png" alt="12 Month Timeline" className="w-full h-48 object-cover" />
                <div className="p-3 bg-purple-500/10"><span className="text-xs text-purple-400">Q1-Q4 Roadmap Timeline</span></div>
              </div>
              <div className="rounded-2xl overflow-hidden border border-purple-500/20">
                <img src="/generated/investor-pitch/roadmap/roadmap-mvp-vision.png" alt="MVP to Scale" className="w-full h-48 object-cover" />
                <div className="p-3 bg-purple-500/10"><span className="text-xs text-purple-400">Van MVP naar Scale</span></div>
              </div>
            </div>
          </AnimatedSection>

          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/50 via-blue-500/50 to-emerald-500/50" />
            
            {[
              { q: 'Q1', title: 'Tech-prototype', items: ['FSM-dashboard (web) voor 1 woningtype', 'Basis Vakman App', 'Smart glasses prototype'], side: 'left', color: 'purple' },
              { q: 'Q2', title: 'Broersma-logica digitaliseren', items: ['50-100 typische details uit archief', 'Fine-tuning Structureel Agent', 'Eerste Wkb-sjablonen'], side: 'right', color: 'blue' },
              { q: 'Q3', title: 'OG Wizard & demand aggregatie', items: ['Live gang van wizard', 'Heatmaps: 500+ pins in regio\'s', 'Bouwpaspoort-v1 als leadmagnet'], side: 'left', color: 'cyan' },
              { q: 'Q4', title: 'Eerste landdeal & Wkb-pilot', items: ['Pilotgemeente met heatmap + control-OS', 'Volledige stack: glasses, app, dashboard', 'Casestudy: faalkosten & doorlooptijd'], side: 'right', color: 'emerald' },
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 100}>
                <div className={`flex items-center gap-8 mb-12 ${item.side === 'right' ? 'md:flex-row-reverse' : ''}`}>
                  <div className={`flex-1 ${item.side === 'right' ? 'md:text-right' : ''}`}>
                    <div className={`inline-block px-3 py-1 bg-${item.color}-500/20 text-${item.color}-400 text-sm font-bold rounded-full mb-2`}>
                      {item.q}
                    </div>
                    <h3 className="font-bold text-xl mb-3">{item.title}</h3>
                    <ul className={`space-y-2 text-sm text-white/50 ${item.side === 'right' ? 'md:ml-auto' : ''}`}>
                      {item.items.map((li, j) => (
                        <li key={j} className={`flex items-center gap-2 ${item.side === 'right' ? 'md:flex-row-reverse' : ''}`}>
                          <span className={`w-1.5 h-1.5 bg-${item.color}-400 rounded-full`} />
                          {li}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className={`w-4 h-4 rounded-full bg-${item.color}-500 border-4 border-[#030712] z-10`} />
                  <div className="flex-1 hidden md:block" />
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8: INTERNATIONAL */}
      <section id="international" className="py-32 relative">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Globe size={24} className="text-emerald-400" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-emerald-400 font-bold">Sectie 8</div>
                <h2 className="text-3xl md:text-4xl font-bold">Internationale Kansen</h2>
              </div>
            </div>
            {/* International Expansion Images */}
            <div className="grid md:grid-cols-2 gap-4 mb-12">
              <div className="rounded-2xl overflow-hidden border border-emerald-500/20">
                <img src="/generated/investor-pitch/international/international-expansion-map.png" alt="Expansion Map" className="w-full h-48 object-cover" />
                <div className="p-3 bg-emerald-500/10"><span className="text-xs text-emerald-400">Internationale Expansie Kaart</span></div>
              </div>
              <div className="rounded-2xl overflow-hidden border border-emerald-500/20">
                <img src="/generated/investor-pitch/international/international-uk-opportunity.png" alt="UK Opportunity" className="w-full h-48 object-cover" />
                <div className="p-3 bg-emerald-500/10"><span className="text-xs text-emerald-400">UK Self-Build Market (9.2/10)</span></div>
              </div>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6">
            <AnimatedSection delay={100}>
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 h-full">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl">🇬🇧</span>
                  <span className="text-emerald-400 font-bold">9.2/10</span>
                </div>
                <h3 className="font-bold text-lg mb-2">Verenigd Koninkrijk</h3>
                <p className="text-sm text-white/50 mb-4">
                  "Grand Designs paradox" — enorme fascinatie maar slechts 8% zelfbouw.
                  Self-build Act (2015) worstelt met uitvoering.
                </p>
                <div className="text-xs text-emerald-400">FSM-gestuurde "Guaranteed Planning Pass"</div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 h-full">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl">🇩🇪</span>
                  <span className="text-blue-400 font-bold">Secundair</span>
                </div>
                <h3 className="font-bold text-lg mb-2">Duitsland</h3>
                <p className="text-sm text-white/50 mb-4">
                  Sterke "Baugruppe"-cultuur: 10-20 gezinnen die samen bouwen.
                  DIN-normen passen bij Broersma-DNA.
                </p>
                <div className="text-xs text-blue-400">Neutrale arbiter voor multi-partij bouwgroepen</div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={300}>
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 h-full">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl">🇺🇸</span>
                  <span className="text-amber-400 font-bold">Niche</span>
                </div>
                <h3 className="font-bold text-lg mb-2">Californië</h3>
                <p className="text-sm text-white/50 mb-4">
                  ADU-boom door SB 9. Arbeidskosten &gt;$100/uur.
                  Efficiëntie = directe grote besparing.
                </p>
                <div className="text-xs text-amber-400">Prefab-configuraties met sterke compliance</div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* SECTION 9: THE ASK */}
      <section id="ask" className="py-32 bg-gradient-to-b from-[#0a1628]/50 to-[#030712] relative overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img src="/generated/investor-pitch/ask/ask-future-vision.png" alt="" className="w-full h-full object-cover opacity-[0.15]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/80 to-[#030712]/60" />
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <AnimatedSection>
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                <Rocket size={24} className="text-red-400" />
              </div>
            </div>
            <div className="text-xs uppercase tracking-widest text-red-400 font-bold mb-4">Sectie 9</div>
            <h2 className="text-4xl md:text-5xl font-bold mb-8">The Ask</h2>
            {/* The Ask Images */}
            <div className="grid md:grid-cols-2 gap-4 mb-12 text-left">
              <div className="rounded-2xl overflow-hidden border border-red-500/20">
                <img src="/generated/investor-pitch/ask/ask-partnership.png" alt="Partnership" className="w-full h-40 object-cover" />
                <div className="p-3 bg-red-500/10"><span className="text-xs text-red-400">Strategisch Partnership</span></div>
              </div>
              <div className="rounded-2xl overflow-hidden border border-red-500/20">
                <img src="/generated/investor-pitch/ask/ask-three-pillars.png" alt="Three Pillars" className="w-full h-40 object-cover" />
                <div className="p-3 bg-red-500/10"><span className="text-xs text-red-400">Kapitaal + Autoriteit + Data</span></div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={100}>
            <div className="bg-gradient-to-br from-red-500/10 via-amber-500/5 to-transparent border border-red-500/20 rounded-3xl p-8 md:p-12 mb-12">
              <h3 className="text-2xl font-bold mb-8">Aan Bureau Broersma (Andries)</h3>
              
              <div className="grid md:grid-cols-3 gap-8 text-left mb-8">
                <div>
                  <div className="text-amber-400 font-bold mb-2 flex items-center gap-2">
                    <span className="text-xl">💰</span> Kapitaal
                  </div>
                  <p className="text-sm text-white/50">
                    Seed-investering voor FSM-engine, Homie-dashboard, bouwbril-MVP, 2-3 pilots (12-18 maanden runway)
                  </p>
                </div>
                <div>
                  <div className="text-amber-400 font-bold mb-2 flex items-center gap-2">
                    <span className="text-xl">🏆</span> Autoriteit
                  </div>
                  <p className="text-sm text-white/50">
                    Exclusief partnerschap: gebruik naam "Bureau Broersma" als kwaliteitslabel. Ingenieurs voor validaties.
                  </p>
                </div>
                <div>
                  <div className="text-amber-400 font-bold mb-2 flex items-center gap-2">
                    <span className="text-xl">📊</span> Data
                  </div>
                  <p className="text-sm text-white/50">
                    Toegang tot ±19.000 historische projecten voor training "Broersma Agent" en faalpatronen.
                  </p>
                </div>
              </div>

              <div className="border-t border-white/10 pt-8">
                <h4 className="font-bold mb-4">12-maands Plan in Kwartalen</h4>
                <div className="grid grid-cols-4 gap-4 text-xs">
                  <div className="bg-[#030712]/50 rounded-lg p-3">
                    <div className="text-purple-400 font-bold">Q1</div>
                    <div className="text-white/40">FSM + Homie MVP, Bril prototype</div>
                  </div>
                  <div className="bg-[#030712]/50 rounded-lg p-3">
                    <div className="text-blue-400 font-bold">Q2</div>
                    <div className="text-white/40">Broersma-logica codificatie, Wkb-pilot</div>
                  </div>
                  <div className="bg-[#030712]/50 rounded-lg p-3">
                    <div className="text-cyan-400 font-bold">Q3</div>
                    <div className="text-white/40">OG-wizard live, 500+ gebruikers, gemeente-gesprekken</div>
                  </div>
                  <div className="bg-[#030712]/50 rounded-lg p-3">
                    <div className="text-emerald-400 font-bold">Q4</div>
                    <div className="text-white/40">Eerste landdeal, sluitende casestudy</div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <button 
              onClick={() => setAppState(AppState.WIZARD_HOUSEHOLD)}
              className="group bg-white text-[#030712] px-10 py-5 text-lg font-bold rounded-full hover:bg-white/90 transition-all shadow-2xl shadow-white/10 inline-flex items-center gap-3 mb-6"
            >
              Bekijk de Demo
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-white/30 text-sm">
              Strategisch Projectdossier • November 2025 • Versie 1.0
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/generated/og-logo.png" alt="" className="h-5 brightness-0 invert opacity-30" />
            <span className="text-xs text-white/20">× Homie × Bureau Broersma</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-white/30">
            <span>Confidential</span>
            <span>•</span>
            <span>November 2025</span>
            <span>•</span>
            <button onClick={() => setAppState(AppState.LANDING)} className="hover:text-white transition-colors">
              Terug naar home
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

