import React, { useState, useEffect, useRef } from 'react';
import { UserPreferences } from '../types';
import { MessageSquare, FileText, CheckCircle2, Clock, Bell, Leaf, Shield, ArrowRight, Home, Users, Zap, ChevronDown, ChevronUp, Lock, Camera, Send, X, AlertTriangle, HardHat, FileCheck, Sparkles, Award, QrCode, Building2, ThermometerSun, Droplets, Sun, Plug } from 'lucide-react';
import { ENERGY_OPTIONS, CURRENCY_SYMBOL, calculateBuildCost } from '../constants';
import { CONSTRUCTION_PHASES, MilestoneTask, getPhaseProgress, getOverallProgress } from '../constants/milestones';

// Chat message types
interface ChatMessage {
  id: string;
  sender: {
    name: string;
    initials: string;
    role: 'keurmeester' | 'aannemer' | 'klant' | 'systeem';
  };
  content: string;
  timestamp: string;
  type: 'text' | 'verification' | 'payment' | 'milestone';
  attachments?: { name: string; type: string }[];
}

// Notification types
interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'milestone' | 'document' | 'payment' | 'message' | 'alert';
  read: boolean;
  action?: string;
}

// Sample chat messages
const SAMPLE_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    sender: { name: 'Systeem', initials: 'SY', role: 'systeem' },
    content: '🎉 Fase 1 (Voorbereiding) is succesvol afgerond! Alle documenten zijn geverifieerd.',
    timestamp: 'Gisteren, 16:30',
    type: 'milestone',
  },
  {
    id: '2',
    sender: { name: 'Van der Berg Bouw', initials: 'VB', role: 'aannemer' },
    content: 'De heipalen zijn aangekomen op de bouwplaats. We beginnen morgen met het heiwerk. Geschatte duur: 3 werkdagen.',
    timestamp: 'Gisteren, 18:22',
    type: 'text',
  },
  {
    id: '3',
    sender: { name: 'Bureau Broersma', initials: 'BB', role: 'keurmeester' },
    content: 'De wapeningsfoto\'s voldoen aan de specificaties. We hebben de betaling aan de aannemer (Tranche 2) vrijgegeven. Jullie kunnen morgen storten.',
    timestamp: 'Vandaag, 09:41',
    type: 'verification',
    attachments: [{ name: 'Wapening_Goedkeuring.pdf', type: 'document' }],
  },
  {
    id: '4',
    sender: { name: 'Systeem', initials: 'SY', role: 'systeem' },
    content: '💰 Tranche 2 betaling (€34.500) is vrijgegeven naar Van der Berg Bouw.',
    timestamp: 'Vandaag, 09:45',
    type: 'payment',
  },
];

