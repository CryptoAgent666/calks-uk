import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

const CATEGORIES = [
  { id: 'venue', label: 'Venue Hire', defaultPct: 35 },
  { id: 'catering', label: 'Catering & Drinks', defaultPct: 20 },
  { id: 'photo', label: 'Photography & Video', defaultPct: 10 },
  { id: 'flowers', label: 'Flowers & Decorations', defaultPct: 5 },
  { id: 'music', label: 'Music & Entertainment', defaultPct: 5 },
  { id: 'dress', label: 'Wedding Dress & Suits', defaultPct: 8 },
  { id: 'cake', label: 'Wedding Cake', defaultPct: 2 },
  { id: 'stationery', label: 'Invitations & Stationery', defaultPct: 2 },
  { id: 'transport', label: 'Transport', defaultPct: 3 },
  { id: 'rings', label: 'Wedding Rings', defaultPct: 3 },
  { id: 'other', label: 'Misc / Contingency', defaultPct: 7 },
]

function calculate(budget: number) {
  return CATEGORIES.map(cat => ({
    ...cat,
    amount: budget * (cat.defaultPct / 100),
  }))
}

export default function WeddingBudgetCalculator() {
  const [budget, setBudget] = useState('')
  const [guests, setGuests] = useState('80')

  const b = parseFloat(budget.replace(/,/g, '')) || 0
  const g = parseInt(guests) || 0
  const breakdown = useMemo(() => calculate(b), [b])
  const perGuest = b > 0 && g > 0 ? b / g : 0

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Total Budget</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input type="text" inputMode="numeric" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="20,000" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Total Budget" /></div>
          <div className="flex gap-2 mt-2">
            {[10_000, 15_000, 20_000, 30_000, 50_000].map(a => (
              <button key={a} onClick={() => setBudget(a.toLocaleString())} className="px-3 py-1.5 rounded-lg bg-muted text-sm font-medium hover:bg-accent transition-colors">£{a/1000}K</button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Number of Guests</label>
          <input type="number" min="1" max="500" value={guests} onChange={(e) => setGuests(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Number of Guests" />
        </div>
      </div>

      {b > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          {perGuest > 0 && (
            <div className="rounded-xl bg-primary/10 p-4 text-center">
              <p className="text-sm text-muted-foreground">Cost Per Guest</p>
              <p className="text-2xl font-bold text-primary">{formatCurrency(perGuest)}</p>
            </div>
          )}

          <div className="space-y-2">
            {breakdown.map(item => (
              <div key={item.id} className="flex items-center justify-between rounded-xl border border-border p-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 text-right text-xs font-medium text-muted-foreground">{item.defaultPct}%</div>
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <span className="text-sm font-bold">{formatCurrency(item.amount)}</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-center text-muted-foreground">UK average wedding cost: ~£20,000 (2025). Percentages are typical allocations — adjust to your priorities.</p>
        </div>
      )}
    </div>
  )
}
