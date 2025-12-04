import React, { useState } from 'react';
import { Home, FileText, Download, CheckCircle2, Calendar, Zap, Shield, Award, Calculator, FolderOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DocsTabProps } from '../types';
import { GlassCard, GlassCardHeader } from '../GlassCard';
import { MagneticButton } from '../MagneticButton';
import { containerVariants, itemVariants } from '../BentoGrid';
import { DecisionCalculator } from '../DecisionCalculator';

export const DocsTab: React.FC<DocsTabProps> = ({ preferences, energyLabel, energyOpt }) => {
  const [viewMode, setViewMode] = useState<'documents' | 'calculator'>('documents');

  const documents = [
    { name: 'Woningpaspoort_Ondertekend.pdf', verified: true, date: '28 nov', size: '2.4 MB' },
    { name: 'Vergunning_Onherroepelijk.pdf', verified: true, date: '15 nov', size: '1.8 MB' },
    { name: 'Constructieberekening_v4.pdf', verified: true, date: '10 nov', size: '5.2 MB' },
    { name: 'Sonderingsrapport.pdf', verified: true, date: '5 nov', size: '3.1 MB' },
    { name: 'Wapening_Goedkeuring.pdf', verified: true, date: 'Vandaag', size: '890 KB' },
    { name: 'Installatietekening_v2.pdf', verified: false, date: 'In afwachting', size: '—' },
  ];

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
            {viewMode === 'documents' ? 'Documenten' : 'Upgrade Calculator'}
          </h1>
          <p className="text-sm text-white/50 mt-1">
            {viewMode === 'documents' 
              ? 'Alle projectdocumenten en certificeringen' 
              : 'Bereken de impact van upgrades op je woning'}
          </p>
        </div>
        
        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 p-1 bg-white/5 rounded-xl border border-white/10">
          {[
            { id: 'documents', label: 'Documenten', icon: <FolderOpen size={16} /> },
            { id: 'calculator', label: 'Calculator', icon: <Calculator size={16} /> },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setViewMode(mode.id as typeof viewMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                viewMode === mode.id
                  ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
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
        <h1 className="text-xl font-bold text-white">Documenten</h1>
      </motion.div>

      {/* View: Calculator (P1.4) */}
      <AnimatePresence mode="wait">
        {viewMode === 'calculator' && (
          <motion.div
            key="calculator"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <DecisionCalculator 
              currentMortgagePayment={1450}
              currentEnergyBill={180}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* View: Documents (default) */}
      {viewMode === 'documents' && (
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Woningpaspoort Card - Featured */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <GlassCard className="p-5 lg:p-6 h-full" variant="success" tilt glow>
            <div className="flex items-start gap-4 mb-5">
              <div className="w-14 h-14 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Home size={28} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-xl text-white">Woningpaspoort</h3>
                  <span className="px-2.5 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center gap-1">
                    <CheckCircle2 size={10} /> GECERTIFICEERD
                  </span>
                </div>
                <p className="text-sm text-emerald-300/60 mt-1">Bureau Broersma • WP-2024-8847</p>
              </div>
            </div>

            {/* Energy Label Section */}
            <div className="flex items-center gap-5 p-4 bg-white/5 rounded-xl border border-white/5 mb-5">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <span className="text-3xl font-black text-white">{energyLabel}</span>
              </div>
              <div className="flex-1">
                <div className="text-base font-semibold text-white mb-2">
                  {preferences.config.energyLevel === 'positive' ? 'Energieleverend' :
                   preferences.config.energyLevel === 'neutral' ? 'Energieneutraal' : 'Energiezuinig'}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <div className="text-xs text-white/40">Rc-waarde</div>
                    <div className="text-sm font-mono text-emerald-400 mt-0.5">8.0</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-white/40">Qv10</div>
                    <div className="text-sm font-mono text-blue-400 mt-0.5">0.4</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-white/40">TO</div>
                    <div className="text-sm font-mono text-amber-400 mt-0.5">≤ 0.45</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            {energyOpt && (
              <div className="flex flex-wrap gap-2 mb-5">
                {energyOpt.features.map((feature, i) => (
                  <motion.span 
                    key={i} 
                    className="px-3 py-1.5 bg-emerald-500/15 text-emerald-300 text-xs rounded-lg border border-emerald-500/25 flex items-center gap-1.5"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                  >
                    <Zap size={12} />
                    {feature}
                  </motion.span>
                ))}
              </div>
            )}

            <MagneticButton variant="success" fullWidth icon={<Download size={18} />}>
              Download Woningpaspoort
            </MagneticButton>
          </GlassCard>
        </motion.div>

        {/* Specs Card */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <GlassCard className="p-5 h-full" tilt>
            <GlassCardHeader 
              title="Specificaties" 
              icon={<Shield size={18} className="text-blue-400" />}
            />
            
            <div className="space-y-4 mt-4">
              {[
                { label: 'Oppervlakte', value: `${preferences.config.sqm} m²`, icon: '📐' },
                { label: 'Slaapkamers', value: preferences.household.bedrooms.toString(), icon: '🛏️' },
                { label: 'Materiaal', value: preferences.config.material === 'wood' ? 'Hout (CLT)' : preferences.config.material === 'brick' ? 'Baksteen' : 'Beton', icon: '🏗️' },
                { label: 'Energielabel', value: energyLabel, icon: '⚡' },
                { label: 'Huishouden', value: preferences.household.type === 'family' ? 'Gezin' : preferences.household.type === 'couple' ? 'Stel' : 'Anders', icon: '🏠' },
              ].map((spec, i) => (
                <motion.div 
                  key={spec.label}
                  className="flex items-center justify-between p-2 rounded-lg"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{spec.icon}</span>
                    <span className="text-sm text-white/50">{spec.label}</span>
                  </div>
                  <span className="font-mono text-sm text-white">{spec.value}</span>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Documents List */}
        <motion.div variants={itemVariants} className="lg:col-span-3">
          <GlassCard className="overflow-hidden">
            <div className="p-4 lg:p-5 border-b border-white/5 flex items-center justify-between">
              <GlassCardHeader 
                title="Alle documenten" 
                subtitle={`${documents.length} bestanden`}
                icon={<FileText size={18} className="text-purple-400" />}
              />
              <MagneticButton variant="ghost" size="sm" icon={<Download size={14} />}>
                Download alles
              </MagneticButton>
            </div>
            
            {/* Desktop Table View */}
            <div className="hidden lg:block">
              <div className="grid grid-cols-12 gap-4 px-5 py-3 text-xs text-white/40 border-b border-white/5">
                <div className="col-span-5">Naam</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Datum</div>
                <div className="col-span-2">Grootte</div>
                <div className="col-span-1"></div>
              </div>
              {documents.map((doc, i) => (
                <motion.div
                  key={doc.name}
                  className="grid grid-cols-12 gap-4 px-5 py-4 items-center cursor-pointer border-b border-white/5 last:border-0"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                >
                  <div className="col-span-5 flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center">
                      <FileText size={18} className="text-white/40" />
                    </div>
                    <span className="text-sm text-white truncate">{doc.name}</span>
                  </div>
                  <div className="col-span-2">
                    {doc.verified ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-lg">
                        <CheckCircle2 size={12} /> Geverifieerd
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-lg">
                        <Calendar size={12} /> In afwachting
                      </span>
                    )}
                  </div>
                  <div className="col-span-2 text-sm text-white/50">{doc.date}</div>
                  <div className="col-span-2 text-sm font-mono text-white/50">{doc.size}</div>
                  <div className="col-span-1 flex justify-end">
                    <button className="w-8 h-8 rounded-lg flex items-center justify-center">
                      <Download size={16} className="text-white/40" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Mobile List View */}
            <div className="lg:hidden divide-y divide-white/5">
              {documents.map((doc, i) => (
                <motion.div
                  key={doc.name}
                  className="flex items-center gap-3 p-4"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                >
                  <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText size={18} className="text-white/40" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{doc.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-white/40">{doc.date}</span>
                      {doc.verified && <CheckCircle2 size={12} className="text-emerald-400" />}
                    </div>
                  </div>
                  <button className="w-8 h-8 rounded-lg flex items-center justify-center">
                    <Download size={16} className="text-white/40" />
                  </button>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
      )}
    </div>
  );
};

export default DocsTab;
