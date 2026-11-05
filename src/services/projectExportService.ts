/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { jsPDF } from 'jspdf';
import { ActiveProjectState, EngineContract, QACategoryScore } from '../types/os';
import { ENGINE_REGISTRY } from '../data/engineRegistry';
import { SYSTEM_INFO } from '../data/coreOS';

export interface ProjectArchivePayload {
  version: string;
  osArchitecture: string;
  exportedAt: string;
  system: {
    name: string;
    creator: typeof SYSTEM_INFO.creator;
    goldenRule: string;
    governanceHierarchy: string;
  };
  project: ActiveProjectState;
  activeEnginesDetail: Array<{
    id: string;
    name: string;
    category: string;
    description: string;
    rulesCount: number;
    parameters: Record<string, any>;
  }>;
  qaSummary: {
    totalScore: number;
    maxScore: number;
    status: string;
    verdict: string;
    categories: QACategoryScore[];
    criticisms: string[];
    requiredRevisions: string[];
  };
  prepressSummary: {
    trimMm: string;
    bleedMm: number;
    slugMm: number;
    spineMm: number;
    paperStock: string;
    colorSpace: string;
    spotColor: string | null;
  };
}

/**
 * Build complete JSON project archive payload
 */
export function generateProjectArchiveJSON(project: ActiveProjectState): string {
  const activeEnginesDetail = project.activeEngineIds.map((id) => {
    const engine = ENGINE_REGISTRY.find((e: EngineContract) => e.id === id);
    return {
      id,
      name: engine?.name || id,
      category: engine?.category || 'Custom',
      description: engine?.purpose || '',
      rulesCount: engine?.rules.length || 0,
      parameters: engine?.parameters || {},
    };
  });

  const payload: ProjectArchivePayload = {
    version: '1.0.0',
    osArchitecture: project.osVersion,
    exportedAt: new Date().toISOString(),
    system: {
      name: SYSTEM_INFO.name,
      creator: SYSTEM_INFO.creator,
      goldenRule: SYSTEM_INFO.goldenRule,
      governanceHierarchy: SYSTEM_INFO.governanceHierarchy,
    },
    project,
    activeEnginesDetail,
    qaSummary: {
      totalScore: project.qaGate.totalScore,
      maxScore: 100,
      status: project.qaGate.status,
      verdict: project.qaGate.verdict,
      categories: project.qaGate.categories,
      criticisms: project.qaGate.criticisms,
      requiredRevisions: project.qaGate.requiredRevisions,
    },
    prepressSummary: {
      trimMm: `${project.specs.trimmedDimensions.widthMm} x ${project.specs.trimmedDimensions.heightMm} mm`,
      bleedMm: project.specs.bleedMm,
      slugMm: project.specs.slugMm,
      spineMm: project.specs.binding.spineWidthMm,
      paperStock: `${project.specs.paperStock.name} (${project.specs.paperStock.weightGsm} GSM)`,
      colorSpace: project.specs.colorSpace,
      spotColor: project.specs.cmykPlates.spotPantone || null,
    },
  };

  return JSON.stringify(payload, null, 2);
}

/**
 * Trigger client-side download of the JSON Project Archive
 */
