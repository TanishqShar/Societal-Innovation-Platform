"use client";

import React, { useState } from "react";
import { Users, Plus, Trash2, GraduationCap, Briefcase, Award } from "lucide-react";
import type { ProjectMember } from "@/lib/types";
import { addProjectMemberAction, removeProjectMemberAction } from "@/app/actions";

const COMMON_DEPARTMENTS = [
  "Computer Science & Engineering",
  "Civil & Environmental Engineering",
  "Electronics & IoT",
  "Mechanical Engineering",
  "Chemical & Materials Engineering",
  "Agricultural Engineering",
  "Medicine & Public Health",
  "Public Policy & Economics",
  "Social Work & Rural Development",
];

export function TeamBuilder({
  members,
  projectId,
  universityName,
  canEdit,
}: {
  members: ProjectMember[];
  projectId: string;
  universityName: string;
  canEdit: boolean;
}) {
  const [showAddModal, setShowAddModal] = useState(false);

  const facultyMembers = members.filter((m) => m.role === "faculty");
  const studentMembers = members.filter((m) => m.role === "student");
  const partnerMembers = members.filter((m) => m.role === "industry" || m.role === "mentor" || m.role === "government");

  return (
    <div className="card p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Users size={22} className="text-brand" />
            Multidisciplinary Innovation Team ({members.length})
          </h2>
          <p className="text-sm text-black/60 mt-0.5">
            Student-faculty cross-department collaboration aligned with NEP 2020 experiential learning.
          </p>
        </div>

        {canEdit && (
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand text-white px-3.5 py-2 text-sm font-medium hover:bg-brand-dark transition shadow-sm"
          >
            <Plus size={16} /> Add Team Member
          </button>
        )}
      </div>

      {/* Multidisciplinary Team Composition Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center gap-3">
          <span className="h-9 w-9 rounded-lg bg-amber-200/60 text-amber-900 grid place-items-center">
            <GraduationCap size={18} />
          </span>
          <div>
            <div className="text-lg font-bold text-amber-950">{facultyMembers.length}</div>
            <div className="text-amber-800">Faculty Mentors</div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center gap-3">
          <span className="h-9 w-9 rounded-lg bg-blue-200/60 text-blue-900 grid place-items-center">
            <Award size={18} />
          </span>
          <div>
            <div className="text-lg font-bold text-blue-950">{studentMembers.length}</div>
            <div className="text-blue-800">Student Innovators</div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center gap-3">
          <span className="h-9 w-9 rounded-lg bg-emerald-200/60 text-emerald-900 grid place-items-center">
            <Briefcase size={18} />
          </span>
          <div>
            <div className="text-lg font-bold text-emerald-950">{partnerMembers.length}</div>
            <div className="text-emerald-800">Industry / Advisors</div>
          </div>
        </div>
      </div>

      {/* Team Members List */}
      <div className="divide-y divide-black/5 border border-black/10 rounded-xl overflow-hidden bg-white">
        {members.map((member, i) => {
          const isFaculty = member.role === "faculty";
          const isStudent = member.role === "student";

          return (
            <div
              key={member.id || `${member.name}-${i}`}
              className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50/75 transition"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`h-10 w-10 rounded-xl grid place-items-center text-sm font-bold shrink-0 ${
                    isFaculty
                      ? "bg-amber-100 text-amber-900 ring-1 ring-amber-300"
                      : isStudent
                      ? "bg-blue-100 text-blue-900 ring-1 ring-blue-300"
                      : "bg-emerald-100 text-emerald-900 ring-1 ring-emerald-300"
                  }`}
                >
                  {member.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-sm truncate flex items-center gap-2">
                    {member.name}
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-medium capitalize ${
                        isFaculty
                          ? "bg-amber-100 text-amber-800"
                          : isStudent
                          ? "bg-blue-100 text-blue-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {member.role}
                    </span>
                  </div>
                  <div className="text-xs text-black/55 mt-0.5 flex items-center gap-2 flex-wrap">
                    {member.department && (
                      <span className="font-medium text-slate-700">{member.department}</span>
                    )}
                    {member.organisation && (
                      <span className="text-black/40">· {member.organisation}</span>
                    )}
                  </div>
                </div>
              </div>

              {canEdit && (
                <form action={removeProjectMemberAction}>
                  <input type="hidden" name="project_id" value={projectId} />
                  <input type="hidden" name="name" value={member.name} />
                  <button
                    type="submit"
                    className="text-black/35 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition"
                    title="Remove member"
                  >
                    <Trash2 size={16} />
                  </button>
                </form>
              )}
            </div>
          );
        })}

        {members.length === 0 && (
          <div className="p-8 text-center text-black/40 text-sm">
            No team members added yet. Build your multidisciplinary team with faculty mentors and student researchers.
          </div>
        )}
      </div>

      {/* Add Member Modal Dialog */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="font-bold text-lg">Add Multidisciplinary Team Member</h3>
            <p className="text-xs text-black/60">
              Involve students and mentors from various disciplines (CSE, Civil, Mechanical, Environmental, etc.).
            </p>

            <form
              action={async (formData) => {
                await addProjectMemberAction(formData);
                setShowAddModal(false);
              }}
              className="space-y-3"
            >
              <input type="hidden" name="project_id" value={projectId} />
              <input type="hidden" name="organisation" value={universityName} />

              <label className="block">
                <span className="text-xs font-semibold">Full Name</span>
                <input
                  name="name"
                  required
                  placeholder="e.g. Alok Verma / Dr. R. K. Prasad"
                  className="input mt-1 text-sm"
                />
              </label>

              <label className="block">
                <span className="text-xs font-semibold">Role</span>
                <select name="role" required className="input mt-1 text-sm">
                  <option value="student">Student Innovator / Researcher</option>
                  <option value="faculty">Faculty Mentor</option>
                  <option value="mentor">External Expert / Mentor</option>
                  <option value="industry">Industry Liaison</option>
                </select>
              </label>

              <label className="block">
                <span className="text-xs font-semibold">Department / Discipline</span>
                <input
                  name="department"
                  list="departments"
                  required
                  placeholder="e.g. Civil & Environmental Engineering"
                  className="input mt-1 text-sm"
                />
                <datalist id="departments">
                  {COMMON_DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept} />
                  ))}
                </datalist>
              </label>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border text-sm hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-brand text-white font-medium text-sm hover:bg-brand-dark"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
