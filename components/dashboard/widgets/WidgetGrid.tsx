/**
 * WidgetGrid - Smart, Non-Overlapping Widget Grid
 * 
 * Features:
 * - ZERO overlap - strict CSS grid layout
 * - Simple reordering with move up/down buttons
 * - Smooth animations that don't break layout
 * - Responsive: 1 column mobile, 2 columns desktop
 * - Theme-aware styling
 */
import React, { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, X, RotateCcw, ChevronUp, ChevronDown } from 'lucide-react';
import { WidgetGridProps, WidgetId, WidgetSize, WidgetPlacement } from './types';
import { WIDGET_REGISTRY, getWidgetsForViewMode } from './registry';
import { WidgetContainer } from './WidgetContainer';
import { useWidgetLayout } from './useWidgetLayout';
import { useTheme } from '../../../context/ThemeContext';

/**
 * Size selector component
 */
const SizeSelector: React.FC<{
  currentSize: WidgetSize;
  allowedSizes: WidgetSize[];
  onResize: (size: WidgetSize) => void;
}> = ({ currentSize, allowedSizes, onResize }) => {
  if (allowedSizes.length <= 1) return null;
  
  return (
    <div className="flex items-center gap-0.5 bg-black/70 backdrop-blur-md rounded-full p-0.5 shadow-xl border border-white/20">
      {allowedSizes.map(size => (
        <button
          key={size}
          onClick={(e) => {
            e.stopPropagation();
            onResize(size);
          }}
          className={`relative px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
            currentSize === size
              ? 'bg-blue-500 text-white'
              : 'text-white/50 hover:text-white/80 hover:bg-white/10'
          }`}
        >
          {size === 'small' ? 'S' : size === 'medium' ? 'M' : 'L'}
        </button>
      ))}
    </div>
  );
};

