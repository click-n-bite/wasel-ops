"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AlertTriangle, Bell, CheckCheck, MessageSquare, RefreshCw } from "lucide-react";
import { AppNotification, NotificationType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useDashboardStore } from "@/store/use-dashboard-store";

const TYPE_META: Record<NotificationType, { icon: typeof Bell; bg: string; color: string }> = {
  message: { icon: MessageSquare, bg: "#EFF6FF", color: "#1D4ED8" },
  status: { icon: RefreshCw, bg: "#F0FDFA", color: "#0F766E" },
  alert: { icon: AlertTriangle, bg: "#FFFBEB", color: "#B45309" },
};

function relativeTime(createdAt: number) {
  const diffMs = Date.now() - createdAt;
  const diffSec = Math.round(diffMs / 1000);
  if (diffSec < 10) return "just now";
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${Math.round(diffHr / 24)}d ago`;
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const notifications = useDashboardStore((s) => s.notifications);
  const unreadCount = useDashboardStore((s) => s.unreadCount);
  const connected = useDashboardStore((s) => s.connected);
  const markNotificationRead = useDashboardStore((s) => s.markNotificationRead);
  const markAllNotificationsRead = useDashboardStore((s) => s.markAllNotificationsRead);
  const openConversation = useDashboardStore((s) => s.openConversation);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const handleSelect = (n: AppNotification) => {
    markNotificationRead(n.id);
    if (n.conversationId) {
      openConversation(n.conversationId);
      if (pathname !== "/conversations") router.push("/conversations");
    }
    setOpen(false);
  };

  return (
    <div className="relative shrink-0" ref={panelRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        aria-label="Notifications"
      >
        <Bell size={17} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-destructive text-white text-[10px] font-semibold flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
        <span
          className={cn(
            "absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full border border-card",
            connected ? "bg-emerald-500" : "bg-slate-300"
          )}
          title={connected ? "Live" : "Reconnecting…"}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-80 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-1.5">
              <span className="text-[13px] font-semibold text-foreground">Notifications</span>
              <span
                className={cn(
                  "text-[10px] font-medium px-1.5 py-0.5 rounded-full",
                  connected ? "bg-emerald-50 text-emerald-600" : "bg-secondary text-muted-foreground"
                )}
              >
                {connected ? "Live" : "Offline"}
              </span>
            </div>
            {notifications.length > 0 && (
              <button
                onClick={() => markAllNotificationsRead()}
                className="flex items-center gap-1 text-[11.5px] text-muted-foreground hover:text-foreground"
              >
                <CheckCheck size={13} /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto scrollbar-thin divide-y divide-border">
            {notifications.length === 0 && (
              <div className="px-4 py-10 text-center text-[12.5px] text-muted-foreground">
                No notifications yet
              </div>
            )}
            {notifications.map((n) => {
              const meta = TYPE_META[n.type];
              const Icon = meta.icon;
              return (
                <button
                  key={n.id}
                  onClick={() => handleSelect(n)}
                  className={cn(
                    "w-full text-left flex items-start gap-2.5 px-4 py-3 hover:bg-secondary/60 transition-colors",
                    !n.read && "bg-accent/5"
                  )}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: meta.bg }}
                  >
                    <Icon size={13} style={{ color: meta.color }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="text-[12.5px] font-semibold text-foreground truncate">{n.title}</p>
                      {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />}
                    </div>
                    <p className="text-[12px] text-muted-foreground line-clamp-2 mt-0.5">{n.body}</p>
                    <p className="text-[10.5px] text-slate-400 mt-1">{relativeTime(n.createdAt)}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
