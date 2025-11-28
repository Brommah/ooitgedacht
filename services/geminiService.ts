import { GoogleGenAI } from "@google/genai";
import { UserPreferences } from "../types";
import { 
  MATERIAL_OPTIONS, 
  ENERGY_OPTIONS, 
  EXTRA_OPTIONS, 
  ROOF_OPTIONS, 
  SIZE_OPTIONS, 
  getVibePromptHint,
  getVibeLabel,
  HOUSEHOLD_OPTIONS 
} from "../constants";

// Initialize Gemini Client
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey: API_KEY });

// Helper to convert URL to GenerativePart for mix-and-match
async function urlToGenerativePart(url: string): Promise<{ inlineData: { data: string; mimeType: string } } | null> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const base64 = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
    // remove data:image/jpeg;base64, prefix
    const data = base64.split(',')[1];
    return {
      inlineData: {
        data,
        mimeType: blob.type
      }
    };
  } catch (e) {
    console.warn("Failed to load reference image:", url, e);
    return null;
  }
}

/**
 * Map style tags to local fallback images (matches constants.ts MOOD_IMAGES)
 */
const getStyleImage = (styleTag: string): string => {
  const map: Record<string, string> = {
    // All 8 styles from constants.ts
    'Rietgedekte Schuur': '/generated/mood-v3/rietgedekte-schuur.png',
    'Houten Polderwoning': '/generated/mood-v3/houten-polderwoning.png',
    'Notariswoning': '/generated/mood-v3/notaris-woning.png',
    'Boswoning': '/generated/mood-v3/boswoning.png',
    'Dorpswoning': '/generated/mood-v3/dorpswoning.png',
    'Strandvilla': '/generated/mood-v3/strandvilla.png',
    'Industrieel Loft': '/generated/mood-v3/industrieel-loft.png',
    'Japandi Villa': '/generated/mood-v3/japandi-villa.png',
  };
  return map[styleTag] || '/generated/mood-v3/houten-polderwoning.png';
};

// ... [keep getStyleDescription, getVibeAtmosphere, buildComprehensivePrompt helpers identical to before] ...
// For brevity in this turn, I will include the full buildComprehensivePrompt logic again or import it if I could, 
// but since I'm writing the file, I must include everything.

/**
 * Get style CHARACTER description (without specifying materials/roof - those come from user choices)
 * Tags match constants.ts MOOD_IMAGES
 */
const getStyleCharacter = (tag: string): string => {
  const styleMap: Record<string, string> = {
    // All 8 styles from constants.ts
    'Rietgedekte Schuur': 'Traditional Dutch barn/schuur conversion, rustic countryside farmhouse character, authentic proportions, white window frames, exposed oak beams, waterside setting with wooden jetty',
    'Houten Polderwoning': 'Scandinavian-Dutch polder aesthetic, grey weathered timber cladding, large floor-to-ceiling windows with black frames, minimalist clean lines, open polder landscape views',
    'Notariswoning': 'Stately 1930s Dutch villa character, elegant symmetrical brick proportions, formal gravel driveway, manicured hedges, decorative dormers, limestone window surrounds, prestigious grandeur',
    'Boswoning': 'Organic forest dwelling, biophilic design integrated into nature, large glass walls connecting indoors to forest, green sedum roof with native vegetation, elevated among trees',
    'Dorpswoning': 'Traditional Dutch village house, symmetrical facade with decorative stepped gable, white painted window frames, classic red brick proportions, cozy village character',
    'Strandvilla': 'Luxurious Dutch coastal architecture, white or light grey stucco walls, large balconies and terraces, floor-to-ceiling glass with sea views, dune landscape with beach grass, Mediterranean-Dutch fusion',
    'Industrieel Loft': 'Converted factory/warehouse building, exposed steel beams and brick walls, large industrial steel-framed windows, high ceilings, raw urban character, combination of brick, steel, and concrete',
    'Japandi Villa': 'Ultra-minimalist Japanese-Scandinavian fusion, natural light wood elements, flat roof with clean edges, large frameless windows, zen courtyard garden, wabi-sabi aesthetic, serene and meditative',
  };
  return styleMap[tag] || 'Contemporary Dutch residential character';
};

/**
 * Get the REQUIRED roof type based on style selection
 * This OVERRIDES the user's material choice for roof when the style DEMANDS a specific roof
 */
