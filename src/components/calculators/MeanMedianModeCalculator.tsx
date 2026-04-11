import { useState, useMemo } from 'react'

function calculate(input: string) {
  const numbers = input.split(/[,\s\n]+/).map(s => parseFloat(s.trim())).filter(n => !isNaN(n))
  if (numbers.length === 0) return null

  const sorted = [...numbers].sort((a, b) => a - b)
  const n = numbers.length
  const sum = numbers.reduce((a, b) => a + b, 0)
  const mean = sum / n
  const median = n % 2 === 0 ? (sorted[n/2 - 1] + sorted[n/2]) / 2 : sorted[Math.floor(n/2)]

  // Mode
  const freq: Record<number, number> = {}
  numbers.forEach(v => { freq[v] = (freq[v] || 0) + 1 })
  const maxFreq = Math.max(...Object.values(freq))
  const modes = Object.entries(freq).filter(([, f]) => f === maxFreq && f > 1).map(([v]) => parseFloat(v))

  const range = sorted[n-1] - sorted[0]
  const geometricMean = numbers.every(v => v > 0) ? Math.pow(numbers.reduce((a, b) => a * b, 1), 1/n) : NaN

  return { mean, median, modes, range, sum, count: n, min: sorted[0], max: sorted[n-1], geometricMean, sorted }
}

export default function MeanMedianModeCalculator() {
  const [input, setInput] = useState('12, 15, 18, 22, 15, 25, 15, 30')
  const result = useMemo(() => calculate(input), [input])
  const fmt = (v: number) => isNaN(v) ? '—' : Number.isInteger(v) ? v.toString() : v.toFixed(4)

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Enter Numbers (comma or space separated)</label>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={3} placeholder="12, 15, 18, 22, 15, 25" className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring resize-y" />
      </div>

      {result && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Mean</p><p className="text-xl font-bold text-primary">{fmt(result.mean)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Median</p><p className="text-xl font-bold">{fmt(result.median)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Mode</p><p className="text-xl font-bold">{result.modes.length > 0 ? result.modes.join(', ') : 'No mode'}</p></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="rounded-xl border border-border p-3 text-center"><p className="text-xs text-muted-foreground">Count</p><p className="text-lg font-bold">{result.count}</p></div>
            <div className="rounded-xl border border-border p-3 text-center"><p className="text-xs text-muted-foreground">Sum</p><p className="text-lg font-bold">{fmt(result.sum)}</p></div>
            <div className="rounded-xl border border-border p-3 text-center"><p className="text-xs text-muted-foreground">Min</p><p className="text-lg font-bold">{fmt(result.min)}</p></div>
            <div className="rounded-xl border border-border p-3 text-center"><p className="text-xs text-muted-foreground">Max</p><p className="text-lg font-bold">{fmt(result.max)}</p></div>
            <div className="rounded-xl border border-border p-3 text-center"><p className="text-xs text-muted-foreground">Range</p><p className="text-lg font-bold">{fmt(result.range)}</p></div>
          </div>
          <div className="rounded-xl border border-border p-3 text-center text-sm">
            <span className="text-muted-foreground">Sorted: </span><span className="font-mono">{result.sorted.join(', ')}</span>
          </div>
        </div>
      )}
    </div>
  )
}
