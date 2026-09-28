import { useState, useMemo } from 'react'

const GRADE_POINTS: Record<string, number> = { '9': 9, '8': 8, '7': 7, '6': 6, '5': 5, '4': 4, '3': 3, '2': 2, '1': 1, 'U': 0 }
const GRADES = Object.keys(GRADE_POINTS)
// Combined science (double award) is graded as a pair, 9-9 down to 1-1
const COMBINED_GRADES = ['9-9', '9-8', '8-8', '8-7', '7-7', '7-6', '6-6', '6-5', '5-5', '5-4', '4-4', '4-3', '3-3', '3-2', '2-2', '2-1', '1-1', 'U']
const OLD_TO_NEW: Record<string, string> = { 'A*': '8-9', 'A': '7', 'B': '5-6', 'C': '4', 'D': '3', 'E': '2', 'F': '1-2', 'G': '1' }

// National average Attainment 8, state-funded schools in England, summer 2025
// (DfE, Key stage 4 performance 2024/25)
const NATIONAL_A8 = 46.0

type SubjectType = 'englang' | 'englit' | 'maths' | 'combined' | 'science' | 'computing' | 'humanity' | 'language' | 'other'

const SUBJECTS: { v: SubjectType; l: string }[] = [
  { v: 'englang', l: 'English Language' },
  { v: 'englit', l: 'English Literature' },
  { v: 'maths', l: 'Maths' },
  { v: 'combined', l: 'Combined Science (double)' },
  { v: 'science', l: 'Biology, Chemistry or Physics' },
  { v: 'computing', l: 'Computer Science' },
  { v: 'humanity', l: 'History or Geography' },
  { v: 'language', l: 'Language (French, Spanish, Latin…)' },
  { v: 'other', l: 'Other GCSE or technical award' },
]
const EBACC_TYPES: SubjectType[] = ['combined', 'science', 'computing', 'humanity', 'language']

interface Row { type: SubjectType; grade: string }

// Points for one row: a combined science pair is averaged (6-5 = 5.5 per slot)
function rowPoints(r: Row): number {
  if (r.type === 'combined') {
    if (r.grade === 'U') return 0
    const [a, b] = r.grade.split('-').map(Number)
    return (a + b) / 2
  }
  return GRADE_POINTS[r.grade] ?? 0
}

/**
 * Attainment 8 per the DfE secondary accountability guidance (2025):
 * - maths bucket: double weighted;
 * - English bucket: the better of English language and literature, double weighted only
 *   if both are sat (the other can then count in the open bucket); a single English
 *   qualification counts once;
 * - EBacc bucket: the 3 best EBacc qualifications (sciences, computer science, history,
 *   geography, languages); combined science can fill 2 slots at its averaged grade;
 * - open bucket: the 3 best remaining qualifications, including unused EBacc subjects.
 * Empty slots score 0, so the maximum is 90. Filling the EBacc bucket first with the
 * best EBacc grades is optimal, because the open bucket accepts any subject.
 */
function attainment8(rows: Row[]) {
  const english = rows.filter((r) => r.type === 'englang' || r.type === 'englit').map(rowPoints).sort((a, b) => b - a)
  const bothEnglish = rows.some((r) => r.type === 'englang') && rows.some((r) => r.type === 'englit')
  const englishPoints = english.length ? english[0] * (bothEnglish ? 2 : 1) : 0
  const mathsPoints = Math.max(0, ...rows.filter((r) => r.type === 'maths').map(rowPoints)) * 2

  const ebaccCandidates: number[] = []
  const openCandidates: number[] = bothEnglish ? english.slice(1, 2) : []
  for (const r of rows) {
    if (!EBACC_TYPES.includes(r.type)) {
      if (r.type === 'other') openCandidates.push(rowPoints(r))
      continue
    }
    const p = rowPoints(r)
    ebaccCandidates.push(p)
    if (r.type === 'combined') ebaccCandidates.push(p) // two slots
  }
  ebaccCandidates.sort((a, b) => b - a)
  const ebacc = ebaccCandidates.slice(0, 3)
  const open = [...ebaccCandidates.slice(3), ...openCandidates].sort((a, b) => b - a).slice(0, 3)
  const ebaccPoints = ebacc.reduce((s, p) => s + p, 0)
  const openPoints = open.reduce((s, p) => s + p, 0)
  const total = englishPoints + mathsPoints + ebaccPoints + openPoints
  return {
    total, englishPoints, mathsPoints, ebaccPoints, openPoints, bothEnglish,
    hasEnglish: english.length > 0,
    ebaccFilled: ebacc.length, openFilled: open.length,
    average: total / 10, // Attainment 8 is out of 10 weighted slots
  }
}

