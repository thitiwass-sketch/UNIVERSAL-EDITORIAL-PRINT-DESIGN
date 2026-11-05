import React, { useState, useMemo } from 'react';
import { ActiveProjectState } from '../types/os';
import { ProjectSnapshot, SnapshotTag } from '../types/versionHistory';
import { SaveSnapshotModal } from './SaveSnapshotModal';
import { VersionDiffModal } from './VersionDiffModal';
import { VersionHistoryInspector } from './VersionHistoryInspector';
import { ColorHarmonyInspector } from './ColorHarmonyInspector';
import { TypographyPreviewer } from './TypographyPreviewer';
import { ColorHarmonyResult } from '../types/colorHarmony';
import { calculateOptimalKerning } from '../utils/autoKerningOptimizer';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import { DraggableLayoutBlock, BlockCategory } from './DraggableLayoutBlock';
import { useCanvasBlockOrder } from '../hooks/useCanvasBlockOrder';
import {
  Grid,
  Scissors,
  Palette,
  Sparkles,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Layers,
  Type,
  Info,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  History,
  Camera,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  RotateCcw,
  Sliders,
  Move,
  Undo2,
  GripVertical,
} from 'lucide-react';

interface EditorialCanvasProps {
  project: ActiveProjectState;
  snapshots?: ProjectSnapshot[];
  activeSnapshotId?: string;
  activeSnapshot?: ProjectSnapshot;
  isLatest?: boolean;
  onSaveSnapshot?: (versionName: string, tag: SnapshotTag, description: string) => void;
  onRestoreSnapshot?: (id: string) => void;
  onDeleteSnapshot?: (id: string) => void;
  onStepPrev?: () => void;
  onStepNext?: () => void;
  onResetMilestones?: () => void;
  onUpdatePalette?: (newPalette: ActiveProjectState['palette'], harmonyResult?: ColorHarmonyResult) => void;
  onUpdateTypography?: (updatedTypography: ActiveProjectState['typography']) => void;
}

