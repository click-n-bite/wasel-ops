"use client";

import { create } from "zustand";
import {
  AppNotification,
  AppUser,
  BlacklistedCountry,
  Conversation,
  ConversationStatus,
  Message,
  NotificationType,
  Service,
  SupportNumber,
} from "@/lib/types";
import {
  seedBlacklist,
  seedConversations,
  seedNumbers,
  seedServices,
  seedUsers,
} from "@/lib/seed-data";
import { STATUS_META } from "@/lib/status-meta";

const MAX_NOTIFICATIONS = 40;

interface DashboardState {
  conversations: Conversation[];
  services: Service[];
  users: AppUser[];
  blacklist: BlacklistedCountry[];
  numbers: SupportNumber[];

  // Conversation detail sheet, lifted into the store so it can be opened
  // from anywhere (e.g. clicking a notification while on another page).
  openConversationId: string | null;
  openConversation: (id: string) => void;
  closeConversation: () => void;

  setConversationStatus: (id: string, status: ConversationStatus) => void;
  sendAgentReply: (id: string, text: string) => void;
  confirmOrder: (id: string) => void;

  toggleService: (id: string) => void;

  addBlacklistCountry: (name: string) => void;
  removeBlacklistCountry: (id: string) => void;

  addSupportNumber: (label: string, number: string) => void;
  removeSupportNumber: (id: string) => void;
  moveSupportNumber: (id: string, direction: "up" | "down") => void;

  // Real-time chat (simulated, in-browser)
  connected: boolean;
  typingConversationId: string | null;
  setConnected: (connected: boolean) => void;
  setTypingConversationId: (id: string | null) => void;
  appendIncomingMessage: (conversationId: string, message: Message) => void;

  // Notifications
  notifications: AppNotification[];
  toasts: AppNotification[];
  unreadCount: number;
  pushNotification: (input: {
    type: NotificationType;
    title: string;
    body: string;
    conversationId?: string;
  }) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  dismissToast: (id: string) => void;
}

function nowLabel() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

let notificationSeq = 0;
function makeNotificationId() {
  notificationSeq += 1;
  return `notif-${Date.now()}-${notificationSeq}`;
}

let typingClearTimer: ReturnType<typeof setTimeout> | null = null;

export const useDashboardStore = create<DashboardState>((set, get) => ({
  conversations: seedConversations,
  services: seedServices,
  users: seedUsers,
  blacklist: seedBlacklist,
  numbers: seedNumbers,

  openConversationId: null,
  openConversation: (id) => set({ openConversationId: id }),
  closeConversation: () => set({ openConversationId: null }),

  setConversationStatus: (id, status) => {
    const conversation = get().conversations.find((c) => c.id === id);
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === id ? { ...c, status } : c
      ),
    }));
    if (conversation && conversation.status !== status) {
      get().pushNotification({
        type: "status",
        title: conversation.name,
        body: `Order moved to “${STATUS_META[status].label}”.`,
        conversationId: id,
      });
    }
  },

  sendAgentReply: (id, text) => {
    const message: Message = { id: `m${Date.now()}`, from: "agent", text, time: nowLabel() };
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === id ? { ...c, messages: [...c.messages, message] } : c
      ),
    }));
  },

  confirmOrder: (id) => get().setConversationStatus(id, "confirmed"),

  toggleService: (id) =>
    set((state) => ({
      services: state.services.map((s) =>
        s.id === id ? { ...s, enabled: !s.enabled } : s
      ),
    })),

  addBlacklistCountry: (name) =>
    set((state) => ({
      blacklist: [
        ...state.blacklist,
        { id: `b${Date.now()}`, name, code: name.slice(0, 2).toUpperCase() },
      ],
    })),

  removeBlacklistCountry: (id) =>
    set((state) => ({
      blacklist: state.blacklist.filter((c) => c.id !== id),
    })),

  addSupportNumber: (label, number) =>
    set((state) => ({
      numbers: [
        ...state.numbers,
        {
          id: `n${Date.now()}`,
          label: label || "Support",
          number,
          priority: state.numbers.length + 1,
        },
      ],
    })),

  removeSupportNumber: (id) =>
    set((state) => ({
      numbers: state.numbers
        .filter((n) => n.id !== id)
        .map((n, i) => ({ ...n, priority: i + 1 })),
    })),

  moveSupportNumber: (id, direction) =>
    set((state) => {
      const sorted = [...state.numbers].sort((a, b) => a.priority - b.priority);
      const idx = sorted.findIndex((n) => n.id === id);
      const swapWith = direction === "up" ? idx - 1 : idx + 1;
      if (swapWith < 0 || swapWith >= sorted.length) return state;
      const a = sorted[idx];
      const b = sorted[swapWith];
      const tmp = a.priority;
      a.priority = b.priority;
      b.priority = tmp;
      return { numbers: sorted };
    }),

  // ---- Real-time chat (Socket.IO) ----
  connected: false,
  typingConversationId: null,

  setConnected: (connected) => set({ connected }),

  setTypingConversationId: (id) => {
    if (typingClearTimer) clearTimeout(typingClearTimer);
    set({ typingConversationId: id });
    if (id) {
      typingClearTimer = setTimeout(() => {
        set((state) => (state.typingConversationId === id ? { typingConversationId: null } : {}));
      }, 4000);
    }
  },

  appendIncomingMessage: (conversationId, message) => {
    const conversation = get().conversations.find((c) => c.id === conversationId);
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId ? { ...c, messages: [...c.messages, message] } : c
      ),
      typingConversationId: state.typingConversationId === conversationId ? null : state.typingConversationId,
    }));
    if (message.from === "customer" && conversation) {
      get().pushNotification({
        type: "message",
        title: conversation.name,
        body: message.text,
        conversationId,
      });
    }
  },

  // ---- Notifications ----
  notifications: [],
  toasts: [],
  unreadCount: 0,

  pushNotification: ({ type, title, body, conversationId }) => {
    const notification: AppNotification = {
      id: makeNotificationId(),
      type,
      title,
      body,
      time: nowLabel(),
      createdAt: Date.now(),
      read: false,
      conversationId,
    };
    set((state) => ({
      notifications: [notification, ...state.notifications].slice(0, MAX_NOTIFICATIONS),
      toasts: [...state.toasts, notification],
      unreadCount: state.unreadCount + 1,
    }));
  },

  markNotificationRead: (id) =>
    set((state) => {
      const target = state.notifications.find((n) => n.id === id);
      if (!target || target.read) return state;
      return {
        notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        unreadCount: Math.max(0, state.unreadCount - 1),
      };
    }),

  markAllNotificationsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),

  clearNotifications: () => set({ notifications: [], unreadCount: 0 }),

  dismissToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
