import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Layers } from 'lucide-react';
import { WizardLayout } from '../WizardLayout';
import { MaterialType } from '../../../types';
import { MATERIAL_OPTIONS } from '../../../constants';
import { useTranslation } from '../../../i18n';

interface WizardStepMaterialProps {
  initialValue: MaterialType;
  onNext: (value: MaterialType) => void;
  onBack: () => void;
}

/**
 * Step 8: Material selection
 */
export const WizardStepMaterial: React.FC<WizardStepMaterialProps> = ({
  initialValue,
  onNext,
  onBack,
}) => {
  const [selected, setSelected] = useState<MaterialType>(initialValue);
  const { t, tObj } = useTranslation();
  
  // Get translated material options
  const materialOptions = tObj<Array<{ value: string; label: string; description: string }>>('options.material');

  const handleNext = () => {
    onNext(selected);
  };
  
  // Merge translations with constants (keep icons from constants)
  const options = MATERIAL_OPTIONS.map(opt => {
    const translated = materialOptions.find(m => m.value === opt.value);
    return {
      ...opt,
      label: translated?.label || opt.label,
      description: translated?.description || opt.description,
    };
  });

  return (
    <WizardLayout
      step={8}
      title={t('wizard.step8.title')}
      subtitle={t('wizard.step8.subtitle')}
      icon={<Layers size={22} />}
      onBack={onBack}
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

