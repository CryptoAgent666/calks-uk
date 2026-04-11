import { useState, useMemo } from 'react'

const UCAS_POINTS: Record<string, number> = { 'A*': 56, 'A': 48, 'B': 40, 'C': 32, 'D': 24, 'E': 16 }

export default function ALevelGradeCalculator() {
  const [grades, setGrades] = useState<string[]>(['A', 'B', 'B'])

  const addGrade = () => setGrades([...grades, 'C'])
  const removeGrade = (i: number) => setGrades(grades.filter((_, idx) => idx !== i))
  const updateGrade = (i: number, g: string) => setGrades(grades.map((v, idx) => idx === i ? g : v))

  const totalPoints = grades.reduce((s, g) => s + (UCAS_POINTS[g] || 0), 0)
  const avgPoints = grades.length > 0 ? totalPoints / grades.length : 0

  let tariffSummary = grades.length >= 3 ? grades.slice(0, 3).sort((a, b) => (UCAS_POINTS[b] || 0) - (UCAS_POINTS[a] || 0)).join('') : ''

  let uniLevel = ''
  if (totalPoints >= 144) uniLevel = 'Russell Group / Top universities'
  else if (totalPoints >= 120) uniLevel = 'Strong university options'
  else if (totalPoints >= 96) uniLevel = 'Many universities available'
  else if (totalPoints >= 64) uniLevel = 'Some university places available'
  else uniLevel = 'Foundation year or alternative routes'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h3 className="text-sm font-semibold">A-Level Grades</h3><button onClick={addGrade} className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium">+ Add</button></div>
      <div className="flex flex-wrap gap-2">
        {grades.map((g, i) => (
          <div key={i} className="flex items-center gap-1">
            <select value={g} onChange={(e) => updateGrade(i, e.target.value)} className="rounded-lg border border-input bg-background px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-ring">
              {Object.entries(UCAS_POINTS).map(([gr, pts]) => <option key={gr} value={gr}>{gr} ({pts} pts)</option>)}
            </select>
            <button onClick={() => removeGrade(i)} className="px-1.5 py-2 rounded-lg bg-muted hover:bg-destructive/10 text-xs">x</button>
          </div>
        ))}
      </div>

      <div className="space-y-4 animate-fade-in-up">
        <div className="rounded-2xl bg-primary/10 p-6 text-center">
          <p className="text-sm text-muted-foreground">Total UCAS Points</p>
          <p className="text-4xl font-bold text-primary mt-1">{totalPoints}</p>
          {tariffSummary && <p className="text-lg font-semibold mt-1">{tariffSummary}</p>}
          <p className="text-sm text-muted-foreground mt-1">{uniLevel}</p>
        </div>
        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">UCAS Points: </p>
          <div className="flex gap-3 mt-1">{Object.entries(UCAS_POINTS).map(([g, p]) => <span key={g} className="px-2 py-1 rounded bg-muted text-xs">{g} = {p}</span>)}</div>
          <p className="mt-2">Russell Group typically requires AAA-ABB (144-128 pts). Check individual course requirements.</p>
        </div>
      </div>
    </div>
  )
}
