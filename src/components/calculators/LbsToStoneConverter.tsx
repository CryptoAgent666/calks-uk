import { useMemo } from 'react'
import ShareRow, { useUrlParam } from '@/components/ShareRow'
import { lbToKg, lbToStLb, fmtKg, fmtStLb, fmtNum, fmt1, LB_PER_ST, OZ_PER_LB } from '@/data/weight-units'

// The conversion maths lives in src/data/weight-units.ts, which also generates
// the 100 lb to 300 lb chart on this page, so the live answer and the chart agree.
const QUICK_LB = [120, 140, 160, 180, 200, 220]

export default function LbsToStoneConverter() {
  // ?lb=121.3 is applied after mount by useUrlParam (never read the URL during render: React #418)
  const [lb, setLb] = useUrlParam('lb', '170')
  const v = Math.max(0, parseFloat(lb) || 0)

  const r = useMemo(() => ({ stLb: lbToStLb(v), kg: lbToKg(v), oz: v * OZ_PER_LB, decimalSt: v / LB_PER_ST }), [v])

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="lbs-to-stone-input" className="block text-sm font-medium mb-2">Weight in pounds</label>
        <div className="relative">
          <input
            id="lbs-to-stone-input"
            type="number"
            inputMode="decimal"
            min="0"
            step="0.1"
            value={lb}
            onChange={(e) => setLb(e.target.value)}
            className="w-full rounded-xl border border-input bg-background px-4 py-3 pr-14 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Weight in pounds"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">lb</span>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {QUICK_LB.map((q) => (
            <button key={q} type="button" onClick={() => setLb(String(q))} className="px-3 py-1.5 rounded-lg bg-muted text-sm font-medium hover:bg-accent transition-colors">
              {`${q} lb`}
            </button>
          ))}
        </div>
      </div>

      {v > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-muted/50 p-6 text-center">
            <p className="text-sm text-muted-foreground mb-1">Pounds to stone and kilograms</p>
            <p className="text-2xl sm:text-3xl font-bold text-primary">{`${fmtNum(v)} lb = ${fmtStLb(r.stLb)}`}</p>
            <p className="text-lg font-semibold mt-1">{`= ${fmtKg(r.kg)} kg`}</p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl border border-border p-3 text-center">
              <p className="text-xs text-muted-foreground">Kilograms</p>
              <p className="text-sm font-bold">{`${fmtKg(r.kg)} kg`}</p>
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
            Stones are whole pounds divided by 14; the remainder is shown to one decimal place. 1 lb = 0.45359237 kg exactly.
          </p>

          <ShareRow params={{ lb }} />
        </div>
      )}
    </div>
  )
}
