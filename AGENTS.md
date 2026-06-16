# AGENTS.md

Guidance for AI agents and contributors working in the **Property-Lister** codebase.
Read this before making changes. It captures how the app is built, the conventions to
follow, and the product direction we are steering toward.

---

## 1. Product vision

Property-Lister is a real-estate marketplace where users **browse, search, favourite,
and message about property listings**, and where owners can **list and manage** their
own properties.

Our north star is the experience offered by mature listing portals (e.g. rew.ca):
fast, faceted search; rich listing detail; trustworthy accounts; and clear market
context. We do not need every feature they have, but every change should move us toward
a **searchable, trustworthy, conversion-focused** listings product.

### Guiding principles
- **Search is the core loop.** Filtering, sorting, and pagination must be first-class
  and discoverable, not afterthoughts.
- **Trust matters.** Real accounts, secure handling of credentials, and accurate
  listing data come before cosmetic features.
- **Listings sell themselves.** Invest in listing quality: images, key facts
  (beds/baths/sqft/location), and status clarity (Active / Sold / Featured).
- **Ship small, vertical slices.** Prefer one end-to-end feature (schema → route →
  view) over broad half-finished changes.

---

## 2. Tech stack & architecture

- **Runtime:** Node.js (10+), Express 4
- **Views:** EJS server-rendered templates in `views/`, partials in `views/partials/`
- **Database:** PostgreSQL via `pg` Pool, configured in `lib/db.js`
- **Styling:** SCSS authored in `styles/`, compiled to `public/styles/` via `sass`
- **Sessions:** `cookie-session`, with a CSRF token issued per session in `server.js`
- **Security middleware:** `helmet`, CSRF check on all mutating verbs

### Request flow
```
server.js  ──mounts──►  routes/*.js  ──query──►  PostgreSQL (lib/db.js)
                                   └──render──►  views/*.ejs  ──assets──►  public/
```

### Key directories
| Path | Purpose |
|---|---|
| `server.js` | App bootstrap, middleware, session/CSRF, route mounting |
| `routes/` | One file per resource (`properties`, `login`, `favourite`, `messages`, `myProperty`) |
| `views/` | EJS templates; `partials/_header.ejs` is the shared header |
| `styles/` → `public/styles/` | SCSS source → compiled CSS (never edit compiled CSS) |
| `db/schema/` | Table definitions, one file per table, run in filename order |
| `db/seeds/` | Seed inserts, one file per table, run in filename order |
| `lib/db.js` | PG connection params |
| `bin/resetdb.js` | Drops, recreates, and reseeds the database |

---

## 3. Conventions (follow these)

- **Routes are factory functions:** every file in `routes/` exports
  `module.exports = (db) => { ... return router; }`. Keep this pattern.
- **Do not add routes to `server.js`.** Create or extend a resource file in `routes/`.
- **One table per schema/seed file**, prefixed with an ordering number
  (e.g. `01_users.sql`, `02_properties.sql`). The reset script runs them in order.
  (Today `schema.sql`/`seeds.sql` are monolithic; new tables may follow either style
  as long as `db:reset` runs cleanly end to end.)
- **Parameterize every query.** Use `$1, $2, ...` placeholders — never string-concat
  user input into SQL. See `routes/properties.js` for the established pattern.
- **Validate input at the boundary.** Reuse helpers like `parsePositiveInteger` and
  return `400` on bad input, `500` via `sendServerError` on failures.
- **Auth-guard mutations.** Check `req.session.userId` and redirect to `/login` (or
  return `401`) before any write.
- **Never edit compiled CSS** (`public/styles/*.css`). Edit the `.scss` source and let
  `npm run build:css` regenerate it. `layout.css` is generated from `layout.scss`.
- **Keep CSRF intact.** Forms that POST/PUT/PATCH/DELETE must include the
  `res.locals.csrfToken` (as `_csrf` field or `x-csrf-token` header).

---

## 4. Build & run

```bash
npm i                 # install dependencies
npm run db:reset      # drop, recreate, and seed the database (destroys local data)
npm run local         # start with nodemon (auto-reload) on http://localhost:8080
npm start             # production-style start (builds CSS first)
npm run build:css     # compile styles/ -> public/styles/
```

Requires a local `.env` (copy from `.env.example`) with Postgres credentials.
Run `npm run db:reset` after any change to `db/schema/` or `db/seeds/`.

---

