# TODO - Connect all pages (SPA) and make UI/UX work

## Step 1: Unify navigation strategy
- [x] Confirmed SPA approach: `index.html` acts as a single shell using hash routing.

## Step 2: Fix navigation wiring in `index.html`
- [ ] Ensure every sidebar link points to an existing hash route.
- [ ] Remove broken links like `pages/books.html` / `pages/users.html` (do not exist).

## Step 3: Ensure page renderers exist and update content area
- [ ] Validate that `APP.pages` includes all sidebar destinations.
- [ ] Ensure `navigate()` updates active state + renders correct page.

## Step 4: Make auth/login flow consistent
- [ ] Update `Login.js` / `SignUp` flow to redirect to `App.html` (or to a hash route), not missing `Dashboard.html`.

## Step 5: Verify runtime
- [ ] Run backend (Deno) and open `App.html`.
- [ ] Click through sidebar links: dashboard, books, students, borrowing, fines, reports, settings, backup, logs.


