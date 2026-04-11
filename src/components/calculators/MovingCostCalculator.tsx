import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(propertyPrice: number, isFirstTimeBuyer: boolean, isMortgaged: boolean, mortgageAmount: number) {
  // Solicitor/conveyancer fees
  const solicitorFee = propertyPrice < 250_000 ? 1200 : propertyPrice < 500_000 ? 1500 : 2000
  const searches = 300
  const landRegistry = propertyPrice < 100_000 ? 50 : propertyPrice < 200_000 ? 100 : propertyPrice < 500_000 ? 150 : 300

  // Stamp duty (simplified England)
  let stampDuty = 0
  if (!isFirstTimeBuyer || propertyPrice > 500_000) {
    if (propertyPrice > 125_000) stampDuty += Math.min(propertyPrice - 125_000, 125_000) * 0.02
    if (propertyPrice > 250_000) stampDuty += Math.min(propertyPrice - 250_000, 675_000) * 0.05
    if (propertyPrice > 925_000) stampDuty += Math.min(propertyPrice - 925_000, 575_000) * 0.10
    if (propertyPrice > 1_500_000) stampDuty += (propertyPrice - 1_500_000) * 0.12
  } else if (propertyPrice > 300_000) {
    stampDuty = (propertyPrice - 300_000) * 0.05
  }

  // Survey
  const survey = propertyPrice < 250_000 ? 400 : propertyPrice < 500_000 ? 600 : 1000

  // Mortgage arrangement fee
  const mortgageFee = isMortgaged ? 1000 : 0

  // Removals
  const removals = 800

  // Estate agent (if selling)
  const estateAgent = 0 // buying only

  const total = solicitorFee + searches + landRegistry + stampDuty + survey + mortgageFee + removals

  return { solicitorFee, searches, landRegistry, stampDuty, survey, mortgageFee, removals, total }
}

export default function MovingCostCalculator() {
  const [price, setPrice] = useState('300000')
  const [ftb, setFtb] = useState(false)
  const [mortgaged, setMortgaged] = useState(true)
  const [mortgageAmt, setMortgageAmt] = useState('240000')

  const p = parseFloat(price.replace(/,/g, '')) || 0
  const ma = parseFloat(mortgageAmt.replace(/,/g, '')) || 0
  const result = useMemo(() => calculate(p, ftb, mortgaged, ma), [p, ftb, mortgaged, ma])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Property Price</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div className="space-y-2 pt-8">
          <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={ftb} onChange={(e) => setFtb(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">First-time buyer</span></label>
          <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={mortgaged} onChange={(e) => setMortgaged(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Using a mortgage</span></label>
        </div>
      </div>

      {p > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-destructive/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Estimated Total Moving Costs</p>
            <p className="text-3xl font-bold text-destructive mt-1">{formatCurrency(result.total)}</p>
          </div>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border/50"><td className="py-2.5">Solicitor / Conveyancer</td><td className="text-right tabular-nums">{formatCurrency(result.solicitorFee)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2.5">Searches</td><td className="text-right tabular-nums">{formatCurrency(result.searches)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2.5">Land Registry</td><td className="text-right tabular-nums">{formatCurrency(result.landRegistry)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2.5">Stamp Duty (SDLT)</td><td className="text-right tabular-nums">{formatCurrency(result.stampDuty)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2.5">Survey</td><td className="text-right tabular-nums">{formatCurrency(result.survey)}</td></tr>
              {result.mortgageFee > 0 && <tr className="border-b border-border/50"><td className="py-2.5">Mortgage Arrangement Fee</td><td className="text-right tabular-nums">{formatCurrency(result.mortgageFee)}</td></tr>}
              <tr className="border-b border-border/50"><td className="py-2.5">Removals (estimate)</td><td className="text-right tabular-nums">{formatCurrency(result.removals)}</td></tr>
              <tr className="font-semibold"><td className="py-2.5">Total</td><td className="text-right tabular-nums text-destructive">{formatCurrency(result.total)}</td></tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
