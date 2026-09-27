import { useState, useMemo } from 'react'
import { formatCurrency, formatPercent, ukPersonalAllowance, UK_BASIC_BAND, UK_ADDITIONAL_THRESHOLD } from '@/utils'

function calculate(salary: number, dividends: number, selfEmployment: number, rentalIncome: number, capitalGains: number, pensionContrib: number, giftAid: number) {
  const totalIncome = salary + dividends + selfEmployment + rentalIncome

  // Relief-at-source pension contributions (gross) and grossed-up Gift Aid extend the
  // basic and higher rate bands, and reduce adjusted net income for the £100k taper.
  const extension = pensionContrib + giftAid * 1.25
  const pa = ukPersonalAllowance(Math.max(0, totalIncome - extension))

  // Band limits measured in TAXABLE income, so the 20% band is always £37,700 wide
  // (plus any extension) even when the personal allowance tapers away above £100k.
  const basicLimit = UK_BASIC_BAND + extension
  const higherLimit = UK_ADDITIONAL_THRESHOLD + extension
  const slice = (from: number, amount: number, rates: [number, number, number]) => {
    const to = from + amount
    const inBasic = Math.max(0, Math.min(to, basicLimit) - from)
    const inHigher = Math.max(0, Math.min(to, higherLimit) - Math.max(from, basicLimit))
    const inAdditional = Math.max(0, to - Math.max(from, higherLimit))
    return inBasic * rates[0] + inHigher * rates[1] + inAdditional * rates[2]
  }

  // Income Tax on non-dividend income (uses the personal allowance first)
  const nonDivIncome = salary + selfEmployment + rentalIncome
  const nonDivTaxable = Math.max(0, nonDivIncome - pa)
  const incomeTax = slice(0, nonDivTaxable, [0.20, 0.40, 0.45])

  // Dividends sit on top: any unused allowance covers them first, then the £500
  // dividend allowance (taxed at 0% but still using band room)
  const divTaxable = Math.max(0, dividends - Math.max(0, pa - nonDivIncome))
  const divAllowance = Math.min(500, divTaxable)
  const dividendTax = slice(nonDivTaxable + divAllowance, divTaxable - divAllowance, [0.1075, 0.3575, 0.3935])

  // NI
  let employeeNI = 0
  if (salary > 12_570) { if (salary <= 50_270) employeeNI = (salary - 12_570) * 0.08; else employeeNI = (50_270 - 12_570) * 0.08 + (salary - 50_270) * 0.02 }

  let class4NI = 0
  if (selfEmployment > 12_570) { if (selfEmployment <= 50_270) class4NI = (selfEmployment - 12_570) * 0.06; else class4NI = (50_270 - 12_570) * 0.06 + (selfEmployment - 50_270) * 0.02 }
  // Class 2 NI abolished from 6 April 2024 — removed

  // CGT (18%/24% for all assets since 30 Oct 2024): gains above the £3,000 exempt
  // amount use whatever basic-rate band is left after all taxable income
  const cgtAllowance = 3_000
  const taxableCGT = Math.max(0, capitalGains - cgtAllowance)
  const basicLeft = Math.max(0, basicLimit - nonDivTaxable - divTaxable)
  const cgt = Math.min(taxableCGT, basicLeft) * 0.18 + Math.max(0, taxableCGT - basicLeft) * 0.24

  const totalTax = incomeTax + dividendTax + employeeNI + class4NI + cgt
  const totalGross = totalIncome + capitalGains
  const takeHome = totalGross - totalTax

  return { totalIncome, pa, incomeTax, dividendTax, employeeNI, class4NI, cgt, totalTax, takeHome, effectiveRate: totalGross > 0 ? (totalTax / totalGross) * 100 : 0 }
}

// Defined at module level: a component declared inside render is remounted on every
// keystroke, which drops focus after each digit.
const Input = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <div><label className="block text-sm font-medium mb-2">{label}</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={value} onChange={(e) => onChange(e.target.value)} aria-label={label} placeholder="0" className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
)

export default function AnnualTaxSummaryCalculator() {
  const [salary, setSalary] = useState('40000')
  const [dividends, setDividends] = useState('0')
  const [selfEmp, setSelfEmp] = useState('0')
  const [rental, setRental] = useState('0')
  const [cg, setCg] = useState('0')
  const [pension, setPension] = useState('0')
  const [giftAid, setGiftAid] = useState('0')

  const result = useMemo(() => calculate(parseFloat(salary.replace(/,/g,''))||0, parseFloat(dividends.replace(/,/g,''))||0, parseFloat(selfEmp.replace(/,/g,''))||0, parseFloat(rental.replace(/,/g,''))||0, parseFloat(cg.replace(/,/g,''))||0, parseFloat(pension.replace(/,/g,''))||0, parseFloat(giftAid.replace(/,/g,''))||0), [salary, dividends, selfEmp, rental, cg, pension, giftAid])


  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Input label="Employment Salary" value={salary} onChange={setSalary} />
        <Input label="Dividends" value={dividends} onChange={setDividends} />
        <Input label="Self-Employment Profit" value={selfEmp} onChange={setSelfEmp} />
        <Input label="Rental Income" value={rental} onChange={setRental} />
        <Input label="Capital Gains" value={cg} onChange={setCg} />
        <Input label="Pension Contributions" value={pension} onChange={setPension} />
        <Input label="Gift Aid Donations" value={giftAid} onChange={setGiftAid} />
      </div>

      <div className="space-y-4 animate-fade-in-up">
        <div className="rounded-2xl bg-primary/10 p-6 text-center">
          <p className="text-sm text-muted-foreground">Total Take Home</p>
          <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.takeHome)}</p>
          <p className="text-sm text-muted-foreground mt-1">Effective rate: {formatPercent(result.effectiveRate)}</p>
        </div>
        <table className="w-full text-sm">
          <tbody>
            {result.incomeTax > 0 && <tr className="border-b border-border/50"><td className="py-2 text-destructive">Income Tax</td><td className="text-right tabular-nums text-destructive">{formatCurrency(result.incomeTax)}</td></tr>}
            {result.dividendTax > 0 && <tr className="border-b border-border/50"><td className="py-2 text-destructive">Dividend Tax</td><td className="text-right tabular-nums text-destructive">{formatCurrency(result.dividendTax)}</td></tr>}
            {result.employeeNI > 0 && <tr className="border-b border-border/50"><td className="py-2 text-destructive">Employee NI (Class 1)</td><td className="text-right tabular-nums text-destructive">{formatCurrency(result.employeeNI)}</td></tr>}
            {result.class4NI > 0 && <tr className="border-b border-border/50"><td className="py-2 text-destructive">Class 4 NI (6%/2%)</td><td className="text-right tabular-nums text-destructive">{formatCurrency(result.class4NI)}</td></tr>}
            {result.cgt > 0 && <tr className="border-b border-border/50"><td className="py-2 text-destructive">Capital Gains Tax</td><td className="text-right tabular-nums text-destructive">{formatCurrency(result.cgt)}</td></tr>}
            <tr className="font-semibold"><td className="py-2 text-destructive">Total Tax</td><td className="text-right tabular-nums text-destructive">{formatCurrency(result.totalTax)}</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
