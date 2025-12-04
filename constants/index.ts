/**
 * Constants Index
 * Re-exports all domain-specific constants for backward compatibility
 */

// Moodboard
export { MOOD_IMAGES } from './moodboard';

// Sizing
export { SIZE_OPTIONS, BUDGET_LEVELS, getSqmFromSize } from './sizing';
export type { SizeOption } from './sizing';

// Materials
export { MATERIAL_OPTIONS } from './materials';
export type { MaterialOption } from './materials';

// Energy
export { ENERGY_OPTIONS } from './energy';
export type { EnergyOption } from './energy';

// Extras
export { EXTRA_OPTIONS, EXTRAS_BY_CATEGORY } from './extras';
export type { ExtraOption } from './extras';

// Household
export { HOUSEHOLD_OPTIONS } from './household';
export type { HouseholdOption } from './household';

// Roof & Vibe
export { ROOF_OPTIONS, getVibePromptHint } from './roof';
export type { RoofOption } from './roof';

// Locations
export { POPULAR_LOCATIONS, estimateLandCost } from './locations';
export type { LocationOption } from './locations';

// Costs
export { BASE_BUILD_COST_PER_SQM, calculateBuildCost, formatCurrency } from './costs';

// App constants
export { APP_NAME, CURRENCY_SYMBOL, WIZARD_STORAGE_KEY, LANGUAGE_STORAGE_KEY, API_TIMEOUT, IMAGE_GENERATION_TIMEOUT } from './app';

// Re-export milestones if they exist
export * from './milestones';




