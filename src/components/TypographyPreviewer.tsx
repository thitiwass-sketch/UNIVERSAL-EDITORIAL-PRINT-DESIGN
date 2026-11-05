import React, { useState, useMemo } from 'react';
import {
  Type,
  Sliders,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Grid,
  Columns,
  Layers,
  RotateCcw,
  Check,
  Copy,
  Download,
  Eye,
  ShieldCheck,
  AlignLeft,
  ChevronDown,
  Maximize2,
  FileText,
  ArrowDownUp,
  Ruler,
  Scale,
} from 'lucide-react';
import { ActiveProjectState } from '../types/os';
import {
  AVAILABLE_FONTS,
  FONT_PAIRING_PRESETS,
  EDITORIAL_SAMPLE_TEXTS,
} from '../data/typographyPresets';
import { auditTypographyViability } from '../utils/typographyAuditEngine';
import { calculateOptimalKerning } from '../utils/autoKerningOptimizer';
import { FontOption, FontPairingPreset, EditorialSampleText } from '../types/typographyPreview';
import { AiFontRecommenderPanel } from './AiFontRecommenderPanel';
import { useToast } from '../context/ToastContext';

interface TypographyPreviewerProps {
  project: ActiveProjectState;
  onApplyTypography: (updatedTypography: ActiveProjectState['typography']) => void;
  onSaveSnapshot?: (versionName: string, tag: any, description: string) => void;
}

