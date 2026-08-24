"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, PhoneCall, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDashboardStore } from "@/store/use-dashboard-store";

export function SupportNumbersManager() {
  const numbers = useDashboardStore((s) => s.numbers);
  const addNumber = useDashboardStore((s) => s.addSupportNumber);
  const removeNumber = useDashboardStore((s) => s.removeSupportNumber);
  const moveNumber = useDashboardStore((s) => s.moveSupportNumber);

  const [label, setLabel] = useState("");
  const [num, setNum] = useState("");

  const sorted = [...numbers].sort((a, b) => a.priority - b.priority);

  const submit = () => {
    if (!num.trim()) return;
    addNumber(label.trim(), num.trim());
    setLabel("");
    setNum("");
  };

  return (
    <div className="max-w-xl">
      <p className="text-[12.5px] text-muted-foreground mb-4">
        Numbers that receive support notifications, ordered by priority. Top of the list is contacted first.
      </p>

      <div className="flex items-center gap-2 mb-4">
        <Input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Label (e.g. Support - Karim)"
          className="w-52"
        />
        <Input
          value={num}
          onChange={(e) => setNum(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="+961 ..."
          className="flex-1"
        />
        <Button onClick={submit} className="shrink-0">
          <Plus size={15} /> Add
        </Button>
      </div>

      <div className="bg-card rounded-xl border border-border divide-y divide-border">
        {sorted.map((n, i) => (
          <div key={n.id} className="flex items-center gap-3 px-4 py-3">
            <span className="w-6 h-6 rounded-full bg-secondary text-secondary-foreground text-[11px] font-semibold flex items-center justify-center shrink-0">
              {i + 1}
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
              <PhoneCall size={14} className="text-teal-600" />
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-foreground">{n.label}</p>
              <p className="text-[11.5px] text-muted-foreground">{n.number}</p>
            </div>
            <div className="ml-auto flex items-center gap-1">
              <button
                onClick={() => moveNumber(n.id, "up")}
                disabled={i === 0}
                className="text-muted-foreground hover:text-foreground disabled:opacity-30 p-1"
                aria-label="Raise priority"
              >
                <ArrowUp size={14} />
              </button>
              <button
                onClick={() => moveNumber(n.id, "down")}
                disabled={i === sorted.length - 1}
                className="text-muted-foreground hover:text-foreground disabled:opacity-30 p-1"
                aria-label="Lower priority"
              >
                <ArrowDown size={14} />
              </button>
              <button
                onClick={() => removeNumber(n.id)}
                className="text-muted-foreground hover:text-destructive p-1"
                aria-label="Remove number"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
