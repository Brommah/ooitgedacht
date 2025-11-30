import React from 'react';
import { CheckCircle } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';

export const ResultShowcase: React.FC = () => {
  const features = [
    'Gepersonaliseerde AI visualisatie',
    'Gedetailleerde kostenraming', 
    'Duurzaamheidsscore',
    'Downloadbare presentatie'
  ];

  return (
    <section className="relative py-16 md:py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628] via-[#0d1f3c] to-[#0a1628]" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        <AnimatedSection>
          {/* Section header */}
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-block text-xs font-semibold tracking-widest text-blue-400 uppercase mb-4">
              Dit is wat je krijgt
            </span>
            <h2 className="text-3xl md:text-5xl font-clash font-semibold text-white mb-4">
              Jouw Droomhuis, Visueel
            </h2>
            <p className="text-lg text-white/50 max-w-2xl mx-auto">
              Binnen 30 seconden een complete visualisatie van jouw ideale woning, 
              inclusief kostenraming en duurzaamheidsanalyse.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Features */}
          <AnimatedSection delay={100}>
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feature, i) => (
                  <div 
                    key={i}
                    className="flex items-center gap-3 p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl"
                  >
                    <CheckCircle size={20} className="text-blue-400 flex-shrink-0" />
                    <span className="text-white/80 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white/[0.02] border border-white/[0.05] rounded-xl">
                  <p className="text-2xl md:text-3xl font-bold text-white">30s</p>
                  <p className="text-xs text-white/40 mt-1">Render tijd</p>
                </div>
                <div className="text-center p-4 bg-white/[0.02] border border-white/[0.05] rounded-xl">
                  <p className="text-2xl md:text-3xl font-bold text-white">2K</p>
                  <p className="text-xs text-white/40 mt-1">Resolutie</p>
                </div>
                <div className="text-center p-4 bg-white/[0.02] border border-white/[0.05] rounded-xl">
                  <p className="text-2xl md:text-3xl font-bold text-white">€0</p>
                  <p className="text-xs text-white/40 mt-1">Kosten</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
          
          {/* Right: Preview Image */}
          <AnimatedSection delay={200}>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-[#0a1628]/80 border border-white/[0.08]">
                <img 
                  src="/generated/result-showcase.png" 
                  alt="Voorbeeld resultaat" 
                  className="w-full aspect-[4/3] object-cover"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/60 via-transparent to-transparent" />
                
                {/* Cost badge */}
                <div className="absolute bottom-4 left-4 bg-[#0a1628]/90 backdrop-blur-xl rounded-xl px-4 py-3 border border-white/10">
                  <p className="text-xs text-white/50">Geschatte bouwkosten</p>
                  <p className="text-lg font-bold text-white">€385.000</p>
                </div>
              </div>
              
              {/* Decorative glow */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-blue-500/20 blur-2xl" />
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

