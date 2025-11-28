/**
 * Generate Factory Line Section Images using Gemini
 * Run with: npx tsx scripts/generate-factory-line-images.ts
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

const FACTORY_LINE_IMAGES = [
  {
    filename: 'step-01-vibe-stijl.jpg',
    description: 'Step 1: Vibe & Stijl - Style Selection',
    prompt: `
LIFESTYLE ARCHITECTURAL MOOD BOARD PHOTOGRAPH

Create a beautiful, aspirational image representing the concept of choosing your dream home style.

THE SCENE:
A curated collection/collage feel showing different Dutch architectural styles:
- A glimpse of a modern wooden polder house
- A traditional thatched roof detail
- Material samples: warm brick, natural wood, white render
- Soft fabric swatches in natural tones
- Architectural sketches partially visible
- A coffee cup suggesting a design consultation moment

COMPOSITION:
- Flat lay / mood board aesthetic
- Warm, inviting tones
- Natural materials dominating
- Soft morning light
- 4:3 aspect ratio

STYLE:
- Pinterest-worthy aesthetic
- Interior design magazine quality
- Warm and approachable
- Premium but not cold
- Tactile, you can almost feel the materials

COLOR PALETTE:
- Warm whites and creams
- Natural wood tones
- Soft terracotta
- Sage green accents
- Touch of brass/gold

NO: People, text, logos, cluttered composition, harsh shadows
    `.trim()
  },
  {
    filename: 'step-02-kavel-check.jpg',
    description: 'Step 2: Kavel Check - Plot Analysis',
    prompt: `
AERIAL PHOTOGRAPH - Dutch Building Plot Analysis

A stunning aerial/drone photograph of a Dutch building plot ready for construction.

THE SCENE:
- Empty building plot with clear boundaries marked
- Surrounding Dutch landscape visible
- Neighboring houses showing the neighborhood context
- Survey stakes or markers visible on the plot
- Beautiful polder or suburban Dutch setting

DETAILS:
- Plot clearly defined with temporary fencing or markers
- Access road visible
- Utilities connection points suggested
- Mature trees on plot boundaries
- Well-maintained surrounding area

ATMOSPHERE:
- Golden hour aerial shot
- Warm, optimistic feeling
- Sense of possibility and potential
- Professional survey documentation feel

STYLE:
- Drone photography aesthetic
- Sharp and detailed
- Professional real estate quality
- Slightly elevated angle (not directly overhead)

COLOR PALETTE:
- Green grass of the plot
- Blue Dutch sky with white clouds
- Warm brick of neighboring homes
- Earth tones

NO: People, construction equipment, text, watermarks, ugly/industrial surroundings
    `.trim()
  },
  {
    filename: 'step-03-paspoort.jpg',
    description: 'Step 3: Het Paspoort - Documentation',
    prompt: `
PROFESSIONAL DOCUMENTATION PHOTOGRAPH

A sophisticated flat-lay photograph representing official building documentation and permits.

THE SCENE:
- Official-looking documents with architectural drawings
- A premium leather portfolio or folder
- Architectural floor plans partially visible
- A quality pen (Mont Blanc style)
- Official stamps or seals suggested (not readable)
- A small 3D printed house model
- Quality paper with watermarks

COMPOSITION:
- Elegant flat lay arrangement
- Diagonal composition for dynamism
- Selective focus on key elements
- Premium desktop surface (dark wood or marble)

ATMOSPHERE:
- Professional and trustworthy
- Premium service feeling
- Official but not bureaucratic
- Success and accomplishment

STYLE:
- Corporate photography quality
- Clean and organized
- Luxurious details
- Editorial quality

DETAILS:
- Subtle gold or embossed elements
- Quality materials throughout
- Everything perfectly aligned
- Sense of order and professionalism

NO: Readable text, people, messy arrangement, cheap materials, bright colors
    `.trim()
  },
  {
    filename: 'step-04-bouw-os.jpg',
    description: 'Step 4: De Bouw OS - Construction Dashboard',
    prompt: `
CONSTRUCTION PROGRESS PHOTOGRAPH

A beautiful photograph of a Dutch house under construction, showing professional progress.

THE SCENE:
- Modern Dutch house mid-construction
- Timber frame / CLT structure clearly visible
- Clean, organized construction site
- Building materials neatly stacked
- Scaffolding with safety measures
- Blue sky with Dutch clouds

THE HOUSE:
- Contemporary Dutch architecture taking shape
- Pitched roof structure visible
- Large window openings framed
- Quality construction visible
- About 60% complete

ATMOSPHERE:
- Productive and professional
- Progress and momentum
- Quality craftsmanship evident
- Optimistic and exciting

LIGHTING:
- Bright daylight
- Clear visibility of details
- Some dramatic clouds for interest
- Warm tones on the wood

STYLE:
- Documentary photography
- Professional construction documentation
- Magazine editorial quality
- Sharp and detailed

NO: Workers/people, text, safety violations, messy site, ugly surroundings, equipment brands visible
    `.trim()
  },
];

async function generateImage(image: typeof FACTORY_LINE_IMAGES[0]): Promise<void> {
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
          const outputPath = path.join(__dirname, '../public/generated/steps', image.filename);
          
          // Ensure directory exists
          const dir = path.dirname(outputPath);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          
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
  console.log('🏗️ Generating Factory Line Step Images...\n');
  console.log('═'.repeat(60));
  console.log(`API Key: ${API_KEY.substring(0, 10)}...`);
  console.log(`Images to generate: ${FACTORY_LINE_IMAGES.length}`);
  console.log('═'.repeat(60));
  
  for (let i = 0; i < FACTORY_LINE_IMAGES.length; i++) {
    const image = FACTORY_LINE_IMAGES[i];
    console.log(`\n[${i + 1}/${FACTORY_LINE_IMAGES.length}]`);
    await generateImage(image);
    
    if (i < FACTORY_LINE_IMAGES.length - 1) {
      console.log('   ⏳ Waiting 3 seconds...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  console.log('\n' + '═'.repeat(60));
  console.log('✨ Done! Factory Line images generated.');
  console.log('   Location: public/generated/steps/');
  console.log('═'.repeat(60));
}

main();

