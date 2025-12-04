/**
 * CustomerActionsCard - Clean, unified action list
 * All cards same color for professional look
 * Now with popup integration for selections
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Zap, CheckCircle2, Calendar, Clock, Home, ChevronRight
} from 'lucide-react';
import { GlassCard } from './GlassCard';
import { useTheme } from '../../context/ThemeContext';
import { ActionPopup, ACTION_CONFIGS } from './ActionPopup';

export interface CustomerAction {
  id: string;
  type: 'decision' | 'approval' | 'milestone' | 'info';
  title: string;
  description?: string;
  deadline?: string;
  urgency: 'critical' | 'high' | 'medium' | 'low';
  popupId?: string; // Maps to ACTION_CONFIGS key
}

interface CustomerActionsCardProps {
  className?: string;
  actions?: CustomerAction[];
  onActionClick?: (action: CustomerAction) => void;
}

const DEFAULT_CUSTOMER_ACTIONS: CustomerAction[] = [
  {
    id: '1',
    type: 'decision',
    title: 'Keuze dakpannen bevestigen',
    description: 'Selecteer uit 3 opties',
    deadline: '10 dec',
    urgency: 'high',
    popupId: 'dakpannen',
  },
  {
    id: '2',
    type: 'approval',
    title: 'Keukenontwerp goedkeuren',
    description: 'Bekijk en keur goed',
    deadline: '15 dec',
    urgency: 'medium',
    popupId: 'keuken',
  },
  {
    id: '3',
    type: 'decision',
    title: 'Badkamer tegels kiezen',
    description: 'Selecteer uit 3 opties',
    deadline: '20 dec',
    urgency: 'medium',
    popupId: 'badkamer',
  },
  {
    id: '4',
    type: 'decision',
    title: 'Vloer selecteren',
    description: 'Selecteer uit 3 opties',
    deadline: '22 dec',
    urgency: 'medium',
    popupId: 'vloeren',
  },
  {
    id: '5',
    type: 'decision',
    title: 'Kozijnen kleur kiezen',
    description: 'Selecteer uit 3 opties',
    deadline: '18 dec',
    urgency: 'medium',
    popupId: 'kozijnen',
  },
];

export const CustomerActionsCard: React.FC<CustomerActionsCardProps> = ({
  className = '',
  actions = DEFAULT_CUSTOMER_ACTIONS,
  onActionClick,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activePopup, setActivePopup] = useState<string | null>(null);
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());

  const getActionIcon = (type: CustomerAction['type'], isCompleted: boolean, size = 16) => {
    if (isCompleted) return <CheckCircle2 size={size} />;
    switch (type) {
      case 'decision': return <Zap size={size} />;
      case 'approval': return <CheckCircle2 size={size} />;
      case 'milestone': return <Calendar size={size} />;
      case 'info': return <Home size={size} />;
    }
  };

  const getTypeLabel = (type: CustomerAction['type']) => {
    switch (type) {
      case 'decision': return 'Keuze';
      case 'approval': return 'Goedkeuring';
      case 'milestone': return 'Mijlpaal';
      case 'info': return 'Info';
    }
  };

  // Check if action has deadline that's urgent (within 7 days simulation)
  const isUrgent = (action: CustomerAction) => 
    action.urgency === 'critical' || action.urgency === 'high';

  const handleActionClick = (action: CustomerAction) => {
    if (action.popupId && ACTION_CONFIGS[action.popupId]) {
      setActivePopup(action.popupId);
    } else {
      onActionClick?.(action);
    }
  };

  const handlePopupSelect = (actionId: string, optionId: string) => {
    // Mark the action as completed
    const action = actions.find(a => a.popupId === actionId);
    if (action) {
      setCompletedActions(prev => new Set([...prev, action.id]));
    }
    console.log(`Selected ${optionId} for ${actionId}`);
  };

  // Filter out completed actions for display
  const pendingActions = actions.filter(a => !completedActions.has(a.id));

  return (
    <>
      <GlassCard className={`p-4 lg:p-5 ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
            Jouw acties
          </h3>
          <span className={`text-sm ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
            {pendingActions.length} openstaand
          </span>
        </div>

        {/* Action List - Unified design */}
        <div className="space-y-2.5">
          {pendingActions.slice(0, 4).map((action, index) => {
            const isCompleted = completedActions.has(action.id);
            return (
              <motion.button
                key={action.id}
                onClick={() => handleActionClick(action)}
                className={`w-full p-3 lg:p-3.5 rounded-xl text-left transition-all group ${
                  isCompleted
                    ? isDark 
                      ? 'bg-emerald-500/10 border border-emerald-500/20' 
                      : 'bg-emerald-50 border border-emerald-200'
                    : isDark 
                      ? 'bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06]' 
                      : 'bg-sky-50/50 hover:bg-sky-50 border border-sky-100/50'
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ x: isCompleted ? 0 : 2 }}
              >
                {/* Mobile Layout: Stacked */}
                <div className="flex lg:hidden flex-col gap-2">
                  {/* Top row: Title + Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-sm font-medium leading-tight ${
                      isCompleted
                        ? isDark ? 'text-emerald-400 line-through' : 'text-emerald-700 line-through'
                        : isDark ? 'text-white' : 'text-slate-800'
                    }`}>
                      {action.title}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase flex-shrink-0 ${
                      isCompleted
                        ? isDark 
                          ? 'bg-emerald-500/10 text-emerald-400' 
                          : 'bg-emerald-100 text-emerald-600'
                        : isDark 
                          ? 'bg-white/5 text-white/40' 
                          : 'bg-sky-100 text-sky-600'
                    }`}>
                      {isCompleted ? '✓' : getTypeLabel(action.type)}
                    </span>
                  </div>
                  {/* Bottom row: Description + Deadline */}
                  {!isCompleted && (
                    <div className="flex items-center justify-between gap-2">
                      {action.description && (
                        <p className={`text-xs ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                          {action.description}
                        </p>
                      )}
                      <div className="flex items-center gap-1.5 ml-auto flex-shrink-0">
                        {action.deadline && (
                          <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
                            isUrgent(action)
                              ? isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-600'
                              : isDark ? 'bg-white/5 text-white/50' : 'bg-slate-100 text-slate-500'
                          }`}>
                            <Clock size={11} />
                            {action.deadline}
                          </div>
                        )}
                        <ChevronRight 
                          size={16} 
                          className={isDark ? 'text-white/30' : 'text-slate-400'} 
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Desktop Layout: Horizontal */}
                <div className="hidden lg:flex items-center gap-3">
                  {/* Icon */}
                  <div className={`w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isCompleted
                      ? isDark 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : 'bg-emerald-100 text-emerald-600'
                      : isDark 
                        ? 'bg-blue-500/10 text-blue-400' 
                        : 'bg-sky-100 text-sky-600'
                  }`}>
                    {getActionIcon(action.type, isCompleted, 22)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-base font-medium truncate ${
                        isCompleted
                          ? isDark ? 'text-emerald-400 line-through' : 'text-emerald-700 line-through'
                          : isDark ? 'text-white' : 'text-slate-800'
                      }`}>
                        {action.title}
                      </span>
                      {/* Type badge - subtle */}
                      <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase flex-shrink-0 ${
                        isCompleted
                          ? isDark 
                            ? 'bg-emerald-500/10 text-emerald-400' 
                            : 'bg-emerald-100 text-emerald-600'
                          : isDark 
                            ? 'bg-white/5 text-white/40' 
                            : 'bg-sky-100 text-sky-600'
                      }`}>
                        {isCompleted ? 'Voltooid' : getTypeLabel(action.type)}
                      </span>
                    </div>
                    {action.description && !isCompleted && (
                      <p className={`text-sm mt-0.5 truncate ${
                        isDark ? 'text-white/50' : 'text-slate-500'
                      }`}>
                        {action.description}
                      </p>
                    )}
                  </div>

                  {/* Right side: deadline + arrow */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {action.deadline && !isCompleted && (
                      <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg ${
                        isUrgent(action)
                          ? isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-600'
                          : isDark ? 'bg-white/5 text-white/50' : 'bg-slate-100 text-slate-500'
                      }`}>
                        <Clock size={14} />
                        <span className="text-sm font-medium">{action.deadline}</span>
                      </div>
                    )}
                    {!isCompleted && (
                      <ChevronRight 
                        size={20} 
                        className={`transition-transform group-hover:translate-x-1 ${
                          isDark ? 'text-white/30' : 'text-slate-400'
                        }`} 
                      />
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* View all link */}
        <button className={`w-full mt-4 py-2.5 text-sm font-medium flex items-center justify-center gap-1.5 rounded-lg transition-colors ${
          isDark 
            ? 'text-blue-400 hover:bg-blue-500/10' 
            : 'text-sky-600 hover:bg-sky-50'
        }`}>
          Alle taken bekijken
          <ArrowRight size={16} />
        </button>
      </GlassCard>

      {/* Action Popup */}
      <ActionPopup
        actionId={activePopup}
        onClose={() => setActivePopup(null)}
        onSelect={handlePopupSelect}
      />
    </>
  );
};

export default CustomerActionsCard;
