/**
 * Translation types for type-safe i18n
 */

// Navigation translations
export interface NavTranslations {
  overview: string;
  market: string;
  presentation: string;
  forBuilders: string;
  b2b: string;
  startBuilding: string;
}

// Common translations
export interface CommonTranslations {
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
}

// Phase task type
export interface PhaseTask {
  name: string;
  description: string;
}

// Phase type
export interface Phase {
  name: string;
  tasks: PhaseTask[];
}

/**
 * Complete translation keys interface
 * This is the main type used throughout the app
 */
export interface TranslationKeys {
  nav: NavTranslations;
  common: CommonTranslations;
  hero: HeroTranslations;
  wizard: WizardTranslations;
  options: OptionsTranslations;
  results: ResultsTranslations;
  dashboard: DashboardTranslations;
  phases: Phase[];
  vibeLabels: VibeLabels;
  generationMessages: string[];
  errors: ErrorTranslations;
}

// Hero / Landing page translations
export interface HeroTranslations {
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
  howItWorksCta: string;
  howItWorksSectionSubtitle: string;
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
  faqSubtitle: string;
  ctaTitle: string;
  ctaDescription: string;
  ctaButtonFinal: string;
  bouwborgB2b: string;
  dashboardStatus: string;
  marketAnalysis: string;
  currentMarketData: string;
  investorPitchDeck: string;
  startDreamHome: string;
  freeNoAccount: string;
  whatYouGet: string;
  whatYouGetSubtitle: string;
  startYourDesign: string;
  free3MinNoAccount: string;
  certificateOfAuthenticity: string;
  housingPassport: string;
  passportSubtitle1: string;
  passportSubtitle2: string;
  totalBuildCost: string;
  exclVatLand: string;
  energyLabel: string;
  buildTime: string;
  fromBuildStart: string;
  mpgScore: string;
  hideDetails: string;
  viewFullValidation: string;
  validationTimeline: string;
  aiDesignGenerated: string;
  aiDesignDesc: string;
  zoningPlanChecked: string;
  zoningPlanDesc: string;
  buildingVolumeOk: string;
  buildingVolumeDesc: string;
  neighborConsultation: string;
  neighborDesc: string;
  permitApproved: string;
  permitDesc: string;
  allValidations: string;
  viewFullReport: string;
  kavel: string;
  kavelChecked: string;
  kavelLand: string;
  designConfig: string;
  designConfigured: string;
  designYourHome: string;
  permitStatus: string;
  permitSubmitted: string;
  permitApplication: string;
  builderStatus: string;
  builderMatched: string;
  certifiedBuilder: string;
  yourPassportId: string;
  passportDesc: string;
  homeSpecsTitle: string;
  totalArea: string;
  bedroomCount: string;
  floorCount: string;
  garageSpace: string;
  energyClass: string;
  heatPump: string;
  solarPanels: string;
  homeBattery: string;
  sustainabilityDesc: string;
  estimatedBuildCost: string;
  exclLandBtw: string;
  roofType: string;
  roofTypePitched: string;
  mainMaterial: string;
  mainMaterialBrick: string;
  estimatedLandCost: string;
  constructionTime: string;
  weeks: string;
  includesPermit: string;
  validityDate: string;
  getYourPassport: string;
  [key: string]: string;
}

// Wizard translations
export interface WizardTranslations {
  step: string;
  of: string;
  tellUsAboutYou: string;
  householdType: string;
  howManyBedrooms: string;
  budgetQuestion: string;
  budgetLabel: string;
  timelineQuestion: string;
  locationQuestion: string;
  locationPlaceholder: string;
  styleQuestion: string;
  swipeInstructions: string;
  sizeQuestion: string;
  materialQuestion: string;
  energyQuestion: string;
  extrasQuestion: string;
  vibeQuestion: string;
  vibeInstructions: string;
  generateButton: string;
  generating: string;
  [key: string]: string;
}

// Options translations
export interface OptionsTranslations {
  asap: string;
  withinYear: string;
  oneToTwoYears: string;
  flexible: string;
  [key: string]: string;
}

// Results translations
export interface ResultsTranslations {
  title: string;
  subtitle: string;
  dreamHome: string;
  estimatedCost: string;
  buildCost: string;
  landCost: string;
  totalCost: string;
  breakdown: string;
  downloadPdf: string;
  shareResults: string;
  startOver: string;
  scheduleConsultation: string;
  unlockButton: string;
  lockedMessage: string;
  [key: string]: string;
}

// Dashboard translations
export interface DashboardTranslations {
  welcome: string;
  overview: string;
  phases: string;
  documents: string;
  chat: string;
  progress: string;
  currentPhase: string;
  nextMilestone: string;
  estimatedCompletion: string;
  recentActivity: string;
  viewAll: string;
  noActivity: string;
  uploadDocument: string;
  downloadAll: string;
  startChat: string;
  chatPlaceholder: string;
  send: string;
  [key: string]: string;
}

// Vibe labels for slider
export interface VibeLabels {
  cold: string;
  cool: string;
  balanced: string;
  warm: string;
  cozy: string;
}

// Error translations
export interface ErrorTranslations {
  generic: string;
  network: string;
  timeout: string;
  notFound: string;
  unauthorized: string;
  validation: string;
  generation: string;
  [key: string]: string;
}




