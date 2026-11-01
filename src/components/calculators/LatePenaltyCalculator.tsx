import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Late payment interest (commercial debts) - Late Payment of Commercial Debts Act
// The statutory rate is 8% over the Bank of England base rate in force on 30 June (interest that
// starts to run 1 July to 31 December) or 31 December (interest that starts 1 January to 30 June)
// immediately before interest starts: SI 2002/1675 art. 4. Add a row each half-year.
const REFERENCE_PERIODS = [
  { start: '1 Jul to 31 Dec 2026', refDate: '30 June 2026', baseRate: 3.75 },
  { start: '1 Jan to 30 Jun 2026', refDate: '31 December 2025', baseRate: 3.75 },
  { start: '1 Jul to 31 Dec 2025', refDate: '30 June 2025', baseRate: 4.25 },
  { start: '1 Jan to 30 Jun 2025', refDate: '31 December 2024', baseRate: 4.75 },
  { start: '1 Jul to 31 Dec 2024', refDate: '30 June 2024', baseRate: 5.25 },
]
const STATUTORY_UPLIFT = 8 // base rate + 8%
// Statutory fixed compensation bands: £40 for debt under £1,000;
// £70 for £1,000–£9,999.99; £100 for £10,000 or more.
const FIXED_COMPENSATION = [
  { below: 1_000, amount: 40 },
  { below: 10_000, amount: 70 },
  { below: Infinity, amount: 100 },
]

function calculate(invoiceAmount: number, daysLate: number, baseRate: number) {
  const statutoryRate = baseRate + STATUTORY_UPLIFT
  let fixedComp = 0
  for (const band of FIXED_COMPENSATION) {
    if (invoiceAmount < band.below) { fixedComp = band.amount; break }
  }

  const dailyRate = statutoryRate / 100 / 365
  const interest = invoiceAmount * dailyRate * daysLate
  const total = interest + fixedComp

  return { interest, dailyInterest: invoiceAmount * dailyRate, fixedComp, total, dailyRate: dailyRate * 100, statutoryRate }
}

export default function LatePenaltyCalculator() {
  const [amount, setAmount] = useState('5500')
  const [days, setDays] = useState('45')
  const [period, setPeriod] = useState('0')

  const a = parseFloat(amount.replace(/,/g,'')) || 0
  const d = parseInt(days) || 0
  const reference = REFERENCE_PERIODS[parseInt(period)] ?? REFERENCE_PERIODS[0]
  const result = useMemo(() => calculate(a, d, reference.baseRate), [a, d, reference.baseRate])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Invoice Amount</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="5,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Invoice Amount" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Days Overdue</label><input type="number" min="1" max="365" value={days} onChange={(e) => setDays(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Days Overdue" /></div>
        <div className="sm:col-span-2"><label className="block text-sm font-medium mb-2">When Interest Started</label><select value={period} onChange={(e) => setPeriod(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="When Interest Started">{REFERENCE_PERIODS.map((p, i) => <option key={p.start} value={i}>{p.start} ({p.baseRate + STATUTORY_UPLIFT}%)</option>)}</select><p className="text-xs text-muted-foreground mt-1">The rate is fixed by the base rate on the 30 June or 31 December before interest starts, so it depends on this date and not on today's base rate.</p></div>
      </div>

      {a > 0 && d > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Total You Can Claim</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.total)}</p>
          </div>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border/50"><td className="py-2.5">Daily interest</td><td className="text-right tabular-nums font-medium">£{result.dailyInterest.toFixed(3)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2.5">Statutory interest ({result.statutoryRate}% pa)</td><td className="text-right tabular-nums font-medium">{formatCurrency(result.interest)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2.5">Fixed compensation</td><td className="text-right tabular-nums font-medium">{formatCurrency(result.fixedComp)}</td></tr>
              <tr className="font-semibold"><td className="py-2.5">Total claimable</td><td className="text-right tabular-nums text-primary">{formatCurrency(result.total)}</td></tr>
            </tbody>
          </table>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>Under the Late Payment of Commercial Debts Act, you can charge statutory interest at {result.statutoryRate}% (BoE base rate of {reference.baseRate}% on {reference.refDate} + 8%) plus fixed compensation on B2B invoices.</p>
          </div>
        </div>
      )}
    </div>
  )
}
