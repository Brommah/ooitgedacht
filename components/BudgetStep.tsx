import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Check, Wallet, Clock, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { UserPreferences, Timeline, FinancingStatus } from '../types';
import { CURRENCY_SYMBOL, calculateBuildCost, estimateLandCost } from '../constants';

interface BudgetStepProps {
  preferences: UserPreferences;
  onNext: (budget: UserPreferences['budget']) => void;
  onBack: () => void;
}

const TIMELINE_OPTIONS: Array<{ value: Timeline; label: string; icon: string; description: string }> = [
  { value: 'asap', label: 'Zo snel mogelijk', icon: '🚀', description: 'Direct starten' },
  { value: 'within_year', label: 'Binnen 1 jaar', icon: '📅', description: 'Dit jaar nog' },
  { value: '1-2_years', label: '1-2 jaar', icon: '🗓️', description: 'Rustig plannen' },
  { value: 'flexible', label: 'Flexibel', icon: '🌊', description: 'Geen haast' },
];

const FINANCING_OPTIONS: Array<{ value: FinancingStatus; label: string; icon: React.ReactNode; description: string }> = [
  { value: 'exploring', label: 'Oriënterend', icon: <CreditCard size={18} />, description: 'Nog aan het verkennen' },
  { value: 'pre_approved', label: 'Hypotheek indicatie', icon: <CheckCircle size={18} />, description: 'Bedrag bekend' },
  { value: 'cash', label: 'Eigen middelen', icon: <Wallet size={18} />, description: '(Deels) uit eigen zak' },
];

