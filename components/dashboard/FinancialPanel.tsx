/**
 * FinancialPanel - P0.1: Financial transparency
 * 
 * Shows:
 * - Cost breakdown per phase
 * - Payment schedule with unlock conditions
 * - Tranche status (locked/unlocked/released)
 * - Real-time budget tracking
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Euro, Lock, Unlock, CheckCircle2, Clock, AlertTriangle, 
  ChevronDown, ChevronUp, TrendingDown, PiggyBank, ArrowRight,
  Camera, FileCheck, Hammer
} from 'lucide-react';
import { GlassCard, GlassCardHeader } from './GlassCard';
import { AnimatedCounter } from './AnimatedCounter';

interface Tranche {
  id: string;
  name: string;
  phase: string;
  amount: number;
  status: 'released' | 'unlocked' | 'locked' | 'pending';
  unlockCondition?: string;
  requiredAction?: 'photo' | 'inspection' | 'document';
  releaseDate?: string;
  paidDate?: string;
}

interface FinancialPanelProps {
  totalBudget: number;
  spent: number;
  released: number;
  className?: string;
}

const TRANCHES: Tranche[] = [
  {
    id: 't1',
    name: 'Voorschot Grondwerk',
    phase: 'Voorbereiding',
    amount: 15000,
    status: 'released',
    paidDate: '15 okt 2024',
  },
  {
    id: 't2',
    name: 'Fundering Start',
    phase: 'Fundering',
    amount: 34500,
    status: 'released',
    paidDate: '28 okt 2024',
  },
  {
    id: 't3',
    name: 'Fundering Afronding',
    phase: 'Fundering',
    amount: 15000,
    status: 'pending',
    unlockCondition: 'Foto tijdens storten vereist',
    requiredAction: 'photo',
  },
  {
    id: 't4',
    name: 'Ruwbouw Start',
    phase: 'Ruwbouw',
    amount: 45000,
    status: 'locked',
    unlockCondition: 'Start na uitharding fundering (28 dagen)',
  },
  {
    id: 't5',
    name: 'Ruwbouw Dak Dicht',
    phase: 'Ruwbouw',
    amount: 55000,
    status: 'locked',
    unlockCondition: 'Dak geplaatst en gekeurd',
    requiredAction: 'inspection',
  },
  {
    id: 't6',
    name: 'Installaties',
    phase: 'Afbouw',
    amount: 35000,
    status: 'locked',
    unlockCondition: 'Leidingwerk geïnstalleerd',
  },
  {
    id: 't7',
    name: 'Afbouw & Oplevering',
    phase: 'Oplevering',
    amount: 48500,
    status: 'locked',
    unlockCondition: 'Finale oplevering',
    requiredAction: 'inspection',
  },
];

const PHASE_COSTS = [
  { phase: 'Voorbereiding', planned: 25000, actual: 24200, status: 'completed' },
  { phase: 'Fundering', planned: 55000, actual: 52300, status: 'active' },
  { phase: 'Ruwbouw', planned: 120000, actual: 0, status: 'upcoming' },
  { phase: 'Afbouw', planned: 65000, actual: 0, status: 'upcoming' },
  { phase: 'Oplevering', planned: 33500, actual: 0, status: 'upcoming' },
];

export const FinancialPanel: React.FC<FinancialPanelProps> = ({
  totalBudget,
  spent,
  released,
  className = '',
}) => {
  const [showAllTranches, setShowAllTranches] = useState(false);
  const [expandedTranche, setExpandedTranche] = useState<string | null>('t3');

  const savings = PHASE_COSTS.reduce((acc, phase) => {
    if (phase.status === 'completed' || phase.status === 'active') {
      return acc + (phase.planned - phase.actual);
    }
    return acc;
  }, 0);

  const getStatusIcon = (status: Tranche['status']) => {
    switch (status) {
      case 'released': return <CheckCircle2 size={16} className="text-emerald-400" />;
      case 'unlocked': return <Unlock size={16} className="text-blue-400" />;
      case 'pending': return <Clock size={16} className="text-amber-400" />;
      case 'locked': return <Lock size={16} className="text-white/30" />;
    }
  };

  const getStatusBg = (status: Tranche['status']) => {
    switch (status) {
      case 'released': return 'bg-emerald-500/10 border-emerald-500/20';
      case 'unlocked': return 'bg-blue-500/10 border-blue-500/20';
      case 'pending': return 'bg-amber-500/10 border-amber-500/20';
      case 'locked': return 'bg-white/5 border-white/10';
    }
  };

  const getActionIcon = (action?: Tranche['requiredAction']) => {
    switch (action) {
      case 'photo': return <Camera size={14} />;
      case 'inspection': return <FileCheck size={14} />;
      case 'document': return <FileCheck size={14} />;
      default: return <Hammer size={14} />;
    }
  };

  const displayedTranches = showAllTranches ? TRANCHES : TRANCHES.slice(0, 4);
  const pendingTranche = TRANCHES.find(t => t.status === 'pending');

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Budget */}
        <GlassCard className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Euro size={14} className="text-white/40" />
            <span className="text-xs text-white/50">Totaal Budget</span>
          </div>
          <p className="text-xl font-mono font-bold text-white">
            €{(totalBudget / 1000).toFixed(0)}k
          </p>
        </GlassCard>

        {/* Released */}
        <GlassCard className="p-4" variant="success">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={14} className="text-emerald-400" />
            <span className="text-xs text-white/50">Vrijgegeven</span>
          </div>
          <p className="text-xl font-mono font-bold text-emerald-400">
            <AnimatedCounter value={released} prefix="€" />
          </p>
          <p className="text-[10px] text-white/40 mt-1">
            {((released / totalBudget) * 100).toFixed(0)}% van budget
          </p>
        </GlassCard>

        {/* Pending */}
        <GlassCard className="p-4" variant="warning">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={14} className="text-amber-400" />
            <span className="text-xs text-white/50">Wacht op actie</span>
          </div>
          <p className="text-xl font-mono font-bold text-amber-400">
            €{pendingTranche ? (pendingTranche.amount / 1000).toFixed(0) : 0}k
          </p>
          <p className="text-[10px] text-white/40 mt-1">
            1 tranche te ontgrendelen
          </p>
        </GlassCard>

        {/* Savings */}
        <GlassCard className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <PiggyBank size={14} className="text-cyan-400" />
            <span className="text-xs text-white/50">Bespaard</span>
          </div>
          <p className="text-xl font-mono font-bold text-cyan-400">
            +€{(savings / 1000).toFixed(1)}k
          </p>
          <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingDown size={10} /> Onder budget
          </p>
        </GlassCard>
      </div>

      {/* Payment Schedule */}
      <GlassCard className="p-5">
        <GlassCardHeader
          title="Betalingsschema"
          subtitle={`${TRANCHES.filter(t => t.status === 'released').length} van ${TRANCHES.length} tranches`}
          icon={<Euro size={18} className="text-blue-400" />}
        />

        <div className="mt-4 space-y-2">
          {displayedTranches.map((tranche, index) => (
            <motion.div
              key={tranche.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <button
                onClick={() => setExpandedTranche(expandedTranche === tranche.id ? null : tranche.id)}
                className={`w-full p-3 rounded-xl border transition-all ${getStatusBg(tranche.status)} ${
                  expandedTranche === tranche.id ? 'ring-1 ring-blue-500/30' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      tranche.status === 'released' ? 'bg-emerald-500/20' :
                      tranche.status === 'pending' ? 'bg-amber-500/20' :
                      'bg-white/5'
                    }`}>
                      {getStatusIcon(tranche.status)}
                    </div>
                    <div className="text-left">
                      <p className={`text-sm font-medium ${
                        tranche.status === 'locked' ? 'text-white/40' : 'text-white'
                      }`}>
                        {tranche.name}
                      </p>
                      <p className="text-xs text-white/40">{tranche.phase}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`font-mono font-bold ${
                      tranche.status === 'released' ? 'text-emerald-400' :
                      tranche.status === 'pending' ? 'text-amber-400' :
                      'text-white/40'
                    }`}>
                      €{tranche.amount.toLocaleString()}
                    </span>
                    {tranche.status === 'pending' || tranche.unlockCondition ? (
                      expandedTranche === tranche.id ? 
                        <ChevronUp size={16} className="text-white/40" /> : 
                        <ChevronDown size={16} className="text-white/40" />
                    ) : null}
                  </div>
                </div>

                {/* Expanded content */}
                <AnimatePresence>
                  {expandedTranche === tranche.id && (tranche.unlockCondition || tranche.paidDate) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-3 mt-3 border-t border-white/10">
                        {tranche.status === 'released' && tranche.paidDate && (
                          <div className="flex items-center gap-2 text-xs text-emerald-400">
                            <CheckCircle2 size={12} />
                            <span>Uitbetaald op {tranche.paidDate}</span>
                          </div>
                        )}
                        {tranche.status === 'pending' && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs text-amber-400">
                              <AlertTriangle size={12} />
                              <span>{tranche.unlockCondition}</span>
                            </div>
                            {tranche.requiredAction && (
                              <button className="w-full mt-2 px-4 py-2 bg-amber-500 text-black text-xs font-semibold rounded-lg flex items-center justify-center gap-2">
                                {getActionIcon(tranche.requiredAction)}
                                {tranche.requiredAction === 'photo' ? 'Upload foto' : 
                                 tranche.requiredAction === 'inspection' ? 'Plan inspectie' : 'Upload document'}
                              </button>
                            )}
                          </div>
                        )}
                        {tranche.status === 'locked' && (
                          <div className="flex items-center gap-2 text-xs text-white/40">
                            <Lock size={12} />
                            <span>{tranche.unlockCondition}</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Show more button */}
        {TRANCHES.length > 4 && (
          <button
            onClick={() => setShowAllTranches(!showAllTranches)}
            className="w-full mt-3 py-2 text-sm text-blue-400 flex items-center justify-center gap-1"
          >
            {showAllTranches ? 'Minder tonen' : `Alle ${TRANCHES.length} tranches bekijken`}
            {showAllTranches ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        )}
      </GlassCard>

      {/* Cost per Phase */}
      <GlassCard className="p-5">
        <GlassCardHeader
          title="Kosten per fase"
          subtitle="Gepland vs. Werkelijk"
          icon={<TrendingDown size={18} className="text-cyan-400" />}
        />

        <div className="mt-4 space-y-3">
          {PHASE_COSTS.map((phase, index) => {
            const variance = phase.planned - phase.actual;
            const percentUsed = phase.actual > 0 ? (phase.actual / phase.planned) * 100 : 0;
            
            return (
              <motion.div
                key={phase.phase}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      phase.status === 'completed' ? 'bg-emerald-400' :
                      phase.status === 'active' ? 'bg-blue-400 animate-pulse' :
                      'bg-white/20'
                    }`} />
                    <span className={`text-sm ${
                      phase.status === 'upcoming' ? 'text-white/40' : 'text-white'
                    }`}>
                      {phase.phase}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    {phase.actual > 0 && (
                      <span className={variance > 0 ? 'text-emerald-400' : 'text-rose-400'}>
                        {variance > 0 ? '-' : '+'}€{Math.abs(variance).toLocaleString()}
                      </span>
                    )}
                    <span className="text-white/50 font-mono">
                      €{phase.actual > 0 ? phase.actual.toLocaleString() : '-'} / €{phase.planned.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${
                      phase.status === 'completed' ? 'bg-emerald-500' :
                      phase.status === 'active' ? 'bg-blue-500' :
                      'bg-white/10'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(percentUsed, 100)}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Total savings callout */}
        {savings > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
              <PiggyBank size={20} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-emerald-400 font-medium">
                Je loopt €{savings.toLocaleString()} onder budget
              </p>
              <p className="text-xs text-emerald-400/60">
                Homie houdt de kosten scherp in de gaten
              </p>
            </div>
          </motion.div>
        )}
      </GlassCard>
    </div>
  );
};

export default FinancialPanel;

