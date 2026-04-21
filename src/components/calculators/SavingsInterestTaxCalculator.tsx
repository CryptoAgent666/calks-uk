import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Personal Savings Allowance 2026/27
const PSA_BASIC = 1_000
const PSA_HIGHER = 500
const PSA_ADDITIONAL = 0

function calculate(savingsBalance: number, interestRate: number, salary: number) {
  const annualInterest = savingsBalance * (interestRate / 100)

  let psa: number
  if (salary <= 50_270) psa = PSA_BASIC
  else if (salary <= 125_140) psa = PSA_HIGHER
  else psa = PSA_ADDITIONAL

  const taxableInterest = Math.max(0, annualInterest - psa)
  const taxRate = salary <= 50_270 ? 0.20 : salary <= 125_140 ? 0.40 : 0.45
  const tax = taxableInterest * taxRate
  const netInterest = annualInterest - tax
  const effectiveRate = savingsBalance > 0 ? (netInterest / savingsBalance) * 100 : 0

  // Max savings before PSA exceeded
  const maxTaxFree = interestRate > 0 ? (psa / (interestRate / 100)) : 0

  return { annualInterest, psa, taxableInterest, tax, netInterest, effectiveRate, maxTaxFree, taxRate: taxRate * 100 }
}

export default function SavingsInterestTaxCalculator() {
  const [balance, setBalance] = useState('50000')
  const [rate, setRate] = useState('4.5')
  const [salary, setSalary] = useState('35000')

  const b = parseFloat(balance.replace(/,/g,'')) || 0
  const r = parseFloat(rate) || 0
  const s = parseFloat(salary.replace(/,/g,'')) || 0
  const result = useMemo(() => calculate(b, r, s), [b, r, s])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Savings Balance</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={balance} onChange={(e) => setBalance(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Interest Rate (%)</label><input type="number" min="0" max="10" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Annual Salary</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={salary} onChange={(e) => setSalary(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
      </div>

      {b > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Annual Interest</p><p className="text-lg font-bold">{formatCurrency(result.annualInterest)}</p></div>
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center"><p className="text-xs text-muted-foreground">Tax-Free (PSA)</p><p className="text-lg font-bold text-green-700 dark:text-green-400">{formatCurrency(result.psa)}</p></div>
            <div className={`rounded-xl p-4 text-center ${result.tax > 0 ? 'bg-destructive/10' : 'bg-muted/50'}`}><p className="text-xs text-muted-foreground">Tax on Interest</p><p className={`text-lg font-bold ${result.tax > 0 ? 'text-destructive' : ''}`}>{result.tax > 0 ? formatCurrency(result.tax) : 'None'}</p></div>
            <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Net Interest</p><p className="text-lg font-bold text-primary">{formatCurrency(result.netInterest)}</p></div>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>Your Personal Savings Allowance: <span className="font-medium text-foreground">{formatCurrency(result.psa)}</span> ({result.taxRate}% taxpayer)</p>
            <p className="mt-1">Max tax-free savings at {r}%: <span className="font-medium text-foreground">{formatCurrency(result.maxTaxFree)}</span></p>
            {result.taxableInterest > 0 && <p className="mt-1">Tax due: {formatCurrency(result.taxableInterest)} x {result.taxRate}% = {formatCurrency(result.tax)} — reported via self-assessment or PAYE tax code adjustment.</p>}
          </div>
        </div>
      )}
    </div>
  )
}
