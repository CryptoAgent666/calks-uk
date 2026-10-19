import { useState } from 'react'

const UCAS_POINTS: Record<string, number> = { 'A*': 56, 'A': 48, 'B': 40, 'C': 32, 'D': 24, 'E': 16 }

// Bands are read from the best three grades, the usual basis for offers.
// 128 to 143 (ABB to AAB) is the lower part of the typical Russell Group range of AAA to ABB.
function offerBand(best3Points: number) {
  if (best3Points >= 144) return 'Russell Group / top universities (AAA or above)'
  if (best3Points >= 128) return 'Strong: within the typical Russell Group range (ABB to AAB)'
  if (best3Points >= 96) return 'Many universities available (CCC to BBB)'
  if (best3Points >= 64) return 'Some university places available'
  return 'Foundation year or alternative routes'
}

export default function ALevelGradeCalculator() {
  const [grades, setGrades] = useState<string[]>(['A', 'B', 'B'])

  const addGrade = () => setGrades([...grades, 'C'])
  const removeGrade = (i: number) => setGrades(grades.filter((_, idx) => idx !== i))
  const updateGrade = (i: number, g: string) => setGrades(grades.map((v, idx) => idx === i ? g : v))

  const points = (g: string) => UCAS_POINTS[g] || 0
  // Best three grades, the usual basis for offers
  const best3 = [...grades].sort((a, b) => points(b) - points(a)).slice(0, 3)
  const best3Points = best3.reduce((s, g) => s + points(g), 0)
  // Every grade entered, for offers made in tariff points
  const totalPoints = grades.reduce((s, g) => s + points(g), 0)
  const hasThree = grades.length >= 3
  const uniLevel = hasThree ? offerBand(best3Points) : 'Add at least three A-levels to compare with typical offers'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h3 className="text-sm font-semibold">A-Level Grades</h3><button onClick={addGrade} className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium">+ Add</button></div>
      <div className="flex flex-wrap gap-2">
        {grades.map((g, i) => (
          <div key={i} className="flex items-center gap-1">
            <select value={g} onChange={(e) => updateGrade(i, e.target.value)} aria-label={`A-level ${i + 1} grade`} className="rounded-lg border border-input bg-background px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-ring">
              {Object.entries(UCAS_POINTS).map(([gr, pts]) => <option key={gr} value={gr}>{gr} ({pts} pts)</option>)}
            </select>
            <button onClick={() => removeGrade(i)} aria-label={`Remove A-level ${i + 1}`} className="px-1.5 py-2 rounded-lg bg-muted hover:bg-destructive/10 text-xs">x</button>
          </div>
        ))}
      </div>

      <div className="space-y-4 animate-fade-in-up" aria-live="polite">
        <div className="rounded-2xl bg-primary/10 p-6 text-center">
          <p className="text-sm text-muted-foreground">{hasThree ? 'Best three grades' : 'Grades entered'}</p>
          {best3.length > 0 && <p className="text-4xl font-bold text-primary mt-1">{best3.join('')}</p>}
          <p className="text-lg font-semibold mt-1">{best3Points} UCAS points</p>
          <p className="text-sm text-muted-foreground mt-1">{uniLevel}</p>
        </div>
        {grades.length > 3 && (
          <div className="rounded-xl bg-muted/50 p-4 text-center text-sm">
            <p className="text-muted-foreground">All {grades.length} A-levels together</p>
            <p className="text-xl font-bold">{totalPoints} UCAS points</p>
            <p className="text-xs text-muted-foreground mt-1">Relevant only where an offer is made in tariff points and counts every A-level; grade offers such as ABB look at your best three.</p>
          </div>
        )}
        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">UCAS points: </p>
          <div className="flex flex-wrap gap-3 mt-1">{Object.entries(UCAS_POINTS).map(([g, p]) => <span key={g} className="px-2 py-1 rounded bg-muted text-xs">{g} = {p}</span>)}</div>
          <p className="mt-2">Russell Group courses typically ask for AAA to ABB (144 to 128 points from three A-levels). Check individual course requirements.</p>
        </div>
      </div>
    </div>
  )
}
