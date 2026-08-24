"use client";

import { TopBar } from "@/components/layout/topbar";
import { ServiceCard } from "@/components/services/service-card";
import { useDashboardStore } from "@/store/use-dashboard-store";

export default function ServicesPage() {
  const services = useDashboardStore((s) => s.services);

  return (
    <>
      <TopBar title="Services" subtitle="Manage what's enabled for your customers" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </>
  );
}
