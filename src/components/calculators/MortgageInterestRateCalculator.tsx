import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

const FIXED_RATES = [3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0]
const MAX_RATE = 15
const MAX_TERM = 40

function calculate(balance: number, term: number, rates: number[]) {
  return rates.map(rate => {
    const monthlyRate = rate / 100 / 12
    const payments = term * 12
    const monthly = monthlyRate > 0 ? balance * (monthlyRate * Math.pow(1 + monthlyRate, payments)) / (Math.pow(1 + monthlyRate, payments) - 1) : balance / payments
    const totalPaid = monthly * payments
    const totalInterest = totalPaid - balance
    return { rate, monthly, totalPaid, totalInterest }
  })
}

// Rate A against Rate B over the whole term, with any product fee charged on Rate A
function compareRates(balance: number, term: number, rateA: number, rateB: number, feeA: number) {
  const [a, b] = calculate(balance, term, [rateA, rateB])
  const monthlyGap = b.monthly - a.monthly
  const interestGap = b.totalInterest - a.totalInterest
  return {
    a, b, monthlyGap, interestGap,
    netOfFee: interestGap - feeA,
    feeRecoveredMonths: monthlyGap > 0 ? Math.ceil(feeA / monthlyGap) : null,
  }
}

// null means the box is blank or out of range, so nothing is worked out from it
function parseTerm(text: string): number | null {
  const term = Number(text.trim())
  return text.trim() !== '' && Number.isFinite(term) && term > 0 && term <= MAX_TERM ? term : null
}

function parseRate(text: string): number | null {
  const rate = Number(text.trim().replace(/%$/, ''))
  return text.trim() !== '' && Number.isFinite(rate) && rate >= 0 && rate <= MAX_RATE ? rate : null
}

export default function MortgageInterestRateCalculator() {
  const [balance, setBalance] = useState('250000')
  const [term, setTerm] = useState('25')
  const [rateA, setRateA] = useState('5.44')
  const [rateB, setRateB] = useState('5.97')
  const [feeA, setFeeA] = useState('999')
  const b = parseFloat(balance.replace(/[£,\s]/g, '')) || 0
  const t = parseTerm(term)
  const a = parseRate(rateA)
  const bRate = parseRate(rateB)
  const fee = Math.max(0, parseFloat(feeA.replace(/[£,\s]/g, '')) || 0)

  const rates = useMemo(() => {
    const own = [a, bRate].filter((r): r is number => r !== null)
    return [...new Set([...FIXED_RATES, ...own])].sort((x, y) => x - y)
  }, [a, bRate])
  const results = useMemo(() => (t === null ? [] : calculate(b, t, rates)), [b, t, rates])
  const comparison = useMemo(
    () => (t !== null && a !== null && bRate !== null && b > 0 ? compareRates(b, t, a, bRate, fee) : null),
    [b, t, a, bRate, fee],
  )

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Mortgage Balance</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={balance} onChange={(e) => setBalance(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Mortgage Balance" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Term (years)</label><input type="number" min="1" max={MAX_TERM} value={term} onChange={(e) => setTerm(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Term (years)" />{t === null && <p className="text-xs text-destructive mt-1">Enter a term above 0 and up to {MAX_TERM} years.</p>}</div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Rate A (%)</label><input type="number" min="0" max={MAX_RATE} step="0.01" value={rateA} onChange={(e) => setRateA(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Rate A (%)" />{a === null && <p className="text-xs text-destructive mt-1">Enter a rate from 0% to {MAX_RATE}%.</p>}</div>
        <div><label className="block text-sm font-medium mb-2">Rate B (%)</label><input type="number" min="0" max={MAX_RATE} step="0.01" value={rateB} onChange={(e) => setRateB(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Rate B (%)" />{bRate === null && <p className="text-xs text-destructive mt-1">Enter a rate from 0% to {MAX_RATE}%.</p>}</div>
        <div><label className="block text-sm font-medium mb-2">Product Fee on Rate A</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" value={feeA} onChange={(e) => setFeeA(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Product Fee on Rate A" /></div></div>
      </div>
      {comparison && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in-up">
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Monthly at {comparison.a.rate}%</p><p className="text-lg font-bold">{formatCurrency(comparison.a.monthly)}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Monthly at {comparison.b.rate}%</p><p className="text-lg font-bold">{formatCurrency(comparison.b.monthly)}</p></div>
          <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">A Saves per Month</p><p className="text-lg font-bold text-primary">{formatCurrency(comparison.monthlyGap)}</p></div>
          <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">A Saves over the Term, after Fee</p><p className="text-lg font-bold text-primary">{formatCurrency(comparison.netOfFee)}</p></div>
          {fee > 0 && <p className="col-span-2 sm:col-span-4 text-xs text-muted-foreground">{comparison.feeRecoveredMonths === null ? 'Rate A has no lower payment, so the fee is never recovered.' : `Lower payments recover the fee in about ${comparison.feeRecoveredMonths} months, assuming each rate holds that long.`}</p>}
        </div>
      )}
      {b > 0 && t !== null && (
        <div className="overflow-x-auto animate-fade-in-up">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border"><th className="text-left py-2 font-medium text-muted-foreground">Rate</th><th className="text-right py-2 font-medium text-muted-foreground">Monthly</th><th className="text-right py-2 font-medium text-muted-foreground">Total Interest</th><th className="text-right py-2 font-medium text-muted-foreground">Total Paid</th></tr></thead>
            <tbody>{results.map(r => (
              <tr key={r.rate} className={`border-b border-border/50 hover:bg-accent/50 ${r.rate === a || r.rate === bRate ? 'bg-primary/5' : ''}`}><td className="py-2.5 font-medium">{r.rate}%{r.rate === a ? ' (A)' : ''}{r.rate === bRate ? ' (B)' : ''}</td><td className="text-right tabular-nums">{formatCurrency(r.monthly)}</td><td className="text-right tabular-nums text-destructive">{formatCurrency(r.totalInterest)}</td><td className="text-right tabular-nums">{formatCurrency(r.totalPaid)}</td></tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  )
}
