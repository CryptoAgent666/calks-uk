import { useState } from 'react'

function gcd(a: number, b: number): number { return b === 0 ? Math.abs(a) : gcd(b, a % b) }

export default function RatioCalculator() {
  const [a, setA] = useState('3')
  const [b, setB] = useState('4')
  const [total, setTotal] = useState('700')

  const av = parseFloat(a) || 0
  const bv = parseFloat(b) || 0
  const tv = parseFloat(total.replace(/,/g, '')) || 0
  const sum = av + bv
  const partA = sum > 0 ? (av / sum) * tv : 0
  const partB = sum > 0 ? (bv / sum) * tv : 0
  const g = av > 0 && bv > 0 ? gcd(av, bv) : 1
  const simplified = `${av / g} : ${bv / g}`

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 flex-wrap justify-center">
        <input type="number" min="0" step="any" value={a} onChange={(e) => setA(e.target.value)} placeholder="3" className="w-24 rounded-xl border border-input bg-background px-4 py-3 text-center text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
        <span className="text-2xl font-bold">:</span>
        <input type="number" min="0" step="any" value={b} onChange={(e) => setB(e.target.value)} placeholder="4" className="w-24 rounded-xl border border-input bg-background px-4 py-3 text-center text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Total Amount to Divide</label>
        <input type="text" inputMode="numeric" value={total} onChange={(e) => setTotal(e.target.value)} placeholder="700" className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Total Amount to Divide" />
      </div>

      {av > 0 && bv > 0 && tv > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Part A ({av})</p><p className="text-2xl font-bold text-primary">{partA.toLocaleString('en-GB', {maximumFractionDigits: 2})}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Part B ({bv})</p><p className="text-2xl font-bold">{partB.toLocaleString('en-GB', {maximumFractionDigits: 2})}</p></div>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-center">
            <p className="text-muted-foreground">Simplified ratio: <span className="font-bold text-foreground">{simplified}</span></p>
            <p className="text-muted-foreground">A is {((av / sum) * 100).toFixed(1)}% &middot; B is {((bv / sum) * 100).toFixed(1)}%</p>
          </div>
        </div>
      )}
    </div>
  )
}
