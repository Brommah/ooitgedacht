import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles, Palette } from 'lucide-react';
import { WizardLayout } from '../WizardLayout';
import { MOOD_IMAGES } from '../../../constants';
import { useTranslation } from '../../../i18n';

interface WizardStepStyleProps {
  initialValue: string[];
  onNext: (value: string[]) => void;
  onBack: () => void;
}

/**
 * Step 6: Style/mood selection with image grid
 */
export const WizardStepStyle: React.FC<WizardStepStyleProps> = ({
  initialValue,
  onNext,
  onBack,
}) => {
  const [selectedStyles, setSelectedStyles] = useState<string[]>(initialValue);
  const { t, tObj, language } = useTranslation();
  
  // Get translated mood tags
  const moodTags = tObj<Record<string, { tag: string; description: string }>>('moodTags');

  const toggleStyle = (tag: string) => {
    setSelectedStyles((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  const handleNext = () => {
    if (selectedStyles.length > 0) {
      onNext(selectedStyles);
    }
  };

  const canProceed = selectedStyles.length > 0;
  const nextText = language === 'nl' ? 'Verder' : 'Next';

  return (
    <WizardLayout
      step={6}
      title={t('wizard.step6.title')}
      subtitle={t('wizard.step6.subtitle')}
      icon={<Palette size={22} />}
      onBack={onBack}
      onNext={handleNext}
      nextLabel={`${nextText} ${selectedStyles.length > 0 ? `(${selectedStyles.length})` : ''}`}
      nextDisabled={!canProceed}
    >
      {/* Style Grid */}
      <div className="grid grid-cols-2 gap-3">
        {MOOD_IMAGES.map((image, index) => {
          const isSelected = selectedStyles.includes(image.tag);
          
          return (
            <motion.button
              key={image.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.04 }}
              onClick={() => toggleStyle(image.tag)}
              className={`relative aspect-[4/5] rounded-2xl overflow-hidden group transition-all ${
                isSelected
                  ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-[#0a1628]'
                  : 'hover:ring-1 hover:ring-white/20'
              }`}
            >
              {/* Image */}
              <img
                src={image.src}
                alt={image.tag}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Gradient overlay */}
              <div className={`absolute inset-0 transition-all duration-300 ${
                isSelected
                  ? 'bg-gradient-to-t from-blue-900/90 via-blue-900/40 to-blue-500/20'
                  : 'bg-gradient-to-t from-[#0a1628]/90 via-[#0a1628]/30 to-transparent'
              }`} />

              {/* Selection indicator */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-blue-400 flex items-center justify-center"
                  >
                    <Check size={14} className="text-[#0a1628]" strokeWidth={3} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <motion.div animate={{ y: isSelected ? -2 : 0 }}>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    {isSelected && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        <Sparkles size={12} className="text-blue-400" />
                      </motion.div>
                    )}
                    <h3 className={`font-medium text-sm ${isSelected ? 'text-blue-100' : 'text-white'}`}>
                      {image.tag}
                    </h3>
                  </div>
                  
                  {isSelected && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-white/60 line-clamp-2"
                    >
                      {image.description}
                    </motion.p>
                  )}
                </motion.div>
              </div>

              {/* Border */}
              <div className={`absolute inset-0 rounded-2xl border-2 transition-colors pointer-events-none ${
                isSelected ? 'border-blue-400' : 'border-transparent'
              }`} />
            </motion.button>
          );
        })}
      </div>
    </WizardLayout>
  );
};

