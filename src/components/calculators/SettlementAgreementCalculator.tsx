import { useState, useMemo } from 'react'
import { formatCurrency, ukIncomeTax } from '@/utils'

// Employee Class 1 NI for 2026/27 on annual earnings: 8% between £12,570 and £50,270, 2% above
function employeeNI(pay: number) {
  if (pay <= 12_570) return 0
  return (Math.min(pay, 50_270) - 12_570) * 0.08 + Math.max(0, pay - 50_270) * 0.02
}

function calculate(salary: number, yearsService: number, age: number, noticePeriod: number, outstandingHoliday: number, bonusOwed: number, exGratia: number) {
  const weeklySalary = salary / 52
  const cappedWeekly = Math.min(weeklySalary, 751) // 2026/27 statutory weekly pay cap (£751 from 6 April 2026, was £719 in 2025/26)

  // Statutory redundancy (min element)
  // Statutory redundancy needs at least 2 full years' service
  let redWeeks = 0
  const years = yearsService >= 2 ? Math.min(yearsService, 20) : 0
  for (let y = 0; y < years; y++) {
    // A year counts at the higher rate only if you were that age throughout it (ERA 1996 s162/s119),
    // so each year is judged by your age at its start
    const ageAtYear = age - (years - y)
    if (ageAtYear < 22) redWeeks += 0.5
    else if (ageAtYear < 41) redWeeks += 1
    else redWeeks += 1.5
  }
  const statutoryRedundancy = redWeeks * cappedWeekly

  // Notice pay (taxable)
  const noticePay = (salary / 52) * noticePeriod

  // Holiday pay (taxable)
  const holidayPay = (salary / 260) * outstandingHoliday // 260 working days

  const totalGross = statutoryRedundancy + noticePay + holidayPay + bonusOwed + exGratia
  const taxFree = Math.min(statutoryRedundancy + exGratia, 30_000)
  const taxable = totalGross - taxFree

  // Income tax on the taxable part at your marginal rates, on top of a full year's salary
  // (so the higher rate and the personal allowance taper are picked up)
  const taxOnSettlement = ukIncomeTax(salary + taxable) - ukIncomeTax(salary)
  // Employee NI applies to notice, holiday and bonus pay; termination payments over £30,000
  // attract employer NI only
  const earnings = noticePay + holidayPay + bonusOwed
  const niOnSettlement = employeeNI(salary + earnings) - employeeNI(salary)
  const netSettlement = totalGross - taxOnSettlement - niOnSettlement

  return { statutoryRedundancy, noticePay, holidayPay, exGratia, totalGross, taxFree, taxable, taxOnSettlement, niOnSettlement, netSettlement, redWeeks }
}

export default function SettlementAgreementCalculator() {
  const [salary, setSalary] = useState('40000')
  const [years, setYears] = useState('5')
  const [age, setAge] = useState('35')
  const [notice, setNotice] = useState('4')
  const [holiday, setHoliday] = useState('10')
  const [bonus, setBonus] = useState('0')
  const [exGratia, setExGratia] = useState('10000')

  const s = parseFloat(salary.replace(/,/g,'')) || 0
  const y = parseInt(years) || 0
  const a = parseInt(age) || 0
  const n = parseInt(notice) || 0
  const h = parseInt(holiday) || 0
  const b = parseFloat(bonus.replace(/,/g,'')) || 0
  const x = parseFloat(exGratia.replace(/,/g,'')) || 0
  const result = useMemo(() => calculate(s, y, a, n, h, b, x), [s, y, a, n, h, b, x])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Annual Salary</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={salary} onChange={(e) => setSalary(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Annual Salary" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Years of Service</label><input type="number" min="0" max="40" value={years} onChange={(e) => setYears(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Years of Service" /></div>
        <div><label className="block text-sm font-medium mb-2">Age</label><input type="number" min="16" max="70" value={age} onChange={(e) => setAge(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Age" /></div>
        <div><label className="block text-sm font-medium mb-2">Notice Period (weeks)</label><input type="number" min="0" max="52" value={notice} onChange={(e) => setNotice(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Notice Period (weeks)" /></div>
        <div><label className="block text-sm font-medium mb-2">Outstanding Holiday (days)</label><input type="number" min="0" max="40" value={holiday} onChange={(e) => setHoliday(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Outstanding Holiday (days)" /></div>
        <div><label className="block text-sm font-medium mb-2">Bonus Owed</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={bonus} onChange={(e) => setBonus(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Bonus Owed" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Ex-gratia Offered</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={exGratia} onChange={(e) => setExGratia(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Ex-gratia Offered" /></div></div>
      </div>

      {s > 0 && y > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Estimated Net Settlement</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.netSettlement)}</p>
          </div>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border/50"><td className="py-2">Statutory Redundancy ({result.redWeeks} week{result.redWeeks === 1 ? '' : 's'})</td><td className="text-right tabular-nums">{formatCurrency(result.statutoryRedundancy)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Notice Pay ({n} week{n === 1 ? '' : 's'})</td><td className="text-right tabular-nums">{formatCurrency(result.noticePay)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Holiday Pay ({h} day{h === 1 ? '' : 's'})</td><td className="text-right tabular-nums">{formatCurrency(result.holidayPay)}</td></tr>
              {b > 0 && <tr className="border-b border-border/50"><td className="py-2">Bonus</td><td className="text-right tabular-nums">{formatCurrency(b)}</td></tr>}
              {x > 0 && <tr className="border-b border-border/50"><td className="py-2">Ex-gratia payment</td><td className="text-right tabular-nums">{formatCurrency(result.exGratia)}</td></tr>}
              <tr className="border-b border-border font-medium"><td className="py-2">Total Gross</td><td className="text-right tabular-nums">{formatCurrency(result.totalGross)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 text-green-600">Tax-free (first £30K)</td><td className="text-right tabular-nums text-green-600">{formatCurrency(result.taxFree)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 text-destructive">Income tax on the rest</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.taxOnSettlement)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 text-destructive">NI on notice, holiday and bonus pay</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.niOnSettlement)}</td></tr>
              <tr className="font-semibold"><td className="py-2 text-primary">Net Settlement</td><td className="text-right tabular-nums text-primary">{formatCurrency(result.netSettlement)}</td></tr>
            </tbody>
          </table>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>The first £30,000 of statutory redundancy and ex-gratia pay is tax-free. Notice pay, holiday pay and bonus are taxed as earnings. Statutory redundancy needs at least 2 years' service; the ex-gratia sum is whatever your employer offers. A settlement agreement is only binding once you've had independent legal advice, which employers usually pay towards. Tax is estimated on top of a full year's salary; if you leave part-way through the year you may pay less.</p>
          </div>
        </div>
      )}
    </div>
  )
}
