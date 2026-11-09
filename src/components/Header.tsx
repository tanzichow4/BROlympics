import type { Theme } from '../hooks/useTheme';

export default function Header({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  return (
    <header className="site-header">
      <div className="wrap">
        <a className="wordmark" href="#top">
          <u>Bro</u>lympics
        </a>
        <nav className="site-nav" aria-label="Sections">
          <a href="#standings">Standings</a>
          <a href="#schedule">Schedule</a>
          <a href="#events">Events</a>
        </nav>
        <button
          className="theme-toggle"
          type="button"
          aria-pressed={theme === 'day'}
          onClick={onToggle}
        >
          {theme === 'day' ? 'Night' : 'Day'}
        </button>
      </div>
    </header>
  );
}
