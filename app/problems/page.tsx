import Link from "next/link";
import { Plus, CheckCircle2 } from "lucide-react";
import { getProblems } from "@/lib/db";
import { ProblemsExplorer } from "@/components/problems-explorer";

export const metadata = { title: "Problems · India Innovation Portal" };

export default async function ProblemsPage({
  searchParams,
}: PageProps<"/problems">) {
  const params = await searchParams;
  const justSubmitted = params?.submitted === "1";
  const problems = await getProblems();

  return (
    <div>
      <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Community challenges
          </h1>
          <p className="text-black/60 mt-1">
            Browse and filter problems submitted across India.
          </p>
        </div>
        <Link
          href="/submit"
          className="w-full sm:w-auto inline-flex items-center justify-center min-h-[44px] gap-2 rounded-lg bg-brand px-4 py-2.5 font-semibold text-white hover:bg-brand-dark shadow-sm"
        >
          <Plus size={18} /> Report a Problem
        </Link>
      </div>

      {justSubmitted && (
        <div className="mb-6 flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 text-green-800 px-4 py-3 text-sm animate-in">
          <CheckCircle2 size={18} />
          Your problem was submitted and automatically categorised. Thank you for
          contributing!
        </div>
      )}

      <ProblemsExplorer problems={problems} />
    </div>
  );
}
