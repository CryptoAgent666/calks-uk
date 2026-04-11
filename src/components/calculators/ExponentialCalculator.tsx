import { useState } from 'react'

export default function ExponentialCalculator() {
  const [base, setBase] = useState('2')
  const [exp, setExp] = useState('10')

  const b = parseFloat(base) || 0
  const e = parseFloat(exp) || 0
  const result = Math.pow(b, e)
  const fmt = (n: number) => isNaN(n) || !isFinite(n) ? 'undefined' : Math.abs(n) > 1e15 ? n.toExponential(6) : n.toLocaleString('en-GB', { maximumFractionDigits: 10 })

  // Common powers
  const commons = [2, 3, 4, 5, 10, -1, -2, 0.5].map(p => ({ power: p, result: Math.pow(b, p) }))

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 justify-center flex-wrap">
        <input type="number" step="any" value={base} onChange={(ev) => setBase(ev.target.value)} placeholder="base" className="w-24 rounded-xl border border-input bg-background px-4 py-3 text-2xl font-bold text-center focus:outline-none focus:ring-2 focus:ring-ring" />
        <span className="text-xl text-muted-foreground">^</span>
        <input type="number" step="any" value={exp} onChange={(ev) => setExp(ev.target.value)} placeholder="exp" className="w-24 rounded-xl border border-input bg-background px-4 py-3 text-2xl font-bold text-center focus:outline-none focus:ring-2 focus:ring-ring" />
        <span className="text-xl">=</span>
        <span className="text-2xl font-bold text-primary">{fmt(result)}</span>
      </div>

      {b !== 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <h3 className="text-sm font-semibold">Powers of {b}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {commons.map(c => (
              <div key={c.power} className={`rounded-xl p-3 text-center ${c.power === e ? 'bg-primary/10 border-2 border-primary' : 'border border-border'}`}>
                <p className="text-xs text-muted-foreground">{b}<sup>{c.power}</sup></p>
                <p className="text-sm font-bold">{fmt(c.result)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
