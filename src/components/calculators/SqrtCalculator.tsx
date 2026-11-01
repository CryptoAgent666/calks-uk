import { useState } from 'react'

// Ten significant figures with trailing zeros dropped from the decimals only,
// leaving the zeros of 1000000000 and the exponent of 1e+10 alone
function fmt(v: number) {
  if (Number.isNaN(v)) return '—'
  if (!Number.isFinite(v)) return 'Too large to compute'
  const s = v.toPrecision(10)
  if (s.includes('e')) return s.replace(/\.?0+e/, 'e')
  return s.includes('.') ? s.replace(/\.?0+$/, '') : s
}

// A negative base only has a real power when the exponent reduces to an odd
// denominator, so (-32)^0.2 = -2 while (-8)^0.5 has no real result
function realPower(n: number, k: number) {
  if (n >= 0 || Number.isInteger(k)) return Math.pow(n, k)
  for (let q = 3; q <= 999; q += 2) {
    const top = Math.round(k * q)
    if (top !== 0 && Math.abs(k * q - top) < 1e-12) return (top % 2 ? -1 : 1) * Math.pow(-n, k)
  }
  return NaN
}

// Whole-number powers multiply exactly while the answer stays a safe integer
function power(n: number, k: number) {
  if (Number.isInteger(n) && Number.isInteger(k) && k > 0 && Math.abs(n) > 1) {
    let r = 1
    for (let i = 0; i < k && Number.isSafeInteger(r); i++) r *= n
    if (Number.isSafeInteger(r)) return r
  }
  return realPower(n, k)
}

function powerText(n: number, k: number) {
  if (n === 0 && k < 0) return 'Undefined'
  const v = power(n, k)
  if (Number.isNaN(v)) return 'No real result'
  if (v === 0 && n !== 0) return 'Too small to compute'
  if (Number.isInteger(n) && Number.isInteger(k) && k > 0 && Number.isSafeInteger(v)) return String(v)
  return fmt(v)
}

function rootText(x: number, k: number) {
  if (x < 0 && k % 2 === 0) return 'No real root'
  const r = Math.sign(x) * Math.pow(Math.abs(x), 1 / k)
  const whole = Math.round(r)
  if (power(whole, k) === x) return Number.isSafeInteger(whole) ? String(whole) : fmt(whole)
  return fmt(r)
}

function ordinal(k: number) {
  const tens = k % 100
  if (tens >= 11 && tens <= 13) return `${k}th`
  return `${k}${['th', 'st', 'nd', 'rd'][k % 10] ?? 'th'}`
}

function parse(s: string) {
  const v = parseFloat(s)
  return Number.isFinite(v) ? v : null
}

const inBrackets = (n: number) => (n < 0 ? `(${n})` : `${n}`)

export default function SqrtCalculator() {
  const [number, setNumber] = useState('')
  const [degree, setDegree] = useState('')
  const [customPower, setPower] = useState('')
  const [log, setLog] = useState('')

  // An empty box is null, so a typed 0 still gets its answer
  const n = parse(number)
  const k = parse(degree)
  const p = parse(customPower)
  const lg = parse(log)
  const degreeOk = k !== null && Number.isInteger(k) && k >= 2

  const log10Result = lg !== null && lg > 0 ? Math.log10(lg) : NaN
  const lnResult = lg !== null && lg > 0 ? Math.log(lg) : NaN
  const log2Result = lg !== null && lg > 0 ? Math.log2(lg) : NaN

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-border p-5 space-y-4">
        <h3 className="font-semibold">Roots & Powers</h3>
        <div>
          <label className="block text-sm font-medium mb-2">Number</label>
          <input type="number" step="any" value={number} onChange={(e) => setNumber(e.target.value)} placeholder="144" className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Number" />
        </div>
        {number.trim() !== '' && n === null && (
          <p role="alert" className="text-sm text-destructive">That number is too large to compute.</p>
        )}
        {n !== null && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in-up">
            <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">&radic;{n}</p><p className="text-lg font-bold text-primary">{rootText(n, 2)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">&#8731;{n}</p><p className="text-lg font-bold">{rootText(n, 3)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">{inBrackets(n)}&sup2;</p><p className="text-lg font-bold">{powerText(n, 2)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">{inBrackets(n)}&sup3;</p><p className="text-lg font-bold">{powerText(n, 3)}</p></div>
          </div>
        )}
        {n !== null && n < 0 && (
          <p className="text-sm text-muted-foreground">Negative numbers have no real square root. Odd roots, such as the cube root, still exist.</p>
        )}
        <div className="grid grid-cols-2 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-2">Root degree (n)</label>
            <input type="number" step="1" min="2" value={degree} onChange={(e) => setDegree(e.target.value)} placeholder="4" className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Root degree (n)" />
          </div>
          {n !== null && degreeOk && k !== null && <div className="rounded-xl bg-primary/10 p-3 text-center"><p className="text-xs text-muted-foreground">{ordinal(k)} root of {n}</p><p className="text-lg font-bold text-primary">{rootText(n, k)}</p></div>}
        </div>
        {degree.trim() !== '' && !degreeOk && (
          <p role="alert" className="text-sm text-destructive">The root degree must be a whole number of 2 or more.</p>
        )}
        <div className="grid grid-cols-2 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-2">Custom power (n^x)</label>
            <input type="number" step="any" value={customPower} onChange={(e) => setPower(e.target.value)} placeholder="0.5" className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Custom power (n^x)" />
          </div>
          {n !== null && p !== null && <div className="rounded-xl bg-primary/10 p-3 text-center"><p className="text-xs text-muted-foreground">{inBrackets(n)}^{p}</p><p className="text-lg font-bold text-primary">{powerText(n, p)}</p></div>}
        </div>
        {n === 0 && p === 0 && (
          <p className="text-sm text-muted-foreground">0^0 is undefined in some contexts and taken as 1 by convention in others.</p>
        )}
        {n === 0 && p !== null && p < 0 && (
          <p className="text-sm text-muted-foreground">Zero to a negative power would mean dividing by zero.</p>
        )}
        {n !== null && <p className="text-xs text-muted-foreground">Decimal results show 10 significant figures. Exact whole numbers are shown in full up to 9,007,199,254,740,991.</p>}
      </div>

      <div className="rounded-xl border border-border p-5 space-y-4">
        <h3 className="font-semibold">Logarithms</h3>
        <div>
          <label className="block text-sm font-medium mb-2">Number</label>
          <input type="number" step="any" min="0" value={log} onChange={(e) => setLog(e.target.value)} placeholder="100" className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Number" />
        </div>
        {lg !== null && lg > 0 && (
          <div className="grid grid-cols-3 gap-3 animate-fade-in-up">
            <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">log&#x2081;&#x2080;({lg})</p><p className="text-lg font-bold text-primary">{fmt(log10Result)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">ln({lg})</p><p className="text-lg font-bold">{fmt(lnResult)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">log&#x2082;({lg})</p><p className="text-lg font-bold">{fmt(log2Result)}</p></div>
          </div>
        )}
        {lg !== null && lg <= 0 && (
          <p role="alert" className="text-sm text-destructive">Logarithms are only defined for numbers above 0.</p>
        )}
        {log.trim() !== '' && lg === null && (
          <p role="alert" className="text-sm text-destructive">That number is too large to compute.</p>
        )}
      </div>
    </div>
  )
}
