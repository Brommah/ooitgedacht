import React, { Suspense, lazy, useCallback } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
  useNavigate,
} from 'react-router-dom';
import { AppState } from './types';
import { LanguageProvider } from './i18n';
import { ErrorBoundary } from './components/ErrorBoundary';

// Eager load Hero for fast initial render (landing page)
import { Hero } from './components/Hero';

// Lazy load heavy components for code splitting
const Wizard = lazy(() => import('./components/Wizard').then(m => ({ default: m.Wizard })));
const Dashboard = lazy(() => import('./components/dashboard/Dashboard').then(m => ({ default: m.Dashboard })));
const StateOfMarket = lazy(() => import('./components/StateOfMarket').then(m => ({ default: m.StateOfMarket })));
const MarketResearchPresentation = lazy(() => import('./components/MarketResearchPresentation').then(m => ({ default: m.MarketResearchPresentation })));
const BuildersPage = lazy(() => import('./components/BuildersPage').then(m => ({ default: m.BuildersPage })));
const CollaborativeWorkspace = lazy(() => import('./components/CollaborativeWorkspace').then(m => ({ default: m.CollaborativeWorkspace })));
const InvestorPitch = lazy(() => import('./components/InvestorPitch').then(m => ({ default: m.InvestorPitch })));

/**
 * Map AppState enum values to router paths
 */
const STATE_TO_ROUTE: Record<string, string> = {
  [AppState.LANDING]: '/',
  [AppState.STATE_OF_MARKET]: '/market',
  [AppState.MARKET_RESEARCH]: '/research',
  [AppState.B2B_BUILDERS]: '/builders',
  [AppState.INVESTOR_PITCH]: '/investors',
  [AppState.WORKSPACE]: '/workspace',
  [AppState.DASHBOARD]: '/dashboard',
  // All wizard steps go to /wizard - internal state handled by Wizard component
  [AppState.WIZARD_STEP_TYPE]: '/wizard',
  [AppState.WIZARD_STEP_BEDROOMS]: '/wizard',
  [AppState.WIZARD_STEP_BUDGET]: '/wizard',
  [AppState.WIZARD_STEP_TIMELINE]: '/wizard',
  [AppState.WIZARD_STEP_LOCATION]: '/wizard',
  [AppState.WIZARD_STEP_STYLE]: '/wizard',
  [AppState.WIZARD_STEP_SIZE]: '/wizard',
  [AppState.WIZARD_STEP_MATERIAL]: '/wizard',
  [AppState.WIZARD_STEP_ENERGY]: '/wizard',
  [AppState.WIZARD_STEP_EXTRAS_ENERGY]: '/wizard',
  [AppState.WIZARD_STEP_EXTRAS_OUTDOOR]: '/wizard',
  [AppState.WIZARD_STEP_EXTRAS_COMFORT]: '/wizard',
  [AppState.WIZARD_STEP_VIBE]: '/wizard',
  [AppState.GENERATING]: '/wizard',
  [AppState.RESULTS_LOCKED]: '/wizard',
  [AppState.RESULTS_UNLOCKED]: '/wizard',
};

/**
 * Loading fallback component for lazy-loaded routes
 */
const LoadingFallback: React.FC = () => (
  <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
    <div className="text-center">
      <div className="relative w-16 h-16 mx-auto mb-6">
        <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full" />
        <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-spin" />
      </div>
      <p className="text-white/60 text-sm font-light">Laden...</p>
    </div>
  </div>
);

/**
 * Root layout component wrapping all routes
 */
const RootLayout: React.FC = () => {
  const navigate = useNavigate();

  return (
    <ErrorBoundary onReset={() => navigate('/')}>
      <LanguageProvider>
        <main className="font-sans text-white antialiased selection:bg-blue-400 selection:text-[#0a1628] min-h-screen bg-[#0a1628]">
          <Suspense fallback={<LoadingFallback />}>
            <Outlet />
          </Suspense>
        </main>
      </LanguageProvider>
    </ErrorBoundary>
  );
};

/**
 * Hook to convert AppState changes to router navigation
 */
function useAppStateNavigation() {
  const navigate = useNavigate();
  
  return useCallback((state: AppState) => {
    const route = STATE_TO_ROUTE[state] ?? '/';
    navigate(route);
  }, [navigate]);
}

