import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(hectares: number, landType: string, currentRent: number, yieldPerHa: number, pricePerTonne: number) {
  const ratesPerHa: Record<string, number> = { arable: 250, grassland: 150, mixed: 200, upland: 80 }
  const marketRent = hectares * (ratesPerHa[landType] || 200)
  const difference = currentRent - marketRent
  const revenue = hectares * yieldPerHa * pricePerTonne
  const rentAsPctRevenue = revenue > 0 ? (currentRent / revenue) * 100 : 0

  return { marketRent, difference, revenue, rentAsPctRevenue, perHa: hectares > 0 ? currentRent / hectares : 0, marketPerHa: ratesPerHa[landType] || 200 }
}

export default function FarmTenancyCalculator() {
  const [ha, setHa] = useState('100')
  const [type, setType] = useState('arable')
  const [rent, setRent] = useState('22000')
  const [yld, setYld] = useState('8')
  const [price, setPrice] = useState('180')

  const h = parseFloat(ha) || 0
  const r = parseFloat(rent.replace(/,/g,'')) || 0
  const y = parseFloat(yld) || 0
  const p = parseFloat(price) || 0
  const result = useMemo(() => calculate(h, type, r, y, p), [h, type, r, y, p])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Hectares</label><input type="number" min="1" max="5000" value={ha} onChange={(e) => setHa(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Hectares" /></div>
        <div><label className="block text-sm font-medium mb-2">Land Type</label><select value={type} onChange={(e) => setType(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Land Type"><option value="arable">Arable (~£250/ha)</option><option value="grassland">Grassland (~£150/ha)</option><option value="mixed">Mixed (~£200/ha)</option><option value="upland">Upland (~£80/ha)</option></select></div>
        <div><label className="block text-sm font-medium mb-2">Current Annual Rent</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={rent} onChange={(e) => setRent(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Current Annual Rent" /></div></div>
      </div>

      {h > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Your Rent/ha</p><p className="text-lg font-bold">{formatCurrency(result.perHa)}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Market Rate/ha</p><p className="text-lg font-bold">{formatCurrency(result.marketPerHa)}</p></div>
            <div className={`rounded-xl p-3 text-center ${result.difference > 0 ? 'bg-destructive/10' : 'bg-green-100 dark:bg-green-950'}`}><p className="text-xs text-muted-foreground">vs Market</p><p className={`text-lg font-bold ${result.difference > 0 ? 'text-destructive' : 'text-green-700 dark:text-green-400'}`}>{result.difference > 0 ? '+' : ''}{formatCurrency(result.difference)}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Rent as % Revenue</p><p className="text-lg font-bold">{result.rentAsPctRevenue.toFixed(1)}%</p></div>
          </div>
        </div>
      )}
    </div>
  )
}
