import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// UK Spouse Visa minimum income requirement
const MIN_INCOME = 29_000 // from April 2024; the planned rises are paused
const IHS_ADULT = 1_035
const IHS_CHILD = 776 // under-18 rate
// Home Office fees from 8 April 2026, partner or child. A first visa from outside the UK is granted for
// 2 years 9 months; an extension inside the UK for 2 years 6 months.
const ROUTES = {
  outside: { fee: 2_064, years: 2.75, label: 'First visa, applying from outside the UK' },
  inside: { fee: 1_407, years: 2.5, label: 'Extension, applying inside the UK' },
} as const
type Route = keyof typeof ROUTES
// The surcharge is charged per whole year, plus half a year for a remainder of 6 months
// or less and a full year for anything longer, so 2 years 9 months is charged as 3 years.
const ihsYears = (years: number) => {
  const whole = Math.floor(years)
  const rest = years - whole
  return whole + (rest === 0 ? 0 : rest <= 0.5 ? 0.5 : 1)
}

function calculate(sponsorIncome: number, applicantUkEarnings: number, savings: number, hasChildren: boolean, numChildren: number, route: Route) {
  // Appendix FM: from outside the UK only the UK partner's earnings count (E-ECP.3.2); the applicant's
  // own earnings count only for an in-UK application, from UK work they're allowed to do (E-LTRP.3.2)
  const totalIncome = sponsorIncome + (route === 'inside' ? applicantUkEarnings : 0)
  const meetsIncome = totalIncome >= MIN_INCOME

  // Savings can be used: amount over £16,000, divided by 2.5
  const usableSavings = Math.max(0, savings - 16_000)
  const savingsAsIncome = usableSavings / 2.5
  const effectiveIncome = totalIncome + savingsAsIncome
  const meetsWithSavings = effectiveIncome >= MIN_INCOME

  const shortfall = Math.max(0, MIN_INCOME - effectiveIncome)
  // Savings needed in total: £16,000 plus 2.5 times the gap left by income alone
  const savingsNeeded = totalIncome < MIN_INCOME ? 16_000 + (MIN_INCOME - totalIncome) * 2.5 : 0
  const extraSavings = Math.max(0, savingsNeeded - savings)

  // Costs
  const { fee, years } = ROUTES[route]
  const ihsTotal = IHS_ADULT * ihsYears(years)
  const totalCost = fee + ihsTotal
  const dependantFees = hasChildren ? numChildren * (fee + IHS_CHILD * ihsYears(years)) : 0
  const grandTotal = totalCost + dependantFees

  return { totalIncome, effectiveIncome, meetsIncome, meetsWithSavings, shortfall, savingsNeeded, extraSavings, savingsAsIncome, ihsTotal, totalCost, dependantFees, grandTotal, fee }
}

export default function SpouseVisaCalculator() {
  const [appIncome, setAppIncome] = useState('32000')
  const [partIncome, setPartIncome] = useState('0')
  const [savings, setSavings] = useState('5000')
  const [children, setChildren] = useState(false)
  const [numChildren, setNumChildren] = useState('0')
  const [route, setRoute] = useState<Route>('outside')

  const ai = parseFloat(appIncome.replace(/,/g,'')) || 0
  const pi = parseFloat(partIncome.replace(/,/g,'')) || 0
  const s = parseFloat(savings.replace(/,/g,'')) || 0
  const nc = parseInt(numChildren) || 0
  const result = useMemo(() => calculate(ai, pi, s, children, nc, route), [ai, pi, s, children, nc, route])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {(Object.entries(ROUTES) as [Route, typeof ROUTES[Route]][]).map(([k, r]) => (
          <button key={k} onClick={() => setRoute(k)} className={`px-4 py-3 rounded-xl text-sm font-medium border text-left ${route === k ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>{r.label}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">UK Sponsor Income</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={appIncome} onChange={(e) => setAppIncome(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="UK Sponsor Income" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Applicant's UK Earnings</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={partIncome} onChange={(e) => setPartIncome(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Applicant's UK Earnings" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Combined Savings</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={savings} onChange={(e) => setSavings(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Combined Savings" /></div></div>
      </div>
      {route === 'outside' && pi > 0 && <p className="text-sm text-muted-foreground">Your own earnings don't count for a first visa from outside the UK; only your UK partner's income, savings and some other income (such as pensions) do.</p>}
      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={children} onChange={(e) => setChildren(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Applying with dependent children</span></label>
      {children && <div><label className="block text-sm font-medium mb-2">Number of Children</label><input type="number" min="1" max="5" value={numChildren} onChange={(e) => setNumChildren(e.target.value)} className="w-32 rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Number of Children" /></div>}

      <div className="space-y-4 animate-fade-in-up">
        <div className={`rounded-2xl p-6 text-center ${result.meetsWithSavings ? 'bg-green-100 dark:bg-green-950' : 'bg-destructive/10'}`}>
          {result.meetsWithSavings ? (
            <><p className="text-lg font-bold text-green-700 dark:text-green-400">You meet the income requirement!</p><p className="text-sm text-muted-foreground mt-1">Effective income: {formatCurrency(result.effectiveIncome)} (min: £{MIN_INCOME.toLocaleString()})</p></>
          ) : (
            <><p className="text-lg font-bold text-destructive">Income requirement not met</p><p className="text-sm text-muted-foreground mt-1">Shortfall: {formatCurrency(result.shortfall)}/year. You would need {formatCurrency(result.savingsNeeded)} in savings in total, {formatCurrency(result.extraSavings)} more than you have.</p></>
          )}
        </div>
        <div className="rounded-2xl bg-destructive/10 p-6 text-center">
          <p className="text-sm text-muted-foreground">Total Visa Cost</p>
          <p className="text-3xl font-bold text-destructive mt-1">{formatCurrency(result.grandTotal)}</p>
          <p className="text-sm text-muted-foreground mt-1">Visa fee: £{result.fee.toLocaleString()} + IHS: {formatCurrency(result.ihsTotal)}{result.dependantFees > 0 ? ` + dependants: ${formatCurrency(result.dependantFees)}` : ''}</p>
        </div>
        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
          <p>Minimum income: <span className="font-medium text-foreground">£{MIN_INCOME.toLocaleString()}</span> (from April 2024). The Migration Advisory Committee reported in June 2025 and advised against the planned rise to £38,700; the Immigration Rules have not changed, so £29,000 still applies.</p>
          <p className="mt-1">Savings over £16,000 can supplement income (excess ÷ 2.5 added to income). Your own earnings count only when you apply from inside the UK.</p>
        </div>
      </div>
    </div>
  )
}
