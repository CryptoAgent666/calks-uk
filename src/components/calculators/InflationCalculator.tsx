import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'
import { LATEST_INDEX_MONTH, firstIndexYear, indexForYear, type InflationSeries } from '@/data/uk-inflation-index'

type Mode = 'history' | 'projection'

const SERIES_LABEL: Record<InflationSeries, string> = { cpi: 'CPI', rpi: 'RPI' }
const LAST_DATA_YEAR = LATEST_INDEX_MONTH.year
const LAST_PROJECTION_YEAR = 2100
const MAX_ASSUMED_RATE = 20

// Past amounts: the ONS index in the later year over the index in the earlier one, in either direction
function calculateHistorical(amount: number, series: InflationSeries, yearFrom: number, yearTo: number) {
  const indexFrom = indexForYear(series, yearFrom)
  const indexTo = indexForYear(series, yearTo)
  if (indexFrom === null || indexTo === null) return null
  const factor = indexTo / indexFrom
  return {
    adjusted: amount * factor,
    factor,
    buyingPowerChange: (1 / factor - 1) * 100,
    priceChange: (factor - 1) * 100,
  }
}

// Future amounts: compounding at a rate the reader assumes, which may be 0
function calculateProjection(amount: number, years: number, ratePct: number) {
  const factor = Math.pow(1 + ratePct / 100, years)
  return {
    needed: amount * factor,
    worthToday: amount / factor,
    factor,
    buyingPowerChange: (1 / factor - 1) * 100,
  }
}

function buyingPowerWording(changePct: number) {
  const size = Math.abs(changePct).toFixed(1)
  if (size === '0.0') return 'No change'
  return changePct < 0 ? `${size}% lost` : `${size}% gained`
}

function parseYear(value: string) {
  return /^\d{4}$/.test(value.trim()) ? Number(value) : NaN
}

function isCoveredYear(series: InflationSeries, year: number) {
  return Number.isInteger(year) && indexForYear(series, year) !== null
}

