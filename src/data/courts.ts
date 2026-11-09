/* Chalk-line court motifs.
 *
 * The brand's texture: a few faint court lines drawn behind the hero and the
 * event headers. Keep it to a few lines — one halfway line, one centre circle,
 * a box. Never a busy pattern.
 *
 * Each entry is the inside of an SVG with viewBox "0 0 1200 300", drawn
 * full-bleed so it stretches cleanly. Strokes and fills come from CSS
 * (.chalk-lines *), so don't put colours in here.
 *
 * To add a sport: add a key here matching the event's `court` value in
 * js/season.js.
 */
export const COURTS: Record<string, string> = {
  basketball:
    '<rect x="20" y="20" width="1160" height="260"/>' +
    '<line x1="600" y1="20" x2="600" y2="280"/>' +
    '<circle cx="600" cy="150" r="70"/>',

  soccer:
    '<rect x="20" y="20" width="1160" height="260"/>' +
    '<line x1="600" y1="20" x2="600" y2="280"/>' +
    '<circle cx="600" cy="150" r="60"/>' +
    '<rect x="20" y="85" width="80" height="130"/>' +
    '<rect x="1100" y="85" width="80" height="130"/>',

  volleyball:
    '<rect x="20" y="20" width="1160" height="260"/>' +
    '<line x1="600" y1="10" x2="600" y2="290"/>' +
    '<line x1="400" y1="20" x2="400" y2="280"/>' +
    '<line x1="800" y1="20" x2="800" y2="280"/>',

  'table-tennis':
    '<rect x="20" y="40" width="1160" height="220"/>' +
    '<line x1="600" y1="10" x2="600" y2="290"/>' +
    '<line x1="20" y1="150" x2="1180" y2="150"/>',

  badminton:
    '<rect x="20" y="20" width="1160" height="260"/>' +
    '<line x1="600" y1="10" x2="600" y2="290"/>' +
    '<rect x="120" y="20" width="480" height="260"/>' +
    '<rect x="600" y="20" width="480" height="260"/>',

  dodgeball:
    '<rect x="20" y="20" width="1160" height="260"/>' +
    '<line x1="600" y1="20" x2="600" y2="280"/>' +
    '<line x1="300" y1="20" x2="300" y2="280"/>' +
    '<line x1="900" y1="20" x2="900" y2="280"/>',

  track:
    '<rect x="20" y="30" width="1160" height="240" rx="120"/>' +
    '<rect x="90" y="80" width="1020" height="140" rx="70"/>' +
    '<line x1="600" y1="30" x2="600" y2="80"/>',

  football:
    '<rect x="20" y="20" width="1160" height="260"/>' +
    '<line x1="250" y1="20" x2="250" y2="280"/>' +
    '<line x1="425" y1="20" x2="425" y2="280"/>' +
    '<line x1="600" y1="20" x2="600" y2="280"/>' +
    '<line x1="775" y1="20" x2="775" y2="280"/>' +
    '<line x1="950" y1="20" x2="950" y2="280"/>',
};

/** The inside of the chalk-line SVG for one sport (viewBox 0 0 1200 300). */
export function courtInner(court: string): string {
  return COURTS[court] || '';
}
