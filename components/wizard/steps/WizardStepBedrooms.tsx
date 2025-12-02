import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bed } from 'lucide-react';
import { WizardLayout } from '../WizardLayout';
import { useTranslation } from '../../../i18n';

interface WizardStepBedroomsProps {
  initialValue: number;
  onNext: (value: number) => void;
  onBack: () => void;
}

const BEDROOM_OPTIONS = [1, 2, 3, 4, 5];

/**
 * Step 2: Number of bedrooms selection
 */
export const WizardStepBedrooms: React.FC<WizardStepBedroomsProps> = ({
  initialValue,
  onNext,
  onBack,
}) => {
  const [selected, setSelected] = useState<number>(initialValue);
  const { t } = useTranslation();

  const handleNext = () => {
    onNext(selected);
  };

  return (
    <WizardLayout
      step={2}
      title={t('wizard.step2.title')}
      subtitle={t('wizard.step2.subtitle')}
      icon={<Bed size={22} />}
      onBack={onBack}
      onNext={handleNext}
    >
      <div className="flex gap-3">
        {BEDROOM_OPTIONS.map((num, index) => {
          const isSelected = selected === num;
          
          return (
            <motion.button
              key={num}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelected(num)}
              className={`flex-1 py-6 rounded-2xl text-center font-mono transition-all ${
                isSelected
                  ? 'bg-blue-500 text-white ring-2 ring-blue-400 ring-offset-2 ring-offset-[#0a1628]'
                  : 'bg-white/5 hover:bg-white/10 border border-white/10 text-white/90'
              }`}
            >
              <span className="text-2xl font-semibold">{num}</span>
              {num === 5 && <span className="text-lg">+</span>}
            </motion.button>
          );
        })}
      </div>

      {/* Visual indicator */}
      <motion.div
        key={selected}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 flex justify-center gap-2"
      >
        {Array.from({ length: selected }, (_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center"
          >
            <Bed size={14} className="text-blue-400" />
          </motion.div>
        ))}
      </motion.div>
    </WizardLayout>
  );
};

