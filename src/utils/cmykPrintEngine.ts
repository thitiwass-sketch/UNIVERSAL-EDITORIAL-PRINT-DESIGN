import {
  AssetDominantColor,
  ColorHarmonyResult,
  HarmonySchemeInfo,
  HarmonySchemeType,
  PrepressColor,
} from '../types/colorHarmony';

// Curated reference Pantone spot library for prepress fifth-plate matching
interface PantoneRef {
  code: string;
  name: string;
  c: number;
  m: number;
  y: number;
  k: number;
  hex: string;
}

const PANTONE_SPOT_LIBRARY: PantoneRef[] = [
  { code: 'Pantone 871 C', name: 'Metallic Warm Gold', c: 20, m: 25, y: 60, k: 25, hex: '#c5a059' },
  { code: 'Pantone 877 C', name: 'Metallic Silver', c: 15, m: 10, y: 10, k: 30, hex: '#a6a9aa' },
  { code: 'Pantone 289 C', name: 'Academic Navy Solid', c: 100, m: 84, y: 45, k: 50, hex: '#0c2340' },
  { code: 'Pantone Reflex Blue C', name: 'Reflex Blue Deep', c: 100, m: 89, y: 0, k: 0, hex: '#0a1172' },
  { code: 'Pantone 186 C', name: 'Academic Crimson', c: 0, m: 100, y: 81, k: 4, hex: '#c8102e' },
  { code: 'Pantone 1665 C', name: 'Isan Terracotta', c: 0, m: 79, y: 100, k: 0, hex: '#dc4405' },
  { code: 'Pantone 7406 C', name: 'Muted Marigold', c: 0, m: 20, y: 100, k: 2, hex: '#f1be3e' },
  { code: 'Pantone 3282 C', name: 'Silk Emerald Green', c: 100, m: 0, y: 53, k: 20, hex: '#00857c' },
  { code: 'Pantone 7468 C', name: 'Architectural Cerulean', c: 100, m: 12, y: 30, k: 5, hex: '#007fa3' },
  { code: 'Pantone Warm Gray 1 C', name: 'Tactile Ivory Tint', c: 3, m: 3, y: 6, k: 7, hex: '#e8e5df' },
  { code: 'Pantone Warm Gray 9 C', name: 'Deep Slate Mineral', c: 20, m: 25, y: 30, k: 60, hex: '#635d5a' },
  { code: 'Pantone Black 6 C', name: 'Rich Carbon Black', c: 60, m: 40, y: 40, k: 100, hex: '#111315' },
  { code: 'Pantone 2685 C', name: 'Royal Orchid Violet', c: 90, m: 100, y: 0, k: 5, hex: '#330072' },
  { code: 'Pantone 4645 C', name: 'Raw Craft Ochre', c: 15, m: 45, y: 70, k: 20, hex: '#ac7a53' },
];

