import { useState } from 'react'

type AngleUnit = 'degrees' | 'radians'

function toRad(deg: number) { return deg * Math.PI / 180 }
function toDeg(rad: number) { return rad * 180 / Math.PI }

export default function TrigCalculator() {
  const [angle, setAngle] = useState('45')
  const [unit, setUnit] = useState<AngleUnit>('degrees')
  const [side, setSide] = useState('')
  const [invValue, setInvValue] = useState('0.5')

  const a = parseFloat(angle) || 0
  const rad = unit === 'degrees' ? toRad(a) : a
  const deg = unit === 'radians' ? toDeg(a) : a

  const sin = Math.sin(rad)
  const cos = Math.cos(rad)
  const tan = Math.tan(rad)
  const sec = 1 / cos
  const csc = 1 / sin
  const cot = 1 / tan

  const iv = parseFloat(invValue) || 0
  const asin = Math.asin(Math.max(-1, Math.min(1, iv)))
  const acos = Math.acos(Math.max(-1, Math.min(1, iv)))
  const atan = Math.atan(iv)

  const fmt = (n: number) => isNaN(n) || !isFinite(n) ? 'undefined' : n.toPrecision(8).replace(/\.?0+$/, '')

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-border p-5 space-y-4">
        <h3 className="font-semibold">Trigonometric Functions</h3>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-2">Angle</label><input type="number" step="any" value={angle} onChange={(e) => setAngle(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Angle" /></div>
          <div><label className="block text-sm font-medium mb-2">Unit</label><div className="grid grid-cols-2 gap-2"><button onClick={() => setUnit('degrees')} className={`px-4 py-3 rounded-xl text-sm font-medium border ${unit === 'degrees' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>Degrees</button><button onClick={() => setUnit('radians')} className={`px-4 py-3 rounded-xl text-sm font-medium border ${unit === 'radians' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>Radians</button></div></div>
        </div>
        <div className="flex flex-wrap gap-2">{[0,30,45,60,90,120,180,270,360].map(v => <button key={v} onClick={() => {setAngle(v.toString()); setUnit('degrees')}} className="px-3 py-1.5 rounded-lg bg-muted text-sm font-medium hover:bg-accent">{v}°</button>)}</div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="rounded-xl bg-primary/10 p-3 text-center"><p className="text-xs text-muted-foreground">sin({deg}°)</p><p className="text-lg font-bold text-primary">{fmt(sin)}</p></div>
          <div className="rounded-xl bg-primary/10 p-3 text-center"><p className="text-xs text-muted-foreground">cos({deg}°)</p><p className="text-lg font-bold text-primary">{fmt(cos)}</p></div>
          <div className="rounded-xl bg-primary/10 p-3 text-center"><p className="text-xs text-muted-foreground">tan({deg}°)</p><p className="text-lg font-bold text-primary">{fmt(tan)}</p></div>
          <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">sec</p><p className="text-lg font-bold">{fmt(sec)}</p></div>
          <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">csc</p><p className="text-lg font-bold">{fmt(csc)}</p></div>
          <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">cot</p><p className="text-lg font-bold">{fmt(cot)}</p></div>
        </div>
        <p className="text-xs text-muted-foreground text-center">{deg}° = {rad.toFixed(4)} radians</p>
      </div>

      <div className="rounded-xl border border-border p-5 space-y-4">
        <h3 className="font-semibold">Inverse Functions</h3>
        <div><label className="block text-sm font-medium mb-2">Value</label><input type="number" step="0.01" min="-1" max="99" value={invValue} onChange={(e) => setInvValue(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Value" /></div>
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-primary/10 p-3 text-center"><p className="text-xs text-muted-foreground">asin({iv})</p><p className="text-lg font-bold text-primary">{fmt(toDeg(asin))}°</p></div>
          <div className="rounded-xl bg-primary/10 p-3 text-center"><p className="text-xs text-muted-foreground">acos({iv})</p><p className="text-lg font-bold text-primary">{fmt(toDeg(acos))}°</p></div>
          <div className="rounded-xl bg-primary/10 p-3 text-center"><p className="text-xs text-muted-foreground">atan({iv})</p><p className="text-lg font-bold text-primary">{fmt(toDeg(atan))}°</p></div>
        </div>
      </div>
    </div>
  )
}
