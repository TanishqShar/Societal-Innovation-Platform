import {
  GraduationCap,
  Sprout,
  HeartPulse,
  Droplets,
  Trash2,
  Trees,
  Zap,
  Building2,
  Accessibility,
  Landmark,
  Briefcase,
  type LucideIcon,
} from "lucide-react";
import { Category } from "./domain";

// Icon + colour for each thematic domain. `text`/`bg`/`ring` are Tailwind
// classes; `hex` is used for the small colour dot and chart accents.
export const CATEGORY_META: Record<
  Category,
  { Icon: LucideIcon; hex: string; text: string; bg: string }
> = {
  Education: { Icon: GraduationCap, hex: "#2563eb", text: "text-blue-700", bg: "bg-blue-50" },
  Agriculture: { Icon: Sprout, hex: "#16a34a", text: "text-green-700", bg: "bg-green-50" },
  Healthcare: { Icon: HeartPulse, hex: "#dc2626", text: "text-red-700", bg: "bg-red-50" },
  "Water Resources": { Icon: Droplets, hex: "#0891b2", text: "text-cyan-700", bg: "bg-cyan-50" },
  Sanitation: { Icon: Trash2, hex: "#7c3aed", text: "text-violet-700", bg: "bg-violet-50" },
  Environment: { Icon: Trees, hex: "#059669", text: "text-emerald-700", bg: "bg-emerald-50" },
  Energy: { Icon: Zap, hex: "#d97706", text: "text-amber-700", bg: "bg-amber-50" },
  "Urban Development": { Icon: Building2, hex: "#4f46e5", text: "text-indigo-700", bg: "bg-indigo-50" },
  Accessibility: { Icon: Accessibility, hex: "#db2777", text: "text-pink-700", bg: "bg-pink-50" },
  "Public Administration": { Icon: Landmark, hex: "#475569", text: "text-slate-700", bg: "bg-slate-100" },
  "Rural Livelihoods": { Icon: Briefcase, hex: "#ca8a04", text: "text-yellow-700", bg: "bg-yellow-50" },
};
