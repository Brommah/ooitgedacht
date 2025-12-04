import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { translations, TranslationKeys } from './translations';

export type Language = 'nl' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  /**
   * Get a nested translation object (for arrays of options, etc.)
   */
  tObj: <T>(key: string) => T;
}

const STORAGE_KEY = 'ooit-gedacht-language';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/**
 * Get a nested value from an object using dot notation
 */
const getNestedValue = (obj: Record<string, unknown>, path: string): unknown => {
  return path.split('.').reduce((acc: unknown, part: string) => {
    if (acc && typeof acc === 'object' && part in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, obj);
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Try to load from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'nl' || saved === 'en') {
        return saved;
      }
    }
    return 'nl'; // Default to Dutch
  });

  // Persist language preference
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  /**
   * Translate a key to the current language
   * Supports dot notation: t('wizard.step1.title')
   */
  const t = useCallback((key: string): string => {
    const value = getNestedValue(translations[language] as unknown as Record<string, unknown>, key);
    if (typeof value === 'string') {
      return value;
    }
    // Fallback to Dutch if English translation missing
    if (language === 'en') {
      const nlValue = getNestedValue(translations.nl as unknown as Record<string, unknown>, key);
      if (typeof nlValue === 'string') {
        return nlValue;
      }
    }
    // Return the key itself as fallback (helps debug missing translations)
    console.warn(`Missing translation for key: ${key}`);
    return key;
  }, [language]);

  /**
   * Get a translation object (for arrays, nested objects, etc.)
   */
  const tObj = useCallback(<T,>(key: string): T => {
    const value = getNestedValue(translations[language] as unknown as Record<string, unknown>, key);
    if (value !== undefined) {
      return value as T;
    }
    // Fallback to Dutch
    if (language === 'en') {
      const nlValue = getNestedValue(translations.nl as unknown as Record<string, unknown>, key);
      if (nlValue !== undefined) {
        return nlValue as T;
      }
    }
    console.warn(`Missing translation object for key: ${key}`);
    return {} as T;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tObj }}>
      {children}
    </LanguageContext.Provider>
  );
};

/**
 * Hook to access translation functions and language state
 */
export const useTranslation = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};

export type { TranslationKeys };





