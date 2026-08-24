"use client";

import { Settings2 } from "lucide-react";
import { Service } from "@/lib/types";
import { Switch } from "@/components/ui/switch";
import { useDashboardStore } from "@/store/use-dashboard-store";

export function ServiceCard({ service }: { service: Service }) {
  const toggleService = useDashboardStore((s) => s.toggleService);

  return (
    <div className="bg-card rounded-xl border border-border p-4 flex items-start justify-between gap-3">
      <div className="flex items-start gap-3 min-w-0">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: service.enabled ? "#F0FDFA" : "hsl(var(--secondary))" }}
        >
          <Settings2 size={16} className={service.enabled ? "text-teal-600" : "text-muted-foreground"} />
        </div>
        <div className="min-w-0">
          <p className="text-[13.5px] font-semibold text-foreground">{service.name}</p>
          <p className="text-[12px] text-muted-foreground mt-0.5">{service.description}</p>
          <span
            className="inline-block mt-2 text-[10.5px] font-medium px-2 py-0.5 rounded-full"
            style={{
              background: service.enabled ? "#F0FDFA" : "hsl(var(--secondary))",
              color: service.enabled ? "#0D9488" : "hsl(var(--muted-foreground))",
            }}
          >
            {service.enabled ? "Enabled" : "Disabled"}
          </span>
        </div>
      </div>
      <Switch checked={service.enabled} onCheckedChange={() => toggleService(service.id)} />
    </div>
  );
}
