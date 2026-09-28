import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Auto-enrolment qualifying earnings band 2026/27
const QE_LOWER = 6_240
const QE_UPPER = 50_270

// The Apprenticeship Levy (0.5% of an employer's whole pay bill above £3m, less a
// £15,000 allowance) depends on the total pay bill, not one salary, so it is
// left out here.
function calculate(salary: number, pensionPct: number, trainingBudget: number, equipmentBudget: number, recruitmentCost: number, benefits = 0) {
  const employerNI = Math.max(0, (salary - 5_000) * 0.15)
  const qualifyingEarnings = Math.max(0, Math.min(salary, QE_UPPER) - QE_LOWER)
  const pension = qualifyingEarnings * (pensionPct / 100)
  const totalCost = salary + employerNI + pension + benefits + trainingBudget + equipmentBudget + (recruitmentCost / 3) // amortise over 3 years
  const overhead = totalCost - salary
  const overheadPct = salary > 0 ? (overhead / salary) * 100 : 0
  const costPerHour = totalCost / (37.5 * 52)
  const costPerDay = totalCost / 260

  return { salary, employerNI, qualifyingEarnings, pension, benefits, trainingBudget, equipmentBudget, recruitmentAmortised: recruitmentCost / 3, totalCost, overhead, overheadPct, costPerHour, costPerDay }
}

export default function EmployeeCostBreakdownCalculator() {
  const [salary, setSalary] = useState('35000')
  const [pension, setPension] = useState('3')
  const [training, setTraining] = useState('500')
  const [equipment, setEquipment] = useState('1000')
  const [recruitment, setRecruitment] = useState('3000')
  const [benefits, setBenefits] = useState('0')

  const s = parseFloat(salary.replace(/,/g,'')) || 0
  const result = useMemo(() => calculate(s, Math.max(0, parseFloat(pension) || 0), parseFloat(training)||0, parseFloat(equipment)||0, parseFloat(recruitment)||0, parseFloat(benefits)||0), [s, pension, training, equipment, recruitment, benefits])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Annual Salary</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={salary} onChange={(e) => setSalary(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Annual Salary" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Employer Pension (%)</label><input type="number" min="0" max="20" step="0.5" value={pension} onChange={(e) => setPension(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Employer Pension (% of qualifying earnings)" /><p className="text-xs text-muted-foreground mt-1">Of qualifying earnings (£6,240 to £50,270); minimum 3%</p></div>
        <div><label className="block text-sm font-medium mb-2">Benefits (£/yr)</label><input type="number" min="0" value={benefits} onChange={(e) => setBenefits(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Benefits (£/yr)" /><p className="text-xs text-muted-foreground mt-1">Private medical, insurance and similar</p></div>
        <div><label className="block text-sm font-medium mb-2">Training (£/yr)</label><input type="number" min="0" value={training} onChange={(e) => setTraining(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Training (£/yr)" /></div>
        <div><label className="block text-sm font-medium mb-2">Equipment (£/yr)</label><input type="number" min="0" value={equipment} onChange={(e) => setEquipment(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Equipment (£/yr)" /></div>
        <div><label className="block text-sm font-medium mb-2">Recruitment Cost</label><input type="number" min="0" value={recruitment} onChange={(e) => setRecruitment(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Recruitment Cost" /><p className="text-xs text-muted-foreground mt-1">Amortised over 3 years</p></div>
      </div>

      {s > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">True Annual Cost of Employment</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.totalCost)}</p>
            <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.costPerDay)}/day &middot; {formatCurrency(result.costPerHour)}/hour &middot; {result.overheadPct.toFixed(0)}% overhead</p>
          </div>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border/50"><td className="py-2">Salary</td><td className="text-right tabular-nums">{formatCurrency(result.salary)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Employer NI (15%)</td><td className="text-right tabular-nums">{formatCurrency(result.employerNI)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Employer pension ({pension || 0}% of {formatCurrency(result.qualifyingEarnings)} qualifying earnings)</td><td className="text-right tabular-nums">{formatCurrency(result.pension)}</td></tr>
              {result.benefits > 0 && <tr className="border-b border-border/50"><td className="py-2">Benefits</td><td className="text-right tabular-nums">{formatCurrency(result.benefits)}</td></tr>}
              <tr className="border-b border-border/50"><td className="py-2">Training</td><td className="text-right tabular-nums">{formatCurrency(result.trainingBudget)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Equipment</td><td className="text-right tabular-nums">{formatCurrency(result.equipmentBudget)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Recruitment (amortised)</td><td className="text-right tabular-nums">{formatCurrency(result.recruitmentAmortised)}</td></tr>
              <tr className="font-semibold"><td className="py-2">Total</td><td className="text-right tabular-nums">{formatCurrency(result.totalCost)}</td></tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
