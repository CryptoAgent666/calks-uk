import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(propertyPrice: number, deposit: number, mortgageRate: number, mortgageTerm: number, monthlyRent: number, houseGrowth: number, rentGrowth: number, years: number) {
  const mortgage = propertyPrice - deposit
  const monthlyRate = mortgageRate / 100 / 12
  const totalPayments = mortgageTerm * 12
  const monthlyMortgage = mortgage * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / (Math.pow(1 + monthlyRate, totalPayments) - 1)

  let totalBuyingCost = deposit
  let totalRentingCost = 0
  let currentRent = monthlyRent
  let propertyValue = propertyPrice

  for (let y = 1; y <= years; y++) {
    totalBuyingCost += monthlyMortgage * 12
    totalRentingCost += currentRent * 12
    propertyValue *= (1 + houseGrowth / 100)
    currentRent *= (1 + rentGrowth / 100)
  }

  const equity = propertyValue - (years < mortgageTerm ? mortgage * (1 - years / mortgageTerm) : 0) // simplified
  const netBuyingCost = totalBuyingCost - equity

  return {
    monthlyMortgage, totalBuyingCost, totalRentingCost, propertyValue, equity, netBuyingCost,
    buyingBetter: netBuyingCost < totalRentingCost,
    difference: Math.abs(totalRentingCost - netBuyingCost),
  }
}

export default function RentVsBuyCalculator() {
  const [price, setPrice] = useState('300000')
  const [deposit, setDeposit] = useState('30000')
  const [rate, setRate] = useState('4.5')
  const [term, setTerm] = useState('25')
  const [rent, setRent] = useState('1200')
  const [hGrowth, setHGrowth] = useState('3')
  const [rGrowth, setRGrowth] = useState('3')
  const [years, setYears] = useState('10')

  const p = parseFloat(price.replace(/,/g, '')) || 0
  const d = parseFloat(deposit.replace(/,/g, '')) || 0
  const r = parseFloat(rate) || 0
  const t = parseInt(term) || 0
  const re = parseFloat(rent.replace(/,/g, '')) || 0
  const hg = parseFloat(hGrowth) || 0
  const rg = parseFloat(rGrowth) || 0
  const y = parseInt(years) || 0
  const result = useMemo(() => (p > 0 && re > 0 && y > 0) ? calculate(p, d, r, t, re, hg, rg, y) : null, [p, d, r, t, re, hg, rg, y])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Property Price</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Deposit</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={deposit} onChange={(e) => setDeposit(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Mortgage Rate (%)</label><input type="number" min="0" max="15" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Monthly Rent</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={rent} onChange={(e) => setRent(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">House Price Growth (%/yr)</label><input type="number" min="-5" max="15" step="0.5" value={hGrowth} onChange={(e) => setHGrowth(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Rent Growth (%/yr)</label><input type="number" min="0" max="15" step="0.5" value={rGrowth} onChange={(e) => setRGrowth(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">Comparison Period (years)</label><input type="number" min="1" max="40" value={years} onChange={(e) => setYears(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
      </div>

      {result && (
        <div className="space-y-4 animate-fade-in-up">
          <div className={`rounded-2xl p-6 text-center ${result.buyingBetter ? 'bg-green-100 dark:bg-green-950' : 'bg-primary/10'}`}>
            <p className="text-sm text-muted-foreground">{result.buyingBetter ? 'Buying is cheaper' : 'Renting is cheaper'} over {y} years</p>
            <p className="text-3xl font-bold mt-1">{result.buyingBetter ? <span className="text-green-700 dark:text-green-400">Buy</span> : <span className="text-primary">Rent</span>}</p>
            <p className="text-sm text-muted-foreground mt-1">Saving: {formatCurrency(result.difference)}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-border p-4 space-y-2">
              <p className="font-semibold text-sm">Buying</p>
              <p className="text-sm"><span className="text-muted-foreground">Monthly payment:</span> {formatCurrency(result.monthlyMortgage)}</p>
              <p className="text-sm"><span className="text-muted-foreground">Total spent:</span> {formatCurrency(result.totalBuyingCost)}</p>
              <p className="text-sm"><span className="text-muted-foreground">Property value:</span> {formatCurrency(result.propertyValue)}</p>
              <p className="text-sm font-medium"><span className="text-muted-foreground">Net cost:</span> {formatCurrency(result.netBuyingCost)}</p>
            </div>
            <div className="rounded-xl border border-border p-4 space-y-2">
              <p className="font-semibold text-sm">Renting</p>
              <p className="text-sm"><span className="text-muted-foreground">Current rent:</span> {formatCurrency(re)}/month</p>
              <p className="text-sm font-medium"><span className="text-muted-foreground">Total spent:</span> {formatCurrency(result.totalRentingCost)}</p>
              <p className="text-sm"><span className="text-muted-foreground">Equity built:</span> {formatCurrency(0)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
