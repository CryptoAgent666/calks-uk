import { useState, useMemo } from 'react'

// Strict parse: a token is either a whole number or it is reported as ignored,
// so "12abc" is never quietly read as 12.
export function parseValues(input: string) {
  const tokens = input.split(/[,;\s]+/).filter(Boolean)
  const numbers: number[] = []
  const ignored: string[] = []
  for (const t of tokens) {
    const n = Number(t)
    if (Number.isFinite(n)) numbers.push(n)
    else ignored.push(t)
  }
  // "1,000" and "1,5 2,5" split on the comma, which is a separator here
  const commaInNumber = /\d,\d{3}(?!\d)/.test(input) || (/\s/.test(input) && !/,\s/.test(input) && /\d,\d/.test(input))
  return { numbers, ignored, commaInNumber }
}

export function calculate(input: string) {
  const { numbers } = parseValues(input)
  if (numbers.length < 2) return null

  const n = numbers.length
  const mean = numbers.reduce((a, b) => a + b, 0) / n
  const variance = numbers.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / n
  const sampleVariance = numbers.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / (n - 1)
  const stdDev = Math.sqrt(variance)
  const sampleStdDev = Math.sqrt(sampleVariance)
  const sorted = [...numbers].sort((a, b) => a - b)
  const median = n % 2 === 0 ? (sorted[n/2 - 1] + sorted[n/2]) / 2 : sorted[Math.floor(n/2)]
  const min = sorted[0]
  const max = sorted[n - 1]
  const range = max - min
  const sum = numbers.reduce((a, b) => a + b, 0)

  return { n, mean, variance, sampleVariance, stdDev, sampleStdDev, median, min, max, range, sum }
}

// Four decimals, except for very small values, which keep four significant figures
export const fmt = (v: number) => {
  if (Number.isInteger(v)) return v.toString()
  return Math.abs(v) < 0.01 ? Number(v.toPrecision(4)).toString() : v.toFixed(4)
}

export default function StdDevCalculator() {
  const [input, setInput] = useState('10, 12, 23, 23, 16, 23, 21, 16')
  const result = useMemo(() => calculate(input), [input])
  const parsed = useMemo(() => parseValues(input), [input])

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Enter Numbers (comma or space separated)</label>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={3} placeholder="10, 12, 23, 23, 16, 23, 21, 16" className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring resize-y"  aria-label="Enter Numbers (comma or space separated)" />
      </div>

      {parsed.ignored.length > 0 && (
        <div role="alert" className="rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 p-4 text-sm">
          Ignored because they are not plain numbers: {parsed.ignored.join(', ')}
        </div>
      )}
      {parsed.commaInNumber && (
        <div role="alert" className="rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 p-4 text-sm">
          Commas separate values here, so 1,000 counts as 1 and 0, and 2,5 as 2 and 5. Remove thousands commas and use a point for decimals.
        </div>
      )}
      {!result && (
        <div role="alert" className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
          {parsed.numbers.length === 1
            ? 'One value has no spread to measure. Enter at least two numbers.'
            : 'Enter at least two numbers, separated by commas or spaces.'}
        </div>
      )}

      {result && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Std Dev (Population)</p><p className="text-lg font-bold text-primary">{fmt(result.stdDev)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Std Dev (Sample)</p><p className="text-lg font-bold">{fmt(result.sampleStdDev)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Mean</p><p className="text-lg font-bold">{fmt(result.mean)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Median</p><p className="text-lg font-bold">{fmt(result.median)}</p></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Variance (Population)</p><p className="text-lg font-bold">{fmt(result.variance)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Variance (Sample)</p><p className="text-lg font-bold">{fmt(result.sampleVariance)}</p></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="rounded-xl border border-border p-3 text-center"><p className="text-xs text-muted-foreground">Count</p><p className="text-lg font-bold">{result.n}</p></div>
            <div className="rounded-xl border border-border p-3 text-center"><p className="text-xs text-muted-foreground">Sum</p><p className="text-lg font-bold">{fmt(result.sum)}</p></div>
            <div className="rounded-xl border border-border p-3 text-center"><p className="text-xs text-muted-foreground">Min</p><p className="text-lg font-bold">{fmt(result.min)}</p></div>
            <div className="rounded-xl border border-border p-3 text-center"><p className="text-xs text-muted-foreground">Max</p><p className="text-lg font-bold">{fmt(result.max)}</p></div>
            <div className="rounded-xl border border-border p-3 text-center"><p className="text-xs text-muted-foreground">Range</p><p className="text-lg font-bold">{fmt(result.range)}</p></div>
          </div>
        </div>
      )}
    </div>
  )
}
