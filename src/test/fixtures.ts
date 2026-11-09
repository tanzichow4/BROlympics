import { DEFAULT_SEASON } from '../data/defaults';
import type { Season } from '../data/types';

/** The default season with event 01 played: navy wins, blackout last. */
export function seasonWithFinal(): Season {
  const s = structuredClone(DEFAULT_SEASON);
  s.events[0].status = 'final';
  s.events[0].results = [
    { team: 'navy', place: 1, measure: '', detail: '' },
    { team: 'maroon', place: 2, measure: '', detail: '' },
    { team: 'gold', place: 3, measure: '', detail: '' },
    { team: 'bone', place: 4, measure: '', detail: '' },
    { team: 'blackout', place: 5, measure: '', detail: '' },
  ];
  s.events[1].status = 'next';
  return s;
}
