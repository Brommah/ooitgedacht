import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  Shield, 
  Eye,
  FileCheck,
  Zap,
  Clock,
  Lock,
  Camera,
  Cpu,
  FileText,
  Building2,
  HardHat,
  Glasses,
  TrendingUp,
  Users,
  BadgeCheck,
  ChevronRight,
  Mail,
  Phone
} from 'lucide-react';
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

interface BuildersPageProps {
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

export const BuildersPage: React.FC<BuildersPageProps> = ({ setAppState }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [email, setEmail] = useState('');

  // Sticky header on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const benefits = [
    {
      icon: <Clock size={24} />,
      title: "80% Minder Administratie",
      description: "Automatische documentatie via smart glasses. Geen handmatig invullen meer van WKB-formulieren."
    },
    {
      icon: <Shield size={24} />,
      title: "Volledige WKB Compliance",
      description: "Elk bewijs wordt cryptografisch verankerd en gevalideerd door Bureau Broersma constructeurs."
    },
    {
      icon: <TrendingUp size={24} />,
      title: "Lagere Verzekeringspremies",
      description: "Aannemers die BouwBorg gebruiken krijgen tot 10% korting op CAR-verzekeringen."
    },
    {
      icon: <BadgeCheck size={24} />,
      title: "Directe Betaling Vrijgave",
      description: "FSM-logica zorgt voor automatische milestone-betalingen zodra werk is gevalideerd."
    }
  ];

  const stackFeatures = [
    {
      icon: <Glasses size={32} />,
      title: "Smart Safety Glasses",
      subtitle: "Hardware",
      description: "Ruggedized veiligheidsbril met geïntegreerde camera, GPS en voice control. Hands-free bewijsvoering terwijl je werkt.",
      color: "from-amber-400 to-orange-500",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20"
    },
    {
      icon: <Cpu size={32} />,
      title: "Bouwbesturingssysteem",
      subtitle: "Software Platform",
      description: "Finite State Machine workflow die elke fase van de bouw bewaakt. Geen stap zonder validatie.",
      color: "from-blue-400 to-cyan-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20"
    },
    {
      icon: <FileCheck size={32} />,
      title: "Auto Compliance Engine",
      subtitle: "AI + Bureau Broersma",
      description: "AI analyseert beelden, Bureau Broersma valideert constructie. WKB-dossier wordt automatisch opgebouwd.",
      color: "from-emerald-400 to-green-500",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20"
    }
  ];

