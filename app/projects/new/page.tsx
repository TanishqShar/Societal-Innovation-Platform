import Link from "next/link";
import { ArrowLeft, Sparkles, FolderPlus } from "lucide-react";
import { getProblems, getProblemById } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { createProject } from "@/app/actions";

export const metadata = { title: "Create Project · India Innovation Portal" };

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ challenge_id?: string }>;
}) {
  const session = await requireRole("university", "admin");
  const params = await searchParams;
  const preselectedId = params?.challenge_id ?? "";

  const [challenges, preselectedProblem] = await Promise.all([
    getProblems(),
    preselectedId ? getProblemById(preselectedId) : Promise.resolve(null),
  ]);

  const eligible = challenges.filter(
    (c) => ["validated", "assigned", "in_progress"].includes(c.status) || c.id === preselectedId
  );

  const defaultTitle = preselectedProblem
    ? `Solution: ${preselectedProblem.title}`
    : "";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link
        href="/university"
        className="inline-flex items-center gap-1.5 text-sm text-black/50 hover:text-brand transition"
      >
        <ArrowLeft size={14} /> Back to University Workspace
      </Link>

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Create a New Innovation Project</h1>
        <p className="mt-2 text-black/60 leading-relaxed">
          Form a multidisciplinary research & implementation project around an assigned community challenge. You can assemble student-faculty teams and draft solution proposals in the project workspace.
        </p>
      </div>

      <form action={createProject} className="card p-6 md:p-8 space-y-5 bg-white shadow-sm border border-black/10">
        <input type="hidden" name="university_name" value={session.name || "BIT Sindri"} />

        <label className="block">
          <span className="text-sm font-semibold text-slate-900">Linked Community Challenge</span>
          <select
            name="challenge_id"
            required
            defaultValue={preselectedId}
            className="input mt-1.5"
          >
            <option value="">Select a validated / assigned challenge…</option>
            {eligible.map((c) => (
              <option key={c.id} value={c.id}>
                [{c.district}] {c.title} — {c.category}
              </option>
            ))}
          </select>
          {eligible.length === 0 && (
            <p className="text-xs text-amber-600 mt-1">
              No eligible challenges found. Challenges must be validated or assigned first.
            </p>
          )}
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-900">Project Title</span>
          <input
            name="title"
            required
            defaultValue={defaultTitle}
            className="input mt-1.5"
            placeholder="e.g. Smart Water Quality Monitoring & Community Filtration System"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-900">Project Methodology & Approach</span>
          <textarea
            name="description"
            required
            rows={4}
            className="input mt-1.5 leading-relaxed"
            placeholder="Describe the multidisciplinary engineering approach, expected prototype, student learning objectives, and community deployment plan…"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-900">Target Completion Date</span>
          <span className="text-xs text-black/45 ml-2">(Estimated timeline)</span>
          <input name="target_date" type="date" className="input mt-1.5" />
        </label>

        <button
          type="submit"
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-brand text-white px-5 py-3.5 font-bold hover:bg-brand-dark transition shadow-md"
        >
          <FolderPlus size={18} />
          Create Project Workspace
        </button>
      </form>
    </div>
  );
}
