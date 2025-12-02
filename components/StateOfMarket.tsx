import React, { useState, useEffect, useRef } from 'react';
import { AppState } from '../types';
import { PrimaryButton, TextButton } from './PrimaryButton';
import { 
  ArrowLeft, 
  TrendingDown, 
  TrendingUp, 
  Home, 
  Euro, 
  Clock, 
  Users, 
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  BarChart3,
  Target,
  Zap,
  Shield,
  MapPin,
  Building2,
  Quote,
  ExternalLink,
  Map,
  UserCheck,
  Sparkles,
  MessageCircle,
  Bot,
  Send,
  HelpCircle,
  Lightbulb,
  X,
  Check,
  ChevronDown,
  FileText,
  Calendar
} from 'lucide-react';

// Import SVG visualization components (keeping only essentials)
import {
  GSAPCounter,
  ScrollProgressLine,
  HousingPatternBackground,
} from './svg';

interface StateOfMarketProps {
  setAppState: (state: AppState) => void;
}

// Animated counter hook
const useCountUp = (end: number, duration: number = 2000, startOnView: boolean = true) => {
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
      setCount(Math.floor(easeOut * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration, hasStarted]);

  return { count, ref };
};

// Interactive Savings Calculator
const SavingsCalculator: React.FC = () => {
  const [buildCost, setBuildCost] = useState(450000);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const traditionalFaalkosten = Math.round(buildCost * 0.06);
  const traditionalRiskMargin = Math.round(buildCost * 0.08);
  const traditionalUnforeseen = Math.round(buildCost * 0.05);
  const traditionalTotal = buildCost + traditionalFaalkosten + traditionalRiskMargin + traditionalUnforeseen;

  const ogFaalkosten = Math.round(buildCost * 0.01);
  const ogRiskMargin = Math.round(buildCost * 0.03);
  const ogPlatformFee = Math.round(buildCost * 0.025);
  const ogTotal = buildCost + ogFaalkosten + ogRiskMargin + ogPlatformFee;

  const savings = traditionalTotal - ogTotal;

  return (
    <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 rounded-2xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
          <Euro className="text-green-400" size={20} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Wat betekent dit voor jouw budget?</h3>
          <p className="text-sm text-white/50">Bereken het effect op jouw project</p>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-white/60 text-sm">Jouw geschatte bouwkosten</span>
          <span className="text-2xl font-mono font-bold text-white">
            €{buildCost.toLocaleString('nl-NL')}
          </span>
        </div>
        <input
          type="range"
          min={250000}
          max={800000}
          step={10000}
          value={buildCost}
          onChange={(e) => setBuildCost(Number(e.target.value))}
          className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-400 
            [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg
            [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full 
            [&::-moz-range-thumb]:bg-green-400 [&::-moz-range-thumb]:border-0"
        />
        <div className="flex justify-between text-xs text-white/30 mt-1">
          <span>€250K</span>
          <span>€800K</span>
        </div>
      </div>

      <div className="text-center py-6 bg-black/20 rounded-xl mb-6">
        <div className="text-sm text-white/50 mb-2">
          Traditioneel betaal je <span className="text-red-400 font-bold">€{traditionalTotal.toLocaleString('nl-NL')}</span>
        </div>
        <div className="text-sm text-green-400/60 uppercase tracking-widest mb-2">Met slimme aanpak bespaar je</div>
        <div className="text-5xl md:text-6xl font-mono font-bold text-green-400">
          €{savings.toLocaleString('nl-NL')}
        </div>
        <div className="text-white/40 text-sm mt-2">
          Dat is {Math.round((savings / traditionalTotal) * 100)}% van de traditionele kosten
        </div>
      </div>

      <button
        onClick={() => setShowBreakdown(!showBreakdown)}
        className="w-full flex items-center justify-center gap-2 text-white/60 hover:text-white transition-colors py-2"
      >
        <span className="text-sm">{showBreakdown ? 'Verberg' : 'Toon'} breakdown</span>
        <ChevronDown size={16} className={`transition-transform ${showBreakdown ? 'rotate-180' : ''}`} />
      </button>

      {showBreakdown && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/10">
          <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={16} className="text-red-400" />
              <span className="font-medium text-red-400">Traditioneel</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/50">Bouwkosten</span>
                <span className="text-white">€{buildCost.toLocaleString('nl-NL')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Faalkosten (~6%)</span>
                <span className="text-red-400">+€{traditionalFaalkosten.toLocaleString('nl-NL')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Risico-marge (~8%)</span>
                <span className="text-red-400">+€{traditionalRiskMargin.toLocaleString('nl-NL')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Onvoorzien (~5%)</span>
                <span className="text-red-400">+€{traditionalUnforeseen.toLocaleString('nl-NL')}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/10 font-bold">
                <span className="text-white">Totaal</span>
                <span className="text-red-400">€{traditionalTotal.toLocaleString('nl-NL')}</span>
              </div>
            </div>
          </div>

          <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 size={16} className="text-green-400" />
              <span className="font-medium text-green-400">Met OoitGedacht</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/50">Bouwkosten</span>
                <span className="text-white">€{buildCost.toLocaleString('nl-NL')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Faalkosten (~1%)</span>
                <span className="text-green-400">+€{ogFaalkosten.toLocaleString('nl-NL')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Risico-marge (~3%)</span>
                <span className="text-green-400">+€{ogRiskMargin.toLocaleString('nl-NL')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Platform fee (~2.5%)</span>
                <span className="text-white/60">+€{ogPlatformFee.toLocaleString('nl-NL')}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/10 font-bold">
                <span className="text-white">Totaal</span>
                <span className="text-green-400">€{ogTotal.toLocaleString('nl-NL')}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Progress bar component
const AnimatedBar = ({ 
  percentage, 
  label, 
  color = 'bg-red-500',
  delay = 0 
}: { 
  percentage: number; 
  label: string; 
  color?: string;
  delay?: number;
}) => {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setWidth(percentage), delay);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [percentage, delay]);

  return (
    <div ref={ref} className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-white/60">{label}</span>
        <span className="font-mono font-bold text-white">{percentage}%</span>
      </div>
      <div className="h-3 bg-white/10 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-1000 ease-out rounded-full`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
};

// Source links
const SOURCES = {
  abnAmro: 'https://www.abnamro.nl/nl/media/Rapport_Faalkosten_in_de_bouw_tcm16-64809.pdf',
  mckinsey: 'https://www.mckinsey.com/capabilities/operations/our-insights/the-construction-productivity-imperative',
  cbs: 'https://www.cbs.nl/nl-nl/cijfers/detail/83673NED',
  rijksoverheid: 'https://www.rijksoverheid.nl/documenten/rapporten/2024/06/17/staat-van-de-volkshuisvesting-2024'
};

// Scroll progress hook
const useScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPosition = window.scrollY;
      const currentProgress = (scrollPosition / totalHeight) * 100;
      setProgress(Math.min(currentProgress, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return progress;
};

// Homie Chat Widget
const HomieChat: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    { from: 'homie', text: 'Hey! 👋 Ik ben Homie. Heb je vragen over dit rapport of over bouwen in het algemeen?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { from: 'user', text: userMsg }]);
    setInput('');

    setTimeout(() => {
      let response = '';
      const lowerInput = userMsg.toLowerCase();
      
      if (lowerInput.includes('faalkosten') || lowerInput.includes('verspil')) {
        response = 'Faalkosten zijn alle extra kosten door fouten, herwerk en miscommunicatie. Bij een gemiddeld project van €450.000 gaat het om €25.000-€40.000 extra. Wij minimaliseren dit door elk detail vooraf te valideren.';
      } else if (lowerInput.includes('kost') || lowerInput.includes('prijs') || lowerInput.includes('budget')) {
        response = 'Gemiddelde nieuwbouwkosten liggen tussen €450.000-€550.000. Maar let op: traditionele aannemers rekenen 15-20% extra voor risico\'s en faalkosten. Dat kun je grotendeels voorkomen.';
      } else if (lowerInput.includes('hoe lang') || lowerInput.includes('tijd') || lowerInput.includes('duur')) {
        response = 'Traditioneel duurt een bouwproject 18-24 maanden. Met gestroomlijnde processen kan dat naar 10-14 maanden. De grootste vertraging zit vaak in vergunningen (8-26 weken) en miscommunicatie.';
      } else if (lowerInput.includes('tekort') || lowerInput.includes('401')) {
        response = 'Het woningtekort van 401.000 huizen (4,9% van de voorraad) drijft prijzen op en maakt kavels schaars. Maar: er ZIJN kansen voor wie slim zoekt. Onze community vindt mogelijkheden die individuen missen.';
      } else if (lowerInput.includes('vergunn') || lowerInput.includes('gemeente')) {
        response = 'Vergunningstrajecten duren gemiddeld 8-26 weken, afhankelijk van complexiteit. Een afwijzing kan maanden kosten. Wij pre-valideren je ontwerp zodat de aanvraag in één keer goed is.';
      } else {
        response = 'Goede vraag! De kern: bouwen in Nederland is duurder en langzamer dan nodig door versnippering en gebrek aan transparantie. Wij pakken dat aan met expertvalidatie, slimme processen en jou als opdrachtgever centraal.';
      }
      
      setMessages(prev => [...prev, { from: 'homie', text: response }]);
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] bg-[#0d1f3c] border border-blue-500/30 shadow-2xl z-50 flex flex-col max-h-[500px] animate-fade-in-up rounded-xl">
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-green-500/10 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <Bot size={20} className="text-black" />
          </div>
          <div>
            <div className="font-bold text-white">Homie</div>
            <div className="text-xs text-green-400">Vraag me alles over dit rapport</div>
          </div>
        </div>
        <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[200px]">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
              msg.from === 'user' 
                ? 'bg-green-500 text-black' 
                : 'bg-white/10 text-white/90'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 pb-2">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {['Wat zijn faalkosten?', 'Hoe lang duurt bouwen?', 'Waarom 401.000 tekort?'].map((q, i) => (
            <button 
              key={i}
              onClick={() => setInput(q)}
              className="flex-shrink-0 text-xs px-3 py-1.5 bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-green-500/30 transition-colors rounded-full"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Stel een vraag over de markt..."
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-green-500/50"
          />
          <button 
            onClick={handleSend}
            className="bg-green-500 text-black p-2 rounded-lg hover:bg-green-400 transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export const StateOfMarket: React.FC<StateOfMarketProps> = ({ setAppState }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollProgress = useScrollProgress();
  const [isHomieOpen, setIsHomieOpen] = useState(false);

  // Note: We now use GSAPCounter components for animated statistics
  // The old useCountUp hooks are no longer needed for the hero section

  return (
    <div className="min-h-screen bg-[#0a1628] text-white">
      {/* Enhanced GSAP Reading Progress Bar */}
      <ScrollProgressLine color="#22c55e" />

      {/* Navigation */}
      <nav className="fixed top-1 w-full z-50 bg-[#0a1628]/90 backdrop-blur-xl border-b border-blue-500/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <button 
            onClick={() => setAppState(AppState.LANDING)}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Terug</span>
          </button>
          <div className="flex items-center gap-3">
            <img src="/generated/og-logo.png" alt="Ooit Gedacht" className="h-9 brightness-0 invert opacity-80" />
            <div className="hidden md:flex items-center gap-1 text-xs text-white/40">
              <FileText size={12} />
              <span>Marktrapport</span>
              <span className="mx-2">•</span>
              <span className="font-mono">{Math.round(scrollProgress)}%</span>
            </div>
          </div>
          <PrimaryButton 
            onClick={() => setAppState(AppState.WIZARD_STEP_TYPE)}
            size="sm"
          >
            Start Bouwen
          </PrimaryButton>
        </div>
      </nav>

      {/* Floating Homie Button */}
      <button
        onClick={() => setIsHomieOpen(!isHomieOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 group ${
          isHomieOpen ? 'bg-white/10 border border-white/20' : 'bg-green-500 hover:bg-green-400 hover:scale-110'
        }`}
      >
        {isHomieOpen ? (
          <X size={24} className="text-white" />
        ) : (
          <>
            <Bot size={24} className="text-black" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold animate-pulse">
              ?
            </span>
          </>
        )}
      </button>

      <HomieChat isOpen={isHomieOpen} onClose={() => setIsHomieOpen(false)} />

      {/* ============================================ */}
      {/* HERO: De Markt - Wat Het Voor Jou Betekent */}
      {/* ============================================ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f]/90 to-[#0a0a0a]" />
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-red-950/20 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-900/10 rounded-full blur-[120px]" />
          {/* Housing pattern background */}
          <HousingPatternBackground />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8">
            <BarChart3 size={14} className="text-white/60" />
            <span className="text-xs font-bold uppercase tracking-widest text-white/60">Marktrapport 2025</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-serif font-medium leading-[0.95] mb-8">
            De Nederlandse<br />
            Woningmarkt<br />
            <span className="text-white/40 text-3xl md:text-4xl font-light italic">en wat het voor jou betekent</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/60 max-w-3xl mx-auto font-light leading-relaxed mb-12">
            Dit rapport laat zien waarom bouwen in Nederland <span className="text-red-400">duurder</span> en <span className="text-red-400">langzamer</span> is 
            dan nodig — en wat jij eraan kunt doen.
          </p>

          {/* Quick Stats - Consumer framed */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white/5 border border-white/10 p-5 backdrop-blur-sm">
              <Home className="text-red-400 mb-2" size={20} />
              <div className="text-2xl md:text-3xl font-mono font-bold text-white">
                <GSAPCounter end={401000} duration={2.5} formatter={(v) => v.toLocaleString('nl-NL')} className="" />
              </div>
              <div className="text-xs text-white/40 mt-1">huizen tekort</div>
              <div className="text-xs text-red-400/60 mt-1">= minder keuze voor jou</div>
            </div>
            
            <div className="bg-white/5 border border-white/10 p-5 backdrop-blur-sm">
              <Euro className="text-red-400 mb-2" size={20} />
              <div className="text-2xl md:text-3xl font-mono font-bold text-white">
                €<GSAPCounter end={5} duration={2} className="" />B
              </div>
              <div className="text-xs text-white/40 mt-1">verspild per jaar</div>
              <div className="text-xs text-red-400/60 mt-1">= jij betaalt mee</div>
            </div>
            
            <div className="bg-white/5 border border-white/10 p-5 backdrop-blur-sm">
              <TrendingDown className="text-red-400 mb-2" size={20} />
              <div className="text-2xl md:text-3xl font-mono font-bold text-white">
                <GSAPCounter end={77} duration={2} className="" />%
              </div>
              <div className="text-xs text-white/40 mt-1">gaat over budget</div>
              <div className="text-xs text-red-400/60 mt-1">= risico voor jou</div>
            </div>
            
            <div className="bg-green-500/10 border border-green-500/30 p-5 backdrop-blur-sm">
              <TrendingUp className="text-green-400 mb-2" size={20} />
              <div className="text-2xl md:text-3xl font-mono font-bold text-green-400">
                €<GSAPCounter end={50000} duration={2.5} formatter={(v) => v.toLocaleString('nl-NL')} className="" />
              </div>
              <div className="text-xs text-green-400/60 mt-1">kun je besparen</div>
              <div className="text-xs text-green-400/60 mt-1">= met de juiste aanpak</div>
            </div>
          </div>

          <div className="mt-12 text-sm text-white/30">
            ↓ Scroll voor het volledige rapport
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 1: Het Woningtekort - Wat het voor jou betekent */}
      {/* ============================================ */}
      <section className="py-24 px-6 bg-[#0a1628]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center text-sm font-bold text-red-400">1</div>
            <span className="text-xs font-bold uppercase tracking-widest text-white/40">Het Tekort</span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif mb-6">
                401.000 huizen tekort.<br />
                <span className="text-red-400">Wat betekent dat voor jou?</span>
              </h2>
              
              <div className="space-y-6 text-lg text-white/60 font-light">
                <p>
                  Het woningtekort is opgelopen tot <strong className="text-white">4,9%</strong> van de totale voorraad.
                  Dat klinkt abstract, maar de gevolgen zijn heel concreet:
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-white/5 border border-white/10 rounded-lg">
                    <div className="text-2xl">🏷️</div>
                    <div>
                      <div className="font-medium text-white">Hogere prijzen</div>
                      <div className="text-sm text-white/50">Schaarste drijft de prijs op. Je betaalt meer voor minder.</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-white/5 border border-white/10 rounded-lg">
                    <div className="text-2xl">🔍</div>
                    <div>
                      <div className="font-medium text-white">Minder keuze</div>
                      <div className="text-sm text-white/50">Kavels zijn schaars. Je moet sneller beslissen of missen.</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-white/5 border border-white/10 rounded-lg">
                    <div className="text-2xl">⏰</div>
                    <div>
                      <div className="font-medium text-white">Langer wachten</div>
                      <div className="text-sm text-white/50">Aannemers zijn druk. Wachttijden lopen op.</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="mt-6 text-sm text-white/40">
                Bron: <a href={SOURCES.rijksoverheid} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors inline-flex items-center gap-1">
                  Staat van de Volkshuisvesting 2024 <ExternalLink size={10} />
                </a>
              </p>
            </div>

            <div>
              {/* Visual: Housing gap */}
              <div className="bg-[#0d1f3c] border border-blue-500/20 rounded-xl p-8">
                <h4 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-6">Visueel: De kloof</h4>
                <div className="grid grid-cols-10 gap-1 mb-6">
                  {[...Array(100)].map((_, i) => (
                    <div
                      key={i}
                      className={`aspect-square rounded-sm ${
                        i < 95 ? 'bg-white/20' : 'bg-red-500'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-white/20 rounded-sm" />
                    <span className="text-white/40">Bestaande woningen</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-sm" />
                    <span className="text-red-400">Tekort (4,9%)</span>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-white/10">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-white/5 rounded-lg">
                      <div className="text-2xl font-mono font-bold text-white">100K</div>
                      <div className="text-xs text-white/40 mt-1">Doelstelling/jaar</div>
                    </div>
                    <div className="text-center p-4 bg-red-500/10 rounded-lg">
                      <div className="text-2xl font-mono font-bold text-red-400">82K</div>
                      <div className="text-xs text-red-400/60 mt-1">Realiteit 2024</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 2: Faalkosten - Waar jouw geld naartoe gaat */}
      {/* ============================================ */}
      <section className="py-24 px-6 bg-gradient-to-b from-[#0a0a0a] to-[#111]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center text-sm font-bold text-red-400">2</div>
            <span className="text-xs font-bold uppercase tracking-widest text-white/40">Faalkosten</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif mb-6">
                €5 miljard per jaar verspild.<br />
                <span className="text-red-400">Wie betaalt dat?</span>
              </h2>
              
              <p className="text-lg text-white/60 font-light leading-relaxed mb-8">
                <strong className="text-white">Faalkosten</strong> zijn alle extra kosten voor reparaties, 
                herwerk en fouten die voorkomen hadden kunnen worden. Bij een sectoromzet van €100 miljard 
                betekent dit 5% pure verspilling. <strong className="text-red-400">En jij betaalt mee.</strong>
              </p>

              <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6 mb-8">
                <h4 className="text-lg font-bold text-red-400 mb-4">Wat faalkosten jou kosten</h4>
                <p className="text-white/60 mb-4">
                  Bij een bouwproject van €450.000 zit er gemiddeld <strong className="text-white">€25.000-€40.000</strong> aan 
                  faalkosten verborgen in de offerte. Dat is geld voor:
                </p>
                <ul className="space-y-2 text-sm text-white/50">
                  <li className="flex items-center gap-2"><span className="text-red-400">•</span> Fouten die gerepareerd moeten worden</li>
                  <li className="flex items-center gap-2"><span className="text-red-400">•</span> Materiaal dat verkeerd besteld is</li>
                  <li className="flex items-center gap-2"><span className="text-red-400">•</span> Werk dat overgedaan moet worden</li>
                  <li className="flex items-center gap-2"><span className="text-red-400">•</span> Vertraging door miscommunicatie</li>
                </ul>
              </div>

              <div className="space-y-4">
                <AnimatedBar percentage={40} label="Bedrijven met 5%+ faalkosten" color="bg-red-500" delay={0} />
                <AnimatedBar percentage={90} label="Bedrijven bewust van faalkosten" color="bg-orange-500" delay={200} />
                <AnimatedBar percentage={25} label='Zeggen: "Geen prioriteit"' color="bg-yellow-500" delay={400} />
              </div>

              <blockquote className="mt-10 pl-6 border-l-2 border-red-500/50 text-white/60 italic">
                "Faalkosten lijken een bijna geaccepteerde inefficiëntie in de bouwsector"
                <cite className="block text-sm text-white/40 mt-2 not-italic">
                  — <a href={SOURCES.abnAmro} target="_blank" rel="noopener noreferrer" className="hover:text-red-400 transition-colors inline-flex items-center gap-1">
                    ABN AMRO Onderzoek <ExternalLink size={12} />
                  </a>
                </cite>
              </blockquote>
            </div>

            <div className="relative">
              <div className="bg-[#0d1f3c] border border-blue-500/20 rounded-xl p-8">
                <h3 className="text-xl font-serif mb-8">Waar gaat het mis?</h3>
                
                <div className="space-y-4">
                  {[
                    { icon: Users, label: 'Te veel partijen', desc: '15-30 onderaannemers per project', pct: '25%' },
                    { icon: MessageCircle, label: 'Miscommunicatie', desc: 'WhatsApp, email, papier chaos', pct: '30%' },
                    { icon: Clock, label: 'Tijdsdruk', desc: 'Haastwerk leidt tot fouten', pct: '20%' },
                    { icon: Euro, label: 'Laagste prijs wint', desc: 'Kwaliteit geofferd voor prijs', pct: '25%' },
                  ].map((item, i) => (
                    <div 
                      key={i}
                      className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-lg"
                    >
                      <div className="p-2 bg-red-500/20 rounded-lg">
                        <item.icon size={18} className="text-red-400" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-white">{item.label}</div>
                        <div className="text-sm text-white/50">{item.desc}</div>
                      </div>
                      <div className="text-red-400 font-mono font-bold">{item.pct}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 3: De Verborgen Toeslag */}
      {/* ============================================ */}
      <section className="py-24 px-6 bg-[#0d1f3c] border-y border-blue-500/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center text-sm font-bold text-red-400">3</div>
            <span className="text-xs font-bold uppercase tracking-widest text-white/40">De Verborgen Toeslag</span>
          </div>

          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif mb-6">
              Waarom je offerte <span className="text-red-400">19% hoger</span> is dan nodig
            </h2>
            <p className="text-lg text-white/60 max-w-3xl mx-auto">
              Aannemers <strong className="text-white">verwachten</strong> dat er dingen misgaan. Dus rekenen ze een buffer in.
              Die buffer betaal jij.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-8 text-center">
              <div className="text-5xl font-mono font-bold text-red-400 mb-3">6%</div>
              <div className="text-white font-medium mb-2">Faalkosten buffer</div>
              <div className="text-sm text-white/40">"Voor als er fouten komen"</div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="text-white/60">Bij €450K =</div>
                <div className="text-red-400 font-mono font-bold">€27.000</div>
              </div>
            </div>
            
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-8 text-center">
              <div className="text-5xl font-mono font-bold text-red-400 mb-3">8%</div>
              <div className="text-white font-medium mb-2">Risico-marge</div>
              <div className="text-sm text-white/40">"Je weet maar nooit"</div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="text-white/60">Bij €450K =</div>
                <div className="text-red-400 font-mono font-bold">€36.000</div>
              </div>
            </div>
            
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-8 text-center">
              <div className="text-5xl font-mono font-bold text-red-400 mb-3">5%</div>
              <div className="text-white font-medium mb-2">Onvoorzien opslag</div>
              <div className="text-sm text-white/40">"Standaard in de markt"</div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="text-white/60">Bij €450K =</div>
                <div className="text-red-400 font-mono font-bold">€22.500</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-500/10 via-red-500/5 to-transparent border border-red-500/20 rounded-xl p-8 text-center">
            <div className="text-sm text-white/40 uppercase tracking-widest mb-2">Totaal verborgen in je offerte</div>
            <div className="text-6xl font-mono font-bold text-red-400 mb-4">€85.500</div>
            <div className="text-white/60">
              Dat is <span className="text-red-400 font-bold">19%</span> bovenop de daadwerkelijke bouwkosten
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 4: Het Tijdsprobleem */}
      {/* ============================================ */}
      <section className="py-24 px-6 bg-[#0a1628]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center text-sm font-bold text-orange-400">4</div>
            <span className="text-xs font-bold uppercase tracking-widest text-white/40">Doorlooptijd</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif mb-6">
                Hoe lang moet jij <span className="text-orange-400">wachten</span>?
              </h2>
              
              <p className="text-lg text-white/60 font-light leading-relaxed mb-8">
                Een traditioneel bouwproject duurt <strong className="text-white">18-24 maanden</strong>. 
                Maar de grootste vertraging zit niet in het bouwen zelf — het zit in de bureaucratie en miscommunicatie.
              </p>

              <div className="space-y-4">
                {[
                  { phase: 'Vergunning aanvraag', time: '8-26 weken', desc: 'Afhankelijk van complexiteit en gemeente', icon: FileText },
                  { phase: 'Aannemer vinden', time: '4-12 weken', desc: 'Offertes vergelijken, onderhandelen', icon: Users },
                  { phase: 'Wachten op start', time: '8-16 weken', desc: 'Aannemers hebben wachtlijsten', icon: Calendar },
                  { phase: 'Bouw', time: '6-10 maanden', desc: 'De daadwerkelijke constructie', icon: Building2 },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-white/5 border border-white/10 rounded-lg">
                    <div className="p-2 bg-orange-500/20 rounded-lg">
                      <item.icon size={18} className="text-orange-400" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-white">{item.phase}</div>
                      <div className="text-sm text-white/50">{item.desc}</div>
                    </div>
                    <div className="text-orange-400 font-mono text-sm">{item.time}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="bg-[#0d1f3c] border border-blue-500/20 rounded-xl p-8">
                <h4 className="text-lg font-bold text-white mb-6">Wat vertraging jou kost</h4>
                
                <p className="text-white/60 mb-6">
                  Elke maand vertraging kost je geld. Bij een project van €500.000 met 12 maanden vertraging:
                </p>

                <div className="space-y-3">
                  <div className="flex justify-between py-3 border-b border-white/10">
                    <span className="text-white/60">Financieringskosten (5% per jaar)</span>
                    <span className="text-red-400 font-mono">€25.000</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-white/10">
                    <span className="text-white/60">Materiaalprijsinflatie (3%)</span>
                    <span className="text-red-400 font-mono">€15.000</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-white/10">
                    <span className="text-white/60">Verlengde huur</span>
                    <span className="text-red-400 font-mono">€18.000</span>
                  </div>
                  <div className="flex justify-between py-4 font-bold">
                    <span className="text-white">Totale kosten vertraging</span>
                    <span className="text-red-400 font-mono">€58.000+</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center gap-2 text-green-400 text-sm font-medium mb-2">
                    <Zap size={16} />
                    <span>Met gestroomlijnde processen</span>
                  </div>
                  <p className="text-white/60 text-sm">
                    Doorlooptijd kan naar <strong className="text-green-400">10-14 maanden</strong> door parallelle processen en voorvalidatie.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 5: Jouw Berekening */}
      {/* ============================================ */}
      <section className="py-24 px-6 bg-gradient-to-b from-[#0a0a0a] to-[#0f1a0f]">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center text-sm font-bold text-green-400">5</div>
            <span className="text-xs font-bold uppercase tracking-widest text-white/40">Jouw Situatie</span>
          </div>

          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif mb-6">
              Wat betekent dit voor <span className="text-green-400">jouw</span> project?
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              De cijfers hierboven zijn sectorgemiddelden. Maar wat betekent het concreet voor jouw bouwplannen?
            </p>
          </div>

          <SavingsCalculator />
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 6: De Oplossing */}
      {/* ============================================ */}
      <section className="py-24 px-6 bg-[#0f1a0f] border-y border-green-500/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center text-sm font-bold text-green-400">6</div>
            <span className="text-xs font-bold uppercase tracking-widest text-white/40">De Oplossing</span>
          </div>

          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif mb-6">
              Hoe <span className="text-green-400">minimaliseer</span> je deze kosten?
            </h2>
            <p className="text-lg text-white/60 max-w-3xl mx-auto">
              De kern van het probleem: gebrek aan validatie, transparantie en centrale regie.
              De oplossing is niet ingewikkeld — maar vereist een andere aanpak.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-8">
              <div className="w-14 h-14 bg-green-500/20 rounded-xl flex items-center justify-center mb-6">
                <Shield className="text-green-400" size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Vooraf valideren</h3>
              <p className="text-white/60 leading-relaxed mb-4">
                Elk ontwerp wordt door ingenieurs gecheckt vóór de bouw begint. Geen verrassingen, geen herwerk.
              </p>
              <div className="text-sm text-green-400/80">
                → Faalkosten van 6% naar ~1%
              </div>
            </div>

            <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-8">
              <div className="w-14 h-14 bg-green-500/20 rounded-xl flex items-center justify-center mb-6">
                <Target className="text-green-400" size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Transparante prijzen</h3>
              <p className="text-white/60 leading-relaxed mb-4">
                Geen verborgen marges. Je ziet exact waar je geld naartoe gaat. Betaling per mijlpaal bij goedgekeurd werk.
              </p>
              <div className="text-sm text-green-400/80">
                → Risico-marge van 8% naar ~3%
              </div>
            </div>

            <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-8">
              <div className="w-14 h-14 bg-green-500/20 rounded-xl flex items-center justify-center mb-6">
                <Zap className="text-green-400" size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Centrale regie</h3>
              <p className="text-white/60 leading-relaxed mb-4">
                Eén dashboard voor alles. Geen miscommunicatie tussen 15 partijen. Jij houdt overzicht.
              </p>
              <div className="text-sm text-green-400/80">
                → Onvoorzien van 5% naar ~0%
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 7: Conclusie & CTA */}
      {/* ============================================ */}
      <section className="py-24 px-6 bg-[#0a1628]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-sm font-bold text-white/60">7</div>
            <span className="text-xs font-bold uppercase tracking-widest text-white/40">Conclusie</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-serif mb-8">
            De markt is uitdagend.<br />
            <span className="text-green-400">Maar niet onmogelijk.</span>
          </h2>

          <div className="text-lg text-white/60 space-y-6 mb-12">
            <p>
              <strong className="text-white">401.000 woningen tekort</strong> betekent schaarste en hogere prijzen.
              <strong className="text-white"> €5 miljard aan faalkosten</strong> per jaar betekent dat je te veel betaalt.
              <strong className="text-white"> 77% van projecten over budget</strong> betekent risico voor jou.
            </p>
            <p>
              Maar: met de juiste aanpak kun je <strong className="text-green-400">€50.000+</strong> besparen, 
              <strong className="text-green-400"> maanden</strong> sneller bouwen, en 
              <strong className="text-green-400"> zonder verrassingen</strong> je droomhuis realiseren.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <PrimaryButton 
              onClick={() => setAppState(AppState.WIZARD_STEP_TYPE)}
              size="lg"
            >
              Start mijn bouwproject
            </PrimaryButton>
            <PrimaryButton 
              onClick={() => setIsHomieOpen(true)}
              variant="secondary"
              size="lg"
              icon={<Bot size={20} />}
            >
              Vraag Homie
            </PrimaryButton>
          </div>

          <p className="text-white/30 text-sm">
            Gratis starten • Geen account nodig • 100% vrijblijvend
          </p>
        </div>
      </section>

      {/* Sources Footer */}
      <footer className="py-12 px-6 bg-[#050505] border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Bronnen</h4>
              <div className="text-sm space-y-2">
                <a href={SOURCES.abnAmro} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/40 hover:text-green-400 transition-colors">
                  <ExternalLink size={12} />
                  ABN AMRO — Faalkosten Onderzoek
                </a>
                <a href={SOURCES.mckinsey} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/40 hover:text-green-400 transition-colors">
                  <ExternalLink size={12} />
                  McKinsey — Construction Productivity
                </a>
                <a href={SOURCES.cbs} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/40 hover:text-green-400 transition-colors">
                  <ExternalLink size={12} />
                  CBS — Kerncijfers Nieuwbouw 2024
                </a>
                <a href={SOURCES.rijksoverheid} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/40 hover:text-green-400 transition-colors">
                  <ExternalLink size={12} />
                  Staat van de Volkshuisvesting 2024
                </a>
              </div>
            </div>
            
            <div className="text-right flex flex-col items-end">
              <img src="/generated/og-logo.png" alt="Ooit Gedacht" className="h-10 brightness-0 invert opacity-40 mb-2" />
              <p className="text-xs text-white/30">Marktrapport December 2025</p>
              <p className="text-xs text-white/30">© 2025 Ooit Gedacht B.V.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
