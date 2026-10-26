import { useState, useMemo } from 'react'
import {
  GRADE_POINTS, GRADES, COMBINED_GRADES, UNKNOWN_GRADE, NATIONAL_A8, SUBJECTS, DEFAULT_ROWS,
  attainment8, gradesNeeded, isUnknown, rowPoints, type Row, type SubjectType,
} from '@/data/attainment8'

// Slot rules, grade points and the national average live in src/data/attainment8.ts,
// shared with the Progress 8 calculator so the two pages cannot drift apart.

const OLD_TO_NEW: Record<string, string> = { 'A*': '8-9', 'A': '7', 'B': '5-6', 'C': '4', 'D': '3', 'E': '2', 'F': '1-2', 'G': '1' }

function summary(rows: Row[]) {
  // Every grade awarded, with combined science counting as two GCSEs; slots not yet known are left out
  const grades: number[] = []
  let unknown = 0
  for (const r of rows) {
    if (isUnknown(r)) { unknown++; continue }
    if (r.type === 'combined') {
      if (r.grade === 'U') grades.push(0, 0)
      else grades.push(...r.grade.split('-').map(Number))
    } else grades.push(GRADE_POINTS[r.grade] ?? 0)
  }
  const count = grades.length
  const total = grades.reduce((s, g) => s + g, 0)
  const best = (t: SubjectType[]) => Math.max(0, ...rows.filter((r) => t.includes(r.type)).map(rowPoints))
  const bestEnglish = best(['englang', 'englit'])
  const bestMaths = best(['maths'])
  return {
    count,
    unknown,
    total,
    average: count ? total / count : 0,
    pass4: grades.filter((g) => g >= 4).length,
    strong5: grades.filter((g) => g >= 5).length,
    englishMaths4: bestEnglish >= 4 && bestMaths >= 4,
    englishMaths5: bestEnglish >= 5 && bestMaths >= 5,
  }
}

const TARGETS = [
  { v: '40', l: 'Grade 4 average (40)' },
  { v: '50', l: 'Grade 5 average (50)' },
  { v: '60', l: 'Grade 6 average (60)' },
  { v: '70', l: 'Grade 7 average (70)' },
]

const fmt = (n: number) => (n % 1 ? n.toFixed(1) : String(n))

