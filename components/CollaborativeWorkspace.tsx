import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, Lock, Clock, ChevronRight, ChevronDown, 
  FileText, Camera, Video, MapPin, Bell, 
  Download, Shield, Eye, CheckCircle2, XCircle, 
  Loader2, ArrowLeft, Upload, Compass, Home, Sparkles,
  Building2, Calendar, Users, TrendingUp, Play, 
  Search, Sun, CloudRain, ThermometerSun, Wind,
  Euro, Ruler, Layers, Zap, TreePine, Car
} from 'lucide-react';
import { AppState, TaskStatus, UserPreferences, createDefaultPreferences } from '../types';

// ============================================
// PROJECT DATA WITH RICH CONTENT
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
  aiConfidence?: number;
}

interface Phase {
  id: string;
  name: string;
  icon: string;
  status: TaskStatus;
  progress: number;
  tasks: Task[];
  coverImage?: string;
}

interface ProjectData {
  name: string;
  location: string;
  style: string;
  sqm: number;
  bedrooms: number;
  bathrooms: number;
  budget: number;
  startDate: string;
  expectedCompletion: string;
  heroImage: string;
  blueprintImage: string;
  contractor: {
    name: string;
    logo: string;
    rating: number;
  };
  phases: Phase[];
  weather: {
    temp: number;
    condition: string;
    windSpeed: number;
  };
  recentActivity: {
    user: string;
    action: string;
    time: string;
    avatar: string;
  }[];
}

