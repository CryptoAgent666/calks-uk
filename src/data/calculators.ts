import type { CalculatorMeta } from './types'

export const CALCULATORS: CalculatorMeta[] = [
  // ========================================
  // TAX & HMRC
  // ========================================
  {
    slug: 'income-tax-calculator',
    title: 'Income Tax Calculator',
    description: 'Calculate your UK income tax for the 2026/27 tax year. See your Personal Allowance, Basic Rate, Higher Rate and Additional Rate tax breakdown.',
    category: 'tax',
    icon: 'Receipt',
    keywords: ['income tax', 'tax calculator', 'HMRC', 'personal allowance', 'tax bands', 'tax brackets'],
    priority: 1,
    financialYear: '2026-27',
    metaTitle: 'UK Income Tax Calculator 2026/27 — Free HMRC Calculator',
  },
  {
    slug: 'scottish-income-tax-calculator',
    title: 'Scottish Income Tax Calculator',
    description: 'Calculate Scottish income tax with all 6 bands: Starter, Basic, Intermediate, Higher, Advanced and Top rate for 2026/27.',
    category: 'tax',
    icon: 'Receipt',
    keywords: ['scottish tax', 'scotland income tax', 'scottish tax bands', 'scottish rates'],
    metaTitle: 'Scottish Income Tax Calculator 2026/27 — 6 Bands',
    priority: 1,
    financialYear: '2026-27',
  },
  {
    slug: 'national-insurance-calculator',
    title: 'National Insurance Calculator',
    description: 'Calculate your Class 1 National Insurance contributions as an employee for the 2026/27 tax year.',
    category: 'tax',
    icon: 'Receipt',
    keywords: ['national insurance', 'NI', 'NIC', 'class 1', 'employee NI'],
    priority: 1,
    financialYear: '2026-27',
    metaTitle: 'National Insurance Calculator 2026/27 — UK NI Contributions',
  },
  {
    slug: 'employer-ni-calculator',
    title: 'Employer National Insurance Calculator',
    description: 'Calculate employer NI contributions at the new 15% rate from April 2025, with the reduced £5,000 secondary threshold.',
    category: 'tax',
    icon: 'Receipt',
    keywords: ['employer NI', 'employer national insurance', 'secondary threshold', 'employer contributions'],
    metaTitle: 'UK Employer NI Calculator 2026/27 — 15% Rate',
    priority: 1,
    financialYear: '2026-27',
    isTrending: true,
  },
  {
    slug: 'vat-calculator',
    title: 'VAT Calculator',
    description: 'Add or remove VAT at 20%, 5% or 0%. Calculate VAT-inclusive and VAT-exclusive amounts instantly.',
    category: 'tax',
    icon: 'Receipt',
    keywords: ['VAT', 'value added tax', 'VAT calculator', '20%', 'reverse VAT', 'add VAT', 'remove VAT'],
    priority: 1,
    metaTitle: 'UK VAT Calculator — Add or Remove VAT at 20%',
  },
  {
    slug: 'stamp-duty-calculator',
    title: 'Stamp Duty Calculator (SDLT)',
    description: 'Calculate Stamp Duty Land Tax on property purchases in England and Northern Ireland. Updated for April 2025 threshold changes.',
    category: 'tax',
    icon: 'Receipt',
    keywords: ['stamp duty', 'SDLT', 'stamp duty land tax', 'property tax', 'house purchase tax'],
    priority: 1,
    financialYear: '2026-27',
    metaTitle: 'Stamp Duty Calculator 2026/27 — UK SDLT (England & NI)',
    isTrending: true,
  },
  {
    slug: 'stamp-duty-first-time-buyer-calculator',
    title: 'Stamp Duty First-Time Buyer Calculator',
    description: 'Calculate stamp duty relief for first-time buyers in England and Northern Ireland. Updated April 2025.',
    category: 'tax',
    icon: 'Receipt',
    keywords: ['first time buyer', 'stamp duty relief', 'FTB', 'first home'],
    metaTitle: 'First-Time Buyer Stamp Duty Calculator 2026',
    priority: 2,
    financialYear: '2026-27',
  },
  {
    slug: 'self-assessment-tax-calculator',
    title: 'Self-Assessment Tax Calculator',
    description: 'Calculate your Self Assessment tax bill for 2026/27. Income tax + Class 4 NI (6%/2%). Class 2 abolished. Payments on Account if bill exceeds £1,000.',
    category: 'tax',
    icon: 'Receipt',
    keywords: ['self assessment', 'self employed tax', 'tax return', 'freelancer tax'],
    metaTitle: 'Self-Assessment Tax Calculator UK 2026/27 — Self-Employed Tax',
    priority: 1,
    financialYear: '2026-27',
  },
  {
    slug: 'capital-gains-tax-calculator',
    title: 'Capital Gains Tax Calculator',
    description: 'Calculate your Capital Gains Tax for 2026/27. £3,000 annual exempt amount, 18%/24% rates on all asset types (post Oct 2024 Budget unified rates).',
    category: 'tax',
    icon: 'Receipt',
    keywords: ['capital gains tax', 'CGT', 'shares tax', 'investment tax'],
    metaTitle: 'UK CGT Calculator 2026/27 — Capital Gains Tax 18%/24%',
    priority: 2,
    financialYear: '2026-27',
  },
  {
    slug: 'inheritance-tax-calculator',
    title: 'Inheritance Tax Calculator',
    description: 'Calculate UK Inheritance Tax for 2026/27. £325k nil-rate band + £175k residence nil-rate band, 40% above. Includes RNRB taper for estates over £2m.',
    category: 'tax',
    icon: 'Receipt',
    keywords: ['inheritance tax', 'IHT', 'estate tax', 'death tax', 'nil rate band'],
    metaTitle: 'Inheritance Tax Calculator UK 2026',
    priority: 2,
    financialYear: '2026-27',
  },
  {
    slug: 'corporation-tax-calculator',
    title: 'Corporation Tax Calculator',
    description: 'Calculate your UK Corporation Tax. 25% main rate over £250k, 19% small profits under £50k, marginal relief 3/200 between. Updated 2026/27.',
    category: 'tax',
    icon: 'Receipt',
    keywords: ['corporation tax', 'company tax', 'business tax', 'limited company'],
    metaTitle: 'Corporation Tax Calculator 2026/27',
    priority: 2,
    financialYear: '2026-27',
  },
  {
    slug: 'dividend-tax-calculator',
    title: 'Dividend Tax Calculator',
    description: 'Calculate UK dividend tax for 2026/27. £500 allowance + 8.75% basic, 33.75% higher, 39.35% additional rates. Free company director calculator.',
    category: 'tax',
    icon: 'Receipt',
    keywords: ['dividend tax', 'dividend allowance', 'dividend income'],
    metaTitle: 'Dividend Tax Calculator UK 2026/27 — 8.75%/33.75%/39.35%',
    priority: 2,
    financialYear: '2026-27',
  },
  {
    slug: 'council-tax-calculator',
    title: 'Council Tax Calculator',
    description: 'Estimate your council tax bill based on your property band and local authority. Includes single person discount.',
    category: 'tax',
    icon: 'Receipt',
    keywords: ['council tax', 'council tax bands', 'local authority tax'],
    metaTitle: 'Council Tax Calculator UK 2026/27 — All Bands A-H',
    priority: 2,
  },
  {
    slug: 'marriage-allowance-calculator',
    title: 'Marriage Allowance Calculator',
    description: 'Check if you can save up to £252 per year by transferring part of your Personal Allowance to your spouse or civil partner.',
    category: 'tax',
    icon: 'Receipt',
    keywords: ['marriage allowance', 'marriage tax', 'spouse allowance', 'transferable allowance'],
    metaTitle: 'Marriage Allowance Calculator UK 2026/27 (£252 Saving)',
    priority: 2,
    financialYear: '2026-27',
  },
  {
    slug: 'company-car-tax-calculator',
    title: 'Company Car Tax (BiK) Calculator',
    description: 'Calculate benefit-in-kind tax on your company car based on list price, CO2 emissions and fuel type.',
    category: 'tax',
    icon: 'Receipt',
    keywords: ['company car', 'BiK', 'benefit in kind', 'P11D', 'car tax'],
    metaTitle: 'Company Car Tax Calculator UK 2026/27 — BiK Tax + Fuel',
    priority: 2,
    financialYear: '2026-27',
  },
  {
    slug: 'crypto-tax-calculator',
    title: 'Crypto Tax Calculator UK',
    description: 'Calculate capital gains tax on cryptocurrency disposals including Bitcoin, Ethereum and other digital assets.',
    category: 'tax',
    icon: 'Receipt',
    keywords: ['crypto tax', 'bitcoin tax', 'cryptocurrency tax', 'digital assets'],
    metaTitle: 'UK Crypto Tax Calculator 2026/27 — CGT & Income',
    priority: 2,
    isTrending: true,
  },

  // ========================================
  // PAY & SALARY
  // ========================================
  {
    slug: 'take-home-pay-calculator',
    title: 'Take-Home Pay Calculator',
    description: 'Calculate your net pay after income tax, National Insurance and pension deductions. See weekly, monthly and annual take-home pay.',
    category: 'pay',
    icon: 'Banknote',
    keywords: ['take home pay', 'net pay', 'salary calculator', 'PAYE', 'after tax'],
    priority: 1,
    financialYear: '2026-27',
    metaTitle: 'UK Take-Home Pay Calculator 2026/27 — Salary After Tax',
  },
  {
    slug: 'hourly-to-salary-calculator',
    title: 'Hourly to Annual Salary Calculator',
    description: 'Convert your hourly rate to an annual salary, or find out what your salary works out to per hour.',
    category: 'pay',
    icon: 'Banknote',
    keywords: ['hourly rate', 'annual salary', 'salary conversion', 'hourly to annual'],
    metaTitle: 'Hourly to Salary Calculator UK 2026 — Annual Pay Converter',
    priority: 2,
  },
  {
    slug: 'holiday-entitlement-calculator',
    title: 'Holiday Entitlement Calculator',
    description: 'Calculate statutory holiday entitlement for full-time, part-time and irregular hours workers. UK minimum is 5.6 weeks (28 days).',
    category: 'pay',
    icon: 'Banknote',
    keywords: ['holiday entitlement', 'annual leave', 'holiday calculator', 'statutory leave'],
    metaTitle: 'UK Holiday Entitlement Calculator 2026 — Statutory 28 Days',
    priority: 2,
  },
  {
    slug: 'redundancy-pay-calculator',
    title: 'Redundancy Pay Calculator',
    description: 'Calculate your statutory redundancy pay for 2026/27. Weekly cap £735, max 30 years service, tax-free up to £30,000. Updated for 6 April 2026 rates.',
    category: 'pay',
    icon: 'Banknote',
    keywords: ['redundancy', 'redundancy pay', 'statutory redundancy', 'redundancy calculator'],
    metaTitle: 'UK Redundancy Pay Calculator 2026/27 — Statutory £735/week Cap',
    priority: 1,
    financialYear: '2026-27',
  },
  {
    slug: 'maternity-pay-calculator',
    title: 'Statutory Maternity Pay Calculator',
    description: 'Calculate your Statutory Maternity Pay for 2026/27. 90% of AWE for 6 weeks, then £194.32/week (or 90% if lower) for 33 weeks. Free SMP calculator.',
    category: 'pay',
    icon: 'Banknote',
    keywords: ['maternity pay', 'SMP', 'statutory maternity pay', 'maternity leave'],
    metaTitle: 'UK Statutory Maternity Pay Calculator 2026 — £194.32/week',
    priority: 2,
    financialYear: '2026-27',
  },
  {
    slug: 'employer-cost-calculator',
    title: 'Employer Cost Calculator',
    description: 'Calculate the total cost of employing someone including salary, employer NI (15%), pension contributions and apprenticeship levy.',
    category: 'pay',
    icon: 'Banknote',
    keywords: ['employer cost', 'cost of employment', 'employment cost', 'total cost'],
    metaTitle: 'Employer Cost Calculator UK 2026/27 — True Cost of Employee',
    priority: 2,
    financialYear: '2026-27',
  },
  {
    slug: 'salary-sacrifice-calculator',
    title: 'Salary Sacrifice Calculator',
    description: 'See how much you could save on tax and NI by sacrificing part of your salary for pension, childcare or cycle to work.',
    category: 'pay',
    icon: 'Banknote',
    keywords: ['salary sacrifice', 'tax savings', 'pension sacrifice', 'cycle to work'],
    metaTitle: 'Salary Sacrifice Calculator UK 2026/27 — Tax & NI Savings',
    priority: 2,
  },
  {
    slug: 'bonus-tax-calculator',
    title: 'Bonus Tax Calculator',
    description: 'Calculate how much of your bonus you will take home after income tax and National Insurance deductions.',
    category: 'pay',
    icon: 'Banknote',
    keywords: ['bonus tax', 'bonus calculator', 'bonus after tax'],
    metaTitle: 'Bonus Tax Calculator UK 2026/27 — Take-Home from Annual Bonus',
    priority: 2,
  },

  // ========================================
  // MORTGAGE & PROPERTY
  // ========================================
  {
    slug: 'mortgage-repayment-calculator',
    title: 'Mortgage Repayment Calculator',
    description: 'Calculate monthly mortgage repayments for repayment and interest-only mortgages. See total interest paid over the term.',
    category: 'mortgage',
    icon: 'Home',
    keywords: ['mortgage', 'mortgage calculator', 'mortgage repayment', 'monthly payment', 'home loan'],
    priority: 1,
    metaTitle: 'UK Mortgage Calculator — Monthly Repayment Calculator',
  },
  {
    slug: 'mortgage-affordability-calculator',
    title: 'Mortgage Affordability Calculator',
    description: 'See exactly how much you can borrow for a UK mortgage in 2026. Calculator uses 4.5x income multiplier and Bank of England stress test rates.',
    category: 'mortgage',
    icon: 'Home',
    keywords: ['mortgage affordability', 'how much can I borrow', 'borrowing capacity'],
    metaTitle: 'Mortgage Affordability Calculator 2026',
    priority: 1,
  },
  {
    slug: 'mortgage-overpayment-calculator',
    title: 'Mortgage Overpayment Calculator',
    description: 'See how much overpaying your UK mortgage saves. £100/month extra can cut a 25-year mortgage by 5+ years. Interest savings calculator updated 2026.',
    category: 'mortgage',
    icon: 'Home',
    keywords: ['mortgage overpayment', 'overpay mortgage', 'pay off mortgage early'],
    metaTitle: 'Mortgage Overpayment Calculator 2026',
    priority: 2,
  },
  {
    slug: 'rental-yield-calculator',
    title: 'Rental Yield Calculator',
    description: 'Calculate gross and net rental yield on UK buy-to-let property. Accounts for management fees, mortgage interest, maintenance and tax. Free calculator.',
    category: 'mortgage',
    icon: 'Home',
    keywords: ['rental yield', 'buy to let', 'property investment', 'BTL'],
    metaTitle: 'Rental Yield Calculator UK 2026',
    priority: 2,
  },
  {
    slug: 'rent-vs-buy-calculator',
    title: 'Rent vs Buy Calculator',
    description: 'Compare the financial costs of renting versus buying a property over time in the UK.',
    category: 'mortgage',
    icon: 'Home',
    keywords: ['rent vs buy', 'rent or buy', 'renting vs buying'],
    metaTitle: 'Rent vs Buy Calculator — UK 2026 Mortgage Calculator',
    priority: 2,
  },

  // ========================================
  // PENSIONS & RETIREMENT
  // ========================================
  {
    slug: 'pension-calculator',
    title: 'Workplace Pension Calculator',
    description: 'Free UK workplace pension calculator. See your projected pot at 65, employer contributions, and 20%/40%/45% tax relief. Updated for 2026/27.',
    category: 'pension',
    icon: 'PiggyBank',
    keywords: ['workplace pension', 'auto enrolment', 'pension contributions', 'pension pot'],
    metaTitle: 'Pension Calculator UK 2026/27',
    priority: 1,
  },
  {
    slug: 'state-pension-calculator',
    title: 'State Pension Calculator',
    description: 'Calculate your UK State Pension entitlement based on your NI record. Full new State Pension is £241.30/week (£12,547.60/year) for 2026/27.',
    category: 'pension',
    icon: 'PiggyBank',
    keywords: ['state pension', 'new state pension', 'pension age', 'NI record'],
    metaTitle: 'State Pension Calculator UK 2026/27',
    priority: 1,
    financialYear: '2026-27',
  },
  {
    slug: 'pension-tax-relief-calculator',
    title: 'Pension Tax Relief Calculator',
    description: 'See how much tax relief you get on UK pension contributions for 2026/27. Basic 20%, Higher 40%, Additional 45%. Annual allowance £60,000.',
    category: 'pension',
    icon: 'PiggyBank',
    keywords: ['pension tax relief', 'tax relief', 'pension savings'],
    metaTitle: 'Pension Tax Relief Calculator UK 2026/27 — 20%/40%/45%',
    priority: 2,
  },

  // ========================================
  // SAVINGS & INVESTMENT
  // ========================================
  {
    slug: 'compound-interest-calculator',
    title: 'Compound Interest Calculator',
    description: 'Calculate how your savings grow with compound interest over time. See the power of compounding with regular contributions.',
    category: 'investment',
    icon: 'TrendingUp',
    keywords: ['compound interest', 'interest calculator', 'savings growth', 'investment growth'],
    metaTitle: 'Compound Interest Calculator UK — Daily/Monthly/Annual Compounding',
    priority: 1,
  },
  {
    slug: 'isa-calculator',
    title: 'ISA Calculator — Tax-Free Savings Growth',
    description: 'Calculate your tax-free ISA savings growth with the £20,000 annual allowance. Compare Cash ISA and Stocks & Shares ISA.',
    category: 'investment',
    icon: 'TrendingUp',
    keywords: ['ISA', 'individual savings account', 'ISA allowance', 'tax free savings'],
    metaTitle: 'ISA Calculator UK 2026/27',
    priority: 1,
  },

  // ========================================
  // LOANS & DEBT
  // ========================================
  {
    slug: 'student-loan-repayment-calculator',
    title: 'Student Loan Repayment Calculator',
    description: 'Calculate your student loan repayments for Plan 1, Plan 2, Plan 4, Plan 5 and Postgraduate loans.',
    category: 'loans',
    icon: 'CreditCard',
    keywords: ['student loan', 'student loan repayment', 'plan 1', 'plan 2', 'plan 4', 'plan 5'],
    priority: 1,
    financialYear: '2026-27',
    metaTitle: 'UK Student Loan Repayment Calculator 2026/27 — All Plans',
  },
  {
    slug: 'personal-loan-calculator',
    title: 'Personal Loan Calculator',
    description: 'See exact monthly repayment, total interest and APR cost on any UK personal loan. Compare 1-7 year terms. Updated for 2026 lending rates.',
    category: 'loans',
    icon: 'CreditCard',
    keywords: ['personal loan', 'loan calculator', 'loan repayment'],
    metaTitle: 'Personal Loan Calculator UK 2026',
    priority: 2,
  },
  {
    slug: 'credit-card-repayment-calculator',
    title: 'Credit Card Repayment Calculator',
    description: 'Calculate how long it will take to pay off your credit card and how much interest you will pay.',
    category: 'loans',
    icon: 'CreditCard',
    keywords: ['credit card', 'credit card repayment', 'credit card debt'],
    metaTitle: 'Credit Card Repayment Calculator UK 2026',
    priority: 2,
  },

  // ========================================
  // BUSINESS & SELF-EMPLOYED
  // ========================================
  {
    slug: 'sole-trader-tax-calculator',
    title: 'Sole Trader Tax Calculator',
    description: 'Calculate income tax and Class 4 NI for sole traders and self-employed individuals.',
    category: 'business',
    icon: 'Briefcase',
    keywords: ['sole trader', 'self employed', 'sole trader tax', 'self employed tax'],
    metaTitle: 'Sole Trader Tax Calculator — UK 2026/27 Business Calculator',
    priority: 1,
    financialYear: '2026-27',
  },
  {
    slug: 'ir35-calculator',
    title: 'IR35 Take-Home Pay Calculator',
    description: 'Compare your take-home pay inside and outside IR35 as a contractor working through a limited company.',
    category: 'business',
    icon: 'Briefcase',
    keywords: ['IR35', 'off payroll', 'contractor', 'limited company'],
    metaTitle: 'IR35 Calculator UK 2026/27',
    priority: 2,
  },
  {
    slug: 'dividend-vs-salary-calculator',
    title: 'Dividend vs Salary Calculator',
    description: 'Find the most tax-efficient mix of salary and dividends for limited company directors.',
    category: 'business',
    icon: 'Briefcase',
    keywords: ['dividend vs salary', 'director salary', 'tax efficient', 'limited company'],
    metaTitle: 'Dividend vs Salary Calculator — UK 2026/27 Business Calculator',
    priority: 2,
    financialYear: '2026-27',
  },

  // ========================================
  // BENEFITS & WELFARE
  // ========================================
  {
    slug: 'child-benefit-calculator',
    title: 'Child Benefit Calculator',
    description: 'Calculate your Child Benefit payments and check if the High Income Child Benefit Charge applies.',
    category: 'benefits',
    icon: 'Shield',
    keywords: ['child benefit', 'HICBC', 'high income charge'],
    metaTitle: 'Child Benefit Calculator — UK 2026/27 Benefits Calculator',
    priority: 2,
    financialYear: '2026-27',
  },

  // ========================================
  // MOTORING & TRANSPORT
  // ========================================
  {
    slug: 'fuel-cost-calculator',
    title: 'Fuel Cost Calculator',
    description: 'Calculate the fuel cost of any journey based on distance, fuel price and your vehicle\'s MPG or L/100km.',
    category: 'auto',
    icon: 'Car',
    keywords: ['fuel cost', 'petrol cost', 'diesel cost', 'journey cost', 'MPG'],
    metaTitle: 'Fuel Cost Calculator UK 2026 — Petrol & Diesel',
    priority: 2,
  },
  {
    slug: 'car-tax-calculator',
    title: 'Car Tax (VED) Calculator',
    description: 'Calculate Vehicle Excise Duty based on your car\'s CO2 emissions, fuel type and registration date.',
    category: 'auto',
    icon: 'Car',
    keywords: ['car tax', 'VED', 'vehicle excise duty', 'road tax'],
    metaTitle: 'UK Car Tax (VED) Calculator 2026/27 — CO2 + List Price',
    priority: 2,
  },

  // ========================================
  // HEALTH & FITNESS
  // ========================================
  {
    slug: 'bmi-calculator',
    title: 'BMI Calculator',
    description: 'Calculate your Body Mass Index using metric or imperial measurements. See your BMI category and healthy weight range.',
    category: 'health',
    icon: 'Heart',
    keywords: ['BMI', 'body mass index', 'weight', 'healthy weight'],
    priority: 1,
    metaTitle: 'BMI Calculator — Body Mass Index Calculator (Metric & Imperial)',
  },
  {
    slug: 'calorie-calculator',
    title: 'Calorie Calculator (TDEE)',
    description: 'Calculate your Total Daily Energy Expenditure and recommended calorie intake for weight loss, maintenance or gain.',
    category: 'health',
    icon: 'Heart',
    keywords: ['calorie calculator', 'TDEE', 'daily calories', 'calorie intake'],
    metaTitle: 'Calorie Calculator (TDEE) — UK Health Calculator',
    priority: 2,
  },

  // ========================================
  // CONSTRUCTION & DIY
  // ========================================
  {
    slug: 'concrete-calculator',
    title: 'Concrete Calculator',
    description: 'Calculate how much concrete you need in cubic metres or bags for slabs, footings, posts and columns.',
    category: 'building',
    icon: 'Hammer',
    keywords: ['concrete', 'concrete calculator', 'cement', 'cubic metres'],
    metaTitle: 'Concrete Calculator UK — Cubic Metres + Bag Requirement',
    priority: 2,
  },
  {
    slug: 'paint-calculator',
    title: 'Paint Calculator — Litres & Coverage',
    description: 'Calculate how much paint you need based on wall area, number of coats and paint coverage rate.',
    category: 'building',
    icon: 'Hammer',
    keywords: ['paint calculator', 'wall paint', 'paint coverage'],
    metaTitle: 'Paint Calculator UK — Litres Needed by Wall Area',
    priority: 2,
  },

  // ========================================
  // EVERYDAY & UTILITY
  // ========================================
  {
    slug: 'percentage-calculator',
    title: 'Percentage Calculator',
    description: 'Calculate percentages, percentage increase/decrease, and find what percentage one number is of another.',
    category: 'tools',
    icon: 'Wrench',
    keywords: ['percentage', 'percent', 'percentage calculator', '% calculator'],
    priority: 1,
    metaTitle: 'Percentage Calculator — Calculate Percentages Instantly',
  },
  {
    slug: 'age-calculator',
    title: 'Age Calculator — Years, Months & Days',
    description: 'Calculate your exact age in years, months and days from your date of birth.',
    category: 'tools',
    icon: 'Wrench',
    keywords: ['age calculator', 'date of birth', 'how old am I'],
    metaTitle: 'Age Calculator UK — Years, Months, Days',
    priority: 2,
  },
  {
    slug: 'currency-converter',
    title: 'Currency Converter — Live Exchange Rates',
    description: 'Convert between GBP, EUR, USD and 150+ world currencies with live exchange rates.',
    category: 'tools',
    icon: 'Wrench',
    keywords: ['currency converter', 'exchange rate', 'GBP', 'EUR', 'USD'],
    metaTitle: 'GBP Currency Converter UK 2026',
    priority: 2,
  },
  {
    slug: 'discount-calculator',
    title: 'Discount Calculator',
    description: 'Calculate sale prices, savings and reverse percentage discounts instantly.',
    category: 'tools',
    icon: 'Wrench',
    keywords: ['discount', 'sale price', 'percentage off', 'savings'],
    metaTitle: 'Discount Calculator UK — % Off & Savings',
    priority: 2,
  },
  {
    slug: 'tip-calculator',
    title: 'Tip Calculator — Restaurant & Service Tips',
    description: 'Calculate tips and split bills between multiple people. Choose your tip percentage.',
    category: 'tools',
    icon: 'Wrench',
    keywords: ['tip calculator', 'bill split', 'restaurant tip', 'gratuity'],
    metaTitle: 'Tip Calculator UK 2026 — Restaurant Service',
    priority: 2,
  },

  // ========================================
  // ENERGY & HOME
  // ========================================
  {
    slug: 'energy-bill-calculator',
    title: 'Energy Bill Calculator',
    description: 'Estimate your annual gas and electricity bills using Ofgem price cap rates. See monthly and daily costs.',
    category: 'energy',
    icon: 'Zap',
    keywords: ['energy bill', 'gas bill', 'electricity bill', 'Ofgem', 'price cap'],
    metaTitle: 'UK Energy Bill Calculator 2026 — Price Cap',
    priority: 1,
    isTrending: true,
  },
  {
    slug: 'solar-panel-calculator',
    title: 'Solar Panel Savings Calculator',
    description: 'Calculate solar panel payback period, annual savings and 25-year return on investment.',
    category: 'energy',
    icon: 'Zap',
    keywords: ['solar panels', 'solar savings', 'solar payback', 'renewable energy'],
    metaTitle: 'Solar Panel Calculator UK 2026 — Savings & Payback',
    priority: 2,
  },

  // ========================================
  // TAX (additional)
  // ========================================
  {
    slug: 'vat-flat-rate-calculator',
    title: 'VAT Flat Rate Scheme Calculator',
    description: 'Compare VAT Flat Rate Scheme vs standard VAT for your business sector. See if you save or lose.',
    category: 'tax',
    icon: 'Receipt',
    keywords: ['VAT flat rate', 'flat rate scheme', 'FRS', 'VAT scheme'],
    metaTitle: 'VAT Flat Rate Scheme Calculator UK 2026/27',
    priority: 2,
  },

  // ========================================
  // CONSTRUCTION & DIY (additional)
  // ========================================
  {
    slug: 'flooring-calculator',
    title: 'Flooring Calculator',
    description: 'Calculate how much laminate, vinyl or carpet you need including wastage. Get pack and cost estimates.',
    category: 'building',
    icon: 'Hammer',
    keywords: ['flooring', 'laminate', 'vinyl', 'carpet', 'floor area'],
    metaTitle: 'Flooring Calculator UK — m² + Wastage',
    priority: 2,
  },
  {
    slug: 'tile-calculator',
    title: 'Tile Calculator — Tiles Needed & Cost',
    description: 'Calculate how many tiles you need for walls or floors. Accounts for grout gaps and wastage.',
    category: 'building',
    icon: 'Hammer',
    keywords: ['tiles', 'tile calculator', 'wall tiles', 'floor tiles'],
    metaTitle: 'Tile Calculator UK — How Many Tiles',
    priority: 2,
  },
  {
    slug: 'gravel-calculator',
    title: 'Gravel Calculator — Tonnes & Cost',
    description: 'Calculate gravel needed in cubic metres, tonnes or bags for driveways, paths and landscaping.',
    category: 'building',
    icon: 'Hammer',
    keywords: ['gravel', 'aggregate', 'driveway', 'landscaping'],
    metaTitle: 'Gravel Calculator UK — Tonnes Needed',
    priority: 2,
  },
  {
    slug: 'wallpaper-calculator',
    title: 'Wallpaper Calculator',
    description: 'Calculate how many rolls of wallpaper you need. Accounts for pattern repeat and doors/windows.',
    category: 'building',
    icon: 'Hammer',
    keywords: ['wallpaper', 'wallpaper rolls', 'wallpaper calculator', 'pattern repeat'],
    metaTitle: 'Wallpaper Calculator UK — Rolls Needed',
    priority: 2,
  },
  {
    slug: 'decking-calculator',
    title: 'Decking Calculator — Boards & Cost',
    description: 'Calculate decking boards, joists and screws needed. Get material cost estimates.',
    category: 'building',
    icon: 'Hammer',
    keywords: ['decking', 'deck boards', 'garden decking', 'composite decking'],
    metaTitle: 'Decking Calculator UK — Boards Needed',
    priority: 2,
  },
  {
    slug: 'fencing-calculator',
    title: 'Fencing Calculator — Panels & Cost',
    description: 'Calculate fence panels and posts needed for your garden fence with material cost estimates.',
    category: 'building',
    icon: 'Hammer',
    keywords: ['fencing', 'fence panels', 'fence posts', 'garden fence'],
    metaTitle: 'Fencing Calculator UK — Panels & Posts',
    priority: 2,
  },

  // ========================================
  // HEALTH (additional)
  // ========================================
  {
    slug: 'body-fat-calculator',
    title: 'Body Fat Percentage Calculator',
    description: 'Estimate your body fat percentage using the US Navy method with waist, neck and hip measurements.',
    category: 'health',
    icon: 'Heart',
    keywords: ['body fat', 'body fat percentage', 'body composition'],
    metaTitle: 'Body Fat % Calculator — Navy Method',
    priority: 2,
  },
  {
    slug: 'pregnancy-due-date-calculator',
    title: 'Pregnancy Due Date Calculator',
    description: 'Calculate your estimated due date from your last menstrual period. See key milestones and trimester progress.',
    category: 'health',
    icon: 'Heart',
    keywords: ['pregnancy', 'due date', 'pregnancy calculator', 'maternity'],
    metaTitle: 'Pregnancy Due Date Calculator — UK Health Calculator',
    priority: 2,
  },
  {
    slug: 'alcohol-units-calculator',
    title: 'Alcohol Units Calculator',
    description: 'Calculate alcohol units in your drinks. Track against the NHS guideline of 14 units per week.',
    category: 'health',
    icon: 'Heart',
    keywords: ['alcohol units', 'drink calculator', 'NHS units', 'alcohol intake'],
    metaTitle: 'Alcohol Units Calculator — UK Health Calculator',
    priority: 2,
  },
  {
    slug: 'sleep-calculator',
    title: 'Sleep Calculator — Bedtime & Wake Time',
    description: 'Find the best bedtime or wake-up time based on 90-minute sleep cycles. Wake feeling refreshed.',
    category: 'health',
    icon: 'Heart',
    keywords: ['sleep calculator', 'sleep cycles', 'bedtime', 'wake up time'],
    metaTitle: 'Sleep Calculator — 90-Minute Cycles',
    priority: 2,
  },

  // ========================================
  // TOOLS (additional)
  // ========================================
  {
    slug: 'date-calculator',
    title: 'Date Calculator — Days Between Dates',
    description: 'Calculate the number of days, weeks and working days between two dates. Add or subtract days from a date.',
    category: 'tools',
    icon: 'Wrench',
    keywords: ['date calculator', 'days between dates', 'working days', 'date difference'],
    metaTitle: 'Date Calculator UK — Days Between Dates',
    priority: 2,
  },
  {
    slug: 'weight-converter',
    title: 'Weight Converter (kg / stone / pounds)',
    description: 'Convert between kilograms, stone, pounds, ounces and tonnes. Includes UK stone & pounds display.',
    category: 'tools',
    icon: 'Wrench',
    keywords: ['weight converter', 'kg to stone', 'stone to kg', 'pounds to kg', 'unit converter'],
    metaTitle: 'Weight Converter UK — Kg/Stones/Pounds',
    priority: 1,
  },
  {
    slug: 'inflation-calculator',
    title: 'Inflation Calculator',
    description: 'See what money was worth in the past or what it will be worth in the future with UK inflation rates.',
    category: 'tools',
    icon: 'Wrench',
    keywords: ['inflation', 'purchasing power', 'CPI', 'cost of living', 'money worth'],
    metaTitle: 'UK Inflation Calculator 2026 — CPI/RPI',
    priority: 2,
  },
  {
    slug: 'wedding-budget-calculator',
    title: 'Wedding Budget Calculator',
    description: 'Plan your wedding budget with a typical UK breakdown. See cost per guest and category allocations.',
    category: 'tools',
    icon: 'Wrench',
    keywords: ['wedding budget', 'wedding cost', 'wedding planner', 'wedding calculator'],
    metaTitle: 'UK Wedding Budget Calculator 2026',
    priority: 2,
  },

  // ========================================
  // IMMIGRATION
  // ========================================
  {
    slug: 'visa-points-calculator',
    title: 'UK Skilled Worker Visa Points Calculator',
    description: 'Check if you meet the 70-point threshold for a UK Skilled Worker visa. Calculate mandatory and tradeable points.',
    category: 'immigration',
    icon: 'Globe',
    keywords: ['visa points', 'skilled worker visa', 'UK visa', 'immigration points', 'tier 2'],
    metaTitle: 'UK Skilled Worker Visa Points Calculator 2026',
    priority: 1,
  },

  // ========================================
  // LEGAL
  // ========================================
  {
    slug: 'court-fee-calculator',
    title: 'Court Fee Calculator',
    description: 'Calculate court issue fees and hearing fees for money claims in England and Wales.',
    category: 'legal',
    icon: 'Scale',
    keywords: ['court fees', 'money claim', 'small claims', 'court costs'],
    metaTitle: 'UK Court Fee Calculator 2026 — Claim Value',
    priority: 1,
  },
  {
    slug: 'probate-fee-calculator',
    title: 'Probate Fee Calculator',
    description: 'Calculate probate application fees and estimated solicitor costs for administering an estate.',
    category: 'legal',
    icon: 'Scale',
    keywords: ['probate', 'probate fees', 'grant of probate', 'estate administration'],
    metaTitle: 'UK Probate Fee Calculator 2026 (£273)',
    priority: 2,
  },

  // ========================================
  // INSURANCE
  // ========================================
  {
    slug: 'life-insurance-calculator',
    title: 'Life Insurance Needs Calculator',
    description: 'Calculate how much life insurance cover you need based on income, mortgage, debts and family costs.',
    category: 'insurance',
    icon: 'ShieldCheck',
    keywords: ['life insurance', 'life cover', 'insurance needs', 'death in service'],
    metaTitle: 'UK Life Insurance Calculator 2026 — Cover Needed',
    priority: 1,
  },

  // ========================================
  // MATH & SCIENCE
  // ========================================
  {
    slug: 'square-root-calculator',
    title: 'Square Root, Powers & Logarithm Calculator',
    description: 'Calculate square roots, cube roots, custom powers, and logarithms (log10, ln, log2).',
    category: 'math',
    icon: 'Calculator',
    keywords: ['square root', 'cube root', 'powers', 'logarithm', 'exponent'],
    metaTitle: 'Square Root Calculator — Free Online',
    priority: 1,
  },
  {
    slug: 'fraction-calculator',
    title: 'Fraction Calculator',
    description: 'Add, subtract, multiply and divide fractions. Shows simplified result, mixed number and decimal.',
    category: 'math',
    icon: 'Calculator',
    keywords: ['fraction', 'fraction calculator', 'add fractions', 'simplify fractions'],
    metaTitle: 'Fraction Calculator — Add, Subtract, Multiply',
    priority: 1,
  },

  // ========================================
  // GARDENING
  // ========================================
  {
    slug: 'lawn-seed-calculator',
    title: 'Lawn Seed Calculator',
    description: 'Calculate grass seed needed for new lawns, overseeding or repair. Get bag counts and cost estimates.',
    category: 'gardening',
    icon: 'Flower2',
    keywords: ['lawn seed', 'grass seed', 'new lawn', 'overseeding'],
    metaTitle: 'Lawn Seed Calculator UK — Kg per m²',
    priority: 1,
  },
  {
    slug: 'topsoil-calculator',
    title: 'Topsoil Calculator — Tonnes & Cost',
    description: 'Calculate topsoil needed in cubic metres, tonnes or bags for garden beds and landscaping.',
    category: 'gardening',
    icon: 'Flower2',
    keywords: ['topsoil', 'garden soil', 'compost', 'raised bed'],
    metaTitle: 'Topsoil Calculator UK — Cubic Metres',
    priority: 2,
  },
  {
    slug: 'paving-calculator',
    title: 'Patio Paving Calculator',
    description: 'Calculate paving slabs needed for your patio or path. Includes jointing sand estimate.',
    category: 'gardening',
    icon: 'Flower2',
    keywords: ['paving', 'patio', 'slabs', 'patio calculator'],
    metaTitle: 'Paving Calculator UK — Slabs Needed',
    priority: 2,
  },

  // ========================================
  // MOTORING (additional)
  // ========================================
  {
    slug: 'ev-charging-calculator',
    title: 'EV Charging Cost Calculator',
    description: 'Calculate electric vehicle charging costs for home and public charging. Compare costs per mile.',
    category: 'auto',
    icon: 'Car',
    keywords: ['EV charging', 'electric car', 'charging cost', 'home charger', 'rapid charge'],
    metaTitle: 'EV Charging Cost Calculator UK 2026',
    priority: 2,
    isTrending: true,
  },
  {
    slug: 'commute-cost-calculator',
    title: 'Commute Cost Calculator',
    description: 'Calculate and compare annual commuting costs by car, train, bus or bicycle.',
    category: 'auto',
    icon: 'Car',
    keywords: ['commute cost', 'travel cost', 'commuting', 'transport cost'],
    metaTitle: 'Commute Cost Calculator UK 2026 — Annual',
    priority: 2,
  },

  // ========================================
  // PAY (additional)
  // ========================================
  {
    slug: 'mileage-allowance-calculator',
    title: 'Mileage Allowance Calculator (HMRC)',
    description: 'Calculate HMRC approved mileage allowance payments for car, motorcycle or bicycle. 45p/25p per mile rates.',
    category: 'pay',
    icon: 'Banknote',
    keywords: ['mileage allowance', 'AMAP', 'HMRC mileage', '45p per mile', 'business mileage'],
    metaTitle: 'UK Mileage Allowance Calculator 2026 — HMRC 45p/25p Rates',
    priority: 2,
  },

  // ========================================
  // CONSTRUCTION (additional)
  // ========================================
  {
    slug: 'radiator-btu-calculator',
    title: 'Radiator BTU Calculator',
    description: 'Calculate the BTU and wattage needed for your radiators based on room size, glazing and insulation.',
    category: 'building',
    icon: 'Hammer',
    keywords: ['radiator', 'BTU', 'heating', 'radiator size', 'central heating'],
    metaTitle: 'Radiator BTU Calculator UK — Room Heating',
    priority: 2,
  },
  {
    slug: 'bricks-calculator',
    title: 'Bricks & Blocks Calculator',
    description: 'Calculate bricks, sand and cement needed for walls. Accounts for openings and mortar joints.',
    category: 'building',
    icon: 'Hammer',
    keywords: ['bricks', 'blocks', 'mortar', 'bricklaying', 'wall building'],
    metaTitle: 'Bricks Calculator UK — How Many Bricks Needed',
    priority: 2,
  },

  // ========================================
  // HEALTH (additional)
  // ========================================
  {
    slug: 'pace-calculator',
    title: 'Pace Calculator (Running)',
    description: 'Calculate running pace, finish time or distance. Supports km and mile splits for 5K, 10K, half marathon and marathon.',
    category: 'health',
    icon: 'Heart',
    keywords: ['pace calculator', 'running pace', 'marathon pace', '5K time', 'finish time'],
    metaTitle: 'Running Pace Calculator UK — 5K/10K/Half',
    priority: 2,
  },
  {
    slug: 'water-intake-calculator',
    title: 'Water Intake Calculator',
    description: 'Calculate your recommended daily water intake based on weight, activity level and climate.',
    category: 'health',
    icon: 'Heart',
    keywords: ['water intake', 'hydration', 'daily water', 'how much water'],
    metaTitle: 'Water Intake Calculator UK — Daily Hydration',
    priority: 2,
  },
  // LOANS (additional)
  {
    slug: 'overdraft-cost-calculator',
    title: 'Overdraft Cost Calculator',
    description: 'Calculate the interest cost of using your overdraft. Most UK banks charge ~39.9% EAR.',
    category: 'loans',
    icon: 'CreditCard',
    keywords: ['overdraft', 'overdraft cost', 'overdraft interest', 'bank overdraft'],
    metaTitle: 'Overdraft Cost Calculator UK 2026 (40% EAR)',
    priority: 2,
  },
  {
    slug: 'debt-free-calculator',
    title: 'Debt-Free Date Calculator',
    description: 'Find out when you will be debt-free based on your balance, APR and monthly payments.',
    category: 'loans',
    icon: 'CreditCard',
    keywords: ['debt free', 'pay off debt', 'debt calculator', 'debt repayment'],
    metaTitle: 'Debt-Free Date Calculator UK 2026',
    priority: 2,
  },
  {
    slug: 'car-finance-calculator',
    title: 'Car Finance Calculator (PCP/HP/Loan)',
    description: 'Compare PCP, HP and personal loan for any car. See monthly payments, total cost, balloon payment and which is cheapest. Free UK calculator updated 2026.',
    category: 'loans',
    icon: 'CreditCard',
    keywords: ['car finance', 'PCP', 'hire purchase', 'car loan', 'car finance calculator'],
    metaTitle: 'Car Finance Calculator UK 2026 — Compare PCP vs HP vs Loan',
    priority: 1,
  },
  // ENERGY (additional)
  {
    slug: 'heat-pump-calculator',
    title: 'Heat Pump Running Cost Calculator',
    description: 'Compare heat pump vs gas/oil boiler running costs. Calculate payback period and annual savings.',
    category: 'energy',
    icon: 'Zap',
    keywords: ['heat pump', 'ASHP', 'heat pump cost', 'boiler replacement', 'green heating'],
    metaTitle: 'Heat Pump Calculator UK 2026 — Running Cost',
    priority: 2,
    isTrending: true,
  },
  // SAVINGS (additional)
  {
    slug: 'savings-goal-calculator',
    title: 'Savings Goal Calculator',
    description: 'Calculate how long to reach your savings goal or how much to save monthly to hit a target date.',
    category: 'investment',
    icon: 'TrendingUp',
    keywords: ['savings goal', 'save for', 'savings target', 'how long to save'],
    metaTitle: 'Savings Goal Calculator UK — How Much to Save Each Month',
    priority: 2,
  },
  // TOOLS (additional)
  {
    slug: 'number-to-words-calculator',
    title: 'Number to Words Converter',
    description: 'Convert any number to words in English. Includes cheque format for GBP amounts.',
    category: 'tools',
    icon: 'Wrench',
    keywords: ['number to words', 'number in words', 'cheque format', 'spell number'],
    metaTitle: 'Number to Words Converter UK',
    priority: 2,
  },
  {
    slug: 'random-number-generator',
    title: 'Random Number Generator',
    description: 'Generate random numbers within a range. Supports multiple numbers with or without duplicates.',
    category: 'tools',
    icon: 'Wrench',
    keywords: ['random number', 'random generator', 'dice roller', 'lottery numbers'],
    metaTitle: 'Random Number Generator UK',
    priority: 2,
  },
  {
    slug: 'shoe-size-converter',
    title: 'Shoe Size Converter (UK/EU/US)',
    description: 'Convert shoe sizes between UK, EU, US (men and women) and centimetres.',
    category: 'tools',
    icon: 'Wrench',
    keywords: ['shoe size', 'shoe converter', 'UK to EU', 'shoe size chart'],
    metaTitle: 'UK Shoe Size Converter (UK/EU/US)',
    priority: 2,
  },
  {
    slug: 'ratio-calculator',
    title: 'Ratio Calculator — Simplify & Solve',
    description: 'Divide an amount by a given ratio. Simplify ratios and see percentage splits.',
    category: 'tools',
    icon: 'Wrench',
    keywords: ['ratio', 'ratio calculator', 'divide ratio', 'proportion'],
    metaTitle: 'Ratio Calculator — Simplify and Convert',
    priority: 2,
  },
  // MATH (additional)
  {
    slug: 'standard-deviation-calculator',
    title: 'Standard Deviation Calculator',
    description: 'Calculate standard deviation, variance, mean, median, min, max and range from a set of numbers.',
    category: 'math',
    icon: 'Calculator',
    keywords: ['standard deviation', 'variance', 'statistics', 'mean', 'median'],
    metaTitle: 'Standard Deviation Calculator — Statistics',
    priority: 1,
  },
  // EDUCATION (additional)
  {
    slug: 'ucas-points-calculator',
    title: 'UCAS Tariff Points Calculator',
    description: 'Calculate your UCAS tariff points from A-Levels, AS-Levels, BTEC and EPQ qualifications.',
    category: 'education',
    icon: 'GraduationCap',
    keywords: ['UCAS', 'tariff points', 'A-level points', 'university', 'BTEC points'],
    metaTitle: 'UCAS Points Calculator UK 2026 — A-Level Grades',
    priority: 1,
  },
  // AUTO (additional)
  {
    slug: 'speed-fine-calculator',
    title: 'Speeding Fine Calculator',
    description: 'Estimate your speeding fine band, penalty points and potential driving ban based on UK sentencing guidelines.',
    category: 'auto',
    icon: 'Car',
    keywords: ['speeding fine', 'speed fine', 'penalty points', 'speeding ticket', 'driving ban'],
    metaTitle: 'Speed Fine Calculator UK 2026 (£100-£2,500)',
    priority: 2,
  },
  {
    slug: 'binary-converter',
    title: 'Binary / Hex / Decimal Converter',
    description: 'Convert between binary, decimal, hexadecimal and octal number systems instantly.',
    category: 'math',
    icon: 'Calculator',
    keywords: ['binary', 'hexadecimal', 'decimal', 'octal', 'number converter'],
    metaTitle: 'Binary Converter — Decimal to Binary',
    priority: 2,
  },
  {
    slug: 'mulch-calculator',
    title: 'Mulch Calculator — Bags & Coverage',
    description: 'Calculate mulch needed in litres and bags for garden beds and borders.',
    category: 'gardening',
    icon: 'Flower2',
    keywords: ['mulch', 'bark mulch', 'garden mulch', 'wood chip'],
    metaTitle: 'Mulch Calculator UK — Volume Needed',
    priority: 2,
  },
  {
    slug: 'ideal-weight-calculator',
    title: 'Ideal Weight Calculator',
    description: 'Calculate your ideal weight using Robinson, Miller, Devine and Hamwi formulas. See your healthy BMI range.',
    category: 'health',
    icon: 'Heart',
    keywords: ['ideal weight', 'healthy weight', 'target weight', 'weight range'],
    metaTitle: 'Ideal Weight Calculator UK',
    priority: 2,
  },
  // FARMING
  {
    slug: 'fertiliser-calculator',
    title: 'Fertiliser Calculator',
    description: 'Calculate fertiliser needed for lawns, gardens and allotments based on area and application rate.',
    category: 'farming',
    icon: 'Wheat',
    keywords: ['fertiliser', 'fertilizer', 'NPK', 'lawn feed', 'garden feed'],
    metaTitle: 'Fertiliser Calculator UK — kg/ha',
    priority: 1,
  },
  {
    slug: 'crop-yield-calculator',
    title: 'Crop Yield Calculator',
    description: 'Estimate crop yields for common vegetables and commercial crops. Calculate value of harvest.',
    category: 'farming',
    icon: 'Wheat',
    keywords: ['crop yield', 'harvest', 'vegetable yield', 'allotment'],
    metaTitle: 'Crop Yield Calculator UK 2026',
    priority: 2,
  },
  // BUSINESS (additional)
  {
    slug: 'break-even-calculator',
    title: 'Break-Even Calculator',
    description: 'Calculate the break-even point in units and revenue. Find your contribution margin.',
    category: 'business',
    icon: 'Briefcase',
    keywords: ['break even', 'breakeven', 'contribution margin', 'fixed costs'],
    metaTitle: 'Break-Even Calculator UK 2026',
    priority: 2,
  },
  {
    slug: 'margin-calculator',
    title: 'Profit Margin & Markup Calculator',
    description: 'Calculate profit margin, markup percentage and selling price from cost and revenue.',
    category: 'business',
    icon: 'Briefcase',
    keywords: ['profit margin', 'markup', 'margin calculator', 'gross margin'],
    metaTitle: 'Profit Margin Calculator UK 2026',
    priority: 2,
  },
  {
    slug: 'depreciation-calculator',
    title: 'Depreciation Calculator',
    description: 'Calculate asset depreciation using straight-line or reducing balance methods with a year-by-year schedule.',
    category: 'business',
    icon: 'Briefcase',
    keywords: ['depreciation', 'straight line', 'reducing balance', 'asset value', 'book value'],
    metaTitle: 'Depreciation Calculator UK 2026',
    priority: 2,
  },
  // IMMIGRATION (additional)
  {
    slug: 'visa-fee-calculator',
    title: 'UK Visa Fee Calculator',
    description: 'Calculate total UK visa costs including application fee, IHS surcharge, priority processing and dependants.',
    category: 'immigration',
    icon: 'Globe',
    keywords: ['visa fee', 'UK visa cost', 'IHS', 'immigration fee', 'dependant visa'],
    metaTitle: 'UK Visa Fee Calculator 2026',
    priority: 2,
  },
  // BENEFITS (additional)
  {
    slug: 'universal-credit-calculator',
    title: 'Universal Credit Calculator',
    description: 'Estimate your Universal Credit entitlement including standard allowance, child element, housing and earnings taper.',
    category: 'benefits',
    icon: 'Shield',
    keywords: ['universal credit', 'UC', 'benefits calculator', 'DWP'],
    metaTitle: 'Universal Credit Calculator UK 2026/27 — Standard + Elements',
    priority: 1,
  },
  // EDUCATION (additional)
  {
    slug: 'student-budget-calculator',
    title: 'Student Budget Calculator',
    description: 'Plan your university budget. Track income from loans, grants and jobs against monthly expenses.',
    category: 'education',
    icon: 'GraduationCap',
    keywords: ['student budget', 'university budget', 'student finance', 'uni budget'],
    metaTitle: 'Student Budget Calculator UK 2026',
    priority: 2,
  },
  // BUSINESS (additional)
  {
    slug: 'contractor-day-rate-calculator',
    title: 'Contractor Day Rate Calculator',
    description: 'Calculate the minimum day rate needed to achieve your target take-home pay. Inside and outside IR35.',
    category: 'business',
    icon: 'Briefcase',
    keywords: ['day rate', 'contractor rate', 'freelance rate', 'contract rate'],
    metaTitle: 'Contractor Day Rate Calculator — UK 2026/27 Business Calculator',
    priority: 1,
  },
  // ENERGY (additional)
  {
    slug: 'electricity-cost-calculator',
    title: 'Electricity Cost Calculator (per appliance)',
    description: 'Calculate how much an appliance costs to run per day, week, month and year. Quick-select from common appliances.',
    category: 'energy',
    icon: 'Zap',
    keywords: ['electricity cost', 'appliance cost', 'running cost', 'kWh cost'],
    metaTitle: 'Electricity Cost Calculator UK 2026 (per Appliance)',
    priority: 2,
  },
  {
    slug: 'led-savings-calculator',
    title: 'LED Bulb Savings Calculator',
    description: 'Calculate how much you save by switching from old bulbs to LED. See payback period and annual savings.',
    category: 'energy',
    icon: 'Zap',
    keywords: ['LED savings', 'LED bulb', 'light bulb', 'energy saving'],
    metaTitle: 'LED Bulb Savings Calculator UK 2026',
    priority: 2,
  },
  // TAX (additional)
  {
    slug: 'lbtt-ltt-calculator',
    title: 'LBTT (Scotland) / LTT (Wales) Calculator',
    description: 'Calculate Land & Buildings Transaction Tax (Scotland) or Land Transaction Tax (Wales) on property purchases.',
    category: 'tax',
    icon: 'Receipt',
    keywords: ['LBTT', 'LTT', 'Scotland stamp duty', 'Wales stamp duty', 'land tax'],
    metaTitle: 'LBTT (Scotland) & LTT (Wales) Calculator 2026/27',
    priority: 2,
  },
  {
    slug: 'landlord-tax-calculator',
    title: 'Landlord Tax Calculator (Section 24)',
    description: 'Calculate tax on rental income including Section 24 mortgage interest relief for buy-to-let landlords.',
    category: 'tax',
    icon: 'Receipt',
    keywords: ['landlord tax', 'rental income tax', 'section 24', 'buy to let tax'],
    metaTitle: 'UK Landlord Tax Calculator 2026 (Section 24)',
    priority: 2,
  },
  {
    slug: 'tax-code-checker',
    title: 'Tax Code Checker — HMRC Code Lookup',
    description: 'Enter your HMRC tax code and find out what it means, your Personal Allowance and if it\'s correct.',
    category: 'tax',
    icon: 'Receipt',
    keywords: ['tax code', 'HMRC tax code', '1257L', 'tax code meaning', 'check tax code'],
    metaTitle: 'UK Tax Code Checker 2026/27 — What 1257L Means',
    priority: 1,
  },
  // PAY (additional)
  {
    slug: 'sick-pay-calculator',
    title: 'Statutory Sick Pay Calculator',
    description: 'Calculate SSP entitlement at £123.25/week. Includes waiting days and maximum 28-week limit.',
    category: 'pay',
    icon: 'Banknote',
    keywords: ['sick pay', 'SSP', 'statutory sick pay', 'illness pay'],
    metaTitle: 'UK Statutory Sick Pay (SSP) Calculator 2026 — £123.25/week',
    priority: 2,
    financialYear: '2026-27',
  },
  {
    slug: 'pay-rise-calculator',
    title: 'Pay Rise Calculator (Real Terms)',
    description: 'Check if your pay rise beats inflation. Compare nominal and real-terms increases.',
    category: 'pay',
    icon: 'Banknote',
    keywords: ['pay rise', 'salary increase', 'inflation', 'real terms', 'pay cut'],
    metaTitle: 'Pay Rise Calculator UK 2026 — Real Terms vs Inflation',
    priority: 2,
  },
  // MORTGAGE (additional)
  {
    slug: 'shared-ownership-calculator',
    title: 'Shared Ownership Calculator',
    description: 'Calculate monthly costs of shared ownership including mortgage on your share and rent on the unsold share.',
    category: 'mortgage',
    icon: 'Home',
    keywords: ['shared ownership', 'part buy part rent', 'affordable housing', 'first home'],
    metaTitle: 'Shared Ownership Calculator UK 2026 — Mortgage + Rent',
    priority: 2,
  },
  // PENSION (additional)
  {
    slug: 'pension-drawdown-calculator',
    title: 'Pension Drawdown Calculator',
    description: 'Calculate how long your pension pot will last with drawdown. See year-by-year projections with growth.',
    category: 'pension',
    icon: 'PiggyBank',
    keywords: ['pension drawdown', 'flexi-access', 'income drawdown', 'pension withdrawal'],
    metaTitle: 'Pension Drawdown Calculator UK 2026/27',
    priority: 1,
  },
  {
    slug: 'annuity-calculator',
    title: 'Annuity Calculator — Retirement Income',
    description: 'Calculate the income from a UK pension annuity. Compare lifetime, joint, and enhanced annuity rates based on age, health and pot size for 2026.',
    category: 'pension',
    icon: 'PiggyBank',
    keywords: ['annuity', 'guaranteed income', 'pension annuity', 'lifetime income'],
    metaTitle: 'Annuity Calculator UK 2026 — Pension Annuity Rates',
    priority: 2,
  },
  {
    slug: 'pension-vs-isa-calculator',
    title: 'Pension vs ISA Calculator',
    description: 'Compare pension and ISA over time. See which gives you more after tax relief and withdrawal tax.',
    category: 'pension',
    icon: 'PiggyBank',
    keywords: ['pension vs ISA', 'pension or ISA', 'tax relief', 'retirement savings'],
    metaTitle: 'Pension vs ISA Calculator UK 2026/27',
    priority: 2,
  },
  // SAVINGS (additional)
  {
    slug: 'lifetime-isa-calculator',
    title: 'Lifetime ISA Calculator',
    description: 'Calculate LISA growth with the 25% government bonus. For first homes (up to £450K) or retirement (60+).',
    category: 'investment',
    icon: 'TrendingUp',
    keywords: ['LISA', 'lifetime ISA', 'government bonus', 'first home', 'help to buy ISA'],
    metaTitle: 'Lifetime ISA Calculator UK 2026/27 — 25% Bonus + £4,000 Limit',
    priority: 1,
  },
  {
    slug: 'premium-bonds-calculator',
    title: 'Premium Bonds Calculator',
    description: 'Calculate expected returns and prize odds for NS&I Premium Bonds based on your holding.',
    category: 'investment',
    icon: 'TrendingUp',
    keywords: ['premium bonds', 'NS&I', 'prize draw', 'tax free savings'],
    metaTitle: 'Premium Bonds Calculator UK 2026 — Win Odds',
    priority: 2,
  },
  // BENEFITS (additional)
  {
    slug: 'child-maintenance-calculator',
    title: 'Child Maintenance (CMS) Calculator',
    description: 'Calculate child maintenance using CMS rules. Accounts for income, shared care nights and other children.',
    category: 'benefits',
    icon: 'Shield',
    keywords: ['child maintenance', 'CMS', 'child support', 'maintenance payments'],
    metaTitle: 'Child Maintenance Calculator UK 2026 (CMS)',
    priority: 1,
  },
  // MORTGAGE (additional)
  {
    slug: 'equity-release-calculator',
    title: 'Equity Release Calculator',
    description: 'Estimate how much you could release from your home and see how the debt grows over time with compound interest.',
    category: 'mortgage',
    icon: 'Home',
    keywords: ['equity release', 'lifetime mortgage', 'release equity', 'over 55'],
    metaTitle: 'Equity Release Calculator UK 2026 — Lifetime Mortgage',
    priority: 2,
  },
  {
    slug: 'moving-cost-calculator',
    title: 'Home Moving Cost Calculator',
    description: 'Calculate the total costs of buying a home — solicitor, stamp duty, survey, mortgage fees and removals.',
    category: 'mortgage',
    icon: 'Home',
    keywords: ['moving cost', 'buying cost', 'conveyancing', 'survey cost', 'home buying'],
    metaTitle: 'UK House Moving Cost Calculator 2026',
    priority: 2,
  },
  // PAY (additional)
  {
    slug: 'paternity-pay-calculator',
    title: 'Statutory Paternity Pay Calculator',
    description: 'Calculate SPP entitlement — 2 weeks at £194.32/week or 90% of AWE (whichever is lower).',
    category: 'pay',
    icon: 'Banknote',
    keywords: ['paternity pay', 'SPP', 'statutory paternity pay', 'paternity leave'],
    metaTitle: 'UK Statutory Paternity Pay Calculator 2026 — £194.32/week',
    priority: 2,
    financialYear: '2026-27',
  },
  {
    slug: 'notice-period-calculator',
    title: 'Notice Period Calculator',
    description: 'Calculate your statutory and contractual notice period based on years of service.',
    category: 'pay',
    icon: 'Banknote',
    keywords: ['notice period', 'resignation', 'notice', 'leaving job'],
    metaTitle: 'UK Notice Period Calculator 2026 — Statutory',
    priority: 2,
  },
  {
    slug: 'work-from-home-tax-relief-calculator',
    title: 'Working from Home Tax Relief Calculator',
    description: 'Calculate tax relief for working from home. £6/week flat rate or actual costs claim.',
    category: 'pay',
    icon: 'Banknote',
    keywords: ['work from home', 'WFH', 'tax relief', 'home office', 'P87'],
    metaTitle: 'Work From Home Tax Relief UK 2026/27',
    priority: 2,
  },
  // CONSTRUCTION (additional)
  {
    slug: 'insulation-calculator',
    title: 'Insulation Calculator',
    description: 'Compare loft, cavity wall, solid wall and floor insulation costs, savings and payback periods.',
    category: 'building',
    icon: 'Hammer',
    keywords: ['insulation', 'loft insulation', 'cavity wall', 'energy efficiency', 'EPC'],
    metaTitle: 'Insulation Calculator UK — Loft U-Value',
    priority: 2,
  },
  // BUSINESS (additional)
  {
    slug: 'vat-return-calculator',
    title: 'VAT Return Calculator',
    description: 'Calculate your VAT return — output VAT on sales vs input VAT on purchases. See amount due or refund.',
    category: 'business',
    icon: 'Briefcase',
    keywords: ['VAT return', 'VAT due', 'output VAT', 'input VAT', 'quarterly VAT'],
    metaTitle: 'VAT Return Calculator — UK 2026/27 Business Calculator',
    priority: 2,
  },
  {
    slug: 'payroll-calculator',
    title: 'Payroll Calculator — UK PAYE & NI',
    description: 'Run a monthly payroll calculation showing payslip breakdown, tax, NI, pension and employer costs.',
    category: 'business',
    icon: 'Briefcase',
    keywords: ['payroll', 'payslip', 'run payroll', 'PAYE', 'employer costs'],
    metaTitle: 'UK Payroll Calculator 2026/27',
    priority: 1,
  },
  {
    slug: 'late-payment-interest-calculator',
    title: 'Late Payment Interest Calculator',
    description: 'Calculate statutory interest and compensation on overdue commercial invoices under UK law.',
    category: 'business',
    icon: 'Briefcase',
    keywords: ['late payment', 'invoice interest', 'statutory interest', 'commercial debt'],
    metaTitle: 'Late Payment Interest Calculator UK (BoE+8%)',
    priority: 2,
  },
  // PAY (additional)
  {
    slug: 'overtime-calculator',
    title: 'Overtime Pay Calculator',
    description: 'Calculate overtime earnings at time-and-a-half, double time or custom rates.',
    category: 'pay',
    icon: 'Banknote',
    keywords: ['overtime', 'overtime pay', 'time and a half', 'double time', 'extra hours'],
    metaTitle: 'Overtime Pay Calculator UK 2026 — Time-and-a-Half & Double Time',
    priority: 2,
  },
  {
    slug: 'nhs-pay-calculator',
    title: 'NHS Pay Calculator (Agenda for Change)',
    description: 'Calculate NHS salary, take-home pay and hourly rate by Agenda for Change pay band.',
    category: 'pay',
    icon: 'Banknote',
    keywords: ['NHS pay', 'agenda for change', 'AFC band', 'nurse salary', 'NHS salary'],
    metaTitle: 'NHS Pay Calculator 2026/27 — Agenda for Change Bands',
    priority: 2,
  },
  // BENEFITS (additional)
  {
    slug: 'childcare-cost-calculator',
    title: 'Childcare Costs Calculator (Tax-Free Childcare)',
    description: 'Calculate childcare costs with Tax-Free Childcare and 30 hours free entitlement.',
    category: 'benefits',
    icon: 'Shield',
    keywords: ['childcare', 'tax free childcare', '30 hours free', 'nursery costs', 'childminder'],
    metaTitle: 'Childcare Cost Calculator UK 2026 — Tax-Free',
    priority: 2,
  },
  // AUTO (additional)
  {
    slug: 'mot-date-calculator',
    title: 'MOT Date Calculator',
    description: 'Find when your next MOT is due. First MOT 3 years after registration, then annual.',
    category: 'auto',
    icon: 'Car',
    keywords: ['MOT', 'MOT date', 'MOT due', 'car MOT', 'vehicle test'],
    metaTitle: 'MOT Date Calculator UK — When Is My MOT Due?',
    priority: 2,
  },
  {
    slug: 'train-season-ticket-calculator',
    title: 'Train Season Ticket Calculator',
    description: 'Compare daily, weekly, monthly and annual season ticket costs to find the best value.',
    category: 'auto',
    icon: 'Car',
    keywords: ['season ticket', 'train ticket', 'rail pass', 'commuter ticket'],
    metaTitle: 'Train Season Ticket Calculator UK 2026',
    priority: 2,
  },
  {
    slug: 'car-depreciation-calculator',
    title: 'Car Depreciation Calculator',
    description: 'Estimate your car\'s value over time using average UK depreciation curves.',
    category: 'auto',
    icon: 'Car',
    keywords: ['car depreciation', 'car value', 'vehicle depreciation', 'resale value'],
    metaTitle: 'Car Depreciation Calculator UK 2026',
    priority: 2,
  },
  {
    slug: 'driving-test-cost-calculator',
    title: 'Driving Test Cost Calculator',
    description: 'Calculate the total cost of learning to drive — lessons, theory test, practical test and provisional licence.',
    category: 'auto',
    icon: 'Car',
    keywords: ['driving test', 'driving lessons', 'learn to drive', 'provisional licence', 'DVSA'],
    metaTitle: 'UK Driving Test Cost Calculator 2026',
    priority: 2,
  },
  {
    slug: 'mpg-calculator',
    title: 'Miles Per Gallon Calculator',
    description: 'Calculate your car\'s fuel economy in MPG, L/100km and km/L from distance and fuel used.',
    category: 'auto',
    icon: 'Car',
    keywords: ['MPG', 'miles per gallon', 'fuel economy', 'fuel consumption', 'L/100km'],
    metaTitle: 'MPG Calculator UK — Miles Per Gallon & L/100km Conversion',
    priority: 2,
  },
  // INSURANCE (additional)
  { slug: 'income-protection-calculator', title: 'Income Protection Calculator', description: 'Calculate income protection cover needed and estimate monthly premiums by age and deferral period.', category: 'insurance', icon: 'ShieldCheck', keywords: ['income protection', 'income insurance', 'sick cover', 'disability insurance'], priority: 2 , metaTitle: 'Income Protection Calculator UK 2026' },
  { slug: 'travel-insurance-calculator', title: 'Travel Insurance Calculator', description: 'Estimate travel insurance premiums for Europe and worldwide trips. Compare cover levels.', category: 'insurance', icon: 'ShieldCheck', keywords: ['travel insurance', 'holiday insurance', 'medical cover', 'trip insurance'], priority: 2 , metaTitle: 'Travel Insurance Calculator UK 2026' },
  // LEGAL (additional)
  { slug: 'spousal-maintenance-calculator', title: 'Spousal Maintenance Calculator', description: 'Estimate spousal maintenance range for divorce. Based on income difference and length of marriage.', category: 'legal', icon: 'Scale', keywords: ['spousal maintenance', 'alimony', 'divorce maintenance', 'spousal support'], priority: 2 , metaTitle: 'Spousal Maintenance Calculator UK 2026' },
  // EDUCATION (additional)
  { slug: 'gcse-grade-calculator', title: 'GCSE Grade Calculator (9-1)', description: 'Calculate Attainment 8 score, average grade and pass counts from your GCSE grades.', category: 'education', icon: 'GraduationCap', keywords: ['GCSE', 'GCSE grades', 'attainment 8', '9-1 grades', 'school results'], priority: 1 , metaTitle: 'GCSE Grade Calculator UK 2026 (9-1 Scale)' },
  { slug: 'university-cost-calculator', title: 'University Cost Calculator', description: 'Calculate the total cost of university including tuition fees, maintenance loan and living costs.', category: 'education', icon: 'GraduationCap', keywords: ['university cost', 'uni fees', 'student debt', 'tuition fees', 'student finance'], priority: 2 , metaTitle: 'UK University Cost Calculator 2026' },
  // GARDENING (additional)
  { slug: 'greenhouse-size-calculator', title: 'Greenhouse Size Calculator', description: 'Calculate greenhouse growing capacity. See how many plants fit by type with common size presets.', category: 'gardening', icon: 'Flower2', keywords: ['greenhouse', 'greenhouse size', 'growing space', 'greenhouse plants'], priority: 2 , metaTitle: 'Greenhouse Size Calculator UK' },
  { slug: 'pond-volume-calculator', title: 'Pond Volume Calculator', description: 'Calculate pond volume in litres, pump size and liner dimensions for rectangle, circle or oval ponds.', category: 'gardening', icon: 'Flower2', keywords: ['pond volume', 'pond calculator', 'pond liner', 'garden pond'], priority: 2 , metaTitle: 'Pond Volume Calculator UK — Litres' },
  // TAX (additional)
  { slug: 'side-hustle-tax-calculator', title: 'Side Hustle / Trading Allowance Calculator', description: 'Calculate tax on side hustle income. Use the £1,000 trading allowance or claim actual expenses.', category: 'tax', icon: 'Receipt', keywords: ['side hustle', 'trading allowance', 'extra income', 'freelance tax'], priority: 2 , metaTitle: 'Side Hustle Tax Calculator UK 2026 (£1,000 Allowance)' },
  // LEGAL (additional)
  { slug: 'employment-tribunal-calculator', title: 'Employment Tribunal Award Calculator', description: 'Estimate unfair dismissal tribunal awards — basic award and compensatory award.', category: 'legal', icon: 'Scale', keywords: ['employment tribunal', 'unfair dismissal', 'tribunal award', 'compensation'], priority: 2 , metaTitle: 'Employment Tribunal Calculator UK 2026/27 (£118,223 Cap)' },
  // CONSTRUCTION (additional)
  { slug: 'roof-tiles-calculator', title: 'Roof Tiles Calculator', description: 'Calculate roof tiles, ridge tiles, batten and felt needed based on roof dimensions and pitch.', category: 'building', icon: 'Hammer', keywords: ['roof tiles', 'roofing', 'slate', 'ridge tiles', 'roof area'], priority: 2 , metaTitle: 'Roof Tiles Calculator UK' },
  // ENERGY (additional)
  { slug: 'water-bill-calculator', title: 'Water Bill Calculator', description: 'Estimate your annual water bill for metered or unmetered supply including sewerage charges.', category: 'energy', icon: 'Zap', keywords: ['water bill', 'water rates', 'metered water', 'sewerage'], priority: 2 , metaTitle: 'UK Water Bill Calculator 2026' },
  // MORTGAGE (additional)
  { slug: 'buy-to-let-yield-calculator', title: 'Buy-to-Let Yield Calculator', description: 'Calculate gross yield, net yield, return on deposit and monthly cashflow for buy-to-let investments.', category: 'mortgage', icon: 'Home', keywords: ['buy to let', 'BTL yield', 'rental return', 'property investment'], priority: 2, metaTitle: 'Buy-to-Let Yield Calculator UK 2026 — Gross & Net Rental Return' },
  { slug: 'ltv-calculator', title: 'Loan-to-Value (LTV) Calculator', description: 'Calculate your loan-to-value ratio and see exactly how much it cuts your mortgage rate across 60%/75%/85%/90%/95% tiers.', category: 'mortgage', icon: 'Home', keywords: ['LTV', 'loan to value', 'equity', 'mortgage ratio'], priority: 2, metaTitle: 'LTV Calculator UK 2026 — Loan-to-Value Ratio & Rate Tiers' },
  { slug: 'stamp-duty-additional-property-calculator', title: 'Stamp Duty Additional Property Calculator', description: 'Calculate SDLT with the 5% additional property surcharge for buy-to-let and second homes.', category: 'tax', icon: 'Receipt', keywords: ['additional property', 'second home stamp duty', 'BTL stamp duty', '5% surcharge'], priority: 2 , metaTitle: 'Stamp Duty Additional Property Calculator 2026 — +5% Surcharge' },
  { slug: 'remortgage-calculator', title: 'Remortgage Calculator', description: 'Compare current vs new mortgage rate. See monthly savings, break-even and total cost including fees.', category: 'mortgage', icon: 'Home', keywords: ['remortgage', 'switch mortgage', 'mortgage renewal', 'save on mortgage'], priority: 1 , metaTitle: 'UK Remortgage Calculator 2026 — Save on Switch' },
  { slug: 'debt-to-income-calculator', title: 'Debt-to-Income Ratio Calculator', description: 'Calculate your DTI ratio to see if lenders will approve your mortgage or loan application.', category: 'mortgage', icon: 'Home', keywords: ['debt to income', 'DTI', 'affordability', 'lending ratio'], priority: 2 , metaTitle: 'Debt-to-Income Ratio Calculator UK' },
  // LOANS (additional)
  { slug: 'apr-calculator', title: 'APR Calculator — True Interest Rate', description: 'Calculate the true Annual Percentage Rate of any loan from the amount borrowed and total repaid.', category: 'loans', icon: 'CreditCard', keywords: ['APR', 'annual percentage rate', 'true cost', 'interest rate'], priority: 2 , metaTitle: 'APR Calculator UK 2026 — True Loan Cost' },
  { slug: 'bnpl-calculator', title: 'Buy Now Pay Later Calculator', description: 'Calculate BNPL instalment costs for Klarna, Clearpay and custom plans. See the true cost and late fee risks.', category: 'loans', icon: 'CreditCard', keywords: ['BNPL', 'buy now pay later', 'Klarna', 'Clearpay', 'instalments'], priority: 2 , metaTitle: 'Buy Now Pay Later (BNPL) Cost Calculator UK 2026' },
  // PENSION (additional)
  { slug: 'salary-sacrifice-pension-calculator', title: 'Salary Sacrifice Pension Calculator', description: 'Compare salary sacrifice vs relief at source pension contributions. See tax and NI savings.', category: 'pension', icon: 'PiggyBank', keywords: ['salary sacrifice pension', 'pension contribution', 'relief at source', 'pension NI saving'], priority: 2, metaTitle: 'Salary Sacrifice Pension Calculator UK 2026/27 — Tax + NI Savings' },
  // TOOLS (additional)
  { slug: 'temperature-converter', title: 'Temperature Converter', description: 'Convert between Celsius, Fahrenheit and Kelvin instantly. Includes common temperature reference points and conversion formulas.', category: 'tools', icon: 'Wrench', keywords: ['temperature', 'celsius', 'fahrenheit', 'kelvin', 'convert temperature'], priority: 2 , metaTitle: 'Temperature Converter — Celsius/Fahrenheit' },
  { slug: 'length-converter', title: 'Length Converter — Metric & Imperial', description: 'Convert between mm, cm, metres, km, inches, feet, yards and miles. Includes feet & inches display.', category: 'tools', icon: 'Wrench', keywords: ['length converter', 'feet to metres', 'inches to cm', 'miles to km'], priority: 2 , metaTitle: 'Length Converter — Metres/Feet/Inches' },
  { slug: 'area-converter', title: 'Area Converter (m² / ft² / acres)', description: 'Convert between square metres, square feet, acres, hectares and more. Includes all common UK area units with instant results.', category: 'tools', icon: 'Wrench', keywords: ['area converter', 'square feet', 'acres', 'hectares', 'square metres'], priority: 2 , metaTitle: 'Area Converter UK — m²/Sq Ft/Acres' },
  { slug: 'cooking-converter', title: 'Cooking Measurement Converter', description: 'Convert between ml, cups, tablespoons, pints and ounces. Includes gas mark to °C/°F chart.', category: 'tools', icon: 'Wrench', keywords: ['cooking converter', 'cups to ml', 'tablespoon', 'gas mark', 'recipe converter'], priority: 2 , metaTitle: 'UK Cooking Converter — Imperial/Metric' },
  { slug: 'timezone-converter', title: 'Time Zone Converter', description: 'Convert times between 15+ world time zones. See all zones at a glance.', category: 'tools', icon: 'Wrench', keywords: ['timezone', 'time zone', 'world clock', 'time difference'], priority: 2 , metaTitle: 'UK Time Zone Converter — GMT/BST' },
  // IMMIGRATION (additional)
  { slug: 'ilr-calculator', title: 'ILR Eligibility Calculator', description: 'Check if you qualify for Indefinite Leave to Remain based on your visa route, time in UK and absences.', category: 'immigration', icon: 'Globe', keywords: ['ILR', 'indefinite leave', 'settlement', 'permanent residence'], priority: 1 , metaTitle: 'UK ILR Eligibility Calculator 2026 — 5 Years' },
  // HEALTH (additional)
  { slug: 'steps-to-miles-calculator', title: 'Steps to Miles/Km Calculator', description: 'Convert steps to distance, calories and walking time based on your height and stride length.', category: 'health', icon: 'Heart', keywords: ['steps', 'steps to miles', 'walking distance', 'step counter', 'pedometer'], priority: 2 , metaTitle: 'Steps to Miles Calculator UK' },
  { slug: 'heart-rate-zone-calculator', title: 'Heart Rate Zone Calculator', description: 'Calculate your 5 heart rate training zones using the Karvonen formula with resting heart rate.', category: 'health', icon: 'Heart', keywords: ['heart rate zones', 'training zones', 'max heart rate', 'Karvonen', 'cardio zones'], priority: 2 , metaTitle: 'Heart Rate Zone Calculator — Training Zones' },
  // MATH (additional)
  { slug: 'probability-calculator', title: 'Probability Calculator', description: 'Calculate event probabilities, combinations and permutations. P(A or B), P(A and B), nCr, nPr.', category: 'math', icon: 'Calculator', keywords: ['probability', 'combinations', 'permutations', 'nCr', 'nPr', 'odds'], priority: 2 , metaTitle: 'Probability Calculator — Free Online' },
  // TAX
  { slug: 'annual-tax-summary-calculator', title: 'Annual Tax Summary Calculator', description: 'Calculate your total tax bill from all income sources — salary, dividends, self-employment, rental and capital gains.', category: 'tax', icon: 'Receipt', keywords: ['annual tax', 'tax summary', 'total tax', 'all income', 'tax bill'], priority: 1 , metaTitle: 'Annual Tax Summary Calculator UK 2026/27' },
  // BUSINESS
  { slug: 'business-rates-calculator', title: 'Business Rates Calculator', description: 'Calculate UK business rates from rateable value using the 2026/27 multiplier. Includes Small Business Rate Relief.', category: 'business', icon: 'Briefcase', keywords: ['business rates', 'rateable value', 'SBRR', 'commercial property'], priority: 2, metaTitle: 'Business Rates Calculator UK 2026/27' },
  { slug: 'rd-tax-credit-calculator', title: 'R&D Tax Credit Calculator', description: 'Estimate R&D tax credits for profitable and loss-making companies under the merged RDEC scheme.', category: 'business', icon: 'Briefcase', keywords: ['R&D', 'tax credits', 'RDEC', 'research development', 'innovation'], priority: 2 , metaTitle: 'R&D Tax Credit Calculator UK 2026' },
  { slug: 'cis-calculator', title: 'CIS Subcontractor Tax Calculator', description: 'Calculate CIS deductions on subcontractor invoices at 20%, 30% or gross payment status.', category: 'business', icon: 'Briefcase', keywords: ['CIS', 'construction industry scheme', 'subcontractor', 'CIS deduction'], priority: 2 , metaTitle: 'CIS Calculator UK 2026/27' },
  // INSURANCE
  { slug: 'pet-insurance-calculator', title: 'Pet Insurance Calculator', description: 'Estimate pet insurance premiums for dogs and cats by age, breed and cover level.', category: 'insurance', icon: 'ShieldCheck', keywords: ['pet insurance', 'dog insurance', 'cat insurance', 'vet fees'], priority: 2 , metaTitle: 'Pet Insurance Calculator UK 2026' },
  // EDUCATION
  { slug: 'student-maintenance-loan-calculator', title: 'Student Maintenance Loan Calculator', description: 'Estimate your maintenance loan based on household income and living situation. England 2026/27 rates.', category: 'education', icon: 'GraduationCap', keywords: ['maintenance loan', 'student loan', 'student finance', 'living costs loan'], priority: 1 , metaTitle: 'Student Maintenance Loan Calculator UK 2026/27' },
  // ENERGY
  { slug: 'boiler-replacement-calculator', title: 'Boiler Replacement Cost Calculator', description: 'Compare old vs new boiler efficiency. Calculate installation cost, annual savings and payback period.', category: 'energy', icon: 'Zap', keywords: ['boiler', 'boiler replacement', 'gas boiler', 'new boiler cost'], priority: 2 , metaTitle: 'Boiler Replacement Cost Calculator UK 2026' },
  { slug: 'double-glazing-calculator', title: 'Double Glazing Savings Calculator', description: 'Calculate double glazing costs and annual energy savings by house type. See payback period.', category: 'energy', icon: 'Zap', keywords: ['double glazing', 'windows', 'energy saving', 'UPVC'], priority: 2 , metaTitle: 'Double Glazing Savings Calculator UK 2026' },
  // HEALTH
  { slug: 'weight-loss-calculator', title: 'Weight Loss Calculator', description: 'Calculate how long to reach your target weight with milestones and daily calorie deficit.', category: 'health', icon: 'Heart', keywords: ['weight loss', 'lose weight', 'diet calculator', 'calorie deficit'], priority: 2 , metaTitle: 'Weight Loss Calculator UK — Calorie Deficit' },
  { slug: 'protein-intake-calculator', title: 'Protein Intake Calculator', description: 'Calculate daily protein needs by weight and goal. See common protein sources per serving.', category: 'health', icon: 'Heart', keywords: ['protein', 'protein intake', 'daily protein', 'macros', 'muscle building'], priority: 2 , metaTitle: 'Protein Intake Calculator UK — By Goal' },
  { slug: 'ovulation-calculator', title: 'Ovulation Calculator', description: 'Estimate ovulation date and fertile window based on your last period and cycle length. See 3 cycles ahead.', category: 'health', icon: 'Heart', keywords: ['ovulation', 'fertile window', 'conception', 'period tracker', 'fertility'], priority: 2 , metaTitle: 'Ovulation Calculator UK — Fertile Window' },
  // AUTO
  { slug: 'car-lease-vs-buy-calculator', title: 'Car Lease vs Buy Calculator', description: 'Compare leasing vs buying a car on finance. See which is cheaper after depreciation and interest.', category: 'auto', icon: 'Car', keywords: ['lease vs buy', 'car lease', 'PCH', 'car finance comparison'], priority: 2 , metaTitle: 'Car Lease vs Buy Calculator UK 2026' },
  // BUSINESS
  { slug: 'sole-trader-vs-ltd-calculator', title: 'Sole Trader vs Limited Company Calculator', description: 'Compare take-home pay as a sole trader vs limited company director. See full tax breakdown for both.', category: 'business', icon: 'Briefcase', keywords: ['sole trader vs ltd', 'incorporate', 'limited company', 'self employed'], priority: 1 , metaTitle: 'Sole Trader vs Limited Company Calculator UK 2026/27' },
  // BENEFITS
  { slug: 'carer-allowance-calculator', title: "Carer's Allowance Calculator", description: "Check if you qualify for Carer's Allowance at £83.30/week and understand the eligibility rules.", category: 'benefits', icon: 'Shield', keywords: ['carer allowance', 'caring', 'disability benefit', 'carer'], priority: 2, metaTitle: "Carer's Allowance Calculator 2026/27" },
  { slug: 'pension-credit-calculator', title: 'Pension Credit Calculator', description: 'Estimate Pension Credit Guarantee Credit entitlement based on income, pension and savings.', category: 'benefits', icon: 'Shield', keywords: ['pension credit', 'guarantee credit', 'retirement benefit', 'over 66'], priority: 2, metaTitle: 'Pension Credit Calculator UK 2026/27 — £227.10 Top-up' },
  { slug: 'housing-benefit-calculator', title: 'Housing Benefit Calculator', description: 'Estimate Housing Benefit based on rent, LHA rate and income. Includes taper calculation.', category: 'benefits', icon: 'Shield', keywords: ['housing benefit', 'LHA', 'rent help', 'housing element'], priority: 2, metaTitle: 'Housing Benefit Calculator UK 2026 — LHA Rates' },
  // BUSINESS
  { slug: 'vat-threshold-calculator', title: 'VAT Threshold Monitor', description: 'Track your rolling 12-month turnover against the £90,000 VAT registration threshold. See headroom remaining.', category: 'business', icon: 'Briefcase', keywords: ['VAT threshold', 'VAT registration', '£90000', 'turnover monitor'], priority: 2 , metaTitle: 'VAT Threshold Calculator UK (£90,000)' },
  { slug: 'umbrella-company-calculator', title: 'Umbrella Company Calculator', description: 'Calculate take-home pay through an umbrella company. See full payslip breakdown with employer NI and fees.', category: 'pay', icon: 'Banknote', keywords: ['umbrella company', 'umbrella pay', 'contractor umbrella', 'PAYE umbrella'], priority: 2 , metaTitle: 'Umbrella Company Calculator UK 2026/27' },
  // CONSTRUCTION
  { slug: 'plaster-calculator', title: 'Plaster Calculator — Bags & Coverage', description: 'Calculate plaster needed in 25kg bags for skim coat, bonding/browning or one-coat plaster.', category: 'building', icon: 'Hammer', keywords: ['plaster', 'plastering', 'skim coat', 'bonding', 'browning'], priority: 2 , metaTitle: 'Plaster Calculator UK — Bags Needed' },
  { slug: 'staircase-calculator', title: 'Staircase Calculator', description: 'Calculate risers, treads, pitch and going for a staircase. Checks Building Regulations Part K compliance.', category: 'building', icon: 'Hammer', keywords: ['staircase', 'stairs', 'risers', 'treads', 'building regs'], priority: 2 , metaTitle: 'Staircase Calculator UK — Building Regs' },
  // EDUCATION
  { slug: 'exam-score-calculator', title: 'Exam Score Calculator', description: 'Calculate exam percentage and grade. Find out what score you need on remaining papers to hit your target.', category: 'education', icon: 'GraduationCap', keywords: ['exam score', 'grade calculator', 'marks needed', 'pass mark'], priority: 2 , metaTitle: 'Exam Score Calculator UK' },
  // MATH
  { slug: 'roman-numeral-converter', title: 'Roman Numeral Converter', description: 'Convert between decimal numbers and Roman numerals (I, V, X, L, C, D, M). Both directions.', category: 'math', icon: 'Calculator', keywords: ['roman numerals', 'roman numbers', 'numeral converter', 'MMXXV'], priority: 2 , metaTitle: 'Roman Numeral Converter — Free Online' },
  // BUSINESS
  { slug: 'capital-allowances-calculator', title: 'Capital Allowances Calculator', description: 'Calculate AIA, Full Expensing or Writing Down Allowance on business assets. See year-by-year tax relief.', category: 'business', icon: 'Briefcase', keywords: ['capital allowances', 'AIA', 'full expensing', 'writing down allowance', 'WDA'], priority: 2 , metaTitle: 'Capital Allowances Calculator UK 2026/27 (AIA £1m)' },
  { slug: 'cash-flow-calculator', title: 'Cash Flow Calculator', description: 'Project monthly cash flow with income and expenses. See closing balance and lowest point.', category: 'business', icon: 'Briefcase', keywords: ['cash flow', 'cash flow forecast', 'business planning', 'liquidity'], priority: 2 , metaTitle: 'Cash Flow Calculator UK 2026' },
  // IMMIGRATION
  { slug: 'spouse-visa-calculator', title: 'UK Spouse Visa Income Calculator', description: 'Check if you meet the £29,000 minimum income for a UK Spouse visa. Includes savings calculation and total visa costs.', category: 'immigration', icon: 'Globe', keywords: ['spouse visa', 'partner visa', 'minimum income', 'family visa'], priority: 1 , metaTitle: 'UK Spouse Visa Income Calculator 2026 (£29,000)' },
  // FARMING
  { slug: 'farm-operating-cost-calculator', title: 'Farm Operating Cost Calculator', description: 'Calculate per-hectare costs and profitability for arable farming. See break-even price per tonne.', category: 'farming', icon: 'Wheat', keywords: ['farm costs', 'arable', 'farming profit', 'cost per hectare', 'break even'], priority: 1 , metaTitle: 'Farm Operating Cost Calculator UK 2026' },
  // LEGAL
  { slug: 'personal-injury-calculator', title: 'Personal Injury Compensation Calculator', description: 'Estimate personal injury compensation based on Judicial College Guidelines for common injury types.', category: 'legal', icon: 'Scale', keywords: ['personal injury', 'compensation', 'whiplash claim', 'accident claim'], priority: 2 , metaTitle: 'Personal Injury Compensation Calculator UK 2026 (JCG)' },
  // INVESTMENT
  { slug: 'investment-return-calculator', title: 'Investment Return Calculator', description: 'Calculate nominal and real (inflation-adjusted) investment returns with monthly contributions over time.', category: 'investment', icon: 'TrendingUp', keywords: ['investment return', 'portfolio growth', 'nominal return', 'real return'], priority: 1 , metaTitle: 'Investment Return Calculator UK 2026' },
  { slug: 'savings-interest-tax-calculator', title: 'Savings Interest Tax Calculator', description: 'Calculate tax on savings interest above your Personal Savings Allowance. See max tax-free savings.', category: 'investment', icon: 'TrendingUp', keywords: ['savings interest', 'PSA', 'personal savings allowance', 'tax on savings'], priority: 2 , metaTitle: 'Savings Interest Tax Calculator UK 2026/27' },
  { slug: 'real-return-calculator', title: 'Real Return Calculator (After Inflation)', description: 'Calculate the real return on investments after accounting for inflation. See purchasing power impact.', category: 'investment', icon: 'TrendingUp', keywords: ['real return', 'after inflation', 'purchasing power', 'inflation adjusted'], priority: 2 , metaTitle: 'Real Return Calculator UK 2026 (After Inflation)' },
  { slug: 'rule-of-72-calculator', title: 'Rule of 72 Calculator', description: 'Estimate how long it takes to double your money at a given interest rate using the Rule of 72.', category: 'investment', icon: 'TrendingUp', keywords: ['rule of 72', 'doubling time', 'compound interest', 'money double'], priority: 2 , metaTitle: 'Rule of 72 Calculator — Investment Doubling' },
  { slug: 'cost-of-delay-calculator', title: 'Cost of Delay Calculator', description: 'See how much you lose by waiting to invest. Compare starting now vs delaying by 1-10+ years.', category: 'investment', icon: 'TrendingUp', keywords: ['cost of delay', 'start investing', 'compound growth', 'time in market'], priority: 2 , metaTitle: 'Cost of Delay Calculator — Not Investing' },
  // PAY
  { slug: 'teacher-pay-calculator', title: 'Teacher Pay Calculator', description: 'Calculate teacher salary by pay scale (M1-M6, UPS, Leadership). Includes London weighting and take-home pay.', category: 'pay', icon: 'Banknote', keywords: ['teacher pay', 'teacher salary', 'MPS', 'UPS', 'leadership pay'], priority: 2, metaTitle: 'UK Teacher Pay Calculator 2026/27 — M1-UPS3 Scales' },
  { slug: 'shared-parental-leave-calculator', title: 'Shared Parental Leave Calculator', description: 'Split parental leave between parents. Calculate ShPP payments for mother and partner.', category: 'pay', icon: 'Banknote', keywords: ['shared parental leave', 'ShPL', 'ShPP', 'parental pay'], priority: 2, metaTitle: 'Shared Parental Leave Pay Calculator UK 2026/27' },
  // BENEFITS
  { slug: 'high-income-child-benefit-calculator', title: 'High Income Child Benefit Charge Calculator', description: 'Calculate HICBC clawback between £60K-£80K. See if you should still claim for NI credits.', category: 'benefits', icon: 'Shield', keywords: ['HICBC', 'high income', 'child benefit charge', 'clawback'], priority: 1, metaTitle: 'High Income Child Benefit Charge Calculator 2026/27 (Threshold £60k)' },
  { slug: 'benefit-cap-calculator', title: 'Benefit Cap Calculator', description: 'Check if the benefit cap applies and how much your benefits will be reduced.', category: 'benefits', icon: 'Shield', keywords: ['benefit cap', 'cap limit', 'benefits limit', 'UC cap'], priority: 2, metaTitle: 'Benefit Cap Calculator UK 2026 — £15,010 / £22,394 Limits' },
  // MATH
  { slug: 'trigonometry-calculator', title: 'Trigonometry Calculator', description: 'Calculate sin, cos, tan and inverse functions in degrees or radians. Includes sec, csc, cot.', category: 'math', icon: 'Calculator', keywords: ['trigonometry', 'sin cos tan', 'trig calculator', 'inverse trig', 'radians'], priority: 2 , metaTitle: 'Trigonometry Calculator — sin/cos/tan' },
  // PAY
  { slug: 'freelance-tax-calculator', title: 'Freelance Tax Calculator', description: 'Calculate freelancer take-home pay from day rate. Includes tax, NI, expenses and VAT threshold warning.', category: 'pay', icon: 'Banknote', keywords: ['freelance tax', 'freelancer', 'day rate tax', 'self employed'], priority: 1 , metaTitle: 'Freelance Tax Calculator UK 2026/27' },
  // HEALTH
  { slug: 'macro-calculator', title: 'Macro Calculator — Protein, Carbs & Fat', description: 'Calculate daily protein, carbs and fat targets based on your body stats, activity and goal.', category: 'health', icon: 'Heart', keywords: ['macros', 'macro calculator', 'protein carbs fat', 'nutrition', 'IIFYM'], priority: 2 , metaTitle: 'Macro Calculator UK — TDEE-Based' },
  // TOOLS
  { slug: 'cost-of-living-calculator', title: 'Cost of Living Calculator', description: 'Track monthly expenses against take-home pay. See surplus or shortfall with editable UK average costs.', category: 'tools', icon: 'Wrench', keywords: ['cost of living', 'budget', 'monthly expenses', 'living costs', 'affordability'], priority: 1 , metaTitle: 'UK Cost of Living Calculator 2026' },
  { slug: 'smart-meter-calculator', title: 'Smart Meter / Appliance Cost Calculator', description: 'Calculate daily electricity cost from individual appliances. Adjust usage hours for each device.', category: 'energy', icon: 'Zap', keywords: ['smart meter', 'appliance cost', 'electricity usage', 'device cost'], priority: 2 , metaTitle: 'Smart Meter Savings Calculator UK 2026' },
  { slug: 'gpa-calculator', title: 'GPA Calculator (UK)', description: 'Calculate UK GPA from module grades and credits. See degree classification equivalent.', category: 'education', icon: 'GraduationCap', keywords: ['GPA', 'grade point average', 'degree class', 'university grades'], priority: 2 , metaTitle: 'UK GPA Calculator (Honours + 4.0 Scale)' },
  { slug: 'solicitor-fee-calculator', title: 'Solicitor Fee Estimate Calculator', description: 'Estimate solicitor fees for conveyancing, divorce, wills, probate and employment matters.', category: 'legal', icon: 'Scale', keywords: ['solicitor fees', 'legal fees', 'conveyancing cost', 'divorce cost', 'will cost'], priority: 1 , metaTitle: 'UK Solicitor Fee Calculator 2026' },
  { slug: 'divorce-settlement-calculator', title: 'Divorce Financial Settlement Calculator', description: 'Estimate how assets might be split in a divorce — property, pensions, savings and debts.', category: 'legal', icon: 'Scale', keywords: ['divorce settlement', 'financial split', 'matrimonial assets', 'divorce calculator'], priority: 2 , metaTitle: 'UK Divorce Settlement Calculator 2026' },
  { slug: 'uk-citizenship-calculator', title: 'UK Citizenship Eligibility Calculator', description: 'Check citizenship eligibility after ILR. See timeline, absence limits and total application costs.', category: 'immigration', icon: 'Globe', keywords: ['citizenship', 'naturalisation', 'British citizenship', 'citizenship cost'], priority: 2 , metaTitle: 'UK Citizenship Eligibility Calculator 2026' },
  { slug: 'free-school-meals-calculator', title: 'Free School Meals Eligibility Calculator', description: 'Check if your children qualify for free school meals. See annual savings and qualifying benefits.', category: 'benefits', icon: 'Shield', keywords: ['free school meals', 'FSM', 'school dinners', 'pupil premium'], priority: 2 , metaTitle: 'Free School Meals Eligibility Calculator UK 2026' },
  { slug: 'loft-conversion-calculator', title: 'Loft Conversion Cost Calculator', description: 'Estimate loft conversion costs by type (Velux, dormer, hip-to-gable, mansard). See ROI and value added.', category: 'building', icon: 'Hammer', keywords: ['loft conversion', 'attic conversion', 'dormer', 'loft extension'], priority: 2 , metaTitle: 'Loft Conversion Cost Calculator UK 2026' },
  { slug: 'extension-cost-calculator', title: 'Extension Cost Calculator', description: 'Estimate home extension costs per m² for single/double storey, side return and wrap-around extensions.', category: 'building', icon: 'Hammer', keywords: ['extension cost', 'house extension', 'rear extension', 'building costs'], priority: 2 , metaTitle: 'House Extension Cost Calculator UK 2026' },
  { slug: 'childcare-entitlement-calculator', title: '30 Hours Free Childcare Calculator', description: 'Check free childcare entitlement by age (15/30 hours). See savings with Tax-Free Childcare.', category: 'benefits', icon: 'Shield', keywords: ['30 hours', 'free childcare', 'childcare entitlement', '15 hours', 'working parents'], priority: 1 , metaTitle: 'Childcare Entitlement Calculator UK 2026 (30 Hrs)' },
  { slug: 'stock-unit-calculator', title: 'Livestock Stock Unit Calculator', description: 'Calculate total livestock units for cattle, sheep, pigs and horses. See land requirement at 2 SU/ha.', category: 'farming', icon: 'Wheat', keywords: ['stock units', 'livestock units', 'stocking rate', 'cattle sheep'], priority: 2 , metaTitle: 'Stock Unit Calculator — Inventory' },
  { slug: 'agricultural-worker-wage-calculator', title: 'Agricultural Worker Minimum Wage Calculator', description: 'Calculate agricultural wages by AWO grade (1-6). Includes overtime at 1.5x and holiday entitlement.', category: 'farming', icon: 'Wheat', keywords: ['agricultural wages', 'AWO', 'farm worker pay', 'agricultural minimum wage'], priority: 2 , metaTitle: 'Agricultural Worker Wage Calculator UK 2026' },
  // MATH
  { slug: 'mean-median-mode-calculator', title: 'Mean, Median & Mode Calculator', description: 'Calculate mean, median, mode, range, sum, min and max from a set of numbers. Shows sorted data.', category: 'math', icon: 'Calculator', keywords: ['mean', 'median', 'mode', 'average', 'statistics'], priority: 1 , metaTitle: 'Mean Median Mode Calculator — Free Online' },
  { slug: 'prime-number-calculator', title: 'Prime Number Checker', description: 'Check if a number is prime, find prime factorisation, and list primes up to N.', category: 'math', icon: 'Calculator', keywords: ['prime number', 'prime checker', 'factorisation', 'prime factor'], priority: 2 , metaTitle: 'Prime Number Calculator — Check & List' },
  // HEALTH
  { slug: 'waist-hip-ratio-calculator', title: 'Waist-to-Hip Ratio Calculator', description: 'Calculate your waist-to-hip ratio and cardiovascular disease risk using WHO guidelines.', category: 'health', icon: 'Heart', keywords: ['waist hip ratio', 'WHR', 'body shape', 'cardiovascular risk'], priority: 2 , metaTitle: 'Waist-Hip Ratio Calculator UK — NHS' },
  // GARDENING
  { slug: 'raised-bed-calculator', title: 'Raised Bed Soil Calculator', description: 'Calculate soil, bags and sleepers needed for raised garden beds with common size presets.', category: 'gardening', icon: 'Flower2', keywords: ['raised bed', 'garden bed', 'soil calculator', 'sleepers'], priority: 1 , metaTitle: 'Raised Bed Soil Calculator UK' },
  { slug: 'fence-paint-calculator', title: 'Fence Paint Calculator', description: 'Calculate fence paint or stain needed based on panels, height and number of coats.', category: 'gardening', icon: 'Flower2', keywords: ['fence paint', 'fence stain', 'garden fence', 'fence treatment'], priority: 2, metaTitle: 'Fence Paint Calculator UK — Litres for Garden Fencing' },
  // TOOLS
  { slug: 'clothing-size-converter', title: 'Clothing Size Converter (UK/EU/US)', description: 'Convert clothing sizes between UK, EU and US for women and men. Includes body measurements.', category: 'tools', icon: 'Wrench', keywords: ['clothing size', 'dress size', 'UK to EU', 'size chart', 'size converter'], priority: 2 , metaTitle: 'UK Clothing Size Converter (UK/EU/US)' },
  { slug: 'volume-converter', title: 'Volume Converter — Litres, Gallons & More', description: 'Convert between ml, litres, pints, gallons, cups, tablespoons and cubic metres.', category: 'tools', icon: 'Wrench', keywords: ['volume converter', 'litres to pints', 'ml to cups', 'gallons'], priority: 2 , metaTitle: 'Volume Converter — Litres/Pints/Gallons' },
  { slug: 'birthday-calculator', title: 'Birthday Calculator', description: 'Find your day of birth, star sign, Chinese zodiac, days alive and upcoming milestone birthdays.', category: 'tools', icon: 'Wrench', keywords: ['birthday', 'star sign', 'zodiac', 'born on', 'days alive'], priority: 2 , metaTitle: 'Birthday Calculator — Next Birthday Countdown' },
  // INSURANCE
  { slug: 'employers-liability-calculator', title: "Employers' Liability Insurance Calculator", description: "Estimate employers' liability insurance premiums by industry and annual wages. Legal requirement for UK businesses.", category: 'insurance', icon: 'ShieldCheck', keywords: ['employers liability', 'EL insurance', 'business insurance', 'employee insurance'], priority: 2 , metaTitle: 'Employers\' Liability Insurance Calculator UK 2026' },
  { slug: 'car-insurance-estimate-calculator', title: 'Car Insurance Estimate Calculator', description: 'Estimate car insurance premiums by age, cover level, no claims bonus, insurance group and mileage.', category: 'insurance', icon: 'ShieldCheck', keywords: ['car insurance', 'motor insurance', 'NCB', 'insurance group', 'insurance quote'], priority: 1 , metaTitle: 'Car Insurance Estimate Calculator UK 2026' },
  { slug: 'home-insurance-calculator', title: 'Home Insurance Estimate Calculator', description: 'Estimate home insurance premiums for buildings, contents or combined cover by property type.', category: 'insurance', icon: 'ShieldCheck', keywords: ['home insurance', 'buildings insurance', 'contents insurance', 'house insurance'], priority: 2 , metaTitle: 'Home Insurance Calculator UK 2026' },
  { slug: 'critical-illness-calculator', title: 'Critical Illness Cover Calculator', description: 'Estimate critical illness insurance premiums by age, cover amount, term and smoker status.', category: 'insurance', icon: 'ShieldCheck', keywords: ['critical illness', 'CI cover', 'serious illness', 'cancer cover'], priority: 2 , metaTitle: 'Critical Illness Cover Calculator UK 2026' },
  // AUTO
  { slug: 'ev-savings-calculator', title: 'EV vs Petrol Running Cost Calculator', description: 'Compare annual running costs of an electric car vs petrol. See fuel, VED and servicing savings plus CO2 reduction.', category: 'auto', icon: 'Car', keywords: ['EV vs petrol', 'electric car savings', 'EV running cost', 'petrol vs electric'], priority: 1, isTrending: true , metaTitle: 'EV vs Petrol Running Cost Calculator UK 2026' },
  // TAX
  { slug: 'blind-persons-allowance-calculator', title: "Blind Person's Allowance Calculator", description: "Calculate tax saving from Blind Person's Allowance (£3,070 extra tax-free income).", category: 'tax', icon: 'Receipt', keywords: ['blind person', 'BPA', 'sight impaired', 'disability allowance'], priority: 2 , metaTitle: 'Blind Person\'s Allowance Calculator UK 2026/27' },
  { slug: 'property-cgt-calculator', title: 'Capital Gains Tax on Property Calculator', description: 'Calculate CGT on residential property sales with PPR relief, costs and improvements deductions.', category: 'tax', icon: 'Receipt', keywords: ['property CGT', 'house sale tax', 'PPR relief', 'residential CGT'], priority: 1 , metaTitle: 'Property CGT Calculator UK 2026/27 (24% Higher Rate)' },
  // EDUCATION
  { slug: 'weighted-grade-calculator', title: 'Weighted Average Grade Calculator', description: 'Calculate weighted average from assessment components with different weightings. See UK degree classification.', category: 'education', icon: 'GraduationCap', keywords: ['weighted average', 'weighted grade', 'module grades', 'assessment weighting'], priority: 2 , metaTitle: 'Weighted Grade Calculator UK' },
  // IMMIGRATION
  { slug: 'cost-of-living-comparison-calculator', title: 'UK Cost of Living Comparison', description: 'Compare cost of living between UK cities. See rent, food, transport differences and equivalent salary.', category: 'immigration', icon: 'Globe', keywords: ['cost of living', 'city comparison', 'relocation', 'UK cities'], priority: 2 , metaTitle: 'UK Cost of Living Comparison Calculator 2026' },
  // PENSION
  { slug: 'pension-annual-allowance-calculator', title: 'Pension Annual Allowance Calculator', description: 'Check your pension annual allowance (£60K), tapered allowance and MPAA. See if you face a tax charge.', category: 'pension', icon: 'PiggyBank', keywords: ['annual allowance', 'pension limit', 'taper', 'MPAA', 'pension tax charge'], priority: 2, financialYear: '2026-27', metaTitle: 'Pension Annual Allowance Calculator 2026' },
  { slug: 'state-pension-age-calculator', title: 'State Pension Age Calculator', description: 'Find your State Pension age based on date of birth. See exact date and days remaining.', category: 'pension', icon: 'PiggyBank', keywords: ['state pension age', 'SPA', 'pension age', 'when can I retire'], priority: 1, metaTitle: 'UK State Pension Age Calculator — Check Your Pension Date' },
  // LOANS
  { slug: 'student-loan-early-repay-calculator', title: 'Should I Repay Student Loan Early?', description: 'Compare total cost of normal repayments vs lump sum. See if early repayment saves money or wastes it.', category: 'loans', icon: 'CreditCard', keywords: ['early repayment', 'student loan overpay', 'write off', 'plan 2 repay'], priority: 1 , metaTitle: 'Student Loan Early Repayment Calculator UK' },
  // PENSION
  { slug: 'pension-pot-calculator', title: 'How Much Pension Do I Need?', description: 'Calculate the pension pot needed for your target retirement income using drawdown, 4% rule or annuity.', category: 'pension', icon: 'PiggyBank', keywords: ['pension pot needed', 'retirement savings', 'how much pension', '4% rule'], priority: 1, metaTitle: 'Pension Pot Calculator UK 2026 — How Much Will I Have at 65?' },
  { slug: 'teachers-pension-calculator', title: "Teachers' Pension Calculator", description: "Project your Teachers' Pension Scheme (TPS) benefits — career average (1/57th) and final salary calculations with 2026/27 contribution tiers.", category: 'pension', icon: 'PiggyBank', keywords: ['teachers pension', 'TPS', 'career average', 'teaching pension'], priority: 2, metaTitle: "Teachers' Pension Calculator 2026" },
  // INVESTMENT
  { slug: 'junior-isa-calculator', title: 'Junior ISA Calculator', description: 'Calculate how much a Junior ISA will be worth when your child turns 18. Tax-free growth with £9,000/year limit.', category: 'investment', icon: 'TrendingUp', keywords: ['junior ISA', 'JISA', 'child savings', 'under 18'], priority: 2, metaTitle: 'Junior ISA Calculator UK 2026/27 — £9,000 Annual Allowance' },
  // PAY
  { slug: 'zero-hours-calculator', title: 'Zero-Hours Contract Earnings Calculator', description: 'Calculate annual earnings, tax and holiday pay accrual on a zero-hours contract. NMW check included.', category: 'pay', icon: 'Banknote', keywords: ['zero hours', 'zero-hours contract', 'casual work', 'flexible work'], priority: 2 , metaTitle: 'Zero Hours Contract Calculator UK 2026' },
  { slug: 'agency-worker-calculator', title: 'Agency Worker Pay Calculator', description: 'Calculate take-home pay as an agency worker. See what you actually earn after agency margin and deductions.', category: 'pay', icon: 'Banknote', keywords: ['agency worker', 'temp work', 'agency pay', 'charge rate'], priority: 2 , metaTitle: 'Agency Worker Pay Calculator UK 2026 (AWR)' },
  { slug: 'settlement-agreement-calculator', title: 'Settlement Agreement Calculator', description: 'Estimate settlement package: redundancy, notice, holiday, ex-gratia and tax treatment (£30K tax-free).', category: 'pay', icon: 'Banknote', keywords: ['settlement agreement', 'compromise agreement', 'redundancy package', 'termination'], priority: 2 , metaTitle: 'Settlement Agreement Calculator UK 2026' },
  // MORTGAGE
  { slug: 'buy-to-let-mortgage-calculator', title: 'Buy-to-Let Mortgage Calculator', description: 'Calculate BTL mortgage payments (interest-only and repayment). Check rental coverage stress test.', category: 'mortgage', icon: 'Home', keywords: ['buy to let mortgage', 'BTL mortgage', 'rental coverage', 'landlord mortgage'], priority: 2 , metaTitle: 'Buy-to-Let Mortgage Calculator UK 2026' },
  { slug: 'house-price-sqft-calculator', title: 'House Price per Square Foot Calculator', description: 'Calculate price per square foot/metre to compare property value. See how it compares to UK averages.', category: 'mortgage', icon: 'Home', keywords: ['price per sqft', 'price per square foot', 'property value', 'house price'], priority: 2 , metaTitle: 'UK House Price per Sq Ft Calculator' },
  { slug: 'lease-extension-calculator', title: 'Leasehold Extension Calculator', description: 'Estimate lease extension premium including marriage value, ground rent and professional fees.', category: 'mortgage', icon: 'Home', keywords: ['lease extension', 'leasehold', 'marriage value', 'ground rent', 'lease premium'], priority: 2 , metaTitle: 'Lease Extension Calculator UK 2026 — 90-Year Premium' },
  // LOANS
  { slug: 'student-loan-interest-calculator', title: 'Student Loan Interest Calculator', description: 'Calculate your student loan interest rate by income. See how fast your balance grows with compound interest.', category: 'loans', icon: 'CreditCard', keywords: ['student loan interest', 'RPI', 'loan balance', 'interest rate'], priority: 2 , metaTitle: 'Student Loan Interest Calculator UK 2026/27' },
  { slug: 'debt-consolidation-calculator', title: 'Debt Consolidation Calculator', description: 'Compare current debt payments vs a consolidation loan. See if you save on monthly payments and total interest.', category: 'loans', icon: 'CreditCard', keywords: ['debt consolidation', 'combine debts', 'consolidation loan', 'one payment'], priority: 2 , metaTitle: 'Debt Consolidation Calculator UK 2026' },
  { slug: 'postgraduate-loan-calculator', title: 'Postgraduate Loan Repayment Calculator', description: 'Calculate postgraduate loan repayments at 6% above £21,000. See if your balance is growing or shrinking.', category: 'loans', icon: 'CreditCard', keywords: ['postgraduate loan', 'masters loan', 'PG loan', 'postgrad repayment'], priority: 2 , metaTitle: 'Postgraduate Loan Calculator UK 2026/27 (£21k)' },
  // ENERGY
  { slug: 'epc-calculator', title: 'EPC Rating Improvement Calculator', description: 'Estimate your EPC rating and see which upgrades will improve it most. Includes costs and annual savings.', category: 'energy', icon: 'Zap', keywords: ['EPC', 'energy performance', 'EPC rating', 'energy efficiency', 'EPC improvement'], priority: 1, isTrending: true , metaTitle: 'EPC Calculator UK 2026 — Rating Estimator' },
  // CONSTRUCTION
  { slug: 'bathroom-cost-calculator', title: 'Bathroom Cost Calculator', description: 'Estimate bathroom renovation costs for budget, mid-range and premium finishes with optional extras.', category: 'building', icon: 'Hammer', keywords: ['bathroom cost', 'bathroom renovation', 'bathroom refit', 'shower room'], priority: 2 , metaTitle: 'Bathroom Renovation Cost Calculator UK 2026' },
  { slug: 'kitchen-cost-calculator', title: 'Kitchen Cost Calculator', description: 'Estimate kitchen installation costs by budget level. Includes units, worktops, appliances and labour.', category: 'building', icon: 'Hammer', keywords: ['kitchen cost', 'new kitchen', 'kitchen renovation', 'kitchen units'], priority: 2 , metaTitle: 'Kitchen Renovation Cost Calculator UK 2026' },
  { slug: 'timber-calculator', title: 'Timber Calculator — Board Feet & Cost', description: 'Calculate timber volume, total length and cost for construction projects. Common size presets included.', category: 'building', icon: 'Hammer', keywords: ['timber', 'wood', 'lumber', 'timber volume', 'construction timber'], priority: 2 , metaTitle: 'Timber Calculator UK — Length & Volume' },
  { slug: 'underfloor-heating-calculator', title: 'Underfloor Heating Calculator', description: 'Compare water, electric mat and cable underfloor heating. See install costs and running costs vs radiators.', category: 'building', icon: 'Hammer', keywords: ['underfloor heating', 'UFH', 'radiant heating', 'floor heating'], priority: 2 , metaTitle: 'Underfloor Heating Calculator UK 2026' },
  // EDUCATION
  { slug: 'student-allowance-calculator', title: 'Bursary & Scholarship Impact Calculator', description: 'Calculate total student support from maintenance loan plus NHS, teacher training, DSA and other bursaries.', category: 'education', icon: 'GraduationCap', keywords: ['bursary', 'scholarship', 'student allowance', 'NHS bursary', 'DSA'], priority: 2 , metaTitle: 'Student Allowance Calculator UK 2026' },
  // PAY
  { slug: 'night-shift-calculator', title: 'Night Shift Allowance Calculator', description: 'Calculate night shift premium at 15-100% rates. See annual extra earnings from night work.', category: 'pay', icon: 'Banknote', keywords: ['night shift', 'night premium', 'unsocial hours', 'shift pay'], priority: 2 , metaTitle: 'Night Shift Allowance Calculator UK 2026' },
  { slug: 'benefits-in-kind-calculator', title: 'Benefits in Kind (P11D) Calculator', description: 'Calculate tax on company benefits — car, medical insurance, gym, phone and more. See monthly tax impact.', category: 'pay', icon: 'Banknote', keywords: ['benefits in kind', 'P11D', 'BiK tax', 'company benefits', 'perks tax'], priority: 2 , metaTitle: 'Benefits in Kind Tax Calculator 2026/27' },
  // INVESTMENT
  { slug: 'regular-savings-calculator', title: 'Regular Savings Calculator', description: 'Calculate returns on a regular saver account with monthly deposits. See effective vs headline rate.', category: 'investment', icon: 'TrendingUp', keywords: ['regular saver', 'monthly savings', 'savings account', 'AER'], priority: 2 , metaTitle: 'Regular Savings Calculator UK 2026' },
  // PAY
  { slug: 'business-mileage-calculator', title: 'Business Mileage Calculator', description: 'Compare HMRC mileage allowance vs actual fuel costs. See if you profit or lose from the 45p/25p rates.', category: 'pay', icon: 'Banknote', keywords: ['business mileage', 'HMRC mileage', 'mileage profit', '45p rate', 'fuel vs allowance'], priority: 2 , metaTitle: 'Business Mileage Calculator UK (HMRC 45p/25p)' },
  // INVESTMENT
  { slug: 'wealth-growth-calculator', title: 'Wealth Growth Projector', description: 'Project wealth growth over time with annual savings and compound returns. See milestones (£100K, £1M).', category: 'investment', icon: 'TrendingUp', keywords: ['wealth growth', 'wealth projector', 'net worth', 'millionaire calculator'], priority: 2 , metaTitle: 'Wealth Growth Calculator UK 2026' },
  { slug: 'cgt-on-shares-calculator', title: 'CGT on Shares Calculator', description: 'Calculate capital gains tax on share sales. Includes annual exempt amount, basic/higher rates and ISA tip.', category: 'investment', icon: 'TrendingUp', keywords: ['CGT shares', 'share tax', 'stock tax', 'investment tax', 'capital gains shares'], priority: 1 , metaTitle: 'CGT on Shares Calculator UK 2026/27' },
  { slug: 'dividend-income-calculator', title: 'Dividend Income Calculator', description: 'Calculate annual dividend income and project portfolio growth with or without reinvestment (DRIP).', category: 'investment', icon: 'TrendingUp', keywords: ['dividend income', 'dividend yield', 'DRIP', 'passive income', 'dividend investing'], priority: 2 , metaTitle: 'Dividend Income Calculator UK 2026/27' },
  // TAX
  { slug: 'non-dom-tax-calculator', title: 'Non-Dom Tax Calculator (FIG Regime)', description: 'Calculate tax under the new FIG regime for non-domiciled UK residents. 4-year foreign income exemption.', category: 'tax', icon: 'Receipt', keywords: ['non-dom', 'FIG', 'foreign income', 'non-domiciled', 'remittance basis'], priority: 2, isTrending: true , metaTitle: 'UK Non-Dom Tax Calculator 2026/27 (New Rules)' },
  // BUSINESS
  { slug: 'annual-investment-allowance-calculator', title: 'Annual Investment Allowance Calculator', description: 'Calculate AIA tax relief on plant & machinery spending. 100% deduction on first £1M.', category: 'business', icon: 'Briefcase', keywords: ['AIA', 'annual investment allowance', 'plant machinery', 'capital spending'], priority: 2 , metaTitle: 'Annual Investment Allowance Calculator UK (£1m)' },
  // MORTGAGE
  { slug: 'mortgage-interest-rate-calculator', title: 'Mortgage Interest Rate Comparison', description: 'Compare monthly payments at different interest rates. See how rate changes affect your mortgage.', category: 'mortgage', icon: 'Home', keywords: ['mortgage rate', 'interest rate comparison', 'rate change', 'mortgage payment'], priority: 2 , metaTitle: 'Mortgage Interest Rate Calculator UK 2026' },
  { slug: 'first-home-buyer-calculator', title: 'First-Time Buyer Cost Calculator', description: 'Calculate everything a first-time buyer needs: deposit, stamp duty, solicitor, survey, mortgage fees and monthly payments.', category: 'mortgage', icon: 'Home', keywords: ['first home', 'buying costs', 'first time buyer', 'total cost of buying'], priority: 1 , metaTitle: 'UK First-Time Buyer Calculator 2026 — Full Cost' },
  // PENSION
  { slug: 'sipp-calculator', title: 'SIPP Calculator — Self-Invested Pension', description: 'Project your Self-Invested Personal Pension with tax relief, employer contributions and growth.', category: 'pension', icon: 'PiggyBank', keywords: ['SIPP', 'self invested pension', 'personal pension', 'pension pot'], priority: 2, metaTitle: 'SIPP Calculator UK 2026/27 — Self-Invested Pension Pot' },
  // BENEFITS
  { slug: 'tax-credits-calculator', title: 'Tax Credits Calculator (Legacy)', description: 'Calculate Working Tax Credit and Child Tax Credit for existing claimants. Includes childcare element.', category: 'benefits', icon: 'Shield', keywords: ['tax credits', 'working tax credit', 'child tax credit', 'WTC', 'CTC'], priority: 2, metaTitle: 'Tax Credits Calculator UK 2026/27 — Migrated to UC' },
  // INVESTMENT
  { slug: 'stocks-shares-isa-calculator', title: 'Stocks & Shares ISA Calculator', description: 'Project Stocks & Shares ISA growth with capital appreciation and dividends. See tax saved vs taxable account.', category: 'investment', icon: 'TrendingUp', keywords: ['stocks and shares ISA', 'S&S ISA', 'equity ISA', 'investment ISA'], priority: 1 , metaTitle: 'Stocks & Shares ISA Calculator UK 2026/27' },
  // ENERGY
  { slug: 'epc-rating-comparison-calculator', title: 'EPC Band Comparison Calculator', description: 'Compare energy costs between EPC bands. See annual savings from upgrading your rating.', category: 'energy', icon: 'Zap', keywords: ['EPC comparison', 'EPC upgrade', 'energy cost', 'EPC band'], priority: 2 , metaTitle: 'EPC Rating Comparison Calculator UK 2026' },
  // INVESTMENT
  { slug: 'help-to-save-calculator', title: 'Help to Save Calculator', description: 'Calculate Help to Save returns with the 50% government bonus. Max £50/month for 4 years.', category: 'investment', icon: 'TrendingUp', keywords: ['help to save', 'government bonus', '50% bonus', 'low income savings'], priority: 2 , metaTitle: 'Help to Save Calculator UK 2026 — 50% Bonus' },
  { slug: 'ns-i-savings-calculator', title: 'NS&I Savings Calculator', description: 'Calculate savings interest with different compounding frequencies. See AER vs nominal rate.', category: 'investment', icon: 'TrendingUp', keywords: ['NS&I', 'savings interest', 'compounding', 'AER', 'interest rate'], priority: 2 , metaTitle: 'NS&I Savings Calculator UK 2026' },
  // HEALTH
  { slug: 'bmi-children-calculator', title: 'BMI Calculator for Children', description: 'Calculate BMI for children aged 2-18 with age and gender-adjusted interpretation.', category: 'health', icon: 'Heart', keywords: ['child BMI', 'children BMI', 'child weight', 'paediatric BMI'], priority: 2 , metaTitle: 'Children\'s BMI Calculator UK — Centile' },
  // MORTGAGE
  { slug: 'offset-mortgage-calculator', title: 'Offset Mortgage Calculator', description: 'Calculate interest saved by offsetting savings against your mortgage. See equivalent tax-free rate.', category: 'mortgage', icon: 'Home', keywords: ['offset mortgage', 'savings offset', 'interest saving', 'offset account'], priority: 2 , metaTitle: 'Offset Mortgage Calculator UK 2026' },
  { slug: 'ground-rent-calculator', title: 'Ground Rent Calculator', description: 'Calculate ground rent over time with escalation. Flag onerous rents. Includes doubling and RPI clauses.', category: 'mortgage', icon: 'Home', keywords: ['ground rent', 'leasehold', 'rent escalation', 'onerous ground rent'], priority: 2 , metaTitle: 'Ground Rent Calculator UK 2026' },
  { slug: 'service-charge-calculator', title: 'Service Charge Calculator', description: 'Estimate your leasehold service charge from building costs. Includes insurance, maintenance and reserve fund.', category: 'mortgage', icon: 'Home', keywords: ['service charge', 'leasehold costs', 'management fee', 'building insurance'], priority: 2 , metaTitle: 'Service Charge Calculator UK 2026' },
  // PENSION
  { slug: 'pension-consolidation-calculator', title: 'Pension Consolidation Calculator', description: 'Compare keeping multiple pension pots vs consolidating into one. See fee savings over time.', category: 'pension', icon: 'PiggyBank', keywords: ['pension consolidation', 'combine pensions', 'pension fees', 'pension transfer'], priority: 2 , metaTitle: 'Pension Consolidation Calculator UK 2026' },
  { slug: 'employer-pension-contribution-calculator', title: 'Employer Pension Contribution Calculator', description: 'Calculate auto-enrolment pension contributions on qualifying earnings with tax relief.', category: 'pension', icon: 'PiggyBank', keywords: ['employer pension', 'auto enrolment', 'qualifying earnings', 'pension contribution'], priority: 2 , metaTitle: 'Employer Pension Contribution Calculator UK 2026/27' },
  // MORTGAGE
  { slug: 'right-to-buy-calculator', title: 'Right to Buy Calculator', description: 'Calculate your Right to Buy discount for council/housing association properties. Up to 70% off.', category: 'mortgage', icon: 'Home', keywords: ['right to buy', 'council house', 'RTB', 'housing discount'], priority: 2 , metaTitle: 'Right to Buy Calculator UK 2026 — Discount' },
  { slug: 'staircasing-calculator', title: 'Shared Ownership Staircasing Calculator', description: 'Calculate the cost of buying a bigger share of your shared ownership home and new rent.', category: 'mortgage', icon: 'Home', keywords: ['staircasing', 'shared ownership', 'buy more share', 'increase share'], priority: 2 , metaTitle: 'Shared Ownership Staircasing Calculator' },
  // PENSION
  { slug: 'pension-lump-sum-calculator', title: 'Pension Lump Sum Calculator (PCLS)', description: 'Compare taking 0-100% as lump sum. See tax-free portion, tax on excess and remaining pot for drawdown.', category: 'pension', icon: 'PiggyBank', keywords: ['pension lump sum', 'PCLS', 'tax free cash', '25% pension', 'pension withdrawal'], priority: 2 , metaTitle: 'Pension Lump Sum Calculator UK 2026/27 (25% Tax-Free)' },
  // FARMING
  { slug: 'elm-payment-calculator', title: 'BPS/ELM Payment Calculator', description: 'Calculate Sustainable Farming Incentive and ELM payments for 10+ environmental actions.', category: 'farming', icon: 'Wheat', keywords: ['ELM', 'SFI', 'environmental land management', 'farming payments', 'BPS'], priority: 1 , metaTitle: 'ELM Payment Calculator UK 2026 — DEFRA' },
  { slug: 'farm-tenancy-calculator', title: 'Farm Tenancy Rent Review Calculator', description: 'Compare your farm rent to market rates. See rent as percentage of revenue for rent review preparation.', category: 'farming', icon: 'Wheat', keywords: ['farm tenancy', 'rent review', 'agricultural rent', 'farm rent'], priority: 2 , metaTitle: 'Farm Tenancy Calculator UK 2026' },
  // EDUCATION
  { slug: 'student-loan-total-cost-calculator', title: 'Student Loan Total Cost Calculator', description: 'Calculate total amount you\'ll actually repay over the loan lifetime with salary growth projections.', category: 'education', icon: 'GraduationCap', keywords: ['student loan cost', 'total repaid', 'loan lifetime', 'write off'], priority: 1 , metaTitle: 'Student Loan Total Cost Calculator UK 2026' },
  // PAY
  { slug: 'ev-salary-sacrifice-calculator', title: 'EV Salary Sacrifice Calculator', description: 'Calculate savings from EV salary sacrifice. See tax/NI savings, BiK at 3% and effective monthly cost.', category: 'pay', icon: 'Banknote', keywords: ['EV salary sacrifice', 'electric car scheme', 'BiK EV', 'salary sacrifice car'], priority: 1, isTrending: true, metaTitle: 'EV Salary Sacrifice Calculator UK 2026/27 — 2% BiK Rate' },
  // AUTO
  { slug: 'ulez-calculator', title: 'ULEZ Compliance Checker', description: 'Check if your car is ULEZ compliant and calculate annual ULEZ and Congestion Charge costs.', category: 'auto', icon: 'Car', keywords: ['ULEZ', 'ultra low emission', 'London', 'congestion charge', 'euro standard'], priority: 1, metaTitle: 'ULEZ Calculator UK 2026 — Compliance Checker by Reg' },
  { slug: 'car-import-duty-calculator', title: 'Car Import Duty Calculator', description: 'Calculate total UK landing cost for imported cars — duty, VAT, VED and type approval.', category: 'auto', icon: 'Car', keywords: ['car import', 'import duty', 'vehicle import', 'customs duty'], priority: 2 , metaTitle: 'Car Import Duty Calculator UK 2026' },
  { slug: 'road-trip-cost-calculator', title: 'Road Trip Cost Calculator', description: 'Calculate fuel cost, driving time and cost per person for road trips. Split costs easily.', category: 'auto', icon: 'Car', keywords: ['road trip', 'journey cost', 'fuel cost trip', 'travel cost'], priority: 2 , metaTitle: 'Road Trip Cost Calculator UK 2026' },
  // TAX
  { slug: 'making-tax-digital-calculator', title: 'Making Tax Digital Readiness Calculator', description: 'Check if MTD for Income Tax applies to you. See deadlines, requirements and software costs.', category: 'tax', icon: 'Receipt', keywords: ['MTD', 'making tax digital', 'digital records', 'quarterly returns'], priority: 1, isTrending: true , metaTitle: 'Making Tax Digital Calculator UK 2026' },
  { slug: 'tax-bracket-visualizer', title: 'Tax Bracket Visualizer', description: 'See your income split across tax bands with a visual bar. Highlights the 60% tax trap at £100-125K.', category: 'tax', icon: 'Receipt', keywords: ['tax brackets', 'tax bands', 'marginal rate', '60% trap', 'effective rate'], priority: 1 , metaTitle: 'UK Tax Bracket Visualizer 2026/27 — All Bands' },
  // BUSINESS
  { slug: 'business-mileage-record-calculator', title: 'Business Mileage Log Calculator', description: 'Log business trips with dates and mileage. Calculate HMRC mileage allowance claim automatically.', category: 'business', icon: 'Briefcase', keywords: ['mileage log', 'mileage record', 'HMRC log', 'business trips'], priority: 2 , metaTitle: 'Business Mileage Record Calculator UK 2026' },
  // PENSION (already at 18, but this is a valuable one)
  { slug: 'pension-sharing-divorce-calculator', title: 'Pension Sharing on Divorce Calculator', description: 'Calculate pension division in divorce. Compare sharing orders with different splits.', category: 'pension', icon: 'PiggyBank', keywords: ['pension sharing', 'divorce pension', 'pension split', 'PSO'], priority: 2 , metaTitle: 'Pension Sharing on Divorce Calculator UK 2026' },
  // BENEFITS
  { slug: 'working-hours-benefits-calculator', title: 'Working Hours & Benefits Threshold Calculator', description: 'Check which benefit thresholds you meet based on working hours. UC conditionality and WTC eligibility.', category: 'benefits', icon: 'Shield', keywords: ['working hours', 'benefit threshold', 'UC conditionality', '16 hours'], priority: 2 , metaTitle: 'Working Hours Benefits Calculator UK 2026' },
  // TAX
  { slug: 'inheritance-tax-pension-calculator', title: 'Inheritance Tax on Pensions Calculator (2027)', description: 'Compare IHT before and after April 2027 when pensions enter the estate. See extra tax liability.', category: 'tax', icon: 'Receipt', keywords: ['IHT pension', 'pension inheritance tax', 'pension death tax', '2027 pension'], priority: 1, isTrending: true , metaTitle: 'IHT on Pension Calculator UK 2027 — New Rules' },
  // BUSINESS
  { slug: 'mtd-readiness-calculator', title: 'MTD Readiness Checklist', description: 'Score your Making Tax Digital readiness across 10 key criteria. See what you still need to do.', category: 'business', icon: 'Briefcase', keywords: ['MTD checklist', 'tax digital readiness', 'quarterly reporting', 'MTD preparation'], priority: 2, isTrending: true , metaTitle: 'Making Tax Digital Readiness Calculator UK 2026' },
  // AUTO
  { slug: 'congestion-charge-calculator', title: 'London Congestion Charge Calculator', description: 'Calculate annual Congestion Charge cost. Check EV and Blue Badge exemptions.', category: 'auto', icon: 'Car', keywords: ['congestion charge', 'London driving', 'C-charge', 'central London'], priority: 2 , metaTitle: 'London Congestion Charge Calculator 2026 (£15)' },
  // EDUCATION
  { slug: 'a-level-grade-calculator', title: 'A-Level Grade Calculator', description: 'Calculate UCAS tariff points from A-Level grades. See which universities your grades qualify for.', category: 'education', icon: 'GraduationCap', keywords: ['A-Level', 'UCAS points', 'A-Level grades', 'university entry'], priority: 1 , metaTitle: 'A-Level Grade Calculator UK 2026' },
  // LOANS
  { slug: 'student-loan-plan4-calculator', title: 'Student Loan Plan 4 (Scotland) Calculator', description: 'Calculate Plan 4 (Scottish) student loan repayments at 9% above the £33,795 threshold for 2026/27. See monthly and annual deductions.', category: 'loans', icon: 'CreditCard', keywords: ['plan 4', 'Scotland loan', 'Scottish student loan', 'SAAS'], priority: 2 , metaTitle: 'Student Loan Plan 4 Calculator UK 2026/27 (Scotland)' },
  // TAX (trending)
  { slug: 'crypto-carf-calculator', title: 'Crypto Tax CARF Calculator', description: 'Track crypto disposals, calculate CGT and understand CARF automatic reporting from 2026.', category: 'tax', icon: 'Receipt', keywords: ['crypto CARF', 'crypto reporting', 'crypto CGT', 'bitcoin tax'], priority: 2, isTrending: true , metaTitle: 'Crypto CARF Calculator UK 2026 — OECD Reporting' },
  { slug: 'employer-ni-rise-calculator', title: 'Employer NI Rise Impact Calculator (April 2025)', description: 'Calculate the extra employer NI cost from the April 2025 rate rise (13.8% → 15%, threshold £9,100 → £5,000).', category: 'tax', icon: 'Receipt', keywords: ['employer NI rise', 'NI increase', 'April 2025', 'employer cost increase'], priority: 1, isTrending: true , metaTitle: 'Employer NI Rise Calculator 2026 — 15% Impact' },
  // AUTO (trending)
  { slug: 'pay-per-mile-calculator', title: 'EV Pay-Per-Mile Road Pricing Calculator', description: 'Compare potential road pricing costs vs current VED and fuel duty. Prepare for future EV taxation.', category: 'auto', icon: 'Car', keywords: ['pay per mile', 'road pricing', 'EV tax', 'road user charge'], priority: 2, isTrending: true , metaTitle: 'Pay Per Mile Calculator UK 2026' },
  // TAX (trending)
  { slug: 'high-council-tax-calculator', title: 'High-Value Property Council Tax Calculator (2028)', description: 'Estimate council tax with proposed surcharge for Band H+ properties. See all bands including new I and J.', category: 'tax', icon: 'Receipt', keywords: ['high value council tax', 'council tax surcharge', 'band H', 'mansion tax'], priority: 2, isTrending: true , metaTitle: 'High Council Tax Calculator UK 2026 (Band H)' },
  { slug: 'ni-salary-sacrifice-2029-calculator', title: 'NI on Salary Sacrifice Calculator (2029)', description: 'Compare current salary sacrifice NI savings vs proposed 2029 rules. See how much you\'ll lose.', category: 'tax', icon: 'Receipt', keywords: ['NI salary sacrifice', '2029 pension', 'salary sacrifice change', 'pension NI'], priority: 2, isTrending: true , metaTitle: 'NI Salary Sacrifice 2029 Calculator UK' },
  // BUSINESS
  { slug: 'sole-trader-vs-ltd-comparison-calculator', title: 'Sole Trader vs Ltd Comparison Table', description: 'Side-by-side take-home pay comparison at 7 different profit levels (£20K-£100K).', category: 'business', icon: 'Briefcase', keywords: ['sole trader vs ltd table', 'comparison table', 'profit levels', 'when to incorporate'], priority: 1 , metaTitle: 'Sole Trader vs Ltd Side-by-Side Comparison UK 2026' },
  { slug: 'apprenticeship-levy-calculator', title: 'Apprenticeship Levy Calculator', description: 'Calculate apprenticeship levy at 0.5% of pay bill over £3M. See government top-up and total training fund.', category: 'business', icon: 'Briefcase', keywords: ['apprenticeship levy', 'training levy', 'pay bill', 'digital apprenticeship'], priority: 2 , metaTitle: 'Apprenticeship Levy Calculator UK 2026 (0.5%)' },
  // MORTGAGE
  { slug: 'mortgage-early-repayment-calculator', title: 'Mortgage Early Repayment Calculator', description: 'Compare paying off your mortgage now (including ERC) vs continuing payments. See if it\'s worth it.', category: 'mortgage', icon: 'Home', keywords: ['early repayment', 'ERC', 'pay off mortgage', 'repayment charge'], priority: 2 , metaTitle: 'Mortgage Early Repayment Charge Calculator UK 2026' },
  // PAY
  { slug: 'shared-parental-pay-calculator', title: 'Shared Parental Pay (ShPP) Quick Calculator', description: 'Quick calculation of Shared Parental Pay at £194.32/week or 90% of salary.', category: 'pay', icon: 'Banknote', keywords: ['shared parental pay', 'ShPP', 'parental leave pay'], priority: 2 , metaTitle: 'UK Shared Parental Pay Calculator 2026/27' },
  // MORTGAGE
  { slug: 'home-buying-total-cost-calculator', title: 'Home Buying Total Cost Calculator', description: 'Calculate every cost of buying a home — deposit, stamp duty, solicitor, survey, searches, and monthly mortgage.', category: 'mortgage', icon: 'Home', keywords: ['home buying cost', 'buying a house', 'total cost', 'first time buyer costs'], priority: 1 , metaTitle: 'UK Home Buying Total Cost Calculator 2026' },
  // TAX
  { slug: 'council-tax-reduction-calculator', title: 'Council Tax Reduction Calculator', description: 'Check which council tax discounts and exemptions you qualify for — single person, student, disabled, care leaver.', category: 'tax', icon: 'Receipt', keywords: ['council tax reduction', 'CT discount', 'single person discount', 'student exemption'], priority: 2 , metaTitle: 'Council Tax Reduction Calculator UK 2026' },
  // EDUCATION
  { slug: 'student-budget-planner-calculator', title: 'Student Budget Planner', description: 'Plan your weekly student budget with income from loan, job and parents against term-time expenses.', category: 'education', icon: 'GraduationCap', keywords: ['student budget', 'university budget', 'term budget', 'weekly budget'], priority: 2 , metaTitle: 'Student Budget Planner UK 2026' },
  // BENEFITS
  { slug: 'care-cost-calculator', title: 'Care Home Cost Calculator', description: 'Estimate care costs and means-testing. See if you\'re self-funded, means-tested or council-funded.', category: 'benefits', icon: 'Shield', keywords: ['care home', 'care costs', 'means test', 'residential care', 'elderly care'], priority: 2 , metaTitle: 'Care Home Cost Calculator — UK 2026/27 Benefits Calculator' },
  // PAY
  { slug: 'minimum-wage-calculator', title: 'UK Minimum Wage Calculator', description: "Are you being paid the legal minimum? Check your hourly, weekly and annual pay against UK National Living Wage (£12.71/hr) and NMW rates by age for 2026.", category: 'pay', icon: 'Banknote', keywords: ['minimum wage', 'NMW', 'NLW', 'living wage', 'hourly rate'], priority: 1, metaTitle: "Minimum Wage Calculator 2026/27" },
  // MORTGAGE
  { slug: 'first-homes-scheme-calculator', title: 'First Homes Scheme Calculator', description: 'Calculate First Homes discounted price (30-50% off). Check if you can afford with income and deposit.', category: 'mortgage', icon: 'Home', keywords: ['first homes', 'first homes scheme', 'discounted home', 'affordable housing'], priority: 2 , metaTitle: 'First Homes Scheme Calculator UK 2026 — 30% Discount' },
  { slug: 'shared-ownership-affordability-calculator', title: 'Shared Ownership Mortgage Affordability', description: 'Check if you can afford shared ownership — mortgage on your share plus rent on unsold share.', category: 'mortgage', icon: 'Home', keywords: ['shared ownership affordability', 'can I afford', 'shared ownership mortgage'], priority: 2 , metaTitle: 'Shared Ownership Affordability Calculator UK 2026' },
  // BUSINESS
  { slug: 'invoice-profit-calculator', title: 'Invoice & Job Profit Calculator', description: 'Calculate profit margin and markup on jobs. Add VAT and generate invoice total.', category: 'business', icon: 'Briefcase', keywords: ['invoice', 'job profit', 'margin', 'markup', 'quote'], priority: 2 , metaTitle: 'Invoice Profit Calculator UK 2026' },
  { slug: 'employee-vs-contractor-calculator', title: 'Employee vs Contractor Calculator', description: 'Compare take-home pay as an employee vs contractor for the same total cost to the hiring company.', category: 'business', icon: 'Briefcase', keywords: ['employee vs contractor', 'perm vs contract', 'PAYE vs Ltd', 'employment status'], priority: 2 , metaTitle: 'Employee vs Contractor Calculator UK 2026' },
  // ENERGY
  { slug: 'standing-charge-savings-calculator', title: 'Standing Charge Savings Calculator', description: 'Calculate how much you pay in standing charges alone. Compare zero standing charge tariffs.', category: 'energy', icon: 'Zap', keywords: ['standing charge', 'zero standing', 'fixed charge', 'energy standing'], priority: 2 , metaTitle: 'Standing Charge Savings Calculator UK 2026' },
  { slug: 'gas-cost-calculator', title: 'Gas Cost Calculator', description: 'Calculate annual gas bill from kWh usage, unit rate and standing charge.', category: 'energy', icon: 'Zap', keywords: ['gas cost', 'gas bill', 'gas calculator', 'gas usage'], priority: 2 , metaTitle: 'Gas Cost Calculator UK 2026' },
  // MATH
  { slug: 'exponent-calculator', title: 'Exponent / Power Calculator', description: 'Calculate any number raised to any power. See common powers of your base number.', category: 'math', icon: 'Calculator', keywords: ['exponent', 'power', 'raised to', 'indices', 'powers'], priority: 2 , metaTitle: 'Exponent Calculator — Powers and Roots' },
  { slug: 'logarithm-calculator', title: 'Logarithm Calculator', description: 'Calculate log₁₀, ln, log₂ and custom base logarithms. Includes antilog and log rules.', category: 'math', icon: 'Calculator', keywords: ['logarithm', 'log', 'natural log', 'ln', 'log base'], priority: 2 , metaTitle: 'Logarithm Calculator — Free Online' },
  // BUSINESS
  { slug: 'employee-cost-breakdown-calculator', title: 'Employee Cost Breakdown Calculator', description: 'Calculate true cost of employment including NI, pension, training, equipment and recruitment.', category: 'business', icon: 'Briefcase', keywords: ['employee cost', 'true cost', 'cost of hiring', 'employment overhead'], priority: 2 , metaTitle: 'Employee Cost Breakdown Calculator UK 2026/27' },
  { slug: 'contractor-vs-perm-calculator', title: 'Contractor vs Permanent Salary Calculator', description: 'Compare contractor day rate vs permanent salary. See the premium needed to match perm benefits.', category: 'business', icon: 'Briefcase', keywords: ['contractor vs perm', 'day rate vs salary', 'contract premium', 'freelance vs employed'], priority: 2 , metaTitle: 'Contractor vs Permanent Calculator UK 2026' },
  // EDUCATION
  { slug: 'postgraduate-loan-cost-calculator', title: 'Postgraduate Loan Total Cost Calculator', description: 'Calculate total postgraduate loan repayment over 30 years with salary growth projections.', category: 'education', icon: 'GraduationCap', keywords: ['PG loan cost', 'postgrad total', 'masters loan cost', 'PhD loan'], priority: 2 , metaTitle: 'Postgraduate Loan Total Cost Calculator UK' },
  // TOOLS
  { slug: 'wedding-cost-calculator', title: 'Wedding Cost Calculator (Detailed)', description: 'Calculate detailed wedding costs across 17 categories with per-guest items. See cost per guest.', category: 'tools', icon: 'Wrench', keywords: ['wedding cost', 'wedding budget', 'wedding planning', 'wedding price'], priority: 2 , metaTitle: 'UK Wedding Cost Calculator 2026' },
  { slug: 'time-duration-calculator', title: 'Time Duration Calculator', description: 'Calculate hours and minutes between two times. Includes decimal hours for timesheets.', category: 'tools', icon: 'Wrench', keywords: ['time duration', 'hours between', 'time calculator', 'timesheet'], priority: 2 , metaTitle: 'Time Duration Calculator — Hours & Minutes' },
  { slug: 'split-bill-calculator', title: 'Split Bill Calculator', description: 'Split a bill between multiple people with itemised costs. Add people and items dynamically.', category: 'tools', icon: 'Wrench', keywords: ['split bill', 'bill splitter', 'share cost', 'divide bill'], priority: 2 , metaTitle: 'Split Bill Calculator — Restaurant Group' },
  { slug: 'speed-distance-time-calculator', title: 'Speed, Distance & Time Calculator', description: 'Calculate speed, distance or time from the other two. Miles and km with the SDT triangle formula.', category: 'tools', icon: 'Wrench', keywords: ['speed distance time', 'SDT', 'how long', 'how far', 'how fast'], priority: 2 , metaTitle: 'Speed Distance Time Calculator UK' },
  // BUSINESS
  { slug: 'profit-and-loss-calculator', title: 'Profit & Loss Calculator', description: 'Build a simple P&L statement. Enter revenue, COGS and overheads to see gross and net profit margins.', category: 'business', icon: 'Briefcase', keywords: ['profit and loss', 'P&L', 'income statement', 'business profit'], priority: 1 , metaTitle: 'Profit and Loss Calculator UK 2026' },
  { slug: 'freelance-quote-calculator', title: 'Freelance Quote Calculator', description: 'Build a quote from hourly rate, hours and materials. Add profit margin and VAT.', category: 'business', icon: 'Briefcase', keywords: ['freelance quote', 'job quote', 'estimate', 'pricing'], priority: 2 , metaTitle: 'Freelance Quote Calculator UK 2026' },
]

export function getCalculatorBySlug(slug: string): CalculatorMeta | undefined {
  return CALCULATORS.find((c) => c.slug === slug)
}

export function getCalculatorsByCategory(categoryId: string): CalculatorMeta[] {
  return CALCULATORS.filter((c) => c.category === categoryId).sort((a, b) => a.priority - b.priority)
}

export function getRelatedCalculators(slug: string, limit = 6): CalculatorMeta[] {
  const calc = getCalculatorBySlug(slug)
  if (!calc) return []
  return CALCULATORS
    .filter((c) => c.category === calc.category && c.slug !== slug)
    .sort((a, b) => a.priority - b.priority)
    .slice(0, limit)
}
