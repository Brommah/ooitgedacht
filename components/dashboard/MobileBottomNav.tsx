import React from 'react';
import { LayoutDashboard, Building2, FolderOpen, MessageSquare } from 'lucide-react';
import { TabType } from './types';
import { TabButton } from './shared/TabButton';
import { useTheme } from '../../context/ThemeContext';

interface MobileBottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeTab, setActiveTab }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <nav className={`mobile-bottom-nav lg:hidden fixed bottom-0 inset-x-0 z-50 backdrop-blur-xl border-t transition-colors ${
      isDark 
        ? 'bg-[#0a1628]/95 border-white/5' 
        : 'bg-white/95 border-sky-100'
    }`}>
      <div className="flex items-center justify-around py-2 px-4 max-w-lg mx-auto">
        <TabButton 
          icon={<LayoutDashboard size={20} />} 
          label="Overzicht" 
          active={activeTab === 'overview'} 
          onClick={() => setActiveTab('overview')} 
        />
        <TabButton 
          icon={<Building2 size={20} />} 
          label="Paspoort" 
          active={activeTab === 'passport'} 
          onClick={() => setActiveTab('passport')}
        />
        <TabButton 
          icon={<FolderOpen size={20} />} 
          label="Dossier" 
          active={activeTab === 'docs'} 
          onClick={() => setActiveTab('docs')} 
        />
        <TabButton 
          icon={<MessageSquare size={20} />} 
          label="Chat" 
          active={activeTab === 'chat'} 
          onClick={() => setActiveTab('chat')}
          badge={3}
        />
      </div>
    </nav>
  );
};
