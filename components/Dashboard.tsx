import React, { useState, useEffect, useRef } from 'react';
import { UserPreferences } from '../types';
import { 
  MessageSquare, FileText, CheckCircle2, Clock, Bell, Leaf, Shield, ArrowRight, 
  Home, Users, Zap, ChevronDown, ChevronUp, Lock, Camera, Send, X, AlertTriangle, 
  HardHat, FileCheck, Sparkles, Award, QrCode, Building2, ThermometerSun, Droplets, 
  Sun, Plug, ArrowLeft, LayoutDashboard, FolderOpen, Settings, Euro, Upload
} from 'lucide-react';
import { ENERGY_OPTIONS, CURRENCY_SYMBOL, calculateBuildCost } from '../constants';
import { CONSTRUCTION_PHASES, MilestoneTask, getPhaseProgress, getOverallProgress } from '../constants/milestones';
import { useTranslation } from '../i18n';
import { motion, AnimatePresence } from 'framer-motion';

// Types
type TabType = 'overview' | 'phases' | 'docs' | 'chat';

interface DashboardProps {
  preferences: UserPreferences;
  image: string;
}

// ============================================
// MOBILE-FIRST DASHBOARD
// ============================================
export const Dashboard: React.FC<DashboardProps> = ({ preferences, image }) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [expandedPhase, setExpandedPhase] = useState<string>('fundering');
  const [selectedTask, setSelectedTask] = useState<MilestoneTask | null>(null);
  const { t, language } = useTranslation();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Project info
  const projectName = 'Veluwse Heide';
  const locationName = preferences.location.searchQuery.split(',')[0] || 'Ermelo';
  
  // Energy info
  const energyOpt = ENERGY_OPTIONS.find(e => e.value === preferences.config.energyLevel);
  const energyLabel = preferences.config.energyLevel === 'positive' ? 'A+++' 
    : preferences.config.energyLevel === 'neutral' ? 'A++' 
    : preferences.config.energyLevel === 'aplus' ? 'A+' 
    : 'A';

  // Progress
  const overallProgress = getOverallProgress();

  // Build cost
  const buildCost = calculateBuildCost(
    preferences.config.sqm,
    preferences.config.material,
    preferences.config.energyLevel,
    preferences.config.extras,
    preferences.config.vibe
  );

  return (
    <div className="min-h-screen bg-[#0a1628] text-white flex flex-col">
      {/* Blueprint Grid Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Top Header - Compact Mobile */}
      <header className="sticky top-0 z-50 bg-[#0a1628]/95 backdrop-blur-xl border-b border-white/5">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left: Back + Project Name */}
            <div className="flex items-center gap-3">
              <button className="p-2 -ml-2 rounded-xl hover:bg-white/5 text-white/40">
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="font-semibold text-white text-sm">{projectName}</h1>
                <p className="text-[11px] text-white/40">{locationName}</p>
              </div>
            </div>

            {/* Right: Status badges */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-[10px] font-medium text-emerald-400">Wkb</span>
              </div>
              <div className="px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
                <span className="text-[10px] font-mono font-medium text-blue-400">{overallProgress.percentage}%</span>
              </div>
              <button className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <Euro size={14} className="text-white/60" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'overview' && (
              <OverviewTab 
                image={image}
                projectName={projectName}
                preferences={preferences}
                energyLabel={energyLabel}
                overallProgress={overallProgress}
                buildCost={buildCost}
              />
            )}
            {activeTab === 'phases' && (
              <PhasesTab 
                expandedPhase={expandedPhase}
                setExpandedPhase={setExpandedPhase}
                selectedTask={selectedTask}
                setSelectedTask={setSelectedTask}
                overallProgress={overallProgress}
              />
            )}
            {activeTab === 'docs' && (
              <DocsTab preferences={preferences} energyLabel={energyLabel} energyOpt={energyOpt} />
            )}
            {activeTab === 'chat' && (
              <ChatTab />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation - Mobile Tabs */}
      <nav className="fixed bottom-0 inset-x-0 z-50 bg-[#0a1628]/95 backdrop-blur-xl border-t border-white/5">
        <div className="flex items-center justify-around py-2 px-4 max-w-lg mx-auto">
          <TabButton 
            icon={<LayoutDashboard size={20} />} 
            label="Overzicht" 
            active={activeTab === 'overview'} 
            onClick={() => setActiveTab('overview')} 
          />
          <TabButton 
            icon={<HardHat size={20} />} 
            label="Bouwfases" 
            active={activeTab === 'phases'} 
            onClick={() => setActiveTab('phases')}
            badge={2}
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
    </div>
  );
};

