"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MapPin, X, ArrowUpRight, FolderOpen, AlertCircle } from "lucide-react";
import type { Problem, Project } from "@/lib/types";
import { StatusBadge, PriorityBadge } from "@/components/badges";

type DistrictMeta = {
  name: string;
  division: "South Chotanagpur" | "North Chotanagpur" | "Kolhan" | "Palamu" | "Santhal Pargana";
  hq: string;
};

const JHARKHAND_DISTRICTS: DistrictMeta[] = [
  // Santhal Pargana
  { name: "Dumka", division: "Santhal Pargana", hq: "Dumka" },
  { name: "Deoghar", division: "Santhal Pargana", hq: "Deoghar" },
  { name: "Godda", division: "Santhal Pargana", hq: "Godda" },
  { name: "Jamtara", division: "Santhal Pargana", hq: "Jamtara" },
  { name: "Sahibganj", division: "Santhal Pargana", hq: "Sahibganj" },
  { name: "Pakur", division: "Santhal Pargana", hq: "Pakur" },

  // South Chotanagpur
  { name: "Ranchi", division: "South Chotanagpur", hq: "Ranchi" },
  { name: "Khunti", division: "South Chotanagpur", hq: "Khunti" },
  { name: "Gumla", division: "South Chotanagpur", hq: "Gumla" },
  { name: "Simdega", division: "South Chotanagpur", hq: "Simdega" },
  { name: "Lohardaga", division: "South Chotanagpur", hq: "Lohardaga" },

  // North Chotanagpur
  { name: "Hazaribagh", division: "North Chotanagpur", hq: "Hazaribagh" },
  { name: "Dhanbad", division: "North Chotanagpur", hq: "Dhanbad" },
  { name: "Bokaro", division: "North Chotanagpur", hq: "Bokaro" },
  { name: "Giridih", division: "North Chotanagpur", hq: "Giridih" },
  { name: "Ramgarh", division: "North Chotanagpur", hq: "Ramgarh" },
  { name: "Koderma", division: "North Chotanagpur", hq: "Koderma" },
  { name: "Chatra", division: "North Chotanagpur", hq: "Chatra" },

  // Kolhan
  { name: "East Singhbhum (Jamshedpur)", division: "Kolhan", hq: "Jamshedpur" },
  { name: "West Singhbhum", division: "Kolhan", hq: "Chaibasa" },
  { name: "Saraikela Kharsawan", division: "Kolhan", hq: "Saraikela" },

  // Palamu
  { name: "Palamu", division: "Palamu", hq: "Medininagar" },
  { name: "Garhwa", division: "Palamu", hq: "Garhwa" },
  { name: "Latehar", division: "Palamu", hq: "Latehar" },
];

