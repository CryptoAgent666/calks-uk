import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(salesStd: number, sales5: number, salesZero: number, salesExempt: number, purchasesStd: number, purchases5: number) {
  const outputVatStd = salesStd * 0.20
  const outputVat5 = sales5 * 0.05
  const totalOutputVat = outputVatStd + outputVat5

  const inputVatStd = purchasesStd * 0.20
  const inputVat5 = purchases5 * 0.05
  const totalInputVat = inputVatStd + inputVat5

  const vatDue = totalOutputVat - totalInputVat
  const isRefund = vatDue < 0

  return { outputVatStd, outputVat5, totalOutputVat, inputVatStd, inputVat5, totalInputVat, vatDue, isRefund, totalSales: salesStd + sales5 + salesZero + salesExempt, totalPurchases: purchasesStd + purchases5 }
}

export default function VatReturnCalculator() {
  const [salesStd, setSalesStd] = useState('')
  const [sales5, setSales5] = useState('0')
  const [salesZero, setSalesZero] = useState('0')
  const [salesExempt, setSalesExempt] = useState('0')
  const [purchStd, setPurchStd] = useState('')
  const [purch5, setPurch5] = useState('0')

  const result = useMemo(() => calculate(parseFloat(salesStd.replace(/,/g,''))||0, parseFloat(sales5.replace(/,/g,''))||0, parseFloat(salesZero.replace(/,/g,''))||0, parseFloat(salesExempt.replace(/,/g,''))||0, parseFloat(purchStd.replace(/,/g,''))||0, parseFloat(purch5.replace(/,/g,''))||0), [salesStd, sales5, salesZero, salesExempt, purchStd, purch5])

  const Input = ({ label, value, onChange, hint }: { label: string; value: string; onChange: (v: string) => void; hint?: string }) => (
    <div><label className="block text-sm font-medium mb-2">{label}</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={value} onChange={(e) => onChange(e.target.value)} placeholder="0" className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>{hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}</div>
  )

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-semibold">Sales (Output VAT)</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Input label="Standard Rate (20%)" value={salesStd} onChange={setSalesStd} hint="Net amount excl. VAT" />
        <Input label="Reduced Rate (5%)" value={sales5} onChange={setSales5} />
        <Input label="Zero Rated" value={salesZero} onChange={setSalesZero} />
        <Input label="Exempt" value={salesExempt} onChange={setSalesExempt} />
      </div>

      <h3 className="text-sm font-semibold">Purchases (Input VAT)</h3>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Standard Rate (20%)" value={purchStd} onChange={setPurchStd} hint="Net amount excl. VAT" />
        <Input label="Reduced Rate (5%)" value={purch5} onChange={setPurch5} />
      </div>

      <div className="space-y-4 animate-fade-in-up">
        <div className={`rounded-2xl p-6 text-center ${result.isRefund ? 'bg-green-100 dark:bg-green-950' : 'bg-destructive/10'}`}>
          <p className="text-sm text-muted-foreground">{result.isRefund ? 'VAT Refund Due to You' : 'VAT to Pay to HMRC'}</p>
          <p className={`text-3xl font-bold mt-1 ${result.isRefund ? 'text-green-700 dark:text-green-400' : 'text-destructive'}`}>{formatCurrency(Math.abs(result.vatDue))}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-destructive/10 p-4 text-center"><p className="text-xs text-muted-foreground">Output VAT (you collected)</p><p className="text-lg font-bold text-destructive">{formatCurrency(result.totalOutputVat)}</p></div>
          <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center"><p className="text-xs text-muted-foreground">Input VAT (you paid)</p><p className="text-lg font-bold text-green-700 dark:text-green-400">{formatCurrency(result.totalInputVat)}</p></div>
        </div>
      </div>
    </div>
  )
}