function summary(rows: Row[]) {
  // Every grade awarded, with combined science counting as two GCSEs
  const grades: number[] = []
  for (const r of rows) {
    if (r.type === 'combined') {
      if (r.grade === 'U') grades.push(0, 0)
      else grades.push(...r.grade.split('-').map(Number))
    } else grades.push(GRADE_POINTS[r.grade] ?? 0)
  }
  const count = grades.length
  const best = (t: SubjectType[]) => Math.max(0, ...rows.filter((r) => t.includes(r.type)).map(rowPoints))
  const bestEnglish = best(['englang', 'englit'])
  const bestMaths = best(['maths'])
  return {
    count,
    average: count ? grades.reduce((s, g) => s + g, 0) / count : 0,
    pass4: grades.filter((g) => g >= 4).length,
    strong5: grades.filter((g) => g >= 5).length,
    englishMaths4: bestEnglish >= 4 && bestMaths >= 4,
    englishMaths5: bestEnglish >= 5 && bestMaths >= 5,
  }
}

const DEFAULT_ROWS: Row[] = [
  { type: 'englang', grade: '6' },
  { type: 'englit', grade: '5' },
  { type: 'maths', grade: '6' },
  { type: 'combined', grade: '6-5' },
  { type: 'humanity', grade: '5' },
  { type: 'language', grade: '4' },
  { type: 'other', grade: '6' },
  { type: 'other', grade: '5' },
]

export default function GCSEGradeCalculator() {
  const [rows, setRows] = useState<Row[]>(DEFAULT_ROWS)

  const addRow = () => setRows([...rows, { type: 'other', grade: '5' }])
  const removeRow = (i: number) => setRows(rows.filter((_, idx) => idx !== i))
  const updateRow = (i: number, patch: Partial<Row>) => setRows(rows.map((r, idx) => {
    if (idx !== i) return r
    const next = { ...r, ...patch }
    // Switching to or from combined science changes the grade scale
    if (patch.type && (patch.type === 'combined') !== (r.type === 'combined')) next.grade = patch.type === 'combined' ? '5-5' : '5'
    return next
  }))

  const a8 = useMemo(() => attainment8(rows), [rows])
  const s = useMemo(() => summary(rows), [rows])
  const vsNational = a8.total - NATIONAL_A8

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Your GCSE subjects and grades (9-1)</h3>
        <button onClick={addRow} className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">+ Add Subject</button>
      </div>
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

      <div className="space-y-4 animate-fade-in-up">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Attainment 8</p><p className="text-xl font-bold text-primary">{a8.total % 1 ? a8.total.toFixed(1) : a8.total} <span className="text-sm font-normal text-muted-foreground">/ 90</span></p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">vs national average ({NATIONAL_A8})</p><p className={`text-xl font-bold ${vsNational >= 0 ? 'text-green-700 dark:text-green-400' : ''}`}>{vsNational >= 0 ? '+' : ''}{vsNational.toFixed(1)}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Average Grade (all GCSEs)</p><p className="text-xl font-bold">{s.average.toFixed(1)}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">English & Maths</p><p className="text-xl font-bold">{s.englishMaths5 ? '5+ both' : s.englishMaths4 ? '4+ both' : 'Below 4'}</p></div>
        </div>

        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border/50"><td className="p-3">English {a8.hasEnglish ? (a8.bothEnglish ? '(best of the two, double weighted)' : '(single weighted: sit both for double)') : '(not entered)'}</td><td className="p-3 text-right tabular-nums font-medium">{a8.englishPoints}</td></tr>
              <tr className="border-b border-border/50"><td className="p-3">Maths (double weighted)</td><td className="p-3 text-right tabular-nums font-medium">{a8.mathsPoints}</td></tr>
              <tr className="border-b border-border/50"><td className="p-3">EBacc subjects, best 3 ({a8.ebaccFilled}/3 slots filled)</td><td className="p-3 text-right tabular-nums font-medium">{a8.ebaccPoints % 1 ? a8.ebaccPoints.toFixed(1) : a8.ebaccPoints}</td></tr>
              <tr className="border-b border-border/50"><td className="p-3">Open subjects, best 3 ({a8.openFilled}/3 slots filled)</td><td className="p-3 text-right tabular-nums font-medium">{a8.openPoints % 1 ? a8.openPoints.toFixed(1) : a8.openPoints}</td></tr>
              <tr className="bg-muted/30"><td className="p-3 font-semibold">Attainment 8 (average {a8.average.toFixed(2)} a slot)</td><td className="p-3 text-right tabular-nums font-bold">{a8.total % 1 ? a8.total.toFixed(1) : a8.total}</td></tr>
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center"><p className="text-xs text-muted-foreground">Standard Pass (4+)</p><p className="text-xl font-bold text-green-700 dark:text-green-400">{s.pass4}/{s.count}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Strong Pass (5+)</p><p className="text-xl font-bold">{s.strong5}/{s.count}</p></div>
        </div>

        <p className="text-xs text-muted-foreground">Follows the DfE Attainment 8 rules: combined science fills up to two slots at the average of its two grades, and empty slots score zero. It does not apply discounting for overlapping qualifications (for example combined science with a separate science) or early-entry rules. Progress 8 is not calculated for GCSEs sat in 2025 and 2026.</p>

        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-1">Old grades to new (9-1):</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(OLD_TO_NEW).map(([old, newG]) => (
              <span key={old} className="px-2 py-1 rounded bg-muted text-xs">{old} = {newG}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
