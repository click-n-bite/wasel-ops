# Wasel Ops

Operations dashboard for conversations, services, users, blacklisted
countries and support-number notification priority. Built with
Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui-style
components, dnd-kit and Zustand.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000 — it redirects to `/conversations`.

## Project structure

```
app/
  layout.tsx              # root layout, loads Inter font + globals.css
  page.tsx                 # redirects to /conversations
  (dashboard)/
    layout.tsx              # sidebar + content shell shared by every page
    conversations/page.tsx   # kanban board
    services/page.tsx        # enable/disable services
    users/page.tsx           # users table + detail
    blacklist/page.tsx       # blacklisted countries
    notifications/page.tsx   # support numbers, ordered by priority
components/
  ui/          shadcn-style primitives (button, input, switch, sheet, avatar, badge, card)
  layout/      sidebar.tsx, topbar.tsx
  conversations/  kanban-board, kanban-column, conversation-card, conversation-detail-sheet
  services/    service-card.tsx
  users/       users-table.tsx, user-detail-sheet.tsx
  blacklist/   blacklist-manager.tsx
  notifications/  support-numbers-manager.tsx
lib/
  types.ts        shared TypeScript types
  seed-data.ts     mock data (swap for your API later)
  status-meta.tsx  labels/colors/icons for conversation status
  utils.ts         cn() + initials()
store/
  use-dashboard-store.ts   single Zustand store — all dynamic state lives here
```

## Notes on wiring this to real data

Everything reads from and writes to `store/use-dashboard-store.ts`.
To connect it to a real backend:

1. Replace the `seed*` imports with data fetched in a Server
   Component (e.g. `app/(dashboard)/conversations/page.tsx`) or via
   a `useEffect`/React Query call, and call
   `useDashboardStore.setState(...)` to hydrate it.
2. Turn each store action (`setConversationStatus`,
   `sendAgentReply`, `toggleService`, `addBlacklistCountry`,
   `addSupportNumber`, `moveSupportNumber`, ...) into a function that
   also calls your API route / WhatsApp webhook, then updates local
   state (optimistic update) once the request succeeds.
3. Drag-and-drop in the kanban board already calls
   `setConversationStatus` on drop — hook your "confirm order"
   webhook there.

## Features

- **Conversations**: kanban board (Pending / Confirmed / Out for
  Delivery) built with `@dnd-kit`. Drag a card between columns, or
  click a card to open the detail panel, reply as a human agent,
  change status, or confirm the order.
- **Services**: grid of toggle switches to enable/disable bot
  features (COD, auto-confirmation, SMS, WhatsApp bot, tracking
  page, abandoned-cart follow-up).
- **Users**: table of everyone who has messaged you, click a row for
  their details and full message history.
- **Blacklisted Countries**: add/remove countries orders should be
  blocked from.
- **Support Numbers**: add/remove notification numbers and reorder
  their call priority with the up/down arrows — the top of the list
  is contacted first.
