import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// UK Spouse Visa minimum income requirement 2025
const MIN_INCOME = 29_000 // from April 2024, rising
const VISA_FEE = 2_064
const IHS_PER_YEAR = 1_035
const VISA_LENGTH = 2.5 // years (initial)

function calculate(applicantIncome: number, partnerIncome: number, savings: number, hasChildren: boolean, numChildren: number) {
  const totalIncome = applicantIncome + partnerIncome
  const meetsIncome = totalIncome >= MIN_INCOME

  // Savings can be used: amount over £16,000, divided by 2.5
  const usableSavings = Math.max(0, savings - 16_000)
  const savingsAsIncome = usableSavings / 2.5
  const effectiveIncome = totalIncome + savingsAsIncome
  const meetsWithSavings = effectiveIncome >= MIN_INCOME

  const shortfall = Math.max(0, MIN_INCOME - effectiveIncome)
  const savingsNeeded = shortfall > 0 ? shortfall * 2.5 + 16_000 : 0

  // Costs
  const ihsTotal = IHS_PER_YEAR * VISA_LENGTH
  const totalCost = VISA_FEE + ihsTotal
  const dependantFees = hasChildren ? numChildren * (VISA_FEE * 0.5 + ihsTotal) : 0
  const grandTotal = totalCost + dependantFees

  return { totalIncome, effectiveIncome, meetsIncome, meetsWithSavings, shortfall, savingsNeeded, savingsAsIncome, totalCost, dependantFees, grandTotal }
}

export default function SpouseVisaCalculator() {
  const [appIncome, setAppIncome] = useState('32000')
  const [partIncome, setPartIncome] = useState('0')
  const [savings, setSavings] = useState('5000')
  const [children, setChildren] = useState(false)
  const [numChildren, setNumChildren] = useState('0')

  const ai = parseFloat(appIncome.replace(/,/g,'')) || 0
  const pi = parseFloat(partIncome.replace(/,/g,'')) || 0
  const s = parseFloat(savings.replace(/,/g,'')) || 0
  const nc = parseInt(numChildren) || 0
  const result = useMemo(() => calculate(ai, pi, s, children, nc), [ai, pi, s, children, nc])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">UK Sponsor Income</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={appIncome} onChange={(e) => setAppIncome(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="UK Sponsor Income" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Applicant Income (if any)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={partIncome} onChange={(e) => setPartIncome(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Applicant Income (if any)" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Combined Savings</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={savings} onChange={(e) => setSavings(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Combined Savings" /></div></div>
      </div>
      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={children} onChange={(e) => setChildren(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Applying with dependent children</span></label>
      {children && <div><label className="block text-sm font-medium mb-2">Number of Children</label><input type="number" min="1" max="5" value={numChildren} onChange={(e) => setNumChildren(e.target.value)} className="w-32 rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Number of Children" /></div>}

      <div className="space-y-4 animate-fade-in-up">
        <div className={`rounded-2xl p-6 text-center ${result.meetsWithSavings ? 'bg-green-100 dark:bg-green-950' : 'bg-destructive/10'}`}>
          {result.meetsWithSavings ? (
            <><p className="text-lg font-bold text-green-700 dark:text-green-400">You meet the income requirement!</p><p className="text-sm text-muted-foreground mt-1">Effective income: {formatCurrency(result.effectiveIncome)} (min: £{MIN_INCOME.toLocaleString()})</p></>
          ) : (
            <><p className="text-lg font-bold text-destructive">Income requirement not met</p><p className="text-sm text-muted-foreground mt-1">Shortfall: {formatCurrency(result.shortfall)}/year. Need {formatCurrency(result.savingsNeeded)} in savings to bridge the gap.</p></>
          )}
        </div>
        <div className="rounded-2xl bg-destructive/10 p-6 text-center">
          <p className="text-sm text-muted-foreground">Total Visa Cost</p>
          <p className="text-3xl font-bold text-destructive mt-1">{formatCurrency(result.grandTotal)}</p>
          <p className="text-sm text-muted-foreground mt-1">Visa fee: £{VISA_FEE.toLocaleString()} + IHS: {formatCurrency(IHS_PER_YEAR * VISA_LENGTH)}{result.dependantFees > 0 ? ` + dependants: ${formatCurrency(result.dependantFees)}` : ''}</p>
        </div>
        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
          <p>Minimum income: <span className="font-medium text-foreground">£{MIN_INCOME.toLocaleString()}</span> (from April 2024). Previously-planned rises to £34,500 and £38,700 were paused pending a Migration Advisory Committee review, so £29,000 still applies.</p>
          <p className="mt-1">Savings over £16,000 can supplement income (excess ÷ 2.5 added to income).</p>
        </div>
      </div>
    </div>
  )
}
