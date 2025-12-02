import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { WizardProgress } from './WizardProgress';
import { LanguageToggle } from '../LanguageToggle';
import { useTranslation } from '../../i18n';

interface WizardLayoutProps {
  /** Current step number (1-13) */
  step: number;
  /** Main title for the step */
  title: string;
  /** Optional subtitle/description */
  subtitle?: string;
  /** Child content */
  children: ReactNode;
  /** Handler for back button */
  onBack?: () => void;
  /** Handler for continue button */
  onNext: () => void;
  /** Text for the continue button */
  nextLabel?: string;
  /** Whether the next button should be disabled */
  nextDisabled?: boolean;
  /** Whether to show the next button */
  showNext?: boolean;
  /** Optional icon for the title */
  icon?: ReactNode;
}

/**
 * Shared layout wrapper for all wizard steps.
 * Provides consistent header, progress bar, and navigation.
 */
export const WizardLayout: React.FC<WizardLayoutProps> = ({
  step,
  title,
  subtitle,
  children,
  onBack,
  onNext,
  nextLabel,
  nextDisabled = false,
  showNext = true,
  icon,
}) => {
  const { t } = useTranslation();
  const buttonLabel = nextLabel || t('common.next');
  
  return (
    <div className="min-h-screen bg-[#0a1628] text-white flex flex-col overflow-hidden">
      {/* Blueprint Grid Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a1628]/80 to-[#0a1628]" />
      </div>

      {/* Header with Progress */}
      <header className="relative z-50 bg-[#0a1628]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-lg mx-auto px-5 pt-4 pb-3">
          {/* Top row: back button + logo + language toggle */}
          <div className="flex items-center justify-between mb-4">
            {onBack ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBack}
                className="p-2 -ml-2 rounded-xl hover:bg-white/5 text-white/40 hover:text-white/70 transition-colors"
              >
                <ArrowLeft size={20} />
              </motion.button>
            ) : (
              <div className="w-9" />
            )}
            
            <img 
              src="/generated/og-logo.png" 
              alt="OoitGedacht" 
              className="h-5 opacity-30 brightness-0 invert" 
            />
            
            <LanguageToggle variant="minimal" />
          </div>

          {/* Progress bar */}
          <WizardProgress currentStep={step} totalSteps={13} />
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col max-w-lg mx-auto px-5 w-full pt-8 pb-32">
        <div className="flex-1 flex flex-col">
          {/* Title Section */}
          <div className="mb-8">
            {icon && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4 text-blue-400"
              >
                {icon}
              </motion.div>
            )}
            
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="text-2xl sm:text-3xl font-medium tracking-tight text-white"
            >
              {title}
            </motion.h1>
            
            {subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-white/40 mt-2 text-base"
              >
                {subtitle}
              </motion.p>
            )}
          </div>

          {/* Step Content */}
          <div className="flex-1">
            {children}
          </div>
        </div>
      </main>

      {/* Fixed Bottom CTA */}
      {showNext && (
        <div className="fixed bottom-0 inset-x-0 z-50 p-4 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/95 to-transparent pointer-events-none">
          <div className="max-w-lg mx-auto pointer-events-auto">
            <motion.button
              whileHover={!nextDisabled ? { scale: 1.01 } : {}}
              whileTap={!nextDisabled ? { scale: 0.99 } : {}}
              onClick={onNext}
              disabled={nextDisabled}
              className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-semibold text-base transition-all ${
                nextDisabled
                  ? 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
                  : 'bg-blue-500 hover:bg-blue-400 text-white shadow-lg shadow-blue-500/25'
              }`}
            >
              <span>{buttonLabel}</span>
              {!nextDisabled && <ArrowRight size={18} />}
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
};

