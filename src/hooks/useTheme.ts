import { useCallback, useEffect, useState } from 'react';

export type Theme = 'night' | 'day';
const KEY = 'brolympics-theme';

function readSaved(): Theme {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'night' || saved === 'day') return saved;
  } catch {
    /* storage unavailable: stay on night */
  }
  return 'night';
}

/** Night is the default. The choice is remembered per browser only. */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(readSaved);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === 'day' ? 'night' : 'day';
      try {
        localStorage.setItem(KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  return { theme, toggle };
}
