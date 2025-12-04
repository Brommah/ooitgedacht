/**
 * BudgetWidget - Budget breakdown with donut chart
 * Adaptive to widget size (small, medium, large)
 */
import React from 'react';
import { Euro } from 'lucide-react';
import { WidgetComponentProps, WidgetSize } from '../types';
import { GlassCard } from '../../GlassCard';
import { DonutChart } from '../../ProgressChart';
import { useTheme } from '../../../../context/ThemeContext';

interface BudgetWidgetProps extends WidgetComponentProps {
  buildCost?: number;
  size?: WidgetSize;
}

export const BudgetWidget: React.FC<BudgetWidgetProps> = ({
  viewMode,
  isEditing,
  buildCost = 340000,
  size = 'medium',
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isCustomer = viewMode === 'customer';
  const isSmall = size === 'small';
  const isLarge = size === 'large';
  
  const budgetData = [
    { name: 'Materiaal', value: buildCost * 0.4, color: isDark ? '#3b82f6' : '#0284c7' },
    { name: 'Arbeid', value: buildCost * 0.35, color: isDark ? '#10b981' : '#059669' },
    { name: 'Installaties', value: buildCost * 0.15, color: isDark ? '#8b5cf6' : '#7c3aed' },
    { name: 'Overig', value: buildCost * 0.1, color: isDark ? '#f59e0b' : '#d97706' },
  ];

  // Small size - compact view
  if (isSmall) {
    return (
      <GlassCard className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Euro size={14} className={isCustomer 
              ? isDark ? "text-blue-400" : "text-sky-600"
              : isDark ? "text-amber-400" : "text-amber-600"
            } />
            <span className={`text-xs font-medium ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
              Budget
            </span>
          </div>
          <span className={`text-lg font-bold font-mono ${isDark ? 'text-white' : 'text-slate-800'}`}>
            €{(buildCost / 1000).toFixed(0)}k
          </span>
        </div>
      </GlassCard>
    );
  }

  // Large size - expanded view with more details
  if (isLarge) {
    return (
      <GlassCard className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Euro size={18} className={isCustomer 
              ? isDark ? "text-blue-400" : "text-sky-600"
              : isDark ? "text-amber-400" : "text-amber-600"
            } />
            <span className={`text-base font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
              {isCustomer ? 'Budget Overzicht' : 'Contract Overzicht'}
            </span>
          </div>
          <span className={`text-2xl font-bold font-mono ${isDark ? 'text-white' : 'text-slate-800'}`}>
            €{(buildCost / 1000).toFixed(0)}k
          </span>
        </div>
        <div className="flex items-start gap-6">
          <DonutChart 
            data={budgetData}
            centerValue=""
            centerLabel=""
            size={100}
          />
          <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-2">
            {budgetData.map((item) => (
              <div key={item.name} className={`flex items-center justify-between p-2 rounded-lg ${
                isDark ? 'bg-white/5' : 'bg-slate-50'
              }`}>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className={`text-sm ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
                    {item.name}
                  </span>
                </div>
                <span className={`text-sm font-mono font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  €{(item.value / 1000).toFixed(0)}k
                </span>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
    );
  }

  // Medium size - default view
  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Euro size={16} className={isCustomer 
            ? isDark ? "text-blue-400" : "text-sky-600"
            : isDark ? "text-amber-400" : "text-amber-600"
          } />
          <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
            {isCustomer ? 'Budget' : 'Contract'}
          </span>
        </div>
        <span className={`text-xl font-bold font-mono ${isDark ? 'text-white' : 'text-slate-800'}`}>
          €{(buildCost / 1000).toFixed(0)}k
        </span>
      </div>
      <div className="flex items-center gap-4">
        <DonutChart 
          data={budgetData}
          centerValue=""
          centerLabel=""
          size={80}
        />
        <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-1.5">
          {budgetData.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className={`text-xs ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
                  {item.name}
                </span>
              </div>
              <span className={`text-xs font-mono ${isDark ? 'text-white' : 'text-slate-800'}`}>
                €{(item.value / 1000).toFixed(0)}k
              </span>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
};

export default BudgetWidget;
