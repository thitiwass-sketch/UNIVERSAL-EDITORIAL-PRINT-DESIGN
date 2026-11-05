/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Keyboard, Command, Sparkles, Layers, ShieldCheck, FileDown, FileText } from 'lucide-react';
import { ShortcutDefinition } from '../hooks/useKeyboardShortcuts';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  shortcuts: ShortcutDefinition[];
  isMac: boolean;
  modSymbol: string;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
  shortcuts,
  isMac,
  modSymbol,
}) => {
  if (!isOpen) return null;

  const categories = ['Navigation', 'Prepress & Export', 'Engine & Command', 'System'] as const;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-[#0b1017] border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden font-mono text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-wide">
                  KEYBOARD SHORTCUTS MANAGER
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60 font-mono">
                  {isMac ? 'macOS Keybindings (⌘)' : 'Windows / Linux (Ctrl)'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                High-efficiency keystrokes for master editorial architects & prepress engineers
              </p>
            </div>
          </div>

          <button
            id="btn-close-shortcuts-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list grouped by category */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-[#080c12]">
          {/* Quick Highlight Box */}
          <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-800/40 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-indigo-200 font-bold text-xs flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Primary Command Palette</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Press <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-200 font-bold">{modSymbol}K</kbd> anywhere to search all 30+ engines, execute commands, or jump between views.
              </p>
            </div>
            <span className="text-xl font-bold font-mono px-3 py-1.5 rounded-lg bg-indigo-600/30 text-indigo-300 border border-indigo-500/50">
              {modSymbol}K
            </span>
          </div>

          {categories.map((cat) => {
            const group = shortcuts.filter((s) => s.category === cat);
            if (group.length === 0) return null;

            return (
              <div key={cat} className="space-y-2">
                <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-800/80 pb-1 flex items-center gap-2">
                  <span>{cat}</span>
                  <span className="text-[10px] text-slate-600 font-normal">({group.length})</span>
                </div>

                <div className="grid grid-cols-1 gap-1.5">
                  {group.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/70 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                    >
                      <span className="text-xs text-slate-300 font-sans">
                        {item.description}
                      </span>
                      <kbd className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-slate-200 font-mono font-bold text-[11px] tracking-wide shrink-0 shadow-sm">
                        {isMac ? item.macKeys : item.winKeys}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-[11px] text-slate-400">
          <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">Esc</kbd> to dismiss at any time</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
