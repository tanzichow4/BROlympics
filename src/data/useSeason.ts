import { createContext, useContext } from 'react';
import { DEFAULT_SEASON } from './defaults';
import type { Season } from './types';

export const SeasonContext = createContext<Season>(DEFAULT_SEASON);

/** The season currently being shown (saved data from the server, or the defaults). */
export const useSeason = () => useContext(SeasonContext);
