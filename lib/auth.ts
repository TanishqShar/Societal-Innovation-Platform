import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Lightweight, demo-grade session. A signed/verified auth system (e.g. Supabase
// Auth) is the production upgrade path; this cookie-based version needs zero
// external config and demos reliably.

export type Role = "citizen" | "university" | "industry" | "government" | "admin";

export type Session = { name: string; role: Role };

export const SESSION_COOKIE = "sih_session";

export const ROLE_LABELS: Record<Role, string> = {
  citizen: "Citizen",
  university: "University",
  industry: "Industry Partner",
  government: "Government Official",
  admin: "Platform Admin",
};

export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    const validRoles: Role[] = ["citizen", "university", "industry", "government", "admin"];
    if (parsed?.name && validRoles.includes(parsed.role)) {
      return parsed as Session;
    }
  } catch {
    // ignore malformed cookie
  }
  return null;
}

/**
 * Server-side role guard. Call at the top of protected server components/actions.
 * Redirects to /login if the session is missing or the role is not in allowedRoles.
 */
export async function requireRole(...allowedRoles: Role[]): Promise<Session> {
  const session = await getSession();
  if (!session || !allowedRoles.includes(session.role)) {
    redirect("/login");
  }
  return session;
}

/** Returns true if session has at least one of the given roles. */
export function hasRole(session: Session | null, ...roles: Role[]): boolean {
  if (!session) return false;
  return roles.includes(session.role);
}

/** Returns true if session can manage platform data (admin or government). */
export function isStaff(session: Session | null): boolean {
  return hasRole(session, "admin", "government", "university");
}
