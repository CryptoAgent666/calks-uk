import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(salary: number, pensionPct: number, trainingBudget: number, equipmentBudget: number, recruitmentCost: number) {
  const employerNI = Math.max(0, (salary - 5_000) * 0.15)
  const pension = salary * (pensionPct / 100)
  const apprenticeshipLevy = salary > 3_000_000 / 10 ? salary * 0.005 : 0
  const totalCost = salary + employerNI + pension + trainingBudget + equipmentBudget + (recruitmentCost / 3) // amortise over 3 years
  const overhead = totalCost - salary
  const overheadPct = salary > 0 ? (overhead / salary) * 100 : 0
  const costPerHour = totalCost / (37.5 * 52)
  const costPerDay = totalCost / 260

  return { salary, employerNI, pension, trainingBudget, equipmentBudget, recruitmentAmortised: recruitmentCost / 3, totalCost, overhead, overheadPct, costPerHour, costPerDay }
}

export default function EmployeeCostBreakdownCalculator() {
  const [salary, setSalary] = useState('35000')
  const [pension, setPension] = useState('3')
  const [training, setTraining] = useState('500')
  const [equipment, setEquipment] = useState('1000')
  const [recruitment, setRecruitment] = useState('3000')

  const s = parseFloat(salary.replace(/,/g,'')) || 0
  const result = useMemo(() => calculate(s, parseFloat(pension)||3, parseFloat(training)||0, parseFloat(equipment)||0, parseFloat(recruitment)||0), [salary, pension, training, equipment, recruitment])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Annual Salary</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={salary} onChange={(e) => setSalary(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Pension (%)</label><input type="number" min="3" max="20" step="0.5" value={pension} onChange={(e) => setPension(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Training (£/yr)</label><input type="number" min="0" value={training} onChange={(e) => setTraining(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Equipment (£/yr)</label><input type="number" min="0" value={equipment} onChange={(e) => setEquipment(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Recruitment Cost</label><input type="number" min="0" value={recruitment} onChange={(e) => setRecruitment(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /><p className="text-xs text-muted-foreground mt-1">Amortised over 3 years</p></div>
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
              <tr className="border-b border-border/50"><td className="py-2">Pension ({pension}%)</td><td className="text-right tabular-nums">{formatCurrency(result.pension)}</td></tr>
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
