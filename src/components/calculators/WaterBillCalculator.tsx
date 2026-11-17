import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

type BillingType = 'metered' | 'unmetered'

// Typical metered rates 2026/27 (Ofwat PR24, ~26% increase from April 2025). Each company sets its own.
const AVG_METERED_WATER = 2.15 // £/m³ (up from ~1.74 in 2024/25)
const AVG_METERED_SEWERAGE = 2.42 // £/m³ (up from ~1.96 in 2024/25)
const AVG_STANDING_WATER = 55 // £/year
const AVG_STANDING_SEWERAGE = 68 // £/year
const LITRES_PER_PERSON_DAY = 145
// England & Wales average household bill 2026/27 (Water UK forecast via Discover Water):
// £639 combined, £309 water and £330 sewerage. Shown for reference only.
const EW_AVERAGE_BILL = 639
const EW_AVERAGE_WATER = 309
const EW_AVERAGE_SEWERAGE = 330

export interface UnmeteredRates {
  waterRatePerPound: number // £ per £1 of rateable value, from the company's charges scheme
  sewerageRatePerPound: number
  waterStanding: number // £/year
  sewerageStanding: number
}

export function calculateMetered(people: number) {
  const dailyLitres = people * LITRES_PER_PERSON_DAY
  const annualM3 = (dailyLitres * 365) / 1000
  const waterCharge = annualM3 * AVG_METERED_WATER + AVG_STANDING_WATER
  const sewerageCharge = annualM3 * AVG_METERED_SEWERAGE + AVG_STANDING_SEWERAGE
  const total = waterCharge + sewerageCharge
  return { total, waterCharge, sewerageCharge, monthly: total / 12, dailyLitres, annualM3 }
}

// Unmetered: rateable value x the company's rate per £ of RV, plus any standing charges.
// There is no national rate, so nothing is estimated until the company's rates are entered.
export function calculateUnmetered(rateableValue: number, rates: UnmeteredRates) {
  const hasRates = rates.waterRatePerPound > 0 || rates.sewerageRatePerPound > 0
  const waterCharge = rateableValue * rates.waterRatePerPound + rates.waterStanding
  const sewerageCharge = rateableValue * rates.sewerageRatePerPound + rates.sewerageStanding
  const total = waterCharge + sewerageCharge
  return { hasRates, total, waterCharge, sewerageCharge, monthly: total / 12 }
}

const inputClass = 'w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring'
const num = (s: string) => Math.max(0, parseFloat(s) || 0)

export default function WaterBillCalculator() {
  const [type, setType] = useState<BillingType>('metered')
  const [people, setPeople] = useState('3')
  const [rv, setRv] = useState('200')
  const [waterRate, setWaterRate] = useState('')
  const [sewerageRate, setSewerageRate] = useState('')
  const [waterStanding, setWaterStanding] = useState('')
  const [sewerageStanding, setSewerageStanding] = useState('')

  const p = parseInt(people) || 0
  const metered = useMemo(() => calculateMetered(p), [p])
  const unmetered = useMemo(() => calculateUnmetered(num(rv), {
    waterRatePerPound: num(waterRate), sewerageRatePerPound: num(sewerageRate),
    waterStanding: num(waterStanding), sewerageStanding: num(sewerageStanding),
  }), [rv, waterRate, sewerageRate, waterStanding, sewerageStanding])
  const result = type === 'metered' ? metered : unmetered
  const showResult = type === 'metered' || unmetered.hasRates

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => setType('metered')} className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${type === 'metered' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>Metered</button>
        <button onClick={() => setType('unmetered')} className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${type === 'unmetered' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>Unmetered</button>
      </div>

      {type === 'metered' ? (
        <div><label className="block text-sm font-medium mb-2">People in Household</label><input type="number" min="1" max="10" value={people} onChange={(e) => setPeople(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="People in Household" /><p className="text-xs text-muted-foreground mt-1">Average usage: {LITRES_PER_PERSON_DAY} litres/person/day</p></div>
      ) : (
        <div className="space-y-4">
          <div><label className="block text-sm font-medium mb-2">Rateable Value (£)</label><input type="number" min="0" max="2000" value={rv} onChange={(e) => setRv(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Rateable Value (£)" /><p className="text-xs text-muted-foreground mt-1">Find on your water bill</p></div>
          <p className="text-sm text-muted-foreground">Unmetered charges are your rateable value multiplied by your company's rate per £1 of rateable value, plus any standing charge. There is no national rate, so enter the figures from your company's charges scheme or bill.</p>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-2">Water rate (£ per £1 RV)</label><input type="number" min="0" step="0.0001" value={waterRate} onChange={(e) => setWaterRate(e.target.value)} className={inputClass} aria-label="Water rate in pounds per pound of rateable value" /></div>
            <div><label className="block text-sm font-medium mb-2">Sewerage rate (£ per £1 RV)</label><input type="number" min="0" step="0.0001" value={sewerageRate} onChange={(e) => setSewerageRate(e.target.value)} className={inputClass} aria-label="Sewerage rate in pounds per pound of rateable value" /></div>
            <div><label className="block text-sm font-medium mb-2">Water standing charge (£/year)</label><input type="number" min="0" value={waterStanding} onChange={(e) => setWaterStanding(e.target.value)} className={inputClass} aria-label="Water standing charge per year" /></div>
            <div><label className="block text-sm font-medium mb-2">Sewerage standing charge (£/year)</label><input type="number" min="0" value={sewerageStanding} onChange={(e) => setSewerageStanding(e.target.value)} className={inputClass} aria-label="Sewerage standing charge per year" /></div>
          </div>
        </div>
      )}

      <div className="space-y-4 animate-fade-in-up">
        {showResult ? (
          <>
            <div className="rounded-2xl bg-blue-100 dark:bg-blue-950 p-6 text-center">
              <p className="text-sm text-muted-foreground">Estimated Annual Water Bill</p>
              <p className="text-3xl font-bold text-blue-700 dark:text-blue-400 mt-1">{formatCurrency(result.total)}</p>
              <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.monthly)}/month</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Water Supply</p><p className="text-lg font-bold">{formatCurrency(result.waterCharge)}</p></div>
              <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Sewerage</p><p className="text-lg font-bold">{formatCurrency(result.sewerageCharge)}</p></div>
            </div>
          </>
        ) : (
          <div className="rounded-2xl bg-muted/50 p-6 text-center text-sm text-muted-foreground">Enter your company's rate per £1 of rateable value to see the unmetered bill.</div>
        )}
        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
          {type === 'metered' && <p>Estimated usage: {metered.dailyLitres} litres/day ({metered.annualM3.toFixed(0)} m³/year)</p>}
          {type === 'metered' && <p className="mt-1">Metered rates are typical England and Wales figures; your water company's charges will differ.</p>}
          <p className="mt-1">England and Wales average bill for 2026/27: {formatCurrency(EW_AVERAGE_BILL)} ({formatCurrency(EW_AVERAGE_WATER)} water, {formatCurrency(EW_AVERAGE_SEWERAGE)} sewerage), Water UK forecast.</p>
        </div>
      </div>
    </div>
  )
}
