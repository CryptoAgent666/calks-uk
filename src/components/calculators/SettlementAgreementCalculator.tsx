import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(salary: number, yearsService: number, age: number, noticePeriod: number, outstandingHoliday: number, bonusOwed: number) {
  const weeklySalary = salary / 52
  const cappedWeekly = Math.min(weeklySalary, 700)

  // Statutory redundancy (min element)
  let redWeeks = 0
  const years = Math.min(yearsService, 20)
  for (let y = 0; y < years; y++) {
    const ageAtYear = age - (years - y - 1)
    if (ageAtYear < 22) redWeeks += 0.5
    else if (ageAtYear < 41) redWeeks += 1
    else redWeeks += 1.5
  }
  const statutoryRedundancy = redWeeks * cappedWeekly

  // Notice pay (taxable)
  const noticePay = (salary / 52) * noticePeriod

  // Holiday pay (taxable)
  const holidayPay = (salary / 260) * outstandingHoliday // 260 working days

  // Ex-gratia (first £30K tax-free)
  const exGratia = salary * 0.5 // common: 0.5-1x salary as starting point

  const totalGross = statutoryRedundancy + noticePay + holidayPay + bonusOwed + exGratia
  const taxFree = Math.min(statutoryRedundancy + exGratia, 30_000)
  const taxable = totalGross - taxFree

  // Tax on taxable portion
  const marginalRate = salary > 50_270 ? 0.40 : 0.20
  const taxOnSettlement = taxable * marginalRate
  const netSettlement = totalGross - taxOnSettlement

  return { statutoryRedundancy, noticePay, holidayPay, exGratia, totalGross, taxFree, taxable, taxOnSettlement, netSettlement, redWeeks }
}

export default function SettlementAgreementCalculator() {
  const [salary, setSalary] = useState('40000')
  const [years, setYears] = useState('5')
  const [age, setAge] = useState('35')
  const [notice, setNotice] = useState('4')
  const [holiday, setHoliday] = useState('10')
  const [bonus, setBonus] = useState('0')

  const s = parseFloat(salary.replace(/,/g,'')) || 0
  const y = parseInt(years) || 0
  const a = parseInt(age) || 0
  const n = parseInt(notice) || 0
  const h = parseInt(holiday) || 0
  const b = parseFloat(bonus.replace(/,/g,'')) || 0
  const result = useMemo(() => calculate(s, y, a, n, h, b), [s, y, a, n, h, b])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Annual Salary</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={salary} onChange={(e) => setSalary(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Years of Service</label><input type="number" min="0" max="40" value={years} onChange={(e) => setYears(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Age</label><input type="number" min="16" max="70" value={age} onChange={(e) => setAge(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Notice Period (weeks)</label><input type="number" min="0" max="52" value={notice} onChange={(e) => setNotice(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Outstanding Holiday (days)</label><input type="number" min="0" max="40" value={holiday} onChange={(e) => setHoliday(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Bonus Owed</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={bonus} onChange={(e) => setBonus(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
      </div>

      {s > 0 && y > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Estimated Net Settlement</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.netSettlement)}</p>
          </div>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border/50"><td className="py-2">Statutory Redundancy ({result.redWeeks} weeks)</td><td className="text-right tabular-nums">{formatCurrency(result.statutoryRedundancy)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Notice Pay ({n} weeks)</td><td className="text-right tabular-nums">{formatCurrency(result.noticePay)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Holiday Pay ({h} days)</td><td className="text-right tabular-nums">{formatCurrency(result.holidayPay)}</td></tr>
              {b > 0 && <tr className="border-b border-border/50"><td className="py-2">Bonus</td><td className="text-right tabular-nums">{formatCurrency(b)}</td></tr>}
              <tr className="border-b border-border/50"><td className="py-2">Ex-gratia (estimated)</td><td className="text-right tabular-nums">{formatCurrency(result.exGratia)}</td></tr>
              <tr className="border-b border-border font-medium"><td className="py-2">Total Gross</td><td className="text-right tabular-nums">{formatCurrency(result.totalGross)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 text-green-600">Tax-free (first £30K)</td><td className="text-right tabular-nums text-green-600">{formatCurrency(result.taxFree)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 text-destructive">Tax on remainder</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.taxOnSettlement)}</td></tr>
              <tr className="font-semibold"><td className="py-2 text-primary">Net Settlement</td><td className="text-right tabular-nums text-primary">{formatCurrency(result.netSettlement)}</td></tr>
            </tbody>
          </table>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>First £30,000 of termination payments are tax-free. Notice pay, holiday pay and bonus are always taxable. Ex-gratia amount is a starting point — negotiate higher. Always get independent legal advice (employer must contribute ~£500 for this).</p>
          </div>
        </div>
      )}
    </div>
  )
}
