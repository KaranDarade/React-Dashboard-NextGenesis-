# StoreFlow — Product Management Dashboard

A premium product-management dashboard for the free
[DummyJSON](https://dummyjson.com) catalogue. Built with Next.js (App Router),
React, TypeScript, Tailwind CSS and Axios, styled with a dark, emerald-accented
glass design system.

- Repository: https://github.com/KaranDarade/React-Dashboard-NextGenesis-
- Live demo: https://react-dashboard-nextgenesis.vercel.app
- Admin login: username `daradekaran123@gmail.com`, password `KaranStore@123`
  (the DummyJSON demo account `emilys` / `emilyspass` also works)

## Tech stack

- Next.js 16 (App Router, Turbopack) + React 19 + TypeScript
- Tailwind CSS v4 with custom dark design tokens
- Axios for every HTTP call (one shared instance)
- Charts and sparklines are hand-built SVG/CSS — no chart library
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

## Design direction

A dark + emerald glass system ("StoreFlow"):

- **Surfaces** canvas `#070A08` → `#0B100D` → surface `#101713`; glass
  `rgba(255,255,255,.055)` / elevated `.075`; borders `.08` / `.12`.
- **Text** `#F0FDF4` / `#A7B8AD` / `#64746A` / `#3F4A43` (off-white, never pure
  white).
- **Accent** emerald `#22C55E` (+`#4ADE80`) used selectively — primary actions,
  active nav, positive deltas, success/stock badges and focus rings. Semantic
  amber/rose/blue appear only for warnings, destructive actions and info.
- **Background** static, barely-visible emerald glows (no animated blobs, no
  neon) and layered translucent surfaces for depth.
- **Radius** cards 18px, panels 20px, buttons/inputs 12px; pill shapes reserved
  for status badges and filter chips.
- **Icons** one consistent inline-SVG (Lucide-style) set at 16–18px.
- **Light / dark theme** a toggle in the topbar (and in Settings) flips a
  `data-theme` attribute on `<html>`; all colours are CSS variables, the choice
  is persisted to `localStorage`, and an inline script applies it before paint
  so there is no flash or hydration mismatch.

## Application surfaces

- **Shell** — "StoreFlow / Product Management" brand; sidebar (Dashboard,
  Products, Categories, Analytics, Settings) with emerald active states,
  collapsible with persistence, user card and logout; compact glass topbar with
  breadcrumb, command search (`⌘/Ctrl + K`), alerts and account menu. On mobile:
  a mini topbar plus a bottom tab bar (Home, Products, Analytics, More→drawer).
- **Dashboard** — greeting header, a 4-card KPI strip (Total Products, Average
  Rating, Total Inventory, Low Stock) with live session deltas, a catalogue
  distribution area chart + category donut, **Recent Products** and
  **Recent Activity** (with a Live indicator).
- **Products (core)** — one cohesive command toolbar (search with in-input
  spinner, grouped category dropdown, sort, page size, table/grid view toggle),
  active filter chips, a dark glass table with a STATUS column and a per-row
  `⋯` menu (View / Edit / Delete), integrated pagination
  ("Showing 21–40 of 194"), and rich mobile product cards.
- **Product details** — gallery + title/rating/price/stock, and
  **Overview | Reviews | Details** tabs.
- **Categories** — every real category with count, average price, inventory
  value, average rating and stock health; click through to a filtered list.
- **Analytics** — price-band area chart, category donut, rating histogram,
  average price / inventory value by category, stock health, top brands and top
  rated products — all computed from the live catalogue.
- **Settings** — auto-refresh, low-stock threshold, clear local demo changes,
  clear activity log and live API status.
- **Login** — two-panel layout with an emerald-accented glass card.

## Honest, real-time data (no fabrication)

DummyJSON exposes no historical or event endpoints, so the dashboard never
invents trends it cannot support:

- Every KPI and chart is computed from the real product catalogue (fetched once
  in bulk with `limit=0` + a field `select`, then merged with local overrides).
- KPI deltas are real: they compare the current aggregates with the **session
  baseline** (so adding/editing/deleting products genuinely moves them) — not a
  fabricated "vs last week".
- The "live" signals are genuinely live: measured API latency, connection state,
  30s polling (paused when the tab is hidden), and a real client-side activity
  log.
- Architecture note: swapping polling for a websocket/SSE feed later only means
  changing `useCatalogSnapshot`, not the UI.

## Catalogue reality

The catalogue is the real DummyJSON dataset: **194 varied products** across 24
categories (phones, laptops, watches, audio, shoes, dresses, fragrances,
groceries, kitchen/sports/automotive gear, accessories and more), each with real
images, widely varied prices, ratings and stock — so pagination, search,
filtering, sorting and In/Low/Out statuses are all meaningful without any
synthetic data. Fine-grained API slugs are grouped into friendly families
(Electronics, Fashion, Watches, Beauty, Home & Living, Grocery, Sports,
Automotive) purely for the filter UI (`src/lib/taxonomy.ts`); filtering still
passes the real slug to the API.

**Prices** are shown in INR using a fixed demo conversion (`1 $ ≈ ₹ 84`,
`src/lib/format.ts`). These are demonstration values, not live exchange rates or
real market prices; this is disclosed in the app.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Analytics dashboard |
| `/login` | Sign in |
| `/products` | Product list (search/filter/sort/pagination) |
| `/products/new` | Add product |
| `/products/[id]` | Product details |
| `/products/[id]/edit` | Edit product |
| `/categories` | Category analytics |
| `/analytics` | Full analytics workspace |
| `/settings` | Preferences |
| `/profile` | Account details |
| `not-found` | 404 |

## Project structure

```
src/
  app/
    (dashboard)/            shell-wrapped app: dashboard, products, categories, analytics, settings, profile
    layout.tsx              font + ambient background
    login/                  split auth screen
  components/
    shell/                  sidebar, topbar, bottom nav, drawer, search, menus, icons
    dashboard/              KPI grid, greeting, recent products/activity, chart cards
      charts/               SVG area/donut/sparkline, bar lists, histogram, progress
    products/               toolbar, table, cards, row menu, status badge, form, detail
    ui/                     glass card, skeleton, badges, dialog, states, rating stars
  hooks/                    catalog snapshot, debounce, activity, persisted settings
  lib/
    api/                    client.ts (shared axios), auth.ts, products.ts
    stats.ts                pure catalogue aggregations
    taxonomy.ts             category family grouping
    format.ts               INR demo formatting + helpers
    activity.ts, system.ts  live activity + connection/latency
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
same result. Bad values are normalised: `?page=abc` → 1, `?page=999` → last real
page, invalid `limit`/`sortBy` → defaults.

## Decisions and trade-offs

### Search and category cannot be combined

DummyJSON has no endpoint that searches and filters by category at once. Search
wins: starting a search clears the category filter and vice versa. Search is the
more explicit action, and filtering categories client-side would break correct
server pagination totals.

### Admin credentials

DummyJSON only validates its own demo accounts, so the app accepts the admin
credentials above locally and, for that sign-in, exchanges them for the demo
account under the hood to obtain a real token. The UI then shows the admin
identity ("Karan Darade"). This is a presentation/demo mapping, not a change to
the API's authentication.

### Add / edit / delete are simulated locally

The write endpoints return a plausible object but persist nothing. The app still
calls them, then mirrors each change in a `localStorage`-backed overrides store
that is merged over the API data (and reflected in the dashboard KPIs). Settings
can clear these local changes; the UI states that they are browser-only.

### Fast typing never shows stale results

Search is written to the URL live but the request is debounced. `useProducts`
also aborts the previous request (`AbortController`) and tags responses with an
incrementing id, dropping any late response — verified against `&delay=2000`.

### Duplicate submissions

Login, Save, Delete and Refresh guard against double clicks with an in-flight
ref and a disabled button.

## Notes (choices, one problem, and AI)

**Choices.** List state lives in the URL for shareable links; every request goes
through one Axios instance with interceptors; dashboard metrics are computed
from real data only, and writes are mirrored locally rather than faked on the
server. The redesign rebuilt the whole visual layer on a token-based dark system
and split responsibilities into a glass shell, a dashboard data provider (one
bulk fetch shared by the sidebar, topbar, KPI cards and charts) and small
single-purpose components.

**A problem I hit and how I fixed it.** Next.js 16 renamed `middleware` to
`proxy`, and React 19's lint rules reject calling `setState` synchronously
inside `useEffect` (and reassigning variables during render). I reworked the
data hooks — including the new `useCatalogSnapshot` — to derive `loading`/`error`
by comparing a query signature against the last completed result, and rewrote
the donut slice math to avoid mutation during render, keeping the abort/stale
protection intact.

**Where AI helped.** I used an AI coding assistant to accelerate the design
system and repetitive markup, and to probe the live API for real response shapes
and payload sizes. It also surfaced the Next 16 `middleware` → `proxy` rename and
the React 19 effect/immutability lint rules. The product/architecture decisions,
the honest-metrics stance, the URL contract and final verification were directed
and checked by me.

## Known limitations

- Changes are per-browser and are not saved on DummyJSON.
- Polling is used for "real time"; the API has no push channel.
- Prices are a fixed-rate INR demonstration of the API's USD values.
- No automated test suite; verification was manual plus `lint`, `build` and a
  production smoke test of the route guard.
