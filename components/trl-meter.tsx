"use client";

import React, { useState } from "react";
import { Gauge, CheckCircle2, ChevronRight, Sparkles, ShieldCheck, Edit3 } from "lucide-react";
import { updateProjectTrlAction } from "@/app/actions";

const TRL_STAGES = [
  { level: 1, title: "TRL 1: Basic Principles", phase: "Research", desc: "Scientific research begins to be translated into applied R&D." },
  { level: 2, title: "TRL 2: Concept Formulated", phase: "Research", desc: "Practical civic applications are invented and formulated." },
  { level: 3, title: "TRL 3: Proof of Concept", phase: "Research", desc: "Active R&D initiated. Analytical & laboratory studies validate predictions." },
  { level: 4, title: "TRL 4: Lab Validation", phase: "Prototyping", desc: "Basic technological components integrated to establish realistic benchmarks." },
  { level: 5, title: "TRL 5: Simulated Environment", phase: "Prototyping", desc: "Integrated prototype fidelity tested in representative conditions." },
  { level: 6, title: "TRL 6: Field Prototype", phase: "Prototyping", desc: "Engineering prototype demonstrated in target rural/urban environment." },
  { level: 7, title: "TRL 7: Operational Demo", phase: "Deployment", desc: "Full prototype demonstration in real community conditions (Gram Panchayat/ULB)." },
  { level: 8, title: "TRL 8: System Qualified", phase: "Deployment", desc: "Actual system completed and qualified through test and demonstration." },
  { level: 9, title: "TRL 9: Full Deployment", phase: "Deployment", desc: "Technology proven and scaled across multiple community clusters." },
];

export function TrlMeter({
  currentTrl = 5,
  projectId,
  canEdit = false,
}: {
  currentTrl?: number;
  projectId: string;
  canEdit?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const activeTrl = Math.min(9, Math.max(1, currentTrl || 5));
  const activeStage = TRL_STAGES[activeTrl - 1];

  const getPhaseColor = (lvl: number) => {
    if (lvl <= 3) return "text-blue-700 bg-blue-50 border-blue-200";
    if (lvl <= 6) return "text-purple-700 bg-purple-50 border-purple-200";
    return "text-emerald-700 bg-emerald-50 border-emerald-200";
  };

  return (
    <div className="card p-5 space-y-4 bg-gradient-to-br from-white to-slate-50 border border-black/10">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-brand/10 text-brand grid place-items-center shrink-0">
            <Gauge size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-base text-slate-900">
                Technology Readiness Level (TRL {activeTrl}/9)
              </h3>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getPhaseColor(activeTrl)}`}>
                {activeStage.phase} Phase
              </span>
            </div>
            <p className="text-xs text-black/55 mt-0.5">
              Government of India (DST / NITI Aayog) standard innovation maturity scale.
            </p>
          </div>
        </div>

        {canEdit && (
          <button
            type="button"
            onClick={() => setEditing(!editing)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline px-2.5 py-1 rounded-md bg-brand/5 border border-brand/20 min-h-[36px]"
          >
            <Edit3 size={13} /> {editing ? "Cancel" : "Update TRL"}
          </button>
        )}
      </div>

      {/* 9-Segment Segmented Progress Bar */}
      <div className="space-y-1.5">
        <div className="grid grid-cols-9 gap-1 sm:gap-1.5">
          {TRL_STAGES.map((s) => {
            const isCompleted = s.level <= activeTrl;
            const isCurrent = s.level === activeTrl;

            return (
              <div
                key={s.level}
                className={`h-3 rounded-full transition-all duration-300 relative group cursor-pointer ${
                  isCurrent
                    ? "bg-brand ring-2 ring-brand/40 shadow-xs scale-y-125"
                    : isCompleted
                    ? "bg-emerald-600"
                    : "bg-slate-200"
                }`}
                title={s.title}
              />
            );
          })}
        </div>
        <div className="flex justify-between text-[10px] text-black/45 font-medium px-0.5">
          <span>TRL 1 (Concept)</span>
          <span>TRL 5 (Lab Prototype)</span>
          <span>TRL 9 (Field Deployment)</span>
        </div>
      </div>

      {/* Current Level Description Box */}
      <div className="p-3.5 rounded-xl bg-white border border-black/10 flex items-start gap-3">
        <span className="h-7 w-7 rounded-lg bg-emerald-100 text-emerald-800 grid place-items-center font-bold text-xs shrink-0 mt-0.5">
          {activeTrl}
        </span>
        <div className="space-y-0.5">
          <div className="text-sm font-bold text-slate-900">{activeStage.title}</div>
          <p className="text-xs text-slate-600 leading-relaxed">{activeStage.desc}</p>
        </div>
      </div>

      {/* TRL Update Form if editing */}
      {editing && (
        <form
          action={async (formData) => {
            await updateProjectTrlAction(formData);
            setEditing(false);
          }}
          className="p-3.5 rounded-xl bg-brand/5 border border-brand/20 space-y-3 animate-in fade-in"
        >
          <input type="hidden" name="project_id" value={projectId} />
          <div className="text-xs font-bold text-brand-dark uppercase tracking-wider">
            Select New Technology Readiness Level:
          </div>
          <select
            name="trl_level"
            defaultValue={activeTrl}
            className="input text-xs w-full bg-white"
          >
            {TRL_STAGES.map((s) => (
              <option key={s.level} value={s.level}>
                TRL {s.level}: {s.title} ({s.phase})
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-brand text-white font-bold text-xs hover:bg-brand-dark transition shadow-sm min-h-[40px]"
          >
            Save TRL Level
          </button>
        </form>
      )}
    </div>
  );
}
