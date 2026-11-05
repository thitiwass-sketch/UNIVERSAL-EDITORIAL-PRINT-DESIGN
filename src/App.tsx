/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { OSVersion, ActiveProjectState } from './types/os';
import { SAMPLE_PROJECTS } from './data/sampleProjects';
import { DesignOSKernel } from './services/engineKernel';
import { Header } from './components/Header';
import { CommandRouterTerminal } from './components/CommandRouterTerminal';
import { PipelineFlowVisualizer } from './components/PipelineFlowVisualizer';
import { EditorialCanvas } from './components/EditorialCanvas';
import { EngineRegistryView } from './components/EngineRegistryView';
import { QAGateInspector } from './components/QAGateInspector';
import { DesignCriticReportView } from './components/DesignCriticReportView';
import { ProductionSpecsModal } from './components/ProductionSpecsModal';
import { CoreOSModal } from './components/CoreOSModal';
import { ProjectExportModal } from './components/ProjectExportModal';
import { CommandPaletteModal } from './components/CommandPaletteModal';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { ProjectTemplateSelectorModal } from './components/ProjectTemplateSelectorModal';
import { SaveSnapshotModal } from './components/SaveSnapshotModal';
import { EnginePerformanceWidget } from './components/EnginePerformanceWidget';
import { ToastNotificationCenter } from './components/ToastNotificationCenter';
import { ThemeSettingsView } from './components/ThemeSettingsView';
import { useToast } from './context/ToastContext';
import { useTheme } from './context/ThemeContext';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useVersionHistory } from './hooks/useVersionHistory';

