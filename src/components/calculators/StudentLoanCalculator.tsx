import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

const PLANS = {
  plan1: { name: 'Plan 1 (pre-2012)', threshold: 24_990, rate: 0.09 },
  plan2: { name: 'Plan 2 (post-2012)', threshold: 27_295, rate: 0.09 },
  plan4: { name: 'Plan 4 (Scotland)', threshold: 31_395, rate: 0.09 },
  plan5: { name: 'Plan 5 (post-2023)', threshold: 25_000, rate: 0.09 },
  postgrad: { name: 'Postgraduate Loan', threshold: 21_000, rate: 0.06 },
}

type PlanId = keyof typeof PLANS

function calculate(salary: number, planIds: PlanId[]) {
  const results = planIds.map((id) => {
    const plan = PLANS[id]
    const annual = salary > plan.threshold ? (salary - plan.threshold) * plan.rate : 0
    return {
      plan: plan.name,
      threshold: plan.threshold,
      rate: plan.rate,
      annualRepayment: annual,
      monthlyRepayment: annual / 12,
    }
  })

  const totalAnnual = results.reduce((sum, r) => sum + r.annualRepayment, 0)
  const totalMonthly = totalAnnual / 12

  return { results, totalAnnual, totalMonthly }
}

export default function StudentLoanCalculator() {
  const [salary, setSalary] = useState('')
  const [selectedPlans, setSelectedPlans] = useState<PlanId[]>(['plan2'])

  const gross = parseFloat(salary.replace(/,/g, '')) || 0

  const togglePlan = (planId: PlanId) => {
    setSelectedPlans((prev) =>
      prev.includes(planId) ? prev.filter((p) => p !== planId) : [...prev, planId]
    )
  }

  const result = useMemo(() => calculate(gross, selectedPlans), [gross, selectedPlans])

  return (
    <div className="space-y-6">
      {/* Plan Selection */}
      <div>
        <label className="block text-sm font-medium mb-2">Select your loan plan(s)</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {(Object.entries(PLANS) as [PlanId, typeof PLANS[PlanId]][]).map(([id, plan]) => (
            <button
              key={id}
              onClick={() => togglePlan(id)}
              className={`px-4 py-3 rounded-xl text-sm text-left transition-colors border ${
                selectedPlans.includes(id)
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-muted border-border hover:bg-accent'
              }`}
            >
              <div className="font-medium">{plan.name}</div>
              <div className={`text-xs ${selectedPlans.includes(id) ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                {(plan.rate * 100)}% above {formatCurrency(plan.threshold)}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Salary Input */}
      <div>
        <label htmlFor="sl-salary" className="block text-sm font-medium mb-2">Annual Gross Salary</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">£</span>
          <input
            id="sl-salary"
            type="text"
            inputMode="numeric"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            placeholder="35,000"
            className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Results */}
      {gross > 0 && selectedPlans.length > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Total Monthly Repayment</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.totalMonthly)}</p>
            <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.totalAnnual)} per year</p>
          </div>

          {result.results.length > 1 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 font-medium text-muted-foreground">Plan</th>
                    <th className="text-right py-2 font-medium text-muted-foreground">Monthly</th>
                    <th className="text-right py-2 font-medium text-muted-foreground">Annual</th>
                  </tr>
                </thead>
                <tbody>
                  {result.results.map((r) => (
                    <tr key={r.plan} className="border-b border-border/50">
                      <td className="py-2.5">{r.plan}</td>
                      <td className="text-right py-2.5 tabular-nums">{formatCurrency(r.monthlyRepayment)}</td>
                      <td className="text-right py-2.5 tabular-nums">{formatCurrency(r.annualRepayment)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
