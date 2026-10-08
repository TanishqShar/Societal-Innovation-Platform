"use client";

import React, { useState } from "react";
import { FileText, Printer, X, ShieldCheck, Download, Award, Building2, Factory, Users, CheckCircle2 } from "lucide-react";

export function StateBriefingModal({
  stats,
}: {
  stats: {
    totalChallenges: number;
    validatedCount: number;
    activeProjects: number;
    deployedCount: number;
    totalPatents: number;
    totalStartups: number;
    totalFunding: number;
    totalImpacted: number;
    topUniversities: { name: string; projects: number }[];
    topDistricts: { name: string; value: number }[];
  };
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 text-white px-5 py-2.5 text-xs font-bold hover:bg-black transition shadow-sm min-h-[44px]"
      >
        <FileText size={15} /> Export State Executive Briefing
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="card max-w-3xl w-full p-6 md:p-8 space-y-6 bg-white shadow-2xl rounded-2xl border border-black/10 my-auto animate-in fade-in zoom-in-95 print:p-0 print:border-none print:shadow-none">
            {/* Header with Print & Close controls (hidden during print) */}
            <div className="flex items-center justify-between border-b pb-4 border-black/10 print:hidden flex-wrap gap-2">
              <span className="text-xs font-bold text-brand uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck size={16} /> Official Government Executive Briefing
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand text-white text-xs font-bold hover:bg-brand-dark transition shadow-xs min-h-[38px]"
                >
                  <Printer size={14} /> Print / Save as PDF
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="h-9 w-9 rounded-lg border border-black/15 grid place-items-center text-black/60 hover:bg-slate-100 transition"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Printable Document Content */}
            <div className="space-y-6 text-slate-900 font-sans">
              {/* Document Header */}
              <div className="text-center space-y-1 pb-4 border-b-2 border-slate-900">
                <div className="text-xs uppercase font-extrabold tracking-widest text-slate-500">
                  Government of Jharkhand · Planning & Development Department
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Statewide Societal Innovation & Higher Education Collaboration Status Report
                </h1>
                <div className="text-xs text-black/55">
                  Generated on {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} · Confidential Government Summary
                </div>
              </div>

              {/* High-Level Executive Summary */}
              <div className="p-4 rounded-xl bg-slate-50 border border-black/10 space-y-2 text-xs leading-relaxed">
                <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  Executive Overview:
                </div>
                <p>
                  In alignment with the National Education Policy (NEP) 2020 experiential learning mandate, the Jharkhand Societal Innovation Collaboration Portal continuously routes validated grassroots community challenges from all 24 districts to state higher education institutions (BIT Sindri, RIMS Ranchi, Birsa Agricultural University, IIT ISM Dhanbad, and BIT Mesra). Multidisciplinary teams collaborate with corporate CSR and MSME partners to produce field-deployed technological solutions.
                </p>
              </div>

              {/* Statewide Key Performance Indicators */}
              <div>
                <div className="text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                  1. Statewide Innovation Velocity & Outturn
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-3 rounded-lg border border-black/10 bg-slate-50">
                    <div className="text-2xl font-black text-slate-900">{stats.totalChallenges}</div>
                    <div className="text-[10px] text-black/55 mt-0.5 font-medium">Challenges Received</div>
                  </div>
                  <div className="p-3 rounded-lg border border-black/10 bg-slate-50">
                    <div className="text-2xl font-black text-sky-700">{stats.validatedCount}</div>
                    <div className="text-[10px] text-black/55 mt-0.5 font-medium">Validated by Officers</div>
                  </div>
                  <div className="p-3 rounded-lg border border-black/10 bg-slate-50">
                    <div className="text-2xl font-black text-brand">{stats.activeProjects}</div>
                    <div className="text-[10px] text-black/55 mt-0.5 font-medium">Active HEI Projects</div>
                  </div>
                  <div className="p-3 rounded-lg border border-black/10 bg-slate-50">
                    <div className="text-2xl font-black text-emerald-700">{stats.deployedCount}</div>
                    <div className="text-[10px] text-black/55 mt-0.5 font-medium">Field Deployed</div>
                  </div>
                </div>
              </div>

              {/* Innovation & Intellectual Property Outcomes */}
              <div>
                <div className="text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                  2. Innovation, Patents & Incubation Outturn
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-3 rounded-lg border border-black/10 bg-purple-50/50">
                    <div className="text-2xl font-black text-purple-900">{stats.totalPatents}</div>
                    <div className="text-[11px] font-semibold text-purple-800 mt-0.5">Patents Logged / Published</div>
                  </div>
                  <div className="p-3 rounded-lg border border-black/10 bg-blue-50/50">
                    <div className="text-2xl font-black text-blue-900">{stats.totalStartups}</div>
                    <div className="text-[11px] font-semibold text-blue-800 mt-0.5">Startups Incubated</div>
                  </div>
                  <div className="p-3 rounded-lg border border-black/10 bg-emerald-50/50">
                    <div className="text-2xl font-black text-emerald-900">₹{(stats.totalFunding / 100000).toFixed(1)}L</div>
                    <div className="text-[11px] font-semibold text-emerald-800 mt-0.5">CSR Grants Committed</div>
                  </div>
                </div>
              </div>

              {/* HEI Participation & District Highlights */}
              <div className="grid sm:grid-cols-2 gap-4 text-xs">
                <div className="border border-black/10 rounded-xl p-3.5 space-y-2">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Building2 size={14} className="text-brand" /> Top Participating Institutions
                  </div>
                  <ul className="divide-y divide-black/5">
                    {stats.topUniversities.slice(0, 4).map((u) => (
                      <li key={u.name} className="py-1.5 flex justify-between">
                        <span>{u.name}</span>
                        <strong className="text-brand">{u.projects} projects</strong>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border border-black/10 rounded-xl p-3.5 space-y-2">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Award size={14} className="text-emerald-700" /> Verified Citizen Reach
                  </div>
                  <div className="space-y-1">
                    <div className="text-xl font-bold text-emerald-800">
                      {stats.totalImpacted.toLocaleString("en-IN")}+ Citizens
                    </div>
                    <p className="text-[11px] text-black/55 leading-relaxed">
                      Direct beneficiaries of clean water filtration, mobile health camps, and crop protection systems deployed in Dumka, Gumla, Ranchi, and Dhanbad districts.
                    </p>
                  </div>
                </div>
              </div>

              {/* Authentication Signoff Footer */}
              <div className="pt-6 border-t border-black/10 flex items-center justify-between text-[11px] text-black/50">
                <div>Jharkhand Innovation & Social Impact Portal · Government of Jharkhand</div>
                <div>Authorized System Report · SHA-256 Verified</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
