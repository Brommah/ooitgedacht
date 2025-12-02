/**
 * Type-safe translations for Dutch (nl) and English (en)
 */

export interface TranslationKeys {
  // Navigation
  nav: {
    overview: string;
    market: string;
    presentation: string;
    forBuilders: string;
    b2b: string;
    startBuilding: string;
  };
  
  // Common
  common: {
    next: string;
    back: string;
    loading: string;
    error: string;
    retry: string;
    cancel: string;
    save: string;
    close: string;
    or: string;
    and: string;
    bedrooms: string;
    sqm: string;
    energy: string;
    validated: string;
    aiGenerated: string;
    perMonth: string;
  };

  // Hero / Landing page
  hero: {
    headline: string;
    subheadline: string;
    ctaButton: string;
    trustedBy: string;
    saving: string;
    savingDescription: string;
    transparency: string;
    transparencyDescription: string;
    speed: string;
    speedDescription: string;
    sustainability: string;
    sustainabilityDescription: string;
    howItWorks: string;
    howItWorksSubtitle: string;
    step1Title: string;
    step1Description: string;
    step2Title: string;
    step2Description: string;
    step3Title: string;
    step3Description: string;
    whyChoose: string;
    problemTitle: string;
    problemDescription: string;
    solutionTitle: string;
    solutionDescription: string;
    testimonialTitle: string;
    faqTitle: string;
    ctaTitle: string;
    ctaDescription: string;
    ctaButtonFinal: string;
    footer: {
      tagline: string;
      privacy: string;
      terms: string;
      contact: string;
    };
  };

  // Wizard
  wizard: {
    // Step titles and subtitles
    step1: {
      title: string;
      subtitle: string;
    };
    step2: {
      title: string;
      subtitle: string;
    };
    step3: {
      title: string;
      subtitle: string;
    };
    step4: {
      title: string;
      subtitle: string;
    };
    step5: {
      title: string;
      subtitle: string;
      placeholder: string;
      popularLocations: string;
    };
    step6: {
      title: string;
      subtitle: string;
      selectHint: string;
    };
    step7: {
      title: string;
      subtitle: string;
    };
    step8: {
      title: string;
      subtitle: string;
    };
    step9: {
      title: string;
      subtitle: string;
    };
    step10: {
      title: string;
      subtitle: string;
    };
    step11: {
      title: string;
      subtitle: string;
    };
    step12: {
      title: string;
      subtitle: string;
    };
    step13: {
      title: string;
      subtitle: string;
      modern: string;
      cozy: string;
    };
    // Generation
    generating: {
      errorTitle: string;
      errorTip: string;
    };
  };

  // Generation messages
  generationMessages: string[];

  // Options - these are arrays of objects
  options: {
    household: Array<{ value: string; label: string; description: string }>;
    timeline: Array<{ value: string; label: string; description: string }>;
    size: Array<{ value: string; label: string; sqmRange: string; description: string }>;
    material: Array<{ value: string; label: string; description: string }>;
    energy: Array<{ value: string; label: string; description: string; features: string[] }>;
    extras: Array<{ value: string; label: string; description: string }>;
    budgetTiers: Array<{ label: string }>;
    vibe: Record<number, string>;
  };

  // Mood board tags
  moodTags: Record<string, { tag: string; description: string }>;

  // Results
  results: {
    theHome: string;
    estimatedInvestment: string;
    saving: string;
    viewFullPassport: string;
    noSpam: string;
    emailPlaceholder: string;
    dragToExplore: string;
    pinchToZoom: string;
    showDetails: string;
    hideDetails: string;
    buildCost: string;
    landEstimated: string;
    includingExtras: string;
    more: string;
    overview: string;
    totalInvestment: string;
    traditional: string;
    directSavings: string;
    savingsExplanation: string;
    energyLabel: string;
    mpgScore: string;
    homeOffice: string;
    pets: string;
  };

