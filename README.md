# NextGenesis Product Admin Dashboard

A small admin dashboard where a user logs in and manages products from the free
[DummyJSON](https://dummyjson.com) API. Built with Next.js (App Router),
React, TypeScript, Tailwind CSS and Axios.

- Repository: https://github.com/KaranDarade/React-Dashboard-NextGenesis-
- Live demo: https://react-dashboard-nextgenesis.vercel.app
- Demo login: username `emilys`, password `emilyspass`

## Tech stack

- Next.js 16 (App Router, Turbopack) + React 19 + TypeScript
- Tailwind CSS v4
- Axios for every HTTP call (one shared instance)
- No React Query, SWR or table/pagination libraries - all logic is hand-written

## Setup

```bash
npm install
npm run dev      # http://localhost:3000
```

Optional: copy `.env.example` to `.env.local` if you want to point at a
different API base URL. The app falls back to `https://dummyjson.com` when the
variable is missing, so it works with no configuration.

Other scripts:

```bash
npm run build    # production build
npm run start    # serve the production build
npm run lint     # eslint
```

## What is finished

- [x] Login page (`POST /auth/login`) with wrong-credential errors
- [x] Only logged-in users can open product pages (server-side route guard)
- [x] Logout button
- [x] Product list with image, title, category, price, rating and stock
- [x] Table on desktop, cards on mobile
- [x] Pagination via `limit`/`skip` with page numbers, Previous/Next
- [x] Page size selector (10 / 20 / 50)
- [x] "Showing 21-40 of 194" range text
- [x] Debounced search (`/products/search?q=`)
- [x] Search resets to page 1
- [x] Category filter (`/products/categories`)
- [x] Sort by price / rating / title (server-side `sortBy`/`order`)
- [x] Product details page `/products/[id]` with images, description, price, reviews
- [x] Not-found page for an unknown or wrong id
- [x] Add / edit form with validation and a delete confirmation popup
- [x] Loading, empty and error states with a Retry button
- [x] One shared Axios setup file that adds the token and handles errors
- [x] Page, search, filter and sort kept in the URL (shareable / refresh-safe)
- [x] Guards against out-of-order search responses and duplicate submissions

## Project structure

```
src/
  app/                     routes (page, layout, not-found, login, products...)
  components/
    layout/                header, demo banner
    products/              list, table, cards, pagination, search, form, detail
    ui/                    spinner, empty/error/not-found states, dialog, badges
  hooks/                   useProducts, useProduct, useCategories, useDebounce
  lib/
    api/                   client.ts (shared axios), auth.ts, products.ts
    auth.ts                token/session cookie + localStorage helpers
    search-params.ts       safe URL parsing/building for list state
    overrides.ts           merge logic for locally created/edited/deleted items
    constants.ts           config, page sizes, sort options, fallback image
    format.ts              currency/date/range formatting + classNames
  store/                   ProductOverridesContext (localStorage-backed)
  types/                   shared types
  proxy.ts                 route protection (Next 16 renamed middleware -> proxy)
```

All API calls live in `src/lib/api/*`; UI components never call Axios directly
except through those modules (the add/edit/delete handlers import the API
functions, not raw Axios).

## URL contract (single source of truth)

```
/products?q=&category=&sortBy=title|price|rating&order=asc|desc&page=1&limit=10
```

The URL is the source of truth for page, search, category, sort and page size,
so refreshing or sharing a link reproduces the same result. All values are
parsed through `parseListQuery`, which applies safe defaults:

- `?page=abc` -> page 1
- `?page=999` -> clamped to the last real page once the total is known
- `?limit=999` -> fallback to the default page size (only 10/20/50 are valid)
- unknown `sortBy` -> no sorting

## Decisions and trade-offs

### Search and category cannot be combined

DummyJSON has no endpoint that searches **and** filters by category at the same
time (`/products/search` ignores a `category` parameter, and
`/products/category/{slug}` has no `q` parameter). **Search wins:** starting a
search clears the category filter, and picking a category clears the search.
This was chosen because search is the more explicit user action, and because
filtering categories client-side would break correct server pagination totals.
The list page shows a small note while a search is active.

### Add / edit / delete are simulated locally

DummyJSON's write endpoints return a plausible object but do not persist
anything. The app still calls them (so the Axios usage is real), then mirrors
every change in a `ProductOverridesContext` store backed by `localStorage`:

- created products get a `local-<timestamp>` id and are shown first on page 1
- edits are kept as a per-id patch applied over the API product
- deletes are remembered and filtered out

The result is merged over whatever the API returns, so changes survive a page
refresh in the same browser. The list page shows a banner making clear these
changes are not saved on the server. Deleted counts and created items adjust the
displayed total on a best-effort basis, since local items are not paginated by
the API.

### Fast typing never shows stale results

The search term is written to the URL live (so it stays shareable), but the
request is debounced. On top of that, `useProducts` aborts the previous request
with an `AbortController` and tags each response with an incrementing request
id, dropping any response that is not the latest. This holds even with
`&delay=2000` on the API. Canceled requests are ignored rather than shown as
errors.

### Duplicate submissions

Login, Save, Delete and Retry all guard against double clicks with an in-flight
ref and a disabled button, so rapid clicking never fires multiple requests.

## Notes (choices, one problem, and AI)

**Choices.** I kept list state in the URL instead of component state so links
are shareable and refresh-safe. I put every request behind one Axios instance
with request/response interceptors, so the bearer token and error handling live
in exactly one place. Because DummyJSON cannot persist writes, I chose a
localStorage-backed overrides store rather than faking persistence, which keeps
the change visible and honest. I used a small number of focused hooks and kept
components presentational so the API logic stays out of the UI.

**A problem I hit and how I fixed it.** Next.js 16 renamed `middleware` to
`proxy`, and React 19's lint rules flagged my original data hooks for calling
`setState` synchronously inside `useEffect` (it can cause cascading renders). I
reworked the hooks to derive `loading`, `data` and `error` by comparing the
current query signature against the last completed result, so no state is set
synchronously in an effect while the abort/stale-request protection stays
intact. (I also had to scaffold into a temp folder because `create-next-app`
rejects directory names with spaces and capitals.)

**Where AI helped.** I used an AI coding assistant to speed up the boilerplate
(scaffold, Tailwind markup, repetitive form fields), to probe the live API for
its real response shapes and limits, and it surfaced the Next 16
`middleware`-to-`proxy` rename and the React 19 `setState`-in-effect lint rule
that I then designed around. Architecture choices, the URL contract, the
search-vs-category decision and the review of the final behavior were directed
and verified by me.

## Known limitations

- Changes are per-browser and are not saved on DummyJSON.
- The local `ProductOverridesContext` is not used for the server-rendered shell,
  so created items appear after hydration.
- No automated test suite; verification was manual plus `lint`/`build` and a
  production smoke test of the route guard.
