import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// CMS rates: Child Support Act 1991 Sch 1 Pt I (gov.uk "How child maintenance is worked out"). Fixed in
// the Act, not uprated yearly; unchanged for 2026/27 (checked 26 Sep 2026).

// Reduced rate T% by qualifying children (1, 2, 3+) and relevant other children (0, 1, 2, 3+),
// reg 43 Child Support Maintenance Calculation Regulations 2012 (SI 2012/2677)
const REDUCED_T: Record<number, number[]> = {
  1: [17.0, 14.1, 13.2, 12.4],
  2: [25.0, 21.2, 19.9, 18.9],
  3: [31.0, 26.4, 24.9, 23.8],
}

// Shared care (Sch 1 para 7), reduced and basic rates only. Option 1 = 52–103 nights a year (1/7 off),
// 2 = 104–155 (2/7), 3 = 156–174 (3/7), 4 = 175 or more: halved, then a further £7 a week off for each
// child. After the reduction the amount cannot fall below £7 a week (Sch 1 para 7(7); gov.uk).
const SHARED_CARE_FRACTION: Record<number, number> = { 1: 1 / 7, 2: 2 / 7, 3: 3 / 7 }
const EQUAL_CARE_OPTION = 4
const EQUAL_CARE_PER_CHILD = 7
const MINIMUM_WEEKLY = 7

type Band = 'nil' | 'flat' | 'reduced' | 'basic' | 'basic plus'

function calculate(grossWeeklyIncome: number, children: number, nightsOption: number, otherChildren: number, onBenefit = false) {
  // Gross weekly income over £3,000 is ignored (Sch 1 para 10(3)); above that the court can top up
  const gross = Math.min(grossWeeklyIncome, 3000)
  const allKids = Math.max(Math.floor(children) || 1, 1)
  const kids = Math.min(allKids, 3)

  // Deduction for other children living with the paying parent (basic and basic-plus rates)
  const otherChildReduction = otherChildren === 1 ? 0.11 : otherChildren === 2 ? 0.14 : otherChildren >= 3 ? 0.16 : 0
  const income = gross * (1 - otherChildReduction)

  // Basic rate by number of children, on reduced income up to £800
  const rate = kids === 1 ? 0.12 : kids === 2 ? 0.16 : 0.19
  // Basic-plus rate applied to the slice of income above £800 (£800.01–£3,000)
  const basicPlusRate = kids === 1 ? 0.09 : kids === 2 ? 0.12 : 0.15
  const reducedT = REDUCED_T[kids][Math.min(otherChildren, 3)]

  let weeklyAmount: number
  let band: Band
  if (onBenefit) {
    // Flat rate where the paying parent (or their partner) gets a qualifying benefit (Sch 1 para 4);
    // nil where they also have shared care of 52 nights a year or more (Sch 1 para 8)
    weeklyAmount = nightsOption >= 1 ? 0 : 7
    band = nightsOption >= 1 ? 'nil' : 'flat'
  } else if (gross < 7) {
    weeklyAmount = 0
    band = 'nil'
  } else if (gross <= 100) {
    weeklyAmount = 7
    band = 'flat'
  } else if (gross < 200) {
    // Reduced rate: flat £7 plus T% of the income between £100 and £200
    weeklyAmount = 7 + (gross - 100) * reducedT / 100
    band = 'reduced'
  } else if (income > 800) {
    // Basic rate plus: basic rate on the first £800, then the lower basic-plus rate on the excess
    weeklyAmount = 800 * rate + (income - 800) * basicPlusRate
    band = 'basic plus'
  } else {
    weeklyAmount = income * rate
    band = 'basic'
  }

  // Shared care reduction (reduced and basic rates only), then the £7 a week floor
  let sharedCareNote = ''
  let floored = false
  if (nightsOption >= 1 && (band === 'reduced' || band === 'basic' || band === 'basic plus')) {
    if (nightsOption >= EQUAL_CARE_OPTION) {
      const perChild = EQUAL_CARE_PER_CHILD * allKids
      weeklyAmount = weeklyAmount * 0.5 - perChild
      sharedCareNote = `Equal care (175 or more nights a year): halved, then a further £${perChild} a week off for ${allKids} child${allKids > 1 ? 'ren' : ''}.`
    } else {
      weeklyAmount *= 1 - SHARED_CARE_FRACTION[nightsOption]
      sharedCareNote = `Shared care: reduced by ${nightsOption}/7.`
    }
    if (weeklyAmount < MINIMUM_WEEKLY) {
      weeklyAmount = MINIMUM_WEEKLY
      floored = true
    }
  }

  return {
    weeklyAmount, monthlyAmount: weeklyAmount * 52 / 12, annualAmount: weeklyAmount * 52,
    band, rate: rate * 100, basicPlusRate: basicPlusRate * 100, reducedT, capped: grossWeeklyIncome > 3000,
    onBenefit, sharedCareNote, floored,
  }
}

