import { useState } from 'react'
import { formatCurrency } from '@/utils'

type CostKey = 'conveyancing' | 'searches' | 'survey' | 'mortgageFee' | 'removals' | 'redirection' | 'other'
type BuyerOptions = { ftb: boolean; additional: boolean; nonResident: boolean }

const COST_ITEMS: { key: CostKey; label: string }[] = [
  { key: 'conveyancing', label: 'Solicitor / conveyancer' },
  { key: 'searches', label: 'Searches' },
  { key: 'survey', label: 'Survey' },
  { key: 'mortgageFee', label: 'Mortgage arrangement fee' },
  { key: 'removals', label: 'Removals' },
  { key: 'redirection', label: 'Royal Mail redirection (12 months)' },
  { key: 'other', label: 'Other costs' },
]

// SDLT residential bands from April 2025 (England & Northern Ireland)
const STANDARD_BANDS = [
  { from: 0, to: 125_000, rate: 0 },
  { from: 125_000, to: 250_000, rate: 0.02 },
  { from: 250_000, to: 925_000, rate: 0.05 },
  { from: 925_000, to: 1_500_000, rate: 0.10 },
  { from: 1_500_000, to: Infinity, rate: 0.12 },
]
const FTB_BANDS = [
  { from: 0, to: 300_000, rate: 0 },
  { from: 300_000, to: 500_000, rate: 0.05 },
]
const ADDITIONAL_SURCHARGE = 0.05 // additional property, 5% since 31 October 2024
const NON_RESIDENT_SURCHARGE = 0.02 // non-UK resident, since 1 April 2021
const SURCHARGE_MIN_PRICE = 40_000 // neither surcharge applies below £40,000

// HM Land Registry Scale 1 fees for a transfer of the whole title, applying through the portal
const LAND_REGISTRY_FEES = [
  { upTo: 80_000, fee: 20 },
  { upTo: 100_000, fee: 40 },
  { upTo: 200_000, fee: 100 },
  { upTo: 500_000, fee: 150 },
  { upTo: 1_000_000, fee: 295 },
  { upTo: Infinity, fee: 500 },
]

const REDIRECTION_12_MONTHS = 95 // Royal Mail, one person, prices from April 2026
const VAT = 0.2

function bandTax(price: number, bands: { from: number; to: number; rate: number }[]) {
  let tax = 0
  for (const band of bands) {
    if (price <= band.from) break
    tax += (Math.min(price, band.to) - band.from) * band.rate
  }
  return tax
}

function stampDuty(price: number, buyer: BuyerOptions) {
  // First-time buyer relief only up to £500,000, and never with an additional property
  const ftbRelief = buyer.ftb && !buyer.additional && price <= 500_000
  let tax = bandTax(price, ftbRelief ? FTB_BANDS : STANDARD_BANDS)
  if (price >= SURCHARGE_MIN_PRICE) {
    if (buyer.additional) tax += price * ADDITIONAL_SURCHARGE
    if (buyer.nonResident) tax += price * NON_RESIDENT_SURCHARGE
  }
  return tax
}

function landRegistryFee(price: number) {
  if (price <= 0) return 0
  return LAND_REGISTRY_FEES.find(b => price <= b.upTo)!.fee
}

// Typical estimates, each of which can be replaced with a real quote
function defaultCosts(price: number, mortgaged: boolean): Record<CostKey, number> {
  return {
    conveyancing: price < 250_000 ? 1200 : price < 500_000 ? 1500 : 2000,
    searches: 300,
    survey: price < 250_000 ? 400 : price < 500_000 ? 600 : 1000,
    mortgageFee: mortgaged ? 999 : 0,
    removals: 800,
    redirection: REDIRECTION_12_MONTHS,
    other: 0,
  }
}

function calculate(propertyPrice: number, buyer: BuyerOptions, costs: Record<CostKey, number>, salePrice = 0, agentPct = 0) {
  const stampDutyTax = stampDuty(propertyPrice, buyer)
  const landRegistry = landRegistryFee(propertyPrice)
  const estateAgent = salePrice * (agentPct / 100) * (1 + VAT)
  const itemsTotal = COST_ITEMS.reduce((sum, item) => sum + (costs[item.key] || 0), 0)
  const total = itemsTotal + stampDutyTax + landRegistry + estateAgent
  return { stampDuty: stampDutyTax, landRegistry, estateAgent, itemsTotal, total }
}

const num = (v: string) => parseFloat(v.replace(/,/g, '')) || 0

