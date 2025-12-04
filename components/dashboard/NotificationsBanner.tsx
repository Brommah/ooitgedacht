/**
 * NotificationsBanner - Fixed important notifications at top of dashboard
 * 
 * Critical alerts that should always be visible and not movable/hideable.
 * Supports multiple notification types with priority ordering.
 */
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CloudRain, 
  AlertTriangle, 
  Bell, 
  X, 
  Calendar,
  CheckCircle,
  Info,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { ViewMode } from './types';

/** Notification priority levels */
type NotificationPriority = 'critical' | 'warning' | 'info' | 'success';

/** Notification type definition */
interface Notification {
  id: string;
  type: NotificationPriority;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  dismissable?: boolean;
  viewMode?: ViewMode | 'both';
  expiresAt?: Date;
}

interface NotificationsBannerProps {
  viewMode: ViewMode;
  className?: string;
}

/**
 * Get styling config based on notification priority
 */
const getNotificationStyle = (type: NotificationPriority, isDark: boolean) => {
  const styles = {
    critical: {
      bg: isDark ? 'bg-red-500/15' : 'bg-red-50',
      border: isDark ? 'border-red-500/40' : 'border-red-300',
      text: isDark ? 'text-red-200' : 'text-red-800',
      icon: isDark ? 'text-red-400' : 'text-red-600',
      button: isDark 
        ? 'bg-red-500 hover:bg-red-400 text-white' 
        : 'bg-red-500 hover:bg-red-600 text-white',
      Icon: AlertTriangle,
    },
    warning: {
      bg: isDark ? 'bg-amber-500/15' : 'bg-amber-50',
      border: isDark ? 'border-amber-500/40' : 'border-amber-300',
      text: isDark ? 'text-amber-200' : 'text-amber-800',
      icon: isDark ? 'text-amber-400' : 'text-amber-600',
      button: isDark 
        ? 'bg-amber-500 hover:bg-amber-400 text-black font-bold' 
        : 'bg-amber-500 hover:bg-amber-600 text-white font-bold',
      Icon: CloudRain,
    },
    info: {
      bg: isDark ? 'bg-blue-500/15' : 'bg-blue-50',
      border: isDark ? 'border-blue-500/40' : 'border-blue-300',
      text: isDark ? 'text-blue-200' : 'text-blue-800',
      icon: isDark ? 'text-blue-400' : 'text-blue-600',
      button: isDark 
        ? 'bg-blue-500 hover:bg-blue-400 text-white' 
        : 'bg-blue-500 hover:bg-blue-600 text-white',
      Icon: Info,
    },
    success: {
      bg: isDark ? 'bg-emerald-500/15' : 'bg-emerald-50',
      border: isDark ? 'border-emerald-500/40' : 'border-emerald-300',
      text: isDark ? 'text-emerald-200' : 'text-emerald-800',
      icon: isDark ? 'text-emerald-400' : 'text-emerald-600',
      button: isDark 
        ? 'bg-emerald-500 hover:bg-emerald-400 text-white' 
        : 'bg-emerald-500 hover:bg-emerald-600 text-white',
      Icon: CheckCircle,
    },
  };
  return styles[type];
};

/**
 * Priority order for sorting notifications (lower = higher priority)
 */
const PRIORITY_ORDER: Record<NotificationPriority, number> = {
  critical: 0,
  warning: 1,
  info: 2,
  success: 3,
};

/**
 * Example notifications - in production these would come from an API/state
 */
const getNotifications = (viewMode: ViewMode): Notification[] => {
  const now = new Date();
  
  const allNotifications: Notification[] = [
    // Weather alert - builder only
    {
      id: 'weather-friday',
      type: 'warning',
      title: 'Vrijdag: Zware regen - niet storten!',
      actionLabel: 'Aanpassen',
      onAction: () => console.log('Open planning'),
      dismissable: true,
      viewMode: 'builder',
    },
    // Example critical notification - both views
    // Uncomment to test:
    // {
    //   id: 'permit-expiring',
    //   type: 'critical',
    //   title: 'Vergunning verloopt over 3 dagen',
    //   message: 'Upload de verlengingsaanvraag voor woensdag',
    //   actionLabel: 'Uploaden',
    //   onAction: () => console.log('Open upload'),
    //   dismissable: false,
    //   viewMode: 'both',
    // },
    // Example customer notification
    // {
    //   id: 'decision-needed',
    //   type: 'info',
    //   title: 'Keuze nodig: Keukenblad materiaal',
    //   message: 'Deadline: vrijdag 15 december',
    //   actionLabel: 'Bekijken',
    //   dismissable: true,
    //   viewMode: 'customer',
    // },
  ];
  
  // Filter by viewMode and remove expired
  return allNotifications.filter(n => {
    const matchesViewMode = n.viewMode === 'both' || n.viewMode === viewMode;
    const notExpired = !n.expiresAt || n.expiresAt > now;
    return matchesViewMode && notExpired;
  });
};

export const NotificationsBanner: React.FC<NotificationsBannerProps> = ({
  viewMode,
  className = '',
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Track dismissed notifications
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  
  // Get and filter notifications
  const notifications = useMemo(() => {
    const all = getNotifications(viewMode);
    return all
      .filter(n => !dismissedIds.has(n.id))
      .sort((a, b) => PRIORITY_ORDER[a.type] - PRIORITY_ORDER[b.type]);
  }, [viewMode, dismissedIds]);
  
  const handleDismiss = (id: string) => {
    setDismissedIds(prev => new Set([...prev, id]));
  };
  
  if (notifications.length === 0) {
    return null;
  }
  
  return (
    <div className={`space-y-2 ${className}`}>
      <AnimatePresence mode="popLayout">
        {notifications.map((notification, index) => {
          const style = getNotificationStyle(notification.type, isDark);
          const IconComponent = style.Icon;
          
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ 
                duration: 0.2, 
                delay: index * 0.05,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <div 
                className={`
                  flex items-center gap-3 p-3 rounded-xl border
                  ${style.bg} ${style.border}
                `}
              >
                {/* Icon */}
                <IconComponent 
                  size={20} 
                  className={`${style.icon} flex-shrink-0`} 
                />
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${style.text}`}>
                    {notification.title}
                  </p>
                  {notification.message && (
                    <p className={`text-xs mt-0.5 opacity-75 ${style.text}`}>
                      {notification.message}
                    </p>
                  )}
                </div>
                
                {/* Action Button */}
                {notification.actionLabel && (
                  <button 
                    onClick={notification.onAction}
                    className={`
                      px-3 py-1.5 text-xs font-bold rounded-lg 
                      flex-shrink-0 transition-colors
                      ${style.button}
                    `}
                  >
                    {notification.actionLabel}
                  </button>
                )}
                
                {/* Dismiss Button */}
                {notification.dismissable !== false && (
                  <button 
                    onClick={() => handleDismiss(notification.id)}
                    className={`
                      p-1 rounded-md flex-shrink-0 
                      opacity-50 hover:opacity-100 transition-opacity
                      ${style.text}
                    `}
                    aria-label="Sluiten"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default NotificationsBanner;

