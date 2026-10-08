// Rule-based problem similarity discovery (No ML pipeline).
// Evaluates domain, subcategory, keyword overlap, and geographical locality.
// Categorises results into:
//   1. Same District
//   2. Same State (other districts)
//   3. Other States (cross-state national similarity)

import type { Problem } from "./types";
import { DOMAIN_DISCIPLINES } from "./domain";

export interface ScoredProblem {
  problem: Problem;
  score: number;
  matchedKeywords: string[];
}

export interface SimilarProblemsResult {
  sameDistrict: ScoredProblem[];
  sameState: ScoredProblem[];
  otherStates: ScoredProblem[];
  totalMatches: number;
}

const STOP_WORDS = new Set([
  "the", "and", "for", "with", "this", "that", "from", "have", "area", "problem",
  "issue", "local", "village", "district", "state", "block", "ward", "over", "been",
  "into", "their", "water", "road", "school", "need", "near", "lack", "poor", "high",
]);

/**
 * Extracts normalized, non-stopword tokens of length > 3
 */
function extractTokens(text: string): Set<string> {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOP_WORDS.has(w));
  return new Set(words);
}

/**
 * Calculates rule-based similarity between target problem and candidate
 */
export function scoreSimilarity(target: Problem, candidate: Problem): { score: number; matchedKeywords: string[] } {
  if (target.id === candidate.id) return { score: 0, matchedKeywords: [] };

  let score = 0;
  const matchedKeywords: string[] = [];

  // 1. Domain match (35 pts)
  if (target.category === candidate.category) {
    score += 35;
  } else {
    // Check discipline/thematic adjacency
    const targetDiscs = DOMAIN_DISCIPLINES[target.category] ?? [];
    const candDiscs = DOMAIN_DISCIPLINES[candidate.category] ?? [];
    const hasOverlap = targetDiscs.some((d) => candDiscs.includes(d));
    if (hasOverlap) score += 10;
  }

  // 2. Subcategory match (15 pts)
  if (target.subcategory && candidate.subcategory && target.subcategory.toLowerCase() === candidate.subcategory.toLowerCase()) {
    score += 15;
    matchedKeywords.push(target.subcategory);
  }

  // 3. Keyword / token overlap (up to 40 pts)
  const targetText = `${target.title} ${target.description}`;
  const candText = `${candidate.title} ${candidate.description}`;
  const targetTokens = extractTokens(targetText);
  const candTokens = extractTokens(candText);

  for (const token of targetTokens) {
    if (candTokens.has(token)) {
      matchedKeywords.push(token);
    }
  }

  const tokenOverlapScore = Math.min(40, matchedKeywords.length * 8);
  score += tokenOverlapScore;

  // 4. Priority alignment (10 pts)
  if (target.priority && candidate.priority && target.priority === candidate.priority) {
    score += 10;
  }

  return { score, matchedKeywords: [...new Set(matchedKeywords)].slice(0, 5) };
}

/**
 * Groups similar problems into: same district, same state, other states
 */
export function findSimilarProblems(target: Problem, allProblems: Problem[], minScore = 20): SimilarProblemsResult {
  const targetState = target.state ?? "Jharkhand";
  const targetDistrict = target.district;

  const sameDistrict: ScoredProblem[] = [];
  const sameState: ScoredProblem[] = [];
  const otherStates: ScoredProblem[] = [];

  for (const candidate of allProblems) {
    if (candidate.id === target.id) continue;

    const { score, matchedKeywords } = scoreSimilarity(target, candidate);
    if (score < minScore) continue;

    const candState = candidate.state ?? "Jharkhand";
    const candDistrict = candidate.district;

    const scored: ScoredProblem = {
      problem: candidate,
      score,
      matchedKeywords,
    };

    if (candState.toLowerCase() === targetState.toLowerCase()) {
      if (candDistrict.toLowerCase() === targetDistrict.toLowerCase()) {
        sameDistrict.push(scored);
      } else {
        sameState.push(scored);
      }
    } else {
      otherStates.push(scored);
    }
  }

  // Sort descending by score within each cohort
  sameDistrict.sort((a, b) => b.score - a.score);
  sameState.sort((a, b) => b.score - a.score);
  otherStates.sort((a, b) => b.score - a.score);

  return {
    sameDistrict: sameDistrict.slice(0, 4),
    sameState: sameState.slice(0, 4),
    otherStates: otherStates.slice(0, 4),
    totalMatches: sameDistrict.length + sameState.length + otherStates.length,
  };
}
