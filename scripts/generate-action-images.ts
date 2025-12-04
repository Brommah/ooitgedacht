/**
 * Generate Action Popup Images
 * 
 * Creates images for customer decision cards in the dashboard:
 * - Dakpannen (roof tiles)
 * - Keuken (kitchen)
 * - Badkamer (bathroom)
 * - Vloeren (flooring)
 * - Kozijnen (window frames)
 * 
 * Usage: npx tsx scripts/generate-action-images.ts
 */
import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: '.env.local' });

// Setup paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_DIR = path.join(__dirname, "../public/generated/actions");

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Initialize Gemini
const API_KEY = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("❌ Please provide VITE_GEMINI_API_KEY or GEMINI_API_KEY env variable");
  process.exit(1);
}
const client = new GoogleGenAI({ apiKey: API_KEY });

interface ImageConfig {
  filename: string;
  prompt: string;
  category: string;
}

// All images needed for action popups
const IMAGES: ImageConfig[] = [
  // === DAKPANNEN (Roof Tiles) ===
  {
    category: "Dakpannen",
    filename: "dakpannen-ceramic-antraciet.png",
    prompt: "Professional product photography of dark anthracite gray ceramic roof tiles on a modern Dutch new-build house. Close-up detail shot showing the matte texture and clean lines. Golden hour sunlight casting soft shadows. Architecture photography style, high-end real estate quality. 4:3 aspect ratio."
  },
  {
    category: "Dakpannen",
    filename: "dakpannen-ceramic-rood.png",
    prompt: "Professional product photography of classic red ceramic roof tiles on a traditional Dutch home. Close-up detail shot showing warm terracotta color and authentic texture. Soft natural daylight. Architecture photography style showing craftsmanship. 4:3 aspect ratio."
  },
  {
    category: "Dakpannen",
    filename: "dakpannen-beton-zwart.png",
    prompt: "Professional product photography of modern matte black concrete roof tiles on a contemporary minimalist Dutch home. Close-up detail shot showing sleek flat profile. Overcast sky providing even lighting. Architectural photography style. 4:3 aspect ratio."
  },
  
  // === KEUKEN (Kitchen) ===
  {
    category: "Keuken",
    filename: "keuken-modern-wit.png",
    prompt: "Interior photography of a modern white handleless kitchen in a Dutch new-build home. White lacquer cabinets, white composite countertop, integrated Siemens appliances. Large window with natural light. Clean Scandinavian design, bright and airy atmosphere. High-end real estate photography. 4:3 aspect ratio."
  },
  {
    category: "Keuken",
    filename: "keuken-hout-naturel.png",
    prompt: "Interior photography of a warm natural oak kitchen in a Dutch home. Light oak wood cabinet fronts with subtle grain, white marble countertop with gray veining. Brass hardware accents. Soft morning light from window. Cozy Scandinavian-modern design. High-end interior photography. 4:3 aspect ratio."
  },
  {
    category: "Keuken",
    filename: "keuken-industrial-zwart.png",
    prompt: "Interior photography of an industrial black kitchen in a modern Dutch loft. Matte black cabinet fronts, concrete-look countertop, exposed copper pipe accents. Edison bulb pendant lights. Moody atmospheric lighting. Urban industrial design aesthetic. High-end interior photography. 4:3 aspect ratio."
  },
  
  // === BADKAMER (Bathroom) ===
  {
    category: "Badkamer",
    filename: "badkamer-terrazzo-wit.png",
    prompt: "Interior photography of a modern bathroom with white terrazzo tiles featuring colorful speckles. Walk-in rain shower, floating oak vanity, round mirror with LED backlight. Natural light from frosted window. Spa-like Scandinavian design. High-end interior photography. 4:3 aspect ratio."
  },
  {
    category: "Badkamer",
    filename: "badkamer-marmer-grijs.png",
    prompt: "Interior photography of a luxurious bathroom with large format gray marble-effect porcelain tiles with white veining. Freestanding white bathtub, brass fixtures, frameless glass shower. Elegant hotel bathroom design. Soft ambient lighting. High-end interior photography. 4:3 aspect ratio."
  },
  {
    category: "Badkamer",
    filename: "badkamer-betonlook.png",
    prompt: "Interior photography of an industrial-style bathroom with large anthracite concrete-look tiles. Black matte fixtures, wall-hung toilet, curbless shower with black frame. Minimalist urban design. Moody atmospheric lighting. High-end interior photography. 4:3 aspect ratio."
  },
  
  // === VLOEREN (Flooring) ===
  {
    category: "Vloeren",
    filename: "vloeren-eiken-naturel.png",
    prompt: "Interior photography close-up of natural oak wide plank hardwood flooring in a Dutch living room. Warm honey tones with visible wood grain. Sunlight casting shadows across the floor. White walls and modern furniture partially visible. High-end real estate photography. 4:3 aspect ratio."
  },
  {
    category: "Vloeren",
    filename: "vloeren-visgraat-gerookt.png",
    prompt: "Interior photography of dark smoked oak herringbone parquet flooring in an elegant Dutch home. Rich brown-gray tones in classic herringbone pattern. Soft daylight from large window. Traditional craftsmanship meets modern interior. High-end interior photography. 4:3 aspect ratio."
  },
  {
    category: "Vloeren",
    filename: "vloeren-pvc-lichtgrijs.png",
    prompt: "Interior photography of light gray wood-look luxury vinyl plank flooring in a modern Dutch apartment. Subtle grain texture, clean and contemporary. Open plan living space with white kitchen visible. Bright and airy atmosphere. High-end real estate photography. 4:3 aspect ratio."
  },
  
  // === KOZIJNEN (Window Frames) ===
  {
    category: "Kozijnen",
    filename: "kozijnen-antraciet.png",
    prompt: "Exterior photography close-up of anthracite gray RAL 7016 aluminum window frames on a modern Dutch new-build home. Triple glazing visible. Clean lines and contemporary design. White stucco facade background. Soft overcast daylight. Architectural detail photography. 4:3 aspect ratio."
  },
  {
    category: "Kozijnen",
    filename: "kozijnen-zwart.png",
    prompt: "Exterior photography close-up of jet black RAL 9005 window frames on a minimalist Dutch home. Floor-to-ceiling windows with thin profiles. White brick facade contrasting with black frames. Modern Bauhaus-inspired design. Architectural detail photography. 4:3 aspect ratio."
  },
  {
    category: "Kozijnen",
    filename: "kozijnen-cremewit.png",
    prompt: "Exterior photography close-up of cream white RAL 9001 traditional-style window frames on a classic Dutch home. Decorative muntins, shutters partially visible. Red brick facade. Warm afternoon sunlight. Traditional Dutch architecture detail photography. 4:3 aspect ratio."
  },
];

