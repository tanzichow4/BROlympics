import { ORDINAL, buildStandings, eventsComplete, pad2, pointsRemaining } from '../data/season';
import { useSeason } from '../data/useSeason';
import { Swatch } from './common';

export default function Standings() {
  const season = useSeason();
  const total = season.events.length;
  const standings = buildStandings(season);

  return (
    <section className="section" id="standings">
      <div className="wrap">
        <div className="section__head">
          <h2 className="h2">Standings</h2>
          <span className="label">
            After event {pad2(eventsComplete(season))} of {pad2(total)}
          </span>
        </div>
        <div className="table-scroll">
          <table className="league">
            <thead>
              <tr>
                <th scope="col">Pos</th>
                <th scope="col">
                  <span className="visually-hidden">Colour</span>
                </th>
                <th scope="col">Team</th>
                <th scope="col">Form</th>
                <th scope="col" className="is-right">
                  Events won
                </th>
                <th scope="col" className="is-right">
                  Best
                </th>
                <th scope="col" className="is-right">
                  Pts
                </th>
              </tr>
            </thead>
            <tbody>
              {standings.map((row) => (
                <tr key={row.id} className={row.pos === 1 ? 'is-leader' : undefined}>
                  <td className="league__pos">{row.pos}</td>
                  <td style={{ width: '1%' }}>
                    <Swatch team={row.team} />
                  </td>
                  <td className="league__team">{row.team.name}</td>
                  <td>
                    <span className="form">
                      {row.form.map((f) => {
                        const ev = season.events.find((e) => e.no === f.no);
                        const kind =
                          f.place === 1
                            ? ' form__chip--win'
                            : f.place <= 3
                              ? ' form__chip--podium'
                              : '';
                        return (
                          <span
                            key={f.no}
                            className={'form__chip' + kind}
                            title={`${ORDINAL[f.place]} in ${ev ? ev.name : 'event ' + pad2(f.no)}`}
                          >
                            {f.place}
                          </span>
                        );
                      })}
                    </span>
                  </td>
                  <td className="is-right cell-muted">{pad2(row.wins)}</td>
                  <td className="is-right cell-muted">{row.best ? ORDINAL[row.best] : '—'}</td>
                  <td className="is-right">
                    <span className="league__pts">{row.pts}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-foot">
          <span className="label">
            Placing points 10 · 7 · 5 · 3 · 1 — doubled at event {pad2(total)}
          </span>
          <span className="label">{pointsRemaining(season)} points still on the table</span>
        </div>
      </div>
    </section>
  );
}
