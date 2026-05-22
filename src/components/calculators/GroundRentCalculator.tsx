import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(currentRent: number, escalation: string, escalationRate: number, yearsRemaining: number) {
  const schedule: { year: number; rent: number; cumulative: number }[] = []
  let rent = currentRent
  let cumulative = 0

  for (let y = 1; y <= Math.min(yearsRemaining, 30); y++) {
    cumulative += rent
    if (y % 5 === 0 || y === 1 || y === yearsRemaining) {
      schedule.push({ year: y, rent, cumulative })
    }
    if (escalation === 'fixed') { /* no change */ }
    else if (escalation === 'rpi') rent *= (1 + escalationRate / 100)
    else if (escalation === 'doubling' && y % 10 === 0) rent *= 2
    else if (escalation === 'percentage') rent *= (1 + escalationRate / 100)
  }

  const totalOver25 = schedule.find(s => s.year >= 25)?.cumulative || cumulative
  const isOnerous = currentRent > 250 || (escalation === 'doubling')

  return { schedule, totalOver25, isOnerous, currentRent }
}

export default function GroundRentCalculator() {
  const [rent, setRent] = useState('300')
  const [escalation, setEscalation] = useState('fixed')
  const [rate, setRate] = useState('3')
  const [years, setYears] = useState('80')

  const r = parseFloat(rent) || 0
  const rt = parseFloat(rate) || 0
  const y = parseInt(years) || 80
  const result = useMemo(() => calculate(r, escalation, rt, y), [r, escalation, rt, y])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Annual Ground Rent</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" value={rent} onChange={(e) => setRent(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Annual Ground Rent" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Escalation</label><select value={escalation} onChange={(e) => setEscalation(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Escalation"><option value="fixed">Fixed (no increase)</option><option value="rpi">RPI-linked</option><option value="percentage">Fixed % increase/year</option><option value="doubling">Doubling every 10 years</option></select></div>
        {(escalation === 'rpi' || escalation === 'percentage') && <div><label className="block text-sm font-medium mb-2">Annual Increase (%)</label><input type="number" min="0" max="10" step="0.5" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Annual Increase (%)" /></div>}
        <div><label className="block text-sm font-medium mb-2">Years Remaining</label><input type="number" min="1" max="999" value={years} onChange={(e) => setYears(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Years Remaining" /></div>
      </div>
      {result.isOnerous && <div className="rounded-xl bg-orange-100 dark:bg-orange-950 p-3 text-center text-sm text-orange-800 dark:text-orange-300">Warning: This may be considered an onerous ground rent. The Leasehold Reform Act 2022 caps new lease ground rent at a peppercorn (zero).</div>}
      {result.schedule.length > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-destructive/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Total Ground Rent (25 years)</p>
            <p className="text-3xl font-bold text-destructive mt-1">{formatCurrency(result.totalOver25)}</p>
          </div>
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border"><th className="text-left py-2 font-medium text-muted-foreground">Year</th><th className="text-right py-2 font-medium text-muted-foreground">Annual Rent</th><th className="text-right py-2 font-medium text-muted-foreground">Cumulative</th></tr></thead>
            <tbody>{result.schedule.map(s => (
              <tr key={s.year} className="border-b border-border/50"><td className="py-1.5">{s.year}</td><td className="text-right tabular-nums">{formatCurrency(s.rent)}</td><td className="text-right tabular-nums">{formatCurrency(s.cumulative)}</td></tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  )
}
