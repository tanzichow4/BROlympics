import { useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { EVENTS, NEXT_EVENT, pad2 } from '../data/season';
import EventPanel from './EventPanel';

/** ARIA tabs: arrow keys move, Home/End jump, only the selected tab is tabbable. */
export default function Events() {
  const [index, setIndex] = useState(() =>
    Math.max(
      0,
      EVENTS.findIndex((ev) => ev.no === NEXT_EVENT.no),
    ),
  );
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const event = EVENTS[index];

  function select(next: number, moveFocus: boolean) {
    const i = (next + EVENTS.length) % EVENTS.length;
    setIndex(i);
    if (moveFocus) tabs.current[i]?.focus();
  }

  function onKeyDown(e: KeyboardEvent) {
    const moves: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: EVENTS.length - 1,
    };
    if (!(e.key in moves)) return;
    e.preventDefault();
    select(moves[e.key], true);
  }

  return (
    <section className="section" id="events">
      <div className="wrap">
        <div className="section__head">
          <h2 className="h2">The eight events</h2>
          <span className="label">Pick an event for its stats</span>
        </div>
        <div className="tab-rack">
          <div className="tab-rack__inner" role="tablist" aria-label="Events" onKeyDown={onKeyDown}>
            {EVENTS.map((ev, i) => (
              <button
                key={ev.no}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                className="tab"
                type="button"
                role="tab"
                id={`tab-${ev.no}`}
                aria-controls="event-panel"
                aria-selected={i === index}
                tabIndex={i === index ? 0 : -1}
                onClick={() => select(i, false)}
              >
                <span className="tab__no">Event {pad2(ev.no)}</span>
                <span className="tab__name">{ev.name}</span>
                {ev.status === 'next' && <span className="tab__dot" aria-hidden="true" />}
              </button>
            ))}
          </div>
        </div>
        <div
          className="event-panel"
          id="event-panel"
          role="tabpanel"
          tabIndex={0}
          aria-labelledby={`tab-${event.no}`}
        >
          <EventPanel ev={event} />
        </div>
      </div>
    </section>
  );
}
