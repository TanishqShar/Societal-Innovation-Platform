"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  MapPin,
  Building2,
  AlertCircle,
  Layers,
  Globe2,
  Compass,
} from "lucide-react";
import type { Problem, Solution } from "@/lib/types";
import type { SimilarProblemsResult } from "@/lib/similarity";
import { CategoryBadge, StatusBadge, PriorityBadge } from "@/components/badges";

interface Props {
  currentProblem: Problem;
  similar: SimilarProblemsResult;
  reusableSolutions: Solution[];
}

export function SimilarAndSolutionsSection({ currentProblem, similar, reusableSolutions }: Props) {
  const [tab, setTab] = useState<"district" | "state" | "national">("district");

  const activeSimilar =
    tab === "district"
      ? similar.sameDistrict
      : tab === "state"
      ? similar.sameState
      : similar.otherStates;

  return (
    <div className="space-y-8">
      {/* 1. POTENTIALLY REUSABLE SOLUTIONS */}
      {reusableSolutions.length > 0 && (
        <section className="card p-6 space-y-4 border border-emerald-500/20 bg-gradient-to-br from-emerald-950/5 via-slate-50 to-white">
          <div className="flex items-start justify-between flex-wrap gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                <Sparkles size={13} className="text-emerald-700" />
                Potentially Reusable Solution
              </div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Cross-State Proven Innovations &amp; Blueprints
              </h2>
              <p className="text-xs text-black/60 mt-1 max-w-2xl leading-relaxed">
                These completed &amp; deployed societal solutions from other regions address comparable challenges in {currentProblem.category}. They may serve as technical blueprints, though local environmental and technical validation are required.
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
              {reusableSolutions.length} Blueprints Available
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-4 pt-2">
            {reusableSolutions.map((sol) => (
              <div
                key={sol.id}
                className="p-4 rounded-xl border border-emerald-900/10 bg-white hover:border-emerald-500/40 hover:shadow-sm transition flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                      {sol.domain}
                    </span>
                    <span className="text-[11px] font-medium text-black/50 flex items-center gap-1">
                      <MapPin size={11} className="text-emerald-600" />
                      {sol.district}, {sol.state}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 leading-snug">
                    {sol.title}
                  </h3>

                  <div className="text-xs text-black/65 space-y-1">
                    <p className="line-clamp-2">
                      <strong className="text-slate-800">Problem Addressed: </strong>
                      {sol.problem_solved}
                    </p>
                    <p>
                      <strong className="text-slate-800">Technology: </strong>
                      {sol.technology}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-black/5 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-black/55 flex-wrap gap-1">
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <Building2 size={12} className="text-brand" /> {sol.institution}
                    </span>
                    <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                      {sol.deployment_status}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200/50 text-[11px] text-emerald-900 leading-relaxed">
                    <strong>Measured Impact: </strong>{sol.impact}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-[11px] text-black/45 flex items-center gap-1.5 pt-1">
            <AlertCircle size={13} className="text-amber-600 shrink-0" />
            <span>
              Disclaimer: Do not claim a solution is automatically applicable. Cross-state adaptation and local soil, water, and cultural validation are required.
            </span>
          </div>
        </section>
      )}

      {/* 2. SIMILAR PROBLEMS DISCOVERY */}
      <section className="card p-6 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-brand uppercase tracking-wider mb-1">
              <Compass size={14} />
              Cross-Regional Problem Intelligence
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Similar Community Challenges
            </h2>
            <p className="text-xs text-black/60 mt-0.5">
              Explore interconnected challenges to pool citizen demand, share prototypes, and prevent duplicated research.
            </p>
          </div>
          <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-semibold">
            {similar.totalMatches} related challenges detected
          </span>
        </div>

        {/* Cohort Tabs */}
        <div className="flex border-b border-black/10 gap-2 text-xs">
          <button
            onClick={() => setTab("district")}
            className={`pb-2.5 px-3 font-semibold transition border-b-2 flex items-center gap-1.5 ${
              tab === "district"
                ? "border-brand text-brand font-bold"
                : "border-transparent text-black/50 hover:text-black"
            }`}
          >
            <MapPin size={13} />
            Same District ({similar.sameDistrict.length})
          </button>
          <button
            onClick={() => setTab("state")}
            className={`pb-2.5 px-3 font-semibold transition border-b-2 flex items-center gap-1.5 ${
              tab === "state"
                ? "border-brand text-brand font-bold"
                : "border-transparent text-black/50 hover:text-black"
            }`}
          >
            <Layers size={13} />
            Same State ({similar.sameState.length})
          </button>
          <button
            onClick={() => setTab("national")}
            className={`pb-2.5 px-3 font-semibold transition border-b-2 flex items-center gap-1.5 ${
              tab === "national"
                ? "border-brand text-brand font-bold"
                : "border-transparent text-black/50 hover:text-black"
            }`}
          >
            <Globe2 size={13} />
            Other States ({similar.otherStates.length})
          </button>
        </div>

        {/* Tab Content */}
        {activeSimilar.length === 0 ? (
          <div className="p-8 text-center text-xs text-black/40 italic">
            No similar challenges found in this cohort for this domain.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-3.5">
            {activeSimilar.map(({ problem: p, score, matchedKeywords }) => (
              <Link
                key={p.id}
                href={`/challenges/${p.id}`}
                className="p-4 rounded-xl border border-black/5 bg-slate-50 hover:bg-white hover:border-brand/30 hover:shadow-xs transition flex flex-col justify-between space-y-2.5 group"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <CategoryBadge category={p.category} />
                    <StatusBadge status={p.status} />
                    {p.priority && <PriorityBadge priority={p.priority} />}
                    <span className="text-[10px] font-bold text-brand bg-brand/10 px-2 py-0.5 rounded-full ml-auto">
                      {score}% Match
                    </span>
                  </div>

                  <h3 className="font-semibold text-sm text-slate-900 group-hover:text-brand transition leading-snug">
                    {p.title}
                  </h3>

                  <p className="text-xs text-black/60 line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-black/5 flex items-center justify-between text-[11px] text-black/55 flex-wrap gap-1">
                  <span className="flex items-center gap-1 font-medium">
                    <MapPin size={11} className="text-brand" /> {p.district}, {p.state ?? "Jharkhand"}
                  </span>
                  {matchedKeywords.length > 0 && (
                    <span className="text-[10px] text-black/45 truncate max-w-[160px]">
                      Keywords: {matchedKeywords.join(", ")}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
