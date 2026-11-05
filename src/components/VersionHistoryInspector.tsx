import React, { useState } from 'react';
import { ProjectSnapshot } from '../types/versionHistory';
import {
  History,
  Clock,
  Camera,
  CheckCircle2,
  GitCompare,
  RotateCcw,
  Trash2,
  Tag,
  AlertCircle,
  Sparkles,
  ChevronRight,
  Download,
  Info,
} from 'lucide-react';

interface VersionHistoryInspectorProps {
  snapshots: ProjectSnapshot[];
  activeSnapshotId: string;
  onRestoreSnapshot: (id: string) => void;
  onOpenSaveModal: () => void;
  onDeleteSnapshot: (id: string) => void;
  onOpenDiff: (snapA: ProjectSnapshot, snapB: ProjectSnapshot) => void;
  onResetDefaults: () => void;
}

export const VersionHistoryInspector: React.FC<VersionHistoryInspectorProps> = ({
  snapshots,
  activeSnapshotId,
  onRestoreSnapshot,
  onOpenSaveModal,
  onDeleteSnapshot,
  onOpenDiff,
  onResetDefaults,
}) => {
  const [filterTag, setFilterTag] = useState<string>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const tags = ['all', ...Array.from(new Set(snapshots.map((s) => s.tag)))];

  const filteredSnapshots = snapshots.filter((s) => {
    if (filterTag === 'all') return true;
    return s.tag === filterTag;
  });

  const currentActiveSnapshot = snapshots.find((s) => s.id === activeSnapshotId) || snapshots[snapshots.length - 1];

  const handleExportSnapshotJSON = (snapshot: ProjectSnapshot) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(snapshot, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${snapshot.versionName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_snapshot.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="flex flex-col gap-3 font-mono text-xs">
      {/* Top Header & Action Controls */}
      <div className="bg-[#0b1017] border border-slate-800 rounded-xl p-3.5">
        <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-sky-400" />
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Version History &amp; Snapshots
            </h3>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-950 text-sky-300 border border-sky-800/80 font-bold">
            {snapshots.length} Snapshots
          </span>
        </div>

        <p className="text-[11px] font-sans text-slate-400 leading-relaxed mb-3">
          Capture state snapshots at critical design milestones and restore any previous version into the Canvas in real-time.
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            id="btn-inspector-save-snapshot"
            onClick={onOpenSaveModal}
            className="flex-1 py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm shadow-indigo-600/30"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Save Snapshot</span>
          </button>

          <button
            onClick={onResetDefaults}
            title="Reset to default baseline milestone progression"
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      {tags.length > 2 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {tags.map((t) => (
            <button
              key={t}
              onClick={() => setFilterTag(t)}
              className={`px-2 py-1 rounded-md text-[10px] font-mono whitespace-nowrap transition-colors border ${
                filterTag === t
                  ? 'bg-sky-950 text-sky-200 border-sky-700 font-bold'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-300'
              }`}
            >
              {t === 'all' ? 'All Snapshots' : t}
            </button>
          ))}
        </div>
      )}

      {/* Timeline List of Snapshots */}
      <div className="space-y-2.5">
        {filteredSnapshots.slice().reverse().map((snapshot, index) => {
          const isActive = snapshot.id === activeSnapshotId;
          const isLatest = index === 0;

          return (
            <div
              key={snapshot.id}
              className={`p-3.5 rounded-xl border transition-all relative overflow-hidden ${
                isActive
                  ? 'bg-slate-900/90 border-indigo-500/80 shadow-md ring-1 ring-indigo-500/30'
                  : 'bg-[#0b1017] border-slate-800/90 hover:border-slate-700'
              }`}
            >
              {/* Active Indicator Pillar */}
              {isActive && (
                <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-sky-400"></div>
              )}

              <div className="flex items-start justify-between gap-2 mb-1.5 pl-1">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase border ${
                        snapshot.tag === 'Milestone'
                          ? 'bg-indigo-950 text-indigo-300 border-indigo-800'
                          : snapshot.tag === 'Prepress Proof'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                          : snapshot.tag === 'Color Separation'
                          ? 'bg-sky-950 text-sky-300 border-sky-800'
                          : snapshot.tag === 'Typography Revision'
                          ? 'bg-amber-950 text-amber-300 border-amber-800'
                          : 'bg-purple-950 text-purple-300 border-purple-800'
                      }`}
                    >
                      {snapshot.tag}
                    </span>

                    {isActive && (
                      <span className="flex items-center gap-1 text-[9px] font-bold text-indigo-300 bg-indigo-950/80 px-1.5 py-0.5 rounded border border-indigo-800/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        ACTIVE IN CANVAS
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs font-bold text-slate-100 mt-1.5 font-mono">
                    {snapshot.versionName}
                  </h4>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-[10px] text-slate-400 flex items-center gap-1 justify-end">
                    <Clock className="w-2.5 h-2.5 text-slate-500" />
                    <span>{snapshot.createdAtFormatted}</span>
                  </div>
                  <div className="text-[9px] text-slate-500 mt-0.5">
                    {snapshot.stats.dimensions}
                  </div>
                </div>
              </div>

              {/* Description */}
              {snapshot.description && (
                <p className="text-[11px] font-sans text-slate-300/90 leading-relaxed mb-2.5 pl-1">
                  {snapshot.description}
                </p>
              )}

              {/* Metrics Bar */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/80 border border-slate-800/80 text-[10px] mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">QA Gate:</span>
                  <span
                    className={`font-bold ${
                      snapshot.stats.qaStatus === 'PASS'
                        ? 'text-emerald-400'
                        : 'text-amber-400'
                    }`}
                  >
                    {snapshot.stats.qaScore}/100 ({snapshot.stats.qaStatus})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Engines:</span>
                  <span className="text-sky-300 font-bold">
                    {snapshot.stats.engineCount}
                  </span>
                </div>
                <div className="text-slate-400 truncate max-w-[90px]">
                  {snapshot.stats.colorSpace.split(' ')[0]}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-1.5 pt-1 border-t border-slate-800/60 pl-1">
                <div className="flex items-center gap-1">
                  {/* Restore / Toggle Button */}
                  {isActive ? (
                    <span className="px-2 py-1 rounded bg-indigo-950/60 border border-indigo-700/60 text-[10px] text-indigo-300 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      Current Canvas
                    </span>
                  ) : (
                    <button
                      onClick={() => onRestoreSnapshot(snapshot.id)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-mono font-semibold transition-colors flex items-center gap-1 shadow-sm"
                    >
                      <RotateCcw className="w-3 h-3 text-sky-400" />
                      <span>Restore to Canvas</span>
                    </button>
                  )}

                  {/* Compare Button */}
                  {!isActive && currentActiveSnapshot && (
                    <button
                      onClick={() => onOpenDiff(snapshot, currentActiveSnapshot)}
                      className="px-2 py-1 rounded bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-[10px] font-mono transition-colors flex items-center gap-1"
                      title="Compare differences with currently active canvas"
                    >
                      <GitCompare className="w-3 h-3 text-indigo-400" />
                      <span>Compare</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  {/* JSON Export */}
                  <button
                    onClick={() => handleExportSnapshotJSON(snapshot)}
                    className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                    title="Export Snapshot JSON"
                  >
                    <Download className="w-3 h-3" />
                  </button>

                  {/* Delete Button (if more than 1 snapshot) */}
                  {snapshots.length > 1 && (
                    deleteConfirmId === snapshot.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            onDeleteSnapshot(snapshot.id);
                            setDeleteConfirmId(null);
                          }}
                          className="px-1.5 py-0.5 rounded bg-rose-900 text-white text-[9px] font-bold hover:bg-rose-800"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-1 py-0.5 text-slate-400 text-[9px] hover:text-white"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(snapshot.id)}
                        className="p-1 rounded hover:bg-slate-800 text-slate-500 hover:text-rose-400 transition-colors"
                        title="Delete this snapshot"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
