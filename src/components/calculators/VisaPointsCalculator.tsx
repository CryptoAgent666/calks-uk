import { useState, useMemo } from 'react'
import { formatCurrency } from '@/utils'

// UK Skilled Worker points check, Immigration Rules as updated 29 October 2026.
// Appendix Skilled Worker SW 4.1 (50 mandatory points), SW 4.2 and the options table (20 salary points),
// SW 4.4 and SW 6.5 (no skill or salary points without sponsorship), SW 14.4 (going rates pro-rated
// from a 37.5-hour week). Going rates: Appendix Skilled Occupations Table 1 and, for options F to J, Table 2.
const REQUIRED_TOTAL = 70
const STANDARD_HOURS = 37.5
const RATES_AS_AT = '29 October 2026'

type SalaryOption = 'ordinary' | 'isl' | 'new_entrant' | 'phd_stem' | 'phd_other' | 'health_education'

// threshold: options A to E. lowerThreshold: options F to J. rateColumn: 0 going rate, 1 = 90%, 2 = 80%, 3 = 70%.
const SALARY_OPTIONS: Record<SalaryOption, { name: string; threshold: number; lowerThreshold: number; rateColumn: number; percent: number; note: string }> = {
  ordinary: { name: 'Standard salary route', threshold: 41_700, lowerThreshold: 31_300, rateColumn: 0, percent: 1, note: 'No discount: the full going rate applies.' },
  isl: { name: 'Job on the Immigration Salary List', threshold: 33_400, lowerThreshold: 25_000, rateColumn: 0, percent: 1, note: 'The job must be on the list for the UK nation where it is based. The full going rate still applies.' },
  new_entrant: { name: 'New entrant', threshold: 33_400, lowerThreshold: 25_000, rateColumn: 3, percent: 0.7, note: 'For example under 26 on the application date, a listed postdoctoral job, working towards a recognised professional qualification or registration, or most recent permission as a Student (after a UK degree, PhD or PGCE) or Graduate. See SW 12.2 for the full tests.' },
  phd_stem: { name: 'Relevant PhD in a STEM subject', threshold: 33_400, lowerThreshold: 25_000, rateColumn: 2, percent: 0.8, note: 'The occupation code must be listed as eligible for PhD points, and the PhD must be relevant to the job.' },
  phd_other: { name: 'Relevant PhD in another subject', threshold: 37_500, lowerThreshold: 28_200, rateColumn: 1, percent: 0.9, note: 'The occupation code must be listed as eligible for PhD points, and the PhD must be relevant to the job.' },
  health_education: { name: 'Listed health or education job', threshold: 25_000, lowerThreshold: 25_000, rateColumn: 0, percent: 1, note: 'Option K, for jobs in Table 3 or 3a of Appendix Skilled Occupations. Those going rates follow national pay scales, so enter the rate for your band and hours below.' },
}

