import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Camera, Upload, Check, X, AlertTriangle, Lock, Clock, 
  ChevronRight, ChevronDown, FileText, Image, Video, Compass, 
  MapPin, Bell, MessageSquare, Download, Shield, Zap, Eye,
  CheckCircle2, XCircle, AlertCircle, Loader2, ArrowLeft,
  Building, Hammer, Droplets, Plug, PaintBucket, Key, Sparkles,
  ZoomIn, ZoomOut, RotateCcw, Send, Paperclip
} from 'lucide-react';
import { AppState, WorkspaceProject, WorkspacePhase, WorkspaceTask, TaskStatus } from '../types';

// ============================================
// DEMO PROJECT DATA (FSM State Machine)
// ============================================

const DEMO_PROJECT: WorkspaceProject = {
  id: 'proj-veluwse-heide',
  name: 'Veluwse Heide Residence',
  location: 'Ermelo, Gelderland',
  overallProgress: 35,
  currentPhase: 'fundering',
  isBlocked: false,
  phases: [
    {
      id: 'voorbereiding',
      name: 'Voorbereiding',
      icon: '📋',
      description: 'Vergunningen & planning',
      status: 'verified',
      progress: 100,
      tasks: [
        { id: 't1', title: 'Bouwvergunning goedkeuring', description: 'Gemeente heeft vergunning verleend', assignedRole: 'klant', status: 'verified', artifactType: 'document', verifiedAt: '2024-11-15', verifiedBy: 'Bureau Broersma', blockchainHash: '0x7f3a...' },
        { id: 't2', title: 'Grondonderzoek & sondering', description: 'Bodemanalyse rapport uploaden', assignedRole: 'aannemer', status: 'verified', artifactType: 'document', verifiedAt: '2024-11-20', verifiedBy: 'Bureau Broersma', blockchainHash: '0x8b2c...' },
      ]
    },
    {
      id: 'fundering',
      name: 'Fundering',
      icon: '🏗️',
      description: 'Funderingswerk & beton',
      status: 'active',
      progress: 60,
      tasks: [
        { id: 't3', title: 'Uitgraven bouwput', description: 'Foto van uitgegraven bouwput met dieptemeting', assignedRole: 'aannemer', status: 'verified', artifactType: 'photo', verifiedAt: '2024-11-25', verifiedBy: 'AI + Bureau Broersma', blockchainHash: '0x9d4e...' },
        { id: 't4', title: 'Wapeningsstaal plaatsen', description: 'Foto wapeningskeuring As-A t/m As-D', assignedRole: 'aannemer', status: 'verified', artifactType: 'photo', verifiedAt: '2024-11-28', verifiedBy: 'Bureau Broersma', blockchainHash: '0xa1f2...' },
        { id: 't5', title: 'Betonbon uploaden', description: 'Upload de betonbon met sterkteklasse', assignedRole: 'aannemer', status: 'pending', artifactType: 'document', slaHours: 4, referenceImageUrl: '/generated/steps/step-01-vibe-stijl.jpg' },
        { id: 't6', title: 'Storten fundering', description: 'Foto tijdens storten + drukproef', assignedRole: 'aannemer', status: 'active', artifactType: 'photo', slaHours: 48, referenceImageUrl: '/generated/steps/step-02-kavel-check.jpg' },
        { id: 't7', title: 'Uitharding controle', description: '28-dagen sterkte certificaat', assignedRole: 'kwaliteitsborger', status: 'locked', artifactType: 'document' },
      ]
    },
    {
      id: 'ruwbouw',
      name: 'Ruwbouw',
      icon: '🧱',
      description: 'Muren & constructie',
      status: 'locked',
      progress: 0,
      tasks: [
        { id: 't8', title: 'HSB elementen levering', description: 'Foto afleverbon & elementen', assignedRole: 'aannemer', status: 'locked', artifactType: 'photo' },
        { id: 't9', title: 'Plaatsing begane grond', description: 'Foto montage eerste laag', assignedRole: 'aannemer', status: 'locked', artifactType: 'photo' },
        { id: 't10', title: 'Vloeren leggen', description: 'Foto vloeropbouw per verdieping', assignedRole: 'aannemer', status: 'locked', artifactType: 'photo' },
      ]
    },
    {
      id: 'dak',
      name: 'Dakconstructie',
      icon: '🏠',
      description: 'Dak & waterdicht',
      status: 'locked',
      progress: 0,
      tasks: [
        { id: 't11', title: 'Dakspanten plaatsen', description: 'Foto dakconstructie', assignedRole: 'aannemer', status: 'locked', artifactType: 'photo' },
        { id: 't12', title: 'Dakbedekking', description: 'Foto afgewerkt dak', assignedRole: 'aannemer', status: 'locked', artifactType: 'photo' },
        { id: 't13', title: 'Wind- & waterdicht certificaat', description: 'Keuringsrapport', assignedRole: 'kwaliteitsborger', status: 'locked', artifactType: 'document' },
      ]
    },
    {
      id: 'installaties',
      name: 'Installaties',
      icon: '⚡',
      description: 'Elektra, water & verwarming',
      status: 'locked',
      progress: 0,
      tasks: [
        { id: 't14', title: 'Leidingwerk water', description: 'Foto leidingen voor dichtzetten', assignedRole: 'aannemer', status: 'locked', artifactType: 'photo' },
        { id: 't15', title: 'Elektra bekabeling', description: 'Foto bekabeling per ruimte', assignedRole: 'aannemer', status: 'locked', artifactType: 'photo' },
        { id: 't16', title: 'Warmtepomp installatie', description: 'Foto & certificaat', assignedRole: 'aannemer', status: 'locked', artifactType: 'photo' },
      ]
    },
    {
      id: 'afwerking',
      name: 'Afwerking',
      icon: '🎨',
      description: 'Stucwerk, schilderwerk & vloeren',
      status: 'locked',
      progress: 0,
      tasks: [
        { id: 't17', title: 'Stucwerk wanden', description: 'Foto per ruimte', assignedRole: 'aannemer', status: 'locked', artifactType: 'photo' },
        { id: 't18', title: 'Vloerverwarming test', description: 'Thermografische scan', assignedRole: 'kwaliteitsborger', status: 'locked', artifactType: 'photo' },
        { id: 't19', title: 'Schilderwerk', description: 'Foto afgewerkte ruimtes', assignedRole: 'aannemer', status: 'locked', artifactType: 'photo' },
      ]
    },
    {
      id: 'oplevering',
      name: 'Oplevering',
      icon: '🔑',
      description: 'Eindcontrole & sleuteloverdracht',
      status: 'locked',
      progress: 0,
      tasks: [
        { id: 't20', title: 'Eindkeuring kwaliteitsborger', description: 'Volledig keuringsrapport', assignedRole: 'kwaliteitsborger', status: 'locked', artifactType: 'document' },
        { id: 't21', title: 'Opleverlijst afhandelen', description: 'Alle puntjes afgevinkt', assignedRole: 'aannemer', status: 'locked', artifactType: 'document' },
        { id: 't22', title: 'Sleuteloverdracht', description: 'Foto + handtekening', assignedRole: 'klant', status: 'locked', artifactType: 'photo' },
      ]
    },
  ]
};

