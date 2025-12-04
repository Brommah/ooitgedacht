import React, { useState, Suspense, lazy } from 'react';
import { AppState } from './types';
import { LanguageProvider } from './i18n';
import { ErrorBoundary } from './components/ErrorBoundary';

// Eager load Hero for fast initial render
import { Hero } from './components/Hero';

// Lazy load heavy components for code splitting
const Wizard = lazy(() => import('./components/Wizard').then(m => ({ default: m.Wizard })));
const StateOfMarket = lazy(() => import('./components/StateOfMarket').then(m => ({ default: m.StateOfMarket })));
const MarketResearchPresentation = lazy(() => import('./components/MarketResearchPresentation').then(m => ({ default: m.MarketResearchPresentation })));
const BuildersPage = lazy(() => import('./components/BuildersPage').then(m => ({ default: m.BuildersPage })));
const CollaborativeWorkspace = lazy(() => import('./components/CollaborativeWorkspace').then(m => ({ default: m.CollaborativeWorkspace })));
const InvestorPitch = lazy(() => import('./components/InvestorPitch').then(m => ({ default: m.InvestorPitch })));

/**
 * Loading fallback component for lazy-loaded routes
 */
const LoadingFallback: React.FC = () => (
  <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
    <div className="text-center">
      <div className="relative w-16 h-16 mx-auto mb-6">
        {/* Animated loading spinner */}
        <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full" />
        <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-spin" />
      </div>
      <p className="text-white/60 text-sm font-light">Laden...</p>
    </div>
  </div>
);

export default function App() {
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);

  return (
    <ErrorBoundary onReset={() => setAppState(AppState.LANDING)}>
      <LanguageProvider>
        <main className="font-sans text-white antialiased selection:bg-blue-400 selection:text-[#0a1628] min-h-screen bg-[#0a1628]">
          <Suspense fallback={<LoadingFallback />}>
            {appState === AppState.LANDING ? (
              <Hero setAppState={setAppState} />
            ) : appState === AppState.STATE_OF_MARKET ? (
              <StateOfMarket setAppState={setAppState} />
            ) : appState === AppState.MARKET_RESEARCH ? (
              <MarketResearchPresentation setAppState={setAppState} />
            ) : appState === AppState.WORKSPACE ? (
              <CollaborativeWorkspace setAppState={setAppState} />
            ) : appState === AppState.B2B_BUILDERS ? (
              <BuildersPage setAppState={setAppState} />
            ) : appState === AppState.INVESTOR_PITCH ? (
              <InvestorPitch setAppState={setAppState} />
            ) : (
              <Wizard appState={appState} setAppState={setAppState} />
            )}
          </Suspense>
        </main>
      </LanguageProvider>
    </ErrorBoundary>
  );
}
