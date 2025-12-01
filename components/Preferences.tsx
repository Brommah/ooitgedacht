import React, { useState, useEffect } from 'react';
import { UserPreferences, SizeCategory, MaterialType, EnergyLevel, ExtraFeature } from '../types';
import { 
  SIZE_OPTIONS, 
  MATERIAL_OPTIONS, 
  ENERGY_OPTIONS, 
  EXTRA_OPTIONS,
  CURRENCY_SYMBOL,
  calculateBuildCost,
  getVibeLabel,
} from '../constants';
import { ArrowRight, ArrowLeft, Check, Sparkles, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreferencesProps {
  initialPrefs: UserPreferences;
  onNext: (config: UserPreferences['config']) => void;
  onBack: () => void;
  onSwipeMore?: () => void;
}

export const Preferences: React.FC<PreferencesProps> = ({ initialPrefs, onNext, onBack, onSwipeMore }) => {
  const [size, setSize] = useState<SizeCategory>(initialPrefs.config.size);
  const [material, setMaterial] = useState<MaterialType>(initialPrefs.config.material);
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>(initialPrefs.config.energyLevel);
  const [extras, setExtras] = useState<ExtraFeature[]>(initialPrefs.config.extras);
  const [vibe, setVibe] = useState(initialPrefs.config.vibe);
  const [estimatedCost, setEstimatedCost] = useState(350000);
  const [showExtras, setShowExtras] = useState(false);

  const selectionCount = initialPrefs.style.moodBoardSelections.length;

  // Calculate sqm from size
  const getSqm = (s: SizeCategory): number => {
    const opt = SIZE_OPTIONS.find(o => o.value === s);
    return opt ? Math.round((opt.sqmMin + opt.sqmMax) / 2) : 150;
  };

  // Update cost estimate
  useEffect(() => {
    const sqm = getSqm(size);
    const cost = calculateBuildCost(sqm, material, energyLevel, extras, vibe);
    setEstimatedCost(cost);
  }, [size, material, energyLevel, extras, vibe]);

  // Toggle extra feature
  const toggleExtra = (extra: ExtraFeature) => {
    setExtras(prev => 
      prev.includes(extra) 
        ? prev.filter(e => e !== extra)
        : [...prev, extra]
    );
  };

  // Smart defaults based on household
  useEffect(() => {
    // If work from home, suggest office
    if (initialPrefs.household.workFromHome && !extras.includes('office')) {
      setExtras(prev => [...prev, 'office']);
    }
    // If pets, no changes needed but could suggest larger garden
  }, [initialPrefs.household]);

  const handleNext = () => {
    onNext({
      size,
      sqm: getSqm(size),
      material,
      energyLevel,
      extras,
      vibe,
    });
  };

  return (
    <div className="min-h-screen bg-[#0a1628] text-white relative overflow-hidden">
      {/* Blueprint Grid Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
        <div 
          className="absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.8) 2px, transparent 2px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.8) 2px, transparent 2px)
            `,
            backgroundSize: '200px 200px',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a1628]/50 to-[#0a1628]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0a1628]/80 border-b border-blue-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 lg:h-20 flex items-center justify-between">
          <button 
            onClick={onBack} 
            className="flex items-center gap-2 text-blue-300/60 hover:text-blue-300 transition-colors text-sm"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Terug</span>
          </button>
          
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <img src="/generated/og-logo.png" alt="OoitGedacht" className="h-8 opacity-50 brightness-0 invert" />
          </div>

          <motion.div 
            key={estimatedCost}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-right"
          >
            <div className="text-[10px] lg:text-xs text-blue-300/40 uppercase tracking-wider font-mono">Bouwkosten</div>
            <div className="text-xl lg:text-3xl font-mono font-medium text-blue-100">
              {CURRENCY_SYMBOL}{estimatedCost.toLocaleString('nl-NL')}
            </div>
          </motion.div>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8 pb-28 lg:pb-36">
        
        {/* Title Section */}
        <div className="mb-6 lg:mb-12">
          <div className="flex items-center gap-2 text-blue-400/60 font-mono text-xs uppercase tracking-wider mb-2">
            <Zap size={14} />
            Stap 5 van 5
          </div>
          <h1 className="text-2xl lg:text-5xl font-medium tracking-tight text-blue-50">Configureer</h1>
          <p className="text-blue-300/50 mt-2 lg:mt-4 lg:text-lg font-mono">
            Gebaseerd op {selectionCount} {selectionCount === 1 ? 'stijl' : 'stijlen'}
          </p>
          
          {/* Swipe More Option */}
          {onSwipeMore && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onClick={onSwipeMore}
              className="mt-4 flex items-center gap-3 px-4 py-3 bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/20 rounded-xl text-sm transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Sparkles size={16} className="text-blue-400" />
              </div>
              <div className="text-left">
                <div className="text-blue-200 font-medium">Nauwkeuriger resultaat?</div>
                <div className="text-blue-400/50 text-xs font-mono">Kies meer stijlen</div>
              </div>
              <ArrowRight size={16} className="text-blue-400/30 group-hover:text-blue-400 ml-auto transition-colors" />
            </motion.button>
          )}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          
          {/* Left Column */}
          <div className="space-y-6">
            
            {/* Size Section */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-blue-950/30 backdrop-blur border border-blue-500/10 rounded-2xl p-5 lg:p-8"
            >
              <h2 className="text-xs lg:text-sm font-mono uppercase tracking-wider text-blue-400 mb-5">Omvang</h2>
              
              <div className="grid grid-cols-2 gap-2 lg:gap-3">
                {SIZE_OPTIONS.map((opt) => {
                  const isSelected = size === opt.value;
                  return (
                    <motion.button
                      key={opt.value}
                      onClick={() => setSize(opt.value)}
                      whileTap={{ scale: 0.98 }}
                      className={`relative p-4 lg:p-5 rounded-xl text-left transition-all ${
                        isSelected 
                          ? 'bg-blue-400 text-[#0a1628]' 
                          : 'bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/10'
                      }`}
                    >
                      {isSelected && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 right-2">
                          <Check size={12} strokeWidth={3} />
                        </motion.div>
                      )}
                      <div className={`text-base lg:text-lg font-medium ${isSelected ? '' : 'text-blue-100'}`}>
                        {opt.label}
                      </div>
                      <div className={`text-xs mt-1 font-mono ${isSelected ? 'text-blue-900/60' : 'text-blue-400/40'}`}>
                        {opt.sqmRange}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.section>

            {/* Material Section */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-blue-950/30 backdrop-blur border border-blue-500/10 rounded-2xl p-5 lg:p-8"
            >
              <h2 className="text-xs lg:text-sm font-mono uppercase tracking-wider text-blue-400 mb-5">Materiaal</h2>
              
              <div className="grid grid-cols-2 gap-2 lg:gap-3">
                {MATERIAL_OPTIONS.map((opt) => {
                  const isSelected = material === opt.value;
                  return (
                    <motion.button
                      key={opt.value}
                      onClick={() => setMaterial(opt.value)}
                      whileTap={{ scale: 0.98 }}
                      className={`relative p-4 lg:p-5 rounded-xl text-left transition-all ${
                        isSelected 
                          ? 'bg-blue-400 text-[#0a1628]' 
                          : 'bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/10'
                      }`}
                    >
                      {isSelected && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 right-2">
                          <Check size={12} strokeWidth={3} />
                        </motion.div>
                      )}
                      <div className="text-xl mb-1">{opt.icon}</div>
                      <div className={`text-sm lg:text-base font-medium ${isSelected ? '' : 'text-blue-100'}`}>
                        {opt.label}
                      </div>
                      <div className={`text-xs mt-1 font-mono ${isSelected ? 'text-blue-900/60' : 'text-blue-400/40'}`}>
                        {opt.description}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.section>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            
            {/* Energy Section */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-blue-950/30 backdrop-blur border border-blue-500/10 rounded-2xl p-5 lg:p-8"
            >
              <h2 className="text-xs lg:text-sm font-mono uppercase tracking-wider text-blue-400 mb-5">Energielevel</h2>
              
              <div className="space-y-2">
                {ENERGY_OPTIONS.map((opt) => {
                  const isSelected = energyLevel === opt.value;
                  return (
                    <motion.button
                      key={opt.value}
                      onClick={() => setEnergyLevel(opt.value)}
                      whileTap={{ scale: 0.99 }}
                      className={`w-full relative p-4 rounded-xl text-left transition-all flex items-center gap-4 ${
                        isSelected 
                          ? 'bg-blue-400 text-[#0a1628]' 
                          : 'bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/10'
                      }`}
                    >
                      <div className="text-2xl">{opt.icon}</div>
                      <div className="flex-1">
                        <div className={`font-medium ${isSelected ? '' : 'text-blue-100'}`}>
                          {opt.label}
                        </div>
                        <div className={`text-xs ${isSelected ? 'text-blue-900/60' : 'text-blue-400/40'}`}>
                          {opt.description}
                        </div>
                      </div>
                      <div className={`text-sm font-mono ${isSelected ? 'text-blue-900/80' : 'text-blue-400/60'}`}>
                        {opt.costAdd > 0 ? `+${CURRENCY_SYMBOL}${(opt.costAdd / 1000).toFixed(0)}k` : '—'}
                      </div>
                      {isSelected && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                          <Check size={16} strokeWidth={3} />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.section>

            {/* Vibe Slider */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-blue-950/30 backdrop-blur border border-blue-500/10 rounded-2xl p-5 lg:p-8"
            >
              <div className="flex items-baseline justify-between mb-5">
                <h2 className="text-xs lg:text-sm font-mono uppercase tracking-wider text-blue-400">Sfeer</h2>
                <span className="text-sm text-blue-300/60">{getVibeLabel(vibe)}</span>
              </div>
              
              <div className="relative h-16 flex items-center">
                <div className="absolute inset-x-0 h-2 bg-gradient-to-r from-blue-500/20 via-blue-400/30 to-amber-400/30 rounded-full" />
                <motion.div 
                  className="absolute h-2 bg-gradient-to-r from-blue-400 to-blue-300 rounded-full"
                  style={{ width: `${vibe}%` }}
                  layout
                />
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={vibe} 
                  onChange={(e) => setVibe(Number(e.target.value))}
                  className="absolute inset-x-0 w-full h-16 opacity-0 cursor-pointer"
                />
                <motion.div 
                  className="absolute w-6 h-6 bg-blue-400 rounded-full shadow-lg shadow-blue-500/30 border-2 border-white/20"
                  style={{ left: `calc(${vibe}% - 12px)` }}
                  layout
                />
              </div>
              <div className="flex justify-between text-[10px] text-blue-400/40 font-mono mt-2">
                <span>STRAK</span>
                <span>WARM</span>
              </div>
            </motion.section>
          </div>
        </div>

        {/* Extras Section - Collapsible */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 lg:mt-8"
        >
          <button
            onClick={() => setShowExtras(!showExtras)}
            className="w-full bg-blue-950/30 backdrop-blur border border-blue-500/10 rounded-2xl p-5 flex items-center justify-between hover:bg-blue-950/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">✨</span>
              <div className="text-left">
                <div className="text-blue-100 font-medium">Extra's toevoegen</div>
                <div className="text-xs text-blue-400/50">
                  {extras.length > 0 ? `${extras.length} geselecteerd` : 'Optioneel'}
                </div>
              </div>
            </div>
            <motion.div
              animate={{ rotate: showExtras ? 180 : 0 }}
              className="text-blue-400"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.div>
          </button>

          <AnimatePresence>
            {showExtras && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-3 mt-4">
                  {EXTRA_OPTIONS.map((opt) => {
                    const isSelected = extras.includes(opt.value);
                    return (
                      <motion.button
                        key={opt.value}
                        onClick={() => toggleExtra(opt.value)}
                        whileTap={{ scale: 0.98 }}
                        className={`relative p-3 lg:p-4 rounded-xl text-left transition-all ${
                          isSelected 
                            ? 'bg-blue-400/20 border-2 border-blue-400' 
                            : 'bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/10'
                        }`}
                      >
                        {isSelected && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 right-2">
                            <Check size={10} strokeWidth={3} className="text-blue-400" />
                          </motion.div>
                        )}
                        <div className="text-lg mb-1">{opt.icon}</div>
                        <div className={`text-xs lg:text-sm font-medium ${isSelected ? 'text-blue-100' : 'text-blue-200'}`}>
                          {opt.label}
                        </div>
                        <div className={`text-[10px] lg:text-xs font-mono mt-0.5 ${isSelected ? 'text-blue-400' : 'text-blue-400/40'}`}>
                          +{CURRENCY_SYMBOL}{(opt.cost / 1000).toFixed(0)}k
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      </main>

      {/* Fixed CTA - Final step before generation */}
      <div className="fixed bottom-0 inset-x-0 z-50 p-4 lg:p-6 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/95 to-transparent pointer-events-none">
        <div className="max-w-7xl mx-auto flex justify-center lg:justify-end pointer-events-auto">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNext}
            className="w-full lg:w-auto bg-gradient-to-r from-blue-500 to-emerald-500 text-white font-bold py-4 lg:py-5 px-8 lg:px-16 rounded-full flex items-center justify-center gap-3 transition-all hover:from-blue-400 hover:to-emerald-400 text-base lg:text-lg shadow-lg shadow-blue-500/40"
          >
            <Sparkles size={20} />
            <span>Genereer Mijn Droomhuis</span>
            <ArrowRight size={20} />
          </motion.button>
        </div>
      </div>
    </div>
  );
};
