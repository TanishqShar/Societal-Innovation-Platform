// Server-only AI analysis module.
// Tries Gemini API first; falls back to deterministic keyword classifier on any failure.

import { classify, DOMAIN_DISCIPLINES, SUBCATEGORIES, type Category } from "./domain";
import type { AIAnalysis } from "./types";
import { calculatePriority } from "./priority";

const GEMINI_MODELS = [
  "gemini-flash-latest",
  "gemini-2.5-flash-lite",
  "gemini-pro-latest",
];

export async function analyzeChallenge(
  title: string,
  description: string,
  existingChallenges: { id: string; title: string; description: string }[],
  context?: { state?: string; district?: string; local_area?: string }
): Promise<Omit<AIAnalysis, "id" | "created_at" | "challenge_id">> {
  const apiKey = (process.env.GEMINI_API_KEY ?? "").trim().replace(/^["']|["']$/g, "");
  if (apiKey) {
    try {
      return await analyzeWithGemini(title, description, existingChallenges, apiKey, context);
    } catch (err) {
      console.warn("[AI] Gemini API failed, using fallback:", (err as Error).message);
    }
  }
  return analyzeFallback(title, description, existingChallenges);
}

// ---- Gemini implementation --------------------------------------------------

async function analyzeWithGemini(
  title: string,
  description: string,
  existingChallenges: { id: string; title: string; description: string }[],
  apiKey: string,
  context?: { state?: string; district?: string; local_area?: string }
): Promise<Omit<AIAnalysis, "id" | "created_at" | "challenge_id">> {
  const existingSample = existingChallenges
    .slice(0, 10)
    .map((c) => `ID:${c.id} TITLE:${c.title}`)
    .join("\n");

  const locationContext = `STATE: ${context?.state ?? "India (unspecified state)"}
DISTRICT: ${context?.district ?? "(unspecified district)"}
LOCAL AREA / VILLAGE / WARD: ${context?.local_area ?? "(unspecified local area)"}`;

  const prompt = `You are an AI classifier for a societal innovation portal covering multiple states in India.
Analyze this community challenge and return a JSON object.

CHALLENGE TITLE: ${title}
CHALLENGE DESCRIPTION: ${description}
${locationContext}

EXISTING CHALLENGES (for duplicate detection):
${existingSample || "(none yet)"}

Return ONLY a JSON object with these exact fields:
{
  "category": one of [Education, Agriculture, Healthcare, Water Resources, Sanitation, Environment, Energy, Urban Development, Accessibility, Public Administration, Rural Livelihoods],
  "subcategory": string (specific sub-area),
  "priority": one of [Critical, High, Medium, Low],
  "priority_score": integer 0-100,
  "impact_score": integer 0-100,
  "urgency_score": integer 0-100,
  "problem_summary": string (1-2 sentences, plain language),
  "affected_population": integer (estimated people directly affected),
  "required_disciplines": array of 2-5 academic discipline strings,
  "recommended_solution_types": array of 2-4 solution approach strings,
  "relevant_expertise": array of 2-4 institutional capability or domain expertise strings,
  "confidence_score": float 0-1,
  "duplicate_score": float 0-1 (0=unique, 1=exact duplicate),
  "similar_challenge_id": string or null (id from existing challenges if similar)
}`;

  let lastError: Error | null = null;

  for (const model of GEMINI_MODELS) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json", temperature: 0.2 },
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini HTTP ${response.status}: ${response.statusText}`);
      }

      const json = await response.json();
      const text: string = json?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
      const parsed = JSON.parse(text);

      console.log(`[AI] Challenge successfully analyzed using Google Gemini (${model})`);

      return {
        category: parsed.category as Category,
        subcategory: parsed.subcategory ?? "",
        priority: parsed.priority,
        priority_score: Number(parsed.priority_score),
        impact_score: Number(parsed.impact_score),
        urgency_score: Number(parsed.urgency_score),
        duplicate_score: Number(parsed.duplicate_score ?? 0),
        similar_challenge_id: parsed.similar_challenge_id ?? null,
        problem_summary: parsed.problem_summary ?? "",
        affected_population: Number(parsed.affected_population ?? 100),
        required_disciplines: Array.isArray(parsed.required_disciplines)
          ? parsed.required_disciplines
          : [],
        recommended_solution_types: Array.isArray(parsed.recommended_solution_types)
          ? parsed.recommended_solution_types
          : [],
        relevant_expertise: Array.isArray(parsed.relevant_expertise)
          ? parsed.relevant_expertise
          : [],
        confidence_score: Number(parsed.confidence_score ?? 0.85),
        ai_provider: "gemini" as const,
      };
    } catch (err) {
      lastError = err as Error;
    }
  }

  throw lastError ?? new Error("All Gemini models failed");
}


// ---- Deterministic fallback -------------------------------------------------

function analyzeFallback(
  title: string,
  description: string,
  existingChallenges: { id: string; title: string; description: string }[]
): Omit<AIAnalysis, "id" | "created_at" | "challenge_id"> {
  const text = `${title} ${description}`;
  const category = classify(text);
  const subcategories = SUBCATEGORIES[category];
  const subcategory = subcategories[0] ?? category;
  const disciplines = DOMAIN_DISCIPLINES[category] ?? [];

  const { priority, score: priority_score, impact_score, urgency_score } = calculatePriority(text);

  // Simple duplicate detection — cosine-ish word overlap
  let duplicate_score = 0;
  let similar_challenge_id: string | null = null;
  const words = new Set(text.toLowerCase().split(/\W+/).filter((w) => w.length > 4));

  for (const c of existingChallenges) {
    const cText = `${c.title} ${c.description}`;
    const cWords = new Set(cText.toLowerCase().split(/\W+/).filter((w) => w.length > 4));
    const intersection = [...words].filter((w) => cWords.has(w)).length;
    const union = new Set([...words, ...cWords]).size;
    const overlap = union > 0 ? intersection / union : 0;
    if (overlap > duplicate_score) {
      duplicate_score = overlap;
      if (overlap > 0.35) similar_challenge_id = c.id;
    }
  }

  const popKeywords: [string, number][] = [
    ["village", 500], ["block", 1500], ["district", 8000], ["town", 3000],
    ["families", 200], ["students", 300], ["farmers", 400], ["workers", 250],
    ["children", 150], ["women", 300], ["elderly", 100],
  ];
  let affected_population = 200;
  for (const [kw, pop] of popKeywords) {
    if (text.toLowerCase().includes(kw)) {
      affected_population = Math.max(affected_population, pop);
    }
  }

  const solutions: Record<Category, string[]> = {
    Education: ["Digital learning platform", "Teacher training program", "School infrastructure"],
    Agriculture: ["Crop disease detection app", "Farmer advisory", "Market linkage platform"],
    Healthcare: ["Mobile health clinic", "Telemedicine", "Community health workers"],
    "Water Resources": ["Borewell rehabilitation", "Water quality sensors", "Community filtration"],
    Sanitation: ["Community toilet complex", "Waste collection system", "Hygiene awareness"],
    Environment: ["IoT pollution monitoring", "Bioremediation", "Community reporting"],
    Energy: ["Solar micro-grid", "Smart meter rollout", "Voltage stabilisers"],
    "Urban Development": ["Drainage upgrade", "Smart traffic management", "Road maintenance"],
    Accessibility: ["Ramp installation", "Assistive technology", "Inclusive design"],
    "Public Administration": ["Digital document system", "Grievance redressal portal", "Scheme tracking"],
    "Rural Livelihoods": ["Market linkage platform", "SHG training", "Micro-finance support"],
  };

  return {
    category,
    subcategory,
    priority,
    priority_score,
    impact_score,
    urgency_score,
    duplicate_score: Math.round(duplicate_score * 100) / 100,
    similar_challenge_id,
    problem_summary: `${category} challenge: ${title}. ${description.slice(0, 120)}...`,
    affected_population,
    required_disciplines: disciplines.slice(0, 4),
    recommended_solution_types: solutions[category] ?? ["Community intervention", "Technology solution"],
    relevant_expertise: disciplines.slice(0, 3),
    confidence_score: 0.72,
    ai_provider: "fallback" as const,
  };
}
