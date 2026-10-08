import Link from "next/link";
import {
  Users,
  Building2,
  ArrowRight,
  MapPin,
  Sparkles,
  GraduationCap,
  LineChart,
  Cpu,
  Handshake,
  Target,
  Award,
  ShieldCheck,
  FolderOpen,
  ChevronRight,
  Globe2,
  CheckCircle2,
} from "lucide-react";
import { getProblems, getProjects, getSolutions } from "@/lib/db";
import { CATEGORIES, STATES, STATE_DISTRICTS, INSTITUTIONS } from "@/lib/domain";
import { CATEGORY_META } from "@/lib/ui";
import { StatusBadge, CategoryBadge, PriorityBadge } from "@/components/badges";
import { ActivityFeed } from "@/components/activity-feed";
import { SDGBadges } from "@/components/sdg-policy-badge";

const STATE_FOCUS_MAP: Record<string, { tagline: string; icon: string; color: string }> = {
  Jharkhand: {
    tagline: "Drinking water quality, tribal forest livelihoods & mine drainage remediation",
    icon: "🌲",
    color: "from-emerald-700 to-teal-900",
  },
  Punjab: {
    tagline: "Crop residue stubble management, canal water telemetry & agro-automation",
    icon: "🌾",
    color: "from-amber-600 to-orange-900",
  },
  Maharashtra: {
    tagline: "Decentralized solar cold storage, urban slum drainage & drought resilience",
    icon: "🏭",
    color: "from-blue-700 to-indigo-950",
  },
  Karnataka: {
    tagline: "Community defluoridation columns, deep-tech AI edge sensors & IoT telemetry",
    icon: "⚡",
    color: "from-purple-700 to-slate-900",
  },
  Rajasthan: {
    tagline: "Desert brackish solar RO, sand-tolerant farming & quarry worker health screening",
    icon: "☀️",
    color: "from-rose-600 to-red-950",
  },
};

