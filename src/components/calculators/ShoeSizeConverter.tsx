import { useState, useMemo } from 'react'

// UK to EU from the Clarks size guide (Clarks EU column). Clarks lists no UK 11.5 or
// 12.5, so those two EU sizes are the midpoints of the sizes either side.
const UK_TO_EU: [number, number][] = [
  [3, 35.5], [3.5, 36], [4, 37], [4.5, 37.5], [5, 38], [5.5, 39], [6, 39.5], [6.5, 40], [7, 41], [7.5, 41.5],
  [8, 42], [8.5, 42.5], [9, 43], [9.5, 44], [10, 44.5], [10.5, 45], [11, 46], [11.5, 46.5], [12, 47], [12.5, 47.5], [13, 48],
]

// UK = US men's − 1 = US women's − 2.5, and UK = 3 × foot length in inches − 23.5
// (J. S. Gilstrap, Paris Point / Barleycorn Sizing System)
const SIZES = UK_TO_EU.map(([uk, eu]) => ({
  uk,
  eu,
  us_m: uk + 1,
  us_w: uk + 2.5,
  cm: Math.round((((uk + 23.5) / 3) * 2.54) * 10) / 10,
}))

type System = 'uk' | 'eu' | 'us_m' | 'us_w' | 'cm'

const SYSTEM_LABEL: Record<System, string> = { uk: 'UK', eu: 'EU', us_m: "US men's", us_w: "US women's", cm: 'foot length (cm)' }

function findSize(system: System, value: number) {
  let closest = SIZES[0]
  let minDiff = Infinity
  for (const s of SIZES) {
    const diff = Math.abs(s[system] - value)
    if (diff < minDiff) { minDiff = diff; closest = s }
  }
  return closest
}

// Half a size of slack on foot length, which rarely lands exactly on a listed length
function rangeFor(system: System) {
  const slack = system === 'cm' ? 0.4 : 0
  return { min: SIZES[0][system], max: SIZES[SIZES.length - 1][system], slack }
}

function inRange(system: System, value: number) {
  const { min, max, slack } = rangeFor(system)
  return value >= min - slack && value <= max + slack
}

export default function ShoeSizeConverter() {
  const [system, setSystem] = useState<System>('uk')
  const [value, setValue] = useState('8')

  const v = parseFloat(value) || 0
  const result = useMemo(() => findSize(system, v), [system, v])
  const covered = inRange(system, v)
  const { min, max } = rangeFor(system)
  const exact = Math.abs(result[system] - v) < 0.001

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
            <option value="cm">Foot Length (cm, approx.)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Size</label>
          <input type="number" min="0" max="50" step={system === 'cm' ? '0.1' : '0.5'} value={value} onChange={(e) => setValue(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Size" />
        </div>
      </div>

      {v > 0 && !covered && (
        <p className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive" role="alert">That is outside the adult range this tool covers ({system === 'uk' ? 'UK 3 to 13' : `${SYSTEM_LABEL[system]} ${min} to ${max}, which is UK 3 to 13`}). Children's sizes run on their own scale and are not covered here, so use the shoe maker's own children's chart.</p>
      )}

      {v > 0 && covered && (
        <div className="space-y-3 animate-fade-in-up">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className={`rounded-xl p-4 text-center ${system === 'uk' ? 'bg-primary/10 border-2 border-primary' : 'border border-border'}`}><p className="text-xs text-muted-foreground">UK</p><p className="text-xl font-bold">{result.uk}</p></div>
            <div className={`rounded-xl p-4 text-center ${system === 'eu' ? 'bg-primary/10 border-2 border-primary' : 'border border-border'}`}><p className="text-xs text-muted-foreground">EU</p><p className="text-xl font-bold">{result.eu}</p></div>
            <div className={`rounded-xl p-4 text-center ${system === 'us_m' ? 'bg-primary/10 border-2 border-primary' : 'border border-border'}`}><p className="text-xs text-muted-foreground">US Men's</p><p className="text-xl font-bold">{result.us_m}</p></div>
            <div className={`rounded-xl p-4 text-center ${system === 'us_w' ? 'bg-primary/10 border-2 border-primary' : 'border border-border'}`}><p className="text-xs text-muted-foreground">US Women's</p><p className="text-xl font-bold">{result.us_w}</p></div>
            <div className={`rounded-xl p-4 text-center ${system === 'cm' ? 'bg-primary/10 border-2 border-primary' : 'border border-border'}`}><p className="text-xs text-muted-foreground">Foot (cm, approx.)</p><p className="text-xl font-bold">{result.cm}</p></div>
          </div>
          {!exact && <p className="text-sm text-muted-foreground">Nearest listed size to {SYSTEM_LABEL[system]} {v}.</p>}
          <p className="text-xs text-muted-foreground">An indicative guide based on the Clarks chart, and brands differ: Nike lists UK 8 as EU 42.5 and UK 9 as EU 44. Check the maker's own chart before buying.</p>
        </div>
      )}
    </div>
  )
}
