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
    name: 'Dodgeball',
    status: 'next',
    date: '2026-11-09',
    dateLabel: 'Mon 09 – Tue 10 Nov',
    time: '8:30 PM',
    venue: '',
    format: 'Five a side · best of five rounds',
    rule: 'Headshots do not count. Catches bring a teammate back. Round robin.',
    measure: 'Seed',
    measureNote: 'by standings',
    court: 'dodgeball',
    results: [],
    stats: [
      { label: 'Rounds a match', value: '05' },
      { label: 'Matches scheduled', value: '10' },
      { label: 'Points on offer', value: '10', note: 'to the winner' },
      { label: 'Balls in play', value: '06' },
    ],
    ruling: 'A headshot is a dead ball. The thrower sits the next round.',
  },
  {
    no: 2,
    name: 'Basketball',
    status: 'scheduled',
    date: '',
    dateLabel: 'TBD',
    time: 'TBD',
    venue: '',
    format: 'Half-court · first to 21 · win by 2',
    rule: 'Single round robin, four games a team. Ties broken by point difference, then by a one-shot free throw.',
    measure: 'Record',
    measureNote: 'W–L',
    court: 'basketball',
    results: [],
    stats: [
      { label: 'Games scheduled', value: '10' },
      { label: 'Games a team', value: '04' },
      { label: 'Points on offer', value: '10', note: 'to the winner' },
      { label: 'Game point', value: '21', note: 'win by 2' },
    ],
    ruling: 'The Committee will review the footage. Three steps is three steps.',
  },
  {
    no: 3,
    name: 'Soccer',
    status: 'scheduled',
    date: '',
    dateLabel: 'TBD',
    time: 'TBD',
    venue: '',
    format: 'Seven a side · two 20-minute halves',
    rule: 'Single round robin. Three for a win, one for a draw. Ties broken by goal difference.',
    measure: 'Record',
    measureNote: 'W–D–L',
    court: 'soccer',
    results: [],
    stats: [
      { label: 'Games scheduled', value: '10' },
      { label: 'Halves', value: '02', note: '20 minutes each' },
      { label: 'Points on offer', value: '10', note: 'to the winner' },
      { label: 'Players a side', value: '07' },
    ],
    ruling: 'Ruling: the fence counts as out.',
  },
  {
    no: 4,
    name: 'Volleyball',
    status: 'scheduled',
    date: '',
    dateLabel: 'TBD',
    time: 'TBD',
    venue: '',
    format: 'Best of three to 25 · rally scoring',
    rule: 'Single round robin. Ties broken by sets won, then by points conceded.',
    measure: 'Matches',
    measureNote: 'W–L',
    court: 'volleyball',
    results: [],
    stats: [
      { label: 'Matches scheduled', value: '10' },
      { label: 'Sets a match', value: '03', note: 'best of' },
      { label: 'Points on offer', value: '10', note: 'to the winner' },
      { label: 'Set point', value: '25', note: 'rally scoring' },
    ],
    ruling: 'Ruling: a ceiling touch is a replay. The Committee does not make the ceiling rules.',
  },
  {
    no: 5,
    name: 'Table tennis',
    status: 'scheduled',
    date: '',
    dateLabel: 'TBD',
    time: 'TBD',
    venue: '',
    format: 'Singles ladder · best of five to 11',
    rule: "Every player plays two singles. A team's two best results count. Seeding follows the standings.",
    measure: 'Seed',
    measureNote: 'to be drawn',
    court: 'table-tennis',
    results: [],
    stats: [
      { label: 'Tables', value: '02' },
      { label: 'Matches scheduled', value: '20' },
      { label: 'Points on offer', value: '10', note: 'to the winner' },
      { label: 'Game point', value: '11' },
    ],
    ruling: 'Serves must clear the net without assistance from the wall.',
  },
  {
    no: 6,
    name: 'Badminton',
    status: 'scheduled',
    date: '',
    dateLabel: 'TBD',
    time: 'TBD',
    venue: '',
    format: 'Doubles · best of three to 21',
    rule: 'Two pairs a team, round robin across pairs. Both pair results count.',
    measure: 'Seed',
    measureNote: 'to be drawn',
    court: 'badminton',
    results: [],
    stats: [
      { label: 'Pairs a team', value: '02' },
      { label: 'Matches scheduled', value: '20' },
      { label: 'Points on offer', value: '10', note: 'to the winner' },
      { label: 'Game point', value: '21' },
    ],
    ruling: 'The Committee supplies the shuttles. Bring your own grip tape.',
  },
  {
    no: 7,
    name: 'Track and field',
    status: 'scheduled',
    date: '',
    dateLabel: 'TBD',
    time: 'TBD',
    venue: '',
    format: '100 m · 4×100 m relay · long jump · shot',
    rule: "Four disciplines, each scored on placing. A team's discipline points are added for one event placing.",
    measure: 'Seed',
    measureNote: 'to be drawn',
    court: 'track',
    results: [],
    stats: [
      { label: 'Disciplines', value: '04' },
      { label: 'Entries a team', value: '08' },
      { label: 'Points on offer', value: '10', note: 'to the winner' },
      { label: 'Heats', value: '06' },
    ],
    ruling: 'Two false starts and the lane is vacated. No discussion on the line.',
  },
  {
    no: 8,
    name: 'Flag football',
    status: 'scheduled',
    date: '',
    dateLabel: 'TBD',
    time: 'TBD',
    venue: '',
    format: 'Five a side · two 15-minute halves',
    rule: 'The closing event. Placing points are doubled, so the season is live until the final whistle.',
    measure: 'Seed',
    measureNote: 'to be drawn',
    court: 'football',
    results: [],
    stats: [
      { label: 'Points on offer', value: '20', note: 'doubled' },
      { label: 'Matches scheduled', value: '10' },
      { label: 'Downs a set', value: '04' },
      { label: 'Flags issued', value: '40' },
    ],
    ruling: 'A flag pulled before the catch is no play. The Committee will be watching the replay.',
  },
];

export const DEFAULT_SEASON: Season = { teams: TEAMS, events: EVENTS };
