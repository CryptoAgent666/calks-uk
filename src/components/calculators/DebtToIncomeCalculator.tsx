import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent } from '@/utils'

function calculate(monthlyIncome: number, mortgagePayment: number, carPayment: number, creditCards: number, loans: number, studentLoan: number, other: number) {
  const totalDebt = mortgagePayment + carPayment + creditCards + loans + studentLoan + other
  const dti = monthlyIncome > 0 ? (totalDebt / monthlyIncome) * 100 : 0
  const dtiExMortgage = monthlyIncome > 0 ? ((totalDebt - mortgagePayment) / monthlyIncome) * 100 : 0

  let assessment: string
  let color: string
  if (dti <= 28) { assessment = 'Healthy — well within most lender limits'; color = 'text-green-700 dark:text-green-400' }
  else if (dti <= 36) { assessment = 'Manageable — most lenders comfortable'; color = 'text-green-600' }
  else if (dti <= 43) { assessment = 'Stretched — may limit borrowing options'; color = 'text-orange-600' }
  else if (dti <= 50) { assessment = 'High — lenders may decline applications'; color = 'text-red-500' }
  else { assessment = 'Very High — seek debt advice'; color = 'text-destructive' }

  const remaining = monthlyIncome - totalDebt

  return { totalDebt, dti, dtiExMortgage, assessment, color, remaining }
}

export default function DebtToIncomeCalculator() {
  const [income, setIncome] = useState('')
  const [mortgage, setMortgage] = useState('0')
  const [car, setCar] = useState('0')
  const [cards, setCards] = useState('0')
  const [loans, setLoans] = useState('0')
  const [sl, setSl] = useState('0')
  const [other, setOther] = useState('0')

  const i = parseFloat(income.replace(/,/g,'')) || 0
  const result = useMemo(() => calculate(i, parseFloat(mortgage)||0, parseFloat(car)||0, parseFloat(cards)||0, parseFloat(loans)||0, parseFloat(sl)||0, parseFloat(other)||0), [income, mortgage, car, cards, loans, sl, other])

  const Input = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
    <div><label className="block text-sm font-medium mb-2">{label}</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="number" min="0" value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label={label} /></div></div>
  )

  return (
    <div className="space-y-6">
      <div><label className="block text-sm font-medium mb-2">Monthly Gross Income</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={income} onChange={(e) => setIncome(e.target.value)} placeholder="3,500" className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Monthly Gross Income" /></div></div>
      <h3 className="text-sm font-semibold">Monthly Debt Payments</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Input label="Mortgage/Rent" value={mortgage} onChange={setMortgage} />
        <Input label="Car Finance" value={car} onChange={setCar} />
        <Input label="Credit Cards (min)" value={cards} onChange={setCards} />
        <Input label="Personal Loans" value={loans} onChange={setLoans} />
        <Input label="Student Loan" value={sl} onChange={setSl} />
        <Input label="Other Debts" value={other} onChange={setOther} />
      </div>

      {i > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Debt-to-Income Ratio</p>
            <p className="text-4xl font-bold text-primary mt-1">{formatPercent(result.dti)}</p>
            <p className={`text-sm font-medium mt-1 ${result.color}`}>{result.assessment}</p>
          </div>
          <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
            <div className={`h-4 rounded-full transition-all ${result.dti <= 36 ? 'bg-green-500' : result.dti <= 43 ? 'bg-orange-500' : 'bg-red-500'}`} style={{ width: `${Math.min(result.dti, 100)}%` }} />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground"><span>0%</span><span className="text-green-600">28%</span><span className="text-orange-600">43%</span><span className="text-red-600">50%+</span></div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Monthly Debts</p><p className="text-lg font-bold text-destructive">{formatCurrency(result.totalDebt)}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">DTI (excl. mortgage)</p><p className="text-lg font-bold">{formatPercent(result.dtiExMortgage)}</p></div>
            <div className="rounded-xl bg-green-100 dark:bg-green-950 p-3 text-center"><p className="text-xs text-muted-foreground">Remaining</p><p className="text-lg font-bold text-green-700 dark:text-green-400">{formatCurrency(result.remaining)}</p></div>
          </div>
        </div>
      )}
    </div>
  )
}
