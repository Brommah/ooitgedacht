/**
 * Generate Construction Milestone Images for Ooit Gedacht Dashboard
 * Run with: npm run generate:milestones
 * 
 * This generates photorealistic images for each construction phase/milestone
 */

import 'dotenv/config';
import { GoogleGenAI } from "@google/genai";
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Also try loading from .env.local specifically
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';

if (!API_KEY) {
  console.error('❌ No API key found. Set GEMINI_API_KEY or VITE_GEMINI_API_KEY');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// All construction milestones organized by phase
const CONSTRUCTION_MILESTONES = [
  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 1: VOORBEREIDING (Preparation)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    phase: 'voorbereiding',
    filename: 'grondonderzoek.png',
    name: 'Grondonderzoek & Sondering',
    prompt: `
Professional construction site photograph. Geotechnical soil investigation in progress.
Features: Dutch polder landscape, soil drilling rig (sonderingswagen), engineers in safety vests and helmets taking soil samples, CPT (Cone Penetration Test) equipment, muddy construction site, measurement equipment.
Style: Documentary construction photography, overcast Dutch weather, realistic muddy conditions.
Camera: Eye-level shot showing work in progress, workers visible but not main focus.
Quality: Photorealistic, professional site documentation style.
CRITICAL: NO text, NO watermarks, NO logos, NO overlays of any kind.
    `.trim()
  },
  {
    phase: 'voorbereiding',
    filename: 'bouwvergunning.png',
    name: 'Bouwvergunning & Omgevingsvergunning',
    prompt: `
Professional photograph of Dutch building permit approval documents.
Features: Official Dutch building permit documents (omgevingsvergunning) with municipality stamp, architectural floor plans spread on table, blueprints rolled up, reading glasses, coffee cup, modern home office setting with warm lighting.
Style: Clean documentation photograph, shallow depth of field on stamp/approval, professional real estate marketing quality.
Mood: Milestone achievement, bureaucratic success, warm satisfying light.
CRITICAL: NO readable text on documents - blur or stylize any text. NO watermarks, NO logos.
    `.trim()
  },
  {
    phase: 'voorbereiding',
    filename: 'uitzetwerk.png',
    name: 'Uitzetwerk & Bouwplaats Markering',
    prompt: `
Professional construction site photograph. Building plot staking/layout in progress on Dutch construction site.
Features: Surveyor with theodolite/total station, wooden stakes with orange marking tape in the ground marking foundation outline, string lines defining building corners, Dutch flat landscape, measuring equipment, level instrument on tripod.
Style: Documentary construction photography, early morning light, professional site documentation.
Camera: Wide shot showing marked plot with string lines, surveyor working.
CRITICAL: NO text, NO watermarks, NO logos, NO overlays.
    `.trim()
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 2: FUNDERING (Foundation)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    phase: 'fundering',
    filename: 'uitgraven-bouwput.png',
    name: 'Uitgraven Bouwput',
    prompt: `
Professional construction photograph. Excavation of building pit (bouwput) for Dutch residential foundation.
Features: Yellow excavator (graafmachine) digging foundation pit, neat rectangular excavation, piles of dark Dutch clay soil, construction worker supervising, safety barriers, Dutch flat landscape in background.
Style: Documentary construction photography, dramatic action shot of excavator at work.
Camera: Low angle showing excavator bucket and depth of pit, worker for scale.
Weather: Typical Dutch overcast, wet soil conditions.
CRITICAL: NO text, NO watermarks, NO logos, NO brand names on equipment.
    `.trim()
  },
  {
    phase: 'fundering',
    filename: 'heipalen.png',
    name: 'Heien & Funderingspalen',
    prompt: `
Professional construction photograph. Pile driving (heien) for Dutch residential foundation.
Features: Pile driving rig (heimachine), concrete foundation piles being driven into soft Dutch soil, construction crew in safety gear, dramatic action of pile being hammered, typical Dutch polder setting.
Style: Documentary construction photography, powerful industrial action shot.
Camera: Side view showing pile rig, pile entering ground, vibration visible.
Mood: Industrial power, Dutch engineering, foundation strength.
CRITICAL: NO text, NO watermarks, NO logos, NO brand names.
    `.trim()
  },
  {
    phase: 'fundering',
    filename: 'wapeningsstaal.png',
    name: 'Wapeningsstaal',
    prompt: `
Professional construction photograph. Reinforcement steel (wapening) installation for residential foundation.
Features: Dense grid of steel rebar (wapeningsstaal) tied together in foundation formwork, construction workers tying rebar with wire, organized steel mesh pattern, concrete spacers visible, formwork edges visible.
Style: Technical construction documentation, sharp detail on steel grid pattern.
Camera: Elevated view looking down into foundation pit showing rebar grid pattern.
Lighting: Bright daylight showing metallic sheen of new steel.
CRITICAL: NO text, NO watermarks, NO logos. Focus on geometric beauty of steel grid.
    `.trim()
  },
  {
    phase: 'fundering',
    filename: 'betonbon.png',
    name: 'Betonlevering & Betonbon',
    prompt: `
Professional construction photograph. Concrete delivery (betonlevering) for Dutch residential foundation.
Features: Concrete mixer truck (betonmixer) with rotating drum arriving at construction site, construction worker inspecting, fresh concrete visible in chute, delivery documentation clipboard in worker's hand, Dutch residential area background.
Style: Documentary construction photography, moment of delivery arrival.
Camera: 3/4 view of concrete truck and site entrance, worker receiving delivery.
Mood: Logistics, quality control, material verification.
CRITICAL: NO readable text, NO brand logos, NO watermarks. Blur any text on truck.
    `.trim()
  },
  {
    phase: 'fundering',
    filename: 'storten-fundering.png',
    name: 'Storten Fundering',
    prompt: `
Professional construction photograph. Pouring concrete foundation (storten fundering) for Dutch home.
Features: Concrete pump truck with boom extended, wet concrete being poured into rebar-filled formwork, construction workers with concrete vibrators compacting, smooth wet concrete surface, formwork edges, steam/moisture rising from fresh concrete.
Style: Dynamic action photograph, industrial construction moment.
Camera: Side angle showing concrete flow from pump into formwork, workers in action.
Lighting: Overcast Dutch conditions, wet surfaces reflecting light.
CRITICAL: NO text, NO watermarks, NO logos, NO brand names.
    `.trim()
  },
  {
    phase: 'fundering',
    filename: 'uitharding.png',
    name: 'Uitharding & Nabehandeling',
    prompt: `
Professional construction photograph. Concrete curing (uitharding) of fresh residential foundation.
Features: Fresh grey concrete foundation surface covered with plastic sheeting for curing, water sprinklers or wet burlap visible, foundation edges with formwork partially removed, Dutch construction site, moisture on concrete surface.
Style: Quiet documentary photograph, process documentation.
Camera: Low angle across foundation surface showing curing treatment.
Mood: Patience, careful treatment, quality control.
CRITICAL: NO text, NO watermarks, NO logos.
    `.trim()
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 3: RUWBOUW (Shell Construction)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    phase: 'ruwbouw',
    filename: 'metselwerk.png',
    name: 'Metselwerk & Gevel',
    prompt: `
Professional construction photograph. Bricklaying (metselwerk) in progress on Dutch residential home.
Features: Mason (metselaar) laying traditional Dutch red-brown bricks, scaffolding, level and trowel, fresh mortar, partially completed brick wall showing pattern, neat courses of bricks, Dutch construction techniques.
Style: Craftsmanship photography, focus on skilled trade work.
Camera: Medium shot showing mason at work, detail of brick pattern visible.
Lighting: Natural daylight, warm brick tones.
CRITICAL: NO text, NO watermarks, NO logos.
    `.trim()
  },
  {
    phase: 'ruwbouw',
    filename: 'dakconstructie.png',
    name: 'Dakconstructie & Spanten',
    prompt: `
Professional construction photograph. Roof construction (dakconstructie) on Dutch residential home.
Features: Wooden roof trusses (spanten) being installed, crane lifting timber frame, construction workers on scaffolding securing rafters, partially completed roof structure against sky, Dutch residential building under construction.
Style: Dynamic construction photography, architectural timber engineering.
Camera: Low angle looking up at roof structure against sky, workers silhouetted.
Mood: Progress, craftsmanship, structural beauty.
CRITICAL: NO text, NO watermarks, NO logos.
    `.trim()
  },
  {
    phase: 'ruwbouw',
    filename: 'dakpannen.png',
    name: 'Dakbedekking & Pannen',
    prompt: `
Professional construction photograph. Roof tile installation (dakpannen) on Dutch residential home.
Features: Roofer installing traditional Dutch clay roof tiles, neat rows of dark tiles, roof battens visible, safety harness, pitched roof, chimney or dormer detail, scaffolding edge visible.
Style: Craftsmanship photography, traditional Dutch roofing trade.
Camera: Elevated angle on roof surface showing tile pattern and worker.
Lighting: Bright daylight, tiles catching light.
CRITICAL: NO text, NO watermarks, NO logos.
    `.trim()
  },
  {
    phase: 'ruwbouw',
    filename: 'kozijnen.png',
    name: 'Kozijnen & Ramen',
    prompt: `
Professional construction photograph. Window frame (kozijnen) installation on Dutch residential home.
Features: Modern triple-glazed window units being installed, construction worker fitting large window into brick opening, foam sealant visible, white or anthracite window frames, typical Dutch residential architecture.
Style: Technical construction photography, precision installation.
Camera: Medium shot showing window installation process, worker with tools.
Mood: Quality, energy efficiency, precision.
CRITICAL: NO text, NO watermarks, NO logos, NO brand names on windows.
    `.trim()
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 4: AFBOUW & INSTALLATIE (Finishing & Systems)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    phase: 'afbouw',
    filename: 'elektra-installatie.png',
    name: 'Elektra Installatie',
    prompt: `
Professional construction photograph. Electrical installation (elektra) in Dutch residential home under construction.
Features: Electrician installing wiring in wall cavity, exposed electrical cables in conduits, junction boxes, electrical panel (meterkast) visible, safety equipment, unfinished interior walls.
Style: Technical trade photography, systems installation.
Camera: Medium shot of electrician at work, cable runs visible.
Lighting: Work lights in construction interior.
CRITICAL: NO text, NO watermarks, NO logos.
    `.trim()
  },
  {
    phase: 'afbouw',
    filename: 'leidingwerk.png',
    name: 'Leidingwerk & Sanitair',
    prompt: `
Professional construction photograph. Plumbing installation (leidingwerk) in Dutch residential home.
Features: Plumber installing copper or PEX pipes in wall/floor, pipe manifold system, bathroom rough-in visible, floor heating pipes laid in pattern, unfinished concrete floor, professional tools.
Style: Technical installation photography, clean systems work.
Camera: Wide angle showing pipe layout and manifold, worker for scale.
Lighting: Bright work lights, clean visibility.
CRITICAL: NO text, NO watermarks, NO logos.
    `.trim()
  },
  {
    phase: 'afbouw',
    filename: 'stucwerk.png',
    name: 'Stucwerk & Wanden',
    prompt: `
Professional construction photograph. Plastering (stucwerk) interior walls in Dutch home.
Features: Plasterer (stukadoor) applying smooth plaster to interior wall with trowel, scaffolding, wet plaster surface, partially finished room, drop cloths on floor, professional plastering technique.
Style: Craftsmanship photography, smooth surface creation.
Camera: Medium shot showing plasterer's technique and smooth wall result.
Lighting: Even interior light showing plaster texture.
CRITICAL: NO text, NO watermarks, NO logos.
    `.trim()
  },
  {
    phase: 'afbouw',
    filename: 'vloerleggen.png',
    name: 'Vloeren Leggen',
    prompt: `
Professional construction photograph. Floor installation in Dutch residential home.
Features: Floor installer laying engineered wood or tile flooring, knee pads, spacers, level tool, partially completed floor showing pattern, underlay visible at edges, clean professional work.
Style: Craftsmanship photography, precision installation.
Camera: Low angle across floor surface showing installation progress.
Lighting: Natural window light, warm wood tones.
CRITICAL: NO text, NO watermarks, NO logos.
    `.trim()
  },
  {
    phase: 'afbouw',
    filename: 'keuken-montage.png',
    name: 'Keuken Montage',
    prompt: `
Professional construction photograph. Kitchen installation (keuken montage) in Dutch home.
Features: Kitchen installer fitting modern cabinets, wall units being mounted, countertop visible, level tool, professional installation, partially completed modern Dutch kitchen, clean workspace.
Style: Interior construction photography, precision cabinet work.
Camera: Wide angle showing kitchen taking shape, installer at work.
Lighting: Bright interior, modern kitchen surfaces.
CRITICAL: NO text, NO watermarks, NO logos, NO brand names.
    `.trim()
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 5: OPLEVERING (Handover)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    phase: 'oplevering',
    filename: 'eindcontrole.png',
    name: 'Eindcontrole & Keuring',
    prompt: `
Professional photograph. Final building inspection (eindcontrole) of completed Dutch home.
Features: Building inspector with clipboard checking details, homeowner present, completed modern Dutch interior, inspector using flashlight to check details, punch list inspection, professional quality check.
Style: Documentary photography, quality assurance moment.
Camera: Medium shot showing inspection process in finished space.
Mood: Professional verification, quality, milestone moment.
CRITICAL: NO readable text on clipboard, NO watermarks, NO logos.
    `.trim()
  },
  {
    phase: 'oplevering',
    filename: 'sleuteloverdracht.png',
    name: 'Sleuteloverdracht',
    prompt: `
Professional photograph. Key handover (sleuteloverdracht) ceremony for new Dutch home.
Features: Builder handing house keys to happy homeowner couple, front door of beautiful new Dutch home in background, celebratory moment, professional handshake, keychain with house key prominent.
Style: Lifestyle real estate photography, emotional milestone moment.
Camera: Medium shot focused on key exchange, home visible in background.
Lighting: Golden hour, warm and celebratory.
Mood: Achievement, joy, new beginnings.
CRITICAL: NO text, NO watermarks, NO logos.
    `.trim()
  },
  {
    phase: 'oplevering',
    filename: 'woning-gereed.png',
    name: 'Woning Gereed',
    prompt: `
Professional architectural photograph. Completed beautiful Dutch new-build home.
Features: Stunning finished Dutch residential home, modern architecture with brick and render, landscaped garden, evening lighting in windows, warm glow, perfectly maintained, proud new home.
Style: Premium real estate photography, magazine cover quality.
Camera: 3/4 front elevation, golden hour lighting.
Mood: Pride, achievement, dream realized.
CRITICAL: NO text, NO watermarks, NO logos, NO people.
    `.trim()
  },
];

