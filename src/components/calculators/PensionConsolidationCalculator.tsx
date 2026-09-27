import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent } from '@/utils'

type Pot = { value: number; fee: number; exit: number }

// Each year a pot grows by (growth − annual charge)%, i.e. the charge is taken off the
// return. Any exit charge is deducted once from the value transferred into the new pot.
function calculate(pots: Pot[], newFee: number, years: number, growth: number) {
  const totalValue = pots.reduce((s, p) => s + p.value, 0)
  const weightedOldFee = totalValue > 0 ? pots.reduce((s, p) => s + p.value * p.fee, 0) / totalValue : 0

  // Project with old fees (separate pots, no exit charges)
  let oldTotal = 0
  pots.forEach(p => {
    let v = p.value
    for (let y = 0; y < years; y++) v *= (1 + (growth - p.fee) / 100)
    oldTotal += v
  })

  // Project consolidated, after exit charges on the way out
  const exitCharges = pots.reduce((s, p) => s + p.value * (p.exit || 0) / 100, 0)
  const transferValue = totalValue - exitCharges
  let newTotal = transferValue
  for (let y = 0; y < years; y++) newTotal *= (1 + (growth - newFee) / 100)

  const saving = newTotal - oldTotal
  const feeSaving = (weightedOldFee - newFee) * totalValue / 100

  return { totalValue, weightedOldFee, exitCharges, transferValue, oldTotal, newTotal, saving, feeSaving, numPots: pots.length }
}

export default function PensionConsolidationCalculator() {
  const [pots, setPots] = useState<Pot[]>([
    { value: 15000, fee: 1.5, exit: 0 }, { value: 8000, fee: 1.2, exit: 0 }, { value: 5000, fee: 0.8, exit: 0 },
  ])
  const [newFee, setNewFee] = useState('0.5')
  const [years, setYears] = useState('20')
  const [growth, setGrowth] = useState('5')

  const nf = parseFloat(newFee) || 0
  const y = parseInt(years) || 20
  const g = parseFloat(growth) || 5

  const addPot = () => setPots([...pots, { value: 0, fee: 1.0, exit: 0 }])
  const removePot = (i: number) => setPots(pots.filter((_, idx) => idx !== i))
  const updatePot = (i: number, field: keyof Pot, val: number) => setPots(pots.map((p, idx) => idx === i ? { ...p, [field]: val } : p))

  const result = useMemo(() => calculate(pots.filter(p => p.value > 0), nf, y, g), [pots, nf, y, g])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h3 className="text-sm font-semibold">Your Pension Pots</h3><button onClick={addPot} className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium">+ Add Pot</button></div>
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground"><span className="flex-1">Pot value</span><span className="w-20 text-center">Annual fee</span><span className="w-20 text-center">Exit charge</span><span className="w-8" /></div>
        {pots.map((p, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="relative flex-1"><span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">£</span><input type="text" inputMode="numeric" value={p.value || ''} onChange={(e) => updatePot(i, 'value', parseFloat(e.target.value.replace(/,/g, '')) || 0)} placeholder="Value" className="w-full rounded-lg border border-input bg-background pl-6 pr-2 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label={`Pot ${i + 1} value`} /></div>
            <div className="flex items-center gap-1 w-20"><input type="number" min="0" max="3" step="0.1" value={p.fee} onChange={(e) => updatePot(i, 'fee', parseFloat(e.target.value) || 0)} className="w-14 rounded-lg border border-input bg-background px-2 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-ring" aria-label={`Pot ${i + 1} annual fee (%)`} /><span className="text-xs text-muted-foreground">%</span></div>
            <div className="flex items-center gap-1 w-20"><input type="number" min="0" max="10" step="0.5" value={p.exit} onChange={(e) => updatePot(i, 'exit', parseFloat(e.target.value) || 0)} className="w-14 rounded-lg border border-input bg-background px-2 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-ring" aria-label={`Pot ${i + 1} exit charge (%)`} /><span className="text-xs text-muted-foreground">%</span></div>
            <button onClick={() => removePot(i)} className="w-8 px-2 py-2 rounded-lg bg-muted hover:bg-destructive/10 text-sm" aria-label={`Remove pot ${i + 1}`}>x</button>
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
          {result.exitCharges > 0 && (
            <p className="text-sm text-muted-foreground text-center">Exit charges of {formatCurrency(result.exitCharges)} leave {formatCurrency(result.transferValue)} to transfer.</p>
          )}
          <p className="text-xs text-muted-foreground">Charges are taken off the growth rate each year. The calculator does not value guarantees, so check each pot for safeguarded benefits (defined benefit rights, guaranteed annuity rates, protected tax-free cash) before moving it.</p>
        </div>
      )}
    </div>
  )
}
