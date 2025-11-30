import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, X, Lock, Clock, ChevronRight, ChevronDown, 
  FileText, Camera, Video, MapPin, Bell, MessageSquare, 
  Download, Shield, Eye, CheckCircle2, XCircle, AlertCircle, 
  Loader2, ArrowLeft, Upload, Compass, Send, Home
} from 'lucide-react';
import { AppState, TaskStatus } from '../types';

// ============================================
// DEMO PROJECT DATA
// ============================================

interface Task {
  id: string;
  title: string;
  role: 'aannemer' | 'klant' | 'kwaliteitsborger';
  status: TaskStatus;
  type: 'photo' | 'video' | 'document';
  verifiedAt?: string;
  verifiedBy?: string;
  hash?: string;
}

interface Phase {
  id: string;
  name: string;
  status: TaskStatus;
  progress: number;
  tasks: Task[];
}

const PHASES: Phase[] = [
  {
    id: 'voorbereiding',
    name: 'Voorbereiding',
    status: 'verified',
    progress: 100,
    tasks: [
      { id: 't1', title: 'Bouwvergunning', role: 'klant', status: 'verified', type: 'document', verifiedAt: '15 nov', verifiedBy: 'Bureau Broersma', hash: '0x7f3a...' },
      { id: 't2', title: 'Grondonderzoek', role: 'aannemer', status: 'verified', type: 'document', verifiedAt: '20 nov', verifiedBy: 'Bureau Broersma', hash: '0x8b2c...' },
    ]
  },
  {
    id: 'fundering',
    name: 'Fundering',
    status: 'active',
    progress: 60,
    tasks: [
      { id: 't3', title: 'Uitgraven bouwput', role: 'aannemer', status: 'verified', type: 'photo', verifiedAt: '25 nov', verifiedBy: 'AI + Expert', hash: '0x9d4e...' },
      { id: 't4', title: 'Wapeningsstaal', role: 'aannemer', status: 'verified', type: 'photo', verifiedAt: '28 nov', verifiedBy: 'Bureau Broersma', hash: '0xa1f2...' },
      { id: 't5', title: 'Betonbon', role: 'aannemer', status: 'pending', type: 'document' },
      { id: 't6', title: 'Storten fundering', role: 'aannemer', status: 'active', type: 'photo' },
      { id: 't7', title: 'Uitharding controle', role: 'kwaliteitsborger', status: 'locked', type: 'document' },
    ]
  },
  {
    id: 'ruwbouw',
    name: 'Ruwbouw',
    status: 'locked',
    progress: 0,
    tasks: [
      { id: 't8', title: 'HSB elementen', role: 'aannemer', status: 'locked', type: 'photo' },
      { id: 't9', title: 'Montage begane grond', role: 'aannemer', status: 'locked', type: 'photo' },
    ]
  },
  {
    id: 'dak',
    name: 'Dakconstructie',
    status: 'locked',
    progress: 0,
    tasks: [
      { id: 't10', title: 'Dakspanten', role: 'aannemer', status: 'locked', type: 'photo' },
      { id: 't11', title: 'Dakbedekking', role: 'aannemer', status: 'locked', type: 'photo' },
    ]
  },
  {
    id: 'installaties',
    name: 'Installaties',
    status: 'locked',
    progress: 0,
    tasks: [
      { id: 't12', title: 'Leidingwerk', role: 'aannemer', status: 'locked', type: 'photo' },
      { id: 't13', title: 'Elektra', role: 'aannemer', status: 'locked', type: 'photo' },
    ]
  },
  {
    id: 'oplevering',
    name: 'Oplevering',
    status: 'locked',
    progress: 0,
    tasks: [
      { id: 't14', title: 'Eindkeuring', role: 'kwaliteitsborger', status: 'locked', type: 'document' },
      { id: 't15', title: 'Sleuteloverdracht', role: 'klant', status: 'locked', type: 'photo' },
    ]
  },
];

// ============================================
// COMPONENTS
// ============================================

