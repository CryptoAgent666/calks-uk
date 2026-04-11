import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

type Method = 'straight' | 'reducing'

function calculate(cost: number, salvage: number, years: number, method: Method) {
  if (years <= 0 || cost <= 0) return null
  const schedule: { year: number; depreciation: number; bookValue: number }[] = []

  if (method === 'straight') {
    const annual = (cost - salvage) / years
    let bv = cost
    for (let y = 1; y <= years; y++) {
      bv -= annual
      schedule.push({ year: y, depreciation: annual, bookValue: Math.max(bv, salvage) })
    }
    return { annualDepreciation: annual, schedule, method }
  }

  // Reducing balance
  const rate = 1 - Math.pow(salvage / cost, 1 / years)
  let bv = cost
  for (let y = 1; y <= years; y++) {
    const dep = bv * rate
    bv -= dep
    schedule.push({ year: y, depreciation: dep, bookValue: Math.max(bv, salvage) })
  }
  return { rate: rate * 100, schedule, method }
}

export default function DepreciationCalculator() {
  const [cost, setCost] = useState('10000')
  const [salvage, setSalvage] = useState('1000')
  const [years, setYears] = useState('5')
  const [method, setMethod] = useState<Method>('straight')

  const c = parseFloat(cost.replace(/,/g,'')) || 0
  const s = parseFloat(salvage.replace(/,/g,'')) || 0
  const y = parseInt(years) || 0
  const result = useMemo(() => calculate(c, s > 0 ? s : 1, y, method), [c, s, y, method])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-2">
        {([{v:'straight' as Method,l:'Straight Line'},{v:'reducing' as Method,l:'Reducing Balance'}]).map(o => (
          <button key={o.v} onClick={() => setMethod(o.v)} className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${method === o.v ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>{o.l}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Asset Cost</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={cost} onChange={(e) => setCost(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Salvage Value</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={salvage} onChange={(e) => setSalvage(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Useful Life (years)</label><input type="number" min="1" max="50" value={years} onChange={(e) => setYears(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
      </div>

      {result && result.schedule.length > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-xl bg-primary/10 p-4 text-center">
            {result.method === 'straight' && 'annualDepreciation' in result && <><p className="text-sm text-muted-foreground">Annual Depreciation</p><p className="text-2xl font-bold text-primary">{formatCurrency(result.annualDepreciation)}</p></>}
            {result.method === 'reducing' && 'rate' in result && <><p className="text-sm text-muted-foreground">Depreciation Rate</p><p className="text-2xl font-bold text-primary">{result.rate.toFixed(1)}% per year</p></>}
          </div>
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border"><th className="text-left py-2 font-medium text-muted-foreground">Year</th><th className="text-right py-2 font-medium text-muted-foreground">Depreciation</th><th className="text-right py-2 font-medium text-muted-foreground">Book Value</th></tr></thead>
            <tbody>
              <tr className="border-b border-border/50"><td className="py-2">0</td><td className="text-right">—</td><td className="text-right tabular-nums font-medium">{formatCurrency(c)}</td></tr>
              {result.schedule.map(r => (
                <tr key={r.year} className="border-b border-border/50"><td className="py-2">{r.year}</td><td className="text-right tabular-nums text-destructive">{formatCurrency(r.depreciation)}</td><td className="text-right tabular-nums font-medium">{formatCurrency(r.bookValue)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
