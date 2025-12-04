/**
 * TimelineWidget - Interactive project timeline with clickable milestones
 */
import React from 'react';
import { GlassCard } from '../../GlassCard';
import { InteractiveTimeline } from '../../InteractiveTimeline';
import { WidgetComponentProps } from '../types';

export const TimelineWidget: React.FC<WidgetComponentProps> = ({
  viewMode,
  isEditing,
}) => {
  return (
    <GlassCard className="p-4 h-full">
      <InteractiveTimeline />
    </GlassCard>
  );
};

export default TimelineWidget;




