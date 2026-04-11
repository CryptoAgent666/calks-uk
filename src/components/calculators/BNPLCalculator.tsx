import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

type Provider = 'klarna3' | 'klarna6' | 'clearpay' | 'custom'

const PROVIDERS: Record<Provider, { name: string; instalments: number; apr: number; fee: number }> = {
  klarna3: { name: 'Klarna (Pay in 3)', instalments: 3, apr: 0, fee: 0 },
  klarna6: { name: 'Klarna (6-36 months)', instalments: 6, apr: 18.9, fee: 0 },
  clearpay: { name: 'Clearpay (4 payments)', instalments: 4, apr: 0, fee: 0 },
  custom: { name: 'Custom', instalments: 12, apr: 0, fee: 0 },
}

function calculate(amount: number, provider: Provider, customInstalments: number, customApr: number) {
  const info = PROVIDERS[provider]
  const instalments = provider === 'custom' ? customInstalments : info.instalments
  const apr = provider === 'custom' ? customApr : info.apr
  const monthlyRate = apr / 100 / 12

  let payment: number
  let totalPaid: number

  if (apr === 0) {
    payment = amount / instalments
    totalPaid = amount
  } else {
    payment = monthlyRate > 0
      ? amount * (monthlyRate * Math.pow(1 + monthlyRate, instalments)) / (Math.pow(1 + monthlyRate, instalments) - 1)
      : amount / instalments
    totalPaid = payment * instalments
  }

  const interest = totalPaid - amount
  const lateFee = 6 // typical late fee per missed payment

  return { payment, totalPaid, interest, instalments, lateFee, hasInterest: apr > 0 }
}

export default function BNPLCalculator() {
  const [amount, setAmount] = useState('200')
  const [provider, setProvider] = useState<Provider>('klarna3')
  const [customInst, setCustomInst] = useState('12')
  const [customApr, setCustomApr] = useState('18.9')

  const a = parseFloat(amount.replace(/,/g, '')) || 0
  const result = useMemo(() => calculate(a, provider, parseInt(customInst) || 12, parseFloat(customApr) || 0), [a, provider, customInst, customApr])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Purchase Amount</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="200" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">BNPL Provider</label><select value={provider} onChange={(e) => setProvider(e.target.value as Provider)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring">
          {Object.entries(PROVIDERS).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
        </select></div>
      </div>

      {provider === 'custom' && (
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-2">Instalments</label><input type="number" min="2" max="36" value={customInst} onChange={(e) => setCustomInst(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
          <div><label className="block text-sm font-medium mb-2">APR (%)</label><input type="number" min="0" max="50" step="0.1" value={customApr} onChange={(e) => setCustomApr(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        </div>
      )}

      {a > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">{result.instalments} Payments of</p>
            <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.payment)}</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Total Paid</p><p className="text-lg font-bold">{formatCurrency(result.totalPaid)}</p></div>
            <div className={`rounded-xl p-4 text-center ${result.interest > 0 ? 'bg-destructive/10' : 'bg-green-100 dark:bg-green-950'}`}><p className="text-xs text-muted-foreground">Interest</p><p className={`text-lg font-bold ${result.interest > 0 ? 'text-destructive' : 'text-green-700 dark:text-green-400'}`}>{result.interest > 0 ? formatCurrency(result.interest) : 'FREE'}</p></div>
            <div className="rounded-xl bg-orange-100 dark:bg-orange-950 p-4 text-center"><p className="text-xs text-muted-foreground">Late Fee Risk</p><p className="text-lg font-bold text-orange-700 dark:text-orange-400">£{result.lateFee}/miss</p></div>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>BNPL can affect your credit score. Missing payments incurs late fees (~£6) and can be reported to credit agencies. Always ensure you can afford all instalments before committing.</p>
          </div>
        </div>
      )}
    </div>
  )
}
