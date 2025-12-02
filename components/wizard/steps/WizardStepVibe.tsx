import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Sun, Flame } from 'lucide-react';
import { WizardLayout } from '../WizardLayout';
import { useTranslation, getVibeLabel } from '../../../i18n';

interface WizardStepVibeProps {
  initialValue: number;
  onNext: (value: number) => void;
  onBack: () => void;
}

/**
 * Step 13: Vibe/atmosphere slider - final step
 */
export const WizardStepVibe: React.FC<WizardStepVibeProps> = ({
  initialValue,
  onNext,
  onBack,
}) => {
  const [vibe, setVibe] = useState<number>(initialValue);
  const { t, language } = useTranslation();

  const handleNext = () => {
    onNext(vibe);
  };

  const vibeLabel = getVibeLabel(vibe, language);
  const generateLabel = language === 'nl' ? 'Genereer mijn droomhuis' : 'Generate my dream home';

  return (
    <WizardLayout
      step={13}
      title={t('wizard.step13.title')}
      subtitle={t('wizard.step13.subtitle')}
      icon={<Sparkles size={22} />}
      onBack={onBack}
      onNext={handleNext}
      nextLabel={generateLabel}
    >
      {/* Vibe Label */}
      <motion.div
        key={vibeLabel}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="text-2xl font-medium text-white">{vibeLabel}</div>
      </motion.div>

      {/* Visual indicator */}
      <div className="flex justify-center gap-8 mb-8">
        <motion.div
          animate={{ 
            opacity: vibe < 50 ? 1 : 0.3,
            scale: vibe < 30 ? 1.1 : 1
          }}
          className="text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-2">
            <Sun size={28} className="text-blue-400" />
          </div>
          <span className="text-xs text-white/40">{t('wizard.step13.modern')}</span>
        </motion.div>
        
        <motion.div
          animate={{ 
            opacity: vibe > 50 ? 1 : 0.3,
            scale: vibe > 70 ? 1.1 : 1
          }}
          className="text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-2">
            <Flame size={28} className="text-amber-400" />
          </div>
          <span className="text-xs text-white/40">{t('wizard.step13.cozy')}</span>
        </motion.div>
      </div>

      {/* Slider */}
      <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
        <div className="relative h-12 flex items-center">
          {/* Track gradient */}
          <div className="absolute inset-x-0 h-3 rounded-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-white/20 to-amber-500" />
          </div>
          
          {/* Range input */}
          <input
            type="range"
            min={0}
            max={100}
            value={vibe}
            onChange={(e) => setVibe(Number(e.target.value))}
            className="absolute inset-x-0 w-full h-12 opacity-0 cursor-pointer"
          />
          
          {/* Thumb */}
          <motion.div
            className="absolute w-7 h-7 bg-white rounded-full shadow-lg border-2 border-white/50"
            style={{ left: `calc(${vibe}% - 14px)` }}
            layout
          />
        </div>

        {/* Scale labels */}
        <div className="flex justify-between mt-4 text-xs text-white/30 font-mono uppercase">
          <span>{language === 'nl' ? 'Minimalistisch' : 'Minimalist'}</span>
          <span>{language === 'nl' ? 'Gebalanceerd' : 'Balanced'}</span>
          <span>{language === 'nl' ? 'Landelijk' : 'Rustic'}</span>
        </div>
      </div>

      {/* Celebration for final step */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 p-4 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border border-blue-500/20 rounded-xl text-center"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles size={16} className="text-blue-400" />
          <span className="text-sm font-medium text-blue-100">
            {language === 'nl' ? 'Laatste stap!' : 'Final step!'}
          </span>
          <Sparkles size={16} className="text-emerald-400" />
        </div>
        <p className="text-xs text-white/40">
          {language === 'nl' 
            ? 'Na deze stap genereren we je gepersonaliseerde droomhuis' 
            : 'After this step we will generate your personalized dream home'}
        </p>
      </motion.div>
    </WizardLayout>
  );
};

