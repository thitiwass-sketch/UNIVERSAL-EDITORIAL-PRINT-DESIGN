import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Activity,
  Cpu,
  HardDrive,
  Zap,
  RefreshCw,
  ChevronUp,
  ChevronDown,
  Layers,
  Sparkles,
  Server,
  Gauge,
  CheckCircle2,
  AlertTriangle,
  X,
} from 'lucide-react';
import { ENGINE_REGISTRY } from '../data/engineRegistry';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';

interface EnginePerformanceWidgetProps {
  activeEngineIds: string[];
  osVersion?: string;
  isPipelineRunning?: boolean;
}

interface EngineResourceProfile {
  id: string;
  name: string;
  category: string;
  baseMemoryMb: number;
  baseCpuPercent: number;
  threadMode: 'WORKER_THREAD' | 'GPU_ACCELERATED' | 'ASYNC_RESOLVER' | 'SYNCHRONOUS_CORE';
  cacheState: 'CACHED' | 'ACTIVE_PIPELINE' | 'IDLE';
}

const ENGINE_PROFILE_LOOKUP: Record<string, { memoryMb: number; cpuPercent: number; thread: EngineResourceProfile['threadMode'] }> = {
  ENG_IMAGE: { memoryMb: 54.2, cpuPercent: 9.4, thread: 'GPU_ACCELERATED' },
  ENG_PREPRESS: { memoryMb: 42.8, cpuPercent: 8.6, thread: 'WORKER_THREAD' },
  ENG_PRINT: { memoryMb: 36.5, cpuPercent: 7.2, thread: 'WORKER_THREAD' },
  ENG_BOOK: { memoryMb: 32.0, cpuPercent: 6.8, thread: 'ASYNC_RESOLVER' },
  ENG_COLOR: { memoryMb: 28.5, cpuPercent: 5.4, thread: 'WORKER_THREAD' },
  ENG_DESIGN_CRITIC: { memoryMb: 26.0, cpuPercent: 6.2, thread: 'ASYNC_RESOLVER' },
  ENG_TYPOGRAPHY: { memoryMb: 24.0, cpuPercent: 5.1, thread: 'SYNCHRONOUS_CORE' },
  ENG_LAYOUT: { memoryMb: 21.0, cpuPercent: 4.8, thread: 'SYNCHRONOUS_CORE' },
  ENG_THAI_TYPE: { memoryMb: 19.5, cpuPercent: 4.2, thread: 'SYNCHRONOUS_CORE' },
  ENG_GRID: { memoryMb: 18.2, cpuPercent: 3.9, thread: 'SYNCHRONOUS_CORE' },
  ENG_EDITORIAL_CORE: { memoryMb: 18.0, cpuPercent: 3.5, thread: 'SYNCHRONOUS_CORE' },
  ENG_AUTOKERNING: { memoryMb: 16.5, cpuPercent: 4.6, thread: 'WORKER_THREAD' },
  ENG_MULTILINGUAL: { memoryMb: 16.0, cpuPercent: 3.4, thread: 'SYNCHRONOUS_CORE' },
  ENG_INFOGRAPHIC: { memoryMb: 22.4, cpuPercent: 5.0, thread: 'ASYNC_RESOLVER' },
  ENG_PAPER: { memoryMb: 14.2, cpuPercent: 2.5, thread: 'SYNCHRONOUS_CORE' },
  ENG_FINISHING: { memoryMb: 18.8, cpuPercent: 3.8, thread: 'WORKER_THREAD' },
  ENG_ACADEMIC: { memoryMb: 15.0, cpuPercent: 2.8, thread: 'SYNCHRONOUS_CORE' },
  ENG_JOURNAL: { memoryMb: 20.4, cpuPercent: 4.1, thread: 'ASYNC_RESOLVER' },
  ENG_MAGAZINE: { memoryMb: 25.6, cpuPercent: 5.8, thread: 'ASYNC_RESOLVER' },
  ENG_BROCHURE: { memoryMb: 19.0, cpuPercent: 3.7, thread: 'SYNCHRONOUS_CORE' },
  ENG_CATALOGUE: { memoryMb: 27.5, cpuPercent: 6.0, thread: 'ASYNC_RESOLVER' },
  ENG_REPORT: { memoryMb: 21.8, cpuPercent: 4.4, thread: 'ASYNC_RESOLVER' },
  ENG_TEXTBOOK: { memoryMb: 20.0, cpuPercent: 3.9, thread: 'SYNCHRONOUS_CORE' },
  ENG_RESEARCH_PUB: { memoryMb: 22.1, cpuPercent: 4.3, thread: 'ASYNC_RESOLVER' },
  ENG_CREATIVE_DIR: { memoryMb: 17.5, cpuPercent: 3.2, thread: 'ASYNC_RESOLVER' },
};

