import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(totalLength: number, panelWidth: number, pricePanel: number, pricePost: number) {
  const pw = panelWidth / 1000 // mm to m
  const panels = Math.ceil(totalLength / pw)
  const posts = panels + 1
  const costPanels = panels * pricePanel
  const costPosts = posts * pricePost
  const totalCost = costPanels + costPosts

  return { panels, posts, costPanels, costPosts, totalCost }
}

export default function FencingCalculator() {
  const [length, setLength] = useState('15')
  const [panelW, setPanelW] = useState('1830')
  const [priceP, setPriceP] = useState('30')
  const [pricePost, setPricePost] = useState('12')

  const l = parseFloat(length) || 0
  const result = useMemo(() => calculate(l, parseFloat(panelW)||1830, parseFloat(priceP)||0, parseFloat(pricePost)||0), [l, panelW, priceP, pricePost])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Total Length (m)</label><input type="number" min="0" step="0.1" value={length} onChange={(e) => setLength(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Panel Width (mm)</label><input type="number" min="500" max="3000" value={panelW} onChange={(e) => setPanelW(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Price/Panel (£)</label><input type="number" min="0" value={priceP} onChange={(e) => setPriceP(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Price/Post (£)</label><input type="number" min="0" value={pricePost} onChange={(e) => setPricePost(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
      </div>

      {l > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Panels</p><p className="text-xl font-bold text-primary">{result.panels}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Posts</p><p className="text-lg font-bold">{result.posts}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Material Cost</p><p className="text-lg font-bold">{formatCurrency(result.totalCost)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Length</p><p className="text-lg font-bold">{l} m</p></div>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>Panels: {result.panels} x {formatCurrency(parseFloat(priceP)||0)} = {formatCurrency(result.costPanels)}</p>
            <p>Posts: {result.posts} x {formatCurrency(parseFloat(pricePost)||0)} = {formatCurrency(result.costPosts)}</p>
          </div>
        </div>
      )}
    </div>
  )
}
