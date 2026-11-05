/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { THEME_DEFINITIONS } from '../data/themeDefinitions';
import { ThemeMode } from '../types/theme';
import { useToast } from '../context/ToastContext';
import {
  Palette,
  SunMoon,
  Contrast,
  Check,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Eye,
  Sliders,
  Maximize2,
  FileCheck,
  Zap,
  Info,
  CheckCircle2,
  SlidersHorizontal,
  ArrowRight,
  Sun,
  Moon,
} from 'lucide-react';

interface ThemeSettingsViewProps {
  onSwitchToCanvas: () => void;
}

export const ThemeSettingsView: React.FC<ThemeSettingsViewProps> = ({
  onSwitchToCanvas,
}) => {
  const {
    themeMode,
    setThemeMode,
    activeThemeInfo,
    ambientPrefs,
    updateAmbientPref,
    resetToDefaultTheme,
    isSystemDefault,
    isHighContrast,
    isPrintView,
    themeClasses,
  } = useTheme();

  const { notifySuccess, notifyInfo } = useToast();

  const handleSelectTheme = (mode: ThemeMode) => {
    if (mode === themeMode) return;
    setThemeMode(mode);
    const targetMeta = THEME_DEFINITIONS[mode];
    notifySuccess(
      `Theme Activated: ${targetMeta.name}`,
      `Switched display mode to ${targetMeta.tagline}. UI recalibrated for ${targetMeta.lightingSimulation}.`
    );
  };

  const handleReset = () => {
    resetToDefaultTheme();
    notifyInfo(
      'Theme Reset',
      'Restored System Default studio dark appearance and standard ambient proofing preferences.'
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div
        className={`p-5 sm:p-6 rounded-2xl border transition-colors ${
          isHighContrast
            ? 'bg-black border-2 border-yellow-400 text-white'
            : isPrintView
            ? 'bg-white border-slate-300 text-slate-900 shadow-sm'
            : 'bg-[#0d121a] border-slate-800 text-slate-100'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                isHighContrast
                  ? 'bg-yellow-400 text-black font-bold border-2 border-white'
                  : isPrintView
                  ? 'bg-blue-600 text-white shadow-blue-200'
                  : 'bg-indigo-600 text-white shadow-indigo-950/60 border border-indigo-400/30'
              }`}
            >
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold font-mono tracking-tight">
                  THEME SETTINGS &amp; DISPLAY MODES
                </h2>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-semibold uppercase tracking-wider ${
                    isHighContrast
                      ? 'bg-yellow-400 text-black border border-white'
                      : isPrintView
                      ? 'bg-blue-100 text-blue-800 border border-blue-300'
                      : 'bg-indigo-950 text-indigo-300 border border-indigo-700/60'
                  }`}
                >
                  {activeThemeInfo.badge}
                </span>
              </div>
              <p
                className={`text-xs sm:text-sm mt-1 max-w-2xl font-sans ${
                  isHighContrast
                    ? 'text-yellow-200'
                    : isPrintView
                    ? 'text-slate-600'
                    : 'text-slate-400'
                }`}
              >
                Toggle the core interface between{' '}
                <strong className={isHighContrast ? 'text-white' : isPrintView ? 'text-slate-900' : 'text-slate-200'}>
                  System-Default
                </strong>{' '}
                (Studio Dark),{' '}
                <strong className={isHighContrast ? 'text-white' : isPrintView ? 'text-slate-900' : 'text-slate-200'}>
                  High-Contrast
                </strong>{' '}
                (WCAG AAA maximum acuity), and{' '}
                <strong className={isHighContrast ? 'text-white' : isPrintView ? 'text-slate-900' : 'text-slate-200'}>
                  Professional-Print-View
                </strong>{' '}
                (white background simulating physical D50 daylight proofing lightboxes).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <button
              id="btn-reset-theme-defaults"
              onClick={handleReset}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors flex items-center gap-1.5 ${
                isHighContrast
                  ? 'bg-black border border-white text-white hover:bg-zinc-900'
                  : isPrintView
                  ? 'bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700'
                  : 'bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="Reset theme and ambient preferences to defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <button
              id="btn-theme-view-canvas"
              onClick={onSwitchToCanvas}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors flex items-center gap-1.5 shadow-sm ${
                isHighContrast
                  ? 'bg-yellow-400 hover:bg-yellow-300 text-black font-bold'
                  : isPrintView
                  ? 'bg-blue-600 hover:bg-blue-500 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              <span>Return to Canvas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3 Core Theme Modes Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3
            className={`text-xs font-mono font-bold uppercase tracking-wider ${
              isHighContrast
                ? 'text-yellow-400'
                : isPrintView
                ? 'text-slate-800'
                : 'text-slate-300'
            }`}
          >
            Core Visual Modes (Select to Apply)
          </h3>
          <span
            className={`text-[11px] font-mono ${
              isHighContrast
                ? 'text-white'
                : isPrintView
                ? 'text-slate-500'
                : 'text-slate-500'
            }`}
          >
            Instant real-time recalibration • Persistent session storage
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
          {/* Option 1: System-Default */}
          <div
            id="theme-card-system-default"
            onClick={() => handleSelectTheme('system-default')}
            className={`relative rounded-2xl p-5 border cursor-pointer transition-all flex flex-col justify-between ${
              themeMode === 'system-default'
                ? 'bg-[#0b1017] border-indigo-500 ring-2 ring-indigo-500/40 shadow-lg shadow-indigo-950/40'
                : isHighContrast
                ? 'bg-black border border-white hover:border-yellow-400 opacity-80 hover:opacity-100'
                : isPrintView
                ? 'bg-slate-50 border-slate-300 hover:border-slate-400 text-slate-800'
                : 'bg-[#090d14] border-slate-800/90 hover:border-slate-700 text-slate-300'
            }`}
          >
            <div>
              {/* Badge & Radio Indicator */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/80 font-bold">
                  DEFAULT OS
                </span>
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${
                    themeMode === 'system-default'
                      ? 'bg-indigo-600 border-indigo-400 text-white'
                      : 'border-slate-600 bg-transparent'
                  }`}
                >
                  {themeMode === 'system-default' && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>

              {/* Title & Tagline */}
              <h4 className="text-base font-bold font-mono text-slate-100 flex items-center gap-2">
                <Moon className="w-4 h-4 text-indigo-400" />
                <span>System Default</span>
              </h4>
              <p className="text-xs text-indigo-300/90 font-mono mt-0.5">
                Deep Studio Dark (Engine Default)
              </p>

              <p className="text-xs text-slate-400 mt-2.5 font-sans leading-relaxed">
                The native dark environment engineered for extended design sessions. Minimalist
                slate-800 panels, deep obsidian (#070a0f) workbench, and sapphire telemetry keep visual
                fatigue near zero.
              </p>

              {/* Mini UI Mockup Preview */}
              <div className="mt-4 p-3 rounded-xl bg-[#070a0f] border border-slate-800 text-[11px] font-mono space-y-2">
                <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800 pb-1.5">
                  <span className="text-slate-300 font-bold">Design OS Workspace</span>
                  <span className="text-indigo-400">v8.0</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                  <span className="text-slate-200">Prepress Pipeline: Active</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 text-[9px] border border-indigo-800">
                    TAC: 280%
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 text-[9px] border border-slate-800">
                    ISO 12647
                  </span>
                </div>
              </div>

              {/* Color Swatch Bar */}
              <div className="mt-3 flex items-center gap-1.5">
                <div className="w-5 h-5 rounded bg-[#070a0f] border border-slate-700" title="Background: #070a0f"></div>
                <div className="w-5 h-5 rounded bg-[#0d121a] border border-slate-700" title="Surface: #0d121a"></div>
                <div className="w-5 h-5 rounded bg-[#6366f1] border border-indigo-400" title="Accent: #6366f1"></div>
                <div className="w-5 h-5 rounded bg-[#10b981] border border-emerald-400" title="Success: #10b981"></div>
                <div className="w-5 h-5 rounded bg-[#f1f5f9] border border-slate-300" title="Text: #f1f5f9"></div>
                <span className="text-[10px] font-mono text-slate-500 ml-1">#070a0f Ground</span>
              </div>
            </div>

            {/* Bottom Specs */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">WCAG Contrast:</span>
              <span className="text-emerald-400 font-bold">6.4:1 (AA)</span>
            </div>
          </div>

          {/* Option 2: High Contrast */}
          <div
            id="theme-card-high-contrast"
            onClick={() => handleSelectTheme('high-contrast')}
            className={`relative rounded-2xl p-5 border cursor-pointer transition-all flex flex-col justify-between ${
              themeMode === 'high-contrast'
                ? 'bg-black border-2 border-yellow-400 ring-4 ring-yellow-400/30 shadow-2xl'
                : isHighContrast
                ? 'bg-black border border-white'
                : isPrintView
                ? 'bg-white border-slate-300 hover:border-black text-slate-900'
                : 'bg-[#090d14] border-slate-800 hover:border-yellow-400/80 text-slate-300'
            }`}
          >
            <div>
              {/* Badge & Radio Indicator */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black text-yellow-300 border-2 border-yellow-400 font-bold">
                  WCAG AAA ACCESSIBILITY
                </span>
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-colors ${
                    themeMode === 'high-contrast'
                      ? 'bg-yellow-400 border-white text-black font-bold'
                      : 'border-yellow-400 bg-black'
                  }`}
                >
                  {themeMode === 'high-contrast' && <Check className="w-3.5 h-3.5 stroke-[4]" />}
                </div>
              </div>

              {/* Title & Tagline */}
              <h4 className="text-base font-bold font-mono text-white flex items-center gap-2">
                <Contrast className="w-4 h-4 text-yellow-400" />
                <span>High Contrast</span>
              </h4>
              <p className="text-xs text-yellow-300 font-mono mt-0.5">
                WCAG AAA Accessible (Maximum Acuity)
              </p>

              <p className="text-xs text-zinc-300 mt-2.5 font-sans leading-relaxed">
                Stark pitch-black surfaces (#000000) coupled with pure white text (#ffffff) and vivid
                yellow (#facc15) structural dividers. Designed for maximum accessibility, glare
                resistance, and zero low-contrast text.
              </p>

              {/* Mini UI Mockup Preview */}
              <div className="mt-4 p-3 rounded-xl bg-black border-2 border-yellow-400 text-[11px] font-mono space-y-2">
                <div className="flex items-center justify-between text-[10px] text-white border-b-2 border-white pb-1.5">
                  <span className="text-yellow-300 font-bold">High-Acuity Workspace</span>
                  <span className="text-yellow-400 font-bold">AAA</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 border border-white"></div>
                  <span className="text-white font-bold">Prepress Pipeline: Active</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded bg-black text-yellow-300 text-[9px] border-2 border-yellow-400 font-bold">
                    TAC: 280%
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-black text-cyan-300 text-[9px] border-2 border-cyan-400 font-bold">
                    100/100 QA
                  </span>
                </div>
              </div>

              {/* Color Swatch Bar */}
              <div className="mt-3 flex items-center gap-1.5">
                <div className="w-5 h-5 rounded bg-black border-2 border-white" title="Background: #000000"></div>
                <div className="w-5 h-5 rounded bg-yellow-400 border border-black" title="Accent: #facc15"></div>
                <div className="w-5 h-5 rounded bg-cyan-400 border border-black" title="Highlight: #38bdf8"></div>
                <div className="w-5 h-5 rounded bg-white border border-black" title="Text: #ffffff"></div>
                <div className="w-5 h-5 rounded bg-zinc-900 border border-white" title="Surface: #18181b"></div>
                <span className="text-[10px] font-mono text-yellow-300 ml-1">#000000 Ground</span>
              </div>
            </div>

            {/* Bottom Specs */}
            <div className="mt-4 pt-3 border-t border-yellow-400/60 flex items-center justify-between text-[11px] font-mono">
              <span className="text-yellow-200 font-bold">WCAG Contrast:</span>
              <span className="text-yellow-400 font-bold">19.2:1 (AAA Max)</span>
            </div>
          </div>

          {/* Option 3: Professional Print View (White Background) */}
          <div
            id="theme-card-professional-print-view"
            onClick={() => handleSelectTheme('professional-print-view')}
            className={`relative rounded-2xl p-5 border cursor-pointer transition-all flex flex-col justify-between ${
              themeMode === 'professional-print-view'
                ? 'bg-white border-2 border-blue-600 ring-4 ring-blue-500/20 shadow-xl text-slate-900'
                : isHighContrast
                ? 'bg-black border border-white hover:border-yellow-400 text-white'
                : isPrintView
                ? 'bg-white border-slate-200 hover:border-slate-400 text-slate-900'
                : 'bg-[#090d14] border-slate-800 hover:border-blue-400/80 text-slate-300'
            }`}
          >
            <div>
              {/* Badge & Radio Indicator */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-300 font-bold">
                  PRINT PROOF D50 LIGHTBOX
                </span>
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${
                    themeMode === 'professional-print-view'
                      ? 'bg-blue-600 border-blue-700 text-white'
                      : 'border-slate-400 bg-white'
                  }`}
                >
                  {themeMode === 'professional-print-view' && (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  )}
                </div>
              </div>

              {/* Title & Tagline */}
              <h4 className="text-base font-bold font-mono flex items-center gap-2 text-slate-900">
                <Sun className="w-4 h-4 text-blue-600" />
                <span>Professional Print View</span>
              </h4>
              <p className="text-xs text-blue-700 font-mono mt-0.5">
                White Background (ISO 3664 D50 Lightbox)
              </p>

              <p className="text-xs text-slate-600 mt-2.5 font-sans leading-relaxed">
                Pristine daylight paper ground (#f8fafc) replicating physical pressroom viewing booths.
                Features true deep ink typography (#0f172a) and neutral grey dividers to eliminate
                dark-mode optical distortion during prepress review.
              </p>

              {/* Mini UI Mockup Preview */}
              <div className="mt-4 p-3 rounded-xl bg-slate-100 border border-slate-300 text-[11px] font-mono space-y-2 text-slate-800">
                <div className="flex items-center justify-between text-[10px] text-slate-600 border-b border-slate-300 pb-1.5">
                  <span className="text-slate-900 font-bold">D50 Proofing Booth</span>
                  <span className="text-blue-600 font-bold">5000K</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-600"></div>
                  <span className="text-slate-900 font-medium">Physical Ink Proofing</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[9px] border border-blue-200 font-medium">
                    FOGRA39
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-white text-slate-800 text-[9px] border border-slate-300 font-medium shadow-xs">
                    ISO 3664
                  </span>
                </div>
              </div>

              {/* Color Swatch Bar */}
              <div className="mt-3 flex items-center gap-1.5">
                <div className="w-5 h-5 rounded bg-[#f8fafc] border border-slate-300" title="Background: #f8fafc"></div>
                <div className="w-5 h-5 rounded bg-white border border-slate-300" title="Surface: #ffffff"></div>
                <div className="w-5 h-5 rounded bg-[#2563eb] border border-blue-500" title="Accent: #2563eb"></div>
                <div className="w-5 h-5 rounded bg-[#0f172a] border border-slate-900" title="Text: #0f172a"></div>
                <div className="w-5 h-5 rounded bg-[#cbd5e1] border border-slate-400" title="Divider: #cbd5e1"></div>
                <span className="text-[10px] font-mono text-slate-600 ml-1">#f8fafc White Ground</span>
              </div>
            </div>

            {/* Bottom Specs */}
            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-600">WCAG Contrast:</span>
              <span className="text-blue-700 font-bold">16.1:1 (Ink Standard)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Interactive Proofing Sandbox */}
      <div
        className={`p-5 sm:p-6 rounded-2xl border transition-colors ${
          isHighContrast
            ? 'bg-black border-2 border-yellow-400 text-white'
            : isPrintView
            ? 'bg-white border-slate-300 text-slate-900 shadow-sm'
            : 'bg-[#0d121a] border-slate-800 text-slate-100'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-current/20">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-bold font-mono uppercase tracking-wider">
              Live Proofing Sandbox: {activeThemeInfo.name} Mode
            </h3>
          </div>
          <span className="text-xs font-mono opacity-70">
            Real-time visual rendition of typography, ink swatches, and UI controls
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Typography & Hierarchy Preview */}
          <div className="space-y-4">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider opacity-60 mb-1">
                Headline Typography (Serif &amp; Thai Pairs)
              </div>
              <h4 className="text-xl sm:text-2xl font-bold font-serif leading-tight">
                Siam Classical Prepress Master Specimen
              </h4>
              <p className="text-sm font-thai mt-1 opacity-90 leading-relaxed">
                ระบบปฏิบัติการปัญญาประดิษฐ์เพื่อการจัดหน้าและงานพิมพ์มาตรฐานสากล (ISO 12647-2)
              </p>
            </div>

            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider opacity-60 mb-1">
                Scientific &amp; Prepress Telemetry (Mono)
              </div>
              <div
                className={`p-2.5 rounded-lg font-mono text-xs ${
                  isHighContrast
                    ? 'bg-zinc-950 border border-yellow-400 text-yellow-300'
                    : isPrintView
                    ? 'bg-slate-100 border border-slate-300 text-slate-800'
                    : 'bg-[#080c12] border border-slate-800 text-slate-300'
                }`}
              >
                <div>PROFILE: ISOcoated_v2_300_eci (FOGRA39)</div>
                <div>INK COVERAGE: C:100% M:84% Y:18% K:32% (TAC: 234% &lt; 280%)</div>
                <div>REGISTRATION TOLERANCE: ±0.03mm • ISO 12647-2 PASS</div>
              </div>
            </div>

            {/* CMYK Ink Swatch Chips */}
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider opacity-60 mb-1.5">
                Process Ink Density &amp; Separation Chips
              </div>
              <div className="grid grid-cols-5 gap-2 text-center text-[10px] font-mono font-bold">
                <div className="p-2 rounded bg-cyan-500 text-slate-950 shadow-xs">
                  <div>CYAN</div>
                  <div className="text-[9px] font-normal">100%</div>
                </div>
                <div className="p-2 rounded bg-fuchsia-600 text-white shadow-xs">
                  <div>MAGENTA</div>
                  <div className="text-[9px] font-normal">100%</div>
                </div>
                <div className="p-2 rounded bg-yellow-400 text-slate-950 shadow-xs">
                  <div>YELLOW</div>
                  <div className="text-[9px] font-normal">100%</div>
                </div>
                <div className="p-2 rounded bg-black text-white border border-slate-600 shadow-xs">
                  <div>KEY (K)</div>
                  <div className="text-[9px] font-normal">100%</div>
                </div>
                <div className="p-2 rounded bg-amber-600 text-white shadow-xs">
                  <div>SPOT GOLD</div>
                  <div className="text-[9px] font-normal">PANTONE</div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Controls & Statuses Preview */}
          <div className="space-y-4">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider opacity-60 mb-2">
                Interactive Controls &amp; Buttons
              </div>
              <div className="flex flex-wrap gap-2.5">
                <button
                  type="button"
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all shadow-sm ${
                    isHighContrast
                      ? 'bg-yellow-400 text-black border-2 border-white font-bold'
                      : isPrintView
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-indigo-600 text-white hover:bg-indigo-500'
                  }`}
                >
                  Primary Action Button
                </button>

                <button
                  type="button"
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                    isHighContrast
                      ? 'bg-black text-white border-2 border-white'
                      : isPrintView
                      ? 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  Secondary Action
                </button>

                <button
                  type="button"
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono border ${
                    isHighContrast
                      ? 'bg-black text-cyan-300 border-2 border-cyan-400 font-bold'
                      : isPrintView
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 inline mr-1" />
                  QA 100/100
                </button>
              </div>
            </div>

            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider opacity-60 mb-1.5">
                Input &amp; Search Field Emulation
              </div>
              <div
                className={`flex items-center px-3 py-2 rounded-xl border text-xs font-mono ${
                  isHighContrast
                    ? 'bg-black border-2 border-white text-white'
                    : isPrintView
                    ? 'bg-slate-50 border-slate-300 text-slate-900'
                    : 'bg-slate-900 border-slate-700 text-slate-200'
                }`}
              >
                <span className="opacity-50 mr-2">⌘K</span>
                <span className="opacity-80">/audit --bleed 3.0mm --standard ISO-12647</span>
              </div>
            </div>

            {/* Contrast Ratio Analysis Card */}
            <div
              className={`p-3.5 rounded-xl border ${
                isHighContrast
                  ? 'bg-black border-2 border-yellow-400'
                  : isPrintView
                  ? 'bg-slate-50 border-slate-200'
                  : 'bg-[#090d14] border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Aesthetic &amp; Contrast Cleared
                </span>
                <span className="font-bold text-emerald-500">
                  {activeThemeInfo.wcagContrast}
                </span>
              </div>
              <div className="text-[11px] font-sans opacity-70 mt-1">
                Background {activeThemeInfo.backgroundHex} • Surface {activeThemeInfo.surfaceHex} • Text {activeThemeInfo.textHex}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Comparison Table */}
      <div
        className={`p-5 sm:p-6 rounded-2xl border transition-colors ${
          isHighContrast
            ? 'bg-black border-2 border-white text-white'
            : isPrintView
            ? 'bg-white border-slate-300 text-slate-900 shadow-sm'
            : 'bg-[#0d121a] border-slate-800 text-slate-100'
        }`}
      >
        <div className="flex items-center gap-2 mb-4">
          <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-bold font-mono uppercase tracking-wider">
            Prepress &amp; Ergonomic Specifications Comparison
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr
                className={`border-b ${
                  isHighContrast
                    ? 'border-white text-yellow-300'
                    : isPrintView
                    ? 'border-slate-300 text-slate-700 bg-slate-50'
                    : 'border-slate-800 text-slate-400 bg-slate-900/60'
                }`}
              >
                <th className="p-2.5">Attribute / Standard</th>
                <th className="p-2.5">System Default (Dark)</th>
                <th className="p-2.5">High Contrast (AAA)</th>
                <th className="p-2.5">Professional Print View (White)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-current/10">
              <tr>
                <td className="p-2.5 font-bold">Substrate / Background</td>
                <td className="p-2.5">#070a0f (Deep Obsidian)</td>
                <td className="p-2.5 font-bold">#000000 (Pure Black)</td>
                <td className="p-2.5 font-bold text-blue-600">#f8fafc (Paper White)</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold">Ink / Typography Color</td>
                <td className="p-2.5">#f1f5f9 (Off-White)</td>
                <td className="p-2.5 font-bold">#ffffff (Stark White)</td>
                <td className="p-2.5 font-bold text-blue-600">#0f172a (Offset Ink Black)</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold">WCAG Contrast Rating</td>
                <td className="p-2.5 text-emerald-400">6.4:1 (AA Compliant)</td>
                <td className="p-2.5 text-yellow-400 font-bold">19.2:1 (AAA Exceeded)</td>
                <td className="p-2.5 text-blue-600 font-bold">16.1:1 (Ink Paper Standard)</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold">Lighting Calibration</td>
                <td className="p-2.5">D65 (6500K) Studio</td>
                <td className="p-2.5">High-Ambient / Direct Glare</td>
                <td className="p-2.5 text-blue-600 font-bold">ISO 3664 D50 (5000K Lightbox)</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold">Optimal Use Case</td>
                <td className="p-2.5">Extended layout design</td>
                <td className="p-2.5">Accessibility QA audits</td>
                <td className="p-2.5 text-blue-600 font-bold">Prepress proof &amp; client signoff</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Ambient & Display Proofing Preferences */}
      <div
        className={`p-5 sm:p-6 rounded-2xl border transition-colors ${
          isHighContrast
            ? 'bg-black border-2 border-yellow-400 text-white'
            : isPrintView
            ? 'bg-white border-slate-300 text-slate-900 shadow-sm'
            : 'bg-[#0d121a] border-slate-800 text-slate-100'
        }`}
      >
        <div className="flex items-center gap-2 mb-4">
          <Sliders className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold font-mono uppercase tracking-wider">
            Ambient Proofing &amp; Ergonomic Toggles
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          {/* Toggle 1: D50 Lighting Simulation */}
          <div
            className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
              isHighContrast
                ? 'bg-black border border-white'
                : isPrintView
                ? 'bg-slate-50 border-slate-200'
                : 'bg-[#090d14] border-slate-800'
            }`}
          >
            <div>
              <div className="font-bold flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>ISO 3664 D50 Proofing Booth Emulation</span>
              </div>
              <div className="text-[11px] font-sans opacity-70 mt-0.5">
                Applies calibrated 5000K illuminant white balance to paper substrates.
              </div>
            </div>
            <button
              onClick={() => updateAmbientPref('d50LightingSim', !ambientPrefs.d50LightingSim)}
              className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                ambientPrefs.d50LightingSim
                  ? isHighContrast
                    ? 'bg-yellow-400'
                    : isPrintView
                    ? 'bg-blue-600'
                    : 'bg-indigo-600'
                  : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  ambientPrefs.d50LightingSim ? 'right-1' : 'left-1'
                }`}
              ></div>
            </button>
          </div>

          {/* Toggle 2: High-Visibility Ruler Guides */}
          <div
            className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
              isHighContrast
                ? 'bg-black border border-white'
                : isPrintView
                ? 'bg-slate-50 border-slate-200'
                : 'bg-[#090d14] border-slate-800'
            }`}
          >
            <div>
              <div className="font-bold flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5 text-sky-400" />
                <span>Enhanced Prepress Rulers &amp; Trim Guides</span>
              </div>
              <div className="text-[11px] font-sans opacity-70 mt-0.5">
                Renders heavy millimeter markers on the live physical print sheet.
              </div>
            </div>
            <button
              onClick={() =>
                updateAmbientPref('canvasSurroundRulers', !ambientPrefs.canvasSurroundRulers)
              }
              className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                ambientPrefs.canvasSurroundRulers
                  ? isHighContrast
                    ? 'bg-yellow-400'
                    : isPrintView
                    ? 'bg-blue-600'
                    : 'bg-indigo-600'
                  : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  ambientPrefs.canvasSurroundRulers ? 'right-1' : 'left-1'
                }`}
              ></div>
            </button>
          </div>

          {/* Toggle 3: High-Legibility Typography Smoothing */}
          <div
            className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
              isHighContrast
                ? 'bg-black border border-white'
                : isPrintView
                ? 'bg-slate-50 border-slate-200'
                : 'bg-[#090d14] border-slate-800'
            }`}
          >
            <div>
              <div className="font-bold flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>High-Acuity Font Antialiasing</span>
              </div>
              <div className="text-[11px] font-sans opacity-70 mt-0.5">
                Forces subpixel font smoothing for fine bilingual serif and Thai accents.
              </div>
            </div>
            <button
              onClick={() =>
                updateAmbientPref('highLegibilityFonts', !ambientPrefs.highLegibilityFonts)
              }
              className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                ambientPrefs.highLegibilityFonts
                  ? isHighContrast
                    ? 'bg-yellow-400'
                    : isPrintView
                    ? 'bg-blue-600'
                    : 'bg-indigo-600'
                  : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  ambientPrefs.highLegibilityFonts ? 'right-1' : 'left-1'
                }`}
              ></div>
            </button>
          </div>

          {/* Toggle 4: Reduced Motion / No-Flicker */}
          <div
            className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
              isHighContrast
                ? 'bg-black border border-white'
                : isPrintView
                ? 'bg-slate-50 border-slate-200'
                : 'bg-[#090d14] border-slate-800'
            }`}
          >
            <div>
              <div className="font-bold flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Strict Prepress Stillness (Reduced Motion)</span>
              </div>
              <div className="text-[11px] font-sans opacity-70 mt-0.5">
                Eliminates transition animations and pulses across all interactive controls.
              </div>
            </div>
            <button
              onClick={() => updateAmbientPref('reducedMotion', !ambientPrefs.reducedMotion)}
              className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                ambientPrefs.reducedMotion
                  ? isHighContrast
                    ? 'bg-yellow-400'
                    : isPrintView
                    ? 'bg-blue-600'
                    : 'bg-indigo-600'
                  : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  ambientPrefs.reducedMotion ? 'right-1' : 'left-1'
                }`}
              ></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
