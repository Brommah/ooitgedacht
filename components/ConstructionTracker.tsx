import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Lock, 
  ChevronDown, 
  ChevronUp,
  Clock,
  Shield,
  Camera,
  ExternalLink
} from 'lucide-react';
import { 
  CONSTRUCTION_PHASES, 
  MilestoneTask, 
  ConstructionPhase,
  getPhaseProgress,
  getOverallProgress
} from '../constants/milestones';

interface ConstructionTrackerProps {
  onTaskSelect?: (task: MilestoneTask, phase: ConstructionPhase) => void;
}

export const ConstructionTracker: React.FC<ConstructionTrackerProps> = ({ onTaskSelect }) => {
  const [expandedPhase, setExpandedPhase] = useState<string>('fundering');
  const [selectedTask, setSelectedTask] = useState<MilestoneTask | null>(
    CONSTRUCTION_PHASES[1].tasks[2] // Default to Wapeningsstaal
  );

  const handleTaskClick = (task: MilestoneTask, phase: ConstructionPhase) => {
    setSelectedTask(task);
    onTaskSelect?.(task, phase);
  };

  const togglePhase = (phaseId: string) => {
    setExpandedPhase(expandedPhase === phaseId ? '' : phaseId);
  };

  const getStatusColor = (status: MilestoneTask['status']) => {
    switch (status) {
      case 'completed': return 'bg-emerald-500';
      case 'active': return 'bg-amber-500';
      case 'pending': return 'bg-blue-500';
      case 'locked': return 'bg-slate-400';
    }
  };

  const getStatusIcon = (status: MilestoneTask['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle2 size={14} className="text-white" />;
      case 'active': return <div className="w-2 h-2 bg-white rounded-full animate-pulse" />;
      case 'pending': return <Clock size={14} className="text-white" />;
      case 'locked': return <Lock size={12} className="text-white" />;
    }
  };

  const overallProgress = getOverallProgress();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Sidebar - Phases & Tasks */}
      <div className="w-80 bg-white border-r border-slate-200 overflow-y-auto">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">Bouwfases</h2>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${overallProgress.percentage}%` }}
              />
            </div>
            <span className="text-sm font-medium text-slate-600">
              {overallProgress.percentage}%
            </span>
          </div>
        </div>

        <div className="p-4 space-y-2">
          {CONSTRUCTION_PHASES.map((phase) => {
            const progress = getPhaseProgress(phase);
            const isExpanded = expandedPhase === phase.id;
            const isComplete = progress.completed === progress.total;
            
            return (
              <div key={phase.id} className="rounded-xl overflow-hidden">
                {/* Phase Header */}
                <button
                  onClick={() => togglePhase(phase.id)}
                  className={`w-full flex items-center gap-3 p-4 transition-colors ${
                    isExpanded 
                      ? 'bg-slate-800 text-white' 
                      : isComplete 
                        ? 'bg-emerald-50 text-slate-800 hover:bg-emerald-100' 
                        : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                  }`}
                >
                  {/* Phase Icon/Number */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                    isComplete 
                      ? 'bg-emerald-500 text-white' 
                      : isExpanded 
                        ? 'bg-slate-700 text-white border-2 border-emerald-400'
                        : 'bg-white text-slate-700 border border-slate-300'
                  }`}>
                    {isComplete ? (
                      <CheckCircle2 size={20} />
                    ) : (
                      CONSTRUCTION_PHASES.indexOf(phase) + 1
                    )}
                  </div>
                  
                  <div className="flex-1 text-left">
                    <div className="font-semibold">{phase.name}</div>
                    <div className={`text-xs ${isExpanded ? 'text-slate-400' : 'text-slate-500'}`}>
                      {progress.completed}/{progress.total} taken
                    </div>
                  </div>
                  
                  {isExpanded ? (
                    <ChevronUp size={20} className="text-slate-400" />
                  ) : (
                    <ChevronDown size={20} className="text-slate-400" />
                  )}
                </button>

                {/* Phase Tasks */}
                {isExpanded && (
                  <div className="bg-white border-l-4 border-slate-800">
                    {phase.tasks.map((task) => (
                      <button
                        key={task.id}
                        onClick={() => handleTaskClick(task, phase)}
                        disabled={task.status === 'locked'}
                        className={`w-full flex items-center gap-3 px-4 py-3 transition-colors border-b border-slate-100 last:border-b-0 ${
                          selectedTask?.id === task.id
                            ? 'bg-emerald-50 border-l-4 border-l-emerald-500 -ml-1'
                            : task.status === 'locked'
                              ? 'opacity-50 cursor-not-allowed'
                              : 'hover:bg-slate-50'
                        }`}
                      >
                        {/* Status Dot */}
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${getStatusColor(task.status)}`}>
                          {getStatusIcon(task.status)}
                        </div>
                        
                        <span className={`text-sm ${
                          task.status === 'locked' ? 'text-slate-400' : 'text-slate-700'
                        }`}>
                          {task.name}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Panel - Task Detail */}
      <div className="flex-1 p-8 overflow-y-auto">
        {selectedTask && (
          <div className="max-w-3xl">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
              <span>{CONSTRUCTION_PHASES.find(p => p.tasks.some(t => t.id === selectedTask.id))?.name}</span>
              <span>›</span>
              <span className="text-slate-900 font-medium">{selectedTask.name}</span>
              
              {/* Status Badge */}
              <span className={`ml-auto px-3 py-1 rounded-full text-xs font-semibold ${
                selectedTask.status === 'completed' 
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                  : selectedTask.status === 'active'
                    ? 'bg-amber-100 text-amber-700 border border-amber-200'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}>
                {selectedTask.status === 'completed' ? 'Voltooid' : 
                 selectedTask.status === 'active' ? 'Actief' : 
                 selectedTask.status === 'pending' ? 'Wachten' : 'Vergrendeld'}
              </span>
            </div>

            {/* Task Title */}
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {selectedTask.name}
            </h1>
            <p className="text-slate-600 mb-6">{selectedTask.description}</p>

            {/* Verification Badge */}
            {selectedTask.status === 'completed' && selectedTask.verifiedBy && (
              <div className="flex items-center gap-3 mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                  <Shield size={20} className="text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-emerald-800">Geverifieerd</span>
                    <CheckCircle2 size={16} className="text-emerald-600" />
                  </div>
                  <div className="text-sm text-emerald-700">
                    Door {selectedTask.verifiedBy} • {selectedTask.verifiedAt}
                  </div>
                </div>
              </div>
            )}

            {/* Task Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-lg mb-6">
              <img 
                src={selectedTask.image} 
                alt={selectedTask.name}
                className="w-full h-80 object-cover"
              />
              
              {/* Image Overlay Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <div className="flex items-center justify-between">
                  <div className="text-white">
                    <div className="text-sm opacity-80">
                      {selectedTask.verifiedAt || 'In behandeling'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button for Active Tasks */}
            {selectedTask.status === 'active' && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Camera size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-amber-900 mb-1">Actie Vereist</h3>
                    <p className="text-amber-700 text-sm mb-4">
                      Upload een foto van de betonbon voor verificatie van de betonkwaliteit.
                    </p>
                    <button className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors flex items-center gap-2">
                      <Camera size={18} />
                      Foto Uploaden
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Documents Section for Completed Tasks */}
            {selectedTask.status === 'completed' && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                <h3 className="font-bold text-slate-900 mb-4">Documentatie</h3>
                <div className="space-y-2">
                  <button className="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                        <CheckCircle2 size={16} className="text-emerald-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">
                        Keuringsrapport_{selectedTask.id}.pdf
                      </span>
                    </div>
                    <ExternalLink size={16} className="text-slate-400 group-hover:text-emerald-600" />
                  </button>
                  <button className="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                        <Camera size={16} className="text-emerald-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">
                        Foto_verificatie_{selectedTask.id}.jpg
                      </span>
                    </div>
                    <ExternalLink size={16} className="text-slate-400 group-hover:text-emerald-600" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConstructionTracker;

