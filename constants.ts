import { MoodImage, SizeCategory, MaterialType, EnergyLevel, ExtraFeature, HouseholdType, RoofStyle } from './types';

// ============================================
// MOOD BOARD IMAGES - 8 Dutch new-build styles
// ============================================

export const MOOD_IMAGES: MoodImage[] = [
  {
    id: '1',
    src: '/generated/mood-v4/moderne-villa.png',
    tag: 'Moderne Villa',
    description: 'Strakke lijnen, grote ramen, plat of zadeldak. Tijdloos modern.',
    category: 'exterior',
    inferredRoof: 'flat',
    inferredMaterial: 'mixed',
  },
  {
    id: '2',
    src: '/generated/mood-v4/landelijke-schuur.png',
    tag: 'Landelijke Schuur',
    description: 'Zwarte houten gevels, hoog plafond, rieten of pannen dak.',
    category: 'exterior',
    inferredRoof: 'thatched',
    inferredMaterial: 'wood',
  },
  {
    id: '3',
    src: '/generated/mood-v4/klassiek-nederlands.png',
    tag: 'Klassiek Nederlands',
    description: 'Rode baksteen, wit kozijn, zadeldak. Tijdloze uitstraling.',
    category: 'exterior',
    inferredRoof: 'pitched',
    inferredMaterial: 'brick',
  },
  {
    id: '4',
    src: '/generated/mood-v4/eco-woning.png',
    tag: 'Eco Woning',
    description: 'Sedumdak, natuurlijke materialen, maximaal duurzaam.',
    category: 'exterior',
    inferredRoof: 'sedum',
    inferredMaterial: 'wood',
  },
  {
    id: '5',
    src: '/generated/mood-v4/kubistische-woning.png',
    tag: 'Kubistische Woning',
    description: 'Plat dak, witte gevels, geometrische vormen. Architectonisch.',
    category: 'exterior',
    inferredRoof: 'flat',
    inferredMaterial: 'concrete',
  },
  {
    id: '6',
    src: '/generated/mood-v4/vrijstaande-twee-kapper.png',
    tag: 'Ruime Twee-Kapper',
    description: 'Geschakelde woning met eigen karakter. Populair en praktisch.',
    category: 'exterior',
    inferredRoof: 'pitched',
    inferredMaterial: 'brick',
  },
  {
    id: '7',
    src: '/generated/mood-v4/bungalow.png',
    tag: 'Moderne Bungalow',
    description: 'Alles gelijkvloers, grote tuin, toegankelijk wonen.',
    category: 'exterior',
    inferredRoof: 'flat',
    inferredMaterial: 'brick',
  },
  {
    id: '8',
    src: '/generated/mood-v4/herenhuis.png',
    tag: 'Statig Herenhuis',
    description: 'Drie lagen, markante gevel, stedelijke allure.',
    category: 'exterior',
    inferredRoof: 'mansard',
    inferredMaterial: 'brick',
  },
];

// ============================================
// SIZE OPTIONS
// ============================================

