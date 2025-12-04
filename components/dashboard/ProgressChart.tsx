import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface DonutChartProps {
  data: { name: string; value: number; color: string }[];
  centerLabel?: string;
  centerValue?: string;
  size?: number;
  className?: string;
}

/**
 * DonutChart - Animated donut/pie chart for budget breakdowns
 */
export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  centerLabel,
  centerValue,
  size = 180,
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <div ref={ref} className={`relative ${className}`} style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={size * 0.35}
            outerRadius={size * 0.45}
            paddingAngle={3}
            dataKey="value"
            animationBegin={0}
            animationDuration={1500}
            animationEasing="ease-out"
            isAnimationActive={isInView}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color}
                style={{
                  filter: `drop-shadow(0 0 8px ${entry.color}40)`,
                }}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      
      {/* Center content */}
      {(centerLabel || centerValue) && (
        <motion.div 
          className="absolute inset-0 flex flex-col items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isInView ? 1 : 0, scale: isInView ? 1 : 0.8 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {centerValue && (
            <span className="text-2xl font-bold text-white font-mono">{centerValue}</span>
          )}
          {centerLabel && (
            <span className="text-xs text-white/50">{centerLabel}</span>
          )}
        </motion.div>
      )}
    </div>
  );
};

interface TimelineChartProps {
  data: { name: string; progress: number; completed?: boolean }[];
  height?: number;
  className?: string;
}

/**
 * TimelineChart - Construction phase timeline visualization
 */
export const TimelineChart: React.FC<TimelineChartProps> = ({
  data,
  height = 60,
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <div ref={ref} className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <defs>
            <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="progress"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#progressGradient)"
            animationBegin={0}
            animationDuration={1500}
            animationEasing="ease-out"
            isAnimationActive={isInView}
          />
          <Tooltip
            contentStyle={{
              background: 'rgba(10, 22, 40, 0.95)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
            }}
            labelStyle={{ color: 'white', fontWeight: 600 }}
            itemStyle={{ color: '#3b82f6' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

interface MilestonePathProps {
  milestones: { id: string; name: string; status: 'completed' | 'active' | 'pending' | 'locked' }[];
  className?: string;
}

/**
 * MilestonePath - Visual milestone tracker with animated connections
 */
export const MilestonePath: React.FC<MilestonePathProps> = ({ milestones, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return { bg: 'bg-emerald-500', ring: 'ring-emerald-500/30', glow: 'shadow-emerald-500/50' };
      case 'active':
        return { bg: 'bg-blue-500', ring: 'ring-blue-500/30', glow: 'shadow-blue-500/50' };
      case 'pending':
        return { bg: 'bg-white/20', ring: 'ring-white/10', glow: '' };
      case 'locked':
        return { bg: 'bg-white/10', ring: 'ring-white/5', glow: '' };
      default:
        return { bg: 'bg-white/10', ring: '', glow: '' };
    }
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Connection line */}
      <div className="absolute top-4 left-4 right-4 h-0.5 bg-white/10">
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-500 via-blue-500 to-white/20"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isInView ? 1 : 0 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          style={{ transformOrigin: 'left' }}
        />
      </div>

      {/* Milestone points */}
      <div className="relative flex justify-between">
        {milestones.map((milestone, index) => {
          const styles = getStatusStyles(milestone.status);
          return (
            <motion.div
              key={milestone.id}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 10 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div
                className={`w-8 h-8 rounded-full ${styles.bg} ring-4 ${styles.ring} flex items-center justify-center shadow-lg ${styles.glow}`}
              >
                {milestone.status === 'completed' && (
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {milestone.status === 'active' && (
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                )}
                {(milestone.status === 'pending' || milestone.status === 'locked') && (
                  <span className="text-xs font-bold text-white/60">{index + 1}</span>
                )}
              </div>
              <span className={`mt-2 text-[10px] font-medium text-center max-w-[60px] ${
                milestone.status === 'completed' || milestone.status === 'active' 
                  ? 'text-white/80' 
                  : 'text-white/40'
              }`}>
                {milestone.name}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * BudgetBreakdown - Horizontal stacked bar for budget allocation
 */
export const BudgetBreakdown: React.FC<{
  segments: { label: string; value: number; color: string }[];
  total: number;
  className?: string;
}> = ({ segments, total, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <div ref={ref} className={className}>
      {/* Bar */}
      <div className="h-3 bg-white/5 rounded-full overflow-hidden flex">
        {segments.map((segment, index) => (
          <motion.div
            key={segment.label}
            className="h-full"
            style={{ backgroundColor: segment.color }}
            initial={{ width: 0 }}
            animate={{ width: isInView ? `${(segment.value / total) * 100}%` : 0 }}
            transition={{ duration: 0.8, delay: index * 0.1, ease: 'easeOut' }}
          />
        ))}
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-3">
        {segments.map((segment) => (
          <div key={segment.label} className="flex items-center gap-1.5">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: segment.color }}
            />
            <span className="text-xs text-white/50">{segment.label}</span>
            <span className="text-xs font-mono text-white/70">
              €{(segment.value / 1000).toFixed(0)}k
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonutChart;




