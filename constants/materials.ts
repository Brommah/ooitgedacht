import { MaterialType } from '../types';

/**
 * Material options for home construction
 */
export interface MaterialOption {
  value: MaterialType;
  label: string;
  costMod: number;
  icon: string;
  description: string;
  promptHint: string;
}

export const MATERIAL_OPTIONS: MaterialOption[] = [
  { 
    value: 'wood', 
    label: 'Houtskelet', 
    costMod: 1.1, 
    icon: '🪵', 
    description: 'Snel te bouwen, goed isolerend',
    promptHint: 'Natural timber cladding, warm wooden elements, sustainable CLT wood architecture, Scandinavian influence',
  },
  { 
    value: 'brick', 
    label: 'Baksteen', 
    costMod: 1.0, 
    icon: '🧱', 
    description: 'Meest gekozen in Nederland',
    promptHint: 'Classic Dutch red-brown brick, traditional masonry, timeless elegance, handmade bricks',
  },
  { 
    value: 'concrete', 
    label: 'Prefab Beton', 
    costMod: 1.15, 
    icon: '🏗️', 
    description: 'Snelle bouw, strakke afwerking',
    promptHint: 'Smooth concrete panels, minimalist brutalist elements, industrial steel accents',
  },
  { 
    value: 'mixed', 
    label: 'Mix', 
    costMod: 1.2, 
    icon: '🔲', 
    description: 'Combinatie van materialen',
    promptHint: 'Mixed materials combining wood, brick, render and glass, contemporary Dutch architecture',
  },
];