export default function ChildMaintenanceCalculator() {
  const [income, setIncome] = useState('600')
  const [children, setChildren] = useState('1')
  const [nights, setNights] = useState('0')
  const [otherChildren, setOtherChildren] = useState('0')
  const [onBenefit, setOnBenefit] = useState(false)

  const i = parseFloat(income) || 0
  const c = parseInt(children) || 1
  const n = parseInt(nights) || 0
  const oc = parseInt(otherChildren) || 0
  const result = useMemo(() => calculate(i, c, n, oc, onBenefit), [i, c, n, oc, onBenefit])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Gross Weekly Income</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" max="3000" value={income} onChange={(e) => setIncome(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Gross Weekly Income" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Children to Pay For</label><input type="number" min="1" max="10" value={children} onChange={(e) => setChildren(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Children to Pay For" /></div>
        <div><label className="block text-sm font-medium mb-2">Shared Care (nights with you)</label><select value={nights} onChange={(e) => setNights(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Shared Care (nights with you)">
          <option value="0">Fewer than 52 nights a year (no reduction)</option>
          <option value="1">1 night a week (52–103 a year, 1/7)</option>
          <option value="2">2 nights (104–155, 2/7)</option>
          <option value="3">3 nights (156–174, 3/7)</option>
          <option value="4">Equal care, 175 or more nights a year (50% plus £7 a week per child)</option>
        </select></div>
        <div><label className="block text-sm font-medium mb-2">Other Children in Household</label><input type="number" min="0" max="10" value={otherChildren} onChange={(e) => setOtherChildren(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Other Children in Household" /></div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={onBenefit} onChange={(e) => setOnBenefit(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Paying parent receives a qualifying benefit (flat rate £7)</span></label>

      <div className="space-y-4 animate-fade-in-up">
        <div className="rounded-2xl bg-primary/10 p-6 text-center">
          <p className="text-sm text-muted-foreground">Weekly Child Maintenance</p>
          <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.weeklyAmount)}</p>
          <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.monthlyAmount)}/month &middot; {formatCurrency(result.annualAmount)}/year</p>
        </div>
        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
          <p>
            {result.band === 'nil' && (result.onBenefit ? <>Nil rate: a flat-rate payer on a qualifying benefit with shared care of 52 nights a year or more pays nothing.</> : <>Nil rate: gross income under £7 a week.</>)}
            {result.band === 'flat' && (result.onBenefit ? <>Flat rate: £7 a week because the paying parent gets a qualifying benefit, whatever the number of children.</> : <>Flat rate: £7 a week, whatever the number of children.</>)}
            {result.band === 'reduced' && <>Reduced rate: £7 plus {result.reducedT}% of income over £100 for {c} child{c > 1 ? 'ren' : ''}.</>}
            {result.band === 'basic' && <>Basic rate: {result.rate}% for {c} child{c > 1 ? 'ren' : ''}.</>}
            {result.band === 'basic plus' && <>Basic rate plus: {result.rate}% on the first £800, then {result.basicPlusRate}% on the rest.</>}
            {result.sharedCareNote && <> {result.sharedCareNote}</>}
            {result.floored && <> Raised to the £7 a week minimum.</>}
            {result.capped && <> Income over £3,000 a week is ignored; the receiving parent can ask a court for more.</>}
          </p>
          <p className="mt-1">CMS rate bands (gross weekly income): under £7 = nil rate; £7–£100 = flat rate (£7/week); £100.01–£199.99 = reduced rate (£7 plus 17%/25%/31% of income over £100 for 1/2/3+ children, less if other children live with you); £200–£800 = basic rate (12%/16%/19%); £800.01–£3,000 = basic-plus (the basic rate on the first £800, then 9%/12%/15% on the excess).</p>
          <p className="mt-1">Shared care (reduced and basic rates): 52–103 nights a year takes off 1/7, 104–155 nights 2/7, 156–174 nights 3/7, and 175 or more halves the amount and takes a further £7 a week off for each child. The result cannot fall below £7 a week.</p>
        </div>
      </div>
    </div>
  )
}
