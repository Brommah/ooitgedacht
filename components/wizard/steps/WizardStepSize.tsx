import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Maximize } from 'lucide-react';
import { WizardLayout } from '../WizardLayout';
import { SizeCategory } from '../../../types';
import { SIZE_OPTIONS } from '../../../constants';
import { useTranslation } from '../../../i18n';

interface WizardStepSizeProps {
  initialValue: SizeCategory;
  onNext: (value: SizeCategory) => void;
  onBack: () => void;
}

/**
 * Step 7: House size selection
 */
export const WizardStepSize: React.FC<WizardStepSizeProps> = ({
  initialValue,
  onNext,
  onBack,
}) => {
  const [selected, setSelected] = useState<SizeCategory>(initialValue);
  const { t, tObj } = useTranslation();
  
  // Get translated size options
  const sizeOptions = tObj<Array<{ value: string; label: string; sqmRange: string; description: string }>>('options.size');

  const handleNext = () => {
    onNext(selected);
  };
  
  // Merge translations with constants
  const options = SIZE_OPTIONS.map(opt => {
    const translated = sizeOptions.find(s => s.value === opt.value);
    return {
      ...opt,
      label: translated?.label || opt.label,
      description: translated?.description || opt.description,
    };
  });

  return (
    <WizardLayout
      step={7}
      title={t('wizard.step7.title')}
      subtitle={t('wizard.step7.subtitle')}
      icon={<Maximize size={22} />}
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
              className={`w-full p-4 rounded-2xl text-left transition-all ${
                isSelected
                  ? 'bg-blue-500 text-white ring-2 ring-blue-400 ring-offset-2 ring-offset-[#0a1628]'
                  : 'bg-white/5 hover:bg-white/10 border border-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className={`font-medium text-base ${isSelected ? 'text-white' : 'text-white/90'}`}>
                    {option.label}
                  </div>
                  <div className={`text-sm font-mono mt-1 ${isSelected ? 'text-white/70' : 'text-white/40'}`}>
                    {option.sqmRange}
                  </div>
                  <div className={`text-xs mt-1 ${isSelected ? 'text-white/60' : 'text-white/30'}`}>
                    {option.description}
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
              </div>
            </motion.button>
          );
        })}
      </div>
    </WizardLayout>
  );
};

