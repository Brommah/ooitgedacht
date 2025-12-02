import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';
import { WizardLayout } from '../WizardLayout';
import { CURRENCY_SYMBOL } from '../../../constants';
import { useTranslation, getBudgetTierLabel } from '../../../i18n';

interface WizardStepBudgetProps {
  initialValue: number;
  onNext: (value: number) => void;
  onBack: () => void;
}

const MIN_BUDGET = 200000;
const MAX_BUDGET = 1500000;
const STEP = 10000;

/**
 * Step 3: Budget slider selection
 */
export const WizardStepBudget: React.FC<WizardStepBudgetProps> = ({
  initialValue,
  onNext,
  onBack,
}) => {
  const [budget, setBudget] = useState<number>(initialValue);
  const { t, language } = useTranslation();

  const handleNext = () => {
    onNext(budget);
  };

  const formatCurrency = (amount: number): string => {
    return `${CURRENCY_SYMBOL}${amount.toLocaleString('nl-NL')}`;
  };

  const progress = ((budget - MIN_BUDGET) / (MAX_BUDGET - MIN_BUDGET)) * 100;

  return (
    <WizardLayout
      step={3}
      title={t('wizard.step3.title')}
      subtitle={t('wizard.step3.subtitle')}
      icon={<Wallet size={22} />}
      onBack={onBack}
      onNext={handleNext}
    >
      {/* Budget Display */}
      <motion.div
        key={budget}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center mb-8"
      >
        <div className="text-4xl sm:text-5xl font-mono font-semibold text-white tracking-tight">
          {formatCurrency(budget)}
        </div>
        <div className="text-sm text-blue-400 mt-2 font-medium">
          {getBudgetTierLabel(budget, language)}
        </div>
      </motion.div>

      {/* Slider */}
      <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
        <div className="relative h-12 flex items-center">
          {/* Track background */}
          <div className="absolute inset-x-0 h-2 bg-white/10 rounded-full" />
          
          {/* Filled track */}
          <motion.div
            className="absolute h-2 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
            style={{ width: `${progress}%` }}
            layout
          />
          
          {/* Range input */}
          <input
            type="range"
            min={MIN_BUDGET}
            max={MAX_BUDGET}
            step={STEP}
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="absolute inset-x-0 w-full h-12 opacity-0 cursor-pointer"
          />
          
          {/* Thumb */}
          <motion.div
            className="absolute w-6 h-6 bg-blue-400 rounded-full shadow-lg shadow-blue-500/40 border-2 border-white/30"
            style={{ left: `calc(${progress}% - 12px)` }}
            layout
          />
        </div>

        {/* Scale labels */}
        <div className="flex justify-between mt-4 text-xs text-white/30 font-mono">
          <span>€200k</span>
          <span>€500k</span>
          <span>€1M</span>
          <span>€1.5M</span>
        </div>
      </div>

      {/* Quick select buttons */}
      <div className="grid grid-cols-4 gap-2 mt-6">
        {[300000, 450000, 600000, 900000].map((amount, index) => (
          <motion.button
            key={amount}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.05 }}
            onClick={() => setBudget(amount)}
            className={`py-3 rounded-xl text-xs font-mono transition-all ${
              budget === amount
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'bg-white/5 text-white/50 hover:bg-white/10 border border-white/5'
            }`}
          >
            €{amount / 1000}k
          </motion.button>
        ))}
      </div>
    </WizardLayout>
  );
};