export default function InflationCalculator() {
  const [mode, setMode] = useState<Mode>('history')
  const [amount, setAmount] = useState('100')
  const [series, setSeries] = useState<InflationSeries>('cpi')
  const [yearFrom, setYearFrom] = useState('2000')
  const [yearTo, setYearTo] = useState('2025')
  const [targetYear, setTargetYear] = useState('2036')
  const [rate, setRate] = useState('2') // the Bank of England's CPI target, as a neutral starting assumption

  const a = parseFloat(amount.replace(/[,£\s]/g, '')) || 0
  const yf = parseYear(yearFrom)
  const yt = parseYear(yearTo)
  const target = parseYear(targetYear)
  const r = rate.trim() === '' ? NaN : Number(rate)

  const yearsCovered = isCoveredYear(series, yf) && isCoveredYear(series, yt)
  const history = useMemo(() => (yearsCovered ? calculateHistorical(a, series, yf, yt) : null), [a, series, yf, yt, yearsCovered])

  const targetValid = Number.isInteger(target) && target > LAST_DATA_YEAR && target <= LAST_PROJECTION_YEAR
  const rateValid = Number.isFinite(r) && r >= 0 && r <= MAX_ASSUMED_RATE
  const projection = useMemo(
    () => (targetValid && rateValid ? calculateProjection(a, target - LAST_DATA_YEAR, r) : null),
    [a, target, r, targetValid, rateValid],
  )

  const usesLatestMonth = yf === LAST_DATA_YEAR || yt === LAST_DATA_YEAR
  const inputClass = 'w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring'

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-2" role="group" aria-label="Calculation type">
        {([['history', 'Past prices (ONS index)'], ['projection', 'Future projection']] as [Mode, string][]).map(([value, label]) => (
          <button key={value} type="button" aria-pressed={mode === value} onClick={() => setMode(value)} className={`rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${mode === value ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-foreground'}`}>{label}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Amount</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Amount" /></div>
        </div>
        {mode === 'history' ? (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">Price Index</label>
              <select value={series} onChange={(e) => setSeries(e.target.value as InflationSeries)} className={inputClass} aria-label="Price Index">
                <option value="cpi">CPI</option>
                <option value="rpi">RPI</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">From Year</label>
              <input type="number" min={firstIndexYear(series)} max={LAST_DATA_YEAR} value={yearFrom} onChange={(e) => setYearFrom(e.target.value)} className={inputClass} aria-label="From Year" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">To Year</label>
              <input type="number" min={firstIndexYear(series)} max={LAST_DATA_YEAR} value={yearTo} onChange={(e) => setYearTo(e.target.value)} className={inputClass} aria-label="To Year" />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">Future Year</label>
              <input type="number" min={LAST_DATA_YEAR + 1} max={LAST_PROJECTION_YEAR} value={targetYear} onChange={(e) => setTargetYear(e.target.value)} className={inputClass} aria-label="Future Year" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Assumed Inflation (% a year)</label>
              <input type="number" min="0" max={MAX_ASSUMED_RATE} step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} className={inputClass} aria-label="Assumed Inflation (% a year)" />
            </div>
          </>
        )}
      </div>

      {a <= 0 && <div className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive">Enter an amount above zero.</div>}

      {mode === 'history' && a > 0 && !yearsCovered && (
        <div className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive">ONS {SERIES_LABEL[series]} data here runs from {firstIndexYear(series)} to {LAST_DATA_YEAR}. Enter both years in that range, or use Future projection for later years.</div>
      )}
      {mode === 'history' && a > 0 && yearsCovered && yf === yt && (
        <div className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive">Choose two different years to compare.</div>
      )}

      {mode === 'history' && a > 0 && history && yf !== yt && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">{formatCurrency(a)} in {yf} is equivalent to</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(history.adjusted)}</p>
            <p className="text-sm text-muted-foreground mt-1">in {yt} ({SERIES_LABEL[series]}, ONS annual average index)</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Buying Power of £1 from {yf}</p><p className={`text-lg font-bold ${history.buyingPowerChange < 0 ? 'text-destructive' : ''}`}>{buyingPowerWording(history.buyingPowerChange)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Price Change, {yf} to {yt}</p><p className="text-lg font-bold">{history.priceChange > 0 ? '+' : ''}{history.priceChange.toFixed(1)}%</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Price Multiplier</p><p className="text-lg font-bold">{history.factor.toFixed(2)}x</p></div>
          </div>
          {usesLatestMonth && <p className="text-xs text-muted-foreground">{LAST_DATA_YEAR} has no annual average yet, so it uses {LATEST_INDEX_MONTH.label}, the latest month published.</p>}
        </div>
      )}

      {mode === 'projection' && a > 0 && !targetValid && (
        <div className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive">Enter a future year from {LAST_DATA_YEAR + 1} to {LAST_PROJECTION_YEAR}. For past years, use Past prices.</div>
      )}
      {mode === 'projection' && a > 0 && !rateValid && (
        <div className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive">Enter an assumed rate from 0% to {MAX_ASSUMED_RATE}%.</div>
      )}

      {mode === 'projection' && a > 0 && projection && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">To buy what {formatCurrency(a)} buys today you would need</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(projection.needed)}</p>
            <p className="text-sm text-muted-foreground mt-1">in {target} ({target - LAST_DATA_YEAR} years at an assumed {r}% a year)</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">{formatCurrency(a)} in {target}, in Today's Money</p><p className="text-lg font-bold">{formatCurrency(projection.worthToday)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Buying Power</p><p className={`text-lg font-bold ${projection.buyingPowerChange < 0 ? 'text-destructive' : ''}`}>{buyingPowerWording(projection.buyingPowerChange)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Price Multiplier</p><p className="text-lg font-bold">{projection.factor.toFixed(2)}x</p></div>
          </div>
          <p className="text-xs text-muted-foreground">The rate is your own assumption, not a forecast. It starts at the Bank of England's 2% target.</p>
        </div>
      )}
    </div>
  )
}
