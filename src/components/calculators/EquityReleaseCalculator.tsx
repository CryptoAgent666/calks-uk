import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(propertyValue: number, age: number, mortgageOutstanding: number, interestRate: number) {
  // Max LTV increases with age (approximate lifetime mortgage LTV)
  const maxLtvByAge: Record<number, number> = { 55: 20, 60: 25, 65: 30, 70: 35, 75: 43, 80: 50, 85: 55 }
  const ages = Object.keys(maxLtvByAge).map(Number).sort((a, b) => a - b)
  let maxLtv = 20
  for (const a of ages) { if (age >= a) maxLtv = maxLtvByAge[a] }

  const maxRelease = propertyValue * (maxLtv / 100) - mortgageOutstanding
  const actualRelease = Math.max(0, maxRelease)

  // Compound interest projection
  const projections: { year: number; owed: number; equity: number; propertyVal: number }[] = []
  let owed = actualRelease + mortgageOutstanding
  let propVal = propertyValue
  for (let y = 1; y <= 25; y++) {
    owed *= (1 + interestRate / 100)
    propVal *= 1.03 // assume 3% house price growth
    projections.push({ year: y, owed, equity: propVal - owed, propertyVal: propVal })
  }

  return { maxLtv, maxRelease: actualRelease, projections: projections.filter((_, i) => i % 5 === 4 || i === 0), totalOwed10yr: projections[9]?.owed || 0, equity10yr: projections[9]?.equity || 0 }
}

export default function EquityReleaseCalculator() {
  const [value, setValue] = useState('300000')
  const [age, setAge] = useState('70')
  const [mortgage, setMortgage] = useState('0')
  const [rate, setRate] = useState('6.5')

  const v = parseFloat(value.replace(/,/g, '')) || 0
  const a = parseInt(age) || 70
  const m = parseFloat(mortgage.replace(/,/g, '')) || 0
  const r = parseFloat(rate) || 0
  const result = useMemo(() => calculate(v, a, m, r), [v, a, m, r])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Property Value</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={value} onChange={(e) => setValue(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Property Value" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Your Age</label><input type="number" min="55" max="90" value={age} onChange={(e) => setAge(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Your Age" /></div>
        <div><label className="block text-sm font-medium mb-2">Outstanding Mortgage</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={mortgage} onChange={(e) => setMortgage(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Outstanding Mortgage" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Interest Rate (%)</label><input type="number" min="3" max="10" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Interest Rate (%)" /></div>
      </div>

      {v > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Maximum Tax-Free Release</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.maxRelease)}</p>
            <p className="text-sm text-muted-foreground mt-1">Up to {result.maxLtv}% LTV at age {a}</p>
          </div>
          {result.projections.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border"><th className="text-left py-2 font-medium text-muted-foreground">Year</th><th className="text-right py-2 font-medium text-muted-foreground">Amount Owed</th><th className="text-right py-2 font-medium text-muted-foreground">Property Value</th><th className="text-right py-2 font-medium text-muted-foreground">Remaining Equity</th></tr></thead>
                <tbody>{result.projections.map(p => (
                  <tr key={p.year} className="border-b border-border/50"><td className="py-2">{p.year}</td><td className="text-right tabular-nums text-destructive">{formatCurrency(p.owed)}</td><td className="text-right tabular-nums">{formatCurrency(p.propertyVal)}</td><td className={`text-right tabular-nums font-medium ${p.equity > 0 ? 'text-green-600' : 'text-destructive'}`}>{formatCurrency(p.equity)}</td></tr>
                ))}</tbody>
              </table>
            </div>
          )}
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>Equity release is a lifetime mortgage. Interest rolls up, so the amount owed grows over time. Always seek independent financial advice. Assumes 3% annual house price growth.</p>
          </div>
        </div>
      )}
    </div>
  )
}
