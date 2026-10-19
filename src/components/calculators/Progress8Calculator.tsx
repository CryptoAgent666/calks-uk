import { useState, useMemo } from 'react'
import ShareRow, { useUrlParam } from '@/components/ShareRow'
import {
  GRADES, COMBINED_GRADES, NATIONAL_A8, SUBJECTS, DEFAULT_ROWS, attainment8, type Row, type SubjectType,
} from '@/data/attainment8'
import {
  P8_ESTIMATES_RESULTS_YEAR, P8_GUIDANCE_URL, KS2_SCALED_MIN, KS2_SCALED_MAX, KS2_NOMINAL_MIN,
  ks2Average, priorAttainmentGroup, priorAttainmentBand, pupilProgress8, progress8Band,
} from '@/data/progress8-estimates'

// Attainment 8 slot rules come from src/data/attainment8.ts (shared with the GCSE calculator);
// the KS2 prior attainment groups and their Attainment 8 averages from src/data/progress8-estimates.ts.

// Summer in which the pupil sat GCSEs. The 2025 and 2026 cohorts had no KS2 tests (cancelled
// in 2020 and 2021), so the DfE calculates no Progress 8 for them; it returns for 2027.
const YEARS = [
  { v: '2025', school: '2024/25', ks2: 2020 },
  { v: '2026', school: '2025/26', ks2: 2021 },
  { v: '2027', school: '2026/27', ks2: 2022 },
]

const num = (s: string) => {
  const n = parseFloat(s.replace(',', '.'))
  return Number.isFinite(n) ? n : NaN
}
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n))
const signed = (n: number, d = 2) => (n > 0 ? '+' : '') + (Math.abs(n) < 0.005 ? (0).toFixed(d) : n.toFixed(d))
const fmt1 = (n: number) => (n % 1 ? n.toFixed(1) : String(n))

const toggleCls = (on: boolean) => `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${on ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-accent'}`
const inputCls = 'w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring'

