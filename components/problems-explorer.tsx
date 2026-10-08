"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, MapPin, X, Inbox, ArrowUpRight } from "lucide-react";
import {
  Problem,
  CATEGORIES,
  STATES,
  STATE_DISTRICTS,
  CHALLENGE_STATUSES,
  CHALLENGE_STATUS_LABELS,
  PRIORITIES,
  type Priority,
  type ChallengeStatus,
} from "@/lib/domain";
import { StatusBadge, CategoryBadge, PriorityBadge } from "@/components/badges";

export function ProblemsExplorer({ problems }: { problems: Problem[] }) {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [district, setDistrict] = useState("");
  const [priority, setPriority] = useState<Priority | "">("");
  const [status, setStatus] = useState<ChallengeStatus | "">("");

  const availableDistricts = useMemo(() => {
    if (stateFilter && stateFilter in STATE_DISTRICTS) {
      return STATE_DISTRICTS[stateFilter as keyof typeof STATE_DISTRICTS];
    }
    return Object.values(STATE_DISTRICTS).flat();
  }, [stateFilter]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return problems.filter((p) => {
      const itemState = p.state ?? "Jharkhand";
      if (stateFilter && itemState !== stateFilter) return false;
      if (category && p.category !== category) return false;
      if (district && p.district !== district) return false;
      if (priority && p.priority !== priority) return false;
      if (status && p.status !== status) return false;
      if (
        needle &&
        !(`${p.title} ${p.description} ${p.district} ${itemState} ${p.category} ${p.subcategory ?? ""}`)
          .toLowerCase()
          .includes(needle)
      )
        return false;
      return true;
    });
  }, [problems, q, stateFilter, category, district, priority, status]);

  const hasFilters = q || stateFilter || category || district || priority || status;

  return (
    <div>
      {/* Filter bar */}
      <div className="card p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          <div className="relative sm:col-span-2 lg:col-span-2">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40"
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search challenges, keywords, location…"
              className="input pl-9 w-full"
            />
          </div>
          <select
            value={stateFilter}
            onChange={(e) => {
              setStateFilter(e.target.value);
              setDistrict("");
            }}
            className="input w-full"
          >
            <option value="">All States</option>
            {STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="input w-full"
          >
            <option value="">All districts</option>
            {availableDistricts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input w-full"
          >
            <option value="">All domains</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority | "")}
              className="input flex-1"
            >
              <option value="">Priority</option>
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ChallengeStatus | "")}
              className="input flex-1"
            >
              <option value="">Status</option>
              {CHALLENGE_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {CHALLENGE_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-3 pt-2 border-t border-black/5 flex items-center justify-between text-xs flex-wrap gap-2">
          <span className="text-black/55 font-medium">
            Showing <strong className="text-brand-dark">{filtered.length}</strong>{" "}
            of {problems.length} challenges
          </span>
          {hasFilters && (
            <button
              onClick={() => {
                setQ("");
                setStateFilter("");
                setCategory("");
                setDistrict("");
                setPriority("");
                setStatus("");
              }}
              className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 font-semibold"
            >
              <X size={13} /> Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center text-black/50">
          <Inbox className="mx-auto mb-3 text-black/25" size={40} />
          No challenges match your filters.
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p, i) => (
            <Link
              key={p.id}
              href={`/challenges/${p.id}`}
              className="card card-hover overflow-hidden flex flex-col group transition hover:-translate-y-0.5"
              style={{ animationDelay: `${Math.min(i, 12) * 25}ms` }}
            >
              {p.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.photo_url}
                  alt=""
                  className="h-40 w-full object-cover"
                />
              ) : (
                <div className="h-2 w-full bg-gradient-to-r from-brand to-brand-dark" />
              )}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <CategoryBadge category={p.category} />
                  <StatusBadge status={p.status} />
                  {p.priority && <PriorityBadge priority={p.priority} />}
                  <span className="text-[11px] text-black/40 ml-auto">
                    {new Date(p.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
                <h2 className="mt-3 font-bold text-slate-900 text-base leading-snug group-hover:text-brand transition flex items-start justify-between gap-2">
                  <span>{p.title}</span>
                  <ArrowUpRight size={16} className="text-black/30 group-hover:text-brand transition shrink-0 mt-0.5" />
                </h2>
                <p className="mt-2 text-xs text-black/60 line-clamp-3 leading-relaxed flex-1">
                  {p.description}
                </p>
                <div className="mt-4 pt-3 border-t border-black/5 text-[11px] text-black/55 flex items-center justify-between gap-2 flex-wrap">
                  <span className="flex items-center gap-1 font-semibold text-slate-700">
                    <MapPin size={12} className="text-brand" /> {p.district}, {p.state ?? "Jharkhand"}
                    {p.village_ward ? ` · ${p.village_ward}` : ""}
                  </span>
                  {p.assigned_to ? (
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold truncate max-w-[180px]">
                      {p.assigned_to}
                    </span>
                  ) : (
                    <span className="text-black/40 font-medium">Seeking Institution</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
