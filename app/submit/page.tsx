import Link from "next/link";
import { ArrowLeft, ShieldCheck, Sparkles, Brain, CheckCircle2 } from "lucide-react";
import { MultiStepSubmitForm } from "@/components/multistep-submit-form";

export const metadata = { title: "Report a Community Challenge · India Innovation Portal" };

export default function SubmitPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link
          href="/citizen"
          className="inline-flex items-center gap-1.5 text-sm text-black/50 hover:text-brand mb-3 transition"
        >
          <ArrowLeft size={14} /> Back to Citizen Workspace
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Report a Community Challenge</h1>
        <p className="mt-2 text-black/60 leading-relaxed">
          Describe the local problem in your village, block, or ward. Our AI categorises the issue, estimates urgency, and directly routes it to higher education institutions equipped to build solutions.
        </p>
      </div>

      {/* Multi-step Progressive Form */}
      <MultiStepSubmitForm />

      {/* Help & Assurance Card */}
      <div className="rounded-2xl border border-black/5 bg-slate-50 p-4 text-xs text-black/55 flex items-start gap-3">
        <ShieldCheck size={18} className="text-emerald-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-slate-800">Public Interest & Civic Assurance:</span>
          <p>
            Submissions are publicly visible on the societal innovation portal without disclosing private contact details. Relevant institutions and government line departments are notified automatically upon review.
          </p>
        </div>
      </div>
    </div>
  );
}
