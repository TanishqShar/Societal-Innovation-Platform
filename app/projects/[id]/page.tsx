import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Factory,
  Users,
  Plus,
  Target,
  FileText,
  CheckCircle2,
  TrendingUp,
  MapPin,
  ShieldCheck,
  Award,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import {
  getProjectById,
  getMilestones,
  getProjectMembers,
  getIndustryParticipation,
  getProblemById,
  getProjectProposal,
  getImpactMetrics,
  getFeedback,
  getPatents,
  getStartups,
  getDiscussions,
} from "@/lib/db";
import { getSession, hasRole } from "@/lib/auth";
import { ProjectStatusBadge, StatusBadge } from "@/components/badges";
import { MilestoneList } from "@/components/milestone-list";
import { TeamBuilder } from "@/components/team-builder";
import { ProposalPanel } from "@/components/proposal-panel";
import { TrlMeter } from "@/components/trl-meter";
import { IpStartupPanel } from "@/components/ip-startup-panel";
import { ProjectDiscussionFeed } from "@/components/project-discussion";
import { addMilestoneAction, updateProjectStatus, industryJoinProject, recordImpact } from "@/app/actions";
import { PROJECT_STATUSES, PROJECT_STATUS_LABELS } from "@/lib/domain";

export const metadata = { title: "Project Workspace · India Innovation Portal" };

