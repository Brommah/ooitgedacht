/**
 * WhatsNextCard - Clean, unified builder action list
 * Consistent styling without urgency-based colors
 */
import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Camera, FileCheck, Clock, Euro, Zap, ChevronRight, Phone
} from 'lucide-react';
import { GlassCard } from './GlassCard';
import { useTheme } from '../../context/ThemeContext';

interface NextAction {
  id: string;
  type: 'photo' | 'inspection' | 'document' | 'decision' | 'payment' | 'call';
  title: string;
  description?: string;
  deadline?: string;
  urgency: 'critical' | 'high' | 'medium' | 'low';
  unlocksAmount?: number;
}

interface WhatsNextCardProps {
  className?: string;
  actions?: NextAction[];
  onActionClick?: (action: NextAction) => void;
}

const DEFAULT_ACTIONS: NextAction[] = [
  {
    id: '1',
    type: 'photo',
    title: 'Upload foto fundering',
    description: 'Wkb-verificatie',
    deadline: '17:00',
    urgency: 'critical',
    unlocksAmount: 15000,
  },
  {
    id: '2',
    type: 'decision',
    title: 'Dakpannen bevestigen',
    description: 'Klant wacht op keuze',
    deadline: '10 dec',
    urgency: 'high',
  },
  {
    id: '3',
    type: 'inspection',
    title: 'Plan wapeningskeuring',
    description: 'Coördinator contacteren',
    deadline: 'Deze week',
    urgency: 'medium',
  },
];

export const WhatsNextCard: React.FC<WhatsNextCardProps> = ({
  className = '',
  actions = DEFAULT_ACTIONS,
  onActionClick,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const getActionIcon = (type: NextAction['type'], size = 16) => {
    switch (type) {
      case 'photo': return <Camera size={size} />;
      case 'inspection': return <FileCheck size={size} />;
      case 'document': return <FileCheck size={size} />;
      case 'decision': return <Zap size={size} />;
      case 'payment': return <Euro size={size} />;
      case 'call': return <Phone size={size} />;
    }
  };

  const getTypeLabel = (type: NextAction['type']) => {
    switch (type) {
      case 'photo': return 'Foto';
      case 'inspection': return 'Keuring';
      case 'document': return 'Document';
      case 'decision': return 'Besluit';
      case 'payment': return 'Betaling';
      case 'call': return 'Bellen';
    }
  };

  // Check if action is urgent
  const isUrgent = (action: NextAction) => 
    action.urgency === 'critical' || action.urgency === 'high';

  return (
    <GlassCard className={`p-3 lg:p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
          Volgende acties
        </h3>
        <span className={`text-xs ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
          {actions.length} openstaand
        </span>
      </div>

      {/* Action List - Unified design */}
      <div className="space-y-2">
        {actions.map((action, index) => (
          <motion.button
            key={action.id}
            onClick={() => onActionClick?.(action)}
            className={`w-full p-3 rounded-xl text-left transition-all group ${
              isDark 
                ? 'bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06]' 
                : 'bg-sky-50/50 hover:bg-sky-50 border border-sky-100/50'
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ x: 2 }}
          >
            <div className="flex items-center gap-3">
              {/* Icon */}
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                isDark 
                  ? 'bg-amber-500/10 text-amber-400' 
                  : 'bg-amber-50 text-amber-600'
              }`}>
                {getActionIcon(action.type, 18)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium truncate ${
                    isDark ? 'text-white' : 'text-slate-800'
                  }`}>
                    {action.title}
                  </span>
                  {/* Type badge - subtle */}
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium uppercase flex-shrink-0 ${
                    isDark 
                      ? 'bg-white/5 text-white/40' 
                      : 'bg-amber-50 text-amber-600'
                  }`}>
                    {getTypeLabel(action.type)}
                  </span>
                </div>
                {action.description && (
                  <p className={`text-xs mt-0.5 truncate ${
                    isDark ? 'text-white/50' : 'text-slate-500'
                  }`}>
                    {action.description}
                  </p>
                )}
              </div>

              {/* Right side: amount, deadline, arrow */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Unlock amount */}
                {action.unlocksAmount && (
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-md ${
                    isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    <Euro size={10} />
                    <span className="text-[10px] font-bold font-mono">
                      €{(action.unlocksAmount / 1000).toFixed(0)}k
                    </span>
                  </div>
                )}
                
                {/* Deadline */}
                {action.deadline && (
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-md ${
                    isUrgent(action)
                      ? isDark ? 'bg-rose-500/10 text-rose-400' : 'bg-rose-50 text-rose-600'
                      : isDark ? 'bg-white/5 text-white/50' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <Clock size={10} />
                    <span className="text-[10px] font-medium">{action.deadline}</span>
                  </div>
                )}
                
                <ChevronRight 
                  size={16} 
                  className={`transition-transform group-hover:translate-x-1 ${
                    isDark ? 'text-white/30' : 'text-slate-400'
                  }`} 
                />
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* View all link */}
      <button className={`w-full mt-3 py-2 text-xs font-medium flex items-center justify-center gap-1 rounded-lg transition-colors ${
        isDark 
          ? 'text-amber-400 hover:bg-amber-500/10' 
          : 'text-amber-600 hover:bg-amber-50'
      }`}>
        Alle taken bekijken
        <ArrowRight size={12} />
      </button>
    </GlassCard>
  );
};

export default WhatsNextCard;
