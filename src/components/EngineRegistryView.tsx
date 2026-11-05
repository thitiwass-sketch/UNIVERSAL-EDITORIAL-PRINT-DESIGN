import React, { useState, useMemo } from 'react';
import { ENGINE_REGISTRY } from '../data/engineRegistry';
import { EngineContract, EngineCategory } from '../types/os';
import {
  Layers,
  Search,
  CheckCircle2,
  Sliders,
  ChevronRight,
  ShieldAlert,
  Sparkles,
  ExternalLink,
  Tag,
  Cpu,
  Type,
  ArrowRight,
  Eye,
  Wand2,
  Scale,
  Ruler,
} from 'lucide-react';
import { calculateOptimalKerning } from '../utils/autoKerningOptimizer';
import { AVAILABLE_FONTS } from '../data/typographyPresets';

interface EngineRegistryViewProps {
  activeEngineIds: string[];
  onToggleEngine: (engineId: string) => void;
}

export const EngineRegistryView: React.FC<EngineRegistryViewProps> = ({
  activeEngineIds,
  onToggleEngine,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEngine, setSelectedEngine] = useState<EngineContract>(
    ENGINE_REGISTRY[0]
  );

  // Auto-Kerning Live Workbench State
  const [testHeadline, setTestHeadline] = useState('AVANT-GARDE ARCHITECTURAL MONOGRAPH');
  const [testFontName, setTestFontName] = useState('Plus Jakarta Sans');
  const [testFontWeight, setTestFontWeight] = useState<number>(700);
  const [testFontSizePt, setTestFontSizePt] = useState<number>(36);
  const [testIsUppercase, setTestIsUppercase] = useState<boolean>(true);
  const [testIsReverse, setTestIsReverse] = useState<boolean>(false);

  const isAutoKerningActive = activeEngineIds.includes('ENG_AUTOKERNING');

  const kerningResult = useMemo(() => {
    const fontOpt = AVAILABLE_FONTS.find((f) => f.name === testFontName) || AVAILABLE_FONTS[0];
    return calculateOptimalKerning({
      text: testHeadline,
      fontFamily: fontOpt.family,
      fontCategory: fontOpt.category,
      fontWeight: testFontWeight,
      fontSizePt: testFontSizePt,
      isUppercase: testIsUppercase,
      isReverseType: testIsReverse,
    });
  }, [testHeadline, testFontName, testFontWeight, testFontSizePt, testIsUppercase, testIsReverse]);

  const categories = [
    'all',
    'Editorial',
    'Visual',
    'Academic',
    'Print',
    'International',
    'Creative Intelligence',
    'Future',
  ];

  const filteredEngines = ENGINE_REGISTRY.filter((eng) => {
    const matchesCat =
      selectedCategory === 'all'
        ? true
        : selectedCategory === 'Future'
        ? eng.category.includes('Future')
        : eng.category.toLowerCase().includes(selectedCategory.toLowerCase());

    const matchesSearch =
      eng.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eng.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eng.triggers.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0b1017] border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Layers className="w-6 h-6 text-sky-400" />
              <h2 className="text-xl font-bold text-white font-mono tracking-tight">
                CENTRAL ENGINE REGISTRY &amp; CONTRACT SPECIFICATION
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Independently Versioned Design Engines • Strict Contract Isolation • Dynamic Engine Loading
            </p>
          </div>
          <div className="text-xs font-mono text-slate-300 bg-slate-900 border border-slate-800 p-2.5 rounded-lg">
            <span className="text-slate-500">Registry Count:</span>{' '}
            <span className="text-sky-400 font-bold">{ENGINE_REGISTRY.length} Engines</span>{' '}
            • <span className="text-emerald-400 font-bold">{activeEngineIds.length} Active in Project</span>
          </div>
        </div>

        {/* Auto-Kerning Optimizer Quick-Toggle Ribbon */}
        <div className="mt-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-inner">
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${
                isAutoKerningActive
                  ? 'bg-amber-950/60 border-amber-500/80 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.25)]'
                  : 'bg-slate-900 border-slate-700 text-slate-400'
              }`}
            >
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-100 font-mono">
                  Auto-Kerning Optimizer (ENG_AUTOKERNING)
                </span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold border ${
                    isAutoKerningActive
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                      : 'bg-slate-900 text-slate-500 border-slate-800'
                  }`}
                >
                  {isAutoKerningActive ? 'ACTIVE IN PIPELINE' : 'OFFLINE'}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-sans">
                Calculates optical letter-spacing curves, character-pair kerning, and ink-volume compensation for headlines based on weight and style.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-inspect-autokern-calibrator"
              onClick={() => {
                const autoKernEngine = ENGINE_REGISTRY.find((e) => e.id === 'ENG_AUTOKERNING');
                if (autoKernEngine) setSelectedEngine(autoKernEngine);
              }}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-sky-300 border border-slate-800 text-xs font-mono transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-sky-400" />
              <span>Inspect &amp; Calibrate</span>
            </button>

            <button
              id="btn-toggle-autokerning-option"
              onClick={() => onToggleEngine('ENG_AUTOKERNING')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer ${
                isAutoKerningActive
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                  : 'bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isAutoKerningActive ? 'Auto-Kerning: ENABLED' : 'Enable Auto-Kerning'}</span>
            </button>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="mt-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono">
            {categories.map((cat) => (
              <button
                key={cat}
                id={`filter-cat-${cat.toLowerCase()}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg border whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-sky-950/80 border-sky-600 text-sky-200 font-semibold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat === 'all' ? 'All Engines (30+)' : cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              id="input-search-engines"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search engines or triggers..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout: List & Contract Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Engine List */}
        <div className="lg:col-span-5 space-y-2 max-h-[720px] overflow-y-auto pr-1">
          {filteredEngines.map((eng) => {
            const isActive = activeEngineIds.includes(eng.id);
            const isSelected = selectedEngine.id === eng.id;

            return (
              <div
                key={eng.id}
                id={`engine-card-${eng.id}`}
                onClick={() => setSelectedEngine(eng)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-850 border-sky-500 shadow-md ring-1 ring-sky-500/20'
                    : 'bg-[#0b1017] border-slate-800/90 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isActive ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]' : 'bg-slate-600'
                      }`}
                    ></span>
                    <span className="text-xs font-mono font-bold text-slate-200">
                      {eng.id}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                      {eng.version}
                    </span>
                  </div>

                  {/* Active Toggle Button */}
                  <button
                    id={`toggle-active-${eng.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleEngine(eng.id);
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold transition-colors ${
                      isActive
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
                        : 'bg-slate-900 text-slate-500 border border-slate-800 hover:text-slate-300'
                    }`}
                  >
                    {isActive ? 'ACTIVE' : 'INACTIVE'}
                  </button>
                </div>

                <div className="mt-1.5 text-xs font-medium text-slate-300">
                  {eng.name}
                </div>

                <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span className="text-slate-500">{eng.category}</span>
                  <span className="text-sky-400 truncate max-w-[200px]">
                    {eng.triggers.join(', ')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Engine Contract Inspector */}
        <div className="lg:col-span-7 bg-[#0b1017] border border-slate-800 rounded-2xl p-6 shadow-xl sticky top-24 max-h-[760px] overflow-y-auto">
          {selectedEngine ? (
            <div className="space-y-5 text-xs font-mono">
              {/* Header Details */}
              <div className="pb-4 border-b border-slate-800 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Cpu className="w-5 h-5 text-sky-400" />
                    <h3 className="text-base font-bold text-white">
                      {selectedEngine.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="text-sky-400 font-bold">{selectedEngine.id}</span>
                    <span>•</span>
                    <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                      v{selectedEngine.version}
                    </span>
                    <span>•</span>
                    <span className="text-slate-500">{selectedEngine.category}</span>
                  </div>
                </div>

                <button
                  id="btn-inspect-toggle-active"
                  onClick={() => onToggleEngine(selectedEngine.id)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors ${
                    activeEngineIds.includes(selectedEngine.id)
                      ? 'bg-emerald-950 border-emerald-600 text-emerald-300'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {activeEngineIds.includes(selectedEngine.id)
                    ? 'ACTIVE IN PIPELINE'
                    : '+ LOAD ENGINE'}
                </button>
              </div>

              {/* Engine Triggers */}
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                  Command Triggers:
                </span>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {selectedEngine.triggers.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded bg-sky-950/60 border border-sky-800/60 text-sky-300 font-bold"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Interactive Auto-Kerning Optimizer Sandbox (When ENG_AUTOKERNING is selected) */}
              {selectedEngine.id === 'ENG_AUTOKERNING' && (
                <div className="bg-[#0e1622] border border-amber-500/60 rounded-xl p-4 space-y-4 shadow-xl shadow-amber-950/20">
                  <div className="flex items-center justify-between pb-2 border-b border-amber-900/40">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                        <Wand2 className="w-3.5 h-3.5 text-amber-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-100 text-xs uppercase tracking-wider font-mono">
                          Live Auto-Kerning Optimizer Sandbox
                        </h4>
                        <p className="text-[10px] text-slate-400 font-sans">
                          Test optimal letter-spacing algorithms against real display headlines with instant optical comparison.
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800">
                      Rhythm: {kerningResult.rhythmScore}/100
                    </span>
                  </div>

                  {/* Headline Input & Font Controls */}
                  <div className="space-y-3">
                    {/* Text Field */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 uppercase font-mono">
                        Test Headline Text:
                      </label>
                      <input
                        type="text"
                        value={testHeadline}
                        onChange={(e) => setTestHeadline(e.target.value)}
                        placeholder="Type display headline..."
                        className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-lg px-3 py-1.5 text-xs text-slate-100 font-mono focus:outline-none"
                      />
                    </div>

                    {/* Font & Weight Selector Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[10px]">
                      {/* Font Selector */}
                      <div className="space-y-1">
                        <label className="text-slate-400 uppercase font-mono">Typeface:</label>
                        <select
                          value={testFontName}
                          onChange={(e) => setTestFontName(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 focus:outline-none focus:border-amber-400"
                        >
                          {AVAILABLE_FONTS.map((font) => (
                            <option key={font.id} value={font.name}>
                              {font.name} ({font.category})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Display Size Slider */}
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-slate-400 uppercase font-mono">Display Size:</span>
                          <span className="text-sky-300 font-bold font-mono">{testFontSizePt} pt</span>
                        </div>
                        <input
                          type="range"
                          min={18}
                          max={72}
                          step={2}
                          value={testFontSizePt}
                          onChange={(e) => setTestFontSizePt(parseInt(e.target.value, 10))}
                          className="w-full h-1.5 bg-slate-800 rounded appearance-none accent-amber-400 cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Font Weight Selector Buttons */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-slate-400 uppercase">Optical Weight:</span>
                        <span className="text-amber-300 font-bold">{testFontWeight} Weight</span>
                      </div>
                      <div className="flex items-center gap-1 overflow-x-auto pb-1">
                        {[
                          { w: 300, name: '300 Light' },
                          { w: 400, name: '400 Regular' },
                          { w: 500, name: '500 Medium' },
                          { w: 600, name: '600 SemiBold' },
                          { w: 700, name: '700 Bold' },
                          { w: 800, name: '800 ExtraBold' },
                          { w: 900, name: '900 Black' },
                        ].map(({ w, name }) => (
                          <button
                            key={w}
                            onClick={() => setTestFontWeight(w)}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors shrink-0 ${
                              testFontWeight === w
                                ? 'bg-amber-500 text-slate-950 font-bold'
                                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                            }`}
                          >
                            {name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Toggles Row */}
                    <div className="flex items-center gap-3 pt-1 text-[10px] font-mono">
                      <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                        <input
                          type="checkbox"
                          checked={testIsUppercase}
                          onChange={(e) => setTestIsUppercase(e.target.checked)}
                          className="accent-amber-400 rounded"
                        />
                        <span>All-Caps Expansion (+0.052em)</span>
                      </label>

                      <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                        <input
                          type="checkbox"
                          checked={testIsReverse}
                          onChange={(e) => setTestIsReverse(e.target.checked)}
                          className="accent-amber-400 rounded"
                        />
                        <span>Reverse / Knockout (+0.015em)</span>
                      </label>
                    </div>
                  </div>

                  {/* Live Visual Side-by-Side Comparison */}
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono flex items-center justify-between">
                      <span>Optical Spacing Comparison:</span>
                      <span className="text-emerald-400 font-bold">
                        +{kerningResult.opticalGainPercent}% Readability Gain
                      </span>
                    </div>

                    {/* Unadjusted */}
                    <div
                      className={`p-3 rounded-lg border text-left relative overflow-hidden transition-colors ${
                        testIsReverse ? 'bg-[#0a0d12] text-slate-100 border-slate-800' : 'bg-[#f4f2eb] text-slate-900 border-slate-300'
                      }`}
                    >
                      <div className="text-[9px] font-mono opacity-60 uppercase mb-1 flex items-center justify-between">
                        <span>1. Unadjusted Default Tracking (0.00em)</span>
                        <span className="text-amber-600 font-bold">Raw Metrics</span>
                      </div>
                      <div
                        className="truncate leading-tight select-none"
                        style={{
                          fontFamily: AVAILABLE_FONTS.find((f) => f.name === testFontName)?.family,
                          fontWeight: testFontWeight,
                          fontSize: `${Math.min(testFontSizePt, 32)}px`,
                          letterSpacing: '0em',
                          textTransform: testIsUppercase ? 'uppercase' : 'none',
                        }}
                      >
                        {testHeadline || 'Sample Headline'}
                      </div>
                    </div>

                    {/* Optimized */}
                    <div
                      className={`p-3 rounded-lg border-2 text-left relative overflow-hidden transition-colors border-emerald-500/80 shadow-md ${
                        testIsReverse ? 'bg-[#0a0d12] text-slate-100 shadow-emerald-950/20' : 'bg-[#f4f2eb] text-slate-900'
                      }`}
                    >
                      <div className="text-[9px] font-mono uppercase mb-1 flex items-center justify-between text-emerald-400 font-bold">
                        <span>2. Auto-Kerning Optimized ({kerningResult.cssLetterSpacing})</span>
                        <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                          ✓ Stem-Aperture Balanced
                        </span>
                      </div>
                      <div
                        className="truncate leading-tight select-none"
                        style={{
                          fontFamily: AVAILABLE_FONTS.find((f) => f.name === testFontName)?.family,
                          fontWeight: testFontWeight,
                          fontSize: `${Math.min(testFontSizePt, 32)}px`,
                          letterSpacing: kerningResult.cssLetterSpacing,
                          textTransform: testIsUppercase ? 'uppercase' : 'none',
                        }}
                      >
                        {testHeadline || 'Sample Headline'}
                      </div>
                    </div>
                  </div>

                  {/* Optical Formula Breakdown Card */}
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-900 space-y-1.5 text-[10px] font-mono">
                    <div className="flex justify-between items-center text-slate-400">
                      <span>Formula Breakdown:</span>
                      <strong className="text-sky-300">{kerningResult.optimalTrackingEm} em</strong>
                    </div>
                    <div className="text-slate-300 text-[9px] break-all bg-slate-900/80 p-1.5 rounded">
                      {kerningResult.formulaString}
                    </div>
                    <p className="text-[10px] text-slate-400 font-sans leading-relaxed pt-1">
                      {kerningResult.explanation}
                    </p>

                    {/* Detected Kerning Pairs */}
                    {kerningResult.detectedKerningPairs.length > 0 && (
                      <div className="pt-1.5 border-t border-slate-900 space-y-1">
                        <span className="text-slate-500 uppercase text-[9px]">
                          Detected Kerning Pairs in Headline:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {kerningResult.detectedKerningPairs.map((p, i) => (
                            <span
                              key={i}
                              className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-sky-300 text-[9px]"
                              title={`${p.description} (${p.deltaEm}em)`}
                            >
                              <strong>{p.pair}</strong>: {p.deltaEm}em
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Contract Specifications Table */}
              <div className="space-y-4 pt-2">
                {/* Inputs */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-900">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1.5">
                    Engine Contract Inputs:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {selectedEngine.inputs.map((inp: string) => (
                      <span
                        key={inp}
                        className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 text-[11px]"
                      >
                        {inp}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Hard Rules */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-900">
                  <div className="text-[10px] text-amber-400 uppercase tracking-wider font-bold mb-1.5 flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" />
                    <span>Hard Inviolable Rules:</span>
                  </div>
                  <ul className="space-y-1 text-[11px] text-slate-300">
                    {selectedEngine.rules.map((r: string, i: number) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Parameters */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-900">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1.5">
                    Configurable Parameters:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(selectedEngine.parameters).map(([key, val]) => (
                      <span
                        key={key}
                        className="px-2 py-0.5 rounded bg-slate-900 text-sky-300 text-[11px]"
                      >
                        {key}: {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Dependencies */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-900">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1.5">
                    Engine Dependencies:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {selectedEngine.dependencies && selectedEngine.dependencies.length > 0 ? (
                      selectedEngine.dependencies.map((dep: string) => (
                        <span
                          key={dep}
                          className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 text-[11px] font-bold"
                        >
                          {dep}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-500 text-[11px]">
                        Standalone Engine (No upstream dependencies)
                      </span>
                    )}
                  </div>
                </div>

                {/* Internal Pipeline Process */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-900">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1.5">
                    Algorithmic Process:
                  </div>
                  <ol className="space-y-1 text-[11px] text-slate-300 list-decimal list-inside">
                    {selectedEngine.process.map((step: string, i: number) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>

                {/* QA Requirements */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-900">
                  <div className="text-[10px] text-emerald-400 uppercase tracking-wider font-bold mb-1.5">
                    Engine QA Gate Criteria:
                  </div>
                  <ul className="space-y-1 text-[11px] text-slate-300">
                    {selectedEngine.qaRequirements.map((req: string, i: number) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-slate-500 font-mono">
              Select an engine from the directory to inspect its contract.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
