import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(monthlyAmount: number, years: number, growthRate: number, taxBand: string) {
  const monthlyGrowth = growthRate / 100 / 12
  const taxRate = taxBand === 'higher' ? 0.40 : taxBand === 'additional' ? 0.45 : 0.20

  // PENSION: gross contribution (tax relief added)
  const pensionGross = monthlyAmount / (1 - taxRate) // effectively more goes in
  // Actually: you pay net, provider claims 20%, you claim extra if higher/additional
  const basicRelief = monthlyAmount * 0.25 // provider adds 25% (=20% of gross)
  const pensionMonthly = monthlyAmount + basicRelief
  const extraRelief = taxRate > 0.20 ? monthlyAmount * ((taxRate - 0.20) / (1 - taxRate)) * (1 - 0.20) : 0

  let pensionPot = 0
  let isaPot = 0
  for (let m = 0; m < years * 12; m++) {
    pensionPot = pensionPot * (1 + monthlyGrowth) + pensionMonthly
    isaPot = isaPot * (1 + monthlyGrowth) + monthlyAmount
  }

  // Pension: 25% tax-free, rest taxed at marginal rate in retirement
  const pensionLumpSum = pensionPot * 0.25
  const pensionTaxable = pensionPot * 0.75
  const pensionTax = pensionTaxable * 0.20 // assume basic rate in retirement
  const pensionNet = pensionPot - pensionTax + extraRelief * years * 12

  // ISA: all tax-free
  const isaNet = isaPot

  return { pensionPot, pensionLumpSum, pensionTax, pensionNet, isaPot, isaNet, extraRelief: extraRelief * years * 12, pensionAdvantage: pensionNet - isaNet }
}

export default function PensionVsIsaCalculator() {
  const [amount, setAmount] = useState('500')
  const [years, setYears] = useState('20')
  const [growth, setGrowth] = useState('5')
  const [band, setBand] = useState('basic')

  const a = parseFloat(amount.replace(/,/g,'')) || 0
  const y = parseInt(years) || 0
  const g = parseFloat(growth) || 0
  const result = useMemo(() => calculate(a, y, g, band), [a, y, g, band])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Monthly Amount (net)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Monthly Amount (net)" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Years</label><input type="number" min="1" max="40" value={years} onChange={(e) => setYears(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Years" /></div>
        <div><label className="block text-sm font-medium mb-2">Growth (%)</label><input type="number" min="0" max="12" step="0.5" value={growth} onChange={(e) => setGrowth(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Growth (%)" /></div>
        <div><label className="block text-sm font-medium mb-2">Tax Band (now)</label><select value={band} onChange={(e) => setBand(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Tax Band (now)"><option value="basic">Basic (20%)</option><option value="higher">Higher (40%)</option><option value="additional">Additional (45%)</option></select></div>
      </div>

      {a > 0 && y > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 gap-4">
            <div className={`rounded-2xl p-6 text-center ${result.pensionAdvantage > 0 ? 'bg-green-100 dark:bg-green-950 border-2 border-green-300 dark:border-green-800' : 'border border-border'}`}>
              <p className="text-sm font-medium">Pension</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(result.pensionNet)}</p>
              <p className="text-xs text-muted-foreground mt-1">Pot: {formatCurrency(result.pensionPot)}</p>
              {result.pensionAdvantage > 0 && <span className="inline-block mt-2 text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">Better by {formatCurrency(result.pensionAdvantage)}</span>}
            </div>
            <div className={`rounded-2xl p-6 text-center ${result.pensionAdvantage <= 0 ? 'bg-green-100 dark:bg-green-950 border-2 border-green-300 dark:border-green-800' : 'border border-border'}`}>
              <p className="text-sm font-medium">ISA</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(result.isaNet)}</p>
              <p className="text-xs text-muted-foreground mt-1">All tax-free</p>
              {result.pensionAdvantage <= 0 && <span className="inline-block mt-2 text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">Better by {formatCurrency(-result.pensionAdvantage)}</span>}
            </div>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>Pension: tax relief boosts contributions, but withdrawals are taxed (except 25% lump sum). ISA: no tax relief going in, but all withdrawals are tax-free. Pension usually wins for higher-rate taxpayers who'll be basic rate in retirement.</p>
          </div>
        </div>
      )}
    </div>
  )
}
