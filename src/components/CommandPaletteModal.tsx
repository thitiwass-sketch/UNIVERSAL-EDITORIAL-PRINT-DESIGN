/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  Sliders,
  Layers,
  ShieldCheck,
  Sparkles,
  FileDown,
  FileText,
  Terminal,
  BookOpen,
  Image as ImageIcon,
  Check,
  CornerDownLeft,
  X,
  Keyboard,
  Info,
  LayoutTemplate,
  Camera,
  History,
  Type,
  Grid,
  Palette,
  Sun,
  Moon,
  Contrast,
} from 'lucide-react';
import { ENGINE_REGISTRY } from '../data/engineRegistry';
import { COMMAND_DEFINITIONS } from '../data/commandRouter';
import { SAMPLE_PROJECTS } from '../data/sampleProjects';
import { EngineContract } from '../types/os';
import { useTheme } from '../context/ThemeContext';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchTab: (tab: 'canvas' | 'registry' | 'qa' | 'critic' | 'theme') => void;
  onOpenExport: () => void;
  onOpenSpecs: () => void;
  onOpenCoreOS: () => void;
  onOpenShortcutsHelp: () => void;
  onOpenTemplates: () => void;
  onSaveSnapshot?: () => void;
  onOpenVersionHistory?: () => void;
  activeEngineIds: string[];
  onToggleEngine: (engineId: string) => void;
  onExecuteCommand: (cmd: string) => void;
  modSymbol: string;
}