export default function MovingCostCalculator() {
  const [price, setPrice] = useState('300000')
  const [ftb, setFtb] = useState(false)
  const [additional, setAdditional] = useState(false)
  const [nonResident, setNonResident] = useState(false)
  const [mortgaged, setMortgaged] = useState(true)
  const [selling, setSelling] = useState(false)
  const [salePrice, setSalePrice] = useState('250000')
  const [agentPct, setAgentPct] = useState('1')
  const [overrides, setOverrides] = useState<Partial<Record<CostKey, string>>>({})

  const p = num(price)
  const defaults = defaultCosts(p, mortgaged)
  const costs = Object.fromEntries(COST_ITEMS.map(({ key }) => [key, key === 'mortgageFee' && !mortgaged ? 0 : overrides[key] !== undefined ? num(overrides[key] as string) : defaults[key]])) as Record<CostKey, number>
  const sp = selling && !ftb ? num(salePrice) : 0
  const ap = num(agentPct)
  const result = calculate(p, { ftb, additional, nonResident }, costs, sp, ap)
  const visibleItems = COST_ITEMS.filter(item => item.key !== 'mortgageFee' || mortgaged)

  const toggleFtb = (checked: boolean) => { setFtb(checked); if (checked) setAdditional(false) }
  const toggleAdditional = (checked: boolean) => { setAdditional(checked); if (checked) setFtb(false) }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Property Price</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Property Price" /></div></div>
        <div className="space-y-2 sm:pt-8">
          <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={ftb} onChange={(e) => toggleFtb(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">First-time buyer</span></label>
          <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={additional} onChange={(e) => toggleAdditional(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Additional property (+5% Stamp Duty)</span></label>
          <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={nonResident} onChange={(e) => setNonResident(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Non-UK resident (+2% Stamp Duty)</span></label>
          <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={mortgaged} onChange={(e) => setMortgaged(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Using a mortgage</span></label>
          {!ftb && <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={selling} onChange={(e) => setSelling(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Selling a home through an estate agent</span></label>}
        </div>
      </div>

      {selling && !ftb && (
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-2">Sale Price</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Sale Price" /></div></div>
          <div><label className="block text-sm font-medium mb-2">Agent Fee (% + VAT)</label><input type="number" min="0" max="5" step="0.05" value={agentPct} onChange={(e) => setAgentPct(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Agent Fee (% + VAT)" /></div>
        </div>
      )}

      {p > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-destructive/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Estimated Total Moving Costs</p>
            <p className="text-3xl font-bold text-destructive mt-1">{formatCurrency(result.total)}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Estimates are typical figures. Replace any of them with a real quote.</p>
            {Object.keys(overrides).length > 0 && <button onClick={() => setOverrides({})} className="px-3 py-1.5 rounded-lg bg-muted hover:bg-accent text-xs font-medium">Reset estimates</button>}
          </div>
          <table className="w-full text-sm">
            <tbody>
              {visibleItems.map(item => (
                <tr key={item.key} className="border-b border-border/50">
                  <td className="py-2"><label htmlFor={`moving-${item.key}`}>{item.label}</label></td>
                  <td className="py-1.5 text-right"><div className="relative inline-block w-32"><span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">£</span><input id={`moving-${item.key}`} type="number" min="0" value={overrides[item.key] ?? String(defaults[item.key])} onChange={(e) => setOverrides({ ...overrides, [item.key]: e.target.value })} className="w-full rounded-lg border border-input bg-background pl-6 pr-2 py-2 text-sm text-right tabular-nums font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></td>
                </tr>
              ))}
              <tr className="border-b border-border/50"><td className="py-2.5">Land Registry fee (portal)</td><td className="text-right tabular-nums pr-2">{formatCurrency(result.landRegistry)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2.5">Stamp Duty (SDLT)</td><td className="text-right tabular-nums pr-2">{formatCurrency(result.stampDuty)}</td></tr>
              {result.estateAgent > 0 && <tr className="border-b border-border/50"><td className="py-2.5">Estate agent ({ap}% + VAT on {formatCurrency(sp)})</td><td className="text-right tabular-nums pr-2">{formatCurrency(result.estateAgent)}</td></tr>}
              <tr className="font-semibold"><td className="py-2.5">Total</td><td className="text-right tabular-nums text-destructive pr-2">{formatCurrency(result.total)}</td></tr>
            </tbody>
          </table>
          <p className="text-xs text-muted-foreground">Stamp Duty uses the England and Northern Ireland rates; Scotland (LBTT) and Wales (LTT) differ. The surcharges do not apply below £40,000. The Land Registry fee is the HM Land Registry portal fee for buying a whole registered title. Redirection is the Royal Mail price for one person from April 2026.</p>
        </div>
      )}
    </div>
  )
}