const getRequiredRoofForStyle = (tag: string): string | null => {
  const roofOverrides: Record<string, string> = {
    'Rietgedekte Schuur': 'AUTHENTIC DUTCH THATCHED ROOF (rieten dak) - thick golden-brown reed thatch, organic rounded edges, traditional craftsmanship visible. THIS IS THE DEFINING FEATURE - the roof MUST be thatched.',
    'Boswoning': 'LIVING GREEN SEDUM ROOF - lush low vegetation covering the entire flat or slightly sloped roof surface, blending with surrounding forest',
    'Japandi Villa': 'FLAT MINIMALIST ROOF - clean horizontal lines, minimal overhang, possibly with hidden drainage, pure geometric simplicity',
    'Industrieel Loft': 'FLAT INDUSTRIAL ROOF or SAW-TOOTH FACTORY ROOF - characteristic industrial silhouette with large skylights',
  };
  return roofOverrides[tag] || null;
};

/**
 * Get detailed material description for WALLS/FACADE
 */
const getMaterialDescription = (material: string): string => {
  const materialMap: Record<string, string> = {
    'wood': 'TIMBER-CLAD WALLS - vertical or horizontal wooden planks. Can be grey-weathered, natural honey, or black-stained Douglas fir.',
    'brick': 'BRICK WALLS - traditional Dutch handmade bricks in warm red-brown, dark brown, or orange tones. Authentic masonry with visible mortar joints. The primary wall surface must be brick.',
    'concrete': 'CONCRETE OR STUCCO WALLS - smooth rendered finish or exposed concrete panels, clean minimalist surfaces.',
    'mixed': 'MIXED MATERIAL WALLS - harmonious combination of brick base with wood or render upper sections.',
  };
  return materialMap[material] || 'Traditional Dutch brick walls';
};

const getVibeAtmosphere = (vibe: number): { exterior: string; landscaping: string } => {
  if (vibe < 20) {
    return {
      exterior: 'Ultra-minimalist, stark geometric forms, monochromatic palette (white/grey/black), zero ornamentation, architectural purity',
      landscaping: 'Minimalist zen garden with gravel, single specimen tree, architectural grasses, clean geometric hedges'
    };
  }
  if (vibe < 40) {
    return {
      exterior: 'Modern clean lines, subtle material contrasts, refined detailing, contemporary elegance',
      landscaping: 'Structured modern garden with ornamental grasses, clipped hedges, stepping stones, subtle lighting'
    };
  }
  if (vibe < 60) {
    return {
      exterior: 'Balanced contemporary Dutch, warm material palette, welcoming proportions, quality craftsmanship visible',
      landscaping: 'Traditional Dutch garden with lawn, mixed perennial borders, mature trees, brick pathway'
    };
  }
  if (vibe < 80) {
    return {
      exterior: 'Warm natural materials dominate, wood and brick textures, gentle roof lines, cottage-like charm',
      landscaping: 'Lush romantic garden with flowering shrubs, climbing roses, fruit trees, natural stone, bird bath'
    };
  }
  return {
    exterior: 'Rustic Dutch countryside character, weathered natural materials, thatched or aged tile roof, historic charm',
    landscaping: 'Wild cottage garden with native flowers, vegetable patch, old fruit trees, weathered wooden fence, meandering paths'
  };
};

