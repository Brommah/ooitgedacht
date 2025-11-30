import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, Lock, Clock, ChevronRight, ChevronDown, 
  FileText, Camera, MapPin, Shield, CheckCircle2, 
  Loader2, ArrowLeft, Upload, Sparkles, Eye,
  Euro, Glasses, Cpu, Link2, AlertTriangle,
  Home, X, Send, MessageCircle, Bell, User,
  Building2, Download, ExternalLink, Zap
} from 'lucide-react';
import { AppState, TaskStatus } from '../types';

// ============================================
// DATA TYPES
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

interface ChatMessage {
  id: string;
  sender: string;
  senderRole: 'client' | 'contractor' | 'engineer' | 'system';
  message: string;
  timestamp: string;
  taskRef?: string;
}

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'payment';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  taskRef?: string;
}

// ============================================
// DEMO DATA
// ============================================

const NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'payment', title: 'Betaling vrijgegeven', message: '€12.000 voor Wapeningsstaal', timestamp: '2 uur geleden', read: false, taskRef: 't4' },
  { id: 'n2', type: 'success', title: 'Taak geverifieerd', message: 'Wapeningsstaal goedgekeurd door Bureau Broersma', timestamp: '2 uur geleden', read: false, taskRef: 't4' },
  { id: 'n3', type: 'warning', title: 'Actie vereist', message: 'Betonbon wacht op upload', timestamp: '5 uur geleden', read: true, taskRef: 't5' },
  { id: 'n4', type: 'info', title: 'Nieuwe opmerking', message: 'Van der Berg Bouw heeft gereageerd', timestamp: '1 dag geleden', read: true },
];

const CHAT_MESSAGES: ChatMessage[] = [
  { id: 'm1', sender: 'Jan de Vries', senderRole: 'contractor', message: 'Wapening is geplaatst conform tekening. Foto\'s zijn via de bril gemaakt.', timestamp: '28 nov 09:45', taskRef: 't4' },
  { id: 'm2', sender: 'Bureau Broersma', senderRole: 'engineer', message: 'Wapening gecontroleerd. Afstand 15cm is conform NEN-EN 1992. Goedgekeurd.', timestamp: '28 nov 11:00', taskRef: 't4' },
  { id: 'm3', sender: 'Systeem', senderRole: 'system', message: '✓ Betaling €12.000 vrijgegeven naar Van der Berg Bouw', timestamp: '28 nov 11:01' },
  { id: 'm4', sender: 'U', senderRole: 'client', message: 'Ziet er goed uit! Wanneer komt de betonwagen?', timestamp: '28 nov 14:30' },
  { id: 'm5', sender: 'Jan de Vries', senderRole: 'contractor', message: 'Betonbon is aangevraagd. Levering gepland voor 30 november.', timestamp: '28 nov 15:12' },
];

