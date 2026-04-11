import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(profit: number) {
  // Option 1: All salary
  const allSalaryGross = profit / 1.15 // employer NI at 15% above £5k
  const salaryIT = calcIT(allSalaryGross)
  const salaryNI = calcNI(allSalaryGross)
  const salaryTakeHome = allSalaryGross - salaryIT - salaryNI

  // Option 2: Optimal salary (£12,570) + dividends
  const optSalary = 12_570
  const corpTaxableProfit = profit - optSalary - Math.max(0, (optSalary - 5_000) * 0.15)
  const corpTax = corpTaxableProfit <= 50_000 ? corpTaxableProfit * 0.19 : corpTaxableProfit * 0.25
  const availableDividends = corpTaxableProfit - corpTax
  const divTax = Math.max(0, availableDividends - 500) * 0.0875
  const optTakeHome = optSalary + availableDividends - divTax

  // Option 3: Higher salary (£50,270) + dividends
  const highSalary = Math.min(50_270, profit / 1.15)
  const highEmployerNI = Math.max(0, (highSalary - 5_000) * 0.15)
  const highCorpProfit = profit - highSalary - highEmployerNI
  const highCorpTax = highCorpProfit > 0 ? (highCorpProfit <= 50_000 ? highCorpProfit * 0.19 : highCorpProfit * 0.25) : 0
  const highDividends = Math.max(0, highCorpProfit - highCorpTax)
  const highSalaryIT = calcIT(highSalary)
  const highSalaryNI = calcNI(highSalary)
  const highDivTax = Math.max(0, highDividends - 500) * 0.0875
  const highTakeHome = highSalary - highSalaryIT - highSalaryNI + highDividends - highDivTax

  return {
    options: [
      { name: 'Salary £12,570 + Dividends', salary: optSalary, dividends: availableDividends, takeHome: optTakeHome, tax: profit - optTakeHome },
      { name: `Salary £${Math.round(highSalary).toLocaleString()} + Dividends`, salary: highSalary, dividends: highDividends, takeHome: highTakeHome, tax: profit - highTakeHome },
      { name: 'All Salary (PAYE)', salary: allSalaryGross, dividends: 0, takeHome: salaryTakeHome, tax: profit - salaryTakeHome },
    ].sort((a, b) => b.takeHome - a.takeHome),
    profit,
  }
}

function calcIT(income: number) {
  let pa = 12_570
  if (income > 100_000) pa = Math.max(0, 12_570 - Math.floor((income - 100_000) / 2))
  let tax = 0
  if (income > pa) {
    if (income <= 50_270) tax = (income - pa) * 0.20
    else if (income <= 125_140) tax = (50_270 - pa) * 0.20 + (income - 50_270) * 0.40
    else tax = (50_270 - pa) * 0.20 + (125_140 - 50_270) * 0.40 + (income - 125_140) * 0.45
  }
  return tax
}

function calcNI(income: number) {
  if (income <= 12_570) return 0
  if (income <= 50_270) return (income - 12_570) * 0.08
  return (50_270 - 12_570) * 0.08 + (income - 50_270) * 0.02
}

export default function DividendVsSalaryCalculator() {
  const [profit, setProfit] = useState('')

  const p = parseFloat(profit.replace(/,/g, '')) || 0
  const result = useMemo(() => p > 0 ? calculate(p) : null, [p])

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Company Profit Available (before salary & tax)</label>
        <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
          <input type="text" inputMode="numeric" value={profit} onChange={(e) => setProfit(e.target.value)} placeholder="80,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div className="flex flex-wrap gap-2 mt-3">
          {[50_000, 75_000, 100_000, 150_000].map((a) => (
            <button key={a} onClick={() => setProfit(a.toLocaleString())} className="px-3 py-1.5 rounded-lg bg-muted text-sm font-medium hover:bg-accent transition-colors">£{a / 1000}K</button>
          ))}
        </div>
      </div>

      {result && (
        <div className="space-y-4 animate-fade-in-up">
          {result.options.map((opt, i) => (
            <div key={opt.name} className={`rounded-xl p-5 ${i === 0 ? 'bg-green-100 dark:bg-green-950 border-2 border-green-300 dark:border-green-800' : 'border border-border'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{opt.name}</p>
                    {i === 0 && <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">Best</span>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Salary: {formatCurrency(opt.salary)} | Dividends: {formatCurrency(opt.dividends)}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-xl font-bold ${i === 0 ? 'text-green-700 dark:text-green-400' : ''}`}>{formatCurrency(opt.takeHome)}</p>
                  <p className="text-xs text-muted-foreground">Total tax: {formatCurrency(opt.tax)}</p>
                </div>
              </div>
            </div>
          ))}

          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>Simplified comparison. Actual results depend on dividend timing, other income, and expenses. Consider consulting an accountant.</p>
          </div>
        </div>
      )}
    </div>
  )
}
