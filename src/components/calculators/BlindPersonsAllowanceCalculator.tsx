import { useState, useMemo } from 'react'
import { formatCurrency, ukIncomeTax, ukPersonalAllowance } from '@/utils'

const BPA = 3_250 // 2026/27 (gov.uk; 2025/26 was £3,130)
const PA = 12_570

type Region = 'ruk' | 'scotland'

// Scottish 2026/27 bands as upper limits of TAXABLE income (after allowances):
// starter 19% to £3,967, basic 20% to £16,956, intermediate 21% to £31,092,
// higher 42% to £62,430, advanced 45% to £125,140, top 48% above.
const SCOT_BANDS = [
  { rate: 0.19, upTo: 3_967 },
  { rate: 0.20, upTo: 16_956 },
  { rate: 0.21, upTo: 31_092 },
  { rate: 0.42, upTo: 62_430 },
  { rate: 0.45, upTo: 125_140 },
  { rate: 0.48, upTo: Infinity },
]

function scottishIncomeTax(income: number, allowance: number): number {
  const taxable = Math.max(0, income - allowance)
  let tax = 0
  let lower = 0
  for (const b of SCOT_BANDS) {
    if (taxable <= lower) break
    tax += (Math.min(taxable, b.upTo) - lower) * b.rate
    lower = b.upTo
  }
  return tax
}

function calculate(income: number, isRegistered: boolean, region: Region = 'ruk') {
  // Blind Person's Allowance is added to the Personal Allowance, so it lifts the
  // whole band structure by £3,250 — the 40% rate starts at £53,520 instead of
  // £50,270. It does NOT shrink the £37,700 basic-rate band, which is what
  // capping the 20% band at (£50,270 − allowance) used to do: that handed back
  // only 20% of the allowance, halving the saving a higher-rate taxpayer sees.
  // The BPA itself is not income-restricted; only the Personal Allowance tapers.
  // Scottish bands also sit on taxable income, so the same shift applies there.
  const basePA = ukPersonalAllowance(income)
  const totalAllowance = basePA + (isRegistered ? BPA : 0)
  const taxFn = region === 'scotland' ? scottishIncomeTax : ukIncomeTax

  const taxWithBPA = taxFn(income, totalAllowance)
  const taxWithout = taxFn(income, basePA)

  const saving = taxWithout - taxWithBPA

  return { totalAllowance, bpa: BPA, saving, taxWithBPA, taxWithout }
}

export default function BlindPersonsAllowanceCalculator() {
  const [income, setIncome] = useState('30000')
  const [registered, setRegistered] = useState(true)
  const [region, setRegion] = useState<Region>('ruk')

  const i = parseFloat(income.replace(/,/g,'')) || 0
  const result = useMemo(() => calculate(i, registered, region), [i, registered, region])

  return (
    <div className="space-y-6">
      <div><label className="block text-sm font-medium mb-2">Annual Income</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={income} onChange={(e) => setIncome(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Annual Income" /></div></div>
      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={registered} onChange={(e) => setRegistered(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Registered blind or severely sight impaired (Scotland and NI: unable to do work for which eyesight is essential)</span></label>
      <div>
        <label className="block text-sm font-medium mb-2">Where do you pay tax?</label>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setRegion('ruk')} aria-pressed={region === 'ruk'} className={`px-3 py-3 rounded-xl text-sm font-medium border ${region === 'ruk' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border'}`}>England, Wales &amp; NI</button>
          <button onClick={() => setRegion('scotland')} aria-pressed={region === 'scotland'} className={`px-3 py-3 rounded-xl text-sm font-medium border ${region === 'scotland' ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border'}`}>Scotland</button>
        </div>
      </div>

      {i > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-green-100 dark:bg-green-950 p-6 text-center">
            <p className="text-sm text-muted-foreground">Annual Tax Saving</p>
            <p className="text-3xl font-bold text-green-700 dark:text-green-400 mt-1">{formatCurrency(result.saving)}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Total Allowance</p><p className="text-lg font-bold">{formatCurrency(result.totalAllowance)}</p><p className="text-xs text-muted-foreground">PA £{PA.toLocaleString()} + BPA £{BPA.toLocaleString()}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Tax With BPA</p><p className="text-lg font-bold">{formatCurrency(result.taxWithBPA)}</p><p className="text-xs text-muted-foreground">vs {formatCurrency(result.taxWithout)} without</p></div>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>Blind Person's Allowance (£{BPA.toLocaleString()}) is added to your Personal Allowance. In England and Wales you must be registered as blind or severely sight impaired with your local council. In Scotland and Northern Ireland you qualify if you cannot do work for which eyesight is essential. Unused BPA can be transferred to a spouse.</p>
          </div>
        </div>
      )}
    </div>
  )
}
