import { useState, useMemo } from 'react'

function fmt(n: number) { return `£${n.toFixed(2)}` }

function calculate(bill: number, tipPct: number, people: number) {
  const tip = bill * (tipPct / 100)
  const total = bill + tip
  const perPerson = people > 0 ? total / people : total
  const tipPerPerson = people > 0 ? tip / people : tip

  return { bill, tip, total, perPerson, tipPerPerson }
}

export default function TipCalculator() {
  const [bill, setBill] = useState('')
  const [tipPct, setTipPct] = useState('10')
  const [people, setPeople] = useState('1')

  const b = parseFloat(bill) || 0
  const t = parseFloat(tipPct) || 0
  const p = parseInt(people) || 1
  const result = useMemo(() => calculate(b, t, p), [b, t, p])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Bill Amount</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="number" min="0" step="0.01" value={bill} onChange={(e) => setBill(e.target.value)} placeholder="50.00" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Bill Amount" /></div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Tip (%)</label>
          <input type="number" min="0" max="100" value={tipPct} onChange={(e) => setTipPct(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Tip (%)" />
          <div className="flex gap-2 mt-2">
            {[5, 10, 12.5, 15, 20].map((pct) => (
              <button key={pct} onClick={() => setTipPct(pct.toString())} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${parseFloat(tipPct) === pct ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-accent'}`}>{pct}%</button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Split Between</label>
          <input type="number" min="1" max="50" value={people} onChange={(e) => setPeople(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Split Between" />
        </div>
      </div>

      {b > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">{p > 1 ? 'Each Person Pays' : 'Total to Pay'}</p>
            <p className="text-3xl font-bold text-primary mt-1">{fmt(result.perPerson)}</p>
            {p > 1 && <p className="text-sm text-muted-foreground mt-1">Total: {fmt(result.total)} (tip: {fmt(result.tip)})</p>}
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Bill</p><p className="text-lg font-bold">{fmt(result.bill)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Tip ({t}%)</p><p className="text-lg font-bold">{fmt(result.tip)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Total</p><p className="text-lg font-bold">{fmt(result.total)}</p></div>
          </div>
        </div>
      )}
    </div>
  )
}
