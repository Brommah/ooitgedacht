import React, { useState } from 'react';
import { ArrowRight, Check, Home, Briefcase, Dog, Accessibility } from 'lucide-react';
import { motion } from 'framer-motion';
import { HouseholdType, UserPreferences } from '../types';
import { HOUSEHOLD_OPTIONS } from '../constants';

interface HouseholdStepProps {
  initialPrefs: UserPreferences;
  onNext: (household: UserPreferences['household']) => void;
}

export const HouseholdStep: React.FC<HouseholdStepProps> = ({ initialPrefs, onNext }) => {
  const [householdType, setHouseholdType] = useState<HouseholdType>(initialPrefs.household.type);
  const [bedrooms, setBedrooms] = useState(initialPrefs.household.bedrooms);
  const [workFromHome, setWorkFromHome] = useState(initialPrefs.household.workFromHome);
  const [pets, setPets] = useState(initialPrefs.household.pets);
  const [accessibility, setAccessibility] = useState(initialPrefs.household.accessibility);

  const handleHouseholdChange = (type: HouseholdType) => {
    setHouseholdType(type);
    const defaultBedrooms = HOUSEHOLD_OPTIONS.find(h => h.value === type)?.defaultBedrooms || 3;
    setBedrooms(defaultBedrooms);
  };

  const handleNext = () => {
    onNext({
      type: householdType,
      bedrooms,
      workFromHome,
      pets,
      accessibility,
    });
  };

  return (
    <div className="h-screen bg-[#0a1628] text-white flex flex-col overflow-hidden">
      {/* Blueprint Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Header */}
      <header className="relative z-50 bg-[#0a1628]/90 border-b border-blue-500/10 flex-shrink-0">
        <div className="max-w-5xl mx-auto px-6 h-12 flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-400/60 font-mono text-xs uppercase tracking-wider">
            <Home size={14} />
            Stap 1 van 5
          </div>
          <img src="/generated/og-logo.png" alt="OoitGedacht" className="h-6 opacity-40 brightness-0 invert" />
          <div className="text-blue-400/40 font-mono text-xs">~15s</div>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 flex-1 flex flex-col max-w-5xl mx-auto px-4 sm:px-6 w-full py-4 overflow-y-auto">
        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-medium tracking-tight text-blue-50 mb-4 flex-shrink-0">
          Huishouden
        </h1>

        {/* Main Grid - Single column on mobile, two on larger */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-5">
            {/* Household Type */}
            <section>
              <h2 className="text-[10px] font-mono uppercase tracking-wider text-blue-400/60 mb-3">Type</h2>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {HOUSEHOLD_OPTIONS.map((option) => {
                  const isSelected = householdType === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleHouseholdChange(option.value)}
                      className={`relative p-3 sm:p-2 rounded-xl sm:rounded-lg text-center transition-all ${
                        isSelected 
                          ? 'bg-blue-400 text-[#0a1628]' 
                          : 'bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/10'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 sm:top-1 sm:right-1">
                          <Check size={10} strokeWidth={3} className="sm:w-2 sm:h-2" />
                        </div>
                      )}
                      <div className="text-2xl sm:text-lg mb-1 sm:mb-0.5">{option.icon}</div>
                      <div className={`text-[11px] sm:text-[9px] font-medium ${isSelected ? '' : 'text-blue-100'}`}>
                        {option.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Bedrooms */}
            <section>
              <h2 className="text-[10px] font-mono uppercase tracking-wider text-blue-400/60 mb-3">Slaapkamers</h2>
              <div className="flex gap-2 sm:gap-1.5">
                {[1, 2, 3, 4, 5].map((num) => {
                  const isSelected = bedrooms === num;
                  return (
                    <button
                      key={num}
                      onClick={() => setBedrooms(num)}
                      className={`flex-1 py-4 sm:py-3 rounded-xl sm:rounded-lg text-center font-mono text-lg sm:text-base transition-all ${
                        isSelected 
                          ? 'bg-blue-400 text-[#0a1628] font-bold' 
                          : 'bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/10 text-blue-100'
                      }`}
                    >
                      {num}{num === 5 ? '+' : ''}
                    </button>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Right Column - Extra Options */}
          <div>
            <h2 className="text-[10px] font-mono uppercase tracking-wider text-blue-400/60 mb-3">Extra</h2>
            <div className="space-y-2 sm:space-y-1.5">
              <button
                onClick={() => setWorkFromHome(!workFromHome)}
                className={`w-full p-4 sm:p-3 rounded-xl sm:rounded-lg flex items-center gap-3 transition-all ${
                  workFromHome 
                    ? 'bg-blue-400/20 border border-blue-400' 
                    : 'bg-blue-500/5 border border-blue-500/10 hover:bg-blue-500/10'
                }`}
              >
                <div className={`w-10 h-10 sm:w-8 sm:h-8 rounded-lg sm:rounded-md flex items-center justify-center ${
                  workFromHome ? 'bg-blue-400 text-[#0a1628]' : 'bg-blue-500/10 text-blue-400'
                }`}>
                  <Briefcase size={18} className="sm:w-3.5 sm:h-3.5" />
                </div>
                <div className="flex-1 text-left">
                  <div className={`font-medium text-sm sm:text-xs ${workFromHome ? 'text-blue-100' : 'text-blue-200'}`}>Thuiswerken</div>
                  <div className="text-xs sm:text-[10px] text-blue-400/50">Aparte werkruimte</div>
                </div>
                <div className={`w-5 h-5 sm:w-4 sm:h-4 rounded-full border-2 flex items-center justify-center ${
                  workFromHome ? 'border-blue-400 bg-blue-400' : 'border-blue-500/30'
                }`}>
                  {workFromHome && <Check size={12} className="text-[#0a1628] sm:w-2.5 sm:h-2.5" />}
                </div>
              </button>

              <button
                onClick={() => setPets(!pets)}
                className={`w-full p-4 sm:p-3 rounded-xl sm:rounded-lg flex items-center gap-3 transition-all ${
                  pets 
                    ? 'bg-blue-400/20 border border-blue-400' 
                    : 'bg-blue-500/5 border border-blue-500/10 hover:bg-blue-500/10'
                }`}
              >
                <div className={`w-10 h-10 sm:w-8 sm:h-8 rounded-lg sm:rounded-md flex items-center justify-center ${
                  pets ? 'bg-blue-400 text-[#0a1628]' : 'bg-blue-500/10 text-blue-400'
                }`}>
                  <Dog size={18} className="sm:w-3.5 sm:h-3.5" />
                </div>
                <div className="flex-1 text-left">
                  <div className={`font-medium text-sm sm:text-xs ${pets ? 'text-blue-100' : 'text-blue-200'}`}>Huisdieren</div>
                  <div className="text-xs sm:text-[10px] text-blue-400/50">Tuin gewenst</div>
                </div>
                <div className={`w-5 h-5 sm:w-4 sm:h-4 rounded-full border-2 flex items-center justify-center ${
                  pets ? 'border-blue-400 bg-blue-400' : 'border-blue-500/30'
                }`}>
                  {pets && <Check size={12} className="text-[#0a1628] sm:w-2.5 sm:h-2.5" />}
                </div>
              </button>

              <button
                onClick={() => setAccessibility(!accessibility)}
                className={`w-full p-4 sm:p-3 rounded-xl sm:rounded-lg flex items-center gap-3 transition-all ${
                  accessibility 
                    ? 'bg-blue-400/20 border border-blue-400' 
                    : 'bg-blue-500/5 border border-blue-500/10 hover:bg-blue-500/10'
                }`}
              >
                <div className={`w-10 h-10 sm:w-8 sm:h-8 rounded-lg sm:rounded-md flex items-center justify-center ${
                  accessibility ? 'bg-blue-400 text-[#0a1628]' : 'bg-blue-500/10 text-blue-400'
                }`}>
                  <Accessibility size={18} className="sm:w-3.5 sm:h-3.5" />
                </div>
                <div className="flex-1 text-left">
                  <div className={`font-medium text-sm sm:text-xs ${accessibility ? 'text-blue-100' : 'text-blue-200'}`}>Toekomstbestendig</div>
                  <div className="text-xs sm:text-[10px] text-blue-400/50">Levensloopbestendig</div>
                </div>
                <div className={`w-5 h-5 sm:w-4 sm:h-4 rounded-full border-2 flex items-center justify-center ${
                  accessibility ? 'border-blue-400 bg-blue-400' : 'border-blue-500/30'
                }`}>
                  {accessibility && <Check size={12} className="text-[#0a1628] sm:w-2.5 sm:h-2.5" />}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex-shrink-0 pt-6 pb-4 sm:pt-4 sm:pb-0">
          <motion.button 
            whileTap={{ scale: 0.99 }}
            onClick={handleNext}
            className="w-full bg-gradient-to-r from-[#1e3a5f] to-[#0d1f3c] text-white font-semibold py-4 sm:py-3 rounded-full flex items-center justify-center gap-2 transition-all hover:from-[#2a4a73] hover:to-[#1e3a5f] text-base sm:text-sm shadow-lg shadow-[#0a1628]/40 border border-[#2a4a73]/30"
          >
            Verder naar budget <ArrowRight size={18} className="sm:w-4 sm:h-4" />
          </motion.button>
        </div>
      </main>
    </div>
  );
};
