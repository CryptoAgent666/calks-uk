import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

type Nation = 'England' | 'Wales' | 'Scotland'

// Average area Band D council tax 2026/27 (incl. adult social care and parish precepts).
// England and London are MHCLG's published figures. MHCLG publishes no other regional
// averages, so these are tax-base-weighted means of Table 10 (line 17) by region.
const REGIONS: Record<string, number> = {
  'England Average': 2_392,
  'London': 2_068,
  'South East': 2_472,
  'South West': 2_550,
  'East of England': 2_394,
  'East Midlands': 2_460,
  'West Midlands': 2_393,
  'North West': 2_479,
  'North East': 2_535,
  'Yorkshire & Humber': 2_390,
}

// Welsh Government Council Tax levels 2026-27 (£2,283); Scottish Government Council Tax by
// Band 2026-27 (£1,653, excluding water and sewerage).
const NATION_AVERAGE: Record<'Wales' | 'Scotland', number> = { Wales: 2_283, Scotland: 1_653 }

// Share of Band D, as a fraction. England and Wales use ninths; Wales adds Band I.
// Scotland uses 360ths and pays more from Band E up (Scottish Government, Council Tax by Band 2026-27).
const BAND_RATIOS: Record<Nation, Record<string, [number, number]>> = {
  England: { A: [6, 9], B: [7, 9], C: [8, 9], D: [9, 9], E: [11, 9], F: [13, 9], G: [15, 9], H: [18, 9] },
  Wales: { A: [6, 9], B: [7, 9], C: [8, 9], D: [9, 9], E: [11, 9], F: [13, 9], G: [15, 9], H: [18, 9], I: [21, 9] },
  Scotland: { A: [240, 360], B: [280, 360], C: [320, 360], D: [360, 360], E: [473, 360], F: [585, 360], G: [705, 360], H: [882, 360] },
}

const BAND_VALUES: Record<Nation, Record<string, string>> = {
  England: {
    A: 'Up to £40,000', B: '£40,001 – £52,000', C: '£52,001 – £68,000', D: '£68,001 – £88,000',
    E: '£88,001 – £120,000', F: '£120,001 – £160,000', G: '£160,001 – £320,000', H: 'Over £320,000',
  },
  Wales: {
    A: 'Up to £44,000', B: '£44,001 – £65,000', C: '£65,001 – £91,000', D: '£91,001 – £123,000',
    E: '£123,001 – £162,000', F: '£162,001 – £223,000', G: '£223,001 – £324,000', H: '£324,001 – £424,000', I: 'Over £424,000',
  },
  Scotland: {
    A: 'Up to £27,000', B: '£27,001 – £35,000', C: '£35,001 – £45,000', D: '£45,001 – £58,000',
    E: '£58,001 – £80,000', F: '£80,001 – £106,000', G: '£106,001 – £212,000', H: 'Over £212,000',
  },
}

const VALUATION_YEAR: Record<Nation, number> = { England: 1991, Wales: 2003, Scotland: 1991 }

// A blank box is fine (the average is used). Anything else must be a positive amount.
function parseBandD(text: string): { value: number; invalid: boolean } {
  const cleaned = text.replace(/[£,\s]/g, '')
  if (cleaned === '') return { value: 0, invalid: false }
  const value = Number(cleaned)
  return Number.isFinite(value) && value > 0 ? { value, invalid: false } : { value: 0, invalid: true }
}

function calculate(nation: Nation, region: string, band: string, singlePerson: boolean, councilBandD: number) {
  const averageBandD = nation === 'England' ? REGIONS[region] || 2_392 : NATION_AVERAGE[nation]
  const bandD = councilBandD > 0 ? councilBandD : averageBandD
  const [top, bottom] = BAND_RATIOS[nation][band] || BAND_RATIOS[nation].D
  const annual = bandD * top / bottom
  const discount = singlePerson ? annual * 0.25 : 0
  const finalBill = annual - discount

  return {
    bandD, annual, discount, finalBill, fraction: `${top}/${bottom}`, percent: top / bottom * 100,
    // Bills are usually split over 10 monthly payments; councils can spread them over 12
    monthly10: finalBill / 10, monthly12: finalBill / 12, weekly: finalBill / 52,
  }
}