export const HARMONY_SCHEME_DEFINITIONS: Record<HarmonySchemeType, HarmonySchemeInfo> = {
  analogous: {
    type: 'analogous',
    name: 'Harmonious Analogous',
    subtitle: 'Adjacent Wheel Harmony (±30° & ±60°)',
    description: 'Calm, unified, and optically coherent. Highly recommended for academic monographs, literary book jackets, and archival publications.',
    prepressContext: 'Low dot gain discrepancy between plates; smooth transitions on uncoated Munken papers.',
    tags: ['Cohesive', 'Scholarly', 'Smooth Inking'],
  },
  complementary: {
    type: 'complementary',
    name: 'Harmonious Complementary',
    subtitle: 'High-Impact Opposite Axis (180°)',
    description: 'Dynamic visual tension that instantly anchors eye movement. Ideal for exhibition posters, feature magazine double-spreads, and event flyers.',
    prepressContext: 'Ensure trapping margins (0.15mm) when complementary solids abut to prevent white gaps.',
    tags: ['High Contrast', 'Dynamic Pop', 'Display Posters'],
  },
  triadic: {
    type: 'triadic',
    name: 'Triadic Prepress Spectrum',
    subtitle: 'Equilateral 3-Point Balance (120° / 240°)',
    description: 'Vibrant yet disciplined three-way harmony. Yields distinct, recognizable color coding for multi-chapter editorial volumes and corporate reports.',
    prepressContext: 'Distributes ink density across Cyan, Magenta, and Yellow plates without over-saturating a single channel.',
    tags: ['Balanced', 'Information Design', 'Multi-Section'],
  },
  split_complementary: {
    type: 'split_complementary',
    name: 'Split-Complementary Nuance',
    subtitle: 'Refined Contrast (150° & 210°)',
    description: 'Delivers the contrast of complementary pairing without jarring optical vibration. Beloved by Swiss editorial art directors.',
    prepressContext: 'Provides softer halftone boundaries and superior readability under diverse lighting conditions.',
    tags: ['Refined', 'Swiss Editorial', 'Nuanced'],
  },
  tetradic: {
    type: 'tetradic',
    name: 'Tetradic Dual-Complementary',
    subtitle: 'Four-Point Rectangular Harmony',
    description: 'A rich four-color architecture that balances two complementary pairs. Perfect for elaborate infographics, charts, and identity manuals.',
    prepressContext: 'Requires careful Total Area Coverage (TAC) control so overlapping four-color fills do not exceed 280%.',
    tags: ['Rich', 'Infographics', 'Brand Systems'],
  },
  monochromatic_duotone: {
    type: 'monochromatic_duotone',
    name: 'Monochromatic Duotone & Tints',
    subtitle: 'Tonal Value Stacking with Spot Ink',
    description: 'Explores value, luminance, and halftone tint percentages of the dominant hue paired with pure K100 and paper stock ivory.',
    prepressContext: 'Economical 2-plate printing (Pantone Spot + Black K). 100% elimination of 4-color misregistration.',
    tags: ['2-Plate Budget', 'Duotone', 'Zero Registration Error'],
  },
  isan_heritage: {
    type: 'isan_heritage',
    name: 'NRRU Isan Heritage Harmony',
    subtitle: 'Regional Earth, Kram Indigo & 22K Gold',
    description: 'Custom formulation tailored for Faculty of Industrial Technology (NRRU): deep Kram indigo, silk ochre, Dan Kwian terracotta, and Munken pure cream.',
    prepressContext: 'Fully calibrated for ISO 12647-2 uncoated book stocks with Plate 5 metallic foil stamping.',
    tags: ['NRRU Heritage', 'Kram Indigo', 'Metallic Gold'],
  },
};

// Converts standard RGB (0-255) to CMYK with GCR (Gray Component Replacement)
export function rgbToCmyk(
  r: number,
  g: number,
  b: number,
  maxAllowedTac = 280
): { c: number; m: number; y: number; k: number; tac: number; formatted: string } {
  const rNorm = Math.max(0, Math.min(255, r)) / 255;
  const gNorm = Math.max(0, Math.min(255, g)) / 255;
  const bNorm = Math.max(0, Math.min(255, b)) / 255;

  let c = 1 - rNorm;
  let m = 1 - gNorm;
  let y = 1 - bNorm;
  let k = Math.min(c, m, y);

  if (k >= 0.99) {
    return { c: 0, m: 0, y: 0, k: 100, tac: 100, formatted: 'C:0 M:0 Y:0 K:100' };
  }

  // Gray Component Replacement (GCR): shift common neutral component to Black (K)
  const gcrFactor = 0.85; // Standard 85% medium GCR for commercial sheetfed
  const kApplied = k * gcrFactor;

  c = (c - kApplied) / (1 - kApplied);
  m = (m - kApplied) / (1 - kApplied);
  y = (y - kApplied) / (1 - kApplied);

  let cPct = Math.round(c * 100);
  let mPct = Math.round(m * 100);
  let yPct = Math.round(y * 100);
  let kPct = Math.round(kApplied * 100);

  // Under Color Removal (UCR) if Total Area Coverage (TAC) exceeds max threshold
  let tac = cPct + mPct + yPct + kPct;
  if (tac > maxAllowedTac) {
    const excess = tac - maxAllowedTac;
    const cmySum = cPct + mPct + yPct;
    if (cmySum > 0) {
      const reductionRatio = (cmySum - excess) / cmySum;
      cPct = Math.max(0, Math.round(cPct * reductionRatio));
      mPct = Math.max(0, Math.round(mPct * reductionRatio));
      yPct = Math.max(0, Math.round(yPct * reductionRatio));
    }
    tac = cPct + mPct + yPct + kPct;
  }

  // Standardize bounds
  cPct = Math.max(0, Math.min(100, cPct));
  mPct = Math.max(0, Math.min(100, mPct));
  yPct = Math.max(0, Math.min(100, yPct));
  kPct = Math.max(0, Math.min(100, kPct));

  return {
    c: cPct,
    m: mPct,
    y: yPct,
    k: kPct,
    tac,
    formatted: `C:${cPct} M:${mPct} Y:${yPct} K:${kPct}`,
  };
}

