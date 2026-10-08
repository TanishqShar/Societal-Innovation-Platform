"use client";

import React, { useState } from "react";
import { FileText, CheckCircle2, Clock, Edit3, Send, ShieldCheck, DollarSign } from "lucide-react";
import type { ProjectProposal, ProposalStatus } from "@/lib/types";
import { ProposalStatusBadge } from "@/components/badges";
import { saveProjectProposalAction, updateProposalStatusAction } from "@/app/actions";

export function ProposalPanel({
  proposal,
  projectId,
  canEdit,
  canApprove,
}: {
  proposal: ProjectProposal | null;
  projectId: string;
  canEdit: boolean;
  canApprove: boolean;
}) {
  const [isEditing, setIsEditing] = useState(!proposal);

  return (
    <div className="card p-6 space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3 pb-4 border-b border-black/5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FileText size={22} className="text-brand" />
              Solution Proposal & Technical Architecture
            </h2>
            {proposal && <ProposalStatusBadge status={proposal.status} />}
          </div>
          <p className="text-sm text-black/60 mt-0.5">
            Formal engineering & societal innovation design plan submitted by the multidisciplinary HEI team.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {canEdit && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium hover:bg-slate-50 transition"
            >
              <Edit3 size={15} /> Edit Proposal
            </button>
          )}

          {canApprove && proposal && proposal.status !== "approved" && (
            <form action={updateProposalStatusAction} className="inline-flex items-center gap-2">
              <input type="hidden" name="project_id" value={projectId} />
              <input type="hidden" name="status" value="approved" />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 text-white px-3.5 py-1.5 text-sm font-semibold hover:bg-emerald-700 shadow-sm transition"
              >
                <ShieldCheck size={16} /> Approve Proposal
              </button>
            </form>
          )}
        </div>
      </div>

      {!isEditing && proposal ? (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-slate-50 border border-black/5 space-y-2">
              <div className="text-xs font-bold text-black/50 uppercase tracking-wider">Problem Statement</div>
              <p className="text-sm text-slate-800 leading-relaxed">{proposal.problem_statement}</p>
            </div>

            <div className="p-4 rounded-xl bg-brand/5 border border-brand/15 space-y-2">
              <div className="text-xs font-bold text-brand uppercase tracking-wider">Proposed Solution</div>
              <p className="text-sm text-slate-800 leading-relaxed font-medium">{proposal.proposed_solution}</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-black/5 bg-white space-y-1">
              <div className="text-xs font-bold text-black/50 uppercase tracking-wider">Technology Stack</div>
              <p className="text-sm font-medium text-slate-800">{proposal.technology}</p>
            </div>

            <div className="p-4 rounded-xl border border-black/5 bg-white space-y-1">
              <div className="text-xs font-bold text-black/50 uppercase tracking-wider">Estimated Project Budget</div>
              <p className="text-lg font-bold text-brand">
                {proposal.expected_cost ? `₹${proposal.expected_cost.toLocaleString("en-IN")}` : "Grant / CSR Sponsored"}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-black/5 bg-white space-y-1">
              <div className="text-xs font-bold text-black/50 uppercase tracking-wider">Submission Date</div>
              <p className="text-sm font-medium text-slate-700">
                {new Date(proposal.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-black/5 space-y-2">
            <div className="text-xs font-bold text-black/50 uppercase tracking-wider">Implementation Plan & Milestones</div>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{proposal.implementation_plan}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white border border-black/10 space-y-1">
              <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Expected Impact</div>
              <p className="text-xs text-slate-700">{proposal.expected_impact}</p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-black/10 space-y-1">
              <div className="text-xs font-bold text-blue-800 uppercase tracking-wider">Scalability Plan</div>
              <p className="text-xs text-slate-700">{proposal.scalability}</p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-black/10 space-y-1">
              <div className="text-xs font-bold text-violet-800 uppercase tracking-wider">Sustainability & Maintenance</div>
              <p className="text-xs text-slate-700">{proposal.sustainability}</p>
            </div>
          </div>
        </div>
      ) : (
        <form
          action={async (formData) => {
            await saveProjectProposalAction(formData);
            setIsEditing(false);
          }}
          className="space-y-4"
        >
          <input type="hidden" name="project_id" value={projectId} />

          <div className="grid md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs font-semibold">Problem Statement</span>
              <textarea
                name="problem_statement"
                required
                rows={3}
                defaultValue={proposal?.problem_statement || ""}
                placeholder="Clarify the root problem from an engineering / implementation perspective..."
                className="input mt-1 text-sm"
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold">Proposed Solution Approach</span>
              <textarea
                name="proposed_solution"
                required
                rows={3}
                defaultValue={proposal?.proposed_solution || ""}
                placeholder="Describe your technical innovation or community intervention..."
                className="input mt-1 text-sm"
              />
            </label>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs font-semibold">Technology Stack / Tools</span>
              <input
                name="technology"
                required
                defaultValue={proposal?.technology || ""}
                placeholder="e.g. IoT ESP32, Solar Inverter, Mobile App, Bio-sensors"
                className="input mt-1 text-sm"
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold">Estimated Budget / Cost (₹)</span>
              <input
                name="expected_cost"
                type="number"
                defaultValue={proposal?.expected_cost || 350000}
                placeholder="350000"
                className="input mt-1 text-sm"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-xs font-semibold">Implementation Plan</span>
            <textarea
              name="implementation_plan"
              required
              rows={3}
              defaultValue={proposal?.implementation_plan || ""}
              placeholder="Phase 1: Lab testing. Phase 2: Field assembly. Phase 3: Community deployment..."
              className="input mt-1 text-sm"
            />
          </label>

          <div className="grid md:grid-cols-3 gap-4">
            <label className="block">
              <span className="text-xs font-semibold">Expected Impact</span>
              <textarea
                name="expected_impact"
                required
                rows={2}
                defaultValue={proposal?.expected_impact || ""}
                placeholder="Quantifiable benefits for citizens..."
                className="input mt-1 text-sm"
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold">Scalability</span>
              <textarea
                name="scalability"
                required
                rows={2}
                defaultValue={proposal?.scalability || ""}
                placeholder="How to replicate across other blocks/districts..."
                className="input mt-1 text-sm"
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold">Sustainability</span>
              <textarea
                name="sustainability"
                required
                rows={2}
                defaultValue={proposal?.sustainability || ""}
                placeholder="Long-term operations and maintenance..."
                className="input mt-1 text-sm"
              />
            </label>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-black/5">
            {proposal && (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-lg border text-sm hover:bg-slate-50 min-h-[44px]"
              >
                Cancel
              </button>
            )}

            <div className="flex flex-wrap items-center gap-2 ml-auto">
              <button
                type="submit"
                name="status"
                value="draft"
                className="px-4 py-2 rounded-lg border border-black/15 bg-white text-sm font-medium hover:bg-slate-50 min-h-[44px]"
              >
                Save as Draft
              </button>
              <button
                type="submit"
                name="status"
                value="submitted"
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand-dark shadow-sm min-h-[44px]"
              >
                <Send size={15} /> Submit for Review
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
