/**
 * DesktopSidebar - Role-aware navigation sidebar
 * 
 * Differentiates between:
 * - Customer: Focus on home, decisions, documents
 * - Builder: Focus on tasks, Wkb compliance, technical dossier
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  LayoutDashboard, 
  Building2, 
  FolderOpen, 
  MessageSquare, 
  LogOut,
  ClipboardCheck,
  FileText,
  Sparkles,
  HardHat,
  Shield,
} from 'lucide-react';
import { 
  TabType, 
  OverallProgress, 
  ViewMode,
  CustomerProfile,
  BuilderProfile,
  DEFAULT_CUSTOMER_PROFILE,
  DEFAULT_BUILDER_PROFILE,
} from './types';
import { ViewModeToggle } from './ViewModeToggle';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '../../context/ThemeContext';

interface NavItem {
  id: TabType;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}

interface DesktopSidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  projectName: string;
  locationName: string;
  overallProgress: OverallProgress;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  customerProfile?: CustomerProfile;
  builderProfile?: BuilderProfile;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  projectName, 
  locationName, 
  overallProgress,
  viewMode,
  onViewModeChange,
  customerProfile = DEFAULT_CUSTOMER_PROFILE,
  builderProfile = DEFAULT_BUILDER_PROFILE,
}) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isCustomer = viewMode === 'customer';

  const handleLogout = () => {
    navigate('/');
  };
  
  // Role-specific accent colors
  const accentBg = isCustomer 
    ? isDark 
      ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
      : 'bg-sky-100 text-sky-700 border border-sky-200'
    : isDark
      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
      : 'bg-amber-50 text-amber-700 border border-amber-200';
  const accentGradient = isCustomer
    ? 'from-sky-500 to-sky-400'
    : 'from-amber-500 to-orange-500';
  
  // Role-specific navigation items
  const customerNavItems: NavItem[] = [
    { id: 'overview', icon: <LayoutDashboard size={20} />, label: 'Overzicht' },
    { id: 'passport', icon: <Building2 size={20} />, label: 'Woningpaspoort' },
    { id: 'docs', icon: <FolderOpen size={20} />, label: 'Documenten' },
    { id: 'chat', icon: <MessageSquare size={20} />, label: 'Chat', badge: 3 },
  ];

  const builderNavItems: NavItem[] = [
    { id: 'overview', icon: <LayoutDashboard size={20} />, label: 'Project Dashboard' },
    { id: 'passport', icon: <ClipboardCheck size={20} />, label: 'Taken & Wkb', badge: 4 },
    { id: 'docs', icon: <FileText size={20} />, label: 'Technisch Dossier' },
    { id: 'chat', icon: <MessageSquare size={20} />, label: 'Team Chat', badge: 5 },
  ];

  const navItems = isCustomer ? customerNavItems : builderNavItems;
  const profile = isCustomer ? customerProfile : builderProfile;

  return (
    <aside className={`desktop-sidebar hidden lg:flex flex-col w-64 border-r h-screen sticky top-0 overflow-y-auto ${
      isDark 
        ? 'bg-[#0d1525] border-white/5' 
        : 'bg-white border-slate-200'
    }`}>
      {/* Logo & Project Header */}
      <div className={`p-6 border-b ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${accentGradient} flex items-center justify-center`}>
            {isCustomer ? (
              <Home size={20} className="text-white" />
            ) : (
              <HardHat size={20} className="text-white" />
            )}
          </div>
          <div>
            <h1 className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>{projectName}</h1>
            {isCustomer ? (
              <p className={`text-xs ${isDark ? 'text-white/40' : 'text-slate-500'}`}>{locationName}</p>
            ) : (
              <p className={`text-xs font-mono ${isDark ? 'text-white/40' : 'text-slate-500'}`}>Project #2024-087</p>
            )}
          </div>
        </div>

        {/* Theme & View Mode Toggles */}
        <div className="mt-4 space-y-3">
          <div>
            <p className={`text-[10px] uppercase tracking-wider mb-2 ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Thema</p>
            <ThemeToggle />
          </div>
          <div>
            <p className={`text-[10px] uppercase tracking-wider mb-2 ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Weergave</p>
            <ViewModeToggle 
              viewMode={viewMode} 
              onViewModeChange={onViewModeChange}
            />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? accentBg 
                    : isDark 
                      ? 'text-white/60 hover:bg-white/5' 
                      : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="relative">
                  {item.icon}
                  {item.badge && (
                    <span className={`absolute -top-1 -right-1 w-4 h-4 ${isCustomer ? 'bg-rose-500' : 'bg-amber-500'} text-white text-[9px] font-bold rounded-full flex items-center justify-center`}>
                      {item.badge}
                    </span>
                  )}
                </span>
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Status badges & User Profile */}
      <div className={`p-4 border-t ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
        {/* Wkb Status Badge */}
        <div className="flex items-center gap-2 mb-4">
          {isCustomer ? (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
              isDark 
                ? 'bg-emerald-500/10 border border-emerald-500/20' 
                : 'bg-emerald-50 border border-emerald-200'
            }`}>
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className={`text-xs font-medium ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>Wkb Compliant</span>
            </div>
          ) : (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
              isDark 
                ? 'bg-amber-500/10 border border-amber-500/20' 
                : 'bg-amber-50 border border-amber-200'
            }`}>
              <Shield size={12} className={isDark ? 'text-amber-400' : 'text-amber-600'} />
              <span className={`text-xs font-medium ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>12/24 Wkb punten</span>
            </div>
          )}
        </div>
        
        {/* User Profile - Different display per role */}
        <div className={`flex items-center gap-3 p-3 rounded-xl ${
          isCustomer 
            ? isDark ? 'bg-white/5' : 'bg-slate-50 border border-slate-200' 
            : isDark ? 'bg-amber-500/5 border border-amber-500/10' : 'bg-amber-50 border border-amber-200'
        }`}>
          <div className={`w-9 h-9 rounded-full ${isCustomer ? 'bg-sky-500' : 'bg-amber-500'} flex items-center justify-center text-white text-sm font-bold`}>
            {profile.initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{profile.name}</p>
            {isCustomer ? (
              <p className={`text-xs ${isDark ? 'text-white/40' : 'text-slate-600'}`}>{customerProfile.role}</p>
            ) : (
              <div className="flex items-center gap-1">
                <Sparkles size={10} className={isDark ? 'text-amber-400' : 'text-amber-500'} />
                <p className={`text-xs truncate ${isDark ? 'text-amber-400/70' : 'text-amber-700'}`}>{builderProfile.companyName}</p>
              </div>
            )}
          </div>
          <button 
            onClick={handleLogout}
            className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-100'}`}
            title="Terug naar homepage"
          >
            <LogOut size={16} className={isDark ? 'text-white/40' : 'text-slate-500'} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default DesktopSidebar;
