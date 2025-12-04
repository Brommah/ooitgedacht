/**
 * InteractiveTimeline - Premium Visual Project Timeline
 * 
 * Features:
 * - Stunning animated progress bar with gradient glow
 * - Staggered milestone animations
 * - Parallax hover effects
 * - Pulsing current phase indicator
 * - Beautiful glassmorphism design
 */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  Camera,
  Calendar,
  FileText,
  ChevronLeft,
  ChevronRight,
  Shovel,
  Home,
  Hammer,
  Zap,
  PaintBucket,
  Key,
  Sparkles
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Portal } from './Portal';

interface MilestonePhoto {
  id: string;
  url: string;
  caption: string;
  date: string;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  date: string;
  status: 'completed' | 'current' | 'upcoming';
  icon: React.ReactNode;
  photos: MilestonePhoto[];
  documents?: string[];
}

const MILESTONES: Milestone[] = [
  {
    id: '1',
    title: 'Fundering',
    description: 'Graafwerk en betonnen fundering gestort. Wapening gecontroleerd en goedgekeurd door kwaliteitsborger.',
    date: '15 okt 2024',
    status: 'completed',
    icon: <Shovel size={20} />,
    photos: [
      { id: 'p1', url: '', caption: 'Graafwerk gestart', date: '12 okt' },
      { id: 'p2', url: '', caption: 'Wapening gelegd', date: '14 okt' },
      { id: 'p3', url: '', caption: 'Beton gestort', date: '15 okt' },
    ],
    documents: ['Wapeningskeuring.pdf', 'Betonkwaliteit.pdf'],
  },
  {
    id: '2',
    title: 'Ruwbouw',
    description: 'CLT-elementen geplaatst, dakconstructie en gevelafwerking. Houtskeletbouw volgens planning.',
    date: '28 nov 2024',
    status: 'current',
    icon: <Home size={20} />,
    photos: [
      { id: 'p4', url: '', caption: 'CLT wanden geplaatst', date: '20 nov' },
      { id: 'p5', url: '', caption: 'Dakconstructie', date: '25 nov' },
    ],
    documents: ['Constructieberekening.pdf'],
  },
  {
    id: '3',
    title: 'Dak & Gevel',
    description: 'Dakbedekking, gevelafwerking en kozijnen. Waterdicht maken van de woning.',
    date: '20 dec 2024',
    status: 'upcoming',
    icon: <Hammer size={20} />,
    photos: [],
  },
  {
    id: '4',
    title: 'Installaties',
    description: 'Elektra, leidingwerk, warmtepomp en vloerverwarming. Alle technische installaties.',
    date: '15 jan 2025',
    status: 'upcoming',
    icon: <Zap size={20} />,
    photos: [],
  },
  {
    id: '5',
    title: 'Afbouw',
    description: 'Stucwerk, schilderwerk, keuken en badkamer. De finishing touch aan je woning.',
    date: '28 feb 2025',
    status: 'upcoming',
    icon: <PaintBucket size={20} />,
    photos: [],
  },
  {
    id: '6',
    title: 'Oplevering',
    description: 'Eindkeuring, sleuteloverdracht en welkom in je nieuwe thuis!',
    date: 'Mei 2025',
    status: 'upcoming',
    icon: <Key size={20} />,
    photos: [],
  },
];

// Wireframe placeholder for photos
const PhotoPlaceholder: React.FC<{ caption: string }> = ({ caption }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <div className={`aspect-video rounded-xl flex flex-col items-center justify-center ${
      isDark ? 'bg-white/5 border border-white/10' : 'bg-sky-50 border border-sky-100'
    }`}>
      <Camera size={32} className={isDark ? 'text-white/20' : 'text-sky-300'} />
      <span className={`text-xs mt-2 ${isDark ? 'text-white/30' : 'text-sky-400'}`}>{caption}</span>
    </div>
  );
};

