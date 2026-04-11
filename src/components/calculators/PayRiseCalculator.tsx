import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent } from '@/utils'

function calculate(currentSalary: number, newSalary: number, inflationRate: number) {
  const increase = newSalary - currentSalary
  const pctIncrease = currentSalary > 0 ? (increase / currentSalary) * 100 : 0
  const realIncrease = pctIncrease - inflationRate
  const realTermsIncrease = currentSalary * (realIncrease / 100)

  const monthlyBefore = currentSalary / 12
  const monthlyAfter = newSalary / 12
  const monthlyIncrease = monthlyAfter - monthlyBefore

  return { increase, pctIncrease, realIncrease, realTermsIncrease, monthlyBefore, monthlyAfter, monthlyIncrease }
}

export default function PayRiseCalculator() {
  const [current, setCurrent] = useState('')
  const [newSal, setNewSal] = useState('')
  const [inflation, setInflation] = useState('3.5')

  const c = parseFloat(current.replace(/,/g,'')) || 0
  const n = parseFloat(newSal.replace(/,/g,'')) || 0
  const i = parseFloat(inflation) || 0
  const result = useMemo(() => calculate(c, n, i), [c, n, i])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Current Salary</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="35,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">New Salary</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={newSal} onChange={(e) => setNewSal(e.target.value)} placeholder="37,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Inflation Rate (%)</label><input type="number" min="0" max="20" step="0.1" value={inflation} onChange={(e) => setInflation(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
      </div>

      {c > 0 && n > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 gap-3">
            <div className={`rounded-xl p-4 text-center ${result.pctIncrease >= 0 ? 'bg-green-100 dark:bg-green-950' : 'bg-destructive/10'}`}>
              <p className="text-xs text-muted-foreground">Pay Rise</p>
              <p className={`text-xl font-bold ${result.pctIncrease >= 0 ? 'text-green-700 dark:text-green-400' : 'text-destructive'}`}>{formatPercent(result.pctIncrease)}</p>
              <p className="text-sm text-muted-foreground">{formatCurrency(result.increase)}/year</p>
            </div>
            <div className={`rounded-xl p-4 text-center ${result.realIncrease >= 0 ? 'bg-primary/10' : 'bg-destructive/10'}`}>
              <p className="text-xs text-muted-foreground">Real Terms (after inflation)</p>
              <p className={`text-xl font-bold ${result.realIncrease >= 0 ? 'text-primary' : 'text-destructive'}`}>{result.realIncrease >= 0 ? '+' : ''}{formatPercent(result.realIncrease)}</p>
              <p className="text-sm text-muted-foreground">{result.realIncrease >= 0 ? 'Real pay rise' : 'Real pay cut'}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-border p-3 text-center"><p className="text-xs text-muted-foreground">Monthly Before</p><p className="text-lg font-bold">{formatCurrency(result.monthlyBefore)}</p></div>
            <div className="rounded-xl border border-border p-3 text-center"><p className="text-xs text-muted-foreground">Monthly After</p><p className="text-lg font-bold">{formatCurrency(result.monthlyAfter)}</p></div>
            <div className="rounded-xl border border-border p-3 text-center"><p className="text-xs text-muted-foreground">Monthly Extra</p><p className={`text-lg font-bold ${result.monthlyIncrease >= 0 ? 'text-green-600' : 'text-destructive'}`}>{formatCurrency(result.monthlyIncrease)}</p></div>
          </div>
        </div>
      )}
    </div>
  )
}
