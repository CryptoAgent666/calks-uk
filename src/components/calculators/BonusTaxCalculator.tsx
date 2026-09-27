import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent } from '@/utils'

const PA = 12_570
const BASIC = 50_270
const HIGHER = 125_140

// Employee Class 1 NI thresholds 2026/27 per earnings period (gov.uk rates and thresholds for employers)
type PayFrequency = 'monthly' | 'weekly'
const NI_PERIODS: Record<PayFrequency, { periods: number; pt: number; uel: number }> = {
  monthly: { periods: 12, pt: 1_048, uel: 4_189 },
  weekly: { periods: 52, pt: 242, uel: 967 },
}

// Income tax: annual (cumulative PAYE) basis, so the figure is where PAYE ends up by 5 April.
// Employee NI: worked out per pay period for employees (non-cumulative), so a bonus paid in one
// period loses more NI than an annual calculation suggests. Directors use an annual earnings period.
function calculate(salary: number, bonus: number, frequency: PayFrequency = 'monthly', isDirector = false) {
  const { periods, pt, uel } = NI_PERIODS[frequency]
  const periodPay = salary / periods

  const taxOnBonus = calcTax(salary + bonus) - calcTax(salary)
  const niOnBonus = isDirector
    ? calcNI(salary + bonus, PA, BASIC) - calcNI(salary, PA, BASIC)
    : calcNI(periodPay + bonus, pt, uel) - calcNI(periodPay, pt, uel)

  const totalDeductions = taxOnBonus + niOnBonus
  const netBonus = bonus - totalDeductions

  // Normal pay period vs the period the bonus is paid in
  const normalTax = calcTax(salary) / periods
  const normalNI = isDirector ? calcNI(salary, PA, BASIC) / periods : calcNI(periodPay, pt, uel)
  const normalNet = periodPay - normalTax - normalNI
  const bonusPeriodGross = periodPay + bonus
  const bonusPeriodNet = normalNet + netBonus

  return {
    bonus, taxOnBonus, niOnBonus, totalDeductions, netBonus,
    effectiveRate: bonus > 0 ? (totalDeductions / bonus) * 100 : 0,
    periodPay, normalNet, bonusPeriodGross, bonusPeriodNet,
  }
}

function calcTax(income: number) {
  let pa = PA
  if (income > 100_000) pa = Math.max(0, PA - Math.floor((income - 100_000) / 2))
  let tax = 0
  if (income > pa) {
    if (income <= BASIC) tax = (income - pa) * 0.20
    else if (income <= HIGHER) tax = 37_700 * 0.20 + (income - pa - 37_700) * 0.40
    else tax = 37_700 * 0.20 + (HIGHER - 37_700) * 0.40 + (income - HIGHER) * 0.45
  }
  return tax
}

// Employee Class 1 NI: 8% between the primary threshold and UEL, 2% above
function calcNI(pay: number, pt: number, uel: number) {
  if (pay <= pt) return 0
  if (pay <= uel) return (pay - pt) * 0.08
  return (uel - pt) * 0.08 + (pay - uel) * 0.02
}

export default function BonusTaxCalculator() {
  const [salary, setSalary] = useState('35000')
  const [bonus, setBonus] = useState('5000')
  const [frequency, setFrequency] = useState<PayFrequency>('monthly')
  const [isDirector, setIsDirector] = useState(false)

  const s = parseFloat(salary.replace(/,/g, '')) || 0
  const b = parseFloat(bonus.replace(/,/g, '')) || 0
  const result = useMemo(() => calculate(s, b, frequency, isDirector), [s, b, frequency, isDirector])
  const periodLabel = frequency === 'monthly' ? 'month' : 'week'

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Annual Salary (before bonus)</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="35,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Annual Salary (before bonus)" /></div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Bonus Amount</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={bonus} onChange={(e) => setBonus(e.target.value)} placeholder="5,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Bonus Amount" /></div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Pay Frequency</label>
          <select value={frequency} onChange={(e) => setFrequency(e.target.value as PayFrequency)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Pay Frequency">
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-3 cursor-pointer pb-3"><input type="checkbox" checked={isDirector} onChange={(e) => setIsDirector(e.target.checked)} className="h-5 w-5 rounded border-border" aria-label="Company director" /><span className="text-sm">Company director (NI on an annual earnings period)</span></label>
        </div>
      </div>

      {b > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Bonus After Tax</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.netBonus)}</p>
            <p className="text-sm text-muted-foreground mt-1">of {formatCurrency(result.bonus)} bonus</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Gross Bonus</p><p className="text-lg font-bold">{formatCurrency(result.bonus)}</p></div>
            <div className="rounded-xl bg-destructive/10 p-4 text-center"><p className="text-xs text-muted-foreground">Income Tax</p><p className="text-lg font-bold text-destructive">-{formatCurrency(result.taxOnBonus)}</p></div>
            <div className="rounded-xl bg-destructive/10 p-4 text-center"><p className="text-xs text-muted-foreground">National Insurance</p><p className="text-lg font-bold text-destructive">-{formatCurrency(result.niOnBonus)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Effective Rate</p><p className="text-lg font-bold">{formatPercent(result.effectiveRate)}</p></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center">
              <p className="text-xs text-muted-foreground">Normal {periodLabel}</p>
              <p className="text-lg font-bold">{formatCurrency(result.normalNet)}</p>
              <p className="text-xs text-muted-foreground">take-home from {formatCurrency(result.periodPay)} gross</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4 text-center">
              <p className="text-xs text-muted-foreground">Bonus {periodLabel}</p>
              <p className="text-lg font-bold">{formatCurrency(result.bonusPeriodNet)}</p>
              <p className="text-xs text-muted-foreground">take-home from {formatCurrency(result.bonusPeriodGross)} gross</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {isDirector
              ? 'Directors pay NI on an annual earnings period, so NI on the bonus is worked out on annual pay. '
              : `NI is worked out on each ${periodLabel}'s pay on its own (2026/27: 8% between ${frequency === 'monthly' ? '£1,048 and £4,189 a month' : '£242 and £967 a week'}, 2% above), so a bonus paid in one ${periodLabel} loses more NI than an annual calculation suggests. `}
            Income tax is shown on the annual basis that cumulative PAYE reaches by 5 April. The bonus payslip can show more tax, which comes back through lower tax in later pay periods. Pension and student loan deductions are not included.
          </p>
        </div>
      )}
    </div>
  )
}
