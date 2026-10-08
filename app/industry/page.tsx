import Link from "next/link";
import {
  Factory,
  ArrowRight,
  Building2,
  Cpu,
  CheckCircle2,
  Handshake,
  Rocket,
  FileCheck,
  Send,
  Zap,
  Filter,
  Search,
  Sparkles,
  MapPin,
  Tag,
} from "lucide-react";
import {
  getProblems,
  getProjects,
  getIndustryParticipation,
  getAnalysis,
  getProjectProposal,
  getPatents,
  getStartups,
} from "@/lib/db";
import { getSession } from "@/lib/auth";
import { CategoryBadge, PriorityBadge, ProjectStatusBadge } from "@/components/badges";
import { industryJoinProject } from "@/app/actions";
import { STATES, CATEGORIES } from "@/lib/domain";

export const metadata = { title: "Industry Innovation Hub & Tech Transfer · India Innovation Portal" };

const SUPPORT_MODES = [
  { id: "funding", label: "Funding / CSR Grant", icon: "💰" },
  { id: "mentorship", label: "Technical Mentorship", icon: "🧠" },
  { id: "prototyping", label: "Prototyping & Fabrication", icon: "⚙️" },
  { id: "testing", label: "Lab Testing & Certification", icon: "🧪" },
  { id: "manufacturing", label: "Scale Manufacturing", icon: "🏭" },
  { id: "deployment", label: "Field Deployment & Logistics", icon: "🚀" },
];