const PHASES: Phase[] = [
  {
    id: 'voorbereiding',
    name: 'Voorbereiding',
    status: 'verified',
    progress: 100,
    unlockCondition: 'Start',
    tasks: [
      { 
        id: 't1', title: 'Bouwvergunning', description: 'Gemeente goedkeuring', status: 'verified', type: 'document', 
        verifiedAt: '15 nov', hash: '0x7f3a...b2c1', paymentAmount: 0, paymentReleased: true,
        validationLayers: [
          { name: 'AI Document Check', status: 'passed', confidence: 99, timestamp: '15 nov 09:14' },
          { name: 'Bureau Broersma', status: 'passed', timestamp: '15 nov 11:30' },
        ],
        blockNumber: '#18,294,102'
      },
      { 
        id: 't2', title: 'Grondonderzoek', description: 'Bodemanalyse', status: 'verified', type: 'document', 
        verifiedAt: '20 nov', hash: '0x8b2c...d4e5', paymentAmount: 2500, paymentReleased: true,
        validationLayers: [
          { name: 'AI Document Check', status: 'passed', confidence: 97, timestamp: '20 nov 14:22' },
          { name: 'Bureau Broersma', status: 'passed', timestamp: '20 nov 16:00' },
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
        id: 't3', title: 'Uitgraven bouwput', description: 'Dieptemeting', status: 'verified', type: 'photo', source: 'glasses',
        verifiedAt: '25 nov', hash: '0x9d4e...f6a7', imageUrl: '/generated/steps/step-02-kavel-check.jpg',
        paymentAmount: 8500, paymentReleased: true, aiConfidence: 98, aiFeedback: 'Diepte 1.2m. Conform bestek.',
        validationLayers: [
          { name: 'AI Vision Check', status: 'passed', confidence: 98, timestamp: '25 nov 10:15' },
          { name: 'Bureau Broersma', status: 'passed', timestamp: '25 nov 14:30' },
        ],
        blockNumber: '#18,312,993'
      },
      { 
        id: 't4', title: 'Wapeningsstaal', description: 'Wapening As-A t/m D', status: 'verified', type: 'photo', source: 'glasses',
        verifiedAt: '28 nov', hash: '0xa1f2...g8h9', imageUrl: '/generated/steps/step-01-vibe-stijl.jpg',
        paymentAmount: 12000, paymentReleased: true, aiConfidence: 94, aiFeedback: 'Afstand 15cm. Conform NEN-EN 1992.',
        validationLayers: [
          { name: 'AI Vision Check', status: 'passed', confidence: 94, timestamp: '28 nov 09:45' },
          { name: 'Bureau Broersma', status: 'passed', timestamp: '28 nov 11:00' },
        ],
        blockNumber: '#18,320,441'
      },
      { 
        id: 't5', title: 'Betonbon', description: 'Sterkteklasse C30/37', status: 'pending', type: 'document', paymentAmount: 0,
        validationLayers: [
          { name: 'AI Document Check', status: 'checking', timestamp: 'Nu...' },
          { name: 'Bureau Broersma', status: 'pending' },
        ],
      },
      { id: 't6', title: 'Storten fundering', description: 'Foto tijdens storten', status: 'active', type: 'photo', paymentAmount: 15000, paymentReleased: false },
      { id: 't7', title: 'Uitharding', description: '28-dagen certificaat', status: 'locked', type: 'document', paymentAmount: 5000 },
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
  const [selectedTask, setSelectedTask] = useState<string>('t4');
  const [expandedPhase, setExpandedPhase] = useState<string>('fundering');
  const [showChat, setShowChat] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPassport, setShowPassport] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const allTasks = PHASES.flatMap(p => p.tasks);
  const currentTask = allTasks.find(t => t.id === selectedTask);
  const currentPhase = PHASES.find(p => p.tasks.some(t => t.id === selectedTask));
  
  const verifiedCount = allTasks.filter(t => t.status === 'verified').length;
  const totalPaymentReleased = allTasks.filter(t => t.paymentReleased).reduce((acc, t) => acc + (t.paymentAmount || 0), 0);
  const totalPaymentPending = allTasks.filter(t => !t.paymentReleased).reduce((acc, t) => acc + (t.paymentAmount || 0), 0);
  const wkbCompleteness = Math.round((verifiedCount / allTasks.length) * 100);
  const unreadNotifications = notifications.filter(n => !n.read).length;

  const markAllRead = () => setNotifications(notifications.map(n => ({ ...n, read: true })));

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      {/* ===== HEADER ===== */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setAppState(AppState.LANDING)} className="text-slate-400 hover:text-slate-600">
              <ArrowLeft size={18} />
            </button>
            <div className="flex items-center gap-2">
              <Building2 size={18} className="text-slate-900" />
              <span className="font-semibold text-slate-900 text-sm">Veluwse Heide Residence</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-lg">
              <Euro size={14} className="text-emerald-600" />
              <span className="text-emerald-700 font-medium">€{(totalPaymentReleased / 1000).toFixed(0)}k vrijgegeven</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-lg">
              <Lock size={14} className="text-amber-600" />
              <span className="text-amber-700 font-medium">€{(totalPaymentPending / 1000).toFixed(0)}k escrow</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Passport Button */}
            <button
              onClick={() => setShowPassport(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/20"
            >
              <Home size={14} />
              Woning Paspoort
            </button>

            {/* Chat */}
            <button
              onClick={() => setShowChat(true)}
              className="relative w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
            >
              <MessageCircle size={18} className="text-slate-600" />
            </button>

            {/* Notifications */}
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
            >
              <Bell size={18} className="text-slate-600" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </button>

            {/* User */}
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
              JD
            </div>
          </div>
        </div>

        {/* Notifications Dropdown */}
        <AnimatePresence>
          {showNotifications && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-6 top-14 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50"
            >
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <span className="font-semibold text-slate-900 text-sm">Notificaties</span>
                <button onClick={markAllRead} className="text-xs text-blue-600 hover:text-blue-700">Markeer gelezen</button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map(notif => (
                  <div key={notif.id} className={`px-4 py-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer ${!notif.read ? 'bg-blue-50/50' : ''}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        notif.type === 'payment' ? 'bg-emerald-100' :
                        notif.type === 'success' ? 'bg-blue-100' :
                        notif.type === 'warning' ? 'bg-amber-100' : 'bg-slate-100'
                      }`}>
                        {notif.type === 'payment' ? <Euro size={14} className="text-emerald-600" /> :
                         notif.type === 'success' ? <CheckCircle2 size={14} className="text-blue-600" /> :
                         notif.type === 'warning' ? <AlertTriangle size={14} className="text-amber-600" /> :
                         <MessageCircle size={14} className="text-slate-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900">{notif.title}</p>
                        <p className="text-xs text-slate-500 truncate">{notif.message}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{notif.timestamp}</p>
                      </div>
                      {!notif.read && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          
          {/* ===== LEFT: FSM TIMELINE ===== */}
          <aside className="col-span-4">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900">Bouwfases</h2>
                <span className="text-xs text-slate-500">{verifiedCount}/{allTasks.length} ✓</span>
              </div>
              
              <div className="p-3">
                {PHASES.map((phase, idx) => {
                  const isExpanded = expandedPhase === phase.id;
                  const isLocked = phase.status === 'locked';
                  const completedTasks = phase.tasks.filter(t => t.status === 'verified').length;
                  const phasePayment = phase.tasks.reduce((acc, t) => acc + (t.paymentAmount || 0), 0);

                  return (
                    <div key={phase.id} className="mb-2 last:mb-0">
                      {phase.unlockCondition && idx > 0 && (
                        <div className="flex items-center gap-2 ml-4 mb-1">
                          <div className="w-px h-3 bg-slate-200" />
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${phase.status !== 'locked' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                            {phase.unlockCondition}
                          </span>
                        </div>
                      )}

                      <button
                        onClick={() => !isLocked && setExpandedPhase(isExpanded ? '' : phase.id)}
                        disabled={isLocked}
                        className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${
                          isExpanded ? 'bg-slate-900 text-white' : isLocked ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          phase.status === 'verified' ? 'bg-emerald-500 text-white' :
                          phase.status === 'active' ? (isExpanded ? 'bg-white text-slate-900' : 'bg-blue-500 text-white') :
                          'bg-slate-200 text-slate-400'
                        }`}>
                          {phase.status === 'verified' ? <Check size={14} /> : phase.status === 'locked' ? <Lock size={12} /> : <span className="text-xs font-bold">{idx + 1}</span>}
                        </div>
                        <div className="flex-1 text-left">
                          <p className={`text-sm font-medium ${isExpanded ? 'text-white' : 'text-slate-900'}`}>{phase.name}</p>
                          <p className={`text-xs ${isExpanded ? 'text-slate-300' : 'text-slate-500'}`}>{completedTasks}/{phase.tasks.length} · €{(phasePayment / 1000).toFixed(0)}k</p>
                        </div>
                        {!isLocked && <ChevronDown size={14} className={`transition-transform ${isExpanded ? 'rotate-180' : ''} ${isExpanded ? 'text-slate-300' : 'text-slate-400'}`} />}
                      </button>

                      <AnimatePresence>
                        {isExpanded && !isLocked && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            <div className="pt-2 pl-5 space-y-1">
                              {phase.tasks.map((task) => (
                                <button
                                  key={task.id}
                                  onClick={() => task.status !== 'locked' && setSelectedTask(task.id)}
                                  disabled={task.status === 'locked'}
                                  className={`w-full px-3 py-2 rounded-lg flex items-center gap-2 transition-all text-left ${
                                    selectedTask === task.id ? 'bg-blue-50 border border-blue-200' : task.status === 'locked' ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-50'
                                  }`}
                                >
                                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                    task.status === 'verified' ? 'bg-emerald-500' : task.status === 'active' ? 'bg-blue-500' : task.status === 'pending' ? 'bg-amber-500' : 'bg-slate-300'
                                  }`} />
                                  <span className={`text-xs flex-1 ${selectedTask === task.id ? 'text-blue-700 font-medium' : 'text-slate-700'}`}>{task.title}</span>
                                  {task.source === 'glasses' && <Glasses size={10} className="text-violet-500" />}
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

              {/* Wkb Progress */}
              <div className="mx-3 mb-3 p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Shield size={14} className="text-slate-600" />
                  <span className="text-xs font-medium text-slate-900">Wkb Dossier</span>
                  <span className="ml-auto text-xs text-slate-500">{wkbCompleteness}%</span>
                </div>
                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${wkbCompleteness}%` }} />
                </div>
              </div>
            </div>
          </aside>

          {/* ===== RIGHT: TASK DETAIL ===== */}
          <main className="col-span-8">
            {currentTask && <TaskCard task={currentTask} phase={currentPhase!} onOpenChat={() => setShowChat(true)} />}
          </main>
        </div>
      </div>

      {/* ===== CHAT PANEL ===== */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-96 bg-white shadow-2xl z-50 flex flex-col"
          >
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900">Project Chat</h3>
                <p className="text-xs text-slate-500">Aannemer, Bureau Broersma & u</p>
              </div>
              <button onClick={() => setShowChat(false)} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center">
                <X size={18} className="text-slate-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {CHAT_MESSAGES.map(msg => (
                <div key={msg.id} className={`flex gap-3 ${msg.senderRole === 'client' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                    msg.senderRole === 'client' ? 'bg-blue-500 text-white' :
                    msg.senderRole === 'contractor' ? 'bg-orange-500 text-white' :
                    msg.senderRole === 'engineer' ? 'bg-slate-700 text-white' :
                    'bg-slate-200 text-slate-600'
                  }`}>
                    {msg.senderRole === 'system' ? <Zap size={14} /> : msg.sender.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className={`max-w-[70%] ${msg.senderRole === 'client' ? 'text-right' : ''}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-medium ${msg.senderRole === 'client' ? 'text-blue-600' : 'text-slate-700'}`}>{msg.sender}</span>
                      <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                    </div>
                    <div className={`px-3 py-2 rounded-xl text-sm ${
                      msg.senderRole === 'client' ? 'bg-blue-500 text-white' :
                      msg.senderRole === 'system' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {msg.message}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Typ een bericht..."
                  className="flex-1 px-4 py-2.5 bg-slate-100 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="w-10 h-10 bg-blue-500 hover:bg-blue-600 rounded-xl flex items-center justify-center transition-colors">
                  <Send size={18} className="text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== WONING PASPOORT MODAL ===== */}
      <AnimatePresence>
        {showPassport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-8"
            onClick={() => setShowPassport(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col"
            >
              {/* Passport Header */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-8 py-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')]" />
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-xl">
                      <Home size={32} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Woning Paspoort</h2>
                      <p className="text-slate-400">Veluwse Heide Residence · Ermelo</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-medium flex items-center gap-2 transition-colors">
                      <Download size={16} />
                      Exporteren
                    </button>
                    <button onClick={() => setShowPassport(false)} className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                      <X size={20} className="text-white" />
                    </button>
                  </div>
                </div>

                {/* Stats Bar */}
                <div className="relative mt-6 grid grid-cols-3 gap-4">
                  {[
                    { label: 'Documenten', value: verifiedCount.toString(), icon: FileText },
                    { label: 'Compleetheid', value: `${wkbCompleteness}%`, icon: Shield },
                    { label: 'AI Validaties', value: allTasks.filter(t => t.aiConfidence).length.toString(), icon: Sparkles },
                  ].map((stat, idx) => (
                    <div key={idx} className="bg-white/10 rounded-xl px-4 py-3">
                      <div className="flex items-center gap-2 mb-1">
                        <stat.icon size={14} className="text-slate-400" />
                        <span className="text-xs text-slate-400">{stat.label}</span>
                      </div>
                      <p className="text-xl font-bold text-white">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Passport Content */}
              <div className="flex-1 overflow-y-auto p-8">
                <div className="grid grid-cols-2 gap-6">
                  {/* Property Info */}
                  <div className="bg-slate-50 rounded-2xl p-5">
                    <h3 className="font-semibold text-slate-900 mb-4">Woninggegevens</h3>
                    <div className="space-y-3">
                      {[
                        { label: 'Adres', value: 'Veluwse Heide 12, Ermelo' },
                        { label: 'Oppervlakte', value: '185 m²' },
                        { label: 'Bouwjaar', value: '2025' },
                        { label: 'Energielabel', value: 'A++' },
                        { label: 'Aannemer', value: 'Van der Berg Bouw' },
                        { label: 'Constructeur', value: 'Bureau Broersma' },
                      ].map((item, idx) => (
                        <div key={idx} className="flex justify-between py-2 border-b border-slate-200 last:border-0">
                          <span className="text-sm text-slate-500">{item.label}</span>
                          <span className="text-sm font-medium text-slate-900">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cryptographic Seal */}
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 border border-emerald-200">
                    <div className="flex items-center gap-2 mb-4">
                      <Shield size={18} className="text-emerald-600" />
                      <h3 className="font-semibold text-emerald-900">Cryptografisch Zegel</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-white rounded-xl p-4">
                        <p className="text-xs text-slate-500 mb-1">Document Hash</p>
                        <code className="text-xs font-mono text-slate-700 break-all">0x7f3ab2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9</code>
                      </div>
                      <div className="bg-white rounded-xl p-4">
                        <p className="text-xs text-slate-500 mb-1">Laatste Verificatie</p>
                        <p className="text-sm font-medium text-slate-900">28 november 2024, 11:01 CET</p>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-700 text-sm">
                        <CheckCircle2 size={16} />
                        <span>Alle {verifiedCount} documenten cryptografisch verankerd</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Verified Documents */}
                <div className="mt-6">
                  <h3 className="font-semibold text-slate-900 mb-4">Geverifieerde Documenten</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {allTasks.filter(t => t.status === 'verified').map((task) => (
                      <div key={task.id} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-lg transition-shadow cursor-pointer group">
                        <div className="flex items-start justify-between mb-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${task.type === 'photo' ? 'bg-blue-100' : 'bg-amber-100'}`}>
                            {task.type === 'photo' ? <Camera size={18} className="text-blue-600" /> : <FileText size={18} className="text-amber-600" />}
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center">
                              <Eye size={14} className="text-slate-600" />
                            </button>
                            <button className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center">
                              <ExternalLink size={14} className="text-slate-600" />
                            </button>
                          </div>
                        </div>
                        <p className="font-medium text-slate-900 text-sm mb-1">{task.title}</p>
                        <p className="text-xs text-slate-500 mb-2">{task.verifiedAt}</p>
                        {task.hash && (
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                            <Link2 size={10} />
                            <code className="font-mono">{task.hash}</code>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================
// TASK CARD
// ============================================

const TaskCard: React.FC<{ task: Task; phase: Phase; onOpenChat: () => void }> = ({ task, phase, onOpenChat }) => {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <motion.div key={task.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
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
            <button onClick={onOpenChat} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center">
              <MessageCircle size={14} className="text-slate-600" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {task.status === 'active' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-1">{task.title}</h2>
                <p className="text-slate-600 text-sm">{task.description}</p>
              </div>

              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={() => setIsDragging(false)}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${isDragging ? 'border-blue-400 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}
              >
                <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center">
                  {task.type === 'photo' ? <Camera size={24} className="text-slate-400" /> : <FileText size={24} className="text-slate-400" />}
                </div>
                <p className="text-slate-900 font-medium mb-1">Upload {task.type === 'photo' ? 'foto' : 'document'}</p>
                <p className="text-slate-500 text-sm mb-3">Of gebruik smart glasses op de bouwplaats</p>
                <button className="px-5 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800">Bestand kiezen</button>
              </div>

              {task.paymentAmount && task.paymentAmount > 0 && (
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Euro size={16} className="text-blue-600" />
                    <span className="text-sm text-blue-800">Bij verificatie wordt <strong>€{task.paymentAmount.toLocaleString()}</strong> vrijgegeven</span>
                  </div>
                  <Lock size={14} className="text-blue-400" />
                </div>
              )}

              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-xs font-medium text-slate-700 mb-2">Na upload: 2-laags validatie</p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600"><Cpu size={12} className="text-violet-500" /><span>AI Check</span></div>
                  <ChevronRight size={12} className="text-slate-300" />
                  <div className="flex items-center gap-1.5 text-xs text-slate-600"><Building2 size={12} className="text-blue-500" /><span>Broersma</span></div>
                </div>
              </div>
            </div>
          )}

          {task.status === 'pending' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-1">{task.title}</h2>
                <p className="text-slate-600 text-sm">{task.description}</p>
              </div>
              <div className="p-4 bg-amber-50 rounded-xl">
                <p className="text-sm font-medium text-amber-800 mb-3">Validatie in uitvoering...</p>
                {task.validationLayers?.map((layer, idx) => (
                  <div key={idx} className="flex items-center gap-3 py-2 border-b border-amber-100 last:border-0">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${layer.status === 'passed' ? 'bg-emerald-500' : layer.status === 'checking' ? 'bg-amber-500' : 'bg-slate-200'}`}>
                      {layer.status === 'passed' ? <Check size={12} className="text-white" /> : layer.status === 'checking' ? <Loader2 size={12} className="text-white animate-spin" /> : <span className="w-2 h-2 rounded-full bg-slate-400" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-900">{layer.name}</p>
                      {layer.timestamp && <p className="text-xs text-slate-500">{layer.timestamp}</p>}
                    </div>
                    {layer.confidence && <span className="text-xs text-violet-600 font-medium">{layer.confidence}%</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

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

              {task.imageUrl && (
                <div className="relative rounded-xl overflow-hidden bg-slate-100">
                  <img src={task.imageUrl} alt={task.title} className="w-full h-56 object-cover" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <div className="px-2.5 py-1 bg-black/60 backdrop-blur text-white text-xs rounded-lg">{task.verifiedAt}</div>
                    {task.source === 'glasses' && (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-violet-500/90 backdrop-blur text-white text-xs rounded-lg">
                        <Glasses size={12} />
                        Smart Glasses
                      </div>
                    )}
                  </div>
                </div>
              )}

              {task.aiFeedback && (
                <div className="p-3 bg-violet-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles size={14} className="text-violet-600" />
                    <span className="text-xs font-medium text-violet-800">AI Analyse ({task.aiConfidence}%)</span>
                  </div>
                  <p className="text-sm text-violet-900">{task.aiFeedback}</p>
                </div>
              )}

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

          {task.status === 'locked' && (
            <div className="py-8 text-center">
              <Lock size={32} className="mx-auto mb-3 text-slate-300" />
              <p className="text-slate-500 text-sm">Voltooi vorige taken om te ontgrendelen</p>
            </div>
          )}
        </div>
      </div>

      {task.status === 'verified' && (
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Home size={20} className="text-white" />
            </div>
            <div>
              <p className="text-white text-sm font-medium">Toegevoegd aan Woning Paspoort</p>
              <p className="text-slate-400 text-xs">Permanent verankerd</p>
            </div>
          </div>
          <button className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-lg flex items-center gap-1.5">
            <Eye size={12} />
            Bekijk Paspoort
          </button>
        </div>
      )}
    </motion.div>
  );
};

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

export default CollaborativeWorkspace;
