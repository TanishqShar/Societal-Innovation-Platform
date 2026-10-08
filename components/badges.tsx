import { ChallengeStatus, CHALLENGE_STATUS_LABELS, ProjectStatus, PROJECT_STATUS_LABELS, Category, CATEGORIES, type Priority } from "@/lib/domain";
import { CATEGORY_META } from "@/lib/ui";

const STATUS_STYLES: Record<ChallengeStatus, string> = {
  submitted: "bg-slate-100 text-slate-700 ring-slate-200",
  under_review: "bg-amber-100 text-amber-800 ring-amber-200",
  validated: "bg-sky-100 text-sky-800 ring-sky-200",
  assigned: "bg-blue-100 text-blue-800 ring-blue-200",
  in_progress: "bg-purple-100 text-purple-800 ring-purple-200",
  completed: "bg-green-100 text-green-800 ring-green-200",
  deployed: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  rejected: "bg-red-100 text-red-700 ring-red-200",
};

const PROJECT_STATUS_STYLES: Record<ProjectStatus, string> = {
  planning: "bg-slate-100 text-slate-700 ring-slate-200",
  research: "bg-amber-100 text-amber-800 ring-amber-200",
  prototype: "bg-blue-100 text-blue-800 ring-blue-200",
  testing: "bg-violet-100 text-violet-800 ring-violet-200",
  pilot: "bg-purple-100 text-purple-800 ring-purple-200",
  deployment: "bg-orange-100 text-orange-800 ring-orange-200",
  completed: "bg-green-100 text-green-800 ring-green-200",
};

const PRIORITY_STYLES: Record<Priority, string> = {
  Critical: "bg-red-100 text-red-800 ring-red-300",
  High: "bg-orange-100 text-orange-800 ring-orange-200",
  Medium: "bg-yellow-100 text-yellow-800 ring-yellow-200",
  Low: "bg-slate-100 text-slate-600 ring-slate-200",
};

export function StatusBadge({ status }: { status: ChallengeStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${STATUS_STYLES[status] ?? "bg-slate-100 text-slate-700 ring-slate-200"}`}
    >
      {CHALLENGE_STATUS_LABELS[status] ?? status}
    </span>
  );
}

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${PROJECT_STATUS_STYLES[status] ?? "bg-slate-100 text-slate-700 ring-slate-200"}`}
    >
      {PROJECT_STATUS_LABELS[status] ?? status}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${PRIORITY_STYLES[priority]}`}
    >
      {priority}
    </span>
  );
}

function isCategory(c: string): c is Category {
  return (CATEGORIES as readonly string[]).includes(c);
}

export function CategoryBadge({ category }: { category: string }) {
  const meta = isCategory(category) ? CATEGORY_META[category] : null;
  if (!meta) {
    return (
      <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-700 px-2.5 py-0.5 text-xs font-medium">
        {category}
      </span>
    );
  }
  const { Icon, text, bg } = meta;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${bg} ${text}`}
    >
      <Icon size={12} strokeWidth={2.5} />
      {category}
    </span>
  );
}

const PROPOSAL_STYLES: Record<string, string> = {
  draft: "bg-slate-100 text-slate-700 ring-slate-200",
  submitted: "bg-amber-100 text-amber-800 ring-amber-200",
  under_review: "bg-blue-100 text-blue-800 ring-blue-200",
  approved: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  rejected: "bg-rose-100 text-rose-800 ring-rose-200",
};

export function ProposalStatusBadge({ status }: { status: string }) {
  const label = status.replace("_", " ").toUpperCase();
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${PROPOSAL_STYLES[status] ?? "bg-slate-100 text-slate-700 ring-slate-200"}`}
    >
      {label}
    </span>
  );
}

