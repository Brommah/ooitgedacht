import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Setup paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_DIR = path.join(__dirname, "../public/generated/actions");

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Initialize Gemini
const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("❌ Please provide GEMINI_API_KEY env variable");
  process.exit(1);
}
const client = new GoogleGenAI({ apiKey: API_KEY });

/**
 * Action Popup Images Configuration
 * 
 * All images for customer decision popups:
 * - Dakpannen (roof tiles)
 * - Keuken (kitchen)
 * - Badkamer (bathroom)
 * - Vloeren (flooring)
 * - Kozijnen (window frames)
 */
const ACTION_IMAGES = [
  // ===== DAKPANNEN (Roof Tiles) =====
  {
    id: "dakpannen-ceramic-antraciet",
    filename: "dakpannen-ceramic-antraciet.png",
    prompt: "Professional product photography of dark anthracite grey ceramic roof tiles ('dakpannen') on a modern Dutch house. Close-up detail shot showing the matte texture and interlocking pattern. Clean white sky background. The tiles have a timeless, elegant appearance. Studio quality lighting, high-end real estate photography style. 4:3 aspect ratio."
  },
  {
    id: "dakpannen-ceramic-rood",
    filename: "dakpannen-ceramic-rood.png",
    prompt: "Professional product photography of classic red terracotta ceramic roof tiles ('dakpannen') on a traditional Dutch farmhouse. Warm, authentic appearance with natural color variation. Close-up detail showing the traditional wave pattern. Soft golden hour sunlight. Studio quality lighting, high-end real estate photography style. 4:3 aspect ratio."
  },
  {
    id: "dakpannen-beton-zwart",
    filename: "dakpannen-beton-zwart.png",
    prompt: "Professional product photography of modern matte black concrete roof tiles on a contemporary minimalist Dutch villa. Sleek, flat profile with sharp lines. Close-up showing the smooth texture and precision edges. Dramatic architectural photography style with soft shadows. Studio quality, high-end real estate photography. 4:3 aspect ratio."
  },

  // ===== KEUKEN (Kitchen) =====
  {
    id: "keuken-modern-wit",
    filename: "keuken-modern-wit.png",
    prompt: "Interior photography of a modern minimalist white kitchen in a Dutch new-build home. Handleless white high-gloss cabinets, white composite countertop, integrated Siemens appliances, subtle LED under-cabinet lighting. Large window with garden view. Scandinavian clean aesthetic. Professional interior photography, soft natural daylight. 4:3 aspect ratio."
  },
  {
    id: "keuken-hout-naturel",
    filename: "keuken-hout-naturel.png",
    prompt: "Interior photography of a warm natural oak kitchen in a luxury Dutch home. Vertical grain oak cabinet fronts, white Carrara marble countertop and backsplash, brass fixtures and handles. Island with waterfall edge. Japandi style meets Dutch design. Professional interior photography, warm afternoon light. 4:3 aspect ratio."
  },
  {
    id: "keuken-industrial-zwart",
    filename: "keuken-industrial-zwart.png",
    prompt: "Interior photography of an industrial black kitchen in a modern loft-style Dutch home. Matte black cabinet fronts, concrete-look composite countertop, exposed copper pipes as design element, brass pendant lights. Open shelving with cookware. Professional interior photography, moody atmospheric lighting. 4:3 aspect ratio."
  },

  // ===== BADKAMER (Bathroom) =====
  {
    id: "badkamer-terrazzo-wit",
    filename: "badkamer-terrazzo-wit.png",
    prompt: "Interior photography of a modern Dutch bathroom with white terrazzo tiles featuring subtle colorful chips. Walk-in rain shower with frameless glass, wall-hung white ceramic fixtures, round mirror with LED backlight. Minimalist aesthetic with plants. Professional interior photography, bright natural light. 4:3 aspect ratio."
  },
  {
    id: "badkamer-marmer-grijs",
    filename: "badkamer-marmer-grijs.png",
    prompt: "Interior photography of a luxurious Dutch bathroom with grey marble-effect large format tiles with white veining. Freestanding soaking tub, double vanity with vessel sinks, gold fixtures. Spa-like atmosphere. Professional interior photography, soft diffused lighting creating elegant shadows. 4:3 aspect ratio."
  },
  {
    id: "badkamer-betonlook",
    filename: "badkamer-betonlook.png",
    prompt: "Interior photography of an industrial Dutch bathroom with anthracite concrete-look large format tiles. Black steel-framed shower enclosure, wall-mounted toilet, floating vanity with wood accent. Matte black fixtures throughout. Professional interior photography, dramatic side lighting. 4:3 aspect ratio."
  },

  // ===== VLOEREN (Flooring) =====
  {
    id: "vloeren-eiken-naturel",
    filename: "vloeren-eiken-naturel.png",
    prompt: "Interior photography focusing on natural oak engineered hardwood flooring in a bright Dutch living room. Wide planks with subtle grain pattern, matte lacquered finish. Partial view of white couch and floor lamp. Warm Scandinavian atmosphere. Professional interior photography, soft daylight from large window. 4:3 aspect ratio."
  },
  {
    id: "vloeren-visgraat-gerookt",
    filename: "vloeren-visgraat-gerookt.png",
    prompt: "Interior photography focusing on smoked oak herringbone ('visgraat') parquet flooring in an elegant Dutch townhouse. Rich dark brown color with character. Partial view of velvet chair and brass side table. Classic meets modern aesthetic. Professional interior photography, warm afternoon light. 4:3 aspect ratio."
  },
  {
    id: "vloeren-pvc-lichtgrijs",
    filename: "vloeren-pvc-lichtgrijs.png",
    prompt: "Interior photography focusing on light grey wood-look luxury vinyl (PVC) flooring in a contemporary Dutch family home. Long planks with subtle texture, practical and modern. Partial view of modern furniture and children's toys. Clean bright atmosphere. Professional interior photography, even daylight. 4:3 aspect ratio."
  },

  // ===== KOZIJNEN (Window Frames) =====
  {
    id: "kozijnen-antraciet",
    filename: "kozijnen-antraciet.png",
    prompt: "Architectural photography of modern anthracite grey RAL 7016 aluminum window frames on a contemporary Dutch new-build home. Large floor-to-ceiling windows, slim profiles, triple glazing visible. Clean white stucco facade. Professional architectural photography, soft overcast Dutch sky. 4:3 aspect ratio."
  },
  {
    id: "kozijnen-zwart",
    filename: "kozijnen-zwart.png",
    prompt: "Architectural photography of deep black RAL 9005 aluminum window frames on a minimalist Dutch villa. Steel-look slim frames, floor-to-ceiling glazing, geometric grid pattern. Contemporary brick facade. Professional architectural photography, dramatic contrast with sky. 4:3 aspect ratio."
  },
  {
    id: "kozijnen-cremewit",
    filename: "kozijnen-cremewit.png",
    prompt: "Architectural photography of cream white RAL 9001 wooden window frames on a traditional Dutch new-build home. Classic divided light windows, warm soft white color against brick facade. Shutters visible. Professional architectural photography, warm golden hour light. 4:3 aspect ratio."
  },
];

