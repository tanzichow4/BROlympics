import { EVENTS, ORDINAL, TEAMS, pad2, pointsFor } from '../data/season';
import type { SeasonEvent } from '../data/season';
import { courtInner } from '../data/courts';
import { fullDate } from '../data/format';
import { Badge, Swatch } from './common';

function ResultTable({ ev }: { ev: SeasonEvent }) {
  return (
    <div className="table-scroll">
      <table className="result">
        <thead>
          <tr>
            <th>Pos</th>
            <th>Team</th>
            <th>{ev.measure}</th>
            <th>Detail</th>
            <th className="is-right">Pts</th>
          </tr>
        </thead>
        <tbody>
          {ev.results.map((r) => {
            const team = TEAMS[r.team];
            if (!team) return null;
            return (
              <tr key={r.team} className={r.place === 1 ? 'is-winner' : undefined}>
                <td className="result__place">{ORDINAL[r.place]}</td>
                <td>
                  <span className="result__team">
                    <Swatch team={team} height="22px" />
                    <span className="result__team-name">{team.name}</span>
                  </span>
                </td>
                <td className="cell-muted">{r.measure}</td>
                <td className="cell-muted" style={{ fontSize: 16 }}>
                  {r.detail}
                </td>
                <td className="is-right">
                  <span className="result__pts">{pointsFor(r.place, ev.no)}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function EmptyState({ ev }: { ev: SeasonEvent }) {
  return (
    <div className="event-empty">
      <span className="label">No result yet</span>
      <span className="event-empty__big">
        {ev.status === 'next' ? `Up next · ${ev.dateLabel}` : fullDate(ev)}
      </span>
      <p className="body">
        Seeding follows the standings. The Committee publishes the draw on the morning of the event.
      </p>
    </div>
  );
}

export default function EventPanel({ ev }: { ev: SeasonEvent }) {
  return (
    <>
      <div className="event-head">
        <svg
          className="chalk-lines"
          viewBox="0 0 1200 300"
          preserveAspectRatio="none"
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: courtInner(ev.court) }}
        />
        <Badge event={ev} />
        <span className="label">
          Event {pad2(ev.no)} of {pad2(EVENTS.length)} · {fullDate(ev)}
        </span>
        <span className="event-head__title">{ev.name}</span>
        <p className="event-head__format">{ev.format}</p>
      </div>
      <div className="event-cols">
        <div className="event-col">
          {ev.results.length ? <ResultTable ev={ev} /> : <EmptyState ev={ev} />}
          <p className="body rule-text">{ev.rule}</p>
        </div>
        <div className="event-col">
          <div className="stat-grid">
            {ev.stats.map((s) => (
              <div className="stat-cell" key={s.label}>
                <span className="label">{s.label}</span>
                <b>{s.value}</b>
                {s.note && <span className="stat-cell__note">{s.note}</span>}
              </div>
            ))}
          </div>
          <blockquote className="quote ruling">{ev.ruling}</blockquote>
        </div>
      </div>
    </>
  );
}
