"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AlertTriangle, MessageSquare, RefreshCw, X } from "lucide-react";
import { NotificationType } from "@/lib/types";
import { useDashboardStore } from "@/store/use-dashboard-store";

const TYPE_META: Record<NotificationType, { icon: typeof MessageSquare; color: string; border: string }> = {
  message: { icon: MessageSquare, color: "#1D4ED8", border: "#BFDBFE" },
  status: { icon: RefreshCw, color: "#0F766E", border: "#99F6E4" },
  alert: { icon: AlertTriangle, color: "#B45309", border: "#FDE68A" },
};

const AUTO_DISMISS_MS = 5500;

export function ToastStack() {
  const toasts = useDashboardStore((s) => s.toasts);
  const dismissToast = useDashboardStore((s) => s.dismissToast);
  const markNotificationRead = useDashboardStore((s) => s.markNotificationRead);
  const openConversation = useDashboardStore((s) => s.openConversation);
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 w-80 pointer-events-none">
      {toasts.slice(-4).map((t) => {
        const meta = TYPE_META[t.type];
        const Icon = meta.icon;
        return (
          <ToastItem key={t.id} onDismiss={() => dismissToast(t.id)}>
            <div
              className="pointer-events-auto bg-card border rounded-xl shadow-lg px-3.5 py-3 flex items-start gap-2.5 cursor-pointer animate-slide-in-right"
              style={{ borderColor: meta.border }}
              onClick={() => {
                markNotificationRead(t.id);
                if (t.conversationId) {
                  openConversation(t.conversationId);
                  if (pathname !== "/conversations") router.push("/conversations");
                }
                dismissToast(t.id);
              }}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: `${meta.color}1A` }}
              >
                <Icon size={13} style={{ color: meta.color }} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[12.5px] font-semibold text-foreground truncate">{t.title}</p>
                <p className="text-[12px] text-muted-foreground line-clamp-2 mt-0.5">{t.body}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  dismissToast(t.id);
                }}
                className="text-slate-300 hover:text-slate-500 shrink-0 mt-0.5"
                aria-label="Dismiss"
              >
                <X size={14} />
              </button>
            </div>
          </ToastItem>
        );
      })}
    </div>
  );
}

function ToastItem({ children, onDismiss }: { children: React.ReactNode; onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <>{children}</>;
}
