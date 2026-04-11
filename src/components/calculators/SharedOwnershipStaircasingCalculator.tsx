import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(currentShare: number, propertyValue: number, targetShare: number, mortgageRate: number, term: number) {
  const additionalSharePct = targetShare - currentShare
  const additionalCost = propertyValue * (additionalSharePct / 100)
  const newShareValue = propertyValue * (targetShare / 100)
  const unsoldValue = propertyValue * ((100 - targetShare) / 100)

  // New rent (on unsold share, typically 2.75%)
  const newRent = unsoldValue * 0.0275 / 12
  const oldRent = (propertyValue * ((100 - currentShare) / 100)) * 0.0275 / 12
  const rentSaving = oldRent - newRent

  // Mortgage on additional share
  const monthlyRate = mortgageRate / 100 / 12
  const payments = term * 12
  const additionalMonthly = monthlyRate > 0 ? additionalCost * (monthlyRate * Math.pow(1 + monthlyRate, payments)) / (Math.pow(1 + monthlyRate, payments) - 1) : additionalCost / payments

  const netMonthlyCost = additionalMonthly - rentSaving

  return { additionalCost, newShareValue, unsoldValue, newRent, oldRent, rentSaving, additionalMonthly, netMonthlyCost, additionalSharePct }
}

export default function SharedOwnershipStaircasingCalculator() {
  const [share, setShare] = useState('25')
  const [value, setValue] = useState('300000')
  const [target, setTarget] = useState('50')
  const [rate, setRate] = useState('4.5')
  const [term, setTerm] = useState('25')

  const cs = parseInt(share) || 0
  const v = parseFloat(value.replace(/,/g,'')) || 0
  const ts = parseInt(target) || 0
  const r = parseFloat(rate) || 0
  const t = parseInt(term) || 25
  const result = useMemo(() => calculate(cs, v, ts, r, t), [cs, v, ts, r, t])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Current Share (%)</label><input type="number" min="10" max="75" step="5" value={share} onChange={(e) => setShare(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Current Property Value</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={value} onChange={(e) => setValue(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Target Share (%)</label><select value={target} onChange={(e) => setTarget(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring">{[25,30,40,50,60,75,100].filter(s => s > cs).map(s => <option key={s} value={s}>{s}%{s===100?' (full ownership)':''}</option>)}</select></div>
        <div><label className="block text-sm font-medium mb-2">Mortgage Rate (%)</label><input type="number" min="1" max="8" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
      </div>

      {v > 0 && ts > cs && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Cost to Buy Extra {result.additionalSharePct}%</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.additionalCost)}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Extra Mortgage</p><p className="text-lg font-bold">{formatCurrency(result.additionalMonthly)}/mo</p></div>
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-3 text-center"><p className="text-xs text-muted-foreground">Rent Saving</p><p className="text-lg font-bold text-green-700 dark:text-green-400">-{formatCurrency(result.rentSaving)}/mo</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Net Monthly Cost</p><p className="text-lg font-bold">{formatCurrency(result.netMonthlyCost)}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">New Rent</p><p className="text-lg font-bold">{formatCurrency(result.newRent)}/mo</p></div>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>Staircasing: buy a larger share of your shared ownership home. At 100%, you own it outright and pay no rent. The extra share is valued at current market price, not the original purchase price.</p>
          </div>
        </div>
      )}
    </div>
  )
}
