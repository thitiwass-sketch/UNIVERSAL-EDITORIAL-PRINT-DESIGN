import { FontOption, TypographyAuditResult } from '../types/typographyPreview';

interface AuditParams {
  bodyFont: FontOption;
  bodyPt: number;
  leadingPt: number;
  thaiCompensationPt: number;
  columnWidthMm: number;
  columnsCount: number;
  baselineGridPt: number;
  paperType: 'munken' | 'silk' | 'craft' | 'white';
  isReverseType: boolean;
}

export function auditTypographyViability(params: AuditParams): TypographyAuditResult {
  const {
    bodyFont,
    bodyPt,
    leadingPt,
    thaiCompensationPt,
    columnWidthMm,
    baselineGridPt,
    paperType,
    isReverseType,
  } = params;

  // 1. Estimate Characters Per Line (CPL)
  // 1 mm = ~2.83465 pt. Average glyph advance is approximately 0.50 - 0.54 * bodyPt depending on font category.
  const advanceMultiplier = bodyFont.category === 'mono' ? 0.60 : bodyFont.category === 'serif' ? 0.50 : 0.53;
  const columnWidthPt = columnWidthMm * 2.83465;
  const estimatedCpl = Math.round(columnWidthPt / (bodyPt * advanceMultiplier));

  let cplStatus: 'optimal' | 'narrow' | 'wide' = 'optimal';
  if (estimatedCpl < 42) {
    cplStatus = 'narrow';
  } else if (estimatedCpl > 75) {
    cplStatus = 'wide';
  }

  // 2. Leading Ratio
  const leadingRatio = Math.round((leadingPt / bodyPt) * 100);
  let leadingStatus: 'optimal' | 'tight' | 'loose' = 'optimal';
  if (leadingRatio < 125) {
    leadingStatus = 'tight';
  } else if (leadingRatio > 168) {
    leadingStatus = 'loose';
  }

  // 3. Point Size Viability for Print Presswork
  let pointSizeStatus: 'pass' | 'warning' | 'fail' = 'pass';
  let pointSizeMessage = `At ${bodyPt}pt, font size is within standard editorial reading range (8.5–11pt).`;

  if (bodyPt < bodyFont.recommendedMinPt) {
    if (bodyPt < 7.5) {
      pointSizeStatus = 'fail';
      pointSizeMessage = `CRITICAL: ${bodyPt}pt is below minimum press threshold (${bodyFont.recommendedMinPt}pt). Micro-counters risk ink plugging.`;
    } else {
      pointSizeStatus = 'warning';
      pointSizeMessage = `CAUTION: ${bodyPt}pt is slightly below recommended minimum (${bodyFont.recommendedMinPt}pt) for ${bodyFont.name} on sheetfed press.`;
    }
  } else if (bodyPt > 13) {
    pointSizeStatus = 'warning';
    pointSizeMessage = `${bodyPt}pt is unusually large for continuous body text, suitable primarily for abstracts or children’s editions.`;
  }

  // 4. Dot Gain Vulnerability based on Paper Substrate
  const dotGainBasePercent =
    paperType === 'munken' ? 18 : paperType === 'craft' ? 22 : paperType === 'silk' ? 12 : 14;
  let dotGainStatus: 'low' | 'moderate' | 'high' = 'low';
  let dotGainMsg = `Low dot gain risk (${dotGainBasePercent}% expected on ${paperType.toUpperCase()} stock). Sturdy stroke terminals.`;

  if (paperType === 'munken' || paperType === 'craft') {
    if (bodyFont.category === 'serif' && bodyFont.xHeightRatio === 'low') {
      dotGainStatus = 'high';
      dotGainMsg = `High dot gain risk (${dotGainBasePercent}% ink spread). Delicate serifs may thicken and counters in 'e', 'a', 's' could fill.`;
    } else if (bodyPt <= 8.5) {
      dotGainStatus = 'moderate';
      dotGainMsg = `Moderate dot gain (${dotGainBasePercent}% spread). Porous paper fibers will slightly swell letterforms.`;
    }
  }

  // 5. Thai Orthography & 3-Tier Tone Mark Clearance
  const effectiveThaiLeading = leadingPt + thaiCompensationPt;
  let thaiClearanceStatus: 'safe' | 'caution' | 'collision_risk' = 'safe';
  let thaiClearanceMsg = `Effective leading of ${effectiveThaiLeading}pt (+${thaiCompensationPt}pt comp) provides excellent clearance for 3-tier Thai tone marks.`;

  if (effectiveThaiLeading < 12.5) {
    thaiClearanceStatus = 'collision_risk';
    thaiClearanceMsg = `Collision hazard! Effective leading of ${effectiveThaiLeading}pt will cause upper tone marks (ไม้เอก, ไม้โท) to intersect with descenders (ป, ฝ, ฟ).`;
  } else if (effectiveThaiLeading < 14.0) {
    thaiClearanceStatus = 'caution';
    thaiClearanceMsg = `Tight clearance (${effectiveThaiLeading}pt). Recommend increasing Thai leading compensation to at least +2.0pt.`;
  }

  // 6. Baseline Grid Snap Status
  const remainder = leadingPt % baselineGridPt;
  const deviationPt = Math.min(remainder, baselineGridPt - remainder);
  const isSnapping = deviationPt < 0.25;
  const nearestMultiple = Math.round(leadingPt / baselineGridPt) * baselineGridPt;

  // 7. Reverse / Knockout Type Viability
  let reverseStatus: 'safe' | 'caution' | 'perilous' = 'safe';
  let reverseMsg = 'Standard positive print (dark ink on light paper). No stroke fill-in danger.';

  if (isReverseType) {
    if (bodyPt < 8.5 || (bodyFont.category === 'serif' && bodyPt < 9.5)) {
      reverseStatus = 'perilous';
      reverseMsg = `Reverse type hazard: Printing ${bodyPt}pt white text on dark background on ${paperType} stock risks ink bleeding inward and choking fine glyph strokes.`;
    } else if (bodyPt < 10) {
      reverseStatus = 'caution';
      reverseMsg = 'Caution on reverse type: Ensure ink trapping and minimum 0.25pt hairline thickness.';
    } else {
      reverseStatus = 'safe';
      reverseMsg = `Safe: ${bodyPt}pt provides adequate counter volume to resist reverse ink choke.`;
    }
  }

  // 8. Overall Readability Score (0 - 100)
  let score = 100;
  if (cplStatus !== 'optimal') score -= 14;
  if (leadingStatus !== 'optimal') score -= 16;
  if (pointSizeStatus === 'warning') score -= 12;
  if (pointSizeStatus === 'fail') score -= 30;
  if (dotGainStatus === 'high') score -= 10;
  if (thaiClearanceStatus === 'collision_risk') score -= 18;
  if (thaiClearanceStatus === 'caution') score -= 8;
  if (reverseStatus === 'perilous') score -= 15;
  if (!isSnapping) score -= 6;

  score = Math.max(25, Math.min(100, score));

  // Editorial Critiques
  const critiques: string[] = [];
  if (cplStatus === 'narrow') {
    critiques.push(`Column measure (${columnWidthMm}mm / ~${estimatedCpl} CPL) is too narrow. Increase column width to reach 50–70 characters for fluid reading.`);
  } else if (cplStatus === 'wide') {
    critiques.push(`Line length (~${estimatedCpl} CPL) exceeds optimal reading comfort. Readers may lose their place during carriage return sweep.`);
  }

  if (leadingStatus === 'tight') {
    critiques.push(`Leading ratio (${leadingRatio}%) is cramped. Increase line height from ${leadingPt}pt to ${Math.round(bodyPt * 1.4)}pt.`);
  } else if (leadingStatus === 'loose') {
    critiques.push(`Leading ratio (${leadingRatio}%) is loose. Text lines appear disjointed rather than forming a coherent typographic grey block.`);
  }

  if (thaiClearanceStatus === 'collision_risk') {
    critiques.push('Thai tone marks will collide across vertical lines. Enforce Thai leading compensation (+2.5pt).');
  }

  if (!isSnapping) {
    critiques.push(`Leading (${leadingPt}pt) does not align with the ${baselineGridPt}pt project baseline grid (nearest: ${nearestMultiple}pt).`);
  }

  return {
    charactersPerLine: estimatedCpl,
    cplStatus,
    leadingRatio,
    leadingStatus,
    pointSizeViability: {
      status: pointSizeStatus,
      message: pointSizeMessage,
    },
    dotGainVulnerability: {
      status: dotGainStatus,
      simulationSpreadPercent: dotGainBasePercent,
      message: dotGainMsg,
    },
    thaiOrthographyClearance: {
      status: thaiClearanceStatus,
      effectiveLeadingPt: effectiveThaiLeading,
      message: thaiClearanceMsg,
    },
    baselineGridStatus: {
      isSnapping,
      nearestGridMultiplePt: nearestMultiple,
      deviationPt: Math.round(deviationPt * 10) / 10,
    },
    reverseTypeViability: {
      status: reverseStatus,
      message: reverseMsg,
    },
    readabilityScore: score,
    editorialCritiques: critiques,
  };
}
