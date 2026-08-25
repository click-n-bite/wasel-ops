"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  MessageSquare,
  Settings2,
  Users,
  Globe2,
  Bell,
  Truck,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/conversations", label: "Conversations", icon: MessageSquare },
  { href: "/services", label: "Services", icon: Settings2 },
  { href: "/users", label: "Users", icon: Users },
  // { href: "/blacklist", label: "Blacklisted Countries", icon: Globe2 },
  { href: "/notifications", label: "Support Numbers", icon: Bell },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className="h-full flex flex-col shrink-0 bg-sidebar transition-all duration-200"
      style={{ width: collapsed ? 76 : 250 }}
    >
      <div className="flex items-center gap-2 px-4 h-16 border-b border-white/5">
        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0">
          <Truck size={17} className="text-sidebar" />
        </div>
        {!collapsed && (
          <span className="text-white font-semibold tracking-tight text-[15px]">
            Wasel Ops
          </span>
        )}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="ml-auto text-sidebar-foreground hover:text-white transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu size={18} />
        </button>
      </div>

      <nav className="flex-1 py-4 px-2 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-colors relative",
                isActive
                  ? "text-white bg-sidebar-active"
                  : "text-sidebar-foreground hover:text-white hover:bg-sidebar-active/60"
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-accent" />
              )}
              <Icon size={17} className="shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/5">
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-xs font-semibold shrink-0">
            OP
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-white text-[13px] font-medium truncate">Operations</p>
              <p className="text-sidebar-foreground text-[11px] truncate">admin@wasel.app</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
