import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(pension1: number, pension2: number, statePension1: number, statePension2: number, sharingPct: number) {
  const totalPension = pension1 + pension2
  const totalSP = (statePension1 + statePension2) * 52
  const combined = totalPension + totalSP

  const person1Share = totalPension * (sharingPct / 100)
  const person2Share = totalPension * ((100 - sharingPct) / 100)

  const person1Total = person1Share + statePension1 * 52
  const person2Total = person2Share + statePension2 * 52

  const equalSplit = totalPension / 2
  const transferNeeded = Math.abs(pension1 - equalSplit)
  const whoTransfers = pension1 > pension2 ? 'Person 1 → Person 2' : 'Person 2 → Person 1'

  return { totalPension, person1Share, person2Share, person1Total, person2Total, equalSplit, transferNeeded, whoTransfers }
}

export default function PensionSharingDivorceCalculator() {
  const [p1, setP1] = useState('200000')
  const [p2, setP2] = useState('50000')
  const [sp1, setSp1] = useState('230')
  const [sp2, setSp2] = useState('180')
  const [share, setShare] = useState('50')

  const result = useMemo(() => calculate(parseFloat(p1.replace(/,/g,''))||0, parseFloat(p2.replace(/,/g,''))||0, parseFloat(sp1)||0, parseFloat(sp2)||0, parseFloat(share)||50), [p1,p2,sp1,sp2,share])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Person 1 Pension</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={p1} onChange={(e) => setP1(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Person 2 Pension</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={p2} onChange={(e) => setP2(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div></div>
        <div><label className="block text-sm font-medium mb-2">P1 State Pension (£/wk)</label><input type="number" min="0" max="300" value={sp1} onChange={(e) => setSp1(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div><label className="block text-sm font-medium mb-2">P2 State Pension (£/wk)</label><input type="number" min="0" max="300" value={sp2} onChange={(e) => setSp2(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" /></div>
      </div>
      <div><label className="block text-sm font-medium mb-2">Sharing Split: Person 1 gets {share}%</label><input type="range" min="0" max="100" value={share} onChange={(e) => setShare(e.target.value)} className="w-full" /><div className="flex justify-between text-xs text-muted-foreground"><span>0% (all to P2)</span><span className="font-bold">{share}% / {100 - parseInt(share)}%</span><span>100% (all to P1)</span></div></div>

      <div className="space-y-4 animate-fade-in-up">
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-primary/10 p-5 text-center"><p className="text-sm font-medium">Person 1</p><p className="text-2xl font-bold text-primary mt-1">{formatCurrency(result.person1Share)}</p><p className="text-xs text-muted-foreground">+ SP: {formatCurrency(result.person1Total)} total</p></div>
          <div className="rounded-xl bg-muted/50 p-5 text-center"><p className="text-sm font-medium">Person 2</p><p className="text-2xl font-bold mt-1">{formatCurrency(result.person2Share)}</p><p className="text-xs text-muted-foreground">+ SP: {formatCurrency(result.person2Total)} total</p></div>
        </div>
        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
          <p>Combined pensions: {formatCurrency(result.totalPension)}. For equal split: {result.whoTransfers} transfers {formatCurrency(result.transferNeeded)}.</p>
          <p className="mt-1">Pension Sharing Order (PSO) is a court order. Pension Offsetting (keeping pensions, adjusting other assets) is an alternative. State Pension cannot be shared but can be considered for offsetting.</p>
        </div>
      </div>
    </div>
  )
}