async function generateImage(item) {
  console.log(`🎨 Generating ${item.filename}...`);
  
  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.0-flash-preview-image-generation',
      contents: { parts: [{ text: item.prompt }] },
      config: { 
        responseModalities: ['IMAGE'],
        imageConfig: {
          aspectRatio: '4:3',
        }
      }
    });

    const part = response.candidates?.[0]?.content?.parts?.[0];
    if (!part || !part.inlineData) {
      console.log("Response structure:", JSON.stringify(response, null, 2));
      throw new Error("No image data returned");
    }

    const buffer = Buffer.from(part.inlineData.data, 'base64');
    fs.writeFileSync(path.join(OUTPUT_DIR, item.filename), buffer);
    console.log(`✅ Saved to public/generated/actions/${item.filename}`);
    
  } catch (error) {
    console.error(`❌ Failed to generate ${item.filename}:`, error.message);
  }
}

async function main() {
  console.log("🚀 Starting Action Popup Image Generation...");
  console.log(`📁 Output directory: ${OUTPUT_DIR}`);
  console.log(`📷 Total images to generate: ${ACTION_IMAGES.length}\n`);

  for (const item of ACTION_IMAGES) {
    await generateImage(item);
    // Rate limiting delay
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  console.log("\n✨ Done! All action popup images generated.");
}

main();




