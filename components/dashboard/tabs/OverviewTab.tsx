/**
 * OverviewTab - Role-specific Dashboard Overview with Widget System
 * 
 * Features:
 * - Apple-style draggable, configurable widgets
 * - Two distinct experiences: Customer (Buyer) & Builder
 * - LocalStorage persistence for widget layouts
 * - Theme-aware styling
 * - Premium header with notifications & account
 */
import React, { useState } from 'react';
import { 
  Camera, 
  Sparkles, 
  Home, 
  HardHat 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { OverviewTabProps } from '../types';
import { FloatingActionButton } from '../MagneticButton';
import { WidgetGrid } from '../widgets';
import { DashboardHeader } from '../DashboardHeader';
import { NotificationsBanner } from '../NotificationsBanner';
import { useTheme } from '../../../context/ThemeContext';

// Default profiles
const DEFAULT_CUSTOMER_PROFILE = { firstName: 'Jan' };
const DEFAULT_BUILDER_PROFILE = { firstName: 'Pieter' };
const DEFAULT_PROJECT_STATUS = { 
  projectId: '2024-VH-001', 
  phaseNumber: 2, 
  totalPhases: 5, 
  phase: 'Ruwbouw', 
  expectedCompletion: 'Mei 2025' 
};

/**
 * Get time-appropriate greeting
 */
const getTimeGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Goedemorgen';
  if (hour < 18) return 'Goedemiddag';
  return 'Goedenavond';
};

export const OverviewTab: React.FC<OverviewTabProps> = ({ 
  image, 
  projectName, 
  preferences, 
  energyLabel, 
  overallProgress, 
  buildCost, 
  viewMode,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const styleName = preferences.style.moodBoardSelections[0] || 'Modern';
  const isCustomer = viewMode === 'customer';
  const greeting = getTimeGreeting();
  const profile = isCustomer ? DEFAULT_CUSTOMER_PROFILE : DEFAULT_BUILDER_PROFILE;

  // Edit state for dashboard - controlled from header
  const [isEditing, setIsEditing] = useState(false);

  // Props to pass to widgets
  const widgetProps = {
    image,
    projectName,
    styleName,
    sqm: preferences.config.sqm,
    bedrooms: preferences.household.bedrooms,
    energyLabel,
    overallProgress,
    buildCost,
  };
  
  return (
    <div className="relative min-h-full overflow-hidden">
      {/* Combined Header - Greeting + Actions in same row - Desktop only */}
      <div className={`hidden lg:flex items-center justify-between px-6 py-5 border-b ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
        {/* Left: Greeting & Identity */}
        <div className="flex items-center gap-4">
          <motion.div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
              isCustomer 
                ? isDark 
                  ? 'bg-blue-500/10 border-blue-500/20' 
                  : 'bg-sky-100 border-sky-200'
                : isDark
                  ? 'bg-amber-500/10 border-amber-500/20'
                  : 'bg-amber-100 border-amber-200'
            }`}
            whileHover={{ scale: 1.05 }}
          >
            {isCustomer ? (
              <Home size={22} className={isDark ? "text-blue-400" : "text-sky-600"} />
            ) : (
              <HardHat size={22} className={isDark ? "text-amber-400" : "text-amber-600"} />
            )}
          </motion.div>
          
          <div>
            {isCustomer ? (
              <>
                <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  Welkom thuis, <span className={isDark ? 'text-blue-400' : 'text-sky-600'}>{profile.firstName}</span>
                </h1>
                <p className={`text-sm mt-0.5 flex items-center gap-1.5 ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                  <Sparkles size={12} className={isDark ? "text-blue-400" : "text-sky-500"} />
                  Je droomhuis komt elke dag dichterbij
                </p>
              </>
            ) : (
              <>
                <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  {greeting}, <span className={isDark ? 'text-amber-400' : 'text-amber-600'}>{profile.firstName}</span>
                </h1>
                <p className={`text-sm mt-0.5 font-mono ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                  Project #{DEFAULT_PROJECT_STATUS.projectId} • <span className={isDark ? 'text-amber-400' : 'text-amber-600'}>In Uitvoering</span>
                </p>
              </>
            )}
          </div>
        </div>
        
        {/* Right: Header Actions */}
        <DashboardHeader
          viewMode={viewMode}
          isEditing={isEditing}
          onEditToggle={() => setIsEditing(!isEditing)}
          greeting={greeting}
          userName={profile.firstName}
        />
      </div>
      {/* End Desktop Header */}

      {/* Important Notifications - Always at top */}
      <div className="px-2 pt-3 lg:px-5 lg:pt-4">
        <NotificationsBanner viewMode={viewMode} />
      </div>

      {/* Main Content - Widget Grid */}
      <div className="px-2 py-3 lg:px-5 lg:py-4 overflow-hidden">
        <WidgetGrid 
          viewMode={viewMode}
          widgetProps={widgetProps}
          externalEditState={{
            isEditing,
            setIsEditing,
          }}
        />
      </div>

      {/* Floating Action Button - Mobile only, Builder view only */}
      {!isCustomer && (
      <div className="lg:hidden fixed bottom-24 right-4 z-40">
        <FloatingActionButton 
          icon={<Camera size={22} />}
          badge={1}
        />
      </div>
      )}
    </div>
  );
};

export default OverviewTab;
