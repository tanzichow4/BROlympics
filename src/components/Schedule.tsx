import { fullDate, pad2 } from '../data/season';
import { useSeason } from '../data/useSeason';
import { Badge } from './common';

export default function Schedule() {
  const { events } = useSeason();
  return (
    <section className="section" id="schedule">
      <div className="wrap">
        <div className="section__head">
          <h2 className="h2">Schedule</h2>
          <span className="label">Season 1 · eight events</span>
        </div>
        <ol className="schedule">
          {events.map((ev) => (
            <li key={ev.no} className={ev.status === 'next' ? 'is-next' : undefined}>
              <span className="schedule__no">{pad2(ev.no)}</span>
              <span className="schedule__date">{fullDate(ev)}</span>
              <span className="schedule__main">
                <span className="schedule__name">{ev.name}</span>
                <span className="schedule__where">
                  {ev.venue} · {ev.time}
                </span>
              </span>
              <Badge event={ev} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
