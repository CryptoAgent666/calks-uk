import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// High-value property council tax surcharge (expected from April 2028)
const BANDS_WITH_SURCHARGE = [
  { band: 'A', value: 'Up to £40K', ratio: 6/9, surcharge: 0 },
  { band: 'B', value: '£40-52K', ratio: 7/9, surcharge: 0 },
  { band: 'C', value: '£52-68K', ratio: 8/9, surcharge: 0 },
  { band: 'D', value: '£68-88K', ratio: 1, surcharge: 0 },
  { band: 'E', value: '£88-120K', ratio: 11/9, surcharge: 0 },
  { band: 'F', value: '£120-160K', ratio: 13/9, surcharge: 0 },
  { band: 'G', value: '£160-320K', ratio: 15/9, surcharge: 0 },
  { band: 'H', value: 'Over £320K', ratio: 2, surcharge: 100 },
  { band: 'I*', value: 'Over £500K*', ratio: 2.5, surcharge: 200 },
  { band: 'J*', value: 'Over £1M*', ratio: 3, surcharge: 500 },
]

function calculate(bandD: number, band: string) {
  const info = BANDS_WITH_SURCHARGE.find(b => b.band === band)
  if (!info) return null
  const baseTax = bandD * info.ratio
  const total = baseTax + info.surcharge
  return { baseTax, surcharge: info.surcharge, total, monthly: total / 12 }
}

export default function HighCouncilTaxCalculator() {
  const [bandD, setBandD] = useState('2171')
  const [band, setBand] = useState('H')
  const result = useMemo(() => calculate(parseFloat(bandD)||0, band), [bandD, band])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Band D Rate</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="500" max="5000" value={bandD} onChange={(e) => setBandD(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Band</label><select value={band} onChange={(e) => setBand(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring">{BANDS_WITH_SURCHARGE.map(b => <option key={b.band} value={b.band}>Band {b.band} — {b.value}</option>)}</select></div>
      </div>
      {result && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Estimated Annual Council Tax</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.total)}</p>
            <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.monthly)}/month</p>
          </div>
          {result.surcharge > 0 && <div className="rounded-xl bg-orange-100 dark:bg-orange-950 p-3 text-center text-sm text-orange-800 dark:text-orange-300">Includes £{result.surcharge} high-value property surcharge (*proposed from April 2028)</div>}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border"><th className="text-left py-2 font-medium text-muted-foreground">Band</th><th className="text-left py-2 font-medium text-muted-foreground">1991 Value</th><th className="text-right py-2 font-medium text-muted-foreground">Ratio</th><th className="text-right py-2 font-medium text-muted-foreground">Annual Tax</th></tr></thead>
              <tbody>{BANDS_WITH_SURCHARGE.map(b => {
                const tax = (parseFloat(bandD)||0) * b.ratio + b.surcharge
                return <tr key={b.band} className={`border-b border-border/50 ${b.band === band ? 'bg-primary/5 font-medium' : ''}`}><td className="py-1.5">{b.band}</td><td className="py-1.5 text-muted-foreground">{b.value}</td><td className="py-1.5 text-right">{(b.ratio * 100).toFixed(0)}%</td><td className="py-1.5 text-right tabular-nums">{formatCurrency(tax)}</td></tr>
              })}</tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
