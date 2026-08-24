export type ConversationStatus = "pending" | "confirmed" | "out_for_delivery";

export type MessageSender = "customer" | "agent";

export interface Message {
  id: string;
  from: MessageSender;
  text: string;
  time: string;
}

export interface Conversation {
  id: string;
  name: string;
  phone: string;
  country: string;
  product: string;
  amount: string;
  status: ConversationStatus;
  messages: Message[];
}

export interface Service {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export interface AppUser {
  id: string;
  name: string;
  phone: string;
  country: string;
  orders: number;
  lastActive: string;
  messages: Message[];
}

export interface BlacklistedCountry {
  id: string;
  name: string;
  code: string;
}

export interface SupportNumber {
  id: string;
  number: string;
  label: string;
  priority: number;
}

export type NotificationType = "message" | "status" | "alert";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  time: string;
  createdAt: number;
  read: boolean;
  conversationId?: string;
}
