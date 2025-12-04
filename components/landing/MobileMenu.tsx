import React from 'react';
import { AppState } from '../../types';
import { useTranslation } from '../../i18n';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  setAppState: (state: AppState) => void;
}

/**
 * Mobile menu overlay component
 */
export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  setAppState,
}) => {
  const { t } = useTranslation();

  const menuItems = [
    { 
      label: t('nav.overview'),
      onClick: () => {
        setAppState(AppState.DASHBOARD);
        onClose();
      }
    },
    { 
      label: t('nav.forBuilders'),
      onClick: () => {
        setAppState(AppState.B2B_BUILDERS);
        onClose();
      }
    },
    { 
      label: t('hero.marketAnalysis'),
      onClick: () => {
        setAppState(AppState.STATE_OF_MARKET);
        onClose();
      }
    },
    { 
      label: t('nav.presentation'),
      onClick: () => {
        setAppState(AppState.INVESTOR_PITCH);
        onClose();
      }
    },
  ];

  return (
    <div 
      className={`fixed inset-0 z-[100] lg:hidden transition-all duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
    >
      {/* Clean backdrop with blur */}
      <div 
        className="absolute inset-0 bg-[#2a2f3d]/95 backdrop-blur-2xl"
        onClick={onClose}
      />
      
      {/* Menu Content */}
      <div className={`relative h-full flex flex-col transition-all duration-300 ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
        
        {/* Header - Logo & Close */}
        <div className="flex items-center justify-between px-6 py-6">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 flex items-center justify-center">
              <img 
                src="/generated/og-logo.png" 
                alt="Ooit Gedacht" 
                className="w-full h-full object-contain brightness-0 invert"
              />
            </div>
            <span className="text-white/90 font-semibold text-base tracking-wide">OOIT GEDACHT</span>
          </div>
          
          {/* Close button */}
          <button 
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            aria-label="Sluit menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-white/60">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Navigation Links */}
        <nav className="flex-1 px-6 pt-6">
          <ul className="space-y-0">
            {menuItems.map((item, i) => (
              <li key={i}>
                <button 
                  onClick={item.onClick}
                  className="group w-full flex items-center justify-between py-5 border-b border-white/[0.08] transition-colors"
                >
                  <span className="text-white/80 text-[17px] font-medium group-hover:text-white transition-colors">
                    {item.label}
                  </span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/30 group-hover:text-white/50 transition-colors">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Bottom CTA */}
        <div className="px-6 pb-10 pt-6 mt-auto">
          <button 
            onClick={() => {
              setAppState(AppState.WIZARD_STEP_TYPE);
              onClose();
            }}
            className="w-full py-4 px-6 bg-white text-[#1a1f2e] font-semibold text-[15px] rounded-full hover:bg-white/95 active:scale-[0.98] transition-all duration-200"
          >
            {t('hero.startDreamHome')}
          </button>
        </div>
      </div>
    </div>
  );
};




