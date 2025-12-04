/**
 * WoningpaspoortPreview - P1.3: Woningpaspoort live preview
 * 
 * Shows:
 * - Building visualization that evolves with construction
 * - Specs confirmed vs pending
 * - Document/verification status per section
 * - Animated construction progress
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Zap, Thermometer, Droplets, Sun, Wind, Wifi,
  CheckCircle2, Clock, AlertTriangle, ChevronRight,
  FileText, Shield, Lock, ExternalLink, Leaf, Battery,
  Square, Maximize2, Bed, Bath, Car
} from 'lucide-react';
import { GlassCard, GlassCardHeader } from './GlassCard';

interface PassportSection {
  id: string;
  name: string;
  icon: React.ReactNode;
  status: 'verified' | 'pending' | 'locked';
  progress: number;
  specs: Array<{
    label: string;
    value: string;
    status: 'confirmed' | 'pending' | 'locked';
  }>;
}

interface WoningpaspoortPreviewProps {
  className?: string;
  projectName: string;
  address: string;
  energyLabel: string;
  sqm: number;
  bedrooms: number;
  bathrooms: number;
  buildPhase: number; // 0-100
  sections?: PassportSection[];
}

const DEFAULT_SECTIONS: PassportSection[] = [
  {
    id: 'foundation',
    name: 'Fundering',
    icon: <Home size={16} />,
    status: 'verified',
    progress: 100,
    specs: [
      { label: 'Type', value: 'Betonnen plaat op palen', status: 'confirmed' },
      { label: 'Draagvermogen', value: '250 kN/paal', status: 'confirmed' },
      { label: 'Wkb dossier', value: '24 documenten', status: 'confirmed' },
    ],
  },
  {
    id: 'structure',
    name: 'Constructie',
    icon: <Square size={16} />,
    status: 'pending',
    progress: 45,
    specs: [
      { label: 'Materiaal', value: 'CLT hout + staal', status: 'confirmed' },
      { label: 'Isolatie', value: 'Rc 8.0 (wand)', status: 'pending' },
      { label: 'Dak', value: 'Sedum groen dak', status: 'pending' },
    ],
  },
  {
    id: 'energy',
    name: 'Energie',
    icon: <Zap size={16} />,
    status: 'pending',
    progress: 30,
    specs: [
      { label: 'Energielabel', value: 'A+++', status: 'confirmed' },
      { label: 'Zonnepanelen', value: '16x 440Wp', status: 'pending' },
      { label: 'Warmtepomp', value: 'Lucht-water', status: 'confirmed' },
      { label: 'Batterij', value: '10 kWh thuisbatterij', status: 'pending' },
    ],
  },
  {
    id: 'installations',
    name: 'Installaties',
    icon: <Wifi size={16} />,
    status: 'locked',
    progress: 0,
    specs: [
      { label: 'Ventilatie', value: 'WTW CO2-gestuurd', status: 'locked' },
      { label: 'Verwarming', value: 'Vloerverwarming', status: 'locked' },
      { label: 'Domotica', value: 'KNX systeem', status: 'locked' },
    ],
  },
  {
    id: 'finishing',
    name: 'Afwerking',
    icon: <Maximize2 size={16} />,
    status: 'locked',
    progress: 0,
    specs: [
      { label: 'Keuken', value: 'Nog te kiezen', status: 'locked' },
      { label: 'Badkamer', value: 'Nog te kiezen', status: 'locked' },
      { label: 'Vloeren', value: 'Nog te kiezen', status: 'locked' },
    ],
  },
];

// Animated house SVG that builds up based on progress
const AnimatedHouse: React.FC<{ progress: number }> = ({ progress }) => {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Ground */}
      <rect x="20" y="170" width="160" height="10" fill="#1e293b" />
      
      {/* Foundation - always visible if progress > 0 */}
      {progress >= 10 && (
        <motion.rect 
          x="30" y="160" width="140" height="15" 
          fill="#64748b"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          style={{ transformOrigin: 'center' }}
        />
      )}
      
      {/* Walls */}
      {progress >= 25 && (
        <motion.g
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Left wall */}
          <rect x="30" y="80" width="15" height="80" fill="#94a3b8" />
          {/* Right wall */}
          <rect x="155" y="80" width="15" height="80" fill="#94a3b8" />
          {/* Back wall */}
          <rect x="45" y="80" width="110" height="80" fill="#cbd5e1" />
        </motion.g>
      )}
      
      {/* Windows */}
      {progress >= 40 && (
        <motion.g
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <rect x="55" y="100" width="25" height="30" fill="#3b82f6" rx="2" />
          <rect x="120" y="100" width="25" height="30" fill="#3b82f6" rx="2" />
          {/* Window frames */}
          <line x1="67.5" y1="100" x2="67.5" y2="130" stroke="#fff" strokeWidth="2" />
          <line x1="55" y1="115" x2="80" y2="115" stroke="#fff" strokeWidth="2" />
          <line x1="132.5" y1="100" x2="132.5" y2="130" stroke="#fff" strokeWidth="2" />
          <line x1="120" y1="115" x2="145" y2="115" stroke="#fff" strokeWidth="2" />
        </motion.g>
      )}
      
      {/* Door */}
      {progress >= 45 && (
        <motion.g
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <rect x="87" y="115" width="26" height="45" fill="#1e40af" rx="2" />
          <circle cx="107" cy="140" r="2" fill="#fbbf24" />
        </motion.g>
      )}
      
      {/* Roof structure */}
      {progress >= 55 && (
        <motion.polygon 
          points="20,80 100,25 180,80"
          fill="#f59e0b"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        />
      )}
      
      {/* Roof tiles */}
      {progress >= 65 && (
        <motion.polygon 
          points="25,80 100,30 175,80"
          fill="#b45309"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        />
      )}
      
      {/* Solar panels */}
      {progress >= 75 && (
        <motion.g
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          <rect x="55" y="45" width="35" height="25" fill="#1e3a5f" rx="2" />
          <rect x="95" y="45" width="35" height="25" fill="#1e3a5f" rx="2" />
          {/* Panel grid lines */}
          <line x1="72.5" y1="45" x2="72.5" y2="70" stroke="#3b82f6" strokeWidth="0.5" />
          <line x1="55" y1="57.5" x2="90" y2="57.5" stroke="#3b82f6" strokeWidth="0.5" />
          <line x1="112.5" y1="45" x2="112.5" y2="70" stroke="#3b82f6" strokeWidth="0.5" />
          <line x1="95" y1="57.5" x2="130" y2="57.5" stroke="#3b82f6" strokeWidth="0.5" />
        </motion.g>
      )}
      
      {/* Chimney / Heat pump */}
      {progress >= 80 && (
        <motion.g
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <rect x="140" y="35" width="15" height="30" fill="#64748b" rx="2" />
          {/* Heat waves */}
          <motion.path 
            d="M145 25 Q147 20 149 25 Q151 30 153 25"
            fill="none" 
            stroke="#10b981" 
            strokeWidth="2"
            animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.g>
      )}
      
      {/* Garden / Landscaping */}
      {progress >= 90 && (
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {/* Trees */}
          <circle cx="15" cy="155" r="15" fill="#22c55e" />
          <rect x="13" y="155" width="4" height="15" fill="#854d0e" />
          <circle cx="185" cy="155" r="12" fill="#22c55e" />
          <rect x="183" y="155" width="4" height="15" fill="#854d0e" />
          {/* Grass */}
          <ellipse cx="100" cy="175" rx="60" ry="5" fill="#16a34a" opacity="0.3" />
        </motion.g>
      )}
      
      {/* Completion sparkle */}
      {progress >= 100 && (
        <motion.g
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, type: 'spring' }}
        >
          <motion.circle 
            cx="100" cy="52" r="8" 
            fill="#fbbf24"
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.g>
      )}
    </svg>
  );
};