export default function Progress8Calculator() {
  const [year, setYear] = useUrlParam('year', '2027')
  const [a8Mode, setA8Mode] = useState<'score' | 'grades'>('score')
  const [a8Input, setA8Input] = useUrlParam('a8', '56')
  const [rows, setRows] = useState<Row[]>(DEFAULT_ROWS)
  const [ks2Mode, setKs2Mode] = useState<'scores' | 'estimate'>('scores')
  const [reading, setReading] = useUrlParam('reading', '108')
  const [maths, setMaths] = useUrlParam('maths', '106')
  const [estimateInput, setEstimateInput] = useUrlParam('est', '')

  const addRow = () => setRows([...rows, { type: 'other', grade: '5' }])
  const removeRow = (i: number) => setRows(rows.filter((_, idx) => idx !== i))
  const updateRow = (i: number, patch: Partial<Row>) => setRows(rows.map((r, idx) => {
    if (idx !== i) return r
    const next = { ...r, ...patch }
    if (patch.type && (patch.type === 'combined') !== (r.type === 'combined')) next.grade = patch.type === 'combined' ? '5-5' : '5'
    return next
  }))

  const yearInfo = YEARS.find((y) => y.v === year) ?? YEARS[2]
  const noOfficial = yearInfo.v !== '2027'

  const built = useMemo(() => attainment8(rows), [rows])
  const a8Typed = num(a8Input)
  const a8 = a8Mode === 'grades' ? built.total : (Number.isFinite(a8Typed) ? clamp(a8Typed, 0, 90) : NaN)

  const readingN = num(reading)
  const mathsN = num(maths)
  const ks2Valid = Number.isFinite(readingN) && Number.isFinite(mathsN)
  const average = ks2Valid ? ks2Average(clamp(readingN, KS2_NOMINAL_MIN, KS2_SCALED_MAX), clamp(mathsN, KS2_NOMINAL_MIN, KS2_SCALED_MAX)) : NaN
  const group = ks2Valid ? priorAttainmentGroup(average) : undefined
  const estTyped = num(estimateInput)
  const estimate = ks2Mode === 'scores' ? group?.a8 : (Number.isFinite(estTyped) ? clamp(estTyped, 0, 90) : undefined)

  const ready = Number.isFinite(a8) && estimate !== undefined
  const p8 = ready ? Math.round(pupilProgress8(a8, estimate) * 100) / 100 : 0
  const band = progress8Band(p8)
  const capped = ks2Mode === 'scores' && group?.minP8 != null && p8 < group.minP8
  const gradesPerSlot = Math.abs(p8)

  const shareParams: Record<string, string> = { year, reading, maths }
  if (a8Mode === 'score') shareParams.a8 = a8Input
  if (ks2Mode === 'estimate') shareParams.est = estimateInput

  return (
    <div className="space-y-6">
      <div>
        <p className="block text-sm font-medium mb-2">When did the pupil sit their GCSEs?</p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="GCSE results year">
          {YEARS.map((y) => (
            <button key={y.v} type="button" onClick={() => setYear(y.v)} aria-pressed={year === y.v} className={toggleCls(year === y.v)}>Summer {y.v} ({y.school})</button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-1">This cohort took, or would have taken, key stage 2 tests in {yearInfo.ks2}.</p>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-medium">Attainment 8 score</p>
          <div className="flex gap-2" role="group" aria-label="How to enter Attainment 8">
            <button type="button" onClick={() => setA8Mode('score')} aria-pressed={a8Mode === 'score'} className={toggleCls(a8Mode === 'score')}>Enter the score</button>
            <button type="button" onClick={() => setA8Mode('grades')} aria-pressed={a8Mode === 'grades'} className={toggleCls(a8Mode === 'grades')}>Build it from grades</button>
          </div>
        </div>
        {a8Mode === 'score' ? (
          <div>
            <input type="number" inputMode="decimal" min={0} max={90} step={0.5} value={a8Input} onChange={(e) => setA8Input(e.target.value)} placeholder="56" aria-label="Attainment 8 score, 0 to 90" className={inputCls} />
            <p className="text-xs text-muted-foreground mt-1">0 to 90. English and maths count twice; the national average for state-funded schools was {NATIONAL_A8} in 2026 (provisional).</p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {rows.map((r, i) => (
                <div key={i} className="flex items-center gap-2">
                  <select value={r.type} onChange={(e) => updateRow(i, { type: e.target.value as SubjectType })} aria-label={`Subject ${i + 1}`} className="flex-1 min-w-0 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    {SUBJECTS.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
                  </select>
                  <select value={r.grade} onChange={(e) => updateRow(i, { grade: e.target.value })} aria-label={`Grade for subject ${i + 1}`} className="w-24 rounded-lg border border-input bg-background px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-ring">
                    {(r.type === 'combined' ? COMBINED_GRADES : GRADES).map((gr) => <option key={gr} value={gr}>{gr}</option>)}
                  </select>
                  <button onClick={() => removeRow(i)} aria-label={`Remove subject ${i + 1}`} className="px-2 py-2 rounded-lg bg-muted hover:bg-destructive/10 text-sm">x</button>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-muted-foreground">Attainment 8 from these grades: <strong className="text-foreground">{fmt1(built.total)}</strong> (English {built.englishPoints}, maths {built.mathsPoints}, EBacc {fmt1(built.ebaccPoints)}, open {fmt1(built.openPoints)})</p>
              <button onClick={addRow} className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">+ Add Subject</button>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-medium">Key stage 2 starting point</p>
          <div className="flex gap-2" role="group" aria-label="How to enter prior attainment">
            <button type="button" onClick={() => setKs2Mode('scores')} aria-pressed={ks2Mode === 'scores'} className={toggleCls(ks2Mode === 'scores')}>KS2 scaled scores</button>
            <button type="button" onClick={() => setKs2Mode('estimate')} aria-pressed={ks2Mode === 'estimate'} className={toggleCls(ks2Mode === 'estimate')}>Attainment 8 estimate</button>
          </div>
        </div>
        {ks2Mode === 'scores' ? (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-muted-foreground mb-1" htmlFor="p8-reading">KS2 reading scaled score</label>
                <input id="p8-reading" type="number" inputMode="numeric" min={KS2_SCALED_MIN} max={KS2_SCALED_MAX} value={reading} onChange={(e) => setReading(e.target.value)} placeholder="108" className={inputCls} />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1" htmlFor="p8-maths">KS2 maths scaled score</label>
                <input id="p8-maths" type="number" inputMode="numeric" min={KS2_SCALED_MIN} max={KS2_SCALED_MAX} value={maths} onChange={(e) => setMaths(e.target.value)} placeholder="106" className={inputCls} />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Scaled scores run from {KS2_SCALED_MIN} to {KS2_SCALED_MAX} (100 is the expected standard). The DfE averages the two to one decimal place and places the result in one of 34 prior attainment groups.</p>
            {ks2Valid && group && (
              <p className="text-sm">Average scaled score <strong>{average.toFixed(1)}</strong>: prior attainment group {group.group} ({group.low} to {group.high}), {priorAttainmentBand(average)} prior attainment. DfE Attainment 8 average for this group: <strong>{group.a8.toFixed(2)}</strong>.</p>
            )}
          </div>
        ) : (
          <div>
            <input type="number" inputMode="decimal" min={0} max={90} step={0.01} value={estimateInput} onChange={(e) => setEstimateInput(e.target.value)} placeholder="49.77" aria-label="Attainment 8 estimate for the pupil's KS2 prior attainment" className={inputCls} />
            <p className="text-xs text-muted-foreground mt-1">The Attainment 8 estimate for the pupil's KS2 prior attainment, from the school's data or the <a href={P8_GUIDANCE_URL} target="_blank" rel="noopener noreferrer" className="text-primary underline">DfE table</a> (Annex A of the secondary accountability guidance). The same table is reproduced further down this page.</p>
          </div>
        )}
      </div>

      {ready && (
        <div className="space-y-4 animate-fade-in-up" aria-live="polite">
          {noOfficial ? (
            <div className="rounded-xl border border-amber-300 bg-amber-50 dark:bg-amber-950/40 dark:border-amber-800 p-4 text-sm">
              <p className="font-semibold">No official Progress 8 for pupils who finished Year 11 in summer {yearInfo.v}</p>
              <p className="text-muted-foreground mt-1">Their key stage 2 tests in {yearInfo.ks2} were cancelled, so the DfE has not calculated Progress 8 for the {yearInfo.school} school year and has said there will be no replacement. The figure below is <strong>indicative only</strong>, using the last published DfE averages (summer {P8_ESTIMATES_RESULTS_YEAR} results).</p>
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-muted/40 p-4 text-sm">
              <p className="font-semibold">Progress 8 returns for the {yearInfo.school} school year</p>
              <p className="text-muted-foreground mt-1">The official Attainment 8 averages for the 2027 cohort will be published in October 2027, after results. Until then the figure below is <strong>indicative</strong>, using the last published DfE averages (summer {P8_ESTIMATES_RESULTS_YEAR} results); the real averages move each year.</p>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Indicative Progress 8</p><p className="text-2xl font-bold text-primary">{signed(p8)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Band (DfE thresholds)</p><p className={`text-lg font-bold capitalize ${p8 > 0 ? 'text-green-700 dark:text-green-400' : ''}`}>{band}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Attainment 8 estimate</p><p className="text-lg font-bold">{estimate.toFixed(2)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Actual minus estimate</p><p className="text-lg font-bold">{signed(a8 - estimate, 2)} <span className="text-sm font-normal text-muted-foreground">pts</span></p></div>
          </div>

          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-border/50"><td className="p-3">Pupil's Attainment 8</td><td className="p-3 text-right tabular-nums font-medium">{fmt1(a8)}</td></tr>
                <tr className="border-b border-border/50"><td className="p-3">{ks2Mode === 'scores' && group ? `National average Attainment 8, prior attainment group ${group.group} (${P8_ESTIMATES_RESULTS_YEAR})` : 'Attainment 8 estimate entered'}</td><td className="p-3 text-right tabular-nums font-medium">{estimate.toFixed(2)}</td></tr>
                <tr className="border-b border-border/50"><td className="p-3">Difference</td><td className="p-3 text-right tabular-nums font-medium">{signed(a8 - estimate, 2)}</td></tr>
                <tr className="bg-muted/30"><td className="p-3 font-semibold">Divided by 10 = Progress 8</td><td className="p-3 text-right tabular-nums font-bold">{signed(p8)}</td></tr>
              </tbody>
            </table>
          </div>

          {a8Mode === 'grades' && ks2Mode === 'scores' && group && (
            <div className="rounded-xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/30 text-xs text-muted-foreground"><tr><th className="p-3 text-left font-medium">Attainment 8 bucket</th><th className="p-3 text-right font-medium">Pupil</th><th className="p-3 text-right font-medium">Group {group.group} average</th><th className="p-3 text-right font-medium">Difference</th></tr></thead>
                <tbody>
                  <tr className="border-t border-border/50"><td className="p-3">English (double weighted)</td><td className="p-3 text-right tabular-nums">{built.englishPoints}</td><td className="p-3 text-right tabular-nums">{group.english.toFixed(2)}</td><td className="p-3 text-right tabular-nums font-medium">{signed(built.englishPoints - group.english)}</td></tr>
                  <tr className="border-t border-border/50"><td className="p-3">Maths (double weighted)</td><td className="p-3 text-right tabular-nums">{built.mathsPoints}</td><td className="p-3 text-right tabular-nums">{group.maths.toFixed(2)}</td><td className="p-3 text-right tabular-nums font-medium">{signed(built.mathsPoints - group.maths)}</td></tr>
                  <tr className="border-t border-border/50"><td className="p-3">EBacc, 3 slots</td><td className="p-3 text-right tabular-nums">{fmt1(built.ebaccPoints)}</td><td className="p-3 text-right tabular-nums">{group.ebacc.toFixed(2)}</td><td className="p-3 text-right tabular-nums font-medium">{signed(built.ebaccPoints - group.ebacc)}</td></tr>
                  <tr className="border-t border-border/50"><td className="p-3">Open, 3 slots</td><td className="p-3 text-right tabular-nums">{fmt1(built.openPoints)}</td><td className="p-3 text-right tabular-nums">{group.open.toFixed(2)}</td><td className="p-3 text-right tabular-nums font-medium">{signed(built.openPoints - group.open)}</td></tr>
                </tbody>
              </table>
            </div>
          )}

          <div className="rounded-xl bg-muted/50 p-4 text-sm space-y-2">
            <p>
              {p8 === 0
                ? 'The pupil finished exactly in line with pupils nationally who had the same key stage 2 result.'
                : `Progress 8 is measured in grades per slot, so ${signed(p8)} means about ${gradesPerSlot.toFixed(1)} of a grade ${p8 > 0 ? 'higher' : 'lower'} in every one of the ten weighted Attainment 8 slots than pupils nationally who left primary school with the same result. A score of +1.0 would be one grade higher in every subject.`}
            </p>
            <p className="text-muted-foreground">On the DfE performance-table thresholds this reads as <strong className="text-foreground">{band}</strong>: well above average is 0.5 or more, above average between 0 and 0.5, below average between 0 and -0.5 and well below average under -0.5. For a school the whole 95% confidence interval also has to sit on one side of zero; a single pupil has no interval, so this is the plain comparison.</p>
            {capped && group?.minP8 != null && (
              <p className="text-muted-foreground">This raw score is below the DfE minimum of <strong className="text-foreground">{group.minP8.toFixed(2)}</strong> for prior attainment group {group.group} in {P8_ESTIMATES_RESULTS_YEAR}. In official school figures a pupil score this low is raised to that minimum before the school average is taken, so it would count as {group.minP8.toFixed(2)} rather than {signed(p8)}.</p>
            )}
          </div>

          <ShareRow params={shareParams} />

          <p className="text-xs text-muted-foreground">Follows Annex A and B of the DfE secondary accountability guidance: pupil Progress 8 is Attainment 8 minus the national average Attainment 8 for the pupil's KS2 prior attainment group, divided by 10, using the averages for summer {P8_ESTIMATES_RESULTS_YEAR} results, the last year with a KS2 baseline. The DfE calculates pupil scores only to build school averages and does not publish them; the 2027 averages will not be known until October 2027.</p>
        </div>
      )}
    </div>
  )
}
