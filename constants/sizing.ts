import { SizeCategory } from '../types';

/**
 * Size options for home configuration
 */
export interface SizeOption {
  value: SizeCategory;
  label: string;
  sqmRange: string;
  sqmMin: number;
  sqmMax: number;
  description: string;
  bedroomsTypical: number;
}

export const SIZE_OPTIONS: SizeOption[] = [
  { 
    value: 'compact', 
    label: 'Compact', 
    sqmRange: '80-120 m²',
    sqmMin: 80,
    sqmMax: 120,
    description: 'Starterswoning, efficiënt gebruik van ruimte',
    bedroomsTypical: 2,
  },
  { 
    value: 'family', 
    label: 'Gezin', 
    sqmRange: '120-180 m²',
    sqmMin: 120,
    sqmMax: 180,
    description: 'Ruimte voor gezin met kinderen',
    bedroomsTypical: 3,
  },
  { 
    value: 'spacious', 
    label: 'Ruim', 
    sqmRange: '180-250 m²',
    sqmMin: 180,
    sqmMax: 250,
    description: 'Vrijstaand met grote tuin',
    bedroomsTypical: 4,
  },
  { 
    value: 'villa', 
    label: 'Villa', 
    sqmRange: '250+ m²',
    sqmMin: 250,
    sqmMax: 400,
    description: 'Exclusieve locatie, alle opties',
    bedroomsTypical: 5,
  },
];

/**
 * Legacy budget levels (maps to SIZE_OPTIONS)
 * Kept for backward compatibility
 */
export const BUDGET_LEVELS = SIZE_OPTIONS.map((opt, i) => ({
  level: i + 1,
  label: opt.label,
  description: opt.description,
  sqm: opt.sqmRange,
  priceRange: ['€280k - €350k', '€350k - €480k', '€480k - €650k', '€650k+'][i],
}));

/**
 * Get sqm from size category
 */
export const getSqmFromSize = (size: SizeCategory): number => {
  const opt = SIZE_OPTIONS.find((o) => o.value === size);
  return opt ? Math.round((opt.sqmMin + opt.sqmMax) / 2) : 150;
};




