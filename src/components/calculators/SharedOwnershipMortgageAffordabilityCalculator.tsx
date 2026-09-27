import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Household income limit for shared ownership in England (gov.uk/shared-ownership-scheme/who-can-apply).
const INCOME_CAP = 80_000
const INCOME_CAP_LONDON = 90_000
// Typical lender cap on the mortgage as a multiple of gross household income.
const MAX_MULTIPLE = 4.5
// Housing costs (mortgage + rent + service charge) as % of take-home pay. Homes England used 45% of
// net income as a ceiling until 1 August 2024; providers now run a full budget check (Capital Funding
// Guide, section 6), so this is a rough guide only.
const MAX_HOUSING_PCT = 45
const MORTGAGE_YEARS = 25
const SHARES = [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75]

// Take-home pay after 2026/27 income tax (England, Wales and NI bands) and employee Class 1 NI.
function takeHome(gross: number) {
  if (gross <= 0) return 0
  const allowance = Math.max(0, 12_570 - Math.max(0, gross - 100_000) / 2)
  const taxable = Math.max(0, gross - allowance)
  const tax = Math.min(taxable, 37_700) * 0.2
    + Math.max(0, Math.min(taxable, 125_140) - 37_700) * 0.4
    + Math.max(0, taxable - 125_140) * 0.45
  const ni = Math.max(0, Math.min(gross, 50_270) - 12_570) * 0.08 + Math.max(0, gross - 50_270) * 0.02
  return gross - tax - ni
}

function assess(propertyValue: number, share: number, deposit: number, grossIncome: number, netMonthly: number, rate: number, rentPct: number, serviceCharge: number) {
  const shareValue = propertyValue * (share / 100)
  const dep = Math.min(deposit, shareValue)
  const mortgage = shareValue - dep
  const r = rate / 100 / 12
  const n = MORTGAGE_YEARS * 12
  const monthlyMortgage = mortgage <= 0 ? 0 : r > 0 ? mortgage * r / (1 - Math.pow(1 + r, -n)) : mortgage / n
  const unsoldShare = propertyValue - shareValue
  const monthlyRent = unsoldShare * (rentPct / 100) / 12
  const totalMonthly = monthlyMortgage + monthlyRent + serviceCharge
  const housingPct = netMonthly > 0 ? totalMonthly / netMonthly * 100 : Infinity
  const maxBorrow = grossIncome * MAX_MULTIPLE
  const multipleOk = mortgage <= maxBorrow
  const depositOk = mortgage <= 0 || dep >= shareValue * 0.05
  const housingOk = housingPct <= MAX_HOUSING_PCT
  return { shareValue, mortgage, maxBorrow, monthlyMortgage, unsoldShare, monthlyRent, totalMonthly, housingPct, multipleOk, depositOk, housingOk, affordable: multipleOk && depositOk && housingOk }
}

function calculate(propertyValue: number, share: number, deposit: number, salary: number, partnerSalary: number, rate: number, rentPct = 2.75, serviceCharge = 100, london = false) {
  const grossIncome = salary + partnerSalary
  const netMonthly = (takeHome(salary) + takeHome(partnerSalary)) / 12
  const incomeCap = london ? INCOME_CAP_LONDON : INCOME_CAP
  const eligible = grossIncome <= incomeCap
  const current = assess(propertyValue, share, deposit, grossIncome, netMonthly, rate, rentPct, serviceCharge)
  const passing = SHARES.filter((s) => assess(propertyValue, s, deposit, grossIncome, netMonthly, rate, rentPct, serviceCharge).affordable)
  const maxShare = passing.length ? passing[passing.length - 1] : null
  return { ...current, grossIncome, netMonthly, incomeCap, eligible, maxShare }
}

const moneyClass = 'w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring'
const inputClass = 'w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring'

