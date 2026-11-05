import { ActiveProjectState } from '../types/os';
import { ProjectSnapshot, VersionDiffResult, SnapshotTag } from '../types/versionHistory';

/**
 * Format timestamp into human readable localized string
 */
export function formatSnapshotTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

/**
 * Extract summary statistics for a snapshot from an ActiveProjectState
 */
export function extractSnapshotStats(project: ActiveProjectState) {
  return {
    qaScore: project.qaGate.totalScore,
    qaStatus: project.qaGate.status,
    engineCount: project.activeEngineIds.length,
    formatName: project.projectType,
    dimensions: `${project.specs.trimmedDimensions.widthMm} × ${project.specs.trimmedDimensions.heightMm} mm`,
    colorSpace: project.specs.colorSpace,
    primaryFont: project.typography.headlineFont,
  };
}

/**
 * Generates default realistic historical snapshots for a base project
 * to demonstrate historical progression of the editorial design.
 */
export function generateDefaultMilestones(baseProject: ActiveProjectState): ProjectSnapshot[] {
  const now = new Date();
  
  // v1.0 — Initial Concept & Type Hierarchy (3 days earlier)
  const dateV10 = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000 - 45 * 60 * 1000);
  const v10Project: ActiveProjectState = {
    ...baseProject,
    activeEngineIds: baseProject.activeEngineIds.slice(0, Math.max(6, baseProject.activeEngineIds.length - 6)),
    qaGate: {
      ...baseProject.qaGate,
      totalScore: 84,
      status: 'REVISION_REQUIRED',
      verdict: 'Baseline grid requires strict 14pt alignment lock. Color separation draft verified.',
    },
    specs: {
      ...baseProject.specs,
      colorSpace: 'CMYK',
      bleedMm: 2.0,
    },
    pipelineLog: [
      {
        timestamp: dateV10.toISOString(),
        stage: 'command_routing',
        message: 'Initial project initialized from design intent brief.',
      },
    ],
  };

  // v1.1 — Thai Orthographic & Grid Alignment (2 days earlier)
  const dateV11 = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 - 15 * 60 * 1000);
  const v11Project: ActiveProjectState = {
    ...baseProject,
    activeEngineIds: baseProject.activeEngineIds.slice(0, Math.max(8, baseProject.activeEngineIds.length - 3)),
    qaGate: {
      ...baseProject.qaGate,
      totalScore: 92,
      status: 'PASS',
      verdict: 'Thai orthographic stacking locked. Baseline rhythm aligned.',
    },
    specs: {
      ...baseProject.specs,
      bleedMm: 3.0,
    },
  };

  // v1.2 — Color Separation & Spot Plate Calibration (1 day earlier)
  const dateV12 = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000 - 30 * 60 * 1000);
  const v12Project: ActiveProjectState = {
    ...baseProject,
    activeEngineIds: baseProject.activeEngineIds.slice(0, Math.max(10, baseProject.activeEngineIds.length - 1)),
    qaGate: {
      ...baseProject.qaGate,
      totalScore: 97,
      status: 'PASS',
    },
  };

  // v1.3 — Current Prepress Master
  const v13Project: ActiveProjectState = {
    ...baseProject,
  };

  return [
    {
      id: `snap-${baseProject.id}-v10`,
      versionNumber: '1.0',
      versionName: 'v1.0 — Initial Layout & Concept Grid',
      tag: 'Draft',
      description: 'First functional layout draft. Monograph structure created with primary baseline grid and bilingual type pairing.',
      timestamp: dateV10.toISOString(),
      createdAtFormatted: formatSnapshotTime(dateV10.toISOString()),
      author: baseProject.creator,
      projectState: v10Project,
      isInitialSeed: true,
      stats: extractSnapshotStats(v10Project),
    },
    {
      id: `snap-${baseProject.id}-v11`,
      versionNumber: '1.1',
      versionName: 'v1.1 — Thai Orthographic Stacking Lock',
      tag: 'Typography Revision',
      description: 'Calibrated Thai vowel and tone mark clearance (+18% leading compensation). Extended Van de Graaf margin canons.',
      timestamp: dateV11.toISOString(),
      createdAtFormatted: formatSnapshotTime(dateV11.toISOString()),
      author: baseProject.creator,
      projectState: v11Project,
      isInitialSeed: true,
      stats: extractSnapshotStats(v11Project),
    },
    {
      id: `snap-${baseProject.id}-v12`,
      versionNumber: '1.2',
      versionName: 'v1.2 — Color Separation & Spot Pantone 872 C',
      tag: 'Color Separation',
      description: 'Offset separation plates calibrated for ISO 12647-2. Embedded metallic spot plate foil and rich black solids.',
      timestamp: dateV12.toISOString(),
      createdAtFormatted: formatSnapshotTime(dateV12.toISOString()),
      author: baseProject.creator,
      projectState: v12Project,
      isInitialSeed: true,
      stats: extractSnapshotStats(v12Project),
    },
    {
      id: `snap-${baseProject.id}-v13`,
      versionNumber: '1.3',
      versionName: 'v1.3 — Prepress Production Master (FOGRA39)',
      tag: 'Prepress Proof',
      description: 'Final prepress certification pass. 100/100 QA Gate rating with 0 anti-slop violations and full press embellishment spec.',
      timestamp: now.toISOString(),
      createdAtFormatted: formatSnapshotTime(now.toISOString()),
      author: baseProject.creator,
      projectState: v13Project,
      isInitialSeed: true,
      stats: extractSnapshotStats(v13Project),
    },
  ];
}

