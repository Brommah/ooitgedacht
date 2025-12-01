import React, { useState, useEffect, useCallback } from 'react';
import { AppState, UserPreferences, createDefaultPreferences } from '../types';
import { MOOD_IMAGES, GENERATION_MESSAGES } from '../constants';
import { HouseholdStep } from './HouseholdStep';
import { MoodBoard } from './MoodBoard';
import { Preferences } from './Preferences';
import { LocationStep } from './LocationStep';
import { BudgetStep } from './BudgetStep';
import { Results } from './Results';
import { Dashboard } from './Dashboard';
import { generateDreamHome } from '../services/geminiService';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Home, Palette, Layers, Sun, Trees, Zap, MapPin, Wallet, AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';

const STORAGE_KEY = 'ooit-gedacht-wizard-progress';

interface WizardProgress {
  preferences: UserPreferences;
  swipeRound: number;
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
const saveProgress = (preferences: UserPreferences, swipeRound: number): void => {
  try {
    const progress: WizardProgress = {
      preferences,
      swipeRound,
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

interface WizardProps {
  appState: AppState;
  setAppState: (state: AppState) => void;
}

export const Wizard: React.FC<WizardProps> = ({ appState, setAppState }) => {
  // Load saved progress or create fresh defaults
  const savedProgress = loadSavedProgress();
  
  const [preferences, setPreferences] = useState<UserPreferences>(
    savedProgress?.preferences ?? createDefaultPreferences()
  );
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generationStep, setGenerationStep] = useState(0);
  const [generationMessage, setGenerationMessage] = useState('');
  const [generationError, setGenerationError] = useState<string | null>(null);
  
  // Track swipe rounds: start with 3, can extend to 6, then 8
  const [swipeRound, setSwipeRound] = useState(savedProgress?.swipeRound ?? 1);
  const swipeCounts = [3, 6, 8];
  const currentSwipeCount = swipeCounts[Math.min(swipeRound - 1, swipeCounts.length - 1)];
  const canSwipeMore = swipeRound < swipeCounts.length;

  // Persist progress whenever preferences or swipeRound changes
  useEffect(() => {
    // Don't save during generation or after results
    if (appState !== AppState.GENERATING && 
        appState !== AppState.RESULTS_LOCKED && 
        appState !== AppState.RESULTS_UNLOCKED &&
        appState !== AppState.DASHBOARD) {
      saveProgress(preferences, swipeRound);
    }
  }, [preferences, swipeRound, appState]);

  // Clear progress when user completes the wizard successfully
  useEffect(() => {
    if (appState === AppState.RESULTS_UNLOCKED || appState === AppState.DASHBOARD) {
      clearProgress();
    }
  }, [appState]);

  // =========================================
  // NEW WIZARD SEQUENCE:
  // 1. Household → 2. Budget → 3. Location → 4. MoodBoard → 5. Preferences → Generate
  // This puts budget constraints first before users get excited about styles
  // =========================================

  // Step 1: Household
  const handleHouseholdComplete = (household: UserPreferences['household']) => {
    setPreferences(prev => ({ ...prev, household }));
    setAppState(AppState.WIZARD_BUDGET); // → Budget (step 2)
  };

  // Step 2: Budget (now comes earlier to set constraints)
  const handleBudgetComplete = (budget: UserPreferences['budget']) => {
    setPreferences(prev => ({ ...prev, budget }));
    setAppState(AppState.WIZARD_LOCATION); // → Location (step 3)
  };

  // Step 3: Location
  const handleLocationComplete = (location: UserPreferences['location']) => {
    setPreferences(prev => ({ ...prev, location }));
    setAppState(AppState.WIZARD_MOODBOARD); // → MoodBoard (step 4)
  };

  // Step 4: MoodBoard
  const handleMoodSelect = (tags: string[]) => {
    // Infer roof style and material from selections
    const selectedImages = MOOD_IMAGES.filter(img => tags.includes(img.tag));
    const roofStyles = selectedImages.map(img => img.inferredRoof).filter(Boolean);
    const materials = selectedImages.map(img => img.inferredMaterial).filter(Boolean);
    
    const inferredRoof = roofStyles[0] || 'pitched';
    const inferredMaterial = materials[0] || 'brick';

    setPreferences(prev => ({ 
      ...prev, 
      style: {
        moodBoardSelections: [...new Set([...prev.style.moodBoardSelections, ...tags])],
        inferredRoofStyle: inferredRoof,
        inferredMaterialAffinity: inferredMaterial,
      },
      // Also set config material based on inference
      config: {
        ...prev.config,
        material: inferredMaterial,
      }
    }));
    setAppState(AppState.WIZARD_PREFERENCES); // → Preferences (step 5)
  };

  const handleSwipeMore = () => {
    setSwipeRound(prev => prev + 1);
    setAppState(AppState.WIZARD_MOODBOARD);
  };

  // Step 5: Preferences (Configuration) - now triggers generation
  const handlePreferencesComplete = (config: UserPreferences['config']) => {
    setPreferences(prev => ({ ...prev, config }));
    setAppState(AppState.GENERATING); // → Generate!
  };

  // Retry generation callback
  const retryGeneration = useCallback(() => {
    setGenerationError(null);
    setAppState(AppState.GENERATING);
  }, [setAppState]);

  // Go back from error state
  const goBackFromError = useCallback(() => {
    setGenerationError(null);
    setAppState(AppState.WIZARD_BUDGET);
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
            await new Promise(r => setTimeout(r, GENERATION_MESSAGES[i].duration));
          }

          // Actually generate the image with all preferences
          const image = await generateDreamHome(preferences);
          
          if (isCancelled) return;
          
          // Check if we got a valid image (not just a fallback error)
          if (!image || image.includes('error') || image.length < 100) {
            throw new Error('Generatie mislukt - probeer opnieuw');
          }
          
          setGeneratedImage(image);
          
          // Small delay before showing results
          await new Promise(r => setTimeout(r, 500));
          
          if (!isCancelled) {
            setAppState(AppState.RESULTS_LOCKED);
          }
        } catch (error) {
          if (isCancelled) return;
          
          console.error('Generation failed:', error);
          const errorMessage = error instanceof Error 
            ? error.message 
            : 'Er is iets misgegaan bij het genereren van je droomhuis';
          setGenerationError(errorMessage);
        }
      };
      
      runGeneration();
      
      // Cleanup function to prevent state updates after unmount
      return () => {
        isCancelled = true;
      };
    }
  }, [appState, preferences, setAppState]);

  // Dashboard view
  // Use a fallback image for debug mode when no generated image exists
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
          <div className="absolute inset-0 opacity-[0.05]" style={{
            backgroundImage: 'linear-gradient(rgba(239, 68, 68, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(239, 68, 68, 0.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />

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
              Oeps, dat ging niet goed
            </h2>
            <p className="text-white/60 mb-8 max-w-sm mx-auto">
              {generationError}
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={goBackFromError}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/80 flex items-center justify-center gap-2 transition-colors"
              >
                <ArrowLeft size={18} />
                Terug naar budget
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={retryGeneration}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <RefreshCw size={18} />
                Opnieuw proberen
              </motion.button>
            </div>

            {/* Tip */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-xs text-white/30"
            >
              Tip: Controleer je internetverbinding en probeer het opnieuw
            </motion.p>
          </motion.div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#0a1628] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        {/* Blueprint grid */}
        <div className="absolute inset-0 opacity-[0.07]" style={{
          backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
        <div className="absolute inset-0 opacity-[0.1]" style={{
          backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.8) 2px, transparent 2px), linear-gradient(90deg, rgba(59, 130, 246, 0.8) 2px, transparent 2px)',
          backgroundSize: '200px 200px'
        }} />

        {/* Central animation */}
        <div className="relative z-10 max-w-lg mx-auto">
          <motion.div 
            className="w-48 h-48 mx-auto mb-16 relative flex items-center justify-center"
          >
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
                animate={{ width: `${((generationStep + 1) / GENERATION_MESSAGES.length) * 100}%` }}
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
              <span>{preferences.household.bedrooms} slaapkamers</span>
              <span>•</span>
              <span>{preferences.location.searchQuery.split(',')[0]}</span>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key={appState + '-' + swipeRound}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Step 1: Household */}
        {appState === AppState.WIZARD_HOUSEHOLD && (
          <HouseholdStep 
            initialPrefs={preferences}
            onNext={handleHouseholdComplete}
          />
        )}

        {/* Step 2: Budget (moved up - set constraints first) */}
        {appState === AppState.WIZARD_BUDGET && (
          <BudgetStep 
            preferences={preferences}
            onNext={handleBudgetComplete}
            onBack={() => setAppState(AppState.WIZARD_HOUSEHOLD)}
          />
        )}

        {/* Step 3: Location */}
        {appState === AppState.WIZARD_LOCATION && (
          <LocationStep 
            initialPrefs={preferences}
            onNext={handleLocationComplete}
            onBack={() => setAppState(AppState.WIZARD_BUDGET)}
          />
        )}

        {/* Step 4: MoodBoard */}
        {appState === AppState.WIZARD_MOODBOARD && (
          <MoodBoard 
            onComplete={handleMoodSelect} 
            images={MOOD_IMAGES} 
            initialSwipes={currentSwipeCount}
            onBack={() => setAppState(AppState.WIZARD_LOCATION)}
          />
        )}
        
        {/* Step 5: Preferences / Configuration (final step before generate) */}
        {appState === AppState.WIZARD_PREFERENCES && (
          <Preferences 
            initialPrefs={preferences} 
            onNext={handlePreferencesComplete} 
            onBack={() => setAppState(AppState.WIZARD_MOODBOARD)}
            onSwipeMore={canSwipeMore ? handleSwipeMore : undefined}
          />
        )}

        {/* Results */}
        {(appState === AppState.RESULTS_LOCKED || appState === AppState.RESULTS_UNLOCKED) && generatedImage && (
          <Results 
            image={generatedImage} 
            locked={appState === AppState.RESULTS_LOCKED}
            onUnlock={() => setAppState(AppState.RESULTS_UNLOCKED)}
            onDashboard={() => setAppState(AppState.DASHBOARD)}
            preferences={preferences}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
};
