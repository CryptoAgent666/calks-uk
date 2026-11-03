import { useState, useMemo } from 'react'
import { formatCurrency, ukIncomeTax } from '@/utils'

// Teacher pay scales 2026/27 (England, outside London): STPCD 2026 (published 16 October 2026), matching
// STRB 36th report Appendix F, 3.5% award from 1 September 2026.
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
// Headteacher group ranges from 1 September 2026, STPCD 2026 Table 2: [min, max] by pay area.
const LEADERSHIP: Record<string, Record<string, [number, number]>> = {
  'Head (Group 1)': { none: [60_619, 80_652], inner: [70_754, 90_686], outer: [64_871, 84_865], fringe: [62_102, 82_118] },
  'Head (Group 2)': { none: [63_688, 86_796], inner: [73_824, 96_831], outer: [67_940, 91_010], fringe: [65_166, 88_273] },
  'Head (Group 3)': { none: [68_691, 93_414], inner: [78_820, 103_450], outer: [72_940, 97_624], fringe: [70_169, 94_885] },
  'Head (Group 4)': { none: [73_827, 100_536], inner: [83_960, 110_562], outer: [78_074, 104_742], fringe: [75_310, 101_999] },
  'Head (Group 5)': { none: [81_457, 110_881], inner: [91_594, 120_916], outer: [85_715, 115_095], fringe: [82_939, 112_353] },
  'Head (Group 6)': { none: [87_664, 122_305], inner: [97_799, 132_339], outer: [91_921, 126_515], fringe: [89_153, 123_776] },
  'Head (Group 7)': { none: [94_349, 134_834], inner: [104_485, 144_864], outer: [98_602, 139_041], fringe: [95_836, 136_298] },
  'Head (Group 8)': { none: [104_059, 148_829], inner: [114_189, 158_863], outer: [108_311, 153_042], fringe: [105_536, 150_301] },
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
    const group = LEADERSHIP[leadershipGroup] || LEADERSHIP['Head (Group 1)']
    const [min, max] = group[isLondon] ?? group.none
    salary = min + (max - min) * (point / 100)
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
        <div><label className="block text-sm font-medium mb-2">London</label><select value={london} onChange={(e) => setLondon(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="London"><option value="none">Rest of England</option><option value="inner">Inner London</option><option value="outer">Outer London</option><option value="fringe">London Fringe</option></select></div>
      </div>

      <div className="space-y-4 animate-fade-in-up">
        <div className="rounded-2xl bg-primary/10 p-6 text-center">
          <p className="text-sm text-muted-foreground">Annual Salary</p>
          <p className="text-3xl font-bold text-primary mt-1">{formatCurrency(result.salary)}</p>
          <p className="text-sm text-muted-foreground mt-1">Take home before any student loan: {formatCurrency(result.monthly)}/month</p>
        </div>
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-border/50"><td className="py-2">Gross Salary</td><td className="text-right tabular-nums font-medium">{formatCurrency(result.salary)}</td></tr>
            <tr className="border-b border-border/50"><td className="py-2 text-destructive">Income Tax</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.tax)}</td></tr>
            <tr className="border-b border-border/50"><td className="py-2 text-destructive">National Insurance</td><td className="text-right tabular-nums text-destructive">-{formatCurrency(result.ni)}</td></tr>
            <tr className="border-b border-border/50"><td className="py-2">Teachers' Pension ({(result.pensionRate * 100).toFixed(1)}%)</td><td className="text-right tabular-nums">-{formatCurrency(result.pension)}</td></tr>
            <tr className="font-semibold"><td className="py-2 text-primary">Take-Home (before student loan)</td><td className="text-right tabular-nums text-primary">{formatCurrency(result.takeHome)}</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
