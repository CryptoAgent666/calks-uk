import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// UC rates 2026/27 (monthly, from 6 April 2026; standard allowances got an above-CPI rise, elements uprated 3.8%)
const STANDARD_SINGLE_UNDER25 = 338.58  // was £316.98 in 2025/26
const STANDARD_SINGLE_25PLUS = 424.90   // was £400.14 in 2025/26
const STANDARD_COUPLE_UNDER25 = 528.34  // was £497.55 in 2025/26
const STANDARD_COUPLE_25PLUS = 666.97   // was £628.10 in 2025/26
const CHILD_FIRST = 351.88       // first child born before 6 Apr 2017 (was £339.00 in 2025/26)
const CHILD_ADDITIONAL = 303.94  // born on/after 6 Apr 2017 + subsequent (was £292.81 in 2025/26)
// No flat cap on the housing element: private renters are limited to the Local Housing
// Allowance for their area and bedroom entitlement, so the rent entered is taken as eligible rent.
const TAPER_RATE = 0.55
const WORK_ALLOWANCE_HOUSING = 427   // lower, with housing help (was £411 in 2025/26)
const WORK_ALLOWANCE_NO_HOUSING = 710 // higher, no housing help (was £684 in 2025/26)

// Health element (formerly the LCWRA element). The Universal Credit Act 2025 split
// it into two rates from 6 April 2026: a lower rate for people newly found to have
// limited capability for work and work-related activity, and a protected higher rate
// for pre-2026 claimants, those meeting the Severe Conditions Criteria, and the
// terminally ill. Source: DWP ADM memo 04/26; SI 2026/113.
const HEALTH_ELEMENT_NEW = 217.26      // new determinations from 6 Apr 2026
const HEALTH_ELEMENT_PROTECTED = 429.80 // pre-2026, severe conditions, terminally ill

// Benefit cap 2026/27 (monthly; UC Regs 2013 regs 78-83). Couples and lone parents share
// the family rate; single adults without children get the lower rate.
const BENEFIT_CAP = {
  family_outside: 1_835.00,
  single_outside: 1_229.42,
  family_london: 2_110.25,
  single_london: 1_413.92,
}
const CAP_EARNINGS_EXEMPTION = 881 // net monthly earnings (16 hrs × NLW £12.71 × 52 ÷ 12)
// Child Benefit counts towards the cap (2026/27 weekly rates, converted to monthly)
const CB_FIRST_WEEKLY = 27.05
const CB_ADDITIONAL_WEEKLY = 17.90

function monthlyChildBenefit(children: number) {
  if (children < 1) return 0
  const weekly = CB_FIRST_WEEKLY + (children - 1) * CB_ADDITIONAL_WEEKLY
  return Math.round(weekly * 52 / 12 * 100) / 100
}

type Status = 'single_under25' | 'single_25plus' | 'couple_under25' | 'couple_25plus'
type Health = 'none' | 'new' | 'protected'