  // Dashboard
  dashboard: {
    constructionOk: string;
    notifications: string;
    markAllRead: string;
    viewAllNotifications: string;
    projectStatus: string;
    completed: string;
    buildingControlSystem: string;
    buildingPhases: string;
    tasks: string;
    actionRequired: string;
    uploadPhoto: string;
    verified: string;
    verifiedBy: string;
    active: string;
    pending: string;
    locked: string;
    housingPassport: string;
    certified: string;
    verifiedOn: string;
    downloadPdf: string;
    energyProducing: string;
    energyNeutral: string;
    nearlyEnergyNeutral: string;
    energyEfficient: string;
    sustainableFeatures: string;
    projectChat: string;
    participantsOnline: string;
    inspector: string;
    contractor: string;
    system: string;
    sendMessage: string;
    enterToSend: string;
    projectSpecifications: string;
    area: string;
    material: string;
    extras: string;
    documentVault: string;
    openVault: string;
    uploadConcreteReceipts: string;
    uploadDescription: string;
    openCamera: string;
    // Notification types
    paymentReleased: string;
    verificationComplete: string;
    newDocument: string;
    phaseUpdate: string;
  };

  // Construction phases
  phases: Array<{ name: string; tasks: Array<{ name: string; description: string }> }>;
}

export const translations: Record<'nl' | 'en', TranslationKeys> = {
  nl: {
    nav: {
      overview: 'Overzicht',
      market: 'Markt',
      presentation: 'Presentatie',
      forBuilders: 'Voor Aannemers',
      b2b: 'B2B',
      startBuilding: 'Start Bouwen',
    },
    common: {
      next: 'Verder',
      back: 'Terug',
      loading: 'Laden...',
      error: 'Fout',
      retry: 'Opnieuw proberen',
      cancel: 'Annuleren',
      save: 'Opslaan',
      close: 'Sluiten',
      or: 'of',
      and: 'en',
      bedrooms: 'Slaapkamers',
      sqm: 'm²',
      energy: 'Energie',
      validated: 'Gevalideerd',
      aiGenerated: 'AI Gegenereerd',
      perMonth: '/maand',
    },

    hero: {
      headline: 'Bouw je droomhuis met vertrouwen',
      subheadline: 'Van configuratie tot oplevering – volledig transparant, AI-ondersteund en zonder verrassingen',
      ctaButton: 'Start je woningconfiguratie',
      trustedBy: 'Vertrouwd door',
      saving: '€43.000 gemiddelde besparing',
      savingDescription: 'Door minimalisatie van faalkosten',
      transparency: '100% Transparantie',
      transparencyDescription: 'Real-time inzicht in je project',
      speed: '40% Snellere oplevering',
      speedDescription: 'Gestroomlijnde processen',
      sustainability: 'A+++ Energielabel',
      sustainabilityDescription: 'Standaard energieneutraal',
      howItWorks: 'Hoe het werkt',
      howItWorksSubtitle: 'In drie stappen naar je nieuwe woning',
      step1Title: 'Configureer',
      step1Description: 'Beantwoord enkele vragen over je wensen',
      step2Title: 'Visualiseer',
      step2Description: 'Ontvang een AI-gegenereerde visualisatie',
      step3Title: 'Realiseer',
      step3Description: 'Werk samen met geverifieerde aannemers',
      whyChoose: 'Waarom Ooit Gedacht?',
      problemTitle: 'Het probleem',
      problemDescription: 'Traditioneel bouwen is duur, traag en vol verrassingen',
      solutionTitle: 'Onze oplossing',
      solutionDescription: 'Transparante prijzen, gevalideerde kwaliteit, snelle oplevering',
      testimonialTitle: 'Wat onze klanten zeggen',
      faqTitle: 'Veelgestelde vragen',
      ctaTitle: 'Klaar om te beginnen?',
      ctaDescription: 'Configureer je droomhuis in 5 minuten',
      ctaButtonFinal: 'Begin nu',
      footer: {
        tagline: 'De toekomst van woningbouw',
        privacy: 'Privacy',
        terms: 'Voorwaarden',
        contact: 'Contact',
      },
    },

    wizard: {
      step1: {
        title: 'Wie gaat er wonen?',
        subtitle: 'Kies het type huishouden',
      },
      step2: {
        title: 'Hoeveel slaapkamers?',
        subtitle: 'Kies het aantal slaapkamers',
      },
      step3: {
        title: 'Wat is je budget?',
        subtitle: 'Totaal inclusief bouw en kavel',
      },
      step4: {
        title: 'Wanneer wil je bouwen?',
        subtitle: 'Kies je planning',
      },
      step5: {
        title: 'Waar gaan we bouwen?',
        subtitle: 'Kies of zoek een locatie',
        placeholder: 'Postcode, stad of regio...',
        popularLocations: 'Populaire locaties',
      },
      step6: {
        title: 'Kies je stijl',
        subtitle: 'Selecteer de beelden die je aanspreken',
        selectHint: 'Selecteer 1-3 stijlen',
      },
      step7: {
        title: 'Hoe groot?',
        subtitle: 'Kies de grootte van je woning',
      },
      step8: {
        title: 'Welk materiaal?',
        subtitle: 'Kies je bouwmaterialen',
      },
      step9: {
        title: 'Energielevel',
        subtitle: 'Hoe duurzaam wil je wonen?',
      },
      step10: {
        title: 'Energie extras',
        subtitle: 'Selecteer extra energieopties',
      },
      step11: {
        title: 'Buiten extras',
        subtitle: 'Selecteer buitenruimte opties',
      },
      step12: {
        title: 'Comfort extras',
        subtitle: 'Selecteer comfort opties',
      },
      step13: {
        title: 'Welke sfeer?',
        subtitle: 'Kies je interieur vibe',
        modern: 'Modern',
        cozy: 'Knus',
      },
      generating: {
        errorTitle: 'Oeps, dat ging niet goed',
        errorTip: 'Tip: Controleer je internetverbinding en probeer het opnieuw',
      },
    },

    generationMessages: [
      'Analyseren van je huishouden...',
      'Stijlvoorkeuren verwerken...',
      'Materialen en texturen selecteren...',
      'Energiesystemen integreren...',
      'Plattegrond optimaliseren...',
      'Exterieur visualiseren...',
      'Landschapsontwerp toevoegen...',
      'Laatste details afronden...',
      'Je droomhuis staat klaar!',
    ],

    options: {
      household: [
        { value: 'single', label: 'Alleen', description: 'Alleenstaand' },
        { value: 'couple', label: 'Samen', description: 'Stel zonder kinderen' },
        { value: 'family', label: 'Gezin', description: 'Gezin met kinderen' },
        { value: 'multi_gen', label: 'Multigeneratie', description: 'Meerdere generaties' },
        { value: 'other', label: 'Anders', description: 'Andere samenstelling' },
      ],
      timeline: [
        { value: 'asap', label: 'Zo snel mogelijk', description: 'Direct starten' },
        { value: 'within_year', label: 'Binnen 1 jaar', description: 'Dit jaar nog' },
        { value: '1-2_years', label: '1-2 jaar', description: 'Rustig plannen' },
        { value: 'flexible', label: 'Flexibel', description: 'Geen haast' },
      ],
      size: [
        { value: 'compact', label: 'Compact', sqmRange: '80-120 m²', description: 'Starterswoning, efficiënt gebruik van ruimte' },
        { value: 'family', label: 'Gezin', sqmRange: '120-180 m²', description: 'Ruimte voor gezin met kinderen' },
        { value: 'spacious', label: 'Ruim', sqmRange: '180-250 m²', description: 'Vrijstaand met grote tuin' },
        { value: 'villa', label: 'Villa', sqmRange: '250+ m²', description: 'Exclusieve locatie, alle opties' },
      ],
      material: [
        { value: 'wood', label: 'Houtskelet', description: 'Snel te bouwen, goed isolerend' },
        { value: 'brick', label: 'Baksteen', description: 'Meest gekozen in Nederland' },
        { value: 'concrete', label: 'Prefab Beton', description: 'Snelle bouw, strakke afwerking' },
        { value: 'mixed', label: 'Mix', description: 'Combinatie van materialen' },
      ],
      energy: [
        { value: 'standard', label: 'Standaard', description: 'Voldoet aan bouwbesluit', features: ['HR++ beglazing', 'Goede isolatie'] },
        { value: 'aplus', label: 'A++', description: 'Energiezuinig', features: ['Triple glas', 'Warmtepomp', 'Vloerverwarming'] },
        { value: 'neutral', label: 'Energieneutraal', description: 'Opwekken wat je verbruikt', features: ['Zonnepanelen', 'Warmtepomp', 'Thuisbatterij'] },
        { value: 'positive', label: 'Energie+', description: 'Levert energie terug', features: ['Maximaal zonnepanelen', 'Thuisbatterij', 'Slimme sturing'] },
      ],
      extras: [
        { value: 'garage', label: 'Garage', description: 'Inpandige of vrijstaande garage' },
        { value: 'carport', label: 'Carport', description: 'Overdekte parkeerplaats' },
        { value: 'solar', label: 'Zonnepanelen', description: '16-20 panelen op het dak' },
        { value: 'ev_charger', label: 'Laadpaal', description: 'Elektrische auto opladen' },
        { value: 'heat_pump', label: 'Warmtepomp', description: 'Duurzaam verwarmen en koelen' },
        { value: 'battery_storage', label: 'Thuisbatterij', description: 'Energie opslaan' },
        { value: 'office', label: 'Thuiskantoor', description: 'Aparte werkruimte' },
        { value: 'sedum_roof', label: 'Sedumdak', description: 'Groen dak met vetplanten' },
        { value: 'rainwater', label: 'Regenwateropvang', description: 'Hergebruik voor tuin/toilet' },
        { value: 'outdoor_kitchen', label: 'Buitenkeuken', description: 'Koken in de tuin' },
        { value: 'pool', label: 'Zwembad', description: 'Eigen zwembad in de tuin' },
        { value: 'sauna', label: 'Sauna', description: 'Wellness thuis' },
      ],
      budgetTiers: [
        { label: 'Starter' },
        { label: 'Gezin' },
        { label: 'Ruim' },
        { label: 'Premium' },
        { label: 'Villa' },
      ],
      vibe: {
        0: 'Strak & Minimalistisch',
        25: 'Modern & Strak',
        50: 'Gebalanceerd',
        75: 'Warm & Natuurlijk',
        100: 'Knus & Landelijk',
      },
    },

    moodTags: {
      'moderne-villa': { tag: 'Moderne Villa', description: 'Strakke lijnen, grote ramen, plat of zadeldak. Tijdloos modern.' },
      'landelijke-schuur': { tag: 'Landelijke Schuur', description: 'Zwarte houten gevels, hoog plafond, rieten of pannen dak.' },
      'klassiek-nederlands': { tag: 'Klassiek Nederlands', description: 'Rode baksteen, wit kozijn, zadeldak. Tijdloze uitstraling.' },
      'eco-woning': { tag: 'Eco Woning', description: 'Sedumdak, natuurlijke materialen, maximaal duurzaam.' },
      'kubistische-woning': { tag: 'Kubistische Woning', description: 'Plat dak, witte gevels, geometrische vormen. Architectonisch.' },
      'twee-kapper': { tag: 'Ruime Twee-Kapper', description: 'Geschakelde woning met eigen karakter. Populair en praktisch.' },
      'bungalow': { tag: 'Moderne Bungalow', description: 'Alles gelijkvloers, grote tuin, toegankelijk wonen.' },
      'herenhuis': { tag: 'Statig Herenhuis', description: 'Drie lagen, markante gevel, stedelijke allure.' },
    },

    results: {
      theHome: 'De Woning',
      estimatedInvestment: 'Geschatte investering',
      saving: 'besparing',
      viewFullPassport: 'Bekijk Volledig Paspoort',
      noSpam: 'Geen spam • Gevalideerd door Bureau Broersma',
      emailPlaceholder: 'Jouw emailadres',
      dragToExplore: 'Sleep om te verkennen',
      pinchToZoom: 'Pinch to zoom',
      showDetails: 'Toon details',
      hideDetails: 'Verberg details',
      buildCost: 'Bouwkosten',
      landEstimated: 'Kavel (geschat)',
      includingExtras: "Inclusief extra's",
      more: 'meer',
      overview: 'Overzicht',
      totalInvestment: 'Totale Investering',
      traditional: 'traditioneel',
      directSavings: 'Directe Besparing',
      savingsExplanation: 'Door minimalisatie van faalkosten en lagere risicomarge',
      energyLabel: 'Energielabel',
      mpgScore: 'MPG Score',
      homeOffice: 'Thuiskantoor',
      pets: 'Huisdieren',
    },

    dashboard: {
      constructionOk: 'Constructie OK',
      notifications: 'Meldingen',
      markAllRead: 'Alles gelezen',
      viewAllNotifications: 'Alle meldingen bekijken',
      projectStatus: 'Project Status',
      completed: 'Voltooid',
      buildingControlSystem: 'Bouwbesturingssysteem',
      buildingPhases: 'Bouwfases',
      tasks: 'taken',
      actionRequired: 'Actie Vereist',
      uploadPhoto: 'Foto Uploaden',
      verified: 'Geverifieerd',
      verifiedBy: 'Geverifieerd door',
      active: 'Actief',
      pending: 'Wachten',
      locked: 'Vergrendeld',
      housingPassport: 'Woning Paspoort',
      certified: 'Gecertificeerd',
      verifiedOn: 'Geverifieerd op',
      downloadPdf: 'Download PDF',
      energyProducing: 'Energieleverend',
      energyNeutral: 'Energieneutraal',
      nearlyEnergyNeutral: 'Bijna Energieneutraal',
      energyEfficient: 'Energiezuinig',
      sustainableFeatures: 'Duurzame Kenmerken',
      projectChat: 'Project Chat',
      participantsOnline: 'deelnemers online',
      inspector: 'Keurmeester',
      contractor: 'Aannemer',
      system: 'Systeem',
      sendMessage: 'Stuur een bericht...',
      enterToSend: 'Enter om te versturen • Shift+Enter voor nieuwe regel',
      projectSpecifications: 'Project Specificaties',
      area: 'Oppervlakte',
      material: 'Materiaal',
      extras: "Extra's",
      documentVault: 'Documentenkluis',
      openVault: 'Open Kluis',
      uploadConcreteReceipts: 'Upload Betonbonnen',
      uploadDescription: 'Voor validatie van de betonkwaliteit (C30/37) is een foto van de leveranciersbon nodig.',
      openCamera: 'Camera Openen',
      paymentReleased: 'Betaling Vrijgegeven',
      verificationComplete: 'Verificatie Voltooid',
      newDocument: 'Nieuw Document',
      phaseUpdate: 'Fase Update',
    },

    phases: [
      {
        name: 'Voorbereiding',
        tasks: [
          { name: 'Vergunning', description: 'Omgevingsvergunning aanvragen' },
          { name: 'Grondwerk', description: 'Bouwrijp maken van de grond' },
        ],
      },
      {
        name: 'Fundering',
        tasks: [
          { name: 'Heiwerk', description: 'Heipalen plaatsen' },
          { name: 'Wapeningsstaal', description: 'Wapening aanbrengen' },
          { name: 'Beton storten', description: 'Funderingsplaat storten' },
        ],
      },
      {
        name: 'Ruwbouw',
        tasks: [
          { name: 'Begane grond', description: 'Muren begane grond' },
          { name: 'Verdieping', description: 'Muren verdieping' },
          { name: 'Dakconstructie', description: 'Dakconstructie plaatsen' },
        ],
      },
      {
        name: 'Installaties',
        tasks: [
          { name: 'Elektra', description: 'Elektrische installatie' },
          { name: 'Leidingwerk', description: 'Water en sanitair' },
          { name: 'Verwarming', description: 'CV en warmtepomp' },
        ],
      },
      {
        name: 'Afwerking',
        tasks: [
          { name: 'Stucwerk', description: 'Wanden afwerken' },
          { name: 'Schilderwerk', description: 'Binnenschilderwerk' },
          { name: 'Vloeren', description: 'Vloeren leggen' },
        ],
      },
      {
        name: 'Oplevering',
        tasks: [
          { name: 'Eindkeuring', description: 'Finale inspectie' },
          { name: 'Sleuteloverdracht', description: 'Overdracht aan eigenaar' },
        ],
      },
    ],
  },

  en: {
    nav: {
      overview: 'Overview',
      market: 'Market',
      presentation: 'Presentation',
      forBuilders: 'For Builders',
      b2b: 'B2B',
      startBuilding: 'Start Building',
    },
    common: {
      next: 'Next',
      back: 'Back',
      loading: 'Loading...',
      error: 'Error',
      retry: 'Try again',
      cancel: 'Cancel',
      save: 'Save',
      close: 'Close',
      or: 'or',
      and: 'and',
      bedrooms: 'Bedrooms',
      sqm: 'm²',
      energy: 'Energy',
      validated: 'Validated',
      aiGenerated: 'AI Generated',
      perMonth: '/month',
    },

    hero: {
      headline: 'Build your dream home with confidence',
      subheadline: 'From configuration to delivery – fully transparent, AI-powered, and without surprises',
      ctaButton: 'Start your home configuration',
      trustedBy: 'Trusted by',
      saving: '€43,000 average savings',
      savingDescription: 'By minimizing failure costs',
      transparency: '100% Transparency',
      transparencyDescription: 'Real-time insight into your project',
      speed: '40% Faster delivery',
      speedDescription: 'Streamlined processes',
      sustainability: 'A+++ Energy rating',
      sustainabilityDescription: 'Energy neutral by default',
      howItWorks: 'How it works',
      howItWorksSubtitle: 'Three steps to your new home',
      step1Title: 'Configure',
      step1Description: 'Answer a few questions about your preferences',
      step2Title: 'Visualize',
      step2Description: 'Receive an AI-generated visualization',
      step3Title: 'Realize',
      step3Description: 'Work with verified contractors',
      whyChoose: 'Why Ooit Gedacht?',
      problemTitle: 'The problem',
      problemDescription: 'Traditional building is expensive, slow and full of surprises',
      solutionTitle: 'Our solution',
      solutionDescription: 'Transparent pricing, validated quality, fast delivery',
      testimonialTitle: 'What our customers say',
      faqTitle: 'Frequently asked questions',
      ctaTitle: 'Ready to get started?',
      ctaDescription: 'Configure your dream home in 5 minutes',
      ctaButtonFinal: 'Start now',
      footer: {
        tagline: 'The future of home building',
        privacy: 'Privacy',
        terms: 'Terms',
        contact: 'Contact',
      },
    },

    wizard: {
      step1: {
        title: 'Who will be living here?',
        subtitle: 'Choose your household type',
      },
      step2: {
        title: 'How many bedrooms?',
        subtitle: 'Choose the number of bedrooms',
      },
      step3: {
        title: 'What is your budget?',
        subtitle: 'Total including construction and land',
      },
      step4: {
        title: 'When do you want to build?',
        subtitle: 'Choose your timeline',
      },
      step5: {
        title: 'Where will we build?',
        subtitle: 'Search or select a location',
        placeholder: 'Postal code, city or region...',
        popularLocations: 'Popular locations',
      },
      step6: {
        title: 'Choose your style',
        subtitle: 'Select the images that appeal to you',
        selectHint: 'Select 1-3 styles',
      },
      step7: {
        title: 'How big?',
        subtitle: 'Choose the size of your home',
      },
      step8: {
        title: 'Which material?',
        subtitle: 'Choose your building materials',
      },
      step9: {
        title: 'Energy level',
        subtitle: 'How sustainable do you want to live?',
      },
      step10: {
        title: 'Energy extras',
        subtitle: 'Select additional energy options',
      },
      step11: {
        title: 'Outdoor extras',
        subtitle: 'Select outdoor space options',
      },
      step12: {
        title: 'Comfort extras',
        subtitle: 'Select comfort options',
      },
      step13: {
        title: 'What atmosphere?',
        subtitle: 'Choose your interior vibe',
        modern: 'Modern',
        cozy: 'Cozy',
      },
      generating: {
        errorTitle: 'Oops, something went wrong',
        errorTip: 'Tip: Check your internet connection and try again',
      },
    },

    generationMessages: [
      'Analyzing your household...',
      'Processing style preferences...',
      'Selecting materials and textures...',
      'Integrating energy systems...',
      'Optimizing floor plan...',
      'Visualizing exterior...',
      'Adding landscape design...',
      'Finishing final details...',
      'Your dream home is ready!',
    ],

    options: {
      household: [
        { value: 'single', label: 'Single', description: 'Living alone' },
        { value: 'couple', label: 'Couple', description: 'Couple without children' },
        { value: 'family', label: 'Family', description: 'Family with children' },
        { value: 'multi_gen', label: 'Multi-generation', description: 'Multiple generations' },
        { value: 'other', label: 'Other', description: 'Other composition' },
      ],
      timeline: [
        { value: 'asap', label: 'As soon as possible', description: 'Start immediately' },
        { value: 'within_year', label: 'Within 1 year', description: 'This year' },
        { value: '1-2_years', label: '1-2 years', description: 'Plan calmly' },
        { value: 'flexible', label: 'Flexible', description: 'No rush' },
      ],
      size: [
        { value: 'compact', label: 'Compact', sqmRange: '80-120 m²', description: 'Starter home, efficient use of space' },
        { value: 'family', label: 'Family', sqmRange: '120-180 m²', description: 'Space for family with children' },
        { value: 'spacious', label: 'Spacious', sqmRange: '180-250 m²', description: 'Detached with large garden' },
        { value: 'villa', label: 'Villa', sqmRange: '250+ m²', description: 'Exclusive location, all options' },
      ],
      material: [
        { value: 'wood', label: 'Timber frame', description: 'Fast to build, good insulation' },
        { value: 'brick', label: 'Brick', description: 'Most popular in the Netherlands' },
        { value: 'concrete', label: 'Prefab Concrete', description: 'Fast build, sleek finish' },
        { value: 'mixed', label: 'Mix', description: 'Combination of materials' },
      ],
      energy: [
        { value: 'standard', label: 'Standard', description: 'Meets building code', features: ['HR++ glazing', 'Good insulation'] },
        { value: 'aplus', label: 'A++', description: 'Energy efficient', features: ['Triple glass', 'Heat pump', 'Underfloor heating'] },
        { value: 'neutral', label: 'Energy neutral', description: 'Generate what you use', features: ['Solar panels', 'Heat pump', 'Home battery'] },
        { value: 'positive', label: 'Energy+', description: 'Returns energy to grid', features: ['Maximum solar', 'Home battery', 'Smart controls'] },
      ],
      extras: [
        { value: 'garage', label: 'Garage', description: 'Built-in or detached garage' },
        { value: 'carport', label: 'Carport', description: 'Covered parking' },
        { value: 'solar', label: 'Solar panels', description: '16-20 panels on roof' },
        { value: 'ev_charger', label: 'EV Charger', description: 'Charge electric car' },
        { value: 'heat_pump', label: 'Heat pump', description: 'Sustainable heating and cooling' },
        { value: 'battery_storage', label: 'Home battery', description: 'Store energy' },
        { value: 'office', label: 'Home office', description: 'Separate workspace' },
        { value: 'sedum_roof', label: 'Green roof', description: 'Green roof with sedum' },
        { value: 'rainwater', label: 'Rainwater harvesting', description: 'Reuse for garden/toilet' },
        { value: 'outdoor_kitchen', label: 'Outdoor kitchen', description: 'Cook in the garden' },
        { value: 'pool', label: 'Swimming pool', description: 'Private pool in garden' },
        { value: 'sauna', label: 'Sauna', description: 'Wellness at home' },
      ],
      budgetTiers: [
        { label: 'Starter' },
        { label: 'Family' },
        { label: 'Spacious' },
        { label: 'Premium' },
        { label: 'Villa' },
      ],
      vibe: {
        0: 'Sleek & Minimalist',
        25: 'Modern & Clean',
        50: 'Balanced',
        75: 'Warm & Natural',
        100: 'Cozy & Rustic',
      },
    },

    moodTags: {
      'moderne-villa': { tag: 'Modern Villa', description: 'Clean lines, large windows, flat or gabled roof. Timeless modern.' },
      'landelijke-schuur': { tag: 'Rural Barn', description: 'Black wooden facades, high ceilings, thatched or tiled roof.' },
      'klassiek-nederlands': { tag: 'Classic Dutch', description: 'Red brick, white frames, gabled roof. Timeless appeal.' },
      'eco-woning': { tag: 'Eco Home', description: 'Green roof, natural materials, maximum sustainability.' },
      'kubistische-woning': { tag: 'Cubist Home', description: 'Flat roof, white facades, geometric shapes. Architectural.' },
      'twee-kapper': { tag: 'Spacious Semi-Detached', description: 'Semi-detached with its own character. Popular and practical.' },
      'bungalow': { tag: 'Modern Bungalow', description: 'All on one floor, large garden, accessible living.' },
      'herenhuis': { tag: 'Stately Townhouse', description: 'Three floors, striking facade, urban allure.' },
    },

    results: {
      theHome: 'The Home',
      estimatedInvestment: 'Estimated investment',
      saving: 'savings',
      viewFullPassport: 'View Full Passport',
      noSpam: 'No spam • Validated by Bureau Broersma',
      emailPlaceholder: 'Your email address',
      dragToExplore: 'Drag to explore',
      pinchToZoom: 'Pinch to zoom',
      showDetails: 'Show details',
      hideDetails: 'Hide details',
      buildCost: 'Construction costs',
      landEstimated: 'Land (estimated)',
      includingExtras: 'Including extras',
      more: 'more',
      overview: 'Overview',
      totalInvestment: 'Total Investment',
      traditional: 'traditional',
      directSavings: 'Direct Savings',
      savingsExplanation: 'By minimizing failure costs and lower risk margins',
      energyLabel: 'Energy Label',
      mpgScore: 'MPG Score',
      homeOffice: 'Home Office',
      pets: 'Pets',
    },

    dashboard: {
      constructionOk: 'Construction OK',
      notifications: 'Notifications',
      markAllRead: 'Mark all read',
      viewAllNotifications: 'View all notifications',
      projectStatus: 'Project Status',
      completed: 'Completed',
      buildingControlSystem: 'Building Control System',
      buildingPhases: 'Building Phases',
      tasks: 'tasks',
      actionRequired: 'Action Required',
      uploadPhoto: 'Upload Photo',
      verified: 'Verified',
      verifiedBy: 'Verified by',
      active: 'Active',
      pending: 'Pending',
      locked: 'Locked',
      housingPassport: 'Housing Passport',
      certified: 'Certified',
      verifiedOn: 'Verified on',
      downloadPdf: 'Download PDF',
      energyProducing: 'Energy Producing',
      energyNeutral: 'Energy Neutral',
      nearlyEnergyNeutral: 'Nearly Energy Neutral',
      energyEfficient: 'Energy Efficient',
      sustainableFeatures: 'Sustainable Features',
      projectChat: 'Project Chat',
      participantsOnline: 'participants online',
      inspector: 'Inspector',
      contractor: 'Contractor',
      system: 'System',
      sendMessage: 'Send a message...',
      enterToSend: 'Enter to send • Shift+Enter for new line',
      projectSpecifications: 'Project Specifications',
      area: 'Area',
      material: 'Material',
      extras: 'Extras',
      documentVault: 'Document Vault',
      openVault: 'Open Vault',
      uploadConcreteReceipts: 'Upload Concrete Receipts',
      uploadDescription: 'A photo of the supplier receipt is needed for concrete quality validation (C30/37).',
      openCamera: 'Open Camera',
      paymentReleased: 'Payment Released',
      verificationComplete: 'Verification Complete',
      newDocument: 'New Document',
      phaseUpdate: 'Phase Update',
    },

    phases: [
      {
        name: 'Preparation',
        tasks: [
          { name: 'Permit', description: 'Apply for building permit' },
          { name: 'Groundwork', description: 'Prepare the ground for construction' },
        ],
      },
      {
        name: 'Foundation',
        tasks: [
          { name: 'Piling', description: 'Install foundation piles' },
          { name: 'Reinforcement steel', description: 'Apply reinforcement' },
          { name: 'Pour concrete', description: 'Pour foundation slab' },
        ],
      },
      {
        name: 'Shell',
        tasks: [
          { name: 'Ground floor', description: 'Ground floor walls' },
          { name: 'Upper floor', description: 'Upper floor walls' },
          { name: 'Roof structure', description: 'Install roof structure' },
        ],
      },
      {
        name: 'Installations',
        tasks: [
          { name: 'Electrical', description: 'Electrical installation' },
          { name: 'Plumbing', description: 'Water and sanitary' },
          { name: 'Heating', description: 'Central heating and heat pump' },
        ],
      },
      {
        name: 'Finishing',
        tasks: [
          { name: 'Plastering', description: 'Wall finishing' },
          { name: 'Painting', description: 'Interior painting' },
          { name: 'Flooring', description: 'Install floors' },
        ],
      },
      {
        name: 'Handover',
        tasks: [
          { name: 'Final inspection', description: 'Final inspection' },
          { name: 'Key handover', description: 'Transfer to owner' },
        ],
      },
    ],
  },
};

/**
 * Helper to get vibe label based on value
 */
export const getVibeLabel = (value: number, language: 'nl' | 'en'): string => {
  const vibeLabels = translations[language].options.vibe;
  if (value < 15) return vibeLabels[0];
  if (value < 35) return vibeLabels[25];
  if (value < 65) return vibeLabels[50];
  if (value < 85) return vibeLabels[75];
  return vibeLabels[100];
};

/**
 * Get budget tier label based on amount
 */
export const getBudgetTierLabel = (amount: number, language: 'nl' | 'en'): string => {
  const tiers = translations[language].options.budgetTiers;
  if (amount < 350000) return tiers[0].label;
  if (amount < 500000) return tiers[1].label;
  if (amount < 750000) return tiers[2].label;
  if (amount < 1000000) return tiers[3].label;
  return tiers[4].label;
};

