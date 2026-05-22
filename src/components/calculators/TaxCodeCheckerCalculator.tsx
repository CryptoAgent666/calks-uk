import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

function parseTaxCode(code: string) {
  const cleaned = code.toUpperCase().trim()

  // Extract number and suffix
  const match = cleaned.match(/^(\d+)([LMNTK]?)$/)
  const prefixMatch = cleaned.match(/^(BR|D0|D1|NT|0T|S\d+[LMNTK]?|C\d+[LMNTK]?)$/)

  if (match) {
    const number = parseInt(match[1])
    const suffix = match[2]
    const personalAllowance = number * 10

    const suffixes: Record<string, string> = {
      'L': 'Standard tax code — you get the standard Personal Allowance',
      'M': 'Marriage Allowance — you receive 10% of your partner\'s Personal Allowance',
      'N': 'Marriage Allowance — you transfer 10% of your Personal Allowance to your partner',
      'T': 'Your tax code includes other calculations to work out your Personal Allowance',
      'K': 'You owe tax from a previous year or have taxable benefits exceeding your allowance. HMRC adds the amount to your taxable income.',
    }

    const isScottish = cleaned.startsWith('S')
    const isWelsh = cleaned.startsWith('C')

    return {
      code: cleaned,
      personalAllowance: suffix === 'K' ? -personalAllowance : personalAllowance,
      isK: suffix === 'K',
      meaning: suffixes[suffix] || 'Standard tax code',
      isScottish, isWelsh,
      monthlyAllowance: personalAllowance / 12,
    }
  }

  if (prefixMatch) {
    const specials: Record<string, { allowance: number; meaning: string }> = {
      'BR': { allowance: 0, meaning: 'All income taxed at Basic Rate (20%). No Personal Allowance applied.' },
      'D0': { allowance: 0, meaning: 'All income taxed at Higher Rate (40%). Usually for a second job.' },
      'D1': { allowance: 0, meaning: 'All income taxed at Additional Rate (45%). Usually for a second job.' },
      'NT': { allowance: 0, meaning: 'No tax deducted. You don\'t pay any tax on this income.' },
      '0T': { allowance: 0, meaning: 'No Personal Allowance. HMRC doesn\'t have enough information, or you\'ve used up your allowance.' },
    }

    const info = specials[cleaned]
    if (info) return { code: cleaned, personalAllowance: info.allowance, isK: false, meaning: info.meaning, isScottish: false, isWelsh: false, monthlyAllowance: 0 }
  }

  return null
}

export default function TaxCodeCheckerCalculator() {
  const [code, setCode] = useState('1257L')
  const result = useMemo(() => parseTaxCode(code), [code])

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Enter Your Tax Code</label>
        <input type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="1257L" className="w-full rounded-xl border border-input bg-background px-4 py-3 text-2xl font-bold text-center uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Enter Your Tax Code" />
        <p className="text-xs text-muted-foreground mt-1 text-center">Find your tax code on your payslip, P45, P60 or HMRC letter</p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {['1257L', '1257M', 'BR', 'D0', 'S1257L', 'C1257L', 'K100', '0T', 'NT'].map(c => (
          <button key={c} onClick={() => setCode(c)} className="px-3 py-1.5 rounded-lg bg-muted text-sm font-mono font-medium hover:bg-accent transition-colors">{c}</button>
        ))}
      </div>

      {result ? (
        <div className="space-y-4 animate-fade-in-up">
          <div className="rounded-2xl bg-primary/10 p-6 text-center">
            <p className="text-4xl font-bold font-mono text-primary">{result.code}</p>
          </div>

          <div className="rounded-xl border border-border p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Personal Allowance</span>
              <span className="text-lg font-bold">{result.isK ? `Reduced by ${formatCurrency(Math.abs(result.personalAllowance))}` : formatCurrency(result.personalAllowance)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Monthly Tax-Free</span>
              <span className="text-lg font-bold">{formatCurrency(result.monthlyAllowance)}</span>
            </div>
            {result.isScottish && <div className="rounded-lg bg-blue-100 dark:bg-blue-950 px-3 py-2 text-sm text-blue-800 dark:text-blue-300">Scottish tax rates apply (S prefix)</div>}
            {result.isWelsh && <div className="rounded-lg bg-red-100 dark:bg-red-950 px-3 py-2 text-sm text-red-800 dark:text-red-300">Welsh tax rates apply (C prefix)</div>}
          </div>

          <div className="rounded-xl bg-muted/50 p-5">
            <p className="text-sm font-medium mb-1">What this means:</p>
            <p className="text-sm text-muted-foreground">{result.meaning}</p>
          </div>
        </div>
      ) : code.trim().length > 0 && (
        <div className="rounded-xl bg-orange-100 dark:bg-orange-950 p-4 text-sm text-orange-800 dark:text-orange-300">
          Tax code not recognised. Common formats: 1257L, BR, D0, S1257L, K100
        </div>
      )}
    </div>
  )
}
