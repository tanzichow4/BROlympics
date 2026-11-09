import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { COURTS } from '../data/courts';
import { TEAM_IDS, dateLabelFor, pad2 } from '../data/season';
import type { EventResult, EventStatus, Season, SeasonEvent, TeamId } from '../data/types';
import { validateSeason } from '../data/validate';
import { ApiError, saveSeason } from './api';

type Section = 'teams' | number; // number = index into events

function Field({ label, children, wide }: { label: string; children: ReactNode; wide?: boolean }) {
  return (
    <label className={'field' + (wide ? ' field--wide' : '')}>
      <span className="label">{label}</span>
      {children}
    </label>
  );
}

export default function Editor({
  initial,
  onLogout,
  onSignedOut,
}: {
  initial: Season;
  onLogout: () => void;
  onSignedOut: () => void;
}) {
  const [saved, setSaved] = useState<Season>(initial);
  const [draft, setDraft] = useState<Season>(initial);
  const [section, setSection] = useState<Section>('teams');
  const [errors, setErrors] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(saved), [draft, saved]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  function change(next: Season) {
    setDraft(next);
    setStatus('idle');
  }

  function patchEvent(i: number, patch: Partial<SeasonEvent>) {
    change({
      ...draft,
      events: draft.events.map((ev, idx) => {
        if (idx === i) return { ...ev, ...patch };
        // Only one event can be "next": promoting one demotes the other.
        if (patch.status === 'next' && ev.status === 'next') return { ...ev, status: 'scheduled' };
        return ev;
      }),
    });
  }

  function patchTeam(id: TeamId, patch: Partial<Season['teams'][TeamId]>) {
    change({ ...draft, teams: { ...draft.teams, [id]: { ...draft.teams[id], ...patch } } });
  }

  async function save() {
    const problems = validateSeason(draft);
    setErrors(problems);
    if (problems.length) return;
    setStatus('saving');
    try {
      const result = await saveSeason(draft);
      setSaved(result);
      setDraft(result);
      setStatus('saved');
    } catch (err) {
      setStatus('idle');
      if (err instanceof ApiError && err.status === 401) return onSignedOut();
      setErrors(
        err instanceof ApiError ? [...err.errors, err.message].filter(Boolean) : ['Save failed.'],
      );
    }
  }

  const ev = typeof section === 'number' ? draft.events[section] : null;

  return (
    <div className="admin">
      <header className="admin-bar">
        <a className="wordmark" href="/">
          <u>Bro</u>lympics
        </a>
        <span className="label">Admin</span>
        <span className="admin-bar__spacer" />
        <span className="label" role="status">
          {status === 'saved' ? 'Saved' : dirty ? 'Unsaved changes' : ''}
        </span>
        <button
          className="btn btn--primary"
          onClick={save}
          disabled={!dirty || status === 'saving'}
        >
          {status === 'saving' ? 'Saving…' : 'Save changes'}
        </button>
        <button className="btn btn--ghost" onClick={onLogout}>
          Sign out
        </button>
      </header>

      {errors.length > 0 && (
        <div role="alert" className="admin-error admin-errors">
          <strong>Fix these before saving:</strong>
          <ul>
            {errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="admin-body">
        <nav className="admin-nav" aria-label="Sections">
          <button
            aria-current={section === 'teams'}
            onClick={() => setSection('teams')}
            type="button"
          >
            Teams
          </button>
          {draft.events.map((e, i) => (
            <button
              key={e.no}
              aria-current={section === i}
              onClick={() => setSection(i)}
              type="button"
            >
              <span className="label">Event {pad2(e.no)}</span> {e.name}
            </button>
          ))}
        </nav>

        <section className="admin-form" aria-label={ev ? ev.name : 'Teams'}>
          {section === 'teams' && (
            <>
              <h1 className="h2">Teams</h1>
              <p className="admin-hint">
                Names and short codes only. Pinnie colours live in the design kit so the Reels
                match.
              </p>
              {TEAM_IDS.map((id) => (
                <div className="admin-row" key={id}>
                  <Field label={`${id} · name`}>
                    <input
                      value={draft.teams[id].name}
                      onChange={(e) => patchTeam(id, { name: e.target.value })}
                    />
                  </Field>
                  <Field label="Short code">
                    <input
                      value={draft.teams[id].short}
                      maxLength={6}
                      onChange={(e) => patchTeam(id, { short: e.target.value.toUpperCase() })}
                    />
                  </Field>
                </div>
              ))}
            </>
          )}

          {ev && typeof section === 'number' && (
            <EventForm
              ev={ev}
              onChange={(patch) => patchEvent(section, patch)}
              teams={draft.teams}
            />
          )}
        </section>
      </div>
    </div>
  );
}

function EventForm({
  ev,
  onChange,
  teams,
}: {
  ev: SeasonEvent;
  onChange: (patch: Partial<SeasonEvent>) => void;
  teams: Season['teams'];
}) {
  const text = (key: keyof SeasonEvent, label: string, wide?: boolean) => (
    <Field label={label} wide={wide}>
      <input
        value={String(ev[key])}
        onChange={(e) => onChange({ [key]: e.target.value } as Partial<SeasonEvent>)}
      />
    </Field>
  );

  const rowFor = (team: TeamId) => ev.results.find((r) => r.team === team);

  function setResult(
    team: TeamId,
    patch: Partial<Omit<EventResult, 'place'>> & { place?: number | null },
  ) {
    const current = rowFor(team);
    const others = ev.results.filter((r) => r.team !== team);
    if (patch.place === null) return onChange({ results: others });
    const next: EventResult = {
      team,
      place: 1,
      measure: '',
      detail: '',
      ...current,
      ...patch,
    } as EventResult;
    onChange({ results: [...others, next].sort((a, b) => a.place - b.place) });
  }

  return (
    <>
      <h1 className="h2">
        Event {pad2(ev.no)} · {ev.name}
      </h1>

      <div className="admin-grid">
        {text('name', 'Name')}
        <Field label="Status">
          <select
            value={ev.status}
            onChange={(e) => onChange({ status: e.target.value as EventStatus })}
          >
            <option value="final">Final (played)</option>
            <option value="next">Up next</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </Field>
        <Field label="Date">
          <input
            type="date"
            value={ev.date}
            onChange={(e) =>
              onChange({ date: e.target.value, dateLabel: dateLabelFor(e.target.value) || 'TBD' })
            }
          />
        </Field>
        {text('time', 'Time')}
        {text('venue', 'Venue')}
        <Field label="Court motif">
          <select value={ev.court} onChange={(e) => onChange({ court: e.target.value })}>
            {Object.keys(COURTS).map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
        {text('format', 'Format', true)}
        <Field label="Rule" wide>
          <textarea rows={3} value={ev.rule} onChange={(e) => onChange({ rule: e.target.value })} />
        </Field>
        {text('measure', 'Result column heading')}
        {text('measureNote', 'Column note')}
      </div>

      <h2 className="h3">Results</h2>
      <p className="admin-hint">
        Pick a place to include a team. A final event needs all five teams, places 1 to 5.
      </p>
      {TEAM_IDS.map((id) => {
        const row = rowFor(id);
        return (
          <div className="admin-row admin-row--result" key={id}>
            <span className="admin-row__team">{teams[id].name}</span>
            <Field label="Place">
              <select
                value={row?.place ?? ''}
                onChange={(e) =>
                  setResult(id, { place: e.target.value ? Number(e.target.value) : null })
                }
              >
                <option value="">—</option>
                {[1, 2, 3, 4, 5].map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={ev.measure || 'Result'}>
              <input
                disabled={!row}
                value={row?.measure ?? ''}
                onChange={(e) => setResult(id, { measure: e.target.value })}
              />
            </Field>
            <Field label="Detail">
              <input
                disabled={!row}
                value={row?.detail ?? ''}
                onChange={(e) => setResult(id, { detail: e.target.value })}
              />
            </Field>
          </div>
        );
      })}

      <h2 className="h3">Stats</h2>
      {ev.stats.map((s, i) => (
        <div className="admin-row admin-row--stat" key={i}>
          {(['label', 'value', 'note'] as const).map((k) => (
            <Field key={k} label={k === 'note' ? 'Note (optional)' : k}>
              <input
                value={s[k] ?? ''}
                onChange={(e) =>
                  onChange({
                    stats: ev.stats.map((x, j) => (j === i ? { ...x, [k]: e.target.value } : x)),
                  })
                }
              />
            </Field>
          ))}
          <button
            type="button"
            className="btn btn--ghost admin-remove"
            onClick={() => onChange({ stats: ev.stats.filter((_, j) => j !== i) })}
            aria-label={`Remove stat ${i + 1}`}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        className="btn btn--ghost"
        onClick={() => onChange({ stats: [...ev.stats, { label: '', value: '' }] })}
      >
        Add stat
      </button>

      <h2 className="h3">Ruling</h2>
      <Field label="One line in the Committee's voice" wide>
        <textarea
          rows={2}
          value={ev.ruling}
          onChange={(e) => onChange({ ruling: e.target.value })}
        />
      </Field>
    </>
  );
}
