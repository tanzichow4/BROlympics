# BROlympics

React + TypeScript app built with Vite.

## Getting started

Requires Node 20+.

```sh
npm install
npm run dev
```

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

- `src/data/season.ts` — teams, events and results. **The only file to edit after an event**; standings, hero countdown and schedule badges all derive from it.
- `src/data/courts.ts` — chalk-line court motifs, one per sport.
- `src/styles/tokens.css` — design tokens exported from the Brolympics kit (treat as generated).
- `src/styles/site.css` — site styles, using only kit variables.
- `src/components/` — Header, Hero, Standings, Schedule, Events.
- `brolympics-site/` — the original static version, kept for reference. Its README has the brand house rules (no player names, "the Committee", no money talk, etc.).