// ============================================
// HELPER COMPONENTS
// ============================================

const StatusBadge: React.FC<{ status: TaskStatus }> = ({ status }) => {
  const config: Record<TaskStatus, { bg: string; text: string; icon: React.ReactNode; label: string }> = {
    locked: { bg: 'bg-slate-500/20', text: 'text-slate-400', icon: <Lock size={12} />, label: 'Vergrendeld' },
    active: { bg: 'bg-blue-500/20', text: 'text-blue-400', icon: <Zap size={12} />, label: 'Actief' },
    pending: { bg: 'bg-amber-500/20', text: 'text-amber-400', icon: <Clock size={12} />, label: 'In Review' },
    rejected: { bg: 'bg-red-500/20', text: 'text-red-400', icon: <XCircle size={12} />, label: 'Afgekeurd' },
    verified: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', icon: <CheckCircle2 size={12} />, label: 'Geverifieerd' },
  };
  const c = config[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${c.bg} ${c.text}`}>
      {c.icon} {c.label}
    </span>
  );
};

const RoleBadge: React.FC<{ role: 'aannemer' | 'klant' | 'kwaliteitsborger' }> = ({ role }) => {
  const config = {
    aannemer: { bg: 'bg-amber-500/20', text: 'text-amber-300', label: 'Aannemer' },
    klant: { bg: 'bg-blue-500/20', text: 'text-blue-300', label: 'Klant' },
    kwaliteitsborger: { bg: 'bg-purple-500/20', text: 'text-purple-300', label: 'Kwaliteitsborger' },
  };
  const c = config[role];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
};

const ArtifactIcon: React.FC<{ type: 'photo' | 'video' | 'document' | 'lidar' }> = ({ type }) => {
  const icons = {
    photo: <Camera size={16} />,
    video: <Video size={16} />,
    document: <FileText size={16} />,
    lidar: <Compass size={16} />,
  };
  return <span className="text-blue-400">{icons[type]}</span>;
};

// ============================================
// FSM TIMELINE SIDEBAR (Metro Map)
// ============================================

interface TimelineSidebarProps {
  project: WorkspaceProject;
  selectedPhase: string;
  selectedTask: string | null;
  onSelectPhase: (phaseId: string) => void;
  onSelectTask: (taskId: string) => void;
}

const TimelineSidebar: React.FC<TimelineSidebarProps> = ({ 
  project, selectedPhase, selectedTask, onSelectPhase, onSelectTask 
}) => {
  const [expandedPhases, setExpandedPhases] = useState<string[]>([selectedPhase]);

  const togglePhase = (phaseId: string) => {
    setExpandedPhases(prev => 
      prev.includes(phaseId) ? prev.filter(p => p !== phaseId) : [...prev, phaseId]
    );
    onSelectPhase(phaseId);
  };

  return (
    <div className="w-80 bg-[#0f172a] border-r border-slate-700/50 flex flex-col h-full">
      {/* Project Header */}
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <Building size={20} className="text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-white text-sm">{project.name}</h2>
            <p className="text-slate-400 text-xs">{project.location}</p>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Totale voortgang</span>
            <span className="text-blue-400 font-mono font-bold">{project.overallProgress}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
              initial={{ width: 0 }}
              animate={{ width: `${project.overallProgress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* Metro Timeline */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="relative">
          {/* The Metro Line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-[2px] bg-slate-700" />

          {project.phases.map((phase, phaseIndex) => {
            const isExpanded = expandedPhases.includes(phase.id);
            const isSelected = selectedPhase === phase.id;
            const statusColor = {
              locked: 'bg-slate-600 border-slate-500',
              active: 'bg-blue-500 border-blue-400 ring-4 ring-blue-500/30',
              pending: 'bg-amber-500 border-amber-400',
              rejected: 'bg-red-500 border-red-400 animate-pulse',
              verified: 'bg-emerald-500 border-emerald-400',
            }[phase.status];

            return (
              <div key={phase.id} className="relative mb-2">
                {/* Phase Node (Metro Station) */}
                <button
                  onClick={() => togglePhase(phase.id)}
                  disabled={phase.status === 'locked'}
                  className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all ${
                    isSelected ? 'bg-slate-800/80' : 'hover:bg-slate-800/40'
                  } ${phase.status === 'locked' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {/* Station Circle */}
                  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center z-10 ${statusColor}`}>
                    {phase.status === 'locked' ? (
                      <Lock size={16} className="text-slate-400" />
                    ) : phase.status === 'verified' ? (
                      <Check size={16} className="text-white" />
                    ) : (
                      <span className="text-lg">{phase.icon}</span>
                    )}
                  </div>
                  
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium text-sm ${phase.status === 'locked' ? 'text-slate-500' : 'text-white'}`}>
                        {phase.name}
                      </span>
                      {phase.status !== 'locked' && (
                        <ChevronDown 
                          size={14} 
                          className={`text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                        />
                      )}
                    </div>
                    <div className="text-xs text-slate-500">{phase.description}</div>
                  </div>

                  {phase.status !== 'locked' && (
                    <div className="text-right">
                      <div className="text-xs font-mono text-blue-400">{phase.progress}%</div>
                    </div>
                  )}
                </button>

                {/* Sub-tasks (Mini stations) */}
                <AnimatePresence>
                  {isExpanded && phase.status !== 'locked' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="ml-[19px] pl-6 border-l-2 border-slate-700 mt-1 space-y-1"
                    >
                      {phase.tasks.map((task) => {
                        const taskStatusColor = {
                          locked: 'bg-slate-600',
                          active: 'bg-blue-500 ring-2 ring-blue-500/50',
                          pending: 'bg-amber-500',
                          rejected: 'bg-red-500 animate-pulse',
                          verified: 'bg-emerald-500',
                        }[task.status];

                        return (
                          <button
                            key={task.id}
                            onClick={() => task.status !== 'locked' && onSelectTask(task.id)}
                            disabled={task.status === 'locked'}
                            className={`w-full flex items-center gap-2 p-2 rounded-md transition-all text-left ${
                              selectedTask === task.id ? 'bg-blue-500/20' : 'hover:bg-slate-800/40'
                            } ${task.status === 'locked' ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                          >
                            <div className={`w-3 h-3 rounded-full ${taskStatusColor}`} />
                            <span className={`text-xs flex-1 ${task.status === 'locked' ? 'text-slate-500' : 'text-slate-300'}`}>
                              {task.title}
                            </span>
                            <ArtifactIcon type={task.artifactType} />
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-slate-700/50 space-y-2">
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors">
          <FileText size={16} />
          Bekijk Woonpaspoort
        </button>
      </div>
    </div>
  );
};

// ============================================
// TASK CARD (The Workbench)
// ============================================

interface TaskCardProps {
  task: WorkspaceTask;
  onUpload: (file: File) => void;
  onApprove?: () => void;
  onReject?: (reason: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(r => setTimeout(r, 100));
      setUploadProgress(i);
    }
    setIsUploading(false);
    onUpload(file);
  };

  return (
    <div className="bg-[#1e293b] rounded-2xl border border-slate-700/50 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <RoleBadge role={task.assignedRole} />
              <StatusBadge status={task.status} />
            </div>
            <h3 className="text-xl font-semibold text-white">{task.title}</h3>
          </div>
          {task.slaHours && task.status === 'active' && (
            <div className="flex items-center gap-2 px-3 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <Clock size={14} className="text-amber-400" />
              <span className="text-amber-400 text-sm font-mono">{task.slaHours}u resterend</span>
            </div>
          )}
        </div>
        <p className="text-slate-400">{task.description}</p>
      </div>

      {/* Instruction Zone */}
      {task.referenceImageUrl && (
        <div className="p-6 border-b border-slate-700/50 bg-slate-800/30">
          <div className="flex items-center gap-2 mb-3">
            <Eye size={16} className="text-blue-400" />
            <span className="text-sm font-medium text-slate-300">Referentie (Good Practice)</span>
          </div>
          <div className="relative rounded-xl overflow-hidden">
            <img 
              src={task.referenceImageUrl} 
              alt="Reference" 
              className="w-full h-48 object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
            <div className="absolute bottom-3 left-3 text-xs text-slate-300 bg-black/50 px-2 py-1 rounded">
              📷 Zorg dat dit zichtbaar is in je foto
            </div>
          </div>
        </div>
      )}

      {/* Drop Zone / Upload Area */}
      {task.status === 'active' && (
        <div className="p-6">
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              isDragging 
                ? 'border-blue-400 bg-blue-500/10' 
                : 'border-slate-600 hover:border-slate-500 hover:bg-slate-800/30'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={task.artifactType === 'photo' ? 'image/*' : task.artifactType === 'video' ? 'video/*' : '*'}
              capture={task.artifactType === 'photo' ? 'environment' : undefined}
              onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
              className="hidden"
            />

            {isUploading ? (
              <div className="space-y-4">
                <Loader2 size={48} className="mx-auto text-blue-400 animate-spin" />
                <div className="w-48 mx-auto h-2 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-slate-400">Uploaden... {uploadProgress}%</p>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
                  {task.artifactType === 'photo' ? <Camera size={28} className="text-blue-400" /> :
                   task.artifactType === 'video' ? <Video size={28} className="text-blue-400" /> :
                   task.artifactType === 'document' ? <FileText size={28} className="text-blue-400" /> :
                   <Compass size={28} className="text-blue-400" />}
                </div>
                <p className="text-white font-medium mb-2">
                  {task.artifactType === 'photo' ? 'Maak een foto of sleep hier' :
                   task.artifactType === 'video' ? 'Neem video op of sleep hier' :
                   'Sleep document hierheen'}
                </p>
                <p className="text-slate-500 text-sm">
                  Ondersteunde formaten: {task.artifactType === 'photo' ? 'JPG, PNG, HEIC' : 
                                          task.artifactType === 'video' ? 'MP4, MOV' : 'PDF, DOC, XLS'}
                </p>
              </>
            )}
          </div>

          {/* Metadata indicators */}
          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <MapPin size={12} /> GPS wordt vastgelegd
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} /> Tijdstempel
            </span>
            <span className="flex items-center gap-1">
              <Compass size={12} /> Richting
            </span>
          </div>
        </div>
      )}

      {/* Verified State */}
      {task.status === 'verified' && (
        <div className="p-6 bg-emerald-500/5 border-t border-emerald-500/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 size={24} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-emerald-400 font-medium">Geverifieerd ✓</p>
              <p className="text-slate-500 text-sm">Door {task.verifiedBy} op {task.verifiedAt}</p>
            </div>
          </div>
          {task.blockchainHash && (
            <div className="flex items-center gap-2 p-3 bg-slate-800/50 rounded-lg">
              <Shield size={14} className="text-blue-400" />
              <span className="text-xs text-slate-400">Cryptografisch zegel:</span>
              <code className="text-xs text-blue-400 font-mono">{task.blockchainHash}</code>
            </div>
          )}
        </div>
      )}

      {/* Pending State (AI Validation) */}
      {task.status === 'pending' && (
        <div className="p-6 bg-amber-500/5 border-t border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
              <Loader2 size={24} className="text-amber-400 animate-spin" />
            </div>
            <div>
              <p className="text-amber-400 font-medium">In review...</p>
              <p className="text-slate-500 text-sm">Gemini Vision AI analyseert je upload</p>
            </div>
          </div>
        </div>
      )}

      {/* Rejected State */}
      {task.status === 'rejected' && (
        <div className="p-6 bg-red-500/5 border-t border-red-500/20">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
              <XCircle size={24} className="text-red-400" />
            </div>
            <div>
              <p className="text-red-400 font-medium">Afgekeurd</p>
              <p className="text-slate-400 text-sm mt-1">
                {task.rejectionReason || 'De upload voldoet niet aan de vereisten. Upload opnieuw.'}
              </p>
            </div>
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-medium transition-colors"
          >
            Opnieuw uploaden
          </button>
        </div>
      )}
    </div>
  );
};

// ============================================
// QUALITY CONTROLLER VIEW
// ============================================

interface ValidationCockpitProps {
  task: WorkspaceTask;
  onApprove: () => void;
  onRequestInfo: () => void;
  onReject: (reason: string) => void;
}

const ValidationCockpit: React.FC<ValidationCockpitProps> = ({ task, onApprove, onRequestInfo, onReject }) => {
  const [zoom, setZoom] = useState(1);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  return (
    <div className="bg-[#1e293b] rounded-2xl border border-slate-700/50 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <Shield size={16} className="text-purple-400" />
          </div>
          <div>
            <h3 className="text-white font-medium">{task.title}</h3>
            <p className="text-slate-500 text-xs">Validatie Cockpit</p>
          </div>
        </div>
        <RoleBadge role="kwaliteitsborger" />
      </div>

      {/* Split View Comparator */}
      <div className="grid grid-cols-2 gap-px bg-slate-700">
        {/* Left: Uploaded Artifact */}
        <div className="bg-[#1e293b] p-4">
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
            <Camera size={12} />
            Geüploade foto
          </div>
          <div className="relative rounded-xl overflow-hidden bg-slate-800 aspect-video">
            <img 
              src="/generated/steps/step-02-kavel-check.jpg" 
              alt="Uploaded"
              className="w-full h-full object-cover"
              style={{ transform: `scale(${zoom})` }}
            />
          </div>
        </div>

        {/* Right: Reference / Source of Truth */}
        <div className="bg-[#1e293b] p-4">
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
            <FileText size={12} />
            Technische tekening
          </div>
          <div className="relative rounded-xl overflow-hidden bg-slate-800 aspect-video">
            <img 
              src="/generated/blueprint-wood-house.png" 
              alt="Reference"
              className="w-full h-full object-cover opacity-80"
              style={{ transform: `scale(${zoom})` }}
            />
          </div>
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="flex items-center justify-center gap-2 py-3 bg-slate-800/50">
        <button 
          onClick={() => setZoom(z => Math.max(1, z - 0.25))}
          className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300"
        >
          <ZoomOut size={16} />
        </button>
        <span className="text-xs text-slate-400 font-mono w-16 text-center">{Math.round(zoom * 100)}%</span>
        <button 
          onClick={() => setZoom(z => Math.min(3, z + 0.25))}
          className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300"
        >
          <ZoomIn size={16} />
        </button>
        <button 
          onClick={() => setZoom(1)}
          className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* AI Analysis Results */}
      <div className="p-4 border-t border-slate-700/50 bg-blue-500/5">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={14} className="text-blue-400" />
          <span className="text-sm font-medium text-blue-300">Gemini Vision AI Analyse</span>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 size={14} />
            <span>Wapening gedetecteerd in beeld</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 size={14} />
            <span>Locatie komt overeen met GPS coördinaten</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <AlertCircle size={14} />
            <span>Betrouwbaarheid: 94%</span>
          </div>
        </div>
      </div>

      {/* Decision Buttons */}
      <div className="p-4 border-t border-slate-700/50 grid grid-cols-3 gap-3">
        <button 
          onClick={onApprove}
          className="flex items-center justify-center gap-2 py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-semibold transition-colors"
        >
          <CheckCircle2 size={20} />
          Goedkeuren
        </button>
        <button 
          onClick={onRequestInfo}
          className="flex items-center justify-center gap-2 py-4 bg-amber-500 hover:bg-amber-400 text-white rounded-xl font-semibold transition-colors"
        >
          <MessageSquare size={20} />
          Opmerking
        </button>
        <button 
          onClick={() => setShowRejectModal(true)}
          className="flex items-center justify-center gap-2 py-4 bg-red-500 hover:bg-red-400 text-white rounded-xl font-semibold transition-colors"
        >
          <XCircle size={20} />
          Afkeuren
        </button>
      </div>

      {/* Reject Modal */}
      <AnimatePresence>
        {showRejectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setShowRejectModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-[#1e293b] rounded-2xl p-6 max-w-md w-full border border-slate-700"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Reden van afkeuring</h3>
              <select
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white mb-4"
              >
                <option value="">Selecteer reden...</option>
                <option value="not_conform">Niet conform tekening</option>
                <option value="quality">Slechte fotokwaliteit</option>
                <option value="material">Materiaal onjuist</option>
                <option value="location">Locatie niet correct</option>
                <option value="other">Anders</option>
              </select>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl"
                >
                  Annuleren
                </button>
                <button 
                  onClick={() => { onReject(rejectReason); setShowRejectModal(false); }}
                  disabled={!rejectReason}
                  className="flex-1 py-3 bg-red-500 hover:bg-red-400 disabled:opacity-50 text-white rounded-xl"
                >
                  Bevestig afkeuring
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================
// HOUSING PASSPORT VIEW
// ============================================

const HousingPassport: React.FC<{ project: WorkspaceProject }> = ({ project }) => {
  const completedTasks = project.phases.flatMap(p => p.tasks).filter(t => t.status === 'verified');
  
  return (
    <div className="bg-[#1e293b] rounded-2xl border border-slate-700/50 overflow-hidden">
      <div className="p-6 border-b border-slate-700/50 bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <FileText size={32} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Woonpaspoort</h2>
            <p className="text-slate-400">Digitale Tweeling van {project.name}</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-slate-800/50 rounded-xl">
            <div className="text-3xl font-bold text-blue-400 font-mono">{completedTasks.length}</div>
            <div className="text-slate-500 text-sm">Geverifieerde documenten</div>
          </div>
          <div className="p-4 bg-slate-800/50 rounded-xl">
            <div className="text-3xl font-bold text-emerald-400 font-mono">{project.overallProgress}%</div>
            <div className="text-slate-500 text-sm">Project compleetheid</div>
          </div>
        </div>

        {/* Document Timeline */}
        <h3 className="text-white font-semibold mb-4">Vastgelegde documenten</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {completedTasks.map(task => (
            <div key={task.id} className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 transition-colors cursor-pointer group">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <ArtifactIcon type={task.artifactType} />
              </div>
              <div className="flex-1">
                <div className="text-white text-sm font-medium">{task.title}</div>
                <div className="text-slate-500 text-xs">Geverifieerd op {task.verifiedAt}</div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300">
                  <Eye size={14} />
                </button>
                <button className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300">
                  <Download size={14} />
                </button>
              </div>
              {/* Blockchain seal */}
              {task.blockchainHash && (
                <div className="hidden group-hover:flex items-center gap-1 px-2 py-1 bg-blue-500/20 rounded text-xs text-blue-400">
                  <Shield size={10} />
                  <code className="font-mono">{task.blockchainHash}</code>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN COLLABORATIVE WORKSPACE COMPONENT
// ============================================

interface CollaborativeWorkspaceProps {
  setAppState: (state: AppState) => void;
}

export const CollaborativeWorkspace: React.FC<CollaborativeWorkspaceProps> = ({ setAppState }) => {
  const [project] = useState<WorkspaceProject>(DEMO_PROJECT);
  const [selectedPhase, setSelectedPhase] = useState('fundering');
  const [selectedTask, setSelectedTask] = useState<string | null>('t6');
  const [viewMode, setViewMode] = useState<'tasks' | 'validator' | 'passport'>('tasks');
  const [showBlockedBanner, setShowBlockedBanner] = useState(false);

  const currentPhase = project.phases.find(p => p.id === selectedPhase);
  const currentTask = currentPhase?.tasks.find(t => t.id === selectedTask);

  const handleUpload = (file: File) => {
    console.log('Uploaded:', file.name);
    // In real app: upload to storage, trigger AI validation
  };

  return (
    <div className="h-screen bg-[#0a1628] flex flex-col overflow-hidden">
      {/* Blocked Banner (The Blocker) */}
      <AnimatePresence>
        {showBlockedBanner && (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className="bg-red-500 text-white px-6 py-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle size={24} />
              <div>
                <p className="font-bold">PROJECT GESTOPT: Correctie vereist in Fase 2</p>
                <p className="text-sm text-red-100">De fundering kan niet voortgezet worden totdat dit is opgelost.</p>
              </div>
            </div>
            <button 
              onClick={() => setShowBlockedBanner(false)}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium"
            >
              Bekijk probleem
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navigation */}
      <nav className="bg-[#0f172a] border-b border-slate-700/50 px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setAppState(AppState.LANDING)}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm">Terug</span>
          </button>
          <div className="w-px h-6 bg-slate-700" />
          <div className="flex items-center gap-2">
            <img src="/generated/og-logo.png" alt="OoitGedacht" className="h-6 brightness-0 invert opacity-60" />
            <span className="text-white font-semibold">Construction OS</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-800 rounded-lg p-1">
            <button 
              onClick={() => setViewMode('tasks')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'tasks' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Taken
            </button>
            <button 
              onClick={() => setViewMode('validator')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'validator' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Validatie
            </button>
            <button 
              onClick={() => setViewMode('passport')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'passport' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Paspoort
            </button>
          </div>

          <div className="w-px h-6 bg-slate-700" />
          
          <button className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center text-white">3</span>
          </button>
          
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
            JD
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* FSM Timeline Sidebar */}
        <TimelineSidebar
          project={project}
          selectedPhase={selectedPhase}
          selectedTask={selectedTask}
          onSelectPhase={setSelectedPhase}
          onSelectTask={setSelectedTask}
        />

        {/* Workbench Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto">
            {viewMode === 'tasks' && currentTask && (
              <>
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                  <span>{currentPhase?.name}</span>
                  <ChevronRight size={14} />
                  <span className="text-white">{currentTask.title}</span>
                </div>

                <TaskCard 
                  task={currentTask}
                  onUpload={handleUpload}
                />
              </>
            )}

            {viewMode === 'validator' && currentTask && (
              <ValidationCockpit
                task={currentTask}
                onApprove={() => console.log('Approved')}
                onRequestInfo={() => console.log('Request info')}
                onReject={(reason) => console.log('Rejected:', reason)}
              />
            )}

            {viewMode === 'passport' && (
              <HousingPassport project={project} />
            )}

            {!currentTask && viewMode === 'tasks' && (
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-800 flex items-center justify-center">
                  <Hammer size={32} className="text-slate-600" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Selecteer een taak</h3>
                <p className="text-slate-500">Klik op een taak in de tijdlijn om te beginnen</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Chat / Activity (Optional) */}
        <div className="w-80 bg-[#0f172a] border-l border-slate-700/50 flex flex-col">
          <div className="p-4 border-b border-slate-700/50">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <MessageSquare size={16} className="text-blue-400" />
              Project Chat
            </h3>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              {/* Chat messages */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-xs font-bold flex-shrink-0">
                  AB
                </div>
                <div className="bg-slate-800 rounded-xl rounded-tl-none p-3 max-w-[80%]">
                  <p className="text-sm text-white">Wapeningsstaal is geplaatst, foto volgt zo.</p>
                  <span className="text-xs text-slate-500 mt-1 block">10:34</span>
                </div>
              </div>
              
              <div className="flex gap-3 justify-end">
                <div className="bg-blue-500/20 rounded-xl rounded-tr-none p-3 max-w-[80%]">
                  <p className="text-sm text-blue-100">Top! Let op dat de afstandhouders goed zichtbaar zijn.</p>
                  <span className="text-xs text-blue-400/50 mt-1 block">10:45</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  JD
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-xs font-bold flex-shrink-0">
                  BB
                </div>
                <div className="bg-slate-800 rounded-xl rounded-tl-none p-3 max-w-[80%]">
                  <p className="text-sm text-white">✅ Wapening goedgekeurd. Betaling vrijgegeven.</p>
                  <span className="text-xs text-slate-500 mt-1 block">Bureau Broersma • 11:20</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-slate-700/50">
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400">
                <Paperclip size={18} />
              </button>
              <input 
                type="text"
                placeholder="Typ een bericht..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button className="p-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborativeWorkspace;

