import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

const PLANS = {
  plan1: { name: 'Plan 1 (pre-2012)', threshold: 26_900, rate: 0.09 },
  plan2: { name: 'Plan 2 (post-2012)', threshold: 29_385, rate: 0.09 },
  plan4: { name: 'Plan 4 (Scotland)', threshold: 33_795, rate: 0.09 },
  plan5: { name: 'Plan 5 (post-2023)', threshold: 25_000, rate: 0.09 },
  postgrad: { name: 'Postgraduate Loan', threshold: 21_000, rate: 0.06 },
}

type PlanId = keyof typeof PLANS

// gov.uk: with more than one undergraduate plan you repay a single 9% over the LOWEST of
// their thresholds. The lowest-threshold plan takes 9% of the band up to the next plan's
// threshold and the rest goes to the next plan. A Postgraduate Loan (6% over £21,000)
// is deducted alongside, not instead.
function calculate(salary: number, planIds: PlanId[]) {
  const undergrad = (Object.keys(PLANS) as PlanId[])
    .filter((id) => id !== 'postgrad' && planIds.includes(id))
    .sort((a, b) => PLANS[a].threshold - PLANS[b].threshold)

  const results = undergrad.map((id, i) => {
    const plan = PLANS[id]
    const next = undergrad[i + 1]
    const top = next ? Math.min(salary, PLANS[next].threshold) : salary
    const annual = Math.max(0, top - plan.threshold) * plan.rate
    return {
      plan: plan.name,
      threshold: plan.threshold,
      rate: plan.rate,
      annualRepayment: annual,
      monthlyRepayment: annual / 12,
    }
  })

  if (planIds.includes('postgrad')) {
    const plan = PLANS.postgrad
    const annual = Math.max(0, salary - plan.threshold) * plan.rate
    results.push({
      plan: plan.name,
      threshold: plan.threshold,
      rate: plan.rate,
      annualRepayment: annual,
      monthlyRepayment: annual / 12,
    })
  }

  const totalAnnual = results.reduce((sum, r) => sum + r.annualRepayment, 0)
  const totalMonthly = totalAnnual / 12
  const undergradThreshold = undergrad.length ? PLANS[undergrad[0]].threshold : 0

  return { results, totalAnnual, totalMonthly, multipleUndergrad: undergrad.length > 1, undergradThreshold }
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
           aria-label="Annual Gross Salary" />
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

          {result.multipleUndergrad && (
            <p className="text-xs text-muted-foreground">
              With more than one undergraduate plan you pay a single 9% of income over the lowest threshold ({formatCurrency(result.undergradThreshold)}), not 9% per plan. The split shown follows the SLC rule: the lowest-threshold plan takes the slice up to the next plan&apos;s threshold and the rest goes to the other loan.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
