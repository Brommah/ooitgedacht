import React from 'react';
import { LayoutDashboard, FileCheck, Users, Calendar } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';

export const DashboardPreview: React.FC = () => {
  const dashboardFeatures = [
    { icon: <Calendar size={20} />, label: 'Bouw Timeline', desc: 'Live voortgang volgen' },
    { icon: <FileCheck size={20} />, label: 'Documenten', desc: 'Alle papieren op één plek' },
    { icon: <Users size={20} />, label: 'Team Chat', desc: 'Direct met aannemers praten' },
    { icon: <LayoutDashboard size={20} />, label: 'Overzicht', desc: 'Kosten & planning' },
  ];

  return (
    <section className="relative py-16 md:py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-[#0a1628]" />
      
      {/* Subtle pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]" 
        style={{ 
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} 
      />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        <AnimatedSection>
          {/* Section header */}
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-block text-xs font-semibold tracking-widest text-blue-400 uppercase mb-4">
              Jouw Bouwbesturingssysteem
            </span>
            <h2 className="text-3xl md:text-5xl font-clash font-semibold text-white mb-4">
              Alles Onder Controle
            </h2>
            <p className="text-lg text-white/50 max-w-2xl mx-auto">
              Van ontwerp tot oplevering: volg je bouwproces real-time met ons 
              intuïtieve dashboard.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Left: Feature Cards */}
          <div className="lg:col-span-2 space-y-4">
            {dashboardFeatures.map((feature, i) => (
              <AnimatedSection key={i} delay={i * 100}>
                <div className="flex items-start gap-4 p-5 bg-white/[0.03] border border-white/[0.06] rounded-xl hover:bg-white/[0.05] transition-colors group">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center text-blue-400 flex-shrink-0 group-hover:scale-105 transition-transform">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">{feature.label}</h4>
                    <p className="text-sm text-white/50">{feature.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
          
          {/* Right: Dashboard Preview */}
          <AnimatedSection className="lg:col-span-3" delay={100}>
            <div className="relative">
              {/* Browser chrome mockup */}
              <div className="bg-[#1a2744] rounded-2xl overflow-hidden shadow-2xl shadow-[#0a1628]/80 border border-white/[0.08]">
                {/* Browser header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-[#0d1f3c] border-b border-white/[0.06]">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/60" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                    <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-[#0a1628] rounded-lg px-4 py-1.5 text-xs text-white/40 text-center">
                      app.ooitgedacht.nl/dashboard
                    </div>
                  </div>
                </div>
                
                {/* Dashboard content mockup */}
                <div className="p-6 space-y-4">
                  {/* Stats row */}
                  <div className="grid grid-cols-4 gap-3">
                    {['45%', '12', '€385K', '8 wkn'].map((stat, i) => (
                      <div key={i} className="bg-[#0a1628]/60 rounded-xl p-3 text-center">
                        <p className="text-lg font-bold text-white">{stat}</p>
                        <p className="text-[10px] text-white/40">{['Voortgang', 'Taken', 'Budget', 'Restant'][i]}</p>
                      </div>
                    ))}
                  </div>
                  
                  {/* Timeline mockup */}
                  <div className="bg-[#0a1628]/60 rounded-xl p-4">
                    <h5 className="text-sm font-semibold text-white mb-3">Bouw Timeline</h5>
                    <div className="space-y-2">
                      {['Fundering', 'Constructie', 'Dak & Gevel', 'Afwerking'].map((phase, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${i < 2 ? 'bg-green-500' : i === 2 ? 'bg-blue-400 animate-pulse' : 'bg-white/20'}`} />
                          <span className={`text-xs ${i < 2 ? 'text-white/70' : i === 2 ? 'text-white' : 'text-white/40'}`}>{phase}</span>
                          <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${i < 2 ? 'bg-green-500' : i === 2 ? 'bg-blue-400' : 'bg-white/10'}`}
                              style={{ width: i === 0 ? '100%' : i === 1 ? '100%' : i === 2 ? '40%' : '0%' }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
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

