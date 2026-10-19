import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent, ukPersonalAllowance, UK_BASIC_BAND } from '@/utils'

const CGT_ALLOWANCE = 3_000
const REPORTING_PROCEEDS = 50_000 // report in SA if total proceeds exceed this, even within the allowance

function calculate(purchasePrice: number, salePrice: number, fees: number, otherIncome: number, allowanceUsed: number) {
  const gain = salePrice - purchasePrice - fees
  if (gain <= 0) return { gain, taxableGain: 0, cgt: 0, effectiveRate: 0, hasGain: false, taxFree: 0, gainAtBasic: 0, gainAtHigher: 0 }

  const allowance = Math.max(0, CGT_ALLOWANCE - Math.min(CGT_ALLOWANCE, allowanceUsed))
  const taxFree = Math.min(gain, allowance)
  const taxableGain = gain - taxFree

  // Gains use whatever is left of the £37,700 basic-rate band after TAXABLE
  // income. Unused personal allowance cannot be set against gains, so income
  // below £12,570 does not widen the 18% band beyond £37,700. Scottish
  // taxpayers use these UK bands for CGT too.
  const taxableIncome = Math.max(0, otherIncome - ukPersonalAllowance(otherIncome))
  const remainingBasic = Math.max(0, UK_BASIC_BAND - taxableIncome)
  const gainAtBasic = Math.min(taxableGain, remainingBasic)
  const gainAtHigher = taxableGain - gainAtBasic

  const cgt = gainAtBasic * 0.18 + gainAtHigher * 0.24 // 18%/24% from 30 Oct 2024
  const effectiveRate = (cgt / gain) * 100

  return { gain, taxableGain, cgt, effectiveRate, hasGain: true, taxFree, gainAtBasic, gainAtHigher }
}

const parseAmount = (v: string) => Math.max(0, parseFloat(v.replace(/[,£\s]/g, '')) || 0)

export default function CGTOnSharesCalculator() {
  const [purchase, setPurchase] = useState('10000')
  const [sale, setSale] = useState('30100')
  const [fees, setFees] = useState('100')
  const [income, setIncome] = useState('40000')
  const [used, setUsed] = useState('0')

  const p = parseAmount(purchase)
  const s = parseAmount(sale)
  const f = parseAmount(fees)
  const i = parseAmount(income)
  const u = parseAmount(used)
  const result = useMemo(() => calculate(p, s, f, i, u), [p, s, f, i, u])

  // A purchase price of £0 is valid (free or gifted shares), so show results once
  // the field has been filled in rather than only when it is above zero.
  const ready = purchase.trim() !== '' && s > 0

  const inputClass = 'w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring'

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Purchase Price (pooled cost)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={purchase} onChange={(e) => setPurchase(e.target.value)} placeholder="10,000" className={inputClass} aria-label="Purchase Price (pooled cost)" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Sale Price</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={sale} onChange={(e) => setSale(e.target.value)} placeholder="15,000" className={inputClass} aria-label="Sale Price" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Dealing Costs</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={fees} onChange={(e) => setFees(e.target.value)} className={inputClass} aria-label="Dealing Costs" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Taxable income before personal allowance</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={income} onChange={(e) => setIncome(e.target.value)} className={inputClass} aria-label="Taxable income before personal allowance" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Allowance already used this year</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={used} onChange={(e) => setUsed(e.target.value)} className={inputClass} aria-label="Allowance already used this year" /></div><p className="text-xs text-muted-foreground mt-1">Of the £3,000 annual exempt amount</p></div>
      </div>

      {ready && (
        <div className="space-y-4 animate-fade-in-up">
          {result.hasGain ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Gain</p><p className="text-lg font-bold">{formatCurrency(result.gain)}</p></div>
                <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center"><p className="text-xs text-muted-foreground">Tax-Free</p><p className="text-lg font-bold text-green-700 dark:text-green-400">{formatCurrency(result.taxFree)}</p></div>
                <div className="rounded-xl bg-destructive/10 p-4 text-center"><p className="text-xs text-muted-foreground">CGT to Pay</p><p className="text-lg font-bold text-destructive">{formatCurrency(result.cgt)}</p></div>
                <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Effective Rate</p><p className="text-lg font-bold">{formatPercent(result.effectiveRate)}</p></div>
              </div>
              <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-1">
                {result.gainAtBasic > 0 && <p>At 18% (within the basic-rate band): {formatCurrency(result.gainAtBasic)} = {formatCurrency(result.gainAtBasic * 0.18)}</p>}
                {result.gainAtHigher > 0 && <p>At 24% (above the basic-rate band): {formatCurrency(result.gainAtHigher)} = {formatCurrency(result.gainAtHigher * 0.24)}</p>}
                {result.taxableGain === 0 && <p>The whole gain is covered by the annual exempt amount.</p>}
                <p className="mt-1">Scottish taxpayers use these UK bands for CGT. Gift Aid donations and relief-at-source pension contributions widen the 18% band by their gross amount. Gains on shares held in an ISA are free of CGT, and a Bed and ISA moves holdings in within the £20,000 yearly ISA allowance.</p>
              </div>
            </>
          ) : (
            <div className="rounded-2xl bg-green-100 dark:bg-green-950 p-6 text-center"><p className="text-lg font-bold text-green-700 dark:text-green-400">No gain, so no CGT to pay</p><p className="text-sm text-muted-foreground mt-1">{result.gain < 0 ? `Loss of ${formatCurrency(Math.abs(result.gain))}. It is set against other gains in the same tax year first; any unused part carries forward only if you claim it within 4 years of the end of the tax year.` : 'No profit on this sale'}</p></div>
          )}
          {s > REPORTING_PROCEEDS && (
            <div className="rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 p-4 text-sm">
              <p>Proceeds over £50,000: if you are registered for Self Assessment you must report the disposal on your tax return even if the gain is within the allowance (the limit applies to your total proceeds for the year).</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
