import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(monthlyContrib: number, employerContrib: number, currentPot: number, yearsToRetirement: number, growthRate: number, taxBand: string) {
  const taxRate = taxBand === 'higher' ? 0.40 : taxBand === 'additional' ? 0.45 : 0.20
  const grossMonthly = monthlyContrib / (1 - 0.20) // provider adds 20%
  const extraReclaim = taxRate > 0.20 ? monthlyContrib * ((taxRate - 0.20) / (1 - taxRate)) : 0 // extra via self-assessment
  const totalMonthly = grossMonthly + employerContrib
  const monthlyGrowth = growthRate / 100 / 12

  let pot = currentPot
  for (let m = 0; m < yearsToRetirement * 12; m++) {
    pot = pot * (1 + monthlyGrowth) + totalMonthly
  }

  const totalContributed = (monthlyContrib + employerContrib) * yearsToRetirement * 12 + currentPot
  const totalGovtRelief = (grossMonthly - monthlyContrib) * yearsToRetirement * 12 + extraReclaim * yearsToRetirement * 12
  const taxFreeLump = pot * 0.25
  const remainingPot = pot * 0.75
  const drawdownMonthly = remainingPot / (25 * 12) // assume 25 years drawdown

  return { pot, totalContributed, totalGovtRelief, taxFreeLump, remainingPot, drawdownMonthly, grossMonthly, extraReclaim: extraReclaim * 12 }
}

export default function SIPPCalculator() {
  const [monthly, setMonthly] = useState('500')
  const [employer, setEmployer] = useState('0')
  const [current, setCurrent] = useState('20000')
  const [years, setYears] = useState('25')
  const [growth, setGrowth] = useState('5')
  const [band, setBand] = useState('basic')

  const m = parseFloat(monthly.replace(/,/g,'')) || 0
  const e = parseFloat(employer.replace(/,/g,'')) || 0
  const c = parseFloat(current.replace(/,/g,'')) || 0
  const y = parseInt(years) || 0
  const g = parseFloat(growth) || 0
  const result = useMemo(() => calculate(m, e, c, y, g, band), [m, e, c, y, g, band])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Your Monthly (net)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={monthly} onChange={(e) => setMonthly(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Employer Monthly</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={employer} onChange={(e) => setEmployer(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Current SIPP Value</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={current} onChange={(e) => setCurrent(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Years to Retirement</label><input type="number" min="1" max="40" value={years} onChange={(e) => setYears(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Growth (%)</label><input type="number" min="0" max="10" step="0.5" value={growth} onChange={(e) => setGrowth(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Tax Band</label><select value={band} onChange={(e) => setBand(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"><option value="basic">Basic (20%)</option><option value="higher">Higher (40%)</option><option value="additional">Additional (45%)</option></select></div>
      </div>

      {m > 0 && y > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">SIPP Value at Retirement</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.pot)}</p>
            <p className="text-sm text-muted-foreground mt-1">25% tax-free lump sum: {formatCurrency(result.taxFreeLump)}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-3 text-center"><p className="text-xs text-muted-foreground">Govt Tax Relief</p><p className="text-lg font-bold text-green-700 dark:text-green-400">{formatCurrency(result.totalGovtRelief)}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Gross Monthly</p><p className="text-lg font-bold">{formatCurrency(result.grossMonthly)}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Drawdown (~25yr)</p><p className="text-lg font-bold">{formatCurrency(result.drawdownMonthly)}/mo</p></div>
            {result.extraReclaim > 0 && <div className="rounded-xl bg-green-100 dark:bg-green-950 p-3 text-center"><p className="text-xs text-muted-foreground">Extra Reclaim/Year</p><p className="text-lg font-bold text-green-700 dark:text-green-400">{formatCurrency(result.extraReclaim)}</p></div>}
          </div>
        </div>
      )}
    </div>
  )
}
