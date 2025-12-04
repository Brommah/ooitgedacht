/**
 * Translations Index
 * Combines all per-feature translation modules for backward compatibility
 */

// Import Dutch translations
import {
  navNl,
  commonNl,
  vibeLabelsNl,
  generationMessagesNl,
  errorsNl,
  wizardNl,
  optionsNl,
  resultsNl,
  dashboardNl,
  phasesNl,
} from './nl';

// Import English translations
import {
  navEn,
  commonEn,
  vibeLabelsEn,
  generationMessagesEn,
  errorsEn,
  wizardEn,
  optionsEn,
  resultsEn,
  dashboardEn,
  phasesEn,
} from './en';

// Re-export types
export * from './types';

// Re-export per-language modules for direct imports
export * from './nl';
export * from './en';

/**
 * Combined translations object
 * Maintains backward compatibility with existing code
 */
export const translationsModular = {
  nl: {
    nav: navNl,
    common: commonNl,
    vibeLabels: vibeLabelsNl,
    generationMessages: generationMessagesNl,
    errors: errorsNl,
    wizard: wizardNl,
    options: optionsNl,
    results: resultsNl,
    dashboard: dashboardNl,
    phases: phasesNl,
  },
  en: {
    nav: navEn,
    common: commonEn,
    vibeLabels: vibeLabelsEn,
    generationMessages: generationMessagesEn,
    errors: errorsEn,
    wizard: wizardEn,
    options: optionsEn,
    results: resultsEn,
    dashboard: dashboardEn,
    phases: phasesEn,
  },
} as const;