const buildComprehensivePrompt = (prefs: UserPreferences): string => {
  // ===== STYLE =====
  const primaryStyle = prefs.style.moodBoardSelections[0] || '';
  const secondaryStyles = prefs.style.moodBoardSelections.slice(1);
  const styleCharacter = getStyleCharacter(primaryStyle);
  
  // ===== ROOF (style can override, sedum extra can override) =====
  const requiredRoof = getRequiredRoofForStyle(primaryStyle);
  const roofOpt = ROOF_OPTIONS.find(r => r.value === prefs.style.inferredRoofStyle);
  // Sedum roof extra OVERRIDES roof style if selected
  const hasSedum = prefs.config.extras.includes('sedum_roof');
  const roofDescription = hasSedum 
    ? 'GREEN SEDUM LIVING ROOF - lush low vegetation covering the roof surface, eco-friendly, wildflowers and sedums visible'
    : (requiredRoof || roofOpt?.promptHint || 'traditional pitched gable roof');
  
  // ===== MATERIALS =====
  const facadeMaterial = getMaterialDescription(prefs.config.material);
  
  // ===== SIZE & HOUSEHOLD =====
  const sizeOpt = SIZE_OPTIONS.find(s => s.value === prefs.config.size);
  const householdOpt = HOUSEHOLD_OPTIONS.find(h => h.value === prefs.household.type);
  const bedrooms = prefs.household.bedrooms;
  const bathrooms = prefs.household.bathrooms;
  
  const householdDescription = householdOpt?.description || 'family';
  
  const sizeDescription = sizeOpt 
    ? `${sizeOpt.description}, ${prefs.config.sqm} m² total floor area`
    : `${prefs.config.sqm} m² home`;
  
  const scaleImplication = bedrooms >= 6 
    ? 'grand estate villa, imposing presence'
    : bedrooms >= 5 
    ? 'large luxury family villa'
    : bedrooms >= 4
    ? 'substantial family home'
    : bedrooms >= 3
    ? 'comfortable family home'
    : 'compact modern dwelling';
  
  // ===== BUDGET QUALITY =====
  const budgetQuality = prefs.budget.total > 1000000 
    ? 'Ultra-luxury estate: museum-quality finishes, bespoke everything, statement architecture'
    : prefs.budget.total > 800000 
    ? 'Luxury villa: premium materials, bespoke details, architect-designed, high-end finishes'
    : prefs.budget.total > 500000 
    ? 'High-quality home: carefully selected materials, excellent craftsmanship, attention to detail'
    : prefs.budget.total > 350000 
    ? 'Quality family home: solid construction, tasteful materials, well-proportioned'
    : 'Smart efficient design: clever use of space, cost-effective yet attractive materials';

  // ===== VIBE/ATMOSPHERE =====
  const vibeAtmosphere = getVibeAtmosphere(prefs.config.vibe);
  const vibeLabel = getVibeLabel(prefs.config.vibe);
  
  // ===== ENERGY SYSTEMS (all visible) =====
  const energyFeatures: string[] = [];
  if (prefs.config.energyLevel === 'aplus') {
    energyFeatures.push('triple-glazed windows', 'discrete heat pump unit visible');
  } else if (prefs.config.energyLevel === 'neutral') {
    energyFeatures.push('solar panels covering significant roof area', 'heat pump unit', 'modern energy-efficient design');
  } else if (prefs.config.energyLevel === 'positive') {
    energyFeatures.push('MAXIMUM solar panel coverage on all suitable roof surfaces', 'prominent heat pump system', 'visible battery storage unit', 'smart home technology');
  }

  // ===== ALL EXTRAS (mapped to visual descriptions) =====
  const extraVisuals: string[] = [];
  
  prefs.config.extras.forEach(extra => {
    switch(extra) {
      case 'garage':
        extraVisuals.push('ATTACHED GARAGE - integrated into house design with automatic sectional door, matching facade materials');
        break;
      case 'carport':
        extraVisuals.push('WOODEN CARPORT - open-sided timber structure with flat or slightly pitched roof, adjacent to house');
        break;
      case 'solar':
        extraVisuals.push('BLACK MONOCRYSTALLINE SOLAR PANELS - integrated seamlessly on roof surface, 16-20 panels visible');
        break;
      case 'ev_charger':
        extraVisuals.push('EV CHARGING STATION - modern wall-mounted charger on driveway pillar or garage wall, with charging cable');
        break;
      case 'heat_pump':
        extraVisuals.push('AIR SOURCE HEAT PUMP - modern white outdoor unit visible near house, discreetly placed');
        break;
      case 'battery_storage':
        extraVisuals.push('HOME BATTERY SYSTEM - sleek wall-mounted unit visible in carport or on exterior wall');
        break;
      case 'office':
        extraVisuals.push('SEPARATE HOME OFFICE - visible through large window, or as distinct architectural element/wing of the house');
        break;
      case 'sedum_roof':
        // Already handled in roof section
        break;
      case 'rainwater':
        extraVisuals.push('RAINWATER HARVESTING - decorative rain barrel or underground collection visible, downspouts leading to storage');
        break;
      case 'outdoor_kitchen':
        extraVisuals.push('OUTDOOR KITCHEN AREA - built-in BBQ island with countertop, covered terrace dining area, visible in garden');
        break;
      case 'pool':
        extraVisuals.push('SWIMMING POOL - modern rectangular infinity pool OR natural swimming pond in the backyard, visible with deck/terrace area around it, sun loungers');
        break;
      case 'sauna':
        extraVisuals.push('OUTDOOR SAUNA CABIN - freestanding wooden sauna house in garden, barrel sauna or cubic design, with small terrace');
        break;
    }
  });

  // ===== LOCATION & PLOT =====
  const locationName = prefs.location.searchQuery?.split(',')[0] || '';
  const regionName = prefs.location.searchQuery?.split(',')[1]?.trim() || '';
  const locationContext = locationName 
    ? `${locationName}${regionName ? `, ${regionName}` : ''}, Netherlands`
    : 'Dutch countryside';
  
  const plotDescriptions: Record<string, string> = {
    '1000+': 'EXPANSIVE ESTATE PLOT (1000+ m²) - generous setbacks from neighbors, room for pool, gardens, multiple outbuildings, long driveway approach',
    '500-1000': 'SPACIOUS PLOT (500-1000 m²) - mature landscaping, room for pool or extensive garden, good privacy',
    '300-500': 'WELL-PROPORTIONED SUBURBAN PLOT (300-500 m²) - typical Dutch residential plot, front and back garden',
    '<300': 'COMPACT URBAN PLOT (<300 m²) - efficient use of space, modern urban design, small private garden',
  };
  const plotDescription = plotDescriptions[prefs.location.plotSize || '300-500'];

  // Check if backyard features are selected (need aerial view)
  const hasBackyardFeatures = prefs.config.extras.includes('pool') || 
                              prefs.config.extras.includes('sauna') || 
                              prefs.config.extras.includes('outdoor_kitchen');

  // ===== BUILD THE COMPREHENSIVE PROMPT =====
  return `
GENERATE A PHOTOREALISTIC ARCHITECTURAL PHOTOGRAPH OF A DUTCH FAMILY HOME.

################################################################################
##                    CRITICAL REQUIREMENTS - DO NOT DEVIATE                   ##
################################################################################

1. ROOF TYPE (MUST MATCH EXACTLY):
${roofDescription}

2. FACADE/WALL MATERIAL (MUST MATCH EXACTLY):
${facadeMaterial}

3. HOUSE SIZE:
${sizeDescription}
Scale: ${scaleImplication}
Bedrooms: ${bedrooms} | Bathrooms: ${bathrooms}
For: ${householdDescription} household

################################################################################

ARCHITECTURAL STYLE & CHARACTER:
Primary style: ${primaryStyle}
${styleCharacter}
${secondaryStyles.length > 0 ? `Secondary influences: ${secondaryStyles.join(', ')}` : ''}

DESIGN ATMOSPHERE (Vibe: ${vibeLabel}):
${vibeAtmosphere.exterior}

QUALITY LEVEL:
${budgetQuality}

${energyFeatures.length > 0 ? `
################################################################################
##                            ENERGY SYSTEMS                                   ##
################################################################################

${energyFeatures.map(f => `• ${f}`).join('\n')}
` : ''}

${extraVisuals.length > 0 ? `
################################################################################
##                    EXTRAS & ADDITIONS (MUST BE VISIBLE)                     ##
################################################################################

${extraVisuals.map(f => `• ${f}`).join('\n')}
` : ''}

################################################################################
##                              SETTING & CONTEXT                              ##
################################################################################

LOCATION: ${locationContext}
PLOT: ${plotDescription}

LANDSCAPING & SURROUNDINGS:
${vibeAtmosphere.landscaping}

${prefs.config.extras.includes('pool') ? `
⚠️ CRITICAL: The SWIMMING POOL must be clearly visible in the backyard with deck/terrace around it.
` : ''}
${prefs.config.extras.includes('outdoor_kitchen') ? `
⚠️ CRITICAL: The OUTDOOR KITCHEN/BBQ area must be visible on the terrace or in the garden.
` : ''}
${prefs.config.extras.includes('sauna') ? `
⚠️ CRITICAL: The SAUNA CABIN must be visible in the garden area.
` : ''}

################################################################################
##                           PHOTOGRAPHY REQUIREMENTS                          ##
################################################################################

CAMERA ANGLE: 
${hasBackyardFeatures 
  ? `- ELEVATED 3/4 AERIAL PERSPECTIVE showing BOTH front facade AND entire backyard/garden
- Drone-style shot from above to capture pool, sauna, outdoor kitchen
- The backyard features MUST be clearly visible in the frame`
  : `- 3/4 front angle showing facade and entrance
- Ground-level or slightly elevated perspective
- Focus on architectural details and front landscaping`}

LIGHTING:
- Golden hour / magic hour lighting
- Warm natural sunlight
- Soft shadows, no harsh contrasts

QUALITY:
- Ultra photorealistic, indistinguishable from real photograph
- NOT a 3D render, NOT an illustration
- Professional architectural photography quality
- Magazine cover worthy (Eigen Huis & Interieur / Architectural Digest)

ASPECT RATIO: 16:9 landscape

################################################################################
##                              STRICT EXCLUSIONS                              ##
################################################################################

DO NOT INCLUDE:
❌ People or human figures
❌ Moving vehicles (parked car OK)
❌ Text, watermarks, logos
❌ Oversaturated or unrealistic colors
❌ Any roof type OTHER than specified above
❌ Any wall material OTHER than specified above
❌ Interior views
❌ Night time scenes

################################################################################
`.trim();
};