// [going rate, 90%, 80%, 70%] per year on 37.5 hours. rates: Table 1. lower: Table 2.
const OCCUPATIONS: { code: string; name: string; rates: number[]; lower: number[]; isl?: boolean }[] = [
  { code: '2134', name: 'Programmers and software developers', rates: [54_700, 49_200, 43_700, 38_300], lower: [40_000, 36_000, 32_000, 28_000] },
  { code: '2133', name: 'IT business analysts, architects and systems designers', rates: [54_900, 49_400, 43_900, 38_400], lower: [42_400, 38_100, 33_900, 29_600] },
  { code: '2132', name: 'IT managers', rates: [55_000, 49_500, 44_000, 38_500], lower: [43_000, 38_700, 34_400, 30_100] },
  { code: '2135', name: 'Cyber security professionals', rates: [48_500, 43_700, 38_800, 34_000], lower: [35_300, 31_800, 28_200, 25_000] },
  { code: '2136', name: 'IT quality and testing professionals', rates: [41_200, 37_100, 33_400, 33_400], lower: [34_500, 31_000, 27_600, 25_000] },
  { code: '2141', name: 'Web design professionals', rates: [43_800, 39_400, 35_100, 33_400], lower: [31_300, 28_200, 25_100, 25_000] },
  { code: '2121', name: 'Civil engineers', rates: [50_400, 45_300, 40_300, 35_200], lower: [39_200, 35_300, 31_300, 27_400] },
  { code: '2122', name: 'Mechanical engineers', rates: [46_800, 42_100, 37_400, 33_400], lower: [38_400, 34_600, 30_700, 26_900] },
  { code: '2123', name: 'Electrical engineers', rates: [58_700, 52_900, 47_000, 41_100], lower: [47_100, 42_400, 37_700, 33_000] },
  { code: '2124', name: 'Electronics engineers', rates: [52_000, 46_800, 41_600, 36_400], lower: [41_200, 37_100, 33_000, 28_900] },
  { code: '2129', name: 'Engineering professionals not elsewhere classified', rates: [46_100, 41_500, 36_900, 33_400], lower: [37_500, 33_700, 30_000, 26_200] },
  { code: '2421', name: 'Chartered and certified accountants', rates: [49_200, 44_300, 39_400, 34_500], lower: [36_900, 33_200, 29_500, 25_800] },
  { code: '2433', name: 'Actuaries, economists and statisticians', rates: [55_100, 49_600, 44_100, 38_600], lower: [40_700, 36_600, 32_500, 28_500] },
  { code: '2112', name: 'Biological scientists', rates: [40_300, 36_300, 33_400, 33_400], lower: [30_700, 27_600, 25_000, 25_000], isl: true },
]
const OTHER_OCCUPATION = 'other'

interface CheckInput {
  occupation: string
  manualRate: number
  option: SalaryOption
  lowerRates: boolean
  hours: number
  salary: number
  sponsor: boolean
  skillTick: boolean
  english: boolean
}

interface Requirement { label: string; met: boolean; points: number; detail: string }

function assess(input: CheckInput) {
  const { occupation, manualRate, option, lowerRates, hours, salary, sponsor, skillTick, english } = input
  const info = SALARY_OPTIONS[option]
  const listed = OCCUPATIONS.find((o) => o.code === occupation)
  const usesLower = lowerRates && option !== 'health_education'
  const threshold = usesLower ? info.lowerThreshold : info.threshold
  const hoursFactor = hours > 0 ? hours / STANDARD_HOURS : 1

  let goingRate = 0
  let salaryProblem = ''
  if (option === 'health_education') {
    if (listed) salaryProblem = 'Table 3 rates are not in this list. Choose "Other occupation" and enter the rate for your band and hours.'
    else goingRate = manualRate
    if (!listed && manualRate <= 0) salaryProblem = 'Enter the going rate from Table 3 or 3a of Appendix Skilled Occupations.'
  } else if (listed) {
    goingRate = (usesLower ? listed.lower : listed.rates)[info.rateColumn] * hoursFactor
    if (option === 'isl' && !listed.isl) salaryProblem = `SOC ${listed.code} is not on the Immigration Salary List, so this option is not open to it.`
  } else if (manualRate > 0) {
    goingRate = manualRate * info.percent * hoursFactor
  } else {
    salaryProblem = 'Enter the going rate for your occupation code from Appendix Skilled Occupations.'
  }

  const required = Math.max(threshold, goingRate)
  const salaryMet = !salaryProblem && salary >= required

  // SW 6.1 covers listed jobs automatically; any other occupation has to be confirmed by the user.
  const skillInScope = listed ? true : skillTick
  const skillPoints = sponsor && skillInScope
  const salaryPoints = sponsor && skillInScope && salaryMet

  const salaryDetail = salaryProblem
    ? salaryProblem
    : `Needed: ${formatCurrency(required)}, the higher of the ${formatCurrency(threshold)} threshold and ${formatCurrency(goingRate)} going rate${info.percent < 1 ? ` (${Math.round(info.percent * 100)}% of the full rate)` : ''}. ${salaryMet ? 'Your salary meets it.' : `Your salary is ${formatCurrency(required - salary)} short.`}`

  const requirements: Requirement[] = [
    { label: 'Sponsored job offer', met: sponsor, points: sponsor ? 20 : 0, detail: sponsor ? 'Confirmed by you.' : 'You need a valid certificate of sponsorship from a Home Office approved sponsor.' },
    { label: 'Job at the appropriate skill level', met: skillInScope, points: skillPoints ? 20 : 0, detail: listed ? `SOC ${listed.code} is listed in Table 1 of Appendix Skilled Occupations.${sponsor ? '' : ' No points are awarded without sponsorship.'}` : skillTick ? `Confirmed by you.${sponsor ? '' : ' No points are awarded without sponsorship.'}` : 'The job must be RQF 6 or above, or on the Immigration Salary List or Temporary Shortage List.' },
    { label: 'English language', met: english, points: english ? 10 : 0, detail: english ? 'Confirmed by you.' : 'You need B2, or B1 if your most recent permission was as a Skilled Worker granted subject to B1.' },
    { label: info.name, met: salaryMet, points: salaryPoints ? 20 : 0, detail: salaryMet && !salaryPoints ? `${salaryDetail} No salary points are awarded without sponsorship and a job at the appropriate skill level.` : salaryDetail },
  ]

  const totalPoints = requirements.reduce((sum, r) => sum + r.points, 0)
  const failed = requirements.filter((r) => !r.met).map((r) => r.label)
  return { requirements, totalPoints, failed, eligible: failed.length === 0 && totalPoints >= REQUIRED_TOTAL, required, threshold, goingRate }
}

