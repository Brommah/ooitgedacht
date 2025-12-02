import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Search, Check } from 'lucide-react';
import { WizardLayout } from '../WizardLayout';
import { POPULAR_LOCATIONS } from '../../../constants';
import { useTranslation } from '../../../i18n';

interface WizardStepLocationProps {
  initialValue: string;
  onNext: (value: string) => void;
  onBack: () => void;
}

/**
 * Step 5: Location search/selection
 */
export const WizardStepLocation: React.FC<WizardStepLocationProps> = ({
  initialValue,
  onNext,
  onBack,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>(initialValue);
  const { t } = useTranslation();

  const handleNext = () => {
    if (searchQuery.trim()) {
      onNext(searchQuery);
    }
  };

  const handleLocationSelect = (location: string) => {
    setSearchQuery(location);
  };

  const canProceed = searchQuery.trim().length > 0;

  return (
    <WizardLayout
      step={5}
      title={t('wizard.step5.title')}
      subtitle={t('wizard.step5.subtitle')}
      icon={<MapPin size={22} />}
      onBack={onBack}
      onNext={handleNext}
      nextDisabled={!canProceed}
    >
      {/* Search Input */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder={t('wizard.step5.placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 focus:border-blue-500/50 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/30 outline-none transition-colors font-mono"
          />
        </div>
      </motion.div>

      {/* Popular Locations */}
      <div>
        <p className="text-xs text-white/40 font-mono uppercase tracking-wider mb-3">
          {t('wizard.step5.popularLocations')}
        </p>
        <div className="grid grid-cols-2 gap-2">
          {POPULAR_LOCATIONS.slice(0, 6).map((location, index) => {
            const fullName = `${location.name}, ${location.region}`;
            const isSelected = searchQuery === fullName;
            
            return (
              <motion.button
                key={location.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                onClick={() => handleLocationSelect(fullName)}
                className={`relative rounded-xl overflow-hidden group transition-all ${
                  isSelected
                    ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-[#0a1628]'
                    : 'hover:ring-1 hover:ring-white/20'
                }`}
              >
                {/* Background Image */}
                <div className="aspect-[3/2] relative">
                  <img
                    src={location.image}
                    alt={location.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 transition-all duration-300 ${
                    isSelected
                      ? 'bg-gradient-to-t from-blue-900/90 via-blue-900/50 to-blue-500/20'
                      : 'bg-gradient-to-t from-[#0a1628]/90 via-[#0a1628]/40 to-transparent'
                  }`} />
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={12} className={isSelected ? 'text-blue-300' : 'text-white/50'} />
                      <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-white/90'}`}>
                        {location.name}
                      </span>
                    </div>
                    <div className={`text-xs font-mono mt-0.5 ${isSelected ? 'text-blue-200' : 'text-white/40'}`}>
                      ~€{location.avgLandPrice}/m²
                    </div>
                  </div>

                  {/* Selection indicator */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2 w-5 h-5 bg-blue-400 rounded-full flex items-center justify-center"
                    >
                      <Check size={12} className="text-[#0a1628]" strokeWidth={3} />
                    </motion.div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </WizardLayout>
  );
};

