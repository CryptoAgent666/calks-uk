import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

type FinanceType = 'pcp' | 'hp' | 'loan'

const FINANCE_OPTIONS: { v: FinanceType; l: string; d: string }[] = [
  { v: 'pcp', l: 'PCP', d: 'Lower monthly, balloon at end' },
  { v: 'hp', l: 'Hire Purchase', d: 'Own it at the end' },
  { v: 'loan', l: 'Personal Loan', d: 'Borrow and buy outright' },
]

// A UK APR is an annual effective rate, so the monthly rate is (1 + APR)^(1/12) - 1
function monthlyRateFromApr(apr: number) {
  return apr > 0 ? Math.pow(1 + apr / 100, 1 / 12) - 1 : 0
}

function calculate(carPrice: number, deposit: number, financeType: FinanceType, apr: number, termMonths: number, balloonPct: number) {
  const amountFinanced = Math.max(0, carPrice - deposit)
  const monthlyRate = monthlyRateFromApr(apr)
  const requestedBalloon = financeType === 'pcp' ? carPrice * (balloonPct / 100) : 0
  // The balloon (GFV) cannot exceed the amount borrowed, or the monthly payment would turn negative
  const balloonTooHigh = requestedBalloon > amountFinanced
  const balloon = Math.min(requestedBalloon, amountFinanced)

  let monthlyPayment = 0
  if (termMonths > 0) {
    if (monthlyRate === 0) {
      monthlyPayment = (amountFinanced - balloon) / termMonths
    } else {
      // PCP: amortise to the balloon; HP and loan: amortise to zero
      const growth = Math.pow(1 + monthlyRate, termMonths)
      monthlyPayment = (amountFinanced * monthlyRate * growth - balloon * monthlyRate) / (growth - 1)
    }
  }

  const paidDeposit = Math.min(deposit, carPrice)
  const totalPayments = monthlyPayment * termMonths + paidDeposit
  const totalCost = totalPayments + balloon
  const totalInterest = totalCost - paidDeposit - amountFinanced

  return { amountFinanced, monthlyPayment, totalPayments, totalCost, totalInterest, balloon, balloonTooHigh, deposit: paidDeposit }
}

function compareOptions(carPrice: number, deposit: number, dealerApr: number, loanApr: number, termMonths: number, balloonPct: number) {
  return FINANCE_OPTIONS.map(o => {
    const apr = o.v === 'loan' ? loanApr : dealerApr
    return { ...o, apr, ...calculate(carPrice, deposit, o.v, apr, termMonths, balloonPct) }
  })
}

export default function CarFinanceCalculator() {
  const [price, setPrice] = useState('25000')
  const [deposit, setDeposit] = useState('5000')
  const [type, setType] = useState<FinanceType>('pcp')
  const [apr, setApr] = useState('7.9')
  const [loanApr, setLoanApr] = useState('6.9')
  const [term, setTerm] = useState('48')
  const [balloon, setBalloon] = useState('40')

  const p = parseFloat(price.replace(/,/g,'')) || 0
  const d = parseFloat(deposit.replace(/,/g,'')) || 0
  const a = parseFloat(apr) || 0
  const la = parseFloat(loanApr) || 0
  const t = parseInt(term) || 0
  const b = parseFloat(balloon) || 0
  const selectedApr = type === 'loan' ? la : a
  const result = useMemo(() => calculate(p, d, type, selectedApr, t, b), [p, d, type, selectedApr, t, b])
  const comparison = useMemo(() => compareOptions(p, d, a, la, t, b), [p, d, a, la, t, b])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-2">
        {FINANCE_OPTIONS.map(o => (
          <button key={o.v} onClick={() => setType(o.v)} className={`px-4 py-3 rounded-xl text-sm text-left transition-colors border ${type === o.v ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>
            <div className="font-medium">{o.l}</div>
            <div className={`text-xs ${type === o.v ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{o.d}</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Car Price</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Car Price" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Deposit</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={deposit} onChange={(e) => setDeposit(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Deposit" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Term (months)</label><input type="number" min="12" max="60" value={term} onChange={(e) => setTerm(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Term (months)" /></div>
        <div><label className="block text-sm font-medium mb-2">PCP / HP APR (%)</label><input type="number" min="0" max="30" step="0.1" value={apr} onChange={(e) => setApr(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="PCP / HP APR (%)" /></div>
        <div><label className="block text-sm font-medium mb-2">Personal Loan APR (%)</label><input type="number" min="0" max="30" step="0.1" value={loanApr} onChange={(e) => setLoanApr(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Personal Loan APR (%)" /></div>
        <div><label className="block text-sm font-medium mb-2">PCP Balloon / GFV (%)</label><input type="number" min="10" max="60" value={balloon} onChange={(e) => setBalloon(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="PCP Balloon / GFV (%)" /></div>
      </div>

      {p > 0 && t > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          {comparison[0].balloonTooHigh && (
            <div role="alert" className="rounded-xl bg-orange-100 dark:bg-orange-950 p-4 text-sm text-orange-800 dark:text-orange-300">The PCP balloon ({formatCurrency(p * b / 100)}) is more than the amount you are borrowing ({formatCurrency(result.amountFinanced)}), so it has been capped at the amount borrowed. Lower the GFV percentage or the deposit.</div>
          )}
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Monthly Payment</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.monthlyPayment)}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Amount Financed</p><p className="text-lg font-bold">{formatCurrency(result.amountFinanced)}</p></div>
            <div className="rounded-xl bg-destructive/10 p-4 text-center"><p className="text-xs text-muted-foreground">Total Interest</p><p className="text-lg font-bold text-destructive">{formatCurrency(result.totalInterest)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Total Cost (incl. deposit)</p><p className="text-lg font-bold">{formatCurrency(result.totalCost)}</p></div>
            {type === 'pcp' && <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Balloon Payment</p><p className="text-lg font-bold">{formatCurrency(result.balloon)}</p></div>}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 font-medium text-muted-foreground">Option</th>
                  <th className="text-right py-2 font-medium text-muted-foreground">APR</th>
                  <th className="text-right py-2 font-medium text-muted-foreground">Monthly</th>
                  <th className="text-right py-2 font-medium text-muted-foreground">Interest</th>
                  <th className="text-right py-2 font-medium text-muted-foreground">Total cost</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map(o => (
                  <tr key={o.v} className={`border-b border-border/50 ${o.v === type ? 'font-semibold' : ''}`}>
                    <td className="py-2">{o.l}{o.v === 'pcp' ? ` (+ ${formatCurrency(o.balloon)} balloon)` : ''}</td>
                    <td className="text-right tabular-nums">{o.apr}%</td>
                    <td className="text-right tabular-nums">{formatCurrency(o.monthlyPayment)}</td>
                    <td className="text-right tabular-nums">{formatCurrency(o.totalInterest)}</td>
                    <td className="text-right tabular-nums">{formatCurrency(o.totalCost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-muted-foreground mt-2">Total cost includes the deposit, and for PCP the balloon you pay if you keep the car. Hand a PCP car back instead and you pay {formatCurrency(comparison[0].totalPayments)} but own nothing. Monthly rates are worked out from the APR as an annual effective rate, with no fees added.</p>
          </div>
        </div>
      )}
    </div>
  )
}
