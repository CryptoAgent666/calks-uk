import { useState, useCallback } from 'react'

export default function RandomNumberGenerator() {
  const [min, setMin] = useState('1')
  const [max, setMax] = useState('100')
  const [count, setCount] = useState('1')
  const [unique, setUnique] = useState(false)
  const [results, setResults] = useState<number[]>([])

  const generate = useCallback(() => {
    const mn = parseInt(min) || 0
    const mx = parseInt(max) || 100
    const cnt = Math.min(parseInt(count) || 1, unique ? mx - mn + 1 : 1000)
    const lo = Math.min(mn, mx)
    const hi = Math.max(mn, mx)

    if (unique) {
      const pool: number[] = []
      for (let i = lo; i <= hi; i++) pool.push(i)
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]]
      }
      setResults(pool.slice(0, cnt))
    } else {
      const nums: number[] = []
      for (let i = 0; i < cnt; i++) {
        nums.push(Math.floor(Math.random() * (hi - lo + 1)) + lo)
      }
      setResults(nums)
    }
  }, [min, max, count, unique])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Minimum</label><input type="number" value={min} onChange={(e) => setMin(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Minimum" /></div>
        <div><label className="block text-sm font-medium mb-2">Maximum</label><input type="number" value={max} onChange={(e) => setMax(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Maximum" /></div>
        <div><label className="block text-sm font-medium mb-2">How Many</label><input type="number" min="1" max="100" value={count} onChange={(e) => setCount(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="How Many" /></div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" checked={unique} onChange={(e) => setUnique(e.target.checked)} className="h-5 w-5 rounded border-border" />
        <span className="text-sm">No duplicates (unique numbers only)</span>
      </label>

      <button onClick={generate} className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:bg-primary/90 transition-colors">
        Generate
      </button>

      {results.length > 0 && (
        <div className="animate-fade-in-up">
          {results.length === 1 ? (
            <div className="rounded-2xl bg-primary/10 p-8 text-center">
              <p className="text-6xl font-bold text-primary">{results[0]}</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 justify-center">
              {results.map((n, i) => (
                <div key={i} className="rounded-xl bg-primary/10 px-4 py-2 text-lg font-bold text-primary">{n}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
