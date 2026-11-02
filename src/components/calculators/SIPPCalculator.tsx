import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// 2026/27 income tax bands as cumulative limits of TAXABLE income (after the Personal Allowance)
const RUK_BANDS = [
  { upTo: 37_700, rate: 0.20 },
  { upTo: 125_140, rate: 0.40 },
  { upTo: Infinity, rate: 0.45 },
]
const SCOT_BANDS = [
  { upTo: 3_967, rate: 0.19 },
  { upTo: 16_956, rate: 0.20 },
  { upTo: 31_092, rate: 0.21 },
  { upTo: 62_430, rate: 0.42 },
  { upTo: 125_140, rate: 0.45 },
  { upTo: Infinity, rate: 0.48 },
]
const ANNUAL_ALLOWANCE = 60_000
const NO_EARNINGS_LIMIT = 3_600 // FA 2004 s190: gross relief available with earnings below this

function personalAllowance(adjustedNetIncome: number) {
  if (adjustedNetIncome <= 100_000) return 12_570
  return Math.max(0, 12_570 - Math.floor((adjustedNetIncome - 100_000) / 2))
}

// Income tax with a relief-at-source contribution `gross`: the gross contribution comes off
// adjusted net income (restoring any tapered Personal Allowance) and extends every band limit
// above the lowest one (ITA 2007 s192; for Scotland the starter band stays put).
function incomeTax(income: number, scotland: boolean, gross = 0) {
  const bands = scotland ? SCOT_BANDS : RUK_BANDS
  const taxable = Math.max(0, income - personalAllowance(income - gross))
  let tax = 0
  let lower = 0
  bands.forEach((b, i) => {
    const upper = i === 0 && scotland ? b.upTo : b.upTo + gross
    if (taxable > lower) tax += (Math.min(taxable, upper) - lower) * b.rate
    lower = upper
  })
  return tax
}

function calculate(monthlyContrib: number, employerContrib: number, currentPot: number, yearsToRetirement: number, growthRate: number, earnings: number, scotland: boolean) {
  // Relief at source: the provider adds 20% of the gross (£800 net = £1,000 gross), but only on
  // contributions up to 100% of earnings, or £3,600 gross with earnings below that
  const requestedGross = monthlyContrib * 12 / 0.80
  const reliefLimit = Math.max(earnings, NO_EARNINGS_LIMIT)
  const relievableGross = Math.min(requestedGross, reliefLimit)
  const basicRelief = relievableGross * 0.20
  const grossAnnual = monthlyContrib * 12 + basicRelief
  const grossMonthly = grossAnnual / 12

  // Any relief above 20% is reclaimed, and only on income actually taxed above 20%
  const extraReclaim = Math.max(0, incomeTax(earnings, scotland) - incomeTax(earnings, scotland, relievableGross))

  const totalMonthly = grossMonthly + employerContrib
  // Effective monthly rate equivalent to the annual growth rate; contributions go in at each month end
  const monthlyGrowth = Math.pow(1 + growthRate / 100, 1 / 12) - 1

  let pot = currentPot
  for (let m = 0; m < yearsToRetirement * 12; m++) {
    pot = pot * (1 + monthlyGrowth) + totalMonthly
  }

  const totalGovtRelief = (basicRelief + extraReclaim) * yearsToRetirement
  const taxFreeLump = Math.min(pot * 0.25, 268_275) // capped by the Lump Sum Allowance
  const remainingPot = pot - taxFreeLump
  const drawdownMonthly = remainingPot / (25 * 12) // even withdrawals over 25 years, no further growth, before tax

  const annualInput = grossAnnual + employerContrib * 12
  return {
    pot, totalGovtRelief, taxFreeLump, remainingPot, drawdownMonthly, grossMonthly, extraReclaim,
    annualInput, overAllowance: annualInput > ANNUAL_ALLOWANCE, overReliefLimit: requestedGross > reliefLimit, reliefLimit,
  }
}

