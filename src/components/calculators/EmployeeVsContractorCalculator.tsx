import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(annualCost: number) {
  // As employee
  const empSalary = annualCost / 1.15 // remove employer NI
  const empNI = Math.max(0, (empSalary - 5_000) * 0.15)
  const empPension = empSalary * 0.03
  const empTotal = empSalary + empNI + empPension
  const empTakeHome = empSalary - calcTax(empSalary) - calcNI(empSalary) - empSalary * 0.05

  // As contractor (day rate equivalent)
  const dayRate = annualCost / 220
  const contrSalary = 12_570
  const contrCorpProfit = annualCost - contrSalary - Math.max(0, (contrSalary - 5_000) * 0.15)
  const contrCorpTax = contrCorpProfit * 0.19
  const contrDividends = contrCorpProfit - contrCorpTax
  const contrDivTax = Math.max(0, contrDividends - 500) * 0.1075
  const contrTakeHome = contrSalary + contrDividends - contrDivTax - 1200

  return { empSalary, empNI, empPension, empTotal, empTakeHome, dayRate, contrTakeHome, saving: contrTakeHome - empTakeHome }
}

function calcTax(i: number) { let pa=12_570; let t=0; if(i>pa){if(i<=50_270)t=(i-pa)*0.20;else t=(50_270-pa)*0.20+(i-50_270)*0.40} return t }
function calcNI(i: number) { if(i<=12_570)return 0; if(i<=50_270)return(i-12_570)*0.08; return(50_270-12_570)*0.08+(i-50_270)*0.02 }

export default function EmployeeVsContractorCalculator() {
  const [cost, setCost] = useState('60000')
  const c = parseFloat(cost.replace(/,/g,'')) || 0
  const result = useMemo(() => calculate(c), [c])

  return (
    <div className="space-y-6">
      <div><label className="block text-sm font-medium mb-2">Total Budget (what the company pays)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={cost} onChange={(e) => setCost(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Total Budget (what the company pays)" /></div></div>

      {c > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-border p-5 text-center"><p className="text-sm font-medium">As Employee</p><p className="text-xl font-bold mt-1">{formatCurrency(result.empTakeHome)}</p><p className="text-xs text-muted-foreground">Salary: {formatCurrency(result.empSalary)}</p></div>
            <div className={`rounded-xl p-5 text-center ${result.saving > 0 ? 'bg-green-100 dark:bg-green-950 border-2 border-green-300 dark:border-green-800' : 'border border-border'}`}><p className="text-sm font-medium">As Contractor (Ltd)</p><p className="text-xl font-bold mt-1">{formatCurrency(result.contrTakeHome)}</p><p className="text-xs text-muted-foreground">Day rate: {formatCurrency(result.dayRate)}</p>{result.saving > 0 && <span className="inline-block mt-1 text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">+{formatCurrency(result.saving)}</span>}</div>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>Same cost to the hiring company ({formatCurrency(c)}). Contractor keeps more due to Corp Tax + dividends vs PAYE + NI. But: no sick pay, holiday, pension, or employment rights. Consider IR35 status.</p>
          </div>
        </div>
      )}
    </div>
  )
}
