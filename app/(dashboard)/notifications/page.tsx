import { TopBar } from "@/components/layout/topbar";
import { SupportNumbersManager } from "@/components/notifications/support-numbers-manager";

export default function NotificationsPage() {
  return (
    <>
      <TopBar title="Support Numbers" subtitle="Who gets notified, and in what order" />
      <div className="flex-1 overflow-y-auto p-6">
        <SupportNumbersManager />
      </div>
    </>
  );
}
