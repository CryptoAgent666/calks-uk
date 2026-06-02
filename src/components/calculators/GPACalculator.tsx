import { useState, useMemo } from 'react'

const UK_GRADES = [
  { label: 'First (70%+)', points: 4.0, ukClass: '1st' },
  { label: 'Upper Second (60-69%)', points: 3.3, ukClass: '2:1' },
  { label: 'Lower Second (50-59%)', points: 2.7, ukClass: '2:2' },
  { label: 'Third (40-49%)', points: 2.0, ukClass: '3rd' },
  { label: 'Pass (35-39%)', points: 1.0, ukClass: 'Pass' },
  { label: 'Fail (<35%)', points: 0, ukClass: 'Fail' },
]

export default function GPACalculator() {
  const [modules, setModules] = useState<{ grade: number; credits: number }[]>([
    { grade: 0, credits: 30 }, { grade: 1, credits: 30 }, { grade: 1, credits: 15 }, { grade: 2, credits: 15 },
  ])

  const addModule = () => setModules([...modules, { grade: 1, credits: 15 }])
  const removeModule = (i: number) => setModules(modules.filter((_, idx) => idx !== i))
  const updateModule = (i: number, field: 'grade' | 'credits', value: number) => setModules(modules.map((m, idx) => idx === i ? { ...m, [field]: value } : m))

  const result = useMemo(() => {
    const totalCredits = modules.reduce((s, m) => s + m.credits, 0)
    const weightedSum = modules.reduce((s, m) => s + UK_GRADES[m.grade].points * m.credits, 0)
    const gpa = totalCredits > 0 ? weightedSum / totalCredits : 0

    let classification = 'Fail'
    if (gpa >= 3.7) classification = 'First Class Honours'
    else if (gpa >= 3.0) classification = 'Upper Second (2:1)'
    else if (gpa >= 2.3) classification = 'Lower Second (2:2)'
    else if (gpa >= 1.5) classification = 'Third Class'
    else if (gpa >= 0.7) classification = 'Pass'

    return { gpa, totalCredits, classification }
  }, [modules])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Modules</h3>
        <button onClick={addModule} className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">+ Add Module</button>
      </div>

      <div className="space-y-2">
        {modules.map((m, i) => (
          <div key={i} className="flex items-center gap-2">
            <select value={m.grade} onChange={(e) => updateModule(i, 'grade', parseInt(e.target.value))} aria-label={`Module ${i + 1} grade`} className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring">
              {UK_GRADES.map((g, gi) => <option key={gi} value={gi}>{g.label} (GPA {g.points})</option>)}
            </select>
            <div className="flex items-center gap-1">
              <input type="number" min="5" max="120" step="5" value={m.credits} onChange={(e) => updateModule(i, 'credits', parseInt(e.target.value) || 15)} aria-label={`Module ${i + 1} credits`} className="w-16 rounded-lg border border-input bg-background px-2 py-2 text-sm text-center font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
              <span className="text-xs text-muted-foreground">credits</span>
            </div>
            <button onClick={() => removeModule(i)} aria-label={`Remove module ${i + 1}`} className="px-2 py-2 rounded-lg bg-muted hover:bg-destructive/10 text-sm">x</button>
          </div>
        ))}
      </div>

      <div className="space-y-4 animate-fade-in-up">
        <div className="rounded-2xl bg-primary/10 p-6 text-center">
          <p className="text-sm text-muted-foreground">Grade Point Average</p>
          <p className="text-4xl font-bold text-primary mt-1">{result.gpa.toFixed(2)}</p>
          <p className="text-lg font-semibold mt-1">{result.classification}</p>
          <p className="text-sm text-muted-foreground">{result.totalCredits} credits</p>
        </div>

        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">UK GPA Scale:</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {UK_GRADES.filter(g => g.points > 0).map(g => <span key={g.ukClass} className="px-2 py-1 rounded bg-muted text-xs">{g.ukClass} = {g.points} GPA</span>)}
          </div>
        </div>
      </div>
    </div>
  )
}
