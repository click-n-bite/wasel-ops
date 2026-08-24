"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { AppUser } from "@/lib/types";
import { initials } from "@/lib/utils";
import { UserDetailSheet } from "./user-detail-sheet";

const COLUMNS = ["User", "Phone", "Country", "Orders", "Last active", ""];

export function UsersTable({ users }: { users: AppUser[] }) {
  const [selected, setSelected] = useState<AppUser | null>(null);

  return (
    <>
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border bg-secondary">
              {COLUMNS.map((h) => (
                <th key={h} className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide px-4 py-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u.id}
                onClick={() => setSelected(u)}
                className="border-b border-border last:border-0 hover:bg-secondary/60 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3 flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-[10.5px] font-semibold text-secondary-foreground">
                    {initials(u.name)}
                  </div>
                  <span className="text-[13px] font-medium text-foreground">{u.name}</span>
                </td>
                <td className="px-4 py-3 text-[12.5px] text-muted-foreground">{u.phone}</td>
                <td className="px-4 py-3 text-[12.5px] text-muted-foreground">{u.country}</td>
                <td className="px-4 py-3 text-[12.5px] text-muted-foreground">{u.orders}</td>
                <td className="px-4 py-3 text-[12.5px] text-muted-foreground">{u.lastActive}</td>
                <td className="px-4 py-3 text-right">
                  <ChevronRight size={15} className="text-muted-foreground inline" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <UserDetailSheet user={selected} onOpenChange={(open) => !open && setSelected(null)} />
    </>
  );
}
