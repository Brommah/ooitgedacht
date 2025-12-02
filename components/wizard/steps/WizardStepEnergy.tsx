import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap } from 'lucide-react';
import { WizardLayout } from '../WizardLayout';
import { EnergyLevel } from '../../../types';
import { ENERGY_OPTIONS, CURRENCY_SYMBOL } from '../../../constants';
import { useTranslation } from '../../../i18n';

interface WizardStepEnergyProps {
  initialValue: EnergyLevel;
  onNext: (value: EnergyLevel) => void;
  onBack: () => void;
}

/**
 * Step 9: Energy level selection
 */
export const WizardStepEnergy: React.FC<WizardStepEnergyProps> = ({
  initialValue,
  onNext,
  onBack,
}) => {
  const [selected, setSelected] = useState<EnergyLevel>(initialValue);
  const { t, tObj } = useTranslation();
  
  // Get translated energy options
  const energyOptions = tObj<Array<{ value: string; label: string; description: string }>>('options.energy');

  const handleNext = () => {
    onNext(selected);
  };
  
  // Merge translations with constants (keep icons and costAdd from constants)
  const options = ENERGY_OPTIONS.map(opt => {
    const translated = energyOptions.find(e => e.value === opt.value);
    return {
      ...opt,
      label: translated?.label || opt.label,
      description: translated?.description || opt.description,
    };
  });

  return (
    <WizardLayout
      step={9}
      title={t('wizard.step9.title')}
      subtitle={t('wizard.step9.subtitle')}
      icon={<Zap size={22} />}
      onBack={onBack}
      onNext={handleNext}
    >
      <div className="space-y-3">
        {options.map((option, index) => {
          const isSelected = selected === option.value;
          
          return (
            <motion.button
              key={option.value}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelected(option.value)}
              className={`w-full p-4 rounded-2xl text-left transition-all flex items-center gap-4 ${
                isSelected
                  ? 'bg-blue-500 text-white ring-2 ring-blue-400 ring-offset-2 ring-offset-[#0a1628]'
                  : 'bg-white/5 hover:bg-white/10 border border-white/10'
              }`}
            >
              <div className="text-2xl">{option.icon}</div>
              
              <div className="flex-1">
                <div className={`font-medium ${isSelected ? 'text-white' : 'text-white/90'}`}>
                  {option.label}
                </div>
                <div className={`text-sm ${isSelected ? 'text-white/70' : 'text-white/40'}`}>
                  {option.description}
                </div>
              </div>
              
              <div className="text-right">
                <div className={`text-sm font-mono ${isSelected ? 'text-white/80' : 'text-white/40'}`}>
                  {option.costAdd > 0 ? `+${CURRENCY_SYMBOL}${(option.costAdd / 1000).toFixed(0)}k` : '—'}
                </div>
              </div>
              
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <Check size={18} strokeWidth={3} />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </WizardLayout>
  );
};

