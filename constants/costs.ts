import { MaterialType, EnergyLevel, ExtraFeature } from '../types';
import { MATERIAL_OPTIONS } from './materials';
import { ENERGY_OPTIONS } from './energy';
import { EXTRA_OPTIONS } from './extras';

/**
 * Base build cost per square meter (€/m²)
 */
export const BASE_BUILD_COST_PER_SQM = 2200;

/**
 * Calculate total build cost based on configuration
 */
export const calculateBuildCost = (
  sqm: number,
  material: MaterialType,
  energyLevel: EnergyLevel,
  extras: ExtraFeature[],
  vibe: number
): number => {
  // Base cost
  let cost = sqm * BASE_BUILD_COST_PER_SQM;
  
  // Material modifier
  const materialMod = MATERIAL_OPTIONS.find(m => m.value === material)?.costMod ?? 1;
  cost *= materialMod;
  
  // Energy level addition
  const energyAdd = ENERGY_OPTIONS.find(e => e.value === energyLevel)?.costAdd ?? 0;
  cost += energyAdd;
  
  // Extras
  extras.forEach(extra => {
    const extraCost = EXTRA_OPTIONS.find(e => e.value === extra)?.cost ?? 0;
    cost += extraCost;
  });
  
  // Vibe modifier (higher vibe = more expensive finishes, up to 10%)
  cost *= 1 + (vibe / 100) * 0.1;
  
  // Round to nearest 5000
  return Math.round(cost / 5000) * 5000;
};

/**
 * Format currency for display
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};




