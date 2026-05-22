import { useState, useMemo } from 'react'

function calculate(input: string) {
  const numbers = input.split(/[,\s\n]+/).map(s => parseFloat(s.trim())).filter(n => !isNaN(n))
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

export default function StdDevCalculator() {
  const [input, setInput] = useState('10, 12, 23, 23, 16, 23, 21, 16')
  const result = useMemo(() => calculate(input), [input])

  const fmt = (v: number) => Number.isInteger(v) ? v.toString() : v.toFixed(4)

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Enter Numbers (comma or space separated)</label>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={3} placeholder="10, 12, 23, 23, 16, 23, 21, 16" className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring resize-y"  aria-label="Enter Numbers (comma or space separated)" />
      </div>

      {result && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Std Dev (Population)</p><p className="text-lg font-bold text-primary">{fmt(result.stdDev)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Std Dev (Sample)</p><p className="text-lg font-bold">{fmt(result.sampleStdDev)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Mean</p><p className="text-lg font-bold">{fmt(result.mean)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Median</p><p className="text-lg font-bold">{fmt(result.median)}</p></div>
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
