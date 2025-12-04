import { EnergyLevel } from '../types';

/**
 * Energy level options for home efficiency
 */
export interface EnergyOption {
  value: EnergyLevel;
  label: string;
  costAdd: number;
  icon: string;
  description: string;
  features: string[];
  promptHint: string;
}

export const ENERGY_OPTIONS: EnergyOption[] = [
  { 
    value: 'standard', 
    label: 'Standaard', 
    costAdd: 0, 
    icon: '⚡', 
    description: 'Voldoet aan bouwbesluit',
    features: ['HR++ beglazing', 'Goede isolatie'],
    promptHint: 'Standard modern insulation, regular windows',
  },
  { 
    value: 'aplus', 
    label: 'A++', 
    costAdd: 15000, 
    icon: '🌿', 
    description: 'Energiezuinig',
    features: ['Triple glas', 'Warmtepomp', 'Vloerverwarming'],
    promptHint: 'Triple glazed windows, heat pump visible, underfloor heating, energy efficient design',
  },
  { 
    value: 'neutral', 
    label: 'Energieneutraal', 
    costAdd: 35000, 
    icon: '☀️', 
    description: 'Opwekken wat je verbruikt',
    features: ['Zonnepanelen', 'Warmtepomp', 'Thuisbatterij'],
    promptHint: 'Solar panels on roof, modern heat pump, battery storage, net-zero energy home',
  },
  { 
    value: 'positive', 
    label: 'Energie+', 
    costAdd: 55000, 
    icon: '🔋', 
    description: 'Levert energie terug',
    features: ['Maximaal zonnepanelen', 'Thuisbatterij', 'Slimme sturing'],
    promptHint: 'Maximum solar coverage, large battery system, smart home integration, energy positive design',
  },
];




