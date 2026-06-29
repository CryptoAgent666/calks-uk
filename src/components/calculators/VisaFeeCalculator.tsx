import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Fees from Home Office table effective 8 April 2026 (outside UK unless noted)
const VISA_TYPES = [
  { id: 'skilled_worker', name: 'Skilled Worker Visa', fee3yr: 819, fee5yr: 1618, ihsFee: 1035, priority: 500, superPriority: 1000 },
  { id: 'student', name: 'Student Visa', fee3yr: 558, fee5yr: 558, ihsFee: 776, priority: 500, superPriority: 1000 },
  { id: 'spouse', name: 'Spouse / Partner Visa', fee3yr: 2064, fee5yr: 2064, ihsFee: 1035, priority: 500, superPriority: 1000 },
  { id: 'ilr', name: 'Indefinite Leave to Remain (ILR)', fee3yr: 3226, fee5yr: 3226, ihsFee: 0, priority: 500, superPriority: 1000 },
  { id: 'citizenship', name: 'British Citizenship', fee3yr: 1709, fee5yr: 1709, ihsFee: 0, priority: 0, superPriority: 0 },
  { id: 'global_talent', name: 'Global Talent Visa', fee3yr: 766, fee5yr: 766, ihsFee: 1035, priority: 500, superPriority: 1000 },
  { id: 'graduate', name: 'Graduate Visa', fee3yr: 937, fee5yr: 937, ihsFee: 1035, priority: 0, superPriority: 0 },
]

function calculate(visaId: string, duration: string, usePriority: string, dependants: number) {
  const visa = VISA_TYPES.find(v => v.id === visaId)
  if (!visa) return null

  const baseFee = duration === '5yr' ? visa.fee5yr : visa.fee3yr
  const ihsYears = duration === '5yr' ? 5 : 3
  const ihsTotal = visa.ihsFee * ihsYears
  const priorityFee = usePriority === 'super' ? visa.superPriority : usePriority === 'priority' ? visa.priority : 0

  const mainTotal = baseFee + ihsTotal + priorityFee
  const depFee = baseFee * dependants
  const depIhs = ihsTotal * dependants

  const grandTotal = mainTotal + depFee + depIhs

  return { baseFee, ihsTotal, priorityFee, mainTotal, depFee, depIhs, grandTotal, dependants }
}

export default function VisaFeeCalculator() {
  const [visa, setVisa] = useState('skilled_worker')
  const [duration, setDuration] = useState('3yr')
  const [priority, setPriority] = useState('standard')
  const [deps, setDeps] = useState('0')

  const result = useMemo(() => calculate(visa, duration, priority, parseInt(deps)||0), [visa, duration, priority, deps])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Visa Type</label>
          <select value={visa} onChange={(e) => setVisa(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Visa Type">
            {VISA_TYPES.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
          </select></div>
        <div><label className="block text-sm font-medium mb-2">Duration</label>
          <select value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Duration">
            <option value="3yr">Up to 3 years</option><option value="5yr">Up to 5 years</option>
          </select></div>
        <div><label className="block text-sm font-medium mb-2">Processing Speed</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Processing Speed">
            <option value="standard">Standard</option><option value="priority">Priority (+£500)</option><option value="super">Super Priority (+£1,000)</option>
          </select></div>
        <div><label className="block text-sm font-medium mb-2">Dependants</label>
          <input type="number" min="0" max="10" value={deps} onChange={(e) => setDeps(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Dependants" /></div>
      </div>

      {result && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-destructive/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">Total Visa Cost</p>
            <p className="text-3xl font-bold text-destructive mt-1">{formatCurrency(result.grandTotal)}</p>
          </div>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border/50"><td className="py-2">Application fee (main)</td><td className="text-right tabular-nums">{formatCurrency(result.baseFee)}</td></tr>
              {result.ihsTotal > 0 && <tr className="border-b border-border/50"><td className="py-2">Immigration Health Surcharge (IHS)</td><td className="text-right tabular-nums">{formatCurrency(result.ihsTotal)}</td></tr>}
              {result.priorityFee > 0 && <tr className="border-b border-border/50"><td className="py-2">Priority processing</td><td className="text-right tabular-nums">{formatCurrency(result.priorityFee)}</td></tr>}
              {result.dependants > 0 && <tr className="border-b border-border/50"><td className="py-2">Dependant fees ({result.dependants}x)</td><td className="text-right tabular-nums">{formatCurrency(result.depFee + result.depIhs)}</td></tr>}
              <tr className="font-semibold"><td className="py-2">Grand Total</td><td className="text-right tabular-nums text-destructive">{formatCurrency(result.grandTotal)}</td></tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
