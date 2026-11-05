/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import {
  ThemeMode,
  ThemeContextType,
  AmbientPreferences,
} from '../types/theme';
import { THEME_DEFINITIONS } from '../data/themeDefinitions';

const THEME_STORAGE_KEY = 'design_os_theme_mode';
const AMBIENT_STORAGE_KEY = 'design_os_ambient_prefs';

const DEFAULT_AMBIENT_PREFS: AmbientPreferences = {
  d50LightingSim: true,
  highLegibilityFonts: false,
  sharpBorders: false,
  canvasSurroundRulers: true,
  reducedMotion: false,
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
      if (
        saved === 'system-default' ||
        saved === 'high-contrast' ||
        saved === 'professional-print-view'
      ) {
        return saved;
      }
    }
    return 'system-default';
  });

  const [ambientPrefs, setAmbientPrefs] = useState<AmbientPreferences>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(AMBIENT_STORAGE_KEY);
        if (saved) {
          return { ...DEFAULT_AMBIENT_PREFS, ...JSON.parse(saved) };
        }
      } catch (e) {
        console.warn('Failed to parse saved ambient preferences', e);
      }
    }
    return DEFAULT_AMBIENT_PREFS;
  });

  // Apply theme to HTML root & body
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.setAttribute('data-theme', themeMode);
      root.classList.remove(
        'theme-system-default',
        'theme-high-contrast',
        'theme-professional-print-view'
      );
      root.classList.add(`theme-${themeMode}`);

      if (themeMode === 'professional-print-view') {
        document.body.style.backgroundColor = '#f8fafc';
        document.body.style.color = '#0f172a';
      } else if (themeMode === 'high-contrast') {
        document.body.style.backgroundColor = '#000000';
        document.body.style.color = '#ffffff';
      } else {
        document.body.style.backgroundColor = '#070a0f';
        document.body.style.color = '#e6edf3';
      }
    }
  }, [themeMode]);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem(THEME_STORAGE_KEY, mode);
    }
  }, []);

  const cycleThemeMode = useCallback(() => {
    setThemeModeState((curr) => {
      let next: ThemeMode = 'system-default';
      if (curr === 'system-default') next = 'high-contrast';
      else if (curr === 'high-contrast') next = 'professional-print-view';
      else next = 'system-default';

      if (typeof window !== 'undefined') {
        localStorage.setItem(THEME_STORAGE_KEY, next);
      }
      return next;
    });
  }, []);

  const resetToDefaultTheme = useCallback(() => {
    setThemeMode('system-default');
    setAmbientPrefs(DEFAULT_AMBIENT_PREFS);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(THEME_STORAGE_KEY);
      localStorage.removeItem(AMBIENT_STORAGE_KEY);
    }
  }, [setThemeMode]);

  const updateAmbientPref = useCallback(
    <K extends keyof AmbientPreferences>(key: K, value: AmbientPreferences[K]) => {
      setAmbientPrefs((prev) => {
        const updated = { ...prev, [key]: value };
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(AMBIENT_STORAGE_KEY, JSON.stringify(updated));
          } catch (e) {
            console.warn('Failed to save ambient preferences', e);
          }
        }
        return updated;
      });
    },
    []
  );

  const activeThemeInfo = THEME_DEFINITIONS[themeMode];
  const isSystemDefault = themeMode === 'system-default';
  const isHighContrast = themeMode === 'high-contrast';
  const isPrintView = themeMode === 'professional-print-view';

  const themeClasses = useMemo(() => {
    if (isHighContrast) {
      return {
        pageBg: 'bg-black',
        headerBg: 'bg-black border-b-2 border-yellow-400 text-white',
        cardBg: 'bg-black',
        cardBorder: 'border-2 border-yellow-400',
        textPrimary: 'text-white',
        textSecondary: 'text-yellow-300',
        textMuted: 'text-yellow-200',
        accent: 'text-yellow-400',
        inputBg: 'bg-black border-2 border-white text-white placeholder-slate-400',
        toolbarBg: 'bg-black border-2 border-yellow-400 text-white',
        badgeBg: 'bg-black border-2 border-yellow-400 text-yellow-300 font-bold',
      };
    }
    if (isPrintView) {
      return {
        pageBg: 'bg-slate-100',
        headerBg: 'bg-white/95 border-b border-slate-300 text-slate-900 shadow-sm',
        cardBg: 'bg-white',
        cardBorder: 'border-slate-300 shadow-sm',
        textPrimary: 'text-slate-900',
        textSecondary: 'text-slate-700',
        textMuted: 'text-slate-500',
        accent: 'text-blue-600',
        inputBg: 'bg-white border-slate-300 text-slate-900 placeholder-slate-400',
        toolbarBg: 'bg-slate-100 border-slate-300 text-slate-800',
        badgeBg: 'bg-blue-50 border border-blue-200 text-blue-700 font-medium',
      };
    }
    // Default studio dark
    return {
      pageBg: 'bg-[#070a0f]',
      headerBg: 'bg-[#0d121a]/95 border-b border-slate-800 text-slate-100',
      cardBg: 'bg-[#090d14]',
      cardBorder: 'border-slate-800',
      textPrimary: 'text-slate-100',
      textSecondary: 'text-slate-400',
      textMuted: 'text-slate-500',
      accent: 'text-indigo-400',
      inputBg: 'bg-slate-900 border-slate-700 text-slate-200 placeholder-slate-500',
      toolbarBg: 'bg-slate-900/90 border-slate-800 text-slate-300',
      badgeBg: 'bg-indigo-950/70 border border-indigo-700/80 text-indigo-300',
    };
  }, [isHighContrast, isPrintView]);

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        setThemeMode,
        cycleThemeMode,
        activeThemeInfo,
        ambientPrefs,
        updateAmbientPref,
        resetToDefaultTheme,
        isSystemDefault,
        isHighContrast,
        isPrintView,
        themeClasses,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
