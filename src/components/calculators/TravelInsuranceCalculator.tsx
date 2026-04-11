import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

type TripType = 'single' | 'annual'
type Destination = 'europe' | 'worldwide_exc_us' | 'worldwide_inc_us'
type CoverLevel = 'basic' | 'standard' | 'premium'

const BASE_COSTS: Record<TripType, Record<Destination, Record<CoverLevel, number>>> = {
  single: {
    europe: { basic: 12, standard: 25, premium: 45 },
    worldwide_exc_us: { basic: 25, standard: 45, premium: 75 },
    worldwide_inc_us: { basic: 35, standard: 65, premium: 110 },
  },
  annual: {
    europe: { basic: 30, standard: 55, premium: 95 },
    worldwide_exc_us: { basic: 55, standard: 95, premium: 160 },
    worldwide_inc_us: { basic: 75, standard: 130, premium: 220 },
  },
}

function calculate(tripType: TripType, dest: Destination, cover: CoverLevel, travellers: number, daysTrip: number, ageOver65: boolean) {
  const base = BASE_COSTS[tripType][dest][cover]
  const perPerson = base * (ageOver65 ? 2.5 : 1)
  const durationFactor = tripType === 'single' ? Math.max(1, daysTrip / 14) : 1
  const total = perPerson * travellers * durationFactor

  const coverAmounts: Record<CoverLevel, { medical: string; cancellation: string; baggage: string }> = {
    basic: { medical: '£2M', cancellation: '£1,000', baggage: '£500' },
    standard: { medical: '£10M', cancellation: '£3,000', baggage: '£1,500' },
    premium: { medical: '£15M', cancellation: '£5,000', baggage: '£2,500' },
  }

  return { total, perPerson: total / travellers, covers: coverAmounts[cover] }
}

export default function TravelInsuranceCalculator() {
  const [type, setType] = useState<TripType>('single')
  const [dest, setDest] = useState<Destination>('europe')
  const [cover, setCover] = useState<CoverLevel>('standard')
  const [travellers, setTravellers] = useState('2')
  const [days, setDays] = useState('7')
  const [over65, setOver65] = useState(false)

  const t = parseInt(travellers) || 1
  const d = parseInt(days) || 7
  const result = useMemo(() => calculate(type, dest, cover, t, d, over65), [type, dest, cover, t, d, over65])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Trip Type</label><select value={type} onChange={(e) => setType(e.target.value as TripType)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"><option value="single">Single Trip</option><option value="annual">Annual Multi-Trip</option></select></div>
        <div><label className="block text-sm font-medium mb-2">Destination</label><select value={dest} onChange={(e) => setDest(e.target.value as Destination)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"><option value="europe">Europe</option><option value="worldwide_exc_us">Worldwide (excl. US)</option><option value="worldwide_inc_us">Worldwide (incl. US)</option></select></div>
        <div><label className="block text-sm font-medium mb-2">Cover Level</label><select value={cover} onChange={(e) => setCover(e.target.value as CoverLevel)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"><option value="basic">Basic</option><option value="standard">Standard</option><option value="premium">Premium</option></select></div>
        <div><label className="block text-sm font-medium mb-2">Travellers</label><input type="number" min="1" max="10" value={travellers} onChange={(e) => setTravellers(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        {type === 'single' && <div><label className="block text-sm font-medium mb-2">Trip Length (days)</label><input type="number" min="1" max="365" value={days} onChange={(e) => setDays(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>}
      </div>
      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={over65} onChange={(e) => setOver65(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Any traveller over 65</span></label>

      <div className="space-y-4 animate-fade-in-up">
        <div className="rounded-2xl bg-primary/10 p-6 text-center">
          <p className="text-sm text-muted-foreground">Estimated Premium</p>
          <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.total)}</p>
          <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.perPerson)} per person</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-border p-3 text-center"><p className="text-xs text-muted-foreground">Medical Cover</p><p className="text-lg font-bold">{result.covers.medical}</p></div>
          <div className="rounded-xl border border-border p-3 text-center"><p className="text-xs text-muted-foreground">Cancellation</p><p className="text-lg font-bold">{result.covers.cancellation}</p></div>
          <div className="rounded-xl border border-border p-3 text-center"><p className="text-xs text-muted-foreground">Baggage</p><p className="text-lg font-bold">{result.covers.baggage}</p></div>
        </div>
        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
          <p>Indicative premiums only — actual costs vary by provider, medical history and specific trip details. Always compare quotes.</p>
        </div>
      </div>
    </div>
  )
}
