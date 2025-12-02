import React from 'react';
import { motion } from 'framer-motion';

/** Step labels for the wizard progress indicator */
export const WIZARD_STEP_LABELS: Record<number, string> = {
  1: 'Type',
  2: 'Slaapkamers',
  3: 'Budget',
  4: 'Planning',
  5: 'Locatie',
  6: 'Stijl',
  7: 'Omvang',
  8: 'Materiaal',
  9: 'Energie',
  10: "Extra's",
  11: "Extra's",
  12: "Extra's",
  13: 'Sfeer',
};

interface WizardProgressProps {
  currentStep: number;
  totalSteps?: number;
}

/**
 * Segmented progress bar for the wizard flow.
 * Shows all steps as segments with current step highlighted.
 */
export const WizardProgress: React.FC<WizardProgressProps> = ({ 
  currentStep, 
  totalSteps = 13 
}) => {
  const progress = (currentStep / totalSteps) * 100;
  const label = WIZARD_STEP_LABELS[currentStep] || '';

  return (
    <div className="w-full">
      {/* Progress bar container */}
      <div className="relative h-1 bg-white/10 rounded-full overflow-hidden">
        {/* Animated fill */}
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
        
        {/* Step markers */}
        <div className="absolute inset-0 flex justify-between px-0">
          {Array.from({ length: totalSteps }, (_, i) => {
            const stepNum = i + 1;
            const isCompleted = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;
            
            return (
              <div
                key={stepNum}
                className="relative flex items-center justify-center"
                style={{ width: `${100 / totalSteps}%` }}
              >
                {/* Dot marker for key steps */}
                {(stepNum === 1 || stepNum === 6 || stepNum === 10 || stepNum === 13) && (
                  <motion.div
                    className={`absolute w-2 h-2 rounded-full transition-colors duration-300 ${
                      isCompleted || isCurrent
                        ? 'bg-blue-400'
                        : 'bg-white/20'
                    }`}
                    initial={{ scale: 0 }}
                    animate={{ scale: isCurrent ? 1.3 : 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step indicator text */}
      <div className="flex items-center justify-between mt-3">
        <motion.span
          key={currentStep}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs font-mono text-blue-400/80 uppercase tracking-wider"
        >
          {label}
        </motion.span>
        <span className="text-xs font-mono text-white/30">
          {currentStep}/{totalSteps}
        </span>
      </div>
    </div>
  );
};

