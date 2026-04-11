import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent } from '@/utils'

function calculate(propertyValue: number, mortgageAmount: number) {
  const equity = propertyValue - mortgageAmount
  const ltv = propertyValue > 0 ? (mortgageAmount / propertyValue) * 100 : 0
  const equityPct = 100 - ltv

  let rateImpact: string
  if (ltv <= 60) rateImpact = 'Best mortgage rates available'
  else if (ltv <= 75) rateImpact = 'Very competitive rates'
  else if (ltv <= 80) rateImpact = 'Good range of products'
  else if (ltv <= 85) rateImpact = 'Standard rates, fewer options'
  else if (ltv <= 90) rateImpact = 'Higher rates, limited options'
  else if (ltv <= 95) rateImpact = 'Highest rates, few lenders'
  else rateImpact = 'Very few lenders offer above 95% LTV'

  return { ltv, equity, equityPct, rateImpact }
}

export default function LTVCalculator() {
  const [value, setValue] = useState('')
  const [mortgage, setMortgage] = useState('')

  const v = parseFloat(value.replace(/,/g,'')) || 0
  const m = parseFloat(mortgage.replace(/,/g,'')) || 0
  const result = useMemo(() => calculate(v, m), [v, m])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Property Value</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={value} onChange={(e) => setValue(e.target.value)} placeholder="300,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Mortgage Amount</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={mortgage} onChange={(e) => setMortgage(e.target.value)} placeholder="240,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
      </div>

      {v > 0 && m > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Loan-to-Value Ratio</p>
            <p className="text-4xl font-bold text-primary mt-1">{formatPercent(result.ltv)}</p>
            <p className="text-sm text-muted-foreground mt-1">{result.rateImpact}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center"><p className="text-xs text-muted-foreground">Equity</p><p className="text-xl font-bold text-green-700 dark:text-green-400">{formatCurrency(result.equity)}</p><p className="text-xs text-muted-foreground">{formatPercent(result.equityPct)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Mortgage</p><p className="text-xl font-bold">{formatCurrency(m)}</p><p className="text-xs text-muted-foreground">{formatPercent(result.ltv)}</p></div>
          </div>
          <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
            <div className="bg-primary h-4 rounded-full transition-all" style={{ width: `${Math.min(result.ltv, 100)}%` }} />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground"><span>0% LTV</span><span>60%</span><span>75%</span><span>90%</span><span>100%</span></div>
        </div>
      )}
    </div>
  )
}