// ============================================
// TAB BUTTON COMPONENT
// ============================================
const TabButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  badge?: number;
}> = ({ icon, label, active, onClick, badge }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all relative ${
      active 
        ? 'text-blue-400 bg-blue-500/10' 
        : 'text-white/40 hover:text-white/60'
    }`}
  >
    <div className="relative">
      {icon}
      {badge && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
          {badge}
        </span>
      )}
    </div>
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

// ============================================
// OVERVIEW TAB
// ============================================
const OverviewTab: React.FC<{
  image: string;
  projectName: string;
  preferences: UserPreferences;
  energyLabel: string;
  overallProgress: { percentage: number; completed: number; total: number };
  buildCost: number;
}> = ({ image, projectName, preferences, energyLabel, overallProgress, buildCost }) => {
  const styleName = preferences.style.moodBoardSelections[0] || 'Modern';
  
  return (
    <div className="px-4 py-4 space-y-4">
      {/* Hero Card with Image */}
      <div className="relative rounded-2xl overflow-hidden border border-white/10">
        <img src={image} alt="Project" className="w-full h-40 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-semibold text-lg text-white">{projectName} Residence</h2>
              <p className="text-xs text-white/50">{styleName} • {preferences.config.sqm}m²</p>
            </div>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-white/10 backdrop-blur rounded-lg text-xs font-mono text-white">
                {preferences.household.bedrooms}🛏️
              </span>
              <span className="px-2 py-1 bg-emerald-500/20 backdrop-blur rounded-lg text-xs font-bold text-emerald-400">
                {energyLabel}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Card */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-white/70">Voortgang</span>
          <span className="text-2xl font-mono font-bold text-blue-400">{overallProgress.percentage}%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-3">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress.percentage}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
        <div className="flex justify-between text-xs text-white/40">
          <span>Fase 2: Fundering</span>
          <span>{overallProgress.completed}/{overallProgress.total} taken</span>
        </div>
      </div>

      {/* Action Required Card */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Camera size={20} className="text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-amber-300 text-sm">Storten fundering</h3>
            <p className="text-xs text-amber-300/60 mt-0.5">Foto tijdens storten</p>
          </div>
          <ChevronRight size={18} className="text-amber-400/50 flex-shrink-0" />
        </div>
        
        {/* Upload Area */}
        <div className="mt-4 border-2 border-dashed border-white/10 rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
            <Camera size={24} className="text-white/30" />
          </div>
          <p className="text-sm font-medium text-white/70">Upload foto</p>
          <p className="text-xs text-white/40 mt-1">Of gebruik smart glasses op de bouwplaats</p>
          <button className="mt-4 px-6 py-2.5 bg-[#0a1628] text-white text-sm font-semibold rounded-xl border border-white/20">
            Bestand kiezen
          </button>
        </div>

        {/* Payment unlock info */}
        <div className="mt-4 flex items-center justify-between px-3 py-2 bg-white/5 rounded-xl">
          <div className="flex items-center gap-2">
            <Euro size={14} className="text-white/40" />
            <span className="text-xs text-white/60">Bij verificatie:</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm font-mono font-bold text-white">€15,000</span>
            <Lock size={12} className="text-white/30" />
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard 
          label="Bouwkosten" 
          value={`€${(buildCost / 1000).toFixed(0)}k`} 
          icon={<Euro size={16} />}
          color="blue"
        />
        <StatCard 
          label="Vrijgegeven" 
          value="€49.5k" 
          icon={<CheckCircle2 size={16} />}
          color="emerald"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
        <h3 className="text-sm font-semibold text-white/80 mb-3">Recente activiteit</h3>
        <div className="space-y-3">
          <ActivityItem 
            icon={<CheckCircle2 size={14} />}
            title="Wapeningskeuring goedgekeurd"
            time="Vandaag, 09:41"
            color="emerald"
          />
          <ActivityItem 
            icon={<Euro size={14} />}
            title="Tranche 2 vrijgegeven (€34.500)"
            time="Vandaag, 09:45"
            color="blue"
          />
          <ActivityItem 
            icon={<MessageSquare size={14} />}
            title="Nieuw bericht van aannemer"
            time="Gisteren, 18:22"
            color="amber"
          />
        </div>
      </div>
    </div>
  );
};

// ============================================
// PHASES TAB
// ============================================
const PhasesTab: React.FC<{
  expandedPhase: string;
  setExpandedPhase: (id: string) => void;
  selectedTask: MilestoneTask | null;
  setSelectedTask: (task: MilestoneTask | null) => void;
  overallProgress: { percentage: number };
}> = ({ expandedPhase, setExpandedPhase, selectedTask, setSelectedTask, overallProgress }) => {
  
  const getStatusColor = (status: MilestoneTask['status']) => {
    switch (status) {
      case 'completed': return 'bg-emerald-500';
      case 'active': return 'bg-blue-500';
      case 'pending': return 'bg-white/20';
      case 'locked': return 'bg-white/10';
    }
  };

  const getStatusIcon = (status: MilestoneTask['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle2 size={12} className="text-white" />;
      case 'active': return <div className="w-2 h-2 bg-white rounded-full animate-pulse" />;
      case 'pending': return <Clock size={10} className="text-white/60" />;
      case 'locked': return <Lock size={10} className="text-white/40" />;
    }
  };

  return (
    <div className="px-4 py-4">
      {/* Progress Header */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-white/60">Totale voortgang</span>
          <span className="text-xl font-mono font-bold text-blue-400">{overallProgress.percentage}%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full transition-all"
            style={{ width: `${overallProgress.percentage}%` }}
          />
        </div>
      </div>

      {/* Phases List */}
      <div className="space-y-2">
        {CONSTRUCTION_PHASES.map((phase, phaseIndex) => {
          const progress = getPhaseProgress(phase);
          const isExpanded = expandedPhase === phase.id;
          const isComplete = progress.completed === progress.total;
          
          return (
            <div key={phase.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              {/* Phase Header */}
              <button
                onClick={() => setExpandedPhase(isExpanded ? '' : phase.id)}
                className="w-full flex items-center gap-3 p-4"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isComplete 
                    ? 'bg-emerald-500' 
                    : isExpanded 
                      ? 'bg-blue-500' 
                      : 'bg-white/10'
                }`}>
                  {isComplete ? (
                    <CheckCircle2 size={20} className="text-white" />
                  ) : (
                    <span className="text-sm font-bold text-white">{phaseIndex + 1}</span>
                  )}
                </div>
                
                <div className="flex-1 text-left">
                  <div className="font-semibold text-white text-sm">{phase.name}</div>
                  <div className="text-xs text-white/40 mt-0.5">
                    {progress.completed}/{progress.total} taken voltooid
                  </div>
                </div>

                {/* Mini progress */}
                <div className="flex items-center gap-2">
                  <div className="w-12 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${isComplete ? 'bg-emerald-400' : 'bg-blue-400'}`}
                      style={{ width: `${(progress.completed / progress.total) * 100}%` }}
                    />
                  </div>
                  {isExpanded ? (
                    <ChevronUp size={18} className="text-white/40" />
                  ) : (
                    <ChevronDown size={18} className="text-white/40" />
                  )}
                </div>
              </button>

              {/* Tasks List */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-white/5"
                  >
                    <div className="p-3 space-y-1">
                      {phase.tasks.map((task) => (
                        <button
                          key={task.id}
                          onClick={() => setSelectedTask(selectedTask?.id === task.id ? null : task)}
                          disabled={task.status === 'locked'}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                            selectedTask?.id === task.id
                              ? 'bg-blue-500/20 border border-blue-500/30'
                              : task.status === 'locked'
                                ? 'opacity-40'
                                : 'hover:bg-white/5'
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${getStatusColor(task.status)}`}>
                            {getStatusIcon(task.status)}
                          </div>
                          <span className={`text-sm flex-1 text-left ${
                            task.status === 'locked' ? 'text-white/40' : 'text-white/80'
                          }`}>
                            {task.name}
                          </span>
                          {task.status === 'active' && (
                            <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-[10px] font-medium rounded-full">
                              Actief
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Selected Task Detail Sheet */}
      <AnimatePresence>
        {selectedTask && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed inset-x-0 bottom-0 z-50 bg-[#0d1f35] border-t border-white/10 rounded-t-3xl max-h-[70vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-[#0d1f35] px-4 py-3 border-b border-white/5 flex items-center justify-between">
              <h3 className="font-semibold text-white">{selectedTask.name}</h3>
              <button 
                onClick={() => setSelectedTask(null)}
                className="p-2 hover:bg-white/5 rounded-xl"
              >
                <X size={20} className="text-white/40" />
              </button>
            </div>
            <div className="p-4">
              <img 
                src={selectedTask.image} 
                alt={selectedTask.name}
                className="w-full h-40 object-cover rounded-xl mb-4"
              />
              <p className="text-sm text-white/60 mb-4">{selectedTask.description}</p>
              
              {selectedTask.status === 'active' && (
                <button className="w-full py-3 bg-blue-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2">
                  <Camera size={18} />
                  Foto uploaden voor verificatie
                </button>
              )}
              
              {selectedTask.status === 'completed' && selectedTask.verifiedBy && (
                <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <Shield size={16} className="text-emerald-400" />
                  <span className="text-sm text-emerald-300">Geverifieerd door {selectedTask.verifiedBy}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================
// DOCS TAB
// ============================================
const DocsTab: React.FC<{
  preferences: UserPreferences;
  energyLabel: string;
  energyOpt: typeof ENERGY_OPTIONS[0] | undefined;
}> = ({ preferences, energyLabel, energyOpt }) => {
  return (
    <div className="px-4 py-4 space-y-4">
      {/* Woningpaspoort Card */}
      <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 rounded-2xl p-4">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
            <Home size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white">Woningpaspoort</h3>
              <span className="px-2 py-0.5 bg-emerald-500 text-white text-[9px] font-bold rounded-full">
                GECERTIFICEERD
              </span>
            </div>
            <p className="text-xs text-emerald-300/60 mt-0.5">Bureau Broersma • WP-2024-8847</p>
          </div>
        </div>

        {/* Energy Label */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-emerald-500 rounded-xl flex items-center justify-center">
            <span className="text-2xl font-black text-white">{energyLabel}</span>
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-white">
              {preferences.config.energyLevel === 'positive' ? 'Energieleverend' :
               preferences.config.energyLevel === 'neutral' ? 'Energieneutraal' : 'Energiezuinig'}
            </div>
            <div className="flex gap-3 mt-2 text-xs">
              <span className="text-emerald-400">Rc 8.0</span>
              <span className="text-blue-400">Qv10 0.4</span>
              <span className="text-amber-400">TO ≤ 0.45</span>
            </div>
          </div>
        </div>

        {/* Features */}
        {energyOpt && (
          <div className="flex flex-wrap gap-1.5">
            {energyOpt.features.slice(0, 4).map((feature, i) => (
              <span key={i} className="px-2 py-1 bg-emerald-500/20 text-emerald-300 text-xs rounded-lg border border-emerald-500/30">
                {feature}
              </span>
            ))}
          </div>
        )}

        <button className="w-full mt-4 py-2.5 bg-emerald-500/20 text-emerald-400 text-sm font-medium rounded-xl border border-emerald-500/30 flex items-center justify-center gap-2">
          <FileText size={16} />
          Download PDF
        </button>
      </div>

      {/* Documents List */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <h3 className="font-semibold text-white text-sm">Documenten</h3>
        </div>
        <div className="divide-y divide-white/5">
          <DocItem name="Woningpaspoort_Ondertekend.pdf" verified date="28 nov" />
          <DocItem name="Vergunning_Onherroepelijk.pdf" verified date="15 nov" />
          <DocItem name="Constructieberekening_v4.pdf" verified date="10 nov" />
          <DocItem name="Sonderingsrapport.pdf" verified date="5 nov" />
          <DocItem name="Wapening_Goedkeuring.pdf" verified date="Vandaag" />
        </div>
      </div>

      {/* Project Specs */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
        <h3 className="font-semibold text-white text-sm mb-3">Specificaties</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-white/50">Oppervlakte</span>
            <span className="font-mono text-white">{preferences.config.sqm} m²</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/50">Slaapkamers</span>
            <span className="font-mono text-white">{preferences.household.bedrooms}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/50">Materiaal</span>
            <span className="text-white">{preferences.config.material === 'wood' ? 'Hout' : preferences.config.material === 'brick' ? 'Baksteen' : 'Beton'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// CHAT TAB
// ============================================
const ChatTab: React.FC = () => {
  const [newMessage, setNewMessage] = useState('');
  
  const messages = [
    { id: '1', sender: 'Systeem', initials: 'SY', content: '🎉 Fase 1 afgerond!', time: 'Gisteren', type: 'system' },
    { id: '2', sender: 'Van der Berg Bouw', initials: 'VB', content: 'De heipalen zijn aangekomen. We beginnen morgen.', time: 'Gisteren', type: 'aannemer' },
    { id: '3', sender: 'Bureau Broersma', initials: 'BB', content: 'Wapening goedgekeurd ✓', time: 'Vandaag', type: 'keurmeester' },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      {/* Chat Header */}
      <div className="px-4 py-3 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-white text-sm">Project Chat</h3>
            <p className="text-xs text-white/40">4 deelnemers</p>
          </div>
          <div className="flex -space-x-2">
            <div className="w-7 h-7 rounded-full bg-blue-400 text-[#0a1628] flex items-center justify-center text-[10px] font-bold border-2 border-[#0a1628]">JD</div>
            <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold border-2 border-[#0a1628]">BB</div>
            <div className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold border-2 border-[#0a1628]">VB</div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className="flex gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
              msg.type === 'keurmeester' ? 'bg-emerald-500 text-white' :
              msg.type === 'aannemer' ? 'bg-amber-500 text-white' :
              'bg-violet-500 text-white'
            }`}>
              {msg.type === 'system' ? <Zap size={14} /> : msg.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-white">{msg.sender}</span>
                <span className="text-[10px] text-white/30">{msg.time}</span>
              </div>
              <p className="text-sm text-white/70 bg-white/5 rounded-xl rounded-tl-none p-3">
                {msg.content}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/5">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Stuur een bericht..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-blue-500/50"
          />
          <button className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
            <Send size={18} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// HELPER COMPONENTS
// ============================================
const StatCard: React.FC<{
  label: string;
  value: string;
  icon: React.ReactNode;
  color: 'blue' | 'emerald' | 'amber';
}> = ({ label, value, icon, color }) => {
  const colors = {
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
  };
  
  return (
    <div className={`${colors[color]} border rounded-2xl p-4`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs text-white/50">{label}</span>
      </div>
      <div className="text-xl font-mono font-bold text-white">{value}</div>
    </div>
  );
};

const ActivityItem: React.FC<{
  icon: React.ReactNode;
  title: string;
  time: string;
  color: 'emerald' | 'blue' | 'amber';
}> = ({ icon, title, time, color }) => {
  const colors = {
    emerald: 'bg-emerald-500/20 text-emerald-400',
    blue: 'bg-blue-500/20 text-blue-400',
    amber: 'bg-amber-500/20 text-amber-400',
  };
  
  return (
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors[color]}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white/80 truncate">{title}</p>
        <p className="text-xs text-white/30">{time}</p>
      </div>
    </div>
  );
};

const DocItem: React.FC<{ name: string; verified?: boolean; date: string }> = ({ name, verified, date }) => (
  <div className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors">
    <div className="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center">
      <FileText size={16} className="text-white/40" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm text-white/80 truncate">{name}</p>
      <p className="text-xs text-white/30">{date}</p>
    </div>
    {verified && <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />}
  </div>
);

const ChevronRight: React.FC<{ size: number; className?: string }> = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="9,18 15,12 9,6" />
  </svg>
);
