"use client";

import React, { useState } from "react";
import { MessageSquare, Send, User, ShieldCheck, Building2, Factory, GraduationCap, Award, HelpCircle } from "lucide-react";
import type { ProjectDiscussion } from "@/lib/types";
import { addProjectDiscussionAction } from "@/app/actions";

const ROLE_BADGES: Record<string, { label: string; icon: React.ComponentType<{ size: number; className?: string }>; color: string }> = {
  faculty: { label: "Faculty Mentor", icon: GraduationCap, color: "bg-amber-100 text-amber-900 border-amber-200" },
  student: { label: "Student Innovator", icon: Award, color: "bg-blue-100 text-blue-900 border-blue-200" },
  industry: { label: "Industry Advisor", icon: Factory, color: "bg-purple-100 text-purple-900 border-purple-200" },
  government: { label: "Government Line Officer", icon: ShieldCheck, color: "bg-emerald-100 text-emerald-900 border-emerald-200" },
  mentor: { label: "External Mentor", icon: User, color: "bg-slate-100 text-slate-800 border-slate-200" },
};

const MESSAGE_TYPE_LABELS: Record<string, { label: string; color: string }> = {
  update: { label: "Progress Update", color: "text-blue-700 bg-blue-50" },
  guidance: { label: "Technical Mentorship", color: "text-purple-700 bg-purple-50" },
  query: { label: "Student Query", color: "text-amber-700 bg-amber-50" },
  inspection: { label: "Government Inspection", color: "text-emerald-700 bg-emerald-50" },
};

export function ProjectDiscussionFeed({
  discussions = [],
  projectId,
  sessionUser,
  sessionRole,
}: {
  discussions: ProjectDiscussion[];
  projectId: string;
  sessionUser?: string;
  sessionRole?: string;
}) {
  const [message, setMessage] = useState("");
  const defaultRole: "student" | "faculty" | "industry" | "government" =
    sessionRole === "university"
      ? "faculty"
      : sessionRole === "industry"
      ? "industry"
      : sessionRole === "government"
      ? "government"
      : "student";

  return (
    <div className="card p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2 pb-4 border-b border-black/5">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900">
            <MessageSquare size={22} className="text-brand" />
            Stakeholder Collaboration & Mentorship Log
          </h2>
          <p className="text-xs text-black/60 mt-0.5">
            Transparent communication channel between faculty mentors, student teams, industry partners, and government line departments.
          </p>
        </div>
        <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
          {discussions.length} entries recorded
        </span>
      </div>

      {/* Discussion List */}
      <div className="space-y-3">
        {discussions.map((d) => {
          const roleCfg = ROLE_BADGES[d.author_role] ?? ROLE_BADGES.mentor;
          const RoleIcon = roleCfg.icon;
          const typeCfg = MESSAGE_TYPE_LABELS[d.message_type] ?? MESSAGE_TYPE_LABELS.update;

          return (
            <div key={d.id} className="p-4 rounded-xl border border-black/10 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-slate-900">{d.author_name}</span>
                  <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${roleCfg.color}`}>
                    <RoleIcon size={12} /> {roleCfg.label}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${typeCfg.color}`}>
                    {typeCfg.label}
                  </span>
                </div>
                <span className="text-[11px] text-black/40">
                  {new Date(d.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-line pl-1 border-l-2 border-brand/40">
                {d.message}
              </p>
            </div>
          );
        })}

        {discussions.length === 0 && (
          <div className="p-6 text-center text-xs text-black/45 border border-dashed border-slate-300 rounded-xl bg-slate-50">
            No discussion or mentorship logs recorded yet. Post the first update or technical advice below.
          </div>
        )}
      </div>

      {/* Post Discussion Form */}
      <form
        action={async (formData) => {
          await addProjectDiscussionAction(formData);
          setMessage("");
        }}
        className="pt-4 border-t border-black/5 space-y-3"
      >
        <input type="hidden" name="project_id" value={projectId} />

        <div className="grid sm:grid-cols-3 gap-3">
          <label className="block">
            <span className="text-xs font-semibold text-slate-800">Your Name</span>
            <input
              name="author_name"
              required
              defaultValue={sessionUser || ""}
              placeholder="e.g. Dr. R. K. Prasad"
              className="input mt-1 text-xs"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-slate-800">Your Role</span>
            <select name="author_role" defaultValue={defaultRole} className="input mt-1 text-xs">
              <option value="faculty">Faculty Mentor</option>
              <option value="student">Student Innovator</option>
              <option value="industry">Industry Advisor</option>
              <option value="government">Government Officer</option>
              <option value="mentor">External Expert</option>
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-semibold text-slate-800">Message Type</span>
            <select name="message_type" defaultValue="update" className="input mt-1 text-xs">
              <option value="update">Progress Update</option>
              <option value="guidance">Technical Mentorship</option>
              <option value="query">Student Query</option>
              <option value="inspection">Field Inspection</option>
            </select>
          </label>
        </div>

        <label className="block">
          <span className="text-xs font-semibold text-slate-800">Log Entry / Guidance Notes</span>
          <textarea
            name="message"
            required
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Share technical findings, testing logs, mentorship instructions, or ground survey feedback..."
            className="input mt-1 text-xs leading-relaxed"
          />
        </label>

        <button
          type="submit"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg bg-brand text-white font-bold text-xs hover:bg-brand-dark transition shadow-sm min-h-[40px]"
        >
          <Send size={14} /> Post Collaboration Log
        </button>
      </form>
    </div>
  );
}