export const SIZE_OPTIONS: Array<{
  value: SizeCategory;
  label: string;
  sqmRange: string;
  sqmMin: number;
  sqmMax: number;
  description: string;
  bedroomsTypical: number;
}> = [
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

// Legacy budget levels (maps to SIZE_OPTIONS)
export const BUDGET_LEVELS = SIZE_OPTIONS.map((opt, i) => ({
  level: i + 1,
  label: opt.label,
  description: opt.description,
  sqm: opt.sqmRange,
  priceRange: ['€280k - €350k', '€350k - €480k', '€480k - €650k', '€650k+'][i],
}));

// ============================================
// MATERIAL OPTIONS
// ============================================

export const MATERIAL_OPTIONS: Array<{
  value: MaterialType;
  label: string;
  costMod: number;
  icon: string;
  description: string;
  promptHint: string;
}> = [
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

// ============================================
// ENERGY LEVEL OPTIONS
// ============================================

export const ENERGY_OPTIONS: Array<{
  value: EnergyLevel;
  label: string;
  costAdd: number;
  icon: string;
  description: string;
  features: string[];
  promptHint: string;
}> = [
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

// ============================================
// EXTRA FEATURES
// ============================================

export const EXTRA_OPTIONS: Array<{
  value: ExtraFeature;
  label: string;
  cost: number;
  icon: string;
  description: string;
  promptHint: string;
}> = [
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

// ============================================
// HOUSEHOLD OPTIONS
// ============================================

export const HOUSEHOLD_OPTIONS: Array<{
  value: HouseholdType;
  label: string;
  icon: string;
  defaultBedrooms: number;
  description: string;
}> = [
  { value: 'single', label: 'Alleen', icon: '👤', defaultBedrooms: 2, description: 'Alleenstaand' },
  { value: 'couple', label: 'Samen', icon: '👫', defaultBedrooms: 2, description: 'Stel zonder kinderen' },
  { value: 'family', label: 'Gezin', icon: '👨‍👩‍👧‍👦', defaultBedrooms: 4, description: 'Gezin met kinderen' },
  { value: 'multi_gen', label: 'Multigeneratie', icon: '👴👵👶', defaultBedrooms: 5, description: 'Meerdere generaties' },
  { value: 'other', label: 'Anders', icon: '🏠', defaultBedrooms: 3, description: 'Andere samenstelling' },
];

// ============================================
// ROOF STYLE OPTIONS (for inference display)
// ============================================

export const ROOF_OPTIONS: Array<{
  value: RoofStyle;
  label: string;
  icon: string;
  promptHint: string;
}> = [
  { value: 'pitched', label: 'Zadeldak', icon: '🏠', promptHint: 'traditional pitched gable roof' },
  { value: 'flat', label: 'Plat dak', icon: '🏢', promptHint: 'modern flat roof design' },
  { value: 'sedum', label: 'Sedumdak', icon: '🌿', promptHint: 'green sedum living roof' },
  { value: 'mansard', label: 'Mansardedak', icon: '🏛️', promptHint: 'classic mansard roof with dormers' },
  { value: 'thatched', label: 'Rieten dak', icon: '🌾', promptHint: 'traditional Dutch thatched roof' },
];

// ============================================
// VIBE LABELS
// ============================================

export const VIBE_LABELS: Record<number, string> = {
  0: 'Strak & Minimalistisch',
  25: 'Modern & Strak',
  50: 'Gebalanceerd',
  75: 'Warm & Natuurlijk',
  100: 'Knus & Landelijk'
};

export const getVibeLabel = (value: number): string => {
  if (value < 15) return 'Strak & Minimalistisch';
  if (value < 35) return 'Modern & Strak';
  if (value < 65) return 'Gebalanceerd';
  if (value < 85) return 'Warm & Natuurlijk';
  return 'Knus & Landelijk';
};

export const getVibePromptHint = (value: number): string => {
  if (value < 15) return 'Ultra minimalist, Scandinavian, white walls, clean lines, sparse decoration, monochromatic';
  if (value < 35) return 'Modern clean aesthetic, neutral tones, contemporary furniture, subtle textures';
  if (value < 65) return 'Balanced modern comfort, mix of materials, earth tones, welcoming atmosphere';
  if (value < 85) return 'Warm natural materials, wooden accents, soft textures, cozy lighting, plants';
  return 'Rustic cozy, traditional Dutch, exposed beams, fireplace, warm colors, hygge atmosphere';
};

// ============================================
// GENERATION MESSAGES
// ============================================

export const GENERATION_MESSAGES = [
  { message: 'Analyseren van je huishouden...', duration: 1500 },
  { message: 'Stijlvoorkeuren verwerken...', duration: 2000 },
  { message: 'Materialen en texturen selecteren...', duration: 2000 },
  { message: 'Energiesystemen integreren...', duration: 1500 },
  { message: 'Plattegrond optimaliseren...', duration: 2000 },
  { message: 'Exterieur visualiseren...', duration: 2500 },
  { message: 'Landschapsontwerp toevoegen...', duration: 1500 },
  { message: 'Laatste details afronden...', duration: 1500 },
  { message: 'Je droomhuis staat klaar!', duration: 1000 },
];

// ============================================
// POPULAR LOCATIONS
// ============================================

export const POPULAR_LOCATIONS = [
  { name: 'Amsterdam', region: 'Noord-Holland', avgLandPrice: 800, image: '/generated/locations/amsterdam-province.png' },
  { name: 'Utrecht', region: 'Utrecht', avgLandPrice: 650, image: '/generated/locations/utrecht-province.png' },
  { name: 'Den Haag', region: 'Zuid-Holland', avgLandPrice: 550, image: '/generated/locations/den-haag-province.png' },
  { name: 'Amersfoort', region: 'Utrecht', avgLandPrice: 500, image: '/generated/locations/amersfoort-province.png' },
  { name: 'Haarlem', region: 'Noord-Holland', avgLandPrice: 600, image: '/generated/locations/haarlem-province.png' },
  { name: 'Almere', region: 'Flevoland', avgLandPrice: 350, image: '/generated/locations/almere-province.png' },
  { name: 'Groningen', region: 'Groningen', avgLandPrice: 300, image: '/generated/locations/generic-province.png' },
  { name: 'Eindhoven', region: 'Noord-Brabant', avgLandPrice: 450, image: '/generated/locations/generic-province.png' },
];

// ============================================
// COST CALCULATION HELPERS
// ============================================

export const BASE_BUILD_COST_PER_SQM = 2200; // €/m²

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
  const materialMod = MATERIAL_OPTIONS.find(m => m.value === material)?.costMod || 1;
  cost *= materialMod;
  
  // Energy level addition
  const energyAdd = ENERGY_OPTIONS.find(e => e.value === energyLevel)?.costAdd || 0;
  cost += energyAdd;
  
  // Extras
  extras.forEach(extra => {
    const extraCost = EXTRA_OPTIONS.find(e => e.value === extra)?.cost || 0;
    cost += extraCost;
  });
  
  // Vibe modifier (higher vibe = more expensive finishes, up to 10%)
  cost *= 1 + (vibe / 100) * 0.1;
  
  // Round to nearest 5000
  return Math.round(cost / 5000) * 5000;
};

export const estimateLandCost = (
  location: string,
  plotSize: string | null
): number => {
  // Find location average price per m²
  const loc = POPULAR_LOCATIONS.find(l => 
    location.toLowerCase().includes(l.name.toLowerCase())
  );
  const pricePerSqm = loc?.avgLandPrice || 400;
  
  // Get plot size midpoint
  const plotSizes: Record<string, number> = {
    '<300': 250,
    '300-500': 400,
    '500-1000': 750,
    '1000+': 1200,
  };
  const sqm = plotSizes[plotSize || '300-500'] || 400;
  
  return pricePerSqm * sqm;
};

// ============================================
// APP CONSTANTS
// ============================================

export const APP_NAME = "Ooit Gedacht";
export const CURRENCY_SYMBOL = "€";
