import React, { useState, useEffect } from 'react';
import { UserPreferences } from '../types';
import { ArrowRight, MessageSquare, Download, Sparkles, Check, Shield, Home, Users, Leaf, X, ChevronUp } from 'lucide-react';
import { CURRENCY_SYMBOL, calculateBuildCost, estimateLandCost, ENERGY_OPTIONS, MATERIAL_OPTIONS } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';

interface ResultsProps {
  image: string;
  locked: boolean;
  onUnlock: () => void;
  onDashboard: () => void;
  preferences: UserPreferences;
}

export const Results: React.FC<ResultsProps> = ({ image, locked, onUnlock, onDashboard, preferences }) => {
  const [email, setEmail] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [panelExpanded, setPanelExpanded] = useState(true);

  // Calculate costs
  const buildCost = calculateBuildCost(
    preferences.config.sqm,
    preferences.config.material,
    preferences.config.energyLevel,
    preferences.config.extras,
    preferences.config.vibe
  );

  const landCost = preferences.location.hasLand === 'yes' 
    ? 0 
    : estimateLandCost(preferences.location.searchQuery, preferences.location.plotSize);

  const totalCost = buildCost + landCost;
  const maxCost = Math.round(totalCost * 1.1 / 5000) * 5000;
  const saving = Math.round(totalCost * 0.13 / 1000) * 1000;

  // Get labels
  const energyOpt = ENERGY_OPTIONS.find(e => e.value === preferences.config.energyLevel);
  const energyLabel = preferences.config.energyLevel === 'positive' ? 'A+++' 
    : preferences.config.energyLevel === 'neutral' ? 'A++' 
    : preferences.config.energyLevel === 'aplus' ? 'A+' 
    : 'A';

  const materialOpt = MATERIAL_OPTIONS.find(m => m.value === preferences.config.material);
  const materialDesc = materialOpt?.label || 'Baksteen';
  const locationName = preferences.location.searchQuery.split(',')[0] || 'Dream';

  useEffect(() => {
    if (!locked) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [locked]);

  // LOCKED STATE - Email capture with full image background
  if (locked) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-screen w-screen relative overflow-hidden"
      >
        {/* Full-screen image */}
        <img 
          src={image} 
          className="absolute inset-0 w-full h-full object-cover" 
          alt="Your Dream Home"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
        
        {/* Top badges */}
        <div className="absolute top-6 left-6 flex gap-2 z-10">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm text-[#0a1628] text-[10px] font-bold uppercase tracking-wider rounded-full">
            <Check size={12} className="text-emerald-600" />
            Gevalideerd
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
            <Sparkles size={12} />
            AI Generated
          </div>
        </div>

        {/* Stats floating on image - bottom left */}
        <div className="absolute bottom-[280px] md:bottom-[240px] left-6 flex gap-3 z-10">
          <div className="bg-black/40 backdrop-blur-xl rounded-xl px-4 py-2 border border-white/20">
            <div className="text-xl font-mono font-bold text-white">{preferences.config.sqm}</div>
            <div className="text-[9px] text-white/60 uppercase tracking-wider">m²</div>
          </div>
          <div className="bg-black/40 backdrop-blur-xl rounded-xl px-4 py-2 border border-white/20">
            <div className="text-xl font-mono font-bold text-white">{preferences.household.bedrooms}</div>
            <div className="text-[9px] text-white/60 uppercase tracking-wider">Slaapkamers</div>
          </div>
          <div className="bg-emerald-500/30 backdrop-blur-xl rounded-xl px-4 py-2 border border-emerald-500/40">
            <div className="text-xl font-mono font-bold text-emerald-400">{energyLabel}</div>
            <div className="text-[9px] text-emerald-400/70 uppercase tracking-wider">Energie</div>
          </div>
        </div>

        {/* Bottom panel - email capture */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <div className="bg-black/80 backdrop-blur-xl border-t border-white/10 p-6 md:p-8">
            <div className="max-w-lg mx-auto text-center">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
                The {locationName} Residence
              </h1>
              <p className="text-white/50 text-sm mb-4">
                {preferences.style.moodBoardSelections[0]} • {materialDesc}
              </p>

              {/* Cost preview */}
              <div className="bg-white/5 rounded-xl p-4 mb-4 border border-white/10">
                <div className="text-xs text-white/40 uppercase tracking-wider">Geschatte investering</div>
                <div className="text-2xl font-mono font-bold text-white">
                  {CURRENCY_SYMBOL} {totalCost.toLocaleString('nl-NL')}
                </div>
                <div className="text-emerald-400 text-sm">
                  -{CURRENCY_SYMBOL}{saving.toLocaleString('nl-NL')} besparing
                </div>
              </div>
              
              {/* Email input */}
              <input 
                type="email" 
                placeholder="Jouw emailadres"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 text-center text-white placeholder:text-white/30 outline-none focus:border-emerald-500/50 mb-3"
              />
              
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onUnlock}
                disabled={!email.includes('@')}
                className="w-full bg-emerald-500 disabled:bg-white/10 disabled:text-white/30 text-white py-3 font-semibold rounded-xl flex items-center justify-center gap-2"
              >
                Bekijk Volledig Passport
                <ArrowRight size={18} />
              </motion.button>

              <p className="text-[10px] text-white/30 mt-3">
                Geen spam • Gevalideerd door Bureau Broersma
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // UNLOCKED STATE - Full image with slide-up panel
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-screen w-screen relative overflow-hidden bg-black"
    >
      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 z-50 pointer-events-none">
            {[...Array(40)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-sm"
                style={{
                  backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'][i % 4],
                  left: `${Math.random() * 100}%`,
                }}
                initial={{ y: -10, opacity: 1, rotate: 0 }}
                animate={{ y: window.innerHeight + 50, opacity: 0, rotate: Math.random() * 720 - 360 }}
                transition={{ duration: 2 + Math.random(), delay: Math.random() * 0.3, ease: 'easeIn' }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* FULL SCREEN IMAGE */}
      <motion.img 
        src={image} 
        alt="Your Dream Home" 
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      />
      
      {/* Subtle vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

      {/* Top badges */}
      <div className="absolute top-4 left-4 flex gap-2 z-10">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm text-[#0a1628] text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg">
          <Check size={12} className="text-emerald-600" />
          Gevalideerd
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg">
          <Sparkles size={12} />
          AI Generated
        </div>
      </div>

      {/* Title overlay - top left */}
      <div className="absolute top-4 right-4 z-10 text-right">
        <h1 className="text-white text-xl md:text-2xl font-bold drop-shadow-lg">
          The {locationName} Residence
        </h1>
        <p className="text-white/70 text-sm drop-shadow-md">
          {preferences.style.moodBoardSelections[0]} • {materialDesc}
        </p>
      </div>

      {/* Floating stats - left side */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10"
      >
        <div className="bg-black/50 backdrop-blur-xl rounded-xl px-4 py-3 border border-white/20 text-center min-w-[80px]">
          <div className="text-2xl font-mono font-bold text-white">{preferences.config.sqm}</div>
          <div className="text-[9px] text-white/60 uppercase tracking-wider">m²</div>
        </div>
        <div className="bg-black/50 backdrop-blur-xl rounded-xl px-4 py-3 border border-white/20 text-center">
          <div className="text-2xl font-mono font-bold text-white">{preferences.household.bedrooms}</div>
          <div className="text-[9px] text-white/60 uppercase tracking-wider">Slaapkamers</div>
        </div>
        <div className="bg-emerald-500/30 backdrop-blur-xl rounded-xl px-4 py-3 border border-emerald-500/40 text-center">
          <div className="text-2xl font-mono font-bold text-emerald-400">{energyLabel}</div>
          <div className="text-[9px] text-emerald-400/70 uppercase tracking-wider">Energie</div>
        </div>
      </motion.div>

      {/* Bottom panel - expandable */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 z-20"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.3, type: 'spring', damping: 25 }}
      >
        {/* Toggle handle */}
        <button 
          onClick={() => setPanelExpanded(!panelExpanded)}
          className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-xl px-4 py-2 rounded-t-xl border border-b-0 border-white/20 text-white/60 hover:text-white transition-colors flex items-center gap-2"
        >
          <motion.div animate={{ rotate: panelExpanded ? 180 : 0 }}>
            <ChevronUp size={18} />
          </motion.div>
          <span className="text-xs font-medium">{panelExpanded ? 'Verberg details' : 'Toon details'}</span>
        </button>

        <AnimatePresence>
          {panelExpanded && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-black/80 backdrop-blur-xl border-t border-white/10 overflow-hidden"
            >
              <div className="p-4 md:p-6 max-w-5xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Cost */}
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Totale Investering</div>
                    <div className="text-2xl font-mono font-bold text-white">
                      {CURRENCY_SYMBOL} {totalCost.toLocaleString('nl-NL')}
                    </div>
                    <div className="text-xs text-white/40">tot {CURRENCY_SYMBOL} {maxCost.toLocaleString('nl-NL')}</div>
                    
                    <div className="mt-3 pt-3 border-t border-white/10 space-y-1 text-xs">
                      <div className="flex justify-between text-white/50">
                        <span>Bouwkosten</span>
                        <span className="font-mono text-white/70">{CURRENCY_SYMBOL} {buildCost.toLocaleString('nl-NL')}</span>
                      </div>
                      {landCost > 0 && (
                        <div className="flex justify-between text-white/50">
                          <span>Kavel (geschat)</span>
                          <span className="font-mono text-white/70">{CURRENCY_SYMBOL} {landCost.toLocaleString('nl-NL')}</span>
                        </div>
                      )}
                      {preferences.config.extras.length > 0 && (
                        <div className="flex justify-between text-emerald-400">
                          <span>Incl. {preferences.config.extras.length} extra's</span>
                          <Check size={14} />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Savings */}
                  <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/20 relative">
                    <div className="absolute top-2 right-2 bg-emerald-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                      -13%
                    </div>
                    <div className="text-[10px] text-emerald-400/70 uppercase tracking-wider mb-1">Directe Besparing</div>
                    <div className="text-2xl font-mono font-bold text-emerald-400">
                      {CURRENCY_SYMBOL} {saving.toLocaleString('nl-NL')}
                    </div>
                    <p className="text-xs text-white/40 mt-2">
                      Door minimalisatie van faalkosten en lagere risicomarge
                    </p>
                    <div className="mt-2 text-xs text-white/30">
                      <span className="line-through">{CURRENCY_SYMBOL} {(totalCost + saving).toLocaleString('nl-NL')}</span>
                      <span className="ml-2 text-white/50">traditioneel</span>
                    </div>
                  </div>

                  {/* Sustainability + CTA */}
                  <div className="space-y-3">
                    {/* Mini stats */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-white/5 rounded-lg p-2 text-center border border-white/10">
                        <div className="text-sm font-mono font-bold text-emerald-400">{energyLabel}</div>
                        <div className="text-[8px] text-white/40 uppercase">Energielabel</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-2 text-center border border-white/10">
                        <div className="text-sm font-mono font-bold text-white">0.48</div>
                        <div className="text-[8px] text-white/40 uppercase">MPG Score</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-2 text-center border border-white/10">
                        <div className="text-sm font-mono font-bold text-white">
                          {preferences.config.energyLevel === 'neutral' || preferences.config.energyLevel === 'positive' ? '€0' : '~€50'}
                        </div>
                        <div className="text-[8px] text-white/40 uppercase">/maand</div>
                      </div>
                    </div>

                    {/* Features */}
                    {(preferences.household.workFromHome || preferences.household.pets || preferences.config.extras.length > 0) && (
                      <div className="flex flex-wrap gap-1">
                        {preferences.household.workFromHome && (
                          <span className="px-2 py-1 bg-blue-500/10 rounded text-[10px] text-blue-400 border border-blue-500/20">
                            💼 Thuiskantoor
                          </span>
                        )}
                        {preferences.household.pets && (
                          <span className="px-2 py-1 bg-amber-500/10 rounded text-[10px] text-amber-400 border border-amber-500/20">
                            🐕 Huisdieren
                          </span>
                        )}
                        {preferences.config.extras.slice(0, 2).map((extra, i) => (
                          <span key={i} className="px-2 py-1 bg-white/5 rounded text-[10px] text-white/60 border border-white/10">
                            {extra}
                          </span>
                        ))}
                        {preferences.config.extras.length > 2 && (
                          <span className="px-2 py-1 bg-white/5 rounded text-[10px] text-white/40">
                            +{preferences.config.extras.length - 2} meer
                          </span>
                        )}
                      </div>
                    )}

                    {/* CTA */}
                    <div className="flex gap-2">
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onDashboard}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-colors"
                      >
                        <MessageSquare size={16} />
                        Open Dashboard
                      </motion.button>
                      
                      <button className="px-4 py-3 bg-white/5 hover:bg-white/10 text-white/70 rounded-xl transition-colors border border-white/10">
                        <Download size={16} />
                      </button>
                    </div>

                    {/* Broersma */}
                    <div className="flex items-center justify-center gap-2 text-white/30 text-[10px]">
                      <Shield size={12} />
                      <span>Gevalideerd door Bureau Broersma Engineering</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapsed state - minimal bar */}
        {!panelExpanded && (
          <div className="bg-black/60 backdrop-blur-xl border-t border-white/10 py-3 px-4">
            <div className="max-w-5xl mx-auto flex items-center justify-between">
              <div>
                <span className="text-white font-mono font-bold">{CURRENCY_SYMBOL} {totalCost.toLocaleString('nl-NL')}</span>
                <span className="text-emerald-400 text-sm ml-2">-{CURRENCY_SYMBOL}{saving.toLocaleString('nl-NL')}</span>
              </div>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onDashboard}
                className="bg-emerald-500 text-white px-6 py-2 font-semibold rounded-lg flex items-center gap-2"
              >
                <MessageSquare size={16} />
                Dashboard
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
