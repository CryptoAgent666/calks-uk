import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

type ChildAge = 'under2' | '2' | '3_4' | 'school'
type Household = 'working' | 'not_working' | 'benefits'

// Funded hours a week in term time (38 weeks) by household route and the child's age.
// Working-parent route: each parent expects to earn at least £2,643.68 over the next 3 months (16 hours
// a week at the £12.71 National Living Wage, about £10,575 a year) and has adjusted net income under
// £100,000; 30 hours from 9 months old. Universal 15 hours for every 3 and 4-year-old. Benefits route:
// 15 hours at age 2. gov.uk/check-eligible-free-childcare-if-youre-working, gov.uk/get-childcare.
const TERM_WEEKS = 38
const TFC_TOP_UP = 0.20
const TFC_MAX_PER_YEAR = 2000
const FREE_HOURS: Record<Household, Record<ChildAge, number>> = {
  working: { under2: 30, '2': 30, '3_4': 30, school: 0 },
  not_working: { under2: 0, '2': 0, '3_4': 15, school: 0 },
  benefits: { under2: 0, '2': 15, '3_4': 15, school: 0 },
}
const AGE_LABEL: Record<ChildAge, string> = { under2: 'Under 2', '2': 'Age 2', '3_4': 'Age 3-4', school: 'School Age' }
const HOUSEHOLD_OPTIONS: { value: Household; label: string }[] = [
  { value: 'working', label: 'Both parents working (or a working single parent), each earning £2,643.68+ a quarter and under £100,000' },
  { value: 'not_working', label: 'Not working, or either parent over £100,000' },
  { value: 'benefits', label: 'Receiving qualifying benefits' },
]
const EARNINGS_TEST = 'each expecting to earn at least £2,643.68 over the next 3 months (16 hours a week at the National Living Wage, about £10,575 a year) and under £100,000 adjusted net income'

function eligibilityNote(household: Household, age: ChildAge): string {
  if (age === 'school') return 'No free childcare entitlement at school age. Tax-Free Childcare (or the Universal Credit childcare element) can still help with wraparound care.'
  if (household === 'working') {
    if (age === 'under2') return `30 hours a week from the age of 9 months, and nothing before that, for working parents (or a working single parent), ${EARNINGS_TEST}.`
    if (age === '2') return `30 hours a week for working parents (or a working single parent), ${EARNINGS_TEST}.`
    return `30 hours a week for working parents (or a working single parent), ${EARNINGS_TEST}. Every 3 and 4-year-old gets 15 of those hours whatever the parents do.`
  }
  if (household === 'not_working') {
    if (age === '3_4') return 'The universal 15 hours a week for every 3 and 4-year-old, whatever the parents earn or do. The extra 15 hours needs each parent to pass the earnings test: at least £2,643.68 a quarter and under £100,000.'
    return 'No funded hours: the working-parent entitlement needs each parent to earn at least £2,643.68 a quarter and under £100,000, and the universal 15 hours starts the term after the third birthday.'
  }
  if (age === 'under2') return 'No funded hours before age 2 on the benefits route. The working-parent 30 hours starts at 9 months for parents who pass the earnings test.'
  if (age === '2') return '15 hours a week for 2-year-olds in families receiving certain benefits, looked-after children, and children with an Education, Health and Care plan.'
  return 'The universal 15 hours a week for every 3 and 4-year-old. The extra 15 hours needs each parent to pass the working-parent earnings test.'
}

function calculate(household: Household, childAge: ChildAge, weeklyChildcareCost: number, hoursPerWeek: number, weeksPerYear: number) {
  const freeHours = FREE_HOURS[household][childAge]
  const maxFundedHours = freeHours * TERM_WEEKS // 1,140 a year for 30 hours, 570 for 15
  const hourlyRate = hoursPerWeek > 0 ? weeklyChildcareCost / hoursPerWeek : 0
  const annualHours = hoursPerWeek * weeksPerYear
  // Term-time: up to freeHours a week for the weeks used (38 at most). Stretched (more than 38 weeks):
  // the same yearly total spread across the weeks used at fewer hours a week.
  const fundedHours = weeksPerYear > TERM_WEEKS
    ? Math.min(maxFundedHours, annualHours)
    : Math.min(freeHours, hoursPerWeek) * weeksPerYear
  const freeValue = fundedHours * hourlyRate
  const annualCost = weeklyChildcareCost * weeksPerYear
  const afterFreeHours = Math.max(0, annualCost - freeValue)

  // Tax-Free Childcare: government adds £2 per £8 (20% of the bill), max £2,000 a year per child. Needs the
  // same earnings test as the 30 hours and cannot be held alongside Universal Credit or tax credits.
  const tfcEligible = household === 'working'
  const tfcTopUp = tfcEligible ? Math.min(afterFreeHours * TFC_TOP_UP, TFC_MAX_PER_YEAR) : 0
  const finalCost = afterFreeHours - tfcTopUp
  const totalSaving = annualCost - finalCost

  return { freeHours, maxFundedHours, fundedHours, freeValue, annualCost, afterFreeHours, tfcEligible, tfcTopUp, finalCost, totalSaving, eligible: eligibilityNote(household, childAge) }
}

