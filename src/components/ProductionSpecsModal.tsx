import React, { useState } from 'react';
import { ActiveProjectState } from '../types/os';
import { X, Copy, Check, Printer, Download, FileText, CheckCircle2 } from 'lucide-react';

interface ProductionSpecsModalProps {
  project: ActiveProjectState;
  onClose: () => void;
}

export const ProductionSpecsModal: React.FC<ProductionSpecsModalProps> = ({
  project,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

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

5. FINISHING & EMBELLISHMENTS
--------------------------------------------------------------------------------
${project.specs.finishing.map((f, i) => `[x] Embellishment ${i + 1}: ${f}`).join('\n')}

6. PREPRESS PRE-FLIGHT AUDIT
--------------------------------------------------------------------------------
${project.specs.prepressChecklist.map((c) => `[${c.status}] ${c.item}`).join('\n')}

7. QA GATE SIGN-OFF
--------------------------------------------------------------------------------
QA Gate Status: ${project.qaGate.status} (${project.qaGate.totalScore}/100)
Verdict: ${project.qaGate.verdict}
Sign-off: Core OS Production Intelligence Engine
================================================================================`;

  const handleCopy = () => {
    navigator.clipboard.writeText(specText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([specText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Print_Specs_${project.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0b1017] border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden font-mono text-xs">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Commercial Press Production Specification Sheet
            </h3>
          </div>
          <button
            id="btn-close-specs-modal"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Preformatted Sheet */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#080c12]">
          <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-[11px] leading-relaxed whitespace-pre-wrap font-mono">
            {specText}
          </pre>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3">
          <div className="text-slate-400 text-[11px]">
            Ready for output to RIP / InDesign IDML / JDF Workflow
          </div>
          <div className="flex items-center gap-2">
            <button
              id="btn-copy-specs"
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 flex items-center gap-1.5 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>COPIED TO CLIPBOARD</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>COPY SPEC SHEET</span>
                </>
              )}
            </button>
            <button
              id="btn-download-specs"
              onClick={handleDownload}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>DOWNLOAD SPEC TXT</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
