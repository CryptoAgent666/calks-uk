import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

type MatterType = 'conveyancing_buy' | 'conveyancing_sell' | 'divorce' | 'will' | 'probate' | 'employment'

// Solicitor fees here are the site's rough estimates, not official or survey figures.
// Conveyancing fees come from conveyancingFee() below, so buying and selling share one scale.
const MATTERS: Record<MatterType, { name: string; baseFee: number; description: string }> = {
  conveyancing_buy: { name: 'Conveyancing (Buying)', baseFee: 0, description: 'Legal fees for purchasing a property' },
  conveyancing_sell: { name: 'Conveyancing (Selling)', baseFee: 0, description: 'Legal fees for selling a property' },
  divorce: { name: 'Divorce (uncontested)', baseFee: 1000, description: 'No-fault divorce proceedings' },
  will: { name: 'Simple Will', baseFee: 250, description: 'Standard single will' },
  probate: { name: 'Probate Application', baseFee: 2500, description: 'Flat estimate for a simple estate: grant of probate + estate administration' },
  employment: { name: 'Employment Tribunal', baseFee: 3000, description: 'Representation at employment tribunal' },
}

const DIVORCE_COURT_FEE = 628 // gov.uk/divorce
const PROBATE_FEE = 526 // estates over £5,000 (gov.uk/applying-for-probate/fees)
const PROBATE_FEE_THRESHOLD = 5_000
const SEARCHES_ESTIMATE = 300 // rough estimate
const BANK_TRANSFER_ESTIMATE = 40 // rough estimate
const SALE_DISBURSEMENTS_ESTIMATE = 100 // rough estimate
const TRIBUNAL_EXPENSES_ESTIMATE = 200 // rough allowance; a tribunal claim itself carries no fee (gov.uk/employment-tribunals)

function conveyancingFee(propertyValue: number) {
  if (propertyValue > 500_000) return 2000
  if (propertyValue > 300_000) return 1700
  if (propertyValue > 200_000) return 1500
  return 1200
}

// HM Land Registry Scale 1, portal fee for a whole-title transfer (from 9 Dec 2024)
function landRegistryFee(price: number) {
  if (price <= 80_000) return 20
  if (price <= 100_000) return 40
  if (price <= 200_000) return 100
  if (price <= 500_000) return 150
  if (price <= 1_000_000) return 295
  return 500
}

function getDisbursements(matter: MatterType, propertyValue: number, estateValue: number) {
  switch (matter) {
    case 'conveyancing_buy':
      return [
        { label: 'Land Registry fee (online)', amount: landRegistryFee(propertyValue) },
        { label: 'Searches (rough estimate)', amount: SEARCHES_ESTIMATE },
        { label: 'Bank transfer fee (rough estimate)', amount: BANK_TRANSFER_ESTIMATE },
      ]
    case 'conveyancing_sell':
      return [{ label: 'Title copies and bank transfer (rough estimate)', amount: SALE_DISBURSEMENTS_ESTIMATE }]
    case 'divorce':
      return [{ label: 'Court fee', amount: DIVORCE_COURT_FEE }]
    case 'probate':
      return [{ label: 'Probate application fee', amount: estateValue > PROBATE_FEE_THRESHOLD ? PROBATE_FEE : 0 }]
    case 'employment':
      return [{ label: 'Witness and other expenses (rough allowance)', amount: TRIBUNAL_EXPENSES_ESTIMATE }]
    default:
      return []
  }
}

function calculate(matter: MatterType, propertyValue: number, estateValue: number) {
  const info = MATTERS[matter]
  const fee = matter.startsWith('conveyancing') ? conveyancingFee(propertyValue) : info.baseFee
  const vat = fee * 0.20 // VAT on the solicitor's fee only, not on the disbursements listed
  const items = getDisbursements(matter, propertyValue, estateValue)
  const disbursements = items.reduce((sum, item) => sum + item.amount, 0)
  const total = fee + vat + disbursements

  return { fee, vat, items, disbursements, total, info }
}

const NOTES: Record<MatterType, string> = {
  conveyancing_buy: 'Solicitor fee, searches and bank transfer fee are rough estimates, not official or survey figures. The Land Registry fee is the HM Land Registry online rate for a transfer of a whole registered title in England and Wales. Stamp Duty is separate.',
  conveyancing_sell: 'Solicitor fee and disbursements are rough estimates, not official or survey figures. The same fee scale is used for buying and selling; selling has fewer disbursements.',
  divorce: 'Solicitor fee is a rough estimate, not an official or survey figure. The court fee is the GOV.UK divorce application fee.',
  will: 'Solicitor fee is a rough estimate, not an official or survey figure.',
  probate: 'The solicitor fee is one flat rough estimate for a simple estate and does not rise with the value you enter. Some firms charge a percentage of the estate instead, which can cost far more on a large estate. The estate value only decides the GOV.UK application fee: £526 over £5,000 and nothing at or below it.',
  employment: 'Solicitor fee and expenses are rough estimates, not official or survey figures. There is no fee to make an employment tribunal claim.',
}

export default function SolicitorFeeCalculator() {
  const [matter, setMatter] = useState<MatterType>('conveyancing_buy')
  const [value, setValue] = useState('300000')
  const [estate, setEstate] = useState('300000')

  const v = parseFloat(value.replace(/,/g,'')) || 0
  const e = parseFloat(estate.replace(/,/g,'')) || 0
  const result = useMemo(() => calculate(matter, v, e), [matter, v, e])
  const isConveyancing = matter.startsWith('conveyancing')
  const isProbate = matter === 'probate'
  const ready = isConveyancing ? v > 0 : isProbate ? e > 0 : true

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Legal Matter</label><select value={matter} onChange={(ev) => setMatter(ev.target.value as MatterType)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Legal Matter">{Object.entries(MATTERS).map(([k,m]) => <option key={k} value={k}>{m.name}</option>)}</select></div>
        {isConveyancing && <div><label className="block text-sm font-medium mb-2">Property Value</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={value} onChange={(ev) => setValue(ev.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Property Value" /></div></div>}
        {isProbate && <div><label className="block text-sm font-medium mb-2">Estate Value</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={estate} onChange={(ev) => setEstate(ev.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Estate Value" /></div></div>}
      </div>

      {!ready && <p className="text-sm text-muted-foreground">Enter a value above to see the estimate.</p>}
      {ready && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">{result.info.name}</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.total)}</p>
            <p className="text-sm text-muted-foreground mt-1">{result.info.description}</p>
          </div>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border/50"><td className="py-2">Solicitor Fee (rough estimate)</td><td className="text-right tabular-nums">{formatCurrency(result.fee)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">VAT (20%)</td><td className="text-right tabular-nums">{formatCurrency(result.vat)}</td></tr>
              {result.items.map((item) => <tr key={item.label} className="border-b border-border/50"><td className="py-2">{item.label}</td><td className="text-right tabular-nums">{formatCurrency(item.amount)}</td></tr>)}
              <tr className="font-semibold"><td className="py-2">Total</td><td className="text-right tabular-nums text-primary">{formatCurrency(result.total)}</td></tr>
            </tbody>
          </table>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>{NOTES[matter]} Actual costs vary by location, complexity and firm, so get quotes from several solicitors.</p>
          </div>
        </div>
      )}
    </div>
  )
}
