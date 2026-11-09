/* Entry point. Fills the page from js/season.js and wires up the two
 * interactive bits: the night/day toggle and the event tabs.
 */

import { EVENTS, NEXT_EVENT } from "./season.js";
import {
  renderHero, renderStandings, standingsSummary,
  renderSchedule, renderTabs, renderEventPanel
} from "./render.js";

const $ = id => document.getElementById(id);

/* ---------- Night / day ----------
 * Night is the default look of the site. Day is there for long reading pages.
 * The choice is remembered per browser; it never leaves the viewer's device,
 * so wrap it in try/catch — private windows and blocked site data throw.
 */
function setUpTheme() {
  const button = $("theme-toggle");
  const root = document.documentElement;

  let theme = "night";
  try {
    const saved = localStorage.getItem("brolympics-theme");
    if (saved === "night" || saved === "day") theme = saved;
  } catch (err) { /* storage unavailable — stay on night */ }

  function apply(next) {
    theme = next;
    root.setAttribute("data-theme", theme);
    button.textContent = theme === "day" ? "Night" : "Day";
    button.setAttribute("aria-pressed", String(theme === "day"));
  }

  apply(theme);

  button.addEventListener("click", () => {
    apply(theme === "day" ? "night" : "day");
    try { localStorage.setItem("brolympics-theme", theme); } catch (err) { /* ignore */ }
  });
}

/* ---------- Hero ---------- */
function fillHero() {
  const hero = renderHero();
  $("hero-eyebrow").textContent = hero.eyebrow;
  $("hero-title").textContent = hero.title;
  $("hero-meta").innerHTML = hero.meta;
  $("hero-days").textContent = hero.days;
  $("hero-days-label").textContent = hero.daysLabel;
}

/* ---------- Standings and schedule ---------- */
function fillTables() {
  const summary = standingsSummary();
  $("standings-body").innerHTML = renderStandings();
  $("standings-after").textContent = summary.after;
  $("standings-scoring").textContent = summary.scoring;
  $("standings-remaining").textContent = summary.remaining;
  $("schedule-list").innerHTML = renderSchedule();
}

/* ---------- Event tabs ----------
 * Follows the tabs pattern: arrow keys move between tabs, Home and End jump to
 * the ends, and only the selected tab is in the tab order.
 */
function setUpEvents() {
  const tablist = $("event-tablist");
  const panel = $("event-panel");
  let index = Math.max(0, EVENTS.findIndex(ev => ev.no === NEXT_EVENT.no));

  function select(next, moveFocus) {
    index = (next + EVENTS.length) % EVENTS.length;
    const event = EVENTS[index];

    tablist.innerHTML = renderTabs(event.no);
    panel.innerHTML = renderEventPanel(event);
    panel.setAttribute("aria-labelledby", "tab-" + event.no);

    if (moveFocus) tablist.children[index].focus();
  }

  tablist.addEventListener("click", e => {
    const tab = e.target.closest(".tab");
    if (tab) select(Number(tab.dataset.index), false);
  });

  tablist.addEventListener("keydown", e => {
    const moves = {
      ArrowRight: index + 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: EVENTS.length - 1
    };
    if (!(e.key in moves)) return;
    e.preventDefault();
    select(moves[e.key], true);
  });

  select(index, false);
}

setUpTheme();
fillHero();
fillTables();
setUpEvents();
