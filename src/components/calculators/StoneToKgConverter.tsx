import { useMemo } from 'react'
import ShareRow, { useUrlParam } from '@/components/ShareRow'
import { stLbToLb, lbToKg, lbToStLb, fmtKg, fmtStLb, fmtNum, fmt1, LB_PER_ST, OZ_PER_LB } from '@/data/weight-units'

// The conversion maths lives in src/data/weight-units.ts, which also generates
// the 5 st to 25 st chart on this page, so the live answer and the chart agree.
const QUICK_ST = [8, 9, 10, 11, 12, 13, 14]

export default function StoneToKgConverter() {
  // ?st=10&lb=5 is applied after mount by useUrlParam (never read the URL during render: React #418)
  const [st, setSt] = useUrlParam('st', '10')
  const [lb, setLb] = useUrlParam('lb', '5')
  const stRaw = Math.max(0, parseFloat(st) || 0)
  const stones = Math.floor(stRaw)
  // A decimal stone is a fraction of 14 lb (10.5 st = 10 st 7 lb), so the fraction is carried into the pounds
  const fractionLb = (stRaw - stones) * LB_PER_ST
  const pounds = Math.max(0, parseFloat(lb) || 0) + fractionLb

  const r = useMemo(() => {
    const totalLb = stLbToLb(stones, pounds)
    return { totalLb, kg: lbToKg(totalLb), oz: totalLb * OZ_PER_LB, decimalSt: totalLb / LB_PER_ST, carried: lbToStLb(totalLb) }
  }, [stones, pounds])

  // Echo whole-pound input as typed ("10 st 5 lb"); 14 lb or more is shown carried into the stones
  const shown = pounds < LB_PER_ST ? `${stones} st ${fmtNum(pounds)} lb` : fmtStLb(r.carried)
  const inputClass = 'w-full rounded-xl border border-input bg-background px-4 py-3 pr-12 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring'

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="stone-input" className="block text-sm font-medium mb-2">Stone</label>
          <div className="relative">
            <input id="stone-input" type="number" inputMode="decimal" min="0" step="any" value={st} onChange={(e) => setSt(e.target.value)} className={inputClass} aria-label="Stones" />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">st</span>
          </div>
        </div>
        <div>
          <label htmlFor="pounds-input" className="block text-sm font-medium mb-2">Pounds (0 to 13.9)</label>
          <div className="relative">
            <input id="pounds-input" type="number" inputMode="decimal" min="0" max="13.9" step="0.1" value={lb} onChange={(e) => setLb(e.target.value)} className={inputClass} aria-label="Extra pounds" />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">lb</span>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 -mt-2">
        {QUICK_ST.map((q) => (
          <button key={q} type="button" onClick={() => setSt(String(q))} className="px-3 py-1.5 rounded-lg bg-muted text-sm font-medium hover:bg-accent transition-colors">
            {`${q} st`}
          </button>
        ))}
      </div>

      {r.totalLb > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-muted/50 p-6 text-center">
            <p className="text-sm text-muted-foreground mb-1">Stone and pounds to kilograms</p>
            <p className="text-2xl sm:text-3xl font-bold text-primary">{`${shown} = ${fmtKg(r.kg)} kg`}</p>
            {pounds >= LB_PER_ST && (
              <p className="text-xs text-muted-foreground mt-2">14 lb makes a stone, so the extra pounds have been carried into the stone figure.</p>
            )}
            {fractionLb > 0 && (
              <p className="text-xs text-muted-foreground mt-2">{`${fmtNum(stRaw)} st is read as ${stones} st ${fmtNum(fractionLb)} lb, because a decimal stone is a fraction of 14 lb.`}</p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl border border-border p-3 text-center">
              <p className="text-xs text-muted-foreground">Total pounds</p>
              <p className="text-sm font-bold">{`${fmt1(r.totalLb)} lb`}</p>
            </div>
            <div className="rounded-xl border border-border p-3 text-center">
              <p className="text-xs text-muted-foreground">Decimal stone</p>
              <p className="text-sm font-bold">{`${r.decimalSt.toFixed(2)} st`}</p>
            </div>
            <div className="rounded-xl border border-border p-3 text-center">
              <p className="text-xs text-muted-foreground">Ounces</p>
              <p className="text-sm font-bold">{`${fmt1(r.oz)} oz`}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Kilograms are shown to one decimal place (two below 10 kg). 1 st = 14 lb = 6.35029318 kg and 1 lb = 0.45359237 kg exactly.
          </p>

          <ShareRow params={{ st, lb }} />
        </div>
      )}
    </div>
  )
}
