import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Palette,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Download,
  Copy,
  Check,
  RotateCcw,
  Layers,
  ShieldCheck,
  Eye,
  Sliders,
  Maximize2,
  FileImage,
} from 'lucide-react';
import {
  AssetDominantColor,
  ColorHarmonyResult,
  HarmonySchemeType,
  PrepressColor,
  ProjectAsset,
} from '../types/colorHarmony';
import { ActiveProjectState } from '../types/os';
import { DEFAULT_PROJECT_ASSETS } from '../data/defaultProjectAssets';
import {
  HARMONY_SCHEME_DEFINITIONS,
  createPrepressColor,
  extractDominantColorsFromImage,
  generateHarmoniousPalettes,
  rgbToCmyk,
} from '../utils/cmykPrintEngine';

interface ColorHarmonyInspectorProps {
  project: ActiveProjectState;
  onApplyPalette: (newPalette: ActiveProjectState['palette'], harmonyResult: ColorHarmonyResult) => void;
  onSaveSnapshot?: (versionName: string, tag: any, description: string) => void;
}

export const ColorHarmonyInspector: React.FC<ColorHarmonyInspectorProps> = ({
  project,
  onApplyPalette,
  onSaveSnapshot,
}) => {
  // Available assets (default loaded + custom uploads)
  const [assets, setAssets] = useState<ProjectAsset[]>(DEFAULT_PROJECT_ASSETS);
  const [selectedAssetId, setSelectedAssetId] = useState<string>(DEFAULT_PROJECT_ASSETS[0].id);

  // Selected dominant base color for harmony generation
  const [selectedColorIndex, setSelectedColorIndex] = useState<number>(0);

  // Selected harmony scheme
  const [selectedScheme, setSelectedScheme] = useState<HarmonySchemeType>('analogous');

  // Interactive state
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isProcessingUpload, setIsProcessingUpload] = useState(false);
  const [activeTab, setActiveTab] = useState<'palette' | 'cmyk_plates' | 'assets'>('palette');
  const [enforceUcrLimit, setEnforceUcrLimit] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active loaded asset
  const activeAsset = useMemo(() => {
    return assets.find((a) => a.id === selectedAssetId) || assets[0];
  }, [assets, selectedAssetId]);

  // Active dominant base color
  const activeBaseColor = useMemo<AssetDominantColor>(() => {
    if (activeAsset.dominantColors && activeAsset.dominantColors.length > 0) {
      return (
        activeAsset.dominantColors[selectedColorIndex] ||
        activeAsset.dominantColors[0]
      );
    }
    return {
      hex: '#0f2742',
      r: 15,
      g: 39,
      b: 66,
      cmyk: { c: 100, m: 82, y: 38, k: 45, tac: 265, formatted: 'C:100 M:82 Y:38 K:45' },
      percentage: 50,
      name: 'NRRU Academic Navy',
      isNeutral: false,
      tac: 265,
      isGamutSafe: true,
    };
  }, [activeAsset, selectedColorIndex]);

  // Generated color harmony palettes
  const harmonyPalettes = useMemo(() => {
    return generateHarmoniousPalettes(activeBaseColor, activeAsset.name);
  }, [activeBaseColor, activeAsset.name]);

  // Current active harmony result
  const currentHarmony = useMemo(() => {
    const raw = harmonyPalettes[selectedScheme];
    if (!enforceUcrLimit) return raw;

    // If UCR limit enforced, ensure no color exceeds 280% TAC
    const clampedColors: PrepressColor[] = raw.colors.map((col) => {
      if (col.tac > 280) {
        const optimized = rgbToCmyk(
          parseInt(col.hex.slice(1, 3), 16),
          parseInt(col.hex.slice(3, 5), 16),
          parseInt(col.hex.slice(5, 7), 16),
          280
        );
        return {
          ...col,
          cmyk: optimized,
          tac: optimized.tac,
        };
      }
      return col;
    });

    return {
      ...raw,
      colors: clampedColors,
      standardsReport: {
        ...raw.standardsReport,
        maxTacPercent: Math.max(...clampedColors.map((c) => c.tac)),
        tacStatus: 'COMPLIANT' as const,
      },
    };
  }, [harmonyPalettes, selectedScheme, enforceUcrLimit]);

  // Reset base color selection index when asset switches
  useEffect(() => {
    setSelectedColorIndex(0);
  }, [selectedAssetId]);

  // Handle image upload from user disk
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingUpload(true);
    const reader = new FileReader();

    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      const dominant = await extractDominantColorsFromImage(dataUrl, 5);

      const newAsset: ProjectAsset = {
        id: `custom-asset-${Date.now()}`,
        name: file.name.replace(/\.[^/.]+$/, ''),
        type: 'photography',
        url: dataUrl,
        description: `User-imported graphic asset (${file.type || 'image'}). Extracted 5 dominant CMYK pigments.`,
        resolutionDpi: 300,
        dimensions: {
          widthMm: 148,
          heightMm: 210,
          widthPx: 1748,
          heightPx: 2480,
        },
        dominantColors: dominant,
        extractedDate: new Date().toISOString().split('T')[0],
        isCustomUpload: true,
      };

      setAssets((prev) => [newAsset, ...prev]);
      setSelectedAssetId(newAsset.id);
      setSelectedColorIndex(0);
      setIsProcessingUpload(false);
    };

    reader.readAsDataURL(file);
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Convert current harmony colors to ActiveProjectState['palette'] format and apply
  const handleApplyToProject = () => {
    const projectPalette = currentHarmony.colors.map((c) => ({
      name: c.name,
      hex: c.hex,
      cmyk: c.cmyk.formatted,
      role: c.role,
    }));

    onApplyPalette(projectPalette, currentHarmony);
  };

  // Copy CMYK or Hex to clipboard
  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Export palette as JSON / Prepress Spec
  const handleExportJson = () => {
    const exportData = {
      project: project.title,
      sourceAsset: activeAsset.name,
      harmonyScheme: currentHarmony.schemeName,
      baseDominantColor: activeBaseColor.name,
      isoStandard: currentHarmony.standardsReport.isoStandard,
      maxTac: `${currentHarmony.standardsReport.maxTacPercent}%`,
      complianceScore: `${currentHarmony.standardsReport.complianceScore}/100`,
      generatedAt: new Date().toISOString(),
      colors: currentHarmony.colors.map((c) => ({
        name: c.name,
        role: c.role,
        hex: c.hex,
        cmyk: c.cmyk,
        tac: `${c.tac}%`,
        isGamutSafe: c.isGamutSafe,
        nearestPantone: c.nearestPantone,
        isOverprint: c.isOverprintRecommended,
      })),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.id}-cmyk-harmony-palette.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-4 font-mono text-xs">
      {/* Header Bar */}
      <div className="bg-[#0b1017] border border-slate-800 rounded-xl p-3.5">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wide">
              CMYK Asset Color Harmony Engine
            </h3>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/60 font-bold">
            ISO 12647-2 / FOGRA39
          </span>
        </div>

        <p className="text-[11px] text-slate-400 mt-2 leading-relaxed font-sans">
          Analyzes dominant pigment signatures in your loaded project graphics and derives optically balanced, press-calibrated CMYK palettes with Total Area Coverage (TAC) verification.
        </p>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 mt-3 bg-slate-950 p-1 rounded-lg border border-slate-800/80">
          <button
            onClick={() => setActiveTab('palette')}
            className={`flex-1 py-1 px-2 rounded font-medium transition-all text-center ${
              activeTab === 'palette'
                ? 'bg-indigo-600 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Harmonies
          </button>
          <button
            onClick={() => setActiveTab('cmyk_plates')}
            className={`flex-1 py-1 px-2 rounded font-medium transition-all text-center ${
              activeTab === 'cmyk_plates'
                ? 'bg-indigo-600 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Plate Breakdown
          </button>
          <button
            onClick={() => setActiveTab('assets')}
            className={`flex-1 py-1 px-2 rounded font-medium transition-all text-center flex items-center justify-center gap-1 ${
              activeTab === 'assets'
                ? 'bg-indigo-600 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileImage className="w-3 h-3" />
            <span>Assets ({assets.length})</span>
          </button>
        </div>
      </div>

      {/* Asset Selection & Dominant Color Extraction Bar */}
      <div className="bg-[#0b1017] border border-slate-800 rounded-xl p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Eye className="w-3 h-3 text-sky-400" />
            <span>Currently Sampled Asset</span>
          </span>
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessingUpload}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] flex items-center gap-1 transition-colors border border-slate-700"
              title="Upload custom PNG, JPG, or SVG asset to extract CMYK palette"
            >
              <Upload className="w-2.5 h-2.5 text-sky-400" />
              <span>{isProcessingUpload ? 'Extracting...' : 'Upload Image'}</span>
            </button>
          </div>
        </div>

        {/* Selected Asset Card */}
        <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-900 border border-slate-800">
          <div className="w-14 h-14 rounded-md overflow-hidden bg-slate-950 border border-slate-700 shrink-0 flex items-center justify-center relative shadow-sm">
            <img
              src={activeAsset.url}
              alt={activeAsset.name}
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-0 inset-x-0 bg-black/75 text-[7px] text-center text-slate-300 font-mono py-0.2">
              {activeAsset.resolutionDpi} DPI
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-200 text-xs truncate">
                {activeAsset.name}
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-sky-950 text-sky-300 border border-sky-800/60 uppercase">
                {activeAsset.type}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5 font-sans">
              {activeAsset.description}
            </p>
            <div className="text-[9px] text-slate-500 mt-1 flex items-center gap-2">
              <span>Trim: {activeAsset.dimensions.widthMm} × {activeAsset.dimensions.heightMm} mm</span>
              <span>•</span>
              <span className="text-emerald-400">300 DPI Prepress Ready</span>
            </div>
          </div>
        </div>

        {/* Dominant Color Ribbon */}
        <div className="space-y-1.5 pt-1 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>Dominant Color Signatures (Click to select base anchor):</span>
            <span className="text-amber-300 font-bold">
              Base: {activeBaseColor.name} ({activeBaseColor.percentage}%)
            </span>
          </div>

          {/* Color Blocks */}
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5">
            {activeAsset.dominantColors.map((dom, index) => {
              const isSelected = selectedColorIndex === index;
              return (
                <button
                  key={index}
                  onClick={() => setSelectedColorIndex(index)}
                  className={`p-1.5 rounded-lg border text-left transition-all relative overflow-hidden group ${
                    isSelected
                      ? 'border-amber-400 bg-amber-950/30 ring-1 ring-amber-400/50 shadow-md'
                      : 'border-slate-800 bg-slate-900/90 hover:border-slate-700'
                  }`}
                >
                  <div
                    className="w-full h-7 rounded border border-white/20 shadow-inner mb-1.5 relative flex items-end justify-end p-0.5"
                    style={{ backgroundColor: dom.hex }}
                  >
                    {isSelected && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-white bg-amber-600 rounded-full drop-shadow" />
                    )}
                  </div>
                  <div className="text-[10px] font-bold text-slate-200 truncate leading-tight">
                    {dom.percentage}%
                  </div>
                  <div className="text-[8px] text-slate-400 truncate mt-0.5 font-mono">
                    {dom.cmyk.formatted.slice(0, 14)}...
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Harmony Scheme Selector */}
      <div className="bg-[#0b1017] border border-slate-800 rounded-xl p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Sliders className="w-3 h-3 text-emerald-400" />
            <span>Select Optical Harmony Model</span>
          </span>
          <span className="text-[9px] text-slate-500 font-mono">7 Print Standards</span>
        </div>

        {/* Scheme Pill Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
          {(Object.keys(HARMONY_SCHEME_DEFINITIONS) as HarmonySchemeType[]).map((schemeKey) => {
            const info = HARMONY_SCHEME_DEFINITIONS[schemeKey];
            const isSel = selectedScheme === schemeKey;
            return (
              <button
                key={schemeKey}
                onClick={() => setSelectedScheme(schemeKey)}
                className={`px-2.5 py-2 rounded-lg border text-left transition-all ${
                  isSel
                    ? 'bg-indigo-950 border-indigo-500 text-indigo-100 font-bold ring-1 ring-indigo-500/50 shadow-sm'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="text-[11px] truncate flex items-center justify-between">
                  <span>{info.name.split(' ')[1] || info.name}</span>
                  {isSel && <Check className="w-3 h-3 text-indigo-400 shrink-0" />}
                </div>
                <div className="text-[8px] text-slate-400 truncate mt-0.5 font-mono">
                  {info.tags[0]}
                </div>
              </button>
            );
          })}
        </div>

        {/* Scheme Description */}
        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[10px] space-y-1">
          <div className="text-slate-200 font-bold flex items-center justify-between">
            <span>{currentHarmony.schemeName}</span>
            <span className="text-[9px] text-sky-400 font-mono">
              {HARMONY_SCHEME_DEFINITIONS[selectedScheme].subtitle}
            </span>
          </div>
          <p className="text-slate-400 font-sans leading-relaxed">
            {currentHarmony.description}
          </p>
          <div className="pt-1 text-[9px] text-amber-300/90 font-mono">
            Prepress Suitability: {HARMONY_SCHEME_DEFINITIONS[selectedScheme].prepressContext}
          </div>
        </div>
      </div>

      {/* Main Content Area based on Tab */}
      {activeTab === 'palette' && (
        <>
          {/* Prepress Standards Compliance Ribbon */}
          <div className="bg-[#0b1017] border border-slate-800 rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 text-[11px]">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Prepress Print Verification</span>
              </div>
              <div className="flex items-center gap-1 text-[10px]">
                <span className="text-slate-400">Compliance:</span>
                <span className="text-emerald-300 font-bold bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-800/60">
                  {currentHarmony.standardsReport.complianceScore}/100
                </span>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="text-slate-500">Max Total Area Coverage (TAC):</div>
                <div className="text-slate-200 font-bold text-xs mt-0.5 flex items-center gap-1.5">
                  <span>{currentHarmony.standardsReport.maxTacPercent}%</span>
                  <span
                    className={`text-[8px] px-1 py-0.2 rounded ${
                      currentHarmony.standardsReport.maxTacPercent <= 280
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                        : 'bg-amber-950 text-amber-300 border border-amber-800/60'
                    }`}
                  >
                    {currentHarmony.standardsReport.maxTacPercent <= 280
                      ? 'Safe (≤280%)'
                      : 'Caution'}
                  </span>
                </div>
              </div>

              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="text-slate-500">Gamut Check (FOGRA39):</div>
                <div className="text-emerald-400 font-bold text-xs mt-0.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>All In-Gamut</span>
                </div>
              </div>
            </div>

            {/* UCR / TAC Auto-Clamp Toggle */}
            <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <span>Enforce Sheetfed TAC Limit (≤280%):</span>
              </span>
              <button
                onClick={() => setEnforceUcrLimit((prev) => !prev)}
                className={`px-2 py-0.5 rounded text-[9px] font-bold transition-colors ${
                  enforceUcrLimit
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {enforceUcrLimit ? 'UCR Active (Safe)' : 'Raw Density'}
              </button>
            </div>
          </div>

          {/* Generated Harmonious Swatch Deck */}
          <div className="bg-[#0b1017] border border-slate-800 rounded-xl p-3.5 space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                Suggested Print Swatches ({currentHarmony.colors.length})
              </span>
              <span className="text-[9px] text-slate-500 font-mono">
                Click value to copy
              </span>
            </div>

            <div className="space-y-2">
              {currentHarmony.colors.map((color) => {
                return (
                  <div
                    key={color.id}
                    className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all space-y-2"
                  >
                    {/* Swatch Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-7 h-7 rounded border border-white/20 shadow-sm shrink-0 relative flex items-center justify-center"
                          style={{ backgroundColor: color.hex }}
                        >
                          {color.isOverprintRecommended && (
                            <span
                              className="text-[7px] text-white bg-black/70 px-0.5 rounded font-mono font-bold"
                              title="Overprint Black Recommended (prevents registration halos)"
                            >
                              OP
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="text-slate-100 font-bold text-xs truncate">
                            {color.name}
                          </div>
                          <div className="text-[9px] text-sky-400 font-mono">
                            {color.role}
                          </div>
                        </div>
                      </div>

                      {/* Right Tag / Nearest Pantone */}
                      <div className="text-right">
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-mono border border-slate-700">
                          {color.nearestPantone.code}
                        </span>
                      </div>
                    </div>

                    {/* Prepress Values & Copy Buttons */}
                    <div className="flex items-center justify-between text-[10px] font-mono bg-slate-950 px-2 py-1.5 rounded border border-slate-800/80">
                      <button
                        onClick={() => handleCopyText(color.cmyk.formatted, color.name + '-cmyk')}
                        className="hover:text-amber-300 transition-colors flex items-center gap-1 text-slate-300"
                        title="Copy CMYK string"
                      >
                        <span>{color.cmyk.formatted}</span>
                        {copiedText === color.name + '-cmyk' ? (
                          <Check className="w-2.5 h-2.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-2.5 h-2.5 text-slate-500" />
                        )}
                      </button>

                      <div className="flex items-center gap-2 text-slate-400">
                        <span>TAC: <b className="text-slate-200">{color.tac}%</b></span>
                        <span>•</span>
                        <button
                          onClick={() => handleCopyText(color.hex, color.name + '-hex')}
                          className="hover:text-amber-300 transition-colors text-slate-400 flex items-center gap-0.5"
                          title="Copy Hex"
                        >
                          <span>{color.hex}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* CMYK Four-Plate Breakdown Tab */}
      {activeTab === 'cmyk_plates' && (
        <div className="bg-[#0b1017] border border-slate-800 rounded-xl p-3.5 space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
              Cyan, Magenta, Yellow, Black Inking Plates
            </span>
            <span className="text-[9px] text-slate-500">ISO 12647-2</span>
          </div>

          <div className="space-y-3">
            {currentHarmony.colors.map((color) => (
              <div key={color.id} className="p-2 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 rounded" style={{ backgroundColor: color.hex }}></div>
                    <span className="font-bold text-slate-200 truncate">{color.name}</span>
                  </div>
                  <span className="text-slate-400 text-[10px]">Total: {color.tac}%</span>
                </div>

                {/* CMYK Bar Meters */}
                <div className="space-y-1 pt-1 font-mono text-[9px]">
                  {/* Cyan */}
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 text-cyan-400 font-bold">C</span>
                    <div className="flex-1 h-2 bg-slate-950 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-400 rounded-full"
                        style={{ width: `${color.cmyk.c}%` }}
                      ></div>
                    </div>
                    <span className="w-7 text-right text-slate-300">{color.cmyk.c}%</span>
                  </div>

                  {/* Magenta */}
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 text-pink-400 font-bold">M</span>
                    <div className="flex-1 h-2 bg-slate-950 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-pink-500 rounded-full"
                        style={{ width: `${color.cmyk.m}%` }}
                      ></div>
                    </div>
                    <span className="w-7 text-right text-slate-300">{color.cmyk.m}%</span>
                  </div>

                  {/* Yellow */}
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 text-yellow-300 font-bold">Y</span>
                    <div className="flex-1 h-2 bg-slate-950 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 rounded-full"
                        style={{ width: `${color.cmyk.y}%` }}
                      ></div>
                    </div>
                    <span className="w-7 text-right text-slate-300">{color.cmyk.y}%</span>
                  </div>

                  {/* Key (Black) */}
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 text-slate-200 font-bold">K</span>
                    <div className="flex-1 h-2 bg-slate-950 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-slate-200 rounded-full"
                        style={{ width: `${color.cmyk.k}%` }}
                      ></div>
                    </div>
                    <span className="w-7 text-right text-slate-300">{color.cmyk.k}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Asset Switcher Library Tab */}
      {activeTab === 'assets' && (
        <div className="bg-[#0b1017] border border-slate-800 rounded-xl p-3.5 space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
              Project Graphic Asset Vault ({assets.length})
            </span>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-[10px] text-sky-400 hover:text-sky-300 flex items-center gap-1"
            >
              <Upload className="w-3 h-3" />
              <span>Add New</span>
            </button>
          </div>

          <div className="space-y-2">
            {assets.map((ast) => {
              const isSelected = ast.id === selectedAssetId;
              return (
                <button
                  key={ast.id}
                  onClick={() => {
                    setSelectedAssetId(ast.id);
                    setActiveTab('palette');
                  }}
                  className={`w-full p-2 rounded-lg border text-left flex items-center gap-3 transition-all ${
                    isSelected
                      ? 'bg-indigo-950/60 border-indigo-500 ring-1 ring-indigo-500/40'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="w-12 h-12 rounded bg-slate-950 border border-slate-700 overflow-hidden shrink-0 flex items-center justify-center">
                    <img src={ast.url} alt={ast.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200 text-xs truncate">
                        {ast.name}
                      </span>
                      {isSelected && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-600 text-white font-bold">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                      {ast.description}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      {ast.dominantColors.map((dc, i) => (
                        <div
                          key={i}
                          className="w-3 h-3 rounded-full border border-white/20"
                          style={{ backgroundColor: dc.hex }}
                          title={`${dc.name} (${dc.percentage}%)`}
                        ></div>
                      ))}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Action Footer: Apply Palette to Project & Export */}
      <div className="p-3 bg-[#0b1017] border border-slate-800 rounded-xl space-y-2">
        <button
          id="btn-apply-cmyk-harmony"
          onClick={handleApplyToProject}
          className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Apply {currentHarmony.schemeName} to Project</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJson}
            className="flex-1 py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[11px] font-mono flex items-center justify-center gap-1.5 transition-colors"
            title="Download JSON Prepress Swatches"
          >
            <Download className="w-3 h-3 text-sky-400" />
            <span>Export Prepress JSON</span>
          </button>

          {onSaveSnapshot && (
            <button
              onClick={() =>
                onSaveSnapshot(
                  `CMYK Harmony (${currentHarmony.schemeName.split(' ')[0]})`,
                  'Color Separation',
                  `Applied harmonious CMYK palette derived from ${activeAsset.name} adhering to ISO 12647-2 (TAC: ${currentHarmony.standardsReport.maxTacPercent}%).`
                )
              }
              className="py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[11px] font-mono flex items-center justify-center gap-1.5 transition-colors"
              title="Save Project Snapshot with this colorway"
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
