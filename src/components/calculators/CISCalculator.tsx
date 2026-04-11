import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent } from '@/utils'

// CIS deduction rates
type CISStatus = 'registered' | 'unregistered' | 'gross'

function calculate(invoiceAmount: number, materialsCost: number, status: CISStatus) {
  const labourCost = invoiceAmount - materialsCost
  const rates: Record<CISStatus, number> = { registered: 0.20, unregistered: 0.30, gross: 0 }
  const deductionRate = rates[status]
  const deduction = labourCost * deductionRate
  const netPayment = invoiceAmount - deduction

  return { invoiceAmount, materialsCost, labourCost, deduction, netPayment, deductionRate: deductionRate * 100 }
}

export default function CISCalculator() {
  const [invoice, setInvoice] = useState('5000')
  const [materials, setMaterials] = useState('1000')
  const [status, setStatus] = useState<CISStatus>('registered')

  const i = parseFloat(invoice.replace(/,/g, '')) || 0
  const m = parseFloat(materials.replace(/,/g, '')) || 0
  const result = useMemo(() => calculate(i, m, status), [i, m, status])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-2">
        {([{v:'registered' as CISStatus,l:'Registered (20%)'},{v:'unregistered' as CISStatus,l:'Unregistered (30%)'},{v:'gross' as CISStatus,l:'Gross Payment (0%)'}]).map(o => (
          <button key={o.v} onClick={() => setStatus(o.v)} className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${status === o.v ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:bg-accent'}`}>{o.l}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Invoice Amount (incl. materials)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={invoice} onChange={(e) => setInvoice(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Materials Cost</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={materials} onChange={(e) => setMaterials(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
      </div>

      {i > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 gap-3">
            <div className={`rounded-xl p-4 text-center ${result.deduction > 0 ? 'bg-destructive/10' : 'bg-green-100 dark:bg-green-950'}`}><p className="text-xs text-muted-foreground">CIS Deduction ({result.deductionRate}%)</p><p className={`text-xl font-bold ${result.deduction > 0 ? 'text-destructive' : 'text-green-700 dark:text-green-400'}`}>{result.deduction > 0 ? formatCurrency(result.deduction) : 'None'}</p></div>
            <div className="rounded-xl bg-primary/10 p-4 text-center"><p className="text-xs text-muted-foreground">You Receive</p><p className="text-xl font-bold text-primary">{formatCurrency(result.netPayment)}</p></div>
          </div>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border/50"><td className="py-2">Invoice Total</td><td className="text-right tabular-nums">{formatCurrency(i)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Materials (not deducted)</td><td className="text-right tabular-nums">{formatCurrency(m)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2">Labour (subject to CIS)</td><td className="text-right tabular-nums">{formatCurrency(result.labourCost)}</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 text-destructive">CIS Deduction</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.deduction)}</td></tr>
              <tr className="font-semibold"><td className="py-2 text-primary">Net Payment</td><td className="text-right tabular-nums text-primary">{formatCurrency(result.netPayment)}</td></tr>
            </tbody>
          </table>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>CIS deductions are not a tax — they're advance payments towards your tax bill. Claim them back on your self-assessment return.</p>
          </div>
        </div>
      )}
    </div>
  )
}
