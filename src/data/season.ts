/* Scoring rules and everything derived from a Season.
 * All functions are pure: pass in the season, get the numbers out.
 */
import type { Season, SeasonEvent, StandingRow, TeamId } from './types';

export type * from './types';

export const TEAM_IDS: TeamId[] = ['navy', 'maroon', 'gold', 'bone', 'blackout'];

/* Placing points. Five teams, so a win is worth 10 and last still scores.
   Event 08 is worth double, so the season stays live to the final whistle. */
export const PLACE_POINTS: Record<number, number> = { 1: 10, 2: 7, 3: 5, 4: 3, 5: 1 };
export const DOUBLE_POINTS_EVENT = 8;

export const ORDINAL: Record<number, string> = { 1: '1st', 2: '2nd', 3: '3rd', 4: '4th', 5: '5th' };

/** Two-digit league numbering: 3 becomes "03". */
export const pad2 = (n: number) => String(n).padStart(2, '0');

/** Points a placing is worth in a given event. */
export function pointsFor(place: number, eventNo: number) {
  return PLACE_POINTS[place] * (eventNo === DOUBLE_POINTS_EVENT ? 2 : 1);
}

/** The year an event falls in, for labels that cross the new year. */
export const yearOf = (ev: SeasonEvent) => ev.date.slice(0, 4);

/** "Sat 14 Nov 2026" */
export const fullDate = (ev: SeasonEvent) => `${ev.dateLabel} ${yearOf(ev)}`;

/** "2026-10-03" becomes "Sat 03 Oct". */
export function dateLabelFor(iso: string): string {
  const d = new Date(iso + 'T00:00:00Z');
  if (Number.isNaN(d.getTime())) return '';
  const wd = d.toLocaleDateString('en-GB', { weekday: 'short', timeZone: 'UTC' });
  const mon = d.toLocaleDateString('en-GB', { month: 'short', timeZone: 'UTC' });
  return `${wd} ${pad2(d.getUTCDate())} ${mon}`;
}

/** Standings, recalculated from every final event. */
export function buildStandings(season: Season): StandingRow[] {
  const rows: StandingRow[] = TEAM_IDS.map((id) => ({
    id,
    team: season.teams[id],
    pts: 0,
    wins: 0,
    best: null,
    form: [], // [{ no, place }] in event order, for the form chips
    placings: {}, // { eventNo: place }
    pos: 0,
  }));
  const byId = Object.fromEntries(rows.map((r) => [r.id, r])) as Record<TeamId, StandingRow>;

  season.events
    .filter((ev) => ev.status === 'final')
    .forEach((ev) => {
      ev.results.forEach((r) => {
        const row = byId[r.team];
        if (!row) return;
        row.pts += pointsFor(r.place, ev.no);
        row.placings[ev.no] = r.place;
        row.form.push({ no: ev.no, place: r.place });
        if (r.place === 1) row.wins += 1;
        if (row.best === null || r.place < row.best) row.best = r.place;
      });
    });

  // Points, then events won, then alphabetical so the order is never arbitrary.
  rows.sort((a, b) => b.pts - a.pts || b.wins - a.wins || a.team.name.localeCompare(b.team.name));
  rows.forEach((r, i) => {
    r.pos = i + 1;
  });
  return rows;
}

export const eventsComplete = (season: Season) =>
  season.events.filter((ev) => ev.status === 'final').length;

export function nextEvent(season: Season): SeasonEvent {
  const { events } = season;
  return (
    events.find((ev) => ev.status === 'next') ||
    events.find((ev) => ev.status === 'scheduled') ||
    events[events.length - 1]
  );
}

/** Whole days from today to the next event. Never negative. */
export function daysUntilNextEvent(season: Season, now = new Date()) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(nextEvent(season).date + 'T00:00:00');
  return Math.max(0, Math.round((target.getTime() - today.getTime()) / 86400000));
}

/** Points still to be won across every event not yet played. */
export const pointsRemaining = (season: Season) =>
  season.events.filter((ev) => ev.status !== 'final').reduce((n, ev) => n + pointsFor(1, ev.no), 0);