export default function ChildcareEntitlementCalculator() {
  const [household, setHousehold] = useState<Household>('working')
  const [age, setAge] = useState<ChildAge>('3_4')
  const [cost, setCost] = useState('250')
  const [hours, setHours] = useState('50')
  const [weeks, setWeeks] = useState('50')

  const c = parseFloat(cost) || 0
  const h = parseFloat(hours) || 0
  const w = Math.min(52, parseInt(weeks) || 50)
  const result = useMemo(() => calculate(household, age, c, h, w), [household, age, c, h, w])

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Household</label>
        <select value={household} onChange={(e) => setHousehold(e.target.value as Household)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Household">
          {HOUSEHOLD_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {(Object.keys(FREE_HOURS[household]) as ChildAge[]).map((k) => {
          const hrs = FREE_HOURS[household][k]
          return (
            <button key={k} onClick={() => setAge(k)} className={`px-3 py-3 rounded-xl text-sm text-left border transition-colors ${age === k ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>
              <div className="font-medium">{AGE_LABEL[k]}</div>
              <div className={`text-xs ${age === k ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{hrs === 0 ? 'No free hours' : k === 'under2' ? `${hrs}hrs from 9 months` : `${hrs}hrs free`}</div>
            </button>
          )
        })}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Weekly Childcare Cost</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" value={cost} onChange={(e) => setCost(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Weekly Childcare Cost" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Hours per Week</label><input type="number" min="1" max="60" value={hours} onChange={(e) => setHours(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Hours per Week" /></div>
        <div><label className="block text-sm font-medium mb-2">Weeks per Year</label><input type="number" min="1" max="52" value={weeks} onChange={(e) => setWeeks(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Weeks per Year" /></div>
      </div>

      <div className="space-y-4 animate-fade-in-up">
        <div className="rounded-2xl bg-green-100 dark:bg-green-950 p-6 text-center">
          <p className="text-sm text-muted-foreground">Total Annual Saving</p>
          <p className="text-3xl font-bold text-green-700 dark:text-green-400 mt-1">{formatCurrency(result.totalSaving)}</p>
          <p className="text-sm text-muted-foreground mt-1">You pay: {formatCurrency(result.finalCost)}/year instead of {formatCurrency(result.annualCost)}</p>
        </div>
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-border/50"><td className="py-2">Annual childcare cost</td><td className="text-right tabular-nums">{formatCurrency(result.annualCost)}</td></tr>
            <tr className="border-b border-border/50"><td className="py-2 text-green-600">Funded hours ({result.maxFundedHours > 0 ? `${result.fundedHours.toLocaleString()} of ${result.maxFundedHours.toLocaleString()} a year` : 'none on this route'})</td><td className="text-right tabular-nums text-green-600">-{formatCurrency(result.freeValue)}</td></tr>
            <tr className="border-b border-border/50"><td className="py-2 text-green-600">Tax-Free Childcare ({result.tfcEligible ? '20%, max £2,000' : 'working households only'})</td><td className="text-right tabular-nums text-green-600">-{formatCurrency(result.tfcTopUp)}</td></tr>
            <tr className="font-semibold"><td className="py-2">You Pay</td><td className="text-right tabular-nums">{formatCurrency(result.finalCost)}</td></tr>
          </tbody>
        </table>
        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-1">
          <p className="font-medium text-foreground">Eligibility:</p>
          <p>{result.eligible}</p>
          <p>Funded hours: 1,140 a year for 30 hours, 570 for 15 hours, taken in term time (38 weeks) or stretched over more weeks at fewer hours. Tax-Free Childcare needs the same earnings test and cannot be held alongside Universal Credit or tax credits.</p>
        </div>
      </div>
    </div>
  )
}
