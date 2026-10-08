"use client";

import React, { useState } from "react";
import { Award, Rocket, Plus, ShieldCheck, FileText, CheckCircle2, DollarSign, Users, ExternalLink, Sparkles } from "lucide-react";
import type { PatentRecord, StartupIncubation } from "@/lib/types";
import { addPatentAction, addStartupAction } from "@/app/actions";

const PATENT_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  provisional_filed: { label: "Provisional Filed", color: "bg-blue-50 text-blue-800 border-blue-200" },
  published: { label: "Official Gazette Published", color: "bg-purple-50 text-purple-800 border-purple-200" },
  granted: { label: "Patent Granted ✓", color: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  open_source: { label: "Open-Source Hardware (OSH)", color: "bg-amber-50 text-amber-800 border-amber-200" },
};

const STARTUP_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  ideation: { label: "Pre-Incubation", color: "bg-slate-100 text-slate-800 border-slate-200" },
  incubated: { label: "Formally Incubated", color: "bg-blue-50 text-blue-800 border-blue-200" },
  seed_funded: { label: "Seed Grant Funded", color: "bg-purple-50 text-purple-800 border-purple-200" },
  commercialized: { label: "Revenue & Market Scaled", color: "bg-emerald-50 text-emerald-800 border-emerald-200" },
};

