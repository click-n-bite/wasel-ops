"use client";

import { useState, useRef, useEffect } from "react";
import { CheckCircle2, Package, Send } from "lucide-react";
import { Conversation, ConversationStatus } from "@/lib/types";
import { STATUS_META, STATUS_ORDER } from "@/lib/status-meta";
import { initials, cn } from "@/lib/utils";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useDashboardStore } from "@/store/use-dashboard-store";

export function ConversationDetailSheet({
  conversation,
  onOpenChange,
}: {
  conversation: Conversation | null;
  onOpenChange: (open: boolean) => void;
}) {
  const [text, setText] = useState("");
  const setStatus = useDashboardStore((s) => s.setConversationStatus);
  const sendReply = useDashboardStore((s) => s.sendAgentReply);
  const typingConversationId = useDashboardStore((s) => s.typingConversationId);
  const connected = useDashboardStore((s) => s.connected);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  useEffect(() => {
    if (conversation) {
      scrollToBottom();
    }
  }, [conversation?.id]);

  // Scroll when typing appears
  useEffect(() => {
    if (typingConversationId === conversation?.id) {
      scrollToBottom();
    }
  }, [typingConversationId]);

  if (!conversation) return null;
  const meta = STATUS_META[conversation.status];
  const isTyping = typingConversationId === conversation.id;

  const submitReply = () => {
    if (!text.trim()) return;
    sendReply(conversation.id, text.trim());
    setText("");
  };

  return (
    <Sheet open={!!conversation} onOpenChange={onOpenChange}>
      <SheetContent widthClassName="max-w-md">
        <div className="flex items-center gap-3 px-5 h-16 border-b border-border shrink-0">
          <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-[12px] font-semibold text-secondary-foreground">
            {initials(conversation.name)}
          </div>
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-foreground truncate">{conversation.name}</p>
            <p className="text-[11.5px] text-muted-foreground truncate">{conversation.phone}</p>
          </div>
          <span
            className={cn(
              "ml-auto mr-8 flex items-center gap-1.5 text-[11px] font-medium px-2 py-1 rounded-full shrink-0",
              connected ? "bg-emerald-50 text-emerald-600" : "bg-secondary text-muted-foreground"
            )}
          >
            <span className={cn("w-1.5 h-1.5 rounded-full", connected ? "bg-emerald-500 animate-pulse" : "bg-slate-300")} />
            {connected ? "Live" : "Offline"}
          </span>
        </div>

        <div className="px-5 py-3 border-b border-border flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
            <Package size={13} /> {conversation.product}
          </div>
          <div className="flex items-center gap-1.5 text-[12px] font-semibold text-foreground">
            {conversation.amount}
          </div>
          <span
            className="ml-auto text-[11px] font-medium px-2 py-1 rounded-full"
            style={{ background: meta.bg, color: meta.color }}
          >
            {meta.label}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-secondary/40">
          {conversation.messages.map((m) => (
            <div key={m.id} className={cn("flex", m.from === "agent" ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-3.5 py-2 text-[13px] leading-relaxed",
                  m.from === "agent"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-foreground border border-border"
                )}
              >
                {m.text}
                <div className={cn("text-[10px] mt-1 opacity-60", m.from === "agent" ? "text-slate-300" : "text-muted-foreground")}>
                  {m.time}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-card border border-border rounded-2xl px-3.5 py-2.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
              </div>
            </div>
          )}
          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-border space-y-3 shrink-0">
          <div className="flex gap-2">
            {STATUS_ORDER.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(conversation.id, s)}
                className="flex-1 text-[11.5px] font-medium py-1.5 rounded-lg border transition-colors"
                style={{
                  background: conversation.status === s ? STATUS_META[s].bg : "transparent",
                  color: conversation.status === s ? STATUS_META[s].color : "hsl(var(--muted-foreground))",
                  borderColor: conversation.status === s ? STATUS_META[s].ring : "hsl(var(--border))",
                }}
              >
                {STATUS_META[s].label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitReply()}
              placeholder="Type a reply as human agent..."
              className="flex-1 border border-input rounded-lg px-3 py-2.5 text-[13px] outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 bg-background"
            />
            <button
              onClick={submitReply}
              className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shrink-0 hover:bg-primary/90"
              aria-label="Send reply"
            >
              <Send size={15} />
            </button>
          </div>

          {conversation.status === "pending" && (
            <button
              onClick={() => setStatus(conversation.id, "confirmed")}
              className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground text-[13px] font-semibold py-2.5 rounded-lg transition-colors"
            >
              <CheckCircle2 size={15} /> Confirm order
            </button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}