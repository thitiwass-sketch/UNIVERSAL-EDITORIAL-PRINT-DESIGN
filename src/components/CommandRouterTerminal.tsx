import React, { useState } from 'react';
import { Terminal, CornerDownLeft, Sparkles, BookOpen, FileText, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { COMMAND_DEFINITIONS } from '../data/commandRouter';
import { useTheme } from '../context/ThemeContext';

interface CommandRouterTerminalProps {
  currentCommand: string;
  onExecuteCommand: (cmd: string) => void;
  isLoading: boolean;
}

export const CommandRouterTerminal: React.FC<CommandRouterTerminalProps> = ({
  currentCommand,
  onExecuteCommand,
  isLoading,
}) => {
  const { isHighContrast, isPrintView } = useTheme();
  const [inputVal, setInputVal] = useState(currentCommand);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isLoading) return;
    onExecuteCommand(inputVal.trim());
    setShowSuggestions(false);
  };

  // Filter commands that match current input
  const suggestions = COMMAND_DEFINITIONS.filter((c) =>
    c.command.toLowerCase().includes(inputVal.toLowerCase().split(' ')[0] || '')
  ).slice(0, 6);

  const quickPresets = [
    {
      label: 'Academic Book Cover',
      icon: BookOpen,
      cmd: '/design /book Academic book cover for NRRU Industrial Technology',
      desc: 'BOOK + EDITORIAL + TYPOGRAPHY + GRID + IMAGE + ACADEMIC + PRINT + PREPRESS + QA',
    },
    {
      label: 'Exhibition Poster',
      icon: ImageIcon,
      cmd: '/design /poster Thai Contemporary Typography Biennial size=A1',
      desc: 'POSTER + TYPOGRAPHY + COMPOSITION + COLOR + IMAGE + PRINT + QA',
    },
    {
      label: 'Research Journal',
      icon: FileText,
      cmd: '/design /journal NRRU Engineering & Applied Sciences Journal',
      desc: 'JOURNAL + EDITORIAL + GRID + TYPOGRAPHY + ACADEMIC + MULTILINGUAL + PRINT + QA',
    },
  ];

  return (
    <div
      className={`rounded-xl p-4 shadow-lg transition-colors ${
        isHighContrast
          ? 'bg-black border-2 border-yellow-400 text-white'
          : isPrintView
          ? 'bg-white border border-slate-300 text-slate-900 shadow-sm'
          : 'bg-[#0b1017] border border-slate-800 text-slate-100'
      }`}
    >
      <div
        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b transition-colors ${
          isHighContrast
            ? 'border-yellow-400'
            : isPrintView
            ? 'border-slate-200'
            : 'border-slate-800/80'
        }`}
      >
        <div className="flex items-center gap-2">
          <Terminal className={`w-4 h-4 ${isHighContrast ? 'text-yellow-400' : isPrintView ? 'text-blue-600' : 'text-sky-400'}`} />
          <span
            className={`text-xs font-mono font-bold uppercase tracking-wider ${
              isHighContrast
                ? 'text-white'
                : isPrintView
                ? 'text-slate-800'
                : 'text-slate-200'
            }`}
          >
            Command Router Terminal &amp; Master Pipeline
          </span>
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded border flex items-center gap-1 ${
              isHighContrast
                ? 'bg-black text-cyan-300 border-2 border-cyan-400 font-bold'
                : isPrintView
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            ROUTER ACTIVE
          </span>
        </div>
        <div className="text-[11px] font-mono flex items-center gap-1.5 flex-wrap opacity-75">
          <span>Try <code className="font-bold">/design</code>, <code>/book</code>, <code>/journal</code>, <code>/qa</code></span>
          <span className="hidden md:inline">•</span>
          <span className="hidden md:inline">
            Press <kbd className="px-1.5 py-0.5 rounded border text-[10px] font-bold">⌘K</kbd> for Command Palette
          </span>
        </div>
      </div>

      {/* Preset Scenarios Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 mb-3">
        {quickPresets.map((p) => {
          const Icon = p.icon;
          return (
            <button
              key={p.label}
              id={`preset-${p.label.toLowerCase().replace(/\s+/g, '-')}`}
              type="button"
              onClick={() => {
                setInputVal(p.cmd);
                onExecuteCommand(p.cmd);
              }}
              disabled={isLoading}
              className="text-left p-2.5 rounded-lg bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-sky-600/50 transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-slate-200 group-hover:text-sky-300 flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5 text-sky-400" />
                  {p.label}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Auto-Load</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono line-clamp-1">
                {p.desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={`flex items-center rounded-lg overflow-hidden transition-all border ${
            isHighContrast
              ? 'bg-black border-2 border-white focus-within:border-yellow-400 focus-within:ring-2 focus-within:ring-yellow-400'
              : isPrintView
              ? 'bg-slate-50 border-slate-300 focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600'
              : 'bg-slate-950 border-slate-700/80 focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-500'
          }`}
        >
          <span
            className={`pl-3 pr-1 font-mono font-bold text-sm select-none ${
              isHighContrast
                ? 'text-yellow-400'
                : isPrintView
                ? 'text-blue-600'
                : 'text-sky-400'
            }`}
          >
            &gt;
          </span>
          <input
            id="input-terminal-command"
            type="text"
            value={inputVal}
            onChange={(e) => {
              setInputVal(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Type command or /design [brief] (e.g. /design /book Academic monograph for NRRU)"
            className={`w-full bg-transparent py-2.5 px-2 text-xs sm:text-sm font-mono focus:outline-none ${
              isHighContrast
                ? 'text-white placeholder-zinc-400'
                : isPrintView
                ? 'text-slate-900 placeholder-slate-400'
                : 'text-slate-100 placeholder-slate-500'
            }`}
            disabled={isLoading}
          />
          <button
            id="btn-submit-command"
            type="submit"
            disabled={isLoading || !inputVal.trim()}
            className={`px-4 py-2.5 disabled:opacity-50 font-mono text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 ${
              isHighContrast
                ? 'bg-yellow-400 hover:bg-yellow-300 text-black font-bold'
                : isPrintView
                ? 'bg-blue-600 hover:bg-blue-500 text-white'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            }`}
          >
            {isLoading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>ROUTING...</span>
              </>
            ) : (
              <>
                <CornerDownLeft className="w-3.5 h-3.5" />
                <span>EXECUTE</span>
              </>
            )}
          </button>
        </div>

        {/* Autocomplete Dropdown */}
        {showSuggestions && suggestions.length > 0 && inputVal.startsWith('/') && (
          <div className="absolute left-0 right-0 top-full mt-1 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden font-mono text-xs">
            <div className="p-1.5 bg-slate-950/80 text-[10px] text-slate-400 uppercase tracking-wider border-b border-slate-800">
              Command Router Suggestions
            </div>
            {suggestions.map((s) => (
              <button
                key={s.command}
                type="button"
                onClick={() => {
                  setInputVal(s.command + ' ');
                  setShowSuggestions(false);
                }}
                className="w-full text-left px-3 py-2 hover:bg-slate-800/90 flex items-center justify-between border-b border-slate-800/40 last:border-b-0 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sky-400 font-bold">{s.command}</span>
                  <span className="text-slate-300 text-[11px] truncate max-w-sm sm:max-w-md">
                    {s.description}
                  </span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                  {s.category}
                </span>
              </button>
            ))}
          </div>
        )}
      </form>
    </div>
  );
};
