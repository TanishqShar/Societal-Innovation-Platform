import Link from "next/link";
import { Bell } from "lucide-react";
import { getNotifications } from "@/lib/db";
import type { Role } from "@/lib/auth";

export async function NotificationBell({ role }: { role: Role }) {
  let unread = 0;
  try {
    const notifs = await getNotifications(role);
    unread = notifs.filter((n) => !n.is_read).length;
  } catch {
    // Non-critical — just show bell with no count
  }
  return (
    <Link href="/notifications" className="relative inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 hover:bg-white/15 transition">
      <Bell size={18} />
      {unread > 0 && (
        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent text-white text-[10px] font-bold grid place-items-center">
          {unread > 9 ? "9+" : unread}
        </span>
      )}
    </Link>
  );
}
