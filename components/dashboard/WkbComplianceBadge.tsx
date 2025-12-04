/**
 * WkbComplianceBadge - P0.2: Wkb compliance status always visible
 * 
 * Shows:
 * - Current Wkb compliance status
 * - Days since last verification
 * - Kwaliteitsborger info
 * - Quick link to dossier status
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, ShieldCheck, ShieldAlert, ShieldX, 
  ChevronDown, ExternalLink, Clock, CheckCircle2,
  FileCheck, AlertTriangle, Building2
} from 'lucide-react';

interface WkbStatus {
  status: 'compliant' | 'pending' | 'action_required' | 'non_compliant';
  lastVerification: string;
  nextInspection?: string;
  kwaliteitsborger: {
    name: string;
    company: string;
    logo?: string;
  };
  dossierStatus: {
    total: number;
    verified: number;
    pending: number;
    rejected: number;
  };
  alerts?: string[];
}

interface WkbComplianceBadgeProps {
  className?: string;
  variant?: 'minimal' | 'compact' | 'full';
  wkbStatus?: WkbStatus;
}

const DEFAULT_STATUS: WkbStatus = {
  status: 'pending',
  lastVerification: '2 dagen geleden',
  nextInspection: '15 dec 2024',
  kwaliteitsborger: {
    name: 'Ing. H. Broersma',
    company: 'Bureau Broersma',
    logo: 'https://www.bureau-broersma.nl/wp-content/uploads/2015/09/logo-broersma-bouwadvies.png',
  },
  dossierStatus: {
    total: 24,
    verified: 18,
    pending: 5,
    rejected: 1,
  },
  alerts: ['Foto storten fundering nog niet geverifieerd'],
};

export const WkbComplianceBadge: React.FC<WkbComplianceBadgeProps> = ({
  className = '',
  variant = 'compact',
  wkbStatus = DEFAULT_STATUS,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusConfig = (status: WkbStatus['status']) => {
    switch (status) {
      case 'compliant':
        return {
          icon: <ShieldCheck size={variant === 'minimal' ? 14 : 16} />,
          label: 'Wkb Compliant',
          shortLabel: 'Wkb ✓',
          color: 'emerald',
          bgClass: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
          pulseClass: 'bg-emerald-400',
        };
      case 'pending':
        return {
          icon: <Shield size={variant === 'minimal' ? 14 : 16} />,
          label: 'Wkb Actief',
          shortLabel: 'Wkb',
          color: 'blue',
          bgClass: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
          pulseClass: 'bg-blue-400',
        };
      case 'action_required':
        return {
          icon: <ShieldAlert size={variant === 'minimal' ? 14 : 16} />,
          label: 'Actie Vereist',
          shortLabel: 'Wkb !',
          color: 'amber',
          bgClass: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
          pulseClass: 'bg-amber-400',
        };
      case 'non_compliant':
        return {
          icon: <ShieldX size={variant === 'minimal' ? 14 : 16} />,
          label: 'Niet Compliant',
          shortLabel: 'Wkb ✗',
          color: 'rose',
          bgClass: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
          pulseClass: 'bg-rose-400',
        };
    }
  };

  const config = getStatusConfig(wkbStatus.status);
  const hasAlerts = wkbStatus.alerts && wkbStatus.alerts.length > 0;

  // Minimal variant - just a small badge
  if (variant === 'minimal') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2 py-1 ${config.bgClass} rounded-full border ${className}`}>
        <span className={`w-1.5 h-1.5 ${config.pulseClass} rounded-full animate-pulse`} />
        <span className="text-[10px] font-medium">{config.shortLabel}</span>
      </div>
    );
  }

  // Compact variant - badge with expand option
  if (variant === 'compact') {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center gap-2 px-3 py-1.5 ${config.bgClass} rounded-full border`}
        >
          <span className={`w-1.5 h-1.5 ${config.pulseClass} rounded-full animate-pulse`} />
          {config.icon}
          <span className="text-xs font-medium">{config.label}</span>
          {hasAlerts && (
            <span className="flex items-center justify-center w-4 h-4 bg-amber-500 text-black text-[9px] font-bold rounded-full">
              {wkbStatus.alerts!.length}
            </span>
          )}
          <ChevronDown 
            size={14} 
            className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
          />
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-full right-0 mt-2 w-80 bg-[#0d1525]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 z-50 overflow-hidden"
            >
              {/* Header */}
              <div className={`p-4 border-b border-white/5 ${config.bgClass.replace('border-', 'border-b-')}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${config.bgClass}`}>
                    {config.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm">{config.label}</h4>
                    <p className="text-xs text-white/50">
                      Laatste check: {wkbStatus.lastVerification}
                    </p>
                  </div>
                </div>
              </div>

              {/* Kwaliteitsborger */}
              <div className="p-4 border-b border-white/5">
                <p className="text-[10px] uppercase tracking-wider text-white/40 mb-2">Kwaliteitsborger</p>
                <div className="flex items-center gap-3">
                  {wkbStatus.kwaliteitsborger.logo ? (
                    <img 
                      src={wkbStatus.kwaliteitsborger.logo} 
                      alt={wkbStatus.kwaliteitsborger.company}
                      className="h-8 brightness-0 invert opacity-70"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                      <Building2 size={16} className="text-white/40" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-white font-medium">{wkbStatus.kwaliteitsborger.name}</p>
                    <p className="text-xs text-white/50">{wkbStatus.kwaliteitsborger.company}</p>
                  </div>
                </div>
              </div>

              {/* Dossier status */}
              <div className="p-4 border-b border-white/5">
                <p className="text-[10px] uppercase tracking-wider text-white/40 mb-3">Dossier status</p>
                <div className="grid grid-cols-4 gap-2">
                  <div className="text-center">
                    <p className="text-lg font-mono font-bold text-white">{wkbStatus.dossierStatus.total}</p>
                    <p className="text-[10px] text-white/40">Totaal</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-mono font-bold text-emerald-400">{wkbStatus.dossierStatus.verified}</p>
                    <p className="text-[10px] text-white/40">Gekeurd</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-mono font-bold text-amber-400">{wkbStatus.dossierStatus.pending}</p>
                    <p className="text-[10px] text-white/40">Wacht</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-mono font-bold text-rose-400">{wkbStatus.dossierStatus.rejected}</p>
                    <p className="text-[10px] text-white/40">Afgekeurd</p>
                  </div>
                </div>
              </div>

              {/* Alerts */}
              {hasAlerts && (
                <div className="p-4 border-b border-white/5 bg-amber-500/5">
                  <p className="text-[10px] uppercase tracking-wider text-amber-400 mb-2">Openstaande acties</p>
                  <div className="space-y-2">
                    {wkbStatus.alerts!.map((alert, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-amber-300">
                        <AlertTriangle size={12} className="mt-0.5 flex-shrink-0" />
                        <span>{alert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Next inspection */}
              {wkbStatus.nextInspection && (
                <div className="p-4 border-b border-white/5">
                  <div className="flex items-center gap-2 text-xs text-white/60">
                    <Clock size={12} />
                    <span>Volgende inspectie: <span className="text-white font-medium">{wkbStatus.nextInspection}</span></span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="p-3 flex gap-2">
                <button className="flex-1 px-3 py-2 bg-white/5 rounded-lg text-xs text-white/70 flex items-center justify-center gap-2">
                  <FileCheck size={14} />
                  Bekijk dossier
                </button>
                <button className="flex-1 px-3 py-2 bg-blue-500 rounded-lg text-xs text-white font-medium flex items-center justify-center gap-2">
                  <ExternalLink size={14} />
                  Open portaal
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Full variant - card style
  return (
    <div className={`p-4 rounded-2xl border ${config.bgClass} ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${config.bgClass}`}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-white">{config.label}</h3>
            <p className="text-xs text-white/50">Wet kwaliteitsborging bouwen</p>
          </div>
        </div>
        <span className={`w-2 h-2 ${config.pulseClass} rounded-full animate-pulse`} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-white/5 rounded-xl">
          <div className="flex items-center gap-2 text-xs text-white/50 mb-1">
            <CheckCircle2 size={12} />
            Geverifieerd
          </div>
          <p className="text-lg font-mono font-bold text-emerald-400">
            {wkbStatus.dossierStatus.verified}/{wkbStatus.dossierStatus.total}
          </p>
        </div>
        <div className="p-3 bg-white/5 rounded-xl">
          <div className="flex items-center gap-2 text-xs text-white/50 mb-1">
            <Clock size={12} />
            Laatste check
          </div>
          <p className="text-sm font-medium text-white">{wkbStatus.lastVerification}</p>
        </div>
      </div>

      {hasAlerts && (
        <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
          <div className="flex items-center gap-2 text-xs text-amber-400">
            <AlertTriangle size={12} />
            <span>{wkbStatus.alerts![0]}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WkbComplianceBadge;

