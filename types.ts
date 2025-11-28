export enum AppState {
  LANDING = 'LANDING',
  STATE_OF_MARKET = 'STATE_OF_MARKET',
  MARKET_RESEARCH = 'MARKET_RESEARCH',
  // New comprehensive wizard flow
  WIZARD_HOUSEHOLD = 'WIZARD_HOUSEHOLD',
  WIZARD_MOODBOARD = 'WIZARD_MOODBOARD',
  WIZARD_PREFERENCES = 'WIZARD_PREFERENCES',
  WIZARD_LOCATION = 'WIZARD_LOCATION',
  WIZARD_BUDGET = 'WIZARD_BUDGET',
  GENERATING = 'GENERATING',
  RESULTS_LOCKED = 'RESULTS_LOCKED',
  RESULTS_UNLOCKED = 'RESULTS_UNLOCKED',
  DASHBOARD = 'DASHBOARD',
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
  // Step 1: Household Profile
  household: {
    type: HouseholdType;
    bedrooms: number;
    workFromHome: boolean;
    pets: boolean;
    accessibility: boolean;
  };
  
  // Step 2: Style (from MoodBoard)
  style: {
    moodBoardSelections: string[];
    inferredRoofStyle: RoofStyle;
    inferredMaterialAffinity: MaterialType;
  };
  
  // Step 3: Configuration
  config: {
    size: SizeCategory;
    sqm: number;
    material: MaterialType;
    energyLevel: EnergyLevel;
    extras: ExtraFeature[];
    vibe: number; // 0-100 slider (cold/minimalist to warm/cozy)
  };
  
  // Step 4: Location & Land
  location: {
    searchQuery: string;
    coordinates: { lat: number; lng: number } | null;
    hasLand: LandStatus;
    plotSize: PlotSize | null;
    gardenOrientation: GardenOrientation;
  };
  
  // Step 5: Budget & Timeline
  budget: {
    total: number;
    timeline: Timeline;
    financingStatus: FinancingStatus;
  };
}

// Legacy interface for backward compatibility (maps to new structure)
export interface LegacyUserPreferences {
  moodBoardSelections: string[];
  vibe: number;
  material: 'wood' | 'brick' | 'concrete' | 'glass';
  budgetLevel: number;
  location: string;
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
    workFromHome: false,
    pets: false,
    accessibility: false,
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
    hasLand: 'searching',
    plotSize: null,
    gardenOrientation: 'unknown',
  },
  budget: {
    total: 450000,
    timeline: '1-2_years',
    financingStatus: 'exploring',
  },
});
