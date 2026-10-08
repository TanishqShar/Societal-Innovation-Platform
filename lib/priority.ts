// Transparent priority scoring engine.
// Model: 35% population impact + 25% urgency + 20% severity + 10% spread + 10% feasibility

import type { Priority } from "./domain";

const URGENCY_KEYWORDS = ["emergency", "urgent", "critical", "immediate", "dangerous", "outbreak", "dying", "dead", "no access", "cut off", "collapsed", "fire"];
const SEVERITY_KEYWORDS = ["months", "years", "never", "always", "entire", "all families", "whole village", "no doctor", "no water", "no electricity", "no school"];
const SPREAD_KEYWORDS = ["district", "block", "entire village", "multiple villages", "panchayat", "town", "all wards"];
const COMPLEX_KEYWORDS = ["infrastructure", "policy", "government", "legal", "administrative", "complex", "multi-agency"];

export function calculatePriority(text: string): {
  priority: Priority;
  score: number;
  impact_score: number;
  urgency_score: number;
  breakdown: { population: number; urgency: number; severity: number; spread: number; feasibility: number };
} {
  const lower = text.toLowerCase();

  // Population impact (35 pts)
  const popScore = getPopulationScore(lower);

  // Urgency (25 pts)
  const urgencyMatches = URGENCY_KEYWORDS.filter((k) => lower.includes(k)).length;
  const urgencyScore = Math.min(25, urgencyMatches * 8);

  // Severity (20 pts)
  const severityMatches = SEVERITY_KEYWORDS.filter((k) => lower.includes(k)).length;
  const severityScore = Math.min(20, severityMatches * 6);

  // Geographical spread (10 pts)
  const spreadMatches = SPREAD_KEYWORDS.filter((k) => lower.includes(k)).length;
  const spreadScore = Math.min(10, spreadMatches * 4);

  // Feasibility (10 pts — lower complexity = higher score)
  const complexMatches = COMPLEX_KEYWORDS.filter((k) => lower.includes(k)).length;
  const feasibilityScore = Math.max(0, 10 - complexMatches * 3);

  const totalScore = popScore + urgencyScore + severityScore + spreadScore + feasibilityScore;

  // Clamp 0-100 and add base of 30 so nothing reads as "0"
  const score = Math.min(100, Math.max(30, totalScore + 30));

  // Impact is heavily population + urgency based
  const impact_score = Math.min(100, Math.max(20, (popScore * 2 + urgencyScore * 2 + severityScore)));
  const urgency_score_final = Math.min(100, Math.max(20, urgencyScore * 4 + spreadScore * 2 + 40));

  const priority: Priority =
    score >= 80 ? "Critical" :
    score >= 60 ? "High" :
    score >= 40 ? "Medium" : "Low";

  return {
    priority,
    score,
    impact_score,
    urgency_score: urgency_score_final,
    breakdown: {
      population: popScore,
      urgency: urgencyScore,
      severity: severityScore,
      spread: spreadScore,
      feasibility: feasibilityScore,
    },
  };
}

function getPopulationScore(lower: string): number {
  if (lower.includes("lakh") || lower.includes("lakhs")) return 35;
  if (lower.includes("thousand") || lower.includes("district")) return 28;
  if (lower.includes("entire village") || lower.includes("all families")) return 25;
  if (lower.includes("village") || lower.includes("panchayat")) return 20;
  if (lower.includes("block") || lower.includes("town")) return 18;
  if (lower.includes("families") || lower.includes("students") || lower.includes("farmers")) return 15;
  if (lower.includes("children") || lower.includes("women") || lower.includes("workers")) return 12;
  return 8; // default minimum
}
