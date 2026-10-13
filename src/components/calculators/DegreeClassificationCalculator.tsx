import { useMemo, useState } from 'react'
import ShareRow, { useUrlParam } from '@/components/ShareRow'
import {
  HONOURS_BANDS,
  BORDERLINE_MARKS,
  LEVELS,
  LEVEL_LABELS,
  CREDITS_PER_YEAR,
  MODULE_CREDIT_OPTIONS,
  PRESETS,
  DEFAULT_PRESET_ID,
  presetById,
  weightsAsPercent,
  creditWeightedAverage,
  overallAverage,
  markNeeded,
  classify,
  nextBoundary,
  isBorderline,
  bandByKey,
  type ClassKey,
  type Level,
  type LevelSummary,
} from '@/data/degree-classification'

type Mode = 'modules' | 'average'
interface ModuleRow {
  mark: string
  credits: number
}

const inputCls = 'w-full rounded-xl border border-input bg-background px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-ring'
const selectCls = 'rounded-xl border border-input bg-background px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-ring'
const smallBtn = 'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors'

const clamp = (n: number, lo: number, hi: number) => Math.min(Math.max(n, lo), hi)
const toNum = (s: string) => {
  const n = parseFloat(s)
  return Number.isFinite(n) ? n : NaN
}

/** Module list is kept as "mark x credits" tokens so a share link can carry it: "68x30,72x30" */
const parseModules = (s: string): ModuleRow[] =>
  s
    ? s.split(',').map((tok) => {
        const [m, c] = tok.split('x')
        const credits = parseInt(c ?? '', 10)
        return { mark: m ?? '', credits: MODULE_CREDIT_OPTIONS.includes(credits) ? credits : 30 }
      })
    : []
const encodeModules = (rows: ModuleRow[]) => rows.map((r) => `${r.mark}x${r.credits}`).join(',')
const parseModes = (s: string): Record<Level, Mode> => {
  const parts = s.split(',')
  const pick = (i: number, fallback: Mode): Mode => (parts[i] === 'm' ? 'modules' : parts[i] === 'a' ? 'average' : fallback)
  return { 4: pick(0, 'average'), 5: pick(1, 'average'), 6: pick(2, 'modules') }
}
const encodeModes = (m: Record<Level, Mode>) => LEVELS.map((l) => (m[l] === 'modules' ? 'm' : 'a')).join(',')

