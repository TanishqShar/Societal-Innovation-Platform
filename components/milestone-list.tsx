import { CheckCircle2, Clock, AlertTriangle, Circle, FileText, ExternalLink, ChevronDown } from "lucide-react";
import type { Milestone } from "@/lib/types";
import { completeMilestoneAction } from "@/app/actions";

type Props = { milestones: Milestone[]; projectId: string; canEdit: boolean };

const STATUS_CONFIG = {
  completed: { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50 border-green-200", label: "Completed" },
  in_progress: { icon: Clock, color: "text-blue-600", bg: "bg-blue-50 border-blue-200", label: "In Progress" },
  delayed: { icon: AlertTriangle, color: "text-red-500", bg: "bg-red-50 border-red-200", label: "Delayed" },
  pending: { icon: Circle, color: "text-slate-400", bg: "bg-slate-50 border-slate-100", label: "Pending" },
};

export function MilestoneList({ milestones, projectId, canEdit }: Props) {
  if (milestones.length === 0) {
    return (
      <div className="text-center text-black/40 py-8 text-sm">No milestones yet.</div>
    );
  }

  return (
    <div className="space-y-3">
      {milestones.map((m, i) => {
        const cfg = STATUS_CONFIG[m.status];
        const Icon = cfg.icon;
        return (
          <div key={m.id} className={`rounded-xl border px-4 py-3.5 ${cfg.bg} relative transition`}>
            {/* Connector line */}
            {i < milestones.length - 1 && (
              <div className="absolute left-6 top-full w-0.5 h-3 bg-black/10 z-0" />
            )}
            <div className="flex items-start gap-3">
              <Icon size={18} className={`${cfg.color} shrink-0 mt-0.5`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="font-semibold text-sm text-slate-900">{m.title}</span>
                  <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium ${cfg.bg} ${cfg.color} ring-1 ring-current ring-opacity-20`}>
                    {cfg.label}
                  </span>
                </div>

                {m.description && <p className="text-xs text-black/60 mt-1 leading-relaxed">{m.description}</p>}

                {/* Deliverable Proof-of-Work Link */}
                {m.deliverable_url && (
                  <div className="mt-2 flex items-center">
                    <a
                      href={m.deliverable_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-brand/30 text-brand text-xs font-semibold hover:bg-brand/5 hover:border-brand transition shadow-xs max-w-full truncate"
                      title={m.deliverable_url}
                    >
                      <FileText size={13} className="shrink-0 text-brand" />
                      <span className="truncate">View Deliverable / Verification Artifact</span>
                      <ExternalLink size={11} className="shrink-0 opacity-60" />
                    </a>
                  </div>
                )}

                <div className="flex items-center gap-4 mt-2.5 flex-wrap">
                  {m.deadline && (
                    <span className="text-xs text-black/50">
                      Target: <strong>{new Date(m.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</strong>
                    </span>
                  )}
                  {m.completed_at && (
                    <span className="text-xs text-green-700 font-medium">
                      ✓ Completed on {new Date(m.completed_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  )}
                </div>

                {/* Progress bar */}
                {m.progress > 0 && (
                  <div className="mt-2.5 h-1.5 bg-black/10 rounded-full overflow-hidden">
                    <div className="h-full bg-brand rounded-full transition-all duration-500" style={{ width: `${m.progress}%` }} />
                  </div>
                )}
              </div>

              {canEdit && m.status !== "completed" && (
                <div className="shrink-0">
                  <details className="relative">
                    <summary className="inline-flex items-center gap-1 rounded-lg bg-green-600 text-white px-2.5 py-1.5 text-xs font-semibold hover:bg-green-700 cursor-pointer shadow-xs list-none min-h-[32px]">
                      Complete <ChevronDown size={12} />
                    </summary>
                    <div className="fixed inset-x-4 bottom-4 sm:absolute sm:right-0 sm:top-full sm:inset-x-auto sm:mt-2 w-72 sm:w-80 max-w-[calc(100vw-2rem)] card p-4 z-30 shadow-2xl bg-white border border-black/15 animate-in fade-in">
                      <p className="text-xs font-bold text-slate-900 mb-2">Mark Milestone Completed</p>
                      <form action={completeMilestoneAction} className="space-y-3">
                        <input type="hidden" name="id" value={m.id} />
                        <input type="hidden" name="project_id" value={projectId} />
                        <label className="block">
                          <span className="text-[11px] font-medium text-slate-700">Attach Deliverable URL (optional)</span>
                          <input
                            name="deliverable_url"
                            type="url"
                            defaultValue={m.deliverable_url ?? ""}
                            placeholder="https://drive.google.com/... or github.com/..."
                            className="input mt-1 text-xs"
                          />
                        </label>
                        <button
                          type="submit"
                          className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-semibold text-xs rounded-lg transition"
                        >
                          Confirm Completion
                        </button>
                      </form>
                    </div>
                  </details>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
