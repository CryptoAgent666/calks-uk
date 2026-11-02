import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Hargreaves Lansdown best-buy table, 29 October 2026: best annual income per £100,000 at each
// listed age (https://www.hl.co.uk/retirement/annuities/best-buy-rates). Best of market, average
// postcode, paid monthly in advance; joint life assumes a spouse three years younger.
const QUOTE_AGES = [55, 60, 65, 70, 75]
const MIN_AGE = 55

type AnnuityType = 'single-level' | 'single-level-5' | 'single-rpi-5' | 'single-3-5' | 'joint-level' | 'joint-3'

const ANNUITIES: Record<AnnuityType, { label: string; quotes: number[]; comparedWith?: AnnuityType; lowerThan?: string }> = {
  'single-level': { label: 'Single life, level, no guarantee', quotes: [7_078, 7_476, 8_211, 9_002, 10_212] },
  'single-level-5': { label: 'Single life, level, 5-year guarantee', quotes: [7_070, 7_461, 8_146, 8_886, 9_950] },
  'single-rpi-5': { label: 'Single life, RPI-linked, 5-year guarantee', quotes: [4_486, 4_922, 5_618, 6_417, 7_648], comparedWith: 'single-level-5', lowerThan: 'the level version with the same guarantee' },
  'single-3-5': { label: 'Single life, rising 3% a year, 5-year guarantee', quotes: [4_956, 5_350, 6_094, 6_915, 8_095], comparedWith: 'single-level-5', lowerThan: 'the level version with the same guarantee' },
  'joint-level': { label: 'Joint life 50%, level, no guarantee', quotes: [6_696, 7_144, 7_658, 8_361, 9_146], comparedWith: 'single-level', lowerThan: 'single life, level, no guarantee' },
  'joint-3': { label: 'Joint life 50%, rising 3% a year, no guarantee', quotes: [4_595, 5_034, 5_609, 6_312, 7_266], comparedWith: 'joint-level', lowerThan: 'the level joint-life version' },
}

// Straight line between listed ages. Past 75 the table stops, so this holds the age-75 quote
// and the page says the true figure is that or higher, rather than extrapolating.
function quotePer100k(type: AnnuityType, age: number): number {
  const quotes = ANNUITIES[type].quotes
  if (age >= QUOTE_AGES[QUOTE_AGES.length - 1]) return quotes[quotes.length - 1]
  for (let i = 0; i < QUOTE_AGES.length - 1; i++) {
    if (age >= QUOTE_AGES[i] && age < QUOTE_AGES[i + 1]) {
      const ratio = (age - QUOTE_AGES[i]) / (QUOTE_AGES[i + 1] - QUOTE_AGES[i])
      return quotes[i] + ratio * (quotes[i + 1] - quotes[i])
    }
  }
  return quotes[0]
}

function calculate(pot: number, age: number, takeLumpSum: boolean, type: AnnuityType) {
  const lumpSum = takeLumpSum ? Math.min(pot * 0.25, 268_275) : 0 // capped at the Lump Sum Allowance
  const annuityPot = pot - lumpSum
  const quote = quotePer100k(type, age)
  const rate = quote / 1_000 // % of the pot
  const annualIncome = annuityPot * (rate / 100)
  const monthlyIncome = annualIncome / 12
  const comparedWith = ANNUITIES[type].comparedWith
  const reductionPct = comparedWith ? (1 - quote / quotePer100k(comparedWith, age)) * 100 : 0

  return { lumpSum, annuityPot, rate, annualIncome, monthlyIncome, reductionPct }
}

export default function AnnuityCalculator() {
  const [pot, setPot] = useState('200000')
  const [age, setAge] = useState('65')
  const [lump, setLump] = useState(true)
  const [type, setType] = useState<AnnuityType>('single-level')

  const p = parseFloat(pot.replace(/,/g,'')) || 0
  const a = parseInt(age)
  const validAge = !Number.isNaN(a) && a >= MIN_AGE
  const beyondTable = validAge && a > QUOTE_AGES[QUOTE_AGES.length - 1]
  const result = useMemo(() => calculate(p, validAge ? a : MIN_AGE, lump, type), [p, a, validAge, lump, type])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Pension Pot</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={pot} onChange={(e) => setPot(e.target.value)} className="w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Pension Pot" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Age at Purchase</label><input type="number" min="55" max="85" value={age} onChange={(e) => setAge(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Age at Purchase" /></div>
      </div>
      <div className="space-y-2">
        <div><label className="block text-sm font-medium mb-2">Annuity Type</label><select value={type} onChange={(e) => setType(e.target.value as AnnuityType)} className="w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Annuity Type">{(Object.keys(ANNUITIES) as AnnuityType[]).map((k) => <option key={k} value={k}>{ANNUITIES[k].label}</option>)}</select></div>
        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={lump} onChange={(e) => setLump(e.target.checked)} className="h-5 w-5 rounded border-border" /><span className="text-sm">Take 25% tax-free lump sum</span></label>
      </div>

      {!validAge && (
        <div className="rounded-xl bg-orange-100 dark:bg-orange-950 p-3 text-sm text-orange-800 dark:text-orange-300">Enter an age of 55 or over. You normally cannot swap a pension for an annuity before 55, rising to 57 from 6 April 2028.</div>
      )}

      {validAge && p > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted-foreground">{beyondTable ? 'Estimated Annual Income, before tax: age-75 rate or higher' : 'Estimated Annual Income, before tax'}</p>
            <p className="text-3xl font-bold text-primary mt-1">{beyondTable ? 'From ' : ''}{formatCurrency(result.annualIncome)}</p>
            <p className="text-sm text-muted-foreground mt-1">{formatCurrency(result.monthlyIncome)}/month &middot; {result.rate.toFixed(2)}% annuity rate{beyondTable ? ' at 75' : ''}</p>
            {result.reductionPct > 0 && <p className="text-sm text-muted-foreground mt-1">Starts about {result.reductionPct.toFixed(0)}% lower than {ANNUITIES[type].lowerThan}{beyondTable ? ' at 75' : ''}</p>}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {lump && <div className="rounded-xl bg-green-100 dark:bg-green-950 p-4 text-center"><p className="text-xs text-muted-foreground">Tax-Free Lump Sum</p><p className="text-lg font-bold text-green-700 dark:text-green-400">{formatCurrency(result.lumpSum)}</p></div>}
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Annuity Purchase</p><p className="text-lg font-bold">{formatCurrency(result.annuityPot)}</p></div>
            <div className="rounded-xl bg-muted/50 p-4 text-center"><p className="text-xs text-muted-foreground">Type</p><p className="text-lg font-bold">{type.startsWith('joint') ? 'Joint Life' : 'Single Life'}</p></div>
          </div>
          <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <p>Rates are the best quotes per £100,000 in the <a href="https://www.hl.co.uk/retirement/annuities/best-buy-rates" target="_blank" rel="noopener" className="text-primary underline">Hargreaves Lansdown best-buy table of 29 October 2026</a>, scaled to your pot. They are best of market, not typical, and quotes for other pot sizes and health or lifestyle details will differ. Ages between 55, 60, 65, 70 and 75 are straight-line estimates, and the table stops at 75. Joint-life quotes assume a spouse three years younger.</p>
            <p className="mt-1">The income is taxable through PAYE alongside your other income. Shop around using the Open Market Option.</p>
          </div>
        </div>
      )}
    </div>
  )
}
