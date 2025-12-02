import React, { useState, useEffect, useRef } from 'react';
import { AppState } from '../types';
import {
  ArrowLeft,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Home,
  Euro,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  Target,
  Zap,
  Shield,
  MapPin,
  Building2,
  ChevronDown,
  ChevronUp,
  Layers,
  FileText,
  Bot,
  Sparkles,
  PieChart,
  Activity,
  Award,
  X,
  Play,
  Pause
} from 'lucide-react';

interface MarketResearchPresentationProps {
  setAppState: (state: AppState) => void;
}

// Animated counter hook
const useCountUp = (end: number, duration: number = 2000, startOnView: boolean = true, decimals: number = 0) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(!startOnView);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!startOnView) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasStarted, startOnView]);

  useEffect(() => {
    if (!hasStarted) return;
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Number((easeOut * end).toFixed(decimals)));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration, hasStarted, decimals]);

  return { count, ref };
};

// Slide indicator component
const SlideIndicator: React.FC<{ current: number; total: number; onNavigate: (index: number) => void }> = ({ current, total, onNavigate }) => {
  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onNavigate(i)}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            i === current 
              ? 'bg-white w-3 h-3' 
              : 'bg-white/30 hover:bg-white/50'
          }`}
        />
      ))}
    </div>
  );
};

// Big stat component
const BigStat: React.FC<{
  value: string | number;
  label: string;
  sublabel?: string;
  color?: string;
  prefix?: string;
  suffix?: string;
}> = ({ value, label, sublabel, color = 'text-white', prefix = '', suffix = '' }) => {
  return (
    <div className="text-center">
      <div className={`text-6xl md:text-8xl lg:text-9xl font-mono font-bold ${color} tracking-tight`}>
        {prefix}{value}{suffix}
      </div>
      <div className="text-xl md:text-2xl text-white/80 mt-4 font-light">{label}</div>
      {sublabel && <div className="text-sm text-white/50 mt-2">{sublabel}</div>}
    </div>
  );
};

// Animated stat card
const StatCard: React.FC<{
  icon: React.ElementType;
  value: string;
  label: string;
  color: string;
  delay?: number;
}> = ({ icon: Icon, value, label, color, delay = 0 }) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div 
      ref={ref}
      className={`p-6 bg-white/5 border border-white/10 transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <Icon className={color} size={28} />
      <div className="text-3xl md:text-4xl font-mono font-bold text-white mt-4">{value}</div>
      <div className="text-white/60 mt-2">{label}</div>
    </div>
  );
};

