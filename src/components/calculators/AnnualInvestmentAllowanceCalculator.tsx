import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

const AIA_LIMIT = 1_000_000

function calculate(spending: number, corpTaxRate: number) {
  const aiaClaimable = Math.min(spending, AIA_LIMIT)
  const remainder = Math.max(0, spending - AIA_LIMIT)
  const wdaOnRemainder = remainder * 0.18 // main pool WDA

  const totalRelief = aiaClaimable + wdaOnRemainder
  const taxSaving = totalRelief * (corpTaxRate / 100)
  const effectiveDiscount = spending > 0 ? (taxSaving / spending) * 100 : 0

  return { aiaClaimable, remainder, wdaOnRemainder, totalRelief, taxSaving, effectiveDiscount }
}

export default function AnnualInvestmentAllowanceCalculator() {
  const [spending, setSpending] = useState('50000')
  const [taxRate, setTaxRate] = useState('19')

  const s = parseFloat(spending.replace(/,/g,'')) || 0
  const t = parseFloat(taxRate) || 19
  const result = useMemo(() => calculate(s, t), [s, t])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Capital Spending (plant & machinery)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={spending} onChange={(e) => setSpending(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Capital Spending (plant & machinery)" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Corporation Tax Rate</label><select value={taxRate} onChange={(e) => setTaxRate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Corporation Tax Rate"><option value="19">19% (small profits)</option><option value="25">25% (main rate)</option><option value="26.5">26.5% (marginal)</option></select></div>
      </div>

      {s > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-green-100 dark:bg-green-950 p-6 text-center">
            <p className="text-sm text-muted-foreground">Tax Saving (year 1)</p>
            <p className="text-3xl font-bold text-green-700 dark:text-green-400 mt-1">{formatCurrency(result.taxSaving)}</p>
            <p className="text-sm text-muted-foreground mt-1">Effective discount: {result.effectiveDiscount.toFixed(0)}% off purchase price</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">AIA Claimed (100%)</p><p className="text-lg font-bold">{formatCurrency(result.aiaClaimable)}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">WDA (18%)</p><p className="text-lg font-bold">{formatCurrency(result.wdaOnRemainder)}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Total Relief</p><p className="text-lg font-bold">{formatCurrency(result.totalRelief)}</p></div>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>AIA gives 100% tax relief on the first £{AIA_LIMIT.toLocaleString()} of qualifying plant & machinery spending per year. Available to all businesses (sole traders and companies). Spending above £1M gets 18% WDA or Full Expensing (companies only).</p>
          </div>
        </div>
      )}
    </div>
  )
}
