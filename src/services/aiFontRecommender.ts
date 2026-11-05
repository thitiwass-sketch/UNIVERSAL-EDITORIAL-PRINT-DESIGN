import { AiFontPairingRecommendation, AiFontRecommendationRequest } from '../types/typographyPreview';

// High-craft curated fallback formulations tuned to editorial moods
const CURATED_MOOD_FORMULATIONS: Record<string, AiFontPairingRecommendation[]> = {
  archival: [
    {
      id: 'ai-archival-monograph',
      pairingName: 'Monastic Archival & Renaissance Dignity',
      moodTag: 'Scholarly & Archival',
      headlineFont: 'EB Garamond',
      bodyFont: 'Newsreader',
      thaiFont: 'Sarabun',
      recommendedBodyPt: 10,
      recommendedLeadingPt: 14.5,
      recommendedThaiCompensationPt: 2.5,
      recommendedColumnMm: 85,
      rationale: 'EB Garamond introduces classical humanist authority in titling, while Newsreader delivers contemporary optical sizing with deep ink traps designed for long-form intellectual reading on uncoated papers.',
      typographicVoice: 'Solemn, archival, deeply grounded, timeless academic rigor.',
      printViabilityScore: 97,
      designStyleCategory: 'Academic Monograph',
      keyTraits: ['High Legibility', 'Optical Sizing', 'Low Eye-Fatigue', 'FOGRA39 Verified'],
    },
    {
      id: 'ai-archival-spec',
      pairingName: 'Historical Monograph & Engineered Annotation',
      moodTag: 'Historiographical',
      headlineFont: 'Newsreader',
      bodyFont: 'Source Serif 4',
      thaiFont: 'Pridi',
      recommendedBodyPt: 9.5,
      recommendedLeadingPt: 14,
      recommendedThaiCompensationPt: 2.5,
      recommendedColumnMm: 80,
      rationale: 'Source Serif 4 provides sturdy brackets and open apertures that resist ink spread, paired with Pridi’s dignified looped Thai letterforms.',
      typographicVoice: 'Methodical, archival, documentary warmth.',
      printViabilityScore: 95,
      designStyleCategory: 'Historical Document',
      keyTraits: ['Sturdy Brackets', 'Open Counters', 'Bilingual Harmony'],
    },
  ],
  modern: [
    {
      id: 'ai-swiss-modernist',
      pairingName: 'International Typographic Style (Swiss)',
      moodTag: 'Modernist & Objective',
      headlineFont: 'Plus Jakarta Sans',
      bodyFont: 'Inter',
      thaiFont: 'Prompt',
      recommendedBodyPt: 9.5,
      recommendedLeadingPt: 14,
      recommendedThaiCompensationPt: 2.0,
      recommendedColumnMm: 75,
      rationale: 'Asymmetric grid discipline with objective, unadorned grotesque letterforms. High x-heights ensure razor-sharp rendering on coated silk and newsprint alike.',
      typographicVoice: 'Objective, rational, architectural, unembellished truth.',
      printViabilityScore: 98,
      designStyleCategory: 'Swiss Modernist',
      keyTraits: ['High x-Height', 'Geometric Rhythm', 'Crisp Ink Terminals'],
    },
    {
      id: 'ai-contemporary-contrast',
      pairingName: 'Dynamic Neo-Grotesque & Precision Slab',
      moodTag: 'Avant-Garde Architectural',
      headlineFont: 'Plus Jakarta Sans',
      bodyFont: 'IBM Plex Serif',
      thaiFont: 'IBM Plex Sans Thai',
      recommendedBodyPt: 10,
      recommendedLeadingPt: 14.5,
      recommendedThaiCompensationPt: 2.5,
      recommendedColumnMm: 85,
      rationale: 'Sharp geometric sans headline creates a high-tension dialogue with IBM Plex Serif’s industrial stroke discipline and square terminals.',
      typographicVoice: 'Decisive, structural, sophisticated editorial tension.',
      printViabilityScore: 94,
      designStyleCategory: 'Contemporary Editorial',
      keyTraits: ['Industrial Serifs', 'High Dynamic Range', 'Technical Precision'],
    },
  ],
  literary: [
    {
      id: 'ai-literary-lyrical',
      pairingName: 'Continental Literary Fiction & Humanist Grace',
      moodTag: 'Poetic & Introspective',
      headlineFont: 'EB Garamond',
      bodyFont: 'Newsreader',
      thaiFont: 'Sarabun',
      recommendedBodyPt: 10.5,
      recommendedLeadingPt: 15.5,
      recommendedThaiCompensationPt: 2.5,
      recommendedColumnMm: 90,
      rationale: 'Generous leading ratio (148%) creates an elegant typographic grey tone across continuous pages, evoking French and Venetian literary editions.',
      typographicVoice: 'Intimate, contemplative, velvety page cadence.',
      printViabilityScore: 96,
      designStyleCategory: 'Literary & Fiction',
      keyTraits: ['Velvety Grey Tone', 'Generous Leading', 'Classic Proportion'],
    },
  ],
  cultural: [
    {
      id: 'ai-thai-cultural-harmony',
      pairingName: 'Siamese Heritage & Royal Typography',
      moodTag: 'Thai Cultural Heritage',
      headlineFont: 'Source Serif 4',
      bodyFont: 'Pridi',
      thaiFont: 'Sarabun',
      recommendedBodyPt: 10,
      recommendedLeadingPt: 15,
      recommendedThaiCompensationPt: 3.0,
      recommendedColumnMm: 82,
      rationale: 'Pridi and Sarabun honor authentic Thai looping morphology with calibrated 3-tier tone mark clearance, matched with Source Serif 4’s grounded Latin companion glyphs.',
      typographicVoice: 'Noble, culturally authentic, ceremonious and dignified.',
      printViabilityScore: 97,
      designStyleCategory: 'Regional & Cultural',
      keyTraits: ['3-Tier Tone Clearance', 'Loop Integrity', 'Bilingual Balance'],
    },
  ],
};