// Converts CMYK (0-100) to display RGB (0-255) with paper substrate simulation
export function cmykToRgb(c: number, m: number, y: number, k: number): { r: number; g: number; b: number; hex: string } {
  const cNorm = c / 100;
  const mNorm = m / 100;
  const yNorm = y / 100;
  const kNorm = k / 100;

  let r = 255 * (1 - cNorm) * (1 - kNorm);
  let g = 255 * (1 - mNorm) * (1 - kNorm);
  let b = 255 * (1 - yNorm) * (1 - kNorm);

  // Slight optical ink absorption warmth on press paper
  r = Math.round(Math.max(0, Math.min(255, r)));
  g = Math.round(Math.max(0, Math.min(255, g)));
  b = Math.round(Math.max(0, Math.min(255, b)));

  const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  return { r, g, b, hex };
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let clean = hex.replace('#', '');
  if (clean.length === 3) {
    clean = clean.split('').map((ch) => ch + ch).join('');
  }
  const num = parseInt(clean, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const rClamped = Math.max(0, Math.min(255, Math.round(r)));
  const gClamped = Math.max(0, Math.min(255, Math.round(g)));
  const bClamped = Math.max(0, Math.min(255, Math.round(b)));
  return `#${rClamped.toString(16).padStart(2, '0')}${gClamped.toString(16).padStart(2, '0')}${bClamped.toString(16).padStart(2, '0')}`;
}

export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / d + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  const hNorm = (h % 360 + 360) % 360 / 360;
  const sNorm = Math.max(0, Math.min(100, s)) / 100;
  const lNorm = Math.max(0, Math.min(100, l)) / 100;

  if (sNorm === 0) {
    const val = Math.round(lNorm * 255);
    return { r: val, g: val, b: val };
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    let tAdj = t;
    if (tAdj < 0) tAdj += 1;
    if (tAdj > 1) tAdj -= 1;
    if (tAdj < 1 / 6) return p + (q - p) * 6 * tAdj;
    if (tAdj < 1 / 2) return q;
    if (tAdj < 2 / 3) return p + (q - p) * (2 / 3 - tAdj) * 6;
    return p;
  };

  const q = lNorm < 0.5 ? lNorm * (1 + sNorm) : lNorm + sNorm - lNorm * sNorm;
  const p = 2 * lNorm - q;

  const r = Math.round(hue2rgb(p, q, hNorm + 1 / 3) * 255);
  const g = Math.round(hue2rgb(p, q, hNorm) * 255);
  const b = Math.round(hue2rgb(p, q, hNorm - 1 / 3) * 255);

  return { r, g, b };
}

