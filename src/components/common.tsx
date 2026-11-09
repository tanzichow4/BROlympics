import type { SeasonEvent, Team } from '../data/season';

/** A team's pinnie bar. */
export function Swatch({ team, height }: { team: Team; height?: string }) {
  return (
    <span
      className={'swatch' + (team.outline ? ' swatch--outlined' : '')}
      style={{ background: team.color, ...(height ? { height } : {}) }}
    />
  );
}

/** Final / Up next / Scheduled. */
export function Badge({ event }: { event: SeasonEvent }) {
  if (event.status === 'final') return <span className="badge badge--final">Final</span>;
  if (event.status === 'next') return <span className="badge badge--next">Up next</span>;
  return <span className="badge badge--scheduled">Scheduled</span>;
}
