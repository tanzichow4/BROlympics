import { lazy, Suspense } from 'react';
import Events from './components/Events';
import Footer from './components/Footer';
import Header from './components/Header';
import Hero from './components/Hero';
import Schedule from './components/Schedule';
import Standings from './components/Standings';
import { nextEvent } from './data/season';
import SeasonProvider from './data/SeasonProvider';
import { useSeason } from './data/useSeason';
import { useTheme } from './hooks/useTheme';

const Admin = lazy(() => import('./admin/Admin'));

function Site() {
  const { theme, toggle } = useTheme();
  const season = useSeason();

  return (
    <>
      <Header theme={theme} onToggle={toggle} />
      <main id="top">
        <Hero />
        <Standings />
        <Schedule />
        {/* Re-key when the saved data arrives so the tabs open on the right event. */}
        <Events key={nextEvent(season).no} />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  const isAdmin = /^\/admin(\/|$)/.test(window.location.pathname);

  if (isAdmin) {
    return (
      <Suspense fallback={null}>
        <Admin />
      </Suspense>
    );
  }
  return (
    <SeasonProvider>
      <Site />
    </SeasonProvider>
  );
}
