"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Layers, BarChart2, FolderOpen, User, Plus, Building2, Factory } from "lucide-react";

type BottomNavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

const CITIZEN_NAV: BottomNavItem[] = [
  { href: "/", label: "Home", icon: <Home size={20} /> },
  { href: "/citizen", label: "Challenges", icon: <Layers size={20} /> },
  { href: "/submit", label: "Report", icon: <Plus size={20} /> },
  { href: "/problems", label: "Browse", icon: <BarChart2 size={20} /> },
];

const UNIVERSITY_NAV: BottomNavItem[] = [
  { href: "/", label: "Home", icon: <Home size={20} /> },
  { href: "/university", label: "Workspace", icon: <Building2 size={20} /> },
  { href: "/projects", label: "Projects", icon: <FolderOpen size={20} /> },
  { href: "/analytics", label: "Analytics", icon: <BarChart2 size={20} /> },
];

const INDUSTRY_NAV: BottomNavItem[] = [
  { href: "/", label: "Home", icon: <Home size={20} /> },
  { href: "/industry", label: "Industry Hub", icon: <Factory size={20} /> },
  { href: "/projects", label: "Projects", icon: <FolderOpen size={20} /> },
  { href: "/analytics", label: "Analytics", icon: <BarChart2 size={20} /> },
];

const GOVERNMENT_NAV: BottomNavItem[] = [
  { href: "/", label: "Home", icon: <Home size={20} /> },
  { href: "/analytics", label: "Command", icon: <BarChart2 size={20} /> },
  { href: "/projects", label: "Projects", icon: <FolderOpen size={20} /> },
  { href: "/dashboard", label: "Dashboard", icon: <User size={20} /> },
];

const ADMIN_NAV: BottomNavItem[] = [
  { href: "/dashboard", label: "Admin", icon: <User size={20} /> },
  { href: "/analytics", label: "Command", icon: <BarChart2 size={20} /> },
  { href: "/projects", label: "Projects", icon: <FolderOpen size={20} /> },
  { href: "/university", label: "University", icon: <Building2 size={20} /> },
];

const PUBLIC_NAV: BottomNavItem[] = [
  { href: "/", label: "Home", icon: <Home size={20} /> },
  { href: "/problems", label: "Challenges", icon: <Layers size={20} /> },
  { href: "/submit", label: "Report", icon: <Plus size={20} /> },
  { href: "/analytics", label: "Analytics", icon: <BarChart2 size={20} /> },
];

const NAV_BY_ROLE: Record<string, BottomNavItem[]> = {
  citizen: CITIZEN_NAV,
  university: UNIVERSITY_NAV,
  industry: INDUSTRY_NAV,
  government: GOVERNMENT_NAV,
  admin: ADMIN_NAV,
};

export function MobileBottomNav({ role }: { role?: string }) {
  const pathname = usePathname();
  const items = role ? (NAV_BY_ROLE[role] ?? PUBLIC_NAV) : PUBLIC_NAV;

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-black/10 shadow-[0_-2px_16px_rgba(0,0,0,0.08)]"
      aria-label="Mobile bottom navigation"
    >
      <div className="flex items-center">
        {items.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const isReport = item.label === "Report";

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-semibold transition-all min-h-[56px] ${
                isReport
                  ? "text-white bg-brand mx-1 rounded-t-2xl -mt-2 shadow-lg"
                  : isActive
                  ? "text-brand"
                  : "text-black/45 hover:text-brand"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <span className={isActive && !isReport ? "text-brand" : ""}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
      {/* iOS safe area padding */}
      <div className="h-[env(safe-area-inset-bottom,0px)]" />
    </nav>
  );
}
