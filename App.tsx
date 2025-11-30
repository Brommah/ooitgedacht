import React, { useState } from 'react';
import { AppState } from './types';
import { Hero } from './components/Hero';
import { Wizard } from './components/Wizard';
import { StateOfMarket } from './components/StateOfMarket';
import { MarketResearchPresentation } from './components/MarketResearchPresentation';
import { BuildersPage } from './components/BuildersPage';
import { CollaborativeWorkspace } from './components/CollaborativeWorkspace';

export default function App() {
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);

  return (
    <main className="font-sans text-white antialiased selection:bg-blue-400 selection:text-[#0a1628] min-h-screen bg-[#0a1628]">
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
      ) : (
        <Wizard appState={appState} setAppState={setAppState} />
      )}
    </main>
  );
}