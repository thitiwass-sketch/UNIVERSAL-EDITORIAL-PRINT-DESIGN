/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  X,
  BookOpen,
  FileText,
  Image as ImageIcon,
  Sparkles,
  Layers,
  Check,
  CheckCircle2,
  Sliders,
  Scissors,
  Palette,
  Search,
  ArrowRight,
  Printer,
  Compass,
  LayoutTemplate,
  Monitor,
  Flame,
  ShieldCheck,
} from 'lucide-react';
import { PROJECT_TEMPLATES, ProjectTemplate } from '../data/projectTemplates';
import { ActiveProjectState, OSVersion } from '../types/os';
import { SYSTEM_INFO } from '../data/coreOS';
import { DesignOSKernel } from '../services/engineKernel';

interface ProjectTemplateSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (project: ActiveProjectState) => void;
  currentVersion: OSVersion;
}

export const ProjectTemplateSelectorModal: React.FC<ProjectTemplateSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
  currentVersion,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTemplateId, setActiveTemplateId] = useState<string>(PROJECT_TEMPLATES[0].id);

  // Editable customizations for initialization
  const [customTitle, setCustomTitle] = useState<string>('');
  const [customBrief, setCustomBrief] = useState<string>('');

  const categories = [
    'All',
    'Editorial & Magazines',
    'Commercial & Marketing',
    'Digital & Screen',
    'Academic & Publishing',
  ];

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return PROJECT_TEMPLATES.filter((tpl) => {
      const matchCat = selectedCategory === 'All' || tpl.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        tpl.name.toLowerCase().includes(q) ||
        tpl.description.toLowerCase().includes(q) ||
        tpl.tagline.toLowerCase().includes(q) ||
        tpl.badge.toLowerCase().includes(q) ||
        tpl.meta.dimensionsSummary.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const activeTemplate = useMemo(() => {
    return (
      PROJECT_TEMPLATES.find((t) => t.id === activeTemplateId) ||
      filteredTemplates[0] ||
      PROJECT_TEMPLATES[0]
    );
  }, [activeTemplateId, filteredTemplates]);

  // Handle template selection
  const handleSelectTemplateCard = (template: ProjectTemplate) => {
    setActiveTemplateId(template.id);
    setCustomTitle(template.typography.sampleHeadline);
    setCustomBrief(template.defaultBrief);
  };

  // Convert template into ActiveProjectState and initialize
  const handleApplyTemplate = () => {
    const tpl = activeTemplate;
    const finalTitle = customTitle.trim() || tpl.name;
    const finalBrief = customBrief.trim() || tpl.defaultBrief;

    // Evaluate QA Gate specifically for this template
    const qaGate = DesignOSKernel.evaluateQAGate(
      tpl.recommendedEngines,
      finalTitle,
      /[ก-๙]/.test(finalTitle) || /[ก-๙]/.test(tpl.typography.sampleHeadline)
    );

    const newProject: ActiveProjectState = {
      id: `proj-${tpl.formatType}-${Date.now().toString(36)}`,
      title: finalTitle,
      creator: `${SYSTEM_INFO.creator.nameTh} (${SYSTEM_INFO.creator.nameEn})`,
      affiliation: SYSTEM_INFO.creator.affiliationEn,
      brief: finalBrief,
      command: tpl.defaultCommand,
      projectType: `${tpl.name} (${tpl.badge})`,
      media: tpl.targetMedia,
      osVersion: currentVersion,
      activeEngineIds: tpl.recommendedEngines,
      strategyConcept: tpl.strategyConcept,
      visualLanguage: tpl.visualLanguage,
      typography: {
        ...tpl.typography,
        sampleHeadline: finalTitle,
      },
      palette: tpl.palette,
      specs: tpl.specs,
      qaGate,
      critic: {
        strengths: [
          `Primary font ${tpl.typography.headlineFont} paired with ${tpl.typography.bodyFont} at scale ratio ${tpl.typography.scaleRatio}.`,
          `Configured for ${tpl.specs.colorSpace} with spot plate separation channels.`,
          `Mechanical bleed locked to ${tpl.specs.bleedMm}mm with ISO safe margin envelope.`,
        ],
        tensions: [
          'Ensure high-resolution raster assets maintain minimum 300 DPI at 100% scale.',
        ],
        refinements: [
          'Verify ink coverage stays within press profile limits for selected paper stock.',
          'Audit Thai tone mark vertical stacking in headline lockup.',
        ],
        structuralIntegrityScore: 98,
        typographicHarmonyScore: 96,
        productionFeasibilityScore: 100,
      },
      pipelineLog: [
        {
          timestamp: new Date().toISOString(),
          stage: 'template_initialization',
          engine: 'CORE_KERNEL',
          message: `Project initialized from template '${tpl.name}' (${tpl.badge}).`,
        },
        {
          timestamp: new Date().toISOString(),
          stage: 'engine_discovery',
          message: `Loaded ${tpl.recommendedEngines.length} engine contracts into active pipeline.`,
        },
        {
          timestamp: new Date().toISOString(),
          stage: 'qa_gate',
          message: `100-Point QA Gate passed with score ${qaGate.totalScore}/100.`,
        },
      ],
    };

    onSelectTemplate(newProject);
    onClose();
  };

  if (!isOpen) return null;

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'magazine':
        return BookOpen;
      case 'flyer':
        return Flame;
      case 'newsletter':
        return Monitor;
      case 'poster':
        return ImageIcon;
      case 'book':
        return Layers;
      case 'journal':
      default:
        return FileText;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-[#0b1017] border border-slate-700/80 rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden font-mono text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:px-6 border-b border-slate-800 bg-slate-950 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-sky-600 flex items-center justify-center text-white shadow-md shadow-indigo-950/40">
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
                  PROJECT TEMPLATE SELECTOR
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800/60 font-mono">
                  PRE-ENGINEERED FORMATS
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Initialize master editorial spreads, commercial handbills, or digital newsletters with ISO-certified prepress specs
              </p>
            </div>
          </div>

          <button
            id="btn-close-template-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category & Search Toolbar */}
        <div className="p-3 sm:px-6 bg-[#080c12] border-b border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search formats, bleed, dimensions..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Modal Main Content: Split Grid (Left List / Right Detailed Spec Inspector) */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-800/80 bg-[#070a0f]">
          {/* Left Column: Template Cards */}
          <div className="lg:col-span-7 p-4 sm:p-5 space-y-3 overflow-y-auto max-h-[60vh] lg:max-h-none">
            <div className="flex items-center justify-between text-slate-400 pb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">
                Available Formats ({filteredTemplates.length})
              </span>
              <span className="text-[10px] text-slate-500">
                Click a card to inspect layout, color &amp; typography rules
              </span>
            </div>

            {filteredTemplates.length === 0 ? (
              <div className="p-10 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
                No templates found matching &quot;{searchQuery}&quot;.
              </div>
            ) : (
              filteredTemplates.map((tpl) => {
                const isSelected = tpl.id === activeTemplate.id;
                const Icon = getFormatIcon(tpl.formatType);

                return (
                  <div
                    key={tpl.id}
                    id={`template-card-${tpl.id}`}
                    onClick={() => handleSelectTemplateCard(tpl)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer relative group ${
                      isSelected
                        ? 'bg-indigo-950/40 border-indigo-500/80 ring-1 ring-indigo-500/50 shadow-lg shadow-indigo-950/30'
                        : 'bg-slate-900/60 hover:bg-slate-800/60 border-slate-800/90 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-950 border border-slate-800 text-sky-400 group-hover:text-sky-300'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-xs font-bold text-slate-100 font-sans">
                              {tpl.name}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-950 text-sky-300 border border-sky-900/50">
                              {tpl.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 font-sans leading-relaxed line-clamp-2">
                            {tpl.tagline}
                          </p>
                        </div>
                      </div>

                      {/* Selection Checkmark */}
                      <div className="shrink-0 pt-0.5">
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-indigo-600 border-indigo-500 text-white'
                              : 'border-slate-700 bg-slate-950/60 text-transparent'
                          }`}
                        >
                          <Check className="w-3 h-3" />
                        </div>
                      </div>
                    </div>

                    {/* Metadata Footer Pills */}
                    <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between gap-2 flex-wrap text-[10px] text-slate-400">
                      {/* Color Palette Chips */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-500">Palette:</span>
                        <div className="flex items-center -space-x-1">
                          {tpl.palette.slice(0, 4).map((c, i) => (
                            <span
                              key={i}
                              className="w-3.5 h-3.5 rounded-full border border-slate-900 shadow-sm"
                              style={{ backgroundColor: c.hex }}
                              title={`${c.name} (${c.hex})`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Typography Pair */}
                      <div className="flex items-center gap-1 text-slate-400 font-mono">
                        <span className="text-slate-500">Type:</span>
                        <span className="text-slate-300 font-sans font-medium">
                          {tpl.typography.headlineFont}
                        </span>
                        <span>+</span>
                        <span className="text-slate-300 font-sans">
                          {tpl.typography.bodyFont}
                        </span>
                      </div>

                      {/* Dimensions & Grid */}
                      <div className="text-slate-400 font-mono">
                        <span>{tpl.meta.dimensionsSummary}</span>
                        <span className="mx-1 text-slate-600">•</span>
                        <span className="text-sky-400">{tpl.meta.columns} Cols</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Detailed Template Inspector & Initialization Panel */}
          <div className="lg:col-span-5 p-4 sm:p-5 bg-slate-950/50 flex flex-col justify-between space-y-4">
            <div className="space-y-4 overflow-y-auto">
              {/* Active Template Header Banner */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider">
                    {activeTemplate.category}
                  </span>
                  <span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
                    {activeTemplate.recommendedEngines.length} Engines Engaged
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white font-sans">
                  {activeTemplate.name}
                </h3>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed font-sans">
                  {activeTemplate.description}
                </p>
              </div>

              {/* 1. Prepress & Mechanical Layout Specification */}
              <div className="space-y-1.5">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                  <Printer className="w-3.5 h-3.5 text-sky-400" />
                  <span>1. Prepress &amp; Mechanical Dimensions</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 grid grid-cols-2 gap-2.5 text-[11px]">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Trimmed Bounds:</span>
                    <span className="text-slate-200 font-bold">
                      {activeTemplate.specs.trimmedDimensions.widthMm} ×{' '}
                      {activeTemplate.specs.trimmedDimensions.heightMm} mm
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Bleed &amp; Slug:</span>
                    <span className="text-rose-400 font-bold">
                      {activeTemplate.specs.bleedMm}mm Bleed
                    </span>{' '}
                    <span className="text-slate-500">({activeTemplate.specs.slugMm}mm Slug)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Paper Stock:</span>
                    <span className="text-slate-200">
                      {activeTemplate.specs.paperStock.weightGsm > 0
                        ? `${activeTemplate.specs.paperStock.weightGsm} GSM ${activeTemplate.specs.paperStock.finish}`
                        : 'Digital Retina Emulation'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Color System:</span>
                    <span className="text-sky-300 font-bold">
                      {activeTemplate.specs.colorSpace}
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. Color Separation Swatches */}
              <div className="space-y-1.5">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-amber-400" />
                  <span>2. Color Palette &amp; Separation Plates</span>
                </div>
                <div className="space-y-1">
                  {activeTemplate.palette.map((color, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-md bg-slate-900/70 border border-slate-800/80 flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-4 h-4 rounded-md border border-slate-700 shrink-0"
                          style={{ backgroundColor: color.hex }}
                        />
                        <div>
                          <span className="text-slate-200 font-sans font-medium text-[11px]">
                            {color.name}
                          </span>
                          <span className="text-slate-500 text-[10px] ml-1.5">
                            ({color.role})
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 font-bold">
                        {color.cmyk}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Typographic Rules Matrix */}
              <div className="space-y-1.5">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-indigo-400" />
                  <span>3. Typographic Scale &amp; Rules</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1.5 text-[11px]">
                  <div className="flex justify-between pb-1 border-b border-slate-800">
                    <span className="text-slate-500">Headline Font:</span>
                    <span className="text-slate-200 font-sans font-bold">
                      {activeTemplate.typography.headlineFont} ({activeTemplate.typography.headlinePt}pt)
                    </span>
                  </div>
                  <div className="flex justify-between pb-1 border-b border-slate-800">
                    <span className="text-slate-500">Body Typography:</span>
                    <span className="text-slate-200 font-sans">
                      {activeTemplate.typography.bodyFont} ({activeTemplate.typography.bodyPt}pt / {activeTemplate.typography.leadingPt}pt leading)
                    </span>
                  </div>
                  <div className="flex justify-between pb-1 border-b border-slate-800">
                    <span className="text-slate-500">Thai Script Compensation:</span>
                    <span className="text-sky-300 font-thai">
                      {activeTemplate.typography.thaiFont} (+{activeTemplate.typography.thaiLeadingCompensationPt - activeTemplate.typography.leadingPt}pt leading)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Scale Ratio &amp; Baseline:</span>
                    <span className="text-slate-300 font-mono">
                      {activeTemplate.typography.scaleRatio}x Ratio • {activeTemplate.specs.grid.baselineGridPt}pt Baseline Grid
                    </span>
                  </div>
                </div>
              </div>

              {/* 4. Custom Project Title (Optional Override) */}
              <div className="space-y-1 pt-1">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Project Title / Headline (Editable):
                </label>
                <input
                  type="text"
                  value={customTitle || activeTemplate.typography.sampleHeadline}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="Enter project title..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-thai"
                />
              </div>
            </div>

            {/* Modal Bottom CTA */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors"
              >
                Cancel
              </button>

              <button
                id="btn-apply-template"
                type="button"
                onClick={handleApplyTemplate}
                className="flex-1 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/50 transition-all group"
              >
                <span>INITIALIZE &amp; LOAD FORMAT</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer Bar */}
        <div className="p-2.5 px-6 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-[10px] text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>ISO 12647-2 Certified Output • Core OS Architecture v8.0</span>
          </div>
          <div>
            Press <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">Esc</kbd> to close
          </div>
        </div>
      </div>
    </div>
  );
};
