import { HouseholdType } from '../types';

/**
 * Household type options
 */
export interface HouseholdOption {
  value: HouseholdType;
  label: string;
  icon: string;
  defaultBedrooms: number;
  description: string;
}

export const HOUSEHOLD_OPTIONS: HouseholdOption[] = [
  { value: 'single', label: 'Alleen', icon: '👤', defaultBedrooms: 2, description: 'Alleenstaand' },
  { value: 'couple', label: 'Samen', icon: '👫', defaultBedrooms: 2, description: 'Stel zonder kinderen' },
  { value: 'family', label: 'Gezin', icon: '👨‍👩‍👧‍👦', defaultBedrooms: 4, description: 'Gezin met kinderen' },
  { value: 'multi_gen', label: 'Multigeneratie', icon: '👴👵👶', defaultBedrooms: 5, description: 'Meerdere generaties' },
  { value: 'other', label: 'Anders', icon: '🏠', defaultBedrooms: 3, description: 'Andere samenstelling' },
];