export const WoningpaspoortPreview: React.FC<WoningpaspoortPreviewProps> = ({
  className = '',
  projectName,
  address,
  energyLabel,
  sqm,
  bedrooms,
  bathrooms,
  buildPhase,
  sections = DEFAULT_SECTIONS,
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const getStatusConfig = (status: 'verified' | 'pending' | 'locked') => {
    switch (status) {
      case 'verified':
        return {
          icon: <CheckCircle2 size={14} />,
          color: 'text-emerald-400',
          bg: 'bg-emerald-500/10 border-emerald-500/20',
        };
      case 'pending':
        return {
          icon: <Clock size={14} />,
          color: 'text-amber-400',
          bg: 'bg-amber-500/10 border-amber-500/20',
        };
      case 'locked':
        return {
          icon: <Lock size={14} />,
          color: 'text-white/30',
          bg: 'bg-white/5 border-white/10',
        };
    }
  };

  const verifiedSections = sections.filter(s => s.status === 'verified').length;
  const overallProgress = Math.round(sections.reduce((acc, s) => acc + s.progress, 0) / sections.length);

  return (
    <GlassCard className={`overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-5 border-b border-white/5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <FileText size={24} className="text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Woningpaspoort</h3>
              <p className="text-xs text-white/50">Live preview</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
              energyLabel.includes('+++') ? 'bg-emerald-500/20 text-emerald-400' :
              energyLabel.includes('++') ? 'bg-emerald-500/20 text-emerald-400' :
              'bg-blue-500/20 text-blue-400'
            }`}>
              {energyLabel}
            </span>
            <Shield size={16} className="text-blue-400" />
          </div>
        </div>

        {/* Project info */}
        <div className="flex items-center gap-4 text-xs text-white/50">
          <span className="font-medium text-white">{projectName}</span>
          <span>•</span>
          <span>{address}</span>
        </div>
      </div>

      {/* Animated House + Stats */}
      <div className="p-5 grid grid-cols-2 gap-6">
        {/* House visualization */}
        <div className="relative">
          <div className="aspect-square bg-gradient-to-b from-blue-500/5 to-transparent rounded-2xl p-4">
            <AnimatedHouse progress={buildPhase} />
          </div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full">
            <span className="text-xs text-white/70">{buildPhase}% gebouwd</span>
          </div>
        </div>

        {/* Quick stats */}
        <div className="space-y-3">
          <div className="p-3 bg-white/5 rounded-xl">
            <div className="flex items-center gap-2 text-xs text-white/40 mb-1">
              <Maximize2 size={12} />
              <span>Oppervlakte</span>
            </div>
            <p className="text-lg font-mono font-bold text-white">{sqm} m²</p>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 bg-white/5 rounded-xl">
              <div className="flex items-center gap-1 text-xs text-white/40 mb-1">
                <Bed size={10} />
              </div>
              <p className="text-sm font-bold text-white">{bedrooms} slaapkamers</p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl">
              <div className="flex items-center gap-1 text-xs text-white/40 mb-1">
                <Bath size={10} />
              </div>
              <p className="text-sm font-bold text-white">{bathrooms} badkamers</p>
            </div>
          </div>

          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <div className="flex items-center gap-2 text-xs text-emerald-400 mb-1">
              <Leaf size={12} />
              <span>Duurzaamheid</span>
            </div>
            <p className="text-sm font-bold text-emerald-400">Energieneutraal</p>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-5 pb-3">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-white/50">{verifiedSections}/{sections.length} secties geverifieerd</span>
          <span className="text-blue-400 font-mono">{overallProgress}%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 1, delay: 0.3 }}
          />
        </div>
      </div>

      {/* Sections */}
      <div className="p-5 pt-2 space-y-2">
        {sections.map((section) => {
          const config = getStatusConfig(section.status);
          const isExpanded = expandedSection === section.id;

          return (
            <div key={section.id}>
              <button
                onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                disabled={section.status === 'locked'}
                className={`w-full p-3 rounded-xl border flex items-center gap-3 ${config.bg} ${
                  section.status === 'locked' ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${config.bg} ${config.color}`}>
                  {section.icon}
                </div>
                <div className="flex-1 text-left">
                  <p className={`text-sm font-medium ${section.status === 'locked' ? 'text-white/40' : 'text-white'}`}>
                    {section.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden max-w-[80px]">
                      <div 
                        className={`h-full rounded-full ${
                          section.status === 'verified' ? 'bg-emerald-500' :
                          section.status === 'pending' ? 'bg-amber-500' :
                          'bg-white/20'
                        }`}
                        style={{ width: `${section.progress}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-white/40">{section.progress}%</span>
                  </div>
                </div>
                <div className={`flex items-center gap-1.5 ${config.color}`}>
                  {config.icon}
                  {section.status !== 'locked' && (
                    <ChevronRight 
                      size={14} 
                      className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                    />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3 ml-11 space-y-2">
                      {section.specs.map((spec, i) => (
                        <div 
                          key={i}
                          className="flex items-center justify-between p-2 bg-white/5 rounded-lg"
                        >
                          <span className="text-xs text-white/50">{spec.label}</span>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-medium ${
                              spec.status === 'confirmed' ? 'text-white' :
                              spec.status === 'pending' ? 'text-amber-400' :
                              'text-white/30'
                            }`}>
                              {spec.value}
                            </span>
                            {spec.status === 'confirmed' && (
                              <CheckCircle2 size={12} className="text-emerald-400" />
                            )}
                            {spec.status === 'pending' && (
                              <Clock size={12} className="text-amber-400" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="p-5 pt-0 flex gap-2">
        <button className="flex-1 px-4 py-2.5 bg-blue-500 rounded-xl text-sm font-medium text-white flex items-center justify-center gap-2">
          <FileText size={16} />
          Volledig paspoort
        </button>
        <button className="px-4 py-2.5 bg-white/5 rounded-xl text-sm text-white/60 flex items-center justify-center gap-2">
          <ExternalLink size={16} />
        </button>
      </div>
    </GlassCard>
  );
};

export default WoningpaspoortPreview;

