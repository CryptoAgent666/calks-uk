import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

type TripType = 'single' | 'annual'
type Destination = 'europe' | 'worldwide_exc_us' | 'worldwide_inc_us'
type CoverLevel = 'basic' | 'standard' | 'premium'

// Indicative per-person prices for a traveller under 65. Single-trip prices
// are for a trip of 11-17 days; DURATION_BANDS scales them for other lengths.
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

// Each traveller aged 65 or over is priced at this multiple of the base price.
const OVER_65_LOADING = 2.5

// Single-trip length bands: 1-5 days 60%, 6-10 days 80%, 11-17 days 100%,
// then another 50% for each extra week (or part week) beyond 17 days.
function durationBand(days: number): { factor: number; label: string } {
  if (days <= 5) return { factor: 0.6, label: '1-5 days: 60% of the 11-17 day price' }
  if (days <= 10) return { factor: 0.8, label: '6-10 days: 80% of the 11-17 day price' }
  if (days <= 17) return { factor: 1, label: '11-17 days: full price' }
  const extraWeeks = Math.ceil((days - 17) / 7)
  const factor = 1 + extraWeeks * 0.5
  return { factor, label: `${days} days: ${extraWeeks} extra ${extraWeeks === 1 ? 'week' : 'weeks'} beyond 17 days, ${Math.round(factor * 100)}% of the 11-17 day price` }
}

const COVER_AMOUNTS: Record<CoverLevel, { medical: string; cancellation: string; baggage: string }> = {
  basic: { medical: '£2M', cancellation: '£1,000', baggage: '£500' },
  standard: { medical: '£10M', cancellation: '£3,000', baggage: '£1,500' },
  premium: { medical: '£15M', cancellation: '£5,000', baggage: '£2,500' },
}

function calculate(tripType: TripType, dest: Destination, cover: CoverLevel, travellers: number, olderTravellers: number, daysTrip: number) {
  const base = BASE_COSTS[tripType][dest][cover]
  const band = tripType === 'single' ? durationBand(daysTrip) : null
  const factor = band ? band.factor : 1
  const youngerPrice = base * factor
  const olderPrice = youngerPrice * OVER_65_LOADING
  const younger = travellers - olderTravellers
  const total = youngerPrice * younger + olderPrice * olderTravellers

  // Basic cover outside Europe still carries at least £5 million of medical cover.
  const covers = cover === 'basic' && dest !== 'europe'
    ? { ...COVER_AMOUNTS.basic, medical: '£5M' }
    : COVER_AMOUNTS[cover]

  return { total, youngerPrice, olderPrice, bandLabel: band?.label, covers }
}

export default function TravelInsuranceCalculator() {
  const [type, setType] = useState<TripType>('single')
  const [dest, setDest] = useState<Destination>('europe')
  const [cover, setCover] = useState<CoverLevel>('standard')
  const [travellers, setTravellers] = useState('2')
  const [days, setDays] = useState('7')
  const [over65, setOver65] = useState('0')

  const t = Math.min(10, Math.max(1, parseInt(travellers) || 1))
  const o = Math.min(t, Math.max(0, parseInt(over65) || 0))
  const d = Math.min(365, Math.max(1, parseInt(days) || 7))
  const result = useMemo(() => calculate(type, dest, cover, t, o, d), [type, dest, cover, t, o, d])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Trip Type</label><select value={type} onChange={(e) => setType(e.target.value as TripType)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Trip Type"><option value="single">Single Trip</option><option value="annual">Annual Multi-Trip</option></select></div>
        <div><label className="block text-sm font-medium mb-2">Destination</label><select value={dest} onChange={(e) => setDest(e.target.value as Destination)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Destination"><option value="europe">Europe</option><option value="worldwide_exc_us">Worldwide (excl. USA, Canada and Caribbean)</option><option value="worldwide_inc_us">Worldwide (incl. USA, Canada and Caribbean)</option></select></div>
        <div><label className="block text-sm font-medium mb-2">Cover Level</label><select value={cover} onChange={(e) => setCover(e.target.value as CoverLevel)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Cover Level"><option value="basic">Basic</option><option value="standard">Standard</option><option value="premium">Premium</option></select></div>
        <div><label className="block text-sm font-medium mb-2">Travellers</label><input type="number" min="1" max="10" value={travellers} onChange={(e) => setTravellers(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Travellers" /></div>
        <div><label className="block text-sm font-medium mb-2">Travellers aged 65 or over</label><input type="number" min="0" max={t} value={over65} onChange={(e) => setOver65(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Travellers aged 65 or over" /></div>
        {type === 'single' && <div><label className="block text-sm font-medium mb-2">Trip Length (days)</label><input type="number" min="1" max="365" value={days} onChange={(e) => setDays(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Trip Length (days)" /></div>}
      </div>

      <div className="space-y-4 animate-fade-in-up">
        <div className="rounded-2xl bg-primary/10 p-6 text-center">
          <p className="text-sm text-muted-foreground">Estimated Premium ({t} {t === 1 ? 'traveller' : 'travellers'}{o > 0 ? `, ${o} aged 65+` : ''})</p>
          <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.total)}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {o === 0 ? `${formatCurrency(result.youngerPrice)} per person` : o === t ? `${formatCurrency(result.olderPrice)} per person aged 65+` : `${formatCurrency(result.youngerPrice)} each under 65, ${formatCurrency(result.olderPrice)} each aged 65+`}
          </p>
          {result.bandLabel && <p className="text-xs text-muted-foreground mt-1">Trip length band: {result.bandLabel}</p>}
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-border p-3 text-center"><p className="text-xs text-muted-foreground">Medical Cover</p><p className="text-lg font-bold">{result.covers.medical}</p></div>
          <div className="rounded-xl border border-border p-3 text-center"><p className="text-xs text-muted-foreground">Cancellation</p><p className="text-lg font-bold">{result.covers.cancellation}</p></div>
          <div className="rounded-xl border border-border p-3 text-center"><p className="text-xs text-muted-foreground">Baggage</p><p className="text-lg font-bold">{result.covers.baggage}</p></div>
        </div>
        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
          <p>Indicative premiums only. Each traveller is priced separately, and each one aged 65 or over at {OVER_65_LOADING} times the standard price. Actual costs vary by provider, age band, medical history and trip details, and some insurers sell couple or family policies. Always compare quotes.</p>
        </div>
      </div>
    </div>
  )
}
