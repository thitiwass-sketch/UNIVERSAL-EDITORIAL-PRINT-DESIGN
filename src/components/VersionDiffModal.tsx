import React from 'react';
import { ProjectSnapshot } from '../types/versionHistory';
import { computeVersionDiff } from '../utils/versionHistoryHelper';
import {
  GitCompare,
  X,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  Palette,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';

interface VersionDiffModalProps {
  isOpen: boolean;
  onClose: () => void;
  snapshotA: ProjectSnapshot;
  snapshotB: ProjectSnapshot;
  onRestore: (snapshotId: string) => void;
}

export const VersionDiffModal: React.FC<VersionDiffModalProps> = ({
  isOpen,
  onClose,
  snapshotA,
  snapshotB,
  onRestore,
}) => {
  if (!isOpen) return null;

  const diff = computeVersionDiff(snapshotA.projectState, snapshotB.projectState);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] bg-[#0c121c] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#090d15]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-sky-950/80 border border-sky-700/60 text-sky-400">
              <GitCompare className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-100">
                Version Delta &amp; Prepress Inspection
              </h2>
              <p className="text-[11px] text-slate-400 font-sans">
                Comparing architectural parameters between historical checkpoints
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Side-by-Side Version Cards */}
          <div className="grid grid-cols-2 gap-3 items-center">
            {/* Version A */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono space-y-1.5">
              <div className="text-[10px] uppercase tracking-wider text-slate-400">
                Base Version (A)
              </div>
              <div className="font-bold text-slate-200 truncate">
                {snapshotA.versionName}
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <span>{snapshotA.tag}</span>
                <span>•</span>
                <span>{snapshotA.createdAtFormatted}</span>
              </div>
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-slate-400">QA Rating:</span>
                <span className="text-emerald-400 font-bold">{snapshotA.stats.qaScore}/100</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Engines:</span>
                <span className="text-sky-300 font-bold">{snapshotA.stats.engineCount}</span>
              </div>
              <button
                onClick={() => {
                  onRestore(snapshotA.id);
                  onClose();
                }}
                className="w-full mt-2 py-1 px-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-mono font-semibold transition-colors flex items-center justify-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Load Version A</span>
              </button>
            </div>

            {/* Version B */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-indigo-900/60 text-xs font-mono space-y-1.5">
              <div className="text-[10px] uppercase tracking-wider text-indigo-400">
                Comparison Target (B)
              </div>
              <div className="font-bold text-slate-200 truncate">
                {snapshotB.versionName}
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <span>{snapshotB.tag}</span>
                <span>•</span>
                <span>{snapshotB.createdAtFormatted}</span>
              </div>
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-slate-400">QA Rating:</span>
                <span className="text-emerald-400 font-bold">{snapshotB.stats.qaScore}/100</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Engines:</span>
                <span className="text-sky-300 font-bold">{snapshotB.stats.engineCount}</span>
              </div>
              <button
                onClick={() => {
                  onRestore(snapshotB.id);
                  onClose();
                }}
                className="w-full mt-2 py-1 px-2 rounded bg-indigo-900 hover:bg-indigo-800 text-indigo-100 text-[10px] font-mono font-semibold transition-colors flex items-center justify-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Load Version B</span>
              </button>
            </div>
          </div>

          {/* Notable Summary Items */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-300 flex items-center gap-1.5">
              <GitCompare className="w-3.5 h-3.5 text-sky-400" />
              <span>Key Architectural Differentiators</span>
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-300 font-sans">
              {diff.notableSummary.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Engine Contracts Delta */}
          {(diff.enginesAdded.length > 0 || diff.enginesRemoved.length > 0) && (
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 space-y-2">
              <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-300 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                <span>Pipeline Engine Delta</span>
              </h3>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {diff.enginesAdded.map((eng) => (
                  <span
                    key={eng}
                    className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800"
                  >
                    + {eng}
                  </span>
                ))}
                {diff.enginesRemoved.map((eng) => (
                  <span
                    key={eng}
                    className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-950 text-rose-300 border border-rose-800 line-through"
                  >
                    - {eng}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Parameter Comparison Table */}
          <div className="border border-slate-800 rounded-xl overflow-hidden text-xs font-mono">
            <table className="w-full text-left">
              <thead className="bg-slate-900 text-slate-400 text-[10px] uppercase">
                <tr>
                  <th className="p-2.5">Parameter</th>
                  <th className="p-2.5">Version A</th>
                  <th className="p-2.5">Version B</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                <tr>
                  <td className="p-2.5 text-slate-400">Trim Size</td>
                  <td className="p-2.5">{snapshotA.stats.dimensions}</td>
                  <td className="p-2.5">{snapshotB.stats.dimensions}</td>
                </tr>
                <tr>
                  <td className="p-2.5 text-slate-400">Color Profile</td>
                  <td className="p-2.5">{snapshotA.stats.colorSpace}</td>
                  <td className="p-2.5">{snapshotB.stats.colorSpace}</td>
                </tr>
                <tr>
                  <td className="p-2.5 text-slate-400">Headline Font</td>
                  <td className="p-2.5">{snapshotA.projectState.typography.headlineFont}</td>
                  <td className="p-2.5">{snapshotB.projectState.typography.headlineFont}</td>
                </tr>
                <tr>
                  <td className="p-2.5 text-slate-400">Scale Ratio</td>
                  <td className="p-2.5">{snapshotA.projectState.typography.scaleRatio}x</td>
                  <td className="p-2.5">{snapshotB.projectState.typography.scaleRatio}x</td>
                </tr>
                <tr>
                  <td className="p-2.5 text-slate-400">Bleed (mm)</td>
                  <td className="p-2.5">{snapshotA.projectState.specs.bleedMm} mm</td>
                  <td className="p-2.5">{snapshotB.projectState.specs.bleedMm} mm</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-[#090d15] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 transition-colors"
          >
            Close Diff
          </button>
        </div>
      </div>
    </div>
  );
};
