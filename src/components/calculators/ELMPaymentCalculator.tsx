import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Simplified ELM/SFI payment rates 2025
const ACTIONS = [
  { id: 'hedgerow', name: 'Hedgerow Management', unit: 'per 100m', rate: 13 },
  { id: 'buffer_strip', name: 'Buffer Strips (6m)', unit: 'per ha', rate: 451 },
  { id: 'cover_crop', name: 'Winter Cover Crop', unit: 'per ha', rate: 129 },
  { id: 'herbal_ley', name: 'Herbal Ley', unit: 'per ha', rate: 382 },
  { id: 'soil_assessment', name: 'Soil Assessment', unit: 'per agreement', rate: 97 },
  { id: 'wildflower', name: 'Flower-Rich Margins', unit: 'per ha', rate: 739 },
  { id: 'no_insecticide', name: 'No Insecticide (arable)', unit: 'per ha', rate: 45 },
  { id: 'companion_crop', name: 'Companion Crop', unit: 'per ha', rate: 55 },
  { id: 'pollen_nectar', name: 'Pollen & Nectar Mix', unit: 'per ha', rate: 614 },
  { id: 'woodland', name: 'Woodland Management', unit: 'per ha', rate: 49 },
]

export default function ELMPaymentCalculator() {
  const [selected, setSelected] = useState<Record<string, number>>({})

  const updateAction = (id: string, quantity: number) => setSelected(prev => {
    const next = { ...prev }
    if (quantity > 0) next[id] = quantity; else delete next[id]
    return next
  })

  const totalAnnual = ACTIONS.reduce((sum, a) => sum + (selected[a.id] || 0) * a.rate, 0)

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        {ACTIONS.map(a => (
          <div key={a.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
            <div className="flex-1"><p className="text-sm font-medium">{a.name}</p><p className="text-xs text-muted-foreground">{formatCurrency(a.rate)} {a.unit}</p></div>
            <input type="number" min="0" max="1000" value={selected[a.id] || ''} onChange={(e) => updateAction(a.id, parseFloat(e.target.value) || 0)} placeholder="0" className="w-20 rounded-lg border border-input bg-background px-2 py-1.5 text-sm text-center font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
            {selected[a.id] > 0 && <span className="text-sm font-medium text-primary w-20 text-right">{formatCurrency((selected[a.id] || 0) * a.rate)}</span>}
          </div>
        ))}
      </div>
      {totalAnnual > 0 && (
        <div className="rounded-2xl bg-green-100 dark:bg-green-950 p-6 text-center animate-fade-in-up">
          <p className="text-sm text-muted-foreground">Total Annual ELM/SFI Payment</p>
          <p className="text-3xl font-bold text-green-700 dark:text-green-400 mt-1">{formatCurrency(totalAnnual)}</p>
          <p className="text-sm text-muted-foreground mt-1">{formatCurrency(totalAnnual / 12)}/month</p>
        </div>
      )}
      <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
        <p>Sustainable Farming Incentive (SFI) and Environmental Land Management (ELM) rates for England 2025. Apply via Rural Payments Agency. Rates are indicative.</p>
      </div>
    </div>
  )
}
