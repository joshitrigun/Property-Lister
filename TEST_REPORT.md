# Property Lister Test Report

Date: 2026-06-15  
Role: Software Engineer in Test  
Environment: Windows, Node app started with local environment variables, browser automation against `http://localhost:8080`

## Summary

The application starts and serves the public home page, login page, static CSS, and client JavaScript. Authentication redirects and CSRF protections behaved as expected in the tested flows.

Full end-to-end property, favorites, messages, and database-backed workflows could not be completed because the local PostgreSQL service was not reachable on `localhost:5432`. The project also has no local `.env` file, and `dotenv` logs an `ENOENT` error at startup before continuing with process environment values.

## Environment Notes

- Started app with `DB_HOST=localhost`, `DB_USER=labber`, `DB_PASS=123`, `DB_NAME=midterm`, `DB_PORT=5432`, `PORT=8080`, and `SESSION_SECRET=test-session-secret`.
- No local `.env` file was present.
- PostgreSQL connection failed with `ECONNREFUSED` for both `::1:5432` and `127.0.0.1:5432`.
- The app still listened on port `8080` after the database health check failed.

## Validation Commands

| Check | Expected | Observed | Result |
| --- | --- | --- | --- |
| `npm run build:css` | Sass compiles CSS successfully. | Completed successfully. | Pass |
| `node --check server.js` and touched route/script files | JavaScript syntax is valid. | No syntax errors reported. | Pass |
| `npm audit` | No known dependency vulnerabilities. | `found 0 vulnerabilities`. | Pass |

## Browser And HTTP Test Results

| Area | Test | Expected | Observed | Result |
| --- | --- | --- | --- | --- |
| Startup | Start app with local environment variables. | App listens on configured port. | App listened on `8080`; startup also logged missing `.env` and database connection refused errors. | Partial |
| Home | `GET /` in browser. | Public home page renders with primary CTA. | Status `200`, title `Home Page`, visible text included `Find your dream property!` and `View All Properties`. | Pass |
| Login page | `GET /login`. | Login page renders and includes CSRF token. | Status `200`, title `Login into E-Commerce`, one `_csrf` hidden input present. | Pass |
| Login submit | `POST /login` with session CSRF token. | Demo login sets session and redirects to properties. | Status `302`, `Location: /properties`. | Pass |
| Logout CSRF | `POST /logout` without CSRF token. | Request is rejected. | Status `403`. | Pass |
| Logout valid token | `POST /logout` with session CSRF token. | Session clears and redirects home. | Status `302`, `Location: /`. | Pass |
| Static CSS | `GET /styles/main.css`. | CSS asset is served. | Status `200`, `Content-Type: text/css`. | Pass |
| Static JS | `GET /scripts/app.js`. | Client script is served. | Status `200`, `Content-Type: application/javascript`. | Pass |
| Properties list | `GET /properties`. | Property list renders when database is available. | Status `500`, body `{"error":"Internal server error"}` because local Postgres was not reachable. | Blocked |
| Add property page | Anonymous `GET /properties/new`. | Unauthenticated users are redirected to login. | Final browser page was login with status `200` after redirect. | Pass |
| My properties | Anonymous `GET /myProperty`. | Unauthenticated users are redirected to login. | Final browser page was login with status `200` after redirect. | Pass |
| Favorites | Anonymous `GET /favourite`. | Unauthenticated users are redirected to login. | Final browser page was login with status `200` after redirect. | Pass |
| Messages | Anonymous `GET /messages`. | Unauthenticated users are redirected to login. | Final browser page was login with status `200` after redirect. | Pass |

## Not Fully Tested

These flows require a reachable and seeded PostgreSQL database:

- Property listing data rendering and pagination.
- Property detail page rendering.
- Creating a new property.
- Marking a property as sold.
- Deleting an owned property.
- Adding/removing favorites.
- Sending and viewing owner messages.
- Owner-scoped authorization behavior with real database records.

## Issues Found

1. Missing local `.env` file causes `dotenv` to log an `ENOENT` startup error.
   - Expected: startup should be quiet when environment variables are supplied another way, or documentation should clearly instruct creating `.env` from `.env.example`.
   - Observed: app continued running but logged a stack trace for the missing file.

2. Local PostgreSQL was unavailable on `localhost:5432`.
   - Expected: database-backed routes render seeded application data.
   - Observed: `/properties` returned a generic `500`, and startup health check logged `ECONNREFUSED`.

3. The app continues listening even when the database health check fails.
   - Expected: this can be acceptable for degraded startup, but production behavior should be intentional and documented.
   - Observed: public and auth pages worked, while DB-backed pages failed at request time.

## Recommendations

1. Create a local `.env` from `.env.example` for development and add setup instructions to the README.
2. Start or provision PostgreSQL locally, then run `npm run db:reset` before repeating full end-to-end testing.
3. Consider making missing `.env` non-noisy when process environment variables are already supplied.
4. Decide whether failed database startup should be fatal in production, or exposed via a health endpoint while keeping public pages available.
5. Add automated integration tests for auth redirects, CSRF rejection, and the main property workflows with a test database.