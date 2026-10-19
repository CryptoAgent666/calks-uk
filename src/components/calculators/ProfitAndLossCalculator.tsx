import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent, ukCorporationTax } from '@/utils'

// Defined at module level: a component declared inside render is remounted on every
// keystroke, which drops focus after each digit.
const Input = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <div><label className="block text-xs text-muted-foreground mb-1">{label}</label><div className="relative"><span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">£</span><input type="text" inputMode="numeric" value={value} onChange={(e) => onChange(e.target.value)} aria-label={label} className="w-full rounded-lg border border-input bg-background pl-6 pr-2 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
)

// Costs are entered as positive amounts; a stray minus sign is ignored rather than
// turning a cost into income (and printing as "--£5,000").
const parseAmount = (v: string) => Math.max(0, parseFloat(v.replace(/[,£\s]/g, '')) || 0)

// A deduction line in the statement (a plain helper, not a component).
const costRow = (label: string, value: number) => (
  <tr key={label} className="border-b border-border/50"><td className="py-2 text-destructive">{label}</td><td className="text-right tabular-nums text-destructive">{value > 0 ? `-${formatCurrency(value)}` : formatCurrency(0)}</td></tr>
)

export default function ProfitAndLossCalculator() {
  const [revenue, setRevenue] = useState('120000')
  const [cogs, setCogs] = useState('45000')
  const [wages, setWages] = useState('35000')
  const [rent, setRent] = useState('12000')
  const [utilities, setUtilities] = useState('3000')
  const [marketing, setMarketing] = useState('5000')
  const [insurance, setInsurance] = useState('2000')
  const [other, setOther] = useState('5000')
  const [interest, setInterest] = useState('0')
  const [isCompany, setIsCompany] = useState(true)

  const r = parseAmount(revenue)
  const c = parseAmount(cogs)
  const w = parseAmount(wages)
  const re = parseAmount(rent)
  const u = parseAmount(utilities)
  const m = parseAmount(marketing)
  const i = parseAmount(insurance)
  const o = parseAmount(other)
  const intPaid = parseAmount(interest)

  const result = useMemo(() => {
    const grossProfit = r - c
    const totalOverheads = w + re + u + m + i + o
    const operatingProfit = grossProfit - totalOverheads
    const profitBeforeTax = operatingProfit - intPaid
    // Corporation Tax for FY2026 (19% to £50k, 25% from £250k, marginal relief between),
    // assuming a 12-month accounting period and no associated companies. Nil on a loss.
    const corporationTax = isCompany ? ukCorporationTax(profitBeforeTax) : 0
    const netProfit = profitBeforeTax - corporationTax
    const pct = (v: number) => (r > 0 ? (v / r) * 100 : 0)
    return {
      grossProfit, grossMargin: pct(grossProfit), totalOverheads,
      operatingProfit, operatingMargin: pct(operatingProfit),
      profitBeforeTax, corporationTax, netProfit, netMargin: pct(netProfit),
    }
  }, [r, c, w, re, u, m, i, o, intPaid, isCompany])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="sm:col-span-2"><label className="block text-sm font-medium mb-2">Revenue</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={revenue} onChange={(e) => setRevenue(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Revenue" /></div></div>
        <div className="sm:col-span-2"><label className="block text-sm font-medium mb-2">Cost of Goods Sold</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={cogs} onChange={(e) => setCogs(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Cost of Goods Sold" /></div></div>
        <Input label="Wages / Salaries" value={wages} onChange={setWages} />
        <Input label="Rent / Premises" value={rent} onChange={setRent} />
        <Input label="Utilities" value={utilities} onChange={setUtilities} />
        <Input label="Marketing" value={marketing} onChange={setMarketing} />
        <Input label="Insurance" value={insurance} onChange={setInsurance} />
        <Input label="Other Costs" value={other} onChange={setOther} />
        <Input label="Interest Paid" value={interest} onChange={setInterest} />
      </div>
      <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={isCompany} onChange={(e) => setIsCompany(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Limited company: estimate Corporation Tax (annual figures, 12-month accounting period)</span></label>

      {r > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border font-medium"><td className="py-2.5">Revenue</td><td className="text-right tabular-nums">{formatCurrency(r)}</td></tr>
              {costRow('Cost of Goods Sold', c)}
              <tr className="border-b border-border font-semibold bg-muted/30"><td className="py-2.5">Gross Profit</td><td className="text-right tabular-nums">{formatCurrency(result.grossProfit)} <span className="text-muted-foreground font-normal">({formatPercent(result.grossMargin)})</span></td></tr>
              {costRow('Wages', w)}
              {costRow('Rent', re)}
              {costRow('Utilities', u)}
              {costRow('Marketing', m)}
              {costRow('Insurance', i)}
              {costRow('Other', o)}
              <tr className="border-b border-border font-semibold bg-muted/30"><td className="py-2.5">Operating Profit (before interest and tax)</td><td className="text-right tabular-nums">{formatCurrency(result.operatingProfit)} <span className="text-muted-foreground font-normal">({formatPercent(result.operatingMargin)})</span></td></tr>
              {costRow('Interest', intPaid)}
              <tr className={`border-b border-border font-semibold ${isCompany ? '' : 'text-lg'}`}><td className="py-2.5">Profit Before Tax</td><td className="text-right tabular-nums">{formatCurrency(result.profitBeforeTax)}</td></tr>
              {isCompany && costRow('Corporation Tax', result.corporationTax)}
              {isCompany && (
                <tr className={`font-bold text-lg ${result.netProfit >= 0 ? '' : 'text-destructive'}`}><td className="py-3">Net Profit (after tax)</td><td className="text-right tabular-nums">{formatCurrency(result.netProfit)} <span className="text-sm font-normal text-muted-foreground">({formatPercent(result.netMargin)})</span></td></tr>
              )}
            </tbody>
          </table>
          <p className="text-xs text-muted-foreground">
            {isCompany
              ? 'Corporation Tax uses the 2026 rates: 19% on profits up to £50,000, 25% from £250,000 and marginal relief in between. It assumes a 12-month accounting period and no associated companies, so it only makes sense for a full year’s figures.'
              : 'Sole traders and partners pay Income Tax and National Insurance on their share of the profit through Self Assessment, so the statement stops at profit before tax.'}
          </p>
        </div>
      )}
    </div>
  )
}
