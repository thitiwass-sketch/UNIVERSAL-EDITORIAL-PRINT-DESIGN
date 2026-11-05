export type OSVersion = 'v7.0' | 'v8.0' | 'v9.0';

export type EngineCategory =
  | 'Editorial'
  | 'Visual'
  | 'Academic'
  | 'Print'
  | 'International'
  | 'Creative Intelligence'
  | 'Future Engines';

export type EngineStatus = 'STABLE' | 'ACTIVE' | 'INTELLIGENT' | 'FUTURE_READY' | 'DEPRECATED';

export interface EngineContract {
  id: string;
  name: string;
  version: string;
  category: EngineCategory;
  purpose: string;
  triggers: string[];
  inputs: string[];
  rules: string[];
  parameters: Record<string, any>;
  dependencies: string[];
  process: string[];
  outputs: string[];
  qaRequirements: string[];
  compatibility: string;
  priority: number;
  status: EngineStatus;
  isFuture?: boolean;
}

export interface CommandDefinition {
  command: string;
  description: string;
  category: string;
  resolvedEngines: string[];
  syntax: string;
  example: string;
}

export interface QACategoryScore {
  id: string;
  title: string;
  maxScore: 10;
  score: number;
  weight: number;
  criteria: string[];
  findings: string[];
  status: 'PASS' | 'WARNING' | 'FAIL';
}

export interface QAGateResult {
  totalScore: number;
  passingThreshold: number;
  status: 'PASS' | 'REVISION_REQUIRED' | 'FAIL';
  categories: QACategoryScore[];
  verdict: string;
  criticisms: string[];
  requiredRevisions: string[];
  timestamp: string;
}

export interface DesignCriticReport {
  strengths: string[];
  tensions: string[];
  refinements: string[];
  structuralIntegrityScore: number;
  typographicHarmonyScore: number;
  productionFeasibilityScore: number;
}

export interface PrintProductionSpecs {
  mediaClass: string;
  trimmedDimensions: {
    widthMm: number;
    heightMm: number;
    widthPt: number;
    heightPt: number;
    standardName: string;
  };
  bleedMm: number;
  slugMm: number;
  marginsMm: {
    top: number;
    bottom: number;
    inside: number;
    outside: number;
  };
  grid: {
    columns: number;
    gutterMm: number;
    rows?: number;
    baselineGridPt: number;
    system: string;
  };
  colorSpace: 'CMYK' | 'CMYK + Spot Pantone' | 'Monochrome K' | 'Duotone';
  cmykPlates: {
    cyan: string;
    magenta: string;
    yellow: string;
    black: string;
    spotPantone?: string;
  };
  paperStock: {
    name: string;
    weightGsm: number;
    finish: 'Uncoated Tactile' | 'Coated Silk' | 'Recycled Craft' | 'Japanese Ivory Book';
    bulkCaliber: string;
    opacityPercent: number;
  };
  binding: {
    method: 'Smyth Sewn Hardcover' | 'Perfect Binding' | 'Saddle Stitch' | 'Wire-O' | 'Singer Sewn';
    spineWidthMm: number;
    creasing: string;
  };
  finishing: string[];
  prepressChecklist: {
    item: string;
    status: 'Verified' | 'Attention' | 'Compliant';
  }[];
}

export interface ActiveProjectState {
  id: string;
  title: string;
  creator: string;
  affiliation: string;
  brief: string;
  command: string;
  projectType: string;
  media: string;
  osVersion: OSVersion;
  activeEngineIds: string[];
  strategyConcept: string;
  visualLanguage: string;
  typography: {
    headlineFont: string;
    bodyFont: string;
    thaiFont: string;
    scaleRatio: number;
    headlinePt: number;
    bodyPt: number;
    leadingPt: number;
    thaiLeadingCompensationPt: number;
    sampleHeadline: string;
    sampleSubhead: string;
    sampleBody: string;
    sampleThaiBody: string;
  };
  palette: {
    name: string;
    hex: string;
    cmyk: string;
    role: string;
  }[];
  specs: PrintProductionSpecs;
  qaGate: QAGateResult;
  critic: DesignCriticReport;
  pipelineLog: {
    timestamp: string;
    stage: string;
    engine?: string;
    message: string;
  }[];
}

export type PipelineStage =
  | 'idle'
  | 'command_routing'
  | 'project_analyzer'
  | 'core_os_validation'
  | 'engine_discovery'
  | 'dependency_resolution'
  | 'orchestration'
  | 'active_engines'
  | 'design_critic'
  | 'qa_gate'
  | 'final_output';
