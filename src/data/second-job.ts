/**
 * Shared maths for two PAYE employments in 2026/27 (England, Wales and Northern
 * Ireland), used by SecondJobTaxCalculator.tsx and by that page's copy so the worked
 * example and the calculator agree. Band and NI constants come from tax-trap.ts, which
 * mirrors IncomeTaxCalculator.tsx; student-loan thresholds mirror StudentLoanCalculator.tsx.
 *
 * gov.uk/guidance/how-tax-works-if-you-have-more-than-one-job: the Personal Allowance
 * "is usually allocated to the job that pays you the most"; the other job gets BR, D0
 * or D1; HMRC can check "if your Personal Allowance can be split between your jobs";
 * after the year end HMRC checks the total and sends a P800 if the amount was wrong.
 */
import {
  PERSONAL_ALLOWANCE,
  BASIC_RATE_BAND,
  HIGHER_RATE_LIMIT,
  BASIC_RATE,
  HIGHER_RATE,
  ADDITIONAL_RATE,
  NI_PRIMARY_THRESHOLD,
  NI_UPPER_EARNINGS_LIMIT,
  employeeNI,
  incomeTax,
} from './tax-trap'

// gov.uk/national-insurance/how-much-you-pay: 8% from £242 to £967 a week, 2% above
export const NI_PRIMARY_THRESHOLD_WEEKLY = 242
export const NI_UPPER_EARNINGS_LIMIT_WEEKLY = 967

export const STUDENT_LOAN_PLANS = {
  none: { name: 'No student loan', threshold: 0, rate: 0 },
  plan1: { name: 'Plan 1 (pre-2012)', threshold: 26_900, rate: 0.09 },
  plan2: { name: 'Plan 2 (post-2012)', threshold: 29_385, rate: 0.09 },
  plan4: { name: 'Plan 4 (Scotland)', threshold: 33_795, rate: 0.09 },
  plan5: { name: 'Plan 5 (post-2023)', threshold: 25_000, rate: 0.09 },
  postgrad: { name: 'Postgraduate Loan', threshold: 21_000, rate: 0.06 },
} as const
export type PlanId = keyof typeof STUDENT_LOAN_PLANS

export const FLAT_CODES = { BR: BASIC_RATE, D0: HIGHER_RATE, D1: ADDITIONAL_RATE } as const
export type FlatCode = keyof typeof FLAT_CODES
export type SecondJobCode = FlatCode | 'SPLIT'

/** The code HMRC would normally issue for the second job, from the main job's pay. */
export function suggestCode(job1Pay: number): FlatCode {
  if (job1Pay <= PERSONAL_ALLOWANCE + BASIC_RATE_BAND) return 'BR' // basic band not used up
  if (job1Pay <= HIGHER_RATE_LIMIT) return 'D0' // basic band used, higher band not
  return 'D1'
}

/** PAYE tax on one job as the payroll applies its code: fixed allowance, standard bands, no taper. */
export function payeTax(taxablePay: number, allowance: number): number {
  const taxable = Math.max(0, taxablePay - allowance)
  const basic = Math.min(taxable, BASIC_RATE_BAND)
  const higher = Math.min(Math.max(0, taxable - BASIC_RATE_BAND), HIGHER_RATE_LIMIT - BASIC_RATE_BAND)
  const additional = Math.max(0, taxable - HIGHER_RATE_LIMIT)
  return basic * BASIC_RATE + higher * HIGHER_RATE + additional * ADDITIONAL_RATE
}

/** 12,570 -> 1257L; 3,570 -> 357L (gov.uk: multiply the code number by 10 for the allowance). */
export function codeForAllowance(allowance: number): string {
  return `${Math.floor(allowance / 10)}L`
}

export function studentLoan(pay: number, plan: PlanId): number {
  const p = STUDENT_LOAN_PLANS[plan]
  return Math.max(0, pay - p.threshold) * p.rate
}

export interface SecondJobInputs {
  job1: number
  job2: number
  code: SecondJobCode
  /** Employee pension as % of pay at both jobs, net pay arrangement (reduces taxable pay only). */
  pensionPct: number
  plan: PlanId
}

export function secondJob(i: SecondJobInputs) {
  const pct = Math.min(Math.max(i.pensionPct, 0), 100) / 100
  const pension1 = i.job1 * pct
  const pension2 = i.job2 * pct
  const taxable1 = i.job1 - pension1
  const taxable2 = i.job2 - pension2

  // Allowance allocation: all on job 1 (1257L) unless HMRC splits it so that the
  // part job 1 cannot use moves to job 2.
  let allowance2 = 0
  if (i.code === 'SPLIT') allowance2 = Math.min(Math.max(0, PERSONAL_ALLOWANCE - taxable1), taxable2)
  const allowance1 = PERSONAL_ALLOWANCE - allowance2
  const code1 = codeForAllowance(allowance1)
  const code2 = i.code === 'SPLIT' ? codeForAllowance(allowance2) : i.code

  const tax1 = payeTax(taxable1, allowance1)
  const tax2 = i.code === 'SPLIT' ? payeTax(taxable2, allowance2) : taxable2 * FLAT_CODES[i.code]
  const payeTotal = tax1 + tax2

  // What the year's total income actually owes (one allowance, tapered above £100,000)
  const totalTaxable = taxable1 + taxable2
  const dueTotal = incomeTax(totalTaxable, totalTaxable)
  const difference = payeTotal - dueTotal // > 0 overpaid through the year, < 0 underpaid

  // NI is per employment: each job has its own Primary Threshold and Upper Earnings Limit
  const ni1 = employeeNI(i.job1)
  const ni2 = employeeNI(i.job2)
  const niPerJob = ni1 + ni2
  const niOneJob = employeeNI(i.job1 + i.job2)
  const niDifference = niOneJob - niPerJob // > 0 two jobs pay less than one job would
  const canDeferNI = i.job1 >= NI_UPPER_EARNINGS_LIMIT && i.job2 >= NI_PRIMARY_THRESHOLD

  // Student loan: each job is compared with the threshold on its own, never combined
  const sl1 = studentLoan(i.job1, i.plan)
  const sl2 = studentLoan(i.job2, i.plan)
  const slPerJob = sl1 + sl2
  const slOneJob = studentLoan(i.job1 + i.job2, i.plan)

  const net1 = i.job1 - tax1 - ni1 - sl1 - pension1
  const net2 = i.job2 - tax2 - ni2 - sl2 - pension2

  return {
    suggested: suggestCode(i.job1),
    jobs: [
      { label: 'Job 1 (main)', pay: i.job1, code: code1, allowance: allowance1, tax: tax1, ni: ni1, studentLoan: sl1, pension: pension1, net: net1 },
      { label: 'Job 2', pay: i.job2, code: code2, allowance: allowance2, tax: tax2, ni: ni2, studentLoan: sl2, pension: pension2, net: net2 },
    ],
    unusedAllowance: Math.max(0, allowance1 - taxable1),
    payeTotal,
    dueTotal,
    difference,
    niPerJob,
    niOneJob,
    niDifference,
    canDeferNI,
    slPerJob,
    slOneJob,
    pensionTotal: pension1 + pension2,
    takeHome: net1 + net2,
    total: i.job1 + i.job2,
  }
}
