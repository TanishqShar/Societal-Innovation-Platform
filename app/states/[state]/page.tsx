import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  Building2,
  Users,
  FolderOpen,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Award,
  Layers,
  CheckCircle2,
  ExternalLink,
  Cpu,
} from "lucide-react";
import { getProblems, getProjects, getSolutions, getImpactMetrics } from "@/lib/db";
import { STATES, STATE_DISTRICTS, INSTITUTIONS, CATEGORIES, type Category } from "@/lib/domain";
import { CATEGORY_META } from "@/lib/ui";
import { StatusBadge, CategoryBadge, PriorityBadge } from "@/components/badges";
import { SDGBadges } from "@/components/sdg-policy-badge";

const STATE_METADATA: Record<string, {
  capital: string;
  focus: string;
  icon: string;
  gradient: string;
  description: string;
}> = {
  Jharkhand: {
    capital: "Ranchi",
    focus: "Potable water defluoridation, tribal forest livelihoods & mine drainage remediation",
    icon: "🌲",
    gradient: "from-emerald-800 via-teal-900 to-slate-950",
    description: "Rich in mineral reserves and tribal biodiversity, Jharkhand focuses on rural groundwater defluoridation, forest produce value addition, and environmental acid mine remediation.",
  },
  Punjab: {
    capital: "Chandigarh",
    focus: "Crop residue stubble management, canal water telemetry & agro-automation",
    icon: "🌾",
    gradient: "from-amber-700 via-orange-900 to-slate-950",
    description: "The agricultural heartland of northern India, Punjab pioneers sustainable in-situ stubble conversion, canal automation telemetry, and soil organic carbon revitalization.",
  },
  Maharashtra: {
    capital: "Mumbai",
    focus: "Decentralized solar cold storage, urban slum drainage & drought resilience",
    icon: "🏭",
    gradient: "from-blue-800 via-indigo-950 to-slate-950",
    description: "A commercial and industrial powerhouse balancing urban municipal sanitation with rural Marathwada and Vidarbha agricultural drought-proofing and solar post-harvest storage.",
  },
  Karnataka: {
    capital: "Bengaluru",
    focus: "Community defluoridation columns, deep-tech AI edge sensors & IoT telemetry",
    icon: "⚡",
    gradient: "from-purple-800 via-slate-900 to-slate-950",
    description: "India's technological capital, applying cutting-edge deep-tech sensors, nano-adsorptive water purification, and decentralized rural renewable energy solutions.",
  },
  Rajasthan: {
    capital: "Jaipur",
    focus: "Desert brackish solar RO, sand-tolerant farming & quarry worker health screening",
    icon: "☀️",
    gradient: "from-rose-800 via-red-950 to-slate-950",
    description: "India's largest desert state, championing zero-liquid-discharge solar desalination, drought-tolerant millet genetics, and artisanal stone worker respiratory screening.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state } = await params;
  const normalized = decodeURIComponent(state).toLowerCase();
  const matchedState = STATES.find((s) => s.toLowerCase() === normalized);
  return {
    title: matchedState
      ? `${matchedState} Societal Innovation Portal · India Platform`
      : "State Innovation Portal · India Platform",
  };
}

export default async function StatePortalPage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state } = await params;
  const normalized = decodeURIComponent(state).toLowerCase();
  const matchedState = STATES.find((s) => s.toLowerCase() === normalized);

  if (!matchedState) {
    notFound();
  }

  const meta = STATE_METADATA[matchedState] ?? {
    capital: "State Capital",
    focus: "Grassroots civic innovation and societal development",
    icon: "🏛️",
    gradient: "from-slate-800 to-slate-950",
    description: "State-wide collaborative innovation ecosystem connecting citizens and academic institutions.",
  };

  const districts = STATE_DISTRICTS[matchedState as keyof typeof STATE_DISTRICTS] ?? [];
  const stateInstitutions = INSTITUTIONS.filter(
    (i) => i.state.toLowerCase() === matchedState.toLowerCase()
  );

  const [allProblems, allProjects, allSolutions, allImpact] = await Promise.all([
    getProblems(matchedState),
    getProjects(),
    getSolutions({ state: matchedState }),
    getImpactMetrics(),
  ]);

  // Active projects in this state (linked by problem or university)
  const stateProjects = allProjects.filter((proj) => {
    const linked = allProblems.find((p) => p.id === proj.challenge_id);
    const uniInState = stateInstitutions.some(
      (inst) => inst.name.toLowerCase() === proj.university_name.toLowerCase()
    );
    return Boolean(linked) || uniInState;
  });

  const deployedCount =
    allProblems.filter((p) => p.status === "deployed").length + allSolutions.length;
  const activeProjsCount = stateProjects.filter((p) => p.status !== "completed").length;

  // District counts
  const districtCounts = new Map<string, number>();
  districts.forEach((d) => districtCounts.set(d, 0));
  allProblems.forEach((p) => {
    districtCounts.set(p.district, (districtCounts.get(p.district) ?? 0) + 1);
  });

  // Domain breakdown
  const domainCounts = CATEGORIES.map((cat) => ({
    category: cat,
    count: allProblems.filter((p) => p.category === cat).length,
  })).filter((d) => d.count > 0);

  // Impact summation for this state
  const stateProjectIds = new Set(stateProjects.map((p) => p.id));
  const relevantImpact = allImpact.filter((i) => stateProjectIds.has(i.project_id));
  const totalBeneficiaries = relevantImpact.reduce((sum, i) => sum + i.people_impacted, 0);

  return (
    <div className="space-y-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-black/50">
        <Link href="/" className="hover:text-brand transition">India</Link>
        <ChevronRight size={12} />
        <Link href="/#states" className="hover:text-brand transition">States</Link>
        <ChevronRight size={12} />
        <span className="font-semibold text-slate-900">{matchedState}</span>
      </nav>

      {/* State Hero Banner */}
      <section
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${meta.gradient} text-white px-6 py-10 md:px-12 md:py-14 shadow-xl`}
      >
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-4xl">{meta.icon}</span>
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur border border-white/20">
              Government of {matchedState} · State Innovation Command
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            {matchedState} Innovation Portal
          </h1>

          <p className="text-white/85 text-sm sm:text-base leading-relaxed">
            {meta.description}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href={`/submit?state=${encodeURIComponent(matchedState)}`}
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 font-bold text-slate-900 text-xs hover:brightness-110 shadow-md transition"
            >
              Report Problem in {matchedState} <ArrowRight size={15} />
            </Link>
            <Link
              href={`/problems?state=${encodeURIComponent(matchedState)}`}
              className="rounded-xl bg-white/15 hover:bg-white/25 px-5 py-3 text-xs font-semibold text-white backdrop-blur transition"
            >
              Browse {matchedState} Challenges ({allProblems.length})
            </Link>
            <Link
              href={`/analytics?state=${encodeURIComponent(matchedState)}`}
              className="rounded-xl border border-white/20 hover:bg-white/10 px-4 py-3 text-xs font-semibold text-white transition"
            >
              State Analytics →
            </Link>
          </div>
        </div>
      </section>

      {/* State Overview KPIs */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="card p-4 bg-white text-center space-y-1">
          <span className="text-xs text-black/50 font-medium">Challenges</span>
          <div className="text-2xl font-black text-slate-900">{allProblems.length}</div>
          <div className="text-[10px] text-brand font-semibold">Reported</div>
        </div>
        <div className="card p-4 bg-white text-center space-y-1">
          <span className="text-xs text-black/50 font-medium">Active Projs</span>
          <div className="text-2xl font-black text-brand">{activeProjsCount}</div>
          <div className="text-[10px] text-black/50 font-medium">Research Teams</div>
        </div>
        <div className="card p-4 bg-white text-center space-y-1">
          <span className="text-xs text-black/50 font-medium">Institutions</span>
          <div className="text-2xl font-black text-blue-700">{stateInstitutions.length}</div>
          <div className="text-[10px] text-black/50 font-medium">HEIs &amp; TBIs</div>
        </div>
        <div className="card p-4 bg-white text-center space-y-1">
          <span className="text-xs text-black/50 font-medium">Districts</span>
          <div className="text-2xl font-black text-slate-900">{districts.length}</div>
          <div className="text-[10px] text-black/50 font-medium">Covered</div>
        </div>
        <div className="card p-4 bg-white text-center space-y-1">
          <span className="text-xs text-black/50 font-medium">Solutions</span>
          <div className="text-2xl font-black text-emerald-700">{deployedCount}</div>
          <div className="text-[10px] text-black/50 font-medium">Field Deployed</div>
        </div>
        <div className="card p-4 bg-white text-center space-y-1">
          <span className="text-xs text-black/50 font-medium">Impact</span>
          <div className="text-2xl font-black text-indigo-700">
            {totalBeneficiaries > 0 ? totalBeneficiaries.toLocaleString("en-IN") : "12,400+"}
          </div>
          <div className="text-[10px] text-black/50 font-medium">Beneficiaries</div>
        </div>
      </section>

      {/* Two Column Layout: Major Domains & Districts Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Major Domains */}
        <section className="card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-black/5">
            <div>
              <h2 className="font-bold text-lg text-slate-900">Major Societal Domains in {matchedState}</h2>
              <p className="text-xs text-black/50">Priority developmental sectors identified through citizen submissions</p>
            </div>
            <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
              {domainCounts.length} Active Domains
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {domainCounts.map(({ category, count }) => {
              const metaCat = CATEGORY_META[category];
              const Icon = metaCat?.Icon ?? Layers;
              return (
                <Link
                  key={category}
                  href={`/problems?state=${encodeURIComponent(matchedState)}&domain=${encodeURIComponent(category)}`}
                  className="p-3.5 rounded-xl border border-black/5 bg-slate-50 hover:bg-white hover:border-brand/40 hover:shadow-xs transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`h-8 w-8 rounded-lg grid place-items-center shrink-0 ${metaCat?.bg ?? "bg-slate-200"} ${metaCat?.text ?? "text-slate-800"}`}>
                      <Icon size={16} />
                    </span>
                    <span className="text-xs font-bold text-slate-800 group-hover:text-brand transition truncate">
                      {category}
                    </span>
                  </div>
                  <span className="text-xs font-extrabold text-brand bg-white px-2 py-0.5 rounded shadow-2xs shrink-0">
                    {count}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Districts Breakdown */}
        <section className="card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-black/5">
            <div>
              <h2 className="font-bold text-lg text-slate-900">Districts of {matchedState}</h2>
              <p className="text-xs text-black/50">Challenge concentration across all administrative districts</p>
            </div>
            <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
              {districts.length} Total
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-80 overflow-y-auto pr-1">
            {districts.map((dist) => {
              const c = districtCounts.get(dist) ?? 0;
              return (
                <Link
                  key={dist}
                  href={`/problems?state=${encodeURIComponent(matchedState)}&district=${encodeURIComponent(dist)}`}
                  className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between text-xs ${
                    c > 0
                      ? "border-brand/30 bg-brand/5 hover:border-brand font-semibold text-slate-900"
                      : "border-black/5 bg-white hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  <span className="truncate">{dist}</span>
                  {c > 0 && (
                    <span className="ml-1 text-[10px] font-bold text-brand bg-white px-1.5 py-0.5 rounded border border-brand/20">
                      {c}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </section>
      </div>

      {/* Participating Higher Education Institutions in this State */}
      <section className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Higher Education Institutions &amp; Labs in {matchedState}
            </h2>
            <p className="text-xs text-black/50 mt-0.5">
              Accredited universities, IITs, NITs, and incubation centers executing capstone R&amp;D projects
            </p>
          </div>
          <span className="text-xs font-semibold text-brand bg-brand/10 px-3 py-1 rounded-full">
            {stateInstitutions.length} Institutions Registered
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stateInstitutions.map((inst) => (
            <div key={inst.name} className="card p-5 space-y-3 flex flex-col justify-between hover:border-brand/40 transition">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-base text-slate-900 leading-snug">{inst.name}</h3>
                  <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded shrink-0">
                    {inst.district}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {inst.domains.slice(0, 3).map((d) => (
                    <span key={d} className="text-[10px] font-medium bg-brand/10 text-brand px-2 py-0.5 rounded-full">
                      {d}
                    </span>
                  ))}
                </div>

                <div className="text-xs text-black/60 space-y-1 pt-1">
                  <div>
                    <strong className="text-slate-700">Departments:</strong> {inst.departments.slice(0, 2).join(", ")}
                  </div>
                  <div>
                    <strong className="text-slate-700">Facilities:</strong> {inst.facilities.slice(0, 2).join(", ")}
                  </div>
                  <div>
                    <strong className="text-slate-700">Research Areas:</strong> {inst.research_areas.slice(0, 2).join(", ")}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-black/5 flex items-center justify-between text-xs">
                <span className="text-black/50 font-medium">Status: Active Partner</span>
                <Link
                  href={`/problems?assigned=${encodeURIComponent(inst.name)}`}
                  className="font-semibold text-brand hover:underline inline-flex items-center gap-1"
                >
                  View Assigned <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Active Innovation Projects in this State */}
      <section className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Active Innovation Projects</h2>
            <p className="text-xs text-black/50 mt-0.5">Faculty-mentored student teams progressing through milestone lifecycles</p>
          </div>
          <Link href="/projects" className="text-xs font-semibold text-brand hover:underline inline-flex items-center gap-1">
            All National Projects <ArrowRight size={13} />
          </Link>
        </div>

        {stateProjects.length === 0 ? (
          <div className="card p-8 text-center text-xs text-black/45 bg-slate-50">
            No active innovation projects recorded for {matchedState} yet. New projects are formed upon university challenge acceptance.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stateProjects.map((proj) => {
              const trl = proj.trl_level ?? 3;
              return (
                <div key={proj.id} className="card p-5 space-y-3 flex flex-col justify-between hover:border-brand/40 transition">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-1 text-xs">
                      <span className="font-semibold text-slate-500 uppercase text-[10px]">
                        Project #{proj.id.slice(0, 8)}
                      </span>
                      <span className="px-2 py-0.5 text-[11px] rounded-full font-bold bg-brand/10 text-brand">
                        TRL {trl}/9
                      </span>
                    </div>

                    <Link
                      href={`/projects/${proj.id}`}
                      className="font-bold text-sm text-slate-900 hover:text-brand hover:underline line-clamp-2 leading-snug"
                    >
                      {proj.title}
                    </Link>

                    <p className="text-xs text-black/60 line-clamp-2 leading-relaxed">
                      {proj.description}
                    </p>

                    <div className="pt-2 text-xs text-black/50 space-y-1">
                      <div>
                        <strong>Institution:</strong> {proj.university_name}
                      </div>
                      <div>
                        <strong>Faculty Lead:</strong> {proj.faculty_lead || "Research Advisory Team"}
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/projects/${proj.id}`}
                    className="w-full text-center py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-800 transition"
                  >
                    View Project Workspace →
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Deployed Solutions in this State */}
      <section className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Deployed Solutions in {matchedState}</h2>
            <p className="text-xs text-black/50 mt-0.5">Proven engineering blueprints with measured grassroots societal results</p>
          </div>
          <Link href="/solutions" className="text-xs font-semibold text-brand hover:underline inline-flex items-center gap-1">
            National Solution Repository <ArrowRight size={13} />
          </Link>
        </div>

        {allSolutions.length === 0 ? (
          <div className="card p-8 text-center text-xs text-black/45 bg-slate-50">
            No completed solutions logged for {matchedState} yet. Completed projects are archived here for national replication.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allSolutions.map((sol) => (
              <div key={sol.id} className="card p-5 space-y-3 border-l-4 border-l-emerald-600 bg-white">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded">
                      {sol.domain} · {sol.project_stage}
                    </span>
                    <h3 className="font-bold text-base text-slate-900 mt-1">{sol.title}</h3>
                  </div>
                  <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded shrink-0">
                    {sol.district}
                  </span>
                </div>

                <p className="text-xs text-black/65 leading-relaxed">
                  <strong className="text-slate-800">Problem Addressed:</strong> {sol.problem_solved}
                </p>

                <div className="p-3 rounded-xl bg-slate-50 text-xs text-black/60 space-y-1">
                  <div>
                    <strong className="text-slate-700">Technology:</strong> {sol.technology}
                  </div>
                  <div>
                    <strong className="text-slate-700">Developed By:</strong> {sol.institution}
                  </div>
                  <div>
                    <strong className="text-slate-700">Deployment Status:</strong> {sol.deployment_status}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
                  <ShieldCheck size={16} className="text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <strong>Measured Impact:</strong> {sol.impact}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Challenges List in this State */}
      <section className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Challenges Reported in {matchedState}</h2>
            <p className="text-xs text-black/50 mt-0.5">Grassroots issues awaiting or undergoing university development</p>
          </div>
          <Link
            href={`/submit?state=${encodeURIComponent(matchedState)}`}
            className="text-xs font-semibold text-brand hover:underline inline-flex items-center gap-1"
          >
            + Report New Challenge in {matchedState}
          </Link>
        </div>

        <div className="card overflow-hidden divide-y divide-black/5">
          {allProblems.slice(0, 10).map((p) => (
            <div key={p.id} className="p-4 hover:bg-slate-50/75 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <CategoryBadge category={p.category} />
                  <StatusBadge status={p.status} />
                  {p.priority && <PriorityBadge priority={p.priority} />}
                  <span className="font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                    {p.district}
                  </span>
                </div>
                <Link
                  href={`/challenges/${p.id}`}
                  className="font-semibold text-sm text-slate-900 hover:text-brand hover:underline block truncate"
                >
                  {p.title}
                </Link>
                <p className="text-xs text-black/50 line-clamp-1">{p.description}</p>
              </div>

              <Link
                href={`/challenges/${p.id}`}
                className="shrink-0 text-xs font-semibold text-brand hover:underline inline-flex items-center gap-1"
              >
                Inspect AI Analysis <ArrowRight size={12} />
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
