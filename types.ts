export enum AppState {
  LANDING = 'LANDING',
  STATE_OF_MARKET = 'STATE_OF_MARKET',
  MARKET_RESEARCH = 'MARKET_RESEARCH',
  B2B_BUILDERS = 'B2B_BUILDERS',
  INVESTOR_PITCH = 'INVESTOR_PITCH',
  
  // Single-screen wizard flow (13 steps)
  WIZARD_STEP_TYPE = 'WIZARD_STEP_TYPE',
  WIZARD_STEP_BEDROOMS = 'WIZARD_STEP_BEDROOMS',
  WIZARD_STEP_BUDGET = 'WIZARD_STEP_BUDGET',
  WIZARD_STEP_TIMELINE = 'WIZARD_STEP_TIMELINE',
  WIZARD_STEP_LOCATION = 'WIZARD_STEP_LOCATION',
  WIZARD_STEP_STYLE = 'WIZARD_STEP_STYLE',
  WIZARD_STEP_SIZE = 'WIZARD_STEP_SIZE',
  WIZARD_STEP_MATERIAL = 'WIZARD_STEP_MATERIAL',
  WIZARD_STEP_ENERGY = 'WIZARD_STEP_ENERGY',
  WIZARD_STEP_EXTRAS_ENERGY = 'WIZARD_STEP_EXTRAS_ENERGY',
  WIZARD_STEP_EXTRAS_OUTDOOR = 'WIZARD_STEP_EXTRAS_OUTDOOR',
  WIZARD_STEP_EXTRAS_COMFORT = 'WIZARD_STEP_EXTRAS_COMFORT',
  WIZARD_STEP_VIBE = 'WIZARD_STEP_VIBE',
  
  GENERATING = 'GENERATING',
  RESULTS_LOCKED = 'RESULTS_LOCKED',
  RESULTS_UNLOCKED = 'RESULTS_UNLOCKED',
  DASHBOARD = 'DASHBOARD',
  // Collaborative Workspace (Construction OS)
  WORKSPACE = 'WORKSPACE',
}

// ============================================
// FSM (Finite State Machine) Types for Workspace
// ============================================

export type TaskStatus = 'locked' | 'active' | 'pending' | 'rejected' | 'verified';

export interface WorkspaceTask {
  id: string;
  title: string;
  description: string;
  assignedRole: 'aannemer' | 'klant' | 'kwaliteitsborger';
  status: TaskStatus;
  artifactType: 'photo' | 'video' | 'document' | 'lidar';
  uploadedAt?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  rejectionReason?: string;
  artifacts?: WorkspaceArtifact[];
  slaHours?: number;
  referenceImageUrl?: string;
}

export interface WorkspaceArtifact {
  id: string;
  type: 'photo' | 'video' | 'document' | 'lidar';
  url: string;
  uploadedAt: string;
  metadata: {
    geoHash?: string;
    deviceId?: string;
    compassDirection?: string;
    gpsAccuracy?: string;
  };
  aiValidation?: {
    confidence: number;
    detected: string[];
    issues: string[];
  };
}

export interface WorkspacePhase {
  id: string;
  name: string;
  icon: string;
  description: string;
  status: TaskStatus;
  progress: number;
  tasks: WorkspaceTask[];
}

export interface WorkspaceProject {
  id: string;
  name: string;
  location: string;
  overallProgress: number;
  currentPhase: string;
  phases: WorkspacePhase[];
  isBlocked: boolean;
  blockReason?: string;
}

// Household types
export type HouseholdType = 'single' | 'couple' | 'family' | 'multi_gen' | 'other';

// Material options
export type MaterialType = 'wood' | 'brick' | 'concrete' | 'mixed';

// Energy levels
export type EnergyLevel = 'standard' | 'aplus' | 'neutral' | 'positive';

// Size categories
export type SizeCategory = 'compact' | 'family' | 'spacious' | 'villa';

// Roof styles (inferred from moodboard)
export type RoofStyle = 'flat' | 'pitched' | 'sedum' | 'mansard' | 'thatched';

// Garden orientation
export type GardenOrientation = 'north' | 'east' | 'south' | 'west' | 'unknown';

// Land ownership status
export type LandStatus = 'yes' | 'searching' | 'undecided';

// Plot size ranges
export type PlotSize = '<300' | '300-500' | '500-1000' | '1000+';

// Timeline options
export type Timeline = 'asap' | 'within_year' | '1-2_years' | 'flexible';

// Financing status
export type FinancingStatus = 'exploring' | 'pre_approved' | 'cash';

// Extra features
export type ExtraFeature = 
  | 'garage' 
  | 'carport'
  | 'solar' 
  | 'ev_charger' 
  | 'pool' 
  | 'office' 
  | 'sedum_roof' 
  | 'rainwater'
  | 'heat_pump'
  | 'battery_storage'
  | 'outdoor_kitchen'
  | 'sauna';

// Comprehensive user profile
export interface UserPreferences {
  // Step 1-2: Household Profile
  household: {
    type: HouseholdType;
    bedrooms: number;
  };
  
  // Step 6: Style (from MoodBoard)
  style: {
    moodBoardSelections: string[];
    inferredRoofStyle: RoofStyle;
    inferredMaterialAffinity: MaterialType;
  };
  
  // Step 7-13: Configuration
  config: {
    size: SizeCategory;
    sqm: number;
    material: MaterialType;
    energyLevel: EnergyLevel;
    extras: ExtraFeature[];
    vibe: number; // 0-100 slider (cold/minimalist to warm/cozy)
  };
  
  // Step 5: Location
  location: {
    searchQuery: string;
    coordinates: { lat: number; lng: number } | null;
  };
  
  // Step 3-4: Budget & Timeline
  budget: {
    total: number;
    timeline: Timeline;
  };
}

// Mood image for swipe cards
export interface MoodImage {
  id: string;
  src: string;
  tag: string;
  description: string;
  category?: 'exterior' | 'roof' | 'material' | 'interior';
  inferredRoof?: RoofStyle;
  inferredMaterial?: MaterialType;
}

// Generated home result
export interface GeneratedHome {
  imageUrl: string;
  estimatedCost: number;
  description: string;
}

// Cost breakdown
export interface CostBreakdown {
  buildCost: number;
  landCost: number;
  permitsCost: number;
  extrasCost: number;
  contingency: number;
  total: number;
}

// Helper to create default preferences
export const createDefaultPreferences = (): UserPreferences => ({
  household: {
    type: 'couple',
    bedrooms: 3,
  },
  style: {
    moodBoardSelections: [],
    inferredRoofStyle: 'pitched',
    inferredMaterialAffinity: 'brick',
  },
  config: {
    size: 'family',
    sqm: 150,
    material: 'brick',
    energyLevel: 'aplus',
    extras: [],
    vibe: 50,
  },
  location: {
    searchQuery: '',
    coordinates: null,
  },
  budget: {
    total: 450000,
    timeline: '1-2_years',
  },
});
