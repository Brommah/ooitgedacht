import React, { useState, useEffect, useRef } from 'react';
import { AppState } from '../types';
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
  Check
} from 'lucide-react';

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
        <span className="text-gray-600">{label}</span>
        <span className="font-mono font-bold">{percentage}%</span>
      </div>
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
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

// Homie Chat Widget Component
const HomieChat: React.FC<{ isOpen: boolean; onClose: () => void; setAppState: (state: AppState) => void }> = ({ isOpen, onClose, setAppState }) => {
  const [messages, setMessages] = useState([
    { from: 'homie', text: 'Hey! 👋 Ik ben Homie — altijd één stap voor in jouw bouwtraject. Waar sta je nu in het proces?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { from: 'user', text: userMsg }]);
    setInput('');

    // Simulate Homie response
    setTimeout(() => {
      let response = '';
      const lowerInput = userMsg.toLowerCase();
      
      if (lowerInput.includes('kavel') || lowerInput.includes('grond')) {
        response = 'Kavels vinden is vaak het moeilijkste deel. Samen met onze community analyseren we bestemmingsplannen en kadasterdata. We geven een eerste indicatie van bouwpotentie — geen garantie, wel een krachtig startpunt.';
      } else if (lowerInput.includes('kost') || lowerInput.includes('prijs') || lowerInput.includes('duur')) {
        response = 'Een gemiddelde nieuwbouwwoning kost €450.000-€550.000. Door faalkosten te minimaliseren en transparante prijzen te bieden, kan je met ons platform tot €50.000 besparen.';
      } else if (lowerInput.includes('hoe lang') || lowerInput.includes('tijd') || lowerInput.includes('duur')) {
        response = 'Van eerste ontwerp tot sleuteloverdracht duurt gemiddeld 10-14 maanden. Traditioneel is dat vaak 18-24 maanden. Wij versnellen door digitale validatie en parallelle processen.';
      } else if (lowerInput.includes('vergunn') || lowerInput.includes('gemeente')) {
        response = 'Vergunningen zijn vaak een bottleneck. Wij pre-valideren je ontwerp tegen het bestemmingsplan, zodat je aanvraag in één keer goed is. Dat scheelt maanden wachttijd!';
      } else if (lowerInput.includes('start') || lowerInput.includes('begin')) {
        response = 'Super! Begin met onze gratis Vibe Check — kies je stijl, en onze AI genereert een eerste ontwerp. Daarna krijg je een Feasibility Passport met kosten en haalbaarheid.';
      } else {
        response = 'Goede vraag! In het kort: wij begeleiden je van droom naar sleutel. AI-ontwerp, kavel-check, kostenraming, vergunning, en bouw — alles via één dashboard. Wil je starten met een gratis ontwerp?';
      }
      
      setMessages(prev => [...prev, { from: 'homie', text: response }]);
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] bg-[#0d1f3c] border border-blue-500/30 shadow-2xl z-50 flex flex-col max-h-[500px] animate-fade-in-up rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-green-500/10 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <Bot size={20} className="text-black" />
          </div>
          <div>
            <div className="font-bold text-white">Homie</div>
            <div className="text-xs text-green-400">Altijd één stap voor • Online</div>
          </div>
        </div>
        <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
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

      {/* Quick Questions */}
      <div className="px-4 pb-2">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {['Wat kost bouwen?', 'Hoe vind ik een kavel?', 'Hoe lang duurt het?'].map((q, i) => (
            <button 
              key={i}
              onClick={() => { setInput(q); }}
              className="flex-shrink-0 text-xs px-3 py-1.5 bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-green-500/30 transition-colors rounded-full"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Stel een vraag..."
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
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Scroll progress
  const scrollProgress = useScrollProgress();
  
  // Homie chat state
  const [isHomieOpen, setIsHomieOpen] = useState(false);

  // Key statistics with animated counters
  const housesShortage = useCountUp(401000, 2500);
  const faalkosten = useCountUp(5, 2000);
  const projectOverrun = useCountUp(77, 2000);
  const savingsPerHome = useCountUp(50000, 2500);
  
  // Community counters
  const activeParticipants = useCountUp(127, 2000);
  const opportunitiesFound = useCountUp(23, 1500);
  const dossiersShared = useCountUp(3, 2000);

  return (
    <div className="min-h-screen bg-[#0a1628] text-white">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-blue-500/10 z-[60]">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 via-blue-400 to-emerald-400 transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

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
            <div className="font-serif text-lg font-bold tracking-tight">
              Ooit Gedacht.
            </div>
            <div className="hidden md:flex items-center gap-1 text-xs text-white/40">
              <span className="font-mono">{Math.round(scrollProgress)}%</span>
              <span>gelezen</span>
            </div>
          </div>
          <button 
            onClick={() => setAppState(AppState.MARKET_RESEARCH)}
            className="text-white/60 hover:text-white px-4 py-2 text-sm font-medium transition-colors"
          >
            Presentatie
          </button>
          <button 
            onClick={() => setAppState(AppState.WIZARD_MOODBOARD)}
            className="bg-blue-400 text-[#0a1628] px-4 py-2 text-sm font-bold hover:bg-blue-300 transition-colors rounded-lg"
          >
            Start Bouwen →
          </button>
        </div>
      </nav>

      {/* Floating Homie Chat Button */}
      <button
        onClick={() => setIsHomieOpen(!isHomieOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 group ${
          isHomieOpen 
            ? 'bg-white/10 border border-white/20' 
            : 'bg-green-500 hover:bg-green-400 hover:scale-110'
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

      {/* Homie Chat Widget */}
      <HomieChat isOpen={isHomieOpen} onClose={() => setIsHomieOpen(false)} setAppState={setAppState} />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <img 
            src="/generated/polder-construction-crane.jpg" 
            alt="" 
            className="w-full h-full object-cover opacity-20"
          />
          {/* Base gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f]/90 to-[#0a0a0a]" />
          
          {/* Subtle color accents */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#1a0a0a]/30" />
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-red-950/20 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-red-900/10 rounded-full blur-[120px]" />
          
          {/* Film grain overlay */}
          <div 
            className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full mb-8">
            <AlertTriangle size={14} className="text-red-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-red-400">Stand van de Markt 2025</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-serif font-medium leading-[0.9] mb-8">
            De Nederlandse<br />
            <span className="text-red-500 italic">Woningcrisis</span><br />
            in Cijfers
          </h1>

          <p className="text-xl md:text-2xl text-white/60 max-w-3xl mx-auto font-light leading-relaxed mb-12">
            €5 miljard wordt jaarlijks verspild aan bouwfouten. 
            <span className="text-white font-medium"> 401.000 huizen tekort.</span> 
            {' '}Grote projecten lopen structureel uit. Het is tijd voor radicale verandering.
          </p>

          {/* Hero Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div ref={housesShortage.ref} className="bg-white/5 border border-white/10 p-6 backdrop-blur-sm hover:bg-white/10 transition-colors group">
              <Home className="text-red-400 mb-3 group-hover:scale-110 transition-transform" size={24} />
              <div className="text-3xl md:text-4xl font-mono font-bold text-white">
                {housesShortage.count.toLocaleString('nl-NL')}
              </div>
              <div className="text-xs uppercase tracking-widest text-white/40 mt-2">Woningen Tekort</div>
            </div>
            
            <div ref={faalkosten.ref} className="bg-white/5 border border-white/10 p-6 backdrop-blur-sm hover:bg-white/10 transition-colors group">
              <Euro className="text-red-400 mb-3 group-hover:scale-110 transition-transform" size={24} />
              <div className="text-3xl md:text-4xl font-mono font-bold text-white">
                €{faalkosten.count}B
              </div>
              <div className="text-xs uppercase tracking-widest text-white/40 mt-2">Faalkosten/Jaar</div>
            </div>
            
            <div ref={projectOverrun.ref} className="bg-white/5 border border-white/10 p-6 backdrop-blur-sm hover:bg-white/10 transition-colors group">
              <TrendingDown className="text-red-400 mb-3 group-hover:scale-110 transition-transform" size={24} />
              <div className="text-3xl md:text-4xl font-mono font-bold text-white">
                {projectOverrun.count}%
              </div>
              <div className="text-xs uppercase tracking-widest text-white/40 mt-2">Loopt Over Budget</div>
            </div>
            
            <div ref={savingsPerHome.ref} className="bg-green-500/10 border border-green-500/30 p-6 backdrop-blur-sm hover:bg-green-500/20 transition-colors group">
              <TrendingUp className="text-green-400 mb-3 group-hover:scale-110 transition-transform" size={24} />
              <div className="text-3xl md:text-4xl font-mono font-bold text-green-400">
                €{savingsPerHome.count.toLocaleString('nl-NL')}
              </div>
              <div className="text-xs uppercase tracking-widest text-green-400/60 mt-2">Potentiële Besparing</div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
              <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* The Problem: Faalkosten Deep Dive */}
      <section className="py-32 px-6 bg-gradient-to-b from-[#0a0a0a] to-[#111]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full mb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-red-400">Het Probleem</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-serif mb-6">
                €5 Miljard per jaar <span className="text-red-500">verspild</span>
              </h2>
              
              <p className="text-lg text-white/60 font-light leading-relaxed mb-8">
                <strong className="text-white">Faalkosten</strong> zijn alle extra kosten voor reparaties, 
                herwerk en fouten die voorkomen hadden kunnen worden. 
                Bij een sectoromzet van €100 miljard betekent dit 5% pure verspilling.
              </p>

              <div className="space-y-6">
                <AnimatedBar percentage={40} label="Bedrijven met 5%+ faalkosten" color="bg-red-500" delay={0} />
                <AnimatedBar percentage={90} label="Bedrijven bewust van faalkosten" color="bg-orange-500" delay={200} />
                <AnimatedBar percentage={25} label="Zeggen: 'Geen prioriteit'" color="bg-yellow-500" delay={400} />
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
              {/* Visualization: Money flowing down the drain */}
              <div className="bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/20 p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-red-500/10 rounded-full blur-3xl" />
                
                <h3 className="text-xl font-serif mb-8 relative z-10">Waar Gaat Het Mis?</h3>
                
                <div className="space-y-4 relative z-10">
                  {[
                    { icon: Users, label: 'Te veel partijen', desc: '15-30 onderaannemers per project' },
                    { icon: AlertTriangle, label: 'Miscommunicatie', desc: 'WhatsApp, email, papier chaos' },
                    { icon: Clock, label: 'Tijdsdruk', desc: 'Haastwerk leidt tot fouten' },
                    { icon: Euro, label: 'Laagste prijs wint', desc: 'Kwaliteit geofferd voor prijs' },
                  ].map((item, i) => (
                    <div 
                      key={i}
                      className="flex items-start gap-4 p-4 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
                    >
                      <div className="p-2 bg-red-500/20 group-hover:bg-red-500/30 transition-colors">
                        <item.icon size={18} className="text-red-400" />
                      </div>
                      <div>
                        <div className="font-medium text-white">{item.label}</div>
                        <div className="text-sm text-white/50">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* McKinsey Data: Global Context */}
      <section className="py-32 px-6 bg-[#0d1f3c] border-y border-blue-500/10">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-6">
            <BarChart3 size={14} className="text-white/60" />
            <a href={SOURCES.mckinsey} target="_blank" rel="noopener noreferrer" className="text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors inline-flex items-center gap-2">
              McKinsey Research <ExternalLink size={10} />
            </a>
          </div>

          <h2 className="text-4xl md:text-5xl font-serif mb-6">
            Het Probleem is <span className="text-red-500">Wereldwijd</span>
          </h2>

          <p className="text-lg text-white/60 max-w-2xl mx-auto mb-16">
            De bouwsector is de enige grote industrie waar productiviteit de afgelopen 40 jaar is <strong className="text-red-400">gedaald</strong>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-b from-white/5 to-transparent border border-white/10 p-10 group hover:border-red-500/30 transition-colors">
              <div className="text-6xl font-mono font-bold text-red-500 mb-4">98%</div>
              <div className="text-white font-medium mb-2">Megaprojecten*</div>
              <div className="text-sm text-white/50">overschrijden budget met 30%+</div>
            </div>
            
            <div className="bg-gradient-to-b from-white/5 to-transparent border border-white/10 p-10 group hover:border-orange-500/30 transition-colors">
              <div className="text-6xl font-mono font-bold text-orange-500 mb-4">20</div>
              <div className="text-white font-medium mb-2">Maanden Vertraging</div>
              <div className="text-sm text-white/50">gemiddeld bij grote projecten</div>
            </div>
            
            <div className="bg-gradient-to-b from-white/5 to-transparent border border-white/10 p-10 group hover:border-yellow-500/30 transition-colors">
              <div className="text-6xl font-mono font-bold text-yellow-500 mb-4">-20%</div>
              <div className="text-white font-medium mb-2">Productiviteitsgroei</div>
              <div className="text-sm text-white/50">terwijl manufacturing verdubbelde</div>
            </div>
          </div>

          <p className="mt-8 text-xs text-white/30 text-center">
            *Deze cijfers gelden voor grote infrastructuurprojecten. Bij woningbouw zijn de percentages lager, maar het structurele probleem is hetzelfde.
          </p>

          <blockquote className="mt-16 text-xl text-white/60 italic max-w-3xl mx-auto">
            "Construction is the only major industry to show negative productivity growth over the past 40 years"
            <cite className="block text-sm text-white/40 mt-4 not-italic">
              — <a href={SOURCES.mckinsey} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors inline-flex items-center gap-1">
                McKinsey Global Institute <ExternalLink size={12} />
              </a>
            </cite>
          </blockquote>
        </div>
      </section>

      {/* Housing Shortage Section */}
      <section className="py-32 px-6 bg-[#0a1628]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              {/* Interactive housing gap visualization */}
              <div className="relative">
                <div className="grid grid-cols-10 gap-1">
                  {[...Array(100)].map((_, i) => (
                    <div
                      key={i}
                      className={`aspect-square rounded-sm transition-all duration-500 ${
                        i < 95 ? 'bg-white/20' : 'bg-red-500 animate-pulse'
                      }`}
                      style={{ animationDelay: `${i * 50}ms` }}
                    />
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-white/20 rounded-sm" />
                    <span className="text-white/40">Bestaande Voorraad</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-sm" />
                    <span className="text-red-400">Tekort (4.9%)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full mb-6">
                <Home size={14} className="text-red-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-red-400">Woningtekort</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-serif mb-6">
                401.000 Huizen <span className="text-red-500">Tekort</span>
              </h2>

              <div className="space-y-6 text-lg text-white/60 font-light">
                <p>
                  Het woningtekort is opgelopen tot <strong className="text-white">4,9%</strong> van de totale voorraad.
                  Het hoogste niveau in decennia.
                </p>
                <p>
                  Doel: <strong className="text-white">100.000 woningen</strong> per jaar.<br />
                  Realiteit 2024: <strong className="text-red-400">~82.000 woningen</strong>.
                </p>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 p-6">
                  <div className="text-3xl font-mono font-bold text-white">100K</div>
                  <div className="text-xs uppercase tracking-widest text-white/40 mt-1">Target/Jaar</div>
                </div>
                <div className="bg-red-500/10 border border-red-500/30 p-6">
                  <div className="text-3xl font-mono font-bold text-red-400">82K</div>
                  <div className="text-xs uppercase tracking-widest text-red-400/60 mt-1">Realiteit 2024</div>
                </div>
              </div>
              
              <p className="mt-6 text-sm text-white/40">
                Bron: <a href={SOURCES.rijksoverheid} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors inline-flex items-center gap-1">
                  Staat van de Volkshuisvesting 2024 <ExternalLink size={10} />
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CASE STUDY: Familie Jansen */}
      <section className="py-32 px-6 bg-gradient-to-b from-[#0a0a0a] to-[#0f1a0f] relative overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img 
            src="/generated/forest-house-systems.jpg" 
            alt="" 
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-green-500/10 rounded-full blur-[100px]" />
        
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full mb-6">
              <Sparkles size={14} className="text-green-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-green-400">Succesverhaal</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif mb-4">
              Van Droom naar <span className="text-green-400">Werkelijkheid</span>
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Echte families. Echte besparingen. Echte huizen.
            </p>
          </div>

          {/* Case Study Card */}
          <div className="bg-[#0d1f3c] border border-blue-500/20 overflow-hidden rounded-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Image Side */}
              <div className="relative h-64 lg:h-auto bg-gradient-to-br from-green-900/30 to-[#111] flex items-center justify-center">
                <div className="absolute inset-0 opacity-40">
                  <img 
                    src="/generated/thatched-systems.png" 
                    alt="" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="relative z-10 text-center p-8">
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                    <Home className="text-green-400" size={32} />
                  </div>
                  <div className="text-sm text-green-400/60 uppercase tracking-widest mb-2">Project Locatie</div>
                  <div className="text-2xl font-serif text-white">Veluwse Heide</div>
                  <div className="text-white/40 text-sm mt-1">Gelderland, Nederland</div>
                </div>
              </div>
              
              {/* Content Side */}
              <div className="p-8 lg:p-12">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-green-500/20 rounded-full flex items-center justify-center text-xl font-bold text-green-400">
                    J
                  </div>
                  <div>
                    <h3 className="text-xl font-serif text-white">Familie Jansen</h3>
                    <p className="text-white/50 text-sm">2 volwassenen, 3 kinderen</p>
                  </div>
                  <div className="ml-auto">
                    <div className="flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold uppercase tracking-widest rounded-full">
                      <CheckCircle2 size={12} />
                      Opgeleverd
                    </div>
                  </div>
                </div>
                
                <blockquote className="text-lg text-white/80 italic leading-relaxed mb-8 pl-4 border-l-2 border-green-500/30">
                  <Quote size={20} className="text-green-500/30 mb-2" />
                  "We dachten dat een eigen huis bouwen onmogelijk was. Te duur, te complex, te risicovol. 
                  Met Ooit Gedacht hadden we binnen 10 maanden de sleutel in handen — én €72.000 bespaard 
                  vergeleken met de offertes van traditionele aannemers."
                </blockquote>
                
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="text-center p-4 bg-white/5 border border-white/10">
                    <div className="text-2xl font-mono font-bold text-green-400">€72K</div>
                    <div className="text-[10px] uppercase tracking-widest text-white/40 mt-1">Bespaard</div>
                  </div>
                  <div className="text-center p-4 bg-white/5 border border-white/10">
                    <div className="text-2xl font-mono font-bold text-white">10</div>
                    <div className="text-[10px] uppercase tracking-widest text-white/40 mt-1">Maanden</div>
                  </div>
                  <div className="text-center p-4 bg-white/5 border border-white/10">
                    <div className="text-2xl font-mono font-bold text-white">185m²</div>
                    <div className="text-[10px] uppercase tracking-widest text-white/40 mt-1">Woonoppervlak</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-white/40">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-green-400" />
                    <span>Gevalideerd door Bureau Broersma</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield size={14} className="text-green-400" />
                    <span>Energielabel A++</span>
                  </div>
                </div>
                
                <p className="mt-4 text-xs text-white/30 italic">
                  * Illustratief voorbeeld gebaseerd op gemiddelde projectdata
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CROWDSOURCING SECTION - The Differentiator */}
      <section className="py-32 px-6 bg-[#0f1a0f] border-y border-green-500/10 relative overflow-hidden">
        {/* Clean gradient background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a1a0a] via-[#0f1a0f] to-[#0a150a]" />
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-green-900/20 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-emerald-900/15 rounded-full blur-[120px]" />
          
          {/* Subtle grain */}
          <div 
            className="absolute inset-0 opacity-[0.12] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full mb-6">
                <Map size={14} className="text-green-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-green-400">Collectieve Kracht</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-serif mb-6">
                De Kavelkwestie <span className="text-green-400">Kraak Je Niet Alleen</span>
              </h2>
              
              <p className="text-lg text-white/60 font-light leading-relaxed mb-8">
                De vraag naar kavels is enorm, het aanbod versnipperd. Alleen zoeken is een frustrerend, duur en inefficiënt proces. Wij bundelen de kracht van honderden zoekers, data-analyse en experts. Zo maken we samen de woningmarkt transparanter en eerlijker. We identificeren niet alleen bestaande kavels, maar creëren ook nieuwe kansen door data te delen met gemeenten.
              </p>
              
              <div className="space-y-4">
                {[
                  { icon: Users, label: 'Collectieve Datakracht', desc: 'Honderden ogen en slimme algoritmes analyseren bestemmingsplannen, kadasterdata en gemeentelijke notities. We zien wat een individu mist.' },
                  { icon: Map, label: 'AI-Gedreven Potentieelscan', desc: 'Onze AI geeft een eerste, snelle indicatie van de bouwpotentie van een locatie. Geen garantie, wel een krachtig startpunt.' },
                  { icon: UserCheck, label: 'Gevalideerd door Experts', desc: 'Elke serieuze kans wordt doorgelicht door de ingenieurs van Bureau Broersma. Zo weet je dat de basis solide is.' },
                ].map((item, i) => (
                  <div 
                    key={i}
                    className="flex items-start gap-4 p-4 bg-white/5 border border-green-500/10 hover:border-green-500/30 transition-colors group"
                  >
                    <div className="p-2 bg-green-500/20 group-hover:bg-green-500/30 transition-colors">
                      <item.icon size={18} className="text-green-400" />
                    </div>
                    <div>
                      <div className="font-medium text-white">{item.label}</div>
                      <div className="text-sm text-white/50">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Live Community Stats */}
            <div className="relative">
              <div className="bg-[#0d1f3c] border border-blue-500/20 p-8 relative overflow-hidden rounded-xl">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-green-500/10 rounded-full blur-3xl" />
                
                <div className="flex items-center gap-2 mb-8">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-widest text-green-400">Community Stats (Q4 2025)</span>
                </div>
                
                <div className="space-y-8 relative z-10">
                  <div ref={activeParticipants.ref}>
                    <div className="flex items-end justify-between mb-2">
                      <span className="text-white/60">Actieve Deelnemers</span>
                      <span className="text-4xl font-mono font-bold text-green-400">{activeParticipants.count}</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: '63%' }} />
                    </div>
                  </div>
                  
                  <div ref={opportunitiesFound.ref}>
                    <div className="flex items-end justify-between mb-2">
                      <span className="text-white/60">Kansen Gevonden (Deze Maand)</span>
                      <span className="text-4xl font-mono font-bold text-white">{opportunitiesFound.count}</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-white/40 rounded-full" style={{ width: '46%' }} />
                    </div>
                  </div>
                  
                  <div ref={dossiersShared.ref}>
                    <div className="flex items-end justify-between mb-2">
                      <span className="text-white/60">Data-dossiers Gedeeld met Gemeenten</span>
                      <span className="text-4xl font-mono font-bold text-green-400">{dossiersShared.count}</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full" style={{ width: '84%' }} />
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-green-500/10">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-white/40">
                      Provinciefocus:
                    </div>
                    <div className="flex gap-2">
                      {['Zuid-Holland', 'Gelderland', 'Noord-Brabant'].map((prov, i) => (
                        <span key={i} className="px-2 py-1 bg-white/5 text-white/60 text-xs rounded">
                          {prov}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MEET HOMIE - Your AI Building Guide */}
      <section className="py-32 px-6 bg-gradient-to-b from-[#0f1a0f] via-[#0a1a0a] to-[#0a0a0a] relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-[150px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Homie Character & Chat Demo */}
            <div className="relative">
              {/* Homie Avatar */}
              <div className="relative max-w-md mx-auto">
                <div className="absolute -inset-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-3xl blur-xl" />
                <div className="relative bg-[#0d1f3c] border border-blue-500/30 rounded-2xl overflow-hidden">
                  {/* Chat Header */}
                  <div className="flex items-center gap-4 p-6 border-b border-white/10 bg-gradient-to-r from-green-500/10 to-transparent">
                    <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30">
                      <Bot size={32} className="text-black" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-white flex items-center gap-2">
                        Homie
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      </div>
                      <div className="text-sm text-green-400">Altijd één stap voor</div>
                    </div>
                  </div>

                  {/* Example Conversation */}
                  <div className="p-6 space-y-4">
                    {/* User message */}
                    <div className="flex justify-end">
                      <div className="bg-green-500 text-black px-4 py-2 rounded-2xl rounded-br-sm max-w-[80%] text-sm">
                        Hoeveel kost een nieuwbouw huis eigenlijk? 🤔
                      </div>
                    </div>

                    {/* Homie response */}
                    <div className="flex justify-start">
                      <div className="bg-white/10 text-white/90 px-4 py-3 rounded-2xl rounded-bl-sm max-w-[85%] text-sm leading-relaxed">
                        <p className="mb-2">Goede vraag! Gemiddeld kost een nieuwbouwwoning <strong className="text-green-400">€450.000-€550.000</strong>.</p>
                        <p>Door faalkosten te minimaliseren bespaar je tot <strong className="text-green-400">€50.000</strong>! 💪</p>
                      </div>
                    </div>

                    {/* User follow-up */}
                    <div className="flex justify-end">
                      <div className="bg-green-500 text-black px-4 py-2 rounded-2xl rounded-br-sm max-w-[80%] text-sm">
                        En hoe vind ik een goed stuk grond?
                      </div>
                    </div>

                    {/* Homie response */}
                    <div className="flex justify-start">
                      <div className="bg-white/10 text-white/90 px-4 py-3 rounded-2xl rounded-bl-sm max-w-[85%] text-sm leading-relaxed">
                        <p className="mb-2">Samen met onze community! We analyseren bestemmingsplannen en geven een eerste indicatie van bouwpotentie.</p>
                        <p className="text-green-400/80 text-xs mt-2">📍 Data wordt gedeeld met gemeenten voor betere planning</p>
                      </div>
                    </div>
                  </div>

                  {/* Typing indicator */}
                  <div className="px-6 pb-6">
                    <div className="flex items-center gap-2 text-white/40 text-sm">
                      <Lightbulb size={14} className="text-green-400" />
                      <span>Stel me alles over bouwen!</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Homie Description */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full mb-6">
                <Bot size={14} className="text-green-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-green-400">Altijd Een Stap Voor</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-serif mb-6">
                <span className="text-green-400">Homie</span> kent<br />
                jouw traject.
              </h2>

              <p className="text-lg text-white/60 font-light leading-relaxed mb-8">
                Homie is afgestemd op jouw volledige bouwproces. Van eerste idee tot sleuteloverdracht — 
                <strong className="text-white"> altijd één stap voor.</strong> Weet wat je volgende stap is, 
                welke documenten je nodig hebt, en wat er kan misgaan voordat het misgaat.
              </p>

              <div className="space-y-4 mb-10">
                {[
                  { icon: Zap, title: 'Proactief', desc: 'Weet wat je nodig hebt voordat jij het weet' },
                  { icon: MessageCircle, title: 'Jouw Taal', desc: 'Geen jargon. Gewoon duidelijke antwoorden.' },
                  { icon: Shield, title: 'End-to-End', desc: 'Van kavel tot sleutel, altijd aan je zijde' },
                  { icon: Lightbulb, title: 'Context-Aware', desc: 'Kent jouw project, jouw fase, jouw situatie' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 group">
                    <div className="p-2 bg-green-500/20 group-hover:bg-green-500/30 transition-colors rounded-lg">
                      <item.icon size={18} className="text-green-400" />
                    </div>
                    <div>
                      <div className="font-medium text-white">{item.title}</div>
                      <div className="text-sm text-white/50">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setIsHomieOpen(true)}
                className="bg-green-500 text-black px-8 py-4 font-bold hover:bg-green-400 transition-colors flex items-center gap-3 group"
              >
                <Bot size={20} />
                Chat met Homie
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Example Questions */}
          <div className="mt-20 pt-12 border-t border-white/10">
            <div className="text-center mb-8">
              <p className="text-white/40 text-sm uppercase tracking-widest">Homie beantwoordt alles</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                'Wat kost een huis bouwen?',
                'Hoe lang duurt het hele proces?',
                'Wat is een bestemmingsplan?',
                'Hoe werkt een bouwvergunning?',
                'Wat zijn faalkosten precies?',
                'Kan ik ook zelf meebouwen?',
                'Wat is jullie verdienmodel?',
                'Hoe vind ik een kavel?'
              ].map((q, i) => (
                <button 
                  key={i}
                  onClick={() => setIsHomieOpen(true)}
                  className="px-4 py-2 bg-white/5 border border-white/10 text-white/60 hover:text-green-400 hover:border-green-500/30 transition-colors rounded-full text-sm"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The Solution: Ooit Gedacht - Immersive Visual */}
      <section className="py-32 px-6 bg-[#050505] relative overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img 
            src="/generated/blueprint-wood-house.png" 
            alt="" 
            className="w-full h-full object-cover opacity-[0.06]"
          />
        </div>
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-green-500/5 rounded-full blur-[200px]" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <span className="text-green-400 text-sm font-mono uppercase tracking-widest">Het Systeem</span>
            <h2 className="text-4xl md:text-6xl font-serif mt-4">
              Drie pijlers.<br />
              <span className="text-green-400">Één platform.</span>
            </h2>
          </div>

          {/* Immersive Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Card 1: Crowdsourced Land */}
            <div className="group relative bg-gradient-to-br from-[#0a1a0a] to-[#050505] border border-green-500/20 rounded-2xl overflow-hidden hover:border-green-500/40 transition-all duration-500">
              {/* Visual Header */}
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 via-emerald-500/10 to-transparent" />
                {/* Animated map visualization */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Pulsing dots representing community searches */}
                    <div className="absolute -top-8 -left-12 w-3 h-3 bg-green-400 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
                    <div className="absolute top-4 left-16 w-2 h-2 bg-green-400 rounded-full animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
                    <div className="absolute -top-4 right-8 w-2 h-2 bg-green-400 rounded-full animate-ping" style={{ animationDuration: '3s', animationDelay: '1s' }} />
                    <div className="absolute top-12 -right-8 w-3 h-3 bg-green-400 rounded-full animate-ping" style={{ animationDuration: '2.2s', animationDelay: '0.3s' }} />
                    
                    {/* Central icon */}
                    <div className="w-20 h-20 bg-green-500/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-green-500/30 group-hover:scale-110 transition-transform duration-500">
                      <Map size={36} className="text-green-400" />
                    </div>
                  </div>
                </div>
                {/* Counter overlay */}
                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <span className="text-green-400 font-mono text-sm font-bold">127</span>
                  <span className="text-white/60 text-xs ml-1">actieve deelnemers</span>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-8">
                <h3 className="text-2xl font-serif text-white mb-3">Collectieve Datakracht</h3>
                <p className="text-white/50 leading-relaxed mb-6">
                  De community analyseert bestemmingsplannen en kadasterdata. Samen zien we wat een individu mist.
                </p>
                <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  23 kansen geïdentificeerd (Q4 2025)
                </div>
              </div>
            </div>

            {/* Card 2: Vetted Experts */}
            <div className="group relative bg-gradient-to-br from-[#0a0a14] to-[#050505] border border-blue-500/20 rounded-2xl overflow-hidden hover:border-blue-500/40 transition-all duration-500">
              {/* Visual Header */}
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-indigo-500/10 to-transparent" />
                {/* Verification animation */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Orbiting checkmarks */}
                    <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s' }}>
                      <Check size={16} className="absolute -top-10 left-1/2 -translate-x-1/2 text-blue-400" />
                      <Check size={16} className="absolute top-1/2 -right-10 -translate-y-1/2 text-blue-400" />
                      <Check size={16} className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-blue-400" />
                      <Check size={16} className="absolute top-1/2 -left-10 -translate-y-1/2 text-blue-400" />
                    </div>
                    
                    {/* Central icon */}
                    <div className="w-20 h-20 bg-blue-500/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-blue-500/30 group-hover:scale-110 transition-transform duration-500">
                      <Shield size={36} className="text-blue-400" />
                    </div>
                  </div>
                </div>
                {/* Badge overlay */}
                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <span className="text-blue-400 font-mono text-sm font-bold">90+</span>
                  <span className="text-white/60 text-xs ml-1">jaar ervaring</span>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-8">
                <h3 className="text-2xl font-serif text-white mb-3">Gevalideerd door Experts</h3>
                <p className="text-white/50 leading-relaxed mb-6">
                  Bureau Broersma checkt elk ontwerp. Sinds 1956 actief. Geen verrassingen, alleen zekerheid.
                </p>
                <div className="flex items-center gap-3">
                  <img 
                    src="https://www.broersma.biz/wp-content/uploads/2019/02/broersma-logo-dark-1.png" 
                    alt="Bureau Broersma" 
                    className="h-6 opacity-60 invert"
                  />
                </div>
              </div>
            </div>

            {/* Card 3: One Dashboard */}
            <div className="group relative bg-gradient-to-br from-[#14100a] to-[#050505] border border-amber-500/20 rounded-2xl overflow-hidden hover:border-amber-500/40 transition-all duration-500">
              {/* Visual Header */}
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-600/20 via-orange-500/10 to-transparent" />
                {/* Dashboard mockup */}
                <div className="absolute inset-0 flex items-center justify-center p-6">
                  <div className="w-full max-w-[180px] bg-black/40 backdrop-blur-sm rounded-lg border border-white/10 p-3 group-hover:scale-105 transition-transform duration-500">
                    {/* Mini dashboard */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-green-400" />
                      <div className="h-1.5 flex-1 bg-white/20 rounded" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-amber-500/40 rounded w-3/4" />
                      <div className="h-2 bg-amber-500/30 rounded w-1/2" />
                      <div className="h-2 bg-amber-500/20 rounded w-2/3" />
                    </div>
                    <div className="mt-3 pt-3 border-t border-white/10 flex justify-between items-center">
                      <span className="text-[10px] text-white/40">Fase 3/7</span>
                      <div className="flex gap-1">
                        <div className="w-4 h-1 bg-green-400 rounded" />
                        <div className="w-4 h-1 bg-green-400 rounded" />
                        <div className="w-4 h-1 bg-green-400 rounded" />
                        <div className="w-4 h-1 bg-white/20 rounded" />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Status overlay */}
                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <span className="text-amber-400 font-mono text-sm font-bold">1</span>
                  <span className="text-white/60 text-xs ml-1">dashboard voor alles</span>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-8">
                <h3 className="text-2xl font-serif text-white mb-3">Totale Controle</h3>
                <p className="text-white/50 leading-relaxed mb-6">
                  Eén plek voor je hele bouwproces. Documenten, communicatie, betalingen. Betaal alleen bij goedkeuring.
                </p>
                <div className="flex items-center gap-2 text-amber-400 text-sm font-medium">
                  <Check size={16} />
                  Betaling per mijlpaal
                </div>
              </div>
            </div>
          </div>

          {/* Bottom connector visual */}
          <div className="mt-16 flex items-center justify-center gap-4">
            <div className="h-px flex-1 max-w-[200px] bg-gradient-to-r from-transparent via-green-500/30 to-green-500/50" />
            <div className="px-6 py-3 bg-green-500/10 border border-green-500/30 rounded-full">
              <span className="text-green-400 font-medium">= tot €50.000 besparing</span>
            </div>
            <div className="h-px flex-1 max-w-[200px] bg-gradient-to-l from-transparent via-green-500/30 to-green-500/50" />
          </div>
        </div>
      </section>

      {/* The Savings Breakdown */}
      <section className="py-32 px-6 bg-[#0a1628] border-y border-blue-500/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif mb-6">
              Tot <span className="text-green-400">€50.000</span> Besparing per Woning
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Een realistische schatting gebaseerd op data over faalkosten,
              risico-marges en procesoptimalisatie. Resultaten variëren per project.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Traditional Build */}
            <div className="bg-red-500/5 border border-red-500/20 p-8">
              <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="text-red-400" size={24} />
                <h3 className="text-xl font-medium text-red-400">Traditionele Bouw</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-white/10">
                  <span className="text-white/60">Basis bouwkosten</span>
                  <span className="font-mono text-white">€450.000</span>
                </div>
                <div className="flex justify-between py-3 border-b border-white/10">
                  <span className="text-white/60">Faalkosten (~5-8%)</span>
                  <span className="font-mono text-red-400">+€27.000</span>
                </div>
                <div className="flex justify-between py-3 border-b border-white/10">
                  <span className="text-white/60">Aannemer risico-marge</span>
                  <span className="font-mono text-red-400">+€30.000</span>
                </div>
                <div className="flex justify-between py-3 border-b border-white/10">
                  <span className="text-white/60">Onvoorzien/vertraging</span>
                  <span className="font-mono text-red-400">+€25.000</span>
                </div>
                <div className="flex justify-between py-4 text-lg font-bold">
                  <span className="text-white">Totaal</span>
                  <span className="font-mono text-red-400">€532.000</span>
                </div>
              </div>
            </div>

            {/* Ooit Gedacht Build */}
            <div className="bg-green-500/5 border border-green-500/20 p-8">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle2 className="text-green-400" size={24} />
                <h3 className="text-xl font-medium text-green-400">Met Ooit Gedacht</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-white/10">
                  <span className="text-white/60">Basis bouwkosten</span>
                  <span className="font-mono text-white">€450.000</span>
                </div>
                <div className="flex justify-between py-3 border-b border-white/10">
                  <span className="text-white/60">Faalkosten (geminimaliseerd)</span>
                  <span className="font-mono text-green-400">+€5.000</span>
                </div>
                <div className="flex justify-between py-3 border-b border-white/10">
                  <span className="text-white/60">Risico-marge (transparant)</span>
                  <span className="font-mono text-green-400">+€15.000</span>
                </div>
                <div className="flex justify-between py-3 border-b border-white/10">
                  <span className="text-white/60">Platform fee</span>
                  <span className="font-mono text-white/60">+€12.000</span>
                </div>
                <div className="flex justify-between py-4 text-lg font-bold">
                  <span className="text-white">Totaal</span>
                  <span className="font-mono text-green-400">€482.000</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-green-500/20 text-center">
                <div className="text-3xl font-mono font-bold text-green-400">~€50.000</div>
                <div className="text-sm text-green-400/60 uppercase tracking-widest mt-1">Potentiële Besparing</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action: Join the Movement */}
      <section className="py-32 px-6 bg-[#0a1628] relative overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img 
            src="/generated/polder-dak-gevel.png" 
            alt="" 
            className="w-full h-full object-cover opacity-[0.15]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-[#0a0a0a]/60" />
        </div>
        {/* Animated background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/20 rounded-full blur-[200px]" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8">
            <Target size={14} className="text-white/60" />
            <span className="text-xs font-bold uppercase tracking-widest text-white/60">Word onderdeel van de oplossing</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-serif mb-8 leading-tight">
            Samen Land Vinden.<br />
            <span className="text-green-400">Slim Bouwen.</span><br />
            Geld Besparen.
          </h2>

          <p className="text-xl text-white/60 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
            Sluit je aan bij een groeiende gemeenschap van toekomstige huiseigenaren die 
            samen kavels crowdsourcen en bouwen met gevalideerde experts.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setAppState(AppState.WIZARD_MOODBOARD)}
              className="bg-white text-black px-10 py-5 text-lg font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-3 group"
            >
              Start Mijn Droomhuis
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => setAppState(AppState.LANDING)}
              className="border border-white/20 text-white px-10 py-5 text-lg font-medium hover:bg-white/5 transition-colors"
            >
              Meer Informatie
            </button>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 pt-16 border-t border-white/10 grid grid-cols-3 gap-8">
            <div>
              <div className="text-2xl font-mono font-bold text-white">1956</div>
              <div className="text-xs uppercase tracking-widest text-white/40 mt-1">Broersma Sinds</div>
            </div>
            <div>
              <div className="text-2xl font-mono font-bold text-white">127</div>
              <div className="text-xs uppercase tracking-widest text-white/40 mt-1">Actieve Deelnemers</div>
            </div>
            <div>
              <div className="text-2xl font-mono font-bold text-green-400">~€50K</div>
              <div className="text-xs uppercase tracking-widest text-green-400/60 mt-1">Potentiële Besparing</div>
            </div>
          </div>
        </div>
      </section>

      {/* Sources Footer - Now Clickable */}
      <footer className="py-12 px-6 bg-[#050505] border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Bronnen & Research</h4>
              <div className="text-sm space-y-2">
                <a 
                  href={SOURCES.abnAmro}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/40 hover:text-green-400 transition-colors"
                >
                  <ExternalLink size={12} />
                  ABN AMRO — Faalkosten Onderzoek (PDF)
                </a>
                <a 
                  href={SOURCES.mckinsey}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/40 hover:text-green-400 transition-colors"
                >
                  <ExternalLink size={12} />
                  McKinsey — The Construction Productivity Imperative
                </a>
                <a 
                  href={SOURCES.cbs}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/40 hover:text-green-400 transition-colors"
                >
                  <ExternalLink size={12} />
                  CBS — Kerncijfers Nieuwbouwwoningen 2024
                </a>
                <a 
                  href={SOURCES.rijksoverheid}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/40 hover:text-green-400 transition-colors"
                >
                  <ExternalLink size={12} />
                  Ministerie VRO — Staat van de Volkshuisvesting 2024
                </a>
              </div>
            </div>
            
            <div className="text-right">
              <div className="font-serif text-lg font-bold text-white/60 mb-2">Ooit Gedacht.</div>
              <p className="text-xs text-white/30">Samen bouwen aan betaalbaar wonen</p>
              <p className="text-xs text-white/30">© 2025 Ooit Gedacht B.V.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
