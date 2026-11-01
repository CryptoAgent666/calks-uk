import { useState, useCallback } from 'react'

const MAX_RANGE = 2 ** 32 // secureRandomInt draws 32-bit values, so larger ranges cannot be covered
const MAX_COUNT = 1000

// Cryptographically secure, unbiased integer in [lo, hi] using rejection sampling.
// Falls back to Math.random() only if the Web Crypto API is unavailable.
function secureRandomInt(lo: number, hi: number): number {
  const range = hi - lo + 1
  if (range <= 0) return lo
  if (typeof crypto === 'undefined' || !crypto.getRandomValues) {
    return lo + Math.floor(Math.random() * range)
  }
  const maxUint = 0xFFFFFFFF
  const limit = maxUint - ((maxUint % range) + 1) % range // largest multiple of range that fits
  const buf = new Uint32Array(1)
  let x: number
  do {
    crypto.getRandomValues(buf)
    x = buf[0]
  } while (x > limit)
  return lo + (x % range)
}

// Partial Fisher–Yates with a CSPRNG source. The Map holds only the swapped slots,
// so a huge range costs no more than a small one.
function drawUnique(lo: number, range: number, count: number): number[] {
  const slots = new Map<number, number>()
  const out: number[] = []
  for (let i = 0; i < count; i++) {
    const j = secureRandomInt(i, range - 1)
    out.push(lo + (slots.get(j) ?? j))
    slots.set(j, slots.get(i) ?? i)
  }
  return out
}

function draw(min: string, max: string, count: string, unique: boolean): { results: number[]; message: string } {
  const mn = Number(min)
  const mx = Number(max)
  const cnt = Number(count)
  if (min.trim() === '' || max.trim() === '' || !Number.isSafeInteger(mn) || !Number.isSafeInteger(mx)) {
    return { results: [], message: 'Enter a whole number for both the minimum and the maximum.' }
  }
  if (count.trim() === '' || !Number.isInteger(cnt) || cnt < 1) {
    return { results: [], message: 'Ask for at least 1 number.' }
  }
  if (cnt > MAX_COUNT) {
    return { results: [], message: `You can generate up to ${MAX_COUNT.toLocaleString('en-GB')} numbers at a time.` }
  }
  const lo = Math.min(mn, mx)
  const hi = Math.max(mn, mx)
  const range = hi - lo + 1
  if (range > MAX_RANGE) {
    return { results: [], message: `The range can cover up to ${MAX_RANGE.toLocaleString('en-GB')} values. Narrow the minimum and maximum.` }
  }

  if (unique) {
    const take = Math.min(cnt, range)
    const message = cnt > range
      ? `Only ${range.toLocaleString('en-GB')} different number${range === 1 ? ' is' : 's are'} available in this range, so you have ${range === 1 ? 'it' : 'all of them'}.`
      : ''
    return { results: drawUnique(lo, range, take), message }
  }
  const nums: number[] = []
  for (let i = 0; i < cnt; i++) {
    nums.push(secureRandomInt(lo, hi))
  }
  return { results: nums, message: '' }
}

export default function RandomNumberGenerator() {
  const [min, setMin] = useState('1')
  const [max, setMax] = useState('100')
  const [count, setCount] = useState('1')
  const [unique, setUnique] = useState(false)
  const [results, setResults] = useState<number[]>([])
  const [message, setMessage] = useState('')

  const generate = useCallback(() => {
    const drawn = draw(min, max, count, unique)
    setResults(drawn.results)
    setMessage(drawn.message)
  }, [min, max, count, unique])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Minimum</label><input type="number" value={min} onChange={(e) => setMin(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Minimum" /></div>
        <div><label className="block text-sm font-medium mb-2">Maximum</label><input type="number" value={max} onChange={(e) => setMax(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Maximum" /></div>
        <div><label className="block text-sm font-medium mb-2">How Many</label><input type="number" min="1" max={MAX_COUNT} value={count} onChange={(e) => setCount(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="How Many" /></div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" checked={unique} onChange={(e) => setUnique(e.target.checked)} className="h-5 w-5 rounded border-border" />
        <span className="text-sm">No duplicates (unique numbers only)</span>
      </label>

      <button onClick={generate} className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:bg-primary/90 transition-colors">
        Generate
      </button>

      {message && <p className="text-sm text-muted-foreground" role="status">{message}</p>}

      {results.length > 0 && (
        <div className="animate-fade-in-up">
          {results.length === 1 ? (
            <div className="rounded-2xl bg-primary/10 p-8 text-center">
              <p className="text-6xl font-bold text-primary break-all">{results[0]}</p>
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
