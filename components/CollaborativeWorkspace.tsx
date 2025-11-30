import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, Lock, Clock, ChevronRight, ChevronDown, 
  FileText, Camera, MapPin, Bell, 
  Download, Shield, CheckCircle2, 
  Loader2, ArrowLeft, Upload, Sparkles,
  Calendar, Home, Eye
} from 'lucide-react';
import { AppState, TaskStatus } from '../types';

// ============================================
// CLEAN DATA STRUCTURE
// ============================================

interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  type: 'photo' | 'document';
  verifiedAt?: string;
  hash?: string;
  imageUrl?: string;
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
      { id: 't1', title: 'Bouwvergunning', description: 'Gemeente goedkeuring', status: 'verified', type: 'document', verifiedAt: '15 nov', hash: '0x7f3a...b2c1' },
      { id: 't2', title: 'Grondonderzoek', description: 'Bodemanalyse', status: 'verified', type: 'document', verifiedAt: '20 nov', hash: '0x8b2c...d4e5' },
    ]
  },
  {
    id: 'fundering',
    name: 'Fundering',
    status: 'active',
    progress: 60,
    tasks: [
      { id: 't3', title: 'Uitgraven bouwput', description: 'Bouwput gereed', status: 'verified', type: 'photo', verifiedAt: '25 nov', hash: '0x9d4e...f6a7', imageUrl: '/generated/steps/step-02-kavel-check.jpg' },
      { id: 't4', title: 'Wapeningsstaal', description: 'Wapening As-A t/m D', status: 'verified', type: 'photo', verifiedAt: '28 nov', hash: '0xa1f2...g8h9', imageUrl: '/generated/steps/step-01-vibe-stijl.jpg' },
      { id: 't5', title: 'Betonbon', description: 'Sterkteklasse verificatie', status: 'pending', type: 'document' },
      { id: 't6', title: 'Storten fundering', description: 'Foto tijdens storten', status: 'active', type: 'photo' },
      { id: 't7', title: 'Uitharding', description: '28-dagen certificaat', status: 'locked', type: 'document' },
    ]
  },
  {
    id: 'ruwbouw',
    name: 'Ruwbouw',
    status: 'locked',
    progress: 0,
    tasks: [
      { id: 't8', title: 'HSB elementen', description: 'Houtskeletbouw', status: 'locked', type: 'photo' },
      { id: 't9', title: 'Montage', description: 'Begane grond', status: 'locked', type: 'photo' },
    ]
  },
  {
    id: 'afbouw',
    name: 'Afbouw & Oplevering',
    status: 'locked',
    progress: 0,
    tasks: [
      { id: 't10', title: 'Installaties', description: 'Elektra & leidingwerk', status: 'locked', type: 'photo' },
      { id: 't11', title: 'Eindkeuring', description: 'Keuringsrapport', status: 'locked', type: 'document' },
    ]
  },
];

// ============================================
// MAIN COMPONENT
// ============================================

interface Props {
  setAppState: (state: AppState) => void;
}

