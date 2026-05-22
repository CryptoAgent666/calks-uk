import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

const CROPS: Record<string, { yieldPerSqm: number; unit: string }> = {
  'Potatoes': { yieldPerSqm: 4, unit: 'kg' },
  'Tomatoes': { yieldPerSqm: 8, unit: 'kg' },
  'Carrots': { yieldPerSqm: 3, unit: 'kg' },
  'Onions': { yieldPerSqm: 3.5, unit: 'kg' },
  'Courgettes': { yieldPerSqm: 5, unit: 'kg' },
  'Runner Beans': { yieldPerSqm: 2.5, unit: 'kg' },
  'Lettuce': { yieldPerSqm: 10, unit: 'heads' },
  'Beetroot': { yieldPerSqm: 4, unit: 'kg' },
  'Peas': { yieldPerSqm: 1.5, unit: 'kg' },
  'Strawberries': { yieldPerSqm: 1.2, unit: 'kg' },
  'Wheat (commercial)': { yieldPerSqm: 0.8, unit: 'kg' },
  'Barley (commercial)': { yieldPerSqm: 0.65, unit: 'kg' },
}

function calculate(crop: string, area: number, pricePerUnit: number) {
  const info = CROPS[crop]
  if (!info || area <= 0) return null
  const totalYield = area * info.yieldPerSqm
  const totalValue = totalYield * pricePerUnit
  return { totalYield, unit: info.unit, yieldPerSqm: info.yieldPerSqm, totalValue }
}

export default function CropYieldCalculator() {
  const [crop, setCrop] = useState('Potatoes')
  const [area, setArea] = useState('20')
  const [price, setPrice] = useState('1.50')

  const result = useMemo(() => calculate(crop, parseFloat(area)||0, parseFloat(price)||0), [crop, area, price])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Crop</label>
          <select value={crop} onChange={(e) => setCrop(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Crop">
            {Object.keys(CROPS).map(c => <option key={c} value={c}>{c}</option>)}
          </select></div>
        <div><label className="block text-sm font-medium mb-2">Growing Area (m²)</label><input type="number" min="0" step="1" value={area} onChange={(e) => setArea(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Growing Area (m²)" /></div>
        <div><label className="block text-sm font-medium mb-2">Price per {CROPS[crop]?.unit || 'kg'} (£)</label><input type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
      </div>
      {result && (
        <div className="grid grid-cols-3 gap-3 animate-fade-in-up">
          <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center"><p className="text-xs text-muted-foreground">Expected Yield</p><p className="text-xl font-bold text-green-700 dark:text-green-400">{result.totalYield.toFixed(0)} {result.unit}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Yield per m²</p><p className="text-lg font-bold">{result.yieldPerSqm} {result.unit}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Estimated Value</p><p className="text-lg font-bold">{formatCurrency(result.totalValue)}</p></div>
        </div>
      )}
    </div>
  )
}
