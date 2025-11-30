/**
 * Construction Milestone Constants
 * Maps all construction phases and tasks to their generated images
 */

export interface MilestoneTask {
  id: string;
  name: string;
  description?: string;
  image: string;
  status: 'completed' | 'active' | 'pending' | 'locked';
  verifiedBy?: string;
  verifiedAt?: string;
}

export interface ConstructionPhase {
  id: string;
  name: string;
  icon: string;
  tasks: MilestoneTask[];
}

// All milestone images mapped by phase and task
export const MILESTONE_IMAGES = {
  voorbereiding: {
    grondonderzoek: '/generated/milestones/voorbereiding/grondonderzoek.png',
    bouwvergunning: '/generated/milestones/voorbereiding/bouwvergunning.png',
    uitzetwerk: '/generated/milestones/voorbereiding/uitzetwerk.png',
  },
  fundering: {
    'uitgraven-bouwput': '/generated/milestones/fundering/uitgraven-bouwput.png',
    heipalen: '/generated/milestones/fundering/heipalen.png',
    wapeningsstaal: '/generated/milestones/fundering/wapeningsstaal.png',
    betonbon: '/generated/milestones/fundering/betonbon.png',
    'storten-fundering': '/generated/milestones/fundering/storten-fundering.png',
    uitharding: '/generated/milestones/fundering/uitharding.png',
  },
  ruwbouw: {
    metselwerk: '/generated/milestones/ruwbouw/metselwerk.png',
    dakconstructie: '/generated/milestones/ruwbouw/dakconstructie.png',
    dakpannen: '/generated/milestones/ruwbouw/dakpannen.png',
    kozijnen: '/generated/milestones/ruwbouw/kozijnen.png',
  },
  afbouw: {
    'elektra-installatie': '/generated/milestones/afbouw/elektra-installatie.png',
    leidingwerk: '/generated/milestones/afbouw/leidingwerk.png',
    stucwerk: '/generated/milestones/afbouw/stucwerk.png',
    vloerleggen: '/generated/milestones/afbouw/vloerleggen.png',
    'keuken-montage': '/generated/milestones/afbouw/keuken-montage.png',
  },
  oplevering: {
    eindcontrole: '/generated/milestones/oplevering/eindcontrole.png',
    sleuteloverdracht: '/generated/milestones/oplevering/sleuteloverdracht.png',
    'woning-gereed': '/generated/milestones/oplevering/woning-gereed.png',
  },
} as const;

