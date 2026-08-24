"use client";

import { useEffect } from "react";
import { useDashboardStore } from "@/store/use-dashboard-store";
import { Message } from "@/lib/types";

// Simulates a live backend entirely inside the browser — random customer
// messages (with a "typing…" beat first) and occasional ops alerts, on a
// jittered timer. No server, no socket, no network calls: everything is
// driven by setTimeout and pushed straight into the Zustand store, so it
// works the same on Vercel, localhost, or a static export.

const CONVERSATION_IDS = ["c1", "c2", "c3", "c4", "c5", "c6", "c7"];

const CUSTOMER_LINES = [
  "Hi, any update on my order?",
  "Chou sar ma3 l delivery?",
  "Can I change the delivery address?",
  "Is this available in another color?",
  "Thanks, still waiting for the driver",
  "Bade a3ref emta bade yousslouni",
  "Can I pay cash on delivery?",
  "I think I made a mistake in my address",
  "Still interested, just busy today, bkeffe bade radd",
  "Merci ktir kermel l metabe3a",
  "Is there a discount if I order two?",
  "Habibi wain saro yousslou el driver?",
];

const ALERT_TEMPLATES = [
  { title: "New order pending", body: "A new customer order needs confirmation." },
  { title: "Blacklisted country attempt", body: "An order attempt was blocked from a restricted country." },
  { title: "Support number unreachable", body: "Top-priority support number did not respond in time." },
  { title: "Abandoned cart", body: "A customer has been inactive for 24h on an unconfirmed order." },
  { title: "Delivery delayed", body: "A driver reported a delay on an out-for-delivery order." },
];

function randomItem<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function nowLabel() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/**
 * Mounts a fully in-browser real-time simulation: fakes a "connected" state,
 * then loops sending dummy customer messages and ops alerts into the store.
 */
export function useDummyRealtime() {
  const setConnected = useDashboardStore((s) => s.setConnected);
  const setTypingConversationId = useDashboardStore((s) => s.setTypingConversationId);
  const appendIncomingMessage = useDashboardStore((s) => s.appendIncomingMessage);
  const pushNotification = useDashboardStore((s) => s.pushNotification);

  useEffect(() => {
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Small delay so the "Live" indicator visibly flips on, like a real
    // connection handshake, instead of always being on.
    const connectTimer = setTimeout(() => {
      if (!cancelled) setConnected(true);
    }, 800);
    timers.push(connectTimer);

    function scheduleCustomerMessage() {
      const delay = randomBetween(9000, 18000);
      const t = setTimeout(() => {
        if (cancelled) return;
        const conversationId = randomItem(CONVERSATION_IDS);
        setTypingConversationId(conversationId);

        const messageTimer = setTimeout(() => {
          if (cancelled) return;
          const message: Message = {
            id: `m${Date.now()}`,
            from: "customer",
            text: randomItem(CUSTOMER_LINES),
            time: nowLabel(),
          };
          appendIncomingMessage(conversationId, message);
        }, randomBetween(1200, 2600));
        timers.push(messageTimer);

        scheduleCustomerMessage();
      }, delay);
      timers.push(t);
    }

    function scheduleAlert() {
      const delay = randomBetween(25000, 45000);
      const t = setTimeout(() => {
        if (cancelled) return;
        const alert = randomItem(ALERT_TEMPLATES);
        pushNotification({ type: "alert", title: alert.title, body: alert.body });
        scheduleAlert();
      }, delay);
      timers.push(t);
    }

    scheduleCustomerMessage();
    scheduleAlert();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
