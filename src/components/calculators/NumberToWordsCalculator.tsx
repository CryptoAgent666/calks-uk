import { useState } from 'react'

const ONES = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']

function toWords(n: number): string {
  if (n === 0) return 'zero'
  if (n < 0) return 'minus ' + toWords(-n)
  if (n >= 1e15) return 'number too large'

  const parts: string[] = []
  const trillion = Math.floor(n / 1e12)
  const billion = Math.floor((n % 1e12) / 1e9)
  const million = Math.floor((n % 1e9) / 1e6)
  const thousand = Math.floor((n % 1e6) / 1e3)
  const remainder = Math.floor(n % 1e3)

  if (trillion) parts.push(chunk(trillion) + ' trillion')
  if (billion) parts.push(chunk(billion) + ' billion')
  if (million) parts.push(chunk(million) + ' million')
  if (thousand) parts.push(chunk(thousand) + ' thousand')
  if (remainder) {
    if (parts.length > 0 && remainder < 100) parts.push('and ' + chunk(remainder))
    else parts.push(chunk(remainder))
  }

  return parts.join(', ')
}

function chunk(n: number): string {
  if (n === 0) return ''
  if (n < 20) return ONES[n]
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? '-' + ONES[n % 10] : '')
  const h = ONES[Math.floor(n / 100)] + ' hundred'
  const rem = n % 100
  return rem ? h + ' and ' + chunk(rem) : h
}

function toCheque(n: number): string {
  const pounds = Math.floor(n)
  const pence = Math.round((n - pounds) * 100)
  let result = toWords(pounds) + ' pound' + (pounds !== 1 ? 's' : '')
  if (pence > 0) result += ' and ' + toWords(pence) + ' pence'
  return result
}

export default function NumberToWordsCalculator() {
  const [number, setNumber] = useState('')
  const n = parseFloat(number.replace(/,/g, ''))
  const isValid = !isNaN(n) && isFinite(n)

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Enter a Number</label>
        <input type="text" inputMode="numeric" value={number} onChange={(e) => setNumber(e.target.value)} placeholder="1,234,567" className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Enter a Number" />
      </div>

      {isValid && number.trim() !== '' && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-xl bg-primary/10 p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">In Words</p>
            <p className="text-xl font-bold text-primary capitalize">{toWords(Math.floor(n))}</p>
          </div>
          <div className="rounded-xl border border-border p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Cheque Format (GBP)</p>
            <p className="text-lg font-semibold capitalize">{toCheque(Math.abs(n))}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Digits</p><p className="text-lg font-bold">{Math.floor(Math.abs(n)).toString().length}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Formatted</p><p className="text-lg font-bold">{n.toLocaleString('en-GB')}</p></div>
          </div>
        </div>
      )}
    </div>
  )
}
