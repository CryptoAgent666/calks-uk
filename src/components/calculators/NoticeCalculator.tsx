import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Statutory minimum notice from the employer (Employment Rights Act 1996 s.86): none under
// 1 month's service, 1 week from 1 month to 2 years, then 1 week per complete year of
// service from 2 years, capped at 12 weeks. The longer of statutory and contractual notice applies.
const MAX_STATUTORY_WEEKS = 12

function calculate(yearsService: number, contractWeeks: number, annualSalary: number) {
  const statutory = yearsService < 2 ? 1 : Math.min(yearsService, MAX_STATUTORY_WEEKS)
  const contractual = contractWeeks
  const actual = Math.max(statutory, contractual)
  // Notice pay: salary ÷ 52 × weeks of notice (taxed as earnings, as is any payment in lieu)
  const weeklyPay = annualSalary / 52
  const noticePay = weeklyPay * actual
  return { statutory, contractual, actual, weeklyPay, noticePay }
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

// Adds whole weeks to a typed YYYY-MM-DD string using UTC arithmetic only, so the result does
// not depend on the server or browser time zone. Returns '' for an empty or malformed date.
function addWeeks(dateStr: string, weeks: number): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr)
  if (!m) return ''
  const ms = Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]) + weeks * 7)
  if (Number.isNaN(ms)) return ''
  const d = new Date(ms)
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

const inputClass = 'w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring'

export default function NoticeCalculator() {
  const [years, setYears] = useState('5')
  const [contract, setContract] = useState('4')
  const [salary, setSalary] = useState('35000')
  const [noticeDate, setNoticeDate] = useState('')

  const y = parseInt(years) || 0
  const c = parseInt(contract) || 0
  const s = parseFloat(salary.replace(/,/g, '')) || 0
  const result = useMemo(() => calculate(y, c, s), [y, c, s])
  const endDate = noticeDate ? addWeeks(noticeDate, result.actual) : ''

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <label htmlFor="notice-years" className="block text-sm font-medium mb-2">Years of Service</label>
          <input id="notice-years" type="number" min="0" max="50" value={years} onChange={(e) => setYears(e.target.value)} className={inputClass} aria-label="Years of Service" />
        </div>
        <div>
          <label htmlFor="notice-contract" className="block text-sm font-medium mb-2">Contract Notice (weeks)</label>
          <input id="notice-contract" type="number" min="0" max="52" value={contract} onChange={(e) => setContract(e.target.value)} className={inputClass} aria-label="Contract Notice (weeks)" />
        </div>
        <div>
          <label htmlFor="notice-salary" className="block text-sm font-medium mb-2">Annual Salary (£)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
            <input id="notice-salary" type="text" inputMode="numeric" value={salary} onChange={(e) => setSalary(e.target.value)} className={`${inputClass} px-8`} aria-label="Annual Salary" />
          </div>
        </div>
        <div>
          <label htmlFor="notice-date" className="block text-sm font-medium mb-2">Notice Given On (date)</label>
          <input id="notice-date" type="date" value={noticeDate} onChange={(e) => setNoticeDate(e.target.value)} className={inputClass} aria-label="Notice Given On" />
        </div>
      </div>

      <div className="space-y-4 animate-fade-in-up">
        <div className="rounded-2xl bg-primary/10 p-6 text-center">
          <p className="text-sm text-muted-foreground">Your Notice Period</p>
          <p className="text-3xl font-bold text-primary mt-1">{result.actual} week{result.actual !== 1 ? 's' : ''}</p>
          <p className="text-sm text-muted-foreground mt-1">{result.actual === result.contractual ? 'Based on your contract' : 'Based on statutory minimum'}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border p-4 text-center">
            <p className="text-xs text-muted-foreground">Statutory Minimum</p>
            <p className="text-lg font-bold">{result.statutory} week{result.statutory !== 1 ? 's' : ''}</p>
            {y === 0 && <p className="text-xs text-muted-foreground mt-1">from 1 month's service; no statutory notice under one month's service</p>}
          </div>
          <div className="rounded-xl border border-border p-4 text-center">
            <p className="text-xs text-muted-foreground">Contractual</p>
            <p className="text-lg font-bold">{result.contractual} week{result.contractual !== 1 ? 's' : ''}</p>
          </div>
        </div>
        {(s > 0 || endDate) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {s > 0 && (
              <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center">
                <p className="text-xs text-muted-foreground">Notice pay for {result.actual} week{result.actual !== 1 ? 's' : ''} (gross)</p>
                <p className="text-lg font-bold text-green-700 dark:text-green-400">{formatCurrency(result.noticePay)}</p>
                <p className="text-xs text-muted-foreground mt-1">{formatCurrency(s)} ÷ 52 = {formatCurrency(result.weeklyPay)} a week × {result.actual}</p>
              </div>
            )}
            {endDate && (
              <div className="rounded-xl bg-muted/50 p-4 text-center">
                <p className="text-xs text-muted-foreground">Earliest end date</p>
                <p className="text-lg font-bold">{endDate}</p>
                <p className="text-xs text-muted-foreground mt-1">notice date + {result.actual} week{result.actual !== 1 ? 's' : ''}</p>
              </div>
            )}
          </div>
        )}
        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
          <p>Statutory minimum: 1 week after 1 month's service (none before that); from 2 years, 1 week per complete year, up to 12 weeks. The longer of statutory or contractual notice applies. If your contract allows payment in lieu of notice (PILON), the notice pay figure is what you would receive instead of working the notice, taxed as earnings like normal pay.</p>
        </div>
      </div>
    </div>
  )
}