// Full construction phases with all tasks and metadata
export const CONSTRUCTION_PHASES: ConstructionPhase[] = [
  {
    id: 'voorbereiding',
    name: 'Voorbereiding',
    icon: '📋',
    tasks: [
      {
        id: 'grondonderzoek',
        name: 'Grondonderzoek & Sondering',
        description: 'Geotechnisch onderzoek van de bouwgrond',
        image: MILESTONE_IMAGES.voorbereiding.grondonderzoek,
        status: 'completed',
        verifiedBy: 'Bureau Broersma',
        verifiedAt: '2025-11-15',
      },
      {
        id: 'bouwvergunning',
        name: 'Bouwvergunning & Omgevingsvergunning',
        description: 'Officiële goedkeuring van de gemeente',
        image: MILESTONE_IMAGES.voorbereiding.bouwvergunning,
        status: 'completed',
        verifiedBy: 'Gemeente',
        verifiedAt: '2025-11-20',
      },
      {
        id: 'uitzetwerk',
        name: 'Uitzetwerk & Bouwplaats Markering',
        description: 'Landmeetkundige markering van de fundering',
        image: MILESTONE_IMAGES.voorbereiding.uitzetwerk,
        status: 'completed',
        verifiedBy: 'Landmeter',
        verifiedAt: '2025-11-22',
      },
    ],
  },
  {
    id: 'fundering',
    name: 'Fundering',
    icon: '🏗️',
    tasks: [
      {
        id: 'uitgraven-bouwput',
        name: 'Uitgraven Bouwput',
        description: 'Grondwerk voor de funderingsput',
        image: MILESTONE_IMAGES.fundering['uitgraven-bouwput'],
        status: 'completed',
        verifiedBy: 'Bureau Broersma',
        verifiedAt: '2025-11-25',
      },
      {
        id: 'heipalen',
        name: 'Heien & Funderingspalen',
        description: 'Plaatsen van betonnen heipalen',
        image: MILESTONE_IMAGES.fundering.heipalen,
        status: 'completed',
        verifiedBy: 'Bureau Broersma',
        verifiedAt: '2025-11-26',
      },
      {
        id: 'wapeningsstaal',
        name: 'Wapeningsstaal',
        description: 'Wapening As-A t/m D',
        image: MILESTONE_IMAGES.fundering.wapeningsstaal,
        status: 'completed',
        verifiedBy: 'Bureau Broersma',
        verifiedAt: '2025-11-28',
      },
      {
        id: 'betonbon',
        name: 'Betonlevering & Betonbon',
        description: 'Verificatie betonkwaliteit C30/37',
        image: MILESTONE_IMAGES.fundering.betonbon,
        status: 'active',
      },
      {
        id: 'storten-fundering',
        name: 'Storten Fundering',
        description: 'Betonstort en verdichting',
        image: MILESTONE_IMAGES.fundering['storten-fundering'],
        status: 'pending',
      },
      {
        id: 'uitharding',
        name: 'Uitharding & Nabehandeling',
        description: 'Betonuitharding en nabehandeling',
        image: MILESTONE_IMAGES.fundering.uitharding,
        status: 'locked',
      },
    ],
  },
  {
    id: 'ruwbouw',
    name: 'Ruwbouw',
    icon: '🧱',
    tasks: [
      {
        id: 'metselwerk',
        name: 'Metselwerk & Gevel',
        description: 'Bakstenen gevels en dragende muren',
        image: MILESTONE_IMAGES.ruwbouw.metselwerk,
        status: 'locked',
      },
      {
        id: 'dakconstructie',
        name: 'Dakconstructie & Spanten',
        description: 'Houten dakspanten en constructie',
        image: MILESTONE_IMAGES.ruwbouw.dakconstructie,
        status: 'locked',
      },
      {
        id: 'dakpannen',
        name: 'Dakbedekking & Pannen',
        description: 'Dakpannen of andere dakbedekking',
        image: MILESTONE_IMAGES.ruwbouw.dakpannen,
        status: 'locked',
      },
      {
        id: 'kozijnen',
        name: 'Kozijnen & Ramen',
        description: 'Ramen, deuren en kozijnen',
        image: MILESTONE_IMAGES.ruwbouw.kozijnen,
        status: 'locked',
      },
    ],
  },
  {
    id: 'afbouw',
    name: 'Afbouw & Installatie',
    icon: '🔧',
    tasks: [
      {
        id: 'elektra-installatie',
        name: 'Elektra Installatie',
        description: 'Elektrische bedrading en groepenkast',
        image: MILESTONE_IMAGES.afbouw['elektra-installatie'],
        status: 'locked',
      },
      {
        id: 'leidingwerk',
        name: 'Leidingwerk & Sanitair',
        description: 'Water- en afvoerleidingen',
        image: MILESTONE_IMAGES.afbouw.leidingwerk,
        status: 'locked',
      },
      {
        id: 'stucwerk',
        name: 'Stucwerk & Wanden',
        description: 'Binnenafwerking wanden en plafonds',
        image: MILESTONE_IMAGES.afbouw.stucwerk,
        status: 'locked',
      },
      {
        id: 'vloerleggen',
        name: 'Vloeren Leggen',
        description: 'Vloerbedekking en afwerking',
        image: MILESTONE_IMAGES.afbouw.vloerleggen,
        status: 'locked',
      },
      {
        id: 'keuken-montage',
        name: 'Keuken Montage',
        description: 'Keukeninstallatie en apparatuur',
        image: MILESTONE_IMAGES.afbouw['keuken-montage'],
        status: 'locked',
      },
    ],
  },
  {
    id: 'oplevering',
    name: 'Oplevering',
    icon: '🎉',
    tasks: [
      {
        id: 'eindcontrole',
        name: 'Eindcontrole & Keuring',
        description: 'Bouwkundige eindkeuring',
        image: MILESTONE_IMAGES.oplevering.eindcontrole,
        status: 'locked',
      },
      {
        id: 'sleuteloverdracht',
        name: 'Sleuteloverdracht',
        description: 'Officiële sleuteloverdracht',
        image: MILESTONE_IMAGES.oplevering.sleuteloverdracht,
        status: 'locked',
      },
      {
        id: 'woning-gereed',
        name: 'Woning Gereed',
        description: 'Uw droomhuis is klaar!',
        image: MILESTONE_IMAGES.oplevering['woning-gereed'],
        status: 'locked',
      },
    ],
  },
];

// Helper to get task by ID
export const getTaskById = (taskId: string): MilestoneTask | undefined => {
  for (const phase of CONSTRUCTION_PHASES) {
    const task = phase.tasks.find(t => t.id === taskId);
    if (task) return task;
  }
  return undefined;
};

// Helper to get phase by task ID
export const getPhaseByTaskId = (taskId: string): ConstructionPhase | undefined => {
  for (const phase of CONSTRUCTION_PHASES) {
    if (phase.tasks.some(t => t.id === taskId)) return phase;
  }
  return undefined;
};

// Helper to calculate phase progress
export const getPhaseProgress = (phase: ConstructionPhase): { completed: number; total: number } => {
  const completed = phase.tasks.filter(t => t.status === 'completed').length;
  return { completed, total: phase.tasks.length };
};

// Helper to calculate overall progress
export const getOverallProgress = (): { completed: number; total: number; percentage: number } => {
  let completed = 0;
  let total = 0;
  for (const phase of CONSTRUCTION_PHASES) {
    const progress = getPhaseProgress(phase);
    completed += progress.completed;
    total += progress.total;
  }
  return { completed, total, percentage: Math.round((completed / total) * 100) };
};

