import { useState } from 'react'

// Exact integer arithmetic, so large n doesn't overflow or lose precision
function permutation(n: number, r: number): bigint { let p = 1n; for (let i = 0; i < r; i++) p *= BigInt(n - i); return p }
function combination(n: number, r: number): bigint {
  const k = Math.min(r, n - r)
  let c = 1n
  for (let i = 1; i <= k; i++) c = (c * BigInt(n - k + i)) / BigInt(i)
  return c
}
const MAX_N = 1000

// Up to 15 digits in full, beyond that in scientific notation
function fmtBig(v: bigint | null) {
  if (v === null) return '—'
  const digits = v.toString()
  if (digits.length <= 15) return v.toLocaleString('en-GB')
  return `${digits[0]}.${digits.slice(1, 4)} × 10^${digits.length - 1}`
}

export default function ProbabilityCalculator() {
  const [eventA, setEventA] = useState('0.3')
  const [eventB, setEventB] = useState('0.5')
  const [combN, setCombN] = useState('10')
  const [combR, setCombR] = useState('3')

  const a = parseFloat(eventA) || 0
  const b = parseFloat(eventB) || 0
  const cn = parseInt(combN) || 0
  const cr = parseInt(combR) || 0

  const validP = a >= 0 && a <= 1 && b >= 0 && b <= 1
  const pAorB = a + b - a * b
  const pAandB = a * b
  const pNotA = 1 - a
  const pAgivenB = b > 0 ? pAandB / b : 0

  const validNR = cn >= 0 && cr >= 0 && cr <= cn && cn <= MAX_N
  const comb = validNR ? combination(cn, cr) : null
  const perm = validNR ? permutation(cn, cr) : null

  const fmt = (n: number) => !validP || isNaN(n) || !isFinite(n) ? '—' : n < 1 && n > 0 ? n.toFixed(4) : n.toLocaleString()

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-border p-5 space-y-4">
        <h3 className="font-semibold">Event Probability</h3>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-2">P(A)</label><input type="number" min="0" max="1" step="0.01" value={eventA} onChange={(e) => setEventA(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="P(A)" /></div>
          <div><label className="block text-sm font-medium mb-2">P(B)</label><input type="number" min="0" max="1" step="0.01" value={eventB} onChange={(e) => setEventB(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="P(B)" /></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl bg-primary/10 p-3 text-center"><p className="text-xs text-muted-foreground">P(A or B)</p><p className="text-lg font-bold text-primary">{fmt(pAorB)}</p></div>
          <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">P(A and B)</p><p className="text-lg font-bold">{fmt(pAandB)}</p></div>
          <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">P(not A)</p><p className="text-lg font-bold">{fmt(pNotA)}</p></div>
          <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">P(A|B)</p><p className="text-lg font-bold">{fmt(pAgivenB)}</p></div>
        </div>
        {!validP && <p className="text-sm text-destructive">Probabilities must be between 0 and 1.</p>}
        <p className="text-xs text-muted-foreground">Assumes independent events. P(A or B) = P(A) + P(B) - P(A)P(B)</p>
      </div>

      <div className="rounded-xl border border-border p-5 space-y-4">
        <h3 className="font-semibold">Combinations & Permutations</h3>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-2">n (total items)</label><input type="number" min="0" max={MAX_N} value={combN} onChange={(e) => setCombN(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="n (total items)" /></div>
          <div><label className="block text-sm font-medium mb-2">r (choosing)</label><input type="number" min="0" max={MAX_N} value={combR} onChange={(e) => setCombR(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="r (choosing)" /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">C(n,r) Combinations</p><p className="text-xl font-bold text-primary">{fmtBig(comb)}</p><p className="text-xs text-muted-foreground">Order doesn't matter</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">P(n,r) Permutations</p><p className="text-xl font-bold">{fmtBig(perm)}</p><p className="text-xs text-muted-foreground">Order matters</p></div>
        </div>
        {!validNR && <p className="text-sm text-destructive">Enter whole numbers with r no bigger than n, and n up to {MAX_N.toLocaleString('en-GB')}.</p>}
      </div>
    </div>
  )
}
