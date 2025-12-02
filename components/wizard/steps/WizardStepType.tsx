import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Users } from 'lucide-react';
import { WizardLayout } from '../WizardLayout';
import { HouseholdType } from '../../../types';
import { HOUSEHOLD_OPTIONS } from '../../../constants';
import { useTranslation } from '../../../i18n';

interface WizardStepTypeProps {
  initialValue: HouseholdType;
  onNext: (value: HouseholdType) => void;
}

/**
 * Step 1: Household type selection
 */
export const WizardStepType: React.FC<WizardStepTypeProps> = ({
  initialValue,
  onNext,
}) => {
  const [selected, setSelected] = useState<HouseholdType>(initialValue);
  const { t, tObj } = useTranslation();
  
  // Get translated options
  const householdOptions = tObj<Array<{ value: string; label: string; description: string }>>('options.household');

  const handleNext = () => {
    onNext(selected);
  };
  
  // Merge translated labels with icons from constants
  const options = HOUSEHOLD_OPTIONS.map(opt => {
    const translated = householdOptions.find(h => h.value === opt.value);
    return {
      ...opt,
      label: translated?.label || opt.label,
      description: translated?.description || opt.description,
    };
  });

  return (
    <WizardLayout
      step={1}
      title={t('wizard.step1.title')}
      subtitle={t('wizard.step1.subtitle')}
      icon={<Users size={22} />}
      onNext={handleNext}
    >
      <div className="grid grid-cols-2 gap-3">
        {options.map((option, index) => {
          const isSelected = selected === option.value;
          
          return (
            <motion.button
              key={option.value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelected(option.value)}
              className={`relative p-5 rounded-2xl text-center transition-all ${
                isSelected
                  ? 'bg-blue-500 text-white ring-2 ring-blue-400 ring-offset-2 ring-offset-[#0a1628]'
                  : 'bg-white/5 hover:bg-white/10 border border-white/10'
              }`}
            >
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2"
                >
                  <Check size={14} strokeWidth={3} />
                </motion.div>
              )}
              
              <div className="text-3xl mb-2">{option.icon}</div>
              <div className={`font-medium text-sm ${isSelected ? 'text-white' : 'text-white/90'}`}>
                {option.label}
              </div>
              <div className={`text-xs mt-1 ${isSelected ? 'text-white/70' : 'text-white/40'}`}>
                {option.description}
              </div>
            </motion.button>
          );
        })}
      </div>
    </WizardLayout>
  );
};

