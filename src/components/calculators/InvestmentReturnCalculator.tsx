import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent } from '@/utils'

function calculate(initial: number, monthly: number, years: number, returnRate: number, inflationRate: number) {
  const monthlyReturn = returnRate / 100 / 12
  const monthlyInflation = inflationRate / 100 / 12
  const months = years * 12

  let nominal = initial
  let real = initial
  let totalContributions = initial

  for (let m = 1; m <= months; m++) {
    nominal = nominal * (1 + monthlyReturn) + monthly
    real = real * (1 + monthlyReturn - monthlyInflation) + monthly
    totalContributions += monthly
  }

  const nominalGain = nominal - totalContributions
  const realGain = real - totalContributions
  const totalReturn = totalContributions > 0 ? ((nominal - totalContributions) / totalContributions) * 100 : 0
  const annualisedReturn = totalContributions > 0 ? (Math.pow(nominal / totalContributions, 1 / years) - 1) * 100 : 0

  return { nominal, real, totalContributions, nominalGain, realGain, totalReturn, annualisedReturn }
}

export default function InvestmentReturnCalculator() {
  const [initial, setInitial] = useState('10000')
  const [monthly, setMonthly] = useState('300')
  const [years, setYears] = useState('10')
  const [returnRate, setReturnRate] = useState('7')
  const [inflation, setInflation] = useState('3')

  const i = parseFloat(initial.replace(/,/g,'')) || 0
  const m = parseFloat(monthly.replace(/,/g,'')) || 0
  const y = parseInt(years) || 0
  const r = parseFloat(returnRate) || 0
  const inf = parseFloat(inflation) || 0
  const result = useMemo(() => calculate(i, m, y, r, inf), [i, m, y, r, inf])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Initial Investment</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={initial} onChange={(e) => setInitial(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Monthly Contribution</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={monthly} onChange={(e) => setMonthly(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Years</label><input type="number" min="1" max="50" value={years} onChange={(e) => setYears(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Expected Return (%)</label><input type="number" min="0" max="20" step="0.5" value={returnRate} onChange={(e) => setReturnRate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Inflation (%)</label><input type="number" min="0" max="10" step="0.5" value={inflation} onChange={(e) => setInflation(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
      </div>

      {y > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-primary/10 p-5 text-center"><p className="text-sm text-muted-foreground">Nominal Value</p><p className="text-2xl font-bold text-primary mt-1">{formatCurrency(result.nominal)}</p><p className="text-xs text-muted-foreground">Growth: {formatCurrency(result.nominalGain)}</p></div>
            <div className="rounded-2xl bg-green-100 dark:bg-green-950 p-5 text-center"><p className="text-sm text-muted-foreground">Real Value (after inflation)</p><p className="text-2xl font-bold text-green-700 dark:text-green-400 mt-1">{formatCurrency(result.real)}</p><p className="text-xs text-muted-foreground">Real growth: {formatCurrency(result.realGain)}</p></div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Total Invested</p><p className="text-lg font-bold">{formatCurrency(result.totalContributions)}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Total Return</p><p className="text-lg font-bold">{formatPercent(result.totalReturn)}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Annualised</p><p className="text-lg font-bold">{formatPercent(result.annualisedReturn)}</p></div>
          </div>
        </div>
      )}
    </div>
  )
}
