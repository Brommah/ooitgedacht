import React, { useState, useEffect, useCallback } from 'react';
import { AppState, UserPreferences, createDefaultPreferences, HouseholdType, Timeline, SizeCategory, MaterialType, EnergyLevel, ExtraFeature } from '../types';
import { MOOD_IMAGES, SIZE_OPTIONS } from '../constants';
import { Results } from './Results';
import { Dashboard } from './Dashboard';
import { generateDreamHome } from '../services/geminiService';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Home, Palette, Layers, Sun, Trees, Zap, MapPin, Wallet, AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';
import { useTranslation } from '../i18n';

// Import new wizard step components
import {
  WizardStepType,
  WizardStepBedrooms,
  WizardStepBudget,
  WizardStepTimeline,
  WizardStepLocation,
  WizardStepStyle,
  WizardStepSize,
  WizardStepMaterial,
  WizardStepEnergy,
  WizardStepExtrasEnergy,
  WizardStepExtrasOutdoor,
  WizardStepExtrasComfort,
  WizardStepVibe,
} from './wizard/steps';

const STORAGE_KEY = 'ooit-gedacht-wizard-progress';

interface WizardProgress {
  preferences: UserPreferences;
  currentStep: AppState;
  timestamp: number;
}

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
const saveProgress = (preferences: UserPreferences, currentStep: AppState): void => {
  try {
    const progress: WizardProgress = {
      preferences,
      currentStep,
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
const clearProgress = (): void => {
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

interface WizardProps {
  appState: AppState;
  setAppState: (state: AppState) => void;
}

export const Wizard: React.FC<WizardProps> = ({ appState, setAppState }) => {
  // Load saved progress or create fresh defaults
  const savedProgress = loadSavedProgress();
  const { t, tObj, language } = useTranslation();
  
  // Get generation messages from translations
  const GENERATION_MESSAGES = tObj<string[]>('generationMessages').map((message, i) => ({
    message,
    duration: [1500, 2000, 2000, 1500, 2000, 2500, 1500, 1500, 1000][i] || 1500
  }));
  
  const [preferences, setPreferences] = useState<UserPreferences>(
    savedProgress?.preferences ?? createDefaultPreferences()
  );
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generationStep, setGenerationStep] = useState(0);
  const [generationMessage, setGenerationMessage] = useState('');
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Persist progress whenever preferences or step changes
  useEffect(() => {
    const wizardSteps = [
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
    
    if (wizardSteps.includes(appState)) {
      saveProgress(preferences, appState);
    }
  }, [preferences, appState]);

  // Save dashboard data and clear wizard progress when transitioning to dashboard
  useEffect(() => {
    if (appState === AppState.DASHBOARD && generatedImage) {
      // Save preferences and image for dashboard access
      try {
        localStorage.setItem('ooit-gedacht-dashboard-prefs', JSON.stringify(preferences));
        localStorage.setItem('ooit-gedacht-dashboard-image', generatedImage);
      } catch (e) {
        console.error('Failed to save dashboard data:', e);
      }
      // Clear wizard progress
      clearProgress();
    } else if (appState === AppState.RESULTS_UNLOCKED) {
      clearProgress();
    }
  }, [appState, preferences, generatedImage]);

  // =========================================
  // STEP HANDLERS
  // =========================================

  // Step 1: Type
  const handleTypeComplete = (type: HouseholdType) => {
    setPreferences((prev) => ({ ...prev, household: { ...prev.household, type } }));
    setAppState(AppState.WIZARD_STEP_BEDROOMS);
  };

  // Step 2: Bedrooms
  const handleBedroomsComplete = (bedrooms: number) => {
    setPreferences((prev) => ({ ...prev, household: { ...prev.household, bedrooms } }));
    setAppState(AppState.WIZARD_STEP_BUDGET);
  };

  // Step 3: Budget
  const handleBudgetComplete = (total: number) => {
    setPreferences((prev) => ({ ...prev, budget: { ...prev.budget, total } }));
    setAppState(AppState.WIZARD_STEP_TIMELINE);
  };

  // Step 4: Timeline
  const handleTimelineComplete = (timeline: Timeline) => {
    setPreferences((prev) => ({ ...prev, budget: { ...prev.budget, timeline } }));
    setAppState(AppState.WIZARD_STEP_LOCATION);
  };

  // Step 5: Location
  const handleLocationComplete = (searchQuery: string) => {
    setPreferences((prev) => ({
      ...prev,
      location: { ...prev.location, searchQuery },
    }));
    setAppState(AppState.WIZARD_STEP_STYLE);
  };

  // Step 6: Style (MoodBoard)
  const handleStyleComplete = (moodBoardSelections: string[]) => {
    // Infer roof style and material from selections
    const selectedImages = MOOD_IMAGES.filter((img) =>
      moodBoardSelections.includes(img.tag)
    );
    const roofStyles = selectedImages.map((img) => img.inferredRoof).filter(Boolean);
    const materials = selectedImages.map((img) => img.inferredMaterial).filter(Boolean);

    const inferredRoof = roofStyles[0] || 'pitched';
    const inferredMaterial = materials[0] || 'brick';

    setPreferences((prev) => ({
      ...prev,
      style: {
        moodBoardSelections,
        inferredRoofStyle: inferredRoof,
        inferredMaterialAffinity: inferredMaterial,
      },
      config: {
        ...prev.config,
        material: inferredMaterial,
      },
    }));
    setAppState(AppState.WIZARD_STEP_SIZE);
  };

  // Step 7: Size
  const handleSizeComplete = (size: SizeCategory) => {
    setPreferences((prev) => ({
      ...prev,
      config: { ...prev.config, size, sqm: getSqmFromSize(size) },
    }));
    setAppState(AppState.WIZARD_STEP_MATERIAL);
  };

  // Step 8: Material
  const handleMaterialComplete = (material: MaterialType) => {
    setPreferences((prev) => ({
      ...prev,
      config: { ...prev.config, material },
    }));
    setAppState(AppState.WIZARD_STEP_ENERGY);
  };

  // Step 9: Energy
  const handleEnergyComplete = (energyLevel: EnergyLevel) => {
    setPreferences((prev) => ({
      ...prev,
      config: { ...prev.config, energyLevel },
    }));
    setAppState(AppState.WIZARD_STEP_EXTRAS_ENERGY);
  };

  // Step 10: Extras Energy
  const handleExtrasEnergyComplete = (extras: ExtraFeature[]) => {
    setPreferences((prev) => ({
      ...prev,
      config: { ...prev.config, extras },
    }));
    setAppState(AppState.WIZARD_STEP_EXTRAS_OUTDOOR);
  };

  // Step 11: Extras Outdoor
  const handleExtrasOutdoorComplete = (extras: ExtraFeature[]) => {
    setPreferences((prev) => ({
      ...prev,
      config: { ...prev.config, extras },
    }));
    setAppState(AppState.WIZARD_STEP_EXTRAS_COMFORT);
  };

  // Step 12: Extras Comfort
  const handleExtrasComfortComplete = (extras: ExtraFeature[]) => {
    setPreferences((prev) => ({
      ...prev,
      config: { ...prev.config, extras },
    }));
    setAppState(AppState.WIZARD_STEP_VIBE);
  };

  // Step 13: Vibe (Final) -> Generate
  const handleVibeComplete = (vibe: number) => {
    setPreferences((prev) => ({
      ...prev,
      config: { ...prev.config, vibe },
    }));
    setAppState(AppState.GENERATING);
  };

  // Retry generation callback
  const retryGeneration = useCallback(() => {
    setGenerationError(null);
    setAppState(AppState.GENERATING);
  }, [setAppState]);

  // Go back from error state
  const goBackFromError = useCallback(() => {
    setGenerationError(null);
    setAppState(AppState.WIZARD_STEP_VIBE);
  }, [setAppState]);

  // Generation process
  useEffect(() => {
    if (appState === AppState.GENERATING) {
      setGenerationStep(0);
      setGenerationError(null);
      
      let isCancelled = false;
      
      const runGeneration = async () => {
        try {
          // Animate through generation messages
          for (let i = 0; i < GENERATION_MESSAGES.length; i++) {
            if (isCancelled) return;
            setGenerationStep(i);
            setGenerationMessage(GENERATION_MESSAGES[i].message);
            await new Promise((r) => setTimeout(r, GENERATION_MESSAGES[i].duration));
          }

          // Actually generate the image with all preferences
          const image = await generateDreamHome(preferences);
          
          if (isCancelled) return;
          
          // Check if we got a valid image (not just a fallback error)
          if (!image || image.includes('error') || image.length < 100) {
            throw new Error(language === 'nl' ? 'Generatie mislukt - probeer opnieuw' : 'Generation failed - please try again');
          }
          
          setGeneratedImage(image);
          
          // Small delay before showing results
          await new Promise((r) => setTimeout(r, 500));
          
          if (!isCancelled) {
            setAppState(AppState.RESULTS_LOCKED);
          }
        } catch (error) {
          if (isCancelled) return;
          
          console.error('Generation failed:', error);
          const errorMessage =
            error instanceof Error
              ? error.message
              : (language === 'nl' ? 'Er is iets misgegaan bij het genereren van je droomhuis' : 'Something went wrong while generating your dream home');
          setGenerationError(errorMessage);
        }
      };
      
      runGeneration();
      
      return () => {
        isCancelled = true;
      };
    }
    return undefined; // No cleanup needed when not generating
  }, [appState, preferences, setAppState]);

  // Dashboard view
  const debugFallbackImage = '/generated/result-preview.png';
  if (appState === AppState.DASHBOARD) {
    const displayImage = generatedImage || debugFallbackImage;
    return <Dashboard preferences={preferences} image={displayImage} />;
  }

  // Generation loading screen (with error state)
  if (appState === AppState.GENERATING) {
    const icons = [
      <Home key="home" size={32} />,
      <Palette key="palette" size={32} />,
      <Layers key="layers" size={32} />,
      <Zap key="zap" size={32} />,
      <MapPin key="map" size={32} />,
      <Sun key="sun" size={32} />,
      <Trees key="trees" size={32} />,
      <Wallet key="wallet" size={32} />,
      <Sparkles key="sparkles" size={32} />,
    ];

    // Error state UI
    if (generationError) {
      return (
        <div className="min-h-screen bg-[#0a1628] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
          {/* Blueprint grid background */}
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(239, 68, 68, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(239, 68, 68, 0.5) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative z-10 max-w-md mx-auto"
          >
            {/* Error icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.1 }}
              className="w-24 h-24 mx-auto mb-8 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center"
            >
              <AlertTriangle className="w-12 h-12 text-red-400" />
            </motion.div>

            {/* Error message */}
            <h2 className="text-2xl font-semibold text-white mb-3">
              {t('wizard.generating.errorTitle')}
            </h2>
            <p className="text-white/60 mb-8 max-w-sm mx-auto">{generationError}</p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={goBackFromError}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/80 flex items-center justify-center gap-2 transition-colors"
              >
                <ArrowLeft size={18} />
                {t('common.back')}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={retryGeneration}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <RefreshCw size={18} />
                {t('common.retry')}
              </motion.button>
            </div>

            {/* Tip */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-xs text-white/30"
            >
              {t('wizard.generating.errorTip')}
            </motion.p>
          </motion.div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#0a1628] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        {/* Blueprint grid */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(59, 130, 246, 0.8) 2px, transparent 2px), linear-gradient(90deg, rgba(59, 130, 246, 0.8) 2px, transparent 2px)',
            backgroundSize: '200px 200px',
          }}
        />

        {/* Central animation */}
        <div className="relative z-10 max-w-lg mx-auto">
          <motion.div className="w-48 h-48 mx-auto mb-16 relative flex items-center justify-center">
            {/* Outer ring */}
            <motion.div
              className="absolute inset-0 border border-white/10 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            />

            {/* Center icon */}
            <AnimatePresence mode="wait">
              <motion.div
                key={generationStep}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-[#0C0C0C]"
              >
                {icons[Math.min(generationStep, icons.length - 1)]}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Progress */}
          <div className="w-48 mx-auto mb-8">
            <div className="h-[2px] bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
                initial={{ width: '0%' }}
                animate={{
                  width: `${((generationStep + 1) / GENERATION_MESSAGES.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Message */}
          <AnimatePresence mode="wait">
            <motion.p
              key={generationMessage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-xl text-white/80"
            >
              {generationMessage}
            </motion.p>
          </AnimatePresence>

          {/* Summary of preferences */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 space-y-4"
          >
            {/* Style tags */}
            <div className="flex flex-wrap justify-center gap-2">
              {preferences.style.moodBoardSelections.slice(0, 3).map((style, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-white/5 text-white/40 text-xs rounded-full border border-white/5"
                >
                  {style}
                </span>
              ))}
            </div>

            {/* Key specs */}
            <div className="flex justify-center gap-4 text-xs text-white/30 font-mono">
              <span>{preferences.config.sqm} m²</span>
              <span>•</span>
              <span>{preferences.household.bedrooms} {t('common.bedrooms').toLowerCase()}</span>
              <span>•</span>
              <span>{preferences.location.searchQuery.split(',')[0]}</span>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Step 1: Type */}
      {appState === AppState.WIZARD_STEP_TYPE && (
          <WizardStepType
            initialValue={preferences.household.type}
            onNext={handleTypeComplete}
          />
        )}

        {/* Step 2: Bedrooms */}
        {appState === AppState.WIZARD_STEP_BEDROOMS && (
          <WizardStepBedrooms
            initialValue={preferences.household.bedrooms}
            onNext={handleBedroomsComplete}
            onBack={() => setAppState(AppState.WIZARD_STEP_TYPE)}
          />
        )}

        {/* Step 3: Budget */}
        {appState === AppState.WIZARD_STEP_BUDGET && (
          <WizardStepBudget
            initialValue={preferences.budget.total}
            onNext={handleBudgetComplete}
            onBack={() => setAppState(AppState.WIZARD_STEP_BEDROOMS)}
          />
        )}

        {/* Step 4: Timeline */}
        {appState === AppState.WIZARD_STEP_TIMELINE && (
          <WizardStepTimeline
            initialValue={preferences.budget.timeline}
            onNext={handleTimelineComplete}
            onBack={() => setAppState(AppState.WIZARD_STEP_BUDGET)}
          />
        )}

        {/* Step 5: Location */}
        {appState === AppState.WIZARD_STEP_LOCATION && (
          <WizardStepLocation
            initialValue={preferences.location.searchQuery}
            onNext={handleLocationComplete}
            onBack={() => setAppState(AppState.WIZARD_STEP_TIMELINE)}
          />
        )}

        {/* Step 6: Style (MoodBoard) */}
        {appState === AppState.WIZARD_STEP_STYLE && (
          <WizardStepStyle
            initialValue={preferences.style.moodBoardSelections}
            onNext={handleStyleComplete}
            onBack={() => setAppState(AppState.WIZARD_STEP_LOCATION)}
          />
        )}

        {/* Step 7: Size */}
        {appState === AppState.WIZARD_STEP_SIZE && (
          <WizardStepSize
            initialValue={preferences.config.size}
            onNext={handleSizeComplete}
            onBack={() => setAppState(AppState.WIZARD_STEP_STYLE)}
          />
        )}

        {/* Step 8: Material */}
        {appState === AppState.WIZARD_STEP_MATERIAL && (
          <WizardStepMaterial
            initialValue={preferences.config.material}
            onNext={handleMaterialComplete}
            onBack={() => setAppState(AppState.WIZARD_STEP_SIZE)}
          />
        )}

        {/* Step 9: Energy */}
        {appState === AppState.WIZARD_STEP_ENERGY && (
          <WizardStepEnergy
            initialValue={preferences.config.energyLevel}
            onNext={handleEnergyComplete}
            onBack={() => setAppState(AppState.WIZARD_STEP_MATERIAL)}
          />
        )}

        {/* Step 10: Extras Energy */}
        {appState === AppState.WIZARD_STEP_EXTRAS_ENERGY && (
          <WizardStepExtrasEnergy
            initialValue={preferences.config.extras}
            onNext={handleExtrasEnergyComplete}
            onBack={() => setAppState(AppState.WIZARD_STEP_ENERGY)}
          />
        )}

        {/* Step 11: Extras Outdoor */}
        {appState === AppState.WIZARD_STEP_EXTRAS_OUTDOOR && (
          <WizardStepExtrasOutdoor
            initialValue={preferences.config.extras}
            onNext={handleExtrasOutdoorComplete}
            onBack={() => setAppState(AppState.WIZARD_STEP_EXTRAS_ENERGY)}
          />
        )}

        {/* Step 12: Extras Comfort */}
        {appState === AppState.WIZARD_STEP_EXTRAS_COMFORT && (
          <WizardStepExtrasComfort
            initialValue={preferences.config.extras}
            onNext={handleExtrasComfortComplete}
            onBack={() => setAppState(AppState.WIZARD_STEP_EXTRAS_OUTDOOR)}
          />
        )}

        {/* Step 13: Vibe */}
        {appState === AppState.WIZARD_STEP_VIBE && (
          <WizardStepVibe
            initialValue={preferences.config.vibe}
            onNext={handleVibeComplete}
            onBack={() => setAppState(AppState.WIZARD_STEP_EXTRAS_COMFORT)}
          />
        )}

        {/* Results */}
        {(appState === AppState.RESULTS_LOCKED ||
          appState === AppState.RESULTS_UNLOCKED) &&
          generatedImage && (
            <Results
              image={generatedImage}
              locked={appState === AppState.RESULTS_LOCKED}
              onUnlock={() => setAppState(AppState.RESULTS_UNLOCKED)}
              onDashboard={() => setAppState(AppState.DASHBOARD)}
              preferences={preferences}
            />
          )}
    </>
  );
};
