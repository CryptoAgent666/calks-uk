import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

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
  { id: 'honeymoon', label: 'Honeymoon', avg: 3000 },
]

export default function WeddingCostCalculator() {
  const [guests, setGuests] = useState('80')
  const [costs, setCosts] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {}
    ITEMS.forEach(i => { init[i.id] = i.avg })
    return init
  })

  const g = parseInt(guests) || 80
  const total = ITEMS.reduce((sum, item) => {
    const cost = costs[item.id] || 0
    return sum + ('perGuest' in item && item.perGuest ? cost * g : cost)
  }, 0)
  const perGuest = g > 0 ? total / g : 0

  return (
    <div className="space-y-6">
      <div><label className="block text-sm font-medium mb-2">Number of Guests</label><input type="number" min="10" max="500" value={guests} onChange={(e) => setGuests(e.target.value)} className="w-48 rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Number of Guests" /></div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {ITEMS.map(item => (
          <div key={item.id} className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-28 shrink-0">{item.label}{'perGuest' in item && item.perGuest ? '/pp' : ''}</span>
            <div className="relative flex-1"><span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">£</span><input type="number" min="0" value={costs[item.id] || ''} onChange={(e) => setCosts(prev => ({...prev, [item.id]: parseFloat(e.target.value)||0}))} className="w-full rounded-lg border border-input bg-background pl-6 pr-2 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl bg-primary/10 p-6 text-center animate-fade-in-up">
        <p className="text-sm text-muted-foreground">Total Wedding Cost</p>
        <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(total)}</p>
        <p className="text-sm text-muted-foreground mt-1">{formatCurrency(perGuest)} per guest &middot; {g} guests</p>
      </div>
    </div>
  )
}
