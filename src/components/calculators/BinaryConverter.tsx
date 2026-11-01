import { useState } from 'react'

type Base = 'decimal' | 'binary' | 'hex' | 'octal'

const BASES: Record<Base, { name: string; prefix: string; digits: RegExp; rule: string }> = {
  decimal: { name: 'decimal', prefix: '', digits: /^[0-9]$/, rule: 'Decimal uses only 0 to 9, with no separators.' },
  binary: { name: 'binary', prefix: '0b', digits: /^[01]$/, rule: 'Binary uses only 0 and 1.' },
  hex: { name: 'hexadecimal', prefix: '0x', digits: /^[0-9a-f]$/i, rule: 'Hexadecimal uses only 0 to 9 and A to F.' },
  octal: { name: 'octal', prefix: '0o', digits: /^[0-7]$/, rule: 'Octal uses only 0 to 7.' },
}

const MAX_DIGITS = 4096

const withArticle = (name: string) => `${name === 'octal' ? 'an' : 'a'} ${name}`

// BigInt keeps every digit, so 64-bit values and beyond stay exact
function parseInput(raw: string, from: Base): { value: bigint } | { error: string } {
  const compact = raw.replace(/\s+/g, '')
  const negative = compact.startsWith('-')
  let body = compact.replace(/^[-+]/, '')

  const wrongPrefix = (mark: string, base: Base) => ({ error: `${mark} marks ${withArticle(BASES[base].name)} number. Choose ${BASES[base].name} as the input base.` })
  if (body.startsWith('#')) {
    if (from !== 'hex') return wrongPrefix('#', 'hex')
    body = body.slice(1)
  } else if (/^0x/i.test(body)) {
    if (from !== 'hex') return wrongPrefix('0x', 'hex')
    body = body.slice(2)
  } else if (/^0o/i.test(body)) {
    if (from !== 'octal') return wrongPrefix('0o', 'octal')
    body = body.slice(2)
  } else if (/^0b/i.test(body) && from !== 'hex') {
    // In hexadecimal 0B is a pair of ordinary digits
    if (from !== 'binary') return wrongPrefix('0b', 'binary')
    body = body.slice(2)
  }

  if (!body) return { error: 'Enter at least one digit.' }
  if (body.includes('.')) return { error: 'This converter handles whole numbers only, so fractions cannot be converted.' }
  if (body.length > MAX_DIGITS) return { error: `Enter ${MAX_DIGITS.toLocaleString('en-GB')} digits or fewer.` }

  const { name, prefix, digits, rule } = BASES[from]
  const bad = [...body].find((c) => !digits.test(c))
  if (bad) return { error: `"${bad}" is not ${withArticle(name)} digit. ${rule}` }

  const magnitude = BigInt(prefix + body)
  return { value: negative ? -magnitude : magnitude }
}

// Smallest common width that holds the value, as stored two's complement bits
function twosComplement(value: bigint) {
  for (const width of [8, 16, 32, 64]) {
    if (value >= -(BigInt(1) << BigInt(width - 1))) {
      return { width, bits: BigInt.asUintN(width, value).toString(2).padStart(width, '0') }
    }
  }
  return null
}

function convert(input: string, from: Base) {
  const parsed = parseInput(input, from)
  if ('error' in parsed) return parsed
  const { value } = parsed
  return {
    decimal: value.toString(10),
    binary: value.toString(2),
    hex: value.toString(16).toUpperCase(),
    octal: value.toString(8),
    negative: value < BigInt(0),
    stored: value < BigInt(0) ? twosComplement(value) : null,
  }
}

export default function BinaryConverter() {
  const [input, setInput] = useState('255')
  const [from, setFrom] = useState<Base>('decimal')
  const result = input.trim() ? convert(input.trim(), from) : null
  const output = result && !('error' in result) ? result : null

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Input</label>
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="255" className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-mono font-medium focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Input" />
          <p className="text-xs text-muted-foreground mt-1">Whole numbers only. Spaces and the prefixes 0b, 0o, 0x and # are accepted.</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Input Base</label>
          <select value={from} onChange={(e) => setFrom(e.target.value as Base)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Input Base">
            <option value="decimal">Decimal (Base 10)</option>
            <option value="binary">Binary (Base 2)</option>
            <option value="hex">Hexadecimal (Base 16)</option>
            <option value="octal">Octal (Base 8)</option>
          </select>
        </div>
      </div>

      {result && 'error' in result && (
        <p role="alert" className="text-sm text-destructive">{result.error}</p>
      )}

      {output && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in-up">
          <div className={`rounded-xl p-4 text-center ${from === 'decimal' ? 'bg-primary/10 border-2 border-primary' : 'border border-border'}`}><p className="text-xs text-muted-foreground">Decimal</p><p className="text-lg font-bold font-mono break-all">{output.decimal}</p></div>
          <div className={`rounded-xl p-4 text-center ${from === 'binary' ? 'bg-primary/10 border-2 border-primary' : 'border border-border'}`}><p className="text-xs text-muted-foreground">Binary</p><p className="text-lg font-bold font-mono break-all">{output.binary}</p></div>
          <div className={`rounded-xl p-4 text-center ${from === 'hex' ? 'bg-primary/10 border-2 border-primary' : 'border border-border'}`}><p className="text-xs text-muted-foreground">Hexadecimal</p><p className="text-lg font-bold font-mono break-all">{output.hex}</p></div>
          <div className={`rounded-xl p-4 text-center ${from === 'octal' ? 'bg-primary/10 border-2 border-primary' : 'border border-border'}`}><p className="text-xs text-muted-foreground">Octal</p><p className="text-lg font-bold font-mono break-all">{output.octal}</p></div>
        </div>
      )}

      {output?.negative && (
        <div className="rounded-xl border border-border p-4 text-sm space-y-1">
          <p className="text-muted-foreground">Negative numbers above are shown as a minus sign plus the size of the number.</p>
          {output.stored
            ? <p>{output.stored.width}-bit two&apos;s complement: <span className="font-mono font-bold break-all">{output.stored.bits}</span></p>
            : <p className="text-muted-foreground">This value is too large for 64-bit two&apos;s complement.</p>}
        </div>
      )}
    </div>
  )
}
