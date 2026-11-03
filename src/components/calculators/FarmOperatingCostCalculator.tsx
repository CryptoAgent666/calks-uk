import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(hectares: number, rent: number, seed: number, fertiliser: number, spray: number, fuel: number, labour: number, machinery: number, insurance: number, other: number, yieldPerHa: number, pricePerTonne: number) {
  const fullCostPerHa = rent + seed + fertiliser + spray + fuel + labour + machinery + insurance + other
  const variableCostPerHa = seed + fertiliser + spray
  const totalCosts = fullCostPerHa * hectares
  const totalYield = hectares * yieldPerHa
  const totalRevenue = totalYield * pricePerTonne
  const profit = totalRevenue - totalCosts
  // With no crop there is no cost per tonne to show, so these stay null rather than a misleading £0
  const fullCostPerTonne = totalYield > 0 ? totalCosts / totalYield : null
  const variableCostPerTonne = totalYield > 0 ? (variableCostPerHa * hectares) / totalYield : null

  return { totalCosts, totalYield, totalRevenue, profit, fullCostPerHa, variableCostPerHa, fullCostPerTonne, variableCostPerTonne }
}

export default function FarmOperatingCostCalculator() {
  const [ha, setHa] = useState('100')
  const [rent, setRent] = useState('200')
  const [seed, setSeed] = useState('70')
  const [fert, setFert] = useState('280')
  const [spray, setSpray] = useState('200')
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
        <div><label className="block text-sm font-medium mb-2">Hectares</label><input type="number" min="1" value={ha} onChange={(e) => setHa(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Hectares" /></div>
        <div><label className="block text-sm font-medium mb-2">Yield (t/ha)</label><input type="number" min="0" step="0.1" value={yld} onChange={(e) => setYld(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Yield (t/ha)" /></div>
        <div><label className="block text-sm font-medium mb-2">Price (£/tonne)</label><input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Price (£/tonne)" /></div>
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
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Full Cost/Tonne (Break-Even Price)</p><p className="text-lg font-bold">{result.fullCostPerTonne === null ? 'n/a' : `${formatCurrency(result.fullCostPerTonne)}/t`}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Seed, Fertiliser and Sprays/Tonne</p><p className="text-lg font-bold">{result.variableCostPerTonne === null ? 'n/a' : `${formatCurrency(result.variableCostPerTonne)}/t`}</p></div>
          </div>
          {result.fullCostPerTonne === null && <div className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive">Enter a yield above zero to see costs per tonne and a break-even price.</div>}
          <p className="text-xs text-muted-foreground">The figures filled in are illustrative. They exclude unpaid labour and overheads unless you add them under Labour and Other. For context, Defra's Farm Business Survey put the average winter wheat production cost at about £295 a tonne against a selling price of about £189 for the 2024 harvest, on its own enterprise costing.</p>
        </div>
      )}
    </div>
  )
}
