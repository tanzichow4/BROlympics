import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { DEFAULT_SEASON } from './defaults';
import { SeasonContext } from './useSeason';
import type { Season } from './types';

/** Loads the saved season from the server. Falls back to the defaults if it can't. */
export default function SeasonProvider({
  children,
  initial,
}: {
  children: ReactNode;
  initial?: Season;
}) {
  const [season, setSeason] = useState<Season>(initial ?? DEFAULT_SEASON);

  useEffect(() => {
    if (initial) return;
    const controller = new AbortController();
    fetch('/api/season', { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then((data: Season) => setSeason(data))
      .catch(() => {
        /* no server (or tests): keep the defaults */
      });
    return () => controller.abort();
  }, [initial]);

  return <SeasonContext.Provider value={season}>{children}</SeasonContext.Provider>;
}