export default function DegreeClassificationCalculator() {
  const [presetId, setPresetId] = useUrlParam('w', DEFAULT_PRESET_ID)
  const [w4, setW4] = useUrlParam('w4', '0')
  const [w5, setW5] = useUrlParam('w5', '33')
  const [w6, setW6] = useUrlParam('w6', '67')
  const [targetKey, setTargetKey] = useUrlParam('target', 'first')
  const [modesStr, setModesStr] = useUrlParam('md', 'a,a,m')
  const [a4, setA4] = useUrlParam('a4', '')
  const [a5, setA5] = useUrlParam('a5', '62')
  const [a6, setA6] = useUrlParam('a6', '')
  const [m4, setM4] = useUrlParam('m4', '')
  const [m5, setM5] = useUrlParam('m5', '')
  const [m6, setM6] = useUrlParam('m6', '68x30,72x30')
  // Credits covered by a year average, and credits in the whole year, are local to the session
  const [covered, setCovered] = useState<Record<Level, string>>({ 4: '120', 5: '120', 6: '120' })
  const [inYear, setInYear] = useState<Record<Level, string>>({ 4: '120', 5: '120', 6: '120' })

  const modes = parseModes(modesStr)
  const averages: Record<Level, string> = { 4: a4, 5: a5, 6: a6 }
  const setAverage: Record<Level, (v: string) => void> = { 4: setA4, 5: setA5, 6: setA6 }
  const moduleStrs: Record<Level, string> = { 4: m4, 5: m5, 6: m6 }
  const setModuleStr: Record<Level, (v: string) => void> = { 4: setM4, 5: setM5, 6: setM6 }

  const preset = presetById(presetId)
  const isCustom = preset.id === 'custom'
  const weights: [number, number, number] = isCustom
    ? [clamp(toNum(w4) || 0, 0, 100), clamp(toNum(w5) || 0, 0, 100), clamp(toNum(w6) || 0, 0, 100)]
    : preset.weights
  const weightPct = weightsAsPercent(weights)

  const setMode = (lvl: Level, mode: Mode) => setModesStr(encodeModes({ ...modes, [lvl]: mode }))
  const updateModules = (lvl: Level, rows: ModuleRow[]) => setModuleStr[lvl](encodeModules(rows))

  const summaries: LevelSummary[] = useMemo(
    () =>
      LEVELS.map((lvl) => {
        const yearCredits = clamp(toNum(inYear[lvl]) || CREDITS_PER_YEAR, 10, 480)
        if (modes[lvl] === 'modules') {
          const rows = parseModules(moduleStrs[lvl])
          const { average, credits } = creditWeightedAverage(rows.map((r) => ({ mark: clamp(toNum(r.mark), 0, 100), credits: r.credits })))
          return { average, credits, creditsInYear: Math.max(yearCredits, credits) }
        }
        const avg = toNum(averages[lvl])
        if (!Number.isFinite(avg)) return { average: null, credits: 0, creditsInYear: yearCredits }
        const done = clamp(toNum(covered[lvl]) || yearCredits, 0, 480)
        return { average: clamp(avg, 0, 100), credits: done, creditsInYear: Math.max(yearCredits, done) }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [modesStr, a4, a5, a6, m4, m5, m6, covered, inYear],
  )

  const overall = useMemo(() => overallAverage(summaries, weights), [summaries, weights])
  const avg = overall.average
  const band = avg !== null ? classify(avg) : null
  const next = avg !== null ? nextBoundary(avg) : null
  const borderline = avg !== null && isBorderline(avg)

  const otherPresets = useMemo(
    () =>
      PRESETS.filter((p) => p.id !== 'custom').map((p) => {
        const a = overallAverage(summaries, p.weights).average
        return { preset: p, average: a, band: a !== null ? classify(a) : null }
      }),
    [summaries],
  )

  const needs = useMemo(() => HONOURS_BANDS.map((b) => ({ band: b, need: markNeeded(summaries, weights, b.min) })), [summaries, weights])
  const target = bandByKey((targetKey as ClassKey) || 'first')
  const targetNeed = needs.find((n) => n.band.key === target.key)?.need
  const remaining = needs[0]?.need.remainingCredits ?? 0

  const describeNeed = (needed: number | null, status: string) => {
    if (status === 'no-remaining') return 'No credits left to assess'
    if (status === 'secured') return 'Already secured on the marks entered'
    if (status === 'unreachable') return `Not reachable (${needed!.toFixed(1)}% needed)`
    return `${needed!.toFixed(2)}% average on the remaining ${remaining} credits`
  }

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="deg-weighting" className="block text-sm font-medium mb-2">How your university weights the years</label>
        <select id="deg-weighting" value={presetId} onChange={(e) => setPresetId(e.target.value)} className={`${selectCls} w-full`} aria-label="How your university weights the years">
          {PRESETS.map((p) => (
            <option key={p.id} value={p.id}>{p.label}</option>
          ))}
        </select>
        {!isCustom && preset.examples && <p className="text-xs text-muted-foreground mt-1">Used by, for example: {preset.examples}. Check your own programme regulations.</p>}
        {isCustom && (
          <div className="grid grid-cols-3 gap-3 mt-3">
            {([4, 5, 6] as Level[]).map((lvl) => {
              const val = lvl === 4 ? w4 : lvl === 5 ? w5 : w6
              const set = lvl === 4 ? setW4 : lvl === 5 ? setW5 : setW6
              return (
                <div key={lvl}>
                  <label htmlFor={`deg-w${lvl}`} className="block text-xs text-muted-foreground mb-1">Level {lvl} weight (%)</label>
                  <input id={`deg-w${lvl}`} type="number" inputMode="numeric" min="0" max="100" value={val} onChange={(e) => set(e.target.value)} className={inputCls} aria-label={`Level ${lvl} weight in percent`} />
                </div>
              )
            })}
          </div>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          Effective split: Level 4 {weightPct[0].toFixed(0)}% &middot; Level 5 {weightPct[1].toFixed(0)}% &middot; Level 6 {weightPct[2].toFixed(0)}%
        </p>
      </div>

      {LEVELS.map((lvl, idx) => {
        const mode = modes[lvl]
        const rows = parseModules(moduleStrs[lvl])
        const s = summaries[idx]
        const counted = weights[idx] > 0
        return (
          <div key={lvl} className={`rounded-xl border border-border p-4 space-y-3 ${counted ? '' : 'opacity-70'}`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold">{LEVEL_LABELS[lvl]}</h3>
                <p className="text-xs text-muted-foreground">{counted ? `${weightPct[idx].toFixed(0)}% of the classification` : 'Not counted under this weighting'}</p>
              </div>
              <div className="flex gap-1" role="group" aria-label={`Entry mode for Level ${lvl}`}>
                <button type="button" onClick={() => setMode(lvl, 'modules')} className={`${smallBtn} ${mode === 'modules' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-accent'}`} aria-pressed={mode === 'modules'}>Module marks</button>
                <button type="button" onClick={() => setMode(lvl, 'average')} className={`${smallBtn} ${mode === 'average' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-accent'}`} aria-pressed={mode === 'average'}>Year average</button>
              </div>
            </div>

            {mode === 'modules' ? (
              <div className="space-y-2">
                {rows.map((row, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-16 shrink-0">Module {i + 1}</span>
                    <input
                      type="number"
                      inputMode="decimal"
                      min="0"
                      max="100"
                      placeholder="Mark %"
                      value={row.mark}
                      onChange={(e) => updateModules(lvl, rows.map((r, j) => (j === i ? { ...r, mark: e.target.value.replace(/[^0-9.]/g, '') } : r)))}
                      className={`${inputCls} flex-1`}
                      aria-label={`Level ${lvl} module ${i + 1} mark`}
                    />
                    <select
                      value={row.credits}
                      onChange={(e) => updateModules(lvl, rows.map((r, j) => (j === i ? { ...r, credits: parseInt(e.target.value, 10) } : r)))}
                      className={selectCls}
                      aria-label={`Level ${lvl} module ${i + 1} credits`}
                    >
                      {MODULE_CREDIT_OPTIONS.map((c) => (
                        <option key={c} value={c}>{c} credits</option>
                      ))}
                    </select>
                    <button type="button" onClick={() => updateModules(lvl, rows.filter((_, j) => j !== i))} className="px-2 py-2 rounded-lg bg-muted hover:bg-destructive/10 text-sm" aria-label={`Remove Level ${lvl} module ${i + 1}`}>x</button>
                  </div>
                ))}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <button type="button" onClick={() => updateModules(lvl, [...rows, { mark: '', credits: 30 }])} className={`${smallBtn} bg-muted hover:bg-accent`}>+ Add module</button>
                  <span className="text-xs text-muted-foreground">
                    {s.credits} of {s.creditsInYear} credits entered{s.average !== null ? `, average ${s.average.toFixed(2)}%` : ''}
                  </span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor={`deg-avg${lvl}`} className="block text-xs text-muted-foreground mb-1">Year average (%)</label>
                  <input id={`deg-avg${lvl}`} type="number" inputMode="decimal" min="0" max="100" placeholder="e.g. 62" value={averages[lvl]} onChange={(e) => setAverage[lvl](e.target.value)} className={inputCls} aria-label={`Level ${lvl} year average`} />
                </div>
                <div>
                  <label htmlFor={`deg-cov${lvl}`} className="block text-xs text-muted-foreground mb-1">Credits that average covers</label>
                  <input id={`deg-cov${lvl}`} type="number" inputMode="numeric" min="0" max="480" step="10" value={covered[lvl]} onChange={(e) => setCovered({ ...covered, [lvl]: e.target.value })} className={inputCls} aria-label={`Credits covered by the Level ${lvl} average`} />
                </div>
              </div>
            )}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <label htmlFor={`deg-year${lvl}`}>Credits in this year</label>
              <input id={`deg-year${lvl}`} type="number" inputMode="numeric" min="10" max="480" step="10" value={inYear[lvl]} onChange={(e) => setInYear({ ...inYear, [lvl]: e.target.value })} className="w-20 rounded-lg border border-input bg-background px-2 py-1 text-xs font-medium" aria-label={`Credits in Level ${lvl} year`} />
            </div>
          </div>
        )
      })}

      <div className="space-y-4 animate-fade-in-up">
        <div className="rounded-2xl bg-primary/10 p-6 text-center">
          <p className="text-sm text-muted-foreground">Weighted average on the marks entered</p>
          <p className="text-3xl font-bold text-primary mt-1">{avg !== null ? `${avg.toFixed(2)}%` : 'Enter some marks'}</p>
          {band && <p className="text-lg font-semibold mt-1">{band.label}</p>}
          {avg !== null && next && (
            <p className="text-sm text-muted-foreground mt-1">
              {next.distance.toFixed(2)} marks below the {next.band.short} boundary ({next.band.min}%)
            </p>
          )}
          {avg !== null && !next && <p className="text-sm text-muted-foreground mt-1">Above the 70% First boundary</p>}
        </div>

        {borderline && next && (
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
            <p className="font-medium">Borderline zone</p>
            <p className="text-muted-foreground mt-1">
              An average within about {BORDERLINE_MARKS} marks of a boundary is usually referred to the exam board. Many universities raise the class when, for example, at least half the final-year credits sit in the higher band or the mark is within a set fraction of the line, while others never round. Your own regulations decide.
            </p>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="py-2 pr-3 font-medium">Same marks under other weightings</th>
                <th className="py-2 pr-3 font-medium">Average</th>
                <th className="py-2 font-medium">Class</th>
              </tr>
            </thead>
            <tbody>
              {otherPresets.map(({ preset: p, average: a, band: b }) => (
                <tr key={p.id} className={`border-b border-border/60 ${p.id === presetId ? 'font-semibold' : ''}`}>
                  <td className="py-2 pr-3">{p.label}</td>
                  <td className="py-2 pr-3">{a !== null ? `${a.toFixed(2)}%` : 'n/a'}</td>
                  <td className="py-2">{b ? b.short : 'n/a'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-xl border border-border p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold">What do I need in my remaining credits?</h3>
            <select value={target.key} onChange={(e) => setTargetKey(e.target.value)} className={selectCls} aria-label="Target classification">
              {HONOURS_BANDS.map((b) => (
                <option key={b.key} value={b.key}>{b.short} ({b.min}%+)</option>
              ))}
            </select>
          </div>
          {targetNeed && (
            <p className="text-sm">
              For a <span className="font-semibold">{target.short}</span>: <span className="font-semibold">{describeNeed(targetNeed.needed, targetNeed.status)}</span>
              {targetNeed.status === 'possible' && ', assuming the same mark on every remaining credit in the counted years.'}
            </p>
          )}
          <table className="w-full text-sm">
            <tbody>
              {needs.map(({ band: b, need }) => (
                <tr key={b.key} className={`border-b border-border/60 last:border-0 ${b.key === target.key ? 'font-semibold' : ''}`}>
                  <td className="py-1.5 pr-3">{b.short}</td>
                  <td className="py-1.5 text-muted-foreground">{describeNeed(need.needed, need.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {remaining === 0 && <p className="text-xs text-muted-foreground">Lower a year's "credits that average covers" or add modules with blank marks to model work still to come.</p>}
        </div>

        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-2">
          <p>
            Boundaries used: First 70%+, 2:1 60%+, 2:2 50%+, Third 40%+. Universities set their own weightings, best-of-two methods and borderline rules, so treat this as an estimate and read the award regulations for your programme. A Grade Point Average is an American measure rather than a UK classification; the <a href="/calculator/gpa-calculator/" className="text-primary underline">GPA calculator</a> converts marks if an employer or overseas university asks for one.
          </p>
          <p>
            Related: <a href="/calculator/ucas-points-calculator/" className="text-primary underline">UCAS points calculator</a>, <a href="/calculator/a-level-grade-calculator/" className="text-primary underline">A-level grade calculator</a>, <a href="/calculator/student-loan-repayment-calculator/" className="text-primary underline">student loan repayment calculator</a>.
          </p>
        </div>

        <ShareRow params={{ w: presetId, ...(isCustom ? { w4, w5, w6 } : {}), target: targetKey, md: modesStr, a4, a5, a6, m4, m5, m6 }} />
      </div>
    </div>
  )
}
