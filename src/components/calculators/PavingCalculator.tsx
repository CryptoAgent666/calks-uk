import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(areaLength: number, areaWidth: number, slabLength: number, slabWidth: number, jointGap: number, wastePct: number, pricePerSlab: number) {
  const area = areaLength * areaWidth
  // A blank or zero slab dimension gives no result rather than a 1cm "slab" made of the joint
  const slabArea = slabLength > 0 && slabWidth > 0 ? ((slabLength + jointGap) * (slabWidth + jointGap)) / 10000 : 0 // cm to m
  const slabsRaw = slabArea > 0 ? area / slabArea : 0
  const slabsNeeded = Math.ceil(slabsRaw * (1 + wastePct / 100) - 1e-9)
  const cost = slabsNeeded * pricePerSlab
  // Sand for jointing: ~5kg per m²
  const sandKg = Math.ceil(area * 5)

  return { area, slabsNeeded, cost, sandKg }
}

export default function PavingCalculator() {
  const [al, setAl] = useState('4')
  const [aw, setAw] = useState('3')
  const [sl, setSl] = useState('60')
  const [sw, setSw] = useState('60')
  const [gap, setGap] = useState('10')
  const [waste, setWaste] = useState('5')
  const [price, setPrice] = useState('3.50')

  const slabEntered = parseFloat(sl) > 0 && parseFloat(sw) > 0
  const result = useMemo(() => calculate(parseFloat(al)||0, parseFloat(aw)||0, parseFloat(sl)||0, parseFloat(sw)||0, (parseFloat(gap)||0) / 10, parseFloat(waste)||0, parseFloat(price)||0), [al, aw, sl, sw, gap, waste, price])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Area Length (m)</label><input type="number" min="0" step="0.1" value={al} onChange={(e) => setAl(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Area Length (m)" /></div>
        <div><label className="block text-sm font-medium mb-2">Area Width (m)</label><input type="number" min="0" step="0.1" value={aw} onChange={(e) => setAw(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Area Width (m)" /></div>
        <div><label className="block text-sm font-medium mb-2">Slab Length (cm)</label><input type="number" min="1" value={sl} onChange={(e) => setSl(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Slab Length (cm)" /></div>
        <div><label className="block text-sm font-medium mb-2">Slab Width (cm)</label><input type="number" min="1" value={sw} onChange={(e) => setSw(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Slab Width (cm)" /></div>
        <div><label className="block text-sm font-medium mb-2">Joint Width (mm)</label><input type="number" min="0" value={gap} onChange={(e) => setGap(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Joint Width (mm)" /></div>
        <div><label className="block text-sm font-medium mb-2">Wastage (%)</label><input type="number" min="0" max="20" value={waste} onChange={(e) => setWaste(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Wastage (%)" /></div>
        <div><label className="block text-sm font-medium mb-2">Price/Slab (£)</label><input type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Price/Slab (£)" /></div>
      </div>

      {!slabEntered && (
        <p className="text-sm text-destructive" role="alert">Enter the slab length and width to see how many you need.</p>
      )}

      {result.slabsNeeded > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in-up">
          <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Slabs Needed</p><p className="text-xl font-bold text-primary">{result.slabsNeeded}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Area</p><p className="text-lg font-bold">{result.area.toFixed(1)} m²</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Jointing Sand</p><p className="text-lg font-bold">{result.sandKg} kg</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Slab Cost</p><p className="text-lg font-bold">{formatCurrency(result.cost)}</p></div>
        </div>
      )}
    </div>
  )
}
