import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

type BillingType = 'metered' | 'unmetered'

// Average UK water rates 2025/26 (Ofwat PR24, ~26% increase from April 2025)
const AVG_METERED_WATER = 2.15 // £/m³ (up from ~1.74 in 2024/25)
const AVG_METERED_SEWERAGE = 2.42 // £/m³ (up from ~1.96 in 2024/25)
const AVG_STANDING_WATER = 55 // £/year
const AVG_STANDING_SEWERAGE = 68 // £/year
const AVG_UNMETERED = 583 // £/year combined (up from ~472 in 2024/25, Ofwat avg)
const LITRES_PER_PERSON_DAY = 145

function calculate(billingType: BillingType, people: number, rateableValue: number) {
  if (billingType === 'metered') {
    const dailyLitres = people * LITRES_PER_PERSON_DAY
    const annualM3 = (dailyLitres * 365) / 1000
    const waterCharge = annualM3 * AVG_METERED_WATER + AVG_STANDING_WATER
    const sewerageCharge = annualM3 * AVG_METERED_SEWERAGE + AVG_STANDING_SEWERAGE
    const total = waterCharge + sewerageCharge

    return { total, waterCharge, sewerageCharge, monthly: total / 12, dailyLitres, annualM3, type: 'metered' as const }
  }

  // Unmetered: based on rateable value
  const total = AVG_UNMETERED * (rateableValue / 200) // rough scaling
  return { total, waterCharge: total * 0.45, sewerageCharge: total * 0.55, monthly: total / 12, dailyLitres: 0, annualM3: 0, type: 'unmetered' as const }
}

export default function WaterBillCalculator() {
  const [type, setType] = useState<BillingType>('metered')
  const [people, setPeople] = useState('3')
  const [rv, setRv] = useState('200')

  const p = parseInt(people) || 0
  const r = parseInt(rv) || 200
  const result = useMemo(() => calculate(type, p, r), [type, p, r])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => setType('metered')} className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${type === 'metered' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>Metered</button>
        <button onClick={() => setType('unmetered')} className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${type === 'unmetered' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>Unmetered</button>
      </div>

      {type === 'metered' ? (
        <div><label className="block text-sm font-medium mb-2">People in Household</label><input type="number" min="1" max="10" value={people} onChange={(e) => setPeople(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /><p className="text-xs text-muted-foreground mt-1">Average usage: {LITRES_PER_PERSON_DAY} litres/person/day</p></div>
      ) : (
        <div><label className="block text-sm font-medium mb-2">Rateable Value (£)</label><input type="number" min="50" max="1000" value={rv} onChange={(e) => setRv(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /><p className="text-xs text-muted-foreground mt-1">Find on your water bill</p></div>
      )}

      <div className="space-y-4 animate-fade-in-up">
        <div className="rounded-2xl bg-blue-100 dark:bg-blue-950 p-6 text-center">
          <p className="text-sm text-muted-foreground">Estimated Annual Water Bill</p>
          <p className="text-3xl font-bold text-blue-700 dark:text-blue-400 mt-1">{formatCurrency(result.total)}</p>
          <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.monthly)}/month</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Water Supply</p><p className="text-lg font-bold">{formatCurrency(result.waterCharge)}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Sewerage</p><p className="text-lg font-bold">{formatCurrency(result.sewerageCharge)}</p></div>
        </div>
        {result.type === 'metered' && result.annualM3 > 0 && (
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>Estimated usage: {result.dailyLitres} litres/day ({result.annualM3.toFixed(0)} m³/year)</p>
            <p className="mt-1">Rates are UK averages — your water company may charge differently.</p>
          </div>
        )}
      </div>
    </div>
  )
}
