// Institution matching engine — deterministic multi-factor model.
// Evaluates Domain, Departments, Expertise, Facilities, and State/District relevance across India.
// No LLM for numerical scoring; supports cross-state eligibility and transparent explanations.

import { INSTITUTIONS, type Category } from "./domain";
import type { UniversityMatch } from "./types";

export interface MatchingContext {
  state?: string;
  district?: string;
  keywords?: string[];
  expertiseNeeded?: string[];
  title?: string;
  description?: string;
}

/**
 * Returns ranked institutions for a given category, required disciplines, and optional geographic context.
 *
 * Scoring:
 *   30 pts — Domain match (direct domain specialisation or adjacent alignment)
 *   20 pts — Department match (overlap between required disciplines and institution departments)
 *   25 pts — Expertise & Research Areas match (relevance to problem keywords and technical domains)
 *   15 pts — Facility match (relevant prototyping, analysis labs, incubators, testbeds)
 *   10 pts — Geographic relevance (10 same-district, 8 same-state, 5 cross-state — cross-state is fully eligible)
 */
export function rankUniversities(
  category: Category,
  requiredDisciplines: string[],
  stateOrContext?: string | MatchingContext,
  optionalContext?: MatchingContext
): UniversityMatch[] {
  // Normalize parameters for backward compatibility
  let context: MatchingContext = {};
  if (typeof stateOrContext === "string") {
    context = { state: stateOrContext, ...(optionalContext ?? {}) };
  } else if (stateOrContext && typeof stateOrContext === "object") {
    context = stateOrContext;
  }

  const targetState = context.state;
  const targetDistrict = context.district;
  const searchTerms = [
    ...(context.keywords ?? []),
    ...(context.expertiseNeeded ?? []),
    ...requiredDisciplines,
    ...(context.title ? context.title.toLowerCase().split(/\W+/).filter((w) => w.length > 3) : []),
    ...(context.description ? context.description.toLowerCase().split(/\W+/).filter((w) => w.length > 4) : []),
  ].map((t) => t.toLowerCase());

  const results: UniversityMatch[] = [];

  for (const inst of INSTITUTIONS) {
    // 1. Domain match (30 pts)
    const directDomainMatch = inst.domains.includes(category) || (inst.strengths ?? []).includes(category);
    const domainScore = directDomainMatch ? 30 : 10; // 10 pts baseline for cross-disciplinary potential

    // 2. Department match (20 pts)
    const instDepts = inst.departments ?? inst.disciplines ?? [];
    const matchedDepts = requiredDisciplines.filter((rd) =>
      instDepts.some(
        (dept) =>
          dept.toLowerCase().includes(rd.toLowerCase()) ||
          rd.toLowerCase().includes(dept.toLowerCase())
      )
    );
    const departmentScore =
      requiredDisciplines.length > 0
        ? Math.min(20, Math.round((matchedDepts.length / requiredDisciplines.length) * 20))
        : Math.min(20, Math.round((instDepts.length / 6) * 15));

    // 3. Expertise & Research Area match (25 pts)
    const instExpertise = [...(inst.expertise ?? []), ...(inst.research_areas ?? [])];
    const matchedExpertise: string[] = [];

    for (const exp of instExpertise) {
      const expLower = exp.toLowerCase();
      const hasHit = searchTerms.some((term) => term.length > 3 && expLower.includes(term));
      if (hasHit) {
        matchedExpertise.push(exp);
      }
    }
    const expertiseScore = Math.min(
      25,
      Math.max(
        directDomainMatch ? 12 : 5, // baseline if domain matches
        matchedExpertise.length * 6 + (directDomainMatch ? 7 : 0)
      )
    );

    // 4. Facility match (15 pts)
    const instFacilities = inst.facilities ?? [];
    const facilityKeywords = ["lab", "center", "centre", "testbed", "incubator", "fablab", "chamber", "analysis", "unit"];
    const matchedFacilities = instFacilities.filter((fac) => {
      const facLower = fac.toLowerCase();
      return searchTerms.some((st) => st.length > 4 && facLower.includes(st)) ||
             facilityKeywords.some((fk) => facLower.includes(fk) && directDomainMatch);
    });
    const facilityScore = Math.min(
      15,
      Math.max(
        instFacilities.length > 0 ? 6 : 0, // baseline for having operational lab infrastructure
        matchedFacilities.length * 5 + 3
      )
    );

    // 5. State / District relevance (10 pts)
    let relevanceScore = 5; // cross-state baseline (all states eligible!)
    if (targetDistrict && inst.district.toLowerCase() === targetDistrict.toLowerCase()) {
      relevanceScore = 10; // same district
    } else if (targetState && inst.state.toLowerCase() === targetState.toLowerCase()) {
      relevanceScore = 8; // same state
    } else if (!targetState) {
      relevanceScore = 8;
    }

    const totalScore = Math.min(100, domainScore + departmentScore + expertiseScore + facilityScore + relevanceScore);

    const explanation = buildComprehensiveExplanation({
      name: inst.name,
      state: inst.state,
      district: inst.district,
      category,
      directDomainMatch,
      matchedDepts,
      matchedExpertise,
      matchedFacilities,
      targetState,
      targetDistrict,
    });

    results.push({
      name: inst.name,
      score: totalScore,
      domain_score: domainScore,
      discipline_score: departmentScore,
      capability_score: expertiseScore + facilityScore,
      relevance_score: relevanceScore,
      explanation,
      disciplines_matched: matchedDepts.length > 0 ? matchedDepts : (inst.departments?.slice(0, 2) ?? []),
      state: inst.state,
      district: inst.district,
      matched_departments: matchedDepts,
      matched_expertise: matchedExpertise.slice(0, 3),
      matched_facilities: matchedFacilities.slice(0, 2),
    });
  }

  // Sort by score descending; de-duplicate by institution name
  const seen = new Set<string>();
  return results
    .sort((a, b) => b.score - a.score)
    .filter((r) => {
      if (seen.has(r.name)) return false;
      seen.add(r.name);
      return true;
    });
}

function buildComprehensiveExplanation(info: {
  name: string;
  state: string;
  district: string;
  category: Category;
  directDomainMatch: boolean;
  matchedDepts: string[];
  matchedExpertise: string[];
  matchedFacilities: string[];
  targetState?: string;
  targetDistrict?: string;
}): string {
  const parts: string[] = [];

  const isLocal = info.targetDistrict && info.district.toLowerCase() === info.targetDistrict.toLowerCase();
  const isSameState = info.targetState && info.state.toLowerCase() === info.targetState.toLowerCase();

  const locationTag = isLocal
    ? `Local district institution in ${info.district}, ${info.state}`
    : isSameState
    ? `State institution in ${info.district}, ${info.state}`
    : `National institution in ${info.district}, ${info.state}`;

  if (info.directDomainMatch) {
    parts.push(`${locationTag} specializing in ${info.category}.`);
  } else {
    parts.push(`${locationTag} with multidisciplinary engineering capability.`);
  }

  if (info.matchedDepts.length > 0) {
    parts.push(`Departments: ${info.matchedDepts.slice(0, 3).join(", ")}.`);
  }

  if (info.matchedFacilities.length > 0) {
    parts.push(`Infrastructure: ${info.matchedFacilities.slice(0, 2).join("; ")}.`);
  }

  if (info.matchedExpertise.length > 0) {
    parts.push(`Key expertise: ${info.matchedExpertise.slice(0, 2).join(", ")}.`);
  }

  return parts.join(" ");
}
