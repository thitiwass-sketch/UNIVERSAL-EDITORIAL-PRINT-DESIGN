import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Wand2,
  Check,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  RefreshCw,
  Sliders,
  Type,
  Layers,
  Info,
} from 'lucide-react';
import { ActiveProjectState } from '../types/os';
import { AiFontPairingRecommendation } from '../types/typographyPreview';
import { fetchAiFontRecommendations } from '../services/aiFontRecommender';
import { AVAILABLE_FONTS } from '../data/typographyPresets';

interface AiFontRecommenderPanelProps {
  project: ActiveProjectState;
  activeHeadlineFont: string;
  activeBodyFont: string;
  onSelectPairing: (pairing: {
    headlineFont: string;
    bodyFont: string;
    thaiFont: string;
    bodyPt: number;
    leadingPt: number;
    thaiCompensationPt: number;
    columnWidthMm: number;
    pairingName: string;
  }) => void;
}

const QUICK_MOOD_SUGGESTIONS = [
  { label: 'Scholarly & Archival', query: 'Scholarly archival monograph with monastic authority and deep reading comfort' },
  { label: 'Swiss Modernist', query: 'Swiss modernist minimalism with objective grotesque precision and asymmetric grid discipline' },
  { label: 'Literary & Contemplative', query: 'Lyrical literary fiction with generous leading, warm paper cadence, and delicate serifs' },
  { label: 'Avant-Garde Architectural', query: 'Avant-garde architectural journal with high typographic contrast and structural tension' },
  { label: 'Thai Cultural Heritage', query: 'Authentic Thai cultural monograph with dignified looping morphology and royal prestige' },
  { label: 'Technical Specification', query: 'High-density technical specification with tabular clarity and precision monospace notes' },
  { label: 'Contemporary Editorial', query: 'Contemporary cultural review with punchy display titling and fluid reading rhythm' },
];