export default function CouncilTaxCalculator() {
  const [nation, setNation] = useState<Nation>('England')
  const [region, setRegion] = useState('England Average')
  const [band, setBand] = useState('D')
  const [single, setSingle] = useState(false)
  const [councilBandD, setCouncilBandD] = useState('')

  const parsedBandD = parseBandD(councilBandD)
  const result = useMemo(() => calculate(nation, region, band, single, parsedBandD.value), [nation, region, band, single, parsedBandD.value])
  const usingOwnFigure = parsedBandD.value > 0
  const averageLabel = nation === 'England' ? region : `${nation} average`

  const changeNation = (next: Nation) => {
    setNation(next)
    // Band I exists only in Wales
    if (!BAND_RATIOS[next][band]) setBand('H')
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Nation</label>
          <select value={nation} onChange={(e) => changeNation(e.target.value as Nation)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Nation">
            {Object.keys(BAND_RATIOS).map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        {nation === 'England' && (
          <div>
            <label className="block text-sm font-medium mb-2">Region</label>
            <select value={region} onChange={(e) => setRegion(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Region">
              {Object.keys(REGIONS).map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium mb-2">Council Tax Band</label>
          <select value={band} onChange={(e) => setBand(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Council Tax Band">
            {Object.entries(BAND_VALUES[nation]).map(([b, v]) => <option key={b} value={b}>Band {b} — {v}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Your council's Band D (£/yr, optional)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="decimal" value={councilBandD} onChange={(e) => setCouncilBandD(e.target.value)} placeholder="Uses the average if blank" className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Your council's Band D charge" />
          </div>
          {parsedBandD.invalid && <p className="text-xs text-destructive mt-1">Enter a positive amount, such as 1028.21. Using the average until then.</p>}
        </div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" checked={single} onChange={(e) => setSingle(e.target.checked)} className="h-5 w-5 rounded border-border" />
        <span className="text-sm">Single person discount (25% off)</span>
      </label>

      <div className="space-y-4 animate-fade-in-up">
        <div className="rounded-2xl bg-primary/10 p-6 text-center">
          <p className="text-sm text-muted-foreground">Estimated Annual Council Tax</p>
          <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.finalBill)}</p>
          <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.monthly10)}/month over 10 instalments &middot; {formatCurrency(result.monthly12)} over 12 &middot; {formatCurrency(result.weekly)}/week</p>
        </div>

        {single && result.discount > 0 && (
          <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center">
            <p className="text-xs text-muted-foreground">Single Person Discount</p>
            <p className="text-lg font-bold text-green-700 dark:text-green-400">-{formatCurrency(result.discount)}</p>
          </div>
        )}

        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-1">
          <p>{usingOwnFigure ? 'Band D you entered' : `Band D average for ${averageLabel}`}: <span className="font-medium text-foreground">{formatCurrency(result.bandD)}</span></p>
          <p>Band {band} ratio: <span className="font-medium text-foreground">{result.fraction} ({result.percent.toFixed(1)}%)</span> of Band D</p>
          <p>Property value ({VALUATION_YEAR[nation]}): <span className="font-medium text-foreground">{BAND_VALUES[nation][band]}</span></p>
          {!usingOwnFigure && <p className="text-xs">An average, not your bill: Band D varies widely by council. Enter the figure from your bill or your council's website for your own estimate.</p>}
          {nation === 'Scotland' && <p className="text-xs">Excludes water and sewerage charges, which are billed with Council Tax in Scotland.</p>}
          {nation === 'England' && ['A', 'B', 'C', 'D'].includes(band) && <p className="text-xs">Not deducted here: the £100 Household Energy Payment for households in Bands A to D in England from January 2027 (Budget 2026).</p>}
        </div>
      </div>
    </div>
  )
}
