import {
  EVENTS,
  NEXT_EVENT,
  POINTS_REMAINING,
  STANDINGS,
  TEAM_IDS,
  daysUntilNextEvent,
  pad2,
  pointsFor,
} from './season';

describe('season data', () => {
  it('pads numbers like a league', () => {
    expect(pad2(3)).toBe('03');
    expect(pad2(12)).toBe('12');
  });

  it('doubles points at event 08 only', () => {
    expect(pointsFor(1, 1)).toBe(10);
    expect(pointsFor(1, 8)).toBe(20);
  });

  it('totals standings from final events', () => {
    const pts = Object.fromEntries(STANDINGS.map((r) => [r.id, r.pts]));
    expect(pts).toEqual({ navy: 24, maroon: 22, gold: 16, bone: 9, blackout: 7 });
    expect(STANDINGS.map((r) => r.pos)).toEqual([1, 2, 3, 4, 5]);
  });

  it('gives every final event one result per team, places 1 to 5', () => {
    for (const ev of EVENTS.filter((e) => e.status === 'final')) {
      expect(ev.results.map((r) => r.place).sort()).toEqual([1, 2, 3, 4, 5]);
      expect(ev.results.map((r) => r.team).sort()).toEqual([...TEAM_IDS].sort());
    }
  });

  it('counts points still on the table', () => {
    // events 4-7 at 10 each, plus event 8 doubled
    expect(POINTS_REMAINING).toBe(60);
  });

  it('counts whole days to the next event and never goes negative', () => {
    expect(NEXT_EVENT.no).toBe(4);
    expect(daysUntilNextEvent(new Date(2026, 10, 9, 15, 30))).toBe(5);
    expect(daysUntilNextEvent(new Date(2030, 0, 1))).toBe(0);
  });
});
