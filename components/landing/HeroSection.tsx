import React from 'react';
import { ChevronRight, Sparkles } from 'lucide-react';
import { AppState } from '../../types';

interface HeroSectionProps {
  setAppState: (state: AppState) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ setAppState }) => {
  return (
    <section className="relative min-h-screen flex items-center pt-24 md:pt-32 pb-12 md:pb-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#0d1f3c] to-[#0a1628]" />
      
      {/* Blueprint grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.04]" 
        style={{ 
          backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} 
      />
      
      {/* Radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl aspect-square bg-blue-500/10 rounded-full blur-[150px] -translate-y-1/2" />
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* Left: Text Content */}
          <div className="text-center lg:text-left order-2 lg:order-1 relative z-20">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/[0.06] border border-white/10 rounded-full px-5 py-2 mb-6 backdrop-blur-sm">
              <Sparkles size={14} className="text-blue-400" />
              <span className="text-xs text-white/80 font-medium">AI-Powered Dream Home Design</span>
            </div>
            
            {/* Headline */}
            <h1 className="font-clash font-semibold tracking-tight mb-6">
              <span className="block text-4xl md:text-5xl lg:text-6xl text-white">
                Ontwerp je
              </span>
              <span className="block text-4xl md:text-5xl lg:text-6xl bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 text-transparent bg-clip-text">
                droomhuis
              </span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-lg md:text-xl text-white/60 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Vertel ons over je woonwensen en zie binnen 30 seconden een AI-gegenereerde visualisatie van jouw ideale woning.
            </p>
            
            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={() => setAppState(AppState.WIZARD_HOUSEHOLD)}
                className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#1e3a5f] to-[#0d1f3c] px-8 py-4 rounded-full text-white font-semibold text-base md:text-lg transition-all duration-300 hover:from-[#2a4a73] hover:to-[#1e3a5f] shadow-xl shadow-[#0a1628]/60 hover:shadow-[#1e3a5f]/40 hover:scale-[1.02] active:scale-[0.98] border border-[#2a4a73]/40"
              >
                <Sparkles size={18} className="text-blue-300" />
                <span>Start Gratis Ontwerp</span>
                <ChevronRight size={18} className="text-blue-300 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            {/* Trust indicators */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 mt-8 justify-center lg:justify-start">
              <p className="text-white/40 text-sm">✓ Geen account nodig</p>
              <p className="text-white/40 text-sm">✓ 100% gratis</p>
              <p className="text-white/40 text-sm">✓ 30 seconden</p>
            </div>
          </div>
          
          {/* Right: Hero Image */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-[#0a1628]/80">
              {/* Gradient border effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-cyan-500/20 rounded-2xl" />
              
              <img 
                src="/generated/hero-new.jpg" 
                alt="AI-gegenereerde droomwoning visualisatie" 
                className="w-full aspect-[4/3] object-cover relative z-10 rounded-2xl"
              />
              
              {/* Floating badge */}
              <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-auto bg-[#0a1628]/90 backdrop-blur-xl rounded-xl p-4 border border-white/10 z-20">
                <p className="text-xs text-white/60 mb-1">AI Render Time</p>
                <p className="text-xl font-bold text-white">~30 seconden</p>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

