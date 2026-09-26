import { useState, useMemo } from 'react'
import { formatCurrency, ukIncomeTax } from '@/utils'

// Teacher pay scales 2026/27 (England, outside London): STRB 36th report Appendix F, 3.5% award from
// 1 September 2026, accepted in full on 1 July 2026. STPCD 2026 is due mid-October 2026, backdated.
const MAIN_SCALE = [34_069, 36_042, 38_400, 40_941, 43_529, 46_940]
const UPPER_SCALE = [49_134, 50_956, 52_835]
// London pay ranges from 1 September 2026 (same source). M1/M6 and U1/U3 are the statutory range
// limits; the points between are the advisory scales.
const LONDON_MAIN: Record<string, number[]> = {
  inner: [41_729, 43_713, 45_787, 47_961, 50_666, 54_131],
  outer: [39_196, 41_246, 43_403, 45_673, 48_438, 52_241],
  fringe: [35_602, 37_647, 39_979, 42_513, 45_070, 48_479],
}
const LONDON_UPPER: Record<string, number[]> = {
  inner: [59_650, 62_581, 64_684],
  outer: [54_047, 56_047, 58_120],
  fringe: [50_625, 52_442, 54_328],
}
const LEADERSHIP: Record<string, { min: number; max: number }> = {
  'Head (Group 1)': { min: 60_619, max: 80_652 },
  'Head (Group 4)': { min: 73_827, max: 100_536 },
  'Head (Group 8)': { min: 104_059, max: 148_829 },
}

type Scale = 'main' | 'upper' | 'leadership'

function calculate(scale: Scale, point: number, leadershipGroup: string, isLondon: string) {
  // London teachers are paid on separate ranges rather than a flat add-on.
  const main = LONDON_MAIN[isLondon] ?? MAIN_SCALE
  const upper = LONDON_UPPER[isLondon] ?? UPPER_SCALE
  let salary: number
  if (scale === 'main') salary = main[Math.min(point, main.length - 1)] || main[0]
  else if (scale === 'upper') salary = upper[Math.min(point, upper.length - 1)] || upper[0]
  else {
    // Leadership is shown at England (excluding London) rates.
    const group = LEADERSHIP[leadershipGroup] || LEADERSHIP['Head (Group 1)']
    salary = group.min + (group.max - group.min) * (point / 100)
  }

  // Teachers' Pension Scheme — tiered member contribution rate by salary band
  // (2026/27 bands, uprated 3.8% CPI from 1 April 2026). Source: teacherspensions.co.uk.
  const tpsRate =
    salary < 36_199 ? 0.074 :
    salary < 48_728 ? 0.089 :
    salary < 57_777 ? 0.099 :
    salary < 76_573 ? 0.105 :
    salary < 104_414 ? 0.116 : 0.12
  const pension = salary * tpsRate

  // TPS uses a net-pay arrangement: pension is deducted before income tax (automatic relief),
  // so income tax is charged on salary minus pension. NI is still charged on full salary.
  const taxablePay = Math.max(0, salary - pension)
  const tax = ukIncomeTax(taxablePay)
  let ni = 0
  if (salary > 12_570) {
    if (salary <= 50_270) ni = (salary - 12_570) * 0.08
    else ni = (50_270 - 12_570) * 0.08 + (salary - 50_270) * 0.02
  }
  const takeHome = salary - tax - ni - pension

  return { salary, tax, ni, pension, pensionRate: tpsRate, takeHome, monthly: takeHome / 12 }
}

export default function TeacherPayCalculator() {
  const [scale, setScale] = useState<Scale>('main')
  const [point, setPoint] = useState(2)
  const [leadership, setLeadership] = useState('Head (Group 1)')
  const [london, setLondon] = useState('none')

  const result = useMemo(() => calculate(scale, point, leadership, london), [scale, point, leadership, london])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium mb-2">Pay Scale</label><select value={scale} onChange={(e) => { setScale(e.target.value as Scale); setPoint(0) }} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Pay Scale"><option value="main">Main Pay Scale (M1-M6)</option><option value="upper">Upper Pay Scale (UPS1-3)</option><option value="leadership">Leadership</option></select></div>
        {scale !== 'leadership' ? (
          <div><label className="block text-sm font-medium mb-2">Pay Point</label><select value={point} onChange={(e) => setPoint(parseInt(e.target.value))} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Pay Point">{(scale === 'main' ? MAIN_SCALE : UPPER_SCALE).map((_, i) => <option key={i} value={i}>{scale === 'main' ? `M${i+1}` : `UPS${i+1}`}</option>)}</select></div>
        ) : (
          <><div><label className="block text-sm font-medium mb-2">Leadership Group</label><select value={leadership} onChange={(e) => setLeadership(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Leadership Group">{Object.keys(LEADERSHIP).map(k => <option key={k} value={k}>{k}</option>)}</select></div>
          <div><label className="block text-sm font-medium mb-2">Point in Range (%)</label><input type="range" min="0" max="100" value={point} onChange={(e) => setPoint(parseInt(e.target.value))} className="w-full mt-3"  aria-label="Point in Range (%)" /></div></>
        )}
        <div><label className="block text-sm font-medium mb-2">London</label><select value={london} disabled={scale === 'leadership'} onChange={(e) => setLondon(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="London"><option value="none">Rest of England</option><option value="inner">Inner London</option><option value="outer">Outer London</option><option value="fringe">London Fringe</option></select></div>
      </div>

      <div className="space-y-4 animate-fade-in-up">
        <div className="rounded-2xl bg-primary/10 p-6 text-center">
          <p className="text-sm text-muted-foreground">Annual Salary</p>
          <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.salary)}</p>
          <p className="text-sm text-muted-foreground mt-1">Take home: {formatCurrency(result.monthly)}/month</p>
        </div>
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-border/50"><td className="py-2">Gross Salary</td><td className="text-right tabular-nums font-medium">{formatCurrency(result.salary)}</td></tr>
            <tr className="border-b border-border/50"><td className="py-2 text-destructive">Income Tax</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.tax)}</td></tr>
            <tr className="border-b border-border/50"><td className="py-2 text-destructive">National Insurance</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.ni)}</td></tr>
            <tr className="border-b border-border/50"><td className="py-2">Teachers' Pension ({(result.pensionRate * 100).toFixed(1)}%)</td><td className="text-right tabular-nums">-{formatCurrency(result.pension)}</td></tr>
            <tr className="font-semibold"><td className="py-2 text-primary">Take-Home</td><td className="text-right tabular-nums text-primary">{formatCurrency(result.takeHome)}</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
