import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini client lazily
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiClient;
}

// Health check API
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    system: "Universal Editorial & Print Design AI OS",
    versions: ["v7.0", "v8.0", "v9.0"],
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Execute Design OS Command API
app.post("/api/design/execute", async (req, res) => {
  try {
    const {
      command,
      brief,
      projectType,
      targetMedia,
      osVersion = "v8.0",
      activeEngines = [],
      constraints = {},
    } = req.body;

    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        success: true,
        source: "engine_kernel",
        message: "Generated using Design OS Core Kernel (Offline mode)",
        data: null,
      });
    }

    const systemPrompt = `You are the UNIVERSAL EDITORIAL & PRINT DESIGN AI OS (${osVersion}).
Architecture designed by ฐิติวัสส์ กาญจนพิมาย, Faculty of Industrial Technology, Nakhon Ratchasima Rajabhat University (NRRU).

OPERATIONAL PHILOSOPHY:
- CORE OS > ENGINE RULES > PROJECT PREFERENCES.
- Maintain content integrity, typographic hierarchy, production reality, accessibility, and bilingual Thai-English typographic harmony.
- Provide a rigorous design strategy, active engine outputs, an advanced design critique, and a strict 100-POINT QA GATE evaluation (10 categories, each scored out of 10).

100-Point QA Categories:
1. Content Integrity (10)
2. Typography (10)
3. Visual Hierarchy (10)
4. Grid & Layout (10)
5. Editorial Quality (10)
6. Visual Quality (10)
7. Color & Prepress (10)
8. Academic / Brand Identity (10)
9. Print Production Feasibility (10)
10. International & Accessibility (10)

Respond strictly in valid JSON format matching this schema:
{
  "projectAnalysis": {
    "mediaClass": string,
    "intent": string,
    "primaryAudience": string,
    "formatRecommendation": {
      "dimensions": string,
      "orientation": "portrait" | "landscape" | "custom",
      "gridSystem": string,
      "paperStock": string,
      "bindingMethod": string
    }
  },
  "selectedEngines": Array<{
    "id": string,
    "name": string,
    "version": string,
    "contribution": string
  }>,
  "designStrategy": {
    "concept": string,
    "visualLanguage": string,
    "typographyPairing": {
      "headline": string,
      "body": string,
      "thaiType": string,
      "scaleRatio": string,
      "rules": string[]
    },
    "colorPalette": {
      "mode": "CMYK" | "Pantone Spot" | "Hybrid",
      "colors": Array<{ "name": string, "cmyk": string, "hex": string, "usage": string }>
    },
    "gridSpecifications": {
      "columns": number,
      "gutter": string,
      "margins": { "top": string, "bottom": string, "inside": string, "outside": string },
      "baselineGrid": string
    },
    "printFinishing": string[]
  },
  "designCritic": {
    "strengths": string[],
    "tensions": string[],
    "refinements": string[]
  },
  "qaGate": {
    "scores": {
      "contentIntegrity": number,
      "typography": number,
      "visualHierarchy": number,
      "gridLayout": number,
      "editorialQuality": number,
      "visualQuality": number,
      "color": number,
      "academicIdentity": number,
      "printProduction": number,
      "internationalAccessibility": number
    },
    "totalScore": number,
    "status": "PASS" | "FAIL" | "REVISION_REQUIRED",
    "verdict": string,
    "revisions": string[]
  },
  "editorialSummary": string
}`;

    const userMessage = `COMMAND: ${command || "/design"}
BRIEF: ${brief || "Design project"}
PROJECT TYPE: ${projectType || "General Editorial"}
TARGET MEDIA: ${targetMedia || "Print / Editorial"}
ACTIVE ENGINES REQUESTED: ${activeEngines.join(", ") || "Auto-detect"}
CONSTRAINTS: ${JSON.stringify(constraints)}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: userMessage,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const text = response.text || "{}";
    let parsedData;
    try {
      parsedData = JSON.parse(text);
    } catch {
      parsedData = null;
    }

    res.json({
      success: true,
      source: "gemini-3.8-flash",
      data: parsedData,
      raw: text,
    });
  } catch (error: any) {
    console.error("AI OS generation error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to execute Design OS command",
    });
  }
});

// AI-Powered Font Pairing Recommender API
app.post("/api/typography/ai-recommend", async (req, res) => {
  try {
    const {
      themeOrMood = "Scholarly & Archival",
      projectTitle = "Editorial Publication",
      projectType = "Academic Monograph",
      targetMedia = "Offset Print Book",
      paperStock = "Munken Pure 120 GSM",
      currentBodyPt = 10,
    } = req.body;

    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        success: false,
        source: "offline_fallback",
        recommendations: [],
      });
    }

    const systemPrompt = `You are a master editorial typographer, prepress director, and book designer adhering to Robert Bringhurst's The Elements of Typographic Style and ISO 12647-2 prepress standards.
You specialize in bilingual Latin-Thai typographic harmony, optical sizing, x-height compensation, and print substrate viability.

Available Typeface Library (Choose strictly from these valid font family names):
- Serifs: "Newsreader", "EB Garamond", "Source Serif 4", "IBM Plex Serif"
- Sans-Serifs: "Plus Jakarta Sans", "Inter", "Prompt"
- Thai Typefaces: "IBM Plex Sans Thai", "Sarabun", "Pridi", "Prompt"
- Monospace / Display: "JetBrains Mono"

Task:
Analyze the editorial project's theme, mood, paper stock, and publication genre. Recommend 3 to 4 distinct typographic pairings that embody the requested tone, ensuring vertical proportion, legibility, and prepress viability.

Respond strictly in valid JSON matching this schema:
{
  "recommendations": [
    {
      "id": string,
      "pairingName": string,
      "moodTag": string,
      "headlineFont": string,
      "bodyFont": string,
      "thaiFont": string,
      "recommendedBodyPt": number,
      "recommendedLeadingPt": number,
      "recommendedThaiCompensationPt": number,
      "recommendedColumnMm": number,
      "rationale": string,
      "typographicVoice": string,
      "printViabilityScore": number,
      "designStyleCategory": string,
      "keyTraits": string[]
    }
  ]
}`;

    const userPrompt = `Project Title: ${projectTitle}
Publication Type: ${projectType}
Requested Mood / Theme: ${themeOrMood}
Substrate Paper Stock: ${paperStock}
Target Media: ${targetMedia}
Current Body Size: ${currentBodyPt}pt`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        temperature: 0.75,
      },
    });

    const text = response.text || "{}";
    let parsedData: any = {};
    try {
      parsedData = JSON.parse(text);
    } catch {
      parsedData = { recommendations: [] };
    }

    res.json({
      success: true,
      source: "gemini-3.8-flash",
      recommendations: parsedData.recommendations || [],
    });
  } catch (error: any) {
    console.error("AI font recommendation error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to generate AI font recommendations",
    });
  }
});

// Setup Vite middleware for development or serve dist in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Universal Design AI OS Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
