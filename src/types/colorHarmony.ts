export interface CMYKColorValues {
  c: number;
  m: number;
  y: number;
  k: number;
  tac?: number;
  formatted: string;
}

export interface AssetDominantColor {
  hex: string;
  r: number;
  g: number;
  b: number;
  cmyk: CMYKColorValues;
  percentage: number;
  name: string;
  isNeutral: boolean;
  tac: number; // Total Area Coverage %
  isGamutSafe: boolean;
}

export interface ProjectAsset {
  id: string;
  name: string;
  type: 'photography' | 'illustration' | 'crest' | 'texture' | 'vector' | 'archive';
  url: string;
  previewUrl?: string;
  description: string;
  resolutionDpi: number;
  dimensions: {
    widthMm: number;
    heightMm: number;
    widthPx: number;
    heightPx: number;
  };
  dominantColors: AssetDominantColor[];
  extractedDate: string;
  isCustomUpload?: boolean;
}

export interface PrepressColor {
  id: string;
  name: string;
  hex: string;
  cmyk: CMYKColorValues;
  role: 'Primary Field' | 'Secondary Accent' | 'Supporting Neutral' | 'Substrate Tint' | 'Typographic Black' | 'Spot Plate Highlight';
  tac: number; // Total Area Coverage (C + M + Y + K)
  isGamutSafe: boolean; // False if out of ISO 12647-2 FOGRA39 gamut
  gamutWarning?: string;
  nearestPantone: {
    code: string;
    name: string;
    deltaE: number;
  };
  dotGainCompensationApplied: boolean;
  isOverprintRecommended: boolean;
}

export type HarmonySchemeType =
  | 'analogous'
  | 'complementary'
  | 'triadic'
  | 'split_complementary'
  | 'tetradic'
  | 'monochromatic_duotone'
  | 'isan_heritage';

export interface HarmonySchemeInfo {
  type: HarmonySchemeType;
  name: string;
  subtitle: string;
  description: string;
  prepressContext: string;
  tags: string[];
}

export interface ColorHarmonyResult {
  schemeType: HarmonySchemeType;
  schemeName: string;
  description: string;
  baseColor: AssetDominantColor;
  sourceAssetName: string;
  colors: PrepressColor[];
  standardsReport: {
    isoStandard: 'ISO 12647-2:2013' | 'FOGRA39 Commercial Offset';
    maxTacPercent: number;
    tacStatus: 'COMPLIANT' | 'CAUTION' | 'EXCEEDS';
    gamutStatus: 'ALL_IN_GAMUT' | 'GAMUT_WARNINGS';
    richBlackStatus: 'VALID_K100' | 'WARNING_RICH_BODY';
    recommendedSubstrate: string;
    complianceScore: number; // 0 - 100
  };
}
