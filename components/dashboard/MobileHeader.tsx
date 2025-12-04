/**
 * MobileHeader - Role-aware mobile navigation header
 * 
 * Differentiates between:
 * - Customer: Blue accents, Wkb "compliant" badge, home-focused
 * - Builder: Amber accents, task-focused Wkb status, project ID shown
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, CheckCircle2, Euro, FileText, MessageSquare, X, Home, HardHat, Shield, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  OverallProgress, 
  ViewMode,
  DEFAULT_CUSTOMER_PROFILE,
  DEFAULT_BUILDER_PROFILE,
  DEFAULT_PROJECT_STATUS,
} from './types';
import { ViewModeToggle } from './ViewModeToggle';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '../../context/ThemeContext';

interface MobileHeaderProps {
  projectName: string;
  locationName: string;
  overallProgress: OverallProgress;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

// Customer activity notifications
const customerActivity = [
  { icon: <CheckCircle2 size={14} />, title: 'Fundering goedgekeurd!', time: 'Vandaag, 09:41', color: 'emerald' },
  { icon: <Euro size={14} />, title: 'Volgende betaling gepland', time: 'Vandaag, 09:45', color: 'blue' },
  { icon: <MessageSquare size={14} />, title: 'Nieuw bericht van aannemer', time: 'Gisteren, 18:22', color: 'amber' },
  { icon: <FileText size={14} />, title: 'Woningpaspoort bijgewerkt', time: 'Gisteren, 14:15', color: 'purple' },
];

// Builder activity notifications
const builderActivity = [
  { icon: <Camera size={14} />, title: 'Foto vereist: Fundering', time: 'Nu', color: 'amber' },
  { icon: <CheckCircle2 size={14} />, title: 'Wapeningskeuring goedgekeurd', time: 'Vandaag, 09:41', color: 'emerald' },
  { icon: <Euro size={14} />, title: 'Tranche 2 vrijgegeven (€34.500)', time: 'Vandaag, 09:45', color: 'emerald' },
  { icon: <MessageSquare size={14} />, title: 'Nieuw bericht van klant', time: 'Gisteren, 18:22', color: 'blue' },
];

export const MobileHeader: React.FC<MobileHeaderProps> = ({ 
  projectName, 
  locationName, 
  overallProgress,
  viewMode,
  onViewModeChange,
}) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const isCustomer = viewMode === 'customer';
  const recentActivity = isCustomer ? customerActivity : builderActivity;
  const unreadCount = isCustomer ? 3 : 5;

  const handleBack = () => {
    navigate('/');
  };

  return (
    <>
      <header className={`mobile-header lg:hidden sticky top-0 z-50 backdrop-blur-xl border-b transition-colors ${
        isDark
          ? isCustomer 
            ? 'bg-[#0a1628]/95 border-white/5' 
            : 'bg-[#0a1628]/95 border-amber-500/10'
          : isCustomer
            ? 'bg-white/95 border-sky-100'
            : 'bg-white/95 border-amber-100'
      }`}>
        <div className="px-4 py-3">
          {/* Two rows for better spacing */}
          <div className="flex flex-col gap-2">
            {/* Row 1: Back + Project Name + Bell */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleBack}
                  className={`p-1.5 -ml-1.5 rounded-lg flex-shrink-0 transition-colors ${
                    isDark 
                      ? 'text-white/50 hover:bg-white/5 hover:text-white/70' 
                      : 'text-slate-400 hover:bg-sky-50 hover:text-slate-600'
                  }`}
                >
                  <ArrowLeft size={20} />
                </button>
                
                <div>
                  <h1 className={`font-semibold text-base ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    {projectName}
                  </h1>
                  <p className={`text-xs ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                    {overallProgress.percentage}% voltooid
                  </p>
                </div>
              </div>
              
              {/* Bell only on right of first row */}
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative w-9 h-9 rounded-xl flex items-center justify-center ${
                  isDark
                    ? isCustomer 
                      ? 'bg-white/5 border border-white/10' 
                      : 'bg-amber-500/10 border border-amber-500/20'
                    : isCustomer
                      ? 'bg-sky-50 border border-sky-100'
                      : 'bg-amber-50 border border-amber-100'
                }`}
              >
                <Bell size={16} className={
                  isDark
                    ? isCustomer ? 'text-white/60' : 'text-amber-400'
                    : isCustomer ? 'text-sky-600' : 'text-amber-600'
                } />
                {unreadCount > 0 && (
                  <span className={`absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center ${
                    isCustomer ? 'bg-rose-500' : 'bg-amber-500'
                  }`}>
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
            
            {/* Row 2: Theme + View Toggle - properly spaced */}
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <ViewModeToggle 
                viewMode={viewMode} 
                onViewModeChange={onViewModeChange}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {showNotifications && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[60]"
              onClick={() => setShowNotifications(false)}
            />
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`fixed top-14 right-4 left-4 z-[70] border rounded-2xl overflow-hidden shadow-2xl max-w-sm ml-auto ${
                isDark 
                  ? `bg-[#0d1525] ${isCustomer ? 'border-white/10' : 'border-amber-500/20'}`
                  : `bg-white ${isCustomer ? 'border-sky-100' : 'border-amber-100'}`
              }`}
            >
              <div className={`flex items-center justify-between p-4 border-b ${
                isDark
                  ? isCustomer ? 'border-white/5' : 'border-amber-500/10'
                  : isCustomer ? 'border-sky-100' : 'border-amber-100'
              }`}>
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  {isCustomer ? 'Recente updates' : 'Acties & meldingen'}
                </h3>
                <button 
                  onClick={() => setShowNotifications(false)}
                  className={`p-1 rounded-lg ${isDark ? 'hover:bg-white/5' : 'hover:bg-sky-50'}`}
                >
                  <X size={16} className={isDark ? 'text-white/50' : 'text-slate-400'} />
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {recentActivity.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`flex items-start gap-3 p-4 cursor-pointer border-b last:border-0 ${
                      isDark ? 'border-white/5' : 'border-sky-50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isDark
                        ? item.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-400' :
                          item.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                          item.color === 'amber' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-purple-500/20 text-purple-400'
                        : item.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                          item.color === 'blue' ? 'bg-sky-50 text-sky-600' :
                          item.color === 'amber' ? 'bg-amber-50 text-amber-600' :
                          'bg-purple-50 text-purple-600'
                    }`}>
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${isDark ? 'text-white/80' : 'text-slate-700'}`}>{item.title}</p>
                      <p className={`text-xs mt-0.5 ${isDark ? 'text-white/40' : 'text-slate-500'}`}>{item.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className={`p-3 border-t ${
                isDark
                  ? isCustomer ? 'border-white/5' : 'border-amber-500/10'
                  : isCustomer ? 'border-sky-100' : 'border-amber-100'
              }`}>
                <button className={`w-full py-2 text-xs font-medium ${
                  isDark
                    ? isCustomer ? 'text-blue-400' : 'text-amber-400'
                    : isCustomer ? 'text-sky-600' : 'text-amber-600'
                }`}>
                  {isCustomer ? 'Alle updates bekijken' : 'Alle acties bekijken'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileHeader;
