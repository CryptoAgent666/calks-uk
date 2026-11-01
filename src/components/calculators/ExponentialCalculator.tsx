import { useState } from 'react'

// A negative base only has a real power when the exponent reduces to an odd
// denominator, so (-32)^0.2 = -2 while (-8)^0.5 has no real result
function realPower(b: number, e: number) {
  if (b >= 0 || Number.isInteger(e)) return Math.pow(b, e)
  for (let q = 3; q <= 999; q += 2) {
    const top = Math.round(e * q)
    if (top !== 0 && Math.abs(e * q - top) < 1e-12) return (top % 2 ? -1 : 1) * Math.pow(-b, e)
  }
  return NaN
}

// Whole-number powers multiply exactly while the answer stays a safe integer
function power(b: number, e: number) {
  if (Number.isInteger(b) && Number.isInteger(e) && e > 0 && Math.abs(b) > 1) {
    let r = 1
    for (let i = 0; i < e && Number.isSafeInteger(r); i++) r *= b
    if (Number.isSafeInteger(r)) return r
  }
  return realPower(b, e)
}

function scientific(n: number) {
  return n.toExponential(9).replace(/\.?0+e/, 'e')
}

// Ten significant figures, in scientific notation when the value is very large
// or very small, and exact digits for whole-number powers that fit
function fmt(n: number, exact: boolean) {
  const size = Math.abs(n)
  if (Number.isSafeInteger(n) && (exact || size < 1e15)) return n.toLocaleString('en-GB')
  if (size >= 1e10 || size < 1e-6) return scientific(n)
  return n.toLocaleString('en-GB', { maximumSignificantDigits: 10 })
}

function show(b: number, e: number) {
  if (b === 0 && e < 0) return 'Undefined'
  const v = power(b, e)
  if (Number.isNaN(v)) return 'No real result'
  if (!Number.isFinite(v)) return 'Too large to compute'
  if (v === 0 && b !== 0) return 'Too small to compute'
  return fmt(v, Number.isInteger(b) && Number.isInteger(e) && e > 0)
}

function note(b: number, e: number, text: string) {
  if (b === 0 && e === 0) return '0^0 is undefined in some contexts and taken as 1 by convention in others, as shown here.'
  if (text === 'Undefined') return 'Zero to a negative power would mean dividing by zero.'
  if (text === 'No real result') return 'A negative base with this exponent has no real result. Even roots of negative numbers, such as (-8)^0.5, exist only as imaginary numbers.'
  if (text === 'Too large to compute' || text === 'Too small to compute') return 'The answer exists, but it is beyond the range this calculator can hold.'
  return ''
}

function parse(s: string) {
  const v = parseFloat(s)
  return Number.isFinite(v) ? v : null
}

export default function ExponentialCalculator() {
  const [base, setBase] = useState('2')
  const [exp, setExp] = useState('10')

  // An empty box is null, so it is not treated as a typed 0
  const b = parse(base)
  const e = parse(exp)
  const result = b !== null && e !== null ? show(b, e) : '—'
  const message = b !== null && e !== null ? note(b, e, result)
    : (base.trim() !== '' && b === null) || (exp.trim() !== '' && e === null) ? 'That number is too large to compute.'
    : 'Enter a base and an exponent.'
  const baseLabel = b !== null && b < 0 ? `(${b})` : `${b}`

  // Common powers
  const commons = [2, 3, 4, 5, 10, -1, -2, 0.5]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 justify-center flex-wrap">
        <input type="number" step="any" value={base} onChange={(ev) => setBase(ev.target.value)} placeholder="base" aria-label="Base" className="w-24 rounded-xl border border-input bg-background px-4 py-3 text-2xl font-bold text-center focus:outline-none focus:ring-2 focus:ring-ring" />
        <span className="text-xl text-muted-foreground">^</span>
        <input type="number" step="any" value={exp} onChange={(ev) => setExp(ev.target.value)} placeholder="exp" aria-label="Exponent" className="w-24 rounded-xl border border-input bg-background px-4 py-3 text-2xl font-bold text-center focus:outline-none focus:ring-2 focus:ring-ring" />
        <span className="text-xl">=</span>
        <span className="text-2xl font-bold text-primary break-all">{result}</span>
      </div>

      {message && <p className="text-sm text-muted-foreground text-center">{message}</p>}

      {b !== null && b !== 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <h3 className="text-sm font-semibold">Powers of {b}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {commons.map(p => (
              <div key={p} className={`rounded-xl p-3 text-center ${p === e ? 'bg-primary/10 border-2 border-primary' : 'border border-border'}`}>
                <p className="text-xs text-muted-foreground">{baseLabel}<sup>{p}</sup></p>
                <p className="text-sm font-bold break-all">{show(b, p)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
