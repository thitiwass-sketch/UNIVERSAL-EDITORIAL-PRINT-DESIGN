/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';

export interface ShortcutDefinition {
  id: string;
  keyCombo: string; // e.g. "⌘K" or "Ctrl+K"
  macKeys: string;
  winKeys: string;
  description: string;
  category: 'Navigation' | 'Prepress & Export' | 'Engine & Command' | 'System';
  action: () => void;
}

interface UseKeyboardShortcutsOptions {
  onOpenCommandPalette: () => void;
  onOpenExport: () => void;
  onOpenEngineRegistry: () => void;
  onOpenTemplateSelector: () => void;
  onSaveSnapshot?: () => void;
  onToggleVersionHistory?: () => void;
  onSwitchTab: (tab: 'canvas' | 'registry' | 'qa' | 'critic' | 'theme') => void;
  onOpenSpecs: () => void;
  onOpenCoreOS: () => void;
  onOpenShortcutsHelp: () => void;
  onCloseAnyModal: () => void;
  hasOpenModal: boolean;
}

export function useKeyboardShortcuts({
  onOpenCommandPalette,
  onOpenExport,
  onOpenEngineRegistry,
  onOpenTemplateSelector,
  onSaveSnapshot,
  onToggleVersionHistory,
  onSwitchTab,
  onOpenSpecs,
  onOpenCoreOS,
  onOpenShortcutsHelp,
  onCloseAnyModal,
  hasOpenModal,
}: UseKeyboardShortcutsOptions) {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      setIsMac(/(Mac|iPhone|iPod|iPad)/i.test(navigator.platform || navigator.userAgent));
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isModifier = e.metaKey || e.ctrlKey;
      const key = e.key.toLowerCase();

      // Escape key closes modals/palettes if open
      if (e.key === 'Escape') {
        if (hasOpenModal) {
          e.preventDefault();
          onCloseAnyModal();
          return;
        }
      }

      // Check if user is typing in an active text input or textarea
      const target = e.target as HTMLElement | null;
      const isInputFocused =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);

      // Question mark "?" opens shortcut guide when not actively typing in an input
      if (e.key === '?' && !isModifier && !isInputFocused) {
        e.preventDefault();
        onOpenShortcutsHelp();
        return;
      }

      // Modifier key combos (Cmd/Ctrl + ...)
      if (isModifier) {
        // Cmd+K: Command Palette
        if (key === 'k') {
          e.preventDefault();
          onOpenCommandPalette();
          return;
        }

        // Cmd+E: Export Center
        if (key === 'e') {
          e.preventDefault();
          onOpenExport();
          return;
        }

        // Cmd+R: Engine Registry (intercept default browser reload to improve workflow)
        if (key === 'r' && !e.shiftKey) {
          e.preventDefault();
          onOpenEngineRegistry();
          return;
        }

        // Cmd+T: Project Template Selector (intercept default browser new tab)
        if (key === 't' && !e.shiftKey) {
          e.preventDefault();
          onOpenTemplateSelector();
          return;
        }

        // Cmd+S: Save Project Snapshot (intercept default browser save page)
        if (key === 's' && !e.shiftKey) {
          e.preventDefault();
          if (onSaveSnapshot) onSaveSnapshot();
          return;
        }

        // Cmd+H: Toggle Version History
        if (key === 'h' && !e.shiftKey) {
          e.preventDefault();
          if (onToggleVersionHistory) onToggleVersionHistory();
          return;
        }

        // Cmd+P: Prepress Spec Sheet (intercept default browser print dialog)
        if (key === 'p' && !e.shiftKey) {
          e.preventDefault();
          onOpenSpecs();
          return;
        }

        // Cmd+/: Keyboard Shortcuts
        if (e.key === '/' || e.code === 'Slash') {
          e.preventDefault();
          onOpenShortcutsHelp();
          return;
        }

        // Cmd+Shift+O: Core OS Constitution Modal
        if (key === 'o' && e.shiftKey) {
          e.preventDefault();
          onOpenCoreOS();
          return;
        }

        // Number keys for View switching: Cmd+1, Cmd+2, Cmd+3, Cmd+4, Cmd+5
        if (e.key === '1') {
          e.preventDefault();
          onSwitchTab('canvas');
          return;
        }
        if (e.key === '2') {
          e.preventDefault();
          onSwitchTab('registry');
          return;
        }
        if (e.key === '3') {
          e.preventDefault();
          onSwitchTab('qa');
          return;
        }
        if (e.key === '4') {
          e.preventDefault();
          onSwitchTab('critic');
          return;
        }
        if (e.key === '5') {
          e.preventDefault();
          onSwitchTab('theme');
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    hasOpenModal,
    onCloseAnyModal,
    onOpenCommandPalette,
    onOpenExport,
    onOpenEngineRegistry,
    onSwitchTab,
    onOpenSpecs,
    onOpenCoreOS,
    onOpenShortcutsHelp,
  ]);

  const modSymbol = isMac ? '⌘' : 'Ctrl';

  const shortcutList: ShortcutDefinition[] = [
    {
      id: 'cmd-k',
      keyCombo: `${modSymbol}K`,
      macKeys: '⌘K',
      winKeys: 'Ctrl+K',
      description: 'Open Command Palette & Engine Quick Switcher',
      category: 'Navigation',
      action: onOpenCommandPalette,
    },
    {
      id: 'cmd-e',
      keyCombo: `${modSymbol}E`,
      macKeys: '⌘E',
      winKeys: 'Ctrl+E',
      description: 'Open Project Export Center (PDF & JSON)',
      category: 'Prepress & Export',
      action: onOpenExport,
    },
    {
      id: 'cmd-r',
      keyCombo: `${modSymbol}R`,
      macKeys: '⌘R',
      winKeys: 'Ctrl+R',
      description: 'Switch to Engine Registry & Contracts',
      category: 'Engine & Command',
      action: onOpenEngineRegistry,
    },
    {
      id: 'cmd-t',
      keyCombo: `${modSymbol}T`,
      macKeys: '⌘T',
      winKeys: 'Ctrl+T',
      description: 'Open Project Template Selector (Magazine, Flyer, Newsletter)',
      category: 'Navigation',
      action: onOpenTemplateSelector,
    },
    {
      id: 'cmd-s',
      keyCombo: `${modSymbol}S`,
      macKeys: '⌘S',
      winKeys: 'Ctrl+S',
      description: 'Save State Snapshot of Current Project & Prepress Specs',
      category: 'Prepress & Export',
      action: () => onSaveSnapshot?.(),
    },
    {
      id: 'cmd-h',
      keyCombo: `${modSymbol}H`,
      macKeys: '⌘H',
      winKeys: 'Ctrl+H',
      description: 'Open Version History & Snapshot Timeline',
      category: 'Navigation',
      action: () => onToggleVersionHistory?.(),
    },
    {
      id: 'cmd-p',
      keyCombo: `${modSymbol}P`,
      macKeys: '⌘P',
      winKeys: 'Ctrl+P',
      description: 'Open Prepress Specification Sheet',
      category: 'Prepress & Export',
      action: onOpenSpecs,
    },
    {
      id: 'cmd-1',
      keyCombo: `${modSymbol}1`,
      macKeys: '⌘1',
      winKeys: 'Ctrl+1',
      description: 'Switch to Interactive Canvas & Press Sheet View',
      category: 'Navigation',
      action: () => onSwitchTab('canvas'),
    },
    {
      id: 'cmd-2',
      keyCombo: `${modSymbol}2`,
      macKeys: '⌘2',
      winKeys: 'Ctrl+2',
      description: 'Switch to Engine Registry View',
      category: 'Navigation',
      action: () => onSwitchTab('registry'),
    },
    {
      id: 'cmd-3',
      keyCombo: `${modSymbol}3`,
      macKeys: '⌘3',
      winKeys: 'Ctrl+3',
      description: 'Switch to 100-Point QA Gate Inspector',
      category: 'Navigation',
      action: () => onSwitchTab('qa'),
    },
    {
      id: 'cmd-4',
      keyCombo: `${modSymbol}4`,
      macKeys: '⌘4',
      winKeys: 'Ctrl+4',
      description: 'Switch to Design Critic & Anti-Slop Audit',
      category: 'Navigation',
      action: () => onSwitchTab('critic'),
    },
    {
      id: 'cmd-5',
      keyCombo: `${modSymbol}5`,
      macKeys: '⌘5',
      winKeys: 'Ctrl+5',
      description: 'Switch to Theme Settings & Display Modes',
      category: 'Navigation',
      action: () => onSwitchTab('theme'),
    },
    {
      id: 'cmd-shift-o',
      keyCombo: `${modSymbol}⇧O`,
      macKeys: '⌘⇧O',
      winKeys: 'Ctrl+Shift+O',
      description: 'Open Core OS Architectural Constitution',
      category: 'System',
      action: onOpenCoreOS,
    },
    {
      id: 'cmd-slash',
      keyCombo: `${modSymbol}/ or ?`,
      macKeys: '⌘/ or ?',
      winKeys: 'Ctrl+/ or ?',
      description: 'Show Keyboard Shortcuts Cheat Sheet',
      category: 'System',
      action: onOpenShortcutsHelp,
    },
    {
      id: 'esc',
      keyCombo: 'Esc',
      macKeys: 'Esc',
      winKeys: 'Esc',
      description: 'Close active modal, palette, or menu',
      category: 'System',
      action: onCloseAnyModal,
    },
  ];

  return {
    isMac,
    modSymbol,
    shortcutList,
  };
}
