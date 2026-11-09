export type TeamId = 'navy' | 'maroon' | 'gold' | 'bone' | 'blackout';
export type EventStatus = 'final' | 'next' | 'scheduled';

export interface Team {
  name: string;
  short: string;
  color: string;
  on: string;
  outline: boolean;
}

export interface EventResult {
  team: TeamId;
  place: number;
  measure: string;
  detail: string;
}

export interface EventStat {
  label: string;
  value: string;
  note?: string;
}

export interface SeasonEvent {
  no: number;
  name: string;
  status: EventStatus;
  date: string;
  dateLabel: string;
  time: string;
  venue: string;
  format: string;
  rule: string;
  measure: string;
  measureNote: string;
  court: string;
  results: EventResult[];
  stats: EventStat[];
  ruling: string;
}

export interface StandingRow {
  id: TeamId;
  team: Team;
  pts: number;
  wins: number;
  best: number | null;
  form: { no: number; place: number }[];
  placings: Record<number, number>;
  pos: number;
}

/** Everything the site displays and the admin panel edits. */
export interface Season {
  teams: Record<TeamId, Team>;
  events: SeasonEvent[];
}
