import Link from "next/link";
import {
  Plus,
  Search,
  ArrowRight,
  User,
  CheckCircle2,
  Building2,
  Star,
  Sparkles,
  ShieldCheck,
  FolderOpen,
  Layers,
  MapPin,
} from "lucide-react";
import { getProblems, getImpactMetrics, getProjects, getSolutions } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { StatusBadge, CategoryBadge, PriorityBadge } from "@/components/badges";
import { CATEGORIES, STATES, STATE_DISTRICTS } from "@/lib/domain";
import { ActivityFeed } from "@/components/activity-feed";
import { SDGBadges } from "@/components/sdg-policy-badge";

export const metadata = { title: "Citizen Workspace · India Innovation Portal" };

const STATE_PREFIX_MAP: Record<string, string> = {
  Jharkhand: "JH",
  Punjab: "PB",
  Maharashtra: "MH",
  Karnataka: "KA",
  Rajasthan: "RJ",
};

export default async function CitizenPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    status?: string;
    domain?: string;
    state?: string;
    district?: string;
    sort?: string;
  }>;
}) {
  const session = await getSession();
  const params = await searchParams;
  const q = (params?.q ?? "").toLowerCase().trim();
  const statusFilter = params?.status ?? "all";
  const domainFilter = params?.domain ?? "all";
  const stateFilter = params?.state ?? "all";
  const districtFilter = params?.district ?? "all";
  const sort = params?.sort ?? "newest";

  const availableDistricts =
    stateFilter !== "all" && stateFilter in STATE_DISTRICTS
      ? STATE_DISTRICTS[stateFilter as keyof typeof STATE_DISTRICTS]
      : Object.values(STATE_DISTRICTS).flat();

  const [allProblems, impactList, allProjects, allSolutions] = await Promise.all([
    getProblems(),
    getImpactMetrics(),
    getProjects(),
    getSolutions(),
  ]);

  // Filter problems
  const filtered = allProblems.filter((p) => {
    const itemState = p.state ?? "Jharkhand";
    if (q) {
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchId = p.id.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchId) return false;
    }
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (stateFilter !== "all" && itemState !== stateFilter) return false;
    if (domainFilter !== "all" && p.category !== domainFilter) return false;
    if (districtFilter !== "all" && p.district !== districtFilter) return false;
    return true;
  });

  // Sort problems
  filtered.sort((a, b) => {
    if (sort === "oldest") return a.created_at.localeCompare(b.created_at);
    if (sort === "priority") {
      const pMap: Record<string, number> = { Critical: 4, High: 3, Medium: 2, Low: 1 };
      return (pMap[b.priority ?? "Low"] ?? 0) - (pMap[a.priority ?? "Low"] ?? 0);
    }
    return b.created_at.localeCompare(a.created_at);
  });

  // Database Counts
  const totalCount = allProblems.length;
  const underReviewCount = allProblems.filter(
    (p) => p.status === "under_review" || p.status === "submitted"
  ).length;
  const assignedCount = allProblems.filter(
    (p) => p.status === "assigned" || p.status === "validated"
  ).length;
  const inProgressCount = allProblems.filter((p) => p.status === "in_progress").length;
  const resolvedCount = allProblems.filter(
    (p) => p.status === "completed" || p.status === "deployed"
  ).length;

  // Impact metrics aggregation
  const totalPeople = impactList.reduce((s, i) => s + i.people_impacted, 0);
  const totalCost = impactList.reduce((s, i) => s + (i.cost_saved ?? 0), 0);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 text-sm font-medium text-brand">
            <User size={16} />
            <span>Citizen Innovation Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Community Challenges &amp; Civic Voice</h1>
          <p className="text-black/60 mt-1 max-w-2xl text-sm leading-relaxed">
            Track societal challenges reported across India — Jharkhand, Punjab, Maharashtra, Karnataka &amp; Rajasthan. Transparent status updates from initial Gemini AI review to institution project deployment.
          </p>
        </div>

        <Link
          href="/submit"
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 font-bold text-slate-900 text-sm hover:brightness-110 shadow-md transition"
        >
          <Plus size={18} /> Report a Community Problem
        </Link>
      </div>

      {/* KPI Tiles Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="card p-4 text-center bg-white space-y-0.5">
          <span className="text-xs text-black/50 font-medium">All Challenges</span>
          <div className="text-2xl font-black text-slate-900">{totalCount}</div>
          <div className="text-[10px] text-black/40">Reported</div>
        </div>
        <div className="card p-4 text-center bg-white space-y-0.5">
          <span className="text-xs text-black/50 font-medium">Under AI Review</span>
          <div className="text-2xl font-black text-amber-600">{underReviewCount}</div>
          <div className="text-[10px] text-black/40">Awaiting routing</div>
        </div>
        <div className="card p-4 text-center bg-white space-y-0.5">
          <span className="text-xs text-black/50 font-medium">Assigned to HEIs</span>
          <div className="text-2xl font-black text-brand">{assignedCount}</div>
          <div className="text-[10px] text-black/40">Faculty Matched</div>
        </div>
        <div className="card p-4 text-center bg-white space-y-0.5">
          <span className="text-xs text-black/50 font-medium">Active R&amp;D</span>
          <div className="text-2xl font-black text-purple-700">{inProgressCount}</div>
          <div className="text-[10px] text-black/40">Student Teams</div>
        </div>
        <div className="card p-4 text-center bg-white space-y-0.5 col-span-2 sm:col-span-1">
          <span className="text-xs text-black/50 font-medium">Resolved / Deployed</span>
          <div className="text-2xl font-black text-emerald-700">{resolvedCount}</div>
          <div className="text-[10px] text-black/40">Village pilots</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card p-4 sm:p-5 bg-white space-y-3">
        <form method="GET" action="/citizen" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-2.5">
          <div className="sm:col-span-2 relative">
            <Search size={15} className="absolute left-3 top-3 text-black/40" />
            <input
              type="text"
              name="q"
              defaultValue={params?.q ?? ""}
              placeholder="Search challenge headline or location..."
              className="input pl-9 text-xs w-full"
            />
          </div>

          <select name="state" defaultValue={stateFilter} className="input text-xs">
            <option value="all">All States</option>
            {STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select name="district" defaultValue={districtFilter} className="input text-xs">
            <option value="all">All Districts</option>
            {availableDistricts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <select name="domain" defaultValue={domainFilter} className="input text-xs">
            <option value="all">All Domains</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="rounded-lg bg-slate-900 text-white py-2 text-xs font-semibold hover:bg-black transition min-h-[38px]"
          >
            Apply Filters
          </button>
        </form>
      </div>

      {/* Main content: Challenges list + Activity sidebar */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Challenges Cards */}
        <div className="lg:col-span-2 card overflow-hidden bg-white">
          <div className="p-4 border-b border-black/5 bg-slate-50 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-800">
              Showing {filtered.length} of {allProblems.length} community challenges
            </span>
            {(q || statusFilter !== "all" || domainFilter !== "all" || stateFilter !== "all" || districtFilter !== "all") && (
              <Link href="/citizen" className="text-xs text-brand hover:underline font-medium">
                Clear all filters
              </Link>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="p-12 text-center text-black/40 space-y-1">
              <p className="text-sm font-medium text-black/60">No challenges matched your query.</p>
              <p className="text-xs">Try resetting the filters or report a new problem in your area.</p>
            </div>
          ) : (
            <div className="divide-y divide-black/5">
              {filtered.map((problem) => {
                const itemState = problem.state ?? "Jharkhand";
                const prefix = STATE_PREFIX_MAP[itemState] ?? "IN";
                const displayId = prefix + "-" + problem.id.replace(/[^a-zA-Z0-9]/g, "").slice(0, 5).toUpperCase();
                const linkedProject = allProjects.find((pr) => pr.challenge_id === problem.id);
                const linkedSolution = allSolutions.find(
                  (sol) => sol.domain === problem.category && sol.state.toLowerCase() === itemState.toLowerCase()
                );

                return (
                  <div
                    key={problem.id}
                    className="p-5 hover:bg-slate-50/75 transition space-y-3"
                  >
                    {/* Header Row */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          #{displayId}
                        </span>
                        <CategoryBadge category={problem.category} />
                        <StatusBadge status={problem.status} />
                        {problem.priority && <PriorityBadge priority={problem.priority} />}
                      </div>
                      <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <MapPin size={11} className="text-brand" /> {problem.district}, {itemState}
                      </span>
                    </div>

                    {/* Challenge Title */}
                    <Link
                      href={`/challenges/${problem.id}`}
                      className="text-base font-bold text-slate-900 hover:text-brand hover:underline leading-snug block"
                    >
                      {problem.title}
                    </Link>

                    {/* Description */}
                    <p className="text-xs text-black/65 line-clamp-2 leading-relaxed">
                      {problem.description}
                    </p>

                    {/* SDG Tags */}
                    <SDGBadges category={problem.category} />

                    {/* 1. Gemini AI Analysis Pill */}
                    <div className="p-2.5 rounded-lg bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-950 flex items-start gap-2">
                      <Sparkles size={14} className="text-indigo-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Gemini AI Analysis:</strong> Priority {problem.priority ?? "Normal"} (Score {problem.priority_score ?? 75}/100) · Subcategory: {problem.subcategory || problem.category}
                      </div>
                    </div>

                    {/* 2. Matched Institution & Project Progress */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-black/5">
                        <span className="text-black/50 block text-[11px]">Matched Higher Education Institution:</span>
                        <strong className="text-slate-900 flex items-center gap-1 mt-0.5">
                          <Building2 size={12} className="text-brand" />
                          {problem.assigned_to || "Algorithm Routing..."}
                        </strong>
                      </div>

                      <div className="p-2.5 rounded-lg bg-slate-50 border border-black/5">
                        <span className="text-black/50 block text-[11px]">Innovation Project Status:</span>
                        {linkedProject ? (
                          <span className="text-brand font-bold flex items-center gap-1 mt-0.5">
                            <FolderOpen size={12} />
                            TRL {linkedProject.trl_level ?? 3}/9 ({linkedProject.status})
                          </span>
                        ) : (
                          <span className="text-amber-700 font-medium mt-0.5 block">
                            Awaiting institution team formation
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 3. Final Solution & Feedback row */}
                    {(problem.status === "deployed" || problem.status === "completed" || linkedSolution) && (
                      <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
                        <ShieldCheck size={15} className="text-emerald-700 shrink-0 mt-0.5" />
                        <div>
                          <strong>Verified Societal Solution:</strong>{" "}
                          {linkedSolution ? linkedSolution.title : "Community pilot successfully deployed"}
                        </div>
                      </div>
                    )}

                    {/* Footer Row */}
                    <div className="flex items-center justify-between text-xs text-black/50 pt-2 border-t border-black/5 flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <span>Reported: {new Date(problem.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                        {problem.village_ward && <span>Area: {problem.village_ward}</span>}
                      </div>

                      <div className="flex items-center gap-3">
                        <Link
                          href={`/challenges/${problem.id}`}
                          className="font-semibold text-brand hover:underline inline-flex items-center gap-1"
                        >
                          View Full AI Analysis, Similar Issues &amp; Solutions <ArrowRight size={13} />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Activity Feed Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="card p-5 bg-white space-y-3">
            <h3 className="font-bold text-sm text-slate-900">Civic Assurance &amp; Oversight</h3>
            <p className="text-xs text-black/60 leading-relaxed">
              Every challenge submitted by citizens is protected by public auditability. Gemini AI assists district authorities in prioritizing acute community hazards, water contamination, and agricultural distress.
            </p>
            <div className="p-3 rounded-xl bg-slate-50 border border-black/5 text-xs text-slate-700 space-y-1">
              <div><strong>Active States:</strong> 5 (Jharkhand, PB, MH, KA, RJ)</div>
              <div><strong>Average AI Turnaround:</strong> Instant (&lt; 2 seconds)</div>
              <div><strong>Institutional Routing:</strong> Automated multi-factor</div>
            </div>
          </div>

          <div className="card p-5 bg-white">
            <ActivityFeed />
          </div>
        </div>
      </div>
    </div>
  );
}
