export interface FontOption {
  id: string;
  name: string;
  family: string;
  category: 'serif' | 'sans' | 'mono' | 'display' | 'thai';
  weights: number[];
  xHeightRatio: 'low' | 'medium' | 'high';
  recommendedMinPt: number;
  printViabilityNotes: string;
  isThaiSupport: boolean;
}

export interface FontPairingPreset {
  id: string;
  name: string;
  subtitle: string;
  category: 'Academic & Monograph' | 'Swiss Modernist' | 'Literary & Archival' | 'Technical & Spec' | 'Regional & Cultural' | 'Contemporary Editorial';
  description: string;
  headlineFont: string;
  subheadFont: string;
  bodyFont: string;
  thaiFont: string;
  defaultBodyPt: number;
  defaultLeadingPt: number;
  defaultThaiCompensationPt: number;
  recommendedColumnMm: number;
  targetCpl: string;
  prepressNotes: string;
}

export interface EditorialSampleText {
  id: string;
  title: string;
  category: string;
  language: 'en' | 'th' | 'bilingual';
  headline: string;
  subhead: string;
  bodyParagraphs: string[];
  footnotes?: string[];
  metaInfo: {
    author: string;
    publication: string;
    section: string;
    wordCount: number;
  };
}

export interface TypographyAuditResult {
  charactersPerLine: number;
  cplStatus: 'optimal' | 'narrow' | 'wide';
  leadingRatio: number; // percentage, e.g. 140%
  leadingStatus: 'optimal' | 'tight' | 'loose';
  pointSizeViability: {
    status: 'pass' | 'warning' | 'fail';
    message: string;
  };
  dotGainVulnerability: {
    status: 'low' | 'moderate' | 'high';
    simulationSpreadPercent: number;
    message: string;
  };
  thaiOrthographyClearance: {
    status: 'safe' | 'caution' | 'collision_risk';
    effectiveLeadingPt: number;
    message: string;
  };
  baselineGridStatus: {
    isSnapping: boolean;
    nearestGridMultiplePt: number;
    deviationPt: number;
  };
  reverseTypeViability: {
    status: 'safe' | 'caution' | 'perilous';
    message: string;
  };
  readabilityScore: number; // 0 - 100
  editorialCritiques: string[];
}

export interface AiFontPairingRecommendation {
  id: string;
  pairingName: string;
  moodTag: string;
  headlineFont: string;
  bodyFont: string;
  thaiFont: string;
  recommendedBodyPt: number;
  recommendedLeadingPt: number;
  recommendedThaiCompensationPt: number;
  recommendedColumnMm: number;
  rationale: string;
  typographicVoice: string;
  printViabilityScore: number;
  designStyleCategory: string;
  keyTraits: string[];
}

export interface AiFontRecommendationRequest {
  themeOrMood: string;
  projectTitle: string;
  projectType: string;
  targetMedia?: string;
  paperStock?: string;
  currentBodyPt?: number;
}
