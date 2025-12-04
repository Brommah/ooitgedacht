import React from 'react';

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: 'blue' | 'emerald' | 'amber';
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon, color }) => {
  const colors = {
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
  };
  
  return (
    <div className={`${colors[color]} border rounded-2xl p-4`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs text-white/50">{label}</span>
      </div>
      <div className="text-xl font-mono font-bold text-white">{value}</div>
    </div>
  );
};




