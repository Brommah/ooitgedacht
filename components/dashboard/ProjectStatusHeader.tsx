/**
 * ProjectStatusHeader - Compact header replacing decorative hero
 * 
 * Differentiates between:
 * - Customer: Warm, emotional greeting with progress focus
 * - Builder: Professional, functional with project ID and operational status
 */
import React from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Calendar, 
  TrendingUp,
  Home,
  HardHat,
  Sparkles,
  Clock,
} from 'lucide-react';
import { 
  ViewMode, 
  ProjectStatusHeaderProps,
  DEFAULT_CUSTOMER_PROFILE,
  DEFAULT_BUILDER_PROFILE,
  DEFAULT_PROJECT_STATUS,
} from './types';

/**
 * Get time-appropriate greeting
 */
const getTimeGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Goedemorgen';
  if (hour < 18) return 'Goedemiddag';
  return 'Goedenavond';
};

export const ProjectStatusHeader: React.FC<ProjectStatusHeaderProps> = ({
  viewMode,
  projectName,
  projectStatus = DEFAULT_PROJECT_STATUS,
  overallProgress,
  customerProfile = DEFAULT_CUSTOMER_PROFILE,
  builderProfile = DEFAULT_BUILDER_PROFILE,
}) => {
  const isCustomer = viewMode === 'customer';
  const greeting = getTimeGreeting();
  
  // Role-specific colors
  const accentColor = isCustomer ? 'blue' : 'amber';
  const accentClasses = isCustomer 
    ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' 
    : 'text-amber-400 bg-amber-500/10 border-amber-500/20';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="px-4 py-4 lg:px-6 lg:py-5 border-b border-white/5 bg-gradient-to-r from-white/[0.02] to-transparent"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left: Greeting & Identity */}
        <div className="flex items-start gap-4">
          {/* Role Icon */}
          <motion.div 
            className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${accentClasses}`}
            whileHover={{ scale: 1.05 }}
          >
            {isCustomer ? (
              <Home size={22} className={`text-${accentColor}-400`} />
            ) : (
              <HardHat size={22} className={`text-${accentColor}-400`} />
            )}
          </motion.div>
          
          <div>
            {/* Greeting - Different tone per role */}
            {isCustomer ? (
              <>
                <h1 className="text-xl lg:text-2xl font-bold text-white">
                  {greeting}, <span className="text-blue-400">{customerProfile.firstName}</span>
                </h1>
                <p className="text-sm text-white/50 mt-0.5 flex items-center gap-1.5">
                  <Sparkles size={12} className="text-blue-400" />
                  Je droomhuis komt elke dag dichterbij
                </p>
              </>
            ) : (
              <>
                <h1 className="text-xl lg:text-2xl font-bold text-white">
                  {greeting}, <span className="text-amber-400">{builderProfile.firstName}</span>
                </h1>
                <p className="text-sm text-white/50 mt-0.5 font-mono">
                  Project #{projectStatus.projectId} • <span className="text-amber-400">In Uitvoering</span>
                </p>
              </>
            )}
          </div>
        </div>
        
        {/* Right: Quick Stats Row */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Location Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl">
            <MapPin size={14} className="text-white/40" />
            <span className="text-sm text-white/70">{projectStatus.address.split(',')[0]}</span>
          </div>
          
          {/* Phase Badge */}
          <div className={`flex items-center gap-2 px-3 py-1.5 border rounded-xl ${accentClasses}`}>
            <span className={`text-xs font-medium text-${accentColor}-400`}>
              Fase {projectStatus.phaseNumber}/{projectStatus.totalPhases}
            </span>
            <span className="text-xs text-white/50">•</span>
            <span className="text-sm text-white/70">{projectStatus.phase}</span>
          </div>
          
          {/* Progress - Compact */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl">
            <TrendingUp size={14} className="text-emerald-400" />
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${overallProgress.percentage}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
              </div>
              <span className="text-sm font-mono font-medium text-emerald-400">
                {overallProgress.percentage}%
              </span>
            </div>
          </div>
          
          {/* Expected Completion - Customer only */}
          {isCustomer && (
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl">
              <Calendar size={14} className="text-white/40" />
              <span className="text-sm text-white/70">Oplevering: {projectStatus.expectedCompletion}</span>
            </div>
          )}
          
          {/* Active Tasks - Builder only */}
          {!isCustomer && (
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <Clock size={14} className="text-amber-400" />
              <span className="text-sm text-amber-300">4 taken vandaag</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectStatusHeader;