export default async function Home() {
  const [problems, projects, solutions] = await Promise.all([
    getProblems(),
    getProjects(),
    getSolutions(),
  ]);

  const totalChallenges = problems.length;
  const assigned = problems.filter(
    (p) => p.status === "assigned" || p.status === "in_progress"
  ).length;
  const activeProjects = projects.length;
  const deployedSolutions = problems.filter((p) => p.status === "deployed").length + solutions.length;
  const coveredDistricts = new Set(problems.map((p) => p.district)).size;
  const recent = problems.slice(0, 3);

  const stats = [
    { label: "Community Challenges", value: totalChallenges, Icon: Users },
    { label: "Assigned to Institutions", value: assigned, Icon: Building2 },
    { label: "Active Projects", value: activeProjects, Icon: FolderOpen },
    { label: "Deployed Solutions", value: deployedSolutions, Icon: ShieldCheck },
  ];

  // Visual National Hierarchy Steps (India → States → Districts → Problems → Projects → Solutions)
  const nationalHierarchy = [
    {
      step: "01",
      level: "Federal Hub",
      title: "India",
      tagline: "National Oversight & SDG Framework",
      stat: "1 Federal Portal",
      statDetail: "Central DST & NEP 2020",
      href: "/",
      icon: "🇮🇳",
      color: "from-amber-500/20 to-orange-500/5 text-amber-400 border-amber-500/30",
      dotColor: "bg-amber-400",
      role: "National Policy & Standards",
    },
    {
      step: "02",
      level: "Decentralized",
      title: "States",
      tagline: "5 Federated State Portals",
      stat: "5 States",
      statDetail: "JH, PB, MH, KA, RJ",
      href: "#states",
      icon: "🏛️",
      color: "from-blue-500/20 to-sky-500/5 text-blue-400 border-blue-500/30",
      dotColor: "bg-blue-400",
      role: "Regional Innovation Ecosystems",
    },
    {
      step: "03",
      level: "Local Administration",
      title: "Districts",
      tagline: "Block & Panchayat Hotspots",
      stat: `${coveredDistricts} Districts`,
      statDetail: "Geo-Tagged Needs",
      href: "/analytics",
      icon: "📍",
      color: "from-emerald-500/20 to-teal-500/5 text-emerald-400 border-emerald-500/30",
      dotColor: "bg-emerald-400",
      role: "Grassroots Verification",
    },
    {
      step: "04",
      level: "Citizen Voice",
      title: "Societal Problems",
      tagline: "Ground Evidence & AI Analysis",
      stat: `${totalChallenges} Problems`,
      statDetail: "Gemini Evaluated",
      href: "/problems",
      icon: "📋",
      color: "from-rose-500/20 to-red-500/5 text-rose-400 border-rose-500/30",
      dotColor: "bg-rose-400",
      role: "Prioritized Public Needs",
    },
    {
      step: "05",
      level: "R&D Capstone",
      title: "Innovation Projects",
      tagline: "Cross-Disciplinary Teams & TRLs",
      stat: `${activeProjects} Projects`,
      statDetail: "TRL 1 to 9 Pipelines",
      href: "/projects",
      icon: "🔬",
      color: "from-purple-500/20 to-violet-500/5 text-purple-400 border-purple-500/30",
      dotColor: "bg-purple-400",
      role: "HEI & Industry Co-Creation",
    },
    {
      step: "06",
      level: "Scaled Impact",
      title: "Deployed Solutions",
      tagline: "Village Operations & Replication",
      stat: `${deployedSolutions} Solutions`,
      statDetail: "Cross-State Scaled",
      href: "/solutions",
      icon: "✨",
      color: "from-yellow-400/20 to-amber-500/5 text-yellow-300 border-yellow-400/30",
      dotColor: "bg-yellow-400",
      role: "National Solution Repository",
    },
  ];

  const storySteps = [
    { num: 1, title: "1. Citizen reports problem", desc: "Grassroots civic challenges logged with photos and ground details from any state." },
    { num: 2, title: "2. AI categorisation", desc: "Automated domain classification, duplicate check, and urgency scoring with state context." },
    { num: 3, title: "3. Institution matching", desc: "Deterministic matching routes issue to best-equipped institution across India." },
    { num: 4, title: "4. Multidisciplinary team", desc: "Cross-department student-faculty teams formed under NEP 2020." },
    { num: 5, title: "5. Industry partnership", desc: "Corporates contribute CSR grants, equipment, testing, and mentorship." },
    { num: 6, title: "6. Milestone lifecycle", desc: "Prototypes validated through lab, field testing, and village pilots." },
    { num: 7, title: "7. Government oversight", desc: "State and national command centers monitor progress and socio-economic metrics." },
    { num: 8, title: "8. Solution repository", desc: "Proven blueprints archived for nationwide cross-state replication." },
  ];

  const capabilities = [
    { Icon: Cpu, title: "AI-Powered Categorization", desc: "Instant classification into 11 domains with state-aware duplicate detection and priority indexing." },
    { Icon: GraduationCap, title: "Nationwide Institution Matching", desc: "Deterministic multi-factor algorithm matching top higher education institutions across India." },
    { Icon: Handshake, title: "Industry Collaboration", desc: "Direct channel for CSR funding, hardware sponsorship, and technical co-creation." },
    { Icon: Target, title: "Lifecycle Project Tracking", desc: "Structured progress from initial research to prototyping, piloting, and village deployment." },
    { Icon: LineChart, title: "Multi-State Command Center", desc: "Interactive state and district maps tracking real-time societal outcomes across India." },
    { Icon: Award, title: "Measurable Civic Impact", desc: "Verified liters of water saved, costs reduced, and beneficiary feedback ratings." },
  ];

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-dark via-brand to-slate-950 text-white px-6 py-14 md:px-14 md:py-20 shadow-xl">
        <div
          className="pointer-events-none absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1 text-xs font-semibold tracking-wide backdrop-blur-md">
            <Sparkles size={13} /> Government of India · Multi-State Innovation Platform · Aligned with NEP 2020
          </span>
          <h1 className="mt-5 text-3xl sm:text-4xl md:text-6xl font-black leading-[1.05] tracking-tight">
            Transforming Local Problems into Scalable Solutions
          </h1>
          <p className="mt-5 max-w-2xl text-white/85 text-base sm:text-lg leading-relaxed font-normal">
            Connecting citizens, institutions, industry and government to solve real societal challenges across India — Jharkhand, Punjab, Maharashtra, Karnataka &amp; Rajasthan.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <Link
              href="/submit"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 font-bold hover:brightness-110 shadow-lg shadow-black/25 transition text-slate-900 text-sm"
            >
              Report a Problem <ArrowRight size={17} />
            </Link>
            <Link
              href="/problems"
              className="rounded-xl bg-white/15 px-6 py-3.5 font-semibold hover:bg-white/25 backdrop-blur transition text-sm text-white"
            >
              Explore Challenges
            </Link>
            <Link
              href="/solutions"
              className="rounded-xl border border-white/25 px-5 py-3.5 font-semibold hover:bg-white/10 backdrop-blur transition text-sm text-white"
            >
              Solution Repository
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Counter */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 -mt-10 relative z-20">
        {stats.map(({ label, value, Icon }) => (
          <div key={label} className="card p-5 bg-white shadow-md border border-black/5 hover:border-brand/40 transition">
            <Icon className="text-brand" size={24} />
            <div className="text-3xl font-extrabold mt-2 text-slate-900">{value}</div>
            <div className="text-xs font-semibold text-black/55 mt-0.5">{label}</div>
          </div>
        ))}
      </section>

      {/* National Innovation Hierarchy Chain: India → States → Districts → Problems → Projects → Solutions */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white p-6 md:p-10 shadow-2xl border border-white/10 space-y-8">
        {/* Ambient Glow Effects */}
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-brand/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-accent/15 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold text-accent uppercase tracking-widest flex items-center gap-1.5">
                <Globe2 size={15} /> National Innovation Architecture
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white">
              End-to-End Multilevel Societal Execution Pipeline
            </h2>
            <p className="text-sm text-white/70 leading-relaxed">
              Bridging federal policy with ground realities: citizen issues are captured at village level, analyzed via Gemini, routed to premier HEIs, co-developed with industry, and scaled into national solution blueprints.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-end">
            <span className="text-xs bg-white/10 text-white/90 px-3.5 py-1.5 rounded-full border border-white/15 font-medium flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
              5 Active States · Pan-India Coverage
            </span>
          </div>
        </div>

        {/* 1. Desktop Flow Architecture (>= 1024px) */}
        <div className="hidden lg:grid grid-cols-6 gap-3 relative z-10">
          {nationalHierarchy.map((item, idx) => (
            <div key={item.title} className="relative flex flex-col">
              <Link
                href={item.href}
                className={`group relative p-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.09] border ${item.color.split(" ").filter(c => c.startsWith("border-")).join(" ")} hover:border-accent transition-all duration-300 flex flex-col justify-between h-full shadow-lg hover:-translate-y-1`}
              >
                {/* Top Row: Step Badge + Icon */}
                <div>
                  <div className="flex items-center justify-between gap-1 mb-3">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/10 text-white/90 border border-white/15">
                      STEP {item.step}
                    </span>
                    <span className="text-2xl filter drop-shadow-md group-hover:scale-110 transition-transform">
                      {item.icon}
                    </span>
                  </div>

                  {/* Level & Title */}
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/50 block">
                    {item.level}
                  </span>
                  <h3 className="font-black text-base text-white group-hover:text-accent transition mt-0.5 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-white/60 mt-1 line-clamp-2 leading-relaxed">
                    {item.tagline}
                  </p>
                </div>

                {/* Bottom Stat Ticker */}
                <div className="mt-4 pt-3 border-t border-white/10">
                  <div className="text-xs font-extrabold text-white flex items-center justify-between">
                    <span>{item.stat}</span>
                    <ChevronRight size={13} className="text-white/40 group-hover:text-accent group-hover:translate-x-0.5 transition" />
                  </div>
                  <div className="text-[10px] text-white/50 truncate mt-0.5">
                    {item.role}
                  </div>
                </div>
              </Link>

              {/* Connecting Step Arrow between columns */}
              {idx < nationalHierarchy.length - 1 && (
                <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 pointer-events-none items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-slate-900 border border-white/20 text-white/60 flex items-center justify-center shadow-md">
                    <ChevronRight size={12} className="text-accent" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 2. Mobile & Tablet Stepped Timeline (< 1024px) */}
        <div className="lg:hidden relative z-10 space-y-3">
          <div className="text-xs font-semibold text-white/60 mb-2 flex items-center gap-1.5">
            <span>Roadmap Sequence:</span>
            <span className="text-accent font-bold">India → States → Districts → Problems → Projects → Solutions</span>
          </div>

          <div className="relative pl-6 space-y-3.5 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-amber-400 before:via-blue-400 before:to-emerald-400">
            {nationalHierarchy.map((item) => (
              <div key={item.title} className="relative">
                {/* Glowing step dot on timeline spine */}
                <span className={`absolute -left-6 top-4 w-3.5 h-3.5 rounded-full ${item.dotColor} ring-4 ring-slate-900`} />

                <Link
                  href={item.href}
                  className="block p-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-accent transition group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{item.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-white/40">STEP {item.step}</span>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-accent">{item.level}</span>
                        </div>
                        <h4 className="font-extrabold text-sm text-white group-hover:text-accent transition">
                          {item.title}
                        </h4>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-white bg-white/10 px-2.5 py-1 rounded-md border border-white/10 shrink-0">
                      {item.stat}
                    </span>
                  </div>
                  <p className="text-xs text-white/65 mt-2 leading-relaxed">
                    {item.tagline} · <span className="text-white/40">{item.role}</span>
                  </p>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Bottom Breadcrumb Pipeline Bar */}
        <div className="relative z-10 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap text-white/75 font-medium">
            <span className="text-white/40">Execution Flow:</span>
            <Link href="/" className="hover:text-accent font-semibold transition">India</Link>
            <span className="text-accent font-bold">→</span>
            <Link href="#states" className="hover:text-accent font-semibold transition">States</Link>
            <span className="text-accent font-bold">→</span>
            <Link href="/analytics" className="hover:text-accent font-semibold transition">Districts</Link>
            <span className="text-accent font-bold">→</span>
            <Link href="/problems" className="hover:text-accent font-semibold transition">Societal Problems</Link>
            <span className="text-accent font-bold">→</span>
            <Link href="/projects" className="hover:text-accent font-semibold transition">Innovation Projects</Link>
            <span className="text-accent font-bold">→</span>
            <Link href="/solutions" className="hover:text-accent font-bold text-accent transition">Deployed Solutions</Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/submit"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-accent text-slate-950 font-bold hover:brightness-110 transition text-xs shadow-xs"
            >
              Report a Problem <ArrowRight size={12} />
            </Link>
            <Link
              href="/solutions"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 text-white font-medium hover:bg-white/20 transition text-xs"
            >
              View Solutions Repository <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* State Selector: Dedicated Portals for 5 States */}
      <section id="states" className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <span className="text-xs font-bold text-brand uppercase tracking-wider">State Portals</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-0.5">
              Explore Innovation by State
            </h2>
            <p className="text-sm text-black/60 mt-1">
              Select a state to inspect localized community challenges, regional universities, district heatmaps, and deployed solutions.
            </p>
          </div>
          <Link
            href="/analytics"
            className="text-xs font-semibold text-brand hover:underline inline-flex items-center gap-1"
          >
            National Command Center <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {STATES.map((stateName) => {
            const stateLower = stateName.toLowerCase();
            const stateProblems = problems.filter((p) => (p.state ?? "Jharkhand") === stateName);
            const stateProjects = projects.filter((proj) => {
              const matched = problems.find((p) => p.id === proj.challenge_id);
              return (matched?.state ?? "Jharkhand") === stateName;
            });
            const stateInstitutions = INSTITUTIONS.filter((i) => i.state.toLowerCase() === stateName.toLowerCase());
            const focus = STATE_FOCUS_MAP[stateName] ?? {
              tagline: "Grassroots civic innovation and technological development",
              icon: "🏛️",
              color: "from-slate-700 to-slate-900",
            };

            return (
              <div
                key={stateName}
                className="card p-6 flex flex-col justify-between hover:border-brand/40 hover:shadow-md transition space-y-4 bg-white"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{focus.icon}</span>
                    <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
                      {STATE_DISTRICTS[stateName as keyof typeof STATE_DISTRICTS]?.length ?? 24} Districts
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{stateName}</h3>
                    <p className="text-xs text-black/60 mt-1 leading-relaxed">{focus.tagline}</p>
                  </div>

                  {/* Micro stats */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-black/5 text-center">
                    <div className="p-2 rounded-xl bg-slate-50">
                      <div className="font-extrabold text-slate-900 text-base">{stateProblems.length}</div>
                      <div className="text-[10px] text-black/50 font-medium">Challenges</div>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50">
                      <div className="font-extrabold text-brand text-base">{stateProjects.length}</div>
                      <div className="text-[10px] text-black/50 font-medium">Projects</div>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50">
                      <div className="font-extrabold text-blue-700 text-base">{stateInstitutions.length}</div>
                      <div className="text-[10px] text-black/50 font-medium">Institutions</div>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/states/${stateLower}`}
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 hover:bg-brand text-white font-semibold text-xs py-2.5 transition"
                >
                  Explore {stateName} State Portal <ArrowRight size={13} />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Live Activity Feed + Key Info */}
      <section className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <ActivityFeed />
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl bg-gradient-to-br from-brand-dark to-brand text-white p-5 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-200">🌍 SDG Aligned Platform</div>
            <p className="text-sm text-white/85 leading-relaxed">
              This portal aligns with <strong>13 UN Sustainable Development Goals</strong> — from Clean Water (SDG 6) and Zero Hunger (SDG 2) to Industry Innovation (SDG 9) and Reduced Inequalities (SDG 10).
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {[1, 2, 3, 4, 6, 8, 9, 10, 11, 13, 15, 16, 17].map((n) => (
                <span key={n} className="w-8 h-8 rounded-lg bg-white/15 border border-white/20 text-white font-extrabold text-xs grid place-items-center">
                  {n}
                </span>
              ))}
            </div>
          </div>
          <div className="card p-5 space-y-2">
            <div className="text-xs font-bold text-black/50 uppercase tracking-wider mb-3">🏛️ Linked Government Schemes</div>
            {["JJM", "NHM", "PMKSY", "MGNREGA", "SBM-G", "AMRUT", "SAMAGRA", "DAY-NRLM", "PMGSY", "NCAP"].map((code) => (
              <span key={code} className="inline-block mr-1.5 mb-1.5 text-[11px] font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded border border-slate-200">
                {code}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Capabilities */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
            End-to-End Innovation Ecosystem
          </h2>
          <p className="text-sm text-black/60 mt-1">
            Engineered to close the loop between grassroots civic concerns and academic scientific execution.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
          {capabilities.map(({ Icon, title, desc }) => (
            <div key={title} className="card p-6 space-y-2.5 bg-white hover:border-brand/40 hover:shadow-sm transition">
              <span className="h-11 w-11 rounded-xl bg-brand/10 text-brand grid place-items-center">
                <Icon size={22} />
              </span>
              <h3 className="font-bold text-base text-slate-900">{title}</h3>
              <p className="text-xs text-black/60 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Complete Innovation Story (8 Steps) */}
      <section className="card p-8 bg-slate-50 border border-black/10 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
              The Complete Innovation Loop
            </h2>
            <p className="text-xs text-black/60 mt-0.5">
              How a community issue in an Indian village progresses to verified deployment.
            </p>
          </div>
          <span className="text-xs bg-brand text-white px-3 py-1 rounded-full font-bold">
            Transparent · Auditable · NEP 2020
          </span>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {storySteps.map((step) => (
            <div
              key={step.num}
              className="p-4 rounded-xl bg-white border border-black/5 shadow-2xs space-y-1.5"
            >
              <div className="text-xs font-bold text-brand">{step.title}</div>
              <p className="text-xs text-black/60 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Challenges Feed Preview */}
      <section className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Recent Community Challenges</h2>
            <p className="text-xs text-black/60 mt-0.5">Grassroots problems reported across India — Jharkhand, Punjab, Maharashtra, Karnataka &amp; Rajasthan</p>
          </div>
          <Link href="/problems" className="text-sm font-semibold text-brand hover:underline inline-flex items-center gap-1">
            View All ({problems.length}) <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {recent.map((p) => {
            const itemState = p.state ?? "Jharkhand";
            return (
              <Link
                key={p.id}
                href={`/challenges/${p.id}`}
                className="card p-5 hover:border-brand/50 hover:shadow-sm transition flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-1">
                    <CategoryBadge category={p.category} />
                    {p.priority && <PriorityBadge priority={p.priority} />}
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 line-clamp-2 leading-snug">{p.title}</h3>
                  <p className="text-xs text-black/55 line-clamp-2 leading-relaxed">{p.description}</p>
                  <SDGBadges category={p.category} />
                </div>

                <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between text-[11px] text-black/45">
                  <span className="flex items-center gap-1 font-semibold text-slate-700">
                    <MapPin size={11} /> {p.district}, {itemState}
                  </span>
                  <StatusBadge status={p.status} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 11 Thematic Domains Grid */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">11 Thematic Priority Domains</h2>
          <p className="text-xs text-black/60 mt-0.5">Aligned with national developmental goals and NEP 2020 · across Jharkhand, Punjab, Maharashtra, Karnataka &amp; Rajasthan</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {CATEGORIES.map((cat) => {
            const count = problems.filter((p) => p.category === cat).length;
            const meta = CATEGORY_META[cat];
            const Icon = meta?.Icon ?? Users;

            return (
              <Link
                key={cat}
                href={`/problems?domain=${encodeURIComponent(cat)}`}
                className="card p-3.5 hover:border-brand/40 hover:shadow-xs transition text-left group"
              >
                <span className={`h-8 w-8 rounded-lg grid place-items-center mb-2 ${meta?.bg ?? "bg-slate-100"} ${meta?.text ?? "text-slate-800"}`}>
                  <Icon size={16} />
                </span>
                <div className="font-bold text-xs text-slate-900 group-hover:text-brand transition truncate">{cat}</div>
                <div className="text-[11px] text-black/45 mt-0.5">{count} challenges</div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
