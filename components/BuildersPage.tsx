import React, { useState, useEffect, useRef } from 'react';
import { PrimaryButton } from './PrimaryButton';
import { 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  Shield, 
  Eye,
  Zap,
  Clock,
  Camera,
  Cpu,
  Building2,
  HardHat,
  Glasses,
  Users,
  BadgeCheck,
  ChevronRight,
  Mail,
  Phone,
  AlertTriangle,
  XCircle,
  CheckCheck,
  Play,
  Quote,
  Heart,
  Coffee,
  Sun,
  Home
} from 'lucide-react';
import { AppState } from '../types';

const BROERSMA_LOGO = "https://www.bureau-broersma.nl/wp-content/uploads/2015/09/logo-broersma-bouwadvies.png";

interface BuildersPageProps {
  setAppState: (state: AppState) => void;
}

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
  const { ref, isInView } = useInView();
  return (
    <div ref={ref} className={`transition-all duration-700 ${className}`}
      style={{ opacity: isInView ? 1 : 0, transform: isInView ? 'translateY(0)' : 'translateY(30px)', transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

export const BuildersPage: React.FC<BuildersPageProps> = ({ setAppState }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-[#0a0f1a] w-full text-white min-h-screen">
      
      {/* NAV */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${isScrolled ? 'bg-[#0a0f1a]/95 backdrop-blur-xl border-b border-white/5' : ''}`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => setAppState(AppState.LANDING)} className="flex items-center gap-3 group">
            <ArrowLeft size={18} className="text-white/40 group-hover:text-white transition-colors" />
            <img src="/generated/og-logo.png" alt="OoitGedacht" className="h-7 brightness-0 invert opacity-70 group-hover:opacity-100 transition-opacity" />
          </button>
          <PrimaryButton 
            onClick={() => document.getElementById('demo-form')?.scrollIntoView({ behavior: 'smooth' })}
            size="sm"
          >
            Praat met ons
          </PrimaryButton>
        </div>
      </nav>

      {/* ============================================ */}
      {/* HERO - Cinematic Opening */}
      {/* ============================================ */}
      <section className="relative min-h-screen flex flex-col">
        {/* Full-bleed background */}
        <div className="absolute inset-0">
          <img 
            src="/generated/b2b/smart-glasses-on-site.jpg" 
            alt="" 
            className="w-full h-full object-cover scale-105"
            style={{ filter: 'brightness(0.4) contrast(1.1)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-[#0a0f1a]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f1a]/90 via-transparent to-transparent" />
        </div>

        {/* Main content - centered vertically */}
        <div className="relative z-10 flex-1 flex items-center">
          <div className="max-w-7xl mx-auto px-6 md:px-12 w-full py-32">
            <div className="max-w-3xl">
              
              {/* The line that haunts them */}
              <div className="mb-8 overflow-hidden">
                <p className="text-lg md:text-xl text-white/40 font-light tracking-wide animate-fade-in">
                  Drie jaar na oplevering. De telefoon gaat.
                </p>
              </div>

              {/* Main headline - massive, impactful */}
              <h1 className="mb-10">
                <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[0.95] tracking-tight text-white">
                  "Kunt u bewijzen
                </span>
                <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[0.95] tracking-tight text-white mt-2">
                  dat het goed is
                </span>
                <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[0.95] tracking-tight mt-2">
                  <span className="bg-gradient-to-r from-red-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
                    gebouwd?"
                  </span>
                </span>
              </h1>

              {/* The twist */}
              <div className="max-w-xl mb-12">
                <p className="text-xl md:text-2xl text-white/70 leading-relaxed font-light">
                  Je wéét dat je goed werk hebt geleverd.
                  <br />
                  <span className="text-white font-normal">Maar kun je het bewijzen?</span>
                </p>
              </div>

              {/* CTA - simple, direct */}
              <div className="flex flex-col sm:flex-row items-start gap-4 mb-16">
                <button 
                  onClick={() => document.getElementById('demo-form')?.scrollIntoView({ behavior: 'smooth' })}
                  className="group bg-white text-[#0a0f1a] px-10 py-5 text-lg font-semibold rounded-full hover:bg-white/90 transition-all flex items-center gap-3 shadow-2xl shadow-white/10"
                >
                  Wij lossen dit op
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-6 py-5 text-white/50 hover:text-white transition-colors text-lg"
                >
                  Hoe dan?
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Bottom bar - stats that hit */}
        <div className="relative z-10 border-t border-white/10 bg-[#0a0f1a]/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
              {[
                { value: "20", unit: "jaar", label: "aansprakelijkheid onder Wkb" },
                { value: "73", unit: "%", label: "van aannemers mist goed bewijs" },
                { value: "€47K", unit: "", label: "gemiddelde schade bij claims" },
                { value: "4+", unit: "uur", label: "admin per week kwijt" },
              ].map((stat, i) => (
                <div key={i} className="py-6 md:py-8 px-4 md:px-8 text-center md:text-left">
                  <div className="flex items-baseline justify-center md:justify-start gap-1">
                    <span className="text-2xl md:text-3xl font-bold text-white">{stat.value}</span>
                    <span className="text-lg md:text-xl font-bold text-amber-400">{stat.unit}</span>
                  </div>
                  <div className="text-xs md:text-sm text-white/40 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-24 md:bottom-28 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20 z-10">
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-white/40 animate-pulse" />
        </div>
      </section>

      {/* ============================================ */}
      {/* THE MOMENT - Make them feel it */}
      {/* ============================================ */}
      <section className="py-32 bg-[#060a12] relative">
        <div className="max-w-4xl mx-auto px-6">
          <AnimatedSection>
            <div className="text-center mb-20">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 leading-tight">
                Je kent dit moment.
              </h2>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 md:p-12 mb-12">
              <p className="text-xl md:text-2xl text-white/70 leading-relaxed mb-8">
                Het is <span className="text-white">drie jaar</span> na oplevering. 
                Je telefoon gaat. Een advocaat.
              </p>
              <p className="text-xl md:text-2xl text-white/70 leading-relaxed mb-8">
                <em>"Mijn cliënt heeft vochtproblemen. De isolatie is niet correct aangebracht. 
                Kunt u bewijzen dat het werk volgens specificaties is uitgevoerd?"</em>
              </p>
              <p className="text-xl md:text-2xl text-white/70 leading-relaxed mb-8">
                Je zoekt in WhatsApp. Foto's zonder datum. 
                Je zoekt in je mail. Niks. 
                Je zoekt in die la met bonnetjes. <span className="text-red-400">Verdwenen.</span>
              </p>
              <p className="text-2xl md:text-3xl text-white font-medium">
                Je wéét dat je het goed hebt gedaan.
                <br />
                Maar je kunt het niet bewijzen.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={400}>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="p-6">
                <div className="text-4xl font-bold text-red-400 mb-2">20 jaar</div>
                <div className="text-white/50">Zo lang ben je aansprakelijk onder de Wkb</div>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold text-red-400 mb-2">73%</div>
                <div className="text-white/50">Van aannemers heeft geen waterdicht bewijssysteem</div>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold text-red-400 mb-2">1 op 8</div>
                <div className="text-white/50">Bouwprojecten eindigt in een geschil</div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ============================================ */}
      {/* THE DAILY GRIND - Current reality */}
      {/* ============================================ */}
      <section className="py-32 relative">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              En ondertussen, elke dag...
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <AnimatedSection>
              <div className="space-y-6">
                {[
                  { time: "06:45", text: "Alarm. Koffie. WhatsApp al vol met foto's van gisteren die je moet 'ergens opslaan'." },
                  { time: "12:30", text: "Lunchpauze? Nee, facturen invoeren. Bonnetjes zoeken. Excel bijwerken." },
                  { time: "17:00", text: "Klaar op de bouwplaats. Nu nog 2 uur administratie thuis." },
                  { time: "21:00", text: "Kinderen naar bed gebracht. Laptop open. Nog even dat dossier..." },
                  { time: "23:30", text: "Eindelijk klaar. Morgen weer. En overmorgen. En..." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="text-sm font-mono text-amber-400/60 w-14 flex-shrink-0 pt-1">{item.time}</div>
                    <div className="text-white/60 leading-relaxed">{item.text}</div>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <div className="bg-gradient-to-br from-red-500/10 to-orange-500/5 border border-red-500/10 rounded-3xl p-8 md:p-10">
                <div className="text-5xl mb-6">😔</div>
                <p className="text-xl text-white/80 leading-relaxed mb-6">
                  "Ik ben aannemer geworden omdat ik graag bouw. 
                  Niet om 's avonds Excel-sheets in te vullen terwijl mijn kinderen slapen."
                </p>
                <div className="text-white/40 text-sm">
                  — Gesprek met aannemer, november 2024
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* THE SHIFT - There's another way */}
      {/* ============================================ */}
      <section className="py-32 bg-[#060a12] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent" />
        
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <AnimatedSection className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-sm font-medium text-emerald-400 mb-8">
              <Zap size={14} />
              Er is een andere manier
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 leading-tight">
              Stel je voor dat je gewoon
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                kon bouwen.
              </span>
            </h2>

            <p className="text-xl text-white/60 leading-relaxed max-w-2xl mx-auto mb-12">
              Zonder gedoe. Zonder stress over of je wel alles hebt vastgelegd.
              Zonder die knoop in je maag als je aan claims denkt.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <div className="grid sm:grid-cols-3 gap-6 text-center">
              {[
                { icon: <Sun size={28} />, title: "Ochtendritueel", desc: "Bril op, aan het werk. Alles wordt automatisch vastgelegd." },
                { icon: <Coffee size={28} />, title: "Lunchpauze", desc: "Echt pauze. Geen administratie. Het systeem draait door." },
                { icon: <Home size={28} />, title: "Thuiskomen", desc: "Laptop dicht. Tijd voor je gezin. Het dossier bouwt zichzelf." },
              ].map((item, i) => (
                <div key={i} className="bg-white/[0.02] border border-white/5 rounded-2xl p-8">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4 text-emerald-400">
                    {item.icon}
                  </div>
                  <div className="font-semibold mb-2">{item.title}</div>
                  <div className="text-white/50 text-sm">{item.desc}</div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ============================================ */}
      {/* THE SOLUTION - How it works */}
      {/* ============================================ */}
      <section id="how-it-works" className="py-32">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Zo simpel is het</h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Geen complexe systemen. Geen training. Gewoon werken.
            </p>
          </AnimatedSection>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <img 
                src="/generated/b2b/smart-glasses-workflow.jpg" 
                alt="BouwBorg in actie" 
                className="rounded-3xl shadow-2xl shadow-black/50"
              />
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <div className="space-y-10">
                {[
                  {
                    num: "01",
                    icon: <Glasses size={24} />,
                    title: "Zet de bril op",
                    desc: "Een veiligheidsbril die je toch al draagt. Nu met ingebouwde camera en GPS."
                  },
                  {
                    num: "02",
                    icon: <Eye size={24} />,
                    title: "Werk zoals je altijd doet",
                    desc: "De bril herkent automatisch wat je doet. Wapening leggen? Check. Beton storten? Check."
                  },
                  {
                    num: "03",
                    icon: <Cpu size={24} />,
                    title: "AI + Expert validatie",
                    desc: "Ons systeem checkt of alles klopt. Bij twijfel kijkt een echte constructeur mee. Binnen 4 uur."
                  },
                  {
                    num: "04",
                    icon: <CheckCheck size={24} />,
                    title: "Klaar.",
                    desc: "Volledig WKB-dossier. Timestamped. GPS-verified. 20 jaar juridisch waterdicht."
                  }
                ].map((step, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/20 flex items-center justify-center">
                        <span className="text-amber-400 font-bold">{step.num}</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold mb-2 flex items-center gap-3">
                        {step.title}
                        <span className="text-white/20">{step.icon}</span>
                      </h4>
                      <p className="text-white/50 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* THE STACK - What you get */}
      {/* ============================================ */}
      <section className="py-32 bg-[#060a12]">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Alles in één pakket</h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Glasses size={32} />,
                title: "Smart Veiligheidsbril",
                features: ["4K camera", "GPS tracking", "8 uur batterij", "Stof- en waterbestendig"],
                gradient: "from-amber-500 to-orange-500"
              },
              {
                icon: <Cpu size={32} />,
                title: "BouwBorg Platform",
                features: ["Automatische fasedectie", "Realtime sync", "Klant-portaal", "Milestone tracking"],
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: <BadgeCheck size={32} />,
                title: "Expert Verificatie",
                features: ["Bureau Broersma validatie", "4 uur SLA", "Constructeur check", "Juridisch waterdicht"],
                gradient: "from-emerald-500 to-green-500"
              }
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 100}>
                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 h-full hover:border-white/10 transition-colors">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-6 text-white shadow-lg`}>
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                  <ul className="space-y-3">
                    {item.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2 text-white/60 text-sm">
                        <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* THE PROOF - Bureau Broersma */}
      {/* ============================================ */}
      <section className="py-32 relative">
        <div className="absolute inset-0">
          <img src="/generated/b2b/smart-glasses-collaboration.jpg" alt="" className="w-full h-full object-cover opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-[#0a0f1a]/90 to-[#0a0f1a]" />
        </div>

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <AnimatedSection>
            <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 rounded-3xl p-10 md:p-14 relative overflow-hidden">
              <Quote size={100} className="absolute top-4 right-4 text-amber-500/10" />
              
              <div className="flex items-center gap-4 mb-10">
                <img src={BROERSMA_LOGO} alt="Bureau Broersma" className="h-12 brightness-0 invert" />
              </div>

              <blockquote className="text-2xl md:text-3xl font-medium leading-relaxed mb-10 text-white/90">
                "In 70 jaar constructieberekeningen hebben we gezien wat er misgaat. 
                Het is bijna nooit de engineering. Het is altijd het papierwerk.
                <br /><br />
                BouwBorg lost het probleem op waar niemand over praat maar iedereen last van heeft."
              </blockquote>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500/30 to-orange-500/20 flex items-center justify-center">
                  <Building2 size={24} className="text-amber-400" />
                </div>
                <div>
                  <div className="font-semibold text-lg">Bureau Broersma</div>
                  <div className="text-white/40">Constructie & Advies • Est. 1956 • 19.000+ projecten</div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ============================================ */}
      {/* PRICING - Simple and clear */}
      {/* ============================================ */}
      <section className="py-32 bg-[#060a12]">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Wat kost rust?</h2>
            <p className="text-white/50 max-w-xl mx-auto">
              De kosten reken je door aan je klant. Zij krijgen een digitaal woningpaspoort, jij krijgt gemoedsrust.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Aanbouw",
                subtitle: "Dakkapel, uitbouw, renovatie",
                price: "€450",
                popular: false
              },
              {
                name: "Nieuwbouw",
                subtitle: "Complete woningbouw",
                price: "€1.500",
                popular: true
              },
              {
                name: "Meerdere",
                subtitle: "Projecten of woningen",
                price: "Bel ons",
                popular: false
              }
            ].map((plan, i) => (
              <AnimatedSection key={i} delay={i * 100}>
                <div className={`rounded-3xl p-8 h-full text-center relative ${
                  plan.popular 
                    ? 'bg-gradient-to-b from-amber-500/15 to-orange-500/5 border-2 border-amber-500/40' 
                    : 'bg-white/[0.02] border border-white/5'
                }`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full">
                      MEEST GEKOZEN
                    </div>
                  )}
                  <div className="text-lg font-semibold mb-1">{plan.name}</div>
                  <div className="text-sm text-white/40 mb-6">{plan.subtitle}</div>
                  <div className="text-4xl font-bold mb-8">{plan.price}</div>
                  <button 
                    onClick={() => document.getElementById('demo-form')?.scrollIntoView({ behavior: 'smooth' })}
                    className={`w-full py-3 rounded-full font-medium transition-colors ${
                      plan.popular
                        ? 'bg-white text-[#0a0f1a] hover:bg-white/90'
                        : 'bg-white/5 text-white hover:bg-white/10'
                    }`}
                  >
                    Neem contact op
                  </button>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={400} className="mt-10 text-center text-sm text-white/30">
            Inclusief: bril lease, software, AI validatie, expert checks, support. Geen verrassingen.
          </AnimatedSection>
        </div>
      </section>

      {/* ============================================ */}
      {/* FINAL CTA - Emotional close */}
      {/* ============================================ */}
      <section id="demo-form" className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#060a12] to-[#0a0f1a]" />
        
        <div className="max-w-2xl mx-auto px-6 relative z-10">
          <AnimatedSection className="text-center">
            <div className="mb-10">
              <Heart size={48} className="mx-auto text-red-400/60 mb-6" />
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 leading-tight">
                Je bent aannemer geworden
                <br />
                om te bouwen.
              </h2>
              <p className="text-xl text-white/60 leading-relaxed">
                Niet om 's avonds administratie te doen.
                Niet om wakker te liggen over claims.
                <br /><br />
                <strong className="text-white">Laat ons het papierwerk doen.</strong>
                <br />
                Zodat jij kunt doen waar je goed in bent.
              </p>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                alert('Bedankt! We bellen je binnen 24 uur.');
                setEmail(''); setCompany(''); setPhone('');
              }}
              className="space-y-4 max-w-md mx-auto mb-10"
            >
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Je bedrijfsnaam"
                required
                className="w-full px-6 py-4 bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-2xl focus:border-amber-500/50 focus:outline-none transition-colors text-center"
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Je telefoonnummer"
                required
                className="w-full px-6 py-4 bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-2xl focus:border-amber-500/50 focus:outline-none transition-colors text-center"
              />
              <button
                type="submit"
                className="w-full bg-white text-[#0a0f1a] py-4 font-semibold rounded-2xl hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
              >
                Bel mij terug
                <Phone size={18} />
              </button>
            </form>

            <p className="text-white/30 text-sm">
              Geen verplichtingen. Gewoon een goed gesprek over jouw situatie.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/generated/og-logo.png" alt="" className="h-5 brightness-0 invert opacity-30" />
            <span className="text-xs text-white/20">× BouwBorg</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-white/20">
            <button onClick={() => setAppState(AppState.LANDING)} className="hover:text-white/40 transition-colors">
              Voor particulieren →
            </button>
            <span>© 2025</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
