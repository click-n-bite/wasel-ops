"use client";

import { MapPin } from "lucide-react";
import { AppUser } from "@/lib/types";
import { initials } from "@/lib/utils";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export function UserDetailSheet({
  user,
  onOpenChange,
}: {
  user: AppUser | null;
  onOpenChange: (open: boolean) => void;
}) {
  if (!user) return null;

  return (
    <Sheet open={!!user} onOpenChange={onOpenChange}>
      <SheetContent widthClassName="max-w-sm">
        <div className="flex items-center gap-3 px-5 h-16 border-b border-border shrink-0">
          <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-[12px] font-semibold text-secondary-foreground">
            {initials(user.name)}
          </div>
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-foreground truncate">{user.name}</p>
            <p className="text-[11.5px] text-muted-foreground truncate">{user.phone}</p>
          </div>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-secondary rounded-lg p-3">
              <p className="text-[10.5px] text-muted-foreground uppercase tracking-wide">Country</p>
              <p className="text-[13px] font-semibold text-foreground mt-1 flex items-center gap-1">
                <MapPin size={12} /> {user.country}
              </p>
            </div>
            <div className="bg-secondary rounded-lg p-3">
              <p className="text-[10.5px] text-muted-foreground uppercase tracking-wide">Orders</p>
              <p className="text-[13px] font-semibold text-foreground mt-1">{user.orders}</p>
            </div>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Message history
            </p>
            <div className="space-y-2">
              {user.messages.map((m) => (
                <div key={m.id} className="bg-secondary rounded-lg px-3 py-2 text-[12.5px] text-foreground">
                  <span className="font-medium">{m.from === "agent" ? "Agent" : user.name}:</span> {m.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
