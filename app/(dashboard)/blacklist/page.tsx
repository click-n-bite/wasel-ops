import { TopBar } from "@/components/layout/topbar";
import { BlacklistManager } from "@/components/blacklist/blacklist-manager";

export default function BlacklistPage() {
  return (
    <>
      <TopBar title="Blacklisted Countries" subtitle="Block orders from these countries" />
      <div className="flex-1 overflow-y-auto p-6">
        <BlacklistManager />
      </div>
    </>
  );
}
