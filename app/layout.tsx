import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { getSession, ROLE_LABELS } from "@/lib/auth";
import { logout } from "@/app/actions";
import { NotificationBell } from "@/components/notification-bell";
import { ToastProvider } from "@/components/toast-provider";
import { MobileNav } from "@/components/mobile-nav";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "India Innovation Portal",
  description:
    "India Societal Innovation Collaboration Platform — connecting citizens, institutions, industry and government to solve real challenges across multiple states. Aligned with NEP 2020.",
};

const PUBLIC_NAV = [
  { href: "/", label: "Home" },
  { href: "/problems", label: "Challenges" },
  { href: "/solutions", label: "Solutions" },
];

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const session = await getSession();

  // Role-based navigation items
  const authNav = session
    ? [
        ...(session.role === "citizen"
          ? [
              { href: "/citizen", label: "Citizen Workspace" },
              { href: "/submit", label: "Report Problem" },
            ]
          : []),
        ...(session.role === "university"
          ? [
              { href: "/university", label: "University Workspace" },
              { href: "/projects", label: "Projects" },
            ]
          : []),
        ...(session.role === "industry"
          ? [
              { href: "/industry", label: "Industry Hub" },
              { href: "/projects", label: "Projects" },
            ]
          : []),
        ...(session.role === "government"
          ? [
              { href: "/analytics", label: "Command Center" },
              { href: "/projects", label: "Projects" },
            ]
          : []),
        ...(session.role === "admin"
          ? [
              { href: "/dashboard", label: "Admin Console" },
              { href: "/university", label: "University" },
              { href: "/industry", label: "Industry" },
              { href: "/analytics", label: "Command Center" },
              { href: "/projects", label: "Projects" },
            ]
          : []),
      ]
    : [
        { href: "/submit", label: "Report Problem" },
        { href: "/analytics", label: "Command Center" },
      ];

  const navItems = [...PUBLIC_NAV, ...authNav];

  const logoutFormNode = (
    <form action={logout}>
      <button className="rounded-lg bg-white/15 px-2.5 py-1 text-xs hover:bg-white/25 transition">
        Log out
      </button>
    </form>
  );

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ToastProvider>
          <header className="bg-brand-dark text-white shadow-sm sticky top-0 z-30">
            <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-x-4">
              {/* Logo — always visible */}
              <Link
                href="/"
                className="font-bold text-lg tracking-tight flex items-center gap-2 shrink-0"
              >
                <span className="inline-block h-6 w-6 rounded bg-accent shadow-xs" />
                <span className="hidden sm:inline">India Innovation Portal</span>
                <span className="sm:hidden">IN Portal</span>
              </Link>

              {/* Desktop nav — hidden on mobile (< lg) */}
              <nav className="hidden lg:flex flex-wrap gap-x-5 gap-y-1 text-sm ml-auto items-center">
                {navItems.map((n) => (
                  <Link
                    key={n.href}
                    href={n.href}
                    className="opacity-90 hover:opacity-100 hover:underline underline-offset-4 font-medium transition"
                  >
                    {n.label}
                  </Link>
                ))}

                {session ? (
                  <span className="flex items-center gap-2.5 ml-2 pl-3 border-l border-white/20">
                    <NotificationBell role={session.role} />
                    <span className="text-white/80 hidden sm:inline text-xs">
                      <span className="font-semibold">{session.name}</span>
                      <span className="text-white/50"> · {ROLE_LABELS[session.role]}</span>
                    </span>
                    <form action={logout}>
                      <button className="rounded-lg bg-white/15 px-2.5 py-1 text-xs hover:bg-white/25 transition">
                        Log out
                      </button>
                    </form>
                  </span>
                ) : (
                  <Link
                    href="/login"
                    className="ml-2 rounded-lg bg-accent text-white px-3.5 py-1 font-semibold text-xs hover:brightness-110 shadow-xs transition"
                  >
                    Sign in
                  </Link>
                )}
              </nav>

              {/* Mobile hamburger — hidden on desktop (lg+) */}
              <MobileNav
                navItems={[
                  ...navItems,
                  ...(!session ? [{ href: "/login", label: "Sign in" }] : []),
                ]}
                sessionName={session?.name}
                sessionRole={session ? ROLE_LABELS[session.role] : undefined}
                logoutForm={session ? logoutFormNode : <></>}
                notificationBell={
                  session ? <NotificationBell role={session.role} /> : undefined
                }
              />
            </div>
          </header>

          <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-6 md:py-8 pb-24 lg:pb-8">
            {children}
          </main>

          <footer className="border-t border-black/10 text-center text-xs text-black/50 py-5 bg-slate-50 px-4 hidden lg:block">
            India Societal Innovation Collaboration Portal · Multi-State Platform · Aligned with NEP 2020 · Jharkhand · Punjab · Maharashtra · Karnataka · Rajasthan
          </footer>

          {/* Mobile bottom navigation bar */}
          <MobileBottomNav role={session?.role} />
        </ToastProvider>
      </body>
    </html>
  );
}