export const BudgetStep: React.FC<BudgetStepProps> = ({ preferences, onNext, onBack }) => {
  const [totalBudget, setTotalBudget] = useState(preferences.budget.total);
  const [timeline, setTimeline] = useState<Timeline>(preferences.budget.timeline);
  const [financingStatus, setFinancingStatus] = useState<FinancingStatus>(preferences.budget.financingStatus);

  // Calculate estimated costs based on preferences
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

  const totalEstimate = buildCost + landCost;
  const budgetDiff = totalBudget - totalEstimate;
  const isFeasible = budgetDiff >= -20000; // Allow 20k buffer

  // Format currency
  const formatCurrency = (amount: number): string => {
    return `${CURRENCY_SYMBOL}${amount.toLocaleString('nl-NL')}`;
  };

  const handleNext = () => {
    onNext({
      total: totalBudget,
      timeline,
      financingStatus,
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
            <Wallet size={14} />
            Stap 5 van 5
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
            Budget & Planning
          </h1>
          <p className="text-blue-300/50 mt-3 lg:mt-4 lg:text-lg">
            Laatste stap voor je droomhuis visualisatie
          </p>
        </motion.div>

        {/* Budget Slider */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-baseline justify-between mb-4">
            <p className="text-xs lg:text-sm text-blue-400/60 font-mono uppercase tracking-wider">
              Totaal budget {preferences.location.hasLand === 'yes' ? '(excl. kavel)' : '(incl. kavel)'}
            </p>
            <motion.span 
              key={totalBudget}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl lg:text-4xl font-mono font-medium text-blue-100"
            >
              {formatCurrency(totalBudget)}
            </motion.span>
          </div>

          <div className="bg-blue-950/30 backdrop-blur border border-blue-500/10 rounded-2xl p-5 lg:p-8">
            <div className="relative h-16 flex items-center mb-4">
              <div className="absolute inset-x-0 h-3 bg-blue-500/20 rounded-full" />
              <motion.div 
                className="absolute h-3 bg-gradient-to-r from-blue-400 to-emerald-400 rounded-full"
                style={{ width: `${((totalBudget - 200000) / 1300000) * 100}%` }}
                layout
              />
              <input 
                type="range" 
                min="200000" 
                max="1500000" 
                step="10000"
                value={totalBudget} 
                onChange={(e) => setTotalBudget(Number(e.target.value))}
                className="absolute inset-x-0 w-full h-16 opacity-0 cursor-pointer"
              />
              <motion.div 
                className="absolute w-8 h-8 bg-blue-400 rounded-full shadow-lg shadow-blue-500/30 border-2 border-white/20"
                style={{ left: `calc(${((totalBudget - 200000) / 1300000) * 100}% - 16px)` }}
                layout
              />
            </div>
            <div className="flex justify-between text-xs text-blue-400/40 font-mono">
              <span>€200k</span>
              <span>€1.5M+</span>
            </div>
          </div>
        </motion.section>

        {/* Cost Breakdown */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className={`rounded-2xl p-5 lg:p-6 border ${
            isFeasible 
              ? 'bg-emerald-500/10 border-emerald-500/20' 
              : 'bg-amber-500/10 border-amber-500/20'
          }`}>
            <div className="flex items-start gap-3 mb-4">
              {isFeasible ? (
                <CheckCircle size={20} className="text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle size={20} className="text-amber-400 shrink-0 mt-0.5" />
              )}
              <div>
                <div className={`font-medium ${isFeasible ? 'text-emerald-100' : 'text-amber-100'}`}>
                  {isFeasible ? 'Past binnen budget' : 'Budget krap'}
                </div>
                <div className={`text-sm ${isFeasible ? 'text-emerald-400/60' : 'text-amber-400/60'}`}>
                  {isFeasible 
                    ? `Je houdt circa ${formatCurrency(Math.max(0, budgetDiff))} over voor onvoorzien`
                    : `Je komt circa ${formatCurrency(Math.abs(budgetDiff))} tekort`
                  }
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/10">
              <div className="flex justify-between text-sm">
                <span className="text-blue-300/60">Bouwkosten ({preferences.config.sqm} m²)</span>
                <span className="font-mono text-blue-100">{formatCurrency(buildCost)}</span>
              </div>
              {preferences.location.hasLand !== 'yes' && (
                <div className="flex justify-between text-sm">
                  <span className="text-blue-300/60">Geschatte kavelkosten</span>
                  <span className="font-mono text-blue-100">{formatCurrency(landCost)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm pt-3 border-t border-white/10">
                <span className="text-blue-200 font-medium">Totaal geschat</span>
                <span className="font-mono text-blue-100 font-bold">{formatCurrency(totalEstimate)}</span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Timeline */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <p className="text-xs lg:text-sm text-blue-400/60 font-mono uppercase tracking-wider mb-4 flex items-center gap-2">
            <Clock size={14} />
            Wanneer wil je bouwen?
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3">
            {TIMELINE_OPTIONS.map((opt) => {
              const isSelected = timeline === opt.value;
              return (
                <motion.button
                  key={opt.value}
                  onClick={() => setTimeline(opt.value)}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-xl text-center transition-all ${
                    isSelected 
                      ? 'bg-blue-400 text-[#0a1628]' 
                      : 'bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/10'
                  }`}
                >
                  <div className="text-xl mb-2">{opt.icon}</div>
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
        </motion.section>

        {/* Financing Status */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-xs lg:text-sm text-blue-400/60 font-mono uppercase tracking-wider mb-4">
            Financiering
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 lg:gap-3">
            {FINANCING_OPTIONS.map((opt) => {
              const isSelected = financingStatus === opt.value;
              return (
                <motion.button
                  key={opt.value}
                  onClick={() => setFinancingStatus(opt.value)}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 lg:p-5 rounded-xl text-left transition-all flex items-center gap-4 ${
                    isSelected 
                      ? 'bg-blue-400 text-[#0a1628]' 
                      : 'bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/10'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isSelected ? 'bg-[#0a1628]/20' : 'bg-blue-500/10'
                  }`}>
                    <span className={isSelected ? 'text-[#0a1628]' : 'text-blue-400'}>
                      {opt.icon}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className={`font-medium ${isSelected ? '' : 'text-blue-100'}`}>
                      {opt.label}
                    </div>
                    <div className={`text-xs ${isSelected ? 'text-[#0a1628]/60' : 'text-blue-400/40'}`}>
                      {opt.description}
                    </div>
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
      </main>

      {/* Fixed CTA */}
      <div className="fixed bottom-0 inset-x-0 z-50 p-4 lg:p-6 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/95 to-transparent pointer-events-none">
        <div className="max-w-4xl mx-auto pointer-events-auto">
          <motion.button 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleNext}
            className="w-full bg-gradient-to-r from-blue-400 to-emerald-400 text-[#0a1628] font-bold py-4 lg:py-5 rounded-xl lg:rounded-2xl flex items-center justify-center gap-3 transition-all hover:opacity-90 text-base lg:text-lg shadow-xl shadow-blue-500/30"
          >
            <span>🏠 Genereer Mijn Droomhuis</span>
            <ArrowRight size={20} />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

