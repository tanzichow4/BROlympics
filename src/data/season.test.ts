import { DEFAULT_SEASON } from './defaults';
import {
  TEAM_IDS,
  buildStandings,
  dateLabelFor,
  daysUntilNextEvent,
  nextEvent,
  pad2,
  pointsFor,
  pointsRemaining,
} from './season';
import { seasonWithFinal } from '../test/fixtures';
import { validateSeason } from './validate';

const season = DEFAULT_SEASON;

describe('season data', () => {
  it('pads numbers like a league', () => {
    expect(pad2(3)).toBe('03');
    expect(pad2(12)).toBe('12');
  });

  it('doubles points at event 08 only', () => {
    expect(pointsFor(1, 1)).toBe(10);
    expect(pointsFor(1, 8)).toBe(20);
  });

  it('starts with everyone on zero, ordered alphabetically', () => {
    const standings = buildStandings(season);
    expect(standings.every((r) => r.pts === 0)).toBe(true);
    expect(standings.map((r) => r.id)).toEqual(['blackout', 'bone', 'maroon', 'navy', 'gold']);
  });

  it('totals standings from final events', () => {
    const s = structuredClone(season);
    s.events[0].status = 'final';
    s.events[0].results = [
      { team: 'navy', place: 1, measure: '', detail: '' },
      { team: 'maroon', place: 2, measure: '', detail: '' },
      { team: 'gold', place: 3, measure: '', detail: '' },
      { team: 'bone', place: 4, measure: '', detail: '' },
      { team: 'blackout', place: 5, measure: '', detail: '' },
    ];
    const standings = buildStandings(s);
    expect(standings.map((r) => [r.id, r.pts])).toEqual([
      ['navy', 10],
      ['maroon', 7],
      ['gold', 5],
      ['bone', 3],
      ['blackout', 1],
    ]);
    expect(standings[0].wins).toBe(1);
  });

  it('gives every final event one result per team, places 1 to 5', () => {
    for (const ev of season.events.filter((e) => e.status === 'final')) {
      expect(ev.results.map((r) => r.place).sort()).toEqual([1, 2, 3, 4, 5]);
      expect(ev.results.map((r) => r.team).sort()).toEqual([...TEAM_IDS].sort());
    }
  });

  it('counts points still on the table', () => {
    // events 1-7 at 10 each, plus event 8 doubled
    expect(pointsRemaining(season)).toBe(90);
  });

  it('counts whole days to the next event and never goes negative', () => {
    expect(nextEvent(season).no).toBe(1);
    expect(daysUntilNextEvent(season, new Date(2026, 10, 9, 15, 30))).toBe(0);
    expect(daysUntilNextEvent(season, new Date(2026, 10, 5))).toBe(4);
    expect(daysUntilNextEvent(season, new Date(2030, 0, 1))).toBe(0);
    const tbd = structuredClone(season);
    tbd.events[0].date = '';
    expect(daysUntilNextEvent(tbd)).toBe(0);
  });

  it('builds a date label from an ISO date', () => {
    expect(dateLabelFor('2026-10-03')).toBe('Sat 03 Oct');
    expect(dateLabelFor('nonsense')).toBe('');
  });
});

describe('validateSeason', () => {
  it('accepts the defaults', () => {
    expect(validateSeason(season)).toEqual([]);
  });

  it('rejects garbage', () => {
    expect(validateSeason(null)).not.toEqual([]);
    expect(validateSeason({})).not.toEqual([]);
  });

  it('allows an empty date (TBD) but not a bad one', () => {
    const s = seasonWithFinal();
    s.events[2].date = '';
    expect(validateSeason(s)).toEqual([]);
    s.events[2].date = '31/12/2026';
    expect(validateSeason(s).join(' ')).toMatch(/real date/);
  });

  it('rejects a final event with missing results', () => {
    const s = seasonWithFinal();
    s.events[0].results.pop();
    expect(validateSeason(s).join(' ')).toMatch(/all five teams/);
  });

  it('rejects two teams sharing a place', () => {
    const s = seasonWithFinal();
    s.events[0].results[1].place = 1;
    expect(validateSeason(s).join(' ')).toMatch(/share a place/);
  });

  it('rejects two "next" events and unknown courts', () => {
    const s = seasonWithFinal();
    s.events[4].status = 'next';
    s.events[5].court = 'curling';
    const msg = validateSeason(s).join(' ');
    expect(msg).toMatch(/Only one event/);
    expect(msg).toMatch(/not a known motif/);
  });
});
