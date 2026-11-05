/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PrintProductionSpecs } from '../types/os';

export interface ProjectTemplate {
  id: string;
  name: string;
  formatType: 'magazine' | 'flyer' | 'newsletter' | 'book' | 'poster' | 'journal';
  category: 'Editorial & Magazines' | 'Commercial & Marketing' | 'Digital & Screen' | 'Academic & Publishing';
  badge: string;
  tagline: string;
  description: string;
  targetMedia: string;
  recommendedEngines: string[];
  specs: PrintProductionSpecs;
  palette: {
    name: string;
    hex: string;
    cmyk: string;
    role: string;
  }[];
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
  strategyConcept: string;
  visualLanguage: string;
  defaultBrief: string;
  defaultCommand: string;
  meta: {
    aspectRatio: string;
    columns: number;
    dimensionsSummary: string;
    paperType: string;
    idealFor: string;
  };
}

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  // 1. Magazine Spread
  {
    id: 'template-magazine-spread',
    name: 'Haute Editorial & Culture Magazine Spread',
    formatType: 'magazine',
    category: 'Editorial & Magazines',
    badge: 'A4 Double Spread (420 × 297 mm)',
    tagline: 'Asymmetric 8-column layout with hero editorial pull-quote, folio bars, and drop caps',
    description:
      'Designed for lifestyle, design, and architecture publications. Incorporates classical Van de Graaf margin canons, dual-page visual tension, pull quotes, and baseline-aligned 3-column editorial text.',
    targetMedia: 'Double-Page Feature Spread (ISO A4 × 2 Facing Pages)',
    recommendedEngines: [
      'ENG_EDITORIAL_CORE',
      'ENG_MAGAZINE',
      'ENG_TYPOGRAPHY',
      'ENG_GRID',
      'ENG_IMAGE',
      'ENG_COLOR_SEPARATION',
      'ENG_PRINT',
      'ENG_PREPRESS',
      'ENG_FINISHING',
      'ENG_DESIGN_CRITIC',
    ],
    specs: {
      mediaClass: 'Double-Page Editorial Spread (Saddle Stitch / Perfect Bound)',
      trimmedDimensions: {
        widthMm: 420,
        heightMm: 297,
        widthPt: 1190.5,
        heightPt: 841.8,
        standardName: 'ISO A3 Flat (2 × Facing A4: 210 × 297 mm)',
      },
      bleedMm: 3.0,
      slugMm: 6.0,
      marginsMm: {
        top: 22,
        bottom: 25,
        inside: 28, // accommodates center gutter
        outside: 20,
      },
      grid: {
        columns: 8,
        gutterMm: 5.0,
        rows: 6,
        baselineGridPt: 14.0,
        system: '8-Column Asymmetric Editorial Grid with Center Fold Separation',
      },
      colorSpace: 'CMYK + Spot Pantone',
      cmykPlates: {
        cyan: 'Plate Active (Coated FOGRA39)',
        magenta: 'Plate Active (Coated FOGRA39)',
        yellow: 'Plate Active (Coated FOGRA39)',
        black: 'Plate Active (100% K Overprint Enforced)',
        spotPantone: 'Pantone 872 C (Rich Metallic Gold)',
      },
      paperStock: {
        name: 'Munken Lynx Pure Tactile Uncoated',
        weightGsm: 130,
        finish: 'Uncoated Tactile',
        bulkCaliber: '1.13 mm / 1000 sheets',
        opacityPercent: 96,
      },
      binding: {
        method: 'Perfect Binding',
        spineWidthMm: 8.5,
        creasing: 'Hinge creasing at 6mm from spine clamp',
      },
      finishing: ['Soft-Touch Matte Lamination', 'Spot 22K Metallic Gold Rule Lines'],
      prepressChecklist: [
        { item: 'Center Gutter Creep Allowance (min 15mm clearance from fold)', status: 'Verified' },
        { item: 'Baseline Grid Lock (14pt aligned across facing spreads)', status: 'Compliant' },
        { item: '3mm Continuous Bleed on All Exterior Trim Edges', status: 'Compliant' },
        { item: 'Total Ink Coverage TIC <= 280% on uncoated stock', status: 'Verified' },
      ],
    },
    palette: [
      { name: 'Tuscan Terracotta', hex: '#c85a32', cmyk: 'C:15 M:75 Y:85 K:10', role: 'Editorial Headline & Drop Caps' },
      { name: 'Tactile Munken Cream', hex: '#faf8f3', cmyk: 'C:2 M:2 Y:6 K:0', role: 'Paper Substrate & Spreads' },
      { name: 'Deep Editorial Slate', hex: '#18202c', cmyk: 'C:70 M:50 Y:40 K:80', role: 'Body Typography & Grid Anchors' },
      { name: 'Tuscan Gold Accent', hex: '#d4a359', cmyk: 'Spot Pantone 872 C', role: 'Folio Lines & Pull Quote Accents' },
      { name: 'Pure Press Black', hex: '#0a0d12', cmyk: 'C:60 M:40 Y:30 K:100', role: 'Rich Black Solid' },
    ],
    typography: {
      headlineFont: 'Newsreader',
      bodyFont: 'Plus Jakarta Sans',
      thaiFont: 'IBM Plex Sans Thai',
      scaleRatio: 1.414,
      headlinePt: 42,
      bodyPt: 9.5,
      leadingPt: 14,
      thaiLeadingCompensationPt: 17,
      sampleHeadline: 'สุนทรียศาสตร์แห่งการจัดรูปเล่มและสถาปัตยกรรมการพิมพ์',
      sampleSubhead: 'The Architecture of the Modern Feature Spread: Typography, Asymmetry, and White Space',
      sampleBody:
        'Editorial spreads exist as temporal choreographies between reader cadence and typographic volume. When columns breathe with asymmetric negative space, reading transforms from a passive scan into an immersive aesthetic dialogue.',
      sampleThaiBody:
        'การจัดหน้าวารสารร่วมสมัยที่ผสานความประณีตของตัวพิมพ์สากลเข้ากับอัตลักษณ์ไทย การกำหนดจังหวะช่องไฟและเส้นโครงร่างแบบโมดูลาร์ 8 คอลัมน์สร้างความสมดุลระหว่างรูปภาพและเนื้อหาได้อย่างทรงพลัง',
    },
    strategyConcept:
      'Editorial Narrative Asymmetry: Pairing monumental headline scale with generous negative margins and tactile uncoated paper.',
    visualLanguage:
      'Tuscan Terracotta (#c85a32) and warm Munken ivory paper (#faf8f3) framed by deep charcoal slate body typography.',
    defaultBrief: 'Create a 2-page haute culture magazine feature spread on contemporary Thai typography and architecture.',
    defaultCommand: '/design /magazine Haute culture editorial spread on contemporary architecture and typography',
    meta: {
      aspectRatio: '16:9 Spread',
      columns: 8,
      dimensionsSummary: '420 × 297 mm (Double A4)',
      paperType: '130 GSM Munken Lynx',
      idealFor: 'Magazines, Cultural Reviews, Fashion Features, Architecture Portfolios',
    },
  },

  // 2. Print Flyer
  {
    id: 'template-print-flyer',
    name: 'Commercial Promotional Flyer & Handbill',
    formatType: 'flyer',
    category: 'Commercial & Marketing',
    badge: 'ISO A5 (148 × 210 mm)',
    tagline: 'High-conversion 3-column modular grid with event badge, voucher coupon, and QR zone',
    description:
      'Engineered for commercial events, product launches, gallery showcases, and regional campaigns. Optimized for quick scanning, high contrast, spot varnish accents, and ISO A5 machine cutting.',
    targetMedia: 'Promotional Leaflet / Single & Double-Sided Handbill',
    recommendedEngines: [
      'ENG_FLYER',
      'ENG_PRINT',
      'ENG_TYPOGRAPHY',
      'ENG_COLOR_SEPARATION',
      'ENG_GRID',
      'ENG_PREPRESS',
      'ENG_FINISHING',
      'ENG_QA_GATE',
    ],
    specs: {
      mediaClass: 'Single-Sheet Commercial Handbill (Offset / Digital Press)',
      trimmedDimensions: {
        widthMm: 148,
        heightMm: 210,
        widthPt: 419.5,
        heightPt: 595.3,
        standardName: 'ISO A5 Handbill (148 × 210 mm)',
      },
      bleedMm: 3.0,
      slugMm: 5.0,
      marginsMm: {
        top: 15,
        bottom: 15,
        inside: 15,
        outside: 15,
      },
      grid: {
        columns: 3,
        gutterMm: 4.5,
        rows: 5,
        baselineGridPt: 12.0,
        system: '3-Column Punchy Modular Commercial Grid',
      },
      colorSpace: 'CMYK + Spot Pantone',
      cmykPlates: {
        cyan: 'Plate Active (ISO Coated v2)',
        magenta: 'Plate Active (ISO Coated v2)',
        yellow: 'Plate Active (ISO Coated v2)',
        black: 'Plate Active (100% K Overprint)',
        spotPantone: 'Pantone 806 C (Fluorescent Neon Pink)',
      },
      paperStock: {
        name: 'Sappi Magno Gloss Heavyweight Coated',
        weightGsm: 250,
        finish: 'Coated Silk',
        bulkCaliber: '0.85 mm / 1000 sheets',
        opacityPercent: 99,
      },
      binding: {
        method: 'Saddle Stitch', // None for single sheet, but spec requires standard enum
        spineWidthMm: 0,
        creasing: 'Perforation line along bottom 35mm voucher stub',
      },
      finishing: ['Selective Spot UV Gloss on Event Badges', 'Micro-Perforation Tear Stub'],
      prepressChecklist: [
        { item: 'Safe Cutting Zone (min 4mm text inset from trim edge)', status: 'Compliant' },
        { item: 'High-Density Barcode / QR Code Scannability (>300 DPI)', status: 'Verified' },
        { item: 'Spot Neon Pantone Separation Channel Verified', status: 'Compliant' },
        { item: '3mm Bleed with Precision Corner Crop Marks', status: 'Compliant' },
      ],
    },
    palette: [
      { name: 'Electric Cyan Pulse', hex: '#00b4d8', cmyk: 'C:95 M:10 Y:0 K:0', role: 'Event Header & Primary Burst' },
      { name: 'Neon Magenta Highlight', hex: '#f72585', cmyk: 'Spot Pantone 806 C', role: 'CTA Pill & Voucher Stub' },
      { name: 'Deep Midnight Indigo', hex: '#0b092b', cmyk: 'C:90 M:85 Y:40 K:60', role: 'Solid Premium Contrast Field' },
      { name: 'Clean Offset White', hex: '#ffffff', cmyk: 'C:0 M:0 Y:0 K:0', role: 'High-Legibility Inverted Copy' },
      { name: 'Pure Press Black', hex: '#000000', cmyk: 'C:0 M:0 Y:0 K:100', role: 'QR Matrix & Fine Print' },
    ],
    typography: {
      headlineFont: 'Plus Jakarta Sans',
      bodyFont: 'Inter',
      thaiFont: 'IBM Plex Sans Thai',
      scaleRatio: 1.5,
      headlinePt: 44,
      bodyPt: 10,
      leadingPt: 14,
      thaiLeadingCompensationPt: 17,
      sampleHeadline: 'เทศกาลนวัตกรรมเทคโนโลยีและการออกแบบสิ่งพิมพ์ 2026',
      sampleSubhead: 'NRRU Industrial & Print Innovation Summit • Live Keynotes & Workshops',
      sampleBody:
        'Join Southeast Asia’s foremost gathering of graphic engineers, typographic designers, and prepress specialists. Experience hands-on machine calibration, live risograph masterclasses, and keynote panels.',
      sampleThaiBody:
        'พบกับการสาธิตเทคโนโลยีการพิมพ์ขั้นสูง ระบบแยกสี CMYK ดิจิทัล และเวิร์กช็อปการออกแบบเรขศิลป์ โดยคณาจารย์และผู้เชี่ยวชาญ คณะเทคโนโลยีอุตสาหกรรม มหาวิทยาลัยราชภัฏนครราชสีมา',
    },
    strategyConcept:
      'High-Impact Pop Commercialism: Vibrant electric cyan with neon magenta accents against midnight indigo ground.',
    visualLanguage:
      'Electric Cyan (#00b4d8) and Neon Magenta (#f72585) over Midnight Indigo (#0b092b) with bold badge iconography.',
    defaultBrief: 'Design a high-energy commercial event flyer for the NRRU Print Innovation Expo 2026.',
    defaultCommand: '/design /flyer NRRU Print Innovation Summit & Design Expo 2026',
    meta: {
      aspectRatio: '1:1.41 (A5)',
      columns: 3,
      dimensionsSummary: '148 × 210 mm (A5 Portrait)',
      paperType: '250 GSM Coated Gloss',
      idealFor: 'Event Handbills, Product Announcements, Concert Flyers, Retail Promotions',
    },
  },

  // 3. Digital Newsletter
  {
    id: 'template-digital-newsletter',
    name: 'Intelligent Digital Newsletter & Tech Dispatch',
    formatType: 'newsletter',
    category: 'Digital & Screen',
    badge: 'Responsive Digital Digest (600px & 16:9)',
    tagline: 'Multi-column digital layout with issue badges, editorial curator notes, and reading pacing',
    description:
      'Engineered for modern high-cadence digital dispatches, email newsletters, and interactive web/PDF digests. Uses humanist typography, crisp visual anchors, and digital-first responsive column hierarchies.',
    targetMedia: 'Digital Email Newsletter & Screen Digest Spread',
    recommendedEngines: [
      'ENG_EDITORIAL_CORE',
      'ENG_TYPOGRAPHY',
      'ENG_GRID',
      'ENG_COLOR_SEPARATION',
      'ENG_IMAGE',
      'ENG_DESIGN_CRITIC',
      'ENG_QA_GATE',
    ],
    specs: {
      mediaClass: 'Digital Screen Publication & Responsive PDF Digest',
      trimmedDimensions: {
        widthMm: 297,
        heightMm: 210,
        widthPt: 841.8,
        heightPt: 595.3,
        standardName: '16:9 Landscape Screen & 600px Responsive Canvas',
      },
      bleedMm: 0,
      slugMm: 0,
      marginsMm: {
        top: 18,
        bottom: 18,
        inside: 20,
        outside: 20,
      },
      grid: {
        columns: 4,
        gutterMm: 6.0,
        rows: 4,
        baselineGridPt: 16.0,
        system: '4-Column Hybrid Digital Responsive Grid',
      },
      colorSpace: 'CMYK', // Digital/Display compatible
      cmykPlates: {
        cyan: 'Digital RGB Emulation (sRGB IEC61966-2.1)',
        magenta: 'Digital RGB Emulation (sRGB IEC61966-2.1)',
        yellow: 'Digital RGB Emulation (sRGB IEC61966-2.1)',
        black: 'Display Neutral Dark (#0a0e17)',
      },
      paperStock: {
        name: 'Screen Substrate / Calibrated Display White',
        weightGsm: 0,
        finish: 'Coated Silk',
        bulkCaliber: 'Display Pixel Grid (Retina 2x)',
        opacityPercent: 100,
      },
      binding: {
        method: 'Wire-O', // Standard enum
        spineWidthMm: 0,
        creasing: 'None (Digital Flow)',
      },
      finishing: ['High-DPI Retina Optimization', 'Dark Mode Semantic Contrast Validated'],
      prepressChecklist: [
        { item: 'Digital Color Contrast WCAG AAA Compliant (>= 7:1)', status: 'Compliant' },
        { item: '600px Max Desktop Reading Measure (65-75 ch per line)', status: 'Verified' },
        { item: 'Cross-Device Typography Fallback Font Stack', status: 'Compliant' },
        { item: 'Zero Bleed Screen Bounds Verified', status: 'Verified' },
      ],
    },
    palette: [
      { name: 'Emerald Cyber Pulse', hex: '#10b981', cmyk: 'C:75 M:0 Y:65 K:0', role: 'Key Stat & Dispatch Accent' },
      { name: 'Deep Space Obsidian', hex: '#0a0e17', cmyk: 'C:70 M:60 Y:50 K:90', role: 'Primary Digital Ground' },
      { name: 'Crisp Slate White', hex: '#f8fafc', cmyk: 'C:1 M:1 Y:0 K:0', role: 'Body Copy & Header Text' },
      { name: 'Electric Indigo Pill', hex: '#6366f1', cmyk: 'C:70 M:60 Y:0 K:0', role: 'Issue Badge & Category Tag' },
      { name: 'Dividing Border Slate', hex: '#1e293b', cmyk: 'C:40 M:30 Y:20 K:70', role: 'Card Borders & Rule Separators' },
    ],
    typography: {
      headlineFont: 'Plus Jakarta Sans',
      bodyFont: 'Inter',
      thaiFont: 'IBM Plex Sans Thai',
      scaleRatio: 1.25,
      headlinePt: 36,
      bodyPt: 11,
      leadingPt: 16,
      thaiLeadingCompensationPt: 19,
      sampleHeadline: 'จดหมายข่าวนวัตกรรมและสถาปัตยกรรมปัญญาประดิษฐ์',
      sampleSubhead: 'The Editorial Intelligence Dispatch: Weekly Synthesis of Print AI & Regional Innovation',
      sampleBody:
        'Issue #42 investigates the intersection of algorithmic grid synthesis and traditional craft. How regional universities are employing autonomous pre-flight pipelines to preserve native typographic heritage while achieving ISO certified prepress precision.',
      sampleThaiBody:
        'สรุปความก้าวหน้าประจำสัปดาห์: เทคโนโลยีระบบปฏิบัติการการออกแบบสิ่งพิมพ์อัตโนมัติ การผสานอัลกอริทึมควบคุมวรรณยุกต์ภาษาไทย และการพัฒนางานวิจัยเชิงอุตสาหกรรมในภาคตะวันออกเฉียงเหนือ',
    },
    strategyConcept:
      'Digital Humanism: High-contrast dark canvas (#0a0e17) accented by vibrant emerald (#10b981) and crisp readable white typography.',
    visualLanguage:
      'Clean cards, pill tags, structured reading containers, and responsive columns designed for effortless scanning.',
    defaultBrief: 'Generate a digital newsletter dispatch covering regional AI and print engineering advancements.',
    defaultCommand: '/design /newsletter The Editorial Intelligence Dispatch Issue 42',
    meta: {
      aspectRatio: '16:9 Screen',
      columns: 4,
      dimensionsSummary: '297 × 210 mm (Display Canvas)',
      paperType: 'Digital Screen / Retina',
      idealFor: 'Email Newsletters, Online Dispatches, SaaS Product Updates, Weekly Digests',
    },
  },

  // 4. Academic Book Cover
  {
    id: 'template-academic-book',
    name: 'Academic Hardcover Monograph with Dust Jacket',
    formatType: 'book',
    category: 'Academic & Publishing',
    badge: 'A5 Hardcover + Spine + Flaps',
    tagline: 'Caliper-based spine formula, French flaps, Van de Graaf margins, and metallic foil stamping',
    description:
      'Tailored for university presses, scholarly monographs, and archival textbooks. Includes automatic spine thickness calculation based on paper weight and page count, with gold foil plate separation.',
    targetMedia: 'Book Jacket & Hardcover Flat Mechanical Spread',
    recommendedEngines: [
      'ENG_BOOK',
      'ENG_EDITORIAL_CORE',
      'ENG_TYPOGRAPHY',
      'ENG_GRID',
      'ENG_ACADEMIC',
      'ENG_THAI_TYPE',
      'ENG_PRINT',
      'ENG_PREPRESS',
      'ENG_PAPER',
      'ENG_FINISHING',
    ],
    specs: {
      mediaClass: 'Academic Hardcover Book with Dust Jacket',
      trimmedDimensions: {
        widthMm: 148,
        heightMm: 210,
        widthPt: 419.5,
        heightPt: 595.3,
        standardName: 'ISO A5 (Mechanical Spread: 326 × 210 mm with 20mm spine)',
      },
      bleedMm: 3.0,
      slugMm: 6.0,
      marginsMm: {
        top: 20,
        bottom: 24,
        inside: 25,
        outside: 18,
      },
      grid: {
        columns: 6,
        gutterMm: 4.0,
        rows: 6,
        baselineGridPt: 14.0,
        system: 'Van de Graaf Classical Canon with 20mm Spine Column',
      },
      colorSpace: 'CMYK + Spot Pantone',
      cmykPlates: {
        cyan: 'Plate Active (FOGRA39)',
        magenta: 'Plate Active (FOGRA39)',
        yellow: 'Plate Active (FOGRA39)',
        black: 'Plate Active (Rich Black Foundation)',
        spotPantone: 'Pantone 871 C (22K Metallic Gold Foil)',
      },
      paperStock: {
        name: 'Munken Pure Cream Tactile Book Paper',
        weightGsm: 120,
        finish: 'Japanese Ivory Book',
        bulkCaliber: '1.2 mm / 1000 sheets',
        opacityPercent: 98,
      },
      binding: {
        method: 'Smyth Sewn Hardcover',
        spineWidthMm: 20.0,
        creasing: 'Hinge joint creases at 8mm from spine',
      },
      finishing: ['Spot 22K Metallic Gold Foil', 'Blind Debossing on Institutional Crest'],
      prepressChecklist: [
        { item: 'Spine Caliper Formula Verified ((240/2) * (1.2 * 120 / 1000) = 17.3mm + 2.7mm boards)', status: 'Compliant' },
        { item: 'Inner Gutter Creep Absorbed by Smyth Sewn Margin', status: 'Compliant' },
        { item: 'ISBN Barcode Plate 100% K Crisp Vector Overprint', status: 'Verified' },
      ],
    },
    palette: [
      { name: 'NRRU Deep Academic Blue', hex: '#0f2742', cmyk: 'C:100 M:82 Y:38 K:45', role: 'Primary Cover Field' },
      { name: 'Tactile Munken Ivory', hex: '#f6f3eb', cmyk: 'C:2 M:3 Y:8 K:0', role: 'Substrate & Paper Simulation' },
      { name: 'Metallic Warm Gold Foil', hex: '#c5a059', cmyk: 'Spot Pantone 871 C', role: 'Institutional Crest & Spine Rules' },
      { name: 'Deep Carbon Black', hex: '#14171a', cmyk: 'C:60 M:40 Y:40 K:100', role: 'Rich Black Solid' },
      { name: 'Pure Press Black', hex: '#000000', cmyk: 'C:0 M:0 Y:0 K:100', role: 'Micro-Typography Text Body' },
    ],
    typography: {
      headlineFont: 'Newsreader',
      bodyFont: 'Plus Jakarta Sans',
      thaiFont: 'IBM Plex Sans Thai',
      scaleRatio: 1.333,
      headlinePt: 34,
      bodyPt: 10,
      leadingPt: 15,
      thaiLeadingCompensationPt: 18,
      sampleHeadline: 'นวัตกรรมเทคโนโลยีอุตสาหกรรมเพื่อการพัฒนาเชิงพื้นที่',
      sampleSubhead: 'Contemporary Industrial Technology Innovations for Isan Development',
      sampleBody:
        'A comprehensive academic monograph investigating additive manufacturing, sustainable material engineering, and intelligent manufacturing frameworks across regional Thai industry.',
      sampleThaiBody:
        'งานวิจัยเชิงวิชาการเพื่อการยกระดับศักยภาพอุตสาหกรรมท้องถิ่น โดยคณะเทคโนโลยีอุตสาหกรรม มหาวิทยาลัยราชภัฏนครราชสีมา บูรณาการหลักการวิศวกรรมการพิมพ์และสถาปัตยกรรมการออกแบบร่วมสมัย',
    },
    strategyConcept:
      'Academic Rigor Meets Isan Industrial Craft: marrying Swiss typographic structuralism with warm tactile paper and precise Thai bilingual micro-typography.',
    visualLanguage:
      'Deep Prussian Blue (#0f2742) with warm Munken ivory paper substrate and subtle 22K gold metallic accent lines.',
    defaultBrief: 'Design a full academic hardcover book cover with spine calculation and gold foil stamping.',
    defaultCommand: '/design /book Academic book cover for NRRU Industrial Technology',
    meta: {
      aspectRatio: '1.55:1 Spread',
      columns: 6,
      dimensionsSummary: '326 × 210 mm (Flat Spread with Spine)',
      paperType: '120 GSM Munken Pure',
      idealFor: 'Academic Press, Scholarly Monographs, Archival Textbooks, Hardcover Anthologies',
    },
  },

  // 5. Exhibition Poster
  {
    id: 'template-exhibition-poster',
    name: 'International Typography & Biennial Poster',
    formatType: 'poster',
    category: 'Commercial & Marketing',
    badge: 'ISO A1 (594 × 841 mm)',
    tagline: 'Swiss International Typographic Style with diagonal structural tension and high-impact duotone',
    description:
      'Formulated for large-format gallery exhibitions, international design biennials, and civic cultural announcements. Employs asymmetric grids, extreme scale contrasts, and ISO 12647-2 proofing.',
    targetMedia: 'Large-Format Exhibition Poster (A1)',
    recommendedEngines: [
      'ENG_POSTER',
      'ENG_TYPOGRAPHY',
      'ENG_GRID',
      'ENG_COLOR_SEPARATION',
      'ENG_PRINT',
      'ENG_PREPRESS',
      'ENG_FINISHING',
      'ENG_DESIGN_CRITIC',
    ],
    specs: {
      mediaClass: 'Large-Format Screen & Offset Litho Poster',
      trimmedDimensions: {
        widthMm: 594,
        heightMm: 841,
        widthPt: 1683.8,
        heightPt: 2383.9,
        standardName: 'ISO A1 Poster (594 × 841 mm)',
      },
      bleedMm: 5.0,
      slugMm: 10.0,
      marginsMm: {
        top: 30,
        bottom: 30,
        inside: 25,
        outside: 25,
      },
      grid: {
        columns: 6,
        gutterMm: 8.0,
        rows: 8,
        baselineGridPt: 18.0,
        system: '6-Column Swiss International Asymmetric Poster Grid',
      },
      colorSpace: 'CMYK + Spot Pantone',
      cmykPlates: {
        cyan: 'Plate Active (Large Format Offset)',
        magenta: 'Plate Active (Large Format Offset)',
        yellow: 'Plate Active (Large Format Offset)',
        black: 'Plate Active (100% K Overprint)',
        spotPantone: 'Pantone 032 C (Swiss Signal Red)',
      },
      paperStock: {
        name: 'Fedrigoni Arena White Smooth Litho Stock',
        weightGsm: 200,
        finish: 'Coated Silk',
        bulkCaliber: '1.0 mm / 1000 sheets',
        opacityPercent: 99,
      },
      binding: {
        method: 'Saddle Stitch',
        spineWidthMm: 0,
        creasing: 'None (Sheet poster)',
      },
      finishing: ['Silk Matte Dispersion Varnish', 'Precision Guillotine Trim'],
      prepressChecklist: [
        { item: '5mm Continuous Bleed for Large Format Guillotine', status: 'Compliant' },
        { item: 'Duotone Channel Balance Calibrated for Offset Press', status: 'Compliant' },
        { item: 'Vector Headline Integrity at Extreme Magnification', status: 'Verified' },
      ],
    },
    palette: [
      { name: 'Swiss Signal Red', hex: '#e63946', cmyk: 'C:0 M:95 Y:80 K:0', role: 'Monumental Display Title' },
      { name: 'Crisp Alpine Paper', hex: '#f8f9fa', cmyk: 'C:1 M:1 Y:2 K:0', role: 'High-Purity Paper Substrate' },
      { name: 'Deep Foundry Ink', hex: '#1d3557', cmyk: 'C:90 M:75 Y:40 K:40', role: 'Secondary Grid & Structural Columns' },
      { name: 'Pure Press Black', hex: '#000000', cmyk: 'C:0 M:0 Y:0 K:100', role: 'Fine Micro-Text & Program Schedule' },
    ],
    typography: {
      headlineFont: 'Plus Jakarta Sans',
      bodyFont: 'Inter',
      thaiFont: 'IBM Plex Sans Thai',
      scaleRatio: 1.618,
      headlinePt: 64,
      bodyPt: 12,
      leadingPt: 18,
      thaiLeadingCompensationPt: 22,
      sampleHeadline: 'มหกรรมศิลปะการออกแบบตัวพิมพ์และสิ่งพิมพ์นานาชาติ 2026',
      sampleSubhead: 'International Typography & Print Design Biennial 2026',
      sampleBody:
        'A global convergence of typographic experimentalists, algorithm designers, and master printers investigating sustainable pigments, algorithmic modular grids, and bilingual script dynamics.',
      sampleThaiBody:
        'นิทรรศการระดับนานาชาติที่จัดแสดงผลงานการออกแบบเรขศิลป์ ตัวพิมพ์ไทยร่วมสมัย และนวัตกรรมเทคโนโลยีสิ่งพิมพ์ ณ มหาวิทยาลัยราชภัฏนครราชสีมา',
    },
    strategyConcept:
      'Swiss International Typographic Clarity: Monumental signal red scale counterbalanced with structured, razor-sharp black metadata.',
    visualLanguage:
      'Swiss Signal Red (#e63946) and Crisp Alpine Paper (#f8f9fa) under strict 6-column modular rhythm.',
    defaultBrief: 'Create a large-format exhibition poster (A1 size) celebrating Thai typographic heritage.',
    defaultCommand: '/design /poster Thai Contemporary Typography Biennial size=A1',
    meta: {
      aspectRatio: '1:1.41 (A1)',
      columns: 6,
      dimensionsSummary: '594 × 841 mm (A1 Large Format)',
      paperType: '200 GSM Fedrigoni Arena',
      idealFor: 'Exhibition Posters, Gallery Biennials, Cultural Summits, Architectural Manifestos',
    },
  },

  // 6. Research Journal
  {
    id: 'template-research-journal',
    name: 'Peer-Reviewed Engineering & Technology Journal Spread',
    formatType: 'journal',
    category: 'Academic & Publishing',
    badge: 'ISO A4 (210 × 297 mm)',
    tagline: 'Dual-column body, bilingual abstract box, DOI registry metadata, and mathematical equations',
    description:
      'Engineered for academic journals, IEEE/Scopus publications, and university engineering reports. Implements dual-column typography, strict 14pt baseline lock, and bilingual Thai-English heading hierarchy.',
    targetMedia: 'Academic Journal Spread (A4)',
    recommendedEngines: [
      'ENG_JOURNAL',
      'ENG_EDITORIAL_CORE',
      'ENG_GRID',
      'ENG_TYPOGRAPHY',
      'ENG_ACADEMIC',
      'ENG_THAI_TYPE',
      'ENG_PRINT',
      'ENG_PREPRESS',
      'ENG_QA_GATE',
    ],
    specs: {
      mediaClass: 'Academic Journal Publication (Saddle Stitch / Perfect Binding)',
      trimmedDimensions: {
        widthMm: 210,
        heightMm: 297,
        widthPt: 595.3,
        heightPt: 841.8,
        standardName: 'ISO A4 Portrait (210 × 297 mm)',
      },
      bleedMm: 3.0,
      slugMm: 5.0,
      marginsMm: {
        top: 20,
        bottom: 22,
        inside: 24,
        outside: 18,
      },
      grid: {
        columns: 2,
        gutterMm: 6.0,
        rows: 8,
        baselineGridPt: 14.0,
        system: 'Symmetrical 2-Column Academic Journal Grid',
      },
      colorSpace: 'CMYK',
      cmykPlates: {
        cyan: 'Plate Active (Academic Cyan Plate)',
        magenta: 'Plate Active (Minimal for tints)',
        yellow: 'Plate Active (Substrate tint)',
        black: 'Plate Active (100% K Sharp Equation Overprint)',
      },
      paperStock: {
        name: 'Munken Print White 1.5 Bulk',
        weightGsm: 90,
        finish: 'Uncoated Tactile',
        bulkCaliber: '1.35 mm / 1000 sheets',
        opacityPercent: 94,
      },
      binding: {
        method: 'Perfect Binding',
        spineWidthMm: 6.5,
        creasing: 'Standard spine fold',
      },
      finishing: ['Spot Varnish on Journal Cover Title'],
      prepressChecklist: [
        { item: 'Dual-Column Baseline Alignment (Exact 14pt integer multiple)', status: 'Compliant' },
        { item: 'Bilingual Thai/English Font Metric Compensation (+3pt Thai leading)', status: 'Compliant' },
        { item: 'Vector Formula and Mathematical Glyph Embedding Verified', status: 'Verified' },
      ],
    },
    palette: [
      { name: 'Academic Deep Teal', hex: '#006666', cmyk: 'C:90 M:30 Y:50 K:25', role: 'Journal Header & DOI Bar' },
      { name: 'Archival Cream', hex: '#f6f3eb', cmyk: 'C:2 M:3 Y:8 K:0', role: 'Paper Substrate' },
      { name: 'Deep Carbon Gray', hex: '#1e293b', cmyk: 'C:60 M:40 Y:30 K:85', role: 'Body Typography' },
      { name: 'Tint Teal Tint Box', hex: '#f1f5f5', cmyk: 'C:5 M:1 Y:3 K:0', role: 'Abstract Callout Box' },
      { name: 'Pure Press Black', hex: '#000000', cmyk: 'C:0 M:0 Y:0 K:100', role: 'Mathematical Equations & References' },
    ],
    typography: {
      headlineFont: 'Newsreader',
      bodyFont: 'Plus Jakarta Sans',
      thaiFont: 'IBM Plex Sans Thai',
      scaleRatio: 1.333,
      headlinePt: 28,
      bodyPt: 10,
      leadingPt: 14,
      thaiLeadingCompensationPt: 17,
      sampleHeadline: 'วารสารเทคโนโลยีอุตสาหกรรมและสถาปัตยกรรมสิ่งพิมพ์อัจฉริยะ',
      sampleSubhead: 'NRRU Journal of Industrial Technology & Editorial Intelligence',
      sampleBody:
        'This peer-reviewed paper formalizes the multi-engine operating system architecture for automated publication production. By treating typography, layout, and prepress rules as immutable engine contracts, production cycles achieve zero-defect certification.',
      sampleThaiBody:
        'บทความวิจัยนี้นำเสนอระเบียบวิธีวิจัยและกรอบแนวคิดการผสานปัญญาประดิษฐ์เชิงระบบเข้ากับกระบวนการเตรียมพิมพ์มาตรฐานอุตสาหกรรม โดยเน้นการจัดรูปเล่มสองคอลัมน์และการควบคุมระบบสระ-วรรณยุกต์ภาษาไทย',
    },
    strategyConcept:
      'Scholarly Serenity & Mathematical Structure: Deep archival teal and 2-column precision anchored by authoritative serif typography.',
    visualLanguage:
      'Academic Deep Teal (#006666) paired with Archival Cream (#f6f3eb) and structured 2-column layout.',
    defaultBrief: 'Format an academic journal article spread with dual-column body and bilingual abstract.',
    defaultCommand: '/design /journal NRRU Journal of Industrial Technology',
    meta: {
      aspectRatio: '1:1.41 (A4)',
      columns: 2,
      dimensionsSummary: '210 × 297 mm (A4 Portrait)',
      paperType: '90 GSM Munken Print',
      idealFor: 'Scholarly Journals, Engineering Papers, University Research Proceedings, Whitepapers',
    },
  },
];
