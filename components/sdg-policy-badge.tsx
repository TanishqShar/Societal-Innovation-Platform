// SDG alignment badges and government scheme linkage component

type SDGMapping = {
  sdg: number;
  title: string;
  color: string;
  bg: string;
};

type GovernmentScheme = {
  code: string;
  name: string;
  ministry: string;
  color: string;
};

export const CATEGORY_SDG_MAP: Record<string, SDGMapping[]> = {
  "Water Resources": [
    { sdg: 6, title: "Clean Water & Sanitation", color: "text-blue-800", bg: "bg-blue-50 border-blue-200" },
    { sdg: 3, title: "Good Health & Well-being", color: "text-green-800", bg: "bg-green-50 border-green-200" },
  ],
  "Healthcare": [
    { sdg: 3, title: "Good Health & Well-being", color: "text-green-800", bg: "bg-green-50 border-green-200" },
    { sdg: 10, title: "Reduced Inequalities", color: "text-pink-800", bg: "bg-pink-50 border-pink-200" },
  ],
  "Agriculture": [
    { sdg: 2, title: "Zero Hunger", color: "text-yellow-800", bg: "bg-yellow-50 border-yellow-200" },
    { sdg: 15, title: "Life on Land", color: "text-emerald-800", bg: "bg-emerald-50 border-emerald-200" },
  ],
  "Education": [
    { sdg: 4, title: "Quality Education", color: "text-red-800", bg: "bg-red-50 border-red-200" },
    { sdg: 10, title: "Reduced Inequalities", color: "text-pink-800", bg: "bg-pink-50 border-pink-200" },
  ],
  "Environment": [
    { sdg: 13, title: "Climate Action", color: "text-slate-800", bg: "bg-slate-50 border-slate-200" },
    { sdg: 15, title: "Life on Land", color: "text-emerald-800", bg: "bg-emerald-50 border-emerald-200" },
  ],
  "Infrastructure": [
    { sdg: 9, title: "Industry & Innovation", color: "text-orange-800", bg: "bg-orange-50 border-orange-200" },
    { sdg: 11, title: "Sustainable Cities", color: "text-amber-800", bg: "bg-amber-50 border-amber-200" },
  ],
  "Sanitation": [
    { sdg: 6, title: "Clean Water & Sanitation", color: "text-blue-800", bg: "bg-blue-50 border-blue-200" },
    { sdg: 3, title: "Good Health & Well-being", color: "text-green-800", bg: "bg-green-50 border-green-200" },
  ],
  "Rural Livelihoods": [
    { sdg: 1, title: "No Poverty", color: "text-red-900", bg: "bg-red-50 border-red-200" },
    { sdg: 8, title: "Decent Work & Growth", color: "text-purple-800", bg: "bg-purple-50 border-purple-200" },
  ],
  "Urban Governance": [
    { sdg: 11, title: "Sustainable Cities", color: "text-amber-800", bg: "bg-amber-50 border-amber-200" },
    { sdg: 16, title: "Peace & Justice", color: "text-indigo-800", bg: "bg-indigo-50 border-indigo-200" },
  ],
  "Disaster Management": [
    { sdg: 11, title: "Sustainable Cities", color: "text-amber-800", bg: "bg-amber-50 border-amber-200" },
    { sdg: 13, title: "Climate Action", color: "text-slate-800", bg: "bg-slate-50 border-slate-200" },
  ],
  "Public Services": [
    { sdg: 16, title: "Peace & Justice", color: "text-indigo-800", bg: "bg-indigo-50 border-indigo-200" },
    { sdg: 17, title: "Partnerships", color: "text-blue-900", bg: "bg-blue-50 border-blue-200" },
  ],
};

