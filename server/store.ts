import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { DEFAULT_SEASON } from '../src/data/defaults';
import type { Season } from '../src/data/types';
import { validateSeason } from '../src/data/validate';

/** Season data kept in one JSON file. Falls back to the defaults if it is missing or invalid. */
export function createStore(file: string) {
  return {
    async read(): Promise<Season> {
      try {
        const data = JSON.parse(await readFile(file, 'utf-8'));
        if (validateSeason(data).length === 0) return data as Season;
        console.warn(`${file} failed validation; serving defaults.`);
      } catch {
        /* no saved data yet */
      }
      return DEFAULT_SEASON;
    },

    async write(season: Season): Promise<void> {
      await mkdir(dirname(file), { recursive: true });
      const tmp = `${file}.tmp`;
      await writeFile(tmp, JSON.stringify(season, null, 2), 'utf-8');
      await rename(tmp, file); // atomic, so a crash never leaves half a file
    },
  };
}