export default function SharedOwnershipMortgageAffordabilityCalculator() {
  const [value, setValue] = useState('300000')
  const [share, setShare] = useState('25')
  const [deposit, setDeposit] = useState('7500')
  const [salary, setSalary] = useState('30000')
  const [partner, setPartner] = useState('0')
  const [rate, setRate] = useState('5.73')
  const [rentPct, setRentPct] = useState('2.75')
  const [service, setService] = useState('100')
  const [london, setLondon] = useState(false)

  const v = parseFloat(value.replace(/,/g,'')) || 0
  const sh = parseInt(share) || 25
  const d = parseFloat(deposit.replace(/,/g,'')) || 0
  const s = parseFloat(salary.replace(/,/g,'')) || 0
  const ps = parseFloat(partner.replace(/,/g,'')) || 0
  const r = parseFloat(rate) || 0
  const rp = parseFloat(rentPct) || 0
  const sc = parseFloat(service.replace(/,/g,'')) || 0
  const result = useMemo(() => calculate(v, sh, d, s, ps, r, rp, sc, london), [v, sh, d, s, ps, r, rp, sc, london])

  const problems: string[] = []
  if (!result.multipleOk) problems.push(`mortgage ${formatCurrency(result.mortgage)} is over ${MAX_MULTIPLE}× income (${formatCurrency(result.maxBorrow)})`)
  if (!result.housingOk) problems.push(result.netMonthly > 0 ? `housing costs are ${result.housingPct.toFixed(0)}% of take-home pay (guide: ${MAX_HOUSING_PCT}%)` : 'no income entered')
  if (!result.depositOk) problems.push('deposit is under 5% of the share')

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Full Property Value</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={value} onChange={(e) => setValue(e.target.value)} className={moneyClass} aria-label="Full Property Value" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Your Share (%)</label><select value={share} onChange={(e) => setShare(e.target.value)} className={inputClass} aria-label="Your Share (%)">{SHARES.map(s => <option key={s} value={s}>{s}%</option>)}</select></div>
        <div><label className="block text-sm font-medium mb-2">Deposit</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={deposit} onChange={(e) => setDeposit(e.target.value)} className={moneyClass} aria-label="Deposit" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Your Salary</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={salary} onChange={(e) => setSalary(e.target.value)} className={moneyClass} aria-label="Your Salary" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Partner Salary</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={partner} onChange={(e) => setPartner(e.target.value)} className={moneyClass} aria-label="Partner Salary" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Mortgage Rate (%)</label><input type="number" min="0" max="15" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} className={inputClass} aria-label="Mortgage Rate (%)" /><p className="text-xs text-muted-foreground mt-1">5.73% = average 2-year fix, Moneyfacts, 15 Sep 2026</p></div>
        <div><label className="block text-sm font-medium mb-2">Rent (% of unsold share/yr)</label><input type="number" min="0" max="5" step="0.05" value={rentPct} onChange={(e) => setRentPct(e.target.value)} className={inputClass} aria-label="Rent (% of unsold share per year)" /></div>
        <div><label className="block text-sm font-medium mb-2">Service Charge (£/month)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={service} onChange={(e) => setService(e.target.value)} className={moneyClass} aria-label="Service Charge per month" /></div></div>
      </div>
      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={london} onChange={(e) => setLondon(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Home is in London (income limit £90,000 instead of £80,000)</span></label>

      {v > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className={`rounded-xl p-3 text-center text-sm font-medium ${result.eligible && result.affordable ? 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400' : 'bg-destructive/10 text-destructive'}`}>
            {!result.eligible
              ? `Household income ${formatCurrency(result.grossIncome)} is over the ${formatCurrency(result.incomeCap)} limit, so you cannot buy through shared ownership`
              : result.affordable
                ? `Looks affordable: mortgage within ${MAX_MULTIPLE}× income and housing costs ${result.housingPct.toFixed(0)}% of take-home pay`
                : `Likely to fail: ${problems.join('; ')}`}
          </div>
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Total Monthly Housing Cost</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.totalMonthly)}</p>
            <p className="text-sm text-muted-foreground mt-1">Mortgage {formatCurrency(result.monthlyMortgage)} + rent {formatCurrency(result.monthlyRent)} + service charge {formatCurrency(sc)}</p>
            {result.netMonthly > 0 && <p className="text-sm text-muted-foreground mt-1">{result.housingPct.toFixed(1)}% of take-home pay of {formatCurrency(result.netMonthly)} a month</p>}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Your Share</p><p className="text-lg font-bold">{formatCurrency(result.shareValue)}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Mortgage</p><p className="text-lg font-bold">{formatCurrency(result.mortgage)}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Unsold Share</p><p className="text-lg font-bold">{formatCurrency(result.unsoldShare)}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Largest Share That Passes</p><p className="text-lg font-bold">{result.maxShare ? `${result.maxShare}%` : 'None'}</p></div>
          </div>
          <p className="text-xs text-muted-foreground">
            A rough guide, not a provider decision. Take-home pay uses 2026/27 income tax (England, Wales and Northern Ireland bands) and employee NI, with no pension or student loan deductions. The mortgage runs over {MORTGAGE_YEARS} years on a repayment basis. The {MAX_HOUSING_PCT}% test was Homes England guidance until August 2024; providers now look at your full budget and set their own minimum surplus income. &ldquo;Largest share that passes&rdquo; keeps your deposit fixed and checks 10% to 75% in 5% steps.
          </p>
        </div>
      )}
    </div>
  )
}
