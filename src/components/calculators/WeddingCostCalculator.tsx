import { useState } from 'react'
import { formatCurrency } from '@/utils'

// Starting figures only: every line is meant to be overwritten with your own quotes
const ITEMS = [
  { id: 'venue', label: 'Venue Hire', avg: 5000 },
  { id: 'catering', label: 'Catering (per head)', avg: 85, perGuest: true },
  { id: 'drinks', label: 'Drinks (per head)', avg: 30, perGuest: true },
  { id: 'photo', label: 'Photographer', avg: 1500 },
  { id: 'video', label: 'Videographer', avg: 1200 },
  { id: 'flowers', label: 'Flowers', avg: 800 },
  { id: 'cake', label: 'Cake', avg: 400 },
  { id: 'dress', label: 'Wedding Dress', avg: 1500 },
  { id: 'suits', label: 'Suits / Groom', avg: 600 },
  { id: 'rings', label: 'Rings', avg: 800 },
  { id: 'music', label: 'Band / DJ', avg: 800 },
  { id: 'stationery', label: 'Invitations / Stationery', avg: 300 },
  { id: 'transport', label: 'Transport', avg: 400 },
  { id: 'hair', label: 'Hair & Makeup', avg: 400 },
  { id: 'favours', label: 'Favours', avg: 150 },
  { id: 'decor', label: 'Decorations', avg: 500 },
  { id: 'legal', label: 'Notice & ceremony fees', avg: 0 },
  { id: 'honeymoon', label: 'Honeymoon', avg: 3000 },
]

// Bridebook's published UK average leaves out the honeymoon and engagement ring
const EXCLUDED_FROM_AVERAGES = ['rings', 'honeymoon']

const DEFAULT_GUESTS = 80
const MIN_GUESTS = 10
const MAX_GUESTS = 500

export default function WeddingCostCalculator() {
  const [guests, setGuests] = useState(String(DEFAULT_GUESTS))
  const [costs, setCosts] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {}
    ITEMS.forEach(i => { init[i.id] = i.avg })
    return init
  })

  const parsed = parseInt(guests, 10)
  const g = Number.isFinite(parsed) ? Math.min(MAX_GUESTS, Math.max(MIN_GUESTS, parsed)) : DEFAULT_GUESTS
  const guestsAdjusted = parsed !== g

  const lineCost = (item: typeof ITEMS[number]) => {
    const cost = costs[item.id] || 0
    return 'perGuest' in item && item.perGuest ? cost * g : cost
  }
  const total = ITEMS.reduce((sum, item) => sum + lineCost(item), 0)
  const excluded = ITEMS.filter(i => EXCLUDED_FROM_AVERAGES.includes(i.id)).reduce((sum, item) => sum + lineCost(item), 0)
  const dayTotal = total - excluded
  const perGuest = total / g

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="wedding-guests" className="block text-sm font-medium mb-2">Number of guests</label>
        <input id="wedding-guests" type="number" inputMode="numeric" min={MIN_GUESTS} max={MAX_GUESTS} step={1} value={guests} onChange={(e) => setGuests(e.target.value)} className="w-48 rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
        {guestsAdjusted && <p className="text-xs text-muted-foreground mt-1">Using {g} guests (the calculator takes {MIN_GUESTS} to {MAX_GUESTS}).</p>}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {ITEMS.map(item => (
          <div key={item.id} className="flex items-center gap-2">
            <label htmlFor={`wedding-${item.id}`} className="text-xs text-muted-foreground w-28 shrink-0">{item.label}{'perGuest' in item && item.perGuest ? '/pp' : ''}</label>
            <div className="relative flex-1"><span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">£</span><input id={`wedding-${item.id}`} type="number" min="0" value={costs[item.id] || ''} onChange={(e) => setCosts(prev => ({ ...prev, [item.id]: Math.max(0, parseFloat(e.target.value) || 0) }))} className="w-full rounded-lg border border-input bg-background pl-6 pr-2 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl bg-primary/10 p-6 text-center animate-fade-in-up" aria-live="polite">
        <p className="text-sm text-muted-foreground">Total wedding cost</p>
        <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(total)}</p>
        <p className="text-sm text-muted-foreground mt-1">{formatCurrency(perGuest)} per guest &middot; {g} guests</p>
        <p className="text-sm text-muted-foreground mt-1">Without rings and honeymoon: {formatCurrency(dayTotal)} ({formatCurrency(dayTotal / g)} per guest)</p>
      </div>
      <p className="text-xs text-muted-foreground">Catering and drinks are multiplied by the number of guests; every other line is a flat amount. The starting figures are rough guides, so replace them with your own quotes. Notice and ceremony fees are charged by your local register office or the venue, so check their price list. Bridebook's UK average leaves out the honeymoon and engagement ring, so the second figure drops the rings and honeymoon lines for a closer comparison.</p>
    </div>
  )
}
