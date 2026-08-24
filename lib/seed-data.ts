import {
  Conversation,
  Service,
  AppUser,
  BlacklistedCountry,
  SupportNumber,
} from "./types";

export const seedConversations: Conversation[] = [
  {
    id: "c1",
    name: "Rami Khalil",
    phone: "+961 71 234 567",
    country: "Lebanon",
    product: "Wireless Earbuds Pro",
    amount: "45 USD",
    status: "pending",
    messages: [
      { id: "m1", from: "customer", text: "Chou, wselo l earbuds?", time: "09:12" },
      { id: "m2", from: "customer", text: "Bado a3ref emta bade yousslouni", time: "09:12" },
    ],
  },
  {
    id: "c2",
    name: "Sara Abou Fakhr",
    phone: "+961 76 555 210",
    country: "Lebanon",
    product: "Skincare Set",
    amount: "62 USD",
    status: "pending",
    messages: [
      { id: "m3", from: "customer", text: "Hi, I want to confirm my order please", time: "10:03" },
    ],
  },
  {
    id: "c3",
    name: "Mohammad Zeaiter",
    phone: "+961 03 887 112",
    country: "Lebanon",
    product: "Smart Watch X2",
    amount: "89 USD",
    status: "pending",
    messages: [
      { id: "m4", from: "customer", text: "3am fakker eza bade ghayer l lawn la black", time: "08:45" },
    ],
  },
  {
    id: "c4",
    name: "Nour Haidar",
    phone: "+961 70 998 341",
    country: "Lebanon",
    product: "Portable Blender",
    amount: "28 USD",
    status: "confirmed",
    messages: [
      { id: "m5", from: "customer", text: "Yes confirmed, address is Beirut - Hamra", time: "07:30" },
      { id: "m6", from: "agent", text: "Great, thank you Nour! Preparing your order now.", time: "07:41" },
    ],
  },
  {
    id: "c5",
    name: "Ali Chami",
    phone: "+961 81 442 903",
    country: "Lebanon",
    product: "LED Desk Lamp",
    amount: "19 USD",
    status: "confirmed",
    messages: [{ id: "m7", from: "customer", text: "Confirmed, thanks", time: "yesterday" }],
  },
  {
    id: "c6",
    name: "Layal Dagher",
    phone: "+961 71 620 774",
    country: "Lebanon",
    product: "Perfume Set - Oud",
    amount: "54 USD",
    status: "out_for_delivery",
    messages: [
      { id: "m8", from: "agent", text: "Your order is out for delivery, driver will call soon.", time: "yesterday" },
      { id: "m9", from: "customer", text: "Merci ktir!", time: "yesterday" },
    ],
  },
  {
    id: "c7",
    name: "Hussein Fawaz",
    phone: "+961 76 301 558",
    country: "Lebanon",
    product: "Bluetooth Speaker Mini",
    amount: "33 USD",
    status: "out_for_delivery",
    messages: [{ id: "m10", from: "customer", text: "Ok waiting for the driver", time: "2 days ago" }],
  },
];

export const seedServices: Service[] = [
  { id: "s1", name: "Cash on Delivery", description: "Accept COD payments on new orders", enabled: true },
  { id: "s2", name: "Auto Order Confirmation", description: "Automatically confirm orders after customer reply", enabled: false },
  { id: "s3", name: "SMS Notifications", description: "Send SMS updates to customers on status change", enabled: true },
  { id: "s4", name: "WhatsApp Bot", description: "Automated first response on WhatsApp", enabled: true },
  { id: "s5", name: "Delivery Tracking Page", description: "Public tracking link for customers", enabled: false },
  { id: "s6", name: "Abandoned Cart Follow-up", description: "Reminder message after 24h of no reply", enabled: true },
];

export const seedUsers: AppUser[] = [
  { id: "u1", name: "Rami Khalil", phone: "+961 71 234 567", country: "Lebanon", orders: 3, lastActive: "Today, 09:12", messages: seedConversations[0].messages },
  { id: "u2", name: "Sara Abou Fakhr", phone: "+961 76 555 210", country: "Lebanon", orders: 1, lastActive: "Today, 10:03", messages: seedConversations[1].messages },
  { id: "u3", name: "Mohammad Zeaiter", phone: "+961 03 887 112", country: "Lebanon", orders: 5, lastActive: "Today, 08:45", messages: seedConversations[2].messages },
  { id: "u4", name: "Nour Haidar", phone: "+961 70 998 341", country: "Lebanon", orders: 2, lastActive: "Today, 07:41", messages: seedConversations[3].messages },
  { id: "u5", name: "Layal Dagher", phone: "+961 71 620 774", country: "Lebanon", orders: 7, lastActive: "Yesterday", messages: seedConversations[5].messages },
];

export const seedBlacklist: BlacklistedCountry[] = [
  { id: "b1", name: "Country A (restricted)", code: "XA" },
  { id: "b2", name: "Country B (restricted)", code: "XB" },
];

export const seedNumbers: SupportNumber[] = [
  { id: "n1", number: "+961 76 111 222", label: "Support Lead - Zeina", priority: 1 },
  { id: "n2", number: "+961 71 333 444", label: "Support - Karim", priority: 2 },
  { id: "n3", number: "+961 03 555 666", label: "Support - Yara", priority: 3 },
  { id: "n4", number: "+961 81 777 888", label: "Backup - Fadi", priority: 4 },
];
