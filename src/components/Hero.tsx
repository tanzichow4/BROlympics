import { daysUntilNextEvent, fullDate, nextEvent, pad2 } from '../data/season';
import { useSeason } from '../data/useSeason';

export default function Hero() {
  const season = useSeason();
  const ev = nextEvent(season);
  const days = daysUntilNextEvent(season);

  return (
    <section className="hero">
      <svg
        className="chalk-lines"
        viewBox="0 0 1200 520"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <line x1="880" y1="0" x2="880" y2="520" />
        <circle cx="880" cy="285" r="140" />
        <rect x="1080" y="140" width="180" height="290" />
        <line x1="0" y1="470" x2="1200" y2="470" />
      </svg>
      <div className="wrap">
        <span className="label">
          Season 1 · Event {pad2(ev.no)} of {pad2(season.events.length)}
        </span>
        <h1 className="hero__title">
          <span className="hero__title-accent">the next event is</span>
          <span className="hero__title-main">{ev.name}</span>
        </h1>
        <div className="hero__meta">
          {[fullDate(ev), ev.time, ev.venue].map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
        <p className="lede hero__tagline">Twenty bros. Five teams. Zero flakes.</p>
        <div className="hero__cta">
          <a className="btn btn--primary" href="#standings">
            See the standings
          </a>
          <a className="btn btn--ghost" href="#events">
            All eight events
          </a>
        </div>
        <p className="hero__countdown">
          <b>{pad2(days)}</b>
          <span className="label">{days === 1 ? 'day' : 'days'} until the whistle</span>
        </p>
      </div>
    </section>
  );
}
