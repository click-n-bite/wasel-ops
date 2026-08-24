"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { Conversation } from "@/lib/types";
import { initials, cn } from "@/lib/utils";

export function ConversationCard({
  conversation,
  onOpen,
}: {
  conversation: Conversation;
  onOpen: (c: Conversation) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: conversation.id,
  });

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined;

  const lastMessage = conversation.messages[conversation.messages.length - 1];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-card rounded-xl border border-border p-3.5 mb-2.5 cursor-pointer hover:shadow-md hover:border-slate-300 transition-all group touch-none",
        isDragging && "opacity-50 shadow-lg z-10"
      )}
      onClick={() => onOpen(conversation)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-[11px] font-semibold text-secondary-foreground shrink-0">
            {initials(conversation.name)}
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-foreground truncate">{conversation.name}</p>
            <p className="text-[11.5px] text-muted-foreground truncate">{conversation.phone}</p>
          </div>
        </div>
        <button
          {...listeners}
          {...attributes}
          className="text-slate-300 group-hover:text-slate-400 shrink-0 mt-1 cursor-grab active:cursor-grabbing"
          onClick={(e) => e.stopPropagation()}
          aria-label="Drag to move"
        >
          <GripVertical size={14} />
        </button>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-[12px] text-muted-foreground truncate">{conversation.product}</span>
        <span className="text-[12px] font-semibold text-foreground shrink-0 ml-2">{conversation.amount}</span>
      </div>
      {lastMessage && (
        <p className="mt-2 text-[11.5px] text-slate-400 truncate italic">&quot;{lastMessage.text}&quot;</p>
      )}
    </div>
  );
}
