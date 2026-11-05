import { useState, useEffect, useCallback } from 'react';
import { ActiveProjectState } from '../types/os';
import { ProjectSnapshot, SnapshotTag } from '../types/versionHistory';
import { generateDefaultMilestones, createNewSnapshot } from '../utils/versionHistoryHelper';

const STORAGE_KEY_PREFIX = 'nrru_design_os_snapshots_';

export function useVersionHistory(
  currentProject: ActiveProjectState,
  onRestoreProject: (project: ActiveProjectState) => void
) {
  const [snapshots, setSnapshots] = useState<ProjectSnapshot[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${currentProject.id}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return generateDefaultMilestones(currentProject);
  });

  const [activeSnapshotId, setActiveSnapshotId] = useState<string>(() => {
    // Default to latest snapshot
    const initial = generateDefaultMilestones(currentProject);
    return initial[initial.length - 1]?.id || '';
  });

  // Track if project changes externally (e.g. project template switched)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${currentProject.id}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSnapshots(parsed);
          setActiveSnapshotId(parsed[parsed.length - 1]?.id || '');
          return;
        }
      }
    } catch {
      // ignore
    }
    const freshDefaults = generateDefaultMilestones(currentProject);
    setSnapshots(freshDefaults);
    setActiveSnapshotId(freshDefaults[freshDefaults.length - 1]?.id || '');
  }, [currentProject.id]);

  // Persist snapshots to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${currentProject.id}`, JSON.stringify(snapshots));
    } catch {
      // ignore
    }
  }, [snapshots, currentProject.id]);

  // Save a brand new snapshot of the current project state
  const saveCurrentSnapshot = useCallback(
    (versionName: string, tag: SnapshotTag = 'Custom', description: string = '') => {
      const newSnap = createNewSnapshot(currentProject, versionName, tag, description);
      setSnapshots((prev) => [...prev, newSnap]);
      setActiveSnapshotId(newSnap.id);
      return newSnap;
    },
    [currentProject]
  );

  // Restore/switch to a specific snapshot
  const restoreSnapshot = useCallback(
    (snapshotId: string) => {
      const target = snapshots.find((s) => s.id === snapshotId);
      if (target) {
        setActiveSnapshotId(target.id);
        // Deep clone the state to avoid accidental mutations
        const clonedState: ActiveProjectState = JSON.parse(JSON.stringify(target.projectState));
        onRestoreProject(clonedState);
      }
    },
    [snapshots, onRestoreProject]
  );

  // Delete a snapshot
  const deleteSnapshot = useCallback(
    (snapshotId: string) => {
      setSnapshots((prev) => {
        const filtered = prev.filter((s) => s.id !== snapshotId);
        // If we deleted the active one, fallback to last available
        if (activeSnapshotId === snapshotId && filtered.length > 0) {
          const fallback = filtered[filtered.length - 1];
          setActiveSnapshotId(fallback.id);
          onRestoreProject(JSON.parse(JSON.stringify(fallback.projectState)));
        }
        return filtered;
      });
    },
    [activeSnapshotId, onRestoreProject]
  );

  // Step to previous snapshot
  const stepPreviousSnapshot = useCallback(() => {
    const currentIndex = snapshots.findIndex((s) => s.id === activeSnapshotId);
    if (currentIndex > 0) {
      const prevSnap = snapshots[currentIndex - 1];
      restoreSnapshot(prevSnap.id);
    }
  }, [snapshots, activeSnapshotId, restoreSnapshot]);

  // Step to next snapshot
  const stepNextSnapshot = useCallback(() => {
    const currentIndex = snapshots.findIndex((s) => s.id === activeSnapshotId);
    if (currentIndex >= 0 && currentIndex < snapshots.length - 1) {
      const nextSnap = snapshots[currentIndex + 1];
      restoreSnapshot(nextSnap.id);
    }
  }, [snapshots, activeSnapshotId, restoreSnapshot]);

  // Reset to original defaults
  const resetToDefaultMilestones = useCallback(() => {
    const fresh = generateDefaultMilestones(currentProject);
    setSnapshots(fresh);
    const latest = fresh[fresh.length - 1];
    setActiveSnapshotId(latest.id);
    onRestoreProject(JSON.parse(JSON.stringify(latest.projectState)));
  }, [currentProject, onRestoreProject]);

  const activeSnapshot = snapshots.find((s) => s.id === activeSnapshotId) || snapshots[snapshots.length - 1];
  const isLatest = snapshots.length > 0 && activeSnapshotId === snapshots[snapshots.length - 1]?.id;

  return {
    snapshots,
    activeSnapshotId,
    activeSnapshot,
    isLatest,
    saveCurrentSnapshot,
    restoreSnapshot,
    deleteSnapshot,
    stepPreviousSnapshot,
    stepNextSnapshot,
    resetToDefaultMilestones,
  };
}