export default function GCSEGradeCalculator() {
  const [rows, setRows] = useState<Row[]>(DEFAULT_ROWS)
  const [mode, setMode] = useState<'results' | 'target'>('results')
  const [target, setTarget] = useState('60')

  const addRow = () => setRows([...rows, { type: 'other', grade: mode === 'target' ? UNKNOWN_GRADE : '5' }])
  const removeRow = (i: number) => setRows(rows.filter((_, idx) => idx !== i))
  const updateRow = (i: number, patch: Partial<Row>) => setRows(rows.map((r, idx) => {
    if (idx !== i) return r
    const next = { ...r, ...patch }
    // Switching to or from combined science changes the grade scale (a slot not yet known stays unknown)
    if (patch.type && (patch.type === 'combined') !== (r.type === 'combined') && !isUnknown(r)) next.grade = patch.type === 'combined' ? '5-5' : '5'
    return next
  }))

  const a8 = useMemo(() => attainment8(rows), [rows])
  const s = useMemo(() => summary(rows), [rows])
  const vsNational = a8.total - NATIONAL_A8
  const targetNum = Math.min(90, Math.max(0, parseFloat(target) || 0))
  const need = useMemo(() => gradesNeeded(rows, targetNum), [rows, targetNum])
  // Bisection lands a hair above the exact grade (7.0000000000045), so round before showing it or deciding the whole-grade hint
  const needed = need.needed === null ? null : Math.round(need.needed * 10) / 10

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">Your GCSE subjects and grades (9-1)</h3>
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg bg-muted p-0.5 text-xs font-medium" role="group" aria-label="Calculator mode">
            <button type="button" onClick={() => setMode('results')} aria-pressed={mode === 'results'} className={`px-2.5 py-1 rounded-md transition-colors ${mode === 'results' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>Results in hand</button>
            <button type="button" onClick={() => setMode('target')} aria-pressed={mode === 'target'} className={`px-2.5 py-1 rounded-md transition-colors ${mode === 'target' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>Grades I still need</button>
          </div>
          <button onClick={addRow} className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">+ Add Subject</button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {rows.map((r, i) => (
          <div key={i} className="flex items-center gap-2">
            <select value={r.type} onChange={(e) => updateRow(i, { type: e.target.value as SubjectType })} aria-label={`Subject ${i + 1}`} className="flex-1 min-w-0 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              {SUBJECTS.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
            </select>
            <select value={r.grade} onChange={(e) => updateRow(i, { grade: e.target.value })} aria-label={`Grade for subject ${i + 1}`} className="w-24 rounded-lg border border-input bg-background px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-ring">
              {(r.type === 'combined' ? COMBINED_GRADES : GRADES).map((gr) => <option key={gr} value={gr}>{gr}</option>)}
              <option value={UNKNOWN_GRADE}>Not yet known</option>
            </select>
            <button onClick={() => removeRow(i)} aria-label={`Remove subject ${i + 1}`} className="px-2 py-2 rounded-lg bg-muted hover:bg-destructive/10 text-sm">x</button>
          </div>
        ))}
      </div>

      {mode === 'target' && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold">Grades I still need</p>
            <label className="flex items-center gap-2 text-sm">
              <span>Target Attainment 8</span>
              <input type="number" inputMode="decimal" min={0} max={90} step={1} value={target} onChange={(e) => setTarget(e.target.value)} aria-label="Target Attainment 8 score" className="w-20 rounded-lg border border-input bg-background px-2 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
            </label>
          </div>
          <div className="flex flex-wrap gap-2">
            {TARGETS.map((t) => (
              <button key={t.v} type="button" onClick={() => setTarget(t.v)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${target === t.v ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-accent'}`}>{t.l}</button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">Set the grade of every subject you have not sat yet to <strong>Not yet known</strong>. English and maths slots are double weighted, so an unknown grade there moves the total twice as far.</p>
          <div className="rounded-lg bg-background border border-border p-3 text-sm" aria-live="polite">
            {need.status === 'none' && <p>Mark at least one subject as Not yet known. Your {s.count} known grades give <strong>{fmt(need.banked)}</strong> Attainment 8 points against a target of {targetNum}.</p>}
            {need.status === 'reached' && <p>Your known grades already give <strong>{fmt(need.banked)}</strong> points, which meets the target of {targetNum}{need.unknown ? `, whatever the ${need.unknown} remaining ${need.unknown === 1 ? 'subject brings' : 'subjects bring'}` : ''}.</p>}
            {need.status === 'impossible' && <p><strong>Not reachable.</strong> Grade 9 in every one of the {need.unknown} remaining {need.unknown === 1 ? 'subject' : 'subjects'} would give {fmt(need.ceiling)} points, short of {targetNum}. Lower the target or add the subjects that are missing.</p>}
            {need.status === 'possible' && needed !== null && (
              <p>You need an average of <strong>grade {needed.toFixed(1)}</strong> across the {need.unknown} remaining {need.unknown === 1 ? 'subject' : 'subjects'}{needed > Math.floor(needed) && Math.ceil(needed) <= 9 ? `, so grade ${Math.ceil(needed)} in each of them would do it` : ''}. Known grades bank {fmt(need.banked)} points; grade 9 in every remaining subject would reach {fmt(need.ceiling)}.</p>
            )}
          </div>
        </div>
      )}

      <div className="space-y-4 animate-fade-in-up">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">{s.unknown ? 'Attainment 8 (known grades)' : 'Attainment 8'}</p><p className="text-xl font-bold text-primary">{fmt(a8.total)} <span className="text-sm font-normal text-muted-foreground">/ 90</span></p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">vs national average ({NATIONAL_A8})</p><p className={`text-xl font-bold ${vsNational >= 0 ? 'text-green-700 dark:text-green-400' : ''}`}>{vsNational >= 0 ? '+' : ''}{vsNational.toFixed(1)}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Average point score per entry</p><p className="text-xl font-bold">{s.average.toFixed(1)}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">English & Maths</p><p className="text-xl font-bold">{s.englishMaths5 ? '5+ both' : s.englishMaths4 ? '4+ both' : 'Below 4'}</p></div>
        </div>

        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border/50"><td className="p-3">English {a8.hasEnglish ? (a8.bothEnglish ? '(best of the two, double weighted)' : '(single weighted: sit both for double)') : '(not entered)'}</td><td className="p-3 text-right tabular-nums font-medium">{a8.englishPoints}</td></tr>
              <tr className="border-b border-border/50"><td className="p-3">Maths (double weighted)</td><td className="p-3 text-right tabular-nums font-medium">{a8.mathsPoints}</td></tr>
              <tr className="border-b border-border/50"><td className="p-3">Former EBacc subjects, best 3 ({a8.ebaccFilled}/3 slots filled)</td><td className="p-3 text-right tabular-nums font-medium">{fmt(a8.ebaccPoints)}</td></tr>
              <tr className="border-b border-border/50"><td className="p-3">Open subjects, best 3 ({a8.openFilled}/3 slots filled)</td><td className="p-3 text-right tabular-nums font-medium">{fmt(a8.openPoints)}</td></tr>
              <tr className="bg-muted/30"><td className="p-3 font-semibold">Attainment 8 (average {a8.average.toFixed(2)} a slot)</td><td className="p-3 text-right tabular-nums font-bold">{fmt(a8.total)}</td></tr>
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Total GCSE points</p><p className="text-xl font-bold">{fmt(s.total)}</p><p className="text-xs text-muted-foreground">{s.count} {s.count === 1 ? 'entry' : 'entries'}{s.unknown ? `, ${s.unknown} not yet known` : ''}</p></div>
          <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center"><p className="text-xs text-muted-foreground">Standard Pass (4+)</p><p className="text-xl font-bold text-green-700 dark:text-green-400">{s.pass4}/{s.count}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Strong Pass (5+)</p><p className="text-xl font-bold">{s.strong5}/{s.count}</p></div>
        </div>

        <p className="text-xs text-muted-foreground">Follows the DfE Attainment 8 rules: combined science fills up to two slots at the average of its two grades, and empty slots score zero. Total GCSE points and the average point score per entry count combined science as two entries. It does not apply discounting for overlapping qualifications (for example combined science with a separate science) or early-entry rules. Progress 8 is not calculated for GCSEs sat in 2025 and 2026; the <a href="/calculator/progress-8-calculator/" className="text-primary underline">Progress 8 calculator</a> shows what the comparison with the KS2 starting point looks like.</p>

        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-1">Old grades to new (9-1):</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(OLD_TO_NEW).map(([old, newG]) => (
              <span key={old} className="px-2 py-1 rounded bg-muted text-xs">{old} = {newG}</span>
            ))}
          </div>
          <p className="text-xs mt-2">Grade 4 matches the bottom of the old C and grade 7 the bottom of the old A. Grade 5 sits across a high C and a low B. Wales and Northern Ireland still grade most GCSEs A* to G.</p>
        </div>
      </div>
    </div>
  )
}
