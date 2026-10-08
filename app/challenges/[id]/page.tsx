import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  Calendar,
  User,
  ArrowLeft,
  FolderOpen,
  CheckCircle2,
  Building2,
  ChevronRight,
  Share2,
  Video,
} from "lucide-react";
import { getProblemById, getAnalysis, getProjectByChallenge, getFeedback, getProblems, getReusableSolutions } from "@/lib/db";
import { rankUniversities } from "@/lib/matching";
import { findSimilarProblems } from "@/lib/similarity";
import { getSession, hasRole } from "@/lib/auth";
import { StatusBadge, CategoryBadge, PriorityBadge } from "@/components/badges";
import { AIAnalysisPanel } from "@/components/ai-analysis-panel";
import { UniversityMatches } from "@/components/university-matches";
import { SimilarAndSolutionsSection } from "@/components/similar-and-solutions";
import { submitFeedback, acceptChallengeAction } from "@/app/actions";
import { SDGAndSchemePanel } from "@/components/sdg-policy-badge";

export const metadata = { title: "Challenge Detail · India Innovation Portal" };

const STATE_PREFIX_MAP: Record<string, string> = {
  Jharkhand: "JH",
  Punjab: "PB",
  Maharashtra: "MH",
  Karnataka: "KA",
  Rajasthan: "RJ",
};

const TIMELINE_STAGES = [
  { key: "submitted", label: "Submitted" },
  { key: "under_review", label: "AI Analyzed" },
  { key: "validated", label: "Validated" },
  { key: "assigned", label: "Assigned" },
  { key: "in_progress", label: "Project Active" },
  { key: "completed", label: "Testing / Pilot" },
  { key: "deployed", label: "Deployed" },
];

