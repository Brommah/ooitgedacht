import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Battery } from 'lucide-react';
import { WizardLayout } from '../WizardLayout';
import { ExtraFeature } from '../../../types';
import { EXTRA_OPTIONS, CURRENCY_SYMBOL } from '../../../constants';
import { useTranslation } from '../../../i18n';

interface WizardStepExtrasEnergyProps {
  initialValue: ExtraFeature[];
  onNext: (value: ExtraFeature[]) => void;
  onBack: () => void;
}

// Energy-related extras
const ENERGY_EXTRAS: ExtraFeature[] = ['solar', 'heat_pump', 'battery_storage', 'ev_charger'];

/**
 * Step 10: Energy extras selection
 */
export const WizardStepExtrasEnergy: React.FC<WizardStepExtrasEnergyProps> = ({
  initialValue,
  onNext,
  onBack,
}) => {
  const [selected, setSelected] = useState<ExtraFeature[]>(
    initialValue.filter((e) => ENERGY_EXTRAS.includes(e))
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
    // Merge with non-energy extras from initialValue
    const nonEnergyExtras = initialValue.filter((e) => !ENERGY_EXTRAS.includes(e));
    onNext([...nonEnergyExtras, ...selected]);
  };

  // Merge translations with constants
  const energyOptions = EXTRA_OPTIONS.filter((opt) =>
    ENERGY_EXTRAS.includes(opt.value)
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
      step={10}
      title={t('wizard.step10.title')}
      subtitle={t('wizard.step10.subtitle')}
      icon={<Battery size={22} />}
      onBack={onBack}
      onNext={handleNext}
      nextLabel={selected.length > 0 ? `${nextText} (${selected.length})` : skipText}
    >
      <div className="space-y-3">
        {energyOptions.map((option, index) => {
          const isSelected = selected.includes(option.value);
          
          return (
            <motion.button
              key={option.value}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => toggleExtra(option.value)}
              className={`w-full p-4 rounded-2xl text-left transition-all flex items-center gap-4 ${
                isSelected
                  ? 'bg-blue-500/20 border-2 border-blue-400'
                  : 'bg-white/5 hover:bg-white/10 border border-white/10'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${
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
              
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                isSelected ? 'border-blue-400 bg-blue-400' : 'border-white/20'
              }`}>
                {isSelected && <Check size={12} className="text-[#0a1628]" strokeWidth={3} />}
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
            <span className="text-sm text-blue-200/60">{language === 'nl' ? 'Extra kosten energie' : 'Energy extras cost'}</span>
            <span className="font-mono text-blue-100">
              +{CURRENCY_SYMBOL}
              {energyOptions
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

