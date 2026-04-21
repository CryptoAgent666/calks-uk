import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(salary: number, carListPrice: number, bikRate: number, leaseTerm: number) {
  const monthlyLease = carListPrice / leaseTerm
  const newGross = salary - monthlyLease * 12
  const taxBefore = calcTax(salary)
  const niBefore = calcNI(salary)
  const taxAfter = calcTax(newGross)
  const niAfter = calcNI(newGross)
  const taxSaving = taxBefore - taxAfter
  const niSaving = niBefore - niAfter
  const totalSaving = taxSaving + niSaving

  // BiK tax
  const bikValue = carListPrice * (bikRate / 100)
  const marginalRate = salary > 50_270 ? 0.40 : 0.20
  const bikTax = bikValue * marginalRate
  const monthlyBikTax = bikTax / 12

  const netMonthlyCost = monthlyLease - (totalSaving / 12) + monthlyBikTax
  const equivalentPurchaseCost = netMonthlyCost * leaseTerm

  return { monthlyLease, taxSaving, niSaving, totalSaving, bikTax, monthlyBikTax, netMonthlyCost, equivalentPurchaseCost }
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

export default function EVSalarySacrificeCalculator() {
  const [salary, setSalary] = useState('45000')
  const [price, setPrice] = useState('35000')
  const [bik, setBik] = useState('3')
  const [term, setTerm] = useState('36')

  const s = parseFloat(salary.replace(/,/g,'')) || 0
  const p = parseFloat(price.replace(/,/g,'')) || 0
  const b = parseFloat(bik) || 3
  const t = parseInt(term) || 36
  const result = useMemo(() => calculate(s, p, b, t), [s, p, b, t])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Annual Salary</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={salary} onChange={(e) => setSalary(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Car List Price</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">BiK Rate (%)</label><input type="number" min="2" max="37" value={bik} onChange={(e) => setBik(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /><p className="text-xs text-muted-foreground mt-1">EV: 3% (2026/27)</p></div>
        <div><label className="block text-sm font-medium mb-2">Lease Term (months)</label><input type="number" min="24" max="48" value={term} onChange={(e) => setTerm(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
      </div>

      {s > 0 && p > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-green-100 dark:bg-green-950 p-6 text-center">
            <p className="text-sm text-muted-foreground">Net Monthly Cost (after tax/NI savings)</p>
            <p className="text-3xl font-bold text-green-700 dark:text-green-400 mt-1">{formatCurrency(result.netMonthlyCost)}</p>
            <p className="text-sm text-muted-foreground mt-1">vs {formatCurrency(result.monthlyLease)}/month gross sacrifice</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-3 text-center"><p className="text-xs text-muted-foreground">Tax Saved/Year</p><p className="text-lg font-bold text-green-700 dark:text-green-400">{formatCurrency(result.taxSaving)}</p></div>
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-3 text-center"><p className="text-xs text-muted-foreground">NI Saved/Year</p><p className="text-lg font-bold text-green-700 dark:text-green-400">{formatCurrency(result.niSaving)}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">BiK Tax/Month</p><p className="text-lg font-bold">{formatCurrency(result.monthlyBikTax)}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Effective Cost ({t}mo)</p><p className="text-lg font-bold">{formatCurrency(result.equivalentPurchaseCost)}</p></div>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>EV salary sacrifice: lease an electric car through your employer, saving income tax and NI. BiK rate for EVs is just {b}% (2026/27). Includes insurance, servicing, breakdown cover and tyres. One of the most tax-efficient employee benefits.</p>
          </div>
        </div>
      )}
    </div>
  )
}
