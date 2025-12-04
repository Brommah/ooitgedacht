import { UserPreferences } from '../../types';
import { ENERGY_OPTIONS } from '../../constants';
import { MilestoneTask } from '../../constants/milestones';

export type TabType = 'overview' | 'passport' | 'docs' | 'chat';

/**
 * View mode for dashboard - determines which actions/tasks are shown
 * - 'customer': Shows decisions, approvals, milestones relevant to homeowner
 * - 'builder': Shows Wkb tasks, photo uploads, inspections for contractor
 */
export type ViewMode = 'customer' | 'builder';

/**
 * Role-specific user profiles
 */
export interface CustomerProfile {
  name: string;
  firstName: string;
  initials: string;
  role: 'Toekomstig Bewoner' | 'Eigenaar' | 'Opdrachtgever';
  avatar?: string;
}

export interface BuilderProfile {
  name: string;
  firstName: string;
  initials: string;
  role: 'Hoofdaannemer' | 'Uitvoerder' | 'Projectleider';
  companyName: string;
  companyLogo?: string;
  avatar?: string;
}

/**
 * Navigation items differ by role
 */
export interface NavItem {
  id: TabType | string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}

/**
 * Budget data structures - same data, different framing
 */
export interface CustomerBudget {
  totalInvestment: number;
  paidToDate: number;
  remaining: number;
  nextPayment: {
    amount: number;
    trigger: string; // e.g., "Na goedkeuring fundering"
  };
}

export interface BuilderBudget {
  contractValue: number;
  invoiced: number;
  pendingRelease: number;
  nextTranche: {
    amount: number;
    unlockAction: string; // e.g., "Foto verificatie fundering"
  };
}

/**
 * Wkb Compliance data for builders
 */
export interface WkbComplianceData {
  totalPoints: number;
  collected: number;
  pending: number;
  rejected: number;
  criticalMissing: string[];
  nextInspection?: string;
}

/**
 * Project status for compact header
 */
export interface ProjectStatus {
  projectId: string;
  address: string;
  phase: string;
  phaseNumber: number;
  totalPhases: number;
  status: 'planning' | 'in_progress' | 'inspection' | 'completed';
  expectedCompletion: string;
}

export interface DashboardProps {
  preferences: UserPreferences;
  image: string;
}

export interface OverallProgress {
  percentage: number;
  completed: number;
  total: number;
}

export interface OverviewTabProps {
  image: string;
  projectName: string;
  preferences: UserPreferences;
  energyLabel: string;
  overallProgress: OverallProgress;
  buildCost: number;
  energyOpt?: typeof ENERGY_OPTIONS[0];
  viewMode: ViewMode;
}

/**
 * Customer action types for the CustomerActionsCard
 */
export type CustomerActionType = 'decision' | 'approval' | 'milestone' | 'info';

export interface CustomerAction {
  id: string;
  type: CustomerActionType;
  title: string;
  description: string;
  deadline?: string;
  urgency: 'critical' | 'high' | 'medium' | 'low';
  category?: string;
  /** Optional metadata for specific action types */
  meta?: {
    options?: string[];        // For decisions: available choices
    milestone?: string;        // For milestones: phase name
    requiresSignature?: boolean; // For approvals
  };
}

export interface CustomerActionsCardProps {
  className?: string;
  actions?: CustomerAction[];
  onActionClick?: (action: CustomerAction) => void;
}

export interface ViewModeToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  className?: string;
}

export interface PhasesTabProps {
  expandedPhase: string;
  setExpandedPhase: (id: string) => void;
  selectedTask: MilestoneTask | null;
  setSelectedTask: (task: MilestoneTask | null) => void;
  overallProgress: OverallProgress;
}

export interface DocsTabProps {
  preferences: UserPreferences;
  energyLabel: string;
  energyOpt: typeof ENERGY_OPTIONS[0] | undefined;
}

/**
 * Props for role-specific components
 */
export interface ProjectStatusHeaderProps {
  viewMode: ViewMode;
  projectName: string;
  projectStatus: ProjectStatus;
  overallProgress: OverallProgress;
  customerProfile?: CustomerProfile;
  builderProfile?: BuilderProfile;
}

export interface RoleSidebarProps {
  viewMode: ViewMode;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  projectName: string;
  projectStatus: ProjectStatus;
  overallProgress: OverallProgress;
  customerProfile?: CustomerProfile;
  builderProfile?: BuilderProfile;
  onViewModeChange: (mode: ViewMode) => void;
}

export interface CustomerBudgetWidgetProps {
  budget?: CustomerBudget;
  className?: string;
}

export interface BuilderFinancialsWidgetProps {
  budget?: BuilderBudget;
  wkbCompliance?: WkbComplianceData;
  className?: string;
}

/**
 * Default mock data for demo
 */
export const DEFAULT_CUSTOMER_PROFILE: CustomerProfile = {
  name: 'Jan de Vries',
  firstName: 'Jan',
  initials: 'JD',
  role: 'Toekomstig Bewoner',
};

export const DEFAULT_BUILDER_PROFILE: BuilderProfile = {
  name: 'Pieter van der Berg',
  firstName: 'Pieter',
  initials: 'PB',
  role: 'Hoofdaannemer',
  companyName: 'Van der Berg Bouw',
};

export const DEFAULT_CUSTOMER_BUDGET: CustomerBudget = {
  totalInvestment: 340000,
  paidToDate: 120000,
  remaining: 220000,
  nextPayment: {
    amount: 35000,
    trigger: 'Na goedkeuring fundering',
  },
};

export const DEFAULT_BUILDER_BUDGET: BuilderBudget = {
  contractValue: 340000,
  invoiced: 120000,
  pendingRelease: 220000,
  nextTranche: {
    amount: 15000,
    unlockAction: 'Upload foto storten fundering',
  },
};

export const DEFAULT_WKB_COMPLIANCE: WkbComplianceData = {
  totalPoints: 24,
  collected: 12,
  pending: 8,
  rejected: 1,
  criticalMissing: [
    'Foto storten fundering',
    'Wapeningskeuring rapport',
  ],
  nextInspection: '15 december 2024',
};

export const DEFAULT_PROJECT_STATUS: ProjectStatus = {
  projectId: '2024-087',
  address: 'Veluwse Heide, Ermelo',
  phase: 'Fundering',
  phaseNumber: 2,
  totalPhases: 5,
  status: 'in_progress',
  expectedCompletion: 'Juni 2025',
};

