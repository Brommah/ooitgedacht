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

  // Update bedrooms when household type changes
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
          <div className="flex items-center gap-2 text-blue-400/60 font-mono text-xs uppercase tracking-wider">
            <Home size={14} />
            Stap 1 van 5
          </div>
          
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <img src="/generated/og-logo.png" alt="OoitGedacht" className="h-8 opacity-50 brightness-0 invert" />
          </div>
          
          <div className="text-blue-400/40 font-mono text-xs">
            ~15 sec
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10 pb-28 lg:pb-36">
        
        {/* Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 lg:mb-14"
        >
          <h1 className="text-3xl lg:text-5xl font-medium tracking-tight text-blue-50">
            Wie gaat hier wonen?
          </h1>
          <p className="text-blue-300/50 mt-3 lg:mt-4 lg:text-lg">
            Dit helpt ons de perfecte indeling te bepalen
          </p>
        </motion.div>

        {/* Household Type Selection */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <h2 className="text-xs lg:text-sm font-mono uppercase tracking-wider text-blue-400/60 mb-4">
            Huishouden
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {HOUSEHOLD_OPTIONS.map((option) => {
              const isSelected = householdType === option.value;
              return (
                <motion.button
                  key={option.value}
                  onClick={() => handleHouseholdChange(option.value)}
                  whileTap={{ scale: 0.98 }}
                  className={`relative p-4 lg:p-5 rounded-xl lg:rounded-2xl text-center transition-all ${
                    isSelected 
                      ? 'bg-blue-400 text-[#0a1628]' 
                      : 'bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/10'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2"
                    >
                      <Check size={12} strokeWidth={3} />
                    </motion.div>
                  )}
                  <div className="text-2xl lg:text-3xl mb-2">{option.icon}</div>
                  <div className={`text-sm lg:text-base font-medium ${isSelected ? '' : 'text-blue-100'}`}>
                    {option.label}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.section>

        {/* Bedrooms Selection */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-10"
        >
          <h2 className="text-xs lg:text-sm font-mono uppercase tracking-wider text-blue-400/60 mb-4">
            Slaapkamers
          </h2>
          <div className="flex gap-2 lg:gap-3">
            {[1, 2, 3, 4, 5].map((num) => {
              const isSelected = bedrooms === num;
              return (
                <motion.button
                  key={num}
                  onClick={() => setBedrooms(num)}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-1 py-4 lg:py-5 rounded-xl lg:rounded-2xl text-center font-mono text-lg lg:text-xl transition-all ${
                    isSelected 
                      ? 'bg-blue-400 text-[#0a1628] font-bold' 
                      : 'bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/10 text-blue-100'
                  }`}
                >
                  {num}{num === 5 ? '+' : ''}
                </motion.button>
              );
            })}
          </div>
        </motion.section>

        {/* Additional Options */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xs lg:text-sm font-mono uppercase tracking-wider text-blue-400/60 mb-4">
            Extra wensen
          </h2>
          <div className="space-y-3">
            {/* Work from Home */}
            <button
              onClick={() => setWorkFromHome(!workFromHome)}
              className={`w-full p-4 lg:p-5 rounded-xl lg:rounded-2xl flex items-center gap-4 transition-all ${
                workFromHome 
                  ? 'bg-blue-400/20 border-2 border-blue-400' 
                  : 'bg-blue-500/5 border border-blue-500/10 hover:bg-blue-500/10'
              }`}
            >
              <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center ${
                workFromHome ? 'bg-blue-400 text-[#0a1628]' : 'bg-blue-500/10 text-blue-400'
              }`}>
                <Briefcase size={20} />
              </div>
              <div className="flex-1 text-left">
                <div className={`font-medium ${workFromHome ? 'text-blue-100' : 'text-blue-200'}`}>
                  Thuiswerken
                </div>
                <div className="text-sm text-blue-400/50">
                  Aparte werkruimte gewenst
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                workFromHome ? 'border-blue-400 bg-blue-400' : 'border-blue-500/30'
              }`}>
                {workFromHome && <Check size={14} className="text-[#0a1628]" />}
              </div>
            </button>

            {/* Pets */}
            <button
              onClick={() => setPets(!pets)}
              className={`w-full p-4 lg:p-5 rounded-xl lg:rounded-2xl flex items-center gap-4 transition-all ${
                pets 
                  ? 'bg-blue-400/20 border-2 border-blue-400' 
                  : 'bg-blue-500/5 border border-blue-500/10 hover:bg-blue-500/10'
              }`}
            >
              <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center ${
                pets ? 'bg-blue-400 text-[#0a1628]' : 'bg-blue-500/10 text-blue-400'
              }`}>
                <Dog size={20} />
              </div>
              <div className="flex-1 text-left">
                <div className={`font-medium ${pets ? 'text-blue-100' : 'text-blue-200'}`}>
                  Huisdieren
                </div>
                <div className="text-sm text-blue-400/50">
                  Tuin en praktische indeling
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                pets ? 'border-blue-400 bg-blue-400' : 'border-blue-500/30'
              }`}>
                {pets && <Check size={14} className="text-[#0a1628]" />}
              </div>
            </button>

            {/* Accessibility */}
            <button
              onClick={() => setAccessibility(!accessibility)}
              className={`w-full p-4 lg:p-5 rounded-xl lg:rounded-2xl flex items-center gap-4 transition-all ${
                accessibility 
                  ? 'bg-blue-400/20 border-2 border-blue-400' 
                  : 'bg-blue-500/5 border border-blue-500/10 hover:bg-blue-500/10'
              }`}
            >
              <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center ${
                accessibility ? 'bg-blue-400 text-[#0a1628]' : 'bg-blue-500/10 text-blue-400'
              }`}>
                <Accessibility size={20} />
              </div>
              <div className="flex-1 text-left">
                <div className={`font-medium ${accessibility ? 'text-blue-100' : 'text-blue-200'}`}>
                  Toekomstbestendig
                </div>
                <div className="text-sm text-blue-400/50">
                  Levensloopbestendig, geen drempels
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                accessibility ? 'border-blue-400 bg-blue-400' : 'border-blue-500/30'
              }`}>
                {accessibility && <Check size={14} className="text-[#0a1628]" />}
              </div>
            </button>
          </div>
        </motion.section>
      </main>

      {/* Fixed CTA */}
      <div className="fixed bottom-0 inset-x-0 z-50 p-4 lg:p-6 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/95 to-transparent pointer-events-none">
        <div className="max-w-4xl mx-auto pointer-events-auto">
          <motion.button 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleNext}
            className="w-full bg-blue-400 text-[#0a1628] font-semibold py-4 lg:py-5 rounded-xl lg:rounded-2xl flex items-center justify-center gap-3 transition-all hover:bg-blue-300 text-base lg:text-lg shadow-xl shadow-blue-500/20"
          >
            <span>Kies je stijl</span>
            <ArrowRight size={20} />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

