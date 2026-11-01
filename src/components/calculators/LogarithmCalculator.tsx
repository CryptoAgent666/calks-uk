import { useState } from 'react'

// A blank base means the default of 10; a typed 0 is an invalid base, not a blank
function calculate(value: string, base: string) {
  const v = parseFloat(value) || 0
  const parsedBase = parseFloat(base)
  const b = Number.isNaN(parsedBase) ? 10 : parsedBase
  const validBase = b > 0 && b !== 1
  return {
    v,
    b,
    validBase,
    logBase: v > 0 && validBase ? Math.log(v) / Math.log(b) : NaN,
    log10: v > 0 ? Math.log10(v) : NaN,
    ln: v > 0 ? Math.log(v) : NaN,
    log2: v > 0 ? Math.log2(v) : NaN,
    antilog: Math.pow(10, v),
  }
}

// Eight significant figures with trailing zeros dropped from the decimals only,
// leaving the zeros of 10000000 and the exponent of 1e+10 alone
function fmt(n: number) {
  if (!Number.isFinite(n)) return '—'
  const s = n.toPrecision(8)
  if (s.includes('e')) return s.replace(/\.?0+e/, 'e')
  return s.includes('.') ? s.replace(/\.?0+$/, '') : s
}

export default function LogarithmCalculator() {
  const [value, setValue] = useState('100')
  const [base, setBase] = useState('10')

  const { v, b, validBase, logBase, log10, ln, log2, antilog } = calculate(value, base)
  const blank = value.trim() === ''

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Number</label><input type="number" step="any" min="0" value={value} onChange={(e) => setValue(e.target.value)} placeholder="100" className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Number" /></div>
        <div><label className="block text-sm font-medium mb-2">Custom Base</label><input type="number" step="any" min="0" value={base} onChange={(e) => setBase(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Custom Base" /></div>
      </div>

      {v <= 0 && (
        <div role="alert" className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
          {blank ? 'Enter a number above 0.' : 'A logarithm needs a number above 0: no power of a positive base gives 0 or a negative number.'}
        </div>
      )}
      {!validBase && (
        <div role="alert" className="rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 p-4 text-sm">
          The custom base must be above 0 and cannot be 1, because every power of 1 is 1. The other results do not use it.
        </div>
      )}

      {v > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in-up">
          <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">log₁₀({v})</p><p className="text-xl font-bold text-primary">{fmt(log10)}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">ln({v})</p><p className="text-xl font-bold">{fmt(ln)}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">log₂({v})</p><p className="text-xl font-bold">{fmt(log2)}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">log_{b}({v})</p><p className="text-xl font-bold">{fmt(logBase)}</p></div>
        </div>
      )}

      <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
        {!blank && <p>Also: 10^{value} = {fmt(antilog)} (antilog)</p>}
        <p className="mt-1">log rules: log(a×b) = log(a)+log(b) &middot; log(a/b) = log(a)-log(b) &middot; log(aⁿ) = n×log(a)</p>
      </div>
    </div>
  )
}
