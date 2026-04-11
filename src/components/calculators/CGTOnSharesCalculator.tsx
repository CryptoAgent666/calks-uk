import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent } from '@/utils'

const CGT_ALLOWANCE = 3_000

function calculate(purchasePrice: number, salePrice: number, fees: number, otherIncome: number, usedAllowance: boolean) {
  const gain = salePrice - purchasePrice - fees
  if (gain <= 0) return { gain, taxableGain: 0, cgt: 0, effectiveRate: 0, hasGain: false }

  const allowance = usedAllowance ? 0 : CGT_ALLOWANCE
  const taxableGain = Math.max(0, gain - allowance)

  const remainingBasic = Math.max(0, 50_270 - otherIncome)
  const gainAtBasic = Math.min(taxableGain, remainingBasic)
  const gainAtHigher = taxableGain - gainAtBasic

  const cgt = gainAtBasic * 0.10 + gainAtHigher * 0.20
  const effectiveRate = gain > 0 ? (cgt / gain) * 100 : 0

  return { gain, taxableGain, cgt, effectiveRate, hasGain: true, gainAtBasic, gainAtHigher, allowance }
}

export default function CGTOnSharesCalculator() {
  const [purchase, setPurchase] = useState('')
  const [sale, setSale] = useState('')
  const [fees, setFees] = useState('100')
  const [income, setIncome] = useState('40000')
  const [usedAllowance, setUsedAllowance] = useState(false)

  const p = parseFloat(purchase.replace(/,/g,'')) || 0
  const s = parseFloat(sale.replace(/,/g,'')) || 0
  const f = parseFloat(fees.replace(/,/g,'')) || 0
  const i = parseFloat(income.replace(/,/g,'')) || 0
  const result = useMemo(() => calculate(p, s, f, i, usedAllowance), [p, s, f, i, usedAllowance])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Purchase Price</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={purchase} onChange={(e) => setPurchase(e.target.value)} placeholder="10,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Sale Price</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={sale} onChange={(e) => setSale(e.target.value)} placeholder="15,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Trading Fees</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={fees} onChange={(e) => setFees(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Other Income</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={income} onChange={(e) => setIncome(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
      </div>
      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={usedAllowance} onChange={(e) => setUsedAllowance(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Already used CGT annual exempt amount this year</span></label>

      {p > 0 && s > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          {result.hasGain ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Gain</p><p className="text-lg font-bold">{formatCurrency(result.gain)}</p></div>
                <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center"><p className="text-xs text-muted-foreground">Tax-Free</p><p className="text-lg font-bold text-green-700 dark:text-green-400">{formatCurrency(result.allowance || 0)}</p></div>
                <div className="rounded-xl bg-destructive/10 p-4 text-center"><p className="text-xs text-muted-foreground">CGT to Pay</p><p className="text-lg font-bold text-destructive">{formatCurrency(result.cgt)}</p></div>
                <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Effective Rate</p><p className="text-lg font-bold">{formatPercent(result.effectiveRate)}</p></div>
              </div>
              {'gainAtBasic' in result && result.taxableGain > 0 && (
                <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
                  {result.gainAtBasic > 0 && <p>At 10% (basic rate): {formatCurrency(result.gainAtBasic)} = {formatCurrency(result.gainAtBasic * 0.10)}</p>}
                  {result.gainAtHigher > 0 && <p>At 20% (higher rate): {formatCurrency(result.gainAtHigher)} = {formatCurrency(result.gainAtHigher * 0.20)}</p>}
                  <p className="mt-1">Tip: selling within an ISA wrapper avoids CGT entirely.</p>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-2xl bg-green-100 dark:bg-green-950 p-6 text-center"><p className="text-lg font-bold text-green-700 dark:text-green-400">No gain — no CGT to pay</p><p className="text-sm text-muted-foreground mt-1">{result.gain < 0 ? `Loss of ${formatCurrency(Math.abs(result.gain))} — can be offset against future gains` : 'No profit on this sale'}</p></div>
          )}
        </div>
      )}
    </div>
  )
}