export default function SIPPCalculator() {
  const [monthly, setMonthly] = useState('500')
  const [employer, setEmployer] = useState('0')
  const [current, setCurrent] = useState('20000')
  const [years, setYears] = useState('25')
  const [growth, setGrowth] = useState('5')
  const [income, setIncome] = useState('40000')
  const [region, setRegion] = useState('ruk')

  const m = parseFloat(monthly.replace(/,/g,'')) || 0
  const e = parseFloat(employer.replace(/,/g,'')) || 0
  const c = parseFloat(current.replace(/,/g,'')) || 0
  const y = parseInt(years) || 0
  const g = parseFloat(growth) || 0
  const earn = parseFloat(income.replace(/,/g,'')) || 0
  const result = useMemo(() => calculate(m, e, c, y, g, earn, region === 'scotland'), [m, e, c, y, g, earn, region])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Your Monthly (net)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={monthly} onChange={(e) => setMonthly(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Your Monthly (net)" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Employer Monthly</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={employer} onChange={(e) => setEmployer(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Employer Monthly" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Current SIPP Value</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={current} onChange={(e) => setCurrent(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Current SIPP Value" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Years to Retirement</label><input type="number" min="1" max="40" value={years} onChange={(e) => setYears(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Years to Retirement" /></div>
        <div><label className="block text-sm font-medium mb-2">Growth (% a year, after charges)</label><input type="number" min="0" max="10" step="0.5" value={growth} onChange={(e) => setGrowth(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Growth (% a year, after charges)" /></div>
        <div><label className="block text-sm font-medium mb-2">Annual Earnings (before tax)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={income} onChange={(e) => setIncome(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Annual Earnings (before tax)" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Where You Pay Income Tax</label><select value={region} onChange={(e) => setRegion(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Where You Pay Income Tax"><option value="ruk">England, Wales or NI</option><option value="scotland">Scotland</option></select></div>
      </div>

      {y > 0 && (m > 0 || e > 0 || c > 0) && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">SIPP Value at Retirement (future pounds, not adjusted for inflation)</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.pot)}</p>
            <p className="text-sm text-muted-foreground mt-1">Tax-free lump sum (25%, max £268,275): {formatCurrency(result.taxFreeLump)}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-3 text-center"><p className="text-xs text-muted-foreground">Total Tax Relief</p><p className="text-lg font-bold text-green-700 dark:text-green-400">{formatCurrency(result.totalGovtRelief)}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Gross Monthly (yours)</p><p className="text-lg font-bold">{formatCurrency(result.grossMonthly)}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Drawdown over 25 yrs, before tax</p><p className="text-lg font-bold">{formatCurrency(result.drawdownMonthly)}/mo</p></div>
            {result.extraReclaim > 0 && <div className="rounded-xl bg-green-100 dark:bg-green-950 p-3 text-center"><p className="text-xs text-muted-foreground">Extra Reclaim/Year</p><p className="text-lg font-bold text-green-700 dark:text-green-400">{formatCurrency(result.extraReclaim)}</p></div>}
          </div>
          {result.overReliefLimit && (
            <div className="rounded-xl bg-orange-100 dark:bg-orange-950 p-3 text-sm text-orange-800 dark:text-orange-300">
              {earn >= 3_600
                ? `This is more than 100% of the earnings you entered. Tax relief stops at ${formatCurrency(result.reliefLimit)} gross a year, so the figures above give none on the excess.`
                : 'With earnings below £3,600, tax relief stops at £3,600 gross a year (£2,880 net), so the figures above give none on the excess.'}
            </div>
          )}
          {result.overAllowance && (
            <div className="rounded-xl bg-orange-100 dark:bg-orange-950 p-3 text-sm text-orange-800 dark:text-orange-300">
              {formatCurrency(result.annualInput)} a year including employer money and tax relief is above the £60,000 annual allowance. Unless carry forward covers the excess, an annual allowance charge applies, and the figures above do not deduct it.
            </div>
          )}
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>Growth compounds at your annual rate, with contributions added at each month end. Drawdown divides the pot after the lump sum evenly over 25 years, with no further growth. Any extra reclaim comes back to you rather than into the SIPP, and relief assumes earnings, rates and allowances stay as they are in 2026/27.</p>
            <p className="mt-1">The £60,000 allowance can be lower: it tapers if threshold income is over £200,000 and adjusted income is over £260,000, and it falls to a £10,000 money purchase annual allowance once you have flexibly accessed a pension. Carry forward can use unused allowance from the previous 3 tax years, though not against the money purchase limit.</p>
          </div>
        </div>
      )}
    </div>
  )
}
