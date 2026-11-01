import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(panels: number, panelHeight: number, panelWidth: number, coats: number, coveragePerLitre: number, pricePerLitre: number, paintBothSides: boolean, extraArea: number) {
  // A blank or zero entry means there is nothing to work out, rather than a silent default.
  if (panels <= 0 || panelHeight <= 0 || panelWidth <= 0 || coats <= 0 || coveragePerLitre <= 0 || extraArea < 0) return null
  const sidesMultiplier = paintBothSides ? 2 : 1
  const areaPerPanel = (panelHeight / 1000) * (panelWidth / 1000)
  const totalArea = panels * areaPerPanel * sidesMultiplier + extraArea
  const litresNeeded = totalArea * coats / coveragePerLitre
  const tins5L = Math.ceil(litresNeeded / 5 - 1e-9)
  const tins9L = Math.ceil(litresNeeded / 9 - 1e-9)
  const cost = tins5L * 5 * pricePerLitre

  return { totalArea, litresNeeded, tins5L, tins9L, cost }
}

export default function FencePaintCalculator() {
  const [panels, setPanels] = useState('8')
  const [height, setHeight] = useState('1830')
  const [width, setWidth] = useState('1830')
  const [coats, setCoats] = useState('2')
  const [coverage, setCoverage] = useState('4.8')
  const [price, setPrice] = useState('4')
  const [extra, setExtra] = useState('0')
  const [both, setBoth] = useState(false)

  const result = useMemo(() => calculate(parseInt(panels)||0, parseFloat(height)||0, parseFloat(width)||0, parseInt(coats)||0, parseFloat(coverage)||0, parseFloat(price)||0, both, parseFloat(extra)||0), [panels, height, width, coats, coverage, price, both, extra])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Fence Panels</label><input type="number" min="1" max="50" value={panels} onChange={(e) => setPanels(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Fence Panels" /></div>
        <div><label className="block text-sm font-medium mb-2">Panel Height (mm)</label><input type="number" min="500" max="2400" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Panel Height (mm)" /></div>
        <div><label className="block text-sm font-medium mb-2">Panel Width (mm)</label><input type="number" min="500" max="2400" value={width} onChange={(e) => setWidth(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Panel Width (mm)" /></div>
        <div><label className="block text-sm font-medium mb-2">Coats</label><input type="number" min="1" max="3" value={coats} onChange={(e) => setCoats(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Coats" /></div>
        <div><label className="block text-sm font-medium mb-2">Coverage (m²/litre)</label><input type="number" min="2" max="12" step="0.1" value={coverage} onChange={(e) => setCoverage(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Coverage (m²/litre)" /></div>
        <div><label className="block text-sm font-medium mb-2">Price (£/litre)</label><input type="number" min="0" step="0.5" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Price (£/litre)" /></div>
        <div><label className="block text-sm font-medium mb-2">Extra Area: Posts, Gravel Boards (m²)</label><input type="number" min="0" step="0.5" value={extra} onChange={(e) => setExtra(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Extra area for posts and gravel boards (m²)" /></div>
      </div>
      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={both} onChange={(e) => setBoth(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Paint both sides</span></label>

      {!result && <p className="text-sm text-muted-foreground">Enter panels, height, width, coats and coverage, all above zero.</p>}
      {result && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 animate-fade-in-up">
          <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Paint Needed</p><p className="text-xl font-bold text-primary">{result.litresNeeded.toFixed(1)}L</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">5L Tins</p><p className="text-lg font-bold">{result.tins5L}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Or 9L Tins</p><p className="text-lg font-bold">{result.tins9L}</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Fence Area</p><p className="text-lg font-bold">{result.totalArea.toFixed(1)} m²</p></div>
          <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Est. Cost (5L tins)</p><p className="text-lg font-bold">{formatCurrency(result.cost)}</p></div>
        </div>
      )}
    </div>
  )
}
