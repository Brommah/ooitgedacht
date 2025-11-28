import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ArrowRight, ArrowDown, ShieldCheck, Hammer, XCircle, CheckCircle2, ChevronDown, FileText, Leaf, Zap, Shield, BarChart3, AlertTriangle, ChevronRight, Mail, Star, Quote, Plus, Minus, Eye, Clock, Lock, Users, RefreshCw, FileCheck, Sparkles, Home } from 'lucide-react';
import { AppState } from '../types';

const BROERSMA_LOGO = "https://www.bureau-broersma.nl/wp-content/uploads/2015/09/logo-broersma-bouwadvies.png";

// Dark blue grid pattern styles
const darkBluePattern = {
  background: 'linear-gradient(to bottom right, #0a1628, #0d1f3c)',
  backgroundImage: `
    linear-gradient(to bottom right, #0a1628, #0d1f3c),
    linear-gradient(rgba(30, 58, 95, 0.3) 1px, transparent 1px),
    linear-gradient(90deg, rgba(30, 58, 95, 0.3) 1px, transparent 1px)
  `,
  backgroundSize: '100% 100%, 60px 60px, 60px 60px',
};

interface HeroProps {
  setAppState: (state: AppState) => void;
}

// Intersection Observer hook for entrance animations
const useInView = (threshold = 0.1) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
};

// Animated section wrapper
const AnimatedSection: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ 
  children, 
  className = '',
  delay = 0 
}) => {
  const { ref, isInView } = useInView();
  
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${className}`}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(30px)',
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
};

// FAQ Accordion Item
const FAQItem: React.FC<{ question: string; answer: string; isOpen: boolean; onToggle: () => void }> = ({
  question,
  answer,
  isOpen,
  onToggle
}) => (
  <div className="border-b border-blue-500/20">
    <button
      onClick={onToggle}
      className="w-full py-6 flex items-center justify-between text-left hover:bg-blue-500/5 transition-colors px-2 -mx-2 rounded-lg"
    >
      <span className="font-medium text-white pr-8">{question}</span>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-all ${isOpen ? 'bg-blue-400 border-blue-400' : 'border-blue-500/30'}`}>
        {isOpen ? <Minus size={14} className="text-[#0a1628]" /> : <Plus size={14} className="text-blue-400" />}
      </div>
    </button>
    <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-6' : 'max-h-0'}`}>
      <p className="text-blue-200/60 font-light leading-relaxed px-2">{answer}</p>
    </div>
  </div>
);

