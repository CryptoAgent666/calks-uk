import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// VED rates 2026/27 (from 1 April 2026), per gov.uk/vehicle-tax-rate-tables.
// The rules depend on when the car was first registered.
const STANDARD_RATE = 200 // year 2+ for cars registered from 1 April 2017 (petrol/diesel/hybrid/EV — AFV £10 discount removed April 2025)
const EXPENSIVE_CAR_SUPPLEMENT = 440 // a year for 5 years, from the second time the car is taxed
const ECS_THRESHOLD = 40_000
const ECS_THRESHOLD_ELECTRIC = 50_000 // zero-emission cars registered from 1 April 2025
const DIRECT_DEBIT_SURCHARGE = 0.05 // monthly or six-monthly Direct Debit; a single 6-month payment adds 10%

// First-year ("showroom") rates for cars registered from 1 April 2017. Diesel
// cars that do not meet RDE2 pay the rate for the next band up.
const FIRST_YEAR_BANDS = [
  { upTo: 0, rate: 10 },
  { upTo: 50, rate: 115 },
  { upTo: 75, rate: 135 },
  { upTo: 90, rate: 280 },
  { upTo: 100, rate: 365 },
  { upTo: 110, rate: 405 },
  { upTo: 130, rate: 455 },
  { upTo: 150, rate: 560 },
  { upTo: 170, rate: 1_410 },
  { upTo: 190, rate: 2_270 },
  { upTo: 225, rate: 3_420 },
  { upTo: 255, rate: 4_850 },
  { upTo: Infinity, rate: 5_690 },
]

// Cars registered 1 March 2001 to 31 March 2017: annual rate by CO2 band, the
// same for petrol, diesel, alternative fuel and zero-emission cars.
const BANDS_2001_2017 = [
  { band: 'A', from: 0, upTo: 100, rate: 20 },
  { band: 'B', from: 101, upTo: 110, rate: 20 },
  { band: 'C', from: 111, upTo: 120, rate: 35 },
  { band: 'D', from: 121, upTo: 130, rate: 170 },
  { band: 'E', from: 131, upTo: 140, rate: 200 },
  { band: 'F', from: 141, upTo: 150, rate: 225 },
  { band: 'G', from: 151, upTo: 165, rate: 275 },
  { band: 'H', from: 166, upTo: 175, rate: 325 },
  { band: 'I', from: 176, upTo: 185, rate: 360 },
  { band: 'J', from: 186, upTo: 200, rate: 410 },
  { band: 'K', from: 201, upTo: 225, rate: 445 },
  { band: 'L', from: 226, upTo: 255, rate: 760 },
  { band: 'M', from: 256, upTo: Infinity, rate: 790 },
]

// Cars registered before 1 March 2001: annual rate by engine size
const PRE_2001_RATES = { small: 230, large: 375 } // up to 1,549cc / over 1,549cc

type Registered = 'from2025' | '2017to2025' | '2001to2017' | 'pre2001'
type Engine = keyof typeof PRE_2001_RATES

function getFirstYearRate(co2: number, fuelType: string): number {
  if (fuelType === 'electric') return 10 // 0g CO2
  const i = FIRST_YEAR_BANDS.findIndex((b) => co2 <= b.upTo)
  const j = fuelType === 'diesel_non_rde2' && co2 > 0 ? Math.min(i + 1, FIRST_YEAR_BANDS.length - 1) : i
  return FIRST_YEAR_BANDS[j].rate
}

function getBand2001(co2: number) {
  return BANDS_2001_2017.find((b) => co2 <= b.upTo)!
}

function calculate(co2: number, fuelType: string, listPrice: number, registered: Registered = 'from2025', engine: Engine = 'small') {
  const electric = fuelType === 'electric'
  const emissions = electric ? 0 : co2
  let firstYear: number | null = null
  let band: { band: string; from: number; upTo: number; rate: number } | null = null
  let standard: number
  let expensiveSupplement = 0

  if (registered === 'pre2001') {
    standard = PRE_2001_RATES[engine]
  } else if (registered === '2001to2017') {
    band = getBand2001(emissions)
    standard = band.rate
  } else {
    standard = STANDARD_RATE
    // Zero-emission cars registered before 1 April 2025 never pay the supplement
    const ecsApplies = !(electric && registered === '2017to2025')
    const threshold = electric ? ECS_THRESHOLD_ELECTRIC : ECS_THRESHOLD
    expensiveSupplement = ecsApplies && listPrice > threshold ? EXPENSIVE_CAR_SUPPLEMENT : 0
    // Only a car being registered now pays the current first-year rate
    if (registered === 'from2025') firstYear = getFirstYearRate(emissions, fuelType)
  }

  const annual = standard + expensiveSupplement
  const monthlyDirectDebit = (annual * (1 + DIRECT_DEBIT_SURCHARGE)) / 12

  return { firstYear, band, standard, expensiveSupplement, annual, monthlyDirectDebit }
}

