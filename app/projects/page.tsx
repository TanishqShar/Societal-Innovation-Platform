import Link from "next/link";
import { FolderOpen, Plus, TrendingUp } from "lucide-react";
import { getProjects } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { ProjectStatusBadge } from "@/components/badges";

export const metadata = { title: "Projects · India Innovation Portal" };

export default async function ProjectsPage() {
  const session = await requireRole("university", "admin", "government");
  const projects = await getProjects();

  return (
    <div>
      <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-black/60 mt-1">University-led innovation projects addressing community challenges.</p>
        </div>
        {session.role === "university" && (
          <Link href="/projects/new" className="inline-flex items-center gap-2 rounded-lg bg-brand text-white px-4 py-2.5 font-semibold hover:bg-brand-dark shadow-sm">
            <Plus size={18} /> New Project
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total projects", value: projects.length },
          { label: "Active", value: projects.filter((p) => !["completed"].includes(p.status)).length },
          { label: "Completed", value: projects.filter((p) => p.status === "completed").length },
          { label: "With industry", value: projects.filter((p) => p.industry_partner).length },
        ].map(({ label, value }) => (
          <div key={label} className="card p-4">
            <div className="text-3xl font-bold text-brand">{value}</div>
            <div className="text-sm text-black/50 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Project cards */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {projects.map((project) => (
          <Link key={project.id} href={`/projects/${project.id}`} className="card card-hover p-5 block">
            <div className="flex items-start justify-between gap-2 mb-3">
              <ProjectStatusBadge status={project.status} />
              <span className="text-xs text-black/40">{new Date(project.created_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</span>
            </div>
            <h2 className="font-semibold leading-snug mb-1">{project.title}</h2>
            <p className="text-sm text-black/55 line-clamp-2">{project.description}</p>
            <div className="mt-4 pt-3 border-t border-black/5 space-y-2">
              <div className="flex items-center justify-between text-xs text-black/50">
                <span className="flex items-center gap-1"><TrendingUp size={12} /> {project.university_name}</span>
                <span className="font-medium text-brand">{project.progress}%</span>
              </div>
              <div className="h-1.5 bg-black/10 rounded-full overflow-hidden">
                <div className="h-full bg-brand rounded-full" style={{ width: `${project.progress}%` }} />
              </div>
              {project.industry_partner && (
                <div className="text-xs text-black/40">Industry: {project.industry_partner}</div>
              )}
            </div>
          </Link>
        ))}
        {projects.length === 0 && (
          <div className="col-span-3 card p-12 text-center text-black/40">
            <FolderOpen size={40} className="mx-auto mb-3 text-black/20" />
            No projects yet. Universities create projects from assigned challenges.
          </div>
        )}
      </div>
    </div>
  );
}