export const EditorialCanvas: React.FC<EditorialCanvasProps> = ({
  project,
  snapshots = [],
  activeSnapshotId,
  activeSnapshot,
  isLatest = true,
  onSaveSnapshot,
  onRestoreSnapshot,
  onDeleteSnapshot,
  onStepPrev,
  onStepNext,
  onResetMilestones,
  onUpdatePalette,
  onUpdateTypography,
}) => {
  const [showGrid, setShowGrid] = useState(true);
  const [showPrintMarks, setShowPrintMarks] = useState(true);
  const [colorMode, setColorMode] = useState<
    'composite' | 'cyan' | 'magenta' | 'yellow' | 'black' | 'spot'
  >('composite');
  const [paperTexture, setPaperTexture] = useState<
    'munken' | 'silk' | 'craft' | 'white'
  >('munken');
  const [showThaiInspector, setShowThaiInspector] = useState(false);
  const [showFinishing, setShowFinishing] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Inspector states: specs, typography, harmony, or history
  const [inspectorTab, setInspectorTab] = useState<'specs' | 'typography' | 'harmony' | 'history'>('specs');
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isTypeSpecimenModalOpen, setIsTypeSpecimenModalOpen] = useState(false);
  const [isVersionDropdownOpen, setIsVersionDropdownOpen] = useState(false);
  const [diffModalPair, setDiffModalPair] = useState<{
    snapA: ProjectSnapshot;
    snapB: ProjectSnapshot;
  } | null>(null);

  // Background style based on paper texture
  const getPaperBg = () => {
    switch (paperTexture) {
      case 'munken':
        return 'bg-[#f6f3eb] text-[#14171a] shadow-stone-900/30';
      case 'silk':
        return 'bg-[#f8f9fa] text-[#0f1419] shadow-slate-900/30';
      case 'craft':
        return 'bg-[#d6c4a5] text-[#2c1d11] shadow-stone-900/40';
      case 'white':
      default:
        return 'bg-[#ffffff] text-[#111111] shadow-neutral-900/30';
    }
  };

  // Color separation filter
  const getSeparationStyle = () => {
    switch (colorMode) {
      case 'cyan':
        return 'contrast(1.1) brightness(0.9) hue-rotate(180deg) saturate(1.8)';
      case 'magenta':
        return 'contrast(1.2) brightness(0.9) hue-rotate(300deg) saturate(2.0)';
      case 'yellow':
        return 'contrast(0.9) brightness(1.2) sepia(1) saturate(3.0)';
      case 'black':
        return 'grayscale(1) contrast(1.4)';
      case 'spot':
        return 'sepia(0.8) hue-rotate(10deg) saturate(3)';
      default:
        return 'none';
    }
  };

  const isBook = project.projectType.toLowerCase().includes('book') || project.media.toLowerCase().includes('book');
  const isPoster = project.projectType.toLowerCase().includes('poster');
  const isMagazine = project.projectType.toLowerCase().includes('magazine') || project.media.toLowerCase().includes('double-page');
  const isFlyer = project.projectType.toLowerCase().includes('flyer') || project.media.toLowerCase().includes('handbill');
  const isNewsletter = project.projectType.toLowerCase().includes('newsletter') || project.media.toLowerCase().includes('digest');

  // Dynamic palette colors bound from active project state
  const primaryPaletteColor = project.palette?.[0]?.hex || '#0f2742';
  const secondaryPaletteColor = project.palette?.[1]?.hex || '#c5a059';
  const neutralPaletteColor = project.palette?.[2]?.hex || '#f6f3eb';
  const darkPaletteColor = project.palette?.[3]?.hex || '#14171a';

  // Auto-Kerning Optimizer Integration
  const isAutoKerningActive = project.activeEngineIds.includes('ENG_AUTOKERNING');
  const headlineKerning = useMemo(() => {
    return calculateOptimalKerning({
      text: project.typography.sampleHeadline || project.title,
      fontFamily: project.typography.headlineFont,
      fontWeight: 700,
      fontSizePt: 36,
      isReverseType: true,
    });
  }, [project.typography.sampleHeadline, project.title, project.typography.headlineFont]);

  // Toast notifications & Drag & Drop Reordering Mode
  const { notifySuccess, notifyInfo } = useToast();
  const { isHighContrast, isPrintView, themeMode } = useTheme();
  const [isReorderMode, setIsReorderMode] = useState(false);

  // Hook instances for each archetype's layout blocks
  const handleReorderNotification = (label: string) => {
    return (id: string, newIdx: number) => {
      notifySuccess('Layout Block Reordered', `Moved block in ${label} to position #${newIdx + 1}`);
    };
  };

  const posterOrder = useCanvasBlockOrder(
    `${project.id}_poster`,
    ['poster_header', 'poster_headline', 'poster_graphic', 'poster_footer'],
    handleReorderNotification('Poster Layout')
  );

  const flyerOrder = useCanvasBlockOrder(
    `${project.id}_flyer`,
    ['flyer_banner', 'flyer_headline', 'flyer_features', 'flyer_voucher'],
    handleReorderNotification('Flyer Layout')
  );

  const newsletterOrder = useCanvasBlockOrder(
    `${project.id}_newsletter`,
    ['news_browser', 'news_headline', 'news_metrics', 'news_body', 'news_footer'],
    handleReorderNotification('Newsletter Layout')
  );

  const magLeftOrder = useCanvasBlockOrder(
    `${project.id}_mag_left`,
    ['mag_left_header', 'mag_left_headline', 'mag_left_dropcap', 'mag_left_pullquote', 'mag_left_folio'],
    handleReorderNotification('Magazine Left Page')
  );

  const magRightOrder = useCanvasBlockOrder(
    `${project.id}_mag_right`,
    ['mag_right_header', 'mag_right_visual', 'mag_right_bilingual', 'mag_right_folio'],
    handleReorderNotification('Magazine Right Page')
  );

  const bookFrontOrder = useCanvasBlockOrder(
    `${project.id}_book_front`,
    ['book_front_crest', 'book_front_titles', 'book_front_author'],
    handleReorderNotification('Book Front Cover')
  );

  const bookBackOrder = useCanvasBlockOrder(
    `${project.id}_book_back`,
    ['book_back_header', 'book_back_body', 'book_back_barcode'],
    handleReorderNotification('Book Back Cover')
  );

  const journalOrder = useCanvasBlockOrder(
    `${project.id}_journal`,
    ['journal_header', 'journal_headline', 'journal_abstract', 'journal_columns', 'journal_footer'],
    handleReorderNotification('Journal Article')
  );

  // Check if active archetype has custom order
  const isCurrentLayoutCustomized = useMemo(() => {
    if (isPoster) return posterOrder.isCustomized;
    if (isFlyer) return flyerOrder.isCustomized;
    if (isNewsletter) return newsletterOrder.isCustomized;
    if (isMagazine) return magLeftOrder.isCustomized || magRightOrder.isCustomized;
    if (isBook) return bookFrontOrder.isCustomized || bookBackOrder.isCustomized;
    return journalOrder.isCustomized;
  }, [
    isPoster,
    isFlyer,
    isNewsletter,
    isMagazine,
    isBook,
    posterOrder.isCustomized,
    flyerOrder.isCustomized,
    newsletterOrder.isCustomized,
    magLeftOrder.isCustomized,
    magRightOrder.isCustomized,
    bookFrontOrder.isCustomized,
    bookBackOrder.isCustomized,
    journalOrder.isCustomized,
  ]);

  const handleResetCurrentLayout = () => {
    if (isPoster) posterOrder.resetOrder();
    if (isFlyer) flyerOrder.resetOrder();
    if (isNewsletter) newsletterOrder.resetOrder();
    if (isMagazine) {
      magLeftOrder.resetOrder();
      magRightOrder.resetOrder();
    }
    if (isBook) {
      bookFrontOrder.resetOrder();
      bookBackOrder.resetOrder();
    }
    if (!isPoster && !isFlyer && !isNewsletter && !isMagazine && !isBook) {
      journalOrder.resetOrder();
    }
    notifyInfo('Layout Reset', 'Restored default layout block hierarchy.');
  };

  return (
    <div className="flex flex-col xl:flex-row gap-5">
      {/* Visual Canvas Area */}
      <div
        className={`flex-1 rounded-2xl p-4 sm:p-6 overflow-hidden flex flex-col items-center transition-colors ${
          isHighContrast
            ? 'bg-black border-2 border-yellow-400 text-white'
            : isPrintView
            ? 'bg-white border border-slate-300 shadow-sm text-slate-900'
            : 'bg-[#090d14] border border-slate-800 text-slate-100'
        }`}
      >
        {/* Top Canvas Toolbar */}
        <div
          className={`w-full flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b text-xs font-mono transition-colors ${
            isHighContrast
              ? 'border-yellow-400'
              : isPrintView
              ? 'border-slate-200'
              : 'border-slate-800/80'
          }`}
        >
          <div className="flex items-center gap-2 flex-wrap">
            {/* Grid Toggle */}
            <button
              id="btn-toggle-grid"
              onClick={() => setShowGrid(!showGrid)}
              className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors ${
                showGrid
                  ? 'bg-indigo-950/60 border-indigo-600 text-sky-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Grid Overlay</span>
            </button>

            {/* Bleed & Crop Marks Toggle */}
            <button
              id="btn-toggle-print-marks"
              onClick={() => setShowPrintMarks(!showPrintMarks)}
              className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors ${
                showPrintMarks
                  ? 'bg-rose-950/60 border-rose-600 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>3mm Bleed & Marks</span>
            </button>

            {/* Finishing Effects Toggle */}
            <button
              id="btn-toggle-finishing"
              onClick={() => setShowFinishing(!showFinishing)}
              className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors ${
                showFinishing
                  ? 'bg-amber-950/60 border-amber-600 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Foil & Spot UV</span>
            </button>

            {/* Thai Typographic Stacking Inspector */}
            <button
              id="btn-toggle-thai-inspector"
              onClick={() => setShowThaiInspector(!showThaiInspector)}
              className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors font-thai ${
                showThaiInspector
                  ? 'bg-emerald-950/60 border-emerald-600 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Type className="w-3.5 h-3.5 text-emerald-400" />
              <span>ตรวจสระ/วรรณยุกต์ไทย (4 ชั้น)</span>
            </button>

            {/* Drag & Drop Reorder Layout Blocks Toggle */}
            <button
              id="btn-toggle-reorder-blocks"
              onClick={() => setIsReorderMode(!isReorderMode)}
              className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors ${
                isReorderMode
                  ? 'bg-sky-950/80 border-sky-500 text-sky-200 ring-1 ring-sky-500/50 font-bold shadow-sm'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle Drag & Drop layout block and graphic asset reordering mode"
            >
              <Move className="w-3.5 h-3.5 text-sky-400" />
              <span>Reorder Blocks</span>
              {isCurrentLayoutCustomized && (
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" title="Custom block order active" />
              )}
            </button>

            {/* Reset Layout Order Button (visible when customized) */}
            {isCurrentLayoutCustomized && (
              <button
                id="btn-reset-layout-order"
                onClick={handleResetCurrentLayout}
                className="px-2.5 py-1.5 rounded-lg border border-amber-800/80 bg-amber-950/60 text-amber-300 hover:bg-amber-900/60 flex items-center gap-1.5 text-xs transition-colors"
                title="Reset layout blocks to original standard sequence"
              >
                <Undo2 className="w-3.5 h-3.5" />
                <span>Reset Blocks</span>
              </button>
            )}
          </div>

          {/* Center/Right Toolbar: Version History Stepper, Save Snapshot & Zoom */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Version Stepper & Dropdown */}
            {snapshots && snapshots.length > 0 && (
              <div className="flex items-center gap-0.5 bg-slate-900 border border-slate-800 rounded-lg p-0.5 relative">
                {/* Prev Step Button */}
                <button
                  id="btn-version-step-prev"
                  onClick={onStepPrev}
                  disabled={activeSnapshotId === snapshots[0]?.id}
                  className="p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                  title="Step to Previous Snapshot"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                {/* Version Selector Dropdown Trigger */}
                <div className="relative">
                  <button
                    id="btn-version-dropdown-trigger"
                    onClick={() => setIsVersionDropdownOpen((prev) => !prev)}
                    className="px-2 py-1 hover:bg-slate-800 text-slate-200 text-[11px] font-mono font-medium rounded flex items-center gap-1.5 transition-colors"
                  >
                    <History className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span className="max-w-[120px] sm:max-w-[180px] truncate">
                      {activeSnapshot ? activeSnapshot.versionName : 'Version History'}
                    </span>
                    <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
                  </button>

                  {/* Dropdown Popover */}
                  {isVersionDropdownOpen && (
                    <div
                      className="absolute left-0 mt-1.5 w-72 bg-[#0c121c] border border-slate-700/90 rounded-xl shadow-2xl z-40 p-1.5 space-y-1 text-xs animate-in fade-in zoom-in-95 duration-150"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="px-2.5 py-1 text-[10px] text-slate-400 uppercase font-mono tracking-wider border-b border-slate-800 flex items-center justify-between">
                        <span>Project Snapshots</span>
                        <span>{snapshots.length} saved</span>
                      </div>
                      <div className="max-h-60 overflow-y-auto space-y-1 pt-1 scrollbar-thin">
                        {snapshots.slice().reverse().map((snap) => {
                          const isSel = snap.id === activeSnapshotId;
                          return (
                            <button
                              key={snap.id}
                              onClick={() => {
                                if (onRestoreSnapshot) onRestoreSnapshot(snap.id);
                                setIsVersionDropdownOpen(false);
                              }}
                              className={`w-full text-left px-2.5 py-2 rounded-lg font-mono transition-colors flex items-center justify-between ${
                                isSel
                                  ? 'bg-indigo-950 text-indigo-200 border border-indigo-700/80 font-bold'
                                  : 'hover:bg-slate-800/80 text-slate-300'
                              }`}
                            >
                              <div className="truncate mr-2">
                                <div className="truncate text-[11px] text-slate-200">{snap.versionName}</div>
                                <div className="text-[9px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                                  <span className="text-sky-300">{snap.tag}</span>
                                  <span>•</span>
                                  <span>QA: {snap.stats.qaScore}</span>
                                </div>
                              </div>
                              {isSel && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Next Step Button */}
                <button
                  id="btn-version-step-next"
                  onClick={onStepNext}
                  disabled={activeSnapshotId === snapshots[snapshots.length - 1]?.id}
                  className="p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                  title="Step to Next Snapshot"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Quick Save Snapshot Button */}
            <button
              id="btn-quick-save-snapshot"
              onClick={() => setIsSaveModalOpen(true)}
              className="px-2.5 py-1.5 rounded-lg bg-indigo-950/80 border border-indigo-700/80 hover:bg-indigo-900/60 text-xs text-indigo-200 flex items-center gap-1.5 transition-colors font-medium shadow-sm"
              title="Save Snapshot of Current Project State (Cmd+S)"
            >
              <Camera className="w-3.5 h-3.5 text-indigo-400" />
              <span>Snapshot</span>
            </button>

            {/* Version History Tab Toggle */}
            <button
              id="btn-toolbar-toggle-history-tab"
              onClick={() => setInspectorTab((curr) => (curr === 'history' ? 'specs' : 'history'))}
              className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors text-xs font-mono ${
                inspectorTab === 'history'
                  ? 'bg-sky-950/80 border-sky-600 text-sky-200 ring-1 ring-sky-500/40 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle Version History Inspector"
            >
              <History className="w-3.5 h-3.5 text-sky-400" />
              <span>History</span>
              {snapshots && (
                <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] text-sky-300 font-bold">
                  {snapshots.length}
                </span>
              )}
            </button>

            {/* CMYK Color Harmony Tab Toggle */}
            <button
              id="btn-toolbar-toggle-harmony-tab"
              onClick={() => setInspectorTab((curr) => (curr === 'harmony' ? 'specs' : 'harmony'))}
              className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors text-xs font-mono ${
                inspectorTab === 'harmony'
                  ? 'bg-amber-950/80 border-amber-500 text-amber-200 ring-1 ring-amber-500/40 font-bold shadow-sm'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-amber-300'
              }`}
              title="Suggest Harmonious CMYK Palettes based on loaded project assets"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>CMYK Harmony</span>
            </button>

            {/* Typography Previewer Tab Toggle */}
            <button
              id="btn-toolbar-toggle-type-tab"
              onClick={() => setInspectorTab((curr) => (curr === 'typography' ? 'specs' : 'typography'))}
              className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors text-xs font-mono ${
                inspectorTab === 'typography'
                  ? 'bg-sky-950/80 border-sky-500 text-sky-200 ring-1 ring-sky-500/40 font-bold shadow-sm'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-sky-300'
              }`}
              title="Test font combinations & readability on editorial text"
            >
              <Type className="w-3.5 h-3.5 text-sky-400" />
              <span>Type Preview</span>
            </button>

            {/* Auto-Kerning Optimizer Status Pill */}
            {isAutoKerningActive && (
              <span
                id="badge-canvas-autokern-status"
                className="px-2.5 py-1 rounded-lg bg-amber-950/70 border border-amber-600/70 text-amber-300 flex items-center gap-1.5 text-xs font-mono shadow-sm"
                title={`ENG_AUTOKERNING Active: ${headlineKerning.explanation}`}
              >
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                <span>Auto-Kerning: {headlineKerning.cssLetterSpacing}</span>
              </span>
            )}

            {/* Zoom and Scale */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            <button
              id="btn-zoom-out"
              onClick={() => setZoomLevel((z) => Math.max(0.75, z - 0.1))}
              className="p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 text-slate-300 text-[11px] font-mono select-none">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              id="btn-zoom-in"
              onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
              className="p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              id="btn-zoom-reset"
              onClick={() => setZoomLevel(1)}
              className="p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded text-[10px]"
              title="Reset Zoom"
            >
              1:1
            </button>
          </div>
        </div>
      </div>

        {/* Paper & Plate Selection Bar */}
        <div className="w-full flex flex-wrap items-center justify-between gap-3 text-xs font-mono mb-4 text-slate-400">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 mr-1">Plates:</span>
            {[
              { id: 'composite', label: 'Composite CMYK' },
              { id: 'cyan', label: 'Cyan (C)' },
              { id: 'magenta', label: 'Magenta (M)' },
              { id: 'yellow', label: 'Yellow (Y)' },
              { id: 'black', label: 'Black (K 100%)' },
              { id: 'spot', label: 'Spot Pantone' },
            ].map((p) => (
              <button
                key={p.id}
                id={`btn-plate-${p.id}`}
                onClick={() => setColorMode(p.id as any)}
                className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                  colorMode === p.id
                    ? 'bg-slate-200 text-slate-900 font-bold'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 mr-1">Paper Substrate:</span>
            {[
              { id: 'munken', label: 'Munken Pure 120g' },
              { id: 'silk', label: 'Silk Coated 200g' },
              { id: 'craft', label: 'Craft Recycled' },
              { id: 'white', label: 'Offset White' },
            ].map((p) => (
              <button
                key={p.id}
                id={`btn-paper-${p.id}`}
                onClick={() => setPaperTexture(p.id as any)}
                className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                  paperTexture === p.id
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Historical Version Preview Notification Banner */}
        {!isLatest && activeSnapshot && (
          <div className="w-full mb-3 p-3 rounded-xl bg-gradient-to-r from-indigo-950 via-[#0c1220] to-indigo-950 border border-indigo-500/70 shadow-lg flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
              <div>
                <div className="text-slate-200 font-bold flex items-center gap-2 flex-wrap">
                  <span>PREVIEWING SNAPSHOT:</span>
                  <span className="text-sky-300 underline underline-offset-2">{activeSnapshot.versionName}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-900/80 text-indigo-200 border border-indigo-700 font-sans">
                    {activeSnapshot.tag}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Captured {activeSnapshot.createdAtFormatted} • QA: {activeSnapshot.stats.qaScore}/100 • {activeSnapshot.stats.engineCount} Engines Active
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {snapshots && snapshots.length > 0 && (
                <button
                  onClick={() => onRestoreSnapshot && onRestoreSnapshot(snapshots[snapshots.length - 1].id)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] font-mono transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Return to Current ({snapshots[snapshots.length - 1].versionNumber || 'Latest'})</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Reorder Layout Blocks Active Banner */}
        {isReorderMode && (
          <div className="w-full mb-3 p-3 rounded-xl bg-gradient-to-r from-sky-950 via-[#0a1222] to-sky-950 border border-sky-500/70 shadow-lg flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-sky-200 animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="flex items-center gap-2.5">
              <Move className="w-4 h-4 text-sky-400 animate-pulse shrink-0" />
              <div>
                <div className="font-bold flex items-center gap-2">
                  <span>LAYOUT BLOCK REORDERING ACTIVE</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-900/80 text-sky-200 border border-sky-700">
                    DRAG &amp; DROP ENABLED
                  </span>
                </div>
                <div className="text-[10px] text-sky-300/80 mt-0.5">
                  Click &amp; drag any layout block handle to reposition. Click Up/Down arrows on block headers for quick incremental adjustments.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isCurrentLayoutCustomized && (
                <button
                  id="btn-banner-reset-layout"
                  onClick={handleResetCurrentLayout}
                  className="px-2.5 py-1 rounded-lg bg-amber-950/80 hover:bg-amber-900 border border-amber-600/70 text-amber-200 font-bold text-[11px] font-mono transition-colors flex items-center gap-1.5"
                >
                  <Undo2 className="w-3 h-3" />
                  <span>Reset to Standard Order</span>
                </button>
              )}
              <button
                id="btn-banner-done-reorder"
                onClick={() => setIsReorderMode(false)}
                className="px-3 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-[11px] font-mono transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* The Live Physical Print Sheet */}
        <div className="w-full overflow-auto flex justify-center py-6">
          <div
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'top center',
              transition: 'transform 0.15s ease',
              filter: getSeparationStyle(),
            }}
            className="relative"
          >
            {/* Outer 3.0mm Bleed Perimeter */}
            {showPrintMarks && (
              <div
                className="absolute -inset-4 border-2 border-dashed border-rose-500/50 pointer-events-none z-30"
                title="3.0mm Bleed Line (Artwork must extend past this boundary)"
              >
                <div className="absolute top-1 left-2 text-[9px] font-mono text-rose-400 bg-black/80 px-1 rounded">
                  +3.0mm BLEED
                </div>
                {/* Crop Marks (Tick marks on all 4 corners) */}
                <div className="absolute -top-3 -left-3 w-4 h-4 border-t-2 border-l-2 border-slate-300"></div>
                <div className="absolute -top-3 -right-3 w-4 h-4 border-t-2 border-r-2 border-slate-300"></div>
                <div className="absolute -bottom-3 -left-3 w-4 h-4 border-b-2 border-l-2 border-slate-300"></div>
                <div className="absolute -bottom-3 -right-3 w-4 h-4 border-b-2 border-r-2 border-slate-300"></div>
                {/* Registration Target Circles */}
                <div className="absolute top-1/2 -left-6 -translate-y-1/2 w-4 h-4 rounded-full border border-slate-400 flex items-center justify-center">
                  <div className="w-2 h-0.5 bg-slate-400"></div>
                </div>
                <div className="absolute top-1/2 -right-6 -translate-y-1/2 w-4 h-4 rounded-full border border-slate-400 flex items-center justify-center">
                  <div className="w-2 h-0.5 bg-slate-400"></div>
                </div>
              </div>
            )}

            {/* The Trimmed Finished Page / Spread Container */}
            <div
              id="print-sheet-trimmed"
              className={`relative ${getPaperBg()} shadow-2xl transition-all duration-300 overflow-hidden ${
                isBook
                  ? 'w-[740px] h-[490px] rounded-sm'
                  : isPoster
                  ? 'w-[520px] h-[740px] rounded-none'
                  : isFlyer
                  ? 'w-[480px] h-[680px] rounded-sm'
                  : isMagazine
                  ? 'w-[760px] h-[510px] rounded-sm'
                  : isNewsletter
                  ? 'w-[720px] h-[500px] rounded-xl'
                  : 'w-[680px] h-[480px] rounded-sm'
              }`}
            >
              {/* Safe Margin Zone (Dashed Inner Line) */}
              {showPrintMarks && (
                <div
                  className="absolute inset-5 border border-dashed border-sky-400/40 pointer-events-none z-20"
                  title="5.0mm Safe Margin Zone (Keep body text inside)"
                >
                  <span className="absolute bottom-1 right-2 text-[8px] font-mono text-sky-600/70">
                    SAFE MARGIN (5mm)
                  </span>
                </div>
              )}

              {/* Grid Overlay Guide */}
              {showGrid && (
                <div className="absolute inset-0 pointer-events-none z-10 grid grid-cols-12 gap-2 p-6 opacity-25">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-full border-r border-indigo-400 bg-indigo-500/5 last:border-r-0"
                    ></div>
                  ))}
                  {/* Horizontal Baseline Guides */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_13px,rgba(99,102,241,0.15)_14px)] bg-[size:100%_14px]"></div>
                </div>
              )}

              {/* Layout Content Rendering based on archetype */}
              {isBook ? (
                /* ================= BOOK COVER & SPINE MECHANICAL ================= */
                <div className="w-full h-full flex relative z-10">
                  {/* Back Cover (Left Panel) */}
                  <div className="w-[330px] p-8 flex flex-col justify-between border-r border-slate-300/40 gap-3">
                    {bookBackOrder.order.map((blockId, index) => {
                      let content = null;
                      let label = '';
                      let category: BlockCategory = 'body';

                      if (blockId === 'book_back_header') {
                        label = 'Faculty Department Tag';
                        category = 'header';
                        content = (
                          <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-1">
                            FACULTY OF INDUSTRIAL TECHNOLOGY • NRRU
                          </div>
                        );
                      } else if (blockId === 'book_back_body') {
                        label = 'Monograph Excerpt & Thai Body';
                        category = 'body';
                        content = (
                          <div className="space-y-3">
                            <p className="text-xs leading-relaxed text-slate-700 font-serif">
                              {project.typography.sampleBody}
                            </p>
                            <p className="text-xs leading-relaxed text-slate-600 font-thai">
                              {project.typography.sampleThaiBody}
                            </p>
                          </div>
                        );
                      } else if (blockId === 'book_back_barcode') {
                        label = 'ISBN Barcode Asset & Price';
                        category = 'asset';
                        content = (
                          <div className="pt-3 border-t border-slate-300/40 flex items-center justify-between">
                            <div className="w-28 h-12 bg-white border border-slate-300 p-1 flex flex-col justify-between">
                              <div className="flex justify-between h-7 w-full gap-0.5">
                                {Array.from({ length: 24 }).map((_, i) => (
                                  <div
                                    key={i}
                                    className={`h-full ${
                                      i % 3 === 0 ? 'w-1 bg-black' : 'w-0.5 bg-black'
                                    }`}
                                  ></div>
                                ))}
                              </div>
                              <div className="text-[7px] font-mono text-center tracking-tighter">
                                ISBN 978-616-XXXX-XX-X
                              </div>
                            </div>
                            <div className="text-[10px] font-mono text-slate-500 text-right">
                              <div>THB 450.-</div>
                              <div>Academic Monograph</div>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <DraggableLayoutBlock
                          key={blockId}
                          id={blockId}
                          index={index}
                          totalBlocks={bookBackOrder.order.length}
                          label={label}
                          category={category}
                          isReorderMode={isReorderMode}
                          isDragging={bookBackOrder.draggedBlockId === blockId}
                          dropPosition={bookBackOrder.dragOverBlockId === blockId ? bookBackOrder.dropPosition : null}
                          onDragStart={bookBackOrder.handleDragStart}
                          onDragOver={bookBackOrder.handleDragOver}
                          onDragLeave={bookBackOrder.handleDragLeave}
                          onDrop={bookBackOrder.handleDrop}
                          onDragEnd={bookBackOrder.handleDragEnd}
                          onMoveUp={(id) => bookBackOrder.stepBlock(id, 'up')}
                          onMoveDown={(id) => bookBackOrder.stepBlock(id, 'down')}
                        >
                          {content}
                        </DraggableLayoutBlock>
                      );
                    })}
                  </div>

                  {/* Spine (Center Column) */}
                  <div
                    className="w-[60px] h-full text-white flex flex-col items-center justify-between py-6 px-1 shadow-inner relative transition-colors duration-300"
                    style={{ backgroundColor: primaryPaletteColor }}
                    title={`Calculated Spine: ${project.specs.binding.spineWidthMm}mm for 240pp on 120gsm Munken`}
                  >
                    {/* Hinge score creases */}
                    <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-slate-900/50"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-slate-900/50"></div>

                    {/* Spine Emblem */}
                    <div
                      className={`w-6 h-6 rounded border flex items-center justify-center text-[8px] font-bold font-mono ${
                        showFinishing
                          ? 'border-amber-300 text-amber-200 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                          : 'border-slate-400 text-slate-300'
                      }`}
                    >
                      NRRU
                    </div>

                    {/* Vertical Spine Title */}
                    <div className="rotate-90 whitespace-nowrap text-[11px] font-serif tracking-wider flex items-center gap-2">
                      <span
                        className={
                          showFinishing
                            ? 'text-amber-200 drop-shadow-[0_0_2px_rgba(245,158,11,0.8)] font-semibold'
                            : 'text-slate-200'
                        }
                      >
                        {project.title.slice(0, 32)}...
                      </span>
                      <span className="text-[9px] text-slate-400 font-thai">
                        ฐิติวัสส์
                      </span>
                    </div>

                    <div className="text-[8px] font-mono text-slate-400">
                      2026
                    </div>
                  </div>

                  {/* Front Cover (Right Panel) */}
                  <div
                    className="flex-1 p-8 flex flex-col justify-between text-white relative overflow-hidden transition-colors duration-300 gap-3"
                    style={{ backgroundColor: primaryPaletteColor }}
                  >
                    {/* Subtle geometric structural lines */}
                    <div className="absolute -right-12 -top-12 w-64 h-64 border border-indigo-400/20 rounded-full pointer-events-none"></div>
                    <div className="absolute -right-6 -bottom-6 w-48 h-48 border border-indigo-400/15 pointer-events-none"></div>

                    {bookFrontOrder.order.map((blockId, index) => {
                      let content = null;
                      let label = '';
                      let category: BlockCategory = 'body';

                      if (blockId === 'book_front_crest') {
                        label = 'Institutional Crest & Tag';
                        category = 'header';
                        content = (
                          <div className="flex items-center justify-between pb-3 border-b border-indigo-900/80">
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-7 h-7 rounded-md flex items-center justify-center font-bold text-[10px] font-mono ${
                                  showFinishing
                                    ? 'bg-gradient-to-br from-amber-200 to-amber-500 text-[#0f2742] shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                                    : 'bg-slate-700 text-white'
                                }`}
                              >
                                NRRU
                              </div>
                              <div className="text-[9px] font-mono text-sky-200 uppercase tracking-wider">
                                Faculty of Industrial Technology
                              </div>
                            </div>
                            <div className="text-[9px] font-mono text-slate-400">
                              Vol. VII
                            </div>
                          </div>
                        );
                      } else if (blockId === 'book_front_titles') {
                        label = 'Display Titles & Auto-Kerning';
                        category = 'headline';
                        content = (
                          <div className="my-2">
                            <h2
                              className={`text-xl sm:text-2xl font-bold font-thai leading-snug tracking-tight mb-2 ${
                                showFinishing
                                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-amber-400 drop-shadow-sm'
                                  : 'text-white'
                              }`}
                              style={{
                                letterSpacing: isAutoKerningActive ? headlineKerning.cssLetterSpacing : undefined,
                              }}
                            >
                              {project.typography.sampleHeadline}
                            </h2>
                            <p className="text-sm font-serif italic text-sky-200/90 leading-normal max-w-sm">
                              {project.typography.sampleSubhead}
                            </p>
                          </div>
                        );
                      } else if (blockId === 'book_front_author') {
                        label = 'Author Imprint & Foil Finishing';
                        category = 'asset';
                        content = (
                          <div className="pt-4 border-t border-indigo-900/80 flex items-end justify-between">
                            <div>
                              <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">
                                Author &amp; Lead Researcher
                              </div>
                              <div className="text-sm font-bold font-thai text-slate-100 mt-0.5">
                                {project.creator}
                              </div>
                              <div className="text-[10px] text-sky-300 font-sans">
                                {project.affiliation}
                              </div>
                            </div>
                            <div className="text-right">
                              <div
                                className={`text-[9px] font-mono px-2 py-1 rounded border ${
                                  showFinishing
                                    ? 'border-amber-400/60 text-amber-300 bg-amber-950/40'
                                    : 'border-slate-600 text-slate-300'
                                }`}
                              >
                                Spot Foil + Blind Emboss
                              </div>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <DraggableLayoutBlock
                          key={blockId}
                          id={blockId}
                          index={index}
                          totalBlocks={bookFrontOrder.order.length}
                          label={label}
                          category={category}
                          isReorderMode={isReorderMode}
                          isDragging={bookFrontOrder.draggedBlockId === blockId}
                          dropPosition={bookFrontOrder.dragOverBlockId === blockId ? bookFrontOrder.dropPosition : null}
                          onDragStart={bookFrontOrder.handleDragStart}
                          onDragOver={bookFrontOrder.handleDragOver}
                          onDragLeave={bookFrontOrder.handleDragLeave}
                          onDrop={bookFrontOrder.handleDrop}
                          onDragEnd={bookFrontOrder.handleDragEnd}
                          onMoveUp={(id) => bookFrontOrder.stepBlock(id, 'up')}
                          onMoveDown={(id) => bookFrontOrder.stepBlock(id, 'down')}
                        >
                          {content}
                        </DraggableLayoutBlock>
                      );
                    })}
                  </div>
                </div>
              ) : isPoster ? (
                /* ================= POSTER LAYOUT ================= */
                <div className="w-full h-full p-8 sm:p-10 flex flex-col justify-between relative z-10 gap-3">
                  {posterOrder.order.map((blockId, index) => {
                    let content = null;
                    let label = '';
                    let category: BlockCategory = 'body';

                    if (blockId === 'poster_header') {
                      label = 'Architecture Header & Tag';
                      category = 'header';
                      content = (
                        <div className="flex items-center justify-between pb-3 border-b-2 border-slate-900 text-xs font-mono font-bold tracking-widest uppercase">
                          <span>FACULTY OF INDUSTRIAL TECHNOLOGY • NRRU</span>
                          <span className="text-[#e63946]">BIENNIAL 2026</span>
                        </div>
                      );
                    } else if (blockId === 'poster_headline') {
                      label = 'Display Headline Lockup';
                      category = 'headline';
                      content = (
                        <div className="my-2">
                          <div className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-1">
                            EXHIBITION ARCHITECTURE
                          </div>
                          <h2
                            className="text-3xl sm:text-4xl font-black tracking-tighter text-slate-900 leading-none mb-2"
                            style={{
                              letterSpacing: isAutoKerningActive ? headlineKerning.cssLetterSpacing : undefined,
                            }}
                          >
                            TYPOGRAPHY &amp; PRINT DESIGN
                          </h2>
                          <h3
                            className="text-xl sm:text-2xl font-bold font-thai text-[#e63946] leading-tight"
                            style={{
                              letterSpacing: isAutoKerningActive ? headlineKerning.cssLetterSpacing : undefined,
                            }}
                          >
                            {project.typography.sampleHeadline}
                          </h3>
                        </div>
                      );
                    } else if (blockId === 'poster_graphic') {
                      label = 'Asymmetric Red Accent Graphic';
                      category = 'graphic';
                      content = (
                        <div className="my-3 border-l-4 border-[#e63946] pl-6 py-2 bg-[#e63946]/[0.02] rounded-r">
                          <p className="text-sm text-slate-700 font-serif leading-relaxed max-w-sm">
                            {project.typography.sampleBody}
                          </p>
                          <p className="text-xs text-slate-600 font-thai leading-relaxed mt-2 max-w-sm">
                            {project.typography.sampleThaiBody}
                          </p>
                        </div>
                      );
                    } else if (blockId === 'poster_footer') {
                      label = 'Curatorial Specs & Colophon';
                      category = 'footer';
                      content = (
                        <div className="pt-4 border-t border-slate-900/40 flex items-end justify-between font-mono text-xs">
                          <div>
                            <div className="font-bold text-slate-900">
                              CURATED BY: {project.creator}
                            </div>
                            <div className="text-[10px] text-slate-600">
                              {project.affiliation}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-black text-[#e63946]">
                              594 × 841 MM
                            </div>
                            <div className="text-[9px] text-slate-500">
                              ISO A1 • 300 DPI • FOGRA39
                            </div>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <DraggableLayoutBlock
                        key={blockId}
                        id={blockId}
                        index={index}
                        totalBlocks={posterOrder.order.length}
                        label={label}
                        category={category}
                        isReorderMode={isReorderMode}
                        isDragging={posterOrder.draggedBlockId === blockId}
                        dropPosition={posterOrder.dragOverBlockId === blockId ? posterOrder.dropPosition : null}
                        onDragStart={posterOrder.handleDragStart}
                        onDragOver={posterOrder.handleDragOver}
                        onDragLeave={posterOrder.handleDragLeave}
                        onDrop={posterOrder.handleDrop}
                        onDragEnd={posterOrder.handleDragEnd}
                        onMoveUp={(id) => posterOrder.stepBlock(id, 'up')}
                        onMoveDown={(id) => posterOrder.stepBlock(id, 'down')}
                      >
                        {content}
                      </DraggableLayoutBlock>
                    );
                  })}
                </div>
              ) : isMagazine ? (
                /* ================= MAGAZINE DOUBLE-PAGE SPREAD ================= */
                <div className="w-full h-full flex relative z-10">
                  {/* Left Page (Page 42) */}
                  <div className="flex-1 p-7 flex flex-col justify-between border-r border-slate-300/60 relative gap-3">
                    {magLeftOrder.order.map((blockId, index) => {
                      let content = null;
                      let label = '';
                      let category: BlockCategory = 'body';

                      if (blockId === 'mag_left_header') {
                        label = 'Running Header (Culture & Type)';
                        category = 'header';
                        content = (
                          <div className="flex items-center justify-between text-[8px] font-mono text-slate-400 pb-2 border-b border-slate-300/60 uppercase tracking-wider mb-2">
                            <span>CULTURE &amp; TYPOGRAPHY • VOL. 28</span>
                            <span>FEATURE SPREAD</span>
                          </div>
                        );
                      } else if (blockId === 'mag_left_headline') {
                        label = 'Monumental Headline (Essay)';
                        category = 'headline';
                        content = (
                          <div className="space-y-1 mb-2">
                            <span className="text-[10px] font-mono text-[#c85a32] uppercase font-bold tracking-widest">
                              EDITORIAL ESSAY
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 leading-tight">
                              {project.title.length > 50 ? project.title.slice(0, 48) + '...' : project.title}
                            </h2>
                          </div>
                        );
                      } else if (blockId === 'mag_left_dropcap') {
                        label = 'Drop Cap Narrative Paragraph';
                        category = 'body';
                        content = (
                          <div className="text-xs text-slate-700 leading-relaxed font-serif relative">
                            <span className="float-left text-4xl font-bold font-serif leading-none pr-2.5 pt-1 text-[#c85a32]">
                              E
                            </span>
                            <span>{project.typography.sampleBody}</span>
                          </div>
                        );
                      } else if (blockId === 'mag_left_pullquote') {
                        label = 'Metallic Gold Pull Quote Box';
                        category = 'graphic';
                        content = (
                          <div className="p-3.5 bg-amber-50/60 border-l-4 border-[#d4a359] rounded-r">
                            <p className="text-xs font-serif italic text-slate-800 leading-relaxed">
                              &ldquo;When columns breathe with asymmetric negative space, reading transforms from a passive scan into an immersive aesthetic dialogue.&rdquo;
                            </p>
                            <span className="text-[9px] font-mono text-[#c85a32] block mt-1.5 font-bold">
                              — Editorial Principle No. 4
                            </span>
                          </div>
                        );
                      } else if (blockId === 'mag_left_folio') {
                        label = 'Van De Graaf Grid Folio';
                        category = 'footer';
                        content = (
                          <div className="text-[9px] font-mono text-slate-400 flex items-center justify-between pt-3 border-t border-slate-200">
                            <span>42</span>
                            <span className="uppercase tracking-widest text-[8px]">VAN DE GRAAF 8-COL GRID</span>
                          </div>
                        );
                      }

                      return (
                        <DraggableLayoutBlock
                          key={blockId}
                          id={blockId}
                          index={index}
                          totalBlocks={magLeftOrder.order.length}
                          label={label}
                          category={category}
                          isReorderMode={isReorderMode}
                          isDragging={magLeftOrder.draggedBlockId === blockId}
                          dropPosition={magLeftOrder.dragOverBlockId === blockId ? magLeftOrder.dropPosition : null}
                          onDragStart={magLeftOrder.handleDragStart}
                          onDragOver={magLeftOrder.handleDragOver}
                          onDragLeave={magLeftOrder.handleDragLeave}
                          onDrop={magLeftOrder.handleDrop}
                          onDragEnd={magLeftOrder.handleDragEnd}
                          onMoveUp={(id) => magLeftOrder.stepBlock(id, 'up')}
                          onMoveDown={(id) => magLeftOrder.stepBlock(id, 'down')}
                        >
                          {content}
                        </DraggableLayoutBlock>
                      );
                    })}
                  </div>

                  {/* Center Gutter / Spine Fold Divider */}
                  <div className="w-1.5 h-full bg-slate-300/50 shadow-inner relative flex items-center justify-center">
                    <div className="w-[1px] h-full bg-slate-400/60"></div>
                  </div>

                  {/* Right Page (Page 43) */}
                  <div className="flex-1 p-7 flex flex-col justify-between relative bg-white/40 gap-3">
                    {magRightOrder.order.map((blockId, index) => {
                      let content = null;
                      let label = '';
                      let category: BlockCategory = 'body';

                      if (blockId === 'mag_right_header') {
                        label = 'Running Header (NRRU Intel)';
                        category = 'header';
                        content = (
                          <div className="flex items-center justify-between text-[8px] font-mono text-slate-400 pb-2 border-b border-slate-300/60 uppercase tracking-wider mb-2">
                            <span>NRRU EDITORIAL INTELLIGENCE</span>
                            <span>ISSUE 18</span>
                          </div>
                        );
                      } else if (blockId === 'mag_right_visual') {
                        label = 'FOGRA39 Visual Framing Graphic';
                        category = 'graphic';
                        content = (
                          <div className="p-4 rounded-lg bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-sm relative overflow-hidden">
                            <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full border border-sky-400/20 pointer-events-none"></div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-[9px] px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800/60 font-mono">
                                FOGRA39 CERTIFIED
                              </span>
                              <span className="text-[9px] text-amber-300 font-mono">
                                SPOT PANTONE 872 C
                              </span>
                            </div>
                            <h3 className="text-sm font-bold font-thai text-amber-100 leading-snug">
                              {project.typography.sampleHeadline}
                            </h3>
                            <p className="text-[10px] text-sky-200/80 mt-1 font-serif italic">
                              {project.typography.sampleSubhead}
                            </p>
                          </div>
                        );
                      } else if (blockId === 'mag_right_bilingual') {
                        label = 'Thai Bilingual Text (2-Col)';
                        category = 'body';
                        content = (
                          <div className="grid grid-cols-2 gap-3 text-[10px] leading-relaxed text-slate-700">
                            <div>
                              <p className="font-thai leading-relaxed">
                                {project.typography.sampleThaiBody}
                              </p>
                            </div>
                            <div>
                              <p className="font-serif leading-relaxed text-slate-600">
                                The rhythm of the spread is preserved through mathematical baseline lock (14pt grid). Every subhead and folio aligns to integer grid increments.
                              </p>
                              <div className="mt-3 pt-2 border-t border-slate-200 text-[9px] font-mono text-slate-500">
                                <div>Curated by: {project.creator}</div>
                                <div className="text-[8px] text-slate-400">{project.affiliation}</div>
                              </div>
                            </div>
                          </div>
                        );
                      } else if (blockId === 'mag_right_folio') {
                        label = 'ISO 12647-2 Certified Folio';
                        category = 'footer';
                        content = (
                          <div className="text-[9px] font-mono text-slate-400 flex items-center justify-between pt-3 border-t border-slate-200">
                            <span className="uppercase tracking-widest text-[8px]">ISO 12647-2 CERTIFIED</span>
                            <span className="font-bold">43</span>
                          </div>
                        );
                      }

                      return (
                        <DraggableLayoutBlock
                          key={blockId}
                          id={blockId}
                          index={index}
                          totalBlocks={magRightOrder.order.length}
                          label={label}
                          category={category}
                          isReorderMode={isReorderMode}
                          isDragging={magRightOrder.draggedBlockId === blockId}
                          dropPosition={magRightOrder.dragOverBlockId === blockId ? magRightOrder.dropPosition : null}
                          onDragStart={magRightOrder.handleDragStart}
                          onDragOver={magRightOrder.handleDragOver}
                          onDragLeave={magRightOrder.handleDragLeave}
                          onDrop={magRightOrder.handleDrop}
                          onDragEnd={magRightOrder.handleDragEnd}
                          onMoveUp={(id) => magRightOrder.stepBlock(id, 'up')}
                          onMoveDown={(id) => magRightOrder.stepBlock(id, 'down')}
                        >
                          {content}
                        </DraggableLayoutBlock>
                      );
                    })}
                  </div>
                </div>
              ) : isFlyer ? (
                /* ================= COMMERCIAL PROMOTIONAL FLYER ================= */
                <div className="w-full h-full p-8 flex flex-col justify-between relative z-10 bg-[#0b092b] text-white overflow-hidden gap-3">
                  {/* Top Ambient Glow / Geometric Accents */}
                  <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#00b4d8]/20 blur-2xl pointer-events-none"></div>
                  <div className="absolute top-1/2 -left-12 w-36 h-36 rounded-full bg-[#f72585]/20 blur-2xl pointer-events-none"></div>

                  {flyerOrder.order.map((blockId, index) => {
                    let content = null;
                    let label = '';
                    let category: BlockCategory = 'body';

                    if (blockId === 'flyer_banner') {
                      label = 'Event Beacon Banner';
                      category = 'header';
                      content = (
                        <div className="flex items-center justify-between pb-3 border-b border-indigo-900/80 text-[10px] font-mono">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-[#f72585] text-white font-bold tracking-wider">
                              LIVE SUMMIT 2026
                            </span>
                            <span className="text-cyan-300 font-semibold">
                              FACULTY OF INDUSTRIAL TECHNOLOGY
                            </span>
                          </div>
                          <span className="text-slate-400">NRRU PRESS</span>
                        </div>
                      );
                    } else if (blockId === 'flyer_headline') {
                      label = 'Main Headline Lockup';
                      category = 'headline';
                      content = (
                        <div className="my-2">
                          <h2 className="text-2xl sm:text-3xl font-black font-sans tracking-tight text-white leading-tight">
                            {project.title.length > 50 ? project.title.slice(0, 48) + '...' : project.title}
                          </h2>
                          <h3 className="text-base sm:text-lg font-bold font-thai text-[#00b4d8] mt-1 leading-snug">
                            {project.typography.sampleHeadline}
                          </h3>
                          <p className="text-xs text-slate-300 mt-2 max-w-md font-sans">
                            {project.typography.sampleSubhead}
                          </p>
                        </div>
                      );
                    } else if (blockId === 'flyer_features') {
                      label = '3-Column AI Feature Cards';
                      category = 'card';
                      content = (
                        <div className="grid grid-cols-3 gap-2.5 my-2">
                          <div className="p-2.5 rounded-lg bg-slate-900/90 border border-cyan-500/40">
                            <div className="text-[#00b4d8] font-mono font-bold text-xs">01. AI PIPELINE</div>
                            <p className="text-[10px] text-slate-300 mt-1 font-sans">
                              Multi-engine OS orchestration with 30+ production contracts.
                            </p>
                          </div>
                          <div className="p-2.5 rounded-lg bg-slate-900/90 border border-pink-500/40">
                            <div className="text-[#f72585] font-mono font-bold text-xs">02. PREPRESS LAB</div>
                            <p className="text-[10px] text-slate-300 mt-1 font-sans">
                              ISO 12647-2 FOGRA39 proofing and live color separation plates.
                            </p>
                          </div>
                          <div className="p-2.5 rounded-lg bg-slate-900/90 border border-indigo-500/40">
                            <div className="text-indigo-300 font-mono font-bold text-xs">03. WORKSHOPS</div>
                            <p className="text-[10px] text-slate-300 mt-1 font-sans">
                              Hands-on typography, risograph and foil stamping masterclasses.
                            </p>
                          </div>
                        </div>
                      );
                    } else if (blockId === 'flyer_voucher') {
                      label = 'Perforated Voucher & QR Code';
                      category = 'asset';
                      content = (
                        <div className="relative pt-4 border-t-2 border-dashed border-cyan-500/60 mt-1">
                          <div className="absolute -top-3 left-4 bg-[#0b092b] px-2 text-[9px] font-mono text-cyan-300 flex items-center gap-1">
                            <Scissors className="w-3 h-3 text-cyan-400" />
                            <span>PERFORATED VOUCHER TEAR STUB</span>
                          </div>

                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <div className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                                VIP ACCESS PASS • 20% DISCOUNT
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                                CODE: <span className="text-[#f72585] font-bold">NRRU-PRINT-2026</span> • ADMIT ONE
                              </div>
                              <div className="text-[9px] text-slate-500 font-mono mt-1">
                                {project.creator} • {project.affiliation}
                              </div>
                            </div>

                            {/* Simulated QR Code Matrix */}
                            <div className="w-14 h-14 bg-white p-1 rounded flex flex-col justify-between shrink-0 shadow-md">
                              <div className="grid grid-cols-4 gap-0.5 h-full w-full">
                                {Array.from({ length: 16 }).map((_, i) => (
                                  <div
                                    key={i}
                                    className={`${
                                      i % 2 === 0 || i === 0 || i === 3 || i === 12
                                        ? 'bg-black'
                                        : 'bg-transparent'
                                    }`}
                                  />
                                ))}
                              </div>
                              <div className="text-[5px] font-mono text-black text-center font-bold">
                                SCAN TO ENTER
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <DraggableLayoutBlock
                        key={blockId}
                        id={blockId}
                        index={index}
                        totalBlocks={flyerOrder.order.length}
                        label={label}
                        category={category}
                        isReorderMode={isReorderMode}
                        isDragging={flyerOrder.draggedBlockId === blockId}
                        dropPosition={flyerOrder.dragOverBlockId === blockId ? flyerOrder.dropPosition : null}
                        onDragStart={flyerOrder.handleDragStart}
                        onDragOver={flyerOrder.handleDragOver}
                        onDragLeave={flyerOrder.handleDragLeave}
                        onDrop={flyerOrder.handleDrop}
                        onDragEnd={flyerOrder.handleDragEnd}
                        onMoveUp={(id) => flyerOrder.stepBlock(id, 'up')}
                        onMoveDown={(id) => flyerOrder.stepBlock(id, 'down')}
                      >
                        {content}
                      </DraggableLayoutBlock>
                    );
                  })}
                </div>
              ) : isNewsletter ? (
                /* ================= DIGITAL NEWSLETTER & EDITORIAL DISPATCH ================= */
                <div className="w-full h-full flex flex-col justify-between relative z-10 bg-[#0a0e17] text-white p-7 overflow-hidden gap-2">
                  {newsletterOrder.order.map((blockId, index) => {
                    let content = null;
                    let label = '';
                    let category: BlockCategory = 'body';

                    if (blockId === 'news_browser') {
                      label = 'Browser Window Top Bar';
                      category = 'header';
                      content = (
                        <div className="flex items-center justify-between pb-2.5 border-b border-slate-800 text-[10px] font-mono">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                            <span className="ml-2 text-slate-400 font-mono text-[9px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                              https://dispatch.designos.nrru.ac.th/issue-42
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/80 text-[9px] font-bold">
                              WEEKLY DISPATCH
                            </span>
                            <span className="text-slate-500">ISSUE #42</span>
                          </div>
                        </div>
                      );
                    } else if (blockId === 'news_headline') {
                      label = 'Main Story Header';
                      category = 'headline';
                      content = (
                        <div className="space-y-1 my-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60 text-[9px] font-mono font-bold">
                              AI &amp; EDITORIAL SYSTEMS
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              5 MIN READ
                            </span>
                          </div>
                          <h2 className="text-xl sm:text-2xl font-bold font-sans tracking-tight text-white leading-snug">
                            {project.title}
                          </h2>
                          <h3 className="text-sm font-thai text-emerald-400 leading-snug">
                            {project.typography.sampleHeadline}
                          </h3>
                        </div>
                      );
                    } else if (blockId === 'news_metrics') {
                      label = 'Metric Highlights Graphic Cards';
                      category = 'graphic';
                      content = (
                        <div className="grid grid-cols-2 gap-3 my-1">
                          <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                            <div>
                              <div className="text-emerald-400 font-mono font-bold text-lg leading-none">
                                +142%
                              </div>
                              <div className="text-[10px] text-slate-400 mt-1">Prepress Pipeline Speed</div>
                            </div>
                            <Sparkles className="w-5 h-5 text-emerald-400/60" />
                          </div>
                          <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                            <div>
                              <div className="text-sky-400 font-mono font-bold text-lg leading-none">
                                100 / 100
                              </div>
                              <div className="text-[10px] text-slate-400 mt-1">QA Gate ISO Verification</div>
                            </div>
                            <ShieldCheck className="w-5 h-5 text-sky-400/60" />
                          </div>
                        </div>
                      );
                    } else if (blockId === 'news_body') {
                      label = 'Article Body Excerpt';
                      category = 'body';
                      content = (
                        <div className="text-xs text-slate-300 leading-relaxed font-sans space-y-1.5 my-1">
                          <p>{project.typography.sampleBody}</p>
                          <p className="text-[11px] text-slate-400 font-thai leading-relaxed">
                            {project.typography.sampleThaiBody}
                          </p>
                        </div>
                      );
                    } else if (blockId === 'news_footer') {
                      label = 'Newsletter Footer & ISO Badge';
                      category = 'footer';
                      content = (
                        <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-500">
                          <div>
                            <span>Editor: </span>
                            <span className="text-slate-300 font-bold">{project.creator}</span>
                            <span> • {project.affiliation}</span>
                          </div>
                          <div className="text-emerald-400 font-bold">
                            ISO 12647-2 VERIFIED
                          </div>
                        </div>
                      );
                    }

                    return (
                      <DraggableLayoutBlock
                        key={blockId}
                        id={blockId}
                        index={index}
                        totalBlocks={newsletterOrder.order.length}
                        label={label}
                        category={category}
                        isReorderMode={isReorderMode}
                        isDragging={newsletterOrder.draggedBlockId === blockId}
                        dropPosition={newsletterOrder.dragOverBlockId === blockId ? newsletterOrder.dropPosition : null}
                        onDragStart={newsletterOrder.handleDragStart}
                        onDragOver={newsletterOrder.handleDragOver}
                        onDragLeave={newsletterOrder.handleDragLeave}
                        onDrop={newsletterOrder.handleDrop}
                        onDragEnd={newsletterOrder.handleDragEnd}
                        onMoveUp={(id) => newsletterOrder.stepBlock(id, 'up')}
                        onMoveDown={(id) => newsletterOrder.stepBlock(id, 'down')}
                      >
                        {content}
                      </DraggableLayoutBlock>
                    );
                  })}
                </div>
              ) : (
                /* ================= JOURNAL ARTICLE SPREAD ================= */
                <div className="w-full h-full p-8 flex flex-col justify-between relative z-10 gap-3">
                  {journalOrder.order.map((blockId, index) => {
                    let content = null;
                    let label = '';
                    let category: BlockCategory = 'body';

                    if (blockId === 'journal_header') {
                      label = 'ISSN & Journal Header';
                      category = 'header';
                      content = (
                        <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 pb-2 border-b border-slate-300">
                          <span>NRRU JOURNAL OF INDUSTRIAL TECHNOLOGY</span>
                          <span>VOL. 14 NO. 2 (2026) • ISSN: 2586-XXXX</span>
                        </div>
                      );
                    } else if (blockId === 'journal_headline') {
                      label = 'Article Title & Author Credentials';
                      category = 'headline';
                      content = (
                        <div className="my-1">
                          <h2 className="text-lg font-bold font-thai text-slate-900 leading-snug">
                            {project.typography.sampleHeadline}
                          </h2>
                          <h3 className="text-xs font-serif italic text-slate-600 mt-1">
                            {project.typography.sampleSubhead}
                          </h3>
                          <div className="text-[10px] font-mono text-[#006666] mt-1.5">
                            {project.creator} • {project.affiliation}
                          </div>
                        </div>
                      );
                    } else if (blockId === 'journal_abstract') {
                      label = 'Teal Abstract Callout Box';
                      category = 'graphic';
                      content = (
                        <div className="bg-[#f1f5f5] border-l-2 border-[#006666] p-3 rounded-r text-[11px] my-1">
                          <p className="font-thai leading-relaxed text-slate-800">
                            {project.typography.sampleThaiBody}
                          </p>
                        </div>
                      );
                    } else if (blockId === 'journal_columns') {
                      label = 'Dual-Column Scientific Spread';
                      category = 'body';
                      content = (
                        <div className="grid grid-cols-2 gap-6 text-[10px] leading-relaxed text-slate-700 my-1">
                          <div>
                            <p className="font-serif">
                              <strong>1. Introduction —</strong> Modern editorial design systems require mathematical structuralism, modularity, and reproducible rigor. The transition from monolithic prompts to OS-level engine orchestration ensures that typography integrity and prepress constraints are never compromised.
                            </p>
                          </div>
                          <div>
                            <p className="font-serif">
                              <strong>2. Mathematical Principles —</strong> All leading coordinates follow an integer multiple of the 14pt baseline grid. Margins adhere to classical Van de Graaf canons, ensuring that the inner spine margin absorbs bookbinding creep seamlessly.
                            </p>
                          </div>
                        </div>
                      );
                    } else if (blockId === 'journal_footer') {
                      label = 'DOI & Page Folio Block';
                      category = 'footer';
                      content = (
                        <div className="text-[9px] font-mono text-slate-400 flex items-center justify-between pt-2 border-t border-slate-200">
                          <span>DOI: 10.14456/nrru.tech.2026.042</span>
                          <span>Page 142</span>
                        </div>
                      );
                    }

                    return (
                      <DraggableLayoutBlock
                        key={blockId}
                        id={blockId}
                        index={index}
                        totalBlocks={journalOrder.order.length}
                        label={label}
                        category={category}
                        isReorderMode={isReorderMode}
                        isDragging={journalOrder.draggedBlockId === blockId}
                        dropPosition={journalOrder.dragOverBlockId === blockId ? journalOrder.dropPosition : null}
                        onDragStart={journalOrder.handleDragStart}
                        onDragOver={journalOrder.handleDragOver}
                        onDragLeave={journalOrder.handleDragLeave}
                        onDrop={journalOrder.handleDrop}
                        onDragEnd={journalOrder.handleDragEnd}
                        onMoveUp={(id) => journalOrder.stepBlock(id, 'up')}
                        onMoveDown={(id) => journalOrder.stepBlock(id, 'down')}
                      >
                        {content}
                      </DraggableLayoutBlock>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Measurement & Dimensions HUD */}
        <div className="w-full mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-4 flex-wrap">
            <div>
              <span className="text-slate-500">Trim Size:</span>{' '}
              <span className="text-slate-200 font-bold">
                {project.specs.trimmedDimensions.widthMm} ×{' '}
                {project.specs.trimmedDimensions.heightMm} mm
              </span>{' '}
              <span className="text-slate-500">
                ({project.specs.trimmedDimensions.standardName})
              </span>
            </div>
            <div>
              <span className="text-slate-500">Bleed:</span>{' '}
              <span className="text-rose-400 font-bold">
                {project.specs.bleedMm} mm
              </span>
            </div>
            {isBook && (
              <div>
                <span className="text-slate-500">Spine Width:</span>{' '}
                <span className="text-amber-400 font-bold">
                  {project.specs.binding.spineWidthMm} mm
                </span>
              </div>
            )}
            <div>
              <span className="text-slate-500">Color:</span>{' '}
              <span className="text-sky-300">
                {project.specs.colorSpace}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-emerald-400 font-semibold">PREPRESS COMPLIANT</span>
          </div>
        </div>
      </div>

      {/* Side Inspector: Thai Type & Print Specs Sidebar */}
      <div className="w-full xl:w-96 flex flex-col gap-4">
        {/* Side Inspector Tab Switcher */}
        <div
          className={`flex items-center gap-1 p-1 rounded-xl border transition-colors ${
            isHighContrast
              ? 'bg-black border-2 border-yellow-400'
              : isPrintView
              ? 'bg-slate-100 border-slate-300'
              : 'bg-[#0b1017] border-slate-800'
          }`}
        >
          <button
            id="tab-btn-inspector-specs"
            onClick={() => setInspectorTab('specs')}
            className={`flex-1 py-1.5 px-1.5 rounded-lg text-[11px] font-mono transition-all flex items-center justify-center gap-1 ${
              inspectorTab === 'specs'
                ? 'bg-indigo-600 text-white font-bold shadow-sm shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>Specs</span>
          </button>
          <button
            id="tab-btn-inspector-typography"
            onClick={() => setInspectorTab('typography')}
            className={`flex-1 py-1.5 px-1.5 rounded-lg text-[11px] font-mono transition-all flex items-center justify-center gap-1 ${
              inspectorTab === 'typography'
                ? 'bg-sky-600 text-white font-bold shadow-sm shadow-sky-600/30'
                : 'text-slate-400 hover:text-sky-300 hover:bg-slate-900'
            }`}
            title="Typography Previewer & Readability Tester"
          >
            <Type className="w-3 h-3 text-sky-400" />
            <span>Type</span>
          </button>
          <button
            id="tab-btn-inspector-harmony"
            onClick={() => setInspectorTab('harmony')}
            className={`flex-1 py-1.5 px-1.5 rounded-lg text-[11px] font-mono transition-all flex items-center justify-center gap-1 ${
              inspectorTab === 'harmony'
                ? 'bg-amber-600 text-slate-950 font-bold shadow-sm shadow-amber-600/30'
                : 'text-slate-400 hover:text-amber-300 hover:bg-slate-900'
            }`}
            title="CMYK Color Harmony Engine"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Colors</span>
          </button>
          <button
            id="tab-btn-inspector-history"
            onClick={() => setInspectorTab('history')}
            className={`flex-1 py-1.5 px-1.5 rounded-lg text-[11px] font-mono transition-all flex items-center justify-center gap-1 ${
              inspectorTab === 'history'
                ? 'bg-indigo-600 text-white font-bold shadow-sm shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <History className="w-3 h-3" />
            <span>History</span>
            {snapshots && (
              <span className="px-1 py-0.2 rounded-full bg-slate-900 border border-slate-700 text-[9px] font-bold text-sky-300">
                {snapshots.length}
              </span>
            )}
          </button>
        </div>

        {inspectorTab === 'typography' ? (
          /* Typography Previewer & Print Viability Studio */
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] text-slate-400 font-mono">
                Active Font Pairing Studio
              </span>
              <button
                onClick={() => setIsTypeSpecimenModalOpen(true)}
                className="text-[10px] text-sky-400 hover:text-sky-300 flex items-center gap-1 font-mono"
                title="Expand to full-width editorial spread"
              >
                <Maximize2 className="w-3 h-3" />
                <span>Full Spread</span>
              </button>
            </div>
            <TypographyPreviewer
              project={project}
              onApplyTypography={(upd) => {
                if (onUpdateTypography) onUpdateTypography(upd);
              }}
              onSaveSnapshot={onSaveSnapshot}
            />
          </div>
        ) : inspectorTab === 'harmony' ? (
          /* CMYK Asset-Driven Color Harmony Inspector */
          <ColorHarmonyInspector
            project={project}
            onApplyPalette={(newPalette, harmonyResult) => {
              if (onUpdatePalette) {
                onUpdatePalette(newPalette, harmonyResult);
              }
            }}
            onSaveSnapshot={onSaveSnapshot}
          />
        ) : inspectorTab === 'history' ? (
          /* Version History & Snapshots Inspector Panel */
          <VersionHistoryInspector
            snapshots={snapshots}
            activeSnapshotId={activeSnapshotId || ''}
            onRestoreSnapshot={(id) => onRestoreSnapshot && onRestoreSnapshot(id)}
            onOpenSaveModal={() => setIsSaveModalOpen(true)}
            onDeleteSnapshot={(id) => onDeleteSnapshot && onDeleteSnapshot(id)}
            onOpenDiff={(snapA, snapB) => setDiffModalPair({ snapA, snapB })}
            onResetDefaults={() => onResetMilestones && onResetMilestones()}
          />
        ) : (
          /* Standard Prepress Specs Panels */
          <>
            {/* Thai Typographic Stacking Inspector */}
            <div className="bg-[#0b1017] border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4 text-sky-400" />
                  <h3 className="text-xs font-mono font-bold text-slate-200 uppercase">
                    Thai Type &amp; Orthographic Inspector
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800/60 font-thai">
                  เอนจินอักษรไทย v3.3
                </span>
              </div>

              <p className="text-xs text-slate-400 font-thai leading-relaxed mb-3">
                การทดสอบการซ้อนทับสระและวรรณยุกต์ ๔ ระดับ เพื่อป้องกันวรรณยุกต์ลอยหรือตัดทอนตามมาตรฐาน Core OS:
              </p>

              {/* Thai Stacking Visual Diagram */}
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-amber-300 border-b border-slate-800/80 pb-1">
                  <span>Level 1: Tone Marks (ไม้เอก ไม้โท ไม้ตรี ไม้จัตวา)</span>
                  <span className="text-emerald-400 font-bold">0% Clip</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-sky-300 border-b border-slate-800/80 pb-1">
                  <span>Level 2: Upper Vowels (สระอิ สระอี สระอึ สระอือ)</span>
                  <span className="text-emerald-400 font-bold">Clear</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-200 border-b border-slate-800/80 pb-1">
                  <span>Level 3: Consonant Stem (พยัญชนะแกน)</span>
                  <span className="text-emerald-400 font-bold">Locked</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-purple-300">
                  <span>Level 4: Lower Vowels (สระอุ สระอู)</span>
                  <span className="text-emerald-400 font-bold">Clear</span>
                </div>
              </div>

              {/* Interactive Stack Test Display */}
              <div className="mt-3 p-3 bg-white text-slate-900 rounded-lg text-center font-thai text-xl tracking-wide border-2 border-indigo-500/40 relative overflow-hidden">
                <span className="text-slate-400 text-xs font-mono absolute top-1 left-2">
                  Stacking Check:
                </span>
                <div className="pt-2">
                  ฐิติวัสส์ • มหาวิทยาลัย • นวัตกรรม • สิ่งพิมพ์
                </div>
              </div>

              <div className="mt-2.5 text-[11px] text-slate-400 font-mono flex items-center justify-between">
                <span>Leading Compensation:</span>
                <span className="text-sky-300 font-bold">
                  +{project.typography.thaiLeadingCompensationPt}pt (+18%)
                </span>
              </div>

              {/* Quick Launch Full Typography Previewer */}
              <button
                id="btn-launch-type-previewer-from-thai"
                onClick={() => setInspectorTab('typography')}
                className="w-full mt-3 py-2 px-3 rounded-lg bg-sky-950/40 border border-sky-800/60 hover:bg-sky-900/40 text-sky-300 font-mono text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Type className="w-3.5 h-3.5 text-sky-400" />
                <span>Test Font Pairings in Typography Previewer</span>
              </button>
            </div>

            {/* Color Palette Swatches */}
            <div className="bg-[#0b1017] border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs font-mono font-bold text-slate-200 uppercase">
                    Separation Swatch Deck
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  FOGRA39 Verified
                </span>
              </div>

              <div className="space-y-2">
                {project.palette.map((c) => (
                  <div
                    key={c.name}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-5 h-5 rounded border border-white/20 shadow-sm"
                        style={{ backgroundColor: c.hex }}
                      ></div>
                      <div>
                        <div className="text-xs font-semibold text-slate-200">
                          {c.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {c.cmyk}
                        </div>
                      </div>
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 text-right">
                      {c.role}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Suggest Harmonies Action */}
              <button
                id="btn-suggest-cmyk-harmonies-deck"
                onClick={() => setInspectorTab('harmony')}
                className="w-full mt-3 py-2 px-3 rounded-lg bg-amber-950/40 border border-amber-800/60 hover:bg-amber-900/40 text-amber-300 font-mono text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Suggest CMYK Harmonies from Assets</span>
              </button>
            </div>

            {/* Paper & Binding Mechanics Summary */}
            <div className="bg-[#0b1017] border border-slate-800 rounded-xl p-4 text-xs font-mono">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-mono font-bold text-slate-200 uppercase">
                    Paper &amp; Binding Reality
                  </h3>
                </div>
              </div>

              <div className="space-y-2 text-slate-300">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-500">Stock:</span>
                  <span className="font-semibold text-slate-200">
                    {project.specs.paperStock.name}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-500">Weight &amp; Bulk:</span>
                  <span>
                    {project.specs.paperStock.weightGsm} GSM ({project.specs.paperStock.bulkCaliber})
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-500">Binding Method:</span>
                  <span className="text-amber-300 font-semibold">
                    {project.specs.binding.method}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Finishing Set:</span>
                  <span className="text-sky-300 font-semibold">
                    {project.specs.finishing.length} Embellishments
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modals for Snapshot Capturing and Comparison */}
      <SaveSnapshotModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        currentProject={project}
        suggestedVersionName={`v1.${(snapshots?.length || 3) + 1} — ${project.projectType.split(' ')[0]} Checkpoint`}
        onSave={(versionName, tag, description) => {
          if (onSaveSnapshot) onSaveSnapshot(versionName, tag, description);
        }}
      />

      {diffModalPair && (
        <VersionDiffModal
          isOpen={true}
          onClose={() => setDiffModalPair(null)}
          snapshotA={diffModalPair.snapA}
          snapshotB={diffModalPair.snapB}
          onRestore={(id) => {
            if (onRestoreSnapshot) onRestoreSnapshot(id);
          }}
        />
      )}

      {/* Full-Spread Typography Previewer Modal */}
      {isTypeSpecimenModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#0b1017] border border-slate-700 rounded-2xl w-full max-w-6xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950">
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-sky-400" />
                <h2 className="text-xs font-bold text-slate-100 uppercase tracking-wide font-mono">
                  Full-Spread Typography Previewer &amp; Print Viability Studio
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800/60 font-mono">
                  Expanded Reading Environment
                </span>
              </div>
              <button
                onClick={() => setIsTypeSpecimenModalOpen(false)}
                className="text-slate-400 hover:text-white px-2 py-1 rounded-lg hover:bg-slate-800 text-xs font-mono transition-colors"
              >
                Close (ESC)
              </button>
            </div>
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              <TypographyPreviewer
                project={project}
                onApplyTypography={(upd) => {
                  if (onUpdateTypography) onUpdateTypography(upd);
                }}
                onSaveSnapshot={onSaveSnapshot}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