async function generateImage(milestone: typeof CONSTRUCTION_MILESTONES[0]): Promise<void> {
  console.log(`\n🔨 Generating: ${milestone.name}...`);
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp-image-generation',
      contents: {
        parts: [{ text: milestone.prompt }]
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
          
          // Create phase subdirectory
          const outputDir = path.join(__dirname, '../public/generated/milestones', milestone.phase);
          if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
          }
          
          const outputPath = path.join(outputDir, milestone.filename);
          fs.writeFileSync(outputPath, buffer);
          console.log(`   ✅ Saved: milestones/${milestone.phase}/${milestone.filename}`);
          return;
        }
      }
    }
    console.error(`   ❌ No image generated for ${milestone.name}`);
  } catch (error: any) {
    console.error(`   ❌ Error generating ${milestone.name}:`, error.message || error);
  }
}

async function main() {
  console.log('');
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║  🏗️  OOIT GEDACHT - Construction Milestone Image Generator  🏗️  ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log('');
  
  // Group by phase for nice output
  const phases = [...new Set(CONSTRUCTION_MILESTONES.map(m => m.phase))];
  
  for (const phase of phases) {
    const phaseMilestones = CONSTRUCTION_MILESTONES.filter(m => m.phase === phase);
    console.log('');
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`  📁 Phase: ${phase.toUpperCase()}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    
    for (let i = 0; i < phaseMilestones.length; i++) {
      const milestone = phaseMilestones[i];
      console.log(`\n[${i + 1}/${phaseMilestones.length}] ${milestone.name}`);
      await generateImage(milestone);
      
      // Rate limiting - wait between requests
      if (i < phaseMilestones.length - 1) {
        console.log('   ⏳ Waiting 4 seconds (rate limit)...');
        await new Promise(resolve => setTimeout(resolve, 4000));
      }
    }
  }
  
  console.log('');
  console.log('═'.repeat(60));
  console.log('✨ All construction milestone images generated!');
  console.log('   📁 Location: public/generated/milestones/');
  console.log('');
  console.log('   Phases created:');
  for (const phase of phases) {
    const count = CONSTRUCTION_MILESTONES.filter(m => m.phase === phase).length;
    console.log(`   • ${phase}/ (${count} images)`);
  }
  console.log('');
}

main().catch(console.error);

