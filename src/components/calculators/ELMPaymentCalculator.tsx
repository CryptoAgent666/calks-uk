import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// SFI26 payment rates (gov.uk SFI26 actions, 2026). CSAM1 soil assessment was dropped
// for SFI26, and the old £49/ha woodland rate belonged to the closed 2021 pilot.
const ACTIONS = [
  { id: 'hedgerow', name: 'Manage hedgerows (CHRW2)', unit: 'per 100m, one side', rate: 13 },
  { id: 'buffer_strip', name: '4m-12m grass buffer strip, arable (CAHL4)', unit: 'per ha', rate: 515 },
  { id: 'cover_crop', name: 'Multi-species winter cover crop (CSAM2)', unit: 'per ha', rate: 129 },
  { id: 'herbal_ley', name: 'Herbal leys (CSAM3)', unit: 'per ha', rate: 224 }, // was £382 under SFI 2024
  { id: 'wildflower', name: 'Flower-rich grass margins or strips (CIPM2)', unit: 'per ha', rate: 798 },
  { id: 'no_insecticide', name: 'No insecticide on arable or permanent crops (CIPM4)', unit: 'per ha', rate: 45 },
  { id: 'companion_crop', name: 'Companion crop, arable (CIPM3)', unit: 'per ha', rate: 55 },
  { id: 'pollen_nectar', name: 'Pollen and nectar flower mix (CAHL1)', unit: 'per ha', rate: 739 },
  { id: 'winter_bird_food', name: 'Winter bird food, arable (CAHL2)', unit: 'per ha', rate: 648 },
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
        <p>Sustainable Farming Incentive 2026 (SFI26) rates for England. SFI26 has no management payment and caps each agreement at £100,000 a year. Both SFI26 application windows have closed (the second on 22 September 2026); agreements are managed through the Rural Payments service.</p>
      </div>
    </div>
  )
}