/**
 * Generate the final dream home visualization using Gemini 3 Pro Image
 */
export const generateDreamHome = async (prefs: UserPreferences): Promise<string> => {
  const prompt = buildComprehensivePrompt(prefs);
  console.log('Generating with Gemini 3 Pro Image prompt:', prompt);

  // Collect reference images from moodboard selections
  const selectedImages = prefs.style.moodBoardSelections
    .map(tag => getStyleImage(tag))
    .slice(0, 4); // Limit to 4 reference images to stay well within limits

  // Load reference images as GenerativePart objects
  const imageParts = await Promise.all(selectedImages.map(url => urlToGenerativePart(url)));
  const validImageParts = imageParts.filter(part => part !== null) as { inlineData: { data: string; mimeType: string } }[];

  try {
    // Use Gemini 3 Pro Image - state-of-the-art image generation
    // Docs: https://ai.google.dev/gemini-api/docs/image-generation
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          { text: prompt },
          ...validImageParts // Mix up to 14 reference images!
        ]
      },
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
        aspectRatio: '16:9',  // "1:1","2:3","3:2","3:4","4:3","4:5","5:4","9:16","16:9","21:9"
        resolution: '2K',     // "1K", "2K", "4K"
      } as any,
    });

    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if ((part as any).inlineData?.mimeType?.startsWith('image/')) {
          const inlineData = (part as any).inlineData;
          return `data:${inlineData.mimeType};base64,${inlineData.data}`;
        }
      }
    }
    throw new Error("No image generated");
  } catch (error) {
    console.error("Gemini 3 Pro Image Generation Error:", error);
    
    // Fallback to high-quality static asset if generation fails (e.g. region lock)
    const primaryStyle = prefs.style.moodBoardSelections?.[0];
    return getStyleImage(primaryStyle || '');
  }
};

