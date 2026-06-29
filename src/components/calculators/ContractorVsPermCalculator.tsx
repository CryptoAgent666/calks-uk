import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(permSalary: number, contractDayRate: number, daysPerYear: number) {
  // Perm benefits value
  const permPension = permSalary * 0.03
  const permHoliday = permSalary / 260 * 28 // 28 days
  const permSickPay = permSalary / 260 * 5 // ~5 days avg
  const permTotalPackage = permSalary + permPension + permHoliday + permSickPay

  // Contract
  const contractGross = contractDayRate * daysPerYear
  const contractExpenses = 3000
  const contractAccountancy = 1200
  const contractInsurance = 500

  // Equivalent day rate for perm
  const permDayRate = permTotalPackage / 260

  const premiumPct = permDayRate > 0 ? ((contractDayRate / permDayRate) - 1) * 100 : 0

  return { permSalary, permPension, permHoliday, permSickPay, permTotalPackage, permDayRate, contractGross, contractExpenses, contractAccountancy, contractInsurance, premiumPct, contractDayRate }
}

export default function ContractorVsPermCalculator() {
  const [perm, setPerm] = useState('55000')
  const [rate, setRate] = useState('400')
  const [days, setDays] = useState('220')

  const p = parseFloat(perm.replace(/,/g,'')) || 0
  const r = parseFloat(rate) || 0
  const d = parseInt(days) || 220
  const result = useMemo(() => calculate(p, r, d), [p, r, d])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Permanent Salary</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={perm} onChange={(e) => setPerm(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Permanent Salary" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Contract Day Rate</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="100" max="2000" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Contract Day Rate" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Working Days/Year</label><input type="number" min="150" max="260" value={days} onChange={(e) => setDays(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Working Days/Year" /></div>
      </div>

      {p > 0 && r > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-border p-5 text-center"><p className="text-sm font-medium">Permanent (total package)</p><p className="text-2xl font-bold mt-1">{formatCurrency(result.permTotalPackage)}</p><p className="text-xs text-muted-foreground">{formatCurrency(result.permDayRate)}/day effective</p></div>
            <div className="rounded-xl bg-primary/10 p-5 text-center"><p className="text-sm font-medium">Contract (gross)</p><p className="text-2xl font-bold text-primary mt-1">{formatCurrency(result.contractGross)}</p><p className="text-xs text-muted-foreground">£{r}/day x {d} days</p></div>
          </div>
          <div className="rounded-xl bg-muted/50 p-4 text-center">
            <p className="text-sm text-muted-foreground">Contract premium over perm</p>
            <p className="text-xl font-bold">{result.premiumPct > 0 ? '+' : ''}{result.premiumPct.toFixed(0)}%</p>
            <p className="text-xs text-muted-foreground">Day rate should be 30-50% above perm equivalent to account for no holiday, sick pay, pension, or job security</p>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Perm benefits included:</p>
            <p>Pension ({formatCurrency(result.permPension)}) + Holiday ({formatCurrency(result.permHoliday)}) + Sick Pay ({formatCurrency(result.permSickPay)}) = {formatCurrency(result.permTotalPackage - result.permSalary)} on top of salary</p>
          </div>
        </div>
      )}
    </div>
  )
}