const LIFECYCLE_STAGES = [
  { key: "planning", label: "Planning / Concept" },
  { key: "research", label: "Research & Survey" },
  { key: "prototype", label: "Prototyping" },
  { key: "testing", label: "Field Testing" },
  { key: "pilot", label: "Community Pilot" },
  { key: "deployment", label: "Full Deployment" },
  { key: "completed", label: "Completed" },
];

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();

  const [project, milestones, members, industryList, proposal, impactList, patents, startups, discussions] = await Promise.all([
    getProjectById(id),
    getMilestones(id),
    getProjectMembers(id),
    getIndustryParticipation(id),
    getProjectProposal(id),
    getImpactMetrics(id),
    getPatents(id),
    getStartups(id),
    getDiscussions(id),
  ]);

  if (!project) notFound();

  const challenge = await getProblemById(project.challenge_id);
  const feedbackList = challenge ? await getFeedback(challenge.id) : [];

  const canEdit = hasRole(session, "university", "admin");
  const canApproveProposal = hasRole(session, "government", "admin");
  const canIndustryJoin = hasRole(session, "industry");
  const isGovernment = hasRole(session, "government", "admin");

  const completedMilestones = milestones.filter((m) => m.status === "completed").length;
  const currentStageIdx = LIFECYCLE_STAGES.findIndex((s) => s.key === project.status);
  const jhId = challenge ? "JH-" + challenge.id.replace(/[^a-zA-Z0-9]/g, "").slice(0, 5).toUpperCase() : "";

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Back navigation & challenge link */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-sm text-black/50 hover:text-brand transition"
        >
          <ArrowLeft size={15} /> All Projects
        </Link>
        {challenge && (
          <Link
            href={`/challenges/${challenge.id}`}
            className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-brand bg-brand/10 px-3 py-1 rounded-lg hover:bg-brand/20 transition"
          >
            Addressing Challenge #{jhId} <ExternalLink size={12} />
          </Link>
        )}
      </div>

      {/* Main Project Header */}
      <div className="card p-6 space-y-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <ProjectStatusBadge status={project.status} />
              <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-medium">
                {project.university_name}
              </span>
              {project.industry_partner && (
                <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full font-medium">
                  Partner: {project.industry_partner}
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 leading-snug">
              {project.title}
            </h1>

            <div className="flex items-center gap-4 text-xs text-black/55 flex-wrap pt-1">
              <span className="flex items-center gap-1 font-semibold text-slate-700">
                <Building2 size={13} className="text-brand" /> {project.university_name}
              </span>
              {challenge && (
                <span className="flex items-center gap-1">
                  <MapPin size={13} /> {challenge.district}
                  {challenge.village_ward ? ` · ${challenge.village_ward}` : ""}
                </span>
              )}
              {project.start_date && (
                <span>Started: {new Date(project.start_date).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</span>
              )}
              {project.target_date && (
                <span>Target: {new Date(project.target_date).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</span>
              )}
            </div>
          </div>

          {/* Status & Progress quick update for university/admin */}
          {canEdit && (
            <form action={updateProjectStatus} className="p-3 rounded-xl bg-slate-50 border border-black/5 space-y-2 w-full sm:w-auto shrink-0">
              <div className="text-[11px] font-bold text-black/50 uppercase tracking-wider">Update Stage &amp; Progress</div>
              <input type="hidden" name="id" value={id} />
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="number"
                  name="progress"
                  min="0"
                  max="100"
                  defaultValue={project.progress}
                  className="input w-20 text-xs py-1.5 font-bold text-brand"
                  placeholder="%"
                />
                <select name="status" defaultValue={project.status} className="input text-xs py-1.5 flex-1 min-w-[120px]">
                  {PROJECT_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {PROJECT_STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
                <button className="rounded-lg bg-brand text-white px-3 py-2 text-xs font-semibold hover:bg-brand-dark transition min-h-[36px]">
                  Save
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Stakeholders Banner */}
        <div className="pt-3 border-t border-black/5 flex items-center gap-2 flex-wrap text-xs">
          <span className="font-bold text-black/50 uppercase tracking-wider text-[10px]">Active Stakeholders:</span>
          <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-medium">Citizen: {challenge?.submitter_name || "Community Submitter"}</span>
          <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-medium">Faculty: {members.find(m => m.role === "faculty")?.name || "Dr. R. K. Prasad"}</span>
          <span className="bg-blue-100 text-blue-900 px-2 py-0.5 rounded font-medium">Students: {members.filter(m => m.role === "student").length || 3} Innovators</span>
          {project.industry_partner && (
            <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-medium">Industry: {project.industry_partner}</span>
          )}
          <span className="bg-purple-100 text-purple-900 px-2 py-0.5 rounded font-medium">Government: State Monitoring Cell</span>
        </div>

        {/* Progress Bar & Lifecycle Funnel */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">Project Completion Velocity</span>
            <span className="text-xl font-bold text-brand">{project.progress}%</span>
          </div>
          <div className="h-2.5 bg-black/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand rounded-full transition-all duration-500"
              style={{ width: `${project.progress}%` }}
            />
          </div>

          {/* Visual Lifecycle Stepper */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1.5 text-[9px] sm:text-[11px] pt-2">
            {LIFECYCLE_STAGES.map((st, idx) => {
              const isPast = idx < currentStageIdx;
              const isCurrent = idx === currentStageIdx;

              return (
                <div
                  key={st.key}
                  className={`p-2 rounded-lg border text-center transition ${
                    isCurrent
                      ? "bg-brand text-white font-bold shadow-xs border-brand"
                      : isPast
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800 font-medium"
                      : "bg-slate-50 border-slate-200 text-slate-400"
                  }`}
                >
                  <div>{isPast ? "✓" : isCurrent ? "●" : idx + 1}</div>
                  <div className="truncate">{st.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Project Overview & Addressing Challenge */}
      <div className="card p-6 space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Project Methodology & Approach</h2>
        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{project.description}</p>

        {challenge && (
          <div className="p-4 rounded-xl bg-slate-50 border border-black/5 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-brand uppercase tracking-wider mb-1">Root Community Challenge</div>
              <Link
                href={`/challenges/${challenge.id}`}
                className="text-sm font-semibold text-slate-900 hover:text-brand hover:underline"
              >
                {challenge.title}
              </Link>
              <div className="text-xs text-black/50 mt-0.5">
                {challenge.district} · {challenge.category} · Priority: {challenge.priority || "High"}
              </div>
            </div>
            <Link
              href={`/challenges/${challenge.id}`}
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline shrink-0"
            >
              View Ground Report <ChevronRight size={14} />
            </Link>
          </div>
        )}
      </div>

      {/* Technology Readiness Level (TRL) Meter */}
      <TrlMeter
        currentTrl={project.trl_level ?? 5}
        projectId={id}
        canEdit={canEdit}
      />

      {/* Milestones Tracker */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Target size={22} className="text-brand" />
              Project Milestones ({completedMilestones} of {milestones.length} Completed)
            </h2>
            <p className="text-xs text-black/60 mt-0.5">
              Verified technical stages: research survey, hardware prototype, field testing, and village deployment.
            </p>
          </div>

          {canEdit && (
            <details className="relative">
              <summary className="inline-flex items-center gap-1.5 rounded-lg bg-brand text-white px-3.5 py-2 text-sm font-medium cursor-pointer hover:bg-brand-dark transition shadow-sm">
                <Plus size={15} /> Add Milestone
              </summary>
              <div className="fixed inset-x-4 bottom-4 sm:absolute sm:right-0 sm:top-full sm:inset-x-auto sm:mt-2 w-72 sm:w-80 max-w-[calc(100vw-2rem)] card p-4 z-20 shadow-xl bg-white border border-black/10">
                <form action={addMilestoneAction} className="space-y-3">
                  <input type="hidden" name="project_id" value={id} />
                  <label className="block">
                    <span className="text-xs font-semibold">Milestone Title</span>
                    <input name="title" required className="input mt-1 text-xs" placeholder="e.g. Prototype Assembly" />
                  </label>
                  <label className="block">
                    <span className="text-xs font-semibold">Description (optional)</span>
                    <input name="description" className="input mt-1 text-xs" placeholder="Details" />
                  </label>
                  <label className="block">
                    <span className="text-xs font-semibold">Deliverable Report / Artifact URL (optional)</span>
                    <input name="deliverable_url" type="url" className="input mt-1 text-xs" placeholder="https://drive.google.com/... or github.com/..." />
                  </label>
                  <label className="block">
                    <span className="text-xs font-semibold">Target Date</span>
                    <input name="deadline" type="date" className="input mt-1 text-xs" />
                  </label>
                  <button type="submit" className="w-full rounded-lg bg-brand text-white py-2 text-xs font-semibold hover:bg-brand-dark min-h-[38px]">
                    Add Milestone
                  </button>
                </form>
              </div>
            </details>
          )}
        </div>

        <MilestoneList milestones={milestones} projectId={id} canEdit={canEdit} />
      </div>

      {/* Multidisciplinary Team Builder */}
      <TeamBuilder
        members={members}
        projectId={id}
        universityName={project.university_name}
        canEdit={canEdit}
      />

      {/* Solution Proposal & Technical Architecture */}
      <ProposalPanel
        proposal={proposal}
        projectId={id}
        canEdit={canEdit}
        canApprove={canApproveProposal}
      />

      {/* Industry Collaboration */}
      <div className="card p-6 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Factory size={22} className="text-brand" />
              Industry & CSR Collaboration
            </h2>
            <p className="text-xs text-black/60 mt-0.5">
              Corporate partners providing technical mentorship, hardware equipment, prototyping, or CSR grant funding.
            </p>
          </div>

          {canIndustryJoin && (
            <span className="text-xs bg-blue-50 text-blue-800 font-semibold px-2.5 py-1 rounded-full border border-blue-200">
              Industry Account Active
            </span>
          )}
        </div>

        {industryList.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {industryList.map((ind) => (
              <div key={ind.id} className="p-4 rounded-xl border border-black/10 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">{ind.industry_name}</span>
                  <span className="text-[11px] bg-emerald-100 text-emerald-800 font-medium px-2 py-0.5 rounded-full capitalize">
                    {ind.status} Partner
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {ind.contribution_types.map((t) => (
                    <span key={t} className="text-[11px] bg-blue-100 text-blue-800 font-medium px-2 py-0.5 rounded-full capitalize">
                      {t}
                    </span>
                  ))}
                </div>
                {ind.funding_amount && (
                  <div className="text-xs font-semibold text-brand">
                    Funding Support: ₹{ind.funding_amount.toLocaleString("en-IN")}
                  </div>
                )}
                {ind.description && <p className="text-xs text-black/60 leading-relaxed">{ind.description}</p>}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-xl bg-slate-50 border border-dashed border-slate-300 text-center text-xs text-black/45">
            This project is open for industry partnership in funding, hardware, testing, and mentorship.
          </div>
        )}

        {/* Express Interest form for industry role */}
        {canIndustryJoin && (
          <details className="mt-4 p-4 rounded-xl border border-blue-200 bg-blue-50/50">
            <summary className="font-semibold text-sm text-blue-900 cursor-pointer hover:underline flex items-center gap-1.5">
              <Plus size={15} /> Express Industry Interest in this Project
            </summary>
            <form action={industryJoinProject} className="space-y-3 mt-4 pt-3 border-t border-blue-200">
              <input type="hidden" name="project_id" value={id} />
              <div className="grid sm:grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-xs font-semibold text-slate-800">Organization / Company Name</span>
                  <input
                    name="industry_name"
                    required
                    defaultValue={session?.name !== "Staff" ? session?.name : "Jindal Water Infra Ltd"}
                    className="input mt-1 text-xs"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold text-slate-800">Contribution Types</span>
                  <input
                    name="contribution_types"
                    required
                    defaultValue="hardware, mentorship, testing, funding"
                    className="input mt-1 text-xs"
                    placeholder="hardware, mentorship, testing, funding"
                  />
                </label>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-xs font-semibold text-slate-800">Funding Amount (₹, optional)</span>
                  <input name="funding_amount" type="number" defaultValue={500000} className="input mt-1 text-xs" />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold text-slate-800">Brief Description of Support</span>
                  <input
                    name="description"
                    defaultValue="Providing commercial telemetry components, lab testing, and technical mentorship."
                    className="input mt-1 text-xs"
                  />
                </label>
              </div>

              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition"
              >
                Submit Partnership Commitment
              </button>
            </form>
          </details>
        )}
      </div>

      {/* Intellectual Property, Patents & Startup Incubation */}
      <IpStartupPanel
        patents={patents}
        startups={startups}
        projectId={id}
        universityName={project.university_name}
        canEdit={canEdit}
      />

      {/* Stakeholder Collaboration & Mentorship Feed */}
      <ProjectDiscussionFeed
        discussions={discussions}
        projectId={id}
        sessionUser={session?.name}
        sessionRole={session?.role}
      />

      {/* Measurable Social Impact & Beneficiary Verification */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Award size={22} className="text-brand" />
              Measurable Societal Impact
            </h2>
            <p className="text-xs text-black/60 mt-0.5">
              Empirical metrics recorded following field deployment and verified by community beneficiaries.
            </p>
          </div>
        </div>

        {impactList.length > 0 ? (
          <div className="grid sm:grid-cols-3 gap-3">
            {impactList.map((imp) => (
              <div key={imp.id} className="p-4 rounded-xl border border-black/5 bg-slate-50 space-y-1">
                <div className="text-2xl font-bold text-brand">{imp.people_impacted.toLocaleString("en-IN")}</div>
                <div className="text-xs font-semibold text-slate-800">Citizens Positively Impacted</div>
                {imp.water_saved && (
                  <div className="text-xs text-blue-700 mt-1">Water Saved: {imp.water_saved.toLocaleString("en-IN")} L</div>
                )}
                {imp.cost_saved && (
                  <div className="text-xs text-emerald-700">Cost Saved: ₹{imp.cost_saved.toLocaleString("en-IN")}</div>
                )}
                {imp.satisfaction_score && (
                  <div className="text-xs text-amber-700 font-bold">Rating: {imp.satisfaction_score} / 5.0 ★</div>
                )}
                {imp.notes && <p className="text-xs text-black/55 mt-2 pt-2 border-t border-black/5">{imp.notes}</p>}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-slate-50 border border-black/5 text-xs text-black/45">
            Impact data is recorded once the solution enters testing, pilot, or deployment stage.
          </div>
        )}

        {/* Record Impact Action for staff/government */}
        {(canEdit || isGovernment) && (
          <details className="mt-3 p-4 rounded-xl border border-black/10 bg-white">
            <summary className="font-semibold text-xs text-slate-700 cursor-pointer hover:underline">
              + Record Field Impact Metrics for this Project
            </summary>
            <form action={recordImpact} className="space-y-3 mt-3 pt-3 border-t border-black/5">
              <input type="hidden" name="project_id" value={id} />
              <div className="grid sm:grid-cols-3 gap-3">
                <label className="block">
                  <span className="text-xs font-semibold">People Impacted</span>
                  <input name="people_impacted" type="number" defaultValue={1200} required className="input mt-1 text-xs" />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold">Water Saved (L, optional)</span>
                  <input name="water_saved" type="number" defaultValue={45000} className="input mt-1 text-xs" />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold">Cost Saved (₹, optional)</span>
                  <input name="cost_saved" type="number" defaultValue={120000} className="input mt-1 text-xs" />
                </label>
              </div>
              <label className="block">
                <span className="text-xs font-semibold">Verification Notes / Observations</span>
                <input
                  name="notes"
                  defaultValue="Tested water telemetry kiosk in Jama Block. Over 1,200 residents accessing fluoride-safe drinking water."
                  className="input mt-1 text-xs"
                />
              </label>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition"
              >
                Log Impact Entry
              </button>
            </form>
          </details>
        )}
      </div>
    </div>
  );
}
