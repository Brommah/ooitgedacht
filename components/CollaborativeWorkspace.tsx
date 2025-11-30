import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, Lock, Clock, ChevronRight, ChevronDown, 
  FileText, Camera, Video, MapPin, Bell, 
  Download, Shield, Eye, CheckCircle2, XCircle, 
  Loader2, ArrowLeft, Upload, Compass, Home, Sparkles,
  Building2, Calendar, Users, TrendingUp, MoreHorizontal, Search
} from 'lucide-react';
import { AppState, TaskStatus } from '../types';

// ============================================
// DATA TYPES & DEMO DATA
// ============================================

interface Task {
  id: string;
  title: string;
  description: string;
  role: 'aannemer' | 'klant' | 'kwaliteitsborger';
  status: TaskStatus;
  type: 'photo' | 'video' | 'document';
  verifiedAt?: string;
  verifiedBy?: string;
  hash?: string;
  imageUrl?: string;
}

interface Phase {
  id: string;
  name: string;
  icon: string;
  status: TaskStatus;
  progress: number;
  tasks: Task[];
}

const PHASES: Phase[] = [
  {
    id: 'voorbereiding',
    name: 'Voorbereiding',
    icon: '📋',
    status: 'verified',
    progress: 100,
    tasks: [
      { id: 't1', title: 'Bouwvergunning', description: 'Gemeente goedkeuring ontvangen', role: 'klant', status: 'verified', type: 'document', verifiedAt: '15 nov 2024', verifiedBy: 'Bureau Broersma', hash: '0x7f3a...b2c1' },
      { id: 't2', title: 'Grondonderzoek', description: 'Bodemanalyse en sondering', role: 'aannemer', status: 'verified', type: 'document', verifiedAt: '20 nov 2024', verifiedBy: 'Bureau Broersma', hash: '0x8b2c...d4e5' },
    ]
  },
  {
    id: 'fundering',
    name: 'Fundering',
    icon: '🏗️',
    status: 'active',
    progress: 60,
    tasks: [
      { id: 't3', title: 'Uitgraven bouwput', description: 'Bouwput met dieptemeting', role: 'aannemer', status: 'verified', type: 'photo', verifiedAt: '25 nov 2024', verifiedBy: 'AI + Expert', hash: '0x9d4e...f6a7', imageUrl: '/generated/steps/step-02-kavel-check.jpg' },
      { id: 't4', title: 'Wapeningsstaal', description: 'Wapening keuring As-A t/m D', role: 'aannemer', status: 'verified', type: 'photo', verifiedAt: '28 nov 2024', verifiedBy: 'Bureau Broersma', hash: '0xa1f2...g8h9', imageUrl: '/generated/steps/step-01-vibe-stijl.jpg' },
      { id: 't5', title: 'Betonbon', description: 'Betonbon met sterkteklasse', role: 'aannemer', status: 'pending', type: 'document' },
      { id: 't6', title: 'Storten fundering', description: 'Foto tijdens storten + drukproef', role: 'aannemer', status: 'active', type: 'photo' },
      { id: 't7', title: 'Uitharding controle', description: '28-dagen sterkte certificaat', role: 'kwaliteitsborger', status: 'locked', type: 'document' },
    ]
  },
  {
    id: 'ruwbouw',
    name: 'Ruwbouw',
    icon: '🧱',
    status: 'locked',
    progress: 0,
    tasks: [
      { id: 't8', title: 'HSB elementen', description: 'Levering houtskeletbouw', role: 'aannemer', status: 'locked', type: 'photo' },
      { id: 't9', title: 'Montage', description: 'Plaatsing begane grond', role: 'aannemer', status: 'locked', type: 'photo' },
    ]
  },
  {
    id: 'dak',
    name: 'Dakconstructie',
    icon: '🏠',
    status: 'locked',
    progress: 0,
    tasks: [
      { id: 't10', title: 'Dakspanten', description: 'Plaatsing dakconstructie', role: 'aannemer', status: 'locked', type: 'photo' },
      { id: 't11', title: 'Dakbedekking', description: 'Aanbrengen dakpannen', role: 'aannemer', status: 'locked', type: 'photo' },
    ]
  },
  {
    id: 'installaties',
    name: 'Installaties',
    icon: '⚡',
    status: 'locked',
    progress: 0,
    tasks: [
      { id: 't12', title: 'Leidingwerk', description: 'Water en afvoer', role: 'aannemer', status: 'locked', type: 'photo' },
      { id: 't13', title: 'Elektra', description: 'Bekabeling per ruimte', role: 'aannemer', status: 'locked', type: 'photo' },
    ]
  },
  {
    id: 'oplevering',
    name: 'Oplevering',
    icon: '🔑',
    status: 'locked',
    progress: 0,
    tasks: [
      { id: 't14', title: 'Eindkeuring', description: 'Volledige keuringsrapport', role: 'kwaliteitsborger', status: 'locked', type: 'document' },
      { id: 't15', title: 'Sleuteloverdracht', description: 'Officiële overdracht', role: 'klant', status: 'locked', type: 'photo' },
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
  const [selectedPhase, setSelectedPhase] = useState('fundering');
  const [selectedTask, setSelectedTask] = useState<string | null>('t6');
  const [expandedPhases, setExpandedPhases] = useState<string[]>(['voorbereiding', 'fundering']);
  const [view, setView] = useState<'overview' | 'task' | 'passport'>('task');

  const currentPhase = PHASES.find(p => p.id === selectedPhase);
  const currentTask = currentPhase?.tasks.find(t => t.id === selectedTask);
  const totalProgress = Math.round(PHASES.reduce((acc, p) => acc + p.progress, 0) / PHASES.length);
  const verifiedCount = PHASES.flatMap(p => p.tasks).filter(t => t.status === 'verified').length;
  const totalTasks = PHASES.flatMap(p => p.tasks).length;

  const togglePhase = (id: string) => {
    const phase = PHASES.find(p => p.id === id);
    if (phase?.status === 'locked') return;
    setExpandedPhases(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
    setSelectedPhase(id);
  };

  const selectTask = (taskId: string, phaseId: string) => {
    setSelectedTask(taskId);
    setSelectedPhase(phaseId);
    setView('task');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* ========== TOP NAVIGATION ========== */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setAppState(AppState.LANDING)}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
              <span className="text-sm font-medium">Terug</span>
            </button>
            
            <div className="h-6 w-px bg-slate-200" />
            
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Building2 size={18} className="text-white" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-slate-900">Veluwse Heide Residence</h1>
                <p className="text-xs text-slate-500">Ermelo, Gelderland</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Zoeken..."
                className="w-48 pl-9 pr-4 py-2 bg-slate-100 border-0 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
              />
            </div>
            
            <button className="relative w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
              <Bell size={18} className="text-slate-600" />
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center shadow-lg shadow-red-500/30">3</span>
            </button>
            
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-emerald-500/20 cursor-pointer hover:shadow-emerald-500/40 transition-shadow">
              JD
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-6 py-8">
        {/* ========== HERO STATS ========== */}
        <div className="mb-8">
          <div className="grid grid-cols-4 gap-4">
            {/* Progress Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-span-2 p-6 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-3xl shadow-2xl shadow-blue-500/20 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
              <div className="relative">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="text-blue-200 text-sm font-medium mb-1">Totale Voortgang</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold text-white">{totalProgress}</span>
                      <span className="text-2xl text-blue-200">%</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center">
                    <TrendingUp size={24} className="text-white" />
                  </div>
                </div>
                <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-white to-blue-200 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${totalProgress}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </div>
                <div className="flex items-center justify-between mt-3 text-sm">
                  <span className="text-blue-200">Fase: {currentPhase?.name}</span>
                  <span className="text-white font-medium">{verifiedCount}/{totalTasks} taken voltooid</span>
                </div>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mb-4">
                <CheckCircle2 size={24} className="text-emerald-600" />
              </div>
              <p className="text-slate-500 text-sm mb-1">Geverifieerd</p>
              <p className="text-3xl font-bold text-slate-900">{verifiedCount}</p>
              <p className="text-emerald-600 text-xs font-medium mt-1">+2 deze week</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center mb-4">
                <Clock size={24} className="text-amber-600" />
              </div>
              <p className="text-slate-500 text-sm mb-1">In Review</p>
              <p className="text-3xl font-bold text-slate-900">1</p>
              <p className="text-amber-600 text-xs font-medium mt-1">Wacht op validatie</p>
            </motion.div>
          </div>
        </div>

        {/* ========== MAIN CONTENT ========== */}
        <div className="grid grid-cols-12 gap-6">
          {/* Timeline Sidebar */}
          <motion.aside 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="col-span-3"
          >
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden sticky top-24">
              <div className="p-5 border-b border-slate-100">
                <h2 className="font-semibold text-slate-900">Bouwfases</h2>
                <p className="text-sm text-slate-500 mt-0.5">Klik om details te zien</p>
              </div>
              
              <div className="p-3 max-h-[calc(100vh-320px)] overflow-y-auto">
                {PHASES.map((phase, idx) => {
                  const isExpanded = expandedPhases.includes(phase.id);
                  const isLocked = phase.status === 'locked';
                  const completedTasks = phase.tasks.filter(t => t.status === 'verified').length;

                  return (
                    <div key={phase.id} className="mb-1">
                      <button
                        onClick={() => togglePhase(phase.id)}
                        disabled={isLocked}
                        className={`w-full p-3 rounded-2xl flex items-center gap-3 transition-all ${
                          selectedPhase === phase.id && !isLocked
                            ? 'bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md' 
                            : isLocked 
                              ? 'opacity-50 cursor-not-allowed' 
                              : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                          phase.status === 'verified' ? 'bg-gradient-to-br from-emerald-100 to-teal-100' :
                          phase.status === 'active' ? 'bg-gradient-to-br from-blue-100 to-indigo-100' :
                          'bg-slate-100'
                        }`}>
                          {phase.status === 'verified' ? <Check size={18} className="text-emerald-600" /> :
                           phase.status === 'locked' ? <Lock size={16} className="text-slate-400" /> :
                           phase.icon}
                        </div>
                        <div className="flex-1 text-left">
                          <p className={`font-medium text-sm ${isLocked ? 'text-slate-400' : 'text-slate-900'}`}>
                            {phase.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {completedTasks}/{phase.tasks.length} taken
                          </p>
                        </div>
                        {!isLocked && (
                          <ChevronDown 
                            size={16} 
                            className={`text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          />
                        )}
                      </button>

                      <AnimatePresence>
                        {isExpanded && !isLocked && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="ml-5 pl-5 border-l-2 border-slate-200 py-2 space-y-1">
                              {phase.tasks.map((task) => (
                                <button
                                  key={task.id}
                                  onClick={() => task.status !== 'locked' && selectTask(task.id, phase.id)}
                                  disabled={task.status === 'locked'}
                                  className={`w-full p-2.5 rounded-xl flex items-center gap-3 transition-all text-left ${
                                    selectedTask === task.id 
                                      ? 'bg-blue-500 shadow-lg shadow-blue-500/30' 
                                      : task.status === 'locked'
                                        ? 'opacity-40 cursor-not-allowed'
                                        : 'hover:bg-slate-50'
                                  }`}
                                >
                                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                                    task.status === 'verified' ? 'bg-emerald-500' :
                                    task.status === 'active' ? 'bg-blue-500 ring-4 ring-blue-500/20' :
                                    task.status === 'pending' ? 'bg-amber-500' :
                                    task.status === 'rejected' ? 'bg-red-500' :
                                    'bg-slate-300'
                                  }`} />
                                  <span className={`text-xs font-medium truncate ${
                                    selectedTask === task.id ? 'text-white' : 'text-slate-700'
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

              {/* Passport Button */}
              <div className="p-4 border-t border-slate-100">
                <button 
                  onClick={() => setView('passport')}
                  className={`w-full p-3 rounded-2xl flex items-center justify-center gap-2 font-medium text-sm transition-all ${
                    view === 'passport'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <FileText size={16} />
                  Woonpaspoort
                </button>
              </div>
            </div>
          </motion.aside>

          {/* Main Content */}
          <main className="col-span-9">
            <AnimatePresence mode="wait">
              {view === 'task' && currentTask ? (
                <TaskDetailView 
                  key={currentTask.id}
                  task={currentTask} 
                  phase={currentPhase!}
                />
              ) : view === 'passport' ? (
                <PassportView key="passport" phases={PHASES} />
              ) : (
                <EmptyState key="empty" />
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};

// ============================================
// TASK DETAIL VIEW
// ============================================

const TaskDetailView: React.FC<{ task: Task; phase: Phase }> = ({ task, phase }) => {
  const [isDragging, setIsDragging] = useState(false);

  const statusConfig: Record<TaskStatus, { label: string; color: string; bg: string; border: string }> = {
    locked: { label: 'Vergrendeld', color: 'text-slate-500', bg: 'bg-slate-100', border: 'border-slate-200' },
    active: { label: 'Actief', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
    pending: { label: 'In Review', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
    rejected: { label: 'Afgekeurd', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' },
    verified: { label: 'Geverifieerd', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  };

  const roleConfig = {
    aannemer: { label: 'Aannemer', color: 'text-orange-700', bg: 'bg-orange-50' },
    klant: { label: 'Klant', color: 'text-blue-700', bg: 'bg-blue-50' },
    kwaliteitsborger: { label: 'Kwaliteitsborger', color: 'text-purple-700', bg: 'bg-purple-50' },
  };

  const config = statusConfig[task.status];
  const roleConf = roleConfig[task.role];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6">
        <span className="text-slate-500">{phase.name}</span>
        <ChevronRight size={14} className="text-slate-400" />
        <span className="text-slate-900 font-medium">{task.title}</span>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Task Card */}
        <div className="col-span-2">
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.color} border ${config.border}`}>
                    {config.label}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${roleConf.bg} ${roleConf.color}`}>
                    {roleConf.label}
                  </span>
                </div>
                {task.status === 'active' && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
                    <Clock size={16} className="text-amber-600" />
                    <span className="text-amber-700 text-sm font-semibold">48 uur resterend</span>
                  </div>
                )}
              </div>
              
              <h2 className="text-2xl font-bold text-slate-900 mb-2">{task.title}</h2>
              <p className="text-slate-600">{task.description}</p>
            </div>

            {/* Upload Zone (Active) */}
            {task.status === 'active' && (
              <div className="p-6">
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={() => setIsDragging(false)}
                  className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
                    isDragging 
                      ? 'border-blue-400 bg-blue-50' 
                      : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                    <Upload size={32} className="text-blue-600" />
                  </div>
                  <p className="text-lg font-semibold text-slate-900 mb-2">
                    {task.type === 'photo' ? 'Maak een foto of sleep hier' : 
                     task.type === 'video' ? 'Neem video op of sleep hier' : 
                     'Upload document'}
                  </p>
                  <p className="text-slate-500 mb-4">
                    Ondersteunde formaten: {task.type === 'photo' ? 'JPG, PNG, HEIC' : 
                                            task.type === 'video' ? 'MP4, MOV' : 'PDF, DOC'}
                  </p>
                  <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-shadow">
                    Bestand kiezen
                  </button>
                </div>

                {/* Metadata Capture Info */}
                <div className="flex items-center justify-center gap-8 mt-6 py-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <div className="w-8 h-8 rounded-lg bg-white shadow flex items-center justify-center">
                      <MapPin size={14} className="text-blue-600" />
                    </div>
                    <span>GPS Locatie</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <div className="w-8 h-8 rounded-lg bg-white shadow flex items-center justify-center">
                      <Clock size={14} className="text-blue-600" />
                    </div>
                    <span>Timestamp</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <div className="w-8 h-8 rounded-lg bg-white shadow flex items-center justify-center">
                      <Compass size={14} className="text-blue-600" />
                    </div>
                    <span>Richting</span>
                  </div>
                </div>
              </div>
            )}

            {/* Pending State */}
            {task.status === 'pending' && (
              <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-lg flex items-center justify-center">
                    <Loader2 size={24} className="text-amber-600 animate-spin" />
                  </div>
                  <div>
                    <p className="text-amber-800 font-semibold">In review door AI</p>
                    <p className="text-amber-600 text-sm">Gemini Vision analyseert je upload...</p>
                  </div>
                </div>
              </div>
            )}

            {/* Verified State */}
            {task.status === 'verified' && (
              <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-lg flex items-center justify-center">
                      <CheckCircle2 size={24} className="text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-emerald-800 font-semibold">Geverifieerd ✓</p>
                      <p className="text-emerald-600 text-sm">{task.verifiedBy} · {task.verifiedAt}</p>
                    </div>
                  </div>
                  {task.hash && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow">
                      <Shield size={14} className="text-blue-600" />
                      <code className="text-xs text-slate-600 font-mono">{task.hash}</code>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Rejected State */}
            {task.status === 'rejected' && (
              <div className="p-6 bg-gradient-to-r from-red-50 to-pink-50">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-lg flex items-center justify-center">
                    <XCircle size={24} className="text-red-600" />
                  </div>
                  <div>
                    <p className="text-red-800 font-semibold">Afgekeurd</p>
                    <p className="text-red-600 text-sm">Upload voldoet niet aan vereisten</p>
                  </div>
                </div>
                <button className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors">
                  Opnieuw uploaden
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Reference Image */}
          {task.imageUrl && (
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
              <div className="p-4 border-b border-slate-100">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  <Eye size={16} className="text-blue-600" />
                  Referentie
                </h3>
              </div>
              <div className="p-4">
                <img 
                  src={task.imageUrl} 
                  alt="Reference" 
                  className="w-full h-48 object-cover rounded-2xl"
                />
                <p className="text-xs text-slate-500 mt-3 text-center">
                  Zorg dat dit zichtbaar is in je foto
                </p>
              </div>
            </div>
          )}

          {/* Task Info */}
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-5">
            <h3 className="font-semibold text-slate-900 mb-4">Details</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-sm text-slate-500">Type</span>
                <span className="text-sm font-medium text-slate-900 capitalize flex items-center gap-2">
                  {task.type === 'photo' ? <Camera size={14} /> : 
                   task.type === 'video' ? <Video size={14} /> : 
                   <FileText size={14} />}
                  {task.type}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-sm text-slate-500">Fase</span>
                <span className="text-sm font-medium text-slate-900">{phase.name}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-slate-500">Verantwoordelijke</span>
                <span className={`text-sm font-medium ${roleConf.color}`}>{roleConf.label}</span>
              </div>
            </div>
          </div>

          {/* AI Assistant */}
          <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl p-5 text-white shadow-xl shadow-purple-500/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Sparkles size={20} />
              </div>
              <div>
                <p className="font-semibold">AI Assistent</p>
                <p className="text-purple-200 text-xs">Powered by Gemini</p>
              </div>
            </div>
            <p className="text-purple-100 text-sm">
              Upload je foto en AI valideert automatisch of deze voldoet aan de bouwnormen.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ============================================
// PASSPORT VIEW
// ============================================

const PassportView: React.FC<{ phases: Phase[] }> = ({ phases }) => {
  const verifiedTasks = phases.flatMap(p => p.tasks).filter(t => t.status === 'verified');
  const totalProgress = Math.round(phases.reduce((acc, p) => acc + p.progress, 0) / phases.length);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 mb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')]" />
        <div className="relative flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-500/30">
            <FileText size={36} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Woonpaspoort</h1>
            <p className="text-slate-400">Digitale tweeling van Veluwse Heide Residence</p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium text-sm transition-colors flex items-center gap-2">
              <Download size={16} />
              Exporteren
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 shadow-xl shadow-slate-200/50 border border-slate-100">
          <p className="text-slate-500 text-sm mb-1">Documenten</p>
          <p className="text-3xl font-bold text-slate-900">{verifiedTasks.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-xl shadow-slate-200/50 border border-slate-100">
          <p className="text-slate-500 text-sm mb-1">Compleetheid</p>
          <p className="text-3xl font-bold text-emerald-600">{totalProgress}%</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-xl shadow-slate-200/50 border border-slate-100">
          <p className="text-slate-500 text-sm mb-1">Blockchain Hashes</p>
          <p className="text-3xl font-bold text-blue-600">{verifiedTasks.filter(t => t.hash).length}</p>
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Geverifieerde Documenten</h2>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold">
            {verifiedTasks.length} items
          </span>
        </div>
        <div className="divide-y divide-slate-100">
          {verifiedTasks.map((task, idx) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors cursor-pointer group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                task.type === 'photo' ? 'bg-blue-100' : 
                task.type === 'video' ? 'bg-purple-100' : 'bg-amber-100'
              }`}>
                {task.type === 'photo' ? <Camera size={20} className="text-blue-600" /> :
                 task.type === 'video' ? <Video size={20} className="text-purple-600" /> :
                 <FileText size={20} className="text-amber-600" />}
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-900">{task.title}</p>
                <p className="text-sm text-slate-500">{task.verifiedAt} · {task.verifiedBy}</p>
              </div>
              {task.hash && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <Shield size={12} className="text-blue-600" />
                  <code className="text-[10px] text-slate-600 font-mono">{task.hash}</code>
                </div>
              )}
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                  <Eye size={16} className="text-slate-600" />
                </button>
                <button className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                  <Download size={16} className="text-slate-600" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// ============================================
// EMPTY STATE
// ============================================

const EmptyState: React.FC = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="h-96 flex items-center justify-center"
  >
    <div className="text-center">
      <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-slate-100 flex items-center justify-center">
        <FileText size={32} className="text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-1">Selecteer een taak</h3>
      <p className="text-slate-500">Klik op een item in de tijdlijn om te beginnen</p>
    </div>
  </motion.div>
);

export default CollaborativeWorkspace;
