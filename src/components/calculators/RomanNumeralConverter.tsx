import { useState } from 'react'

const ROMAN_MAP: [string, number][] = [['M',1000],['CM',900],['D',500],['CD',400],['C',100],['XC',90],['L',50],['XL',40],['X',10],['IX',9],['V',5],['IV',4],['I',1]]
const SYMBOLS: Record<string, number> = { I:1, V:5, X:10, L:50, C:100, D:500, M:1000 }
const RANGE_MESSAGE = 'Roman numerals here run from 1 to 3,999.'

function toRoman(num: number): string {
  let result = ''
  let n = num
  for (const [roman, value] of ROMAN_MAP) {
    while (n >= value) { result += roman; n -= value }
  }
  return result
}

function total(values: number[]): number {
  return values.reduce((sum, curr, i) => sum + (curr < (values[i + 1] ?? 0) ? -curr : curr), 0)
}

// A non-standard string has one sensible reading only if it simply adds up, as
// IIII does, or has a single subtraction in the right place, as IC does. V, L
// and D are never subtracted, and IIX or XCX have no agreed value.
function hasClearReading(values: number[]): boolean {
  const pairs = values.flatMap((v, i) => (v < (values[i + 1] ?? 0) ? [i] : []))
  if (pairs.length === 0) return true
  if (pairs.length > 1) return false
  const at = pairs[0]
  const low = values[at]
  const high = values[at + 1]
  if (low === 5 || low === 50 || low === 500) return false
  if (values.slice(0, at).some((v) => (high === 1000 ? v < high : v <= high))) return false
  return !values.slice(at + 2).some((v) => v >= low)
}

function fromRoman(s: string): { value: number } | { error: string } | null {
  const upper = s.toUpperCase().trim()
  if (!upper) return null
  if (!/^[IVXLCDM]+$/.test(upper)) return { error: 'Use only the letters I, V, X, L, C, D and M.' }
  const values = [...upper].map((c) => SYMBOLS[c])
  const value = total(values)
  if (value >= 1 && value <= 3999 && toRoman(value) === upper) return { value }
  if (!hasClearReading(values)) return { error: `"${upper}" is not a standard Roman numeral and has no agreed value. Check the symbols and their order.` }
  if (value > 3999) return { error: `"${upper}" would be ${value.toLocaleString('en-GB')}, above the 3,999 that standard numerals reach.` }
  if (upper === 'IIII') return { error: `"IIII" appears on some clock faces, but the standard form of 4 is IV.` }
  return { error: `"${upper}" is not a standard Roman numeral. It reads as ${value}, and the standard form is ${toRoman(value)}.` }
}

export default function RomanNumeralConverter() {
  const [decimal, setDecimal] = useState('2026')
  const [roman, setRoman] = useState('MMXXVI')

  const d = Number(decimal)
  const decimalEntered = decimal.trim() !== ''
  const inRange = decimalEntered && Number.isInteger(d) && d >= 1 && d <= 3999
  const decimalMessage = !decimalEntered || inRange ? '' : Number.isInteger(d) ? RANGE_MESSAGE : 'Enter a whole number from 1 to 3,999.'
  const romanResult = inRange ? toRoman(d) : ''
  const decimalResult = fromRoman(roman)

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-border p-5 space-y-4">
        <h3 className="font-semibold">Decimal to Roman</h3>
        <div className="grid grid-cols-2 gap-4 items-end">
          <div><label className="block text-sm font-medium mb-2">Number (1-3999)</label><input type="number" min="1" max="3999" value={decimal} onChange={(e) => setDecimal(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Number (1-3999)" /></div>
          <div className="rounded-xl bg-primary/10 p-3 text-center"><p className="text-2xl font-bold text-primary font-serif tracking-widest">{romanResult || '—'}</p></div>
        </div>
        {decimalMessage && <p role="alert" className="text-sm text-destructive">{decimalMessage}</p>}
      </div>

      <div className="rounded-xl border border-border p-5 space-y-4">
        <h3 className="font-semibold">Roman to Decimal</h3>
        <div className="grid grid-cols-2 gap-4 items-end">
          <div><label className="block text-sm font-medium mb-2">Roman Numeral</label><input type="text" value={roman} onChange={(e) => setRoman(e.target.value.toUpperCase())} placeholder="MMXXVI" className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-bold uppercase tracking-widest font-serif focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Roman Numeral" /></div>
          <div className="rounded-xl bg-primary/10 p-3 text-center"><p className="text-2xl font-bold text-primary">{decimalResult && 'value' in decimalResult ? decimalResult.value : '—'}</p></div>
        </div>
        {decimalResult && 'error' in decimalResult && <p role="alert" className="text-sm text-destructive">{decimalResult.error}</p>}
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {[{d:1,r:'I'},{d:5,r:'V'},{d:10,r:'X'},{d:50,r:'L'},{d:100,r:'C'},{d:500,r:'D'},{d:1000,r:'M'}].map(({d,r}) => (
          <div key={d} className="rounded-lg bg-muted px-3 py-1.5 text-sm"><span className="font-serif font-bold">{r}</span> = {d}</div>
        ))}
      </div>
    </div>
  )
}
