import { useState, useMemo } from 'react'

type Op = '+' | '-' | '*' | '/'

function gcd(a: number, b: number): number { return b === 0 ? Math.abs(a) : gcd(b, a % b) }

function calculate(n1: number, d1: number, op: Op, n2: number, d2: number) {
  if (d1 === 0 || d2 === 0) return null
  if (op === '/' && n2 === 0) return null

  let rn: number, rd: number
  switch (op) {
    case '+': rn = n1 * d2 + n2 * d1; rd = d1 * d2; break
    case '-': rn = n1 * d2 - n2 * d1; rd = d1 * d2; break
    case '*': rn = n1 * n2; rd = d1 * d2; break
    case '/': rn = n1 * d2; rd = d1 * n2; break
  }

  if (rd < 0) { rn = -rn; rd = -rd }
  const g = gcd(rn, rd)
  const sn = rn / g
  const sd = rd / g
  const decimal = sn / sd

  // Mixed number
  const whole = Math.trunc(decimal)
  const remN = Math.abs(sn) - Math.abs(whole) * sd
  const mixed = whole !== 0 && remN > 0 ? `${whole} ${remN}/${sd}` : whole !== 0 && remN === 0 ? `${whole}` : `${sn}/${sd}`

  return { numerator: sn, denominator: sd, decimal, mixed }
}

export default function FractionCalculator() {
  const [n1, setN1] = useState('1')
  const [d1, setD1] = useState('2')
  const [op, setOp] = useState<Op>('+')
  const [n2, setN2] = useState('1')
  const [d2, setD2] = useState('3')

  const result = useMemo(() => calculate(parseInt(n1)||0, parseInt(d1)||1, op, parseInt(n2)||0, parseInt(d2)||1), [n1, d1, op, n2, d2])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 flex-wrap justify-center">
        <div className="text-center">
          <input type="number" value={n1} onChange={(e) => setN1(e.target.value)} className="w-16 rounded-lg border border-input bg-background px-2 py-2 text-center text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
          <div className="border-t-2 border-foreground my-1 mx-2" />
          <input type="number" value={d1} onChange={(e) => setD1(e.target.value)} className="w-16 rounded-lg border border-input bg-background px-2 py-2 text-center text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>

        <div className="flex gap-1">
          {(['+', '-', '*', '/'] as Op[]).map(o => (
            <button key={o} onClick={() => setOp(o)} className={`w-10 h-10 rounded-lg text-lg font-bold transition-colors ${op === o ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-accent'}`}>{o === '*' ? '\u00d7' : o === '/' ? '\u00f7' : o}</button>
          ))}
        </div>

        <div className="text-center">
          <input type="number" value={n2} onChange={(e) => setN2(e.target.value)} className="w-16 rounded-lg border border-input bg-background px-2 py-2 text-center text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
          <div className="border-t-2 border-foreground my-1 mx-2" />
          <input type="number" value={d2} onChange={(e) => setD2(e.target.value)} className="w-16 rounded-lg border border-input bg-background px-2 py-2 text-center text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>

        <span className="text-2xl font-bold">=</span>

        {result && (
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{result.numerator}/{result.denominator}</p>
            <p className="text-sm text-muted-foreground">{result.mixed} = {result.decimal.toFixed(6).replace(/\.?0+$/, '')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