/**
 * Generate location-specific visualization
 */
export const generateLocationPreview = async (
  location: string,
  prefs: Partial<UserPreferences>
): Promise<string> => {
  const loc = location.toLowerCase();
  let staticImage = '';

  if (loc.includes('amsterdam')) staticImage = '/generated/locations/amsterdam-province.png';
  else if (loc.includes('utrecht')) staticImage = '/generated/locations/utrecht-province.png';
  else if (loc.includes('den haag') || loc.includes('gravenhage')) staticImage = '/generated/locations/den-haag-province.png';
  else if (loc.includes('amersfoort')) staticImage = '/generated/locations/amersfoort-province.png';
  else if (loc.includes('haarlem')) staticImage = '/generated/locations/haarlem-province.png';
  else if (loc.includes('almere')) staticImage = '/generated/locations/almere-province.png';
  else staticImage = '/generated/locations/generic-province.png';

  return staticImage;
};

// Keep existing Style Preview for MoodBoard (or we could update it too, but let's keep it simple)
export const generateStylePreview = async (
  style: string,
  description: string
): Promise<string> => {
    // ... (implementation unchanged for now, or could use new model too)
    // For now, stick to static as we want instant feedback in moodboard usually
    return getStyleImage(style); 
};

export const generatePreferencePreview = async (
  prefs: Partial<UserPreferences>,
  selectedStyles: string[]
): Promise<string> => {
    // Fallback to static for intermediate steps to keep it fast
    return getStyleImage(selectedStyles[0] || '');
};
