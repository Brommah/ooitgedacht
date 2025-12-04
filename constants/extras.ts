import { ExtraFeature } from '../types';

/**
 * Extra feature options for home customization
 */
export interface ExtraOption {
  value: ExtraFeature;
  label: string;
  cost: number;
  icon: string;
  description: string;
  promptHint: string;
}

export const EXTRA_OPTIONS: ExtraOption[] = [
  { 
    value: 'garage', 
    label: 'Garage', 
    cost: 25000, 
    icon: '🚗', 
    description: 'Inpandige of vrijstaande garage',
    promptHint: 'attached garage with automatic door',
  },
  { 
    value: 'carport', 
    label: 'Carport', 
    cost: 8000, 
    icon: '🅿️', 
    description: 'Overdekte parkeerplaats',
    promptHint: 'modern carport with wooden beams',
  },
  { 
    value: 'solar', 
    label: 'Zonnepanelen', 
    cost: 12000, 
    icon: '☀️', 
    description: '16-20 panelen op het dak',
    promptHint: 'black solar panels integrated on roof',
  },
  { 
    value: 'ev_charger', 
    label: 'Laadpaal', 
    cost: 2500, 
    icon: '🔌', 
    description: 'Elektrische auto opladen',
    promptHint: 'EV charging station in driveway',
  },
  { 
    value: 'heat_pump', 
    label: 'Warmtepomp', 
    cost: 15000, 
    icon: '🌡️', 
    description: 'Duurzaam verwarmen en koelen',
    promptHint: 'modern air source heat pump unit',
  },
  { 
    value: 'battery_storage', 
    label: 'Thuisbatterij', 
    cost: 8000, 
    icon: '🔋', 
    description: 'Energie opslaan',
    promptHint: 'home battery storage system',
  },
  { 
    value: 'office', 
    label: 'Thuiskantoor', 
    cost: 8000, 
    icon: '💼', 
    description: 'Aparte werkruimte',
    promptHint: 'separate home office space with large window',
  },
  { 
    value: 'sedum_roof', 
    label: 'Sedumdak', 
    cost: 15000, 
    icon: '🌱', 
    description: 'Groen dak met vetplanten',
    promptHint: 'green sedum roof with plants',
  },
  { 
    value: 'rainwater', 
    label: 'Regenwateropvang', 
    cost: 6000, 
    icon: '💧', 
    description: 'Hergebruik voor tuin/toilet',
    promptHint: 'rainwater harvesting system',
  },
  { 
    value: 'outdoor_kitchen', 
    label: 'Buitenkeuken', 
    cost: 12000, 
    icon: '🍳', 
    description: 'Koken in de tuin',
    promptHint: 'outdoor kitchen with BBQ area',
  },
  { 
    value: 'pool', 
    label: 'Zwembad', 
    cost: 45000, 
    icon: '🏊', 
    description: 'Eigen zwembad in de tuin',
    promptHint: 'modern swimming pool in backyard',
  },
  { 
    value: 'sauna', 
    label: 'Sauna', 
    cost: 15000, 
    icon: '🧖', 
    description: 'Wellness thuis',
    promptHint: 'outdoor wooden sauna cabin',
  },
];

/**
 * Group extras by category for UI display
 */
export const EXTRAS_BY_CATEGORY = {
  energy: ['solar', 'ev_charger', 'heat_pump', 'battery_storage', 'sedum_roof', 'rainwater'] as ExtraFeature[],
  outdoor: ['garage', 'carport', 'outdoor_kitchen', 'pool'] as ExtraFeature[],
  comfort: ['office', 'sauna'] as ExtraFeature[],
};




