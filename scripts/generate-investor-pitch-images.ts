/**
 * Generate Investor Pitch Images for OoitGedacht & Homie
 * Run with: npx tsx scripts/generate-investor-pitch-images.ts
 * 
 * This generates images and infographics for each section of the investor deck
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

// All investor pitch sections with their image requirements
const INVESTOR_IMAGES = [
  // ═══════════════════════════════════════════════════════════════════════════
  // HERO - Title Slide
  // ═══════════════════════════════════════════════════════════════════════════
  {
    section: 'hero',
    filename: 'hero-title.png',
    name: 'Hero - Construction OS Vision',
    type: 'photo',
    prompt: `
Cinematic wide shot photograph. Stunning modern Dutch residential home under construction at golden hour.
Features: Beautiful timber-frame CLT construction in progress, Dutch polder landscape with water reflection, dramatic sky with sunset colors, construction crane silhouette, smart technology elements subtly visible (sensors, tablets on-site).
Style: Premium architectural photography, epic cinematic scale, Apple-style product launch aesthetic.
Mood: Innovation meets tradition, the future of Dutch housing, technological promise.
Camera: Wide angle drone shot capturing full scene with dramatic perspective.
Quality: Ultra-premium, magazine cover worthy, 8K quality feel.
CRITICAL: NO text, NO watermarks, NO logos, NO overlays of any kind.
    `.trim()
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 0: VISION & STRATEGY
  // ═══════════════════════════════════════════════════════════════════════════
  {
    section: 'vision',
    filename: 'vision-partnership.png',
    name: 'Vision - Broersma Partnership',
    type: 'photo',
    prompt: `
Professional photograph of father and son engineering team in modern Dutch construction office.
Features: Two generations - older experienced civil engineer and younger tech-savvy entrepreneur, both looking at large screens showing architectural blueprints and digital dashboards, modern glass office with construction site visible through window, warm professional lighting.
Style: Corporate portrait photography, genuine warmth, trust and expertise.
Mood: Generational knowledge transfer, innovation meets experience, family business evolution.
Camera: Medium shot capturing both figures and environment, shallow depth of field.
CRITICAL: NO readable text on screens (blur), NO logos, NO watermarks.
    `.trim()
  },
  {
    section: 'vision',
    filename: 'vision-positioning.png',
    name: 'Vision - Two Brands Positioning',
    type: 'infographic',
    prompt: `
Modern minimalist infographic illustration showing two connected but distinct product brands.
Features: Split design - left side shows "consumer/lifestyle" aesthetic (warm home, family, dream house imagery), right side shows "B2B/industrial" aesthetic (construction site, hard hats, smart glasses, blueprints). Connected by flowing lines/arrows suggesting data flow and integration.
Style: Clean flat design, subtle gradients, professional corporate style like McKinsey or Stripe graphics.
Colors: Left side warm blue tones, right side amber/orange tones, dark background (#030712).
Quality: Crisp vector-style graphics, high contrast, modern tech company aesthetic.
CRITICAL: NO text labels, NO company names, purely visual metaphor. NO watermarks.
    `.trim()
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 1: B2C - OOITGEDACHT
  // ═══════════════════════════════════════════════════════════════════════════
  {
    section: 'b2c',
    filename: 'b2c-lifestyle-hero.png',
    name: 'B2C - Dream Home Lifestyle',
    type: 'photo',
    prompt: `
Aspirational lifestyle photograph. Young professional Dutch couple (30s) looking at their beautiful newly built home in a polder landscape.
Features: Modern sustainable Dutch architecture, couple standing on terrace with coffee, morning light, beautiful garden with native plants, bicycles visible, electric car charging, solar panels on roof, child playing in garden.
Style: Premium lifestyle photography, authentic not staged, Apple/Airbnb marketing quality.
Mood: Achievement, pride, sustainable modern living, the Dutch dream realized.
Camera: Wide environmental portrait, golden hour lighting, bokeh background.
CRITICAL: NO text, NO logos, NO watermarks. People should look real, not models.
    `.trim()
  },
  {
    section: 'b2c',
    filename: 'b2c-wizard-flow.png',
    name: 'B2C - Digital Wizard Interface',
    type: 'infographic',
    prompt: `
Modern app interface mockup illustration showing a house design wizard flow.
Features: Dark mode UI with 5 connected steps shown as elegant cards: (1) map with pin dropping, (2) budget slider, (3) style swipe cards, (4) AI rendering in progress, (5) final house visualization. Flowing connection lines between steps, subtle glow effects.
Style: Premium fintech/proptech app design, like Figma or Linear interface aesthetics.
Colors: Dark background (#030712), blue accent (#3b82f6), cyan highlights, subtle gradients.
Quality: Pixel-perfect UI design, crisp edges, modern glass-morphism effects.
CRITICAL: NO readable text, use placeholder shapes. NO logos, NO watermarks.
    `.trim()
  },
  {
    section: 'b2c',
    filename: 'b2c-yup-target.png',
    name: 'B2C - Young Urban Professional',
    type: 'photo',
    prompt: `
Documentary-style photograph of young Dutch professionals in urban setting dreaming of homeownership.
Features: Diverse group of millennials (25-35) sitting in trendy Amsterdam cafe, looking at tablet showing house designs, engaged conversation, creative/tech worker aesthetic, plants, exposed brick, bikes visible outside.
Style: Editorial documentary photography, authentic urban lifestyle, The Guardian/Dezeen quality.
Mood: Aspiration, community, urban-to-rural shift, tech-enabled dreaming.
Camera: Candid environmental shot, natural window light.
CRITICAL: NO readable text on screens, NO logos, NO watermarks.
    `.trim()
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 2: B2B - HOMIE/BOUWBORG
  // ═══════════════════════════════════════════════════════════════════════════
  {
    section: 'b2b',
    filename: 'b2b-smart-glasses.png',
    name: 'B2B - Smart Safety Glasses',
    type: 'photo',
    prompt: `
Product photography of advanced smart safety glasses for construction workers.
Features: Sleek modern safety glasses with integrated camera module, subtle LED indicator, transparent protective lenses, rugged construction-grade design. Shown both as product shot and worn by worker on construction site.
Style: Premium product photography like Apple Vision Pro marketing, dramatic lighting.
Mood: Innovation, protection, the future of construction documentation.
Camera: Hero product shot with dramatic rim lighting, floating against dark background.
CRITICAL: NO text, NO brand names, NO logos visible on glasses. NO watermarks.
    `.trim()
  },
  {
    section: 'b2b',
    filename: 'b2b-dashboard.png',
    name: 'B2B - Quality Borger Dashboard',
    type: 'infographic',
    prompt: `
Modern dashboard interface mockup for construction quality management.
Features: Dark mode UI showing: project overview map with multiple pins, traffic light status indicators (red/amber/green) for different projects, timeline view, photo evidence grid, approval workflow buttons. Clean data visualization.
Style: Enterprise SaaS dashboard like Linear, Notion, or Vercel aesthetic.
Colors: Dark background (#0a1628), amber accent (#f59e0b), status colors (green/amber/red).
Quality: Premium fintech-grade UI design, crisp typography placeholders, subtle shadows.
CRITICAL: NO readable text (use lines/shapes as placeholders), NO logos, NO watermarks.
    `.trim()
  },
  {
    section: 'b2b',
    filename: 'b2b-fsm-workflow.png',
    name: 'B2B - FSM Workflow Diagram',
    type: 'infographic',
    prompt: `
Technical diagram illustration of a Finite State Machine workflow for construction.
Features: Connected nodes/states showing construction phases (excavation → foundation → structure → finishing), each with lock/unlock icons, photo upload symbols, checkmark validators. Arrows showing transitions with key symbols.
Style: Clean technical diagram, modern flow chart aesthetic like Miro or FigJam.
Colors: Dark background, blue nodes (#3b82f6), amber locked states (#f59e0b), green approved (#22c55e).
Quality: Crisp vector-style graphics, elegant curved connection lines, subtle glow on active node.
CRITICAL: NO text labels inside nodes (use icons only), NO watermarks, NO logos.
    `.trim()
  },
  {
    section: 'b2b',
    filename: 'b2b-wkb-pain.png',
    name: 'B2B - Builder Pain Points',
    type: 'photo',
    prompt: `
Documentary photograph of overwhelmed Dutch construction foreman dealing with paperwork.
Features: Middle-aged builder in work clothes, sitting in construction site office trailer, surrounded by papers, folders, phone in hand, laptop showing spreadsheet, stressed expression, coffee cups, hard hat on desk, construction site visible through window.
Style: Editorial documentary photography, authentic not staged, gritty realism.
Mood: Frustration, administrative burden, the problem we're solving.
Camera: Environmental portrait, harsh fluorescent lighting mixed with daylight.
CRITICAL: NO readable text on documents, NO logos, NO watermarks.
    `.trim()
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 3: TECHNOLOGY
  // ═══════════════════════════════════════════════════════════════════════════
  {
    section: 'tech',
    filename: 'tech-architecture.png',
    name: 'Tech - System Architecture',
    type: 'infographic',
    prompt: `
Modern technical architecture diagram showing layered software system.
Features: Four horizontal layers stacked vertically: (1) Experience layer with app icons, (2) Workflow layer with connected nodes, (3) Intelligence layer with brain/AI symbol, (4) Data layer with database/blockchain icons. Vertical connecting lines between layers.
Style: Clean enterprise architecture diagram, AWS/Azure style but more elegant.
Colors: Dark background (#030712), blue layer (#3b82f6), cyan (#22d3ee), purple (#a855f7), emerald (#10b981).
Quality: Crisp isometric-style 3D blocks, subtle shadows, glass-morphism effects.
CRITICAL: NO text labels, use icons and shapes only. NO watermarks, NO logos.
    `.trim()
  },
  {
    section: 'tech',
    filename: 'tech-ai-agents.png',
    name: 'Tech - Multi-Agent AI System',
    type: 'infographic',
    prompt: `
Futuristic illustration of interconnected AI agents working together.
Features: Central orchestrator node connected to 4 specialized agent nodes (document analysis, image recognition, structural validation, compliance checking). Data flowing between agents, document/photo inputs on one side, validated outputs on other.
Style: Abstract tech illustration like OpenAI or Anthropic marketing, elegant and minimal.
Colors: Dark background, purple AI accents (#a855f7), blue data flows (#3b82f6), white highlights.
Quality: Smooth gradients, subtle particle effects, premium tech company aesthetic.
CRITICAL: NO text, NO logos, NO watermarks. Abstract representation only.
    `.trim()
  },
  {
    section: 'tech',
    filename: 'tech-blockchain-passport.png',
    name: 'Tech - Housing Passport Blockchain',
    type: 'infographic',
    prompt: `
Abstract illustration of a digital housing passport with blockchain verification.
Features: Central document/certificate icon connected to blockchain chain of blocks, hash symbols, lock icons for security, timeline of verified events flowing into the document. House silhouette incorporated into design.
Style: Crypto/web3 aesthetic but professional and trustworthy, not speculative.
Colors: Dark background, purple/blue gradients, emerald verification checkmarks.
Quality: Premium fintech illustration style, subtle glow effects, clean geometry.
CRITICAL: NO text, NO specific crypto logos, NO watermarks.
    `.trim()
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 4: MARKET VALIDATION
  // ═══════════════════════════════════════════════════════════════════════════
  {
    section: 'market',
    filename: 'market-wkb-leverage.png',
    name: 'Market - Wkb as Leverage',
    type: 'infographic',
    prompt: `
Conceptual illustration showing regulatory change creating market opportunity.
Features: Large official document/law symbol transforming into upward arrow/growth chart. Before/after visualization: chaotic scattered papers on left, organized digital system on right. Scale/balance imagery showing shift of responsibility.
Style: Clean infographic illustration, McKinsey/BCG consulting deck quality.
Colors: Dark background, red for problem (#ef4444), green for solution (#22c55e), blue accents.
Quality: Professional business illustration, clear visual hierarchy.
CRITICAL: NO specific text, NO government logos, NO watermarks.
    `.trim()
  },
  {
    section: 'market',
    filename: 'market-two-sided.png',
    name: 'Market - Two-Sided Mirror',
    type: 'infographic',
    prompt: `
Split-screen illustration showing same data from two perspectives.
Features: Central data point (construction photo) shown twice - left side with technical/legal frame (stamps, certificates, legal icons), right side with emotional/celebratory frame (hearts, celebration, progress bar). Mirror/reflection visual metaphor.
Style: Modern editorial illustration, The Economist style infographic.
Colors: Left side cool professional tones (amber/grey), right side warm emotional tones (blue/cyan).
Quality: Clean vector illustration, clear visual metaphor, balanced composition.
CRITICAL: NO text, NO specific logos, NO watermarks.
    `.trim()
  },
  {
    section: 'market',
    filename: 'market-opportunity-score.png',
    name: 'Market - Business Opportunity Rating',
    type: 'infographic',
    prompt: `
Visual scorecard illustration comparing two business opportunities.
Features: Two product cards side by side - left card (B2B/Homie) with 9.5/10 score indicator, right card (B2C/OoitGedacht) with 9.0/10 score. Rating bars, feature checkmarks, market size indicators. Clean comparison layout.
Style: Modern product comparison design like G2 or Capterra reviews.
Colors: Dark background, amber for B2B (#f59e0b), blue for B2C (#3b82f6), gold for ratings.
Quality: Clean UI-style illustration, crisp edges, subtle shadows.
CRITICAL: NO company names as text, use placeholder shapes. NO watermarks.
    `.trim()
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 5: TEAM & AUTHORITY
  // ═══════════════════════════════════════════════════════════════════════════
  {
    section: 'team',
    filename: 'team-broersma-legacy.png',
    name: 'Team - 70 Years of Engineering',
    type: 'photo',
    prompt: `
Historical-meets-modern composite photograph showing engineering evolution.
Features: Dutch engineering through decades - old slide rule and paper blueprints transitioning to modern laptop and 3D models. Old black and white photos of bridge construction, modern photo of same company doing digital work. Time-lapse feeling.
Style: Premium documentary photography, generational contrast, heritage brand aesthetic.
Mood: Trust through tradition, innovation through experience, Dutch engineering pride.
Camera: Layered composition, depth creating time dimension.
CRITICAL: NO readable text, NO specific dates, NO logos, NO watermarks.
    `.trim()
  },
  {
    section: 'team',
    filename: 'team-unfair-advantage.png',
    name: 'Team - Unfair Advantage Venn',
    type: 'infographic',
    prompt: `
Venn diagram illustration showing unique intersection of capabilities.
Features: Two overlapping circles - one representing "Deep Construction Engineering" (hard hat, blueprint, 70+ years), other representing "Workflow Tech Expertise" (code, FSM, 10+ years). Intersection highlighted showing unique combined capability.
Style: Clean Venn diagram, modern minimal design, TED talk visual quality.
Colors: Dark background, blue circle (#3b82f6), purple circle (#a855f7), bright intersection.
Quality: Elegant simplicity, clear visual hierarchy, memorable graphic.
CRITICAL: NO text labels, use icons to represent concepts. NO watermarks.
    `.trim()
  },
  {
    section: 'team',
    filename: 'team-network.png',
    name: 'Team - Network & Rolodex',
    type: 'infographic',
    prompt: `
Network visualization showing extensive professional connections.
Features: Central hub connected to multiple stakeholder groups: municipalities, developers, contractors, engineering firms, legal/justice system. Different node sizes showing relationship strength. Professional network map aesthetic.
Style: Modern network graph visualization, like LinkedIn premium insights.
Colors: Dark background, varied node colors by category, glowing connection lines.
Quality: Dynamic but readable, professional business network aesthetic.
CRITICAL: NO specific names or company logos, abstract representation. NO watermarks.
    `.trim()
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 6: BUSINESS MODEL
  // ═══════════════════════════════════════════════════════════════════════════
  {
    section: 'business',
    filename: 'business-demand-aggregation.png',
    name: 'Business - Demand Heatmap',
    type: 'infographic',
    prompt: `
Stylized map illustration showing demand aggregation concept.
Features: Dutch map outline with heat map overlay showing concentrated demand areas (glowing hotspots), pins clustering in specific regions, arrow pointing from heatmap to "deal" symbol. Kickstarter-style crowd visualization.
Style: Modern data visualization, geographic heat map aesthetic.
Colors: Dark background, heat colors from blue (low) to red (high), gold for confirmed deals.
Quality: Clean cartographic illustration, clear visual narrative.
CRITICAL: NO city names as text, NO specific numbers, NO watermarks, NO logos.
    `.trim()
  },
  {
    section: 'business',
    filename: 'business-revenue-model.png',
    name: 'Business - Revenue Streams',
    type: 'infographic',
    prompt: `
Revenue model diagram showing multiple income streams.
Features: Central platform icon with multiple arrows flowing outward to revenue categories: per-project fees, subscriptions, insurance partnerships, data licensing. Size of arrows indicating relative revenue potential.
Style: Clean business model diagram, investor deck quality.
Colors: Dark background, green for revenue (#22c55e), blue for B2C (#3b82f6), amber for B2B (#f59e0b).
Quality: Professional consulting-grade illustration, clear flow visualization.
CRITICAL: NO specific numbers or prices, NO text labels, icons only. NO watermarks.
    `.trim()
  },
  {
    section: 'business',
    filename: 'business-passport-product.png',
    name: 'Business - Bouwpaspoort as Asset',
    type: 'infographic',
    prompt: `
Premium document/certificate illustration showing the Bouwpaspoort as a valuable asset.
Features: Official-looking digital document with QR code, verification stamps, timeline of events, connected to icons representing bank (mortgage), insurance, municipality. Document glowing with value indication.
Style: Premium certificate design, official document aesthetic, government-grade design.
Colors: Dark background, blue official accents, gold/amber stamps, emerald verification.
Quality: High-quality official document illustration, trustworthy and premium.
CRITICAL: NO readable text, placeholder lines only. NO specific logos, NO watermarks.
    `.trim()
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 7: ROADMAP
  // ═══════════════════════════════════════════════════════════════════════════
  {
    section: 'roadmap',
    filename: 'roadmap-timeline.png',
    name: 'Roadmap - 12 Month Timeline',
    type: 'infographic',
    prompt: `
Horizontal timeline illustration showing 12-month product roadmap.
Features: Four quarter segments (Q1-Q4) as distinct phases, each with key milestone icons: Q1 (prototype, MVP), Q2 (data training, pilot), Q3 (wizard launch, heatmaps), Q4 (first deal, case study). Progress indicator showing advancement.
Style: Modern product roadmap visualization, like Linear or Notion roadmaps.
Colors: Dark background, gradient progression from purple (Q1) to emerald (Q4).
Quality: Clean timeline design, clear milestones, motivating visual narrative.
CRITICAL: NO specific dates or text, icons and shapes only. NO watermarks.
    `.trim()
  },
  {
    section: 'roadmap',
    filename: 'roadmap-mvp-vision.png',
    name: 'Roadmap - MVP to Scale Vision',
    type: 'infographic',
    prompt: `
Growth trajectory illustration from MVP to scale.
Features: Starting point (single house icon) growing to multiple houses, cities, then international expansion. Exponential curve trajectory, milestone markers along the path. Dutch to European to Global visual narrative.
Style: Growth trajectory infographic, startup pitch deck quality.
Colors: Dark background, blue to emerald gradient showing growth, gold milestone markers.
Quality: Inspiring trajectory visualization, ambitious but credible.
CRITICAL: NO specific numbers or dates, visual metaphor only. NO watermarks.
    `.trim()
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 8: INTERNATIONAL
  // ═══════════════════════════════════════════════════════════════════════════
  {
    section: 'international',
    filename: 'international-expansion-map.png',
    name: 'International - Expansion Map',
    type: 'infographic',
    prompt: `
World map illustration highlighting international expansion targets.
Features: Minimalist world map with Netherlands as bright starting point, connection lines to UK (brightest target), Germany, and California (USA). Different intensity indicating priority. Glowing nodes at target locations.
Style: Modern geographic expansion visualization, tech company global strategy map.
Colors: Dark background, bright blue Netherlands, varying intensities for targets (emerald UK, blue Germany, amber USA).
Quality: Clean cartographic design, clear priority hierarchy.
CRITICAL: NO country names as text, NO flags, NO specific city labels. NO watermarks.
    `.trim()
  },
  {
    section: 'international',
    filename: 'international-uk-opportunity.png',
    name: 'International - UK Self-Build Market',
    type: 'photo',
    prompt: `
Atmospheric photograph of British countryside with potential for self-build housing.
Features: Beautiful English countryside plot with "for sale" stake, rolling green hills, dramatic sky, nearby village visible, planning documents and architectural sketches artfully placed in foreground. Grand Designs aesthetic.
Style: Premium British property/lifestyle photography, aspirational UK housing market.
Mood: Opportunity, untapped potential, the British dream of self-build.
Camera: Wide landscape shot with foreground interest, golden hour light.
CRITICAL: NO readable text on signs or documents, NO specific branding. NO watermarks.
    `.trim()
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 9: THE ASK
  // ═══════════════════════════════════════════════════════════════════════════
  {
    section: 'ask',
    filename: 'ask-partnership.png',
    name: 'The Ask - Partnership Handshake',
    type: 'photo',
    prompt: `
Powerful photograph symbolizing strategic partnership agreement.
Features: Close-up of firm handshake between two professional hands, one wearing construction work attire (rolled sleeves, watch), other in tech/business attire. Background showing blurred construction site and digital screens. Trust and commitment.
Style: Premium corporate photography, executive handshake aesthetic.
Mood: Commitment, partnership, new chapter beginning, mutual respect.
Camera: Close-up on hands with meaningful background blur, warm lighting.
CRITICAL: NO faces visible, focus on hands and symbolism. NO logos, NO watermarks.
    `.trim()
  },
  {
    section: 'ask',
    filename: 'ask-three-pillars.png',
    name: 'The Ask - Capital, Authority, Data',
    type: 'infographic',
    prompt: `
Three pillars illustration representing investment ask components.
Features: Three classical columns/pillars standing on foundation: Pillar 1 (money/capital symbol), Pillar 2 (seal/authority symbol), Pillar 3 (database/data symbol). Pillars supporting a roof representing "the vision" or "success". Greek temple metaphor.
Style: Modern take on classical architecture metaphor, minimal but meaningful.
Colors: Dark background, gold for capital, blue for authority, emerald for data.
Quality: Elegant symbolic illustration, powerful visual metaphor.
CRITICAL: NO text labels, symbolic representation only. NO watermarks, NO logos.
    `.trim()
  },
  {
    section: 'ask',
    filename: 'ask-future-vision.png',
    name: 'The Ask - Future Vision',
    type: 'photo',
    prompt: `
Inspiring photograph of futuristic sustainable Dutch neighborhood.
Features: Aerial view of beautiful new Dutch neighborhood with modern sustainable homes, community gardens, solar panels everywhere, electric vehicles, happy families visible, water features, cycling paths. The realized dream.
Style: Premium architectural/urban planning photography, utopian but achievable.
Mood: Inspiration, what success looks like, the future we're building.
Camera: Drone shot at golden hour, warm light, community visible.
CRITICAL: NO text, NO banners, NO advertising. NO watermarks, NO logos.
    `.trim()
  },
];

async function generateImage(image: typeof INVESTOR_IMAGES[0]): Promise<void> {
  console.log(`\n🎨 Generating: ${image.name}...`);
  console.log(`   Type: ${image.type}`);
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview', // Nana Banana 🍌
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
          
          // Create section subdirectory
          const outputDir = path.join(__dirname, '../public/generated/investor-pitch', image.section);
          if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
          }
          
          const outputPath = path.join(outputDir, image.filename);
          fs.writeFileSync(outputPath, buffer);
          console.log(`   ✅ Saved: investor-pitch/${image.section}/${image.filename}`);
          return;
        }
      }
    }
    console.error(`   ❌ No image generated for ${image.name}`);
  } catch (error: any) {
    console.error(`   ❌ Error generating ${image.name}:`, error.message || error);
  }
}

async function main() {
  console.log('');
  console.log('╔══════════════════════════════════════════════════════════════════════╗');
  console.log('║  🎯  OOIT GEDACHT - Investor Pitch Image Generator  🎯                ║');
  console.log('╚══════════════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`📊 Total images to generate: ${INVESTOR_IMAGES.length}`);
  
  // Group by section for nice output
  const sections = [...new Set(INVESTOR_IMAGES.map(m => m.section))];
  
  for (const section of sections) {
    const sectionImages = INVESTOR_IMAGES.filter(m => m.section === section);
    console.log('');
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`  📁 Section: ${section.toUpperCase()}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    
    for (let i = 0; i < sectionImages.length; i++) {
      const image = sectionImages[i];
      console.log(`\n[${i + 1}/${sectionImages.length}] ${image.name}`);
      await generateImage(image);
      
      // Rate limiting - wait between requests
      if (i < sectionImages.length - 1) {
        console.log('   ⏳ Waiting 5 seconds (rate limit)...');
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
    
    // Extra pause between sections
    if (sections.indexOf(section) < sections.length - 1) {
      console.log('\n   ⏳ Section complete. Waiting 8 seconds before next section...');
      await new Promise(resolve => setTimeout(resolve, 8000));
    }
  }
  
  console.log('');
  console.log('═'.repeat(70));
  console.log('✨ All investor pitch images generated!');
  console.log('   📁 Location: public/generated/investor-pitch/');
  console.log('');
  console.log('   Sections created:');
  for (const section of sections) {
    const count = INVESTOR_IMAGES.filter(m => m.section === section).length;
    console.log(`   • ${section}/ (${count} images)`);
  }
  console.log('');
}

main().catch(console.error);