export const Hero: React.FC<HeroProps> = ({ setAppState }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);
  const [email, setEmail] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sticky header on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Memoized dots for State of Market banner (fixes random re-render issue)
  const marketDots = useMemo(() => 
    [...Array(15)].map((_, i) => ({
      left: `${10 + Math.random() * 80}%`,
      top: `${10 + Math.random() * 80}%`,
      delay: `${Math.random() * 2}s`
    })), []
  );

  const faqs = [
    {
      question: "Wat kost het om te starten?",
      answer: "Het eerste ontwerp en je Housing Passport zijn volledig gratis. Je betaalt pas wanneer je besluit door te gaan met de bouw. Geen verborgen kosten, geen verplichtingen."
    },
    {
      question: "Hoe lang duurt het hele traject van ontwerp tot sleutel?",
      answer: "Gemiddeld 10-14 maanden van eerste ontwerp tot oplevering. Dit is significant sneller dan traditioneel bouwen (18-24 maanden) dankzij onze pre-gevalideerde processen en gestroomlijnde vergunningsaanvraag."
    },
    {
      question: "Werkt dit ook als ik nog geen kavel heb?",
      answer: "Jazeker! Je kunt alvast je droomhuis ontwerpen en wij helpen je met onze Kavelzoeker om de perfecte locatie te vinden die past bij jouw ontwerp en budget."
    },
    {
      question: "Is dit voor particulieren of ook projectontwikkelaars?",
      answer: "Beide. Particulieren gebruiken ons platform voor hun droomhuis, terwijl ontwikkelaars profiteren van onze schaalbare workflows en gevalideerde processen voor meerdere projecten tegelijk."
    },
    {
      question: "Wat als mijn ontwerp niet past binnen het bestemmingsplan?",
      answer: "Ons systeem checkt dit automatisch voordat je tijd investeert. We geven direct feedback over wat wel en niet mogelijk is, inclusief suggesties voor aanpassingen die wél binnen de regels vallen."
    }
  ];

  return (
    <div className="bg-[#0a1628] w-full text-white">
      {/* 1. HERO SECTION */}
      <div className="relative h-screen flex flex-col">
        
        {/* Background Image - Full bleed */}
        <div className="absolute inset-0">
          <img 
            src="/generated/hero-new.jpg" 
            alt="CLT houtbouw in de polder" 
            className="w-full h-full object-cover"
            style={{ transform: 'scaleX(-1)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        </div>

        {/* Navigation - Premium, floating glassmorphism design */}
        <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled ? 'py-2 md:py-3' : 'py-3 md:py-5'}`}>
          <div className={`max-w-[1400px] mx-auto px-4 md:px-8 transition-all duration-500 ${isScrolled ? '' : ''}`}>
            <div className={`relative flex items-center justify-between px-4 md:px-8 py-2.5 md:py-4 rounded-xl md:rounded-2xl transition-all duration-500 ${
              isScrolled 
                ? 'bg-[#0a1628]/95 backdrop-blur-xl shadow-2xl shadow-[#0a1628]/40 border border-[#1e3a5f]/30' 
                : 'bg-white/[0.03] backdrop-blur-md border border-white/[0.06]'
            }`}>
              {/* Logo */}
              <a href="#" className="relative group z-10">
                <img 
                  src="/generated/og-logo.png" 
                  alt="OoitGedacht" 
                  className="h-8 md:h-10 brightness-0 invert transition-transform duration-300 group-hover:scale-105" 
                />
                <div className="absolute -inset-2 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
              </a>
              
              {/* Desktop Navigation Links - CENTERED */}
              <div className="hidden lg:flex items-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="flex items-center bg-white/[0.04] rounded-full px-2 py-1.5 border border-white/[0.06]">
                  <button 
                    onClick={() => {
                      const el = document.getElementById('how-it-works');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="relative px-5 py-2 text-[13px] text-white/70 hover:text-white transition-all duration-300 rounded-full hover:bg-white/[0.08] group"
                  >
                    <span className="relative z-10">Hoe het werkt</span>
                  </button>
                  <button 
                    onClick={() => {
                      const el = document.getElementById('passport-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="relative px-5 py-2 text-[13px] text-white/70 hover:text-white transition-all duration-300 rounded-full hover:bg-white/[0.08] group"
                  >
                    <span className="relative z-10">Paspoort</span>
                  </button>
                  <button 
                    onClick={() => setAppState(AppState.STATE_OF_MARKET)}
                    className="relative px-5 py-2 text-[13px] text-white/70 hover:text-white transition-all duration-300 rounded-full hover:bg-white/[0.08] group"
                  >
                    <span className="relative z-10 flex items-center gap-1.5">
                      <BarChart3 size={14} />
                      Markt
            </span>
            </button>
                </div>
              </div>

              {/* Right Section: CTA + Mobile Menu */}
              <div className="flex items-center gap-3 z-10">
                {/* Desktop CTA */}
                <button 
                  onClick={() => setAppState(AppState.WIZARD_HOUSEHOLD)}
                  className="hidden md:flex items-center gap-2 bg-gradient-to-r from-[#1e3a5f] to-[#0d1f3c] text-white px-6 py-2.5 text-[13px] font-semibold hover:from-[#2a4a73] hover:to-[#1e3a5f] transition-all duration-300 rounded-full shadow-lg shadow-[#0a1628]/40 hover:shadow-[#1e3a5f]/50 hover:scale-[1.02] active:scale-[0.98] border border-[#2a4a73]/30"
                >
                  <Zap size={14} className="animate-pulse" />
                  Start Ontwerp
                </button>

                {/* Mobile Menu Button */}
                <button 
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden flex items-center justify-center w-11 h-11 rounded-2xl bg-white/[0.08] border border-white/[0.15] hover:bg-white/[0.15] transition-all duration-300 backdrop-blur-sm"
                >
                  <div className="relative w-5 h-5 flex flex-col items-center justify-center">
                    <span className={`absolute w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${mobileMenuOpen ? 'rotate-45' : '-translate-y-1.5'}`} />
                    <span className={`absolute w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
                    <span className={`absolute w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${mobileMenuOpen ? '-rotate-45' : 'translate-y-1.5'}`} />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile Menu - Full Screen Glassmorphic Overlay */}
        <div 
          className={`fixed inset-0 z-[100] lg:hidden transition-all duration-500 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        >
          {/* Backdrop blur */}
          <div 
            className="absolute inset-0 bg-[#030712]/60 backdrop-blur-2xl"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Gradient overlays for depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-cyan-500/5 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.1),transparent_50%)] pointer-events-none" />
          
          {/* Animated grid pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }} />
          
          {/* Menu Content */}
          <div className={`relative h-full flex flex-col px-6 pt-24 pb-8 transition-all duration-500 delay-100 ${mobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
            
            {/* Close button in top right */}
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-6 right-6 w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center hover:bg-white/[0.1] transition-all"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-white/70">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            
            {/* Logo */}
            <div className="mb-12">
              <span className="text-2xl font-bold text-white tracking-tight">
                Ooit<span className="text-emerald-400">Gedacht</span>
              </span>
            </div>
            
            {/* Navigation Links */}
            <nav className="flex-1">
              <ul className="space-y-2">
                {[
                  { 
                    icon: <Zap size={22} />, 
                    label: 'Hoe het werkt', 
                    sublabel: 'Van idee tot sleutel',
                    color: 'from-blue-400 to-cyan-400',
                    onClick: () => {
                      const el = document.getElementById('how-it-works');
                      el?.scrollIntoView({ behavior: 'smooth' });
                      setMobileMenuOpen(false);
                    }
                  },
                  { 
                    icon: <FileText size={22} />, 
                    label: 'Woningpaspoort', 
                    sublabel: 'Volledige documentatie',
                    color: 'from-emerald-400 to-teal-400',
                    onClick: () => {
                      const el = document.getElementById('passport-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                      setMobileMenuOpen(false);
                    }
                  },
                  { 
                    icon: <BarChart3 size={22} />, 
                    label: 'Markt Analyse', 
                    sublabel: 'Actuele marktdata',
                    color: 'from-amber-400 to-orange-400',
                    onClick: () => {
                      setAppState(AppState.STATE_OF_MARKET);
                      setMobileMenuOpen(false);
                    }
                  },
                ].map((item, i) => (
                  <li key={i}>
                    <button 
                      onClick={item.onClick}
                      className="group w-full flex items-center gap-5 p-5 rounded-3xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-300"
                      style={{ transitionDelay: `${i * 50}ms` }}
                    >
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} p-[1px]`}>
                        <div className="w-full h-full rounded-2xl bg-[#0a0f1a] flex items-center justify-center text-white/80 group-hover:text-white transition-colors">
                          {item.icon}
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="text-lg font-semibold text-white/90 group-hover:text-white transition-colors">{item.label}</p>
                        <p className="text-sm text-white/40 group-hover:text-white/60 transition-colors">{item.sublabel}</p>
                      </div>
                      <ChevronRight size={20} className="ml-auto text-white/20 group-hover:text-white/50 group-hover:translate-x-1 transition-all" />
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
            
            {/* Bottom CTA */}
            <div className="mt-auto space-y-4">
              <button 
                onClick={() => {
                  setAppState(AppState.WIZARD_HOUSEHOLD);
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-5 text-lg font-semibold rounded-2xl shadow-2xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                <Sparkles size={22} />
                Start je droomhuis
              </button>
              
              <p className="text-center text-white/30 text-sm">
                Gratis • Geen account nodig
              </p>
            </div>
          </div>
        </div>

        {/* Hero Content - Below navbar with proper spacing */}
        <div className="relative z-10 flex-1 flex items-start md:items-center max-w-[1400px] mx-auto px-5 md:px-12 w-full mt-[140px] sm:mt-[120px] md:mt-28">
          <div className="max-w-2xl">
            <h1 className="text-[2.25rem] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-medium text-white leading-[1.05] tracking-[-0.03em] mb-6 md:mb-8">
              {/* Line 1: OoitGedacht */}
              <span className="block">
                <span className="relative inline-block font-semibold">
                  OoitGedacht
                  <svg className="absolute -bottom-1 md:-bottom-2 left-0 w-full h-2 md:h-3 text-white/40" viewBox="0 0 200 12" preserveAspectRatio="none">
                    <path d="M0,6.4 L4,6.2 L196,6.3 L200,6.5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </span>
              {/* Line 2: dat je een huis */}
              <span className="block font-light">
                dat je een huis
              </span>
              {/* Line 3: Kon Toveren (blue gradient) */}
              <span className="block">
                <span className="relative inline-block whitespace-nowrap">
                  <span className="font-semibold bg-gradient-to-r from-[#60a5fa] via-[#3b82f6] to-[#2563eb] bg-clip-text text-transparent">Kon Toveren</span>
                  <span className="relative">
                    {/* Elegant sparkles - all blue */}
                    <span className="absolute -top-4 -right-2 md:-top-6 md:-right-3 text-[#60a5fa] text-2xl md:text-3xl animate-pulse">✦</span>
                    <span className="absolute -top-8 right-4 md:-top-12 md:right-6 text-[#3b82f6] text-lg md:text-xl opacity-70" style={{animationDelay: '0.5s'}}>✧</span>
                    <span className="absolute -top-2 -right-8 md:-top-3 md:-right-12 text-[#2563eb] text-sm md:text-base opacity-50" style={{animationDelay: '1s'}}>✦</span>
                  </span>
                  <svg className="absolute -bottom-1 md:-bottom-2 left-0 w-full h-2 md:h-3" viewBox="0 0 200 12" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="underlineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#60a5fa"/>
                        <stop offset="50%" stopColor="#3b82f6"/>
                        <stop offset="100%" stopColor="#2563eb"/>
                      </linearGradient>
                    </defs>
                    <path d="M0,6.5 L3,6.3 L197,6.1 L200,6.3" stroke="url(#underlineGradient)" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </span>
          </h1>
          
            <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-10 font-light max-w-lg">
              Wij maken het proces en de kosten voor je <strong className="text-white font-medium">inzichtelijk</strong> en <strong className="text-white font-medium">transparant</strong> — precies op jouw situatie toegepast.
          </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <button 
                onClick={() => setAppState(AppState.WIZARD_HOUSEHOLD)}
                className="group bg-gradient-to-r from-[#1e3a5f] to-[#0d1f3c] text-white px-8 py-4 text-base font-medium hover:from-[#2a4a73] hover:to-[#1e3a5f] transition-all flex items-center justify-center gap-3 rounded-full shadow-lg shadow-[#0a1628]/40 border border-[#2a4a73]/30"
              >
                Ontdek je mogelijkheden
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => {
                  const element = document.getElementById('how-it-works');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-white/60 hover:text-white px-6 py-4 text-base transition-colors flex items-center justify-center gap-2"
              >
                Hoe werkt het?
            </button>
            </div>
            
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/50">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-[#5b8ac7]" />
                Gratis starten
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-[#5b8ac7]" />
                Binnen 5 minuten je eerste ontwerp
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-[#5b8ac7]" />
                Gevalideerd door experts
              </span>
            </div>
          </div>
        </div>

        {/* Partner bar - AT THE BOTTOM OF HERO */}
        <div className="relative z-40 border-t border-white/10 bg-gradient-to-t from-black/40 to-transparent">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-5 flex items-center justify-center gap-5">
            <span className="text-[11px] uppercase tracking-[0.2em] text-white/40 font-medium">In samenwerking met</span>
            <div className="w-px h-4 bg-white/20" />
            <a href="https://www.bureau-broersma.nl" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 hover:opacity-100 transition-opacity">
              <img src={BROERSMA_LOGO} alt="Bureau Broersma" className="h-7 md:h-8 brightness-0 invert opacity-60 group-hover:opacity-90 transition-opacity" />
            </a>
          </div>
        </div>
      </div>

      {/* 2. DIT IS WAT JE KRIJGT - Result Showcase */}
      <div id="result-showcase" className="bg-[#0a1628] py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-6">
          
          {/* Header */}
          <AnimatedSection className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-semibold text-white tracking-[-0.02em] mb-4">
              Dit is wat je krijgt.
            </h2>
            <p className="text-white/50 font-light max-w-xl mx-auto text-base md:text-lg">
              Een volledig gevalideerd ontwerp met realistische kosten en specificaties.
            </p>
          </AnimatedSection>

          {/* Clean Image Display */}
          <AnimatedSection delay={100} className="mb-12 md:mb-16">
            <div className="rounded-2xl overflow-hidden">
              <img 
                src="/generated/result-showcase.png" 
                alt="Voorbeeld woningontwerp"
                className="w-full h-auto"
              />
            </div>
          </AnimatedSection>

          {/* Simple CTA */}
          <AnimatedSection delay={200} className="text-center">
            <button 
              onClick={() => setAppState(AppState.WIZARD_HOUSEHOLD)}
              className="inline-flex items-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-4 text-base font-semibold rounded-full transition-all duration-200"
            >
              Start jouw ontwerp
              <ArrowRight size={18} />
            </button>
            <p className="text-white/40 text-sm mt-4">
              Gratis • 3 minuten • Geen account nodig
            </p>
          </AnimatedSection>
        </div>
      </div>

      {/* 3. DASHBOARD WORKFLOW PREVIEW - Jouw Construction OS */}
      <div className="bg-[#0d1f3c] py-24 md:py-32 px-6 relative overflow-hidden">
          {/* Tinted background image */}
          <div className="absolute inset-0">
            <img 
              src="/generated/polder-dak-gevel.png" 
              alt="" 
              className="w-full h-full object-cover opacity-[0.05]"
            />
        </div>
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-[0.07]" style={{
            backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />
          
          <div className="max-w-5xl mx-auto relative z-10">
             <AnimatedSection className="text-center mb-12 md:mb-16">
               <h2 className="text-3xl md:text-5xl font-semibold leading-tight mb-4 text-white tracking-[-0.02em]">
                   Jouw Construction OS
               </h2>
               <div className="text-lg md:text-xl text-blue-200/60 font-light leading-relaxed max-w-2xl mx-auto">
                   <p>Volg elke fase van je bouwproject in realtime.</p>
                   <p>Transparant, gevalideerd en volledig onder controle.</p>
      </div>
             </AnimatedSection>
             
             {/* Dashboard Preview Card */}
             <AnimatedSection delay={100} className="bg-blue-500/10 backdrop-blur-sm border border-blue-500/20 rounded-2xl overflow-hidden max-w-3xl mx-auto">
                {/* Mini header */}
                <div className="text-white px-6 py-4 flex justify-between items-center bg-blue-500/10 border-b border-blue-500/20">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse" />
                        <span className="text-sm font-medium text-blue-100">Project Veluwse Heide</span>
                    </div>
                    <div className="text-xs text-blue-300/60 font-mono">35% Voltooid</div>
                </div>
                
                {/* Workflow Timeline Preview */}
                <div className="p-8 space-y-0 relative">
                   <div className="absolute left-[35px] top-8 bottom-8 w-[1px] bg-blue-500/20" />
                   
                   {/* Step 1 - Done */}
                   <div className="flex gap-4 items-start py-4 relative z-10">
                      <div className="w-6 h-6 rounded-full border-2 border-blue-400 bg-blue-400 flex items-center justify-center">
                          <CheckCircle2 size={12} className="text-[#0a1628]" />
                      </div>
                 <div>
                          <div className="text-sm font-medium text-blue-100">Grondonderzoek & Sondering</div>
                          <div className="text-xs text-blue-300/50 mt-1 font-light">Gevalideerd door Bureau Broersma</div>
                      </div>
                  </div>

                   {/* Step 2 - Done */}
                   <div className="flex gap-4 items-start py-4 relative z-10">
                      <div className="w-6 h-6 rounded-full border-2 border-blue-400 bg-blue-400 flex items-center justify-center">
                          <CheckCircle2 size={12} className="text-[#0a1628]" />
                      </div>
                 <div>
                          <div className="text-sm font-medium text-blue-100">Wapeningskeuring</div>
                          <div className="text-xs text-blue-300/50 mt-1 font-light">Foto upload geverifieerd • Betaling vrijgegeven</div>
                        </div>
                   </div>
                   
                   {/* Step 3 - Active */}
                   <div className="flex gap-4 items-start py-4 relative z-10">
                      <div className="w-6 h-6 rounded-full border-2 border-blue-400 bg-blue-500/20 flex items-center justify-center">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                 </div>
                 <div>
                          <div className="text-sm font-medium text-blue-100">Storten Fundering</div>
                          <div className="text-xs text-blue-300/50 mt-1 font-light">Wacht op: Betonstort Logboek Upload</div>
                      </div>
                  </div>

                   {/* Step 4 - Locked */}
                   <div className="flex gap-4 items-start py-4 relative z-10">
                      <div className="w-6 h-6 rounded-full border-2 border-blue-500/30 bg-blue-500/5 flex items-center justify-center" />
                      <div>
                          <div className="text-sm font-medium text-blue-400/40">Casco Opbouw</div>
                          <div className="text-xs text-blue-400/30 mt-1 font-light">Start pas na uitharding validatie</div>
              </div>
          </div>
      </div>

                {/* Bottom action bar */}
                <div className="bg-blue-500/5 px-6 py-4 border-t border-blue-500/20 flex justify-between items-center">
                    <div className="text-xs text-blue-300/50">Laatste update: Vandaag, 09:41</div>
                    <button className="flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors">
                        Open Dashboard <ArrowRight size={12} />
                    </button>
             </div>
             </AnimatedSection>
             
             {/* Powered by Broersma + CTA */}
             <AnimatedSection delay={200} className="flex flex-col items-center justify-center mt-12 md:mt-16 gap-6">
                 <div className="flex flex-col items-center gap-4">
                 <span className="text-[10px] font-bold uppercase tracking-widest text-blue-300/50">Powered by</span>
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
                 <button 
                   onClick={() => setAppState(AppState.WIZARD_HOUSEHOLD)}
                   className="group bg-blue-400 text-[#0a1628] px-8 py-4 text-lg font-semibold hover:bg-blue-300 transition-all flex items-center justify-center gap-3 rounded-full shadow-lg shadow-blue-500/30"
                 >
                   Start je droomhuis ontwerp
                   <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                 </button>
             </AnimatedSection>
          </div>
      </div>

      {/* 4. HOUSING PASSPORT SECTION - Provenance & Authenticity */}
      <div id="passport-section" className="bg-[#0a1628] py-24 md:py-32 px-6 border-b border-blue-500/10 relative overflow-hidden">
          {/* Tinted background image */}
          <div className="absolute inset-0">
            <img 
              src="/generated/blueprint-wood-house.png" 
              alt="" 
              className="w-full h-full object-cover opacity-[0.03]"
            />
          </div>
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.05]" style={{
            backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />
          <div className="max-w-7xl mx-auto relative z-10">
              
              {/* Section Header */}
              <AnimatedSection className="text-center mb-16 md:mb-20">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-xs font-bold uppercase tracking-[0.2em] mb-6 text-blue-300">
                      <Shield size={12} /> Certificaat van Authenticiteit
                  </div>
                  <h2 className="text-4xl md:text-6xl font-semibold leading-tight mb-6 text-white tracking-[-0.02em]">
                      Het Housing Passport
             </h2>
                  <div className="text-lg md:text-xl text-blue-200/60 max-w-2xl mx-auto font-light">
                      <p>Elk ontwerp krijgt een uniek, geverifieerd document</p>
                      <p>met volledige traceerbaarheid van idee tot vergunning.</p>
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
                      
                      {/* Document Header */}
                      <div className="text-white px-6 md:px-10 py-6 md:py-8" style={darkBluePattern}>
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                              <div className="flex items-center gap-4 md:gap-6">
                                  <div className="w-14 h-14 md:w-16 md:h-16 border-2 border-white/20 flex items-center justify-center">
                                      <FileText size={28} className="text-white" strokeWidth={1} />
                                  </div>
                 <div>
                                      <div className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-1">Ooit Gedacht × Bureau Broersma</div>
                                      <div className="text-xl md:text-2xl font-medium tracking-[-0.01em]">Housing Passport</div>
                 </div>
                              </div>
                              <div className="text-left md:text-right">
                                  <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-1">Document ID</div>
                                  <div className="font-mono text-sm md:text-base tracking-wider">OG-2024-NL-0847</div>
                              </div>
                              </div>
                          </div>
                          
                      {/* Document Body */}
                      <div className="px-6 md:px-10 py-8 md:py-10">
                          
                          {/* Project Summary Bar */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 pb-8 mb-8 border-b border-blue-500/10">
                 <div>
                                  <div className="text-[9px] uppercase tracking-[0.2em] text-blue-300/50 mb-1">Totale Bouwkosten</div>
                                  <div className="font-mono text-xl md:text-2xl font-medium text-white">€485.000</div>
                                  <div className="text-[10px] text-blue-300/40 mt-0.5">excl. BTW & grond</div>
                 </div>
                 <div>
                                  <div className="text-[9px] uppercase tracking-[0.2em] text-blue-300/50 mb-1">Energielabel</div>
                                  <div className="font-mono text-xl md:text-2xl font-medium text-blue-400">A++++</div>
                                  <div className="text-[10px] text-blue-300/40 mt-0.5">BENG-proof</div>
                 </div>
                 <div>
                                  <div className="text-[9px] uppercase tracking-[0.2em] text-blue-300/50 mb-1">Bouwtijd</div>
                                  <div className="font-mono text-xl md:text-2xl font-medium text-white">8 mnd</div>
                                  <div className="text-[10px] text-blue-300/40 mt-0.5">vanaf start bouw</div>
                 </div>
                              <div>
                                  <div className="text-[9px] uppercase tracking-[0.2em] text-blue-300/50 mb-1">MPG Score</div>
                                  <div className="font-mono text-xl md:text-2xl font-medium text-white">0.48</div>
                                  <div className="text-[10px] text-blue-300/40 mt-0.5">norm: &lt;0.8</div>
             </div>
          </div>
                          
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
                                                  <span className="font-medium text-white text-sm md:text-base">Passport Afgegeven</span>
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
                  </AnimatedSection>
              
              {/* Bottom Trust Indicators */}
              <AnimatedSection delay={200} className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                  <div className="group text-center">
                      <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-5 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center group-hover:border-blue-400/40 transition-all duration-300">
                          <svg width="40" height="40" viewBox="0 0 48 48" fill="none" className="md:w-12 md:h-12 text-blue-400 group-hover:scale-110 transition-transform duration-300">
                            <rect x="12" y="20" width="24" height="20" rx="3" stroke="currentColor" strokeWidth="2" fill="none"/>
                            <path d="M16 20V14C16 9.58172 19.5817 6 24 6C28.4183 6 32 9.58172 32 14V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            <circle cx="24" cy="30" r="3" fill="currentColor"/>
                            <path d="M24 33V36" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
              </div>
                      <div className="text-sm md:text-base font-medium text-white mb-1.5">Veilig & Transparant</div>
                      <div className="text-xs md:text-sm text-blue-200/50 font-light">Elke wijziging wordt gelogd</div>
                  </div>
                  <div className="group text-center">
                      <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-5 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center group-hover:border-blue-400/40 transition-all duration-300">
                          <svg width="40" height="40" viewBox="0 0 48 48" fill="none" className="md:w-12 md:h-12 text-blue-400 group-hover:scale-110 transition-transform duration-300">
                            <circle cx="18" cy="16" r="6" stroke="currentColor" strokeWidth="2" fill="none"/>
                            <circle cx="30" cy="16" r="6" stroke="currentColor" strokeWidth="2" fill="none"/>
                            <path d="M6 38C6 32.4772 10.4772 28 16 28H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M28 28H32C37.5228 28 42 32.4772 42 38" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M24 28V42" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M20 34L24 38L28 34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                      </div>
                      <div className="text-sm md:text-base font-medium text-white mb-1.5">Expert Gevalideerd</div>
                      <div className="text-xs md:text-sm text-blue-200/50 font-light">Door erkende constructeurs</div>
                  </div>
                  <div className="group text-center">
                      <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-5 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center group-hover:border-blue-400/40 transition-all duration-300">
                          <svg width="40" height="40" viewBox="0 0 48 48" fill="none" className="md:w-12 md:h-12 text-blue-400 group-hover:scale-110 transition-transform duration-300">
                            <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="2" fill="none"/>
                            <path d="M24 12V24L32 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M38 8L42 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M40 10L44 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            <circle cx="24" cy="24" r="3" fill="currentColor"/>
                          </svg>
                      </div>
                      <div className="text-sm md:text-base font-medium text-white mb-1.5">Actuele Data</div>
                      <div className="text-xs md:text-sm text-blue-200/50 font-light">Prijzen van vandaag</div>
                  </div>
                  <div className="group text-center">
                      <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-5 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center group-hover:border-blue-400/40 transition-all duration-300">
                          <svg width="40" height="40" viewBox="0 0 48 48" fill="none" className="md:w-12 md:h-12 text-blue-400 group-hover:scale-110 transition-transform duration-300">
                            <rect x="8" y="6" width="32" height="36" rx="3" stroke="currentColor" strokeWidth="2" fill="none"/>
                            <path d="M14 14H26" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M14 22H34" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M14 30H34" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M30 6V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            <circle cx="34" cy="36" r="8" fill="#0a1628" stroke="currentColor" strokeWidth="2"/>
                            <path d="M31 36L33 38L37 34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                      </div>
                      <div className="text-sm md:text-base font-medium text-white mb-1.5">Vergunningsklaar</div>
                      <div className="text-xs md:text-sm text-blue-200/50 font-light">Direct bruikbaar dossier</div>
                  </div>
              </AnimatedSection>

              {/* CTA Section */}
              <AnimatedSection delay={300} className="mt-16 md:mt-20 flex flex-col items-center text-center">
                  <p className="text-blue-200/60 text-sm md:text-base mb-6 max-w-md font-light">
                      Klaar om jouw droomhuis te ontwerpen?
                  </p>
                  <button 
                      onClick={() => setAppState(AppState.WIZARD_HOUSEHOLD)}
                      className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-400 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-400/40 hover:scale-105"
                  >
                      <span className="flex items-center gap-3">
                          Start Gratis Configuratie
                          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                  </button>
                  <p className="text-blue-200/40 text-xs mt-4">
                      Geen account nodig • 3 minuten • 100% gratis
                  </p>
              </AnimatedSection>
          </div>
      </div>

      {/* 5. HOW IT WORKS - Timeline */}
      <div id="how-it-works" className="bg-[#0d1f3c] py-24 md:py-32 px-6">
        <div className="max-w-[1200px] mx-auto">
          <AnimatedSection className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-24 gap-4">
             <div>
                <h2 className="text-3xl md:text-4xl font-semibold mb-2 md:mb-4 text-white tracking-[-0.02em]">De Factory Line.</h2>
                <p className="text-blue-200/50 font-light">Van droom naar sleuteloverdracht in 4 stappen.</p>
             </div>
             <button 
                onClick={() => setAppState(AppState.WIZARD_HOUSEHOLD)}
                className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest border-b border-blue-400 text-blue-400 pb-1 hover:opacity-70 transition-opacity"
             >
                 Start de flow <ArrowRight size={14} />
             </button>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 relative">
             {/* Step 1 */}
             <AnimatedSection delay={0}>
               <div className="group cursor-pointer" onClick={() => setAppState(AppState.WIZARD_HOUSEHOLD)}>
                   <div className="mb-4 md:mb-6 overflow-hidden aspect-[4/3] bg-blue-500/10 rounded-xl">
                       <img src="/generated/steps/step-01-vibe-stijl.jpg" loading="lazy" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" alt="Vibe & Stijl"/>
                 </div>
                 <div className="flex items-center gap-4 mb-2">
                     <span className="font-mono text-xs text-blue-400">01</span>
                     <div className="h-[1px] bg-blue-500/30 w-12"></div>
                 </div>
                   <h3 className="text-xl md:text-2xl font-medium mb-2 text-white group-hover:text-blue-400 transition-colors tracking-[-0.01em]">Vibe & Stijl</h3>
                 <p className="text-sm text-blue-200/50 font-light leading-relaxed">
                     Bepaal je esthetiek. Onze AI vertaalt jouw smaak naar een architectonisch ontwerp.
                 </p>
             </div>
             </AnimatedSection>

             {/* Step 2 */}
             <AnimatedSection delay={100}>
               <div className="group cursor-pointer" onClick={() => setAppState(AppState.WIZARD_HOUSEHOLD)}>
                   <div className="mb-4 md:mb-6 overflow-hidden aspect-[4/3] bg-blue-500/10 rounded-xl">
                       <img src="/generated/steps/step-02-kavel-check.jpg" loading="lazy" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0" alt="Kavel Check"/>
                 </div>
                 <div className="flex items-center gap-4 mb-2">
                     <span className="font-mono text-xs text-blue-400">02</span>
                     <div className="h-[1px] bg-blue-500/30 w-12"></div>
                 </div>
                   <h3 className="text-xl md:text-2xl font-medium mb-2 text-white group-hover:text-blue-400 transition-colors tracking-[-0.01em]">Kavel Check</h3>
                 <p className="text-sm text-blue-200/50 font-light leading-relaxed">
                     Wij scannen het bestemmingsplan. Mag je hier bouwen? Wat zijn de regels? Direct antwoord.
                 </p>
             </div>
             </AnimatedSection>

             {/* Step 3 */}
             <AnimatedSection delay={200}>
               <div 
                 className="group cursor-pointer" 
                 onClick={() => {
                   const passportSection = document.getElementById('passport-section');
                   passportSection?.scrollIntoView({ behavior: 'smooth' });
                 }}
               >
                   <div className="mb-4 md:mb-6 overflow-hidden aspect-[4/3] bg-blue-500/10 rounded-xl">
                       <img src="/generated/steps/step-03-paspoort.jpg" loading="lazy" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" alt="Het Paspoort"/>
                 </div>
                 <div className="flex items-center gap-4 mb-2">
                     <span className="font-mono text-xs text-blue-400">03</span>
                     <div className="h-[1px] bg-blue-500/30 w-12"></div>
                 </div>
                   <h3 className="text-xl md:text-2xl font-medium mb-2 text-white group-hover:text-blue-400 transition-colors tracking-[-0.01em]">Het Paspoort</h3>
                 <p className="text-sm text-blue-200/50 font-light leading-relaxed">
                     Je ontvangt een 'Feasibility Passport'. Kosten, materialen en duurzaamheid in één dossier.
                 </p>
             </div>
             </AnimatedSection>

             {/* Step 4 */}
             <AnimatedSection delay={300}>
               <div className="group cursor-pointer" onClick={() => setAppState(AppState.WIZARD_HOUSEHOLD)}>
                   <div className="mb-4 md:mb-6 overflow-hidden aspect-[4/3] bg-blue-500/10 rounded-xl relative">
                       <img src="/generated/steps/step-04-bouw-os.jpg" loading="lazy" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" alt="De Bouw OS"/>
                       <div className="absolute inset-0 bg-[#0a1628]/30 group-hover:bg-[#0a1628]/15 transition-colors flex items-center justify-center">
                         <Hammer size={40} strokeWidth={1} className="text-white group-hover:scale-110 transition-transform drop-shadow-lg" />
                       </div>
                 </div>
                 <div className="flex items-center gap-4 mb-2">
                     <span className="font-mono text-xs text-blue-400">04</span>
                     <div className="h-[1px] bg-blue-500/30 w-12"></div>
                 </div>
                   <h3 className="text-xl md:text-2xl font-medium mb-2 text-white group-hover:text-blue-400 transition-colors tracking-[-0.01em]">De Bouw OS</h3>
                 <p className="text-sm text-blue-200/50 font-light leading-relaxed">
                     Geen gedoe. Volg de bouw via je dashboard. Betalingen gaan pas weg als het werk af is.
                 </p>
               </div>
             </AnimatedSection>
          </div>
        </div>
      </div>

      {/* STAKEHOLDER COLLABORATION SECTION */}
      <div className="text-white py-24 md:py-32 px-6 relative overflow-hidden" style={darkBluePattern}>
        {/* Tinted background image */}
        <div className="absolute inset-0">
          <img 
            src="/generated/thatched-systems.png" 
            alt="" 
            className="w-full h-full object-cover opacity-[0.15]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628] via-transparent to-[#0a1628]" />
          </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <AnimatedSection className="text-center mb-16 md:mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-6">
              <Users size={14} /> Voor Iedereen in het Proces
        </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.05] mb-6 tracking-[-0.02em]">
              Ongekende samenwerking.<br/>
              <span className="bg-gradient-to-r from-[#60a5fa] to-[#34d399] bg-clip-text text-transparent">Volledige transparantie.</span>
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto font-light">
              Eén platform waar bouwheer, architect, constructeur, gemeente en aannemer samen werken aan hetzelfde dossier. Realtime. Auditeerbaar. Foutloos.
            </p>
          </AnimatedSection>

          {/* Stakeholder Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {/* Bouwheer */}
            <AnimatedSection delay={100} className="group">
              <div className="bg-white/5 border border-white/10 p-6 md:p-8 h-full hover:bg-white/10 transition-colors">
                <div className="w-14 h-14 bg-[#1e3a5f]/20 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-[#5b8ac7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
      </div>
                <h3 className="text-xl font-medium mb-3 tracking-[-0.01em]">Bouwheer</h3>
                <p className="text-white/50 text-sm leading-relaxed mb-4">
                  Volledige controle over je project. Zie precies waar elke euro naartoe gaat en volg de voortgang realtime.
                </p>
                <ul className="space-y-2 text-sm text-white/70">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[#5b8ac7] flex-shrink-0" />
                    Realtime kosteninsicht
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[#5b8ac7] flex-shrink-0" />
                    Directe besluitvorming
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[#5b8ac7] flex-shrink-0" />
                    Complete documentatie
                  </li>
                </ul>
              </div>
            </AnimatedSection>

            {/* Architect */}
            <AnimatedSection delay={200} className="group">
              <div className="bg-white/5 border border-white/10 p-6 md:p-8 h-full hover:bg-white/10 transition-colors">
                <div className="w-14 h-14 bg-cyan-500/20 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-3 tracking-[-0.01em]">Architect</h3>
                <p className="text-white/50 text-sm leading-relaxed mb-4">
                  Focus op ontwerp, niet op papierwerk. AI-assistentie voor snelle iteraties met directe validatie.
                </p>
                <ul className="space-y-2 text-sm text-white/70">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-cyan-400 flex-shrink-0" />
                    Instant feasibility check
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-cyan-400 flex-shrink-0" />
                    Gedeelde ontwerpomgeving
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-cyan-400 flex-shrink-0" />
                    Versiebeheer & audit trail
                  </li>
                </ul>
              </div>
            </AnimatedSection>

            {/* Constructeur */}
            <AnimatedSection delay={300} className="group">
              <div className="bg-white/5 border border-white/10 p-6 md:p-8 h-full hover:bg-white/10 transition-colors">
                <div className="w-14 h-14 bg-amber-500/20 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-3 tracking-[-0.01em]">Constructeur</h3>
                <p className="text-white/50 text-sm leading-relaxed mb-4">
                  Efficiënte validatie met vooraf gestructureerde data. Minder heen-en-weer, snellere goedkeuring.
                </p>
                <ul className="space-y-2 text-sm text-white/70">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-amber-400 flex-shrink-0" />
                    Gestandaardiseerde input
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-amber-400 flex-shrink-0" />
                    Digitale handtekening
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-amber-400 flex-shrink-0" />
                    Liability tracking
                  </li>
                </ul>
              </div>
            </AnimatedSection>

            {/* Gemeente */}
            <AnimatedSection delay={400} className="group">
              <div className="bg-white/5 border border-white/10 p-6 md:p-8 h-full hover:bg-white/10 transition-colors">
                <div className="w-14 h-14 bg-purple-500/20 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-3 tracking-[-0.01em]">Gemeente</h3>
                <p className="text-white/50 text-sm leading-relaxed mb-4">
                  Complete, gevalideerde dossiers die direct voldoen aan bestemmingsplan eisen. Snellere afhandeling.
                </p>
                <ul className="space-y-2 text-sm text-white/70">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-purple-400 flex-shrink-0" />
                    Pre-validated dossiers
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-purple-400 flex-shrink-0" />
                    Bestemmingsplan check
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-purple-400 flex-shrink-0" />
                    Minder bezwaren
                  </li>
                </ul>
              </div>
            </AnimatedSection>
          </div>

          {/* Auditability highlight */}
          <AnimatedSection delay={500} className="mt-16 md:mt-20">
            <div className="bg-gradient-to-r from-[#1e3a5f]/10 to-[#0d1f3c]/20 border border-[#1e3a5f]/20 p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                  <div className="flex items-center gap-2 text-[#5b8ac7] text-sm font-bold uppercase tracking-wider mb-4">
                    <Lock size={16} />
                    Volledige Audit Trail
                  </div>
                  <h3 className="text-2xl md:text-3xl font-medium mb-4 tracking-[-0.01em]">Elke beslissing. Elke wijziging. Gedocumenteerd.</h3>
                  <p className="text-white/60 leading-relaxed mb-6">
                    Van eerste schets tot oplevering: elk document, elke goedkeuring, elke wijziging wordt vastgelegd. Nooit meer discussie over wie wat wanneer heeft besloten.
                  </p>
                  <button 
                    onClick={() => setAppState(AppState.WIZARD_HOUSEHOLD)}
                    className="group bg-gradient-to-r from-[#1e3a5f] to-[#0d1f3c] text-white px-6 py-3 text-sm font-medium hover:from-[#2a4a73] hover:to-[#1e3a5f] transition-all hover:shadow-lg flex items-center gap-2 rounded-full border border-[#2a4a73]/30"
                  >
                    Begin nu met ontwerpen
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
                <div className="font-mono text-xs space-y-2 bg-[#06101f]/50 p-6 rounded-lg border border-[#1e3a5f]/30">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-[#5b8ac7] rounded-full" />
                    <span className="text-white/40">2024-11-15 14:32:07</span>
                    <span className="text-white/80">Ontwerp gegenereerd</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-[#5b8ac7] rounded-full" />
                    <span className="text-white/40">2024-11-15 14:33:45</span>
                    <span className="text-white/80">Constructie gevalideerd</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-[#5b8ac7] rounded-full" />
                    <span className="text-white/40">2024-11-16 09:12:33</span>
                    <span className="text-white/80">Bouwheer akkoord</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                    <span className="text-white/40">Nu</span>
                    <span className="text-cyan-400">Wacht op gemeente...</span>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
              </div>
              
      {/* 6. FAQ SECTION */}
      <div className="bg-[#0a1628] py-24 md:py-32 px-6 relative overflow-hidden">
        {/* Tinted background image */}
        <div className="absolute inset-0">
          <img 
            src="/generated/coastal-modern-blueprint.png" 
            alt="" 
            className="w-full h-full object-cover opacity-[0.03]"
          />
        </div>
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.05]" style={{
          backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
        <div className="max-w-3xl mx-auto relative z-10">
          <AnimatedSection className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-white tracking-[-0.02em]">Veelgestelde vragen</h2>
            <p className="text-blue-200/60 font-light">Alles wat je wilt weten over de Ooit Gedacht methode.</p>
          </AnimatedSection>
          
          <AnimatedSection delay={100}>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 md:p-8">
              {faqs.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openFAQ === index}
                  onToggle={() => setOpenFAQ(openFAQ === index ? null : index)}
                />
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* 7. NEWSLETTER / LEAD CAPTURE */}
      <div className="py-24 md:py-32 px-6 relative overflow-hidden" style={darkBluePattern}>
        {/* Background image */}
        <div className="absolute inset-0">
          <img 
            src="/generated/forest-house-systems.jpg" 
            alt="" 
            className="w-full h-full object-cover opacity-[0.2]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/80 to-[#0a1628]/60" />
        </div>
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          {marketDots.map((dot, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{ left: dot.left, top: dot.top }}
            />
          ))}
        </div>
        
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-xs font-bold uppercase tracking-widest mb-8 text-white/80">
              <Mail size={14} /> Blijf op de hoogte
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4 tracking-[-0.02em]">
              Wekelijks kavelnieuws & tips
            </h2>
            <p className="text-lg text-white/60 font-light mb-8 leading-relaxed">
              Ontvang de beste kavels in jouw regio, bouwtrends en slimme bespaartips. Geen spam, altijd waardevol.
            </p>
            
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                // Handle newsletter signup
                alert('Bedankt voor je aanmelding!');
                setEmail('');
              }}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jouw@email.nl"
                required
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 text-white placeholder:text-white/40 outline-none focus:border-white/40 transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white text-[#0a1628] font-medium hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
              >
                Aanmelden <ArrowRight size={16} />
              </button>
            </form>
            
            <p className="text-xs text-white/40 mt-4">
              1.247 bouwers ontvangen onze nieuwsbrief al
            </p>
          </AnimatedSection>
        </div>
      </div>

      {/* 8. FOOTER */}
      <footer className="text-white py-16 md:py-20 px-6" style={{background: 'linear-gradient(to bottom, #0a1628, #06101f)'}}>
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10 md:gap-12">
              <div className="max-w-xs">
                  <div className="mb-6">
                      <img src="/generated/og-logo.png" alt="Ooit Gedacht" className="h-10 brightness-0 invert" />
                  </div>
                  <p className="text-gray-500 text-sm font-light mb-6">
                      Samen bouwen aan betaalbaar wonen.
                  </p>
                  <a 
                    href="https://www.bureau-broersma.nl" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 group"
                  >
                      <span className="text-[10px] uppercase tracking-widest text-gray-600 group-hover:text-gray-400 transition-colors">Powered by</span>
                      <img src={BROERSMA_LOGO} alt="Bureau Broersma" className="h-5 md:h-6 brightness-0 invert opacity-60 group-hover:opacity-80 transition-opacity" />
                  </a>
              </div>
              
              <div className="grid grid-cols-2 gap-8 md:gap-12">
                  <div className="space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500">Platform</h4>
                      <ul className="space-y-3 text-sm text-gray-400 font-light">
                          <li>
                            <button 
                              onClick={() => {
                                const factorySection = document.querySelector('[class*="HOW IT WORKS"]');
                                factorySection?.scrollIntoView({ behavior: 'smooth' });
                              }}
                              className="hover:text-white transition-colors"
                            >
                              Hoe het werkt
                            </button>
                          </li>
                          <li>
                            <button 
                              onClick={() => {
                                const passportSection = document.getElementById('passport-section');
                                passportSection?.scrollIntoView({ behavior: 'smooth' });
                              }}
                              className="hover:text-white transition-colors"
                            >
                              Prijzen & Kosten
                            </button>
                          </li>
                          <li>
                            <button 
                              onClick={() => setAppState(AppState.WIZARD_HOUSEHOLD)}
                              className="hover:text-white transition-colors"
                            >
                              Kavelzoeker
                            </button>
                          </li>
                          <li>
                            <a href="mailto:gemeenten@ooitgedacht.nl" className="hover:text-white transition-colors">
                              Voor Gemeenten
                            </a>
                          </li>
                      </ul>
                  </div>
                  <div className="space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500">Legal</h4>
                      <ul className="space-y-3 text-sm text-gray-400 font-light">
                          <li><a href="#" className="hover:text-white transition-colors">Algemene Voorwaarden</a></li>
                          <li><a href="#" className="hover:text-white transition-colors">Privacy Statement</a></li>
                          <li><a href="#" className="hover:text-white transition-colors">Disclaimer</a></li>
                      </ul>
                  </div>
              </div>

              <div className="w-full md:w-auto">
                 <button 
                    onClick={() => setAppState(AppState.WIZARD_HOUSEHOLD)}
                    className="w-full md:w-auto bg-white text-[#0a1628] px-6 md:px-8 py-3 md:py-4 font-bold text-sm hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
                 >
                     Start Project <ArrowRight size={16} />
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
                  <BarChart3 size={12} /> State of Market
                </button>
                <button 
                  onClick={() => setAppState(AppState.MARKET_RESEARCH)}
                  className="hover:text-gray-400 transition-colors flex items-center gap-1"
                >
                  <BarChart3 size={12} /> Investor Deck
                </button>
              </div>
          </div>
      </footer>
    </div>
  );
};