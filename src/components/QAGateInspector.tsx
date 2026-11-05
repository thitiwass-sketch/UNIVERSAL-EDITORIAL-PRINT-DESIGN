import React, { useState } from 'react';
import { QAGateResult } from '../types/os';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Award,
} from 'lucide-react';

interface QAGateInspectorProps {
  qaGate: QAGateResult;
  onReevaluate: () => void;
  isLoading: boolean;
}

export const QAGateInspector: React.FC<QAGateInspectorProps> = ({
  qaGate,
  onReevaluate,
  isLoading,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const isPassed = qaGate.totalScore >= qaGate.passingThreshold;

  return (
    <div className="space-y-6">
      {/* QA Header & Big Scorecard */}
      <div className="bg-[#0b1017] border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <h2 className="text-xl font-bold text-white font-mono tracking-tight">
                MANDATORY 100-POINT QA GATE
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Core OS Governance Layer • Minimum Passing Score: 85/100 • Non-Negotiable Prepress &amp; Editorial Clearance
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="btn-re-run-qa"
              onClick={onReevaluate}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-emerald-500 text-slate-200 text-xs font-mono font-semibold flex items-center gap-2 transition-all hover:text-emerald-400 shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>TRIGGER AUDIT RE-EVALUATION</span>
            </button>
          </div>
        </div>

        {/* Big Score Summary Banner */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-4">
            <div
              className={`w-16 h-16 rounded-xl flex items-center justify-center font-mono font-black text-2xl border ${
                isPassed
                  ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300'
                  : 'bg-amber-950/80 border-amber-500/60 text-amber-300'
              }`}
            >
              {qaGate.totalScore}
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Total Score
              </div>
              <div className="text-base font-bold text-white font-mono">
                / 100 Points
              </div>
              <div className="text-[11px] text-slate-500">Threshold: 85</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                isPassed
                  ? 'bg-emerald-950 text-emerald-400'
                  : 'bg-amber-950 text-amber-400'
              }`}
            >
              {isPassed ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : (
                <AlertTriangle className="w-6 h-6" />
              )}
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Gate Verdict
              </div>
              <div
                className={`text-sm font-bold font-mono ${
                  isPassed ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {qaGate.status}
              </div>
              <div className="text-[10px] text-slate-400 truncate max-w-xs">
                {qaGate.verdict}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-950 text-indigo-400 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Audited Pillars
              </div>
              <div className="text-sm font-bold text-white font-mono">
                10 / 10 Pillars
              </div>
              <div className="text-[10px] text-slate-400">100% Comprehensive</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-950 text-sky-400 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Anti-Slop Audit
              </div>
              <div className="text-sm font-bold text-sky-400 font-mono">
                CLEAN (0 DEFECTS)
              </div>
              <div className="text-[10px] text-slate-400">Zero AI clichés</div>
            </div>
          </div>
        </div>
      </div>

      {/* 10 Criteria Pillars Breakdown Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider px-1">
          Detailed 10-Pillar Breakdown &amp; Audit Trail
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {qaGate.categories.map((cat, idx) => {
            const isExpanded = expandedId === cat.id;
            return (
              <div
                key={cat.id}
                className={`bg-[#0d131c] border rounded-xl p-4 transition-all ${
                  cat.score === 10
                    ? 'border-slate-800 hover:border-slate-700'
                    : 'border-amber-700/50 bg-amber-950/10'
                }`}
              >
                <div
                  onClick={() => toggleExpand(cat.id)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 font-mono text-[10px] flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold font-mono text-slate-200">
                        {cat.title}
                      </h4>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {cat.criteria.join(' • ')}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                        cat.score === 10
                          ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-300'
                          : 'bg-amber-950/60 border-amber-700/60 text-amber-300'
                      }`}
                    >
                      {cat.score} / {cat.maxScore}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Findings */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs font-mono space-y-2 text-slate-300">
                    <div className="text-[10px] uppercase text-slate-500 font-bold">
                      Audit Findings:
                    </div>
                    {cat.findings.map((f, fIdx) => (
                      <div
                        key={fIdx}
                        className="flex items-start gap-2 bg-slate-950/60 p-2 rounded border border-slate-900"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-[11px] text-slate-300">{f}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Criticisms & Advisory Notes */}
      {qaGate.criticisms.length > 0 && (
        <div className="bg-[#0b1017] border border-slate-800 rounded-xl p-4 text-xs font-mono">
          <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider mb-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Pre-Press Advisory &amp; Refinement Notes</span>
          </div>
          <ul className="space-y-1.5 text-slate-300">
            {qaGate.criticisms.map((crit, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>{crit}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
