import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent } from '@/utils'

function calculate(pots: { value: number; fee: number }[], newFee: number, years: number, growth: number) {
  const totalValue = pots.reduce((s, p) => s + p.value, 0)
  const weightedOldFee = totalValue > 0 ? pots.reduce((s, p) => s + p.value * p.fee, 0) / totalValue : 0

  // Project with old fees (separate pots)
  let oldTotal = 0
  pots.forEach(p => {
    let v = p.value
    for (let y = 0; y < years; y++) v *= (1 + (growth - p.fee) / 100)
    oldTotal += v
  })

  // Project consolidated
  let newTotal = totalValue
  for (let y = 0; y < years; y++) newTotal *= (1 + (growth - newFee) / 100)

  const saving = newTotal - oldTotal
  const feeSaving = (weightedOldFee - newFee) * totalValue / 100

  return { totalValue, weightedOldFee, oldTotal, newTotal, saving, feeSaving, numPots: pots.length }
}

export default function PensionConsolidationCalculator() {
  const [pots, setPots] = useState([
    { value: 15000, fee: 1.5 }, { value: 8000, fee: 1.2 }, { value: 5000, fee: 0.8 },
  ])
  const [newFee, setNewFee] = useState('0.5')
  const [years, setYears] = useState('20')
  const [growth, setGrowth] = useState('5')

  const nf = parseFloat(newFee) || 0
  const y = parseInt(years) || 20
  const g = parseFloat(growth) || 5

  const addPot = () => setPots([...pots, { value: 0, fee: 1.0 }])
  const removePot = (i: number) => setPots(pots.filter((_, idx) => idx !== i))
  const updatePot = (i: number, field: 'value' | 'fee', val: number) => setPots(pots.map((p, idx) => idx === i ? { ...p, [field]: val } : p))

  const result = useMemo(() => calculate(pots.filter(p => p.value > 0), nf, y, g), [pots, nf, y, g])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h3 className="text-sm font-semibold">Your Pension Pots</h3><button onClick={addPot} className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium">+ Add Pot</button></div>
      <div className="space-y-2">
        {pots.map((p, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="relative flex-1"><span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">£</span><input type="number" min="0" value={p.value || ''} onChange={(e) => updatePot(i, 'value', parseFloat(e.target.value) || 0)} placeholder="Value" className="w-full rounded-lg border border-input bg-background pl-6 pr-2 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
            <div className="flex items-center gap-1"><input type="number" min="0" max="3" step="0.1" value={p.fee} onChange={(e) => updatePot(i, 'fee', parseFloat(e.target.value) || 0)} className="w-16 rounded-lg border border-input bg-background px-2 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-ring" /><span className="text-xs text-muted-foreground">%</span></div>
            <button onClick={() => removePot(i)} className="px-2 py-2 rounded-lg bg-muted hover:bg-destructive/10 text-sm">x</button>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">New Provider Fee (%)</label><input type="number" min="0" max="2" step="0.05" value={newFee} onChange={(e) => setNewFee(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="New Provider Fee (%)" /></div>
        <div><label className="block text-sm font-medium mb-2">Years to Retirement</label><input type="number" min="1" max="40" value={years} onChange={(e) => setYears(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Years to Retirement" /></div>
        <div><label className="block text-sm font-medium mb-2">Expected Growth (%)</label><input type="number" min="0" max="10" step="0.5" value={growth} onChange={(e) => setGrowth(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Expected Growth (%)" /></div>
      </div>

      {result.totalValue > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className={`rounded-2xl p-6 text-center ${result.saving > 0 ? 'bg-green-100 dark:bg-green-950' : 'bg-muted/50'}`}>
            <p className="text-sm text-muted-foreground">{result.saving > 0 ? 'Consolidation Saves You' : 'No saving from consolidation'}</p>
            <p className={`text-3xl font-bold mt-1 ${result.saving > 0 ? 'text-green-700 dark:text-green-400' : ''}`}>{formatCurrency(Math.abs(result.saving))}</p>
            <p className="text-sm text-muted-foreground mt-1">over {y} years ({result.numPots} pots → 1)</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Keep Separate ({formatPercent(result.weightedOldFee)} avg fee)</p><p className="text-lg font-bold">{formatCurrency(result.oldTotal)}</p></div>
            <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Consolidate ({nf}% fee)</p><p className="text-lg font-bold text-primary">{formatCurrency(result.newTotal)}</p></div>
          </div>
        </div>
      )}
    </div>
  )
}