export const EnginePerformanceWidget: React.FC<EnginePerformanceWidgetProps> = ({
  activeEngineIds,
  osVersion = 'v8.0',
  isPipelineRunning = false,
}) => {
  const { notifyTask, notifyWarning, notifyInfo } = useToast();
  const { isHighContrast, isPrintView } = useTheme();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [stressTestMode, setStressTestMode] = useState<boolean>(false);
  const [isPurging, setIsPurging] = useState<boolean>(false);
  const [purgeFeedback, setPurgeFeedback] = useState<string | null>(null);
  const [jitterOffset, setJitterOffset] = useState<number>(0);
  const [historyCpu, setHistoryCpu] = useState<number[]>([18, 22, 20, 24, 21, 25, 23, 22, 26, 24, 28, 26, 25, 27, 29, 28, 26, 25, 27, 26]);
  const [historyRam, setHistoryRam] = useState<number[]>([140, 142, 141, 145, 144, 146, 148, 147, 150, 152, 151, 153, 154, 153, 155, 157, 156, 155, 158, 157]);

  // Periodic Micro-Jitter & Real-Time Rolling History
  useEffect(() => {
    const interval = setInterval(() => {
      // Natural harmonic oscillation (sine-like variance + small random noise)
      const t = Date.now() / 3000;
      const wave = Math.sin(t) * 2.8 + Math.cos(t * 1.7) * 1.5;
      const noise = (Math.random() - 0.5) * 1.8;
      const jitter = wave + noise;
      setJitterOffset(jitter);

      setHistoryCpu((prev) => {
        const last = prev[prev.length - 1] || 25;
        const target = Math.max(8, Math.min(94, Math.round(last + (Math.random() - 0.5) * 4 + (stressTestMode ? 2 : 0))));
        return [...prev.slice(1), target];
      });

      setHistoryRam((prev) => {
        const last = prev[prev.length - 1] || 160;
        const target = Math.max(90, Math.min(480, Math.round(last + (Math.random() - 0.5) * 3)));
        return [...prev.slice(1), target];
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [stressTestMode]);

  // Compute Active Engines Breakdown
  const engineBreakdown = useMemo(() => {
    return activeEngineIds.map((id) => {
      const reg = ENGINE_REGISTRY.find((e) => e.id === id);
      const defaults = ENGINE_PROFILE_LOOKUP[id] || { memoryMb: 16.0, cpuPercent: 3.5, thread: 'SYNCHRONOUS_CORE' };
      return {
        id,
        name: reg?.name || id,
        category: reg?.category || 'Editorial',
        baseMemoryMb: defaults.memoryMb,
        baseCpuPercent: defaults.cpuPercent,
        threadMode: defaults.thread,
        cacheState: 'ACTIVE_PIPELINE' as const,
      };
    });
  }, [activeEngineIds]);

  // Aggregate Metrics
  const baseKernelMemoryMb = 34.0; // Core OS runtime baseline
  const activeEnginesMemoryMb = engineBreakdown.reduce((sum, e) => sum + e.baseMemoryMb, 0);
  const stressMultiplier = stressTestMode ? 1.65 : 1.0;
  const purgeOffset = isPurging ? -38.5 : 0;

  const totalMemoryMb = Math.max(
    48,
    Math.round((baseKernelMemoryMb + activeEnginesMemoryMb + purgeOffset + jitterOffset * 1.5) * stressMultiplier * 10) / 10
  );

  const activeEnginesCpu = engineBreakdown.reduce((sum, e) => sum + e.baseCpuPercent, 0);
  const baselineCpu = isPipelineRunning ? 28 : 12;
  const totalCpuPercent = Math.min(
    98,
    Math.max(
      6,
      Math.round((baselineCpu + activeEnginesCpu * 0.75 + jitterOffset + (stressTestMode ? 42 : 0)) * 10) / 10
    )
  );

  // Status computation
  const status: 'OPTIMAL' | 'MODERATE' | 'HIGH_LOAD' =
    totalCpuPercent > 70 || totalMemoryMb > 380
      ? 'HIGH_LOAD'
      : totalCpuPercent > 45 || totalMemoryMb > 250
      ? 'MODERATE'
      : 'OPTIMAL';

  const statusColor =
    status === 'OPTIMAL'
      ? 'text-emerald-400'
      : status === 'MODERATE'
      ? 'text-sky-400'
      : 'text-amber-400';

  const statusBg =
    status === 'OPTIMAL'
      ? 'bg-emerald-500'
      : status === 'MODERATE'
      ? 'bg-sky-500'
      : 'bg-amber-500';

  // Subsystem Allocations for Memory Pie/Bar
  const memorySubsystems = useMemo(() => {
    const rasterBuffers = Math.round(activeEngineIds.includes('ENG_IMAGE') ? 54 : 14);
    const separationPlates = Math.round(activeEngineIds.includes('ENG_PREPRESS') || activeEngineIds.includes('ENG_PRINT') ? 48 : 8);
    const glyphVectorCache = Math.round(activeEngineIds.includes('ENG_TYPOGRAPHY') || activeEngineIds.includes('ENG_THAI_TYPE') ? 32 : 12);
    const layoutModularTree = Math.round(activeEngineIds.includes('ENG_GRID') || activeEngineIds.includes('ENG_LAYOUT') ? 24 : 10);
    const coreKernelSystem = Math.max(16, totalMemoryMb - rasterBuffers - separationPlates - glyphVectorCache - layoutModularTree);

    return [
      { name: 'Prepress Raster Buffers', mb: rasterBuffers, color: 'bg-rose-500' },
      { name: 'CMYK Separation Plates', mb: separationPlates, color: 'bg-cyan-500' },
      { name: 'Font Glyph Outlines & Kerning', mb: glyphVectorCache, color: 'bg-amber-400' },
      { name: 'Modular Grid & Geometry Tree', mb: layoutModularTree, color: 'bg-indigo-400' },
      { name: 'Core OS Engine Kernel', mb: coreKernelSystem, color: 'bg-emerald-400' },
    ];
  }, [activeEngineIds, totalMemoryMb]);

  // Handle Purge Cache & Force GC
  const handlePurgeCache = () => {
    setIsPurging(true);
    setPurgeFeedback('Purging engine contour & glyph raster caches...');
    setTimeout(() => {
      setIsPurging(false);
      setPurgeFeedback('Freed ~38.5 MB buffer memory. Cache flushed.');
      notifyTask(
        'Engine Cache Flushed & GC Complete',
        'Reclaimed ~38.5 MB of raster contour & glyph layout buffers across active engines.',
        'ENG_PRINT'
      );
      setTimeout(() => setPurgeFeedback(null), 3000);
    }, 800);
  };

  const handleToggleStressTest = () => {
    setStressTestMode((prev) => {
      const next = !prev;
      if (next) {
        notifyWarning(
          'Prepress Workload Boost Engaged',
          'Simulating peak 300+ DPI batch rendering across active engine worker threads (~165% memory scale).'
        );
      } else {
        notifyInfo(
          'Workload Normalized',
          'Engine pipeline returned to nominal baseline telemetry.'
        );
      }
      return next;
    });
  };

  return (
    <div
      className={`w-full border-t text-xs font-mono select-none transition-colors ${
        isHighContrast
          ? 'border-yellow-400 bg-black text-white'
          : isPrintView
          ? 'border-slate-200 bg-slate-50 text-slate-800'
          : 'border-slate-800/80 bg-[#070b12] text-slate-300'
      }`}
    >
      {/* Primary Compact Footer Telemetry Strip */}
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Active Telemetry Status & Activity Beacon */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${statusBg}`}
              ></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${statusBg}`}></span>
            </span>
            <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-sky-400" />
              <span>OS KERNEL TELEMETRY</span>
            </span>
          </div>

          <span className="text-slate-600 hidden sm:inline">•</span>

          {/* Engine Count */}
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            <Layers className="w-3 h-3 text-sky-400" />
            <span>Active Engines:</span>
            <span className="text-sky-300 font-bold bg-slate-900 px-1.5 py-0.2 rounded border border-slate-800">
              {activeEngineIds.length}
            </span>
          </div>
        </div>

        {/* Center: Live Gauges (CPU & RAM) */}
        <div className="flex items-center gap-4 flex-wrap">
          {/* CPU Load Metric */}
          <div className="flex items-center gap-2 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800/80 shadow-inner">
            <Cpu className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-slate-400 text-[10px] uppercase">CPU Load:</span>
            <span className={`font-bold font-mono text-[11px] min-w-[36px] text-right ${statusColor}`}>
              {totalCpuPercent}%
            </span>
            {/* Visual Mini Progress Bar */}
            <div className="w-14 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  totalCpuPercent > 70
                    ? 'bg-amber-400'
                    : totalCpuPercent > 45
                    ? 'bg-sky-400'
                    : 'bg-emerald-400'
                }`}
                style={{ width: `${Math.min(100, totalCpuPercent)}%` }}
              />
            </div>
          </div>

          {/* Memory Heap Metric */}
          <div className="flex items-center gap-2 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800/80 shadow-inner">
            <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400 text-[10px] uppercase">Engine RAM:</span>
            <span className="font-bold font-mono text-[11px] text-emerald-300 min-w-[55px] text-right">
              {totalMemoryMb} MB
            </span>
            {/* Visual Mini Progress Bar */}
            <div className="w-14 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 transition-all duration-500 rounded-full"
                style={{ width: `${Math.min(100, (totalMemoryMb / 450) * 100)}%` }}
              />
            </div>
          </div>

          {/* Throughput Frame Metric */}
          <div className="hidden md:flex items-center gap-1.5 text-slate-400 text-[10px]">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>Frame:</span>
            <span className="text-slate-200 font-bold">8.4 ms (60 FPS)</span>
          </div>
        </div>

        {/* Right: Expand / Telemetry HUD Toggle & Actions */}
        <div className="flex items-center gap-2">
          {stressTestMode && (
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-950 text-amber-300 border border-amber-800 animate-pulse">
              WORKLOAD BOOST
            </span>
          )}

          <button
            id="btn-toggle-engine-telemetry-hud"
            onClick={() => setIsExpanded((prev) => !prev)}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 border transition-all cursor-pointer ${
              isExpanded
                ? 'bg-sky-950 border-sky-600 text-sky-200 shadow-sm'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
            title="Inspect real-time memory and processing load breakdown per active engine"
          >
            <Gauge className="w-3.5 h-3.5 text-sky-400" />
            <span>{isExpanded ? 'Hide Engine Telemetry' : 'Inspect Engine Load'}</span>
            {isExpanded ? (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>
        </div>
      </div>

      {/* Expandable Real-Time HUD Drawer */}
      {isExpanded && (
        <div
          id="panel-engine-telemetry-hud"
          className={`border-t p-4 sm:p-5 animate-in slide-in-from-bottom-2 duration-200 transition-colors ${
            isHighContrast
              ? 'bg-black border-2 border-yellow-400 text-white'
              : isPrintView
              ? 'bg-white border-slate-300 text-slate-900 shadow-lg'
              : 'border-slate-800 bg-[#090e18] text-slate-100'
          }`}
        >
          <div className="max-w-7xl mx-auto space-y-4">
            {/* Top HUD Title Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
              <div>
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-sky-400" />
                  <h4 className="font-bold text-slate-100 text-sm tracking-tight font-mono">
                    REAL-TIME ENGINE RESOURCE ALLOCATION &amp; PROCESSING HUD
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    Core OS {osVersion}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 font-sans">
                  Real-time telemetry tracking per-engine CPU slice consumption, buffer allocations, and layout thread execution.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  id="btn-telemetry-stress-toggle"
                  onClick={handleToggleStressTest}
                  className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer ${
                    stressTestMode
                      ? 'bg-amber-950 border-amber-600 text-amber-200 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                  title="Simulate high-density batch prepress rendering workload"
                >
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span>{stressTestMode ? 'Stress Mode: ACTIVE' : 'Simulate Heavy Load'}</span>
                </button>

                <button
                  id="btn-telemetry-purge-cache"
                  onClick={handlePurgeCache}
                  disabled={isPurging}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-slate-800 text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  title="Force Garbage Collection on engine vector and glyph caches"
                >
                  <RefreshCw className={`w-3 h-3 text-emerald-400 ${isPurging ? 'animate-spin' : ''}`} />
                  <span>{isPurging ? 'Flushing...' : 'Purge Cache & Force GC'}</span>
                </button>

                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  title="Close HUD"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Notification / Feedback Banner */}
            {purgeFeedback && (
              <div className="p-2 rounded-lg bg-emerald-950/70 border border-emerald-700/80 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{purgeFeedback}</span>
              </div>
            )}

            {/* Middle Row: Overview Cards & Rolling Telemetry Sparklines */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1: Memory Footprint Breakdown */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="font-bold flex items-center gap-1.5">
                    <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Memory Allocation</span>
                  </span>
                  <span className="text-emerald-400 font-bold">{totalMemoryMb} MB</span>
                </div>

                {/* Subsystem Stacked Bar */}
                <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden flex">
                  {memorySubsystems.map((sub, i) => (
                    <div
                      key={i}
                      className={`h-full ${sub.color}`}
                      style={{ width: `${(sub.mb / totalMemoryMb) * 100}%` }}
                      title={`${sub.name}: ${sub.mb} MB`}
                    />
                  ))}
                </div>

                {/* Legend */}
                <div className="space-y-1 text-[10px] text-slate-400 pt-1">
                  {memorySubsystems.map((sub, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className={`w-2 h-2 rounded-full ${sub.color} shrink-0`} />
                        <span className="truncate">{sub.name}</span>
                      </div>
                      <span className="font-mono text-slate-300 font-bold">{sub.mb} MB</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 2: CPU & Processing Load */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="font-bold flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-sky-400" />
                    <span>Processing Load</span>
                  </span>
                  <span className={`font-bold ${statusColor}`}>{totalCpuPercent}%</span>
                </div>

                {/* Simulated Real-Time Sparkline */}
                <div className="space-y-1">
                  <div className="text-[10px] text-slate-500 flex justify-between">
                    <span>Rolling CPU History (30s):</span>
                    <span className="text-slate-400">{status}</span>
                  </div>
                  <div className="h-10 w-full flex items-end gap-1 pt-1 bg-slate-900/60 p-1 rounded-lg border border-slate-900">
                    {historyCpu.map((val, i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-t-sm transition-all duration-300 ${
                          val > 65
                            ? 'bg-amber-400'
                            : val > 40
                            ? 'bg-sky-400'
                            : 'bg-emerald-400'
                        }`}
                        style={{ height: `${Math.max(10, Math.min(100, val))}%` }}
                        title={`Sample ${i + 1}: ${val}%`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-900">
                  <span>Engine Worker Slices:</span>
                  <span className="text-sky-300 font-bold">
                    {engineBreakdown.filter((e) => e.threadMode === 'WORKER_THREAD').length} Threads Active
                  </span>
                </div>
              </div>

              {/* Card 3: Engine Pipeline Efficiency */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="font-bold flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 text-amber-400" />
                    <span>Pipeline Efficiency</span>
                  </span>
                  <span className="text-amber-400 font-bold">98.6%</span>
                </div>

                <div className="space-y-1.5 text-[10px] text-slate-400">
                  <div className="flex justify-between items-center bg-slate-900/80 p-1.5 rounded">
                    <span>Active Engines in Pipeline:</span>
                    <strong className="text-slate-200">{activeEngineIds.length} Contracts</strong>
                  </div>
                  <div className="flex justify-between items-center bg-slate-900/80 p-1.5 rounded">
                    <span>Prepress Bleed &amp; Margin Verifier:</span>
                    <strong className="text-emerald-400">0.4ms Latency</strong>
                  </div>
                  <div className="flex justify-between items-center bg-slate-900/80 p-1.5 rounded">
                    <span>Auto-Kerning Proximity Solver:</span>
                    <strong className="text-emerald-400">1.2ms Latency</strong>
                  </div>
                  <div className="flex justify-between items-center bg-slate-900/80 p-1.5 rounded">
                    <span>Color Separation TAC Matrix:</span>
                    <strong className="text-emerald-400">2.1ms Latency</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row: Detailed Per-Engine Impact Table */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
              <div className="px-3.5 py-2.5 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
                <span className="font-bold text-slate-200 text-xs uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-sky-400" />
                  <span>Active Engine Resource Impact Matrix ({engineBreakdown.length} Loaded)</span>
                </span>
                <span className="text-[10px] text-slate-400">
                  Sorted by Memory Footprint (ISO 12647-2 Runtime Standards)
                </span>
              </div>

              <div className="max-h-60 overflow-y-auto scrollbar-thin">
                <table className="w-full text-left text-[11px] font-mono border-collapse">
                  <thead>
                    <tr className="bg-slate-900/50 text-slate-400 text-[10px] border-b border-slate-800">
                      <th className="py-2 px-3 font-semibold">ENGINE ID &amp; NAME</th>
                      <th className="py-2 px-3 font-semibold">CATEGORY</th>
                      <th className="py-2 px-3 font-semibold text-right">MEMORY (MB)</th>
                      <th className="py-2 px-3 font-semibold text-right">CPU LOAD (%)</th>
                      <th className="py-2 px-3 font-semibold">THREAD DISPATCH</th>
                      <th className="py-2 px-3 font-semibold text-right">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {engineBreakdown
                      .slice()
                      .sort((a, b) => b.baseMemoryMb - a.baseMemoryMb)
                      .map((eng) => (
                        <tr key={eng.id} className="hover:bg-slate-900/60 transition-colors">
                          <td className="py-2 px-3 font-bold text-slate-200 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span className="text-sky-300">{eng.id}</span>
                            <span className="text-slate-400 font-normal text-[10px] truncate max-w-[140px]">
                              {eng.name}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-slate-400 text-[10px]">{eng.category}</td>
                          <td className="py-2 px-3 text-right font-bold text-emerald-300">
                            {eng.baseMemoryMb.toFixed(1)} MB
                          </td>
                          <td className="py-2 px-3 text-right font-bold text-sky-300">
                            {eng.baseCpuPercent.toFixed(1)}%
                          </td>
                          <td className="py-2 px-3">
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-900 text-slate-300 border border-slate-800">
                              {eng.threadMode.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-right">
                            <span className="text-emerald-400 font-bold text-[10px]">
                              ONLINE
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
