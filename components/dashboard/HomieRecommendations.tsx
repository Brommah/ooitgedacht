/**
 * HomieRecommendations - Personalized AI suggestions for the dashboard
 * Shows contextual tips, savings opportunities, and smart recommendations
 */
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, PiggyBank, Lightbulb, 
  TrendingUp, Shield, Leaf, ChevronRight, Star
} from 'lucide-react';
import { GlassCard } from './GlassCard';
import { ViewMode } from './types';
import { useTheme } from '../../context/ThemeContext';

interface Recommendation {
  id: string;
  type: 'savings' | 'tip' | 'upgrade' | 'insight' | 'eco';
  title: string;
  description: string;
  impact?: string;
  action?: string;
  highlight?: boolean;
}

interface HomieRecommendationsProps {
  viewMode: ViewMode;
  className?: string;
}

const CUSTOMER_RECOMMENDATIONS: Recommendation[] = [
  {
    id: '1',
    type: 'savings',
    title: 'Zonnepanelen deal',
    description: 'Je dak ligt perfect op het zuiden. Met 12 panelen bespaar je €40/maand.',
    impact: '+€480/jaar',
    action: 'Bekijk offerte',
    highlight: true,
  },
  {
    id: '2',
    type: 'tip',
    title: 'Warmtepomp subsidie',
    description: 'Je komt in aanmerking voor €3.000 ISDE-subsidie op je warmtepomp.',
    impact: '€3.000 terug',
    action: 'Check subsidie',
  },
  {
    id: '3',
    type: 'eco',
    title: 'CO₂-besparing',
    description: 'Met jouw configuratie bespaar je 2.4 ton CO₂ per jaar vs. traditionele bouw.',
    impact: '🌱 -2.4 ton/jaar',
  },
  {
    id: '4',
    type: 'insight',
    title: 'Woningwaarde',
    description: 'Energielabel A+ verhoogt je woningwaarde met gemiddeld 4-6%.',
    impact: '+€18.000',
  },
];

const BUILDER_RECOMMENDATIONS: Recommendation[] = [
  {
    id: '1',
    type: 'tip',
    title: 'Materiaal restant',
    description: '20m vurenhout over van bekisting - gebruik voor stelprofielen.',
    impact: '€340 bespaard',
    highlight: true,
  },
  {
    id: '2',
    type: 'insight',
    title: 'Planning optimalisatie',
    description: 'Verplaats storten naar do: betere droging + €200 besparing op verwarming.',
    impact: '+€200',
    action: 'Planning aanpassen',
  },
  {
    id: '3',
    type: 'tip',
    title: 'Bulk korting',
    description: 'Bestel isolatie samen met project Ermelo-Zuid voor 8% korting.',
    impact: '-8% kosten',
  },
  {
    id: '4',
    type: 'eco',
    title: 'Duurzaam materiaal',
    description: 'FSC-hout beschikbaar bij leverancier voor zelfde prijs.',
    impact: '🌱 CO₂ neutraal',
  },
];

export const HomieRecommendations: React.FC<HomieRecommendationsProps> = ({
  viewMode,
  className = '',
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const recommendations = viewMode === 'customer' 
    ? CUSTOMER_RECOMMENDATIONS 
    : BUILDER_RECOMMENDATIONS;

  const getIcon = (type: Recommendation['type'], size = 16) => {
    switch (type) {
      case 'savings': return <PiggyBank size={size} />;
      case 'tip': return <Lightbulb size={size} />;
      case 'upgrade': return <TrendingUp size={size} />;
      case 'insight': return <Star size={size} />;
      case 'eco': return <Leaf size={size} />;
    }
  };

  const getIconColor = (type: Recommendation['type']) => {
    if (isDark) {
      switch (type) {
        case 'savings': return 'text-emerald-400 bg-emerald-500/20';
        case 'tip': return 'text-amber-400 bg-amber-500/20';
        case 'upgrade': return 'text-violet-400 bg-violet-500/20';
        case 'insight': return 'text-blue-400 bg-blue-500/20';
        case 'eco': return 'text-green-400 bg-green-500/20';
      }
    } else {
      switch (type) {
        case 'savings': return 'text-emerald-600 bg-emerald-100';
        case 'tip': return 'text-amber-600 bg-amber-100';
        case 'upgrade': return 'text-violet-600 bg-violet-100';
        case 'insight': return 'text-sky-600 bg-sky-100';
        case 'eco': return 'text-green-600 bg-green-100';
      }
    }
  };

  return (
    <GlassCard className={`p-3 lg:p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={14} className={isDark ? 'text-violet-400' : 'text-violet-500'} />
        <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
          Homie tips
        </span>
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-2 gap-2 lg:gap-3">
        {recommendations.slice(0, 4).map((rec, index) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-3 rounded-xl border transition-colors ${
              isDark 
                ? `bg-white/[0.03] border-white/[0.06] ${rec.highlight ? 'border-violet-500/30 bg-violet-500/5' : ''}`
                : `bg-slate-50 border-slate-100 ${rec.highlight ? 'border-violet-200 bg-violet-50' : ''}`
            }`}
          >
            <div className="flex items-start gap-2 mb-2">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${getIconColor(rec.type)}`}>
                {getIcon(rec.type, 14)}
              </div>
              {rec.impact && (
                <span className={`ml-auto text-xs font-bold ${
                  rec.impact.includes('+') || rec.impact.includes('€') 
                    ? isDark ? 'text-emerald-400' : 'text-emerald-600'
                    : rec.impact.includes('-') 
                      ? isDark ? 'text-sky-400' : 'text-sky-600'
                      : isDark ? 'text-white/60' : 'text-slate-500'
                }`}>
                  {rec.impact}
                </span>
              )}
            </div>
            
            <h4 className={`text-sm font-semibold mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              {rec.title}
            </h4>
            <p className={`text-xs leading-relaxed line-clamp-2 ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
              {rec.description}
            </p>
            
            {rec.action && (
              <button className={`mt-2 text-xs font-medium flex items-center gap-1 ${
                isDark ? 'text-violet-400 hover:text-violet-300' : 'text-violet-600 hover:text-violet-500'
              }`}>
                {rec.action} <ChevronRight size={12} />
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
};

export default HomieRecommendations;
