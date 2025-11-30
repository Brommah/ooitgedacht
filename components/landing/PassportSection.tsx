import React from 'react';
import { Shield, FileText, Clock, Users } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';
import { BROERSMA_LOGO } from './theme';

export const PassportSection: React.FC = () => {
  const passportFeatures = [
    { 
      icon: <FileText size={24} />, 
      title: 'Complete Documentatie', 
      desc: 'Alle bouwtekeningen, vergunningen en specificaties op één plek' 
    },
    { 
      icon: <Shield size={24} />, 
      title: 'WKB Compliant', 
      desc: 'Voldoet aan alle eisen van de Wet Kwaliteitsborging' 
    },
    { 
      icon: <Clock size={24} />, 
      title: 'Levenslange Toegang', 
      desc: 'Jouw woningdossier blijft voor altijd beschikbaar' 
    },
    { 
      icon: <Users size={24} />, 
      title: 'Overdraagbaar', 
      desc: 'Verhoogt de waarde bij verkoop van je woning' 
    },
  ];

  return (
    <section id="passport-section" className="relative py-16 md:py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628] to-[#0d1f3c]" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        <AnimatedSection>
          {/* Section header */}
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-block text-xs font-semibold tracking-widest text-blue-400 uppercase mb-4">
              Het Woningpaspoort
            </span>
            <h2 className="text-3xl md:text-5xl font-clash font-semibold text-white mb-4">
              Jouw Woning, Volledig Gedocumenteerd
            </h2>
            <p className="text-lg text-white/50 max-w-2xl mx-auto">
              Een digitaal paspoort dat de complete geschiedenis en documentatie 
              van jouw woning bevat. Voor nu én voor de toekomst.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Passport Visual */}
          <AnimatedSection delay={100}>
            <div className="relative">
              {/* Passport card */}
              <div className="relative bg-gradient-to-br from-[#1a2744] to-[#0d1f3c] rounded-3xl p-8 border border-white/[0.08] shadow-2xl shadow-[#0a1628]/80 overflow-hidden">
                {/* Holographic effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5" />
                
                {/* Header */}
                <div className="relative z-10 flex items-center justify-between mb-8">
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-widest">Woningpaspoort</p>
                    <p className="text-lg font-semibold text-white">NL-2024-WP-001234</p>
                  </div>
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Shield size={32} className="text-white" />
                  </div>
                </div>
                
                {/* Property details */}
                <div className="relative z-10 space-y-4 mb-8">
                  <div className="flex justify-between border-b border-white/[0.06] pb-3">
                    <span className="text-white/50 text-sm">Adres</span>
                    <span className="text-white text-sm">Prinsengracht 123, Amsterdam</span>
                  </div>
                  <div className="flex justify-between border-b border-white/[0.06] pb-3">
                    <span className="text-white/50 text-sm">Type</span>
                    <span className="text-white text-sm">Vrijstaande Woning</span>
                  </div>
                  <div className="flex justify-between border-b border-white/[0.06] pb-3">
                    <span className="text-white/50 text-sm">Bouwjaar</span>
                    <span className="text-white text-sm">2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50 text-sm">Energie Label</span>
                    <span className="text-green-400 font-bold text-sm">A++++</span>
                  </div>
                </div>
                
                {/* Verified badge */}
                <div className="relative z-10 flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-green-400 font-semibold text-sm">Geverifieerd door</p>
                    <img src={BROERSMA_LOGO} alt="Bureau Broersma" className="h-4 brightness-0 invert opacity-60 mt-1" />
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-cyan-500/20 rounded-full blur-2xl" />
            </div>
          </AnimatedSection>
          
          {/* Right: Features */}
          <div className="space-y-4">
            {passportFeatures.map((feature, i) => (
              <AnimatedSection key={i} delay={150 + i * 100}>
                <div className="flex items-start gap-4 p-5 bg-white/[0.03] border border-white/[0.06] rounded-xl hover:bg-white/[0.05] transition-colors group">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center text-blue-400 flex-shrink-0 group-hover:scale-105 transition-transform">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">{feature.title}</h4>
                    <p className="text-sm text-white/50">{feature.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

