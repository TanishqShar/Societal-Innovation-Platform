"use client";

import React, { useState, useEffect } from "react";
import { Activity, CheckCircle2, FolderOpen, Sparkles, Users, Award, Zap } from "lucide-react";

type FeedEvent = {
  id: string;
  type: "milestone" | "project" | "patent" | "startup" | "challenge" | "feedback";
  title: string;
  subtitle: string;
  time: string;
  icon: React.ReactNode;
  color: string;
};

const SEED_EVENTS: FeedEvent[] = [
  {
    id: "evt-1",
    type: "milestone",
    title: "Milestone Completed",
    subtitle: "BIT Sindri: Fluoride filtration prototype lab-tested with 98.7% removal efficiency",
    time: "2 minutes ago",
    icon: <CheckCircle2 size={16} />,
    color: "bg-emerald-50 border-emerald-200 text-emerald-700",
  },
  {
    id: "evt-2",
    type: "project",
    title: "New Project Formed",
    subtitle: "IIT ISM Dhanbad accepts Bokaro industrial waste challenge — Project team assembled",
    time: "8 minutes ago",
    icon: <FolderOpen size={16} />,
    color: "bg-blue-50 border-blue-200 text-blue-700",
  },
  {
    id: "evt-3",
    type: "patent",
    title: "Patent Application Filed",
    subtitle: "Provisional patent filed: Solar IoT Fluoride Detection Module — Application #2024/JHK/00431",
    time: "23 minutes ago",
    icon: <Award size={16} />,
    color: "bg-purple-50 border-purple-200 text-purple-700",
  },
  {
    id: "evt-4",
    type: "challenge",
    title: "Challenge AI-Analyzed",
    subtitle: "New healthcare challenge from Gumla (Tribal Health Access) — TRL pathway computed",
    time: "41 minutes ago",
    icon: <Sparkles size={16} />,
    color: "bg-amber-50 border-amber-200 text-amber-700",
  },
  {
    id: "evt-5",
    type: "startup",
    title: "Startup Incubated",
    subtitle: "KisanVision AI Labs admitted to BAU Incubation Centre — DPIIT recognition in progress",
    time: "1 hour ago",
    icon: <Zap size={16} />,
    color: "bg-rose-50 border-rose-200 text-rose-700",
  },
  {
    id: "evt-6",
    type: "feedback",
    title: "Community Feedback Received",
    subtitle: "12 residents in Jama Block rated water filtration kiosk — Avg rating 4.8★/5",
    time: "2 hours ago",
    icon: <Users size={16} />,
    color: "bg-teal-50 border-teal-200 text-teal-700",
  },
  {
    id: "evt-7",
    type: "milestone",
    title: "Field Testing Launched",
    subtitle: "30-day live IoT water telemetry deployed across 20 monitoring stations, Damodar stretch",
    time: "3 hours ago",
    icon: <CheckCircle2 size={16} />,
    color: "bg-emerald-50 border-emerald-200 text-emerald-700",
  },
  {
    id: "evt-8",
    type: "project",
    title: "Industry Partner Joined",
    subtitle: "HealthTech India Pvt Ltd pledges ₹4,50,000 CSR for mobile rural clinic project",
    time: "4 hours ago",
    icon: <FolderOpen size={16} />,
    color: "bg-blue-50 border-blue-200 text-blue-700",
  },
];

// Simulated new events that trickle in after page load
const LIVE_UPDATES: Partial<FeedEvent>[] = [
  {
    id: "live-1",
    type: "challenge",
    title: "Challenge Validated",
    subtitle: "District Officer validated: Open Defecation in Pakur rural cluster — forwarded to BIT Mesra",
    time: "Just now",
    icon: <Sparkles size={16} />,
    color: "bg-amber-50 border-amber-200 text-amber-700",
  },
  {
    id: "live-2",
    type: "startup",
    title: "Licensing Request Filed",
    subtitle: "MSME enterprise from Jharia submitted commercial fabrication inquiry for IoT kiosk",
    time: "Just now",
    icon: <Zap size={16} />,
    color: "bg-rose-50 border-rose-200 text-rose-700",
  },
];

export function ActivityFeed({ compact = false }: { compact?: boolean }) {
  const [events, setEvents] = useState<FeedEvent[]>(SEED_EVENTS);
  const [liveIdx, setLiveIdx] = useState(0);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (liveIdx >= LIVE_UPDATES.length) return;
    const timer = setTimeout(() => {
      const next = { ...SEED_EVENTS[0], ...LIVE_UPDATES[liveIdx] } as FeedEvent;
      setEvents((prev) => [next, ...prev.slice(0, compact ? 5 : 10)]);
      setLiveIdx((i) => i + 1);
      setPulse(true);
      setTimeout(() => setPulse(false), 1500);
    }, 8000 + liveIdx * 12000);
    return () => clearTimeout(timer);
  }, [liveIdx, compact]);

  const displayEvents = compact ? events.slice(0, 5) : events;

  return (
    <div className="space-y-3">
      {/* Live indicator */}
      <div className="flex items-center gap-2">
        <span className={`flex items-center gap-1.5 text-xs font-semibold text-emerald-700 ${pulse ? "animate-pulse" : ""}`}>
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_4px_2px_rgba(16,185,129,0.4)]" />
          LIVE
        </span>
        <Activity size={14} className="text-black/40" />
        <span className="text-xs text-black/50">Statewide Innovation Activity</span>
      </div>

      <div className="space-y-2">
        {displayEvents.map((evt, i) => (
          <div
            key={evt.id}
            className={`flex items-start gap-3 p-3 rounded-xl border transition-all duration-500 ${evt.color} ${i === 0 && pulse ? "ring-2 ring-emerald-400/50 shadow-sm" : ""}`}
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <span className="shrink-0 mt-0.5">{evt.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-xs font-bold">{evt.title}</span>
                <span className="text-[10px] opacity-70 shrink-0">{evt.time}</span>
              </div>
              <p className="text-[11px] leading-relaxed mt-0.5 opacity-85 line-clamp-2">
                {evt.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
