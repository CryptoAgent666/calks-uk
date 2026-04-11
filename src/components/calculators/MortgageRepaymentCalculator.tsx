import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

type MortgageType = 'repayment' | 'interest-only'

function calculateMortgage(principal: number, annualRate: number, termYears: number, type: MortgageType) {
  const monthlyRate = annualRate / 100 / 12
  const totalPayments = termYears * 12

  if (type === 'interest-only') {
    const monthlyPayment = principal * monthlyRate
    const totalInterest = monthlyPayment * totalPayments
    return {
      monthlyPayment,
      totalRepaid: totalInterest + principal,
      totalInterest,
    }
  }

  // Repayment mortgage
  if (monthlyRate === 0) {
    return {
      monthlyPayment: principal / totalPayments,
      totalRepaid: principal,
      totalInterest: 0,
    }
  }

  const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
    (Math.pow(1 + monthlyRate, totalPayments) - 1)
  const totalRepaid = monthlyPayment * totalPayments
  const totalInterest = totalRepaid - principal

  return { monthlyPayment, totalRepaid, totalInterest }
}

export default function MortgageRepaymentCalculator() {
  const [amount, setAmount] = useState('250000')
  const [rate, setRate] = useState('4.5')
  const [term, setTerm] = useState('25')
  const [type, setType] = useState<MortgageType>('repayment')

  const principal = parseFloat(amount.replace(/,/g, '')) || 0
  const annualRate = parseFloat(rate) || 0
  const termYears = parseInt(term) || 0

  const result = useMemo(() => calculateMortgage(principal, annualRate, termYears, type), [principal, annualRate, termYears, type])

  return (
    <div className="space-y-6">
      {/* Mortgage Type */}
      <div>
        <label className="block text-sm font-medium mb-2">Mortgage Type</label>
        <div className="grid grid-cols-2 gap-2">
          {([
            { value: 'repayment' as MortgageType, label: 'Repayment' },
            { value: 'interest-only' as MortgageType, label: 'Interest Only' },
          ]).map((option) => (
            <button
              key={option.value}
              onClick={() => setType(option.value)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border ${
                type === option.value
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-muted border-border hover:bg-accent'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="mortgage-amount" className="block text-sm font-medium mb-2">Mortgage Amount</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">£</span>
            <input
              id="mortgage-amount"
              type="text"
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
        <div>
          <label htmlFor="mortgage-rate" className="block text-sm font-medium mb-2">Interest Rate (%)</label>
          <input
            id="mortgage-rate"
            type="number"
            min="0" max="20" step="0.1"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div>
          <label htmlFor="mortgage-term" className="block text-sm font-medium mb-2">Term (years)</label>
          <input
            id="mortgage-term"
            type="number"
            min="1" max="40"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Results */}
      {principal > 0 && annualRate > 0 && termYears > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Monthly Payment</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.monthlyPayment)}</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center">
              <p className="text-xs text-muted-foreground">Total Repaid</p>
              <p className="text-lg font-bold">{formatCurrency(result.totalRepaid)}</p>
            </div>
            <div className="rounded-xl bg-destructive/10 p-4 text-center">
              <p className="text-xs text-muted-foreground">Total Interest</p>
              <p className="text-lg font-bold text-destructive">{formatCurrency(result.totalInterest)}</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4 text-center">
              <p className="text-xs text-muted-foreground">Borrowed</p>
              <p className="text-lg font-bold">{formatCurrency(principal)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
