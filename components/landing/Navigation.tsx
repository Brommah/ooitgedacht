import React, { useState, useEffect } from 'react';
import { Zap, BarChart3, Hammer, Home, ChevronRight, Sparkles, FileText } from 'lucide-react';
import { AppState } from '../../types';

interface NavigationProps {
  setAppState: (state: AppState) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ setAppState }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled ? 'py-2 md:py-3' : 'py-3 md:py-5'}`}>
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
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
                  onClick={() => scrollTo('how-it-works')}
                  className="relative px-5 py-2 text-[13px] text-white/70 hover:text-white transition-all duration-300 rounded-full hover:bg-white/[0.08] group"
                >
                  <span className="relative z-10">Hoe het werkt</span>
                </button>
                <button 
                  onClick={() => scrollTo('passport-section')}
                  className="relative px-5 py-2 text-[13px] text-white/70 hover:text-white transition-all duration-300 rounded-full hover:bg-white/[0.08] group"
                >
                  <span className="relative z-10">Paspoort</span>
                </button>
                <button 
                  onClick={() => setAppState(AppState.WORKSPACE)}
                  className="relative px-5 py-2 text-[13px] text-white/70 hover:text-white transition-all duration-300 rounded-full hover:bg-white/[0.08] group"
                >
                  <span className="relative z-10 flex items-center gap-1.5">
                    <Home size={14} />
                    Overzicht
                  </span>
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
                <button 
                  onClick={() => setAppState(AppState.B2B_BUILDERS)}
                  className="relative px-5 py-2 text-[13px] text-white/70 hover:text-white transition-all duration-300 rounded-full hover:bg-white/[0.08] group"
                >
                  <span className="relative z-10 flex items-center gap-1.5">
                    <Hammer size={14} />
                    Voor Aannemers
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

      {/* Mobile Menu Overlay */}
      <MobileMenu 
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        setAppState={setAppState}
        scrollTo={scrollTo}
      />
    </>
  );
};

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  setAppState: (state: AppState) => void;
  scrollTo: (id: string) => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, setAppState, scrollTo }) => {
  const menuItems = [
    { 
      icon: <Zap size={22} />, 
      label: 'Hoe het werkt', 
      sublabel: 'Van idee tot sleutel',
      color: 'from-blue-400 to-cyan-400',
      onClick: () => scrollTo('how-it-works')
    },
    { 
      icon: <FileText size={22} />, 
      label: 'Woningpaspoort', 
      sublabel: 'Volledige documentatie',
      color: 'from-blue-400 to-cyan-400',
      onClick: () => scrollTo('passport-section')
    },
    { 
      icon: <BarChart3 size={22} />, 
      label: 'Markt Analyse', 
      sublabel: 'Actuele marktdata',
      color: 'from-amber-400 to-orange-400',
      onClick: () => {
        setAppState(AppState.STATE_OF_MARKET);
        onClose();
      }
    },
    { 
      icon: <Hammer size={22} />, 
      label: 'Voor Aannemers', 
      sublabel: 'BouwBorg B2B Platform',
      color: 'from-orange-400 to-red-400',
      onClick: () => {
        setAppState(AppState.B2B_BUILDERS);
        onClose();
      }
    },
  ];

  return (
    <div 
      className={`fixed inset-0 z-[100] lg:hidden transition-all duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
    >
      {/* Backdrop blur */}
      <div 
        className="absolute inset-0 bg-[#030712]/60 backdrop-blur-2xl"
        onClick={onClose}
      />
      
      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-blue-500/5 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none" />
      
      {/* Animated grid pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />
      
      {/* Menu Content */}
      <div className={`relative h-full flex flex-col px-6 pt-24 pb-8 transition-all duration-500 delay-100 ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
        
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center hover:bg-white/[0.1] transition-all"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-white/70">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        
        {/* Logo */}
        <div className="mb-12">
          <span className="text-2xl font-bold text-white tracking-tight">
            Ooit<span className="text-blue-400">Gedacht</span>
          </span>
        </div>
        
        {/* Navigation Links */}
        <nav className="flex-1">
          <ul className="space-y-2">
            {menuItems.map((item, i) => (
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
              onClose();
            }}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#1e3a5f] to-[#0d1f3c] text-white px-8 py-5 text-lg font-semibold rounded-full shadow-lg shadow-[#0a1628]/40 hover:from-[#2a4a73] hover:to-[#1e3a5f] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 border border-[#2a4a73]/30"
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
  );
};

