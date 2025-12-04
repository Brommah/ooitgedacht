/**
 * Regenerate the construction image without text
 * Run with: npx tsx scripts/regenerate-bouw-image.ts
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

async function main() {
  console.log('🏗️ Regenerating construction image...');
  
  const prompt = `
A beautiful photograph of a Dutch house under construction. The timber frame structure is clearly visible with the pitched roof taking shape. Scaffolding surrounds the building. Blue sky with Dutch clouds in the background. Building materials are neatly stacked on site. The image shows professional construction quality with CLT/timber frame visible. Modern Dutch architecture style house about 60% complete. Clean construction site with no workers visible. Warm daylight illuminates the wooden structure.

IMPORTANT: This is a photograph only. Do not add any text, labels, titles, captions, watermarks, or overlay text of any kind. The image should be purely visual with no written content whatsoever.
  `.trim();
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp-image-generation',
      contents: {
        parts: [{ text: prompt }]
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
          const outputPath = path.join(__dirname, '../public/generated/steps/step-04-bouw-os.jpg');
          fs.writeFileSync(outputPath, buffer);
          console.log('✅ Saved: step-04-bouw-os.jpg');
          return;
        }
      }
    }
    console.error('❌ No image generated');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

main();






