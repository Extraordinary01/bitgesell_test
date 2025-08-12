# SOLUTIONS

This document summarizes **all changes, fixes, and test strategy options** made to test project (backend + frontend).

---

## TL;DR

- Backend: converted blocking file I/O to async `fs/promises`, added pagination + server-side search (`q`, `page`, `limit`), validation (Joi), cache+watch strategy for expensive stats, and robust error handling.
- Frontend: Items list now uses server-side pagination and search, supports `AbortController` integration in `DataContext.fetchItems`, virtualization with `react-window`, improved UI/UX (skeletons, accessibility, styling), and fixed unmount memory leaks. ItemDetail and App were polished as well.
- Tests: Jest + React Testing Library tests added for `Items` and `ItemDetail`.

---

## Files changed / added

### Backend

- `routes/items.js` (or `routes.js`) —
  - `readData()` uses `fs/promises` with `'utf-8'`.
  - `GET /api/items` now accepts `q`, `page`, `limit` and returns `{ total, page, limit, items }`.
  - `GET /api/items/:id` uses `parseInt(req.params.id, 10)` and returns 404 error if not found.
  - `POST /api/items` performs validation with `Joi` and writes file asynchronously.

- `routes/stats.js` (or `/api/stats` handler) —
  - In-memory cache (`statsCache`) with `fs.watch` invalidation and debounced recalculation, recalculates on startup.

### Frontend

- `state/DataContext.js` —
  - `fetchItems({page, limit, q}, signal)` accepts an AbortController signal and forwards it to `fetch()`.
  - Added safe state set logic inside context where necessary.

- `src/components/Items.js` —
  - Pagination + search client UI that calls `fetchItems({page, limit, q}, signal)`.
  - Applies `AbortController` for each in-flight request and aborts on cleanup or dependency change.
  - Integrated `react-window` `FixedSizeList` for virtualization.
  - Loading skeletons, accessible search input, focus styles, hover effects, and improved pagination controls.

- `src/components/ItemDetail.js` —
  - Uses `AbortController` for the detail request, shows skeleton loading states, back navigation, improved layout and error handling.

- `src/App.js` and `src/styles.css` —
  - Polished header/nav with `NavLink` active styles, global skeleton styling, consistent font and layout.
