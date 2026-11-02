import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function calculate(pension1: number, pension2: number, sharingPct: number) {
  const totalPension = pension1 + pension2

  const person1Share = totalPension * (sharingPct / 100)
  const person2Share = totalPension * ((100 - sharingPct) / 100)

  // What has to move to reach the chosen split, and that amount as a percentage of the
  // payer's own CETV, which is the figure a pension sharing order names
  const person1Pays = pension1 > person1Share
  const transferNeeded = Math.abs(pension1 - person1Share)
  const payerPension = person1Pays ? pension1 : pension2
  const orderPct = payerPension > 0 ? (transferNeeded / payerPension) * 100 : 0

  return { totalPension, person1Share, person2Share, person1Pays, transferNeeded, payerPension, orderPct }
}

export default function PensionSharingDivorceCalculator() {
  const [p1, setP1] = useState('200000')
  const [p2, setP2] = useState('50000')
  const [share, setShare] = useState('50')

  const parsedShare = parseFloat(share)
  const sharePct = Number.isNaN(parsedShare) ? 50 : parsedShare // 0% (all to Person 2) is a real choice
  const result = useMemo(() => calculate(parseFloat(p1.replace(/,/g,''))||0, parseFloat(p2.replace(/,/g,''))||0, sharePct), [p1,p2,sharePct])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Person 1 Pension (CETV)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={p1} onChange={(e) => setP1(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Person 1 Pension (CETV)" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Person 2 Pension (CETV)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={p2} onChange={(e) => setP2(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Person 2 Pension (CETV)" /></div></div>
      </div>
      <div><label className="block text-sm font-medium mb-2">Sharing Split: Person 1 gets {share}% of the combined pensions</label><input type="range" min="0" max="100" value={share} onChange={(e) => setShare(e.target.value)} className="w-full" /><div className="flex justify-between text-xs text-muted-foreground"><span>0% (all to P2)</span><span className="font-bold">{share}% / {100 - parseInt(share)}%</span><span>100% (all to P1)</span></div></div>

      <div className="space-y-4 animate-fade-in-up">
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-primary/10 p-5 text-center"><p className="text-sm font-medium">Person 1</p><p className="text-2xl font-bold text-primary mt-1">{formatCurrency(result.person1Share)}</p><p className="text-xs text-muted-foreground">pension pot at these CETVs</p></div>
          <div className="rounded-xl bg-muted/50 p-5 text-center"><p className="text-sm font-medium">Person 2</p><p className="text-2xl font-bold mt-1">{formatCurrency(result.person2Share)}</p><p className="text-xs text-muted-foreground">pension pot at these CETVs</p></div>
        </div>
        <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
          <p>Combined pensions: {formatCurrency(result.totalPension)}. {result.transferNeeded > 0.005
            ? <>For a {share}% / {100 - parseInt(share)}% split: a pension sharing order of {+result.orderPct.toFixed(2)}% of {result.person1Pays ? 'Person 1' : 'Person 2'}&apos;s pension in favour of {result.person1Pays ? 'Person 2' : 'Person 1'}, which is about {formatCurrency(result.transferNeeded)} on the {formatCurrency(result.payerPension)} CETV entered. The amount that actually moves is that percentage of the CETV on the valuation day the scheme picks within its 4-month implementation period, so it can differ.</>
            : <>This split needs no transfer.</>}</p>
          <p className="mt-1">Pension Sharing Order (PSO) is a court order, and takes effect only after the final order. Pension Offsetting (keeping pensions, adjusting other assets) is an alternative. The new State Pension itself cannot be shared, though a pension sharing order can share any Additional State Pension or protected payment, and State Pension can be taken into account when offsetting.</p>
        </div>
      </div>
    </div>
  )
}
