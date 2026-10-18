import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// Decodes an HMRC PAYE tax code for 2026/27 (gov.uk/tax-codes/what-your-tax-code-means):
//   [S|C] number [L|M|N|T]       1257L, S1257L, 1383M, 1131N, C500T
//   [S|C] K number               K475: the number x 10 is ADDED to taxable pay
//   [S|C] BR | D0 | D1 | 0T | NT flat-rate or no-allowance codes
//   Scottish only: SD0 21%, SD1 42%, SD2 45%, SD3 48%
//   optional trailing W1 / M1 / X  non-cumulative (emergency) basis
// S = Scottish rates, C = Welsh rates. The number is tax-free pay for the year / 10.

type CodeKind = 'L' | 'M' | 'N' | 'T' | 'K' | 'FLAT'

type TaxCodeInfo = {
  code: string
  kind: CodeKind
  allowance: number // tax-free pay for the year; negative = amount added to taxable pay (K code)
  isK: boolean
  flatRate: number | null // e.g. 20 for BR; null when the code carries an allowance or is 0T
  meaning: string | null // fixed text for flat codes; letter codes are described by MEANINGS below
  isScottish: boolean
  isWelsh: boolean
  isEmergency: boolean
}

const FLAT_CODES: Record<string, { rate: number | null; meaning: string }> = {
  'BR': { rate: 20, meaning: 'All of this income is taxed at the basic rate of 20% with no Personal Allowance. Usual for a second job or pension when your allowance is already used against your main income.' },
  'D0': { rate: 40, meaning: 'All of this income is taxed at the higher rate of 40% with no Personal Allowance. Usual for a second job or pension when your main income already reaches the higher-rate band.' },
  'D1': { rate: 45, meaning: 'All of this income is taxed at the additional rate of 45% with no Personal Allowance.' },
  'SBR': { rate: 20, meaning: 'All of this income is taxed at the Scottish basic rate of 20% with no Personal Allowance. Usual for a second job or pension.' },
  'SD0': { rate: 21, meaning: 'All of this income is taxed at the Scottish intermediate rate of 21% with no Personal Allowance.' },
  'SD1': { rate: 42, meaning: 'All of this income is taxed at the Scottish higher rate of 42% with no Personal Allowance.' },
  'SD2': { rate: 45, meaning: 'All of this income is taxed at the Scottish advanced rate of 45% with no Personal Allowance.' },
  'SD3': { rate: 48, meaning: 'All of this income is taxed at the Scottish top rate of 48% with no Personal Allowance.' },
  'CBR': { rate: 20, meaning: 'All of this income is taxed at the Welsh basic rate of 20% with no Personal Allowance. Usual for a second job or pension.' },
  'CD0': { rate: 40, meaning: 'All of this income is taxed at the Welsh higher rate of 40% with no Personal Allowance.' },
  'CD1': { rate: 45, meaning: 'All of this income is taxed at the Welsh additional rate of 45% with no Personal Allowance.' },
  'NT': { rate: 0, meaning: 'No tax is deducted from this income. Used for some non-residents, diplomats and certain pension or insolvency cases.' },
  '0T': { rate: null, meaning: 'No Personal Allowance. HMRC does not have the details to issue a full code (no P45 or starter checklist), or your allowance has been used up. Tax starts from the first pound, at 20%, 40% and 45% as pay rises through the bands.' },
}

// Letter-code explanations; `amount` is the formatted yearly allowance (or the K addition).
const MEANINGS: Record<Exclude<CodeKind, 'FLAT'>, (amount: string) => string> = {
  L: (amount) => `Standard code: you get the Personal Allowance. The number is your tax-free pay for the year divided by 10, so ${amount} of pay is untaxed. 1257L is the full £12,570 allowance for 2026/27; a different number means HMRC has adjusted it for benefits, expenses, untaxed income or tax owed from an earlier year.`,
  M: (amount) => `Marriage Allowance recipient: your partner has transferred 10% of their Personal Allowance (£1,260) to you, giving you ${amount} of tax-free pay. The usual code is 1383M (£12,570 + £1,260).`,
  N: (amount) => `Marriage Allowance transferor: you have given 10% of your Personal Allowance (£1,260) to your partner, leaving you ${amount} of tax-free pay. The usual code is 1131N (£12,570 less £1,260).`,
  T: (amount) => `Your Personal Allowance includes other calculations, for example the taper that removes £1 of allowance for every £2 of income above £100,000. The number still shows the resulting tax-free pay: ${amount}.`,
  K: (amount) => `K code: your untaxed income or benefits (a company car, State Pension, tax owed from an earlier year) are worth more than your allowances, so ${amount} is added to your taxable pay for the year instead of being deducted from it. Your employer cannot take more than 50% of your pre-tax pay in tax under a K code.`,
}