export function IpStartupPanel({
  patents = [],
  startups = [],
  projectId,
  universityName,
  canEdit = false,
}: {
  patents: PatentRecord[];
  startups: StartupIncubation[];
  projectId: string;
  universityName: string;
  canEdit?: boolean;
}) {
  const [showAddPatent, setShowAddPatent] = useState(false);
  const [showAddStartup, setShowAddStartup] = useState(false);

  return (
    <div className="card p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-black/5">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Award size={22} className="text-brand" />
            Intellectual Property & Student Startup Incubation
          </h2>
          <p className="text-xs text-black/60 mt-0.5">
            NEP 2020 innovation outcomes: Institutional patents, intellectual property disclosures, and university spin-off startups.
          </p>
        </div>

        {canEdit && (
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setShowAddPatent(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-black/15 text-slate-800 px-3 py-1.5 text-xs font-semibold hover:bg-slate-50 transition shadow-2xs min-h-[38px]"
            >
              <Plus size={14} /> Log Patent / IP
            </button>
            <button
              type="button"
              onClick={() => setShowAddStartup(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand text-white px-3 py-1.5 text-xs font-semibold hover:bg-brand-dark transition shadow-2xs min-h-[38px]"
            >
              <Rocket size={14} /> Register Startup
            </button>
          </div>
        )}
      </div>

      {/* Part 1: Intellectual Property & Patents */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <FileText size={16} className="text-purple-700" />
            <span>Patents & Design Registrations ({patents.length})</span>
          </h3>
        </div>

        {patents.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {patents.map((pat) => {
              const meta = PATENT_STATUS_LABELS[pat.status] ?? PATENT_STATUS_LABELS.provisional_filed;
              return (
                <div key={pat.id} className="p-4 rounded-xl border border-black/10 bg-slate-50 space-y-2">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-black/10">
                      {pat.patent_number}
                    </span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${meta.color}`}>
                      {meta.label}
                    </span>
                  </div>

                  <div className="font-bold text-sm text-slate-900 leading-snug">
                    {pat.title}
                  </div>

                  {pat.abstract && (
                    <p className="text-xs text-black/60 line-clamp-2 leading-relaxed">
                      {pat.abstract}
                    </p>
                  )}

                  <div className="text-xs text-black/55 pt-1 border-t border-black/5 flex items-center justify-between flex-wrap gap-1">
                    <span className="flex items-center gap-1">
                      <Users size={12} className="text-brand" /> {pat.inventors.join(", ")}
                    </span>
                    <span className="text-[11px] text-black/40">
                      {new Date(pat.filing_date).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-300 text-xs text-black/45 text-center">
            No patents logged yet. University faculty and student teams can log provisional patents or open-source hardware licenses.
          </div>
        )}
      </div>

      {/* Part 2: Incubated Startups */}
      <div className="space-y-3 pt-3 border-t border-black/5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Rocket size={16} className="text-brand" />
            <span>Incubated Student & Faculty Startups ({startups.length})</span>
          </h3>
        </div>

        {startups.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {startups.map((st) => {
              const meta = STARTUP_STATUS_LABELS[st.status] ?? STARTUP_STATUS_LABELS.incubated;
              return (
                <div key={st.id} className="p-4 rounded-xl border border-black/10 bg-gradient-to-br from-white to-brand/[0.02] space-y-2">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <span className="font-bold text-sm text-brand-dark flex items-center gap-1">
                      <Sparkles size={14} className="text-amber-500" />
                      {st.startup_name}
                    </span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${meta.color}`}>
                      {meta.label}
                    </span>
                  </div>

                  <div className="text-xs text-black/70">
                    Incubator: <strong>{st.incubation_center}</strong>
                  </div>

                  {st.dpiit_number && (
                    <div className="text-[11px] font-mono text-black/50">
                      DPIIT Recognition: {st.dpiit_number}
                    </div>
                  )}

                  {st.funding_received && (
                    <div className="text-xs font-bold text-emerald-700 flex items-center gap-0.5">
                      <DollarSign size={13} /> Seed Grant: ₹{st.funding_received.toLocaleString("en-IN")}
                    </div>
                  )}

                  <div className="text-xs text-black/55 pt-1 border-t border-black/5">
                    Founders: <strong>{st.founders.join(", ")}</strong>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-300 text-xs text-black/45 text-center">
            No spin-off startups recorded yet. Working solutions can be commercialized through university incubation cells.
          </div>
        )}
      </div>

      {/* Modal: Add Patent */}
      {showAddPatent && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-lg text-slate-900">Log Patent / IP Disclosure</h3>
            <p className="text-xs text-black/60">
              Record provisional application or design patent generated through this innovation project.
            </p>

            <form
              action={async (formData) => {
                await addPatentAction(formData);
                setShowAddPatent(false);
              }}
              className="space-y-3"
            >
              <input type="hidden" name="project_id" value={projectId} />

              <label className="block">
                <span className="text-xs font-semibold">Patent Title</span>
                <input name="title" required placeholder="e.g. Solar Assisted Water Fluoride Adsorption Reactor" className="input mt-1 text-sm" />
              </label>

              <div className="grid grid-cols-2 gap-2">
                <label className="block">
                  <span className="text-xs font-semibold">Application No.</span>
                  <input name="patent_number" required placeholder="IN-2024/JH/..." className="input mt-1 text-sm" />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold">Status</span>
                  <select name="status" defaultValue="provisional_filed" className="input mt-1 text-sm">
                    <option value="provisional_filed">Provisional Filed</option>
                    <option value="published">Gazette Published</option>
                    <option value="granted">Patent Granted</option>
                    <option value="open_source">Open Source HW</option>
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="text-xs font-semibold">Inventors (comma-separated)</span>
                <input name="inventors" placeholder="Dr. R. K. Prasad, Alok Verma" className="input mt-1 text-sm" />
              </label>

              <label className="block">
                <span className="text-xs font-semibold">Brief Abstract</span>
                <textarea name="abstract" rows={2} placeholder="Summary of novel methodology or engineering utility..." className="input mt-1 text-sm" />
              </label>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-black/5">
                <button
                  type="button"
                  onClick={() => setShowAddPatent(false)}
                  className="px-4 py-2 rounded-lg border text-xs font-medium hover:bg-slate-50 min-h-[40px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-brand text-white font-bold text-xs hover:bg-brand-dark min-h-[40px]"
                >
                  Save Patent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Startup */}
      {showAddStartup && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-lg text-slate-900">Register Incubated Startup</h3>
            <p className="text-xs text-black/60">
              Formally register a student or faculty venture incubated through this project.
            </p>

            <form
              action={async (formData) => {
                await addStartupAction(formData);
                setShowAddStartup(false);
              }}
              className="space-y-3"
            >
              <input type="hidden" name="project_id" value={projectId} />

              <label className="block">
                <span className="text-xs font-semibold">Startup / Enterprise Name</span>
                <input name="startup_name" required placeholder="e.g. JalSutra CleanTech Pvt Ltd" className="input mt-1 text-sm" />
              </label>

              <label className="block">
                <span className="text-xs font-semibold">Incubation Facility</span>
                <input
                  name="incubation_center"
                  required
                  defaultValue={`${universityName} Incubation Cell`}
                  className="input mt-1 text-sm"
                />
              </label>

              <div className="grid grid-cols-2 gap-2">
                <label className="block">
                  <span className="text-xs font-semibold">DPIIT Reg. No. (Optional)</span>
                  <input name="dpiit_number" placeholder="DIPP10293" className="input mt-1 text-sm" />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold">Funding Received (₹)</span>
                  <input name="funding_received" type="number" defaultValue={500000} className="input mt-1 text-sm" />
                </label>
              </div>

              <label className="block">
                <span className="text-xs font-semibold">Founders (comma-separated)</span>
                <input name="founders" placeholder="Alok Verma, Sneha Kumari" className="input mt-1 text-sm" />
              </label>

              <label className="block">
                <span className="text-xs font-semibold">Incubation Stage</span>
                <select name="status" defaultValue="incubated" className="input mt-1 text-sm">
                  <option value="ideation">Pre-Incubation</option>
                  <option value="incubated">Formally Incubated</option>
                  <option value="seed_funded">Seed Grant Funded</option>
                  <option value="commercialized">Commercial Market Scaling</option>
                </select>
              </label>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-black/5">
                <button
                  type="button"
                  onClick={() => setShowAddStartup(false)}
                  className="px-4 py-2 rounded-lg border text-xs font-medium hover:bg-slate-50 min-h-[40px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-brand text-white font-bold text-xs hover:bg-brand-dark min-h-[40px]"
                >
                  Register Venture
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