/**
 * Landing page wrapper - Hero with navigation
 */
const LandingPage: React.FC = () => {
  const setAppState = useAppStateNavigation();
  return <Hero setAppState={setAppState} />;
};

/**
 * Wizard page wrapper - handles all wizard internal states
 */
const WizardPage: React.FC = () => {
  const navigate = useNavigate();
  const [appState, setAppStateInternal] = React.useState<AppState>(AppState.WIZARD_STEP_TYPE);
  
  const handleStateChange = useCallback((state: AppState) => {
    // Navigate back to landing if requested
    if (state === AppState.LANDING) {
      navigate('/');
      return;
    }
    // Navigate to dashboard if completed
    if (state === AppState.DASHBOARD) {
      navigate('/dashboard');
      return;
    }
    // Otherwise handle wizard internal states
    setAppStateInternal(state);
  }, [navigate]);

  return <Wizard appState={appState} setAppState={handleStateChange} />;
};

/**
 * Page wrappers with navigation support
 */
const MarketPage: React.FC = () => {
  const setAppState = useAppStateNavigation();
  return <StateOfMarket setAppState={setAppState} />;
};

const ResearchPage: React.FC = () => {
  const setAppState = useAppStateNavigation();
  return <MarketResearchPresentation setAppState={setAppState} />;
};

const BuildersPageWrapper: React.FC = () => {
  const setAppState = useAppStateNavigation();
  return <BuildersPage setAppState={setAppState} />;
};

const WorkspacePage: React.FC = () => {
  const setAppState = useAppStateNavigation();
  return <CollaborativeWorkspace setAppState={setAppState} />;
};

const InvestorPage: React.FC = () => {
  const setAppState = useAppStateNavigation();
  return <InvestorPitch setAppState={setAppState} />;
};

/**
 * Dashboard page wrapper - loads saved preferences and generated image
 * If no data exists, shows demo dashboard
 */
const DashboardPage: React.FC = () => {
  const [dashboardData, setDashboardData] = React.useState<{
    preferences: any;
    image: string;
  } | null>(null);

  React.useEffect(() => {
    // Load saved data from localStorage
    const savedPrefs = localStorage.getItem('ooit-gedacht-dashboard-prefs');
    const savedImage = localStorage.getItem('ooit-gedacht-dashboard-image');
    
    if (savedPrefs && savedImage) {
      // User has completed wizard - load their data
      try {
        const preferences = JSON.parse(savedPrefs);
        setDashboardData({
          preferences,
          image: savedImage,
        });
        return;
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      }
    }
    
    // No saved data - show demo dashboard with sample data
    const demoPreferences = {
      household: {
        type: 'couple',
        bedrooms: 3,
      },
      style: {
        moodBoardSelections: ['Houten Polderwoning'],
        inferredRoofStyle: 'pitched',
        inferredMaterialAffinity: 'wood',
      },
      config: {
        size: 'family',
        sqm: 150,
        material: 'wood',
        energyLevel: 'aplus',
        extras: ['solar', 'heat_pump'],
        vibe: 50,
      },
      location: {
        searchQuery: 'Ermelo, Gelderland',
        coordinates: { lat: 52.3, lng: 5.6 },
      },
      budget: {
        total: 450000,
        timeline: '1-2_years',
      },
    };

    setDashboardData({
      preferences: demoPreferences,
      image: '/generated/mood-v3/houten-polderwoning.png',
    });
  }, []);

  if (!dashboardData) {
    return <LoadingFallback />;
  }

  return <Dashboard preferences={dashboardData.preferences} image={dashboardData.image} />;
};

/**
 * Router configuration with lazy-loaded routes
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: 'wizard',
        element: <WizardPage />,
      },
      {
        path: 'wizard/*',
        element: <WizardPage />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'market',
        element: <MarketPage />,
      },
      {
        path: 'research',
        element: <ResearchPage />,
      },
      {
        path: 'builders',
        element: <BuildersPageWrapper />,
      },
      {
        path: 'workspace',
        element: <WorkspacePage />,
      },
      {
        path: 'investors',
        element: <InvestorPage />,
      },
      {
        // Catch-all redirect to landing
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

/**
 * Main App component using React Router
 */
export const AppWithRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};

