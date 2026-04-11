import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

const ANNUAL_ALLOWANCE = 60_000
const TAPER_START = 260_000 // adjusted income
const TAPER_END = 360_000
const MIN_ALLOWANCE = 10_000
const MONEY_PURCHASE_AA = 10_000

function calculate(totalIncome: number, pensionContributions: number, isMPAA: boolean) {
  const aa = isMPAA ? MONEY_PURCHASE_AA : calculateAA(totalIncome)
  const used = pensionContributions
  const remaining = Math.max(0, aa - used)
  const exceeded = used > aa
  const excessCharge = exceeded ? (used - aa) : 0

  // Tax on excess at marginal rate
  const marginalRate = totalIncome > 125_140 ? 0.45 : totalIncome > 50_270 ? 0.40 : 0.20
  const taxCharge = excessCharge * marginalRate

  return { aa, used, remaining, exceeded, excessCharge, taxCharge, marginalRate: marginalRate * 100 }
}

function calculateAA(income: number) {
  if (income <= TAPER_START) return ANNUAL_ALLOWANCE
  if (income >= TAPER_END) return MIN_ALLOWANCE
  const reduction = Math.floor((income - TAPER_START) / 2)
  return Math.max(MIN_ALLOWANCE, ANNUAL_ALLOWANCE - reduction)
}

export default function PensionAnnualAllowanceCalculator() {
  const [income, setIncome] = useState('50000')
  const [contributions, setContributions] = useState('20000')
  const [mpaa, setMpaa] = useState(false)

  const i = parseFloat(income.replace(/,/g,'')) || 0
  const c = parseFloat(contributions.replace(/,/g,'')) || 0
  const result = useMemo(() => calculate(i, c, mpaa), [i, c, mpaa])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Total Income (adjusted)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={income} onChange={(e) => setIncome(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Total Pension Contributions (yours + employer)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={contributions} onChange={(e) => setContributions(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
      </div>
      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={mpaa} onChange={(e) => setMpaa(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Money Purchase Annual Allowance triggered (£10,000 limit)</span></label>

      <div className="space-y-4 animate-fade-in-up">
        <div className={`rounded-2xl p-6 text-center ${result.exceeded ? 'bg-destructive/10' : 'bg-green-100 dark:bg-green-950'}`}>
          {result.exceeded ? (
            <><p className="text-lg font-bold text-destructive">Annual Allowance Exceeded!</p><p className="text-2xl font-bold text-destructive mt-1">Tax charge: {formatCurrency(result.taxCharge)}</p><p className="text-sm text-muted-foreground mt-1">Excess: {formatCurrency(result.excessCharge)} x {result.marginalRate}%</p></>
          ) : (
            <><p className="text-sm text-muted-foreground">Remaining Annual Allowance</p><p className="text-3xl font-bold text-green-700 dark:text-green-400 mt-1">{formatCurrency(result.remaining)}</p></>
          )}
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Your Allowance</p><p className="text-lg font-bold">{formatCurrency(result.aa)}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Used</p><p className="text-lg font-bold">{formatCurrency(result.used)}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Remaining</p><p className="text-lg font-bold">{formatCurrency(result.remaining)}</p></div>
        </div>
        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
          <p>Standard AA: £{ANNUAL_ALLOWANCE.toLocaleString()}. Tapers for adjusted income over £{TAPER_START.toLocaleString()} (min £{MIN_ALLOWANCE.toLocaleString()} at £{TAPER_END.toLocaleString()}+). MPAA: £{MONEY_PURCHASE_AA.toLocaleString()} if you've flexibly accessed pension.</p>
          <p className="mt-1">Unused allowance can be carried forward from the previous 3 tax years.</p>
        </div>
      </div>
    </div>
  )
}
