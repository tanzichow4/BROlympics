# Brolympics — Season 1 site

Standings, schedule and per-event stats for Brolympics Season 1. One static
page, no build step, no dependencies. Open the folder in VS Code and go.

Built on the Brolympics design system kit, so the site and the Instagram Reels
stay one thing.

---

## Run it

The page uses ES modules, which browsers refuse to load over `file://`. So it
needs to be served, not double-clicked. Two options:

**VS Code Live Server** (easiest)

1. Open this folder in VS Code.
2. Install the **Live Server** extension when VS Code offers it — it is in
   `.vscode/extensions.json`, so the prompt appears on first open.
3. Right-click `index.html` → **Open with Live Server**.

**Command line**

```bash
npx serve .          # or: python3 -m http.server 8000
```

Then open the address it prints.

---

## Where things are

```
brolympics-site/
├── index.html            the page structure. Rarely needs touching.
├── css/
│   ├── tokens.css        colours, type, spacing — EXPORTED FROM THE KIT.
│   └── site.css          everything else. Reads only kit variables.
├── js/
│   ├── season.js         ← THE FILE YOU EDIT. Teams, events, results.
│   ├── courts.js         the chalk-line court motifs, one per sport.
│   ├── render.js         builds the HTML for each part of the page.
│   └── main.js           wires it together: theme toggle, event tabs.
└── assets/
    ├── brolympics-seal-chalk.svg   for dark grounds. Also the favicon.
    └── brolympics-seal-night.svg   for chalk grounds and the day theme.
```

---

## Updating after an event

Everything on the page derives from `js/season.js`. The standings, the hero
countdown, the schedule badges and the event tabs all recalculate themselves —
there is no second place to update and no total to add up by hand.

1. Open `js/season.js` and find the event in `EVENTS`.
2. Change `status: "scheduled"` to `status: "final"`.
3. Fill in `results` — one row per team, places 1 to 5.
4. Fill in `stats` — four figures worth reading.
5. Set the next event's `status` to `"next"`.
6. Save and refresh.

### Scoring

Placing points are `10 · 7 · 5 · 3 · 1`, set in `PLACE_POINTS`. Event 08 is
worth double (`DOUBLE_POINTS_EVENT`), so the season stays live to the final
whistle. Ties break on points, then events won, then alphabetically.

### When the teams are drafted

Team names and pinnie colours are placeholders. On draft night:

- Names: `TEAMS` in `js/season.js`.
- Colours: the `--team-*` variables in `css/tokens.css` — and in the kit, so
  the Reels match.
- Remove the placeholder line in the footer of `index.html`.

If a team picks a pale colour, set `outline: true` on it so its bar does not
disappear on the page ground. Bone and Blackout already do.

---

## House rules the site has to keep

From the kit's brand book. Worth knowing before you add a page:

- **No player names anywhere.** The Reels never show names, so every figure on
  the site is recorded against a team. Ask the organiser before that changes.
- **No swearing**, including "hell".
- The organisers are **"the Committee"**, never a person's name.
- Number things like a league does: "Event 03 of 08", two digits with a leading
  zero. `pad2()` in `js/season.js` does it.
- Sentence case for headings. UPPERCASE only in the Barlow Condensed styles.
- No emoji in the design.
- Don't mention money, entry fees or a cash pot. The prize is still being
  decided.
- **Everything is square** (`--radius-0`). Only the seal, its dots and player
  photo circles are round.
- Text is `--ink`, plus at most one red word per screen in `--rule-red`.
  `--trophy-yellow` is for big titles only, never on a light ground.

---

## Design notes

- **Themes.** Night is the default. The toggle in the header switches to day
  and remembers the choice in `localStorage` for that browser only. Both
  themes are defined in `css/tokens.css`; nothing else sets a colour.
- **Fonts.** Georgia tells the story, Barlow Condensed is the scoreboard. In
  the Reels the scoreboard face is Bahnschrift, which only exists on Windows,
  so Barlow Condensed is the web stand-in and Bahnschrift stays second in the
  stack.
  To try a different pairing, change `--font-serif` and `--font-label` in
  `css/tokens.css` and the Google Fonts `<link>` in `index.html`. Those two
  edits swap the whole site.
- **Court lines.** The faint chalk lines behind the hero and each event header
  are the brand's texture. Keep them sparse. Add a sport by adding a key to
  `COURTS` in `js/courts.js` matching the event's `court` value.
- **Accessibility.** The event tabs follow the ARIA tabs pattern (arrow keys,
  Home and End). Focus rings are a 3px `--focus` outline. Animation is behind
  `prefers-reduced-motion`. Every table scrolls inside its own box so the page
  never scrolls sideways on a phone.

---

## Deploying

It is a static folder, so anything works. No build command, no output
directory.

**GitHub Pages**

```bash
git init
git add .
git commit -m "Brolympics Season 1 site"
git branch -M main
git remote add origin git@github.com:<you>/brolympics.git
git push -u origin main
```

Then Settings → Pages → Source: `main`, folder `/ (root)`.

**Netlify or Vercel** — drag the folder onto the dashboard, or point it at the
repo and leave the build settings empty.

Once it is live, add an `og:image` to `index.html` so the link looks right when
it lands in the group chat.

---

## Still to build

- A **Teams** page, one card per team in its pinnie colour.
- A **Rules** page: the contract and the rules in the Committee voice, with
  rulings as quote blocks.
- An **Episodes** page linking the Reels, numbered Ep 01, Ep 02.
- Real figures, once the Committee files them.
