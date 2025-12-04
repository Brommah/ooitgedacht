import React, { useState, useRef, useEffect } from 'react';
import { Send, Zap, Paperclip, Smile, MoreHorizontal, CheckCheck, Bot, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../GlassCard';
import { MagneticButton } from '../MagneticButton';

interface Message {
  id: string;
  sender: string;
  initials: string;
  content: string;
  time: string;
  type: 'system' | 'aannemer' | 'keurmeester' | 'ai' | 'user';
  read?: boolean;
}

export const ChatTab: React.FC = () => {
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const messages: Message[] = [
    { id: '1', sender: 'Systeem', initials: 'SY', content: '🎉 Fase 1 succesvol afgerond! Fundering kan beginnen.', time: 'Gisteren, 14:00', type: 'system', read: true },
    { id: '2', sender: 'Van der Berg Bouw', initials: 'VB', content: 'De heipalen zijn aangekomen. We beginnen morgen vroeg met heien.', time: 'Gisteren, 16:45', type: 'aannemer', read: true },
    { id: '3', sender: 'Bureau Broersma', initials: 'BB', content: 'Wapening goedgekeurd na inspectie. Documenten zijn bijgewerkt.', time: 'Vandaag, 09:41', type: 'keurmeester', read: true },
    { id: '4', sender: 'BouwBorg AI', initials: 'AI', content: 'Op basis van de huidige voortgang verwacht ik dat de fundering over 2 weken voltooid is. Wil je een gedetailleerde planning zien?', time: 'Vandaag, 10:15', type: 'ai', read: true },
  ];

  const participants = [
    { name: 'Jan de Jong', initials: 'JD', role: 'Opdrachtgever', color: 'bg-blue-500', online: true },
    { name: 'Bureau Broersma', initials: 'BB', role: 'Keurmeester', color: 'bg-emerald-500', online: true },
    { name: 'Van der Berg Bouw', initials: 'VB', role: 'Aannemer', color: 'bg-amber-500', online: false },
    { name: 'BouwBorg AI', initials: 'AI', role: 'Assistent', color: 'bg-violet-500', online: true },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getMessageStyles = (type: Message['type']) => {
    switch (type) {
      case 'system':
        return { bg: 'bg-violet-500', text: 'text-white' };
      case 'keurmeester':
        return { bg: 'bg-emerald-500', text: 'text-white' };
      case 'aannemer':
        return { bg: 'bg-amber-500', text: 'text-white' };
      case 'ai':
        return { bg: 'bg-gradient-to-br from-violet-500 to-blue-500', text: 'text-white' };
      case 'user':
        return { bg: 'bg-blue-500', text: 'text-white' };
      default:
        return { bg: 'bg-white/10', text: 'text-white/80' };
    }
  };

  const handleSend = () => {
    if (!newMessage.trim()) return;
    // Handle send logic here
    setNewMessage('');
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-140px)] lg:h-[calc(100vh-120px)] lg:px-8 lg:py-6 lg:gap-6">
      {/* Participants Sidebar - Desktop Only */}
      <motion.div 
        className="hidden lg:block w-72 flex-shrink-0"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <GlassCard className="h-full p-5">
          <div className="flex items-center gap-2 mb-4">
            <Users size={18} className="text-white/60" />
            <h3 className="font-semibold text-white">Deelnemers</h3>
            <span className="ml-auto text-xs text-white/40">{participants.length}</span>
          </div>
          
          <div className="space-y-3">
            {participants.map((p, i) => (
              <motion.div 
                key={p.name}
                className="flex items-center gap-3 p-2 rounded-xl cursor-pointer"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="relative">
                  <div className={`w-10 h-10 rounded-full ${p.color} flex items-center justify-center text-xs font-bold text-white`}>
                    {p.initials === 'AI' ? <Bot size={18} /> : p.initials}
                  </div>
                  {p.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0a1628]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{p.name}</p>
                  <p className="text-xs text-white/40">{p.role}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-white/10">
            <MagneticButton variant="secondary" fullWidth size="sm">
              Deelnemer toevoegen
            </MagneticButton>
          </div>
        </GlassCard>
      </motion.div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <GlassCard className="flex-1 flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="px-4 lg:px-5 py-4 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Send size={18} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Project Chat</h3>
                <p className="text-xs text-white/40">{participants.length} deelnemers • 2 online</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Mobile participant avatars */}
              <div className="flex -space-x-2 lg:hidden">
                {participants.slice(0, 3).map((p) => (
                  <div 
                    key={p.name}
                    className={`w-7 h-7 rounded-full ${p.color} flex items-center justify-center text-[10px] font-bold text-white border-2 border-[#0a1628]`}
                  >
                    {p.initials}
                  </div>
                ))}
                {participants.length > 3 && (
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white/60 border-2 border-[#0a1628]">
                    +{participants.length - 3}
                  </div>
                )}
              </div>
              <button className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
                <MoreHorizontal size={18} className="text-white/60" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 lg:px-5 py-4 space-y-4">
            <AnimatePresence>
              {messages.map((msg, i) => {
                const styles = getMessageStyles(msg.type);
                const isAI = msg.type === 'ai';
                
                return (
                  <motion.div 
                    key={msg.id} 
                    className="flex gap-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${styles.bg} ${styles.text}`}>
                      {msg.type === 'system' ? <Zap size={14} /> : 
                       msg.type === 'ai' ? <Bot size={14} /> : 
                       msg.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-white">{msg.sender}</span>
                        {isAI && (
                          <span className="px-1.5 py-0.5 bg-violet-500/20 text-violet-400 text-[9px] font-bold rounded">AI</span>
                        )}
                        <span className="text-[10px] text-white/30">{msg.time}</span>
                        {msg.read && <CheckCheck size={12} className="text-blue-400" />}
                      </div>
                      <div 
                        className={`text-sm text-white/80 rounded-2xl rounded-tl-md p-3.5 ${
                          isAI 
                            ? 'bg-gradient-to-br from-violet-500/20 to-blue-500/10 border border-violet-500/20' 
                            : 'bg-white/[0.06]'
                        }`}
                      >
                        {msg.content}
                        {isAI && (
                          <div className="flex gap-2 mt-3 pt-3 border-t border-white/10">
                            <button className="px-3 py-1.5 bg-white/10 rounded-lg text-xs text-white/70">
                              Ja, toon planning
                            </button>
                            <button className="px-3 py-1.5 bg-white/10 rounded-lg text-xs text-white/70">
                              Later
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Typing indicator */}
            <AnimatePresence>
              {isTyping && (
                <motion.div 
                  className="flex gap-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center text-[10px] font-bold text-white">
                    VB
                  </div>
                  <div className="bg-white/[0.06] rounded-2xl rounded-tl-md p-3 flex items-center gap-1">
                    <motion.div 
                      className="w-2 h-2 bg-white/40 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div 
                      className="w-2 h-2 bg-white/40 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.div 
                      className="w-2 h-2 bg-white/40 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 lg:p-5 border-t border-white/5">
            <div className="flex gap-2 items-end">
              <div className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl focus-within:border-blue-500/50 transition-colors">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Typ een bericht..."
                  className="w-full bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none"
                />
                <div className="flex items-center gap-1 px-2 pb-2">
                  <button className="w-8 h-8 rounded-lg flex items-center justify-center">
                    <Paperclip size={16} className="text-white/40" />
                  </button>
                  <button className="w-8 h-8 rounded-lg flex items-center justify-center">
                    <Smile size={16} className="text-white/40" />
                  </button>
                </div>
              </div>
              <button 
                onClick={handleSend}
                className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30"
              >
                <Send size={18} className="text-white" />
              </button>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default ChatTab;
