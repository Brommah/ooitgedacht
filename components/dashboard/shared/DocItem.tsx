import React from 'react';
import { FileText, CheckCircle2 } from 'lucide-react';

interface DocItemProps {
  name: string;
  verified?: boolean;
  date: string;
}

export const DocItem: React.FC<DocItemProps> = ({ name, verified, date }) => (
  <div className="flex items-center gap-3 px-4 py-3">
    <div className="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center">
      <FileText size={16} className="text-white/40" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm text-white/80 truncate">{name}</p>
      <p className="text-xs text-white/30">{date}</p>
    </div>
    {verified && <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />}
  </div>
);

