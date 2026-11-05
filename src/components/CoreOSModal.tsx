import React from 'react';
import { CORE_PRINCIPLES, SYSTEM_INFO, CorePrinciple } from '../data/coreOS';
import { X, ShieldCheck, Award, Layers, Cpu, ArrowRight } from 'lucide-react';

interface CoreOSModalProps {
  onClose: () => void;
}

export const CoreOSModal: React.FC<CoreOSModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0b1017] border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden font-mono text-xs">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                CORE OS ARCHITECTURE &amp; INVIOLABLE PRINCIPLES
              </h3>
              <div className="text-[10px] text-slate-400">
                Universal Editorial &amp; Print Design AI OS • Version 7.0 → 8.0 → 9.0
              </div>
            </div>
          </div>
          <button
            id="btn-close-core-modal"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#080c12]">
          {/* Creator Attribution Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/60 to-slate-900 border border-indigo-700/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                <Award className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <div className="text-xs text-indigo-300 uppercase tracking-wider font-bold">
                  Creator / Designer
                </div>
                <div className="text-sm font-bold text-white font-thai">
                  {SYSTEM_INFO.creator.nameTh} ({SYSTEM_INFO.creator.nameEn})
                </div>
                <div className="text-[11px] text-slate-400 font-sans">
                  {SYSTEM_INFO.creator.affiliationEn}
                </div>
              </div>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-indigo-900/60 border border-indigo-700 text-indigo-200 text-right">
              <div className="text-[10px] text-indigo-300 font-bold">NRRU PRESS &amp; EDITORIAL</div>
              <div className="text-[9px] text-slate-400">Design Science Intelligence</div>
            </div>
          </div>

          {/* Golden Rule Banner */}
          <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-600/60 text-amber-200 space-y-1.5">
            <div className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-amber-300">
              <Cpu className="w-4 h-4" />
              <span>THE ARCHITECTURAL GOLDEN RULE (INVIOLABLE)</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-100 font-semibold">
              "{SYSTEM_INFO.goldenRule}"
            </p>
            <div className="text-[10px] text-amber-300 pt-1 font-mono">
              Hierarchy of Authority: <span className="font-bold underline">{SYSTEM_INFO.governanceHierarchy}</span>
            </div>
          </div>

          {/* Long-term Evolution Trajectory */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
              Architectural Evolution Trajectory
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-500 font-bold">v6.0</div>
                <div className="text-xs font-bold text-slate-300 mt-0.5">Monolithic Prompt</div>
                <div className="text-[9px] text-slate-500 mt-1">Fragile, single text file</div>
              </div>
              <div className="p-2.5 rounded-lg bg-indigo-950/60 border border-indigo-700 text-indigo-200">
                <div className="text-[10px] text-indigo-400 font-bold">v7.0</div>
                <div className="text-xs font-bold text-white mt-0.5">MODULAR AI OS</div>
                <div className="text-[9px] text-indigo-300 mt-1">Core OS + Engine Registry</div>
              </div>
              <div className="p-2.5 rounded-lg bg-sky-950/60 border border-sky-700 text-sky-200">
                <div className="text-[10px] text-sky-400 font-bold">v8.0</div>
                <div className="text-xs font-bold text-white mt-0.5">INTELLIGENT OS</div>
                <div className="text-[9px] text-sky-300 mt-1">Orchestration + Design Critic</div>
              </div>
              <div className="p-2.5 rounded-lg bg-purple-950/60 border border-purple-700 text-purple-200">
                <div className="text-[10px] text-purple-400 font-bold">v9.0</div>
                <div className="text-xs font-bold text-white mt-0.5">MULTI-ENGINE PLATFORM</div>
                <div className="text-[9px] text-purple-300 mt-1">Collaborative Intelligences</div>
              </div>
            </div>
          </div>

          {/* The 7 Core OS Principles P1 - P7 */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              The 7 Core OS Principles (Single Source of Truth)
            </div>
            <div className="space-y-2.5">
              {CORE_PRINCIPLES.map((p: CorePrinciple) => (
                <div
                  key={p.id}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-sky-400">{p.id}: {p.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded border font-bold ${
                      p.severity === 'INVIOLABLE'
                        ? 'bg-rose-950/60 text-rose-300 border-rose-800/60'
                        : 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60'
                    }`}>
                      {p.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                    {p.enDescription}
                  </p>
                  <p className="text-[11px] text-sky-300/80 font-thai leading-relaxed">
                    {p.thDescription}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="text-slate-500 text-[10px]">
            Faculty of Industrial Technology • Nakhon Ratchasima Rajabhat University
          </div>
          <button
            id="btn-confirm-core-modal"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