function calculate(
  status: Status, children: number, earnings: number, rent: number, hasHousingCosts: boolean, health: Health,
  eldestBornBefore2017 = false, inLondon = false, otherCapExemption = false,
) {
  const standardRates: Record<Status, number> = {
    single_under25: STANDARD_SINGLE_UNDER25, single_25plus: STANDARD_SINGLE_25PLUS,
    couple_under25: STANDARD_COUPLE_UNDER25, couple_25plus: STANDARD_COUPLE_25PLUS,
  }

  let maxUC = standardRates[status]
  // Child element: the higher rate is only for a first child born before 6 April 2017
  if (children >= 1) maxUC += eldestBornBefore2017 ? CHILD_FIRST : CHILD_ADDITIONAL
  if (children >= 2) maxUC += CHILD_ADDITIONAL * (children - 1)
  // Health element
  const healthElement = health === 'protected' ? HEALTH_ELEMENT_PROTECTED : health === 'new' ? HEALTH_ELEMENT_NEW : 0
  maxUC += healthElement
  // Housing element
  const housingElement = hasHousingCosts ? Math.max(0, rent) : 0
  maxUC += housingElement

  // Work allowance & taper. A work allowance is only available to claimants with
  // children or with limited capability for work, and is the lower rate when UC
  // also covers housing costs.
  const qualifiesForWorkAllowance = children > 0 || health !== 'none'
  const workAllowance = qualifiesForWorkAllowance
    ? (hasHousingCosts ? WORK_ALLOWANCE_HOUSING : WORK_ALLOWANCE_NO_HOUSING)
    : 0
  const excessEarnings = Math.max(0, earnings - workAllowance)
  const deduction = excessEarnings * TAPER_RATE

  const ucBeforeCap = Math.max(0, maxUC - deduction)

  // Benefit cap: UC award plus Child Benefit, compared with the cap for the household.
  // Exempt if net earnings reach £881 a month, the health (LCWRA) element is included,
  // or another exemption applies (PIP, DLA, Carer's Allowance, carer element and so on).
  // No childcare costs element is modelled here, so the reduction is the full excess.
  const isSingleNoChildren = status.startsWith('single') && children === 0
  const capKey = `${isSingleNoChildren ? 'single' : 'family'}_${inLondon ? 'london' : 'outside'}` as keyof typeof BENEFIT_CAP
  const benefitCap = BENEFIT_CAP[capKey]
  const childBenefit = monthlyChildBenefit(children)
  const capExempt = earnings >= CAP_EARNINGS_EXEMPTION || healthElement > 0 || otherCapExemption
  const totalBenefits = ucBeforeCap + childBenefit
  const capReduction = capExempt ? 0 : Math.min(ucBeforeCap, Math.max(0, totalBenefits - benefitCap))
  const ucPayment = Math.round((ucBeforeCap - capReduction) * 100) / 100

  return {
    maxUC, workAllowance, deduction, ucBeforeCap, ucPayment, housingElement, healthElement, annualUC: ucPayment * 12,
    benefitCap, childBenefit, totalBenefits, capExempt, capReduction,
  }
}

