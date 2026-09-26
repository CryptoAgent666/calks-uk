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

type Band = 'nil' | 'flat' | 'reduced' | 'basic' | 'basic plus'

function calculate(grossWeeklyIncome: number, children: number, nightsPerWeek: number, otherChildren: number) {
  // Gross weekly income over £3,000 is ignored (Sch 1 para 10(3)); above that the court can top up
  const gross = Math.min(grossWeeklyIncome, 3000)
  const kids = Math.min(Math.max(children, 1), 3)

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
  if (gross < 7) {
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

  // Shared care reduction (reduced and basic rates only)
  if (nightsPerWeek >= 1 && (band === 'reduced' || band === 'basic' || band === 'basic plus')) {
    const reductions: Record<number, number> = { 1: 1/7, 2: 2/7, 3: 3/7 }
    const reduction = reductions[Math.min(nightsPerWeek, 3)] || 3/7
    weeklyAmount *= (1 - reduction)
  }

  return {
    weeklyAmount, monthlyAmount: weeklyAmount * 52 / 12, annualAmount: weeklyAmount * 52,
    band, rate: rate * 100, basicPlusRate: basicPlusRate * 100, reducedT, capped: grossWeeklyIncome > 3000,
  }
}

export default function ChildMaintenanceCalculator() {
  const [income, setIncome] = useState('600')
  const [children, setChildren] = useState('1')
  const [nights, setNights] = useState('0')
  const [otherChildren, setOtherChildren] = useState('0')

  const i = parseFloat(income) || 0
  const c = parseInt(children) || 1
  const n = parseInt(nights) || 0
  const oc = parseInt(otherChildren) || 0
  const result = useMemo(() => calculate(i, c, n, oc), [i, c, n, oc])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Gross Weekly Income</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" max="3000" value={income} onChange={(e) => setIncome(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Gross Weekly Income" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Children to Pay For</label><input type="number" min="1" max="10" value={children} onChange={(e) => setChildren(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Children to Pay For" /></div>
        <div><label className="block text-sm font-medium mb-2">Shared Care Nights/Week</label><select value={nights} onChange={(e) => setNights(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Shared Care Nights/Week">
          <option value="0">0 nights (no reduction)</option><option value="1">1 night (1/7 reduction)</option><option value="2">2 nights (2/7 reduction)</option><option value="3">3+ nights (3/7 reduction)</option>
        </select></div>
        <div><label className="block text-sm font-medium mb-2">Other Children in Household</label><input type="number" min="0" max="10" value={otherChildren} onChange={(e) => setOtherChildren(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Other Children in Household" /></div>
      </div>

      <div className="space-y-4 animate-fade-in-up">
        <div className="rounded-2xl bg-primary/10 p-6 text-center">
          <p className="text-sm text-muted-foreground">Weekly Child Maintenance</p>
          <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.weeklyAmount)}</p>
          <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.monthlyAmount)}/month &middot; {formatCurrency(result.annualAmount)}/year</p>
        </div>
        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
          <p>
            {result.band === 'nil' && <>Nil rate: gross income under £7 a week.</>}
            {result.band === 'flat' && <>Flat rate: £7 a week, whatever the number of children.</>}
            {result.band === 'reduced' && <>Reduced rate: £7 plus {result.reducedT}% of income over £100 for {c} child{c > 1 ? 'ren' : ''}.</>}
            {result.band === 'basic' && <>Basic rate: {result.rate}% for {c} child{c > 1 ? 'ren' : ''}.</>}
            {result.band === 'basic plus' && <>Basic rate plus: {result.rate}% on the first £800, then {result.basicPlusRate}% on the rest.</>}
            {result.capped && <> Income over £3,000 a week is ignored; the receiving parent can ask a court for more.</>}
          </p>
          <p className="mt-1">CMS rate bands (gross weekly income): under £7 = nil rate; £7–£100 = flat rate (£7/week); £100.01–£199.99 = reduced rate (£7 plus 17%/25%/31% of income over £100 for 1/2/3+ children, less if other children live with you); £200–£800 = basic rate (12%/16%/19%); £800.01–£3,000 = basic-plus (the basic rate on the first £800, then 9%/12%/15% on the excess).</p>
        </div>
      </div>
    </div>
  )
}
