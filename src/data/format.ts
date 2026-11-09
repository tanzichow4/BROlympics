import type { SeasonEvent } from './season';
import { yearOf } from './season';

/** "Sat 14 Nov 2026" */
export const fullDate = (ev: SeasonEvent) => `${ev.dateLabel} ${yearOf(ev)}`;
