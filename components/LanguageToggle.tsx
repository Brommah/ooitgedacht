import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation, Language } from '../i18n';

interface LanguageToggleProps {
  /** Visual variant */
  variant?: 'default' | 'minimal' | 'pill';
  /** Custom class name */
  className?: string;
}

/**
 * Language toggle component for switching between Dutch (NL) and English (EN)
 */
export const LanguageToggle: React.FC<LanguageToggleProps> = ({ 
  variant = 'default',
  className = '' 
}) => {
  const { language, setLanguage } = useTranslation();

  const toggleLanguage = () => {
    setLanguage(language === 'nl' ? 'en' : 'nl');
  };

  // Pill variant - compact sliding toggle
  if (variant === 'pill') {
    return (
      <button
        onClick={toggleLanguage}
        className={`relative flex items-center gap-0.5 p-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-xs font-medium transition-colors hover:bg-white/10 ${className}`}
        aria-label={`Switch to ${language === 'nl' ? 'English' : 'Dutch'}`}
      >
        <span
          className={`px-2 py-1 rounded-full transition-all duration-200 ${
            language === 'nl' 
              ? 'bg-blue-500 text-white' 
              : 'text-white/50 hover:text-white/70'
          }`}
        >
          NL
        </span>
        <span
          className={`px-2 py-1 rounded-full transition-all duration-200 ${
            language === 'en' 
              ? 'bg-blue-500 text-white' 
              : 'text-white/50 hover:text-white/70'
          }`}
        >
          EN
        </span>
      </button>
    );
  }

  // Minimal variant - just text toggle
  if (variant === 'minimal') {
    return (
      <button
        onClick={toggleLanguage}
        className={`text-xs font-mono text-white/50 hover:text-white/80 transition-colors ${className}`}
        aria-label={`Switch to ${language === 'nl' ? 'English' : 'Dutch'}`}
      >
        <span className={language === 'nl' ? 'text-white' : 'text-white/40'}>NL</span>
        <span className="mx-1 text-white/20">/</span>
        <span className={language === 'en' ? 'text-white' : 'text-white/40'}>EN</span>
      </button>
    );
  }

  // Default variant - button with flag-like appearance
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={toggleLanguage}
      className={`flex items-center gap-2 px-3 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors ${className}`}
      aria-label={`Switch to ${language === 'nl' ? 'English' : 'Dutch'}`}
    >
      <span className="text-base">
        {language === 'nl' ? '🇳🇱' : '🇬🇧'}
      </span>
      <span className="font-mono text-xs">
        {language === 'nl' ? 'NL' : 'EN'}
      </span>
    </motion.button>
  );
};

export default LanguageToggle;





