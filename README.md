# BROlympics

React + TypeScript app built with Vite.

## Getting started

Requires Node 20+.

```sh
npm install
cp .env.example .env   # then set ADMIN_PASSWORD and SESSION_SECRET
npm run dev            # site on :5173, API on :3001
```

## Admin panel

Visit `/admin` and sign in with `ADMIN_PASSWORD`. Edits to teams, events, results,
stats and rulings are saved on the server (`server/data/season.json`) and show on the
public site immediately. Standings and the countdown recalculate on their own.

The auth is server-side: passwords are checked on the server, sessions are signed
HttpOnly cookies that expire after 8 hours, and logins are rate limited. Saves are
validated on the server.

**Production:** `npm run build && npm start` (set `NODE_ENV=production`, `ADMIN_PASSWORD`,
`SESSION_SECRET`). This needs a Node host rather than static hosting, and `DATA_FILE`
should point at a persistent disk or edits are lost on redeploy. Serve it over HTTPS.

## Scripts

| Script               | Purpose                      |
| -------------------- | ---------------------------- |
| `npm run dev`        | Start dev server             |
| `npm run build`      | Typecheck and build for prod |
| `npm run preview`    | Preview the production build |
| `npm test`           | Run tests once (Vitest)      |
| `npm run test:watch` | Run tests in watch mode      |
| `npm run coverage`   | Tests with coverage report   |
| `npm run lint`       | ESLint                       |
| `npm run format`     | Prettier                     |
| `npm run typecheck`  | TypeScript check             |

## Where things are

- `src/data/defaults.ts` — starting data, used until something is saved from `/admin`.
- `src/data/season.ts` — scoring rules and derived values (standings, countdown).
- `src/data/validate.ts` — checks shared by the server and the admin form.
- `src/admin/` — the `/admin` login and editor.
- `server/` — Express API: login, session, save.
- `src/data/courts.ts` — chalk-line court motifs, one per sport.
- `src/styles/tokens.css` — design tokens exported from the Brolympics kit (treat as generated).
- `src/styles/site.css` — site styles, using only kit variables.
- `src/components/` — Header, Hero, Standings, Schedule, Events.
- `brolympics-site/` — the original static version, kept for reference. Its README has the brand house rules (no player names, "the Committee", no money talk, etc.).