// Milestone Detail Modal
const MilestoneModal: React.FC<{
  milestone: Milestone;
  onClose: () => void;
}> = ({ milestone, onClose }) => {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const statusConfig = {
    completed: { 
      color: isDark ? 'text-emerald-400' : 'text-emerald-600', 
      bg: isDark ? 'bg-emerald-500/20' : 'bg-emerald-100',
      label: 'Voltooid' 
    },
    current: { 
      color: isDark ? 'text-cyan-400' : 'text-sky-600', 
      bg: isDark ? 'bg-cyan-500/20' : 'bg-sky-100',
      label: 'In uitvoering' 
    },
    upcoming: { 
      color: isDark ? 'text-white/50' : 'text-slate-500', 
      bg: isDark ? 'bg-white/10' : 'bg-slate-100',
      label: 'Gepland' 
    },
  };
  
  const status = statusConfig[milestone.status];
  
  return (
    <Portal>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100]"
      />
      
      {/* Modal - Full screen on mobile, centered card on desktop */}
      <motion.div
        initial={{ opacity: 0, y: '100%' }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`fixed inset-0 lg:inset-auto lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-[600px] lg:max-h-[80vh] lg:rounded-3xl z-[101] overflow-hidden shadow-2xl flex flex-col ${
          isDark ? 'bg-[#0d1525] lg:border lg:border-white/10' : 'bg-white'
        }`}
      >
        {/* Header - Compact on mobile */}
        <div className={`p-3 lg:p-6 border-b safe-area-top ${isDark ? 'border-white/10' : 'border-sky-100'}`}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <motion.div 
                className={`w-12 h-12 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl flex items-center justify-center flex-shrink-0 ${status.bg} ${status.color}`}
              >
                {milestone.icon}
              </motion.div>
              <div className="min-w-0 flex-1">
                <h2 className={`text-base lg:text-lg font-bold truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  {milestone.title}
                </h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <Calendar size={12} className={isDark ? 'text-white/40' : 'text-slate-400'} />
                  <span className={`text-xs ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                    {milestone.date}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${status.bg} ${status.color}`}>
                    {status.label}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition-colors flex-shrink-0 ${
                isDark ? 'hover:bg-white/10' : 'hover:bg-sky-50'
              }`}
            >
              <X size={22} className={isDark ? 'text-white/60' : 'text-slate-400'} />
            </button>
          </div>
        </div>
        
        {/* Content - Scrollable */}
        <div className="flex-1 p-3 lg:p-6 overflow-y-auto safe-area-bottom">
          {/* Description */}
          <p className={`text-sm leading-relaxed mb-6 ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
            {milestone.description}
          </p>
          
          {/* Photo Gallery */}
          {milestone.photos.length > 0 ? (
            <div className="mb-6">
              <h3 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${
                isDark ? 'text-white' : 'text-slate-700'
              }`}>
                <Camera size={14} />
                Foto's ({milestone.photos.length})
              </h3>
              
              {/* Main Photo */}
              <div className="relative mb-2">
                <PhotoPlaceholder caption={milestone.photos[activePhotoIndex]?.caption || 'Foto'} />
                
                {/* Navigation */}
                {milestone.photos.length > 1 && (
                  <>
                    <motion.button
                      onClick={() => setActivePhotoIndex(i => Math.max(0, i - 1))}
                      disabled={activePhotoIndex === 0}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all ${
                        activePhotoIndex === 0 
                          ? 'opacity-30' 
                          : isDark ? 'bg-black/50 hover:bg-black/70' : 'bg-white/80 hover:bg-white shadow'
                      }`}
                    >
                      <ChevronLeft size={16} className={isDark ? 'text-white' : 'text-slate-600'} />
                    </motion.button>
                    <motion.button
                      onClick={() => setActivePhotoIndex(i => Math.min(milestone.photos.length - 1, i + 1))}
                      disabled={activePhotoIndex === milestone.photos.length - 1}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all ${
                        activePhotoIndex === milestone.photos.length - 1
                          ? 'opacity-30'
                          : isDark ? 'bg-black/50 hover:bg-black/70' : 'bg-white/80 hover:bg-white shadow'
                      }`}
                    >
                      <ChevronRight size={16} className={isDark ? 'text-white' : 'text-slate-600'} />
                    </motion.button>
                  </>
                )}
              </div>
              
              {/* Thumbnails */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {milestone.photos.map((photo, index) => (
                  <motion.button
                    key={photo.id}
                    onClick={() => setActivePhotoIndex(index)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      index === activePhotoIndex
                        ? isDark ? 'border-cyan-500 shadow-lg shadow-cyan-500/30' : 'border-sky-500'
                        : isDark ? 'border-white/10 hover:border-white/30' : 'border-sky-100 hover:border-sky-200'
                    }`}
                  >
                    <div className={`w-full h-full flex items-center justify-center ${
                      isDark ? 'bg-white/5' : 'bg-sky-50'
                    }`}>
                      <Camera size={14} className={isDark ? 'text-white/30' : 'text-sky-300'} />
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          ) : (
            <div className={`p-6 rounded-2xl text-center mb-6 ${
              isDark ? 'bg-white/5' : 'bg-sky-50'
            }`}>
              <Camera size={24} className={`mx-auto mb-2 ${isDark ? 'text-white/30' : 'text-sky-300'}`} />
              <p className={`text-sm ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                Nog geen foto's voor deze fase
              </p>
            </div>
          )}
          
          {/* Documents */}
          {milestone.documents && milestone.documents.length > 0 && (
            <div>
              <h3 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${
                isDark ? 'text-white' : 'text-slate-700'
              }`}>
                <FileText size={14} />
                Documenten ({milestone.documents.length})
              </h3>
              <div className="space-y-2">
                {milestone.documents.map((doc, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.01, x: 4 }}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left ${
                      isDark 
                        ? 'bg-white/5 hover:bg-white/10' 
                        : 'bg-sky-50 hover:bg-sky-100'
                    }`}
                  >
                    <FileText size={16} className={isDark ? 'text-cyan-400' : 'text-sky-500'} />
                    <span className={`text-sm ${isDark ? 'text-white/80' : 'text-slate-700'}`}>{doc}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </Portal>
  );
};

// Animated Progress Bar Component
const AnimatedProgressBar: React.FC<{ progress: number; isDark: boolean }> = ({ progress, isDark }) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimatedProgress(progress), 100);
    return () => clearTimeout(timer);
  }, [progress]);
  
  return (
    <div className="relative h-2 w-full">
      {/* Background track */}
      <div className={`absolute inset-0 rounded-full overflow-hidden ${
        isDark ? 'bg-white/5' : 'bg-slate-100'
      }`}>
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              transparent,
              transparent 8px,
              ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'} 8px,
              ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'} 9px
            )`
          }}
        />
      </div>
      
      {/* Animated progress fill */}
      <motion.div
        className="absolute top-0 left-0 h-full rounded-full overflow-hidden"
        initial={{ width: 0 }}
        animate={{ width: `${animatedProgress}%` }}
        transition={{ 
          duration: 1.5, 
          delay: 0.3,
          ease: [0.22, 1, 0.36, 1]
        }}
      >
        {/* Gradient fill */}
        <div className={`absolute inset-0 ${
          isDark 
            ? 'bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500'
            : 'bg-gradient-to-r from-emerald-400 via-sky-400 to-blue-500'
        }`} />
        
        {/* Subtle shine effect - no animation to prevent flicker */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          style={{ transform: 'translateX(50%)' }}
        />
        
        {/* Glow effect */}
        <div className={`absolute inset-0 blur-sm ${
          isDark 
            ? 'bg-gradient-to-r from-emerald-500/50 via-cyan-500/50 to-blue-500/50'
            : 'bg-gradient-to-r from-emerald-400/30 via-sky-400/30 to-blue-400/30'
        }`} />
      </motion.div>
      
      {/* Leading edge glow */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full pointer-events-none"
        initial={{ left: 0 }}
        animate={{ left: `calc(${animatedProgress}% - 12px)` }}
        transition={{ 
          duration: 1.5, 
          delay: 0.3,
          ease: [0.22, 1, 0.36, 1]
        }}
        style={{
          background: isDark 
            ? 'radial-gradient(circle, rgba(34,211,238,0.6) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(14,165,233,0.4) 0%, transparent 70%)',
          filter: 'blur(4px)',
        }}
      />
    </div>
  );
};

// Milestone Node Component
const MilestoneNode: React.FC<{
  milestone: Milestone;
  index: number;
  total: number;
  onClick: () => void;
  isDark: boolean;
}> = ({ milestone, index, onClick, isDark }) => {
  const nodeRef = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useTransform(y, [-50, 50], [10, -10]);
  const rotateY = useTransform(x, [-50, 50], [-10, 10]);
  
  const springConfig = { stiffness: 400, damping: 30 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!nodeRef.current) return;
    const rect = nodeRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };
  
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };
  
  const statusConfig = {
    completed: {
      bg: 'bg-gradient-to-br from-emerald-400 to-emerald-600',
      ring: isDark ? 'ring-emerald-500/30' : 'ring-emerald-200',
      shadow: 'shadow-emerald-500/30',
      glow: isDark ? 'bg-emerald-500/20' : 'bg-emerald-100',
    },
    current: {
      bg: 'bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-500',
      ring: isDark ? 'ring-cyan-500/40' : 'ring-sky-300',
      shadow: 'shadow-cyan-500/40',
      glow: isDark ? 'bg-cyan-500/20' : 'bg-sky-100',
    },
    upcoming: {
      bg: isDark ? 'bg-white/10' : 'bg-slate-200',
      ring: isDark ? 'ring-white/10' : 'ring-slate-200',
      shadow: '',
      glow: '',
    },
  };
  
  const status = statusConfig[milestone.status];
  const isCurrent = milestone.status === 'current';
  const isCompleted = milestone.status === 'completed';
  
  return (
    <motion.button
      ref={nodeRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="flex flex-col items-center group relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1]
      }}
      style={{
        perspective: 1000,
      }}
    >
      {/* Glow background for active states - static to prevent flicker */}
      {(isCurrent || isCompleted) && (
        <div
          className={`absolute -top-2 w-20 h-20 rounded-full blur-xl opacity-60 ${status.glow}`}
        />
      )}
      
      {/* Node */}
      <motion.div
        className={`relative w-16 h-16 rounded-2xl flex items-center justify-center ring-4 ${status.bg} ${status.ring} ${status.shadow ? `shadow-xl ${status.shadow}` : ''}`}
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Inner content */}
        <div className="relative z-10">
          {isCompleted ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, delay: index * 0.1 + 0.5 }}
            >
              <CheckCircle2 size={28} className="text-white drop-shadow-lg" />
            </motion.div>
          ) : (
            React.cloneElement(milestone.icon as React.ReactElement, {
              size: 26,
              className: isCurrent ? 'text-white drop-shadow-lg' : isDark ? 'text-white/40' : 'text-slate-400'
            })
          )}
        </div>
        
        {/* Static indicator ring for current */}
        {isCurrent && (
          <div className="absolute -inset-1 rounded-2xl border-2 border-cyan-400/50" />
        )}
      </motion.div>
      
      {/* Label */}
      <motion.div 
        className="mt-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.1 + 0.3 }}
      >
        <p className={`text-sm font-semibold transition-colors ${
          isCurrent
            ? isDark ? 'text-cyan-400' : 'text-sky-600'
            : isCompleted
              ? isDark ? 'text-emerald-400' : 'text-emerald-600'
              : isDark ? 'text-white/40' : 'text-slate-400'
        }`}>
          {milestone.title}
        </p>
        <p className={`text-xs mt-1 ${isDark ? 'text-white/30' : 'text-slate-400'}`}>
          {milestone.date}
        </p>
      </motion.div>
      
      {/* Photo badge */}
      {milestone.photos.length > 0 && (
        <motion.div 
          className={`mt-2 flex items-center gap-1 px-2.5 py-1 rounded-full ${
            isDark ? 'bg-white/10 backdrop-blur-sm' : 'bg-sky-100'
          }`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 + 0.4 }}
          whileHover={{ scale: 1.05 }}
        >
          <Camera size={12} className={isDark ? 'text-white/60' : 'text-sky-500'} />
          <span className={`text-xs font-medium ${isDark ? 'text-white/60' : 'text-sky-600'}`}>
            {milestone.photos.length}
          </span>
        </motion.div>
      )}
    </motion.button>
  );
};

// Carousel Item for all screen sizes
const CarouselItem: React.FC<{
  milestone: Milestone;
  isActive: boolean;
  onClick: () => void;
  isDark: boolean;
}> = ({ milestone, isActive, onClick, isDark }) => {
  const isCompleted = milestone.status === 'completed';
  const isCurrent = milestone.status === 'current';
  
  const statusConfig = {
    completed: {
      bg: 'bg-gradient-to-br from-emerald-400 to-emerald-600',
      textColor: isDark ? 'text-emerald-400' : 'text-emerald-600',
      glow: 'shadow-lg shadow-emerald-500/30',
      ringColor: 'ring-emerald-500/30',
    },
    current: {
      bg: 'bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600',
      textColor: isDark ? 'text-cyan-400' : 'text-sky-600',
      glow: 'shadow-lg shadow-cyan-500/40',
      ringColor: 'ring-cyan-500/40',
    },
    upcoming: {
      bg: isDark ? 'bg-white/10' : 'bg-slate-200',
      textColor: isDark ? 'text-white/40' : 'text-slate-400',
      glow: '',
      ringColor: isDark ? 'ring-white/10' : 'ring-slate-200',
    },
  };
  
  const status = statusConfig[milestone.status];
  
  return (
    <motion.button
      onClick={onClick}
      className="flex-shrink-0 flex flex-col items-center snap-center"
      style={{ width: '100px' }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Node with ring */}
      <div className={`relative transition-all duration-300 ${isActive ? 'scale-110' : 'scale-100'}`}>
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ring-4 ${status.bg} ${status.ringColor} ${
          (isCurrent || isCompleted) && isActive ? status.glow : ''
        }`}>
          {/* Pulse effect for current */}
          {isCurrent && (
            <div className="absolute inset-0 rounded-2xl border-2 border-cyan-400/50 animate-ping" 
                 style={{ animationDuration: '2s' }} />
          )}
          
          {/* Icon */}
          {isCompleted ? (
            <CheckCircle2 size={24} className="text-white drop-shadow" />
          ) : (
            React.cloneElement(milestone.icon as React.ReactElement, {
              size: 22,
              className: isCurrent ? 'text-white drop-shadow' : isDark ? 'text-white/50' : 'text-slate-400'
            })
          )}
        </div>
      </div>
      
      {/* Label */}
      <p className={`mt-2 text-xs font-semibold text-center leading-tight transition-colors ${
        isActive ? status.textColor : isDark ? 'text-white/30' : 'text-slate-400'
      }`}>
        {milestone.title}
      </p>
      <p className={`text-[10px] mt-0.5 transition-opacity ${
        isActive ? (isDark ? 'text-white/50' : 'text-slate-500') : (isDark ? 'text-white/20' : 'text-slate-300')
      }`}>
        {milestone.date}
      </p>
      
      {/* Photo badge */}
      {milestone.photos.length > 0 && (
        <div className={`mt-1.5 flex items-center gap-1 px-1.5 py-0.5 rounded-full transition-opacity ${
          isActive 
            ? (isDark ? 'bg-white/15' : 'bg-sky-100') 
            : (isDark ? 'bg-white/5' : 'bg-slate-100')
        }`}>
          <Camera size={8} className={isActive ? (isDark ? 'text-white/60' : 'text-sky-500') : (isDark ? 'text-white/30' : 'text-slate-400')} />
          <span className={`text-[9px] font-medium ${
            isActive ? (isDark ? 'text-white/60' : 'text-sky-600') : (isDark ? 'text-white/30' : 'text-slate-400')
          }`}>
            {milestone.photos.length}
          </span>
        </div>
      )}
    </motion.button>
  );
};

