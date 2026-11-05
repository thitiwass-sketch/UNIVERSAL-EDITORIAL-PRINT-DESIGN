import React from 'react';
import { ActiveProjectState } from '../types/os';
import { Sparkles, ShieldCheck, CheckCircle2, AlertCircle, ArrowUpRight, Award, Zap } from 'lucide-react';

interface DesignCriticReportViewProps {
  project: ActiveProjectState;
}

export const DesignCriticReportView: React.FC<DesignCriticReportViewProps> = ({ project }) => {
  const { critic } = project;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0b1017] border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-6 h-6 text-amber-400" />
              <h2 className="text-xl font-bold text-white font-mono tracking-tight">
                DESIGN CRITIC ENGINE &amp; ANTI-SLOP AUDIT
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Algorithmic Aesthetic Audit • Structural Tension Analysis • Micro-Typographic &amp; Prepress Verification
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-slate-400">Critic Engine:</span>
            <span className="px-2.5 py-1 rounded bg-amber-950/60 border border-amber-800/60 text-amber-300 font-bold">
              ENG_DESIGN_CRITIC v2.0
            </span>
          </div>
        </div>

        {/* 3 Metric Scores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 font-mono">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">
              Structural Integrity
            </div>
            <div className="text-2xl font-bold text-sky-400">
              {critic.structuralIntegrityScore}%
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Grid mathematical discipline &amp; margin harmony
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">
              Typographic Harmony
            </div>
            <div className="text-2xl font-bold text-emerald-400">
              {critic.typographicHarmonyScore}%
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Scale ratio, baseline lock &amp; Thai diacritic clearance
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">
              Production Feasibility
            </div>
            <div className="text-2xl font-bold text-amber-400">
              {critic.productionFeasibilityScore}%
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Spine caliper, 3mm bleed, and CMYK plate separation
            </div>
          </div>
        </div>
      </div>

      {/* Anti-Slop Audit Checklist Card */}
      <div className="bg-[#0b1017] border border-slate-800 rounded-2xl p-6 shadow-md font-mono text-xs">
        <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider mb-3">
          <ShieldCheck className="w-5 h-5" />
          <span>Anti-Slop Compliance Verification (Zero Generic AI Clichés)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-slate-300">
          {[
            { label: 'Color & FX', desc: 'No purple/blue gradients or glowing drop-shadows' },
            { label: 'Layout Architecture', desc: 'No nested cards (cards inside cards) or identical 3-column feature grids' },
            { label: 'Border Styling', desc: 'No side-tab borders or competing corner radius styles' },
            { label: 'Typography Standard', desc: 'No hero eyebrows or unsequenced number badges' },
            { label: 'Padding Mathematics', desc: 'Outer container padding >= inner child spacing' },
            { label: 'Print Legibility', desc: 'High contrast; body text strictly constrained to 65–75ch' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 flex items-start gap-2.5"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-slate-200">{item.label}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Critic Findings Grid: Strengths, Tensions, Refinements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 font-mono text-xs">
        {/* Strengths */}
        <div className="bg-[#0b1017] border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider pb-2 border-b border-slate-800">
            <CheckCircle2 className="w-4 h-4" />
            <span>Structural Strengths</span>
          </div>
          <ul className="space-y-2.5 text-slate-300">
            {critic.strengths.map((str, i) => (
              <li key={i} className="flex items-start gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-900">
                <span className="text-emerald-400 font-bold">•</span>
                <span className="leading-relaxed">{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tensions */}
        <div className="bg-[#0b1017] border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider pb-2 border-b border-slate-800">
            <AlertCircle className="w-4 h-4" />
            <span>Visual &amp; Optical Tensions</span>
          </div>
          <ul className="space-y-2.5 text-slate-300">
            {critic.tensions.map((ten, i) => (
              <li key={i} className="flex items-start gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-900">
                <span className="text-amber-400 font-bold">•</span>
                <span className="leading-relaxed">{ten}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Refinements */}
        <div className="bg-[#0b1017] border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-sky-400 font-bold uppercase tracking-wider pb-2 border-b border-slate-800">
            <Zap className="w-4 h-4" />
            <span>Refinement Proposals</span>
          </div>
          <ul className="space-y-2.5 text-slate-300">
            {critic.refinements.map((ref, i) => (
              <li key={i} className="flex items-start gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-900">
                <span className="text-sky-400 font-bold">•</span>
                <span className="leading-relaxed">{ref}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
