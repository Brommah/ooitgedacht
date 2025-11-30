import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, Lock, Clock, ChevronRight, ChevronDown, 
  FileText, Camera, MapPin, Shield, CheckCircle2, 
  Loader2, ArrowLeft, Upload, Sparkles, Eye,
  Euro, Glasses, Cpu, Link2, AlertTriangle,
  Home, Zap, FileCheck, Building2
} from 'lucide-react';
import { AppState, TaskStatus } from '../types';

// ============================================
// FSM-BASED DATA MODEL
// ============================================

interface ValidationLayer {
  name: string;
  status: 'pending' | 'checking' | 'passed' | 'failed';
  timestamp?: string;
  confidence?: number;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  type: 'photo' | 'document';
  source?: 'glasses' | 'upload' | 'scan';
  verifiedAt?: string;
  hash?: string;
  imageUrl?: string;
  paymentAmount?: number;
  paymentReleased?: boolean;
  validationLayers?: ValidationLayer[];
  aiConfidence?: number;
  aiFeedback?: string;
  blockNumber?: string;
}

interface Phase {
  id: string;
  name: string;
  status: TaskStatus;
  progress: number;
  tasks: Task[];
  unlockCondition?: string;
}

const PHASES: Phase[] = [
  {
    id: 'voorbereiding',
    name: 'Voorbereiding',
    status: 'verified',
    progress: 100,
    unlockCondition: 'Start',
    tasks: [
      { 
        id: 't1', 
        title: 'Bouwvergunning', 
        description: 'Gemeente goedkeuring', 
        status: 'verified', 
        type: 'document', 
        verifiedAt: '15 nov', 
        hash: '0x7f3a...b2c1',
        paymentAmount: 0,
        paymentReleased: true,
        validationLayers: [
          { name: 'AI Document Check', status: 'passed', confidence: 99, timestamp: '15 nov 09:14' },
          { name: 'Bureau Broersma', status: 'passed', timestamp: '15 nov 11:30' },
          { name: 'Blockchain Anchor', status: 'passed', timestamp: '15 nov 11:31' },
        ],
        blockNumber: '#18,294,102'
      },
      { 
        id: 't2', 
        title: 'Grondonderzoek', 
        description: 'Bodemanalyse', 
        status: 'verified', 
        type: 'document', 
        verifiedAt: '20 nov', 
        hash: '0x8b2c...d4e5',
        paymentAmount: 2500,
        paymentReleased: true,
        validationLayers: [
          { name: 'AI Document Check', status: 'passed', confidence: 97, timestamp: '20 nov 14:22' },
          { name: 'Bureau Broersma', status: 'passed', timestamp: '20 nov 16:00' },
          { name: 'Blockchain Anchor', status: 'passed', timestamp: '20 nov 16:01' },
        ],
        blockNumber: '#18,301,847'
      },
    ]
  },
  {
    id: 'fundering',
    name: 'Fundering',
    status: 'active',
    progress: 60,
    unlockCondition: 'Voorbereiding ✓',
    tasks: [
      { 
        id: 't3', 
        title: 'Uitgraven bouwput', 
        description: 'Dieptemeting & foto', 
        status: 'verified', 
        type: 'photo', 
        source: 'glasses',
        verifiedAt: '25 nov', 
        hash: '0x9d4e...f6a7', 
        imageUrl: '/generated/steps/step-02-kavel-check.jpg',
        paymentAmount: 8500,
        paymentReleased: true,
        aiConfidence: 98,
        aiFeedback: 'Diepte 1.2m gedetecteerd. Conform bestek.',
        validationLayers: [
          { name: 'AI Vision Check', status: 'passed', confidence: 98, timestamp: '25 nov 10:15' },
          { name: 'Bureau Broersma', status: 'passed', timestamp: '25 nov 14:30' },
          { name: 'Blockchain Anchor', status: 'passed', timestamp: '25 nov 14:31' },
        ],
        blockNumber: '#18,312,993'
      },
      { 
        id: 't4', 
        title: 'Wapeningsstaal', 
        description: 'Wapening As-A t/m D', 
        status: 'verified', 
        type: 'photo', 
        source: 'glasses',
        verifiedAt: '28 nov', 
        hash: '0xa1f2...g8h9', 
        imageUrl: '/generated/steps/step-01-vibe-stijl.jpg',
        paymentAmount: 12000,
        paymentReleased: true,
        aiConfidence: 94,
        aiFeedback: 'Wapeningsafstand 15cm. Dekking OK. Conform NEN-EN 1992.',
        validationLayers: [
          { name: 'AI Vision Check', status: 'passed', confidence: 94, timestamp: '28 nov 09:45' },
          { name: 'Bureau Broersma', status: 'passed', timestamp: '28 nov 11:00' },
          { name: 'Blockchain Anchor', status: 'passed', timestamp: '28 nov 11:01' },
        ],
        blockNumber: '#18,320,441'
      },
      { 
        id: 't5', 
        title: 'Betonbon', 
        description: 'Sterkteklasse C30/37', 
        status: 'pending', 
        type: 'document',
        paymentAmount: 0,
        validationLayers: [
          { name: 'AI Document Check', status: 'checking', timestamp: 'Nu...' },
          { name: 'Bureau Broersma', status: 'pending' },
          { name: 'Blockchain Anchor', status: 'pending' },
        ],
      },
      { 
        id: 't6', 
        title: 'Storten fundering', 
        description: 'Foto tijdens storten', 
        status: 'active', 
        type: 'photo',
        paymentAmount: 15000,
        paymentReleased: false,
        unlockCondition: 'Betonbon ✓',
      },
      { 
        id: 't7', 
        title: 'Uitharding', 
        description: '28-dagen certificaat', 
        status: 'locked', 
        type: 'document',
        paymentAmount: 5000,
      },
    ]
  },
  {
    id: 'ruwbouw',
    name: 'Ruwbouw',
    status: 'locked',
    progress: 0,
    unlockCondition: 'Fundering ✓',
    tasks: [
      { id: 't8', title: 'HSB elementen', description: 'Houtskeletbouw', status: 'locked', type: 'photo', paymentAmount: 25000 },
      { id: 't9', title: 'Montage', description: 'Begane grond', status: 'locked', type: 'photo', paymentAmount: 18000 },
    ]
  },
  {
    id: 'afbouw',
    name: 'Afbouw & Oplevering',
    status: 'locked',
    progress: 0,
    unlockCondition: 'Ruwbouw ✓',
    tasks: [
      { id: 't10', title: 'Installaties', description: 'Elektra & leidingwerk', status: 'locked', type: 'photo', paymentAmount: 22000 },
      { id: 't11', title: 'Eindkeuring', description: 'Wkb-dossier compleet', status: 'locked', type: 'document', paymentAmount: 0 },
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
  const totalPaymentReleased = allTasks.filter(t => t.paymentReleased).reduce((acc, t) => acc + (t.paymentAmount || 0), 0);
  const totalPaymentPending = allTasks.filter(t => !t.paymentReleased).reduce((acc, t) => acc + (t.paymentAmount || 0), 0);
  const wkbCompleteness = Math.round((verifiedCount / allTasks.length) * 100);

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      {/* ===== HEADER ===== */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setAppState(AppState.LANDING)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="flex items-center gap-2">
              <Building2 size={18} className="text-slate-900" />
              <span className="font-semibold text-slate-900 text-sm">Veluwse Heide Residence</span>
              <span className="text-slate-400 text-sm">· Ermelo</span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                <FileCheck size={16} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Wkb-dossier</p>
                <p className="font-semibold text-slate-900">{wkbCompleteness}%</p>
              </div>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <Euro size={16} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Vrijgegeven</p>
                <p className="font-semibold text-slate-900">€{(totalPaymentReleased / 1000).toFixed(0)}k</p>
              </div>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                <Lock size={16} className="text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">In escrow</p>
                <p className="font-semibold text-slate-900">€{(totalPaymentPending / 1000).toFixed(0)}k</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          
          {/* ===== LEFT: FSM TIMELINE ===== */}
          <aside className="col-span-4">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900">FSM Bouwfases</h2>
                <span className="text-xs text-slate-500">{verifiedCount}/{allTasks.length} states ✓</span>
              </div>
              
              <div className="p-3">
                {PHASES.map((phase, idx) => {
                  const isExpanded = expandedPhase === phase.id;
                  const isLocked = phase.status === 'locked';
                  const completedTasks = phase.tasks.filter(t => t.status === 'verified').length;
                  const phasePayment = phase.tasks.reduce((acc, t) => acc + (t.paymentAmount || 0), 0);

                  return (
                    <div key={phase.id} className="mb-2 last:mb-0">
                      {/* Unlock Condition */}
                      {phase.unlockCondition && idx > 0 && (
                        <div className="flex items-center gap-2 ml-4 mb-1">
                          <div className="w-px h-3 bg-slate-200" />
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                            phase.status !== 'locked' 
                              ? 'bg-emerald-50 text-emerald-700' 
                              : 'bg-slate-100 text-slate-500'
                          }`}>
                            {phase.unlockCondition}
                          </span>
                        </div>
                      )}

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
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          phase.status === 'verified' ? 'bg-emerald-500 text-white' :
                          phase.status === 'active' ? (isExpanded ? 'bg-white text-slate-900' : 'bg-blue-500 text-white') :
                          'bg-slate-200 text-slate-400'
                        }`}>
                          {phase.status === 'verified' ? <Check size={14} /> :
                           phase.status === 'locked' ? <Lock size={12} /> :
                           <span className="text-xs font-bold">{idx + 1}</span>}
                        </div>

                        <div className="flex-1 text-left">
                          <p className={`text-sm font-medium ${isExpanded ? 'text-white' : 'text-slate-900'}`}>
                            {phase.name}
                          </p>
                          <p className={`text-xs ${isExpanded ? 'text-slate-300' : 'text-slate-500'}`}>
                            {completedTasks}/{phase.tasks.length} · €{(phasePayment / 1000).toFixed(0)}k
                          </p>
                        </div>

                        {!isLocked && <ChevronDown size={14} className={`transition-transform ${isExpanded ? 'rotate-180' : ''} ${isExpanded ? 'text-slate-300' : 'text-slate-400'}`} />}
                      </button>

                      {/* Tasks */}
                      <AnimatePresence>
                        {isExpanded && !isLocked && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-2 pl-5 space-y-1">
                              {phase.tasks.map((task) => (
                                <button
                                  key={task.id}
                                  onClick={() => task.status !== 'locked' && setSelectedTask(task.id)}
                                  disabled={task.status === 'locked'}
                                  className={`w-full px-3 py-2 rounded-lg flex items-center gap-2 transition-all text-left ${
                                    selectedTask === task.id 
                                      ? 'bg-blue-50 border border-blue-200' 
                                      : task.status === 'locked'
                                        ? 'opacity-40 cursor-not-allowed'
                                        : 'hover:bg-slate-50'
                                  }`}
                                >
                                  {/* Status Dot */}
                                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                    task.status === 'verified' ? 'bg-emerald-500' :
                                    task.status === 'active' ? 'bg-blue-500' :
                                    task.status === 'pending' ? 'bg-amber-500' :
                                    'bg-slate-300'
                                  }`} />
                                  
                                  {/* Title */}
                                  <span className={`text-xs flex-1 ${
                                    selectedTask === task.id ? 'text-blue-700 font-medium' : 'text-slate-700'
                                  }`}>
                                    {task.title}
                                  </span>

                                  {/* Source Badge */}
                                  {task.source === 'glasses' && (
                                    <Glasses size={10} className="text-violet-500" />
                                  )}

                                  {/* Payment Badge */}
                                  {task.paymentReleased && task.paymentAmount && task.paymentAmount > 0 && (
                                    <span className="text-[10px] text-emerald-600">€{(task.paymentAmount / 1000).toFixed(0)}k ✓</span>
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

              {/* Wkb Dossier Status */}
              <div className="mx-3 mb-3 p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Shield size={14} className="text-slate-600" />
                  <span className="text-xs font-medium text-slate-900">Wkb Dossier Voortgang</span>
                </div>
                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden mb-1">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${wkbCompleteness}%` }} />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Consumentendossier</span>
                  <span>{wkbCompleteness}% compleet</span>
                </div>
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
// TASK CARD WITH FSM LOGIC
// ============================================

const TaskCard: React.FC<{ task: Task; phase: Phase }> = ({ task, phase }) => {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <motion.div
      key={task.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-500">{phase.name}</span>
            <ChevronRight size={12} className="text-slate-300" />
            <span className="text-slate-900 font-medium">{task.title}</span>
          </div>
          
          <div className="flex items-center gap-2">
            {task.source === 'glasses' && (
              <span className="flex items-center gap-1 px-2 py-1 bg-violet-50 text-violet-700 rounded-full text-xs">
                <Glasses size={12} />
                Smart Glasses
              </span>
            )}
            <StatusBadge status={task.status} />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Active State: Upload Zone with FSM Logic */}
          {task.status === 'active' && (
            <div className="space-y-4">
              {/* FSM Gate Warning */}
              {task.unlockCondition && (
                <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <AlertTriangle size={16} className="text-amber-600" />
                  <span className="text-sm text-amber-800">
                    <strong>Gate:</strong> {task.unlockCondition} voordat je kunt uploaden
                  </span>
                </div>
              )}

              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-1">{task.title}</h2>
                <p className="text-slate-600 text-sm">{task.description}</p>
              </div>

              {/* Upload Zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={() => setIsDragging(false)}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                  isDragging ? 'border-blue-400 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center">
                  {task.type === 'photo' ? <Camera size={24} className="text-slate-400" /> : <FileText size={24} className="text-slate-400" />}
                </div>
                <p className="text-slate-900 font-medium mb-1">Upload {task.type === 'photo' ? 'foto' : 'document'}</p>
                <p className="text-slate-500 text-sm mb-3">Of gebruik smart glasses op de bouwplaats</p>
                <button className="px-5 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800">
                  Bestand kiezen
                </button>
              </div>

              {/* Payment Info */}
              {task.paymentAmount && task.paymentAmount > 0 && (
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Euro size={16} className="text-blue-600" />
                    <span className="text-sm text-blue-800">Bij verificatie wordt <strong>€{task.paymentAmount.toLocaleString()}</strong> vrijgegeven</span>
                  </div>
                  <Lock size={14} className="text-blue-400" />
                </div>
              )}

              {/* What happens next */}
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-xs font-medium text-slate-700 mb-2">Na upload: 3-laags validatie</p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <Cpu size={12} className="text-violet-500" />
                    <span>AI Check</span>
                  </div>
                  <ChevronRight size={12} className="text-slate-300" />
                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <Building2 size={12} className="text-blue-500" />
                    <span>Broersma</span>
                  </div>
                  <ChevronRight size={12} className="text-slate-300" />
                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <Link2 size={12} className="text-emerald-500" />
                    <span>Blockchain</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pending State: AI Checking */}
          {task.status === 'pending' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-1">{task.title}</h2>
                <p className="text-slate-600 text-sm">{task.description}</p>
              </div>

              {/* Validation Pipeline */}
              <div className="p-4 bg-amber-50 rounded-xl">
                <p className="text-sm font-medium text-amber-800 mb-3">Validatie in uitvoering...</p>
                {task.validationLayers?.map((layer, idx) => (
                  <div key={idx} className="flex items-center gap-3 py-2 border-b border-amber-100 last:border-0">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      layer.status === 'passed' ? 'bg-emerald-500' :
                      layer.status === 'checking' ? 'bg-amber-500' :
                      'bg-slate-200'
                    }`}>
                      {layer.status === 'passed' ? <Check size={12} className="text-white" /> :
                       layer.status === 'checking' ? <Loader2 size={12} className="text-white animate-spin" /> :
                       <span className="w-2 h-2 rounded-full bg-slate-400" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-900">{layer.name}</p>
                      {layer.timestamp && <p className="text-xs text-slate-500">{layer.timestamp}</p>}
                    </div>
                    {layer.confidence && (
                      <span className="text-xs text-violet-600 font-medium">{layer.confidence}%</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Verified State */}
          {task.status === 'verified' && (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 mb-1">{task.title}</h2>
                  <p className="text-slate-600 text-sm">{task.description}</p>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">
                  <CheckCircle2 size={12} />
                  Geverifieerd
                </div>
              </div>

              {/* Image with overlays */}
              {task.imageUrl && (
                <div className="relative rounded-xl overflow-hidden bg-slate-100">
                  <img src={task.imageUrl} alt={task.title} className="w-full h-56 object-cover" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <div className="px-2.5 py-1 bg-black/60 backdrop-blur text-white text-xs rounded-lg">
                      {task.verifiedAt}
                    </div>
                    {task.source === 'glasses' && (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-violet-500/90 backdrop-blur text-white text-xs rounded-lg">
                        <Glasses size={12} />
                        Smart Glasses
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* AI Feedback */}
              {task.aiFeedback && (
                <div className="p-3 bg-violet-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles size={14} className="text-violet-600" />
                    <span className="text-xs font-medium text-violet-800">AI Analyse ({task.aiConfidence}% zekerheid)</span>
                  </div>
                  <p className="text-sm text-violet-900">{task.aiFeedback}</p>
                </div>
              )}

              {/* Validation Layers */}
              {task.validationLayers && (
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs font-medium text-slate-700 mb-2">Validatie Trail</p>
                  {task.validationLayers.map((layer, idx) => (
                    <div key={idx} className="flex items-center gap-2 py-1.5 text-xs">
                      <Check size={10} className="text-emerald-500" />
                      <span className="text-slate-700">{layer.name}</span>
                      <span className="text-slate-400 ml-auto">{layer.timestamp}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Blockchain Proof */}
              {task.hash && (
                <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Link2 size={14} className="text-emerald-400" />
                    <span className="text-xs text-white">Blockchain Anchor</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <code className="text-xs text-slate-400 font-mono">{task.hash}</code>
                    {task.blockNumber && (
                      <span className="text-xs text-slate-500">{task.blockNumber}</span>
                    )}
                  </div>
                </div>
              )}

              {/* Payment Released */}
              {task.paymentReleased && task.paymentAmount && task.paymentAmount > 0 && (
                <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Euro size={16} className="text-emerald-600" />
                    <span className="text-sm text-emerald-800">Betaling vrijgegeven</span>
                  </div>
                  <span className="text-sm font-bold text-emerald-700">€{task.paymentAmount.toLocaleString()}</span>
                </div>
              )}
            </div>
          )}

          {/* Locked State */}
          {task.status === 'locked' && (
            <div className="py-8 text-center">
              <Lock size={32} className="mx-auto mb-3 text-slate-300" />
              <p className="text-slate-500 text-sm">Voltooi vorige taken om te ontgrendelen</p>
              {task.paymentAmount && task.paymentAmount > 0 && (
                <p className="text-slate-400 text-xs mt-2">€{task.paymentAmount.toLocaleString()} in escrow</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Housing Passport Preview */}
      {task.status === 'verified' && (
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Home size={20} className="text-white" />
            </div>
            <div>
              <p className="text-white text-sm font-medium">Toegevoegd aan Woning Paspoort</p>
              <p className="text-slate-400 text-xs">Permanent verankerd in het bouwdossier</p>
            </div>
          </div>
          <button className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5">
            <Eye size={12} />
            Bekijk Paspoort
          </button>
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
    active: { label: 'Wacht op bewijs', className: 'bg-blue-100 text-blue-700' },
    pending: { label: 'AI Validatie...', className: 'bg-amber-100 text-amber-700' },
    rejected: { label: 'Afgekeurd', className: 'bg-red-100 text-red-700' },
    verified: { label: 'Geverifieerd', className: 'bg-emerald-100 text-emerald-700' },
  };
  const { label, className } = config[status];
  return <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${className}`}>{label}</span>;
};

// ============================================
// EMPTY STATE
// ============================================

const EmptyState: React.FC = () => (
  <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
    <FileText size={40} className="mx-auto mb-4 text-slate-300" />
    <p className="text-slate-500">Selecteer een state om te bekijken</p>
  </div>
);

export default CollaborativeWorkspace;