export async function fetchAiFontRecommendations(
  params: AiFontRecommendationRequest
): Promise<AiFontPairingRecommendation[]> {
  try {
    const response = await fetch('/api/typography/ai-recommend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success && Array.isArray(result.recommendations) && result.recommendations.length > 0) {
        return result.recommendations;
      }
    }
  } catch (err) {
    console.warn('AI font recommendation network fetch failed, using curatorial engine fallback:', err);
  }

  // Fallback heuristic based on theme keywords
  const query = (params.themeOrMood || params.projectType || '').toLowerCase();
  
  if (query.includes('swiss') || query.includes('modern') || query.includes('minimal') || query.includes('brutalis') || query.includes('tech') || query.includes('architect')) {
    return [...CURATED_MOOD_FORMULATIONS.modern, ...CURATED_MOOD_FORMULATIONS.archival];
  } else if (query.includes('thai') || query.includes('heritage') || query.includes('culture') || query.includes('royal') || query.includes('asian')) {
    return [...CURATED_MOOD_FORMULATIONS.cultural, ...CURATED_MOOD_FORMULATIONS.archival];
  } else if (query.includes('literary') || query.includes('poet') || query.includes('fiction') || query.includes('essay') || query.includes('novel')) {
    return [...CURATED_MOOD_FORMULATIONS.literary, ...CURATED_MOOD_FORMULATIONS.archival];
  } else {
    // Return diverse mix
    return [
      CURATED_MOOD_FORMULATIONS.archival[0],
      CURATED_MOOD_FORMULATIONS.modern[0],
      CURATED_MOOD_FORMULATIONS.literary[0],
      CURATED_MOOD_FORMULATIONS.cultural[0],
    ];
  }
}
