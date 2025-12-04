import React from 'react';

interface ActivityItemProps {
  icon: React.ReactNode;
  title: string;
  time: string;
  color: 'emerald' | 'blue' | 'amber';
}

export const ActivityItem: React.FC<ActivityItemProps> = ({ icon, title, time, color }) => {
  const colors = {
    emerald: 'bg-emerald-500/20 text-emerald-400',
    blue: 'bg-blue-500/20 text-blue-400',
    amber: 'bg-amber-500/20 text-amber-400',
  };
  
  return (
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors[color]}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white/80 truncate">{title}</p>
        <p className="text-xs text-white/30">{time}</p>
      </div>
    </div>
  );
};




