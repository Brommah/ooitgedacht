// Dashboard - Main Component
export { Dashboard } from './Dashboard';

// Dashboard Components - Next-Gen UI Library
export { GlassCard, GlassCardHeader } from './GlassCard';
export { BentoGrid, BentoItem, StaggeredGrid, containerVariants, itemVariants } from './BentoGrid';
export { AnimatedCounter, AnimatedPercentage, SparklineChart } from './AnimatedCounter';
export { DonutChart, TimelineChart, MilestonePath, BudgetBreakdown } from './ProgressChart';
export { MagneticButton, ShimmerEffect, PulseRing, FloatingActionButton } from './MagneticButton';

// P0 & P1 Feature Components
export { FinancialPanel } from './FinancialPanel';
export { WkbComplianceBadge } from './WkbComplianceBadge';
export { WhatsNextCard } from './WhatsNextCard';
export { CustomerActionsCard } from './CustomerActionsCard';
export { ActionPopup, ACTION_CONFIGS } from './ActionPopup';
export { ViewModeToggle } from './ViewModeToggle';
export { TaskManager } from './TaskManager';
export { WoningpaspoortPreview } from './WoningpaspoortPreview';
export { DecisionCalculator } from './DecisionCalculator';

// Role-specific Components
export { ProjectStatusHeader } from './ProjectStatusHeader';
export { CustomerBudgetWidget, BuilderFinancialsWidget } from './BudgetWidgets';
export { DesktopSidebar } from './DesktopSidebar';
export { MobileHeader } from './MobileHeader';
export { DashboardHeader } from './DashboardHeader';
export { InteractiveTimeline } from './InteractiveTimeline';
export { NotificationsBanner } from './NotificationsBanner';
export { Portal } from './Portal';

// Types
export type { 
  ViewMode, 
  CustomerAction, 
  CustomerActionType,
  CustomerProfile,
  BuilderProfile,
  CustomerBudget,
  BuilderBudget,
  WkbComplianceData,
  ProjectStatus,
} from './types';

// Default Data
export { 
  DEFAULT_CUSTOMER_PROFILE,
  DEFAULT_BUILDER_PROFILE,
  DEFAULT_CUSTOMER_BUDGET,
  DEFAULT_BUILDER_BUDGET,
  DEFAULT_WKB_COMPLIANCE,
  DEFAULT_PROJECT_STATUS,
} from './types';

// Tab Components
export { OverviewTab } from './tabs/OverviewTab';
export { PhasesTab } from './tabs/PhasesTab';
export { DocsTab } from './tabs/DocsTab';
export { ChatTab } from './tabs/ChatTab';

// Shared Components
export { StatCard } from './shared/StatCard';
export { ActivityItem } from './shared/ActivityItem';
export { DocItem } from './shared/DocItem';
export { TabButton } from './shared/TabButton';

// Widget System - Apple-style configurable widgets
export {
  WidgetGrid,
  WidgetContainer,
  useWidgetLayout,
  WIDGET_REGISTRY,
  DEFAULT_CUSTOMER_ORDER,
  DEFAULT_BUILDER_ORDER,
  getWidgetsForViewMode,
  getDefaultOrder,
  WIDGET_LAYOUT_STORAGE_KEY,
  WIDGET_LAYOUT_VERSION,
} from './widgets';

export type {
  WidgetId,
  WidgetVisibility,
  WidgetConfig,
  WidgetComponentProps,
  ViewModeLayout,
  WidgetLayoutState,
  SerializedWidgetLayoutState,
  WidgetContainerProps,
  WidgetGridProps,
  UseWidgetLayoutReturn,
  ExternalEditState,
} from './widgets';
