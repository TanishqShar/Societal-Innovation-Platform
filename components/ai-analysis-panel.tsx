import { Brain, AlertTriangle, CheckCircle2, Sparkles, Users, BookOpen, Lightbulb, Copy } from "lucide-react";
import type { AIAnalysis } from "@/lib/types";
import { PriorityBadge } from "@/components/badges";

export function AIAnalysisPanel({ analysis }: { analysis: AIAnalysis }) {
  const isGemini = analysis.ai_provider === "gemini";
  const isDuplicate = analysis.duplicate_score > 0.4;

  return (
    <div className="card p-5 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="font-semibold flex items-center gap-2">
          <Brain size={18} className="text-brand" />
          AI Analysis
        </h3>
        <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full ${isGemini ? "bg-violet-50 text-violet-700 ring-1 ring-violet-200" : "bg-slate-50 text-slate-600 ring-1 ring-slate-200"}`}>
          {isGemini ? <Sparkles size={11} /> : <CheckCircle2 size={11} />}
          {isGemini ? "Gemini AI" : "Rule-based classifier"}
        </span>
      </div>

      {/* Duplicate warning */}
      {isDuplicate && (
        <div className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 text-sm">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          <div>
            <strong>Possible duplicate detected</strong> — this challenge is {Math.round(analysis.duplicate_score * 100)}% similar to an existing submission.
            {analysis.similar_challenge_id && <span className="block text-xs mt-0.5 text-amber-600">Similar challenge ID: {analysis.similar_challenge_id}</span>}
          </div>
        </div>
      )}

      {/* Key scores */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <ScoreCard label="Priority" value={analysis.priority_score} max={100}>
          <PriorityBadge priority={analysis.priority} />
        </ScoreCard>
        <ScoreCard label="Impact" value={analysis.impact_score} max={100} />
        <ScoreCard label="Urgency" value={analysis.urgency_score} max={100} />
        <ScoreCard label="Confidence" value={Math.round(analysis.confidence_score * 100)} max={100} />
      </div>

      {/* Summary */}
      <div className="rounded-lg bg-brand/5 border border-brand/10 px-4 py-3">
        <p className="text-sm text-slate-700 leading-relaxed">{analysis.problem_summary}</p>
      </div>

      {/* Meta grid */}
      <div className="grid sm:grid-cols-2 gap-4 text-sm">
        <div>
          <div className="flex items-center gap-1.5 font-medium text-black/70 mb-2">
            <Users size={14} /> Affected Population
          </div>
          <div className="text-2xl font-bold text-brand">{analysis.affected_population.toLocaleString("en-IN")}</div>
          <div className="text-xs text-black/45">people directly impacted</div>
        </div>
        <div>
          <div className="flex items-center gap-1.5 font-medium text-black/70 mb-2">
            <Copy size={14} /> Duplicate Risk
          </div>
          <div className="text-2xl font-bold text-brand">{Math.round(analysis.duplicate_score * 100)}%</div>
          <div className="text-xs text-black/45">similarity to existing challenges</div>
        </div>
      </div>

      {/* Required disciplines */}
      {analysis.required_disciplines.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 font-medium text-black/70 mb-2 text-sm">
            <BookOpen size={14} /> Required Disciplines
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.required_disciplines.map((d) => (
              <span key={d} className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full ring-1 ring-indigo-100">
                {d}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Solution types */}
      {analysis.recommended_solution_types.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 font-medium text-black/70 mb-2 text-sm">
            <Lightbulb size={14} /> Recommended Approaches
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.recommended_solution_types.map((s) => (
              <span key={s} className="text-xs bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full ring-1 ring-amber-100">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ScoreCard({ label, value, max, children }: { label: string; value: number; max: number; children?: React.ReactNode }) {
  const pct = Math.min(100, (value / max) * 100);
  const color = pct >= 80 ? "bg-red-500" : pct >= 60 ? "bg-orange-400" : pct >= 40 ? "bg-amber-400" : "bg-green-400";
  return (
    <div className="rounded-xl border border-black/5 p-3 bg-slate-50">
      <div className="text-xs text-black/50 mb-1">{label}</div>
      {children ?? <div className="text-xl font-bold">{value}</div>}
      <div className="mt-2 h-1.5 bg-black/10 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
