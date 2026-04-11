import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

type VatMode = 'add' | 'remove' | 'reverse'
type VatRate = 20 | 5 | 0

export default function VatCalculator() {
  const [amount, setAmount] = useState('')
  const [mode, setMode] = useState<VatMode>('add')
  const [rate, setRate] = useState<VatRate>(20)

  const value = parseFloat(amount.replace(/,/g, '')) || 0

  const result = useMemo(() => {
    const vatRate = rate / 100
    switch (mode) {
      case 'add': {
        const vat = value * vatRate
        return { net: value, vat, gross: value + vat }
      }
      case 'remove': {
        const net = value / (1 + vatRate)
        const vat = value - net
        return { net, vat, gross: value }
      }
      case 'reverse': {
        const net = value / (1 + vatRate)
        const vat = value - net
        return { net, vat, gross: value }
      }
      default:
        return { net: 0, vat: 0, gross: 0 }
    }
  }, [value, mode, rate])

  return (
    <div className="space-y-6">
      {/* Mode Selection */}
      <div>
        <label className="block text-sm font-medium mb-2">What do you want to do?</label>
        <div className="grid grid-cols-3 gap-2">
          {([
            { value: 'add' as VatMode, label: 'Add VAT' },
            { value: 'remove' as VatMode, label: 'Remove VAT' },
            { value: 'reverse' as VatMode, label: 'Reverse VAT' },
          ]).map((option) => (
            <button
              key={option.value}
              onClick={() => setMode(option.value)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border ${
                mode === option.value
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-muted border-border hover:bg-accent'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* VAT Rate */}
      <div>
        <label className="block text-sm font-medium mb-2">VAT Rate</label>
        <div className="flex gap-2">
          {([20, 5, 0] as VatRate[]).map((r) => (
            <button
              key={r}
              onClick={() => setRate(r)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors border ${
                rate === r
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-muted border-border hover:bg-accent'
              }`}
            >
              {r}%{r === 20 ? ' (Standard)' : r === 5 ? ' (Reduced)' : ' (Zero)'}
            </button>
          ))}
        </div>
      </div>

      {/* Amount Input */}
      <div>
        <label htmlFor="vat-amount" className="block text-sm font-medium mb-2">
          {mode === 'add' ? 'Amount (excluding VAT)' : 'Amount (including VAT)'}
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">£</span>
          <input
            id="vat-amount"
            type="text"
            inputMode="numeric"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="1,000"
            className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Results */}
      {value > 0 && (
        <div className="grid grid-cols-3 gap-3 animate-fade-in-up">
          <div className="rounded-xl bg-muted/50 p-4 text-center">
            <p className="text-xs text-muted-foreground">Net (excl. VAT)</p>
            <p className="text-xl font-bold">{formatCurrency(result.net)}</p>
          </div>
          <div className="rounded-xl bg-primary/10 p-4 text-center">
            <p className="text-xs text-muted-foreground">VAT ({rate}%)</p>
            <p className="text-xl font-bold text-primary">{formatCurrency(result.vat)}</p>
          </div>
          <div className="rounded-xl bg-muted/50 p-4 text-center">
            <p className="text-xs text-muted-foreground">Gross (incl. VAT)</p>
            <p className="text-xl font-bold">{formatCurrency(result.gross)}</p>
          </div>
        </div>
      )}
    </div>
  )
}
