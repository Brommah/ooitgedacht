import React, { useState } from 'react';
import { MapPin, ArrowRight, ArrowLeft, Check, Search, Compass } from 'lucide-react';
import { motion } from 'framer-motion';
import { UserPreferences, LandStatus, PlotSize, GardenOrientation } from '../types';
import { POPULAR_LOCATIONS } from '../constants';

interface LocationStepProps {
  initialPrefs: UserPreferences;
  onNext: (location: UserPreferences['location']) => void;
  onBack: () => void;
}

const PLOT_SIZES: Array<{ value: PlotSize; label: string; description: string }> = [
  { value: '<300', label: '< 300 m²', description: 'Compact stadskavel' },
  { value: '300-500', label: '300-500 m²', description: 'Standaard kavel' },
  { value: '500-1000', label: '500-1000 m²', description: 'Ruim kavel' },
  { value: '1000+', label: '1000+ m²', description: 'Groot landelijk' },
];

const ORIENTATIONS: Array<{ value: GardenOrientation; label: string; icon: string }> = [
  { value: 'north', label: 'Noord', icon: '⬆️' },
  { value: 'east', label: 'Oost', icon: '➡️' },
  { value: 'south', label: 'Zuid', icon: '⬇️' },
  { value: 'west', label: 'West', icon: '⬅️' },
  { value: 'unknown', label: 'Weet niet', icon: '❓' },
];