export const CATEGORY_SCHEME_MAP: Record<string, GovernmentScheme[]> = {
  "Water Resources": [
    { code: "NRDWP", name: "National Rural Drinking Water Programme", ministry: "Jal Shakti Ministry", color: "bg-cyan-50 border-cyan-200 text-cyan-900" },
    { code: "JJM", name: "Jal Jeevan Mission (Har Ghar Jal)", ministry: "Govt. of India", color: "bg-blue-50 border-blue-200 text-blue-900" },
  ],
  "Healthcare": [
    { code: "NHM", name: "National Health Mission", ministry: "MoHFW", color: "bg-green-50 border-green-200 text-green-900" },
    { code: "PM-ABHIM", name: "PM Ayushman Bharat Health Infrastructure Mission", ministry: "Govt. of India", color: "bg-emerald-50 border-emerald-200 text-emerald-900" },
  ],
  "Agriculture": [
    { code: "PMKSY", name: "PM Krishi Sinchayi Yojana", ministry: "Agriculture Ministry", color: "bg-lime-50 border-lime-200 text-lime-900" },
    { code: "RKVY", name: "Rashtriya Krishi Vikas Yojana", ministry: "Agriculture Ministry", color: "bg-yellow-50 border-yellow-200 text-yellow-900" },
  ],
  "Education": [
    { code: "SAMAGRA", name: "Samagra Shiksha Abhiyan", ministry: "MoE", color: "bg-red-50 border-red-200 text-red-900" },
    { code: "NEP-2020", name: "National Education Policy Experiential Learning", ministry: "UGC/AICTE", color: "bg-rose-50 border-rose-200 text-rose-900" },
  ],
  "Environment": [
    { code: "CAMPA", name: "Compensatory Afforestation Fund Scheme", ministry: "MoEFCC", color: "bg-green-50 border-green-200 text-green-900" },
    { code: "NCAP", name: "National Clean Air Programme", ministry: "MoEFCC", color: "bg-teal-50 border-teal-200 text-teal-900" },
  ],
  "Sanitation": [
    { code: "SBM-G", name: "Swachh Bharat Mission – Gramin (Phase II)", ministry: "Jal Shakti Ministry", color: "bg-amber-50 border-amber-200 text-amber-900" },
    { code: "GOBAR-DHAN", name: "Galvanizing Organic Bio-Agro Resources Dhan", ministry: "Jal Shakti Ministry", color: "bg-orange-50 border-orange-200 text-orange-900" },
  ],
  "Rural Livelihoods": [
    { code: "MGNREGA", name: "Mahatma Gandhi NREGA", ministry: "Ministry of Rural Development", color: "bg-purple-50 border-purple-200 text-purple-900" },
    { code: "DAY-NRLM", name: "Deen Dayal Antyodaya Yojana – NRLM", ministry: "MoRD", color: "bg-violet-50 border-violet-200 text-violet-900" },
  ],
  "Infrastructure": [
    { code: "PMGSY", name: "PM Gram Sadak Yojana", ministry: "MoRD", color: "bg-orange-50 border-orange-200 text-orange-900" },
    { code: "BharatNet", name: "BharatNet Rural Broadband Programme", ministry: "MoCIT", color: "bg-sky-50 border-sky-200 text-sky-900" },
  ],
  "Urban Governance": [
    { code: "AMRUT", name: "Atal Mission for Rejuvenation & Urban Transformation", ministry: "MoHUA", color: "bg-indigo-50 border-indigo-200 text-indigo-900" },
    { code: "SmartCity", name: "Smart Cities Mission", ministry: "MoHUA", color: "bg-blue-50 border-blue-200 text-blue-900" },
  ],
  "Disaster Management": [
    { code: "SDRF", name: "State Disaster Response Fund", ministry: "NDMA / Jharkhand Govt", color: "bg-slate-50 border-slate-200 text-slate-900" },
    { code: "APDM", name: "Anticipatory Procurement for Disaster Management", ministry: "MHA", color: "bg-gray-50 border-gray-200 text-gray-900" },
  ],
  "Public Services": [
    { code: "NeGP", name: "National e-Governance Programme", ministry: "MeitY", color: "bg-blue-50 border-blue-200 text-blue-900" },
    { code: "JAM", name: "Jan Dhan – Aadhaar – Mobile Trinity", ministry: "DFS", color: "bg-indigo-50 border-indigo-200 text-indigo-900" },
  ],
};

export function SDGBadges({ category }: { category: string }) {
  const sdgs = CATEGORY_SDG_MAP[category] ?? [];
  if (!sdgs.length) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {sdgs.map((sdg) => (
        <span
          key={sdg.sdg}
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-semibold ${sdg.bg} ${sdg.color}`}
          title={`UN Sustainable Development Goal ${sdg.sdg}: ${sdg.title}`}
        >
          <span className="font-mono font-bold">SDG {sdg.sdg}</span>
          <span className="hidden sm:inline">· {sdg.title}</span>
        </span>
      ))}
    </div>
  );
}

export function SchemeBadges({ category }: { category: string }) {
  const schemes = CATEGORY_SCHEME_MAP[category] ?? [];
  if (!schemes.length) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {schemes.map((scheme) => (
        <span
          key={scheme.code}
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-semibold ${scheme.color}`}
          title={`${scheme.name} — ${scheme.ministry}`}
        >
          <span className="font-mono font-bold">{scheme.code}</span>
          <span className="hidden sm:inline truncate max-w-[130px]">· {scheme.name}</span>
        </span>
      ))}
    </div>
  );
}

export function SDGAndSchemePanel({ category }: { category: string }) {
  const sdgs = CATEGORY_SDG_MAP[category] ?? [];
  const schemes = CATEGORY_SCHEME_MAP[category] ?? [];

  if (!sdgs.length && !schemes.length) return null;

  return (
    <div className="rounded-2xl border border-black/8 bg-gradient-to-br from-slate-50 to-white p-4 space-y-3">
      {sdgs.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-[11px] font-bold text-black/50 uppercase tracking-wider">
            🌍 UN SDG Alignment
          </div>
          <SDGBadges category={category} />
        </div>
      )}
      {schemes.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-[11px] font-bold text-black/50 uppercase tracking-wider">
            🏛️ Government Schemes & Programmes
          </div>
          <SchemeBadges category={category} />
        </div>
      )}
    </div>
  );
}
