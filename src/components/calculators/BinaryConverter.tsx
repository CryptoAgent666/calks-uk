import { useState } from 'react'

type Base = 'decimal' | 'binary' | 'hex' | 'octal'

function convert(input: string, from: Base) {
  let decimal: number
  try {
    switch (from) {
      case 'decimal': decimal = parseInt(input, 10); break
      case 'binary': decimal = parseInt(input, 2); break
      case 'hex': decimal = parseInt(input, 16); break
      case 'octal': decimal = parseInt(input, 8); break
    }
  } catch { return null }
  if (isNaN(decimal)) return null

  return {
    decimal: decimal.toString(10),
    binary: decimal.toString(2),
    hex: decimal.toString(16).toUpperCase(),
    octal: decimal.toString(8),
  }
}

export default function BinaryConverter() {
  const [input, setInput] = useState('255')
  const [from, setFrom] = useState<Base>('decimal')
  const result = input.trim() ? convert(input.trim(), from) : null

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Input</label>
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="255" className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-mono font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Input Base</label>
          <select value={from} onChange={(e) => setFrom(e.target.value as Base)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring">
            <option value="decimal">Decimal (Base 10)</option>
            <option value="binary">Binary (Base 2)</option>
            <option value="hex">Hexadecimal (Base 16)</option>
            <option value="octal">Octal (Base 8)</option>
          </select>
        </div>
      </div>

      {result && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in-up">
          <div className={`rounded-xl p-4 text-center ${from === 'decimal' ? 'bg-primary/10 border-2 border-primary' : 'border border-border'}`}><p className="text-xs text-muted-foreground">Decimal</p><p className="text-lg font-bold font-mono">{result.decimal}</p></div>
          <div className={`rounded-xl p-4 text-center ${from === 'binary' ? 'bg-primary/10 border-2 border-primary' : 'border border-border'}`}><p className="text-xs text-muted-foreground">Binary</p><p className="text-lg font-bold font-mono break-all">{result.binary}</p></div>
          <div className={`rounded-xl p-4 text-center ${from === 'hex' ? 'bg-primary/10 border-2 border-primary' : 'border border-border'}`}><p className="text-xs text-muted-foreground">Hexadecimal</p><p className="text-lg font-bold font-mono">{result.hex}</p></div>
          <div className={`rounded-xl p-4 text-center ${from === 'octal' ? 'bg-primary/10 border-2 border-primary' : 'border border-border'}`}><p className="text-xs text-muted-foreground">Octal</p><p className="text-lg font-bold font-mono">{result.octal}</p></div>
        </div>
      )}
    </div>
  )
}