  return (
    <div className="bg-[#0a1628] w-full text-white min-h-screen">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled ? 'py-2 md:py-3' : 'py-3 md:py-5'}`}>
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className={`relative flex items-center justify-between px-4 md:px-8 py-2.5 md:py-4 rounded-xl md:rounded-2xl transition-all duration-500 ${
            isScrolled 
              ? 'bg-[#0a1628]/95 backdrop-blur-xl shadow-2xl shadow-[#0a1628]/40 border border-[#1e3a5f]/30' 
              : 'bg-white/[0.03] backdrop-blur-md border border-white/[0.06]'
          }`}>
            {/* Logo */}
            <button 
              onClick={() => setAppState(AppState.LANDING)}
              className="relative group z-10"
            >
              <img 
                src="/generated/og-logo.png" 
                alt="OoitGedacht" 
                className="h-8 md:h-10 brightness-0 invert transition-transform duration-300 group-hover:scale-105" 
              />
            </button>
            
            {/* Center Badge */}
            <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full">
              <HardHat size={14} className="text-amber-400" />
              <span className="text-xs font-medium text-amber-300">Voor Aannemers & Bouwers</span>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3 z-10">
              <button 
                onClick={() => setAppState(AppState.LANDING)}
                className="flex items-center gap-2 text-white/60 hover:text-white px-4 py-2 text-sm transition-colors"
              >
                <ArrowLeft size={16} />
                <span className="hidden sm:inline">Terug</span>
              </button>
              <button 
                onClick={() => {
                  const el = document.getElementById('contact-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2.5 text-[13px] font-semibold hover:from-amber-400 hover:to-orange-400 transition-all duration-300 rounded-full shadow-lg shadow-amber-500/20"
              >
                <Phone size={14} />
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative min-h-screen flex flex-col justify-center pt-28 md:pt-32 pb-20">
        {/* Background */}
        <div className="absolute inset-0">
          <img 
            src="/generated/b2b/smart-glasses-on-site.jpg" 
            alt="Aannemer met smart glasses op bouwplaats" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628] via-[#0a1628]/90 to-[#0a1628]/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-transparent to-[#0a1628]/50" />
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full text-xs font-bold uppercase tracking-[0.15em] mb-6 text-amber-300">
                <Building2 size={14} />
                BouwBorg voor Aannemers
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-white leading-[1.05] tracking-[-0.03em] mb-6">
                <span className="block">De Compliance</span>
                <span className="block">
                  <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">Revolution</span>
                </span>
                <span className="block font-light text-white/80">voor Bouwers</span>
              </h1>
              
              <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-8 font-light max-w-lg">
                <strong className="text-white font-medium">Smart glasses + AI + FSM software</strong> = 
                automatische WKB-compliance zonder administratielast. 
                <span className="text-amber-400"> Bouw, wij documenteren.</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button 
                  onClick={() => {
                    const el = document.getElementById('contact-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="group bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 text-base font-semibold hover:from-amber-400 hover:to-orange-400 transition-all flex items-center justify-center gap-3 rounded-full shadow-lg shadow-amber-500/30"
                >
                  Plan een Demo
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => {
                    const el = document.getElementById('stack-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-white/60 hover:text-white px-6 py-4 text-base transition-colors flex items-center justify-center gap-2 border border-white/10 rounded-full hover:border-white/30"
                >
                  Bekijk de Stack
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-6 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  <span className="text-sm text-white/60">WKB Gecertificeerd</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  <span className="text-sm text-white/60">Bureau Broersma Partner</span>
                </div>
              </div>
            </div>

            {/* Right - Glasses Product Shot */}
            <div className="relative">
              <div className="aspect-square max-w-lg mx-auto relative">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/10 rounded-3xl transform rotate-3" />
                <img 
                  src="/generated/b2b/smart-glasses-product.jpg" 
                  alt="BouwBorg Smart Safety Glasses" 
                  className="relative z-10 w-full h-full object-cover rounded-2xl shadow-2xl shadow-black/50"
                />
                {/* Floating badge */}
                <div className="absolute -bottom-4 -right-4 z-20 bg-[#0d1f3c] border border-amber-500/30 rounded-xl px-4 py-3 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                      <Camera size={20} className="text-amber-400" />
                    </div>
                    <div>
                      <div className="text-xs text-white/50">4K Video</div>
                      <div className="text-sm font-semibold text-white">Hands-Free Capture</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The Problem Section */}
      <div className="bg-[#06101f] py-24 md:py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
        
        <div className="max-w-5xl mx-auto relative z-10">
          <AnimatedSection className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full text-xs font-bold uppercase tracking-[0.15em] mb-6 text-red-400">
              <FileText size={14} />
              Het WKB Probleem
            </div>
            <h2 className="text-3xl md:text-5xl font-semibold text-white tracking-[-0.02em] mb-6">
              De Wkb veranderde alles.
              <br />
              <span className="text-white/50">Bent u er klaar voor?</span>
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatedSection delay={100} className="bg-red-500/5 border border-red-500/20 rounded-2xl p-8 text-center">
              <div className="text-5xl font-bold text-red-400 mb-3">20</div>
              <div className="text-lg font-medium text-white mb-2">Jaar Aansprakelijkheid</div>
              <p className="text-sm text-white/50">De Wkb verschuift de bewijslast naar aannemers. 20 jaar lang moet je kunnen bewijzen dat correct is gebouwd.</p>
            </AnimatedSection>
            
            <AnimatedSection delay={200} className="bg-red-500/5 border border-red-500/20 rounded-2xl p-8 text-center">
              <div className="text-5xl font-bold text-red-400 mb-3">60K+</div>
              <div className="text-lg font-medium text-white mb-2">Aannemers in NL</div>
              <p className="text-sm text-white/50">Vrijwel allemaal nog afhankelijk van WhatsApp, e-mail en papieren bonnetjes. Juridisch onhoudbaar.</p>
            </AnimatedSection>
            
            <AnimatedSection delay={300} className="bg-red-500/5 border border-red-500/20 rounded-2xl p-8 text-center">
              <div className="text-5xl font-bold text-red-400 mb-3">€50K+</div>
              <div className="text-lg font-medium text-white mb-2">Gemiddelde Claim</div>
              <p className="text-sm text-white/50">Zonder proper bewijsvoering bent u persoonlijk aansprakelijk voor bouwfouten die jaren later opduiken.</p>
            </AnimatedSection>
          </div>
        </div>
      </div>

      {/* The Stack Section */}
      <div id="stack-section" className="py-24 md:py-32 px-6 relative overflow-hidden" style={darkBluePattern}>
        <div className="max-w-6xl mx-auto relative z-10">
          <AnimatedSection className="text-center mb-16 md:mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full text-xs font-bold uppercase tracking-[0.15em] mb-6 text-blue-300">
              <Zap size={14} />
              De Oplossing
            </div>
            <h2 className="text-3xl md:text-5xl font-semibold text-white tracking-[-0.02em] mb-6">
              Verticaal Geïntegreerde Stack
            </h2>
            <p className="text-lg text-white/50 max-w-2xl mx-auto font-light">
              Hardware + Software + Expert Validatie. Eén ecosysteem dat compliance transformeert van last naar bijproduct.
            </p>
          </AnimatedSection>

          {/* Stack Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-16">
            {stackFeatures.map((feature, index) => (
              <AnimatedSection key={index} delay={index * 100}>
                <div className={`${feature.bgColor} border ${feature.borderColor} rounded-2xl p-8 h-full transition-all duration-300 hover:scale-[1.02]`}>
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} p-[1px] mb-6`}>
                    <div className="w-full h-full rounded-xl bg-[#0a1628] flex items-center justify-center text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <div className="text-xs font-bold uppercase tracking-[0.15em] text-white/40 mb-2">{feature.subtitle}</div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Integration Arrow */}
          <AnimatedSection delay={400} className="text-center mb-16">
            <div className="inline-flex flex-col items-center">
              <div className="w-px h-16 bg-gradient-to-b from-transparent via-amber-500 to-amber-500" />
              <div className="px-6 py-3 bg-amber-500/10 border border-amber-500/30 rounded-full">
                <span className="text-amber-300 font-semibold">= Volledig Geautomatiseerd WKB Dossier</span>
              </div>
            </div>
          </AnimatedSection>

          {/* Workflow Preview */}
          <AnimatedSection delay={500}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-white/[0.02] border border-white/10 rounded-2xl p-8 md:p-12">
              <div>
                <h3 className="text-2xl md:text-3xl font-semibold text-white mb-4">Zo Werkt Het</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-amber-400 font-bold text-sm">1</span>
                    </div>
                    <div>
                      <div className="font-medium text-white">Zet de bril op en werk</div>
                      <div className="text-sm text-white/50">De bril detecteert automatisch welke fase je uitvoert</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-400 font-bold text-sm">2</span>
                    </div>
                    <div>
                      <div className="font-medium text-white">AI analyseert realtime</div>
                      <div className="text-sm text-white/50">Gemini Vision controleert of het werk overeenkomt met specificaties</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-emerald-400 font-bold text-sm">3</span>
                    </div>
                    <div>
                      <div className="font-medium text-white">Bureau Broersma valideert</div>
                      <div className="text-sm text-white/50">Expert constructeurs keuren kritieke punten binnen 4 uur</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-purple-400 font-bold text-sm">4</span>
                    </div>
                    <div>
                      <div className="font-medium text-white">Betaling wordt vrijgegeven</div>
                      <div className="text-sm text-white/50">FSM ontgrendelt automatisch de volgende fase + milestone-betaling</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <img 
                  src="/generated/b2b/smart-glasses-workflow.jpg" 
                  alt="BouwBorg workflow op de bouwplaats" 
                  className="w-full rounded-xl shadow-xl"
                />
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="bg-[#0a1628] py-24 md:py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/generated/b2b/smart-glasses-collaboration.jpg" 
            alt="Samenwerking kantoor en bouwplaats" 
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/95 to-[#0a1628]" />
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-semibold text-white tracking-[-0.02em] mb-6">
              Waarom Aannemers Kiezen
              <br />
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">voor BouwBorg</span>
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {benefits.map((benefit, index) => (
              <AnimatedSection key={index} delay={index * 100}>
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 hover:bg-white/[0.05] transition-colors h-full">
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center flex-shrink-0 text-amber-400">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">{benefit.title}</h3>
                      <p className="text-white/60 leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-[#06101f] py-24 md:py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-[-0.02em] mb-4">
              Compliance as a Service
            </h2>
            <p className="text-lg text-white/50 max-w-xl mx-auto">
              Geen grote upfront investering. Betaal per project, doorberekend aan de klant.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AnimatedSection delay={100}>
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 text-center h-full">
                <div className="text-sm font-bold uppercase tracking-[0.15em] text-white/40 mb-3">Klein Project</div>
                <div className="text-lg text-white/60 mb-4">Dakkapel / Aanbouw</div>
                <div className="text-4xl font-bold text-white mb-2">€450</div>
                <div className="text-sm text-white/40 mb-6">per project</div>
                <ul className="text-left text-sm space-y-2 text-white/60">
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> Smart glasses lease</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> WKB dossier generatie</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> AI validatie</li>
                </ul>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <div className="bg-gradient-to-b from-amber-500/10 to-orange-500/5 border-2 border-amber-500/30 rounded-2xl p-8 text-center h-full relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">
                  POPULAIR
                </div>
                <div className="text-sm font-bold uppercase tracking-[0.15em] text-amber-400 mb-3">Nieuwbouw Woning</div>
                <div className="text-lg text-white/60 mb-4">Volledige woningbouw</div>
                <div className="text-4xl font-bold text-white mb-2">€1.500</div>
                <div className="text-sm text-white/40 mb-6">per project</div>
                <ul className="text-left text-sm space-y-2 text-white/60">
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> Alles van Klein +</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> Bureau Broersma validatie</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> Constructeur check</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> Woningpaspoort</li>
                </ul>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={300}>
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 text-center h-full">
                <div className="text-sm font-bold uppercase tracking-[0.15em] text-white/40 mb-3">Enterprise</div>
                <div className="text-lg text-white/60 mb-4">Appartementencomplex</div>
                <div className="text-4xl font-bold text-white mb-2">Custom</div>
                <div className="text-sm text-white/40 mb-6">op aanvraag</div>
                <ul className="text-left text-sm space-y-2 text-white/60">
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> Dedicated support</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> Meerdere brilsets</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> White-label optie</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> API integraties</li>
                </ul>
              </div>
            </AnimatedSection>
          </div>

          <AnimatedSection delay={400} className="mt-12 text-center">
            <p className="text-white/40 text-sm">
              Alle prijzen worden doorberekend aan de eindklant als "WKB Compliance & Digitale Garantie" line item.
            </p>
          </AnimatedSection>
        </div>
      </div>

      {/* Partner Logos */}
      <div className="bg-[#0a1628] py-16 px-6 border-y border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/30 mb-8">In Samenwerking Met</div>
          <div className="flex flex-wrap items-center justify-center gap-12">
            <a 
              href="https://www.bureau-broersma.nl" 
              target="_blank" 
              rel="noopener noreferrer"
              className="opacity-40 hover:opacity-70 transition-opacity"
            >
              <img src={BROERSMA_LOGO} alt="Bureau Broersma" className="h-10 brightness-0 invert" />
            </a>
          </div>
        </div>
      </div>

      {/* Contact CTA Section */}
      <div id="contact-section" className="py-24 md:py-32 px-6 relative overflow-hidden" style={darkBluePattern}>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full text-xs font-bold uppercase tracking-[0.15em] mb-6 text-amber-300">
              <Mail size={14} />
              Neem Contact Op
            </div>
            <h2 className="text-3xl md:text-5xl font-semibold text-white tracking-[-0.02em] mb-6">
              Klaar om de Compliance
              <br />
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Last te Verlichten?</span>
            </h2>
            <p className="text-lg text-white/60 mb-10 max-w-xl mx-auto font-light">
              Plan een vrijblijvende demo en ontdek hoe BouwBorg uw werkprocessen kan transformeren.
            </p>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                alert('Bedankt! We nemen zo snel mogelijk contact op.');
                setEmail('');
              }}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-8"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="uw@email.nl"
                required
                className="flex-1 px-5 py-4 bg-white/10 border border-white/20 text-white placeholder:text-white/40 outline-none focus:border-amber-500/50 transition-colors rounded-full"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold hover:from-amber-400 hover:to-orange-400 transition-colors flex items-center justify-center gap-2 rounded-full"
              >
                Plan Demo <ArrowRight size={18} />
              </button>
            </form>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-white/40">
              <a href="tel:+31701234567" className="flex items-center gap-2 hover:text-white/60 transition-colors">
                <Phone size={16} />
                +31 (0)70 123 4567
              </a>
              <a href="mailto:sales@bouwborg.nl" className="flex items-center gap-2 hover:text-white/60 transition-colors">
                <Mail size={16} />
                sales@bouwborg.nl
              </a>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-white py-12 px-6 bg-[#06101f] border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <img src="/generated/og-logo.png" alt="Ooit Gedacht" className="h-8 brightness-0 invert opacity-60" />
            <span className="text-white/30">×</span>
            <span className="text-sm text-white/40">BouwBorg Platform</span>
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setAppState(AppState.LANDING)}
              className="text-sm text-white/40 hover:text-white/60 transition-colors"
            >
              Voor Particulieren
            </button>
            <span className="text-white/20">|</span>
            <span className="text-sm text-white/40">© 2025 Ooit Gedacht B.V.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