export function DistrictMap({
  problems,
  projects,
}: {
  problems: Problem[];
  projects: Project[];
}) {
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>("Dumka");
  const [activeDivision, setActiveDivision] = useState<string>("All");

  const divisions = ["All", "Santhal Pargana", "South Chotanagpur", "North Chotanagpur", "Kolhan", "Palamu"];

  const filteredDistricts = activeDivision === "All"
    ? JHARKHAND_DISTRICTS
    : JHARKHAND_DISTRICTS.filter((d) => d.division === activeDivision);

  const selectedMeta = JHARKHAND_DISTRICTS.find((d) => d.name === selectedDistrict);
  const districtProblems = problems.filter((p) => p.district === selectedDistrict);
  const districtProjects = projects.filter((proj) => {
    const matchedProblem = problems.find((p) => p.id === proj.challenge_id);
    return matchedProblem?.district === selectedDistrict;
  });

  // Calculate top category for selected district
  const categoryTally = new Map<string, number>();
  districtProblems.forEach((p) => {
    categoryTally.set(p.category, (categoryTally.get(p.category) ?? 0) + 1);
  });
  const topCategory = [...categoryTally.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Various";

  return (
    <div className="card p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <MapPin size={22} className="text-brand" />
            Jharkhand District Innovation Density
          </h2>
          <p className="text-sm text-black/60 mt-0.5">
            Interactive statewide view across all 24 administrative districts. Click any district to inspect challenges and active projects.
          </p>
        </div>

        {/* Division Filter Tabs — scrollable on mobile */}
        <div className="scroll-x-auto">
          <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-medium w-max">
            {divisions.map((div) => (
              <button
                key={div}
                onClick={() => setActiveDivision(div)}
                className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                  activeDivision === div
                    ? "bg-white text-brand-dark shadow-sm font-semibold"
                    : "text-black/60 hover:text-black"
                }`}
              >
                {div}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive 24-District Grid Visualizer */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {filteredDistricts.map((d) => {
          const count = problems.filter((p) => p.district === d.name).length;
          const projCount = projects.filter((proj) => {
            const matchedProblem = problems.find((p) => p.id === proj.challenge_id);
            return matchedProblem?.district === d.name;
          }).length;
          const isSelected = selectedDistrict === d.name;

          // Color scale based on challenge density
          const densityClass = count >= 4
            ? "border-brand/40 bg-brand/10 text-brand-dark"
            : count >= 2
            ? "border-sky-300 bg-sky-50 text-sky-900"
            : count >= 1
            ? "border-slate-200 bg-slate-50 text-slate-800"
            : "border-dashed border-slate-200 bg-white text-slate-400";

          return (
            <button
              key={d.name}
              onClick={() => setSelectedDistrict(d.name)}
              className={`text-left p-3.5 rounded-xl border transition relative overflow-hidden group ${densityClass} ${
                isSelected ? "ring-2 ring-brand shadow-md scale-[1.02]" : "hover:border-brand/50 hover:shadow-sm"
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="text-xs text-black/45 font-medium truncate max-w-[80%]">
                  {d.division.replace("Chotanagpur", "Chota.")}
                </span>
                {projCount > 0 && (
                  <span className="h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" title={`${projCount} active projects`} />
                )}
              </div>
              <div className="font-bold text-sm mt-1 truncate">{d.name}</div>
              <div className="flex items-center justify-between mt-3 text-xs">
                <span className="font-semibold">{count} {count === 1 ? "issue" : "issues"}</span>
                {projCount > 0 && (
                  <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">
                    {projCount} proj
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* District Detail Drill-down Panel */}
      {selectedMeta && (
        <div className="mt-6 border-t border-black/10 pt-6 animate-in fade-in duration-200">
          <div className="flex items-start justify-between flex-wrap gap-3 pb-4 border-b border-black/5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-brand/10 text-brand px-2.5 py-0.5 rounded-full font-semibold">
                  {selectedMeta.division} Division
                </span>
                <span className="text-xs text-black/50">HQ: {selectedMeta.hq}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mt-1 text-slate-900">{selectedMeta.name} District Overview</h3>
            </div>
            <button
              onClick={() => setSelectedDistrict(null)}
              className="p-1 text-black/40 hover:text-black hover:bg-slate-100 rounded-lg"
              title="Close panel"
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick Metrics for District */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-black/5">
              <div className="text-2xl font-bold text-brand">{districtProblems.length}</div>
              <div className="text-xs text-black/55 mt-0.5">Reported Challenges</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-black/5">
              <div className="text-2xl font-bold text-emerald-700">{districtProjects.length}</div>
              <div className="text-xs text-black/55 mt-0.5">Innovation Projects</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-black/5">
              <div className="text-2xl font-bold text-violet-700">{topCategory}</div>
              <div className="text-xs text-black/55 mt-0.5">Top Challenge Domain</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-black/5">
              <div className="text-2xl font-bold text-sky-700">
                {districtProblems.filter((p) => p.status === "completed" || p.status === "deployed").length}
              </div>
              <div className="text-xs text-black/55 mt-0.5">Solutions Deployed</div>
            </div>
          </div>

          {/* District Challenges & Linked Projects */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-black/75 flex items-center gap-2">
              <AlertCircle size={15} className="text-brand" />
              Community Challenges in {selectedMeta.name} ({districtProblems.length})
            </h4>

            {districtProblems.length === 0 ? (
              <p className="text-xs text-black/40 italic py-3">No challenges reported yet for this district.</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
                {districtProblems.map((p) => {
                  const linkedProj = projects.find((proj) => proj.challenge_id === p.id);
                  return (
                    <div
                      key={p.id}
                      className="p-3.5 rounded-xl border border-black/10 bg-white hover:border-brand/40 transition group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                          <StatusBadge status={p.status} />
                          {p.priority && <PriorityBadge priority={p.priority} />}
                          <span className="text-xs text-black/45">{p.category}</span>
                        </div>
                        <Link
                          href={`/challenges/${p.id}`}
                          className="font-medium text-sm hover:text-brand hover:underline line-clamp-2"
                        >
                          {p.title}
                        </Link>
                        <p className="text-xs text-black/55 mt-1 line-clamp-2">{p.description}</p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-black/5 flex items-center justify-between text-xs">
                        <span className="text-black/45">
                          {p.assigned_to ? `Assigned: ${p.assigned_to}` : "Unassigned"}
                        </span>
                        {linkedProj ? (
                          <Link
                            href={`/projects/${linkedProj.id}`}
                            className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:underline"
                          >
                            <FolderOpen size={12} /> Project ({linkedProj.progress}%)
                          </Link>
                        ) : (
                          <Link
                            href={`/challenges/${p.id}`}
                            className="inline-flex items-center gap-0.5 text-brand hover:underline font-medium"
                          >
                            View <ArrowUpRight size={13} />
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
