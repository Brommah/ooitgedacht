import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Setup paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_DIR = path.join(__dirname, "../public/generated");

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

// Market Report Image Prompt
const MARKET_REPORT_PROMPT = `
Photorealistic professional photograph of a modern Dutch housing market analysis report displayed on a sleek 27-inch monitor in a contemporary office setting.

THE REPORT ON SCREEN MUST SHOW:
- Dark blue/navy UI design (#0a1628 background) with white and blue text
- Large headline: "Nederlandse Woningmarkt 2025"
- Key statistics visible: "401.000 tekort", "€5 miljard faalkosten", "77% over budget"
- Modern data visualization: bar charts showing housing shortage, pie chart of cost breakdown
- Clean dashboard layout with cards and statistics
- Bureau Broersma logo in corner (simple architectural firm logo)

SETTING:
- Modern minimalist desk with architectural blueprints partially visible
- Soft ambient lighting from the left
- Blurred background showing modern office interior
- Small plant or architectural model in periphery
- Professional, trustworthy atmosphere

STYLE:
- Magazine-quality photography (Architectural Digest / Bloomberg style)
- Sharp focus on the screen content
- Warm but professional lighting
- 16:9 aspect ratio
- Ultra high quality, photorealistic

DO NOT INCLUDE:
- People or hands
- Text that is unreadable or gibberish
- Cluttered desk
- Harsh lighting or shadows
- Any watermarks or logos other than Bureau Broersma
`.trim();

async function generateMarketReportImage() {
  console.log("🚀 Generating market report preview image...");
  console.log("📝 Prompt:", MARKET_REPORT_PROMPT.substring(0, 200) + "...");

  try {
    const response = await client.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: {
        parts: [{ text: MARKET_REPORT_PROMPT }]
      },
      config: {
        responseModalities: ["TEXT", "IMAGE"],
      },
    });

    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData?.mimeType?.startsWith("image/")) {
          const imageData = part.inlineData.data;
          const outputPath = path.join(OUTPUT_DIR, "market-report-preview.png");
          
          // Save base64 image to file
          fs.writeFileSync(outputPath, Buffer.from(imageData, "base64"));
          console.log(`✅ Image saved to: ${outputPath}`);
          return;
        }
      }
    }
    
    console.error("❌ No image found in response");
    console.log("Response:", JSON.stringify(response, null, 2));
  } catch (error) {
    console.error("❌ Generation failed:", error.message);
    
    // Create a placeholder if generation fails
    console.log("📝 Creating placeholder text file...");
    const placeholderPath = path.join(OUTPUT_DIR, "market-report-preview.txt");
    fs.writeFileSync(placeholderPath, "Image generation failed. Please run script again with valid GEMINI_API_KEY.");
  }
}

// Run
generateMarketReportImage();