// Main Timeline Component - Desktop: Horizontal scroll, Mobile: Static grid
export const InteractiveTimeline: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const completedCount = MILESTONES.filter(m => m.status === 'completed').length;
  const currentIndex = MILESTONES.findIndex(m => m.status === 'current');
  const progress = ((completedCount + 0.5) / MILESTONES.length) * 100;
  
  // Initialize active index to current milestone
  useEffect(() => {
    if (activeIndex === -1 && currentIndex >= 0) {
      setActiveIndex(currentIndex);
    }
  }, [currentIndex, activeIndex]);
  
  // Desktop only: Scroll to center on current milestone on mount
  useEffect(() => {
    // Only on desktop (lg breakpoint = 1024px)
    if (window.innerWidth >= 1024 && scrollRef.current && currentIndex >= 0) {
      const itemWidth = 100;
      const containerWidth = scrollRef.current.offsetWidth;
      const scrollPosition = (currentIndex * itemWidth) - (containerWidth / 2) + (itemWidth / 2);
      setTimeout(() => {
        scrollRef.current?.scrollTo({ left: scrollPosition, behavior: 'smooth' });
      }, 100);
    }
  }, [currentIndex]);
  
  // Desktop only: Handle scroll to update active index
  const handleScroll = () => {
    if (scrollRef.current && window.innerWidth >= 1024) {
      const itemWidth = 100;
      const containerWidth = scrollRef.current.offsetWidth;
      const scrollLeft = scrollRef.current.scrollLeft;
      const centerOffset = containerWidth / 2 - itemWidth / 2;
      const newIndex = Math.round((scrollLeft + centerOffset - (containerWidth / 2 - itemWidth / 2)) / itemWidth);
      const clampedIndex = Math.max(0, Math.min(MILESTONES.length - 1, newIndex));
      if (clampedIndex !== activeIndex) {
        setActiveIndex(clampedIndex);
      }
    }
  };
  
  // Desktop only: Scroll to specific index
  const scrollToIndex = (index: number) => {
    if (scrollRef.current && window.innerWidth >= 1024) {
      const itemWidth = 100;
      const containerWidth = scrollRef.current.offsetWidth;
      const scrollPosition = (index * itemWidth) - (containerWidth / 2) + (itemWidth / 2);
      scrollRef.current.scrollTo({ left: scrollPosition, behavior: 'smooth' });
      setActiveIndex(index);
    }
  };
  
  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
            Project Timeline
          </h3>
            <Sparkles size={12} className={isDark ? 'text-cyan-400' : 'text-sky-500'} />
          </div>
          <p className={`text-[11px] mt-0.5 ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
            {completedCount} van {MILESTONES.length} fases voltooid
          </p>
        </div>
        
        <div className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
          isDark 
            ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/20' 
            : 'bg-gradient-to-r from-sky-100 to-blue-100 text-sky-600 border border-sky-200'
        }`}>
          {Math.round(progress)}% compleet
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-4">
        <AnimatedProgressBar progress={progress} isDark={isDark} />
      </div>
      
      {/* Mobile: Carousel with horizontal scroll */}
      <div className="lg:hidden">
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto gap-2 pb-2 snap-x snap-mandatory"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {MILESTONES.map((milestone, index) => {
            const isCompleted = milestone.status === 'completed';
            const isCurrent = milestone.status === 'current';
            const isActive = index === activeIndex;
            
            const statusConfig = {
              completed: {
                bg: 'bg-gradient-to-br from-emerald-400 to-emerald-600',
                textColor: isDark ? 'text-emerald-400' : 'text-emerald-600',
              },
              current: {
                bg: 'bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600',
                textColor: isDark ? 'text-cyan-400' : 'text-sky-600',
              },
              upcoming: {
                bg: isDark ? 'bg-white/10' : 'bg-slate-200',
                textColor: isDark ? 'text-white/40' : 'text-slate-400',
              },
            };
            
            const status = statusConfig[milestone.status];
            
            return (
              <button
                key={milestone.id}
                onClick={() => setSelectedMilestone(milestone)}
                className={`flex-shrink-0 flex flex-col items-center snap-center transition-transform ${
                  isActive ? 'scale-105' : 'scale-95 opacity-70'
                }`}
                style={{ width: '70px' }}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${status.bg} ${
                  (isCurrent || isCompleted) ? 'shadow-lg' : ''
                }`}>
                  {isCompleted ? (
                    <CheckCircle2 size={20} className="text-white" />
                  ) : (
                    React.cloneElement(milestone.icon as React.ReactElement, {
                      size: 18,
                      className: isCurrent ? 'text-white' : isDark ? 'text-white/50' : 'text-slate-400'
                    })
                  )}
                </div>
                <p className={`mt-1.5 text-[10px] font-medium text-center leading-tight ${status.textColor}`}>
                  {milestone.title}
                </p>
                <p className={`text-[9px] ${isDark ? 'text-white/30' : 'text-slate-400'}`}>
                  {milestone.date.split(' ')[0]}
                </p>
              </button>
            );
          })}
        </div>
        
        {/* Mobile navigation dots */}
        <div className="flex justify-center items-center gap-1 mt-2">
          {MILESTONES.map((milestone, index) => (
            <button
              key={milestone.id}
              onClick={() => {
                if (scrollRef.current) {
                  const itemWidth = 70 + 8; // width + gap
                  scrollRef.current.scrollTo({ left: index * itemWidth, behavior: 'smooth' });
                  setActiveIndex(index);
                }
              }}
              className={`rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? milestone.status === 'completed'
                    ? 'bg-emerald-500 w-4 h-1.5'
                    : milestone.status === 'current'
                      ? 'bg-cyan-500 w-4 h-1.5'
                      : isDark ? 'bg-white/40 w-4 h-1.5' : 'bg-slate-400 w-4 h-1.5'
                  : milestone.status === 'completed'
                    ? 'bg-emerald-500/40 w-1.5 h-1.5'
                    : milestone.status === 'current'
                      ? 'bg-cyan-500/40 w-1.5 h-1.5'
                      : isDark ? 'bg-white/15 w-1.5 h-1.5' : 'bg-slate-300 w-1.5 h-1.5'
              }`}
            />
          ))}
        </div>
      </div>
      
      {/* Desktop: Regular horizontal layout - NO carousel */}
      <div className="hidden lg:flex items-start justify-between gap-2">
        {MILESTONES.map((milestone) => (
          <MilestoneNode
            key={milestone.id}
            milestone={milestone}
            index={MILESTONES.indexOf(milestone)}
            total={MILESTONES.length}
            onClick={() => setSelectedMilestone(milestone)}
            isDark={isDark}
          />
        ))}
      </div>
      
      {/* Milestone Detail Modal */}
      <AnimatePresence>
        {selectedMilestone && (
          <MilestoneModal
            milestone={selectedMilestone}
            onClose={() => setSelectedMilestone(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default InteractiveTimeline;
