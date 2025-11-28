import React, { useState } from 'react';
import { MoodImage } from '../types';
import { Check, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MoodBoardProps {
  images: MoodImage[];
  onComplete: (tags: string[]) => void;
  initialSwipes?: number;
}

export const MoodBoard: React.FC<MoodBoardProps> = ({ images, onComplete }) => {
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);

  // Show all 8 images in grid layout
  const displayImages = images.slice(0, 8);

  const toggleStyle = (tag: string) => {
    setSelectedStyles(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleContinue = () => {
    if (selectedStyles.length > 0) {
      onComplete(selectedStyles);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1628] text-white relative overflow-hidden">
      {/* Blueprint Grid Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
        <div 
          className="absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.8) 2px, transparent 2px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.8) 2px, transparent 2px)
            `,
            backgroundSize: '200px 200px',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a1628]/50 to-[#0a1628]" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="px-6 lg:px-12 pt-8 lg:pt-12 pb-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto"
          >
            <p className="text-blue-400/60 font-mono text-xs lg:text-sm uppercase tracking-wider mb-2">
              Stap 1 van 3
            </p>
            <h1 className="text-3xl lg:text-5xl font-light tracking-tight text-white mb-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '-0.02em' }}>
              Welke stijl past bij <span className="text-blue-400">jou</span>?
            </h1>
            <p className="text-blue-300/50 lg:text-lg">
              Kies één of meerdere stijlen die je aanspreken
            </p>
          </motion.div>
        </header>

        {/* Bento Grid */}
        <div className="flex-1 px-4 lg:px-12 pb-32">
          <div className="max-w-6xl mx-auto h-full">
            {/* Mobile: 2-column grid */}
            <div className="lg:hidden grid grid-cols-2 gap-3">
              {displayImages.map((img, i) => (
                <BentoCard
                  key={img.id}
                  image={img}
                  isSelected={selectedStyles.includes(img.tag)}
                  onClick={() => toggleStyle(img.tag)}
                  index={i}
                  className="aspect-[4/5]"
                />
              ))}
            </div>

            {/* Desktop: 4-column grid with 8 cards */}
            <div className="hidden lg:grid grid-cols-4 gap-4">
              {displayImages.map((img, i) => (
                <motion.div 
                  key={img.id}
                  className="aspect-[3/4]"
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                >
                  <BentoCard
                    image={img}
                    isSelected={selectedStyles.includes(img.tag)}
                    onClick={() => toggleStyle(img.tag)}
                    index={i}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Fixed CTA */}
        <div className="fixed bottom-0 inset-x-0 p-4 lg:p-8 bg-gradient-to-t from-[#0a1628] via-[#0a1628] to-transparent z-20">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            <AnimatePresence mode="wait">
              {selectedStyles.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center gap-2"
                >
                  <div className="flex -space-x-2">
                    {selectedStyles.slice(0, 3).map((tag, i) => (
                      <div
                        key={tag}
                        className="w-8 h-8 rounded-full bg-blue-400 border-2 border-[#0a1628] flex items-center justify-center text-xs font-medium text-[#0a1628]"
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                  <span className="text-blue-300/60 text-sm">
                    {selectedStyles.length} {selectedStyles.length === 1 ? 'stijl' : 'stijlen'} gekozen
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button 
              whileHover={selectedStyles.length > 0 ? { scale: 1.02 } : {}}
              whileTap={selectedStyles.length > 0 ? { scale: 0.98 } : {}}
              onClick={handleContinue}
              disabled={selectedStyles.length === 0}
              className={`ml-auto py-4 px-8 lg:px-12 rounded-2xl flex items-center justify-center gap-3 transition-all text-base lg:text-lg font-medium ${
                selectedStyles.length > 0
                  ? 'bg-blue-400 text-[#0a1628] hover:bg-blue-300 shadow-lg shadow-blue-500/30' 
                  : 'bg-blue-500/10 text-blue-400/30 cursor-not-allowed border border-blue-500/10'
              }`}
            >
              <span>Verder</span>
              <ArrowRight size={20} />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface BentoCardProps {
  image: MoodImage;
  isSelected: boolean;
  onClick: () => void;
  index: number;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const BentoCard: React.FC<BentoCardProps> = ({ 
  image, 
  isSelected, 
  onClick, 
  index,
  size = 'medium',
  className = ''
}) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative w-full h-full rounded-2xl lg:rounded-3xl overflow-hidden group cursor-pointer ${className}`}
    >
      {/* Image */}
      <img 
        src={image.src} 
        alt={image.tag} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Gradient overlay */}
      <div className={`absolute inset-0 transition-all duration-300 ${
        isSelected 
          ? 'bg-gradient-to-t from-blue-900/90 via-blue-900/40 to-blue-400/20' 
          : 'bg-gradient-to-t from-[#0a1628]/90 via-[#0a1628]/30 to-transparent'
      }`} />

      {/* Selection indicator */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute top-3 right-3 lg:top-4 lg:right-4 w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-blue-400 flex items-center justify-center"
          >
            <Check size={size === 'large' ? 24 : 18} className="text-[#0a1628]" strokeWidth={3} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
        <motion.div
          animate={{ y: isSelected ? -4 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-1">
            {isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <Sparkles size={14} className="text-blue-400" />
              </motion.div>
            )}
            <h3 className={`font-medium tracking-tight ${
              size === 'large' ? 'text-xl lg:text-2xl' : 'text-base lg:text-lg'
            } ${isSelected ? 'text-blue-100' : 'text-white'}`}>
              {image.tag}
            </h3>
          </div>
          
          {(size === 'large' || isSelected) && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-blue-200/60 text-sm line-clamp-2 ${size === 'large' ? 'lg:text-base' : ''}`}
            >
              {image.description}
            </motion.p>
          )}
        </motion.div>
      </div>

      {/* Border when selected */}
      <div className={`absolute inset-0 rounded-2xl lg:rounded-3xl border-2 transition-colors duration-300 pointer-events-none ${
        isSelected ? 'border-blue-400' : 'border-transparent group-hover:border-blue-500/30'
      }`} />
    </motion.button>
  );
};
