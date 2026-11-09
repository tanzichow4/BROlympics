import Events from './components/Events';
import Footer from './components/Footer';
import Header from './components/Header';
import Hero from './components/Hero';
import Schedule from './components/Schedule';
import Standings from './components/Standings';
import { useTheme } from './hooks/useTheme';

export default function App() {
  const { theme, toggle } = useTheme();

  return (
    <>
      <Header theme={theme} onToggle={toggle} />
      <main id="top">
        <Hero />
        <Standings />
        <Schedule />
        <Events />
      </main>
      <Footer />
    </>
  );
}
