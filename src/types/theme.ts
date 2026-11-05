/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ThemeMode = 'system-default' | 'high-contrast' | 'professional-print-view';

export interface ThemeMetadata {
  id: ThemeMode;
  name: string;
  tagline: string;
  description: string;
  badge: string;
  backgroundHex: string;
  surfaceHex: string;
  textHex: string;
  accentHex: string;
  borderHex: string;
  wcagContrast: string;
  lightingSimulation: string;
  recommendedFor: string;
  features: string[];
}

export interface AmbientPreferences {
  d50LightingSim: boolean;
  highLegibilityFonts: boolean;
  sharpBorders: boolean;
  canvasSurroundRulers: boolean;
  reducedMotion: boolean;
}

export interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  cycleThemeMode: () => void;
  activeThemeInfo: ThemeMetadata;
  ambientPrefs: AmbientPreferences;
  updateAmbientPref: <K extends keyof AmbientPreferences>(key: K, value: AmbientPreferences[K]) => void;
  resetToDefaultTheme: () => void;
  isSystemDefault: boolean;
  isHighContrast: boolean;
  isPrintView: boolean;
  themeClasses: {
    pageBg: string;
    headerBg: string;
    cardBg: string;
    cardBorder: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    accent: string;
    inputBg: string;
    toolbarBg: string;
    badgeBg: string;
  };
}
