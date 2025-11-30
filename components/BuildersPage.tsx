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
  Camera,
  Cpu,
  FileText,
  Building2,
  HardHat,
  Glasses,
  TrendingDown,
  Users,
  BadgeCheck,
  ChevronRight,
  Mail,
  Phone,
  AlertTriangle,
  XCircle,
  Timer,
  Banknote,
  Scale,
  CheckCheck,
  Play,
  Quote
} from 'lucide-react';
import { AppState } from '../types';

const BROERSMA_LOGO = "https://www.bureau-broersma.nl/wp-content/uploads/2015/09/logo-broersma-bouwadvies.png";

interface BuildersPageProps {
  setAppState: (state: AppState) => void;
}

// Intersection Observer hook
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
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
};

const AnimatedSection: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ 
  children, className = '', delay = 0 
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
  const [company, setCompany] = useState('');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-[#0a0f1a] w-full text-white min-h-screen">
      
      {/* ============================================ */}
      {/* NAVIGATION */}
      {/* ============================================ */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        isScrolled ? 'bg-[#0a0f1a]/95 backdrop-blur-xl border-b border-white/5' : ''
      }`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => setAppState(AppState.LANDING)} className="flex items-center gap-3 group">
            <ArrowLeft size={18} className="text-white/40 group-hover:text-white transition-colors" />
            <img src="/generated/og-logo.png" alt="OoitGedacht" className="h-7 brightness-0 invert opacity-70 group-hover:opacity-100 transition-opacity" />
          </button>
          
          <div className="hidden md:flex items-center gap-2 text-xs">
            <span className="px-3 py-1.5 bg-amber-500/10 text-amber-400 rounded-full font-medium flex items-center gap-1.5">
              <HardHat size={12} />
              B2B Platform
            </span>
          </div>

          <button 
            onClick={() => document.getElementById('demo-form')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-white text-[#0a0f1a] px-5 py-2 text-sm font-semibold rounded-full hover:bg-white/90 transition-colors"
          >
            Plan Demo
          </button>
        </div>
      </nav>

      {/* ============================================ */}
      {/* HERO - The Hook */}
      {/* ============================================ */}
      <section className="relative min-h-[90vh] flex items-center pt-20">
        {/* Background */}
        <div className="absolute inset-0">
          <img 
            src="/generated/b2b/smart-glasses-on-site.jpg" 
            alt="" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f1a] via-[#0a0f1a]/95 to-[#0a0f1a]/60" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full text-xs font-medium text-red-400 mb-6">
              <AlertTriangle size={12} />
              Wkb 2024: Nieuwe Wet, Nieuwe Risico's
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-6">
              Stop met{' '}
              <span className="text-red-400 line-through decoration-2">papierwerk.</span>
              <br />
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                Start met bouwen.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-white/60 leading-relaxed mb-8 max-w-xl">
              De Wkb dwingt 20 jaar bewijslast op aannemers. 
              BouwBorg automatiseert je complete WKB-dossier via smart glasses + AI. 
              <strong className="text-white"> Jij bouwt, wij documenteren.</strong>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button 
                onClick={() => document.getElementById('demo-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="group bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 font-semibold rounded-full shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all flex items-center justify-center gap-2"
              >
                Bekijk Live Demo
                <Play size={18} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button 
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 font-medium text-white/70 hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                Hoe werkt het?
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Trust bar */}
            <div className="flex items-center gap-6 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2 text-sm text-white/50">
                <CheckCircle2 size={16} className="text-emerald-400" />
                WKB Compliant
              </div>
              <div className="flex items-center gap-2 text-sm text-white/50">
                <img src={BROERSMA_LOGO} alt="" className="h-4 brightness-0 invert opacity-50" />
                Bureau Broersma Partner
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* PROBLEM - Why This Matters */}
      {/* ============================================ */}
      <section className="py-24 bg-[#060a12] relative overflow-hidden">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              De Wkb heeft alles veranderd.
              <br />
              <span className="text-white/40">Is uw bedrijf voorbereid?</span>
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Scale size={28} />,
                stat: "20 jaar",
                label: "Aansprakelijkheid",
                description: "U moet kunnen bewijzen dat elk detail correct is uitgevoerd. Twintig jaar lang.",
                color: "red"
              },
              {
                icon: <Timer size={28} />,
                stat: "4+ uur",
                label: "Extra per project",
                description: "Gemiddelde tijd aan WKB-documentatie per week. Tijd die u niet factureert.",
                color: "amber"
              },
              {
                icon: <Banknote size={28} />,
                stat: "€15.000+",
                label: "Bij claims",
                description: "Gemiddelde schade bij WKB-geschillen waar bewijs ontbreekt.",
                color: "red"
              }
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 100}>
                <div className={`bg-${item.color}-500/5 border border-${item.color}-500/10 rounded-2xl p-8 h-full`}>
                  <div className={`w-12 h-12 rounded-xl bg-${item.color}-500/10 flex items-center justify-center mb-6 text-${item.color}-400`}>
                    {item.icon}
                  </div>
                  <div className={`text-4xl font-bold text-${item.color}-400 mb-1`}>{item.stat}</div>
                  <div className="text-lg font-medium text-white mb-3">{item.label}</div>
                  <p className="text-white/50 text-sm leading-relaxed">{item.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Current situation */}
          <AnimatedSection delay={400} className="mt-16">
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-red-400/60 mb-4">Het probleem</div>
                  <h3 className="text-2xl font-bold mb-4">Hoe de meeste aannemers nu werken:</h3>
                  <ul className="space-y-3">
                    {[
                      "WhatsApp-groepen vol onvindbare foto's",
                      "Excel-sheets die niemand bijhoudt",
                      "Bonnetjes in dashboardkastjes",
                      "E-mails die verloren gaan",
                      "Geen timestamped bewijs bij geschillen"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-white/60">
                        <XCircle size={18} className="text-red-400/60 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="relative">
                  <div className="aspect-video bg-gradient-to-br from-red-500/10 to-orange-500/5 rounded-xl border border-red-500/10 flex items-center justify-center">
                    <div className="text-center px-8">
                      <AlertTriangle size={48} className="text-red-400/40 mx-auto mb-4" />
                      <p className="text-white/40 text-sm">
                        "Bij een geschil vroeg de rechter om bewijs van de wapeningskeuring. 
                        We hadden alleen een WhatsApp foto zonder datum of locatie."
                      </p>
                      <p className="text-white/30 text-xs mt-3">— Anonieme aannemer, rechtszaak 2024</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ============================================ */}
      {/* SOLUTION INTRO - The Big Idea */}
      {/* ============================================ */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#060a12] via-[#0a0f1a] to-[#0a0f1a]" />
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-medium text-emerald-400 mb-6">
              <Zap size={12} />
              De Oplossing
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Eén systeem.{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Volledige compliance.
              </span>
            </h2>
            <p className="text-lg text-white/50 leading-relaxed">
              BouwBorg combineert smart glasses, AI-validatie en expert-verificatie 
              tot één geïntegreerd systeem dat automatisch uw WKB-dossier opbouwt 
              terwijl u werkt.
            </p>
          </AnimatedSection>

          {/* The Stack Visual */}
          <AnimatedSection delay={200}>
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {[
                {
                  step: "01",
                  icon: <Glasses size={32} />,
                  title: "Smart Safety Glasses",
                  subtitle: "Hardware",
                  description: "Veiligheidsbril met 4K camera, GPS, en voice control. Draag hem, werk normaal, wij leggen alles vast.",
                  gradient: "from-amber-500 to-orange-500",
                  bgGradient: "from-amber-500/10 to-orange-500/5"
                },
                {
                  step: "02",
                  icon: <Cpu size={32} />,
                  title: "BouwBorg OS",
                  subtitle: "Software",
                  description: "Finite State Machine workflow. Elke fase heeft checkpoints. Geen stap verder zonder validatie.",
                  gradient: "from-blue-500 to-cyan-500",
                  bgGradient: "from-blue-500/10 to-cyan-500/5"
                },
                {
                  step: "03",
                  icon: <BadgeCheck size={32} />,
                  title: "Expert Validatie",
                  subtitle: "Bureau Broersma",
                  description: "AI doet de eerste check. Bureau Broersma constructeurs valideren kritieke punten binnen 4 uur.",
                  gradient: "from-emerald-500 to-green-500",
                  bgGradient: "from-emerald-500/10 to-green-500/5"
                }
              ].map((item, i) => (
                <div key={i} className={`bg-gradient-to-br ${item.bgGradient} border border-white/5 rounded-2xl p-8 relative overflow-hidden group hover:border-white/10 transition-colors`}>
                  <div className="absolute top-4 right-4 text-6xl font-black text-white/[0.03]">{item.step}</div>
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-6 text-white shadow-lg`}>
                    {item.icon}
                  </div>
                  <div className="text-xs font-bold uppercase tracking-widest text-white/30 mb-2">{item.subtitle}</div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>

          {/* Equals */}
          <AnimatedSection delay={400} className="flex justify-center my-8">
            <div className="flex items-center gap-4">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-500/50" />
              <div className="px-6 py-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-full">
                <span className="text-sm font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  = Automatisch WKB-Dossier
                </span>
              </div>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-500/50" />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ============================================ */}
      {/* HOW IT WORKS - Step by Step */}
      {/* ============================================ */}
      <section id="how-it-works" className="py-24 bg-[#060a12]">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Hoe het werkt</h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Van bril opzetten tot WKB-dossier. Vier stappen, volledig geautomatiseerd.
            </p>
          </AnimatedSection>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Steps */}
            <AnimatedSection>
              <div className="space-y-6">
                {[
                  {
                    num: "1",
                    title: "Zet de bril op en werk",
                    description: "De bril detecteert automatisch welke bouwfase u uitvoert op basis van locatie en context.",
                    icon: <Glasses size={20} />
                  },
                  {
                    num: "2",
                    title: "AI analyseert realtime",
                    description: "Computer vision controleert of het werk overeenkomt met de bouwtekeningen en specificaties.",
                    icon: <Eye size={20} />
                  },
                  {
                    num: "3",
                    title: "Expert valideert",
                    description: "Bij kritieke punten reviewt een Bureau Broersma constructeur het bewijs binnen 4 uur.",
                    icon: <BadgeCheck size={20} />
                  },
                  {
                    num: "4",
                    title: "Fase ontgrendeld",
                    description: "Validatie succesvol? De volgende bouwfase wordt vrijgegeven en betaling wordt getriggerd.",
                    icon: <CheckCheck size={20} />
                  }
                ].map((step, i) => (
                  <div key={i} className="flex gap-5 group">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold group-hover:border-amber-500/40 transition-colors">
                        {step.num}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1 flex items-center gap-2">
                        {step.title}
                        <span className="text-white/20">{step.icon}</span>
                      </h4>
                      <p className="text-white/50 text-sm leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            {/* Image */}
            <AnimatedSection delay={200}>
              <div className="relative">
                <img 
                  src="/generated/b2b/smart-glasses-workflow.jpg" 
                  alt="BouwBorg workflow op de bouwplaats" 
                  className="rounded-2xl shadow-2xl shadow-black/50"
                />
                {/* Overlay badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-[#0a0f1a]/90 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                      <span className="text-white/70">Fase: Wapeningskeuring</span>
                    </div>
                    <span className="text-emerald-400 font-medium">AI Validatie: 98%</span>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* RESULTS - What You Get */}
      {/* ============================================ */}
      <section className="py-24 relative">
        <div className="absolute inset-0">
          <img 
            src="/generated/b2b/smart-glasses-collaboration.jpg" 
            alt="" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-[#0a0f1a]/95 to-[#0a0f1a]" />
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Concrete resultaten
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Geen vage beloftes. Dit is wat BouwBorg-gebruikers rapporteren.
            </p>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              { value: "80%", label: "Minder administratietijd", sub: "4+ uur → 45 min per week" },
              { value: "100%", label: "Timestamped bewijs", sub: "GPS + datum op elk item" },
              { value: "4 uur", label: "Expert validatie SLA", sub: "Constructeur check" },
              { value: "€0", label: "Extra software kosten", sub: "Alles in één abonnement" }
            ].map((stat, i) => (
              <AnimatedSection key={i} delay={i * 100}>
                <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 text-center hover:border-white/10 transition-colors">
                  <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="font-medium mb-1">{stat.label}</div>
                  <div className="text-xs text-white/40">{stat.sub}</div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Benefits grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: <TrendingDown size={24} />,
                title: "Lagere verzekeringspremies",
                description: "Verzekeraars geven tot 10% korting aan BouwBorg-gebruikers door bewezen lagere claims.",
                color: "emerald"
              },
              {
                icon: <Shield size={24} />,
                title: "Juridische bescherming",
                description: "Elk bewijs is cryptografisch verankerd met timestamp en GPS. Onweerlegbaar in rechtszaken.",
                color: "blue"
              },
              {
                icon: <Banknote size={24} />,
                title: "Snellere betalingen",
                description: "Milestone-betalingen worden automatisch getriggerd zodra validatie rond is. Geen discussie.",
                color: "amber"
              },
              {
                icon: <Users size={24} />,
                title: "Tevreden opdrachtgevers",
                description: "Klanten krijgen realtime inzicht in voortgang. Transparantie bouwt vertrouwen.",
                color: "purple"
              }
            ].map((benefit, i) => (
              <AnimatedSection key={i} delay={i * 100}>
                <div className="flex gap-5 bg-white/[0.02] border border-white/5 rounded-xl p-6 hover:bg-white/[0.03] transition-colors">
                  <div className={`w-12 h-12 rounded-xl bg-${benefit.color}-500/10 flex items-center justify-center flex-shrink-0 text-${benefit.color}-400`}>
                    {benefit.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{benefit.title}</h4>
                    <p className="text-white/50 text-sm leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* TESTIMONIAL / SOCIAL PROOF */}
      {/* ============================================ */}
      <section className="py-24 bg-[#060a12]">
        <div className="max-w-4xl mx-auto px-6">
          <AnimatedSection>
            <div className="bg-gradient-to-br from-amber-500/5 to-orange-500/5 border border-amber-500/10 rounded-3xl p-8 md:p-12 relative overflow-hidden">
              <Quote size={80} className="absolute top-6 right-6 text-amber-500/10" />
              
              <div className="flex items-center gap-4 mb-8">
                <img src={BROERSMA_LOGO} alt="Bureau Broersma" className="h-10 brightness-0 invert" />
                <div className="h-8 w-px bg-white/10" />
                <span className="text-sm text-white/40">Technologie Partner</span>
              </div>

              <blockquote className="text-xl sm:text-2xl font-medium leading-relaxed mb-8 text-white/90">
                "Na 70 jaar constructieberekeningen weten wij: de grootste risico's zitten niet in de engineering, 
                maar in de documentatie. BouwBorg lost precies dat probleem op."
              </blockquote>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center text-amber-400 font-bold">
                  BB
                </div>
                <div>
                  <div className="font-semibold">Bureau Broersma</div>
                  <div className="text-sm text-white/40">Constructie & Advies sinds 1956</div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ============================================ */}
      {/* PRICING */}
      {/* ============================================ */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Transparante prijzen
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Geen verborgen kosten. U rekent de WKB-compliance fee door aan uw klant.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Aanbouw / Dakkapel",
                price: "€450",
                per: "per project",
                features: ["Smart glasses lease", "AI validatie", "WKB dossier", "30 dagen support"],
                popular: false
              },
              {
                name: "Nieuwbouw Woning",
                price: "€1.500",
                per: "per project",
                features: ["Alles van Aanbouw +", "Bureau Broersma check", "Constructeur validatie", "Woningpaspoort", "90 dagen support"],
                popular: true
              },
              {
                name: "Meerdere Woningen",
                price: "Custom",
                per: "op aanvraag",
                features: ["Volume korting", "Dedicated support", "API integraties", "White-label optie", "Onbeperkt support"],
                popular: false
              }
            ].map((plan, i) => (
              <AnimatedSection key={i} delay={i * 100}>
                <div className={`rounded-2xl p-8 h-full relative ${
                  plan.popular 
                    ? 'bg-gradient-to-b from-amber-500/10 to-orange-500/5 border-2 border-amber-500/30' 
                    : 'bg-white/[0.02] border border-white/5'
                }`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full">
                      MEEST GEKOZEN
                    </div>
                  )}
                  <div className="text-sm font-medium text-white/40 mb-2">{plan.name}</div>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                  </div>
                  <div className="text-sm text-white/40 mb-6">{plan.per}</div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-white/70">
                        <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button 
                    onClick={() => document.getElementById('demo-form')?.scrollIntoView({ behavior: 'smooth' })}
                    className={`w-full py-3 rounded-full font-medium transition-colors ${
                      plan.popular
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-400 hover:to-orange-400'
                        : 'bg-white/5 text-white hover:bg-white/10'
                    }`}
                  >
                    Start gesprek
                  </button>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={400} className="mt-8 text-center">
            <p className="text-sm text-white/30">
              Alle prijzen excl. BTW. Doorberekend aan eindklant als "WKB Compliance & Digitale Garantie".
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ============================================ */}
      {/* CTA / DEMO FORM */}
      {/* ============================================ */}
      <section id="demo-form" className="py-24 bg-[#060a12] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent" />
        
        <div className="max-w-2xl mx-auto px-6 relative z-10">
          <AnimatedSection className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-xs font-medium text-amber-400 mb-6">
              <Mail size={12} />
              Vrijblijvend
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Klaar om tijd terug te winnen?
            </h2>
            <p className="text-white/50 mb-10 max-w-md mx-auto">
              Plan een 30-minuten demo en zie hoe BouwBorg uw WKB-administratie automatiseert.
            </p>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                alert('Bedankt! We nemen binnen 24 uur contact op.');
                setEmail('');
                setCompany('');
              }}
              className="space-y-4 max-w-md mx-auto"
            >
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Bedrijfsnaam"
                required
                className="w-full px-5 py-4 bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-xl focus:border-amber-500/50 focus:outline-none transition-colors"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mailadres"
                required
                className="w-full px-5 py-4 bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-xl focus:border-amber-500/50 focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 font-semibold rounded-xl hover:from-amber-400 hover:to-orange-400 transition-colors flex items-center justify-center gap-2"
              >
                Plan Demo
                <ArrowRight size={18} />
              </button>
            </form>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8 text-sm text-white/30">
              <a href="tel:+31701234567" className="flex items-center gap-2 hover:text-white/50 transition-colors">
                <Phone size={14} />
                +31 (0)70 123 4567
              </a>
              <a href="mailto:sales@bouwborg.nl" className="flex items-center gap-2 hover:text-white/50 transition-colors">
                <Mail size={14} />
                sales@bouwborg.nl
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ============================================ */}
      {/* FOOTER */}
      {/* ============================================ */}
      <footer className="py-12 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img src="/generated/og-logo.png" alt="" className="h-6 brightness-0 invert opacity-40" />
              <span className="text-white/20">×</span>
              <span className="text-xs text-white/30">BouwBorg B2B Platform</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-white/30">
              <button onClick={() => setAppState(AppState.LANDING)} className="hover:text-white/50 transition-colors">
                Voor Particulieren →
              </button>
              <span>© 2025 Ooit Gedacht B.V.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
