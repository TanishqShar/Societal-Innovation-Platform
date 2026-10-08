import Link from "next/link";
import {
  GraduationCap,
  FolderOpen,
  CheckCircle2,
  Users,
  Factory,
  Plus,
  ArrowRight,
  Filter,
  Building2,
  Rocket,
  Microscope,
  Coins,
  Sparkles,
  MapPin,
  Globe2,
  ShieldCheck,
  Settings,
  Cpu,
} from "lucide-react";
import { getProblems, getProjects, getProjectMembers, getIndustryParticipation, getSolutions } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { StatusBadge, CategoryBadge, PriorityBadge, ProjectStatusBadge } from "@/components/badges";
import { CATEGORIES, INSTITUTIONS, STATES, STATE_DISTRICTS } from "@/lib/domain";
import { acceptChallengeAction, rejectChallengeAction } from "@/app/actions";

export const metadata = { title: "Institution Workspace · India Innovation Portal" };

export default async function UniversityPage({
  searchParams,
}: {
  searchParams: Promise<{
    view?: string;
    domain?: string;
    priority?: string;
    status?: string;
    state?: string;
    district?: string;
  }>;
}) {
  const session = await requireRole("university", "admin");
  const params = await searchParams;

  const currentTab = params?.view ?? "matched";
  const domainFilter = params?.domain ?? "all";
  const priorityFilter = params?.priority ?? "all";
  const statusFilter = params?.status ?? "all";
  const stateFilter = params?.state ?? "all";
  const districtFilter = params?.district ?? "all";

  const [allProblems, allProjects, allIndustry, allSolutions] = await Promise.all([
    getProblems(),
    getProjects(),
    getIndustryParticipation(),
    getSolutions(),
  ]);

  // Resolve current institution profile
  const sessionNameLower = (session.name ?? "").toLowerCase();
  const userInst =
    INSTITUTIONS.find(
      (inst) =>
        sessionNameLower &&
        sessionNameLower !== "staff" &&
        (inst.name.toLowerCase().includes(sessionNameLower) ||
          sessionNameLower.includes(inst.name.toLowerCase()) ||
          (sessionNameLower.includes("sindri") && inst.name.toLowerCase().includes("sindri")) ||
          (sessionNameLower.includes("ropar") && inst.name.toLowerCase().includes("ropar")) ||
          (sessionNameLower.includes("bombay") && inst.name.toLowerCase().includes("bombay")) ||
          (sessionNameLower.includes("iisc") && inst.name.toLowerCase().includes("iisc")) ||
          (sessionNameLower.includes("jodhpur") && inst.name.toLowerCase().includes("jodhpur")) ||
          (sessionNameLower.includes("pau") && inst.name.toLowerCase().includes("pau")) ||
          (sessionNameLower.includes("ism") && inst.name.toLowerCase().includes("ism")))
    ) ?? INSTITUTIONS[0]; // fallback default to BIT Sindri

  const homeState = userInst.state;

  // 1. Matched to Expertise
  const challengesMatched = allProblems.filter((p) => {
    if (p.assigned_to && p.assigned_to.toLowerCase().includes(userInst.name.toLowerCase())) return true;
    if (userInst.domains.includes(p.category)) return true;
    return false;
  });

  // 2. Challenges in Home State
  const challengesInState = allProblems.filter(
    (p) => (p.state ?? "Jharkhand").toLowerCase() === homeState.toLowerCase()
  );

  // 3. Challenges from Other States (Cross-State National Discovery)
  const challengesOtherStates = allProblems.filter(
    (p) => (p.state ?? "Jharkhand").toLowerCase() !== homeState.toLowerCase()
  );

  // Select list based on active tab
  let activeQueue =
    currentTab === "state"
      ? challengesInState
      : currentTab === "national"
      ? challengesOtherStates
      : challengesMatched;

  // Apply filters
  if (domainFilter !== "all") activeQueue = activeQueue.filter((p) => p.category === domainFilter);
  if (priorityFilter !== "all") activeQueue = activeQueue.filter((p) => p.priority === priorityFilter);
  if (statusFilter !== "all") activeQueue = activeQueue.filter((p) => p.status === statusFilter);
  if (districtFilter !== "all") activeQueue = activeQueue.filter((p) => p.district === districtFilter);

  // Active projects for this institution
  const universityProjects = allProjects.filter(
    (proj) =>
      !session.name ||
      session.name === "Staff" ||
      proj.university_name.toLowerCase().includes(userInst.name.toLowerCase()) ||
      userInst.name.toLowerCase().includes(proj.university_name.toLowerCase())
  );

  const activeProjectsCount = universityProjects.filter((p) => p.status !== "completed").length;
  const completedProjectsCount = universityProjects.filter((p) => p.status === "completed").length;

  // Completed solutions for this institution or home state
  const completedSolutions = allSolutions.filter(
    (s) =>
      s.institution.toLowerCase().includes(userInst.name.toLowerCase()) ||
      s.state.toLowerCase() === homeState.toLowerCase()
  );

  // Team members
  const projectMembersList = await Promise.all(
    universityProjects.map((p) => getProjectMembers(p.id))
  );
  const allMembers = projectMembersList.flat();
  const facultyMentors = allMembers.filter((m) => m.role === "faculty");
  const studentInnovators = allMembers.filter((m) => m.role === "student");

  // Industry collaborations linked to this institution
  const instProjectIds = new Set(universityProjects.map((p) => p.id));
  const institutionIndustry = allIndustry.filter((i) => instProjectIds.has(i.project_id));

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 text-sm font-semibold text-brand">
            <GraduationCap size={18} />
            <span>Higher Education Institution Workspace · {homeState}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            {userInst.name}
          </h1>
          <p className="text-black/60 mt-1 max-w-2xl text-xs sm:text-sm">
            Signed in as <strong>{session.name}</strong>. Translate real community problems into multidisciplinary capstone research, student prototypes, and deployed societal solutions across India.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/projects/new"
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand text-white px-4 py-2.5 text-xs font-semibold hover:bg-brand-dark transition shadow-sm min-h-[40px]"
          >
            <Plus size={16} /> Create Project
          </Link>
          <a
            href="#capabilities"
            className="inline-flex items-center gap-1.5 rounded-xl border border-black/15 bg-white px-3.5 py-2.5 text-xs font-semibold hover:bg-slate-50 transition min-h-[40px]"
          >
            <Settings size={15} /> Capabilities
          </a>
        </div>
      </div>

      {/* KPI Tiles Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        <div className="card p-4 text-center bg-white space-y-0.5">
          <span className="text-xs text-black/50 font-medium">Matched Queue</span>
          <div className="text-2xl font-black text-brand">{challengesMatched.length}</div>
          <div className="text-[10px] text-black/40">Domain Expertise</div>
        </div>
        <div className="card p-4 text-center bg-white space-y-0.5">
          <span className="text-xs text-black/50 font-medium">In {homeState}</span>
          <div className="text-2xl font-black text-slate-900">{challengesInState.length}</div>
          <div className="text-[10px] text-black/40">Home State</div>
        </div>
        <div className="card p-4 text-center bg-white space-y-0.5">
          <span className="text-xs text-black/50 font-medium">Other States</span>
          <div className="text-2xl font-black text-blue-700">{challengesOtherStates.length}</div>
          <div className="text-[10px] text-black/40">Cross-State</div>
        </div>
        <div className="card p-4 text-center bg-white space-y-0.5">
          <span className="text-xs text-black/50 font-medium">Active R&amp;D</span>
          <div className="text-2xl font-black text-purple-700">{activeProjectsCount}</div>
          <div className="text-[10px] text-black/40">Student Teams</div>
        </div>
        <div className="card p-4 text-center bg-white space-y-0.5">
          <span className="text-xs text-black/50 font-medium">Completed</span>
          <div className="text-2xl font-black text-emerald-700">{completedProjectsCount}</div>
          <div className="text-[10px] text-black/40">Solutions</div>
        </div>
        <div className="card p-4 text-center bg-white space-y-0.5">
          <span className="text-xs text-black/50 font-medium">CSR Partners</span>
          <div className="text-2xl font-black text-slate-800">{institutionIndustry.length || 3}</div>
          <div className="text-[10px] text-black/40">Active Sponsors</div>
        </div>
      </div>

      {/* Challenge Inbox with 3 Views */}
      <div className="card p-4 sm:p-6 space-y-5 bg-white shadow-xs">
        <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-black/5">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900">
              <Building2 size={20} className="text-brand" />
              Institutional Challenge Queue
            </h2>
            <p className="text-xs text-black/55 mt-0.5">
              Explore challenges matched to your faculty capabilities, issues in {homeState}, or cross-state opportunities across India.
            </p>
          </div>

          {/* View Mode Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 text-xs font-semibold">
            <Link
              href="/university?view=matched"
              className={`px-3 py-1.5 rounded-lg transition ${
                currentTab === "matched" ? "bg-white text-brand shadow-xs font-bold" : "text-slate-600 hover:text-black"
              }`}
            >
              🎯 Matched to Expertise ({challengesMatched.length})
            </Link>
            <Link
              href="/university?view=state"
              className={`px-3 py-1.5 rounded-lg transition ${
                currentTab === "state" ? "bg-white text-brand shadow-xs font-bold" : "text-slate-600 hover:text-black"
              }`}
            >
              🏛️ {homeState} ({challengesInState.length})
            </Link>
            <Link
              href="/university?view=national"
              className={`px-3 py-1.5 rounded-lg transition ${
                currentTab === "national" ? "bg-white text-brand shadow-xs font-bold" : "text-slate-600 hover:text-black"
              }`}
            >
              🇮🇳 Other States ({challengesOtherStates.length})
            </Link>
          </div>
        </div>

        {/* Filter Bar */}
        <form method="GET" action="/university" className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
          <input type="hidden" name="view" value={currentTab} />

          <select name="domain" defaultValue={domainFilter} className="input text-xs">
            <option value="all">All Domains</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select name="priority" defaultValue={priorityFilter} className="input text-xs">
            <option value="all">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select name="status" defaultValue={statusFilter} className="input text-xs">
            <option value="all">All Statuses</option>
            <option value="assigned">Assigned</option>
            <option value="validated">Validated</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <button
            type="submit"
            className="col-span-2 md:col-span-2 rounded-lg bg-slate-900 text-white py-2 text-xs font-semibold hover:bg-black transition min-h-[38px]"
          >
            Filter Queue
          </button>
        </form>

        {/* Desktop Table View (md+) */}
        <div className="hidden md:block overflow-x-auto border border-black/5 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-black/10 text-black/55 uppercase font-medium">
              <tr>
                <th className="p-3">Challenge &amp; Location</th>
                <th className="p-3">Domain</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Assigned HEI</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {activeQueue.slice(0, 15).map((p) => {
                const itemState = p.state ?? "Jharkhand";
                const isCrossState = itemState.toLowerCase() !== homeState.toLowerCase();
                const linkedProj = allProjects.find((proj) => proj.challenge_id === p.id);

                return (
                  <tr key={p.id} className="hover:bg-slate-50/75 transition">
                    <td className="p-3 max-w-sm">
                      <Link
                        href={`/challenges/${p.id}`}
                        className="font-bold text-slate-900 hover:text-brand hover:underline line-clamp-1"
                      >
                        {p.title}
                      </Link>
                      <div className="text-[11px] text-black/50 mt-0.5 flex items-center gap-1.5">
                        <MapPin size={11} /> {p.district}, {itemState}
                        {isCrossState && (
                          <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded">
                            Cross-State
                          </span>
                        )}
                      </div>
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
                      {linkedProj ? (
                        <Link
                          href={`/projects/${linkedProj.id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
                        >
                          <FolderOpen size={13} /> Project ({linkedProj.progress}%)
                        </Link>
                      ) : (
                        <div className="flex items-center justify-end gap-1.5">
                          <form action={acceptChallengeAction}>
                            <input type="hidden" name="id" value={p.id} />
                            <input type="hidden" name="university_name" value={userInst.name} />
                            <button
                              type="submit"
                              className="px-2.5 py-1 rounded-md bg-emerald-600 text-white text-[11px] font-semibold hover:bg-emerald-700 transition"
                            >
                              Accept
                            </button>
                          </form>
                          <Link
                            href={`/projects/new?challenge_id=${p.id}`}
                            className="px-2.5 py-1 rounded-md bg-brand text-white text-[11px] font-semibold hover:bg-brand-dark transition"
                          >
                            + Team
                          </Link>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}

              {activeQueue.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-xs text-black/40">
                    No challenges currently waiting in this view.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card List (< md) */}
        <div className="md:hidden divide-y divide-black/5 border border-black/5 rounded-xl overflow-hidden">
          {activeQueue.slice(0, 15).map((p) => {
            const itemState = p.state ?? "Jharkhand";
            const linkedProj = allProjects.find((proj) => proj.challenge_id === p.id);

            return (
              <div key={p.id} className="p-4 space-y-2.5 hover:bg-slate-50/75 transition">
                <div className="flex items-center justify-between gap-1 flex-wrap">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <CategoryBadge category={p.category} />
                    <StatusBadge status={p.status} />
                    {p.priority && <PriorityBadge priority={p.priority} />}
                  </div>
                  <span className="text-[11px] text-black/50 font-medium">
                    {p.district}, {itemState}
                  </span>
                </div>

                <Link
                  href={`/challenges/${p.id}`}
                  className="font-bold text-sm text-slate-900 hover:text-brand hover:underline block leading-snug"
                >
                  {p.title}
                </Link>

                <div className="flex items-center justify-between pt-1">
                  {linkedProj ? (
                    <Link
                      href={`/projects/${linkedProj.id}`}
                      className="text-xs font-semibold text-brand hover:underline"
                    >
                      Project ({linkedProj.progress}%) →
                    </Link>
                  ) : (
                    <div className="flex items-center gap-2">
                      <form action={acceptChallengeAction}>
                        <input type="hidden" name="id" value={p.id} />
                        <input type="hidden" name="university_name" value={userInst.name} />
                        <button
                          type="submit"
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold"
                        >
                          Accept
                        </button>
                      </form>
                      <Link
                        href={`/projects/new?challenge_id=${p.id}`}
                        className="px-3 py-1.5 rounded-lg bg-brand text-white text-xs font-semibold"
                      >
                        Create Project
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active University Projects & Completed Solutions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Projects */}
        <div className="card p-5 space-y-3 bg-white">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <FolderOpen size={18} className="text-brand" /> Active Capstone Projects
            </h3>
            <Link href="/projects" className="text-xs text-brand font-semibold hover:underline">
              All Projects ({allProjects.length}) →
            </Link>
          </div>

          <div className="space-y-3">
            {universityProjects.slice(0, 3).map((proj) => (
              <div key={proj.id} className="p-3.5 rounded-xl border border-black/5 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-brand">TRL {proj.trl_level ?? 3}/9</span>
                  <ProjectStatusBadge status={proj.status} />
                </div>
                <Link
                  href={`/projects/${proj.id}`}
                  className="font-bold text-sm text-slate-900 hover:text-brand hover:underline block truncate"
                >
                  {proj.title}
                </Link>
                <div className="text-xs text-black/55 flex items-center justify-between">
                  <span>Lead: {proj.faculty_lead || "Advisory Faculty"}</span>
                  <Link href={`/projects/${proj.id}`} className="text-brand font-semibold hover:underline">
                    Manage Project →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Completed Societal Solutions */}
        <div className="card p-5 space-y-3 bg-white">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-700" /> Completed Solutions &amp; Blueprints
            </h3>
            <Link href="/solutions" className="text-xs text-brand font-semibold hover:underline">
              National Repository →
            </Link>
          </div>

          <div className="space-y-3">
            {completedSolutions.slice(0, 3).map((sol) => (
              <div key={sol.id} className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-800">{sol.domain}</span>
                  <span className="text-[11px] text-slate-600">{sol.district}, {sol.state}</span>
                </div>
                <h4 className="font-bold text-sm text-slate-900">{sol.title}</h4>
                <p className="text-xs text-black/60 line-clamp-1">{sol.problem_solved}</p>
                <div className="text-[11px] text-emerald-900 pt-1 font-medium">
                  <strong>Impact:</strong> {sol.impact}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Expertise & Facilities: Maintain Capabilities Panel */}
      <section id="capabilities" className="card p-6 md:p-8 space-y-6 bg-slate-50 border border-black/10">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-4 border-b border-black/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-brand uppercase tracking-wider">
              <Cpu size={15} /> Institutional Capabilities Registry
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
              Maintain Capabilities, Laboratories &amp; Research Centers
            </h2>
            <p className="text-xs text-black/60 mt-0.5">
              Accurate capability profiles allow the deterministic matching engine to route appropriate community challenges across India to your campus.
            </p>
          </div>
          <span className="text-xs bg-brand/10 text-brand font-bold px-3 py-1 rounded-full">
            Verified Institution
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white border border-black/5 space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">Academic Departments</h3>
            <ul className="text-xs space-y-1 text-slate-800">
              {userInst.departments.map((dept) => (
                <li key={dept} className="flex items-center gap-1.5">
                  <span className="text-brand">•</span> {dept}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-white border border-black/5 space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">Specialized Facilities</h3>
            <ul className="text-xs space-y-1 text-slate-800">
              {userInst.facilities.map((fac) => (
                <li key={fac} className="flex items-center gap-1.5">
                  <span className="text-emerald-600">✓</span> {fac}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-white border border-black/5 space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">Core Technical Expertise</h3>
            <ul className="text-xs space-y-1 text-slate-800">
              {userInst.expertise.map((exp) => (
                <li key={exp} className="flex items-center gap-1.5">
                  <span className="text-blue-600">⚡</span> {exp}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-white border border-black/5 space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">Active Research Thrusts</h3>
            <ul className="text-xs space-y-1 text-slate-800">
              {userInst.research_areas.map((res) => (
                <li key={res} className="flex items-center gap-1.5">
                  <span className="text-purple-600">★</span> {res}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Capability update simulation prompt */}
        <div className="p-4 rounded-xl bg-white border border-black/10 flex items-center justify-between flex-wrap gap-3">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-slate-900">Need to register a new laboratory or faculty research group?</span>
            <p className="text-[11px] text-black/50">Submit capability revisions for state higher education board accreditation.</p>
          </div>
          <button
            type="button"
            onClick={() => {}}
            className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-black transition"
          >
            Update Capabilities Specification →
          </button>
        </div>
      </section>

      {/* Industry CSR Collaborations */}
      <section className="card p-6 bg-white space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Factory size={20} className="text-blue-700" />
              Industry CSR &amp; Corporate Collaborations
            </h2>
            <p className="text-xs text-black/55 mt-0.5">
              Enterprises contributing CSR funding, prototyping equipment, and technical co-creation.
            </p>
          </div>
          <Link href="/industry" className="text-xs font-semibold text-brand hover:underline">
            Explore Industry Hub →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { name: "Tata Steel CSR Foundation", focus: "Drinking water defluoridation kiosks", funding: "₹6,00,000" },
            { name: "Jindal Water Infra", focus: "Borewell telemetry & IoT testing", funding: "₹4,50,000" },
            { name: "Birla Carbon Cleantech", focus: "Biomass pyrolysis & air scrubbing", funding: "₹3,50,000" },
          ].map((partner) => (
            <div key={partner.name} className="p-4 rounded-xl border border-black/5 bg-slate-50 space-y-1.5">
              <span className="font-bold text-xs text-slate-900">{partner.name}</span>
              <p className="text-[11px] text-black/60">{partner.focus}</p>
              <div className="text-xs font-bold text-brand pt-1">Committed: {partner.funding}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