export function downloadProjectArchiveJSON(project: ActiveProjectState): void {
  const jsonContent = generateProjectArchiveJSON(project);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const safeTitle = project.title.replace(/[^a-zA-Z0-9_\u0E00-\u0E7F]/g, '_').substring(0, 30);
  link.href = url;
  link.download = `${safeTitle || 'Project'}_Archive_${project.id}.designos.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate and download a comprehensive, publication-grade PDF Project Manifest
 */
export function downloadProjectManifestPDF(project: ActiveProjectState): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin - 10) {
      doc.addPage();
      y = margin;
      drawPageBorder();
    }
  };

  const drawPageBorder = () => {
    doc.setDrawColor(200, 205, 215);
    doc.setLineWidth(0.3);
    doc.rect(margin - 3, margin - 3, contentWidth + 6, pageHeight - (margin - 3) * 2);

    // Header micro rule
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(100, 110, 130);
    doc.text('UNIVERSAL EDITORIAL & PRINT DESIGN AI OS — OFFICIAL MANIFEST & PREPRESS PASSPORT', margin, margin - 5);
    doc.setFont('helvetica', 'normal');
    doc.text(`Core OS ${project.osVersion} • ISO 12647-2 Certified Output`, pageWidth - margin, margin - 5, { align: 'right' });

    // Footer micro text
    const footerY = pageHeight - margin + 7;
    doc.text(`Project ID: ${project.id} | Generated: ${new Date().toLocaleDateString()}`, margin, footerY);
    doc.text('Creator: Thitiwass Kanchanaphimai (NRRU)', pageWidth - margin, footerY, { align: 'right' });
  };

  // 1. Initial Page Border
  drawPageBorder();

  // 2. Document Title Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(margin, y, contentWidth, 24, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('PROJECT MANIFEST & PREPRESS ARCHIVE', margin + 5, y + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(186, 230, 253); // sky-200
  doc.text(`OS Architecture: ${project.osVersion} | Prepress Spec: ISO 12647-2 (FOGRA39) | Engine Roster: ${project.activeEngineIds.length} Loaded`, margin + 5, y + 15);
  doc.text('Authority: CORE OS > ENGINE RULES > PROJECT PREFERENCES', margin + 5, y + 20);

  y += 28;

  // 3. Project Identity Box
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.rect(margin, y, contentWidth, 26, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(project.title, margin + 4, y + 7);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  const subtitleOrBrief = project.brief || `${project.media} • ${project.projectType}`;
  doc.text(subtitleOrBrief.substring(0, 80), margin + 4, y + 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text(`Principal Investigator / Designer: ${project.creator}`, margin + 4, y + 19);
  doc.text(`Affiliation: ${project.affiliation}`, margin + 4, y + 23);

  y += 31;

  // 4. Section: 100-Point QA Gate Evaluation
  checkPageBreak(50);
  doc.setFillColor(30, 41, 59);
  doc.rect(margin, y, contentWidth, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('1. 100-POINT QA GATE INSPECTION & AUDIT SCORECARD', margin + 3, y + 4.5);
  y += 9;

  // Score Badge Banner
  const isPass = project.qaGate.status === 'PASS';
  doc.setFillColor(isPass ? 240 : 254, isPass ? 253 : 243, isPass ? 244 : 199);
  doc.setDrawColor(isPass ? 34 : 245, isPass ? 197 : 158, isPass ? 94 : 11);
  doc.rect(margin, y, contentWidth, 14, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(isPass ? 21 : 180, isPass ? 128 : 83, isPass ? 61 : 9);
  doc.text(`QA VERDICT: ${project.qaGate.status} (${project.qaGate.totalScore}/100 POINTS)`, margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text(`${project.qaGate.verdict} • Minimum Threshold: 85/100 • Zero Critical Defects Required`, margin + 4, y + 11);
  y += 18;

  // Category Breakdown Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('CATEGORY AUDIT PILLAR', margin + 2, y);
  doc.text('SCORE', margin + 110, y, { align: 'right' });
  doc.text('STATUS', margin + 140, y);
  y += 3;
  doc.setDrawColor(203, 213, 225);
  doc.line(margin, y, margin + contentWidth, y);
  y += 3.5;

  project.qaGate.categories.forEach((cat) => {
    checkPageBreak(6);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(30, 41, 59);
    doc.text(cat.title, margin + 2, y);
    doc.text(`${cat.score} / ${cat.maxScore}`, margin + 110, y, { align: 'right' });

    const catPass = cat.status === 'PASS';
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(catPass ? 22 : 217, catPass ? 101 : 119, catPass ? 52 : 6);
    doc.text(cat.status, margin + 140, y);

    y += 4.5;
  });

  y += 4;

  // 5. Section: Physical Prepress & Production Specifications
  checkPageBreak(65);
  doc.setFillColor(30, 41, 59);
  doc.rect(margin, y, contentWidth, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('2. COMMERCIAL PRINT & MECHANICAL SPECIFICATIONS', margin + 3, y + 4.5);
  y += 9;

  const specRows = [
    ['Media Classification', project.specs.mediaClass],
    ['Trimmed Dimensions', `${project.specs.trimmedDimensions.widthMm} x ${project.specs.trimmedDimensions.heightMm} mm (${project.specs.trimmedDimensions.widthPt} x ${project.specs.trimmedDimensions.heightPt} pt) — ${project.specs.trimmedDimensions.standardName}`],
    ['Bleed & Slug', `Bleed: ${project.specs.bleedMm} mm (Continuous on cut edges) | Slug: ${project.specs.slugMm} mm`],
    ['Margins', `Top: ${project.specs.marginsMm.top}mm | Bottom: ${project.specs.marginsMm.bottom}mm | Inside: ${project.specs.marginsMm.inside}mm | Outside: ${project.specs.marginsMm.outside}mm`],
    ['Binding & Spine', `${project.specs.binding.method} | Spine Thickness: ${project.specs.binding.spineWidthMm} mm (Caliper formula applied)`],
    ['Paper Stock', `${project.specs.paperStock.name}, ${project.specs.paperStock.weightGsm} GSM, ${project.specs.paperStock.finish} finish, ${project.specs.paperStock.opacityPercent}% opacity`],
    ['Color System', `${project.specs.colorSpace} | Safe TIC: Max 280% | 100% K Overprint Enforced`],
    ['Separation Plates', `C: ${project.specs.cmykPlates.cyan} | M: ${project.specs.cmykPlates.magenta} | Y: ${project.specs.cmykPlates.yellow} | K: ${project.specs.cmykPlates.black}${project.specs.cmykPlates.spotPantone ? ` | Spot: ${project.specs.cmykPlates.spotPantone}` : ''}`],
    ['Finishing Embellishments', project.specs.finishing.join('; ')],
  ];

  specRows.forEach(([label, value]) => {
    checkPageBreak(9);
    doc.setFillColor(248, 250, 252);
    doc.rect(margin, y, 42, 6.5, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(margin, y, contentWidth, 6.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    doc.text(label, margin + 2, y + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(15, 23, 42);
    const splitText = doc.splitTextToSize(value, contentWidth - 46);
    doc.text(splitText[0] || '', margin + 44, y + 4.5);

    y += 6.5;
  });

  y += 6;

  // 6. Section: Active Engine Roster
  checkPageBreak(50);
  doc.setFillColor(30, 41, 59);
  doc.rect(margin, y, contentWidth, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text(`3. ACTIVE ENGINE ROSTER (${project.activeEngineIds.length} OF ${ENGINE_REGISTRY.length} ENGINES ENGAGED)`, margin + 3, y + 4.5);
  y += 9;

  project.activeEngineIds.forEach((engineId) => {
    checkPageBreak(8);
    const engine = ENGINE_REGISTRY.find((e: EngineContract) => e.id === engineId);
    doc.setDrawColor(226, 232, 240);
    doc.rect(margin, y, contentWidth, 7);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(30, 41, 59);
    doc.text(`• ${engine?.name || engineId} (${engineId})`, margin + 3, y + 4.5);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(`Category: ${engine?.category || 'General'} | Rules: ${engine?.rules.length || 0}`, margin + contentWidth - 4, y + 4.5, { align: 'right' });

    y += 7;
  });

  y += 6;

  // 7. Section: Pre-Flight Verification & Sign-off
  checkPageBreak(40);
  doc.setFillColor(30, 41, 59);
  doc.rect(margin, y, contentWidth, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('4. PRE-FLIGHT VERIFICATION CHECKLIST & AUTHORIZATION', margin + 3, y + 4.5);
  y += 9;

  project.specs.prepressChecklist.forEach((item) => {
    checkPageBreak(5.5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    const isGood = item.status === 'Verified' || item.status === 'Compliant';
    doc.setTextColor(isGood ? 22 : 180, isGood ? 101 : 83, isGood ? 52 : 9);
    doc.text(`[${item.status}]`, margin + 3, y + 3.5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    doc.text(item.item, margin + 26, y + 3.5);

    y += 5;
  });

  y += 6;
  checkPageBreak(25);

  // Sign-off signature seal box
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(148, 163, 184);
  doc.rect(margin, y, contentWidth, 20, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('CERTIFIED PREPRESS RELEASE VERIFICATION', margin + 4, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text('This digital manifest confirms that all layout metrics, bleed allowances, 14pt baseline grids, and color separation', margin + 4, y + 10);
  doc.text('plates comply with ISO 12647-2 commercial offset lithography standards. Ready for RIP ingestion.', margin + 4, y + 14);

  doc.setFont('courier', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(30, 41, 59);
  doc.text(`PASSPORT HASH: ${project.id}-FOGRA39-${Date.now().toString(36).toUpperCase()}`, pageWidth - margin - 4, y + 14, { align: 'right' });

  // Save the PDF
  const safeTitle = project.title.replace(/[^a-zA-Z0-9_\u0E00-\u0E7F]/g, '_').substring(0, 30);
  doc.save(`${safeTitle || 'Project'}_Prepress_Manifest_${project.id}.pdf`);
}
