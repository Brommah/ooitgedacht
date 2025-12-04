/**
 * Widget System Exports
 * 
 * Apple-style configurable, draggable widget system
 */

// Types
export type {
  WidgetId,
  WidgetSize,
  WidgetVisibility,
  WidgetConfig,
  WidgetComponentProps,
  WidgetPlacement,
  ViewModeLayout,
  WidgetLayoutState,
  SerializedWidgetLayoutState,
  WidgetContainerProps,
  WidgetGridProps,
  UseWidgetLayoutReturn,
  ExternalEditState,
} from './types';

export {
  WIDGET_LAYOUT_STORAGE_KEY,
  WIDGET_LAYOUT_VERSION,
} from './types';

// Registry
export {
  WIDGET_REGISTRY,
  DEFAULT_CUSTOMER_ORDER,
  DEFAULT_BUILDER_ORDER,
  getWidgetsForViewMode,
  getDefaultOrder,
} from './registry';

// Components
export { WidgetContainer } from './WidgetContainer';
export { WidgetGrid } from './WidgetGrid';

// Hook
export { useWidgetLayout } from './useWidgetLayout';

// Widget Components
export * from './components';

