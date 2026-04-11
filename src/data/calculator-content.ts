/**
 * Extended content for calculator pages: How It Works, worked examples, source links.
 * Used to enrich SEO content depth on individual calculator pages.
 */

export interface CalculatorContent {
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
    howItWorks: [
      'UK income tax is calculated on a progressive banding system. You are entitled to a tax-free Personal Allowance of £12,570 for the 2025/26 tax year. Income above that is taxed at increasing rates: 20% Basic Rate (£12,571–£50,270), 40% Higher Rate (£50,271–£125,140) and 45% Additional Rate (above £125,140).',
      'If you earn more than £100,000, your Personal Allowance is reduced by £1 for every £2 above this threshold. This creates an effective marginal rate of 60% on income between £100,000 and £125,140. The allowance is completely eliminated at £125,140.',
      'This calculator applies the exact banding structure used by HMRC. Enter your gross annual salary and it will show your tax breakdown by band, your effective tax rate and your take-home position. Scottish taxpayers should use the Scottish Income Tax Calculator instead, as Scotland has its own rates and bands.',
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
    howItWorks: [
      'Class 1 Employee National Insurance is charged on earnings above the Primary Threshold of £12,570 per year. For the 2025/26 tax year, the rate is 8% on earnings between £12,570 and £50,270 (the Upper Earnings Limit), then 2% on everything above £50,270.',
      'NI is calculated on a per-pay-period basis, so weekly and monthly thresholds differ slightly from the annual figures. This calculator uses annualised thresholds for simplicity, which gives results that match HMRC\'s annual calculation to within a few pence.',
      'You stop paying employee NI when you reach State Pension age, even if you continue working. The calculator assumes you are below State Pension age.',
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
    sourceName: 'HMRC — NI rates and thresholds 2025/26',
    lastUpdated: 'April 2026',
  },

  'vat-calculator': {
    howItWorks: [
      'Value Added Tax (VAT) in the UK is charged at three rates: Standard (20%), Reduced (5%) and Zero (0%). The standard rate applies to most goods and services. The reduced rate covers items like home energy, child car seats and mobility aids. The zero rate applies to essentials including most food, children\'s clothing and books.',
      'This calculator supports three modes: Add VAT (calculate the gross from a net amount), Remove VAT (find the net from a gross amount) and Reverse VAT (extract the VAT component from a VAT-inclusive total). The formula to remove 20% VAT from a gross price is: Net = Gross ÷ 1.20.',
      'Businesses with VAT-taxable turnover above £90,000 (the 2025/26 threshold) must register for VAT. Below this threshold, voluntary registration is possible.',
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
    howItWorks: [
      'Your take-home pay is what remains after all statutory deductions are subtracted from your gross salary. In the UK, these deductions include income tax (based on your tax code and banding), employee National Insurance (8% and 2%), workplace pension contributions (typically 5% for auto-enrolment) and student loan repayments (if applicable).',
      'This calculator applies deductions in the correct order: pension contributions are deducted before tax if made via salary sacrifice, or after tax if made via net-pay arrangement. Student loan repayments are calculated at 9% of income above the relevant plan threshold (6% for Postgraduate Loans).',
      'The result shows your monthly and annual take-home pay, with a full breakdown of each deduction. You can toggle pension contributions, student loan plans, and bonus payments to see how they affect your net income.',
    ],
    example: {
      title: 'Example: £40,000 salary, Plan 2 student loan, 5% pension',
      steps: [
        'Gross salary: £40,000',
        'Pension (5% salary sacrifice): −£2,000',
        'Taxable income: £38,000',
        'Income tax: £5,086 (£25,430 at 20%)',
        'Employee NI: £1,874.40',
        'Student loan Plan 2 (9% above £27,295): £1,143.45',
        'Take-home pay: £29,896.15/year (£2,491.35/month)',
      ],
    },
    sourceUrl: 'https://www.gov.uk/estimate-income-tax',
    sourceName: 'GOV.UK — Estimate your Income Tax',
    lastUpdated: 'April 2026',
  },

  'mortgage-repayment-calculator': {
    howItWorks: [
      'A repayment mortgage calculator uses the standard amortisation formula to calculate your fixed monthly payment. The formula accounts for the loan amount, annual interest rate and loan term to produce a payment that covers both interest and capital repayment, so the loan is fully repaid by the end of the term.',
      'With a repayment mortgage, early payments are mostly interest, but over time the capital portion grows. An interest-only mortgage charges only the interest each month, leaving the full capital balance due at the end. This calculator supports both types and shows the total amount repaid over the life of the loan.',
      'The calculation assumes a fixed interest rate throughout the term. In practice, most UK mortgages are fixed for 2-5 years before reverting to the lender\'s standard variable rate (SVR). Use the mortgage comparison features to compare different rates and terms side by side.',
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
    howItWorks: [
      'This calculator projects the value of your pension pot at retirement based on your current contributions, employer contributions, investment growth and tax relief. It uses compound growth with monthly contributions to model how your pot grows over time.',
      'UK pension contributions receive tax relief at your marginal rate. Basic-rate taxpayers get 20% relief automatically (a £100 contribution costs you £80). Higher-rate taxpayers can claim an additional 20% through Self Assessment. The annual allowance for 2025/26 is £60,000.',
      'Auto-enrolment requires a minimum total contribution of 8% (5% employee + 3% employer). Many employers offer more generous matching schemes. The calculator lets you model different contribution levels and see the impact on your projected retirement income.',
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
    howItWorks: [
      'Capital Gains Tax (CGT) is charged on the profit you make when you sell or dispose of an asset that has increased in value. For the 2025/26 tax year, the annual exempt amount is £3,000. Gains above this are taxed at different rates depending on the asset type and your income tax band.',
      'Residential property gains are taxed at 18% (basic rate) or 24% (higher/additional rate). All other assets are taxed at 10% (basic rate) or 20% (higher/additional rate). Your unused basic rate band determines which rate applies to your gains.',
      'Your main home is usually exempt under Private Residence Relief. Losses from other disposals in the same or previous tax years can be offset against gains before tax is calculated.',
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
    howItWorks: [
      'Inheritance Tax (IHT) is charged at 40% on the value of an estate above the nil-rate band of £325,000. An additional residence nil-rate band (RNRB) of £175,000 is available when passing a home to direct descendants (children or grandchildren), giving a potential threshold of £500,000 per person.',
      'Married couples and civil partners can transfer unused nil-rate bands to the surviving partner, potentially giving a combined threshold of £1 million. The rate is reduced to 36% if at least 10% of the net estate is left to qualifying charities.',
      'The RNRB is tapered for estates above £2 million, reducing by £1 for every £2 above this threshold. Gifts made within 7 years of death may also be subject to IHT on a sliding scale (taper relief).',
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
    howItWorks: [
      'UK dividends are taxed at special rates that are lower than income tax rates. For 2025/26, the tax-free dividend allowance is £500. Dividends above this are taxed at 8.75% (basic rate), 33.75% (higher rate) or 39.35% (additional rate).',
      'Dividends are added on top of your other income to determine which band they fall into. If your salary already uses up the basic-rate band, your dividends will be taxed at the higher rate. Company directors often optimise the salary/dividend split to minimise total tax.',
      'Dividends received within an ISA or pension are tax-free and do not count towards the dividend allowance. The allowance was reduced from £1,000 in 2023/24 to £500 from 2024/25 onwards.',
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
    howItWorks: [
      'Student loan repayments are collected through PAYE alongside tax and NI. You repay 9% of income above your plan\'s threshold (6% for Postgraduate Loans). For 2025/26: Plan 1 threshold is £24,990, Plan 2 is £27,295, Plan 4 (Scotland) is £31,395, and Plan 5 is £25,000.',
      'Repayments are calculated per pay period, not annually. If you are on multiple plans, you repay each one separately. For example, if you have a Plan 2 loan and a Postgraduate Loan, you pay 9% on income above £27,295 for Plan 2, plus 6% above £21,000 for the Postgraduate Loan.',
      'Remaining balances are written off after a set period: 25 years for Plan 1, 30 years for Plans 2 and 4, and 40 years for Plan 5. Interest is charged at RPI plus up to 3% depending on income and plan type.',
    ],
    example: {
      title: 'Example: £32,000 salary, Plan 2 loan',
      steps: [
        'Income above threshold: £32,000 − £27,295 = £4,705',
        'Annual repayment: £4,705 × 9% = £423.45',
        'Monthly deduction: £35.29',
      ],
    },
    sourceUrl: 'https://www.gov.uk/repaying-your-student-loan/what-you-pay',
    sourceName: 'GOV.UK — Student loan repayment rates',
    lastUpdated: 'April 2026',
  },

  'self-assessment-tax-calculator': {
    howItWorks: [
      'Self Assessment is the system HMRC uses to collect income tax from people whose tax is not fully deducted at source. This includes the self-employed, company directors, landlords, and anyone with income over £150,000 or significant untaxed income.',
      'This calculator estimates your Self Assessment tax bill by combining income tax, Class 2 NI (£3.45/week if profits exceed £12,570), Class 4 NI (6% on profits between £12,570 and £50,270, then 2% above) and any student loan repayments.',
      'Payment on Account may apply: if your tax bill is over £1,000 and less than 80% was collected at source, you may need to make two advance payments (each 50% of the previous year\'s bill) on 31 January and 31 July.',
    ],
    example: {
      title: 'Example: Self-employed, £55,000 profit',
      steps: [
        'Income tax: £8,432 (PA + Basic + partial Higher)',
        'Class 2 NI: £179.40 (52 weeks × £3.45)',
        'Class 4 NI: £2,264 + £94.60 = £2,358.60',
        'Total Self Assessment bill: £10,970',
      ],
    },
    sourceUrl: 'https://www.gov.uk/self-assessment-tax-returns',
    sourceName: 'GOV.UK — Self Assessment tax returns',
    lastUpdated: 'April 2026',
  },

  'corporation-tax-calculator': {
    howItWorks: [
      'UK Corporation Tax is charged on company profits. The main rate is 25% for profits over £250,000. The small profits rate is 19% for profits up to £50,000. Marginal Relief applies for profits between £50,000 and £250,000, creating a gradual transition between the two rates.',
      'The Marginal Relief fraction for 2025/26 is 3/200. This means companies in the marginal band pay an effective rate that rises gradually from 19% to 25% as profits increase from £50,000 to £250,000.',
      'Associated companies share the thresholds. If your company has one associated company, the small profits threshold becomes £25,000 and the main threshold becomes £125,000.',
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
    howItWorks: [
      'From April 2025, employer National Insurance increased to 15% (up from 13.8%). The secondary threshold was reduced to £5,000 (down from £9,100), meaning employers now pay NI on a significantly larger portion of each employee\'s salary.',
      'The Employment Allowance for 2025/26 is £10,500, which offsets your employer NI bill. Most businesses are eligible unless their total employer NI liability exceeded £100,000 in the previous tax year, or the company has a single director with no other employees.',
      'This calculator shows the cost per employee and lets you estimate the impact of the April 2025 changes compared to the previous year\'s rates.',
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
    sourceName: 'HMRC — Rates and thresholds for employers 2025/26',
    lastUpdated: 'April 2026',
  },

  'child-benefit-calculator': {
    howItWorks: [
      'Child Benefit for 2025/26 is £26.05 per week for the eldest or only child and £17.25 per week for each additional child. Payments are made every 4 weeks and are tax-free unless either parent earns over £60,000.',
      'The High Income Child Benefit Charge (HICBC) applies when the higher-earning parent earns between £60,000 and £80,000. You repay 1% of the Child Benefit received for every £200 of income above £60,000. At £80,000 or above, the full amount is effectively clawed back through tax.',
      'You should still claim Child Benefit even if subject to HICBC, as it protects your National Insurance record (important for State Pension qualification) and automatically registers the child for a National Insurance number at 16.',
    ],
    example: {
      title: 'Example: 2 children, higher earner on £70,000',
      steps: [
        'Annual Child Benefit: (£26.05 + £17.25) × 52 = £2,251.60',
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
      'Universal Credit (UC) is calculated by adding a standard allowance (based on age and relationship status) plus additional elements for children, housing costs, caring responsibilities and disability. Your payment is then reduced based on your earnings through a taper rate of 55%.',
      'The work allowance lets you earn a set amount before the taper applies: £404/month if your UC includes no housing element, or £673/month if it does not include housing. For every £1 you earn above the work allowance, your UC is reduced by 55p.',
      'This calculator estimates your UC entitlement based on your household composition, income, housing costs and circumstances. Actual entitlements depend on a full assessment by the DWP and may differ from estimates.',
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
    howItWorks: [
      'Statutory redundancy pay is calculated based on your age, length of continuous service (up to 20 years) and weekly pay (capped at £700 for 2025/26). The formula gives: 0.5 weeks\' pay per year of service under age 22, 1 week per year aged 22–40, and 1.5 weeks per year aged 41 and over.',
      'The maximum statutory redundancy payment is therefore 30 weeks\' pay (20 years × 1.5 for over-41s), capped at £21,000 (30 × £700). Your employer may offer enhanced redundancy pay above the statutory minimum.',
      'The first £30,000 of any redundancy payment (statutory plus contractual) is tax-free. Amounts above £30,000 are subject to income tax and potentially employer NI.',
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
      'Statutory Maternity Pay (SMP) is paid for up to 39 weeks. The first 6 weeks are paid at 90% of your average weekly earnings (AWE) with no cap. The remaining 33 weeks are paid at the lower of £187.18 per week or 90% of your AWE. The final 13 weeks of the 52-week maternity leave entitlement are unpaid.',
      'To qualify for SMP you must have worked for your employer continuously for at least 26 weeks by the 15th week before the expected week of childbirth, and your average earnings must be at least £125 per week (the Lower Earnings Limit). You must also give at least 28 days\' notice and provide proof of pregnancy (MATB1 certificate).',
      'SMP is treated as earnings, so income tax, National Insurance and pension contributions may still be deducted. Employers can reclaim 92% of SMP from HMRC, or 103% if they qualify for Small Employers\' Relief. This calculator shows your weekly and monthly SMP for the full 39-week period.',
    ],
    example: {
      title: 'Example: Average weekly earnings of £600',
      steps: [
        'Weeks 1-6 (90% of AWE): £600 × 90% = £540/week = £3,240 total',
        'Weeks 7-39 (lower of £187.18 or 90%): £187.18/week = £6,176.94 total',
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
      'Scotland sets its own income tax rates and bands under powers devolved by the Scotland Act 2016. For 2025/26 there are six bands above the Personal Allowance of £12,570: Starter (19%), Basic (20%), Intermediate (21%), Higher (42%), Advanced (45%) and Top (48%). These differ significantly from the rest-of-UK rates.',
      'The Starter band covers income from £12,571 to £14,876, Basic from £14,877 to £26,561, Intermediate from £26,562 to £43,662, Higher from £43,663 to £75,000, Advanced from £75,001 to £125,140 and Top rate applies above £125,140. The same £100,000 Personal Allowance taper applies as in the rest of the UK.',
      'Your tax code letter S indicates you pay Scottish rates. HMRC determines this based on your main place of residence on 6 April each year. This calculator applies all six Scottish bands to give you an accurate breakdown of your liability.',
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
      'Company car tax is based on the Benefit-in-Kind (BiK) value of the vehicle. HMRC assigns a BiK percentage to each car based on its CO2 emissions and fuel type. For 2025/26, pure electric vehicles have a BiK rate of 3%, while the highest-polluting petrol or diesel cars reach 37%. You pay income tax on the BiK value at your marginal rate.',
      'The BiK value is calculated as: P11D price (list price including options and delivery, minus the first year registration fee and vehicle excise duty) multiplied by the BiK percentage. If the employer also provides free fuel for private use, a separate fuel benefit charge applies based on a fixed multiplier of £27,800 for 2025/26.',
      'Employers pay Class 1A National Insurance at 15% on the full BiK value. This calculator takes the car\'s list price, CO2 emissions, fuel type and your tax band to show both your annual tax cost and the employer\'s NI cost.',
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
      'HMRC treats cryptocurrency as a taxable asset. Capital Gains Tax applies when you sell, swap, gift or spend crypto at a profit. For the 2025/26 tax year, the annual exempt amount is £3,000. Gains above this are taxed at 10% for basic-rate taxpayers or 20% for higher and additional-rate taxpayers.',
      'The cost basis is calculated using the share-pooling method, which is the same approach used for shares. Under this method, you maintain a pool of tokens with an average cost. The rules also include the same-day rule (matching disposals with acquisitions on the same day) and the bed-and-breakfast rule (matching with acquisitions within 30 days).',
      'You must report crypto gains exceeding four times the annual exempt amount (£12,000 for 2025/26) via Self Assessment, even if no tax is due after the exemption. Mining, staking rewards and airdrops may be treated as income rather than capital gains depending on the activity.',
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
    sourceName: 'HMRC — Rates and thresholds for employers 2025/26',
    lastUpdated: 'April 2026',
  },
  'bonus-tax-calculator': {
    howItWorks: [
      'Bonuses are taxed as part of your total earnings in the pay period they are received. Your employer adds the bonus to your regular pay and applies PAYE using the standard tax tables. This often pushes you into a higher marginal tax bracket for that period, making it appear heavily taxed, though the annual effect may be lower.',
      'The deductions on a bonus include income tax at your marginal rate, employee National Insurance at 8% (or 2% above the Upper Earnings Limit) and any workplace pension contributions. If the bonus tips your income above £50,270, the portion above that threshold is taxed at 40% and NI drops to 2%.',
      'This calculator adds your bonus to your annual salary to calculate the correct deductions. It shows the marginal rate applied to the bonus, the net bonus amount and a comparison showing your normal monthly pay versus the bonus month. Over the full year, HMRC\'s cumulative PAYE system ensures you pay the right total tax.',
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
    howItWorks: [
      'This calculator helps you estimate your UK State Pension based on your National Insurance record. Full new State Pension is £230.25 per week. The calculation follows official UK rules and rates for the 2025/26 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the State Pension Calculator',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2025/26 rates from GOV.UK — Pension rules',
      ],
    },
    sourceUrl: 'https://www.gov.uk/tax-on-your-private-pension',
    sourceName: 'GOV.UK — Pension rules',
    lastUpdated: 'April 2026',
  },
  'pension-tax-relief-calculator': {
    howItWorks: [
      'This calculator helps you calculate how much tax relief you get on pension contributions as a basic, higher or additional rate taxpayer. The calculation follows official UK rules and rates for the 2025/26 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the Pension Tax Relief Calculator',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2025/26 rates from GOV.UK — Pension rules',
      ],
    },
    sourceUrl: 'https://www.gov.uk/tax-on-your-private-pension',
    sourceName: 'GOV.UK — Pension rules',
    lastUpdated: 'April 2026',
  },
  'isa-calculator': {
    howItWorks: [
      'This calculator helps you calculate your tax-free ISA savings growth with the £20,000 annual allowance. Compare Cash ISA and Stocks & Shares ISA. The calculation follows official UK rules and rates for the 2025/26 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the ISA Calculator — Tax-Free Savings Growth',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2025/26 rates from GOV.UK — Savings and ISAs',
      ],
    },
    sourceUrl: 'https://www.gov.uk/individual-savings-accounts',
    sourceName: 'GOV.UK — Savings and ISAs',
    lastUpdated: 'April 2026',
  },
  'personal-loan-calculator': {
    howItWorks: [
      'A personal loan is repaid in fixed monthly instalments over an agreed term, typically one to seven years. Each payment covers a portion of the principal plus interest. The interest is usually calculated on the reducing balance, meaning you pay less interest as the outstanding amount shrinks.',
      'Lenders advertise a representative APR, which at least 51% of approved applicants must receive. Your actual rate depends on your credit score, income and the loan amount. Rates tend to be lowest in the £7,500–£15,000 range and higher for smaller or larger sums.',
      'This calculator uses the standard annuity formula to compute your monthly repayment, total interest and overall cost. Adjust the loan amount, term and interest rate to compare different scenarios side by side.',
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
      'Credit card interest is typically charged on the outstanding balance at the end of each statement period. If you only pay the minimum — usually the greater of 2.5% of the balance or £5 — the majority of your payment covers interest rather than reducing the debt. This means it can take decades to clear even a moderate balance.',
      'The calculator shows how long it takes to pay off your balance under three scenarios: minimum payments only, a fixed monthly amount you choose, or paying the full balance each month. It also shows how much interest you pay in total under each approach.',
      'Section 77A of the Consumer Credit Act requires lenders to include a minimum-repayment warning on statements. This calculator helps you see why a fixed payment strategy can save thousands in interest compared to sticking with the minimum.',
    ],
    example: {
      title: 'Example: £3,000 balance at 22.9% APR',
      steps: [
        'Minimum payment (2.5%): takes over 20 years, total interest approx. £3,400',
        'Fixed £100/month: cleared in 38 months, total interest approx. £780',
        'Fixed £200/month: cleared in 17 months, total interest approx. £350',
        'Paying £100 instead of the minimum saves over £2,600 in interest',
      ],
    },
    sourceUrl: 'https://www.moneyhelper.org.uk/en/everyday-money/credit/how-to-pay-off-credit-card-debt',
    sourceName: 'MoneyHelper — Paying off credit card debt',
    lastUpdated: 'April 2026',
  },
  'sole-trader-tax-calculator': {
    howItWorks: [
      'This calculator helps you calculate income tax, Class 2 and Class 4 NI for sole traders and self-employed individuals. The calculation follows official UK rules and rates for the 2025/26 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the Sole Trader Tax Calculator',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2025/26 rates from GOV.UK — Business tax',
      ],
    },
    sourceUrl: 'https://www.gov.uk/corporation-tax-rates',
    sourceName: 'GOV.UK — Business tax',
    lastUpdated: 'April 2026',
  },
  'ir35-calculator': {
    howItWorks: [
      'IR35 is tax legislation that determines whether a contractor working through a limited company should be taxed as an employee. When a contract is inside IR35, the end client or agency must deduct income tax and employee National Insurance from payments, and pay employer NI on top. This significantly reduces the contractor\'s take-home pay.',
      'Outside IR35, the contractor pays themselves a low salary (typically the NI Primary Threshold of £12,570) and takes remaining profits as dividends. Dividends are taxed at lower rates: 8.75% basic, 33.75% higher and 39.35% additional, after a £500 dividend allowance. Corporation Tax at 25% (or 19% for small profits) is paid on company profits first.',
      'This calculator compares take-home pay inside and outside IR35 for a given contract rate. It shows the gross difference, accounting for corporation tax, dividend tax, employer NI, employee NI and income tax under both scenarios. The results help contractors understand the financial impact of IR35 status.',
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
      'This calculator helps you find the most tax-efficient mix of salary and dividends for limited company directors. The calculation follows official UK rules and rates for the 2025/26 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the Dividend vs Salary Calculator',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2025/26 rates from GOV.UK — Business tax',
      ],
    },
    sourceUrl: 'https://www.gov.uk/corporation-tax-rates',
    sourceName: 'GOV.UK — Business tax',
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
      'This calculator helps you compare VAT Flat Rate Scheme vs standard VAT for your business sector. See if you save or lose. The calculation follows official UK rules and rates for the 2025/26 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the VAT Flat Rate Scheme Calculator',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2025/26 rates from GOV.UK — Tax rates and allowances',
      ],
    },
    sourceUrl: 'https://www.gov.uk/income-tax-rates',
    sourceName: 'GOV.UK — Tax rates and allowances',
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
      'This calculator helps you see what money was worth in the past or what it will be worth in the future with UK inflation rates. The calculation follows official UK rules and rates for the 2025/26 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the Inflation Calculator',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2025/26 rates from GOV.UK',
      ],
    },
    sourceUrl: 'https://www.gov.uk',
    sourceName: 'GOV.UK',
    lastUpdated: 'April 2026',
  },
  'wedding-budget-calculator': {
    howItWorks: [
      'The average UK wedding in 2025 costs between £18,000 and £22,000. The biggest expenses are typically the venue (30–40%), catering (20–25%), photography and videography (8–10%), entertainment (5–8%) and the wedding dress (5–7%). However, costs vary enormously by region, with London weddings costing 40–60% more than the national average.',
      'This calculator helps you allocate your total budget across standard categories using recommended percentage splits. You can adjust each category to match your priorities — for example, spending more on food and less on flowers.',
      'Hidden costs often catch couples out: service charges, corkage fees, overtime charges for evening suppliers, and VAT (which may not be included in quoted prices). The calculator includes a contingency percentage (typically 5–10%) to cover unexpected expenses.',
    ],
    example: {
      title: 'Example: £20,000 wedding budget',
      steps: [
        'Venue hire: £6,000 (30%)',
        'Catering (80 guests): £4,400 (22%)',
        'Photography and video: £1,800 (9%)',
        'Entertainment / DJ: £1,000 (5%)',
        'Remaining (dress, flowers, cake, rings, stationery, transport, contingency): £6,800 (34%)',
      ],
    },
    sourceUrl: 'https://www.moneyhelper.org.uk/en/family-and-care/becoming-a-couple/planning-a-wedding-on-a-budget',
    sourceName: 'MoneyHelper — Planning a wedding on a budget',
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
      'This calculator helps you calculate HMRC approved mileage allowance payments for car, motorcycle or bicycle. 45p/25p per mile rates. The calculation follows official UK rules and rates for the 2025/26 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the Mileage Allowance Calculator (HMRC)',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2025/26 rates from GOV.UK — Employment and pay',
      ],
    },
    sourceUrl: 'https://www.gov.uk/national-minimum-wage-rates',
    sourceName: 'GOV.UK — Employment and pay',
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
      'This calculator helps you calculate how long to reach your savings goal or how much to save monthly to hit a target date. The calculation follows official UK rules and rates for the 2025/26 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the Savings Goal Calculator',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2025/26 rates from GOV.UK — Savings and ISAs',
      ],
    },
    sourceUrl: 'https://www.gov.uk/individual-savings-accounts',
    sourceName: 'GOV.UK — Savings and ISAs',
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
      'This calculator helps you calculate the break-even point in units and revenue. Find your contribution margin. The calculation follows official UK rules and rates for the 2025/26 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the Break-Even Calculator',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2025/26 rates from GOV.UK — Business tax',
      ],
    },
    sourceUrl: 'https://www.gov.uk/corporation-tax-rates',
    sourceName: 'GOV.UK — Business tax',
    lastUpdated: 'April 2026',
  },
  'margin-calculator': {
    howItWorks: [
      'This calculator helps you calculate profit margin, markup percentage and selling price from cost and revenue. The calculation follows official UK rules and rates for the 2025/26 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the Profit Margin & Markup Calculator',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2025/26 rates from GOV.UK — Business tax',
      ],
    },
    sourceUrl: 'https://www.gov.uk/corporation-tax-rates',
    sourceName: 'GOV.UK — Business tax',
    lastUpdated: 'April 2026',
  },
  'depreciation-calculator': {
    howItWorks: [
      'This calculator helps you calculate asset depreciation using straight-line or reducing balance methods with a year-by-year schedule. The calculation follows official UK rules and rates for the 2025/26 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the Depreciation Calculator',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2025/26 rates from GOV.UK — Business tax',
      ],
    },
    sourceUrl: 'https://www.gov.uk/corporation-tax-rates',
    sourceName: 'GOV.UK — Business tax',
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
      'Scottish LBTT residential bands for 2025/26 are: 0% up to £145,000, 2% from £145,001 to £250,000, 5% from £250,001 to £325,000, 10% from £325,001 to £750,000 and 12% above £750,000. Welsh LTT bands are: 0% up to £225,000, 6% from £225,001 to £400,000, 7.5% from £400,001 to £750,000, 10% from £750,001 to £1.5m and 12% above £1.5m.',
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
      'This calculator works out your landlord tax liability for the 2025/26 tax year. Enter your rental income, expenses, mortgage interest and other income to see the tax due, the effect of the finance cost restriction and your effective tax rate on rental profits.',
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
      'Statutory Sick Pay (SSP) is paid by your employer when you are too ill to work. For 2025/26, the rate is £116.75 per week. To qualify, you must be an employee, have been ill for at least 4 consecutive days (including non-working days), earn at least £125 per week on average (the Lower Earnings Limit) and have notified your employer within their deadline.',
      'The first 3 qualifying days of illness are "waiting days" and no SSP is paid. SSP starts on the 4th qualifying day and can continue for up to 28 weeks. Qualifying days are the days you would normally work — if you work Monday to Friday, only those count. SSP is taxable and subject to NI deductions.',
      'Some employers offer contractual sick pay that exceeds SSP. This calculator shows the SSP entitlement based on your qualifying days and pay period, and compares it with your normal earnings so you can see the shortfall. It also checks your eligibility based on average weekly earnings.',
    ],
    example: {
      title: 'Example: 2 weeks off sick, Monday-Friday worker',
      steps: [
        'Total days ill: 14 (including weekends)',
        'Qualifying days (Mon-Fri): 10',
        'Less 3 waiting days: 7 qualifying days of SSP',
        'SSP per qualifying day: £116.75 ÷ 5 = £23.35',
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
      'This calculator helps you calculate how long your pension pot will last with drawdown. See year-by-year projections with growth. The calculation follows official UK rules and rates for the 2025/26 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the Pension Drawdown Calculator',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2025/26 rates from GOV.UK — Pension rules',
      ],
    },
    sourceUrl: 'https://www.gov.uk/tax-on-your-private-pension',
    sourceName: 'GOV.UK — Pension rules',
    lastUpdated: 'April 2026',
  },
  'annuity-calculator': {
    howItWorks: [
      'This calculator helps you estimate annuity income from your pension pot. Compare single and joint life annuity rates by age. The calculation follows official UK rules and rates for the 2025/26 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the Annuity Calculator — Retirement Income',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2025/26 rates from GOV.UK — Pension rules',
      ],
    },
    sourceUrl: 'https://www.gov.uk/tax-on-your-private-pension',
    sourceName: 'GOV.UK — Pension rules',
    lastUpdated: 'April 2026',
  },
  'pension-vs-isa-calculator': {
    howItWorks: [
      'This calculator helps you compare pension and ISA over time. See which gives you more after tax relief and withdrawal tax. The calculation follows official UK rules and rates for the 2025/26 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the Pension vs ISA Calculator',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2025/26 rates from GOV.UK — Pension rules',
      ],
    },
    sourceUrl: 'https://www.gov.uk/tax-on-your-private-pension',
    sourceName: 'GOV.UK — Pension rules',
    lastUpdated: 'April 2026',
  },
  'lifetime-isa-calculator': {
    howItWorks: [
      'This calculator helps you calculate LISA growth with the 25% government bonus. For first homes (up to £450K) or retirement (60+). The calculation follows official UK rules and rates for the 2025/26 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the Lifetime ISA Calculator',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2025/26 rates from GOV.UK — Savings and ISAs',
      ],
    },
    sourceUrl: 'https://www.gov.uk/individual-savings-accounts',
    sourceName: 'GOV.UK — Savings and ISAs',
    lastUpdated: 'April 2026',
  },
  'premium-bonds-calculator': {
    howItWorks: [
      'This calculator helps you calculate expected returns and prize odds for NS&I Premium Bonds based on your holding. The calculation follows official UK rules and rates for the 2025/26 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the Premium Bonds Calculator',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2025/26 rates from GOV.UK — Savings and ISAs',
      ],
    },
    sourceUrl: 'https://www.gov.uk/individual-savings-accounts',
    sourceName: 'GOV.UK — Savings and ISAs',
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
      'Statutory Paternity Pay (SPP) is paid for up to 2 weeks at the lower of £187.18 per week or 90% of your average weekly earnings for 2025/26. From April 2024, the two weeks can be taken as two separate one-week blocks at any time within 52 weeks of the birth or adoption placement, rather than consecutively.',
      'To qualify, you must be the biological father, the mother\'s spouse or partner, or the intended parent in a surrogacy arrangement. You must have worked continuously for your employer for at least 26 weeks by the 15th week before the expected week of childbirth and earn at least £125 per week on average.',
      'SPP is subject to tax and National Insurance like normal earnings. Your employer can reclaim 92% of SPP from HMRC (or 103% for small employers). This calculator shows your weekly SPP amount and the net pay after deductions, plus a comparison with your normal weekly earnings.',
    ],
    example: {
      title: 'Example: Employee earning £35,000/year',
      steps: [
        'Average weekly earnings: £35,000 ÷ 52 = £673.08',
        '90% of AWE: £605.77 — exceeds £187.18 cap',
        'SPP rate: £187.18/week (the lower amount)',
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
      'This calculator helps you calculate your VAT return — output VAT on sales vs input VAT on purchases. See amount due or refund. The calculation follows official UK rules and rates for the 2025/26 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the VAT Return Calculator',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2025/26 rates from GOV.UK — Business tax',
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
    sourceName: 'HMRC — PAYE rates and thresholds 2025/26',
    lastUpdated: 'April 2026',
  },
  'late-payment-interest-calculator': {
    howItWorks: [
      'This calculator helps you calculate statutory interest and compensation on overdue commercial invoices under UK law. The calculation follows official UK rules and rates for the 2025/26 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the Late Payment Interest Calculator',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2025/26 rates from GOV.UK — Business tax',
      ],
    },
    sourceUrl: 'https://www.gov.uk/corporation-tax-rates',
    sourceName: 'GOV.UK — Business tax',
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
      'NHS pay in England is structured under the Agenda for Change (AfC) framework, which groups roles into nine pay bands. Each band has multiple pay points (incremental steps) that staff progress through annually based on length of service. For 2025/26, Band 5 (newly qualified nurses) starts at around £29,970 rising to £36,483.',
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
      'All vehicles in the UK over 3 years old must have a valid MOT certificate. The MOT test checks roadworthiness including brakes, lights, steering, suspension, tyres, exhaust emissions and bodywork. The maximum fee is set by the DVSA at £54.85 for a standard car (2025/26). Many garages charge less as a loss leader.',
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
      'The total cost of a UK degree extends well beyond tuition fees. For a three-year course starting in 2025/26, tuition alone is £9,535 per year (£28,605 total). Accommodation ranges from £4,500 to £9,500 per year depending on city and type. Living costs (food, transport, social, course materials) add £5,000\u2013£8,000 per year.',
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
      'Greenhouse size depends on what you want to grow and how intensively you garden. A small greenhouse (6 \u00D7 4 ft / 1.8 \u00D7 1.2 m) suits seed starting and a few tomato plants. A medium greenhouse (8 \u00D7 6 ft / 2.4 \u00D7 1.8 m) allows year-round growing with staging for potting. A large greenhouse (10 \u00D7 8 ft or bigger) supports a full range of crops, propagation and overwintering.',
      'This calculator helps you choose the right size based on what you plan to grow. Tomatoes and cucumbers need roughly 0.5 m\u00B2 per plant (cordon-trained). Staging and paths typically occupy 30\u201340% of the floor area, so the usable growing space is smaller than the footprint. Allow at least a 600 mm path down the centre.',
      'Enter your desired crops and quantities. The calculator suggests a greenhouse footprint and checks it fits your available garden space. It also estimates heating costs if you want to keep the greenhouse frost-free through winter (typically £100\u2013£300 per year for electric heating in a 6 \u00D7 8 ft greenhouse, depending on insulation).',
    ],
    example: {
      title: 'Example: 12 tomato plants, 4 cucumber, seed trays, potting bench',
      steps: [
        'Tomatoes: 12 \u00D7 0.5 m\u00B2 = 6.0 m\u00B2 growing space',
        'Cucumbers: 4 \u00D7 0.5 m\u00B2 = 2.0 m\u00B2',
        'Staging for seeds and potting: 2.0 m\u00B2',
        'Path (30%): 3.3 m\u00B2',
        'Total footprint: ~13.3 m\u00B2 \u2014 suggests 10 \u00D7 8 ft (2.4 \u00D7 3.0 m)',
      ],
    },
    sourceUrl: 'https://www.rhs.org.uk/garden-features/greenhouses',
    sourceName: 'RHS \u2014 Greenhouses',
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
      'Income from a side hustle is taxable if it exceeds the £1,000 trading allowance. Below this threshold, you do not need to declare it or register for Self Assessment. Above £1,000, you must register as self-employed with HMRC, file a Self Assessment tax return and pay income tax and Class 2 and Class 4 National Insurance on your profits.',
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
      'The compensatory award covers financial losses — loss of earnings, loss of pension contributions, loss of statutory rights and expenses. It is capped at the lower of 52 weeks\' pay or £115,115 (2025/26 figure). For discrimination claims, there is no cap on compensation and an award for injury to feelings (Vento bands) may apply.',
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
    howItWorks: [
      'Loan-to-Value (LTV) ratio is the percentage of the property value that you are borrowing. It is calculated as: LTV = (Mortgage amount ÷ Property value) × 100. A £180,000 mortgage on a £200,000 property gives a 90% LTV. The lower your LTV, the better mortgage rates you can access.',
      'UK lenders typically offer their best rates at 60% LTV, with competitive rates up to 75% LTV. Rates increase noticeably above 80% LTV, and again above 90%. The maximum LTV for most residential mortgages is 95%. For buy-to-let, the typical maximum is 75-80%. First-time buyer schemes may offer up to 95% LTV.',
      'This calculator works in both directions: enter a property value and deposit to see your LTV, or enter a target LTV to see what deposit you need. It also shows which LTV tier your deposit places you in and the typical rate difference between tiers.',
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
      'This calculator helps you compare salary sacrifice vs relief at source pension contributions. See tax and NI savings. The calculation follows official UK rules and rates for the 2025/26 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the Salary Sacrifice Pension Calculator',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2025/26 rates from GOV.UK — Pension rules',
      ],
    },
    sourceUrl: 'https://www.gov.uk/tax-on-your-private-pension',
    sourceName: 'GOV.UK — Pension rules',
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
      'For 2025/26, the largest share of tax goes to Health (around 20%), followed by Welfare (around 19%) and State Pensions (around 13%). The summary uses published Treasury data on departmental spending to calculate your personal share based on the total tax and NI you paid during the year.',
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
      'This calculator helps you calculate business rates from rateable value. Includes Small Business Rate Relief. The calculation follows official UK rules and rates for the 2025/26 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the Business Rates Calculator',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2025/26 rates from GOV.UK — Business tax',
      ],
    },
    sourceUrl: 'https://www.gov.uk/corporation-tax-rates',
    sourceName: 'GOV.UK — Business tax',
    lastUpdated: 'April 2026',
  },
  'rd-tax-credit-calculator': {
    howItWorks: [
      'This calculator helps you estimate R&D tax credits for profitable and loss-making companies under the merged RDEC scheme. The calculation follows official UK rules and rates for the 2025/26 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the R&D Tax Credit Calculator',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2025/26 rates from GOV.UK — Business tax',
      ],
    },
    sourceUrl: 'https://www.gov.uk/corporation-tax-rates',
    sourceName: 'GOV.UK — Business tax',
    lastUpdated: 'April 2026',
  },
  'cis-calculator': {
    howItWorks: [
      'This calculator helps you calculate CIS deductions on subcontractor invoices at 20%, 30% or gross payment status. The calculation follows official UK rules and rates for the 2025/26 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the CIS Subcontractor Tax Calculator',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2025/26 rates from GOV.UK — Business tax',
      ],
    },
    sourceUrl: 'https://www.gov.uk/corporation-tax-rates',
    sourceName: 'GOV.UK — Business tax',
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
      'The maintenance loan helps cover living costs while studying. For 2025/26, the maximum loan depends on where you live and study: up to £13,022 if living away from home in London, £9,978 if living away outside London and £8,400 if living with parents. Final-year students receive slightly less.',
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
      'This calculator helps you compare take-home pay as a sole trader vs limited company director. See full tax breakdown for both. The calculation follows official UK rules and rates for the 2025/26 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the Sole Trader vs Limited Company Calculator',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2025/26 rates from GOV.UK — Business tax',
      ],
    },
    sourceUrl: 'https://www.gov.uk/corporation-tax-rates',
    sourceName: 'GOV.UK — Business tax',
    lastUpdated: 'April 2026',
  },
  'pension-credit-calculator': {
    howItWorks: [
      'This calculator helps you estimate Pension Credit Guarantee Credit entitlement based on income, pension and savings. The calculation follows official UK rules and rates for the 2025/26 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the Pension Credit Calculator',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2025/26 rates from GOV.UK — Benefits',
      ],
    },
    sourceUrl: 'https://www.gov.uk/browse/benefits',
    sourceName: 'GOV.UK — Benefits',
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
      'This calculator helps you track your rolling 12-month turnover against the £90,000 VAT registration threshold. See headroom remaining. The calculation follows official UK rules and rates for the 2025/26 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the VAT Threshold Monitor',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2025/26 rates from GOV.UK — Business tax',
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
      'This calculator helps you calculate AIA, Full Expensing or Writing Down Allowance on business assets. See year-by-year tax relief. The calculation follows official UK rules and rates for the 2025/26 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the Capital Allowances Calculator',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2025/26 rates from GOV.UK — Business tax',
      ],
    },
    sourceUrl: 'https://www.gov.uk/corporation-tax-rates',
    sourceName: 'GOV.UK — Business tax',
    lastUpdated: 'April 2026',
  },
  'cash-flow-calculator': {
    howItWorks: [
      'This calculator helps you project monthly cash flow with income and expenses. See closing balance and lowest point. The calculation follows official UK rules and rates for the 2025/26 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the Cash Flow Calculator',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2025/26 rates from GOV.UK — Business tax',
      ],
    },
    sourceUrl: 'https://www.gov.uk/corporation-tax-rates',
    sourceName: 'GOV.UK — Business tax',
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
      'This calculator helps you calculate nominal and real (inflation-adjusted) investment returns with monthly contributions over time. The calculation follows official UK rules and rates for the 2025/26 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the Investment Return Calculator',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2025/26 rates from GOV.UK — Savings and ISAs',
      ],
    },
    sourceUrl: 'https://www.gov.uk/individual-savings-accounts',
    sourceName: 'GOV.UK — Savings and ISAs',
    lastUpdated: 'April 2026',
  },
  'savings-interest-tax-calculator': {
    howItWorks: [
      'This calculator helps you calculate tax on savings interest above your Personal Savings Allowance. See max tax-free savings. The calculation follows official UK rules and rates for the 2025/26 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the Savings Interest Tax Calculator',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2025/26 rates from GOV.UK — Savings and ISAs',
      ],
    },
    sourceUrl: 'https://www.gov.uk/individual-savings-accounts',
    sourceName: 'GOV.UK — Savings and ISAs',
    lastUpdated: 'April 2026',
  },
  'real-return-calculator': {
    howItWorks: [
      'This calculator helps you calculate the real return on investments after accounting for inflation. See purchasing power impact. The calculation follows official UK rules and rates for the 2025/26 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the Real Return Calculator (After Inflation)',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2025/26 rates from GOV.UK — Savings and ISAs',
      ],
    },
    sourceUrl: 'https://www.gov.uk/individual-savings-accounts',
    sourceName: 'GOV.UK — Savings and ISAs',
    lastUpdated: 'April 2026',
  },
  'rule-of-72-calculator': {
    howItWorks: [
      'This calculator helps you estimate how long it takes to double your money at a given interest rate using the Rule of 72. The calculation follows official UK rules and rates for the 2025/26 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the Rule of 72 Calculator',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2025/26 rates from GOV.UK — Savings and ISAs',
      ],
    },
    sourceUrl: 'https://www.gov.uk/individual-savings-accounts',
    sourceName: 'GOV.UK — Savings and ISAs',
    lastUpdated: 'April 2026',
  },
  'cost-of-delay-calculator': {
    howItWorks: [
      'This calculator helps you see how much you lose by waiting to invest. Compare starting now vs delaying by 1-10+ years. The calculation follows official UK rules and rates for the 2025/26 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the Cost of Delay Calculator',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2025/26 rates from GOV.UK — Savings and ISAs',
      ],
    },
    sourceUrl: 'https://www.gov.uk/individual-savings-accounts',
    sourceName: 'GOV.UK — Savings and ISAs',
    lastUpdated: 'April 2026',
  },
  'teacher-pay-calculator': {
    howItWorks: [
      'Teacher pay in England and Wales is set by the School Teachers\' Pay and Conditions Document (STPCD). The Main Pay Range (MPR) for classroom teachers in 2025/26 runs from M1 (approximately £31,650) to M6 (approximately £43,607) outside London. The Upper Pay Range (UPR) for experienced teachers runs from UPR1 to UPR3, topping out at approximately £49,084.',
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
      'Shared Parental Leave (SPL) allows eligible parents to share up to 50 weeks of leave and 37 weeks of pay following the birth or adoption of a child. The mother must end her maternity leave early by giving a "curtailment notice" to create the shared pool. The minimum maternity leave is 2 weeks (4 weeks for factory workers).',
      'Leave can be taken by one parent at a time or both simultaneously. It can be taken in continuous blocks (which the employer must approve) or discontinuous blocks (which the employer can refuse). Each parent can give up to three "period of leave" notices. The leave must be taken before the child\'s first birthday or within one year of adoption placement.',
      'This calculator helps you plan your leave schedule. Enter when the mother will end maternity leave and how you want to split the remaining entitlement. It generates a visual timeline showing each parent\'s leave periods, pay periods and returns to work.',
    ],
    example: {
      title: 'Example: Mother curtails maternity after 20 weeks',
      steps: [
        'Total maternity leave entitlement: 52 weeks',
        'Maternity leave taken: 20 weeks',
        'SPL available to share: 52 − 20 = 32 weeks of leave',
        'ShPP available: 39 − 20 = 19 weeks of pay',
        'Example split: Father 16 weeks leave (16 weeks paid), Mother 16 weeks (3 weeks paid)',
      ],
    },
    sourceUrl: 'https://www.gov.uk/shared-parental-leave-and-pay',
    sourceName: 'GOV.UK — Shared Parental Leave and Pay',
    lastUpdated: 'April 2026',
  },
  'high-income-child-benefit-calculator': {
    howItWorks: [
      'The High Income Child Benefit Charge (HICBC) applies when either parent in a household has adjusted net income between £60,000 and £80,000. For every £200 of income above £60,000, 1% of the total Child Benefit received must be repaid through Self Assessment. At £80,000 or above, the charge equals 100% of the benefit.',
      'Child Benefit for 2025/26 is £26.05 per week for the eldest child and £17.25 per week for each subsequent child. For a two-child family, total annual benefit is £2,251.60. The charge is calculated on the higher earner\'s income, not combined household income.',
      'Parents can choose to keep receiving Child Benefit and pay the charge, or opt out of receiving payments. Claiming but opting out of payment protects the claimant\'s National Insurance record (which matters for State Pension). This calculator shows the net benefit after the charge is applied.',
    ],
    example: {
      title: 'Example: Income £70,000, two children',
      steps: [
        'Annual Child Benefit: £26.05 + £17.25 = £43.30/week = £2,251.60/year',
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
      'The benefit cap limits the total amount of benefits a working-age household can receive. For 2025/26 the cap is £22,020 per year (£423.46/week) for couples and single parents outside London, and £25,323 per year (£486.98/week) in Greater London. Single people without children are capped at £14,753 (£283.71/week) outside London or £16,967 (£326.29/week) in London.',
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
      'This calculator helps you calculate freelancer take-home pay from day rate. Includes tax, NI, expenses and VAT threshold warning. The calculation follows official UK rules and rates for the 2025/26 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the Freelance Tax Calculator',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2025/26 rates from GOV.UK — Employment and pay',
      ],
    },
    sourceUrl: 'https://www.gov.uk/national-minimum-wage-rates',
    sourceName: 'GOV.UK — Employment and pay',
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
      'This calculator helps you calculate total livestock units for cattle, sheep, pigs and horses. See land requirement at 2 SU/ha. The calculation follows official UK rules and rates for the 2025/26 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the Livestock Stock Unit Calculator',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2025/26 rates from Defra — Farming schemes',
      ],
    },
    sourceUrl: 'https://www.gov.uk/government/collections/environmental-land-management-schemes',
    sourceName: 'Defra — Farming schemes',
    lastUpdated: 'April 2026',
  },
  'agricultural-worker-wage-calculator': {
    howItWorks: [
      'Agricultural workers in England are covered by the Agricultural Wages Orders, which set minimum pay rates based on grade. The National Living Wage (for ages 21+) is currently £12.21 per hour and applies as a minimum for all agricultural workers. Some older Agricultural Wages Orders set higher rates for specialist grades.',
      'Workers are entitled to overtime, holiday pay (5.6 weeks per year), sick pay and accommodation offsets where housing is provided by the employer. In Wales, the Agricultural Advisory Panel for Wales sets separate minimum rates, and in Scotland, minimum rates are aligned with the National Minimum/Living Wage.',
      'This calculator works out weekly and monthly gross pay based on hours worked, grade and any overtime. It also calculates holiday pay entitlement and shows the employer\'s NI and pension auto-enrolment contributions on top of the gross wage.',
    ],
    example: {
      title: 'Example: Standard worker, 39 hours/week',
      steps: [
        'Hourly rate: £12.21 (National Living Wage)',
        'Weekly gross pay: 39 × £12.21 = £476.19',
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
      'Switching from a petrol or diesel car to an electric vehicle can save significant money on fuel, road tax and maintenance. Electricity is cheaper per mile than petrol: a typical EV costs 4-7p per mile to run on home charging versus 14-18p per mile for a petrol car. Road tax (VED) for EVs registered before April 2025 is £0, while those registered from April 2025 onwards pay the standard rate.',
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
      'Capital Gains Tax on residential property is charged at higher rates than other assets. For 2025/26, basic-rate taxpayers pay 18% on residential property gains, while higher and additional-rate taxpayers pay 24%. The annual exempt amount of £3,000 applies before these rates are calculated.',
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
      'This calculator helps you check your pension annual allowance (£60K), tapered allowance and MPAA. See if you face a tax charge. The calculation follows official UK rules and rates for the 2025/26 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the Pension Annual Allowance Calculator',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2025/26 rates from GOV.UK — Pension rules',
      ],
    },
    sourceUrl: 'https://www.gov.uk/tax-on-your-private-pension',
    sourceName: 'GOV.UK — Pension rules',
    lastUpdated: 'April 2026',
  },
  'state-pension-age-calculator': {
    howItWorks: [
      'This calculator helps you find your State Pension age based on date of birth. See exact date and days remaining. The calculation follows official UK rules and rates for the 2025/26 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the State Pension Age Calculator',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2025/26 rates from GOV.UK — Pension rules',
      ],
    },
    sourceUrl: 'https://www.gov.uk/tax-on-your-private-pension',
    sourceName: 'GOV.UK — Pension rules',
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
      'This calculator helps you calculate the pension pot needed for your target retirement income using drawdown, 4% rule or annuity. The calculation follows official UK rules and rates for the 2025/26 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the How Much Pension Do I Need?',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2025/26 rates from GOV.UK — Pension rules',
      ],
    },
    sourceUrl: 'https://www.gov.uk/tax-on-your-private-pension',
    sourceName: 'GOV.UK — Pension rules',
    lastUpdated: 'April 2026',
  },
  'junior-isa-calculator': {
    howItWorks: [
      'This calculator helps you calculate how much a Junior ISA will be worth when your child turns 18. Tax-free growth with £9,000/year limit. The calculation follows official UK rules and rates for the 2025/26 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the Junior ISA Calculator',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2025/26 rates from GOV.UK — Savings and ISAs',
      ],
    },
    sourceUrl: 'https://www.gov.uk/individual-savings-accounts',
    sourceName: 'GOV.UK — Savings and ISAs',
    lastUpdated: 'April 2026',
  },
  'zero-hours-calculator': {
    howItWorks: [
      'Zero-hours contracts do not guarantee any minimum working hours, making income unpredictable. However, workers on these contracts still have statutory employment rights including the National Minimum Wage, paid annual leave (5.6 weeks pro rata based on hours worked), rest breaks and protection from discrimination.',
      'Holiday entitlement for zero-hours workers is calculated as 12.07% of hours worked, giving the equivalent of 5.6 weeks per year. This can be paid as rolled-up holiday pay (included in each pay packet) or accrued and taken as time off. The method must be clearly stated in the contract.',
      'This calculator estimates your annual earnings, holiday pay and statutory entitlements based on your average weekly hours and hourly rate. It also shows estimated tax and NI, and flags if your earnings fall below the NI Primary Threshold, meaning you would not build State Pension qualifying years.',
    ],
    example: {
      title: 'Example: Average 20 hours/week at £12.21/hour',
      steps: [
        'Weekly gross: 20 × £12.21 = £244.20',
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
      'Interest on student loans accrues from the day the loan is paid out, including while you are still studying. For Plan 2 loans, the rate is linked to RPI (Retail Prices Index) plus a margin of up to 3% depending on income. While studying, you are charged RPI + 3%. After graduation, the rate scales from RPI (income \u2264 £27,295) to RPI + 3% (income \u2265 £49,130).',
      'For Plan 5 loans (started from 2023/24), interest is capped at RPI only, with no additional income-based margin. This means Plan 5 borrowers pay lower interest than Plan 2 borrowers at the same income level.',
      'This calculator shows the interest accruing on your balance each month and year, based on your current balance, plan type and income. It also shows how much of your monthly repayment goes to interest versus reducing the principal. For many graduates, repayments do not cover the interest, and the balance grows until it is written off.',
    ],
    example: {
      title: 'Example: Plan 2, £45,000 balance, £35,000 salary, RPI 3.5%',
      steps: [
        'Interest rate: RPI + partial margin \u2248 4.2%',
        'Annual interest: £45,000 \u00D7 4.2% = £1,890',
        'Monthly repayment: (£35,000 \u2212 £27,295) \u00D7 9% \u00F7 12 = £57.79',
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
      'Postgraduate Master\'s loans of up to £12,471 (2025/26) are available for taught and research master\'s courses. Repayment is at 6% of income above £21,000. This is collected alongside any existing undergraduate loan repayment \u2014 the two are separate deductions, so you can end up paying 9% + 6% = 15% of income above the respective thresholds.',
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
      'Your total student finance package combines several elements: the tuition fee loan (up to £9,535 for 2025/26, paid directly to the university), the maintenance loan (means-tested, paid to you) and any grants or bursaries. Some students also qualify for Disabled Students\' Allowances or Childcare Grants.',
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
      'This calculator helps you calculate tax on company benefits — car, medical insurance, gym, phone and more. See monthly tax impact. The calculation follows official UK rules and rates for the 2025/26 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the Benefits in Kind (P11D) Calculator',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2025/26 rates from GOV.UK — Employment and pay',
      ],
    },
    sourceUrl: 'https://www.gov.uk/national-minimum-wage-rates',
    sourceName: 'GOV.UK — Employment and pay',
    lastUpdated: 'April 2026',
  },
  'regular-savings-calculator': {
    howItWorks: [
      'This calculator helps you calculate returns on a regular saver account with monthly deposits. See effective vs headline rate. The calculation follows official UK rules and rates for the 2025/26 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the Regular Savings Calculator',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2025/26 rates from GOV.UK — Savings and ISAs',
      ],
    },
    sourceUrl: 'https://www.gov.uk/individual-savings-accounts',
    sourceName: 'GOV.UK — Savings and ISAs',
    lastUpdated: 'April 2026',
  },
  'business-mileage-calculator': {
    howItWorks: [
      'This calculator helps you compare HMRC mileage allowance vs actual fuel costs. See if you profit or lose from the 45p/25p rates. The calculation follows official UK rules and rates for the 2025/26 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the Business Mileage Calculator',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2025/26 rates from GOV.UK — Employment and pay',
      ],
    },
    sourceUrl: 'https://www.gov.uk/national-minimum-wage-rates',
    sourceName: 'GOV.UK — Employment and pay',
    lastUpdated: 'April 2026',
  },
  'wealth-growth-calculator': {
    howItWorks: [
      'This calculator helps you project wealth growth over time with annual savings and compound returns. See milestones (£100K, £1M). The calculation follows official UK rules and rates for the 2025/26 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the Wealth Growth Projector',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2025/26 rates from GOV.UK — Savings and ISAs',
      ],
    },
    sourceUrl: 'https://www.gov.uk/individual-savings-accounts',
    sourceName: 'GOV.UK — Savings and ISAs',
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
      'This calculator helps you calculate annual dividend income and project portfolio growth with or without reinvestment (DRIP). The calculation follows official UK rules and rates for the 2025/26 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the Dividend Income Calculator',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2025/26 rates from GOV.UK — Savings and ISAs',
      ],
    },
    sourceUrl: 'https://www.gov.uk/individual-savings-accounts',
    sourceName: 'GOV.UK — Savings and ISAs',
    lastUpdated: 'April 2026',
  },
  'non-dom-tax-calculator': {
    howItWorks: [
      'From April 2025, the UK replaced the traditional remittance basis for non-domiciled individuals with a new four-year Foreign Income and Gains (FIG) regime. New UK residents can elect to pay no UK tax on foreign income and gains for their first four years of UK tax residency, provided they have not been UK resident in the previous ten years.',
      'After the four-year FIG window, all worldwide income and gains become fully taxable in the UK regardless of domicile status. Transitional provisions apply for existing non-doms: the Temporary Repatriation Facility allows previously unremitted income to be brought into the UK at a reduced rate of 12% in 2025/26 and 2026/27, then 15% in 2027/28.',
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
      'This calculator helps you calculate AIA tax relief on plant & machinery spending. 100% deduction on first £1M. The calculation follows official UK rules and rates for the 2025/26 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the Annual Investment Allowance Calculator',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2025/26 rates from GOV.UK — Business tax',
      ],
    },
    sourceUrl: 'https://www.gov.uk/corporation-tax-rates',
    sourceName: 'GOV.UK — Business tax',
    lastUpdated: 'April 2026',
  },
  'mortgage-interest-rate-calculator': {
    howItWorks: [
      'This calculator helps you compare monthly payments at different interest rates. See how rate changes affect your mortgage. The calculation follows official UK rules and rates for the 2025/26 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the Mortgage Interest Rate Comparison',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2025/26 rates from GOV.UK — Property and housing',
      ],
    },
    sourceUrl: 'https://www.gov.uk/stamp-duty-land-tax',
    sourceName: 'GOV.UK — Property and housing',
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
      'This calculator helps you project your Self-Invested Personal Pension with tax relief, employer contributions and growth. The calculation follows official UK rules and rates for the 2025/26 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the SIPP Calculator — Self-Invested Pension',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2025/26 rates from GOV.UK — Pension rules',
      ],
    },
    sourceUrl: 'https://www.gov.uk/tax-on-your-private-pension',
    sourceName: 'GOV.UK — Pension rules',
    lastUpdated: 'April 2026',
  },
  'tax-credits-calculator': {
    howItWorks: [
      'Tax Credits are legacy benefits being replaced by Universal Credit, but existing claimants can still receive Working Tax Credit (WTC) and Child Tax Credit (CTC). WTC is for people working a certain number of hours per week: at least 16 hours if you have a disability or are a single parent, or 30 hours otherwise. The basic element for 2025/26 is £2,435 per year.',
      'Child Tax Credit provides up to £3,455 per child (the child element) plus a family element of £545. Entitlement is reduced by 41% of household income above the threshold of £7,455 for those receiving both WTC and CTC, or £19,995 for CTC-only claimants.',
      'New claims for Tax Credits are no longer accepted in most areas. Existing claimants will be migrated to Universal Credit by the end of 2025/26. If you receive a migration notice, you may be eligible for transitional protection to ensure your income does not drop.',
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
      'This calculator helps you project Stocks & Shares ISA growth with capital appreciation and dividends. See tax saved vs taxable account. The calculation follows official UK rules and rates for the 2025/26 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the Stocks & Shares ISA Calculator',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2025/26 rates from GOV.UK — Savings and ISAs',
      ],
    },
    sourceUrl: 'https://www.gov.uk/individual-savings-accounts',
    sourceName: 'GOV.UK — Savings and ISAs',
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
      'This calculator helps you calculate Help to Save returns with the 50% government bonus. Max £50/month for 4 years. The calculation follows official UK rules and rates for the 2025/26 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the Help to Save Calculator',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2025/26 rates from GOV.UK — Savings and ISAs',
      ],
    },
    sourceUrl: 'https://www.gov.uk/individual-savings-accounts',
    sourceName: 'GOV.UK — Savings and ISAs',
    lastUpdated: 'April 2026',
  },
  'ns-i-savings-calculator': {
    howItWorks: [
      'This calculator helps you calculate savings interest with different compounding frequencies. See AER vs nominal rate. The calculation follows official UK rules and rates for the 2025/26 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the NS&I Savings Calculator',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2025/26 rates from GOV.UK — Savings and ISAs',
      ],
    },
    sourceUrl: 'https://www.gov.uk/individual-savings-accounts',
    sourceName: 'GOV.UK — Savings and ISAs',
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
      'This calculator helps you compare keeping multiple pension pots vs consolidating into one. See fee savings over time. The calculation follows official UK rules and rates for the 2025/26 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the Pension Consolidation Calculator',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2025/26 rates from GOV.UK — Pension rules',
      ],
    },
    sourceUrl: 'https://www.gov.uk/tax-on-your-private-pension',
    sourceName: 'GOV.UK — Pension rules',
    lastUpdated: 'April 2026',
  },
  'employer-pension-contribution-calculator': {
    howItWorks: [
      'This calculator helps you calculate auto-enrolment pension contributions on qualifying earnings with tax relief. The calculation follows official UK rules and rates for the 2025/26 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the Employer Pension Contribution Calculator',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2025/26 rates from GOV.UK — Pension rules',
      ],
    },
    sourceUrl: 'https://www.gov.uk/tax-on-your-private-pension',
    sourceName: 'GOV.UK — Pension rules',
    lastUpdated: 'April 2026',
  },
  'right-to-buy-calculator': {
    howItWorks: [
      'Right to Buy allows eligible council tenants in England to buy their home at a discount. The discount depends on the property type and length of tenancy. For houses, the discount starts at 35% after 3 years of tenancy and increases by 1% per additional year up to a maximum of 70%. For flats, the discount starts at 50% and increases by 2% per year up to 70%.',
      'Maximum discount caps are set annually: for 2025/26 this is £96,000 in London and £127,900 outside London. If you sell the property within 5 years, you must repay some or all of the discount on a sliding scale. Former council tenants can also use the Preserved Right to Buy if their home was transferred to a housing association.',
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
      'This calculator helps you compare taking 0-100% as lump sum. See tax-free portion, tax on excess and remaining pot for drawdown. The calculation follows official UK rules and rates for the 2025/26 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the Pension Lump Sum Calculator (PCLS)',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2025/26 rates from GOV.UK — Pension rules',
      ],
    },
    sourceUrl: 'https://www.gov.uk/tax-on-your-private-pension',
    sourceName: 'GOV.UK — Pension rules',
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
      'An EV salary sacrifice scheme lets you lease an electric car through your employer, paying from your gross salary before tax and National Insurance. The Benefit in Kind (BiK) rate for pure electric vehicles is just 2% for 2024/25, rising to 3% for 2025/26 and 4% for 2026/27. This makes salary sacrifice one of the cheapest ways to drive a new EV.',
      'The saving works because you avoid income tax and NI on the sacrificed salary, and the BiK tax on the EV is minimal. A higher-rate taxpayer can save 40-50% compared to leasing the same car personally. The scheme typically includes insurance, maintenance, breakdown cover and tyres in one monthly payment.',
      'This calculator compares the net cost of leasing an EV through salary sacrifice versus a personal lease or PCP deal. It shows the BiK tax payable, the tax and NI savings, and the effective monthly cost. Most schemes require a minimum contract of 2-4 years.',
    ],
    example: {
      title: 'Example: £45,000 salary, Tesla Model 3, £450/month lease',
      steps: [
        'Monthly salary sacrifice: £450 (from gross pay)',
        'P11D value: £42,000',
        'BiK at 3% (2025/26): £42,000 x 3% = £1,260/year',
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
      'This calculator helps you log business trips with dates and mileage. Calculate HMRC mileage allowance claim automatically. The calculation follows official UK rules and rates for the 2025/26 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the Business Mileage Log Calculator',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2025/26 rates from GOV.UK — Business tax',
      ],
    },
    sourceUrl: 'https://www.gov.uk/corporation-tax-rates',
    sourceName: 'GOV.UK — Business tax',
    lastUpdated: 'April 2026',
  },
  'pension-sharing-divorce-calculator': {
    howItWorks: [
      'This calculator helps you calculate pension division in divorce. Compare sharing orders with different splits. The calculation follows official UK rules and rates for the 2025/26 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the Pension Sharing on Divorce Calculator',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2025/26 rates from GOV.UK — Pension rules',
      ],
    },
    sourceUrl: 'https://www.gov.uk/tax-on-your-private-pension',
    sourceName: 'GOV.UK — Pension rules',
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
      'This calculator helps you score your Making Tax Digital readiness across 10 key criteria. See what you still need to do. The calculation follows official UK rules and rates for the 2025/26 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the MTD Readiness Checklist',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2025/26 rates from GOV.UK — Business tax',
      ],
    },
    sourceUrl: 'https://www.gov.uk/corporation-tax-rates',
    sourceName: 'GOV.UK — Business tax',
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
      'Plan 4 applies to students who took out loans from the Student Awards Agency for Scotland (SAAS) or who started undergraduate courses in England or Wales before September 2012 and now live in Scotland. The repayment threshold for 2025/26 is £31,395 \u2014 the highest of all UK plan types.',
      'You repay 9% of everything you earn above £31,395. The interest rate on Plan 4 is the lower of RPI or the Bank of England base rate plus 1%. Plan 4 loans are written off when you turn 65 (or 25 years after the April you were first eligible to repay, whichever comes first).',
      'Enter your salary to see monthly and annual repayments. If you are on Plan 4 plus a Postgraduate Loan, both are deducted separately. The higher threshold means Scottish graduates repay less per month than English graduates on the same salary.',
    ],
    example: {
      title: 'Example: £40,000 salary, Plan 4',
      steps: [
        'Income above threshold: £40,000 \u2212 £31,395 = £8,605',
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
    sourceName: 'HMRC — Employer NI rates and thresholds 2025/26',
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
      'Council tax bands in England are based on property values as of 1 April 1991, and many properties are in the wrong band. The Valuation Office Agency (VOA) estimated that up to 400,000 homes may be incorrectly banded. If your property is in too high a band, you could be paying hundreds of pounds more than you should each year.',
      'You can check your band by comparing your property\'s estimated 1991 value against the band thresholds: Band A (up to £40,000), Band B (£40,001-£52,000), Band C (£52,001-£68,000), Band D (£68,001-£88,000), Band E (£88,001-£120,000), Band F (£120,001-£160,000), Band G (£160,001-£320,000), Band H (over £320,000).',
      'You can challenge your band for free by contacting the VOA. Compare recent sale prices of similar neighbouring properties and estimate the 1991 equivalent. This calculator helps you assess whether a challenge is likely to succeed and estimates the potential annual saving from moving to a lower band.',
    ],
    example: {
      title: 'Example: Property currently in Band D, should be Band C',
      steps: [
        'Current Band D council tax: £2,100/year',
        'Band C rate (8/9 of Band D): £1,866.67/year',
        'Annual saving if rebanded: £233.33',
        'Potential backdated refund (up to 6 years): ~£1,400',
        'Cost to challenge: Free (apply to VOA)',
      ],
    },
    sourceUrl: 'https://www.gov.uk/council-tax-bands',
    sourceName: 'GOV.UK — Council Tax bands',
    lastUpdated: 'April 2026',
  },

  /* ──────────────────────────────────────────────────────────────
     INSURANCE
     ────────────────────────────────────────────────────────────── */
  'sole-trader-vs-ltd-comparison-calculator': {
    howItWorks: [
      'This calculator helps you side-by-side take-home pay comparison at 7 different profit levels (£20K-£100K). The calculation follows official UK rules and rates for the 2025/26 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the Sole Trader vs Ltd Comparison Table',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2025/26 rates from GOV.UK — Business tax',
      ],
    },
    sourceUrl: 'https://www.gov.uk/corporation-tax-rates',
    sourceName: 'GOV.UK — Business tax',
    lastUpdated: 'April 2026',
  },
  'apprenticeship-levy-calculator': {
    howItWorks: [
      'This calculator helps you calculate apprenticeship levy at 0.5% of pay bill over £3M. See government top-up and total training fund. The calculation follows official UK rules and rates for the 2025/26 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the Apprenticeship Levy Calculator',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2025/26 rates from GOV.UK — Business tax',
      ],
    },
    sourceUrl: 'https://www.gov.uk/corporation-tax-rates',
    sourceName: 'GOV.UK — Business tax',
    lastUpdated: 'April 2026',
  },
  'shared-parental-pay-calculator': {
    howItWorks: [
      'Shared Parental Pay (ShPP) allows eligible parents to share up to 37 weeks of statutory pay between them after the birth or adoption of a child. The mother must curtail her maternity leave and pay to create the shared entitlement. ShPP is paid at £187.18 per week or 90% of average weekly earnings, whichever is lower, for 2025/26.',
      'The total shared entitlement is calculated by subtracting the weeks of maternity pay already taken from 39 weeks. For example, if the mother takes 10 weeks of maternity pay, 29 weeks of ShPP are available to share. Both parents must meet eligibility criteria — the person taking ShPP must have 26 weeks\' continuous employment and the other parent must have worked for at least 26 weeks in the 66 weeks before the due date.',
      'ShPP can be taken in blocks with gaps between them, allowing parents to alternate caring responsibilities. Each parent can submit up to three notices of entitlement. This calculator models different sharing scenarios and shows the pay each parent receives.',
    ],
    example: {
      title: 'Example: Mother takes 12 weeks maternity, then shares',
      steps: [
        'Mother\'s SMP: 6 weeks at 90% + 6 weeks at £187.18 = £4,363.08',
        'Remaining ShPP weeks: 39 − 12 = 27 weeks available',
        'Father takes 15 weeks ShPP: 15 × £187.18 = £2,807.70',
        'Mother takes 12 weeks ShPP: 12 × £187.18 = £2,246.16',
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
    howItWorks: [
      'The UK sets minimum hourly pay rates that vary by age. From April 2025, the National Living Wage for workers aged 21 and over is £12.21 per hour. The National Minimum Wage is £10.00 for 18-20 year olds, £7.55 for under-18s, and £7.55 for apprentices in their first year or under 19.',
      'These rates are statutory minimums — employers must pay at least these amounts for every hour worked. Hours include time spent working, on-call at the workplace, travelling as part of the job and training. Sleep-in shifts and travel between home and a fixed workplace are generally excluded.',
      'This calculator checks whether your current pay meets the legal minimum based on your age, hours worked and pay received. It also shows what your annual and monthly income should be at the minimum rate, helping you verify your payslips are correct.',
    ],
    example: {
      title: 'Example: 23-year-old working 40 hours/week',
      steps: [
        'National Living Wage (21+): £12.21/hour',
        'Weekly minimum pay: £12.21 × 40 = £488.40',
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
      'This calculator helps you calculate profit margin and markup on jobs. Add VAT and generate invoice total. The calculation follows official UK rules and rates for the 2025/26 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the Invoice & Job Profit Calculator',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2025/26 rates from GOV.UK — Business tax',
      ],
    },
    sourceUrl: 'https://www.gov.uk/corporation-tax-rates',
    sourceName: 'GOV.UK — Business tax',
    lastUpdated: 'April 2026',
  },
  'employee-vs-contractor-calculator': {
    howItWorks: [
      'This calculator helps you compare take-home pay as an employee vs contractor for the same total cost to the hiring company. The calculation follows official UK rules and rates for the 2025/26 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the Employee vs Contractor Calculator',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2025/26 rates from GOV.UK — Business tax',
      ],
    },
    sourceUrl: 'https://www.gov.uk/corporation-tax-rates',
    sourceName: 'GOV.UK — Business tax',
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
      'The full cost of an employee includes far more than their headline salary. Mandatory costs include employer National Insurance (15% above £5,000 for 2025/26), workplace pension (minimum 3% of qualifying earnings) and employer\'s liability insurance. These statutory requirements add approximately 18-20% on top of the gross salary.',
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
    sourceName: 'HMRC — Rates and thresholds for employers 2025/26',
    lastUpdated: 'April 2026',
  },
  'contractor-vs-perm-calculator': {
    howItWorks: [
      'This calculator helps you compare contractor day rate vs permanent salary. See the premium needed to match perm benefits. The calculation follows official UK rules and rates for the 2025/26 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the Contractor vs Permanent Salary Calculator',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2025/26 rates from GOV.UK — Business tax',
      ],
    },
    sourceUrl: 'https://www.gov.uk/corporation-tax-rates',
    sourceName: 'GOV.UK — Business tax',
    lastUpdated: 'April 2026',
  },
  'postgraduate-loan-cost-calculator': {
    howItWorks: [
      'This calculator projects the total lifetime cost of your postgraduate loan, including interest, over the 30-year repayment period. It models your salary trajectory and calculates annual repayments at 6% of income above £21,000, while interest accrues at RPI on the remaining balance.',
      'Because the repayment threshold is lower than for undergraduate loans (£21,000 versus £27,295 for Plan 2), postgraduate loan repayments begin at a lower salary. However, the 6% rate means each monthly payment is smaller. Whether you repay in full or have the balance written off depends on your career earnings.',
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
      'This calculator helps you build a simple P&L statement. Enter revenue, COGS and overheads to see gross and net profit margins. The calculation follows official UK rules and rates for the 2025/26 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the Profit & Loss Calculator',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2025/26 rates from GOV.UK — Business tax',
      ],
    },
    sourceUrl: 'https://www.gov.uk/corporation-tax-rates',
    sourceName: 'GOV.UK — Business tax',
    lastUpdated: 'April 2026',
  },
  'freelance-quote-calculator': {
    howItWorks: [
      'This calculator helps you build a quote from hourly rate, hours and materials. Add profit margin and VAT. The calculation follows official UK rules and rates for the 2025/26 financial year, using data sourced directly from government publications.',
      'All inputs are processed entirely in your browser — no data is sent to a server. You can adjust the figures as many times as you need to explore different scenarios. The results update instantly as you type.',
    ],
    example: {
      title: 'How to use the Freelance Quote Calculator',
      steps: [
        'Enter your details in the input fields above',
        'The calculator applies current UK rates and thresholds automatically',
        'Results update in real time — adjust any figure to explore scenarios',
        'All calculations use official 2025/26 rates from GOV.UK — Business tax',
      ],
    },
    sourceUrl: 'https://www.gov.uk/corporation-tax-rates',
    sourceName: 'GOV.UK — Business tax',
    lastUpdated: 'April 2026',
  },
}
