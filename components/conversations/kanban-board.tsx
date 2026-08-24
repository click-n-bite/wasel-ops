"use client";

import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { useDashboardStore } from "@/store/use-dashboard-store";
import { Conversation, ConversationStatus } from "@/lib/types";
import { STATUS_ORDER } from "@/lib/status-meta";
import { KanbanColumn } from "./kanban-column";
import { ConversationDetailSheet } from "./conversation-detail-sheet";

export function KanbanBoard() {
  const conversations = useDashboardStore((s) => s.conversations);
  const setConversationStatus = useDashboardStore((s) => s.setConversationStatus);
  const openConversationId = useDashboardStore((s) => s.openConversationId);
  const openConversation = useDashboardStore((s) => s.openConversation);
  const closeConversation = useDashboardStore((s) => s.closeConversation);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const activeConversation = conversations.find((c) => c.id === openConversationId) ?? null;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const newStatus = over.id as ConversationStatus;
    if (!STATUS_ORDER.includes(newStatus)) return;
    setConversationStatus(active.id as string, newStatus);
  };

  return (
    <div className="flex-1 overflow-x-auto p-6 scrollbar-thin">
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 min-w-[900px] h-full">
          {STATUS_ORDER.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              conversations={conversations.filter((c) => c.status === status)}
              onOpen={(c: Conversation) => openConversation(c.id)}
            />
          ))}
        </div>
      </DndContext>

      <ConversationDetailSheet
        conversation={activeConversation}
        onOpenChange={(open) => !open && closeConversation()}
      />
    </div>
  );
}
