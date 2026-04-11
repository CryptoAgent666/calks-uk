import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Late payment interest (commercial debts) - Late Payment of Commercial Debts Act
const BOE_BASE_RATE = 5.25 // Bank of England base rate
const STATUTORY_RATE = BOE_BASE_RATE + 8 // base rate + 8%
const FIXED_COMPENSATION = [
  { upTo: 1_000, amount: 40 },
  { upTo: 10_000, amount: 70 },
  { upTo: Infinity, amount: 100 },
]

function calculate(invoiceAmount: number, daysLate: number) {
  let fixedComp = 0
  for (const band of FIXED_COMPENSATION) {
    if (invoiceAmount <= band.upTo) { fixedComp = band.amount; break }
  }

  const dailyRate = STATUTORY_RATE / 100 / 365
  const interest = invoiceAmount * dailyRate * daysLate
  const total = interest + fixedComp

  return { interest, fixedComp, total, dailyRate: dailyRate * 100, statutoryRate: STATUTORY_RATE }
}

export default function LatePenaltyCalculator() {
  const [amount, setAmount] = useState('')
  const [days, setDays] = useState('30')

  const a = parseFloat(amount.replace(/,/g,'')) || 0
  const d = parseInt(days) || 0
  const result = useMemo(() => calculate(a, d), [a, d])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Invoice Amount</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="5,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Days Overdue</label><input type="number" min="1" max="365" value={days} onChange={(e) => setDays(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
      </div>

      {a > 0 && d > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Total You Can Claim</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.total)}</p>
          </div>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border/50"><td className="py-2.5">Statutory interest ({result.statutoryRate}% pa)</td><td className="text-right tabular-nums font-medium">{formatCurrency(result.interest)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2.5">Fixed compensation</td><td className="text-right tabular-nums font-medium">{formatCurrency(result.fixedComp)}</td></tr>
              <tr className="font-semibold"><td className="py-2.5">Total claimable</td><td className="text-right tabular-nums text-primary">{formatCurrency(result.total)}</td></tr>
            </tbody>
          </table>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>Under the Late Payment of Commercial Debts Act, you can charge statutory interest at {result.statutoryRate}% (BoE base rate {BOE_BASE_RATE}% + 8%) plus fixed compensation on B2B invoices.</p>
          </div>
        </div>
      )}
    </div>
  )
}