export default async function ChallengeDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ submitted?: string }>;
}) {
  const { id } = await params;
  const { submitted } = await searchParams;

  const [problem, analysis, project, feedbackList, session, allProblems] = await Promise.all([
    getProblemById(id),
    getAnalysis(id),
    getProjectByChallenge(id),
    getFeedback(id),
    getSession(),
    getProblems(),
  ]);

  if (!problem) notFound();

  const [reusableSolutions, similarResult] = await Promise.all([
    getReusableSolutions(problem),
    Promise.resolve(findSimilarProblems(problem, allProblems)),
  ]);

  const canAssign = hasRole(session, "admin", "government");
  const isUniversity = hasRole(session, "university");
  const itemState = problem.state ?? "Jharkhand";
  const prefix = STATE_PREFIX_MAP[itemState] ?? "IN";
  const displayId = `${prefix}-` + problem.id.replace(/[^a-zA-Z0-9]/g, "").slice(0, 5).toUpperCase();

  const universities = analysis
    ? rankUniversities(problem.category, analysis.required_disciplines, {
        state: itemState,
        district: problem.district,
        expertiseNeeded: analysis.relevant_expertise,
        title: problem.title,
        description: problem.description,
      })
    : rankUniversities(problem.category, [], {
        state: itemState,
        district: problem.district,
        title: problem.title,
        description: problem.description,
      });

  // Determine stage progress for timeline
  const stageOrder = ["submitted", "under_review", "validated", "assigned", "in_progress", "completed", "deployed"];
  const currentIdx = stageOrder.indexOf(problem.status);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Link
          href="/citizen"
          className="inline-flex items-center gap-1.5 text-sm text-black/50 hover:text-brand transition"
        >
          <ArrowLeft size={15} /> Back to Challenges
        </Link>
        <span className="font-mono text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
          Challenge #{displayId}
        </span>
      </div>

      {/* NEW SUBMISSION CELEBRATION & AI RESULT BANNER */}
      {submitted === "1" && (
        <div className="rounded-2xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-6 shadow-md animate-in fade-in slide-in-from-top-4 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="h-10 w-10 rounded-full bg-emerald-400/20 grid place-items-center text-emerald-300">
                <CheckCircle2 size={24} />
              </span>
              <div>
                <h2 className="text-xl font-bold">Challenge Submitted Successfully!</h2>
                <p className="text-xs text-emerald-200 mt-0.5">
                  AI automated analysis and HEI matching completed. Your problem is now live for validation and university adoption.
                </p>
              </div>
            </div>
            <span className="text-xs bg-emerald-700/50 border border-emerald-500/30 px-3 py-1 rounded-full text-emerald-100 font-mono">
              #{displayId}
            </span>
          </div>

          {/* Quick AI Highlights in Banner */}
          {analysis && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-emerald-700/60 text-xs">
              <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-600/30">
                <span className="text-emerald-300">Thematic Domain:</span>
                <div className="font-bold text-sm text-white mt-0.5">{analysis.category}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-600/30">
                <span className="text-emerald-300">Urgency Score:</span>
                <div className="font-bold text-sm text-white mt-0.5">{analysis.urgency_score || 88}/100</div>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-600/30">
                <span className="text-emerald-300">Affected Population:</span>
                <div className="font-bold text-sm text-white mt-0.5">~{analysis.affected_population.toLocaleString("en-IN")} citizens</div>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-600/30">
                <span className="text-emerald-300">Top Match HEI:</span>
                <div className="font-bold text-sm text-white mt-0.5">{universities[0]?.name} ({universities[0]?.score}%)</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Challenge Header */}
      <div className="card p-6 space-y-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <CategoryBadge category={problem.category} />
              <StatusBadge status={problem.status} />
              {problem.priority && <PriorityBadge priority={problem.priority} />}
              {problem.subcategory && (
                <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-medium">
                  {problem.subcategory}
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 leading-snug break-words">
              {problem.title}
            </h1>

            <div className="flex items-center gap-4 text-xs text-black/55 flex-wrap pt-1">
              <span className="flex items-center gap-1 font-semibold text-slate-700">
                <MapPin size={13} className="text-brand" /> {problem.district}, {itemState}
                {problem.village_ward && <span className="font-normal text-black/50">· {problem.village_ward}</span>}
              </span>
              {problem.submitter_name && (
                <span className="flex items-center gap-1">
                  <User size={13} /> {problem.submitter_name}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar size={13} />
                {new Date(problem.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* Quick Action / Project Banner */}
          <div className="w-full sm:w-auto shrink-0 flex items-center gap-2">
            {project ? (
              <Link
                href={`/projects/${project.id}`}
                className="w-full sm:w-auto justify-center min-h-[44px] inline-flex items-center gap-2 rounded-xl bg-brand text-white px-5 py-2.5 text-sm font-semibold hover:bg-brand-dark transition shadow-sm"
              >
                <FolderOpen size={16} /> View Active Project ({project.progress}%)
              </Link>
            ) : isUniversity ? (
              <form action={acceptChallengeAction} className="w-full sm:w-auto">
                <input type="hidden" name="id" value={id} />
                <input type="hidden" name="university_name" value={session?.name || "BIT Sindri"} />
                <button
                  type="submit"
                  className="w-full sm:w-auto justify-center min-h-[44px] inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-emerald-700 transition shadow-sm"
                >
                  <Building2 size={16} /> Accept Challenge for Solution
                </button>
              </form>
            ) : null}
          </div>
        </div>

        {/* Visual Lifecycle Timeline */}
        <div className="pt-4 border-t border-black/5">
          <div className="text-xs font-semibold text-black/45 mb-3 uppercase tracking-wider">
            Challenge Lifecycle & Transparency Progress
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-7 gap-2 text-xs">
            {TIMELINE_STAGES.map((stage, idx) => {
              const isPast = idx < currentIdx;
              const isCurrent = idx === currentIdx;

              return (
                <div
                  key={stage.key}
                  className={`p-2 rounded-lg border text-center transition ${
                    isCurrent
                      ? "bg-brand/10 border-brand/40 text-brand-dark font-bold shadow-xs"
                      : isPast
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800 font-medium"
                      : "bg-slate-50 border-slate-200 text-slate-400"
                  }`}
                >
                  <div className="text-[10px] mb-0.5 font-mono">
                    {isPast ? "✓ Done" : isCurrent ? "● Active" : `Step ${idx + 1}`}
                  </div>
                  <div className="truncate">{stage.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Description, SDG Alignment & Evidence */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="card p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Problem Statement & Background</h2>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{problem.description}</p>

            {problem.assigned_to && (
              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-between text-xs flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Building2 size={16} className="text-blue-700" />
                  <span>
                    Assigned Institution: <strong>{problem.assigned_to}</strong>
                  </span>
                </div>
                <span className="text-blue-700 font-medium">Under Solution Development</span>
              </div>
            )}
          </div>

          {/* SDG & Government Scheme Alignment */}
          <SDGAndSchemePanel category={problem.category} />
        </div>

        <div className="space-y-4">
          <div className="card p-5 space-y-3">
            <h2 className="text-sm font-bold text-slate-900">Photo / Ground Evidence</h2>
            {problem.photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={problem.photo_url}
                alt="Challenge Evidence"
                className="w-full h-44 object-cover rounded-xl border border-black/5"
              />
            ) : (
              <div className="h-44 rounded-xl bg-slate-100 border border-dashed border-slate-300 grid place-items-center text-xs text-black/40 text-center p-4">
                Visual evidence filed directly from field survey.
              </div>
            )}
            <div className="text-[11px] text-black/45 leading-snug">
              Recorded in: <strong>{problem.district}</strong>
              {problem.village_ward ? `, ${problem.village_ward}` : ""}
            </div>
          </div>

          {/* Video Evidence Player */}
          {problem.video_url ? (
            <div className="card p-5 space-y-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Video size={15} className="text-rose-600" /> Video Evidence
              </h2>
              <video
                src={problem.video_url}
                controls
                className="w-full rounded-xl border border-black/5 max-h-48 bg-black"
                preload="metadata"
              />
            </div>
          ) : null}

          {/* Share / Document links */}
          {problem.document_url && (
            <div className="card p-4">
              <a
                href={problem.document_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-brand hover:underline"
              >
                <Share2 size={14} /> View Attached Document / Survey Report
              </a>
            </div>
          )}
        </div>
      </div>

      {/* AI Analysis Panel & University Matching Engine */}
      <div className="grid lg:grid-cols-2 gap-6">
        {analysis ? (
          <AIAnalysisPanel analysis={analysis} />
        ) : (
          <div className="card p-8 text-center text-black/40 text-sm">
            AI analysis computing...
          </div>
        )}

        <UniversityMatches
          matches={universities}
          challengeId={id}
          category={problem.category}
          canAssign={canAssign}
        />
      </div>

      {/* Similar Problems & Solution Repository */}
      <SimilarAndSolutionsSection
        currentProblem={problem}
        similar={similarResult}
        reusableSolutions={reusableSolutions}
      />

      {/* Active Project Card */}
      {project && (
        <div className="card p-6 bg-gradient-to-br from-brand/5 to-emerald-50 border border-brand/20 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <FolderOpen size={20} className="text-brand" />
              <h3 className="font-bold text-base text-slate-900">Active Multidisciplinary Project</h3>
            </div>
            <Link
              href={`/projects/${project.id}`}
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
            >
              Open Project Hub <ChevronRight size={14} />
            </Link>
          </div>

          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="font-semibold text-base text-slate-900">{project.title}</div>
              <div className="text-xs text-black/60 mt-0.5">
                Led by <strong>{project.university_name}</strong>
                {project.industry_partner && <span> · Partner: {project.industry_partner}</span>}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-brand">{project.progress}%</div>
              <div className="text-xs text-black/45">milestone completion</div>
            </div>
          </div>

          <div className="h-2.5 bg-black/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand rounded-full transition-all duration-500"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Citizen & Community Feedback Loop */}
      <div className="card p-6 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="font-bold text-lg text-slate-900">Community Feedback & Satisfaction</h3>
            <p className="text-xs text-black/55 mt-0.5">
              Residents and beneficiaries provide ground feedback once solutions are piloted or deployed.
            </p>
          </div>
          {feedbackList.length > 0 && (
            <span className="text-xs bg-emerald-50 text-emerald-800 font-semibold px-2.5 py-1 rounded-full border border-emerald-200">
              {feedbackList.length} reviews recorded
            </span>
          )}
        </div>

        {/* Feedback List */}
        {feedbackList.length > 0 ? (
          <div className="space-y-3">
            {feedbackList.map((f) => (
              <div key={f.id} className="p-4 rounded-xl bg-slate-50 border border-black/5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-slate-900">{f.submitter_name}</span>
                  <span className="text-xs text-amber-500 tracking-wider">
                    {"★".repeat(f.rating)}
                    {"☆".repeat(5 - f.rating)}
                  </span>
                </div>
                {f.comment && <p className="text-xs text-slate-700 leading-relaxed">{f.comment}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-black/40 italic py-2">
            No community feedback logged yet. Beneficiaries can submit their review below.
          </p>
        )}

        {/* Submit Feedback Form */}
        <form action={submitFeedback} className="space-y-3 pt-4 border-t border-black/5">
          <input type="hidden" name="challenge_id" value={id} />
          <input type="hidden" name="project_id" value={project?.id ?? ""} />

          <div className="grid sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs font-semibold">Your Name or Organization</span>
              <input name="submitter_name" placeholder="e.g. Santosh Soren" className="input mt-1 text-sm" />
            </label>

            <label className="block">
              <span className="text-xs font-semibold">Satisfaction Rating</span>
              <select name="rating" defaultValue="5" className="input mt-1 text-sm">
                <option value="5">★★★★★ — 5 Stars (Highly Effective)</option>
                <option value="4">★★★★☆ — 4 Stars (Effective)</option>
                <option value="3">★★★☆☆ — 3 Stars (Satisfactory)</option>
                <option value="2">★★☆☆☆ — 2 Stars (Needs Improvement)</option>
                <option value="1">★☆☆☆☆ — 1 Star (Ineffective)</option>
              </select>
            </label>
          </div>

          <label className="block">
            <span className="text-xs font-semibold">Feedback Comment</span>
            <textarea
              name="comment"
              rows={3}
              placeholder="How has this solution or university project improved conditions in your community?"
              className="input mt-1 text-sm leading-relaxed"
            />
          </label>

          <button
            type="submit"
            className="w-full sm:w-auto min-h-[44px] rounded-lg bg-brand text-white px-5 py-2.5 font-semibold hover:bg-brand-dark text-sm transition shadow-sm inline-flex items-center justify-center"
          >
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
}
