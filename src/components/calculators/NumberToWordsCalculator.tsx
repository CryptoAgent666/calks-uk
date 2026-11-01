import { useState } from 'react'

const ONES = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']
const MAX_WHOLE_DIGITS = 15 // up to 999,999,999,999,999, all exact in a double

function toWords(n: number): string {
  if (n === 0) return 'zero'

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

  const groups = parts.join(', ')
  if (!remainder) return groups
  if (!groups) return chunk(remainder)
  return groups + (remainder < 100 ? ' and ' : ', ') + chunk(remainder)
}

function chunk(n: number): string {
  if (n === 0) return ''
  if (n < 20) return ONES[n]
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? '-' + ONES[n % 10] : '')
  const h = ONES[Math.floor(n / 100)] + ' hundred'
  const rem = n % 100
  return rem ? h + ' and ' + chunk(rem) : h
}

// Accepts 1234.5, 1,234.5, £1,234.50 and -£5. Commas must group thousands, so 1,2 is rejected.
function parseAmount(raw: string) {
  const m = raw.trim().match(/^(-?)(?:£\s*)?(-?)(\d{1,3}(?:,\d{3})+|\d*)(?:\.(\d*))?$/)
  if (!m || (m[1] && m[2]) || (!m[3] && !m[4])) return null
  const whole = m[3].replace(/,/g, '').replace(/^0+(?=\d)/, '') || '0'
  const fraction = m[4] || ''
  return { negative: Boolean(m[1] || m[2]) && /[1-9]/.test(whole + fraction), whole, fraction }
}

function numberInWords(negative: boolean, whole: string, fraction: string): string {
  const digits = fraction.split('').map((d) => ONES[Number(d)] || 'zero').join(' ')
  return (negative ? 'minus ' : '') + toWords(Number(whole)) + (digits ? ' point ' + digits : '')
}

function toCheque(whole: string, fraction: string): string | null {
  const digits = fraction + '000'
  let pounds = Number(whole)
  let pence = Number(digits.slice(0, 2)) + (digits[2] >= '5' ? 1 : 0)
  if (pence === 100) {
    pounds += 1
    pence = 0
  }
  if (String(pounds).length > MAX_WHOLE_DIGITS) return null
  const poundsText = toWords(pounds) + ' pound' + (pounds !== 1 ? 's' : '')
  const penceText = toWords(pence) + (pence === 1 ? ' penny' : ' pence')
  if (pounds > 0 && pence > 0) return poundsText + ' and ' + penceText + ' only'
  return (pence > 0 ? penceText : poundsText) + ' only'
}

export default function NumberToWordsCalculator() {
  const [number, setNumber] = useState('')
  const parsed = parseAmount(number)
  const isValid = parsed !== null && parsed.whole.length <= MAX_WHOLE_DIGITS
  const error = number.trim() === '' || isValid
    ? ''
    : parsed
      ? 'Enter a number below one quadrillion (up to 999,999,999,999,999).'
      : 'Enter digits only, with commas between thousands, for example 1,234.56 or £2,547.83.'
  const cheque = isValid && !parsed.negative ? toCheque(parsed.whole, parsed.fraction) : null

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Enter a Number</label>
        <input type="text" inputMode="decimal" value={number} onChange={(e) => setNumber(e.target.value)} placeholder="1,234,567" className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Enter a Number" />
        {error && <p className="mt-2 text-sm text-destructive" role="alert">{error}</p>}
      </div>

      {isValid && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-xl bg-primary/10 p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">In Words</p>
            <p className="text-xl font-bold text-primary capitalize">{numberInWords(parsed.negative, parsed.whole, parsed.fraction)}</p>
          </div>
          <div className="rounded-xl border border-border p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Cheque Format (GBP)</p>
            {parsed.negative ? (
              <p className="text-sm text-muted-foreground">A cheque cannot be written for a negative amount.</p>
            ) : cheque ? (
              <>
                <p className="text-lg font-semibold capitalize">{cheque}</p>
                {parsed.fraction.length > 2 && <p className="mt-1 text-xs text-muted-foreground">Rounded to the nearest penny.</p>}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">This amount is too large to convert.</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Digits</p><p className="text-lg font-bold">{parsed.whole.length}</p></div>
            <div className="rounded-xl bg-muted/50 p-3 text-center"><p className="text-xs text-muted-foreground">Formatted</p><p className="text-lg font-bold break-all">{(parsed.negative ? '-' : '') + Number(parsed.whole).toLocaleString('en-GB') + (parsed.fraction ? '.' + parsed.fraction : '')}</p></div>
          </div>
        </div>
      )}
    </div>
  )
}
