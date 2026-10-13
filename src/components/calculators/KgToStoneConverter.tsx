import { useMemo } from 'react'
import ShareRow, { useUrlParam } from '@/components/ShareRow'
import { kgToLb, kgToStLb, fmtStLb, fmtNum, fmt1, OZ_PER_LB, LB_PER_ST } from '@/data/weight-units'

// The conversion maths lives in src/data/weight-units.ts, which also generates
// the 40 kg to 150 kg chart on this page, so the live answer and the chart agree.
const QUICK_KG = [50, 60, 70, 80, 90, 100]

export default function KgToStoneConverter() {
  // ?kg=76.6 is applied after mount by useUrlParam (never read the URL during render: React #418)
  const [kg, setKg] = useUrlParam('kg', '76.6')
  const v = Math.max(0, parseFloat(kg) || 0)

  const r = useMemo(() => {
    const lb = kgToLb(v)
    return { lb, oz: lb * OZ_PER_LB, decimalSt: lb / LB_PER_ST, stLb: kgToStLb(v) }
  }, [v])

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="kg-to-stone-input" className="block text-sm font-medium mb-2">Weight in kilograms</label>
        <div className="relative">
          <input
            id="kg-to-stone-input"
            type="number"
            inputMode="decimal"
            min="0"
            step="0.1"
            value={kg}
            onChange={(e) => setKg(e.target.value)}
            className="w-full rounded-xl border border-input bg-background px-4 py-3 pr-14 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Weight in kilograms"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">kg</span>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {QUICK_KG.map((q) => (
            <button key={q} type="button" onClick={() => setKg(String(q))} className="px-3 py-1.5 rounded-lg bg-muted text-sm font-medium hover:bg-accent transition-colors">
              {`${q} kg`}
            </button>
          ))}
        </div>
      </div>

      {v > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-muted/50 p-6 text-center">
            <p className="text-sm text-muted-foreground mb-1">Kilograms to stone and pounds</p>
            <p className="text-2xl sm:text-3xl font-bold text-primary">{`${fmtNum(v)} kg = ${fmtStLb(r.stLb)}`}</p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl border border-border p-3 text-center">
              <p className="text-xs text-muted-foreground">Pounds</p>
              <p className="text-sm font-bold">{`${fmt1(r.lb)} lb`}</p>
            </div>
            <div className="rounded-xl border border-border p-3 text-center">
              <p className="text-xs text-muted-foreground">Ounces</p>
              <p className="text-sm font-bold">{`${fmt1(r.oz)} oz`}</p>
            </div>
            <div className="rounded-xl border border-border p-3 text-center">
              <p className="text-xs text-muted-foreground">Decimal stone</p>
              <p className="text-sm font-bold">{`${r.decimalSt.toFixed(2)} st`}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Pounds are shown to one decimal place (0.1 lb is 45 g). 1 lb = 0.45359237 kg exactly and 1 st = 14 lb = 6.35029318 kg.
          </p>

          <ShareRow params={{ kg }} />
        </div>
      )}
    </div>
  )
}