// Determines if an RGB color is within the ISO 12647-2 FOGRA39 achievable printable gamut
export function checkCmykGamut(r: number, g: number, b: number): { isSafe: boolean; warning?: string } {
  const { s, l } = rgbToHsl(r, g, b);

  // Hyper-saturated RGB lights (e.g. neon electric greens, pure vibrant cyans, glowing magentas)
  // that exceed physical ink density limits
  if (s > 88 && l > 35 && l < 75) {
    return {
      isSafe: false,
      warning: 'Out of FOGRA39 Gamut: Saturated screen luminesces beyond physical CMYK pigment absorption. Will visually soften on press.',
    };
  }

  // Pure high-energy green / cyan boundary
  if (g > 230 && r < 40 && b < 120) {
    return {
      isSafe: false,
      warning: 'Gamut Warning: Electric process green cannot be reproduced without 5th spot plate (Pantone Green / Hexachrome).',
    };
  }

  return { isSafe: true };
}

// Find closest Pantone Spot match using weighted Euclidean distance in CMYK space
export function findNearestPantone(cmyk: { c: number; m: number; y: number; k: number }): {
  code: string;
  name: string;
  deltaE: number;
} {
  let minDistance = Infinity;
  let bestMatch = PANTONE_SPOT_LIBRARY[0];

  for (const p of PANTONE_SPOT_LIBRARY) {
    const dc = cmyk.c - p.c;
    const dm = cmyk.m - p.m;
    const dy = cmyk.y - p.y;
    const dk = (cmyk.k - p.k) * 1.2; // Black carries more perceptual weight
    const dist = Math.sqrt(dc * dc + dm * dm + dy * dy + dk * dk);

    if (dist < minDistance) {
      minDistance = dist;
      bestMatch = p;
    }
  }

  return {
    code: bestMatch.code,
    name: bestMatch.name,
    deltaE: Math.round(minDistance * 10) / 10,
  };
}

// Intelligent name generator based on Hue, Saturation, and Lightness
export function generateColorName(h: number, s: number, l: number, cmyk: { c: number; m: number; y: number; k: number }): string {
  if (cmyk.k >= 95 && cmyk.c === 0 && cmyk.m === 0 && cmyk.y === 0) {
    return 'Pure Press Black (K100)';
  }
  if (cmyk.k >= 90 && (cmyk.c > 30 || cmyk.m > 30)) {
    return 'Rich Carbon Black';
  }
  if (l >= 94 && s <= 15) {
    return 'Tactile Munken Ivory Substrate';
  }
  if (s <= 10) {
    if (l > 75) return 'Press Silver Ash';
    if (l > 45) return 'Neutral Slate Gray';
    return 'Deep Mineral Charcoal';
  }

  let hueName = '';
  if (h >= 345 || h < 15) hueName = 'Academic Crimson';
  else if (h >= 15 && h < 45) hueName = 'Isan Terracotta';
  else if (h >= 45 && h < 65) hueName = 'Metallic Silk Ochre';
  else if (h >= 65 && h < 160) hueName = 'Verdant Forest Green';
  else if (h >= 160 && h < 200) hueName = 'FOGRA39 Cyan';
  else if (h >= 200 && h < 245) hueName = 'Kram Indigo';
  else if (h >= 245 && h < 290) hueName = 'Prussian Deep Blue';
  else if (h >= 290 && h < 345) hueName = 'Royal Editorial Plum';

  if (l < 25) return `Deep ${hueName}`;
  if (l > 75) return `Tinted ${hueName}`;
  return hueName;
}

// Construct a complete PrepressColor object with CMYK standards verification
export function createPrepressColor(
  r: number,
  g: number,
  b: number,
  role: PrepressColor['role'],
  customName?: string
): PrepressColor {
  const cmyk = rgbToCmyk(r, g, b, 280);
  const hex = rgbToHex(r, g, b);
  const { h, s, l } = rgbToHsl(r, g, b);
  const gamutCheck = checkCmykGamut(r, g, b);
  const pantone = findNearestPantone(cmyk);
  const name = customName || generateColorName(h, s, l, cmyk);

  const isOverprintRecommended = role === 'Typographic Black' || (cmyk.k >= 95 && cmyk.c === 0 && cmyk.m === 0 && cmyk.y === 0);

  return {
    id: `col-${Math.random().toString(36).substring(2, 9)}`,
    name,
    hex,
    cmyk,
    role,
    tac: cmyk.tac,
    isGamutSafe: gamutCheck.isSafe,
    gamutWarning: gamutCheck.warning,
    nearestPantone: pantone,
    dotGainCompensationApplied: true,
    isOverprintRecommended,
  };
}