/**
 * Computes difference between two snapshots or project states
 */
export function computeVersionDiff(
  prev: ActiveProjectState,
  current: ActiveProjectState
): VersionDiffResult {
  const prevEngines = new Set(prev.activeEngineIds);
  const currEngines = new Set(current.activeEngineIds);

  const enginesAdded = current.activeEngineIds.filter((e) => !prevEngines.has(e));
  const enginesRemoved = prev.activeEngineIds.filter((e) => !currEngines.has(e));

  const titleChanged = prev.title !== current.title;
  const formatChanged = prev.projectType !== current.projectType;
  const qaScoreDelta = current.qaGate.totalScore - prev.qaGate.totalScore;
  const engineDelta = current.activeEngineIds.length - prev.activeEngineIds.length;

  const dimensionsChanged =
    prev.specs.trimmedDimensions.widthMm !== current.specs.trimmedDimensions.widthMm ||
    prev.specs.trimmedDimensions.heightMm !== current.specs.trimmedDimensions.heightMm;

  const fontPairingChanged =
    prev.typography.headlineFont !== current.typography.headlineFont ||
    prev.typography.bodyFont !== current.typography.bodyFont ||
    prev.typography.scaleRatio !== current.typography.scaleRatio;

  const paletteChanged =
    prev.palette.length !== current.palette.length ||
    prev.palette.map((p) => p.hex).join(',') !== current.palette.map((p) => p.hex).join(',');

  const notableSummary: string[] = [];

  if (qaScoreDelta !== 0) {
    notableSummary.push(
      `QA Score ${qaScoreDelta > 0 ? `improved by +${qaScoreDelta}` : `dropped by ${qaScoreDelta}`} pts (${prev.qaGate.totalScore} → ${current.qaGate.totalScore})`
    );
  }
  if (enginesAdded.length > 0) {
    notableSummary.push(`Added ${enginesAdded.length} engine contract${enginesAdded.length > 1 ? 's' : ''}: ${enginesAdded.join(', ')}`);
  }
  if (enginesRemoved.length > 0) {
    notableSummary.push(`Removed ${enginesRemoved.length} engine${enginesRemoved.length > 1 ? 's' : ''}`);
  }
  if (dimensionsChanged) {
    notableSummary.push(
      `Trim size changed: ${prev.specs.trimmedDimensions.widthMm}×${prev.specs.trimmedDimensions.heightMm}mm → ${current.specs.trimmedDimensions.widthMm}×${current.specs.trimmedDimensions.heightMm}mm`
    );
  }
  if (fontPairingChanged) {
    notableSummary.push(
      `Typography updated: ${current.typography.headlineFont} / ${current.typography.bodyFont} (${current.typography.scaleRatio}x)`
    );
  }
  if (paletteChanged) {
    notableSummary.push(`Color separation palette revised (${current.palette.length} ink channels)`);
  }

  return {
    titleChanged,
    formatChanged,
    qaScoreDelta,
    engineDelta,
    enginesAdded,
    enginesRemoved,
    dimensionsChanged,
    fontPairingChanged,
    paletteChanged,
    notableSummary: notableSummary.length > 0 ? notableSummary : ['Identical core structure and parameters.'],
  };
}

/**
 * Creates a brand new snapshot object from current state
 */
export function createNewSnapshot(
  projectState: ActiveProjectState,
  versionName: string,
  tag: SnapshotTag,
  description: string,
  author?: string
): ProjectSnapshot {
  const now = new Date();
  const id = `snap-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  // Parse or determine version number
  const match = versionName.match(/v?(\d+\.?\d*)/i);
  const versionNumber = match ? match[1] : '1.0';

  return {
    id,
    versionNumber,
    versionName: versionName.trim(),
    tag,
    description: description.trim() || 'Custom user checkpoint snapshot saved from Project Canvas.',
    timestamp: now.toISOString(),
    createdAtFormatted: formatSnapshotTime(now.toISOString()),
    author: author || projectState.creator,
    projectState: JSON.parse(JSON.stringify(projectState)), // deep clone
    stats: extractSnapshotStats(projectState),
  };
}
