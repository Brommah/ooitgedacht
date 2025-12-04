/**
 * ProjectStatusWidget - Project thumbnail and progress
 */
import React from 'react';
import { motion } from 'framer-motion';
import { WidgetComponentProps } from '../types';
import { GlassCard } from '../../GlassCard';
import { useTheme } from '../../../../context/ThemeContext';

interface ProjectStatusWidgetProps extends WidgetComponentProps {
  image?: string;
  projectName?: string;
  styleName?: string;
  sqm?: number;
  bedrooms?: number;
  energyLabel?: string;
  overallProgress?: { percentage: number; completed: number; total: number };
}

const DEFAULT_PROJECT_STATUS = { 
  projectId: '2024-VH-001', 
  phaseNumber: 2, 
  totalPhases: 5, 
  phase: 'Ruwbouw', 
  expectedCompletion: 'Mei 2025' 
};

export const ProjectStatusWidget: React.FC<ProjectStatusWidgetProps> = ({
  viewMode,
  isEditing,
  image = '/generated/hero-fietspad.jpeg',
  projectName = 'Veluwse Heide',
  styleName = 'Houten Polderwoning',
  sqm = 150,
  bedrooms = 3,
  energyLabel = 'A+',
  overallProgress = { percentage: 29, completed: 2, total: 5 },
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isCustomer = viewMode === 'customer';

  return (
    <GlassCard className="p-3 lg:p-4 overflow-hidden" variant={isCustomer ? 'gradient' : 'highlight'}>
      <div className="flex items-center gap-3 lg:gap-4">
        {/* Thumbnail */}
        <div className="relative w-14 h-14 lg:w-20 lg:h-20 rounded-xl overflow-hidden flex-shrink-0 shadow-lg">
          <img src={image} alt="Project" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <span className={`absolute bottom-0.5 left-0.5 lg:bottom-1 lg:left-1 px-1 lg:px-1.5 py-0.5 rounded text-[8px] lg:text-[10px] font-bold text-white ${
            isCustomer ? 'bg-emerald-500/80' : 'bg-amber-500/80'
          }`}>
            LIVE
          </span>
        </div>
        
        {/* Project Info */}
        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h2 className={`font-bold text-sm lg:text-xl truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {projectName}
              </h2>
              <p className={`text-[10px] lg:text-sm truncate ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
                {styleName} • {sqm}m²
              </p>
            </div>
            <span className={`px-1.5 lg:px-2.5 py-0.5 lg:py-1 rounded-lg text-[10px] lg:text-sm font-bold flex-shrink-0 ${
              isDark 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
            }`}>
              {energyLabel}
            </span>
          </div>
          
          {/* Inline Progress Bar */}
          <div className="mt-2 lg:mt-3 flex items-center gap-2 lg:gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex justify-between text-[10px] lg:text-xs mb-1">
                <span className={isDark ? 'text-white/50' : 'text-slate-500'}>Voortgang</span>
                <span className={`font-mono font-bold ${
                  isCustomer 
                    ? isDark ? 'text-blue-400' : 'text-sky-600'
                    : isDark ? 'text-amber-400' : 'text-amber-600'
                }`}>
                  {overallProgress.percentage}%
                </span>
              </div>
              <div className={`h-1.5 lg:h-2.5 rounded-full overflow-hidden ${
                isDark ? 'bg-white/10' : 'bg-slate-200'
              }`}>
                <motion.div 
                  className={`h-full rounded-full ${
                    isCustomer 
                      ? 'bg-gradient-to-r from-sky-500 to-emerald-400' 
                      : 'bg-gradient-to-r from-amber-500 to-orange-400'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${overallProgress.percentage}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>
            <div className={`text-[10px] lg:text-xs flex-shrink-0 ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
              {DEFAULT_PROJECT_STATUS.phaseNumber}/{DEFAULT_PROJECT_STATUS.totalPhases}
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default ProjectStatusWidget;
