import Link from "next/link";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  Database,
  Sparkles,
  ShieldCheck,
  FolderOpen,
  Plus,
  Filter,
  BarChart3,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { getProblems, usingSupabase } from "@/lib/db";
import {
  CHALLENGE_STATUSES,
  CHALLENGE_STATUS_LABELS,
  routeToUniversity,
  STATES,
  CATEGORIES,
  PRIORITIES,
  STATE_DISTRICTS,
  INSTITUTIONS,
} from "@/lib/domain";
import { setStatus, assignProblem, validateChallenge } from "@/app/actions";
import { StatusBadge, CategoryBadge, PriorityBadge } from "@/components/badges";
import { getSession, ROLE_LABELS, hasRole } from "@/lib/auth";

export const metadata = { title: "Dashboard · India Innovation Portal" };

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: Promise<{
    status?: string;
    state?: string;
    district?: string;
    domain?: string;
    priority?: string;
    institution?: string;
  }>;
}) {
  const session = await getSession();
  if (!session || session.role === "citizen" || session.role === "industry") {
    redirect("/login");
  }

  const params = (await searchParams) || {};
  const activeStatus = typeof params?.status === "string" ? params.status : "";
  const filterState = typeof params?.state === "string" && params.state !== "all" ? params.state : "";
  const filterDistrict = typeof params?.district === "string" && params.district !== "all" ? params.district : "";
  const filterDomain = typeof params?.domain === "string" && params.domain !== "all" ? params.domain : "";
  const filterPriority = typeof params?.priority === "string" && params.priority !== "all" ? params.priority : "";
  const filterInstitution = typeof params?.institution === "string" && params.institution !== "all" ? params.institution : "";

  const all = await getProblems();

  // Multi-filter matching: State, District, Domain, Priority, Status, Institution
  const problems = all.filter((p) => {
    if (activeStatus && p.status !== activeStatus) return false;
    if (filterState && (p.state ?? "Jharkhand") !== filterState) return false;
    if (filterDistrict && p.district !== filterDistrict) return false;
    if (filterDomain && p.category !== filterDomain) return false;
    if (filterPriority && p.priority !== filterPriority) return false;
    if (filterInstitution && p.assigned_to !== filterInstitution) return false;
    return true;
  });

  const canValidate = hasRole(session, "admin", "government");
  const canAssign = hasRole(session, "admin", "government", "university");

  const count = (s: string) => all.filter((p) => {
    if (filterState && (p.state ?? "Jharkhand") !== filterState) return false;
    return p.status === s;
  }).length;

  const availableDistricts = filterState
    ? (STATE_DISTRICTS[filterState as keyof typeof STATE_DISTRICTS] ?? [])
    : Object.values(STATE_DISTRICTS).flat();

  const uniqueInstitutions = Array.from(new Set(INSTITUTIONS.map((i) => i.name))).sort();

  return (
    <div>
      <div className="flex items-start justify-between flex-wrap gap-3 mb-6">
        <div className="flex items-start gap-3">
          <span className="h-11 w-11 rounded-xl bg-brand/10 text-brand grid place-items-center">
            <LayoutDashboard size={22} />
          </span>
          <div>
            <h1 className="text-2xl font-bold">
              {session.role === "university" ? "University Workspace" : "Admin & Government Command Hub"}
            </h1>
            <p className="text-black/60 text-sm">
              Signed in as{" "}
              <strong>{session.name}</strong> · {ROLE_LABELS[session.role]}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/analytics"
            className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold hover:border-brand text-slate-700 shadow-xs"
          >
            <BarChart3 size={14} className="text-brand" /> Command Center Analytics
          </Link>
          <span
            className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full ring-1 ring-inset ${
              usingSupabase()
                ? "bg-green-50 text-green-800 ring-green-200"
                : "bg-amber-50 text-amber-800 ring-amber-200"
            }`}
          >
            <Database size={13} />
            {usingSupabase() ? "Live database" : "Demo data (local)"}
          </span>
          {hasRole(session, "university") && (
            <Link href="/projects/new" className="inline-flex items-center gap-1.5 rounded-lg bg-brand text-white px-3 py-1.5 text-xs font-medium hover:bg-brand-dark">
              <Plus size={15} /> New Project
            </Link>
          )}
        </div>
      </div>

      {/* Summary status tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3 mb-6">
        <FilterTile
          label="All"
          value={filterState ? all.filter((p) => (p.state ?? "Jharkhand") === filterState).length : all.length}
          active={activeStatus === ""}
          href={`/dashboard?${new URLSearchParams({
            ...(filterState && { state: filterState }),
            ...(filterDistrict && { district: filterDistrict }),
            ...(filterDomain && { domain: filterDomain }),
            ...(filterPriority && { priority: filterPriority }),
            ...(filterInstitution && { institution: filterInstitution }),
          }).toString()}`}
        />
        {CHALLENGE_STATUSES.map((s) => (
          <FilterTile
            key={s}
            label={CHALLENGE_STATUS_LABELS[s]}
            value={count(s)}
            active={activeStatus === s}
            href={`/dashboard?${new URLSearchParams({
              status: s,
              ...(filterState && { state: filterState }),
              ...(filterDistrict && { district: filterDistrict }),
              ...(filterDomain && { domain: filterDomain }),
              ...(filterPriority && { priority: filterPriority }),
              ...(filterInstitution && { institution: filterInstitution }),
            }).toString()}`}
          />
        ))}
      </div>

      {/* Government Multi-Filter Bar: State, District, Domain, Priority, Status, Institution */}
      <div className="card p-4 sm:p-5 mb-6 bg-slate-50 border-black/10">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-brand" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Government Administrative Filters
            </span>
          </div>
          {(filterState || filterDistrict || filterDomain || filterPriority || filterInstitution || activeStatus) && (
            <Link href="/dashboard" className="text-xs text-red-600 hover:underline font-semibold">
              Reset Filters
            </Link>
          )}
        </div>

        <form method="GET" action="/dashboard" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {activeStatus && <input type="hidden" name="status" value={activeStatus} />}

          {/* 1. State */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">State</label>
            <select
              name="state"
              defaultValue={filterState || "all"}
              className="input text-xs w-full bg-white"
            >
              <option value="all">All States</option>
              {STATES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* 2. District */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">District</label>
            <select
              name="district"
              defaultValue={filterDistrict || "all"}
              className="input text-xs w-full bg-white"
            >
              <option value="all">All Districts</option>
              {availableDistricts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Domain */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Domain</label>
            <select
              name="domain"
              defaultValue={filterDomain || "all"}
              className="input text-xs w-full bg-white"
            >
              <option value="all">All Domains</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Priority */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Priority</label>
            <select
              name="priority"
              defaultValue={filterPriority || "all"}
              className="input text-xs w-full bg-white"
            >
              <option value="all">All Priorities</option>
              {PRIORITIES.map((pr) => (
                <option key={pr} value={pr}>
                  {pr}
                </option>
              ))}
            </select>
          </div>

          {/* 5. Status */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Status</label>
            <select
              name="status"
              defaultValue={activeStatus || "all"}
              className="input text-xs w-full bg-white"
            >
              <option value="all">All Statuses</option>
              {CHALLENGE_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {CHALLENGE_STATUS_LABELS[st]}
                </option>
              ))}
            </select>
          </div>

          {/* 6. Institution */}
          <div className="flex flex-col justify-between">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Institution</label>
              <select
                name="institution"
                defaultValue={filterInstitution || "all"}
                className="input text-xs w-full bg-white"
              >
                <option value="all">All Institutions</option>
                {uniqueInstitutions.map((inst) => (
                  <option key={inst} value={inst}>
                    {inst}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="mt-2 w-full py-1.5 bg-brand hover:bg-brand-dark text-white rounded-md text-xs font-semibold transition"
            >
              Filter
            </button>
          </div>
        </form>
      </div>

      <div className="card overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-black/50 bg-slate-50 border-b border-black/10">
                <th className="p-3 font-medium">Challenge</th>
                <th className="p-3 font-medium">Domain</th>
                <th className="p-3 font-medium">Priority</th>
                <th className="p-3 font-medium">State & District</th>
                <th className="p-3 font-medium">Assigned Institution</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {problems.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-black/5 align-top hover:bg-slate-50/60"
                >
                  <td className="p-3 max-w-xs">
                    <Link href={`/challenges/${p.id}`} className="font-medium hover:text-brand hover:underline underline-offset-2">
                      {p.title}
                    </Link>
                    <div className="text-xs text-black/50 line-clamp-2 mt-0.5">
                      {p.description}
                    </div>
                  </td>
                  <td className="p-3">
                    <CategoryBadge category={p.category} />
                  </td>
                  <td className="p-3">
                    {p.priority ? <PriorityBadge priority={p.priority} /> : <span className="text-black/30 text-xs">—</span>}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <div className="text-slate-800 font-medium text-xs">{p.district}</div>
                    <div className="text-slate-500 text-[11px]">{p.state ?? "Jharkhand"}</div>
                  </td>
                  <td className="p-3">
                    {p.assigned_to ? (
                      <span className="text-brand-dark font-medium text-xs">{p.assigned_to}</span>
                    ) : canAssign ? (
                      <form action={assignProblem}>
                        <input type="hidden" name="id" value={p.id} />
                        <input type="hidden" name="category" value={p.category} />
                        <input type="hidden" name="state" value={p.state ?? "Jharkhand"} />
                        <button
                          className="inline-flex items-center gap-1 rounded-md bg-brand/10 text-brand-dark px-2.5 py-1 text-xs font-medium hover:bg-brand/20"
                          title={`Suggest: ${routeToUniversity(p.category, p.state ?? "Jharkhand")}`}
                        >
                          <Sparkles size={12} /> Auto-assign
                        </button>
                      </form>
                    ) : (
                      <span className="text-black/30 text-xs">Unassigned</span>
                    )}
                  </td>
                  <td className="p-3">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1 flex-wrap">
                      {/* Validate */}
                      {canValidate && p.status === "submitted" && (
                        <form action={validateChallenge}>
                          <input type="hidden" name="id" value={p.id} />
                          <button className="inline-flex items-center gap-1 rounded-md bg-sky-50 text-sky-700 border border-sky-200 px-2 py-1 text-xs hover:bg-sky-100 font-medium">
                            <ShieldCheck size={11} /> Validate
                          </button>
                        </form>
                      )}
                      {/* Status update */}
                      <form action={setStatus} className="flex items-center gap-1">
                        <input type="hidden" name="id" value={p.id} />
                        <select
                          name="status"
                          defaultValue={p.status}
                          className="rounded-md border border-black/15 px-1.5 py-1 text-xs bg-white"
                        >
                          {CHALLENGE_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {CHALLENGE_STATUS_LABELS[s]}
                            </option>
                          ))}
                        </select>
                        <button className="rounded-md bg-slate-800 text-white px-2 py-1 text-xs hover:bg-slate-700">
                          Save
                        </button>
                      </form>
                      {/* Project link */}
                      <Link href={`/challenges/${p.id}`} className="inline-flex items-center gap-1 rounded-md bg-slate-50 text-slate-600 border border-slate-200 px-2 py-1 text-xs hover:bg-slate-100">
                        <FolderOpen size={11} /> Detail
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card List (< md) */}
        <div className="md:hidden divide-y divide-black/5">
          {problems.map((p) => (
            <div key={p.id} className="p-4 space-y-2.5">
              <div className="flex items-center gap-2 flex-wrap">
                <CategoryBadge category={p.category} />
                <StatusBadge status={p.status} />
                {p.priority && <PriorityBadge priority={p.priority} />}
              </div>

              <Link
                href={`/challenges/${p.id}`}
                className="block font-semibold text-slate-900 hover:text-brand text-sm leading-snug break-words"
              >
                {p.title}
              </Link>

              <p className="text-xs text-black/60 line-clamp-2 leading-relaxed">
                {p.description}
              </p>

              <div className="flex items-center justify-between text-xs text-black/50 flex-wrap gap-1 pt-1">
                <span>📍 {p.district}, {p.state ?? "Jharkhand"}</span>
                <span>{p.assigned_to ? `🎓 ${p.assigned_to}` : "Unassigned"}</span>
              </div>

              {/* Mobile Actions */}
              <div className="pt-2 border-t border-black/5 flex flex-wrap items-center gap-2">
                {canValidate && p.status === "submitted" && (
                  <form action={validateChallenge}>
                    <input type="hidden" name="id" value={p.id} />
                    <button className="inline-flex items-center gap-1 rounded-md bg-sky-50 text-sky-700 border border-sky-200 px-2.5 py-1 text-xs font-medium hover:bg-sky-100">
                      <ShieldCheck size={12} /> Validate
                    </button>
                  </form>
                )}

                {!p.assigned_to && canAssign && (
                  <form action={assignProblem}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="category" value={p.category} />
                    <input type="hidden" name="state" value={p.state ?? "Jharkhand"} />
                    <button
                      className="inline-flex items-center gap-1 rounded-md bg-brand/10 text-brand-dark px-2.5 py-1 text-xs font-medium hover:bg-brand/20"
                      title={`Suggest: ${routeToUniversity(p.category, p.state ?? "Jharkhand")}`}
                    >
                      <Sparkles size={12} /> Auto-assign
                    </button>
                  </form>
                )}

                <form action={setStatus} className="flex items-center gap-1 flex-1 min-w-[160px]">
                  <input type="hidden" name="id" value={p.id} />
                  <select
                    name="status"
                    defaultValue={p.status}
                    className="flex-1 rounded-md border border-black/15 px-2 py-1 text-xs bg-white"
                  >
                    {CHALLENGE_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {CHALLENGE_STATUS_LABELS[s]}
                      </option>
                    ))}
                  </select>
                  <button className="rounded-md bg-slate-800 text-white px-2.5 py-1 text-xs font-medium hover:bg-slate-700">
                    Save
                  </button>
                </form>

                <Link
                  href={`/challenges/${p.id}`}
                  className="inline-flex items-center gap-1 rounded-md bg-slate-100 text-slate-700 px-2.5 py-1 text-xs font-medium hover:bg-slate-200"
                >
                  <FolderOpen size={12} /> Detail
                </Link>
              </div>
            </div>
          ))}
        </div>

        {problems.length === 0 && (
          <p className="p-8 text-center text-black/50 text-sm">
            No challenges matching the selected filters.
          </p>
        )}
      </div>
    </div>
  );
}

function FilterTile({
  label,
  value,
  active,
  href,
}: {
  label: string;
  value: number;
  active: boolean;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={`rounded-xl p-3 border transition ${
        active
          ? "bg-brand text-white border-brand shadow-sm"
          : "bg-white border-black/5 hover:border-brand/40"
      }`}
    >
      <div className="text-2xl font-bold">{value}</div>
      <div
        className={`text-xs mt-0.5 truncate ${active ? "text-white/80" : "text-black/50"}`}
      >
        {label}
      </div>
    </Link>
  );
}
