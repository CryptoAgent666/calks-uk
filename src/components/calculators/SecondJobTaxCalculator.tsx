import { useMemo } from 'react'
import { formatCurrency } from '@/utils'
import ShareRow, { useUrlParam } from '@/components/ShareRow'
import {
  secondJob,
  suggestCode,
  STUDENT_LOAN_PLANS,
  FLAT_CODES,
  NI_PRIMARY_THRESHOLD_WEEKLY,
  NI_UPPER_EARNINGS_LIMIT_WEEKLY,
  type PlanId,
  type SecondJobCode,
} from '@/data/second-job'
import { NI_PRIMARY_THRESHOLD, NI_UPPER_EARNINGS_LIMIT, PERSONAL_ALLOWANCE } from '@/data/tax-trap'

const num = (s: string) => parseFloat(s.replace(/,/g, '')) || 0
const inputClass =
  'w-full rounded-xl border border-input bg-background px-8 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring'
const selectClass =
  'w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring'

const CODE_LABELS: Record<SecondJobCode, string> = {
  BR: 'BR: 20% on all of job 2',
  D0: 'D0: 40% on all of job 2',
  D1: 'D1: 45% on all of job 2',
  SPLIT: 'Allowance split between the jobs (ask HMRC)',
}

export default function SecondJobTaxCalculator() {
  const [job1, setJob1] = useUrlParam('job1', '30000')
  const [job2, setJob2] = useUrlParam('job2', '12000')
  const [codeChoice, setCodeChoice] = useUrlParam('code', 'auto') // auto | BR | D0 | D1 | SPLIT
  const [plan, setPlan] = useUrlParam('sl', 'none')
  const [pensionPct, setPensionPct] = useUrlParam('pension', '0')

  const j1 = num(job1)
  const j2 = num(job2)
  const pct = Math.min(Math.max(parseFloat(pensionPct) || 0, 0), 100)
  const planId: PlanId = plan in STUDENT_LOAN_PLANS ? (plan as PlanId) : 'none'
  const suggested = suggestCode(j1)
  const code: SecondJobCode = codeChoice in CODE_LABELS ? (codeChoice as SecondJobCode) : suggested

  const result = useMemo(() => secondJob({ job1: j1, job2: j2, code, pensionPct: pct, plan: planId }), [j1, j2, code, pct, planId])

  const shareParams: Record<string, string> = {
    job1,
    job2,
    ...(codeChoice !== 'auto' ? { code: codeChoice } : {}),
    ...(planId !== 'none' ? { sl: planId } : {}),
    ...(pct > 0 ? { pension: pensionPct } : {}),
  }

  const overpaid = result.difference > 0.5
  const underpaid = result.difference < -0.5

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="sj-job1" className="block text-sm font-medium mb-2">
            Job 1 annual pay (main job, code 1257L)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">£</span>
            <input
              id="sj-job1"
              type="text"
              inputMode="numeric"
              value={job1}
              onChange={(e) => setJob1(e.target.value)}
              placeholder="30,000"
              className={inputClass}
              aria-label="Job 1 annual pay"
            />
          </div>
        </div>
        <div>
          <label htmlFor="sj-job2" className="block text-sm font-medium mb-2">
            Job 2 annual pay
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">£</span>
            <input
              id="sj-job2"
              type="text"
              inputMode="numeric"
              value={job2}
              onChange={(e) => setJob2(e.target.value)}
              placeholder="12,000"
              className={inputClass}
              aria-label="Job 2 annual pay"
            />
          </div>
        </div>

        <div>
          <label htmlFor="sj-code" className="block text-sm font-medium mb-2">
            Tax code on job 2
          </label>
          <select id="sj-code" value={codeChoice} onChange={(e) => setCodeChoice(e.target.value)} className={selectClass} aria-label="Tax code on job 2">
            <option value="auto">Suggested: {CODE_LABELS[suggested]}</option>
            {(Object.keys(CODE_LABELS) as SecondJobCode[]).map((c) => (
              <option key={c} value={c}>
                {CODE_LABELS[c]}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground mt-1">
            HMRC puts the allowance on the job that pays most and gives the other job BR while job 1 stays under £50,270, D0 up to £125,140, D1 above.
          </p>
        </div>

        <div>
          <label htmlFor="sj-plan" className="block text-sm font-medium mb-2">
            Student loan (optional)
          </label>
          <select id="sj-plan" value={planId} onChange={(e) => setPlan(e.target.value)} className={selectClass} aria-label="Student loan plan">
            {(Object.keys(STUDENT_LOAN_PLANS) as PlanId[]).map((id) => (
              <option key={id} value={id}>
                {STUDENT_LOAN_PLANS[id].name}
                {id !== 'none' ? ` (${Math.round(STUDENT_LOAN_PLANS[id].rate * 100)}% over ${formatCurrency(STUDENT_LOAN_PLANS[id].threshold)})` : ''}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="sj-pension" className="block text-sm font-medium mb-2">
            Workplace pension at both jobs, % of pay (optional)
          </label>
          <input
            id="sj-pension"
            type="number"
            min="0"
            max="100"
            step="0.5"
            value={pensionPct}
            onChange={(e) => setPensionPct(e.target.value)}
            className={selectClass}
            aria-label="Workplace pension percentage"
          />
          <p className="text-xs text-muted-foreground mt-1">Net pay arrangement: taken before tax, so it lowers tax but not NI or student loan.</p>
        </div>
      </div>

      {j1 + j2 > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Income tax taken through the two codes</p>
              <p className="text-lg font-bold text-destructive">{formatCurrency(result.payeTotal)}</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Income tax due on {formatCurrency(result.total)} combined</p>
              <p className="text-lg font-bold">{formatCurrency(result.dueTotal)}</p>
            </div>
            <div className={`rounded-xl p-4 ${overpaid || underpaid ? 'bg-amber-50 dark:bg-amber-950/40' : 'bg-muted/50'}`}>
              <p className="text-xs text-muted-foreground">{overpaid ? 'Overpaid during the year' : underpaid ? 'Underpaid during the year' : 'Codes match the bill'}</p>
              <p className="text-lg font-bold">{formatCurrency(Math.abs(result.difference))}</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">National Insurance, per job</p>
              <p className="text-lg font-bold text-destructive">{formatCurrency(result.niPerJob)}</p>
              <p className="text-xs text-muted-foreground">{formatCurrency(result.niOneJob)} if it were one job</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">{result.niDifference >= 0 ? 'NI saved by having two employers' : 'Extra NI from having two employers'}</p>
              <p className={`text-lg font-bold ${result.niDifference >= 0 ? 'text-green-600' : 'text-destructive'}`}>{formatCurrency(Math.abs(result.niDifference))}</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Take-home from both jobs</p>
              <p className="text-lg font-bold text-primary">{formatCurrency(result.takeHome)}</p>
              <p className="text-xs text-muted-foreground">{formatCurrency(result.takeHome / 12)} a month</p>
            </div>
          </div>

          {/* Per-job table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 font-medium text-muted-foreground"></th>
                  {result.jobs.map((j) => (
                    <th key={j.label} className="text-right py-2 font-medium text-muted-foreground">
                      {j.label}
                    </th>
                  ))}
                  <th className="text-right py-2 font-medium text-muted-foreground">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="py-2">Tax code</td>
                  {result.jobs.map((j) => (
                    <td key={j.label} className="text-right font-mono">{j.code}</td>
                  ))}
                  <td></td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2">Gross pay</td>
                  {result.jobs.map((j) => (
                    <td key={j.label} className="text-right tabular-nums">{formatCurrency(j.pay)}</td>
                  ))}
                  <td className="text-right tabular-nums">{formatCurrency(result.total)}</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2">Tax-free allowance used</td>
                  {result.jobs.map((j) => (
                    <td key={j.label} className="text-right tabular-nums">{formatCurrency(Math.min(j.allowance, Math.max(0, j.pay - j.pension)))}</td>
                  ))}
                  <td className="text-right tabular-nums">{formatCurrency(PERSONAL_ALLOWANCE - result.unusedAllowance)}</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2">Income tax</td>
                  {result.jobs.map((j) => (
                    <td key={j.label} className="text-right tabular-nums">{formatCurrency(j.tax)}</td>
                  ))}
                  <td className="text-right tabular-nums font-medium">{formatCurrency(result.payeTotal)}</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2">Employee NI (own {formatCurrency(NI_PRIMARY_THRESHOLD)} threshold each)</td>
                  {result.jobs.map((j) => (
                    <td key={j.label} className="text-right tabular-nums">{formatCurrency(j.ni)}</td>
                  ))}
                  <td className="text-right tabular-nums font-medium">{formatCurrency(result.niPerJob)}</td>
                </tr>
                {planId !== 'none' && (
                  <tr className="border-b border-border/50">
                    <td className="py-2">Student loan (per job, over {formatCurrency(STUDENT_LOAN_PLANS[planId].threshold)})</td>
                    {result.jobs.map((j) => (
                      <td key={j.label} className="text-right tabular-nums">{formatCurrency(j.studentLoan)}</td>
                    ))}
                    <td className="text-right tabular-nums font-medium">{formatCurrency(result.slPerJob)}</td>
                  </tr>
                )}
                {pct > 0 && (
                  <tr className="border-b border-border/50">
                    <td className="py-2">Pension ({pct}%)</td>
                    {result.jobs.map((j) => (
                      <td key={j.label} className="text-right tabular-nums">{formatCurrency(j.pension)}</td>
                    ))}
                    <td className="text-right tabular-nums font-medium">{formatCurrency(result.pensionTotal)}</td>
                  </tr>
                )}
                <tr className="font-semibold">
                  <td className="py-2 text-primary">Take-home</td>
                  {result.jobs.map((j) => (
                    <td key={j.label} className="text-right tabular-nums">{formatCurrency(j.net)}</td>
                  ))}
                  <td className="text-right tabular-nums text-primary">{formatCurrency(result.takeHome)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Reconciliation */}
          <div className={`rounded-xl border p-4 text-sm space-y-2 ${overpaid || underpaid ? 'border-amber-300 bg-amber-50 dark:bg-amber-950/40 dark:border-amber-800' : 'border-border'}`}>
            <p className="font-semibold">How the year reconciles</p>
            {!overpaid && !underpaid && (
              <p className="text-muted-foreground">
                The two codes collect exactly the tax due on your combined income, so nothing changes after 5 April. A second job does not mean more tax overall: the bill is the same as it would be on one salary of {formatCurrency(result.total)}.
              </p>
            )}
            {overpaid && (
              <p className="text-muted-foreground">
                {result.unusedAllowance > 0
                  ? `Job 1 leaves ${formatCurrency(result.unusedAllowance)} of the Personal Allowance unused while job 2 is taxed at ${Math.round(FLAT_CODES[code as keyof typeof FLAT_CODES] * 100)}% from the first pound, so you overpay ${formatCurrency(result.difference)} through the year. gov.uk says to contact HMRC to check whether your Personal Allowance can be split between your jobs; choose the split option above to see the effect. Otherwise HMRC repays it after the year end through a P800 tax calculation.`
                  : `The codes take ${formatCurrency(result.difference)} more than the combined bill, usually because the flat-rate code on job 2 is a band too high. HMRC checks the total after 5 April and repays the difference through a P800 tax calculation, or you can ask for the code to be changed now.`}
              </p>
            )}
            {underpaid && (
              <p className="text-muted-foreground">
                The codes take {formatCurrency(Math.abs(result.difference))} less than the combined bill, because part of job 2's pay should be taxed at a higher rate than its code charges{result.total > 100_000 ? ', and the Personal Allowance tapers once combined income passes £100,000' : ''}. HMRC reconciles the total after the year end and collects the shortfall through a P800 and an adjusted code, so it is worth asking for a D0 or D1 code (or a reduced allowance on job 1) during the year rather than facing a bill later.
              </p>
            )}
            <p className="text-muted-foreground">
              National Insurance is different: it is worked out separately for each employer, each with its own {formatCurrency(NI_PRIMARY_THRESHOLD)} a year (£{NI_PRIMARY_THRESHOLD_WEEKLY} a week) threshold, and HMRC does not add the jobs together afterwards.
              {result.canDeferNI &&
                ` Job 1 already pays above the £${NI_UPPER_EARNINGS_LIMIT_WEEKLY} a week Upper Earnings Limit (${formatCurrency(NI_UPPER_EARNINGS_LIMIT)} a year), so you can apply to HMRC to defer NI on job 2 and pay 2% there instead of 8%.`}
              {planId !== 'none' &&
                ` Student loan deductions follow the same per-job rule: you repay only from a job paid over the ${formatCurrency(STUDENT_LOAN_PLANS[planId].threshold)} threshold, not on the combined ${formatCurrency(result.total)}, which would otherwise mean ${formatCurrency(result.slOneJob)} a year.`}
            </p>
            <p className="text-muted-foreground">
              Self-employed second income works differently: it goes on a Self Assessment return with Class 4 NI, so use the{' '}
              <a href="/calculator/side-hustle-tax-calculator/" className="text-primary underline">
                side hustle tax calculator
              </a>{' '}
              for that.
            </p>
          </div>

          <ShareRow params={shareParams} />
        </div>
      )}
    </div>
  )
}
