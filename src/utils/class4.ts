// Class 4 NI for 2026/27 with the annual maximum for someone who also pays Class 1 NI.
// Regulation 100, Social Security (Contributions) Regulations 2001. Method: HMRC NIM24175,
// Cases 1 to 3: NIM24176 to NIM24178. There is no Class 2 element from 6 April 2024.
const LOWER_PROFITS_LIMIT = 12_570
const UPPER_PROFITS_LIMIT = 50_270
const CLASS4_MAIN_RATE = 0.06
const CLASS4_ADDITIONAL_RATE = 0.02
const PRIMARY_THRESHOLD = 12_570
const UPPER_EARNINGS_LIMIT = 50_270
const CLASS1_MAIN_RATE = 0.08

export function class4WithAnnualMaximum(profit: number, salary: number) {
  const profitInMainBand = Math.max(0, Math.min(profit, UPPER_PROFITS_LIMIT) - LOWER_PROFITS_LIMIT)
  const profitOverUpperLimit = Math.max(0, profit - UPPER_PROFITS_LIMIT)
  const mainRateOnProfits = profitInMainBand * CLASS4_MAIN_RATE
  const uncapped = mainRateOnProfits + profitOverUpperLimit * CLASS4_ADDITIONAL_RATE

  // Class 1 at the main rate, on one job for the whole year
  const class1Main = Math.max(0, Math.min(salary, UPPER_EARNINGS_LIMIT) - PRIMARY_THRESHOLD) * CLASS1_MAIN_RATE

  // Steps 1 to 4: £37,700 x 6% = £2,262, less Class 1 at the main rate
  const step4 = (UPPER_PROFITS_LIMIT - LOWER_PROFITS_LIMIT) * CLASS4_MAIN_RATE - class1Main

  let maximum: number
  if (step4 > 0 && step4 > class1Main + mainRateOnProfits) {
    // Case 1: step 4 is the maximum and no further steps apply
    maximum = step4
  } else {
    // Case 2: step 4 is the most payable at 6%. Case 3: a negative step 4 is treated as nil.
    const mainRateMaximum = Math.max(0, step4)
    const step5 = mainRateMaximum / CLASS4_MAIN_RATE
    const step7 = Math.max(0, profitInMainBand - step5)
    maximum = mainRateMaximum + step7 * CLASS4_ADDITIONAL_RATE + profitOverUpperLimit * CLASS4_ADDITIONAL_RATE
  }

  // A contributor whose profits fall short of the maximum pays only the Class 4 actually due (NIM24176)
  const class4 = Math.min(uncapped, maximum)
  return { class4, uncapped, capped: uncapped - class4 >= 0.005 }
}
