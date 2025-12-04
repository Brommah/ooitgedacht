import { RoofStyle } from '../types';

/**
 * Roof style options (for inference display)
 */
export interface RoofOption {
  value: RoofStyle;
  label: string;
  icon: string;
  promptHint: string;
}

export const ROOF_OPTIONS: RoofOption[] = [
  { value: 'pitched', label: 'Zadeldak', icon: '🏠', promptHint: 'traditional pitched gable roof' },
  { value: 'flat', label: 'Plat dak', icon: '🏢', promptHint: 'modern flat roof design' },
  { value: 'sedum', label: 'Sedumdak', icon: '🌿', promptHint: 'green sedum living roof' },
  { value: 'mansard', label: 'Mansardedak', icon: '🏛️', promptHint: 'classic mansard roof with dormers' },
  { value: 'thatched', label: 'Rieten dak', icon: '🌾', promptHint: 'traditional Dutch thatched roof' },
];

/**
 * VIBE PROMPT HINTS (for AI generation)
 * User-facing vibe labels are in i18n/translations.ts
 */
export const getVibePromptHint = (value: number): string => {
  if (value < 15) return 'Ultra minimalist, Scandinavian, white walls, clean lines, sparse decoration, monochromatic';
  if (value < 35) return 'Modern clean aesthetic, neutral tones, contemporary furniture, subtle textures';
  if (value < 65) return 'Balanced modern comfort, mix of materials, earth tones, welcoming atmosphere';
  if (value < 85) return 'Warm natural materials, wooden accents, soft textures, cozy lighting, plants';
  return 'Rustic cozy, traditional Dutch, exposed beams, fireplace, warm colors, hygge atmosphere';
};




