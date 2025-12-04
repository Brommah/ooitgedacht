/**
 * Widget System Types
 * 
 * Apple-style configurable, draggable widget system
 */
import React from 'react';
import { ViewMode } from '../types';

/**
 * Unique identifier for each widget
 */
export type WidgetId = 
  | 'project-status'
  | 'actions'
  | 'budget'
  | 'documents'
  | 'opportunities'
  | 'weather-alert'
  | 'homie-recommendations'
  | 'timeline';

/**
 * Which roles can see this widget
 */
export type WidgetVisibility = 'customer' | 'builder' | 'both';

/**
 * Widget size options - like iOS widgets
 */
export type WidgetSize = 'small' | 'medium' | 'large';

/**
 * Widget configuration
 */
export interface WidgetConfig {
  id: WidgetId;
  title: string;
  description: string;
  icon: React.ReactNode;
  /** Which view modes can see this widget */
  visibility: WidgetVisibility;
  /** The component to render */
  component: React.ComponentType<WidgetComponentProps>;
  /** Default enabled state */
  defaultEnabled: boolean;
  /** Default size of the widget */
  defaultSize: WidgetSize;
  /** Allowed sizes for this widget */
  allowedSizes: WidgetSize[];
}

/**
 * Props passed to every widget component
 */
export interface WidgetComponentProps {
  viewMode: ViewMode;
  isEditing: boolean;
  // Additional props can be passed through
  [key: string]: unknown;
}

/**
 * Layout state for a single view mode
 */
export interface ViewModeLayout {
  /** Ordered array of visible widget IDs */
  order: WidgetId[];
  /** Set of hidden widget IDs */
  hidden: Set<WidgetId>;
}

/**
 * Widget placement in the grid
 */
export interface WidgetPlacement {
  id: WidgetId;
  size: WidgetSize;
}

/**
 * Complete layout state (stored in localStorage)
 */
export interface WidgetLayoutState {
  customer: {
    order: WidgetPlacement[];
    hidden: WidgetId[];
  };
  builder: {
    order: WidgetPlacement[];
    hidden: WidgetId[];
  };
  version: number; // For future migrations
}

/**
 * Serializable version for localStorage
 */
export interface SerializedWidgetLayoutState {
  customer: {
    order: { id: string; size: string }[];
    hidden: string[];
  };
  builder: {
    order: { id: string; size: string }[];
    hidden: string[];
  };
  version: number;
}

/**
 * Widget container props
 */
export interface WidgetContainerProps {
  widget: WidgetConfig;
  isEditing: boolean;
  onRemove: () => void;
  viewMode: ViewMode;
  additionalProps?: Record<string, unknown>;
}

/**
 * External edit state for controlled mode
 */
export interface ExternalEditState {
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
}

/**
 * Widget grid props
 */
export interface WidgetGridProps {
  viewMode: ViewMode;
  /** Additional props to pass to widgets */
  widgetProps?: Record<string, unknown>;
  /** External edit state for controlled mode (optional) */
  externalEditState?: ExternalEditState;
}

/**
 * Hook return type
 */
export interface UseWidgetLayoutReturn {
  /** Current layout for the active view mode */
  layout: WidgetPlacement[];
  /** Hidden widgets for the active view mode */
  hiddenWidgets: WidgetId[];
  /** Whether edit mode is active */
  isEditing: boolean;
  /** Toggle edit mode */
  setIsEditing: (editing: boolean) => void;
  /** Reorder widgets after drag */
  reorderWidgets: (newOrder: WidgetPlacement[]) => void;
  /** Hide a widget */
  hideWidget: (id: WidgetId) => void;
  /** Show a hidden widget */
  showWidget: (id: WidgetId) => void;
  /** Resize a widget */
  resizeWidget: (id: WidgetId, size: WidgetSize) => void;
  /** Reset to default layout */
  resetToDefault: () => void;
  /** Get all available widgets for current view mode */
  availableWidgets: WidgetConfig[];
}

/**
 * Storage key for localStorage
 */
export const WIDGET_LAYOUT_STORAGE_KEY = 'og-widget-layout';

/**
 * Current schema version for migrations
 */
export const WIDGET_LAYOUT_VERSION = 1;

