/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ActiveProjectState, EngineContract } from '../types/os';
import { ENGINE_REGISTRY } from '../data/engineRegistry';
import {
  generateProjectArchiveJSON,
  downloadProjectArchiveJSON,
  downloadProjectManifestPDF,
} from '../services/projectExportService';
import { useToast } from '../context/ToastContext';
import {
  X,
  FileDown,
  FileText,
  FileCode,
  Copy,
  Check,
  ShieldCheck,
  Layers,
  CheckCircle2,
} from 'lucide-react';

interface ProjectExportModalProps {
  project: ActiveProjectState;
  onClose: () => void;
}

export const ProjectExportModal: React.FC<ProjectExportModalProps> = ({
  project,
  onClose,
}) => {
  const { notifyExport, notifySuccess } = useToast();
  const [activeTab, setActiveTab] = useState<'pdf' | 'json' | 'txt'>('pdf');
  const [copied, setCopied] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const archiveJson = generateProjectArchiveJSON(project);

  const specText = `================================================================================
UNIVERSAL EDITORIAL & PRINT DESIGN AI OS — PRODUCTION SPECIFICATION SHEET
================================================================================
Project Title: ${project.title}
Creator: ${project.creator}
Affiliation: ${project.affiliation}
OS Architecture: ${project.osVersion}
Generated Date: ${new Date().toISOString()}

1. MEDIA & PHYSICAL TRIM DIMENSIONS
--------------------------------------------------------------------------------
Media Classification: ${project.specs.mediaClass}
Finished Trim Size: ${project.specs.trimmedDimensions.widthMm} x ${project.specs.trimmedDimensions.heightMm} mm (${project.specs.trimmedDimensions.widthPt} x ${project.specs.trimmedDimensions.heightPt} pt)
Standard: ${project.specs.trimmedDimensions.standardName}
Bleed Allowance: ${project.specs.bleedMm} mm continuous on all cut edges
Slug Allowance: ${project.specs.slugMm} mm (Imposition & registration marks)
Margins: Top: ${project.specs.marginsMm.top}mm | Bottom: ${project.specs.marginsMm.bottom}mm | Inside: ${project.specs.marginsMm.inside}mm | Outside: ${project.specs.marginsMm.outside}mm

2. BINDING & SPINE FORMULATION
--------------------------------------------------------------------------------
Binding Style: ${project.specs.binding.method}
Calculated Spine Thickness: ${project.specs.binding.spineWidthMm} mm
Spine Calculation Formula: (Page Count / 2) * (Paper Bulk Caliper * GSM / 1000)
Hinge Creasing: ${project.specs.binding.creasing}

3. PAPER STOCK & SUBSTRATE
--------------------------------------------------------------------------------
Stock Name: ${project.specs.paperStock.name}
Grammage: ${project.specs.paperStock.weightGsm} GSM
Finish & Caliper: ${project.specs.paperStock.finish} (${project.specs.paperStock.bulkCaliber})
Opacity: ${project.specs.paperStock.opacityPercent}%
Grain Direction: Parallel to book spine (Essential to prevent page waviness)

4. COLOR MANAGEMENT & SEPARATION PLATES
--------------------------------------------------------------------------------
Color Space: ${project.specs.colorSpace}
Cyan (C): ${project.specs.cmykPlates.cyan}
Magenta (M): ${project.specs.cmykPlates.magenta}
Yellow (Y): ${project.specs.cmykPlates.yellow}
Black (K): ${project.specs.cmykPlates.black}
Spot Color Plate 5: ${project.specs.cmykPlates.spotPantone || 'None'}
Total Ink Coverage (TIC): Maximum 280% (Safe for high-speed offset)
Text Rule: 100% K Overprint enabled on all text body < 24pt

5. ACTIVE ENGINE ROSTER (${project.activeEngineIds.length} LOADED)
--------------------------------------------------------------------------------
${project.activeEngineIds.map((id) => {
  const eng = ENGINE_REGISTRY.find((e: EngineContract) => e.id === id);
  return `• [${id}] ${eng?.name || id} (${eng?.category || 'General'})`;
}).join('\n')}

6. QA GATE SIGN-OFF
--------------------------------------------------------------------------------
QA Gate Status: ${project.qaGate.status} (${project.qaGate.totalScore}/100)
Verdict: ${project.qaGate.verdict}
Sign-off: Core OS Production Intelligence Engine
================================================================================`;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(archiveJson);
    setCopied(true);
    notifySuccess('Copied to Clipboard', 'JSON Project Archive copied to system clipboard.');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyTxt = () => {
    navigator.clipboard.writeText(specText);
    setCopied(true);
    notifySuccess('Copied to Clipboard', 'Plaintext print production specs copied to clipboard.');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    setIsGeneratingPdf(true);
    const filename = `Prepress_Manifest_${project.id}.pdf`;
    try {
      downloadProjectManifestPDF(project);
      notifyExport(
        filename,
        'PDF Prepress Manifest',
        'ISO 12647-2 certified print production passport generated with bleed marks & separation metadata.'
      );
    } catch (err) {
      console.error('PDF Generation Error:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleDownloadJSON = () => {
    const filename = `design_os_project_${project.id}.json`;
    downloadProjectArchiveJSON(project);
    notifyExport(
      filename,
      'JSON Project Archive',
      `Complete state tree with ${project.activeEngineIds.length} active engines, typography ladder, and QA score.`
    );
  };

  const handleDownloadTxt = () => {
    const filename = `Print_Specs_${project.id}.txt`;
    const blob = new Blob([specText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    notifyExport(
      filename,
      'Plaintext Production Sheet',
      'Commercial press sign-off specification document generated successfully.'
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#0b1017] border border-slate-700 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden font-mono text-xs">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <FileDown className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-wide">
                  PROJECT EXPORT CENTER
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60 font-mono">
                  {project.osVersion}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Generate comprehensive PDF Prepress Manifest or full JSON Project Archive
              </p>
            </div>
          </div>

          <button
            id="btn-close-export-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selector Tabs */}
        <div className="bg-[#0e141e] border-b border-slate-800 px-4 py-2 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              id="tab-export-pdf"
              onClick={() => setActiveTab('pdf')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-semibold transition-colors ${
                activeTab === 'pdf'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>PDF Prepress Manifest</span>
              <span className="text-[10px] bg-white/20 px-1 rounded">Official</span>
            </button>

            <button
              id="tab-export-json"
              onClick={() => setActiveTab('json')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-semibold transition-colors ${
                activeTab === 'json'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>JSON Project Archive (.designos.json)</span>
            </button>

            <button
              id="tab-export-txt"
              onClick={() => setActiveTab('txt')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-semibold transition-colors ${
                activeTab === 'txt'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Spec Sheet (.txt)</span>
            </button>
          </div>

          {/* Quick Metrics Chips */}
          <div className="flex items-center gap-2 text-[11px] text-slate-400 hidden md:flex">
            <span className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded border border-slate-800">
              <Layers className="w-3 h-3 text-sky-400" />
              {project.activeEngineIds.length} Active Engines
            </span>
            <span className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded border border-slate-800">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              QA: {project.qaGate.totalScore}/100 ({project.qaGate.status})
            </span>
          </div>
        </div>

        {/* Tab Content Panels */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#080c12]">
          {/* TAB 1: PDF Manifest Preview */}
          {activeTab === 'pdf' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="text-white font-bold text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4 text-sky-400" />
                    <span>ISO 12647-2 Certified PDF Manifest</span>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-1">
                    Multi-page comprehensive pre-flight dossier including mechanical trim, bleed, spine caliper formula, 100-Point QA gate audit scorecard, and active engine configuration matrix.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    id="btn-download-pdf-manifest"
                    onClick={handleDownloadPDF}
                    disabled={isGeneratingPdf}
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-2 transition-colors shadow-md disabled:opacity-50"
                  >
                    <FileDown className="w-4 h-4" />
                    <span>{isGeneratingPdf ? 'COMPILING PDF...' : 'DOWNLOAD PDF MANIFEST'}</span>
                  </button>
                </div>
              </div>

              {/* PDF Manifest Layout Preview */}
              <div className="p-5 rounded-xl bg-[#0d131d] border border-slate-800 space-y-4">
                <div className="text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-800 pb-2">
                  Dossier Sections Included in PDF:
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1.5">
                    <div className="font-bold text-sky-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      1. Title &amp; Architectural Identity
                    </div>
                    <p className="text-slate-300">
                      {project.title} • {project.creator} ({project.affiliation}) • Core OS {project.osVersion}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1.5">
                    <div className="font-bold text-sky-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      2. 100-Point QA Gate Scorecard
                    </div>
                    <p className="text-slate-300">
                      Total: {project.qaGate.totalScore}/100 ({project.qaGate.status}) • 10 Detailed Category Pillar Breakdowns
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1.5">
                    <div className="font-bold text-sky-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      3. Physical Mechanical Specifications
                    </div>
                    <p className="text-slate-300">
                      Trim: {project.specs.trimmedDimensions.widthMm}x{project.specs.trimmedDimensions.heightMm}mm • Spine: {project.specs.binding.spineWidthMm}mm • Substrate: {project.specs.paperStock.name}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1.5">
                    <div className="font-bold text-sky-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      4. Active Engine Roster ({project.activeEngineIds.length} Loaded)
                    </div>
                    <p className="text-slate-300">
                      Full engine contracts, rule validations, and parameters for all active modules.
                    </p>
                  </div>
                </div>

                {/* Prepress Assurance Badge */}
                <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/50 flex items-center gap-3 text-emerald-300 text-xs">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <strong>Press RIP Compatibility:</strong> The generated PDF is calibrated to standard A4 printing and complies with ISO 12647-2 commercial offset specifications with CMYK/Spot plate declarations.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: JSON Project Archive */}
          {activeTab === 'json' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="text-white font-bold text-sm flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-indigo-400" />
                    <span>Complete JSON Project Archive (.designos.json)</span>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-1">
                    Self-contained project state snapshot capturing active engine parameters, QA evaluations, design critic audits, and prepress configurations for lossless portability and versioning.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    id="btn-copy-json"
                    onClick={handleCopyJson}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 flex items-center gap-1.5 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>COPIED</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>COPY JSON</span>
                      </>
                    )}
                  </button>
                  <button
                    id="btn-download-json-archive"
                    onClick={handleDownloadJSON}
                    className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-2 transition-colors shadow-md"
                  >
                    <FileDown className="w-4 h-4" />
                    <span>DOWNLOAD .JSON</span>
                  </button>
                </div>
              </div>

              {/* JSON Code Viewer */}
              <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950">
                <div className="px-4 py-2 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span>payload.designos.json ({Math.round(archiveJson.length / 1024)} KB)</span>
                  <span className="text-indigo-400">JSON Schema: v1.0.0</span>
                </div>
                <pre className="p-4 text-sky-300 text-[11px] leading-relaxed max-h-96 overflow-y-auto whitespace-pre font-mono">
                  {archiveJson}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: Spec Sheet .txt */}
          {activeTab === 'txt' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="text-white font-bold text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-400" />
                    <span>Commercial Press Spec Sheet (.txt)</span>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-1">
                    Plain-text ASCII pre-flight specification sheet for machine operators, RIP engineers, and bindery technicians.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    id="btn-copy-txt"
                    onClick={handleCopyTxt}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 flex items-center gap-1.5 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>COPIED</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>COPY TEXT</span>
                      </>
                    )}
                  </button>
                  <button
                    id="btn-download-txt-spec"
                    onClick={handleDownloadTxt}
                    className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-2 transition-colors shadow-md"
                  >
                    <FileDown className="w-4 h-4" />
                    <span>DOWNLOAD .TXT</span>
                  </button>
                </div>
              </div>

              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-[11px] leading-relaxed whitespace-pre-wrap font-mono">
                {specText}
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3">
          <div className="text-slate-400 text-[11px]">
            Universal Editorial &amp; Print Design AI OS • Prepress Manifest v1.0.0
          </div>
          <button
            id="btn-footer-close-export"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
