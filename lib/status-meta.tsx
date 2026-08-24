import { CheckCircle2, Package, Truck } from "lucide-react";
import { ConversationStatus } from "./types";

export const STATUS_META: Record<
  ConversationStatus,
  { label: string; color: string; bg: string; ring: string; icon: typeof Package }
> = {
  pending: { label: "Pending", color: "#B45309", bg: "#FFFBEB", ring: "#FDE68A", icon: Package },
  confirmed: { label: "Confirmed", color: "#1D4ED8", bg: "#EFF6FF", ring: "#BFDBFE", icon: CheckCircle2 },
  out_for_delivery: { label: "Out for Delivery", color: "#0F766E", bg: "#F0FDFA", ring: "#99F6E4", icon: Truck },
};

export const STATUS_ORDER: ConversationStatus[] = ["pending", "confirmed", "out_for_delivery"];
