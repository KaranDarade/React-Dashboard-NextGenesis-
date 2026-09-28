# NextGenesis Control - Product Analytics Dashboard

A modern product admin dashboard for the free [DummyJSON](https://dummyjson.com)
catalogue, built with Next.js (App Router), React, TypeScript, Tailwind CSS and
Axios. It pairs a full product-management tool with a real-time analytics
overview, styled with a premium glassmorphism ("Aurora Glass") design system.

- Repository: https://github.com/KaranDarade/React-Dashboard-NextGenesis-
- Live demo: https://react-dashboard-nextgenesis.vercel.app
- Demo login: username `emilys`, password `emilyspass`

## Tech stack

- Next.js 16 (App Router, Turbopack) + React 19 + TypeScript
- Tailwind CSS v4 with custom design tokens
- Axios for every HTTP call (one shared instance)
- Charts and sparklines are hand-built SVG/CSS - no chart library
- No React Query, SWR or table/pagination libraries

## Setup

```bash
npm install
npm run dev      # http://localhost:3000
```

Optional: copy `.env.example` to `.env.local` to change the API base URL. The
app falls back to `https://dummyjson.com`, so it runs with no configuration.

```bash
npm run build    # production build
npm run start    # serve the production build
npm run lint     # eslint
```

## The dashboard experience

The root route `/` is a live overview, not a landing page:

- **Top bar** - page title, global search (`Ctrl/Cmd + K`), notifications
  derived from real catalogue alerts, user menu and a quick "Add product" action.
- **Glass sidebar** - grouped navigation (Overview, Products, Categories, Add
  product, Profile) with an obvious-but-subtle active state, hover micro
  interactions, tooltips when collapsed, a persisted collapse state, and a
  slide-in drawer with overlay on mobile/tablet.
- **KPI grid** - compact, information-dense cards: catalogue size, inventory
  value, average rating, stock alerts and average discount, each with a real
  context line and an interactive sparkline.
- **Analytics** - category-mix donut (hover to inspect a slice), rating
  distribution histogram, average price by category, inventory value by
  category and a stock-health progress list.
- **Live activity** - a real, client-side activity feed (session, search,
  filter, sort, product views, create/edit/delete, manual refresh) with
  timestamps and status.
- **System status** - measured API latency, connection state, last sync,
  auto-refresh state, dataset size and local change count.
- **Categories page** - every real category with product count, average price,
  inventory value, average rating and stock health; click through to a filtered
  product list.
- **Profile page** - the real `/auth/me` account, verified against the session.

### Honest, real-time data (no fabrication)

DummyJSON exposes no historical or event endpoints, so the dashboard never
invents trends it cannot support:

- Every KPI and chart is computed from the real product catalogue (fetched once
  in bulk with `limit=0` + a field `select`, then merged with local overrides).
- There is no fake "% change vs last week". Instead, cards show real context
  (counts, averages, distributions) and real session/override deltas.
- Client-side activity and measured latency provide the genuinely live signals.
- Data refreshes automatically every 30s (paused when the tab is hidden) and
  shows a "last updated" time; the interval can be turned off.
- Architecture note: swapping polling for a websocket/SSE feed later only means
  changing `useCatalogSnapshot`, not the UI.

## Design system ("Aurora Glass")

- Ambient aurora background (drifting gradient blobs + soft grid overlay) so
  translucent surfaces actually read as glass.
- Four glass elevation levels (`glass`, `glass-2`, `glass-strong`,
  `glass-float`) defined once in `globals.css` and used via the `GlassCard`
  component, creating consistent depth.
- Consistent tokens for radius, spacing, shadows and typography; Inter loaded
  through `next/font`.
- Reusable micro-interactions (hover elevation, active glow, chart entrance)
  and full `prefers-reduced-motion` support.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Live analytics overview |
| `/login` | Sign in |
| `/products` | Product list with search/filter/sort/pagination |
| `/products/new` | Add product |
| `/products/[id]` | Product details (gallery, description, reviews) |
| `/products/[id]/edit` | Edit product |
| `/categories` | Category analytics |
| `/profile` | Account details |
| `not-found` | 404 |

## Project structure

```
src/
  app/
    (dashboard)/            shell-wrapped app: overview, products, categories, profile
    layout.tsx              fonts + ambient background
    login/                  auth
  components/
    shell/                  sidebar, topbar, mobile drawer, search, menus, icons
    dashboard/              KPI grid, metric card, chart cards, activity, status
      charts/               SVG donut, sparkline, bar lists, histogram, progress
    products/               list, table, cards, pagination, form, detail
    ui/                     glass card, skeleton, badges, dialog, states
  hooks/                    catalog snapshot, debounce, activity, now, profile
  lib/
    api/                    client.ts (shared axios), auth.ts, products.ts
    stats.ts                pure catalogue aggregations
    activity.ts, system.ts  live activity + connection/latency helpers
    overrides.ts            local create/edit/delete merge logic
    search-params.ts        safe URL parsing/building for list state
  store/                    overrides + dashboard data providers
  proxy.ts                  route protection (Next 16 renamed middleware -> proxy)
```

All API calls live in `src/lib/api/*`; UI components never touch Axios directly.

## URL contract (list state)

```
/products?q=&category=&sortBy=title|price|rating&order=asc|desc&page=1&limit=10
```

The URL is the source of truth, so refreshing or sharing a link reproduces the
same result. Bad values are normalised: `?page=abc` -> 1, `?page=999` -> last
real page, invalid `limit`/`sortBy` -> defaults.

## Decisions and trade-offs

### Search and category cannot be combined

DummyJSON has no endpoint that searches and filters by category at once. Search
wins: starting a search clears the category filter and vice versa. Search is the
more explicit action, and filtering categories client-side would break correct
server pagination totals.

### Add / edit / delete are simulated locally

The write endpoints return a plausible object but persist nothing. The app still
calls them, then mirrors each change in a `localStorage`-backed overrides store
that is merged over the API data (and reflected in the dashboard KPIs). A banner
makes clear these changes are browser-only.

### Fast typing never shows stale results

Search is written to the URL live but the request is debounced. `useProducts`
also aborts the previous request (`AbortController`) and tags responses with an
incrementing id, dropping any late response - verified against `&delay=2000`.

### Duplicate submissions

Login, Save, Delete and Refresh guard against double clicks with an in-flight
ref and a disabled button.

## Notes (choices, one problem, and AI)

**Choices.** List state lives in the URL for shareable links; every request goes
through one Axios instance with interceptors; dashboard metrics are computed
from real data only, and writes are mirrored locally rather than faked on the
server. The redesign is structural: a dedicated `(dashboard)` route group, a
glass shell, a shared `DashboardDataProvider` (one bulk fetch shared by the
sidebar, topbar, KPI cards and charts) and small, single-purpose components.

**A problem I hit and how I fixed it.** Next.js 16 renamed `middleware` to
`proxy`, and React 19's lint rules reject calling `setState` synchronously
inside `useEffect` (and reassigning variables during render). I reworked the
data hooks - including the new `useCatalogSnapshot` - to derive `loading`/`error`
by comparing a query signature against the last completed result, and rewrote
the donut slice math to avoid mutation during render, keeping the abort/stale
protection intact.

**Where AI helped.** I used an AI coding assistant to accelerate the design
system and repetitive markup, to probe the live API for real response shapes and
payload sizes, and it surfaced the Next 16 `middleware` -> `proxy` rename and the
React 19 effect/immutability lint rules. The product/architecture decisions, the
honest-metrics stance, the URL contract and final verification were directed and
checked by me.

## Known limitations

- Changes are per-browser and are not saved on DummyJSON.
- Polling is used for "real time"; the API has no push channel.
- No automated test suite; verification was manual plus `lint`, `build` and a
  production smoke test of the route guard.
