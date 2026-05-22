import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Non-dom rules from April 2025 (new regime)
function calculate(ukIncome: number, foreignIncome: number, yearsResident: number) {
  // New 4-year FIG regime (from April 2025)
  const inFIG = yearsResident <= 4
  const figExemptForeign = inFIG ? foreignIncome : 0

  // Tax on UK income (always taxable)
  let pa = 12_570
  if (ukIncome > 100_000) pa = Math.max(0, 12_570 - Math.floor((ukIncome - 100_000) / 2))
  let ukTax = 0
  if (ukIncome > pa) {
    if (ukIncome <= 50_270) ukTax = (ukIncome - pa) * 0.20
    else if (ukIncome <= 125_140) ukTax = (50_270 - pa) * 0.20 + (ukIncome - 50_270) * 0.40
    else ukTax = (50_270 - pa) * 0.20 + (125_140 - 50_270) * 0.40 + (ukIncome - 125_140) * 0.45
  }

  // Tax on foreign income
  let foreignTax = 0
  if (!inFIG) {
    // After 4 years: all worldwide income taxable
    const totalIncome = ukIncome + foreignIncome
    let totalTax = 0
    let adjustedPA = 12_570
    if (totalIncome > 100_000) adjustedPA = Math.max(0, 12_570 - Math.floor((totalIncome - 100_000) / 2))
    if (totalIncome > adjustedPA) {
      if (totalIncome <= 50_270) totalTax = (totalIncome - adjustedPA) * 0.20
      else if (totalIncome <= 125_140) totalTax = (50_270 - adjustedPA) * 0.20 + (totalIncome - 50_270) * 0.40
      else totalTax = (50_270 - adjustedPA) * 0.20 + (125_140 - 50_270) * 0.40 + (totalIncome - 125_140) * 0.45
    }
    foreignTax = totalTax - ukTax
  }

  const totalTax = ukTax + foreignTax
  const takeHome = ukIncome + foreignIncome - totalTax

  return { ukTax, foreignTax, totalTax, takeHome, inFIG, figExemptForeign, yearsRemaining: inFIG ? 4 - yearsResident : 0 }
}

export default function NonDomTaxCalculator() {
  const [ukIncome, setUkIncome] = useState('60000')
  const [foreignIncome, setForeignIncome] = useState('40000')
  const [years, setYears] = useState('2')

  const uk = parseFloat(ukIncome.replace(/,/g,'')) || 0
  const fi = parseFloat(foreignIncome.replace(/,/g,'')) || 0
  const y = parseInt(years) || 0
  const result = useMemo(() => calculate(uk, fi, y), [uk, fi, y])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">UK Income</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={ukIncome} onChange={(e) => setUkIncome(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="UK Income" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Foreign Income</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={foreignIncome} onChange={(e) => setForeignIncome(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Foreign Income" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Years UK Resident</label><input type="number" min="0" max="20" value={years} onChange={(e) => setYears(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Years UK Resident" /></div>
      </div>

      <div className="space-y-4 animate-fade-in-up">
        <div className={`rounded-xl p-3 text-center text-sm font-medium ${result.inFIG ? 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400' : 'bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-400'}`}>
          {result.inFIG ? `FIG regime: foreign income exempt for ${result.yearsRemaining} more year${result.yearsRemaining !== 1 ? 's' : ''}` : 'FIG period ended — all worldwide income taxable'}
        </div>

        <div className="rounded-2xl bg-primary/10 p-6 text-center">
          <p className="text-sm text-muted-foreground">Total Tax</p>
          <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.totalTax)}</p>
          <p className="text-sm text-muted-foreground mt-1">Take home: {formatCurrency(result.takeHome)}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Tax on UK Income</p><p className="text-lg font-bold">{formatCurrency(result.ukTax)}</p></div>
          <div className={`rounded-xl p-4 text-center ${result.foreignTax > 0 ? 'bg-destructive/10' : 'bg-green-100 dark:bg-green-950'}`}><p className="text-xs text-muted-foreground">Tax on Foreign Income</p><p className={`text-lg font-bold ${result.foreignTax > 0 ? 'text-destructive' : 'text-green-700 dark:text-green-400'}`}>{result.foreignTax > 0 ? formatCurrency(result.foreignTax) : 'Exempt (FIG)'}</p></div>
        </div>
        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">New rules from April 2025:</p>
          <p>The old remittance basis is abolished. New arrivals get a 4-year Foreign Income & Gains (FIG) exemption. After 4 years, all worldwide income is taxable. No more £30K/£60K annual charges.</p>
        </div>
      </div>
    </div>
  )
}
