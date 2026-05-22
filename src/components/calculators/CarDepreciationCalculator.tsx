import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(purchasePrice: number, currentAge: number, yearsToProject: number) {
  // Average UK car depreciation curve
  const depRates = [0.20, 0.15, 0.12, 0.10, 0.09, 0.08, 0.07, 0.06, 0.05, 0.05]

  const schedule: { year: number; age: number; value: number; depreciation: number; totalLost: number }[] = []
  let value = purchasePrice

  // Calculate value at current age
  for (let y = 0; y < currentAge; y++) {
    const rate = y < depRates.length ? depRates[y] : 0.04
    value *= (1 - rate)
  }
  const currentValue = value

  // Project forward
  for (let y = 1; y <= yearsToProject; y++) {
    const age = currentAge + y
    const rate = age - 1 < depRates.length ? depRates[age - 1] : 0.04
    const dep = value * rate
    value -= dep
    schedule.push({ year: y, age, value, depreciation: dep, totalLost: purchasePrice - value })
  }

  return { currentValue, schedule, totalDepreciation: purchasePrice - (schedule[schedule.length - 1]?.value || currentValue) }
}

export default function CarDepreciationCalculator() {
  const [price, setPrice] = useState('25000')
  const [age, setAge] = useState('0')
  const [project, setProject] = useState('5')

  const p = parseFloat(price.replace(/,/g,'')) || 0
  const a = parseInt(age) || 0
  const pr = parseInt(project) || 5
  const result = useMemo(() => calculate(p, a, pr), [p, a, pr])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Purchase Price (new)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Purchase Price (new)" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Current Age (years)</label><input type="number" min="0" max="20" value={age} onChange={(e) => setAge(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Current Age (years)" /></div>
        <div><label className="block text-sm font-medium mb-2">Project Forward (years)</label><input type="number" min="1" max="15" value={project} onChange={(e) => setProject(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Project Forward (years)" /></div>
      </div>

      {p > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Current Value</p><p className="text-xl font-bold text-primary">{formatCurrency(result.currentValue)}</p></div>
            <div className="rounded-xl bg-destructive/10 p-4 text-center"><p className="text-xs text-muted-foreground">Total Depreciation</p><p className="text-xl font-bold text-destructive">{formatCurrency(result.totalDepreciation)}</p></div>
          </div>
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border"><th className="text-left py-2 font-medium text-muted-foreground">Age</th><th className="text-right py-2 font-medium text-muted-foreground">Value</th><th className="text-right py-2 font-medium text-muted-foreground">Year's Loss</th><th className="text-right py-2 font-medium text-muted-foreground">Total Lost</th></tr></thead>
            <tbody>
              <tr className="border-b border-border/50"><td className="py-2">{a} (now)</td><td className="text-right tabular-nums font-medium">{formatCurrency(result.currentValue)}</td><td></td><td className="text-right tabular-nums text-destructive">{formatCurrency(p - result.currentValue)}</td></tr>
              {result.schedule.map(r => (
                <tr key={r.year} className="border-b border-border/50"><td className="py-2">{r.age}</td><td className="text-right tabular-nums font-medium">{formatCurrency(r.value)}</td><td className="text-right tabular-nums text-destructive">{formatCurrency(r.depreciation)}</td><td className="text-right tabular-nums text-destructive">{formatCurrency(r.totalLost)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
