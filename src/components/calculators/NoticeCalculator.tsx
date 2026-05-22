import { useState, useMemo } from 'react'

function calculate(yearsService: number, contractWeeks: number) {
  // Statutory minimum: 1 week per year of service, max 12 weeks
  const statutory = yearsService < 1 ? 1 : Math.min(yearsService, 12)
  const contractual = contractWeeks
  const actual = Math.max(statutory, contractual)

  return { statutory, contractual, actual }
}

export default function NoticeCalculator() {
  const [years, setYears] = useState('5')
  const [contract, setContract] = useState('4')

  const y = parseInt(years) || 0
  const c = parseInt(contract) || 0
  const result = useMemo(() => calculate(y, c), [y, c])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Years of Service</label><input type="number" min="0" max="50" value={years} onChange={(e) => setYears(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Years of Service" /></div>
        <div><label className="block text-sm font-medium mb-2">Contract Notice (weeks)</label><input type="number" min="0" max="52" value={contract} onChange={(e) => setContract(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Contract Notice (weeks)" /></div>
      </div>

      <div className="space-y-4 animate-fade-in-up">
        <div className="rounded-2xl bg-primary/10 p-6 text-center">
          <p className="text-sm text-muted-foreground">Your Notice Period</p>
          <p className="text-3xl font-bold text-primary mt-1">{result.actual} week{result.actual !== 1 ? 's' : ''}</p>
          <p className="text-sm text-muted-foreground mt-1">{result.actual === result.contractual ? 'Based on your contract' : 'Based on statutory minimum'}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border p-4 text-center"><p className="text-xs text-muted-foreground">Statutory Minimum</p><p className="text-lg font-bold">{result.statutory} week{result.statutory !== 1 ? 's' : ''}</p></div>
          <div className="rounded-xl border border-border p-4 text-center"><p className="text-xs text-muted-foreground">Contractual</p><p className="text-lg font-bold">{result.contractual} week{result.contractual !== 1 ? 's' : ''}</p></div>
        </div>
        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
          <p>Statutory minimum: 1 week per year of service (max 12 weeks). The longer of statutory or contractual notice applies. During the first month, either party can give reasonable notice.</p>
        </div>
      </div>
    </div>
  )
}