const fieldClass = 'w-full rounded-xl border border-input bg-background px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-ring'

export default function VisaPointsCalculator() {
  const [occupation, setOccupation] = useState('2134')
  const [manualRate, setManualRate] = useState('')
  const [option, setOption] = useState<SalaryOption>('ordinary')
  const [lowerRates, setLowerRates] = useState(false)
  const [hours, setHours] = useState('37.5')
  const [salary, setSalary] = useState('55000')
  const [sponsor, setSponsor] = useState(false)
  const [skillTick, setSkillTick] = useState(false)
  const [english, setEnglish] = useState(false)

  const isOther = occupation === OTHER_OCCUPATION
  const result = useMemo(() => assess({
    occupation,
    manualRate: parseFloat(manualRate.replace(/,/g, '')) || 0,
    option,
    lowerRates,
    hours: parseFloat(hours) || STANDARD_HOURS,
    salary: parseFloat(salary.replace(/,/g, '')) || 0,
    sponsor,
    skillTick,
    english,
  }), [occupation, manualRate, option, lowerRates, hours, salary, sponsor, skillTick, english])

  const ticks = [
    { checked: sponsor, onChange: setSponsor, label: 'Job offer from a Home Office approved sponsor, with a certificate of sponsorship', show: true },
    { checked: skillTick, onChange: setSkillTick, label: 'Job is RQF 6 or above, or on the Immigration Salary List or Temporary Shortage List (certificate issued before 31 December 2026)', show: isOther },
    { checked: english, onChange: setEnglish, label: 'English at B2 (B1 if your most recent permission was as a Skilled Worker granted subject to B1)', show: true },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Occupation (SOC 2020 code)</label><select value={occupation} onChange={(e) => setOccupation(e.target.value)} className={fieldClass} aria-label="Occupation (SOC 2020 code)">{OCCUPATIONS.map((o) => <option key={o.code} value={o.code}>{o.code} {o.name}</option>)}<option value={OTHER_OCCUPATION}>Other occupation (enter the going rate)</option></select></div>
        <div><label className="block text-sm font-medium mb-2">Salary Option</label><select value={option} onChange={(e) => setOption(e.target.value as SalaryOption)} className={fieldClass} aria-label="Salary Option">{Object.entries(SALARY_OPTIONS).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}</select></div>
        <div><label className="block text-sm font-medium mb-2">Annual Salary (guaranteed basic pay)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={salary} onChange={(e) => setSalary(e.target.value)} className={`${fieldClass} pl-8`} aria-label="Annual Salary" /></div></div>
        <div><label className="block text-sm font-medium mb-2">Weekly Hours</label><input type="number" min="1" step="0.5" value={hours} onChange={(e) => setHours(e.target.value)} className={fieldClass} aria-label="Weekly Hours" /></div>
        {(isOther || option === 'health_education') && (
          <div className="sm:col-span-2"><label className="block text-sm font-medium mb-2">{option === 'health_education' ? 'Going Rate for Your Band and Hours' : 'Full Going Rate for Your Code (37.5 hours)'}</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span><input type="text" inputMode="numeric" value={manualRate} onChange={(e) => setManualRate(e.target.value)} className={`${fieldClass} pl-8`} aria-label="Going Rate" /></div></div>
        )}
      </div>

      <p className="text-sm text-muted-foreground">{SALARY_OPTIONS[option].note}</p>

      <div className="space-y-2">
        <label className="flex items-center gap-3 rounded-xl border border-border p-4 cursor-pointer hover:bg-accent">
          <input type="checkbox" checked={lowerRates} disabled={option === 'health_education'} onChange={(e) => setLowerRates(e.target.checked)} className="h-5 w-5 rounded border-border" />
          <span className="text-sm font-medium">Lower salary options F to J: Skilled Worker since before 4 April 2024 with continuous permission (applying before 4 April 2030), or a Health and Care ASHE salary job</span>
        </label>
        {ticks.filter((t) => t.show).map((t) => (
          <label key={t.label} className="flex items-center gap-3 rounded-xl border border-border p-4 cursor-pointer hover:bg-accent">
            <input type="checkbox" checked={t.checked} onChange={(e) => t.onChange(e.target.checked)} className="h-5 w-5 rounded border-border" />
            <span className="text-sm font-medium">{t.label}</span>
          </label>
        ))}
      </div>

      <div className={`rounded-2xl p-6 text-center ${result.eligible ? 'bg-green-100 dark:bg-green-950' : 'bg-destructive/10'}`}>
        <p className="text-sm text-muted-foreground">Your Points</p>
        <p className={`text-4xl font-bold mt-1 ${result.eligible ? 'text-green-700 dark:text-green-400' : 'text-destructive'}`}>{result.totalPoints}</p>
        <p className="text-sm mt-1">{result.eligible ? `On these answers you meet the ${REQUIRED_TOTAL}-point test.` : `Not met (minimum ${REQUIRED_TOTAL}): ${result.failed.join(', ')}.`}</p>
      </div>

      <table className="w-full text-sm">
        <tbody>
          {result.requirements.map((r) => (
            <tr key={r.label} className="border-b border-border/50 align-top">
              <td className="py-2 pr-3"><span className={`font-medium ${r.met ? 'text-green-700 dark:text-green-400' : 'text-destructive'}`}>{r.met ? 'Met' : 'Not met'}: {r.label}</span><br /><span className="text-muted-foreground">{r.detail}</span></td>
              <td className="py-2 text-right tabular-nums font-medium whitespace-nowrap">{r.points} pts</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-2">
        <p>This is a guide, and the Home Office decides. Going rates are from Appendix Skilled Occupations as updated {RATES_AS_AT}, for a 37.5-hour week and pro-rated to your hours. Check your code: your sponsor must choose the SOC 2020 code that fits the job, and the list above covers only some common codes. Only pay for the first 48 hours a week counts towards the salary test.</p>
        <p>These are the current salary figures. From spring 2027 the government is implementing Migration Advisory Committee recommendations: occupation thresholds move from the median to the 25th percentile of wages, the general threshold is uprated on 2026 wage data, and the PhD discount is removed. The Budget 2026 documents do not give the new figures.</p>
      </div>
    </div>
  )
}
