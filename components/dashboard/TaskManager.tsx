/**
 * TaskManager - P1.2: Task management with photo requirements
 * 
 * Features:
 * - Tasks grouped by phase
 * - Photo requirements per task
 * - Upload progress tracking
 * - Verification status
 * - Deadline management
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, CheckCircle2, Clock, AlertTriangle, Upload,
  ChevronDown, ChevronRight, Image, X, ZoomIn, Lock,
  FileCheck, MessageSquare, Calendar, Trash2, Plus,
  Eye, Download, Share2, MoreHorizontal
} from 'lucide-react';
import { GlassCard, GlassCardHeader } from './GlassCard';

interface PhotoRequirement {
  id: string;
  description: string;
  type: 'required' | 'optional' | 'conditional';
  status: 'pending' | 'uploaded' | 'verified' | 'rejected';
  uploadedPhoto?: string;
  uploadDate?: string;
  verificationNote?: string;
  tips?: string[];
}

interface Task {
  id: string;
  title: string;
  description: string;
  phase: string;
  status: 'locked' | 'pending' | 'in_progress' | 'awaiting_verification' | 'completed';
  deadline?: string;
  assignee?: string;
  photoRequirements: PhotoRequirement[];
  unlocksPayment?: number;
  dependencies?: string[];
  completedDate?: string;
}

interface TaskManagerProps {
  className?: string;
  tasks?: Task[];
  onPhotoUpload?: (taskId: string, photoId: string, file: File) => void;
  onTaskClick?: (task: Task) => void;
}

const DEMO_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Storten fundering',
    description: 'Beton storten voor de fundering van de woning',
    phase: 'Fundering',
    status: 'in_progress',
    deadline: 'Vandaag, 17:00',
    assignee: 'Van der Berg Bouw',
    unlocksPayment: 15000,
    photoRequirements: [
      {
        id: 'photo-1',
        description: 'Overzichtsfoto betonmixer op locatie',
        type: 'required',
        status: 'uploaded',
        uploadedPhoto: '/generated/milestones/fundering/fundering-storten.png',
        uploadDate: 'Vandaag, 09:15',
      },
      {
        id: 'photo-2',
        description: 'Close-up tijdens het storten',
        type: 'required',
        status: 'pending',
        tips: [
          'Zorg dat de betonmolen zichtbaar is',
          'Maak de foto vanuit de bekisting',
          'Datum/tijd moet zichtbaar zijn',
        ],
      },
      {
        id: 'photo-3',
        description: 'Foto van de vloeistofspiegel',
        type: 'required',
        status: 'pending',
      },
      {
        id: 'photo-4',
        description: 'Wapeningsstaal zichtbaar voor het storten',
        type: 'optional',
        status: 'verified',
        uploadedPhoto: '/generated/milestones/fundering/fundering-wapening.png',
        uploadDate: 'Gisteren, 14:22',
        verificationNote: 'Goedgekeurd door Bureau Broersma',
      },
    ],
  },
  {
    id: 'task-2',
    title: 'Wapeningskeuring',
    description: 'Inspectie van wapeningsstaal door kwaliteitsborger',
    phase: 'Fundering',
    status: 'completed',
    assignee: 'Bureau Broersma',
    completedDate: 'Gisteren',
    photoRequirements: [
      {
        id: 'photo-5',
        description: 'Overzicht wapeningsnet',
        type: 'required',
        status: 'verified',
        uploadedPhoto: '/generated/milestones/fundering/fundering-wapening.png',
        verificationNote: 'Goedgekeurd',
      },
      {
        id: 'photo-6',
        description: 'Detail hoekverbindingen',
        type: 'required',
        status: 'verified',
        uploadedPhoto: '/generated/milestones/fundering/fundering-wapening.png',
        verificationNote: 'Goedgekeurd',
      },
    ],
  },
  {
    id: 'task-3',
    title: 'Uitharden fundering',
    description: '28 dagen uithardingsperiode voor het beton',
    phase: 'Fundering',
    status: 'locked',
    dependencies: ['task-1'],
    photoRequirements: [
      {
        id: 'photo-7',
        description: 'Foto na 7 dagen uitharding',
        type: 'conditional',
        status: 'pending',
      },
      {
        id: 'photo-8',
        description: 'Foto na 28 dagen uitharding',
        type: 'required',
        status: 'pending',
      },
    ],
  },
];

export const TaskManager: React.FC<TaskManagerProps> = ({
  className = '',
  tasks = DEMO_TASKS,
  onPhotoUpload,
  onTaskClick,
}) => {
  const [expandedTask, setExpandedTask] = useState<string | null>('task-1');
  const [expandedPhoto, setExpandedPhoto] = useState<string | null>(null);
  const [dragOverPhoto, setDragOverPhoto] = useState<string | null>(null);

  const getStatusConfig = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return {
          icon: <CheckCircle2 size={16} />,
          label: 'Voltooid',
          color: 'emerald',
          bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
        };
      case 'awaiting_verification':
        return {
          icon: <Clock size={16} />,
          label: 'Wacht op verificatie',
          color: 'amber',
          bg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
        };
      case 'in_progress':
        return {
          icon: <Camera size={16} />,
          label: 'Actie vereist',
          color: 'blue',
          bg: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
        };
      case 'pending':
        return {
          icon: <Clock size={16} />,
          label: 'Gepland',
          color: 'white',
          bg: 'bg-white/5 border-white/10 text-white/60',
        };
      case 'locked':
        return {
          icon: <Lock size={16} />,
          label: 'Op slot',
          color: 'gray',
          bg: 'bg-white/5 border-white/10 text-white/30',
        };
    }
  };

  const getPhotoStatusConfig = (status: PhotoRequirement['status']) => {
    switch (status) {
      case 'verified':
        return {
          icon: <CheckCircle2 size={14} />,
          label: 'Geverifieerd',
          color: 'text-emerald-400',
          bg: 'bg-emerald-500/10 border-emerald-500/20',
        };
      case 'uploaded':
        return {
          icon: <Clock size={14} />,
          label: 'Wacht op verificatie',
          color: 'text-amber-400',
          bg: 'bg-amber-500/10 border-amber-500/20',
        };
      case 'rejected':
        return {
          icon: <X size={14} />,
          label: 'Afgekeurd',
          color: 'text-rose-400',
          bg: 'bg-rose-500/10 border-rose-500/20',
        };
      case 'pending':
        return {
          icon: <Camera size={14} />,
          label: 'Upload vereist',
          color: 'text-white/50',
          bg: 'bg-white/5 border-white/10',
        };
    }
  };

  const handleFileDrop = (taskId: string, photoId: string, e: React.DragEvent) => {
    e.preventDefault();
    setDragOverPhoto(null);
    const files = e.dataTransfer.files;
    if (files.length > 0 && onPhotoUpload) {
      onPhotoUpload(taskId, photoId, files[0]);
    }
  };

  const completedPhotos = (task: Task) => 
    task.photoRequirements.filter(p => p.status === 'verified' || p.status === 'uploaded').length;
  const requiredPhotos = (task: Task) => 
    task.photoRequirements.filter(p => p.type === 'required').length;

  return (
    <div className={`space-y-3 ${className}`}>
      {tasks.map((task, index) => {
        const statusConfig = getStatusConfig(task.status);
        const isExpanded = expandedTask === task.id;
        const photoProgress = completedPhotos(task);
        const photoTotal = requiredPhotos(task);

        return (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <GlassCard 
              className={`overflow-hidden ${task.status === 'locked' ? 'opacity-50' : ''}`}
            >
              {/* Task Header */}
              <button
                onClick={() => setExpandedTask(isExpanded ? null : task.id)}
                disabled={task.status === 'locked'}
                className="w-full p-4 flex items-center gap-4 text-left"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${statusConfig.bg}`}>
                  {statusConfig.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-semibold ${task.status === 'locked' ? 'text-white/40' : 'text-white'}`}>
                      {task.title}
                    </h3>
                    <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${statusConfig.bg}`}>
                      {statusConfig.label}
                    </span>
                  </div>
                  <p className="text-xs text-white/40 mt-0.5">{task.assignee || task.phase}</p>
                </div>

                {/* Photo progress indicator */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="flex items-center gap-1.5 text-xs text-white/50">
                      <Camera size={12} />
                      <span>{photoProgress}/{photoTotal} foto's</span>
                    </div>
                    {task.deadline && task.status !== 'completed' && task.status !== 'locked' && (
                      <p className="text-[10px] text-amber-400 mt-0.5">{task.deadline}</p>
                    )}
                  </div>
                  {task.status !== 'locked' && (
                    <ChevronDown 
                      size={20} 
                      className={`text-white/30 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  )}
                </div>
              </button>

              {/* Expanded Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-4">
                      {/* Description */}
                      <p className="text-sm text-white/60">{task.description}</p>

                      {/* Payment unlock */}
                      {task.unlocksPayment && (
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between">
                          <span className="text-xs text-emerald-400">Na voltooiing vrijgeven:</span>
                          <span className="font-mono font-bold text-emerald-400">
                            €{task.unlocksPayment.toLocaleString()}
                          </span>
                        </div>
                      )}

                      {/* Photo Requirements */}
                      <div className="space-y-2">
                        <p className="text-xs text-white/40 uppercase tracking-wider">Foto's vereist</p>
                        
                        {task.photoRequirements.map((photo) => {
                          const photoConfig = getPhotoStatusConfig(photo.status);
                          const isPhotoExpanded = expandedPhoto === photo.id;

                          return (
                            <div 
                              key={photo.id}
                              className={`rounded-xl border overflow-hidden ${photoConfig.bg}`}
                            >
                              <button
                                onClick={() => setExpandedPhoto(isPhotoExpanded ? null : photo.id)}
                                className="w-full p-3 flex items-center gap-3"
                              >
                                {/* Thumbnail or placeholder */}
                                <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center overflow-hidden flex-shrink-0">
                                  {photo.uploadedPhoto ? (
                                    <img 
                                      src={photo.uploadedPhoto} 
                                      alt={photo.description}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <Camera size={20} className="text-white/20" />
                                  )}
                                </div>

                                <div className="flex-1 text-left min-w-0">
                                  <div className="flex items-center gap-2">
                                    <p className="text-sm text-white truncate">{photo.description}</p>
                                    {photo.type === 'required' && (
                                      <span className="px-1.5 py-0.5 text-[9px] bg-rose-500/20 text-rose-400 rounded">
                                        Verplicht
                                      </span>
                                    )}
                                  </div>
                                  {photo.uploadDate && (
                                    <p className="text-[10px] text-white/40">{photo.uploadDate}</p>
                                  )}
                                </div>

                                <div className={`flex items-center gap-1.5 ${photoConfig.color}`}>
                                  {photoConfig.icon}
                                  <span className="text-xs">{photoConfig.label}</span>
                                </div>
                              </button>

                              {/* Photo expanded content */}
                              <AnimatePresence>
                                {isPhotoExpanded && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="px-3 pb-3 space-y-3">
                                      {/* Upload area for pending */}
                                      {photo.status === 'pending' && (
                                        <div
                                          onDragOver={(e) => { e.preventDefault(); setDragOverPhoto(photo.id); }}
                                          onDragLeave={() => setDragOverPhoto(null)}
                                          onDrop={(e) => handleFileDrop(task.id, photo.id, e)}
                                          className={`p-6 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all ${
                                            dragOverPhoto === photo.id 
                                              ? 'border-blue-500 bg-blue-500/10' 
                                              : 'border-white/10 bg-white/5'
                                          }`}
                                        >
                                          <Upload size={24} className="mx-auto mb-2 text-white/40" />
                                          <p className="text-sm text-white/60">Sleep foto hierheen</p>
                                          <p className="text-xs text-white/30 mt-1">of klik om te selecteren</p>
                                        </div>
                                      )}

                                      {/* Tips */}
                                      {photo.tips && photo.tips.length > 0 && (
                                        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                                          <p className="text-xs text-blue-400 font-medium mb-2">💡 Tips voor deze foto:</p>
                                          <ul className="space-y-1">
                                            {photo.tips.map((tip, i) => (
                                              <li key={i} className="text-xs text-blue-300/80 flex items-start gap-2">
                                                <span className="text-blue-400 mt-0.5">•</span>
                                                {tip}
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}

                                      {/* Verification note */}
                                      {photo.verificationNote && (
                                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-2">
                                          <FileCheck size={14} className="text-emerald-400 mt-0.5" />
                                          <div>
                                            <p className="text-xs text-emerald-400 font-medium">Verificatie</p>
                                            <p className="text-xs text-emerald-300/80">{photo.verificationNote}</p>
                                          </div>
                                        </div>
                                      )}

                                      {/* Actions for uploaded photos */}
                                      {photo.uploadedPhoto && (
                                        <div className="flex gap-2">
                                          <button className="flex-1 px-3 py-2 bg-white/5 rounded-lg text-xs text-white/60 flex items-center justify-center gap-2">
                                            <Eye size={14} />
                                            Bekijken
                                          </button>
                                          <button className="flex-1 px-3 py-2 bg-white/5 rounded-lg text-xs text-white/60 flex items-center justify-center gap-2">
                                            <Download size={14} />
                                            Download
                                          </button>
                                          {photo.status !== 'verified' && (
                                            <button className="px-3 py-2 bg-rose-500/10 rounded-lg text-xs text-rose-400 flex items-center justify-center">
                                              <Trash2 size={14} />
                                            </button>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>

                      {/* Task Actions */}
                      <div className="flex gap-2 pt-2">
                        <button className="flex-1 px-4 py-2.5 bg-blue-500 rounded-xl text-sm font-medium text-white flex items-center justify-center gap-2">
                          <Camera size={16} />
                          Foto toevoegen
                        </button>
                        <button className="px-4 py-2.5 bg-white/5 rounded-xl text-sm text-white/60 flex items-center justify-center gap-2">
                          <MessageSquare size={16} />
                        </button>
                        <button className="px-4 py-2.5 bg-white/5 rounded-xl text-sm text-white/60 flex items-center justify-center gap-2">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          </motion.div>
        );
      })}
    </div>
  );
};

export default TaskManager;

