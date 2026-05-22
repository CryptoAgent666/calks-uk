import { useState, useMemo } from 'react'

export default function SqrtCalculator() {
  const [number, setNumber] = useState('')
  const [power, setPower] = useState('')
  const [log, setLog] = useState('')

  const n = parseFloat(number) || 0
  const p = parseFloat(power) || 0
  const lg = parseFloat(log) || 0

  const sqrtResult = n >= 0 ? Math.sqrt(n) : NaN
  const cubeRoot = Math.cbrt(n)
  const squared = n * n
  const cubed = n * n * n
  const powerResult = p !== 0 ? Math.pow(n, p) : NaN
  const log10Result = lg > 0 ? Math.log10(lg) : NaN
  const lnResult = lg > 0 ? Math.log(lg) : NaN
  const log2Result = lg > 0 ? Math.log2(lg) : NaN

  const fmt = (v: number) => isNaN(v) || !isFinite(v) ? '—' : v.toPrecision(10).replace(/\.?0+$/, '')

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-border p-5 space-y-4">
        <h3 className="font-semibold">Roots & Powers</h3>
        <div>
          <label className="block text-sm font-medium mb-2">Number</label>
          <input type="number" step="any" value={number} onChange={(e) => setNumber(e.target.value)} placeholder="144" className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Number" />
        </div>
        {n !== 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in-up">
            <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">&radic;{n}</p><p className="text-lg font-bold text-primary">{fmt(sqrtResult)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">&radic;[3]{n}</p><p className="text-lg font-bold">{fmt(cubeRoot)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">{n}&sup2;</p><p className="text-lg font-bold">{fmt(squared)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">{n}&sup3;</p><p className="text-lg font-bold">{fmt(cubed)}</p></div>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-2">Custom power (n^x)</label>
            <input type="number" step="any" value={power} onChange={(e) => setPower(e.target.value)} placeholder="0.5" className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Custom power (n^x)" />
          </div>
          {n !== 0 && p !== 0 && <div className="rounded-xl bg-primary/10 p-3 text-center"><p className="text-xs text-muted-foreground">{n}^{p}</p><p className="text-lg font-bold text-primary">{fmt(powerResult)}</p></div>}
        </div>
      </div>

      <div className="rounded-xl border border-border p-5 space-y-4">
        <h3 className="font-semibold">Logarithms</h3>
        <div>
          <label className="block text-sm font-medium mb-2">Number</label>
          <input type="number" step="any" min="0" value={log} onChange={(e) => setLog(e.target.value)} placeholder="100" className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Number" />
        </div>
        {lg > 0 && (
          <div className="grid grid-cols-3 gap-3 animate-fade-in-up">
            <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">log&#x2081;&#x2080;({lg})</p><p className="text-lg font-bold text-primary">{fmt(log10Result)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">ln({lg})</p><p className="text-lg font-bold">{fmt(lnResult)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">log&#x2082;({lg})</p><p className="text-lg font-bold">{fmt(log2Result)}</p></div>
          </div>
        )}
      </div>
    </div>
  )
}