export const LocationStep: React.FC<LocationStepProps> = ({ initialPrefs, onNext, onBack }) => {
  const [searchQuery, setSearchQuery] = useState(initialPrefs.location.searchQuery);
  const [hasLand, setHasLand] = useState<LandStatus>(initialPrefs.location.hasLand);
  const [plotSize, setPlotSize] = useState<PlotSize | null>(initialPrefs.location.plotSize);
  const [gardenOrientation, setGardenOrientation] = useState<GardenOrientation>(initialPrefs.location.gardenOrientation);

  const handleLocationSelect = (location: string) => {
    setSearchQuery(location);
  };

  const handleNext = () => {
    if (!searchQuery) return;
    
    onNext({
      searchQuery,
      coordinates: null, // Would be geocoded in production
      hasLand,
      plotSize,
      gardenOrientation,
    });
  };

  const canProceed = searchQuery.length > 0;

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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-14 lg:h-20 flex items-center justify-between">
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
          
          <div className="flex items-center gap-2 text-blue-400/60 font-mono text-xs uppercase tracking-wider">
            <MapPin size={14} />
            Stap 4 van 5
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10 pb-28 lg:pb-36">
        
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 lg:mb-12"
        >
          <h1 className="text-3xl lg:text-5xl font-medium tracking-tight text-blue-50">
            Waar gaan we bouwen?
          </h1>
          <p className="text-blue-300/50 mt-3 lg:mt-4 lg:text-lg">
            Selecteer een locatie voor je droomhuis
          </p>
        </motion.div>

        {/* Search Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-400/40">
              <Search size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Postcode, stad of adres..."
              className="w-full bg-blue-950/30 border border-blue-500/20 focus:border-blue-400/50 rounded-xl lg:rounded-2xl py-4 lg:py-5 pl-14 pr-6 text-lg lg:text-xl outline-none transition-colors text-blue-50 placeholder:text-blue-400/30 font-mono"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </motion.div>

        {/* Popular Locations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-10"
        >
          <p className="text-xs lg:text-sm text-blue-400/60 font-mono uppercase tracking-wider mb-4">
            Populaire locaties
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3">
            {POPULAR_LOCATIONS.slice(0, 8).map((location) => {
              const fullName = `${location.name}, ${location.region}`;
              const isSelected = searchQuery === fullName;
              return (
                <motion.button
                  key={location.name}
                  onClick={() => handleLocationSelect(fullName)}
                  whileTap={{ scale: 0.98 }}
                  className={`p-3 lg:p-4 rounded-xl text-left transition-all ${
                    isSelected 
                      ? 'bg-blue-400 text-[#0a1628]' 
                      : 'bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/10'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className={isSelected ? 'text-[#0a1628]/60' : 'text-blue-400/40'} />
                    <div>
                      <div className={`font-medium text-sm ${isSelected ? '' : 'text-blue-100'}`}>
                        {location.name}
                      </div>
                      <div className={`text-xs font-mono ${isSelected ? 'text-[#0a1628]/60' : 'text-blue-400/40'}`}>
                        ~€{location.avgLandPrice}/m²
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Land Ownership */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <p className="text-xs lg:text-sm text-blue-400/60 font-mono uppercase tracking-wider mb-4">
            Heb je al een kavel?
          </p>
          <div className="grid grid-cols-3 gap-2 lg:gap-3">
            {[
              { value: 'yes' as LandStatus, label: 'Ja', desc: 'Ik heb een kavel' },
              { value: 'searching' as LandStatus, label: 'Nee', desc: 'Ik zoek nog' },
              { value: 'undecided' as LandStatus, label: 'Weet niet', desc: 'Nog onzeker' },
            ].map((opt) => {
              const isSelected = hasLand === opt.value;
              return (
                <motion.button
                  key={opt.value}
                  onClick={() => setHasLand(opt.value)}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 lg:p-5 rounded-xl text-center transition-all ${
                    isSelected 
                      ? 'bg-blue-400 text-[#0a1628]' 
                      : 'bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/10'
                  }`}
                >
                  {isSelected && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mb-2">
                      <Check size={16} strokeWidth={3} className="mx-auto" />
                    </motion.div>
                  )}
                  <div className={`font-medium ${isSelected ? '' : 'text-blue-100'}`}>
                    {opt.label}
                  </div>
                  <div className={`text-xs mt-1 ${isSelected ? 'text-[#0a1628]/60' : 'text-blue-400/40'}`}>
                    {opt.desc}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.section>

        {/* Plot Details (if has land) */}
        {hasLand === 'yes' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-8"
          >
            {/* Plot Size */}
            <section>
              <p className="text-xs lg:text-sm text-blue-400/60 font-mono uppercase tracking-wider mb-4">
                Kavelgrootte
              </p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3">
                {PLOT_SIZES.map((opt) => {
                  const isSelected = plotSize === opt.value;
                  return (
                    <motion.button
                      key={opt.value}
                      onClick={() => setPlotSize(opt.value)}
                      whileTap={{ scale: 0.98 }}
                      className={`p-3 lg:p-4 rounded-xl text-left transition-all ${
                        isSelected 
                          ? 'bg-blue-400 text-[#0a1628]' 
                          : 'bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/10'
                      }`}
                    >
                      <div className={`font-medium text-sm ${isSelected ? '' : 'text-blue-100'}`}>
                        {opt.label}
                      </div>
                      <div className={`text-xs mt-1 ${isSelected ? 'text-[#0a1628]/60' : 'text-blue-400/40'}`}>
                        {opt.description}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </section>

            {/* Garden Orientation */}
            <section>
              <p className="text-xs lg:text-sm text-blue-400/60 font-mono uppercase tracking-wider mb-4 flex items-center gap-2">
                <Compass size={14} />
                Oriëntatie tuin
              </p>
              <div className="flex gap-2 lg:gap-3">
                {ORIENTATIONS.map((opt) => {
                  const isSelected = gardenOrientation === opt.value;
                  return (
                    <motion.button
                      key={opt.value}
                      onClick={() => setGardenOrientation(opt.value)}
                      whileTap={{ scale: 0.95 }}
                      className={`flex-1 p-3 lg:p-4 rounded-xl text-center transition-all ${
                        isSelected 
                          ? 'bg-blue-400 text-[#0a1628]' 
                          : 'bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/10'
                      }`}
                    >
                      <div className="text-lg mb-1">{opt.icon}</div>
                      <div className={`text-xs font-medium ${isSelected ? '' : 'text-blue-100'}`}>
                        {opt.label}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </section>
          </motion.div>
        )}

        {/* Info for those searching */}
        {hasLand === 'searching' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 lg:p-5"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                <MapPin size={18} className="text-blue-400" />
              </div>
              <div>
                <div className="text-blue-100 font-medium">Kavels in je regio</div>
                <div className="text-sm text-blue-400/60 mt-1">
                  Na het genereren van je droomhuis tonen we beschikbare kavels in {searchQuery || 'je gekozen regio'}.
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Fixed CTA */}
      <div className="fixed bottom-0 inset-x-0 z-50 p-4 lg:p-6 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/95 to-transparent pointer-events-none">
        <div className="max-w-4xl mx-auto pointer-events-auto">
          <motion.button 
            whileHover={{ scale: canProceed ? 1.01 : 1 }}
            whileTap={{ scale: canProceed ? 0.99 : 1 }}
            onClick={handleNext}
            disabled={!canProceed}
            className={`w-full py-4 lg:py-5 rounded-full flex items-center justify-center gap-3 transition-all text-base lg:text-lg font-semibold shadow-lg ${
              canProceed
                ? 'bg-gradient-to-r from-[#1e3a5f] to-[#0d1f3c] text-white hover:from-[#2a4a73] hover:to-[#1e3a5f] shadow-[#0a1628]/40 border border-[#2a4a73]/30' 
                : 'bg-blue-500/10 text-blue-400/30 cursor-not-allowed border border-blue-500/10 shadow-none'
            }`}
          >
            <span>Budget bepalen</span>
            <ArrowRight size={20} />
          </motion.button>
        </div>
      </div>
    </div>
  );
};
