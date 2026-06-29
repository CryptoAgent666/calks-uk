import { useState, useMemo } from 'react'

const A_LEVEL_POINTS: Record<string, number> = { 'A*': 56, 'A': 48, 'B': 40, 'C': 32, 'D': 24, 'E': 16 }
const BTEC_POINTS: Record<string, number> = { 'D*D*D*': 168, 'D*D*D': 160, 'D*DD': 152, 'DDD': 144, 'DDM': 128, 'DMM': 112, 'MMM': 96, 'MMP': 80, 'MPP': 64, 'PPP': 48 }
const AS_LEVEL_POINTS: Record<string, number> = { 'A': 20, 'B': 16, 'C': 12, 'D': 10, 'E': 6 }
const EPQ_POINTS: Record<string, number> = { 'A*': 28, 'A': 24, 'B': 20, 'C': 16, 'D': 12, 'E': 8 }

export default function UcasPointsCalculator() {
  const [aLevels, setALevels] = useState<string[]>(['A', 'B', 'B'])
  const [asLevels, setAsLevels] = useState<string[]>([])
  const [epq, setEpq] = useState('')
  const [btec, setBtec] = useState('')

  const total = useMemo(() => {
    let points = 0
    aLevels.forEach(g => { points += A_LEVEL_POINTS[g] || 0 })
    asLevels.forEach(g => { points += AS_LEVEL_POINTS[g] || 0 })
    if (epq) points += EPQ_POINTS[epq] || 0
    if (btec) points += BTEC_POINTS[btec] || 0
    return points
  }, [aLevels, asLevels, epq, btec])

  const addALevel = () => setALevels(prev => [...prev, 'C'])
  const removeALevel = (i: number) => setALevels(prev => prev.filter((_, idx) => idx !== i))
  const updateALevel = (i: number, grade: string) => setALevels(prev => prev.map((g, idx) => idx === i ? grade : g))

  const addASLevel = () => setAsLevels(prev => [...prev, 'C'])
  const removeASLevel = (i: number) => setAsLevels(prev => prev.filter((_, idx) => idx !== i))

  return (
    <div className="space-y-6">
      {/* A-Levels */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">A-Levels</h3>
          <button onClick={addALevel} className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">+ Add A-Level</button>
        </div>
        <div className="space-y-2">
          {aLevels.map((grade, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground w-20">A-Level {i + 1}</span>
              <select value={grade} onChange={(e) => updateALevel(i, e.target.value)} className="flex-1 rounded-lg border border-input bg-background px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-ring">
                {Object.entries(A_LEVEL_POINTS).map(([g, p]) => <option key={g} value={g}>{g} ({p} points)</option>)}
              </select>
              <button onClick={() => removeALevel(i)} className="px-2 py-2 rounded-lg bg-muted hover:bg-destructive/10 text-sm">x</button>
            </div>
          ))}
        </div>
      </div>

      {/* AS-Levels */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">AS-Levels (optional)</h3>
          <button onClick={addASLevel} className="px-3 py-1.5 rounded-lg bg-muted text-sm font-medium hover:bg-accent transition-colors">+ Add AS-Level</button>
        </div>
        {asLevels.map((grade, i) => (
          <div key={i} className="flex items-center gap-2 mb-2">
            <span className="text-sm text-muted-foreground w-20">AS {i + 1}</span>
            <select value={grade} onChange={(e) => setAsLevels(prev => prev.map((g, idx) => idx === i ? e.target.value : g))} className="flex-1 rounded-lg border border-input bg-background px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-ring">
              {Object.entries(AS_LEVEL_POINTS).map(([g, p]) => <option key={g} value={g}>{g} ({p} points)</option>)}
            </select>
            <button onClick={() => removeASLevel(i)} className="px-2 py-2 rounded-lg bg-muted hover:bg-destructive/10 text-sm">x</button>
          </div>
        ))}
      </div>

      {/* EPQ */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">EPQ (optional)</label>
          <select value={epq} onChange={(e) => setEpq(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="EPQ (optional)">
            <option value="">None</option>
            {Object.entries(EPQ_POINTS).map(([g, p]) => <option key={g} value={g}>{g} ({p} points)</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">BTEC Extended Diploma (optional)</label>
          <select value={btec} onChange={(e) => setBtec(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="BTEC Extended Diploma (optional)">
            <option value="">None</option>
            {Object.entries(BTEC_POINTS).map(([g, p]) => <option key={g} value={g}>{g} ({p} points)</option>)}
          </select>
        </div>
      </div>

      {/* Total */}
      <div className="rounded-2xl bg-primary/10 p-6 text-center animate-fade-in-up">
        <p className="text-sm text-muted-foreground">Total UCAS Tariff Points</p>
        <p className="text-4xl font-bold text-primary mt-1">{total}</p>
        <p className="text-sm text-muted-foreground mt-2">
          {total >= 144 ? 'Competitive for top universities' : total >= 112 ? 'Good range of university options' : total >= 80 ? 'Many universities accept this' : 'Consider additional qualifications'}
        </p>
      </div>
    </div>
  )
}
