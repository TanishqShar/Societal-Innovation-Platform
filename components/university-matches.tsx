import { Building2, Sparkles, CheckCircle2 } from "lucide-react";
import type { UniversityMatch } from "@/lib/types";
import { assignChallenge } from "@/app/actions";

type Props = {
  matches: UniversityMatch[];
  challengeId: string;
  category: string;
  canAssign: boolean;
};

export function UniversityMatches({ matches, challengeId, category, canAssign }: Props) {
  return (
    <div className="card p-5">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Building2 size={18} className="text-brand" />
        Institution Matching &amp; Ranking
      </h3>
      <div className="space-y-3">
        {matches.slice(0, 5).map((m, i) => (
          <div key={m.name} className={`rounded-xl border p-4 ${i === 0 ? "border-brand/30 bg-brand/5" : "border-black/5 bg-slate-50"}`}>
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  {i === 0 && <span className="text-xs bg-brand text-white px-2 py-0.5 rounded-full font-medium">Best Match</span>}
                  <span className="font-semibold text-sm">{m.name}</span>
                </div>
                <p className="text-xs text-black/55 mt-1 leading-relaxed">{m.explanation}</p>
                {m.disciplines_matched.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {m.disciplines_matched.slice(0, 3).map((d) => (
                      <span key={d} className="text-xs bg-white text-brand-dark px-2 py-0.5 rounded-full ring-1 ring-brand/20">
                        <CheckCircle2 size={9} className="inline mr-1" />{d}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <ScoreRing score={m.score} />
                {canAssign && (
                  <form action={assignChallenge}>
                    <input type="hidden" name="id" value={challengeId} />
                    <input type="hidden" name="university" value={m.name} />
                    <input type="hidden" name="category" value={category} />
                    <button className="inline-flex items-center gap-1 rounded-md bg-brand text-white px-3 py-1.5 text-xs font-medium hover:bg-brand-dark">
                      <Sparkles size={11} /> Assign
                    </button>
                  </form>
                )}
              </div>
            </div>
            {/* Score breakdown */}
            <div className="grid grid-cols-4 gap-1 mt-3">
              <MiniBar label="Domain" value={m.domain_score} max={40} />
              <MiniBar label="Discipline" value={m.discipline_score} max={30} />
              <MiniBar label="Capability" value={m.capability_score} max={20} />
              <MiniBar label="Location" value={m.relevance_score} max={10} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScoreRing({ score }: { score: number }) {
  const color = score >= 80 ? "text-green-600" : score >= 60 ? "text-brand" : score >= 40 ? "text-amber-600" : "text-slate-500";
  return (
    <div className={`text-center ${color}`}>
      <div className="text-2xl font-bold leading-none">{score}</div>
      <div className="text-xs opacity-60">/100</div>
    </div>
  );
}

function MiniBar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="text-center">
      <div className="text-xs text-black/40 mb-1 truncate">{label}</div>
      <div className="h-1.5 bg-black/10 rounded-full overflow-hidden">
        <div className="h-full bg-brand rounded-full" style={{ width: `${pct}%` }} />
      </div>
      <div className="text-xs text-black/50 mt-0.5">{value}/{max}</div>
    </div>
  );
}
