import React, { useState } from 'react';
import { CheckCircle2, ChevronDown, ChevronUp, Clock, Lock, Camera, Shield, X, Zap, List, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CONSTRUCTION_PHASES, MilestoneTask, getPhaseProgress } from '../../../constants/milestones';
import { PhasesTabProps } from '../types';
import { GlassCard } from '../GlassCard';
import { AnimatedPercentage } from '../AnimatedCounter';
import { containerVariants, itemVariants } from '../BentoGrid';
import { TaskManager } from '../TaskManager';
import { FinancialPanel } from '../FinancialPanel';

export const PhasesTab: React.FC<PhasesTabProps> = ({ 
  expandedPhase, 
  setExpandedPhase, 
  selectedTask, 
  setSelectedTask, 
  overallProgress 
}) => {
  const [viewMode, setViewMode] = useState<'phases' | 'tasks' | 'financial'>('phases');

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
    <div className="px-4 py-4 lg:px-8 lg:py-6">
      {/* Desktop Header with View Switcher */}
      <motion.div 
        className="hidden lg:flex items-center justify-between mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-2xl font-bold text-white">
            {viewMode === 'phases' ? 'Bouwfases' : viewMode === 'tasks' ? 'Taken & Foto\'s' : 'Financieel Overzicht'}
          </h1>
          <p className="text-sm text-white/50 mt-1">
            {viewMode === 'phases' ? 'Volg de voortgang van je project' : 
             viewMode === 'tasks' ? 'Beheer taken en upload verificatiefoto\'s' :
             'Betalingsschema en budget tracking'}
          </p>
        </div>
        
        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 p-1 bg-white/5 rounded-xl border border-white/10">
          {[
            { id: 'phases', label: 'Fases', icon: <LayoutGrid size={16} /> },
            { id: 'tasks', label: 'Taken', icon: <Camera size={16} /> },
            { id: 'financial', label: 'Budget', icon: <List size={16} /> },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setViewMode(mode.id as typeof viewMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                viewMode === mode.id
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                  : 'text-white/50'
              }`}
            >
              {mode.icon}
              {mode.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Mobile Header */}
      <motion.div 
        className="lg:hidden mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-xl font-bold text-white">Bouwfases</h1>
      </motion.div>

      {/* View: Tasks with Photo Requirements (P1.2) */}
      <AnimatePresence mode="wait">
        {viewMode === 'tasks' && (
          <motion.div
            key="tasks"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <TaskManager />
          </motion.div>
        )}
      </AnimatePresence>

      {/* View: Financial Panel (P0.1) */}
      <AnimatePresence mode="wait">
        {viewMode === 'financial' && (
          <motion.div
            key="financial"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <FinancialPanel
              totalBudget={298500}
              spent={76500}
              released={49500}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* View: Phases (default) */}
      {viewMode === 'phases' && (
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Progress Overview - Desktop Sidebar */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <GlassCard className="p-5 lg:sticky lg:top-6" variant="highlight">
            <div className="flex flex-col items-center text-center">
              <AnimatedPercentage value={overallProgress.percentage} size="lg" color="#3b82f6" />
              <div className="mt-4">
                <h3 className="font-semibold text-white">Totale voortgang</h3>
                <p className="text-xs text-white/50 mt-1">
                  {overallProgress.completed} van {overallProgress.total} taken
                </p>
              </div>
              
              {/* Phase Legend */}
              <div className="w-full mt-6 pt-4 border-t border-white/10 space-y-2">
                {[
                  { color: 'bg-emerald-500', label: 'Voltooid' },
                  { color: 'bg-blue-500', label: 'Actief' },
                  { color: 'bg-white/20', label: 'Gepland' },
                  { color: 'bg-white/10', label: 'Vergrendeld' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-xs text-white/60">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Phases List */}
        <motion.div variants={itemVariants} className="lg:col-span-3 space-y-3">
          {CONSTRUCTION_PHASES.map((phase, phaseIndex) => {
            const progress = getPhaseProgress(phase);
            const isExpanded = expandedPhase === phase.id;
            const isComplete = progress.completed === progress.total;
            const progressPercent = Math.round((progress.completed / progress.total) * 100);
            
            return (
              <GlassCard 
                key={phase.id} 
                className="overflow-hidden"
                variant={isComplete ? 'success' : isExpanded ? 'highlight' : 'default'}
                tilt={false}
              >
                {/* Phase Header */}
                <button
                  onClick={() => setExpandedPhase(isExpanded ? '' : phase.id)}
                  className="w-full flex items-center gap-4 p-4 lg:p-5"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                    isComplete 
                      ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30' 
                      : isExpanded 
                        ? 'bg-blue-500 shadow-lg shadow-blue-500/30' 
                        : 'bg-white/10'
                  }`}>
                    {isComplete ? (
                      <CheckCircle2 size={24} className="text-white" />
                    ) : (
                      <span className="text-lg font-bold text-white">{phaseIndex + 1}</span>
                    )}
                  </div>
                  
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-white">{phase.name}</div>
                    <div className="text-xs text-white/40 mt-0.5 flex items-center gap-2">
                      <span>{progress.completed}/{progress.total} taken</span>
                      <span className="w-1 h-1 bg-white/20 rounded-full" />
                      <span className={isComplete ? 'text-emerald-400' : 'text-white/40'}>
                        {progressPercent}%
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div className="h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
                      <motion.div 
                        className={`h-full rounded-full ${isComplete ? 'bg-emerald-400' : 'bg-blue-400'}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                      />
                    </div>
                  </div>

                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={20} className="text-white/40" />
                  </motion.div>
                </button>

                {/* Expanded Tasks */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 lg:px-5 lg:pb-5 space-y-2">
                        {phase.tasks.map((task, taskIndex) => (
                          <motion.button
                            key={task.id}
                            onClick={() => task.status !== 'locked' && setSelectedTask(task)}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: taskIndex * 0.05 }}
                            disabled={task.status === 'locked'}
                            className={`
                              w-full flex items-center gap-3 p-3 rounded-xl
                              ${task.status === 'locked' 
                                ? 'bg-white/[0.02] cursor-not-allowed opacity-50' 
                                : 'bg-white/[0.03] cursor-pointer'
                              }
                            `}
                          >
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${getStatusColor(task.status)}`}>
                              {getStatusIcon(task.status)}
                            </div>
                            <div className="flex-1 text-left">
                              <div className="text-sm text-white/90">{task.name}</div>
                              {task.status === 'active' && task.requiresPhoto && (
                                <div className="flex items-center gap-1 text-xs text-amber-400 mt-0.5">
                                  <Camera size={10} />
                                  <span>Foto vereist</span>
                                </div>
                              )}
                            </div>
                            {task.fundsReleased && (
                              <span className="text-xs font-mono text-emerald-400">
                                €{(task.fundsReleased / 1000).toFixed(1)}k
                              </span>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            );
          })}
        </motion.div>
      </motion.div>
      )}

      {/* Task Detail Modal */}
      <AnimatePresence>
        {selectedTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedTask(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-[#0a1628] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getStatusColor(selectedTask.status)}`}>
                  {getStatusIcon(selectedTask.status)}
                </div>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
                >
                  <X size={16} className="text-white/60" />
                </button>
              </div>
              
              <h3 className="text-lg font-semibold text-white mb-2">{selectedTask.name}</h3>
              <p className="text-sm text-white/60 mb-4">{selectedTask.description}</p>

              {selectedTask.requiresPhoto && (
                <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl mb-4">
                  <Camera size={16} className="text-amber-400" />
                  <span className="text-sm text-amber-300">Fotoverificatie vereist</span>
                </div>
              )}

              {selectedTask.fundsReleased && (
                <div className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Zap size={16} className="text-emerald-400" />
                    <span className="text-sm text-emerald-300">Vrijgave bij voltooiing</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-400">
                    €{selectedTask.fundsReleased.toLocaleString()}
                  </span>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PhasesTab;
