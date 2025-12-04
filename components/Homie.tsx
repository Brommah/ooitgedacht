import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, AlertTriangle, Lightbulb, PiggyBank, Gift, PartyPopper, ChevronDown } from 'lucide-react';

// ============================================
// HOMIE SVG - The Clippy-style House Robot
// ============================================
interface HomieSVGProps {
  mood: 'idle' | 'thinking' | 'happy' | 'alert' | 'wink';
  size?: number;
  className?: string;
}

const HomieSVG: React.FC<HomieSVGProps> = ({ mood, size = 80, className = '' }) => {
  const [blinkState, setBlinkState] = useState(false);
  
  // Auto blink effect
  useEffect(() => {
    if (mood === 'idle') {
      const interval = setInterval(() => {
        setBlinkState(true);
        setTimeout(() => setBlinkState(false), 150);
      }, 3000 + Math.random() * 2000);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [mood]);

  const eyeOpen = mood === 'happy' ? 'M0 -2 Q3 2 6 -2' : 'M0 0 Q3 -4 6 0';
  const eyeClosed = 'M0 0 Q3 1 6 0';
  const leftEye = (blinkState || mood === 'wink') ? eyeClosed : eyeOpen;
  const rightEye = blinkState ? eyeClosed : eyeOpen;
  
  return (
    <svg 
      viewBox="0 0 100 120" 
      width={size} 
      height={size * 1.2} 
      className={className}
    >
      {/* Antenna */}
      <motion.g
        animate={mood === 'thinking' ? { rotate: [0, -10, 10, 0] } : { rotate: 0 }}
        transition={{ duration: 0.5, repeat: mood === 'thinking' ? Infinity : 0 }}
        style={{ transformOrigin: '50px 15px' }}
      >
        <line x1="50" y1="25" x2="50" y2="8" stroke="#60A5FA" strokeWidth="3" strokeLinecap="round" />
        <motion.circle 
          cx="50" cy="5" r="5" 
          fill="#60A5FA"
          animate={mood === 'alert' ? { scale: [1, 1.3, 1], fill: ['#60A5FA', '#F59E0B', '#60A5FA'] } : {}}
          transition={{ duration: 0.5, repeat: mood === 'alert' ? Infinity : 0 }}
        />
        {/* Antenna glow for thinking */}
        {mood === 'thinking' && (
          <motion.circle 
            cx="50" cy="5" r="8" 
            fill="none"
            stroke="#60A5FA"
            strokeWidth="2"
            animate={{ opacity: [0.5, 0, 0.5], scale: [1, 1.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </motion.g>

      {/* Main body - House shape */}
      <motion.g
        animate={mood === 'happy' ? { y: [0, -3, 0] } : {}}
        transition={{ duration: 0.3, repeat: mood === 'happy' ? 3 : 0 }}
      >
        {/* House roof */}
        <path 
          d="M15 50 L50 20 L85 50" 
          fill="none" 
          stroke="#3B82F6" 
          strokeWidth="6" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        
        {/* Roof fill with gradient */}
        <defs>
          <linearGradient id="roofGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
          <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1E3A5F" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
        </defs>
        
        <path 
          d="M18 48 L50 22 L82 48 Z" 
          fill="url(#roofGradient)"
        />

        {/* Body rectangle */}
        <rect 
          x="20" y="48" 
          width="60" height="55" 
          rx="8" 
          fill="url(#bodyGradient)"
          stroke="#3B82F6"
          strokeWidth="3"
        />

        {/* Belly screen / glow area */}
        <rect 
          x="28" y="75" 
          width="44" height="20" 
          rx="4" 
          fill="#0F172A"
          stroke="#60A5FA"
          strokeWidth="1.5"
        />
        
        {/* Screen pattern - heartbeat/activity line */}
        <motion.path
          d="M32 85 L38 85 L41 80 L44 90 L47 82 L50 85 L56 85 L59 80 L62 88 L65 85 L68 85"
          fill="none"
          stroke="#10B981"
          strokeWidth="2"
          strokeLinecap="round"
          animate={{ 
            pathLength: [0, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Face area - slightly raised panel */}
        <rect 
          x="28" y="52" 
          width="44" height="20" 
          rx="4" 
          fill="#1E293B"
          stroke="#334155"
          strokeWidth="1"
        />

        {/* Eyes */}
        <g transform="translate(35, 60)">
          {/* Left eye socket */}
          <ellipse cx="6" cy="4" rx="8" ry="7" fill="#0F172A" />
          {/* Left eye */}
          <motion.path
            d={leftEye}
            stroke="#60A5FA"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          {/* Left eye sparkle */}
          {mood !== 'wink' && !blinkState && (
            <circle cx="3" cy="-1" r="1.5" fill="#93C5FD" />
          )}
        </g>
        
        <g transform="translate(53, 60)">
          {/* Right eye socket */}
          <ellipse cx="6" cy="4" rx="8" ry="7" fill="#0F172A" />
          {/* Right eye */}
          <motion.path
            d={rightEye}
            stroke="#60A5FA"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          {/* Right eye sparkle */}
          {!blinkState && (
            <circle cx="3" cy="-1" r="1.5" fill="#93C5FD" />
          )}
        </g>

        {/* Happy cheeks */}
        {mood === 'happy' && (
          <>
            <ellipse cx="30" cy="66" rx="4" ry="2" fill="#F472B6" opacity="0.5" />
            <ellipse cx="70" cy="66" rx="4" ry="2" fill="#F472B6" opacity="0.5" />
          </>
        )}

        {/* Door (doubles as mouth) */}
        <rect 
          x="42" y="95" 
          width="16" height="10" 
          rx="2" 
          fill="#0F172A"
          stroke="#60A5FA"
          strokeWidth="1.5"
        />
        {/* Door handle */}
        <circle cx="55" cy="100" r="1.5" fill="#60A5FA" />

        {/* Chimney */}
        <rect 
          x="65" y="28" 
          width="10" height="15" 
          rx="2" 
          fill="#1E293B"
          stroke="#3B82F6"
          strokeWidth="2"
        />
        
        {/* Chimney smoke puffs (when thinking) */}
        {mood === 'thinking' && (
          <>
            <motion.circle
              cx="70" cy="20"
              r="3"
              fill="#94A3B8"
              animate={{ y: [0, -15], opacity: [0.8, 0], scale: [1, 1.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.circle
              cx="72" cy="18"
              r="2"
              fill="#94A3B8"
              animate={{ y: [0, -12], opacity: [0.6, 0], scale: [1, 1.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
            />
          </>
        )}

        {/* Confetti for happy mood */}
        {mood === 'happy' && (
          <>
            <motion.rect
              x="25" y="30" width="4" height="4" fill="#F59E0B" rx="1"
              animate={{ y: [30, 50], x: [25, 15], rotate: [0, 360], opacity: [1, 0] }}
              transition={{ duration: 1, repeat: 3 }}
            />
            <motion.rect
              x="75" y="35" width="4" height="4" fill="#10B981" rx="1"
              animate={{ y: [35, 55], x: [75, 85], rotate: [0, -360], opacity: [1, 0] }}
              transition={{ duration: 1, repeat: 3, delay: 0.2 }}
            />
            <motion.circle
              cx="50" cy="25" r="2" fill="#EC4899"
              animate={{ y: [25, 45], opacity: [1, 0] }}
              transition={{ duration: 1, repeat: 3, delay: 0.4 }}
            />
          </>
        )}
      </motion.g>

      {/* Arms (little stubs on the side) */}
      <motion.ellipse
        cx="12" cy="70" rx="6" ry="10"
        fill="#1E3A5F"
        stroke="#3B82F6"
        strokeWidth="2"
        animate={mood === 'happy' ? { rotate: [0, 20, 0] } : {}}
        transition={{ duration: 0.3, repeat: mood === 'happy' ? 3 : 0 }}
        style={{ transformOrigin: '18px 70px' }}
      />
      <motion.ellipse
        cx="88" cy="70" rx="6" ry="10"
        fill="#1E3A5F"
        stroke="#3B82F6"
        strokeWidth="2"
        animate={mood === 'happy' ? { rotate: [0, -20, 0] } : {}}
        transition={{ duration: 0.3, repeat: mood === 'happy' ? 3 : 0 }}
        style={{ transformOrigin: '82px 70px' }}
      />

      {/* Little feet */}
      <ellipse cx="35" cy="108" rx="10" ry="5" fill="#1E3A5F" stroke="#3B82F6" strokeWidth="2" />
      <ellipse cx="65" cy="108" rx="10" ry="5" fill="#1E3A5F" stroke="#3B82F6" strokeWidth="2" />
    </svg>
  );
};

// ============================================
// NOTIFICATION TYPES
// ============================================
type NotificationType = 'info' | 'warning' | 'tip' | 'savings' | 'deal' | 'celebration';

interface HomieNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  dismiss?: {
    label: string;
    onClick: () => void;
  };
}

// ============================================
// HOMIE CHAT MESSAGE
// ============================================
interface ChatMessage {
  id: string;
  sender: 'user' | 'homie';
  text: string;
  timestamp: Date;
}

// ============================================
// MAIN HOMIE COMPONENT
// ============================================
interface HomieProps {
  viewMode?: 'customer' | 'builder';
}

export const Homie: React.FC<HomieProps> = ({ viewMode = 'customer' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mood, setMood] = useState<'idle' | 'thinking' | 'happy' | 'alert' | 'wink'>('idle');
  const [currentNotification, setCurrentNotification] = useState<HomieNotification | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'homie', text: viewMode === 'customer' 
      ? 'Hoi! 👋 Ik ben Homie, je persoonlijke woning-assistent. Vraag me alles over je project!' 
      : 'Hoi! 👋 Ik ben Homie, je bouw-assistent. Vraag me alles over het project!', timestamp: new Date() },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Customer notifications - focused on decisions, deals, milestones
  const customerNotifications: HomieNotification[] = [
    {
      id: 'c1',
      type: 'deal',
      title: '☀️ Persoonlijk aanbod',
      message: 'Je dak ligt op het zuiden! Ik vond een zonnepanelen-deal: €15/m extra op de hypotheek, maar bespaart €40/m aan energie.',
      action: { label: 'Bekijk aanbod', onClick: () => {} },
      dismiss: { label: 'Niet nu', onClick: () => setCurrentNotification(null) },
    },
    {
      id: 'c2',
      type: 'info',
      title: '🏠 Keuze nodig',
      message: 'Je aannemer wacht op je keuze voor de dakpannen. Bekijk de 3 opties en kies je favoriet!',
      action: { label: 'Bekijk opties', onClick: () => {} },
      dismiss: { label: 'Later', onClick: () => setCurrentNotification(null) },
    },
    {
      id: 'c3',
      type: 'celebration',
      title: '🎉 Milestone bereikt!',
      message: 'De fundering is goedgekeurd! Je woning staat nu letterlijk op een stevige basis.',
      dismiss: { label: 'Super!', onClick: () => { setCurrentNotification(null); setMood('happy'); setTimeout(() => setMood('idle'), 2000); } },
    },
    {
      id: 'c4',
      type: 'tip',
      title: '💡 Wist je dat...',
      message: 'Een warmtepomp kan je energiekosten met 50% verlagen? Je kunt dit nog toevoegen aan je configuratie.',
      action: { label: 'Meer info', onClick: () => {} },
      dismiss: { label: 'Bedankt', onClick: () => setCurrentNotification(null) },
    },
  ];

  // Builder notifications - focused on Wkb, weather, technical tasks
  const builderNotifications: HomieNotification[] = [
    {
      id: 'b1',
      type: 'warning',
      title: '⚠️ Weerswaarschuwing',
      message: 'Zware regen voorspeld voor vrijdag. Advies: Plan het storten naar donderdagochtend.',
      action: { label: 'Planning aanpassen', onClick: () => {} },
      dismiss: { label: 'Negeer', onClick: () => setCurrentNotification(null) },
    },
    {
      id: 'b2',
      type: 'tip',
      title: '📸 Wkb Reminder',
      message: 'Vergeet niet de wapening te fotograferen voordat je gaat storten. Bureau Broersma controleert binnen 4 uur.',
      action: { label: 'Camera openen', onClick: () => {} },
      dismiss: { label: 'Begrepen', onClick: () => setCurrentNotification(null) },
    },
    {
      id: 'b3',
      type: 'savings',
      title: '💰 Materiaal besparing',
      message: 'Je hebt nog 20m vurenhout over van de bekisting. Gebruik dit voor de stelprofielen!',
      action: { label: 'Bekijk voorraad', onClick: () => {} },
      dismiss: { label: 'Later', onClick: () => setCurrentNotification(null) },
    },
    {
      id: 'b4',
      type: 'celebration',
      title: '✅ Keuring goedgekeurd',
      message: 'De wapeningskeuring is goedgekeurd door Bureau Broersma! Klaar voor de volgende fase.',
      dismiss: { label: 'Top!', onClick: () => { setCurrentNotification(null); setMood('happy'); setTimeout(() => setMood('idle'), 2000); } },
    },
  ];

  // Select notifications based on viewMode
  const demoNotifications = viewMode === 'customer' ? customerNotifications : builderNotifications;

  // Clear notification when view mode changes
  useEffect(() => {
    setCurrentNotification(null);
  }, [viewMode]);

  // Cycle through demo notifications
  useEffect(() => {
    if (!isOpen && !currentNotification) {
      const timeout = setTimeout(() => {
        const notifs = viewMode === 'customer' ? customerNotifications : builderNotifications;
        const randomNotif = notifs[Math.floor(Math.random() * notifs.length)];
        setCurrentNotification(randomNotif);
        setMood(randomNotif.type === 'warning' ? 'alert' : randomNotif.type === 'celebration' ? 'happy' : 'wink');
      }, 8000);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [isOpen, currentNotification, viewMode]);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setMood('thinking');

    // Simulate Homie response
    setTimeout(() => {
      const responses: Record<string, string> = {
        'geld': 'De betaling staat nog op slot omdat de "Foto tijdens storten" ontbreekt bij de funderingstaak. Upload die eerst even, dan wordt het bedrag vrijgegeven! 📸',
        'claim': 'De betaling staat nog op slot omdat de "Foto tijdens storten" ontbreekt bij de funderingstaak. Upload die eerst even, dan wordt het bedrag vrijgegeven! 📸',
        'betaling': 'De volgende betaling van €15.000 wordt vrijgegeven zodra de foto van het storten is geverifieerd door Bureau Broersma. Dat duurt meestal 24 uur na upload.',
        'wanneer': 'Volgens de huidige planning is de fundering over 3 dagen klaar. Dan volgt een uithardingsperiode van 28 dagen voordat we met de ruwbouw beginnen.',
        'weer': 'Ik check het weer automatisch! Voor de komende 3 dagen: ☀️ Droog en ideaal voor buitenwerk. Vrijdag mogelijk regen - hou dat in de gaten.',
        'kosten': 'Je totale bouwkosten zijn €298.500. Tot nu toe is €49.500 vrijgegeven (16.5%). De volgende tranche van €15.000 wacht op de funderings-foto.',
      };

      const lowerInput = inputValue.toLowerCase();
      let response = 'Goede vraag! Ik kijk even in het dossier... 🔍\n\nIk kan je helpen met vragen over betalingen, planning, het weer, documenten, of de voortgang. Waar kan ik je mee helpen?';
      
      for (const [key, value] of Object.entries(responses)) {
        if (lowerInput.includes(key)) {
          response = value;
          break;
        }
      }

      const homieMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'homie',
        text: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, homieMessage]);
      setIsTyping(false);
      setMood('idle');
    }, 1500);
  };

  const getNotificationStyle = (type: NotificationType) => {
    switch (type) {
      case 'warning': return 'bg-amber-500/20 border-amber-500/40 text-amber-200';
      case 'tip': return 'bg-cyan-500/20 border-cyan-500/40 text-cyan-200';
      case 'savings': return 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200';
      case 'deal': return 'bg-violet-500/20 border-violet-500/40 text-violet-200';
      case 'celebration': return 'bg-pink-500/20 border-pink-500/40 text-pink-200';
      default: return 'bg-blue-500/20 border-blue-500/40 text-blue-200';
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'warning': return <AlertTriangle size={18} />;
      case 'tip': return <Lightbulb size={18} />;
      case 'savings': return <PiggyBank size={18} />;
      case 'deal': return <Gift size={18} />;
      case 'celebration': return <PartyPopper size={18} />;
      default: return <Sparkles size={18} />;
    }
  };

  return (
    <>
      {/* Main Homie Button - Fixed position */}
      <div className="fixed bottom-20 lg:bottom-8 right-3 lg:right-8 z-50">
        <AnimatePresence>
          {/* Notification Bubble - Always positioned above/left of the avatar */}
          {currentNotification && !isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className={`
                absolute bottom-full right-0 mb-2
                w-72 lg:w-80
                p-3 lg:p-4 rounded-2xl border backdrop-blur-xl shadow-2xl
                ${getNotificationStyle(currentNotification.type)}
              `}
            >
              {/* Speech bubble tail pointing to avatar */}
              <div className={`absolute -bottom-2 right-6 w-4 h-4 rotate-45 border-r border-b ${getNotificationStyle(currentNotification.type).split(' ').slice(0, 2).join(' ')}`} />
              
              <div className="flex items-start gap-2.5">
                <div className="flex-shrink-0 mt-0.5">
                  {getNotificationIcon(currentNotification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm mb-1">{currentNotification.title}</h4>
                  <p className="text-xs opacity-90 leading-relaxed">{currentNotification.message}</p>
                  
                  <div className="flex gap-2 mt-2">
                    {currentNotification.dismiss && (
                      <button 
                        onClick={currentNotification.dismiss.onClick}
                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium transition-colors"
                      >
                        {currentNotification.dismiss.label}
                      </button>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => setCurrentNotification(null)}
                  className="flex-shrink-0 p-1 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Homie Avatar Button */}
        <motion.button
          onClick={() => { setIsOpen(!isOpen); setCurrentNotification(null); }}
          className="relative"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-blue-500/30 blur-xl rounded-full" />
          
          {/* Avatar container - Smaller on mobile */}
          <div className={`relative bg-gradient-to-br from-[#1E3A5F] to-[#0F172A] rounded-xl lg:rounded-2xl p-1.5 lg:p-2 border-2 transition-colors ${
            isOpen ? 'border-blue-400' : 'border-blue-500/50 hover:border-blue-400/70'
          }`}>
            <div className="w-12 h-12 lg:w-[60px] lg:h-[60px]">
              <HomieSVG mood={mood} size={48} />
            </div>
            
            {/* Notification badge */}
            {!isOpen && currentNotification && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center"
              >
                <span className="text-white text-[10px] font-bold">1</span>
              </motion.div>
            )}
          </div>
        </motion.button>
      </div>

      {/* Chat Panel - Positioned relative to avatar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-36 lg:bottom-24 right-3 lg:right-8 w-[calc(100vw-1.5rem)] max-w-sm lg:w-80 z-50"
          >
            <div className="bg-[#0d1525]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500/20 to-emerald-500/20 border-b border-white/5 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#1E3A5F] rounded-xl flex items-center justify-center">
                    <HomieSVG mood="idle" size={32} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white text-sm">Homie</h3>
                    <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                      Online • Jouw bouw-assistent
                    </p>
                  </div>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/5 rounded-xl transition-colors"
                  >
                    <ChevronDown size={18} className="text-white/50" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="h-64 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm ${
                      msg.sender === 'user'
                        ? 'bg-blue-500 text-white rounded-br-md'
                        : 'bg-white/10 text-white/90 rounded-bl-md'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white/10 rounded-2xl rounded-bl-md px-4 py-3">
                      <div className="flex gap-1">
                        <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0 }} className="w-2 h-2 bg-blue-400 rounded-full" />
                        <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0.15 }} className="w-2 h-2 bg-blue-400 rounded-full" />
                        <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0.3 }} className="w-2 h-2 bg-blue-400 rounded-full" />
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Quick suggestions */}
              <div className="px-4 py-2 border-t border-white/5">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {['Wanneer is de fundering klaar?', 'Hoeveel kost dit?', 'Check het weer'].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => { setInputValue(suggestion); }}
                      className="flex-shrink-0 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs text-white/70 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div className="p-3 border-t border-white/5">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Vraag Homie iets..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-blue-500/50"
                  />
                  <button 
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    className="w-10 h-10 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-blue-500 rounded-xl flex items-center justify-center transition-colors"
                  >
                    <Send size={16} className="text-white" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Homie;

