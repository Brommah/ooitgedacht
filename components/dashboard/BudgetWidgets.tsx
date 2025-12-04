/**
 * BudgetWidgets - Role-specific financial views
 * 
 * CustomerBudgetWidget: Investment perspective (what am I paying?)
 * BuilderFinancialsWidget: Cash flow perspective (what do I get paid?)
 */
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Euro, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Camera,
  Shield,
  Unlock,
  ChevronRight,
} from 'lucide-react';
import { GlassCard, GlassCardHeader } from './GlassCard';
import { 
  CustomerBudgetWidgetProps, 
  BuilderFinancialsWidgetProps,
  DEFAULT_CUSTOMER_BUDGET,
  DEFAULT_BUILDER_BUDGET,
  DEFAULT_WKB_COMPLIANCE,
} from './types';

/**
 * Format currency for display
 */
const formatCurrency = (amount: number): string => {
  if (amount >= 1000) {
    return `€${(amount / 1000).toFixed(0)}k`;
  }
  return `€${amount.toLocaleString()}`;
};

/**
 * CustomerBudgetWidget - Investment Control View
 * Shows: Total Investment, Paid to Date, Remaining, Next Payment
 */
export const CustomerBudgetWidget: React.FC<CustomerBudgetWidgetProps> = ({
  budget = DEFAULT_CUSTOMER_BUDGET,
  className = '',
}) => {
  const paidPercentage = (budget.paidToDate / budget.totalInvestment) * 100;
  
  return (
    <GlassCard className={`p-4 ${className}`} tilt>
      <GlassCardHeader 
        title="Investering" 
        subtitle="Jouw financieel overzicht"
        icon={<Euro size={16} className="text-blue-400" />}
      />
      
      {/* Main Budget Display */}
      <div className="mt-4 space-y-4">
        {/* Total Investment */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/60">Totale investering</span>
          <span className="text-xl font-mono font-bold text-white">
            {formatCurrency(budget.totalInvestment)}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-emerald-400">Betaald</span>
            <span className="text-white/50">Resterend</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${paidPercentage}%` }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>
          <div className="flex justify-between text-xs mt-1.5">
            <span className="font-mono text-emerald-400">{formatCurrency(budget.paidToDate)}</span>
            <span className="font-mono text-white/50">{formatCurrency(budget.remaining)}</span>
          </div>
        </div>
        
        {/* Next Payment Card */}
        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-blue-400 font-medium mb-1">Volgende betaling</p>
              <p className="text-lg font-mono font-bold text-white">
                {formatCurrency(budget.nextPayment.amount)}
              </p>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 rounded-lg">
              <Clock size={12} className="text-blue-400" />
              <span className="text-[10px] text-blue-300">Gepland</span>
            </div>
          </div>
          <p className="text-xs text-white/50 mt-2 flex items-center gap-1.5">
            <Unlock size={12} className="text-blue-400" />
            {budget.nextPayment.trigger}
          </p>
        </div>
        
        {/* Quick Actions */}
        <button className="w-full py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-sm text-white/70 flex items-center justify-center gap-2 transition-colors">
          Betalingsoverzicht bekijken
          <ChevronRight size={16} />
        </button>
      </div>
    </GlassCard>
  );
};

/**
 * BuilderFinancialsWidget - Cash Flow & Compliance View
 * Shows: Contract Value, Invoiced, Pending Release, Wkb Status
 */
export const BuilderFinancialsWidget: React.FC<BuilderFinancialsWidgetProps> = ({
  budget = DEFAULT_BUILDER_BUDGET,
  wkbCompliance = DEFAULT_WKB_COMPLIANCE,
  className = '',
}) => {
  const invoicedPercentage = (budget.invoiced / budget.contractValue) * 100;
  const wkbPercentage = (wkbCompliance.collected / wkbCompliance.totalPoints) * 100;
  
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Cash Flow Card */}
      <GlassCard className="p-4" variant="highlight">
        <GlassCardHeader 
          title="Cash Flow" 
          subtitle="Contract & betalingen"
          icon={<Euro size={16} className="text-amber-400" />}
        />
        
        <div className="mt-4 space-y-4">
          {/* Contract Value */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/60">Contractwaarde</span>
            <span className="text-xl font-mono font-bold text-white">
              {formatCurrency(budget.contractValue)}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-emerald-400">Uitbetaald</span>
              <span className="text-amber-400">Openstaand</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${invoicedPercentage}%` }}
                transition={{ duration: 1, delay: 0.3 }}
              />
            </div>
            <div className="flex justify-between text-xs mt-1.5">
              <span className="font-mono text-emerald-400">{formatCurrency(budget.invoiced)}</span>
              <span className="font-mono text-amber-400">{formatCurrency(budget.pendingRelease)}</span>
            </div>
          </div>
          
          {/* Next Tranche Unlock */}
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-xs text-amber-400 font-medium mb-1">Volgende tranche</p>
                <p className="text-lg font-mono font-bold text-white">
                  {formatCurrency(budget.nextTranche.amount)}
                </p>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-amber-500/20 rounded-lg">
                <Camera size={12} className="text-amber-400" />
                <span className="text-[10px] text-amber-300">Actie vereist</span>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 bg-black/20 rounded-lg">
              <AlertTriangle size={14} className="text-amber-400 flex-shrink-0" />
              <p className="text-xs text-amber-300/80">{budget.nextTranche.unlockAction}</p>
            </div>
          </div>
        </div>
      </GlassCard>
      
      {/* Wkb Compliance Card */}
      <GlassCard className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-amber-400" />
            <span className="text-sm font-medium text-white">Wkb Dossier</span>
          </div>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium ${
            wkbPercentage >= 75 ? 'bg-emerald-500/20 text-emerald-400' :
            wkbPercentage >= 50 ? 'bg-amber-500/20 text-amber-400' :
            'bg-rose-500/20 text-rose-400'
          }`}>
            {wkbCompliance.collected}/{wkbCompliance.totalPoints} punten
          </div>
        </div>
        
        {/* Wkb Progress */}
        <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-3">
          <motion.div 
            className={`h-full rounded-full ${
              wkbPercentage >= 75 ? 'bg-emerald-500' :
              wkbPercentage >= 50 ? 'bg-amber-500' :
              'bg-rose-500'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${wkbPercentage}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
        
        {/* Status breakdown */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="text-center p-2 bg-emerald-500/10 rounded-lg">
            <p className="text-lg font-mono font-bold text-emerald-400">{wkbCompliance.collected}</p>
            <p className="text-[10px] text-white/40">Gekeurd</p>
          </div>
          <div className="text-center p-2 bg-amber-500/10 rounded-lg">
            <p className="text-lg font-mono font-bold text-amber-400">{wkbCompliance.pending}</p>
            <p className="text-[10px] text-white/40">Wacht</p>
          </div>
          <div className="text-center p-2 bg-rose-500/10 rounded-lg">
            <p className="text-lg font-mono font-bold text-rose-400">{wkbCompliance.rejected}</p>
            <p className="text-[10px] text-white/40">Afgekeurd</p>
          </div>
        </div>
        
        {/* Critical Missing Items */}
        {wkbCompliance.criticalMissing.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-[10px] text-rose-400 uppercase tracking-wider">Kritiek ontbrekend:</p>
            {wkbCompliance.criticalMissing.map((item, i) => (
              <div key={i} className="flex items-center gap-2 p-2 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                <Camera size={12} className="text-rose-400 flex-shrink-0" />
                <span className="text-xs text-rose-300">{item}</span>
              </div>
            ))}
          </div>
        )}
        
        {/* Next Inspection */}
        {wkbCompliance.nextInspection && (
          <div className="mt-3 flex items-center gap-2 p-2 bg-white/5 rounded-lg">
            <Clock size={12} className="text-white/40" />
            <span className="text-xs text-white/60">
              Volgende inspectie: <span className="text-white">{wkbCompliance.nextInspection}</span>
            </span>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default { CustomerBudgetWidget, BuilderFinancialsWidget };