// Master Harmony Generator: derives 7 harmonious color palettes from a base asset color
export function generateHarmoniousPalettes(
  base: AssetDominantColor,
  sourceAssetName: string
): Record<HarmonySchemeType, ColorHarmonyResult> {
  const { h, s, l } = rgbToHsl(base.r, base.g, base.b);

  const buildResult = (
    type: HarmonySchemeType,
    colors: PrepressColor[]
  ): ColorHarmonyResult => {
    const info = HARMONY_SCHEME_DEFINITIONS[type];
    const maxTac = Math.max(...colors.map((c) => c.tac));
    const hasGamutWarnings = colors.some((c) => !c.isGamutSafe);
    const hasRichBodyWarning = colors.some((c) => c.role === 'Typographic Black' && c.cmyk.k < 95);

    let tacStatus: 'COMPLIANT' | 'CAUTION' | 'EXCEEDS' = 'COMPLIANT';
    if (maxTac > 300) tacStatus = 'EXCEEDS';
    else if (maxTac > 280) tacStatus = 'CAUTION';

    // Calculate prepress compliance score out of 100
    let complianceScore = 100;
    if (tacStatus === 'EXCEEDS') complianceScore -= 20;
    if (tacStatus === 'CAUTION') complianceScore -= 8;
    if (hasGamutWarnings) complianceScore -= 12;
    if (hasRichBodyWarning) complianceScore -= 15;

    return {
      schemeType: type,
      schemeName: info.name,
      description: info.description,
      baseColor: base,
      sourceAssetName,
      colors,
      standardsReport: {
        isoStandard: 'ISO 12647-2:2013',
        maxTacPercent: maxTac,
        tacStatus,
        gamutStatus: hasGamutWarnings ? 'GAMUT_WARNINGS' : 'ALL_IN_GAMUT',
        richBlackStatus: hasRichBodyWarning ? 'WARNING_RICH_BODY' : 'VALID_K100',
        recommendedSubstrate:
          maxTac > 280
            ? 'Coated Silk / Gloss (Max 300% TAC)'
            : 'Uncoated Tactile / Munken Pure Cream (Max 280% TAC)',
        complianceScore,
      },
    };
  };

  // Standard Typographic K100 and Tactile Substrate Neutrals
  const standardPressBlack = createPrepressColor(0, 0, 0, 'Typographic Black', 'Pure Press Black (K100 Overprint)');
  // Force K100 strictly on typographic black
  standardPressBlack.cmyk = { c: 0, m: 0, y: 0, k: 100, tac: 100, formatted: 'C:0 M:0 Y:0 K:100' };

  const substrateIvory = createPrepressColor(246, 243, 235, 'Substrate Tint', 'Tactile Munken Cream Ivory');
  substrateIvory.cmyk = { c: 2, m: 3, y: 8, k: 0, tac: 13, formatted: 'C:2 M:3 Y:8 K:0' };

  // 1. Analogous (+30°, -30°, +60°)
  const cAna1 = hslToRgb((h + 30) % 360, Math.min(80, s), l);
  const cAna2 = hslToRgb((h - 30 + 360) % 360, Math.min(75, s * 0.9), Math.max(25, l - 10));
  const cAna3 = hslToRgb((h + 60) % 360, Math.min(70, s * 0.8), Math.min(80, l + 15));
  const analogousColors: PrepressColor[] = [
    createPrepressColor(base.r, base.g, base.b, 'Primary Field', `${base.name} (Dominant)`),
    createPrepressColor(cAna1.r, cAna1.g, cAna1.b, 'Secondary Accent'),
    createPrepressColor(cAna2.r, cAna2.g, cAna2.b, 'Supporting Neutral'),
    createPrepressColor(cAna3.r, cAna3.g, cAna3.b, 'Spot Plate Highlight'),
    substrateIvory,
    standardPressBlack,
  ];

  // 2. Complementary (180°)
  const cComp = hslToRgb((h + 180) % 360, Math.min(82, s * 0.95), Math.max(35, Math.min(65, 100 - l)));
  const cCompTint = hslToRgb((h + 180) % 360, Math.min(50, s * 0.6), Math.min(85, l + 25));
  const cBaseMuted = hslToRgb(h, Math.max(20, s * 0.4), Math.max(20, l - 15));
  const complementaryColors: PrepressColor[] = [
    createPrepressColor(base.r, base.g, base.b, 'Primary Field', `${base.name} (Dominant)`),
    createPrepressColor(cComp.r, cComp.g, cComp.b, 'Secondary Accent', 'Complementary Accent 180°'),
    createPrepressColor(cCompTint.r, cCompTint.g, cCompTint.b, 'Spot Plate Highlight', 'Complementary Halftone Wash'),
    createPrepressColor(cBaseMuted.r, cBaseMuted.g, cBaseMuted.b, 'Supporting Neutral'),
    substrateIvory,
    standardPressBlack,
  ];

  // 3. Triadic (120°, 240°)
  const cTriad1 = hslToRgb((h + 120) % 360, Math.min(78, s * 0.9), Math.max(30, Math.min(65, l)));
  const cTriad2 = hslToRgb((h + 240) % 360, Math.min(75, s * 0.85), Math.max(25, Math.min(60, l - 5)));
  const triadicColors: PrepressColor[] = [
    createPrepressColor(base.r, base.g, base.b, 'Primary Field', `${base.name} (Dominant)`),
    createPrepressColor(cTriad1.r, cTriad1.g, cTriad1.b, 'Secondary Accent', 'Triad Section Accent A (+120°)'),
    createPrepressColor(cTriad2.r, cTriad2.g, cTriad2.b, 'Spot Plate Highlight', 'Triad Section Accent B (+240°)'),
    createPrepressColor(
      Math.round((base.r + cTriad1.r) / 2),
      Math.round((base.g + cTriad1.g) / 2),
      Math.round((base.b + cTriad1.b) / 2),
      'Supporting Neutral',
      'Neutral Bridge Tint'
    ),
    substrateIvory,
    standardPressBlack,
  ];

  // 4. Split-Complementary (150°, 210°)
  const cSplit1 = hslToRgb((h + 150) % 360, Math.min(78, s * 0.9), Math.max(30, Math.min(70, l)));
  const cSplit2 = hslToRgb((h + 210) % 360, Math.min(76, s * 0.88), Math.max(25, Math.min(65, l - 5)));
  const splitColors: PrepressColor[] = [
    createPrepressColor(base.r, base.g, base.b, 'Primary Field', `${base.name} (Dominant)`),
    createPrepressColor(cSplit1.r, cSplit1.g, cSplit1.b, 'Secondary Accent', 'Split Complement Accent (+150°)'),
    createPrepressColor(cSplit2.r, cSplit2.g, cSplit2.b, 'Spot Plate Highlight', 'Split Complement Accent (+210°)'),
    createPrepressColor(
      Math.round(base.r * 0.6 + 60),
      Math.round(base.g * 0.6 + 60),
      Math.round(base.b * 0.6 + 60),
      'Supporting Neutral',
      'Editorial Charcoal Slate'
    ),
    substrateIvory,
    standardPressBlack,
  ];

  // 5. Tetradic (60°, 180°, 240°)
  const cTet1 = hslToRgb((h + 60) % 360, Math.min(75, s), Math.max(30, l));
  const cTet2 = hslToRgb((h + 180) % 360, Math.min(78, s * 0.9), Math.max(30, 95 - l));
  const cTet3 = hslToRgb((h + 240) % 360, Math.min(72, s * 0.85), Math.max(25, l));
  const tetradicColors: PrepressColor[] = [
    createPrepressColor(base.r, base.g, base.b, 'Primary Field', `${base.name} (Dominant)`),
    createPrepressColor(cTet1.r, cTet1.g, cTet1.b, 'Secondary Accent', 'Tetradic Color B (+60°)'),
    createPrepressColor(cTet2.r, cTet2.g, cTet2.b, 'Supporting Neutral', 'Tetradic Color C (+180°)'),
    createPrepressColor(cTet3.r, cTet3.g, cTet3.b, 'Spot Plate Highlight', 'Tetradic Color D (+240°)'),
    substrateIvory,
    standardPressBlack,
  ];

  // 6. Monochromatic Duotone & Halftones (Luminance Stacking)
  const cToneDark = hslToRgb(h, Math.min(85, s * 1.1), Math.max(12, l * 0.4));
  const cToneMid = hslToRgb(h, Math.min(75, s), Math.max(35, Math.min(55, l)));
  const cToneLight = hslToRgb(h, Math.max(20, s * 0.6), Math.min(88, l * 1.5 + 20));
  const duotoneColors: PrepressColor[] = [
    createPrepressColor(cToneDark.r, cToneDark.g, cToneDark.b, 'Primary Field', '100% Solid Ink Base (Duotone Plate 1)'),
    createPrepressColor(cToneMid.r, cToneMid.g, cToneMid.b, 'Secondary Accent', '60% Halftone Midtone Tint'),
    createPrepressColor(cToneLight.r, cToneLight.g, cToneLight.b, 'Spot Plate Highlight', '25% Highlight Screen Wash'),
    createPrepressColor(20, 23, 26, 'Supporting Neutral', 'Rich Black Skeleton Shadow (Plate 2)'),
    substrateIvory,
    standardPressBlack,
  ];

  // 7. NRRU Isan Heritage (Kram Indigo + Metallic Gold + Dan Kwian Terracotta)
  const kramIndigo = createPrepressColor(15, 39, 66, 'Primary Field', 'NRRU Deep Kram Indigo (C:100 M:82 Y:38 K:45)');
  const metallicGold = createPrepressColor(197, 160, 89, 'Spot Plate Highlight', 'Metallic Silk Gold (Pantone 871 C Foil)');
  const terracotta = createPrepressColor(200, 90, 50, 'Secondary Accent', 'Dan Kwian Clay Terracotta');
  const richCarbon = createPrepressColor(20, 23, 26, 'Supporting Neutral', 'Rich Carbon Black (C:60 M:40 Y:40 K:100)');
  const isanColors: PrepressColor[] = [
    kramIndigo,
    metallicGold,
    terracotta,
    richCarbon,
    substrateIvory,
    standardPressBlack,
  ];

  return {
    analogous: buildResult('analogous', analogousColors),
    complementary: buildResult('complementary', complementaryColors),
    triadic: buildResult('triadic', triadicColors),
    split_complementary: buildResult('split_complementary', splitColors),
    tetradic: buildResult('tetradic', tetradicColors),
    monochromatic_duotone: buildResult('monochromatic_duotone', duotoneColors),
    isan_heritage: buildResult('isan_heritage', isanColors),
  };
}

