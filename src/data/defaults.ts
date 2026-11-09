/* Default Season 1 data. Used as the starting point (and the fallback) when no
 * saved data exists. Edits made in the admin panel are stored by the server and
 * override this. EVERY FIGURE HERE IS A PLACEHOLDER until draft night.
 *
 * House rules: no player names, no swearing, the organisers are "the Committee",
 * no money talk, league-style numbering ("Event 03 of 08").
 */
import type { Season, SeasonEvent, Team, TeamId } from './types';

/* ---------------------------------------------------------------------------
 * Teams
 *
 * Placeholder names and pinnie colours. When the teams pick their own, change
 * `name` here and the colour variable in css/tokens.css (and in the kit).
 * `on` is the text colour that is readable on that pinnie.
 * `outline` marks a colour that needs a hairline or it disappears on its ground.
 * ------------------------------------------------------------------------- */
export const TEAMS: Record<TeamId, Team> = {
  navy: {
    name: 'Team Navy',
    short: 'NAVY',
    color: 'var(--team-navy)',
    on: 'var(--chalk)',
    outline: false,
  },
  maroon: {
    name: 'Team Maroon',
    short: 'MARO',
    color: 'var(--team-maroon)',
    on: 'var(--chalk)',
    outline: false,
  },
  gold: {
    name: 'Team Old Gold',
    short: 'GOLD',
    color: 'var(--team-old-gold)',
    on: 'var(--night)',
    outline: false,
  },
  bone: {
    name: 'Team Bone',
    short: 'BONE',
    color: 'var(--team-bone)',
    on: 'var(--night)',
    outline: true,
  },
  blackout: {
    name: 'Team Blackout',
    short: 'BLKT',
    color: 'var(--team-blackout)',
    on: 'var(--chalk)',
    outline: true,
  },
};

/* ---------------------------------------------------------------------------
 * Events
 *
 * status:   "final" (played, has results) | "next" (up next) | "scheduled"
 * court:    which chalk-line motif to draw behind the event header.
 *           The set lives in js/courts.js — add one there for a new sport.
 * measure:  the column heading for whatever this sport measures (Record,
 *           Matches, Time, Distance).
 * results:  one row per team. `measure` is that team's figure for the column
 *           above; `detail` is the secondary number beside it.
 * stats:    four figures. `note` is optional small print under the number.
 * ruling:   one line in the Committee's voice. Keep it dry.
 * ------------------------------------------------------------------------- */
