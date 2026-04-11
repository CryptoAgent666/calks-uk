import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(turnover: number, isSelfEmployed: boolean, hasProperty: boolean, numProperties: number) {
  const mtdThreshold = 50_000 // April 2026 for income over £50K
  const mtdThreshold2 = 30_000 // April 2027 for income over £30K

  const selfEmpIncome = isSelfEmployed ? turnover : 0
  const propertyIncome = hasProperty ? numProperties * 8_000 : 0 // assume avg £8K/property
  const totalQualifying = selfEmpIncome + propertyIncome

  const needsMTD2026 = totalQualifying > mtdThreshold
  const needsMTD2027 = totalQualifying > mtdThreshold2

  // Software costs
  const annualSoftwareCost = needsMTD2026 || needsMTD2027 ? 150 : 0 // typical HMRC-compatible software
  const quarterlyReturns = 4 // must submit quarterly
  const endOfYearReturn = 1

  return { totalQualifying, needsMTD2026, needsMTD2027, annualSoftwareCost, quarterlyReturns, endOfYearReturn, mtdThreshold, mtdThreshold2 }
}

export default function MakingTaxDigitalCalculator() {
  const [turnover, setTurnover] = useState('55000')
  const [selfEmp, setSelfEmp] = useState(true)
  const [property, setProperty] = useState(false)
  const [numProp, setNumProp] = useState('1')

  const t = parseFloat(turnover.replace(/,/g,'')) || 0
  const np = parseInt(numProp) || 0
  const result = useMemo(() => calculate(t, selfEmp, property, np), [t, selfEmp, property, np])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Annual Turnover / Gross Income</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={turnover} onChange={(e) => setTurnover(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
      </div>
      <div className="space-y-2">
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={selfEmp} onChange={(e) => setSelfEmp(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Self-employed / sole trader</span></label>
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={property} onChange={(e) => setProperty(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Rental property income</span></label>
        {property && <div className="ml-8"><label className="block text-sm font-medium mb-2">Number of Properties</label><input type="number" min="1" max="50" value={numProp} onChange={(e) => setNumProp(e.target.value)} className="w-32 rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>}
      </div>

      <div className="space-y-4 animate-fade-in-up">
        <div className={`rounded-2xl p-6 text-center ${result.needsMTD2026 ? 'bg-orange-100 dark:bg-orange-950' : result.needsMTD2027 ? 'bg-yellow-100 dark:bg-yellow-950' : 'bg-green-100 dark:bg-green-950'}`}>
          {result.needsMTD2026 ? (
            <><p className="text-lg font-bold text-orange-700 dark:text-orange-400">MTD for Income Tax applies from April 2026</p><p className="text-sm text-muted-foreground mt-1">Income {formatCurrency(result.totalQualifying)} exceeds £{result.mtdThreshold.toLocaleString()} threshold</p></>
          ) : result.needsMTD2027 ? (
            <><p className="text-lg font-bold text-yellow-700 dark:text-yellow-400">MTD applies from April 2027</p><p className="text-sm text-muted-foreground mt-1">Income {formatCurrency(result.totalQualifying)} exceeds £{result.mtdThreshold2.toLocaleString()} threshold</p></>
          ) : (
            <><p className="text-lg font-bold text-green-700 dark:text-green-400">Not yet required for MTD</p><p className="text-sm text-muted-foreground mt-1">Income {formatCurrency(result.totalQualifying)} below £{result.mtdThreshold2.toLocaleString()}</p></>
          )}
        </div>

        {(result.needsMTD2026 || result.needsMTD2027) && (
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-2">
            <p className="font-medium text-foreground">What MTD means for you:</p>
            <p>• Keep digital records using HMRC-compatible software (~{formatCurrency(result.annualSoftwareCost)}/year)</p>
            <p>• Submit {result.quarterlyReturns} quarterly updates + {result.endOfYearReturn} end-of-year declaration</p>
            <p>• Replaces annual self-assessment tax return</p>
            <p>• Deadline: April 2026 (over £50K) or April 2027 (over £30K)</p>
          </div>
        )}
      </div>
    </div>
  )
}
