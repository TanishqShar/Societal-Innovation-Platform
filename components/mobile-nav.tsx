"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

type NavItem = { href: string; label: string };

export function MobileNav({
  navItems,
  sessionName,
  sessionRole,
  logoutForm,
  notificationBell,
}: {
  navItems: NavItem[];
  sessionName?: string;
  sessionRole?: string;
  logoutForm: React.ReactNode;
  notificationBell?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => {
    const handler = () => setOpen(false);
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Mobile top-right controls */}
      <div className="flex items-center gap-2 ml-auto lg:hidden">
        {notificationBell}
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          className="p-2.5 rounded-xl bg-white/15 hover:bg-white/25 transition text-white"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Slide-down Drawer */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 bg-brand-dark text-white shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
          open ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="font-bold text-lg tracking-tight flex items-center gap-2"
          >
            <span className="inline-block h-6 w-6 rounded bg-accent shadow-xs" />
            Jharkhand Innovation
          </Link>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="p-2 rounded-xl bg-white/15 hover:bg-white/25 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="px-4 py-4 space-y-1">
          {navItems.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="flex items-center px-4 py-3 rounded-xl text-sm font-medium opacity-90 hover:opacity-100 hover:bg-white/10 transition"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        {/* User info + logout */}
        {(sessionName || sessionRole) && (
          <div className="px-4 pb-4 pt-2 border-t border-white/10 flex items-center justify-between gap-3">
            <div className="text-xs text-white/70">
              {sessionName && (
                <span className="font-semibold text-white">{sessionName}</span>
              )}
              {sessionRole && (
                <span className="text-white/50 ml-1">· {sessionRole}</span>
              )}
            </div>
            {logoutForm}
          </div>
        )}
      </div>
    </>
  );
}
