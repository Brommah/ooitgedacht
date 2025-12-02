import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Clock } from 'lucide-react';
import { WizardLayout } from '../WizardLayout';
import { Timeline } from '../../../types';
import { useTranslation } from '../../../i18n';

interface WizardStepTimelineProps {
  initialValue: Timeline;
  onNext: (value: Timeline) => void;
  onBack: () => void;
}

const TIMELINE_ICONS: Record<string, string> = {
  'asap': '🚀',
  'within_year': '📅',
  '1-2_years': '🗓️',
  'flexible': '🌊',
};

/**
 * Step 4: Timeline selection
 */
export const WizardStepTimeline: React.FC<WizardStepTimelineProps> = ({
  initialValue,
  onNext,
  onBack,
}) => {
  const [selected, setSelected] = useState<Timeline>(initialValue);
  const { t, tObj } = useTranslation();
  
  // Get translated timeline options
  const timelineOptions = tObj<Array<{ value: string; label: string; description: string }>>('options.timeline');

  const handleNext = () => {
    onNext(selected);
  };

  return (
    <WizardLayout
      step={4}
      title={t('wizard.step4.title')}
      subtitle={t('wizard.step4.subtitle')}
      icon={<Clock size={22} />}
      onBack={onBack}
      onNext={handleNext}
    >
      <div className="space-y-3">
        {timelineOptions.map((option, index) => {
          const isSelected = selected === option.value;
          
          return (
            <motion.button
              key={option.value}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelected(option.value as Timeline)}
              className={`w-full p-4 rounded-2xl text-left transition-all flex items-center gap-4 ${
                isSelected
                  ? 'bg-blue-500 text-white ring-2 ring-blue-400 ring-offset-2 ring-offset-[#0a1628]'
                  : 'bg-white/5 hover:bg-white/10 border border-white/10'
              }`}
            >
              <div className="text-2xl">{TIMELINE_ICONS[option.value] || '📅'}</div>
              
              <div className="flex-1">
                <div className={`font-medium ${isSelected ? 'text-white' : 'text-white/90'}`}>
                  {option.label}
                </div>
                <div className={`text-sm ${isSelected ? 'text-white/70' : 'text-white/40'}`}>
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
            </motion.button>
          );
        })}
      </div>
    </WizardLayout>
  );
};

