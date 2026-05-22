import { useState } from 'react'

export default function LogarithmCalculator() {
  const [value, setValue] = useState('100')
  const [base, setBase] = useState('10')

  const v = parseFloat(value) || 0
  const b = parseFloat(base) || 10
  const logBase = v > 0 && b > 0 && b !== 1 ? Math.log(v) / Math.log(b) : NaN
  const log10 = v > 0 ? Math.log10(v) : NaN
  const ln = v > 0 ? Math.log(v) : NaN
  const log2 = v > 0 ? Math.log2(v) : NaN
  const antilog = Math.pow(10, v)

  const fmt = (n: number) => isNaN(n) || !isFinite(n) ? '—' : Math.abs(n) > 1e10 ? n.toExponential(4) : n.toPrecision(8).replace(/\.?0+$/, '')

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Number</label><input type="number" step="any" min="0" value={value} onChange={(e) => setValue(e.target.value)} placeholder="100" className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Number" /></div>
        <div><label className="block text-sm font-medium mb-2">Custom Base</label><input type="number" step="any" min="0" value={base} onChange={(e) => setBase(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Custom Base" /></div>
      </div>

      {v > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in-up">
          <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">log₁₀({v})</p><p className="text-xl font-bold text-primary">{fmt(log10)}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">ln({v})</p><p className="text-xl font-bold">{fmt(ln)}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">log₂({v})</p><p className="text-xl font-bold">{fmt(log2)}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">log_{b}({v})</p><p className="text-xl font-bold">{fmt(logBase)}</p></div>
        </div>
      )}

      <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
        <p>Also: 10^{value} = {fmt(antilog)} (antilog)</p>
        <p className="mt-1">log rules: log(a×b) = log(a)+log(b) &middot; log(a/b) = log(a)-log(b) &middot; log(aⁿ) = n×log(a)</p>
      </div>
    </div>
  )
}
