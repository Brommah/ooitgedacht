import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { AppState, UserPreferences, createDefaultPreferences, SizeCategory } from '../types';
import { SIZE_OPTIONS } from '../constants';
import { useTranslation } from '../i18n';

const STORAGE_KEY = 'ooit-gedacht-wizard-progress';

interface WizardProgress {
  preferences: UserPreferences;
  currentStep: AppState;
  generatedImage: string | null;
  timestamp: number;
}

interface GenerationMessage {
  message: string;
  duration: number;
}

interface WizardContextType {
  // State
  preferences: UserPreferences;
  appState: AppState;
  generatedImage: string | null;
  generationStep: number;
  generationMessage: string;
  generationError: string | null;
  isGenerating: boolean;
  
  // Actions
  setPreferences: React.Dispatch<React.SetStateAction<UserPreferences>>;
  setAppState: (state: AppState) => void;
  setGeneratedImage: (image: string | null) => void;
  setGenerationStep: (step: number) => void;
  setGenerationMessage: (message: string) => void;
  setGenerationError: (error: string | null) => void;
  
  // Wizard navigation helpers
  goToStep: (step: AppState) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  resetWizard: () => void;
  clearProgress: () => void;
  
  // Utilities
  getSqmFromSize: (size: SizeCategory) => number;
  getGenerationMessages: () => GenerationMessage[];
  
  // Step sequence
  wizardSteps: AppState[];
  currentStepIndex: number;
  totalSteps: number;
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

/**
 * Load saved wizard progress from localStorage
 * Only restore if saved within last 24 hours
 */
const loadSavedProgress = (): WizardProgress | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    
    const progress: WizardProgress = JSON.parse(saved);
    const hoursSinceSave = (Date.now() - progress.timestamp) / (1000 * 60 * 60);
    
    // Only restore if less than 24 hours old
    if (hoursSinceSave > 24) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    
    return progress;
  } catch {
    return null;
  }
};

/**
 * Save wizard progress to localStorage
 */
const saveProgressToStorage = (preferences: UserPreferences, currentStep: AppState, generatedImage: string | null): void => {
  try {
    const progress: WizardProgress = {
      preferences,
      currentStep,
      generatedImage,
      timestamp: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Silently fail if localStorage is unavailable
  }
};

/**
 * Clear saved wizard progress
 */
const clearProgressFromStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Silently fail
  }
};

/**
 * Get sqm from size category
 */
const getSqmFromSize = (size: SizeCategory): number => {
  const opt = SIZE_OPTIONS.find((o) => o.value === size);
  return opt ? Math.round((opt.sqmMin + opt.sqmMax) / 2) : 150;
};

/**
 * Wizard step sequence
 */
const WIZARD_STEPS: AppState[] = [
  AppState.WIZARD_STEP_TYPE,
  AppState.WIZARD_STEP_BEDROOMS,
  AppState.WIZARD_STEP_BUDGET,
  AppState.WIZARD_STEP_TIMELINE,
  AppState.WIZARD_STEP_LOCATION,
  AppState.WIZARD_STEP_STYLE,
  AppState.WIZARD_STEP_SIZE,
  AppState.WIZARD_STEP_MATERIAL,
  AppState.WIZARD_STEP_ENERGY,
  AppState.WIZARD_STEP_EXTRAS_ENERGY,
  AppState.WIZARD_STEP_EXTRAS_OUTDOOR,
  AppState.WIZARD_STEP_EXTRAS_COMFORT,
  AppState.WIZARD_STEP_VIBE,
];

interface WizardProviderProps {
  children: ReactNode;
  initialState?: AppState;
  onStateChange?: (state: AppState) => void;
}

