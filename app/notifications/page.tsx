import { Bell, CheckCircle2, Info, AlertTriangle, Zap } from "lucide-react";
import { getNotifications } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { markNotificationRead } from "@/app/actions";

export const metadata = { title: "Notifications · India Innovation Portal" };

const TYPE_META = {
  info: { Icon: Info, color: "text-blue-600 bg-blue-50" },
  success: { Icon: CheckCircle2, color: "text-green-600 bg-green-50" },
  warning: { Icon: AlertTriangle, color: "text-amber-600 bg-amber-50" },
  action: { Icon: Zap, color: "text-brand bg-brand/10" },
};

export default async function NotificationsPage() {
  const session = await getSession();
  const notifications = await getNotifications(session?.role);
  const unread = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Bell size={22} className="text-brand" />
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          {unread > 0 && <p className="text-sm text-black/50">{unread} unread</p>}
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="card p-12 text-center text-black/40">
          <Bell size={40} className="mx-auto mb-3 text-black/20" />
          No notifications yet.
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => {
            const meta = TYPE_META[n.type] ?? TYPE_META.info;
            const Icon = meta.Icon;
            return (
              <div key={n.id} className={`card p-4 ${!n.is_read ? "border-brand/25 bg-brand/[0.02]" : ""}`}>
                <div className="flex items-start gap-3">
                  <span className={`h-9 w-9 rounded-xl grid place-items-center shrink-0 ${meta.color}`}>
                    <Icon size={16} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div className="font-medium text-sm">{n.title}</div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-black/35">{new Date(n.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                        {!n.is_read && (
                          <form action={markNotificationRead}>
                            <input type="hidden" name="id" value={n.id} />
                            <button className="text-xs text-brand hover:underline">Mark read</button>
                          </form>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-black/55 mt-0.5">{n.message}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
