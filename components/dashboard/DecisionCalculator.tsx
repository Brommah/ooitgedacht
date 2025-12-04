/**
 * DecisionCalculator - P1.4: Decision support / upgrade calculator
 * 
 * Features:
 * - Compare upgrade options
 * - Calculate ROI and payback periods
 * - Energy savings estimates
 * - Impact on mortgage/monthly costs
 * - Visual comparisons
 */
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, Sun, Battery, Thermometer, Droplets, Car,
  TrendingUp, TrendingDown, ChevronRight, Check, X,
  Euro, Leaf, Zap, Clock, ArrowRight, Info, Sparkles,
  PiggyBank, Calendar, BarChart3
} from 'lucide-react';
import { GlassCard, GlassCardHeader } from './GlassCard';
import { AnimatedCounter } from './AnimatedCounter';

interface UpgradeOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  category: 'energy' | 'comfort' | 'smart' | 'exterior';
  basePrice: number;
  monthlyMortgageImpact: number;
  monthlySavings: number;
  yearlyReturn: number;
  paybackYears: number;
  co2Reduction: number;
  energyImpact: string;
  description: string;
  recommended?: boolean;
  subsidyAvailable?: number;
  pros: string[];
  cons: string[];
}

interface DecisionCalculatorProps {
  className?: string;
  currentMortgagePayment: number;
  currentEnergyBill: number;
  options?: UpgradeOption[];
  onSelect?: (option: UpgradeOption) => void;
}

const DEFAULT_OPTIONS: UpgradeOption[] = [
  {
    id: 'solar-16',
    name: '16 Zonnepanelen',
    icon: <Sun size={20} />,
    category: 'energy',
    basePrice: 8500,
    monthlyMortgageImpact: 32,
    monthlySavings: 85,
    yearlyReturn: 636,
    paybackYears: 10,
    co2Reduction: 2800,
    energyImpact: '+4.200 kWh/jaar',
    description: '16 x 440Wp panelen, zuid-oriëntatie optimaal',
    recommended: true,
    subsidyAvailable: 1200,
    pros: ['Hoogste opbrengst voor je dakoppervlak', 'Direct lagere energierekening', 'Verhoogt woningwaarde'],
    cons: ['Initiele investering', 'Afhankelijk van zon'],
  },
  {
    id: 'battery-10',
    name: 'Thuisbatterij 10kWh',
    icon: <Battery size={20} />,
    category: 'energy',
    basePrice: 7500,
    monthlyMortgageImpact: 28,
    monthlySavings: 45,
    yearlyReturn: 204,
    paybackYears: 15,
    co2Reduction: 800,
    energyImpact: 'Piekvermijding',
    description: 'Sla zonne-energie op voor avondverbruik',
    pros: ['Minder afhankelijk van net', 'Gebruik meer eigen energie', 'Noodstroom beschikbaar'],
    cons: ['Langere terugverdientijd', 'Vervanging na 10-15 jaar'],
  },
  {
    id: 'heat-pump-upgrade',
    name: 'Warmtepomp Premium',
    icon: <Thermometer size={20} />,
    category: 'energy',
    basePrice: 4500,
    monthlyMortgageImpact: 17,
    monthlySavings: 35,
    yearlyReturn: 216,
    paybackYears: 12,
    co2Reduction: 1200,
    energyImpact: 'SCOP 5.2 → 6.0',
    description: 'Upgrade naar high-efficiency warmtepomp',
    subsidyAvailable: 800,
    pros: ['Hogere efficiency', 'Stiller', 'Koelfunctie'],
    cons: ['Meerprijs t.o.v. standaard'],
  },
  {
    id: 'rainwater',
    name: 'Regenwaterreservoir',
    icon: <Droplets size={20} />,
    category: 'exterior',
    basePrice: 3200,
    monthlyMortgageImpact: 12,
    monthlySavings: 25,
    yearlyReturn: 156,
    paybackYears: 14,
    co2Reduction: 400,
    energyImpact: '-30% waterverbruik',
    description: '5000L ondergronds reservoir + filter',
    subsidyAvailable: 500,
    pros: ['Gratis tuin water', 'Minder waterbelasting', 'Duurzaam'],
    cons: ['Onderhoud filter nodig'],
  },
  {
    id: 'ev-charger',
    name: 'Laadpaal 22kW',
    icon: <Car size={20} />,
    category: 'smart',
    basePrice: 2800,
    monthlyMortgageImpact: 11,
    monthlySavings: 60,
    yearlyReturn: 588,
    paybackYears: 4,
    co2Reduction: 2000,
    energyImpact: 'Smart charging',
    description: 'Bidirectioneel laden, zonnevolger',
    recommended: true,
    pros: ['Laden met eigen zonne-energie', 'V2H mogelijkheid', 'Snel terugverdiend'],
    cons: ['Alleen met EV nuttig'],
  },
];

