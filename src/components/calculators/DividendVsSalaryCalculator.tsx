import { useState, useMemo } from 'react'
import { formatCurrency, ukCorporationTax, ukDividendTax, ukIncomeTax, ukPersonalAllowance } from '@/utils'

const EMPLOYER_NI_RATE = 0.15
const SECONDARY_THRESHOLD = 5_000

function employerNI(salary: number) {
  return Math.max(0, (salary - SECONDARY_THRESHOLD) * EMPLOYER_NI_RATE)
}

// Largest gross salary whose total cost (salary + employer NI) equals `cost`.
// Employer NI is 15% only above the £5,000 Secondary Threshold, so
// cost = salary + 0.15 × (salary − 5,000), i.e. salary = (cost + 750) / 1.15.
function salaryFromCost(cost: number) {
  if (cost <= SECONDARY_THRESHOLD) return Math.max(0, cost)
  return (cost + SECONDARY_THRESHOLD * EMPLOYER_NI_RATE) / (1 + EMPLOYER_NI_RATE)
}

// Salary plus dividends drawn from the rest of the profit. The Personal
// Allowance is tapered on TOTAL income (salary + dividends), so once the two
// together pass £100,000 the salary itself starts to be taxed. Salary uses the
// allowance and the basic rate band first; dividends are the top slice and
// ukDividendTax picks up any allowance and band room the salary left over.
function salaryPlusDividends(profit: number, salary: number) {
  const corpProfit = profit - salary - employerNI(salary)
  const corpTax = ukCorporationTax(corpProfit)
  const dividends = Math.max(0, corpProfit - corpTax)
  const pa = ukPersonalAllowance(salary + dividends)
  const salaryIT = ukIncomeTax(salary, pa)
  const salaryNI = calcNI(salary)
  const divTax = ukDividendTax(dividends, salary)
  const takeHome = salary - salaryIT - salaryNI + dividends - divTax
  return { salary, dividends, corpTax, salaryIT, salaryNI, divTax, takeHome }
}

function calculate(profit: number) {
  // Option 1: All salary. Profit is the total employment cost, so the gross
  // salary is what is left after employer NI on the slice above £5,000.
  const allSalaryGross = salaryFromCost(profit)
  const salaryIT = ukIncomeTax(allSalaryGross)
  const salaryNI = calcNI(allSalaryGross)
  const salaryTakeHome = allSalaryGross - salaryIT - salaryNI

  // Option 2: Optimal salary (£12,570) + dividends. On a very small profit the
  // salary is capped at what the profit can fund after employer NI.
  const optSalary = Math.min(12_570, salaryFromCost(profit))
  const opt = salaryPlusDividends(profit, optSalary)
  const availableDividends = opt.dividends
  const optTakeHome = opt.takeHome

  // Option 3: Higher salary (£50,270) + dividends
  const highSalary = Math.min(50_270, salaryFromCost(profit))
  const high = salaryPlusDividends(profit, highSalary)
  const highDividends = high.dividends
  const highTakeHome = high.takeHome

  return {
    options: [
      { name: `Salary £${Math.round(optSalary).toLocaleString()} + Dividends`, salary: optSalary, dividends: availableDividends, takeHome: optTakeHome, tax: profit - optTakeHome },
      { name: `Salary £${Math.round(highSalary).toLocaleString()} + Dividends`, salary: highSalary, dividends: highDividends, takeHome: highTakeHome, tax: profit - highTakeHome },
      { name: 'All Salary (PAYE)', salary: allSalaryGross, dividends: 0, takeHome: salaryTakeHome, tax: profit - salaryTakeHome },
    ]
      // On a small profit the two salary-plus-dividend options collapse into one
      .filter((o, i, arr) => arr.findIndex((x) => x.name === o.name) === i)
      .sort((a, b) => b.takeHome - a.takeHome),
    profit,
  }
}

function calcNI(income: number) {
  if (income <= 12_570) return 0
  if (income <= 50_270) return (income - 12_570) * 0.08
  return (50_270 - 12_570) * 0.08 + (income - 50_270) * 0.02
}

export default function DividendVsSalaryCalculator() {
  const [profit, setProfit] = useState('60000')

  const p = parseFloat(profit.replace(/,/g, '')) || 0
  const result = useMemo(() => p > 0 ? calculate(p) : null, [p])

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Company Profit Available (before salary & tax)</label>
        <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
          <input type="text" inputMode="numeric" value={profit} onChange={(e) => setProfit(e.target.value)} placeholder="80,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Company Profit Available (before salary & tax)" /></div>
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