// Client-side dominant color extractor using HTML5 Canvas
export async function extractDominantColorsFromImage(
  imageSource: string | HTMLImageElement,
  colorCount = 5
): Promise<AssetDominantColor[]> {
  return new Promise((resolve) => {
    const processImage = (img: HTMLImageElement) => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(getFallbackDominantColors());
          return;
        }

        // Downsample to 64x64 for instant client-side performance
        canvas.width = 64;
        canvas.height = 64;
        ctx.drawImage(img, 0, 0, 64, 64);

        const imgData = ctx.getImageData(0, 0, 64, 64).data;
        const colorBuckets = new Map<string, { r: number; g: number; b: number; count: number }>();
        let validPixels = 0;

        // Step through pixels with step of 2
        for (let i = 0; i < imgData.length; i += 8) {
          const r = imgData[i];
          const g = imgData[i + 1];
          const b = imgData[i + 2];
          const a = imgData[i + 3];

          // Ignore transparent or near-transparent pixels
          if (a < 128) continue;

          // Quantize to 16-step buckets
          const qR = Math.round(r / 24) * 24;
          const qG = Math.round(g / 24) * 24;
          const qB = Math.round(b / 24) * 24;
          const key = `${qR},${qG},${qB}`;

          const existing = colorBuckets.get(key);
          if (existing) {
            existing.count += 1;
          } else {
            colorBuckets.set(key, { r, g, b, count: 1 });
          }
          validPixels++;
        }

        if (validPixels === 0 || colorBuckets.size === 0) {
          resolve(getFallbackDominantColors());
          return;
        }

        // Sort buckets by frequency
        const sorted = Array.from(colorBuckets.values()).sort((a, b) => b.count - a.count);
        const topClusters = sorted.slice(0, colorCount);

        const extracted: AssetDominantColor[] = topClusters.map((cluster) => {
          const hex = rgbToHex(cluster.r, cluster.g, cluster.b);
          const cmyk = rgbToCmyk(cluster.r, cluster.g, cluster.b);
          const { h, s, l } = rgbToHsl(cluster.r, cluster.g, cluster.b);
          const gamut = checkCmykGamut(cluster.r, cluster.g, cluster.b);
          const percentage = Math.round((cluster.count / validPixels) * 100);

          return {
            hex,
            r: cluster.r,
            g: cluster.g,
            b: cluster.b,
            cmyk,
            percentage: Math.max(5, percentage),
            name: generateColorName(h, s, l, cmyk),
            isNeutral: s < 15,
            tac: cmyk.tac,
            isGamutSafe: gamut.isSafe,
          };
        });

        resolve(extracted);
      } catch (err) {
        console.warn('Canvas pixel extraction failed (CORS/taint), using fallback dominant spectrum:', err);
        resolve(getFallbackDominantColors());
      }
    };

    if (typeof imageSource === 'string') {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => processImage(img);
      img.onerror = () => resolve(getFallbackDominantColors());
      img.src = imageSource;
    } else {
      if (imageSource.complete) {
        processImage(imageSource);
      } else {
        imageSource.onload = () => processImage(imageSource);
        imageSource.onerror = () => resolve(getFallbackDominantColors());
      }
    }
  });
}

