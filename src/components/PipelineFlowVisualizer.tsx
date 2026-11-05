import React from 'react';
import { OSVersion } from '../types/os';
import { ArrowRight, CheckCircle2, ShieldCheck, Layers, Sparkles, Terminal, Activity } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface PipelineFlowVisualizerProps {
  version: OSVersion;
  activeEngines: string[];
  qaStatus: 'PASS' | 'REVISION_REQUIRED' | 'FAIL';
  qaScore: number;
  isLoading: boolean;
}

export const PipelineFlowVisualizer: React.FC<PipelineFlowVisualizerProps> = ({
  version,
  activeEngines,
  qaStatus,
  qaScore,
  isLoading,
}) => {
  const { isHighContrast, isPrintView } = useTheme();
  // Steps for each version according to prompt specs
  const getSteps = () => {
    if (version === 'v7.0') {
      return [
        { label: 'USER / PROJECT', sub: 'Input Brief' },
        { label: 'COMMAND ROUTER', sub: 'Syntax Parse' },
        { label: 'PROJECT ANALYZER', sub: 'Media Classifier' },
        { label: 'CORE OS', sub: 'Single Truth' },
        { label: 'ENGINE REGISTRY', sub: 'Directory' },
        { label: 'DYNAMIC LOADING', sub: 'Resolution' },
        { label: 'ACTIVE ENGINES', sub: `${activeEngines.length} Loaded` },
        { label: 'QA GATE', sub: `${qaScore}/100` },
        { label: 'FINAL OUTPUT', sub: 'Print Specs' },
      ];
    } else if (version === 'v8.0') {
      return [
        { label: 'COMMAND ROUTER', sub: 'Unified Router' },
        { label: 'PROJECT ANALYZER', sub: 'Intent Discovery' },
        { label: 'ENGINE DISCOVERY', sub: 'Auto-Select' },
        { label: 'DEPENDENCY RESOLUTION', sub: 'Matrix' },
        { label: 'ENGINE ORCHESTRATOR', sub: 'Conflict-Aware' },
        { label: 'CORE OS', sub: 'Inviolable Core' },
        { label: 'MULTIPLE ENGINES', sub: `${activeEngines.length} Engines` },
        { label: 'DESIGN CRITIC', sub: 'Anti-Slop Audit' },
        { label: 'QA GATE', sub: `${qaScore}/100` },
        { label: 'FINAL OUTPUT', sub: 'Master Grade' },
      ];
    } else {
      // v9.0 Multi-Engine Design Intelligence Platform
      return [
        { label: 'CORE OS', sub: 'Foundational Truth' },
        { label: 'SYSTEM ORCHESTRATOR', sub: 'Domain Hub' },
        { label: 'EDITORIAL INTEL', sub: 'Narrative Grid' },
        { label: 'VISUAL INTEL', sub: 'Harmonic Type' },
        { label: 'PRODUCTION INTEL', sub: 'Physical Reality' },
        { label: 'ACADEMIC / INTL', sub: 'NRRU Standards' },
        { label: 'DESIGN CRITIC', sub: 'Synthesized Critique' },
        { label: 'QA GATE', sub: `${qaScore}/100` },
        { label: 'FINAL PLATFORM', sub: 'Collaborative Spec' },
      ];
    }
  };

  const steps = getSteps();

  return (
    <div
      className={`rounded-xl p-3.5 shadow-md transition-colors ${
        isHighContrast
          ? 'bg-black border-2 border-yellow-400 text-white'
          : isPrintView
          ? 'bg-white border border-slate-300 text-slate-900 shadow-sm'
          : 'bg-[#0e141d] border border-slate-800/90 text-slate-100'
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <Activity className={`w-3.5 h-3.5 ${isHighContrast ? 'text-yellow-400' : isPrintView ? 'text-blue-600' : 'text-indigo-400'}`} />
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider">
            {version === 'v7.0'
              ? 'v7.0 Modular AI OS Pipeline'
              : version === 'v8.0'
              ? 'v8.0 Intelligent Orchestrated Pipeline'
              : 'v9.0 Multi-Engine Intelligence Platform Pipeline'}
          </span>
        </div>
        <div className="text-[11px] font-mono flex items-center gap-2 opacity-75">
          <span>Governance:</span>
          <span className={`font-semibold ${isHighContrast ? 'text-yellow-300' : isPrintView ? 'text-blue-700' : 'text-sky-400'}`}>
            CORE OS &gt; ENGINE RULES &gt; PROJECT PREFERENCES
          </span>
        </div>
      </div>

      {/* Horizontal Flow Steps */}
      <div className="overflow-x-auto pb-1">
        <div className="flex items-center min-w-max gap-1.5 py-1">
          {steps.map((step, idx) => {
            const isLast = idx === steps.length - 1;
            const isQa = step.label.includes('QA');
            const isCore = step.label.includes('CORE');

            return (
              <React.Fragment key={step.label + idx}>
                <div
                  className={`px-2.5 py-1.5 rounded-lg border text-center transition-all ${
                    isLoading
                      ? 'animate-pulse opacity-60'
                      : isQa
                      ? qaStatus === 'PASS'
                        ? isHighContrast
                          ? 'bg-black border-2 border-emerald-400 text-emerald-300 font-bold'
                          : isPrintView
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                          : 'bg-emerald-950/40 border-emerald-700/60 text-emerald-300'
                        : isHighContrast
                        ? 'bg-black border-2 border-amber-400 text-amber-300 font-bold'
                        : isPrintView
                        ? 'bg-amber-50 border-amber-300 text-amber-800'
                        : 'bg-amber-950/40 border-amber-700/60 text-amber-300'
                      : isCore
                      ? isHighContrast
                        ? 'bg-black border-2 border-white text-yellow-300 font-bold'
                        : isPrintView
                        ? 'bg-blue-50 border-blue-200 text-blue-800'
                        : 'bg-indigo-950/40 border-indigo-700/60 text-indigo-200'
                      : isHighContrast
                      ? 'bg-black border border-white text-white'
                      : isPrintView
                      ? 'bg-slate-50 border-slate-200 text-slate-800'
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="text-[10px] font-mono font-bold tracking-tight whitespace-nowrap">
                    {step.label}
                  </div>
                  <div className="text-[9px] font-mono mt-0.5 whitespace-nowrap opacity-70">
                    {step.sub}
                  </div>
                </div>

                {!isLast && (
                  <ArrowRight className="w-3 h-3 text-slate-500 shrink-0 mx-0.5" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