## 5. Current state & known gaps

The app works as a basic CRUD listings site but has notable gaps versus the product
vision. Agents should treat these as the standing backlog.

### Critical (address first)
- ✅ **Real authentication (done).** `routes/login.js` now handles `POST /login`
  (email + `bcryptjs` password check) and sign-up at `GET|POST /login/register`.
  Seed passwords are hashed; the `users.email` column is `UNIQUE`. The hardcoded
  `req.session.userId = 1` handler has been removed from `server.js`. Seed accounts
  all use the password `password` for local testing.
- **No real session-to-user verification** on ownership-sensitive actions beyond a
  truthy `userId`.

### High value (search is the core loop)
- ✅ **Faceted search (done).** `GET /properties` accepts `min_price`, `max_price`,
  `min_beds`, `min_baths`, `property_type`, `city`, `neighbourhood`, and `sort`
  (newest / featured / price_asc / price_desc). A market-stats bar shows total result
  count. Schema gained `property_type`, `square_feet`, `neighbourhood`,
  `latitude`, `longitude` columns; seeds updated with real values.
- ✅ **Pagination UI (done).** The existing `getPagination` backend logic is now
  surfaced with numbered page links and Prev/Next controls in `properties.ejs`.

### Medium
- ✅ **Listing quality improved (done).** Cards and detail pages now show square
  footage, property type, neighbourhood, status badges (Featured / Active / Sold).
  The `property.ejs` detail page has a key-facts grid and full address display.
- ✅ **Multi-image gallery (done).** A `property_images` table holds extra slides per
  listing. The detail page renders a Bootstrap 5 carousel with a thumbnail strip.
  `POST /properties` accepts `extraImageUrl[]` fields and inserts them. Seeds include
  2–3 Unsplash gallery images per property.
- ✅ **Map view (done).** All seed properties have real `latitude`/`longitude` values.
  The listings page has a "Show map" toggle that lazy-loads a Leaflet.js map with
  clickable pin popups (name + price → detail link).
- ✅ **Engagement (done).** Market-stats bar shows median price, avg $/sqft, and
  per-type counts for the current result set. Logged-in users can save named searches
  (stored in `saved_searches` table) and view/delete them at `/saved-searches`.
  The property detail page shows up to 3 "Similar listings" from the same city and
  property type.

### Cleanup
- ✅ **`widgets` removed (done).** The leftover `widgets` table/schema/seeds and the
  duplicate/broken numbered skeleton files (`db/schema/01_users.sql`,
  `db/seeds/01_users.sql`) were deleted. `db/schema/schema.sql` and `db/seeds/seeds.sql`
  are now the single source of truth for the DB layer.

---

## 6. Roadmap (suggested order)

1. ✅ **Secure accounts (done)** — sign-up, login with hashed passwords, real session
   lookup; hardcoded `userId` and plaintext seed passwords removed.
2. ✅ **Faceted search (done)** — `property_type`, `square_feet`, `neighbourhood`,
   `latitude`, `longitude` added to schema; price-range / beds / baths / type /
   city / neighbourhood filters + sort implemented in `routes/properties.js`.
3. ✅ **Pagination UI (done)** — numbered page links and Prev/Next surfaced in
   `properties.ejs`.
4. ✅ **Listing quality (done)** — status badges (Featured/Active/Sold), square
   footage, property type, and neighbourhood on cards and detail pages.
5. ✅ **Multi-image gallery (done)** — `property_images` table added; Bootstrap carousel
   with thumbnail strip on detail page; `addNewProperty` supports extra image URLs.
6. ✅ **Location & map (done)** — real coordinates in seeds; Leaflet.js toggle map on
   listings page with pin popups.
7. ✅ **Engagement (done)** — market-stats bar (median price, avg $/sqft, type counts);
   saved searches (`saved_searches` table, `/saved-searches` CRUD, nav link);
   similar listings on property detail page.

When you complete an item, update Section 5 and this roadmap so the next agent has an
accurate picture.

---

## 7. Definition of done for a change

- Schema changes ship with matching **seed updates** and run cleanly via `npm run db:reset`.
- New queries are **parameterized** and inputs are **validated**.
- Mutations are **auth-guarded** and **CSRF-protected**.
- New UI is server-rendered EJS consistent with existing views and styled via **SCSS**
  (not edited compiled CSS).
- The app **starts without errors** (`npm run local`) and the changed flow is manually
  verified.
