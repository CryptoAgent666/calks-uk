import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent } from '@/utils'

// R&D Tax Credits 2025/26 (merged scheme)
const ENHANCEMENT_RATE = 0.86 // 86% for loss-making, above-the-line for profitable
const ABOVE_LINE_RATE = 0.20 // 20% of qualifying expenditure
const CORP_TAX_RATE = 0.25

type CompanyType = 'profitable' | 'loss_making'

function calculate(qualifyingSpend: number, companyType: CompanyType, profit: number) {
  if (companyType === 'profitable') {
    // Above the line: 20% notional tax deduction
    const credit = qualifyingSpend * ABOVE_LINE_RATE
    const taxSaving = credit * (1 - CORP_TAX_RATE) // net of tax on the credit
    return { credit, taxSaving, method: 'RDEC (Above the Line)', rate: ABOVE_LINE_RATE * 100, netBenefit: taxSaving }
  }

  // Loss-making: enhanced deduction
  const enhancedDeduction = qualifyingSpend * ENHANCEMENT_RATE
  const totalDeduction = qualifyingSpend + enhancedDeduction
  const taxCredit = totalDeduction * CORP_TAX_RATE // surrendered for cash
  const cashCredit = Math.min(taxCredit, qualifyingSpend * 0.186) // 18.6% effective rate cap

  return { enhancedDeduction, totalDeduction, taxCredit: cashCredit, method: 'Enhanced Deduction', rate: ENHANCEMENT_RATE * 100, netBenefit: cashCredit }
}

export default function RDTaxCreditCalculator() {
  const [spend, setSpend] = useState('100000')
  const [type, setType] = useState<CompanyType>('profitable')
  const [profit, setProfit] = useState('200000')

  const s = parseFloat(spend.replace(/,/g, '')) || 0
  const p = parseFloat(profit.replace(/,/g, '')) || 0
  const result = useMemo(() => calculate(s, type, p), [s, type, p])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Qualifying R&D Spend</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={spend} onChange={(e) => setSpend(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Company Status</label><select value={type} onChange={(e) => setType(e.target.value as CompanyType)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"><option value="profitable">Profitable</option><option value="loss_making">Loss-Making</option></select></div>
      </div>

      {s > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-green-100 dark:bg-green-950 p-6 text-center">
            <p className="text-sm text-muted-foreground">Estimated R&D Tax Benefit</p>
            <p className="text-3xl font-bold text-green-700 dark:text-green-400 mt-1">{formatCurrency(result.netBenefit)}</p>
            <p className="text-sm text-muted-foreground mt-1">{result.method}</p>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">How it works (merged scheme from April 2024):</p>
            <p className="mt-1">Profitable companies: {ABOVE_LINE_RATE * 100}% RDEC credit on qualifying R&D spend, taxed at corporation tax rate.</p>
            <p>Loss-making companies: {ENHANCEMENT_RATE * 100}% enhanced deduction, can be surrendered for a cash credit.</p>
            <p className="mt-1">Qualifying costs: staff, subcontractors, consumables, software, cloud computing used for R&D.</p>
          </div>
        </div>
      )}
    </div>
  )
}
