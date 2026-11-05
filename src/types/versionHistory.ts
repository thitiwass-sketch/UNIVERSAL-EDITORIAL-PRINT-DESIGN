import { ActiveProjectState } from './os';

export type SnapshotTag =
  | 'Milestone'
  | 'Prepress Proof'
  | 'Color Separation'
  | 'Typography Revision'
  | 'Client Review'
  | 'Draft'
  | 'Custom';

export interface ProjectSnapshot {
  id: string;
  versionNumber: string; // e.g., '1.0', '1.1', '1.2'
  versionName: string; // e.g., 'v1.0 — Initial Layout & Concept Grid'
  tag: SnapshotTag;
  description: string;
  timestamp: string; // ISO 8601
  createdAtFormatted: string;
  author: string;
  projectState: ActiveProjectState;
  isInitialSeed?: boolean;
  stats: {
    qaScore: number;
    qaStatus: 'PASS' | 'REVISION_REQUIRED' | 'FAIL';
    engineCount: number;
    formatName: string;
    dimensions: string;
    colorSpace: string;
    primaryFont: string;
  };
}

export interface VersionDiffResult {
  titleChanged: boolean;
  formatChanged: boolean;
  qaScoreDelta: number;
  engineDelta: number;
  enginesAdded: string[];
  enginesRemoved: string[];
  dimensionsChanged: boolean;
  fontPairingChanged: boolean;
  paletteChanged: boolean;
  notableSummary: string[];
}