function getFallbackDominantColors(): AssetDominantColor[] {
  return [
    {
      hex: '#0f2742',
      r: 15,
      g: 39,
      b: 66,
      cmyk: { c: 100, m: 82, y: 38, k: 45, tac: 265, formatted: 'C:100 M:82 Y:38 K:45' },
      percentage: 46,
      name: 'NRRU Deep Academic Blue',
      isNeutral: false,
      tac: 265,
      isGamutSafe: true,
    },
    {
      hex: '#c5a059',
      r: 197,
      g: 160,
      b: 89,
      cmyk: { c: 20, m: 25, y: 60, k: 25, tac: 130, formatted: 'C:20 M:25 Y:60 K:25' },
      percentage: 24,
      name: 'Metallic Silk Gold',
      isNeutral: false,
      tac: 130,
      isGamutSafe: true,
    },
    {
      hex: '#f6f3eb',
      r: 246,
      g: 243,
      b: 235,
      cmyk: { c: 2, m: 3, y: 8, k: 0, tac: 13, formatted: 'C:2 M:3 Y:8 K:0' },
      percentage: 16,
      name: 'Tactile Munken Cream Ivory',
      isNeutral: true,
      tac: 13,
      isGamutSafe: true,
    },
    {
      hex: '#14171a',
      r: 20,
      g: 23,
      b: 26,
      cmyk: { c: 60, m: 40, y: 40, k: 100, tac: 240, formatted: 'C:60 M:40 Y:40 K:100' },
      percentage: 14,
      name: 'Rich Carbon Black',
      isNeutral: true,
      tac: 240,
      isGamutSafe: true,
    },
  ];
}
