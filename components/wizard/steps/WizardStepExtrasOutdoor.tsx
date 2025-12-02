import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Trees } from 'lucide-react';
import { WizardLayout } from '../WizardLayout';
import { ExtraFeature } from '../../../types';
import { EXTRA_OPTIONS, CURRENCY_SYMBOL } from '../../../constants';
import { useTranslation } from '../../../i18n';

interface WizardStepExtrasOutdoorProps {
  initialValue: ExtraFeature[];
  onNext: (value: ExtraFeature[]) => void;
  onBack: () => void;
}

// Outdoor-related extras
const OUTDOOR_EXTRAS: ExtraFeature[] = ['garage', 'carport', 'sedum_roof', 'rainwater', 'outdoor_kitchen', 'pool'];

/**
 * Step 11: Outdoor extras selection
 */
export const WizardStepExtrasOutdoor: React.FC<WizardStepExtrasOutdoorProps> = ({
  initialValue,
  onNext,
  onBack,
}) => {
  const [selected, setSelected] = useState<ExtraFeature[]>(
    initialValue.filter((e) => OUTDOOR_EXTRAS.includes(e))
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
    // Merge with non-outdoor extras from initialValue
    const nonOutdoorExtras = initialValue.filter((e) => !OUTDOOR_EXTRAS.includes(e));
    onNext([...nonOutdoorExtras, ...selected]);
  };

  // Merge translations with constants
  const outdoorOptions = EXTRA_OPTIONS.filter((opt) =>
    OUTDOOR_EXTRAS.includes(opt.value)
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
      step={11}
      title={t('wizard.step11.title')}
      subtitle={t('wizard.step11.subtitle')}
      icon={<Trees size={22} />}
      onBack={onBack}
      onNext={handleNext}
      nextLabel={selected.length > 0 ? `${nextText} (${selected.length})` : skipText}
    >
      <div className="grid grid-cols-2 gap-3">
        {outdoorOptions.map((option, index) => {
          const isSelected = selected.includes(option.value);
          
          return (
            <motion.button
              key={option.value}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.04 }}
              onClick={() => toggleExtra(option.value)}
              className={`relative p-4 rounded-2xl text-left transition-all ${
                isSelected
                  ? 'bg-blue-500/20 border-2 border-blue-400'
                  : 'bg-white/5 hover:bg-white/10 border border-white/10'
              }`}
            >
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-400 flex items-center justify-center"
                >
                  <Check size={10} className="text-[#0a1628]" strokeWidth={3} />
                </motion.div>
              )}
              
              <div className="text-2xl mb-2">{option.icon}</div>
              <div className={`font-medium text-sm ${isSelected ? 'text-blue-100' : 'text-white/90'}`}>
                {option.label}
              </div>
              <div className={`text-xs mt-1 font-mono ${isSelected ? 'text-blue-300' : 'text-white/40'}`}>
                +{CURRENCY_SYMBOL}{(option.cost / 1000).toFixed(0)}k
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Total indicator */}
      {selected.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl"
        >
          <div className="flex justify-between items-center">
            <span className="text-sm text-blue-200/60">{language === 'nl' ? 'Extra kosten buiten' : 'Outdoor extras cost'}</span>
            <span className="font-mono text-blue-100">
              +{CURRENCY_SYMBOL}
              {outdoorOptions
                .filter((opt) => selected.includes(opt.value))
                .reduce((sum, opt) => sum + opt.cost, 0)
                .toLocaleString('nl-NL')}
            </span>
          </div>
        </motion.div>
      )}
    </WizardLayout>
  );
};

