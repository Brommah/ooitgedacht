import React from 'react';
import { Home, BarChart3, FileText, Hammer } from 'lucide-react';
import { AppState } from '../../types';
import { PrimaryButton } from '../PrimaryButton';
import { LanguageToggle } from '../LanguageToggle';
import { useTranslation } from '../../i18n';

interface NavigationProps {
  isScrolled: boolean;
  scrollProgress: number;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  setMobileMenuMounted: (mounted: boolean) => void;
  setAppState: (state: AppState) => void;
}

/**
 * Main navigation component with scroll effects
 */
export const Navigation: React.FC<NavigationProps> = ({
  isScrolled,
  scrollProgress,
  mobileMenuOpen,
  setMobileMenuOpen,
  setMobileMenuMounted,
  setAppState,
}) => {
  const { t } = useTranslation();

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled ? 'py-2 md:py-3' : 'py-3 md:py-5'}`}>
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className={`relative flex items-center justify-between px-4 md:px-8 py-2.5 md:py-4 rounded-xl md:rounded-2xl transition-all duration-500 ${
          isScrolled 
            ? 'bg-[#0a1628]/95 backdrop-blur-xl shadow-2xl shadow-[#0a1628]/40 border border-[#1e3a5f]/30' 
            : 'bg-white/[0.03] backdrop-blur-md border border-white/[0.06]'
        }`}>
          
          {/* Progress bar at top of nav */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/[0.05] rounded-t-2xl overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-300 ease-out"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>

          {/* Left: Logo */}
          <a href="#" className="relative group z-10 flex items-center">
            <div className="relative w-10 h-10 md:w-11 md:h-11 flex items-center justify-center">
              <img 
                src="/generated/og-logo.png" 
                alt="Ooit Gedacht" 
                className="w-full h-full object-contain brightness-0 invert"
              />
            </div>
          </a>
          
          {/* Center: Navigation Links */}
          <div className="hidden md:flex items-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="flex items-center bg-white/[0.04] rounded-full px-2 py-1.5 border border-white/[0.06]">
              <button 
                onClick={() => setAppState(AppState.DASHBOARD)}
                className="relative px-4 md:px-5 py-2 text-[12px] md:text-[13px] text-white/70 hover:text-white transition-all duration-300 rounded-full hover:bg-white/[0.08] group"
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  <Home size={14} />
                  <span className="hidden lg:inline">{t('nav.overview')}</span>
                </span>
              </button>
              <button 
                onClick={() => setAppState(AppState.STATE_OF_MARKET)}
                className="relative px-4 md:px-5 py-2 text-[12px] md:text-[13px] text-white/70 hover:text-white transition-all duration-300 rounded-full hover:bg-white/[0.08] group"
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  <BarChart3 size={14} />
                  <span className="hidden lg:inline">{t('nav.market')}</span>
                </span>
              </button>
              <button 
                onClick={() => setAppState(AppState.INVESTOR_PITCH)}
                className="relative px-4 md:px-5 py-2 text-[12px] md:text-[13px] text-white/70 hover:text-white transition-all duration-300 rounded-full hover:bg-white/[0.08] group"
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  <FileText size={14} />
                  <span className="hidden lg:inline">{t('nav.presentation')}</span>
                </span>
              </button>
              <button 
                onClick={() => setAppState(AppState.B2B_BUILDERS)}
                className="relative px-4 md:px-5 py-2 text-[12px] md:text-[13px] text-white/70 hover:text-white transition-all duration-300 rounded-full hover:bg-white/[0.08] group bg-amber-500/10 border border-amber-500/20"
              >
                <span className="relative z-10 flex items-center gap-1.5 text-amber-400">
                  <Hammer size={14} />
                  <span className="hidden xl:inline">{t('nav.forBuilders')}</span>
                  <span className="xl:hidden">{t('nav.b2b')}</span>
                </span>
              </button>
            </div>
          </div>

          {/* Right: CTA + Mobile Menu */}
          <div className="flex items-center gap-3 z-10">
            {/* Language Toggle */}
            <LanguageToggle variant="pill" />
            
            {/* Desktop CTA */}
            <PrimaryButton 
              onClick={() => setAppState(AppState.WIZARD_STEP_TYPE)}
              size="sm"
              className="hidden md:flex"
            >
              {t('nav.startBuilding')}
            </PrimaryButton>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => {
                setMobileMenuMounted(true);
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="lg:hidden flex items-center justify-center w-11 h-11 rounded-2xl bg-white/[0.08] border border-white/[0.15] hover:bg-white/[0.15] transition-all duration-300 backdrop-blur-sm"
            >
              <div className="relative w-5 h-5 flex flex-col items-center justify-center">
                <span className={`absolute w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${mobileMenuOpen ? 'rotate-45' : '-translate-y-1.5'}`} />
                <span className={`absolute w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
                <span className={`absolute w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${mobileMenuOpen ? '-rotate-45' : 'translate-y-1.5'}`} />
              </div>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};