async function generateImage(config: ImageConfig): Promise<boolean> {
  console.log(`🎨 [${config.category}] Generating ${config.filename}...`);
  
  try {
    const response = await client.models.generateContent({
      model: 'imagen-3.0-generate-002',
      contents: { parts: [{ text: config.prompt }] },
      config: { 
        responseModalities: ['IMAGE'],
        imageConfig: {
          aspectRatio: '4:3',
        }
      } as any
    });

    const part = response.candidates?.[0]?.content?.parts?.[0];
    if (!part || !(part as any).inlineData) {
      console.log("Response structure:", JSON.stringify(response, null, 2).slice(0, 500));
      throw new Error("No image data returned");
    }

    const buffer = Buffer.from((part as any).inlineData.data, 'base64');
    const outputPath = path.join(OUTPUT_DIR, config.filename);
    fs.writeFileSync(outputPath, buffer);
    console.log(`✅ Saved: ${config.filename}`);
    return true;
    
  } catch (error: any) {
    console.error(`❌ Failed to generate ${config.filename}:`, error.message);
    return false;
  }
}

async function main() {
  console.log("🚀 Generating Action Popup Images for Dashboard...\n");
  console.log(`📁 Output directory: ${OUTPUT_DIR}\n`);
  
  let successCount = 0;
  let failCount = 0;
  
  // Group by category for better logging
  const categories = [...new Set(IMAGES.map(i => i.category))];
  
  for (const category of categories) {
    console.log(`\n📂 ${category}`);
    console.log("─".repeat(40));
    
    const categoryImages = IMAGES.filter(i => i.category === category);
    
    for (const config of categoryImages) {
      const success = await generateImage(config);
      if (success) {
        successCount++;
      } else {
        failCount++;
      }
      // Rate limiting delay
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log("\n" + "═".repeat(40));
  console.log(`✨ Generation complete!`);
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Failed: ${failCount}`);
  console.log("═".repeat(40));
}

main();

