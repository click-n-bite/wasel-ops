"use client";

import { TopBar } from "@/components/layout/topbar";
import { UsersTable } from "@/components/users/users-table";
import { useDashboardStore } from "@/store/use-dashboard-store";

export default function UsersPage() {
  const users = useDashboardStore((s) => s.users);

  return (
    <>
      <TopBar title="Users" subtitle="Everyone who has messaged you" />
      <div className="flex-1 overflow-y-auto p-6">
        <UsersTable users={users} />
      </div>
    </>
  );
}
