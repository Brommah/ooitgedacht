import React, { useState, useEffect } from 'react';
import { UserPreferences } from '../types';
import { MessageSquare, FileText, CheckCircle2, Clock, Bell, Leaf, Shield, ArrowRight, Home, Users, Zap, ChevronDown, ChevronUp, Lock, Camera } from 'lucide-react';
import { ENERGY_OPTIONS, CURRENCY_SYMBOL, calculateBuildCost } from '../constants';
import { CONSTRUCTION_PHASES, MilestoneTask, getPhaseProgress, getOverallProgress } from '../constants/milestones';

interface DashboardProps {
  preferences: UserPreferences;
  image: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ preferences, image }) => {
  const [activeTab, setActiveTab] = useState<'tijdlijn' | 'dossier'>('tijdlijn');
  const [expandedPhase, setExpandedPhase] = useState<string>('fundering');
  const [selectedTask, setSelectedTask] = useState<MilestoneTask | null>(
    CONSTRUCTION_PHASES[1].tasks[2] // Default to Wapeningsstaal
  );

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Get location name - use Veluwse Heide as project name
  const projectName = 'Veluwse Heide Residence';
  const locationName = preferences.location.searchQuery.split(',')[0] || 'Veluwe';
  const fullLocation = preferences.location.searchQuery || 'Gelderland, Nederland';

  const togglePhase = (phaseId: string) => {
    setExpandedPhase(expandedPhase === phaseId ? '' : phaseId);
  };

  const getStatusColor = (status: MilestoneTask['status']) => {
    switch (status) {
      case 'completed': return 'bg-emerald-500';
      case 'active': return 'bg-amber-500';
      case 'pending': return 'bg-blue-500';
      case 'locked': return 'bg-slate-500';
    }
  };

  const getStatusIcon = (status: MilestoneTask['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle2 size={12} className="text-white" />;
      case 'active': return <div className="w-2 h-2 bg-white rounded-full animate-pulse" />;
      case 'pending': return <Clock size={12} className="text-white" />;
      case 'locked': return <Lock size={10} className="text-white" />;
    }
  };

  const overallProgress = getOverallProgress();

  // Get energy info
  const energyOpt = ENERGY_OPTIONS.find(e => e.value === preferences.config.energyLevel);
  const energyLabel = preferences.config.energyLevel === 'positive' ? 'A+++' 
    : preferences.config.energyLevel === 'neutral' ? 'A++' 
    : preferences.config.energyLevel === 'aplus' ? 'A+' 
    : 'A';

  // Calculate cost
  const buildCost = calculateBuildCost(
    preferences.config.sqm,
    preferences.config.material,
    preferences.config.energyLevel,
    preferences.config.extras,
    preferences.config.vibe
  );

  // Get style name
  const styleName = preferences.style.moodBoardSelections[0] || 'Modern';

  return (
    <div className="min-h-screen bg-[#0a1628] text-white relative">
      {/* Blueprint Grid Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#0a1628]/90 border-b border-blue-500/10 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
            <div className="font-bold text-lg hidden md:block text-blue-50">{projectName}</div>
            <div className="font-bold text-lg md:hidden text-blue-50">Ooit Gedacht</div>
            <div className="flex items-center px-2 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest rounded-full border border-emerald-500/30">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-1.5 animate-pulse" />
                Constructie OK
            </div>
        </div>
        <div className="flex gap-4">
           <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center cursor-pointer hover:bg-blue-500/20 transition-colors border border-blue-500/20">
               <Bell size={16} className="text-blue-300" />
           </div>
           <div className="w-8 h-8 rounded-full bg-blue-400 text-[#0a1628] flex items-center justify-center text-xs font-bold">
               JD
           </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 md:mt-8">
        
        {/* Hero / Status Section */}
        <div className="md:col-span-3 rounded-2xl overflow-hidden border border-blue-500/20 relative">
          <div className="h-48 md:h-64 w-full relative">
            <img src={image} alt="Project Render" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/50 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6">
              <h1 className="text-3xl font-bold mb-1 text-blue-50">{projectName}</h1>
              <p className="text-blue-300/70 flex items-center gap-2 text-sm">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"/>
                {styleName} • {fullLocation}
              </p>
            </div>
            {/* Quick stats overlay */}
            <div className="absolute bottom-6 right-6 flex gap-3">
              <div className="bg-black/40 backdrop-blur-xl px-3 py-2 rounded-lg text-white text-sm border border-white/10">
                <span className="font-mono font-bold">{preferences.config.sqm}</span> m²
              </div>
              <div className="bg-black/40 backdrop-blur-xl px-3 py-2 rounded-lg text-white text-sm border border-white/10">
                <span className="font-mono font-bold">{preferences.household.bedrooms}</span> slaapkamers
              </div>
              <div className="bg-emerald-500/20 backdrop-blur-xl px-3 py-2 rounded-lg text-emerald-400 text-sm font-bold border border-emerald-500/30">
                {energyLabel}
              </div>
            </div>
          </div>
        </div>

        {/* Left Column: Timeline & Bouwbesturingssysteem */}
        <div className="md:col-span-2 space-y-6">
           
           {/* Construction Tracker - Two Column Layout */}
           <div className="bg-blue-500/5 backdrop-blur-sm border border-blue-500/20 rounded-2xl overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-blue-500/20">
                <div className="flex justify-between items-start">
                  <div>
                      <h2 className="text-2xl font-bold mb-1 text-blue-50">Bouwbesturingssysteem</h2>
                      <p className="text-sm text-blue-300/60">Project Status: Fase 2 - Fundering</p>
                  </div>
                  <div className="flex flex-col items-end">
                      <div className="text-4xl font-mono text-blue-400">{overallProgress.percentage}%</div>
                      <span className="text-[10px] uppercase tracking-widest text-blue-400/60">Voltooid</span>
                  </div>
              </div>
              
                {/* Progress bar */}
                <div className="mt-4 h-2 bg-blue-500/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${overallProgress.percentage}%` }}
                  />
                </div>
              </div>
              
              {/* Two Column Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Left: Phases & Tasks */}
                <div className="border-r border-blue-500/20 max-h-[500px] overflow-y-auto">
                  <div className="p-4 border-b border-blue-500/20 bg-blue-500/5">
                    <h3 className="text-sm font-bold text-blue-300 uppercase tracking-wider">Bouwfases</h3>
                  </div>
                  <div className="p-3 space-y-2">
                    {CONSTRUCTION_PHASES.map((phase, phaseIndex) => {
                      const progress = getPhaseProgress(phase);
                      const isExpanded = expandedPhase === phase.id;
                      const isComplete = progress.completed === progress.total;
                      
                      return (
                        <div key={phase.id} className="rounded-xl overflow-hidden">
                          {/* Phase Header */}
                          <button
                            onClick={() => togglePhase(phase.id)}
                            className={`w-full flex items-center gap-3 p-3 transition-colors rounded-xl ${
                              isExpanded 
                                ? 'bg-blue-500/20 text-white' 
                                : isComplete 
                                  ? 'bg-emerald-500/10 text-blue-50 hover:bg-emerald-500/20' 
                                  : 'bg-blue-500/5 text-blue-50 hover:bg-blue-500/10'
                            }`}
                          >
                            {/* Phase Icon */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                              isComplete 
                                ? 'bg-emerald-500 text-white' 
                                : isExpanded 
                                  ? 'bg-blue-500 text-white border-2 border-emerald-400'
                                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            }`}>
                              {isComplete ? (
                                <CheckCircle2 size={16} />
                              ) : (
                                phaseIndex + 1
                              )}
                            </div>
                            
                            <div className="flex-1 text-left">
                              <div className="font-semibold text-sm">{phase.name}</div>
                              <div className="text-xs text-blue-400/60">
                                {progress.completed}/{progress.total} taken
                              </div>
                            </div>
                            
                            {isExpanded ? (
                              <ChevronUp size={18} className="text-blue-400" />
                            ) : (
                              <ChevronDown size={18} className="text-blue-400/50" />
                            )}
                          </button>

                          {/* Phase Tasks */}
                          {isExpanded && (
                            <div className="mt-1 ml-4 border-l-2 border-blue-500/30 pl-3 space-y-1">
                              {phase.tasks.map((task) => (
                                <button
                                  key={task.id}
                                  onClick={() => setSelectedTask(task)}
                                  disabled={task.status === 'locked'}
                                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-left ${
                                    selectedTask?.id === task.id
                                      ? 'bg-emerald-500/20 border border-emerald-500/30'
                                      : task.status === 'locked'
                                        ? 'opacity-40 cursor-not-allowed'
                                        : 'hover:bg-blue-500/10'
                                  }`}
                                >
                                  <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${getStatusColor(task.status)}`}>
                                    {getStatusIcon(task.status)}
                                  </div>
                                  <span className={`text-xs ${
                                    selectedTask?.id === task.id ? 'text-emerald-300 font-medium' :
                                    task.status === 'locked' ? 'text-blue-400/40' : 'text-blue-200'
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

                {/* Right: Selected Task Detail */}
                <div className="p-4">
                  {selectedTask && (
                    <div>
                      {/* Breadcrumb */}
                      <div className="flex items-center gap-2 text-xs text-blue-400/60 mb-3">
                        <span>{CONSTRUCTION_PHASES.find(p => p.tasks.some(t => t.id === selectedTask.id))?.name}</span>
                        <span>›</span>
                        <span className="text-blue-200">{selectedTask.name}</span>
                      </div>

                      {/* Status Badge */}
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-bold text-blue-50">{selectedTask.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          selectedTask.status === 'completed' 
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                            : selectedTask.status === 'active'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}>
                          {selectedTask.status === 'completed' ? 'Voltooid' : 
                           selectedTask.status === 'active' ? 'Actief' : 
                           selectedTask.status === 'pending' ? 'Wachten' : 'Vergrendeld'}
                        </span>
                      </div>

                      {/* Verification Badge */}
                      {selectedTask.status === 'completed' && selectedTask.verifiedBy && (
                        <div className="flex items-center gap-2 mb-3 p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                          <Shield size={14} className="text-emerald-400" />
                          <span className="text-xs text-emerald-300">
                            Geverifieerd door {selectedTask.verifiedBy}
                          </span>
                          <CheckCircle2 size={12} className="text-emerald-400 ml-auto" />
                        </div>
                      )}

                      {/* Task Image */}
                      <div className="relative rounded-xl overflow-hidden mb-4">
                        <img 
                          src={selectedTask.image} 
                          alt={selectedTask.name}
                          className="w-full h-44 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        
                        {/* Image overlay info */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between">
                          <span className="text-xs text-white/80">
                            {selectedTask.verifiedAt || 'In behandeling'}
                          </span>
                        </div>
                      </div>

                      {/* Action for Active Tasks */}
                      {selectedTask.status === 'active' && (
                        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                          <div className="flex items-center gap-2 text-amber-400 mb-2">
                            <Camera size={14} />
                            <span className="text-xs font-bold uppercase tracking-wider">Actie Vereist</span>
                          </div>
                          <p className="text-xs text-amber-200/70 mb-3">
                            Upload foto voor verificatie
                          </p>
                          <button className="w-full bg-amber-500 hover:bg-amber-400 text-black py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2">
                            <Camera size={14} />
                            Foto Uploaden
                          </button>
                        </div>
                      )}

                      {/* Description */}
                      <p className="text-xs text-blue-300/60 mt-3">
                        {selectedTask.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
           </div>

           {/* Sustainability Scorecard */}
           <div className="bg-blue-500/5 backdrop-blur-sm p-6 md:p-8 border border-blue-500/20 rounded-2xl">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-blue-50">
                   <Leaf size={20} className="text-emerald-400"/> Duurzaamheidspaspoort
                </h3>
                <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-center transition-all hover:border-emerald-500/30">
                        <div className="text-2xl font-mono font-bold text-emerald-400">{energyLabel}</div>
                        <div className="text-[10px] uppercase tracking-widest text-blue-300/50 mt-1">Energielabel</div>
                    </div>
                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-center transition-all hover:border-emerald-500/30">
                        <div className="text-2xl font-mono font-bold text-blue-100">0.48</div>
                        <div className="text-[10px] uppercase tracking-widest text-blue-300/50 mt-1">MPG Score</div>
                    </div>
                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-center transition-all hover:border-emerald-500/30">
                        <div className="text-2xl font-mono font-bold text-blue-100">
                          {preferences.config.energyLevel === 'neutral' || preferences.config.energyLevel === 'positive' ? '€0' : '~€50'}
                        </div>
                        <div className="text-[10px] uppercase tracking-widest text-blue-300/50 mt-1">
                          {preferences.config.energyLevel === 'neutral' || preferences.config.energyLevel === 'positive' ? 'Op de meter' : '/maand'}
                        </div>
                    </div>
                </div>
                
                {/* Energy features */}
                {energyOpt && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {energyOpt.features.map((feature, i) => (
                      <span key={i} className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded-full border border-emerald-500/20">
                        {feature}
                      </span>
                    ))}
                  </div>
                )}
           </div>

           {/* Chat / Feed */}
           <div className="bg-blue-500/5 backdrop-blur-sm p-6 md:p-8 border border-blue-500/20 rounded-2xl">
               <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-blue-50">
                   <MessageSquare size={20} className="text-blue-400" /> Projectberichten
               </h3>
               
               <div className="space-y-6">
                   <div className="flex gap-4">
                       <div className="w-10 h-10 bg-blue-400 text-[#0a1628] flex-shrink-0 flex items-center justify-center text-xs font-bold rounded-lg">BB</div>
                       <div className="flex-1">
                           <div className="text-sm font-bold mb-1 flex items-center gap-2 text-blue-100">
                               Bureau Broersma <span className="px-2 py-0.5 bg-blue-500/10 text-blue-300 text-[10px] uppercase tracking-widest rounded-full font-normal border border-blue-500/20">Keurmeester</span>
                           </div>
                           <div className="bg-blue-500/10 p-4 text-sm text-blue-200 leading-relaxed border-l-2 border-blue-400 rounded-r-lg">
                               De wapeningsfoto's voldoen aan de specificaties. We hebben de betaling aan de aannemer (Tranche 2) vrijgegeven. Jullie kunnen morgen storten.
                           </div>
                           <div className="text-xs text-blue-400/50 mt-2 font-mono">Vandaag, 09:41</div>
                       </div>
                   </div>
               </div>
               
               <div className="mt-6 pt-6 border-t border-blue-500/20">
                   <input 
                    type="text" 
                    placeholder="Stuur een bericht..." 
                    className="w-full bg-blue-500/10 p-4 rounded-xl outline-none focus:ring-1 focus:ring-blue-400 transition-all placeholder:text-blue-400/30 text-sm border border-blue-500/20"
                   />
               </div>
           </div>
        </div>

        {/* Right Column: Docs & Team */}
        <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 backdrop-blur-sm text-white p-8 rounded-2xl border border-blue-500/30">
                <div className="flex items-center gap-2 mb-4 text-emerald-400">
                    <Shield size={16} />
                    <span className="text-xs uppercase tracking-widest font-bold">Actie Vereist</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-blue-50">Upload Betonbonnen</h3>
                <p className="text-sm text-blue-300/70 mb-6">Voor validatie van de betonkwaliteit (C30/37) is een foto van de leveranciersbon nodig.</p>
                <button className="w-full bg-blue-400 text-[#0a1628] py-3 font-semibold text-sm hover:bg-blue-300 transition-colors flex items-center justify-center gap-2 rounded-xl">
                    <FileText size={16}/> Camera Openen
                </button>
            </div>

            {/* Project Summary */}
            <div className="bg-blue-500/5 backdrop-blur-sm p-6 border border-blue-500/20 rounded-2xl">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-blue-50">
                    <Home size={18} className="text-blue-400" /> Project Specificaties
                </h3>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-300/70">Oppervlakte</span>
                      <span className="font-mono text-blue-100">{preferences.config.sqm} m²</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-300/70">Slaapkamers</span>
                      <span className="font-mono text-blue-100">{preferences.household.bedrooms}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-300/70">Materiaal</span>
                      <span className="text-blue-100">{preferences.config.material === 'wood' ? 'Hout' : preferences.config.material === 'brick' ? 'Baksteen' : preferences.config.material === 'concrete' ? 'Beton' : 'Mix'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-300/70">Energie</span>
                      <span className="text-emerald-400 font-medium">{energyOpt?.label}</span>
                    </div>
                    {preferences.config.extras.length > 0 && (
                      <div className="pt-3 border-t border-blue-500/20">
                        <span className="text-blue-400/60 text-xs uppercase tracking-wider">Extra's</span>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {preferences.config.extras.map((extra, i) => (
                            <span key={i} className="px-2 py-1 bg-blue-500/10 text-blue-300 text-xs rounded border border-blue-500/20">
                              {extra}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
            </div>

            {/* Dossier Mini */}
            <div className="bg-blue-500/5 backdrop-blur-sm p-6 border border-blue-500/20 rounded-2xl">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-blue-50">
                    <FileText size={18} className="text-blue-400" /> Documentenkluis
                </h3>
                <div className="space-y-3">
                    <DocItem name="Woningpaspoort_Ondertekend.pdf" verified />
                    <DocItem name="Vergunning_Onherroepelijk.pdf" verified />
                    <DocItem name="Constructieberekening_BB_v4.pdf" verified />
                    <DocItem name="Sonderingsrapport_Gecontroleerd.pdf" verified />
                </div>
                <button className="text-xs font-bold uppercase tracking-widest mt-6 text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
                    Open Kluis <ArrowRight size={10} />
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

const DocItem = ({ name, verified }: { name: string, verified?: boolean }) => (
    <div className="flex items-center gap-3 text-sm text-blue-300/70 hover:text-blue-100 cursor-pointer group justify-between p-2 hover:bg-blue-500/10 rounded-lg transition-all">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-400 group-hover:text-[#0a1628] transition-colors rounded-lg border border-blue-500/20">
                <FileText size={14} />
            </div>
            <span className="truncate max-w-[140px] text-xs font-medium">{name}</span>
        </div>
        {verified && <CheckCircle2 size={14} className="text-emerald-400" />}
    </div>
)
