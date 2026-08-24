"use client";

import { Globe, Search } from "lucide-react";
import { NotificationBell } from "@/components/notifications/notification-bell";

export function TopBar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="h-16 flex items-center justify-between px-6 border-b border-border bg-card shrink-0 gap-4">
      <div className="min-w-0">
        <h1 className="text-[17px] font-semibold text-foreground tracking-tight">{title}</h1>
        {subtitle && <p className="text-[12.5px] text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-2 bg-secondary rounded-lg px-3 py-2 w-72">
          <Search size={15} className="text-muted-foreground" />
          <input
            placeholder="Search..."
            className="bg-transparent outline-none text-[13px] text-foreground placeholder:text-muted-foreground w-full"
          />
        </div>
        <NotificationBell />
        <Globe size={17}/>
      </div>
    </div>
  );
}
