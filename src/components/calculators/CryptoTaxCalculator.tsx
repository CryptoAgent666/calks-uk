import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent } from '@/utils'

const CGT_ALLOWANCE = 3_000
const BASIC_LIMIT = 50_270

function calculate(totalGains: number, totalLosses: number, otherIncome: number) {
  const netGain = Math.max(0, totalGains - totalLosses)
  const taxableGain = Math.max(0, netGain - CGT_ALLOWANCE)

  if (taxableGain <= 0) return { netGain, taxableGain: 0, cgt: 0, effectiveRate: 0 }

  const remainingBasic = Math.max(0, BASIC_LIMIT - otherIncome)
  const gainAtBasic = Math.min(taxableGain, remainingBasic)
  const gainAtHigher = taxableGain - gainAtBasic

  // CGT rates from 30 October 2024 Budget: 18% basic, 24% higher
  const cgt = gainAtBasic * 0.18 + gainAtHigher * 0.24

  return { netGain, taxableGain, cgt, effectiveRate: netGain > 0 ? (cgt / netGain) * 100 : 0 }
}

export default function CryptoTaxCalculator() {
  const [gains, setGains] = useState('')
  const [losses, setLosses] = useState('0')
  const [income, setIncome] = useState('35000')

  const g = parseFloat(gains.replace(/,/g, '')) || 0
  const l = parseFloat(losses.replace(/,/g, '')) || 0
  const i = parseFloat(income.replace(/,/g, '')) || 0
  const result = useMemo(() => calculate(g, l, i), [g, l, i])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Total Crypto Gains</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={gains} onChange={(e) => setGains(e.target.value)} placeholder="10,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Crypto Losses</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={losses} onChange={(e) => setLosses(e.target.value)} placeholder="0" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Other Annual Income</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={income} onChange={(e) => setIncome(e.target.value)} placeholder="35,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        </div>
      </div>

      {g > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Net Gain</p><p className="text-lg font-bold">{formatCurrency(result.netGain)}</p></div>
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center"><p className="text-xs text-muted-foreground">Tax-Free Allowance</p><p className="text-lg font-bold text-green-700 dark:text-green-400">{formatCurrency(Math.min(result.netGain, CGT_ALLOWANCE))}</p></div>
            <div className="rounded-xl bg-destructive/10 p-4 text-center"><p className="text-xs text-muted-foreground">CGT to Pay</p><p className="text-lg font-bold text-destructive">{formatCurrency(result.cgt)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Effective Rate</p><p className="text-lg font-bold">{formatPercent(result.effectiveRate)}</p></div>
          </div>

          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">UK Crypto Tax Rules:</p>
            <p>Crypto is treated as a capital asset — CGT applies when you sell, swap or spend.</p>
            <p>Annual exempt amount: <span className="font-medium text-foreground">£{CGT_ALLOWANCE.toLocaleString()}</span> (2026/27)</p>
            <p>Basic rate: <span className="font-medium text-foreground">18%</span> | Higher rate: <span className="font-medium text-foreground">24%</span> (from Oct 2024)</p>
            <p>Losses can be offset against gains in the same or future tax years.</p>
          </div>
        </div>
      )}
    </div>
  )
}
