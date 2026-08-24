import { TopBar } from "@/components/layout/topbar";
import { KanbanBoard } from "@/components/conversations/kanban-board";

export default function ConversationsPage() {
  return (
    <>
      <TopBar
        title="Conversations"
        subtitle="Drag cards across pending, confirmed and out for delivery"
      />
      <KanbanBoard />
    </>
  );
}