export const WidgetGrid: React.FC<WidgetGridProps> = ({
  viewMode,
  widgetProps = {},
  externalEditState,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const {
    layout,
    hiddenWidgets,
    isEditing: internalEditing,
    setIsEditing: setInternalEditing,
    reorderWidgets,
    hideWidget,
    showWidget,
    resizeWidget,
    resetToDefault,
  } = useWidgetLayout(viewMode);
  
  // Use external edit state if provided, otherwise use internal
  const isEditing = externalEditState?.isEditing ?? internalEditing;
  const setIsEditing = externalEditState?.setIsEditing ?? setInternalEditing;
  
  const [showAddSheet, setShowAddSheet] = useState(false);
  
  // Get available widgets for this view mode
  const availableWidgets = getWidgetsForViewMode(viewMode);
  const hiddenAvailable = availableWidgets.filter(w => hiddenWidgets.includes(w.id));
  
  // Move widget up in order
  const moveUp = useCallback((index: number) => {
    if (index <= 0) return;
    const newLayout = [...layout];
    [newLayout[index - 1], newLayout[index]] = [newLayout[index], newLayout[index - 1]];
    reorderWidgets(newLayout);
  }, [layout, reorderWidgets]);
  
  // Move widget down in order
  const moveDown = useCallback((index: number) => {
    if (index >= layout.length - 1) return;
    const newLayout = [...layout];
    [newLayout[index], newLayout[index + 1]] = [newLayout[index + 1], newLayout[index]];
    reorderWidgets(newLayout);
  }, [layout, reorderWidgets]);

  // Handle resize
  const handleResize = useCallback((id: WidgetId, newSize: WidgetSize) => {
    resizeWidget(id, newSize);
  }, [resizeWidget]);
  
  // Filter visible widgets
  const visibleWidgets = layout.filter(placement => {
    const widget = WIDGET_REGISTRY[placement.id];
    if (!widget) return false;
    return widget.visibility === 'both' || widget.visibility === viewMode;
  });

  return (
    <div className="relative">
      {/* Edit Mode Actions (only reset, edit button moved to header) */}
      <AnimatePresence>
        {isEditing && (
          <motion.div 
            className="flex items-center justify-between mb-3 lg:mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onClick={resetToDefault}
              className={`flex items-center gap-1.5 px-3 py-2 border rounded-xl text-xs font-medium transition-all ${
                isDark 
                  ? 'bg-white/5 hover:bg-white/10 border-white/10 text-white/60 hover:text-white/80'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600 hover:text-slate-800'
              }`}
            >
              <RotateCcw size={12} />
              Reset Layout
            </motion.button>
            
            <div className={`text-xs ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
              Versleep widgets om te herschikken
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Widget Grid */}
      <div 
        className={`grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-3 ${isEditing ? 'pt-2' : ''}`}
        style={{ gridAutoRows: 'minmax(min-content, auto)' }}
      >
        <AnimatePresence mode="popLayout">
          {visibleWidgets.map((placement, index) => {
            const widget = WIDGET_REGISTRY[placement.id];
            if (!widget) return null;
            
            const isLarge = placement.size === 'large';
            
            return (
              <motion.div
                key={placement.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`relative ${isLarge ? 'lg:col-span-2' : 'col-span-1'}`}
                style={{ position: 'relative', zIndex: isEditing ? 10 : 1 }}
              >
                {/* Edit Mode Controls */}
                {isEditing && (
                  <div className="absolute -top-1 left-0 right-0 z-20 flex items-center justify-between px-1">
                    {/* Move Buttons */}
                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={() => moveUp(index)}
                        disabled={index === 0}
                        className={`p-1 rounded-md transition-all ${
                          index === 0 
                            ? 'opacity-30 cursor-not-allowed' 
                            : 'bg-black/60 hover:bg-black/80 text-white/70 hover:text-white'
                        }`}
                      >
                        <ChevronUp size={14} />
                      </button>
                      <button
                        onClick={() => moveDown(index)}
                        disabled={index === visibleWidgets.length - 1}
                        className={`p-1 rounded-md transition-all ${
                          index === visibleWidgets.length - 1
                            ? 'opacity-30 cursor-not-allowed' 
                            : 'bg-black/60 hover:bg-black/80 text-white/70 hover:text-white'
                        }`}
                      >
                        <ChevronDown size={14} />
                      </button>
                    </div>
                    
                    {/* Size Selector */}
                    <SizeSelector
                      currentSize={placement.size}
                      allowedSizes={widget.allowedSizes}
                      onResize={(size) => handleResize(placement.id, size)}
                    />
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => hideWidget(placement.id)}
                      className="w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg transition-colors"
                    >
                      <X size={12} className="text-white" strokeWidth={3} />
                    </button>
                  </div>
                )}
                
                {/* Widget Content */}
                <div className={isEditing ? 'mt-6' : ''}>
                  <WidgetContainer
                    widget={widget}
                    isEditing={isEditing}
                    onRemove={() => hideWidget(placement.id)}
                    viewMode={viewMode}
                    additionalProps={{
                      ...widgetProps,
                      size: placement.size,
                    }}
                  />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      
      {/* Add Widget Button */}
      <AnimatePresence>
        {isEditing && hiddenAvailable.length > 0 && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={() => setShowAddSheet(true)}
            className={`w-full mt-3 py-4 border-2 border-dashed rounded-xl flex items-center justify-center gap-2 transition-all ${
              isDark 
                ? 'border-white/20 hover:border-blue-400/50 hover:bg-blue-500/5 text-white/50 hover:text-blue-400'
                : 'border-slate-300 hover:border-sky-400 hover:bg-sky-50 text-slate-400 hover:text-sky-600'
            }`}
          >
            <Plus size={18} />
            <span className="text-xs font-medium">Widget toevoegen ({hiddenAvailable.length})</span>
          </motion.button>
        )}
      </AnimatePresence>
      
      {/* Empty State */}
      {visibleWidgets.length === 0 && (
        <div className="py-12 text-center">
          <div className={`w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center ${
            isDark ? 'bg-white/5' : 'bg-slate-100'
          }`}>
            <Plus size={20} className={isDark ? 'text-white/30' : 'text-slate-400'} />
          </div>
          <p className={`text-sm mb-3 ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
            Geen widgets zichtbaar
          </p>
          <button
            onClick={resetToDefault}
            className={`px-4 py-2 border rounded-lg text-xs transition-colors ${
              isDark 
                ? 'bg-blue-500/20 hover:bg-blue-500/30 border-blue-500/30 text-blue-400'
                : 'bg-sky-100 hover:bg-sky-200 border-sky-200 text-sky-600'
            }`}
          >
            Herstel standaard
          </button>
        </div>
      )}
      
      {/* Add Widget Sheet */}
      <AnimatePresence>
        {showAddSheet && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddSheet(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            />
            
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              className={`fixed bottom-0 left-0 right-0 z-50 border-t rounded-t-2xl max-h-[70vh] overflow-hidden ${
                isDark ? 'bg-[#0d1525] border-white/10' : 'bg-white border-slate-200'
              }`}
            >
              {/* Handle bar */}
              <div className="flex justify-center pt-2 pb-1">
                <div className={`w-8 h-1 rounded-full ${isDark ? 'bg-white/20' : 'bg-slate-300'}`} />
              </div>
              
              <div className="px-4 pb-4 overflow-y-auto max-h-[calc(70vh-50px)]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    Widget toevoegen
                  </h3>
                  <button
                    onClick={() => setShowAddSheet(false)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      isDark ? 'hover:bg-white/10' : 'hover:bg-slate-100'
                    }`}
                  >
                    <X size={16} className={isDark ? 'text-white/60' : 'text-slate-400'} />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {hiddenAvailable.map((widget) => (
                    <button
                      key={widget.id}
                      onClick={() => {
                        showWidget(widget.id);
                        setShowAddSheet(false);
                      }}
                      className={`p-3 border rounded-xl text-left transition-all ${
                        isDark 
                          ? 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-blue-500/30'
                          : 'bg-slate-50 hover:bg-sky-50 border-slate-200 hover:border-sky-300'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${
                        isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-sky-100 text-sky-600'
                      }`}>
                        {widget.icon}
                      </div>
                      <h4 className={`font-medium text-xs ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        {widget.title}
                      </h4>
                      <p className={`text-[10px] mt-0.5 line-clamp-2 ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                        {widget.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WidgetGrid;
