import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

type ChildAge = 'under2' | '2' | '3_4' | 'school'

const ENTITLEMENTS: Record<ChildAge, { freeHours: number; description: string; eligible: string }> = {
  under2: { freeHours: 30, description: '30 hours/week (full rollout from Sept 2025 for working parents, from 9 months old)', eligible: 'Working parents (or a working single parent), each expecting to earn at least £2,643.68 over the next 3 months (16 hrs/week at the National Living Wage, about £10,575 a year) and under £100K. Available from age 9 months.' },
  '2': { freeHours: 30, description: '30 hours/week for working parents (from Sept 2025); 15 hours if on qualifying benefits', eligible: 'Working parents each expecting to earn at least £2,643.68 over the next 3 months (16 hrs/week at the National Living Wage, about £10,575 a year) and under £100K; or 15 hours if you get certain benefits' },
  '3_4': { freeHours: 30, description: '30 hours/week for 3-4 year olds (working parents)', eligible: 'Working parents each expecting to earn at least £2,643.68 over the next 3 months (16 hrs/week at the National Living Wage, about £10,575 a year) and under £100K. All 3-4 year olds get 15 hrs regardless.' },
  school: { freeHours: 0, description: 'No free childcare entitlement (school age)', eligible: 'Tax-Free Childcare and childcare vouchers may still apply for wraparound care' },
}

function calculate(childAge: ChildAge, weeklyChildcareCost: number, hoursPerWeek: number, weeksPerYear: number) {
  const entitlement = ENTITLEMENTS[childAge]
  // Funded hours cover up to 30 of the hours you pay for, for 38 weeks a year
  const hourlyRate = hoursPerWeek > 0 ? weeklyChildcareCost / hoursPerWeek : 0
  const freeValue = Math.min(entitlement.freeHours, hoursPerWeek) * hourlyRate * Math.min(weeksPerYear, 38)
  const annualCost = weeklyChildcareCost * weeksPerYear
  const afterFreeHours = Math.max(0, annualCost - freeValue)

  // Tax-Free Childcare (20% govt top-up, max £2K/yr)
  const tfcTopUp = Math.min(afterFreeHours * 0.20, 2000)
  const finalCost = afterFreeHours - tfcTopUp
  const totalSaving = annualCost - finalCost

  return { entitlement, freeValue, annualCost, afterFreeHours, tfcTopUp, finalCost, totalSaving }
}

export default function ChildcareEntitlementCalculator() {
  const [age, setAge] = useState<ChildAge>('3_4')
  const [cost, setCost] = useState('250')
  const [hours, setHours] = useState('50')
  const [weeks, setWeeks] = useState('50')

  const c = parseFloat(cost) || 0
  const h = parseFloat(hours) || 0
  const w = parseInt(weeks) || 50
  const result = useMemo(() => calculate(age, c, h, w), [age, c, h, w])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {(Object.entries(ENTITLEMENTS) as [ChildAge, typeof ENTITLEMENTS[ChildAge]][]).map(([k, v]) => (
          <button key={k} onClick={() => setAge(k)} className={`px-3 py-3 rounded-xl text-sm text-left border transition-colors ${age === k ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>
            <div className="font-medium">{k === 'under2' ? 'Under 2' : k === '2' ? 'Age 2' : k === '3_4' ? 'Age 3-4' : 'School Age'}</div>
            <div className={`text-xs ${age === k ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{v.freeHours}hrs free</div>
          </button>
        ))}
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
            <tr className="border-b border-border/50"><td className="py-2 text-green-600">Free hours ({Math.min(result.entitlement.freeHours, h)}hrs/wk, 38 weeks)</td><td className="text-right tabular-nums text-green-600">-{formatCurrency(result.freeValue)}</td></tr>
            <tr className="border-b border-border/50"><td className="py-2 text-green-600">Tax-Free Childcare (20%)</td><td className="text-right tabular-nums text-green-600">-{formatCurrency(result.tfcTopUp)}</td></tr>
            <tr className="font-semibold"><td className="py-2">You Pay</td><td className="text-right tabular-nums">{formatCurrency(result.finalCost)}</td></tr>
          </tbody>
        </table>
        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Eligibility:</p>
          <p>{result.entitlement.eligible}</p>
        </div>
      </div>
    </div>
  )
}
