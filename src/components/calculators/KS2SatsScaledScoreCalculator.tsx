import { useMemo } from 'react'
import ShareRow, { useUrlParam } from '@/components/ShareRow'
import {
  KS2_SUBJECTS,
  KS2_YEAR,
  KS2_TABLES_PUBLISHED,
  KS2_NATIONAL_2026,
  KS2_DATES,
  EXPECTED_STANDARD,
  HIGHER_STANDARD,
  MIN_SCALED,
  MAX_SCALED,
  MIN_RAW_FOR_SCALED,
  scaledScore,
  rawFor,
  standardFor,
  type Ks2Subject,
  type Ks2Standard,
} from '@/data/ks2-scaled-scores'

type Mode = 'raw' | 'scaled'
// Writing is teacher assessed, not tested, so it has a code rather than a scaled score
type Writing = 'none' | 'gds' | 'exs' | 'wts' | 'below'

const WRITING_OPTIONS: { v: Writing; l: string }[] = [
  { v: 'none', l: 'Not entered' },
  { v: 'gds', l: 'Working at greater depth (GDS)' },
  { v: 'exs', l: 'Working at the expected standard (EXS)' },
  { v: 'wts', l: 'Working towards the expected standard (WTS)' },
  { v: 'below', l: 'Pre-key stage standard or below' },
]

const parseInRange = (s: string, min: number, max: number): number | null => {
  if (s.trim() === '') return null
  const n = parseInt(s, 10)
  if (!Number.isFinite(n)) return null
  return Math.min(max, Math.max(min, n))
}

interface SubjectResult {
  id: Ks2Subject
  name: string
  short: string
  maxRaw: number
  raw: number | null
  scaled: number | null
  standard: { key: Ks2Standard; label: string }
  toExpected: number | null
  toHigher: number | null
  rawToExpected: number | null
  rawToHigher: number | null
  vsAverage: number | null
  nationalAverage: number
  expectedPct: number
  higherPct: number | null
}

function resolve(id: Ks2Subject, mode: Mode, rawInput: string, scaledInput: string): SubjectResult {
  const s = KS2_SUBJECTS.find((x) => x.id === id)!
  const raw = mode === 'raw' ? parseInRange(rawInput, 0, s.maxRaw) : null
  const scaled = mode === 'raw' ? (raw === null ? null : scaledScore(id, raw)) : parseInRange(scaledInput, MIN_SCALED, MAX_SCALED)
  const entered = mode === 'raw' ? raw !== null : scaled !== null
  const marksFor = (target: number) => {
    if (mode !== 'raw' || raw === null) return null
    const need = rawFor(id, target)
    return need === null ? null : need - raw
  }
  return {
    id,
    name: s.name,
    short: s.short,
    maxRaw: s.maxRaw,
    raw,
    scaled,
    standard: entered ? standardFor(scaled) : { key: 'none', label: 'Enter a score' },
    toExpected: scaled === null ? null : EXPECTED_STANDARD - scaled,
    toHigher: scaled === null ? null : HIGHER_STANDARD - scaled,
    rawToExpected: marksFor(EXPECTED_STANDARD),
    rawToHigher: marksFor(HIGHER_STANDARD),
    vsAverage: scaled === null ? null : scaled - s.nationalAverage,
    nationalAverage: s.nationalAverage,
    expectedPct: s.expectedPct,
    higherPct: s.higherPct,
  }
}

const CHIP: Record<Ks2Standard, string> = {
  higher: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300',
  expected: 'bg-primary/10 text-primary',
  below: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
  none: 'bg-muted text-muted-foreground',
}