export default function UniversalCreditCalculator() {
  const [status, setStatus] = useState<Status>('single_25plus')
  const [children, setChildren] = useState('1')
  const [earnings, setEarnings] = useState('')
  const [rent, setRent] = useState('700')
  const [housing, setHousing] = useState(true)
  const [health, setHealth] = useState<Health>('none')
  const [eldestPre2017, setEldestPre2017] = useState(false)
  const [london, setLondon] = useState(false)
  const [otherExempt, setOtherExempt] = useState(false)

  const e = parseFloat(earnings.replace(/,/g, '')) || 0
  const r = parseFloat(rent.replace(/,/g, '')) || 0
  const c = parseInt(children) || 0
  const result = useMemo(
    () => calculate(status, c, e, r, housing, health, eldestPre2017, london, otherExempt),
    [status, c, e, r, housing, health, eldestPre2017, london, otherExempt],
  )

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Your Situation</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as Status)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Your Situation">
            <option value="single_under25">Single, under 25</option>
            <option value="single_25plus">Single, 25 or over</option>
            <option value="couple_under25">Couple, both under 25</option>
            <option value="couple_25plus">Couple, either 25+</option>
          </select></div>
        <div><label className="block text-sm font-medium mb-2">Number of Children</label>
          <input type="number" min="0" max="10" value={children} onChange={(e) => setChildren(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Number of Children" /></div>
        <div><label className="block text-sm font-medium mb-2">Monthly Net Earnings</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={earnings} onChange={(e) => setEarnings(e.target.value)} placeholder="0" className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Monthly Net Earnings" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Monthly Rent</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={rent} onChange={(e) => setRent(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Monthly Rent" /></div></div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Health element (limited capability for work)</label>
        <select value={health} onChange={(e) => setHealth(e.target.value as Health)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Health element">
          <option value="none">Not applicable</option>
          <option value="new">New award from 6 April 2026 (£217.26/month)</option>
          <option value="protected">Protected rate: award before April 2026, severe conditions or terminally ill (£429.80/month)</option>
        </select>
        <p className="text-xs text-muted-foreground mt-1">The Universal Credit Act 2025 split this element into two rates from 6 April 2026. Qualifying for it also unlocks a work allowance.</p>
      </div>
      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={housing} onChange={(e) => setHousing(e.target.checked)} className="h-5 w-5 rounded border-border" />
          <span className="text-sm">Include housing costs element</span>
        </label>
        {housing && (
          <p className="text-xs text-muted-foreground mt-1">Private renters' housing element is limited to the Local Housing Allowance rate for their area and the number of bedrooms they are entitled to, so enter the lower of your rent and your LHA rate. Social tenants with a spare bedroom lose 14% or 25%.</p>
        )}
      </div>
      {c > 0 && (
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={eldestPre2017} onChange={(e) => setEldestPre2017(e.target.checked)} className="h-5 w-5 rounded border-border" />
          <span className="text-sm">Eldest child born before 6 April 2017 (higher first-child rate of £351.88)</span>
        </label>
      )}
      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" checked={london} onChange={(e) => setLondon(e.target.checked)} className="h-5 w-5 rounded border-border" />
        <span className="text-sm">Live in Greater London (higher benefit cap)</span>
      </label>
      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" checked={otherExempt} onChange={(e) => setOtherExempt(e.target.checked)} className="h-5 w-5 rounded border-border" />
        <span className="text-sm">Exempt from the benefit cap for another reason (e.g. PIP, DLA, Carer's Allowance or the UC carer element in the household)</span>
      </label>

      <div className="space-y-4 animate-fade-in-up">
        <div className="rounded-2xl bg-primary/10 p-6 text-center">
          <p className="text-sm text-muted-foreground">Estimated Monthly Universal Credit</p>
          <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.ucPayment)}</p>
          <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.annualUC)}/year</p>
        </div>
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-border/50"><td className="py-2">Maximum UC entitlement</td><td className="text-right tabular-nums font-medium">{formatCurrency(result.maxUC)}</td></tr>
            {result.healthElement > 0 && <tr className="border-b border-border/50"><td className="py-2 text-muted-foreground">(includes health element)</td><td className="text-right tabular-nums text-muted-foreground">{formatCurrency(result.healthElement)}</td></tr>}
            {result.housingElement > 0 && <tr className="border-b border-border/50"><td className="py-2 text-muted-foreground">(includes housing element)</td><td className="text-right tabular-nums text-muted-foreground">{formatCurrency(result.housingElement)}</td></tr>}
            {e > 0 && <tr className="border-b border-border/50"><td className="py-2">Work allowance</td><td className="text-right tabular-nums">{formatCurrency(result.workAllowance)}</td></tr>}
            {result.deduction > 0 && <tr className="border-b border-border/50"><td className="py-2 text-destructive">Earnings deduction (55%)</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.deduction)}</td></tr>}
            {result.capReduction > 0 && <tr className="border-b border-border/50"><td className="py-2 text-destructive">Benefit cap reduction (UC {formatCurrency(result.ucBeforeCap)} + Child Benefit {formatCurrency(result.childBenefit)} over the {formatCurrency(result.benefitCap)} cap)</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.capReduction)}</td></tr>}
            <tr className="font-semibold"><td className="py-2 text-primary">UC Payment</td><td className="text-right tabular-nums text-primary">{formatCurrency(result.ucPayment)}</td></tr>
          </tbody>
        </table>
        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
          <p>{result.capExempt
            ? 'The benefit cap does not apply: net earnings of £881 or more a month, the health element or another exemption takes the household out of it.'
            : result.capReduction > 0
              ? `The benefit cap applies: UC plus Child Benefit comes to ${formatCurrency(result.totalBenefits)} a month against a cap of ${formatCurrency(result.benefitCap)}.`
              : `Under the benefit cap: UC plus Child Benefit comes to ${formatCurrency(result.totalBenefits)} a month against a cap of ${formatCurrency(result.benefitCap)}.`}</p>
          <p className="mt-2">This is a simplified estimate. Actual UC depends on your full circumstances including savings, disability, caring responsibilities, childcare costs and local housing allowance rates.</p>
        </div>
      </div>
    </div>
  )
}