export const TypographyPreviewer: React.FC<TypographyPreviewerProps> = ({
  project,
  onApplyTypography,
  onSaveSnapshot,
}) => {
  const { notifyExport, notifySuccess, notifyTask } = useToast();
  // Preset Selection
  const [selectedPresetId, setSelectedPresetId] = useState<string>(
    FONT_PAIRING_PRESETS[0].id
  );

  // Active Font Selections
  const [headlineFontName, setHeadlineFontName] = useState<string>(
    project.typography.headlineFont || AVAILABLE_FONTS[0].name
  );
  const [bodyFontName, setBodyFontName] = useState<string>(
    project.typography.bodyFont || AVAILABLE_FONTS[0].name
  );
  const [thaiFontName, setThaiFontName] = useState<string>(
    project.typography.thaiFont || 'IBM Plex Sans Thai'
  );

  // Micro-typographic Controls
  const [bodyPt, setBodyPt] = useState<number>(project.typography.bodyPt || 10);
  const [leadingPt, setLeadingPt] = useState<number>(project.typography.leadingPt || 14.5);
  const [thaiCompensationPt, setThaiCompensationPt] = useState<number>(
    project.typography.thaiLeadingCompensationPt || 2.5
  );
  const [columnWidthMm, setColumnWidthMm] = useState<number>(85);
  const [columnsCount, setColumnsCount] = useState<1 | 2 | 3>(1);
  const [trackingEm, setTrackingEm] = useState<number>(0);

  // Visual Simulation & Baseline Grid Options
  const [paperTexture, setPaperTexture] = useState<'munken' | 'silk' | 'craft' | 'white'>('munken');
  const [isReverseType, setIsReverseType] = useState<boolean>(false);
  const [showBaselineGrid, setShowBaselineGrid] = useState<boolean>(false);
  const [baselineGridMode, setBaselineGridMode] = useState<'layout' | 'leading' | 'custom'>('layout');
  const [customGridPt, setCustomGridPt] = useState<number>(project.specs.grid?.baselineGridPt || 12);
  const [gridColor, setGridColor] = useState<'cyan' | 'magenta' | 'indigo' | 'slate'>('cyan');
  const [gridOpacity, setGridOpacity] = useState<number>(35);
  const [showVerticalCaliper, setShowVerticalCaliper] = useState<boolean>(true);
  const [showMarginRuler, setShowMarginRuler] = useState<boolean>(true);
  const [simulateDotGain, setSimulateDotGain] = useState<boolean>(false);

  // Sample Text Selection
  const [selectedSampleId, setSelectedSampleId] = useState<string>(
    EDITORIAL_SAMPLE_TEXTS[0].id
  );
  const [customText, setCustomText] = useState<string>('');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);

  // UI state
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'preview' | 'audit' | 'presets' | 'ai-recommender'>('preview');

  // Resolved Font Objects
  const headlineFontOption = useMemo(() => {
    return (
      AVAILABLE_FONTS.find((f) => f.name === headlineFontName || f.family === headlineFontName) ||
      AVAILABLE_FONTS[0]
    );
  }, [headlineFontName]);

  const bodyFontOption = useMemo(() => {
    return (
      AVAILABLE_FONTS.find((f) => f.name === bodyFontName || f.family === bodyFontName) ||
      AVAILABLE_FONTS[0]
    );
  }, [bodyFontName]);

  const thaiFontOption = useMemo(() => {
    return (
      AVAILABLE_FONTS.find((f) => f.name === thaiFontName || f.family === thaiFontName) ||
      AVAILABLE_FONTS.find((f) => f.id === 'ibm-plex-sans-thai')!
    );
  }, [thaiFontName]);

  // Selected Sample Content
  const activeSample = useMemo(() => {
    return (
      EDITORIAL_SAMPLE_TEXTS.find((s) => s.id === selectedSampleId) ||
      EDITORIAL_SAMPLE_TEXTS[0]
    );
  }, [selectedSampleId]);

  // Run Real-time Typography Viability and Readability Audit
  const auditResult = useMemo(() => {
    return auditTypographyViability({
      bodyFont: bodyFontOption,
      bodyPt,
      leadingPt,
      thaiCompensationPt,
      columnWidthMm,
      columnsCount,
      baselineGridPt: project.specs.grid?.baselineGridPt || 12,
      paperType: paperTexture,
      isReverseType,
    });
  }, [
    bodyFontOption,
    bodyPt,
    leadingPt,
    thaiCompensationPt,
    columnWidthMm,
    columnsCount,
    project.specs.grid?.baselineGridPt,
    paperTexture,
    isReverseType,
  ]);

  // Optical Auto-Kerning for Specimen Headline
  const autoKerningResult = useMemo(() => {
    return calculateOptimalKerning({
      text: activeSample.headline,
      fontFamily: headlineFontOption.family,
      fontCategory: headlineFontOption.category,
      fontWeight: 700,
      fontSizePt: bodyPt * 2.2,
      isReverseType,
    });
  }, [activeSample.headline, headlineFontOption, bodyPt, isReverseType]);

  // Baseline Grid Calculations & Vertical Alignment Analysis
  const layoutGridPitch = project.specs.grid?.baselineGridPt || 12;

  const activeGridPitchPt = useMemo(() => {
    if (baselineGridMode === 'layout') return layoutGridPitch;
    if (baselineGridMode === 'leading') return leadingPt;
    return customGridPt;
  }, [baselineGridMode, layoutGridPitch, leadingPt, customGridPt]);

  const gridHexColor = useMemo(() => {
    switch (gridColor) {
      case 'cyan':
        return '#06b6d4';
      case 'magenta':
        return '#f43f5e';
      case 'indigo':
        return '#6366f1';
      case 'slate':
      default:
        return '#94a3b8';
    }
  }, [gridColor]);

  const alignmentStatus = useMemo(() => {
    const pitch = activeGridPitchPt;
    const delta = leadingPt - pitch;
    const absDelta = Math.abs(delta);
    const ratio = leadingPt / pitch;
    const isExactLock = absDelta < 0.15;
    const isHarmonic1_5 = Math.abs(ratio - 1.5) < 0.05; // 3:2 harmonic
    const isHarmonic2_0 = Math.abs(ratio - 2.0) < 0.05; // 2:1 harmonic

    const nearestSnapPt = Math.round(leadingPt / pitch) * pitch || pitch;
    const canSnap = absDelta >= 0.15;

    if (isExactLock) {
      return {
        isLocked: true,
        isHarmonic: false,
        label: '1:1 Locked to Grid',
        badgeClass: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/80',
        driftText: '0.0 pt (Exact Lock)',
        driftClass: 'text-emerald-400 font-bold',
        desc: 'Perfect baseline synchronicity. Every text line sits precisely upon a grid guide.',
        nearestSnapPt,
        canSnap: false,
      };
    }

    if (isHarmonic1_5) {
      return {
        isLocked: false,
        isHarmonic: true,
        label: '3:2 Harmonic Pitch',
        badgeClass: 'bg-sky-950/80 text-sky-300 border-sky-700/80',
        driftText: 'Harmonic (2 lines : 3 grid intervals)',
        driftClass: 'text-sky-300 font-bold',
        desc: 'Harmonic proportion: Every 2 text lines coincide cleanly with 3 grid intervals.',
        nearestSnapPt,
        canSnap: true,
      };
    }

    if (isHarmonic2_0) {
      return {
        isLocked: false,
        isHarmonic: true,
        label: '2:1 Double Pitch',
        badgeClass: 'bg-sky-950/80 text-sky-300 border-sky-700/80',
        driftText: 'Alternate (Every line skips 1 grid line)',
        driftClass: 'text-sky-300 font-bold',
        desc: 'Subharmonic lock: Each body line rests consistently on alternate grid rows.',
        nearestSnapPt,
        canSnap: true,
      };
    }

    return {
      isLocked: false,
      isHarmonic: false,
      label: 'Phase Drift',
      badgeClass: 'bg-amber-950/80 text-amber-300 border-amber-700/80',
      driftText: `${delta > 0 ? '+' : ''}${delta.toFixed(1)} pt / line`,
      driftClass: 'text-amber-400 font-bold',
      desc: `Vertical phase drift: Font leading (${leadingPt}pt) advances at a non-integer ratio relative to grid intervals (${pitch}pt), causing lines to cross baseline guides.`,
      nearestSnapPt,
      canSnap,
    };
  }, [leadingPt, activeGridPitchPt]);

  // Handle Preset Selection
  const handleSelectPreset = (preset: FontPairingPreset) => {
    setSelectedPresetId(preset.id);
    const hl = AVAILABLE_FONTS.find((f) => f.family === preset.headlineFont) || AVAILABLE_FONTS[0];
    const bd = AVAILABLE_FONTS.find((f) => f.family === preset.bodyFont) || AVAILABLE_FONTS[0];
    const th = AVAILABLE_FONTS.find((f) => f.family === preset.thaiFont) || AVAILABLE_FONTS[7];

    setHeadlineFontName(hl.name);
    setBodyFontName(bd.name);
    setThaiFontName(th.name);
    setBodyPt(preset.defaultBodyPt);
    setLeadingPt(preset.defaultLeadingPt);
    setThaiCompensationPt(preset.defaultThaiCompensationPt);
    setColumnWidthMm(preset.recommendedColumnMm);
  };

  // Handle AI Recommendation Selection
  const handleSelectAiPairing = (pairing: {
    headlineFont: string;
    bodyFont: string;
    thaiFont: string;
    bodyPt: number;
    leadingPt: number;
    thaiCompensationPt: number;
    columnWidthMm: number;
    pairingName: string;
  }) => {
    const hl =
      AVAILABLE_FONTS.find((f) => f.name === pairing.headlineFont || f.family.includes(pairing.headlineFont)) ||
      AVAILABLE_FONTS[0];
    const bd =
      AVAILABLE_FONTS.find((f) => f.name === pairing.bodyFont || f.family.includes(pairing.bodyFont)) ||
      AVAILABLE_FONTS[0];
    const th =
      AVAILABLE_FONTS.find((f) => f.name === pairing.thaiFont || f.family.includes(pairing.thaiFont)) ||
      AVAILABLE_FONTS[7];

    setHeadlineFontName(hl.name);
    setBodyFontName(bd.name);
    setThaiFontName(th.name);
    setBodyPt(pairing.bodyPt);
    setLeadingPt(pairing.leadingPt);
    setThaiCompensationPt(pairing.thaiCompensationPt);
    setColumnWidthMm(pairing.columnWidthMm);
    setActiveTab('preview');
  };

  // Apply Font Combination and Metrics to Project State
  const handleApplyToProject = () => {
    const updatedTypography: ActiveProjectState['typography'] = {
      ...project.typography,
      headlineFont: headlineFontOption.family,
      bodyFont: bodyFontOption.family,
      thaiFont: thaiFontOption.family,
      bodyPt,
      leadingPt,
      thaiLeadingCompensationPt: thaiCompensationPt,
      sampleHeadline: activeSample.headline,
      sampleSubhead: activeSample.subhead,
      sampleBody: activeSample.bodyParagraphs[0],
      sampleThaiBody: activeSample.bodyParagraphs[1] || activeSample.bodyParagraphs[0],
    };

    onApplyTypography(updatedTypography);
    notifySuccess(
      'Typography Formulation Applied',
      `Applied ${headlineFontOption.name} + ${bodyFontOption.name} (${bodyPt}pt body / ${leadingPt}pt leading) to active project.`
    );
  };

  // Snap leading to active baseline grid
  const handleSnapToBaselineGrid = () => {
    const pitch = activeGridPitchPt;
    const snapped = Math.round(leadingPt / pitch) * pitch;
    const finalPt = snapped > 0 ? snapped : pitch;
    setLeadingPt(finalPt);
    notifyTask(
      'Baseline Snap Synchronized',
      `Adjusted body line leading to ${finalPt}pt matching active grid pitch (${pitch}pt).`,
      'ENG_GRID'
    );
  };

  // Export Typographic Spec Sheet
  const handleExportSpecs = () => {
    const filename = `${project.id}-typography-specs.json`;
    const specSheet = {
      project: project.title,
      date: new Date().toISOString(),
      headlineFont: {
        name: headlineFontOption.name,
        family: headlineFontOption.family,
        category: headlineFontOption.category,
      },
      bodyFont: {
        name: bodyFontOption.name,
        family: bodyFontOption.family,
        category: bodyFontOption.category,
        bodySizePt: bodyPt,
        leadingPt: leadingPt,
        leadingRatio: `${auditResult.leadingRatio}%`,
      },
      thaiCompanionFont: {
        name: thaiFontOption.name,
        family: thaiFontOption.family,
        compensationPt: `+${thaiCompensationPt}pt`,
        effectiveLeadingPt: auditResult.thaiOrthographyClearance.effectiveLeadingPt,
      },
      columnSpecs: {
        widthMm: columnWidthMm,
        estimatedCpl: auditResult.charactersPerLine,
        cplRating: auditResult.cplStatus,
        columnsCount,
      },
      printViability: {
        readabilityScore: `${auditResult.readabilityScore}/100`,
        dotGainRisk: auditResult.dotGainVulnerability.status,
        minPtStatus: auditResult.pointSizeViability.status,
        thaiClearance: auditResult.thaiOrthographyClearance.status,
        baselineSnap: auditResult.baselineGridStatus.isSnapping,
      },
      editorialCritiques: auditResult.editorialCritiques,
    };

    const blob = new Blob([JSON.stringify(specSheet, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    notifyExport(
      filename,
      'Typography Spec Sheet',
      `Exported typographic scale ladder, leading ratios, and prepress viability audit data.`
    );
  };

  // Paper background CSS
  const getPaperBgStyle = () => {
    if (isReverseType) {
      return {
        backgroundColor: '#0a0d12',
        color: '#f8fafc',
      };
    }
    switch (paperTexture) {
      case 'munken':
        return { backgroundColor: '#f6f3eb', color: '#16191f' };
      case 'silk':
        return { backgroundColor: '#f8f9fa', color: '#0f141c' };
      case 'craft':
        return { backgroundColor: '#d8c4a5', color: '#271a0e' };
      case 'white':
      default:
        return { backgroundColor: '#ffffff', color: '#111827' };
    }
  };

  return (
    <div className="flex flex-col gap-4 font-mono text-xs">
      {/* Top Header Card */}
      <div className="bg-[#0b1017] border border-slate-800 rounded-xl p-3.5">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-sky-400" />
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wide">
              Editorial Typography Previewer &amp; Print Viability
            </h3>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-sky-950/80 text-sky-300 border border-sky-800/60 font-bold">
            Readability Audit • {auditResult.readabilityScore}/100
          </span>
        </div>

        <p className="text-[11px] text-slate-400 mt-2 leading-relaxed font-sans">
          Test selected headline and body font combinations against authentic editorial body texts, evaluating character-per-line measures, leading ratios, and offset print viability.
        </p>

        {/* View Tabs */}
        <div className="flex items-center gap-1 mt-3 bg-slate-950 p-1 rounded-lg border border-slate-800/80">
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex-1 py-1 px-2 rounded font-medium transition-all text-center flex items-center justify-center gap-1.5 ${
              activeTab === 'preview'
                ? 'bg-indigo-600 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3 h-3" />
            <span>Specimen Reader</span>
          </button>
          <button
            id="tab-btn-ai-font-recommender"
            onClick={() => setActiveTab('ai-recommender')}
            className={`flex-1 py-1 px-2 rounded font-medium transition-all text-center flex items-center justify-center gap-1.5 ${
              activeTab === 'ai-recommender'
                ? 'bg-amber-600 text-slate-950 font-bold shadow-sm'
                : 'text-amber-400/90 hover:text-amber-300'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>AI Recommender</span>
          </button>
          <button
            onClick={() => setActiveTab('presets')}
            className={`flex-1 py-1 px-2 rounded font-medium transition-all text-center flex items-center justify-center gap-1.5 ${
              activeTab === 'presets'
                ? 'bg-indigo-600 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>Curated Pairings ({FONT_PAIRING_PRESETS.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`flex-1 py-1 px-2 rounded font-medium transition-all text-center flex items-center justify-center gap-1.5 ${
              activeTab === 'audit'
                ? 'bg-indigo-600 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3 h-3" />
            <span>Prepress Viability</span>
          </button>
        </div>
      </div>

      {/* Main Specimen Reader View */}
      {activeTab === 'preview' && (
        <div className="space-y-4">
          {/* Quick Preset Selector Ribbon */}
          <div className="bg-[#0b1017] border border-slate-800 rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span className="uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Quick Curated Pairings</span>
              </span>
              <button
                id="btn-quick-open-ai-recommender"
                onClick={() => setActiveTab('ai-recommender')}
                className="text-amber-400 hover:text-amber-300 text-[10px] flex items-center gap-1 font-mono transition-colors"
                title="Open AI Font Pairing Recommender"
              >
                <Sparkles className="w-2.5 h-2.5" />
                <span>Ask AI Recommender for Mood Formulations →</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {FONT_PAIRING_PRESETS.map((preset) => {
                const isSelected = selectedPresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className={`px-2.5 py-1.5 rounded-lg border text-left whitespace-nowrap transition-all shrink-0 ${
                      isSelected
                        ? 'bg-sky-950 border-sky-500 text-sky-200 font-bold ring-1 ring-sky-500/50'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-[11px] leading-tight">{preset.name}</div>
                    <div className="text-[9px] text-slate-500 font-normal mt-0.5 font-mono">
                      {preset.category}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Micro-Typographic Controls Bar */}
          <div className="bg-[#0b1017] border border-slate-800 rounded-xl p-3.5 space-y-3">
            <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-wider">
              <span className="flex items-center gap-1 font-bold text-slate-300">
                <Sliders className="w-3 h-3 text-emerald-400" />
                <span>Font Selection &amp; Micro-Metrics</span>
              </span>
              <button
                onClick={handleSnapToBaselineGrid}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 text-[10px] flex items-center gap-1 border border-slate-700 transition-colors"
                title="Snap line leading to project baseline grid"
              >
                <Grid className="w-2.5 h-2.5" />
                <span>Snap to Baseline ({project.specs.grid?.baselineGridPt || 12}pt)</span>
              </button>
            </div>

            {/* Font Selectors Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {/* Headline Font */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400">Headline Font:</label>
                <select
                  value={headlineFontName}
                  onChange={(e) => setHeadlineFontName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-slate-200 text-[11px] focus:outline-none focus:border-sky-500"
                >
                  {AVAILABLE_FONTS.map((font) => (
                    <option key={font.id} value={font.name}>
                      {font.name} ({font.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* Body Font */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400">Body Copy Font:</label>
                <select
                  value={bodyFontName}
                  onChange={(e) => setBodyFontName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-slate-200 text-[11px] focus:outline-none focus:border-sky-500"
                >
                  {AVAILABLE_FONTS.filter((f) => f.category !== 'display').map((font) => (
                    <option key={font.id} value={font.name}>
                      {font.name} ({font.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* Thai Companion Font */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400">Thai Companion Font:</label>
                <select
                  value={thaiFontName}
                  onChange={(e) => setThaiFontName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-slate-200 text-[11px] focus:outline-none focus:border-sky-500"
                >
                  {AVAILABLE_FONTS.filter((f) => f.isThaiSupport).map((font) => (
                    <option key={font.id} value={font.name}>
                      {font.name} ({font.category})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Slider Controls */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800">
              {/* Body Point Size */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">Body Size:</span>
                  <span className="text-slate-200 font-bold">{bodyPt} pt</span>
                </div>
                <input
                  type="range"
                  min={7.5}
                  max={13}
                  step={0.5}
                  value={bodyPt}
                  onChange={(e) => setBodyPt(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded appearance-none accent-sky-400 cursor-pointer"
                />
              </div>

              {/* Line Leading */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">Leading:</span>
                  <span className="text-slate-200 font-bold">
                    {leadingPt} pt ({auditResult.leadingRatio}%)
                  </span>
                </div>
                <input
                  type="range"
                  min={9.5}
                  max={20}
                  step={0.5}
                  value={leadingPt}
                  onChange={(e) => setLeadingPt(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded appearance-none accent-sky-400 cursor-pointer"
                />
              </div>

              {/* Thai Leading Comp */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">Thai Comp:</span>
                  <span className="text-sky-300 font-bold">+{thaiCompensationPt} pt</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={5}
                  step={0.5}
                  value={thaiCompensationPt}
                  onChange={(e) => setThaiCompensationPt(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded appearance-none accent-sky-400 cursor-pointer"
                />
              </div>

              {/* Column Measure (mm) */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">Column Width:</span>
                  <span className="text-slate-200 font-bold">
                    {columnWidthMm} mm (~{auditResult.charactersPerLine} CPL)
                  </span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={140}
                  step={5}
                  value={columnWidthMm}
                  onChange={(e) => setColumnWidthMm(parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-slate-800 rounded appearance-none accent-sky-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Visual Viewport Controls (Substrate & Columns) */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-[10px]">
              {/* Paper Stock Selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">Substrate:</span>
                {(['munken', 'silk', 'craft', 'white'] as const).map((paper) => (
                  <button
                    key={paper}
                    onClick={() => setPaperTexture(paper)}
                    className={`px-2 py-0.5 rounded capitalize transition-colors ${
                      paperTexture === paper
                        ? 'bg-slate-700 text-white font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {paper}
                  </button>
                ))}
              </div>

              {/* Column Layout */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">Columns:</span>
                {([1, 2, 3] as const).map((num) => (
                  <button
                    key={num}
                    onClick={() => setColumnsCount(num)}
                    className={`px-2 py-0.5 rounded transition-colors ${
                      columnsCount === num
                        ? 'bg-sky-950 text-sky-300 font-bold border border-sky-800'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {num === 1 ? 'Single' : `${num} Cols`}
                  </button>
                ))}
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsReverseType((prev) => !prev)}
                  className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
                    isReverseType
                      ? 'bg-indigo-950 text-indigo-200 border border-indigo-700'
                      : 'bg-slate-900 text-slate-400'
                  }`}
                  title="Test reverse / knockout type (white text on dark solid background)"
                >
                  Reverse Knockout
                </button>

                {/* Baseline Grid Overlay Toggle */}
                <button
                  id="btn-toggle-baseline-grid"
                  onClick={() => setShowBaselineGrid((prev) => !prev)}
                  className={`px-2.5 py-1 rounded text-[10px] font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
                    showBaselineGrid
                      ? 'bg-sky-500 text-slate-950 font-bold ring-2 ring-sky-400/50 shadow-sky-500/20'
                      : 'bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                  title="Toggle Baseline Grid Overlay to visually illustrate vertical alignment and leading against layout grid"
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span>Baseline Grid Overlay</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-mono uppercase font-bold ${
                      showBaselineGrid
                        ? 'bg-slate-950 text-sky-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {showBaselineGrid ? `${activeGridPitchPt}pt ON` : 'OFF'}
                  </span>
                </button>

                <button
                  onClick={() => setSimulateDotGain((prev) => !prev)}
                  className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
                    simulateDotGain
                      ? 'bg-amber-950 text-amber-300 border border-amber-700'
                      : 'bg-slate-900 text-slate-400'
                  }`}
                  title="Simulate offset press dot gain (ink spreading on paper fibers)"
                >
                  Dot Gain (18%)
                </button>
              </div>
            </div>

            {/* Interactive Baseline Grid & Vertical Leading Inspector Toolbar */}
            {showBaselineGrid && (
              <div className="bg-[#0c141f] border border-sky-800/70 rounded-xl p-3 space-y-2.5 text-xs text-slate-300 animate-in fade-in duration-150">
                {/* Status Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-sky-900/50 pb-2">
                  <div className="flex items-center gap-2">
                    <Grid className="w-3.5 h-3.5 text-sky-400" />
                    <span className="font-bold text-sky-200 uppercase tracking-wider text-[11px]">
                      Baseline Grid &amp; Vertical Alignment
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold border ${alignmentStatus.badgeClass}`}>
                      {alignmentStatus.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 text-[10px] font-mono">
                    <span className="text-slate-400">Leading: <strong className="text-slate-100">{leadingPt}pt</strong></span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-400">Grid Pitch: <strong className="text-sky-300">{activeGridPitchPt}pt</strong></span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-400">Drift: <strong className={alignmentStatus.driftClass}>{alignmentStatus.driftText}</strong></span>
                  </div>
                </div>

                {/* Sub-toolbar Controls: Reference, Color, Opacity, Caliper, Ruler */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 text-[10px]">
                  {/* Grid Reference Mode */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">Grid Pitch:</span>
                    <button
                      onClick={() => setBaselineGridMode('layout')}
                      className={`px-2 py-0.5 rounded border transition-colors ${
                        baselineGridMode === 'layout'
                          ? 'bg-sky-950 border-sky-500 text-sky-200 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                      title={`Match Project Layout Grid (${layoutGridPitch}pt)`}
                    >
                      Layout ({layoutGridPitch}pt)
                    </button>
                    <button
                      onClick={() => setBaselineGridMode('leading')}
                      className={`px-2 py-0.5 rounded border transition-colors ${
                        baselineGridMode === 'leading'
                          ? 'bg-sky-950 border-sky-500 text-sky-200 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                      title={`Match Font Leading (${leadingPt}pt)`}
                    >
                      Body Leading ({leadingPt}pt)
                    </button>
                    <button
                      onClick={() => setBaselineGridMode('custom')}
                      className={`px-2 py-0.5 rounded border transition-colors ${
                        baselineGridMode === 'custom'
                          ? 'bg-sky-950 border-sky-500 text-sky-200 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Custom
                    </button>
                    {baselineGridMode === 'custom' && (
                      <div className="flex items-center gap-1 pl-1">
                        <input
                          type="range"
                          min={6}
                          max={24}
                          step={0.5}
                          value={customGridPt}
                          onChange={(e) => setCustomGridPt(parseFloat(e.target.value))}
                          className="w-16 h-1 bg-slate-800 rounded appearance-none accent-sky-400 cursor-pointer"
                        />
                        <span className="font-mono text-sky-300 font-bold">{customGridPt}pt</span>
                      </div>
                    )}
                  </div>

                  {/* Guide Colors */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">Color:</span>
                    {[
                      { id: 'cyan', label: 'Cyan Prepress Guide', color: '#06b6d4', ring: 'ring-cyan-400' },
                      { id: 'magenta', label: 'Magenta Layout Guide', color: '#f43f5e', ring: 'ring-rose-400' },
                      { id: 'indigo', label: 'Indigo Guide', color: '#6366f1', ring: 'ring-indigo-400' },
                      { id: 'slate', label: 'Neutral Guide', color: '#94a3b8', ring: 'ring-slate-400' },
                    ].map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setGridColor(c.id as any)}
                        className={`w-3.5 h-3.5 rounded-full border border-black/40 transition-all ${
                          gridColor === c.id ? `ring-2 ${c.ring} scale-110` : 'opacity-50 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: c.color }}
                        title={c.label}
                      />
                    ))}
                  </div>

                  {/* Opacity */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">Density:</span>
                    {[20, 35, 55, 75].map((op) => (
                      <button
                        key={op}
                        onClick={() => setGridOpacity(op)}
                        className={`px-1.5 py-0.5 rounded font-mono transition-colors ${
                          gridOpacity === op
                            ? 'bg-slate-700 text-white font-bold'
                            : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {op}%
                      </button>
                    ))}
                  </div>

                  {/* Visual Helpers Toggles */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setShowVerticalCaliper((prev) => !prev)}
                      className={`px-2 py-0.5 rounded border transition-colors flex items-center gap-1 ${
                        showVerticalCaliper
                          ? 'bg-sky-950 border-sky-500 text-sky-200 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                      title="Toggle visual typographic caliper showing vertical metrics (baseline, cap height, leading)"
                    >
                      <ArrowDownUp className="w-2.5 h-2.5" />
                      <span>Vertical Caliper</span>
                    </button>

                    <button
                      onClick={() => setShowMarginRuler((prev) => !prev)}
                      className={`px-2 py-0.5 rounded border transition-colors flex items-center gap-1 ${
                        showMarginRuler
                          ? 'bg-sky-950 border-sky-500 text-sky-200 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                      title="Toggle margin grid line counter (L01, L02... and pt measurements)"
                    >
                      <Ruler className="w-2.5 h-2.5" />
                      <span>Margin Ruler</span>
                    </button>
                  </div>

                  {/* Action: Snap Leading */}
                  {alignmentStatus.canSnap && (
                    <button
                      onClick={handleSnapToBaselineGrid}
                      className="px-2 py-0.5 rounded bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700 font-medium flex items-center gap-1 transition-colors"
                      title={`Snap font leading from ${leadingPt}pt to ${alignmentStatus.nearestSnapPt}pt to lock onto baseline grid`}
                    >
                      <Check className="w-2.5 h-2.5" />
                      <span>Snap Leading ({alignmentStatus.nearestSnapPt}pt)</span>
                    </button>
                  )}
                </div>

                <div className="text-[10px] text-slate-400 font-sans border-t border-sky-900/40 pt-2 flex items-center justify-between">
                  <span>{alignmentStatus.desc}</span>
                  <span className="font-mono text-slate-500 text-[9px]">
                    Grid Pitch: {activeGridPitchPt}pt • Leading: {leadingPt}pt • Thai Comp: +{thaiCompensationPt}pt
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Visual Vertical Alignment & Leading Caliper Diagram */}
          {showBaselineGrid && showVerticalCaliper && (
            <div className="bg-[#0b1017] border border-slate-800 rounded-xl p-3.5 space-y-2.5 animate-in fade-in duration-150">
              <div className="flex flex-wrap items-center justify-between text-[11px] pb-2 border-b border-slate-800 gap-2">
                <div className="flex items-center gap-1.5 font-bold text-slate-200">
                  <ArrowDownUp className="w-3.5 h-3.5 text-sky-400" />
                  <span>Vertical Typographic Caliper: Leading &amp; Baseline Geometry</span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-0.5 bg-emerald-400 inline-block"></span>
                    <span className="text-slate-400">Baseline (0pt)</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-0.5 bg-sky-400 inline-block border-b border-dashed border-sky-400"></span>
                    <span className="text-slate-400">Cap-Height (~{(bodyPt * 0.72).toFixed(1)}pt)</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-0.5 bg-amber-400 inline-block border-b border-dotted border-amber-400"></span>
                    <span className="text-slate-400">x-Height (~{(bodyPt * 0.52).toFixed(1)}pt)</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-0.5 bg-purple-400 inline-block"></span>
                    <span className="text-slate-400">Thai Clearance (+{thaiCompensationPt}pt)</span>
                  </span>
                </div>
              </div>

              {/* Caliper Visual Stage */}
              <div className="relative bg-slate-950/90 rounded-lg p-4 border border-slate-800/80 overflow-x-auto">
                {/* Background Grid Pattern across the caliper stage */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-20"
                  style={{
                    backgroundImage: `linear-gradient(to bottom, ${gridHexColor} 1px, transparent 1px)`,
                    backgroundSize: `100% ${activeGridPitchPt * 2.5}px`,
                  }}
                />

                <div className="flex items-center justify-between min-w-[580px] gap-6 relative z-10">
                  {/* Sample Line 1 & Line 2 demonstration with active fonts */}
                  <div className="flex-1 space-y-3">
                    {/* Line 1 */}
                    <div className="relative border-b-2 border-emerald-500/80 pb-0.5">
                      <span
                        className="text-slate-100 font-medium select-none"
                        style={{
                          fontFamily: bodyFontOption.family,
                          fontSize: `${Math.max(bodyPt * 2, 22)}px`,
                          letterSpacing: `${trackingEm}em`,
                        }}
                      >
                        The Editorial Craft: Vertical Leading
                      </span>
                      <span
                        className="ml-2 text-sky-400 select-none font-thai"
                        style={{
                          fontFamily: thaiFontOption.family,
                          fontSize: `${Math.max(bodyPt * 2, 22)}px`,
                        }}
                      >
                        วรรณยุกต์ไทย
                      </span>

                      {/* Cap-Height marker line */}
                      <div
                        className="absolute left-0 right-0 border-t border-dashed border-sky-400/60 pointer-events-none"
                        style={{
                          bottom: `${Math.max(bodyPt * 2, 22) * 0.72}px`,
                        }}
                      >
                        <span className="absolute -top-3.5 right-0 text-[8px] font-mono text-sky-400 uppercase">
                          Cap-Height [{(bodyPt * 0.72).toFixed(1)}pt]
                        </span>
                      </div>

                      {/* X-Height marker line */}
                      <div
                        className="absolute left-0 right-0 border-t border-dotted border-amber-400/60 pointer-events-none"
                        style={{
                          bottom: `${Math.max(bodyPt * 2, 22) * 0.52}px`,
                        }}
                      >
                        <span className="absolute -top-3 right-36 text-[8px] font-mono text-amber-400 uppercase">
                          Mean line (x-Height)
                        </span>
                      </div>

                      <span className="absolute -bottom-3.5 right-0 text-[8px] font-mono text-emerald-400 font-bold uppercase">
                        Baseline 1 (Ref 0pt)
                      </span>
                    </div>

                    {/* Thai Tone Clearance Zone */}
                    {thaiCompensationPt > 0 && (
                      <div className="h-2 bg-purple-950/40 border border-purple-500/40 rounded flex items-center justify-between px-2 text-[8px] font-mono text-purple-300">
                        <span>Thai 3-Tier Tone Mark Safe Headroom: +{thaiCompensationPt}pt</span>
                        <span>ISO 12647-2 Clear</span>
                      </div>
                    )}

                    {/* Line 2 with second baseline */}
                    <div className="relative border-b-2 border-emerald-500/80 pb-0.5 pt-1">
                      <span
                        className="text-slate-300 font-medium select-none"
                        style={{
                          fontFamily: bodyFontOption.family,
                          fontSize: `${Math.max(bodyPt * 2, 22)}px`,
                          letterSpacing: `${trackingEm}em`,
                        }}
                      >
                        Harmonized Against Layout Grid Standard
                      </span>
                      <span className="absolute -bottom-3.5 right-0 text-[8px] font-mono text-emerald-400 font-bold uppercase">
                        Baseline 2 (Distance: {leadingPt}pt)
                      </span>
                    </div>
                  </div>

                  {/* Vertical Caliper Ruler Card */}
                  <div className="w-52 bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-[10px] font-mono space-y-1.5 shrink-0 shadow-inner">
                    <div className="flex justify-between items-center text-slate-400 border-b border-slate-800 pb-1">
                      <span className="flex items-center gap-1 text-slate-300 font-bold">
                        <Ruler className="w-3 h-3 text-sky-400" />
                        <span>Vertical Caliper</span>
                      </span>
                      <span className="text-sky-300 font-bold">{leadingPt} pt</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Layout Grid Step:</span>
                      <span className="text-slate-200">{activeGridPitchPt} pt</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Body Type Size:</span>
                      <span className="text-slate-200">{bodyPt} pt</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Leading Proportion:</span>
                      <span className="text-slate-200">{Math.round((leadingPt / bodyPt) * 100)}%</span>
                    </div>
                    <div className="flex justify-between text-slate-400 border-t border-slate-800 pt-1">
                      <span>Alignment Phase:</span>
                      <span className={alignmentStatus.driftClass}>{alignmentStatus.driftText}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sample Text Switcher Bar */}
          <div className="flex items-center justify-between text-[11px] bg-[#0b1017] p-2.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
              <span className="text-slate-500 uppercase tracking-wider text-[10px] shrink-0">
                Sample Copy:
              </span>
              {EDITORIAL_SAMPLE_TEXTS.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => {
                    setSelectedSampleId(sample.id);
                    setIsCustomMode(false);
                  }}
                  className={`px-2.5 py-1 rounded-md text-[10px] whitespace-nowrap transition-all ${
                    !isCustomMode && selectedSampleId === sample.id
                      ? 'bg-sky-600 text-white font-bold shadow-sm'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {sample.title.split(':')[0]}
                </button>
              ))}
              <button
                onClick={() => setIsCustomMode(true)}
                className={`px-2.5 py-1 rounded-md text-[10px] whitespace-nowrap transition-all ${
                  isCustomMode
                    ? 'bg-amber-600 text-white font-bold shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                Custom Copy
              </button>
            </div>
          </div>

          {/* Custom Text Editor Area */}
          {isCustomMode && (
            <div className="bg-[#0b1017] border border-slate-800 rounded-xl p-3 space-y-2">
              <label className="text-[10px] text-slate-400">
                Enter your own custom editorial copy to preview:
              </label>
              <textarea
                rows={3}
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Type or paste bilingual Thai or English copy here to test typeface pairings..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 text-xs font-sans focus:outline-none focus:border-sky-500 leading-relaxed"
              />
            </div>
          )}

          {/* Live Rendered Typography Reading Specimen Page */}
          <div
            className="p-6 sm:p-10 rounded-xl border border-slate-800 shadow-2xl transition-all duration-200 relative overflow-hidden"
            style={{
              ...getPaperBgStyle(),
              maxWidth: '100%',
            }}
          >
            {/* Visual Baseline Grid Overlay */}
            {showBaselineGrid && (
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-150"
                style={{
                  opacity: gridOpacity / 100,
                  backgroundImage: `linear-gradient(to bottom, ${gridHexColor} 1px, transparent 1px)`,
                  backgroundSize: `100% ${activeGridPitchPt}pt`,
                  backgroundPosition: '0 0',
                }}
              />
            )}

            {/* Margin Grid Line Counter Ruler */}
            {showBaselineGrid && showMarginRuler && (
              <div
                className="absolute left-0 top-0 bottom-0 w-8 pointer-events-none select-none border-r font-mono text-[7.5px] overflow-hidden hidden sm:flex flex-col opacity-60 z-10"
                style={{
                  borderColor: `${gridHexColor}40`,
                  backgroundColor: isReverseType ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.4)',
                  color: isReverseType ? '#94a3b8' : '#475569',
                }}
              >
                {Array.from({ length: 60 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-full flex items-center justify-between px-1 border-b"
                    style={{
                      height: `${activeGridPitchPt}pt`,
                      borderColor: `${gridHexColor}25`,
                      lineHeight: `${activeGridPitchPt}pt`,
                    }}
                  >
                    <span className="font-bold">{(i + 1).toString().padStart(2, '0')}</span>
                    <span className="text-[6px] opacity-70">{(i * activeGridPitchPt).toFixed(0)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Specimen Header / Folio */}
            <div
              className={`flex items-center justify-between pb-4 mb-6 border-b text-[9px] font-mono tracking-wider uppercase opacity-70 ${
                showBaselineGrid && showMarginRuler ? 'sm:pl-7' : ''
              }`}
              style={{
                borderColor: isReverseType ? '#334155' : '#cbd5e1',
              }}
            >
              <div>{activeSample.metaInfo.publication}</div>
              <div className="flex items-center gap-2">
                <span>{activeSample.metaInfo.section}</span>
                {showBaselineGrid && (
                  <span
                    className="px-1.5 py-0.5 rounded text-[8px] font-bold"
                    style={{
                      backgroundColor: `${gridHexColor}20`,
                      color: gridHexColor,
                      border: `1px solid ${gridHexColor}60`,
                    }}
                  >
                    Grid: {activeGridPitchPt}pt • {alignmentStatus.label}
                  </span>
                )}
              </div>
              <div>Folio 148</div>
            </div>

            {/* Column Container */}
            <div
              className={`transition-all ${
                showBaselineGrid && showMarginRuler ? 'sm:pl-7' : ''
              } ${
                columnsCount === 2
                  ? 'columns-1 sm:columns-2 gap-8'
                  : columnsCount === 3
                  ? 'columns-1 sm:columns-3 gap-6'
                  : 'max-w-3xl mx-auto'
              }`}
              style={{
                filter: simulateDotGain ? 'blur(0.25px) contrast(1.1)' : 'none',
              }}
            >
              {/* Headline with Auto-Kerning Status */}
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[9px] font-mono uppercase tracking-wider opacity-60">Headline Specimen</span>
                <div className="flex items-center gap-1.5 text-[9px] font-mono">
                  <span
                    className="px-1.5 py-0.5 rounded bg-amber-950/40 text-amber-400 border border-amber-800/60 font-bold"
                    title={autoKerningResult.explanation}
                  >
                    Auto-Kern: {autoKerningResult.cssLetterSpacing} (Rhythm: {autoKerningResult.rhythmScore}/100)
                  </span>
                  {trackingEm !== autoKerningResult.optimalTrackingEm && (
                    <button
                      onClick={() => setTrackingEm(autoKerningResult.optimalTrackingEm)}
                      className="px-1.5 py-0.5 rounded bg-sky-950/60 hover:bg-sky-900/60 text-sky-300 border border-sky-800/60 cursor-pointer transition-colors"
                      title="Apply calculated optimal kerning to preview headline"
                    >
                      Apply Auto-Kern
                    </button>
                  )}
                </div>
              </div>
              <h1
                className="font-bold tracking-tight mb-3 leading-tight"
                style={{
                  fontFamily: headlineFontOption.family,
                  fontSize: `${bodyPt * 2.2}pt`,
                  letterSpacing: `${trackingEm}em`,
                }}
              >
                {activeSample.headline}
              </h1>

              {/* Subhead / Thai Translation */}
              <h3
                className="font-medium mb-6 leading-snug opacity-85"
                style={{
                  fontFamily: thaiFontOption.family,
                  fontSize: `${bodyPt * 1.25}pt`,
                  lineHeight: `${leadingPt * 1.25}pt`,
                }}
              >
                {activeSample.subhead}
              </h3>

              {/* Author byline */}
              <div className="text-[10px] font-mono mb-6 opacity-60 flex items-center gap-2">
                <span>By {activeSample.metaInfo.author}</span>
                <span>•</span>
                <span>{activeSample.metaInfo.wordCount} words</span>
              </div>

              {/* Body Paragraphs */}
              {isCustomMode && customText.trim() ? (
                <div
                  className="space-y-4 text-justify leading-normal"
                  style={{
                    fontFamily: `${bodyFontOption.family}, ${thaiFontOption.family}`,
                    fontSize: `${bodyPt}pt`,
                    lineHeight: `${leadingPt + thaiCompensationPt}pt`,
                    letterSpacing: `${trackingEm}em`,
                  }}
                >
                  {customText.split('\n\n').map((para, i) => (
                    <p key={i} className="indent-6">
                      {para}
                    </p>
                  ))}
                </div>
              ) : (
                <div
                  className="space-y-4 text-justify leading-normal"
                  style={{
                    fontFamily: `${bodyFontOption.family}, ${thaiFontOption.family}`,
                    fontSize: `${bodyPt}pt`,
                    lineHeight: `${leadingPt + thaiCompensationPt}pt`,
                    letterSpacing: `${trackingEm}em`,
                  }}
                >
                  {activeSample.bodyParagraphs.map((para, idx) => {
                    const isThaiPara = /[ก-๙]/.test(para);
                    return (
                      <p
                        key={idx}
                        className={idx === 0 ? 'first-letter:text-3xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-2' : 'indent-6'}
                        style={{
                          fontFamily: isThaiPara
                            ? thaiFontOption.family
                            : bodyFontOption.family,
                        }}
                      >
                        {para}
                      </p>
                    );
                  })}
                </div>
              )}

              {/* Footnotes Area */}
              {activeSample.footnotes && activeSample.footnotes.length > 0 && (
                <div
                  className="mt-8 pt-4 border-t space-y-1 text-[8.5px] opacity-75 font-mono"
                  style={{
                    borderColor: isReverseType ? '#334155' : '#cbd5e1',
                  }}
                >
                  {activeSample.footnotes.map((fn, i) => (
                    <div key={i}>{fn}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Prepress Viability & Readability Audit Tab */}
      {activeTab === 'audit' && (
        <div className="bg-[#0b1017] border border-slate-800 rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h4 className="font-bold text-slate-100 text-xs uppercase">
                Typographic Print Viability &amp; Ergonomic Readability
              </h4>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
              Score: {auditResult.readabilityScore}/100
            </span>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
            {/* Characters Per Line (CPL) */}
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex justify-between items-center text-slate-400">
                <span>Line Measure (CPL):</span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                    auditResult.cplStatus === 'optimal'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}
                >
                  {auditResult.cplStatus}
                </span>
              </div>
              <div className="text-base font-bold text-slate-100 font-mono">
                ~{auditResult.charactersPerLine} characters / line
              </div>
              <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                Standard editorial books target 50–70 CPL. At {columnWidthMm}mm, line sweep matches natural saccadic eye movement.
              </p>
            </div>

            {/* Leading Ratio */}
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex justify-between items-center text-slate-400">
                <span>Leading Proportion:</span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                    auditResult.leadingStatus === 'optimal'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}
                >
                  {auditResult.leadingStatus}
                </span>
              </div>
              <div className="text-base font-bold text-slate-100 font-mono">
                {leadingPt}pt / {bodyPt}pt ({auditResult.leadingRatio}%)
              </div>
              <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                Ideal leading is between 130% and 155% for continuous editorial body text on print papers.
              </p>
            </div>

            {/* Thai 3-Tier Tone Mark Clearance */}
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex justify-between items-center text-slate-400">
                <span>Thai Orthography Clearance:</span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                    auditResult.thaiOrthographyClearance.status === 'safe'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}
                >
                  {auditResult.thaiOrthographyClearance.status}
                </span>
              </div>
              <div className="text-xs font-bold text-slate-200 font-mono">
                Effective: {auditResult.thaiOrthographyClearance.effectiveLeadingPt}pt (+{thaiCompensationPt}pt comp)
              </div>
              <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                {auditResult.thaiOrthographyClearance.message}
              </p>
            </div>

            {/* Dot Gain Tolerance */}
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex justify-between items-center text-slate-400">
                <span>Dot Gain Press Spread:</span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                    auditResult.dotGainVulnerability.status === 'low'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}
                >
                  {auditResult.dotGainVulnerability.status} Risk
                </span>
              </div>
              <div className="text-xs font-bold text-slate-200 font-mono">
                {auditResult.dotGainVulnerability.simulationSpreadPercent}% expected on {paperTexture.toUpperCase()}
              </div>
              <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                {auditResult.dotGainVulnerability.message}
              </p>
            </div>

            {/* Baseline Grid Vertical Alignment Synchronization */}
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1 sm:col-span-2">
              <div className="flex justify-between items-center text-slate-400">
                <span className="flex items-center gap-1.5 font-bold text-slate-300">
                  <Grid className="w-3.5 h-3.5 text-sky-400" />
                  <span>Baseline Grid Vertical Alignment &amp; Phase:</span>
                </span>
                <span
                  className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold uppercase border ${alignmentStatus.badgeClass}`}
                >
                  {alignmentStatus.label}
                </span>
              </div>
              <div className="text-xs font-bold text-slate-200 font-mono flex items-center gap-2">
                <span>Leading {leadingPt}pt on {activeGridPitchPt}pt Grid</span>
                <span className="text-slate-500">•</span>
                <span className={alignmentStatus.driftClass}>{alignmentStatus.driftText}</span>
              </div>
              <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                {alignmentStatus.desc}
              </p>
              <div className="pt-1 flex items-center justify-between">
                <div className="text-[9px] font-mono text-slate-500">
                  Target Prepress Standard: Aligning body leading with project baseline grid ({layoutGridPitch}pt) prevents vertical line collisions across spreads and facing pages.
                </div>
                {alignmentStatus.canSnap && (
                  <button
                    onClick={handleSnapToBaselineGrid}
                    className="px-2.5 py-1 rounded bg-sky-950 hover:bg-sky-900 text-sky-300 text-[10px] font-mono border border-sky-800 transition-colors flex items-center gap-1 shrink-0 ml-2"
                  >
                    <Check className="w-3 h-3 text-sky-400" />
                    <span>Snap to {alignmentStatus.nearestSnapPt}pt</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Editorial Critiques & Recommendations */}
          {auditResult.editorialCritiques.length > 0 ? (
            <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-800/50 space-y-2">
              <div className="flex items-center gap-1.5 text-amber-300 font-bold text-[11px]">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Typographic Tensions &amp; Recommendations</span>
              </div>
              <ul className="space-y-1 text-[10px] text-slate-300 list-disc list-inside">
                {auditResult.editorialCritiques.map((critique, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {critique}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-800/50 flex items-center gap-2 text-emerald-300 text-[11px]">
              <CheckCircle2 className="w-4 h-4" />
              <span>Perfect typographic harmony! All readability parameters, Thai orthographic clearances, and presswork metrics are within optimal tolerances.</span>
            </div>
          )}
        </div>
      )}

      {/* Curated Pairings Directory Tab */}
      {activeTab === 'presets' && (
        <div className="bg-[#0b1017] border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="font-bold text-slate-100 text-xs uppercase">
              Curated Editorial Typographic Formulations
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Tested on 300 DPI Offset Presses
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {FONT_PAIRING_PRESETS.map((preset) => {
              const isSelected = selectedPresetId === preset.id;
              return (
                <div
                  key={preset.id}
                  className={`p-3 rounded-xl border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-sky-950/40 border-sky-500 ring-1 ring-sky-500/50'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-100 text-xs">
                        {preset.name}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-sky-300 font-mono border border-slate-700">
                        {preset.category}
                      </span>
                    </div>

                    <div className="text-[10px] text-amber-300/90 font-mono">
                      {preset.subtitle}
                    </div>

                    <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                      {preset.description}
                    </p>

                    <div className="text-[9px] text-slate-500 pt-1 font-mono">
                      Target: {preset.targetCpl} • Col: {preset.recommendedColumnMm}mm • Base: {preset.defaultBodyPt}pt / {preset.defaultLeadingPt}pt
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      handleSelectPreset(preset);
                      setActiveTab('preview');
                    }}
                    className={`w-full mt-3 py-1.5 px-3 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Active Formulation</span>
                      </>
                    ) : (
                      <span>Load Formulation</span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* AI-Powered Font Pairing Recommender View */}
      {activeTab === 'ai-recommender' && (
        <AiFontRecommenderPanel
          project={project}
          activeHeadlineFont={headlineFontName}
          activeBodyFont={bodyFontName}
          onSelectPairing={handleSelectAiPairing}
        />
      )}

      {/* Action Footer: Apply Typography to Project & Export */}
      <div className="p-3 bg-[#0b1017] border border-slate-800 rounded-xl space-y-2">
        <button
          id="btn-apply-typography-to-project"
          onClick={handleApplyToProject}
          className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-sky-500 via-sky-600 to-sky-500 hover:from-sky-400 hover:to-sky-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 transition-all"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Apply {headlineFontOption.name} / {bodyFontOption.name} to Project</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportSpecs}
            className="flex-1 py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[11px] font-mono flex items-center justify-center gap-1.5 transition-colors"
            title="Download JSON Typographic Spec Sheet"
          >
            <Download className="w-3 h-3 text-sky-400" />
            <span>Export Type Spec Sheet</span>
          </button>

          {onSaveSnapshot && (
            <button
              onClick={() =>
                onSaveSnapshot(
                  `Typography: ${headlineFontOption.name} + ${bodyFontOption.name}`,
                  'Typography Calibration',
                  `Calibrated editorial typography: ${bodyPt}pt body on ${leadingPt}pt leading (+${thaiCompensationPt}pt Thai comp) adhering to baseline grid with ${auditResult.readabilityScore}/100 readability rating.`
                )
              }
              className="py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[11px] font-mono flex items-center justify-center gap-1.5 transition-colors"
              title="Save Project Snapshot with these typography metrics"
            >
              <RotateCcw className="w-3 h-3 text-emerald-400" />
              <span>Snapshot</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
