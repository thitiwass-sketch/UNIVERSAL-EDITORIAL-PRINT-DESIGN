export interface CorePrinciple {
  id: string;
  name: string;
  enDescription: string;
  thDescription: string;
  severity: 'INVIOLABLE' | 'SYSTEMIC' | 'OPERATIONAL';
}

export const SYSTEM_INFO = {
  name: 'Universal Editorial & Print Design AI OS',
  acronym: 'UEPDO',
  versions: {
    v6: {
      name: 'v6.0',
      label: 'Prompt-Based System',
      description: 'Historical monolithic prompt architecture with linear instruction sets.',
      type: 'Legacy Foundation',
    },
    v7: {
      name: 'v7.0',
      label: 'Modular AI OS',
      description: 'Architectural transition: Stable Core OS, Engine Registry, Dynamic Engine Loading, and mandatory QA Gate.',
      type: 'Modular OS',
      features: ['Core OS Anchor', 'Engine Contract Standard', 'Static Command Routing', 'Mandatory QA Gate'],
    },
    v8: {
      name: 'v8.0',
      label: 'Intelligent Modular AI OS',
      description: 'Intelligence layer added: Automatic Engine Discovery, Dependency Resolution, Cross-Engine Coordination, Conflict-Aware Orchestration, and Adaptive Workflow.',
      type: 'Intelligent OS',
      features: ['Auto Engine Discovery', 'Dependency Resolution Matrix', 'Conflict-Aware Orchestrator', 'Advanced Design Critic', 'Dynamic QA Feedback Loop'],
    },
    v9: {
      name: 'v9.0',
      label: 'Multi-Engine Design Intelligence Platform',
      description: 'Collaborative platform where 4 domain intelligences (Editorial, Visual, Production, Academic/International) exchange structured schemas over a unified design pipeline.',
      type: 'Multi-Engine Intelligence Platform',
      features: ['Domain Intelligences Matrix', 'Bidirectional Engine Dialogue', 'Shared Schema Pipeline', 'Global International Typographic Synthesis', 'Automated Prepress Simulation'],
    },
  },
  creator: {
    nameTh: 'ฐิติวัสส์ กาญจนพิมาย',
    nameEn: 'Thitiwass Kanchanaphimai',
    role: 'Creator & Lead Design Intelligence Architect',
    affiliationTh: 'คณะเทคโนโลยีอุตสาหกรรม มหาวิทยาลัยราชภัฏนครราชสีมา (มรภ.นม.)',
    affiliationEn: 'Faculty of Industrial Technology, Nakhon Ratchasima Rajabhat University (NRRU)',
  },
  goldenRule: 'DO NOT REBUILD THE CORE WHEN YOU CAN EXTEND THE SYSTEM WITH AN ENGINE. CORE SHOULD BE STABLE. ENGINES SHOULD EVOLVE. COMMANDS SHOULD ORCHESTRATE. QA SHOULD GOVERN THE OUTPUT.',
  governanceHierarchy: 'CORE OS > ENGINE RULES > PROJECT PREFERENCES',
};

export const CORE_PRINCIPLES: CorePrinciple[] = [
  {
    id: 'P1_CONTENT_INTEGRITY',
    name: 'Content & Information Integrity',
    enDescription: 'The visual form must never distort, truncate, or falsify editorial truth, academic facts, or information hierarchy.',
    thDescription: 'รูปแบบทางสายตาต้องไม่บิดเบือน ตัดทอน หรือทำให้เนื้อหาทางวิชาการและข้อเท็จจริงผิดเพี้ยน',
    severity: 'INVIOLABLE',
  },
  {
    id: 'P2_TYPOGRAPHY_INTEGRITY',
    name: 'Typography & Orthographic Rigor',
    enDescription: 'Typefaces must preserve legibility, optical proportions, correct tone-mark stacking in Thai, micro-typography, and baseline adherence.',
    thDescription: 'วรรณยุกต์และสระภาษาไทยต้องไม่ลอยหรือทับซ้อน รักษาการจัดวางระดับสายตาและความอ่านง่ายสูงสุด',
    severity: 'INVIOLABLE',
  },
  {
    id: 'P3_VISUAL_HIERARCHY',
    name: 'Mathematical Visual Hierarchy',
    enDescription: 'Step ratios (minimum 1.25) determine sizing contrast. Every visual weight corresponds directly to informational priority.',
    thDescription: 'การเรียงลำดับความสำคัญทางสายตาอย่างเป็นระบบตามอัตราส่วนคณิตศาสตร์',
    severity: 'SYSTEMIC',
  },
  {
    id: 'P4_GRID_STRUCTURALISM',
    name: 'Structural Grid & Spatial Harmony',
    enDescription: 'No layout element floats arbitrary. Margins, columns, gutters, and baseline grids govern spatial rhythm and negative space.',
    thDescription: 'ตารางกริดและเส้นฐานเป็นโครงสร้างนำสายตาและควบคุมจังหวะพื้นที่ว่าง',
    severity: 'SYSTEMIC',
  },
  {
    id: 'P5_PRODUCTION_REALITY',
    name: 'Physical Print & Prepress Feasibility',
    enDescription: 'Designs must respect real physical print constraints: bleed, crop marks, paper grain, ink limit (TIC < 300%), creep, and binding mechanics.',
    thDescription: 'เคารพข้อจำกัดทางการพิมพ์จริง: ตัดตก (Bleed), เส้นเจียน, ปริมาณหมึกรวม, การพับ และการเย็บเล่ม',
    severity: 'INVIOLABLE',
  },
  {
    id: 'P6_ACCESSIBILITY_UNIVERSAL',
    name: 'Accessibility & Dual-Script Harmony',
    enDescription: 'WCAG AA minimum contrast (4.5:1), optical balance between Thai and Latin scripts, and barrier-free editorial readability.',
    thDescription: 'ความเข้าถึงได้ ค่าคอนทราสต์ที่ผ่านเกณฑ์สากล และความกลมกลืนระหว่างอักษรไทย-สากล',
    severity: 'SYSTEMIC',
  },
  {
    id: 'P7_CONFLICT_RESOLUTION',
    name: 'Core Primacy & Conflict Resolution',
    enDescription: 'When an Engine Rule or Project Preference contradicts Core Principles, the Core OS unconditionally overrides.',
    thDescription: 'หากกฎของ Engine ขัดแย้งกับหลักการ Core OS ให้ยึด Core OS เป็นที่สุดโดยไม่มีข้อยกเว้น',
    severity: 'INVIOLABLE',
  },
];

