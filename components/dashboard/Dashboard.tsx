/**
 * Dashboard - Main project dashboard component
 * 
 * Displays project overview, phases, documents, and chat.
 * Refactored into modular sub-components.
 * 
 * Uses CSS-only responsive design for mobile/desktop switching.
 * Supports light/dark theme switching.
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ENERGY_OPTIONS, calculateBuildCost } from '../../constants';
import { getOverallProgress } from '../../constants/milestones';
import { useTranslation } from '../../i18n';
import { Homie } from '../Homie';
import { ThemeProvider, useTheme } from '../../context/ThemeContext';

// Dashboard components
import { DesktopSidebar } from './DesktopSidebar';
import { MobileHeader } from './MobileHeader';
import { MobileBottomNav } from './MobileBottomNav';
import { OverviewTab } from './tabs/OverviewTab';
import { PassportTab } from './tabs/PassportTab';
import { DocsTab } from './tabs/DocsTab';
import { ChatTab } from './tabs/ChatTab';
import { TabType, ViewMode, DashboardProps } from './types';

// Inner component that uses theme
const DashboardInner: React.FC<DashboardProps> = ({ preferences, image }) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [viewMode, setViewMode] = useState<ViewMode>('customer');
  const { t, language } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const projectName = 'Veluwse Heide';
  const locationName = preferences.location.searchQuery.split(',')[0] || 'Ermelo';
  
  const energyOpt = ENERGY_OPTIONS.find(e => e.value === preferences.config.energyLevel);
  const energyLabel = preferences.config.energyLevel === 'positive' ? 'A+++' 
    : preferences.config.energyLevel === 'neutral' ? 'A++' 
    : preferences.config.energyLevel === 'aplus' ? 'A+' 
    : 'A';

  const overallProgress = getOverallProgress();

  const buildCost = calculateBuildCost(
    preferences.config.sqm,
    preferences.config.material,
    preferences.config.energyLevel,
    preferences.config.extras,
    preferences.config.vibe
  );

  return (
    <div className={`h-screen flex transition-colors duration-300 ${
      isDark 
        ? 'bg-[#0a1628] text-white' 
        : 'bg-[#f8fafc] text-slate-900'
    }`}>
      {/* Blueprint Grid Background - Dark mode only */}
      {isDark && (
        <div className="fixed inset-0 pointer-events-none z-0">
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
            }}
          />
        </div>
      )}

      {/* Desktop Sidebar - Fixed/Sticky */}
      <DesktopSidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        projectName={projectName}
        locationName={locationName}
        overallProgress={overallProgress}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 flex flex-col h-screen relative z-10 overflow-hidden">
        {/* Mobile Header - CSS handles visibility */}
        <MobileHeader 
          projectName={projectName}
          locationName={locationName}
          overallProgress={overallProgress}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Content - Scrollable */}
        <main className="flex-1 pb-20 lg:pb-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
              transition={{ 
                duration: 0.35,
                ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
              }}
            >
              {activeTab === 'overview' && (
                <OverviewTab 
                  image={image}
                  projectName={projectName}
                  preferences={preferences}
                  energyLabel={energyLabel}
                  overallProgress={overallProgress}
                  buildCost={buildCost}
                  energyOpt={energyOpt}
                  viewMode={viewMode}
                />
              )}
              {activeTab === 'passport' && (
                <PassportTab 
                  projectName={projectName}
                  address={`${locationName}, Nederland`}
                  energyLabel={energyLabel}
                  sqm={preferences.config.sqm}
                  bedrooms={preferences.household.bedrooms}
                  bathrooms={2}
                  buildPhase={overallProgress.percentage}
                />
              )}
              {activeTab === 'docs' && (
                <DocsTab preferences={preferences} energyLabel={energyLabel} energyOpt={energyOpt} />
              )}
              {activeTab === 'chat' && (
                <ChatTab />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Mobile Bottom Nav - CSS handles visibility */}
        <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Homie - The AI Assistant (context-aware based on viewMode) */}
      <Homie viewMode={viewMode} />
    </div>
  );
};

// Wrapper component that provides theme context
export const Dashboard: React.FC<DashboardProps> = (props) => {
  return (
    <ThemeProvider>
      <DashboardInner {...props} />
    </ThemeProvider>
  );
};