export const MarketResearchPresentation: React.FC<MarketResearchPresentationProps> = ({ setAppState }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Counters
  const shortage = useCountUp(401000, 2000);
  const faalkosten = useCountUp(5, 1500);
  const overrun = useCountUp(98, 1800);
  const savings = useCountUp(65000, 2000);
  const tam = useCountUp(40, 1500);
  const productivity = useCountUp(20, 1500);

  const totalSlides = 12;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        setCurrentSlide(prev => Math.min(prev + 1, totalSlides - 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlide(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Escape') {
        setAppState(AppState.LANDING);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setAppState]);

  // Auto-play
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => {
        if (prev >= totalSlides - 1) {
          setIsAutoPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 8000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Scroll to slide
  useEffect(() => {
    const slideElement = document.getElementById(`slide-${currentSlide}`);
    if (slideElement) {
      slideElement.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentSlide]);

  return (
    <div ref={containerRef} className="bg-[#0a1628] text-white min-h-screen">
      {/* Fixed Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => setAppState(AppState.LANDING)}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Terug</span>
          </button>
          
          <div className="text-center">
            <span className="text-white/40 text-sm font-mono">
              {currentSlide + 1} / {totalSlides}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {isAutoPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>
            <button
              onClick={() => setAppState(AppState.WIZARD_STEP_TYPE)}
              className="bg-blue-400 text-[#0a1628] px-4 py-2 text-sm font-bold hover:bg-blue-300 transition-colors rounded-lg"
            >
              Start Bouwen →
            </button>
          </div>
        </div>
      </nav>

      {/* Slide Indicators */}
      <SlideIndicator current={currentSlide} total={totalSlides} onNavigate={setCurrentSlide} />

      {/* SLIDE 0: Title */}
      <section id="slide-0" className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a0a0a] to-[#0a0a0a]" />
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-red-500/10 rounded-full blur-[200px]" />
        
        <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8">
            <BarChart3 size={14} className="text-white/60" />
            <span className="text-xs font-bold uppercase tracking-widest text-white/60">Marktonderzoek Rapport</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif leading-[0.9] mb-8">
            Het <span className="text-red-500 italic">€10 Miljard</span><br />
            Probleem
          </h1>
          
          <p className="text-xl md:text-2xl text-white/60 max-w-3xl mx-auto font-light mb-12">
            Waarom bouwtechnologie de Nederlandse woningmarkt zal transformeren
          </p>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setCurrentSlide(1)}
              className="bg-blue-400 text-[#0a1628] px-8 py-4 font-bold hover:bg-blue-300 transition-colors flex items-center gap-3 rounded-xl"
            >
              Start Presentatie
              <ArrowRight size={20} />
            </button>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <ChevronDown size={24} className="text-white/40" />
          </div>
        </div>
      </section>

      {/* SLIDE 1: The Housing Crisis */}
      <section id="slide-1" className="min-h-screen flex items-center justify-center relative py-32 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a12] to-[#0a0a0a]" />
        
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <span className="text-red-400 text-sm font-mono uppercase tracking-widest">De Crisis</span>
          
          <h2 className="text-4xl md:text-6xl font-serif mt-4 mb-16">
            Nederland heeft een tekort van <span className="text-red-500">401.000</span> woningen.
          </h2>

          <div ref={shortage.ref} className="mb-16">
            <BigStat 
              value={shortage.count.toLocaleString()} 
              label="Woningen Tekort" 
              sublabel="4.9% van de totale woningvoorraad"
              color="text-red-500"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={Target} value="100K" label="Jaarlijks doel" color="text-green-400" delay={0} />
            <StatCard icon={Home} value="82K" label="2024 productie" color="text-yellow-400" delay={100} />
            <StatCard icon={Clock} value="4+" label="Jaren achterstand" color="text-red-400" delay={200} />
            <StatCard icon={TrendingUp} value="+4.8%" label="Prijsstijging YoY" color="text-orange-400" delay={300} />
          </div>
        </div>
      </section>

      {/* SLIDE 2: Affordability */}
      <section id="slide-2" className="min-h-screen flex items-center justify-center relative py-32 px-6">
        <div className="absolute inset-0 bg-[#0a1628]" />
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-orange-400 text-sm font-mono uppercase tracking-widest">Betaalbaarheidscrisis</span>
            <h2 className="text-4xl md:text-6xl font-serif mt-4">
              <span className="text-orange-500">75%</span> kan het niet betalen.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              {[
                { income: 'Modaal (€40K)', afford: '€180K', gap: '€252K', width: '37%' },
                { income: '1.5x Modaal (€60K)', afford: '€280K', gap: '€152K', width: '57%' },
                { income: '2x Modaal (€80K)', afford: '€380K', gap: '€52K', width: '78%' },
                { income: 'Tweeverdieners (€100K)', afford: '€475K', gap: '€0', width: '97%' },
              ].map((item, i) => (
                <div key={i} className="bg-white/5 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-white/80">{item.income}</span>
                    <span className={item.gap === '€0' ? 'text-green-400' : 'text-red-400'}>
                      {item.gap === '€0' ? '✓ Haalbaar' : `Gap: ${item.gap}`}
                    </span>
                  </div>
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        item.gap === '€0' ? 'bg-green-500' : 'bg-gradient-to-r from-orange-500 to-red-500'
                      }`}
                      style={{ width: item.width }}
                    />
                  </div>
                  <div className="text-xs text-white/40 mt-1">Kan betalen: {item.afford}</div>
                </div>
              ))}
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl">
              <div className="text-8xl font-mono font-bold text-orange-500">€493K</div>
              <div className="text-xl text-white/60 mt-4">Gemiddelde nieuwbouwwoning</div>
              <div className="text-sm text-white/40 mt-2">CBS Q4 2024</div>
            </div>
          </div>
        </div>
      </section>

      {/* SLIDE 3: Faalkosten */}
      <section id="slide-3" className="min-h-screen flex items-center justify-center relative py-32 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a0505] to-[#0a0a0a]" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[150px]" />
        
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <span className="text-red-400 text-sm font-mono uppercase tracking-widest">Het Kernprobleem</span>
          
          <h2 className="text-4xl md:text-6xl font-serif mt-4 mb-8">
            <span className="text-red-500">€5 Miljard</span> verspild per jaar.
          </h2>
          
          <p className="text-xl text-white/60 max-w-2xl mx-auto mb-16">
            "Faalkosten" — rework, fouten, miscommunicatie, verspilling. 
            Een geaccepteerde inefficiëntie in de bouwsector.
          </p>

          <div ref={faalkosten.ref} className="mb-16">
            <div className="text-[12rem] md:text-[16rem] font-mono font-bold text-red-500 leading-none">
              €{faalkosten.count}B
            </div>
            <div className="text-2xl text-white/60 mt-4">Per jaar verloren</div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white/5 p-4 border-l-2 border-red-500">
              <div className="text-3xl font-mono font-bold text-white">40%</div>
              <div className="text-sm text-white/50">schat 5%+ faalkosten</div>
            </div>
            <div className="bg-white/5 p-4 border-l-2 border-red-500">
              <div className="text-3xl font-mono font-bold text-white">25%</div>
              <div className="text-sm text-white/50">zegt: geen prioriteit</div>
            </div>
            <div className="bg-white/5 p-4 border-l-2 border-red-500">
              <div className="text-3xl font-mono font-bold text-white">5-13%</div>
              <div className="text-sm text-white/50">per project verloren</div>
            </div>
            <div className="bg-white/5 p-4 border-l-2 border-red-500">
              <div className="text-3xl font-mono font-bold text-white">€100B</div>
              <div className="text-sm text-white/50">sector omzet/jaar</div>
            </div>
          </div>
        </div>
      </section>

      {/* SLIDE 4: Breakdown */}
      <section id="slide-4" className="min-h-screen flex items-center justify-center relative py-32 px-6">
        <div className="absolute inset-0 bg-[#0a1628]" />
        
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-red-400 text-sm font-mono uppercase tracking-widest">Grondoorzaken</span>
            <h2 className="text-4xl md:text-5xl font-serif mt-4">
              Waar gaat het mis?
            </h2>
          </div>

          <div className="space-y-6">
            {[
              { label: 'Communicatiefouten', pct: 30, color: 'bg-red-500', cost: '€15-30K' },
              { label: 'Design wijzigingen', pct: 25, color: 'bg-orange-500', cost: '€12.5-25K' },
              { label: 'Materiaalverspilling', pct: 15, color: 'bg-yellow-500', cost: '€7.5-15K' },
              { label: 'Rework door kwaliteit', pct: 15, color: 'bg-amber-500', cost: '€7.5-15K' },
              { label: 'Planning coördinatie', pct: 10, color: 'bg-orange-400', cost: '€5-10K' },
              { label: 'Overig', pct: 5, color: 'bg-red-400', cost: '€2.5-5K' },
            ].map((item, i) => (
              <div key={i} className="group">
                <div className="flex justify-between mb-2">
                  <span className="text-white/80 group-hover:text-white transition-colors">{item.label}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-white/40 text-sm">{item.cost}</span>
                    <span className="font-mono font-bold text-white">{item.pct}%</span>
                  </div>
                </div>
                <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
            <p className="text-lg text-white/80 italic">
              "Faalkosten lijken een bijna geaccepteerde inefficiëntie in de bouwsector"
            </p>
            <p className="text-sm text-red-400 mt-2">— ABN AMRO Research</p>
          </div>
        </div>
      </section>

      {/* SLIDE 5: Global Crisis - McKinsey */}
      <section id="slide-5" className="min-h-screen flex items-center justify-center relative py-32 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] to-[#050510]" />
        
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <span className="text-blue-400 text-sm font-mono uppercase tracking-widest">Mondiaal Perspectief</span>
          
          <h2 className="text-4xl md:text-6xl font-serif mt-4 mb-16">
            <span className="text-blue-400">98%</span> van projecten loopt uit budget.
          </h2>

          <div ref={overrun.ref} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="p-8 bg-white/5 border border-white/10 rounded-xl">
              <div className="text-7xl font-mono font-bold text-red-500">{overrun.count}%</div>
              <div className="text-white/60 mt-4">Kostenoverschrijding &gt;30%</div>
              <div className="text-xs text-white/40 mt-1">Megaprojecten</div>
            </div>
            <div className="p-8 bg-white/5 border border-white/10 rounded-xl">
              <div className="text-7xl font-mono font-bold text-orange-500">77%</div>
              <div className="text-white/60 mt-4">Minimaal 40% te laat</div>
              <div className="text-xs text-white/40 mt-1">Vertraging planning</div>
            </div>
            <div className="p-8 bg-white/5 border border-white/10 rounded-xl">
              <div className="text-7xl font-mono font-bold text-yellow-500">80%</div>
              <div className="text-white/60 mt-4">Gemiddelde overschrijding</div>
              <div className="text-xs text-white/40 mt-1">Van origineel budget</div>
            </div>
          </div>

          <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <p className="text-lg text-white/80">
              "De bouw is de <strong className="text-blue-400">enige grote industrie</strong> met negatieve productiviteitsgroei over 40 jaar."
            </p>
            <p className="text-sm text-blue-400 mt-2">— McKinsey Global Institute</p>
          </div>
        </div>
      </section>

      {/* SLIDE 6: Productivity Paradox */}
      <section id="slide-6" className="min-h-screen flex items-center justify-center relative py-32 px-6">
        <div className="absolute inset-0 bg-[#0a1628]" />
        
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-blue-400 text-sm font-mono uppercase tracking-widest">De Productiviteitsparadox</span>
            <h2 className="text-4xl md:text-5xl font-serif mt-4">
              40 jaar. Geen vooruitgang.
            </h2>
          </div>

          <div ref={productivity.ref} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              {[
                { industry: 'Landbouw', change: '+150%', color: 'bg-green-500', width: '100%' },
                { industry: 'Maakindustrie', change: '+100%', color: 'bg-green-500', width: '67%' },
                { industry: 'Detailhandel', change: '+80%', color: 'bg-green-500', width: '53%' },
                { industry: 'Bouw', change: '-20%', color: 'bg-red-500', width: '13%', negative: true },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-2">
                    <span className="text-white/80">{item.industry}</span>
                    <span className={`font-mono font-bold ${item.negative ? 'text-red-500' : 'text-green-500'}`}>
                      {item.change}
                    </span>
                  </div>
                  <div className="h-4 bg-white/10 rounded-full overflow-hidden flex items-center">
                    {item.negative ? (
                      <div className="w-full flex justify-end">
                        <div className={`h-full ${item.color} rounded-full`} style={{ width: item.width }} />
                      </div>
                    ) : (
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: item.width }} />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-2xl">
              <TrendingDown className="w-20 h-20 text-red-500 mx-auto mb-4" />
              <div className="text-6xl font-mono font-bold text-red-500">-{productivity.count}%</div>
              <div className="text-xl text-white/60 mt-4">Productiviteitsdaling</div>
              <div className="text-sm text-white/40 mt-2">Bouw sector (1962-2002)</div>
            </div>
          </div>
        </div>
      </section>

      {/* SLIDE 7: The Opportunity */}
      <section id="slide-7" className="min-h-screen flex items-center justify-center relative py-32 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#0a1a0a] to-[#0a0a0a]" />
        <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-green-500/10 rounded-full blur-[200px]" />
        
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <span className="text-green-400 text-sm font-mono uppercase tracking-widest">De Kans</span>
          
          <h2 className="text-4xl md:text-6xl font-serif mt-4 mb-8">
            <span className="text-green-400">€40 Miljard</span> markt. Per jaar.
          </h2>
          
          <p className="text-xl text-white/60 max-w-2xl mx-auto mb-16">
            Nieuwe woningbouw in Nederland. Enorme inefficiëntie. 
            Klaar voor transformatie.
          </p>

          <div ref={tam.ref} className="mb-16">
            <div className="text-[10rem] md:text-[14rem] font-mono font-bold text-green-500 leading-none">
              €{tam.count}B
            </div>
            <div className="text-2xl text-white/60 mt-4">Totale marktomvang</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-6 bg-white/5 border border-green-500/20 rounded-xl">
              <div className="text-4xl font-mono font-bold text-green-400">€5B</div>
              <div className="text-white/60 mt-2">Faalkosten</div>
              <div className="text-xs text-white/40">Te capturen</div>
            </div>
            <div className="p-6 bg-white/5 border border-green-500/20 rounded-xl">
              <div className="text-4xl font-mono font-bold text-green-400">10-15K</div>
              <div className="text-white/60 mt-2">Particuliere bouw/jaar</div>
              <div className="text-xs text-white/40">Directe doelgroep</div>
            </div>
            <div className="p-6 bg-white/5 border border-green-500/20 rounded-xl">
              <div className="text-4xl font-mono font-bold text-green-400">€2B</div>
              <div className="text-white/60 mt-2">Te behalen besparingen</div>
              <div className="text-xs text-white/40">Per jaar</div>
            </div>
          </div>
        </div>
      </section>

      {/* SLIDE 8: Per-Project Savings */}
      <section id="slide-8" className="min-h-screen flex items-center justify-center relative py-32 px-6">
        <div className="absolute inset-0 bg-[#0a1628]" />
        
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-green-400 text-sm font-mono uppercase tracking-widest">Per Project</span>
            <h2 className="text-4xl md:text-5xl font-serif mt-4">
              <span className="text-green-400">€65.000</span> besparing per woning.
            </h2>
          </div>

          <div ref={savings.ref} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              {[
                { label: 'Faalkosten eliminatie', amount: '€25-50K', icon: AlertTriangle },
                { label: 'Risico-marge reductie', amount: '€15-25K', icon: Shield },
                { label: 'Design iteratie reductie', amount: '€5-10K', icon: Layers },
                { label: 'Vergunning versnelling', amount: '€10-20K', icon: FileText },
                { label: 'Collectieve grondaankoop', amount: '€10-30K', icon: MapPin },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-white/5 border-l-2 border-green-500 hover:bg-white/10 transition-colors">
                  <item.icon className="text-green-400 flex-shrink-0" size={24} />
                  <div className="flex-1">
                    <div className="text-white/80">{item.label}</div>
                  </div>
                  <div className="text-xl font-mono font-bold text-green-400">{item.amount}</div>
                </div>
              ))}
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/30 rounded-2xl">
              <div className="text-8xl font-mono font-bold text-green-400">
                €{savings.count.toLocaleString()}
              </div>
              <div className="text-2xl text-white/60 mt-4">Totale besparing</div>
              <div className="text-sm text-white/40 mt-2">Conservatieve schatting</div>
              
              <div className="mt-8 pt-8 border-t border-white/10">
                <div className="text-lg text-white/60">Bij 5.000 woningen/jaar</div>
                <div className="text-4xl font-mono font-bold text-white mt-2">€325M</div>
                <div className="text-sm text-green-400">waarde geleverd</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SLIDE 9: The Solution */}
      <section id="slide-9" className="min-h-screen flex items-center justify-center relative py-32 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a14] to-[#0a0a0a]" />
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-blue-400 text-sm font-mono uppercase tracking-widest">De Oplossing</span>
            <h2 className="text-4xl md:text-6xl font-serif mt-4">
              Bouw <span className="text-blue-400">Besturingssysteem</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                icon: MapPin, 
                title: 'Collectief kavelzoeken', 
                desc: 'Community scant bestemmingsplannen. AI matcht jouw wensen met beschikbare grond.',
                color: 'text-green-400',
                border: 'border-green-500/20'
              },
              { 
                icon: Shield, 
                title: 'Expertvalidatie', 
                desc: 'Bureau Broersma (90+ jaar, 10K+ projecten) valideert elk ontwerp en elke mijlpaal.',
                color: 'text-blue-400',
                border: 'border-blue-500/20'
              },
              { 
                icon: Zap, 
                title: 'Mijlpaalbetalingen', 
                desc: 'Betaal alleen bij goedgekeurd werk. Geen zwarte doos, volledige transparantie.',
                color: 'text-amber-400',
                border: 'border-amber-500/20'
              },
              { 
                icon: Bot, 
                title: 'AI Assistent (Homie)', 
                desc: 'Altijd één stap voor. Beantwoordt al je vragen in normale taal.',
                color: 'text-purple-400',
                border: 'border-purple-500/20'
              },
              { 
                icon: FileText, 
                title: 'Documentenkluis', 
                desc: 'Alle documenten op één plek. Van ontwerp tot oplevering.',
                color: 'text-cyan-400',
                border: 'border-cyan-500/20'
              },
              { 
                icon: Activity, 
                title: 'Realtime Overzicht', 
                desc: 'Gestructureerde werkstromen. Altijd weten waar je staat.',
                color: 'text-pink-400',
                border: 'border-pink-500/20'
              },
            ].map((item, i) => (
              <div key={i} className={`p-6 bg-white/5 border ${item.border} rounded-xl hover:bg-white/10 transition-colors group`}>
                <item.icon className={`${item.color} mb-4 group-hover:scale-110 transition-transform`} size={32} />
                <h3 className="text-xl font-serif text-white mb-2">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SLIDE 10: Why Now */}
      <section id="slide-10" className="min-h-screen flex items-center justify-center relative py-32 px-6">
        <div className="absolute inset-0 bg-[#0a1628]" />
        
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-white/60 text-sm font-mono uppercase tracking-widest">Het Moment</span>
            <h2 className="text-4xl md:text-6xl font-serif mt-4">
              Waarom <span className="text-green-400">nu</span>?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: AlertTriangle, title: 'Woningcrisis op piek', desc: 'Maximale urgentie, politieke wil voor verandering', color: 'text-red-400' },
              { icon: Sparkles, title: 'AI-technologie volwassen', desc: 'Ontwerpgeneratie en begeleiding via automatisering nu haalbaar', color: 'text-purple-400' },
              { icon: FileText, title: 'Omgevingswet transitie', desc: 'Verwarring creëert behoefte aan begeleiding', color: 'text-blue-400' },
              { icon: Euro, title: 'Digitale betalingen', desc: 'Mijlpaalgerichte betalingen nu gemeengoed', color: 'text-green-400' },
              { icon: Home, title: 'Thuiswerk trend', desc: 'Meer mensen bouwen buiten steden', color: 'text-amber-400' },
              { icon: Shield, title: 'Wkb implementatie', desc: 'Kwaliteitsborging vereist onze documentatie-aanpak', color: 'text-cyan-400' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-6 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-colors">
                <div className={`p-3 bg-white/10 rounded-lg ${item.color}`}>
                  <item.icon size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-1">{item.title}</h3>
                  <p className="text-white/50 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SLIDE 11: Traction */}
      <section id="slide-11" className="min-h-screen flex items-center justify-center relative py-32 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#0a100a] to-[#0a0a0a]" />
        
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <span className="text-green-400 text-sm font-mono uppercase tracking-widest">Tractie</span>
          
          <h2 className="text-4xl md:text-6xl font-serif mt-4 mb-16">
            Niet vanaf nul.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="p-8 bg-white/5 border border-white/10 rounded-xl">
              <Award className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <div className="text-5xl font-mono font-bold text-white">90+</div>
              <div className="text-white/60 mt-2">Jaar ervaring</div>
              <div className="text-xs text-green-400 mt-1">Bureau Broersma</div>
            </div>
            <div className="p-8 bg-white/5 border border-white/10 rounded-xl">
              <Building2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <div className="text-5xl font-mono font-bold text-white">10K+</div>
              <div className="text-white/60 mt-2">Projecten</div>
              <div className="text-xs text-green-400 mt-1">Gevalideerd</div>
            </div>
            <div className="p-8 bg-white/5 border border-white/10 rounded-xl">
              <Users className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <div className="text-5xl font-mono font-bold text-white">Live</div>
              <div className="text-white/60 mt-2">Community</div>
              <div className="text-xs text-green-400 mt-1">Crowdsourcing kavels</div>
            </div>
          </div>

          <div className="p-8 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl">
            <p className="text-2xl text-white/80 italic">
              "Een Bouwbesturingssysteem dat elke stap digitaal valideert, 
              betalingen alleen vrijgeeft bij geverifieerd werk, en de 'zwarte doos' 
              van traditionele bouw elimineert."
            </p>
          </div>
        </div>
      </section>

      {/* SLIDE 12: CTA */}
      <section id="slide-12" className="min-h-screen flex items-center justify-center relative py-32 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#0a1a0a] to-[#0a0a0a]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/10 rounded-full blur-[200px]" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-serif mb-8">
            Klaar om te <span className="text-green-400">bouwen</span>?
          </h2>
          
          <p className="text-xl text-white/60 max-w-2xl mx-auto mb-12">
            €65.000 besparing per woning. Transparant proces. 
            Expert validatie. AI-begeleiding.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setAppState(AppState.WIZARD_STEP_TYPE)}
              className="bg-green-500 text-black px-10 py-5 text-lg font-bold hover:bg-green-400 transition-colors flex items-center gap-3 group"
            >
              Start Jouw Project
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => setAppState(AppState.STATE_OF_MARKET)}
              className="bg-white/10 text-white px-10 py-5 text-lg font-medium hover:bg-white/20 transition-colors border border-white/20"
            >
              Bekijk Live Data
            </button>
          </div>

          <div className="mt-16 pt-16 border-t border-white/10">
            <div className="grid grid-cols-3 gap-8">
              <div>
                <div className="text-4xl font-mono font-bold text-green-400">€65K</div>
                <div className="text-sm text-white/50 mt-1">Besparing/woning</div>
              </div>
              <div>
                <div className="text-4xl font-mono font-bold text-white">6-12</div>
                <div className="text-sm text-white/50 mt-1">Maanden sneller</div>
              </div>
              <div>
                <div className="text-4xl font-mono font-bold text-green-400">100%</div>
                <div className="text-sm text-white/50 mt-1">Transparantie</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Arrows */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4">
        <button
          onClick={() => setCurrentSlide(prev => Math.max(prev - 1, 0))}
          disabled={currentSlide === 0}
          className="p-3 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <span className="text-white/40 font-mono text-sm px-4">
          Gebruik <kbd className="px-2 py-1 bg-white/10 rounded mx-1">←</kbd> <kbd className="px-2 py-1 bg-white/10 rounded mx-1">→</kbd> om te navigeren
        </span>
        <button
          onClick={() => setCurrentSlide(prev => Math.min(prev + 1, totalSlides - 1))}
          disabled={currentSlide === totalSlides - 1}
          className="p-3 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

