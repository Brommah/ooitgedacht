/**
 * Widget Registry
 * 
 * Defines all available widgets and their configurations.
 * Each widget has a unique ID, title, visibility rules, and component.
 */
import React from 'react';
import { 
  Home, 
  CheckSquare, 
  Euro, 
  FolderOpen, 
  Sparkles, 
  CloudRain,
  Bot,
  Clock,
} from 'lucide-react';
import { WidgetConfig, WidgetId, WidgetPlacement } from './types';

// Import widget components
import { ProjectStatusWidget } from './components/ProjectStatusWidget';
import { ActionsWidget } from './components/ActionsWidget';
import { BudgetWidget } from './components/BudgetWidget';
import { DocumentsWidget } from './components/DocumentsWidget';
import { OpportunitiesWidget } from './components/OpportunitiesWidget';
import { WeatherAlertWidget } from './components/WeatherAlertWidget';
import { HomieWidget } from './components/HomieWidget';
import { TimelineWidget } from './components/TimelineWidget';

/**
 * All available widgets
 */
export const WIDGET_REGISTRY: Record<WidgetId, WidgetConfig> = {
  'project-status': {
    id: 'project-status',
    title: 'Project Status',
    description: 'Je project thumbnail en voortgang',
    icon: React.createElement(Home, { size: 16 }),
    visibility: 'both',
    component: ProjectStatusWidget,
    defaultEnabled: true,
    defaultSize: 'large',
    allowedSizes: ['medium', 'large'],
  },
  // Weather alerts are now shown in the fixed NotificationsBanner at top of dashboard
  // Keeping widget for backward compatibility but disabled by default
  'weather-alert': {
    id: 'weather-alert',
    title: 'Weerwaarschuwing',
    description: 'Weersbericht en bouwgerelateerde waarschuwingen',
    icon: React.createElement(CloudRain, { size: 16 }),
    visibility: 'builder',
    component: WeatherAlertWidget,
    defaultEnabled: false, // Disabled - now shown in NotificationsBanner
    defaultSize: 'large',
    allowedSizes: ['medium', 'large'],
  },
  'actions': {
    id: 'actions',
    title: 'Acties',
    description: 'Je volgende stappen en taken',
    icon: React.createElement(CheckSquare, { size: 16 }),
    visibility: 'both',
    component: ActionsWidget,
    defaultEnabled: true,
    defaultSize: 'large',
    allowedSizes: ['medium', 'large'],
  },
  'homie-recommendations': {
    id: 'homie-recommendations',
    title: 'Homie Tips',
    description: 'AI-gestuurde aanbevelingen',
    icon: React.createElement(Bot, { size: 16 }),
    visibility: 'both',
    component: HomieWidget,
    defaultEnabled: true,
    defaultSize: 'large',
    allowedSizes: ['medium', 'large'],
  },
  'budget': {
    id: 'budget',
    title: 'Budget',
    description: 'Financieel overzicht en kostenverdeling',
    icon: React.createElement(Euro, { size: 16 }),
    visibility: 'both',
    component: BudgetWidget,
    defaultEnabled: true,
    defaultSize: 'medium',
    allowedSizes: ['small', 'medium', 'large'],
  },
  'documents': {
    id: 'documents',
    title: 'Documenten',
    description: 'Recente documenten en bestanden',
    icon: React.createElement(FolderOpen, { size: 16 }),
    visibility: 'customer',
    component: DocumentsWidget,
    defaultEnabled: true,
    defaultSize: 'medium',
    allowedSizes: ['small', 'medium', 'large'],
  },
  'opportunities': {
    id: 'opportunities',
    title: 'Kansen',
    description: 'Upgrade mogelijkheden en aanbiedingen',
    icon: React.createElement(Sparkles, { size: 16 }),
    visibility: 'customer',
    component: OpportunitiesWidget,
    defaultEnabled: true,
    defaultSize: 'medium',
    allowedSizes: ['small', 'medium', 'large'],
  },
  'timeline': {
    id: 'timeline',
    title: 'Project Timeline',
    description: 'Visuele tijdlijn met bouwfases en mijlpalen',
    icon: React.createElement(Clock, { size: 16 }),
    visibility: 'both',
    component: TimelineWidget,
    defaultEnabled: true,
    defaultSize: 'large',
    allowedSizes: ['large'],
  },
};

/**
 * Default widget order for customer view
 */
export const DEFAULT_CUSTOMER_ORDER: WidgetPlacement[] = [
  { id: 'project-status', size: 'large' },
  { id: 'timeline', size: 'large' },
  { id: 'actions', size: 'large' },
  { id: 'homie-recommendations', size: 'large' },
  { id: 'budget', size: 'medium' },
  { id: 'documents', size: 'medium' },
  { id: 'opportunities', size: 'medium' },
];

/**
 * Default widget order for builder view
 * Note: Weather alerts now shown in fixed NotificationsBanner
 */
export const DEFAULT_BUILDER_ORDER: WidgetPlacement[] = [
  { id: 'project-status', size: 'large' },
  { id: 'timeline', size: 'large' },
  { id: 'actions', size: 'large' },
  { id: 'homie-recommendations', size: 'large' },
  { id: 'budget', size: 'medium' },
];

/**
 * Get widgets available for a specific view mode
 */
export const getWidgetsForViewMode = (viewMode: 'customer' | 'builder'): WidgetConfig[] => {
  return Object.values(WIDGET_REGISTRY).filter(widget => 
    widget.visibility === 'both' || widget.visibility === viewMode
  );
};

/**
 * Get default order for a view mode
 */
export const getDefaultOrder = (viewMode: 'customer' | 'builder'): WidgetPlacement[] => {
  return viewMode === 'customer' ? DEFAULT_CUSTOMER_ORDER : DEFAULT_BUILDER_ORDER;
};

