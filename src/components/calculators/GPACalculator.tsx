import { useState, useMemo } from 'react'

// Higher Education Academy, GPA pilot report 2013-14, Table 1: the recommended UK scale.
// Each row is the lowest whole mark in the band and its grade point.
const HEA_SCALE = [
  { min: 75, grade: 'A+', points: 4.25 },
  { min: 71, grade: 'A', points: 4.0 },
  { min: 67, grade: 'A-', points: 3.75 },
  { min: 64, grade: 'B+', points: 3.5 },
  { min: 61, grade: 'B', points: 3.25 },
  { min: 57, grade: 'B-', points: 3.0 },
  { min: 54, grade: 'C+', points: 2.75 },
  { min: 50, grade: 'C', points: 2.5 },
  { min: 48, grade: 'C-', points: 2.25 },
  { min: 43, grade: 'D+', points: 2.0 },
  { min: 40, grade: 'D', points: 1.5 },
  { min: 38, grade: 'D-', points: 1.0 },
  { min: 35, grade: 'F+', points: 0.75 },
  { min: 30, grade: 'F', points: 0.5 },
  { min: 0, grade: 'F-', points: 0 },
]

const MIN_CREDITS = 5
const MAX_CREDITS = 120

function gradePoints(mark: number) {
  const rounded = Math.round(mark)
  return HEA_SCALE.find(band => rounded >= band.min)?.points ?? 0
}

function indicativeClass(mean: number) {
  if (mean >= 70) return 'First Class Honours'
  if (mean >= 60) return 'Upper Second (2:1)'
  if (mean >= 50) return 'Lower Second (2:2)'
  if (mean >= 40) return 'Third Class'
  return 'Below 40%, under the usual Third boundary'
}

type Module = { mark: string; credits: string }

function isValidModule(m: Module) {
  const mark = Number(m.mark)
  const credits = Number(m.credits)
  return m.mark.trim() !== '' && mark >= 0 && mark <= 100 &&
    Number.isInteger(credits) && credits >= MIN_CREDITS && credits <= MAX_CREDITS
}

function calculate(modules: Module[]) {
  if (modules.length === 0 || !modules.every(isValidModule)) return null
  const rows = modules.map(m => ({ mark: Number(m.mark), credits: Number(m.credits) }))
  const totalCredits = rows.reduce((s, m) => s + m.credits, 0)
  const mean = Math.round((rows.reduce((s, m) => s + m.mark * m.credits, 0) / totalCredits) * 10) / 10
  const gpa = rows.reduce((s, m) => s + gradePoints(m.mark) * m.credits, 0) / totalCredits
  return { mean, gpa, totalCredits, classification: indicativeClass(mean) }
}

export default function GPACalculator() {
  const [modules, setModules] = useState<Module[]>([
    { mark: '72', credits: '30' }, { mark: '65', credits: '30' }, { mark: '65', credits: '15' }, { mark: '55', credits: '15' },
  ])

  const addModule = () => setModules([...modules, { mark: '', credits: '15' }])
  const removeModule = (i: number) => setModules(modules.filter((_, idx) => idx !== i))
  const updateModule = (i: number, field: keyof Module, value: string) => setModules(modules.map((m, idx) => idx === i ? { ...m, [field]: value } : m))

  const result = useMemo(() => calculate(modules), [modules])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Modules</h3>
        <button onClick={addModule} className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">+ Add Module</button>
      </div>

      <div className="space-y-2">
        {modules.map((m, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="flex flex-1 items-center gap-1">
              <input type="number" min="0" max="100" value={m.mark} onChange={(e) => updateModule(i, 'mark', e.target.value)} aria-label={`Module ${i + 1} mark (%)`} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
              <span className="text-xs text-muted-foreground">%</span>
            </div>
            <div className="flex items-center gap-1">
              <input type="number" min={MIN_CREDITS} max={MAX_CREDITS} step="5" value={m.credits} onChange={(e) => updateModule(i, 'credits', e.target.value)} aria-label={`Module ${i + 1} credits`} className="w-16 rounded-lg border border-input bg-background px-2 py-2 text-sm text-center font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
              <span className="text-xs text-muted-foreground">credits</span>
            </div>
            <button onClick={() => removeModule(i)} aria-label={`Remove module ${i + 1}`} className="px-2 py-2 rounded-lg bg-muted hover:bg-destructive/10 text-sm">x</button>
          </div>
        ))}
      </div>

      {!result && (
        <p className="text-sm text-destructive" role="alert">Add at least one module, with a mark from 0 to 100 and credits from {MIN_CREDITS} to {MAX_CREDITS}.</p>
      )}

      {result && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Credit-weighted average</p>
            <p className="text-4xl font-bold text-primary mt-1">{result.mean.toFixed(1)}%</p>
            <p className="text-lg font-semibold mt-1">Indicative: {result.classification}</p>
            <p className="text-sm text-muted-foreground">GPA {result.gpa.toFixed(2)} on the HEA 0 to 4.25 scale &middot; {result.totalCredits} credits</p>
          </div>

          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>The class uses the usual 70/60/50/40 boundaries on a plain credit-weighted average. Your university may weight years differently, so its result can differ.</p>
            <p className="font-medium text-foreground mt-3">HEA UK GPA scale (lowest mark in each band):</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {HEA_SCALE.map(b => <span key={b.grade} className="px-2 py-1 rounded bg-muted text-xs">{b.min}%+ = {b.points}</span>)}
            </div>
            <p className="mt-3">This is not the US 4.0 scale. US evaluators and universities use their own conversions.</p>
          </div>
        </div>
      )}
    </div>
  )
}