export default function App() {
  const { notifyTask, notifySuccess, notifyInfo, notifyWarning } = useToast();
  const { themeMode, isHighContrast, isPrintView, themeClasses } = useTheme();
  const [currentVersion, setCurrentVersion] = useState<OSVersion>('v8.0');
  const [project, setProject] = useState<ActiveProjectState>(SAMPLE_PROJECTS[0]);
  const [activeTab, setActiveTab] = useState<'canvas' | 'registry' | 'qa' | 'critic' | 'theme'>('canvas');
  const [isLoading, setIsLoading] = useState(false);
  const [isPrinciplesModalOpen, setIsPrinciplesModalOpen] = useState(false);
  const [isSpecsModalOpen, setIsSpecsModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isShortcutsHelpOpen, setIsShortcutsHelpOpen] = useState(false);
  const [isTemplateSelectorOpen, setIsTemplateSelectorOpen] = useState(false);
  const [isSaveSnapshotModalOpen, setIsSaveSnapshotModalOpen] = useState(false);

  // Version History Engine Hook
  const {
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
  } = useVersionHistory(project, setProject);

  const hasAnyModalOpen =
    isCommandPaletteOpen ||
    isShortcutsHelpOpen ||
    isPrinciplesModalOpen ||
    isSpecsModalOpen ||
    isExportModalOpen ||
    isTemplateSelectorOpen ||
    isSaveSnapshotModalOpen;

  const closeAllModals = () => {
    setIsCommandPaletteOpen(false);
    setIsShortcutsHelpOpen(false);
    setIsPrinciplesModalOpen(false);
    setIsSpecsModalOpen(false);
    setIsExportModalOpen(false);
    setIsTemplateSelectorOpen(false);
    setIsSaveSnapshotModalOpen(false);
  };

  // Keyboard shortcut manager hook
  const { isMac, modSymbol, shortcutList } = useKeyboardShortcuts({
    onOpenCommandPalette: () => setIsCommandPaletteOpen((prev) => !prev),
    onOpenExport: () => {
      closeAllModals();
      setIsExportModalOpen(true);
    },
    onOpenEngineRegistry: () => {
      closeAllModals();
      setActiveTab('registry');
    },
    onOpenTemplateSelector: () => {
      closeAllModals();
      setIsTemplateSelectorOpen(true);
    },
    onSaveSnapshot: () => {
      closeAllModals();
      setIsSaveSnapshotModalOpen(true);
    },
    onToggleVersionHistory: () => {
      closeAllModals();
      setActiveTab('canvas');
    },
    onSwitchTab: (tab) => {
      closeAllModals();
      setActiveTab(tab);
    },
    onOpenSpecs: () => {
      closeAllModals();
      setIsSpecsModalOpen(true);
    },
    onOpenCoreOS: () => {
      closeAllModals();
      setIsPrinciplesModalOpen(true);
    },
    onOpenShortcutsHelp: () => {
      closeAllModals();
      setIsShortcutsHelpOpen(true);
    },
    onCloseAnyModal: closeAllModals,
    hasOpenModal: hasAnyModalOpen,
  });

  // Handle template selection & initialization
  const handleSelectTemplate = (newProject: ActiveProjectState) => {
    setIsLoading(true);
    closeAllModals();
    setTimeout(() => {
      setProject(newProject);
      setActiveTab('canvas');
      setIsLoading(false);
      notifySuccess(
        `Template Loaded: ${newProject.projectType}`,
        `Initialized "${newProject.title}" with ${newProject.activeEngineIds.length} calibrated engines.`
      );
    }, 300);
  };

  // Command execution handler
  const handleExecuteCommand = async (commandString: string) => {
    const trimmed = commandString.trim();
    if (trimmed.startsWith('/export') || trimmed.startsWith('/manifest')) {
      setIsExportModalOpen(true);
      return;
    }

    setIsLoading(true);
    try {
      const updatedProject = await DesignOSKernel.executePipeline({
        rawCommand: commandString,
        osVersion: currentVersion,
        manualEngines: project.activeEngineIds,
      });
      setProject(updatedProject);
      notifyTask(
        'Pipeline Task Executed',
        `Command "${trimmed}" resolved across ${updatedProject.activeEngineIds.length} engines. QA Gate: ${updatedProject.qaGate.totalScore}/100 (${updatedProject.qaGate.status}).`,
        updatedProject.activeEngineIds[0] || 'PIPELINE'
      );
    } catch (err) {
      console.error('Pipeline execution error:', err);
      notifyWarning(
        'Pipeline Execution Warning',
        'Command encountered execution anomaly. Fallback pipeline dispatched.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle active engine
  const handleToggleEngine = (engineId: string) => {
    setProject((prev) => {
      const exists = prev.activeEngineIds.includes(engineId);
      const updatedIds = exists
        ? prev.activeEngineIds.filter((id) => id !== engineId)
        : [...prev.activeEngineIds, engineId];

      // Re-evaluate QA gate with updated engines
      const reevaluatedQA = DesignOSKernel.evaluateQAGate(
        updatedIds,
        prev.title,
        /[ก-๙]/.test(prev.title)
      );

      notifyTask(
        exists ? `Engine Unloaded: ${engineId}` : `Engine Loaded: ${engineId}`,
        exists
          ? `Contract disconnected. Pipeline re-evaluated QA: ${reevaluatedQA.totalScore}/100.`
          : `Contract active in pipeline. Re-evaluated QA: ${reevaluatedQA.totalScore}/100.`,
        engineId
      );

      return {
        ...prev,
        activeEngineIds: updatedIds,
        qaGate: reevaluatedQA,
      };
    });
  };

  // Batch activate/deactivate engines
  const handleBatchSetEngines = (engineIdsToAdd: string[], engineIdsToRemove: string[] = []) => {
    setProject((prev) => {
      let updatedIds = [...prev.activeEngineIds];
      engineIdsToAdd.forEach((id) => {
        if (!updatedIds.includes(id)) updatedIds.push(id);
      });
      if (engineIdsToRemove.length > 0) {
        updatedIds = updatedIds.filter((id) => !engineIdsToRemove.includes(id));
      }
      const reevaluatedQA = DesignOSKernel.evaluateQAGate(
        updatedIds,
        prev.title,
        /[ก-๙]/.test(prev.title)
      );
      return {
        ...prev,
        activeEngineIds: updatedIds,
        qaGate: reevaluatedQA,
      };
    });
  };

  // Trigger manual QA re-evaluation
  const handleReevaluateQA = () => {
    setIsLoading(true);
    setTimeout(() => {
      const reevaluatedQA = DesignOSKernel.evaluateQAGate(
        project.activeEngineIds,
        project.title,
        /[ก-๙]/.test(project.title)
      );
      setProject((p) => ({
        ...p,
        qaGate: reevaluatedQA,
      }));
      setIsLoading(false);
      notifyTask(
        '100-Point QA Gate Audit Complete',
        `Evaluated across 10 pillars: Score ${reevaluatedQA.totalScore}/100 (${reevaluatedQA.status}) — ${reevaluatedQA.verdict}`,
        'ENG_DESIGN_CRITIC'
      );
    }, 400);
  };

  // Update project palette from CMYK Color Harmony Engine
  const handleUpdatePalette = (newPalette: ActiveProjectState['palette'], harmonyResult?: any) => {
    setProject((prev) => ({
      ...prev,
      palette: newPalette,
      pipelineLog: [
        ...prev.pipelineLog,
        {
          timestamp: new Date().toLocaleTimeString(),
          stage: 'COLOR_HARMONY_ENGINE',
          engine: 'ENG_PRINT',
          message: `Applied ${harmonyResult?.schemeName || 'Harmonious CMYK'} palette (${newPalette.length} swatches) derived from loaded asset "${harmonyResult?.sourceAssetName || 'Project Graphic'}" adhering to ISO 12647-2 (TAC: ${harmonyResult?.standardsReport?.maxTacPercent || 280}%).`,
        },
      ],
    }));
  };

  // Update project typography from Typography Previewer
  const handleUpdateTypography = (updatedTypography: ActiveProjectState['typography']) => {
    setProject((prev) => ({
      ...prev,
      typography: updatedTypography,
      pipelineLog: [
        ...prev.pipelineLog,
        {
          timestamp: new Date().toLocaleTimeString(),
          stage: 'TYPOGRAPHY_ENGINE',
          engine: 'ENG_EDITORIAL',
          message: `Applied typography pairing: Headline "${updatedTypography.headlineFont}", Body "${updatedTypography.bodyFont}" (${updatedTypography.bodyPt}pt / ${updatedTypography.leadingPt}pt leading, +${updatedTypography.thaiLeadingCompensationPt}pt Thai comp).`,
        },
      ],
    }));
  };

  // Switch OS Version
  const handleVersionChange = (newVersion: OSVersion) => {
    setCurrentVersion(newVersion);
    setProject((p) => ({
      ...p,
      osVersion: newVersion,
    }));
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-150 ${
        isHighContrast
          ? 'bg-black text-white selection:bg-yellow-400 selection:text-black'
          : isPrintView
          ? 'bg-slate-100 text-slate-900 selection:bg-blue-600 selection:text-white'
          : 'bg-[#070a0f] text-slate-100 selection:bg-indigo-600 selection:text-white'
      }`}
    >
      {/* Top Application Header */}
      <Header
        currentVersion={currentVersion}
        onVersionChange={handleVersionChange}
        activeEnginesCount={project.activeEngineIds.length}
        qaScore={project.qaGate.totalScore}
        qaStatus={project.qaGate.status}
        onOpenPrinciples={() => setIsPrinciplesModalOpen(true)}
        onOpenSpecs={() => setIsSpecsModalOpen(true)}
        onOpenExport={() => setIsExportModalOpen(true)}
        onOpenRegistry={() => setActiveTab('registry')}
        onOpenTemplates={() => setIsTemplateSelectorOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenShortcutsHelp={() => setIsShortcutsHelpOpen(true)}
        modSymbol={modSymbol}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-5">
        {/* Command Router Terminal (CLI & Scenarios) */}
        <CommandRouterTerminal
          currentCommand={project.command}
          onExecuteCommand={handleExecuteCommand}
          isLoading={isLoading}
        />

        {/* Dynamic Architectural Pipeline Flow Visualizer */}
        <PipelineFlowVisualizer
          version={currentVersion}
          activeEngines={project.activeEngineIds}
          qaStatus={project.qaGate.status}
          qaScore={project.qaGate.totalScore}
          isLoading={isLoading}
        />

        {/* Tab Content Panels */}
        <div className="pt-2">
          {activeTab === 'canvas' && (
            <EditorialCanvas
              project={project}
              snapshots={snapshots}
              activeSnapshotId={activeSnapshotId}
              activeSnapshot={activeSnapshot}
              isLatest={isLatest}
              onSaveSnapshot={saveCurrentSnapshot}
              onRestoreSnapshot={restoreSnapshot}
              onDeleteSnapshot={deleteSnapshot}
              onStepPrev={stepPreviousSnapshot}
              onStepNext={stepNextSnapshot}
              onResetMilestones={resetToDefaultMilestones}
              onUpdatePalette={handleUpdatePalette}
              onUpdateTypography={handleUpdateTypography}
            />
          )}

          {activeTab === 'registry' && (
            <EngineRegistryView
              activeEngineIds={project.activeEngineIds}
              onToggleEngine={handleToggleEngine}
              onBatchSetEngines={handleBatchSetEngines}
            />
          )}

          {activeTab === 'qa' && (
            <QAGateInspector
              qaGate={project.qaGate}
              onReevaluate={handleReevaluateQA}
              isLoading={isLoading}
            />
          )}

          {activeTab === 'critic' && <DesignCriticReportView project={project} />}

          {activeTab === 'theme' && (
            <ThemeSettingsView onSwitchToCanvas={() => setActiveTab('canvas')} />
          )}
        </div>
      </main>

      {/* Footer Attributions & Real-Time Engine Performance Widget */}
      <footer
        className={`border-t flex flex-col transition-colors ${
          isHighContrast
            ? 'border-yellow-400 bg-black text-white'
            : isPrintView
            ? 'border-slate-300 bg-white text-slate-900 shadow-inner'
            : 'border-slate-900 bg-[#06080d] text-slate-500'
        }`}
      >
        {/* Real-Time Memory and Processing Load Widget */}
        <EnginePerformanceWidget
          activeEngineIds={project.activeEngineIds}
          osVersion={currentVersion}
          isPipelineRunning={isLoading}
        />

        {/* Footer Attributions Bar */}
        <div
          className={`py-3 px-6 text-center text-xs font-mono border-t transition-colors ${
            isHighContrast
              ? 'border-white text-yellow-300 bg-black'
              : isPrintView
              ? 'border-slate-200 text-slate-600 bg-slate-50'
              : 'border-slate-900/60 text-slate-500 bg-transparent'
          }`}
        >
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className={isHighContrast ? 'text-white font-bold' : isPrintView ? 'text-slate-900 font-semibold' : 'text-slate-300'}>
                UNIVERSAL EDITORIAL &amp; PRINT DESIGN AI OS
              </span>
              <span>•</span>
              <span className={`font-thai ${isHighContrast ? 'text-yellow-400 font-bold' : isPrintView ? 'text-blue-700 font-semibold' : 'text-sky-400'}`}>
                ฐิติวัสส์ กาญจนพิมาย (NRRU)
              </span>
            </div>
            <div className={`text-[11px] ${isHighContrast ? 'text-white' : isPrintView ? 'text-slate-600' : 'text-slate-600'}`}>
              Core OS v8.0 • FOGRA39 / ISO 12647-2 • 100-Point QA Cleared
            </div>
          </div>
        </div>

        {/* Real-time Toast Notification Center (Docked in Footer Area) */}
        <ToastNotificationCenter />
      </footer>

      {/* Modals */}
      {isPrinciplesModalOpen && (
        <CoreOSModal onClose={() => setIsPrinciplesModalOpen(false)} />
      )}

      {isSpecsModalOpen && (
        <ProductionSpecsModal
          project={project}
          onClose={() => setIsSpecsModalOpen(false)}
        />
      )}

      {isExportModalOpen && (
        <ProjectExportModal
          project={project}
          onClose={() => setIsExportModalOpen(false)}
        />
      )}

      {/* Global Command Palette (Cmd+K) */}
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSwitchTab={(tab) => {
          setActiveTab(tab);
          setIsCommandPaletteOpen(false);
        }}
        onOpenExport={() => {
          setIsCommandPaletteOpen(false);
          setIsExportModalOpen(true);
        }}
        onOpenSpecs={() => {
          setIsCommandPaletteOpen(false);
          setIsSpecsModalOpen(true);
        }}
        onOpenCoreOS={() => {
          setIsCommandPaletteOpen(false);
          setIsPrinciplesModalOpen(true);
        }}
        onOpenShortcutsHelp={() => {
          setIsCommandPaletteOpen(false);
          setIsShortcutsHelpOpen(true);
        }}
        onOpenTemplates={() => {
          setIsCommandPaletteOpen(false);
          setIsTemplateSelectorOpen(true);
        }}
        onSaveSnapshot={() => {
          setIsCommandPaletteOpen(false);
          setIsSaveSnapshotModalOpen(true);
        }}
        onOpenVersionHistory={() => {
          setIsCommandPaletteOpen(false);
          setActiveTab('canvas');
        }}
        activeEngineIds={project.activeEngineIds}
        onToggleEngine={handleToggleEngine}
        onExecuteCommand={handleExecuteCommand}
        modSymbol={modSymbol}
      />

      {/* Global Save Snapshot Modal (Cmd+S) */}
      <SaveSnapshotModal
        isOpen={isSaveSnapshotModalOpen}
        onClose={() => setIsSaveSnapshotModalOpen(false)}
        currentProject={project}
        suggestedVersionName={`v1.${snapshots.length + 1} — ${project.projectType.split(' ')[0]} Checkpoint`}
        onSave={(versionName, tag, description) => {
          saveCurrentSnapshot(versionName, tag, description);
          notifySuccess(
            'Version Snapshot Saved',
            `Created checkpoint "${versionName}" (${tag}) with QA Gate Score: ${project.qaGate.totalScore}/100.`
          );
        }}
      />

      {/* Project Template Selector Modal (Cmd+T) */}
      <ProjectTemplateSelectorModal
        isOpen={isTemplateSelectorOpen}
        onClose={() => setIsTemplateSelectorOpen(false)}
        onSelectTemplate={handleSelectTemplate}
        currentVersion={currentVersion}
      />

      {/* Keyboard Shortcuts Cheat Sheet Modal */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsHelpOpen}
        onClose={() => setIsShortcutsHelpOpen(false)}
        shortcuts={shortcutList}
        isMac={isMac}
        modSymbol={modSymbol}
      />
    </div>
  );
}
