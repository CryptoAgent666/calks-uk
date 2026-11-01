import { useState, useMemo } from 'react'

// Trial division stays quick up to here on every keystroke, and well inside
// safe integers, so nextPrime and prevPrime always move and finish
const MAX_NUMBER = 1_000_000_000_000
const MAX_LIST = 1000

function isPrime(n: number): boolean {
  if (n < 2) return false
  if (n === 2 || n === 3) return true
  if (n % 2 === 0 || n % 3 === 0) return false
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false
  }
  return true
}

function factorize(n: number): number[] {
  if (n <= 1) return []
  const factors: number[] = []
  let d = 2
  let num = n
  while (d * d <= num) {
    while (num % d === 0) { factors.push(d); num /= d }
    d++
  }
  if (num > 1) factors.push(num)
  return factors
}

function nextPrime(n: number): number {
  let candidate = n + 1
  while (!isPrime(candidate)) candidate++
  return candidate
}

// No prime lies below 2
function prevPrime(n: number): number | null {
  if (n <= 2) return null
  let candidate = n - 1
  while (candidate > 1 && !isPrime(candidate)) candidate--
  return candidate
}

function readNumber(raw: string): { n: number } | { message: string } | null {
  if (!raw.trim()) return null
  const v = Number(raw)
  if (v > MAX_NUMBER) return { message: `This checker takes numbers up to ${MAX_NUMBER.toLocaleString('en-GB')}, because trial division slows down as numbers grow.` }
  if (!Number.isInteger(v)) return { message: 'Enter a whole number. Only whole numbers can be prime.' }
  if (v < 1) return { message: `${v} is not prime. Prime numbers are whole numbers greater than 1.` }
  return { n: v }
}

export default function PrimeNumberCalculator() {
  const [number, setNumber] = useState('97')

  const reading = readNumber(number)
  const n = reading && 'n' in reading ? reading.n : 0

  const result = useMemo(() => {
    if (n < 1) return null
    const prime = isPrime(n)
    const factors = factorize(n)
    const next = nextPrime(n)
    const prev = prevPrime(n)
    return { prime, factors, next, prev }
  }, [n])

  // Generate primes up to N
  const primesUpTo = useMemo(() => {
    if (n < 2 || n > MAX_LIST) return []
    const primes: number[] = []
    for (let i = 2; i <= n; i++) { if (isPrime(i)) primes.push(i) }
    return primes
  }, [n])

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Enter a Number</label>
        <input type="number" min="1" max={MAX_NUMBER} value={number} onChange={(e) => setNumber(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-2xl font-bold text-center focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Enter a Number" />
      </div>

      {reading && 'message' in reading && (
        <p role="alert" className="text-sm text-destructive text-center">{reading.message}</p>
      )}

      {result && (
        <div className="space-y-4 animate-fade-in-up">
          <div className={`rounded-2xl p-6 text-center ${result.prime ? 'bg-green-100 dark:bg-green-950' : 'bg-muted/50'}`}>
            <p className="text-3xl font-bold">{n}</p>
            <p className={`text-lg font-semibold mt-1 ${result.prime ? 'text-green-700 dark:text-green-400' : 'text-muted-foreground'}`}>{result.prime ? 'is PRIME' : 'is NOT prime'}</p>
          </div>

          {!result.prime && result.factors.length > 0 && (
            <div className="rounded-xl border border-border p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">Prime Factorisation</p>
              <p className="text-xl font-bold font-mono break-words">{n} = {result.factors.join(' × ')}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Previous Prime</p><p className="text-xl font-bold">{result.prev ?? 'None'}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Next Prime</p><p className="text-xl font-bold">{result.next}</p></div>
          </div>

          {primesUpTo.length > 0 && (
            <div className="rounded-xl border border-border p-4">
              <p className="text-sm font-medium mb-2">Primes up to {n} ({primesUpTo.length} found):</p>
              <div className="flex flex-wrap gap-1">{primesUpTo.map(p => <span key={p} className={`px-2 py-0.5 rounded text-xs font-mono ${p === n ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>{p}</span>)}</div>
            </div>
          )}
          {n > MAX_LIST && (
            <p className="text-xs text-muted-foreground text-center">The list of primes appears for numbers up to {MAX_LIST.toLocaleString('en-GB')}.</p>
          )}
        </div>
      )}
    </div>
  )
}
