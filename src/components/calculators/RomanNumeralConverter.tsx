import { useState } from 'react'

const ROMAN_MAP: [string, number][] = [['M',1000],['CM',900],['D',500],['CD',400],['C',100],['XC',90],['L',50],['XL',40],['X',10],['IX',9],['V',5],['IV',4],['I',1]]

function toRoman(num: number): string {
  if (num <= 0 || num > 3999) return 'Out of range (1-3999)'
  let result = ''
  let n = num
  for (const [roman, value] of ROMAN_MAP) {
    while (n >= value) { result += roman; n -= value }
  }
  return result
}

function fromRoman(s: string): number | null {
  const map: Record<string, number> = { I:1, V:5, X:10, L:50, C:100, D:500, M:1000 }
  const upper = s.toUpperCase().trim()
  if (!/^[IVXLCDM]+$/.test(upper)) return null
  let total = 0
  for (let i = 0; i < upper.length; i++) {
    const curr = map[upper[i]]
    const next = i + 1 < upper.length ? map[upper[i + 1]] : 0
    total += curr < next ? -curr : curr
  }
  return total
}

export default function RomanNumeralConverter() {
  const [decimal, setDecimal] = useState('2025')
  const [roman, setRoman] = useState('MMXXV')

  const d = parseInt(decimal) || 0
  const romanResult = d > 0 ? toRoman(d) : ''
  const decimalResult = fromRoman(roman)

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-border p-5 space-y-4">
        <h3 className="font-semibold">Decimal to Roman</h3>
        <div className="grid grid-cols-2 gap-4 items-end">
          <div><label className="block text-sm font-medium mb-2">Number (1-3999)</label><input type="number" min="1" max="3999" value={decimal} onChange={(e) => setDecimal(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Number (1-3999)" /></div>
          <div className="rounded-xl bg-primary/10 p-3 text-center"><p className="text-2xl font-bold text-primary font-serif tracking-widest">{romanResult}</p></div>
        </div>
      </div>

      <div className="rounded-xl border border-border p-5 space-y-4">
        <h3 className="font-semibold">Roman to Decimal</h3>
        <div className="grid grid-cols-2 gap-4 items-end">
          <div><label className="block text-sm font-medium mb-2">Roman Numeral</label><input type="text" value={roman} onChange={(e) => setRoman(e.target.value.toUpperCase())} placeholder="MMXXV" className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-bold uppercase tracking-widest font-serif focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Roman Numeral" /></div>
          <div className="rounded-xl bg-primary/10 p-3 text-center"><p className="text-2xl font-bold text-primary">{decimalResult !== null ? decimalResult : '—'}</p></div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {[{d:1,r:'I'},{d:5,r:'V'},{d:10,r:'X'},{d:50,r:'L'},{d:100,r:'C'},{d:500,r:'D'},{d:1000,r:'M'}].map(({d,r}) => (
          <div key={d} className="rounded-lg bg-muted px-3 py-1.5 text-sm"><span className="font-serif font-bold">{r}</span> = {d}</div>
        ))}
      </div>
    </div>
  )
}
