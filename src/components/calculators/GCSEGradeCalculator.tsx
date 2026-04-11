import { useState, useMemo } from 'react'

const GRADE_POINTS: Record<string, number> = { '9': 9, '8': 8, '7': 7, '6': 6, '5': 5, '4': 4, '3': 3, '2': 2, '1': 1, 'U': 0 }
const OLD_TO_NEW: Record<string, string> = { 'A*': '8-9', 'A': '7', 'B': '5-6', 'C': '4', 'D': '3', 'E': '2', 'F': '1-2', 'G': '1' }

export default function GCSEGradeCalculator() {
  const [grades, setGrades] = useState<string[]>(['7', '6', '6', '5', '5', '5', '4', '4'])

  const addGrade = () => setGrades([...grades, '5'])
  const removeGrade = (i: number) => setGrades(grades.filter((_, idx) => idx !== i))
  const updateGrade = (i: number, g: string) => setGrades(grades.map((v, idx) => idx === i ? g : v))

  const result = useMemo(() => {
    const points = grades.map(g => GRADE_POINTS[g] || 0)
    const total = points.reduce((s, p) => s + p, 0)
    const average = grades.length > 0 ? total / grades.length : 0
    const pass4 = grades.filter(g => (GRADE_POINTS[g] || 0) >= 4).length
    const strong5 = grades.filter(g => (GRADE_POINTS[g] || 0) >= 5).length

    let attainment8 = 0
    const sorted = [...points].sort((a, b) => b - a)
    sorted.slice(0, 8).forEach(p => attainment8 += p)

    return { total, average, pass4, strong5, count: grades.length, attainment8 }
  }, [grades])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Your GCSE Grades (9-1)</h3>
        <button onClick={addGrade} className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">+ Add Subject</button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {grades.map((g, i) => (
          <div key={i} className="flex items-center gap-2">
            <select value={g} onChange={(e) => updateGrade(i, e.target.value)} className="flex-1 rounded-lg border border-input bg-background px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-ring">
              {Object.keys(GRADE_POINTS).map(gr => <option key={gr} value={gr}>Grade {gr}</option>)}
            </select>
            <button onClick={() => removeGrade(i)} className="px-2 py-2 rounded-lg bg-muted hover:bg-destructive/10 text-sm">x</button>
          </div>
        ))}
      </div>

      <div className="space-y-4 animate-fade-in-up">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Attainment 8</p><p className="text-xl font-bold text-primary">{result.attainment8}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Average Grade</p><p className="text-xl font-bold">{result.average.toFixed(1)}</p></div>
          <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center"><p className="text-xs text-muted-foreground">Standard Pass (4+)</p><p className="text-xl font-bold text-green-700 dark:text-green-400">{result.pass4}/{result.count}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Strong Pass (5+)</p><p className="text-xl font-bold">{result.strong5}/{result.count}</p></div>
        </div>

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