const StatusDot: React.FC<{ status: TaskStatus; size?: 'sm' | 'md' | 'lg' }> = ({ status, size = 'md' }) => {
  const sizeClasses = { sm: 'w-2 h-2', md: 'w-3 h-3', lg: 'w-4 h-4' };
  const colors: Record<TaskStatus, string> = {
    locked: 'bg-white/20',
    active: 'bg-blue-400 ring-4 ring-blue-400/20',
    pending: 'bg-amber-400',
    rejected: 'bg-red-400 animate-pulse',
    verified: 'bg-emerald-400',
  };
  return <div className={`${sizeClasses[size]} rounded-full ${colors[status]}`} />;
};

const TypeIcon: React.FC<{ type: 'photo' | 'video' | 'document' }> = ({ type }) => {
  const icons = {
    photo: <Camera size={14} className="text-white/40" />,
    video: <Video size={14} className="text-white/40" />,
    document: <FileText size={14} className="text-white/40" />,
  };
  return icons[type];
};

// ============================================
// MAIN COMPONENT
// ============================================

interface Props {
  setAppState: (state: AppState) => void;
}

export const CollaborativeWorkspace: React.FC<Props> = ({ setAppState }) => {
  const [selectedPhase, setSelectedPhase] = useState('fundering');
  const [selectedTask, setSelectedTask] = useState<string | null>('t6');
  const [expandedPhases, setExpandedPhases] = useState<string[]>(['fundering']);
  const [view, setView] = useState<'tasks' | 'passport'>('tasks');

  const currentPhase = PHASES.find(p => p.id === selectedPhase);
  const currentTask = currentPhase?.tasks.find(t => t.id === selectedTask);
  const totalProgress = Math.round(PHASES.reduce((acc, p) => acc + p.progress, 0) / PHASES.length);

  const togglePhase = (id: string) => {
    const phase = PHASES.find(p => p.id === id);
    if (phase?.status === 'locked') return;
    setExpandedPhases(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
    setSelectedPhase(id);
  };

  return (
    <div className="h-screen bg-[#080d14] flex overflow-hidden">
      
      {/* ========== LEFT SIDEBAR ========== */}
      <aside className="w-72 border-r border-white/[0.06] flex flex-col">
        
        {/* Project Header */}
        <div className="p-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center">
              <Home size={18} className="text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-white font-medium text-sm truncate">Veluwse Heide</h1>
              <p className="text-white/40 text-xs">Ermelo</p>
            </div>
          </div>
          
          {/* Progress */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1 bg-white/[0.06] rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
                initial={{ width: 0 }}
                animate={{ width: `${totalProgress}%` }}
                transition={{ duration: 1 }}
              />
            </div>
            <span className="text-white/60 text-xs font-mono">{totalProgress}%</span>
          </div>
        </div>

        {/* Timeline */}
        <nav className="flex-1 overflow-y-auto py-2">
          {PHASES.map((phase) => {
            const isExpanded = expandedPhases.includes(phase.id);
            const isSelected = selectedPhase === phase.id;
            const isLocked = phase.status === 'locked';

            return (
              <div key={phase.id}>
                {/* Phase Header */}
                <button
                  onClick={() => togglePhase(phase.id)}
                  disabled={isLocked}
                  className={`w-full px-6 py-3 flex items-center gap-3 transition-all ${
                    isSelected ? 'bg-white/[0.04]' : 'hover:bg-white/[0.02]'
                  } ${isLocked ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <StatusDot status={phase.status} />
                  <span className={`flex-1 text-left text-sm ${isLocked ? 'text-white/40' : 'text-white/80'}`}>
                    {phase.name}
                  </span>
                  {!isLocked && (
                    <ChevronDown 
                      size={14} 
                      className={`text-white/30 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  )}
                  {isLocked && <Lock size={12} className="text-white/20" />}
                </button>

                {/* Tasks */}
                <AnimatePresence>
                  {isExpanded && !isLocked && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      {phase.tasks.map((task) => (
                        <button
                          key={task.id}
                          onClick={() => task.status !== 'locked' && setSelectedTask(task.id)}
                          disabled={task.status === 'locked'}
                          className={`w-full pl-12 pr-6 py-2 flex items-center gap-3 transition-all ${
                            selectedTask === task.id ? 'bg-blue-500/10' : 'hover:bg-white/[0.02]'
                          } ${task.status === 'locked' ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          <StatusDot status={task.status} size="sm" />
                          <span className="flex-1 text-left text-xs text-white/60 truncate">{task.title}</span>
                          <TypeIcon type={task.type} />
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/[0.06]">
          <button 
            onClick={() => setView('passport')}
            className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all ${
              view === 'passport' 
                ? 'bg-white text-[#080d14]' 
                : 'bg-white/[0.04] text-white/60 hover:bg-white/[0.08] hover:text-white'
            }`}
          >
            Woonpaspoort
          </button>
        </div>
      </aside>

      {/* ========== MAIN CONTENT ========== */}
      <main className="flex-1 flex flex-col">
        
        {/* Top Bar */}
        <header className="h-14 border-b border-white/[0.06] px-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setAppState(AppState.LANDING)}
              className="flex items-center gap-2 text-white/40 hover:text-white transition-colors"
            >
              <ArrowLeft size={16} />
              <span className="text-sm">Terug</span>
            </button>
            <div className="w-px h-5 bg-white/10" />
            <span className="text-white/60 text-sm">Bouwbesturingssysteem</span>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center transition-colors">
              <Bell size={16} className="text-white/60" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-blue-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">3</span>
            </button>
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
              JD
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {view === 'tasks' ? (
            <div className="max-w-3xl mx-auto p-8">
              {currentTask ? (
                <TaskView task={currentTask} phase={currentPhase?.name || ''} />
              ) : (
                <EmptyState />
              )}
            </div>
          ) : (
            <div className="max-w-3xl mx-auto p-8">
              <PassportView phases={PHASES} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// ============================================
// TASK VIEW
// ============================================

const TaskView: React.FC<{ task: Task; phase: string }> = ({ task, phase }) => {
  const [isDragging, setIsDragging] = useState(false);

  const statusConfig: Record<TaskStatus, { label: string; color: string; bg: string }> = {
    locked: { label: 'Vergrendeld', color: 'text-white/40', bg: 'bg-white/10' },
    active: { label: 'Actief', color: 'text-blue-400', bg: 'bg-blue-500/10' },
    pending: { label: 'In review', color: 'text-amber-400', bg: 'bg-amber-500/10' },
    rejected: { label: 'Afgekeurd', color: 'text-red-400', bg: 'bg-red-500/10' },
    verified: { label: 'Geverifieerd', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  };

  const roleLabels = {
    aannemer: 'Aannemer',
    klant: 'Klant',
    kwaliteitsborger: 'Kwaliteitsborger',
  };

  const config = statusConfig[task.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-white/40 mb-6">
        <span>{phase}</span>
        <ChevronRight size={14} />
        <span className="text-white/80">{task.title}</span>
      </div>

      {/* Task Card */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-white/[0.06]">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider ${config.bg} ${config.color}`}>
                  {config.label}
                </span>
                <span className="px-2 py-0.5 rounded bg-white/[0.06] text-white/50 text-[10px] font-medium uppercase tracking-wider">
                  {roleLabels[task.role]}
                </span>
              </div>
              <h2 className="text-xl font-medium text-white">{task.title}</h2>
            </div>
            {task.status === 'active' && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <Clock size={14} className="text-amber-400" />
                <span className="text-amber-400 text-xs font-mono">48u</span>
              </div>
            )}
          </div>
          <p className="text-white/50 text-sm">
            {task.type === 'photo' ? 'Upload een foto als bewijs voor deze stap.' :
             task.type === 'video' ? 'Upload een video als bewijs voor deze stap.' :
             'Upload het vereiste document.'}
          </p>
        </div>

        {/* Upload Area (Active State) */}
        {task.status === 'active' && (
          <div className="p-6">
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={() => setIsDragging(false)}
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer ${
                isDragging 
                  ? 'border-blue-400 bg-blue-500/5' 
                  : 'border-white/10 hover:border-white/20 hover:bg-white/[0.02]'
              }`}
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-white/[0.04] flex items-center justify-center">
                <Upload size={24} className="text-white/40" />
              </div>
              <p className="text-white/80 font-medium mb-1">
                {task.type === 'photo' ? 'Maak een foto' : 
                 task.type === 'video' ? 'Neem video op' : 'Upload document'}
              </p>
              <p className="text-white/40 text-sm">
                Sleep hier of klik om te uploaden
              </p>
            </div>

            {/* Metadata note */}
            <div className="flex items-center justify-center gap-6 mt-4 text-[11px] text-white/30">
              <span className="flex items-center gap-1.5">
                <MapPin size={11} /> GPS
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={11} /> Timestamp
              </span>
              <span className="flex items-center gap-1.5">
                <Compass size={11} /> Richting
              </span>
            </div>
          </div>
        )}

        {/* Pending State */}
        {task.status === 'pending' && (
          <div className="p-6 bg-amber-500/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Loader2 size={20} className="text-amber-400 animate-spin" />
              </div>
              <div>
                <p className="text-amber-400 font-medium text-sm">In review</p>
                <p className="text-white/40 text-xs">Gemini Vision AI analyseert je upload</p>
              </div>
            </div>
          </div>
        )}

        {/* Verified State */}
        {task.status === 'verified' && task.verifiedAt && (
          <div className="p-6 bg-emerald-500/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 size={20} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-emerald-400 font-medium text-sm">Geverifieerd</p>
                  <p className="text-white/40 text-xs">{task.verifiedBy} · {task.verifiedAt}</p>
                </div>
              </div>
              {task.hash && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.04] rounded-lg">
                  <Shield size={12} className="text-blue-400" />
                  <code className="text-[10px] text-white/50 font-mono">{task.hash}</code>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Rejected State */}
        {task.status === 'rejected' && (
          <div className="p-6 bg-red-500/5">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                <XCircle size={20} className="text-red-400" />
              </div>
              <div>
                <p className="text-red-400 font-medium text-sm">Afgekeurd</p>
                <p className="text-white/40 text-xs">Upload voldoet niet aan de vereisten</p>
              </div>
            </div>
            <button className="w-full py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm font-medium transition-colors">
              Opnieuw uploaden
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ============================================
// PASSPORT VIEW
// ============================================

const PassportView: React.FC<{ phases: Phase[] }> = ({ phases }) => {
  const verifiedTasks = phases.flatMap(p => p.tasks).filter(t => t.status === 'verified');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center">
          <FileText size={24} className="text-blue-400" />
        </div>
        <div>
          <h1 className="text-xl font-medium text-white">Woonpaspoort</h1>
          <p className="text-white/40 text-sm">Digitale tweeling van je woning</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="p-5 bg-white/[0.02] border border-white/[0.06] rounded-xl">
          <div className="text-3xl font-light text-white mb-1">{verifiedTasks.length}</div>
          <div className="text-white/40 text-sm">Geverifieerde documenten</div>
        </div>
        <div className="p-5 bg-white/[0.02] border border-white/[0.06] rounded-xl">
          <div className="text-3xl font-light text-emerald-400 mb-1">
            {Math.round(phases.reduce((acc, p) => acc + p.progress, 0) / phases.length)}%
          </div>
          <div className="text-white/40 text-sm">Project compleetheid</div>
        </div>
      </div>

      {/* Documents */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/[0.06]">
          <h2 className="text-sm font-medium text-white/80">Vastgelegde documenten</h2>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {verifiedTasks.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-white/40 text-sm">Nog geen geverifieerde documenten</p>
            </div>
          ) : (
            verifiedTasks.map((task) => (
              <div 
                key={task.id} 
                className="p-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <TypeIcon type={task.type} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white/80 text-sm truncate">{task.title}</p>
                  <p className="text-white/40 text-xs">{task.verifiedAt}</p>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center transition-colors">
                    <Eye size={14} className="text-white/60" />
                  </button>
                  <button className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center transition-colors">
                    <Download size={14} className="text-white/60" />
                  </button>
                </div>
                {task.hash && (
                  <div className="hidden group-hover:flex items-center gap-1.5 px-2 py-1 bg-blue-500/10 rounded text-[10px] text-blue-400">
                    <Shield size={10} />
                    <code className="font-mono">{task.hash}</code>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ============================================
// EMPTY STATE
// ============================================

const EmptyState: React.FC = () => (
  <div className="h-full flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/[0.04] flex items-center justify-center">
        <FileText size={28} className="text-white/20" />
      </div>
      <h3 className="text-white/60 font-medium mb-1">Selecteer een taak</h3>
      <p className="text-white/30 text-sm">Klik op een item in de tijdlijn</p>
    </div>
  </div>
);

export default CollaborativeWorkspace;
