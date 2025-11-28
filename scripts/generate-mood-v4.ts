/**
 * Generate Dutch New-Build Mood Board Images v4
 * Run with: npx tsx scripts/generate-mood-v4.ts
 */

import { GoogleGenAI } from "@google/genai";
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';

if (!API_KEY) {
  console.error('❌ No API key found');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// 8 Dutch new-build house styles
const MOOD_STYLES = [
  {
    filename: 'moderne-villa.png',
    name: 'Moderne Villa',
    prompt: `
Stunning modern Dutch villa photograph. New construction home with clean architectural lines.
Features: large floor-to-ceiling windows, combination of dark brick and white render, pitched roof with dark tiles, integrated garage, beautiful Dutch garden with ornamental grasses.
Setting: Green Dutch polder landscape, golden hour lighting.
Style: Architectural photography, magazine quality, no people.
IMPORTANT: NO TEXT of any kind in the image.
    `.trim()
  },
  {
    filename: 'landelijke-schuur.png',
    name: 'Landelijke Schuur',
    prompt: `
Beautiful modern Dutch barn house photograph. Contemporary schuurwoning new construction.
Features: Black-stained vertical timber cladding, thatched roof (rieten dak), large glass windows, high ceilings visible, wooden deck terrace, modern country aesthetic.
Setting: Rural Dutch landscape with water and reeds, willow trees in background.
Style: Architectural photography, warm afternoon light, no people.
IMPORTANT: NO TEXT of any kind in the image.
    `.trim()
  },
  {
    filename: 'klassiek-nederlands.png',
    name: 'Klassiek Nederlands',
    prompt: `
Classic Dutch new-build house photograph. Traditional Dutch architecture with modern amenities.
Features: Warm red-brown brick walls, white window frames, pitched tile roof with dormers, bay window, neat hedges, brick driveway.
Setting: Dutch residential street, well-maintained gardens, mature trees.
Style: Real estate photography quality, daylight, welcoming atmosphere, no people.
IMPORTANT: NO TEXT of any kind in the image.
    `.trim()
  },
  {
    filename: 'eco-woning.png',
    name: 'Eco Woning',
    prompt: `
Sustainable eco house photograph. Modern Dutch energy-positive home new construction.
Features: Living green sedum roof, natural timber cladding, triple-glazed windows, solar panels integrated into design, heat pump visible, rainwater collection, native garden plants.
Setting: Natural Dutch setting with trees, sustainable landscaping.
Style: Architectural photography showing sustainability, bright daylight, no people.
IMPORTANT: NO TEXT of any kind in the image.
    `.trim()
  },
  {
    filename: 'kubistische-woning.png',
    name: 'Kubistische Woning',
    prompt: `
Striking cubist architecture house photograph. Modern Dutch cubic villa new construction.
Features: Pure white rendered walls, flat roof, geometric cube volumes, floor-to-ceiling windows, minimalist design, clean lines, concrete and glass, architectural statement.
Setting: Contemporary Dutch neighborhood, designer landscaping.
Style: High-end architectural photography, dramatic shadows, no people.
IMPORTANT: NO TEXT of any kind in the image.
    `.trim()
  },
  {
    filename: 'vrijstaande-twee-kapper.png',
    name: 'Ruime Twee-Kapper',
    prompt: `
Beautiful Dutch semi-detached house photograph. Modern twee-onder-een-kap new construction.
Features: Two connected homes with individual character, mix of brick and render, shared pitched roof, private gardens, driveways, bay windows, practical family homes.
Setting: Modern Dutch residential area, family-friendly neighborhood.
Style: Real estate photography, welcoming daylight, no people.
IMPORTANT: NO TEXT of any kind in the image.
    `.trim()
  },
  {
    filename: 'bungalow.png',
    name: 'Moderne Bungalow',
    prompt: `
Modern Dutch bungalow photograph. Single-story contemporary home new construction.
Features: Everything on one floor, low-profile design, large windows at garden level, flat or gentle sloped roof, accessible entrance, spacious terrace, connected to large garden.
Setting: Spacious Dutch plot with mature landscaping.
Style: Lifestyle architectural photography, afternoon light, no people.
IMPORTANT: NO TEXT of any kind in the image.
    `.trim()
  },
  {
    filename: 'herenhuis.png',
    name: 'Statig Herenhuis',
    prompt: `
Stately Dutch townhouse photograph. Three-story herenhuis new construction.
Features: Three floors with distinctive facade, dark brick with white accents, tall windows, decorative elements, small front garden with iron fence, urban elegance.
Setting: Upscale Dutch urban street, tree-lined avenue.
Style: Premium real estate photography, sophisticated atmosphere, no people.
IMPORTANT: NO TEXT of any kind in the image.
    `.trim()
  },
];

async function generateImage(style: typeof MOOD_STYLES[0]): Promise<void> {
  console.log(`\n🎨 Generating: ${style.name}...`);
  
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
          
          const outputDir = path.join(__dirname, '../public/generated/mood-v4');
          if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
          }
          
          const outputPath = path.join(outputDir, style.filename);
          fs.writeFileSync(outputPath, buffer);
          console.log(`   ✅ Saved: ${style.filename}`);
          return;
        }
      }
    }
    console.error(`   ❌ No image generated for ${style.name}`);
  } catch (error) {
    console.error(`   ❌ Error:`, error);
  }
}

async function main() {
  console.log('🏠 Generating Dutch New-Build Mood Board Images v4\n');
  console.log('═'.repeat(50));
  
  for (let i = 0; i < MOOD_STYLES.length; i++) {
    console.log(`\n[${i + 1}/${MOOD_STYLES.length}]`);
    await generateImage(MOOD_STYLES[i]);
    
    if (i < MOOD_STYLES.length - 1) {
      console.log('   ⏳ Waiting 3 seconds...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  console.log('\n' + '═'.repeat(50));
  console.log('✨ Done! All mood board images generated.');
  console.log('   Location: public/generated/mood-v4/');
}

main();

