import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sofa } from 'lucide-react';
import { WizardLayout } from '../WizardLayout';
import { ExtraFeature } from '../../../types';
import { EXTRA_OPTIONS, CURRENCY_SYMBOL } from '../../../constants';
import { useTranslation } from '../../../i18n';

interface WizardStepExtrasComfortProps {
  initialValue: ExtraFeature[];
  onNext: (value: ExtraFeature[]) => void;
  onBack: () => void;
}

// Comfort-related extras
const COMFORT_EXTRAS: ExtraFeature[] = ['office', 'sauna'];

/**
 * Step 12: Comfort extras selection
 */
export const WizardStepExtrasComfort: React.FC<WizardStepExtrasComfortProps> = ({
  initialValue,
  onNext,
  onBack,
}) => {
  const [selected, setSelected] = useState<ExtraFeature[]>(
    initialValue.filter((e) => COMFORT_EXTRAS.includes(e))
  );
  const { t, tObj, language } = useTranslation();
  
  // Get translated extra options
  const extrasTranslations = tObj<Array<{ value: string; label: string; description: string }>>('options.extras');

  const toggleExtra = (extra: ExtraFeature) => {
    setSelected((prev) =>
      prev.includes(extra)
        ? prev.filter((e) => e !== extra)
        : [...prev, extra]
    );
  };

  const handleNext = () => {
    // Merge with non-comfort extras from initialValue
    const nonComfortExtras = initialValue.filter((e) => !COMFORT_EXTRAS.includes(e));
    onNext([...nonComfortExtras, ...selected]);
  };

  // Merge translations with constants
  const comfortOptions = EXTRA_OPTIONS.filter((opt) =>
    COMFORT_EXTRAS.includes(opt.value)
  ).map(opt => {
    const translated = extrasTranslations.find(e => e.value === opt.value);
    return {
      ...opt,
      label: translated?.label || opt.label,
      description: translated?.description || opt.description,
    };
  });

  const nextText = language === 'nl' ? 'Verder' : 'Next';
  const skipText = language === 'nl' ? 'Overslaan' : 'Skip';

  return (
    <WizardLayout
      step={12}
      title={t('wizard.step12.title')}
      subtitle={t('wizard.step12.subtitle')}
      icon={<Sofa size={22} />}
      onBack={onBack}
      onNext={handleNext}
      nextLabel={selected.length > 0 ? `${nextText} (${selected.length})` : skipText}
    >
      <div className="space-y-3">
        {comfortOptions.map((option, index) => {
          const isSelected = selected.includes(option.value);
          
          return (
            <motion.button
              key={option.value}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => toggleExtra(option.value)}
              className={`w-full p-5 rounded-2xl text-left transition-all flex items-center gap-4 ${
                isSelected
                  ? 'bg-blue-500/20 border-2 border-blue-400'
                  : 'bg-white/5 hover:bg-white/10 border border-white/10'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                isSelected ? 'bg-blue-500/30' : 'bg-white/5'
              }`}>
                {option.icon}
              </div>
              
              <div className="flex-1">
                <div className={`font-medium ${isSelected ? 'text-blue-100' : 'text-white/90'}`}>
                  {option.label}
                </div>
                <div className={`text-sm ${isSelected ? 'text-blue-200/60' : 'text-white/40'}`}>
                  {option.description}
                </div>
              </div>
              
              <div className="text-right">
                <div className={`text-sm font-mono ${isSelected ? 'text-blue-300' : 'text-white/40'}`}>
                  +{CURRENCY_SYMBOL}{(option.cost / 1000).toFixed(0)}k
                </div>
              </div>
              
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                isSelected ? 'border-blue-400 bg-blue-400' : 'border-white/20'
              }`}>
                {isSelected && <Check size={14} className="text-[#0a1628]" strokeWidth={3} />}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Info text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 text-center text-sm text-white/30"
      >
        {language === 'nl' ? 'Bijna klaar! Nog één stap...' : 'Almost done! One more step...'}
      </motion.div>
    </WizardLayout>
  );
};