function parseTaxCode(input: string): TaxCodeInfo | null {
  let cleaned = input.toUpperCase().replace(/\s+/g, ' ').trim()
  if (!cleaned) return null

  // Emergency / non-cumulative marker: "1257L W1", "1257L M1", "1257LX", "S1257L X".
  let isEmergency = false
  let marker = ''
  const em = cleaned.match(/^(.+?) ?(W1|M1|X|NONCUM)$/)
  if (em) {
    cleaned = em[1]
    marker = em[2]
    isEmergency = true
  }
  const display = isEmergency ? `${cleaned} ${marker}` : cleaned
  const region = (p: string | undefined) => ({ isScottish: p === 'S', isWelsh: p === 'C' })

  const k = cleaned.match(/^([SC])?K(\d+)$/)
  if (k) {
    const added = parseInt(k[2], 10) * 10
    return { code: display, kind: 'K', allowance: -added, isK: true, flatRate: null, meaning: null, isEmergency, ...region(k[1]) }
  }

  // Flat codes first: "0T" would otherwise match the number-plus-letter pattern below as a T code.
  const flat = cleaned.match(/^([SC])?(BR|D0|D1|D2|D3|NT|0T)$/)
  if (flat) {
    const prefix = flat[1] ?? ''
    const base = flat[2]
    // S0T / C0T / SNT / CNT share the unprefixed meaning; D2 and D3 exist only as Scottish SD2 / SD3.
    const info = FLAT_CODES[prefix + base] ?? ((base === '0T' || base === 'NT') ? FLAT_CODES[base] : undefined)
    if (!info) return null
    return { code: display, kind: 'FLAT', allowance: 0, isK: false, flatRate: info.rate, meaning: info.meaning, isEmergency, ...region(flat[1]) }
  }

  const num = cleaned.match(/^([SC])?(\d+)([LMNT])$/)
  if (num) {
    const allowance = parseInt(num[2], 10) * 10
    return { code: display, kind: num[3] as CodeKind, allowance, isK: false, flatRate: null, meaning: null, isEmergency, ...region(num[1]) }
  }

  return null
}

const QUICK_PICKS = ['1257L', '1383M', '1131N', 'BR', 'D0', 'S1257L', 'C1257L', 'K475', '0T', 'NT', '1257L M1']

export default function TaxCodeCheckerCalculator() {
  const [code, setCode] = useState('1257L')
  const result = useMemo(() => parseTaxCode(code), [code])
  const yearly = result ? formatCurrency(Math.abs(result.allowance)) : ''
  const meaning = result ? (result.kind === 'FLAT' ? result.meaning : MEANINGS[result.kind](yearly)) : ''

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Enter Your Tax Code</label>
        <input type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="1257L" className="w-full rounded-xl border border-input bg-background px-4 py-3 text-2xl font-bold text-center uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-ring"  aria-label="Enter Your Tax Code" />
        <p className="text-xs text-muted-foreground mt-1 text-center">Find your tax code on your payslip, P45, P60 or HMRC letter</p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {QUICK_PICKS.map(c => (
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
              <span className="text-sm text-muted-foreground">{result.isK ? 'Added to taxable pay (year)' : 'Tax-free allowance (year)'}</span>
              <span className="text-lg font-bold">{yearly}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{result.isK ? 'Added each month' : 'Monthly tax-free pay'}</span>
              <span className="text-lg font-bold">{formatCurrency(Math.abs(result.allowance) / 12)}</span>
            </div>
            {result.flatRate !== null && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Rate on all of this income</span>
                <span className="text-lg font-bold">{result.flatRate}%</span>
              </div>
            )}
            {result.isScottish && <div className="rounded-lg bg-blue-100 dark:bg-blue-950 px-3 py-2 text-sm text-blue-800 dark:text-blue-300">Scottish income tax rates apply (S prefix): 19%, 20%, 21%, 42%, 45% and 48% bands.</div>}
            {result.isWelsh && <div className="rounded-lg bg-red-100 dark:bg-red-950 px-3 py-2 text-sm text-red-800 dark:text-red-300">Welsh rates of income tax apply (C prefix): currently the same 20%, 40% and 45% as England and Northern Ireland.</div>}
            {result.isEmergency && <div className="rounded-lg bg-orange-100 dark:bg-orange-950 px-3 py-2 text-sm text-orange-800 dark:text-orange-300">Non-cumulative (emergency) basis: each payday is taxed on its own, so you may pay too much if you had no earlier pay this year, or too little if you had.</div>}
          </div>

          <div className="rounded-xl bg-muted/50 p-5">
            <p className="text-sm font-medium mb-1">What this means:</p>
            <p className="text-sm text-muted-foreground">{meaning}</p>
          </div>
        </div>
      ) : code.trim().length > 0 && (
        <div className="rounded-xl bg-orange-100 dark:bg-orange-950 p-4 text-sm text-orange-800 dark:text-orange-300">
          Tax code not recognised. Common formats: 1257L, 1383M, BR, D0, S1257L, C1257L, K475, 0T, or 1257L M1 for an emergency code.
        </div>
      )}
    </div>
  )
}
