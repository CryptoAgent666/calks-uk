import { useState } from 'react'

function fmt(n: number) {
  return isNaN(n) || !isFinite(n) ? '' : n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function DiscountCalculator() {
  const [price, setPrice] = useState('')
  const [discount, setDiscount] = useState('')
  const [finalPrice, setFinalPrice] = useState('')
  const [originalForFinal, setOriginalForFinal] = useState('')

  const p = parseFloat(price) || 0
  const d = parseFloat(discount) || 0
  const fp = parseFloat(finalPrice) || 0
  const ofp = parseFloat(originalForFinal) || 0

  const savedAmount = p * (d / 100)
  const newPrice = p - savedAmount

  const pctOff = ofp > 0 && fp > 0 ? ((ofp - fp) / ofp) * 100 : 0

  return (
    <div className="space-y-8">
      {/* Calculate discounted price */}
      <div className="rounded-xl border border-border p-5 space-y-4">
        <h3 className="font-semibold">Calculate Sale Price</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Original Price</label>
            <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
              <input type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="100" className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Discount (%)</label>
            <input type="number" min="0" max="100" step="0.1" value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder="20" className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
        </div>
        {p > 0 && d > 0 && (
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">Sale Price</p><p className="text-xl font-bold text-primary">£{fmt(newPrice)}</p></div>
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center"><p className="text-xs text-muted-foreground">You Save</p><p className="text-xl font-bold text-green-700 dark:text-green-400">£{fmt(savedAmount)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Original</p><p className="text-xl font-bold">£{fmt(p)}</p></div>
          </div>
        )}
        {/* Quick discount buttons */}
        <div className="flex flex-wrap gap-2">
          {[10, 15, 20, 25, 30, 40, 50, 70].map((pct) => (
            <button key={pct} onClick={() => setDiscount(pct.toString())} className="px-3 py-1.5 rounded-lg bg-muted text-sm font-medium hover:bg-accent transition-colors">{pct}%</button>
          ))}
        </div>
      </div>

      {/* Reverse: find discount percentage */}
      <div className="rounded-xl border border-border p-5 space-y-4">
        <h3 className="font-semibold">What % Discount Is This?</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Original Price</label>
            <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
              <input type="number" min="0" step="0.01" value={originalForFinal} onChange={(e) => setOriginalForFinal(e.target.value)} placeholder="80" className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Sale Price</label>
            <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
              <input type="number" min="0" step="0.01" value={finalPrice} onChange={(e) => setFinalPrice(e.target.value)} placeholder="60" className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
          </div>
        </div>
        {ofp > 0 && fp > 0 && (
          <div className="rounded-xl bg-primary/10 p-4 text-center">
            <p className="text-sm text-muted-foreground">Discount</p>
            <p className="text-3xl font-bold text-primary">{pctOff.toFixed(1)}% off</p>
            <p className="text-sm text-muted-foreground mt-1">Saving £{fmt(ofp - fp)}</p>
          </div>
        )}
      </div>
    </div>
  )
}
