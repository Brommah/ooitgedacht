/**
 * ActionPopup - Full-screen modal for customer action selections
 * 
 * Displays options with images for decisions like:
 * - Dakpannen (roof tiles)
 * - Keukenontwerp (kitchen design)
 * - Badkamer (bathroom)
 * - Vloeren (flooring)
 * - Kozijnen (window frames)
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Check, 
  ChevronLeft,
  Sparkles,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Portal } from './Portal';

export interface ActionOption {
  id: string;
  name: string;
  description: string;
  image: string;
  price?: string;
  popular?: boolean;
}

export interface ActionPopupConfig {
  id: string;
  title: string;
  subtitle: string;
  deadline?: string;
  options: ActionOption[];
}

// Predefined action configurations
export const ACTION_CONFIGS: Record<string, ActionPopupConfig> = {
  dakpannen: {
    id: 'dakpannen',
    title: 'Kies je dakpannen',
    subtitle: 'Selecteer de dakpannen die bij jouw stijl passen',
    deadline: '10 dec',
    options: [
      {
        id: 'ceramic-antraciet',
        name: 'Keramisch Antraciet',
        description: 'Tijdloze donkergrijze keramische dakpan met matte afwerking',
        image: '/generated/actions/dakpannen-ceramic-antraciet.png',
        price: 'Inbegrepen',
        popular: true,
      },
      {
        id: 'ceramic-rood',
        name: 'Keramisch Klassiek Rood',
        description: 'Traditionele rode keramische dakpan, warm en authentiek',
        image: '/generated/actions/dakpannen-ceramic-rood.png',
        price: 'Inbegrepen',
      },
      {
        id: 'beton-zwart',
        name: 'Beton Zwart Mat',
        description: 'Moderne zwarte betonnen dakpan, strak en eigentijds',
        image: '/generated/actions/dakpannen-beton-zwart.png',
        price: '+€1.200',
      },
    ],
  },
  keuken: {
    id: 'keuken',
    title: 'Keukenontwerp goedkeuren',
    subtitle: 'Bekijk en keur het definitieve ontwerp goed',
    deadline: '15 dec',
    options: [
      {
        id: 'modern-wit',
        name: 'Modern Wit',
        description: 'Strakke witte keuken met composiet werkblad en inbouwapparatuur',
        image: '/generated/actions/keuken-modern-wit.png',
        price: 'Basis pakket',
        popular: true,
      },
      {
        id: 'hout-naturel',
        name: 'Warm Hout Naturel',
        description: 'Natuurlijke eiken fronten met marmeren werkblad',
        image: '/generated/actions/keuken-hout-naturel.png',
        price: '+€3.500',
      },
      {
        id: 'industrial-zwart',
        name: 'Industrial Zwart',
        description: 'Zwarte fronten met betonlook werkblad en koperen accenten',
        image: '/generated/actions/keuken-industrial-zwart.png',
        price: '+€2.800',
      },
    ],
  },
  badkamer: {
    id: 'badkamer',
    title: 'Badkamer tegels kiezen',
    subtitle: 'Selecteer de tegels voor je badkamer',
    deadline: '20 dec',
    options: [
      {
        id: 'terrazzo-wit',
        name: 'Terrazzo Wit',
        description: 'Moderne terrazzo look met subtiele kleuraccenten',
        image: '/generated/actions/badkamer-terrazzo-wit.png',
        price: 'Inbegrepen',
        popular: true,
      },
      {
        id: 'marmer-grijs',
        name: 'Marmer Effect Grijs',
        description: 'Luxe marmer look in grijstinten met witte adering',
        image: '/generated/actions/badkamer-marmer-grijs.png',
        price: '+€1.800',
      },
      {
        id: 'betonlook',
        name: 'Betonlook Antraciet',
        description: 'Stoere betonlook tegels voor een industriële sfeer',
        image: '/generated/actions/badkamer-betonlook.png',
        price: '+€950',
      },
    ],
  },
  vloeren: {
    id: 'vloeren',
    title: 'Vloer selecteren',
    subtitle: 'Kies de vloer voor je woonkamer en slaapkamers',
    deadline: '22 dec',
    options: [
      {
        id: 'eiken-naturel',
        name: 'Eiken Naturel',
        description: 'Warme eiken multiplank met natuurlijke uitstraling',
        image: '/generated/actions/vloeren-eiken-naturel.png',
        price: 'Inbegrepen',
        popular: true,
      },
      {
        id: 'visgraat-gerookt',
        name: 'Visgraat Gerookt Eiken',
        description: 'Klassiek visgraatpatroon in donker gerookt eiken',
        image: '/generated/actions/vloeren-visgraat-gerookt.png',
        price: '+€2.200',
      },
      {
        id: 'pvc-lichtgrijs',
        name: 'PVC Lichtgrijs',
        description: 'Onderhoudsarme PVC vloer met houtlook',
        image: '/generated/actions/vloeren-pvc-lichtgrijs.png',
        price: '-€1.500',
      },
    ],
  },
  kozijnen: {
    id: 'kozijnen',
    title: 'Kozijnen kleur kiezen',
    subtitle: 'Selecteer de kleur voor je ramen en deuren',
    deadline: '18 dec',
    options: [
      {
        id: 'antraciet-7016',
        name: 'Antraciet RAL 7016',
        description: 'Populaire donkergrijze kleur, modern en tijdloos',
        image: '/generated/actions/kozijnen-antraciet.png',
        price: 'Inbegrepen',
        popular: true,
      },
      {
        id: 'zwart-9005',
        name: 'Zwart RAL 9005',
        description: 'Diep zwart voor een strakke uitstraling',
        image: '/generated/actions/kozijnen-zwart.png',
        price: 'Inbegrepen',
      },
      {
        id: 'cremewit-9001',
        name: 'Crèmewit RAL 9001',
        description: 'Warme witte tint, klassiek en tijdloos',
        image: '/generated/actions/kozijnen-cremewit.png',
        price: 'Inbegrepen',
      },
    ],
  },
};

interface ActionPopupProps {
  actionId: string | null;
  onClose: () => void;
  onSelect: (actionId: string, optionId: string) => void;
}

export const ActionPopup: React.FC<ActionPopupProps> = ({
  actionId,
  onClose,
  onSelect,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  const config = actionId ? ACTION_CONFIGS[actionId] : null;
  
  if (!config) return null;

  const handleConfirm = () => {
    if (selectedOption) {
      onSelect(config.id, selectedOption);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {actionId && (
        <Portal>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />
          
          {/* Modal - Full screen on mobile, centered card on desktop */}
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={`fixed inset-0 lg:inset-auto lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-[800px] lg:max-h-[85vh] lg:rounded-3xl z-[101] overflow-hidden flex flex-col ${
              isDark 
                ? 'bg-[#0d1525] lg:border lg:border-white/10' 
                : 'bg-white lg:border lg:border-slate-200'
            }`}
          >
            {/* Header - Compact on mobile */}
            <div className={`flex items-center justify-between p-3 lg:p-6 border-b safe-area-top ${
              isDark ? 'border-white/10' : 'border-slate-200'
            }`}>
              <div className="flex items-center gap-2 lg:gap-3 flex-1 min-w-0">
                <button
                  onClick={onClose}
                  className={`p-2 -ml-1 rounded-xl transition-colors flex-shrink-0 ${
                    isDark ? 'hover:bg-white/5' : 'hover:bg-slate-100'
                  }`}
                >
                  <ChevronLeft size={22} className={isDark ? 'text-white/60' : 'text-slate-600'} />
                </button>
                <div className="min-w-0 flex-1">
                  <h2 className={`text-base lg:text-xl font-bold truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    {config.title}
                  </h2>
                  <p className={`text-xs lg:text-sm truncate ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                    {config.subtitle}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 flex-shrink-0">
                {config.deadline && (
                  <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full ${
                    isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-600'
                  }`}>
                    <Clock size={12} />
                    <span className="text-xs font-medium">{config.deadline}</span>
                  </div>
                )}
                <button
                  onClick={onClose}
                  className={`p-2 rounded-xl transition-colors ${
                    isDark ? 'hover:bg-white/5' : 'hover:bg-slate-100'
                  }`}
                >
                  <X size={20} className={isDark ? 'text-white/60' : 'text-slate-600'} />
                </button>
              </div>
            </div>
            
            {/* Mobile deadline banner */}
            {config.deadline && (
              <div className={`sm:hidden flex items-center justify-center gap-1.5 px-3 py-2 ${
                isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-600'
              }`}>
                <Clock size={12} />
                <span className="text-xs font-medium">Deadline: {config.deadline}</span>
              </div>
            )}

            {/* Options Grid - Scrollable */}
            <div className="flex-1 overflow-y-auto p-3 lg:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
                {config.options.map((option, index) => (
                  <motion.button
                    key={option.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedOption(option.id)}
                    className={`relative group text-left rounded-xl lg:rounded-2xl overflow-hidden border-2 transition-all ${
                      selectedOption === option.id
                        ? isDark
                          ? 'border-blue-500 ring-2 ring-blue-500/20'
                          : 'border-sky-500 ring-2 ring-sky-500/20'
                        : isDark
                          ? 'border-white/10 hover:border-white/20'
                          : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {/* Image - smaller on mobile */}
                    <div className="aspect-[16/9] sm:aspect-[4/3] relative overflow-hidden">
                      <img
                        src={option.image}
                        alt={option.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          // Fallback gradient if image doesn't exist
                          (e.target as HTMLImageElement).style.display = 'none';
                          (e.target as HTMLImageElement).parentElement!.classList.add(
                            isDark ? 'bg-gradient-to-br' : 'bg-gradient-to-br',
                            'from-slate-600',
                            'to-slate-800'
                          );
                        }}
                      />
                      
                      {/* Popular badge */}
                      {option.popular && (
                        <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-blue-500 text-white text-xs font-medium">
                          <Sparkles size={10} />
                          Populair
                        </div>
                      )}
                      
                      {/* Selected indicator */}
                      {selectedOption === option.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center"
                        >
                          <Check size={16} className="text-white" />
                        </motion.div>
                      )}
                    </div>

                    {/* Content */}
                    <div className={`p-4 ${isDark ? 'bg-white/[0.02]' : 'bg-slate-50'}`}>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                          {option.name}
                        </h3>
                        {option.price && (
                          <span className={`text-sm font-medium flex-shrink-0 ${
                            option.price.startsWith('+') 
                              ? isDark ? 'text-amber-400' : 'text-amber-600'
                              : option.price.startsWith('-')
                                ? isDark ? 'text-emerald-400' : 'text-emerald-600'
                                : isDark ? 'text-white/60' : 'text-slate-500'
                          }`}>
                            {option.price}
                          </span>
                        )}
                      </div>
                      <p className={`text-sm ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                        {option.description}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Footer - Safe area for mobile */}
            <div className={`p-3 lg:p-6 border-t safe-area-bottom ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <p className={`text-xs lg:text-sm text-center sm:text-left ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
                  {selectedOption 
                    ? `${config.options.find(o => o.id === selectedOption)?.name} geselecteerd`
                    : 'Selecteer een optie'
                  }
                </p>
                <button
                  onClick={handleConfirm}
                  disabled={!selectedOption}
                  className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all w-full sm:w-auto ${
                    selectedOption
                      ? isDark
                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                        : 'bg-sky-500 hover:bg-sky-600 text-white'
                      : isDark
                        ? 'bg-white/5 text-white/30 cursor-not-allowed'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Bevestig keuze
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        </Portal>
      )}
    </AnimatePresence>
  );
};

export default ActionPopup;

