import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// SFI26 payment rates (gov.uk SFI26 actions, 2026). CSAM1 soil assessment was dropped
// for SFI26, and the old £49/ha woodland rate belonged to the closed 2021 pilot.
// `per` is how many input units one payment unit covers: hedgerows are entered in metres and paid per 100 m.
const ACTIONS = [
  { id: 'hedgerow', name: 'Manage hedgerows (CHRW2)', unit: 'per 100m, one side', rate: 13, input: 'm', per: 100 },
  { id: 'buffer_strip', name: '4m-12m grass buffer strip, arable (CAHL4)', unit: 'per ha', rate: 515, input: 'ha', per: 1 },
  { id: 'watercourse_buffer', name: '12m-24m watercourse buffer strip on cultivated land (BFS1)', unit: 'per ha', rate: 707, input: 'ha', per: 1 },
  { id: 'cover_crop', name: 'Multi-species winter cover crop (CSAM2)', unit: 'per ha', rate: 129, input: 'ha', per: 1 },
  { id: 'herbal_ley', name: 'Herbal leys (CSAM3)', unit: 'per ha', rate: 224, input: 'ha', per: 1 }, // was £382 under SFI 2024
  { id: 'legume_fallow', name: 'Legume fallow (CNUM3)', unit: 'per ha', rate: 532, input: 'ha', per: 1 },
  { id: 'legume_grassland', name: 'Legumes on improved grassland (CNUM2)', unit: 'per ha', rate: 102, input: 'ha', per: 1 },
  { id: 'low_input_grassland', name: 'Manage grassland with very low nutrient inputs (CLIG3)', unit: 'per ha', rate: 151, input: 'ha', per: 1 },
  { id: 'wildflower', name: 'Flower-rich grass margins or strips (CIPM2)', unit: 'per ha', rate: 798, input: 'ha', per: 1 },
  { id: 'no_insecticide', name: 'No insecticide on arable or permanent crops (CIPM4)', unit: 'per ha', rate: 45, input: 'ha', per: 1 },
  { id: 'companion_crop', name: 'Companion crop, arable (CIPM3)', unit: 'per ha', rate: 55, input: 'ha', per: 1 },
  { id: 'pollen_nectar', name: 'Pollen and nectar flower mix (CAHL1)', unit: 'per ha', rate: 739, input: 'ha', per: 1 },
  { id: 'winter_bird_food', name: 'Winter bird food, arable (CAHL2)', unit: 'per ha', rate: 648, input: 'ha', per: 1 },
]
type Action = (typeof ACTIONS)[number]

const AGREEMENT_CAP = 100_000 // SFI26 maximum per agreement year

function lineAmount(a: Action, quantity: number) {
  return (quantity / a.per) * a.rate
}

function annualTotal(selected: Record<string, number>) {
  return ACTIONS.reduce((sum, a) => sum + lineAmount(a, selected[a.id] || 0), 0)
}

export default function ELMPaymentCalculator() {
  const [selected, setSelected] = useState<Record<string, number>>({})

  const updateAction = (id: string, quantity: number) => setSelected(prev => {
    const next = { ...prev }
    if (quantity > 0) next[id] = quantity; else delete next[id]
    return next
  })

  const totalAnnual = annualTotal(selected)

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        {ACTIONS.map(a => (
          <div key={a.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
            <div className="flex-1"><p className="text-sm font-medium">{a.name}</p><p className="text-xs text-muted-foreground">{formatCurrency(a.rate)} {a.unit}</p></div>
            <input type="number" min="0" value={selected[a.id] || ''} onChange={(e) => updateAction(a.id, parseFloat(e.target.value) || 0)} placeholder="0" className="w-20 rounded-lg border border-input bg-background px-2 py-1.5 text-sm text-center font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label={`${a.name}, ${a.input === 'm' ? 'metres' : 'hectares'}`} />
            <span className="text-xs text-muted-foreground w-5">{a.input}</span>
            {selected[a.id] > 0 && <span className="text-sm font-medium text-primary w-20 text-right">{formatCurrency(lineAmount(a, selected[a.id] || 0))}</span>}
          </div>
        ))}
      </div>
      {totalAnnual > 0 && (
        <div className="rounded-2xl bg-green-100 dark:bg-green-950 p-6 text-center animate-fade-in-up">
          <p className="text-sm text-muted-foreground">Total Annual ELM/SFI Payment</p>
          <p className="text-3xl font-bold text-green-700 dark:text-green-400 mt-1">{formatCurrency(totalAnnual)}</p>
          <p className="text-sm text-muted-foreground mt-1">{formatCurrency(totalAnnual / 4)} a quarter (SFI26 pays in quarterly instalments)</p>
          {totalAnnual > AGREEMENT_CAP && <p className="text-sm text-muted-foreground mt-1">Above the £100,000 agreement cap: SFI26 pays no more than {formatCurrency(AGREEMENT_CAP)} a year.</p>}
        </div>
      )}
      <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
        <p>Sustainable Farming Incentive 2026 (SFI26) rates for England. Enter hectares for area actions and metres for hedgerows. SFI26 has no management payment and caps each agreement at £100,000 a year. Both SFI26 application windows have closed (the second on 22 September 2026); agreements are managed through the Rural Payments service.</p>
      </div>
    </div>
  )
}
