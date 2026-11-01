import { useState } from 'react'

type Relation = 'independent' | 'exclusive'

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

function eventProbabilities(a: number, b: number, relation: Relation) {
  const inRange = a >= 0 && a <= 1 && b >= 0 && b <= 1
  // Mutually exclusive events cannot share more than the whole of the probability
  const possible = relation === 'independent' || a + b <= 1 + 1e-12
  const pAandB = relation === 'independent' ? a * b : 0
  return {
    inRange,
    possible,
    pAorB: relation === 'independent' ? a + b - a * b : a + b,
    pAandB,
    pNotA: 1 - a,
    // P(A|B) is undefined when B cannot happen
    pAgivenB: b > 0 ? pAandB / b : null,
  }
}

// Four decimals would show a small probability as 0.0000, so use powers of ten below that
function fmtProb(n: number | null) {
  if (n === null || isNaN(n) || !isFinite(n)) return '—'
  if (n > 0 && n < 0.0001) {
    const [mantissa, exponent] = n.toExponential(2).split('e')
    return `${mantissa} × 10^${Number(exponent)}`
  }
  return n < 1 && n > 0 ? n.toFixed(4) : n.toLocaleString()
}

// Whole numbers only: Number() rejects 10.7 as an integer, where parseInt would quietly use 10
function countingResults(n: number, r: number) {
  const valid = Number.isInteger(n) && Number.isInteger(r) && n >= 0 && r >= 0 && r <= n && n <= MAX_N
  return { valid, comb: valid ? combination(n, r) : null, perm: valid ? permutation(n, r) : null }
}

export default function ProbabilityCalculator() {
  const [eventA, setEventA] = useState('0.3')
  const [eventB, setEventB] = useState('0.5')
  const [relation, setRelation] = useState<Relation>('independent')
  const [combN, setCombN] = useState('10')
  const [combR, setCombR] = useState('3')

  const a = parseFloat(eventA) || 0
  const b = parseFloat(eventB) || 0

  const { inRange, possible, pAorB, pAandB, pNotA, pAgivenB } = eventProbabilities(a, b, relation)
  const validP = inRange && possible

  const { valid: validNR, comb, perm } = countingResults(Number(combN), Number(combR))

  const fmt = (n: number | null) => (validP ? fmtProb(n) : '—')

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-border p-5 space-y-4">
        <h3 className="font-semibold">Event Probability</h3>
        <div className="grid grid-cols-2 gap-2">
          {([{ v: 'independent' as Relation, l: 'Independent' }, { v: 'exclusive' as Relation, l: 'Mutually Exclusive' }]).map((o) => (
            <button key={o.v} onClick={() => setRelation(o.v)} className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border ${relation === o.v ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>{o.l}</button>
          ))}
        </div>
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
        {!inRange && <p className="text-sm text-destructive">Probabilities must be between 0 and 1.</p>}
        {inRange && !possible && <p className="text-sm text-destructive">Mutually exclusive events cannot add up to more than 1.</p>}
        {validP && pAgivenB === null && <p className="text-sm text-muted-foreground">P(A|B) is undefined when P(B) is 0, because B never happens.</p>}
        <p className="text-xs text-muted-foreground">{relation === 'independent'
          ? 'Assumes independent events. P(A or B) = P(A) + P(B) - P(A)P(B), and P(A|B) is simply P(A).'
          : 'Assumes mutually exclusive events. P(A or B) = P(A) + P(B), and P(A and B) and P(A|B) are 0.'} Dependent events need their own P(B|A), which this tool does not take.</p>
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
