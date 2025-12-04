/**
 * Generate ALL Homepage Images using Gemini's latest image model
 * Run with: npx tsx scripts/generate-homepage-images.ts
 */

import { GoogleGenAI } from "@google/genai";
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';

if (!API_KEY) {
  console.error('❌ No API key found. Set VITE_GEMINI_API_KEY or GEMINI_API_KEY');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// All homepage images with dramatically improved prompts
const HOMEPAGE_IMAGES = [
  {
    filename: 'hero-new.jpg',
    description: 'Main Hero Image - Dutch Dream Home Construction',
    prompt: `
CINEMATIC ARCHITECTURAL MASTERPIECE PHOTOGRAPH

Create an absolutely STUNNING hero image for a premium Dutch home building platform.

THE SCENE:
A breathtaking modern Dutch family home under golden hour light. The house features:
- Sleek contemporary Dutch architecture with warm brick and timber cladding
- Large floor-to-ceiling windows reflecting the golden sunset
- A perfectly manicured Dutch garden with ornamental grasses
- Dramatic polder landscape stretching to the horizon
- Moody Dutch sky with beautiful cloud formations
- Warm interior lights glowing from within

COMPOSITION:
- Wide cinematic 16:9 aspect ratio
- Low angle shot making the house feel aspirational and grand
- Rule of thirds with house positioned on the left third
- Dramatic leading lines from the driveway
- Depth with garden in foreground, house in midground, sky in background

LIGHTING & MOOD:
- Golden hour / magic hour lighting
- Warm amber sunlight hitting the facade
- Cool blue shadows for contrast
- Atmospheric haze in the distance
- Interior warmth glowing through windows

STYLE:
- Ultra-photorealistic, indistinguishable from a real photograph
- Shot on Sony A7R IV with 24mm f/1.4 lens
- Magazine cover quality (Architectural Digest, Eigen Huis & Interieur)
- Rich, cinematic color grading
- Sharp focus on the house, gentle bokeh in foreground

ABSOLUTELY NO: People, cars, text, watermarks, CGI look, oversaturation
    `.trim()
  },
  {
    filename: 'polder-dak-gevel.png',
    description: 'Polder Roof & Facade Detail',
    prompt: `
ARCHITECTURAL DETAIL PHOTOGRAPH - Dutch Polder House

A stunning close-up architectural photograph showcasing the beautiful details of a Dutch polder house.

THE SUBJECT:
- Beautiful pitched roof with premium dark clay tiles
- Warm timber cladding meeting crisp white window frames
- Authentic Dutch craftsmanship visible in every detail
- Morning dew on the roof tiles catching the light
- Copper gutters with beautiful green patina

SETTING:
- Misty Dutch polder morning
- Soft diffused light through morning fog
- Reeds and water visible in the background
- Typically Dutch atmospheric conditions

COMPOSITION:
- 3/4 angle detail shot
- Focus on the junction of roof and facade
- Beautiful texture and material contrast
- Architectural precision visible

STYLE:
- Ultra-sharp detail photography
- Editorial quality for architecture magazine
- Muted, sophisticated color palette
- Professional architectural documentation

NO: People, text, watermarks, harsh shadows
    `.trim()
  },
  {
    filename: 'blueprint-wood-house.png',
    description: 'Blueprint Overlay Wood House',
    prompt: `
ARTISTIC ARCHITECTURAL VISUALIZATION

A stunning conceptual image showing a wooden house emerging from architectural blueprints.

THE CONCEPT:
- Left side: Detailed technical architectural blueprints and floor plans
- Right side: The realized wooden house in photorealistic detail
- Beautiful transition/blend between drawing and reality
- Shows the journey from design to completion

THE HOUSE:
- Modern CLT (Cross-Laminated Timber) construction
- Warm honey-toned wood cladding
- Large windows with slim black frames
- Green sedum roof
- Dutch contemporary design

STYLE:
- Artistic double-exposure effect
- Blueprint lines in classic blue ink color
- Seamless blend between technical and real
- Premium visualization quality
- Sophisticated and premium feel

COLOR PALETTE:
- Blueprint blue (#1a3a5c)
- Warm wood tones
- White paper background fading to real sky
- Subtle golden hour lighting on the real portion

NO: People, text overlays, cheap CGI look, busy composition
    `.trim()
  },
  {
    filename: 'polder-construction-crane.jpg',
    description: 'Construction Phase in Polder',
    prompt: `
DOCUMENTARY CONSTRUCTION PHOTOGRAPH

A powerful image of Dutch home construction in progress, showing the building process.

THE SCENE:
- A modern Dutch house mid-construction
- CLT/timber frame structure visible
- Construction crane silhouetted against dramatic sky
- Workers' materials neatly organized (no workers visible)
- Dutch polder landscape surrounding the site

ATMOSPHERE:
- Early morning "blue hour" transitioning to golden hour
- Dramatic sky with beautiful cloud formations
- Sense of progress and possibility
- Professional construction site

DETAILS:
- Scaffolding around the structure
- Building materials stacked
- Foundation and structural work visible
- Safety barriers and professional setup

STYLE:
- Documentary photography aesthetic
- Cinematic wide shot
- Dramatic lighting
- Editorial quality
- Inspiring and aspirational feel

NO: People/workers visible, text, watermarks, messy/unsafe site appearance
    `.trim()
  },
  {
    filename: 'thatched-systems.png',
    description: 'Thatched Roof House with Modern Systems',
    prompt: `
ARCHITECTURAL PHOTOGRAPH - Traditional Meets Technology

A stunning photograph of a traditional Dutch thatched roof house that seamlessly integrates modern sustainable technology.

THE HOUSE:
- Authentic thick THATCHED ROOF (rieten dak) - golden-brown reed thatch
- Traditional Dutch schuurwoning (barn house) architecture
- Dark timber cladding or white-washed walls
- Beautifully integrated solar panels on south-facing roof section
- Modern heat pump unit discretely placed
- Traditional white window frames

SETTING:
- Waterside location with wooden jetty
- Dutch polder landscape
- Reeds growing by the water
- Mature willows in background

LIGHTING:
- Soft afternoon light
- Warm golden tones on the thatch
- Reflections in the water
- Atmospheric Dutch sky

MESSAGE:
- Shows how traditional architecture embraces modern sustainability
- Heritage and innovation combined
- Timeless yet future-ready

STYLE:
- Magazine editorial quality
- Rich, warm color palette
- Perfect balance of traditional and modern
- Aspirational lifestyle photography

NO: People, cars, text, watermarks
    `.trim()
  },
  {
    filename: 'coastal-modern-blueprint.png',
    description: 'Coastal Modern House Blueprint Style',
    prompt: `
ARCHITECTURAL BLUEPRINT VISUALIZATION

A sophisticated blueprint-style visualization of a modern Dutch coastal villa.

THE DESIGN:
- Clean architectural line drawing style
- Modern Dutch coastal villa design
- Multiple levels with large terraces
- Floor-to-ceiling windows facing the sea
- Flat roof with rooftop terrace
- Integrated garage

BLUEPRINT STYLE:
- Classic blueprint blue background (#0a1628 to #1a3a5c gradient)
- White/light blue technical lines
- Proper architectural drawing conventions
- Section views and elevations
- Dimension lines and annotations (decorative, not readable)
- Grid pattern background

COMPOSITION:
- Main elevation view prominent
- Small floor plan in corner
- Detail callouts for key features
- Professional drafting quality

AESTHETIC:
- Premium technical illustration
- Sophisticated and professional
- Hints at luxury and precision
- Clean, minimal, elegant

NO: Photorealistic elements, people, text that needs to be read, cluttered composition
    `.trim()
  },
  {
    filename: 'forest-house-systems.jpg',
    description: 'Forest House with Smart Home Systems',
    prompt: `
ARCHITECTURAL PHOTOGRAPHY - Biophilic Smart Home

A breathtaking photograph of a modern forest house that showcases sustainable living and smart home technology.

THE HOUSE:
- Stunning modern architecture integrated into forest setting
- Large glass walls bringing nature inside
- Living green SEDUM ROOF blending with surrounding trees
- Natural materials: wood, stone, glass
- Subtle smart home elements visible (discrete sensors, lighting)
- Solar panels integrated into roof design

SETTING:
- Surrounded by mature pine and birch forest
- Dappled sunlight through tree canopy
- Natural landscaping with native plants
- Morning mist creating atmosphere

THE TECHNOLOGY (subtle):
- Ambient lighting glowing from within
- Smart glass windows
- Integrated outdoor lighting
- EV charger visible in carport
- Modern heat pump unit

MOOD:
- Peaceful, zen-like retreat
- Connection with nature
- Sustainable luxury
- The future of living

STYLE:
- High-end architectural photography
- Shot during magic hour
- Warm and inviting
- Editorial quality for premium magazine

NO: People, obvious technology, text, watermarks, harsh lighting
    `.trim()
  },
];

async function generateImage(image: typeof HOMEPAGE_IMAGES[0]): Promise<void> {
  console.log(`\n🎨 Generating: ${image.description}...`);
  console.log(`   File: ${image.filename}`);
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp-image-generation',
      contents: {
        parts: [{ text: image.prompt }]
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
          const outputPath = path.join(__dirname, '../public/generated', image.filename);
          fs.writeFileSync(outputPath, buffer);
          console.log(`   ✅ Saved: ${image.filename}`);
          return;
        }
      }
    }
    console.error(`   ❌ No image generated for ${image.description}`);
  } catch (error) {
    console.error(`   ❌ Error generating ${image.description}:`, error);
  }
}

async function main() {
  console.log('🏠 Generating ALL Homepage Images with Gemini...\n');
  console.log('═'.repeat(60));
  console.log(`API Key: ${API_KEY.substring(0, 10)}...`);
  console.log(`Images to generate: ${HOMEPAGE_IMAGES.length}`);
  console.log('═'.repeat(60));
  
  // Generate all images sequentially to avoid rate limits
  for (let i = 0; i < HOMEPAGE_IMAGES.length; i++) {
    const image = HOMEPAGE_IMAGES[i];
    console.log(`\n[${i + 1}/${HOMEPAGE_IMAGES.length}]`);
    await generateImage(image);
    
    // Delay between requests to avoid rate limits
    if (i < HOMEPAGE_IMAGES.length - 1) {
      console.log('   ⏳ Waiting 3 seconds...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  console.log('\n' + '═'.repeat(60));
  console.log('✨ Done! All homepage images generated.');
  console.log('   Location: public/generated/');
  console.log('═'.repeat(60));
}

main();