export const WizardProvider: React.FC<WizardProviderProps> = ({ 
  children, 
  initialState = AppState.WIZARD_STEP_TYPE,
  onStateChange 
}) => {
  const { tObj } = useTranslation();
  
  // Load saved progress
  const savedProgress = loadSavedProgress();
  
  // State
  const [preferences, setPreferences] = useState<UserPreferences>(
    savedProgress?.preferences ?? createDefaultPreferences()
  );
  const [appState, setAppStateInternal] = useState<AppState>(
    savedProgress?.currentStep ?? initialState
  );
  const [generatedImage, setGeneratedImage] = useState<string | null>(
    savedProgress?.generatedImage ?? null
  );
  const [generationStep, setGenerationStep] = useState(0);
  const [generationMessage, setGenerationMessage] = useState('');
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Get generation messages from translations
  const getGenerationMessages = useCallback((): GenerationMessage[] => {
    const messages = tObj<string[]>('generationMessages');
    const durations = [1500, 2000, 2000, 1500, 2000, 2500, 1500, 1500, 1000];
    return messages.map((message, i) => ({
      message,
      duration: durations[i] ?? 1500
    }));
  }, [tObj]);

  // Set app state with callback
  const setAppState = useCallback((state: AppState) => {
    setAppStateInternal(state);
    onStateChange?.(state);
  }, [onStateChange]);

  // Navigate to specific step
  const goToStep = useCallback((step: AppState) => {
    setAppState(step);
  }, [setAppState]);

  // Navigate to next step
  const goToNextStep = useCallback(() => {
    const currentIndex = WIZARD_STEPS.indexOf(appState);
    if (currentIndex >= 0 && currentIndex < WIZARD_STEPS.length - 1) {
      const nextStep = WIZARD_STEPS[currentIndex + 1];
      if (nextStep) {
        setAppState(nextStep);
      }
    } else if (currentIndex === WIZARD_STEPS.length - 1) {
      // Last step - go to generating
      setAppState(AppState.GENERATING);
    }
  }, [appState, setAppState]);

  // Navigate to previous step
  const goToPreviousStep = useCallback(() => {
    const currentIndex = WIZARD_STEPS.indexOf(appState);
    if (currentIndex > 0) {
      const prevStep = WIZARD_STEPS[currentIndex - 1];
      if (prevStep) {
        setAppState(prevStep);
      }
    } else if (currentIndex === 0) {
      // First step - go back to landing
      setAppState(AppState.LANDING);
    }
  }, [appState, setAppState]);

  // Reset wizard to beginning
  const resetWizard = useCallback(() => {
    setPreferences(createDefaultPreferences());
    setGeneratedImage(null);
    setGenerationStep(0);
    setGenerationMessage('');
    setGenerationError(null);
    setAppState(AppState.WIZARD_STEP_TYPE);
    clearProgressFromStorage();
  }, [setAppState]);

  // Clear progress
  const clearProgress = useCallback(() => {
    clearProgressFromStorage();
  }, []);

  // Persist progress whenever preferences or step changes
  useEffect(() => {
    if (WIZARD_STEPS.includes(appState)) {
      saveProgressToStorage(preferences, appState, generatedImage);
    }
  }, [preferences, appState, generatedImage]);

  // Clear progress when user completes the wizard successfully
  useEffect(() => {
    if (appState === AppState.RESULTS_UNLOCKED || appState === AppState.DASHBOARD) {
      clearProgressFromStorage();
    }
  }, [appState]);

  // Calculate current step index
  const currentStepIndex = WIZARD_STEPS.indexOf(appState);
  const isGenerating = appState === AppState.GENERATING;

  const value: WizardContextType = {
    // State
    preferences,
    appState,
    generatedImage,
    generationStep,
    generationMessage,
    generationError,
    isGenerating,
    
    // Actions
    setPreferences,
    setAppState,
    setGeneratedImage,
    setGenerationStep,
    setGenerationMessage,
    setGenerationError,
    
    // Navigation helpers
    goToStep,
    goToNextStep,
    goToPreviousStep,
    resetWizard,
    clearProgress,
    
    // Utilities
    getSqmFromSize,
    getGenerationMessages,
    
    // Step info
    wizardSteps: WIZARD_STEPS,
    currentStepIndex: currentStepIndex >= 0 ? currentStepIndex : 0,
    totalSteps: WIZARD_STEPS.length,
  };

  return (
    <WizardContext.Provider value={value}>
      {children}
    </WizardContext.Provider>
  );
};

/**
 * Hook to access wizard context
 */
export const useWizard = (): WizardContextType => {
  const context = useContext(WizardContext);
  if (context === undefined) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
};

/**
 * Hook to check if we're in wizard context (optional usage)
 */
export const useWizardOptional = (): WizardContextType | undefined => {
  return useContext(WizardContext);
};




