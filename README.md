# Influencer Search App

A React + Vite + Tailwind app for browsing top creators across Instagram, TikTok, and YouTube.

## What Changed

### Routing: query param → path param for platform
The profile detail route was migrated from `/profile/:username?platform=X` to
`/profile/:platform/:username`, so a profile's platform is part of the URL path rather than
a query string. This makes profile URLs cleaner and unambiguous (a username can't collide
across platforms in the URL).

This required fixes in every place that built or consumed a profile link:
- `ProfileCard.tsx` — `navigate()` call updated to build `/profile/{platform}/{username}`.
- `ProfileDetailPage.tsx` — now reads `platform` and `username` via `useParams()` instead of
  pulling `platform` from `useSearchParams()`.
- `MyListPage.tsx` — saved-profile links updated to include `platform` in the path.
- `App.tsx` — route definition updated to `/profile/:platform/:username`.

### Code splitting
Route-level lazy loading was added in `App.tsx` using `React.lazy` + `Suspense`, with a
shared `PageLoader` fallback, so `SearchPage`, `ProfileDetailPage`, and `MyListPage` are
each split into their own chunk and only loaded when navigated to.

### Test suite
Added a starter Vitest suite covering:
- `dataHelpers.filterProfiles` — empty query and no-match cases.
- `formatters.formatEngagementRate` — typical value and zero.
- `useProfileStore` — no duplicate saves, remove-by-username.
- `ProfileCard` — regression test asserting `navigate()` is called with the new
  `/profile/{platform}/{username}` path shape (this directly covers the routing bug fixed
  above).
- `ProfileDetailPage` — renders the "Profile Data Unavailable" state when the loader
  resolves no data.

## Libraries Added
- `vitest` (dev) — test runner.
- `jsdom` (dev) — DOM environment for Vitest, configured via `environment: 'jsdom'` in
  `vitest.config.ts`.

No testing-library / jest-dom was installed. Component tests render manually via
`react-dom/client` (`createRoot`) and assert against `container.textContent` /
`querySelector` + `.click()`, instead of `render`/`screen`/`fireEvent` from
`@testing-library/react`.

## Assumptions
- `[CONFIRM]` Saved profile objects (in `useProfileStore`) carry a `platform` field so that
  `MyListPage` can build a correct `/profile/{platform}/{username}` link. This wasn't
  verified against the actual `UserProfileSummary` type — if `platform` isn't currently
  stored on save, the saved-list links will still be broken and need a small change to
  `addProfile` to persist it.
- No fallback/catch-all route (`*`) currently exists, so navigating to an unmatched or
  stale URL renders nothing rather than redirecting. Assumed acceptable for now since it
  isn't user-facing in the current flows, but worth fixing (see below).
- Assumed that the mock data provided in `assets/data` is the source of truth and would not change structure during the assignment.
- Assumed that users prefer a "native-app" feel with persistent scroll, which prioritized UX over pure URL-only state.
- **Accessibility**: Assumed that the primary target for screen readers is the main influencer listing and navigation paths. Tested for standard tab-order navigation and ensured text contrast meets accessibility guidelines.

## Trade-offs
- **Manual DOM testing vs. testing-library**: Given the install was scoped to
  `vitest` + `jsdom` only, component tests use direct `react-dom/client` rendering and raw
  DOM queries instead of `@testing-library/react`. This keeps the dependency footprint
  minimal but means tests are more verbose and slightly more brittle to markup changes
  (e.g. `container.querySelector('.group')` instead of a role/text query). Adding
  `@testing-library/react` later would be a low-cost upgrade.
- **Path param over query param for platform**: Path params make the URL structure rigid
  (platform must always be present and in that position), versus a query param which is
  more flexible to omit or extend. Chose path params for cleaner, more conventional REST-like
  URLs at the cost of that flexibility.
- **URL vs. Persistence**: I chose a hybrid approach. While URL-only state is technically "cleaner" for web-navigability, I manually persisted scroll position via `Zustand`. This was a conscious trade-off to ensure a seamless experience when users toggle between deep-listed items and profile details.
- **Accessibility vs. Brand Colors**: Some UI elements (like the helper text in light mode) were adjusted to satisfy the 4.5:1 contrast ratio requirement, slightly deviating from the initial high-aesthetics, low-contrast design. Accessibility compliance was prioritized as a core functionality requirement.

## Remaining Improvements
- Verify/fix `profile.platform` persistence on save so `MyListPage` links are correct (see
  Assumptions above) — currently the highest-priority follow-up.
- Add a catch-all route (`<Route path="*" element={<Navigate to="/" replace />} />`) so
  unmatched URLs redirect instead of rendering a blank page.
- Add an error boundary around the lazy-loaded routes — `Suspense` alone only covers the
  loading state, not render errors in a lazy chunk.
- Consolidate the three duplicated follower-count formatters (`formatFollowersDetail`,
  `formatFollowersLocal` in two files) into a single shared util.
- Expand test coverage beyond the current starter set (empty-state rendering for
  `MyListPage`, `ProfileList`'s "No profiles found" case, store scroll-position
  get/set).
- **Audit Coverage**: While the header and main navigation have been audited, a few complex components (like the list sorting logic) still require a manual accessibility audit for screen-reader verbosity.
- **Type Safety**: The current build uses an `unknown` cast in `dataHelpers.ts` to bypass schema mismatches between raw JSON and TypeScript interfaces; a more robust solution would be to implement runtime validation (e.g., using `Zod`) to map JSON to the `UserProfileSummary` type.

## Project Scripts
- `npm run dev` — start development server.
- `npm run test` — run the Vitest suite.
- `npm run build` — generate production build.