export const AiFontRecommenderPanel: React.FC<AiFontRecommenderPanelProps> = ({
  project,
  activeHeadlineFont,
  activeBodyFont,
  onSelectPairing,
}) => {
  const [themeOrMood, setThemeOrMood] = useState<string>(
    `${project.projectType} — Editorial publication with ${project.specs.paperStock.name} stock`
  );
  const [recommendations, setRecommendations] = useState<AiFontPairingRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [appliedPairingId, setAppliedPairingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Generate recommendations
  const handleGenerate = async (customQuery?: string) => {
    const queryToUse = customQuery || themeOrMood;
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const results = await fetchAiFontRecommendations({
        themeOrMood: queryToUse,
        projectTitle: project.title,
        projectType: project.projectType,
        targetMedia: project.media || project.specs?.mediaClass || 'Print / Editorial',
        paperStock: project.specs.paperStock.name,
        currentBodyPt: project.typography.bodyPt,
      });

      if (results && results.length > 0) {
        setRecommendations(results);
      } else {
        setErrorMsg('No recommendations returned. Please try another mood prompt.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error communicating with AI recommendation engine.');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial recommendation generation on mount
  useEffect(() => {
    handleGenerate();
  }, []);

  const handleApply = (rec: AiFontPairingRecommendation) => {
    setAppliedPairingId(rec.id);
    onSelectPairing({
      headlineFont: rec.headlineFont,
      bodyFont: rec.bodyFont,
      thaiFont: rec.thaiFont,
      bodyPt: rec.recommendedBodyPt,
      leadingPt: rec.recommendedLeadingPt,
      thaiCompensationPt: rec.recommendedThaiCompensationPt,
      columnWidthMm: rec.recommendedColumnMm,
      pairingName: rec.pairingName,
    });
  };

  return (
    <div className="space-y-4">
      {/* AI Recommender Header & Prompt Bar */}
      <div className="bg-[#0b1017] border border-slate-800 rounded-xl p-4 space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500/20 to-sky-500/20 border border-amber-500/40 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <span>AI-Powered Font Pairing Recommender</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800 font-sans">
                  Gemini Flash 3.8
                </span>
              </h3>
              <p className="text-[10px] text-slate-400 font-sans">
                Curates harmonious headline, body, and Thai companion typefaces calibrated to your editorial theme and paper stock.
              </p>
            </div>
          </div>

          <div className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
            Project: <strong className="text-slate-200">{project.title}</strong> ({project.specs.paperStock.weightGsm} GSM)
          </div>
        </div>

        {/* Input Prompt Field */}
        <div className="space-y-1.5">
          <label className="text-[10px] text-slate-400 flex items-center justify-between font-mono">
            <span>EDITORIAL THEME, MOOD &amp; INTENT:</span>
            <span className="text-slate-500">Natural Language Typographic Prompt</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={themeOrMood}
              onChange={(e) => setThemeOrMood(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleGenerate();
              }}
              placeholder="e.g. Scholarly monograph with monastic authority, quiet literary contemplation on uncoated paper..."
              className="flex-1 bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none transition-colors"
            />
            <button
              id="btn-generate-ai-font-pairings"
              onClick={() => handleGenerate()}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/10 transition-all shrink-0 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Recommend Pairings</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Mood Chips */}
        <div className="space-y-1">
          <div className="text-[9px] uppercase tracking-wider text-slate-500 font-mono">
            Suggested Editorial Mood Archetypes:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_MOOD_SUGGESTIONS.map((sug) => (
              <button
                key={sug.label}
                onClick={() => {
                  setThemeOrMood(sug.query);
                  handleGenerate(sug.query);
                }}
                className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 hover:border-amber-500/60 hover:text-amber-300 text-slate-400 text-[10px] transition-colors"
              >
                {sug.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 text-xs">
          {errorMsg}
        </div>
      )}

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec, index) => {
          const isApplied =
            appliedPairingId === rec.id ||
            (activeHeadlineFont.includes(rec.headlineFont) && activeBodyFont.includes(rec.bodyFont));

          // Find font families for accurate specimen preview
          const headlineOpt =
            AVAILABLE_FONTS.find((f) => f.name === rec.headlineFont) || AVAILABLE_FONTS[0];
          const bodyOpt =
            AVAILABLE_FONTS.find((f) => f.name === rec.bodyFont) || AVAILABLE_FONTS[0];
          const thaiOpt =
            AVAILABLE_FONTS.find((f) => f.name === rec.thaiFont) || AVAILABLE_FONTS[7];

          return (
            <div
              key={rec.id || index}
              className={`rounded-xl border p-4 flex flex-col justify-between transition-all duration-200 ${
                isApplied
                  ? 'bg-amber-950/20 border-amber-500 ring-1 ring-amber-500/40 shadow-xl shadow-amber-950/30'
                  : 'bg-[#0b1017] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800/80">
                        {rec.moodTag || rec.designStyleCategory}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {rec.designStyleCategory}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-100 mt-1 leading-snug">
                      {rec.pairingName}
                    </h4>
                  </div>

                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/80 font-mono font-bold shrink-0">
                    {rec.printViabilityScore || 95}/100 Prepress
                  </span>
                </div>

                {/* Font Triad Badges */}
                <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono bg-slate-950/80 p-2 rounded-lg border border-slate-800">
                  <div>
                    <span className="text-slate-500 block text-[8.5px] uppercase">Headline</span>
                    <strong className="text-sky-300 truncate block">{rec.headlineFont}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[8.5px] uppercase">Body Copy</span>
                    <strong className="text-amber-300 truncate block">{rec.bodyFont}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[8.5px] uppercase">Thai Comp</span>
                    <strong className="text-emerald-300 truncate block">{rec.thaiFont}</strong>
                  </div>
                </div>

                {/* Live Typographic Specimen Stage */}
                <div className="p-3.5 rounded-lg bg-[#f8f6f0] text-slate-900 border border-slate-300 space-y-1.5 shadow-sm">
                  <div
                    className="font-bold text-base leading-tight tracking-tight text-slate-950"
                    style={{ fontFamily: headlineOpt.family }}
                  >
                    The Architecture of the Written Word
                  </div>
                  <div
                    className="text-xs leading-relaxed text-slate-800 line-clamp-2"
                    style={{ fontFamily: bodyOpt.family }}
                  >
                    Typography is the craft of endowing human language with a durable visual form. Good design requires clarity, proportion, and fidelity to ink and paper.
                  </div>
                  <div
                    className="text-xs font-thai text-slate-700 leading-snug"
                    style={{ fontFamily: thaiOpt.family }}
                  >
                    ศิลปะแห่งตัวพิมพ์และการจัดวาง • วรรณยุกต์และสระภาษาไทย
                  </div>
                </div>

                {/* Micro-Metrics Ribbon */}
                <div className="flex flex-wrap items-center gap-2 text-[9px] font-mono text-slate-400 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
                  <span>Size: <strong className="text-slate-200">{rec.recommendedBodyPt}pt</strong></span>
                  <span>•</span>
                  <span>Leading: <strong className="text-slate-200">{rec.recommendedLeadingPt}pt</strong></span>
                  <span>•</span>
                  <span>Thai Comp: <strong className="text-sky-300">+{rec.recommendedThaiCompensationPt}pt</strong></span>
                  <span>•</span>
                  <span>Measure: <strong className="text-slate-200">{rec.recommendedColumnMm}mm</strong></span>
                </div>

                {/* Typographic Voice & Curatorial Rationale */}
                <div className="space-y-1.5">
                  <div className="text-[10px] text-amber-300/90 font-mono italic">
                    "{rec.typographicVoice}"
                  </div>
                  <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                    {rec.rationale}
                  </p>
                </div>

                {/* Key Traits Tags */}
                {rec.keyTraits && rec.keyTraits.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {rec.keyTraits.map((trait, i) => (
                      <span
                        key={i}
                        className="text-[8.5px] px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-800 font-mono"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleApply(rec)}
                className={`w-full mt-4 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  isApplied
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white'
                }`}
              >
                {isApplied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Applied to Reading Specimen</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Apply This Pairing</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
