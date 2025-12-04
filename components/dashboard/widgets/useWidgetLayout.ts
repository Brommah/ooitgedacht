/**
 * useWidgetLayout - Hook for managing widget layout state
 * 
 * Features:
 * - Saves/loads from localStorage
 * - Separate layouts for customer vs builder view
 * - Reorder, show/hide, resize, and reset functionality
 * - 2D grid support with widget sizes
 */
import { useState, useEffect, useCallback } from 'react';
import { 
  WidgetId, 
  WidgetSize,
  WidgetPlacement,
  UseWidgetLayoutReturn, 
  SerializedWidgetLayoutState,
  WIDGET_LAYOUT_STORAGE_KEY,
  WIDGET_LAYOUT_VERSION,
} from './types';
import { 
  DEFAULT_CUSTOMER_ORDER, 
  DEFAULT_BUILDER_ORDER, 
  getWidgetsForViewMode,
  WIDGET_REGISTRY,
} from './registry';

/**
 * Create default layout state
 */
const createDefaultLayoutState = (): SerializedWidgetLayoutState => ({
  customer: {
    order: DEFAULT_CUSTOMER_ORDER.map(p => ({ id: p.id, size: p.size })),
    hidden: [],
  },
  builder: {
    order: DEFAULT_BUILDER_ORDER.map(p => ({ id: p.id, size: p.size })),
    hidden: [],
  },
  version: WIDGET_LAYOUT_VERSION,
});

/**
 * Load layout from localStorage
 */
const loadLayoutFromStorage = (): SerializedWidgetLayoutState => {
  try {
    const stored = localStorage.getItem(WIDGET_LAYOUT_STORAGE_KEY);
    if (!stored) {
      return createDefaultLayoutState();
    }
    
    const parsed = JSON.parse(stored) as SerializedWidgetLayoutState;
    
    // Check version for potential migrations
    if (parsed.version !== WIDGET_LAYOUT_VERSION) {
      // Future: handle migrations here
      return createDefaultLayoutState();
    }
    
    // Migrate old format (array of strings) to new format (array of objects)
    const migrateOrder = (order: unknown[]): { id: string; size: string }[] => {
      return order.map(item => {
        if (typeof item === 'string') {
          // Old format - get default size from registry
          const widget = WIDGET_REGISTRY[item as WidgetId];
          return { id: item, size: widget?.defaultSize || 'medium' };
        }
        return item as { id: string; size: string };
      });
    };
    
    return {
      ...parsed,
      customer: {
        ...parsed.customer,
        order: migrateOrder(parsed.customer.order),
      },
      builder: {
        ...parsed.builder,
        order: migrateOrder(parsed.builder.order),
      },
    };
  } catch {
    return createDefaultLayoutState();
  }
};

/**
 * Save layout to localStorage
 */
const saveLayoutToStorage = (state: SerializedWidgetLayoutState): void => {
  try {
    localStorage.setItem(WIDGET_LAYOUT_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('Failed to save widget layout to localStorage:', error);
  }
};

/**
 * Hook for managing widget layout
 */
export const useWidgetLayout = (viewMode: 'customer' | 'builder'): UseWidgetLayoutReturn => {
  const [layoutState, setLayoutState] = useState<SerializedWidgetLayoutState>(createDefaultLayoutState);
  const [isEditing, setIsEditing] = useState(false);
  
  // Load from localStorage on mount
  useEffect(() => {
    const loaded = loadLayoutFromStorage();
    setLayoutState(loaded);
  }, []);
  
  // Save to localStorage whenever state changes
  useEffect(() => {
    saveLayoutToStorage(layoutState);
  }, [layoutState]);
  
  // Get current view's layout
  const currentLayout = layoutState[viewMode];
  const layout: WidgetPlacement[] = currentLayout.order.map(item => ({
    id: item.id as WidgetId,
    size: item.size as WidgetSize,
  }));
  const hiddenWidgets = currentLayout.hidden as WidgetId[];
  
  /**
   * Reorder widgets after drag-and-drop
   */
  const reorderWidgets = useCallback((newOrder: WidgetPlacement[]) => {
    setLayoutState(prev => ({
      ...prev,
      [viewMode]: {
        ...prev[viewMode],
        order: newOrder.map(p => ({ id: p.id, size: p.size })),
      },
    }));
  }, [viewMode]);
  
  /**
   * Hide a widget
   */
  const hideWidget = useCallback((id: WidgetId) => {
    setLayoutState(prev => {
      const current = prev[viewMode];
      return {
        ...prev,
        [viewMode]: {
          order: current.order.filter(p => p.id !== id),
          hidden: [...current.hidden, id],
        },
      };
    });
  }, [viewMode]);
  
  /**
   * Show a hidden widget (add to end of order)
   */
  const showWidget = useCallback((id: WidgetId) => {
    setLayoutState(prev => {
      const current = prev[viewMode];
      const widget = WIDGET_REGISTRY[id];
      return {
        ...prev,
        [viewMode]: {
          order: [...current.order, { id, size: widget?.defaultSize || 'medium' }],
          hidden: current.hidden.filter(wId => wId !== id),
        },
      };
    });
  }, [viewMode]);
  
  /**
   * Resize a widget
   */
  const resizeWidget = useCallback((id: WidgetId, size: WidgetSize) => {
    setLayoutState(prev => {
      const current = prev[viewMode];
      return {
        ...prev,
        [viewMode]: {
          ...current,
          order: current.order.map(p => 
            p.id === id ? { ...p, size } : p
          ),
        },
      };
    });
  }, [viewMode]);
  
  /**
   * Reset to default layout for current view mode
   */
  const resetToDefault = useCallback(() => {
    const defaultOrder = viewMode === 'customer' ? DEFAULT_CUSTOMER_ORDER : DEFAULT_BUILDER_ORDER;
    setLayoutState(prev => ({
      ...prev,
      [viewMode]: {
        order: defaultOrder.map(p => ({ id: p.id, size: p.size })),
        hidden: [],
      },
    }));
  }, [viewMode]);
  
  /**
   * Get available widgets for current view mode
   */
  const availableWidgets = getWidgetsForViewMode(viewMode);
  
  return {
    layout,
    hiddenWidgets,
    isEditing,
    setIsEditing,
    reorderWidgets,
    hideWidget,
    showWidget,
    resizeWidget,
    resetToDefault,
    availableWidgets,
  };
};

export default useWidgetLayout;