const STAKEHOLDER_LABELS: Record<string, { label: string; color: string }> = {
  csr: { label: "CSR Partner", color: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  msme: { label: "MSME / Manufacturer", color: "bg-amber-50 text-amber-800 border-amber-200" },
  startup: { label: "DeepTech Startup", color: "bg-purple-50 text-purple-800 border-purple-200" },
  psu: { label: "Public Sector (PSU)", color: "bg-blue-50 text-blue-800 border-blue-200" },
  lab: { label: "Accredited Lab", color: "bg-indigo-50 text-indigo-800 border-indigo-200" },
};

const PROJECT_STAGES = [
  { id: "all", label: "All Project Stages" },
  { id: "ideation", label: "Ideation / Assigned" },
  { id: "prototype", label: "Prototyping (TRL 4-5)" },
  { id: "testing", label: "Lab Testing (TRL 5-6)" },
  { id: "pilot", label: "Field Pilot (TRL 6-7)" },
  { id: "deployment", label: "Deployment Ready (TRL 7+)" },
  { id: "completed", label: "Completed / Scaled" },
];

const COMMON_TECHS = [
  "All Technologies",
  "IoT & Sensors",
  "Solar & Renewable",
  "Biotechnology",
  "Embedded Hardware",
  "AI & Computer Vision",
  "Low-Cost Mechanical",
  "Water Filtration",
];

export default async function IndustryPage({
  searchParams,
}: {
  searchParams?: Promise<{
    state?: string;
    domain?: string;
    technology?: string;
    stage?: string;
    support?: string;
    q?: string;
  }>;
}) {
  const params = (await searchParams) || {};
  const filterState = params.state && params.state !== "all" ? params.state : "";
  const filterDomain = params.domain && params.domain !== "all" ? params.domain : "";
  const filterTech = params.technology && params.technology !== "All Technologies" && params.technology !== "all" ? params.technology.toLowerCase() : "";
  const filterStage = params.stage && params.stage !== "all" ? params.stage.toLowerCase() : "";
  const filterSupport = params.support && params.support !== "all" ? params.support.toLowerCase() : "";
  const filterQuery = (params.q || "").toLowerCase().trim();

  const [problems, projects, allIndustry, session, allPatents, allStartups] = await Promise.all([
    getProblems(),
    getProjects(),
    getIndustryParticipation(),
    getSession(),
    getPatents(),
    getStartups(),
  ]);

  const activeProjects = projects.filter((p) => p.status !== "completed");
  const partnershipsCount = allIndustry.filter((i) => i.status === "active").length;
  const totalFunding = allIndustry.reduce((sum, i) => sum + (i.funding_amount ?? 0), 0);

  // Advanced TRL Projects ready for Commercialization & Tech Transfer (TRL >= 6 or completed)
  const techTransferProjects = projects.filter(
    (p) => (p.trl_level && p.trl_level >= 6) || p.status === "completed" || p.id === "proj-hero-1"
  );

  // Fetch proposals and analyses to get required technologies & state mapping
  const projectDetails = await Promise.all(
    projects.map(async (p) => {
      const [analysis, proposal, challenge] = await Promise.all([
        getAnalysis(p.challenge_id),
        getProjectProposal(p.id),
        problems.find((prob) => prob.id === p.challenge_id),
      ]);
      const state = challenge?.state || "Jharkhand";
      const domain = challenge?.category || "General";
      const tech = proposal?.technology || analysis?.recommended_solution_types?.join(", ") || "IoT & Embedded Hardware";
      const hasPartner = allIndustry.some((i) => i.project_id === p.id && i.status === "active");

      return {
        project: p,
        challenge,
        analysis,
        proposal,
        state,
        domain,
        tech,
        hasPartner,
      };
    })
  );

  // Filter projects by user selections
  const filteredProjects = projectDetails.filter((item) => {
    if (filterState && item.state !== filterState) return false;
    if (filterDomain && item.domain !== filterDomain) return false;
    if (filterStage && item.project.status.toLowerCase() !== filterStage) return false;
    if (filterTech) {
      const combinedTech = (item.tech + " " + item.project.title + " " + item.project.description).toLowerCase();
      if (!combinedTech.includes(filterTech.replace("all technologies", ""))) return false;
    }
    if (filterSupport) {
      // Check if project description/analysis aligns with this support type
      const text = (item.project.description + " " + (item.proposal?.implementation_plan || "") + " " + item.tech).toLowerCase();
      if (filterSupport === "funding" && item.hasPartner) return false; // already funded
      if (filterSupport === "manufacturing" && (item.project.trl_level ?? 4) < 5) return false;
    }
    if (filterQuery) {
      const q = filterQuery;
      const haystack = (
        item.project.title +
        " " +
        item.project.description +
        " " +
        item.state +
        " " +
        (item.challenge?.district || "") +
        " " +
        item.project.university_name +
        " " +
        item.tech
      ).toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <section className="rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white px-6 py-10 md:px-12 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-brand/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3 text-emerald-400 font-semibold text-xs tracking-wider uppercase">
            <Factory size={16} />
            <span>Pan-India CSR, MSME & Tech Transfer Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold leading-tight max-w-3xl">
            Industry Innovation & Commercialization Hub
          </h1>
          <p className="mt-4 text-white/75 max-w-2xl text-sm sm:text-base leading-relaxed">
            Discover societal challenges and university innovations across India. Back student and faculty teams with CSR funding, rapid prototyping, MSME manufacturing licenses, lab testing, and nationwide field deployment.
          </p>
        </div>
      </section>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-5">
          <div className="text-3xl font-extrabold text-brand">{activeProjects.length}</div>
          <div className="text-xs text-black/55 mt-1 font-medium">Open Innovation Projects</div>
        </div>
        <div className="card p-5">
          <div className="text-3xl font-extrabold text-emerald-700">{partnershipsCount}</div>
          <div className="text-xs text-black/55 mt-1 font-medium">Active Industry Partnerships</div>
        </div>
        <div className="card p-5">
          <div className="text-3xl font-extrabold text-purple-700">{techTransferProjects.length}</div>
          <div className="text-xs text-black/55 mt-1 font-medium">Commercialization Ready (TRL 7+)</div>
        </div>
        <div className="card p-5">
          <div className="text-3xl font-extrabold text-blue-700">₹{totalFunding.toLocaleString("en-IN")}</div>
          <div className="text-xs text-black/55 mt-1 font-medium">Committed CSR & MSME Capital</div>
        </div>
      </div>

      {/* 🔍 Multi-Filter Discovery Bar for Industry */}
      <div className="card p-6 bg-white border-black/10 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Filter size={18} className="text-brand" />
            Discover Opportunities Across India
          </h2>
          {(filterState || filterDomain || filterTech || filterStage || filterSupport || filterQuery) && (
            <Link
              href="/industry"
              className="text-xs text-red-600 hover:underline font-semibold"
            >
              Reset Filters
            </Link>
          )}
        </div>

        <form method="GET" action="/industry" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* 1. State Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                State
              </label>
              <select
                name="state"
                defaultValue={filterState || "all"}
                className="input text-xs w-full bg-slate-50"
              >
                <option value="all">All States (Pan-India)</option>
                {STATES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Domain Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Domain
              </label>
              <select
                name="domain"
                defaultValue={filterDomain || "all"}
                className="input text-xs w-full bg-slate-50"
              >
                <option value="all">All Domains</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Technology Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Technology
              </label>
              <select
                name="technology"
                defaultValue={filterTech ? filterTech : "all"}
                className="input text-xs w-full bg-slate-50"
              >
                <option value="all">All Technologies</option>
                {COMMON_TECHS.slice(1).map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Project Stage Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Project Stage
              </label>
              <select
                name="stage"
                defaultValue={filterStage || "all"}
                className="input text-xs w-full bg-slate-50"
              >
                {PROJECT_STAGES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 5. Support Required Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Support Required
              </label>
              <select
                name="support"
                defaultValue={filterSupport || "all"}
                className="input text-xs w-full bg-slate-50"
              >
                <option value="all">All Support Modes</option>
                {SUPPORT_MODES.map((sm) => (
                  <option key={sm.id} value={sm.id}>
                    {sm.icon} {sm.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                name="q"
                defaultValue={filterQuery}
                placeholder="Search by challenge, university, hardware specs, or district..."
                className="input text-xs pl-9 w-full"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2 bg-brand text-white text-xs font-semibold rounded-lg hover:bg-brand-dark transition shrink-0"
            >
              Apply Filters
            </button>
          </div>
        </form>

        {/* Quick Support Required Chips */}
        <div className="pt-2 border-t border-black/5 flex items-center gap-2 flex-wrap text-xs">
          <span className="text-black/50 font-medium text-[11px]">Popular Support Tags:</span>
          {SUPPORT_MODES.map((sm) => {
            const isActive = filterSupport === sm.id;
            return (
              <Link
                key={sm.id}
                href={`/industry?support=${encodeURIComponent(sm.id)}`}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition ${
                  isActive
                    ? "bg-brand text-white border-brand shadow-xs"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:border-brand/40"
                }`}
              >
                <span>{sm.icon}</span>
                <span>{sm.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 🚀 Technology Transfer & Commercialization Showcase (TRL 7+) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Zap size={22} className="text-amber-500" />
              Technology Transfer & Commercialization Showcase
            </h2>
            <p className="text-xs text-black/60 mt-0.5">
              High-readiness prototypes (DST TRL 7–9) ready for MSME manufacturing licenses, PSU procurement, and commercial deployment across India.
            </p>
          </div>
          <span className="text-xs bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1 rounded-full font-semibold">
            {techTransferProjects.length} Ready for Transfer
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {techTransferProjects.map((p) => {
            const projectPatents = allPatents.filter((pat) => pat.project_id === p.id);
            const projectStartups = allStartups.filter((st) => st.project_id === p.id);

            const commercialBenchmarks: Record<string, { unitCost: string; marketCost: string; model: string }> = {
              "proj-hero-1": { unitCost: "₹18,500 / kiosk", marketCost: "₹85,000", model: "Non-Exclusive MSME License" },
              "proj-2": { unitCost: "₹320 / kit", marketCost: "₹4,500 / lab test", model: "Open Commercial Deployment" },
              "proj-3": { unitCost: "₹45,000 / node", marketCost: "₹2,50,000", model: "Joint PSU Co-Development" },
            };
            const benchmark = commercialBenchmarks[p.id] || {
              unitCost: "₹25,000 / unit",
              marketCost: "₹95,000",
              model: "University Tech Transfer License",
            };

            return (
              <div
                key={p.id}
                className="card p-5 border-amber-200/80 bg-gradient-to-b from-amber-50/20 to-white hover:border-amber-400 transition shadow-sm flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-900 border border-amber-300">
                      TRL {p.trl_level ?? 7}: Field Operational
                    </span>
                    <span className="text-[11px] text-slate-500 font-semibold">{p.university_name}</span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base leading-snug">{p.title}</h3>
                  <p className="text-xs text-black/60 line-clamp-2 leading-relaxed">{p.description}</p>

                  {/* Commercial Unit Economics */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-black/5 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Target Production Cost:</span>
                      <strong className="text-emerald-700 font-bold">{benchmark.unitCost}</strong>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Commercial Alternative:</span>
                      <span className="line-through text-slate-400">{benchmark.marketCost}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Licensing Model:</span>
                      <span className="font-medium text-slate-800">{benchmark.model}</span>
                    </div>
                  </div>

                  {/* IP & Startup Badges */}
                  <div className="space-y-1.5 text-xs">
                    {projectPatents.length > 0 && (
                      <div className="flex items-center gap-1.5 text-blue-800 bg-blue-50 px-2 py-1 rounded-md border border-blue-100 font-medium">
                        <FileCheck size={13} className="shrink-0 text-blue-600" />
                        <span className="truncate">Patent: {projectPatents[0].title.slice(0, 36)}...</span>
                      </div>
                    )}
                    {projectStartups.length > 0 && (
                      <div className="flex items-center gap-1.5 text-purple-800 bg-purple-50 px-2 py-1 rounded-md border border-purple-100 font-medium">
                        <Rocket size={13} className="shrink-0 text-purple-600" />
                        <span className="truncate">Spin-off: {projectStartups[0].startup_name}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-black/5 flex items-center justify-between gap-2">
                  <Link
                    href={`/projects/${p.id}`}
                    className="text-xs font-semibold text-brand hover:underline inline-flex items-center gap-1"
                  >
                    Tech Dossier <ArrowRight size={12} />
                  </Link>

                  <details className="relative">
                    <summary className="px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-semibold cursor-pointer hover:bg-amber-700 transition list-none min-h-[32px] inline-flex items-center gap-1 shadow-xs">
                      Request Licensing <Send size={11} />
                    </summary>
                    <div className="fixed inset-x-4 bottom-4 sm:absolute sm:right-0 sm:bottom-full sm:inset-x-auto sm:mb-2 w-72 sm:w-88 max-w-[calc(100vw-2rem)] card p-4 z-30 shadow-2xl bg-white border border-black/15 animate-in fade-in">
                      <p className="text-xs font-bold text-slate-900 mb-1">Commercial License Request</p>
                      <p className="text-[11px] text-black/55 mb-3">
                        Submit an inquiry to license <strong>{p.title}</strong> for commercial manufacturing.
                      </p>
                      <form action={industryJoinProject} className="space-y-2.5">
                        <input type="hidden" name="project_id" value={p.id} />
                        <input type="hidden" name="stakeholder_type" value="msme" />
                        <input type="hidden" name="contribution_types" value="manufacturing, deployment, prototyping" />
                        <label className="block">
                          <span className="text-[11px] font-semibold text-slate-800">Your Enterprise Name</span>
                          <input
                            name="industry_name"
                            required
                            defaultValue={session?.name !== "Staff" ? session?.name : "Tata Steel MSME Unit"}
                            className="input mt-0.5 text-xs"
                          />
                        </label>
                        <label className="block">
                          <span className="text-[11px] font-semibold text-slate-800">Commercial Proposal / Target Volume</span>
                          <input
                            name="description"
                            defaultValue="Commercial fabrication of 200 units across district blocks"
                            className="input mt-0.5 text-xs"
                          />
                        </label>
                        <button
                          type="submit"
                          className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-lg transition"
                        >
                          Submit Licensing Application
                        </button>
                      </form>
                    </div>
                  </details>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Industry Challenge Marketplace */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Handshake size={22} className="text-brand" />
              Pan-India Innovation Marketplace
            </h2>
            <p className="text-xs text-black/60 mt-0.5">
              Explore university capstone projects seeking industry sponsorship, prototyping, testing rigs, manufacturing, and commercial mentorship.
            </p>
          </div>
          <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-semibold">
            {filteredProjects.length} Opportunities Matching Filters
          </span>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="card p-12 text-center space-y-3 bg-slate-50 border-dashed">
            <Handshake size={36} className="mx-auto text-slate-300" />
            <h3 className="font-bold text-slate-700 text-base">No Matching Projects Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try adjusting your state, domain, technology, or support mode filters to discover other active university projects.
            </p>
            <Link
              href="/industry"
              className="inline-block mt-2 px-4 py-2 bg-brand text-white text-xs font-semibold rounded-lg hover:bg-brand-dark transition"
            >
              Clear All Filters
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-5">
            {filteredProjects.map(({ project, challenge, analysis, proposal, hasPartner, state, domain, tech }) => {
              const chId = challenge
                ? (challenge.state?.slice(0, 2).toUpperCase() || "IN") + "-" + challenge.id.replace(/[^a-zA-Z0-9]/g, "").slice(0, 5).toUpperCase()
                : "IN-" + project.id.slice(0, 5).toUpperCase();

              return (
                <div
                  key={project.id}
                  className="card p-6 flex flex-col justify-between hover:border-brand/40 transition shadow-sm space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <ProjectStatusBadge status={project.status} />
                        <CategoryBadge category={domain} />
                        {challenge?.priority && <PriorityBadge priority={challenge.priority} />}
                      </div>
                      {hasPartner ? (
                        <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full font-semibold">
                          Partner Active
                        </span>
                      ) : (
                        <span className="text-xs bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-full font-semibold">
                          Seeking Support
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold mb-1">
                        <span className="font-mono text-slate-400">#{chId}</span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1 text-slate-600">
                          <MapPin size={12} className="text-red-500" />
                          {challenge?.district ? `${challenge.district}, ` : ""}{state}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 leading-snug">{project.title}</h3>
                      <p className="text-xs text-black/60 mt-1 line-clamp-2 leading-relaxed">{project.description}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-black/5 space-y-1.5 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-800">
                        <Building2 size={13} className="text-brand shrink-0" />
                        <span className="truncate">HEI: <strong>{project.university_name}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Cpu size={13} className="text-blue-600 shrink-0" />
                        <span className="truncate">Tech: <strong>{tech}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <span>Current Stage: <strong className="capitalize">{project.status} ({project.progress}%)</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* CTAs & Collapsible Express Interest */}
                  <div className="pt-3 border-t border-black/5 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <Link
                        href={`/projects/${project.id}`}
                        className="text-xs font-semibold text-brand hover:underline inline-flex items-center gap-1"
                      >
                        View Full Project & Milestones <ArrowRight size={13} />
                      </Link>

                      <details className="relative">
                        <summary className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold cursor-pointer hover:bg-blue-700 transition shadow-xs min-h-[36px]">
                          <Handshake size={14} /> Express Interest
                        </summary>

                        <div className="fixed inset-x-4 bottom-4 sm:absolute sm:right-0 sm:bottom-full sm:inset-x-auto sm:mb-2 w-72 sm:w-96 max-w-[calc(100vw-2rem)] card p-5 z-20 shadow-2xl bg-white border border-black/15 animate-in fade-in zoom-in-95">
                          <h4 className="font-bold text-sm text-slate-900 mb-1">
                            How can your organization contribute?
                          </h4>
                          <p className="text-[11px] text-black/55 mb-3">
                            Select your entity classification and support modes for <strong>{project.title}</strong>:
                          </p>

                          <form action={industryJoinProject} className="space-y-3">
                            <input type="hidden" name="project_id" value={project.id} />

                            <label className="block">
                              <span className="text-[11px] font-semibold text-slate-800">Stakeholder Entity Type</span>
                              <select name="stakeholder_type" className="input mt-1 text-xs" defaultValue="csr">
                                <option value="csr">Corporate CSR Entity (Funding & Community Impact)</option>
                                <option value="msme">MSME / Regional Manufacturing Partner</option>
                                <option value="startup">DeepTech Startup / Commercializer</option>
                                <option value="psu">State / Central PSU</option>
                                <option value="lab">Accredited Testing & Certification Lab</option>
                              </select>
                            </label>

                            <label className="block">
                              <span className="text-[11px] font-semibold text-slate-800">Organization Name</span>
                              <input
                                name="industry_name"
                                required
                                defaultValue={session?.name !== "Staff" ? session?.name : "Tata Steel / Tech Partner"}
                                className="input mt-1 text-xs"
                              />
                            </label>

                            <div>
                              <span className="text-[11px] font-semibold text-slate-800 block mb-1">
                                Support Offered (Select all that apply)
                              </span>
                              <select
                                name="contribution_types"
                                className="input text-xs"
                                defaultValue="funding,mentorship"
                              >
                                <option value="funding">💰 Funding / CSR Grant</option>
                                <option value="mentorship">🧠 Mentorship & Technical Guidance</option>
                                <option value="prototyping">⚙️ Prototyping & Fabrication Facility</option>
                                <option value="testing">🧪 Lab Testing & Certification</option>
                                <option value="manufacturing">🏭 MSME Scale Manufacturing</option>
                                <option value="deployment">🚀 Field Deployment & Distribution</option>
                                <option value="funding,mentorship">💰 Funding + Mentorship</option>
                                <option value="prototyping,testing">⚙️ Prototyping + Testing</option>
                                <option value="manufacturing,deployment">🏭 Manufacturing + Deployment</option>
                              </select>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <label className="block">
                                <span className="text-[11px] font-semibold text-slate-800">Funding / CSR (₹)</span>
                                <input
                                  name="funding_amount"
                                  type="number"
                                  defaultValue={300000}
                                  className="input mt-1 text-xs"
                                />
                              </label>
                              <label className="block">
                                <span className="text-[11px] font-semibold text-slate-800">Support Scope</span>
                                <input
                                  name="description"
                                  defaultValue="Hardware tooling, pilot trial, and mentorship"
                                  className="input mt-1 text-xs"
                                />
                              </label>
                            </div>

                            <button
                              type="submit"
                              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs transition min-h-[40px]"
                            >
                              Submit Expression of Interest
                            </button>
                          </form>
                        </div>
                      </details>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Active Industry-Academia Partnerships Showcase */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Building2 size={22} className="text-emerald-600" />
            Active Industry & MSME Partnerships
          </h2>
          <p className="text-xs text-black/60 mt-0.5">
            Committed corporate CSR, public sector undertakings, and regional MSME partners actively backing student innovations.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {allIndustry.slice(0, 6).map((partner) => {
            const sh = STAKEHOLDER_LABELS[partner.stakeholder_type || "csr"] || STAKEHOLDER_LABELS.csr;
            const targetProj = projects.find((p) => p.id === partner.project_id);

            return (
              <div key={partner.id} className="card p-4 space-y-3 bg-white border-black/10 shadow-xs">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold border ${sh.color}`}>
                    {sh.label}
                  </span>
                  {partner.funding_amount && (
                    <span className="text-xs font-bold text-emerald-700">
                      ₹{partner.funding_amount.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-sm text-slate-900">{partner.industry_name}</h4>
                  {targetProj && (
                    <p className="text-xs text-black/55 mt-0.5 truncate">
                      Supporting: <strong>{targetProj.title}</strong>
                    </p>
                  )}
                  {partner.description && (
                    <p className="text-xs text-black/65 mt-1.5 line-clamp-2">{partner.description}</p>
                  )}
                </div>

                <div className="flex flex-wrap gap-1 pt-2 border-t border-black/5">
                  {partner.contribution_types.map((type) => (
                    <span key={type} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium capitalize">
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CSR & Industry Collaboration Guide */}
      <div className="card p-6 sm:p-8 bg-slate-50 border border-black/10 space-y-4">
        <h3 className="font-bold text-lg text-slate-900">Why Partner with India Innovation Portal?</h3>
        <div className="grid md:grid-cols-3 gap-6 text-xs text-black/65">
          <div className="space-y-1.5">
            <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-emerald-600" />
              Verified Societal Need
            </div>
            <p className="leading-relaxed">
              Every challenge is filed by real citizens across Indian states and verified by district administration, ensuring 100% genuine grassroots alignment.
            </p>
          </div>
          <div className="space-y-1.5">
            <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-emerald-600" />
              Academic Rigour
            </div>
            <p className="leading-relaxed">
              Work with top university faculties (IIT ISM, BIT Mesra, BIT Sindri, IIT Ropar, IIT Bombay, IISc, IIT Jodhpur) and student innovators with zero administrative friction.
            </p>
          </div>
          <div className="space-y-1.5">
            <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-emerald-600" />
              Auditable Impact Metrics
            </div>
            <p className="leading-relaxed">
              Track citizen satisfaction, lives impacted, and field telemetry directly in government dashboards for compliance and ESG reporting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
