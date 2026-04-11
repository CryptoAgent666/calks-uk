import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent } from '@/utils'

export default function ProfitAndLossCalculator() {
  const [revenue, setRevenue] = useState('120000')
  const [cogs, setCogs] = useState('45000')
  const [wages, setWages] = useState('35000')
  const [rent, setRent] = useState('12000')
  const [utilities, setUtilities] = useState('3000')
  const [marketing, setMarketing] = useState('5000')
  const [insurance, setInsurance] = useState('2000')
  const [other, setOther] = useState('5000')

  const r = parseFloat(revenue.replace(/,/g,'')) || 0
  const c = parseFloat(cogs.replace(/,/g,'')) || 0
  const w = parseFloat(wages.replace(/,/g,'')) || 0
  const re = parseFloat(rent.replace(/,/g,'')) || 0
  const u = parseFloat(utilities.replace(/,/g,'')) || 0
  const m = parseFloat(marketing.replace(/,/g,'')) || 0
  const i = parseFloat(insurance.replace(/,/g,'')) || 0
  const o = parseFloat(other.replace(/,/g,'')) || 0

  const grossProfit = r - c
  const grossMargin = r > 0 ? (grossProfit / r) * 100 : 0
  const totalOverheads = w + re + u + m + i + o
  const netProfit = grossProfit - totalOverheads
  const netMargin = r > 0 ? (netProfit / r) * 100 : 0

  const Input = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
    <div><label className="block text-xs text-muted-foreground mb-1">{label}</label><div className="relative"><span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">£</span><input type="text" inputMode="numeric" value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-input bg-background pl-6 pr-2 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
  )

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="sm:col-span-2"><label className="block text-sm font-medium mb-2">Annual Revenue</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={revenue} onChange={(e) => setRevenue(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div className="sm:col-span-2"><label className="block text-sm font-medium mb-2">Cost of Goods Sold</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={cogs} onChange={(e) => setCogs(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <Input label="Wages / Salaries" value={wages} onChange={setWages} />
        <Input label="Rent / Premises" value={rent} onChange={setRent} />
        <Input label="Utilities" value={utilities} onChange={setUtilities} />
        <Input label="Marketing" value={marketing} onChange={setMarketing} />
        <Input label="Insurance" value={insurance} onChange={setInsurance} />
        <Input label="Other Costs" value={other} onChange={setOther} />
      </div>

      {r > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border font-medium"><td className="py-2.5">Revenue</td><td className="text-right tabular-nums">{formatCurrency(r)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 text-destructive">Cost of Goods Sold</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(c)}</td></tr>
              <tr className="border-b border-border font-semibold bg-muted/30"><td className="py-2.5">Gross Profit</td><td className="text-right tabular-nums">{formatCurrency(grossProfit)} <span className="text-muted-foreground font-normal">({formatPercent(grossMargin)})</span></td></tr>
              <tr className="border-b border-border/50"><td className="py-2 text-destructive">Wages</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(w)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 text-destructive">Rent</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(re)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 text-destructive">Utilities</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(u)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 text-destructive">Marketing</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(m)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 text-destructive">Insurance</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(i)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 text-destructive">Other</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(o)}</td></tr>
              <tr className={`font-bold text-lg ${netProfit >= 0 ? '' : 'text-destructive'}`}><td className="py-3">Net Profit</td><td className="text-right tabular-nums">{formatCurrency(netProfit)} <span className="text-sm font-normal text-muted-foreground">({formatPercent(netMargin)})</span></td></tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
