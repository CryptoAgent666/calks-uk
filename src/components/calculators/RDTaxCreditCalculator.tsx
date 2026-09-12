import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// R&D relief for accounting periods starting on or after 1 April 2024: the merged
// expenditure credit scheme, plus Enhanced R&D Intensive Support (ERIS) for loss-making
// SMEs whose R&D is at least 30% of total expenditure.
const RDEC_RATE = 0.20          // taxable expenditure credit on qualifying spend
const CORP_TAX_RATE = 0.25      // main rate on a profit-making company's credit -> 15p per £1
const NOTIONAL_TAX_RATE = 0.19  // small profits rate applied to a loss-maker's credit -> 16.2p per £1
const ERIS_ADDITIONAL = 0.86    // extra deduction, so the surrenderable loss is up to 186% of costs
const ERIS_CREDIT_RATE = 0.145  // payable credit on the surrendered loss -> about 27p per £1

type CompanyType = 'profitable' | 'loss_making' | 'eris'

function calculate(qualifyingSpend: number, companyType: CompanyType) {
  if (companyType === 'eris') {
    const surrenderableLoss = qualifyingSpend * (1 + ERIS_ADDITIONAL)
    const netBenefit = surrenderableLoss * ERIS_CREDIT_RATE
    return { netBenefit, rate: (netBenefit / qualifyingSpend) * 100, method: `ERIS payable credit: 14.5% of up to ${formatCurrency(surrenderableLoss)} of surrendered loss` }
  }

  const credit = qualifyingSpend * RDEC_RATE
  const taxOnCredit = credit * (companyType === 'profitable' ? CORP_TAX_RATE : NOTIONAL_TAX_RATE)
  const netBenefit = credit - taxOnCredit
  const method = companyType === 'profitable'
    ? `Merged scheme credit of ${formatCurrency(credit)}, less 25% tax`
    : `Merged scheme credit of ${formatCurrency(credit)}, less 19% notional tax, paid in cash`
  return { netBenefit, rate: (netBenefit / qualifyingSpend) * 100, method }
}

export default function RDTaxCreditCalculator() {
  const [spend, setSpend] = useState('100000')
  const [type, setType] = useState<CompanyType>('profitable')

  const s = parseFloat(spend.replace(/,/g, '')) || 0
  const result = useMemo(() => calculate(s, type), [s, type])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Qualifying R&D Spend</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={spend} onChange={(e) => setSpend(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Qualifying R&D Spend" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Company Status</label><select value={type} onChange={(e) => setType(e.target.value as CompanyType)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Company Status"><option value="profitable">Profitable</option><option value="loss_making">Loss-Making</option><option value="eris">Loss-Making, R&D-Intensive (ERIS)</option></select></div>
      </div>

      {s > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-green-100 dark:bg-green-950 p-6 text-center">
            <p className="text-sm text-muted-foreground">Estimated R&D Tax Benefit</p>
            <p className="text-3xl font-bold text-green-700 dark:text-green-400 mt-1">{formatCurrency(result.netBenefit)}</p>
            <p className="text-sm text-muted-foreground mt-1">{result.method} ({result.rate.toFixed(1)}% of spend)</p>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">How it works (accounting periods from 1 April 2024):</p>
            <p className="mt-1">Merged scheme: a {RDEC_RATE * 100}% expenditure credit on qualifying spend. The credit is taxable, so a profit-making company keeps 15p per £1 at the 25% main rate, and a loss-maker receives 16.2p per £1 in cash after 19% notional tax.</p>
            <p>ERIS: loss-making SMEs spending at least 30% of total expenditure on R&D can surrender a loss of up to 186% of qualifying costs for a 14.5% payable credit, about 27p per £1. This assumes the trading loss is at least that large.</p>
            <p className="mt-1">Payable credits are capped at £20,000 plus 300% of the company's PAYE and NIC liabilities. Qualifying costs: staff, subcontractors, consumables, software, cloud computing used for R&D.</p>
          </div>
        </div>
      )}
    </div>
  )
}
