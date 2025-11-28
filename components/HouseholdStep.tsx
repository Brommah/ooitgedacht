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
            Stap 1/5
          </div>
          <img src="/generated/og-logo.png" alt="OoitGedacht" className="h-6 opacity-40 brightness-0 invert" />
          <div className="text-blue-400/40 font-mono text-xs">~15s</div>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 flex-1 flex flex-col max-w-5xl mx-auto px-6 w-full py-4">
        {/* Title */}
        <h1 className="text-2xl font-medium tracking-tight text-blue-50 mb-4 flex-shrink-0">
          Huishouden
        </h1>

        {/* Main Grid */}
        <div className="flex-1 grid grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Household Type */}
            <section>
              <h2 className="text-[10px] font-mono uppercase tracking-wider text-blue-400/60 mb-2">Type</h2>
              <div className="grid grid-cols-5 gap-1.5">
                {HOUSEHOLD_OPTIONS.map((option) => {
                  const isSelected = householdType === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleHouseholdChange(option.value)}
                      className={`relative p-2 rounded-lg text-center transition-all ${
                        isSelected 
                          ? 'bg-blue-400 text-[#0a1628]' 
                          : 'bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/10'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-1 right-1">
                          <Check size={8} strokeWidth={3} />
                        </div>
                      )}
                      <div className="text-lg mb-0.5">{option.icon}</div>
                      <div className={`text-[9px] font-medium ${isSelected ? '' : 'text-blue-100'}`}>
                        {option.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Bedrooms */}
            <section>
              <h2 className="text-[10px] font-mono uppercase tracking-wider text-blue-400/60 mb-2">Slaapkamers</h2>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((num) => {
                  const isSelected = bedrooms === num;
                  return (
                    <button
                      key={num}
                      onClick={() => setBedrooms(num)}
                      className={`flex-1 py-3 rounded-lg text-center font-mono text-base transition-all ${
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
            <h2 className="text-[10px] font-mono uppercase tracking-wider text-blue-400/60 mb-2">Extra</h2>
            <div className="space-y-1.5">
              <button
                onClick={() => setWorkFromHome(!workFromHome)}
                className={`w-full p-3 rounded-lg flex items-center gap-3 transition-all ${
                  workFromHome 
                    ? 'bg-blue-400/20 border border-blue-400' 
                    : 'bg-blue-500/5 border border-blue-500/10 hover:bg-blue-500/10'
                }`}
              >
                <div className={`w-8 h-8 rounded-md flex items-center justify-center ${
                  workFromHome ? 'bg-blue-400 text-[#0a1628]' : 'bg-blue-500/10 text-blue-400'
                }`}>
                  <Briefcase size={14} />
                </div>
                <div className="flex-1 text-left">
                  <div className={`font-medium text-xs ${workFromHome ? 'text-blue-100' : 'text-blue-200'}`}>Thuiswerken</div>
                  <div className="text-[10px] text-blue-400/50">Aparte werkruimte</div>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  workFromHome ? 'border-blue-400 bg-blue-400' : 'border-blue-500/30'
                }`}>
                  {workFromHome && <Check size={10} className="text-[#0a1628]" />}
                </div>
              </button>

              <button
                onClick={() => setPets(!pets)}
                className={`w-full p-3 rounded-lg flex items-center gap-3 transition-all ${
                  pets 
                    ? 'bg-blue-400/20 border border-blue-400' 
                    : 'bg-blue-500/5 border border-blue-500/10 hover:bg-blue-500/10'
                }`}
              >
                <div className={`w-8 h-8 rounded-md flex items-center justify-center ${
                  pets ? 'bg-blue-400 text-[#0a1628]' : 'bg-blue-500/10 text-blue-400'
                }`}>
                  <Dog size={14} />
                </div>
                <div className="flex-1 text-left">
                  <div className={`font-medium text-xs ${pets ? 'text-blue-100' : 'text-blue-200'}`}>Huisdieren</div>
                  <div className="text-[10px] text-blue-400/50">Tuin gewenst</div>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  pets ? 'border-blue-400 bg-blue-400' : 'border-blue-500/30'
                }`}>
                  {pets && <Check size={10} className="text-[#0a1628]" />}
                </div>
              </button>

              <button
                onClick={() => setAccessibility(!accessibility)}
                className={`w-full p-3 rounded-lg flex items-center gap-3 transition-all ${
                  accessibility 
                    ? 'bg-blue-400/20 border border-blue-400' 
                    : 'bg-blue-500/5 border border-blue-500/10 hover:bg-blue-500/10'
                }`}
              >
                <div className={`w-8 h-8 rounded-md flex items-center justify-center ${
                  accessibility ? 'bg-blue-400 text-[#0a1628]' : 'bg-blue-500/10 text-blue-400'
                }`}>
                  <Accessibility size={14} />
                </div>
                <div className="flex-1 text-left">
                  <div className={`font-medium text-xs ${accessibility ? 'text-blue-100' : 'text-blue-200'}`}>Toekomstbestendig</div>
                  <div className="text-[10px] text-blue-400/50">Levensloopbestendig</div>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  accessibility ? 'border-blue-400 bg-blue-400' : 'border-blue-500/30'
                }`}>
                  {accessibility && <Check size={10} className="text-[#0a1628]" />}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex-shrink-0 pt-4">
          <motion.button 
            whileTap={{ scale: 0.99 }}
            onClick={handleNext}
            className="w-full bg-blue-400 text-[#0a1628] font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all hover:bg-blue-300 text-sm shadow-lg shadow-blue-500/20"
          >
            Kies je stijl <ArrowRight size={16} />
          </motion.button>
        </div>
      </main>
    </div>
  );
};
