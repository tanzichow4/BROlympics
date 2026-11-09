/* Checks a Season before it is saved. Shared by the server (the real check) and
 * the admin panel (fast feedback). Returns a list of problems; empty means valid.
 */
import { COURTS } from './courts';
import { TEAM_IDS } from './season';
import type { Season } from './types';

const STATUSES = ['final', 'next', 'scheduled'];
const isStr = (v: unknown): v is string => typeof v === 'string';
const ISO = /^\d{4}-\d{2}-\d{2}$/;
const TEXT_FIELDS = ['name', 'dateLabel', 'time', 'format', 'rule', 'measure', 'ruling'] as const;

export function validateSeason(input: unknown): string[] {
  const errors: string[] = [];
  const s = input as Season;
  if (!s || typeof s !== 'object') return ['Season data is missing.'];

  if (!s.teams || typeof s.teams !== 'object') errors.push('Teams are missing.');
  else {
    for (const id of TEAM_IDS) {
      const t = s.teams[id];
      if (!t || !isStr(t.name) || !t.name.trim()) errors.push(`Team "${id}" needs a name.`);
      else if (t.name.length > 40) errors.push(`Team "${id}" name is too long.`);
      if (t && (!isStr(t.short) || !t.short.trim() || t.short.length > 6))
        errors.push(`Team "${id}" needs a short code of 1 to 6 characters.`);
    }
  }

  if (!Array.isArray(s.events) || s.events.length === 0) {
    errors.push('There must be at least one event.');
    return errors;
  }

  let nextCount = 0;
  s.events.forEach((ev, i) => {
    const where = `Event ${i + 1}`;
    if (ev.no !== i + 1) errors.push(`${where}: numbers must run 1, 2, 3 in order.`);
    for (const k of TEXT_FIELDS) {
      if (!isStr(ev[k]) || !ev[k].trim()) errors.push(`${where}: "${k}" is required.`);
      else if (ev[k].length > 400) errors.push(`${where}: "${k}" is too long.`);
    }
    // An empty date means "TBD".
    if (!isStr(ev.date) || (ev.date && (!ISO.test(ev.date) || Number.isNaN(Date.parse(ev.date)))))
      errors.push(`${where}: date must be a real date, or left empty for TBD.`);
    if (!STATUSES.includes(ev.status)) errors.push(`${where}: status is not valid.`);
    if (ev.status === 'next') nextCount += 1;
    if (!(ev.court in COURTS)) errors.push(`${where}: court "${ev.court}" is not a known motif.`);

    if (!Array.isArray(ev.stats) || ev.stats.some((st) => !isStr(st.label) || !isStr(st.value)))
      errors.push(`${where}: every stat needs a label and a value.`);

    if (!Array.isArray(ev.results)) errors.push(`${where}: results are missing.`);
    else {
      const teams = ev.results.map((r) => r.team);
      const places = ev.results.map((r) => r.place);
      if (new Set(teams).size !== teams.length) errors.push(`${where}: a team appears twice.`);
      if (new Set(places).size !== places.length) errors.push(`${where}: two teams share a place.`);
      if (ev.results.some((r) => !TEAM_IDS.includes(r.team) || ![1, 2, 3, 4, 5].includes(r.place)))
        errors.push(`${where}: results need a valid team and a place from 1 to 5.`);
      if (ev.status === 'final' && ev.results.length !== TEAM_IDS.length)
        errors.push(`${where}: a final event needs a result for all five teams.`);
    }
  });
  if (nextCount > 1) errors.push('Only one event can be "next".');

  return errors;
}
