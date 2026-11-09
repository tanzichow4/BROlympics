/* Rendering. Each function returns an HTML string for one part of the page;
 * js/main.js puts them on the page and wires up the interaction.
 *
 * Everything here reads from js/season.js. If a number looks wrong on the site,
 * it is wrong in season.js — nothing is hardcoded below.
 */

import {
  TEAMS, EVENTS, STANDINGS, LEADER, NEXT_EVENT,
  EVENTS_COMPLETE, POINTS_REMAINING, ORDINAL,
  pad2, pointsFor, yearOf, daysUntilNextEvent
} from "./season.js";
import { courtSvg } from "./courts.js";

const TOTAL_EVENTS = EVENTS.length;

/** Escape anything that ends up inside markup. */
const esc = s => String(s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;");

/** A team's pinnie bar. */
function swatch(team, height) {
  return '<span class="swatch' + (team.outline ? " swatch--outlined" : "") +
    '" style="background:' + team.color + (height ? ";height:" + height : "") + '"></span>';
}

/** Final / Up next / Scheduled. */
function badge(event) {
  if (event.status === "final") return '<span class="badge badge--final">Final</span>';
  if (event.status === "next") return '<span class="badge badge--next">Up next</span>';
  return '<span class="badge badge--scheduled">Scheduled</span>';
}

/** "Sat 14 Nov 2026" */
const fullDate = ev => esc(ev.dateLabel) + " " + yearOf(ev);

/* ---------- Hero ---------- */

export function renderHero() {
  const ev = NEXT_EVENT;
  const days = daysUntilNextEvent();
  return {
    eyebrow: "Season 1 · Event " + pad2(ev.no) + " of " + pad2(TOTAL_EVENTS),
    title: ev.name,
    meta: [fullDate(ev), esc(ev.time), esc(ev.venue)]
      .map(s => "<span>" + s + "</span>").join(""),
    days: pad2(days),
    daysLabel: (days === 1 ? "day" : "days") + " until the whistle"
  };
}

/* ---------- Standings ---------- */

export function renderStandings() {
  return STANDINGS.map(row => {
    const form = row.form.map(f => {
      const kind = f.place === 1 ? " form__chip--win"
        : f.place <= 3 ? " form__chip--podium" : "";
      const ev = EVENTS.find(e => e.no === f.no);
      return '<span class="form__chip' + kind + '" title="' +
        ORDINAL[f.place] + ' in ' + esc(ev ? ev.name : "event " + pad2(f.no)) + '">' +
        f.place + '</span>';
    }).join("");

    return '<tr' + (row.pos === 1 ? ' class="is-leader"' : '') + '>' +
      '<td class="league__pos">' + row.pos + '</td>' +
      '<td style="width:1%">' + swatch(row.team) + '</td>' +
      '<td class="league__team">' + esc(row.team.name) + '</td>' +
      '<td><span class="form">' + form + '</span></td>' +
      '<td class="is-right cell-muted">' + pad2(row.wins) + '</td>' +
      '<td class="is-right cell-muted">' + (row.best ? ORDINAL[row.best] : "—") + '</td>' +
      '<td class="is-right"><span class="league__pts">' + row.pts + '</span></td>' +
      '</tr>';
  }).join("");
}

export function standingsSummary() {
  return {
    after: "After event " + pad2(EVENTS_COMPLETE) + " of " + pad2(TOTAL_EVENTS),
    scoring: "Placing points 10 · 7 · 5 · 3 · 1 — doubled at event " + pad2(TOTAL_EVENTS),
    remaining: POINTS_REMAINING + " points still on the table",
    leader: LEADER.team.name
  };
}

/* ---------- Schedule ---------- */

export function renderSchedule() {
  return EVENTS.map(ev =>
    '<li' + (ev.status === "next" ? ' class="is-next"' : '') + '>' +
      '<span class="schedule__no">' + pad2(ev.no) + '</span>' +
      '<span class="schedule__date">' + fullDate(ev) + '</span>' +
      '<span class="schedule__main">' +
        '<span class="schedule__name">' + esc(ev.name) + '</span>' +
        '<span class="schedule__where">' + esc(ev.venue) + ' · ' + esc(ev.time) + '</span>' +
      '</span>' +
      badge(ev) +
    '</li>').join("");
}

/* ---------- Event tabs ---------- */

export function renderTabs(selectedNo) {
  return EVENTS.map((ev, i) =>
    '<button class="tab" type="button" role="tab" id="tab-' + ev.no + '"' +
      ' aria-controls="event-panel"' +
      ' aria-selected="' + (ev.no === selectedNo) + '"' +
      ' tabindex="' + (ev.no === selectedNo ? 0 : -1) + '"' +
      ' data-index="' + i + '">' +
      '<span class="tab__no">Event ' + pad2(ev.no) + '</span>' +
      '<span class="tab__name">' + esc(ev.name) + '</span>' +
      (ev.status === "next" ? '<span class="tab__dot" aria-hidden="true"></span>' : '') +
    '</button>').join("");
}

/* ---------- Event panel ---------- */

function resultTable(ev) {
  return '<div class="table-scroll"><table class="result">' +
    '<thead><tr><th>Pos</th><th>Team</th><th>' + esc(ev.measure) + '</th>' +
    '<th>Detail</th><th class="is-right">Pts</th></tr></thead><tbody>' +
    ev.results.map(r => {
      const team = TEAMS[r.team];
      if (!team) return "";
      return '<tr' + (r.place === 1 ? ' class="is-winner"' : '') + '>' +
        '<td class="result__place">' + ORDINAL[r.place] + '</td>' +
        '<td><span class="result__team">' + swatch(team, "22px") +
          '<span class="result__team-name">' + esc(team.name) + '</span></span></td>' +
        '<td class="cell-muted">' + esc(r.measure) + '</td>' +
        '<td class="cell-muted" style="font-size:16px">' + esc(r.detail) + '</td>' +
        '<td class="is-right"><span class="result__pts">' + pointsFor(r.place, ev.no) + '</span></td>' +
        '</tr>';
    }).join("") +
    '</tbody></table></div>';
}

function emptyState(ev) {
  const heading = ev.status === "next"
    ? "Up next · " + esc(ev.dateLabel)
    : fullDate(ev);
  return '<div class="event-empty">' +
    '<span class="label">No result yet</span>' +
    '<span class="event-empty__big">' + heading + '</span>' +
    '<p class="body">Seeding follows the standings. The Committee publishes the draw ' +
    'on the morning of the event.</p></div>';
}

export function renderEventPanel(ev) {
  const stats = '<div class="stat-grid">' + ev.stats.map(s =>
    '<div class="stat-cell"><span class="label">' + esc(s.label) + '</span>' +
    '<b>' + esc(s.value) + '</b>' +
    (s.note ? '<span class="stat-cell__note">' + esc(s.note) + '</span>' : '') +
    '</div>').join("") + '</div>';

  return '<div class="event-head">' +
      courtSvg(ev.court) +
      badge(ev) +
      '<span class="label">Event ' + pad2(ev.no) + ' of ' + pad2(TOTAL_EVENTS) +
        ' · ' + fullDate(ev) + '</span>' +
      '<span class="event-head__title">' + esc(ev.name) + '</span>' +
      '<p class="event-head__format">' + esc(ev.format) + '</p>' +
    '</div>' +
    '<div class="event-cols">' +
      '<div class="event-col">' +
        (ev.results.length ? resultTable(ev) : emptyState(ev)) +
        '<p class="body rule-text">' + esc(ev.rule) + '</p>' +
      '</div>' +
      '<div class="event-col">' + stats +
        '<blockquote class="quote ruling">' + esc(ev.ruling) + '</blockquote>' +
      '</div>' +
    '</div>';
}
