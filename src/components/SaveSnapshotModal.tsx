import React, { useState } from 'react';
import { ActiveProjectState } from '../types/os';
import { SnapshotTag } from '../types/versionHistory';
import {
  Camera,
  X,
  Tag,
  CheckCircle2,
  Layers,
  Sparkles,
  Info,
  Clock,
} from 'lucide-react';

interface SaveSnapshotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (versionName: string, tag: SnapshotTag, description: string) => void;
  currentProject: ActiveProjectState;
  suggestedVersionName: string;
}

const AVAILABLE_TAGS: { id: SnapshotTag; label: string; color: string }[] = [
  { id: 'Milestone', label: 'Milestone', color: 'bg-indigo-950 text-indigo-300 border-indigo-700' },
  { id: 'Prepress Proof', label: 'Prepress Proof', color: 'bg-emerald-950 text-emerald-300 border-emerald-700' },
  { id: 'Color Separation', label: 'Color Separation', color: 'bg-sky-950 text-sky-300 border-sky-700' },
  { id: 'Typography Revision', label: 'Typography Revision', color: 'bg-amber-950 text-amber-300 border-amber-700' },
  { id: 'Client Review', label: 'Client Review', color: 'bg-purple-950 text-purple-300 border-purple-700' },
  { id: 'Custom', label: 'Custom Checkpoint', color: 'bg-slate-900 text-slate-300 border-slate-700' },
];

export const SaveSnapshotModal: React.FC<SaveSnapshotModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentProject,
  suggestedVersionName,
}) => {
  const [versionName, setVersionName] = useState(suggestedVersionName);
  const [tag, setTag] = useState<SnapshotTag>('Milestone');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!versionName.trim()) return;
    onSave(versionName.trim(), tag, description.trim());
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#0c121c] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#090d15]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-950/80 border border-indigo-700/60 text-indigo-400">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-100">
                Save Project State Snapshot
              </h2>
              <p className="text-[11px] text-slate-400 font-sans">
                Capture an immutable checkpoint of the current canvas, layout, and prepress specs
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

        {/* Current State Summary Card */}
        <div className="px-6 pt-5 pb-3">
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs font-mono">
            <div className="space-y-1">
              <div className="text-slate-400 text-[10px] uppercase tracking-wider">
                Current Working Project
              </div>
              <div className="font-semibold text-slate-200 line-clamp-1">
                {currentProject.title}
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-2">
                <span>{currentProject.projectType}</span>
                <span>•</span>
                <span>{currentProject.specs.trimmedDimensions.widthMm} × {currentProject.specs.trimmedDimensions.heightMm} mm</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                  currentProject.qaGate.status === 'PASS'
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    : 'bg-amber-950 text-amber-300 border-amber-800'
                }`}
              >
                QA: {currentProject.qaGate.totalScore}/100
              </span>
              <span className="text-[10px] text-slate-400">
                {currentProject.activeEngineIds.length} Active Engines
              </span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-3 space-y-4">
          {/* Version Name Input */}
          <div>
            <label className="block text-xs font-mono text-slate-300 font-semibold mb-1.5">
              Snapshot / Version Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={versionName}
              onChange={(e) => setVersionName(e.target.value)}
              placeholder="e.g., v1.4 — Adjusted Spine & Baseline 14pt"
              required
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-xs font-mono focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Tag Selection */}
          <div>
            <label className="block text-xs font-mono text-slate-300 font-semibold mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-indigo-400" />
              <span>Snapshot Category Tag</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {AVAILABLE_TAGS.map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setTag(t.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-mono border transition-all text-left flex items-center justify-between ${
                    tag === t.id
                      ? `${t.color} font-bold ring-1 ring-indigo-400`
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <span className="truncate">{t.label}</span>
                  {tag === t.id && <CheckCircle2 className="w-3 h-3 shrink-0 ml-1 text-indigo-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Changelog / Notes */}
          <div>
            <label className="block text-xs font-mono text-slate-300 font-semibold mb-1.5">
              Changelog Notes &amp; Rationale <span className="text-slate-500 font-normal">(Optional)</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail modifications made in this iteration, such as altered leading, paper stock change, or color separation..."
              className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-xs font-sans focus:outline-none focus:border-indigo-500 transition-colors resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 pb-2 flex items-center justify-end gap-3 border-t border-slate-800/80">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!versionName.trim()}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-mono text-white font-bold transition-colors flex items-center gap-1.5 shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Save Snapshot</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
