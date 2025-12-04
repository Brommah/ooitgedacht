import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";
import https from "https";
import { fileURLToPath } from "url";

// Setup paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_DIR = path.join(__dirname, "../public/generated/mood-v3");

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

// Dutch New Build Styles Configuration - v3 PROMPTS
const STYLES = [
  {
    id: "1",
    filename: "scandinavian-modern.png",
    prompt: "Photorealistic architectural shot of a modern Dutch timber-frame home ('Houtbouw') on a new-build plot ('bouwkavel') in Almere Oosterwold. Vertical greying wood cladding, black window frames, wildflowers in the foreground. Overcast Dutch sky. 2k resolution."
  },
  {
    id: "2",
    filename: "dutch-barn.png",
    prompt: "Photorealistic architectural shot of a luxury 'Schuurwoning' (modern barn house) in the Dutch polder. Thatched roof ('rietkap'), black wooden facade, large glass pui. Situated on a meadow plot with a ditch ('sloot') and reeds. Golden hour. 2k resolution."
  },
  {
    id: "3",
    filename: "industrial-loft.png",
    prompt: "Photorealistic architectural shot of a robust industrial new-build home in a Dutch urban renewal area (e.g. Strijp-S). Red brick mixed with steel and concrete. Large factory windows. Urban plot with Stelcon plates and greenery. Soft daylight. 2k resolution."
  },
  {
    id: "4",
    filename: "notaris-woning.png",
    prompt: "Photorealistic architectural shot of a classic new-build 'Notariswoning' on a spacious plot. Symmetrical facade, dark brick, ceramic tile roof, grand entrance with hardstone. Manicured front garden with boxwood and gravel. Blue sky with cumulus clouds. 2k resolution."
  },
  {
    id: "5",
    filename: "japandi-zen.png",
    prompt: "Photorealistic architectural shot of a minimalist white stucco villa in the Netherlands. Japandi style with light wood accents and a flat roof. Zen garden with gravel and a single tree. Soft, serene morning light. 2k resolution."
  },
  {
    id: "6",
    filename: "classic-herenhuis.png",
    prompt: "Photorealistic architectural shot of a new-build 'Herenhuis' row in a 1930s style Dutch neighborhood (e.g. Vathorst). Orange-red brick, deep roof overhangs, bay window. Street view with young trees. Warm evening light. 2k resolution."
  },
  {
    id: "7",
    filename: "eco-cabin.png",
    prompt: "Photorealistic architectural shot of a sustainable 'Bosvilla' on a wooded plot in the Veluwe. Dark wood, sedum green roof, integrated into the forest. Dappled sunlight filtering through pine trees. Nature-inclusive design. 2k resolution."
  },
  {
    id: "8",
    filename: "glass-villa.png",
    prompt: "Photorealistic architectural shot of an ultra-modern glass villa at the water's edge in the Netherlands. Floating concrete floors, floor-to-ceiling glass. Reflections in the water, reeds in foreground. Blue hour twilight. 2k resolution."
  }
];

async function generateImage(style) {
  console.log(`🎨 Generating ${style.filename}...`);
  
  try {
    const response = await client.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: [{ text: style.prompt }] },
      config: { 
        responseModalities: ['IMAGE'],
        // @ts-ignore
        imageConfig: {
            aspectRatio: '4:3',
            imageSize: '2K'
        }
      }
    });

    const part = response.candidates?.[0]?.content?.parts?.[0];
    if (!part || !part.inlineData) {
        console.log("Response structure:", JSON.stringify(response, null, 2));
        throw new Error("No image data returned");
    }

    const buffer = Buffer.from(part.inlineData.data, 'base64');
    fs.writeFileSync(path.join(OUTPUT_DIR, style.filename), buffer);
    console.log(`✅ Saved to public/generated/mood-v3/${style.filename}`);
    
  } catch (error) {
    console.error(`❌ Failed to generate ${style.filename}:`, error.message);
  }
}

async function main() {
  console.log("🚀 Starting Batch Generation (v3 - Gemini 3 Pro)...");
  for (const style of STYLES) {
    await generateImage(style);
    // Short delay to be safe
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  console.log("✨ Done!");
}

main();