export const CollaborativeWorkspace: React.FC<Props> = ({ setAppState }) => {
  const [selectedTask, setSelectedTask] = useState<string>('t6');
  const [expandedPhase, setExpandedPhase] = useState<string>('fundering');

  const allTasks = PHASES.flatMap(p => p.tasks);
  const currentTask = allTasks.find(t => t.id === selectedTask);
  const currentPhase = PHASES.find(p => p.tasks.some(t => t.id === selectedTask));
  const totalProgress = Math.round(PHASES.reduce((acc, p) => acc + p.progress, 0) / PHASES.length);
  const verifiedCount = allTasks.filter(t => t.status === 'verified').length;

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      {/* ===== MINIMAL HEADER ===== */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setAppState(AppState.LANDING)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
                <Home size={16} className="text-white" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-slate-900">Veluwse Heide Residence</h1>
                <p className="text-xs text-slate-500">Ermelo · 185m² · Juni 2025</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-2xl font-bold text-slate-900">{totalProgress}%</p>
              <p className="text-xs text-slate-500">{verifiedCount} taken voltooid</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
              <Bell size={18} className="text-slate-500" />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="grid grid-cols-12 gap-8">
          
          {/* ===== LEFT: TIMELINE ===== */}
          <aside className="col-span-4">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h2 className="text-sm font-semibold text-slate-900">Bouwfases</h2>
              </div>
              
              <div className="p-4">
                {PHASES.map((phase, idx) => {
                  const isExpanded = expandedPhase === phase.id;
                  const isLocked = phase.status === 'locked';
                  const completedTasks = phase.tasks.filter(t => t.status === 'verified').length;

                  return (
                    <div key={phase.id} className="mb-2 last:mb-0">
                      {/* Phase Header */}
                      <button
                        onClick={() => !isLocked && setExpandedPhase(isExpanded ? '' : phase.id)}
                        disabled={isLocked}
                        className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${
                          isExpanded ? 'bg-slate-900 text-white' : 
                          isLocked ? 'opacity-40 cursor-not-allowed' : 
                          'hover:bg-slate-50'
                        }`}
                      >
                        {/* Status Indicator */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          phase.status === 'verified' ? 'bg-emerald-500 text-white' :
                          phase.status === 'active' ? (isExpanded ? 'bg-white text-slate-900' : 'bg-blue-500 text-white') :
                          'bg-slate-200 text-slate-400'
                        }`}>
                          {phase.status === 'verified' ? <Check size={16} /> :
                           phase.status === 'locked' ? <Lock size={14} /> :
                           <span className="text-xs font-bold">{idx + 1}</span>}
                        </div>

                        <div className="flex-1 text-left">
                          <p className={`text-sm font-medium ${isExpanded ? 'text-white' : 'text-slate-900'}`}>
                            {phase.name}
                          </p>
                          <p className={`text-xs ${isExpanded ? 'text-slate-300' : 'text-slate-500'}`}>
                            {completedTasks}/{phase.tasks.length} taken
                          </p>
                        </div>

                        {!isLocked && (
                          <ChevronDown size={16} className={`transition-transform ${isExpanded ? 'rotate-180' : ''} ${isExpanded ? 'text-slate-300' : 'text-slate-400'}`} />
                        )}
                      </button>

                      {/* Expanded Tasks */}
                      <AnimatePresence>
                        {isExpanded && !isLocked && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-2 pl-6 space-y-1">
                              {phase.tasks.map((task) => (
                                <button
                                  key={task.id}
                                  onClick={() => task.status !== 'locked' && setSelectedTask(task.id)}
                                  disabled={task.status === 'locked'}
                                  className={`w-full px-4 py-2.5 rounded-lg flex items-center gap-3 transition-all text-left ${
                                    selectedTask === task.id 
                                      ? 'bg-blue-50 border border-blue-200' 
                                      : task.status === 'locked'
                                        ? 'opacity-40 cursor-not-allowed'
                                        : 'hover:bg-slate-50'
                                  }`}
                                >
                                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                    task.status === 'verified' ? 'bg-emerald-500' :
                                    task.status === 'active' ? 'bg-blue-500' :
                                    task.status === 'pending' ? 'bg-amber-500' :
                                    'bg-slate-300'
                                  }`} />
                                  <span className={`text-sm ${
                                    selectedTask === task.id ? 'text-blue-700 font-medium' : 'text-slate-700'
                                  }`}>
                                    {task.title}
                                  </span>
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
            </div>
          </aside>

          {/* ===== RIGHT: TASK DETAIL ===== */}
          <main className="col-span-8">
            {currentTask ? (
              <TaskCard task={currentTask} phase={currentPhase!} />
            ) : (
              <EmptyState />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

// ============================================
// TASK CARD - SINGLE FOCUSED COMPONENT
// ============================================

const TaskCard: React.FC<{ task: Task; phase: Phase }> = ({ task, phase }) => {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <motion.div
      key={task.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
    >
      {/* Breadcrumb */}
      <div className="px-8 py-4 border-b border-slate-100 flex items-center gap-2 text-sm">
        <span className="text-slate-500">{phase.name}</span>
        <ChevronRight size={14} className="text-slate-300" />
        <span className="text-slate-900 font-medium">{task.title}</span>
        
        <div className="ml-auto flex items-center gap-2">
          <StatusBadge status={task.status} />
          {task.status === 'active' && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium">
              <Clock size={12} />
              48u deadline
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Active: Upload Zone */}
        {task.status === 'active' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">{task.title}</h2>
              <p className="text-slate-600">{task.description}</p>
            </div>

            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={() => setIsDragging(false)}
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                isDragging 
                  ? 'border-blue-400 bg-blue-50' 
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                {task.type === 'photo' ? <Camera size={28} className="text-slate-400" /> : <FileText size={28} className="text-slate-400" />}
              </div>
              <p className="text-slate-900 font-medium mb-1">
                {task.type === 'photo' ? 'Upload foto' : 'Upload document'}
              </p>
              <p className="text-slate-500 text-sm mb-4">
                Sleep bestand hierheen of klik om te selecteren
              </p>
              <button className="px-6 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors">
                Bestand kiezen
              </button>
            </div>

            <div className="flex items-center gap-6 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <MapPin size={14} />
                GPS wordt vastgelegd
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                Timestamp automatisch
              </span>
            </div>
          </div>
        )}

        {/* Verified: Show Proof */}
        {task.status === 'verified' && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-2">{task.title}</h2>
                <p className="text-slate-600">{task.description}</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
                <CheckCircle2 size={16} />
                Geverifieerd
              </div>
            </div>

            {task.imageUrl && (
              <div className="relative rounded-xl overflow-hidden bg-slate-100">
                <img src={task.imageUrl} alt={task.title} className="w-full h-64 object-cover" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="px-3 py-1.5 bg-black/60 backdrop-blur text-white text-xs rounded-lg">
                    {task.verifiedAt}
                  </div>
                  {task.hash && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur text-white text-xs rounded-lg font-mono">
                      <Shield size={12} />
                      {task.hash}
                    </div>
                  )}
                </div>
              </div>
            )}

            {!task.imageUrl && (
              <div className="p-6 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <FileText size={24} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{task.title}.pdf</p>
                    <p className="text-sm text-slate-500">Geverifieerd op {task.verifiedAt}</p>
                  </div>
                  <button className="ml-auto px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2">
                    <Eye size={16} />
                    Bekijken
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Pending: In Review */}
        {task.status === 'pending' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">{task.title}</h2>
              <p className="text-slate-600">{task.description}</p>
            </div>

            <div className="p-8 bg-amber-50 rounded-xl text-center">
              <Loader2 size={32} className="mx-auto mb-4 text-amber-600 animate-spin" />
              <p className="text-amber-800 font-medium mb-1">In review</p>
              <p className="text-amber-600 text-sm">AI analyseert je upload...</p>
            </div>
          </div>
        )}

        {/* Locked: Coming Soon */}
        {task.status === 'locked' && (
          <div className="p-12 text-center">
            <Lock size={32} className="mx-auto mb-4 text-slate-300" />
            <p className="text-slate-500">Deze taak wordt ontgrendeld na voltooiing van vorige taken</p>
          </div>
        )}
      </div>

      {/* AI Assistant Footer */}
      {task.status === 'active' && (
        <div className="px-8 py-4 border-t border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
              <Sparkles size={16} className="text-violet-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-slate-700">
                <span className="font-medium">AI Verificatie:</span> Upload wordt automatisch geanalyseerd op kwaliteit en volledigheid
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// ============================================
// STATUS BADGE
// ============================================

const StatusBadge: React.FC<{ status: TaskStatus }> = ({ status }) => {
  const config: Record<TaskStatus, { label: string; className: string }> = {
    locked: { label: 'Vergrendeld', className: 'bg-slate-100 text-slate-500' },
    active: { label: 'Actief', className: 'bg-blue-100 text-blue-700' },
    pending: { label: 'In Review', className: 'bg-amber-100 text-amber-700' },
    rejected: { label: 'Afgekeurd', className: 'bg-red-100 text-red-700' },
    verified: { label: 'Voltooid', className: 'bg-emerald-100 text-emerald-700' },
  };

  const { label, className } = config[status];

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${className}`}>
      {label}
    </span>
  );
};

// ============================================
// EMPTY STATE
// ============================================

const EmptyState: React.FC = () => (
  <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
    <FileText size={40} className="mx-auto mb-4 text-slate-300" />
    <p className="text-slate-500">Selecteer een taak om te beginnen</p>
  </div>
);

export default CollaborativeWorkspace;