export const QA_100_FRAMEWORK = [
  {
    id: 'contentIntegrity',
    title: 'Content Integrity',
    weight: 10,
    criteria: [
      'Accuracy of titles, subtitles, and author metadata',
      'Logical editorial flow without orphan thoughts',
      'Fact & citation structure preservation',
    ],
  },
  {
    id: 'typography',
    title: 'Typography Integrity',
    weight: 10,
    criteria: [
      'Strict type scale ratio (min 1.25x step)',
      'Baseline grid alignment & leading consistency',
      'Thai Sara/Mai tone mark stacking compliance without clipping',
      'Appropriate body leading (1.5–1.7x)',
    ],
  },
  {
    id: 'visualHierarchy',
    title: 'Visual Hierarchy',
    weight: 10,
    criteria: [
      'Instant readability of primary focal anchor',
      'Clear optical path (H1 -> H2 -> Body -> Captions)',
      'Generous negative space without visual clutter',
    ],
  },
  {
    id: 'gridLayout',
    title: 'Grid & Layout',
    weight: 10,
    criteria: [
      'Disciplined column/modular grid alignment',
      'Mathematical margin relationship (inner <= outer padding rule)',
      'Consistent gutter rhythm throughout spreads',
    ],
  },
  {
    id: 'editorialQuality',
    title: 'Editorial Quality',
    weight: 10,
    criteria: [
      'Professional tone and publication standards',
      'Appropriate captioning, folios, running headers',
      'Line-length constraints (65–75 characters max)',
    ],
  },
  {
    id: 'visualQuality',
    title: 'Visual & Aesthetic Quality',
    weight: 10,
    criteria: [
      'Absence of generic visual clichés (AI Slop)',
      'Sophisticated texture, image tonal balance',
      'Optical balance and intentional aesthetic restraint',
    ],
  },
  {
    id: 'color',
    title: 'Color & Prepress Management',
    weight: 10,
    criteria: [
      'Valid CMYK / Pantone spot separation values',
      'Total Ink Coverage (TIC) under 300%',
      'Rich black formulation (C60 M40 Y40 K100) vs pure K100 text',
    ],
  },
  {
    id: 'academicIdentity',
    title: 'Academic & Brand Identity',
    weight: 10,
    criteria: [
      'Faculty / University standards (NRRU industrial criteria)',
      'Scholarly gravitas and peer-review visual rigor',
      'Proper emblem, ISBN, and accreditation placement',
    ],
  },
  {
    id: 'printProduction',
    title: 'Print Production Feasibility',
    weight: 10,
    criteria: [
      'Standard 3mm minimum bleed allowance',
      'Safe margin zone (min 5mm from trim)',
      'Spine width formula accurate for paper bulk & page count',
      'Finishing suitability (UV/Foil/Emboss register)',
    ],
  },
  {
    id: 'internationalAccessibility',
    title: 'International & Accessibility',
    weight: 10,
    criteria: [
      'WCAG AA contrast (minimum 4.5:1 body text)',
      'Seamless Thai-English typographic harmony',
      'Legible text sizes at actual trim print scale (min 9-10pt body)',
    ],
  },
];
