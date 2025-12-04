/**
 * DocumentsWidget - Recent documents list (customer only)
 * Adaptive to widget size
 */
import React from 'react';
import { FolderOpen, FileText } from 'lucide-react';
import { WidgetComponentProps, WidgetSize } from '../types';
import { GlassCard } from '../../GlassCard';
import { useTheme } from '../../../../context/ThemeContext';

interface DocumentsWidgetProps extends WidgetComponentProps {
  size?: WidgetSize;
}

const recentDocs = [
  { name: 'Constructieberekening.pdf', date: 'Vandaag', type: 'pdf' },
  { name: 'Wkb-rapport fase 2.pdf', date: 'Gisteren', type: 'pdf' },
  { name: 'Factuur materialen.pdf', date: '28 nov', type: 'invoice' },
];

export const DocumentsWidget: React.FC<DocumentsWidgetProps> = ({
  viewMode,
  isEditing,
  size = 'medium',
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isSmall = size === 'small';
  const docsToShow = isSmall ? recentDocs.slice(0, 2) : recentDocs;

  return (
    <GlassCard className={isSmall ? "p-3" : "p-4"}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FolderOpen size={isSmall ? 14 : 16} className={isDark ? "text-purple-400" : "text-purple-500"} />
          <span className={`font-semibold ${isSmall ? 'text-xs' : 'text-sm'} ${isDark ? 'text-white' : 'text-slate-800'}`}>
            {isSmall ? 'Docs' : 'Recente documenten'}
          </span>
        </div>
        <button className={`text-xs font-medium ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-sky-600 hover:text-sky-500'}`}>
          Alle →
        </button>
      </div>
      <div className="space-y-2">
        {docsToShow.map((doc, i) => (
          <button 
            key={i}
            className={`w-full flex items-center gap-2 rounded-lg transition-colors text-left ${
              isDark 
                ? 'bg-white/5 hover:bg-white/10' 
                : 'bg-slate-50 hover:bg-slate-100'
            } ${isSmall ? 'p-2' : 'p-2.5'}`}
          >
            <FileText size={isSmall ? 14 : 16} className={isDark ? "text-white/50" : "text-slate-400"} />
            <span className={`truncate flex-1 ${isSmall ? 'text-xs' : 'text-sm'} ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
              {doc.name}
            </span>
            {!isSmall && (
              <span className={`text-xs ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                {doc.date}
              </span>
            )}
          </button>
        ))}
      </div>
    </GlassCard>
  );
};

export default DocumentsWidget;
