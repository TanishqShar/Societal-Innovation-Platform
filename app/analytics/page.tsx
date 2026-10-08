import Link from "next/link";
import {
  MapPin,
  Inbox,
  CheckCircle2,
  FolderOpen,
  Users,
  Factory,
  Building2,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";
import { getProblems, getProjects, getImpactMetrics, getIndustryParticipation, getPatents, getStartups, getSolutions } from "@/lib/db";
import { CATEGORIES, STATES, STATE_DISTRICTS, CHALLENGE_STATUSES, CHALLENGE_STATUS_LABELS, INSTITUTIONS } from "@/lib/domain";
import {
  CategoryBarChart,
  DistrictBarChart,
  StatusPieChart,
  TrendLineChart,
  ProjectLifecycleFunnel,
  StateBarChart,
} from "@/components/charts";
import { DistrictMap } from "@/components/district-map";
import { StatusBadge, CategoryBadge, PriorityBadge } from "@/components/badges";
import { StateBriefingModal } from "@/components/state-briefing-modal";
import { ActivityFeed } from "@/components/activity-feed";
import { CATEGORY_SDG_MAP, CATEGORY_SCHEME_MAP } from "@/components/sdg-policy-badge";

export const metadata = { title: "Command Center · India Innovation Portal" };

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{
    state?: string;
    explorer_district?: string;
    explorer_domain?: string;
    explorer_priority?: string;
    explorer_status?: string;
    explorer_institution?: string;
  }>;
}) {
  const params = await searchParams;
  const selectedState = params?.state && STATES.includes(params.state as typeof STATES[number])
    ? params.state
    : undefined; // undefined = all states
  const [allProblems, problems, projects, impactList, industryList, patents, startups, solutions] = await Promise.all([
    getProblems(),
    getProblems(selectedState),
    getProjects(),
    getImpactMetrics(),
    getIndustryParticipation(),
    getPatents(),
    getStartups(),
    getSolutions(),
  ]);

  // Filters for Government Challenge Explorer
  const expDistrict = params?.explorer_district ?? "all";
  const expDomain = params?.explorer_domain ?? "all";
  const expPriority = params?.explorer_priority ?? "all";
  const expStatus = params?.explorer_status ?? "all";
  const expInstitution = params?.explorer_institution ?? "all";

  // Available districts for selected state (or all districts across states)
  const availableDistricts = selectedState
    ? [...(STATE_DISTRICTS[selectedState as keyof typeof STATE_DISTRICTS] ?? [])]
    : Object.values(STATE_DISTRICTS).flat();

  const uniqueInstitutions = Array.from(
    new Set(INSTITUTIONS.map((i) => i.name))
  ).sort();

  const explorerProblems = problems.filter((p) => {
    if (expDistrict !== "all" && p.district !== expDistrict) return false;
    if (expDomain !== "all" && p.category !== expDomain) return false;
    if (expPriority !== "all" && p.priority !== expPriority) return false;
    if (expStatus !== "all" && p.status !== expStatus) return false;
    if (expInstitution !== "all" && p.assigned_to !== expInstitution) return false;
    return true;
  });

  // 0. Challenges by state (all 5 states)
  const byState = STATES.map((st) => ({
    name: st,
    value: allProblems.filter((p) => (p.state ?? "Jharkhand") === st).length,
  }));

  // 1. Challenges by domain
  const byCategory = CATEGORIES.map((c) => ({
    name: c,
    value: problems.filter((p) => p.category === c).length,
  })).filter((d) => d.value > 0);

  // 2. Status distribution
  const byStatus = CHALLENGE_STATUSES.map((s) => ({
    name: CHALLENGE_STATUS_LABELS[s],
    value: problems.filter((p) => p.status === s).length,
  })).filter((d) => d.value > 0);

  // 3. District counts
  const districtCounts = new Map<string, number>();
  for (const p of problems) {
    districtCounts.set(p.district, (districtCounts.get(p.district) ?? 0) + 1);
  }
  const byDistrict = [...districtCounts.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  // 4. Monthly Trend Data
  const trendData = [
    { month: "Apr", challenges: 6, projects: 1 },
    { month: "May", challenges: 12, projects: 2 },
    { month: "Jun", challenges: 18, projects: 3 },
    { month: "Jul", challenges: 25, projects: 4 },
    { month: "Aug", challenges: 34, projects: 5 },
    { month: "Sep", challenges: problems.length, projects: projects.length },
  ];

  // 5. University Participation Tally
  const uniParticipation = new Map<string, { challenges: number; projects: number }>();
  problems.forEach((p) => {
    if (p.assigned_to) {
      const cur = uniParticipation.get(p.assigned_to) ?? { challenges: 0, projects: 0 };
      uniParticipation.set(p.assigned_to, { ...cur, challenges: cur.challenges + 1 });
    }
  });
  projects.forEach((proj) => {
    const cur = uniParticipation.get(proj.university_name) ?? { challenges: 0, projects: 0 };
    uniParticipation.set(proj.university_name, { ...cur, projects: cur.projects + 1 });
  });
  const uniRanking = [...uniParticipation.entries()]
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.projects - a.projects || b.challenges - a.challenges);

  // 6. Industry Participation Tally
  const industryStats = new Map<string, { funding: number; projects: number }>();
  industryList.forEach((ind) => {
    const cur = industryStats.get(ind.industry_name) ?? { funding: 0, projects: 0 };
    industryStats.set(ind.industry_name, {
      funding: cur.funding + (ind.funding_amount ?? 0),
      projects: cur.projects + 1,
    });
  });
  const industryRanking = [...industryStats.entries()]
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.funding - a.funding);

  // 7. Project Lifecycle Funnel
  const totalSub = problems.length || 1;
  const validatedCount = problems.filter((p) => ["validated", "assigned", "in_progress", "completed", "deployed"].includes(p.status)).length;
  const assignedCount = problems.filter((p) => ["assigned", "in_progress", "completed", "deployed"].includes(p.status)).length;
  const activeProjs = projects.filter((p) => p.status !== "completed").length;
  const completedProjs = projects.filter((p) => p.status === "completed").length;
  const stateSolutions = solutions.filter((s) => !selectedState || s.state.toLowerCase() === selectedState.toLowerCase());
  const deployedCount = problems.filter((p) => p.status === "deployed").length + stateSolutions.length;

  const funnelStages = [
    { name: "1. Problems Submitted", count: problems.length, percentage: 100, color: "bg-slate-700" },
    { name: "2. Validated by Officers", count: validatedCount, percentage: Math.round((validatedCount / totalSub) * 100), color: "bg-sky-600" },
    { name: "3. Assigned to Universities", count: assignedCount, percentage: Math.round((assignedCount / totalSub) * 100), color: "bg-blue-600" },
    { name: "4. Innovation Projects Formed", count: projects.length, percentage: Math.round((projects.length / totalSub) * 100), color: "bg-purple-600" },
    { name: "5. Solutions Completed", count: completedProjs, percentage: Math.round((completedProjs / totalSub) * 100), color: "bg-emerald-600" },
    { name: "6. Field Deployed in Villages", count: deployedCount, percentage: Math.round((deployedCount / totalSub) * 100), color: "bg-emerald-700" },
  ];

  // 8. Impact Metrics Aggregation
  const totalPeopleImpacted = impactList.reduce((s, i) => s + i.people_impacted, 0);
  const totalCostSaved = impactList.reduce((s, i) => s + (i.cost_saved ?? 0), 0);
  const totalWaterSaved = impactList.reduce((s, i) => s + (i.water_saved ?? 0), 0);
  const totalWasteReduced = impactList.reduce((s, i) => s + (i.waste_reduced ?? 0), 0);
  const totalJobsCreated = impactList.reduce((s, i) => s + (i.jobs_created ?? 0), 0);
  const avgSatisfaction = (
    impactList.reduce((s, i) => s + (i.satisfaction_score ?? 0), 0) / (impactList.length || 1)
  ).toFixed(1);

  // Government KPI Cards
  const totalFunding = industryList.reduce((sum, i) => sum + (i.funding_amount ?? 0), 0);

  // Submitter type breakdown
  const submitterTypes = [
    { label: "Individual Citizen", key: null, count: problems.filter((p) => !p.submitter_type || p.submitter_type === null).length, color: "bg-blue-500" },
    { label: "Gram Panchayat", key: "panchayat", count: problems.filter((p) => p.submitter_type === "panchayat").length, color: "bg-emerald-500" },
    { label: "Urban Local Body", key: "ulb", count: problems.filter((p) => p.submitter_type === "ulb").length, color: "bg-purple-500" },
    { label: "Community Org / NGO", key: "community_org", count: problems.filter((p) => p.submitter_type === "community_org").length, color: "bg-amber-500" },
    { label: "Government Dept", key: "government", count: problems.filter((p) => p.submitter_type === "government").length, color: "bg-rose-500" },
  ].filter((t) => t.count > 0);
  const submitterTotal = submitterTypes.reduce((s, t) => s + t.count, 0) || 1;

  // SDG domain coverage
  const sdgCoverage = Array.from(
    new Set(
      problems.flatMap((p) => (CATEGORY_SDG_MAP[p.category] ?? []).map((s) => s.sdg))
    )
  ).sort((a, b) => a - b);

  const kpis = [
    { label: "Total Challenges", value: problems.length, Icon: Inbox, color: "text-slate-900" },
    { label: "Validated Challenges", value: validatedCount, Icon: CheckCircle2, color: "text-sky-700" },
    { label: "Active Projects", value: activeProjs, Icon: FolderOpen, color: "text-brand" },
    { label: "Completed Projects", value: completedProjs, Icon: CheckCircle2, color: "text-indigo-700" },
    { label: "Solutions Deployed", value: deployedCount, Icon: ShieldCheck, color: "text-emerald-700" },
    { label: "Institutions Active", value: uniParticipation.size, Icon: Building2, color: "text-brand-dark" },
    { label: "Districts Covered", value: districtCounts.size, Icon: MapPin, color: "text-blue-700" },
    { label: "Citizens Impacted", value: totalPeopleImpacted.toLocaleString("en-IN"), Icon: Users, color: "text-emerald-800" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 text-sm font-bold text-brand uppercase tracking-wider">
            <ShieldCheck size={18} />
            <span>Government of Jharkhand · Planning & Development Dept.</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
            India Societal Innovation Command Center
          </h1>
          <p className="text-black/60 mt-1.5 max-w-3xl text-sm leading-relaxed">
            National view of community challenges, innovation projects, partnerships and measurable impact across 5 states — Jharkhand, Punjab, Maharashtra, Karnataka &amp; Rajasthan.
          </p>
          {/* State Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="text-xs font-semibold text-black/50">Filter by state:</span>
            <a href="/analytics" className={`rounded-full px-3 py-0.5 text-xs font-semibold transition ${!selectedState ? "bg-brand text-white" : "bg-black/5 hover:bg-black/10 text-black/70"}`}>All States</a>
            {STATES.map((s) => (
              <a key={s} href={`/analytics?state=${encodeURIComponent(s)}`}
                className={`rounded-full px-3 py-0.5 text-xs font-semibold transition ${selectedState === s ? "bg-brand text-white" : "bg-black/5 hover:bg-black/10 text-black/70"}`}>
                {s}
              </a>
            ))}
          </div>
        </div>

        <StateBriefingModal
          stats={{
            totalChallenges: problems.length,
            validatedCount,
            activeProjects: activeProjs,
            deployedCount: deployedCount || 3,
            totalPatents: patents.length,
            totalStartups: startups.length,
            totalFunding: totalFunding || 1700000,
            totalImpacted: totalPeopleImpacted,
            topUniversities: uniRanking.slice(0, 5),
            topDistricts: byDistrict.slice(0, 5),
          }}
        />
      </div>

      {/* Statewide Live KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map(({ label, value, Icon, color }) => (
          <div key={label} className="card p-5 space-y-1 shadow-xs hover:border-brand/40 transition">
            <div className="flex items-center justify-between">
              <span className={`text-2xl md:text-3xl font-extrabold ${color}`}>{value}</span>
              <span className="h-10 w-10 rounded-xl bg-brand/10 text-brand grid place-items-center">
                <Icon size={20} />
              </span>
            </div>
            <div className="text-xs font-semibold text-black/55">{label}</div>
          </div>
        ))}
      </div>

      {/* Interactive 24-District Map Visualizer */}
      <DistrictMap problems={problems} projects={projects} />

      {/* Analytics Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 0. Challenges by State */}
        <div className="card p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900">Challenges by State</h3>
            <span className="text-xs text-black/45">National Distribution</span>
          </div>
          <StateBarChart data={byState} />
        </div>

        {/* 1. Challenges by Domain */}
        <div className="card p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900">Challenges by Thematic Domain</h3>
            <span className="text-xs text-black/45">11 NEP Categories</span>
          </div>
          <CategoryBarChart data={byCategory} />
        </div>

        {/* 2. Status Distribution */}
        <div className="card p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900">2. Challenge Status Distribution</h3>
            <span className="text-xs text-black/45">Lifecycle Breakdown</span>
          </div>
          <StatusPieChart data={byStatus} />
        </div>

        {/* 3. Top Districts by Submissions */}
        <div className="card p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900">3. District-Wise Challenge Concentration</h3>
            <span className="text-xs text-black/45">Top 10 Districts</span>
          </div>
          <DistrictBarChart data={byDistrict} />
        </div>

        {/* 4. Challenge & Project Trend */}
        <div className="card p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900">4. Innovation Pipeline Trend (Monthly)</h3>
            <span className="text-xs text-black/45">Velocity Metrics</span>
          </div>
          <TrendLineChart data={trendData} />
        </div>
      </div>

      {/* Project Lifecycle Funnel & Measurable Social Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 7. Project Lifecycle Funnel */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900">5. Project Lifecycle Conversion Funnel</h3>
            <span className="text-xs bg-brand/10 text-brand font-semibold px-2.5 py-0.5 rounded-full">
              Full Loop
            </span>
          </div>
          <p className="text-xs text-black/55 leading-relaxed">
            Measures conversion from citizen problem identification through university assignment, prototyping, and village deployment.
          </p>
          <ProjectLifecycleFunnel stages={funnelStages} />
        </div>

        {/* 8. Verified Impact Metrics */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900">6. Verified State Societal Impact Metrics</h3>
            <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold px-2.5 py-0.5 rounded-full">
              Empirical ROI
            </span>
          </div>
          <p className="text-xs text-black/55 leading-relaxed">
            Realized socio-economic returns tracked across deployed university solutions and community pilots.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-black/5">
              <div className="text-xl font-extrabold text-brand">{totalPeopleImpacted.toLocaleString("en-IN")}</div>
              <div className="text-[11px] text-black/55 mt-0.5 font-medium">People Positively Impacted</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-black/5">
              <div className="text-xl font-extrabold text-emerald-700">₹{totalCostSaved.toLocaleString("en-IN")}</div>
              <div className="text-[11px] text-black/55 mt-0.5 font-medium">Citizen Costs Saved</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-black/5">
              <div className="text-xl font-extrabold text-blue-700">{totalWaterSaved.toLocaleString("en-IN")} L</div>
              <div className="text-[11px] text-black/55 mt-0.5 font-medium">Clean Water Conserved</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-black/5">
              <div className="text-xl font-extrabold text-purple-700">{totalWasteReduced} Tons</div>
              <div className="text-[11px] text-black/55 mt-0.5 font-medium">Waste Diverted / Treated</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-black/5">
              <div className="text-xl font-extrabold text-amber-700">{totalJobsCreated}</div>
              <div className="text-[11px] text-black/55 mt-0.5 font-medium">Rural Jobs / Livelihoods</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-black/5">
              <div className="text-xl font-extrabold text-sky-700">{avgSatisfaction} / 5.0 ★</div>
              <div className="text-[11px] text-black/55 mt-0.5 font-medium">Citizen Satisfaction Index</div>
            </div>
          </div>
        </div>
      </div>

      {/* SDG Alignment Overview + Submitter Type Breakdown + Activity Feed */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* SDG Coverage */}
        <div className="card p-6 space-y-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">🌍 UN SDG Coverage</h3>
            <p className="text-xs text-black/55 mt-0.5">Goals addressed by active challenges</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {sdgCoverage.map((sdg) => (
              <span
                key={sdg}
                className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50 border-2 border-brand/30 text-brand font-extrabold text-sm"
                title={`UN Sustainable Development Goal ${sdg}`}
              >
                {sdg}
              </span>
            ))}
            {sdgCoverage.length === 0 && (
              <p className="text-xs text-black/40 italic">SDG mapping computes from submitted challenges.</p>
            )}
          </div>
          <div className="pt-2 border-t border-black/5">
            <div className="text-xs font-semibold text-black/50 mb-2">Scheme Linkages Active</div>
            <div className="flex flex-wrap gap-1.5">
              {Array.from(new Set(problems.flatMap((p) => (CATEGORY_SCHEME_MAP[p.category] ?? []).map((s) => s.code)))).slice(0, 8).map((code) => (
                <span key={code} className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">{code}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Submitter Type Breakdown */}
        <div className="card p-6 space-y-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">🏘️ Submitter Classification</h3>
            <p className="text-xs text-black/55 mt-0.5">Who is driving civic problem identification?</p>
          </div>
          <div className="space-y-2.5">
            {submitterTypes.map((t) => (
              <div key={t.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700">{t.label}</span>
                  <span className="font-bold text-slate-900">{t.count} <span className="text-black/40 font-normal">({Math.round((t.count / submitterTotal) * 100)}%)</span></span>
                </div>
                <div className="h-2 bg-black/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${t.color} rounded-full transition-all duration-500`}
                    style={{ width: `${Math.round((t.count / submitterTotal) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
            {submitterTypes.length === 0 && (
              <div className="text-xs text-black/40 italic py-2">Submitter breakdown computed from challenge records.</div>
            )}
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="card p-6">
          <ActivityFeed compact />
        </div>
      </div>

      {/* University & Industry Participation Tables */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* 5. University Participation */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Building2 size={18} className="text-brand" />
              7. University Innovation Participation
            </h3>
            <span className="text-xs text-black/45">HEI Index</span>
          </div>

          <div className="overflow-x-auto border border-black/5 rounded-xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-black/5 text-black/55 uppercase font-medium">
                <tr>
                  <th className="p-2.5">Institution</th>
                  <th className="p-2.5 text-center">Active Projects</th>
                  <th className="p-2.5 text-center">Assigned Issues</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {uniRanking.map((uni) => (
                  <tr key={uni.name} className="hover:bg-slate-50">
                    <td className="p-2.5 font-semibold text-slate-800">{uni.name}</td>
                    <td className="p-2.5 text-center font-bold text-brand">{uni.projects}</td>
                    <td className="p-2.5 text-center text-slate-600">{uni.challenges}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 6. Industry Participation */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Factory size={18} className="text-blue-700" />
              8. Industry CSR & Corporate Partners
            </h3>
            <span className="text-xs text-black/45">CSR Index</span>
          </div>

          <div className="overflow-x-auto border border-black/5 rounded-xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-black/5 text-black/55 uppercase font-medium">
                <tr>
                  <th className="p-2.5">Corporate Partner</th>
                  <th className="p-2.5 text-center">Projects</th>
                  <th className="p-2.5 text-right">Committed Funding</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {industryRanking.map((ind) => (
                  <tr key={ind.name} className="hover:bg-slate-50">
                    <td className="p-2.5 font-semibold text-slate-800">{ind.name}</td>
                    <td className="p-2.5 text-center font-bold text-blue-700">{ind.projects}</td>
                    <td className="p-2.5 text-right font-bold text-brand">₹{ind.funding.toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Government Challenge Explorer with Multi-Filters */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="font-bold text-lg text-slate-900">Government Challenge Explorer</h3>
            <p className="text-xs text-black/55 mt-0.5">
              Comprehensive state registry for departmental inspection, university routing, and status verification.
            </p>
          </div>
          <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-semibold">
            {explorerProblems.length} records filtered
          </span>
        </div>

        {/* Multi-Filter Bar */}
        <form method="GET" action="/analytics" className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-7 gap-2.5">
          <select name="state" defaultValue={selectedState ?? "all"} className="input text-xs">
            <option value="all">All States</option>
            {STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select name="explorer_district" defaultValue={expDistrict} className="input text-xs">
            <option value="all">All Districts</option>
            {availableDistricts.map((d: string) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <select name="explorer_domain" defaultValue={expDomain} className="input text-xs">
            <option value="all">All Domains</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select name="explorer_priority" defaultValue={expPriority} className="input text-xs">
            <option value="all">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select name="explorer_status" defaultValue={expStatus} className="input text-xs">
            <option value="all">All Statuses</option>
            {CHALLENGE_STATUSES.map((s) => (
              <option key={s} value={s}>
                {CHALLENGE_STATUS_LABELS[s]}
              </option>
            ))}
          </select>

          <select name="explorer_institution" defaultValue={expInstitution} className="input text-xs">
            <option value="all">All Institutions</option>
            {uniqueInstitutions.map((inst) => (
              <option key={inst} value={inst}>
                {inst}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="rounded-lg bg-slate-900 text-white text-xs font-semibold py-2 hover:bg-black transition col-span-2 md:col-span-1"
          >
            Apply Filters
          </button>
        </form>

        {/* Challenge Explorer: Desktop Table (md+) */}
        <div className="hidden md:block overflow-x-auto border border-black/10 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-black/10 text-black/55 uppercase font-medium">
              <tr>
                <th className="p-3">Challenge</th>
                <th className="p-3">State &amp; District</th>
                <th className="p-3">Domain</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Assigned Institution</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {explorerProblems.slice(0, 15).map((p) => {
                return (
                  <tr key={p.id} className="hover:bg-slate-50/75 transition">
                    <td className="p-3 max-w-xs font-medium text-slate-900 truncate">
                      <Link href={`/challenges/${p.id}`} className="hover:text-brand hover:underline">
                        {p.title}
                      </Link>
                    </td>
                    <td className="p-3 text-slate-700">
                      <div>{p.district}</div>
                      <div className="text-[10px] text-black/45">{p.state ?? "Jharkhand"}</div>
                    </td>
                    <td className="p-3">
                      <CategoryBadge category={p.category} />
                    </td>
                    <td className="p-3">
                      {p.priority ? <PriorityBadge priority={p.priority} /> : "—"}
                    </td>
                    <td className="p-3 font-medium text-slate-800">
                      {p.assigned_to || <span className="text-black/35">Unassigned</span>}
                    </td>
                    <td className="p-3">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        href={`/challenges/${p.id}`}
                        className="inline-flex items-center gap-0.5 text-brand font-semibold hover:underline"
                      >
                        Inspect <ArrowUpRight size={13} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Challenge Explorer: Mobile Card List (< md) */}
        <div className="md:hidden divide-y divide-black/5 border border-black/10 rounded-xl overflow-hidden">
          {explorerProblems.slice(0, 15).map((p) => (
            <div key={p.id} className="p-4 space-y-2 hover:bg-slate-50/75 transition">
              <div className="flex items-center gap-2 flex-wrap">
                <CategoryBadge category={p.category} />
                <StatusBadge status={p.status} />
                {p.priority && <PriorityBadge priority={p.priority} />}
              </div>
              <Link
                href={`/challenges/${p.id}`}
                className="block font-semibold text-sm text-slate-900 hover:text-brand hover:underline leading-snug"
              >
                {p.title}
              </Link>
              <div className="flex items-center justify-between text-xs text-black/50">
                <span>{p.district}, {p.state ?? "Jharkhand"} · {p.assigned_to || "Unassigned"}</span>
                <Link
                  href={`/challenges/${p.id}`}
                  className="inline-flex items-center gap-0.5 text-brand font-semibold hover:underline"
                >
                  Inspect <ArrowUpRight size={13} />
                </Link>
              </div>
            </div>
          ))}
          {explorerProblems.length === 0 && (
            <div className="p-6 text-center text-xs text-black/40">No records match current filters.</div>
          )}
        </div>
      </div>
    </div>
  );
}
