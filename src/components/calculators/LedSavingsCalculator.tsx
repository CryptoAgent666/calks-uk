import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(oldWatts: number, newWatts: number, bulbs: number, hoursPerDay: number, elecRate: number, ledCost: number) {
  const oldKwhYear = (oldWatts * hoursPerDay * 365 * bulbs) / 1000
  const newKwhYear = (newWatts * hoursPerDay * 365 * bulbs) / 1000
  const savedKwh = oldKwhYear - newKwhYear
  const annualSaving = savedKwh * (elecRate / 100)
  const totalLedCost = ledCost * bulbs
  const paybackMonths = annualSaving > 0 ? (totalLedCost / annualSaving) * 12 : 0

  return { oldKwhYear, newKwhYear, savedKwh, annualSaving, totalLedCost, paybackMonths }
}

export default function LedSavingsCalculator() {
  const [oldW, setOldW] = useState('60')
  const [newW, setNewW] = useState('8')
  const [bulbs, setBulbs] = useState('10')
  const [hours, setHours] = useState('5')
  const [rate, setRate] = useState('24.5')
  const [cost, setCost] = useState('3')

  const result = useMemo(() => calculate(parseFloat(oldW)||0, parseFloat(newW)||0, parseInt(bulbs)||0, parseFloat(hours)||0, parseFloat(rate)||0, parseFloat(cost)||0), [oldW, newW, bulbs, hours, rate, cost])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div><label className="block text-sm font-medium mb-2">Old Bulb (Watts)</label><input type="number" min="0" value={oldW} onChange={(e) => setOldW(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Old Bulb (Watts)" /></div>
        <div><label className="block text-sm font-medium mb-2">LED Bulb (Watts)</label><input type="number" min="0" value={newW} onChange={(e) => setNewW(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="LED Bulb (Watts)" /></div>
        <div><label className="block text-sm font-medium mb-2">Number of Bulbs</label><input type="number" min="1" max="100" value={bulbs} onChange={(e) => setBulbs(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Number of Bulbs" /></div>
        <div><label className="block text-sm font-medium mb-2">Hours/Day</label><input type="number" min="0" max="24" value={hours} onChange={(e) => setHours(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Hours/Day" /></div>
        <div><label className="block text-sm font-medium mb-2">Elec Rate (p/kWh)</label><input type="number" min="0" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Elec Rate (p/kWh)" /></div>
        <div><label className="block text-sm font-medium mb-2">LED Cost Each (£)</label><input type="number" min="0" step="0.01" value={cost} onChange={(e) => setCost(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="LED Cost Each (£)" /></div>
      </div>

      {result.annualSaving > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-green-100 dark:bg-green-950 p-6 text-center">
            <p className="text-sm text-muted-foreground">Annual Saving</p>
            <p className="text-3xl font-bold text-green-700 dark:text-green-400 mt-1">{formatCurrency(result.annualSaving)}</p>
            <p className="text-sm text-muted-foreground mt-1">{result.savedKwh.toFixed(0)} kWh saved &middot; Payback: {result.paybackMonths.toFixed(1)} months</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-destructive/10 p-4 text-center"><p className="text-xs text-muted-foreground">Old Cost/Year</p><p className="text-lg font-bold text-destructive">{formatCurrency(result.oldKwhYear * (parseFloat(rate)/100))}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">LED Cost/Year</p><p className="text-lg font-bold">{formatCurrency(result.newKwhYear * (parseFloat(rate)/100))}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">LED Purchase</p><p className="text-lg font-bold">{formatCurrency(result.totalLedCost)}</p></div>
          </div>
        </div>
      )}
    </div>
  )
}
