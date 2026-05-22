import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(contribution: number, salary: number) {
  const basicRelief = contribution * 0.20 // automatically added by provider
  const grossContribution = contribution + basicRelief

  // Higher rate reclaim via self-assessment
  let higherRelief = 0
  let additionalRelief = 0

  if (salary > 50_270) {
    const higherIncome = Math.min(salary, 125_140) - 50_270
    const contributionInHigher = Math.min(grossContribution, higherIncome)
    higherRelief = contributionInHigher * 0.20 // extra 20% to claim back
  }
  if (salary > 125_140) {
    const additionalIncome = salary - 125_140
    const contributionInAdditional = Math.min(Math.max(0, grossContribution - (salary - 125_140)), additionalIncome)
    additionalRelief = contributionInAdditional * 0.25 // extra 25% to claim back
  }

  const totalRelief = basicRelief + higherRelief + additionalRelief
  const netCost = contribution
  const effectiveRate = grossContribution > 0 ? (totalRelief / grossContribution) * 100 : 0

  return { contribution, grossContribution, basicRelief, higherRelief, additionalRelief, totalRelief, netCost, effectiveRate }
}

export default function PensionTaxReliefCalculator() {
  const [contribution, setContribution] = useState('')
  const [salary, setSalary] = useState('50000')

  const c = parseFloat(contribution.replace(/,/g, '')) || 0
  const s = parseFloat(salary.replace(/,/g, '')) || 0
  const result = useMemo(() => calculate(c, s), [c, s])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Your Personal Contribution (net)</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={contribution} onChange={(e) => setContribution(e.target.value)} placeholder="5,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Your Personal Contribution (net)" /></div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Annual Salary</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="50,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Annual Salary" /></div>
        </div>
      </div>

      {c > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-green-100 dark:bg-green-950 p-6 text-center">
            <p className="text-sm text-muted-foreground">Total Tax Relief</p>
            <p className="text-3xl font-bold text-green-700 dark:text-green-400 mt-1">{formatCurrency(result.totalRelief)}</p>
            <p className="text-sm text-muted-foreground mt-1">Your {formatCurrency(c)} becomes {formatCurrency(result.grossContribution)} in your pension</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Basic Rate Relief (20%)</p><p className="text-lg font-bold text-green-600">{formatCurrency(result.basicRelief)}</p><p className="text-xs text-muted-foreground">Auto-added by provider</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Higher Rate (extra 20%)</p><p className="text-lg font-bold text-green-600">{formatCurrency(result.higherRelief)}</p><p className="text-xs text-muted-foreground">Claim via self-assessment</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Additional Rate (extra 25%)</p><p className="text-lg font-bold text-green-600">{formatCurrency(result.additionalRelief)}</p><p className="text-xs text-muted-foreground">Claim via self-assessment</p></div>
          </div>
        </div>
      )}
    </div>
  )
}