export const DecisionCalculator: React.FC<DecisionCalculatorProps> = ({
  className = '',
  currentMortgagePayment = 1450,
  currentEnergyBill = 180,
  options = DEFAULT_OPTIONS,
  onSelect,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [expandedOption, setExpandedOption] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  const toggleOption = (id: string) => {
    setSelectedOptions(prev => 
      prev.includes(id) ? prev.filter(o => o !== id) : [...prev, id]
    );
  };

  const selectedUpgrades = options.filter(o => selectedOptions.includes(o.id));

  const totals = useMemo(() => {
    return selectedUpgrades.reduce((acc, option) => ({
      investment: acc.investment + option.basePrice - (option.subsidyAvailable || 0),
      monthlyMortgage: acc.monthlyMortgage + option.monthlyMortgageImpact,
      monthlySavings: acc.monthlySavings + option.monthlySavings,
      yearlyReturn: acc.yearlyReturn + option.yearlyReturn,
      co2Reduction: acc.co2Reduction + option.co2Reduction,
      subsidies: acc.subsidies + (option.subsidyAvailable || 0),
    }), {
      investment: 0,
      monthlyMortgage: 0,
      monthlySavings: 0,
      yearlyReturn: 0,
      co2Reduction: 0,
      subsidies: 0,
    });
  }, [selectedUpgrades]);

  const netMonthlyImpact = totals.monthlySavings - totals.monthlyMortgage;
  const newMortgage = currentMortgagePayment + totals.monthlyMortgage;
  const newEnergyBill = currentEnergyBill - totals.monthlySavings;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <GlassCard className="p-5">
        <GlassCardHeader
          title="Upgrade Calculator"
          subtitle="Bereken je besparing"
          icon={<Calculator size={18} className="text-purple-400" />}
        />
        
        <p className="text-sm text-white/60 mt-2">
          Selecteer upgrades om te zien wat ze kosten en opleveren. 
          Homie berekent automatisch het effect op je hypotheek en energierekening.
        </p>
      </GlassCard>

      {/* Options Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {options.map((option) => {
          const isSelected = selectedOptions.includes(option.id);
          const isExpanded = expandedOption === option.id;

          return (
            <motion.div
              key={option.id}
              layout
              className={`rounded-2xl border overflow-hidden ${
                isSelected 
                  ? 'border-purple-500/50 bg-purple-500/10' 
                  : 'border-white/10 bg-white/5'
              }`}
            >
              {/* Option Header */}
              <button
                onClick={() => toggleOption(option.id)}
                className="w-full p-4 flex items-center gap-4"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  isSelected ? 'bg-purple-500/20 text-purple-400' : 'bg-white/5 text-white/50'
                }`}>
                  {option.icon}
                </div>

                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-white">{option.name}</h4>
                    {option.recommended && (
                      <span className="px-1.5 py-0.5 text-[9px] bg-emerald-500/20 text-emerald-400 rounded font-medium">
                        Aanbevolen
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/40 mt-0.5">{option.description}</p>
                </div>

                <div className="text-right">
                  <p className={`font-mono font-bold ${isSelected ? 'text-purple-400' : 'text-white'}`}>
                    €{option.basePrice.toLocaleString()}
                  </p>
                  {option.subsidyAvailable && (
                    <p className="text-[10px] text-emerald-400">
                      -€{option.subsidyAvailable} subsidie
                    </p>
                  )}
                </div>

                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  isSelected 
                    ? 'border-purple-400 bg-purple-500' 
                    : 'border-white/20'
                }`}>
                  {isSelected && <Check size={14} className="text-white" />}
                </div>
              </button>

              {/* Expand button */}
              <div className="px-4 pb-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedOption(isExpanded ? null : option.id);
                  }}
                  className="w-full py-2 text-xs text-white/40 flex items-center justify-center gap-1"
                >
                  {isExpanded ? 'Minder details' : 'Meer details'}
                  <ChevronRight size={14} className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-3 border-t border-white/10 space-y-3">
                        {/* Quick stats */}
                        <div className="grid grid-cols-3 gap-2">
                          <div className="p-2 bg-white/5 rounded-lg text-center">
                            <p className="text-[10px] text-white/40">Besparing/mnd</p>
                            <p className="text-sm font-mono text-emerald-400">€{option.monthlySavings}</p>
                          </div>
                          <div className="p-2 bg-white/5 rounded-lg text-center">
                            <p className="text-[10px] text-white/40">Terugverdientijd</p>
                            <p className="text-sm font-mono text-white">{option.paybackYears}j</p>
                          </div>
                          <div className="p-2 bg-white/5 rounded-lg text-center">
                            <p className="text-[10px] text-white/40">CO₂/jaar</p>
                            <p className="text-sm font-mono text-emerald-400">-{option.co2Reduction}kg</p>
                          </div>
                        </div>

                        {/* Pros & Cons */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-[10px] text-emerald-400 mb-1.5 flex items-center gap-1">
                              <Check size={10} /> Voordelen
                            </p>
                            <ul className="space-y-1">
                              {option.pros.map((pro, i) => (
                                <li key={i} className="text-[11px] text-white/60 flex items-start gap-1">
                                  <span className="text-emerald-400 mt-0.5">•</span>
                                  {pro}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-[10px] text-rose-400 mb-1.5 flex items-center gap-1">
                              <X size={10} /> Nadelen
                            </p>
                            <ul className="space-y-1">
                              {option.cons.map((con, i) => (
                                <li key={i} className="text-[11px] text-white/60 flex items-start gap-1">
                                  <span className="text-rose-400 mt-0.5">•</span>
                                  {con}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary Card */}
      <AnimatePresence>
        {selectedOptions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <GlassCard className="p-5" variant="gradient" glow>
              <GlassCardHeader
                title="Jouw selectie"
                subtitle={`${selectedOptions.length} upgrade${selectedOptions.length > 1 ? 's' : ''}`}
                icon={<Sparkles size={18} className="text-purple-400" />}
              />

              {/* Impact Overview */}
              <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-3 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-2 text-xs text-white/40 mb-1">
                    <Euro size={12} />
                    <span>Investering</span>
                  </div>
                  <p className="text-xl font-mono font-bold text-white">
                    €{totals.investment.toLocaleString()}
                  </p>
                  {totals.subsidies > 0 && (
                    <p className="text-[10px] text-emerald-400 mt-0.5">
                      incl. €{totals.subsidies} subsidie
                    </p>
                  )}
                </div>

                <div className="p-3 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-2 text-xs text-white/40 mb-1">
                    <TrendingUp size={12} />
                    <span>Hypotheek/mnd</span>
                  </div>
                  <p className="text-xl font-mono font-bold text-white">
                    +€{totals.monthlyMortgage}
                  </p>
                  <p className="text-[10px] text-white/40 mt-0.5">
                    Nieuw: €{newMortgage}/mnd
                  </p>
                </div>

                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <div className="flex items-center gap-2 text-xs text-emerald-400 mb-1">
                    <TrendingDown size={12} />
                    <span>Besparing/mnd</span>
                  </div>
                  <p className="text-xl font-mono font-bold text-emerald-400">
                    -€{totals.monthlySavings}
                  </p>
                  <p className="text-[10px] text-emerald-400/60 mt-0.5">
                    Nieuw: €{Math.max(0, newEnergyBill)}/mnd
                  </p>
                </div>

                <div className={`p-3 rounded-xl ${
                  netMonthlyImpact >= 0 
                    ? 'bg-emerald-500/10 border border-emerald-500/20' 
                    : 'bg-amber-500/10 border border-amber-500/20'
                }`}>
                  <div className={`flex items-center gap-2 text-xs mb-1 ${
                    netMonthlyImpact >= 0 ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    <PiggyBank size={12} />
                    <span>Netto effect/mnd</span>
                  </div>
                  <p className={`text-xl font-mono font-bold ${
                    netMonthlyImpact >= 0 ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {netMonthlyImpact >= 0 ? '+' : ''}€{netMonthlyImpact}
                  </p>
                  <p className={`text-[10px] mt-0.5 ${
                    netMonthlyImpact >= 0 ? 'text-emerald-400/60' : 'text-amber-400/60'
                  }`}>
                    {netMonthlyImpact >= 0 ? 'Je bespaart per maand!' : 'Klein maandelijks verschil'}
                  </p>
                </div>
              </div>

              {/* Environmental Impact */}
              <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <Leaf size={20} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm text-emerald-400 font-medium">CO₂ Besparing</p>
                    <p className="text-xs text-emerald-400/60">Per jaar met deze upgrades</p>
                  </div>
                </div>
                <p className="text-2xl font-mono font-bold text-emerald-400">
                  -{(totals.co2Reduction / 1000).toFixed(1)} ton
                </p>
              </div>

              {/* 10 Year Projection */}
              <div className="mt-4 p-3 bg-white/5 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-xs text-white/50">
                    <Calendar size={12} />
                    <span>10 jaar projectie</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-emerald-400">
                    <TrendingUp size={12} />
                    <span>Cumulatieve besparing</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-purple-500 to-emerald-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                  </div>
                  <p className="text-lg font-mono font-bold text-emerald-400">
                    €{(totals.yearlyReturn * 10).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-4 flex gap-2">
                <button 
                  onClick={() => selectedUpgrades.forEach(o => onSelect?.(o))}
                  className="flex-1 py-3 bg-purple-500 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2"
                >
                  <Check size={16} />
                  Selectie toevoegen aan bouwplan
                </button>
                <button className="px-4 py-3 bg-white/5 rounded-xl text-sm text-white/60 flex items-center justify-center gap-2">
                  <BarChart3 size={16} />
                </button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Homie tip */}
      <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-start gap-3">
        <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
          <Info size={16} className="text-blue-400" />
        </div>
        <div>
          <p className="text-sm text-blue-400 font-medium">Homie tip</p>
          <p className="text-xs text-blue-300/70 mt-1">
            Met zonnepanelen + laadpaal combinatie verdien je het snelst terug. 
            Je rijdt dan gratis op eigen zonne-energie en bespaart dubbel!
          </p>
        </div>
      </div>
    </div>
  );
};

export default DecisionCalculator;

