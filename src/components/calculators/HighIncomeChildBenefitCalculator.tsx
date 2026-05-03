import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent } from '@/utils'

const FIRST_CHILD = 27.05 * 52
const ADDITIONAL_CHILD = 17.90 * 52
const HICBC_START = 60_000
const HICBC_END = 80_000

function calculate(children: number, income: number, claimBenefit: boolean) {
  const totalBenefit = (children >= 1 ? FIRST_CHILD : 0) + Math.max(0, children - 1) * ADDITIONAL_CHILD

  let clawbackPct = 0
  if (income > HICBC_START && income < HICBC_END) {
    clawbackPct = ((income - HICBC_START) / (HICBC_END - HICBC_START)) * 100
  } else if (income >= HICBC_END) {
    clawbackPct = 100
  }

  const clawback = totalBenefit * (clawbackPct / 100)
  const netBenefit = totalBenefit - clawback
  const worthClaiming = netBenefit > 0 || claimBenefit

  // NI credits reason
  const niCreditValue = !claimBenefit && children > 0 ? 'You miss NI credits (state pension qualifying years)' : ''

  return { totalBenefit, clawbackPct, clawback, netBenefit, worthClaiming, niCreditValue }
}

export default function HighIncomeChildBenefitCalculator() {
  const [children, setChildren] = useState('2')
  const [income, setIncome] = useState('70000')

  const c = parseInt(children) || 0
  const i = parseFloat(income.replace(/,/g,'')) || 0
  const result = useMemo(() => calculate(c, i, true), [c, i])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Number of Children</label><input type="number" min="1" max="10" value={children} onChange={(e) => setChildren(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Higher Earner's Adjusted Net Income</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={income} onChange={(e) => setIncome(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
      </div>

      {c > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Full Benefit</p><p className="text-lg font-bold">{formatCurrency(result.totalBenefit)}/yr</p></div>
            <div className={`rounded-xl p-4 text-center ${result.clawback > 0 ? 'bg-destructive/10' : 'bg-green-100 dark:bg-green-950'}`}><p className="text-xs text-muted-foreground">HICBC Clawback</p><p className={`text-lg font-bold ${result.clawback > 0 ? 'text-destructive' : 'text-green-700 dark:text-green-400'}`}>{result.clawback > 0 ? formatCurrency(result.clawback) : 'None'}</p></div>
            <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Net Benefit</p><p className="text-lg font-bold text-primary">{formatCurrency(result.netBenefit)}/yr</p></div>
          </div>

          {result.clawbackPct > 0 && (
            <>
              <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                <div className="bg-destructive h-3 rounded-full transition-all" style={{ width: `${Math.min(result.clawbackPct, 100)}%` }} />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>£{HICBC_START.toLocaleString()} (0%)</span>
                <span>{formatPercent(result.clawbackPct)} clawback</span>
                <span>£{HICBC_END.toLocaleString()} (100%)</span>
              </div>
            </>
          )}

          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Should you still claim?</p>
            <p className="mt-1">Even at 100% clawback, claiming Child Benefit protects your NI record (state pension credits) if you're not working. The non-earning parent should always be the claimant.</p>
            <p className="mt-1">You can opt out of payments while keeping the NI credit by ticking the box on the claim form.</p>
          </div>
        </div>
      )}
    </div>
  )
}