const PROJECT_DATA: ProjectData = {
  name: 'Veluwse Heide Residence',
  location: 'Ermelo, Gelderland',
  style: 'Houten Polderwoning',
  sqm: 185,
  bedrooms: 4,
  bathrooms: 2,
  budget: 485000,
  startDate: '15 Oktober 2024',
  expectedCompletion: 'Juni 2025',
  heroImage: '/generated/mood-v3/houten-polderwoning.png',
  blueprintImage: '/generated/blueprint-wood-house.png',
  contractor: {
    name: 'Van der Berg Bouw',
    logo: '/generated/og-logo.png',
    rating: 4.8,
  },
  weather: {
    temp: 8,
    condition: 'Bewolkt',
    windSpeed: 15,
  },
  recentActivity: [
    { user: 'Aannemer Jansen', action: 'Foto geüpload: Wapeningsstaal', time: '2 uur geleden', avatar: 'AJ' },
    { user: 'Bureau Broersma', action: 'Wapening goedgekeurd ✓', time: '1 uur geleden', avatar: 'BB' },
    { user: 'Jan de Vries', action: 'Opmerking geplaatst', time: '30 min geleden', avatar: 'JV' },
  ],
  phases: [
    {
      id: 'voorbereiding',
      name: 'Voorbereiding',
      icon: '📋',
      status: 'verified',
      progress: 100,
      coverImage: '/generated/steps/step-01-vibe-stijl.jpg',
      tasks: [
        { id: 't1', title: 'Bouwvergunning', description: 'Gemeente goedkeuring ontvangen', role: 'klant', status: 'verified', type: 'document', verifiedAt: '15 nov 2024', verifiedBy: 'Bureau Broersma', hash: '0x7f3a...b2c1', imageUrl: '/generated/steps/step-01-vibe-stijl.jpg' },
        { id: 't2', title: 'Grondonderzoek', description: 'Bodemanalyse en sondering', role: 'aannemer', status: 'verified', type: 'document', verifiedAt: '20 nov 2024', verifiedBy: 'Bureau Broersma', hash: '0x8b2c...d4e5', imageUrl: '/generated/steps/step-02-kavel-check.jpg' },
      ]
    },
    {
      id: 'fundering',
      name: 'Fundering',
      icon: '🏗️',
      status: 'active',
      progress: 60,
      coverImage: '/generated/steps/step-02-kavel-check.jpg',
      tasks: [
        { id: 't3', title: 'Uitgraven bouwput', description: 'Bouwput met dieptemeting', role: 'aannemer', status: 'verified', type: 'photo', verifiedAt: '25 nov 2024', verifiedBy: 'AI + Expert', hash: '0x9d4e...f6a7', imageUrl: '/generated/steps/step-02-kavel-check.jpg', aiConfidence: 98 },
        { id: 't4', title: 'Wapeningsstaal', description: 'Wapening keuring As-A t/m D', role: 'aannemer', status: 'verified', type: 'photo', verifiedAt: '28 nov 2024', verifiedBy: 'Bureau Broersma', hash: '0xa1f2...g8h9', imageUrl: '/generated/steps/step-01-vibe-stijl.jpg', aiConfidence: 94 },
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
      coverImage: '/generated/mood-v3/houten-polderwoning.png',
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
      coverImage: '/generated/mood-v3/boswoning.png',
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
      coverImage: '/generated/mood-v3/japandi-villa.png',
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
      coverImage: '/generated/mood-v3/strandvilla.png',
      tasks: [
        { id: 't14', title: 'Eindkeuring', description: 'Volledige keuringsrapport', role: 'kwaliteitsborger', status: 'locked', type: 'document' },
        { id: 't15', title: 'Sleuteloverdracht', description: 'Officiële overdracht', role: 'klant', status: 'locked', type: 'photo' },
      ]
    },
  ],
};

// ============================================
// MAIN COMPONENT
// ============================================

interface Props {
  setAppState: (state: AppState) => void;
}

export const CollaborativeWorkspace: React.FC<Props> = ({ setAppState }) => {
  const [project] = useState<ProjectData>(PROJECT_DATA);
  const [selectedPhase, setSelectedPhase] = useState('fundering');
  const [selectedTask, setSelectedTask] = useState<string | null>('t6');
  const [expandedPhases, setExpandedPhases] = useState<string[]>(['voorbereiding', 'fundering']);
  const [view, setView] = useState<'overview' | 'task' | 'passport' | 'timeline'>('overview');

  const currentPhase = project.phases.find(p => p.id === selectedPhase);
  const currentTask = currentPhase?.tasks.find(t => t.id === selectedTask);
  const totalProgress = Math.round(project.phases.reduce((acc, p) => acc + p.progress, 0) / project.phases.length);
  const verifiedCount = project.phases.flatMap(p => p.tasks).filter(t => t.status === 'verified').length;
  const totalTasks = project.phases.flatMap(p => p.tasks).length;

  const togglePhase = (id: string) => {
    const phase = project.phases.find(p => p.id === id);
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
        <div className="max-w-[1800px] mx-auto px-6 h-16 flex items-center justify-between">
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
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-blue-500/20">
                <img src={project.heroImage} alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-slate-900">{project.name}</h1>
                <p className="text-xs text-slate-500">{project.location}</p>
              </div>
            </div>
          </div>

          {/* View Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
            {[
              { id: 'overview', label: 'Overzicht', icon: Home },
              { id: 'task', label: 'Taken', icon: FileText },
              { id: 'timeline', label: 'Tijdlijn', icon: Calendar },
              { id: 'passport', label: 'Paspoort', icon: Shield },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setView(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  view === tab.id 
                    ? 'bg-white shadow-md text-slate-900' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button className="relative w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
              <Bell size={18} className="text-slate-600" />
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center shadow-lg shadow-red-500/30">3</span>
            </button>
            
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-emerald-500/20">
              JD
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1800px] mx-auto px-6 py-6">
        <AnimatePresence mode="wait">
          {view === 'overview' && <OverviewView key="overview" project={project} onSelectTask={selectTask} />}
          {view === 'task' && <TasksView key="tasks" project={project} selectedPhase={selectedPhase} selectedTask={selectedTask} expandedPhases={expandedPhases} togglePhase={togglePhase} selectTask={selectTask} currentTask={currentTask} currentPhase={currentPhase} />}
          {view === 'timeline' && <TimelineView key="timeline" project={project} />}
          {view === 'passport' && <PassportView key="passport" project={project} />}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================
// OVERVIEW VIEW
// ============================================

const OverviewView: React.FC<{ project: ProjectData; onSelectTask: (taskId: string, phaseId: string) => void }> = ({ project, onSelectTask }) => {
  const totalProgress = Math.round(project.phases.reduce((acc, p) => acc + p.progress, 0) / project.phases.length);
  const verifiedCount = project.phases.flatMap(p => p.tasks).filter(t => t.status === 'verified').length;
  const pendingCount = project.phases.flatMap(p => p.tasks).filter(t => t.status === 'pending').length;
  const activeTask = project.phases.flatMap(p => p.tasks).find(t => t.status === 'active');
  const activePhase = project.phases.find(p => p.status === 'active');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Hero Section */}
      <div className="grid grid-cols-3 gap-6">
        {/* Project Visualization */}
        <div className="col-span-2 relative h-80 rounded-3xl overflow-hidden shadow-2xl">
          <img 
            src={project.heroImage} 
            alt={project.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-white/60 text-sm mb-1">Uw Droomhuis</p>
                <h2 className="text-3xl font-bold text-white mb-2">{project.name}</h2>
                <div className="flex items-center gap-4 text-white/80 text-sm">
                  <span className="flex items-center gap-1.5"><MapPin size={14} /> {project.location}</span>
                  <span className="flex items-center gap-1.5"><Ruler size={14} /> {project.sqm} m²</span>
                  <span className="flex items-center gap-1.5"><Users size={14} /> {project.bedrooms} slaapkamers</span>
                </div>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur rounded-xl">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-white text-sm font-medium">In uitvoering</span>
                </div>
              </div>
            </div>
          </div>
          {/* Play button overlay */}
          <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-white/20 backdrop-blur-lg flex items-center justify-center hover:bg-white/30 transition-colors group">
            <Play size={32} className="text-white ml-1 group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* Stats Panel */}
        <div className="space-y-4">
          {/* Progress Card */}
          <div className="p-5 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-2xl shadow-xl shadow-blue-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
            <div className="relative">
              <p className="text-blue-200 text-xs font-medium mb-1">Totale Voortgang</p>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-4xl font-bold text-white">{totalProgress}</span>
                <span className="text-lg text-blue-200">%</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-white to-blue-200 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${totalProgress}%` }}
                  transition={{ duration: 1.5 }}
                />
              </div>
              <p className="text-blue-200 text-xs mt-2">{verifiedCount} van {project.phases.flatMap(p => p.tasks).length} taken voltooid</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-white rounded-2xl shadow-lg border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center mb-2">
                <CheckCircle2 size={20} className="text-emerald-600" />
              </div>
              <p className="text-2xl font-bold text-slate-900">{verifiedCount}</p>
              <p className="text-xs text-slate-500">Geverifieerd</p>
            </div>
            <div className="p-4 bg-white rounded-2xl shadow-lg border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center mb-2">
                <Clock size={20} className="text-amber-600" />
              </div>
              <p className="text-2xl font-bold text-slate-900">{pendingCount}</p>
              <p className="text-xs text-slate-500">In Review</p>
            </div>
          </div>

          {/* Weather Widget */}
          <div className="p-4 bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl border border-sky-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-sky-600 font-medium">Bouwplaats Weer</p>
                <p className="text-2xl font-bold text-slate-900">{project.weather.temp}°C</p>
                <p className="text-xs text-slate-500">{project.weather.condition}</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-white/80 flex items-center justify-center">
                <CloudRain size={28} className="text-sky-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-4 gap-6">
        {/* Current Task */}
        <div className="col-span-2 bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider">Huidige Taak</p>
              <h3 className="text-lg font-bold text-slate-900 mt-1">{activeTask?.title || 'Geen actieve taak'}</h3>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-blue-700 text-xs font-semibold">Actief</span>
            </div>
          </div>
          <div className="p-5">
            <div className="flex gap-4">
              <div className="w-32 h-32 rounded-2xl bg-slate-100 overflow-hidden flex-shrink-0">
                {activePhase?.coverImage ? (
                  <img src={activePhase.coverImage} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Camera size={32} className="text-slate-300" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-slate-600 text-sm mb-3">{activeTask?.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-orange-50 text-orange-700 text-xs font-medium rounded-lg">Aannemer</span>
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg">Foto vereist</span>
                  <span className="px-2 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-lg flex items-center gap-1">
                    <Clock size={12} /> 48u deadline
                  </span>
                </div>
                <button 
                  onClick={() => activeTask && onSelectTask(activeTask.id, activePhase?.id || '')}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-shadow"
                >
                  Open Taak
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Project Info Cards */}
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-2xl shadow-lg border border-slate-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                <Euro size={20} className="text-violet-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Budget</p>
                <p className="text-lg font-bold text-slate-900">€{(project.budget / 1000).toFixed(0)}k</p>
              </div>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full w-[35%] bg-gradient-to-r from-violet-500 to-purple-500 rounded-full" />
            </div>
            <p className="text-xs text-slate-500 mt-2">35% besteed</p>
          </div>

          <div className="p-4 bg-white rounded-2xl shadow-lg border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Calendar size={20} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Verwacht Gereed</p>
                <p className="text-lg font-bold text-slate-900">{project.expectedCompletion}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contractor Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
          <div className="p-4">
            <p className="text-xs text-slate-500 mb-3">Aannemer</p>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden">
                <img src={project.contractor.logo} alt="" className="w-8 h-8 object-contain" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">{project.contractor.name}</p>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-sm ${i < Math.floor(project.contractor.rating) ? 'text-amber-400' : 'text-slate-200'}`}>★</span>
                  ))}
                  <span className="text-xs text-slate-500 ml-1">{project.contractor.rating}</span>
                </div>
              </div>
            </div>
            <button className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl transition-colors">
              Contact
            </button>
          </div>
        </div>
      </div>

      {/* Phase Progress & Activity */}
      <div className="grid grid-cols-3 gap-6">
        {/* Phase Progress */}
        <div className="col-span-2 bg-white rounded-3xl shadow-xl border border-slate-100 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Fase Voortgang</h3>
          <div className="space-y-4">
            {project.phases.map((phase, idx) => (
              <div key={phase.id} className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
                  phase.status === 'verified' ? 'bg-emerald-100' :
                  phase.status === 'active' ? 'bg-blue-100' :
                  'bg-slate-100'
                }`}>
                  {phase.status === 'verified' ? <Check size={20} className="text-emerald-600" /> : 
                   phase.status === 'locked' ? <Lock size={16} className="text-slate-400" /> :
                   phase.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-medium ${phase.status === 'locked' ? 'text-slate-400' : 'text-slate-900'}`}>
                      {phase.name}
                    </span>
                    <span className={`text-xs font-semibold ${
                      phase.status === 'verified' ? 'text-emerald-600' :
                      phase.status === 'active' ? 'text-blue-600' :
                      'text-slate-400'
                    }`}>{phase.progress}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      className={`h-full rounded-full ${
                        phase.status === 'verified' ? 'bg-gradient-to-r from-emerald-400 to-teal-500' :
                        phase.status === 'active' ? 'bg-gradient-to-r from-blue-500 to-indigo-500' :
                        'bg-slate-300'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${phase.progress}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.1 }}
                    />
                  </div>
                </div>
                {phase.coverImage && (
                  <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={phase.coverImage} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Recente Activiteit</h3>
          <div className="space-y-4">
            {project.recentActivity.map((activity, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start gap-3"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0">
                  {activity.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-900 font-medium">{activity.user}</p>
                  <p className="text-xs text-slate-500 truncate">{activity.action}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Project Specs */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Project Specificaties</h3>
        <div className="grid grid-cols-6 gap-4">
          {[
            { icon: Ruler, label: 'Oppervlakte', value: `${project.sqm} m²`, color: 'blue' },
            { icon: Users, label: 'Slaapkamers', value: project.bedrooms.toString(), color: 'indigo' },
            { icon: Layers, label: 'Badkamers', value: project.bathrooms.toString(), color: 'violet' },
            { icon: TreePine, label: 'Stijl', value: project.style, color: 'emerald' },
            { icon: Zap, label: 'Energie', value: 'A++', color: 'amber' },
            { icon: Car, label: 'Parkeren', value: '2 plaatsen', color: 'slate' },
          ].map((spec, idx) => (
            <div key={idx} className={`p-4 rounded-2xl bg-${spec.color}-50 border border-${spec.color}-100`}>
              <spec.icon size={20} className={`text-${spec.color}-600 mb-2`} />
              <p className="text-xs text-slate-500">{spec.label}</p>
              <p className="text-sm font-semibold text-slate-900">{spec.value}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// ============================================
// TASKS VIEW
// ============================================

const TasksView: React.FC<{
  project: ProjectData;
  selectedPhase: string;
  selectedTask: string | null;
  expandedPhases: string[];
  togglePhase: (id: string) => void;
  selectTask: (taskId: string, phaseId: string) => void;
  currentTask: Task | undefined;
  currentPhase: Phase | undefined;
}> = ({ project, selectedPhase, selectedTask, expandedPhases, togglePhase, selectTask, currentTask, currentPhase }) => {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="grid grid-cols-12 gap-6"
    >
      {/* Sidebar */}
      <aside className="col-span-3">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden sticky top-24">
          <div className="p-5 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Bouwfases</h2>
          </div>
          
          <div className="p-3 max-h-[calc(100vh-280px)] overflow-y-auto">
            {project.phases.map((phase) => {
              const isExpanded = expandedPhases.includes(phase.id);
              const isLocked = phase.status === 'locked';

              return (
                <div key={phase.id} className="mb-1">
                  <button
                    onClick={() => togglePhase(phase.id)}
                    disabled={isLocked}
                    className={`w-full p-3 rounded-2xl flex items-center gap-3 transition-all ${
                      selectedPhase === phase.id && !isLocked
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md' 
                        : isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                      phase.status === 'verified' ? 'bg-emerald-100' :
                      phase.status === 'active' ? 'bg-blue-100' : 'bg-slate-100'
                    }`}>
                      {phase.status === 'verified' ? <Check size={18} className="text-emerald-600" /> :
                       phase.status === 'locked' ? <Lock size={16} className="text-slate-400" /> : phase.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <p className={`font-medium text-sm ${isLocked ? 'text-slate-400' : 'text-slate-900'}`}>{phase.name}</p>
                      <p className="text-xs text-slate-500">{phase.tasks.filter(t => t.status === 'verified').length}/{phase.tasks.length} taken</p>
                    </div>
                    {!isLocked && <ChevronDown size={16} className={`text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />}
                  </button>

                  <AnimatePresence>
                    {isExpanded && !isLocked && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="ml-5 pl-5 border-l-2 border-slate-200 py-2 space-y-1">
                          {phase.tasks.map((task) => (
                            <button
                              key={task.id}
                              onClick={() => task.status !== 'locked' && selectTask(task.id, phase.id)}
                              disabled={task.status === 'locked'}
                              className={`w-full p-2.5 rounded-xl flex items-center gap-3 transition-all text-left ${
                                selectedTask === task.id ? 'bg-blue-500 shadow-lg shadow-blue-500/30' : 
                                task.status === 'locked' ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-50'
                              }`}
                            >
                              <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                                task.status === 'verified' ? 'bg-emerald-500' :
                                task.status === 'active' ? 'bg-blue-500 ring-4 ring-blue-500/20' :
                                task.status === 'pending' ? 'bg-amber-500' : 'bg-slate-300'
                              }`} />
                              <span className={`text-xs font-medium truncate ${selectedTask === task.id ? 'text-white' : 'text-slate-700'}`}>{task.title}</span>
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

      {/* Main Content */}
      <main className="col-span-9">
        {currentTask ? (
          <TaskDetailCard task={currentTask} phase={currentPhase!} />
        ) : (
          <div className="h-96 flex items-center justify-center bg-white rounded-3xl shadow-xl border border-slate-100">
            <div className="text-center">
              <FileText size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500">Selecteer een taak</p>
            </div>
          </div>
        )}
      </main>
    </motion.div>
  );
};

// ============================================
// TASK DETAIL CARD
// ============================================

const TaskDetailCard: React.FC<{ task: Task; phase: Phase }> = ({ task, phase }) => {
  const [isDragging, setIsDragging] = useState(false);

  const statusConfig: Record<TaskStatus, { label: string; color: string; bg: string }> = {
    locked: { label: 'Vergrendeld', color: 'text-slate-500', bg: 'bg-slate-100' },
    active: { label: 'Actief', color: 'text-blue-700', bg: 'bg-blue-50' },
    pending: { label: 'In Review', color: 'text-amber-700', bg: 'bg-amber-50' },
    rejected: { label: 'Afgekeurd', color: 'text-red-700', bg: 'bg-red-50' },
    verified: { label: 'Geverifieerd', color: 'text-emerald-700', bg: 'bg-emerald-50' },
  };

  const config = statusConfig[task.status];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-slate-500">{phase.name}</span>
        <ChevronRight size={14} className="text-slate-400" />
        <span className="text-slate-900 font-medium">{task.title}</span>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Card */}
        <div className="col-span-2 bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.color}`}>{config.label}</span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-700">Aannemer</span>
              </div>
              {task.status === 'active' && (
                <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl">
                  <Clock size={16} className="text-amber-600" />
                  <span className="text-amber-700 text-sm font-semibold">48 uur</span>
                </div>
              )}
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">{task.title}</h2>
            <p className="text-slate-600">{task.description}</p>
          </div>

          {/* Upload Zone */}
          {task.status === 'active' && (
            <div className="p-6">
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={() => setIsDragging(false)}
                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
                  isDragging ? 'border-blue-400 bg-blue-50' : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                }`}
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                  <Upload size={32} className="text-blue-600" />
                </div>
                <p className="text-lg font-semibold text-slate-900 mb-2">Maak een foto of sleep hier</p>
                <p className="text-slate-500 mb-4">JPG, PNG, HEIC ondersteund</p>
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30">
                  Bestand kiezen
                </button>
              </div>
            </div>
          )}

          {/* Verified State */}
          {task.status === 'verified' && (
            <div className="p-6 bg-emerald-50">
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
              {task.aiConfidence && (
                <div className="mt-4 p-4 bg-white/80 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={14} className="text-violet-500" />
                    <span className="text-sm font-medium text-slate-900">AI Verificatie</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full" style={{ width: `${task.aiConfidence}%` }} />
                    </div>
                    <span className="text-sm font-semibold text-violet-600">{task.aiConfidence}%</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Pending State */}
          {task.status === 'pending' && (
            <div className="p-6 bg-amber-50">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-lg flex items-center justify-center">
                  <Loader2 size={24} className="text-amber-600 animate-spin" />
                </div>
                <div>
                  <p className="text-amber-800 font-semibold">In review</p>
                  <p className="text-amber-600 text-sm">Gemini Vision AI analyseert...</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Reference Image */}
          {task.imageUrl && (
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
              <div className="p-4 border-b border-slate-100">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  <Eye size={16} className="text-blue-600" />
                  Referentie
                </h3>
              </div>
              <div className="p-4">
                <img src={task.imageUrl} alt="Reference" className="w-full h-48 object-cover rounded-2xl" />
              </div>
            </div>
          )}

          {/* AI Assistant */}
          <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl p-5 text-white shadow-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Sparkles size={20} />
              </div>
              <div>
                <p className="font-semibold">AI Assistent</p>
                <p className="text-purple-200 text-xs">Powered by Gemini</p>
              </div>
            </div>
            <p className="text-purple-100 text-sm">Upload je foto en AI valideert automatisch of deze voldoet aan de bouwnormen.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ============================================
// TIMELINE VIEW
// ============================================

const TimelineView: React.FC<{ project: ProjectData }> = ({ project }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">Project Tijdlijn</h2>
        
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200" />

          {project.phases.map((phase, idx) => (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="relative flex gap-8 mb-8 last:mb-0"
            >
              {/* Node */}
              <div className={`relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-lg ${
                phase.status === 'verified' ? 'bg-gradient-to-br from-emerald-400 to-teal-500' :
                phase.status === 'active' ? 'bg-gradient-to-br from-blue-500 to-indigo-500' :
                'bg-slate-200'
              }`}>
                {phase.status === 'verified' ? <Check size={28} className="text-white" /> :
                 phase.status === 'locked' ? <Lock size={24} className="text-slate-400" /> :
                 <span className="text-white">{phase.icon}</span>}
              </div>

              {/* Content */}
              <div className="flex-1 pb-8">
                <div className="bg-slate-50 rounded-2xl p-6">
                  <div className="flex items-start gap-6">
                    {phase.coverImage && (
                      <img src={phase.coverImage} alt="" className="w-32 h-24 rounded-xl object-cover flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-slate-900">{phase.name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          phase.status === 'verified' ? 'bg-emerald-100 text-emerald-700' :
                          phase.status === 'active' ? 'bg-blue-100 text-blue-700' :
                          'bg-slate-200 text-slate-500'
                        }`}>
                          {phase.status === 'verified' ? 'Voltooid' : phase.status === 'active' ? 'In uitvoering' : 'Gepland'}
                        </span>
                      </div>
                      <p className="text-slate-600 text-sm mb-3">{phase.tasks.length} taken • {phase.tasks.filter(t => t.status === 'verified').length} voltooid</p>
                      <div className="h-2 bg-white rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            phase.status === 'verified' ? 'bg-emerald-500' :
                            phase.status === 'active' ? 'bg-blue-500' : 'bg-slate-300'
                          }`}
                          style={{ width: `${phase.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// ============================================
// PASSPORT VIEW
// ============================================

const PassportView: React.FC<{ project: ProjectData }> = ({ project }) => {
  const verifiedTasks = project.phases.flatMap(p => p.tasks).filter(t => t.status === 'verified');
  const totalProgress = Math.round(project.phases.reduce((acc, p) => acc + p.progress, 0) / project.phases.length);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 mb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')]" />
        <div className="relative flex items-center gap-6">
          <img src={project.heroImage} alt="" className="w-24 h-24 rounded-2xl object-cover shadow-2xl" />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-1">Woonpaspoort</h1>
            <p className="text-slate-400">{project.name} • {project.location}</p>
          </div>
          <button className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium text-sm transition-colors flex items-center gap-2">
            <Download size={16} />
            Exporteren
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 shadow-xl border border-slate-100">
          <p className="text-slate-500 text-sm mb-1">Documenten</p>
          <p className="text-3xl font-bold text-slate-900">{verifiedTasks.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-xl border border-slate-100">
          <p className="text-slate-500 text-sm mb-1">Compleetheid</p>
          <p className="text-3xl font-bold text-emerald-600">{totalProgress}%</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-xl border border-slate-100">
          <p className="text-slate-500 text-sm mb-1">Blockchain</p>
          <p className="text-3xl font-bold text-blue-600">{verifiedTasks.filter(t => t.hash).length}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-xl border border-slate-100">
          <p className="text-slate-500 text-sm mb-1">AI Validaties</p>
          <p className="text-3xl font-bold text-violet-600">{verifiedTasks.filter(t => t.aiConfidence).length}</p>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">Geverifieerde Documenten</h2>
        </div>
        <div className="grid grid-cols-3 gap-4 p-6">
          {verifiedTasks.map((task, idx) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="group relative bg-slate-50 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            >
              {task.imageUrl ? (
                <img src={task.imageUrl} alt="" className="w-full h-40 object-cover" />
              ) : (
                <div className="w-full h-40 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                  <FileText size={40} className="text-slate-400" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform">
                <p className="text-white font-medium text-sm">{task.title}</p>
                <p className="text-white/60 text-xs">{task.verifiedAt}</p>
                {task.hash && (
                  <div className="flex items-center gap-1 mt-2">
                    <Shield size={10} className="text-blue-400" />
                    <code className="text-[9px] text-blue-300 font-mono">{task.hash}</code>
                  </div>
                )}
              </div>
              <div className="absolute top-3 right-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
                  <Check size={14} className="text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CollaborativeWorkspace;
