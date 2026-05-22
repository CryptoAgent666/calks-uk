import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(income1: number, income2: number, deposit: number, multiplier: number) {
  const totalIncome = income1 + income2
  const maxBorrow = totalIncome * multiplier
  const maxPropertyPrice = maxBorrow + deposit
  const ltv = maxPropertyPrice > 0 ? ((maxBorrow / maxPropertyPrice) * 100) : 0

  return { totalIncome, maxBorrow, maxPropertyPrice, deposit, ltv }
}

export default function MortgageAffordabilityCalculator() {
  const [income1, setIncome1] = useState('')
  const [income2, setIncome2] = useState('')
  const [deposit, setDeposit] = useState('')
  const [multiplier, setMultiplier] = useState('4.5')

  const i1 = parseFloat(income1.replace(/,/g, '')) || 0
  const i2 = parseFloat(income2.replace(/,/g, '')) || 0
  const d = parseFloat(deposit.replace(/,/g, '')) || 0
  const m = parseFloat(multiplier) || 4.5
  const result = useMemo(() => calculate(i1, i2, d, m), [i1, i2, d, m])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="ma-income1" className="block text-sm font-medium mb-2">Your Annual Income</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input id="ma-income1" type="text" inputMode="numeric" value={income1} onChange={(e) => setIncome1(e.target.value)} placeholder="45,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Your Annual Income" />
          </div>
        </div>
        <div>
          <label htmlFor="ma-income2" className="block text-sm font-medium mb-2">Partner's Annual Income (optional)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input id="ma-income2" type="text" inputMode="numeric" value={income2} onChange={(e) => setIncome2(e.target.value)} placeholder="0" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Partner's Annual Income (optional)" />
          </div>
        </div>
        <div>
          <label htmlFor="ma-deposit" className="block text-sm font-medium mb-2">Deposit</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input id="ma-deposit" type="text" inputMode="numeric" value={deposit} onChange={(e) => setDeposit(e.target.value)} placeholder="30,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Deposit" />
          </div>
        </div>
        <div>
          <label htmlFor="ma-multi" className="block text-sm font-medium mb-2">Income Multiplier</label>
          <select id="ma-multi" value={multiplier} onChange={(e) => setMultiplier(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Income Multiplier">
            <option value="3.5">3.5x (conservative)</option>
            <option value="4">4x (typical)</option>
            <option value="4.5">4.5x (standard max)</option>
            <option value="5">5x (specialist lenders)</option>
            <option value="5.5">5.5x (high earners)</option>
          </select>
        </div>
      </div>

      {i1 > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Maximum Property Price</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.maxPropertyPrice)}</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">You Could Borrow</p><p className="text-lg font-bold">{formatCurrency(result.maxBorrow)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Your Deposit</p><p className="text-lg font-bold">{formatCurrency(result.deposit)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">LTV Ratio</p><p className="text-lg font-bold">{result.ltv.toFixed(0)}%</p></div>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>Based on {m}x combined income of {formatCurrency(result.totalIncome)} plus {formatCurrency(d)} deposit.</p>
            <p className="mt-1">Most UK lenders offer 4-4.5x income. Some specialist lenders may offer up to 5.5x for higher earners.</p>
          </div>
        </div>
      )}
    </div>
  )
}
