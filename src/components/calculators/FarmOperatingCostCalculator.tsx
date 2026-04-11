import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(hectares: number, rent: number, seed: number, fertiliser: number, spray: number, fuel: number, labour: number, machinery: number, insurance: number, other: number, yieldPerHa: number, pricePerTonne: number) {
  const totalCosts = (rent + seed + fertiliser + spray + fuel + labour + machinery + insurance + other) * hectares
  const totalYield = hectares * yieldPerHa
  const totalRevenue = totalYield * pricePerTonne
  const profit = totalRevenue - totalCosts
  const costPerHa = hectares > 0 ? totalCosts / hectares : 0
  const costPerTonne = totalYield > 0 ? totalCosts / totalYield : 0
  const breakEvenPrice = totalYield > 0 ? totalCosts / totalYield : 0

  return { totalCosts, totalYield, totalRevenue, profit, costPerHa, costPerTonne, breakEvenPrice }
}

export default function FarmOperatingCostCalculator() {
  const [ha, setHa] = useState('100')
  const [rent, setRent] = useState('200')
  const [seed, setSeed] = useState('80')
  const [fert, setFert] = useState('150')
  const [spray, setSpray] = useState('100')
  const [fuel, setFuel] = useState('60')
  const [labour, setLabour] = useState('50')
  const [machinery, setMachinery] = useState('120')
  const [ins, setIns] = useState('30')
  const [other, setOther] = useState('40')
  const [yld, setYld] = useState('8')
  const [price, setPrice] = useState('180')

  const h = parseFloat(ha) || 0
  const result = useMemo(() => calculate(h, parseFloat(rent)||0, parseFloat(seed)||0, parseFloat(fert)||0, parseFloat(spray)||0, parseFloat(fuel)||0, parseFloat(labour)||0, parseFloat(machinery)||0, parseFloat(ins)||0, parseFloat(other)||0, parseFloat(yld)||0, parseFloat(price)||0), [ha,rent,seed,fert,spray,fuel,labour,machinery,ins,other,yld,price])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Hectares</label><input type="number" min="1" value={ha} onChange={(e) => setHa(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Yield (t/ha)</label><input type="number" min="0" step="0.1" value={yld} onChange={(e) => setYld(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Price (£/tonne)</label><input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
      </div>
      <h3 className="text-sm font-semibold">Costs per Hectare (£/ha)</h3>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[{l:'Rent',v:rent,s:setRent},{l:'Seed',v:seed,s:setSeed},{l:'Fertiliser',v:fert,s:setFert},{l:'Sprays',v:spray,s:setSpray},{l:'Fuel',v:fuel,s:setFuel},{l:'Labour',v:labour,s:setLabour},{l:'Machinery',v:machinery,s:setMachinery},{l:'Insurance',v:ins,s:setIns},{l:'Other',v:other,s:setOther}].map(i => (
          <div key={i.l}><label className="block text-xs text-muted-foreground mb-1">{i.l}</label><input type="number" min="0" value={i.v} onChange={(e) => i.s(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        ))}
      </div>

      {h > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className={`rounded-2xl p-6 text-center ${result.profit >= 0 ? 'bg-green-100 dark:bg-green-950' : 'bg-destructive/10'}`}>
            <p className="text-sm text-muted-foreground">{result.profit >= 0 ? 'Estimated Profit' : 'Estimated Loss'}</p>
            <p className={`text-3xl font-bold mt-1 ${result.profit >= 0 ? 'text-green-700 dark:text-green-400' : 'text-destructive'}`}>{formatCurrency(result.profit)}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Total Costs</p><p className="text-lg font-bold">{formatCurrency(result.totalCosts)}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Revenue</p><p className="text-lg font-bold">{formatCurrency(result.totalRevenue)}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Cost/Tonne</p><p className="text-lg font-bold">{formatCurrency(result.costPerTonne)}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Break-Even</p><p className="text-lg font-bold">{formatCurrency(result.breakEvenPrice)}/t</p></div>
          </div>
        </div>
      )}
    </div>
  )
}
