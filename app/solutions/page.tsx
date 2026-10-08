import Link from "next/link";
import {
  ShieldCheck,
  Search,
  Filter,
  Building2,
  MapPin,
  Sparkles,
  Layers,
  ArrowRight,
  ExternalLink,
  Clock,
  Cpu,
  CheckCircle2,
  FolderOpen,
} from "lucide-react";
import { getSolutions } from "@/lib/db";
import { STATES, CATEGORIES, INSTITUTIONS, type Category } from "@/lib/domain";
import { CategoryBadge } from "@/components/badges";

export const metadata = {
  title: "National Solution Repository · India Innovation Portal",
  description:
    "National archive of field-deployed societal engineering blueprints, community defluoridation columns, biochar kilns, and solar cold storages across India.",
};

export default async function SolutionsRepositoryPage({
  searchParams,
}: {
  searchParams: Promise<{
    state?: string;
    domain?: string;
    technology?: string;
    institution?: string;
    stage?: string;
    q?: string;
  }>;
}) {
  const params = await searchParams;
  const stateFilter = params?.state ?? "all";
  const domainFilter = params?.domain ?? "all";
  const techFilter = (params?.technology ?? "").toLowerCase().trim();
  const instFilter = params?.institution ?? "all";
  const stageFilter = params?.stage ?? "all";
  const q = (params?.q ?? "").toLowerCase().trim();

  const allSolutions = await getSolutions();

  // Filter solutions
  const filtered = allSolutions.filter((sol) => {
    if (stateFilter !== "all" && sol.state.toLowerCase() !== stateFilter.toLowerCase()) {
      return false;
    }
    if (domainFilter !== "all" && sol.domain !== domainFilter) {
      return false;
    }
    if (instFilter !== "all" && sol.institution !== instFilter) {
      return false;
    }
    if (stageFilter !== "all" && sol.project_stage.toLowerCase() !== stageFilter.toLowerCase()) {
      return false;
    }
    if (techFilter && !sol.technology.toLowerCase().includes(techFilter)) {
      return false;
    }
    if (q) {
      const matchTitle = sol.title.toLowerCase().includes(q);
      const matchProb = sol.problem_solved.toLowerCase().includes(q);
      const matchTech = sol.technology.toLowerCase().includes(q);
      const matchInst = sol.institution.toLowerCase().includes(q);
      if (!matchTitle && !matchProb && !matchTech && !matchInst) return false;
    }
    return true;
  });

  const uniqueInstitutions = Array.from(new Set(allSolutions.map((s) => s.institution))).sort();
  const uniqueStages = Array.from(new Set(allSolutions.map((s) => s.project_stage))).sort();

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950 text-white p-6 sm:p-10 shadow-lg">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck size={16} />
            <span>National Societal Solutions Repository · Ready for Cross-State Adoption</span>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Proven Technological Blueprints Across India
          </h1>
          <p className="text-white/80 text-sm sm:text-base leading-relaxed">
            Discover peer-reviewed, field-tested innovations developed by higher education institutions and deployed in village panchayats. Filter by state, domain, and technology to adapt proven models in your district.
          </p>
          <div className="pt-1 flex flex-wrap gap-2 text-xs">
            <span className="bg-white/10 px-3 py-1 rounded-full border border-white/15">
              {allSolutions.length} Deployed Solutions Archived
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-400/30">
              5 Participating States
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full border border-white/15">
              100% Real Field Trials
            </span>
          </div>
        </div>
      </section>

      {/* Multi-Filter Bar */}
      <section className="card p-5 space-y-4 bg-white shadow-xs">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-black/5">
          <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
            <Filter size={15} className="text-brand" /> Filter Solution Repository
          </span>
          <span className="text-xs font-semibold text-black/50">
            Showing {filtered.length} of {allSolutions.length} solutions
          </span>
        </div>

        <form method="GET" action="/solutions" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Keyword Search */}
          <div className="sm:col-span-2 relative">
            <Search size={14} className="absolute left-3 top-3 text-black/40" />
            <input
              type="text"
              name="q"
              defaultValue={params?.q ?? ""}
              placeholder="Search problem, tech, institution..."
              className="input pl-8 text-xs w-full"
            />
          </div>

          {/* State Filter */}
          <select name="state" defaultValue={stateFilter} className="input text-xs">
            <option value="all">All States</option>
            {STATES.map((s) => (
              <option key={s} value={s.toLowerCase()}>
                {s}
              </option>
            ))}
          </select>

          {/* Domain Filter */}
          <select name="domain" defaultValue={domainFilter} className="input text-xs">
            <option value="all">All Domains</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Institution Filter */}
          <select name="institution" defaultValue={instFilter} className="input text-xs">
            <option value="all">All Institutions</option>
            {uniqueInstitutions.map((inst) => (
              <option key={inst} value={inst}>
                {inst}
              </option>
            ))}
          </select>

          {/* Deployment Stage */}
          <select name="stage" defaultValue={stageFilter} className="input text-xs">
            <option value="all">All Project Stages</option>
            {uniqueStages.map((st) => (
              <option key={st} value={st.toLowerCase()}>
                {st}
              </option>
            ))}
          </select>

          {/* Submit */}
          <button
            type="submit"
            className="sm:col-span-2 lg:col-span-6 rounded-lg bg-slate-900 hover:bg-black text-white py-2 text-xs font-semibold transition"
          >
            Apply Filters
          </button>
        </form>

        {(stateFilter !== "all" || domainFilter !== "all" || instFilter !== "all" || stageFilter !== "all" || q) && (
          <div className="pt-1 flex items-center justify-between text-xs">
            <span className="text-black/55">Active filter applied.</span>
            <Link href="/solutions" className="text-brand font-semibold hover:underline">
              Reset all filters
            </Link>
          </div>
        )}
      </section>

      {/* Solutions Grid */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center text-black/45 space-y-2">
          <p className="text-sm font-semibold text-slate-800">No solutions matched your current criteria.</p>
          <p className="text-xs">Try selecting 'All States' or resetting your domain and keyword filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((sol) => (
            <div
              key={sol.id}
              className="card p-6 space-y-4 hover:border-brand/40 hover:shadow-md transition flex flex-col justify-between bg-white border-l-4 border-l-brand"
            >
              <div className="space-y-3">
                {/* Badges & Geography */}
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <CategoryBadge category={sol.domain} />
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                      {sol.project_stage}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <MapPin size={11} className="text-brand" /> {sol.district}, {sol.state}
                  </span>
                </div>

                {/* Solution Title */}
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900 leading-snug">
                  {sol.title}
                </h3>

                {/* Problem Solved */}
                <div className="text-xs text-black/70 leading-relaxed bg-slate-50 p-3 rounded-xl border border-black/5">
                  <strong className="text-slate-900 block mb-0.5 font-semibold">Problem Addressed:</strong>
                  {sol.problem_solved}
                </div>

                {/* Specification Table */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-black/60 pt-1">
                  <div className="p-2.5 rounded-lg bg-slate-50">
                    <strong className="text-slate-800 block text-[11px]">Developing Institution:</strong>
                    <span className="font-medium text-slate-900">{sol.institution}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50">
                    <strong className="text-slate-800 block text-[11px]">Core Technology:</strong>
                    <span className="font-medium text-slate-900">{sol.technology}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50">
                    <strong className="text-slate-800 block text-[11px]">Project Timeline:</strong>
                    <span className="font-medium text-slate-900">{sol.project_timeline ?? "6-8 Months"}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50">
                    <strong className="text-slate-800 block text-[11px]">Deployment Status:</strong>
                    <span className="font-medium text-slate-900">{sol.deployment_status}</span>
                  </div>
                </div>

                {/* Measured Civic Impact Banner */}
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5">
                  <ShieldCheck size={18} className="text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-emerald-900 block text-[11px] uppercase tracking-wide">
                      Measured Social Impact
                    </span>
                    <p className="mt-0.5 leading-relaxed">{sol.impact}</p>
                  </div>
                </div>
              </div>

              {/* Action Bottom */}
              <div className="pt-3 border-t border-black/5 flex items-center justify-between text-xs">
                <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 size={12} /> Potentially Reusable Solution
                </span>
                <Link
                  href={`/problems?domain=${encodeURIComponent(sol.domain)}`}
                  className="font-semibold text-brand hover:underline inline-flex items-center gap-1"
                >
                  View Related Challenges <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
