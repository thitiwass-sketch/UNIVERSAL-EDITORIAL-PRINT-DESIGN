import React from 'react';
import { OSVersion } from '../types/os';
import { SYSTEM_INFO } from '../data/coreOS';
import { useTheme } from '../context/ThemeContext';
import {
  Layers,
  ShieldCheck,
  Sparkles,
  Sliders,
  FileText,
  Cpu,
  Award,
  FileDown,
  Search,
  Keyboard,
  LayoutTemplate,
  Palette,
} from 'lucide-react';

interface HeaderProps {
  currentVersion: OSVersion;
  onVersionChange: (ver: OSVersion) => void;
  activeEnginesCount: number;
  qaScore: number;
  qaStatus: 'PASS' | 'REVISION_REQUIRED' | 'FAIL';
  onOpenPrinciples: () => void;
  onOpenSpecs: () => void;
  onOpenExport: () => void;
  onOpenRegistry: () => void;
  onOpenTemplates: () => void;
  onOpenCommandPalette: () => void;
  onOpenShortcutsHelp: () => void;
  modSymbol: string;
  activeTab: 'canvas' | 'registry' | 'qa' | 'critic' | 'theme';
  onTabChange: (tab: 'canvas' | 'registry' | 'qa' | 'critic' | 'theme') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentVersion,
  onVersionChange,
  activeEnginesCount,
  qaScore,
  qaStatus,
  onOpenPrinciples,
  onOpenSpecs,
  onOpenExport,
  onOpenRegistry,
  onOpenTemplates,
  onOpenCommandPalette,
  onOpenShortcutsHelp,
  modSymbol,
  activeTab,
  onTabChange,
}) => {
  const { themeMode, cycleThemeMode, activeThemeInfo, isHighContrast, isPrintView } = useTheme();

  return (
    <header
      className={`border-b sticky top-0 z-40 px-4 lg:px-6 py-3 transition-colors ${
        isHighContrast
          ? 'bg-black border-b-2 border-yellow-400 text-white'
          : isPrintView
          ? 'bg-white/95 border-b border-slate-200 text-slate-900 backdrop-blur shadow-xs'
          : 'bg-[#0d121a]/95 border-slate-800 text-slate-100 backdrop-blur'
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Brand & Creator Identity */}
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-md border ${
              isHighContrast
                ? 'bg-yellow-400 text-black border-2 border-white'
                : isPrintView
                ? 'bg-blue-600 border-blue-500 shadow-blue-200'
                : 'bg-gradient-to-br from-indigo-600 to-sky-700 shadow-indigo-950/40 border-indigo-500/30'
            }`}
          >
            <Cpu className={`w-5 h-5 ${isHighContrast ? 'text-black' : isPrintView ? 'text-white' : 'text-sky-200'}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1
                className={`text-base sm:text-lg font-bold tracking-tight font-mono flex items-center gap-2 ${
                  isHighContrast
                    ? 'text-white'
                    : isPrintView
                    ? 'text-slate-900'
                    : 'text-white'
                }`}
              >
                UNIVERSAL EDITORIAL &amp; PRINT DESIGN AI OS
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                    isHighContrast
                      ? 'bg-black text-yellow-300 border-2 border-yellow-400 font-bold'
                      : isPrintView
                      ? 'bg-blue-50 text-blue-700 border border-blue-200 font-semibold'
                      : 'bg-indigo-900/60 text-indigo-300 border border-indigo-700/60'
                  }`}
                >
                  {currentVersion}
                </span>
              </h1>
            </div>
            <div className="flex items-center gap-2 text-xs mt-0.5">
              <span
                className={`font-medium flex items-center gap-1 font-thai ${
                  isHighContrast
                    ? 'text-yellow-300 font-bold'
                    : isPrintView
                    ? 'text-blue-700'
                    : 'text-sky-400'
                }`}
              >
                <Award className="w-3.5 h-3.5 text-amber-400" />
                {SYSTEM_INFO.creator.nameTh} ({SYSTEM_INFO.creator.nameEn})
              </span>
              <span className={isPrintView ? 'text-slate-400' : 'text-slate-600'}>•</span>
              <span
                className={`truncate max-w-xs sm:max-w-md ${
                  isHighContrast
                    ? 'text-white'
                    : isPrintView
                    ? 'text-slate-600'
                    : 'text-slate-400'
                }`}
              >
                {SYSTEM_INFO.creator.affiliationEn}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation & Controls */}
        <div className="flex items-center flex-wrap gap-2 w-full md:w-auto justify-between md:justify-end">
          {/* OS Evolution Version Switcher */}
          <div
            className={`flex items-center rounded-lg p-0.5 text-xs font-mono border ${
              isHighContrast
                ? 'bg-black border-2 border-white'
                : isPrintView
                ? 'bg-slate-100 border-slate-200'
                : 'bg-slate-900/90 border-slate-800'
            }`}
          >
            {(['v7.0', 'v8.0', 'v9.0'] as OSVersion[]).map((ver) => (
              <button
                key={ver}
                id={`btn-version-${ver}`}
                onClick={() => onVersionChange(ver)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  currentVersion === ver
                    ? isHighContrast
                      ? 'bg-yellow-400 text-black font-bold shadow-xs'
                      : isPrintView
                      ? 'bg-blue-600 text-white font-semibold shadow-xs'
                      : 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : isHighContrast
                    ? 'text-white hover:text-yellow-300'
                    : isPrintView
                    ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
                title={
                  ver === 'v7.0'
                    ? 'v7.0 Modular AI OS (Foundation)'
                    : ver === 'v8.0'
                    ? 'v8.0 Intelligent Modular AI OS'
                    : 'v9.0 Multi-Engine Collaborative Platform'
                }
              >
                {ver}
              </button>
            ))}
          </div>

          {/* Quick Theme Mode Toggle Button */}
          <button
            id="btn-header-quick-theme-toggle"
            onClick={cycleThemeMode}
            className={`px-2.5 py-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition-colors font-mono shadow-xs ${
              isHighContrast
                ? 'bg-black border-2 border-yellow-400 text-yellow-300 hover:bg-zinc-900'
                : isPrintView
                ? 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-slate-100 hover:border-slate-700'
            }`}
            title={`Active Theme: ${activeThemeInfo.name} (${activeThemeInfo.tagline}). Click to toggle mode.`}
          >
            <Palette
              className={`w-3.5 h-3.5 ${
                isHighContrast
                  ? 'text-yellow-400'
                  : isPrintView
                  ? 'text-blue-600'
                  : 'text-indigo-400'
              }`}
            />
            <span className="hidden sm:inline">Theme:</span>
            <span className="font-semibold">
              {themeMode === 'system-default'
                ? 'Dark'
                : themeMode === 'high-contrast'
                ? 'High-Contrast'
                : 'Print-View'}
            </span>
          </button>

          {/* Command Palette Trigger (Cmd+K) */}
          <button
            id="btn-open-command-palette"
            onClick={onOpenCommandPalette}
            className={`px-2.5 py-1.5 rounded-lg border text-xs flex items-center gap-2 transition-all shadow-sm group ${
              isHighContrast
                ? 'bg-black border-2 border-white text-white hover:border-yellow-400'
                : isPrintView
                ? 'bg-slate-50 border-slate-300 text-slate-800 hover:bg-slate-100'
                : 'bg-slate-900 border-slate-700/80 hover:border-sky-500/60 text-slate-200 hover:bg-slate-800'
            }`}
            title="Open Command Palette (⌘K / Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-sky-400 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Search</span>
            <kbd
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border ${
                isHighContrast
                  ? 'bg-zinc-900 border-white text-yellow-300'
                  : isPrintView
                  ? 'bg-white border-slate-300 text-slate-700'
                  : 'bg-slate-950 border-slate-700 text-sky-300'
              }`}
            >
              {modSymbol}K
            </kbd>
          </button>

          {/* Keyboard Shortcuts Guide Trigger */}
          <button
            id="btn-open-shortcuts-help"
            onClick={onOpenShortcutsHelp}
            className={`p-1.5 rounded-lg border transition-colors ${
              isHighContrast
                ? 'bg-black border-2 border-white text-white hover:text-yellow-300'
                : isPrintView
                ? 'bg-slate-50 border-slate-300 text-slate-600 hover:text-slate-900'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title="Keyboard Shortcuts Cheat Sheet (? or ⌘/)"
          >
            <Keyboard className="w-4 h-4" />
          </button>

          {/* Project Template Selector Trigger */}
          <button
            id="btn-open-template-selector"
            onClick={onOpenTemplates}
            className={`px-2.5 py-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition-colors font-medium shadow-sm ${
              isHighContrast
                ? 'bg-black border-2 border-yellow-400 text-yellow-300 hover:bg-zinc-900'
                : isPrintView
                ? 'bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-800'
                : 'bg-indigo-950/70 border-indigo-700/80 hover:bg-indigo-900/60 text-indigo-200'
            }`}
            title={`Project Template Selector (${modSymbol}T)`}
          >
            <LayoutTemplate className="w-3.5 h-3.5 text-indigo-400" />
            <span>Templates</span>
            <kbd className="hidden lg:inline text-[9px] px-1 rounded bg-slate-950 border border-indigo-900 text-indigo-300 font-mono">
              {modSymbol}T
            </kbd>
          </button>

          {/* Core OS Principles Modal Trigger */}
          <button
            id="btn-open-core-principles"
            onClick={onOpenPrinciples}
            className={`px-2.5 py-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition-colors ${
              isHighContrast
                ? 'bg-black border-2 border-white text-white hover:border-emerald-400'
                : isPrintView
                ? 'bg-slate-50 border-slate-300 text-slate-700 hover:text-slate-900'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
            }`}
            title="Core OS Constitution (⌘⇧O)"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>CORE OS</span>
            <span className="text-[10px] bg-emerald-950 text-emerald-400 px-1 rounded border border-emerald-800/60 font-mono">
              STABLE
            </span>
          </button>

          {/* Active Engines Counter */}
          <button
            id="btn-open-engines-registry"
            onClick={onOpenRegistry}
            className={`px-2.5 py-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition-colors ${
              isHighContrast
                ? 'bg-black border-2 border-white text-white hover:border-cyan-400'
                : isPrintView
                ? 'bg-slate-50 border-slate-300 text-slate-700 hover:text-slate-900'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
            }`}
            title="Engine Registry (⌘R / ⌘2)"
          >
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            <span>Engines</span>
            <span className="text-xs bg-sky-950 text-sky-300 px-1.5 py-0.2 rounded-full border border-sky-800/60 font-mono font-bold">
              {activeEnginesCount}
            </span>
            <kbd className="hidden lg:inline text-[9px] px-1 rounded bg-slate-950 border border-slate-800 text-slate-400 font-mono">
              {modSymbol}R
            </kbd>
          </button>

          {/* QA Gate Badge */}
          <button
            id="btn-open-qa-gate"
            onClick={() => onTabChange('qa')}
            className={`px-2.5 py-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition-colors font-mono ${
              qaStatus === 'PASS'
                ? isHighContrast
                  ? 'bg-black border-2 border-emerald-400 text-emerald-300 hover:bg-zinc-900'
                  : isPrintView
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                  : 'bg-emerald-950/40 border-emerald-700/60 text-emerald-300 hover:bg-emerald-900/40'
                : isHighContrast
                ? 'bg-black border-2 border-amber-400 text-amber-300 hover:bg-zinc-900'
                : isPrintView
                ? 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100'
                : 'bg-amber-950/40 border-amber-700/60 text-amber-300 hover:bg-amber-900/40'
            }`}
            title="100-Point QA Gate (⌘3)"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>QA: {qaScore}/100</span>
            <span className="text-[10px] uppercase font-bold tracking-wider">{qaStatus}</span>
          </button>

          {/* Export Specs */}
          <button
            id="btn-open-specs-sheet"
            onClick={onOpenSpecs}
            className={`px-2.5 py-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition-colors ${
              isHighContrast
                ? 'bg-black border-2 border-white text-white hover:border-yellow-400'
                : isPrintView
                ? 'bg-slate-50 border-slate-300 text-slate-700 hover:text-slate-900'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
            }`}
            title="Prepress Spec Sheet (⌘P)"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Spec Sheet</span>
            <kbd className="hidden lg:inline text-[9px] px-1 rounded bg-slate-950 border border-slate-800 text-slate-400 font-mono">
              {modSymbol}P
            </kbd>
          </button>

          {/* Export Project (PDF Manifest / JSON) */}
          <button
            id="btn-open-export-modal"
            onClick={onOpenExport}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors ${
              isHighContrast
                ? 'bg-yellow-400 hover:bg-yellow-300 text-black border-2 border-white font-bold'
                : isPrintView
                ? 'bg-blue-600 hover:bg-blue-500 text-white'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            }`}
            title="Export Manifest / JSON (⌘E)"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Export</span>
            <kbd
              className={`text-[9px] px-1 py-0.5 rounded font-mono font-bold ${
                isHighContrast
                  ? 'bg-black text-white border border-black'
                  : 'bg-indigo-900/80 border border-indigo-400/40 text-indigo-100'
              }`}
            >
              {modSymbol}E
            </kbd>
          </button>
        </div>
      </div>

      {/* Main View Tabs */}
      <div
        className={`max-w-7xl mx-auto mt-3 flex items-center gap-2 border-t pt-2.5 text-xs font-mono overflow-x-auto ${
          isHighContrast
            ? 'border-white text-white'
            : isPrintView
            ? 'border-slate-200 text-slate-700'
            : 'border-slate-800/70 text-slate-400'
        }`}
      >
        <span
          className={`uppercase tracking-wider text-[11px] mr-1 hidden sm:inline ${
            isHighContrast
              ? 'text-yellow-400 font-bold'
              : isPrintView
              ? 'text-slate-500'
              : 'text-slate-500'
          }`}
        >
          Views:
        </span>
        <button
          id="tab-canvas"
          onClick={() => onTabChange('canvas')}
          className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1.5 shrink-0 ${
            activeTab === 'canvas'
              ? isHighContrast
                ? 'bg-yellow-400 text-black font-bold border-2 border-white'
                : isPrintView
                ? 'bg-blue-600 text-white font-semibold shadow-xs'
                : 'bg-slate-800 text-sky-400 font-semibold border border-slate-700'
              : isHighContrast
              ? 'text-white hover:text-yellow-300'
              : isPrintView
              ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Interactive Canvas &amp; Press Sheet</span>
          <kbd className="text-[9px] px-1 rounded bg-slate-950/80 border border-slate-700/60 text-slate-400 font-mono">
            {modSymbol}1
          </kbd>
        </button>
        <button
          id="tab-registry"
          onClick={() => onTabChange('registry')}
          className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1.5 shrink-0 ${
            activeTab === 'registry'
              ? isHighContrast
                ? 'bg-yellow-400 text-black font-bold border-2 border-white'
                : isPrintView
                ? 'bg-blue-600 text-white font-semibold shadow-xs'
                : 'bg-slate-800 text-sky-400 font-semibold border border-slate-700'
              : isHighContrast
              ? 'text-white hover:text-yellow-300'
              : isPrintView
              ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Engine Registry &amp; Contracts (30+)</span>
          <kbd className="text-[9px] px-1 rounded bg-slate-950/80 border border-slate-700/60 text-slate-400 font-mono">
            {modSymbol}2
          </kbd>
        </button>
        <button
          id="tab-qa"
          onClick={() => onTabChange('qa')}
          className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1.5 shrink-0 ${
            activeTab === 'qa'
              ? isHighContrast
                ? 'bg-yellow-400 text-black font-bold border-2 border-white'
                : isPrintView
                ? 'bg-blue-600 text-white font-semibold shadow-xs'
                : 'bg-slate-800 text-emerald-400 font-semibold border border-slate-700'
              : isHighContrast
              ? 'text-white hover:text-yellow-300'
              : isPrintView
              ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>100-Point QA Gate Dashboard</span>
          <kbd className="text-[9px] px-1 rounded bg-slate-950/80 border border-slate-700/60 text-slate-400 font-mono">
            {modSymbol}3
          </kbd>
        </button>
        <button
          id="tab-critic"
          onClick={() => onTabChange('critic')}
          className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1.5 shrink-0 ${
            activeTab === 'critic'
              ? isHighContrast
                ? 'bg-yellow-400 text-black font-bold border-2 border-white'
                : isPrintView
                ? 'bg-blue-600 text-white font-semibold shadow-xs'
                : 'bg-slate-800 text-amber-400 font-semibold border border-slate-700'
              : isHighContrast
              ? 'text-white hover:text-yellow-300'
              : isPrintView
              ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Design Critic &amp; Anti-Slop Audit</span>
          <kbd className="text-[9px] px-1 rounded bg-slate-950/80 border border-slate-700/60 text-slate-400 font-mono">
            {modSymbol}4
          </kbd>
        </button>
        {/* Core Interface Theme Settings Tab */}
        <button
          id="tab-theme"
          onClick={() => onTabChange('theme')}
          className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1.5 shrink-0 ${
            activeTab === 'theme'
              ? isHighContrast
                ? 'bg-yellow-400 text-black font-bold border-2 border-white shadow-xs'
                : isPrintView
                ? 'bg-blue-600 text-white font-semibold shadow-xs'
                : 'bg-slate-800 text-sky-400 font-semibold border border-slate-700'
              : isHighContrast
              ? 'text-yellow-300 hover:text-white hover:bg-zinc-900'
              : isPrintView
              ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Theme Settings</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded font-sans uppercase font-bold ${
              themeMode === 'high-contrast'
                ? 'bg-black text-yellow-300 border border-yellow-400'
                : themeMode === 'professional-print-view'
                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                : 'bg-slate-950 text-indigo-300 border border-slate-800'
            }`}
          >
            {themeMode === 'system-default'
              ? 'Dark'
              : themeMode === 'high-contrast'
              ? 'AAA'
              : 'Print View'}
          </span>
          <kbd className="text-[9px] px-1 rounded bg-slate-950/80 border border-slate-700/60 text-slate-400 font-mono">
            {modSymbol}5
          </kbd>
        </button>
      </div>
    </header>
  );
};