export default function KS2SatsScaledScoreCalculator() {
  const [modeParam, setMode] = useUrlParam('mode', 'raw')
  const mode: Mode = modeParam === 'scaled' ? 'scaled' : 'raw'
  const [readingRaw, setReadingRaw] = useUrlParam('r', '32')
  const [mathsRaw, setMathsRaw] = useUrlParam('m', '70')
  const [gpsRaw, setGpsRaw] = useUrlParam('g', '45')
  const [readingScaled, setReadingScaled] = useUrlParam('rs', '104')
  const [mathsScaled, setMathsScaled] = useUrlParam('ms', '103')
  const [gpsScaled, setGpsScaled] = useUrlParam('gs', '105')
  const [writingParam, setWriting] = useUrlParam('w', 'exs')
  const writing: Writing = (WRITING_OPTIONS.some((o) => o.v === writingParam) ? writingParam : 'none') as Writing

  const inputs: Record<Ks2Subject, { raw: string; setRaw: (v: string) => void; scaled: string; setScaled: (v: string) => void }> = {
    reading: { raw: readingRaw, setRaw: setReadingRaw, scaled: readingScaled, setScaled: setReadingScaled },
    maths: { raw: mathsRaw, setRaw: setMathsRaw, scaled: mathsScaled, setScaled: setMathsScaled },
    gps: { raw: gpsRaw, setRaw: setGpsRaw, scaled: gpsScaled, setScaled: setGpsScaled },
  }

  const results = useMemo(
    () => KS2_SUBJECTS.map((s) => resolve(s.id, mode, inputs[s.id].raw, inputs[s.id].scaled)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mode, readingRaw, mathsRaw, gpsRaw, readingScaled, mathsScaled, gpsScaled],
  )

  const reading = results.find((r) => r.id === 'reading')!
  const maths = results.find((r) => r.id === 'maths')!

  // The DfE headline measure: the expected standard in all of reading, writing and maths.
  // Reading and maths are the tests (100 or more); writing is the teacher assessment (EXS or GDS).
  const combined = useMemo(() => {
    if (writing === 'none' || reading.scaled === null || maths.scaled === null) return null
    const writingExpected = writing === 'exs' || writing === 'gds'
    const expected = reading.scaled >= EXPECTED_STANDARD && maths.scaled >= EXPECTED_STANDARD && writingExpected
    const higher = reading.scaled >= HIGHER_STANDARD && maths.scaled >= HIGHER_STANDARD && writing === 'gds'
    const missing = [
      reading.scaled < EXPECTED_STANDARD ? 'reading' : null,
      maths.scaled < EXPECTED_STANDARD ? 'maths' : null,
      writingExpected ? null : 'writing',
    ].filter(Boolean) as string[]
    return { expected, higher, missing }
  }, [writing, reading.scaled, maths.scaled])

  const shareParams: Record<string, string> = mode === 'raw'
    ? { mode, r: readingRaw, m: mathsRaw, g: gpsRaw, w: writing }
    : { mode, rs: readingScaled, ms: mathsScaled, gs: gpsScaled, w: writing }

  const inputClass = 'w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring'
  const tabClass = (active: boolean) => `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/70'}`

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2" role="group" aria-label="What you are entering">
        <button type="button" onClick={() => setMode('raw')} aria-pressed={mode === 'raw'} className={tabClass(mode === 'raw')}>Raw marks ({KS2_YEAR} tables)</button>
        <button type="button" onClick={() => setMode('scaled')} aria-pressed={mode === 'scaled'} className={tabClass(mode === 'scaled')}>Scaled scores from the report</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {KS2_SUBJECTS.map((s) => (
          <div key={s.id}>
            <label htmlFor={`ks2-${s.id}`} className="block text-sm font-medium mb-2">
              {s.name}
              <span className="block text-xs font-normal text-muted-foreground">{mode === 'raw' ? `raw marks out of ${s.maxRaw}` : `scaled score, ${MIN_SCALED} to ${MAX_SCALED}`}</span>
            </label>
            <input
              id={`ks2-${s.id}`}
              type="number"
              inputMode="numeric"
              min={mode === 'raw' ? 0 : MIN_SCALED}
              max={mode === 'raw' ? s.maxRaw : MAX_SCALED}
              step="1"
              value={mode === 'raw' ? inputs[s.id].raw : inputs[s.id].scaled}
              onChange={(e) => (mode === 'raw' ? inputs[s.id].setRaw(e.target.value) : inputs[s.id].setScaled(e.target.value))}
              className={inputClass}
              aria-label={`${s.name} ${mode === 'raw' ? 'raw marks' : 'scaled score'}`}
            />
            {mode === 'raw' && <p className="mt-1 text-xs text-muted-foreground">{s.papers}</p>}
          </div>
        ))}
        <div>
          <label htmlFor="ks2-writing" className="block text-sm font-medium mb-2">
            Writing
            <span className="block text-xs font-normal text-muted-foreground">teacher assessment, no test</span>
          </label>
          <select id="ks2-writing" value={writing} onChange={(e) => setWriting(e.target.value)} className={inputClass} aria-label="Writing teacher assessment">
            {WRITING_OPTIONS.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 animate-fade-in-up">
        {results.map((r) => (
          <div key={r.id} className="rounded-xl border border-border p-4 space-y-2">
            <p className="text-xs text-muted-foreground">{r.name}{mode === 'raw' && r.raw !== null ? `, ${r.raw} of ${r.maxRaw} marks` : ''}</p>
            <p className="text-3xl font-bold text-primary">
              {r.scaled === null ? (mode === 'raw' && r.raw !== null ? 'N' : '–') : r.scaled}
              {r.scaled !== null && <span className="text-sm font-normal text-muted-foreground"> scaled score</span>}
            </p>
            <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${CHIP[r.standard.key]}`}>{r.standard.label}</span>
            {r.scaled !== null && (
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>
                  {r.toExpected! > 0
                    ? `${r.toExpected} scaled point${r.toExpected === 1 ? '' : 's'} below ${EXPECTED_STANDARD}${r.rawToExpected !== null ? ` (${r.rawToExpected} more mark${r.rawToExpected === 1 ? '' : 's'} needed)` : ''}`
                    : `${-r.toExpected!} point${r.toExpected === -1 ? '' : 's'} above the expected standard of ${EXPECTED_STANDARD}`}
                </li>
                <li>
                  {r.toHigher! > 0
                    ? r.rawToHigher !== null
                      ? `${r.toHigher} point${r.toHigher === 1 ? '' : 's'} short of ${HIGHER_STANDARD} (${r.rawToHigher} more mark${r.rawToHigher === 1 ? '' : 's'})`
                      : `${r.toHigher} point${r.toHigher === 1 ? '' : 's'} short of the higher standard (${HIGHER_STANDARD})`
                    : `${HIGHER_STANDARD} or more: the higher standard`}
                </li>
                <li>
                  {r.vsAverage === 0 ? 'Equal to' : `${Math.abs(r.vsAverage!)} ${r.vsAverage! > 0 ? 'above' : 'below'}`} the {KS2_YEAR} national average of {r.nationalAverage}
                </li>
                <li>
                  {r.expectedPct}% of pupils met the expected standard in {KS2_YEAR}{r.higherPct !== null ? `, ${r.higherPct}% the higher standard` : ''}
                </li>
              </ul>
            )}
            {r.scaled === null && mode === 'raw' && r.raw !== null && (
              <p className="text-sm text-muted-foreground">Fewer than {MIN_RAW_FOR_SCALED} marks: no scaled score is awarded and the outcome is NS (expected standard not achieved).</p>
            )}
          </div>
        ))}
      </div>

      {combined ? (
        <div className={`rounded-xl p-4 text-sm ${combined.expected ? 'bg-green-100 dark:bg-green-950' : 'bg-amber-50 dark:bg-amber-950/40'}`}>
          <p className={`font-medium ${combined.expected ? 'text-green-800 dark:text-green-300' : 'text-amber-900 dark:text-amber-200'}`}>
            {combined.higher
              ? `Higher standard in reading, writing and maths combined: ${HIGHER_STANDARD} or more in both tests and greater depth in writing, reached by ${KS2_NATIONAL_2026.rwmHigher}% of pupils in ${KS2_YEAR}`
              : combined.expected
                ? `Expected standard in reading, writing and maths combined, the headline measure reached by ${KS2_NATIONAL_2026.rwmExpected}% of pupils in ${KS2_YEAR}`
                : `Below the combined expected standard in ${combined.missing.join(' and ')}`}
          </p>
          <p className="mt-1 text-muted-foreground">
            The combined measure needs {EXPECTED_STANDARD} or more in reading and in maths plus EXS or GDS in writing. GPS does not count towards it. In {KS2_YEAR}, {KS2_NATIONAL_2026.rwmExpected}% of pupils met it (up from {KS2_NATIONAL_2026.rwmExpectedPrior}% in 2025) and {KS2_NATIONAL_2026.rwmHigher}% reached the higher standard.
          </p>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Add the writing teacher assessment to see whether the pupil meets the combined reading, writing and maths standard that schools and the DfE report.</p>
      )}

      <ShareRow params={shareParams} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl border border-border p-4">
          <p className="font-medium text-foreground mb-2">KS2 tests {KS2_YEAR}</p>
          <ul className="space-y-1 text-muted-foreground">
            {KS2_DATES.tests2026.map((d) => <li key={d.date}><span className="text-foreground">{d.date}</span>: {d.activity}</li>)}
            <li><span className="text-foreground">{KS2_DATES.results2026}</span>: results to schools (planned for {KS2_DATES.results2026Planned}, delayed by the marking contractor)</li>
          </ul>
        </div>
        <div className="rounded-xl border border-border p-4">
          <p className="font-medium text-foreground mb-2">KS2 tests 2027</p>
          <ul className="space-y-1 text-muted-foreground">
            {KS2_DATES.tests2027.map((d) => <li key={d.date}><span className="text-foreground">{d.date}</span>: {d.activity}</li>)}
            <li><span className="text-foreground">{KS2_DATES.results2027}</span>: results to schools</li>
          </ul>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Conversions use the Standards and Testing Agency tables for the {KS2_YEAR} tests, published {KS2_TABLES_PUBLISHED}. Each year has its own table, so {KS2_YEAR} raw marks cannot be read across to 2027 papers; the scaled scores themselves are comparable between years. Writing and science are teacher assessed and have no scaled score.
      </p>
    </div>
  )
}
