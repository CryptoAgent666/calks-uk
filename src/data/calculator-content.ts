/**
 * Extended content for calculator pages: How It Works, worked examples, source links.
 * Used to enrich SEO content depth on individual calculator pages.
 */

export interface CalculatorContent {
  /** Quick TL;DR answer (1-3 sentences) shown above calculator — optimised for AI citation */
  quickAnswer?: string
  /** Optional HTML table (rates, thresholds, tiers) — easier for LLMs to cite than prose */
  rateTable?: { title: string; html: string }
  /** Heading for the explanation section */
  howItWorks: string[]
  /** A worked example with specific numbers */
  example: { title: string; steps: string[] }
  /** Official source URL */
  sourceUrl: string
  /** Source display name */
  sourceName: string
  /** Last verified date */
  lastUpdated: string
}

export const CALCULATOR_CONTENT: Record<string, CalculatorContent> = {
  'income-tax-calculator': {
    quickAnswer: `UK income tax in 2026/27 has a <strong>£12,570 Personal Allowance</strong>, then <strong>20% Basic Rate</strong> up to £50,270, <strong>40% Higher Rate</strong> up to £125,140, and <strong>45% Additional Rate</strong> above. The allowance tapers off between £100,000 and £125,140 at an effective 60% marginal rate.`,
    rateTable: { title: `UK Income Tax bands 2026/27 (England, Wales, NI)`, html: `<table><thead><tr><th>Band</th><th>Taxable income</th><th>Rate</th></tr></thead><tbody><tr><td>Personal Allowance</td><td>Up to £12,570</td><td>0%</td></tr><tr><td>Basic Rate</td><td>£12,571 to £50,270</td><td><strong>20%</strong></td></tr><tr><td>Higher Rate</td><td>£50,271 to £125,140</td><td><strong>40%</strong></td></tr><tr><td>Additional Rate</td><td>Over £125,140</td><td><strong>45%</strong></td></tr></tbody></table>` },
    howItWorks: [
      'UK income tax is calculated on a progressive banding system. You are entitled to a tax-free <a href="/calculator/income-tax-calculator/" class="text-primary underline">Personal Allowance</a> of £12,570 for the 2026/27 tax year. Income above that is taxed at increasing rates: 20% Basic Rate (£12,571–£50,270), 40% Higher Rate (£50,271–£125,140) and 45% Additional Rate (above £125,140).',
      'If you earn more than £100,000, your <a href="/calculator/income-tax-calculator/" class="text-primary underline">Personal Allowance</a> is reduced by £1 for every £2 above this threshold. This creates an effective marginal rate of 60% on income between £100,000 and £125,140. The allowance is completely eliminated at £125,140.',
      'This calculator applies the exact banding structure used by HMRC. Enter your gross annual salary and it will show your tax breakdown by band, your effective tax rate and your take-home position. Scottish taxpayers should use the <a href="/calculator/scottish-income-tax-calculator/" class="text-primary underline">Scottish Income Tax Calculator</a> instead, as Scotland has its own rates and bands.',
    ],
    example: {
      title: 'Example: £45,000 annual salary',
      steps: [
        'Personal Allowance: £12,570 at 0% = £0 tax',
        'Basic Rate: £32,430 (£12,571 to £45,000) at 20% = £6,486',
        'Total income tax: £6,486',
        'Effective tax rate: 14.4%',
      ],
    },
    sourceUrl: 'https://www.gov.uk/income-tax-rates',
    sourceName: 'HMRC — Income Tax rates and Personal Allowances',
    lastUpdated: 'April 2026',
  },

  'national-insurance-calculator': {
    quickAnswer: `UK employee National Insurance (Class 1) in 2026/27 is <strong>8% on earnings between £12,570 and £50,270</strong>, then <strong>2% above £50,270</strong>. There is no NI below the £12,570 Primary Threshold.`,
    howItWorks: [
      'Class 1 Employee National Insurance is charged on earnings above the Primary Threshold of £12,570 per year. For the 2026/27 tax year, the rate is 8% on earnings between £12,570 and £50,270 (the Upper Earnings Limit), then 2% on everything above £50,270.',
      'NI is calculated on a per-pay-period basis, so weekly and monthly thresholds differ slightly from the annual figures. This calculator uses annualised thresholds for simplicity, which gives results that match HMRC\'s annual calculation to within a few pence.',
      'You stop paying employee NI when you reach State Pension age, even if you continue working. The calculator assumes you are below State Pension age.',
      'Why Class 1 NI is structured the way it is. Employee NI was originally designed to fund contributory benefits (State Pension, ESA, JSA). The 8% main rate on £12,570-£50,270 (Primary Threshold to Upper Earnings Limit) reflects the principle that NI taps middle earnings most heavily. Above £50,270 the rate drops to 2% — historically because higher earners already pay 40% income tax and the regressive design dampens it. Earnings between £6,708 (LEL) and £12,570 (PT) pay no cash NI but earn qualifying years toward State Pension.',
      'The 2024 NI rate cut and what changed. Until November 2023 the main rate was 12%; then 10% (Jan 2024); then 8% (April 2024). The cuts were estimated to save median earners around £450-£900/year. The Conservative government framed these as personal-tax cuts; critics noted that frozen thresholds (Personal Allowance, Higher Rate threshold) created \'fiscal drag\' that offset most of the rate cuts. As of 2026/27 the 8% rate remains; freezing continues until at least April 2028 under current policy.',
      'NI after State Pension age. You stop paying employee NI on or after your State Pension age (currently 66, rising to 67 between 2026-2028). You still pay income tax. Employers continue to pay employer NI on your earnings regardless of your age. You can request HMRC form CA4140 to get a refund if your employer incorrectly continues deducting NI after pension age. Self-employed Class 4 NI also stops at pension age (Class 2 was abolished April 2024).',
      'Contracted-out vs current arrangements. Pre-April 2016 you could be \'contracted out\' of the additional State Pension (SERPS/S2P) in exchange for a lower NI rate. This ended with the new flat-rate State Pension. If you contracted out before 2016, your State Pension may include a \'Contracted-Out Deduction\' but you may also have an additional defined benefit/contribution scheme that replaced the additional pension. Check your State Pension forecast at gov.uk/check-state-pension to see your exact entitlement.',
    ],
    example: {
      title: 'Example: £35,000 annual salary',
      steps: [
        'Earnings below Primary Threshold (£12,570): £0 NI',
        'Earnings £12,571–£35,000 at 8%: £22,430 × 0.08 = £1,794.40',
        'Total NI: £1,794.40 per year (£149.53/month)',
      ],
    },
    sourceUrl: 'https://www.gov.uk/guidance/rates-and-thresholds-for-employers-2025-to-2026',
    sourceName: 'HMRC — NI rates and thresholds 2026/27',
    lastUpdated: 'April 2026',
  },

  'vat-calculator': {
    quickAnswer: `UK VAT standard rate is <strong>20%</strong> (reduced 5%, zero 0%). To add VAT: multiply by 1.20. To remove VAT: divide by 1.20. The VAT-inclusive total divided by 6 gives the VAT portion. VAT registration threshold is £90,000.`,
    rateTable: { title: `UK VAT rates`, html: `<table><thead><tr><th>Rate</th><th>Applies to</th></tr></thead><tbody><tr><td><strong>20%</strong> Standard</td><td>Most goods and services</td></tr><tr><td><strong>5%</strong> Reduced</td><td>Domestic energy, children car seats, mobility aids, sanitary products</td></tr><tr><td><strong>0%</strong> Zero</td><td>Most food, children clothing, books, prescription medicines, public transport</td></tr><tr><td>Exempt</td><td>Insurance, finance, education, healthcare (cannot reclaim input VAT)</td></tr></tbody></table>` },
    howItWorks: [
      'Value Added Tax (VAT) in the UK is charged at three rates: Standard (20%), Reduced (5%) and Zero (0%). The standard rate applies to most goods and services. The reduced rate covers items like home energy, child car seats and mobility aids. The zero rate applies to essentials including most food, children\'s clothing and books.',
      'This calculator supports three modes: Add VAT (calculate the gross from a net amount), Remove VAT (find the net from a gross amount) and Reverse VAT (extract the VAT component from a VAT-inclusive total). The formula to remove 20% VAT from a gross price is: Net = Gross ÷ 1.20.',
      'Businesses with VAT-taxable turnover above £90,000 (the 2026/27 threshold) must register for VAT. Below this threshold, voluntary registration is possible.',
    ],
    example: {
      title: 'Example: Adding 20% VAT to £500',
      steps: [
        'Net amount: £500.00',
        'VAT at 20%: £500.00 × 0.20 = £100.00',
        'Gross amount: £600.00',
        'To reverse: £600 ÷ 1.20 = £500 net',
      ],
    },
    sourceUrl: 'https://www.gov.uk/vat-rates',
    sourceName: 'GOV.UK — VAT rates',
    lastUpdated: 'April 2026',
  },

  'stamp-duty-calculator': {
    quickAnswer: `UK Stamp Duty (SDLT) in 2026/27: <strong>0% up to £125,000</strong>, 2% to £250,000, 5% to £925,000, 10% to £1.5m, 12% above. First-time buyers: 0% up to £300,000, 5% to £500,000. Additional property: +5% surcharge.`,
    rateTable: { title: `UK Stamp Duty Land Tax bands 2026/27 (standard residential)`, html: `<table><thead><tr><th>Property price band</th><th>SDLT rate</th></tr></thead><tbody><tr><td>£0 to £125,000</td><td>0%</td></tr><tr><td>£125,001 to £250,000</td><td>2%</td></tr><tr><td>£250,001 to £925,000</td><td>5%</td></tr><tr><td>£925,001 to £1,500,000</td><td>10%</td></tr><tr><td>Over £1,500,000</td><td>12%</td></tr></tbody></table>` },
    howItWorks: [
      'Stamp Duty Land Tax (SDLT) is payable on property purchases in England and Northern Ireland above certain thresholds. From April 2025, the standard nil-rate band is £125,000. Rates then rise through bands: 2% (£125,001–£250,000), 5% (£250,001–£925,000), 10% (£925,001–£1.5m) and 12% (above £1.5m).',
      'First-time buyers purchasing their first home up to £500,000 pay no SDLT on the first £300,000, then 5% on the portion from £300,001 to £500,000. Properties above £500,000 do not qualify for first-time buyer relief.',
      'If you already own a property and are buying an additional one (second home, buy-to-let), a 5% surcharge applies to the entire purchase price on top of standard rates. This calculator handles all three scenarios — standard, first-time buyer and additional property.',
    ],
    example: {
      title: 'Example: £350,000 property (standard rates)',
      steps: [
        '£0–£125,000 at 0% = £0',
        '£125,001–£250,000 at 2% = £2,500',
        '£250,001–£350,000 at 5% = £5,000',
        'Total SDLT: £7,500 (effective rate: 2.14%)',
      ],
    },
    sourceUrl: 'https://www.gov.uk/stamp-duty-land-tax/residential-property-rates',
    sourceName: 'GOV.UK — Stamp Duty rates for residential property',
    lastUpdated: 'April 2026',
  },

  'take-home-pay-calculator': {
    quickAnswer: `Your UK take-home pay = gross salary minus income tax (20%/40%/45%), employee NI (8%/2%), pension contribution and student loan if applicable. Typical take-home on <strong>£35,000</strong> is around <strong>£27,800/year</strong> (£2,317/month).`,
    howItWorks: [
      'Your take-home pay is what remains after all statutory deductions are subtracted from your gross salary. In the UK, these deductions include income tax (based on your tax code and banding), employee National Insurance (8% and 2%), workplace pension contributions (typically 5% for auto-enrolment) and student loan repayments (if applicable).',
      'This calculator applies deductions in the correct order: pension contributions are deducted before tax if made via <a href="/calculator/salary-sacrifice-calculator/" class="text-primary underline">salary sacrifice</a>, or after tax if made via net-pay arrangement. Student loan repayments are calculated at 9% of income above the relevant plan threshold (6% for Postgraduate Loans).',
      'The result shows your monthly and annual take-home pay, with a full breakdown of each deduction. You can toggle pension contributions, student loan plans, and bonus payments to see how they affect your net income.',
      'How UK PAYE deductions stack. Your gross salary is reduced by, in order: salary sacrifice (pension, cycle-to-work, EV scheme), income tax via PAYE bands, employee NI at 8%/2%, student loan repayment if applicable, and any remaining pension RAS contributions. Salary sacrifice is most powerful because it reduces both income tax AND NI base — every £100 sacrificed saves £32 (basic rate) or £42 (higher rate) versus the £20-40 saved on RAS pension contributions.',
      'Why your first payslip of the year looks different. UK PAYE is cumulative across the tax year (6 April to 5 April). At the start of a new tax year, your tax-free allowance is fresh. Your monthly tax = (cumulative pay × tax band) - (cumulative tax already paid). This means a bonus in April attracts more apparent tax than the same bonus in March — but balances out over the year. The K-code (e.g. K500) means deductions exceed allowances; the L-code (e.g. 1257L) is standard.',
      'Common reasons for unexpected take-home variations. Pay rises mid-year change your tax code and may shift you into a higher band; bonus payments are taxed as one-off lump sums but adjusted through the year; pension contribution changes affect take-home immediately; student loan crossing the threshold adds 9% above £29,385 (Plan 2); High Income Child Benefit Charge starts kicking in above £60,000; childcare voucher schemes change PAYE; and a P11D benefit (company car, private health) increases your taxable income via your tax code.',
      'Maximising take-home pay legally. Three biggest levers for UK employees: (1) Pension contributions via salary sacrifice — saves income tax + NI, employer often shares NI saving back; (2) Cycle-to-work scheme — saves 32-42% on bike up to £1,000; (3) EV through salary sacrifice — BiK rate is just 2% until April 2025, then 3-7% to 2030 (still cheap vs PCH). Avoid: (a) earning above £100k loses Personal Allowance taper (effective 60% rate); (b) ad-hoc P11D benefits often less tax-efficient than equivalent cash.',
    ],
    example: {
      title: 'Example: £40,000 salary, Plan 2 student loan, 5% pension',
      steps: [
        'Gross salary: £40,000',
        'Pension (5% salary sacrifice): −£2,000',
        'Taxable income: £38,000',
        'Income tax: £5,086 (£25,430 at 20%)',
        'Employee NI: £1,874.40',
        'Student loan Plan 2 (9% above £29,385): £1,143.45',
        'Take-home pay: £29,896.15/year (£2,491.35/month)',
      ],
    },
    sourceUrl: 'https://www.gov.uk/estimate-income-tax',
    sourceName: 'GOV.UK — Estimate your Income Tax',
    lastUpdated: 'April 2026',
  },

  'mortgage-repayment-calculator': {
    quickAnswer: `UK mortgage monthly payment uses the standard formula: <strong>M = P × r(1+r)^n / ((1+r)^n − 1)</strong> where P is loan, r is monthly rate, n is number of months. A £200,000 mortgage at 5% over 25 years costs about <strong>£1,169/month</strong>.`,
    howItWorks: [
      'A repayment mortgage calculator uses the standard amortisation formula to calculate your fixed monthly payment. The formula accounts for the loan amount, annual interest rate and loan term to produce a payment that covers both interest and capital repayment, so the loan is fully repaid by the end of the term.',
      'With a repayment mortgage, early payments are mostly interest, but over time the capital portion grows. An interest-only mortgage charges only the interest each month, leaving the full capital balance due at the end. This calculator supports both types and shows the total amount repaid over the life of the loan.',
      'The calculation assumes a fixed interest rate throughout the term. In practice, most UK mortgages are fixed for 2-5 years before reverting to the lender\'s standard variable rate (SVR). Use the mortgage comparison features to compare different rates and terms side by side.',
      'Repayment vs Interest-Only — the £200,000 example. On a £200,000 mortgage at 5% over 25 years: repayment costs £1,169/month (total cost £350,800; principal £200,000 + interest £150,800). Interest-only costs just £833/month but the full £200,000 must be repaid at the end. Most lenders require a credible repayment plan (investment ISA, pension lump sum) for residential interest-only. BTL mortgages are typically interest-only because rental income covers interest and capital growth covers the eventual balance.',
      'How interest rate moves change your payment. A 1% rate rise on £200,000 over 25 years adds ~£110/month (£1,169 → £1,283). A 2% rise adds £230/month. For variable/tracker mortgages this hits immediately; for fixed-rate borrowers it hits at the end of the fix period. The Bank of England\'s 14 base rate hikes (2021-2023) plus 5 cuts (2024-2025) mean today\'s typical 5-year fix is 4.3-5.0%. Use the calculator\'s \'what if rates go up\' to test affordability at +2% as the Mortgage Charter recommends.',
      'Overpayments — the most powerful wealth lever. £100/month overpayment on a £200,000/5%/25-year mortgage cuts the term by 4 years 7 months and saves £35,000+ in interest. £200/month overpayment cuts ~7 years and £58,000. Most UK fixed-rate mortgages allow 10% annual overpayment penalty-free. After the fix ends, you can overpay without limit (subject to your lender). Overpaying early in the term has 2-3× the impact of overpaying late.',
      'When to fix, when to track, when to remortgage. Fix when rates are stable/falling and you value certainty — 2-year fixes for short-term, 5-year for stability, 10-year for ultra-long-term. Track when you expect rates to fall — but check the \'collar\' (some trackers have minimum rates). Discount mortgages (% below SVR) suit short-term borrowers. Remortgage 3-6 months before your current deal ends; use the \'product transfer\' option with your current lender for speed, or shop the market for the best rate (usually saves 0.1-0.5%).',
    ],
    example: {
      title: 'Example: £250,000 mortgage at 4.5% over 25 years',
      steps: [
        'Monthly repayment: £1,389.58',
        'Total repaid over 25 years: £416,874',
        'Total interest paid: £166,874',
        'Interest-only alternative: £937.50/month (capital still owed at end)',
      ],
    },
    sourceUrl: 'https://www.bankofengland.co.uk/monetary-policy/the-interest-rate-bank-rate',
    sourceName: 'Bank of England — Base rate',
    lastUpdated: 'April 2026',
  },

  'pension-calculator': {
    quickAnswer: `Workplace pension auto-enrolment minimum is <strong>8% total</strong> on qualifying earnings (£6,240 to £50,270): 5% from you, 3% from your employer. Higher rate taxpayers get <strong>40% tax relief</strong>. Annual allowance is £60,000 for 2026/27.`,
    howItWorks: [
      'This calculator projects the value of your pension pot at retirement based on your current contributions, employer contributions, investment growth and tax relief. It uses compound growth with monthly contributions to model how your pot grows over time.',
      'UK pension contributions receive tax relief at your marginal rate. Basic-rate taxpayers get 20% relief automatically (a £100 contribution costs you £80). Higher-rate taxpayers can claim an additional 20% through <a href="/calculator/self-assessment-tax-calculator/" class="text-primary underline">Self Assessment</a>. The annual allowance for 2026/27 is £60,000.',
      'Auto-enrolment requires a minimum total contribution of 8% (5% employee + 3% employer). Many employers offer more generous matching schemes. The calculator lets you model different contribution levels and see the impact on your projected retirement income.',
      'How much should you contribute? A common rule of thumb is to take your age when you start saving and halve it — that\'s the percentage of pre-tax salary to put away. Starting at 25 means 12.5%; at 30 it\'s 15%; at 40 it\'s 20%. The legal auto-enrolment minimum (5% employee + 3% employer = 8% total on qualifying earnings) is rarely enough on its own. The Pensions and Lifetime Savings Association estimates a single person needs £23,300/year in retirement for a moderate lifestyle, or £37,300 for comfortable — both well above what 8% will deliver alone.',
      'Salary sacrifice vs Relief at Source vs Net Pay. Three different ways UK pensions process contributions affect your take-home pay differently. Salary sacrifice (most workplace schemes) reduces your gross salary before income tax AND NI is calculated — saving 28-47% per £100 contributed. Relief at Source (most personal pensions and SIPPs) takes contributions from your net pay and HMRC adds 25% (basic-rate relief); higher-rate taxpayers claim the extra 20-25% via <a href="/calculator/self-assessment-tax-calculator/" class="text-primary underline">Self Assessment</a>. Net Pay arrangements deduct contributions before tax but after NI is calculated. Always check which method your scheme uses — <a href="/calculator/salary-sacrifice-calculator/" class="text-primary underline">salary sacrifice</a> typically gives the biggest benefit.',
      'The Annual Allowance and Tapered Annual Allowance. You can contribute up to £60,000 (or 100% of earnings, whichever is lower) in 2026/27 with full tax relief. Above this you pay an <a href="/calculator/pension-annual-allowance-calculator/" class="text-primary underline">Annual Allowance Charge</a> at your marginal rate. High earners face the Tapered Annual Allowance: for every £2 of \'adjusted income\' over £260,000, your allowance reduces by £1, down to a minimum of £10,000. You can use \'carry forward\' to bring unused allowance from the previous three tax years (provided you were a member of a registered scheme in those years). Once you \'flexibly access\' a DC pension, the <a href="/calculator/pension-annual-allowance-calculator/" class="text-primary underline">Money Purchase Annual Allowance</a> (£10,000) replaces the standard limit.',
      'When can you take your pension? Defined Contribution pensions can be accessed from age 55 (rising to 57 from 6 April 2028). You can take 25% tax-free (the Pension Commencement Lump Sum), with the remaining 75% drawn as taxable income via annuity, drawdown or lump sums (UFPLS). Defined Benefit and final salary schemes have their own retirement ages (typically 60 or 65). State Pension age is currently 66, rising to 67 between 2026 and 2028, and 68 thereafter. Drawing your pension before State Pension age means the pot must support more years, so a sustainable withdrawal rate of 3.5-4% per year is recommended.',
      'Pension vs ISA — which is better? Pensions give tax relief on the way in but tax most of the income on the way out (75% taxable). ISAs use post-tax money but pay completely tax-free. For higher-rate taxpayers, pensions almost always win because you get 40% relief in but likely pay only 20% basic rate in retirement. For basic-rate taxpayers, pensions still win for the 25% tax-free lump sum and employer match, but the gap narrows. <a href="/calculator/lifetime-isa-calculator/" class="text-primary underline">Lifetime ISA</a>s (LISAs) for under-40s give a 25% government bonus and tax-free withdrawals after age 60 — combining one of each is often optimal.',
    ],
    example: {
      title: 'Example: Age 30, £40,000 salary, 5%+3% contributions, retiring at 67',
      steps: [
        'Monthly employee contribution: £166.67 (5%)',
        'Monthly employer contribution: £100.00 (3%)',
        'Tax relief (basic rate): £41.67/month',
        'Total monthly: £308.34',
        'Projected pot at 67 (5% growth): ~£390,000',
        'Potential annual drawdown (4% rule): ~£15,600',
      ],
    },
    sourceUrl: 'https://www.gov.uk/tax-on-your-private-pension/annual-allowance',
    sourceName: 'GOV.UK — Pension annual allowance',
    lastUpdated: 'April 2026',
  },

  'capital-gains-tax-calculator': {
    quickAnswer: `UK Capital Gains Tax in 2026/27: <strong>£3,000 annual exempt amount</strong>, then 18% (basic rate) or 24% (higher rate) on all asset types including residential property. Rates were unified in the October 2024 Budget.`,
    howItWorks: [
      'Capital Gains Tax (CGT) is charged on the profit you make when you sell or dispose of an asset that has increased in value. For the 2026/27 tax year, the annual exempt amount is £3,000. Gains above this are taxed at different rates depending on the asset type and your income tax band.',
      'Residential property gains are taxed at 18% (basic rate) or 24% (higher/additional rate). All other assets are taxed at 10% (basic rate) or 20% (higher/additional rate). Your unused basic rate band determines which rate applies to your gains.',
      'Your main home is usually exempt under Private Residence Relief. Losses from other disposals in the same or previous tax years can be offset against gains before tax is calculated.',
      'The big October 2024 Budget change. Before 30 October 2024, CGT was 10% (basic rate) or 20% (higher rate) for most assets, and 18%/24% for residential property. The Budget unified rates: now 18% (basic) or 24% (higher) on ALL asset types — shares, crypto, business sales, second properties. The change applies to disposals on or after 30 October 2024. Business Asset Disposal Relief rates also rose: from 10% to 14% (April 2025) and 18% (April 2026). The £1m lifetime BADR limit remains.',
      'The £3,000 Annual Exempt Amount and how to use it. Each person has £3,000 of tax-free gains per tax year (reduced from £12,300 in 2022/23). Married couples and civil partners each get their own £3,000, allowing jointly held assets to use £6,000/year. Unused AEA cannot be carried forward — use it or lose it. Strategy: \'Bed and Spousing\' (sell shares, partner buys back identically) lets one spouse crystallise gains using the other\'s AEA. \'<a href="/calculator/isa-calculator/" class="text-primary underline">Bed and ISA</a>\' (sell taxable shares, immediately rebuy inside an ISA) realises gains within the AEA and shelters future growth.',
      'What counts as a disposal? CGT applies on: selling, gifting (except to spouse or charity), exchanging (including crypto-to-crypto trades), and receiving compensation for damaged or lost assets. Death is NOT a disposal — assets get a \'capital gains uplift\' to market value at death. Transfers between spouses are nil-gain/nil-loss. Crypto disposals include using crypto to buy goods, swapping ETH for BTC, or earning yield. The OECD\'s Crypto-Asset Reporting Framework (CARF) requires UK exchanges to report user transactions to HMRC from 2026.',
      'Principal Private Residence (PPR) relief. Your main home is exempt from CGT under PPR. To qualify fully, the property must have been your main residence throughout ownership. Time-apportioned relief applies for periods of absence; the final 9 months always count as PPR even if you have moved. Tighter rules apply if you have lived in the property short-term and rented it out (Letting Relief is now restricted to shared-occupancy lets). If you have multiple homes, file a \'PPR election\' within 2 years of having a second home to nominate which one is the main residence for tax purposes.',
      'Reporting and paying CGT. Most CGT is reported via Self Assessment by 31 January following the tax year end. UK residential property disposals must be reported separately within 60 days of completion via the gov.uk Capital Gains Tax on UK Property service. Late filing penalties: £100 immediately, then daily £10 penalties after 3 months, plus interest. The CGT \'Real Time\' service lets you report and pay non-property gains immediately if you do not want to wait for the year-end return. Crypto disposals must be calculated using the Section 104 \'pooling\' rules (similar to share matching).',
    ],
    example: {
      title: 'Example: £25,000 gain on shares, higher-rate taxpayer',
      steps: [
        'Total gain: £25,000',
        'Less annual exempt amount: −£3,000',
        'Taxable gain: £22,000',
        'CGT at 20% (higher rate, non-property): £4,400',
      ],
    },
    sourceUrl: 'https://www.gov.uk/capital-gains-tax/rates',
    sourceName: 'GOV.UK — Capital Gains Tax rates',
    lastUpdated: 'April 2026',
  },

  'inheritance-tax-calculator': {
    quickAnswer: `UK Inheritance Tax in 2026/27: <strong>£325,000 nil-rate band</strong> plus <strong>£175,000 residence nil-rate band</strong> (for home left to direct descendants). Rate is <strong>40%</strong> above the threshold. RNRB tapers at £2m+ estates.`,
    howItWorks: [
      'Inheritance Tax (IHT) is charged at 40% on the value of an estate above the nil-rate band of £325,000. An additional residence nil-rate band (RNRB) of £175,000 is available when passing a home to direct descendants (children or grandchildren), giving a potential threshold of £500,000 per person.',
      'Married couples and civil partners can transfer unused nil-rate bands to the surviving partner, potentially giving a combined threshold of £1 million. The rate is reduced to 36% if at least 10% of the net estate is left to qualifying charities.',
      'The RNRB is tapered for estates above £2 million, reducing by £1 for every £2 above this threshold. Gifts made within 7 years of death may also be subject to IHT on a sliding scale (taper relief).',
      'The full picture: NRB + RNRB + spouse transfer. UK IHT is 40% on the estate above the Nil-Rate Band of £325,000 (frozen until April 2030). Plus a Residence Nil-Rate Band of £175,000 if you leave your main home to direct descendants (children, grandchildren). Both bands transfer between spouses, so a married couple can pass £1,000,000 (£325k + £175k × 2) before IHT if planned correctly. Above £2m total estate value, the RNRB tapers by £1 for every £2 over £2m, eliminated at £2.35m.',
      'Lifetime gifts and the 7-year rule. Gifts made more than 7 years before death are entirely outside the estate. Gifts within 7 years are \'Potentially Exempt Transfers\' (PETs) — if you die during this period, they count back into the estate, with taper relief reducing the IHT charge on a sliding scale (8% per year from year 3): 100% IHT in years 0-3, 80% in year 4, 60% year 5, 40% year 6, 20% year 7. Annual gift allowance is £3,000 per person (can carry forward one year). Small gifts (£250 per person per year) are exempt. Wedding gifts £5,000 (child), £2,500 (grandchild), £1,000 (other) are exempt.',
      'Business and Agricultural Relief — major IHT shelters. <a href="/calculator/inheritance-tax-calculator/" class="text-primary underline">Business Property Relief</a> (BPR) gives 100% IHT exemption on shares in unlisted trading companies (AIM shares often qualify) held for 2+ years, and on sole trader / partnership assets. Agricultural Property Relief (APR) gives 100% on farmland used for agriculture for 2+ years (7 if let). Both reliefs are under reform from April 2026: the first £1m of combined BPR/APR remains 100% relief; above £1m the relief reduces to 50% (effective IHT rate 20%). This affects high-value family farms and businesses.',
      'Pensions and IHT — the 2027 change. Until 5 April 2027, defined contribution pensions sit outside the IHT estate — passed to nominated beneficiaries free of IHT (income tax may apply if you die after 75). From 6 April 2027, most undrawn pensions will be included in the IHT estate. This is one of the largest IHT changes in decades and will affect millions of pensions. Estate planning strategies for those affected include: drawing down pension earlier and gifting, buying annuities, strategic use of trusts.',
      'Trusts, Charity gifts, and other planning. Discretionary trusts cap entry at the NRB (£325k) per 7-year period without triggering immediate 20% tax. Charity gifts are entirely exempt and reduce the IHT rate on the remaining estate from 40% to 36% if 10%+ of the net estate goes to charity. Lifetime insurance written into trust pays out IHT-free and provides liquidity for beneficiaries to pay any IHT bill. Always work with a STEP-qualified solicitor or chartered tax adviser for IHT planning — mistakes are expensive and often irreversible.',
    ],
    example: {
      title: 'Example: £750,000 estate, home to children',
      steps: [
        'Estate value: £750,000',
        'Less nil-rate band: −£325,000',
        'Less residence nil-rate band: −£175,000',
        'Taxable estate: £250,000',
        'IHT at 40%: £100,000',
      ],
    },
    sourceUrl: 'https://www.gov.uk/inheritance-tax/thresholds',
    sourceName: 'GOV.UK — Inheritance Tax thresholds',
    lastUpdated: 'April 2026',
  },

  'dividend-tax-calculator': {
    quickAnswer: `UK Dividend Tax in 2026/27 starts after a <strong>£500 tax-free allowance</strong>. Then: <strong>8.75%</strong> Basic Rate, <strong>33.75%</strong> Higher Rate, <strong>39.35%</strong> Additional Rate. Dividends within an ISA are completely tax-free.`,
    howItWorks: [
      'UK dividends are taxed at special rates that are lower than income tax rates. For 2026/27, the tax-free dividend allowance is £500. Dividends above this are taxed at 8.75% (basic rate), 33.75% (higher rate) or 39.35% (additional rate).',
      'Dividends are added on top of your other income to determine which band they fall into. If your salary already uses up the basic-rate band, your dividends will be taxed at the higher rate. Company directors often optimise the salary/dividend split to minimise total tax.',
      'Dividends received within an ISA or pension are tax-free and do not count towards the dividend allowance. The allowance was reduced from £1,000 in 2023/24 to £500 from 2024/25 onwards.',
      'Why dividends are tax-favoured over salary. UK dividend tax rates (after the £500 allowance) are 8.75% (basic), 33.75% (higher), 39.35% (additional) — significantly lower than the equivalent income tax + NI on salary (20% + 8% = 28% basic; 40% + 2% = 42% higher; 45% + 2% = 47% additional). PLUS dividends don\'t trigger employer NI (15%) or apprenticeship levy (0.5%). The total tax burden on £100 dividend vs £100 salary differs by 20-30% in favour of dividends.',
      'Dividend allowance has shrunk dramatically. The tax-free dividend allowance was £5,000 in 2017/18, cut to £2,000 in 2018/19, then £1,000 in 2023/24, and just £500 from April 2024 (now frozen). For a typical company director earning £40k/year in dividends, the allowance cut from £5k to £500 means £393 more tax annually (£4,500 × 8.75% basic rate).',
      'The optimal director\'s salary/dividend split for 2026/27. With Employment Allowance: salary at £12,570 (Personal Allowance) then dividends. Employer NI on the £7,570 over £5,000 threshold = £1,135.50 — covered by EA, so net cost zero. Income tax on £12,570 = £0 (uses PA). Employee NI on £12,570 = £0 (at PT). Without EA (sole director company): salary at £5,000 (Secondary Threshold) then dividends. Saves £1,135.50 employer NI but loses some pension and statutory benefit accrual.',
      'Dividend planning around the £100k cliff. Income above £100k tapers Personal Allowance by £1 per £2 — creating an effective 60% marginal rate on income between £100k-£125,140. Strategy: shift dividends below £100k where possible, use spouse dividends if jointly owned shares, defer dividend payment to next tax year, or boost pension contributions (reduces \'adjusted net income\') to stay below the taper threshold.',
    ],
    example: {
      title: 'Example: £12,570 salary + £40,000 dividends',
      steps: [
        'Salary uses Personal Allowance: £0 income tax',
        'First £500 dividends: tax-free (dividend allowance)',
        'Next £37,200 dividends (basic rate band): 8.75% = £3,255',
        'Remaining £2,300 dividends (higher rate): 33.75% = £776.25',
        'Total dividend tax: £4,031.25',
      ],
    },
    sourceUrl: 'https://www.gov.uk/tax-on-dividends',
    sourceName: 'GOV.UK — Tax on dividends',
    lastUpdated: 'April 2026',
  },

  'student-loan-repayment-calculator': {
    quickAnswer: `UK student loan repayments (2026/27): <strong>Plan 1</strong> 9% above £26,900; <strong>Plan 2</strong> 9% above £29,385; <strong>Plan 4</strong> 9% above £33,795 (Scotland); <strong>Plan 5</strong> 9% above £25,000; <strong>Postgraduate</strong> 6% above £21,000.`,
    rateTable: { title: `UK Student Loan plan thresholds (2026/27)`, html: `<table><thead><tr><th>Plan</th><th>Who</th><th>Threshold</th><th>Rate</th></tr></thead><tbody><tr><td>Plan 1</td><td>Started before Sep 2012 (E&amp;W)</td><td>£26,900</td><td>9%</td></tr><tr><td>Plan 2</td><td>Sep 2012 to Aug 2023 (E&amp;W)</td><td>£29,385</td><td>9%</td></tr><tr><td>Plan 4</td><td>Scotland</td><td>£33,795</td><td>9%</td></tr><tr><td>Plan 5</td><td>From Aug 2023 (E&amp;W)</td><td>£25,000</td><td>9%</td></tr><tr><td>Postgraduate</td><td>Master or PhD loans</td><td>£21,000</td><td>6%</td></tr></tbody></table>` },
    howItWorks: [
      'Student loan repayments are collected through PAYE alongside tax and NI. You repay 9% of income above your plan\'s threshold (6% for Postgraduate Loans). For 2026/27: Plan 1 threshold is £26,900, Plan 2 is £29,385, Plan 4 (Scotland) is £33,795, and Plan 5 is £25,000.',
      'Repayments are calculated per pay period, not annually. If you are on multiple plans, you repay each one separately. For example, if you have a Plan 2 loan and a Postgraduate Loan, you pay 9% on income above £29,385 for Plan 2, plus 6% above £21,000 for the Postgraduate Loan.',
      'Remaining balances are written off after a set period: 25 years for Plan 1, 30 years for Plans 2 and 4, and 40 years for Plan 5. Interest is charged at RPI plus up to 3% depending on income and plan type.',
      'Which student loan plan are you on? Plan 1: started before September 2012 in England/Wales OR Northern Ireland borrowers — threshold £26,900, 9% repayment, written off 25 years after course ended (or age 65 if older borrower). Plan 2: started September 2012-August 2023 in England/Wales — £29,385, 9%, 30-year writeoff. Plan 4: Scotland (replacing Plan 1 in 2021) — £33,795, 9%, 30 years. Plan 5: started September 2023+ in England — £25,000, 9%, 40-year writeoff. Postgraduate: master\'s or PhD loans — £21,000, 6%, alongside any undergraduate plan.',
      'Why student loans are NOT really \'debt\' for most graduates. With write-off after 25-40 years and 9% repayment on income above threshold, most Plan 2/5 graduates will never repay in full. Estimated 73% of Plan 5 borrowers will not repay full loan + interest (IFS analysis). The loan effectively acts as a graduate tax of 9% above threshold for up to 30-40 years. Voluntary overpayment usually doesn\'t save money for those unlikely to repay in full — invest the money instead.',
      'Interest rate caps and current rates. Plan 2 and Plan 5 charge RPI + up to 3% depending on income (currently capped at RPI). Plan 1 charges RPI. The Government caps student loan interest to prevent excessive growth. As of 2026/27, Plan 2/5 interest is around 4.3% for high earners; Plan 1 around 1.5%. Despite this, most graduates won\'t notice — repayments are deducted via PAYE and the loan balance is incidental until you\'re earning enough to repay.',
      'Self-employed and overseas repayments. Self-employed: pay via Self Assessment based on profits over threshold. Overseas working: still required to pay if income exceeds threshold equivalent — Student Loans Company sends a \'Repayment Schedule\' based on country-specific thresholds (e.g. £29,385 UK = $40,000 US, €34,000 EU equivalents). Failure to declare overseas earnings means SLC can charge UK threshold at 9% — which can be unfair. Always declare overseas employment within 30 days.',
    ],
    example: {
      title: 'Example: £32,000 salary, Plan 2 loan',
      steps: [
        'Income above threshold: £32,000 − £29,385 = £4,705',
        'Annual repayment: £4,705 × 9% = £423.45',
        'Monthly deduction: £35.29',
      ],
    },
    sourceUrl: 'https://www.gov.uk/repaying-your-student-loan/what-you-pay',
    sourceName: 'GOV.UK — Student loan repayment rates',
    lastUpdated: 'April 2026',
  },

  'self-assessment-tax-calculator': {
    quickAnswer: `Self Assessment for 2026/27 includes income tax (20%/40%/45%) plus <strong>Class 4 NI at 6%/2%</strong>. Class 2 was abolished in April 2024. Filing deadline: <strong>31 January 2028</strong> for the 2026/27 year. Penalty £100 for late filing.`,
    howItWorks: [
      'Self Assessment is the system HMRC uses to collect income tax from people whose tax is not fully deducted at source. This includes the self-employed, company directors, landlords, and anyone with income over £150,000 or significant untaxed income.',
      'This calculator estimates your Self Assessment tax bill by combining income tax, <a href="/calculator/sole-trader-tax-calculator/" class="text-primary underline">Class 4 NI</a> (6% on profits between £12,570 and £50,270, then 2% above) and any student loan repayments.',
      'Payment on Account may apply: if your tax bill is over £1,000 and less than 80% was collected at source, you may need to make two advance payments (each 50% of the previous year\'s bill) on 31 January and 31 July.',
    ],
    example: {
      title: 'Example: Self-employed, £55,000 profit',
      steps: [
        'Income tax: £8,432 (PA + Basic + partial Higher)',
        'Class 4 NI: £2,264 + £94.60 = £2,358.60',
        'Total Self Assessment bill: £10,970',
      ],
    },
    sourceUrl: 'https://www.gov.uk/self-assessment-tax-returns',
    sourceName: 'GOV.UK — Self Assessment tax returns',
    lastUpdated: 'April 2026',
  },

  'corporation-tax-calculator': {
    quickAnswer: `UK Corporation Tax in 2026/27: <strong>19% Small Profits Rate</strong> on profits up to £50,000, <strong>25% Main Rate</strong> above £250,000. Marginal Relief applies between (effective ~26.5% on the slice from £50k to £250k).`,
    howItWorks: [
      'UK Corporation Tax is charged on company profits. The main rate is 25% for profits over £250,000. The small profits rate is 19% for profits up to £50,000. Marginal Relief applies for profits between £50,000 and £250,000, creating a gradual transition between the two rates.',
      'The Marginal Relief fraction for 2026/27 is 3/200. This means companies in the marginal band pay an effective rate that rises gradually from 19% to 25% as profits increase from £50,000 to £250,000.',
      'Associated companies share the thresholds. If your company has one associated company, the small profits threshold becomes £25,000 and the main threshold becomes £125,000.',
      'Why Corporation Tax has TWO rates and a band between. Since April 2023, the Small Profits Rate is 19% on profits up to £50,000, and the Main Rate is 25% on profits above £250,000. Profits between £50,000 and £250,000 attract Marginal Relief, giving an effective rate of 26.5% on this slice (yes, higher than 25%). The relief tapers off so that at £250,000 exactly the effective rate becomes 25%. This creates a perverse incentive to either stay under £50k or accept the higher marginal rate.',
      'Marginal Relief formula explained. The fraction is 3/200. For profits between £50,000 and £250,000: tax = (profits × 25%) − (upper limit − profits) × 3/200 × upper limit ÷ profits. For a company with £100,000 profit: tax = £25,000 − (£250,000 − £100,000) × 3/200 × 2.5 = £25,000 − £5,625 = £19,375 (effective 19.375%). Use the calculator to see the exact figure for your profit level.',
      'Associated companies — why this matters for groups. The £50k/£250k bands are divided by the number of \'associated companies\' in your control group. Two associated companies share £25k/£125k bands; three split £16,667/£83,333; and so on. This prevents tax avoidance by splitting a single business across multiple companies. \'Associated\' includes companies controlled by the same person, family group, or spouse — even if they have no commercial relationship.',
      'Practical Corporation Tax planning. Pension contributions are deductible (boost your pot AND cut Corporation Tax). Director\'s salary up to £12,570 PA is deductible (and tax-free for the director). Company-paid private medical insurance is deductible (but creates P11D benefit). R&D Tax Credits give 20% above-the-line credit. Annual Investment Allowance (£1m/year) gives 100% first-year relief on qualifying plant. Strategic timing of expenses around year-end can shift tax into Marginal Relief band or below.',
    ],
    example: {
      title: 'Example: £120,000 profit, no associated companies',
      steps: [
        'Profit: £120,000 (within marginal band)',
        'Tax at main rate: £120,000 × 25% = £30,000',
        'Marginal Relief: (£250,000 − £120,000) × 3/200 = −£1,950',
        'Corporation Tax payable: £28,050',
        'Effective rate: 23.4%',
      ],
    },
    sourceUrl: 'https://www.gov.uk/corporation-tax-rates',
    sourceName: 'GOV.UK — Corporation Tax rates',
    lastUpdated: 'April 2026',
  },

  'employer-ni-calculator': {
    quickAnswer: `Employer NI (Class 1 secondary) in 2026/27 is <strong>15%</strong> on earnings above the <strong>£5,000 Secondary Threshold</strong> (down from £9,100 in 2024). Employment Allowance of <strong>£10,500</strong> can reduce your annual bill if eligible.`,
    howItWorks: [
      'From April 2025, employer National Insurance increased to 15% (up from 13.8%). The secondary threshold was reduced to £5,000 (down from £9,100), meaning employers now pay NI on a significantly larger portion of each employee\'s salary.',
      'The Employment Allowance for 2026/27 is £10,500, which offsets your employer NI bill. Most businesses are eligible unless their total employer NI liability exceeded £100,000 in the previous tax year, or the company has a single director with no other employees.',
      'This calculator shows the cost per employee and lets you estimate the impact of the April 2025 changes compared to the previous year\'s rates.',
      'Why employer NI rose to 15% in April 2025. The Autumn 2024 Budget raised employer Class 1 NI from 13.8% to 15% AND cut the Secondary Threshold from £9,100 to £5,000. Combined, this adds ~£900 per employee earning £40,000+ in 2026/27 vs the previous regime. The Employment Allowance increased to £10,500 (from £5,000) to offset for very small employers — but it has a cliff edge at any employer Class 1 NI exceeding £100,000 in the previous tax year.',
      'Employment Allowance: who qualifies and how much. Eligible employers can claim up to £10,500/year against their Class 1 employer NI bill (2026/27). Eligibility requires: (1) operating a trade or business (not public sector unless qualifying), (2) at least one employee other than just the director, OR two directors both earning above the Secondary Threshold. Sole-director companies cannot claim. From April 2020, employers with employer NI bill >£100,000 in previous tax year cannot claim.',
      'Salary sacrifice — the win-win for employer and employee. When an employee sacrifices £1,000 of salary into pension/EV/cycle-to-work, the employer saves 15% NI (£150) AND avoids 0.5% Apprenticeship Levy (£5) for large payrolls. Many employers share part of this saving back as additional pension contribution. The employee saves income tax (20-45%) AND employee NI (8-2%). Combined tax savings can exceed 40-50% per £1 sacrificed.',
      'Calculating total employment cost. True cost of an employee = gross salary + employer NI 15% (over £5,000) + pension auto-enrolment 3% min (on £6,240-£50,270) + Apprenticeship Levy 0.5% (if total pay >£3m) + holiday pay (already included in salary unless agency) + benefits (private health, life cover, gym, EV scheme). On a £40,000 salary, true cost is typically £45,000-£47,000. Use this calculator to budget the full overhead before hiring.',
    ],
    example: {
      title: 'Example: Employee earning £30,000',
      steps: [
        'Earnings above secondary threshold: £30,000 − £5,000 = £25,000',
        'Employer NI at 15%: £25,000 × 0.15 = £3,750 per year',
        'Previous year (13.8%, £9,100 threshold): £2,884.20',
        'Annual increase: £865.80 per employee',
      ],
    },
    sourceUrl: 'https://www.gov.uk/guidance/rates-and-thresholds-for-employers-2025-to-2026',
    sourceName: 'HMRC — Rates and thresholds for employers 2026/27',
    lastUpdated: 'April 2026',
  },

  'child-benefit-calculator': {
    howItWorks: [
      '<a href="/calculator/child-benefit-calculator/" class="text-primary underline">Child Benefit</a> for 2026/27 is £27.05 per week for the eldest or only child and £17.90 per week for each additional child. Payments are made every 4 weeks and are tax-free unless either parent earns over £60,000.',
      'The High Income <a href="/calculator/child-benefit-calculator/" class="text-primary underline">Child Benefit</a> Charge (HICBC) applies when the higher-earning parent earns between £60,000 and £80,000. You repay 1% of the Child Benefit received for every £200 of income above £60,000. At £80,000 or above, the full amount is effectively clawed back through tax.',
      'You should still claim Child Benefit even if subject to HICBC, as it protects your National Insurance record (important for State Pension qualification) and automatically registers the child for a National Insurance number at 16.',
    ],
    example: {
      title: 'Example: 2 children, higher earner on £70,000',
      steps: [
        'Annual Child Benefit: (£27.05 + £17.90) × 52 = £2,251.60',
        'HICBC: income £70,000, excess over £60,000 = £10,000',
        'Clawback: £10,000 ÷ £200 = 50% of benefit',
        'Tax charge: £2,251.60 × 50% = £1,125.80',
        'Net benefit retained: £1,125.80',
      ],
    },
    sourceUrl: 'https://www.gov.uk/child-benefit-rates',
    sourceName: 'GOV.UK — Child Benefit rates',
    lastUpdated: 'April 2026',
  },

  'mortgage-affordability-calculator': {
    howItWorks: [
      'UK mortgage lenders typically offer 4 to 4.5 times your annual income, though some may stretch to 5.5 times for high earners with minimal outgoings. Affordability is assessed not just on income multiples but also on your ability to meet payments if interest rates rise.',
      'Lenders apply a stress test, checking whether you could afford payments at a rate typically 3% above the product rate (or the lender\'s SVR, whichever is higher). This explains why you may be offered less than the headline income multiple suggests.',
      'Joint applications combine both applicants\' incomes. Existing debts (loans, credit cards, car finance) reduce the amount you can borrow. This calculator factors in your income, deposit, existing commitments and current rates to estimate your borrowing capacity.',
      'How lenders calculate maximum borrowing. UK lenders typically use 4-4.5× annual income as the headline multiplier, but the actual offer depends on detailed affordability assessment: monthly outgoings (council tax, utilities, food, transport, childcare), existing debts (loans, credit cards), number of dependants, and credit score. A single person on £40k might be offered £160-180k. A couple jointly earning £70k might be offered £315-385k. Self-employed need 2-3 years of accounts with consistent profits.',
      'Stress testing — the hidden hurdle. Since the 2014 Mortgage Market Review, lenders must stress-test borrowers\' ability to repay at a rate 3% above the lender\'s Standard Variable Rate (typically 7-8% in 2026). Even if your actual rate is 4.5%, the lender checks you could afford payments at 7.5%. This is why borrowers can be offered less than the 4.5× multiplier suggests. The \'stress rate\' is meant to protect against future rate rises and is reviewed quarterly by the Bank of England\'s Financial Policy Committee.',
      'Joint mortgages and tenancy types. Joint applicants pool incomes — lenders typically use 100% of both salaries. Joint tenancy (most common for couples): both own 100% jointly, automatic right of survivorship. Tenants in common: separate shares (e.g. 60/40), each share can be willed independently — useful for unmarried couples and second marriages. Some lenders allow up to 4 applicants on one mortgage (e.g. parents + 2 children), and \'guarantor\' mortgages where parents back the loan without ownership.',
      'Boosting your borrowing power. (1) Pay down credit cards and overdrafts — outstanding balances reduce maximum borrowing pound-for-pound; (2) Defer non-essential car finance until after the mortgage; (3) Improve credit score (electoral roll, reduce credit utilisation, no recent applications); (4) Consider a \'professional mortgage\' if you\'re a doctor/lawyer/accountant — some lenders offer 5-5.5× income for these; (5) Build a longer deposit — 25% LTV unlocks the best rates and stretches affordability.',
    ],
    example: {
      title: 'Example: £50,000 salary, £30,000 deposit, 4.5× multiple',
      steps: [
        'Maximum borrowing (4.5×): £225,000',
        'Plus deposit: £30,000',
        'Maximum property price: £255,000',
        'Stress-tested at 7.5%: monthly payment £1,789 on £225,000',
      ],
    },
    sourceUrl: 'https://www.fca.org.uk/consumers/mortgages',
    sourceName: 'FCA — Mortgages guidance',
    lastUpdated: 'April 2026',
  },

  'bmi-calculator': {
    howItWorks: [
      'Body Mass Index (BMI) is calculated by dividing your weight in kilograms by the square of your height in metres: BMI = weight (kg) ÷ height (m)². It is used by the NHS as a screening tool to indicate whether your weight is in a healthy range for your height.',
      'The NHS classifies BMI as follows: under 18.5 is underweight, 18.5–24.9 is a healthy weight, 25–29.9 is overweight, and 30 or above is obese. These ranges apply to most adults but may be less accurate for very muscular people, pregnant women, older adults and certain ethnic groups.',
      'This calculator supports both metric (kg/cm) and imperial (stones, pounds, feet, inches) inputs and converts automatically. It shows your BMI value, NHS category and a visual indicator of where you fall on the scale.',
    ],
    example: {
      title: 'Example: 80 kg, 175 cm tall',
      steps: [
        'Height in metres: 1.75 m',
        'BMI = 80 ÷ (1.75 × 1.75) = 80 ÷ 3.0625 = 26.1',
        'NHS category: Overweight (25–29.9)',
        'Healthy weight range for 175 cm: 56.7–76.6 kg',
      ],
    },
    sourceUrl: 'https://www.nhs.uk/live-well/healthy-weight/bmi-calculator/',
    sourceName: 'NHS — BMI Calculator',
    lastUpdated: 'April 2026',
  },

  'council-tax-calculator': {
    howItWorks: [
      'Council tax is a local tax set by each council in England, based on property valuation bands. Properties are banded from A (lowest value) to H (highest) based on their estimated value as of 1 April 1991. Band D is the reference band — all other bands are expressed as a proportion of the Band D charge.',
      'The proportions are: Band A = 6/9, Band B = 7/9, Band C = 8/9, Band D = 9/9, Band E = 11/9, Band F = 13/9, Band G = 15/9, Band H = 18/9 (2× Band D). This means a Band A property pays two-thirds of the Band D rate, while a Band H property pays double.',
      'Discounts and exemptions are available. A 25% single person discount applies if only one adult lives in the property. Full-time students and people with severe mental impairments may be exempt. Council Tax Reduction (formerly Council Tax Benefit) helps those on low incomes.',
      'How Council Tax bands work. Properties were valued on 1 April 1991 (England, Scotland) or 1 April 2003 (Wales). Bands A-H based on the 1991/2003 value: A (lowest), H (highest). Each council sets its own annual charges, with Band D as the reference. Average Band D in 2026/27 is £2,200/year in England, £1,500-£1,800 in Scotland (different system), £2,000+ in Wales. Charges vary widely between councils — Westminster £900, Rutland £2,800 — based on local services and reserves.',
      'Single Person Discount and other reductions. If you live alone (or with only people who don\'t count — students, under-18s, severely mentally impaired), you get 25% off. Empty properties: up to 100% discount for short periods then 100-300% premium after 2+ years (depending on council). Disabled person discount — if property has been adapted for a disabled resident, you may be rebanded down one band. Care leavers, apprentices, monks/nuns also qualify for full exemption in some councils.',
      'Council Tax Reduction (formerly Benefit). Replaces the old Council Tax Benefit since 2013. Each council sets its own scheme — so eligibility varies significantly. Typically based on income, savings (<£16,000), household composition. Pension-age claimants get more generous treatment (national framework). Working-age schemes vary: some pay 100%, others cap at 75-80%. Apply via your local council\'s website. Disability and carer premiums increase the entitlement.',
      'Appealing your band — Council Tax Rebanding. If you believe your property is in the wrong band, you can appeal to the Valuation Office Agency (England/Wales) or Scottish Assessors. Best ground: comparable neighbouring properties in lower bands. The \'Martin Lewis check\' compares your property with neighbours via MSE\'s Council Tax Tool. Successful rebanding refunds back to 1 April 1993 (when current system started) plus reduces future bills. Conversely, the VOA can move you UP a band if you appeal incorrectly — research thoroughly first.',
    ],
    example: {
      title: 'Example: Band C property, single occupant',
      steps: [
        'Assume Band D rate: £2,100',
        'Band C proportion: 8/9 of Band D = £1,866.67',
        'Single person discount (25%): −£466.67',
        'Annual council tax: £1,400.00',
        'Monthly (10 instalments): £140.00',
      ],
    },
    sourceUrl: 'https://www.gov.uk/council-tax/how-much-you-pay',
    sourceName: 'GOV.UK — How council tax works',
    lastUpdated: 'April 2026',
  },

  'universal-credit-calculator': {
    howItWorks: [
      '<a href="/calculator/universal-credit-calculator/" class="text-primary underline">Universal Credit</a> (UC) is calculated by adding a standard allowance (based on age and relationship status) plus additional elements for children, housing costs, caring responsibilities and disability. Your payment is then reduced based on your earnings through a taper rate of 55%.',
      'The work allowance lets you earn a set amount before the taper applies: £404/month if your UC includes no housing element, or £673/month if it does not include housing. For every £1 you earn above the work allowance, your UC is reduced by 55p.',
      'This calculator estimates your UC entitlement based on your household composition, income, housing costs and circumstances. Actual entitlements depend on a full assessment by the DWP and may differ from estimates.',
      'Universal Credit base rates 2026/27. Standard allowance (monthly): Single under 25 £316.98, Single 25+ £400.14, Couple both under 25 £497.55, Couple at least one 25+ £628.10. Plus optional elements: Child (£339.00 first child if born before 6 April 2017; £292.81 first born after; £292.81 per additional child); Childcare costs up to 85% reimbursed (max £1,031 for one child, £1,768 for two); Limited Capability for Work £156.11; Carer Element £198.31; Housing Costs (variable by LHA rate).',
      'The work allowance and taper rate. If you have responsibility for children or limited work capability, you have a work allowance: £404/month (without housing costs) or £673/month (with housing costs). Earn this much before UC reduces. Beyond the allowance, UC reduces by 55p for every £1 of net earnings (the taper). For people without children/capability, the taper applies from the first pound earned. This creates effective marginal tax rates of 75-80% for some workers — a long-standing welfare-to-work problem.',
      'Transitional Protection for legacy benefit migration. If you\'re moved from Tax Credits, ESA, Income Support, JSA, or Housing Benefit to UC (managed migration), you receive Transitional Protection — your UC must be at least as much as your old benefits, with the difference paid as a top-up that erodes over time. This protection is not paid if you voluntarily migrate or if your circumstances change significantly. Managed migration is being rolled out 2024-2028.',
      'Common UC mistakes. (1) Capital limit £16,000 — anything above ends your claim. Includes savings, second properties (not main home), investments. £6,000-£16,000 is tariff income (£4.35/month per £250 over £6,000). (2) Self-employed minimum income floor — if you\'re self-employed >12 months, UC assumes you earn 35×NMW per week even if you actually earn less. (3) Childcare reimbursement is paid AFTER you pay the nursery — many parents struggle with cashflow. (4) Surplus earnings rule — earning above the threshold in one month rolls over into next month\'s calculation.',
    ],
    example: {
      title: 'Example: Single parent, 1 child, earning £1,200/month, £700 rent',
      steps: [
        'Standard allowance (single, 25+): £393.45',
        'Child element (first child): £333.33',
        'Housing element: £700.00',
        'Total entitlement before taper: £1,426.78',
        'Earnings above work allowance: £1,200 − £404 = £796',
        'Taper reduction: £796 × 55% = −£437.80',
        'Estimated UC payment: £988.98/month',
      ],
    },
    sourceUrl: 'https://www.gov.uk/universal-credit/what-youll-get',
    sourceName: 'GOV.UK — Universal Credit payment amounts',
    lastUpdated: 'April 2026',
  },

  'redundancy-pay-calculator': {
    quickAnswer: `Statutory redundancy pay (2026/27): <strong>0.5 weeks</strong> per year aged under 22, <strong>1 week</strong> aged 22 to 40, <strong>1.5 weeks</strong> aged 41+. Capped at <strong>£735/week</strong> and 20 years service. Tax-free up to £30,000.`,
    howItWorks: [
      'Statutory redundancy pay is calculated based on your age, length of continuous service (up to 20 years) and weekly pay (capped at £700 for 2026/27). The formula gives: 0.5 weeks\' pay per year of service under age 22, 1 week per year aged 22–40, and 1.5 weeks per year aged 41 and over.',
      'The maximum statutory redundancy payment is therefore 30 weeks\' pay (20 years × 1.5 for over-41s), capped at £21,000 (30 × £700). Your employer may offer enhanced redundancy pay above the statutory minimum.',
      'The first £30,000 of any redundancy payment (statutory plus contractual) is tax-free. Amounts above £30,000 are subject to income tax and potentially employer NI.',
      'Statutory redundancy formula explained. For each full year of service from age 22 to 40: 1 week\'s pay. For each full year from 41 to 65: 1.5 weeks. Years under 22: 0.5 weeks. Max 20 years count. Cap on weekly pay £735 (2026/27 — was £719 in 2025/26). Maximum total statutory redundancy: 30 × £735 = £22,050. To qualify: at least 2 years continuous service. Voluntary redundancy and non-redundancy dismissals have different rules.',
      'Contractual vs statutory redundancy — know your entitlement. Many employers offer enhanced redundancy in the contract or staff handbook: typical packages 2-4 weeks per year of service uncapped, or a multiple of statutory (e.g. 3× statutory). Public sector schemes (NHS, civil service, local government) traditionally offer ~1 month per year. Check your contract, handbook, and union agreement. Enhanced redundancy must be more generous than statutory; if not, statutory applies as the floor.',
      'Tax-free redundancy up to £30,000. The first £30,000 of redundancy pay (statutory + enhanced + ex gratia) is income tax and NI-free. Above £30,000: income tax applies at marginal rate but no NI (since April 2020 employer NI applies but not employee NI). Notice pay (PILON — Payment In Lieu of Notice) is now ALWAYS taxable (post-April 2018 rules), even if paid as part of a redundancy package. Get the breakdown of any settlement agreement in writing.',
      'Your rights during redundancy. (1) Consultation — collective consultation if 20+ redundancies in 90 days (30 days notice if <100 redundancies, 45 days if 100+). (2) Selection — must be fair criteria (skills, attendance, performance); discriminatory selection (age, gender, disability) is unlawful. (3) Notice — statutory minimum 1 week per year (capped at 12 weeks). (4) Time off to look for work — reasonable paid time for those with 2+ years service. (5) Appeals — internal appeal then potential tribunal claim within 3 months.',
    ],
    example: {
      title: 'Example: Age 45, 12 years\' service, £650/week salary',
      steps: [
        'Years aged 22–40: 7 years × 1 week × £650 = £4,550',
        'Years aged 41–45: 5 years × 1.5 weeks × £650 = £4,875',
        'Total statutory redundancy: £9,425 (tax-free)',
      ],
    },
    sourceUrl: 'https://www.gov.uk/redundancy-your-rights/redundancy-pay',
    sourceName: 'GOV.UK — Redundancy pay',
    lastUpdated: 'April 2026',
  },

  'salary-sacrifice-calculator': {
    howItWorks: [
      'Salary sacrifice is an arrangement where you contractually reduce your gross salary in exchange for a non-cash benefit, most commonly increased pension contributions. Because your taxable salary is lower, you pay less income tax and National Insurance.',
      'For a basic-rate taxpayer sacrificing £100: you save £20 income tax + £8 NI = £28, so the pension contribution effectively costs you only £72. Higher-rate taxpayers save even more — £40 tax + £8 NI = £48 saved per £100 sacrificed.',
      'Your employer also saves 15% employer NI on the sacrificed amount. Some employers pass part of this saving back to you as additional pension contributions. The calculator shows savings for both employee and employer.',
      'How salary sacrifice works mechanically. You agree with your employer to give up part of your gross salary in exchange for a non-cash benefit (pension, cycle scheme, EV, childcare voucher pre-Oct 2018). The sacrificed amount is removed BEFORE income tax AND National Insurance are calculated. For £100 sacrificed into pension: basic-rate saves £20 income tax + £8 employee NI = £28 net cost reduction (vs £20 with RAS pension). Higher-rate: £40 + £2 = £42 saving per £100.',
      'Common salary sacrifice schemes in 2026. Pension (most popular — typically 5% of salary up to 100%); Cycle-to-work scheme (£1,000-£3,000, repaid over 12-18 months); Electric Vehicle (BiK rate 2% to 7% to 2030 — extremely tax-efficient); Workplace Nursery (uncapped for direct provision); Annual Leave Purchase (buying extra holiday); Technology (limited tax advantage post-2017). Childcare Voucher schemes closed to new joiners October 2018 — replaced by Tax-Free Childcare.',
      'Watch out: the minimum wage and benefit traps. Salary sacrifice cannot take your remaining pay below National Minimum Wage (£12.71/hr in 2026 for 21+). Sacrifice also reduces \'qualifying earnings\' for State Pension accrual, Statutory Maternity Pay, mortgage affordability assessments, and some benefits. For employees near these thresholds, sacrificing into pension is usually still net positive (better long-term income) but check the specific impact on Maternity Pay and SMP calculations.',
      'Employer NI savings — the win-win. When you sacrifice £1,000 into pension, your employer saves 15% NI (£150) and 0.5% Apprenticeship Levy if applicable. Many employers share this saving back as ADDITIONAL pension contribution — turning your £1,000 sacrifice into £1,150-£1,155 in the pension. Always ask your HR/payroll team if your scheme is \'NI passback\'. If it isn\'t, suggest implementing one — it\'s free money for employees with no extra cost to the employer beyond admin.',
    ],
    example: {
      title: 'Example: £45,000 salary, sacrifice £5,000 to pension',
      steps: [
        'Income tax saved: £5,000 × 20% = £1,000',
        'Employee NI saved: £5,000 × 8% = £400',
        'Total employee saving: £1,400',
        'Employer NI saved: £5,000 × 15% = £750',
        'Net cost to you: £3,600 for £5,000 pension contribution',
      ],
    },
    sourceUrl: 'https://www.gov.uk/guidance/salary-sacrifice-and-the-effects-on-paye',
    sourceName: 'HMRC — Salary sacrifice guidance',
    lastUpdated: 'April 2026',
  },

  'compound-interest-calculator': {
    howItWorks: [
      'Compound interest means earning interest on both your original deposit and the interest already accumulated. The formula is A = P(1 + r/n)^(nt), where P is the principal, r is the annual rate, n is compounding frequency, and t is time in years.',
      'The difference between simple and compound interest grows dramatically over time. A £10,000 deposit at 5% over 20 years grows to £20,000 with simple interest but £26,533 with annual compounding — over £6,500 more, purely from compounding.',
      'Most UK savings accounts compound interest annually or monthly. AER (Annual Equivalent Rate) shows the effective annual return with compounding factored in, making it the best rate to compare between accounts. This calculator supports daily, monthly, quarterly and annual compounding.',
      'The miracle of compounding — Einstein\'s \'8th wonder\'. £10,000 invested at 7% annual return becomes: £19,672 after 10 years, £38,697 after 20 years, £76,123 after 30 years, £149,745 after 40 years. The first 10 years add £9,672 to your pot; the LAST 10 years add £73,622. Time, not deposit size, drives compounding. Starting at age 25 with £100/month at 7% gives you £262,000 by 65; starting at 35 gives only £121,000 — half the result for skipping just 10 years.',
      'Compound frequency matters less than you\'d think. £10,000 at 5% annual rate over 30 years: annual compounding = £43,219; monthly = £44,677; daily = £44,816; continuous = £44,817. The difference between annual and daily compounding over 30 years is just 3.7%. The compound rate is far more impactful than the frequency. Most UK savings accounts compound daily (interest calculated daily, paid monthly or annually); credit cards compound daily; ISAs are tax-free either way.',
      'How to find the actual rate from advertised AER. AER (Annual Equivalent Rate) is what you actually earn including compounding. APR (Annual Percentage Rate) shows the cost of borrowing including fees. EAR (Effective Annual Rate) is the equivalent including compounding for credit. Always compare AER for savings, APR for loans, APRC for mortgages. A 5% gross monthly-paid account = 5.12% AER (slightly better than 5% paid annually). Comparing only the headline rate misleads you.',
      'Real return = nominal return − inflation. £10,000 at 5% nominal return for 30 years = £43,219 nominally. But with 3% average inflation, the real (purchasing power) value is just £17,816 in today\'s money. To preserve and grow purchasing power, target investments above the inflation rate. Cash savings at 3% lose value when inflation is 4%; stocks averaging 7% beat 3% inflation by 4% real return — the historic UK equity premium. Use real returns to assess actual wealth, not nominal.',
    ],
    example: {
      title: 'Example: £10,000 at 4.5% for 10 years, annual compounding',
      steps: [
        'Year 1: £10,000 × 1.045 = £10,450.00',
        'Year 5: £10,000 × 1.045⁵ = £12,461.82',
        'Year 10: £10,000 × 1.045¹⁰ = £15,529.69',
        'Total interest earned: £5,529.69',
        'Simple interest comparison: £4,500.00 (£1,029.69 less)',
      ],
    },
    sourceUrl: 'https://www.bankofengland.co.uk/monetary-policy/the-interest-rate-bank-rate',
    sourceName: 'Bank of England — Interest rates',
    lastUpdated: 'April 2026',
  },

  'maternity-pay-calculator': {
    howItWorks: [
      '<a href="/calculator/maternity-pay-calculator/" class="text-primary underline">Statutory Maternity Pay</a> (SMP) is paid for up to 39 weeks. The first 6 weeks are paid at 90% of your average weekly earnings (AWE) with no cap. The remaining 33 weeks are paid at the lower of £194.32 per week or 90% of your AWE. The final 13 weeks of the 52-week maternity leave entitlement are unpaid.',
      'To qualify for SMP you must have worked for your employer continuously for at least 26 weeks by the 15th week before the expected week of childbirth, and your average earnings must be at least £125 per week (the Lower Earnings Limit). You must also give at least 28 days\' notice and provide proof of pregnancy (MATB1 certificate).',
      'SMP is treated as earnings, so income tax, National Insurance and pension contributions may still be deducted. Employers can reclaim 92% of SMP from HMRC, or 103% if they qualify for Small Employers\' Relief. This calculator shows your weekly and monthly SMP for the full 39-week period.',
      'Statutory Maternity Pay: 39 weeks of payment. SMP is paid by employer (reclaimed from HMRC) for 39 weeks. Weeks 1-6: 90% of average weekly earnings (no upper cap). Weeks 7-39: lower of £194.32/week or 90% of AWE. Weeks 40-52: unpaid (but job protected). To qualify: 26 weeks continuous service by end of 15th week before due date (the \'qualifying week\'), and earn at least £125/week on average. Notify your employer at least 15 weeks before due date in writing.',
      'Maternity Allowance — for those who don\'t qualify for SMP. Self-employed or recently employed who don\'t qualify for SMP can claim Maternity Allowance: £194.32/week for 39 weeks. Apply via Jobcentre Plus form MA1 from 26 weeks of pregnancy. Eligibility: have worked (employed or self-employed) for 26 weeks in the 66 weeks before due date AND earned £30+/week in 13 of those weeks. Class 2 NI was abolished but self-employed still qualify via earnings test.',
      'Keeping In Touch (KIT) days. You can work up to 10 KIT days during maternity leave without affecting SMP. Each day is paid in addition to SMP at your normal rate (or whatever your employer agrees). KIT days are voluntary on both sides — neither you nor your employer can compel them. Useful for training, team meetings, or smoothing the return. Shared Parental Leave SPLIT days allow up to 20 days between the parents.',
      'Shared Parental Leave — flexible split with partner. Since 2015, parents can share up to 50 weeks of leave and 37 weeks of pay between them (after the mother\'s first 2 weeks of compulsory maternity leave). Eligibility: both parents employed and meet 26-week continuous service + earnings tests. Notify employers 8 weeks before each block. Common patterns: mother takes 6-9 months, father takes the remaining months when child is older. Useful where the mother is the higher earner and wants to return to work faster.',
    ],
    example: {
      title: 'Example: Average weekly earnings of £600',
      steps: [
        'Weeks 1-6 (90% of AWE): £600 × 90% = £540/week = £3,240 total',
        'Weeks 7-39 (lower of £194.32 or 90%): £194.32/week = £6,176.94 total',
        'Total SMP over 39 weeks: £9,416.94',
        'Weeks 40-52: unpaid leave (13 weeks)',
        'Monthly average (first 6 weeks): approx. £2,340 gross',
      ],
    },
    sourceUrl: 'https://www.gov.uk/maternity-pay-leave',
    sourceName: 'GOV.UK — Statutory Maternity Pay and Leave',
    lastUpdated: 'April 2026',
  },

  'holiday-entitlement-calculator': {
    howItWorks: [
      'Under the Working Time Regulations 1998, all UK workers are entitled to a minimum of 5.6 weeks\' paid annual leave per year. For full-time workers (5 days/week), this equals 28 days. Employers may include the 8 bank holidays within this entitlement.',
      'Part-time workers receive a pro-rata entitlement. For example, someone working 3 days per week is entitled to 3 × 5.6 = 16.8 days per year. Workers with irregular hours or on zero-hours contracts accrue holiday at 12.07% of hours worked.',
      'This calculator handles full-time, part-time, and irregular hours workers. For mid-year starters, it pro-rates the entitlement based on the portion of the leave year remaining.',
      'Statutory minimum: 5.6 weeks (28 days). UK Working Time Regulations 1998 entitle workers to 5.6 weeks paid holiday per year — equivalent to 28 days for a full-time 5-day-per-week employee. Employers can include bank holidays (8 in England/Wales) within this 28 days, or give them on top. Part-time workers get pro-rata entitlement: 4 days/week × 5.6 = 22.4 days. Statutory entitlement cannot be replaced with cash except on termination of employment.',
      'How holiday accrues during the year. Most employers use a holiday year (e.g. 1 Jan - 31 Dec or 1 Apr - 31 Mar) and you accrue 1/12 of your annual entitlement each month. New starters can take holiday from day 1 but pay-in-advance is uncommon. Bank holiday falling on a non-working day still counts toward your accrual. Sickness during holiday: you can request to convert holiday to sick leave and reclaim the days (subject to evidence).',
      'Carry-over rules — what you can and can\'t keep. Statutory minimum 4 weeks (the EU-derived portion) CAN\'T be carried over to next year unless prevented from taking by sickness or maternity. The extra 1.6 weeks UK \'top-up\' CAN be carried over by mutual agreement. Many employers contractually allow 5-10 days carry-over. EU-derived holiday lost without being taken is lost — no payment. Exception: long-term sickness — accrued holiday is paid out 18+ months later under the Stringer ruling.',
      'Holiday pay — what\'s the correct rate? Holiday pay must reflect \'normal pay\' including regular overtime, commission, and contractual bonuses (Bear Scotland 2014, Lock 2016, Williams 2017). The reference period is 52 weeks of pay (changed from 12 in April 2020). For zero-hours workers, holiday pay = 12.07% of pay earned (the EAT formula equivalent of 28/365 × 100). Failing to include overtime/commission in holiday pay is a common breach — claims can be backdated 2 years.',
    ],
    example: {
      title: 'Example: Part-time, 3 days/week, started 1 July',
      steps: [
        'Full-year entitlement: 3 × 5.6 = 16.8 days',
        'Proportion of year remaining: 9/12 = 0.75',
        'Pro-rata entitlement: 16.8 × 0.75 = 12.6 days',
        'Rounded: 13 days for the remainder of the leave year',
      ],
    },
    sourceUrl: 'https://www.gov.uk/holiday-entitlement-rights',
    sourceName: 'GOV.UK — Holiday entitlement',
    lastUpdated: 'April 2026',
  },

  'energy-bill-calculator': {
    howItWorks: [
      'Your energy bill is made up of two components: a daily standing charge and a unit rate for the energy you actually use. The standing charge covers the cost of maintaining your connection to the gas and electricity networks. The unit rate is the price per kilowatt-hour (kWh) of energy consumed.',
      'The Ofgem energy price cap sets the maximum unit rates and standing charges that suppliers can charge on default tariffs. The cap is updated quarterly. Typical household consumption is approximately 2,700 kWh of electricity and 11,500 kWh of gas per year.',
      'This calculator lets you enter your actual meter readings or estimated consumption to see your expected annual bill. You can compare different tariff rates to see potential savings from switching.',
    ],
    example: {
      title: 'Example: Average household consumption',
      steps: [
        'Electricity: 2,700 kWh × 24.5p = £661.50',
        'Electricity standing charge: 365 × 61.64p = £224.99',
        'Gas: 11,500 kWh × 6.76p = £777.40',
        'Gas standing charge: 365 × 31.65p = £115.52',
        'Total annual bill: ~£1,779',
      ],
    },
    sourceUrl: 'https://www.ofgem.gov.uk/check-if-energy-price-cap-affects-you',
    sourceName: 'Ofgem — Energy price cap',
    lastUpdated: 'April 2026',
  },

  'solar-panel-calculator': {
    howItWorks: [
      'Solar panels generate electricity from sunlight, reducing your reliance on grid energy. A typical UK domestic system is 3–4 kW (8–10 panels), costing £5,000–£8,000 installed. Output varies by location, roof orientation and panel efficiency, but a 4 kW system in southern England generates approximately 3,400 kWh per year.',
      'You save money by using the generated electricity directly (avoiding the unit rate) and can earn additional income through the Smart Export Guarantee (SEG) by selling surplus electricity back to the grid. SEG rates vary by supplier but typically range from 3–15p per kWh exported.',
      'Battery storage (£2,000–£5,000) lets you store daytime generation for evening use, increasing the proportion of self-consumption from around 30–50% to 70–80%. This calculator estimates generation, savings, SEG income and payback period based on your location and system size.',
    ],
    example: {
      title: 'Example: 4 kW system in central England',
      steps: [
        'Annual generation: ~3,200 kWh',
        'Self-consumption (50%): 1,600 kWh × 24.5p = £392 saved',
        'Export (50%): 1,600 kWh × 10p (SEG) = £160 income',
        'Total annual benefit: ~£552',
        'System cost: £6,500',
        'Simple payback: ~11.8 years',
      ],
    },
    sourceUrl: 'https://energysavingtrust.org.uk/advice/solar-panels/',
    sourceName: 'Energy Saving Trust — Solar panels',
    lastUpdated: 'April 2026',
  },

  'fuel-cost-calculator': {
    howItWorks: [
      'Fuel cost is calculated by dividing the journey distance by your vehicle\'s fuel efficiency, then multiplying by the price per litre. UK fuel efficiency is commonly quoted in miles per gallon (MPG) but fuel is sold in litres, so a conversion is needed: 1 UK gallon = 4.546 litres.',
      'The HMRC approved mileage allowance for business use is 45p per mile for the first 10,000 miles and 25p per mile thereafter. This is designed to cover fuel, insurance, depreciation and wear — not just fuel costs. If your employer pays less than these rates, you can claim tax relief on the difference.',
      'This calculator lets you enter distance, fuel efficiency and fuel price to estimate the cost of any journey. It also shows the equivalent HMRC mileage allowance for comparison.',
    ],
    example: {
      title: 'Example: 200-mile round trip, 40 MPG, fuel at £1.40/litre',
      steps: [
        'Fuel needed: 200 ÷ 40 = 5 gallons = 22.73 litres',
        'Fuel cost: 22.73 × £1.40 = £31.82',
        'HMRC mileage: 200 × 45p = £90.00',
        'Difference (covers wear, insurance etc.): £58.18',
      ],
    },
    sourceUrl: 'https://www.gov.uk/government/publications/rates-and-allowances-travel-mileage-and-fuel-allowances',
    sourceName: 'HMRC — Mileage and fuel allowances',
    lastUpdated: 'April 2026',
  },

  // === Auto-generated content for remaining calculators ===
  'scottish-income-tax-calculator': {
    howItWorks: [
      'Scotland sets its own income tax rates and bands under powers devolved by the Scotland Act 2016. For 2026/27 there are six bands above the Personal Allowance of £12,570: Starter (19%), Basic (20%), Intermediate (21%), Higher (42%), Advanced (45%) and Top (48%). These differ significantly from the rest-of-UK rates.',
      'The Starter band covers income from £12,571 to £14,876, Basic from £14,877 to £26,561, Intermediate from £26,562 to £43,662, Higher from £43,663 to £75,000, Advanced from £75,001 to £125,140 and Top rate applies above £125,140. The same £100,000 Personal Allowance taper applies as in the rest of the UK.',
      'Your tax code letter S indicates you pay Scottish rates. HMRC determines this based on your main place of residence on 6 April each year. This calculator applies all six Scottish bands to give you an accurate breakdown of your liability.',
      'How Scottish income tax differs. Scotland has its own income tax bands set by the Scottish Parliament (since 2017). For 2026/27: Starter Rate 19% (£12,571 to £15,397), Basic 20% (to £27,491), Intermediate 21% (to £43,662), Higher 42% (to £75,000), Advanced 45% (to £125,140), Top 48% (above). Personal Allowance is still £12,570 (UK-wide). NI rates and CGT are also UK-wide. Only earned income (employment, self-employment, pensions) attracts Scottish rates — dividends and savings interest use UK-wide rates.',
      'Who is a \'Scottish taxpayer\'? You\'re a Scottish taxpayer if your main home (closest connection) is in Scotland for most of the tax year. Working in Scotland doesn\'t make you a Scottish taxpayer if you live in England. HMRC determines status based on residence, not employer location. Your tax code starts with \'S\' (e.g. S1257L) if Scottish. If you move house mid-year, HMRC apportions based on the part of the year spent in each area. Notify HMRC of address changes promptly.',
      'Tax planning implications for Scottish taxpayers. Scotland\'s 42% Higher rate kicks in at £43,663 vs £50,271 in England — costing Scottish higher earners ~£1,500/year more on average. Conversely, Scottish basic rate workers earning £15,397-£27,491 save ~£20/year via the Intermediate rate trick. Maximising pension contributions becomes even more valuable in Scotland — Scottish taxpayers in the 42% band get 42% relief via Salary Sacrifice (vs 40% in England).',
      'Cross-border issues. If you have rental income from English property but live in Scotland, the rental profit is taxed at Scottish rates (because the taxpayer is Scottish, not the property). If you have dividend income from a UK company, that\'s at UK-wide rates regardless of where you live. Capital gains on a Scottish-located asset sold by a Scottish resident are still at UK CGT rates (18%/24%). Cross-border employment (e.g. living in Scotland, working in Newcastle) typically taxes at Scottish rates if Scotland is your main home.',
    ],
    example: {
      title: 'Example: £50,000 salary (Scottish taxpayer)',
      steps: [
        'Personal Allowance: £12,570 at 0% = £0',
        'Starter band: £2,306 (£12,571–£14,876) at 19% = £438.14',
        'Basic band: £11,685 (£14,877–£26,561) at 20% = £2,337.00',
        'Intermediate band: £17,100 (£26,562–£43,662) at 21% = £3,591.00',
        'Higher band: £6,338 (£43,663–£50,000) at 42% = £2,661.96',
        'Total Scottish income tax: £9,028.10',
      ],
    },
    sourceUrl: 'https://www.gov.uk/scottish-income-tax',
    sourceName: 'GOV.UK — Scottish Income Tax',
    lastUpdated: 'April 2026',
  },
  'stamp-duty-first-time-buyer-calculator': {
    howItWorks: [
      'First-time buyers in England and Northern Ireland benefit from Stamp Duty Land Tax (SDLT) relief on residential property purchases. From April 2025, no SDLT is payable on the first £300,000 of the purchase price provided the property costs no more than £500,000. The portion between £300,001 and £500,000 is taxed at 5%.',
      'To qualify, you must never have owned a freehold or leasehold interest in a residential property anywhere in the world. If you are buying jointly, all purchasers must be first-time buyers. Properties priced above £500,000 do not qualify for any relief and standard rates apply to the entire purchase.',
      'This calculator checks your eligibility based on the property price, then applies the first-time buyer bands to show your total SDLT bill. It also compares what you would pay under standard rates so you can see the saving.',
      'First-Time Buyer relief — the rules in 2026/27. Pay 0% SDLT on the first £300,000 of the purchase price, then 5% on £300,001 to £500,000. If the property exceeds £500,000, NO relief applies — pay full standard SDLT on the whole price. To qualify: (1) you\'ve never owned a property anywhere in the world (including inherited shares); (2) you\'ll use the property as your main home; (3) at least one buyer must be a first-time buyer for joint purchases.',
      'Common pitfalls that disqualify you. Inheriting a share of a property (even 1%) counts as ownership and disqualifies you. Owning property abroad (even an unused holiday share) disqualifies you. Being on the deeds of a parent\'s property as a \'helping hand\' disqualifies you. Buying with someone who has owned before — only YOUR share qualifies for relief (and only if both are first-time buyers in many lender\'s interpretation). Buy-to-let purchases don\'t get FTB relief regardless of personal status.',
      'First Homes Scheme — additional 30% discount. Separate from SDLT relief, the First Homes Scheme offers 30-50% discount off new-build properties for local first-time buyers earning under £80k (£90k London). Discount stays with the property (passed to next FTB). 5% deposit minimum on the discounted price. Combined with FTB SDLT relief, a £300k First Home in Manchester might cost £200k with no SDLT — saving £25k+ vs market.',
      'Help-to-Buy ISA vs Lifetime ISA for the deposit. Help-to-Buy ISA (closed to new accounts Nov 2019): 25% bonus on up to £12,000 (£3k max), £250k cap (£450k London). Lifetime ISA: 25% bonus on up to £4k/year, £450k property anywhere. Existing H2B ISA holders can keep contributing until Nov 2029. New first-time buyers should use LISA — higher annual bonus, higher property cap. You CAN transfer H2B ISA into LISA — talk to your provider.',
    ],
    example: {
      title: 'Example: £425,000 first home purchase',
      steps: [
        '£0–£300,000 at 0% = £0',
        '£300,001–£425,000 at 5% = £6,250',
        'Total SDLT: £6,250 (effective rate: 1.47%)',
        'Under standard rates this would be £8,750 — saving of £2,500',
      ],
    },
    sourceUrl: 'https://www.gov.uk/stamp-duty-land-tax/residential-property-rates',
    sourceName: 'GOV.UK — Stamp Duty first-time buyer relief',
    lastUpdated: 'April 2026',
  },
  'marriage-allowance-calculator': {
    howItWorks: [
      'Marriage Allowance lets a spouse or civil partner who earns less than £12,570 transfer up to £1,260 of their unused Personal Allowance to their partner. The recipient must be a basic-rate taxpayer (earning between £12,571 and £50,270). This reduces the recipient\'s tax bill by up to £252 per year.',
      'The transferor\'s Personal Allowance drops from £12,570 to £11,310, while the recipient gains an extra £1,260 of tax-free income. The saving is always 20% of £1,260 regardless of the recipient\'s exact income, because the allowance is only available where the recipient pays basic rate tax.',
      'You can backdate a claim by up to four tax years. If you have not claimed before, you could receive a lump sum of up to £1,260 for missed years. Applications are made through GOV.UK and the allowance continues automatically each year until cancelled.',
    ],
    example: {
      title: 'Example: Non-working spouse and partner earning £30,000',
      steps: [
        'Transferor income: £8,000 (below £12,570 — eligible)',
        'Unused Personal Allowance transferred: £1,260',
        'Recipient\'s new tax-free amount: £12,570 + £1,260 = £13,830',
        'Tax saving: £1,260 × 20% = £252 per year',
        'Backdated 4 years: up to £1,260 total refund',
      ],
    },
    sourceUrl: 'https://www.gov.uk/marriage-allowance',
    sourceName: 'GOV.UK — Marriage Allowance',
    lastUpdated: 'April 2026',
  },
  'company-car-tax-calculator': {
    howItWorks: [
      'Company car tax is based on the Benefit-in-Kind (BiK) value of the vehicle. HMRC assigns a BiK percentage to each car based on its CO2 emissions and fuel type. For 2026/27, pure electric vehicles have a BiK rate of 3%, while the highest-polluting petrol or diesel cars reach 37%. You pay income tax on the BiK value at your marginal rate.',
      'The BiK value is calculated as: P11D price (list price including options and delivery, minus the first year registration fee and vehicle excise duty) multiplied by the BiK percentage. If the employer also provides free fuel for private use, a separate fuel benefit charge applies based on a fixed multiplier of £27,800 for 2026/27.',
      'Employers pay Class 1A National Insurance at 15% on the full BiK value. This calculator takes the car\'s list price, CO2 emissions, fuel type and your tax band to show both your annual tax cost and the employer\'s NI cost.',
      'How Company Car Tax (BiK) works. Provided to you by your employer, a company car is a \'Benefit in Kind\' (BiK) — taxable as if it were salary. BiK value = car list price (including options) × BiK %. The BiK % depends on CO2 emissions. For 2026/27: 0g/km electric 3% (rising to 7% by 2030); 1-50g/km PHEV 4-15% (depending on electric range); 51g+ petrol 16-39%; diesel similar +4% (non-RDE2 cars). Multiply BiK value by your income tax rate to get annual tax cost.',
      'EV company cars are exceptionally tax-efficient — but window closing. A £50,000 BMW i4 at 3% BiK = £1,500 BiK value. Higher-rate taxpayer pays 40% on this = £600/year tax. The same £50,000 petrol car at 32% BiK = £16,000 BiK value × 40% = £6,400/year tax. EV saves £5,800/year. BiK rate rises: 4% in 2027/28, 5% in 2028/29, 6% in 2029/30, 7% in 2030/31. Still much cheaper than ICE even at 7%. Combined with salary sacrifice, EV company cars are typically the best-value perk available.',
      'Fuel benefit charge — usually a bad deal. If your employer pays for personal fuel in a company car, you\'re taxed on an additional fuel benefit charge: £27,800 (2026/27) × BiK % × your income tax rate. For 32% BiK car: 32% × £27,800 = £8,896 BiK × 40% tax = £3,558/year tax for personal fuel. Most employees would pay less by buying their own fuel and claiming HMRC business mileage rates (Advisory Fuel Rates) for work miles. Always calculate before accepting employer-paid fuel.',
      'Practical car vs cash allowance decision. Many employers offer \'cash allowance instead of company car\' (typically £4-£8k/year). Compare: cash allowance is taxable salary (full income tax + NI + pension implications). Company car BiK is taxable but cheaper for EVs. Cash gives ownership flexibility; company car gives no maintenance costs, insurance, MOT hassle. For ICE cars (>30% BiK), cash usually wins. For EVs (<10% BiK), company car wins by £1,000-£3,000/year. Many employers offer EV salary sacrifice — combining both worlds.',
    ],
    example: {
      title: 'Example: £35,000 petrol car, 120g/km CO2, higher-rate taxpayer',
      steps: [
        'CO2 emissions 120g/km = BiK rate of 29%',
        'BiK value: £35,000 × 29% = £10,150',
        'Tax at 40% (higher rate): £10,150 × 40% = £4,060 per year',
        'Employer NI (Class 1A): £10,150 × 15% = £1,522.50 per year',
      ],
    },
    sourceUrl: 'https://www.gov.uk/tax-on-company-benefits/tax-on-benefit-in-kind',
    sourceName: 'GOV.UK — Tax on company benefits',
    lastUpdated: 'April 2026',
  },
  'crypto-tax-calculator': {
    howItWorks: [
      'HMRC treats cryptocurrency as a taxable asset. Capital Gains Tax applies when you sell, swap, gift or spend crypto at a profit. For the 2026/27 tax year, the annual exempt amount is £3,000. Gains above this are taxed at 10% for basic-rate taxpayers or 20% for higher and additional-rate taxpayers.',
      'The cost basis is calculated using the share-pooling method, which is the same approach used for shares. Under this method, you maintain a pool of tokens with an average cost. The rules also include the same-day rule (matching disposals with acquisitions on the same day) and the bed-and-breakfast rule (matching with acquisitions within 30 days).',
      'You must report crypto gains exceeding four times the annual exempt amount (£12,000 for 2026/27) via Self Assessment, even if no tax is due after the exemption. Mining, staking rewards and airdrops may be treated as income rather than capital gains depending on the activity.',
      'Crypto is taxed as capital, not currency, in the UK. HMRC treats crypto as an asset for Capital Gains Tax purposes. Buying and selling, swapping ETH for BTC, using crypto to buy goods, gifting (except to spouse) — all are disposals subject to CGT. Income tax applies separately to: mining/staking income (taxed as miscellaneous income), airdrops (income at receipt + CGT at disposal), play-to-earn rewards, salary paid in crypto. NFTs are also assets. The pseudo-anonymous nature of crypto does NOT make it untaxable.',
      'Capital Gains rates and allowance for 2026/27. After the October 2024 Budget unified rates: 18% (basic-rate taxpayer) or 24% (higher-rate). Annual Exempt Amount £3,000 — much reduced from £12,300 in 2022/23. Each crypto disposal must be matched to a purchase using Section 104 \'pooling\' rules (similar to share matching): same-day rule first, 30-day rule next (anti-bed-and-breakfasting), then the pool average. Most exchanges don\'t track this — you need separate accounting software (Koinly, CoinTracker, Recap).',
      'OECD Crypto-Asset Reporting Framework (CARF) — automatic reporting from 2026. The OECD CARF requires UK crypto exchanges (Coinbase, Binance, Crypto.com, etc.) to report customer transactions to HMRC starting 2026. This means HMRC will know about your trades whether you declare them or not — pre-CARF non-declaration is becoming risky. CARF extends the existing Common Reporting Standard (CRS) to crypto. Make voluntary disclosure of past unreported gains before HMRC contacts you — penalties are significantly lower for prompted disclosures.',
      'Reporting and payment deadlines. Annual: Crypto gains declared on Self Assessment by 31 January following the tax year (e.g. 2026/27 gains: file by 31 January 2028, pay by same date). Real-time service: For \'Real Time Capital Gains Tax\' you can report and pay sooner. Late filing penalty: £100 immediate, daily £10 after 3 months, plus 5% / 10% / 15% slabs of unpaid tax. Loss claims: must be made within 4 years. Crypto losses can offset gains (same year, or carried forward indefinitely against future gains).',
    ],
    example: {
      title: 'Example: Selling Bitcoin for £15,000 profit, higher-rate taxpayer',
      steps: [
        'Total gain on disposal: £15,000',
        'Less annual exempt amount: −£3,000',
        'Taxable gain: £12,000',
        'CGT at 20% (higher rate): £12,000 × 20% = £2,400',
        'Reporting required: Yes (gain exceeds £12,000 threshold)',
      ],
    },
    sourceUrl: 'https://www.gov.uk/hmrc-internal-manuals/cryptoassets-manual',
    sourceName: 'HMRC — Cryptoassets Manual',
    lastUpdated: 'April 2026',
  },
  'hourly-to-salary-calculator': {
    howItWorks: [
      'This calculator converts between hourly pay and annual salary using standard UK working patterns. The default assumption is 37.5 hours per week over 52 weeks per year, giving 1,950 working hours annually. You can adjust hours per week, weeks of paid holiday and unpaid time to match your actual arrangement.',
      'The formula is straightforward: Annual salary = Hourly rate × Hours per week × Paid weeks per year. For example, £15/hour over 37.5 hours and 52 weeks gives £29,250. The reverse calculation divides the annual salary by total working hours to find the effective hourly rate.',
      'The calculator also shows your take-home pay after tax and NI at each level, helping you compare job offers quoted in different formats. Part-time workers can enter their actual weekly hours to get an accurate annual equivalent.',
    ],
    example: {
      title: 'Example: £18.50/hour, 37.5 hours/week',
      steps: [
        'Weekly gross: £18.50 × 37.5 = £693.75',
        'Annual gross (52 weeks): £693.75 × 52 = £36,075',
        'Monthly gross: £36,075 ÷ 12 = £3,006.25',
        'Estimated annual take-home (after tax/NI): approx. £28,500',
      ],
    },
    sourceUrl: 'https://www.gov.uk/national-minimum-wage-rates',
    sourceName: 'GOV.UK — National Minimum Wage and Living Wage',
    lastUpdated: 'April 2026',
  },
  'employer-cost-calculator': {
    howItWorks: [
      'The true cost of employing someone in the UK is significantly higher than their gross salary. Employers must pay employer National Insurance at 15% on earnings above £5,000, plus workplace pension contributions of at least 3% of qualifying earnings under auto-enrolment. These mandatory costs typically add 15-20% on top of the salary.',
      'Additional statutory costs include the Apprenticeship Levy (0.5% of total payroll for employers with a pay bill over £3m), employer\'s liability insurance and workplace pension administration fees. Depending on the role, there may also be costs for recruitment, training, equipment and benefits.',
      'This calculator totals all employer-side costs for a given salary level. It separates mandatory costs (employer NI, pension minimum) from optional costs you can add (private healthcare, bonus, training budget). The result shows the full loaded cost per employee.',
      'The \'fully loaded\' employee cost. Gross salary is just the headline. Add: Employer NI 15% on earnings above £5,000 (after April 2025); Pension auto-enrolment minimum 3% on qualifying earnings £6,240-£50,270; Apprenticeship Levy 0.5% if your total annual pay bill exceeds £3m; statutory paid holiday accrual (5.6 weeks); employer\'s liability insurance (~£100-£500/year); recruitment cost (10-20% of salary, amortised over typical 2-3 year tenure). Total overhead typically 15-25% above gross salary.',
      'Hidden costs beyond statutory. Office space (~£500-£1,500/month per employee in London, less elsewhere). Equipment (laptop, phone, software licences ~£1,500-£3,000 one-off + ~£800/year SaaS). Training and development (1-3% of salary, often more for tech roles). Statutory sick pay (£123.25/week up to 28 weeks). Maternity/paternity pay (much reclaimed but cashflow impact). Management overhead (10-20% of salaried manager\'s time on each direct report).',
      'Salary sacrifice as a cost-saving lever for BOTH sides. When an employee sacrifices £5,000/year into pension, the company saves: 15% NI (£750), 0.5% Apprenticeship Levy (£25), some auto-enrolment top-up if matched (varies). The employee saves: income tax (20-45%) plus employee NI (8-2%). Win-win on tax efficiency. Many employers share the NI saving back as an additional pension contribution to the employee — turning a 5% salary sacrifice into 5.75% pension contribution.',
      'Contractor vs employee cost comparison. A £450/day contractor (£117,000/year if 260 working days) typically costs MORE than a £75,000 permanent employee (~£94,000 fully loaded) but with: zero training cost, no holiday/sick pay, no pension obligation, flexibility to release at end of contract, no redundancy liability. Most cost-effective when: short engagement (<6 months), specialist skill not needed long-term, or rapid scale-up. Less effective for stable long-term work — permanent is cheaper at full utilisation.',
    ],
    example: {
      title: 'Example: Employee on £35,000 salary',
      steps: [
        'Employer NI: (£35,000 − £5,000) × 15% = £4,500',
        'Employer pension (3%): £35,000 × 3% = £1,050',
        'Total statutory extras: £5,550',
        'Total cost to employer: £35,000 + £5,550 = £40,550',
        'Effective uplift: 15.9% above gross salary',
      ],
    },
    sourceUrl: 'https://www.gov.uk/guidance/rates-and-thresholds-for-employers-2025-to-2026',
    sourceName: 'HMRC — Rates and thresholds for employers 2026/27',
    lastUpdated: 'April 2026',
  },
  'bonus-tax-calculator': {
    howItWorks: [
      'Bonuses are taxed as part of your total earnings in the pay period they are received. Your employer adds the bonus to your regular pay and applies PAYE using the standard tax tables. This often pushes you into a higher marginal tax bracket for that period, making it appear heavily taxed, though the annual effect may be lower.',
      'The deductions on a bonus include income tax at your marginal rate, employee National Insurance at 8% (or 2% above the Upper Earnings Limit) and any workplace pension contributions. If the bonus tips your income above £50,270, the portion above that threshold is taxed at 40% and NI drops to 2%.',
      'This calculator adds your bonus to your annual salary to calculate the correct deductions. It shows the marginal rate applied to the bonus, the net bonus amount and a comparison showing your normal monthly pay versus the bonus month. Over the full year, HMRC\'s cumulative PAYE system ensures you pay the right total tax.',
      'Why bonuses look like they\'re taxed extra. UK PAYE is cumulative, so a bonus in your monthly pay just adds to year-to-date earnings. The \'extra\' tax isn\'t a different rate — it\'s because the bonus pushes you into a higher band for that month\'s calculation. Example: £40k base + £10k bonus in one month — month\'s tax is calculated as if you\'d earn £40k × 1/12 + £10k = £13,333 that month (annualised £160k), so a chunk gets taxed at higher-rate even though the year-end might keep you basic-rate. PAYE adjusts in following months to even out.',
      'Bonus and the 60% effective tax band. Bonuses are taxed at marginal rate. If your salary + bonus pushes you over £100,000, the Personal Allowance taper kicks in: every £2 over £100k removes £1 of allowance, costing you 60% effective on that slice (£100k-£125,140). Strategic move: sacrifice the entire bonus into pension if it would tip you into the 60% trap. £20,000 bonus into pension saves £12,400 (60% relief). Pension is the most common \'bonus sacrifice\' — many employers facilitate this with a bonus-time election.',
      'Bonus and student loan repayments. Student loans deduct 9% (Plans 1, 2, 4, 5) or 6% (Postgraduate) of earnings above the threshold. A bonus in one month creates an over-deduction (because the algorithm assumes that pay rate continues all year). At year-end, you\'ll have overpaid student loan — you can reclaim by writing to SLC OR wait for it to balance out across the year through subsequent low-bonus months. Most over-deductions of £100+ are worth reclaiming.',
      'Year-end bonus timing — pay before or after 5 April? If you\'re close to a tax band threshold, timing matters. Bonus paid in March (before 5 April) is taxed at current year rates; bonus paid in April could shift to next year\'s rates. Pre-April Budget announcements can change brackets — usually announced in November/December. Many employers structure to pay before 5 April for staff who\'d benefit. If unsure, ask HR for the pay date (paid date, not earned date, determines the tax year).',
    ],
    example: {
      title: 'Example: £5,000 bonus on a £42,000 salary',
      steps: [
        'Total earnings in bonus year: £47,000',
        'Bonus falls within basic-rate band (under £50,270)',
        'Income tax on bonus: £5,000 × 20% = £1,000',
        'Employee NI on bonus: £5,000 × 8% = £400',
        'Pension (5%): £5,000 × 5% = £250',
        'Net bonus received: £5,000 − £1,650 = £3,350',
      ],
    },
    sourceUrl: 'https://www.gov.uk/tax-on-bonus',
    sourceName: 'GOV.UK — Tax on bonuses',
    lastUpdated: 'April 2026',
  },
  'mortgage-overpayment-calculator': {
    howItWorks: [
      'Mortgage overpayments reduce your outstanding balance faster, which means you pay less interest over the life of the loan. Most UK lenders allow you to overpay up to 10% of the outstanding balance per year without incurring early repayment charges. Overpayments can reduce either the monthly payment amount or the mortgage term.',
      'Reducing the term keeps your monthly payments the same but clears the mortgage sooner. Reducing the payment lowers your monthly outgoing but keeps the same end date. Over the long term, reducing the term usually saves more in total interest because the principal decreases faster.',
      'This calculator models both approaches. Enter your current mortgage balance, interest rate, remaining term and proposed overpayment to see the interest saved, the new payoff date and whether you would exceed the typical 10% annual overpayment limit.',
      'Why overpaying early is so powerful. Mortgage interest is front-loaded — most of your early monthly payments are interest, not principal. £100/month overpayment in year 1 reduces the balance directly, so all future interest is calculated on a lower amount. The same £100 paid in year 24 saves only a few months of interest. Example: on a £200,000/5%/25-year mortgage, £100/month from day 1 saves £35,000+ in total interest and cuts the term by 4 years 7 months.',
      'Overpayment limits and ERCs. Most UK fixed-rate mortgages allow 10% annual overpayment without penalty (some 5%, a few 20%). Above this limit, Early Repayment Charges (ERCs) typically apply: 1-5% of the overpayment amount, often tapering down each year of the fix (e.g. 5% in year 1, 4% in year 2, 3% in year 3). After your fix ends or once on the SVR, you can usually overpay unlimited amounts. Check your mortgage offer for exact limits and consequences.',
      'Lump sum vs regular overpayments. A £10,000 lump sum on a £200,000/5%/25-year mortgage at year 5 saves ~£15,500 in interest and cuts the term by 14 months. The same £10,000 spread as £100/month over 8 years saves only ~£11,500 (because later overpayments have less impact). Lump sums from bonuses, inheritance, or savings are most efficient. Many lenders accept lump sum overpayments any time online, but check whether your annual 10% limit resets each anniversary.',
      'Overpay vs invest — the maths. If your mortgage rate is 4.5%, every £100 overpayment \'earns\' a guaranteed 4.5% return (saved interest). Investing the £100 in a Stocks & Shares ISA might return 7-10% long-term but with volatility and no guarantee. For mortgage rates below 4%, investing usually wins on expected return. Above 5%, overpaying typically wins on risk-adjusted return. Mixed strategy (overpay X%, invest Y%) often optimal — overpay to clear high-rate fixed deal, invest above that.',
    ],
    example: {
      title: 'Example: £200,000 balance, 4.5% rate, 22 years remaining, £200/month overpayment',
      steps: [
        'Current monthly payment: £1,253',
        'With £200/month overpayment: £1,453',
        'New payoff time: approx. 16 years 8 months (5 years 4 months early)',
        'Total interest saved: approx. £34,500',
        'Check: £200 × 12 = £2,400/year — within 10% of £200,000',
      ],
    },
    sourceUrl: 'https://www.fca.org.uk/consumers/mortgages-overview',
    sourceName: 'FCA — Mortgages overview',
    lastUpdated: 'April 2026',
  },
  'rental-yield-calculator': {
    howItWorks: [
      'Gross rental yield is calculated by dividing the annual rental income by the property purchase price and multiplying by 100. For example, a property bought for £250,000 generating £1,000/month rent gives a gross yield of 4.8%. This simple metric lets you quickly compare properties across different price points and locations.',
      'Net rental yield accounts for costs including mortgage payments, letting agent fees (typically 8-15% of rent), maintenance (budget 10-15% of rent), insurance, ground rent, service charges, void periods (typically 2-4 weeks per year) and landlord income tax. The net figure is always significantly lower than the gross yield.',
      'This calculator produces both gross and net yield figures. Enter the property price, monthly rent and running costs to see your return. It also shows the annual cash flow after all expenses, which is the real measure of whether a rental property covers its costs.',
      'Gross vs Net yield — why the difference matters. Gross rental yield = (annual rent ÷ property value) × 100. A £200k property earning £1,000/month rent = £12,000/year ÷ £200,000 = 6% gross yield. Net yield deducts costs: mortgage interest, management fees (10-15%), maintenance (typically 1% of value/year), insurance, void periods (1-2 months/year), service charges/ground rent. The same property might have only 3-4% NET yield. Always calculate net to assess true return.',
      'What\'s a \'good\' UK rental yield in 2026? National averages vary by region. London 4-5% gross. South East 5-6%. Manchester/Birmingham 6-7%. Liverpool/Newcastle/Sheffield 7-9%. Some properties in deprived areas yield 10%+ but with higher voids and management issues. Top BTL investors target net yield above 5% AND realistic capital growth of 3-5%/year. Total return (yield + growth) should beat alternative investments (~7% from a diversified equity portfolio).',
      'Tax implications crushing yields since 2017. Section 24 of the Finance Act 2017 phased out mortgage interest relief for individual landlords. From April 2020, mortgage interest can no longer be deducted as an expense — only a 20% tax credit applies. For higher-rate landlords, this effectively raised tax on rental profits by up to 20% of the mortgage interest. Many BTL investors now hold properties in limited companies (SPVs) to retain full interest deductibility, paying 25% Corporation Tax instead of 40-45% personal rates.',
      'Beyond yield — total return calculation. True BTL return = annual rental profit + capital growth. £200k property at 4% net yield = £8,000 profit. If it appreciates 4%/year (£8,000 capital gain), total return = £16,000 = 8% on £200k. With 75% LTV (£50k deposit), the geared return = £16k - £4k mortgage interest = £12k on £50k = 24% return on equity. This \'leveraged\' return is what makes BTL attractive — but works both ways: -4% house prices = -8% on equity.',
    ],
    example: {
      title: 'Example: £300,000 property, £1,350/month rent',
      steps: [
        'Annual rent: £1,350 × 12 = £16,200',
        'Gross yield: £16,200 ÷ £300,000 × 100 = 5.4%',
        'Annual costs (mortgage £9,600 + agent £1,620 + maintenance £1,600 + insurance £300 + voids £1,350): £14,470',
        'Net income: £16,200 − £14,470 = £1,730',
        'Net yield: £1,730 ÷ £300,000 × 100 = 0.58%',
      ],
    },
    sourceUrl: 'https://www.gov.uk/guidance/income-tax-when-you-rent-out-a-property',
    sourceName: 'GOV.UK — Income tax when you rent out a property',
    lastUpdated: 'April 2026',
  },
  'rent-vs-buy-calculator': {
    howItWorks: [
      'The rent-vs-buy decision depends on many variables: property prices, rental costs, mortgage rates, house price growth, investment returns on the alternative use of a deposit, and how long you plan to stay. This calculator models both scenarios over your chosen time horizon to show which is financially better.',
      'The buying scenario includes mortgage payments, deposit opportunity cost, stamp duty, maintenance (1-2% of property value per year), insurance and transaction costs when selling. The renting scenario includes rent (with assumed annual increases), renters\' insurance and the investment return on cash that would otherwise go towards a deposit and purchase costs.',
      'The result shows the net wealth position under each scenario at each year. In the early years, renting and investing often wins because of the high upfront costs of buying. Over longer periods, buying typically wins due to house price appreciation and the forced saving element of a repayment mortgage.',
      'When does buying beat renting in the UK? Generally if you\'ll stay 5+ years. The \'breakeven\' depends on: property growth rate, rent inflation, interest rates, transaction costs (5-10% on buy, 0% on rent). Rule of thumb (2026 UK conditions): if your monthly mortgage + maintenance + insurance is less than 130% of equivalent rent, AND you\'ll stay 5+ years, AND you have 10%+ deposit — buying wins. Below 5-year horizons, transaction costs (SDLT, legal, agent fees) usually negate any benefit.',
      'Hidden costs of homeownership. Beyond mortgage: building insurance (£200-400/year), maintenance (1% property value/year sustained = £2k on £200k home), service charges (£1k-£5k on flats), ground rent (£100-£500 on leasehold), boiler service (£100), repairs (variable — boiler replacement £3k, roof £8k, kitchen £10k). Rough budget: 2-3% of property value/year for total cost of ownership. Many first-time buyers underestimate maintenance and end up financially stretched.',
      'Rent-vs-buy in different UK markets. London (high property costs, lower rental yields ~4%): buying often takes 10+ years to break even due to high transaction costs. Manchester (£200k average, £1k rent): often 4-5 years. Sheffield (£170k, £850 rent): 4 years. Rural Cornwall: variable. Use this calculator\'s local data — entering YOUR area-specific numbers is essential. Generalised rent-vs-buy rules can mislead because UK property markets are highly localised.',
      'The opportunity cost angle. If you rent and invest your would-be deposit in a Stocks & Shares ISA averaging 7% return, you might be financially better off than buying with the same money — particularly in stagnant property markets. £50k deposit at 7% over 25 years = £272k. £50k deposit on £250k home growing at 3%/year = £523k home value (but £200k still owed at mortgage end if interest-only). Most buy-vs-rent calculators undervalue the opportunity cost of capital.',
    ],
    example: {
      title: 'Example: £300,000 home vs £1,200/month rent over 10 years',
      steps: [
        'Buying total cost (mortgage, fees, maintenance): £215,000',
        'Property value after 10 years (3% growth): £403,200',
        'Net equity after selling costs: approx. £165,000',
        'Renting + investing deposit (£30,000 at 5%): £48,900',
        'Net position: buying ahead by approx. £116,100 after 10 years',
      ],
    },
    sourceUrl: 'https://www.ons.gov.uk/peoplepopulationandcommunity/housing',
    sourceName: 'ONS — Housing and home ownership statistics',
    lastUpdated: 'April 2026',
  },
  'state-pension-calculator': {
    quickAnswer: `The full new UK State Pension in 2026/27 is <strong>£241.30/week</strong> (£12,547.60/year) — up 4.1% from £221.20 due to triple lock. You need <strong>35 qualifying NI years</strong> for the full amount and at least 10 to receive anything.`,
    howItWorks: [
      'The full new State Pension is £241.30 per week (£12,547.60/year) for 2026/27, uprated annually by the triple lock (highest of earnings growth, CPI inflation, or 2.5%). You need 35 qualifying years of National Insurance contributions to receive the full amount. With fewer than 35 years, you receive a proportional amount: each qualifying year adds 1/35th, so 25 years gives 25/35 x £241.30 = £158.00/week. A minimum of 10 qualifying years is required to receive anything.',
      'Qualifying years are built through employed earnings above the lower earnings limit (£6,708/year for 2026/27), self-employed <a href="/calculator/sole-trader-tax-calculator/" class="text-primary underline">Class 4 NI</a> contributions, or National Insurance credits (received automatically for Child Benefit recipients, <a href="/calculator/universal-credit-calculator/" class="text-primary underline">Universal Credit</a> claimants, and carers). You can check your NI record online to see how many qualifying years you have and identify any gaps.',
      'Gaps in your NI record can be filled by paying voluntary Class 3 contributions (£17.45/week for 2026/27). Each additional year purchased adds approximately £6.34/week (£329.68/year) to your State Pension. At the current Class 3 rate, buying one year costs around £907 and pays back within about 2.75 years of receiving the pension — making it one of the best returns available for most people with gaps in their record.',
      'What you need to qualify. The new State Pension (from 6 April 2016) requires 10 qualifying NI years to receive anything and 35 years for the full £241.30/week (2026/27). Each missing year costs you 1/35 of the full pension — £6.89/week or £358/year. Qualifying years come from employment (above the Lower Earnings Limit of £6,708/year in 2026/27), self-employment Class 4 NI, or NI credits given automatically to those receiving Child Benefit (until youngest child is 12), Universal Credit, Carer\'s Allowance, or Jobseeker\'s Allowance.',
      'How to check and fill gaps. Visit gov.uk/check-state-pension to see your forecast and full NI record. If you have gaps, you can usually pay voluntary Class 3 NI contributions (£17.45/week in 2026/27 = £907/year) to fill years up to 6 years back. Each year purchased adds £6.89/week to your pension — a payback period of just over 3 years if you live to State Pension age. This is one of the highest-return \'investments\' available to UK adults. Specific historical years can sometimes be filled at lower rates.',
      'State Pension age changes. State Pension age is currently 66 for both men and women. It rises to 67 between 6 April 2026 and 5 April 2028 (depending on date of birth). A further increase to 68 is scheduled between 2044 and 2046, though there is pressure to bring this forward to 2037-2039. Use the gov.uk/state-pension-age tool to check your exact date. You can defer your State Pension after reaching pension age — for every 9 weeks of deferral, your pension increases by 1% (5.8% per year deferred), with no upper limit.',
      'Triple lock and how the £241.30 was calculated. The triple lock guarantees the State Pension rises each April by the highest of: (1) CPI inflation in September, (2) average weekly earnings growth, or (3) 2.5%. For 2026/27, average earnings growth of 4.1% applied — taking the new State Pension from £221.20 to £241.30/week (£11,502/year to £12,547.60/year). The triple lock has been politically controversial and several governments have committed to maintaining it, though long-term sustainability is debated.',
      '<a href="/calculator/pension-credit-calculator/" class="text-primary underline">Pension Credit</a> top-up for low earners. If your total income (including State Pension) is below £227.10/week (single) or £346.60/week (couple), you qualify for <a href="/calculator/pension-credit-calculator/" class="text-primary underline">Pension Credit</a> which tops you up to those figures. Pension Credit also opens doors to other benefits: free TV licence (over 75), Cold Weather Payments, Council Tax Reduction, Housing Benefit, free dental care, glasses, NHS prescriptions. ~850,000 eligible pensioners do not claim — a single person can be missing out on £4,000+/year. Apply via gov.uk/pension-credit or 0800 99 1234.',
    ],
    example: {
      title: 'State Pension estimate with 28 qualifying years',
      steps: [
        'Full new State Pension rate: £241.30/week',
        'Qualifying years on NI record: 28 out of 35 needed',
        'Proportional pension: 28/35 x £241.30 = £176.96/week (£9,201.92/year)',
        'Shortfall from full pension: £241.30 - £176.96 = £44.24/week (£2,300.48/year)',
        'Cost to buy 7 missing years via Class 3 NI: 7 x £907 = £6,349. Extra pension: £44.24/week (payback in ~2.8 years)'
      ]
    },
    sourceUrl: 'https://www.gov.uk/new-state-pension',
    sourceName: 'GOV.UK',
    lastUpdated: 'April 2026',
  },
  'pension-tax-relief-calculator': {
    howItWorks: [
      'Pension tax relief restores income tax paid on contributions. Under relief at source (used by most personal pensions), you contribute from net pay and the provider claims 20% basic rate relief from HMRC automatically. A £80 net contribution becomes £100 gross in your pension. Higher-rate (40%) and additional-rate (45%) taxpayers claim the extra relief through self-assessment: on a £100 gross contribution, a 40% taxpayer gets £40 total relief (£20 automatic + £20 via tax return).',
      'Net pay arrangements (used by many workplace schemes) deduct contributions before calculating income tax, so full relief is given immediately regardless of tax rate. A £100 gross contribution costs a basic-rate taxpayer £80, a higher-rate taxpayer £60, and an additional-rate taxpayer £55. Scottish taxpayers use Scottish income tax rates (19/20/21/42/45/48%) which alter the relief calculation.',
      'Total contributions from all sources must stay within the annual allowance of £60,000 (or 100% of earnings if lower) to avoid a tax charge. The annual allowance charge claws back the tax relief on excess contributions at your marginal rate. Contributions exceeding £60,000 are added to taxable income. Carry forward of unused allowance from the previous three years can shelter larger one-off contributions.',
      'Three ways UK pensions handle tax relief. (1) Net Pay Arrangement (most workplace pensions): contributions taken from gross pay before income tax — you save tax automatically at your marginal rate (20%, 40%, 45%); (2) Relief at Source (most personal pensions, SIPPs): contributions taken from net pay, HMRC adds 20% basic-rate relief — higher/additional rate must reclaim extra 20%/25% via Self Assessment; (3) Salary Sacrifice: contributions deducted from gross before income tax AND NI — saves BOTH taxes, most efficient.',
      'Why salary sacrifice usually beats RAS for higher-rate taxpayers. Higher-rate taxpayer with £1,000 to invest: RAS — you contribute £800 net, HMRC adds £200 (20% basic), claim extra £200 via SA = £400 saved on £1,000 grossed up. Salary sacrifice — you sacrifice £1,000 gross, your take-home falls by only £580 (£1,000 - 40% IT - 2% NI = £580). Net \'cost\' is £180 LESS than RAS. Plus employer saves 15% NI which may be returned to your pension.',
      'Annual Allowance, Money Purchase Annual Allowance, and Tapered Annual Allowance. Annual Allowance £60,000 (2026/27) — max tax-relievable contribution per year. Contributions above this attract Annual Allowance Charge at your marginal rate. Tapered AA: reduces by £1 for every £2 of \'adjusted income\' above £260,000, minimum £10,000. Money Purchase AA: kicks in when you \'flexibly access\' a DC pension — reduces your DC limit to £10,000/year. Carry forward: unused AA from the past 3 tax years can be brought forward (if you were a member of a registered pension scheme then).',
      'Pension contributions and the 60% effective tax band. Income £100,000 to £125,140 has effective marginal rate of 60% — for every £1 earned, you lose 50p in income tax (40% + Personal Allowance taper at 20%). Pension contributions reduce \'adjusted net income\' and can restore the Personal Allowance. £25,140 pension contribution from £125,140 income brings adjusted income to £100,000 — restoring £12,570 Personal Allowance worth £5,028 income tax. Effective tax relief on the £25,140 contribution: ~62% — one of the highest available legal tax breaks in the UK.',
    ],
    example: {
      title: 'Tax relief on £500/month pension contribution for a 40% taxpayer',
      steps: [
        'Net monthly contribution: £500 (£6,000/year)',
        'Basic rate relief added automatically (20%): £500 / 0.80 = £625 gross per month (£7,500/year)',
        'Extra higher-rate relief via self-assessment: £7,500 x 20% = £1,500/year tax rebate',
        'Total tax relief: £1,500 (basic rate at source) + £1,500 (higher rate via SA) = £3,000',
        'Effective cost of £7,500 gross contribution: only £4,500 after all tax relief'
      ]
    },
    sourceUrl: 'https://www.gov.uk/tax-on-your-private-pension/pension-tax-relief',
    sourceName: 'GOV.UK',
    lastUpdated: 'April 2026',
  },
  'isa-calculator': {
    quickAnswer: `UK ISA allowance for 2026/27 is <strong>£20,000</strong> across all ISA types (Cash, Stocks &amp; Shares, Innovative Finance, Lifetime). Lifetime ISA limit is £4,000 with 25% government bonus. All gains and income are completely tax-free.`,
    howItWorks: [
      'ISAs shelter savings and investments from all UK income tax and capital gains tax. The annual ISA allowance is £20,000 per tax year, which can be split across Cash ISAs, Stocks and Shares ISAs, Innovative Finance ISAs, and <a href="/calculator/lifetime-isa-calculator/" class="text-primary underline">Lifetime ISA</a>s in any combination. Once invested, all interest, dividends, and capital gains within the ISA wrapper are completely tax-free, with no reporting requirement to HMRC.',
      'Cash ISA projections use the stated AER (Annual Equivalent Rate) to calculate growth. A fixed-rate Cash ISA locks your money for 1-5 years at a guaranteed rate, while easy-access ISAs offer flexibility but typically lower rates. The calculation compounds interest annually or monthly depending on the product. For a £20,000 deposit at 4.5% AER over 5 years with annual compounding, the balance reaches £24,931.',
      'Stocks and Shares ISA projections use assumed growth rates since returns are variable. Historical UK equity returns have averaged approximately 7-8% nominal (4-5% real) over the long term, but with significant year-to-year volatility. The calculator models growth at multiple assumed rates and shows the range of outcomes. Platform fees (0.15-0.45%) and fund charges (0.1-1.5%) reduce the effective return and are deducted in the projection.',
      'The £20,000 ISA allowance — flexible across types. You can split £20,000 across Cash ISA, Stocks & Shares ISA, Innovative Finance ISA, and Lifetime ISA (the LISA has its own £4,000 cap, counted toward the £20k). The whole £20k can go into one type or be split. Unused allowance can NOT be carried forward — use it or lose it before midnight 5 April each year. You can have multiple ISAs of each type (since 2024 reforms allow this — you can pay into multiple Cash ISAs in one tax year).',
      'Cash ISA vs Stocks & Shares — when to use which. Cash ISA: lower returns (3-5% AER in 2026) but capital-protected; suit short-term (under 5 years) goals. Stocks & Shares ISA: higher long-term returns (~7-10% historic) but volatility; suit 10+ year horizons. Innovative Finance ISA: peer-to-peer lending, riskier but yields 5-10%. The \'cash drag\' on Stocks & Shares ISAs left in cash is a common mistake — invest it within 6-12 months of contribution.',
      'Lifetime ISA — 25% bonus but locked. Open between ages 18-39. Maximum £4,000/year (counts toward £20k overall allowance). Government adds 25% bonus on contributions (max £1,000/year). Withdraw tax-free either: (1) for first home purchase up to £450,000, or (2) after age 60 for retirement. Other withdrawals = 25% penalty (recovers bonus PLUS a slice of your contribution). Best for under-40s saving for first home + retirement boost.',
      'What happens if you exceed the £20,000 allowance. HMRC won\'t generally claim the excess back automatically — your ISA provider should reject the surplus or refund it. If excess slips through, HMRC can repair retrospectively (treats excess as taxable savings outside ISA wrapper). Track via gov.uk Personal Tax Account. If you\'ve genuinely exceeded by mistake, contact your provider; minor accidental breaches are usually forgiven on first occurrence.',
    ],
    example: {
      title: 'ISA growth: £20,000/year for 10 years in a Stocks and Shares ISA',
      steps: [
        'Annual contribution: £20,000 (full ISA allowance)',
        'Assumed growth rate: 6% per year after charges',
        'After year 1: £20,000 x 1.06 = £21,200',
        'After 10 years of £20,000 annual contributions at 6%: approximately £279,100',
        'All growth is tax-free — a basic-rate taxpayer saves approx £4,700 in tax vs a general investment account'
      ]
    },
    sourceUrl: 'https://www.gov.uk/individual-savings-accounts',
    sourceName: 'GOV.UK',
    lastUpdated: 'April 2026',
  },
  'personal-loan-calculator': {
    howItWorks: [
      'A personal loan is repaid in fixed monthly instalments over an agreed term, typically one to seven years. Each payment covers a portion of the principal plus interest. The interest is usually calculated on the reducing balance, meaning you pay less interest as the outstanding amount shrinks.',
      'Lenders advertise a representative APR, which at least 51% of approved applicants must receive. Your actual rate depends on your credit score, income and the loan amount. Rates tend to be lowest in the £7,500–£15,000 range and higher for smaller or larger sums.',
      'This calculator uses the standard annuity formula to compute your monthly repayment, total interest and overall cost. Adjust the loan amount, term and interest rate to compare different scenarios side by side.',
      'Why your offered APR may be higher than advertised. Under FCA CONC 3.5, lenders only need to offer the advertised \'representative APR\' to 51% of accepted applicants — the other 49% can be offered a higher rate based on their credit score, income, and existing debt. Always do a soft search through MoneySavingExpert\'s Eligibility Checker, ClearScore, Experian, or CompareTheMarket before applying — soft searches don\'t damage your credit score and show your likely acceptance odds and personalised rate. Hard searches (full applications) leave a footprint for 12 months and reduce your score 5-10 points per search.',
      'Personal loan vs 0% credit card vs overdraft. For short-term borrowing (1-2 years) under £5,000, a 0% purchase credit card is usually cheapest if you can clear the balance before the promo ends (typically 18-24 months). For larger amounts (£5,000-£25,000) over 2-7 years, personal loans typically win at 8-15% APR. Authorised overdrafts are required to charge a single APR since April 2020 reforms and are usually the most expensive at 35-40% EAR — only use for genuine short-term emergencies. Credit union loans (e.g. London Mutual, Hoot, Plane Saver) typically charge 12.7-26.8% APR and are often available to those with poor credit.',
      'Early repayment rights and charges. Under the Consumer Credit Act 1974, you have a statutory right to repay a personal loan early at any time. Lenders may charge an Early Repayment Charge (ERC) of up to one month\'s interest plus 28 days (for loans under £8,000) or 1% of the amount repaid (for loans of £8,000 or more). For most borrowers, early repayment still saves significant total interest — particularly on long-term loans where most of the early payments are interest, not principal. Check your loan agreement before paying off — your lender must provide a settlement quote within 14 days of request.',
      'Secured vs unsecured loans. Personal loans are unsecured — based purely on your creditworthiness. Secured loans (or \'homeowner loans\') use your home as collateral, allowing larger amounts (£10,000-£500,000+) and longer terms (up to 30 years) at lower rates (5-10%), but if you default, the lender can force the sale of your home. Logbook loans secured on cars are extremely high-cost (typically 200%+ APR) and not regulated under the Consumer Credit Act — never recommended. Always prefer unsecured personal loans even if the APR is higher, unless you fully understand the consolidation maths.',
      'When debt consolidation makes sense — and when it doesn\'t. Consolidating multiple debts into one personal loan can reduce monthly payments and simplify finances, but it only saves money if (1) the new APR is lower than the weighted average of your old debts, AND (2) you don\'t extend the repayment term so much that you pay more total interest. A common trap: consolidating credit card debt (clearing in 3 years at 22% APR) into a 7-year personal loan at 12% APR — the lower rate is offset by paying interest over more than double the time. Use this calculator\'s term comparison to check. And critically: stop using the old credit cards once cleared.',
    ],
    example: {
      title: 'Example: £10,000 loan at 6.9% APR over 5 years',
      steps: [
        'Loan amount: £10,000',
        'Monthly repayment: £197.54',
        'Total repaid over 60 months: £11,852.40',
        'Total interest paid: £1,852.40',
      ],
    },
    sourceUrl: 'https://www.fca.org.uk/consumers/credit-loans',
    sourceName: 'FCA — Credit and loans',
    lastUpdated: 'April 2026',
  },
  'credit-card-repayment-calculator': {
    howItWorks: [
      'Credit card interest compounds monthly on the outstanding balance after each statement period. A typical UK APR of 24.9% translates to a monthly periodic rate of approximately 1.867% (calculated as (1 + 0.249)^(1/12) - 1). Each month, interest is charged on whatever balance remains after your payment is applied, creating a compounding effect that significantly increases total costs when only minimum payments are made.',
      'Minimum payments in the UK are usually calculated as the greater of a fixed floor amount (typically £5 or £25) or a percentage of the outstanding balance (usually 1% to 3% plus that month\'s interest). Because the percentage-based minimum shrinks as your balance decreases, repayment slows dramatically over time. A £3,000 balance at 24.9% APR with 2% minimum payments would take over 25 years to clear, costing more than £4,000 in interest alone.',
      'The calculator models three repayment strategies side by side: minimum payments only, fixed monthly payment, and a target payoff date approach. Fixed payments above the minimum accelerate principal reduction because the interest portion shrinks each month while total payment stays constant. Even adding £50 above the minimum can cut repayment time by 10-15 years and save thousands in interest charges.'
    ],
    example: {
      title: 'Paying off a £4,500 credit card balance at 24.9% APR',
      steps: [
        'Balance: £4,500, APR: 24.9%, monthly rate: 1.867%',
        'Minimum payment (2.5% of balance or £25, whichever is greater): month 1 = £112.50',
        'Interest in month 1: £4,500 x 1.867% = £84.02, principal paid: £28.48',
        'With minimum payments only: 27 years 4 months to clear, total interest: £5,891',
        'With fixed £150/month: 3 years 3 months to clear, total interest: £1,356 (saving £4,535)'
      ]
    },
    sourceUrl: 'https://www.fca.org.uk/consumers/credit-cards',
    sourceName: 'FCA - Credit Cards Consumer Information',
    lastUpdated: 'April 2026',
  },
  'sole-trader-tax-calculator': {
    quickAnswer: `UK sole trader tax (2026/27): income tax on profits (20%/40%/45% after £12,570 PA) plus <strong>Class 4 NI at 6%</strong> on profits £12,570 to £50,270 then <strong>2% above</strong>. Class 2 NI was abolished April 2024.`,
    howItWorks: [
      'Sole trader profits are taxed as personal income through the Self Assessment system. Your taxable profit is calculated as total business income minus allowable business expenses (materials, travel, insurance, professional fees, a proportion of home costs if you work from home, and capital allowances on equipment). This net profit figure is then combined with any other income to determine your total taxable income for the year.',
      'Income Tax is charged in bands after deducting the \u00a312,570 Personal Allowance: 20% basic rate on income from \u00a312,571 to \u00a350,270, 40% higher rate from \u00a350,271 to \u00a3125,140, and 45% additional rate above \u00a3125,140. The Personal Allowance reduces by \u00a31 for every \u00a32 earned above \u00a3100,000, creating an effective 60% marginal rate between \u00a3100,000 and \u00a3125,140. Tax is paid in two Payments on Account (January and July) plus a balancing payment in the following January.',
      'National Insurance adds a further layer: Class 2 contributions are \u00a33.45 per week (\u00a3179.40 per year) when profits exceed the Small Profits Threshold of \u00a36,725. Class 4 contributions are 6% on profits between \u00a312,570 and \u00a350,270, then 2% on profits above \u00a350,270. Both classes are collected through Self Assessment. Sole traders may also claim the \u00a31,000 trading allowance instead of actual expenses if their total trading income is low, which exempts the first \u00a31,000 from tax entirely.'
    ],
    example: {
      title: 'Tax bill on \u00a355,000 sole trader profit',
      steps: [
        'Net profit after expenses: \u00a355,000.',
        'Income Tax: \u00a30 on first \u00a312,570. \u00a337,700 \u00d7 20% = \u00a37,540. \u00a34,730 \u00d7 40% = \u00a31,892. Total IT: \u00a39,432.',
                'Class 4 NI: (\u00a350,270 \u2212 \u00a312,570) \u00d7 6% = \u00a32,262. (\u00a355,000 \u2212 \u00a350,270) \u00d7 2% = \u00a394.60.',
        'Total tax and NI: \u00a39,432 + \u00a3179.40 + \u00a32,262 + \u00a394.60 = \u00a311,968. Take-home: \u00a343,032.'
      ]
    },
    sourceUrl: 'https://www.gov.uk/income-tax-rates',
    sourceName: 'GOV.UK \u2013 Income Tax Rates',
    lastUpdated: 'April 2026',
  },
  'ir35-calculator': {
    howItWorks: [
      'IR35 is tax legislation that determines whether a contractor working through a limited company should be taxed as an employee. When a contract is inside IR35, the end client or agency must deduct income tax and employee National Insurance from payments, and pay employer NI on top. This significantly reduces the contractor\'s take-home pay.',
      'Outside IR35, the contractor pays themselves a low salary (typically the NI Primary Threshold of £12,570) and takes remaining profits as dividends. Dividends are taxed at lower rates: 8.75% basic, 33.75% higher and 39.35% additional, after a £500 dividend allowance. Corporation Tax at 25% (or 19% for small profits) is paid on company profits first.',
      'This calculator compares take-home pay inside and outside IR35 for a given contract rate. It shows the gross difference, accounting for corporation tax, dividend tax, employer NI, employee NI and income tax under both scenarios. The results help contractors understand the financial impact of IR35 status.',
      'How IR35 status is determined in practice. HMRC and tribunals use three key tests: (1) Control — does the client direct how, when and where you work, or do you genuinely choose; (2) Substitution — can you send a substitute, and is this a genuine right (not just on paper); (3) Mutuality of obligation — is there an ongoing obligation to offer and accept work. Other factors: financial risk (your own equipment, fix at your own cost), integration into the business, exclusivity. The HMRC CEST tool gives an indicative result but tribunals have overruled it many times — get a contract review from a specialist (Qdos, Bauer & Cottrell) for borderline cases.',
      'Who decides IR35 status — and the small company exemption. Since April 2021 (private sector) and 2017 (public sector), medium and large clients determine IR35 status and issue a Status Determination Statement (SDS). The fee-payer (usually the agency or end client) becomes liable for unpaid tax if the status is wrong. Small clients (turnover under £10.2m, balance sheet under £5.1m, fewer than 50 employees — meeting 2 of 3) are exempt — in this case YOU as contractor determine status and bear the risk. The April 2024 \'offset\' rules let HMRC offset tax already paid by the contractor against any liability assessed against the employer.',
      'Financial impact of being inside vs outside IR35. Outside IR35 on £450/day (£117k/year): take home ~£82k via Ltd company (salary + dividends + pension), effective tax 30%. Inside IR35 same day rate: take home ~£62k via umbrella/deemed employment, effective tax 47%. The £20k swing is why contractors raise day rates by ~25% when forced inside. Inside IR35 you lose: ability to take dividends, claim travel/subsistence (mostly), use Annual Investment Allowance, defer income to a future tax year, or accumulate retained earnings.',
      'Strategies if forced inside IR35. (1) Negotiate a higher day rate to compensate (typical uplift 20-30%); (2) Work through an umbrella company (simpler than statutory deemed employment via your Ltd, similar take-home); (3) Maximise umbrella pension contributions (still deductible for income tax + NI); (4) Look for outside IR35 contracts — smaller clients (exempt), genuinely outside roles (statement of work projects, clear deliverables); (5) Consider becoming permanent — may have similar take-home to inside IR35 plus benefits, pension, holiday, sick pay. Always get a written SDS from the client documenting their assessment.',
    ],
    example: {
      title: 'Example: £500/day contractor, 220 working days',
      steps: [
        'Annual gross: £500 × 220 = £110,000',
        'Outside IR35 (salary £12,570 + dividends): take-home approx. £81,500',
        'Inside IR35 (deemed employment): take-home approx. £65,200',
        'Annual difference: approx. £16,300 less inside IR35',
        'Inside IR35 employer NI (15%): approx. £14,600 extra cost',
      ],
    },
    sourceUrl: 'https://www.gov.uk/guidance/understanding-off-payroll-working-ir35',
    sourceName: 'GOV.UK — Understanding off-payroll working (IR35)',
    lastUpdated: 'April 2026',
  },
  'dividend-vs-salary-calculator': {
    howItWorks: [
      'For company directors who also own shares, the most tax-efficient extraction of profits typically involves a combination of salary and dividends. The optimal salary level is usually set at the NI Primary Threshold (\u00a312,570 for 2026/27), which uses the full Personal Allowance, is deductible as a company expense (reducing Corporation Tax), and avoids employee NI contributions. Above this threshold, salary attracts both employee NI (8%) and employer NI (15%), making it expensive.',
      'Dividends are paid from post-Corporation Tax profits, so the company has already paid 19\u201325% tax on the underlying profit. The first \u00a3500 of dividends is covered by the dividend allowance and is tax-free. Beyond that, dividends are taxed at 8.75% (basic rate), 33.75% (higher rate), and 39.35% (additional rate). Crucially, dividends carry no National Insurance for either the individual or the company, which is the primary source of tax savings compared with a pure salary approach.',
      'The combined effective tax rate on profit extracted as salary (Corporation Tax saving offset by income tax plus double NI) is typically higher than the rate on dividends (Corporation Tax followed by dividend tax but no NI). However, salary counts as pensionable earnings for contribution purposes and builds state pension entitlement, while dividends do not. The calculation must also factor in the employer NI cost, which is an additional 15% charge the company bears on salary above the Secondary Threshold.'
    ],
    example: {
      title: 'Tax on extracting \u00a360,000 profit: salary vs dividend split',
      steps: [
        'Take salary of \u00a312,570: income tax \u00a30, employee NI \u00a30, employer NI \u00a30. Corporation Tax saved: \u00a312,570 \u00d7 19% = \u00a32,388.',
        'Remaining company profit: \u00a360,000 \u2212 \u00a312,570 = \u00a347,430.',
        'Corporation Tax at 19% on \u00a347,430: \u00a39,012. Profit after CT: \u00a338,418.',
        'Dividend tax on \u00a338,418: first \u00a3500 free, then \u00a337,918 \u00d7 8.75% = \u00a33,318.',
        'Total take-home: \u00a312,570 + \u00a338,418 \u2212 \u00a33,318 = \u00a347,670. Total tax paid: \u00a312,330 (effective rate 20.6%).'
      ]
    },
    sourceUrl: 'https://www.gov.uk/tax-on-dividends',
    sourceName: 'GOV.UK \u2013 Tax on Dividends',
    lastUpdated: 'April 2026',
  },
  'calorie-calculator': {
    howItWorks: [
      'This calculator estimates your Total Daily Energy Expenditure (TDEE) using the Mifflin-St Jeor equation, which predicts your Basal Metabolic Rate (BMR) from age, weight, height and sex. BMR is then multiplied by an activity factor ranging from 1.2 (sedentary) to 1.9 (very active) to give total calories burned per day.',
      'To lose weight, you need a calorie deficit — typically 500 kcal per day for a loss of roughly 0.5 kg per week. To gain weight, a surplus of 250–500 kcal per day is recommended. The NHS advises daily reference intakes of 2,000 kcal for women and 2,500 kcal for men, though individual needs vary considerably.',
      'Enter your details and goal, and the calculator will show maintenance calories plus adjusted targets for weight loss or gain. Results are estimates — track your weight over two to three weeks and adjust intake by 100–200 kcal if progress stalls.',
    ],
    example: {
      title: 'Example: 30-year-old woman, 70 kg, 165 cm, moderately active',
      steps: [
        'BMR (Mifflin-St Jeor): 10 \u00D7 70 + 6.25 \u00D7 165 \u2212 5 \u00D7 30 \u2212 161 = 1,421 kcal',
        'Activity factor (moderate, 1.55): 1,421 \u00D7 1.55 = 2,203 kcal',
        'To lose 0.5 kg/week: 2,203 \u2212 500 = 1,703 kcal/day',
        'To gain 0.5 kg/week: 2,203 + 500 = 2,703 kcal/day',
      ],
    },
    sourceUrl: 'https://www.nhs.uk/live-well/healthy-weight/managing-your-weight/understanding-calories/',
    sourceName: 'NHS \u2014 Understanding calories',
    lastUpdated: 'April 2026',
  },
  'concrete-calculator': {
    howItWorks: [
      'Concrete volume is calculated by multiplying length \u00D7 width \u00D7 depth for rectangular slabs, or \u03C0r\u00B2 \u00D7 depth for circular areas such as post holes. The result in cubic metres tells you how much ready-mix to order, or how many bags of dry mix you need. A standard 25 kg bag of post-mix makes approximately 0.011 m\u00B3 of concrete.',
      'For small jobs (under 1 m\u00B3), bagged dry-mix is practical. For larger pours, ready-mix delivery is more economical and ensures consistent quality. Most UK suppliers sell ready-mix in minimum loads of 1 m\u00B3 for mini-mix and 6 m\u00B3 for standard trucks. Add 5\u201310% for wastage.',
      'Enter the dimensions of your slab, footing or post holes and the calculator shows volume in cubic metres, the number of 25 kg bags needed and an approximate cost estimate. For structural work like foundations, always check Building Regulations requirements and consider getting an engineer\'s specification for the concrete mix design.',
    ],
    example: {
      title: 'Example: Garden shed base, 3 m \u00D7 2.4 m \u00D7 0.1 m deep',
      steps: [
        'Volume: 3 \u00D7 2.4 \u00D7 0.1 = 0.72 m\u00B3',
        'Add 10% wastage: 0.72 \u00D7 1.10 = 0.79 m\u00B3',
        'Bags (25 kg post-mix): 0.79 \u00F7 0.011 \u2248 72 bags',
        'Or order 1 m\u00B3 ready-mix (typical minimum load)',
      ],
    },
    sourceUrl: 'https://www.gov.uk/government/publications/building-regulations-approved-document-a-structure',
    sourceName: 'GOV.UK \u2014 Building Regulations Approved Document A',
    lastUpdated: 'April 2026',
  },
  'paint-calculator': {
    howItWorks: [
      'Paint coverage depends on the product type and surface texture. Emulsion paint for walls typically covers 10\u201312 m\u00B2 per litre on smooth plaster. Gloss and satin for woodwork cover 12\u201316 m\u00B2 per litre. Textured, bare or porous surfaces may require 20\u201330% more paint due to increased absorption on the first coat.',
      'This calculator measures each wall (height \u00D7 width), subtracts doors and windows, then divides the total area by the coverage rate. Two coats are standard for a colour change; a single coat may suffice for maintenance. The calculator adjusts for your chosen number of coats.',
      'Enter room dimensions, number of doors and windows, and choose the paint type and number of coats. The calculator shows total litres needed and suggests tin sizes (most UK paints come in 2.5 L and 5 L tins). Buying the next size up is usually more economical than buying an extra small tin.',
    ],
    example: {
      title: 'Example: Room 4 m \u00D7 3.5 m, 2.4 m ceiling, 1 door, 1 window, 2 coats emulsion',
      steps: [
        'Wall area: 2 \u00D7 (4 + 3.5) \u00D7 2.4 = 36 m\u00B2',
        'Less door (1.8 m\u00B2) and window (1.5 m\u00B2): 32.7 m\u00B2',
        'Two coats: 32.7 \u00D7 2 = 65.4 m\u00B2',
        'Litres needed: 65.4 \u00F7 11 = 5.9 L \u2014 buy 2 \u00D7 2.5 L or 1 \u00D7 5 L + 1 \u00D7 2.5 L',
      ],
    },
    sourceUrl: 'https://www.gov.uk/government/publications/building-regulations-approved-document-f-ventilation',
    sourceName: 'GOV.UK \u2014 Building Regulations Approved Document F',
    lastUpdated: 'April 2026',
  },
  'percentage-calculator': {
    howItWorks: [
      'Percentages express a number as a fraction of 100. This calculator handles four common operations: find X% of a number, find what percentage one number is of another, calculate the percentage change between two values, and reverse-calculate the original from a percentage result.',
      'Percentage change is widely used in finance, statistics and everyday comparisons. The formula is: ((New − Old) ÷ Old) × 100. A positive result means an increase; a negative result means a decrease. The calculator displays both the direction and magnitude clearly.',
      'Reverse percentage is useful for VAT-inclusive prices or sale items. If you know the final value after a percentage increase or decrease, the calculator finds the original amount before the change was applied.',
    ],
    example: {
      title: 'Example: Various percentage calculations',
      steps: [
        '15% of £240 = £36',
        '£36 is what % of £240? Answer: 15%',
        'Percentage change from £200 to £240: +20%',
        'If £240 includes a 20% increase, the original was £240 ÷ 1.20 = £200',
      ],
    },
    sourceUrl: 'https://www.bbc.co.uk/bitesize/topics/z9s22sg',
    sourceName: 'BBC Bitesize — Percentages',
    lastUpdated: 'April 2026',
  },
  'age-calculator': {
    howItWorks: [
      'This calculator works out your exact age in years, months, days, hours and minutes from your date of birth. It accounts for leap years, varying month lengths and the current UK time zone (GMT or BST depending on the date).',
      'Knowing your precise age is useful for checking pension eligibility (State Pension age is currently 66, rising to 67 between 2026 and 2028), insurance quotes, driving licence applications and legal age thresholds such as 18 for voting or buying alcohol.',
      'The calculator also shows your age on any future or past date, not just today. Enter a target date to see how old you will be — or were — at that point. It displays the result in multiple units so you can see your age in total days or hours lived.',
    ],
    example: {
      title: 'Example: Born 15 March 1990',
      steps: [
        'Age today (April 2026): 36 years, 0 months, 27 days',
        'Total days lived: approx. 13,176',
        'Total hours: approx. 316,224',
        'Next milestone birthday (40): 15 March 2030',
      ],
    },
    sourceUrl: 'https://www.gov.uk/state-pension-age',
    sourceName: 'GOV.UK — Check your State Pension age',
    lastUpdated: 'April 2026',
  },
  'currency-converter': {
    howItWorks: [
      'Exchange rates fluctuate constantly based on economic conditions, central bank policies and market sentiment. The mid-market rate — the midpoint between the buy and sell prices on the interbank market — is the fairest benchmark. Banks and bureaux de change add a margin on top, typically 2–5% for retail customers.',
      'This converter uses mid-market rates to show you the true value of your conversion. When comparing providers, always check the total cost including both the exchange rate margin and any fixed transaction fees. A provider with a better rate but higher fees may cost more overall.',
      'For large transfers such as property purchases abroad, specialist currency brokers often offer rates much closer to the mid-market rate than high-street banks. Forward contracts let you lock in a rate for a future date, which can be useful for planned purchases.',
    ],
    example: {
      title: 'Example: Converting £1,000 to Euros',
      steps: [
        'Mid-market rate: 1 GBP = 1.17 EUR',
        'At mid-market: £1,000 = €1,170',
        'Typical bank rate (3% margin): 1 GBP = 1.135 EUR → €1,135',
        'Cost of the bank\'s margin: €35 (approx. £30)',
      ],
    },
    sourceUrl: 'https://www.bankofengland.co.uk/statistics/exchange-rates',
    sourceName: 'Bank of England — Exchange rates',
    lastUpdated: 'April 2026',
  },

  // ─── TOOLS / EVERYDAY ────────────────────────────────────────────────
  'discount-calculator': {
    howItWorks: [
      'This calculator works out the final price after a percentage discount, the amount you save and — for stacked discounts — the combined effective percentage off. Enter the original price and one or more discount percentages to see results instantly.',
      'Stacked discounts are applied sequentially, not added together. A 20% discount followed by a 10% discount is not 30% off — it is 28% off because the second discount applies to the already-reduced price. The calculator handles this correctly and shows the true combined saving.',
      'You can also reverse-calculate: enter the sale price and original price to find the percentage discount that was applied. This is useful for checking whether a sale is genuine or whether the original price was inflated.',
    ],
    example: {
      title: 'Example: £80 item with 25% off',
      steps: [
        'Original price: £80.00',
        'Discount: 25% = £20.00',
        'Sale price: £60.00',
        'With additional 10% off: £60 × 0.90 = £54.00 (total saving: 32.5%)',
      ],
    },
    sourceUrl: 'https://www.citizensadvice.org.uk/consumer/shopping/shop-sales-and-bargains/',
    sourceName: 'Citizens Advice — Shop sales and bargains',
    lastUpdated: 'April 2026',
  },
  'tip-calculator': {
    howItWorks: [
      'Tipping in the UK is discretionary, not mandatory. A typical restaurant tip is 10–12.5% of the bill, though this varies by establishment and region. Many restaurants add an optional service charge of 12.5%, which you can ask to have removed if the service was poor.',
      'For other services, UK customs differ from American expectations. Taxi drivers are usually tipped by rounding up to the nearest pound. Hairdressers typically receive £2–£5. Hotel porters may get £1–£2 per bag. There is no expectation to tip in pubs, cafes or for takeaway orders.',
      'Since October 2024, the Employment (Allocation of Tips) Act requires employers to pass 100% of tips to staff. This calculator shows tip amounts at common UK percentages and lets you adjust based on the service you received.',
    ],
    example: {
      title: 'Example: Restaurant bill of £85 for two people',
      steps: [
        'At 10%: tip = £8.50, total = £93.50',
        'At 12.5%: tip = £10.63, total = £95.63',
        'At 15%: tip = £12.75, total = £97.75',
        'Per person at 12.5%: £47.82 each',
      ],
    },
    sourceUrl: 'https://www.gov.uk/government/publications/tips-gratuities-and-service-charges-for-employers',
    sourceName: 'GOV.UK — Tips, gratuities and service charges',
    lastUpdated: 'April 2026',
  },
  'vat-flat-rate-calculator': {
    howItWorks: [
      'The VAT Flat Rate Scheme simplifies VAT accounting for small businesses with VAT-taxable turnover of \u00a3150,000 or less (excluding VAT). Instead of tracking VAT on every purchase and sale, you charge customers the standard 20% VAT but pay HMRC a fixed percentage of your gross (VAT-inclusive) turnover. The flat rate percentage varies by business sector\u2014for example, 14.5% for computer and IT consultancy, 12% for management consultancy, and 10% for real estate. You keep the difference between the 20% charged and the flat rate paid.',
      'In the first year of VAT registration, you receive an additional 1% discount on the flat rate, reducing the percentage by one point. However, the limited cost trader rule applies if your goods purchases (excluding capital expenditure over \u00a32,000) are less than 2% of turnover or under \u00a31,000 per year\u2014in which case a flat rate of 16.5% applies regardless of sector, significantly reducing the scheme\'s benefit for service-based businesses with low material costs.',
      'To determine if the flat rate scheme saves money, compare: (a) VAT collected from customers (20% of net sales) minus (b) VAT on purchases you could reclaim under standard accounting, against (c) the flat rate payment. The scheme saves admin time by eliminating the need to track VAT on individual purchases, but you cannot reclaim VAT on most purchases (except capital assets over \u00a32,000 including VAT). You can leave the scheme if turnover exceeds \u00a3230,000 including VAT, or voluntarily at any time.'
    ],
    example: {
      title: 'Flat Rate VAT for an IT consultant billing \u00a38,000/month',
      steps: [
        'Monthly invoices: \u00a38,000 net + \u00a31,600 VAT = \u00a39,600 gross.',
        'Flat rate for IT consultancy: 14.5% (13.5% in first year).',
        'VAT payment to HMRC: \u00a39,600 \u00d7 14.5% = \u00a31,392.',
        'Under standard VAT, you\'d pay \u00a31,600 collected minus \u00a3250 reclaimable on expenses = \u00a31,350.',
        'Flat rate costs \u00a342 more per month in this scenario. Check if the admin time saved justifies the cost.'
      ]
    },
    sourceUrl: 'https://www.gov.uk/vat-flat-rate-scheme',
    sourceName: 'GOV.UK \u2013 VAT Flat Rate Scheme',
    lastUpdated: 'April 2026',
  },
  'flooring-calculator': {
    howItWorks: [
      'Flooring quantity is calculated by measuring the room area (length \u00D7 width) and adding a waste allowance. For laminate and engineered wood, 10% extra is standard for straight layouts and 15% for diagonal or herringbone patterns. Vinyl and carpet are sold by the linear metre from rolls (typically 2 m or 4 m wide), so you calculate based on roll width and room dimensions.',
      'This calculator supports rectangular rooms, L-shaped rooms and irregular shapes. For an L-shape, split the room into two rectangles, calculate each separately and add them together. The calculator also estimates underlay if needed (most laminate and engineered wood requires underlay; carpet has its own).',
      'Enter room dimensions and flooring type. The calculator shows total area, area including waste, number of packs (laminate and wood are sold in packs covering 1.5\u20132.5 m\u00B2) or linear metres (carpet, vinyl). It includes an estimated cost per m\u00B2 for budget, mid-range and premium options.',
    ],
    example: {
      title: 'Example: Living room 5 m \u00D7 4 m, laminate flooring',
      steps: [
        'Room area: 5 \u00D7 4 = 20 m\u00B2',
        'Add 10% waste: 22 m\u00B2',
        'Packs (2.0 m\u00B2 per pack): 22 \u00F7 2.0 = 11 packs',
        'Underlay: 22 m\u00B2 (sold in rolls of 15 m\u00B2) \u2014 2 rolls',
      ],
    },
    sourceUrl: 'https://www.gov.uk/government/publications/building-regulations-approved-document-c-site-preparation-and-resistance-to-contaminants-and-moisture',
    sourceName: 'GOV.UK \u2014 Building Regulations Approved Document C',
    lastUpdated: 'April 2026',
  },
  'tile-calculator': {
    howItWorks: [
      'To calculate tiles needed, divide the total area to be tiled by the area of a single tile. Common UK tile sizes include 300 \u00D7 300 mm (0.09 m\u00B2), 600 \u00D7 300 mm (0.18 m\u00B2) and 600 \u00D7 600 mm (0.36 m\u00B2). Always add 10% for cuts and breakage \u2014 increase to 15% for diagonal layouts or complex patterns.',
      'For wall tiling, measure each wall separately and subtract windows or other openings. For floor tiling, measure the room at its longest and widest points (including any alcoves). The calculator handles rectangular, L-shaped and irregular rooms by letting you split the area into sections.',
      'Enter your room dimensions, tile size and layout pattern. The calculator shows the number of tiles, boxes (tiles are typically sold in boxes covering 1\u20131.5 m\u00B2) and estimated cost. It also estimates adhesive and grout: roughly 2\u20133 kg of adhesive per m\u00B2 for wall tiles and 3\u20135 kg per m\u00B2 for large floor tiles.',
    ],
    example: {
      title: 'Example: Bathroom floor 2.5 m \u00D7 1.8 m, 300 \u00D7 300 mm tiles',
      steps: [
        'Floor area: 2.5 \u00D7 1.8 = 4.5 m\u00B2',
        'Add 10% wastage: 4.95 m\u00B2',
        'Tiles per m\u00B2: 1 \u00F7 0.09 = 11.1 tiles',
        'Total tiles: 4.95 \u00D7 11.1 = 55 tiles',
        'Adhesive: ~15 kg; Grout: ~2 kg',
      ],
    },
    sourceUrl: 'https://www.gov.uk/government/publications/building-regulations-approved-document-c-site-preparation-and-resistance-to-contaminants-and-moisture',
    sourceName: 'GOV.UK \u2014 Building Regulations Approved Document C',
    lastUpdated: 'April 2026',
  },
  'gravel-calculator': {
    howItWorks: [
      'Gravel quantity is calculated by multiplying area \u00D7 depth to get volume, then converting to tonnes using the bulk density. Most decorative gravel has a bulk density of 1.5\u20131.8 t/m\u00B3. A typical driveway uses a 40\u201350 mm depth of gravel over a compacted sub-base. Paths and borders need 25\u201340 mm depth.',
      'This calculator shows results in cubic metres, tonnes and bulk bags (a standard bulk bag contains approximately 0.5 m\u00B3 or 0.8\u20130.9 tonnes). For driveways, a geo-textile membrane under the gravel prevents weed growth and stops gravel mixing with the sub-base. Gravel grids (honeycomb panels) stabilise the surface for vehicle use.',
      'Enter the area dimensions and desired depth. The calculator shows volume, weight in tonnes, number of bulk bags and estimated cost (delivered gravel in the UK typically costs £50\u2013£80 per tonne for standard aggregates, or £80\u2013£150 per tonne for premium decorative gravel).',
    ],
    example: {
      title: 'Example: Driveway 8 m \u00D7 3 m, 50 mm deep, 20 mm shingle',
      steps: [
        'Area: 24 m\u00B2',
        'Volume: 24 \u00D7 0.05 = 1.2 m\u00B3',
        'Weight: 1.2 \u00D7 1.7 = 2.04 tonnes',
        'Bulk bags: 2.04 \u00F7 0.85 \u2248 2.4, order 3 bulk bags',
        'Estimated cost: ~£150\u2013£240 delivered',
      ],
    },
    sourceUrl: 'https://www.gov.uk/government/publications/building-regulations-approved-document-h-drainage-and-waste-disposal',
    sourceName: 'GOV.UK \u2014 Building Regulations Approved Document H',
    lastUpdated: 'April 2026',
  },
  'wallpaper-calculator': {
    howItWorks: [
      'A standard UK wallpaper roll is 10.05 m long and 0.53 m wide, covering approximately 5 m\u00B2. The number of drops (vertical strips) per roll depends on room height and pattern repeat. A plain or small-repeat paper in a 2.4 m room gives 4 drops per roll. A large pattern repeat (e.g. 64 cm) reduces this to 2\u20133 drops per roll due to pattern matching waste.',
      'This calculator measures the room perimeter, divides by roll width to get the total number of drops needed, then divides by drops per roll to get the number of rolls. It subtracts doors and windows (each equivalent to roughly half a drop) and adds 1\u20132 spare rolls for mistakes and future repairs.',
      'Enter room dimensions, ceiling height and pattern repeat length. The calculator shows drops needed, rolls required and estimated cost. For wide-width wallpapers (0.70 m or 1.06 m), the calculator adjusts the strip count accordingly.',
    ],
    example: {
      title: 'Example: Room 4 m \u00D7 3 m, 2.4 m ceiling, 32 cm pattern repeat, 1 door, 1 window',
      steps: [
        'Perimeter: 2 \u00D7 (4 + 3) = 14 m',
        'Drops needed: 14 \u00F7 0.53 = 26.4, round up to 27',
        'Less door (1) and window (1): 25 drops',
        'Drops per roll (2.4 m height, 32 cm repeat): 3',
        'Rolls needed: 25 \u00F7 3 = 8.3, round up to 9 rolls',
      ],
    },
    sourceUrl: 'https://www.gov.uk/government/publications/building-regulations-approved-document-b-fire-safety-volume-1-dwellings',
    sourceName: 'GOV.UK \u2014 Building Regulations Approved Document B',
    lastUpdated: 'April 2026',
  },
  'decking-calculator': {
    howItWorks: [
      'Decking board quantity is calculated by dividing the deck area by the coverage of each board. Standard softwood decking boards are 2.4 m, 3.0 m, 3.6 m or 4.8 m long and 120\u2013145 mm wide (face width). Each board covers approximately 0.29\u20130.70 m\u00B2 depending on size. A 5\u201310% waste allowance covers cuts and offcuts.',
      'Substructure requirements include joists (typically 47 \u00D7 150 mm at 400 mm centres, supported on post-and-beam or concrete pads) and screws (approximately 20\u201325 stainless-steel screws per m\u00B2). The calculator also estimates joist hangers, post brackets and any concrete needed for footings.',
      'Enter the deck dimensions. The calculator shows boards, joists, screws and an estimated cost. For treated softwood decking, expect £20\u2013£40 per m\u00B2 for materials. Composite decking is £40\u2013£80 per m\u00B2 but lasts longer and requires less maintenance. Any raised deck above 300 mm may need Building Regulations approval.',
    ],
    example: {
      title: 'Example: Deck 4 m \u00D7 3 m, 145 mm softwood boards, 3.6 m lengths',
      steps: [
        'Area: 12 m\u00B2',
        'Boards (145 mm wide, 3 m deck width): 3,000 \u00F7 145 \u2248 21 boards',
        'Add 10% waste: 23 boards at 4 m length',
        'Joists (400 mm centres, 4 m span): 3,000 \u00F7 400 + 1 = 9 joists at 4 m',
        'Screws: 12 \u00D7 22 \u2248 264 screws (2 boxes of 200)',
      ],
    },
    sourceUrl: 'https://www.gov.uk/government/publications/building-regulations-approved-document-a-structure',
    sourceName: 'GOV.UK \u2014 Building Regulations Approved Document A',
    lastUpdated: 'April 2026',
  },

  /* ──────────────────────────── GARDENING ──────────────────────────── */
  'fencing-calculator': {
    howItWorks: [
      'Fence panels in the UK are a standard 1.83 m (6 ft) wide. The number of panels is calculated by dividing the total run length by 1.83 m. You need one more post than the number of panels (posts go at each end and between every panel). Standard fence post height is the panel height plus 600 mm for the buried portion (or 450 mm if using post supports).',
      'This calculator estimates panels, posts, post-fix concrete (1\u20132 bags per post), gravel boards (optional, placed at ground level to protect panels from damp) and post caps. For closeboard fencing (individual boards on rails), it calculates featherboard quantity, arris rails and clips instead.',
      'Enter the total fence run length, panel height (typically 0.9 m, 1.2 m, 1.5 m or 1.8 m) and fence type. The calculator shows materials and estimated cost. Planning permission is not normally needed for fences up to 2 m high (1 m if adjacent to a highway). Check boundary responsibility on your title plan before replacing fencing.',
    ],
    example: {
      title: 'Example: 12 m fence run, 1.8 m high overlap panels',
      steps: [
        'Panels: 12 \u00F7 1.83 = 6.6, round to 7 panels',
        'Posts: 7 + 1 = 8 posts (75 \u00D7 75 mm \u00D7 2.4 m)',
        'Post-fix concrete: 8 \u00D7 2 bags = 16 bags (20 kg each)',
        'Gravel boards: 7 \u00D7 1.83 m boards',
        'Estimated total cost: £450\u2013£650 (materials only)',
      ],
    },
    sourceUrl: 'https://www.gov.uk/planning-permission-england-wales',
    sourceName: 'GOV.UK \u2014 Planning permission',
    lastUpdated: 'April 2026',
  },
  'body-fat-calculator': {
    howItWorks: [
      'This calculator estimates body fat percentage using the US Navy method, which is based on circumference measurements. For men, you need neck and waist measurements; for women, neck, waist and hip measurements. The formula uses the logarithmic relationship between these measurements and height to estimate body fat.',
      'Healthy body fat ranges vary by sex and age. For men, 10\u201320% is generally considered healthy; for women, 18\u201328%. Essential fat levels (below which health is compromised) are around 3\u20135% for men and 10\u201313% for women. Athletes typically sit at the lower end of the healthy range.',
      'Measure at the narrowest point of the neck, the navel for waist (men) or the narrowest point (women), and the widest point for hips. Take measurements on bare skin, standing relaxed. For best accuracy, measure in the morning before eating. The Navy method has an accuracy of roughly \u00B13\u20134% compared to DEXA scans.',
    ],
    example: {
      title: 'Example: Male, 180 cm, waist 88 cm, neck 38 cm',
      steps: [
        'Formula: 86.010 \u00D7 log\u2081\u2080(waist \u2212 neck) \u2212 70.041 \u00D7 log\u2081\u2080(height) + 36.76',
        'log\u2081\u2080(88 \u2212 38) = log\u2081\u2080(50) = 1.699',
        'log\u2081\u2080(180) = 2.255',
        'Body fat: 86.010 \u00D7 1.699 \u2212 70.041 \u00D7 2.255 + 36.76 \u2248 18.6%',
      ],
    },
    sourceUrl: 'https://www.nhs.uk/live-well/healthy-weight/bmi-calculator/',
    sourceName: 'NHS \u2014 Healthy weight',
    lastUpdated: 'April 2026',
  },
  'pregnancy-due-date-calculator': {
    howItWorks: [
      'The estimated due date (EDD) is calculated by adding 280 days (40 weeks) to the first day of your last menstrual period (LMP). This is known as N\u00E4gele\'s rule: add 7 days to the LMP date, then add 9 calendar months (or subtract 3 months and add 1 year). The method assumes a 28-day cycle with ovulation on day 14.',
      'If you know the conception date, the calculator adds 266 days (38 weeks) instead. For cycles longer or shorter than 28 days, the due date is adjusted accordingly \u2014 for example, a 35-day cycle shifts the EDD forward by 7 days.',
      'The NHS offers all pregnant women a dating scan between 8 and 14 weeks, which measures the baby\'s crown-rump length to refine the due date. Only about 4% of babies arrive on their exact due date; most are born within two weeks either side. The NHS considers pregnancies overdue at 42 weeks.',
    ],
    example: {
      title: 'Example: LMP 1 January 2026, 28-day cycle',
      steps: [
        'LMP: 1 January 2026',
        'Add 7 days: 8 January 2026',
        'Add 9 months: 8 October 2026',
        'Estimated due date: 8 October 2026',
        'First trimester ends: ~27 March 2026 (week 12)',
      ],
    },
    sourceUrl: 'https://www.nhs.uk/pregnancy/finding-out/due-date-calculator/',
    sourceName: 'NHS \u2014 Due date calculator',
    lastUpdated: 'April 2026',
  },
  'alcohol-units-calculator': {
    howItWorks: [
      'Alcohol units are calculated with the formula: volume (ml) \u00D7 ABV (%) \u00F7 1,000. One unit equals 10 ml (8 g) of pure alcohol. A standard 175 ml glass of 12% wine is 2.1 units. A pint of 4% lager is 2.3 units. A 25 ml measure of 40% spirits is 1 unit.',
      'The NHS advises that adults should not regularly drink more than 14 units per week, spread over 3 or more days. There is no safe level of alcohol consumption. Binge drinking is defined as consuming more than 6 units (women) or 8 units (men) in a single session.',
      'This calculator also estimates the calories in each drink. Alcohol contains 7 kcal per gram, making it nearly as calorie-dense as fat. A pint of lager typically contains 180\u2013230 kcal, and a large glass of wine around 230 kcal. Enter the drink type, volume and ABV to see units and calories.',
    ],
    example: {
      title: 'Example: Friday evening \u2014 2 pints of 5% lager + 2 glasses of 13% wine (175 ml)',
      steps: [
        'Pint of 5% lager: 568 ml \u00D7 5 \u00F7 1,000 = 2.8 units each',
        '175 ml glass of 13% wine: 175 \u00D7 13 \u00F7 1,000 = 2.3 units each',
        'Total: (2 \u00D7 2.8) + (2 \u00D7 2.3) = 10.2 units',
        'Estimated calories: ~910 kcal',
        'Weekly allowance used in one session: 73% of 14 units',
      ],
    },
    sourceUrl: 'https://www.nhs.uk/live-well/alcohol-advice/calculating-alcohol-units/',
    sourceName: 'NHS \u2014 Calculating alcohol units',
    lastUpdated: 'April 2026',
  },
  'sleep-calculator': {
    howItWorks: [
      'Sleep occurs in cycles of approximately 90 minutes, moving through light sleep, deep sleep and REM sleep. Waking at the end of a complete cycle (rather than mid-cycle) tends to leave you feeling more rested. Most adults need 4\u20136 full cycles per night, corresponding to 6\u20139 hours of sleep.',
      'This calculator works in two modes: enter your desired wake time to calculate optimal bedtimes, or enter your bedtime to calculate the best wake times. It factors in an average sleep-onset latency of 15 minutes (the time it takes to fall asleep) and counts back or forward in 90-minute intervals.',
      'The NHS recommends that adults aged 18\u201364 aim for 7\u20139 hours of sleep per night. Consistently sleeping fewer than 6 hours is linked to increased risk of obesity, cardiovascular disease and impaired cognitive function. Maintaining a consistent sleep schedule is more important than the exact number of hours.',
    ],
    example: {
      title: 'Example: Need to wake at 7:00 AM',
      steps: [
        'Allow 15 minutes to fall asleep',
        '6 cycles (9 hours): bedtime 9:45 PM',
        '5 cycles (7.5 hours): bedtime 11:15 PM',
        '4 cycles (6 hours): bedtime 12:45 AM',
        'Recommended: 9:45 PM or 11:15 PM for optimal rest',
      ],
    },
    sourceUrl: 'https://www.nhs.uk/live-well/sleep-and-tiredness/how-to-get-to-sleep/',
    sourceName: 'NHS \u2014 How to get to sleep',
    lastUpdated: 'April 2026',
  },
  'date-calculator': {
    howItWorks: [
      'This calculator finds the exact number of days, weeks, months and years between any two dates. You can choose to include or exclude weekends and UK bank holidays, making it useful for calculating working days for employment notice periods, project timelines or legal deadlines.',
      'The UK has eight permanent bank holidays in England and Wales (Scotland has nine, Northern Ireland has ten). When calculating business days, the tool accounts for these automatically based on the nation you select. It also handles leap years correctly.',
      'You can also add or subtract a set number of days, weeks or months from a given date. This is handy for calculating due dates, contract expiry or the end of a notice period.',
    ],
    example: {
      title: 'Example: Days between 1 January and 31 March 2026',
      steps: [
        'Calendar days: 89',
        'Weeks and days: 12 weeks and 5 days',
        'Working days (excluding weekends): 63',
        'Working days (excluding weekends and bank holidays): 61',
      ],
    },
    sourceUrl: 'https://www.gov.uk/bank-holidays',
    sourceName: 'GOV.UK — UK bank holidays',
    lastUpdated: 'April 2026',
  },
  'weight-converter': {
    howItWorks: [
      'The UK uses a mix of metric and imperial weight measurements. Metric (kilograms and grams) is standard in shops and packaging by law, but many people still think in stones and pounds for body weight. This converter handles kg, pounds (lb), stones (st) and ounces (oz).',
      'One stone equals 14 pounds, and one pound equals 0.4536 kilograms. The converter handles all combinations and displays results in the format most commonly used in UK daily life — for example, body weight in stones and pounds and food in kilograms or grams.',
    ],
    example: {
      title: 'Example: Converting 75 kg',
      steps: [
        '75 kg = 165.35 lb',
        '75 kg = 11 stone 11.35 lb',
        '75 kg = 2,645.55 oz',
      ],
    },
    sourceUrl: 'https://www.npl.co.uk/si-units/kilogram',
    sourceName: 'National Physical Laboratory — The kilogram',
    lastUpdated: 'April 2026',
  },
  'inflation-calculator': {
    howItWorks: [
      'The Consumer Prices Index (CPI) tracks the average price change of a weighted basket of around 700 goods and services purchased by UK households. The Office for National Statistics collects approximately 180,000 price quotes each month from shops, online retailers, and service providers across the country. Each item\'s weight reflects its share of total household spending, updated annually from the Living Costs and Food Survey.',
      'To convert a historical amount to today\'s prices, the calculator divides the current CPI index value by the historical index value, then multiplies by the original sum. For example, the CPI index stood at 68.0 in January 2000 and approximately 136.0 in early 2026, giving a ratio of 2.0. This means £100 in January 2000 had roughly the same purchasing power as £200 in 2026.',
      'CPI differs from the older Retail Prices Index (RPI) in several ways: CPI excludes mortgage interest payments and council tax, uses a geometric rather than arithmetic mean for averaging prices, and covers a broader population including foreign visitors\' spending. CPIH extends CPI by adding owner-occupiers\' housing costs. The calculator defaults to CPI as it is the UK government\'s preferred inflation measure and the Bank of England\'s target index.'
    ],
    example: {
      title: 'Adjusting a 2010 salary to 2026 equivalent',
      steps: [
        'Original salary in 2010: £32,000',
        'CPI index January 2010: 112.4, CPI index January 2026: approximately 139.7',
        'Inflation multiplier: 139.7 / 112.4 = 1.243',
        'Equivalent 2026 salary: £32,000 x 1.243 = £39,776',
        'Cumulative inflation over the period: 24.3%, meaning prices rose by nearly a quarter'
      ]
    },
    sourceUrl: 'https://www.ons.gov.uk/economy/inflationandpriceindices',
    sourceName: 'ONS - Inflation and Price Indices',
    lastUpdated: 'April 2026',
  },
  'wedding-budget-calculator': {
    howItWorks: [
      'UK wedding costs vary significantly by region, season, and guest count. The calculator breaks your total budget into category allocations based on industry-standard percentage splits derived from annual Hitched survey data. Venue and catering typically consume 55-60% combined, with photography at 8-12%, entertainment at 5-8%, and attire and accessories at 6-10% of the total spend.',
      'Guest count is the single largest cost driver. The calculator estimates a per-head cost by dividing your catering budget by guest numbers, typically ranging from £60-£150 per guest for food and drink at UK venues. Evening-only guests are costed at roughly 40% of a full day guest. Reducing your guest list by 20 people can save £2,000-£4,000 depending on your chosen venue tier.',
      'Regional price differences are substantial across the UK. London and the South East command a 25-40% premium over the national average, while Scotland, Wales, and Northern England can be 15-25% below it. Saturday summer weddings in peak season (June-September) attract the highest venue hire fees, whereas midweek or winter dates can reduce venue costs by 20-50%.'
    ],
    example: {
      title: 'Allocating a £22,000 wedding budget for 80 guests',
      steps: [
        'Venue hire: 35% of £22,000 = £7,700',
        'Catering and drinks (80 day guests at £68/head): £5,440 (25%)',
        'Photography and videography: £2,200 (10%)',
        'Wedding attire, suits, and accessories: £1,760 (8%)',
        'Remaining £4,900 covers flowers (£1,100), entertainment (£1,300), stationery (£500), transport (£600), and contingency (£1,400)'
      ]
    },
    sourceUrl: 'https://www.hitched.co.uk/wedding-planning/organising-and-planning/the-average-wedding-cost-in-the-uk/',
    sourceName: 'Hitched - Average UK Wedding Cost Survey',
    lastUpdated: 'April 2026',
  },
  'visa-points-calculator': {
    howItWorks: [
      'The UK Skilled Worker visa uses a points-based system. You need 70 points to qualify. Mandatory requirements (50 points) are: a job offer from a licensed sponsor (20 points), a job at the appropriate skill level — RQF 3 or above (20 points), and English language ability at B1 level (10 points).',
      'The remaining 20 tradeable points come from salary. If your salary meets the going rate for the occupation, you get 20 points. If it is below the going rate but above the minimum threshold (£26,200 or the occupation-specific rate, whichever is higher), you may still qualify with tradeable points from a PhD, a shortage occupation, or being a new entrant.',
      'This calculator checks each requirement and tallies your points. It cross-references your occupation against the SOC code list and going rates, and tells you the minimum salary you need to qualify in your specific role.',
    ],
    example: {
      title: 'Example: Software developer, £38,000 salary',
      steps: [
        'Job offer from licensed sponsor: 20 points',
        'Job at RQF 6 skill level: 20 points',
        'English at B1 or above: 10 points',
        'Salary meets going rate for SOC 2134: 20 points',
        'Total: 70 points — eligible',
      ],
    },
    sourceUrl: 'https://www.gov.uk/skilled-worker-visa',
    sourceName: 'GOV.UK — Skilled Worker visa',
    lastUpdated: 'April 2026',
  },
  'court-fee-calculator': {
    howItWorks: [
      'Court fees in England and Wales vary by the type of claim and the amount involved. For money claims, the fee ranges from £35 (claims up to £300) to 5% of the claim value (claims over £10,000, capped at £10,000). Online claims through MCOL (Money Claim Online) are slightly cheaper than paper claims.',
      'Other court fees include divorce petitions, probate applications, appeals and enforcement actions such as warrant of control or attachment of earnings. Fee exemptions and remissions are available if you receive certain benefits or have a low income — this is called Help with Fees (form EX160).',
      'This calculator covers the most common civil court fees and tells you whether you are likely to qualify for a fee remission. It does not cover criminal court costs or tribunal fees, which are calculated differently.',
    ],
    example: {
      title: 'Example: Money claim for £5,000',
      steps: [
        'Court fee for £5,000 claim (online): £205',
        'Court fee for £5,000 claim (paper): £205',
        'If the claim is defended, hearing fee: £170',
        'Total potential court costs: £375',
      ],
    },
    sourceUrl: 'https://www.gov.uk/court-fees-what-they-are',
    sourceName: 'GOV.UK — Court fees',
    lastUpdated: 'April 2026',
  },
  'probate-fee-calculator': {
    howItWorks: [
      'A grant of probate (or letters of administration if there is no will) gives legal authority to deal with a deceased person\'s estate. The application fee is £300 for estates valued above £5,000. Estates valued at £5,000 or below pay no fee. Additional copies of the grant cost £1.50 each.',
      'The fee applies to the gross value of the estate before debts are deducted. You need to estimate the total value of all assets — property, savings, investments, personal possessions — for the application. The executor or administrator is responsible for paying the fee, usually from estate funds.',
    ],
    example: {
      title: 'Example: Estate valued at £350,000',
      steps: [
        'Estate value: £350,000 (above £5,000 threshold)',
        'Probate application fee: £300',
        'Extra copies (3 recommended): 3 × £1.50 = £4.50',
        'Total probate cost: £304.50',
      ],
    },
    sourceUrl: 'https://www.gov.uk/applying-for-probate',
    sourceName: 'GOV.UK — Applying for probate',
    lastUpdated: 'April 2026',
  },
  'life-insurance-calculator': {
    howItWorks: [
      'Life insurance provides a tax-free lump sum to your dependants if you die during the policy term. The amount of cover you need typically includes your outstanding mortgage, other debts, income replacement for a set number of years and any specific costs such as children\'s education. A common rule of thumb is 10 times your annual salary, but individual circumstances vary.',
      'UK life insurance comes in two main forms: level term (fixed payout throughout the term) and decreasing term (payout reduces over time, matching a repayment mortgage). Level term is more expensive but provides consistent cover. Whole-of-life policies pay out whenever you die but cost significantly more and are mainly used for inheritance tax planning.',
      'Premiums depend on your age, health, smoker status, occupation and the amount and length of cover. Writing a policy in trust ensures the payout is not included in your estate for inheritance tax purposes and can speed up payment to beneficiaries.',
    ],
    example: {
      title: 'Example: Age 35, non-smoker, £250,000 mortgage, 2 children',
      steps: [
        'Mortgage cover needed: £250,000 (decreasing term, 25 years)',
        'Income replacement (10x salary): £400,000 (level term, 20 years)',
        'Total cover: £650,000 across two policies',
        'Estimated monthly premium: £35-£55',
        'Annual cost: £420-£660',
      ],
    },
    sourceUrl: 'https://www.moneyhelper.org.uk/en/everyday-money/insurance/do-you-need-life-insurance',
    sourceName: 'MoneyHelper — Life insurance guide',
    lastUpdated: 'April 2026',
  },
  'square-root-calculator': {
    howItWorks: [
      'The square root of a number x is the value that, when multiplied by itself, gives x. For example, the square root of 25 is 5 because 5 × 5 = 25. This calculator finds square roots, cube roots and nth roots for any positive number.',
      'Perfect squares (4, 9, 16, 25, 36 ...) have exact integer roots. Non-perfect squares produce irrational numbers — the calculator shows results to up to 10 decimal places. It also handles cube roots of negative numbers (e.g. the cube root of −27 is −3).',
    ],
    example: {
      title: 'Example: Square root of 144',
      steps: [
        '√144 = 12 (because 12 × 12 = 144)',
        '∛144 = 5.2415 (cube root)',
        '⁴√144 = 3.4641 (fourth root)',
      ],
    },
    sourceUrl: 'https://www.bbc.co.uk/bitesize/guides/zxsv97h/revision/2',
    sourceName: 'BBC Bitesize — Square and cube roots',
    lastUpdated: 'April 2026',
  },
  'fraction-calculator': {
    howItWorks: [
      'This calculator performs addition, subtraction, multiplication and division on fractions and mixed numbers. It automatically simplifies results to their lowest terms by dividing numerator and denominator by their greatest common divisor (GCD).',
      'To add or subtract fractions with different denominators, the calculator finds the least common denominator (LCD), converts both fractions, then combines the numerators. For multiplication, it multiplies numerators together and denominators together. For division, it multiplies by the reciprocal of the second fraction.',
      'Mixed numbers (like 2 3/4) are supported — the calculator converts them to improper fractions internally, performs the operation, then converts back. Results are shown as both an improper fraction and a mixed number where applicable.',
    ],
    example: {
      title: 'Example: Adding 2/3 + 3/4',
      steps: [
        'Find LCD of 3 and 4: LCD = 12',
        'Convert: 2/3 = 8/12 and 3/4 = 9/12',
        'Add numerators: 8 + 9 = 17',
        'Result: 17/12 = 1 5/12',
      ],
    },
    sourceUrl: 'https://www.bbc.co.uk/bitesize/topics/zsxhfg8',
    sourceName: 'BBC Bitesize — Fractions',
    lastUpdated: 'April 2026',
  },
  'lawn-seed-calculator': {
    howItWorks: [
      'Grass seed application rates depend on whether you are creating a new lawn or overseeding an existing one. For new lawns, the typical rate is 35\u201350 g per m\u00B2. For overseeding (repairing patches or thickening thin areas), 15\u201325 g per m\u00B2 is sufficient. Premium seed mixes with ryegrass tend to use higher rates; fine fescue mixes use lower rates.',
      'This calculator takes your lawn area and purpose to estimate the total weight of seed needed. It also accounts for different seed types: hard-wearing utility mixes (ideal for families and pets), fine ornamental mixes (for low-traffic lawns) and shade-tolerant mixes. Each has a slightly different recommended sowing rate.',
      'The best time to sow grass seed in the UK is April\u2013May or September\u2013October, when soil temperatures are above 8\u201310\u00B0C. Keep the area moist for 2\u20133 weeks after sowing. Enter your lawn dimensions and choose new lawn or overseed to see the quantity and estimated cost.',
    ],
    example: {
      title: 'Example: New lawn, 50 m\u00B2, hard-wearing utility mix',
      steps: [
        'Recommended rate: 40 g/m\u00B2',
        'Total seed: 50 \u00D7 40 = 2,000 g = 2 kg',
        'Add 10% for edges and uneven coverage: 2.2 kg',
        'Estimated cost: £15\u2013£25 for a 2.5 kg box',
      ],
    },
    sourceUrl: 'https://www.rhs.org.uk/lawns/seed',
    sourceName: 'RHS \u2014 Growing a lawn from seed',
    lastUpdated: 'April 2026',
  },
  'topsoil-calculator': {
    howItWorks: [
      'Topsoil quantity is calculated as area \u00D7 depth, converted to tonnes. Loose topsoil has a bulk density of approximately 1.3\u20131.5 t/m\u00B3. For new lawns, a minimum depth of 100\u2013150 mm of topsoil is recommended. Raised beds typically need 200\u2013300 mm depth, and border improvement needs 50\u2013100 mm mixed into existing soil.',
      'Topsoil quality in the UK is graded to BS 3882. General-purpose topsoil suits most garden uses; premium topsoil is screened to a finer grade for lawns and turf laying. The calculator shows volume in cubic metres, weight in tonnes and number of bulk bags (a standard bulk bag of topsoil is approximately 0.6 m\u00B3 or 0.8\u20131.0 tonnes).',
      'Enter the area and desired depth. The calculator shows quantity, estimated delivery cost (£30\u2013£55 per tonne for general purpose, £45\u2013£70 per tonne for premium screened) and the number of bulk bags. For large areas, loose-load delivery by tipper truck is more economical than bulk bags.',
    ],
    example: {
      title: 'Example: New lawn area 6 m \u00D7 4 m, 150 mm deep',
      steps: [
        'Area: 24 m\u00B2',
        'Volume: 24 \u00D7 0.15 = 3.6 m\u00B3',
        'Weight: 3.6 \u00D7 1.4 = 5.04 tonnes',
        'Bulk bags: 5.04 \u00F7 0.9 \u2248 5.6, order 6 bags',
        'Estimated cost: £200\u2013£340 delivered',
      ],
    },
    sourceUrl: 'https://www.rhs.org.uk/soil-composts-mulches/soil-types',
    sourceName: 'RHS \u2014 Soil types',
    lastUpdated: 'April 2026',
  },
  'paving-calculator': {
    howItWorks: [
      'Paving calculations divide the total area by the area of a single slab or paver block. Common UK paving slab sizes include 450 \u00D7 450 mm (approx. 5 per m\u00B2), 600 \u00D7 600 mm (approx. 2.8 per m\u00B2) and 600 \u00D7 300 mm (approx. 5.6 per m\u00B2). Block paving (200 \u00D7 100 mm) requires approximately 50 blocks per m\u00B2.',
      'Allow a 10 mm joint between slabs (reduces coverage slightly) and add 5\u201310% extra for cuts and breakage. The calculator also estimates sub-base material: a 100\u2013150 mm compacted Type 1 sub-base is standard for patios, while driveways need 150\u2013200 mm. A 25\u201340 mm mortar or sand bed sits on top.',
      'Enter the area dimensions, slab size and joint width. The calculator shows slabs needed, sand or mortar quantity, sub-base material in tonnes and estimated cost. For driveways over 5 m\u00B2 of impermeable paving, planning permission may be required unless you use permeable paving or drain to a lawn or border.',
    ],
    example: {
      title: 'Example: Patio 4 m \u00D7 3 m, 600 \u00D7 600 mm slabs, 10 mm joints',
      steps: [
        'Area: 12 m\u00B2',
        'Slabs per m\u00B2 (with joints): 2.7',
        'Total slabs: 12 \u00D7 2.7 = 32.4, round up to 33 + 5% = 35 slabs',
        'Sub-base (Type 1, 100 mm depth): 12 \u00D7 0.1 \u00D7 2.1 t/m\u00B3 \u2248 2.5 tonnes',
        'Mortar bed (30 mm): ~10 bags of sand-cement mix',
      ],
    },
    sourceUrl: 'https://www.gov.uk/government/publications/building-regulations-approved-document-h-drainage-and-waste-disposal',
    sourceName: 'GOV.UK \u2014 Building Regulations Approved Document H',
    lastUpdated: 'April 2026',
  },
  'ev-charging-calculator': {
    howItWorks: [
      'Electric vehicle charging costs depend on where and how you charge. Home charging using a 7 kW wallbox is the cheapest option at around 24-25p per kWh on a standard electricity tariff, or as low as 7-10p per kWh on an off-peak EV tariff (such as Octopus Go or Intelligent Octopus). A typical EV with a 60 kWh battery costs £14-£15 for a full charge at home on standard rates.',
      'Public rapid chargers (50-150 kW) are significantly more expensive, typically 60-80p per kWh, while ultra-rapid chargers (150-350 kW) can cost 70-85p per kWh. Workplace charging is often free or subsidised, and some supermarket chargers offer free slow charging while you shop.',
      'This calculator estimates your charging costs across different scenarios. It factors in your annual mileage, vehicle efficiency (miles per kWh), charging split between home and public, and your electricity tariff to give an accurate picture of running costs compared to petrol or diesel.',
    ],
    example: {
      title: 'Example: 10,000 miles/year, 3.5 miles/kWh efficiency',
      steps: [
        'Annual energy needed: 10,000 / 3.5 = 2,857 kWh',
        'Home charging (80% at 10p/kWh off-peak): 2,286 kWh x 10p = £228.60',
        'Public charging (20% at 70p/kWh): 571 kWh x 70p = £399.70',
        'Total annual charging cost: £628.30',
        'Equivalent petrol cost (40 MPG, £1.40/L): ~£1,591',
        'Annual saving vs petrol: ~£963',
      ],
    },
    sourceUrl: 'https://www.gov.uk/guidance/electric-vehicle-homecharge-scheme',
    sourceName: 'GOV.UK — Electric Vehicle Homecharge Scheme',
    lastUpdated: 'April 2026',
  },
  'commute-cost-calculator': {
    howItWorks: [
      'The true cost of commuting goes beyond fuel or a train ticket. A full cost calculation includes fuel or fares, parking, vehicle wear and tear, insurance increase for commuting cover, and the opportunity cost of your time. The average UK commuter spends 59 minutes per day travelling, which over a year adds up to around 230 hours of unpaid time.',
      'Car commuting costs typically include fuel (14-18p per mile for petrol), wear and tear (5-8p per mile), parking (£5-£20/day in town centres), insurance uplift for commuting cover and congestion charges if applicable. Train commuting involves season ticket costs, which offer significant discounts over daily tickets for regular travel.',
      'This calculator compares the total cost of commuting by car, train and bus for your specific journey. It includes an option to value your commuting time at an hourly rate, showing the true economic cost of different commuting methods. Working from home days are factored in to reduce annual costs.',
    ],
    example: {
      title: 'Example: 25-mile each way commute, 4 days/week',
      steps: [
        'Car: 50 miles/day x 20p/mile = £10/day + £8 parking = £18/day',
        'Annual car commute (48 weeks): £3,456',
        'Train season ticket: £3,200/year',
        'Time cost: 1.5 hours/day x £20/hour x 192 days = £5,760',
        'Total true cost (train): £3,200 + £5,760 = £8,960/year',
      ],
    },
    sourceUrl: 'https://www.gov.uk/government/publications/rates-and-allowances-travel-mileage-and-fuel-allowances',
    sourceName: 'HMRC — Mileage allowances',
    lastUpdated: 'April 2026',
  },
  'mileage-allowance-calculator': {
    howItWorks: [
      'Approved Mileage Allowance Payments cover four vehicle categories, each with a fixed per-mile rate set by HMRC. Cars and vans receive 45p per mile up to 10,000 miles and 25p thereafter. Motorcycles are paid at a flat 24p per mile regardless of distance. Bicycles attract 20p per mile with no tiered threshold. These rates apply for the entire 2026/27 tax year.',
      'Passenger payments add a further 5p per mile for each fellow employee carried on a qualifying business journey. This passenger supplement applies to car and van journeys only and is received tax-free by the driver. The passenger does not need to claim separately provided they travel in the same vehicle on the same qualifying trip.',
      'Self-employed individuals cannot use AMAP rates for tax deductions. Instead, they must choose between claiming actual vehicle running costs (fuel, insurance, repairs, depreciation) with appropriate business-use proportion, or using HMRC\'s simplified flat-rate mileage expenses. Once a method is chosen for a particular vehicle, it must be used for the vehicle\'s lifetime in the business.'
    ],
    example: {
      title: 'Mixed vehicle mileage allowance for a tax year',
      steps: [
        'Car journeys: 8,500 business miles at 45p = £3,825',
        'Passenger supplement: colleague carried for 3,200 of those miles at 5p = £160',
        'Motorcycle journeys: 1,200 miles at 24p = £288',
        'Bicycle journeys: 400 miles at 20p = £80',
        'Total tax-free mileage allowance: £3,825 + £160 + £288 + £80 = £4,353'
      ]
    },
    sourceUrl: 'https://www.gov.uk/government/publications/rates-and-allowances-travel-mileage-and-fuel-allowances/travel-mileage-and-fuel-rates-and-allowances',
    sourceName: 'HMRC - Travel Mileage and Fuel Rates',
    lastUpdated: 'April 2026',
  },
  'radiator-btu-calculator': {
    howItWorks: [
      'Radiator sizing is calculated in BTU/h (British Thermal Units per hour). The base calculation multiplies room volume (length \u00D7 width \u00D7 height in metres \u00D7 a base factor of about 153 BTU per m\u00B3). This is then adjusted for room characteristics: external walls, window type and size, insulation level, location in the house and desired temperature.',
      'Common correction factors include: +15% for each external wall, +20% for single-glazed windows (or \u221210% for triple glazing), +15% for rooms above a garage or unheated space, and +10\u201315% for north-facing rooms. Bathrooms typically require a higher target temperature (22\u00B0C versus 21\u00B0C for living rooms).',
      'Enter room dimensions and characteristics. The calculator shows the total BTU/h requirement and suggests appropriate radiator sizes. Most UK radiator manufacturers publish BTU outputs at Delta T50 (the standard comparison condition). If your system runs at a lower flow temperature (e.g. with a heat pump), you will need larger radiators.',
    ],
    example: {
      title: 'Example: Living room 5 m \u00D7 4 m \u00D7 2.4 m, 2 external walls, double glazing',
      steps: [
        'Volume: 5 \u00D7 4 \u00D7 2.4 = 48 m\u00B3',
        'Base BTU: 48 \u00D7 153 = 7,344 BTU/h',
        'Two external walls (+15% each): \u00D7 1.30 = 9,547 BTU/h',
        'Double glazing (no adjustment): 9,547 BTU/h',
        'Recommended: radiator(s) totalling ~10,000 BTU/h',
      ],
    },
    sourceUrl: 'https://www.gov.uk/government/publications/building-regulations-approved-document-l-conservation-of-fuel-and-power',
    sourceName: 'GOV.UK \u2014 Building Regulations Approved Document L',
    lastUpdated: 'April 2026',
  },
  'bricks-calculator': {
    howItWorks: [
      'The number of bricks needed depends on wall area, brick size and bond pattern. Standard UK bricks measure 215 \u00D7 102.5 \u00D7 65 mm. With a 10 mm mortar joint, you need approximately 60 bricks per square metre for a half-brick wall (single skin) in stretcher bond. A full-brick (one-brick) wall uses about 120 per m\u00B2.',
      'This calculator takes your wall dimensions, subtracts openings (doors, windows) and applies the correct rate per square metre. It also adds a wastage allowance \u2014 typically 5% for straightforward walls and 10% if there is significant cutting (such as around window reveals or corners with Flemish bond).',
      'Enter the wall length, height, and the size of any openings. Choose the bond pattern and wall thickness. The calculator shows total bricks needed, bags of mortar (approximately 1 bag of cement per 35\u201340 bricks) and estimated cost. For large projects, order a sample panel first to confirm the brick choice and mortar colour.',
    ],
    example: {
      title: 'Example: Garden wall 6 m long \u00D7 1.2 m high, half-brick, one door opening 0.9 m \u00D7 2 m',
      steps: [
        'Total wall area: 6 \u00D7 1.2 = 7.2 m\u00B2',
        'Less opening: 0.9 \u00D7 1.2 (within wall height) = 1.08 m\u00B2',
        'Net area: 6.12 m\u00B2 \u00D7 60 bricks/m\u00B2 = 367 bricks',
        'Add 5% wastage: 386 bricks \u2014 order 400',
      ],
    },
    sourceUrl: 'https://www.gov.uk/government/publications/building-regulations-approved-document-a-structure',
    sourceName: 'GOV.UK \u2014 Building Regulations Approved Document A',
    lastUpdated: 'April 2026',
  },
  'pace-calculator': {
    howItWorks: [
      'A pace calculator converts between pace (minutes per mile or km), speed and finish time for a given distance. If you know two of these three values, the calculator works out the third. Common UK race distances include parkrun (5 km), 10 km, half marathon (21.1 km) and marathon (42.2 km).',
      'The calculator also generates split times for each kilometre or mile, which is useful for even pacing during a race. It can predict finish times for other distances using the Riegel formula, which estimates that pace slows by a known factor as distance increases.',
      'Enter a distance and either your target time or pace. The calculator shows pace per km and per mile, average speed in km/h and mph, split tables and predicted finish times for standard distances. This helps with race planning and setting realistic targets based on training performance.',
    ],
    example: {
      title: 'Example: Half marathon in 1 hour 50 minutes',
      steps: [
        'Distance: 21.1 km',
        'Pace: 110 min \u00F7 21.1 km = 5:13/km (8:23/mile)',
        'Speed: 11.5 km/h (7.15 mph)',
        'Predicted 10 km time: ~51:30',
        'Predicted marathon time: ~3:51:00',
      ],
    },
    sourceUrl: 'https://www.nhs.uk/live-well/exercise/running-and-aerobic-exercises/get-running-with-couch-to-5k/',
    sourceName: 'NHS \u2014 Couch to 5K',
    lastUpdated: 'April 2026',
  },
  'water-intake-calculator': {
    howItWorks: [
      'Daily water needs depend on body weight, activity level, climate and overall health. A common starting point is 30\u201335 ml per kilogram of body weight. The NHS recommends 6\u20138 glasses (approximately 1.2 litres) of fluid per day as a minimum, though active people and those in warm climates need considerably more.',
      'This calculator uses your weight and activity level to estimate a personalised daily target in litres. Exercise adds roughly 500\u20131,000 ml per hour of moderate-to-vigorous activity. Hot or humid weather, illness with fever, and pregnancy or breastfeeding all increase requirements further.',
      'All fluids count towards your total, including tea, coffee, milk and juice, as well as water from food (fruit, vegetables and soups contribute roughly 20% of daily intake). Caffeinated drinks do count, despite common myths \u2014 their mild diuretic effect is offset by the fluid they provide.',
    ],
    example: {
      title: 'Example: 75 kg, moderately active (gym 3 times/week)',
      steps: [
        'Base intake: 75 \u00D7 35 ml = 2,625 ml',
        'Activity addition (3 sessions/week average): +350 ml/day',
        'Recommended daily intake: ~3.0 litres',
        'Equivalent to roughly 12\u201313 glasses (250 ml each)',
      ],
    },
    sourceUrl: 'https://www.nhs.uk/live-well/eat-well/food-guidelines-and-food-labels/water-drinks-nutrition/',
    sourceName: 'NHS \u2014 Water, drinks and hydration',
    lastUpdated: 'April 2026',
  },
  'overdraft-cost-calculator': {
    howItWorks: [
      'Since April 2020, FCA rules require UK banks to charge a single annual interest rate (EAR) on arranged overdrafts, with no daily or monthly fees. Most major banks charge between 35% and 40% EAR. This replaced the old system of daily fees plus interest that made costs difficult to compare.',
      'Unarranged overdrafts can no longer attract higher charges than arranged overdrafts. However, banks may still refuse transactions that would take you beyond your arranged limit. If your account goes into an unarranged overdraft, you are charged the same EAR as the arranged rate.',
      'This calculator shows the daily and monthly cost of using your overdraft at a given EAR and balance. It helps you compare whether an overdraft is cheaper or more expensive than alternatives such as a credit card or personal loan for short-term borrowing.',
    ],
    example: {
      title: 'Example: £1,000 overdraft at 39.9% EAR',
      steps: [
        'Daily equivalent rate: 39.9% ÷ 365 = approx. 0.109% per day',
        'Cost for one month (30 days): approx. £32.70',
        'Cost for three months: approx. £98.10',
        'Annual cost if balance remains at £1,000: approx. £399',
      ],
    },
    sourceUrl: 'https://www.fca.org.uk/consumers/overdrafts',
    sourceName: 'FCA — Overdrafts',
    lastUpdated: 'April 2026',
  },
  'debt-free-calculator': {
    howItWorks: [
      'The debt-free calculator projects when you will pay off all your debts based on your current balances, interest rates and monthly payments. It supports two common repayment strategies: the avalanche method (highest interest rate first) and the snowball method (smallest balance first).',
      'With the avalanche method, you direct all spare cash to the debt with the highest interest rate while making minimum payments on the rest. Once that debt is cleared, you roll its payment into the next highest rate. This approach minimises total interest paid.',
      'The snowball method targets the smallest balance first for quick psychological wins. While it costs slightly more in interest, research suggests people using the snowball method are more likely to stick with their repayment plan and become debt free sooner in practice.',
    ],
    example: {
      title: 'Example: Three debts, £500/month total budget',
      steps: [
        'Credit card: £4,000 at 21% — minimum £100/month',
        'Personal loan: £6,000 at 8% — minimum £150/month',
        'Car finance: £3,000 at 5% — minimum £120/month',
        'Avalanche method: debt free in 30 months, total interest £1,820',
        'Snowball method: debt free in 31 months, total interest £1,950',
      ],
    },
    sourceUrl: 'https://www.moneyhelper.org.uk/en/everyday-money/credit/how-to-prioritise-your-debts',
    sourceName: 'MoneyHelper — How to prioritise your debts',
    lastUpdated: 'April 2026',
  },
  'car-finance-calculator': {
    howItWorks: [
      'The three main car finance options in the UK are Personal Contract Purchase (PCP), Hire Purchase (HP) and personal loans. PCP has low monthly payments because you only finance the depreciation, with a large optional final "balloon" payment to own the car. HP spreads the full cost over fixed monthly payments with no balloon, and you own the car at the end.',
      'With PCP, you typically put down a 10% deposit, pay monthly for 3-4 years, then choose to make the final payment, hand the car back or use any equity as a deposit on a new deal. Annual mileage limits (usually 8,000-12,000 miles) apply, with excess mileage charges of 5-15p per mile. HP has no mileage restrictions.',
      'Personal loans from banks can be cheaper than dealer finance in total cost because there are no arrangement fees and you own the car outright from day one. This calculator compares all three options side by side, showing monthly payments, total cost of ownership and the effective APR for each.',
      'PCP explained in depth. Personal Contract Purchase is the most popular UK car finance product, accounting for ~80% of new car finance. You pay an initial deposit (usually 10-20%), monthly payments for 24-48 months, then choose one of three options at the end: (1) pay the Guaranteed Future Value (GFV) balloon to own the car outright, (2) hand the car back with no further cost (subject to mileage and condition), or (3) part-exchange the equity (current market value minus GFV) into a new PCP deal. The Annual Mileage you agree at the start matters — exceed it and you pay an excess mileage charge of 5-30p per mile.',
      'Hire Purchase vs PCP — which to choose? HP is simpler: you pay deposit + monthly payments that include all the car\'s value (no balloon), and you own it at the end after a final \'option to purchase\' fee (usually £1-£99). HP monthly payments are higher than PCP for the same car, but the total cost is usually lower because you\'re not financing the entire car\'s value (just the depreciation, plus interest on the balloon you\'ll either pay or hand back). Choose HP if you want to own the car long-term and keep payments simple. Choose PCP for lower monthly payments and the flexibility to change every 3 years.',
      'The mis-sold car finance scandal. Between 2007 and 28 January 2021, many dealers earned higher commission by quoting customers higher interest rates — \'Discretionary Commission Arrangements\' (DCAs). The FCA banned DCAs from 2021. In October 2024, the Court of Appeal ruled in Johnson v FirstRand Bank that this practice was unlawful where the commission was not properly disclosed. The Supreme Court is expected to rule in 2026 on whether mass compensation must be paid — estimates range from £6 billion to over £30 billion. If you took out PCP or HP between 2007 and 2021, you may be eligible for a refund plus 8% statutory interest. Check with your lender (Black Horse/Lloyds, Motonovo, Close Brothers, BMW Financial Services, Mercedes-Benz Financial, etc.).',
      '<a href="/calculator/car-finance-calculator/" class="text-primary underline">Voluntary Termination</a> (VT) — your statutory right to walk away. Under section 99 of the Consumer Credit Act 1974, you can terminate a PCP or HP agreement once you have paid (or are willing to pay) 50% of the total amount payable (including interest, deposit, and the GFV balloon). The car is collected, you owe nothing further (subject to fair wear and tear). VT is reported to credit agencies similarly to a settled account, not as a default — so it has minimal impact on your credit score. This is invaluable if your circumstances change (job loss, relocation) and you cannot afford the payments.',
      'GAP insurance after the FCA reforms. Guaranteed Asset Protection insurance covers the gap between your motor insurance payout (which is based on current market value) and your outstanding finance balance if the car is written off or stolen. New cars depreciate 20-30% in the first year, so the finance balance can easily exceed the car\'s value. The FCA paused all GAP sales in February 2024 over fair value concerns — most policies were paying out only 6% of premiums. After insurers reformed pricing, GAP sales restarted at lower prices (typically £150-£300 for a 3-year policy). It\'s worthwhile on new PCP deals where you\'ll be in negative equity for years; less useful on used HP or older cars.',
    ],
    example: {
      title: 'Example: £25,000 car, £2,500 deposit, 4-year term',
      steps: [
        'PCP (6.9% APR): £280/month + £9,500 balloon = £22,940 total',
        'HP (6.9% APR): £530/month = £27,940 total (own at end)',
        'Personal loan (5.9% APR): £516/month = £27,268 total (own at start)',
        'PCP is cheapest monthly but most expensive if you buy at end',
        'Loan is cheapest overall total cost',
      ],
    },
    sourceUrl: 'https://www.fca.org.uk/consumers/car-finance',
    sourceName: 'FCA — Car finance',
    lastUpdated: 'April 2026',
  },
  'heat-pump-calculator': {
    howItWorks: [
      'Heat pumps extract heat from outdoor air (air source) or the ground (ground source) and deliver it to your home. They are highly efficient, producing 2.5-4 units of heat for every unit of electricity consumed. This ratio is the Coefficient of Performance (COP). A heat pump with a COP of 3 produces 3 kWh of heat for each 1 kWh of electricity used.',
      'An air source heat pump (ASHP) typically costs £8,000-£15,000 installed, while a ground source heat pump (GSHP) costs £15,000-£35,000 including ground works. The Boiler Upgrade Scheme provides a £7,500 grant towards the cost of an ASHP or GSHP, reducing the upfront cost significantly.',
      'Running costs depend on your electricity tariff and the heat pump\'s seasonal COP (SCOP). At 24.5p/kWh electricity and a SCOP of 3, the effective heating cost is 8.2p per kWh of heat — compared to 7.5p per kWh for a 90% efficient gas boiler at 6.76p/kWh gas. Heat pumps become more cost-effective on low-rate tariffs or paired with solar panels.',
    ],
    example: {
      title: 'Example: 3-bed detached, replacing gas boiler with ASHP',
      steps: [
        'Heat demand: 12,000 kWh/year',
        'ASHP electricity needed (COP 3): 4,000 kWh',
        'Electricity cost: 4,000 x 24.5p = £980',
        'Previous gas cost: 12,000 / 0.9 x 6.76p = £901',
        'ASHP install cost: £12,000 minus £7,500 BUS grant = £4,500',
        'Payback vs gas: break-even depends on tariff and gas price trends',
      ],
    },
    sourceUrl: 'https://www.gov.uk/apply-boiler-upgrade-scheme',
    sourceName: 'GOV.UK — Boiler Upgrade Scheme',
    lastUpdated: 'April 2026',
  },
  'savings-goal-calculator': {
    howItWorks: [
      'The savings goal calculation solves for one unknown variable given the others. To find the monthly saving needed, it rearranges the future value of an annuity formula: PMT = FV x (r/12) / [((1 + r/12)^(12n) - 1)], where FV is the target amount, r is the annual interest rate, and n is the number of years. This accounts for compound interest on each monthly deposit, giving a lower required saving than simple division of target by months.',
      'To find the time to reach a goal given a fixed monthly saving, the formula is rearranged to solve for n: n = ln(1 + FV x r / (12 x PMT)) / (12 x ln(1 + r/12)). At 0% interest, saving £500/month to reach £30,000 takes exactly 60 months. At 4% AER, compound interest reduces this to approximately 56 months, saving the equivalent of 2 months of contributions.',
      'The calculator also handles lump sum starting balances combined with regular contributions. If you already have £5,000 saved toward a £25,000 goal, the lump sum compounds separately while monthly contributions accumulate. Inflation adjustment shows whether your target amount will have the same purchasing power by the time you reach it — a £30,000 target in 5 years needs to be £34,400 at 2.8% inflation to maintain equivalent value.'
    ],
    example: {
      title: 'Monthly saving needed for a £15,000 car fund in 3 years',
      steps: [
        'Target amount: £15,000',
        'Time frame: 3 years (36 months)',
        'Savings account rate: 4.2% AER',
        'Required monthly saving: £15,000 / FV annuity factor = £393/month',
        'Without interest (simple division): £15,000 / 36 = £417/month — interest saves £24/month'
      ]
    },
    sourceUrl: 'https://www.gov.uk/government/publications/state-of-the-nation-report',
    sourceName: 'GOV.UK',
    lastUpdated: 'April 2026',
  },
  'number-to-words-calculator': {
    howItWorks: [
      'This calculator converts numerical digits into their written English form, following UK conventions. It uses "and" before the tens (e.g. "one hundred and twenty-three") and supports values up to trillions. It is most commonly used when writing cheques or legal documents where the amount must be spelled out.',
      'UK English uses "billion" to mean one thousand million (1,000,000,000), the same as US English. The older British "long scale" where a billion meant a million million is no longer in standard use. The calculator follows modern UK usage throughout.',
    ],
    example: {
      title: 'Example: Converting £2,547.83',
      steps: [
        'Pounds: two thousand five hundred and forty-seven',
        'Pence: eighty-three',
        'Cheque format: Two thousand five hundred and forty-seven pounds and eighty-three pence',
      ],
    },
    sourceUrl: 'https://www.gov.uk/guidance/style-guide/a-to-z-of-gov-uk-style#numbers',
    sourceName: 'GOV.UK — Style guide: Numbers',
    lastUpdated: 'April 2026',
  },
  'random-number-generator': {
    howItWorks: [
      'This tool generates random numbers within a range you specify. It uses a cryptographically secure pseudorandom number generator (CSPRNG) to ensure results are fair and unbiased. You can generate a single number or a set of multiple numbers, with or without repetition.',
      'Common uses include raffle draws, lottery number selection, random sampling for surveys, assigning random groups and settling decisions fairly. The generator can also produce random dice rolls, coin flips and card draws with correct probability distributions.',
    ],
    example: {
      title: 'Example: Generating lottery numbers',
      steps: [
        'Range: 1 to 59 (UK Lotto)',
        'Quantity: 6 numbers, no repeats',
        'Result: e.g. 7, 14, 22, 35, 41, 53',
        'Each draw is independent and equally likely',
      ],
    },
    sourceUrl: 'https://www.national-lottery.co.uk/games/lotto',
    sourceName: 'National Lottery — Lotto',
    lastUpdated: 'April 2026',
  },
  'shoe-size-converter': {
    howItWorks: [
      'UK shoe sizes use a different scale from US and EU sizes. UK sizes start from 0 for infants and increase in increments of one-third of an inch (8.47 mm). EU sizes follow the Paris point system where each size is 6.67 mm. US sizes are offset from UK sizes by approximately 1 for men and 2 for women.',
      'This converter handles men\'s, women\'s and children\'s sizes across UK, US and EU systems. Half sizes are supported. It also shows the corresponding foot length in centimetres for each size, which is the most accurate way to find your correct size across systems.',
    ],
    example: {
      title: 'Example: UK men\'s size 9',
      steps: [
        'UK 9 = US 10',
        'UK 9 = EU 43',
        'Foot length: approx. 27.5 cm',
      ],
    },
    sourceUrl: 'https://www.nhs.uk/live-well/healthy-body/choosing-shoes-for-your-child/',
    sourceName: 'NHS — Choosing the right shoes',
    lastUpdated: 'April 2026',
  },
  'ratio-calculator': {
    howItWorks: [
      'A ratio compares two or more quantities. This calculator simplifies ratios to their lowest terms, scales them up or down, and solves for an unknown value in a proportion. Enter values separated by colons (e.g. 12:8) to simplify, or enter three of four values in a proportion to find the missing one.',
      'Ratios are used in cooking (scaling recipes), construction (mixing concrete at 1:2:3), finance (price-to-earnings ratios) and map reading (1:50,000 scale). The calculator shows the GCD used for simplification and the cross-multiplication step used for solving proportions.',
    ],
    example: {
      title: 'Example: Simplify 45:60 and scale a recipe',
      steps: [
        'GCD of 45 and 60 = 15',
        '45:60 simplifies to 3:4',
        'Recipe calls for 200 g flour at 3:4 ratio with sugar',
        'Sugar needed: 200 × (4/3) = 266.67 g',
      ],
    },
    sourceUrl: 'https://www.bbc.co.uk/bitesize/guides/zfbqj6f/revision/1',
    sourceName: 'BBC Bitesize — Ratios',
    lastUpdated: 'April 2026',
  },
  'standard-deviation-calculator': {
    howItWorks: [
      'Standard deviation measures how spread out values are from the mean (average) of a data set. A low standard deviation means values cluster tightly around the mean, while a high standard deviation indicates wide dispersion. It is one of the most commonly used statistics in science, business and social research.',
      'The calculator computes both population standard deviation (σ) and sample standard deviation (s). The sample version divides by n−1 (Bessel\'s correction) to give an unbiased estimate when your data is a subset of a larger population. It also shows variance, mean, range and sum.',
      'Enter your numbers separated by commas or spaces. The calculator handles data sets of any size and displays each step of the calculation: mean, deviations from mean, squared deviations, sum of squares and the final standard deviation.',
    ],
    example: {
      title: 'Example: Data set {4, 8, 6, 5, 3}',
      steps: [
        'Mean: (4+8+6+5+3) ÷ 5 = 5.2',
        'Deviations: −1.2, 2.8, 0.8, −0.2, −2.2',
        'Squared deviations: 1.44, 7.84, 0.64, 0.04, 4.84',
        'Population std dev (σ): √(14.8 ÷ 5) = 1.72',
        'Sample std dev (s): √(14.8 ÷ 4) = 1.92',
      ],
    },
    sourceUrl: 'https://www.bbc.co.uk/bitesize/guides/z3nygdm/revision/4',
    sourceName: 'BBC Bitesize — Standard deviation',
    lastUpdated: 'April 2026',
  },
  'ucas-points-calculator': {
    howItWorks: [
      'UCAS tariff points provide a standard way to compare qualifications from different awarding bodies. An A-level A* is worth 56 points, an A is 48, a B is 40, a C is 32, a D is 24 and an E is 16. BTEC qualifications, Scottish Highers, the International Baccalaureate and other approved qualifications each have their own tariff values.',
      'Not all universities use UCAS points for admissions \u2014 many (including Russell Group institutions) make offers in terms of specific grades rather than points. However, some universities set entry requirements as a tariff total (for example, 112 UCAS points), giving applicants flexibility in how they achieve the target.',
      'Enter your qualifications and grades. The calculator converts each to UCAS tariff points and shows your total. It also lists common entry requirements and whether your total meets them. Remember that some courses require specific subjects regardless of overall points.',
    ],
    example: {
      title: 'Example: A-level grades A*, B, B',
      steps: [
        'A* = 56 points',
        'B = 40 points',
        'B = 40 points',
        'Total UCAS tariff points: 136',
        'Meets typical requirements: 112 points (yes), 128 points (yes), 144 points (no)',
      ],
    },
    sourceUrl: 'https://www.ucas.com/undergraduate/what-and-where-to-study/entry-requirements/ucas-tariff-points',
    sourceName: 'UCAS \u2014 UCAS tariff points',
    lastUpdated: 'April 2026',
  },
  'speed-fine-calculator': {
    howItWorks: [
      'Speeding fines in England and Wales are calculated using a banding system based on how far over the speed limit you were driving. Band A (1-10 mph over in a 30 zone equivalent) starts at 25-75% of weekly income. Band B (11-20 mph over) is 75-125% of weekly income. Band C (21+ mph over) is 125-175% of weekly income with possible disqualification.',
      'The minimum fine is £100 with 3 penalty points. In some cases of minor speeding, you may be offered a speed awareness course (typically £100, no points) instead of prosecution. Penalty points range from 3-6, and accumulating 12 points within 3 years results in a minimum 6-month driving ban.',
      'Fines are capped at £1,000 (or £2,500 on a motorway). Aggravating factors such as poor road conditions, driving near schools or previous convictions can push the fine towards the top of the band. This calculator estimates the likely fine and points based on the speed recorded, the speed limit and your circumstances.',
    ],
    example: {
      title: 'Example: 42 mph in a 30 mph zone, Band B',
      steps: [
        'Speed over limit: 12 mph (Band B)',
        'Starting point: 100% of weekly income',
        'Weekly income: £600',
        'Base fine: £600',
        'Penalty points: 4-6',
        'Speed awareness course alternative (if offered): £100, no points',
      ],
    },
    sourceUrl: 'https://www.gov.uk/speeding-penalties',
    sourceName: 'GOV.UK — Speeding penalties',
    lastUpdated: 'April 2026',
  },
  'binary-converter': {
    howItWorks: [
      'Binary (base-2) uses only 0 and 1 to represent numbers. Each position represents a power of 2, starting from the right: 1, 2, 4, 8, 16 and so on. This converter translates between binary, decimal (base-10), octal (base-8) and hexadecimal (base-16).',
      'Binary is the foundation of all digital computing — every piece of data in a computer is ultimately stored as a sequence of binary digits (bits). Hexadecimal is commonly used in programming as a shorthand for binary, where each hex digit represents exactly four bits.',
    ],
    example: {
      title: 'Example: Converting decimal 255',
      steps: [
        'Decimal 255 = Binary 11111111',
        'Decimal 255 = Octal 377',
        'Decimal 255 = Hexadecimal FF',
        '11111111 in binary = 128+64+32+16+8+4+2+1 = 255',
      ],
    },
    sourceUrl: 'https://www.bbc.co.uk/bitesize/guides/zwsbwmn/revision/1',
    sourceName: 'BBC Bitesize — Binary and data representation',
    lastUpdated: 'April 2026',
  },
  'mulch-calculator': {
    howItWorks: [
      'Mulch volume is calculated as area \u00D7 depth. The RHS recommends applying organic mulch (bark, wood chip, garden compost) to a depth of 50\u201375 mm (5\u20137.5 cm). This depth suppresses weeds, retains moisture and insulates roots without smothering the soil. For gravel mulch, 25\u201340 mm is usually sufficient.',
      'This calculator shows volume in cubic metres, litres and the number of bags needed. Standard bags are 50\u201380 litres; bulk bags hold approximately 0.5\u20131.0 m\u00B3. Bark mulch weighs roughly 300\u2013400 kg per m\u00B3 loose; composted material is heavier at 500\u2013700 kg per m\u00B3.',
      'Enter the bed area and desired depth. The calculator shows total volume, bags or bulk bags needed and estimated cost. Apply mulch in late spring after the soil has warmed, or in autumn. Keep mulch 5\u201310 cm away from plant stems and tree trunks to prevent rot.',
    ],
    example: {
      title: 'Example: Border beds 18 m\u00B2 total area, 75 mm bark mulch',
      steps: [
        'Volume: 18 \u00D7 0.075 = 1.35 m\u00B3 (1,350 litres)',
        'Bags (70 L each): 1,350 \u00F7 70 = 19.3, round to 20 bags',
        'Or 2 bulk bags (0.7 m\u00B3 each)',
        'Estimated cost: £80\u2013£120 (bags) or £60\u2013£90 (bulk)',
      ],
    },
    sourceUrl: 'https://www.rhs.org.uk/soil-composts-mulches/mulch',
    sourceName: 'RHS \u2014 Mulching',
    lastUpdated: 'April 2026',
  },
  'ideal-weight-calculator': {
    howItWorks: [
      'This calculator estimates your ideal weight range using several established formulas. The BMI method defines a healthy range as a BMI between 18.5 and 24.9. The Devine formula (1974) and Robinson formula (1983) each use height to produce a single ideal weight figure, originally developed for drug-dosing calculations.',
      'For a given height, the calculator shows the healthy BMI weight range alongside the Devine and Robinson estimates. No single number is definitive \u2014 body composition, frame size and ethnicity all influence what is healthy for you. The NHS uses BMI as a screening tool but acknowledges its limitations for muscular builds.',
      'Enter your height and sex to see all three estimates. The results give a reasonable target range rather than a single figure. If you are concerned about your weight, your GP can take body composition, waist circumference and medical history into account for a fuller assessment.',
    ],
    example: {
      title: 'Example: Male, 178 cm (5\'10")',
      steps: [
        'BMI healthy range (18.5\u201324.9): 58.6\u201378.9 kg',
        'Devine formula: 73.5 kg',
        'Robinson formula: 72.6 kg',
        'Suggested target range: 68\u201379 kg',
      ],
    },
    sourceUrl: 'https://www.nhs.uk/live-well/healthy-weight/bmi-calculator/',
    sourceName: 'NHS \u2014 BMI healthy weight calculator',
    lastUpdated: 'April 2026',
  },
  'fertiliser-calculator': {
    howItWorks: [
      'Fertiliser application rates are specified on the product packaging in grams per square metre (g/m\u00B2). Common UK lawn fertilisers recommend 35\u201370 g/m\u00B2 depending on the product and season. Spring/summer feeds are nitrogen-rich (for growth), while autumn feeds are higher in potassium (for root strength and disease resistance).',
      'This calculator takes your lawn or garden area and the product\'s recommended application rate to calculate the total weight needed. Applying too much fertiliser risks scorching the grass or causing excessive soft growth that is vulnerable to disease. Always weigh the product rather than estimating by hand.',
      'Enter the area and application rate (from the product label). The calculator shows total weight, number of boxes or bags needed and coverage. For liquid feeds, it converts to litres of diluted solution. Water the lawn before applying granular fertiliser and again lightly afterwards to help it reach the roots.',
    ],
    example: {
      title: 'Example: Lawn 80 m\u00B2, spring feed at 50 g/m\u00B2',
      steps: [
        'Total fertiliser: 80 \u00D7 50 = 4,000 g = 4 kg',
        'Standard box covers 100 m\u00B2: 1 box is sufficient',
        'Apply with a spreader for even distribution',
        'Water in lightly if no rain within 24 hours',
      ],
    },
    sourceUrl: 'https://www.rhs.org.uk/soil-composts-mulches/fertilisers',
    sourceName: 'RHS \u2014 Fertilisers',
    lastUpdated: 'April 2026',
  },
  'crop-yield-calculator': {
    howItWorks: [
      'UK crop yields vary by crop type, soil quality, region, weather and farming practices. Average yields in recent years: winter wheat 8.0–8.5 t/ha, winter barley 6.5–7.0 t/ha, spring barley 5.5–6.0 t/ha, oilseed rape 3.0–3.5 t/ha and potatoes 40–45 t/ha. These figures come from Defra\'s annual harvest reports.',
      'This calculator estimates total yield and gross output value based on your field area, crop type and expected yield per hectare. You can adjust the yield figure to reflect your farm\'s historical performance or local conditions. It also shows the gross margin when you enter your variable costs per hectare.',
      'Yield is affected by many factors including seed variety, sowing date, soil type, rainfall, fertiliser regime and pest/disease pressure. The calculator uses national averages as a baseline, which you can adjust upward or downward based on your own situation.',
    ],
    example: {
      title: 'Example: 50 hectares of winter wheat',
      steps: [
        'Area: 50 ha',
        'Expected yield: 8.2 t/ha',
        'Total harvest: 410 tonnes',
        'Price at £200/t: gross output = £82,000',
        'Variable costs at £650/ha: £32,500 → gross margin = £49,500',
      ],
    },
    sourceUrl: 'https://www.gov.uk/government/statistics/cereal-and-oilseed-rape-production',
    sourceName: 'Defra — Cereal and oilseed production statistics',
    lastUpdated: 'April 2026',
  },
  'break-even-calculator': {
    howItWorks: [
      'Break-even analysis determines the exact sales volume at which total revenue equals total costs, producing zero profit and zero loss. The core formula is: Break-even units = Fixed costs \u00f7 Contribution margin per unit. The contribution margin per unit equals the selling price minus the variable cost per unit\u2014this represents how much each sale contributes toward covering fixed overheads.',
      'Fixed costs are expenses that remain constant regardless of output\u2014rent, salaries, insurance, loan repayments. Variable costs change in direct proportion to production volume\u2014raw materials, packaging, direct labour, shipping per unit. Accurately separating these two categories is critical; misclassifying a variable cost as fixed will skew your break-even point significantly.',
      'Beyond the unit-based break-even, the revenue-based break-even equals Fixed costs \u00f7 Contribution margin ratio, where the ratio is (Selling price \u2212 Variable cost) \u00f7 Selling price. This is useful for businesses selling multiple products at varying prices. Sensitivity analysis\u2014adjusting price, costs, or volume\u2014reveals how fragile or robust your margin is against market changes.'
    ],
    example: {
      title: 'Break-even for a UK candle business',
      steps: [
        'Fixed costs (rent, insurance, website): \u00a32,400 per month.',
        'Selling price per candle: \u00a318.00.',
        'Variable cost per candle (wax, wick, jar, label, postage): \u00a36.50.',
        'Contribution margin: \u00a318.00 \u2212 \u00a36.50 = \u00a311.50 per candle.',
        'Break-even units: \u00a32,400 \u00f7 \u00a311.50 = 209 candles per month (rounded up).'
      ]
    },
    sourceUrl: 'https://www.gov.uk/set-up-business',
    sourceName: 'GOV.UK \u2013 Set Up a Business',
    lastUpdated: 'April 2026',
  },
  'margin-calculator': {
    howItWorks: [
      'Profit margin and markup are both measures of profitability but use different denominators, which is a frequent source of confusion in business. Margin is calculated as: (Revenue \u2212 Cost) \u00f7 Revenue \u00d7 100. It tells you what percentage of the selling price is profit. Markup is calculated as: (Revenue \u2212 Cost) \u00f7 Cost \u00d7 100. It tells you what percentage above cost you have charged. The same transaction produces very different numbers: selling at \u00a3100 with a cost of \u00a360 gives a 40% margin but a 66.7% markup.',
      'To convert between the two: Margin = Markup \u00f7 (1 + Markup), and Markup = Margin \u00f7 (1 \u2212 Margin). A 50% markup equals a 33.3% margin. A 100% markup equals a 50% margin. These formulas are essential when pricing products\u2014if your target gross margin is 30%, you need to apply a 42.9% markup to your costs, not 30%.',
      'Gross margin uses only direct costs (cost of goods sold) and reflects production efficiency. Net margin includes all overheads, tax, and interest, showing true bottom-line profitability. UK retail averages range from 2\u20135% net margin (supermarkets) to 50\u201370% gross margin (software). Tracking margin per product line, per client, or per period highlights where your business generates and erodes value.'
    ],
    example: {
      title: 'Margin and markup on a product sold for \u00a345',
      steps: [
        'Selling price: \u00a345.00. Cost of goods: \u00a327.00.',
        'Gross profit: \u00a345.00 \u2212 \u00a327.00 = \u00a318.00.',
        'Margin: \u00a318.00 \u00f7 \u00a345.00 \u00d7 100 = 40.0%.',
        'Markup: \u00a318.00 \u00f7 \u00a327.00 \u00d7 100 = 66.7%.',
        'To achieve a 40% margin on a new product costing \u00a330, set price at \u00a330 \u00f7 (1 \u2212 0.40) = \u00a350.00.'
      ]
    },
    sourceUrl: 'https://www.gov.uk/set-up-business',
    sourceName: 'GOV.UK \u2013 Set Up a Business',
    lastUpdated: 'April 2026',
  },
  'depreciation-calculator': {
    howItWorks: [
      'Depreciation systematically allocates the cost of a tangible asset over its useful economic life, reflecting the consumption of its value. Straight-line depreciation uses the formula: Annual charge = (Original cost \u2212 Estimated residual value) \u00f7 Useful life in years. This produces an equal expense each year and is the most common method for UK financial reporting under FRS 102. The net book value (NBV) decreases by the same fixed amount annually until it reaches the residual value.',
      'Reducing-balance (diminishing-balance) depreciation applies a fixed percentage rate to the NBV at the start of each period. The formula is: Annual charge = NBV at start of year \u00d7 Depreciation rate. This front-loads higher charges in the early years when the asset is most productive, tapering off as the NBV shrinks. To calculate the rate needed to reach a target residual value, use: Rate = 1 \u2212 (Residual \u00f7 Cost)^(1/n), where n is the asset\'s life in years.',
      'Depreciation is a non-cash accounting entry\u2014it does not directly represent tax relief. For tax purposes, UK businesses claim capital allowances instead, which follow different rules and rates. However, depreciation affects reported profit, balance sheet values, and financial ratios. Companies must disclose their depreciation policies in the notes to accounts. Common useful lives used in practice: computers 3\u20135 years, vehicles 4\u20138 years, furniture 5\u201310 years, buildings 25\u201350 years.'
    ],
    example: {
      title: 'Straight-line vs reducing-balance on a \u00a312,000 van',
      steps: [
        'Van cost: \u00a312,000. Residual value: \u00a32,000. Useful life: 5 years.',
        'Straight-line annual charge: (\u00a312,000 \u2212 \u00a32,000) \u00f7 5 = \u00a32,000 per year. NBV after year 1: \u00a310,000.',
        'Reducing-balance rate to reach \u00a32,000 in 5 years: 1 \u2212 (2,000/12,000)^(1/5) \u2248 30.1%.',
        'Year 1 reducing-balance charge: \u00a312,000 \u00d7 30.1% = \u00a33,612. NBV after year 1: \u00a38,388.',
        'Year 2 reducing-balance charge: \u00a38,388 \u00d7 30.1% = \u00a32,525. NBV after year 2: \u00a35,863.'
      ]
    },
    sourceUrl: 'https://www.gov.uk/capital-allowances',
    sourceName: 'GOV.UK \u2013 Capital Allowances',
    lastUpdated: 'April 2026',
  },
  'visa-fee-calculator': {
    howItWorks: [
      'UK visa fees vary by category and are set by the Home Office. They include the application fee itself plus the Immigration Health Surcharge (IHS), currently £1,035 per year for most categories. Some visas also require biometric enrolment fees, priority processing charges and the cost of an English language test.',
      'Common visa fees include: Skilled Worker visa from £719 (up to 3 years), Student visa from £490, Family visa from £1,846 (initial 2.5-year application) and Visit visa from £115 (6 months). Fees are higher when applying from within the UK (leave to remain) than from overseas in some categories.',
      'This calculator totals the full cost for each visa type including IHS, priority options and typical third-party costs. It distinguishes between main applicant and dependent fees, as dependents have separate application and IHS charges.',
    ],
    example: {
      title: 'Example: Skilled Worker visa (3 years, from outside the UK)',
      steps: [
        'Application fee: £719',
        'Immigration Health Surcharge: £1,035 × 3 years = £3,105',
        'Priority processing (optional): £500',
        'English test (if needed): approx. £170',
        'Total without priority: £3,994 | With priority: £4,494',
      ],
    },
    sourceUrl: 'https://www.gov.uk/visa-fees',
    sourceName: 'GOV.UK — Visa fees',
    lastUpdated: 'April 2026',
  },
  'student-budget-calculator': {
    howItWorks: [
      'A student budget calculator helps you plan whether your income (maintenance loan, part-time work, family contributions) will cover typical university expenses. Key cost categories include accommodation (the largest expense at £4,000\u2013£9,000 per year), food (£2,000\u2013£3,000), transport, course materials, socialising and personal spending.',
      'This calculator uses average UK student spending data to show how your income compares to expected costs. It flags any shortfall and suggests areas where spending can be adjusted. Accommodation costs vary hugely by city \u2014 London averages 40\u201360% more than cities in the North or Midlands.',
      'Enter your income sources and the calculator provides a realistic monthly and annual budget breakdown. If there is a gap, it shows how much you would need to earn from part-time work. Most universities recommend no more than 15\u201320 hours of paid work per week during term time to avoid impacting studies.',
    ],
    example: {
      title: 'Example: Student in Manchester, living in halls',
      steps: [
        'Income: maintenance loan £7,400 + family £1,500 + part-time work £2,400 = £11,300',
        'Accommodation: £5,800 (halls, 40 weeks)',
        'Food: £2,400 (£60/week)',
        'Transport, phone, socialising: £2,200',
        'Total expenses: £10,400 \u2014 surplus of £900/year',
      ],
    },
    sourceUrl: 'https://www.gov.uk/student-finance/new-fulltime-students',
    sourceName: 'GOV.UK \u2014 Student finance',
    lastUpdated: 'April 2026',
  },
  'contractor-day-rate-calculator': {
    howItWorks: [
      'Contractor day rates are the standard pricing unit in the UK contracting market. To convert a permanent salary to an equivalent day rate, the calculator divides the annual salary by the number of billable working days (typically 220-230 after deducting holidays, bank holidays and an allowance for bench time), then adds a premium to cover the loss of benefits and job security.',
      'A common rule of thumb is to divide the salary by 1,000 for a basic day rate equivalent (e.g. £60,000 salary = £300/day). However, this does not account for employer NI savings, pension, sick pay, holiday pay and other benefits that contractors must fund themselves. A more accurate conversion adds 20-40% to cover these.',
      'This calculator converts between salary and day rate in both directions. It includes options for operating through a limited company, umbrella company or PAYE agency, showing the take-home pay under each model. Enter either a salary or a day rate and see the equivalent under all three structures.',
    ],
    example: {
      title: 'Example: £65,000 permanent salary to day rate',
      steps: [
        'Working days per year (less 25 holiday, 8 bank hols): 227',
        'Basic equivalent: £65,000 ÷ 227 = £286/day',
        'With 30% contractor premium: £286 × 1.30 = £372/day',
        'At £375/day through Ltd company: take-home approx. £58,000',
        'At £375/day through umbrella: take-home approx. £49,500',
      ],
    },
    sourceUrl: 'https://www.gov.uk/guidance/understanding-off-payroll-working-ir35',
    sourceName: 'GOV.UK — Off-payroll working',
    lastUpdated: 'April 2026',
  },
  'electricity-cost-calculator': {
    howItWorks: [
      'Electricity costs for individual appliances can be calculated using the formula: kWh = (watts x hours used per day) / 1,000. Multiply the kWh by your unit rate to get the daily cost. The average UK electricity unit rate under the Ofgem price cap is approximately 24.5p per kWh, plus a daily standing charge of around 61.64p.',
      'Common household appliances vary dramatically in running costs. A tumble dryer (2,500W) costs about 61p per hour, an electric oven (2,000W) about 49p per hour, a washing machine (500W average) about 12p per cycle, while an LED light bulb (10W) costs just 0.25p per hour. Always check the wattage on the appliance\'s rating plate.',
      'This calculator lets you enter any appliance by wattage and usage pattern. It shows the daily, weekly, monthly and annual running cost. You can compare multiple appliances to identify the biggest energy consumers in your home and see where switching to more efficient models would save the most money.',
    ],
    example: {
      title: 'Example: Running a tumble dryer and LED lights',
      steps: [
        'Tumble dryer: 2,500W x 1 hour x 3 times/week',
        'Weekly kWh: 7.5 kWh x 24.5p = £1.84/week',
        'Annual tumble dryer cost: £95.55',
        'LED bulbs (10 x 10W): 100W x 6 hours/day = 0.6 kWh/day',
        'Annual LED lighting cost: 0.6 x 365 x 24.5p = £53.66',
        'Comparison: tumble dryer costs 78% more than all LED lights',
      ],
    },
    sourceUrl: 'https://www.ofgem.gov.uk/check-if-energy-price-cap-affects-you',
    sourceName: 'Ofgem — Energy price cap',
    lastUpdated: 'April 2026',
  },
  'led-savings-calculator': {
    howItWorks: [
      'LED bulbs use 75-85% less electricity than traditional incandescent bulbs and 50-60% less than halogen bulbs for the same brightness. A 10W LED produces the same light (800 lumens) as a 60W incandescent or 42W halogen bulb. LEDs also last 15,000-25,000 hours compared to 1,000 hours for incandescents.',
      'At current electricity rates of 24.5p per kWh, replacing a 60W incandescent bulb used 4 hours daily with a 10W LED saves £17.90 per year. If you have 20 bulbs in your home, switching them all to LED could save over £350 per year. The upfront cost of LED bulbs (£2-£8 each) is recouped within a few months.',
      'This calculator estimates your savings from switching to LED bulbs throughout your home. Enter the number and type of your current bulbs (incandescent, halogen, or CFL), their wattage and average daily usage to see the annual saving, payback period and total savings over the lifespan of the LED replacements.',
    ],
    example: {
      title: 'Example: Replacing 15 halogen downlights (50W each)',
      steps: [
        'Current halogen usage: 15 x 50W x 4 hours/day = 3 kWh/day',
        'Annual halogen cost: 3 x 365 x 24.5p = £268.28',
        'LED replacement (5W each): 15 x 5W x 4 hours = 0.3 kWh/day',
        'Annual LED cost: 0.3 x 365 x 24.5p = £26.83',
        'Annual saving: £241.45',
        'LED bulb cost (15 x £4): £60, payback: 3 months',
      ],
    },
    sourceUrl: 'https://energysavingtrust.org.uk/advice/lighting/',
    sourceName: 'Energy Saving Trust — Lighting',
    lastUpdated: 'April 2026',
  },
  'lbtt-ltt-calculator': {
    howItWorks: [
      'Land and Buildings Transaction Tax (LBTT) applies to property purchases in Scotland, while Land Transaction Tax (LTT) applies in Wales. Both replaced Stamp Duty in their respective nations and use a progressive slab structure similar to income tax, where each band is taxed at its own rate rather than a single percentage on the whole price.',
      'Scottish LBTT residential bands for 2026/27 are: 0% up to £145,000, 2% from £145,001 to £250,000, 5% from £250,001 to £325,000, 10% from £325,001 to £750,000 and 12% above £750,000. Welsh LTT bands are: 0% up to £225,000, 6% from £225,001 to £400,000, 7.5% from £400,001 to £750,000, 10% from £750,001 to £1.5m and 12% above £1.5m.',
      'Both nations apply an Additional Dwelling Supplement for second homes and buy-to-let properties. In Scotland this is 8% on the total price; in Wales it is 4% on the total price. First-time buyer relief differs between the two nations.',
    ],
    example: {
      title: 'Example: £300,000 property in Scotland (standard rates)',
      steps: [
        '£0–£145,000 at 0% = £0',
        '£145,001–£250,000 at 2% = £2,100',
        '£250,001–£300,000 at 5% = £2,500',
        'Total LBTT: £4,600 (effective rate: 1.53%)',
      ],
    },
    sourceUrl: 'https://www.revenue.scot/land-buildings-transaction-tax/lbtt-rates-and-bands',
    sourceName: 'Revenue Scotland — LBTT rates and bands',
    lastUpdated: 'April 2026',
  },
  'landlord-tax-calculator': {
    howItWorks: [
      'Landlord income tax is calculated on your net rental profit — total rental income minus allowable expenses. Allowable expenses include letting agent fees, maintenance and repairs, insurance, accountancy fees, advertising costs and travel to the property. Since April 2020, mortgage interest cannot be deducted as an expense; instead, a 20% tax credit is given on finance costs.',
      'Your rental profit is added to any other income to determine your tax band. Basic-rate taxpayers pay 20% on rental profits, higher-rate pay 40% and additional-rate pay 45%. The 20% mortgage interest tax credit is the same regardless of your band, meaning higher-rate taxpayers pay more effective tax on rental income with mortgage interest than under the old rules.',
      'This calculator works out your landlord tax liability for the 2026/27 tax year. Enter your rental income, expenses, mortgage interest and other income to see the tax due, the effect of the finance cost restriction and your effective tax rate on rental profits.',
    ],
    example: {
      title: 'Example: £18,000 rental income, £4,000 expenses, £7,200 mortgage interest, 40% taxpayer',
      steps: [
        'Net rental profit: £18,000 − £4,000 = £14,000',
        'Tax at 40%: £14,000 × 40% = £5,600',
        'Finance cost credit: £7,200 × 20% = −£1,440',
        'Net tax on rental income: £5,600 − £1,440 = £4,160',
        'Effective rate on total rental income: 23.1%',
      ],
    },
    sourceUrl: 'https://www.gov.uk/guidance/changes-to-tax-relief-for-residential-landlords',
    sourceName: 'GOV.UK — Tax relief for residential landlords',
    lastUpdated: 'April 2026',
  },
  'sick-pay-calculator': {
    howItWorks: [
      'Statutory Sick Pay (SSP) is paid by your employer when you are too ill to work. For 2026/27, the rate is £123.25 per week. To qualify, you must be an employee, have been ill for at least 4 consecutive days (including non-working days), earn at least £125 per week on average (the Lower Earnings Limit) and have notified your employer within their deadline.',
      'The first 3 qualifying days of illness are "waiting days" and no SSP is paid. SSP starts on the 4th qualifying day and can continue for up to 28 weeks. Qualifying days are the days you would normally work — if you work Monday to Friday, only those count. SSP is taxable and subject to NI deductions.',
      'Some employers offer contractual sick pay that exceeds SSP. This calculator shows the SSP entitlement based on your qualifying days and pay period, and compares it with your normal earnings so you can see the shortfall. It also checks your eligibility based on average weekly earnings.',
      'Statutory Sick Pay: £123.25/week from 6 April 2026. SSP is paid by employers for up to 28 weeks per period of incapacity. To qualify: earn at least £125/week (Lower Earnings Limit), been ill for 4+ consecutive days (Period of Incapacity for Work — PIW). First 3 days are \'waiting days\' (unpaid) unless you were ill within the previous 8 weeks. Maximum SSP £3,451 over 28 weeks. Employers reclaim limited amounts of SSP via Apprenticeship Levy for high-cost cases since 2022 reform.',
      'Linked sickness periods and \'fit notes\'. If you\'re sick again within 8 weeks of a previous SSP claim, the two periods \'link\' — no new waiting days, SSP runs from day 1 of the new absence. You must self-certify for the first 7 days. From day 8, you need a \'fit note\' (Statement of Fitness for Work) from your GP, hospital doctor, or some pharmacists/physios/occupational therapists since 2022 reforms. Fit notes can say \'may be fit for work\' with conditions — employers must consider reasonable adjustments.',
      'When SSP runs out — Employment and Support Allowance. After 28 weeks of SSP, your employer issues form SSP1 to claim ESA via gov.uk. ESA pays £92.05/week assessment phase, then up to £142.25/week support component for those with limited capability for work-related activity. Plus possible PIP (Personal Independence Payment) for daily living/mobility costs. Universal Credit applies for working-age claimants. Income-related ESA was abolished — only contribution-based remains (for those with sufficient NI history).',
      'Enhanced/contractual sick pay — common in larger employers. Many employers offer Occupational Sick Pay (OSP) on top of SSP: typical UK enhanced sick pay schemes pay full salary for 4-13 weeks then half salary for further weeks (varies). Public sector (NHS, civil service, local government) typically: 1 month full + 2 months half (year 1), rising to 6 months full + 6 months half (year 5+). Always check your contract and staff handbook — enhanced sick pay can be £hundreds of pounds per week more than SSP.',
    ],
    example: {
      title: 'Example: 2 weeks off sick, Monday-Friday worker',
      steps: [
        'Total days ill: 14 (including weekends)',
        'Qualifying days (Mon-Fri): 10',
        'Less 3 waiting days: 7 qualifying days of SSP',
        'SSP per qualifying day: £123.25 ÷ 5 = £23.35',
        'Total SSP: 7 × £23.35 = £163.45',
      ],
    },
    sourceUrl: 'https://www.gov.uk/statutory-sick-pay',
    sourceName: 'GOV.UK — Statutory Sick Pay',
    lastUpdated: 'April 2026',
  },
  'pay-rise-calculator': {
    howItWorks: [
      'When you receive a pay rise, not all of the increase reaches your pocket. The marginal rate of tax and NI on the raise determines how much you actually keep. For example, a basic-rate taxpayer loses 20% to income tax and 8% to NI, keeping 72p of each additional pound. A higher-rate taxpayer keeps only 58p.',
      'This calculator takes your current salary and the proposed new salary, then calculates the exact change in take-home pay. It accounts for any threshold crossings — for instance, if the rise pushes you from basic to higher rate, only the portion above £50,270 is taxed at the higher rate.',
      'The results show your old and new annual take-home pay, the gross increase, the net increase (what you actually keep) and the effective rate of deductions on the raise. This helps you negotiate salary increases with a clear understanding of the real-world impact.',
    ],
    example: {
      title: 'Example: £38,000 to £42,000 pay rise',
      steps: [
        'Gross increase: £4,000',
        'Additional income tax (20%): £800',
        'Additional employee NI (8%): £320',
        'Additional pension (5%): £200',
        'Net increase in take-home: £2,680 (67% of the gross rise)',
      ],
    },
    sourceUrl: 'https://www.gov.uk/income-tax-rates',
    sourceName: 'GOV.UK — Income Tax rates and Personal Allowances',
    lastUpdated: 'April 2026',
  },
  'shared-ownership-calculator': {
    howItWorks: [
      'Shared ownership lets you buy a share of a property (between 25% and 75%) and pay rent on the remaining share owned by a housing association. You need a mortgage only for the share you buy, plus a deposit on that share (typically 5-10% of the share value). This dramatically reduces the upfront cost compared to buying outright.',
      'Monthly costs include your mortgage payment on the purchased share, rent to the housing association on the unowned share (typically 2.75% of its value per year), service charges and any ground rent. The rent portion usually increases annually by CPI + 1%, though newer leases may cap increases at CPI only.',
      'This calculator breaks down all monthly costs for a shared ownership purchase. Enter the property value, the share you are buying, your deposit and the interest rate to see a full monthly cost comparison against renting or buying the whole property with a larger mortgage.',
      'How Shared Ownership works. Buy 25-75% of a property (the \'share\'), pay rent on the remaining percentage to a housing association at ~2.75-3% of unsold equity. £300,000 property, buy 50%: mortgage on £150,000 + rent on £150,000 at 2.75% = £344/month rent. Mortgage on £150k at 5% over 25 years = £877/month. Total housing cost = £1,221/month — substantially less than buying 100% at £1,754/month, but you only own 50% of capital appreciation.',
      'Staircasing — buying more of your home. After living in your shared-owned property for a period (usually 1+ year), you can \'staircase\' — buy additional shares (typically minimum 10% per transaction). New 1% Staircasing model (since 2021) allows annual 1% purchases at fixed RPI-linked valuations. Eventually you can own 100% (in most properties) — exception: \'protected areas\' (rural/coastal) where staircasing is capped at 80%. Each staircasing transaction has SDLT, legal fees, and valuation costs.',
      'Eligibility and the 80k income cap. To qualify in 2026/27: household income under £80,000 (£90,000 London); cannot afford to buy a comparable home outright; first-time buyer OR existing shared owner staircasing OR home mover unable to afford full-purchase property. Some properties prioritise local connection or key worker status. Apply via the local Help to Buy agent for your region. Limited supply — properties typically allocated within weeks of release.',
      'Major risks and pitfalls. (1) You\'re still 100% responsible for repairs and maintenance, even on the share you don\'t own; (2) Rent increases annually (typically RPI + 0.5%) — much faster than mortgage payments; (3) Service charges can be high (£200-£500/month for new builds); (4) Resale is often restricted — must offer back to housing association first; (5) Lender market is narrow — fewer mortgage products for SO buyers, often higher rates; (6) Leasehold structure means ground rent and potential reform risk. Always read the lease carefully.',
    ],
    example: {
      title: 'Example: £300,000 property, 40% share, 5% deposit on share',
      steps: [
        'Share purchased: 40% of £300,000 = £120,000',
        'Deposit (5% of share): £6,000',
        'Mortgage: £114,000 at 4.5% over 25 years = £633/month',
        'Rent on 60% (£180,000 at 2.75%): £412.50/month',
        'Total monthly cost: £633 + £412.50 + £150 service charge = £1,195.50',
      ],
    },
    sourceUrl: 'https://www.gov.uk/shared-ownership-scheme',
    sourceName: 'GOV.UK — Shared Ownership scheme',
    lastUpdated: 'April 2026',
  },
  'pension-drawdown-calculator': {
    howItWorks: [
      'Flexi-access drawdown lets you take 25% of your pension pot as a tax-free Pension Commencement Lump Sum (PCLS), then draw taxable income from the remaining 75% while keeping the pot invested. The tax-free portion is calculated at crystallisation: for a £200,000 pot, £50,000 is tax-free and £150,000 enters the drawdown fund. Withdrawals from the drawdown fund are taxed as earned income at your marginal rate.',
      'Pot longevity projections model the balance between investment growth and withdrawal rate. The sustainable withdrawal rate depends on asset allocation, charges, and assumed growth. At a 4% withdrawal rate with 5% nominal growth and 0.5% charges, a pot typically lasts 30+ years. At 6% withdrawal, the same pot may deplete within 20 years. Sequence-of-returns risk means poor early performance disproportionately shortens pot life.',
      'Income tax on drawdown withdrawals stacks on top of any other income including State Pension. The first £12,570 of total income is tax-free (personal allowance), then 20% basic rate to £50,270, 40% higher rate to £125,140, and 45% additional rate above that. The personal allowance tapers by £1 for every £2 earned above £100,000, creating an effective 60% marginal rate between £100,000 and £125,140.',
      'How pension drawdown works. From age 55 (rising to 57 from April 2028), you can withdraw funds from a DC pension in three ways: (1) Take 25% as a tax-free Pension Commencement Lump Sum (PCLS) and place the rest in \'flexi-access drawdown\'; (2) Take Uncrystallised Funds Pension Lump Sums (UFPLS) — 25% of each withdrawal is tax-free, 75% is taxed; (3) Buy an annuity. Drawdown gives flexibility but requires investment management, while annuity gives certainty but limited flexibility.',
      'The 4% rule — and why it might not work in 2026. The 4% rule (Bengen 1994) says you can withdraw 4% of your initial pot annually, inflation-adjusted, with high probability of pot lasting 30 years. Recent UK research (Cazalet, PFS) suggests 3.5% is safer given: lower bond yields, longer lifespans, sequence-of-returns risk. £400k pot at 4% = £16,000/year for 30 years. At 3.5%, £14,000/year. Combine with State Pension (£12,500/year) and modest 4-5% withdrawal feels safer than relying on pension alone.',
      'Sequence-of-returns risk explained. Early bad investment returns devastate drawdown pots more than late bad returns. Two pensioners with same average 7% return over 30 years can have very different outcomes if one suffered -20% in year 1 vs year 29. The first runs out years earlier because they sold low when also withdrawing. Mitigations: (1) hold 2-3 years of cash withdrawal buffer to avoid selling investments in a crash; (2) reduce equity allocation as you approach retirement; (3) consider partial annuitisation for guaranteed income floor.',
      'Tax on drawdown — the 75% reality. Only 25% of your pension is tax-free (the PCLS or 25% of each UFPLS). The other 75% is taxed as income when withdrawn. Strategic withdrawals matter: take just below your tax bands to minimise rate (use PA £12,570 + basic rate band). Combined with State Pension £12,500, you can take £12,570 - £12,500 = £70 tax-free, then £37,700 at 20% basic rate (£7,540 tax) from your pension — generating £37,700 + £70 + £12,500 = £50,270 gross with only £7,540 tax (15% effective).',
    ],
    example: {
      title: 'Drawdown from a £300,000 pension pot at age 60',
      steps: [
        'Tax-free lump sum (25%): £300,000 x 25% = £75,000',
        'Remaining drawdown fund: £225,000, invested at assumed 5% growth minus 0.5% charges',
        'Annual withdrawal of £12,000 (approx 5.3% of drawdown fund)',
        'With State Pension of £11,500/year from age 66 and personal allowance of £12,570, drawdown taxed at 20% = £2,400 tax on £12,000 withdrawal',
        'Projected pot duration at this withdrawal rate: approximately 28 years (to age 88)'
      ]
    },
    sourceUrl: 'https://www.gov.uk/pension-types/income-drawdown',
    sourceName: 'GOV.UK',
    lastUpdated: 'April 2026',
  },
  'annuity-calculator': {
    howItWorks: [
      'Annuity rates are calculated by insurers based on your pension pot size, age at purchase, health status, and chosen options. The insurer invests your lump sum and pays you a guaranteed income for life, using actuarial life expectancy tables and current gilt yields to determine the annual payout. A larger pot, older age, or poor health typically produces a higher annual income.',
      'You select between a single-life annuity (pays only you) or a joint-life annuity (continues paying a spouse at a reduced rate, typically 50-66%). Level annuities pay a fixed amount, while escalating annuities start lower but increase each year by a fixed percentage or in line with RPI, protecting against inflation erosion over a 20-30 year retirement.',
      'The calculation divides your pot by an annuity factor derived from mortality tables and the selected options. Guarantee periods (typically 5 or 10 years) ensure payments continue to beneficiaries if you die early, but reduce the headline rate slightly. Enhanced annuities for smokers or those with medical conditions can pay 20-40% more than standard rates.',
      'Why are UK annuity rates so much better in 2026? After 15 years of historically low gilt yields suppressing annuity rates, the Bank of England base rate rises (4.5% as of May 2026) and 15-year gilt yields above 4.5% have transformed pricing. A 65-year-old buying a single-life, level lifetime annuity with £100,000 in May 2026 can secure £7,200-£7,500/year — compared to ~£5,500 in 2020. Adding inflation protection (RPI-linked, 3% escalating) typically reduces the starting income by 35-45% but protects purchasing power over a 20-30 year retirement.',
      'Lifetime vs Fixed-Term vs Enhanced annuities. A lifetime annuity pays for as long as you live. Fixed-term annuities (5, 10, 15, or 20 years) pay a guaranteed income then return a maturity value — useful if you want flexibility but worry about drawdown sequence-of-returns risk. Enhanced annuities pay 10-40% more if you have qualifying medical conditions (smoking, diabetes, heart conditions, cancer history, high BMI, etc.) because the insurer expects to pay out for fewer years. Around 60% of annuity buyers qualify for enhanced rates but many never check — always shop the enhanced market via specialist brokers.',
      'Joint-life annuities for couples. If you have a spouse or civil partner, consider a joint-life annuity (50%, 66%, or 100% spouse pension). A 100% spouse joint annuity for two age-65 partners pays ~15% less than a single-life annuity, but continues at the same rate after first death. With UK life expectancy of 82 for men and 85 for women, joint annuities almost always pay out more in total. They are particularly valuable when one partner has significantly more pension wealth than the other.',
      'When does an annuity beat drawdown? Annuities provide insurance against longevity — running out of money. They are most valuable for those without a defined benefit pension safety net, who do not want to manage investments in old age, or who fear cognitive decline affecting financial decisions. Drawdown wins for those who: (1) have a DB pension + State Pension covering essential expenses, (2) want to leave money to heirs (annuities die with you), (3) can tolerate investment volatility. Many retirees use both — annuitise enough to cover essentials, drawdown the rest.',
      'The 25% tax-free lump sum trap. Many retirees withdraw their 25% PCLS at retirement and then annuitise. This is often suboptimal: cash earns less than the annuity rate, and the lump sum is then exposed to inheritance tax. An alternative: take the 25% gradually through UFPLS (Uncrystallised Funds Pension Lump Sums) over many years to spread tax-free benefits, or buy a \'with-profits\' annuity from your full pot for maximum income. The 25% lump sum is now capped at £268,275 (the Lump Sum Allowance) after the 2023 abolition of the Lifetime Allowance.',
    ],
    example: {
      title: 'Annuity income from a £200,000 pension pot at age 65',
      steps: [
        'Pension pot value: £200,000',
        'Single-life, level annuity rate at age 65: approximately 6.8%',
        'Annual income: £200,000 x 6.8% = £13,600 per year (£1,133/month)',
        'If joint-life (50% spouse) selected instead: rate drops to approx 5.9%, giving £11,800/year',
        'If RPI-linked escalation chosen: starting income drops to approx £9,400/year but rises annually with inflation'
      ]
    },
    sourceUrl: 'https://www.gov.uk/pension-types',
    sourceName: 'GOV.UK',
    lastUpdated: 'April 2026',
  },
  'pension-vs-isa-calculator': {
    howItWorks: [
      'Pensions receive income tax relief on contributions (20/40/45%) but withdrawals are taxed as income after the 25% tax-free lump sum. ISAs receive no tax relief on contributions (money goes in from post-tax income) but all growth and withdrawals are completely tax-free. The comparison depends on your tax rate when contributing versus your expected tax rate in retirement, plus the value of the 25% PCLS.',
      'For a 40% taxpayer contributing £100 gross, a pension costs £60 after relief and the full £100 is invested. An ISA receives £60 (post-tax) for investment. If the pension fund grows to £200, you get £50 tax-free (25%) plus £150 taxed at 20% in retirement = £170 net. The ISA £60 grows proportionally to £120, all tax-free. Pension wins when your retirement tax rate is lower than your contribution tax rate.',
      'Additional factors tilt the comparison: employer pension contributions are free money an ISA cannot match. Pensions are shielded from creditors and inheritance tax (passed tax-free if you die before 75). ISAs offer flexible access at any age, no lifetime limit on withdrawals, and no impact on State Pension or benefits. The optimal strategy for most people combines both: maximise employer pension matching first, then use ISAs for additional savings.'
    ],
    example: {
      title: 'Pension vs ISA for a 40% taxpayer investing £10,000 gross over 20 years',
      steps: [
        'Pension: £10,000 gross invested (costs £6,000 after 40% tax relief). At 5% growth for 20 years = £26,533',
        'After 25% tax-free (£6,633) + 75% taxed at 20% (£19,900 x 0.80 = £15,920): net pension = £22,553',
        'ISA: £6,000 post-tax invested. At 5% growth for 20 years = £15,920. All tax-free: net ISA = £15,920',
        'Pension advantage: £22,553 - £15,920 = £6,633 more from the pension',
        'If retirement tax rate were 40% instead of 20%, pension net drops to £18,566 — advantage shrinks to £2,646'
      ]
    },
    sourceUrl: 'https://www.gov.uk/tax-on-your-private-pension/pension-tax-relief',
    sourceName: 'GOV.UK',
    lastUpdated: 'April 2026',
  },
  'lifetime-isa-calculator': {
    howItWorks: [
      'The Lifetime ISA allows contributions of up to £4,000 per tax year, on which the government pays a 25% bonus of up to £1,000 per year. The bonus is paid monthly within 4-6 weeks of each contribution. You must be aged 18-39 to open a LISA, and can contribute until age 50. The LISA can be used to buy a first home worth up to £450,000 or withdrawn penalty-free after age 60.',
      'For property purchase, the calculator compounds contributions plus bonus over the saving period. Contributing £4,000/year for 5 years gives £20,000 in contributions plus £5,000 in government bonuses, totalling £25,000 before growth. With investment returns on a Stocks and Shares LISA, the total could reach £28,000-£30,000. The full amount including all bonuses and growth can be used toward the deposit on a first home.',
      'Early withdrawal for purposes other than first home purchase or retirement incurs a 25% government withdrawal charge on the total amount, not just the bonus. This effectively creates a 6.25% loss on your own contributions: depositing £1,000 receives a £250 bonus (total £1,250), but the 25% withdrawal charge takes £312.50, leaving you with only £937.50 — less than you put in. The calculator shows the penalty impact clearly to help with decision-making.',
      'Why the LISA bonus is so powerful for first-time buyers. £4,000 contribution + £1,000 government bonus = £5,000 in the ISA. Over 10 years saving the max, you contribute £40,000 and receive £10,000 in bonuses — £50,000 total before any investment growth. Saved in a Stocks & Shares LISA averaging 7% growth: ~£68,000 at year 10. For a first home with 5% deposit on a £450,000 property (£22,500 deposit), you\'d easily fund the deposit AND have £45k+ left for fees and furnishings.',
      'LISA vs Help-to-Buy ISA — which is better? Help-to-Buy ISA closed to new accounts in November 2019 (existing accounts can continue contributing until November 2029). Help-to-Buy gives 25% bonus on up to £12,000 (£3,000 max) and only on properties up to £250k (or £450k London). LISA allows up to £450k property anywhere in the UK and unlimited yearly bonuses (£1k/year vs £3k lifetime). Already have a H2B ISA? Can transfer to LISA — keeps both bonuses if first home is within both schemes\' rules.',
      'The 25% LISA penalty trap. Withdraw for non-qualifying reasons (not first home, not retirement at 60+): 25% penalty on the withdrawal. This recovers the bonus AND penalises your own contribution. Example: contribute £4,000, get £1,000 bonus, total £5,000. Withdraw £5,000: receive only £3,750 (£5,000 - 25% = £3,750), losing £250 of your own money. Only escape: terminal illness diagnosis (no penalty), or wait until age 60.',
      'Common LISA mistakes to avoid. (1) Buying a home above £450k — the cap is enforced strictly; even £450,001 means full 25% penalty. Some buyers complete on under £450k properties and immediately renovate to higher value. (2) Using LISA for a second home — only first-time buyer purchases qualify. (3) Holding LISA in cash if buying 10+ years away — invest for inflation protection. (4) Forgetting that 12 months must pass between opening and withdrawing for property — start LISA early even with small deposits.',
    ],
    example: {
      title: 'Lifetime ISA for first home deposit over 4 years',
      steps: [
        'Annual contribution: £4,000 (maximum)',
        'Government bonus each year: £4,000 x 25% = £1,000',
        'After 4 years: £16,000 contributions + £4,000 bonus = £20,000',
        'With 5% growth on a Stocks and Shares LISA: approximately £21,600',
        'If withdrawn early (not for home/retirement): 25% charge on £21,600 = £5,400 penalty, receiving only £16,200'
      ]
    },
    sourceUrl: 'https://www.gov.uk/lifetime-isa',
    sourceName: 'GOV.UK',
    lastUpdated: 'April 2026',
  },
  'premium-bonds-calculator': {
    howItWorks: [
      'Premium Bonds do not pay interest. Instead, each £1 bond enters a monthly prize draw funded by a prize fund rate set by NS&I (currently 4.00% as of early 2026). The prize fund rate determines the total value of prizes distributed across all bondholders. With approximately £120 billion in bonds outstanding, the monthly prize fund is roughly £400 million, distributed as prizes ranging from £25 to £1 million.',
      'Each £1 bond has an equal and independent chance of winning each month, generated by the ERNIE (Electronic Random Number Indicator Equipment) random number generator. The current odds of any single £1 bond winning a prize in any given month are approximately 1 in 21,000. The expected return equals the prize fund rate, but actual returns for individual holders vary significantly — particularly for smaller holdings where the probability of winning nothing in a given year is substantial.',
      'For a £10,000 holding at 4.00% prize fund rate, the expected annual return is £400, but this is a statistical average across all bondholders. In practice, most holders of £10,000 will win several £25 prizes per year, occasionally a £50 or £100 prize, and very rarely a larger prize. The median return for small holdings is below the mean because large prizes skew the average upward. The calculator shows expected return alongside the probability distribution of likely outcomes.'
    ],
    example: {
      title: 'Expected returns on £30,000 in Premium Bonds',
      steps: [
        'Holding: £30,000 (30,000 individual £1 bonds)',
        'Prize fund rate: 4.00%',
        'Expected annual return: £30,000 x 4.00% = £1,200',
        'Expected monthly prizes: approximately 1.4 prizes per month (mainly £25, occasional £50+)',
        'Comparison: a 4.5% easy-access savings account would pay £1,350/year guaranteed — but Premium Bond prizes are tax-free while savings interest above £1,000 PSA is taxable'
      ]
    },
    sourceUrl: 'https://www.nsandi.com/products/premium-bonds',
    sourceName: 'NS&I',
    lastUpdated: 'April 2026',
  },
  'child-maintenance-calculator': {
    howItWorks: [
      'The Child Maintenance Service (CMS) calculates payments based on the paying parent\'s gross weekly income. The basic rates are: 12% for one child, 16% for two children and 19% for three or more children. Income is usually sourced directly from HMRC tax data.',
      'The gross income figure is reduced if the paying parent has other children living with them (11% for one, 14% for two, 16% for three or more). Shared overnight care also reduces the amount: one night per week on average reduces the liability by one-seventh.',
      'If income is above £3,532 per week, the reduced rate tiers apply to the portion above this threshold. For very low incomes (below £200/week), a flat rate of £7 per week applies. This calculator follows the CMS formula to estimate weekly and monthly maintenance.',
    ],
    example: {
      title: 'Example: Two children, £600/week gross income',
      steps: [
        'Gross weekly income: £600',
        'Rate for two children: 16%',
        'Weekly maintenance: £600 × 16% = £96',
        'Monthly equivalent: £96 × 52 ÷ 12 = £416',
        'With one overnight per week: reduced by 1/7 = £82.29/week (£356.60/month)',
      ],
    },
    sourceUrl: 'https://www.gov.uk/calculate-child-maintenance',
    sourceName: 'GOV.UK — Calculate child maintenance',
    lastUpdated: 'April 2026',
  },
  'equity-release-calculator': {
    howItWorks: [
      'Equity release allows homeowners aged 55+ to access cash from their property without selling it. The most common form is a lifetime mortgage, where you borrow against your home and the loan plus rolled-up interest is repaid when you die or move into long-term care. The maximum you can borrow depends on your age and property value, typically 20-60% of the home\'s value.',
      'Interest on a lifetime mortgage compounds because no monthly payments are made. At a rate of 6%, a £100,000 loan doubles to £200,000 in approximately 12 years. All plans regulated by the Equity Release Council include a no-negative-equity guarantee, meaning you or your estate will never owe more than the property\'s sale value.',
      'This calculator projects the loan balance at different time horizons, showing how compound interest grows the debt. Enter your age, property value and amount you wish to release to see the projected debt, remaining equity and the impact on your estate for inheritance purposes.',
    ],
    example: {
      title: 'Example: Age 68, £350,000 home, releasing £80,000',
      steps: [
        'Amount released: £80,000 at 6.0% interest',
        'After 10 years: debt grows to £143,300',
        'After 15 years: debt grows to £191,700',
        'After 20 years: debt grows to £256,600',
        'Remaining equity (20 years, assuming 2% house price growth): £520,700 − £256,600 = £264,100',
      ],
    },
    sourceUrl: 'https://www.fca.org.uk/consumers/equity-release',
    sourceName: 'FCA — Equity release',
    lastUpdated: 'April 2026',
  },
  'moving-cost-calculator': {
    howItWorks: [
      'Moving house in the UK involves numerous costs that are easy to underestimate. Professional removal companies typically charge £500-£1,500 for a local move and £1,000-£3,000 for a long-distance move, depending on the volume of belongings and whether you require packing services. DIY van hire is cheaper at £100-£300 but requires more effort.',
      'Additional moving costs include mail redirection (starting at £36.99 for 3 months via Royal Mail), storage if there is a gap between moves (£50-£200/month), cleaning of the old property (£100-£400), and new furniture or appliances. Utility connection and disconnection fees may also apply, though many providers waive these.',
      'This calculator itemises all potential moving costs. Select the services you plan to use, enter quotes or use typical estimates, and add any specific items. The output gives a total moving budget that you can use alongside the home buying cost calculator for a complete picture.',
    ],
    example: {
      title: 'Example: 3-bed house, local move (20 miles)',
      steps: [
        'Removal company (mid-range): £950',
        'Packing materials: £75',
        'Mail redirection (12 months): £58.99',
        'Professional clean (old property): £250',
        'Utility setup and broadband: £100',
        'Total estimated moving cost: £1,433.99',
      ],
    },
    sourceUrl: 'https://www.gov.uk/buy-sell-your-home',
    sourceName: 'GOV.UK — Buy or sell your home',
    lastUpdated: 'April 2026',
  },
  'paternity-pay-calculator': {
    howItWorks: [
      'Statutory Paternity Pay (SPP) is paid for up to 2 weeks at the lower of £194.32 per week or 90% of your average weekly earnings for 2026/27. From April 2024, the two weeks can be taken as two separate one-week blocks at any time within 52 weeks of the birth or adoption placement, rather than consecutively.',
      'To qualify, you must be the biological father, the mother\'s spouse or partner, or the intended parent in a surrogacy arrangement. You must have worked continuously for your employer for at least 26 weeks by the 15th week before the expected week of childbirth and earn at least £125 per week on average.',
      'SPP is subject to tax and National Insurance like normal earnings. Your employer can reclaim 92% of SPP from HMRC (or 103% for small employers). This calculator shows your weekly SPP amount and the net pay after deductions, plus a comparison with your normal weekly earnings.',
      'Statutory Paternity Pay: 2 weeks at £194.32/week. Statutory Paternity Pay (SPP) is paid for up to 2 consecutive weeks at the lower of £194.32/week or 90% of average weekly earnings. Eligibility: 26 weeks continuous service by 15th week before due date, earn at least £125/week. Pay can be taken any time in the 8 weeks after birth (or placement for adoption). From April 2024, the 2 weeks can be split into two separate 1-week blocks — useful for handover periods.',
      'Shared Parental Leave — the more generous alternative. Where the mother gives up some maternity leave/pay, the father (or other parent) can take up to 50 weeks of leave and 37 weeks of pay (Shared Parental Pay at £194.32/week). Useful where: mother is the higher earner and wants to return to work faster; father wants more bonding time; you want flexibility to overlap or alternate. Notification rules complex — 8 weeks notice of each block, no more than 3 blocks per parent. Most employers run SPP at the same rate as SMP/SPP (£194.32) but some offer enhanced.',
      'Enhanced contractual paternity pay. About 30-40% of UK employers offer enhanced paternity pay (typically full pay for 2 weeks). Public sector (civil service, NHS, local government) typically pays full pay for the 2 statutory weeks. Some enlightened employers offer 4-6 weeks at full pay, or unlimited equality with maternity pay. Always check your contract and staff handbook — many enhanced policies aren\'t widely advertised. From April 2024, fathers and other parents have a day-one right to take 2 weeks paternity leave (no service requirement).',
      'Time off for antenatal appointments. Pregnant employees have a statutory right to paid time off for antenatal appointments. Their partners (married, civil partnered, cohabiting, intended parents of a surrogate child) have a right to UNPAID time off for up to two antenatal appointments per pregnancy (up to 6.5 hours each). This is in addition to paternity leave. Employers should accommodate without penalty — refusal can lead to discrimination claims.',
    ],
    example: {
      title: 'Example: Employee earning £35,000/year',
      steps: [
        'Average weekly earnings: £35,000 ÷ 52 = £673.08',
        '90% of AWE: £605.77 — exceeds £194.32 cap',
        'SPP rate: £194.32/week (the lower amount)',
        'Gross SPP for 2 weeks: £374.36',
        'Net SPP (after ~28% deductions): approx. £269.54',
      ],
    },
    sourceUrl: 'https://www.gov.uk/paternity-pay-leave',
    sourceName: 'GOV.UK — Statutory Paternity Pay and Leave',
    lastUpdated: 'April 2026',
  },
  'notice-period-calculator': {
    howItWorks: [
      'Statutory notice periods in the UK are based on length of continuous service. Employees who have worked for at least one month but less than two years are entitled to one week\'s notice. After two years, entitlement increases by one week for each complete year of service, up to a maximum of 12 weeks\' notice after 12 or more years.',
      'Your contract may specify a longer notice period than the statutory minimum — the longer period always applies. Many professional roles specify one to three months\' contractual notice. During the notice period, employees retain all normal employment rights including pay, holiday accrual and benefits.',
      'This calculator determines both the statutory and contractual notice period based on your length of service and contract terms. It also calculates your pay during the notice period and shows the earliest date employment can end. Payment in lieu of notice (PILON) is also covered where your contract allows it.',
    ],
    example: {
      title: 'Example: 5 years\' service, 1-month contractual notice',
      steps: [
        'Statutory notice: 5 weeks (1 week per year of service)',
        'Contractual notice: 4.3 weeks (1 month)',
        'Applicable notice: 5 weeks (statutory is longer)',
        'Notice pay at £35,000 salary: 5 × £673.08 = £3,365.38',
        'Earliest end date: 5 weeks from resignation/dismissal',
      ],
    },
    sourceUrl: 'https://www.gov.uk/handing-in-your-notice',
    sourceName: 'GOV.UK — Handing in your notice',
    lastUpdated: 'April 2026',
  },
  'work-from-home-tax-relief-calculator': {
    howItWorks: [
      'Employees who are required to work from home by their employer can claim tax relief on additional household costs. The simplest method is the flat-rate deduction of £6 per week (£312 per year) which does not require receipts. This gives a tax saving of £62.40 for basic-rate taxpayers or £124.80 for higher-rate taxpayers.',
      'Alternatively, you can claim the exact additional costs of working from home — such as the proportion of your heating, electricity, broadband and phone bills attributable to work. This requires keeping records and calculating the business-use percentage. HMRC accepts a reasonable apportionment method.',
      'Claims can be made through your employer (who adjusts your tax code) or via Self Assessment. You can backdate claims for up to four years. Note: you cannot claim if you choose to work from home — it must be a requirement of your job. This calculator shows the relief available under both the flat-rate and actual-cost methods.',
    ],
    example: {
      title: 'Example: Higher-rate taxpayer, flat-rate claim',
      steps: [
        'Flat-rate claim: £6/week × 52 = £312/year',
        'Tax relief at 40%: £312 × 40% = £124.80 saving',
        'Or actual costs: £50/month extra heating/electric = £600/year',
        'Tax relief at 40% on actual: £600 × 40% = £240 saving',
        'Actual costs method saves £115.20 more but requires records',
      ],
    },
    sourceUrl: 'https://www.gov.uk/tax-relief-for-employees/working-at-home',
    sourceName: 'GOV.UK — Tax relief for working at home',
    lastUpdated: 'April 2026',
  },
  'insulation-calculator': {
    howItWorks: [
      'Insulation is one of the most cost-effective energy efficiency improvements for UK homes. Loft insulation to the recommended 270mm depth costs £300-£600 and saves approximately £180-£250 per year. Cavity wall insulation costs £500-£1,500 and saves £150-£300 per year. These short payback periods make insulation an excellent investment.',
      'Solid wall insulation (internal or external) is more expensive at £4,000-£14,000 per property but saves £200-£400 per year. Floor insulation costs £500-£1,000 for a timber floor and saves £40-£70 per year. Draught-proofing windows and doors costs £100-£300 and saves £30-£60 per year.',
      'Government schemes may help cover the cost. The Great British Insulation Scheme provides insulation measures free or at reduced cost to eligible households. This calculator estimates the materials needed, installation cost and annual savings for each insulation type based on your property\'s characteristics.',
    ],
    example: {
      title: 'Example: 1960s 3-bed semi, no loft or cavity wall insulation',
      steps: [
        'Loft insulation (270mm): £450 installed',
        'Annual saving: £220',
        'Payback period: 2 years',
        'Cavity wall insulation: £800 installed',
        'Annual saving: £280',
        'Payback period: 2.9 years',
        'Combined annual saving: £500',
      ],
    },
    sourceUrl: 'https://energysavingtrust.org.uk/advice/insulation/',
    sourceName: 'Energy Saving Trust — Insulation',
    lastUpdated: 'April 2026',
  },
  'vat-return-calculator': {
    howItWorks: [
      'This calculator helps you calculate your VAT return — output VAT on sales vs input VAT on purchases. See amount due or refund. The calculation follows official UK rules and rates for the 2026/27 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the VAT Return Calculator',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2026/27 rates from GOV.UK — Business tax',
      ],
    },
    sourceUrl: 'https://www.gov.uk/corporation-tax-rates',
    sourceName: 'GOV.UK — Business tax',
    lastUpdated: 'April 2026',
  },
  'payroll-calculator': {
    howItWorks: [
      'A full UK payroll calculation applies deductions in a specific order: gross pay, less salary sacrifice pension contributions, then PAYE income tax using the employee\'s tax code, then employee National Insurance, then net-pay pension contributions (if not salary sacrifice), and finally student loan or postgraduate loan repayments.',
      'PAYE operates on a cumulative basis throughout the tax year. Each pay period, your employer calculates your year-to-date tax-free allowance and compares it with your year-to-date earnings. This means overpayments in one period are corrected in subsequent periods without needing to wait until the end of the year.',
      'This calculator supports weekly, fortnightly, four-weekly and monthly pay periods. Enter the gross pay, tax code, pension type, student loan plan and any additional deductions to generate a payslip-style breakdown showing each deduction line and the net pay figure.',
    ],
    example: {
      title: 'Example: £3,500 gross monthly pay, tax code 1257L, 5% pension',
      steps: [
        'Pension (5% salary sacrifice): −£175',
        'Taxable pay: £3,325',
        'PAYE income tax (Month 1, cumulative): £412.10',
        'Employee NI: £198.40',
        'Net pay: £3,325 − £412.10 − £198.40 = £2,714.50',
      ],
    },
    sourceUrl: 'https://www.gov.uk/guidance/rates-and-thresholds-for-employers-2025-to-2026',
    sourceName: 'HMRC — PAYE rates and thresholds 2026/27',
    lastUpdated: 'April 2026',
  },
  'late-payment-interest-calculator': {
    howItWorks: [
      'Under the Late Payment of Commercial Debts (Interest) Act 1998, UK businesses have a statutory right to charge interest and claim compensation when another business pays an invoice late. The statutory interest rate is the Bank of England base rate plus 8 percentage points per annum. Interest accrues from the day after the agreed payment date (or 30 days after delivery of goods/services or receipt of invoice, whichever is later, if no payment terms were agreed).',
      'In addition to interest, you can claim a fixed compensation amount based on the size of the unpaid debt: \u00a340 for debts up to \u00a3999.99, \u00a370 for debts between \u00a31,000 and \u00a39,999.99, and \u00a3100 for debts of \u00a310,000 or more. You can also claim reasonable recovery costs\u2014such as the cost of sending reminder letters or instructing a debt collection agency\u2014if the fixed compensation does not cover them.',
      'Interest is calculated as: Debt amount \u00d7 (Base rate + 8%) \u00f7 365 \u00d7 Number of days overdue. Contract terms can specify a different interest rate, but it must be a substantial remedy\u2014if a contract sets an unreasonably low rate, the statutory rate can still be invoked. These rights apply to all business-to-business transactions and to public authority debts. They do not apply to consumer debts (business-to-consumer).'
    ],
    example: {
      title: 'Late payment charges on a \u00a35,500 invoice overdue by 45 days',
      steps: [
        'Invoice amount: \u00a35,500. Payment was due 45 days ago.',
        'Current BoE base rate: 4.5%. Statutory rate: 4.5% + 8% = 12.5%.',
        'Daily interest: \u00a35,500 \u00d7 12.5% \u00f7 365 = \u00a31.883 per day.',
        'Interest for 45 days: \u00a31.883 \u00d7 45 = \u00a384.75.',
        'Fixed compensation (debt \u00a31,000\u2013\u00a39,999.99): \u00a370. Total claim: \u00a384.75 + \u00a370 = \u00a3154.75.'
      ]
    },
    sourceUrl: 'https://www.gov.uk/late-commercial-payments-interest',
    sourceName: 'GOV.UK \u2013 Late Commercial Payments Interest',
    lastUpdated: 'April 2026',
  },
  'overtime-calculator': {
    howItWorks: [
      'There is no statutory UK right to enhanced overtime pay — it depends entirely on your employment contract. Common overtime rates are time-and-a-half (1.5× your normal hourly rate) and double time (2× your normal hourly rate). Some contracts pay overtime at the standard rate or offer time off in lieu instead.',
      'For tax purposes, overtime pay is treated identically to regular earnings. It is added to your normal pay in the period it is received and taxed at your marginal income tax rate plus National Insurance. This means high overtime in one period can push you into a higher tax bracket temporarily.',
      'This calculator works out your overtime earnings at the specified premium rate, then calculates the tax and NI on the extra income. Enter your standard hourly rate, the overtime premium and the number of extra hours to see both the gross and net overtime pay.',
    ],
    example: {
      title: 'Example: 10 hours overtime at time-and-a-half, base £16/hour',
      steps: [
        'Overtime rate: £16 × 1.5 = £24/hour',
        'Gross overtime pay: £24 × 10 = £240',
        'Tax on overtime (20% basic rate): £48',
        'NI on overtime (8%): £19.20',
        'Net overtime pay: £240 − £67.20 = £172.80',
      ],
    },
    sourceUrl: 'https://www.gov.uk/overtime-your-rights',
    sourceName: 'GOV.UK — Overtime: your rights',
    lastUpdated: 'April 2026',
  },
  'nhs-pay-calculator': {
    howItWorks: [
      'NHS pay in England is structured under the Agenda for Change (AfC) framework, which groups roles into nine pay bands. Each band has multiple pay points (incremental steps) that staff progress through annually based on length of service. For 2026/27, Band 5 (newly qualified nurses) starts at around £29,970 rising to £36,483.',
      'In addition to basic pay, many NHS staff receive High Cost Area Supplements (HCAS) for working in London and surrounding areas: Inner London (20% up to £8,096), Outer London (15% up to £5,329) and Fringe (5% up to £1,929). Unsociable hours, on-call and overtime attract additional premiums.',
      'This calculator takes your band, pay point and location to show your total gross pay including any HCAS. It then calculates take-home pay after income tax, NI and NHS Pension contributions (the NHS Pension scheme has tiered contribution rates from 5.2% to 13.5% based on pensionable pay).',
    ],
    example: {
      title: 'Example: Band 6, pay point 3, Outer London',
      steps: [
        'Basic pay: £37,338',
        'Outer London HCAS (15%, capped): £5,329',
        'Total gross: £42,667',
        'NHS Pension contribution (9.8%): £4,181',
        'Estimated take-home after tax, NI and pension: approx. £31,200',
      ],
    },
    sourceUrl: 'https://www.nhsemployers.org/articles/annual-pay-scales',
    sourceName: 'NHS Employers — Agenda for Change pay scales',
    lastUpdated: 'April 2026',
  },
  'childcare-cost-calculator': {
    howItWorks: [
      'Childcare costs in the UK vary significantly by type and region. A full-time nursery place for a child under two typically costs £250-£350 per week outside London and £300-£400+ per week in London. Childminders are often slightly cheaper at £200-£300 per week, while after-school clubs cost £50-£80 per week.',
      'Tax-Free Childcare (TFC) is the main government scheme for working families. For every £8 you pay in, the government adds £2, up to a maximum of £2,000 per child per year (£4,000 for disabled children). Both parents must earn at least the equivalent of 16 hours at minimum wage and no more than £100,000 each.',
      'This calculator lets you compare the true cost of different childcare options after applying government support. It factors in Tax-Free Childcare, the childcare element of Universal Credit (which covers up to 85% of costs up to £1,014.63/month for one child), and the free hours entitlement for 2, 3 and 4-year-olds.',
    ],
    example: {
      title: 'Example: 2-year-old in nursery, £280/week, using Tax-Free Childcare',
      steps: [
        'Annual nursery cost: £280 x 52 = £14,560',
        'Less 15 hours free entitlement (38 weeks): -£3,990 approx.',
        'Net cost to pay: £10,570',
        'Tax-Free Childcare top-up (20%): £2,000 (max)',
        'Your actual cost: £8,570/year (£164.81/week)',
      ],
    },
    sourceUrl: 'https://www.gov.uk/tax-free-childcare',
    sourceName: 'GOV.UK — Tax-Free Childcare',
    lastUpdated: 'April 2026',
  },
  'mot-date-calculator': {
    howItWorks: [
      'All vehicles in the UK over 3 years old must have a valid MOT certificate. The MOT test checks roadworthiness including brakes, lights, steering, suspension, tyres, exhaust emissions and bodywork. The maximum fee is set by the DVSA at £54.85 for a standard car (2026/27). Many garages charge less as a loss leader.',
      'You can check your MOT due date for free using the DVLA\'s online service with your registration number. Your MOT can be done up to one month before the expiry date without losing any days from the next certificate — the new MOT will run from the old one\'s expiry date.',
      'Common MOT failure items include blown bulbs (£5-£15 to fix), worn tyres (£60-£120 each), damaged windscreens (£75-£350), worn brake pads (£100-£250 per axle) and emissions failures (£100-£500+ depending on cause). This calculator estimates the cost of your MOT plus likely repairs based on your vehicle\'s age and type.',
    ],
    example: {
      title: 'Example: 8-year-old Ford Fiesta MOT',
      steps: [
        'MOT test fee: £45 (typical garage price)',
        'Likely advisory: front brake pads worn',
        'Brake pad replacement (front): £120',
        'Rear wiper blade (failed): £15',
        'Estimated total MOT cost: £180',
        'Book 1 month early to allow time for repairs',
      ],
    },
    sourceUrl: 'https://www.gov.uk/getting-an-mot',
    sourceName: 'GOV.UK — Getting an MOT',
    lastUpdated: 'April 2026',
  },
  'train-season-ticket-calculator': {
    howItWorks: [
      'Train season tickets offer significant savings for regular commuters. A weekly season ticket costs roughly 5 times the daily anytime fare, a monthly ticket costs about 3.84 times the weekly price, and an annual ticket costs 40 times the weekly price (equivalent to roughly 10 months\' travel for 12 months of access).',
      'Railcards provide further discounts of one-third off most fares. The 16-25 Railcard, 26-30 Railcard, Senior Railcard, Two Together Railcard, Family and Friends Railcard, and Disabled Persons Railcard each cost £30/year. The 16-25 and 26-30 Railcard discounts can also be applied to annual season tickets on some routes.',
      'This calculator compares weekly, monthly and annual season ticket costs for your route. It factors in how many days per week you travel (including working from home) and whether a railcard would save you money. For part-time commuters (2-3 days/week), carnet tickets or flexible season tickets may be better value.',
    ],
    example: {
      title: 'Example: London to Brighton commute, 4 days/week',
      steps: [
        'Daily anytime return: £34.90',
        'Weekly season ticket: £107.70 (saves £31.90 vs 4 daily tickets)',
        'Monthly season ticket: £413.60',
        'Annual season ticket: £4,308 (equivalent to £82.85/week)',
        'Annual with 26-30 Railcard (if eligible): ~£2,872',
        'Saving vs daily tickets (48 weeks): £2,392.80/year',
      ],
    },
    sourceUrl: 'https://www.nationalrail.co.uk/tickets-railcards-and-offers/season-tickets/',
    sourceName: 'National Rail — Season tickets',
    lastUpdated: 'April 2026',
  },
  'driving-test-cost-calculator': {
    howItWorks: [
      'Learning to drive in the UK involves several costs: a provisional driving licence (£34 online, £43 by post), driving lessons, the theory test (£23) and the practical driving test (£62 weekdays, £75 evenings/weekends). The average learner takes 45 hours of professional lessons before passing, though this varies widely.',
      'Driving lesson costs vary by region. The national average is £30-£40 per hour outside London and £35-£50 per hour in London. Block booking (10+ lessons) often provides a 10-15% discount. Intensive courses (30-40 hours over 1-2 weeks) cost £800-£1,500 but get you to test standard faster.',
      'First-year car insurance for a newly qualified driver aged 17-19 averages £1,500-£2,500. A black box (telematics) policy can reduce this by 20-40%. Adding a named experienced driver (not fronting) can also lower premiums. This calculator totals the complete cost of learning to drive and getting on the road.',
    ],
    example: {
      title: 'Example: 18-year-old learner, average progress',
      steps: [
        'Provisional licence: £34',
        'Theory test: £23',
        'Driving lessons (45 hours x £35): £1,575',
        'Practical test (weekday): £62',
        'Total learning cost: £1,694',
        'First-year insurance (estimate): £1,800',
        'Total to get on the road: ~£3,494',
      ],
    },
    sourceUrl: 'https://www.gov.uk/driving-lessons-learning-to-drive',
    sourceName: 'GOV.UK — Learning to drive',
    lastUpdated: 'April 2026',
  },
  'income-protection-calculator': {
    howItWorks: [
      'Income protection insurance pays a regular monthly income if you are unable to work due to illness or injury. Policies typically cover 50-70% of your gross income (insurers cap this to prevent over-insurance). Unlike critical illness cover, income protection pays out for any condition that prevents you from working, not just specified illnesses.',
      'The deferred period (waiting time before payments start) significantly affects the premium. A 4-week deferred period is most expensive, while a 6-month or 12-month deferral can halve the premium. Choose a deferred period that matches your employer\'s sick pay provision or your savings buffer.',
      'UK income protection payouts are tax-free if you pay the premiums yourself. Policies can be set to pay until retirement age, a specific age, or for a fixed period (budget policies). Long-term policies that pay to retirement are more expensive but provide the most comprehensive protection.',
    ],
    example: {
      title: 'Example: Age 35, £45,000 salary, 60% cover to age 67',
      steps: [
        'Monthly income to protect: £45,000 x 60% / 12 = £2,250',
        'Deferred period: 13 weeks (employer sick pay covers first 3 months)',
        'Term: to age 67 (32 years)',
        'Estimated monthly premium: £45-£65',
        'Annual cost: £540-£780 (tax-free payout if claimed)',
      ],
    },
    sourceUrl: 'https://www.moneyhelper.org.uk/en/everyday-money/insurance/income-protection-insurance',
    sourceName: 'MoneyHelper — Income protection',
    lastUpdated: 'April 2026',
  },
  'travel-insurance-calculator': {
    howItWorks: [
      'Travel insurance covers unexpected events while travelling, including medical emergencies, trip cancellation, lost luggage and personal liability. For travel within Europe, a UK Global Health Insurance Card (GHIC) provides access to state healthcare but does not cover repatriation, private treatment or non-medical costs, so insurance is still essential.',
      'Policy types include single trip (one journey), annual multi-trip (all trips in a year, usually capped at 31-45 days per trip), and backpacker/long-stay policies. Annual multi-trip is typically better value if you travel more than twice a year. Key cover levels to check are medical expenses (minimum £2 million for Europe, £5 million for worldwide), cancellation and baggage.',
      'Pre-existing medical conditions must be declared and may increase premiums or require specialist cover. Age is a significant cost factor, with premiums rising sharply over 65. Winter sports, adventure activities and travel to the USA/Canada also increase costs substantially due to high medical treatment costs.',
    ],
    example: {
      title: 'Example: Couple, age 40, 2-week holiday to Spain',
      steps: [
        'Policy type: Single trip, Europe',
        'Medical cover: £5,000,000',
        'Cancellation cover: £5,000',
        'Baggage cover: £1,500',
        'Estimated premium (couple): £25-£45',
        'Annual multi-trip alternative: £60-£100',
      ],
    },
    sourceUrl: 'https://www.moneyhelper.org.uk/en/everyday-money/insurance/travel-insurance',
    sourceName: 'MoneyHelper — Travel insurance',
    lastUpdated: 'April 2026',
  },

  /* ──────────────────────────────────────────────────────────────
     AUTO
     ────────────────────────────────────────────────────────────── */
  'spousal-maintenance-calculator': {
    howItWorks: [
      'Spousal maintenance (previously called alimony) is a regular payment from one ex-spouse to the other after divorce. It is not automatic — it depends on whether one party has a financial need that cannot be met from their own resources, and whether the other party has the ability to pay.',
      'Courts consider the income disparity, each party\'s earning capacity, the standard of living during the marriage and the time needed for the receiving party to become financially independent. Maintenance can be ordered for a fixed term (joint lives with a term) or until remarriage or death.',
      'There is no fixed formula in England and Wales, unlike child maintenance. However, a common guideline used by many solicitors is one-third of the difference between the parties\' incomes. This calculator uses that indicative approach while noting that the court can deviate significantly.',
    ],
    example: {
      title: 'Example: Income disparity after 12-year marriage',
      steps: [
        'Higher earner gross income: £65,000/year',
        'Lower earner gross income: £20,000/year',
        'Income difference: £45,000',
        'Indicative maintenance (1/3 of difference): £15,000/year = £1,250/month',
        'Typical term: 5–7 years for a 12-year marriage (varies widely)',
      ],
    },
    sourceUrl: 'https://www.gov.uk/money-property-when-relationship-ends/maintenance-payments',
    sourceName: 'GOV.UK — Maintenance payments',
    lastUpdated: 'April 2026',
  },
  'gcse-grade-calculator': {
    howItWorks: [
      'GCSEs in England are graded 9 to 1, with 9 being the highest. Grade 7 is broadly equivalent to the old A grade, grade 4 is a standard pass (equivalent to a C) and grade 5 is a strong pass. Grade boundaries vary by subject, exam board and year, as they are set after papers are marked to maintain standards.',
      'This calculator estimates your GCSE grade from raw marks or percentages based on recent grade boundaries. It combines component scores (exam papers and any coursework or controlled assessment) according to the weighting specified by the exam board \u2014 typically Paper 1 and Paper 2 each contribute 50%, though some subjects have three components.',
      'Enter your marks for each component and the calculator applies the correct weighting and maps the total to the most recent grade boundaries. Note that actual boundaries change each year, so this gives an estimate based on the latest published data from AQA, Edexcel, OCR or WJEC.',
    ],
    example: {
      title: 'Example: GCSE Maths (Edexcel Higher), Paper 1: 62/80, Paper 2: 58/80, Paper 3: 55/80',
      steps: [
        'Total raw marks: 62 + 58 + 55 = 175/240',
        'Percentage: 72.9%',
        'Grade boundary reference: Grade 7 \u2248 161, Grade 8 \u2248 185',
        'Estimated grade: 7',
      ],
    },
    sourceUrl: 'https://www.gov.uk/government/organisations/ofqual',
    sourceName: 'Ofqual \u2014 Exam regulation and grade boundaries',
    lastUpdated: 'April 2026',
  },
  'university-cost-calculator': {
    howItWorks: [
      'The total cost of a UK degree extends well beyond tuition fees. For a three-year course starting in 2026/27, tuition alone is £9,535 per year (£28,605 total). Accommodation ranges from £4,500 to £9,500 per year depending on city and type. Living costs (food, transport, social, course materials) add £5,000\u2013£8,000 per year.',
      'This calculator estimates the total cost across 3 or 4 years by combining tuition fees, accommodation, living costs, travel home, and extras. It separates what is covered by student loans from what needs to come from other sources. Many students face a funding gap between their maintenance loan and actual costs.',
      'Enter your chosen university city, accommodation type and course length. The calculator shows a year-by-year and total cost breakdown, highlighting the gap between available student finance and projected expenses. This helps with planning family contributions, savings targets and part-time work hours.',
    ],
    example: {
      title: 'Example: 3-year degree in Leeds, halls then shared house',
      steps: [
        'Tuition: £9,535 \u00D7 3 = £28,605',
        'Accommodation: £6,200 (Y1 halls) + £4,800 \u00D7 2 (house) = £15,800',
        'Living costs: £6,000 \u00D7 3 = £18,000',
        'Total estimated cost: ~£62,400',
        'Maintenance loan (3 years): ~£25,000 \u2014 funding gap: ~£8,800',
      ],
    },
    sourceUrl: 'https://www.gov.uk/student-finance/new-fulltime-students',
    sourceName: 'GOV.UK \u2014 Student finance',
    lastUpdated: 'April 2026',
  },
  'greenhouse-size-calculator': {
    howItWorks: [
      'Greenhouse growing area is calculated as the internal floor space in square feet or square metres, minus any permanent staging, pathways, and structural obstructions. A standard 6ft x 8ft greenhouse provides 48 sq ft of total floor area but approximately 36-40 sq ft of usable growing space after accounting for a central path. The calculator converts your chosen dimensions into both usable ground beds and shelved growing capacity.',
      'Plant capacity depends on species spacing requirements at maturity. Tomato cordons need roughly 3 sq ft per plant (18-inch spacing in rows 24 inches apart). Seedling trays (standard UK seed tray is 14" x 9") hold 24-40 plugs and require about 0.9 sq ft of bench space each. Pepper and aubergine plants need 2.5 sq ft each, while cucumber plants require 4 sq ft for adequate air circulation.',
      'Staging and shelving effectively double your growing area for smaller plants and propagation. A 6ft x 8ft greenhouse with staging along both long walls gains an additional 20-24 sq ft of shelf space. The calculator factors in whether you plan ground-level beds for tall crops (tomatoes, cucumbers) or multi-tier staging for compact plants (herbs, lettuce, seed trays), providing a combined plant count estimate.'
    ],
    example: {
      title: 'Planning capacity for a 8ft x 10ft greenhouse',
      steps: [
        'Total floor area: 8 x 10 = 80 sq ft, minus 2ft central path = approx 64 sq ft usable ground',
        'Ground bed allocation: 6 cordon tomato plants (18 sq ft) + 4 cucumber plants (16 sq ft) = 34 sq ft',
        'Remaining ground space: 30 sq ft for aubergines (4 plants) and peppers (6 plants)',
        'Staging along one 10ft wall (2ft deep): 20 sq ft shelf space for 22 seed trays or 40 herb pots',
        'Total growing capacity: 14 large plants at ground level plus propagation space for 500+ seedlings on staging'
      ]
    },
    sourceUrl: 'https://www.rhs.org.uk/garden-features/greenhouses',
    sourceName: 'RHS - Greenhouse Growing Guide',
    lastUpdated: 'April 2026',
  },
  'pond-volume-calculator': {
    howItWorks: [
      'Pond volume is calculated differently depending on shape. For rectangular ponds: length \u00D7 width \u00D7 average depth. For circular ponds: \u03C0 \u00D7 radius\u00B2 \u00D7 average depth. Irregular ponds are estimated by dividing into sections. Multiply the result in cubic metres by 1,000 to convert to litres. Most garden ponds hold 500\u20135,000 litres.',
      'Knowing your pond volume is essential for fish stocking (the general rule is 50\u201375 litres per centimetre of fish), pump sizing (the pump should circulate the full volume at least once every 1\u20132 hours), filter selection and dosing treatments (algaecides, dechlorinators and fish medications are all dosed per litre).',
      'Enter the pond dimensions and shape. The calculator shows volume in litres and cubic metres, recommended pump flow rate, and stocking capacity. For ponds with shelves or varying depths, use the average depth or calculate each section separately.',
    ],
    example: {
      title: 'Example: Kidney-shaped pond, approx. 3 m \u00D7 2 m, average depth 0.8 m',
      steps: [
        'Approximate as oval: \u03C0 \u00D7 1.5 \u00D7 1.0 \u00D7 0.8 = 3.77 m\u00B3',
        'Volume: 3,770 litres',
        'Pump flow rate: 3,770 \u00F7 1.5 hours \u2248 2,500 litres/hour',
        'Fish stocking: supports ~50\u201375 cm total fish length',
      ],
    },
    sourceUrl: 'https://www.rhs.org.uk/garden-features/ponds',
    sourceName: 'RHS \u2014 Ponds',
    lastUpdated: 'April 2026',
  },
  'side-hustle-tax-calculator': {
    howItWorks: [
      'Income from a side hustle is taxable if it exceeds the £1,000 trading allowance. Below this threshold, you do not need to declare it or register for Self Assessment. Above £1,000, you must register as self-employed with HMRC, file a Self Assessment tax return and pay income tax and Class 4 National Insurance on your profits.',
      'You can choose to either deduct the £1,000 trading allowance from your gross income or deduct your actual expenses instead — whichever gives a lower taxable profit. For side income with minimal expenses, the trading allowance is usually more beneficial. Separate property income allowance of £1,000 also exists for rental income.',
      'Tax on side income is calculated at your marginal rate, which depends on your total income from all sources. If your day job already uses your basic-rate band, side hustle profits may be taxed at the higher rate of 40%. Class 4 NI is 6% on profits between £12,570 and £50,270, then 2% above that.',
    ],
    example: {
      title: 'Example: £8,000 side income, £2,000 expenses, £35,000 day job',
      steps: [
        'Side income: £8,000, Expenses: £2,000',
        'Option A (trading allowance): £8,000 − £1,000 = £7,000 taxable',
        'Option B (actual expenses): £8,000 − £2,000 = £6,000 taxable',
        'Best option: B (actual expenses) — saves tax on £1,000',
        'Tax on £6,000 at 20%: £1,200 + Class 4 NI (6%): £360 = £1,560',
      ],
    },
    sourceUrl: 'https://www.gov.uk/set-up-sole-trader',
    sourceName: 'GOV.UK — Set up as a sole trader',
    lastUpdated: 'April 2026',
  },

  /* ──────────────────────────────────────────────────────────────────────
   * MORTGAGE CATEGORY (44-66)
   * ────────────────────────────────────────────────────────────────────── */
  'employment-tribunal-calculator': {
    howItWorks: [
      'Employment tribunal compensation has two main elements: the basic award and the compensatory award. The basic award for unfair dismissal is calculated like statutory redundancy pay: 0.5 week\'s pay per year of service under age 22, 1 week per year aged 22–40, and 1.5 weeks per year aged 41+, subject to a weekly pay cap (currently £700).',
      'The compensatory award covers financial losses — loss of earnings, loss of pension contributions, loss of statutory rights and expenses. It is capped at the lower of 52 weeks\' pay or £115,115 (2026/27 figure). For discrimination claims, there is no cap on compensation and an award for injury to feelings (Vento bands) may apply.',
      'This calculator estimates both components based on your age, length of service, weekly pay and claim type. It includes the Vento bands for injury to feelings: lower band (£1,200–£11,200), middle band (£11,200–£33,700) and upper band (£33,700–£56,200).',
    ],
    example: {
      title: 'Example: Unfair dismissal, age 35, 6 years\' service, £600/week pay',
      steps: [
        'Basic award: 6 years × 1 week × £600 = £3,600',
        'Loss of earnings (6 months to find new job): 26 × £600 = £15,600',
        'Loss of statutory rights: £500',
        'Total estimated compensation: £19,700',
      ],
    },
    sourceUrl: 'https://www.gov.uk/employment-tribunals',
    sourceName: 'GOV.UK — Employment tribunals',
    lastUpdated: 'April 2026',
  },
  'roof-tiles-calculator': {
    howItWorks: [
      'The number of roof tiles depends on the roof area, tile type and pitch angle. Common UK roof tiles include concrete interlocking (approximately 10 tiles per m\u00B2), clay plain tiles (approximately 60 tiles per m\u00B2) and slate (approximately 20\u201330 per m\u00B2 depending on size). The coverage rate accounts for the overlap (gauge) between rows.',
      'Roof area is measured on the slope, not the floor plan. For a simple pitched roof, each side is calculated as: rafter length \u00D7 eaves-to-eaves width. The rafter length depends on the pitch angle and the horizontal span. At 30\u00B0, the rafter is about 15% longer than the horizontal distance; at 45\u00B0, about 41% longer.',
      'Enter the roof dimensions, pitch angle and tile type. The calculator shows total roof area (on slope), number of tiles, ridge tiles, hip tiles (if applicable) and estimated weight per m\u00B2. Roof weight matters for structural calculations \u2014 concrete tiles weigh approximately 43 kg/m\u00B2, while natural slate is about 30 kg/m\u00B2.',
    ],
    example: {
      title: 'Example: Simple gable roof, 8 m \u00D7 5 m plan, 35\u00B0 pitch, concrete interlocking tiles',
      steps: [
        'Rafter length: 5 \u00F7 2 \u00F7 cos(35\u00B0) = 3.05 m',
        'Each roof side: 8 \u00D7 3.05 = 24.4 m\u00B2',
        'Total roof area: 24.4 \u00D7 2 = 48.8 m\u00B2',
        'Tiles at 10/m\u00B2: 488 tiles + 5% waste = 513 tiles',
        'Ridge tiles: 8 m \u00F7 0.33 m = 25 ridge tiles',
      ],
    },
    sourceUrl: 'https://www.gov.uk/government/publications/building-regulations-approved-document-a-structure',
    sourceName: 'GOV.UK \u2014 Building Regulations Approved Document A',
    lastUpdated: 'April 2026',
  },
  'water-bill-calculator': {
    howItWorks: [
      'UK water bills are charged either on a metered basis (paying for what you use) or an unmetered basis (based on your property\'s rateable value). Metered charges consist of a standing charge plus a rate per cubic metre of water used and a separate rate for sewerage. The average metered household bill is approximately £448 per year.',
      'Whether a meter saves you money depends on your household size and usage. As a rule of thumb, if the number of bedrooms in your home exceeds the number of occupants, a water meter is likely to save you money. Single occupants in large houses benefit most from switching to a meter.',
      'You have a right to request a free water meter installation. If a meter cannot be fitted, you may be offered an assessed charge based on average usage for your household size. This calculator compares your estimated bill on both metered and unmetered charges to show which option is cheaper for your situation.',
    ],
    example: {
      title: 'Example: 2-person household, 3-bed house',
      steps: [
        'Average water usage: 280 litres/day (140 per person)',
        'Annual usage: 102.2 cubic metres',
        'Metered water charge: 102.2 x £1.85 = £189.07',
        'Metered sewerage: 102.2 x £1.95 = £199.29',
        'Standing charges: £84/year',
        'Total metered bill: £472/year',
      ],
    },
    sourceUrl: 'https://www.gov.uk/check-your-water-bill',
    sourceName: 'GOV.UK — Check your water bill',
    lastUpdated: 'April 2026',
  },
  'buy-to-let-yield-calculator': {
    howItWorks: [
      'Buy-to-let yield measures the return on your property investment. Gross yield is the annual rent divided by the property price. Net yield subtracts all running costs including mortgage interest, agent fees, maintenance, insurance and void periods. Return on Investment (ROI) measures the cash return on the actual capital you have invested (your deposit and purchase costs).',
      'Since April 2020, landlords can no longer deduct mortgage interest from rental income. Instead, a 20% tax credit is given on mortgage interest paid. This means higher and additional-rate taxpayer landlords pay significantly more tax than under the old rules. The calculator applies the correct tax credit method.',
      'This calculator produces gross yield, net yield and cash-on-cash ROI. It also factors in capital appreciation scenarios to show total return including equity growth. Enter the property price, rental income, all costs and your tax band to see the full picture.',
      'Gross vs Net yield — why both matter. Gross yield = annual rent / property value × 100. £1,000/month rent on £200k property = 6% gross. Net yield deducts all costs: mortgage interest (often the biggest item), management fees (10-15%), maintenance (1% of property value/year), insurance, void periods, certifications (gas, electrical, EPC, EICR). Same property\'s net yield might be 3-4%. Always use NET to assess viability — gross yields look better than they are.',
      'Regional yield expectations 2026. London 4-5% gross (capital growth focused). South East 5-6%. Manchester/Birmingham/Leeds 6-8%. Liverpool/Sunderland/Bradford 8-10%+. The yield-growth tradeoff: high-yield areas often have weaker capital growth and more management issues (lower-quality tenants, higher voids). Many investors target NET yield above 5% AND realistic capital growth of 3-5%/year for a total return matching equity markets (~8%).',
      'Section 24 tax impact. Since 2017, individual landlords cannot deduct mortgage interest as an expense — only a 20% tax credit applies. For a higher-rate landlord with £8k rent, £3k mortgage interest: pre-2017 taxable income = £5k → tax £2k (40%). Post-2024: taxable income = £8k → tax £3.2k − £600 (20% credit on £3k interest) = £2.6k. Effective tax up 30% for higher-rate landlords. Limited company SPVs (Corporation Tax 25%) sidestep this — increasingly popular.',
      'Beyond yield — leveraged returns. £200k property at 4% net yield = £8k profit. If it appreciates 4%/year = £8k capital gain. Total return = £16k = 8% on £200k unlevered. With 75% LTV (£50k deposit), £4k of mortgage interest reduces profit to £4k, plus £8k capital growth = £12k on £50k = 24% return on equity. This \'gearing\' is what makes BTL attractive — but works both ways: a 4% property price fall = -8% loss on equity.',
    ],
    example: {
      title: 'Example: £200,000 property, £900/month rent, 40% taxpayer',
      steps: [
        'Annual rent: £10,800 — Gross yield: 5.4%',
        'Annual costs (mortgage interest £6,000, agent £1,080, maintenance £1,000, voids £900, insurance £250): £9,230',
        'Net income before tax: £1,570',
        'Tax: £10,800 rental income taxed at 40% = £4,320, less 20% mortgage interest credit (£1,200) = £3,120 tax',
        'Cash ROI on £55,000 invested: (£1,570 − £3,120 + £1,200) ÷ £55,000 = −0.64%',
      ],
    },
    sourceUrl: 'https://www.gov.uk/guidance/changes-to-tax-relief-for-residential-landlords',
    sourceName: 'GOV.UK — Tax relief for residential landlords',
    lastUpdated: 'April 2026',
  },
  'ltv-calculator': {
    quickAnswer: `<strong>LTV = mortgage divided by property value times 100</strong>. Typical UK rate tiers (May 2026): <strong>60% LTV around 4.2% fixed</strong>, 75% around 4.5%, 85% around 4.7%, 90% around 4.9%, 95% around 5.5%. Each 5% drop in LTV typically cuts the rate by 0.2 to 0.3%.`,
    rateTable: { title: `UK Mortgage rates by LTV tier (typical 2-year fix, May 2026)`, html: `<table><thead><tr><th>LTV</th><th>Typical rate</th><th>£200k loan / 25yr</th></tr></thead><tbody><tr><td>60% or less</td><td>4.20%</td><td>£1,074/mo</td></tr><tr><td>75%</td><td>4.50%</td><td>£1,112/mo</td></tr><tr><td>85%</td><td>4.70%</td><td>£1,137/mo</td></tr><tr><td>90%</td><td>4.90%</td><td>£1,163/mo</td></tr><tr><td>95%</td><td>5.50%</td><td>£1,228/mo</td></tr></tbody></table>` },
    howItWorks: [
      'Loan-to-Value (LTV) ratio is the percentage of the property value that you are borrowing. It is calculated as: LTV = (Mortgage amount ÷ Property value) × 100. A £180,000 mortgage on a £200,000 property gives a 90% LTV. The lower your LTV, the better mortgage rates you can access.',
      'UK lenders typically offer their best rates at 60% LTV, with competitive rates up to 75% LTV. Rates increase noticeably above 80% LTV, and again above 90%. The maximum LTV for most residential mortgages is 95%. For buy-to-let, the typical maximum is 75-80%. First-time buyer schemes may offer up to 95% LTV.',
      'This calculator works in both directions: enter a property value and deposit to see your LTV, or enter a target LTV to see what deposit you need. It also shows which LTV tier your deposit places you in and the typical rate difference between tiers.',
      'How LTV bands affect your mortgage rate in practice. UK lenders price mortgages in 5% LTV bands: 60%, 65%, 70%, 75%, 80%, 85%, 90%, 95%. Each step up reduces the rate by ~0.2-0.3 percentage points. As of May 2026, typical 2-year fixed rates are: 60% LTV ~4.20%, 75% ~4.50%, 85% ~4.70%, 90% ~4.90%, 95% ~5.50%. The biggest cliff edges are at 90% (where stress tests get tougher) and 95% (where only government-backed <a href="/calculator/mortgage-affordability-calculator/" class="text-primary underline">Mortgage Guarantee Scheme</a> products apply). Saving for an extra 5% deposit can save £20-£60/month on a £200,000 loan.',
      'First-time buyers and the 95% LTV market. Since 2021, the government-backed <a href="/calculator/mortgage-affordability-calculator/" class="text-primary underline">Mortgage Guarantee Scheme</a> has allowed lenders to offer 95% LTV mortgages on properties up to £600,000 (with government insuring losses above 80% LTV in case of default). The scheme was extended to June 2026 and is expected to be replaced by \'Freedom to Buy\'. First-time buyer 95% products are typically 0.5-1.0% more expensive than 90% LTV. Many lenders also offer 100% LTV via family-assisted products (springboard, family deposit, guarantor) where parents provide collateral.',
      'Why your LTV at remortgage matters more than you think. When your current fixed deal ends, LTV is recalculated based on the current market value, not the original purchase price. If your home has appreciated, your LTV automatically drops — moving you to a better rate band. A house bought for £300,000 with £270,000 mortgage (90% LTV) might be worth £350,000 after 5 years, with mortgage paid down to £240,000 — that is 69% LTV, unlocking the best rates. If values fell, you may be stuck in \'product transfer\' deals rather than able to switch lenders.',
      'Buy-to-let LTV rules are stricter. BTL mortgages typically require 25-40% deposit (60-75% LTV maximum), with PRA rental cover requirements: rent must usually exceed 145% of mortgage interest at a stressed rate of 5.5%. For higher-rate taxpayers and limited company landlords, the calculations differ. Top-slicing (using personal income to cover any rental shortfall) is increasingly common since the 2017 PRA changes. Special purpose vehicles (Ltd companies) for BTL face different LTV caps but allow full mortgage interest tax relief (which individuals lost via Section 24).',
      'Negative equity — what to do if LTV exceeds 100%. If your mortgage balance is higher than the home\'s value (LTV >100%), you are in negative equity. Rare in 2026 due to general price growth, but if it happens: (1) do not panic-sell — if you can afford payments, hold on until values recover; (2) you cannot remortgage with another lender in negative equity, but can usually do a \'product transfer\' with your existing lender; (3) overpayments are highly effective because they directly reduce LTV. The Mortgage Charter (2023) provides borrower protections for those facing payment difficulties.',
    ],
    example: {
      title: 'Example: £275,000 property, £35,000 deposit',
      steps: [
        'Mortgage required: £275,000 − £35,000 = £240,000',
        'LTV: £240,000 ÷ £275,000 × 100 = 87.3%',
        'LTV tier: 85-90% (rates typically 0.3-0.5% higher than 75%)',
        'To reach 75% LTV: deposit needed = £68,750',
        'Extra deposit for 75% tier: £33,750',
      ],
    },
    sourceUrl: 'https://www.fca.org.uk/consumers/mortgages-overview',
    sourceName: 'FCA — Mortgages overview',
    lastUpdated: 'April 2026',
  },
  'stamp-duty-additional-property-calculator': {
    howItWorks: [
      'From October 2024, buyers purchasing additional residential properties in England and Northern Ireland pay a 5% surcharge on top of standard SDLT rates. This applies to second homes, buy-to-let properties and any purchase where you already own a residential property (including jointly). The surcharge is applied to the entire purchase price before the normal band calculations.',
      'The combined rates are: 5% on the first £125,000, 7% on £125,001–£250,000, 10% on £250,001–£925,000, 15% on £925,001–£1.5m and 17% above £1.5m. There is no nil-rate band for additional properties — the 5% surcharge applies from the first pound. Companies buying residential property also pay these higher rates.',
      'You may be able to reclaim the surcharge if you sell your previous main home within three years of buying the new one. This calculator shows the total SDLT with the surcharge, a comparison with standard rates and the surcharge amount separately.',
      'The 5% additional property surcharge — when it applies. If you own (or part-own) ANY other residential property anywhere in the world when you complete on a new purchase, a 5% surcharge applies on top of standard SDLT (raised from 3% in October 2024). Triggered for: buy-to-let, second homes, holiday homes, properties bought for relatives. Companies and trusts buying residential property face 5% surcharge from £40,000 (no nil-rate band).',
      'The 36-month main residence replacement rule. If you buy your new home BEFORE selling your old main residence, you pay the 5% surcharge upfront — but can reclaim it from HMRC if you sell the old property within 36 months. Apply for refund via gov.uk within 12 months of selling the old property. This is critical for chain breaks: many buyers complete on the new property a few weeks before selling the old one and reclaim the surcharge later.',
      'Cohabiting partners and the surcharge.  If you live with someone unmarried and they own a property: when YOU buy a home in your sole name, the surcharge does NOT apply to you (their ownership doesn\'t count). But if you buy jointly with them and they own elsewhere, surcharge applies on the full amount. Married couples and civil partners: spouses are treated as one unit — if either owns property, joint purchases attract surcharge.',
      'How the surcharge stacks with FTB relief. First-time buyer relief is NOT available for additional property purchases — the 5% surcharge applies on top of standard SDLT bands. A £300,000 second home for someone who already owns a main home: standard SDLT = £2,500 (5% on £125k-£250k band only) + 5% surcharge = £15,000 + £2,500 = £17,500. Total tax 5.8% of property price — a significant deterrent to BTL relative to alternatives.',
    ],
    example: {
      title: 'Example: £350,000 second home purchase',
      steps: [
        '£0–£125,000 at 5% (0% + 5% surcharge) = £6,250',
        '£125,001–£250,000 at 7% (2% + 5%) = £8,750',
        '£250,001–£350,000 at 10% (5% + 5%) = £10,000',
        'Total SDLT: £25,000 (effective rate: 7.14%)',
        'Standard rates would be £7,500 — surcharge adds £17,500',
      ],
    },
    sourceUrl: 'https://www.gov.uk/stamp-duty-land-tax/residential-property-rates',
    sourceName: 'GOV.UK — Higher rates for additional properties',
    lastUpdated: 'April 2026',
  },
  'remortgage-calculator': {
    howItWorks: [
      'Remortgaging means replacing your current mortgage with a new deal, either with your existing lender (a product transfer) or a new lender. The most common reason to remortgage is when a fixed-rate period ends and the mortgage reverts to the lender\'s Standard Variable Rate (SVR), which is typically 1-3% higher than available fixed rates.',
      'When comparing deals, you need to factor in the total cost including arrangement fees (£500-£2,000), valuation fees, legal fees and any early repayment charge (ERC) on your current mortgage. A lower interest rate does not always mean a cheaper deal once fees are included. The calculator compares the total cost over the new fixed period.',
      'This calculator compares your current mortgage cost (remaining term at current rate) with a remortgage option. It shows the monthly saving, total saving over the new deal period, the break-even point where savings exceed fees and whether it is worth paying an ERC to switch early.',
    ],
    example: {
      title: 'Example: £180,000 balance, 5.5% SVR to 4.2% fixed',
      steps: [
        'Current payment (5.5%, 20 years): £1,237/month',
        'New payment (4.2%, 20 years): £1,115/month',
        'Monthly saving: £122',
        'Remortgage fees: £1,500 (arrangement + legal)',
        'Break-even: £1,500 ÷ £122 = 12.3 months — saving £1,422 over 2-year fix',
      ],
    },
    sourceUrl: 'https://www.fca.org.uk/consumers/mortgages-overview',
    sourceName: 'FCA — Mortgages overview',
    lastUpdated: 'April 2026',
  },
  'debt-to-income-calculator': {
    howItWorks: [
      'Your debt-to-income ratio (DTI) measures the proportion of your gross monthly income that goes toward debt repayments. Lenders use it as a key affordability indicator when you apply for a mortgage, loan or credit card. A lower ratio signals that you have sufficient income headroom to take on new credit.',
      'To calculate DTI, divide your total monthly debt payments — including mortgage or rent, loan repayments, credit card minimums and any other obligations — by your gross monthly income, then multiply by 100 to get a percentage.',
      'Most UK lenders prefer a DTI below 35–40%. Above 50% is considered high risk and significantly reduces your chances of approval. Reducing your DTI before applying for credit can improve both your approval odds and the interest rate you are offered.',
    ],
    example: {
      title: 'Example: £3,500 gross monthly income',
      steps: [
        'Mortgage payment: £850/month',
        'Car loan: £200/month',
        'Credit card minimum: £75/month',
        'Total monthly debt: £1,125',
        'DTI ratio: £1,125 ÷ £3,500 × 100 = 32.1% — within acceptable range',
      ],
    },
    sourceUrl: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/how-much-can-you-afford-to-borrow',
    sourceName: 'MoneyHelper — How much can you afford to borrow',
    lastUpdated: 'April 2026',
  },
  'apr-calculator': {
    howItWorks: [
      'The Annual Percentage Rate (APR) represents the total annual cost of borrowing, including interest and any mandatory fees, expressed as a single percentage. It allows you to compare loan products on a like-for-like basis even when they have different fee structures or compounding frequencies.',
      'In the UK, all consumer credit advertisements must show a representative APR under FCA rules. The representative APR is the rate that at least 51% of successful applicants will receive. Your personal APR may be higher depending on your creditworthiness.',
      'This calculator converts between flat rates, monthly rates and APR. Enter the loan amount, total interest or fees, and term to see the true APR. It is especially useful for comparing hire purchase, credit card and personal loan offers where headline rates can be misleading.',
    ],
    example: {
      title: 'Example: Comparing a flat rate to APR',
      steps: [
        'Loan: £5,000 over 3 years at 5% flat rate',
        'Total interest at flat rate: £5,000 × 5% × 3 = £750',
        'Monthly payment: £159.72',
        'True APR (calculated): approx. 9.4% — nearly double the flat rate',
      ],
    },
    sourceUrl: 'https://www.fca.org.uk/consumers/understanding-interest-rates',
    sourceName: 'FCA — Understanding interest rates',
    lastUpdated: 'April 2026',
  },
  'bnpl-calculator': {
    howItWorks: [
      'Buy Now Pay Later (BNPL) services like Klarna, Clearpay and PayPal Pay in 3 let you spread payments over weeks or months, often interest-free. However, late payment fees typically range from £6 to £12 per missed instalment, and repeated use can lead to overcommitment across multiple agreements.',
      'From 2025, BNPL providers are expected to be regulated by the FCA, meaning affordability checks and clearer disclosures will become mandatory. BNPL usage is also increasingly visible on credit files, which means missed payments may affect your credit score and future borrowing ability.',
      'This calculator shows the true cost of a BNPL purchase including any late fees. Enter the purchase price, number of instalments and any fees to see the total you actually pay. It also highlights the monthly budget impact of stacking multiple BNPL agreements.',
    ],
    example: {
      title: 'Example: £300 purchase with Pay in 3',
      steps: [
        'Three payments of £100 over 6 weeks — no interest if on time',
        'One missed payment with £6 late fee: total cost £306',
        'Two missed payments: total cost £312',
        'Effective cost of late fees as an interest rate: approx. 24% APR equivalent',
      ],
    },
    sourceUrl: 'https://www.fca.org.uk/consumers/buy-now-pay-later',
    sourceName: 'FCA — Buy now, pay later',
    lastUpdated: 'April 2026',
  },
  'salary-sacrifice-pension-calculator': {
    howItWorks: [
      'Salary sacrifice reduces your gross contractual pay and your employer pays the sacrificed amount directly into your pension. Because the contribution comes from the employer, neither employee National Insurance (8% on earnings £12,570-£50,270) nor employer NI (13.8%) is payable on the sacrificed amount. Under relief at source, you contribute from net pay and only save income tax, not NI — so salary sacrifice is always more efficient when NI applies.',
      'The calculation compares take-home pay under both methods. With relief at source on a £500 monthly contribution from a £40,000 salary, you pay from net pay and reclaim 20% basic rate relief, costing you £400/month. With salary sacrifice, your salary drops by £500 but you save £40 employee NI (8% of £500), so your net pay only drops by £360 — an extra £40/month reaching your pension or pocket.',
      'Your employer also saves 15% NI on the sacrificed amount (£69 on £500). Many employers share part or all of this saving by adding it to your pension contribution. Salary sacrifice reduces your qualifying earnings for State Pension, statutory maternity pay, and mortgage affordability assessments, so the calculator flags when sacrifice would take earnings below the NI lower earnings limit (£6,708) or affect benefit entitlements.'
    ],
    example: {
      title: 'Salary sacrifice vs relief at source on £600/month pension contribution',
      steps: [
        'Gross salary: £45,000/year. Monthly contribution target: £600 gross',
        'Relief at source: £480 from net pay + £120 tax relief = £600 in pension. Employee NI still paid on £600.',
        'Salary sacrifice: salary reduced to £37,800. £600 goes to pension. Employee NI saved: £600 x 8% x 12 = £576/year',
        'Employer NI saved: £600 x 13.8% x 12 = £993.60/year (employer adds 50% to pension = £496.80 extra)',
        'Total annual benefit of salary sacrifice: £576 NI saving + £496.80 employer share = £1,072.80 more per year'
      ]
    },
    sourceUrl: 'https://www.gov.uk/guidance/salary-sacrifice-and-the-effects-on-paye',
    sourceName: 'HMRC',
    lastUpdated: 'April 2026',
  },
  'temperature-converter': {
    howItWorks: [
      'The UK officially uses Celsius for temperature measurement, but Fahrenheit is still commonly understood, especially among older generations and in weather discussions. This converter handles Celsius, Fahrenheit and Kelvin conversions in both directions.',
      'Key reference points: water freezes at 0°C (32°F) and boils at 100°C (212°F). Normal body temperature is approximately 37°C (98.6°F). The NHS considers a fever to be 38°C or above. Oven temperatures are often given in Celsius with a gas mark equivalent in UK recipes.',
    ],
    example: {
      title: 'Example: Common temperature conversions',
      steps: [
        '20°C = 68°F (comfortable room temperature)',
        '37°C = 98.6°F (body temperature)',
        '180°C = 356°F / Gas Mark 4 (moderate oven)',
        '−40°C = −40°F (the point where both scales meet)',
      ],
    },
    sourceUrl: 'https://www.metoffice.gov.uk/weather/learn-about/weather/types-of-weather/temperature/temperature-explained',
    sourceName: 'Met Office — Temperature explained',
    lastUpdated: 'April 2026',
  },
  'length-converter': {
    howItWorks: [
      'UK road signs use miles and yards, but most other measurements are metric. This converter handles metres, centimetres, millimetres, kilometres, feet, inches, yards and miles. It is particularly useful for property listings (square footage), DIY projects and running distances.',
      'Key equivalents: one inch is 2.54 cm exactly, one foot is 30.48 cm, one yard is 0.9144 m, and one mile is 1.60934 km. The converter preserves full precision and also rounds to practical decimal places for everyday use.',
    ],
    example: {
      title: 'Example: Converting 5 feet 10 inches to metric',
      steps: [
        '5 ft 10 in = 70 inches total',
        '70 inches × 2.54 = 177.8 cm',
        '177.8 cm = 1.778 m',
      ],
    },
    sourceUrl: 'https://www.npl.co.uk/si-units/metre',
    sourceName: 'National Physical Laboratory — The metre',
    lastUpdated: 'April 2026',
  },
  'area-converter': {
    howItWorks: [
      'Area conversions are essential for property, land and gardening in the UK. Estate agents use square feet alongside square metres, farmers work in acres and hectares, and planners use hectares. This converter handles all common units including square metres, square feet, square yards, acres and hectares.',
      'Key equivalents: one acre is 4,047 square metres or 0.4047 hectares. One hectare is 10,000 square metres or 2.471 acres. A standard football pitch is approximately 0.71 hectares (1.76 acres). One square metre is 10.764 square feet.',
    ],
    example: {
      title: 'Example: Converting 1,200 square feet',
      steps: [
        '1,200 sq ft = 111.48 sq m',
        '1,200 sq ft = 0.0275 acres',
        '1,200 sq ft = 0.01115 hectares',
      ],
    },
    sourceUrl: 'https://www.gov.uk/guidance/the-land-registry-plans-report',
    sourceName: 'GOV.UK — Land Registry plans',
    lastUpdated: 'April 2026',
  },
  'cooking-converter': {
    howItWorks: [
      'UK recipes use a mix of metric (grams, ml) and imperial (ounces, pints) measurements, while American recipes rely on cups and tablespoons. This converter translates between cups, tablespoons, teaspoons, millilitres, fluid ounces, grams and ounces for common cooking ingredients.',
      'Volume-to-weight conversions depend on the ingredient. A cup of flour weighs approximately 125 g, while a cup of sugar weighs approximately 200 g and a cup of butter weighs approximately 227 g. The calculator adjusts for ingredient density to give accurate gram equivalents for cup measures.',
    ],
    example: {
      title: 'Example: Converting 2 US cups of plain flour',
      steps: [
        '2 US cups flour ≈ 250 g',
        '2 US cups = 473 ml',
        '2 US cups = 32 US tablespoons',
        '2 US cups ≈ 8.8 oz',
      ],
    },
    sourceUrl: 'https://www.bbcgoodfood.com/howto/guide/weights-and-measures',
    sourceName: 'BBC Good Food — Weights and measures',
    lastUpdated: 'April 2026',
  },
  'timezone-converter': {
    howItWorks: [
      'The UK uses Greenwich Mean Time (GMT, UTC+0) in winter and British Summer Time (BST, UTC+1) from the last Sunday in March to the last Sunday in October. This calculator automatically accounts for the current DST status when converting between UK time and other zones.',
      'Many countries change their clocks on different dates or do not observe daylight saving at all. The calculator uses the IANA time zone database to handle these differences accurately. It shows you the current time in both locations and highlights any date-line crossings.',
      'For business scheduling, the tool can show overlapping working hours between two time zones — useful for arranging calls with colleagues or clients in different regions without anyone having to work unsociable hours.',
    ],
    example: {
      title: 'Example: UK to New York',
      steps: [
        'UK time: 14:00 BST (summer)',
        'New York (EDT, UTC−4): 09:00',
        'Time difference: 5 hours behind',
        'Overlapping 9-to-5 hours: 14:00–17:00 UK / 09:00–12:00 NY',
      ],
    },
    sourceUrl: 'https://www.gov.uk/when-do-the-clocks-change',
    sourceName: 'GOV.UK — When do the clocks change',
    lastUpdated: 'April 2026',
  },
  'ilr-calculator': {
    howItWorks: [
      'Indefinite Leave to Remain (ILR) gives you permanent residence in the UK. Most routes require 5 years of continuous lawful residence, though some (such as the partner route) have specific pathways. You must also pass the Life in the UK test and meet English language requirements at B1 level or above.',
      'Continuous residence means you must not have been absent from the UK for more than 180 days in any 12-month period. This calculator checks your eligibility date based on your visa start date, calculates the total costs to date and the ILR application fee, and flags any potential issues with absences.',
      'The ILR application fee is currently £2,885 per person. There is no IHS for ILR itself, but you continue to pay IHS on any visa extensions needed before becoming eligible. The calculator totals everything from your current visa through to ILR.',
    ],
    example: {
      title: 'Example: Skilled Worker visa holder',
      steps: [
        'Visa start date: April 2021',
        'Eligible for ILR: April 2026 (5 years continuous residence)',
        'ILR application fee: £2,885',
        'Life in the UK test: £50',
        'English test (if not already exempt): approx. £170',
        'Total ILR costs: £3,105',
      ],
    },
    sourceUrl: 'https://www.gov.uk/indefinite-leave-to-remain',
    sourceName: 'GOV.UK — Indefinite Leave to Remain',
    lastUpdated: 'April 2026',
  },
  'steps-to-miles-calculator': {
    howItWorks: [
      'Converting steps to distance requires an estimate of stride length. The average stride length for adults is approximately 0.71 m (2.3 ft) for women and 0.76 m (2.5 ft) for men. Height-based estimates use roughly 41\u201345% of height as stride length. More precise measurement involves counting steps over a known 20-metre distance.',
      'This calculator converts your step count into miles and kilometres using your stride length, then estimates calories burned based on your weight and pace. Walking burns roughly 0.04\u20130.06 kcal per step depending on weight and speed. The widely cited 10,000-step target equates to approximately 7\u20138 km (4.5\u20135 miles) for most adults.',
      'The NHS recommends at least 150 minutes of brisk walking per week, which typically works out to around 7,000\u20138,000 steps per day at moderate intensity. Enter your step count, height (or stride length) and weight to see distance and calorie estimates.',
    ],
    example: {
      title: 'Example: 10,000 steps, stride length 0.75 m, 80 kg',
      steps: [
        'Distance: 10,000 \u00D7 0.75 m = 7,500 m = 7.5 km',
        'Converted: 7.5 \u00F7 1.609 = 4.66 miles',
        'Estimated calories: ~400 kcal (brisk walking, 80 kg)',
      ],
    },
    sourceUrl: 'https://www.nhs.uk/live-well/exercise/exercise-guidelines/physical-activity-guidelines-for-adults-aged-19-to-64/',
    sourceName: 'NHS \u2014 Physical activity guidelines',
    lastUpdated: 'April 2026',
  },
  'heart-rate-zone-calculator': {
    howItWorks: [
      'Heart rate training zones are calculated as percentages of your maximum heart rate (MHR). The simplest estimate of MHR is 220 minus your age. The calculator divides the range from resting heart rate to MHR into five zones: Zone 1 (50\u201360%, warm-up), Zone 2 (60\u201370%, fat burn), Zone 3 (70\u201380%, aerobic), Zone 4 (80\u201390%, threshold) and Zone 5 (90\u2013100%, VO2 max).',
      'For greater accuracy, the Karvonen method uses your resting heart rate to calculate a heart rate reserve (HRR = MHR \u2212 resting HR), then applies zone percentages to HRR and adds back the resting heart rate. This produces personalised zones that reflect your fitness level.',
      'Zone 2 training is recommended for building an aerobic base and efficient fat oxidation. The NHS recommends at least 150 minutes of moderate-intensity activity per week (roughly Zone 2\u20133) or 75 minutes of vigorous activity (Zone 4\u20135). Enter your age and resting heart rate to see your personalised zones.',
    ],
    example: {
      title: 'Example: Age 35, resting heart rate 65 bpm',
      steps: [
        'Estimated MHR: 220 \u2212 35 = 185 bpm',
        'Heart rate reserve: 185 \u2212 65 = 120 bpm',
        'Zone 2 (60\u201370%): 65 + (120 \u00D7 0.60) to 65 + (120 \u00D7 0.70) = 137\u2013149 bpm',
        'Zone 4 (80\u201390%): 65 + (120 \u00D7 0.80) to 65 + (120 \u00D7 0.90) = 161\u2013173 bpm',
      ],
    },
    sourceUrl: 'https://www.nhs.uk/live-well/exercise/exercise-guidelines/physical-activity-guidelines-for-adults-aged-19-to-64/',
    sourceName: 'NHS \u2014 Physical activity guidelines for adults',
    lastUpdated: 'April 2026',
  },
  'probability-calculator': {
    howItWorks: [
      'Probability measures the likelihood of an event occurring, expressed as a number between 0 (impossible) and 1 (certain). This calculator handles simple probability, compound events (AND/OR), conditional probability and permutations and combinations.',
      'For independent events, the probability of A AND B is P(A) × P(B). For mutually exclusive events, the probability of A OR B is P(A) + P(B). For non-mutually exclusive events, P(A OR B) = P(A) + P(B) − P(A AND B). The calculator selects the correct formula based on your inputs.',
      'Combinations (nCr) count selections where order does not matter, such as lottery draws. Permutations (nPr) count arrangements where order matters. The calculator computes both using the factorial formula and displays results as a whole number and as a probability.',
    ],
    example: {
      title: 'Example: Probability of drawing two red cards from a deck',
      steps: [
        'Red cards in a standard deck: 26 out of 52',
        'First draw: 26/52 = 1/2',
        'Second draw (without replacement): 25/51',
        'Combined: 1/2 × 25/51 = 25/102 ≈ 0.245 (24.5%)',
      ],
    },
    sourceUrl: 'https://www.bbc.co.uk/bitesize/guides/zp4fcdm/revision/1',
    sourceName: 'BBC Bitesize — Probability',
    lastUpdated: 'April 2026',
  },
  'annual-tax-summary-calculator': {
    howItWorks: [
      'Each year HMRC publishes a breakdown showing how your income tax and National Insurance contributions are spent by the government. The Annual Tax Summary divides spending into categories such as Health (NHS), Welfare, State Pensions, Education, Defence, Transport, Public Order and Safety, and Government Debt Interest.',
      'For 2026/27, the largest share of tax goes to Health (around 20%), followed by Welfare (around 19%) and State Pensions (around 13%). The summary uses published Treasury data on departmental spending to calculate your personal share based on the total tax and NI you paid during the year.',
      'This calculator takes your income tax and NI figures and produces a visual pie chart showing exactly where your money goes. It helps taxpayers understand the real-world impact of their contributions and can be useful for financial literacy and personal budgeting decisions.',
    ],
    example: {
      title: 'Example: £8,000 total tax and NI paid',
      steps: [
        'Health (NHS): £8,000 × 20.2% = £1,616',
        'Welfare: £8,000 × 19.1% = £1,528',
        'State Pensions: £8,000 × 12.8% = £1,024',
        'Education: £8,000 × 11.5% = £920',
        'Defence: £8,000 × 5.3% = £424',
      ],
    },
    sourceUrl: 'https://www.gov.uk/annual-tax-summary',
    sourceName: 'GOV.UK — Annual Tax Summary',
    lastUpdated: 'April 2026',
  },
  'business-rates-calculator': {
    howItWorks: [
      'Business rates are calculated by multiplying your property\'s rateable value (RV) by the applicable multiplier set annually by the government. For 2026/27, the standard multiplier is 51.2p in the pound for properties with an RV of \u00a351,000 or above, and the small business multiplier is 49.9p for properties below that threshold. The rateable value is an estimate of the open-market annual rent for the property as assessed by the Valuation Office Agency (VOA).',
      'Small Business Rate Relief (SBRR) applies if your single property has an RV below \u00a315,000. Properties with an RV of \u00a312,000 or below receive 100% relief\u2014paying zero business rates. Between \u00a312,001 and \u00a315,000, the relief tapers on a sliding scale. If you occupy multiple properties, your eligibility is based on the combined RV, and SBRR may be reduced or unavailable.',
      'Additional reliefs may apply: rural rate relief for shops and post offices in designated rural areas, charitable relief at 80% for qualifying charities, and the retail/hospitality/leisure relief scheme which has provided up to 75% discount in recent years. Transitional relief caps annual increases or decreases following a revaluation to smooth bill changes. Your local council issues the bill and administers collection.',
      'How business rates are calculated. Your annual rates bill = Rateable Value × the Uniform Business Rate (UBR) multiplier. For 2026/27, the standard multiplier is 49.9p and the small business multiplier (for properties with RV under £51,000) is 49.9p as of April 2026. Rateable Value is set by the Valuation Office Agency (VOA) based on what the property would let for on an open market on a specific \'valuation date\' — currently 1 April 2021 for the 2023 rating list. A £15,000 RV at the small business multiplier costs £7,485/year before reliefs.',
      'Small Business Rate Relief (SBRR). If your property has a rateable value of £12,000 or less, you pay no business rates at all (100% relief). For RV between £12,001 and £15,000, relief tapers linearly from 100% to 0%. To qualify, you must occupy only one property OR additional properties must each have RV under £2,899 and total RV under £20,000 (£28,000 in London). SBRR is not automatic in some councils — check your bill and apply via your local council if missing. SBRR can save up to £6,000/year for a small business.',
      'Retail, Hospitality and Leisure (RHL) Relief. For 2026/27, eligible retail, hospitality and leisure properties receive 40% relief on bills (down from 75% in 2024/25), capped at £110,000 per business. Eligible properties include shops, restaurants, cafés, pubs, cinemas, music venues, hotels, gyms and similar. The relief is in addition to SBRR — a small shop can stack both. Apply via your local council; for some councils it is automatic.',
      'Revaluations and the transitional relief. The VOA revalues all 2 million rateable properties periodically (most recently 2023, next in 2026). When revaluation shifts your bill significantly, transitional relief caps the year-on-year increase: 5% in year 1, 7.5% in year 2, 10% in year 3 for small businesses; 15%, 25%, 40% for medium; 30%, 40%, 55% for large. There is no transitional downward limit — bill reductions take effect immediately. The 2026 revaluation may affect your rates significantly — check the VOA\'s online check service.',
      'Appeals — Check, Challenge, Appeal. If you believe your Rateable Value is wrong, you can use the VOA\'s three-stage process: (1) Check — confirm the basic facts (square footage, classification) on GOV.UK; (2) Challenge — submit evidence within 4 months that the valuation is incorrect; (3) Appeal — escalate to the Valuation Tribunal if Challenge is rejected. ~30% of Challenges succeed in reducing RV. Pre-2023 ratings could be appealed by retrospective claim, recovering overpaid rates for up to 6 years.',
    ],
    example: {
      title: 'Business rates for a shop with \u00a320,000 rateable value',
      steps: [
        'Rateable value of the property: \u00a320,000.',
        'Property RV is below \u00a351,000, so the small business multiplier applies: 49.9p.',
        'Basic rates bill: \u00a320,000 \u00d7 0.499 = \u00a39,980 per year.',
        'RV exceeds \u00a315,000, so no Small Business Rate Relief applies.',
        'Annual business rates payable: \u00a39,980, typically paid in 10 monthly instalments of \u00a3998.'
      ]
    },
    sourceUrl: 'https://www.gov.uk/apply-for-business-rate-relief/small-business-rate-relief',
    sourceName: 'GOV.UK \u2013 Business Rate Relief',
    lastUpdated: 'April 2026',
  },
  'rd-tax-credit-calculator': {
    howItWorks: [
      'From 1 April 2024, the UK operates a merged R&D tax relief scheme replacing the previous separate SME and RDEC schemes. Under the merged scheme, qualifying companies receive a taxable above-the-line credit of 20% on eligible R&D expenditure. This credit is calculated on the total qualifying costs\u2014staff costs, software, consumables, subcontracted R&D (at 65% of cost for connected parties), and externally provided workers (at 65%)\u2014minus any grant or subsidised income related to the R&D.',
      'R&D-intensive SMEs\u2014companies where qualifying R&D expenditure represents 30% or more of total expenditure\u2014receive an enhanced rate of 27% under the Enhanced R&D Intensive Support (ERIS) scheme. Loss-making R&D-intensive companies can surrender losses for a payable tax credit at a higher rate, providing vital cash flow for pre-revenue startups. To qualify as R&D, the project must seek an advance in science or technology by resolving scientific or technological uncertainty that a competent professional could not readily deduce.',
      'Claims are made through the Corporation Tax return (CT600) and must include a detailed technical narrative explaining the R&D activities, the uncertainties faced, and how they were addressed. From April 2023, all claims must also be supported by a pre-notification to HMRC (if the company has not claimed in the previous three years) and include a named senior officer of the company endorsing the claim. HMRC actively investigates claims, so maintaining contemporaneous project records, timesheets, and technical documentation is critical.'
    ],
    example: {
      title: 'R&D credit for a software company with \u00a3200,000 qualifying spend',
      steps: [
        'Qualifying R&D expenditure: staff \u00a3150,000 + cloud computing \u00a330,000 + subcontractors (65% of \u00a340,000) \u00a326,000 = \u00a3206,000.',
        'Merged scheme credit: \u00a3206,000 \u00d7 20% = \u00a341,200 taxable credit.',
        'Company has \u00a3100,000 taxable profit. Credit reduces CT liability: \u00a3100,000 \u00d7 25% = \u00a325,000 CT, offset by \u00a341,200 credit.',
        'Tax on the credit itself: \u00a341,200 \u00d7 25% = \u00a310,300. Net benefit: \u00a341,200 \u2212 \u00a310,300 = \u00a330,900.',
        'Effective tax position: \u00a325,000 CT \u2212 \u00a330,900 net credit = -\u00a35,900 (refundable or carried forward).'
      ]
    },
    sourceUrl: 'https://www.gov.uk/guidance/corporation-tax-research-and-development-rd-relief',
    sourceName: 'GOV.UK \u2013 R&D Tax Relief',
    lastUpdated: 'April 2026',
  },
  'cis-calculator': {
    howItWorks: [
      'Under the Construction Industry Scheme (CIS), contractors must deduct tax at source from payments made to subcontractors for construction operations. The standard deduction rate is 20% and applies to the labour element of each payment. Material costs that the subcontractor has incurred are excluded from the deduction, provided the subcontractor provides evidence such as supplier invoices. The contractor then pays the withheld amount to HMRC on behalf of the subcontractor.',
      'Subcontractors can apply for gross payment status (0% deduction) if they meet HMRC\'s turnover, compliance, and business tests. Unverified subcontractors\u2014those not registered with HMRC under CIS or whose details cannot be confirmed\u2014face a higher 30% deduction rate. Contractors must verify each new subcontractor with HMRC before making the first payment, using the online verification service.',
      'Contractors file monthly CIS returns by the 19th of each month, reporting all payments made to subcontractors and the deductions applied. Subcontractors offset their CIS deductions against their Self Assessment or Corporation Tax liability at the end of the year. If total CIS deductions exceed the tax owed, the subcontractor receives a refund. Accurate record-keeping of gross payment amounts, material deductions, and CIS deductions is mandatory for both parties.'
    ],
    example: {
      title: 'CIS deduction on a \u00a35,000 subcontractor payment',
      steps: [
        'Total invoice from verified subcontractor: \u00a35,000.',
        'Materials element supported by receipts: \u00a31,200.',
        'Labour element subject to CIS: \u00a35,000 \u2212 \u00a31,200 = \u00a33,800.',
        'CIS deduction at 20%: \u00a33,800 \u00d7 0.20 = \u00a3760.',
        'Net payment to subcontractor: \u00a35,000 \u2212 \u00a3760 = \u00a34,240. The \u00a3760 is paid to HMRC.'
      ]
    },
    sourceUrl: 'https://www.gov.uk/what-is-the-construction-industry-scheme',
    sourceName: 'GOV.UK \u2013 Construction Industry Scheme',
    lastUpdated: 'April 2026',
  },
  'pet-insurance-calculator': {
    howItWorks: [
      'Pet insurance in the UK covers veterinary treatment costs if your pet becomes ill or is injured. There are four main policy types: accident only (cheapest, covers injuries only), time-limited (covers each condition for 12 months), maximum benefit (covers each condition up to a set amount with no time limit), and lifetime (the most comprehensive, renewing the benefit limit each year).',
      'Premiums are determined by your pet\'s breed, age, location and the cover level chosen. Certain breeds are significantly more expensive to insure due to hereditary conditions: French Bulldogs, Cavalier King Charles Spaniels and purebred cats like Bengals often attract higher premiums. Average annual premiums range from £200-£400 for dogs and £150-£300 for cats.',
      'Lifetime policies are generally recommended as they provide ongoing cover for chronic conditions such as diabetes, arthritis and allergies. Excess is usually a combination of a fixed amount (£75-£250) plus a percentage co-payment (10-20%), which increases as pets get older.',
    ],
    example: {
      title: 'Example: Labrador Retriever, age 3, lifetime cover',
      steps: [
        'Breed: Labrador Retriever (medium risk)',
        'Annual vet fee limit: £7,000',
        'Fixed excess: £100 per claim',
        'Co-payment: 0% (under age 8)',
        'Estimated annual premium: £350-£500',
        'Monthly cost: £29-£42',
      ],
    },
    sourceUrl: 'https://www.fca.org.uk/consumers/pet-insurance',
    sourceName: 'FCA — Pet insurance',
    lastUpdated: 'April 2026',
  },
  'student-maintenance-loan-calculator': {
    howItWorks: [
      'The maintenance loan helps cover living costs while studying. For 2026/27, the maximum loan depends on where you live and study: up to £13,022 if living away from home in London, £9,978 if living away outside London and £8,400 if living with parents. Final-year students receive slightly less.',
      'The loan is means-tested on household income. Students from households earning £25,000 or below receive the full amount. Above this, the loan is reduced gradually \u2014 the taper rate is roughly £1 less for every £5.84 of household income above £25,000. The minimum loan (for the highest earners) is £4,767 regardless of income.',
      'Enter your household income, where you plan to live and your year of study. The calculator applies the correct taper rate and shows your estimated annual and termly loan amount. Scottish, Welsh and Northern Irish students have separate systems and should use the appropriate devolved calculator.',
    ],
    example: {
      title: 'Example: Household income £40,000, living away from home outside London',
      steps: [
        'Maximum loan: £9,978',
        'Income above threshold: £40,000 \u2212 £25,000 = £15,000',
        'Reduction: £15,000 \u00F7 £5.84 \u2248 £2,568',
        'Estimated loan: £9,978 \u2212 £2,568 = £7,410/year',
        'Per term (3 terms): ~£2,470',
      ],
    },
    sourceUrl: 'https://www.gov.uk/student-finance/new-fulltime-students',
    sourceName: 'GOV.UK \u2014 Student finance for new full-time students',
    lastUpdated: 'April 2026',
  },
  'boiler-replacement-calculator': {
    howItWorks: [
      'If your gas boiler is over 10-15 years old, replacing it with a modern condensing boiler or a heat pump can significantly reduce your energy bills. A new A-rated condensing gas boiler costs £2,000-£4,000 installed and operates at 90-94% efficiency compared to 60-80% for many older boilers.',
      'The Boiler Upgrade Scheme (BUS) provides grants of £7,500 towards the cost of an air source or ground source heat pump, making them a viable alternative to a straight boiler replacement. To qualify, your home must have an EPC rating of D or better (or you must install insulation improvements first), and the scheme applies to England and Wales only.',
      'This calculator compares the costs and savings of three options: replacing with a new gas boiler, installing an air source heat pump with the BUS grant, or installing a ground source heat pump with the grant. It factors in installation costs, annual running costs, maintenance and the projected payback period for each option.',
    ],
    example: {
      title: 'Example: Replacing a 20-year-old boiler (65% efficiency)',
      steps: [
        'Current annual gas cost (65% boiler): £1,130',
        'New gas boiler (93% efficiency): £790/year — saving £340',
        'New boiler cost: £3,000, payback: 8.8 years',
        'ASHP (COP 3, with BUS grant): cost £4,500, running £980/year',
        'ASHP saving vs old boiler: £150/year at current tariffs',
        'ASHP payback: ~30 years (improves with solar/low tariff)',
      ],
    },
    sourceUrl: 'https://www.gov.uk/apply-boiler-upgrade-scheme',
    sourceName: 'GOV.UK — Boiler Upgrade Scheme',
    lastUpdated: 'April 2026',
  },
  'double-glazing-calculator': {
    howItWorks: [
      'Double glazing replaces single-pane windows with sealed units containing two panes of glass separated by an insulating gap (typically 16mm of argon gas). This significantly reduces heat loss — a single-glazed window has a U-value of around 5.0 W/m2K, while standard double glazing achieves 1.4 W/m2K, and triple glazing reaches 0.8 W/m2K.',
      'The cost of double glazing depends on window count, size, frame material (uPVC is cheapest at £300-£600 per window, timber £400-£800, aluminium £500-£900) and whether you need new frames or just replacement glass units. A typical 3-bed semi with 10 windows costs £4,000-£8,000 for full uPVC double glazing.',
      'Energy savings from replacing single glazing with double glazing are estimated at £100-£200 per year by the Energy Saving Trust. The payback period is long (20-40 years on energy savings alone), so double glazing is best justified by combined benefits: energy saving, noise reduction, security improvement and property value increase.',
    ],
    example: {
      title: 'Example: 3-bed semi, 10 windows, replacing single glazing',
      steps: [
        'Number of windows: 10 (mix of sizes)',
        'Frame type: uPVC (A+ rated)',
        'Average cost per window: £550',
        'Total installation cost: £5,500',
        'Estimated annual energy saving: £150',
        'Simple payback: 36.7 years (energy only)',
        'Property value uplift: £2,000-£5,000',
      ],
    },
    sourceUrl: 'https://energysavingtrust.org.uk/advice/windows-and-doors/',
    sourceName: 'Energy Saving Trust — Windows and doors',
    lastUpdated: 'April 2026',
  },
  'weight-loss-calculator': {
    howItWorks: [
      'This calculator works out the daily calorie deficit needed to reach your target weight by a chosen date. One kilogram of body fat stores approximately 7,700 kcal, so a deficit of 500 kcal per day produces roughly 0.5 kg of weight loss per week. The NHS recommends a safe rate of 0.5\u20131.0 kg per week.',
      'The calculator estimates your Total Daily Energy Expenditure (TDEE) using the Mifflin-St Jeor equation and your activity level, then subtracts the required daily deficit. It flags any target that requires a deficit larger than 1,000 kcal per day or a calorie intake below 1,200 kcal (women) or 1,500 kcal (men), as these can be unsustainable.',
      'Enter your current weight, target weight, goal date and activity level. The calculator shows daily calories, expected weekly loss rate and whether the timeline is realistic. Extending the deadline by a few weeks can often make the difference between a healthy deficit and an extreme one.',
    ],
    example: {
      title: 'Example: 90 kg to 80 kg in 20 weeks, moderately active male',
      steps: [
        'Weight to lose: 10 kg (77,000 kcal total deficit)',
        'Daily deficit needed: 77,000 \u00F7 140 days = 550 kcal/day',
        'TDEE estimate: 2,650 kcal',
        'Daily calorie target: 2,650 \u2212 550 = 2,100 kcal',
        'Expected rate: ~0.5 kg/week (healthy range)',
      ],
    },
    sourceUrl: 'https://www.nhs.uk/live-well/healthy-weight/managing-your-weight/12-tips-to-help-you-lose-weight/',
    sourceName: 'NHS \u2014 12 tips to help you lose weight',
    lastUpdated: 'April 2026',
  },
  'protein-intake-calculator': {
    howItWorks: [
      'Protein requirements depend on body weight, activity level and training goals. The UK Reference Nutrient Intake (RNI) is 0.75 g per kilogram of body weight per day for sedentary adults. Active individuals and those doing strength training typically need 1.2\u20132.0 g/kg to support muscle repair and growth.',
      'This calculator takes your weight, activity level and goal to produce a personalised daily protein target in grams. It also shows how to distribute protein across meals, since research suggests spreading intake evenly (20\u201340 g per meal) maximises muscle protein synthesis.',
      'Good UK protein sources include chicken breast (~31 g per 100 g), tinned tuna (~25 g), eggs (~6 g each), Greek yoghurt (~10 g per 100 g) and lentils (~9 g per 100 g cooked). Meeting higher targets often requires planning meals around a protein source first.',
    ],
    example: {
      title: 'Example: 80 kg, strength training 4 times per week',
      steps: [
        'Recommended range: 1.6\u20132.0 g/kg',
        'Lower target: 80 \u00D7 1.6 = 128 g/day',
        'Upper target: 80 \u00D7 2.0 = 160 g/day',
        'Per meal (4 meals): 32\u201340 g protein each',
      ],
    },
    sourceUrl: 'https://www.nhs.uk/live-well/eat-well/food-types/meat-and-fish/',
    sourceName: 'NHS \u2014 Meat, fish and protein',
    lastUpdated: 'April 2026',
  },
  'ovulation-calculator': {
    howItWorks: [
      'Ovulation typically occurs 12\u201316 days before the start of your next period. For a 28-day cycle, this means around day 14. The fertile window spans approximately 6 days: the 5 days before ovulation (sperm can survive up to 5 days) plus the day of ovulation itself (the egg survives 12\u201324 hours).',
      'This calculator estimates your ovulation day and fertile window based on your cycle length and the first day of your last period. For regular cycles, it counts back 14 days from the expected next period. For irregular cycles, it provides a broader estimated range and recommends additional tracking methods.',
      'The NHS advises that the most accurate way to confirm ovulation is with ovulation predictor kits (OPKs), which detect the LH surge 24\u201336 hours before ovulation. Basal body temperature tracking and cervical mucus monitoring can also help. If you have been trying to conceive for 12 months (or 6 months if over 35), the NHS recommends speaking to your GP.',
    ],
    example: {
      title: 'Example: Last period 1 April 2026, 30-day cycle',
      steps: [
        'Expected next period: 1 May 2026',
        'Estimated ovulation: 1 May \u2212 14 days = 17 April 2026',
        'Fertile window: 12\u201317 April 2026',
        'Most fertile days: 15\u201317 April 2026',
      ],
    },
    sourceUrl: 'https://www.nhs.uk/pregnancy/trying-for-a-baby/how-to-get-pregnant/',
    sourceName: 'NHS \u2014 How to get pregnant',
    lastUpdated: 'April 2026',
  },
  'car-lease-vs-buy-calculator': {
    howItWorks: [
      'Leasing (Personal Contract Hire) means paying a fixed monthly amount to use a car for 2-4 years with no option to own it at the end. You never own the vehicle, but monthly costs are predictable and often include maintenance packages. Mileage limits apply (typically 8,000-15,000 miles/year) with excess charges of 5-15p per mile.',
      'Buying outright or through HP means you own the car and can sell it whenever you choose. The true cost of buying includes depreciation, interest (if financed), insurance, maintenance and road tax. Buying is typically cheaper over 5+ years if you keep the car long enough for depreciation to slow down.',
      'This calculator compares the total cost of leasing versus buying over your chosen period. It accounts for the deposit, monthly payments, maintenance, depreciation (for buying) and the residual value of the car if you buy. The breakeven point — where buying becomes cheaper than leasing — is usually around 4-5 years.',
    ],
    example: {
      title: 'Example: £28,000 car, 3-year comparison, 10,000 miles/year',
      steps: [
        'Lease: £300/month x 36 + £900 initial = £11,700 total',
        'Buy (HP): £520/month x 36 + £2,800 deposit = £21,520 paid',
        'Car value after 3 years: ~£14,000',
        'Net cost of buying: £21,520 - £14,000 = £7,520',
        'Leasing costs £4,180 more over 3 years (but includes maintenance)',
      ],
    },
    sourceUrl: 'https://www.fca.org.uk/consumers/car-finance',
    sourceName: 'FCA — Car finance guidance',
    lastUpdated: 'April 2026',
  },
  'sole-trader-vs-ltd-calculator': {
    howItWorks: [
      'A sole trader pays Income Tax and National Insurance directly on all business profits. The tax rates are personal rates: 20%/40%/45% IT bands plus Class 4 NI (6%/2%) — Class 2 NI was abolished in April 2024. Setup is immediate\u2014register with HMRC and start trading. There is no legal separation between you and the business, meaning personal assets are exposed to business liabilities. Accounting requirements are minimal: simple income/expenses records and an annual Self Assessment return.',
      'A limited company pays Corporation Tax on profits at 19% (profits under \u00a350,000) scaling to 25% (profits over \u00a3250,000), with marginal relief between those thresholds. The director/shareholder then extracts profits via a combination of salary and dividends. This two-stage extraction (CT then dividend tax) is often cheaper than sole trader rates at higher profit levels because dividends avoid National Insurance entirely. However, the company must file annual accounts with Companies House, maintain statutory registers, and comply with more complex regulatory obligations.',
      'The crossover point where a limited company becomes more tax-efficient than sole trading typically falls between \u00a330,000 and \u00a345,000 of annual profit, depending on the director\'s other income and personal circumstances. Below this level, the administrative cost and complexity of a limited company often outweigh the modest tax saving. Above \u00a350,000 profit, the combined CT plus dividend tax route usually saves several thousand pounds per year compared with sole trader IT and NI. Other factors include liability protection, pension contribution options, and the perceived credibility of a limited company structure.'
    ],
    example: {
      title: 'Tax comparison at \u00a360,000 profit',
      steps: [
        'Sole trader: IT on \u00a360,000 = \u00a311,432 + Class 4 \u00a32,557 = \u00a313,989 total. Take-home: \u00a346,011.',
        'Ltd: salary \u00a312,570 (IT \u00a30, NI \u00a30). Remaining profit: \u00a347,430.',
        'Corporation Tax at 19%: \u00a39,012. Post-CT profit: \u00a338,418 paid as dividends.',
        'Dividend tax: \u00a3500 allowance free, \u00a337,918 \u00d7 8.75% = \u00a33,318.',
        'Ltd total tax: \u00a39,012 + \u00a33,318 = \u00a312,330. Take-home: \u00a347,670. Annual saving: \u00a31,838.'
      ]
    },
    sourceUrl: 'https://www.gov.uk/set-up-limited-company',
    sourceName: 'GOV.UK \u2013 Set Up a Limited Company',
    lastUpdated: 'April 2026',
  },
  'pension-credit-calculator': {
    howItWorks: [
      'Pension Credit has two elements assessed independently. Guarantee Credit tops up weekly income to a minimum level: £218.15 for single claimants or £332.95 for couples in 2026/27. Your qualifying income includes State Pension, private pensions, earnings, and most benefits. If your assessed income falls below the appropriate minimum guarantee, the shortfall is paid as Guarantee Credit.',
      'Savings Credit rewards people who made modest provision for retirement beyond the basic State Pension. It is only available to those who reached State Pension age before 6 April 2016. The maximum Savings Credit is £17.01 per week for singles or £19.04 for couples. It is calculated by taking 60% of qualifying income above the Savings Credit threshold (£189.80 single, £301.22 couple), then reducing by 40% of any income above the Guarantee Credit minimum.',
      'Certain income is disregarded from the assessment: the first £10,000 of capital is ignored entirely, and each £500 (or part thereof) of capital between £10,000 and £99,999 counts as £1 per week of deemed income. Unlike means-tested benefits for working-age claimants, there is no upper capital limit that disqualifies you from Pension Credit entirely.',
      'What is Pension Credit and who qualifies? Pension Credit tops up your weekly income to a guaranteed minimum if you\'ve reached State Pension age (66 in 2026, rising to 67 from 2028). Two parts: (1) Guarantee Credit tops you up to £227.10/week single or £346.60/week couple (2026/27); (2) Savings Credit (closed to new claimants since April 2016) rewards modest pension/savings above basic State Pension — still paid to existing recipients.',
      'Pension Credit unlocks much more than the top-up. Receiving even £1/week of Pension Credit triggers entitlement to: free TV licence (over 75), Council Tax Reduction, Housing Benefit, Cold Weather Payments, Warm Home Discount, free dental treatment, glasses vouchers, NHS prescription charges exemption, Carer\'s Allowance bonus, and Christmas Bonus £10. Total annual value can exceed £4,000-£8,000 — making the £52/week guarantee credit alone potentially worth £10k+ in combined benefits.',
      'Why 850,000 eligible pensioners don\'t claim. DWP estimates around 850,000 pensioners are eligible but not claiming Pension Credit — losing on average £2,500/year cash benefit plus access to all linked benefits. Reasons: don\'t realise they qualify (especially homeowners), shame around \'benefits\', complex application form, fear of capital limits (no upper limit on capital — but income from savings reduces credit). The DWP Money Champions initiative since 2023 has pushed take-up but coverage remains 60-65%.',
      'How to claim and what counts as income. Apply via gov.uk/pension-credit or 0800 99 1234. Required info: NI number, bank details, income (State Pension, private pensions, employment, savings), housing costs, partner details. Capital under £10,000 is ignored; £10,001-£16,000 generates \'tariff income\' (£1/week per £500 over £10k); savings ISA growth treated as income but not capital. Three-month backdating available — apply ASAP if eligibility goes back further.',
    ],
    example: {
      title: 'Single pensioner with State Pension and savings',
      steps: [
        'Weekly State Pension income: £185.50',
        'Savings of £18,000: first £10,000 ignored, remaining £8,000 = 16 x £1 = £16/week deemed income',
        'Total assessed weekly income: £185.50 + £16.00 = £201.50',
        'Guarantee Credit minimum for single person: £218.15',
        'Guarantee Credit payable: £218.15 - £201.50 = £16.65 per week (£866 per year)'
      ]
    },
    sourceUrl: 'https://www.gov.uk/pension-credit/eligibility',
    sourceName: 'GOV.UK - Pension Credit',
    lastUpdated: 'April 2026',
  },
  'housing-benefit-calculator': {
    howItWorks: [
      'Housing Benefit helps with rent costs for people on low incomes who have not yet moved to Universal Credit. The amount you receive depends on your eligible rent, household size, income and savings. If your savings exceed £16,000 you are generally not eligible, and savings between £6,000 and £16,000 are treated as generating £1 per week per £250 (tariff income).',
      'For private tenants, the maximum Housing Benefit is capped at the Local Housing Allowance (LHA) rate for your area and property size. LHA rates are set at the 30th percentile of local rents and vary significantly by postcode. You are entitled to one bedroom per adult couple, per person over 16, and per pair of children under 16 of the same sex.',
      'Working-age claimants on Housing Benefit are being moved to Universal Credit. New claims are only accepted from people of State Pension age or in supported accommodation. This calculator estimates your potential entitlement based on current LHA rates and income rules.',
    ],
    example: {
      title: 'Example: Single person, £150/week rent, £200/week income',
      steps: [
        'LHA rate for 1-bed in local area: £160/week',
        'Eligible rent (lower of actual and LHA): £150/week',
        'Applicable amount (personal allowance): £90.50/week',
        'Excess income: £200 - £90.50 = £109.50',
        'Taper at 65%: £109.50 x 65% = -£71.18',
        'Weekly Housing Benefit: £150 - £71.18 = £78.82',
      ],
    },
    sourceUrl: 'https://www.gov.uk/housing-benefit',
    sourceName: 'GOV.UK — Housing Benefit',
    lastUpdated: 'April 2026',
  },
  'vat-threshold-calculator': {
    howItWorks: [
      'This calculator helps you track your rolling 12-month turnover against the £90,000 VAT registration threshold. See headroom remaining. The calculation follows official UK rules and rates for the 2026/27 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the VAT Threshold Monitor',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2026/27 rates from GOV.UK — Business tax',
      ],
    },
    sourceUrl: 'https://www.gov.uk/corporation-tax-rates',
    sourceName: 'GOV.UK — Business tax',
    lastUpdated: 'April 2026',
  },
  'umbrella-company-calculator': {
    howItWorks: [
      'An umbrella company employs contractors on behalf of end clients and handles all payroll administration. Your assignment rate is paid to the umbrella, which deducts employer NI (15% above £5,000), the apprenticeship levy (if applicable), employer pension contributions and a margin fee before processing PAYE on the remaining amount.',
      'Your payslip from an umbrella shows the assignment rate, less employer costs, giving a gross salary figure. From this gross, income tax, employee NI, employee pension and any student loan repayments are deducted to arrive at your take-home pay. The key difference from PAYE employment is that you bear the employer NI cost through a lower gross salary.',
      'This calculator compares umbrella take-home pay with PAYE employment and limited company contracting for the same day rate. It shows where each penny goes — employer NI, umbrella margin, tax, employee NI and pension — so you can make an informed decision about your working arrangement.',
    ],
    example: {
      title: 'Example: £400/day contract rate, 20 days/month',
      steps: [
        'Monthly assignment rate: £8,000',
        'Less employer NI (15%): approx. −£978',
        'Less umbrella margin: −£30',
        'Gross salary: approx. £6,992',
        'Less tax, NI, pension: approx. −£2,310',
        'Net take-home: approx. £4,682',
      ],
    },
    sourceUrl: 'https://www.gov.uk/guidance/working-through-an-umbrella-company',
    sourceName: 'GOV.UK — Working through an umbrella company',
    lastUpdated: 'April 2026',
  },
  'plaster-calculator': {
    howItWorks: [
      'Plaster coverage depends on the product type and application thickness. Multi-finish plaster (the most common top coat) covers approximately 10\u201311 m\u00B2 per 25 kg bag at 2 mm thickness. Bonding coat (base coat for solid walls) covers about 3.5 m\u00B2 per 25 kg bag at 8 mm thickness. Browning (base coat for brick) covers a similar area.',
      'This calculator takes wall and ceiling areas, subtracts openings, and calculates bags needed based on the plaster type and coat thickness. For a full re-plaster on brick, you typically need a base coat (8\u201311 mm) plus a finish coat (2 mm). For skim-coating existing plasterboard, only the finish coat is needed (2\u20133 mm).',
      'Enter the area, plaster type and number of coats. The calculator shows bags of plaster, litres of PVA (for sealing surfaces before plastering) and approximate cost. One 25 kg bag of multi-finish costs around £8\u201312. For large areas, always mix from the same batch to avoid colour variations.',
    ],
    example: {
      title: 'Example: Room walls 36 m\u00B2 (less openings), skim coat only',
      steps: [
        'Net wall area: 36 m\u00B2',
        'Multi-finish at 2 mm: 36 \u00F7 10.5 = 3.4 bags',
        'Round up: 4 bags \u00D7 25 kg multi-finish',
        'PVA: ~5 litres for surface preparation',
      ],
    },
    sourceUrl: 'https://www.gov.uk/government/publications/building-regulations-approved-document-c-site-preparation-and-resistance-to-contaminants-and-moisture',
    sourceName: 'GOV.UK \u2014 Building Regulations Approved Document C',
    lastUpdated: 'April 2026',
  },
  'staircase-calculator': {
    howItWorks: [
      'UK Building Regulations (Approved Document K) set strict requirements for domestic staircases. The maximum rise per step is 220 mm and the minimum going (tread depth) is 220 mm. The pitch must not exceed 42\u00B0. Additionally, twice the rise plus the going (2R + G) should fall between 550 mm and 700 mm for comfortable use.',
      'This calculator takes the total floor-to-floor height and available horizontal distance, then calculates the number of treads, individual rise, going and overall staircase length. It checks all results against Building Regulations and flags any dimension that falls outside permitted limits.',
      'Headroom must be at least 2.0 m measured vertically from the pitch line. The calculator also shows the stairwell opening length required. For a standard floor-to-floor height of 2.6 m, most staircases need 12\u201313 risers and a horizontal run of approximately 3.0\u20133.5 m including a landing.',
    ],
    example: {
      title: 'Example: Floor-to-floor height 2,600 mm, 13 risers',
      steps: [
        'Rise per step: 2,600 \u00F7 13 = 200 mm (\u2264 220 mm, compliant)',
        'Going per step: 250 mm (\u2265 220 mm, compliant)',
        '2R + G check: (2 \u00D7 200) + 250 = 650 mm (within 550\u2013700, compliant)',
        'Total horizontal run: 12 \u00D7 250 = 3,000 mm (12 treads, 13 risers)',
        'Pitch angle: arctan(200 \u00F7 250) = 38.7\u00B0 (\u2264 42\u00B0, compliant)',
      ],
    },
    sourceUrl: 'https://www.gov.uk/government/publications/building-regulations-approved-document-k-protection-from-falling-collision-and-impact',
    sourceName: 'GOV.UK \u2014 Building Regulations Approved Document K',
    lastUpdated: 'April 2026',
  },
  'exam-score-calculator': {
    howItWorks: [
      'This calculator converts raw exam marks into percentages and maps them to grade boundaries. Enter the marks achieved and the total marks available, and it produces a percentage score. You can then compare this against grade boundaries to determine the grade.',
      'Grade boundaries vary by qualification type. For GCSEs (9\u20131), typical boundaries might be: Grade 9 at 80%+, Grade 7 at 65%+, Grade 4 (pass) at 40%+. For A-levels: A* at 80%+, A at 70%+, B at 60%+. These are illustrative \u2014 actual boundaries depend on the exam board, subject and year.',
      'The calculator also supports pass/fail assessments (common in professional qualifications), where you simply need to exceed a set pass mark. Enter your score and pass mark to see whether you have passed and by what margin.',
    ],
    example: {
      title: 'Example: 64 marks out of 90, pass mark 45%',
      steps: [
        'Percentage: 64 \u00F7 90 \u00D7 100 = 71.1%',
        'Pass mark: 45% = 40.5 marks',
        'Result: Pass (exceeded by 23.5 marks)',
        'If A-level: likely maps to a B or A grade',
      ],
    },
    sourceUrl: 'https://www.gov.uk/government/organisations/ofqual',
    sourceName: 'Ofqual \u2014 Exam regulation',
    lastUpdated: 'April 2026',
  },
  'roman-numeral-converter': {
    howItWorks: [
      'Roman numerals use seven symbols: I (1), V (5), X (10), L (50), C (100), D (500) and M (1,000). When a smaller numeral appears before a larger one, it is subtracted (e.g. IV = 4, IX = 9). Otherwise, values are added left to right.',
      'This converter translates between standard Arabic numbers and Roman numerals for values from 1 to 3,999. Roman numerals are still used in the UK for clock faces, film credits, monarchs (Charles III), chapter numbering and dates on cornerstones.',
    ],
    example: {
      title: 'Example: Converting 2026',
      steps: [
        '2026 = MMXXVI',
        'M = 1000, M = 1000, X = 10, X = 10, V = 5, I = 1',
        '1000 + 1000 + 10 + 10 + 5 + 1 = 2026',
      ],
    },
    sourceUrl: 'https://www.bbc.co.uk/bitesize/articles/zp2dscw',
    sourceName: 'BBC Bitesize — Roman numerals',
    lastUpdated: 'April 2026',
  },
  'capital-allowances-calculator': {
    howItWorks: [
      'Capital allowances let UK businesses deduct the cost of qualifying capital assets from taxable profits over time, or in full in the year of purchase. The main routes are: <a href="/calculator/annual-investment-allowance-calculator/" class="text-primary underline">Annual Investment Allowance</a> (AIA) offering 100% relief on the first \u00a31,000,000 of qualifying plant and machinery; Full Expensing at 100% for new (not second-hand) main-rate plant and machinery purchased by companies; and the 50% First Year Allowance for new special-rate assets like long-life assets and integral features.',
      'Assets that don\'t qualify for first-year relief enter writing down allowance (WDA) pools. The main pool covers most plant and machinery at 18% per year on a reducing-balance basis. The special rate pool\u2014covering integral features, long-life assets, and thermal insulation\u2014writes down at 6% per year. Cars have specific rules: zero-emission cars get 100% first-year allowance, cars with CO\u2082 emissions up to 50g/km enter the main pool, and higher-emission cars enter the special rate pool.',
      'Balancing allowances or charges arise when you dispose of an asset. If the disposal value is less than the pool balance, the shortfall is claimed as a balancing allowance. If the disposal value exceeds the pool balance, the excess is a balancing charge added to taxable profits. Accurate tracking of each pool\'s written-down value is essential for correct annual claims.'
    ],
    example: {
      title: 'Capital allowances on \u00a3150,000 of mixed assets',
      steps: [
        'Purchase \u00a390,000 of machinery (main-rate, new) and \u00a360,000 of integral features (special-rate).',
        'Claim AIA on both: \u00a3150,000 is within the \u00a31M limit, so 100% deduction in year one.',
        'Alternatively, use Full Expensing on the \u00a390,000 machinery (100%) and 50% FYA on the \u00a360,000 integral features (\u00a330,000 relief).',
        'Remaining \u00a330,000 of integral features enters the special rate pool at 6% WDA: \u00a31,800 relief in year two.',
        'Using AIA gives \u00a3150,000 total deduction in year one vs \u00a3120,000 + \u00a31,800 over two years with FE/FYA route.'
      ]
    },
    sourceUrl: 'https://www.gov.uk/capital-allowances',
    sourceName: 'GOV.UK \u2013 Capital Allowances',
    lastUpdated: 'April 2026',
  },
  'cash-flow-calculator': {
    howItWorks: [
      'Cash flow forecasting tracks the actual movement of money in and out of your business on a weekly or monthly basis. The formula is straightforward: Opening balance + Total cash inflows \u2212 Total cash outflows = Closing balance. The closing balance of one period becomes the opening balance of the next. Unlike profit, cash flow accounts for the timing of payments\u2014you may invoice \u00a310,000 in March but not receive payment until May.',
      'Cash inflows include customer payments, loan drawdowns, tax refunds, grants, asset sales, and any other money physically entering your bank account. Cash outflows cover supplier payments, wages, rent, utilities, loan repayments, tax payments (VAT, PAYE, Corporation Tax), equipment purchases, and dividend distributions. Categorising each flow allows you to identify which areas consume the most cash.',
      'A negative closing balance signals a shortfall that must be covered by an overdraft, loan, or deferring payments. Projecting 12 months ahead lets you spot potential crises before they happen. Key metrics include the cash burn rate (average monthly outflows minus inflows when negative) and the runway (current balance divided by monthly burn rate), showing how many months the business can survive without additional income.'
    ],
    example: {
      title: 'Monthly cash flow for a freelance design studio',
      steps: [
        'Opening balance on 1 April: \u00a34,200.',
        'April cash inflows: \u00a37,500 (client payments received).',
        'April cash outflows: rent \u00a3800 + software \u00a3150 + subcontractor \u00a32,000 + personal draw \u00a32,500 + VAT payment \u00a31,400 = \u00a36,850.',
        'Closing balance: \u00a34,200 + \u00a37,500 \u2212 \u00a36,850 = \u00a34,850.',
        'Net positive cash flow of \u00a3650 for the month; balance carried forward to May.'
      ]
    },
    sourceUrl: 'https://www.gov.uk/set-up-business',
    sourceName: 'GOV.UK \u2013 Set Up a Business',
    lastUpdated: 'April 2026',
  },
  'spouse-visa-calculator': {
    howItWorks: [
      'A UK spouse visa (Family visa as a partner) allows you to join your British or settled partner in the UK. The initial application is for 2 years and 9 months, followed by a further 2.5-year extension, then Indefinite Leave to Remain (ILR) after 5 years total. Each stage has separate fees.',
      'The minimum income requirement is £29,000 per year (as of April 2024, with planned increases). This can be met through the sponsor\'s employment income, savings, or a combination. Self-employment income is also accepted with additional evidence requirements.',
      'This calculator totals the costs across all stages from initial application to ILR, including application fees, IHS, biometrics, English language tests and the Life in the UK test. It shows the full financial commitment over the 5-year route.',
    ],
    example: {
      title: 'Example: Spouse visa — full route to ILR',
      steps: [
        'Initial application (2.5 years): £1,846 + IHS £2,588 = £4,434',
        'Extension (2.5 years): £1,048 + IHS £2,588 = £3,636',
        'ILR application: £2,885',
        'English tests (2): approx. £340',
        'Life in the UK test: £50',
        'Total 5-year cost: approx. £11,345',
      ],
    },
    sourceUrl: 'https://www.gov.uk/uk-family-visa',
    sourceName: 'GOV.UK — Family visa',
    lastUpdated: 'April 2026',
  },
  'farm-operating-cost-calculator': {
    howItWorks: [
      'Farm operating costs for arable farming in the UK include seed, fertiliser, crop protection (sprays), fuel, labour, machinery depreciation, rent and overheads. Variable costs — seed, fertiliser and sprays — typically run £600–£900 per hectare for winter wheat, while fixed costs (rent, labour, machinery) add another £400–£700 per hectare.',
      'This calculator breaks down costs per hectare by category, allowing you to input your own figures or use national averages from the Farm Business Survey (FBS). It shows total cost of production per tonne, which you can compare against current market prices to assess profitability.',
      'Understanding your cost base is essential for making cropping decisions, negotiating input prices and benchmarking against other farms. The calculator also shows how changes in a single input (e.g. a 10% rise in fertiliser cost) affect your overall cost per tonne.',
    ],
    example: {
      title: 'Example: Winter wheat, 100 hectares',
      steps: [
        'Seed: £70/ha → £7,000',
        'Fertiliser: £280/ha → £28,000',
        'Sprays: £200/ha → £20,000',
        'Fuel and machinery: £180/ha → £18,000',
        'Total variable costs: £730/ha. At 8.2 t/ha yield: cost per tonne = £89',
      ],
    },
    sourceUrl: 'https://www.gov.uk/government/collections/farm-business-survey',
    sourceName: 'Defra — Farm Business Survey',
    lastUpdated: 'April 2026',
  },
  'personal-injury-calculator': {
    howItWorks: [
      'Personal injury compensation in England and Wales has two parts: general damages (for pain, suffering and loss of amenity) and special damages (for financial losses like lost earnings, medical costs and travel expenses). General damages are assessed using the Judicial College Guidelines, which set bracket amounts for each injury type.',
      'Common injury brackets include: minor whiplash (up to 2 years\' duration) £2,000–£8,000, moderate back injury £14,000–£30,000, simple fracture of a limb £7,000–£14,000, and serious head injury £50,000–£300,000+. The exact amount within a bracket depends on severity, recovery time and long-term impact.',
      'This calculator provides indicative compensation ranges based on the Judicial College Guidelines. It does not account for contributory negligence (where your own actions contributed to the injury), which can reduce the award. Always seek legal advice for a proper valuation.',
    ],
    example: {
      title: 'Example: Moderate whiplash lasting 12 months',
      steps: [
        'Injury type: Neck — moderate whiplash',
        'General damages range: £4,500–£8,000',
        'Lost earnings (3 months off work at £2,500/month): £7,500',
        'Medical expenses (physiotherapy): £600',
        'Total estimated claim: £12,600–£16,100',
      ],
    },
    sourceUrl: 'https://www.judiciary.uk/guidance-and-resources/guidelines-for-the-assessment-of-general-damages-in-personal-injury-cases/',
    sourceName: 'Judicial College — Guidelines for general damages',
    lastUpdated: 'April 2026',
  },
  'investment-return-calculator': {
    howItWorks: [
      'Compound growth calculates returns on both the original principal and accumulated gains. The formula for a lump sum is: Future Value = Present Value x (1 + r)^n, where r is the annual return rate and n is the number of years. For regular monthly contributions, each payment compounds for a different duration, calculated using the future value of an annuity formula: FV = PMT x [((1 + r/12)^(12n) - 1) / (r/12)].',
      'Nominal returns represent the headline growth rate before accounting for inflation. Real returns strip out inflation to show actual purchasing power gain. If your investment grows 7% nominally and inflation is 3%, your real return is approximately 3.88% (calculated as (1.07/1.03) - 1, not simply 7% - 3%). Over long periods this distinction is crucial: £100,000 growing at 7% nominal for 30 years reaches £761,226, but at 3% inflation its real purchasing power is only £352,365.',
      'The calculator separates returns into components: original contributions, investment growth, and the effect of charges. Platform fees and fund charges compound negatively just as returns compound positively. A 1% annual charge on a £100,000 portfolio growing at 6% over 30 years costs approximately £132,000 in foregone growth — nearly as much as the original investment. The tool shows gross return, charges deducted, and net return side by side.'
    ],
    example: {
      title: 'Investment growth: £500/month for 20 years at 7% nominal',
      steps: [
        'Monthly contribution: £500 (£6,000/year)',
        'Total contributions over 20 years: £120,000',
        'At 7% nominal annual growth: portfolio reaches approximately £260,500',
        'Investment gain: £260,500 - £120,000 = £140,500',
        'Real value at 2.5% inflation: approximately £199,000 in today\'s money (purchasing power of the £260,500)'
      ]
    },
    sourceUrl: 'https://www.bankofengland.co.uk/statistics/yield-curves',
    sourceName: 'Bank of England',
    lastUpdated: 'April 2026',
  },
  'savings-interest-tax-calculator': {
    howItWorks: [
      'The Personal Savings Allowance (PSA) lets you earn tax-free interest each year: £1,000 for basic-rate taxpayers (20%), £500 for higher-rate taxpayers (40%), and £0 for additional-rate taxpayers (45%). Interest above the PSA is taxed at your marginal income tax rate. The PSA applies to interest from bank and building society accounts, NS&I (except Premium Bond prizes which are always tax-free), and peer-to-peer lending.',
      'The calculation totals all taxable interest across your savings accounts, subtracts the PSA for your tax band, and applies the appropriate tax rate to the excess. Your tax band is determined by total income including salary, pension, rental income, and dividends. If adding savings interest pushes you from basic into higher rate, the portion in each band is taxed separately. ISA interest is excluded entirely as it does not count toward the PSA threshold.',
      'The starting rate for savings provides an additional £5,000 tax-free band for those with non-savings income below £17,570. For every £1 of non-savings income above £12,570, the starting rate band reduces by £1. Someone earning £14,000 salary gets a £3,570 starting rate band (£17,570 - £14,000) plus the £1,000 PSA, allowing £4,570 of interest tax-free. Retirees with only State Pension income often benefit significantly from this starting rate band.'
    ],
    example: {
      title: 'Tax on £2,800 savings interest for a higher-rate taxpayer',
      steps: [
        'Total savings interest across all accounts: £2,800/year',
        'Tax band: higher rate (salary £55,000)',
        'Personal Savings Allowance at higher rate: £500',
        'Taxable interest: £2,800 - £500 = £2,300',
        'Tax due at 40%: £2,300 x 40% = £920 (collected via self-assessment or PAYE code adjustment)'
      ]
    },
    sourceUrl: 'https://www.gov.uk/apply-tax-free-interest-on-savings',
    sourceName: 'GOV.UK',
    lastUpdated: 'April 2026',
  },
  'real-return-calculator': {
    howItWorks: [
      'The real return strips inflation from nominal investment returns to reveal actual purchasing power growth. The precise formula is: Real Return = ((1 + Nominal Return) / (1 + Inflation Rate)) - 1. This multiplicative method is more accurate than simply subtracting inflation from the nominal rate, especially when rates are high. At 8% nominal growth and 4% inflation, the real return is (1.08/1.04) - 1 = 3.85%, not 4%.',
      'UK inflation is measured primarily by CPI (Consumer Prices Index) and CPIH (CPI including owner occupiers\' housing costs). The Bank of England targets 2% CPI inflation. Historical UK CPI has averaged approximately 2.5-3% over the past two decades, with spikes to 11.1% in October 2022. The calculator allows custom inflation assumptions or uses the BoE target rate for forward projections.',
      'Purchasing power erosion accelerates over time. At 3% annual inflation, £100,000 buys only £74,400 worth of today\'s goods after 10 years, £55,400 after 20 years, and £41,200 after 30 years. For retirement planning over 25-30 years, failing to account for inflation can leave you with half the expected spending power. The calculator shows the nominal portfolio value alongside its inflation-adjusted equivalent at 10, 20, and 30-year intervals.'
    ],
    example: {
      title: 'Real return on a portfolio averaging 7% nominal over 25 years',
      steps: [
        'Nominal annual return: 7%',
        'Assumed CPI inflation: 2.5%',
        'Real annual return: (1.07 / 1.025) - 1 = 4.39%',
        'Nominal value of £100,000 after 25 years at 7%: £542,743',
        'Real purchasing power of that £542,743 at 2.5% inflation: £292,400 in today\'s money'
      ]
    },
    sourceUrl: 'https://www.bankofengland.co.uk/monetary-policy/inflation',
    sourceName: 'Bank of England',
    lastUpdated: 'April 2026',
  },
  'rule-of-72-calculator': {
    howItWorks: [
      'The Rule of 72 is a mental arithmetic shortcut for estimating how long it takes an investment to double at a given compound annual growth rate. The formula is: Years to Double = 72 / Annual Rate (as a whole number). At 6% growth, money doubles in approximately 72 / 6 = 12 years. At 8%, it doubles in 72 / 8 = 9 years. The rule is most accurate for rates between 2% and 15%.',
      'The mathematical basis is the natural logarithm: the exact doubling time is ln(2) / ln(1 + r), which equals 0.693 / ln(1 + r). For small rates, ln(1 + r) approximates to r, giving 0.693 / r, or roughly 69.3 / r%. The number 72 is used instead of 69.3 because it has more factors (divisible by 2, 3, 4, 6, 8, 9, 12) making mental division easier, and the slight overestimate partially compensates for the approximation error.',
      'The rule also works in reverse: if you want to double your money in a specific number of years, divide 72 by the years to get the required rate. To double in 10 years, you need 72 / 10 = 7.2% annual growth. The rule applies equally to inflation erosion: at 3% inflation, the cost of living doubles every 72 / 3 = 24 years, meaning your £1 buys only 50p worth of today\'s goods.'
    ],
    example: {
      title: 'Doubling time at various rates using Rule of 72',
      steps: [
        'Cash savings at 4.5%: 72 / 4.5 = 16 years to double',
        'Equity investment at 7%: 72 / 7 = 10.3 years to double',
        'High-growth fund at 10%: 72 / 10 = 7.2 years to double',
        'Inflation at 3%: purchasing power halves every 72 / 3 = 24 years',
        'Exact doubling time at 7% (using ln(2)/ln(1.07)): 10.24 years — Rule of 72 estimate of 10.3 is very close'
      ]
    },
    sourceUrl: 'https://www.bankofengland.co.uk/statistics/yield-curves',
    sourceName: 'Bank of England',
    lastUpdated: 'April 2026',
  },
  'cost-of-delay-calculator': {
    howItWorks: [
      'The cost of delay quantifies the compound growth forfeited by postponing the start of regular investing. Because compound interest generates returns on previous returns, early contributions are disproportionately valuable. A single £5,000 contribution at age 25 growing at 7% for 40 years reaches £74,872. The same £5,000 invested at age 35 (10-year delay) grows for only 30 years to £38,061 — losing £36,811, or almost half the final value, despite the same contribution.',
      'For regular monthly contributions, the cost of delay is even more dramatic. Starting at age 25 with £300/month at 7% for 40 years (to age 65) accumulates approximately £790,000. Delaying 10 years to age 35, the same £300/month for 30 years reaches only £365,000 — a cost of delay of £425,000. To match the early starter\'s outcome, the delayed investor would need to contribute approximately £650/month, more than double the amount.',
      'The calculator isolates the growth lost by showing three scenarios side by side: starting now, starting with a 1-year delay, a 5-year delay, and a 10-year delay. Each scenario shows total contributions, total growth, and the shortfall compared to starting immediately. It also calculates the additional monthly contribution needed in each delayed scenario to match the non-delayed outcome, quantifying the real cost of procrastination in pounds.'
    ],
    example: {
      title: 'Cost of delaying £400/month investment by 5 years',
      steps: [
        'Scenario A: Start now (age 30), invest £400/month at 7% for 35 years to age 65 = £690,700',
        'Scenario B: Start at 35, invest £400/month at 7% for 30 years = £489,300',
        'Cost of 5-year delay: £690,700 - £489,300 = £201,400 in lost growth',
        'Total contributed in A: £168,000. Total contributed in B: £144,000. Extra contributions: only £24,000',
        'To match Scenario A from age 35: need £565/month — 41% higher monthly savings to overcome the delay'
      ]
    },
    sourceUrl: 'https://www.gov.uk/government/publications/automatic-enrolment-review-2017-maintaining-the-momentum',
    sourceName: 'GOV.UK',
    lastUpdated: 'April 2026',
  },
  'teacher-pay-calculator': {
    howItWorks: [
      'Teacher pay in England and Wales is set by the School Teachers\' Pay and Conditions Document (STPCD). The Main Pay Range (MPR) for classroom teachers in 2026/27 runs from M1 (approximately £31,650) to M6 (approximately £43,607) outside London. The Upper Pay Range (UPR) for experienced teachers runs from UPR1 to UPR3, topping out at approximately £49,084.',
      'London weighting applies in four zones: Inner London, Outer London, Fringe and Rest of England. Inner London attracts the highest premiums, with MPR starting approximately £5,000 higher. Leadership pay scales cover headteachers, deputy heads and assistant heads with separate spine points.',
      'This calculator shows your gross salary based on your pay range, spine point and location. It then deducts income tax, NI and Teachers\' Pension contributions (currently 7.4% to 11.7% of pensionable pay depending on salary band) to show your monthly and annual take-home pay.',
    ],
    example: {
      title: 'Example: Main Pay Range M4, Rest of England',
      steps: [
        'Basic salary: £38,174',
        'Teachers\' Pension (7.4%): £2,825',
        'Taxable income after pension: £35,349',
        'Income tax: approx. £4,556',
        'Employee NI: approx. £1,822',
        'Annual take-home: approx. £28,971',
      ],
    },
    sourceUrl: 'https://www.gov.uk/government/publications/school-teachers-pay-and-conditions',
    sourceName: 'GOV.UK — School teachers\' pay and conditions',
    lastUpdated: 'April 2026',
  },
  'shared-parental-leave-calculator': {
    howItWorks: [
      'Shared Parental Leave allows eligible parents to split up to 50 weeks of leave and 37 weeks of Statutory Shared Parental Pay (ShPP) between them. The mother or primary adopter must first end their maternity or adoption leave by giving a binding curtailment notice. The first two weeks after birth are compulsory maternity leave and cannot be shared. Any remaining untaken weeks become available for either parent to book.',
      'ShPP is paid at £184.03 per week or 90% of average weekly earnings, whichever is lower, for up to 37 weeks total (minus any weeks of statutory maternity pay already taken). Unlike maternity pay, ShPP does not include an initial six-week period at 90% of earnings. Both parents can take leave simultaneously, giving families flexibility to be off work together or take turns.',
      'Each parent must give their employer at least eight weeks\' notice before each block of leave. Leave can be taken in up to three separate discontinuous blocks, though employers may refuse discontinuous requests and offer alternative dates. Both parents must have at least 26 weeks\' continuous employment by the 15th week before the due date and earn above the Lower Earnings Limit of £123 per week.'
    ],
    example: {
      title: 'Splitting leave after mother takes 20 weeks maternity',
      steps: [
        'Mother takes 20 weeks maternity leave (2 compulsory + 18 additional)',
        'Remaining leave pool: 52 - 20 = 32 weeks leave, 39 - 20 = 19 weeks pay available to share',
        'Mother books 10 more weeks as ShPL, partner books 22 weeks as ShPL',
        'ShPP available: 19 weeks split as mother 10 weeks + partner 9 weeks at £184.03/week',
        'Partner\'s total ShPP: 9 x £184.03 = £1,656.27 (remaining 13 weeks unpaid)'
      ]
    },
    sourceUrl: 'https://www.gov.uk/shared-parental-leave-and-pay',
    sourceName: 'GOV.UK - Shared Parental Leave and Pay',
    lastUpdated: 'April 2026',
  },
  'high-income-child-benefit-calculator': {
    howItWorks: [
      'The High Income Child Benefit Charge (HICBC) applies when either parent in a household has adjusted net income between £60,000 and £80,000. For every £200 of income above £60,000, 1% of the total Child Benefit received must be repaid through Self Assessment. At £80,000 or above, the charge equals 100% of the benefit.',
      'Child Benefit for 2026/27 is £27.05 per week for the eldest child and £17.90 per week for each subsequent child. For a two-child family, total annual benefit is £2,251.60. The charge is calculated on the higher earner\'s income, not combined household income.',
      'Parents can choose to keep receiving Child Benefit and pay the charge, or opt out of receiving payments. Claiming but opting out of payment protects the claimant\'s National Insurance record (which matters for State Pension). This calculator shows the net benefit after the charge is applied.',
      'What is the High Income Child Benefit Charge? Since 2013, if you or your partner earns over £60,000 (raised from £50,000 in April 2024), you must repay Child Benefit via Self Assessment. The charge is 1% of Child Benefit per £200 of income above £60,000. At £80,000+ income, all the Child Benefit is clawed back. Eldest child Child Benefit £27.05/week × 52 = £1,407/year — at £80k income, you repay all of it.',
      'The April 2024 reforms — partial relief. Before April 2024: charge started at £50,000, full clawback at £60,000 (narrow £10k taper band, very steep effective tax rates of 71-77%). After April 2024: charge starts £60,000, full clawback £80,000 (wider £20k taper). Effective marginal rate within taper band reduced from 71% to 47%-50%. Still painful but less brutal. From April 2026, the charge will be based on HOUSEHOLD income (not the higher of either parent), making it fairer for single-earner households.',
      'Should I still claim Child Benefit if I\'ll have to repay it? YES — for the National Insurance credits. The parent at home with the child (under 12) receives auto NI credits — building toward State Pension. Each year = ~£328/year extra State Pension. Over 12 years caring = £4,000/year extra State Pension for life from age 67. Worth £80,000+ over a 20-year retirement. You can register the claim but tick \'don\'t pay me\' to avoid the cashflow → repayment cycle.',
      'Strategies to avoid the charge. (1) Increase pension contributions — reduces \'adjusted net income\'; £5,000 pension contribution from £65k income drops adjusted to £60k = full Child Benefit retained; (2) Salary sacrifice (pension, EV) — same effect, often more tax-efficient than RAS pension; (3) Charitable giving (Gift Aid donations reduce ANI); (4) If your spouse earns less than the charge threshold, ensure they claim Child Benefit (not you) — charge is based on the HIGHEST earner\'s income.',
    ],
    example: {
      title: 'Example: Income £70,000, two children',
      steps: [
        'Annual Child Benefit: £27.05 + £17.90 = £43.30/week = £2,251.60/year',
        'Income above £60,000: £10,000',
        'Charge: £10,000 ÷ £200 = 50 × 1% = 50% clawback',
        'HICBC: £2,251.60 × 50% = £1,125.80',
        'Net benefit kept: £2,251.60 − £1,125.80 = £1,125.80',
      ],
    },
    sourceUrl: 'https://www.gov.uk/child-benefit-tax-charge',
    sourceName: 'GOV.UK — High Income Child Benefit Charge',
    lastUpdated: 'April 2026',
  },
  'benefit-cap-calculator': {
    howItWorks: [
      'The benefit cap limits the total amount of benefits a working-age household can receive. For 2026/27 the cap is £22,020 per year (£423.46/week) for couples and single parents outside London, and £25,323 per year (£486.98/week) in Greater London. Single people without children are capped at £14,753 (£283.71/week) outside London or £16,967 (£326.29/week) in London.',
      'The cap applies to the combined total of most benefits including Universal Credit, Child Benefit, Child Tax Credit, Housing Benefit, Jobseeker\'s Allowance and Employment and Support Allowance. Some benefits are exempt from the cap, including Disability Living Allowance, Personal Independence Payment, Carer\'s Allowance, and Working Tax Credit.',
      'You are exempt from the benefit cap if anyone in your household qualifies for Working Tax Credit, earns enough to receive the UC work allowance after the earnings taper, or receives certain disability or carer benefits. This calculator checks whether the cap applies to your household and estimates the reduction.',
    ],
    example: {
      title: 'Example: Couple with 3 children, outside London, £26,000 in benefits',
      steps: [
        'Total annual benefits: £26,000',
        'Benefit cap (couple, outside London): £22,020',
        'Excess above cap: £3,980/year',
        'Weekly reduction: £76.54',
        'The reduction is applied to Housing Benefit or UC housing element',
      ],
    },
    sourceUrl: 'https://www.gov.uk/benefit-cap',
    sourceName: 'GOV.UK — Benefit cap',
    lastUpdated: 'April 2026',
  },
  'trigonometry-calculator': {
    howItWorks: [
      'Trigonometry deals with the relationships between angles and sides of triangles. The three primary functions — sine (sin), cosine (cos) and tangent (tan) — relate the angles of a right-angled triangle to the ratios of its sides. This calculator computes all six trig functions and their inverses.',
      'The calculator works in both degrees and radians. It can solve a triangle given three pieces of information (e.g. two sides and an angle, or three sides) using the sine rule, cosine rule and angle sum property. Results include all missing sides and angles.',
    ],
    example: {
      title: 'Example: Right triangle with angle 30° and hypotenuse 10',
      steps: [
        'sin(30°) = 0.5 → opposite = 10 × 0.5 = 5',
        'cos(30°) = 0.866 → adjacent = 10 × 0.866 = 8.66',
        'Third angle: 180° − 90° − 30° = 60°',
        'Sides: 5, 8.66, 10',
      ],
    },
    sourceUrl: 'https://www.bbc.co.uk/bitesize/guides/z98jtv4/revision/1',
    sourceName: 'BBC Bitesize — Trigonometry',
    lastUpdated: 'April 2026',
  },
  'freelance-tax-calculator': {
    howItWorks: [
      'Freelance tax in the UK is calculated on your net taxable profit: total business income minus allowable expenses. Allowable expenses include materials, software, professional subscriptions, travel, insurance, a proportion of home office costs, phone, and accountancy fees. The resulting profit figure is then subject to Income Tax and two classes of National Insurance via the Self Assessment system, with payments due by 31 January following the tax year.',
      'Income Tax is applied in bands after deducting the \u00a312,570 Personal Allowance: 20% on the first \u00a337,700 of taxable income (basic rate), 40% on income between \u00a350,271 and \u00a3125,140 (higher rate), and 45% above \u00a3125,140 (additional rate). The Personal Allowance reduces by \u00a31 for every \u00a32 of income above \u00a3100,000, reaching zero at \u00a3125,140\u2014creating an effective 60% marginal rate in that band.',
      'Class 2 NI was abolished from 6 April 2024 \u2014 self-employed people no longer pay it. You receive NI credit automatically if profits reach \u00a36,725 (Small Profits Threshold). Class 4 NI is 6% on profits between \u00a312,570 and \u00a350,270, then 2% on profits above \u00a350,270. Both are collected through Self Assessment. Payments on Account (two advance payments of 50% each in January and July) apply if your tax bill exceeds \u00a31,000 and less than 80% is collected at source.'
    ],
    example: {
      title: 'Tax on \u00a348,000 freelance profit',
      steps: [
        'Freelance revenue: \u00a358,000. Allowable expenses: \u00a310,000. Net profit: \u00a348,000.',
        'Income Tax: \u00a30 on first \u00a312,570. Then \u00a335,430 \u00d7 20% = \u00a37,086.',
                'Class 4 NI: (\u00a348,000 \u2212 \u00a312,570) \u00d7 6% = \u00a32,125.80.',
        'Total tax and NI: \u00a37,086 + \u00a3179.40 + \u00a32,125.80 = \u00a39,391.20. Take-home: \u00a338,608.80.'
      ]
    },
    sourceUrl: 'https://www.gov.uk/self-employed-national-insurance-rates',
    sourceName: 'GOV.UK \u2013 Self-Employed National Insurance',
    lastUpdated: 'April 2026',
  },
  'macro-calculator': {
    howItWorks: [
      'Macronutrient ratios divide your daily calories among protein, carbohydrates and fat. Common starting points are 30/40/30 (balanced), 40/30/30 (high protein for muscle gain) or 25/45/30 (endurance). Each gram of protein and carbohydrate provides 4 kcal, while fat provides 9 kcal.',
      'This calculator first estimates your Total Daily Energy Expenditure, then splits those calories into grams of each macronutrient based on your chosen goal. For weight loss, protein is kept high (around 30\u201340%) to preserve muscle mass, while carbohydrates and fat are reduced. For muscle gain, both protein and carbohydrates are elevated.',
      'Macro tracking is widely used alongside calorie counting to improve body composition. The NHS recommends that fat should not exceed 35% of total energy and that saturated fat should stay below 11%. Adjust ratios to suit your preferences and monitor progress over several weeks.',
    ],
    example: {
      title: 'Example: 2,200 kcal target, balanced 30/40/30 split',
      steps: [
        'Protein (30%): 2,200 \u00D7 0.30 \u00F7 4 = 165 g',
        'Carbohydrates (40%): 2,200 \u00D7 0.40 \u00F7 4 = 220 g',
        'Fat (30%): 2,200 \u00D7 0.30 \u00F7 9 = 73 g',
        'Daily totals: 165 g protein, 220 g carbs, 73 g fat',
      ],
    },
    sourceUrl: 'https://www.nhs.uk/live-well/eat-well/food-types/starchy-foods-and-carbohydrates/',
    sourceName: 'NHS \u2014 Eat well',
    lastUpdated: 'April 2026',
  },
  'cost-of-living-calculator': {
    howItWorks: [
      'The cost of living in the UK varies significantly by region. Key categories include housing (typically the largest expense at 30–40% of income), food and groceries, transport, energy bills, council tax and personal spending. London and the South East are substantially more expensive than the North and Midlands.',
      'This calculator builds a monthly budget estimate based on your household size, location and lifestyle. It uses ONS data on average expenditure combined with regional adjustments to give you a realistic picture of what it costs to live in different parts of the UK.',
      'Energy costs have been particularly volatile. The Ofgem price cap sets a maximum unit rate and standing charge for default tariffs, but actual bills depend on consumption. The calculator uses the current cap rates and typical usage figures to estimate your energy spend.',
    ],
    example: {
      title: 'Example: Single person in Manchester',
      steps: [
        'Rent (1-bed flat): approx. £750/month',
        'Council tax (Band B): approx. £130/month',
        'Energy (gas + electric): approx. £110/month',
        'Food and groceries: approx. £250/month',
        'Transport (bus pass): approx. £70/month',
        'Estimated monthly total: approx. £1,310 (before discretionary spending)',
      ],
    },
    sourceUrl: 'https://www.ons.gov.uk/peoplepopulationandcommunity/personalandhouseholdfinances/expenditure',
    sourceName: 'ONS — Household expenditure',
    lastUpdated: 'April 2026',
  },
  'smart-meter-calculator': {
    howItWorks: [
      'A smart meter sends automatic readings to your energy supplier, eliminating estimated bills and giving you accurate real-time data on your energy usage. The in-home display (IHD) shows your spending in pounds and pence, making it easier to identify wasteful habits and reduce consumption. Smart meters are provided free of charge by your supplier.',
      'Research by the Department for Energy Security and Net Zero suggests smart meter users reduce their electricity consumption by 2-4% and gas consumption by 3-5% through better awareness. For an average household, this translates to savings of £40-£90 per year. The biggest savings come from identifying and reducing standby consumption and unnecessary heating.',
      'Smart meters also enable access to time-of-use tariffs that charge different rates at different times of day. By shifting usage to off-peak periods (running dishwashers and washing machines at night), you can save significantly more. This calculator estimates your potential savings based on your current consumption and usage patterns.',
    ],
    example: {
      title: 'Example: Average household switching to a smart meter',
      steps: [
        'Current annual energy bill: £1,779',
        'Electricity saving (3%): 2,700 kWh x 3% x 24.5p = £19.85',
        'Gas saving (4%): 11,500 kWh x 4% x 6.76p = £31.10',
        'Awareness savings total: £50.95/year',
        'Time-of-use tariff (additional saving): £30-£80/year',
        'Total potential saving: £81-£131/year',
      ],
    },
    sourceUrl: 'https://www.gov.uk/guidance/smart-meters-how-they-work',
    sourceName: 'GOV.UK — Smart meters',
    lastUpdated: 'April 2026',
  },
  'gpa-calculator': {
    howItWorks: [
      'UK universities award degree classifications (First, 2:1, 2:2, Third) rather than GPA. However, many international employers and postgraduate programmes require a GPA on a 4.0 scale. There is no single official conversion, but a widely accepted mapping is: First (70%+) = 4.0, Upper Second (60\u201369%) = 3.3, Lower Second (50\u201359%) = 2.7, Third (40\u201349%) = 2.0.',
      'Some institutions and the UK ENIC (formerly NARIC) use a more granular scale that maps percentage ranges to GPA in 0.1 increments. For example, 75% maps to approximately 3.7\u20133.8, while 65% maps to approximately 3.0\u20133.3. This calculator supports both the simplified classification-based conversion and the granular percentage-based method.',
      'Enter your UK degree classification or average percentage. The calculator shows the equivalent GPA on the US 4.0 scale, with notes on how different institutions may interpret the conversion. If applying to a specific university, always check whether they have their own conversion table.',
    ],
    example: {
      title: 'Example: UK degree average 67% (Upper Second / 2:1)',
      steps: [
        'UK classification: Upper Second (2:1)',
        'Simplified GPA: 3.3',
        'Granular conversion (67%): \u2248 3.2\u20133.4',
        'Typical US equivalence: above a B+ average',
      ],
    },
    sourceUrl: 'https://www.gov.uk/government/organisations/uk-enic',
    sourceName: 'UK ENIC \u2014 International qualifications comparison',
    lastUpdated: 'April 2026',
  },
  'solicitor-fee-calculator': {
    howItWorks: [
      'Solicitor fees in the UK vary by location, seniority and type of work. For conveyancing, fees typically range from £850 to £1,800 plus VAT and disbursements (searches, Land Registry fees). For probate, fees often range from 1% to 4% of the estate value or a fixed fee for simpler estates.',
      'Many solicitors now offer fixed fees for standard work such as conveyancing, simple wills, and uncontested divorce. For litigation and complex matters, they may charge hourly rates ranging from £150 to £500+ per hour depending on location and seniority. Always ask for a costs estimate and check if VAT is included.',
      'This calculator provides estimated fee ranges for common legal services based on current market rates. Actual quotes will vary, so use it as a guide when comparing solicitor quotes and to ensure you budget for disbursements and VAT on top of the legal fees.',
    ],
    example: {
      title: 'Example: Buying a £300,000 property',
      steps: [
        'Solicitor legal fee: approx. £1,000–£1,500 + VAT',
        'Local authority searches: approx. £250–£350',
        'Land Registry fee: £270',
        'Bank transfer fee: approx. £30–£50',
        'Total conveyancing cost estimate: £1,800–£2,600 inc. VAT',
      ],
    },
    sourceUrl: 'https://www.sra.org.uk/consumers/using-solicitor/costs/',
    sourceName: 'SRA — Solicitor costs',
    lastUpdated: 'April 2026',
  },
  'divorce-settlement-calculator': {
    howItWorks: [
      'Divorce financial settlements in England and Wales aim for a fair division of matrimonial assets. The court considers the welfare of children first, then factors including income, earning capacity, financial needs, standard of living, ages, duration of marriage and contributions (including non-financial ones like childcare).',
      'The starting point is typically a 50/50 split of matrimonial assets, but this is adjusted based on needs. Short marriages may see each party keeping what they brought in. Long marriages with children often result in the primary carer receiving a larger share of the family home to provide stability.',
      'This calculator provides an indicative range based on the key factors. It is not a substitute for legal advice — every case is different, and the court has wide discretion. Pensions are often the second most valuable asset after the family home and must be properly valued.',
    ],
    example: {
      title: 'Example: 15-year marriage, two children',
      steps: [
        'Family home equity: £200,000',
        'Pensions (combined): £150,000',
        'Savings and investments: £50,000',
        'Total matrimonial assets: £400,000',
        'Indicative split: 55/45 to 60/40 in favour of primary carer, subject to needs',
      ],
    },
    sourceUrl: 'https://www.gov.uk/money-property-when-relationship-ends',
    sourceName: 'GOV.UK — Money and property when a relationship ends',
    lastUpdated: 'April 2026',
  },
  'uk-citizenship-calculator': {
    howItWorks: [
      'British citizenship through naturalisation requires at least 12 months of ILR (or 3 years if married to a British citizen and applying without ILR). You must have lived in the UK for at least 5 years (3 years if married to a British citizen), pass the Life in the UK test, and meet English language requirements.',
      'The residency requirement includes not being absent for more than 450 days in the 5 years before the application, and not more than 90 days in the 12 months before the application. The calculator checks these thresholds against your travel history.',
      'This calculator maps the full timeline and costs from your initial visa through ILR to citizenship, including all application fees, IHS payments, language tests and the citizenship ceremony fee. It shows the earliest date you can apply and the total financial investment.',
    ],
    example: {
      title: 'Example: Skilled Worker to citizenship timeline',
      steps: [
        'Year 0: Initial visa — £719 + IHS £3,105 = £3,824',
        'Year 5: ILR application — £2,885 + tests £220 = £3,105',
        'Year 6: Citizenship application — £1,580',
        'Citizenship ceremony fee: £80',
        'Total cost over 6+ years: approx. £8,589 (excluding visa extensions)',
      ],
    },
    sourceUrl: 'https://www.gov.uk/apply-citizenship-indefinite-leave-to-remain',
    sourceName: 'GOV.UK — Apply for citizenship',
    lastUpdated: 'April 2026',
  },

  // ─── FARMING ─────────────────────────────────────────────────────────
  'free-school-meals-calculator': {
    howItWorks: [
      'Free school meals (FSM) are available in England for children whose parents receive certain qualifying benefits. These include Universal Credit with a household income under £7,400 per year (after tax and not including benefits), Income Support, income-based Jobseeker\'s Allowance, income-related Employment and Support Allowance, Child Tax Credit with income under £16,190, and the guaranteed element of Pension Credit.',
      'All children in Reception, Year 1 and Year 2 receive universal infant free school meals regardless of family income. This is a separate scheme and does not require a benefits-based eligibility check. However, registering for benefits-based FSM still provides additional funding to schools through the Pupil Premium.',
      'Registering for free school meals can be worth over £1,000 per child per year in meal savings. It also triggers Pupil Premium funding of £1,480 per primary pupil or £1,050 per secondary pupil for the school, which is used to support disadvantaged children\'s education.',
    ],
    example: {
      title: 'Example: Family on Universal Credit, 2 school-age children',
      steps: [
        'Household income (after tax, excl. benefits): £6,800/year',
        'UC income threshold: £7,400/year',
        'Eligible: Yes (income below threshold)',
        'Estimated meal saving per child: ~£500/year (190 school days)',
        'Total annual saving for 2 children: ~£1,000',
      ],
    },
    sourceUrl: 'https://www.gov.uk/apply-free-school-meals',
    sourceName: 'GOV.UK — Apply for free school meals',
    lastUpdated: 'April 2026',
  },
  'loft-conversion-calculator': {
    howItWorks: [
      'Loft conversion costs depend on the type of conversion and the existing roof structure. The main types are: Velux/roof-light (cheapest, £20,000\u2013£35,000, adds roof windows without changing the roof shape), dormer (£35,000\u2013£60,000, extends the roof vertically to create more headroom), hip-to-gable (£40,000\u2013£65,000, converts a hipped roof end to a vertical gable wall) and mansard (£50,000\u2013£75,000, replaces the roof slope with a near-vertical wall and flat top).',
      'Building Regulations approval is required for all loft conversions, covering structure, fire safety (protected staircase, fire doors, smoke alarms), insulation, means of escape and staircase design. Planning permission is needed if you exceed Permitted Development limits (40 m\u00B3 for terraced houses, 50 m\u00B3 for detached/semi-detached).',
      'Enter your roof type, desired conversion type and size. The calculator estimates the build cost, additional costs (staircase, en-suite, electrics, plastering) and professional fees. It also checks whether your plans are likely to fall within Permitted Development limits.',
    ],
    example: {
      title: 'Example: Rear dormer on semi-detached, 25 m\u00B2 floor area',
      steps: [
        'Dormer build cost: £45,000 (mid-range)',
        'Staircase: £3,000\u2013£5,000',
        'En-suite bathroom: £4,000\u2013£7,000',
        'Professional fees and Building Regs: £3,500\u2013£5,000',
        'Total estimated cost: £55,000\u2013£62,000',
      ],
    },
    sourceUrl: 'https://www.gov.uk/government/publications/permitted-development-rights-for-householders-technical-guidance',
    sourceName: 'GOV.UK \u2014 Permitted Development rights for householders',
    lastUpdated: 'April 2026',
  },
  'extension-cost-calculator': {
    howItWorks: [
      'House extension costs in the UK are typically quoted per square metre of floor area. In 2026, a single-storey rear extension costs approximately £1,800\u2013£2,800/m\u00B2, while a double-storey extension ranges from £1,500\u2013£2,400/m\u00B2 (the upper floor is cheaper per m\u00B2 as foundations and roof are shared). London and the South East are typically 20\u201340% more expensive than the Midlands or North.',
      'The total project cost includes building work, professional fees (architect 7\u201312%, structural engineer 3\u20135%, Building Regulations application \u00A3200\u2013\u00A3900), planning permission if required (\u00A3258 for householder applications) and finishes (kitchen, bathroom, flooring). VAT at 20% applies to all labour and materials.',
      'Enter the extension size, type (single or double storey) and your region. The calculator provides a cost range for building work and estimates for professional fees, planning and finishes. Many single-storey rear extensions up to 6 m (detached) or 3 m (attached) fall under Permitted Development and do not need a full planning application.',
    ],
    example: {
      title: 'Example: Single-storey rear extension, 4 m \u00D7 5 m, Midlands',
      steps: [
        'Floor area: 20 m\u00B2',
        'Build cost: 20 \u00D7 £2,200 = £44,000 (mid-range)',
        'Professional fees (~12%): £5,280',
        'Kitchen fit-out: £8,000\u2013£15,000',
        'Total estimated project cost: £57,000\u2013£64,000 including VAT',
      ],
    },
    sourceUrl: 'https://www.gov.uk/government/publications/building-regulations-approved-document-a-structure',
    sourceName: 'GOV.UK \u2014 Building Regulations',
    lastUpdated: 'April 2026',
  },
  'childcare-entitlement-calculator': {
    howItWorks: [
      'The UK government provides free childcare hours for children from age 9 months to school age, expanding significantly from 2024/25. From September 2025, working parents of children aged 9 months to 3 years are entitled to 30 hours per week of free childcare during term time (38 weeks per year), or the equivalent stretched over more weeks at fewer hours.',
      'All 3 and 4-year-olds are entitled to 15 hours of free childcare per week (the universal entitlement), regardless of parents\' working status. Working parents of 3 and 4-year-olds receive an additional 15 hours (30 hours total). To qualify for the working parent entitlement, both parents must earn at least £8,670 per year and neither can earn more than £100,000.',
      'Some 2-year-olds from disadvantaged backgrounds qualify for 15 hours of free childcare even if parents are not working. This includes families on certain benefits, looked-after children, and children with an Education Health and Care Plan. This calculator checks your eligibility for each scheme based on your child\'s age and circumstances.',
    ],
    example: {
      title: 'Example: Working couple, child aged 2',
      steps: [
        'Parent 1 income: £28,000 (above £8,670 minimum)',
        'Parent 2 income: £22,000 (above £8,670 minimum)',
        'Neither parent earns over £100,000',
        'Entitlement: 30 hours/week free childcare (term time)',
        'Annual value: ~£7,980 (based on average nursery rates)',
      ],
    },
    sourceUrl: 'https://www.gov.uk/get-childcare',
    sourceName: 'GOV.UK — Get childcare',
    lastUpdated: 'April 2026',
  },
  'stock-unit-calculator': {
    howItWorks: [
      'Livestock Units (LU) provide a standardised measure for comparing the grazing demand and environmental impact of different farm animals. Each species and age class is assigned a coefficient relative to a reference animal (one dairy cow = 1.0 LU). Standard UK coefficients include: dairy cow 1.0, beef suckler cow 0.75, other cattle over 2 years 0.65, cattle 1-2 years 0.6, sheep (ewe) 0.12, ram 0.15, hogget 0.10, sow 0.4, finishing pig 0.12, and horse 0.80.',
      'Total Livestock Units determine your farm\'s stocking density when divided by the available forage hectares. Defra and the Rural Payments Agency use stocking density thresholds for agri-environment scheme eligibility, cross-compliance checks, and Countryside Stewardship agreements. Typical extensive grazing targets 0.5-1.0 LU per hectare, while intensive grassland systems may support 1.5-2.5 LU/ha.',
      'The calculator aggregates all animal classes on your holding and produces a total LU figure, overall stocking rate per hectare, and comparison against scheme thresholds. Seasonal adjustments can be applied where animals are only present for part of the year by multiplying the LU coefficient by the fraction of months grazed (e.g., 200 ewes present for 8 months = 200 x 0.12 x 8/12 = 16.0 adjusted LU).'
    ],
    example: {
      title: 'Mixed farm livestock unit calculation on 65 hectares',
      steps: [
        '45 dairy cows x 1.0 LU = 45.0 LU',
        '30 beef cattle (over 2 years) x 0.65 LU = 19.5 LU',
        '250 breeding ewes x 0.12 LU = 30.0 LU',
        'Total Livestock Units: 45.0 + 19.5 + 30.0 = 94.5 LU',
        'Stocking density: 94.5 LU / 65 hectares = 1.45 LU/ha (within typical grassland range)'
      ]
    },
    sourceUrl: 'https://www.gov.uk/guidance/rural-payments-service',
    sourceName: 'Defra - Rural Payments and Stocking Guidance',
    lastUpdated: 'April 2026',
  },
  'agricultural-worker-wage-calculator': {
    howItWorks: [
      'Agricultural workers in England are covered by the Agricultural Wages Orders, which set minimum pay rates based on grade. The National Living Wage (for ages 21+) is currently £12.71 per hour and applies as a minimum for all agricultural workers. Some older Agricultural Wages Orders set higher rates for specialist grades.',
      'Workers are entitled to overtime, holiday pay (5.6 weeks per year), sick pay and accommodation offsets where housing is provided by the employer. In Wales, the Agricultural Advisory Panel for Wales sets separate minimum rates, and in Scotland, minimum rates are aligned with the National Minimum/Living Wage.',
      'This calculator works out weekly and monthly gross pay based on hours worked, grade and any overtime. It also calculates holiday pay entitlement and shows the employer\'s NI and pension auto-enrolment contributions on top of the gross wage.',
    ],
    example: {
      title: 'Example: Standard worker, 39 hours/week',
      steps: [
        'Hourly rate: £12.71 (National Living Wage)',
        'Weekly gross pay: 39 × £12.71 = £495.69',
        'Monthly gross pay: £2,063.49',
        'Annual holiday entitlement: 5.6 weeks = £2,666.66',
        'Employer NI (13.8% above threshold): approx. £33/week',
      ],
    },
    sourceUrl: 'https://www.gov.uk/national-minimum-wage-rates',
    sourceName: 'GOV.UK — National Minimum Wage and Living Wage rates',
    lastUpdated: 'April 2026',
  },
  'mean-median-mode-calculator': {
    howItWorks: [
      'The three averages — mean, median and mode — each summarise a data set differently. The mean is the sum divided by the count, affected by outliers. The median is the middle value when sorted, resistant to outliers. The mode is the most frequent value, useful for categorical data.',
      'This calculator finds all three averages plus the range (highest minus lowest). It sorts your data, highlights the median position and identifies all modes (a set can have multiple modes or no mode at all). Results include step-by-step working for each measure.',
    ],
    example: {
      title: 'Example: Data set {3, 7, 7, 2, 9}',
      steps: [
        'Sorted: 2, 3, 7, 7, 9',
        'Mean: (2+3+7+7+9) ÷ 5 = 5.6',
        'Median: 7 (middle value)',
        'Mode: 7 (appears twice)',
        'Range: 9 − 2 = 7',
      ],
    },
    sourceUrl: 'https://www.bbc.co.uk/bitesize/guides/z3nygdm/revision/1',
    sourceName: 'BBC Bitesize — Averages',
    lastUpdated: 'April 2026',
  },
  'prime-number-calculator': {
    howItWorks: [
      'A prime number is a whole number greater than 1 that has no divisors other than 1 and itself. This calculator checks whether any given number is prime by testing divisibility up to its square root. It also finds the complete prime factorisation of composite numbers.',
      'The calculator can list all primes within a range (e.g. all primes between 1 and 1,000) and find the next prime above or below a given number. Prime factorisation is useful in cryptography, simplifying fractions, and finding the least common multiple (LCM) or greatest common divisor (GCD) of two numbers.',
    ],
    example: {
      title: 'Example: Is 97 prime? Factor 360.',
      steps: [
        '97: test divisors up to √97 ≈ 9.85',
        '97 is not divisible by 2, 3, 5 or 7 — it is prime',
        '360 = 2 × 180 = 2 × 2 × 90 = 2 × 2 × 2 × 45 = 2³ × 3² × 5',
        'Prime factors of 360: 2, 3 and 5',
      ],
    },
    sourceUrl: 'https://www.bbc.co.uk/bitesize/guides/z9hb97h/revision/1',
    sourceName: 'BBC Bitesize — Prime numbers',
    lastUpdated: 'April 2026',
  },
  'waist-hip-ratio-calculator': {
    howItWorks: [
      'Waist-to-hip ratio (WHR) is calculated by dividing your waist circumference by your hip circumference. The World Health Organisation uses WHR as an indicator of central obesity and associated health risks, including cardiovascular disease and type 2 diabetes. It is considered a better predictor than BMI alone for certain conditions.',
      'WHO defines abdominal obesity as a WHR above 0.90 for men and above 0.85 for women. A ratio below these thresholds is associated with lower risk. The NHS also recommends monitoring waist circumference independently: above 94 cm (men) or 80 cm (women) indicates increased risk, and above 102 cm (men) or 88 cm (women) indicates high risk.',
      'Measure your waist at the midpoint between the lowest rib and the top of the hip bone (iliac crest), and your hips at the widest point of the buttocks. Use a flexible tape measure on bare skin, standing and breathing normally.',
    ],
    example: {
      title: 'Example: Female, waist 76 cm, hips 100 cm',
      steps: [
        'WHR = waist \u00F7 hips = 76 \u00F7 100 = 0.76',
        'WHO threshold for women: 0.85',
        'Result: 0.76 is below threshold \u2014 low risk',
        'Waist also below 80 cm \u2014 healthy range',
      ],
    },
    sourceUrl: 'https://www.nhs.uk/live-well/healthy-weight/managing-your-weight/waist-circumference/',
    sourceName: 'NHS \u2014 Waist circumference and health risk',
    lastUpdated: 'April 2026',
  },
  'raised-bed-calculator': {
    howItWorks: [
      'Raised bed soil volume is calculated as length \u00D7 width \u00D7 depth. A depth of 200\u2013300 mm suits most vegetables and flowers; deeper beds (400\u2013600 mm) are needed for root crops and fruit. The RHS recommends filling raised beds with a mix of topsoil (60\u201370%), compost (20\u201330%) and sharp sand or perlite (5\u201310%) for good drainage.',
      'This calculator also estimates the timber or sleeper quantity needed to build the bed frame. Standard options include treated softwood boards (150 \u00D7 22 mm, stacked 2\u20133 high), railway sleepers (200 \u00D7 100 mm) and composite boards. Corner posts, screws and weed membrane are included in the materials list.',
      'Enter the bed dimensions. The calculator shows soil volume in litres and bulk bags, plus a bill of materials for the frame. A 1.2 m \u00D7 2.4 m bed at 300 mm deep is a popular size \u2014 wide enough for a double row of plants but narrow enough to reach the centre from either side without stepping on the soil.',
    ],
    example: {
      title: 'Example: Raised bed 2.4 m \u00D7 1.2 m \u00D7 0.3 m deep',
      steps: [
        'Volume: 2.4 \u00D7 1.2 \u00D7 0.3 = 0.864 m\u00B3 (864 litres)',
        'Soil mix: ~600 L topsoil + ~220 L compost + ~44 L sharp sand',
        'Timber: 6 boards at 2.4 m + 6 boards at 1.2 m (150 \u00D7 22 mm, 3 courses)',
        'Corner posts: 4 \u00D7 350 mm (50 \u00D7 50 mm)',
        'Estimated fill cost: £60\u2013£100 (bulk bags)',
      ],
    },
    sourceUrl: 'https://www.rhs.org.uk/garden-features/raised-beds',
    sourceName: 'RHS \u2014 Raised beds',
    lastUpdated: 'April 2026',
  },
  'fence-paint-calculator': {
    howItWorks: [
      'Fence paint or stain coverage depends on the product and the condition of the timber. Most fence paints cover 4\u20136 m\u00B2 per litre on rough-sawn timber (which absorbs more) and 8\u201310 m\u00B2 per litre on smooth or previously painted timber. Water-based fence paints dry in 1\u20132 hours; solvent-based treatments take 4\u20136 hours.',
      'This calculator measures the total fence area: panel height \u00D7 total run length \u00D7 number of painted sides (usually one or two). For closeboard or overlap panels, the overlapping boards create extra surface area \u2014 the calculator adds 15\u201320% to account for this. Posts and gravel boards are included as additional area.',
      'Enter fence dimensions, number of sides to paint and number of coats. The calculator shows total area, litres needed and tin sizes. Most UK fence paints are sold in 5 L and 9 L tins. One coat is usually sufficient for maintenance; two coats are recommended for bare or weathered timber for best coverage and longevity.',
    ],
    example: {
      title: 'Example: 12 m fence, 1.8 m panels, one side, 2 coats, rough timber',
      steps: [
        'Panel area: 12 \u00D7 1.8 = 21.6 m\u00B2',
        'Overlap adjustment (+15%): 24.8 m\u00B2',
        'Posts and gravel boards: +3.5 m\u00B2',
        'Total area (2 coats): (24.8 + 3.5) \u00D7 2 = 56.6 m\u00B2',
        'Litres needed: 56.6 \u00F7 5 = 11.3 L \u2014 buy 2 \u00D7 5 L + 1 \u00D7 2.5 L or 1 \u00D7 9 L + 1 \u00D7 5 L',
      ],
    },
    sourceUrl: 'https://www.rhs.org.uk/garden-features/fences',
    sourceName: 'RHS \u2014 Fences',
    lastUpdated: 'April 2026',
  },
  'clothing-size-converter': {
    howItWorks: [
      'UK clothing sizes differ from US and EU sizes. For women\'s tops and dresses, UK sizes are typically two sizes smaller than US sizes (UK 10 = US 6) and numerically different from EU sizes (UK 10 = EU 38). Men\'s sizes often align more closely but still vary by brand.',
      'This converter translates between UK, US and EU sizes for men\'s and women\'s tops, trousers, dresses and jackets. It also provides the corresponding body measurements (chest, waist, hips) in both centimetres and inches so you can check the fit against a brand\'s own size chart.',
    ],
    example: {
      title: 'Example: Women\'s UK size 12',
      steps: [
        'UK 12 = US 8',
        'UK 12 = EU 40',
        'Bust: approx. 91 cm (36 in)',
        'Waist: approx. 73 cm (29 in)',
      ],
    },
    sourceUrl: 'https://www.gov.uk/government/publications/clothing-and-textiles-labelling-requirements',
    sourceName: 'GOV.UK — Clothing labelling requirements',
    lastUpdated: 'April 2026',
  },
  'volume-converter': {
    howItWorks: [
      'Volume measurements in the UK can be confusing because UK gallons, pints and fluid ounces differ from US equivalents. A UK pint is 568 ml while a US pint is only 473 ml. This converter distinguishes between UK (imperial) and US measures to avoid errors.',
      'The converter supports litres, millilitres, UK gallons, US gallons, UK pints, US pints, UK fluid ounces, US fluid ounces, cups (US standard) and tablespoons. It is useful for cooking (recipe conversions), fuel economy and liquid measurements in general.',
    ],
    example: {
      title: 'Example: Converting 2 UK gallons',
      steps: [
        '2 UK gallons = 9.092 litres',
        '2 UK gallons = 2.402 US gallons',
        '2 UK gallons = 16 UK pints',
        '2 UK gallons = 19.215 US pints',
      ],
    },
    sourceUrl: 'https://www.npl.co.uk/si-units',
    sourceName: 'National Physical Laboratory — SI units',
    lastUpdated: 'April 2026',
  },
  'birthday-calculator': {
    howItWorks: [
      'Enter your date of birth and this calculator reveals the day of the week you were born, your star sign, your Chinese zodiac animal, your birthstone and how many days until your next birthday. It also shows fun facts like the number one song or major event on your birth date.',
      'The day-of-week calculation uses Zeller\'s congruence, a well-known mathematical formula that works for any date in the Gregorian calendar. The Chinese zodiac follows a 12-year cycle — each year is associated with an animal sign based on the lunar new year date.',
    ],
    example: {
      title: 'Example: Born 23 July 1995',
      steps: [
        'Day of the week: Sunday',
        'Star sign: Leo (23 Jul – 22 Aug)',
        'Chinese zodiac: Pig (Year of the Pig, 1995)',
        'Days until next birthday: calculated from today\'s date',
      ],
    },
    sourceUrl: 'https://www.rmg.co.uk/stories/topics/which-day-week-were-you-born',
    sourceName: 'Royal Museums Greenwich — Day of the week calculator',
    lastUpdated: 'April 2026',
  },
  'car-insurance-estimate-calculator': {
    howItWorks: [
      'Car insurance premiums in the UK are calculated using a complex set of risk factors. The main drivers are your age (younger drivers pay dramatically more), location (urban areas cost more), vehicle group (1-50 insurance groups), claims history and no-claims bonus. The average UK car insurance premium is around £600-£800 per year but varies enormously by driver profile.',
      'No-claims bonus (NCB) is the single biggest discount factor. Each claim-free year typically adds 20-30% discount, building to a maximum of around 65-75% after 5+ years. Protecting your NCB costs extra but prevents it being lost after a claim. Telematics (black box) policies can save younger drivers 20-40% by monitoring driving behaviour.',
      'There are three cover levels: third party only (cheapest, covers damage to others), third party fire and theft, and fully comprehensive (covers your vehicle too). Counterintuitively, comprehensive cover is often cheaper than third party only because it is chosen by lower-risk drivers, which affects the pricing pool.',
    ],
    example: {
      title: 'Example: Age 30, 5 years NCB, VW Golf, suburban postcode',
      steps: [
        'Base premium estimate: £900',
        'No-claims bonus (5 years, ~60%): -£540',
        'Low-risk occupation discount: -£50',
        'Voluntary excess (£350): -£40',
        'Estimated annual premium: ~£270',
        'Monthly (with interest): ~£25/month',
      ],
    },
    sourceUrl: 'https://www.fca.org.uk/consumers/car-insurance',
    sourceName: 'FCA — Car insurance',
    lastUpdated: 'April 2026',
  },
  'home-insurance-calculator': {
    howItWorks: [
      'Home insurance in the UK consists of two parts: buildings insurance (covering the structure, walls, roof, fixtures and fittings) and contents insurance (covering your possessions). Mortgage lenders require buildings insurance as a condition of the loan. The rebuild cost, not the market value, determines the buildings cover amount.',
      'The Association of British Insurers (ABI) publishes average rebuild costs per square metre by region and property type. A typical 3-bedroom semi-detached house has a rebuild cost of £150,000-£250,000 depending on location. Contents insurance should cover the total replacement value of everything you own inside the home.',
      'Premiums are influenced by property type, location (flood risk, crime rates), rebuild value, claims history, security features and excess level. Average UK home insurance costs £300-£500 per year for combined buildings and contents cover. Increasing your voluntary excess can reduce premiums significantly.',
    ],
    example: {
      title: 'Example: 3-bed semi, rebuild £200,000, contents £50,000',
      steps: [
        'Buildings insurance: ~£180/year',
        'Contents insurance: ~£120/year',
        'Combined policy discount: -£30',
        'Estimated annual premium: £270',
        'With £250 voluntary excess: ~£230/year',
      ],
    },
    sourceUrl: 'https://www.abi.org.uk/products-and-issues/topics-and-issues/home-insurance/',
    sourceName: 'ABI — Home insurance',
    lastUpdated: 'April 2026',
  },
  'critical-illness-calculator': {
    howItWorks: [
      'Critical illness insurance pays a tax-free lump sum if you are diagnosed with a specified serious illness such as cancer, heart attack, stroke or multiple sclerosis. Most policies cover 40-60 named conditions plus additional partial-payment conditions. The payout is typically used to clear a mortgage, fund treatment or provide a financial buffer during recovery.',
      'The amount of cover needed depends on your circumstances. Common approaches include: mortgage balance only (to clear the biggest debt), mortgage plus 2-3 years\' income (to cover recovery time), or a comprehensive amount covering all major financial commitments. Average UK claims are around £60,000-£80,000.',
      'Premiums are based on age, health, family medical history, smoker status and the level of cover. Critical illness cover is significantly more expensive than life insurance because the probability of claiming is higher. Combining CI with life insurance (a life-or-earlier-CI policy) can reduce costs.',
    ],
    example: {
      title: 'Example: Age 40, non-smoker, £200,000 cover, 20-year term',
      steps: [
        'Mortgage balance: £180,000',
        'Emergency fund buffer: £20,000',
        'Total cover: £200,000',
        'Estimated monthly premium: £80-£120',
        'Annual cost: £960-£1,440',
        'Combined with life insurance: ~£100-£140/month',
      ],
    },
    sourceUrl: 'https://www.moneyhelper.org.uk/en/everyday-money/insurance/critical-illness-insurance',
    sourceName: 'MoneyHelper — Critical illness insurance',
    lastUpdated: 'April 2026',
  },
  'ev-savings-calculator': {
    howItWorks: [
      'Switching from a petrol or diesel car to an electric vehicle can save significant money on fuel, road tax and maintenance. Electricity is cheaper per mile than petrol: a typical EV costs 4-7p per mile to run on home charging versus 14-18p per mile for a petrol car. Road tax (VED) for EVs registered before April 2025 is £0, while those registered from April 2026 onwards pay the standard rate.',
      'Maintenance costs are lower for EVs because they have fewer moving parts. There is no clutch, exhaust system, cambelt or traditional gearbox to service. Brake pad wear is reduced through regenerative braking. Annual servicing costs are typically £100-£200 less than an equivalent petrol car.',
      'This calculator compares the total cost of ownership between an EV and a comparable petrol or diesel car over 3-5 years. It includes purchase price (or lease cost), fuel/charging, insurance, road tax, MOT and maintenance to show the true financial picture.',
    ],
    example: {
      title: 'Example: EV vs petrol over 5 years, 10,000 miles/year',
      steps: [
        'Annual fuel saving (EV vs petrol): ~£900',
        'Annual road tax saving: £0-£190 (depending on registration date)',
        'Annual maintenance saving: ~£150',
        'Total 5-year running cost saving: ~£5,250-£6,200',
        'Higher EV insurance premium: +£150/year',
        'Net 5-year saving: ~£4,500-£5,450',
      ],
    },
    sourceUrl: 'https://www.gov.uk/vehicle-tax-rate-tables',
    sourceName: 'GOV.UK — Vehicle tax rates',
    lastUpdated: 'April 2026',
  },
  'property-cgt-calculator': {
    howItWorks: [
      'Capital Gains Tax on residential property is charged at higher rates than other assets. For 2026/27, basic-rate taxpayers pay 18% on residential property gains, while higher and additional-rate taxpayers pay 24%. The annual exempt amount of £3,000 applies before these rates are calculated.',
      'Your main home is usually exempt from CGT under Private Residence Relief (PRR). If you lived in the property for part of the ownership period, partial relief is available. Letting Relief provides up to £40,000 of additional exemption if the property was once your main home and was subsequently let to tenants.',
      'CGT on UK residential property must be reported and paid within 60 days of completion via the Capital Gains Tax on UK property service. This is earlier than the normal Self Assessment deadline. This calculator factors in PRR, letting relief and the £3,000 annual exemption to show your net liability.',
    ],
    example: {
      title: 'Example: Buy-to-let sold for £80,000 gain, higher-rate taxpayer',
      steps: [
        'Sale gain: £80,000',
        'Private Residence Relief: £0 (never lived in property)',
        'Less annual exempt amount: −£3,000',
        'Taxable gain: £77,000',
        'CGT at 24%: £77,000 × 24% = £18,480',
      ],
    },
    sourceUrl: 'https://www.gov.uk/tax-sell-property',
    sourceName: 'GOV.UK — Tax when you sell property',
    lastUpdated: 'April 2026',
  },
  'weighted-grade-calculator': {
    howItWorks: [
      'Many UK university degrees weight modules by credit value. A standard undergraduate year comprises 120 credits, with modules typically worth 15, 20 or 30 credits each. Your weighted average is calculated by multiplying each module mark by its credit value, summing the results and dividing by the total credits.',
      'Degree classification is usually based on a weighted average across years, with later years counting more heavily. A common weighting is Year 2 at 33% and Year 3 at 67%, or Year 2 at 25% and Year 3 at 75%. Some institutions count all three years. The calculator supports custom year weightings.',
      'Enter your module marks and credit values for each year. The calculator produces a weighted average for each year and an overall degree average using your institution\'s year weighting. It then maps this to a degree classification: First (\u226570%), 2:1 (\u226560%), 2:2 (\u226550%), Third (\u226540%).',
    ],
    example: {
      title: 'Example: Year 2 average 62%, Year 3 average 68%, weighting 33:67',
      steps: [
        'Year 2 contribution: 62 \u00D7 0.33 = 20.46',
        'Year 3 contribution: 68 \u00D7 0.67 = 45.56',
        'Overall weighted average: 66.02%',
        'Classification: Upper Second (2:1)',
      ],
    },
    sourceUrl: 'https://www.gov.uk/what-different-qualification-levels-mean/list-of-qualification-levels',
    sourceName: 'GOV.UK \u2014 Qualification levels',
    lastUpdated: 'April 2026',
  },

  /* ──────────────────────── BUILDING / CONSTRUCTION ──────────────────────── */
  'cost-of-living-comparison-calculator': {
    howItWorks: [
      'Comparing living costs between UK cities helps with relocation decisions, salary negotiations and retirement planning. The biggest differences are in housing — renting in London can cost two to three times more than equivalent accommodation in cities like Liverpool, Sheffield or Newcastle.',
      'This calculator compares monthly costs across key categories: housing, council tax, transport, groceries and utilities. It uses ONS expenditure data and regional indices to show the percentage difference between two chosen cities for each category and overall.',
      'Keep in mind that salaries also vary by region. A lower cost of living does not automatically mean a better standard of living if wages are proportionally lower. The calculator shows the equivalent salary you would need in your target city to maintain the same purchasing power.',
    ],
    example: {
      title: 'Example: London vs Manchester',
      steps: [
        'Rent (1-bed): London £1,600 vs Manchester £750 — 53% cheaper',
        'Council tax (Band D): London £1,674/yr vs Manchester £1,588/yr — 5% cheaper',
        'Monthly transport: London £160 vs Manchester £70 — 56% cheaper',
        'Overall cost of living: Manchester approx. 35–40% cheaper than London',
        'A £50,000 London salary is equivalent to approx. £32,000 in Manchester',
      ],
    },
    sourceUrl: 'https://www.ons.gov.uk/economy/regionalaccounts',
    sourceName: 'ONS — Regional accounts',
    lastUpdated: 'April 2026',
  },
  'pension-annual-allowance-calculator': {
    howItWorks: [
      'The standard annual allowance is £60,000, meaning total pension contributions from all sources (employer, employee, and tax relief) in a tax year cannot exceed this without triggering a tax charge. Unused allowance can be carried forward from the previous three tax years, provided you were a member of a registered pension scheme in those years. The carry-forward is used oldest year first.',
      'For high earners, the tapered annual allowance reduces the £60,000 limit by £1 for every £2 of adjusted income above £260,000, down to a minimum of £10,000. Adjusted income includes all earnings plus employer pension contributions. Threshold income (net income before pension contributions) must also exceed £200,000 for tapering to apply; if it doesn\'t, the full £60,000 allowance remains.',
      'The <a href="/calculator/pension-annual-allowance-calculator/" class="text-primary underline">Money Purchase Annual Allowance</a> (MPAA) of £10,000 applies once you flexibly access taxable income from a defined contribution pension (e.g., drawdown or an uncrystallised funds pension lump sum). The MPAA only restricts money purchase contributions; defined benefit accrual retains a separate £50,000 allowance under the alternative annual allowance rules.'
    ],
    example: {
      title: 'Annual allowance check for a higher earner',
      steps: [
        'Adjusted income: £280,000 (salary £240,000 + employer pension £40,000)',
        'Threshold income: £240,000 (exceeds £200,000, so tapering applies)',
        'Taper reduction: (£280,000 - £260,000) / 2 = £10,000 reduction',
        'Tapered annual allowance: £60,000 - £10,000 = £50,000',
        'Total contributions this year: £40,000 — within the £50,000 tapered limit, no tax charge'
      ]
    },
    sourceUrl: 'https://www.gov.uk/tax-on-your-private-pension/annual-allowance',
    sourceName: 'GOV.UK',
    lastUpdated: 'April 2026',
  },
  'state-pension-age-calculator': {
    howItWorks: [
      'State Pension age in the UK follows a legislated schedule set by the Pensions Act 2014 and subsequent reviews. The current State Pension age is 66 for both men and women. It is legislated to rise to 67 between May 2026 and March 2028 (phased by date of birth), and then to 68 between 2044 and 2046. The government periodically reviews the timetable; the 2023 review confirmed the rise to 67 but deferred the decision on the rise to 68.',
      'The calculation maps your date of birth to the exact date you reach State Pension age using the published tables. For those born between 6 March 1961 and 5 April 1977, State Pension age is 67. For those born after 5 April 1977, the currently legislated age is 68 (between 2044-2046), though this is subject to future review. The phasing means people born a day apart can have State Pension ages months apart during transition periods.',
      'The calculator factors in the state pension age for both new State Pension and the basic/additional State Pension for those who reached pension age before April 2016. It also shows how many years remain until your State Pension age, helping with retirement planning. The government\'s principle is that people should spend up to one-third of adult life in retirement, which guides future age increases linked to life expectancy projections.',
      'Current and future State Pension age. As of May 2026: SPA is 66 for both men and women. Increases to 67 between 6 April 2026 and 5 April 2028 (depending on date of birth). Further rise to 68 scheduled between 2044 and 2046 — though there is ongoing review and possible acceleration to 2037-39. Use the gov.uk/state-pension-age tool for your exact date based on date of birth. Most people born 1960-61 have SPA between 66 and 1 month and 66 and 11 months.',
      'Why State Pension age keeps rising. UK SPA is linked by law to life expectancy. The 1995 Pensions Act started equalising women\'s SPA up from 60 (completed 2018). The 2007 Act began the 65-to-67 transition; the 2014 Act accelerated and added 67-to-68. Future rises depend on the Cridland Review (2017) recommendation that working life and retirement should be in ~2:1 ratio. Critics argue rises disadvantage lower-paid manual workers with shorter healthy life expectancy.',
      'Deferring State Pension — when worth it. You can defer claiming State Pension after reaching SPA. For each 9 weeks deferred, your pension increases by 1% — 5.8% per year. Deferring 5 years = 29% higher pension for life. Breakeven (deferred amount catches up) is roughly age 80. Best for: those still working past SPA who would lose pension to income tax; those in good health expecting to live to 85+. Not worth it if: poor health, immediate cashflow needed, lower-rate taxpayer.',
      'What if you don\'t qualify for full State Pension? You need 35 qualifying NI years for full £241.30/week (2026/27). Each missing year costs £6.89/week (£358/year). Voluntary Class 3 NI contributions (£17.45/week = £907/year) can fill gaps for ~£907 each year purchased — payback within 2.75 years if you live to SPA. This is the best return investment in UK personal finance: gov.uk/check-state-pension-and-fill-gaps. Apply BEFORE the 5-year cutoff (older years are harder/more expensive to fill).',
    ],
    example: {
      title: 'State Pension age for someone born 15 September 1970',
      steps: [
        'Date of birth: 15 September 1970',
        'Born between 6 April 1961 and 5 April 1977: State Pension age = 67',
        'State Pension date: 15 September 2037',
        'Current age (April 2026): 55 years old',
        'Years until State Pension: 11 years and 5 months remaining'
      ]
    },
    sourceUrl: 'https://www.gov.uk/state-pension-age',
    sourceName: 'GOV.UK',
    lastUpdated: 'April 2026',
  },
  'student-loan-early-repay-calculator': {
    howItWorks: [
      'This calculator compares two strategies: making voluntary lump-sum repayments to clear your student loan early versus investing that money instead. Early repayment saves interest but only makes financial sense if you would otherwise repay the loan in full. If you are on track for write-off, early repayment is effectively giving money back to the government.',
      'The comparison models both scenarios over the remaining loan term. It calculates the interest saved by early repayment, then compares this to projected investment returns (net of tax) from investing the same lump sum. It accounts for the opportunity cost of money used for repayment.',
      'A key rule of thumb: only consider early repayment if you are confident you will repay the full balance before write-off. If your projected total repayments over 30 years exceed the outstanding balance, early repayment saves money. Otherwise, the money is better invested or used elsewhere.',
    ],
    example: {
      title: 'Example: £30,000 balance, £50,000 salary, considering £5,000 lump sum',
      steps: [
        'Without lump sum: projected total repayment \u2248 £48,000 (clears year 23)',
        'With £5,000 lump sum now: saves ~£2,800 in interest',
        'Alternative: invest £5,000 at 5% for 23 years = £15,300',
        'Better option in this case: invest (net gain ~£12,500 vs £2,800 saving)',
      ],
    },
    sourceUrl: 'https://www.gov.uk/repaying-your-student-loan/make-extra-repayments',
    sourceName: 'GOV.UK \u2014 Make extra student loan repayments',
    lastUpdated: 'April 2026',
  },
  'pension-pot-calculator': {
    howItWorks: [
      'Target pot calculation works backwards from desired retirement income. The 4% rule (derived from the Trinity Study) suggests withdrawing 4% of your pot in year one, then adjusting for inflation annually, gives a high probability of lasting 30 years. To generate £20,000/year from drawdown, you need £20,000 / 0.04 = £500,000. Alternatively, current annuity rates convert pot to income directly: at a 6.5% annuity rate, £20,000/year requires £307,692.',
      'The State Pension offsets your required private provision. The full new State Pension of £241.30/week (£11,502/year in 2026/27) reduces the income your private pension must generate. If you want £25,000/year total and expect full State Pension, your private pension only needs to produce £13,498/year, requiring a pot of approximately £337,450 at 4% drawdown or £207,662 at a 6.5% annuity rate.',
      'Working backwards to today, the calculator uses compound growth projections. Given a target pot, current savings, years to retirement, and assumed growth rate (typically 5% nominal for a balanced portfolio), it calculates the required monthly contribution using the future value of an annuity formula. Charges reduce effective growth, so a 5% gross return with 0.5% charges yields 4.5% net growth.'
    ],
    example: {
      title: 'How much pension pot for £30,000/year retirement income',
      steps: [
        'Desired annual retirement income: £30,000',
        'State Pension offset: £11,502/year (full new State Pension)',
        'Private pension income needed: £30,000 - £11,502 = £18,498/year',
        'Using 4% withdrawal rule: £18,498 / 0.04 = £462,450 target pot',
        'Currently aged 35 with £25,000 saved, 30 years to retirement at 4.5% net growth: need to contribute £530/month'
      ]
    },
    sourceUrl: 'https://www.gov.uk/plan-retirement-income',
    sourceName: 'GOV.UK',
    lastUpdated: 'April 2026',
  },
  'junior-isa-calculator': {
    howItWorks: [
      'Junior ISAs have an annual contribution limit of £9,000 per child per tax year, available from birth until age 18. Any UK resident child under 18 who does not have a Child Trust Fund can have a JISA. Parents, grandparents, and anyone else can contribute, but the total from all sources cannot exceed £9,000. The child takes ownership at 18 and can withdraw or continue holding the ISA as an adult ISA.',
      'The compound growth calculation is particularly powerful for JISAs because of the long time horizon (up to 18 years). At 6% annual growth, £9,000 contributed every year for 18 years grows to approximately £311,000 — of which £149,000 is pure investment growth. Even modest contributions of £100/month over 18 years at 6% growth produce approximately £38,700, nearly double the £21,600 contributed.',
      'Cash JISAs offer guaranteed returns at a fixed or variable interest rate, suitable for shorter time horizons. Stocks and Shares JISAs invest in funds or shares and are generally recommended for JISAs because the 18-year time horizon smooths out short-term volatility. The calculator shows both scenarios side by side, illustrating how even modest differences in average return (e.g., 4% cash vs 6% equities) compound to substantial differences over 18 years.'
    ],
    example: {
      title: 'Junior ISA: £250/month from birth to age 18',
      steps: [
        'Monthly contribution: £250 (£3,000/year, within £9,000 limit)',
        'Total contributed over 18 years: £3,000 x 18 = £54,000',
        'At 6% annual growth (Stocks & Shares JISA): approximately £103,400 at age 18',
        'Investment growth: £103,400 - £54,000 = £49,400 tax-free gains',
        'At 3% growth (Cash JISA): approximately £70,100 — £33,300 less than the equities scenario'
      ]
    },
    sourceUrl: 'https://www.gov.uk/junior-individual-savings-accounts',
    sourceName: 'GOV.UK',
    lastUpdated: 'April 2026',
  },
  'zero-hours-calculator': {
    howItWorks: [
      'Zero-hours contracts do not guarantee any minimum working hours, making income unpredictable. However, workers on these contracts still have statutory employment rights including the National Minimum Wage, paid annual leave (5.6 weeks pro rata based on hours worked), rest breaks and protection from discrimination.',
      'Holiday entitlement for zero-hours workers is calculated as 12.07% of hours worked, giving the equivalent of 5.6 weeks per year. This can be paid as rolled-up holiday pay (included in each pay packet) or accrued and taken as time off. The method must be clearly stated in the contract.',
      'This calculator estimates your annual earnings, holiday pay and statutory entitlements based on your average weekly hours and hourly rate. It also shows estimated tax and NI, and flags if your earnings fall below the NI Primary Threshold, meaning you would not build State Pension qualifying years.',
    ],
    example: {
      title: 'Example: Average 20 hours/week at £12.71/hour',
      steps: [
        'Weekly gross: 20 × £12.71 = £254.20',
        'Annual gross (52 weeks): £12,698.40',
        'Holiday entitlement: 20 × 5.6 = 112 hours (£1,367.52)',
        'Below Personal Allowance (£12,570): minimal income tax',
        'Above NI Primary Threshold: NI payable on £128.40',
      ],
    },
    sourceUrl: 'https://www.gov.uk/contract-types-and-employer-responsibilities/zero-hour-contracts',
    sourceName: 'GOV.UK — Zero-hours contracts',
    lastUpdated: 'April 2026',
  },
  'agency-worker-calculator': {
    howItWorks: [
      'Agency workers in the UK have specific rights under the Agency Workers Regulations 2010. From day one, agency workers are entitled to access shared facilities and information about permanent vacancies. After completing a 12-week qualifying period in the same role with the same hirer, they gain the right to equal pay and conditions as if directly recruited.',
      'Equal treatment after 12 weeks covers basic pay, overtime rates, holiday entitlement, rest periods, night work limits and access to collective facilities. It does not cover occupational sick pay, pension schemes, redundancy pay or maternity leave beyond the statutory minimum. Anti-avoidance rules prevent hirers from resetting the 12-week clock.',
      'This calculator estimates your pay and entitlements based on whether you have completed the qualifying period. Enter your hourly rate, agency margin and weekly hours to see your take-home pay. After 12 weeks, it shows what your pay should be if equivalent permanent employees earn more.',
    ],
    example: {
      title: 'Example: Agency worker, 38 hours/week, £13.50/hour',
      steps: [
        'Weekly gross: 38 × £13.50 = £513',
        'Annual gross: £513 × 52 = £26,676',
        'Holiday entitlement: 5.6 weeks = £2,872.80',
        'After 12 weeks: comparable permanent role pays £14.50/hour',
        'New weekly gross: 38 × £14.50 = £551 (uplift of £38/week)',
      ],
    },
    sourceUrl: 'https://www.gov.uk/agency-workers-your-rights',
    sourceName: 'GOV.UK — Agency workers: your rights',
    lastUpdated: 'April 2026',
  },
  'settlement-agreement-calculator': {
    howItWorks: [
      'A settlement agreement (formerly compromise agreement) is a legally binding contract where an employee waives the right to bring tribunal claims in exchange for a financial package. Typical components include notice pay, redundancy pay, an ex-gratia payment (often tax-free up to £30,000), holiday pay and a contribution toward legal fees.',
      'The value of a settlement depends on your bargaining position. If you have strong tribunal claims (e.g. unfair dismissal or discrimination), the employer has more incentive to offer a generous package. A starting point for negotiation is often the basic award plus 3–6 months\' salary, but this varies enormously.',
      'This calculator estimates a typical settlement range based on your salary, length of service, notice period and the strength of any potential claims. The first £30,000 of an ex-gratia payment is usually tax-free under section 401 of ITEPA 2003.',
    ],
    example: {
      title: 'Example: 5 years\' service, £40,000 salary, 3 months\' notice',
      steps: [
        'Statutory redundancy: 5 weeks × £769 = £3,845',
        'Notice pay (3 months): £10,000 (taxable)',
        'Ex-gratia payment: £10,000–£20,000 (first £30,000 tax-free)',
        'Accrued holiday: £1,500',
        'Legal fees contribution: £350–£500 + VAT',
        'Total package estimate: £25,695–£35,845',
      ],
    },
    sourceUrl: 'https://www.acas.org.uk/settlement-agreements',
    sourceName: 'Acas — Settlement agreements',
    lastUpdated: 'April 2026',
  },

  // ─── IMMIGRATION ─────────────────────────────────────────────────────
  'buy-to-let-mortgage-calculator': {
    howItWorks: [
      'Buy-to-let mortgages differ from residential mortgages in several ways. Most are interest-only, meaning monthly payments cover only the interest and the full capital balance is due at the end. Lenders typically require a rental coverage ratio of 125-145%, meaning the rental income must exceed the mortgage payment by that margin at a stress-tested interest rate.',
      'Minimum deposits for buy-to-let are usually 25% of the property value, giving a maximum LTV of 75%. Some lenders offer up to 80% LTV at higher rates. Interest rates are typically 0.5-1.5% higher than equivalent residential rates. Affordability is assessed primarily on rental income rather than personal income, though most lenders also require a minimum personal income of £25,000.',
      'This calculator models both interest-only and repayment buy-to-let mortgages. Enter the property price, deposit, rental income and interest rate to see monthly payments and the rental coverage ratio. It flags whether the rental income meets the typical 145% lender requirement at a stress rate of 5.5%.',
    ],
    example: {
      title: 'Example: £250,000 property, 25% deposit, £1,100/month rent',
      steps: [
        'Mortgage: £187,500 at 75% LTV',
        'Interest-only at 5.2%: £187,500 × 5.2% ÷ 12 = £812.50/month',
        'Rental coverage: £1,100 ÷ £812.50 = 135%',
        'Stress test at 5.5%: £859.38/month, coverage = 128%',
        'Warning: below 145% threshold — some lenders may decline',
      ],
    },
    sourceUrl: 'https://www.fca.org.uk/consumers/mortgages-overview',
    sourceName: 'FCA — Mortgages overview',
    lastUpdated: 'April 2026',
  },
  'house-price-sqft-calculator': {
    howItWorks: [
      'Price per square foot is a standard metric for comparing property values across different sizes and locations. The calculation is straightforward: divide the property price by its total internal floor area in square feet. For example, a £300,000 property with 1,000 sq ft has a price per square foot of £300.',
      'UK averages vary enormously by location. Central London can exceed £1,500/sq ft, while parts of Northern England and Wales may be under £150/sq ft. Comparing price per square foot helps identify whether a property is competitively priced relative to similar homes in the area and whether you are getting value for money.',
      'This calculator converts between square feet and square metres (1 sq m = 10.764 sq ft) and calculates the price per unit area. Enter the property price and floor area to see the price per sq ft, or enter a target price per sq ft to calculate what a given property should cost.',
    ],
    example: {
      title: 'Example: £425,000 property, 120 sq m (1,292 sq ft)',
      steps: [
        'Floor area: 120 sq m = 1,292 sq ft',
        'Price per sq ft: £425,000 ÷ 1,292 = £329/sq ft',
        'Price per sq m: £425,000 ÷ 120 = £3,542/sq m',
        'Local average: £310/sq ft — property is 6% above average',
        'At average rate: property would be worth £400,520',
      ],
    },
    sourceUrl: 'https://www.ons.gov.uk/peoplepopulationandcommunity/housing',
    sourceName: 'ONS — Housing statistics',
    lastUpdated: 'April 2026',
  },
  'lease-extension-calculator': {
    howItWorks: [
      'The cost of extending a leasehold property lease is calculated using a statutory valuation method set out in the Leasehold Reform, Housing and Urban Development Act 1993. The premium has three components: the landlord\'s loss of ground rent for the remaining term, the landlord\'s loss of the reversion (the property value they would receive when the lease expires), and 50% of the "marriage value" (the increase in property value created by the extension).',
      'Marriage value only applies when the unexpired lease is below 80 years — this is why it is generally advised to extend before the lease drops below 80 years, as the cost increases significantly. The capitalisation rate (typically 6-8%) and the deferment rate (typically 5% as set by the Sportelli ruling) are key assumptions in the calculation.',
      'Under the Leasehold and Freehold Reform Act 2024, planned changes may remove marriage value from the calculation entirely. This calculator uses the current statutory method and shows the estimated premium, broken down by component. Results are indicative — a formal RICS surveyor valuation may differ.',
    ],
    example: {
      title: 'Example: Flat worth £350,000, 72 years remaining, £200/year ground rent',
      steps: [
        'Ground rent loss (capitalised): approx. £3,100',
        'Reversion loss (value of freehold in 72 years): approx. £11,200',
        'Marriage value (50% of uplift): approx. £8,500',
        'Total estimated premium: approx. £22,800',
        'With 82 years remaining (no marriage value): approx. £12,000',
      ],
    },
    sourceUrl: 'https://www.gov.uk/leasehold-property/extending-your-lease',
    sourceName: 'GOV.UK — Extending your leasehold',
    lastUpdated: 'April 2026',
  },
  'student-loan-interest-calculator': {
    howItWorks: [
      'Interest on student loans accrues from the day the loan is paid out, including while you are still studying. For Plan 2 loans, the rate is linked to RPI (Retail Prices Index) plus a margin of up to 3% depending on income. While studying, you are charged RPI + 3%. After graduation, the rate scales from RPI (income \u2264 £29,385) to RPI + 3% (income \u2265 £49,130).',
      'For Plan 5 loans (started from 2023/24), interest is capped at RPI only, with no additional income-based margin. This means Plan 5 borrowers pay lower interest than Plan 2 borrowers at the same income level.',
      'This calculator shows the interest accruing on your balance each month and year, based on your current balance, plan type and income. It also shows how much of your monthly repayment goes to interest versus reducing the principal. For many graduates, repayments do not cover the interest, and the balance grows until it is written off.',
    ],
    example: {
      title: 'Example: Plan 2, £45,000 balance, £35,000 salary, RPI 3.5%',
      steps: [
        'Interest rate: RPI + partial margin \u2248 4.2%',
        'Annual interest: £45,000 \u00D7 4.2% = £1,890',
        'Monthly repayment: (£35,000 \u2212 £29,385) \u00D7 9% \u00F7 12 = £57.79',
        'Annual repayment: £693.45 \u2014 balance grows by ~£1,197/year',
      ],
    },
    sourceUrl: 'https://www.gov.uk/repaying-your-student-loan/what-you-pay',
    sourceName: 'GOV.UK \u2014 Repaying your student loan',
    lastUpdated: 'April 2026',
  },
  'debt-consolidation-calculator': {
    howItWorks: [
      'Debt consolidation replaces multiple debts — credit cards, overdrafts, store cards — with a single loan at one interest rate and one monthly payment. The idea is to reduce your overall interest cost and simplify your finances. However, it only saves money if the new rate is lower than the weighted average of your existing debts.',
      'Extending the repayment term can lower your monthly payment but increase the total interest you pay. This calculator compares the total cost of your current debts against a consolidation loan so you can see whether you genuinely save or simply spread the cost over longer.',
      'Before consolidating, check whether any of your existing debts carry early repayment charges. Also ensure the consolidation loan does not require security against your home, as this turns unsecured debt into secured debt and puts your property at risk.',
    ],
    example: {
      title: 'Example: Three debts totalling £8,000',
      steps: [
        'Credit card: £3,000 at 22.9% APR — £69/month',
        'Store card: £2,000 at 29.9% APR — £50/month',
        'Overdraft: £3,000 at 39.9% EAR — £100/month',
        'Consolidation loan: £8,000 at 7.9% APR over 4 years — £195/month',
        'Total interest saving vs current debts: approx. £2,100',
      ],
    },
    sourceUrl: 'https://www.moneyhelper.org.uk/en/everyday-money/credit/debt-consolidation-loans',
    sourceName: 'MoneyHelper — Debt consolidation loans',
    lastUpdated: 'April 2026',
  },
  'postgraduate-loan-calculator': {
    howItWorks: [
      'Postgraduate Master\'s loans of up to £12,471 (2026/27) are available for taught and research master\'s courses. Repayment is at 6% of income above £21,000. This is collected alongside any existing undergraduate loan repayment \u2014 the two are separate deductions, so you can end up paying 9% + 6% = 15% of income above the respective thresholds.',
      'Interest is charged at RPI (currently around 3\u20134%). The loan is written off 30 years after the April following course completion. Unlike undergraduate loans, the postgraduate loan has no means-testing on household income \u2014 the full amount is available to all eligible students.',
      'Enter your salary to see monthly repayments. If you also have an undergraduate Plan 2 loan, the calculator shows both deductions and the combined impact on your take-home pay.',
    ],
    example: {
      title: 'Example: £35,000 salary, Postgraduate Loan only',
      steps: [
        'Income above threshold: £35,000 \u2212 £21,000 = £14,000',
        'Annual repayment: £14,000 \u00D7 6% = £840',
        'Monthly deduction: £70.00',
        'If also on Plan 2: additional £57.79/month (total £127.79)',
      ],
    },
    sourceUrl: 'https://www.gov.uk/postgraduate-loan',
    sourceName: 'GOV.UK \u2014 Postgraduate Master\'s Loan',
    lastUpdated: 'April 2026',
  },
  'epc-calculator': {
    howItWorks: [
      'An Energy Performance Certificate (EPC) rates a property\'s energy efficiency from A (most efficient) to G (least efficient) on a scale of 1-100. The rating is based on the building\'s construction, insulation, heating system, lighting and renewable energy features. EPCs are required when selling or renting a property in England and Wales.',
      'The assessment considers the property\'s fabric (walls, roof, floor, windows), heating system type and efficiency, hot water system, lighting (proportion of low-energy bulbs) and any renewable energy generation. Each factor contributes to the overall score. A typical UK home scores Band D (55-68 on the scale).',
      'This calculator provides an estimated EPC rating based on your property\'s characteristics. It identifies the improvements most likely to increase your rating and estimates the cost and energy saving of each. Landlords must have a minimum EPC rating of E to let a property, with plans to raise this to C for new tenancies.',
    ],
    example: {
      title: 'Example: 1970s 3-bed semi, gas central heating',
      steps: [
        'Cavity wall insulation: +5 points',
        'Loft insulation (270mm): +4 points',
        'Condensing boiler: +8 points (already fitted)',
        'Double glazing throughout: +3 points (already fitted)',
        'LED lighting (100%): +2 points',
        'Estimated rating: Band D (62/100)',
      ],
    },
    sourceUrl: 'https://www.gov.uk/find-energy-certificate',
    sourceName: 'GOV.UK — Energy Performance Certificates',
    lastUpdated: 'April 2026',
  },
  'bathroom-cost-calculator': {
    howItWorks: [
      'Bathroom renovation costs range from £3,000\u2013£6,000 for a basic refit (replacing suite, re-tiling, keeping layout) to £8,000\u2013£15,000 for a mid-range project (new suite, full re-tile, updated plumbing, heated towel rail) and £15,000\u2013£25,000+ for a luxury finish (freestanding bath, walk-in shower, underfloor heating, bespoke tiling).',
      'Key cost drivers include: whether the layout changes (moving waste pipes and water supply adds significantly to plumbing costs), the specification of sanitaryware and tiling, and whether structural work is needed (such as strengthening the floor for a cast-iron bath). A standard bathroom refit takes 1\u20132 weeks.',
      'Enter your bathroom size, specification level and scope. The calculator estimates costs for the suite, tiling, plumbing, electrics (extractor fan, heated mirror, underfloor heating), flooring and labour. Any electrical work in a bathroom must comply with Building Regulations Part P and be done by a qualified electrician.',
    ],
    example: {
      title: 'Example: Mid-range family bathroom, 6 m\u00B2',
      steps: [
        'Suite (bath, basin, WC, shower): £1,800',
        'Tiling (walls and floor): £1,500',
        'Plumbing and electrics: £2,500',
        'Towel rail, mirror, accessories: £500',
        'Labour: £3,000 \u2014 Total: ~£9,300 including VAT',
      ],
    },
    sourceUrl: 'https://www.gov.uk/government/publications/building-regulations-approved-document-p-electrical-safety',
    sourceName: 'GOV.UK \u2014 Building Regulations Approved Document P',
    lastUpdated: 'April 2026',
  },
  'kitchen-cost-calculator': {
    howItWorks: [
      'Kitchen renovation costs in the UK vary enormously by specification. A budget kitchen (flat-pack units, laminate worktops, basic appliances) costs £5,000\u2013£10,000. A mid-range kitchen (solid-wood doors, quartz worktops, integrated appliances) runs to £10,000\u2013£20,000. A premium kitchen (bespoke cabinetry, natural stone, high-end appliances) can exceed £25,000\u2013£40,000 or more.',
      'Installation costs are separate: fitting a kitchen typically costs £3,000\u2013£8,000 depending on scope. This includes removal of the old kitchen, plumbing, electrics (new circuits may be needed for induction hobs), tiling, plastering and flooring. A full kitchen refit usually takes 2\u20134 weeks.',
      'Enter your kitchen size, specification level and the scope of work. The calculator breaks the estimate into units, worktops, appliances, plumbing, electrics, tiling and fitting labour. It also flags items that need Building Regulations notification (such as new electrical circuits or moving a gas supply).',
    ],
    example: {
      title: 'Example: Mid-range kitchen, 12 m\u00B2, full refit',
      steps: [
        'Units and worktops: £8,000',
        'Appliances (oven, hob, extractor, dishwasher, fridge-freezer): £3,500',
        'Plumbing and electrics: £2,500',
        'Tiling, flooring, plastering: £2,000',
        'Installation labour: £5,000 \u2014 Total: ~£21,000 including VAT',
      ],
    },
    sourceUrl: 'https://www.gov.uk/government/publications/building-regulations-approved-document-p-electrical-safety',
    sourceName: 'GOV.UK \u2014 Building Regulations Approved Document P',
    lastUpdated: 'April 2026',
  },
  'timber-calculator': {
    howItWorks: [
      'Timber in the UK is typically sold by the linear metre for structural work (joists, studwork, battens) or by cubic metre for larger quantities. Board feet (used in North America) can be converted: 1 board foot = 1/12 cubic foot = 0.00236 m\u00B3. Common structural sizes include 47 \u00D7 100 mm (C16 joists), 47 \u00D7 150 mm and 47 \u00D7 200 mm.',
      'This calculator works with linear metres, cubic metres and board feet. Enter the cross-section dimensions and total length needed, and it converts between all three units. For stud walls, it also estimates the number of studs (typically at 400 mm or 600 mm centres) plus top and bottom plates.',
      'UK structural timber must be graded to BS EN 14081 (C16 or C24 are the most common strength classes). For outdoor use, timber should be pressure-treated to Use Class 3 or 4. The calculator includes estimated prices per linear metre based on current UK merchant pricing.',
    ],
    example: {
      title: 'Example: Stud wall 3.6 m long \u00D7 2.4 m high, 47 \u00D7 100 mm at 600 mm centres',
      steps: [
        'Number of studs: 3,600 \u00F7 600 + 1 = 7 studs at 2.4 m',
        'Top and bottom plates: 2 \u00D7 3.6 m = 7.2 m',
        'Total linear metres: (7 \u00D7 2.4) + 7.2 = 24.0 m',
        'Volume: 0.047 \u00D7 0.100 \u00D7 24.0 = 0.113 m\u00B3',
      ],
    },
    sourceUrl: 'https://www.gov.uk/government/publications/building-regulations-approved-document-a-structure',
    sourceName: 'GOV.UK \u2014 Building Regulations Approved Document A',
    lastUpdated: 'April 2026',
  },
  'underfloor-heating-calculator': {
    howItWorks: [
      'Underfloor heating (UFH) distributes heat evenly across a room from beneath the floor surface. There are two main types: wet systems (warm water piped through the floor, connected to a boiler or heat pump) and electric systems (heating cables or mats beneath the floor). Wet systems are more efficient for whole-house heating, while electric systems are better for individual rooms.',
      'Installation costs vary significantly. Electric UFH costs £50-£80 per square metre for materials plus installation, making it affordable for bathrooms and kitchens. Wet UFH costs £100-£200 per square metre installed and is best fitted during new builds or major renovations when the floor is being replaced anyway.',
      'Running costs depend on insulation, floor covering and heat source. UFH operates at lower water temperatures (35-45 C vs 60-80 C for radiators), making it particularly efficient when paired with a heat pump. This calculator estimates installation and running costs for your room or whole-house setup and compares them against traditional radiator systems.',
    ],
    example: {
      title: 'Example: 25 m2 kitchen-diner, electric UFH',
      steps: [
        'System type: Electric mat (200W/m2)',
        'Materials: 25 x £55/m2 = £1,375',
        'Installation: £500',
        'Total cost: £1,875',
        'Running cost: 5 kW x 6 hours/day x 24.5p x 180 days = £1,323/year',
        'Radiator equivalent: ~£1,050/year (gas at current rates)',
        'Electric UFH premium: ~£273/year (offset by even heat distribution)',
      ],
    },
    sourceUrl: 'https://energysavingtrust.org.uk/advice/underfloor-heating/',
    sourceName: 'Energy Saving Trust — Underfloor heating',
    lastUpdated: 'April 2026',
  },
  'student-allowance-calculator': {
    howItWorks: [
      'Your total student finance package combines several elements: the tuition fee loan (up to £9,535 for 2026/27, paid directly to the university), the maintenance loan (means-tested, paid to you) and any grants or bursaries. Some students also qualify for Disabled Students\' Allowances or Childcare Grants.',
      'This calculator estimates your total package by combining tuition and maintenance loans with any additional grants. Tuition fee loans are not means-tested and cover up to the full fee. Maintenance loans are means-tested on household income. Additional grants (such as the Parents\' Learning Allowance or Adult Dependants\' Grant) have separate eligibility criteria.',
      'Enter your household income, dependants status and study details. The calculator shows each component and the total finance available, as well as what arrives as a loan (to be repaid) versus a grant (non-repayable). Remember that tuition fee loans go directly to your university, not into your bank account.',
    ],
    example: {
      title: 'Example: Household income £30,000, living away from home outside London',
      steps: [
        'Tuition fee loan: £9,535 (paid to university)',
        'Maintenance loan: ~£8,690 (means-tested)',
        'Total finance package: £18,225',
        'Paid to you in cash: £8,690 (in 3 termly instalments)',
      ],
    },
    sourceUrl: 'https://www.gov.uk/student-finance/new-fulltime-students',
    sourceName: 'GOV.UK \u2014 Student finance for new full-time students',
    lastUpdated: 'April 2026',
  },
  'night-shift-calculator': {
    howItWorks: [
      'Night shift workers in the UK often receive a premium on top of their basic hourly rate for working unsociable hours. There is no statutory right to enhanced night pay — it is determined by your contract. Common premiums range from an additional 10% to 33%, though some sectors like the NHS pay specific unsociable hours supplements.',
      'UK law defines a night worker as someone who works at least three hours during the night period (typically 11pm to 6am) as a normal course. Night workers have additional legal protections including a maximum average of 8 hours in any 24-hour period and the right to free health assessments.',
      'This calculator takes your basic rate, the night premium percentage and the number of night hours to work out your enhanced pay. It then shows the tax and NI on the total earnings, comparing your take-home from night shifts versus standard-hours pay.',
    ],
    example: {
      title: 'Example: 4 night shifts at 10 hours, base £14/hour, 25% premium',
      steps: [
        'Night rate: £14 × 1.25 = £17.50/hour',
        'Gross night pay: £17.50 × 40 hours = £700',
        'Compared to day rate: £14 × 40 = £560',
        'Extra gross from premium: £140',
        'Estimated extra net (after 28% deductions): £100.80',
      ],
    },
    sourceUrl: 'https://www.gov.uk/night-working-hours',
    sourceName: 'GOV.UK — Night working hours',
    lastUpdated: 'April 2026',
  },
  'benefits-in-kind-calculator': {
    howItWorks: [
      'HMRC taxes workplace benefits by converting them into a cash equivalent value, which is then taxed at your marginal income tax rate. Each benefit type has its own valuation method defined in the Income Tax (Earnings and Pensions) Act 2003. Your employer reports these values annually on form P11D, and HMRC adjusts your tax code to collect the additional tax owed through PAYE.',
      'Company car benefit is calculated by multiplying the car\'s P11D price (list price plus accessories, minus capital contributions up to £5,000) by the appropriate percentage based on CO2 emissions. For 2026/27, zero-emission vehicles attract a 2% rate, rising in 1% increments through to 37% for the highest polluters. The resulting cash equivalent is added to your taxable income.',
      'Private medical insurance benefit equals the cost your employer pays for the policy premium. Accommodation benefit uses the annual value or, if the property cost exceeds £75,000, adds a supplementary charge calculated as the excess multiplied by the official rate of interest (currently 2.25%).'
    ],
    example: {
      title: 'Company car and medical insurance BiK calculation',
      steps: [
        'Company car P11D price: £35,000, CO2 emissions 120g/km giving a 29% benefit rate',
        'Car benefit cash equivalent: £35,000 x 29% = £10,150',
        'Employer-paid medical insurance premium: £1,200 per year',
        'Total taxable benefit: £10,150 + £1,200 = £11,350',
        'Tax due at 20% basic rate: £11,350 x 20% = £2,270 per year (£189.17/month via adjusted tax code)'
      ]
    },
    sourceUrl: 'https://www.gov.uk/tax-company-benefits',
    sourceName: 'HMRC - Tax on Company Benefits',
    lastUpdated: 'April 2026',
  },
  'regular-savings-calculator': {
    howItWorks: [
      'Regular savings accounts accept fixed monthly deposits (typically £1-£500) and often offer a higher introductory rate than instant-access accounts. Interest calculation differs from lump-sum accounts because each monthly deposit earns interest for a different number of months. The first deposit earns 12 months of interest, the second earns 11 months, and the final deposit earns just 1 month — so the effective return on total deposits is roughly half the headline rate.',
      'The effective AER (Annual Equivalent Rate) accounts for this timing difference. A regular saver advertising 6% where you deposit £200/month totals £2,400 deposited over the year, but the average balance is only about £1,300 (since early deposits are in longer than late ones). Actual interest earned is approximately £78, which is 6% on the average balance but only about 3.25% on the total £2,400 deposited. The calculator shows both the headline rate and the effective return on total contributions.',
      'Monthly vs annual interest crediting affects the compounding. When interest is paid monthly, it begins earning interest immediately (compound interest). When paid annually, the interest sits un-compounded for up to 12 months. The difference is small for regular savers (typically less than £5 on £2,400 at 6%) but becomes meaningful on larger balances and longer terms. The calculator shows both scenarios for transparent comparison.'
    ],
    example: {
      title: 'Regular saver: £300/month at 5.5% for 12 months',
      steps: [
        'Monthly deposit: £300 for 12 months = £3,600 total deposited',
        'First deposit earns 12 months interest: £300 x 5.5% = £16.50',
        'Last deposit earns 1 month interest: £300 x 5.5% / 12 = £1.38',
        'Total interest over the year: approximately £107 (sum of declining monthly interest)',
        'Effective return on £3,600 deposited: £107 / £3,600 = 2.97% — roughly half the headline 5.5% rate'
      ]
    },
    sourceUrl: 'https://www.bankofengland.co.uk/statistics/interest-rate-statistics',
    sourceName: 'Bank of England',
    lastUpdated: 'April 2026',
  },
  'business-mileage-calculator': {
    howItWorks: [
      'When you use your personal vehicle for business journeys, HMRC sets Approved Mileage Allowance Payments (AMAP) rates that your employer can reimburse tax-free. For cars and vans, the rate is 45p per mile for the first 10,000 business miles in a tax year, dropping to 25p per mile for each additional mile beyond that threshold. These rates are designed to cover fuel, insurance, wear and tear, and depreciation.',
      'If your employer pays less than the AMAP rate, you can claim Mileage Allowance Relief (MAR) on the shortfall through your Self Assessment return or by contacting HMRC to adjust your tax code. The relief equals the difference between what HMRC allows and what your employer actually paid, multiplied by the number of qualifying business miles driven.',
      'Commuting between home and your regular workplace does not count as business mileage. Qualifying journeys include travel to temporary workplaces, client sites, and locations that are not part of your ordinary commute. You must keep a contemporaneous mileage log recording dates, destinations, purposes, and distances for each claim.'
    ],
    example: {
      title: 'Annual business mileage claim for an employee',
      steps: [
        'Total business miles driven in the tax year: 14,000',
        'First 10,000 miles at 45p: 10,000 x £0.45 = £4,500',
        'Remaining 4,000 miles at 25p: 4,000 x £0.25 = £1,000',
        'Total AMAP allowance: £4,500 + £1,000 = £5,500',
        'Employer reimbursed £3,200, so Mileage Allowance Relief claimable: £5,500 - £3,200 = £2,300'
      ]
    },
    sourceUrl: 'https://www.gov.uk/expenses-and-benefits-business-travel-mileage/rules-for-tax',
    sourceName: 'HMRC - Business Travel Mileage',
    lastUpdated: 'April 2026',
  },
  'wealth-growth-calculator': {
    howItWorks: [
      'Wealth growth projection combines multiple income streams and savings vehicles into a single compound growth model. The calculation takes your current net worth, adds monthly contributions (potentially split across pension, ISA, and general savings), applies different growth rates to each portion based on asset allocation, and projects the total forward year by year. Pension contributions include tax relief uplift, and ISA growth is modelled tax-free.',
      'Milestone tracking identifies when your portfolio crosses key thresholds: £50,000, £100,000, £250,000, £500,000, and £1,000,000. The first £100,000 is often the hardest because compound growth on a small base is modest. With £500/month at 7% growth, reaching £100,000 takes approximately 11 years, but the second £100,000 takes only 6 more years, and the third about 4 years — demonstrating the accelerating power of compounding on a larger base.',
      'The projector models real-world scenarios including salary increases (and therefore contribution increases), anticipated windfalls or inheritances, changing risk profiles with age (shifting from equities to bonds reduces assumed returns), and the impact of reaching ISA or pension contribution limits. It shows the path to financial independence, defined as the point where your portfolio can sustain your target annual spending indefinitely at a safe withdrawal rate.'
    ],
    example: {
      title: 'Wealth projection from £50,000 with £1,000/month savings at 6%',
      steps: [
        'Starting portfolio: £50,000. Monthly saving: £1,000 (£12,000/year)',
        'Year 5: approximately £125,300 (first £100K milestone reached in year 4)',
        'Year 10: approximately £218,600',
        'Year 20: approximately £530,800 (£500K milestone at ~year 19)',
        'Year 30: approximately £1,050,000 — millionaire status reached, of which £410,000 is contributions and £640,000 is compound growth'
      ]
    },
    sourceUrl: 'https://www.bankofengland.co.uk/statistics',
    sourceName: 'Bank of England',
    lastUpdated: 'April 2026',
  },
  'cgt-on-shares-calculator': {
    howItWorks: [
      'Capital Gains Tax on shares uses the share-pooling method to calculate your cost basis. Under section 104 of TCGA 1992, all shares of the same class in the same company are pooled together with a single average cost per share. When you sell shares, the gain is the sale proceeds minus the pooled average cost multiplied by the number of shares sold.',
      'Two exceptions override the pooling method. The same-day rule matches any shares sold with shares of the same type bought on the same day. The 30-day (bed and breakfasting) rule matches disposals with acquisitions within the following 30 days. These rules prevent artificial loss creation by selling and immediately repurchasing shares.',
      'After applying the £3,000 annual exempt amount, basic-rate taxpayers pay 10% on gains and higher or additional-rate taxpayers pay 20%. If your gains plus income exceed the basic-rate threshold, the excess gains are taxed at the higher rate. Allowable costs include broker commissions and stamp duty on purchase.',
    ],
    example: {
      title: 'Example: Selling 500 shares with pooled cost of £10 each',
      steps: [
        'Pooled cost: 500 × £10 = £5,000',
        'Sale proceeds: 500 × £18 = £9,000',
        'Gain: £9,000 − £5,000 = £4,000',
        'Less annual exempt amount: −£3,000',
        'Taxable gain: £1,000 at 20% (higher rate) = £200',
      ],
    },
    sourceUrl: 'https://www.gov.uk/tax-sell-shares',
    sourceName: 'GOV.UK — Tax when you sell shares',
    lastUpdated: 'April 2026',
  },
  'dividend-income-calculator': {
    howItWorks: [
      'Dividend income from UK shares and funds is calculated by multiplying the number of shares held by the dividend per share, or by applying the portfolio\'s dividend yield to the total investment value. A portfolio worth £100,000 with a 4% yield produces £4,000 in annual dividends. Yields vary by sector: FTSE 100 companies typically yield 3.5-4.5%, while growth stocks may yield under 1% and high-yield investment trusts can exceed 6%.',
      'The dividend allowance for 2026/27 is £500 — the first £500 of dividend income is tax-free regardless of your tax band. Above this, dividends are taxed at 8.75% (basic rate), 33.75% (higher rate), or 39.35% (additional rate). These rates are lower than income tax on earnings because company profits have already been subject to corporation tax before being distributed as dividends.',
      'The calculator stacks dividend income on top of other income to determine the correct tax band. If your salary is £45,000 and you receive £6,000 in dividends, the first £500 is tax-free, the next £5,270 (up to the £50,270 basic rate limit) is taxed at 8.75%, and the remaining £230 is taxed at 33.75%. Dividends within an ISA or pension are completely tax-free and do not count toward the allowance or tax bands.'
    ],
    example: {
      title: 'Dividend tax on £8,000 annual dividends for a higher-rate taxpayer',
      steps: [
        'Portfolio value: £200,000 with 4% average yield = £8,000 dividends',
        'Salary: £60,000 (already in higher-rate band)',
        'Dividend allowance: £500 tax-free',
        'Taxable dividends: £8,000 - £500 = £7,500',
        'Tax at higher rate (33.75%): £7,500 x 33.75% = £2,531.25'
      ]
    },
    sourceUrl: 'https://www.gov.uk/tax-on-dividends',
    sourceName: 'GOV.UK',
    lastUpdated: 'April 2026',
  },
  'non-dom-tax-calculator': {
    howItWorks: [
      'From April 2025, the UK replaced the traditional remittance basis for non-domiciled individuals with a new four-year Foreign Income and Gains (FIG) regime. New UK residents can elect to pay no UK tax on foreign income and gains for their first four years of UK tax residency, provided they have not been UK resident in the previous ten years.',
      'After the four-year FIG window, all worldwide income and gains become fully taxable in the UK regardless of domicile status. Transitional provisions apply for existing non-doms: the Temporary Repatriation Facility allows previously unremitted income to be brought into the UK at a reduced rate of 12% in 2026/27 and 2026/27, then 15% in 2027/28.',
      'Inheritance Tax also changed from a domicile basis to a residence basis from April 2025. Individuals resident in the UK for at least ten of the previous twenty years become liable for IHT on worldwide assets. This calculator models your tax position under the new regime based on your residency history and foreign income.',
    ],
    example: {
      title: 'Example: New arrival, £200,000 foreign income in Year 2',
      steps: [
        'UK residency history: 1 of last 10 tax years (eligible for FIG)',
        'Foreign income: £200,000',
        'FIG election: foreign income exempt from UK tax',
        'UK income (£60,000 salary): taxed normally = approx. £11,432',
        'Net saving vs full UK tax on total income: approx. £62,000',
      ],
    },
    sourceUrl: 'https://www.gov.uk/government/publications/non-uk-domiciled-individuals',
    sourceName: 'GOV.UK — Non-UK domiciled individuals',
    lastUpdated: 'April 2026',
  },
  'annual-investment-allowance-calculator': {
    howItWorks: [
      'The <a href="/calculator/annual-investment-allowance-calculator/" class="text-primary underline">Annual Investment Allowance</a> (AIA) provides a 100% first-year tax deduction on qualifying expenditure on plant and machinery, up to the current limit of \u00a31,000,000 per year. The full cost of qualifying assets is deducted from your taxable profits in the year of purchase, rather than being spread over multiple years through writing down allowances. The AIA applies per business, not per asset, so a single \u00a31M cap covers all qualifying purchases combined.',
      'Qualifying expenditure includes most tangible assets used in the business such as machinery, tools, computers, office furniture, vans, and certain fixtures in buildings. Cars are excluded from AIA, as are assets given to the business or purchased for non-business use. Where expenditure exceeds the \u00a31M annual limit, the excess is allocated to the main or special rate writing down allowance pool at 18% or 6% respectively.',
      'For accounting periods that straddle two AIA limit periods or that are shorter or longer than 12 months, the allowance is proportionally adjusted. A 6-month accounting period would carry a \u00a3500,000 AIA limit. The deduction directly reduces your Corporation Tax or Income Tax bill by lowering the profit figure on which tax is computed.'
    ],
    example: {
      title: 'AIA on \u00a380,000 of equipment for a limited company',
      steps: [
        'A Ltd purchases \u00a380,000 of qualifying machinery in the 2026/27 tax year.',
        'The full \u00a380,000 falls within the \u00a31,000,000 AIA limit, so 100% is deductible.',
        'Taxable profits before the purchase: \u00a3150,000.',
        'Taxable profits after AIA deduction: \u00a3150,000 \u2212 \u00a380,000 = \u00a370,000.',
        'Corporation Tax saved at 19% marginal rate: \u00a370,000 tax vs \u00a3150,000 tax = \u00a315,200 saving.'
      ]
    },
    sourceUrl: 'https://www.gov.uk/capital-allowances/annual-investment-allowance',
    sourceName: 'GOV.UK \u2013 Annual Investment Allowance',
    lastUpdated: 'April 2026',
  },
  'mortgage-interest-rate-calculator': {
    howItWorks: [
      'Mortgage repayments are calculated using a standard annuity formula where the monthly payment equals the loan principal multiplied by [r(1+r)^n] / [(1+r)^n - 1], with r being the monthly interest rate and n the total number of payments. Even small rate differences produce significant cost variations over a 25 or 30-year term because interest compounds monthly on the gradually reducing balance.',
      'The calculator compares up to four mortgage rates side by side, showing the monthly payment difference and total interest paid over the full term for each. A 0.5% rate difference on a £250,000 mortgage over 25 years typically changes the monthly payment by £60-£70 and alters total interest paid by £17,000-£20,000. This makes rate comparison essential when choosing between fixed-rate, tracker, or variable products.',
      'UK mortgages commonly offer an initial fixed or discounted period (typically 2 or 5 years) before reverting to the lender\'s Standard Variable Rate (SVR). The calculator models both the initial rate period and the SVR reversion to show true total cost of ownership. Early Repayment Charges during the initial period are also factored in when comparing whether remortgaging at a new rate saves money after fees.'
    ],
    example: {
      title: 'Comparing two fixed rates on a £280,000 mortgage over 25 years',
      steps: [
        'Rate A: 4.29% fixed for 5 years, monthly payment: £1,521',
        'Rate B: 4.79% fixed for 5 years, monthly payment: £1,596',
        'Monthly saving with Rate A: £75 per month',
        'Total interest over 25 years at Rate A: £176,340 vs Rate B: £198,720',
        'Lifetime saving choosing Rate A: £22,380 (even accounting for a £999 product fee on Rate A)'
      ]
    },
    sourceUrl: 'https://www.bankofengland.co.uk/statistics/mortgage-lenders-and-administrators/2026/2026-q1',
    sourceName: 'Bank of England - Mortgage Statistics',
    lastUpdated: 'April 2026',
  },
  'first-home-buyer-calculator': {
    howItWorks: [
      'First-time buyers in the UK face a range of upfront costs beyond the deposit. This calculator brings together all the expenses: stamp duty (with first-time buyer relief applied), solicitor fees, survey costs, mortgage arrangement and valuation fees, and moving expenses. It gives a complete picture of the cash you need to buy your first home.',
      'First-time buyer stamp duty relief means no SDLT on the first £300,000 for properties up to £500,000. Many lenders offer 95% LTV mortgages for first-time buyers, meaning a 5% deposit is the minimum. However, a larger deposit gives access to lower interest rates, and the Help to Buy ISA or Lifetime ISA can boost your savings with a 25% government bonus.',
      'This calculator takes your target property price, savings and income to show whether you can afford to buy, what mortgage you could get, the total upfront costs and estimated monthly payments. It also checks eligibility for first-time buyer schemes including Lifetime ISA bonus, shared ownership and First Homes.',
    ],
    example: {
      title: 'Example: First home at £280,000, £20,000 savings',
      steps: [
        'Deposit (5%): £14,000 + £6,000 for costs',
        'Stamp duty (first-time buyer): £0 (under £300,000)',
        'Solicitor, survey, searches: approx. £2,500',
        'Mortgage fee: £999',
        'Mortgage: £266,000 at 4.5% over 30 years: £1,348/month',
        'Total cash needed at completion: approx. £17,499',
      ],
    },
    sourceUrl: 'https://www.gov.uk/stamp-duty-land-tax/residential-property-rates',
    sourceName: 'GOV.UK — First-time buyers relief',
    lastUpdated: 'April 2026',
  },
  'sipp-calculator': {
    howItWorks: [
      'A Self-Invested Personal Pension (SIPP) operates under relief at source: you contribute net of basic rate tax and the provider claims 20% from HMRC automatically. Contributing £800 net results in £1,000 gross in your SIPP. Higher and additional rate taxpayers reclaim the extra 20% or 25% through their self-assessment tax return. The SIPP invests across a wide range of assets including funds, shares, ETFs, investment trusts, and commercial property.',
      'Growth projection uses compound interest on regular contributions plus tax relief top-ups. Monthly contributions of £400 net become £500 gross after basic rate relief. At 5% annual growth (net of platform and fund charges), £500/month over 25 years compounds to approximately £298,000. The calculator models different growth scenarios: cautious (3%), moderate (5%), and adventurous (7%) to show the range of possible outcomes.',
      'SIPP access is currently available from age 55 (rising to 57 from April 2028 under the Pension Schemes Act 2021). At access, 25% can be taken as a tax-free lump sum, with the remainder drawn as taxable income via flexi-access drawdown. The calculator models both accumulation phase (contributions + growth) and decumulation phase (drawdown withdrawals), showing projected pot value and sustainable income at your chosen retirement age.'
    ],
    example: {
      title: 'SIPP projection: £400/month net contribution over 25 years',
      steps: [
        'Net monthly contribution: £400. Gross after 20% tax relief: £500/month',
        'Assumed annual growth: 5% (net of 0.4% platform fee)',
        'After 25 years compounding: £500/month grows to approximately £298,000',
        'Tax-free lump sum (25%): £74,500',
        'Remaining £223,500 in drawdown at 4% = £8,940/year taxable income'
      ]
    },
    sourceUrl: 'https://www.gov.uk/personal-pensions-your-rights',
    sourceName: 'GOV.UK',
    lastUpdated: 'April 2026',
  },
  'tax-credits-calculator': {
    howItWorks: [
      'Tax Credits are legacy benefits being replaced by Universal Credit, but existing claimants can still receive Working Tax Credit (WTC) and Child Tax Credit (CTC). WTC is for people working a certain number of hours per week: at least 16 hours if you have a disability or are a single parent, or 30 hours otherwise. The basic element for 2026/27 is £2,435 per year.',
      'Child Tax Credit provides up to £3,455 per child (the child element) plus a family element of £545. Entitlement is reduced by 41% of household income above the threshold of £7,455 for those receiving both WTC and CTC, or £19,995 for CTC-only claimants.',
      'New claims for Tax Credits are no longer accepted in most areas. Existing claimants will be migrated to Universal Credit by the end of 2026/27. If you receive a migration notice, you may be eligible for transitional protection to ensure your income does not drop.',
    ],
    example: {
      title: 'Example: Couple, 2 children, £25,000 income, 35 hours/week',
      steps: [
        'WTC basic element: £2,435',
        'WTC couples element: £2,500',
        'CTC child elements: 2 x £3,455 = £6,910',
        'Maximum entitlement: £11,845',
        'Income taper: (£25,000 - £7,455) x 41% = -£7,193.45',
        'Estimated annual award: £4,651.55',
      ],
    },
    sourceUrl: 'https://www.gov.uk/tax-credits',
    sourceName: 'GOV.UK — Tax Credits',
    lastUpdated: 'April 2026',
  },
  'stocks-shares-isa-calculator': {
    howItWorks: [
      'A Stocks and Shares ISA shelters up to £20,000 per tax year of investments from income tax on dividends, capital gains tax on profits, and income tax on bond fund distributions. Unlike a Cash ISA with guaranteed returns, growth depends on market performance of the selected funds, ETFs, investment trusts, or individual shares held within the wrapper. Historical UK equity returns have averaged approximately 7-8% nominal over the long term.',
      'Platform fees and fund charges reduce your effective return. The calculation deducts an annual percentage from the portfolio value, typically comprising a platform fee (0.15-0.45% for major platforms) plus the fund\'s ongoing charge figure (OCF) ranging from 0.07% for passive index trackers to 1.5%+ for active funds. On a £100,000 portfolio, the difference between 0.22% total charges (cheap index tracker on a low-cost platform) and 1.50% total charges costs approximately £1,280/year, compounding to tens of thousands over decades.',
      'The projection models annual contributions at the ISA limit with compound growth at the assumed rate minus charges. Volatility drag means the arithmetic average return overstates actual compound growth — a fund returning +20% then -20% over two years doesn\'t break even (£100 becomes £96). The calculator uses geometric mean returns for more realistic projections and optionally models Monte Carlo scenarios to show the probability distribution of outcomes.'
    ],
    example: {
      title: 'Stocks and Shares ISA: £15,000/year for 15 years',
      steps: [
        'Annual contribution: £15,000',
        'Assumed growth: 7% gross, platform fee 0.25%, fund OCF 0.15% = 6.60% net',
        'After 15 years at 6.60% net growth: approximately £383,500',
        'Total contributed: £225,000. Tax-free growth: £158,500',
        'At 1.50% total charges instead: only £341,200 — charges cost £42,300 over 15 years'
      ]
    },
    sourceUrl: 'https://www.gov.uk/individual-savings-accounts',
    sourceName: 'GOV.UK',
    lastUpdated: 'April 2026',
  },
  'epc-rating-comparison-calculator': {
    howItWorks: [
      'Comparing EPC ratings between properties helps you understand the relative energy costs and efficiency of different homes. A property rated Band C typically has annual energy costs £300-£600 less than a Band D property, and £600-£1,200 less than a Band E property. The exact savings depend on property size, heating system and local energy prices.',
      'When buying a property, the EPC shows both the current rating and the potential rating if recommended improvements are made. The gap between current and potential ratings indicates how much room there is for improvement. Properties with a large gap often offer the best value because energy costs can be reduced significantly through upgrades.',
      'This calculator compares the EPC ratings and estimated energy costs of up to three properties side by side. It shows the annual cost difference, the likely cost of upgrades to reach the potential rating, and the estimated payback period for each improvement.',
    ],
    example: {
      title: 'Example: Comparing two properties',
      steps: [
        'Property A: Band C (72), estimated energy cost £950/year',
        'Property B: Band E (45), estimated energy cost £1,650/year',
        'Annual difference: £700',
        'Property B upgrade to Band C: ~£5,000 (insulation + boiler)',
        'Payback period for upgrades: ~7 years',
        'Over 10 years: Property B costs £2,000 more even after upgrades',
      ],
    },
    sourceUrl: 'https://www.gov.uk/find-energy-certificate',
    sourceName: 'GOV.UK — Find an energy certificate',
    lastUpdated: 'April 2026',
  },
  'help-to-save-calculator': {
    howItWorks: [
      'Help to Save is a government savings scheme for people receiving Working Tax Credit, Universal Credit (with minimum earnings equivalent to 16 hours at National Living Wage), or both. You can save between £1 and £50 per month for four years. The government pays a 50% bonus on the highest balance achieved, calculated at two points: after year 2 and again after year 4.',
      'The first bonus at the end of year 2 is 50% of the highest balance reached in months 1-24. If you saved £50 every month, your highest balance would be £1,200, earning a £600 bonus. The second bonus at year 4 is 50% of the difference between the highest balance in months 25-48 and the highest balance at the time of the first bonus. If you continue saving £50/month, the year 4 highest balance is £2,400, and the second bonus is 50% x (£2,400 - £1,200) = £600.',
      'Maximum total bonus is £1,200 (£600 at year 2 + £600 at year 4) on total savings of £2,400. You can withdraw at any time without losing future eligibility, but withdrawals reduce the highest balance calculation. The bonus is equivalent to a 50% return on savings, far exceeding any savings account rate. The calculator models different monthly contribution amounts and shows the impact of withdrawals on bonus calculations.'
    ],
    example: {
      title: 'Help to Save: £40/month for 4 years',
      steps: [
        'Monthly contribution: £40',
        'Highest balance after 24 months: £40 x 24 = £960',
        'First bonus (50% of highest balance): £960 x 50% = £480',
        'Highest balance after 48 months: £40 x 48 = £1,920',
        'Second bonus: 50% x (£1,920 - £960) = £480. Total bonuses: £960 on £1,920 saved'
      ]
    },
    sourceUrl: 'https://www.gov.uk/get-help-savings-low-income',
    sourceName: 'GOV.UK',
    lastUpdated: 'April 2026',
  },
  'ns-i-savings-calculator': {
    howItWorks: [
      'NS&I (National Savings and Investments) products are backed by HM Treasury, making them among the safest savings vehicles in the UK with 100% government guarantee (compared to the £85,000 FSCS limit on bank deposits). Products include Income Bonds, Direct Saver, Green Savings Bonds, and Premium Bonds, each with different interest rates, access terms, and minimum deposits.',
      'Interest calculation varies by product. Income Bonds pay interest monthly on the full balance at a variable rate. Direct Saver pays variable interest on balances from £1 upward. Green Savings Bonds offer a fixed rate over a 3-year term with interest paid at maturity or annually depending on the issue. The calculator applies the correct compounding method for each product: monthly compounding for Income Bonds, annual for fixed-term products.',
      'The comparison with high-street banks uses AER (Annual Equivalent Rate) for a like-for-like assessment. NS&I rates are often slightly below the best high-street rates because of the superior government backing. However, NS&I interest is paid gross (no tax deducted at source), and for Premium Bonds, all prizes are entirely tax-free. The calculator factors in your personal savings allowance (£1,000 basic rate, £500 higher rate) to show after-tax comparisons.'
    ],
    example: {
      title: 'NS&I Income Bonds vs high-street easy-access for £50,000',
      steps: [
        'NS&I Income Bonds rate: 3.93% AER (variable)',
        'Annual interest on £50,000: £1,965 paid monthly (£163.75/month)',
        'High-street best buy easy-access: 4.50% AER = £2,250/year',
        'Higher-rate taxpayer PSA: £500. Tax on NS&I excess: (£1,965 - £500) x 40% = £586. Net: £1,379',
        'Tax on bank excess: (£2,250 - £500) x 40% = £700. Net: £1,550. Bank wins by £171/year after tax, but NS&I has unlimited government guarantee'
      ]
    },
    sourceUrl: 'https://www.nsandi.com/',
    sourceName: 'NS&I',
    lastUpdated: 'April 2026',
  },
  'bmi-children-calculator': {
    howItWorks: [
      'BMI-for-age in children is calculated using the same formula as adults (weight in kg \u00F7 height in m\u00B2), but the result is then plotted against age-and-sex-specific growth charts to give a centile. Unlike adult BMI, a fixed number does not define overweight or obese \u2014 what is healthy changes as children grow.',
      'The NHS uses the UK-WHO growth charts for children aged 2\u201318. A BMI above the 91st centile is classified as overweight, and above the 98th centile as obese. Below the 2nd centile may indicate underweight. The calculator returns the centile and classification based on these thresholds.',
      'Children\'s body composition changes significantly during puberty, so centile tracking over time is more informative than a single reading. If you are concerned about your child\'s weight, the NHS recommends speaking to your GP or health visitor, who can plot measurements on official growth charts and advise on next steps.',
    ],
    example: {
      title: 'Example: Girl aged 10, 35 kg, 140 cm',
      steps: [
        'BMI: 35 \u00F7 (1.40)\u00B2 = 35 \u00F7 1.96 = 17.9',
        'Plot on UK-WHO girls\' chart at age 10',
        'Centile: approximately 65th centile',
        'Classification: Healthy weight (between 2nd and 91st)',
      ],
    },
    sourceUrl: 'https://www.nhs.uk/live-well/healthy-weight/childrens-weight/bmi-healthy-weight-calculator-for-children/',
    sourceName: 'NHS \u2014 BMI calculator for children',
    lastUpdated: 'April 2026',
  },
  'offset-mortgage-calculator': {
    howItWorks: [
      'An offset mortgage links your savings account to your mortgage. The savings balance is offset against the mortgage balance, so you only pay interest on the difference. For example, with a £200,000 mortgage and £30,000 in savings, you pay interest on £170,000. The savings do not earn interest, but the tax-free mortgage interest saving is equivalent to earning interest on savings.',
      'For higher-rate taxpayers, offsetting is particularly beneficial because the equivalent gross savings rate would need to be much higher to match. If your mortgage rate is 4.5%, a 40% taxpayer would need a savings account paying 7.5% gross (4.5% ÷ 0.60) to match the offset benefit.',
      'This calculator compares a standard mortgage with an offset mortgage. Enter your mortgage details and savings balance to see the interest saved each year, the reduction in mortgage term and the equivalent gross savings rate you would need to beat the offset benefit at your tax rate.',
    ],
    example: {
      title: 'Example: £250,000 mortgage at 4.5%, £40,000 savings',
      steps: [
        'Standard interest: £250,000 × 4.5% = £11,250/year',
        'Offset interest: £210,000 × 4.5% = £9,450/year',
        'Annual saving: £1,800',
        'Equivalent gross rate (40% taxpayer): 4.5% ÷ 0.60 = 7.5%',
        'Term reduction: approx. 4 years 6 months on a 25-year term',
      ],
    },
    sourceUrl: 'https://www.fca.org.uk/consumers/mortgages-overview',
    sourceName: 'FCA — Mortgages overview',
    lastUpdated: 'April 2026',
  },
  'ground-rent-calculator': {
    howItWorks: [
      'Ground rent is an annual charge paid by leaseholders to the freeholder. For new residential long leases granted since 30 June 2022, the Leasehold Reform (Ground Rent) Act 2022 caps ground rent at a peppercorn (effectively zero). Existing leases are unaffected and may still require ground rent, often with escalation clauses.',
      'Common escalation patterns include fixed increases (e.g. doubling every 25 years), RPI-linked increases, or increases tied to a percentage of the property value. Doubling clauses are particularly problematic as they can make ground rent unaffordable over time — £250/year doubling every 25 years reaches £8,000/year after 125 years.',
      'This calculator projects your ground rent costs over the remaining lease term, accounting for any escalation clause in your lease. It shows the cumulative cost over time and the impact of the new Act on lease extensions (which now attract peppercorn ground rent). Enter your current ground rent, the escalation method and lease length.',
    ],
    example: {
      title: 'Example: £300/year ground rent, doubling every 25 years, 90 years left',
      steps: [
        'Years 1-25: £300/year = £7,500',
        'Years 26-50: £600/year = £15,000',
        'Years 51-75: £1,200/year = £30,000',
        'Years 76-90: £2,400/year = £36,000',
        'Total over 90 years: £88,500 (average £983/year)',
      ],
    },
    sourceUrl: 'https://www.gov.uk/government/publications/leasehold-reform-ground-rent-act-2022',
    sourceName: 'GOV.UK — Leasehold Reform (Ground Rent) Act 2022',
    lastUpdated: 'April 2026',
  },
  'service-charge-calculator': {
    howItWorks: [
      'Leasehold service charges cover the cost of maintaining and managing communal areas of a building or estate. Common items include building insurance, cleaning, gardening, lift maintenance, communal lighting, management company fees and contributions to a sinking or reserve fund for major works. Charges vary widely from £500 to £5,000+ per year.',
      'Under the Landlord and Tenant Act 1985, service charges must be reasonable, and landlords must consult leaseholders before carrying out major works costing more than £250 per leaseholder. Leaseholders have the right to challenge unreasonable charges at the First-tier Tribunal (Property Chamber).',
      'This calculator estimates your annual service charge based on the building type, number of units, facilities and location. It also shows how contributions break down across categories and projects your costs over 5, 10 and 20 years including expected increases. Enter known charges or use typical estimates for your building type.',
    ],
    example: {
      title: 'Example: 2-bed flat in a 24-unit block, London',
      steps: [
        'Building insurance share: £350',
        'Management company fee: £500',
        'Cleaning and gardening: £400',
        'Lift maintenance share: £200',
        'Sinking fund contribution: £600',
        'Total annual service charge: £2,050 (£171/month)',
      ],
    },
    sourceUrl: 'https://www.gov.uk/leasehold-property/service-charges-and-other-expenses',
    sourceName: 'GOV.UK — Leasehold service charges',
    lastUpdated: 'April 2026',
  },
  'pension-consolidation-calculator': {
    howItWorks: [
      'Pension consolidation compares the total annual charges across multiple separate pension pots against the charges of a single combined pot. Each pot typically has a platform fee (0.2-0.5%) plus fund charges (0.1-1.5%), applied as a percentage of the pot value. Over 20-30 years, even a 0.5% fee difference compounds dramatically: on a £100,000 pot over 25 years at 5% growth, a 1.5% charge leaves £181,000 while a 0.5% charge leaves £261,000.',
      'The calculation totals current annual charges across all pots using each scheme\'s fee schedule, then compares against the projected charges of the target consolidated scheme. Exit penalties must be factored in, particularly for older contract-based pensions that may levy early transfer charges of 1-5%. Some workplace pensions include valuable employer contribution matching or lower charges that would be lost on transfer.',
      'Protected benefits such as guaranteed annuity rates (GARs), protected tax-free cash above 25%, or defined benefit entitlements require careful valuation before consolidation. The calculator flags pots with potential safeguarded benefits and estimates the monetary value of guaranteed features against the fee savings from consolidation.'
    ],
    example: {
      title: 'Consolidating three pension pots into one SIPP',
      steps: [
        'Pot A: £45,000 at 1.2% annual charge = £540/year in fees',
        'Pot B: £28,000 at 0.9% annual charge = £252/year in fees',
        'Pot C: £17,000 at 1.5% annual charge = £255/year in fees',
        'Total current fees: £1,047/year on combined £90,000 (effective 1.16%)',
        'Consolidated SIPP at 0.35% platform + 0.12% fund = 0.47%, costing £423/year — saving £624/year'
      ]
    },
    sourceUrl: 'https://www.gov.uk/transferring-your-pension',
    sourceName: 'GOV.UK',
    lastUpdated: 'April 2026',
  },
  'employer-pension-contribution-calculator': {
    howItWorks: [
      'Under auto-enrolment rules, employer contributions are calculated on qualifying earnings, which is the band of gross pay between £6,240 and £50,270 per year (2026/27 thresholds). The employer must contribute at least 3% of qualifying earnings, while the employee contributes 5% (including 1% tax relief). Total minimum contribution is 8% of qualifying earnings, not total salary.',
      'The calculation first identifies qualifying earnings by subtracting the lower threshold from gross pay, capped at the upper limit. For someone earning £30,000, qualifying earnings are £30,000 minus £6,240, giving £23,760. The employer\'s 3% minimum on this amount is £712.80 per year. Many employers voluntarily contribute more, often matching employee contributions up to 5-10%.',
      'Salary sacrifice arrangements alter the calculation: the employee gives up gross salary in exchange for additional employer pension contributions. This saves both employer and employee National Insurance (currently 13.8% employer, 8% employee on earnings between £12,570 and £50,270), making each pound of contribution more tax-efficient than relief at source.'
    ],
    example: {
      title: 'Auto-enrolment contributions on a £35,000 salary',
      steps: [
        'Gross annual salary: £35,000',
        'Qualifying earnings: £35,000 - £6,240 = £28,760',
        'Employer minimum contribution (3%): £28,760 x 3% = £862.80/year',
        'Employee contribution (5% including tax relief): £28,760 x 5% = £1,438.00/year',
        'Total annual pension contribution (8%): £2,300.80/year (£191.73/month)'
      ]
    },
    sourceUrl: 'https://www.gov.uk/workplace-pensions/what-you-your-employer-and-the-government-pay',
    sourceName: 'GOV.UK',
    lastUpdated: 'April 2026',
  },
  'right-to-buy-calculator': {
    howItWorks: [
      'Right to Buy allows eligible council tenants in England to buy their home at a discount. The discount depends on the property type and length of tenancy. For houses, the discount starts at 35% after 3 years of tenancy and increases by 1% per additional year up to a maximum of 70%. For flats, the discount starts at 50% and increases by 2% per year up to 70%.',
      'Maximum discount caps are set annually: for 2026/27 this is £96,000 in London and £127,900 outside London. If you sell the property within 5 years, you must repay some or all of the discount on a sliding scale. Former council tenants can also use the Preserved Right to Buy if their home was transferred to a housing association.',
      'This calculator shows the discount you are entitled to based on your tenancy length and property type. Enter the market value of your home, your tenancy start date and location to see the purchase price after discount, plus the repayment amount if you sell within 5 years.',
    ],
    example: {
      title: 'Example: Council house in Manchester, 12 years\' tenancy, valued at £180,000',
      steps: [
        'Discount: 35% + 9% (years 4-12) = 44%',
        'Discount amount: £180,000 × 44% = £79,200',
        'Check against cap: £79,200 < £127,900 cap — discount applies in full',
        'Purchase price: £180,000 − £79,200 = £100,800',
        'If sold after 3 years: repay 40% of discount = £31,680',
      ],
    },
    sourceUrl: 'https://www.gov.uk/right-to-buy-buying-your-council-home',
    sourceName: 'GOV.UK — Right to Buy: buying your council home',
    lastUpdated: 'April 2026',
  },
  'staircasing-calculator': {
    howItWorks: [
      'Staircasing is the process of buying additional shares in a shared ownership property. You can typically buy shares in increments of 10% or more, up to 100% (full ownership). The cost of each additional share is based on the current market value of the property at the time of staircasing, not the original purchase price.',
      'When you staircase, you must pay for an independent RICS valuation (£300-£500), solicitor fees (£500-£1,000) and potentially a new or extended mortgage. If you staircase to 100%, you become a full owner and no longer pay rent to the housing association. Stamp duty may be payable on the cumulative shares purchased once the total exceeds the nil-rate threshold.',
      'This calculator estimates the cost of staircasing from your current share to a target share. Enter the current property value, your current share, target share and mortgage details. It shows the additional purchase cost, the new mortgage amount, the change in monthly costs (reduced rent vs higher mortgage) and the break-even period.',
    ],
    example: {
      title: 'Example: Staircase from 40% to 60% of a £320,000 property',
      steps: [
        'Current share: 40% of £320,000 = £128,000',
        'Additional share: 20% of current value (£320,000) = £64,000',
        'New total share: 60% = £192,000',
        'Rent reduction: from £373/month (60% × 2.75% ÷ 12) to £247 (40% × 2.75% ÷ 12)',
        'Monthly saving on rent: £126 — offset against higher mortgage payment',
      ],
    },
    sourceUrl: 'https://www.gov.uk/shared-ownership-scheme',
    sourceName: 'GOV.UK — Shared Ownership: staircasing',
    lastUpdated: 'April 2026',
  },
  'pension-lump-sum-calculator': {
    howItWorks: [
      'The Pension Commencement Lump Sum (PCLS) entitles you to withdraw 25% of your crystallised pension pot completely free of income tax. For defined contribution pensions, the PCLS is simply 25% of the pot value at the point of crystallisation. You can crystallise your pension in stages (phased drawdown), taking 25% tax-free from each tranche, which can be more tax-efficient than crystallising everything at once.',
      'Withdrawals above the 25% PCLS are taxed as earned income. The tax calculation adds the taxable withdrawal to your other income for the year, then applies standard income tax bands: 0% on the personal allowance (£12,570), 20% basic rate (£12,571-£50,270), 40% higher rate (£50,271-£125,140), and 45% additional rate (above £125,140). Emergency tax coding on first withdrawals often results in overpayment that must be reclaimed.',
      'Uncrystallised Funds Pension Lump Sum (UFPLS) is an alternative where you take a lump sum directly without entering drawdown. Each UFPLS payment is 25% tax-free and 75% taxable. This triggers the Money Purchase Annual Allowance (MPAA) of £10,000, restricting future contributions. The total lump sum allowance across all pensions is £268,275 (25% of the standard lifetime limit).'
    ],
    example: {
      title: 'Lump sum and tax on a £180,000 pension pot',
      steps: [
        'Pension pot: £180,000',
        'Tax-free PCLS (25%): £180,000 x 25% = £45,000 — no income tax due',
        'Additional lump sum withdrawal of £20,000 from the remaining £135,000',
        'Assuming £30,000 salary: total income becomes £50,000. The £20,000 withdrawal is taxed at 20% = £4,000 tax',
        'Net received: £45,000 + £16,000 = £61,000 from the £65,000 withdrawn'
      ]
    },
    sourceUrl: 'https://www.gov.uk/tax-on-pension/lump-sums',
    sourceName: 'GOV.UK',
    lastUpdated: 'April 2026',
  },
  'elm-payment-calculator': {
    howItWorks: [
      'Environmental Land Management (ELM) schemes replaced the EU\'s Basic Payment Scheme in England. The Sustainable Farming Incentive (SFI) pays farmers for environmental actions alongside food production. Countryside Stewardship (CS) covers more targeted environmental outcomes such as habitat creation and flood risk management.',
      'SFI payments are made per hectare or per metre of hedgerow/margin, depending on the action. Common actions include: herbal leys (£382/ha), nutrient management (£652/ha for advanced), hedgerow management (£13/100m) and low-input grassland (£151/ha). Multiple actions can be stacked on the same land where compatible.',
      'This calculator estimates your annual payment based on the actions you select and the area or length of feature. It shows which actions are stackable and flags any incompatibilities. Payment rates are set by Defra and reviewed annually.',
    ],
    example: {
      title: 'Example: 80 ha arable farm with SFI',
      steps: [
        'Nutrient management (advanced) on 80 ha: 80 × £652 = £52,160',
        'Companion cropping on 30 ha: 30 × £55 = £1,650',
        'Hedgerow management, 2,000 m: 2,000 ÷ 100 × £13 = £260',
        'Winter bird food on 4 ha: 4 × £853 = £3,412',
        'Total estimated annual SFI payment: £57,482',
      ],
    },
    sourceUrl: 'https://www.gov.uk/government/collections/sustainable-farming-incentive-guidance',
    sourceName: 'Defra — Sustainable Farming Incentive guidance',
    lastUpdated: 'April 2026',
  },
  'farm-tenancy-calculator': {
    howItWorks: [
      'Farm tenancies in England and Wales fall into three main types: Agricultural Holdings Act 1986 (AHA) tenancies with full security, Farm Business Tenancies (FBT) under the Agricultural Tenancies Act 1995 with limited security, and grazing or seasonal licences for short-term arrangements.',
      'FBT rents vary widely by region and land quality. Arable land in the East of England may let for £200–£400/ha, while grassland in the West might be £80–£150/ha. AHA rents are typically lower due to the stronger tenant protections. Grazing lets are usually seasonal at £80–£120/ha for 6–8 months.',
      'This calculator compares the annual cost and flexibility of different tenancy types. It factors in rent, tenant\'s improvements, dilapidations risk and notice period requirements. It helps you decide which arrangement best suits your farming operation and investment horizon.',
    ],
    example: {
      title: 'Example: 60 ha arable FBT in the East Midlands',
      steps: [
        'Rent: £250/ha per year',
        'Annual rent: 60 × £250 = £15,000',
        'Typical FBT term: 5 years with 12 months\' notice',
        'Compared to AHA (if available): approx. £150/ha = £9,000/year',
        'Annual saving with AHA: £6,000, but less flexibility to quit',
      ],
    },
    sourceUrl: 'https://www.gov.uk/guidance/agricultural-tenancies',
    sourceName: 'GOV.UK — Agricultural tenancies',
    lastUpdated: 'April 2026',
  },
  'ev-salary-sacrifice-calculator': {
    howItWorks: [
      'An EV salary sacrifice scheme lets you lease an electric car through your employer, paying from your gross salary before tax and National Insurance. The Benefit in Kind (BiK) rate for pure electric vehicles is just 2% for 2024/25, rising to 3% for 2026/27 and 4% for 2026/27. This makes salary sacrifice one of the cheapest ways to drive a new EV.',
      'The saving works because you avoid income tax and NI on the sacrificed salary, and the BiK tax on the EV is minimal. A higher-rate taxpayer can save 40-50% compared to leasing the same car personally. The scheme typically includes insurance, maintenance, breakdown cover and tyres in one monthly payment.',
      'This calculator compares the net cost of leasing an EV through salary sacrifice versus a personal lease or PCP deal. It shows the BiK tax payable, the tax and NI savings, and the effective monthly cost. Most schemes require a minimum contract of 2-4 years.',
    ],
    example: {
      title: 'Example: £45,000 salary, Tesla Model 3, £450/month lease',
      steps: [
        'Monthly salary sacrifice: £450 (from gross pay)',
        'P11D value: £42,000',
        'BiK at 3% (2026/27): £42,000 x 3% = £1,260/year',
        'BiK tax at 40%: £504/year (£42/month)',
        'Income tax saving: £450 x 40% = £180/month',
        'NI saving: £450 x 8% = £36/month',
        'Net monthly cost: £450 - £180 - £36 + £42 = £276',
      ],
    },
    sourceUrl: 'https://www.gov.uk/tax-on-company-benefits/tax-on-benefit-in-kind',
    sourceName: 'GOV.UK — Tax on company benefits',
    lastUpdated: 'April 2026',
  },
  'ulez-calculator': {
    howItWorks: [
      'The Ultra Low Emission Zone (ULEZ) covers all of Greater London. Vehicles that do not meet the emission standards are charged £12.50 per day. For most petrol cars, the standard is Euro 4 (generally vehicles first registered after January 2006). For diesel cars, the standard is Euro 6 (generally first registered after September 2015).',
      'Motorcycles and mopeds must meet Euro 3 (generally first registered after July 2007). Vans, minibuses and specialist vehicles under 3.5 tonnes follow the same petrol and diesel standards as cars. Larger vehicles (over 3.5 tonnes, buses and coaches) are subject to the separate Low Emission Zone (LEZ) and must meet Euro VI standards.',
      'You can check your vehicle\'s compliance by entering your registration number on the TfL vehicle checker. Non-compliant vehicles driving in the ULEZ face charges of £12.50/day plus a £160 penalty if not paid by midnight the following day (reduced to £80 if paid within 14 days). This calculator estimates your annual ULEZ costs if your vehicle is non-compliant.',
    ],
    example: {
      title: 'Example: 2012 diesel car, driving in London 3 days/week',
      steps: [
        'Vehicle: 2012 diesel (Euro 5, non-compliant)',
        'Daily ULEZ charge: £12.50',
        'Weekly cost (3 days): £37.50',
        'Annual cost (50 weeks): £1,875',
        'Scrappage scheme payment (if eligible): up to £2,000',
        'Upgrading to compliant vehicle saves £1,875/year',
      ],
    },
    sourceUrl: 'https://tfl.gov.uk/modes/driving/ultra-low-emission-zone',
    sourceName: 'TfL — Ultra Low Emission Zone',
    lastUpdated: 'April 2026',
  },
  'car-import-duty-calculator': {
    howItWorks: [
      'Importing a vehicle into the UK from outside Great Britain involves customs duty, VAT and potential additional charges. The customs duty rate for passenger cars from most countries is 6.5% of the vehicle\'s value (including shipping and insurance costs). EU-origin vehicles may qualify for zero duty under the UK-EU Trade and Cooperation Agreement if rules of origin requirements are met.',
      'VAT at 20% is charged on the combined value of the vehicle plus the customs duty. You must also pay for vehicle type approval (IVA test at around £400-£600) unless the car already holds EU type approval, in which case Mutual Recognition may apply. DVLA registration (first registration fee) costs £55 and number plates are extra.',
      'Additional costs include shipping (£500-£2,000 depending on origin), UK port handling charges, modifications to meet UK standards (such as headlight beam conversion and speedometer to mph), and the first MOT if the vehicle is over 3 years old. This calculator estimates the total landed cost of importing a vehicle.',
    ],
    example: {
      title: 'Example: Importing a £20,000 car from the USA',
      steps: [
        'Vehicle value (CIF — cost, insurance, freight): £22,000',
        'Customs duty at 6.5%: £1,430',
        'VAT at 20% on (£22,000 + £1,430): £4,686',
        'IVA test: £500',
        'DVLA registration: £55',
        'Total import costs: £6,671',
        'Total landed cost: £28,671',
      ],
    },
    sourceUrl: 'https://www.gov.uk/importing-vehicles',
    sourceName: 'GOV.UK — Importing vehicles',
    lastUpdated: 'April 2026',
  },

  /* ──────────────────────────────────────────────────────────────
     ENERGY
     ────────────────────────────────────────────────────────────── */
  'road-trip-cost-calculator': {
    howItWorks: [
      'Planning a UK road trip budget means accounting for fuel, tolls, parking, accommodation and food. Fuel is usually the largest variable cost: divide your total distance by your car\'s MPG, convert to litres (multiply by 4.546) and multiply by the price per litre. A 500-mile trip in a 40 MPG car at £1.40/litre costs approximately £80 in fuel.',
      'Major UK tolls include the M6 Toll (£8 for cars), Dartford Crossing (£2.50 online), Humber Bridge (£2.00), Severn Bridge (free since 2018) and the Mersey Gateway (£2.00). Parking costs vary hugely: free in rural areas, £5-£15/day in towns and £20-£50/day in city centres. National Trust and English Heritage car parks are free for members.',
      'This calculator lets you plan your entire trip budget by entering your route, vehicle details, number of nights, accommodation budget and planned stops. It produces a complete cost breakdown and per-person split for shared trips.',
    ],
    example: {
      title: 'Example: London to Edinburgh and back, 2 nights',
      steps: [
        'Total distance: ~800 miles round trip',
        'Fuel (40 MPG, £1.42/L): 800 / 40 x 4.546 x £1.42 = £129',
        'Tolls (M6 Toll each way): £16',
        'Accommodation (2 nights x £90): £180',
        'Parking and miscellaneous: £30',
        'Total trip cost: ~£355 (£178 per person if shared)',
      ],
    },
    sourceUrl: 'https://www.gov.uk/government/publications/rates-and-allowances-travel-mileage-and-fuel-allowances',
    sourceName: 'HMRC — Travel and mileage rates',
    lastUpdated: 'April 2026',
  },
  'making-tax-digital-calculator': {
    howItWorks: [
      'Making Tax Digital for Income Tax Self Assessment (MTD for ITSA) launches in April 2026 for self-employed individuals and landlords with gross income above £50,000. It requires quarterly digital submissions of income and expense summaries to HMRC using compatible software, plus a final end-of-period statement.',
      'Under MTD, you submit updates for four quarterly periods: April to July, August to October, November to January and February to March. Each update summarises your business income and allowable expenses for that period. A final declaration replaces the current Self Assessment tax return and is due by 31 January following the tax year.',
      'This calculator estimates your quarterly submission amounts based on your projected annual income and expenses. It helps you understand what each quarterly update will look like and plan your cash flow for tax payments. Those with income between £30,000 and £50,000 join from April 2027.',
    ],
    example: {
      title: 'Example: Self-employed, £72,000 annual income, £18,000 expenses',
      steps: [
        'Quarterly income (average): £72,000 ÷ 4 = £18,000',
        'Quarterly expenses (average): £18,000 ÷ 4 = £4,500',
        'Quarterly profit submitted to HMRC: £13,500',
        'Annual profit: £54,000',
        'Estimated tax + NI due: approx. £12,800',
      ],
    },
    sourceUrl: 'https://www.gov.uk/guidance/making-tax-digital-for-income-tax',
    sourceName: 'GOV.UK — Making Tax Digital for Income Tax',
    lastUpdated: 'April 2026',
  },
  'tax-bracket-visualizer': {
    howItWorks: [
      'UK income tax operates on a marginal rate system. You do not pay one flat percentage on all your income. Instead, each portion of income falling within a specific band is taxed at that band\'s rate. The Personal Allowance gives you £12,570 tax-free, then the basic rate of 20% applies up to £50,270, 40% up to £125,140 and 45% above that.',
      'The visualiser shows each band as a coloured segment so you can see how much of your income falls into each bracket. It highlights the marginal rate at any income level — the rate you would pay on the next pound you earn. This is particularly useful for understanding the 60% effective rate trap between £100,000 and £125,140.',
      'Understanding marginal rates helps with financial planning. For example, pension contributions above £100,000 income effectively give 60% tax relief because they restore the Personal Allowance. The visualiser lets you drag an income slider and see exactly how the tax calculation changes.',
    ],
    example: {
      title: 'Example: Visualising £85,000 salary',
      steps: [
        'Band 1: £12,570 at 0% = £0 (Personal Allowance)',
        'Band 2: £37,700 at 20% = £7,540 (Basic Rate)',
        'Band 3: £34,730 at 40% = £13,892 (Higher Rate)',
        'Total tax: £21,432 — effective rate: 25.2%',
        'Marginal rate on next £1: 40%',
      ],
    },
    sourceUrl: 'https://www.gov.uk/income-tax-rates',
    sourceName: 'GOV.UK — Income Tax rates and Personal Allowances',
    lastUpdated: 'April 2026',
  },
  'business-mileage-record-calculator': {
    howItWorks: [
      'HMRC\'s approved mileage allowance payment (AMAP) rates let you claim 45p per mile for the first 10,000 business miles in a tax year and 25p per mile thereafter when using your own car. Motorcycles attract 24p per mile and bicycles 20p per mile with no threshold. Each journey must be logged with the date, start and end locations, purpose, and miles driven to satisfy HMRC record-keeping requirements.',
      'Only journeys with a genuine business purpose qualify\u2014visiting clients, travelling between work sites, collecting supplies, or attending business meetings. Ordinary commuting between home and a permanent workplace does not count. If you work from home as your main base and travel to a client site, that journey qualifies. HMRC may request your mileage log during an enquiry, so contemporaneous records kept throughout the year are essential.',
      'For employees, if your employer pays less than the AMAP rate, you can claim Mileage Allowance Relief (MAR) on the shortfall via your Self Assessment return or form P87. For self-employed sole traders, you choose between AMAP simplified expenses or actual vehicle costs\u2014but once chosen, you must stick with that method for the life of the vehicle.'
    ],
    example: {
      title: 'Annual mileage claim for a self-employed consultant',
      steps: [
        'Total business miles driven in the tax year: 14,000.',
        'First 10,000 miles at 45p: 10,000 \u00d7 \u00a30.45 = \u00a34,500.',
        'Remaining 4,000 miles at 25p: 4,000 \u00d7 \u00a30.25 = \u00a31,000.',
        'Total mileage allowance: \u00a34,500 + \u00a31,000 = \u00a35,500.',
        'At the 20% basic tax rate, this reduces your tax bill by \u00a31,100.'
      ]
    },
    sourceUrl: 'https://www.gov.uk/expenses-and-benefits-business-travel-mileage/rules-for-tax',
    sourceName: 'GOV.UK \u2013 Business Travel Mileage',
    lastUpdated: 'April 2026',
  },
  'pension-sharing-divorce-calculator': {
    howItWorks: [
      'Pension sharing on divorce uses the Cash Equivalent Transfer Value (CETV) as the basis for division. The CETV represents the present-day capital value of future pension benefits and is calculated by the pension scheme\'s actuary using discount rates, mortality assumptions, and benefit projections. For defined benefit schemes, the CETV can be significantly lower than the actuarial value of the income stream, making fair division complex.',
      'A pension sharing order specifies a percentage of the CETV to be transferred to the ex-spouse, creating a pension credit in their name. The receiving spouse either joins the same scheme (internal transfer) or transfers the credit to their own pension arrangement (external transfer). The percentage split need not be 50/50; courts consider the length of marriage, other assets, and each party\'s needs. Pension offsetting is an alternative where pension value is traded against other assets like the family home.',
      'Earmarking (or attachment orders) differs from pension sharing: the pension stays with the scheme member, but the court directs a portion of payments to the ex-spouse when benefits are drawn. The disadvantage is dependency on the member\'s decisions about when to retire. Pension sharing provides a clean break. For defined benefit pensions, the CETV may not reflect the true income value, so pension-on-pension comparison using the Pension Advisory Group methodology is often more equitable.'
    ],
    example: {
      title: 'Pension sharing order on a £400,000 CETV',
      steps: [
        'Husband\'s pension CETV: £400,000 (defined benefit scheme)',
        'Court orders 40% pension sharing order to wife',
        'Pension credit to wife: £400,000 x 40% = £160,000',
        'Wife transfers £160,000 externally to her SIPP',
        'Husband\'s remaining CETV: £240,000 (scheme recalculates reduced benefits accordingly)'
      ]
    },
    sourceUrl: 'https://www.gov.uk/money-property-when-relationship-ends/pensions',
    sourceName: 'GOV.UK',
    lastUpdated: 'April 2026',
  },
  'working-hours-benefits-calculator': {
    howItWorks: [
      'Increasing your working hours affects your benefits, tax credits and take-home pay in complex ways. Universal Credit uses a 55% taper rate, meaning for every additional £1 you earn above your work allowance, your UC is reduced by 55p. Combined with income tax at 20% and National Insurance at 8%, effective marginal deduction rates can reach 70% or more.',
      'For legacy tax credits claimants, the taper rate is 41% on income above the threshold. Working Tax Credit requires a minimum of 16 or 30 hours depending on your circumstances. Increasing hours from 15 to 16 could unlock WTC eligibility, creating a significant income boost despite only one extra hour worked.',
      'This calculator models the net effect of changing your working hours. It shows your take-home pay including earnings, benefits and tax for different weekly hours, so you can see the true financial gain from working more or the impact of reducing hours.',
    ],
    example: {
      title: 'Example: Single parent on UC, £12/hour, increasing from 16 to 25 hours',
      steps: [
        'Current earnings (16 hours): £192/week (£832/month)',
        'UC at 16 hours: £850/month',
        'Proposed earnings (25 hours): £300/week (£1,300/month)',
        'UC at 25 hours: £592.20/month (taper reduces payment)',
        'Net gain from extra 9 hours: £190.20/month',
        'Effective hourly rate of extra hours: £4.87',
      ],
    },
    sourceUrl: 'https://www.gov.uk/universal-credit/what-youll-get',
    sourceName: 'GOV.UK — Universal Credit',
    lastUpdated: 'April 2026',
  },
  'inheritance-tax-pension-calculator': {
    howItWorks: [
      'From April 2027, unused pension funds will be included in a person\'s estate for Inheritance Tax purposes under proposed new rules. Currently, most defined contribution pension pots pass outside of IHT. The change means pension pots remaining at death will be added to the estate value when calculating whether IHT is due.',
      'Where the combined estate including the pension pot exceeds the nil-rate band of £325,000 (plus the residence nil-rate band of £175,000 where applicable), IHT at 40% will apply to the excess. The pension scheme administrator will be responsible for paying the IHT due from the pension fund before distributing to beneficiaries.',
      'This calculator models the potential IHT liability on your pension pot under the proposed rules. Enter your estimated estate value, pension pot size and intended beneficiaries to see the projected tax impact. Results are based on the consultation proposals and may change before the April 2027 implementation.',
    ],
    example: {
      title: 'Example: £400,000 estate + £300,000 pension pot, home to children',
      steps: [
        'Total estate including pension: £700,000',
        'Less nil-rate band: −£325,000',
        'Less residence nil-rate band: −£175,000',
        'Taxable estate: £200,000',
        'IHT at 40%: £80,000 (of which pension fund pays a share)',
      ],
    },
    sourceUrl: 'https://www.gov.uk/government/consultations/inheritance-tax-on-pensions',
    sourceName: 'GOV.UK — Inheritance Tax on pensions consultation',
    lastUpdated: 'April 2026',
  },

  /* ──────────────────────────────────────────────────────────────────────
   * PAY CATEGORY (21-43)
   * ────────────────────────────────────────────────────────────────────── */
  'mtd-readiness-calculator': {
    howItWorks: [
      'Making Tax Digital for Income Tax Self Assessment (MTD ITSA) requires self-employed individuals and landlords with qualifying income above \u00a350,000 to maintain digital records and submit quarterly updates to HMRC using MTD-compatible software from April 2026. Those with income between \u00a330,000 and \u00a350,000 will follow from April 2027. Quarterly updates must be submitted within one month of each quarter end, with a final End of Period Statement and Final Declaration replacing the traditional Self Assessment return.',
      'Readiness is assessed across multiple criteria: whether you currently use MTD-compatible accounting software (spreadsheets linked via bridging software also qualify), whether your income and expense records are kept digitally from the point of transaction, whether you can generate and submit quarterly summaries to HMRC through the API, and whether your record-keeping already categorises income and expenses to the level HMRC requires.',
      'Additional readiness factors include whether your tax agent is prepared for MTD, whether you have tested the submission process using HMRC\'s sandbox environment, and whether your business processes can meet the quarterly filing deadlines (5 July, 5 October, 5 January, 5 April with one-month submission windows). Penalties under the new points-based regime accumulate for late submissions: each late filing adds a point, and at the threshold (4 points for quarterly obligations), a \u00a3200 penalty is triggered for that and every subsequent late submission.'
    ],
    example: {
      title: 'Readiness assessment for a freelance developer earning \u00a365,000',
      steps: [
        'Income exceeds \u00a350,000 threshold: MTD ITSA mandatory from April 2026.',
        'Currently uses spreadsheets: needs MTD-compatible software or HMRC-approved bridging tool. Score: 4/10.',
        'Records are digital but not categorised per MTD requirements: partial compliance. Score: 6/10.',
        'No quarterly submission testing done with HMRC sandbox: Score: 2/10.',
        'Overall readiness: 40%. Actions needed: purchase compatible software, set up quarterly filing workflow, and test API submissions before April 2026 deadline.'
      ]
    },
    sourceUrl: 'https://www.gov.uk/guidance/use-software-to-send-income-tax-updates',
    sourceName: 'GOV.UK \u2013 Making Tax Digital for Income Tax',
    lastUpdated: 'April 2026',
  },
  'congestion-charge-calculator': {
    howItWorks: [
      'The London Congestion Charge is £15 per day for driving within the Congestion Charge Zone in central London. The zone operates Monday to Friday, 7am-6pm, and weekends and bank holidays 12pm-6pm. Payment must be made by midnight on the day of travel or by midnight on the following charging day for a £17.50 late payment.',
      'Certain vehicles are exempt or receive discounts. Electric vehicles (zero-emission capable) registered with TfL are exempt through the Cleaner Vehicle Discount. Residents within the zone receive a 90% discount. Blue Badge holders, licensed taxis, buses and some hybrid vehicles also qualify for exemptions or discounts.',
      'Auto Pay can be set up to automatically charge your account each day your vehicle enters the zone, avoiding the risk of late payment penalties (£160, reduced to £80 if paid within 14 days). This calculator estimates your weekly and annual congestion charge costs based on how often you drive into the zone.',
    ],
    example: {
      title: 'Example: Commuting into central London 4 days/week (petrol car)',
      steps: [
        'Daily charge: £15',
        'Weekly cost (4 days): £60',
        'Annual cost (48 working weeks): £2,880',
        'With Auto Pay: same cost, no penalty risk',
        'Zone resident discount (90%): £1.50/day = £288/year',
      ],
    },
    sourceUrl: 'https://tfl.gov.uk/modes/driving/congestion-charge',
    sourceName: 'TfL — Congestion Charge',
    lastUpdated: 'April 2026',
  },
  'a-level-grade-calculator': {
    howItWorks: [
      'A-level grades range from A* to E, with grade boundaries set by exam boards after marking. Most A-levels consist of two or three exam papers, each with different weightings. Some subjects also include non-exam assessment (coursework, practical endorsements or portfolios). The calculator combines component marks using the correct weighting for your exam board.',
      'Uniform Mark Scale (UMS) was used by legacy specifications to standardise marks across different exam sessions. Current linear A-levels do not use UMS \u2014 grades are determined from raw marks against boundaries set each year. This calculator works with both raw marks (current specifications) and UMS (legacy qualifications).',
      'Enter your subject, exam board and marks for each component. The calculator applies weightings and compares your total against published grade boundaries. Results are estimates, as boundaries change annually. Check your exam board\'s website (AQA, Edexcel, OCR or WJEC) for the most recent published boundaries.',
    ],
    example: {
      title: 'Example: A-level Chemistry (AQA), Paper 1: 72/105, Paper 2: 68/105, Paper 3: 35/90',
      steps: [
        'Total raw marks: 72 + 68 + 35 = 175/300',
        'Percentage: 58.3%',
        'AQA grade boundary reference: A \u2248 187, B \u2248 163, C \u2248 139',
        'Estimated grade: B',
      ],
    },
    sourceUrl: 'https://www.gov.uk/government/organisations/ofqual',
    sourceName: 'Ofqual \u2014 Exam regulation',
    lastUpdated: 'April 2026',
  },
  'student-loan-plan4-calculator': {
    howItWorks: [
      'Plan 4 applies to students who took out loans from the Student Awards Agency for Scotland (SAAS) or who started undergraduate courses in England or Wales before September 2012 and now live in Scotland. The repayment threshold for 2026/27 is £33,795 \u2014 the highest of all UK plan types.',
      'You repay 9% of everything you earn above £33,795. The interest rate on Plan 4 is the lower of RPI or the Bank of England base rate plus 1%. Plan 4 loans are written off when you turn 65 (or 25 years after the April you were first eligible to repay, whichever comes first).',
      'Enter your salary to see monthly and annual repayments. If you are on Plan 4 plus a Postgraduate Loan, both are deducted separately. The higher threshold means Scottish graduates repay less per month than English graduates on the same salary.',
    ],
    example: {
      title: 'Example: £40,000 salary, Plan 4',
      steps: [
        'Income above threshold: £40,000 \u2212 £33,795 = £8,605',
        'Annual repayment: £8,605 \u00D7 9% = £774.45',
        'Monthly deduction: £64.54',
        'Compare to Plan 2 at same salary: £1,143.45/year (£95.29/month)',
      ],
    },
    sourceUrl: 'https://www.gov.uk/repaying-your-student-loan/which-repayment-plan-you-are-on',
    sourceName: 'GOV.UK \u2014 Student loan repayment plans',
    lastUpdated: 'April 2026',
  },
  'crypto-carf-calculator': {
    howItWorks: [
      'The Crypto Asset Reporting Framework (CARF) is a new international reporting standard developed by the OECD and adopted by the UK. From 2026, UK crypto asset service providers must collect and report information about their users\' transactions to HMRC, who will exchange this data with other tax authorities.',
      'Under CARF, reportable transactions include exchanges of crypto for fiat currency, crypto-to-crypto swaps and transfers of crypto assets. The framework requires reporting the total gross proceeds, number of transactions and the type of crypto asset for each user. This is separate from your personal obligation to declare gains on your tax return.',
      'This calculator estimates your reporting exposure under CARF based on your transaction history. It summarises which of your trades are reportable, the total gross value that will be reported to HMRC and whether your activity triggers additional due-diligence requirements.',
    ],
    example: {
      title: 'Example: Annual crypto trading activity',
      steps: [
        'Crypto-to-fiat sales: 12 transactions, gross proceeds £24,000',
        'Crypto-to-crypto swaps: 30 transactions, gross value £45,000',
        'Total reportable gross: £69,000',
        'Transactions reported to HMRC under CARF: 42',
        'CGT liability (separate calculation): based on gains after cost basis',
      ],
    },
    sourceUrl: 'https://www.gov.uk/government/consultations/the-crypto-asset-reporting-framework',
    sourceName: 'GOV.UK — Crypto Asset Reporting Framework consultation',
    lastUpdated: 'April 2026',
  },
  'employer-ni-rise-calculator': {
    howItWorks: [
      'From April 2025, the employer National Insurance rate increased from 13.8% to 15%. Simultaneously, the Secondary Threshold (the point at which employer NI becomes payable) dropped from £9,100 to £5,000 per year. This double change significantly increases the cost of employing staff, particularly for lower-paid workers.',
      'The Employment Allowance was increased to £10,500 from April 2025 to partially offset the impact for small businesses. Eligible employers can deduct this from their total employer NI bill. Companies connected to other companies and those with a sole director and no other employees are not eligible.',
      'This calculator models the cost impact per employee and across your total payroll. Enter each employee\'s salary to see the increase in employer NI versus the previous 13.8% rate and £9,100 threshold. It also shows whether the Employment Allowance covers the increase for your business.',
    ],
    example: {
      title: 'Example: Employee on £30,000 salary',
      steps: [
        'Old rules: (£30,000 − £9,100) × 13.8% = £2,884.20',
        'New rules: (£30,000 − £5,000) × 15% = £3,750.00',
        'Increase per employee: £865.80 per year',
        'For a 10-person team at £30,000: total increase £8,658',
        'Less Employment Allowance (£10,500): net saving for small firms',
      ],
    },
    sourceUrl: 'https://www.gov.uk/guidance/rates-and-thresholds-for-employers-2025-to-2026',
    sourceName: 'HMRC — Employer NI rates and thresholds 2026/27',
    lastUpdated: 'April 2026',
  },
  'pay-per-mile-calculator': {
    howItWorks: [
      'The true per-mile cost of running a car includes fuel, insurance, road tax, MOT, servicing, tyres, depreciation and breakdown cover. Most drivers underestimate this figure because they only consider fuel. The AA estimates the average UK per-mile cost at 30-50p depending on the car, with depreciation being the single largest component.',
      'Fuel cost per mile depends on your car\'s MPG and the fuel price. At 40 MPG and £1.42/litre, fuel costs 16.1p per mile. Fixed costs (insurance, tax, MOT) should be divided by annual mileage — a car costing £2,000/year in fixed costs driven 10,000 miles adds 20p per mile, but only 10p per mile at 20,000 miles.',
      'This calculator breaks down your total per-mile cost across all categories. It is useful for comparing car choices, deciding whether to drive or take the train, calculating fair ride-share contributions, and understanding HMRC mileage allowance rates (45p/mile for the first 10,000 miles).',
    ],
    example: {
      title: 'Example: Ford Focus, 10,000 miles/year',
      steps: [
        'Fuel (40 MPG, £1.42/L): 16.1p/mile',
        'Insurance: £500/year = 5.0p/mile',
        'Road tax: £190/year = 1.9p/mile',
        'MOT and servicing: £300/year = 3.0p/mile',
        'Depreciation: £2,500/year = 25.0p/mile',
        'Total cost per mile: 51.0p',
      ],
    },
    sourceUrl: 'https://www.gov.uk/government/publications/rates-and-allowances-travel-mileage-and-fuel-allowances',
    sourceName: 'HMRC — Mileage rates',
    lastUpdated: 'April 2026',
  },
  'high-council-tax-calculator': {
    howItWorks: [
      'Council Tax bands in England are based on property valuations from 1 April 1991. Band H currently covers all properties valued above £320,000 at that date, meaning a modest terraced house in central London and a country estate may both sit in the same band. Proposed reforms would introduce bands I, J, and K above the existing Band H to create a more proportional system for the highest-value properties.',
      'Under the consultation framework published for potential implementation from 2028, properties in proposed Band I would pay approximately 1.25 times the Band D rate, Band J around 1.5 times, and Band K approximately 1.75 times. Current Band H already charges twice the Band D rate. The exact multipliers and valuation thresholds are subject to parliamentary approval and may vary by billing authority.',
      'To estimate your potential liability, the calculator applies these proposed ratios to your local authority\'s current Band D charge. For example, if Band D is £2,100 and your property falls into proposed Band J, your annual bill would be roughly £2,100 x 1.5 = £3,150. Revaluation itself would redistribute all properties across all bands, so many homes currently in lower bands could also see changes.'
    ],
    example: {
      title: 'Estimated council tax for a high-value London property',
      steps: [
        'Property estimated 1991 value: £550,000 (current market value ~£3.2 million)',
        'Local authority Band D rate: £1,950 per year',
        'Current Band H charge: £1,950 x 2.0 = £3,900',
        'Proposed Band K multiplier: 1.75 x Band D = £1,950 x 1.75 = £3,412.50',
        'Potential increase if revaluation places property in Band K: difference depends on final legislation and local precepts'
      ]
    },
    sourceUrl: 'https://www.gov.uk/council-tax-bands',
    sourceName: 'GOV.UK - Council Tax Bands',
    lastUpdated: 'April 2026',
  },

  /* ──────────────────────────────────────────────────────────────
     INSURANCE
     ────────────────────────────────────────────────────────────── */
  'sole-trader-vs-ltd-comparison-calculator': {
    howItWorks: [
      'This comparison generates a side-by-side table at multiple profit levels from \u00a320,000 to \u00a3100,000, showing the total tax burden and take-home pay under each business structure. For the sole trader column, each profit level is run through the full Income Tax bands (20%/40%/45% after the \u00a312,570 Personal Allowance), and Class 4 NI (6% on \u00a312,570\u2013\u00a350,270, 2% above). The result is the net income the sole trader retains.',
      'For the limited company column, the calculation assumes an optimal extraction strategy: salary set at the Personal Allowance level of \u00a312,570 (minimising NI), with remaining profits subject to Corporation Tax and then withdrawn as dividends. Corporation Tax rates are applied using the marginal relief formula for profits between \u00a350,000 and \u00a3250,000 (effective rate rising from 19% to 25%). Dividend tax is calculated at 8.75%/33.75%/39.35% after the \u00a3500 dividend allowance.',
      'The comparison accounts for the additional running costs of a limited company\u2014typically \u00a31,000\u2013\u00a32,000 per year for accountancy, Companies House filing fees (\u00a313), and Confirmation Statement fees (\u00a334). These are deducted from the Ltd take-home to give a fair like-for-like comparison. The table clearly shows the crossover point where Ltd becomes more tax-efficient and quantifies the annual saving or cost at each profit level, helping business owners make an informed structural decision.'
    ],
    example: {
      title: 'Comparison table at \u00a340,000 profit',
      steps: [
        'Sole trader at \u00a340,000: IT \u00a35,486 + Class 4 \u00a31,646 = \u00a37,132. Take-home: \u00a332,868.',
        'Ltd at \u00a340,000: salary \u00a312,570 (no tax/NI). Profit after salary: \u00a327,430.',
        'Corporation Tax: \u00a327,430 \u00d7 19% = \u00a35,212. Available for dividends: \u00a322,218.',
        'Dividend tax: \u00a3500 free, \u00a321,718 \u00d7 8.75% = \u00a31,900. Accountancy fees: \u00a31,200.',
        'Ltd take-home: \u00a312,570 + \u00a322,218 \u2212 \u00a31,900 \u2212 \u00a31,200 = \u00a331,688. Sole trader wins by \u00a31,001 at this level.'
      ]
    },
    sourceUrl: 'https://www.gov.uk/working-for-yourself',
    sourceName: 'GOV.UK \u2013 Working for Yourself',
    lastUpdated: 'April 2026',
  },
  'apprenticeship-levy-calculator': {
    howItWorks: [
      'The Apprenticeship Levy is charged at 0.5% of an employer\'s total annual pay bill, which includes all earnings subject to Class 1 secondary National Insurance contributions\u2014salaries, wages, bonuses, and commissions. Every employer receives a \u00a315,000 annual allowance that offsets the levy, meaning only employers with a pay bill exceeding \u00a33,000,000 per year face an actual payment. The levy is calculated and paid monthly through PAYE alongside other payroll deductions.',
      'Each month, you calculate 0.5% of your monthly pay bill and then subtract one-twelfth of the \u00a315,000 annual allowance (\u00a31,250 per month). If the result is negative, no levy is due for that month. Connected employers (companies linked by common ownership) must share the single \u00a315,000 allowance between them, allocated at the start of the tax year via a declaration to HMRC.',
      'Levy payments are converted into digital funds in your Apprenticeship Service account, topped up by 10% by the government. These funds can only be spent on approved apprenticeship training and assessment with registered providers. Unspent funds expire 24 months after they appear in the account, so timely planning of apprenticeship starts is important.'
    ],
    example: {
      title: 'Monthly levy for an employer with a \u00a35M annual pay bill',
      steps: [
        'Annual pay bill: \u00a35,000,000.',
        'Monthly pay bill: \u00a35,000,000 \u00f7 12 = \u00a3416,667.',
        '0.5% levy on monthly pay bill: \u00a3416,667 \u00d7 0.005 = \u00a32,083.33.',
        'Subtract monthly allowance: \u00a32,083.33 \u2212 \u00a31,250 = \u00a3833.33 due to HMRC.',
        'Annual levy payable: \u00a3833.33 \u00d7 12 = \u00a310,000. Plus 10% government top-up gives \u00a311,000 in your apprenticeship account.'
      ]
    },
    sourceUrl: 'https://www.gov.uk/guidance/pay-apprenticeship-levy',
    sourceName: 'GOV.UK \u2013 Pay Apprenticeship Levy',
    lastUpdated: 'April 2026',
  },
  'shared-parental-pay-calculator': {
    howItWorks: [
      'Shared Parental Pay (ShPP) allows eligible parents to share up to 37 weeks of statutory pay between them after the birth or adoption of a child. The mother must curtail her maternity leave and pay to create the shared entitlement. ShPP is paid at £194.32 per week or 90% of average weekly earnings, whichever is lower, for 2026/27.',
      'The total shared entitlement is calculated by subtracting the weeks of maternity pay already taken from 39 weeks. For example, if the mother takes 10 weeks of maternity pay, 29 weeks of ShPP are available to share. Both parents must meet eligibility criteria — the person taking ShPP must have 26 weeks\' continuous employment and the other parent must have worked for at least 26 weeks in the 66 weeks before the due date.',
      'ShPP can be taken in blocks with gaps between them, allowing parents to alternate caring responsibilities. Each parent can submit up to three notices of entitlement. This calculator models different sharing scenarios and shows the pay each parent receives.',
    ],
    example: {
      title: 'Example: Mother takes 12 weeks maternity, then shares',
      steps: [
        'Mother\'s SMP: 6 weeks at 90% + 6 weeks at £194.32 = £4,363.08',
        'Remaining ShPP weeks: 39 − 12 = 27 weeks available',
        'Father takes 15 weeks ShPP: 15 × £194.32 = £2,807.70',
        'Mother takes 12 weeks ShPP: 12 × £194.32 = £2,246.16',
        'Total family statutory pay: £9,416.94',
      ],
    },
    sourceUrl: 'https://www.gov.uk/shared-parental-leave-and-pay',
    sourceName: 'GOV.UK — Shared Parental Leave and Pay',
    lastUpdated: 'April 2026',
  },
  'home-buying-total-cost-calculator': {
    howItWorks: [
      'The true cost of buying a home extends well beyond the deposit and purchase price. Buyers need to budget for stamp duty (or LBTT/LTT), solicitor or conveyancer fees (£1,000-£2,000), property survey (£400-£1,500 depending on type), mortgage arrangement fee (£0-£2,000), valuation fee, search fees (£250-£400) and land registry fee (£100-£500).',
      'Moving costs include removal company (£500-£1,500), redirected mail (£50-£100), and potentially storage fees. Ongoing costs to budget for include buildings and contents insurance, council tax, utility setup fees and any immediate repairs or redecoration needed before moving in.',
      'This calculator totals all purchase, mortgage, legal and moving costs to show the full amount you need to have available beyond your deposit. Enter the property price, deposit, mortgage details and select which optional costs apply to get a comprehensive total.',
    ],
    example: {
      title: 'Example: £325,000 property, first-time buyer',
      steps: [
        'Deposit (10%): £32,500',
        'Stamp duty (first-time buyer): £1,250',
        'Solicitor fees: £1,500',
        'Survey (HomeBuyer): £600',
        'Mortgage fee: £999',
        'Searches, Land Registry, removals: £1,200',
        'Total cash needed: £38,049',
      ],
    },
    sourceUrl: 'https://www.gov.uk/buy-sell-your-home',
    sourceName: 'GOV.UK — Buy or sell your home',
    lastUpdated: 'April 2026',
  },
  'council-tax-reduction-calculator': {
    howItWorks: [
      'Council Tax Reduction (CTR) is a locally administered scheme that helps people on low incomes pay their council tax bill. Each council in England runs its own scheme, so the rules, income thresholds and maximum reductions vary by area. Working-age claimants may receive a partial or full reduction depending on their circumstances.',
      'Pension-age claimants are protected by a national scheme and can receive up to 100% reduction in their council tax. The calculation considers your income, savings (generally capped at £16,000), household size and the applicable council tax amount. Savings between £6,000 and £16,000 are assumed to generate £1 per week for each £250.',
      'Many councils require working-age claimants to pay a minimum amount, often 8-25% of the full bill. Some councils are more generous and still offer up to 100% reduction. This calculator provides an estimate based on typical council schemes, but you should check your local council\'s specific rules.',
    ],
    example: {
      title: 'Example: Single person, pension age, Band B, £180/week income',
      steps: [
        'Band B council tax: £1,700/year (£32.69/week)',
        'Single person discount (25%): -£425',
        'Reduced annual bill: £1,275 (£24.52/week)',
        'Applicable amount (pension age single): £218.15/week',
        'Income below applicable amount: eligible for full reduction',
        'Council Tax Reduction: £1,275 (100% of reduced bill)',
      ],
    },
    sourceUrl: 'https://www.gov.uk/council-tax/who-has-to-pay',
    sourceName: 'GOV.UK — Council Tax',
    lastUpdated: 'April 2026',
  },
  'student-budget-planner-calculator': {
    howItWorks: [
      'This planner creates a detailed month-by-month budget for the academic year. Unlike a simple budget calculator, it accounts for the uneven timing of student income \u2014 maintenance loans arrive in three lump sums (September, January, April), while expenses run monthly. Many students overspend in the first term and struggle by spring.',
      'The planner divides your total annual income by 12 to create a sustainable monthly budget, then allocates it across fixed costs (rent, bills, subscriptions) and variable spending (food, going out, clothing). It shows a running balance so you can see if you will run short in any particular month.',
      'Enter your total income, rent and fixed costs. The planner generates a recommended monthly spending plan and highlights months where you need to be careful. It also includes common hidden costs that catch students out: freshers\' week, textbooks, end-of-tenancy cleaning and summer accommodation gaps.',
    ],
    example: {
      title: 'Example: £9,000 annual income, £500/month rent',
      steps: [
        'Monthly budget: £9,000 \u00F7 12 = £750',
        'Rent: \u2212£500',
        'Bills and subscriptions: \u2212£50',
        'Food: \u2212£120 (£30/week)',
        'Remaining for transport, social, personal: £80/month',
      ],
    },
    sourceUrl: 'https://www.gov.uk/student-finance/new-fulltime-students',
    sourceName: 'GOV.UK \u2014 Student finance',
    lastUpdated: 'April 2026',
  },
  'minimum-wage-calculator': {
    quickAnswer: `From 1 April 2026 the UK National Living Wage (21+) is <strong>£12.71/hour</strong>. Ages 18 to 20: £10.85/hour. Under 18 / apprentice: £8.00/hour. If you are paid less, your employer is breaking the law — report to ACAS on <strong>0300 123 1100</strong>.`,
    rateTable: { title: `UK Minimum Wage rates (from 1 April 2026)`, html: `<table><thead><tr><th>Age group</th><th>Rate</th><th>Annual (39 hr/wk)</th></tr></thead><tbody><tr><td>21 and over (National Living Wage)</td><td><strong>£12.71</strong></td><td>£25,775</td></tr><tr><td>18 to 20</td><td>£10.85</td><td>£22,004</td></tr><tr><td>Under 18 / Apprentice</td><td>£8.00</td><td>£16,224</td></tr></tbody></table>` },
    howItWorks: [
      'The UK sets minimum hourly pay rates that vary by age. From April 2025, the National Living Wage for workers aged 21 and over is £12.71 per hour. The National Minimum Wage is £10.00 for 18-20 year olds, £8.00 for under-18s, and £8.00 for apprentices in their first year or under 19.',
      'These rates are statutory minimums — employers must pay at least these amounts for every hour worked. Hours include time spent working, on-call at the workplace, travelling as part of the job and training. Sleep-in shifts and travel between home and a fixed workplace are generally excluded.',
      'This calculator checks whether your current pay meets the legal minimum based on your age, hours worked and pay received. It also shows what your annual and monthly income should be at the minimum rate, helping you verify your payslips are correct.',
      'What if your employer pays below the minimum? Under-payment is illegal under the National Minimum Wage Act 1998. HMRC enforces NMW law and can charge penalties of up to 200% of arrears (capped at £20,000 per worker), name and shame employers, and prosecute persistent offenders. Report suspected underpayment confidentially to ACAS on 0300 123 1100 or via the GOV.UK NMW complaints form. Tips (tronc) cannot be used to top up base pay to meet the minimum — since 1 October 2024, the Tipping Act 2023 requires all tips to be passed to workers in full.',
      'What counts as \'working time\' for minimum wage purposes? Working time includes time spent travelling for work (between client sites, not commuting), \'on call\' time when you must remain at the workplace, training during normal hours, and time putting on mandated uniform. It does not include the regular commute, voluntary unpaid overtime, or rest breaks. For piece workers, Fair Piece Rate rules require employers to do time trials and pay at least 120% of minimum wage for the average expected output.',
      'Sleep-in shifts and \'on-call\' work. The 2018 Supreme Court ruling in Royal Mencap Society v Tomlinson-Blake clarified that sleep-in shifts (where the worker is provided a bed and only responds if needed) only need minimum wage for actual time spent working — not for sleeping hours. However, if you must remain awake or perform regular checks, the entire shift counts as working time. This matters in care, hospitality, and security sectors.',
      'Salary sacrifice and the minimum wage floor. Salary sacrifice arrangements (pension, cycle-to-work, EV schemes) reduce your gross salary in exchange for benefits. Crucially, your post-sacrifice pay must still equal or exceed the minimum wage — your employer cannot agree to a salary sacrifice that takes you below the legal minimum. From April 2026 the NLW is £12.71 for 21+, so for a 37.5-hour week, post-sacrifice pay must be at least £476.63/week (£24,785/year).',
      'Apprentice rate rules. The £8.00/hour apprentice rate applies if you are under 19 OR in the first 12 months of an apprenticeship — whichever applies. From your 19th birthday AND after 12 months, you must be paid the age-appropriate rate (£10.85 for 18-20, £12.71 for 21+). Many apprentices are underpaid because employers don\'t update pay when these thresholds are crossed. The 12-month clock includes furlough time but resets if you start a new apprenticeship.',
    ],
    example: {
      title: 'Example: 23-year-old working 40 hours/week',
      steps: [
        'National Living Wage (21+): £12.71/hour',
        'Weekly minimum pay: £12.71 × 40 = £508.40',
        'Monthly minimum: £488.40 × 52 ÷ 12 = £2,116.40',
        'Annual minimum: £488.40 × 52 = £25,396.80',
        'Below this rate? Your employer is breaking the law',
      ],
    },
    sourceUrl: 'https://www.gov.uk/national-minimum-wage-rates',
    sourceName: 'GOV.UK — National Minimum Wage and National Living Wage rates',
    lastUpdated: 'April 2026',
  },
  'first-homes-scheme-calculator': {
    howItWorks: [
      'The First Homes scheme offers first-time buyers in England a minimum 30% discount on new-build homes, with some local authorities offering up to 50% off. The discount is funded by the developer and set through Section 106 planning agreements. After the discount, the home must cost no more than £250,000 (or £420,000 in London).',
      'Eligibility requirements include being a first-time buyer, a household income below £80,000 (£90,000 in London), and securing a mortgage for at least 50% of the discounted price. Local connection and key worker status may be prioritised. The discount is locked into the property title, meaning future sales must also be at the same percentage discount.',
      'This calculator shows the purchase price after the discount, compares it with the market value, estimates your mortgage payments on the reduced price and calculates the stamp duty (first-time buyer relief usually applies). It also models future equity growth based on assumed house price appreciation.',
    ],
    example: {
      title: 'Example: New-build valued at £300,000, 30% discount',
      steps: [
        'Market value: £300,000',
        'First Homes discount (30%): −£90,000',
        'Purchase price: £210,000',
        'Deposit (10%): £21,000',
        'Mortgage needed: £189,000 — monthly repayment at 4.5% over 30 years: approx. £957',
      ],
    },
    sourceUrl: 'https://www.gov.uk/first-homes-scheme',
    sourceName: 'GOV.UK — First Homes scheme',
    lastUpdated: 'April 2026',
  },
  'shared-ownership-affordability-calculator': {
    howItWorks: [
      'Shared ownership affordability is assessed differently from standard mortgages. Lenders consider your mortgage payment on the purchased share plus the rent on the unowned share plus service charges. The total housing cost typically must not exceed 45% of your gross household income. Your mortgage is usually capped at 4-4.5 times your income.',
      'To find the maximum property price, the calculator works backwards from your income: it calculates the maximum mortgage you can get, adds your deposit, then determines what share percentage this represents at different property prices while keeping total monthly costs within the 45% limit.',
      'Eligibility requires a household income below £80,000 (£90,000 in London). You must be a first-time buyer, a previous homeowner who cannot afford to buy now, or an existing shared owner. This calculator shows the maximum property value and share percentage you can afford.',
    ],
    example: {
      title: 'Example: Household income £45,000, £15,000 savings',
      steps: [
        'Maximum mortgage (4.5× income): £202,500',
        'Deposit: £15,000',
        'Maximum share purchase: £217,500',
        'At 50% share: maximum property value = £435,000',
        'Monthly costs at £350,000 property, 50% share: approx. £1,250 — 33% of income',
      ],
    },
    sourceUrl: 'https://www.gov.uk/shared-ownership-scheme',
    sourceName: 'GOV.UK — Shared Ownership scheme',
    lastUpdated: 'April 2026',
  },
  'invoice-profit-calculator': {
    howItWorks: [
      'Invoice profit analysis breaks down each invoice into its component costs to reveal the true profit earned. Start with the invoice total (excluding VAT, which is collected on behalf of HMRC and is not your income). Deduct direct material costs\u2014the actual cost of goods, raw materials, or supplies consumed in fulfilling the order. Then deduct direct labour\u2014wages or subcontractor fees directly attributable to this job, including employer NI and pension on those wages.',
      'Next, allocate a share of overheads: rent, utilities, insurance, software, vehicle costs, and administrative salaries that are not directly tied to one job but support all work. Common allocation methods include a percentage of direct labour hours, a flat rate per job, or a proportion based on revenue. The remaining figure after all deductions is your net job profit.',
      'Two related metrics give context: Profit margin (%) = Net profit \u00f7 Invoice total \u00d7 100, showing what percentage of revenue you keep. Markup (%) = Net profit \u00f7 Total costs \u00d7 100, showing the premium charged above costs. These differ\u2014a 25% markup equates to a 20% margin. Tracking profit per invoice over time reveals which clients, services, or project types are most (or least) profitable, enabling better pricing decisions.'
    ],
    example: {
      title: 'Profit analysis on a \u00a34,800 landscaping invoice',
      steps: [
        'Invoice total (ex-VAT): \u00a34,800.',
        'Materials (turf, soil, plants, paving): \u00a31,650.',
        'Labour (subcontractor 3 days at \u00a3180): \u00a3540.',
        'Overhead allocation (vehicle, insurance, tools): \u00a3480.',
        'Net profit: \u00a34,800 \u2212 \u00a31,650 \u2212 \u00a3540 \u2212 \u00a3480 = \u00a32,130. Margin: 44.4%. Markup: 79.9%.'
      ]
    },
    sourceUrl: 'https://www.gov.uk/invoicing-and-taking-payment-from-customers',
    sourceName: 'GOV.UK \u2013 Invoicing and Taking Payment',
    lastUpdated: 'April 2026',
  },
  'employee-vs-contractor-calculator': {
    howItWorks: [
      'The true cost of employing someone extends well beyond their gross salary. Employers pay secondary Class 1 NI contributions at 15% on earnings above the Secondary Threshold (\u00a39,100 for 2026/27). Auto-enrolment pension contributions add a minimum 3% of qualifying earnings. Additional employer costs often include recruitment fees, training, office space, equipment, employer\'s liability insurance, and payroll administration. These overheads typically add 20\u201335% on top of the gross salary.',
      'A contractor or freelancer, by contrast, charges a day rate or project fee with no employer NI, pension, or benefit obligations on the hiring business. However, the day rate is typically higher to compensate the contractor for bearing their own tax, insurance, pension, holiday, sick pay, and bench time between contracts. A rough equivalence is that a contractor\'s annual billings need to be 30\u201350% higher than an equivalent salary to achieve the same take-home, depending on IR35 status.',
      'The comparison must account for hidden employer costs: statutory sick pay obligations, maternity/paternity cover, redundancy liability, annual leave (typically 28 days minimum), training investment, and management overhead. Contractors provide flexibility\u2014you pay only for productive days\u2014but the relationship must genuinely reflect self-employment to avoid IR35 reclassification, which would impose employment taxes retrospectively on unpaid NI and PAYE.'
    ],
    example: {
      title: 'Total cost of a \u00a345,000 employee vs contractor at \u00a3350/day',
      steps: [
        'Employee gross salary: \u00a345,000. Employer NI: (\u00a345,000 \u2212 \u00a39,100) \u00d7 15% = \u00a35,385.',
        'Employer pension (3%): \u00a345,000 \u00d7 3% = \u00a31,350. Other costs (insurance, equipment, training): \u00a32,500.',
        'Total employer cost for employee: \u00a345,000 + \u00a35,385 + \u00a31,350 + \u00a32,500 = \u00a354,235 per year.',
        'Contractor at \u00a3350/day \u00d7 220 working days = \u00a377,000 per year (no NI, pension, or benefits cost).',
        'Contractor costs \u00a322,765 more per year but offers flexibility and no long-term employment obligations.'
      ]
    },
    sourceUrl: 'https://www.gov.uk/guidance/check-employment-status-for-tax',
    sourceName: 'GOV.UK \u2013 Check Employment Status for Tax',
    lastUpdated: 'April 2026',
  },
  'standing-charge-savings-calculator': {
    howItWorks: [
      'Standing charges are daily fixed fees that appear on your energy bill regardless of how much energy you use. The average standing charge is approximately 61.64p per day for electricity and 31.65p per day for gas under the Ofgem price cap, totalling around £340 per year before you use a single unit of energy.',
      'Some suppliers offer tariffs with lower or zero standing charges, compensating with slightly higher unit rates. These tariffs benefit low-usage households (small homes, holiday homes, properties with solar panels) who use less energy than average. High-usage households may pay more overall on zero standing charge tariffs.',
      'This calculator compares your current standing charge costs against tariffs offering lower or zero standing charges. By entering your actual consumption, it shows whether switching to a low-standing-charge tariff would save or cost you money. The breakeven point depends on your usage — below a certain threshold, zero standing charge wins.',
    ],
    example: {
      title: 'Example: Low-usage household (solar panels installed)',
      steps: [
        'Current standing charges: (61.64p + 31.65p) x 365 = £340.51/year',
        'Current unit costs: 1,200 kWh elec x 24.5p + 8,000 kWh gas x 6.76p = £834.80',
        'Zero standing charge tariff (elec 28p, gas 7.5p):',
        'New unit costs: 1,200 x 28p + 8,000 x 7.5p = £936.00',
        'Saving on standing charges: £340.51',
        'Extra unit cost: £101.20',
        'Net annual saving: £239.31',
      ],
    },
    sourceUrl: 'https://www.ofgem.gov.uk/check-if-energy-price-cap-affects-you',
    sourceName: 'Ofgem — Energy price cap',
    lastUpdated: 'April 2026',
  },
  'gas-cost-calculator': {
    howItWorks: [
      'Gas heating is the most common form of central heating in the UK, used by around 23 million households. The cost depends on your boiler efficiency, thermostat settings, insulation levels and the size of your home. The average gas unit rate is approximately 6.76p per kWh, with a daily standing charge of around 31.65p.',
      'A modern condensing boiler operates at 90-94% efficiency, meaning 90-94p of every pound spent on gas is converted to useful heat. Older boilers may be only 60-75% efficient, wasting 25-40% of the gas consumed. Reducing your thermostat by just 1 degree C can save up to 10% on your heating bill, typically £80-£120 per year.',
      'This calculator estimates your gas costs based on your boiler type and efficiency, thermostat setting, insulation level and property size. It shows monthly and annual costs and models the saving from upgrading your boiler or improving thermostat management.',
    ],
    example: {
      title: 'Example: 3-bed semi, old boiler (80% efficiency), thermostat at 21 C',
      steps: [
        'Estimated annual gas consumption: 12,000 kWh',
        'Gas cost: 12,000 x 6.76p = £811.20',
        'Standing charge: 365 x 31.65p = £115.52',
        'Total annual gas bill: £926.72',
        'Upgrade to 93% efficient boiler: saves ~£130/year',
        'Reduce thermostat by 1 C: saves ~£93/year',
      ],
    },
    sourceUrl: 'https://www.ofgem.gov.uk/check-if-energy-price-cap-affects-you',
    sourceName: 'Ofgem — Energy price cap',
    lastUpdated: 'April 2026',
  },
  'exponent-calculator': {
    howItWorks: [
      'Exponents (powers) represent repeated multiplication. The expression a^n means multiplying a by itself n times. This calculator handles positive, negative and fractional exponents as well as expressions involving multiple operations.',
      'Negative exponents produce reciprocals: a^(−n) = 1/a^n. Fractional exponents represent roots: a^(1/2) is the square root of a, and a^(1/3) is the cube root. The calculator shows full step-by-step working so you can follow the logic.',
    ],
    example: {
      title: 'Example: Calculating 5^4',
      steps: [
        '5^4 = 5 × 5 × 5 × 5',
        '= 25 × 25',
        '= 625',
      ],
    },
    sourceUrl: 'https://www.bbc.co.uk/bitesize/guides/zxsv97h/revision/1',
    sourceName: 'BBC Bitesize — Powers and roots',
    lastUpdated: 'April 2026',
  },
  'logarithm-calculator': {
    howItWorks: [
      'A logarithm answers the question: to what power must a given base be raised to produce a particular number? For example, log base 10 of 1000 = 3 because 10^3 = 1000. This calculator handles common logarithms (base 10), natural logarithms (base e, written as ln) and custom bases.',
      'Logarithms are the inverse of exponents. They are used in science (pH scale, Richter scale, decibels), finance (compound interest) and computing (algorithmic complexity). The calculator shows the conversion between different bases using the change-of-base formula: log_b(x) = ln(x) / ln(b).',
    ],
    example: {
      title: 'Example: Calculating log₁₀(500)',
      steps: [
        'log₁₀(500) = 2.6990',
        'This means 10^2.6990 ≈ 500',
        'ln(500) = 6.2146 (natural log)',
        'log₂(500) = 8.9658 (log base 2)',
      ],
    },
    sourceUrl: 'https://www.bbc.co.uk/bitesize/guides/zn3ty9q/revision/5',
    sourceName: 'BBC Bitesize — Logarithms',
    lastUpdated: 'April 2026',
  },
  'employee-cost-breakdown-calculator': {
    howItWorks: [
      'The full cost of an employee includes far more than their headline salary. Mandatory costs include employer National Insurance (15% above £5,000 for 2026/27), workplace pension (minimum 3% of qualifying earnings) and employer\'s liability insurance. These statutory requirements add approximately 18-20% on top of the gross salary.',
      'Discretionary costs may include private medical insurance (averaging £1,000-£2,000 per employee), training and development budgets, equipment and IT costs, office space per head, recruitment costs (typically 15-25% of salary for agency hires) and any performance bonuses or profit-sharing schemes.',
      'This calculator provides an itemised breakdown of all employer costs. Enter the salary and toggle each optional benefit to build a complete picture. The output shows both the per-employee cost and the cost as a percentage of salary, helping businesses budget accurately for headcount expansion.',
    ],
    example: {
      title: 'Example: Full cost of a £45,000 employee',
      steps: [
        'Employer NI (15% above £5,000): £6,000',
        'Employer pension (5%): £2,250',
        'Private medical: £1,200',
        'Training budget: £1,500',
        'Equipment/IT: £2,000',
        'Total loaded cost: £57,950 (128.8% of salary)',
      ],
    },
    sourceUrl: 'https://www.gov.uk/guidance/rates-and-thresholds-for-employers-2025-to-2026',
    sourceName: 'HMRC — Rates and thresholds for employers 2026/27',
    lastUpdated: 'April 2026',
  },
  'contractor-vs-perm-calculator': {
    howItWorks: [
      'Comparing contractor and permanent employment requires normalising both options to the same measure: annual take-home pay. For a contractor operating through a limited company, start with the day rate multiplied by the estimated number of working days per year (typically 220\u2013230, minus holidays and bench time). From this gross revenue, deduct Corporation Tax, salary, employer NI on that salary, pension contributions, accountancy fees, insurance, and any other business costs.',
      'The contractor\'s take-home is then the combination of a tax-efficient salary (usually \u00a312,570 to use the personal allowance) plus dividends drawn from post-tax profits. Dividends are taxed at 8.75% basic rate, 33.75% higher rate, and 39.35% additional rate after the \u00a3500 dividend allowance. IR35 status is critical: if inside IR35, the tax advantage largely disappears because deemed employment taxes apply.',
      'For the permanent role, total compensation includes base salary, employer pension contributions (minimum 3% under auto-enrolment), paid holidays (typically 25 days plus 8 bank holidays), sick pay, and any benefits such as health insurance, share schemes, or bonuses. The permanent employee also gains employment rights\u2014redundancy protection, statutory maternity/paternity pay, and unfair dismissal rights\u2014which have real economic value that does not appear on a payslip.'
    ],
    example: {
      title: 'Contractor at \u00a3450/day vs permanent at \u00a375,000',
      steps: [
        'Contractor gross revenue: \u00a3450 \u00d7 220 working days = \u00a399,000.',
        'Deduct: salary \u00a312,570 + employer NI \u00a3690 + Corporation Tax on \u00a385,000 profit at 19% (\u00a316,150) + accountant \u00a31,500 + insurance \u00a3600 = \u00a331,510 total deductions.',
        'Post-tax profit available as dividends: approximately \u00a367,490. Dividend tax at blended rate \u2248 \u00a38,700.',
        'Contractor annual take-home: approximately \u00a371,360.',
        'Permanent take-home after IT + NI on \u00a375,000 salary: approximately \u00a354,100, plus employer pension worth \u00a32,250 and 33 days paid leave.'
      ]
    },
    sourceUrl: 'https://www.gov.uk/guidance/check-employment-status-for-tax',
    sourceName: 'GOV.UK \u2013 Check Employment Status for Tax',
    lastUpdated: 'April 2026',
  },
  'postgraduate-loan-cost-calculator': {
    howItWorks: [
      'This calculator projects the total lifetime cost of your postgraduate loan, including interest, over the 30-year repayment period. It models your salary trajectory and calculates annual repayments at 6% of income above £21,000, while interest accrues at RPI on the remaining balance.',
      'Because the repayment threshold is lower than for undergraduate loans (£21,000 versus £29,385 for Plan 2), postgraduate loan repayments begin at a lower salary. However, the 6% rate means each monthly payment is smaller. Whether you repay in full or have the balance written off depends on your career earnings.',
      'Enter your loan amount, starting salary and expected pay growth. The calculator shows year-by-year repayments, the interest that accrues and the projected balance at write-off. It also shows the total amount repaid compared to the original loan, so you can see the true cost of borrowing.',
    ],
    example: {
      title: 'Example: £12,000 loan, starting salary £30,000, 3.5% pay growth',
      steps: [
        'Year 1 repayment: (£30,000 \u2212 £21,000) \u00D7 6% = £540',
        'Year 1 interest (RPI 3.5%): £12,000 \u00D7 3.5% = £420',
        'Year 10 (salary ~£42,300): repaying ~£1,278/year',
        'Projected total repaid: ~£18,500 over 30 years',
      ],
    },
    sourceUrl: 'https://www.gov.uk/postgraduate-loan',
    sourceName: 'GOV.UK \u2014 Postgraduate Master\'s Loan',
    lastUpdated: 'April 2026',
  },
  'wedding-cost-calculator': {
    howItWorks: [
      'Total wedding cost depends heavily on three factors: guest count, location and style. Each additional guest adds £70–£150 in catering and associated costs. A London venue can cost two to three times more than an equivalent rural venue. A formal sit-down dinner costs significantly more than a buffet or afternoon tea reception.',
      'This calculator estimates your total wedding cost based on your guest numbers, region, meal style and supplier preferences. It draws on current UK pricing data and gives a range (low, mid, high) so you can see the impact of different choices.',
      'The calculator also compares your estimate against UK averages by region. This helps you decide where to focus spending and where to make savings that guests are unlikely to notice.',
    ],
    example: {
      title: 'Example: 100-guest wedding in the Midlands',
      steps: [
        'Venue and catering: approx. £10,000–£14,000',
        'Photography: approx. £1,200–£2,000',
        'Music/DJ: approx. £400–£800',
        'Flowers, cake, decor: approx. £1,500–£3,000',
        'Total estimate: approx. £16,000–£24,000',
      ],
    },
    sourceUrl: 'https://www.moneyhelper.org.uk/en/family-and-care/becoming-a-couple/planning-a-wedding-on-a-budget',
    sourceName: 'MoneyHelper — Planning a wedding on a budget',
    lastUpdated: 'April 2026',
  },

  // ─── MATH ────────────────────────────────────────────────────────────
  'time-duration-calculator': {
    howItWorks: [
      'This calculator finds the duration between two times in hours, minutes and seconds. It handles overnight spans that cross midnight correctly. You can also add or subtract a duration from a start time to find the end time.',
      'The tool is useful for calculating shift lengths, journey times, cooking durations and billable hours. Enter times in either 12-hour (am/pm) or 24-hour format. Results are shown in both total minutes and the hours-and-minutes breakdown.',
    ],
    example: {
      title: 'Example: Duration from 09:15 to 17:45',
      steps: [
        'Duration: 8 hours 30 minutes',
        'Total minutes: 510',
        'In decimal hours: 8.50',
      ],
    },
    sourceUrl: 'https://www.npl.co.uk/time',
    sourceName: 'National Physical Laboratory — Time',
    lastUpdated: 'April 2026',
  },
  'split-bill-calculator': {
    howItWorks: [
      'Splitting a restaurant bill equally is the quickest approach, but it can feel unfair if people ordered very differently. This calculator supports both equal and itemised splits. You can assign items to individuals and divide shared items like starters or bottles of wine between a subset of the group.',
      'The calculator also handles a tip on top of the split. Choose whether to apply the tip before or after splitting, and set a custom percentage. For large groups, many UK restaurants add a service charge automatically — the calculator lets you include this instead of a separate tip.',
    ],
    example: {
      title: 'Example: £120 bill for four people with 12.5% tip',
      steps: [
        'Bill total: £120.00',
        'Tip at 12.5%: £15.00',
        'Grand total: £135.00',
        'Per person (equal split): £33.75',
      ],
    },
    sourceUrl: 'https://www.moneyhelper.org.uk/en/everyday-money/budgeting/budget-planner',
    sourceName: 'MoneyHelper — Budget planner',
    lastUpdated: 'April 2026',
  },
  'speed-distance-time-calculator': {
    howItWorks: [
      'Speed, distance and time are related by the formula: Speed = Distance ÷ Time. Given any two of the three values, this calculator finds the third. It supports miles per hour (mph), kilometres per hour (km/h) and metres per second (m/s), converting between them automatically.',
      'The calculator is useful for journey planning, running pace calculations and physics problems. For journeys with multiple legs at different speeds, it calculates the correct average speed (total distance ÷ total time), which is not the same as the arithmetic mean of the speeds.',
    ],
    example: {
      title: 'Example: Driving 150 miles in 2 hours 30 minutes',
      steps: [
        'Distance: 150 miles',
        'Time: 2.5 hours',
        'Speed: 150 ÷ 2.5 = 60 mph',
        '60 mph = 96.56 km/h = 26.82 m/s',
      ],
    },
    sourceUrl: 'https://www.bbc.co.uk/bitesize/guides/z3bqtfr/revision/1',
    sourceName: 'BBC Bitesize — Speed, distance and time',
    lastUpdated: 'April 2026',
  },

  // ─── LEGAL ───────────────────────────────────────────────────────────
  'profit-and-loss-calculator': {
    howItWorks: [
      'A Profit and Loss (P&L) statement, also called an income statement, summarises revenue and expenses over a specific period to show whether the business made a profit or loss. The structure follows a cascading format: Revenue (or turnover) minus Cost of Goods Sold (COGS) equals Gross Profit. COGS includes all direct costs of delivering your product or service\u2014materials, direct labour, manufacturing overheads, and freight-in.',
      'Gross Profit minus operating expenses (overheads) equals Operating Profit (EBIT). Overheads cover rent, utilities, salaries of non-production staff, marketing, insurance, depreciation, professional fees, and administrative costs. Operating Profit minus interest and tax equals Net Profit\u2014the bottom line. Each level reveals different aspects of performance: gross margin shows production efficiency, operating margin shows management effectiveness, and net margin shows overall profitability after all obligations.',
      'Key ratios derived from the P&L include: Gross margin = Gross profit \u00f7 Revenue \u00d7 100; Net margin = Net profit \u00f7 Revenue \u00d7 100; and the Overheads ratio = Total overheads \u00f7 Revenue \u00d7 100. Comparing these ratios month-on-month and against industry benchmarks identifies trends. A rising gross margin but falling net margin, for example, indicates overhead costs are growing faster than revenue\u2014a common scaling problem. UK limited companies must file accounts including a P&L with Companies House annually.'
    ],
    example: {
      title: 'Monthly P&L for a small e-commerce business',
      steps: [
        'Revenue: \u00a328,000 from product sales.',
        'Cost of Goods Sold: product cost \u00a311,200 + shipping \u00a31,400 + packaging \u00a3600 = \u00a313,200. Gross profit: \u00a314,800 (52.9% margin).',
        'Overheads: rent \u00a3750 + staff \u00a34,500 + marketing \u00a32,200 + software \u00a3350 + insurance \u00a3150 + accountant \u00a3200 = \u00a38,150.',
        'Operating profit: \u00a314,800 \u2212 \u00a38,150 = \u00a36,650 (23.8% margin).',
        'Interest: \u00a3120. Net profit before tax: \u00a36,530 (23.3% net margin).'
      ]
    },
    sourceUrl: 'https://www.gov.uk/annual-accounts',
    sourceName: 'GOV.UK \u2013 Annual Accounts',
    lastUpdated: 'April 2026',
  },
  'freelance-quote-calculator': {
    howItWorks: [
      'Building a freelance quote starts with estimating the time required, broken into distinct phases: research, production, revisions, and project management. Multiply total estimated hours by your hourly rate, which should reflect your skill level, market rates, and the value delivered. Then add direct material or third-party costs at their actual price. A contingency buffer of 10\u201320% on the hours estimate protects against scope creep and unforeseen complications.',
      'Next, add your overhead recovery\u2014a proportion of fixed business costs (software licences, insurance, equipment depreciation, workspace costs) allocated per project. Then apply your target profit margin on top: a 20% margin means multiplying subtotal costs by 1.25. If you are VAT-registered (turnover above \u00a390,000), add 20% VAT to the final figure. The quote should clearly separate labour, materials, expenses, and VAT so the client can see the breakdown.',
      'When pricing, consider whether the work is a one-off or ongoing (retainer pricing may offer a discount for volume commitment), the client\'s budget sensitivity, and competitive rates in your sector. HMRC considers your pricing as part of your self-employment evidence\u2014a genuine freelancer sets their own rates and bears financial risk. Always issue a written quote with a validity period, payment terms (e.g. 30 days), and a clear scope statement to limit disputes.'
    ],
    example: {
      title: 'Web design quote for a small business website',
      steps: [
        'Estimated hours: 40 hours \u00d7 \u00a365/hr = \u00a32,600 labour.',
        'Third-party costs: stock images \u00a380, premium plugin licence \u00a3120 = \u00a3200 materials.',
        'Overhead allocation: \u00a3200 (software, insurance pro-rata).',
        'Subtotal: \u00a33,000. Apply 15% profit margin: \u00a33,000 \u00d7 1.15 = \u00a33,450.',
        'Add 20% VAT: \u00a33,450 + \u00a3690 = \u00a34,140 total quote (VAT shown separately on invoice).'
      ]
    },
    sourceUrl: 'https://www.gov.uk/set-up-sole-trader',
    sourceName: 'GOV.UK \u2013 Set Up as a Sole Trader',
    lastUpdated: 'April 2026',
  },
  'car-tax-calculator': {
    howItWorks: [
      'Vehicle Excise Duty (VED), commonly called car tax or road tax, is charged annually and collected by the DVLA. The amount you pay depends on when your vehicle was first registered, its fuel type and CO2 emissions. From April 2025, electric vehicles are no longer exempt — they now pay the lowest first-year rate and the standard annual rate from year two.',
      'For petrol and diesel cars registered after 1 April 2017, first-year rates are based on CO2 emissions and range from £0 (under 1g/km) to over £2,000 for the highest-emission vehicles. From year two, most cars pay the standard annual rate (£195 in 2026/27). Cars with a list price over £40,000 pay an additional £620 per year for the first five years on top of the standard rate.',
      'Vehicles registered between 1 March 2001 and 31 March 2017 are taxed under the old banding system based on CO2 emissions, with Band A (up to 100g/km) paying nothing and higher bands paying up to £695.',
    ],
    example: {
      title: 'Example: New petrol car, 120g/km CO2, list price £28,000',
      steps: [
        'First-year rate (120g/km CO2): £220',
        'Standard rate from year 2: £195/year',
        'List price under £40,000: no premium rate surcharge',
        'Total cost over 3 years: £220 + £195 + £195 = £610',
      ],
    },
    sourceUrl: 'https://www.gov.uk/vehicle-tax-rate-tables',
    sourceName: 'DVLA – Vehicle tax rate tables',
    lastUpdated: 'April 2026',
  },

  'tax-code-checker': {
    howItWorks: [
      'Your HMRC tax code tells your employer how much income to treat as tax-free before applying income tax. The most common code is 1257L, meaning you have the standard Personal Allowance of £12,570 for 2026/27. The numbers represent your tax-free entitlement divided by 10, so 1257 means £12,570.',
      'Letter suffixes modify how your allowance works. L means the standard Personal Allowance. M and N are used for Marriage Allowance (M = recipient, N = transferor). T means HMRC needs more information. S means Scottish rates apply; C means Welsh rates. Prefix K indicates a negative allowance — you have untaxed income or benefits that exceed your allowances, so extra tax is collected on top of your salary.',
      'Emergency codes (W1, M1, X) mean each pay period is taxed independently rather than cumulatively. Code 0T means no Personal Allowance at all. Code BR, D0 or D1 apply a flat 20%, 40% or 45% rate to all earnings — typically used for secondary employment.',
      'What does my tax code mean? The number × 10 = your annual tax-free allowance. 1257L = £12,570 Personal Allowance (the standard for 2026/27). The letter indicates your situation: L (standard), M (Marriage Allowance received), N (Marriage Allowance given), T (HMRC reviewing your tax affairs), 0T (no allowance — usually means HMRC has zero info), BR (Basic Rate on all earnings — typical second job), D0 (Higher Rate on all), D1 (Additional Rate on all), NT (no tax — typically diplomats or non-residents).',
      'Why your tax code might be wrong. Common errors: P11D benefit not removed when you change jobs (still being deducted for old car/health insurance); pension contribution not reflected; State Pension included but you\'re under SPA; underpayment from previous year being recovered too aggressively; multiple jobs producing two BR codes; emergency 1257L M1 code when starting a job (treats each payment as independent — usually under-deducts).',
      'K codes — when deductions exceed allowances. A K code (eg K500) means HMRC is collecting tax on £5,000 extra beyond your salary — usually because of: large taxable benefits (company car, fuel benefit, private health), pension over-funding charges, unpaid tax from previous year, State Pension received in current employment. K codes cannot reduce your take-home below 50% of gross. If you have K600+ you\'re paying significant \'invisible\' tax — investigate why with HMRC directly.',
      'How to fix a wrong tax code. (1) Check your code on gov.uk/personal-tax-account; (2) Use \'Tax Code Checker\' tool — explains current code; (3) If wrong, call HMRC on 0300 200 3300 with: NI number, employer details, breakdown of any benefits. (4) Form P87 for tax relief on work expenses; (5) Form P50 if you\'ve stopped work mid-year. HMRC usually corrects within 1-2 weeks. Refunds of overpaid tax come through your salary automatically once corrected, or via P800 letter.',
    ],
    example: {
      title: 'Example: Decoding tax code 1257L',
      steps: [
        'Numbers 1257 → tax-free amount = 1257 × 10 = £12,570',
        'Letter L → standard Personal Allowance, England/Wales/NI tax rates',
        'Monthly tax-free income = £12,570 ÷ 12 = £1,047.50',
        'Income above £1,047.50/month taxed at 20%, 40% or 45%',
      ],
    },
    sourceUrl: 'https://www.gov.uk/tax-codes',
    sourceName: 'HMRC – Understanding your tax code',
    lastUpdated: 'April 2026',
  },

  'car-depreciation-calculator': {
    howItWorks: [
      'Cars lose value from the moment they leave the showroom. UK data shows new cars typically lose 15–25% of their value in the first year and 50–60% over three years. Depreciation slows significantly with age — an 8-year-old car loses far less in absolute terms each year than a brand new one.',
      'This calculator uses the declining balance method: each year the car retains a fixed percentage of its previous value. Retention rates vary by fuel type and model — EVs currently depreciate faster than average due to rapid technology change, while popular mainstream models hold value relatively well.',
      'Key depreciation drivers: fuel type, annual mileage (vs 12,000-mile industry benchmark), full service history, number of owners, condition, and ULEZ compliance status which increasingly affects older petrol and diesel values in urban areas.',
    ],
    example: {
      title: 'Example: £30,000 petrol car with 20% annual depreciation',
      steps: [
        'Year 1: £30,000 × 0.80 = £24,000 (lost £6,000)',
        'Year 2: £24,000 × 0.80 = £19,200 (lost £4,800)',
        'Year 3: £19,200 × 0.80 = £15,360 (lost £3,840)',
        'After 3 years: 51% of original value retained; total loss £14,640',
      ],
    },
    sourceUrl: 'https://www.gov.uk/buying-a-car',
    sourceName: 'GOV.UK – Buying a car',
    lastUpdated: 'April 2026',
  },

  'mpg-calculator': {
    howItWorks: [
      'Miles Per Gallon (MPG) measures how far your car travels on one UK gallon of fuel (4.546 litres). Higher MPG means lower running costs. To get accurate real-world MPG: fill to the brim, reset the trip counter, drive normally, then fill up again and note the litres added and distance covered.',
      'Official WLTP manufacturer figures typically exceed real-world MPG by 10–25%. This calculator uses your actual journey data for a true fuel economy figure. It also converts to L/100km (European standard) and km/L.',
      "HMRC's approved mileage rate for business travel is 45p per mile for the first 10,000 business miles and 25p thereafter (cars). Knowing your real MPG lets you calculate your true cost per mile and check whether this exceeds or falls short of the HMRC allowance.",
    ],
    example: {
      title: 'Example: 350-mile trip using 40 litres of fuel',
      steps: [
        '40 litres ÷ 4.546 = 8.80 UK gallons',
        'MPG = 350 ÷ 8.80 = 39.8 MPG real-world',
        'Fuel cost at £1.40/litre: (40 × £1.40) ÷ 350 = 16.0p per mile',
        'HMRC rate is 45p/mile — covers fuel plus wear and depreciation',
      ],
    },
    sourceUrl: 'https://www.gov.uk/guidance/advisory-fuel-rates',
    sourceName: 'HMRC – Advisory fuel rates',
    lastUpdated: 'April 2026',
  },

  'carer-allowance-calculator': {
    howItWorks: [
      "<a href='/calculator/carer-allowance-calculator/' class='text-primary underline'>Carer\'s Allowance</a> is the main state benefit for unpaid carers. For 2026/27 it pays £81.90 per week (£4,258.80 per year). To qualify you must care for someone for at least 35 hours per week who receives a qualifying disability benefit: PIP Daily Living (either rate), Attendance Allowance, or DLA care component at the middle or highest rate.",
      "There is a weekly net earnings limit of £151. After deducting income tax, NI, pension contributions, and 50% of any qualifying pension premium costs, your net weekly earnings must not exceed this amount. If you earn more in any given week, <a href='/calculator/carer-allowance-calculator/' class='text-primary underline'>Carer\'s Allowance</a> is not payable for that week.",
      "Claiming Carer's Allowance also entitles you to the Carer Element in Universal Credit (£198.31/month in 2026/27). If you already receive State Pension or another benefit at the same or higher rate, you may be 'underlying entitled' — you won't receive the cash payment but still qualify for the Carer Element in UC.",
    ],
    example: {
      title: "Example: Part-time carer earning £200 gross per week",
      steps: [
        'Gross weekly pay: £200',
        'Less income tax and NI (approx £25): net £175',
        'Less 50% of £60/week pension contribution (£30): adjusted net £145',
        '£145 < £151 limit → Carer’s Allowance of £81.90/week is payable',
      ],
    },
    sourceUrl: 'https://www.gov.uk/carers-allowance',
    sourceName: "GOV.UK – Carer's Allowance",
    lastUpdated: 'April 2026',
  },

  'employers-liability-calculator': {
    howItWorks: [
      "Employers' Liability (EL) insurance is a legal requirement for virtually all UK businesses with at least one employee, under the Employers' Liability (Compulsory Insurance) Act 1969. It covers compensation claims from employees injured or made ill through their work. The minimum required cover is £5 million, though most policies provide £10 million. Fines for non-compliance reach £2,500 per day.",
      'Premiums are set as a percentage of annual payroll, adjusted by sector risk. Low-risk sectors (professional services, office work) typically pay 0.3–0.8% of payroll. Medium-risk sectors (light manufacturing, logistics) pay 0.5–1.5%. High-risk industries (construction, demolition, chemical processing) pay 1.0–3.0% or more. A clean claims history earns significant discounts.',
      'This calculator provides indicative estimates only. Actual premiums are underwritten individually and depend on full disclosure of activities, employee roles, claims history and risk management measures in place.',
      'Who qualifies for Carer\'s Allowance? Pay £83.30/week (2026/27) to anyone aged 16+ who spends 35+ hours/week caring for someone receiving a qualifying disability benefit: PIP Daily Living component (either rate), Attendance Allowance, DLA care component at middle or highest rate, Armed Forces Independence Payment, or Constant Attendance Allowance. The cared-for person must consent to you claiming. You can\'t claim if you\'re in full-time education (21+ hours/week study).',
      'The £196/week earnings limit. You cannot earn more than £196/week (2026/27) after deductions for: income tax, NI, 50% of pension contributions, expenses related to your work (eg childcare while you work). If you earn over £196 in any single week, you lose ALL Carer\'s Allowance for that week — no taper. This is one of the harshest cliff edges in UK benefits and traps many carers in poverty. Always check before taking on extra hours.',
      'How Carer\'s Allowance interacts with State Pension. Pre-State Pension age: you receive £83.30/week. State Pension age: if your State Pension is £83.30+/week, you cannot claim Carer\'s Allowance (it\'s a \'overlapping benefit\'). However, you can be \'underlying entitled\' — getting no cash but qualifying for the Carer Element of Universal Credit (£198.31/month if under State Pension age) or higher Pension Credit. Always apply for Carer\'s Allowance even if State Pension wipes out the cash payment.',
      'Carer\'s NI credits — crucial for State Pension. Receiving Carer\'s Allowance entitles you to Class 1 National Insurance credits — counting toward your State Pension qualifying years. Each year of CA = ~£328/year extra State Pension for life from age 67. If you don\'t qualify for CA (eg cared-for person\'s benefits insufficient), Carer\'s Credit gives the same NI credits — apply separately via gov.uk/carers-credit. Many carers miss this and end up with reduced State Pensions despite years of unpaid caring.',
    ],
    example: {
      title: "Example: 10-employee professional services firm, £350,000 wage bill",
      steps: [
        'Risk rate for professional services: 0.4% of payroll',
        'Base premium: £350,000 × 0.004 = £1,400/year',
        'Clean claims history discount (15%): −£210',
        'Estimated annual premium: £1,190',
      ],
    },
    sourceUrl: 'https://www.hse.gov.uk/pubns/hse40.htm',
    sourceName: "HSE – Employers' liability compulsory insurance guide",
    lastUpdated: 'April 2026',
  },

  'blind-persons-allowance-calculator': {
    howItWorks: [
      "Blind Person's Allowance (BPA) is an additional income tax allowance for people registered as severely sight impaired (blind). For 2026/27 it is worth £3,070. It is added on top of the standard Personal Allowance of £12,570, giving a total tax-free income of £15,640.",
      "Unused BPA can be transferred to a spouse or civil partner. They do not need to be registered as blind themselves — the transferred amount simply reduces their taxable income, potentially saving up to £614 per year at the basic rate or £1,228 at the higher rate.",
      "To claim in England and Wales, you need a Certificate of Vision Impairment (CVI) classifying you as severely sight impaired. In Scotland, the equivalent is an SOAVI form. You can also qualify if an ophthalmologist certifies you as unable to do any work for which eyesight is essential, before formal registration is complete. Claim via Self Assessment or by contacting HMRC.",
    ],
    example: {
      title: "Example: Higher-rate taxpayer claiming full BPA",
      steps: [
        'Standard Personal Allowance 2026/27: £12,570',
        "Add Blind Person's Allowance: + £3,070",
        'Total tax-free income: £15,640',
        'Annual tax saving at 40% (higher rate): £3,070 × 40% = £1,228/year',
      ],
    },
    sourceUrl: 'https://www.gov.uk/blind-persons-allowance',
    sourceName: "HMRC – Blind Person's Allowance",
    lastUpdated: 'April 2026',
  },

  'teachers-pension-calculator': {
    howItWorks: [
      "The Teachers' Pension Scheme (TPS) is a defined benefit career average revalued earnings (CARE) pension. Each year of service accrues 1/57th of your pensionable pay for that year as a pension entitlement. That annual slice is then revalued each April by CPI + 1.6% until you retire, protecting its real value.",
      'Member contributions are tiered by salary band. For 2026/27: 7.4% up to £32,135; 8.6% on £32,136–£43,259; 9.7% on £43,260–£51,292; 10.2% on £51,293–£67,431; 11.7% on £67,432–£92,297; 12.4% above £92,297. Employer contributions are 23.68% of pensionable pay. Both employer and employee contributions attract tax relief.',
      'Normal Pension Age is linked to State Pension Age (67, rising to 68). The pension is CPI-linked in payment. There is no automatic lump sum in the career average scheme, but you can commute pension at £12 lump sum for every £1/year of annual pension surrendered.',
    ],
    example: {
      title: "Example: Teacher earning £40,000, 20 years' service",
      steps: [
        'Annual accrual: £40,000 ÷ 57 = £701.75',
        '20 years simplified (no revaluation): 20 × £701.75 = £14,035/year pension',
        'With CPI+1.6% revaluation on earlier accruals, actual pension higher',
        'Approximate monthly pension before tax: £1,170',
      ],
    },
    sourceUrl: 'https://www.teacherspensions.co.uk/members/working-life/your-pension/how-your-pension-is-calculated.aspx',
    sourceName: "Teachers' Pensions – How your pension is calculated",
    lastUpdated: 'April 2026',
  },

  'student-loan-total-cost-calculator': {
    howItWorks: [
      'Most graduates do not repay their student loan in full. Under Plan 5 (new students from September 2023) the loan is written off after 40 years; under Plan 2 (2012–2022) after 30 years. This makes the true cost entirely dependent on your earnings trajectory — not the headline balance.',
      'Repayments are 9% of income above the threshold: £25,000 for Plan 5; £29,385 for Plan 2 in 2026/27. Interest accrues at RPI only (Plan 5) or RPI+up to 3% (Plan 2). On median-salary careers, interest often accrues faster than repayments early on, causing the balance to grow before eventually being written off.',
      'For many graduates, the student loan works like a time-limited graduate tax rather than a traditional debt. High earners repay in full and pay substantial interest. Those on lower or median earnings have a portion or all of their balance written off at the end of the term. The calculator projects total repayments using realistic salary growth.',
    ],
    example: {
      title: 'Example: Plan 5, £60,000 loan, starting salary £30,000',
      steps: [
        'Year 1 repayment: (£30,000 − £25,000) × 9% = £450/year',
        'RPI interest at 3%: £60,000 × 3% = £1,800 added — balance rises to £61,350',
        'Balance continues growing until salary rises enough to outpace interest',
        'At UK median salary trajectory, many Plan 5 graduates never clear balance before 40-year write-off',
      ],
    },
    sourceUrl: 'https://www.gov.uk/repaying-your-student-loan',
    sourceName: 'GOV.UK – Repaying your student loan',
    lastUpdated: 'April 2026',
  },

  'ni-salary-sacrifice-2029-calculator': {
    howItWorks: [
      'Pension contributions made via salary sacrifice currently reduce the salary on which employer National Insurance is calculated. At the 2026/27 employer NI rate of 15%, every £1,000 redirected to a pension saves the employer £150 in NI — many employers pass this saving to employees as an enhanced pension contribution.',
      'The government has consulted on removing the employer NI advantage on salary sacrifice pension contributions, with 2029 cited as a potential implementation date. Under the proposed change, the pension contribution would not reduce the employer NI base, eliminating the NI efficiency of current salary sacrifice arrangements.',
      'This calculator quantifies your current NI saving and estimates what you would lose under the proposed rules. This is a proposed change only — no legislation has been passed as of April 2026. Use these results for financial planning and to assess whether it is worth locking in current arrangements.',
    ],
    example: {
      title: 'Example: £50,000 salary, £5,000 pension via salary sacrifice',
      steps: [
        'Current employer NI base: (£50,000 − £5,000 sacrifice − £5,000 threshold) = £40,000',
        'Current employer NI: £40,000 × 15% = £6,000/year',
        'Proposed 2029 NI base: (£50,000 − £5,000 threshold) = £45,000 × 15% = £6,750',
        'Annual NI saving lost: £750/year per employee',
      ],
    },
    sourceUrl: 'https://www.gov.uk/guidance/salary-sacrifice-for-employers',
    sourceName: 'HMRC – Salary sacrifice for employers',
    lastUpdated: 'April 2026',
  },

  'mortgage-early-repayment-calculator': {
    howItWorks: [
      'Most fixed-rate mortgages carry an Early Repayment Charge (ERC) if you repay more than your annual overpayment allowance — typically 10% of the outstanding balance per year — during the fixed period. ERCs usually range from 1–5% of the amount repaid early, declining year by year through the fixed term.',
      'The break-even calculation compares: (A) paying the ERC now and clearing the mortgage or switching to a cheaper rate; versus (B) continuing regular payments until the end of the fix, then remortgaging. If the interest saved in scenario A exceeds the ERC, early repayment makes financial sense.',
      'Opportunity cost also matters. Money used to clear a 4% mortgage earns a guaranteed 4% return but cannot be invested elsewhere. If you can reliably earn more than your mortgage rate in a stocks and shares ISA, investing may be preferable. Mortgage overpayments are guaranteed savings; investment returns are not.',
    ],
    example: {
      title: 'Example: £120,000 remaining, 3% ERC, 2 years left at 4.5%',
      steps: [
        'ERC cost to clear now: £120,000 × 3% = £3,600',
        'Approximate interest over 2 remaining years: £120,000 × 4.5% × 2 = £10,800',
        'Net saving from paying off now: £10,800 − £3,600 = £7,200',
        'Early repayment worthwhile here — always verify your lender\'s exact ERC schedule',
      ],
    },
    sourceUrl: 'https://www.fca.org.uk/consumers/mortgages',
    sourceName: 'FCA – Mortgage consumer information',
    lastUpdated: 'April 2026',
  },

  'care-cost-calculator': {
    howItWorks: [
      'Care home costs in England are means-tested by the local authority. If your total assessable assets exceed the upper capital limit of £23,250, you are fully self-funded and pay the full weekly care fee. Below £14,250, the local authority covers most costs and you contribute only from income. Between the two limits a sliding scale applies.',
      'Your home is included in the means test when you enter permanent residential care and the property is empty — unless a spouse, civil partner, dependent child under 18, or a qualifying carer still lives there. If included, it often creates a large notional asset. A Deferred Payment Agreement (DPA) allows the council to fund your care, taking a legal charge on the property to be repaid when it is eventually sold.',
      'The proposed £86,000 lifetime care cap was originally set for October 2023, delayed to 2025, and subsequently indefinitely postponed. As of April 2026, the £23,250 upper and £14,250 lower capital thresholds remain in force in England.',
    ],
    example: {
      title: 'Example: £40,000 savings, partner still living in family home',
      steps: [
        'Assessable assets: £40,000 savings only (property excluded — partner in residence)',
        '£40,000 > £23,250 upper limit → fully self-funded',
        'Weekly residential care fee: £1,200 (national average)',
        'After approx 14 weeks, assets fall to £23,250 and local authority funding begins',
      ],
    },
    sourceUrl: 'https://www.gov.uk/care-homes/paying-for-care-in-a-care-home',
    sourceName: 'GOV.UK – Paying for care in a care home',
    lastUpdated: 'April 2026',
  },
}
