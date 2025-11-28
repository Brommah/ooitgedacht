/**
 * Generate 8 Mood Board Images using Gemini 3 Pro Image
 * Run with: npx tsx scripts/generate-mood-images.ts
 */

import { GoogleGenAI } from "@google/genai";
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
const API_KEY = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';

if (!API_KEY) {
  console.error('❌ No API key found. Set VITE_GEMINI_API_KEY or GEMINI_API_KEY');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Define all 8 styles with detailed prompts
const MOOD_STYLES = [
  {
    filename: 'rietgedekte-schuur.png',
    tag: 'Rietgedekte Schuur',
    prompt: `
PHOTOREALISTIC ARCHITECTURAL PHOTOGRAPH of a Dutch Rietgedekte Schuur (thatched barn house).

CRITICAL REQUIREMENTS:
- AUTHENTIC THICK THATCHED ROOF (rieten dak) - golden-brown reed thatch with organic rounded edges
- Dark wood or black-stained timber cladding walls
- White painted window frames
- Traditional Dutch barn proportions converted to luxury home
- Waterside setting with wooden jetty/vlonder
- Polder landscape with reeds and water reflections

ATMOSPHERE: Rustic Dutch countryside charm, warm and inviting
LIGHTING: Golden hour, warm sunlight
STYLE: Professional architectural photography, Eigen Huis magazine quality
ASPECT: 4:3 portrait orientation
NO: People, cars, text, watermarks
    `.trim()
  },
  {
    filename: 'houten-polderwoning.png',
    tag: 'Houten Polderwoning',
    prompt: `
PHOTOREALISTIC ARCHITECTURAL PHOTOGRAPH of a Dutch Houten Polderwoning (wooden polder house).

CRITICAL REQUIREMENTS:
- Grey weathered timber cladding (horizontal or vertical planks)
- Clean modern pitched gable roof with dark tiles
- Large floor-to-ceiling windows with black frames
- Minimalist Scandinavian-Dutch fusion design
- Open polder landscape setting with wide views
- Wooden deck terrace

ATMOSPHERE: Modern clean, Scandinavian minimalism
LIGHTING: Overcast Dutch sky, soft diffused light
STYLE: Professional architectural photography, Nordic design magazine quality
ASPECT: 4:3 portrait orientation
NO: People, cars, text, watermarks
    `.trim()
  },
  {
    filename: 'notaris-woning.png',
    tag: 'Notariswoning',
    prompt: `
PHOTOREALISTIC ARCHITECTURAL PHOTOGRAPH of a Dutch Notariswoning (1930s notary villa).

CRITICAL REQUIREMENTS:
- Stately symmetrical brick facade with decorative elements
- Classic mansard or hipped roof with dormers
- Elegant white window frames with shutters
- Formal gravel driveway with manicured hedges
- Limestone or white rendered window surrounds
- Traditional Dutch villa grandeur

ATMOSPHERE: Elegant, timeless, prestigious
LIGHTING: Soft afternoon light, classic feel
STYLE: Professional architectural photography, classic estate photography
ASPECT: 4:3 portrait orientation
NO: People, cars, text, watermarks
    `.trim()
  },
  {
    filename: 'boswoning.png',
    tag: 'Boswoning',
    prompt: `
PHOTOREALISTIC ARCHITECTURAL PHOTOGRAPH of a Dutch Boswoning (forest house).

CRITICAL REQUIREMENTS:
- Living GREEN SEDUM ROOF with native vegetation
- Large glass walls connecting indoors to forest
- Natural wood and concrete materials
- Organic biophilic architecture blending with trees
- Surrounded by mature forest, pine and birch trees
- Elevated on stilts or built into hillside

ATMOSPHERE: Peaceful, natural, zen-like retreat
LIGHTING: Dappled forest light, morning mist
STYLE: Professional architectural photography, organic architecture
ASPECT: 4:3 portrait orientation
NO: People, cars, text, watermarks
    `.trim()
  },
  {
    filename: 'dorpswoning.png',
    tag: 'Dorpswoning',
    prompt: `
PHOTOREALISTIC ARCHITECTURAL PHOTOGRAPH of a Dutch Dorpswoning (village house).

CRITICAL REQUIREMENTS:
- Traditional RED BRICK facade with decorative stepped gable
- Classic Dutch proportions and symmetry
- White painted window frames
- Red or orange clay roof tiles
- Small front garden with iron fence
- Typical Dutch village streetscape feel

ATMOSPHERE: Cozy, traditional Dutch character
LIGHTING: Warm afternoon sun
STYLE: Professional architectural photography, traditional Dutch
ASPECT: 4:3 portrait orientation
NO: People, cars, text, watermarks
    `.trim()
  },
  {
    filename: 'strandvilla.png',
    tag: 'Strandvilla',
    prompt: `
PHOTOREALISTIC ARCHITECTURAL PHOTOGRAPH of a Dutch Strandvilla (coastal beach villa).

CRITICAL REQUIREMENTS:
- White or light grey stucco/rendered walls
- Large balconies and terraces facing the sea
- Floor-to-ceiling glass with sea views
- Modern Mediterranean-Dutch coastal style
- Dune landscape with beach grass
- Flat or gently pitched roof with wooden elements

ATMOSPHERE: Light, airy, holiday resort feeling
LIGHTING: Bright coastal sunlight, blue sky
STYLE: Professional architectural photography, luxury coastal living
ASPECT: 4:3 portrait orientation
NO: People, cars, text, watermarks
    `.trim()
  },
  {
    filename: 'industrieel-loft.png',
    tag: 'Industrieel Loft',
    prompt: `
PHOTOREALISTIC ARCHITECTURAL PHOTOGRAPH of a Dutch Industrieel Loft (industrial loft conversion).

CRITICAL REQUIREMENTS:
- Converted factory/warehouse building
- Exposed steel beams and brick walls
- Large industrial steel-framed windows
- High ceilings visible through glass
- Combination of raw brick, steel, and concrete
- Urban setting or waterfront industrial area

ATMOSPHERE: Raw, edgy, creative urban
LIGHTING: Dramatic side lighting, industrial mood
STYLE: Professional architectural photography, urban loft living
ASPECT: 4:3 portrait orientation
NO: People, cars, text, watermarks
    `.trim()
  },
  {
    filename: 'japandi-villa.png',
    tag: 'Japandi Villa',
    prompt: `
PHOTOREALISTIC ARCHITECTURAL PHOTOGRAPH of a Japandi Villa (Japanese-Scandinavian fusion).

CRITICAL REQUIREMENTS:
- Ultra-minimalist clean lines
- Natural light wood (oak or ash) exterior elements
- Flat roof with clean edges
- Large frameless windows, floor to ceiling
- Japanese-inspired courtyard garden with zen elements
- White/cream walls with wood accents
- Wabi-sabi aesthetic, imperfect natural materials

ATMOSPHERE: Serene, meditative, pure minimalism
LIGHTING: Soft natural light, zen atmosphere
STYLE: Professional architectural photography, minimalist design
ASPECT: 4:3 portrait orientation
NO: People, cars, text, watermarks
    `.trim()
  },
];

async function generateImage(style: typeof MOOD_STYLES[0]): Promise<void> {
  console.log(`\n🎨 Generating: ${style.tag}...`);
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp-image-generation',
      contents: {
        parts: [{ text: style.prompt }]
      },
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      } as any,
    });

    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if ((part as any).inlineData?.mimeType?.startsWith('image/')) {
          const inlineData = (part as any).inlineData;
          const buffer = Buffer.from(inlineData.data, 'base64');
          const outputPath = path.join(__dirname, '../public/generated/mood-v3', style.filename);
          fs.writeFileSync(outputPath, buffer);
          console.log(`✅ Saved: ${style.filename}`);
          return;
        }
      }
    }
    console.error(`❌ No image generated for ${style.tag}`);
  } catch (error) {
    console.error(`❌ Error generating ${style.tag}:`, error);
  }
}

async function main() {
  console.log('🏠 Generating 8 Mood Board Images with Gemini...\n');
  console.log('API Key:', API_KEY.substring(0, 10) + '...');
  
  // Generate all images sequentially to avoid rate limits
  for (const style of MOOD_STYLES) {
    await generateImage(style);
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\n✨ Done! All images generated in public/generated/mood-v3/');
}

main();