// Sample notifications
const SAMPLE_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Betaling Vrijgegeven',
    description: 'Tranche 2 (€34.500) is overgemaakt',
    timestamp: '2 uur geleden',
    type: 'payment',
    read: false,
  },
  {
    id: '2',
    title: 'Verificatie Voltooid',
    description: 'Wapeningsstaal goedgekeurd door Bureau Broersma',
    timestamp: '3 uur geleden',
    type: 'milestone',
    read: false,
  },
  {
    id: '3',
    title: 'Nieuw Document',
    description: 'Wapening_Goedkeuring.pdf toegevoegd',
    timestamp: '3 uur geleden',
    type: 'document',
    read: true,
  },
  {
    id: '4',
    title: 'Actie Vereist',
    description: 'Upload betonbonnen voor verificatie',
    timestamp: '5 uur geleden',
    type: 'alert',
    read: true,
    action: 'upload',
  },
  {
    id: '5',
    title: 'Fase Update',
    description: 'Voorbereiding 100% voltooid',
    timestamp: 'Gisteren',
    type: 'milestone',
    read: true,
  },
];

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
  
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>(SAMPLE_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Notifications state
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(SAMPLE_NOTIFICATIONS);
  const notificationRef = useRef<HTMLDivElement>(null);
  
  // Passport animation state
  const [passportHovered, setPassportHovered] = useState(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Scroll chat to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  
  // Send message handler
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: { name: 'Jij', initials: 'JD', role: 'klant' },
      content: newMessage,
      timestamp: 'Nu',
      type: 'text',
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    
    // Simulate typing response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const response: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: { name: 'Bureau Broersma', initials: 'BB', role: 'keurmeester' },
        content: 'Bedankt voor uw bericht. We kijken ernaar en komen zo spoedig mogelijk bij u terug.',
        timestamp: 'Nu',
        type: 'text',
      };
      setMessages(prev => [...prev, response]);
    }, 2000);
  };
  
  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };
  
  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;

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
        <div className="flex gap-4 items-center">
           {/* Notifications Bell */}
           <div className="relative" ref={notificationRef}>
             <button 
               onClick={() => setShowNotifications(!showNotifications)}
               className={`w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-all border ${
                 showNotifications 
                   ? 'bg-blue-500/30 border-blue-400/50 ring-2 ring-blue-400/30' 
                   : 'bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20'
               }`}
             >
               <Bell size={18} className="text-blue-300" />
               {unreadCount > 0 && (
                 <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                   {unreadCount}
                 </span>
               )}
             </button>
             
             {/* Notifications Dropdown */}
             {showNotifications && (
               <div className="absolute right-0 top-full mt-2 w-80 bg-[#0d1f35] border border-blue-500/30 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50">
                 <div className="p-4 border-b border-blue-500/20 flex justify-between items-center">
                   <h3 className="font-bold text-blue-50">Meldingen</h3>
                   <button 
                     onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                     className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                   >
                     Alles gelezen
                   </button>
                 </div>
                 <div className="max-h-96 overflow-y-auto">
                   {notifications.map((notification) => (
                     <button
                       key={notification.id}
                       onClick={() => markAsRead(notification.id)}
                       className={`w-full p-4 border-b border-blue-500/10 hover:bg-blue-500/10 transition-colors text-left ${
                         !notification.read ? 'bg-blue-500/5' : ''
                       }`}
                     >
                       <div className="flex gap-3">
                         <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                           notification.type === 'payment' ? 'bg-emerald-500/20 text-emerald-400' :
                           notification.type === 'milestone' ? 'bg-blue-500/20 text-blue-400' :
                           notification.type === 'document' ? 'bg-amber-500/20 text-amber-400' :
                           notification.type === 'alert' ? 'bg-rose-500/20 text-rose-400' :
                           'bg-blue-500/20 text-blue-400'
                         }`}>
                           {notification.type === 'payment' && <Plug size={14} />}
                           {notification.type === 'milestone' && <CheckCircle2 size={14} />}
                           {notification.type === 'document' && <FileText size={14} />}
                           {notification.type === 'alert' && <AlertTriangle size={14} />}
                           {notification.type === 'message' && <MessageSquare size={14} />}
                         </div>
                         <div className="flex-1 min-w-0">
                           <div className="flex items-center gap-2">
                             <span className={`text-sm font-medium ${!notification.read ? 'text-blue-50' : 'text-blue-200'}`}>
                               {notification.title}
                             </span>
                             {!notification.read && (
                               <span className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0" />
                             )}
                           </div>
                           <p className="text-xs text-blue-400/60 mt-0.5 truncate">{notification.description}</p>
                           <span className="text-[10px] text-blue-500/50 mt-1 block">{notification.timestamp}</span>
                         </div>
                       </div>
                     </button>
                   ))}
                 </div>
                 <div className="p-3 border-t border-blue-500/20">
                   <button className="w-full py-2 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-wider">
                     Alle meldingen bekijken
                   </button>
                 </div>
               </div>
             )}
           </div>
           
           <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-500 text-[#0a1628] flex items-center justify-center text-sm font-bold shadow-lg shadow-blue-500/20">
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

           {/* WONING PASSPORT - HIGHLIGHTED */}
           <div 
             className="relative overflow-hidden rounded-2xl"
             onMouseEnter={() => setPassportHovered(true)}
             onMouseLeave={() => setPassportHovered(false)}
           >
             {/* Animated gradient border */}
             <div className={`absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 rounded-2xl transition-opacity duration-500 ${passportHovered ? 'opacity-100' : 'opacity-70'}`} 
               style={{ 
                 backgroundSize: '200% 100%',
                 animation: 'gradient-x 3s ease infinite',
               }} 
             />
             
             <div className="relative m-[2px] bg-gradient-to-br from-[#0a1628] via-[#0d1f35] to-[#0a1628] rounded-2xl overflow-hidden">
               {/* Header with official badge */}
               <div className="bg-gradient-to-r from-emerald-600/30 via-teal-500/20 to-emerald-600/30 p-6 border-b border-emerald-500/30">
                 <div className="flex items-start justify-between">
                   <div className="flex items-center gap-4">
                     <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-400 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 relative">
                       <Home size={28} className="text-white" />
                       <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                         <CheckCircle2 size={14} className="text-emerald-500" />
                       </div>
                     </div>
                     <div>
                       <div className="flex items-center gap-2">
                         <h3 className="text-2xl font-bold text-white">Woning Paspoort</h3>
                         <span className="px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-1">
                           <Sparkles size={10} />
                           Gecertificeerd
                         </span>
                       </div>
                       <p className="text-emerald-300/70 text-sm mt-1">Officieel geverifieerd door Bureau Broersma</p>
                     </div>
                   </div>
                   <div className="text-right hidden md:block">
                     <div className="w-16 h-16 bg-white/10 rounded-lg p-2 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                       <QrCode size={40} className="text-emerald-400" />
                     </div>
                     <span className="text-[10px] text-emerald-400/60 mt-1 block">WP-2024-8847</span>
                   </div>
                 </div>
               </div>
               
               <div className="p-6">
                 {/* Energy Classification - HERO */}
                 <div className="flex items-center gap-6 mb-6">
                   <div className="relative">
                     <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-2xl shadow-emerald-500/40 transition-transform duration-300 ${passportHovered ? 'scale-110' : ''}`}>
                       <span className="text-4xl font-black text-white">{energyLabel}</span>
                     </div>
                     <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                       <Award size={20} className="text-yellow-900" />
                     </div>
                   </div>
                   <div className="flex-1">
                     <div className="text-lg font-bold text-white mb-1">
                       {preferences.config.energyLevel === 'positive' ? 'Energieleverend' :
                        preferences.config.energyLevel === 'neutral' ? 'Energieneutraal' :
                        preferences.config.energyLevel === 'aplus' ? 'Bijna Energieneutraal' : 'Energiezuinig'}
                     </div>
                     <p className="text-sm text-blue-300/60">
                       {preferences.config.energyLevel === 'neutral' || preferences.config.energyLevel === 'positive' 
                         ? 'Deze woning produceert evenveel of meer energie dan het verbruikt'
                         : 'Deze woning voldoet aan de hoogste energie-eisen'
                       }
                     </p>
                     <div className="flex items-center gap-4 mt-3">
                       <div className="flex items-center gap-1.5 text-emerald-400 text-sm">
                         <ThermometerSun size={14} />
                         <span className="font-mono">Rc 8.0</span>
                       </div>
                       <div className="flex items-center gap-1.5 text-blue-400 text-sm">
                         <Droplets size={14} />
                         <span className="font-mono">Qv10 0.4</span>
                       </div>
                       <div className="flex items-center gap-1.5 text-amber-400 text-sm">
                         <Sun size={14} />
                         <span className="font-mono">TO ≤ 0.45</span>
                       </div>
                     </div>
                   </div>
                 </div>
                 
                 {/* Stats Grid */}
                 <div className="grid grid-cols-3 gap-4 mb-6">
                   <div className="p-4 bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/30 rounded-xl text-center group hover:border-emerald-400/50 transition-all hover:scale-[1.02]">
                     <div className="text-3xl font-mono font-bold text-emerald-400">{energyLabel}</div>
                     <div className="text-[10px] uppercase tracking-widest text-emerald-300/60 mt-1">Energielabel</div>
                     <div className="w-full h-1 bg-emerald-500/20 rounded-full mt-2 overflow-hidden">
                       <div className="h-full bg-emerald-400 rounded-full" style={{ width: '95%' }} />
                     </div>
                   </div>
                   <div className="p-4 bg-gradient-to-br from-teal-500/20 to-teal-500/5 border border-teal-500/30 rounded-xl text-center group hover:border-teal-400/50 transition-all hover:scale-[1.02]">
                     <div className="text-3xl font-mono font-bold text-teal-400">0.48</div>
                     <div className="text-[10px] uppercase tracking-widest text-teal-300/60 mt-1">MPG Score</div>
                     <div className="w-full h-1 bg-teal-500/20 rounded-full mt-2 overflow-hidden">
                       <div className="h-full bg-teal-400 rounded-full" style={{ width: '85%' }} />
                     </div>
                   </div>
                   <div className="p-4 bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/30 rounded-xl text-center group hover:border-blue-400/50 transition-all hover:scale-[1.02]">
                     <div className="text-3xl font-mono font-bold text-blue-400">
                       {preferences.config.energyLevel === 'neutral' || preferences.config.energyLevel === 'positive' ? '€0' : '~€50'}
                     </div>
                     <div className="text-[10px] uppercase tracking-widest text-blue-300/60 mt-1">
                       {preferences.config.energyLevel === 'neutral' || preferences.config.energyLevel === 'positive' ? 'Per maand' : '/maand'}
                     </div>
                     <div className="w-full h-1 bg-blue-500/20 rounded-full mt-2 overflow-hidden">
                       <div className="h-full bg-blue-400 rounded-full" style={{ width: preferences.config.energyLevel === 'neutral' || preferences.config.energyLevel === 'positive' ? '100%' : '60%' }} />
                     </div>
                   </div>
                 </div>
                 
                 {/* Energy features */}
                 {energyOpt && (
                   <div className="p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/20">
                     <div className="text-xs uppercase tracking-widest text-emerald-400/70 mb-3 font-bold flex items-center gap-2">
                       <Leaf size={12} />
                       Duurzame Kenmerken
                     </div>
                     <div className="flex flex-wrap gap-2">
                       {energyOpt.features.map((feature, i) => (
                         <span key={i} className="px-3 py-1.5 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 text-xs rounded-lg border border-emerald-500/30 flex items-center gap-1.5 hover:bg-emerald-500/30 transition-colors cursor-default">
                           <CheckCircle2 size={12} className="text-emerald-400" />
                           {feature}
                         </span>
                       ))}
                     </div>
                   </div>
                 )}
                 
                 {/* Certification Footer */}
                 <div className="mt-4 pt-4 border-t border-emerald-500/20 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <Shield size={18} className="text-emerald-400" />
                     <div>
                       <span className="text-xs text-emerald-300/70">Geverifieerd op</span>
                       <span className="text-sm text-white ml-2 font-mono">28 Nov 2024</span>
                     </div>
                   </div>
                   <button className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider rounded-lg border border-emerald-500/30 transition-colors flex items-center gap-2">
                     <FileText size={12} />
                     Download PDF
                   </button>
                 </div>
               </div>
             </div>
           </div>
           
           {/* Add CSS animation */}
           <style>{`
             @keyframes gradient-x {
               0%, 100% { background-position: 0% 50%; }
               50% { background-position: 100% 50%; }
             }
           `}</style>

           {/* Chat / Feed - Enhanced */}
           <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-sm border border-blue-500/20 rounded-2xl overflow-hidden">
               {/* Chat Header */}
               <div className="p-4 md:p-6 border-b border-blue-500/20 bg-blue-500/5">
                 <div className="flex items-center justify-between">
                   <h3 className="text-xl font-bold flex items-center gap-3 text-blue-50">
                     <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                       <MessageSquare size={20} className="text-blue-400" />
                     </div>
                     <div>
                       <span>Project Chat</span>
                       <p className="text-xs text-blue-400/60 font-normal mt-0.5">4 deelnemers online</p>
                     </div>
                   </h3>
                   <div className="flex -space-x-2">
                     <div className="w-8 h-8 rounded-full bg-blue-400 text-[#0a1628] flex items-center justify-center text-xs font-bold border-2 border-[#0d1f35]">JD</div>
                     <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold border-2 border-[#0d1f35]">BB</div>
                     <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold border-2 border-[#0d1f35]">VB</div>
                     <div className="w-8 h-8 rounded-full bg-blue-500/30 text-blue-300 flex items-center justify-center text-xs font-bold border-2 border-[#0d1f35]">+1</div>
                   </div>
                 </div>
               </div>
               
               {/* Messages Container */}
               <div 
                 ref={chatContainerRef}
                 className="p-4 md:p-6 space-y-4 max-h-[400px] overflow-y-auto"
                 style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(59, 130, 246, 0.3) transparent' }}
               >
                 {messages.map((msg) => (
                   <div key={msg.id} className={`flex gap-3 ${msg.sender.role === 'klant' ? 'flex-row-reverse' : ''}`}>
                     {/* Avatar */}
                     <div className={`w-10 h-10 flex-shrink-0 flex items-center justify-center text-xs font-bold rounded-xl ${
                       msg.sender.role === 'keurmeester' ? 'bg-emerald-500 text-white' :
                       msg.sender.role === 'aannemer' ? 'bg-amber-500 text-white' :
                       msg.sender.role === 'klant' ? 'bg-blue-400 text-[#0a1628]' :
                       'bg-gradient-to-br from-violet-500 to-purple-500 text-white'
                     }`}>
                       {msg.sender.role === 'systeem' ? <Zap size={16} /> : msg.sender.initials}
                     </div>
                     
                     {/* Message Content */}
                     <div className={`flex-1 max-w-[80%] ${msg.sender.role === 'klant' ? 'text-right' : ''}`}>
                       {/* Sender info - hide for klant messages */}
                       {msg.sender.role !== 'klant' && (
                         <div className="text-sm font-bold mb-1 flex items-center gap-2 text-blue-100">
                           {msg.sender.name}
                           <span className={`px-2 py-0.5 text-[10px] uppercase tracking-widest rounded-full font-medium border ${
                             msg.sender.role === 'keurmeester' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                             msg.sender.role === 'aannemer' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                             'bg-violet-500/10 text-violet-400 border-violet-500/30'
                           }`}>
                             {msg.sender.role === 'keurmeester' ? 'Keurmeester' :
                              msg.sender.role === 'aannemer' ? 'Aannemer' : 'Systeem'}
                           </span>
                         </div>
                       )}
                       
                       {/* Message Bubble */}
                       <div className={`p-4 text-sm leading-relaxed rounded-2xl ${
                         msg.sender.role === 'klant' 
                           ? 'bg-blue-500 text-white rounded-tr-none' 
                           : msg.type === 'milestone' || msg.type === 'payment'
                             ? 'bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-violet-200 border border-violet-500/30'
                             : msg.type === 'verification'
                               ? 'bg-emerald-500/10 text-emerald-200 border-l-2 border-emerald-400'
                               : 'bg-blue-500/10 text-blue-200 border-l-2 border-blue-400/50 rounded-tl-none'
                       }`}>
                         {msg.content}
                         
                         {/* Attachments */}
                         {msg.attachments && msg.attachments.length > 0 && (
                           <div className="mt-3 pt-3 border-t border-white/10">
                             {msg.attachments.map((att, i) => (
                               <div key={i} className="flex items-center gap-2 p-2 bg-black/20 rounded-lg cursor-pointer hover:bg-black/30 transition-colors">
                                 <FileText size={14} className="text-emerald-400" />
                                 <span className="text-xs truncate">{att.name}</span>
                               </div>
                             ))}
                           </div>
                         )}
                       </div>
                       
                       <div className={`text-xs text-blue-400/50 mt-2 font-mono ${msg.sender.role === 'klant' ? 'text-right' : ''}`}>
                         {msg.timestamp}
                       </div>
                     </div>
                   </div>
                 ))}
                 
                 {/* Typing Indicator */}
                 {isTyping && (
                   <div className="flex gap-3">
                     <div className="w-10 h-10 bg-emerald-500 flex-shrink-0 flex items-center justify-center text-xs font-bold rounded-xl text-white">
                       BB
                     </div>
                     <div className="bg-blue-500/10 px-4 py-3 rounded-2xl rounded-tl-none">
                       <div className="flex gap-1">
                         <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                         <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                         <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                       </div>
                     </div>
                   </div>
                 )}
               </div>
               
               {/* Message Input */}
               <div className="p-4 md:p-6 pt-0">
                 <div className="flex gap-3 items-end">
                   <div className="flex-1 relative">
                     <textarea 
                       value={newMessage}
                       onChange={(e) => setNewMessage(e.target.value)}
                       onKeyDown={(e) => {
                         if (e.key === 'Enter' && !e.shiftKey) {
                           e.preventDefault();
                           handleSendMessage();
                         }
                       }}
                       placeholder="Stuur een bericht..." 
                       rows={1}
                       className="w-full bg-blue-500/10 p-4 pr-12 rounded-xl outline-none focus:ring-2 focus:ring-blue-400/50 transition-all placeholder:text-blue-400/30 text-sm border border-blue-500/20 resize-none"
                     />
                     <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-blue-500/20 rounded-lg transition-colors">
                       <Camera size={18} className="text-blue-400" />
                     </button>
                   </div>
                   <button 
                     onClick={handleSendMessage}
                     disabled={!newMessage.trim()}
                     className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                       newMessage.trim() 
                         ? 'bg-blue-500 text-white hover:bg-blue-400 shadow-lg shadow-blue-500/30' 
                         : 'bg-blue-500/20 text-blue-400/50 cursor-not-allowed'
                     }`}
                   >
                     <Send size={18} />
                   </button>
                 </div>
                 <p className="text-[10px] text-blue-400/40 mt-2 ml-1">
                   Enter om te versturen • Shift+Enter voor nieuwe regel
                 </p>
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
