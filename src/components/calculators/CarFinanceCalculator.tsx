import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

type FinanceType = 'pcp' | 'hp' | 'loan'

function calculate(carPrice: number, deposit: number, financeType: FinanceType, apr: number, termMonths: number, balloonPct: number) {
  const amountFinanced = carPrice - deposit
  const monthlyRate = apr / 100 / 12
  const balloon = financeType === 'pcp' ? carPrice * (balloonPct / 100) : 0

  let monthlyPayment: number
  if (monthlyRate === 0) {
    monthlyPayment = (amountFinanced - balloon) / termMonths
  } else {
    // PCP: amortise to balloon; HP/Loan: amortise to zero
    const pv = amountFinanced
    const fv = balloon
    monthlyPayment = (pv * monthlyRate * Math.pow(1 + monthlyRate, termMonths) - fv * monthlyRate) / (Math.pow(1 + monthlyRate, termMonths) - 1)
  }

  const totalPayments = monthlyPayment * termMonths + deposit
  const totalCost = totalPayments + balloon
  const totalInterest = totalCost - carPrice

  return { amountFinanced, monthlyPayment, totalPayments, totalCost, totalInterest, balloon, deposit }
}

export default function CarFinanceCalculator() {
  const [price, setPrice] = useState('25000')
  const [deposit, setDeposit] = useState('5000')
  const [type, setType] = useState<FinanceType>('pcp')
  const [apr, setApr] = useState('7.9')
  const [term, setTerm] = useState('48')
  const [balloon, setBalloon] = useState('40')

  const p = parseFloat(price.replace(/,/g,'')) || 0
  const d = parseFloat(deposit.replace(/,/g,'')) || 0
  const a = parseFloat(apr) || 0
  const t = parseInt(term) || 0
  const b = parseFloat(balloon) || 0
  const result = useMemo(() => calculate(p, d, type, a, t, b), [p, d, type, a, t, b])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-2">
        {([{v:'pcp' as FinanceType,l:'PCP',d:'Lower monthly, balloon at end'},{v:'hp' as FinanceType,l:'Hire Purchase',d:'Own it at the end'},{v:'loan' as FinanceType,l:'Personal Loan',d:'Borrow and buy outright'}]).map(o => (
          <button key={o.v} onClick={() => setType(o.v)} className={`px-4 py-3 rounded-xl text-sm text-left transition-colors border ${type === o.v ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>
            <div className="font-medium">{o.l}</div>
            <div className={`text-xs ${type === o.v ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{o.d}</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Car Price</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Deposit</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={deposit} onChange={(e) => setDeposit(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">APR (%)</label><input type="number" min="0" max="30" step="0.1" value={apr} onChange={(e) => setApr(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Term (months)</label><input type="number" min="12" max="60" value={term} onChange={(e) => setTerm(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        {type === 'pcp' && <div><label className="block text-sm font-medium mb-2">Balloon / GFV (%)</label><input type="number" min="10" max="60" value={balloon} onChange={(e) => setBalloon(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>}
      </div>

      {p > 0 && t > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Monthly Payment</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.monthlyPayment)}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Amount Financed</p><p className="text-lg font-bold">{formatCurrency(result.amountFinanced)}</p></div>
            <div className="rounded-xl bg-destructive/10 p-4 text-center"><p className="text-xs text-muted-foreground">Total Interest</p><p className="text-lg font-bold text-destructive">{formatCurrency(result.totalInterest)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Total Cost</p><p className="text-lg font-bold">{formatCurrency(result.totalCost)}</p></div>
            {type === 'pcp' && <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Balloon Payment</p><p className="text-lg font-bold">{formatCurrency(result.balloon)}</p></div>}
          </div>
        </div>
      )}
    </div>
  )
}
