/**
 * WidgetContainer - Clean widget wrapper
 * 
 * Simplified design without animations that can cause overlap
 */
import React from 'react';
import { motion } from 'framer-motion';
import { WidgetContainerProps } from './types';

export const WidgetContainer: React.FC<WidgetContainerProps> = ({
  widget,
  isEditing,
  onRemove,
  viewMode,
  additionalProps = {},
}) => {
  const WidgetComponent = widget.component;
  
  return (
    <motion.div
      className={`relative h-full transition-all duration-200 ${
        isEditing 
          ? 'ring-2 ring-blue-500/30 ring-offset-2 ring-offset-[#0a1628] rounded-2xl' 
          : ''
      }`}
      animate={{
        scale: isEditing ? 0.98 : 1,
      }}
      transition={{ duration: 0.2 }}
    >
      {/* Widget Content */}
      <div className={`h-full ${isEditing ? 'pointer-events-none select-none opacity-90' : ''}`}>
        <WidgetComponent 
          viewMode={viewMode} 
          isEditing={isEditing}
          {...additionalProps}
        />
      </div>
    </motion.div>
  );
};

export default WidgetContainer;
