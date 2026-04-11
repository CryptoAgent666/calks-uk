import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent } from '@/utils'

function calculate(salary: number, sacrificeAmount: number, pensionType: string) {
  const isSacrifice = pensionType === 'sacrifice'

  // Before pension
  const taxBefore = calcTax(salary)
  const niBefore = calcNI(salary)
  const takeHomeBefore = salary - taxBefore - niBefore

  let taxAfter: number, niAfter: number, takeHomeAfter: number, pensionContrib: number, employerNISaving: number

  if (isSacrifice) {
    // Salary sacrifice: lower gross, save NI too
    const newGross = salary - sacrificeAmount
    taxAfter = calcTax(newGross)
    niAfter = calcNI(newGross)
    takeHomeAfter = newGross - taxAfter - niAfter
    pensionContrib = sacrificeAmount
    employerNISaving = calcEmployerNI(salary) - calcEmployerNI(newGross)
  } else {
    // Relief at source: deducted after tax/NI, provider adds 20% relief
    taxAfter = calcTax(salary)
    niAfter = calcNI(salary)
    const netContrib = sacrificeAmount * 0.80 // you pay 80%, provider claims 20%
    takeHomeAfter = salary - taxAfter - niAfter - netContrib
    pensionContrib = sacrificeAmount // gross goes into pension
    employerNISaving = 0
  }

  const takeHomeDrop = takeHomeBefore - takeHomeAfter
  const taxSaving = taxBefore - taxAfter
  const niSaving = niBefore - niAfter
  const totalSaving = taxSaving + niSaving
  const effectiveCost = sacrificeAmount - totalSaving

  return { takeHomeBefore, takeHomeAfter, takeHomeDrop, taxSaving, niSaving, totalSaving, effectiveCost, pensionContrib, employerNISaving }
}

function calcTax(income: number) {
  let pa = 12_570
  if (income > 100_000) pa = Math.max(0, 12_570 - Math.floor((income - 100_000) / 2))
  let t = 0
  if (income > pa) {
    if (income <= 50_270) t = (income - pa) * 0.20
    else if (income <= 125_140) t = (50_270 - pa) * 0.20 + (income - 50_270) * 0.40
    else t = (50_270 - pa) * 0.20 + (125_140 - 50_270) * 0.40 + (income - 125_140) * 0.45
  }
  return t
}

function calcNI(income: number) {
  if (income <= 12_570) return 0
  if (income <= 50_270) return (income - 12_570) * 0.08
  return (50_270 - 12_570) * 0.08 + (income - 50_270) * 0.02
}

function calcEmployerNI(income: number) {
  return income > 5_000 ? (income - 5_000) * 0.15 : 0
}

export default function SalaryPensionCalculator() {
  const [salary, setSalary] = useState('50000')
  const [amount, setAmount] = useState('5000')
  const [type, setType] = useState('sacrifice')

  const s = parseFloat(salary.replace(/,/g, '')) || 0
  const a = parseFloat(amount.replace(/,/g, '')) || 0
  const result = useMemo(() => calculate(s, Math.min(a, s), type), [s, a, type])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Annual Salary</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={salary} onChange={(e) => setSalary(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Annual Pension Contribution</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => setType('sacrifice')} className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${type === 'sacrifice' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>Salary Sacrifice</button>
        <button onClick={() => setType('relief')} className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${type === 'relief' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>Relief at Source</button>
      </div>

      {s > 0 && a > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-green-100 dark:bg-green-950 p-6 text-center">
            <p className="text-sm text-muted-foreground">Tax & NI Saving</p>
            <p className="text-3xl font-bold text-green-700 dark:text-green-400 mt-1">{formatCurrency(result.totalSaving)}</p>
            <p className="text-sm text-muted-foreground mt-1">{formatCurrency(a)} into pension costs you only {formatCurrency(result.effectiveCost)} in take-home pay</p>
          </div>
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border"><th className="text-left py-2 font-medium text-muted-foreground"></th><th className="text-right py-2 font-medium text-muted-foreground">Before</th><th className="text-right py-2 font-medium text-muted-foreground">After</th></tr></thead>
            <tbody>
              <tr className="border-b border-border/50"><td className="py-2">Annual Take-Home</td><td className="text-right tabular-nums">{formatCurrency(result.takeHomeBefore)}</td><td className="text-right tabular-nums">{formatCurrency(result.takeHomeAfter)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Monthly Take-Home</td><td className="text-right tabular-nums">{formatCurrency(result.takeHomeBefore / 12)}</td><td className="text-right tabular-nums">{formatCurrency(result.takeHomeAfter / 12)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 text-green-600">Income Tax Saved</td><td></td><td className="text-right tabular-nums text-green-600">{formatCurrency(result.taxSaving)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 text-green-600">NI Saved</td><td></td><td className="text-right tabular-nums text-green-600">{formatCurrency(result.niSaving)}</td></tr>
              {result.employerNISaving > 0 && <tr className="border-b border-border/50"><td className="py-2 text-green-600">Employer NI Saved</td><td></td><td className="text-right tabular-nums text-green-600">{formatCurrency(result.employerNISaving)}</td></tr>}
              <tr className="font-semibold"><td className="py-2">Into Pension</td><td></td><td className="text-right tabular-nums text-primary">{formatCurrency(result.pensionContrib)}</td></tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
