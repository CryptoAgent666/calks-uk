import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

type MatterType = 'conveyancing_buy' | 'conveyancing_sell' | 'divorce' | 'will' | 'probate' | 'employment'

const MATTERS: Record<MatterType, { name: string; baseFee: number; description: string; disbursements: number }> = {
  conveyancing_buy: { name: 'Conveyancing (Buying)', baseFee: 1500, description: 'Legal fees for purchasing a property', disbursements: 400 },
  conveyancing_sell: { name: 'Conveyancing (Selling)', baseFee: 1200, description: 'Legal fees for selling a property', disbursements: 100 },
  divorce: { name: 'Divorce (uncontested)', baseFee: 1000, description: 'No-fault divorce proceedings', disbursements: 593 },
  will: { name: 'Simple Will', baseFee: 250, description: 'Standard single will', disbursements: 0 },
  probate: { name: 'Probate Application', baseFee: 2500, description: 'Grant of probate + estate administration', disbursements: 300 },
  employment: { name: 'Employment Tribunal', baseFee: 3000, description: 'Representation at employment tribunal', disbursements: 200 },
}

function calculate(matter: MatterType, propertyValue: number) {
  const info = MATTERS[matter]
  let fee = info.baseFee

  // Conveyancing scales with property value
  if (matter.startsWith('conveyancing') && propertyValue > 0) {
    if (propertyValue > 500_000) fee = 2000
    else if (propertyValue > 300_000) fee = 1700
    else if (propertyValue > 200_000) fee = 1500
    else fee = 1200
  }

  const vat = fee * 0.20
  const total = fee + vat + info.disbursements

  return { fee, vat, disbursements: info.disbursements, total, info }
}

export default function SolicitorFeeCalculator() {
  const [matter, setMatter] = useState<MatterType>('conveyancing_buy')
  const [value, setValue] = useState('300000')

  const v = parseFloat(value.replace(/,/g,'')) || 0
  const result = useMemo(() => calculate(matter, v), [matter, v])
  const isConveyancing = matter.startsWith('conveyancing')

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Legal Matter</label><select value={matter} onChange={(e) => setMatter(e.target.value as MatterType)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring">{Object.entries(MATTERS).map(([k,v]) => <option key={k} value={k}>{v.name}</option>)}</select></div>
        {isConveyancing && <div><label className="block text-sm font-medium mb-2">Property Value</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={value} onChange={(e) => setValue(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>}
      </div>

      <div className="space-y-4 animate-fade-in-up">
        <div className="rounded-2xl bg-primary/10 p-6 text-center">
          <p className="text-sm text-muted-foreground">{result.info.name}</p>
          <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.total)}</p>
          <p className="text-sm text-muted-foreground mt-1">{result.info.description}</p>
        </div>
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-border/50"><td className="py-2">Solicitor Fee</td><td className="text-right tabular-nums">{formatCurrency(result.fee)}</td></tr>
            <tr className="border-b border-border/50"><td className="py-2">VAT (20%)</td><td className="text-right tabular-nums">{formatCurrency(result.vat)}</td></tr>
            {result.disbursements > 0 && <tr className="border-b border-border/50"><td className="py-2">Disbursements</td><td className="text-right tabular-nums">{formatCurrency(result.disbursements)}</td></tr>}
            <tr className="font-semibold"><td className="py-2">Total</td><td className="text-right tabular-nums text-primary">{formatCurrency(result.total)}</td></tr>
          </tbody>
        </table>
        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
          <p>Indicative fees based on UK averages. Actual costs vary by location, complexity and firm. Always get quotes from multiple solicitors. Disbursements include searches, court fees etc.</p>
        </div>
      </div>
    </div>
  )
}
