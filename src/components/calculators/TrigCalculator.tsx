import { useState } from 'react'

type AngleUnit = 'degrees' | 'radians'

function toRad(deg: number) { return deg * Math.PI / 180 }
function toDeg(rad: number) { return rad * 180 / Math.PI }

// sin at the first-quadrant special angles. Other multiples of 30° and 45° reduce to these,
// so sin(180°) is exactly 0 and not the 1.2e-16 that floating point gives.
const SPECIAL_SIN: Record<number, number> = { 0: 0, 30: 0.5, 45: Math.SQRT1_2, 60: Math.sqrt(3) / 2, 90: 1 }

function specialSin(deg: number): number | null {
  const r = ((deg % 360) + 360) % 360
  const reduced = r <= 90 ? r : r <= 180 ? 180 - r : r <= 270 ? r - 180 : 360 - r
  const value = SPECIAL_SIN[reduced]
  if (value === undefined) return null
  return r > 180 ? -value : value
}

function trigValues(angle: number, unit: AngleUnit) {
  const rawDeg = unit === 'radians' ? toDeg(angle) : angle
  // A radian entry of pi to full precision lands within rounding error of a whole degree
  const nearest = Math.round(rawDeg)
  const deg = Math.abs(rawDeg - nearest) < 1e-9 ? nearest : rawDeg
  const exactSin = specialSin(deg)
  const exactCos = specialSin(deg + 90)
  if (exactSin !== null && exactCos !== null) {
    return { sin: exactSin, cos: exactCos, tan: exactSin / exactCos, sec: 1 / exactCos, csc: 1 / exactSin, cot: exactCos / exactSin }
  }
  const rad = toRad(rawDeg)
  const tan = Math.tan(rad)
  return { sin: Math.sin(rad), cos: Math.cos(rad), tan, sec: 1 / Math.cos(rad), csc: 1 / Math.sin(rad), cot: 1 / tan }
}

// Inverse sine and cosine only exist from -1 to 1, so NaN (shown as undefined) outside that
function inverseValues(value: number, unit: AngleUnit) {
  const convert = (rad: number) => unit === 'degrees' ? toDeg(rad) : rad
  return { asin: convert(Math.asin(value)), acos: convert(Math.acos(value)), atan: convert(Math.atan(value)) }
}

// Eight significant figures with trailing zeros dropped from the decimals only,
// leaving the zeros of 10000000 and the exponent of 1e+10 alone
function fmt(n: number) {
  if (!Number.isFinite(n)) return 'undefined'
  const s = n.toPrecision(8)
  if (s.includes('e')) return s.replace(/\.?0+e/, 'e')
  return s.includes('.') ? s.replace(/\.?0+$/, '') : s
}

export default function TrigCalculator() {
  const [angle, setAngle] = useState('45')
  const [unit, setUnit] = useState<AngleUnit>('degrees')
  const [invValue, setInvValue] = useState('0.5')

  const a = parseFloat(angle) || 0
  const label = unit === 'degrees' ? `${a}°` : `${a} rad`
  const { sin, cos, tan, sec, csc, cot } = trigValues(a, unit)

  const iv = parseFloat(invValue) || 0
  const { asin, acos, atan } = inverseValues(iv, unit)
  const inverseUnit = unit === 'degrees' ? '°' : ' rad'
  const fmtAngle = (n: number) => Number.isFinite(n) ? `${fmt(n)}${inverseUnit}` : fmt(n)

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
          <div className="rounded-xl bg-primary/10 p-3 text-center"><p className="text-xs text-muted-foreground">sin({label})</p><p className="text-lg font-bold text-primary">{fmt(sin)}</p></div>
          <div className="rounded-xl bg-primary/10 p-3 text-center"><p className="text-xs text-muted-foreground">cos({label})</p><p className="text-lg font-bold text-primary">{fmt(cos)}</p></div>
          <div className="rounded-xl bg-primary/10 p-3 text-center"><p className="text-xs text-muted-foreground">tan({label})</p><p className="text-lg font-bold text-primary">{fmt(tan)}</p></div>
          <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">sec</p><p className="text-lg font-bold">{fmt(sec)}</p></div>
          <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">csc</p><p className="text-lg font-bold">{fmt(csc)}</p></div>
          <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">cot</p><p className="text-lg font-bold">{fmt(cot)}</p></div>
        </div>
        <p className="text-xs text-muted-foreground text-center">{unit === 'degrees' ? `${a}° = ${toRad(a).toFixed(4)} radians` : `${a} rad = ${fmt(toDeg(a))}°`}</p>
      </div>

      <div className="rounded-xl border border-border p-5 space-y-4">
        <h3 className="font-semibold">Inverse Functions</h3>
        <div><label className="block text-sm font-medium mb-2">Value</label><input type="number" step="any" value={invValue} onChange={(e) => setInvValue(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Value" /></div>
        {Math.abs(iv) > 1 && (
          <div role="alert" className="rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 p-4 text-sm">
            Inverse sine and cosine only accept values from −1 to 1, because no angle has a sine or cosine outside that range. Inverse tangent accepts any value.
          </div>
        )}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-primary/10 p-3 text-center"><p className="text-xs text-muted-foreground">asin({iv})</p><p className="text-lg font-bold text-primary">{fmtAngle(asin)}</p></div>
          <div className="rounded-xl bg-primary/10 p-3 text-center"><p className="text-xs text-muted-foreground">acos({iv})</p><p className="text-lg font-bold text-primary">{fmtAngle(acos)}</p></div>
          <div className="rounded-xl bg-primary/10 p-3 text-center"><p className="text-xs text-muted-foreground">atan({iv})</p><p className="text-lg font-bold text-primary">{fmtAngle(atan)}</p></div>
        </div>
      </div>
    </div>
  )
}
