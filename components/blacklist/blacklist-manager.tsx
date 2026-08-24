"use client";

import { useState } from "react";
import { Ban, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDashboardStore } from "@/store/use-dashboard-store";

export function BlacklistManager() {
  const blacklist = useDashboardStore((s) => s.blacklist);
  const addCountry = useDashboardStore((s) => s.addBlacklistCountry);
  const removeCountry = useDashboardStore((s) => s.removeBlacklistCountry);
  const [name, setName] = useState("");

  const submit = () => {
    if (!name.trim()) return;
    addCountry(name.trim());
    setName("");
  };

  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-2 mb-4">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Add a country to blacklist..."
        />
        <Button onClick={submit} className="shrink-0">
          <Plus size={15} /> Add
        </Button>
      </div>

      <div className="bg-card rounded-xl border border-border divide-y divide-border">
        {blacklist.length === 0 && (
          <p className="text-[13px] text-muted-foreground text-center py-8">No blacklisted countries yet.</p>
        )}
        {blacklist.map((c) => (
          <div key={c.id} className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
              <Ban size={14} className="text-destructive" />
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-foreground">{c.name}</p>
              <p className="text-[11px] text-muted-foreground">Code: {c.code}</p>
            </div>
            <button
              onClick={() => removeCountry(c.id)}
              className="ml-auto text-muted-foreground hover:text-destructive transition-colors"
              aria-label="Remove country"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