interface PaletteItem {
  id: string;
  title: string;
  subtitle?: string;
  category: 'Navigation & Views' | 'Engines' | 'Preset Scenarios' | 'CLI Commands';
  icon: React.ComponentType<{ className?: string }>;
  shortcutBadge?: string;
  isActiveEngine?: boolean;
  onSelect: () => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onSwitchTab,
  onOpenExport,
  onOpenSpecs,
  onOpenCoreOS,
  onOpenShortcutsHelp,
  onOpenTemplates,
  onSaveSnapshot,
  onOpenVersionHistory,
  activeEngineIds,
  onToggleEngine,
  onExecuteCommand,
  modSymbol,
}) => {
  const { setThemeMode } = useTheme();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Focus input whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Construct search items
  const items: PaletteItem[] = useMemo(() => {
    const list: PaletteItem[] = [];

    // 1. Navigation items
    list.push(
      {
        id: 'nav-canvas',
        title: 'Switch to Interactive Canvas & Press Sheet',
        subtitle: 'View live mechanical spread, trim marks, folios, and color plates',
        category: 'Navigation & Views',
        icon: Sliders,
        shortcutBadge: `${modSymbol}1`,
        onSelect: () => {
          onSwitchTab('canvas');
          onClose();
        },
      },
      {
        id: 'nav-registry',
        title: 'Switch to Engine Registry & Contracts',
        subtitle: 'Browse, inspect, and toggle 30+ production engines',
        category: 'Navigation & Views',
        icon: Layers,
        shortcutBadge: `${modSymbol}2`,
        onSelect: () => {
          onSwitchTab('registry');
          onClose();
        },
      },
      {
        id: 'nav-qa',
        title: 'Switch to 100-Point QA Gate Inspector',
        subtitle: 'Audit prepress compliance, bleed tolerance, and scoring breakdown',
        category: 'Navigation & Views',
        icon: ShieldCheck,
        shortcutBadge: `${modSymbol}3`,
        onSelect: () => {
          onSwitchTab('qa');
          onClose();
        },
      },
      {
        id: 'nav-critic',
        title: 'Switch to Design Critic & Anti-Slop Audit',
        subtitle: 'Review typography tension, whitespace balance, and stylistic critique',
        category: 'Navigation & Views',
        icon: Sparkles,
        shortcutBadge: `${modSymbol}4`,
        onSelect: () => {
          onSwitchTab('critic');
          onClose();
        },
      },
      {
        id: 'nav-theme',
        title: 'Switch to Theme Settings & Display Modes',
        subtitle: 'Toggle System-Default (Studio Dark), High-Contrast (AAA), and Professional Print View (White Background)',
        category: 'Navigation & Views',
        icon: Palette,
        shortcutBadge: `${modSymbol}5`,
        onSelect: () => {
          onSwitchTab('theme');
          onClose();
        },
      },
      {
        id: 'theme-mode-system-default',
        title: 'Activate Theme: System Default (Studio Dark)',
        subtitle: 'Deep obsidian (#070a0f) workbench for long design sessions',
        category: 'Navigation & Views',
        icon: Moon,
        onSelect: () => {
          setThemeMode('system-default');
          onClose();
        },
      },
      {
        id: 'theme-mode-high-contrast',
        title: 'Activate Theme: High Contrast (WCAG AAA Accessible)',
        subtitle: 'Pure black (#000000) with vivid yellow/cyan borders for maximum legibility',
        category: 'Navigation & Views',
        icon: Contrast,
        onSelect: () => {
          setThemeMode('high-contrast');
          onClose();
        },
      },
      {
        id: 'theme-mode-print-view',
        title: 'Activate Theme: Professional Print View (White Background)',
        subtitle: 'White substrate (#f8fafc) and dark ink simulating ISO 3664 D50 press proofing',
        category: 'Navigation & Views',
        icon: Sun,
        onSelect: () => {
          setThemeMode('professional-print-view');
          onClose();
        },
      },
      {
        id: 'nav-templates',
        title: 'Open Project Template Selector',
        subtitle: 'Initialize project with Magazine Spread, Print Flyer, Digital Newsletter, or Book Cover',
        category: 'Navigation & Views',
        icon: LayoutTemplate,
        shortcutBadge: `${modSymbol}T`,
        onSelect: () => {
          onClose();
          onOpenTemplates();
        },
      },
      {
        id: 'action-save-snapshot',
        title: 'Save Project State Snapshot',
        subtitle: 'Capture an immutable state checkpoint of current canvas, baseline grid, and prepress specs',
        category: 'Navigation & Views',
        icon: Camera,
        shortcutBadge: `${modSymbol}S`,
        onSelect: () => {
          onClose();
          if (onSaveSnapshot) onSaveSnapshot();
        },
      },
      {
        id: 'action-cmyk-harmony',
        title: 'Suggest Harmonious CMYK Palettes from Assets',
        subtitle: 'Extract dominant pigments from loaded graphics and derive ISO 12647-2 print palettes',
        category: 'Navigation & Views',
        icon: Sparkles,
        onSelect: () => {
          onSwitchTab('canvas');
          onClose();
        },
      },
      {
        id: 'action-typography-previewer',
        title: 'Test Typography Pairings & Print Viability',
        subtitle: 'Audit font combinations, leading ratios, and CPL against editorial sample texts',
        category: 'Navigation & Views',
        icon: Type,
        shortcutBadge: `${modSymbol}T`,
        onSelect: () => {
          onSwitchTab('canvas');
          onClose();
        },
      },
      {
        id: 'action-ai-font-recommender',
        title: 'AI Font Pairing Recommender (Theme & Mood Driven)',
        subtitle: 'Synthesize harmonious headline and body font combinations based on project mood and stock',
        category: 'Navigation & Views',
        icon: Sparkles,
        onSelect: () => {
          onSwitchTab('canvas');
          onClose();
        },
      },
      {
        id: 'action-baseline-grid-overlay',
        title: 'Toggle Baseline Grid Overlay in Typography Previewer',
        subtitle: 'Visually illustrate leading, line pitch, and vertical alignment against layout grid',
        category: 'Navigation & Views',
        icon: Grid,
        onSelect: () => {
          onSwitchTab('canvas');
          onClose();
        },
      },
      {
        id: 'nav-version-history',
        title: 'Open Version History & Snapshot Timeline',
        subtitle: 'Browse and restore previous checkpoints or compare diffs directly in Canvas',
        category: 'Navigation & Views',
        icon: History,
        shortcutBadge: `${modSymbol}H`,
        onSelect: () => {
          onClose();
          if (onOpenVersionHistory) onOpenVersionHistory();
        },
      },
      {
        id: 'nav-export',
        title: 'Open Project Export Center',
        subtitle: 'Generate ISO 12647-2 PDF Prepress Manifest or JSON Project Archive',
        category: 'Navigation & Views',
        icon: FileDown,
        shortcutBadge: `${modSymbol}E`,
        onSelect: () => {
          onClose();
          onOpenExport();
        },
      },
      {
        id: 'nav-specs',
        title: 'Open Prepress Production Specs Sheet',
        subtitle: 'View plain-text machine calibration parameters & bindery specs',
        category: 'Navigation & Views',
        icon: FileText,
        shortcutBadge: `${modSymbol}P`,
        onSelect: () => {
          onClose();
          onOpenSpecs();
        },
      },
      {
        id: 'nav-coreos',
        title: 'Open Core OS Architectural Constitution',
        subtitle: 'Review foundational principles, hierarchy of rules, and engineering manifesto',
        category: 'Navigation & Views',
        icon: Info,
        shortcutBadge: `${modSymbol}⇧O`,
        onSelect: () => {
          onClose();
          onOpenCoreOS();
        },
      },
      {
        id: 'nav-shortcuts',
        title: 'Show Keyboard Shortcuts Cheat Sheet',
        subtitle: 'View all professional global keybindings and commands',
        category: 'Navigation & Views',
        icon: Keyboard,
        shortcutBadge: `${modSymbol}/`,
        onSelect: () => {
          onClose();
          onOpenShortcutsHelp();
        },
      }
    );

    // 2. Preset Scenarios
    SAMPLE_PROJECTS.forEach((proj) => {
      list.push({
        id: `preset-${proj.id}`,
        title: `Load Scenario: ${proj.title}`,
        subtitle: `${proj.media} • ${proj.projectType} (${proj.activeEngineIds.length} engines)`,
        category: 'Preset Scenarios',
        icon: proj.projectType === 'POSTER' ? ImageIcon : proj.projectType === 'JOURNAL' ? FileText : BookOpen,
        onSelect: () => {
          onExecuteCommand(proj.command);
          onClose();
        },
      });
    });

    // 3. Engine Toggles (All 30+ engines)
    ENGINE_REGISTRY.forEach((engine: EngineContract) => {
      const isCurrentlyActive = activeEngineIds.includes(engine.id);
      list.push({
        id: `engine-${engine.id}`,
        title: `${engine.name} (${engine.id})`,
        subtitle: `${engine.category} • ${engine.purpose}`,
        category: 'Engines',
        icon: Layers,
        isActiveEngine: isCurrentlyActive,
        shortcutBadge: isCurrentlyActive ? 'ACTIVE' : 'INACTIVE',
        onSelect: () => {
          onToggleEngine(engine.id);
        },
      });
    });

    // 4. CLI Commands
    COMMAND_DEFINITIONS.forEach((cmd) => {
      list.push({
        id: `cmd-${cmd.command}`,
        title: `Execute ${cmd.command}`,
        subtitle: `${cmd.description} (Example: ${cmd.example})`,
        category: 'CLI Commands',
        icon: Terminal,
        onSelect: () => {
          onExecuteCommand(cmd.example);
          onClose();
        },
      });
    });

    return list;
  }, [
    modSymbol,
    onSwitchTab,
    onClose,
    onOpenExport,
    onOpenSpecs,
    onOpenCoreOS,
    onOpenShortcutsHelp,
    onExecuteCommand,
    activeEngineIds,
    onToggleEngine,
  ]);

  // Filter items based on query
  const filteredItems = useMemo(() => {
    if (!query.trim()) return items;
    const lowerQuery = query.toLowerCase().trim();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(lowerQuery) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(lowerQuery)) ||
        item.category.toLowerCase().includes(lowerQuery) ||
        (item.shortcutBadge && item.shortcutBadge.toLowerCase().includes(lowerQuery))
    );
  }, [items, query]);

  // Reset selected index when filtered items change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredItems.length, query]);

  // Scroll active item into view
  useEffect(() => {
    const listEl = listRef.current;
    if (listEl) {
      const activeEl = listEl.querySelector(`[data-index="${selectedIndex}"]`) as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  // Keyboard navigation within the palette
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1 < filteredItems.length ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : filteredItems.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].onSelect();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-12 sm:pt-20 px-3 sm:px-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-[#0b1017] border border-slate-700/80 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden font-mono flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Header */}
        <div className="p-3.5 border-b border-slate-800 flex items-center gap-3 bg-slate-950/80">
          <Search className="w-5 h-5 text-sky-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, engine name, view, or scenario..."
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
              <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">Esc to close</span>
            </div>
          )}
        </div>

        {/* Results List */}
        <div ref={listRef} className="overflow-y-auto p-2 divide-y divide-slate-800/40">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              No matching commands or engines found for &quot;<span className="text-slate-300">{query}</span>&quot;.
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              const Icon = item.icon;

              return (
                <div
                  key={item.id}
                  data-index={index}
                  onClick={item.onSelect}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`px-3 py-2.5 rounded-lg flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-indigo-600/25 border border-indigo-500/50 text-white'
                      : 'hover:bg-slate-900/60 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-900 border border-slate-800 text-sky-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold truncate text-slate-100">
                          {item.title}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-900/80 text-slate-400 border border-slate-800">
                          {item.category}
                        </span>
                      </div>
                      {item.subtitle && (
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.isActiveEngine !== undefined && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold flex items-center gap-1 ${
                          item.isActiveEngine
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/80'
                            : 'bg-slate-900 text-slate-500 border border-slate-800'
                        }`}
                      >
                        {item.isActiveEngine && <Check className="w-3 h-3 text-emerald-400" />}
                        {item.isActiveEngine ? 'LOADED' : 'INACTIVE'}
                      </span>
                    )}

                    {item.shortcutBadge && item.isActiveEngine === undefined && (
                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700/80 font-mono font-bold">
                        {item.shortcutBadge}
                      </span>
                    )}

                    {isSelected && (
                      <span className="text-slate-400 text-[10px] hidden sm:flex items-center gap-0.5">
                        <CornerDownLeft className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div className="p-2.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-[11px] text-slate-400 px-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300">↓</kbd>
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300">↵</kbd>
              <span>to select/toggle</span>
            </span>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300">Esc</kbd>
            <span>to close</span>
          </div>
        </div>
      </div>
    </div>
  );
};
