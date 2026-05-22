import { useState, useMemo } from 'react'

function calculate(floorHeight: number, riserHeight: number, goingDepth: number) {
  const risers = Math.ceil((floorHeight * 1000) / riserHeight) // height in mm
  const treads = risers - 1
  const totalGoing = (treads * goingDepth) / 1000 // in metres
  const actualRiser = (floorHeight * 1000) / risers
  const pitch = Math.atan(actualRiser / goingDepth) * (180 / Math.PI)
  const stringerLength = Math.sqrt(Math.pow(floorHeight, 2) + Math.pow(totalGoing, 2))

  // Building regs: riser 150-220mm, going 220-300mm, pitch max 42°
  const riserOk = actualRiser >= 150 && actualRiser <= 220
  const goingOk = goingDepth >= 220 && goingDepth <= 300
  const pitchOk = pitch <= 42
  const twiceRiserPlusGoing = 2 * actualRiser + goingDepth // should be 550-700mm

  return { risers, treads, totalGoing, actualRiser, pitch, stringerLength, riserOk, goingOk, pitchOk, twiceRiserPlusGoing, compliant: riserOk && goingOk && pitchOk }
}

export default function StaircaseCalculator() {
  const [height, setHeight] = useState('2.6')
  const [riser, setRiser] = useState('190')
  const [going, setGoing] = useState('250')

  const h = parseFloat(height) || 0
  const r = parseFloat(riser) || 190
  const g = parseFloat(going) || 250
  const result = useMemo(() => calculate(h, r, g), [h, r, g])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Floor-to-Floor Height (m)</label><input type="number" min="1" max="5" step="0.01" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Floor-to-Floor Height (m)" /></div>
        <div><label className="block text-sm font-medium mb-2">Riser Height (mm)</label><input type="number" min="100" max="250" value={riser} onChange={(e) => setRiser(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Riser Height (mm)" /><p className="text-xs text-muted-foreground mt-1">Regs: 150-220mm</p></div>
        <div><label className="block text-sm font-medium mb-2">Going Depth (mm)</label><input type="number" min="150" max="400" value={going} onChange={(e) => setGoing(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Going Depth (mm)" /><p className="text-xs text-muted-foreground mt-1">Regs: 220-300mm</p></div>
      </div>

      {h > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className={`rounded-xl p-3 text-center text-sm font-medium ${result.compliant ? 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400' : 'bg-destructive/10 text-destructive'}`}>
            {result.compliant ? 'Compliant with Building Regulations (Part K)' : 'Does NOT comply with Building Regulations'}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Risers</p><p className="text-xl font-bold text-primary">{result.risers}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Treads</p><p className="text-xl font-bold">{result.treads}</p></div>
            <div className={`rounded-xl p-4 text-center ${result.pitchOk ? 'bg-muted/50' : 'bg-destructive/10'}`}><p className="text-xs text-muted-foreground">Pitch</p><p className={`text-lg font-bold ${result.pitchOk ? '' : 'text-destructive'}`}>{result.pitch.toFixed(1)}°</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Total Going</p><p className="text-lg font-bold">{result.totalGoing.toFixed(2)}m</p></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border p-3 text-center"><p className="text-xs text-muted-foreground">Actual Riser</p><p className={`text-lg font-bold ${result.riserOk ? '' : 'text-destructive'}`}>{result.actualRiser.toFixed(1)}mm</p></div>
            <div className="rounded-xl border border-border p-3 text-center"><p className="text-xs text-muted-foreground">Stringer Length</p><p className="text-lg font-bold">{result.stringerLength.toFixed(2)}m</p></div>
          </div>

          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Building Regs (Part K, England):</p>
            <p>Riser: 150-220mm | Going: 220-300mm | Max pitch: 42° | 2R+G: 550-700mm (yours: {result.twiceRiserPlusGoing.toFixed(0)}mm)</p>
          </div>
        </div>
      )}
    </div>
  )
}
