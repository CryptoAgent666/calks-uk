import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Savings tax: 2026/27 rates for year 1, then the 2 point rise from 6 April 2027 (22/42/47%).
// Personal Savings Allowance: £1,000 basic, £500 higher, £0 additional. ISA / Premium Bonds: tax-free.
const TAX_BANDS: Record<string, { now: number; from2027: number; psa: number; label: string }> = {
  none: { now: 0, from2027: 0, psa: 0, label: 'Tax-free (ISA) or non-taxpayer' },
  basic: { now: 0.20, from2027: 0.22, psa: 1_000, label: 'Basic rate' },
  higher: { now: 0.40, from2027: 0.42, psa: 500, label: 'Higher rate' },
  additional: { now: 0.45, from2027: 0.47, psa: 0, label: 'Additional rate' },
}

function calculate(principal: number, rate: number, compounding: string, years: number, taxBand = 'none') {
  // 'payout': interest paid out monthly to your bank (NS&I Income Bonds), so nothing compounds
  const payout = compounding === 'payout'
  const n = compounding === 'daily' ? 365 : compounding === 'monthly' || payout ? 12 : compounding === 'quarterly' ? 4 : 1
  const band = TAX_BANDS[taxBand] ?? TAX_BANDS.none

  let balance = principal
  let totalInterest = 0
  let totalTax = 0
  for (let y = 1; y <= years; y++) {
    const yearInterest = payout ? principal * rate / 100 : balance * (Math.pow(1 + rate / 100 / n, n) - 1)
    if (!payout) balance += yearInterest
    totalInterest += yearInterest
    // Assumes this is your only savings interest; tax is paid separately, not from the balance
    const taxRate = y === 1 ? band.now : band.from2027
    totalTax += Math.max(0, yearInterest - band.psa) * taxRate
  }
  const finalBalance = payout ? principal : balance
  const aer = (Math.pow(1 + rate / 100 / n, n) - 1) * 100

  return { finalBalance, totalInterest, totalTax, interestAfterTax: totalInterest - totalTax, aer, payout }
}

export default function SavingsInterestCalculator() {
  const [principal, setPrincipal] = useState('10000')
  const [rate, setRate] = useState('3.75')
  const [compound, setCompound] = useState('annual')
  const [years, setYears] = useState('3')
  const [taxBand, setTaxBand] = useState('basic')

  const p = parseFloat(principal.replace(/,/g,'')) || 0
  const r = parseFloat(rate) || 0
  const y = parseInt(years) || 0
  const result = useMemo(() => calculate(p, r, compound, y, taxBand), [p, r, compound, y, taxBand])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Deposit</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={principal} onChange={(e) => setPrincipal(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Deposit" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Interest Rate (%)</label><input type="number" min="0" max="10" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Interest Rate (%)" /></div>
        <div><label className="block text-sm font-medium mb-2">Compounding</label><select value={compound} onChange={(e) => setCompound(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Compounding"><option value="daily">Daily</option><option value="monthly">Monthly</option><option value="quarterly">Quarterly</option><option value="annual">Annual</option><option value="payout">Paid out monthly (Income Bonds)</option></select></div>
        <div><label className="block text-sm font-medium mb-2">Years</label><input type="number" min="1" max="30" value={years} onChange={(e) => setYears(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Years" /></div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Your Tax Position</label>
        <select value={taxBand} onChange={(e) => setTaxBand(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Your Tax Position">
          {Object.entries(TAX_BANDS).map(([k, b]) => <option key={k} value={k}>{b.label}{b.now > 0 ? ` (${b.now * 100}%, £${b.psa.toLocaleString('en-GB')} allowance)` : ''}</option>)}
        </select>
      </div>
      {p > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Final Balance</p><p className="text-xl font-bold text-primary">{formatCurrency(result.finalBalance)}</p></div>
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center"><p className="text-xs text-muted-foreground">{result.payout ? 'Interest Paid Out' : 'Interest Earned'}</p><p className="text-xl font-bold text-green-700 dark:text-green-400">{formatCurrency(result.totalInterest)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Interest After Tax</p><p className="text-xl font-bold">{formatCurrency(result.interestAfterTax)}</p><p className="text-xs text-muted-foreground">Tax {formatCurrency(result.totalTax)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">{result.payout ? 'AER if reinvested' : 'AER'}</p><p className="text-xl font-bold">{result.aer.toFixed(2)}%</p></div>
          </div>
          <p className="text-xs text-muted-foreground">Tax assumes this is your only savings interest, uses 2026/27 rates for the first year and the rates 2 points higher that apply from 6 April 2027 after that, and ignores the starting rate for savings.</p>
        </div>
      )}
    </div>
  )
}