export const EVENTS: SeasonEvent[] = [
  {
    no: 1,
    name: 'Basketball',
    status: 'final',
    date: '2026-10-03',
    dateLabel: 'Sat 03 Oct',
    time: '7:00 PM',
    venue: 'Court 2',
    format: 'Half-court · first to 21 · win by 2',
    rule: 'Single round robin, four games a team. Ties broken by point difference, then by a one-shot free throw.',
    measure: 'Record',
    measureNote: 'W–L',
    court: 'basketball',
    results: [
      { team: 'navy', place: 1, measure: '4–0', detail: '+38 diff' },
      { team: 'maroon', place: 2, measure: '3–1', detail: '+17 diff' },
      { team: 'gold', place: 3, measure: '2–2', detail: '−2 diff' },
      { team: 'bone', place: 4, measure: '1–3', detail: '−19 diff' },
      { team: 'blackout', place: 5, measure: '0–4', detail: '−34 diff' },
    ],
    stats: [
      { label: 'Games played', value: '10' },
      { label: 'Points scored', value: '384' },
      { label: 'Largest margin', value: '21–6', note: 'Navy over Blackout' },
      { label: 'Longest run', value: '9–0', note: 'Maroon, game 04' },
    ],
    ruling: 'The Committee has reviewed the footage. Three steps is three steps.',
  },
  {
    no: 2,
    name: 'Soccer',
    status: 'final',
    date: '2026-10-17',
    dateLabel: 'Sat 17 Oct',
    time: '2:00 PM',
    venue: 'Pitch 4',
    format: 'Seven a side · two 20-minute halves',
    rule: 'Single round robin. Three for a win, one for a draw. Ties broken by goal difference.',
    measure: 'Record',
    measureNote: 'W–D–L',
    court: 'soccer',
    results: [
      { team: 'maroon', place: 1, measure: '3–1–0', detail: '+9 goals' },
      { team: 'navy', place: 2, measure: '2–1–1', detail: '+4 goals' },
      { team: 'bone', place: 3, measure: '2–0–2', detail: '+1 goals' },
      { team: 'blackout', place: 4, measure: '1–1–2', detail: '−5 goals' },
      { team: 'gold', place: 5, measure: '0–1–3', detail: '−9 goals' },
    ],
    stats: [
      { label: 'Goals', value: '31' },
      { label: 'Clean sheets', value: '03', note: 'Maroon 02, Navy 01' },
      { label: 'Shots on target', value: '88' },
      { label: 'Longest goal', value: '28 m', note: 'Bone, game 07' },
    ],
    ruling:
      'Ruling: the fence counts as out. It counted as out in October and it counts as out now.',
  },
  {
    no: 3,
    name: 'Volleyball',
    status: 'final',
    date: '2026-10-31',
    dateLabel: 'Sat 31 Oct',
    time: '6:30 PM',
    venue: 'Court 1',
    format: 'Best of three to 25 · rally scoring',
    rule: 'Single round robin. Ties broken by sets won, then by points conceded.',
    measure: 'Matches',
    measureNote: 'W–L',
    court: 'volleyball',
    results: [
      { team: 'gold', place: 1, measure: '4–0', detail: '8 sets won' },
      { team: 'navy', place: 2, measure: '3–1', detail: '7 sets won' },
      { team: 'maroon', place: 3, measure: '2–2', detail: '5 sets won' },
      { team: 'blackout', place: 4, measure: '1–3', detail: '3 sets won' },
      { team: 'bone', place: 5, measure: '0–4', detail: '1 set won' },
    ],
    stats: [
      { label: 'Sets played', value: '24' },
      { label: 'Aces', value: '46' },
      { label: 'Blocks', value: '29' },
      { label: 'Longest rally', value: '31', note: 'touches · Navy v Old Gold' },
    ],
    ruling: 'Ruling: a ceiling touch is a replay. The Committee does not make the ceiling rules.',
  },
  {
    no: 4,
    name: 'Table tennis',
    status: 'next',
    date: '2026-11-14',
    dateLabel: 'Sat 14 Nov',
    time: '7:00 PM',
    venue: 'Rec room, two tables',
    format: 'Singles ladder · best of five to 11',
    rule: "Every player plays two singles. A team's two best results count. Seeding follows the standings.",
    measure: 'Seed',
    measureNote: 'by standings',
    court: 'table-tennis',
    results: [],
    stats: [
      { label: 'Tables', value: '02' },
      { label: 'Matches scheduled', value: '20' },
      { label: 'Points on offer', value: '26' },
      { label: 'Doors', value: '6:30', note: 'PM' },
    ],
    ruling: 'Serves must clear the net without assistance from the wall.',
  },
  {
    no: 5,
    name: 'Badminton',
    status: 'scheduled',
    date: '2026-11-28',
    dateLabel: 'Sat 28 Nov',
    time: '5:00 PM',
    venue: 'Court 3',
    format: 'Doubles · best of three to 21',
    rule: 'Two pairs a team, round robin across pairs. Both pair results count.',
    measure: 'Seed',
    measureNote: 'to be drawn',
    court: 'badminton',
    results: [],
    stats: [
      { label: 'Pairs a team', value: '02' },
      { label: 'Matches scheduled', value: '20' },
      { label: 'Points on offer', value: '26' },
      { label: 'Shuttles ordered', value: '24' },
    ],
    ruling: 'The Committee supplies the shuttles. Bring your own grip tape.',
  },
  {
    no: 6,
    name: 'Dodgeball',
    status: 'scheduled',
    date: '2026-12-12',
    dateLabel: 'Sat 12 Dec',
    time: '7:30 PM',
    venue: 'Main gym',
    format: 'Five a side · best of five rounds',
    rule: 'Headshots do not count. Catches bring a teammate back. Round robin.',
    measure: 'Seed',
    measureNote: 'to be drawn',
    court: 'dodgeball',
    results: [],
    stats: [
      { label: 'Rounds a match', value: '05' },
      { label: 'Matches scheduled', value: '10' },
      { label: 'Points on offer', value: '26' },
      { label: 'Balls in play', value: '06' },
    ],
    ruling: 'A headshot is a dead ball. The thrower sits the next round.',
  },
  {
    no: 7,
    name: 'Track and field',
    status: 'scheduled',
    date: '2027-01-09',
    dateLabel: 'Sat 09 Jan',
    time: '11:00 AM',
    venue: 'Indoor track',
    format: '100 m · 4×100 m relay · long jump · shot',
    rule: "Four disciplines, each scored on placing. A team's discipline points are added for one event placing.",
    measure: 'Seed',
    measureNote: 'to be drawn',
    court: 'track',
    results: [],
    stats: [
      { label: 'Disciplines', value: '04' },
      { label: 'Entries a team', value: '08' },
      { label: 'Points on offer', value: '26' },
      { label: 'Heats', value: '06' },
    ],
    ruling: 'Two false starts and the lane is vacated. No discussion on the line.',
  },
  {
    no: 8,
    name: 'Flag football',
    status: 'scheduled',
    date: '2027-01-23',
    dateLabel: 'Sat 23 Jan',
    time: '1:00 PM',
    venue: 'Field 1',
    format: 'Five a side · two 15-minute halves',
    rule: 'The closing event. Placing points are doubled, so the season is live until the final whistle.',
    measure: 'Seed',
    measureNote: 'to be drawn',
    court: 'football',
    results: [],
    stats: [
      { label: 'Points on offer', value: '52', note: 'doubled' },
      { label: 'Matches scheduled', value: '10' },
      { label: 'Downs a set', value: '04' },
      { label: 'Flags issued', value: '40' },
    ],
    ruling: 'A flag pulled before the catch is no play. The Committee will be watching the replay.',
  },
];

export const DEFAULT_SEASON: Season = { teams: TEAMS, events: EVENTS };