export default function CarTaxCalculator() {
  const [registered, setRegistered] = useState<Registered>('from2025')
  const [co2, setCo2] = useState('120')
  const [fuelType, setFuelType] = useState('petrol')
  const [listPrice, setListPrice] = useState('28000')
  const [engine, setEngine] = useState<Engine>('small')

  const c = parseInt(co2) || 0
  const lp = parseFloat(listPrice.replace(/,/g, '')) || 0
  const result = useMemo(() => calculate(c, fuelType, lp, registered, engine), [c, fuelType, lp, registered, engine])
  const postApril2017 = registered === 'from2025' || registered === '2017to2025'

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">First Registered</label>
          <select value={registered} onChange={(e) => setRegistered(e.target.value as Registered)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="First Registered">
            <option value="from2025">From 1 April 2025 (or buying new)</option>
            <option value="2017to2025">1 April 2017 to 31 March 2025</option>
            <option value="2001to2017">1 March 2001 to 31 March 2017</option>
            <option value="pre2001">Before 1 March 2001</option>
          </select>
        </div>
        {registered === 'pre2001' ? (
          <div>
            <label className="block text-sm font-medium mb-2">Engine Size</label>
            <select value={engine} onChange={(e) => setEngine(e.target.value as Engine)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Engine Size">
              <option value="small">1,549cc or less</option>
              <option value="large">Over 1,549cc</option>
            </select>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium mb-2">Fuel Type</label>
            <select value={fuelType} onChange={(e) => setFuelType(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Fuel Type">
              <option value="petrol">Petrol</option>
              <option value="diesel">Diesel (meets RDE2)</option>
              <option value="diesel_non_rde2">Diesel (not RDE2)</option>
              <option value="hybrid">Hybrid / alternative fuel</option>
              <option value="electric">Electric</option>
            </select>
          </div>
        )}
        {registered !== 'pre2001' && fuelType !== 'electric' && (
          <div>
            <label className="block text-sm font-medium mb-2">CO2 Emissions (g/km)</label>
            <input type="number" min="0" max="400" value={co2} onChange={(e) => setCo2(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="CO2 Emissions (g/km)" />
          </div>
        )}
        {postApril2017 && (
          <div>
            <label className="block text-sm font-medium mb-2">List Price (new)</label>
            <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
              <input type="text" inputMode="numeric" value={listPrice} onChange={(e) => setListPrice(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="List Price (new)" /></div>
          </div>
        )}
      </div>

      <div className="space-y-4 animate-fade-in-up">
        <div className="grid grid-cols-2 gap-3">
          {result.firstYear !== null ? (
            <div className="rounded-xl bg-primary/10 p-4 text-center">
              <p className="text-xs text-muted-foreground">First Year Rate</p>
              <p className="text-xl font-bold text-primary">{formatCurrency(result.firstYear)}</p>
            </div>
          ) : (
            <div className="rounded-xl bg-primary/10 p-4 text-center">
              <p className="text-xs text-muted-foreground">{result.band ? `Band ${result.band.band} (${result.band.from === 0 ? `up to ${result.band.upTo}` : result.band.upTo === Infinity ? `over ${result.band.from - 1}` : `${result.band.from}-${result.band.upTo}`}g/km)` : 'Annual Rate'}</p>
              <p className="text-xl font-bold text-primary">{formatCurrency(result.annual)}</p>
            </div>
          )}
          <div className="rounded-xl bg-muted/50 p-4 text-center">
            <p className="text-xs text-muted-foreground">{result.firstYear !== null ? 'Standard Rate (year 2+)' : 'By Monthly Direct Debit'}</p>
            <p className="text-xl font-bold">{formatCurrency(result.firstYear !== null ? result.annual : result.monthlyDirectDebit)}{result.firstYear !== null ? '' : '/month'}</p>
          </div>
        </div>

        {result.firstYear !== null && (
          <p className="text-sm text-muted-foreground">From year 2 by monthly Direct Debit: <span className="font-medium text-foreground">{formatCurrency(result.monthlyDirectDebit)}/month</span> ({formatCurrency(result.monthlyDirectDebit * 12)} a year, 5% more than paying in one go)</p>
        )}

        {result.expensiveSupplement > 0 && (
          <div className="rounded-xl bg-orange-100 dark:bg-orange-950 p-4 text-sm">
            <p className="font-medium text-orange-800 dark:text-orange-300">Expensive car supplement applies</p>
            <p className="text-orange-700 dark:text-orange-400 mt-1">
              A list price over {formatCurrency(fuelType === 'electric' ? ECS_THRESHOLD_ELECTRIC : ECS_THRESHOLD)} adds £{result.expensiveSupplement}/year for 5 years from the second time the car is taxed (years 2-6), so the annual rate is {formatCurrency(result.annual)}.
              {registered === '2017to2025' ? ' Once the car is more than 6 years old the supplement has ended and it pays the standard £200.' : ''}
            </p>
          </div>
        )}

        {result.band && result.band.upTo > 225 && (
          <p className="text-sm text-muted-foreground">Cars over 225g/km that were first registered before 23 March 2006 stay in Band K at £445.</p>
        )}

        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-1">
          <p>Registered from 1 April 2017: first-year rate by CO2 (£10 for EVs), then <span className="font-medium text-foreground">£{STANDARD_RATE}</span> a year</p>
          <p>List price over £40,000 (£50,000 for EVs registered from 1 April 2025): <span className="font-medium text-foreground">+£440/year</span> for years 2-6. EVs registered before 1 April 2025 do not pay it</p>
          <p>Registered 1 March 2001 to 31 March 2017: Bands A-M, <span className="font-medium text-foreground">£20 to £790</span> (EVs are Band A, £20)</p>
          <p>Registered before 1 March 2001: <span className="font-medium text-foreground">£230</span> up to 1,549cc, <span className="font-medium text-foreground">£375</span> above</p>
          <p className="text-xs">Monthly or six-monthly Direct Debit adds 5%; a single six-month payment adds 10%. Diesel cars that do not meet RDE2 pay the next first-year band up.</p>
        </div>
      </div>
    </div>
  )
}
