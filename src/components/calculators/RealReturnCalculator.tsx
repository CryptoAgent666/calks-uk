import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent } from '@/utils'

function calculate(nominalReturn: number, inflationRate: number, amount: number, years: number, taxRate: number) {
  // Tax is taken from each year's return; a negative return pays none
  const netReturn = nominalReturn > 0 ? nominalReturn * (1 - taxRate / 100) : nominalReturn
  const realReturn = ((1 + netReturn / 100) / (1 + inflationRate / 100) - 1) * 100
  const nominalFinal = amount * Math.pow(1 + netReturn / 100, years)
  const realFinal = amount * Math.pow(1 + realReturn / 100, years)
  const purchasingPowerLoss = nominalFinal - realFinal

  return { netReturn, realReturn, nominalFinal, realFinal, purchasingPowerLoss }
}

export default function RealReturnCalculator() {
  const [nominal, setNominal] = useState('7')
  const [inflation, setInflation] = useState('3')
  const [amount, setAmount] = useState('100000')
  const [years, setYears] = useState('10')
  const [tax, setTax] = useState('0')

  const n = parseFloat(nominal) || 0
  const i = parseFloat(inflation) || 0
  const a = parseFloat(amount.replace(/,/g,'')) || 0
  const y = parseInt(years) || 0
  const taxRate = Math.min(100, Math.max(0, parseFloat(tax) || 0))
  const result = useMemo(() => calculate(n, i, a, y, taxRate), [n, i, a, y, taxRate])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Nominal Return (%)</label><input type="number" min="-10" max="30" step="0.5" value={nominal} onChange={(e) => setNominal(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Nominal Return (%)" /></div>
        <div><label className="block text-sm font-medium mb-2">Inflation (%)</label><input type="number" min="0" max="15" step="0.5" value={inflation} onChange={(e) => setInflation(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Inflation (%)" /></div>
        <div><label className="block text-sm font-medium mb-2">Investment Amount</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Investment Amount" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Years</label><input type="number" min="1" max="50" value={years} onChange={(e) => setYears(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Years" /></div>
        <div><label className="block text-sm font-medium mb-2">Tax on Returns (%)</label><input type="number" min="0" max="100" value={tax} onChange={(e) => setTax(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Tax on Returns (%)" /></div>
      </div>

      <div className="space-y-4 animate-fade-in-up">
        <div className="rounded-2xl bg-primary/10 p-6 text-center">
          <p className="text-sm text-muted-foreground">{taxRate > 0 ? 'Real Return (after inflation and tax)' : 'Real Return (after inflation, before tax)'}</p>
          <p className="text-4xl font-bold text-primary mt-1">{formatPercent(result.realReturn)}</p>
          <p className="text-sm text-muted-foreground mt-1">Nominal: {formatPercent(n)} &middot; {taxRate > 0 ? <>After tax: {formatPercent(result.netReturn)} &middot; </> : null}Inflation: {formatPercent(i)}</p>
        </div>
        {a > 0 && y > 0 && (
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Nominal Value</p><p className="text-lg font-bold">{formatCurrency(result.nominalFinal)}</p></div>
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center"><p className="text-xs text-muted-foreground">Real Value (today's £)</p><p className="text-lg font-bold text-green-700 dark:text-green-400">{formatCurrency(result.realFinal)}</p></div>
            <div className="rounded-xl bg-destructive/10 p-4 text-center"><p className="text-xs text-muted-foreground">Lost to Inflation</p><p className="text-lg font-bold text-destructive">{formatCurrency(result.purchasingPowerLoss)}</p></div>
          </div>
        )}
        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
          <p>Leave tax at 0% for an ISA or interest inside your Personal Savings Allowance (£1,000 basic rate, £500 higher rate, nil additional rate). Above that, tax on savings interest is 20%, 40% or 45% in 2026/27, rising to 24%, 44% or 49% from April 2027. The rate is applied to each year's return, which suits interest better than gains taxed on sale.</p>
        </div>
      </div>
    </div>
  )
}
