/**
 * OpportunitiesWidget - Upgrade opportunities (customer only)
 * Adaptive to widget size
 */
import React from 'react';
import { Sparkles, Sun, CheckCircle2, ChevronRight } from 'lucide-react';
import { WidgetComponentProps, WidgetSize } from '../types';
import { GlassCard } from '../../GlassCard';
import { useTheme } from '../../../../context/ThemeContext';

interface OpportunitiesWidgetProps extends WidgetComponentProps {
  size?: WidgetSize;
}

export const OpportunitiesWidget: React.FC<OpportunitiesWidgetProps> = ({
  viewMode,
  isEditing,
  size = 'medium',
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isSmall = size === 'small';

  // Small size - compact view
  if (isSmall) {
    return (
      <GlassCard className={`p-3 ${
        isDark 
          ? 'bg-gradient-to-br from-violet-500/10 to-blue-500/5 border-violet-500/20'
          : 'bg-gradient-to-br from-violet-50 to-sky-50 border-violet-200'
      }`}>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={14} className={isDark ? "text-violet-400" : "text-violet-500"} />
          <span className={`text-xs font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>Kansen</span>
        </div>
        <div className="flex items-center gap-2">
          <Sun size={16} className={isDark ? "text-amber-400" : "text-amber-500"} />
          <span className={`text-xs truncate ${isDark ? 'text-white/80' : 'text-slate-700'}`}>Zonnepanelen deal</span>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className={`p-4 ${
      isDark 
        ? 'bg-gradient-to-br from-violet-500/10 to-blue-500/5 border-violet-500/20'
        : 'bg-gradient-to-br from-violet-50 to-sky-50 border-violet-200'
    }`}>
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={16} className={isDark ? "text-violet-400" : "text-violet-500"} />
        <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>Kansen</span>
      </div>
      
      {/* Solar Panel Offer */}
      <div className={`p-3 rounded-xl mb-3 ${isDark ? 'bg-white/5' : 'bg-white/70'}`}>
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
            isDark ? 'bg-amber-500/20' : 'bg-amber-100'
          }`}>
            <Sun size={20} className={isDark ? "text-amber-400" : "text-amber-600"} />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
              Zonnepanelen deal
            </p>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
              €15/m extra, bespaart €40/m energie
            </p>
          </div>
        </div>
        <button className={`w-full mt-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 ${
          isDark 
            ? 'bg-violet-500/20 hover:bg-violet-500/30 border border-violet-500/30 text-violet-300'
            : 'bg-violet-500 hover:bg-violet-600 text-white'
        }`}>
          Bekijk aanbod <ChevronRight size={14} />
        </button>
      </div>

      {/* Wkb Status - Simplified for customer */}
      <div className={`p-2.5 rounded-xl flex items-center gap-2 ${
        isDark 
          ? 'bg-emerald-500/10 border border-emerald-500/20'
          : 'bg-emerald-50 border border-emerald-200'
      }`}>
        <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
        <span className={`text-xs ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
          Wkb-dossier compliant
        </span>
        <CheckCircle2 size={14} className={isDark ? "text-emerald-400" : "text-emerald-600"} />
      </div>
    </GlassCard>
  );
};

export default OpportunitiesWidget;
