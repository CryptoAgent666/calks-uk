import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

type PupilPremium = 'yes' | 'maybe' | 'no'

// England, from September 2026 (DfE free school meals guidance)
const QUALIFYING_BENEFITS: { id: string; name: string; qualifies: boolean; pupilPremium: PupilPremium | 'earnings' }[] = [
  { id: 'uc', name: 'Universal Credit', qualifies: true, pupilPremium: 'earnings' },
  { id: 'esa', name: 'Income-related Employment and Support Allowance', qualifies: true, pupilPremium: 'maybe' },
  { id: 'pension', name: 'Pension Credit (guarantee element)', qualifies: true, pupilPremium: 'maybe' },
  { id: 'asylum', name: 'Support under Part VI of the Immigration and Asylum Act 1999', qualifies: true, pupilPremium: 'yes' },
  { id: 'none', name: 'None of the above', qualifies: false, pupilPremium: 'no' },
]

const MEAL_VALUE = 2.66 // UIFSM funding rate per meal, 2026/27
const SCHOOL_DAYS = 190
const TARGETED_EARNINGS_LIMIT = 7400 // net earned income a year, after tax, excluding benefits

function calculate(children: number, selectedBenefit: string, netEarnings: number) {
  const benefit = QUALIFYING_BENEFITS.find(b => b.id === selectedBenefit)
  const eligible = benefit?.qualifies || false
  let pupilPremium: PupilPremium = 'no'
  if (benefit?.pupilPremium === 'earnings') pupilPremium = netEarnings <= TARGETED_EARNINGS_LIMIT ? 'yes' : 'no'
  else if (benefit) pupilPremium = benefit.pupilPremium
  const route = !eligible ? 'none' : selectedBenefit === 'uc' && pupilPremium === 'no' ? 'expanded' : 'targeted'
  const annualSaving = eligible ? children * MEAL_VALUE * SCHOOL_DAYS : 0
  const weeklySaving = eligible ? children * MEAL_VALUE * 5 : 0

  return { eligible, pupilPremium, route, annualSaving, weeklySaving, mealValue: MEAL_VALUE, schoolDays: SCHOOL_DAYS }
}

export default function FreeschoolMealsCalculator() {
  const [children, setChildren] = useState('2')
  const [benefit, setBenefit] = useState('uc')
  const [earnings, setEarnings] = useState('6000')

  const c = parseInt(children) || 0
  const e = parseFloat(earnings.replace(/,/g, '')) || 0
  const result = useMemo(() => calculate(c, benefit, e), [c, benefit, e])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">School-Age Children</label><input type="number" min="1" max="10" value={children} onChange={(e) => setChildren(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="School-Age Children" /></div>
        <div><label className="block text-sm font-medium mb-2">Qualifying Benefit</label><select value={benefit} onChange={(e) => setBenefit(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Qualifying Benefit">{QUALIFYING_BENEFITS.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}</select></div>
        {benefit === 'uc' && (
          <div className="sm:col-span-2"><label className="block text-sm font-medium mb-2">Household Net Earned Income (£/year, after tax, excluding benefits)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={earnings} onChange={(e) => setEarnings(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Household Net Earned Income" /></div></div>
        )}
      </div>

      <div className={`rounded-2xl p-6 text-center ${result.eligible ? 'bg-green-100 dark:bg-green-950' : 'bg-muted/50'}`}>
        {result.eligible ? (
          <>
            <p className="text-lg font-bold text-green-700 dark:text-green-400">Free school meals: yes</p>
            <p className="text-2xl font-bold text-green-700 dark:text-green-400 mt-2">Saving {formatCurrency(result.annualSaving)}/year</p>
            <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.weeklySaving)}/week for {c} child{c !== 1 ? 'ren' : ''} ({result.schoolDays} school days at £{result.mealValue.toFixed(2)} a meal)</p>
          </>
        ) : (
          <p className="text-lg font-medium text-muted-foreground">Based on the selected benefit, your children may not qualify for benefits-based free school meals</p>
        )}
      </div>

      {result.eligible && (
        <div className="rounded-xl bg-muted/50 p-4 text-sm">
          <p className="font-medium">Pupil premium and linked help: {result.pupilPremium === 'yes' ? 'yes' : result.pupilPremium === 'maybe' ? 'possibly' : 'no'}</p>
          <p className="text-muted-foreground mt-1">
            {result.pupilPremium === 'yes' && 'Your children count as Targeted FSM, so registering also brings pupil premium into the school (£1,550 per primary pupil, £1,100 per secondary pupil) and opens holiday activities and food places and extended free school travel.'}
            {result.pupilPremium === 'maybe' && 'DfE guidance says households on this benefit may also be eligible for Targeted FSM, which brings pupil premium, holiday activities and food places and extended free school travel. The school or council will confirm.'}
            {result.pupilPremium === 'no' && 'With net earnings over £7,400 a year your children get Expanded FSM: the meals only. Pupil premium, holiday activities and food places and extended free school travel go to the Targeted FSM group.'}
          </p>
        </div>
      )}

      <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Also eligible:</p>
        <p>All children in Reception, Year 1 and Year 2 in England get Universal Infant Free School Meals regardless of income, so for them the saving above is not extra.</p>
        <p className="mt-1"><strong className="text-foreground">From September 2026</strong> (academic year 2026/27) every child in a household getting Universal Credit gets free meals in England. The £7,400 net earnings test now decides only who also gets pupil premium and other linked help.</p>
        <p className="mt-1">Families with no recourse to public funds can also qualify, subject to income limits: ask your council.</p>
        <p className="mt-1">Scotland: free for all P1 to P5 pupils, and P6 and P7 if you get Scottish Child Payment. Wales: free for all primary pupils.</p>
      </div>
    </div>
  )
}
