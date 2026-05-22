import { useState, useMemo } from 'react'

const SIZES = [
  { uk: 3, eu: 36, us_m: 4, us_w: 5.5, cm: 22 },
  { uk: 3.5, eu: 36.5, us_m: 4.5, us_w: 6, cm: 22.5 },
  { uk: 4, eu: 37, us_m: 5, us_w: 6.5, cm: 23 },
  { uk: 4.5, eu: 37.5, us_m: 5.5, us_w: 7, cm: 23.5 },
  { uk: 5, eu: 38, us_m: 6, us_w: 7.5, cm: 24 },
  { uk: 5.5, eu: 38.5, us_m: 6.5, us_w: 8, cm: 24.5 },
  { uk: 6, eu: 39, us_m: 7, us_w: 8.5, cm: 25 },
  { uk: 6.5, eu: 40, us_m: 7.5, us_w: 9, cm: 25.5 },
  { uk: 7, eu: 40.5, us_m: 8, us_w: 9.5, cm: 26 },
  { uk: 7.5, eu: 41, us_m: 8.5, us_w: 10, cm: 26.5 },
  { uk: 8, eu: 42, us_m: 9, us_w: 10.5, cm: 27 },
  { uk: 8.5, eu: 42.5, us_m: 9.5, us_w: 11, cm: 27.5 },
  { uk: 9, eu: 43, us_m: 10, us_w: 11.5, cm: 28 },
  { uk: 9.5, eu: 43.5, us_m: 10.5, us_w: 12, cm: 28.5 },
  { uk: 10, eu: 44, us_m: 11, us_w: 12.5, cm: 29 },
  { uk: 10.5, eu: 44.5, us_m: 11.5, us_w: 13, cm: 29.5 },
  { uk: 11, eu: 45, us_m: 12, us_w: 13.5, cm: 30 },
  { uk: 12, eu: 46, us_m: 13, us_w: 14.5, cm: 31 },
  { uk: 13, eu: 47, us_m: 14, us_w: 15.5, cm: 32 },
]

type System = 'uk' | 'eu' | 'us_m' | 'us_w' | 'cm'

function findSize(system: System, value: number) {
  let closest = SIZES[0]
  let minDiff = Infinity
  for (const s of SIZES) {
    const diff = Math.abs(s[system] - value)
    if (diff < minDiff) { minDiff = diff; closest = s }
  }
  return closest
}

export default function ShoeSizeConverter() {
  const [system, setSystem] = useState<System>('uk')
  const [value, setValue] = useState('8')

  const v = parseFloat(value) || 0
  const result = useMemo(() => findSize(system, v), [system, v])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Size System</label>
          <select value={system} onChange={(e) => setSystem(e.target.value as System)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Size System">
            <option value="uk">UK</option>
            <option value="eu">EU</option>
            <option value="us_m">US (Men's)</option>
            <option value="us_w">US (Women's)</option>
            <option value="cm">cm (Foot Length)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Size</label>
          <input type="number" min="0" max="50" step="0.5" value={value} onChange={(e) => setValue(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Size" />
        </div>
      </div>

      {v > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 animate-fade-in-up">
          <div className={`rounded-xl p-4 text-center ${system === 'uk' ? 'bg-primary/10 border-2 border-primary' : 'border border-border'}`}><p className="text-xs text-muted-foreground">UK</p><p className="text-xl font-bold">{result.uk}</p></div>
          <div className={`rounded-xl p-4 text-center ${system === 'eu' ? 'bg-primary/10 border-2 border-primary' : 'border border-border'}`}><p className="text-xs text-muted-foreground">EU</p><p className="text-xl font-bold">{result.eu}</p></div>
          <div className={`rounded-xl p-4 text-center ${system === 'us_m' ? 'bg-primary/10 border-2 border-primary' : 'border border-border'}`}><p className="text-xs text-muted-foreground">US Men's</p><p className="text-xl font-bold">{result.us_m}</p></div>
          <div className={`rounded-xl p-4 text-center ${system === 'us_w' ? 'bg-primary/10 border-2 border-primary' : 'border border-border'}`}><p className="text-xs text-muted-foreground">US Women's</p><p className="text-xl font-bold">{result.us_w}</p></div>
          <div className={`rounded-xl p-4 text-center ${system === 'cm' ? 'bg-primary/10 border-2 border-primary' : 'border border-border'}`}><p className="text-xs text-muted-foreground">cm</p><p className="text-xl font-bold">{result.cm}</p></div>
        </div>
      )}
    </div>
  )
}
