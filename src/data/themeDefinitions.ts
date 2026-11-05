/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ThemeMetadata, ThemeMode } from '../types/theme';

export const THEME_DEFINITIONS: Record<ThemeMode, ThemeMetadata> = {
  'system-default': {
    id: 'system-default',
    name: 'System Default',
    tagline: 'Deep Studio Dark (Engine Default)',
    description:
      'Sleek dark room editorial workbench engineered for long design sessions. Features deep obsidian surfaces (#070a0f), sapphire telemetry, and muted slate dividers to preserve eye comfort during multi-hour layout production.',
    badge: 'DEFAULT OS',
    backgroundHex: '#070a0f',
    surfaceHex: '#0d121a',
    textHex: '#f1f5f9',
    accentHex: '#6366f1',
    borderHex: '#1e293b',
    wcagContrast: '6.4:1 (WCAG AA Compliant)',
    lightingSimulation: 'Dark Room 6500K Studio Display',
    recommendedFor: 'Editorial layout design, typesetting, and daily pipeline operations.',
    features: [
      'Low eye fatigue during nighttime and dim studio work',
      'Subtle slate-800 dividers for minimalist modular flow',
      'High dynamic range ink color previews',
      'Neon cyan/emerald status highlights',
    ],
  },
  'high-contrast': {
    id: 'high-contrast',
    name: 'High Contrast',
    tagline: 'WCAG AAA Accessible (Maximum Legibility)',
    description:
      'Ultra-high visual acuity mode built for accessibility standards and rigorous prepress auditing. Features pure pitch black (#000000), stark pure white typography (#ffffff), vivid yellow/cyan borders, and zero low-contrast text.',
    badge: 'WCAG AAA',
    backgroundHex: '#000000',
    surfaceHex: '#0a0a0a',
    textHex: '#ffffff',
    accentHex: '#facc15',
    borderHex: '#facc15',
    wcagContrast: '19.2:1 (Exceeds WCAG AAA)',
    lightingSimulation: 'Direct Glare & High Ambient Light Compensation',
    recommendedFor: 'Accessibility compliance, low-vision proofing, and strict prepress margin checks.',
    features: [
      'Stark pure black (#000000) grounding with pure white text',
      'Vivid yellow (#facc15) and cyan (#38bdf8) 2px borders',
      'Zero translucent or low-contrast sub-labels',
      'Prominent focus outlines for all interactive controls',
    ],
  },
  'professional-print-view': {
    id: 'professional-print-view',
    name: 'Professional Print View',
    tagline: 'White Background (ISO 3664 D50 Lightbox)',
    description:
      'Commercial pressroom inspection booth mode with a pristine white background (#f8fafc), rich dark ink typography (#0f172a), and neutral prepress grey dividers. Eliminates dark-mode optical bias when proofing physical printed sheets.',
    badge: 'PRINT PROOF D50',
    backgroundHex: '#f8fafc',
    surfaceHex: '#ffffff',
    textHex: '#0f172a',
    accentHex: '#2563eb',
    borderHex: '#cbd5e1',
    wcagContrast: '16.1:1 (Physical Ink Standard)',
    lightingSimulation: 'ISO 3664 Standard D50 (5000K) Proofing Station',
    recommendedFor: 'Prepress technicians, paper proofing review, ink coverage audit, and client sign-offs.',
    features: [
      'Pristine white paper background (#f8fafc) simulating physical sheet substrate',
      'Deep black ink text (#0f172a) matching commercial offset density',
      'Neutral grey (#cbd5e1) borders preventing metameric color shifts',
      'True-to-life bleed, slug, and trim visualization on daylight ground',
    ],
  },
};
