import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

const QUALIFYING_BENEFITS = [
  { id: 'uc', name: 'Universal Credit (net income under £7,400/yr)', qualifies: true },
  { id: 'jsa', name: 'Income-based Jobseeker\'s Allowance', qualifies: true },
  { id: 'esa', name: 'Income-related Employment & Support Allowance', qualifies: true },
  { id: 'is', name: 'Income Support', qualifies: true },
  { id: 'ctc', name: 'Child Tax Credit (income under £16,190)', qualifies: true },
  { id: 'gtc', name: 'Working Tax Credit run-on (4 weeks after stopping)', qualifies: true },
  { id: 'pension', name: 'Pension Credit (guarantee element)', qualifies: true },
  { id: 'asylum', name: 'Support under Part VI Immigration Act', qualifies: true },
  { id: 'none', name: 'None of the above', qualifies: false },
]

const MEAL_VALUE = 2.65 // approx value per school meal

function calculate(children: number, selectedBenefit: string) {
  const benefit = QUALIFYING_BENEFITS.find(b => b.id === selectedBenefit)
  const eligible = benefit?.qualifies || false
  const annualSaving = eligible ? children * MEAL_VALUE * 190 : 0 // ~190 school days
  const weeklySaving = eligible ? children * MEAL_VALUE * 5 : 0

  return { eligible, annualSaving, weeklySaving, mealValue: MEAL_VALUE, schoolDays: 190 }
}

export default function FreeschoolMealsCalculator() {
  const [children, setChildren] = useState('2')
  const [benefit, setBenefit] = useState('uc')

  const c = parseInt(children) || 0
  const result = useMemo(() => calculate(c, benefit), [c, benefit])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">School-Age Children</label><input type="number" min="1" max="10" value={children} onChange={(e) => setChildren(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="School-Age Children" /></div>
        <div><label className="block text-sm font-medium mb-2">Qualifying Benefit</label><select value={benefit} onChange={(e) => setBenefit(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Qualifying Benefit">{QUALIFYING_BENEFITS.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}</select></div>
      </div>

      <div className={`rounded-2xl p-6 text-center ${result.eligible ? 'bg-green-100 dark:bg-green-950' : 'bg-muted/50'}`}>
        {result.eligible ? (
          <>
            <p className="text-lg font-bold text-green-700 dark:text-green-400">Your children qualify for free school meals!</p>
            <p className="text-2xl font-bold text-green-700 dark:text-green-400 mt-2">Saving {formatCurrency(result.annualSaving)}/year</p>
            <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.weeklySaving)}/week for {c} child{c !== 1 ? 'ren' : ''}</p>
          </>
        ) : (
          <p className="text-lg font-medium text-muted-foreground">Based on selected benefit, your children may not qualify for free school meals</p>
        )}
      </div>

      <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Also eligible:</p>
        <p>All children in Reception, Year 1 and Year 2 get Universal Infant Free School Meals regardless of income.</p>
        <p className="mt-1">Registering for FSM also unlocks Pupil Premium funding (£1,480 per primary pupil) for your child's school.</p>
      </div>
    </div>
  )
}
