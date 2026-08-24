"use client";

import { useDroppable } from "@dnd-kit/core";
import { Conversation, ConversationStatus } from "@/lib/types";
import { STATUS_META } from "@/lib/status-meta";
import { cn } from "@/lib/utils";
import { ConversationCard } from "./conversation-card";

export function KanbanColumn({
  status,
  conversations,
  onOpen,
}: {
  status: ConversationStatus;
  conversations: Conversation[];
  onOpen: (c: Conversation) => void;
}) {
  const meta = STATUS_META[status];
  const Icon = meta.icon;
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex-1 min-w-[280px] rounded-xl p-3 transition-colors",
        isOver ? "" : "bg-secondary"
      )}
      style={isOver ? { background: meta.bg } : undefined}
    >
      <div className="flex items-center gap-2 px-1 mb-3">
        <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: meta.bg }}>
          <Icon size={13} style={{ color: meta.color }} />
        </div>
        <span className="text-[13px] font-semibold text-foreground">{meta.label}</span>
        <span className="text-[11.5px] text-muted-foreground font-medium ml-auto bg-card px-2 py-0.5 rounded-full border border-border">
          {conversations.length}
        </span>
      </div>
      <div className="min-h-[120px]">
        {conversations.map((c) => (
          <ConversationCard key={c.id} conversation={c} onOpen={onOpen} />
        ))}
        {conversations.length === 0 && (
          <div className="text-[12px] text-muted-foreground text-center py-8 border-2 border-dashed border-border rounded-lg">
            Drop here
          </div>
        )}
      </div>
    </div>
  );
}
