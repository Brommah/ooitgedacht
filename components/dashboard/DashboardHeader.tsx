/**
 * DashboardHeader - Premium Top Header with Actions
 * 
 * Features:
 * - Account avatar with dropdown
 * - Notification bell with badge
 * - Edit dashboard toggle
 * - Glassmorphism design
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Settings2, 
  Check, 
  User, 
  LogOut, 
  ChevronDown,
  Sparkles,
  Home,
  HardHat,
  X,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ViewMode } from './types';
import { useTheme } from '../../context/ThemeContext';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning' | 'action';
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Ruwbouw 50% voltooid',
    message: 'Je project vordert uitstekend! CLT-wanden zijn geplaatst.',
    time: '2 uur geleden',
    type: 'success',
    read: false,
  },
  {
    id: '2',
    title: 'Foto vereist',
    message: 'Upload een foto van de fundering voor vrijgave tranche.',
    time: '5 uur geleden',
    type: 'action',
    read: false,
  },
  {
    id: '3',
    title: 'Weersupdate',
    message: 'Mogelijk regen morgen - bouwwerkzaamheden kunnen vertragen.',
    time: '1 dag geleden',
    type: 'warning',
    read: true,
  },
  {
    id: '4',
    title: 'Document toegevoegd',
    message: 'Constructieberekening.pdf is toegevoegd aan je dossier.',
    time: '2 dagen geleden',
    type: 'info',
    read: true,
  },
];

interface DashboardHeaderProps {
  viewMode: ViewMode;
  isEditing: boolean;
  onEditToggle: () => void;
  greeting?: string;
  userName?: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  viewMode,
  isEditing,
  onEditToggle,
  greeting = 'Welkom',
  userName = 'Jan',
}) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isCustomer = viewMode === 'customer';
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const handleLogout = () => {
    navigate('/');
  };
  
  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };
  
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return <CheckCircle2 size={16} className="text-emerald-400" />;
      case 'warning': return <AlertCircle size={16} className="text-amber-400" />;
      case 'action': return <Clock size={16} className="text-blue-400" />;
      default: return <Calendar size={16} className="text-white/50" />;
    }
  };
  
  return (
    <div className="flex items-center gap-2 relative z-30">
      {/* Edit Dashboard Button */}
      <motion.button
          onClick={onEditToggle}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            isEditing
              ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25'
              : isDark
                ? 'bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 text-white/70 hover:text-white'
                : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-800 shadow-sm'
          }`}
        >
          {isEditing ? (
            <>
              <Check size={16} />
              <span>Klaar</span>
            </>
          ) : (
            <>
              <Settings2 size={16} />
              <span className="hidden sm:inline">Bewerk Dashboard</span>
              <span className="sm:hidden">Bewerk</span>
            </>
          )}
        </motion.button>
        
        {/* Notifications */}
        <div className="relative">
          <motion.button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowAccountMenu(false);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              showNotifications
                ? isDark 
                  ? 'bg-white/15 border border-white/20' 
                  : 'bg-sky-100 border border-sky-200'
                : isDark 
                  ? 'bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10' 
                  : 'bg-white hover:bg-slate-50 border border-slate-200 shadow-sm'
            }`}
          >
            <Bell size={18} className={isDark ? 'text-white/70' : 'text-slate-600'} />
            
            {/* Badge */}
            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-rose-500 to-pink-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-rose-500/30"
                >
                  {unreadCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
          
          {/* Notifications Dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowNotifications(false)}
                  className="fixed inset-0 z-40"
                />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className={`absolute right-0 top-12 w-80 rounded-2xl shadow-2xl overflow-hidden z-50 ${
                    isDark 
                      ? 'bg-[#0d1525]/95 backdrop-blur-2xl border border-white/10' 
                      : 'bg-white border border-slate-200'
                  }`}
                >
                  {/* Header */}
                  <div className={`flex items-center justify-between p-4 border-b ${
                    isDark ? 'border-white/10' : 'border-slate-100'
                  }`}>
                    <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                      Meldingen
                    </h3>
                    {unreadCount > 0 && (
                      <button 
                        onClick={markAllRead}
                        className={`text-xs ${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-sky-600 hover:text-sky-700'}`}
                      >
                        Alles gelezen
                      </button>
                    )}
                  </div>
                  
                  {/* Notification List */}
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-4 border-b last:border-b-0 transition-colors cursor-pointer ${
                          isDark 
                            ? `border-white/5 ${notification.read ? '' : 'bg-white/5'} hover:bg-white/10`
                            : `border-slate-100 ${notification.read ? '' : 'bg-sky-50/50'} hover:bg-slate-50`
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                            isDark ? 'bg-white/10' : 'bg-slate-100'
                          }`}>
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className={`text-sm font-medium truncate ${
                                isDark ? 'text-white' : 'text-slate-800'
                              }`}>
                                {notification.title}
                              </p>
                              {!notification.read && (
                                <span className="w-2 h-2 bg-cyan-400 rounded-full flex-shrink-0" />
                              )}
                            </div>
                            <p className={`text-xs mt-0.5 line-clamp-2 ${
                              isDark ? 'text-white/50' : 'text-slate-500'
                            }`}>
                              {notification.message}
                            </p>
                            <p className={`text-[10px] mt-1 ${
                              isDark ? 'text-white/30' : 'text-slate-400'
                            }`}>
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Footer */}
                  <div className={`p-3 border-t ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
                    <button className={`w-full py-2 text-xs font-medium rounded-lg transition-colors ${
                      isDark 
                        ? 'bg-white/5 hover:bg-white/10 text-white/70' 
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}>
                      Alle meldingen bekijken
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
        
        {/* Account Avatar */}
        <div className="relative">
          <motion.button
            onClick={() => {
              setShowAccountMenu(!showAccountMenu);
              setShowNotifications(false);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all ${
              showAccountMenu
                ? isDark 
                  ? 'bg-white/15 border border-white/20' 
                  : 'bg-sky-100 border border-sky-200'
                : isDark 
                  ? 'bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10' 
                  : 'bg-white hover:bg-slate-50 border border-slate-200 shadow-sm'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
              isCustomer 
                ? 'bg-gradient-to-br from-sky-400 to-blue-500 text-white' 
                : 'bg-gradient-to-br from-amber-400 to-orange-500 text-white'
            }`}>
              {userName.charAt(0).toUpperCase()}
            </div>
            <ChevronDown size={14} className={`hidden sm:block transition-transform ${
              showAccountMenu ? 'rotate-180' : ''
            } ${isDark ? 'text-white/50' : 'text-slate-400'}`} />
          </motion.button>
          
          {/* Account Dropdown */}
          <AnimatePresence>
            {showAccountMenu && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowAccountMenu(false)}
                  className="fixed inset-0 z-40"
                />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className={`absolute right-0 top-12 w-56 rounded-2xl shadow-2xl overflow-hidden z-50 ${
                    isDark 
                      ? 'bg-[#0d1525]/95 backdrop-blur-2xl border border-white/10' 
                      : 'bg-white border border-slate-200'
                  }`}
                >
                  {/* Profile Section */}
                  <div className={`p-4 border-b ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                        isCustomer 
                          ? 'bg-gradient-to-br from-sky-400 to-blue-500 text-white' 
                          : 'bg-gradient-to-br from-amber-400 to-orange-500 text-white'
                      }`}>
                        {userName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                          {userName}
                        </p>
                        <div className="flex items-center gap-1">
                          {isCustomer ? (
                            <Home size={12} className={isDark ? 'text-blue-400' : 'text-sky-500'} />
                          ) : (
                            <HardHat size={12} className={isDark ? 'text-amber-400' : 'text-amber-500'} />
                          )}
                          <p className={`text-xs ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                            {isCustomer ? 'Huiseigenaar' : 'Aannemer'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Menu Items */}
                  <div className="p-2">
                    <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                      isDark 
                        ? 'hover:bg-white/10 text-white/70 hover:text-white' 
                        : 'hover:bg-slate-100 text-slate-600 hover:text-slate-800'
                    }`}>
                      <User size={16} />
                      <span>Profiel</span>
                    </button>
                    <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                      isDark 
                        ? 'hover:bg-white/10 text-white/70 hover:text-white' 
                        : 'hover:bg-slate-100 text-slate-600 hover:text-slate-800'
                    }`}>
                      <Settings2 size={16} />
                      <span>Instellingen</span>
                    </button>
                  </div>
                  
                  {/* Logout */}
                  <div className={`p-2 border-t ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
                    <button 
                      onClick={handleLogout}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                        isDark 
                          ? 'hover:bg-rose-500/10 text-rose-400' 
                          : 'hover:bg-rose-50 text-rose-600'
                      }`}
                    >
                      <LogOut size={16} />
                      <span>Uitloggen</span>
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
    </div>
  );
};

export default DashboardHeader;

