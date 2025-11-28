import React, { useState, useEffect } from 'react';
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
import { Sparkles, Home, Palette, Layers, Sun, Trees, Zap, MapPin, Wallet } from 'lucide-react';

interface WizardProps {
  appState: AppState;
  setAppState: (state: AppState) => void;
}

export const Wizard: React.FC<WizardProps> = ({ appState, setAppState }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(createDefaultPreferences());
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generationStep, setGenerationStep] = useState(0);
  const [generationMessage, setGenerationMessage] = useState('');
  
  // Track swipe rounds: start with 3, can extend to 6, then 8
  const [swipeRound, setSwipeRound] = useState(1);
  const swipeCounts = [3, 6, 8];
  const currentSwipeCount = swipeCounts[Math.min(swipeRound - 1, swipeCounts.length - 1)];
  const canSwipeMore = swipeRound < swipeCounts.length;

  // Step 1: Household
  const handleHouseholdComplete = (household: UserPreferences['household']) => {
    setPreferences(prev => ({ ...prev, household }));
    setAppState(AppState.WIZARD_MOODBOARD);
  };

  // Step 2: MoodBoard
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
    setAppState(AppState.WIZARD_PREFERENCES);
  };

  const handleSwipeMore = () => {
    setSwipeRound(prev => prev + 1);
    setAppState(AppState.WIZARD_MOODBOARD);
  };

  // Step 3: Preferences (Configuration)
  const handlePreferencesComplete = (config: UserPreferences['config']) => {
    setPreferences(prev => ({ ...prev, config }));
    setAppState(AppState.WIZARD_LOCATION);
  };

  // Step 4: Location
  const handleLocationComplete = (location: UserPreferences['location']) => {
    setPreferences(prev => ({ ...prev, location }));
    setAppState(AppState.WIZARD_BUDGET);
  };

  // Step 5: Budget
  const handleBudgetComplete = (budget: UserPreferences['budget']) => {
    setPreferences(prev => ({ ...prev, budget }));
    setAppState(AppState.GENERATING);
  };

  // Generation process
  useEffect(() => {
    if (appState === AppState.GENERATING) {
      setGenerationStep(0);
      
      const runGeneration = async () => {
        // Animate through generation messages
        for (let i = 0; i < GENERATION_MESSAGES.length; i++) {
          setGenerationStep(i);
          setGenerationMessage(GENERATION_MESSAGES[i].message);
          await new Promise(r => setTimeout(r, GENERATION_MESSAGES[i].duration));
        }

        // Actually generate the image with all preferences
        const image = await generateDreamHome(preferences);
        setGeneratedImage(image);
        
        // Small delay before showing results
        await new Promise(r => setTimeout(r, 500));
        setAppState(AppState.RESULTS_LOCKED);
      };
      
      runGeneration();
    }
  }, [appState, preferences, setAppState]);

  // Dashboard view
  if (appState === AppState.DASHBOARD && generatedImage) {
    return <Dashboard preferences={preferences} image={generatedImage} />;
  }

  // Generation loading screen
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

        {/* Step 2: MoodBoard */}
        {appState === AppState.WIZARD_MOODBOARD && (
          <MoodBoard 
            onComplete={handleMoodSelect} 
            images={MOOD_IMAGES} 
            initialSwipes={currentSwipeCount}
          />
        )}
        
        {/* Step 3: Preferences / Configuration */}
        {appState === AppState.WIZARD_PREFERENCES && (
          <Preferences 
            initialPrefs={preferences} 
            onNext={handlePreferencesComplete} 
            onBack={() => setAppState(AppState.WIZARD_MOODBOARD)}
            onSwipeMore={canSwipeMore ? handleSwipeMore : undefined}
          />
        )}

        {/* Step 4: Location */}
        {appState === AppState.WIZARD_LOCATION && (
          <LocationStep 
            initialPrefs={preferences}
            onNext={handleLocationComplete}
            onBack={() => setAppState(AppState.WIZARD_PREFERENCES)}
          />
        )}

        {/* Step 5: Budget */}
        {appState === AppState.WIZARD_BUDGET && (
          <BudgetStep 
            preferences={preferences}
            onNext={handleBudgetComplete}
            onBack={() => setAppState(AppState.WIZARD_LOCATION)}
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
