/**
 * FAQ data for top calculators.
 * Used for FAQPage schema + rendered FAQ section.
 */
export interface FAQ {
  question: string
  answer: string
}

export const CALCULATOR_FAQS: Record<string, FAQ[]> = {
  'income-tax-calculator': [
    { question: 'What is the Personal Allowance for 2025/26?', answer: 'The Personal Allowance for the 2025/26 tax year is £12,570. This is the amount you can earn before paying income tax. It reduces by £1 for every £2 you earn above £100,000.' },
    { question: 'What are the UK income tax bands for 2025/26?', answer: 'For 2025/26, the Basic Rate is 20% on income from £12,571 to £50,270. The Higher Rate is 40% on income from £50,271 to £125,140. The Additional Rate is 45% on income above £125,140.' },
    { question: 'How does the Personal Allowance taper work?', answer: 'If you earn over £100,000, your Personal Allowance is reduced by £1 for every £2 above this threshold. This means your Personal Allowance is completely eliminated once you earn £125,140 or more.' },
    { question: 'Does this calculator work for Scottish taxpayers?', answer: 'This calculator uses the standard UK income tax rates for England, Wales and Northern Ireland. Scottish taxpayers should use the Scottish Income Tax Calculator, which has different bands including Starter, Intermediate, Advanced and Top rates.' },
  ],
  'national-insurance-calculator': [
    { question: 'What are the NI rates for employees in 2025/26?', answer: 'For the 2025/26 tax year, employees pay 8% National Insurance on earnings between £12,570 and £50,270 (the Primary Threshold and Upper Earnings Limit), then 2% on earnings above £50,270.' },
    { question: 'What is the NI Primary Threshold for 2025/26?', answer: 'The Primary Threshold for 2025/26 is £12,570 per year (£242 per week). You start paying Class 1 National Insurance once your earnings exceed this amount.' },
    { question: 'Do I pay National Insurance after State Pension age?', answer: 'No. Once you reach State Pension age, you stop paying Class 1 National Insurance contributions, even if you continue working.' },
  ],
  'vat-calculator': [
    { question: 'What is the standard VAT rate in the UK?', answer: 'The standard VAT rate in the UK is 20%. There is also a reduced rate of 5% for certain goods and services (such as home energy and child car seats), and a zero rate of 0% for essential items like most food and children\'s clothing.' },
    { question: 'How do I calculate VAT from a gross amount?', answer: 'To find the VAT in a gross (VAT-inclusive) amount at the standard 20% rate, divide the total by 6. For example, if the total is £120, the VAT is £120 ÷ 6 = £20, and the net amount is £100.' },
    { question: 'When do I need to register for VAT?', answer: 'You must register for VAT if your VAT-taxable turnover exceeds £90,000 in any 12-month rolling period (the 2025/26 threshold). You can also voluntarily register below this threshold.' },
  ],
  'stamp-duty-calculator': [
    { question: 'What are the Stamp Duty rates for 2025/26?', answer: 'From April 2025, standard Stamp Duty rates are: 0% up to £125,000, 2% from £125,001 to £250,000, 5% from £250,001 to £925,000, 10% from £925,001 to £1.5 million, and 12% above £1.5 million.' },
    { question: 'Do first-time buyers get a Stamp Duty discount?', answer: 'Yes. First-time buyers pay no Stamp Duty on the first £300,000 of properties up to £500,000 (from April 2025). Above £300,000 up to £500,000, the rate is 5%. Properties over £500,000 do not qualify for first-time buyer relief.' },
    { question: 'What is the additional property surcharge?', answer: 'If you already own a property and are buying an additional one (such as a second home or buy-to-let), you pay a 5% surcharge on top of the standard Stamp Duty rates on the entire purchase price.' },
  ],
  'take-home-pay-calculator': [
    { question: 'What deductions come out of my salary?', answer: 'Your gross salary is reduced by income tax, National Insurance contributions, workplace pension contributions (if applicable), and student loan repayments (if applicable). The remainder is your take-home pay.' },
    { question: 'How is take-home pay calculated in the UK?', answer: 'Take-home pay is your gross salary minus income tax (based on your tax code and tax bands), minus employee National Insurance (8% and 2%), minus pension contributions (typically 5% for auto-enrolment), and minus any student loan repayments.' },
    { question: 'What is a tax code and how does it affect my pay?', answer: 'A tax code tells your employer how much tax-free income you\'re entitled to. The most common code is 1257L, which means you have a Personal Allowance of £12,570. Different codes apply if you have benefits in kind, multiple jobs, or owe tax from a previous year.' },
  ],
  'mortgage-repayment-calculator': [
    { question: 'What is the difference between repayment and interest-only mortgages?', answer: 'With a repayment mortgage, your monthly payments cover both interest and a portion of the capital, so the loan is fully repaid by the end of the term. With interest-only, you pay only the interest each month and must repay the full capital at the end of the term.' },
    { question: 'How much deposit do I need for a UK mortgage?', answer: 'Most UK lenders require a minimum deposit of 5-10% of the property value. A larger deposit (15-25%) typically gets you better interest rates. The loan-to-value (LTV) ratio is the key factor lenders consider.' },
    { question: 'What happens if interest rates rise?', answer: 'If you have a variable or tracker rate mortgage, your monthly payments will increase when the Bank of England base rate rises. Fixed-rate mortgages protect you from rate increases during the fixed period, but you may face higher rates when you remortgage.' },
  ],
  'mortgage-affordability-calculator': [
    { question: 'How much can I borrow for a mortgage in the UK?', answer: 'Most UK lenders will offer 4 to 4.5 times your annual salary, though some may offer up to 5.5 times in certain circumstances. Your affordability also depends on your existing debts, monthly outgoings and credit score.' },
    { question: 'What income do lenders consider for mortgage affordability?', answer: 'Lenders consider your basic salary, regular overtime, bonuses (often at a discounted rate), rental income, and other guaranteed income. Self-employed applicants typically need 2-3 years of accounts or SA302 forms.' },
  ],
  'pension-calculator': [
    { question: 'How much should I save into my pension?', answer: 'A common guideline is to halve the age you start saving and use that as a percentage of your salary. For example, if you start at 30, save at least 15% of your salary. The auto-enrolment minimum is 8% (5% employee + 3% employer).' },
    { question: 'What is the pension annual allowance for 2025/26?', answer: 'The annual allowance for pension contributions in 2025/26 is £60,000. This includes both your contributions and your employer\'s. Tax relief is available on contributions up to this limit or your annual earnings, whichever is lower.' },
    { question: 'When can I access my pension?', answer: 'You can usually access your defined contribution pension from age 55 (rising to 57 from April 2028). You can take up to 25% as a tax-free lump sum. The remainder is taxed as income when you withdraw it.' },
  ],
  'capital-gains-tax-calculator': [
    { question: 'What is the CGT annual exempt amount for 2025/26?', answer: 'The Capital Gains Tax annual exempt amount for 2025/26 is £3,000. This means you can make gains up to £3,000 in the tax year without paying any CGT.' },
    { question: 'What are the CGT rates for 2025/26?', answer: 'Following the October 2024 Autumn Budget, CGT rates were unified. Basic-rate taxpayers pay 18% on all gains (residential property and other assets). Higher and additional-rate taxpayers pay 24% on all gains. The old 10%/20% rates for non-property assets no longer apply.' },
    { question: 'Do I pay CGT on my main home?', answer: 'No. Your main home (principal private residence) is usually exempt from Capital Gains Tax under Private Residence Relief. However, CGT may apply if you\'ve let part of it out, used part exclusively for business, or the grounds exceed 5,000 square metres.' },
  ],
  'inheritance-tax-calculator': [
    { question: 'What is the Inheritance Tax threshold for 2025/26?', answer: 'The nil-rate band (threshold) is £325,000. There is an additional residence nil-rate band of £175,000 if you pass your home to direct descendants, giving a potential combined threshold of £500,000 per person or £1 million for a married couple.' },
    { question: 'What is the Inheritance Tax rate?', answer: 'Inheritance Tax is charged at 40% on the value of the estate above the nil-rate band. The rate is reduced to 36% if at least 10% of the net estate is left to charity.' },
  ],
  'dividend-tax-calculator': [
    { question: 'What is the dividend allowance for 2025/26?', answer: 'The tax-free dividend allowance for 2025/26 is £500. Dividends above this are taxed at 8.75% (basic rate), 33.75% (higher rate) or 39.35% (additional rate).' },
    { question: 'How are dividends taxed in the UK?', answer: 'Dividends are added on top of your other income and taxed at special rates. After the £500 tax-free allowance, basic-rate taxpayers pay 8.75%, higher-rate taxpayers pay 33.75%, and additional-rate taxpayers pay 39.35%.' },
  ],
  'student-loan-repayment-calculator': [
    { question: 'What are the student loan repayment thresholds for 2025/26?', answer: 'Plan 1: £24,990 per year. Plan 2: £27,295 per year. Plan 4 (Scotland): £31,395 per year. Plan 5 (from 2023): £25,000 per year. Postgraduate Loan: £21,000 per year. You repay 9% of income above these thresholds (6% for Postgraduate Loans).' },
    { question: 'When is my student loan written off?', answer: 'Plan 1: 25 years after the April you were first due to repay, or when you turn 65. Plan 2: 30 years after the April you were first due to repay. Plan 4: 30 years or age 65. Plan 5: 40 years.' },
  ],
  'self-assessment-tax-calculator': [
    { question: 'Who needs to file a Self Assessment tax return?', answer: 'You must file a Self Assessment return if you are self-employed, a company director, earn over £150,000, have untaxed income (e.g. rental income, savings interest above your allowance), or need to claim tax reliefs. HMRC will notify you if you need to file.' },
    { question: 'What is the deadline for Self Assessment?', answer: 'The deadline for online Self Assessment returns is 31 January following the end of the tax year. For example, the 2025/26 return must be filed online by 31 January 2027. Paper returns must be filed by 31 October.' },
  ],
  'corporation-tax-calculator': [
    { question: 'What is the Corporation Tax rate for 2025/26?', answer: 'The main Corporation Tax rate is 25% for companies with profits over £250,000. The small profits rate is 19% for companies with profits up to £50,000. Marginal relief applies for profits between £50,000 and £250,000.' },
    { question: 'When do I need to pay Corporation Tax?', answer: 'Corporation Tax is due 9 months and 1 day after the end of your accounting period. Your Company Tax Return must be filed within 12 months of the accounting period end date.' },
  ],
  'salary-sacrifice-calculator': [
    { question: 'What is salary sacrifice?', answer: 'Salary sacrifice is an arrangement where you give up part of your gross salary in exchange for a non-cash benefit, such as increased pension contributions, childcare vouchers, or a cycle-to-work scheme. You pay less income tax and NI because your taxable salary is lower.' },
    { question: 'Can salary sacrifice reduce my tax bill?', answer: 'Yes. Because salary sacrifice reduces your gross pay before tax is calculated, you save on both income tax and National Insurance. Your employer also saves on employer NI contributions, and some employers pass this saving back to you.' },
  ],
  'child-benefit-calculator': [
    { question: 'How much is Child Benefit in 2025/26?', answer: 'Child Benefit for 2025/26 is £26.05 per week for the first child and £17.25 per week for each additional child.' },
    { question: 'What is the High Income Child Benefit Charge?', answer: 'If either parent earns over £60,000, the High Income Child Benefit Charge applies. You pay back 1% of the Child Benefit for every £200 earned above £60,000. At £80,000 or above, you effectively repay all of it through tax.' },
  ],
  'bmi-calculator': [
    { question: 'What is a healthy BMI range?', answer: 'According to the NHS, a healthy BMI is between 18.5 and 24.9. A BMI below 18.5 is underweight, 25 to 29.9 is overweight, and 30 or above is classified as obese.' },
    { question: 'Is BMI accurate for everyone?', answer: 'BMI is a useful screening tool but has limitations. It does not distinguish between muscle and fat, so very muscular people may have a high BMI despite being healthy. It may also be less accurate for older adults, pregnant women, and certain ethnic groups.' },
  ],
  'mortgage-overpayment-calculator': [
    { question: 'How much can I overpay on my mortgage?', answer: 'Most UK mortgage lenders allow you to overpay up to 10% of your outstanding balance per year without early repayment charges. Check your mortgage terms as limits vary by lender and product.' },
    { question: 'Is it better to overpay my mortgage or save?', answer: 'If your mortgage interest rate is higher than the return you can get on savings (after tax), overpaying your mortgage is generally more beneficial. However, you should keep an emergency fund and consider paying off higher-interest debts first.' },
  ],
  'council-tax-calculator': [
    { question: 'How is council tax calculated?', answer: 'Council tax is based on your property\'s valuation band (A to H in England) and your local authority\'s annual rate. Bands are based on property values as of 1 April 1991. Band D is the reference point and each band pays a proportion of the Band D rate.' },
    { question: 'Can I get a council tax discount?', answer: 'Yes. Single occupants get a 25% discount. Full-time students, people with severe mental impairments, and certain carers may be exempt. Council Tax Reduction (formerly Council Tax Benefit) is available for people on low incomes.' },
  ],
  'redundancy-pay-calculator': [
    { question: 'How is statutory redundancy pay calculated?', answer: 'Statutory redundancy pay is based on your age, length of service (up to 20 years) and weekly pay (capped at £700 for 2025/26). You get 0.5 weeks\' pay per year of service aged under 22, 1 week per year aged 22-40, and 1.5 weeks per year aged 41 and over.' },
    { question: 'Is redundancy pay taxable?', answer: 'The first £30,000 of redundancy pay (including statutory and any contractual redundancy) is tax-free. Amounts above £30,000 are subject to income tax and potentially National Insurance.' },
  ],
  'car-tax-calculator': [
    { question: 'How is car tax (VED) calculated?', answer: 'Vehicle Excise Duty (VED) is based on CO2 emissions for cars registered after 1 April 2017. First-year rates vary from £0 for zero-emission vehicles to over £2,000 for high-emission cars. Standard annual rates apply from year 2 onwards.' },
    { question: 'Do electric cars pay road tax?', answer: 'From April 2025, electric vehicles (EVs) are no longer exempt from VED. They pay the lowest first-year rate and then the standard annual rate from year 2. EVs registered before April 2025 also become liable from this date.' },
  ],
  'fuel-cost-calculator': [
    { question: 'How do I calculate fuel costs for a journey?', answer: 'Divide the journey distance by your car\'s fuel efficiency (miles per gallon or miles per litre), then multiply by the current fuel price per litre or gallon. For example, a 100-mile trip at 40 MPG with fuel at £1.40/litre: 100 ÷ 40 = 2.5 gallons × 4.546 litres × £1.40 = £15.91.' },
    { question: 'What is the HMRC mileage rate?', answer: 'The approved HMRC mileage rate for cars is 45p per mile for the first 10,000 business miles and 25p per mile thereafter. Motorcycles are 24p per mile and bicycles are 20p per mile.' },
  ],
  'compound-interest-calculator': [
    { question: 'What is compound interest?', answer: 'Compound interest is interest calculated on both the initial principal and the accumulated interest from previous periods. Unlike simple interest, your money grows exponentially because you earn interest on your interest.' },
    { question: 'How often is interest compounded?', answer: 'Interest can be compounded annually, semi-annually, quarterly, monthly or daily. The more frequently interest is compounded, the faster your money grows. Most UK savings accounts compound interest annually or monthly.' },
  ],
  'inflation-calculator': [
    { question: 'What is the current UK inflation rate?', answer: 'UK inflation is measured by the Consumer Price Index (CPI) and the Retail Price Index (RPI). Rates change monthly and are published by the Office for National Statistics (ONS). Check the ONS website for the latest figures.' },
    { question: 'What is the difference between CPI and RPI?', answer: 'CPI (Consumer Price Index) excludes housing costs like mortgage interest and council tax. RPI (Retail Price Index) includes these costs. CPI is typically lower than RPI and is the government\'s preferred measure for the inflation target.' },
  ],
  'ev-savings-calculator': [
    { question: 'How much can I save with an electric car?', answer: 'Savings depend on your annual mileage, electricity tariff, and current fuel costs. On average, EV owners save £800-£1,200 per year on fuel alone compared to a petrol car. Maintenance costs are also lower as EVs have fewer moving parts.' },
    { question: 'Is it cheaper to charge at home or at a public charger?', answer: 'Home charging is significantly cheaper, typically costing 7-10p per mile compared to 15-25p per mile at public rapid chargers. An overnight home charge on a standard tariff costs around £10-15 for a full charge giving 200-250 miles of range.' },
  ],
  'energy-bill-calculator': [
    { question: 'What is the Ofgem energy price cap?', answer: 'The Ofgem price cap sets a maximum unit rate and standing charge that energy suppliers can charge for default tariffs. It changes quarterly and applies to both gas and electricity. Check Ofgem\'s website for the current cap level.' },
    { question: 'How can I reduce my energy bills?', answer: 'Key ways to reduce energy bills include: improving home insulation, turning down your thermostat by 1°C (saves around £100/year), using LED bulbs, washing clothes at 30°C, only boiling the water you need, and switching to a cheaper tariff when your fixed deal ends.' },
  ],
  'holiday-entitlement-calculator': [
    { question: 'How much annual leave am I entitled to in the UK?', answer: 'Full-time workers are entitled to a minimum of 5.6 weeks (28 days) paid annual leave per year under UK law. This can include bank holidays. Part-time workers receive a pro-rata amount based on the days or hours they work.' },
    { question: 'Do bank holidays count as part of my annual leave?', answer: 'There is no statutory right to paid bank holidays in the UK. Your employer can include bank holidays as part of your 5.6 weeks minimum leave entitlement. Check your employment contract for details.' },
  ],
  'universal-credit-calculator': [
    { question: 'Who is eligible for Universal Credit?', answer: 'You may be eligible for Universal Credit if you are on a low income or out of work, aged 18 or over (some exceptions for 16-17), under State Pension age, living in England, Scotland or Wales, and have savings under £16,000.' },
    { question: 'How is Universal Credit calculated?', answer: 'Universal Credit starts with a standard allowance based on your age and circumstances. Additional elements are added for children, housing costs, caring responsibilities, and disability. Your payment is then reduced based on your earnings — for every £1 you earn above a work allowance, your UC is reduced by 55p.' },
  ],
  'maternity-pay-calculator': [
    { question: 'How long is Statutory Maternity Pay?', answer: 'Statutory Maternity Pay (SMP) is paid for up to 39 weeks. The first 6 weeks are paid at 90% of your average weekly earnings. The remaining 33 weeks are paid at the lower of 90% of average earnings or £187.18 per week (2025/26 rate).' },
    { question: 'When should I tell my employer I am pregnant?', answer: 'You must tell your employer at least 15 weeks before your expected week of childbirth. This is usually around week 25 of pregnancy. You should provide a MATB1 certificate from your midwife or GP as proof of your due date.' },
  ],
  'pension-drawdown-calculator': [
    { question: 'What is pension drawdown?', answer: 'Pension drawdown (also called flexi-access drawdown) lets you take income from your pension pot while the rest stays invested. You can usually take 25% of your pot tax-free and then draw income from the remainder, which is taxed as income.' },
    { question: 'How much can I safely withdraw from my pension each year?', answer: 'A common guideline is the 4% rule, which suggests withdrawing 4% of your pension pot in the first year, then adjusting for inflation. However, sustainable withdrawal rates depend on investment returns, your age, and how long your pension needs to last.' },
  ],
  'premium-bonds-calculator': [
    { question: 'What is the Premium Bonds prize rate?', answer: 'The annual prize fund rate is set by NS&I and changes periodically. Each £1 bond has an equal chance of winning a prize in the monthly draw. The minimum investment is £25 and the maximum holding is £50,000 per person.' },
    { question: 'Are Premium Bonds a good investment?', answer: 'Premium Bonds are tax-free but offer no guaranteed return. They are best suited for risk-averse savers who have used their ISA allowance and Personal Savings Allowance. The expected return is lower than most savings accounts, but prizes are completely tax-free.' },
  ],
  'employer-ni-calculator': [
    { question: 'What is the employer NI rate for 2025/26?', answer: 'From April 2025, the employer National Insurance rate increased to 15% (up from 13.8%). The secondary threshold was reduced to £5,000 (down from £9,100), meaning employers now pay NI on a larger portion of each employee\'s salary.' },
    { question: 'What is the Employment Allowance?', answer: 'The Employment Allowance for 2025/26 is £10,500, which reduces your employer NI liability. It is available to most businesses with employer NI below £100,000 in the previous tax year. Single-director companies with no other employees are not eligible.' },
  ],
  'solar-panel-calculator': [
    { question: 'How much do solar panels cost in the UK?', answer: 'A typical 4kW domestic solar panel system costs between £5,000 and £8,000 installed. Prices vary depending on the number of panels, brand, roof type and installer. Battery storage adds £2,000-£5,000.' },
    { question: 'How much can solar panels save me?', answer: 'A 4kW system typically generates around 3,400 kWh per year, saving £400-£600 on electricity bills annually depending on your usage patterns and energy tariff. With the Smart Export Guarantee, you can also earn money by selling excess electricity back to the grid.' },
  ],
  'shared-ownership-calculator': [
    { question: 'What is shared ownership?', answer: 'Shared ownership lets you buy a share of a home (typically 25-75%) and pay rent on the rest to a housing association. You need a smaller mortgage and deposit than buying outright. You can buy more shares over time (staircasing) until you own the property outright.' },
    { question: 'Who is eligible for shared ownership?', answer: 'You must have a household income of no more than £80,000 (£90,000 in London), be a first-time buyer (or previously owned a home but cannot afford to buy now), and be unable to buy a suitable home without assistance.' },
  ],
  'first-home-buyer-calculator': [
    { question: 'What are the total costs of buying a first home?', answer: 'Beyond the deposit, first-time buyers should budget for solicitor/conveyancing fees (£800-£1,500), survey costs (£250-£600), mortgage arrangement fees (£0-£2,000), buildings insurance, removal costs, and stamp duty (nil on the first £300,000 for eligible first-time buyers).' },
    { question: 'How much deposit do first-time buyers need?', answer: 'A minimum of 5% is typically required, though 10-15% will get you access to better mortgage rates. For a £250,000 property, a 5% deposit is £12,500 and a 10% deposit is £25,000.' },
  ],
  'equity-release-calculator': [
    { question: 'What is equity release?', answer: 'Equity release lets homeowners aged 55 or over access the value tied up in their property without having to move. The most common type is a lifetime mortgage, where you borrow against your home and interest rolls up over time. The loan is repaid when you die or move into care.' },
    { question: 'How much equity can I release?', answer: 'The amount depends on your age and property value. Typically, you can release 20-50% of your home\'s value. The older you are, the more you can release. For example, at age 65 you might release 25-30%, while at 80 you could release 40-50%.' },
  ],
  'landlord-tax-calculator': [
    { question: 'How is rental income taxed?', answer: 'Rental income is added to your other income and taxed at your marginal rate (20%, 40% or 45%). You can deduct allowable expenses including letting agent fees, insurance, repairs and maintenance. Mortgage interest relief is given as a 20% tax credit rather than a deduction.' },
    { question: 'What expenses can landlords claim?', answer: 'Allowable expenses include letting agent and management fees, insurance premiums, maintenance and repairs (not improvements), ground rent and service charges, accountancy fees, legal fees for renewing tenancies, and travel costs for property management. Mortgage interest gets a 20% tax credit.' },
  ],

  // === Auto-generated FAQs for remaining calculators ===
  'scottish-income-tax-calculator': [
    { question: 'What does the Scottish Income Tax Calculator do?', answer: 'Calculate Scottish income tax with all 6 bands: Starter, Basic, Intermediate, Higher, Advanced and Top rate for 2025/26. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator updated for the 2025/26 tax year?', answer: 'Yes. This calculator uses the latest HMRC rates and thresholds for the 2025/26 UK tax year, which runs from 6 April 2025 to 5 April 2026. Rates are verified against official HMRC publications.' },
    { question: 'Do I need to tell HMRC about this?', answer: 'Whether you need to report to HMRC depends on your individual circumstances. If you are unsure, check GOV.UK or contact HMRC directly. This calculator provides estimates for guidance only.' },
  ],
  'stamp-duty-first-time-buyer-calculator': [
    { question: 'What does the Stamp Duty First-Time Buyer Calculator do?', answer: 'Calculate stamp duty relief for first-time buyers in England and Northern Ireland. Updated April 2025. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator updated for the 2025/26 tax year?', answer: 'Yes. This calculator uses the latest HMRC rates and thresholds for the 2025/26 UK tax year, which runs from 6 April 2025 to 5 April 2026. Rates are verified against official HMRC publications.' },
    { question: 'Do I need to tell HMRC about this?', answer: 'Whether you need to report to HMRC depends on your individual circumstances. If you are unsure, check GOV.UK or contact HMRC directly. This calculator provides estimates for guidance only.' },
  ],
  'marriage-allowance-calculator': [
    { question: 'What does the Marriage Allowance Calculator do?', answer: 'Check if you can save up to £252 per year by transferring part of your Personal Allowance to your spouse or civil partner. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator updated for the 2025/26 tax year?', answer: 'Yes. This calculator uses the latest HMRC rates and thresholds for the 2025/26 UK tax year, which runs from 6 April 2025 to 5 April 2026. Rates are verified against official HMRC publications.' },
    { question: 'Do I need to tell HMRC about this?', answer: 'Whether you need to report to HMRC depends on your individual circumstances. If you are unsure, check GOV.UK or contact HMRC directly. This calculator provides estimates for guidance only.' },
  ],
  'company-car-tax-calculator': [
    { question: 'What does the Company Car Tax (BiK) Calculator do?', answer: 'Calculate benefit-in-kind tax on your company car based on list price, CO2 emissions and fuel type. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator updated for the 2025/26 tax year?', answer: 'Yes. This calculator uses the latest HMRC rates and thresholds for the 2025/26 UK tax year, which runs from 6 April 2025 to 5 April 2026. Rates are verified against official HMRC publications.' },
    { question: 'Do I need to tell HMRC about this?', answer: 'Whether you need to report to HMRC depends on your individual circumstances. If you are unsure, check GOV.UK or contact HMRC directly. This calculator provides estimates for guidance only.' },
  ],
  'crypto-tax-calculator': [
    { question: 'What does the Crypto Tax Calculator UK do?', answer: 'Calculate capital gains tax on cryptocurrency disposals including Bitcoin, Ethereum and other digital assets. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator updated for the 2025/26 tax year?', answer: 'Yes. This calculator uses the latest HMRC rates and thresholds for the 2025/26 UK tax year, which runs from 6 April 2025 to 5 April 2026. Rates are verified against official HMRC publications.' },
    { question: 'Do I need to tell HMRC about this?', answer: 'Whether you need to report to HMRC depends on your individual circumstances. If you are unsure, check GOV.UK or contact HMRC directly. This calculator provides estimates for guidance only.' },
  ],
  'hourly-to-salary-calculator': [
    { question: 'What does the Hourly to Annual Salary Calculator do?', answer: 'Convert your hourly rate to an annual salary, or find out what your salary works out to per hour. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator based on 2025/26 rates?', answer: 'Yes. This calculator uses the current 2025/26 UK tax year rates for income tax, National Insurance and other deductions, effective from 6 April 2025.' },
    { question: 'Does this include pension contributions?', answer: 'This calculator can factor in workplace pension contributions. Under auto-enrolment, the minimum is 8% total (5% employee + 3% employer) of qualifying earnings.' },
  ],
  'employer-cost-calculator': [
    { question: 'What does the Employer Cost Calculator do?', answer: 'Calculate the total cost of employing someone including salary, employer NI (15%), pension contributions and apprenticeship levy. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator based on 2025/26 rates?', answer: 'Yes. This calculator uses the current 2025/26 UK tax year rates for income tax, National Insurance and other deductions, effective from 6 April 2025.' },
    { question: 'Does this include pension contributions?', answer: 'This calculator can factor in workplace pension contributions. Under auto-enrolment, the minimum is 8% total (5% employee + 3% employer) of qualifying earnings.' },
  ],
  'bonus-tax-calculator': [
    { question: 'What does the Bonus Tax Calculator do?', answer: 'Calculate how much of your bonus you will take home after income tax and National Insurance deductions. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator based on 2025/26 rates?', answer: 'Yes. This calculator uses the current 2025/26 UK tax year rates for income tax, National Insurance and other deductions, effective from 6 April 2025.' },
    { question: 'Does this include pension contributions?', answer: 'This calculator can factor in workplace pension contributions. Under auto-enrolment, the minimum is 8% total (5% employee + 3% employer) of qualifying earnings.' },
  ],
  'rental-yield-calculator': [
    { question: 'What does the Rental Yield Calculator do?', answer: 'Calculate gross and net rental yield on buy-to-let investment properties. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this based on current interest rates?', answer: 'You can enter any interest rate to model different scenarios. Check the Bank of England base rate and current mortgage deals from lenders for the latest rates.' },
    { question: 'Should I get professional advice?', answer: 'This calculator provides estimates for guidance only. For a formal mortgage offer, speak to a mortgage broker or lender who can assess your full circumstances and provide personalised advice.' },
  ],
  'rent-vs-buy-calculator': [
    { question: 'What does the Rent vs Buy Calculator do?', answer: 'Compare the financial costs of renting versus buying a property over time in the UK. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this based on current interest rates?', answer: 'You can enter any interest rate to model different scenarios. Check the Bank of England base rate and current mortgage deals from lenders for the latest rates.' },
    { question: 'Should I get professional advice?', answer: 'This calculator provides estimates for guidance only. For a formal mortgage offer, speak to a mortgage broker or lender who can assess your full circumstances and provide personalised advice.' },
  ],
  'state-pension-calculator': [
    { question: 'What does the State Pension Calculator do?', answer: 'Estimate your UK State Pension based on your National Insurance record. Full new State Pension is £230.25 per week. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Are these figures guaranteed?', answer: 'No. Pension projections are estimates based on assumed growth rates and current contribution levels. Actual returns depend on investment performance, fees and future policy changes.' },
    { question: 'What is the pension annual allowance?', answer: 'The pension annual allowance for 2025/26 is £60,000. This is the maximum you can contribute (including employer contributions) and receive tax relief. The allowance is tapered for high earners.' },
  ],
  'pension-tax-relief-calculator': [
    { question: 'What does the Pension Tax Relief Calculator do?', answer: 'Calculate how much tax relief you get on pension contributions as a basic, higher or additional rate taxpayer. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Are these figures guaranteed?', answer: 'No. Pension projections are estimates based on assumed growth rates and current contribution levels. Actual returns depend on investment performance, fees and future policy changes.' },
    { question: 'What is the pension annual allowance?', answer: 'The pension annual allowance for 2025/26 is £60,000. This is the maximum you can contribute (including employer contributions) and receive tax relief. The allowance is tapered for high earners.' },
  ],
  'isa-calculator': [
    { question: 'What does the ISA Calculator — Tax-Free Savings Growth do?', answer: 'Calculate your tax-free ISA savings growth with the £20,000 annual allowance. Compare Cash ISA and Stocks & Shares ISA. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator suitable for financial decisions?', answer: 'This calculator provides estimates for guidance only. Investment returns are not guaranteed and your capital is at risk. Consider seeking independent financial advice before making investment decisions.' },
    { question: 'Are ISA contributions tax-free?', answer: 'Yes. The annual ISA allowance for 2025/26 is £20,000. Any interest, dividends or capital gains within an ISA are completely tax-free.' },
  ],
  'personal-loan-calculator': [
    { question: 'What does the Personal Loan Calculator do?', answer: 'Calculate monthly repayments, total interest and total cost of a personal loan. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Does this use current UK interest rates?', answer: 'You can enter any interest rate to model different scenarios. The Bank of England base rate and FCA guidelines influence typical lending rates available in the UK market.' },
    { question: 'Should I get professional debt advice?', answer: 'If you are struggling with debt, free professional advice is available from StepChange (0800 138 1111), Citizens Advice, and the National Debtline (0808 808 4000). This calculator provides estimates only.' },
  ],
  'credit-card-repayment-calculator': [
    { question: 'What does the Credit Card Repayment Calculator do?', answer: 'Calculate how long it will take to pay off your credit card and how much interest you will pay. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Does this use current UK interest rates?', answer: 'You can enter any interest rate to model different scenarios. The Bank of England base rate and FCA guidelines influence typical lending rates available in the UK market.' },
    { question: 'Should I get professional debt advice?', answer: 'If you are struggling with debt, free professional advice is available from StepChange (0800 138 1111), Citizens Advice, and the National Debtline (0808 808 4000). This calculator provides estimates only.' },
  ],
  'sole-trader-tax-calculator': [
    { question: 'What does the Sole Trader Tax Calculator do?', answer: 'Calculate income tax, Class 2 and Class 4 NI for sole traders and self-employed individuals. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this suitable for my business?', answer: 'This calculator provides general estimates based on standard UK business rates and rules. Every business is different — consult your accountant for advice specific to your circumstances.' },
    { question: 'Does this use 2025/26 tax rates?', answer: 'Yes. All rates and thresholds are based on the current 2025/26 UK tax year. Corporation Tax main rate is 25% for profits over £250,000, with a 19% small profits rate.' },
  ],
  'ir35-calculator': [
    { question: 'What does the IR35 Take-Home Pay Calculator do?', answer: 'Compare your take-home pay inside and outside IR35 as a contractor working through a limited company. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this suitable for my business?', answer: 'This calculator provides general estimates based on standard UK business rates and rules. Every business is different — consult your accountant for advice specific to your circumstances.' },
    { question: 'Does this use 2025/26 tax rates?', answer: 'Yes. All rates and thresholds are based on the current 2025/26 UK tax year. Corporation Tax main rate is 25% for profits over £250,000, with a 19% small profits rate.' },
  ],
  'dividend-vs-salary-calculator': [
    { question: 'What does the Dividend vs Salary Calculator do?', answer: 'Find the most tax-efficient mix of salary and dividends for limited company directors. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this suitable for my business?', answer: 'This calculator provides general estimates based on standard UK business rates and rules. Every business is different — consult your accountant for advice specific to your circumstances.' },
    { question: 'Does this use 2025/26 tax rates?', answer: 'Yes. All rates and thresholds are based on the current 2025/26 UK tax year. Corporation Tax main rate is 25% for profits over £250,000, with a 19% small profits rate.' },
  ],
  'calorie-calculator': [
    { question: 'What does the Calorie Calculator (TDEE) do?', answer: 'Calculate your Total Daily Energy Expenditure and recommended calorie intake for weight loss, maintenance or gain. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this medical advice?', answer: 'No. This calculator is for informational purposes only and does not constitute medical advice. Always consult your GP or an appropriate healthcare professional for medical guidance.' },
    { question: 'Are the reference values from the NHS?', answer: 'Where applicable, this calculator uses reference values and guidelines from the NHS and other UK health authorities. Individual needs may vary based on personal health circumstances.' },
  ],
  'concrete-calculator': [
    { question: 'What does the Concrete Calculator do?', answer: 'Calculate how much concrete you need in cubic metres or bags for slabs, footings, posts and columns. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Does this include waste allowance?', answer: 'Yes. Most building material calculations include a standard 10% waste allowance. You can adjust this figure depending on the complexity of your project and cutting requirements.' },
    { question: 'Are prices accurate?', answer: 'Material prices are indicative estimates based on average UK prices. Actual costs vary by region, supplier, brand and current market conditions. Always get quotes from local suppliers.' },
  ],
  'paint-calculator': [
    { question: 'What does the Paint Calculator — Litres & Coverage do?', answer: 'Calculate how much paint you need based on wall area, number of coats and paint coverage rate. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Does this include waste allowance?', answer: 'Yes. Most building material calculations include a standard 10% waste allowance. You can adjust this figure depending on the complexity of your project and cutting requirements.' },
    { question: 'Are prices accurate?', answer: 'Material prices are indicative estimates based on average UK prices. Actual costs vary by region, supplier, brand and current market conditions. Always get quotes from local suppliers.' },
  ],
  'percentage-calculator': [
    { question: 'What does the Percentage Calculator do?', answer: 'Calculate percentages, percentage increase/decrease, and find what percentage one number is of another. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator free to use?', answer: 'Yes. All calculators on Calks.uk are completely free to use. No account or registration is required. All calculations run in your browser — no data is collected.' },
    { question: 'Can I use this on my phone?', answer: 'Yes. All our calculators are fully responsive and work on smartphones, tablets and desktop computers. The interface adapts to your screen size automatically.' },
  ],
  'age-calculator': [
    { question: 'What does the Age Calculator — Years, Months & Days do?', answer: 'Calculate your exact age in years, months and days from your date of birth. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator free to use?', answer: 'Yes. All calculators on Calks.uk are completely free to use. No account or registration is required. All calculations run in your browser — no data is collected.' },
    { question: 'Can I use this on my phone?', answer: 'Yes. All our calculators are fully responsive and work on smartphones, tablets and desktop computers. The interface adapts to your screen size automatically.' },
  ],
  'currency-converter': [
    { question: 'What does the Currency Converter — Live Exchange Rates do?', answer: 'Convert between GBP, EUR, USD and 150+ world currencies with live exchange rates. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator free to use?', answer: 'Yes. All calculators on Calks.uk are completely free to use. No account or registration is required. All calculations run in your browser — no data is collected.' },
    { question: 'Can I use this on my phone?', answer: 'Yes. All our calculators are fully responsive and work on smartphones, tablets and desktop computers. The interface adapts to your screen size automatically.' },
  ],
  'discount-calculator': [
    { question: 'What does the Discount Calculator do?', answer: 'Calculate sale prices, savings and reverse percentage discounts instantly. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator free to use?', answer: 'Yes. All calculators on Calks.uk are completely free to use. No account or registration is required. All calculations run in your browser — no data is collected.' },
    { question: 'Can I use this on my phone?', answer: 'Yes. All our calculators are fully responsive and work on smartphones, tablets and desktop computers. The interface adapts to your screen size automatically.' },
  ],
  'tip-calculator': [
    { question: 'What does the Tip Calculator — Restaurant & Service Tips do?', answer: 'Calculate tips and split bills between multiple people. Choose your tip percentage. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator free to use?', answer: 'Yes. All calculators on Calks.uk are completely free to use. No account or registration is required. All calculations run in your browser — no data is collected.' },
    { question: 'Can I use this on my phone?', answer: 'Yes. All our calculators are fully responsive and work on smartphones, tablets and desktop computers. The interface adapts to your screen size automatically.' },
  ],
  'vat-flat-rate-calculator': [
    { question: 'What does the VAT Flat Rate Scheme Calculator do?', answer: 'Compare VAT Flat Rate Scheme vs standard VAT for your business sector. See if you save or lose. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator updated for the 2025/26 tax year?', answer: 'Yes. This calculator uses the latest HMRC rates and thresholds for the 2025/26 UK tax year, which runs from 6 April 2025 to 5 April 2026. Rates are verified against official HMRC publications.' },
    { question: 'Do I need to tell HMRC about this?', answer: 'Whether you need to report to HMRC depends on your individual circumstances. If you are unsure, check GOV.UK or contact HMRC directly. This calculator provides estimates for guidance only.' },
  ],
  'flooring-calculator': [
    { question: 'What does the Flooring Calculator do?', answer: 'Calculate how much laminate, vinyl or carpet you need including wastage. Get pack and cost estimates. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Does this include waste allowance?', answer: 'Yes. Most building material calculations include a standard 10% waste allowance. You can adjust this figure depending on the complexity of your project and cutting requirements.' },
    { question: 'Are prices accurate?', answer: 'Material prices are indicative estimates based on average UK prices. Actual costs vary by region, supplier, brand and current market conditions. Always get quotes from local suppliers.' },
  ],
  'tile-calculator': [
    { question: 'What does the Tile Calculator — Tiles Needed & Cost do?', answer: 'Calculate how many tiles you need for walls or floors. Accounts for grout gaps and wastage. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Does this include waste allowance?', answer: 'Yes. Most building material calculations include a standard 10% waste allowance. You can adjust this figure depending on the complexity of your project and cutting requirements.' },
    { question: 'Are prices accurate?', answer: 'Material prices are indicative estimates based on average UK prices. Actual costs vary by region, supplier, brand and current market conditions. Always get quotes from local suppliers.' },
  ],
  'gravel-calculator': [
    { question: 'What does the Gravel Calculator — Tonnes & Cost do?', answer: 'Calculate gravel needed in cubic metres, tonnes or bags for driveways, paths and landscaping. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Does this include waste allowance?', answer: 'Yes. Most building material calculations include a standard 10% waste allowance. You can adjust this figure depending on the complexity of your project and cutting requirements.' },
    { question: 'Are prices accurate?', answer: 'Material prices are indicative estimates based on average UK prices. Actual costs vary by region, supplier, brand and current market conditions. Always get quotes from local suppliers.' },
  ],
  'wallpaper-calculator': [
    { question: 'What does the Wallpaper Calculator do?', answer: 'Calculate how many rolls of wallpaper you need. Accounts for pattern repeat and doors/windows. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Does this include waste allowance?', answer: 'Yes. Most building material calculations include a standard 10% waste allowance. You can adjust this figure depending on the complexity of your project and cutting requirements.' },
    { question: 'Are prices accurate?', answer: 'Material prices are indicative estimates based on average UK prices. Actual costs vary by region, supplier, brand and current market conditions. Always get quotes from local suppliers.' },
  ],
  'decking-calculator': [
    { question: 'What does the Decking Calculator — Boards & Cost do?', answer: 'Calculate decking boards, joists and screws needed. Get material cost estimates. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Does this include waste allowance?', answer: 'Yes. Most building material calculations include a standard 10% waste allowance. You can adjust this figure depending on the complexity of your project and cutting requirements.' },
    { question: 'Are prices accurate?', answer: 'Material prices are indicative estimates based on average UK prices. Actual costs vary by region, supplier, brand and current market conditions. Always get quotes from local suppliers.' },
  ],
  'fencing-calculator': [
    { question: 'What does the Fencing Calculator — Panels & Cost do?', answer: 'Calculate fence panels and posts needed for your garden fence with material cost estimates. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Does this include waste allowance?', answer: 'Yes. Most building material calculations include a standard 10% waste allowance. You can adjust this figure depending on the complexity of your project and cutting requirements.' },
    { question: 'Are prices accurate?', answer: 'Material prices are indicative estimates based on average UK prices. Actual costs vary by region, supplier, brand and current market conditions. Always get quotes from local suppliers.' },
  ],
  'body-fat-calculator': [
    { question: 'What does the Body Fat Percentage Calculator do?', answer: 'Estimate your body fat percentage using the US Navy method with waist, neck and hip measurements. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this medical advice?', answer: 'No. This calculator is for informational purposes only and does not constitute medical advice. Always consult your GP or an appropriate healthcare professional for medical guidance.' },
    { question: 'Are the reference values from the NHS?', answer: 'Where applicable, this calculator uses reference values and guidelines from the NHS and other UK health authorities. Individual needs may vary based on personal health circumstances.' },
  ],
  'pregnancy-due-date-calculator': [
    { question: 'What does the Pregnancy Due Date Calculator do?', answer: 'Calculate your estimated due date from your last menstrual period. See key milestones and trimester progress. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this medical advice?', answer: 'No. This calculator is for informational purposes only and does not constitute medical advice. Always consult your GP or an appropriate healthcare professional for medical guidance.' },
    { question: 'Are the reference values from the NHS?', answer: 'Where applicable, this calculator uses reference values and guidelines from the NHS and other UK health authorities. Individual needs may vary based on personal health circumstances.' },
  ],
  'alcohol-units-calculator': [
    { question: 'What does the Alcohol Units Calculator do?', answer: 'Calculate alcohol units in your drinks. Track against the NHS guideline of 14 units per week. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this medical advice?', answer: 'No. This calculator is for informational purposes only and does not constitute medical advice. Always consult your GP or an appropriate healthcare professional for medical guidance.' },
    { question: 'Are the reference values from the NHS?', answer: 'Where applicable, this calculator uses reference values and guidelines from the NHS and other UK health authorities. Individual needs may vary based on personal health circumstances.' },
  ],
  'sleep-calculator': [
    { question: 'What does the Sleep Calculator — Bedtime & Wake Time do?', answer: 'Find the best bedtime or wake-up time based on 90-minute sleep cycles. Wake feeling refreshed. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this medical advice?', answer: 'No. This calculator is for informational purposes only and does not constitute medical advice. Always consult your GP or an appropriate healthcare professional for medical guidance.' },
    { question: 'Are the reference values from the NHS?', answer: 'Where applicable, this calculator uses reference values and guidelines from the NHS and other UK health authorities. Individual needs may vary based on personal health circumstances.' },
  ],
  'date-calculator': [
    { question: 'What does the Date Calculator — Days Between Dates do?', answer: 'Calculate the number of days, weeks and working days between two dates. Add or subtract days from a date. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator free to use?', answer: 'Yes. All calculators on Calks.uk are completely free to use. No account or registration is required. All calculations run in your browser — no data is collected.' },
    { question: 'Can I use this on my phone?', answer: 'Yes. All our calculators are fully responsive and work on smartphones, tablets and desktop computers. The interface adapts to your screen size automatically.' },
  ],
  'weight-converter': [
    { question: 'What does the Weight Converter (kg / stone / pounds) do?', answer: 'Convert between kilograms, stone, pounds, ounces and tonnes. Includes UK stone & pounds display. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator free to use?', answer: 'Yes. All calculators on Calks.uk are completely free to use. No account or registration is required. All calculations run in your browser — no data is collected.' },
    { question: 'Can I use this on my phone?', answer: 'Yes. All our calculators are fully responsive and work on smartphones, tablets and desktop computers. The interface adapts to your screen size automatically.' },
  ],
  'wedding-budget-calculator': [
    { question: 'What does the Wedding Budget Calculator do?', answer: 'Plan your wedding budget with a typical UK breakdown. See cost per guest and category allocations. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator free to use?', answer: 'Yes. All calculators on Calks.uk are completely free to use. No account or registration is required. All calculations run in your browser — no data is collected.' },
    { question: 'Can I use this on my phone?', answer: 'Yes. All our calculators are fully responsive and work on smartphones, tablets and desktop computers. The interface adapts to your screen size automatically.' },
  ],
  'visa-points-calculator': [
    { question: 'What does the UK Skilled Worker Visa Points Calculator do?', answer: 'Check if you meet the 70-point threshold for a UK Skilled Worker visa. Calculate mandatory and tradeable points. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Are visa fees up to date?', answer: 'This calculator uses the current UK visa and immigration fees as published by UK Visas and Immigration (UKVI). Fees are reviewed periodically — check GOV.UK for the very latest amounts.' },
    { question: 'Does this include the Immigration Health Surcharge?', answer: 'Yes. The Immigration Health Surcharge (IHS) is included in the total cost calculation where applicable. The current IHS rate is £1,035 per year for most visa categories.' },
  ],
  'court-fee-calculator': [
    { question: 'What does the Court Fee Calculator do?', answer: 'Calculate court issue fees and hearing fees for money claims in England and Wales. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Are court fees accurate?', answer: 'This calculator uses the current UK court fee schedule. Fees are set by the Ministry of Justice and are reviewed periodically. Check GOV.UK for the very latest fee amounts.' },
    { question: 'Do I need a solicitor?', answer: 'Whether you need a solicitor depends on the complexity of your case. For straightforward matters you may be able to represent yourself, but for significant legal issues professional advice is recommended.' },
  ],
  'probate-fee-calculator': [
    { question: 'What does the Probate Fee Calculator do?', answer: 'Calculate probate application fees and estimated solicitor costs for administering an estate. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Are court fees accurate?', answer: 'This calculator uses the current UK court fee schedule. Fees are set by the Ministry of Justice and are reviewed periodically. Check GOV.UK for the very latest fee amounts.' },
    { question: 'Do I need a solicitor?', answer: 'Whether you need a solicitor depends on the complexity of your case. For straightforward matters you may be able to represent yourself, but for significant legal issues professional advice is recommended.' },
  ],
  'life-insurance-calculator': [
    { question: 'What does the Life Insurance Needs Calculator do?', answer: 'Calculate how much life insurance cover you need based on income, mortgage, debts and family costs. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Are these actual quotes?', answer: 'No. This calculator provides estimates based on typical UK insurance factors. Actual premiums depend on your specific circumstances. Always compare quotes from multiple insurers.' },
    { question: 'Is insurance required by law?', answer: 'Some insurance is legally required in the UK — such as motor insurance, employers\' liability insurance and buildings insurance (if you have a mortgage). Other types are optional but strongly recommended.' },
  ],
  'square-root-calculator': [
    { question: 'What does the Square Root, Powers & Logarithm Calculator do?', answer: 'Calculate square roots, cube roots, custom powers, and logarithms (log10, ln, log2). All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'How accurate are the results?', answer: 'This calculator uses standard mathematical algorithms and provides results accurate to the precision shown. For very large numbers or high-precision requirements, results are rounded to a reasonable number of decimal places.' },
    { question: 'Can I use this for schoolwork?', answer: 'Yes. This calculator is suitable for GCSE, A-level and university-level mathematics. It follows standard mathematical conventions used in UK education.' },
  ],
  'fraction-calculator': [
    { question: 'What does the Fraction Calculator do?', answer: 'Add, subtract, multiply and divide fractions. Shows simplified result, mixed number and decimal. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'How accurate are the results?', answer: 'This calculator uses standard mathematical algorithms and provides results accurate to the precision shown. For very large numbers or high-precision requirements, results are rounded to a reasonable number of decimal places.' },
    { question: 'Can I use this for schoolwork?', answer: 'Yes. This calculator is suitable for GCSE, A-level and university-level mathematics. It follows standard mathematical conventions used in UK education.' },
  ],
  'lawn-seed-calculator': [
    { question: 'What does the Lawn Seed Calculator do?', answer: 'Calculate grass seed needed for new lawns, overseeding or repair. Get bag counts and cost estimates. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Does this include delivery costs?', answer: 'This calculator estimates material quantities and approximate costs. Delivery charges vary by supplier, quantity and location. Bulk orders often qualify for free or reduced delivery.' },
    { question: 'When is the best time for this project?', answer: 'Timing depends on the specific project. Generally, spring and autumn are ideal for lawn and planting work, while hard landscaping can be done year-round in dry conditions.' },
  ],
  'topsoil-calculator': [
    { question: 'What does the Topsoil Calculator — Tonnes & Cost do?', answer: 'Calculate topsoil needed in cubic metres, tonnes or bags for garden beds and landscaping. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Does this include delivery costs?', answer: 'This calculator estimates material quantities and approximate costs. Delivery charges vary by supplier, quantity and location. Bulk orders often qualify for free or reduced delivery.' },
    { question: 'When is the best time for this project?', answer: 'Timing depends on the specific project. Generally, spring and autumn are ideal for lawn and planting work, while hard landscaping can be done year-round in dry conditions.' },
  ],
  'paving-calculator': [
    { question: 'What does the Patio Paving Calculator do?', answer: 'Calculate paving slabs needed for your patio or path. Includes jointing sand estimate. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Does this include delivery costs?', answer: 'This calculator estimates material quantities and approximate costs. Delivery charges vary by supplier, quantity and location. Bulk orders often qualify for free or reduced delivery.' },
    { question: 'When is the best time for this project?', answer: 'Timing depends on the specific project. Generally, spring and autumn are ideal for lawn and planting work, while hard landscaping can be done year-round in dry conditions.' },
  ],
  'ev-charging-calculator': [
    { question: 'What does the EV Charging Cost Calculator do?', answer: 'Calculate electric vehicle charging costs for home and public charging. Compare costs per mile. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Does this use current UK rates?', answer: 'Yes. This calculator uses the latest UK rates for vehicle tax, fuel duty and other motoring costs as of the 2025/26 financial year.' },
    { question: 'Is this suitable for electric vehicles?', answer: 'From April 2025, electric vehicles are no longer exempt from Vehicle Excise Duty (road tax). This calculator accounts for EV-specific rates where applicable.' },
  ],
  'commute-cost-calculator': [
    { question: 'What does the Commute Cost Calculator do?', answer: 'Calculate and compare annual commuting costs by car, train, bus or bicycle. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Does this use current UK rates?', answer: 'Yes. This calculator uses the latest UK rates for vehicle tax, fuel duty and other motoring costs as of the 2025/26 financial year.' },
    { question: 'Is this suitable for electric vehicles?', answer: 'From April 2025, electric vehicles are no longer exempt from Vehicle Excise Duty (road tax). This calculator accounts for EV-specific rates where applicable.' },
  ],
  'mileage-allowance-calculator': [
    { question: 'What does the Mileage Allowance Calculator (HMRC) do?', answer: 'Calculate HMRC approved mileage allowance payments for car, motorcycle or bicycle. 45p/25p per mile rates. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator based on 2025/26 rates?', answer: 'Yes. This calculator uses the current 2025/26 UK tax year rates for income tax, National Insurance and other deductions, effective from 6 April 2025.' },
    { question: 'Does this include pension contributions?', answer: 'This calculator can factor in workplace pension contributions. Under auto-enrolment, the minimum is 8% total (5% employee + 3% employer) of qualifying earnings.' },
  ],
  'radiator-btu-calculator': [
    { question: 'What does the Radiator BTU Calculator do?', answer: 'Calculate the BTU and wattage needed for your radiators based on room size, glazing and insulation. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Does this include waste allowance?', answer: 'Yes. Most building material calculations include a standard 10% waste allowance. You can adjust this figure depending on the complexity of your project and cutting requirements.' },
    { question: 'Are prices accurate?', answer: 'Material prices are indicative estimates based on average UK prices. Actual costs vary by region, supplier, brand and current market conditions. Always get quotes from local suppliers.' },
  ],
  'bricks-calculator': [
    { question: 'What does the Bricks & Blocks Calculator do?', answer: 'Calculate bricks, sand and cement needed for walls. Accounts for openings and mortar joints. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Does this include waste allowance?', answer: 'Yes. Most building material calculations include a standard 10% waste allowance. You can adjust this figure depending on the complexity of your project and cutting requirements.' },
    { question: 'Are prices accurate?', answer: 'Material prices are indicative estimates based on average UK prices. Actual costs vary by region, supplier, brand and current market conditions. Always get quotes from local suppliers.' },
  ],
  'pace-calculator': [
    { question: 'What does the Pace Calculator (Running) do?', answer: 'Calculate running pace, finish time or distance. Supports km and mile splits for 5K, 10K, half marathon and marathon. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this medical advice?', answer: 'No. This calculator is for informational purposes only and does not constitute medical advice. Always consult your GP or an appropriate healthcare professional for medical guidance.' },
    { question: 'Are the reference values from the NHS?', answer: 'Where applicable, this calculator uses reference values and guidelines from the NHS and other UK health authorities. Individual needs may vary based on personal health circumstances.' },
  ],
  'water-intake-calculator': [
    { question: 'What does the Water Intake Calculator do?', answer: 'Calculate your recommended daily water intake based on weight, activity level and climate. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this medical advice?', answer: 'No. This calculator is for informational purposes only and does not constitute medical advice. Always consult your GP or an appropriate healthcare professional for medical guidance.' },
    { question: 'Are the reference values from the NHS?', answer: 'Where applicable, this calculator uses reference values and guidelines from the NHS and other UK health authorities. Individual needs may vary based on personal health circumstances.' },
  ],
  'overdraft-cost-calculator': [
    { question: 'What does the Overdraft Cost Calculator do?', answer: 'Calculate the interest cost of using your overdraft. Most UK banks charge ~39.9% EAR. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Does this use current UK interest rates?', answer: 'You can enter any interest rate to model different scenarios. The Bank of England base rate and FCA guidelines influence typical lending rates available in the UK market.' },
    { question: 'Should I get professional debt advice?', answer: 'If you are struggling with debt, free professional advice is available from StepChange (0800 138 1111), Citizens Advice, and the National Debtline (0808 808 4000). This calculator provides estimates only.' },
  ],
  'debt-free-calculator': [
    { question: 'What does the Debt-Free Date Calculator do?', answer: 'Find out when you will be debt-free based on your balance, APR and monthly payments. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Does this use current UK interest rates?', answer: 'You can enter any interest rate to model different scenarios. The Bank of England base rate and FCA guidelines influence typical lending rates available in the UK market.' },
    { question: 'Should I get professional debt advice?', answer: 'If you are struggling with debt, free professional advice is available from StepChange (0800 138 1111), Citizens Advice, and the National Debtline (0808 808 4000). This calculator provides estimates only.' },
  ],
  'car-finance-calculator': [
    { question: 'What does the Car Finance Calculator (PCP/HP/Loan) do?', answer: 'Compare PCP, Hire Purchase and personal loan monthly payments for buying a car. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Does this use current UK interest rates?', answer: 'You can enter any interest rate to model different scenarios. The Bank of England base rate and FCA guidelines influence typical lending rates available in the UK market.' },
    { question: 'Should I get professional debt advice?', answer: 'If you are struggling with debt, free professional advice is available from StepChange (0800 138 1111), Citizens Advice, and the National Debtline (0808 808 4000). This calculator provides estimates only.' },
  ],
  'heat-pump-calculator': [
    { question: 'What does the Heat Pump Running Cost Calculator do?', answer: 'Compare heat pump vs gas/oil boiler running costs. Calculate payback period and annual savings. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Does this reflect the current energy price cap?', answer: 'This calculator uses representative energy prices. The Ofgem energy price cap changes quarterly — check Ofgem\'s website for the latest cap level applicable to your region and payment method.' },
    { question: 'Can I save money by switching tariff?', answer: 'Potentially yes. The energy market offers various fixed and variable tariffs. Use a comparison site authorised by Ofgem (such as Ofgem\'s own comparison tool) to check if switching could save you money.' },
  ],
  'savings-goal-calculator': [
    { question: 'What does the Savings Goal Calculator do?', answer: 'Calculate how long to reach your savings goal or how much to save monthly to hit a target date. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator suitable for financial decisions?', answer: 'This calculator provides estimates for guidance only. Investment returns are not guaranteed and your capital is at risk. Consider seeking independent financial advice before making investment decisions.' },
    { question: 'Are ISA contributions tax-free?', answer: 'Yes. The annual ISA allowance for 2025/26 is £20,000. Any interest, dividends or capital gains within an ISA are completely tax-free.' },
  ],
  'number-to-words-calculator': [
    { question: 'What does the Number to Words Converter do?', answer: 'Convert any number to words in English. Includes cheque format for GBP amounts. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator free to use?', answer: 'Yes. All calculators on Calks.uk are completely free to use. No account or registration is required. All calculations run in your browser — no data is collected.' },
    { question: 'Can I use this on my phone?', answer: 'Yes. All our calculators are fully responsive and work on smartphones, tablets and desktop computers. The interface adapts to your screen size automatically.' },
  ],
  'random-number-generator': [
    { question: 'What does the Random Number Generator do?', answer: 'Generate random numbers within a range. Supports multiple numbers with or without duplicates. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator free to use?', answer: 'Yes. All calculators on Calks.uk are completely free to use. No account or registration is required. All calculations run in your browser — no data is collected.' },
    { question: 'Can I use this on my phone?', answer: 'Yes. All our calculators are fully responsive and work on smartphones, tablets and desktop computers. The interface adapts to your screen size automatically.' },
  ],
  'shoe-size-converter': [
    { question: 'What does the Shoe Size Converter (UK/EU/US) do?', answer: 'Convert shoe sizes between UK, EU, US (men and women) and centimetres. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator free to use?', answer: 'Yes. All calculators on Calks.uk are completely free to use. No account or registration is required. All calculations run in your browser — no data is collected.' },
    { question: 'Can I use this on my phone?', answer: 'Yes. All our calculators are fully responsive and work on smartphones, tablets and desktop computers. The interface adapts to your screen size automatically.' },
  ],
  'ratio-calculator': [
    { question: 'What does the Ratio Calculator — Simplify & Solve do?', answer: 'Divide an amount by a given ratio. Simplify ratios and see percentage splits. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator free to use?', answer: 'Yes. All calculators on Calks.uk are completely free to use. No account or registration is required. All calculations run in your browser — no data is collected.' },
    { question: 'Can I use this on my phone?', answer: 'Yes. All our calculators are fully responsive and work on smartphones, tablets and desktop computers. The interface adapts to your screen size automatically.' },
  ],
  'standard-deviation-calculator': [
    { question: 'What does the Standard Deviation Calculator do?', answer: 'Calculate standard deviation, variance, mean, median, min, max and range from a set of numbers. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'How accurate are the results?', answer: 'This calculator uses standard mathematical algorithms and provides results accurate to the precision shown. For very large numbers or high-precision requirements, results are rounded to a reasonable number of decimal places.' },
    { question: 'Can I use this for schoolwork?', answer: 'Yes. This calculator is suitable for GCSE, A-level and university-level mathematics. It follows standard mathematical conventions used in UK education.' },
  ],
  'ucas-points-calculator': [
    { question: 'What does the UCAS Tariff Points Calculator do?', answer: 'Calculate your UCAS tariff points from A-Levels, AS-Levels, BTEC and EPQ qualifications. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this based on current student finance rates?', answer: 'Yes. This calculator uses Student Loans Company rates and thresholds for the 2025/26 academic and financial year. Thresholds and interest rates are updated annually.' },
    { question: 'Which student loan plan am I on?', answer: 'Plan 1 applies if you started before September 2012 (England/Wales) or are from Northern Ireland. Plan 2 applies from September 2012 in England/Wales. Plan 4 is for Scotland. Plan 5 applies from September 2023.' },
  ],
  'speed-fine-calculator': [
    { question: 'What does the Speeding Fine Calculator do?', answer: 'Estimate your speeding fine band, penalty points and potential driving ban based on UK sentencing guidelines. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Does this use current UK rates?', answer: 'Yes. This calculator uses the latest UK rates for vehicle tax, fuel duty and other motoring costs as of the 2025/26 financial year.' },
    { question: 'Is this suitable for electric vehicles?', answer: 'From April 2025, electric vehicles are no longer exempt from Vehicle Excise Duty (road tax). This calculator accounts for EV-specific rates where applicable.' },
  ],
  'binary-converter': [
    { question: 'What does the Binary / Hex / Decimal Converter do?', answer: 'Convert between binary, decimal, hexadecimal and octal number systems instantly. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'How accurate are the results?', answer: 'This calculator uses standard mathematical algorithms and provides results accurate to the precision shown. For very large numbers or high-precision requirements, results are rounded to a reasonable number of decimal places.' },
    { question: 'Can I use this for schoolwork?', answer: 'Yes. This calculator is suitable for GCSE, A-level and university-level mathematics. It follows standard mathematical conventions used in UK education.' },
  ],
  'mulch-calculator': [
    { question: 'What does the Mulch Calculator — Bags & Coverage do?', answer: 'Calculate mulch needed in litres and bags for garden beds and borders. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Does this include delivery costs?', answer: 'This calculator estimates material quantities and approximate costs. Delivery charges vary by supplier, quantity and location. Bulk orders often qualify for free or reduced delivery.' },
    { question: 'When is the best time for this project?', answer: 'Timing depends on the specific project. Generally, spring and autumn are ideal for lawn and planting work, while hard landscaping can be done year-round in dry conditions.' },
  ],
  'ideal-weight-calculator': [
    { question: 'What does the Ideal Weight Calculator do?', answer: 'Calculate your ideal weight using Robinson, Miller, Devine and Hamwi formulas. See your healthy BMI range. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this medical advice?', answer: 'No. This calculator is for informational purposes only and does not constitute medical advice. Always consult your GP or an appropriate healthcare professional for medical guidance.' },
    { question: 'Are the reference values from the NHS?', answer: 'Where applicable, this calculator uses reference values and guidelines from the NHS and other UK health authorities. Individual needs may vary based on personal health circumstances.' },
  ],
  'fertiliser-calculator': [
    { question: 'What does the Fertiliser Calculator do?', answer: 'Calculate fertiliser needed for lawns, gardens and allotments based on area and application rate. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Are these based on Defra rates?', answer: 'Where applicable, this calculator uses rates and data from Defra, the Rural Payments Agency and industry standard references for UK agriculture.' },
    { question: 'Does this account for regional variations?', answer: 'UK farming conditions vary by region, soil type and climate. This calculator provides national average figures — adjust for your specific location and circumstances.' },
  ],
  'crop-yield-calculator': [
    { question: 'What does the Crop Yield Calculator do?', answer: 'Estimate crop yields for common vegetables and commercial crops. Calculate value of harvest. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Are these based on Defra rates?', answer: 'Where applicable, this calculator uses rates and data from Defra, the Rural Payments Agency and industry standard references for UK agriculture.' },
    { question: 'Does this account for regional variations?', answer: 'UK farming conditions vary by region, soil type and climate. This calculator provides national average figures — adjust for your specific location and circumstances.' },
  ],
  'break-even-calculator': [
    { question: 'What does the Break-Even Calculator do?', answer: 'Calculate the break-even point in units and revenue. Find your contribution margin. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this suitable for my business?', answer: 'This calculator provides general estimates based on standard UK business rates and rules. Every business is different — consult your accountant for advice specific to your circumstances.' },
    { question: 'Does this use 2025/26 tax rates?', answer: 'Yes. All rates and thresholds are based on the current 2025/26 UK tax year. Corporation Tax main rate is 25% for profits over £250,000, with a 19% small profits rate.' },
  ],
  'margin-calculator': [
    { question: 'What does the Profit Margin & Markup Calculator do?', answer: 'Calculate profit margin, markup percentage and selling price from cost and revenue. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this suitable for my business?', answer: 'This calculator provides general estimates based on standard UK business rates and rules. Every business is different — consult your accountant for advice specific to your circumstances.' },
    { question: 'Does this use 2025/26 tax rates?', answer: 'Yes. All rates and thresholds are based on the current 2025/26 UK tax year. Corporation Tax main rate is 25% for profits over £250,000, with a 19% small profits rate.' },
  ],
  'depreciation-calculator': [
    { question: 'What does the Depreciation Calculator do?', answer: 'Calculate asset depreciation using straight-line or reducing balance methods with a year-by-year schedule. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this suitable for my business?', answer: 'This calculator provides general estimates based on standard UK business rates and rules. Every business is different — consult your accountant for advice specific to your circumstances.' },
    { question: 'Does this use 2025/26 tax rates?', answer: 'Yes. All rates and thresholds are based on the current 2025/26 UK tax year. Corporation Tax main rate is 25% for profits over £250,000, with a 19% small profits rate.' },
  ],
  'visa-fee-calculator': [
    { question: 'What does the UK Visa Fee Calculator do?', answer: 'Calculate total UK visa costs including application fee, IHS surcharge, priority processing and dependants. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Are visa fees up to date?', answer: 'This calculator uses the current UK visa and immigration fees as published by UK Visas and Immigration (UKVI). Fees are reviewed periodically — check GOV.UK for the very latest amounts.' },
    { question: 'Does this include the Immigration Health Surcharge?', answer: 'Yes. The Immigration Health Surcharge (IHS) is included in the total cost calculation where applicable. The current IHS rate is £1,035 per year for most visa categories.' },
  ],
  'student-budget-calculator': [
    { question: 'What does the Student Budget Calculator do?', answer: 'Plan your university budget. Track income from loans, grants and jobs against monthly expenses. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this based on current student finance rates?', answer: 'Yes. This calculator uses Student Loans Company rates and thresholds for the 2025/26 academic and financial year. Thresholds and interest rates are updated annually.' },
    { question: 'Which student loan plan am I on?', answer: 'Plan 1 applies if you started before September 2012 (England/Wales) or are from Northern Ireland. Plan 2 applies from September 2012 in England/Wales. Plan 4 is for Scotland. Plan 5 applies from September 2023.' },
  ],
  'contractor-day-rate-calculator': [
    { question: 'What does the Contractor Day Rate Calculator do?', answer: 'Calculate the minimum day rate needed to achieve your target take-home pay. Inside and outside IR35. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this suitable for my business?', answer: 'This calculator provides general estimates based on standard UK business rates and rules. Every business is different — consult your accountant for advice specific to your circumstances.' },
    { question: 'Does this use 2025/26 tax rates?', answer: 'Yes. All rates and thresholds are based on the current 2025/26 UK tax year. Corporation Tax main rate is 25% for profits over £250,000, with a 19% small profits rate.' },
  ],
  'electricity-cost-calculator': [
    { question: 'What does the Electricity Cost Calculator (per appliance) do?', answer: 'Calculate how much an appliance costs to run per day, week, month and year. Quick-select from common appliances. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Does this reflect the current energy price cap?', answer: 'This calculator uses representative energy prices. The Ofgem energy price cap changes quarterly — check Ofgem\'s website for the latest cap level applicable to your region and payment method.' },
    { question: 'Can I save money by switching tariff?', answer: 'Potentially yes. The energy market offers various fixed and variable tariffs. Use a comparison site authorised by Ofgem (such as Ofgem\'s own comparison tool) to check if switching could save you money.' },
  ],
  'led-savings-calculator': [
    { question: 'What does the LED Bulb Savings Calculator do?', answer: 'Calculate how much you save by switching from old bulbs to LED. See payback period and annual savings. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Does this reflect the current energy price cap?', answer: 'This calculator uses representative energy prices. The Ofgem energy price cap changes quarterly — check Ofgem\'s website for the latest cap level applicable to your region and payment method.' },
    { question: 'Can I save money by switching tariff?', answer: 'Potentially yes. The energy market offers various fixed and variable tariffs. Use a comparison site authorised by Ofgem (such as Ofgem\'s own comparison tool) to check if switching could save you money.' },
  ],
  'lbtt-ltt-calculator': [
    { question: 'What does the LBTT (Scotland) / LTT (Wales) Calculator do?', answer: 'Calculate Land & Buildings Transaction Tax (Scotland) or Land Transaction Tax (Wales) on property purchases. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator updated for the 2025/26 tax year?', answer: 'Yes. This calculator uses the latest HMRC rates and thresholds for the 2025/26 UK tax year, which runs from 6 April 2025 to 5 April 2026. Rates are verified against official HMRC publications.' },
    { question: 'Do I need to tell HMRC about this?', answer: 'Whether you need to report to HMRC depends on your individual circumstances. If you are unsure, check GOV.UK or contact HMRC directly. This calculator provides estimates for guidance only.' },
  ],
  'sick-pay-calculator': [
    { question: 'What does the Statutory Sick Pay Calculator do?', answer: 'Calculate SSP entitlement at £118.75/week. Includes waiting days and maximum 28-week limit. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator based on 2025/26 rates?', answer: 'Yes. This calculator uses the current 2025/26 UK tax year rates for income tax, National Insurance and other deductions, effective from 6 April 2025.' },
    { question: 'Does this include pension contributions?', answer: 'This calculator can factor in workplace pension contributions. Under auto-enrolment, the minimum is 8% total (5% employee + 3% employer) of qualifying earnings.' },
  ],
  'pay-rise-calculator': [
    { question: 'What does the Pay Rise Calculator (Real Terms) do?', answer: 'Check if your pay rise beats inflation. Compare nominal and real-terms increases. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator based on 2025/26 rates?', answer: 'Yes. This calculator uses the current 2025/26 UK tax year rates for income tax, National Insurance and other deductions, effective from 6 April 2025.' },
    { question: 'Does this include pension contributions?', answer: 'This calculator can factor in workplace pension contributions. Under auto-enrolment, the minimum is 8% total (5% employee + 3% employer) of qualifying earnings.' },
  ],
  'annuity-calculator': [
    { question: 'What does the Annuity Calculator — Retirement Income do?', answer: 'Estimate annuity income from your pension pot. Compare single and joint life annuity rates by age. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Are these figures guaranteed?', answer: 'No. Pension projections are estimates based on assumed growth rates and current contribution levels. Actual returns depend on investment performance, fees and future policy changes.' },
    { question: 'What is the pension annual allowance?', answer: 'The pension annual allowance for 2025/26 is £60,000. This is the maximum you can contribute (including employer contributions) and receive tax relief. The allowance is tapered for high earners.' },
  ],
  'pension-vs-isa-calculator': [
    { question: 'What does the Pension vs ISA Calculator do?', answer: 'Compare pension and ISA over time. See which gives you more after tax relief and withdrawal tax. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Are these figures guaranteed?', answer: 'No. Pension projections are estimates based on assumed growth rates and current contribution levels. Actual returns depend on investment performance, fees and future policy changes.' },
    { question: 'What is the pension annual allowance?', answer: 'The pension annual allowance for 2025/26 is £60,000. This is the maximum you can contribute (including employer contributions) and receive tax relief. The allowance is tapered for high earners.' },
  ],
  'lifetime-isa-calculator': [
    { question: 'What does the Lifetime ISA Calculator do?', answer: 'Calculate LISA growth with the 25% government bonus. For first homes (up to £450K) or retirement (60+). All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator suitable for financial decisions?', answer: 'This calculator provides estimates for guidance only. Investment returns are not guaranteed and your capital is at risk. Consider seeking independent financial advice before making investment decisions.' },
    { question: 'Are ISA contributions tax-free?', answer: 'Yes. The annual ISA allowance for 2025/26 is £20,000. Any interest, dividends or capital gains within an ISA are completely tax-free.' },
  ],
  'child-maintenance-calculator': [
    { question: 'What does the Child Maintenance (CMS) Calculator do?', answer: 'Calculate child maintenance using CMS rules. Accounts for income, shared care nights and other children. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Are benefit amounts accurate?', answer: 'This calculator uses the published 2025/26 benefit rates. However, actual entitlements depend on a full assessment by the Department for Work and Pensions (DWP) and may differ from estimates.' },
    { question: 'How do I claim this benefit?', answer: 'You can apply for most benefits through GOV.UK or your local Jobcentre Plus. Some benefits require an online application; others may require a phone call or paper form.' },
  ],
  'moving-cost-calculator': [
    { question: 'What does the Home Moving Cost Calculator do?', answer: 'Calculate the total costs of buying a home — solicitor, stamp duty, survey, mortgage fees and removals. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this based on current interest rates?', answer: 'You can enter any interest rate to model different scenarios. Check the Bank of England base rate and current mortgage deals from lenders for the latest rates.' },
    { question: 'Should I get professional advice?', answer: 'This calculator provides estimates for guidance only. For a formal mortgage offer, speak to a mortgage broker or lender who can assess your full circumstances and provide personalised advice.' },
  ],
  'paternity-pay-calculator': [
    { question: 'What does the Statutory Paternity Pay Calculator do?', answer: 'Calculate SPP entitlement — 2 weeks at £187.18/week or 90% of AWE (whichever is lower). All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator based on 2025/26 rates?', answer: 'Yes. This calculator uses the current 2025/26 UK tax year rates for income tax, National Insurance and other deductions, effective from 6 April 2025.' },
    { question: 'Does this include pension contributions?', answer: 'This calculator can factor in workplace pension contributions. Under auto-enrolment, the minimum is 8% total (5% employee + 3% employer) of qualifying earnings.' },
  ],
  'notice-period-calculator': [
    { question: 'What does the Notice Period Calculator do?', answer: 'Calculate your statutory and contractual notice period based on years of service. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator based on 2025/26 rates?', answer: 'Yes. This calculator uses the current 2025/26 UK tax year rates for income tax, National Insurance and other deductions, effective from 6 April 2025.' },
    { question: 'Does this include pension contributions?', answer: 'This calculator can factor in workplace pension contributions. Under auto-enrolment, the minimum is 8% total (5% employee + 3% employer) of qualifying earnings.' },
  ],
  'work-from-home-tax-relief-calculator': [
    { question: 'What does the Working from Home Tax Relief Calculator do?', answer: 'Calculate tax relief for working from home. £6/week flat rate or actual costs claim. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator based on 2025/26 rates?', answer: 'Yes. This calculator uses the current 2025/26 UK tax year rates for income tax, National Insurance and other deductions, effective from 6 April 2025.' },
    { question: 'Does this include pension contributions?', answer: 'This calculator can factor in workplace pension contributions. Under auto-enrolment, the minimum is 8% total (5% employee + 3% employer) of qualifying earnings.' },
  ],
  'insulation-calculator': [
    { question: 'What does the Insulation Calculator do?', answer: 'Compare loft, cavity wall, solid wall and floor insulation costs, savings and payback periods. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Does this include waste allowance?', answer: 'Yes. Most building material calculations include a standard 10% waste allowance. You can adjust this figure depending on the complexity of your project and cutting requirements.' },
    { question: 'Are prices accurate?', answer: 'Material prices are indicative estimates based on average UK prices. Actual costs vary by region, supplier, brand and current market conditions. Always get quotes from local suppliers.' },
  ],
  'vat-return-calculator': [
    { question: 'What does the VAT Return Calculator do?', answer: 'Calculate your VAT return — output VAT on sales vs input VAT on purchases. See amount due or refund. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this suitable for my business?', answer: 'This calculator provides general estimates based on standard UK business rates and rules. Every business is different — consult your accountant for advice specific to your circumstances.' },
    { question: 'Does this use 2025/26 tax rates?', answer: 'Yes. All rates and thresholds are based on the current 2025/26 UK tax year. Corporation Tax main rate is 25% for profits over £250,000, with a 19% small profits rate.' },
  ],
  'payroll-calculator': [
    { question: 'What does the Payroll Calculator — UK PAYE & NI do?', answer: 'Run a monthly payroll calculation showing payslip breakdown, tax, NI, pension and employer costs. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this suitable for my business?', answer: 'This calculator provides general estimates based on standard UK business rates and rules. Every business is different — consult your accountant for advice specific to your circumstances.' },
    { question: 'Does this use 2025/26 tax rates?', answer: 'Yes. All rates and thresholds are based on the current 2025/26 UK tax year. Corporation Tax main rate is 25% for profits over £250,000, with a 19% small profits rate.' },
  ],
  'late-payment-interest-calculator': [
    { question: 'What does the Late Payment Interest Calculator do?', answer: 'Calculate statutory interest and compensation on overdue commercial invoices under UK law. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this suitable for my business?', answer: 'This calculator provides general estimates based on standard UK business rates and rules. Every business is different — consult your accountant for advice specific to your circumstances.' },
    { question: 'Does this use 2025/26 tax rates?', answer: 'Yes. All rates and thresholds are based on the current 2025/26 UK tax year. Corporation Tax main rate is 25% for profits over £250,000, with a 19% small profits rate.' },
  ],
  'overtime-calculator': [
    { question: 'What does the Overtime Pay Calculator do?', answer: 'Calculate overtime earnings at time-and-a-half, double time or custom rates. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator based on 2025/26 rates?', answer: 'Yes. This calculator uses the current 2025/26 UK tax year rates for income tax, National Insurance and other deductions, effective from 6 April 2025.' },
    { question: 'Does this include pension contributions?', answer: 'This calculator can factor in workplace pension contributions. Under auto-enrolment, the minimum is 8% total (5% employee + 3% employer) of qualifying earnings.' },
  ],
  'nhs-pay-calculator': [
    { question: 'What does the NHS Pay Calculator (Agenda for Change) do?', answer: 'Calculate NHS salary, take-home pay and hourly rate by Agenda for Change pay band. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator based on 2025/26 rates?', answer: 'Yes. This calculator uses the current 2025/26 UK tax year rates for income tax, National Insurance and other deductions, effective from 6 April 2025.' },
    { question: 'Does this include pension contributions?', answer: 'This calculator can factor in workplace pension contributions. Under auto-enrolment, the minimum is 8% total (5% employee + 3% employer) of qualifying earnings.' },
  ],
  'childcare-cost-calculator': [
    { question: 'What does the Childcare Costs Calculator (Tax-Free Childcare) do?', answer: 'Calculate childcare costs with Tax-Free Childcare and 30 hours free entitlement. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Are benefit amounts accurate?', answer: 'This calculator uses the published 2025/26 benefit rates. However, actual entitlements depend on a full assessment by the Department for Work and Pensions (DWP) and may differ from estimates.' },
    { question: 'How do I claim this benefit?', answer: 'You can apply for most benefits through GOV.UK or your local Jobcentre Plus. Some benefits require an online application; others may require a phone call or paper form.' },
  ],
  'mot-date-calculator': [
    { question: 'What does the MOT Date Calculator do?', answer: 'Find when your next MOT is due. First MOT 3 years after registration, then annual. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Does this use current UK rates?', answer: 'Yes. This calculator uses the latest UK rates for vehicle tax, fuel duty and other motoring costs as of the 2025/26 financial year.' },
    { question: 'Is this suitable for electric vehicles?', answer: 'From April 2025, electric vehicles are no longer exempt from Vehicle Excise Duty (road tax). This calculator accounts for EV-specific rates where applicable.' },
  ],
  'train-season-ticket-calculator': [
    { question: 'What does the Train Season Ticket Calculator do?', answer: 'Compare daily, weekly, monthly and annual season ticket costs to find the best value. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Does this use current UK rates?', answer: 'Yes. This calculator uses the latest UK rates for vehicle tax, fuel duty and other motoring costs as of the 2025/26 financial year.' },
    { question: 'Is this suitable for electric vehicles?', answer: 'From April 2025, electric vehicles are no longer exempt from Vehicle Excise Duty (road tax). This calculator accounts for EV-specific rates where applicable.' },
  ],
  'driving-test-cost-calculator': [
    { question: 'What does the Driving Test Cost Calculator do?', answer: 'Calculate the total cost of learning to drive — lessons, theory test, practical test and provisional licence. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Does this use current UK rates?', answer: 'Yes. This calculator uses the latest UK rates for vehicle tax, fuel duty and other motoring costs as of the 2025/26 financial year.' },
    { question: 'Is this suitable for electric vehicles?', answer: 'From April 2025, electric vehicles are no longer exempt from Vehicle Excise Duty (road tax). This calculator accounts for EV-specific rates where applicable.' },
  ],
  'income-protection-calculator': [
    { question: 'What does the Income Protection Calculator do?', answer: 'Calculate income protection cover needed and estimate monthly premiums by age and deferral period. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Are these actual quotes?', answer: 'No. This calculator provides estimates based on typical UK insurance factors. Actual premiums depend on your specific circumstances. Always compare quotes from multiple insurers.' },
    { question: 'Is insurance required by law?', answer: 'Some insurance is legally required in the UK — such as motor insurance, employers\' liability insurance and buildings insurance (if you have a mortgage). Other types are optional but strongly recommended.' },
  ],
  'travel-insurance-calculator': [
    { question: 'What does the Travel Insurance Calculator do?', answer: 'Estimate travel insurance premiums for Europe and worldwide trips. Compare cover levels. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Are these actual quotes?', answer: 'No. This calculator provides estimates based on typical UK insurance factors. Actual premiums depend on your specific circumstances. Always compare quotes from multiple insurers.' },
    { question: 'Is insurance required by law?', answer: 'Some insurance is legally required in the UK — such as motor insurance, employers\' liability insurance and buildings insurance (if you have a mortgage). Other types are optional but strongly recommended.' },
  ],
  'spousal-maintenance-calculator': [
    { question: 'What does the Spousal Maintenance Calculator do?', answer: 'Estimate spousal maintenance range for divorce. Based on income difference and length of marriage. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Are court fees accurate?', answer: 'This calculator uses the current UK court fee schedule. Fees are set by the Ministry of Justice and are reviewed periodically. Check GOV.UK for the very latest fee amounts.' },
    { question: 'Do I need a solicitor?', answer: 'Whether you need a solicitor depends on the complexity of your case. For straightforward matters you may be able to represent yourself, but for significant legal issues professional advice is recommended.' },
  ],
  'gcse-grade-calculator': [
    { question: 'What does the GCSE Grade Calculator (9-1) do?', answer: 'Calculate Attainment 8 score, average grade and pass counts from your GCSE grades. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this based on current student finance rates?', answer: 'Yes. This calculator uses Student Loans Company rates and thresholds for the 2025/26 academic and financial year. Thresholds and interest rates are updated annually.' },
    { question: 'Which student loan plan am I on?', answer: 'Plan 1 applies if you started before September 2012 (England/Wales) or are from Northern Ireland. Plan 2 applies from September 2012 in England/Wales. Plan 4 is for Scotland. Plan 5 applies from September 2023.' },
  ],
  'university-cost-calculator': [
    { question: 'What does the University Cost Calculator do?', answer: 'Calculate the total cost of university including tuition fees, maintenance loan and living costs. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this based on current student finance rates?', answer: 'Yes. This calculator uses Student Loans Company rates and thresholds for the 2025/26 academic and financial year. Thresholds and interest rates are updated annually.' },
    { question: 'Which student loan plan am I on?', answer: 'Plan 1 applies if you started before September 2012 (England/Wales) or are from Northern Ireland. Plan 2 applies from September 2012 in England/Wales. Plan 4 is for Scotland. Plan 5 applies from September 2023.' },
  ],
  'greenhouse-size-calculator': [
    { question: 'What does the Greenhouse Size Calculator do?', answer: 'Calculate greenhouse growing capacity. See how many plants fit by type with common size presets. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Does this include delivery costs?', answer: 'This calculator estimates material quantities and approximate costs. Delivery charges vary by supplier, quantity and location. Bulk orders often qualify for free or reduced delivery.' },
    { question: 'When is the best time for this project?', answer: 'Timing depends on the specific project. Generally, spring and autumn are ideal for lawn and planting work, while hard landscaping can be done year-round in dry conditions.' },
  ],
  'pond-volume-calculator': [
    { question: 'What does the Pond Volume Calculator do?', answer: 'Calculate pond volume in litres, pump size and liner dimensions for rectangle, circle or oval ponds. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Does this include delivery costs?', answer: 'This calculator estimates material quantities and approximate costs. Delivery charges vary by supplier, quantity and location. Bulk orders often qualify for free or reduced delivery.' },
    { question: 'When is the best time for this project?', answer: 'Timing depends on the specific project. Generally, spring and autumn are ideal for lawn and planting work, while hard landscaping can be done year-round in dry conditions.' },
  ],
  'side-hustle-tax-calculator': [
    { question: 'What does the Side Hustle / Trading Allowance Calculator do?', answer: 'Calculate tax on side hustle income. Use the £1,000 trading allowance or claim actual expenses. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator updated for the 2025/26 tax year?', answer: 'Yes. This calculator uses the latest HMRC rates and thresholds for the 2025/26 UK tax year, which runs from 6 April 2025 to 5 April 2026. Rates are verified against official HMRC publications.' },
    { question: 'Do I need to tell HMRC about this?', answer: 'Whether you need to report to HMRC depends on your individual circumstances. If you are unsure, check GOV.UK or contact HMRC directly. This calculator provides estimates for guidance only.' },
  ],
  'employment-tribunal-calculator': [
    { question: 'What does the Employment Tribunal Award Calculator do?', answer: 'Estimate unfair dismissal tribunal awards — basic award and compensatory award. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Are court fees accurate?', answer: 'This calculator uses the current UK court fee schedule. Fees are set by the Ministry of Justice and are reviewed periodically. Check GOV.UK for the very latest fee amounts.' },
    { question: 'Do I need a solicitor?', answer: 'Whether you need a solicitor depends on the complexity of your case. For straightforward matters you may be able to represent yourself, but for significant legal issues professional advice is recommended.' },
  ],
  'roof-tiles-calculator': [
    { question: 'What does the Roof Tiles Calculator do?', answer: 'Calculate roof tiles, ridge tiles, batten and felt needed based on roof dimensions and pitch. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Does this include waste allowance?', answer: 'Yes. Most building material calculations include a standard 10% waste allowance. You can adjust this figure depending on the complexity of your project and cutting requirements.' },
    { question: 'Are prices accurate?', answer: 'Material prices are indicative estimates based on average UK prices. Actual costs vary by region, supplier, brand and current market conditions. Always get quotes from local suppliers.' },
  ],
  'water-bill-calculator': [
    { question: 'What does the Water Bill Calculator do?', answer: 'Estimate your annual water bill for metered or unmetered supply including sewerage charges. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Does this reflect the current energy price cap?', answer: 'This calculator uses representative energy prices. The Ofgem energy price cap changes quarterly — check Ofgem\'s website for the latest cap level applicable to your region and payment method.' },
    { question: 'Can I save money by switching tariff?', answer: 'Potentially yes. The energy market offers various fixed and variable tariffs. Use a comparison site authorised by Ofgem (such as Ofgem\'s own comparison tool) to check if switching could save you money.' },
  ],
  'buy-to-let-yield-calculator': [
    { question: 'What does the Buy-to-Let Yield Calculator do?', answer: 'Calculate gross yield, net yield, return on deposit and monthly cashflow for buy-to-let investments. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this based on current interest rates?', answer: 'You can enter any interest rate to model different scenarios. Check the Bank of England base rate and current mortgage deals from lenders for the latest rates.' },
    { question: 'Should I get professional advice?', answer: 'This calculator provides estimates for guidance only. For a formal mortgage offer, speak to a mortgage broker or lender who can assess your full circumstances and provide personalised advice.' },
  ],
  'ltv-calculator': [
    { question: 'What does the Loan-to-Value (LTV) Calculator do?', answer: 'Calculate your LTV ratio and see how it affects mortgage rates and borrowing options. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this based on current interest rates?', answer: 'You can enter any interest rate to model different scenarios. Check the Bank of England base rate and current mortgage deals from lenders for the latest rates.' },
    { question: 'Should I get professional advice?', answer: 'This calculator provides estimates for guidance only. For a formal mortgage offer, speak to a mortgage broker or lender who can assess your full circumstances and provide personalised advice.' },
  ],
  'stamp-duty-additional-property-calculator': [
    { question: 'What does the Stamp Duty Additional Property Calculator do?', answer: 'Calculate SDLT with the 5% additional property surcharge for buy-to-let and second homes. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator updated for the 2025/26 tax year?', answer: 'Yes. This calculator uses the latest HMRC rates and thresholds for the 2025/26 UK tax year, which runs from 6 April 2025 to 5 April 2026. Rates are verified against official HMRC publications.' },
    { question: 'Do I need to tell HMRC about this?', answer: 'Whether you need to report to HMRC depends on your individual circumstances. If you are unsure, check GOV.UK or contact HMRC directly. This calculator provides estimates for guidance only.' },
  ],
  'remortgage-calculator': [
    { question: 'What does the Remortgage Calculator do?', answer: 'Compare current vs new mortgage rate. See monthly savings, break-even and total cost including fees. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this based on current interest rates?', answer: 'You can enter any interest rate to model different scenarios. Check the Bank of England base rate and current mortgage deals from lenders for the latest rates.' },
    { question: 'Should I get professional advice?', answer: 'This calculator provides estimates for guidance only. For a formal mortgage offer, speak to a mortgage broker or lender who can assess your full circumstances and provide personalised advice.' },
  ],
  'debt-to-income-calculator': [
    { question: 'What does the Debt-to-Income Ratio Calculator do?', answer: 'Calculate your DTI ratio to see if lenders will approve your mortgage or loan application. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this based on current interest rates?', answer: 'You can enter any interest rate to model different scenarios. Check the Bank of England base rate and current mortgage deals from lenders for the latest rates.' },
    { question: 'Should I get professional advice?', answer: 'This calculator provides estimates for guidance only. For a formal mortgage offer, speak to a mortgage broker or lender who can assess your full circumstances and provide personalised advice.' },
  ],
  'apr-calculator': [
    { question: 'What does the APR Calculator — True Interest Rate do?', answer: 'Calculate the true Annual Percentage Rate of any loan from the amount borrowed and total repaid. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Does this use current UK interest rates?', answer: 'You can enter any interest rate to model different scenarios. The Bank of England base rate and FCA guidelines influence typical lending rates available in the UK market.' },
    { question: 'Should I get professional debt advice?', answer: 'If you are struggling with debt, free professional advice is available from StepChange (0800 138 1111), Citizens Advice, and the National Debtline (0808 808 4000). This calculator provides estimates only.' },
  ],
  'bnpl-calculator': [
    { question: 'What does the Buy Now Pay Later Calculator do?', answer: 'Calculate BNPL instalment costs for Klarna, Clearpay and custom plans. See the true cost and late fee risks. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Does this use current UK interest rates?', answer: 'You can enter any interest rate to model different scenarios. The Bank of England base rate and FCA guidelines influence typical lending rates available in the UK market.' },
    { question: 'Should I get professional debt advice?', answer: 'If you are struggling with debt, free professional advice is available from StepChange (0800 138 1111), Citizens Advice, and the National Debtline (0808 808 4000). This calculator provides estimates only.' },
  ],
  'salary-sacrifice-pension-calculator': [
    { question: 'What does the Salary Sacrifice Pension Calculator do?', answer: 'Compare salary sacrifice vs relief at source pension contributions. See tax and NI savings. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Are these figures guaranteed?', answer: 'No. Pension projections are estimates based on assumed growth rates and current contribution levels. Actual returns depend on investment performance, fees and future policy changes.' },
    { question: 'What is the pension annual allowance?', answer: 'The pension annual allowance for 2025/26 is £60,000. This is the maximum you can contribute (including employer contributions) and receive tax relief. The allowance is tapered for high earners.' },
  ],
  'temperature-converter': [
    { question: 'What does the Temperature Converter do?', answer: 'Convert between Celsius, Fahrenheit and Kelvin instantly. Includes common temperature reference points and conversion formulas. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator free to use?', answer: 'Yes. All calculators on Calks.uk are completely free to use. No account or registration is required. All calculations run in your browser — no data is collected.' },
    { question: 'Can I use this on my phone?', answer: 'Yes. All our calculators are fully responsive and work on smartphones, tablets and desktop computers. The interface adapts to your screen size automatically.' },
  ],
  'length-converter': [
    { question: 'What does the Length Converter — Metric & Imperial do?', answer: 'Convert between mm, cm, metres, km, inches, feet, yards and miles. Includes feet & inches display. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator free to use?', answer: 'Yes. All calculators on Calks.uk are completely free to use. No account or registration is required. All calculations run in your browser — no data is collected.' },
    { question: 'Can I use this on my phone?', answer: 'Yes. All our calculators are fully responsive and work on smartphones, tablets and desktop computers. The interface adapts to your screen size automatically.' },
  ],
  'area-converter': [
    { question: 'What does the Area Converter (m² / ft² / acres) do?', answer: 'Convert between square metres, square feet, acres, hectares and more. Includes all common UK area units with instant results. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator free to use?', answer: 'Yes. All calculators on Calks.uk are completely free to use. No account or registration is required. All calculations run in your browser — no data is collected.' },
    { question: 'Can I use this on my phone?', answer: 'Yes. All our calculators are fully responsive and work on smartphones, tablets and desktop computers. The interface adapts to your screen size automatically.' },
  ],
  'cooking-converter': [
    { question: 'What does the Cooking Measurement Converter do?', answer: 'Convert between ml, cups, tablespoons, pints and ounces. Includes gas mark to °C/°F chart. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator free to use?', answer: 'Yes. All calculators on Calks.uk are completely free to use. No account or registration is required. All calculations run in your browser — no data is collected.' },
    { question: 'Can I use this on my phone?', answer: 'Yes. All our calculators are fully responsive and work on smartphones, tablets and desktop computers. The interface adapts to your screen size automatically.' },
  ],
  'timezone-converter': [
    { question: 'What does the Time Zone Converter do?', answer: 'Convert times between 15+ world time zones. See all zones at a glance. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator free to use?', answer: 'Yes. All calculators on Calks.uk are completely free to use. No account or registration is required. All calculations run in your browser — no data is collected.' },
    { question: 'Can I use this on my phone?', answer: 'Yes. All our calculators are fully responsive and work on smartphones, tablets and desktop computers. The interface adapts to your screen size automatically.' },
  ],
  'ilr-calculator': [
    { question: 'What does the ILR Eligibility Calculator do?', answer: 'Check if you qualify for Indefinite Leave to Remain based on your visa route, time in UK and absences. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Are visa fees up to date?', answer: 'This calculator uses the current UK visa and immigration fees as published by UK Visas and Immigration (UKVI). Fees are reviewed periodically — check GOV.UK for the very latest amounts.' },
    { question: 'Does this include the Immigration Health Surcharge?', answer: 'Yes. The Immigration Health Surcharge (IHS) is included in the total cost calculation where applicable. The current IHS rate is £1,035 per year for most visa categories.' },
  ],
  'steps-to-miles-calculator': [
    { question: 'What does the Steps to Miles/Km Calculator do?', answer: 'Convert steps to distance, calories and walking time based on your height and stride length. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this medical advice?', answer: 'No. This calculator is for informational purposes only and does not constitute medical advice. Always consult your GP or an appropriate healthcare professional for medical guidance.' },
    { question: 'Are the reference values from the NHS?', answer: 'Where applicable, this calculator uses reference values and guidelines from the NHS and other UK health authorities. Individual needs may vary based on personal health circumstances.' },
  ],
  'heart-rate-zone-calculator': [
    { question: 'What does the Heart Rate Zone Calculator do?', answer: 'Calculate your 5 heart rate training zones using the Karvonen formula with resting heart rate. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this medical advice?', answer: 'No. This calculator is for informational purposes only and does not constitute medical advice. Always consult your GP or an appropriate healthcare professional for medical guidance.' },
    { question: 'Are the reference values from the NHS?', answer: 'Where applicable, this calculator uses reference values and guidelines from the NHS and other UK health authorities. Individual needs may vary based on personal health circumstances.' },
  ],
  'probability-calculator': [
    { question: 'What does the Probability Calculator do?', answer: 'Calculate event probabilities, combinations and permutations. P(A or B), P(A and B), nCr, nPr. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'How accurate are the results?', answer: 'This calculator uses standard mathematical algorithms and provides results accurate to the precision shown. For very large numbers or high-precision requirements, results are rounded to a reasonable number of decimal places.' },
    { question: 'Can I use this for schoolwork?', answer: 'Yes. This calculator is suitable for GCSE, A-level and university-level mathematics. It follows standard mathematical conventions used in UK education.' },
  ],
  'annual-tax-summary-calculator': [
    { question: 'What does the Annual Tax Summary Calculator do?', answer: 'Calculate your total tax bill from all income sources — salary, dividends, self-employment, rental and capital gains. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator updated for the 2025/26 tax year?', answer: 'Yes. This calculator uses the latest HMRC rates and thresholds for the 2025/26 UK tax year, which runs from 6 April 2025 to 5 April 2026. Rates are verified against official HMRC publications.' },
    { question: 'Do I need to tell HMRC about this?', answer: 'Whether you need to report to HMRC depends on your individual circumstances. If you are unsure, check GOV.UK or contact HMRC directly. This calculator provides estimates for guidance only.' },
  ],
  'business-rates-calculator': [
    { question: 'What does the Business Rates Calculator do?', answer: 'Calculate business rates from rateable value. Includes Small Business Rate Relief. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this suitable for my business?', answer: 'This calculator provides general estimates based on standard UK business rates and rules. Every business is different — consult your accountant for advice specific to your circumstances.' },
    { question: 'Does this use 2025/26 tax rates?', answer: 'Yes. All rates and thresholds are based on the current 2025/26 UK tax year. Corporation Tax main rate is 25% for profits over £250,000, with a 19% small profits rate.' },
  ],
  'rd-tax-credit-calculator': [
    { question: 'What does the R&D Tax Credit Calculator do?', answer: 'Estimate R&D tax credits for profitable and loss-making companies under the merged RDEC scheme. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this suitable for my business?', answer: 'This calculator provides general estimates based on standard UK business rates and rules. Every business is different — consult your accountant for advice specific to your circumstances.' },
    { question: 'Does this use 2025/26 tax rates?', answer: 'Yes. All rates and thresholds are based on the current 2025/26 UK tax year. Corporation Tax main rate is 25% for profits over £250,000, with a 19% small profits rate.' },
  ],
  'cis-calculator': [
    { question: 'What does the CIS Subcontractor Tax Calculator do?', answer: 'Calculate CIS deductions on subcontractor invoices at 20%, 30% or gross payment status. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this suitable for my business?', answer: 'This calculator provides general estimates based on standard UK business rates and rules. Every business is different — consult your accountant for advice specific to your circumstances.' },
    { question: 'Does this use 2025/26 tax rates?', answer: 'Yes. All rates and thresholds are based on the current 2025/26 UK tax year. Corporation Tax main rate is 25% for profits over £250,000, with a 19% small profits rate.' },
  ],
  'pet-insurance-calculator': [
    { question: 'What does the Pet Insurance Calculator do?', answer: 'Estimate pet insurance premiums for dogs and cats by age, breed and cover level. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Are these actual quotes?', answer: 'No. This calculator provides estimates based on typical UK insurance factors. Actual premiums depend on your specific circumstances. Always compare quotes from multiple insurers.' },
    { question: 'Is insurance required by law?', answer: 'Some insurance is legally required in the UK — such as motor insurance, employers\' liability insurance and buildings insurance (if you have a mortgage). Other types are optional but strongly recommended.' },
  ],
  'student-maintenance-loan-calculator': [
    { question: 'What does the Student Maintenance Loan Calculator do?', answer: 'Estimate your maintenance loan based on household income and living situation. England 2025/26 rates. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this based on current student finance rates?', answer: 'Yes. This calculator uses Student Loans Company rates and thresholds for the 2025/26 academic and financial year. Thresholds and interest rates are updated annually.' },
    { question: 'Which student loan plan am I on?', answer: 'Plan 1 applies if you started before September 2012 (England/Wales) or are from Northern Ireland. Plan 2 applies from September 2012 in England/Wales. Plan 4 is for Scotland. Plan 5 applies from September 2023.' },
  ],
  'boiler-replacement-calculator': [
    { question: 'What does the Boiler Replacement Cost Calculator do?', answer: 'Compare old vs new boiler efficiency. Calculate installation cost, annual savings and payback period. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Does this reflect the current energy price cap?', answer: 'This calculator uses representative energy prices. The Ofgem energy price cap changes quarterly — check Ofgem\'s website for the latest cap level applicable to your region and payment method.' },
    { question: 'Can I save money by switching tariff?', answer: 'Potentially yes. The energy market offers various fixed and variable tariffs. Use a comparison site authorised by Ofgem (such as Ofgem\'s own comparison tool) to check if switching could save you money.' },
  ],
  'double-glazing-calculator': [
    { question: 'What does the Double Glazing Savings Calculator do?', answer: 'Calculate double glazing costs and annual energy savings by house type. See payback period. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Does this reflect the current energy price cap?', answer: 'This calculator uses representative energy prices. The Ofgem energy price cap changes quarterly — check Ofgem\'s website for the latest cap level applicable to your region and payment method.' },
    { question: 'Can I save money by switching tariff?', answer: 'Potentially yes. The energy market offers various fixed and variable tariffs. Use a comparison site authorised by Ofgem (such as Ofgem\'s own comparison tool) to check if switching could save you money.' },
  ],
  'weight-loss-calculator': [
    { question: 'What does the Weight Loss Calculator do?', answer: 'Calculate how long to reach your target weight with milestones and daily calorie deficit. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this medical advice?', answer: 'No. This calculator is for informational purposes only and does not constitute medical advice. Always consult your GP or an appropriate healthcare professional for medical guidance.' },
    { question: 'Are the reference values from the NHS?', answer: 'Where applicable, this calculator uses reference values and guidelines from the NHS and other UK health authorities. Individual needs may vary based on personal health circumstances.' },
  ],
  'protein-intake-calculator': [
    { question: 'What does the Protein Intake Calculator do?', answer: 'Calculate daily protein needs by weight and goal. See common protein sources per serving. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this medical advice?', answer: 'No. This calculator is for informational purposes only and does not constitute medical advice. Always consult your GP or an appropriate healthcare professional for medical guidance.' },
    { question: 'Are the reference values from the NHS?', answer: 'Where applicable, this calculator uses reference values and guidelines from the NHS and other UK health authorities. Individual needs may vary based on personal health circumstances.' },
  ],
  'ovulation-calculator': [
    { question: 'What does the Ovulation Calculator do?', answer: 'Estimate ovulation date and fertile window based on your last period and cycle length. See 3 cycles ahead. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this medical advice?', answer: 'No. This calculator is for informational purposes only and does not constitute medical advice. Always consult your GP or an appropriate healthcare professional for medical guidance.' },
    { question: 'Are the reference values from the NHS?', answer: 'Where applicable, this calculator uses reference values and guidelines from the NHS and other UK health authorities. Individual needs may vary based on personal health circumstances.' },
  ],
  'car-lease-vs-buy-calculator': [
    { question: 'What does the Car Lease vs Buy Calculator do?', answer: 'Compare leasing vs buying a car on finance. See which is cheaper after depreciation and interest. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Does this use current UK rates?', answer: 'Yes. This calculator uses the latest UK rates for vehicle tax, fuel duty and other motoring costs as of the 2025/26 financial year.' },
    { question: 'Is this suitable for electric vehicles?', answer: 'From April 2025, electric vehicles are no longer exempt from Vehicle Excise Duty (road tax). This calculator accounts for EV-specific rates where applicable.' },
  ],
  'sole-trader-vs-ltd-calculator': [
    { question: 'What does the Sole Trader vs Limited Company Calculator do?', answer: 'Compare take-home pay as a sole trader vs limited company director. See full tax breakdown for both. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this suitable for my business?', answer: 'This calculator provides general estimates based on standard UK business rates and rules. Every business is different — consult your accountant for advice specific to your circumstances.' },
    { question: 'Does this use 2025/26 tax rates?', answer: 'Yes. All rates and thresholds are based on the current 2025/26 UK tax year. Corporation Tax main rate is 25% for profits over £250,000, with a 19% small profits rate.' },
  ],
  'pension-credit-calculator': [
    { question: 'What does the Pension Credit Calculator do?', answer: 'Estimate Pension Credit Guarantee Credit entitlement based on income, pension and savings. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Are benefit amounts accurate?', answer: 'This calculator uses the published 2025/26 benefit rates. However, actual entitlements depend on a full assessment by the Department for Work and Pensions (DWP) and may differ from estimates.' },
    { question: 'How do I claim this benefit?', answer: 'You can apply for most benefits through GOV.UK or your local Jobcentre Plus. Some benefits require an online application; others may require a phone call or paper form.' },
  ],
  'housing-benefit-calculator': [
    { question: 'What does the Housing Benefit Calculator do?', answer: 'Estimate Housing Benefit based on rent, LHA rate and income. Includes taper calculation. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Are benefit amounts accurate?', answer: 'This calculator uses the published 2025/26 benefit rates. However, actual entitlements depend on a full assessment by the Department for Work and Pensions (DWP) and may differ from estimates.' },
    { question: 'How do I claim this benefit?', answer: 'You can apply for most benefits through GOV.UK or your local Jobcentre Plus. Some benefits require an online application; others may require a phone call or paper form.' },
  ],
  'vat-threshold-calculator': [
    { question: 'What does the VAT Threshold Monitor do?', answer: 'Track your rolling 12-month turnover against the £90,000 VAT registration threshold. See headroom remaining. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this suitable for my business?', answer: 'This calculator provides general estimates based on standard UK business rates and rules. Every business is different — consult your accountant for advice specific to your circumstances.' },
    { question: 'Does this use 2025/26 tax rates?', answer: 'Yes. All rates and thresholds are based on the current 2025/26 UK tax year. Corporation Tax main rate is 25% for profits over £250,000, with a 19% small profits rate.' },
  ],
  'umbrella-company-calculator': [
    { question: 'What does the Umbrella Company Calculator do?', answer: 'Calculate take-home pay through an umbrella company. See full payslip breakdown with employer NI and fees. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator based on 2025/26 rates?', answer: 'Yes. This calculator uses the current 2025/26 UK tax year rates for income tax, National Insurance and other deductions, effective from 6 April 2025.' },
    { question: 'Does this include pension contributions?', answer: 'This calculator can factor in workplace pension contributions. Under auto-enrolment, the minimum is 8% total (5% employee + 3% employer) of qualifying earnings.' },
  ],
  'plaster-calculator': [
    { question: 'What does the Plaster Calculator — Bags & Coverage do?', answer: 'Calculate plaster needed in 25kg bags for skim coat, bonding/browning or one-coat plaster. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Does this include waste allowance?', answer: 'Yes. Most building material calculations include a standard 10% waste allowance. You can adjust this figure depending on the complexity of your project and cutting requirements.' },
    { question: 'Are prices accurate?', answer: 'Material prices are indicative estimates based on average UK prices. Actual costs vary by region, supplier, brand and current market conditions. Always get quotes from local suppliers.' },
  ],
  'staircase-calculator': [
    { question: 'What does the Staircase Calculator do?', answer: 'Calculate risers, treads, pitch and going for a staircase. Checks Building Regulations Part K compliance. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Does this include waste allowance?', answer: 'Yes. Most building material calculations include a standard 10% waste allowance. You can adjust this figure depending on the complexity of your project and cutting requirements.' },
    { question: 'Are prices accurate?', answer: 'Material prices are indicative estimates based on average UK prices. Actual costs vary by region, supplier, brand and current market conditions. Always get quotes from local suppliers.' },
  ],
  'exam-score-calculator': [
    { question: 'What does the Exam Score Calculator do?', answer: 'Calculate exam percentage and grade. Find out what score you need on remaining papers to hit your target. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this based on current student finance rates?', answer: 'Yes. This calculator uses Student Loans Company rates and thresholds for the 2025/26 academic and financial year. Thresholds and interest rates are updated annually.' },
    { question: 'Which student loan plan am I on?', answer: 'Plan 1 applies if you started before September 2012 (England/Wales) or are from Northern Ireland. Plan 2 applies from September 2012 in England/Wales. Plan 4 is for Scotland. Plan 5 applies from September 2023.' },
  ],
  'roman-numeral-converter': [
    { question: 'What does the Roman Numeral Converter do?', answer: 'Convert between decimal numbers and Roman numerals (I, V, X, L, C, D, M). Both directions. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'How accurate are the results?', answer: 'This calculator uses standard mathematical algorithms and provides results accurate to the precision shown. For very large numbers or high-precision requirements, results are rounded to a reasonable number of decimal places.' },
    { question: 'Can I use this for schoolwork?', answer: 'Yes. This calculator is suitable for GCSE, A-level and university-level mathematics. It follows standard mathematical conventions used in UK education.' },
  ],
  'capital-allowances-calculator': [
    { question: 'What does the Capital Allowances Calculator do?', answer: 'Calculate AIA, Full Expensing or Writing Down Allowance on business assets. See year-by-year tax relief. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this suitable for my business?', answer: 'This calculator provides general estimates based on standard UK business rates and rules. Every business is different — consult your accountant for advice specific to your circumstances.' },
    { question: 'Does this use 2025/26 tax rates?', answer: 'Yes. All rates and thresholds are based on the current 2025/26 UK tax year. Corporation Tax main rate is 25% for profits over £250,000, with a 19% small profits rate.' },
  ],
  'cash-flow-calculator': [
    { question: 'What does the Cash Flow Calculator do?', answer: 'Project monthly cash flow with income and expenses. See closing balance and lowest point. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this suitable for my business?', answer: 'This calculator provides general estimates based on standard UK business rates and rules. Every business is different — consult your accountant for advice specific to your circumstances.' },
    { question: 'Does this use 2025/26 tax rates?', answer: 'Yes. All rates and thresholds are based on the current 2025/26 UK tax year. Corporation Tax main rate is 25% for profits over £250,000, with a 19% small profits rate.' },
  ],
  'spouse-visa-calculator': [
    { question: 'What does the UK Spouse Visa Income Calculator do?', answer: 'Check if you meet the £29,000 minimum income for a UK Spouse visa. Includes savings calculation and total visa costs. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Are visa fees up to date?', answer: 'This calculator uses the current UK visa and immigration fees as published by UK Visas and Immigration (UKVI). Fees are reviewed periodically — check GOV.UK for the very latest amounts.' },
    { question: 'Does this include the Immigration Health Surcharge?', answer: 'Yes. The Immigration Health Surcharge (IHS) is included in the total cost calculation where applicable. The current IHS rate is £1,035 per year for most visa categories.' },
  ],
  'farm-operating-cost-calculator': [
    { question: 'What does the Farm Operating Cost Calculator do?', answer: 'Calculate per-hectare costs and profitability for arable farming. See break-even price per tonne. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Are these based on Defra rates?', answer: 'Where applicable, this calculator uses rates and data from Defra, the Rural Payments Agency and industry standard references for UK agriculture.' },
    { question: 'Does this account for regional variations?', answer: 'UK farming conditions vary by region, soil type and climate. This calculator provides national average figures — adjust for your specific location and circumstances.' },
  ],
  'personal-injury-calculator': [
    { question: 'What does the Personal Injury Compensation Calculator do?', answer: 'Estimate personal injury compensation based on Judicial College Guidelines for common injury types. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Are court fees accurate?', answer: 'This calculator uses the current UK court fee schedule. Fees are set by the Ministry of Justice and are reviewed periodically. Check GOV.UK for the very latest fee amounts.' },
    { question: 'Do I need a solicitor?', answer: 'Whether you need a solicitor depends on the complexity of your case. For straightforward matters you may be able to represent yourself, but for significant legal issues professional advice is recommended.' },
  ],
  'investment-return-calculator': [
    { question: 'What does the Investment Return Calculator do?', answer: 'Calculate nominal and real (inflation-adjusted) investment returns with monthly contributions over time. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator suitable for financial decisions?', answer: 'This calculator provides estimates for guidance only. Investment returns are not guaranteed and your capital is at risk. Consider seeking independent financial advice before making investment decisions.' },
    { question: 'Are ISA contributions tax-free?', answer: 'Yes. The annual ISA allowance for 2025/26 is £20,000. Any interest, dividends or capital gains within an ISA are completely tax-free.' },
  ],
  'savings-interest-tax-calculator': [
    { question: 'What does the Savings Interest Tax Calculator do?', answer: 'Calculate tax on savings interest above your Personal Savings Allowance. See max tax-free savings. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator suitable for financial decisions?', answer: 'This calculator provides estimates for guidance only. Investment returns are not guaranteed and your capital is at risk. Consider seeking independent financial advice before making investment decisions.' },
    { question: 'Are ISA contributions tax-free?', answer: 'Yes. The annual ISA allowance for 2025/26 is £20,000. Any interest, dividends or capital gains within an ISA are completely tax-free.' },
  ],
  'real-return-calculator': [
    { question: 'What does the Real Return Calculator (After Inflation) do?', answer: 'Calculate the real return on investments after accounting for inflation. See purchasing power impact. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator suitable for financial decisions?', answer: 'This calculator provides estimates for guidance only. Investment returns are not guaranteed and your capital is at risk. Consider seeking independent financial advice before making investment decisions.' },
    { question: 'Are ISA contributions tax-free?', answer: 'Yes. The annual ISA allowance for 2025/26 is £20,000. Any interest, dividends or capital gains within an ISA are completely tax-free.' },
  ],
  'rule-of-72-calculator': [
    { question: 'What does the Rule of 72 Calculator do?', answer: 'Estimate how long it takes to double your money at a given interest rate using the Rule of 72. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator suitable for financial decisions?', answer: 'This calculator provides estimates for guidance only. Investment returns are not guaranteed and your capital is at risk. Consider seeking independent financial advice before making investment decisions.' },
    { question: 'Are ISA contributions tax-free?', answer: 'Yes. The annual ISA allowance for 2025/26 is £20,000. Any interest, dividends or capital gains within an ISA are completely tax-free.' },
  ],
  'cost-of-delay-calculator': [
    { question: 'What does the Cost of Delay Calculator do?', answer: 'See how much you lose by waiting to invest. Compare starting now vs delaying by 1-10+ years. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator suitable for financial decisions?', answer: 'This calculator provides estimates for guidance only. Investment returns are not guaranteed and your capital is at risk. Consider seeking independent financial advice before making investment decisions.' },
    { question: 'Are ISA contributions tax-free?', answer: 'Yes. The annual ISA allowance for 2025/26 is £20,000. Any interest, dividends or capital gains within an ISA are completely tax-free.' },
  ],
  'teacher-pay-calculator': [
    { question: 'What does the Teacher Pay Calculator do?', answer: 'Calculate teacher salary by pay scale (M1-M6, UPS, Leadership). Includes London weighting and take-home pay. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator based on 2025/26 rates?', answer: 'Yes. This calculator uses the current 2025/26 UK tax year rates for income tax, National Insurance and other deductions, effective from 6 April 2025.' },
    { question: 'Does this include pension contributions?', answer: 'This calculator can factor in workplace pension contributions. Under auto-enrolment, the minimum is 8% total (5% employee + 3% employer) of qualifying earnings.' },
  ],
  'shared-parental-leave-calculator': [
    { question: 'What does the Shared Parental Leave Calculator do?', answer: 'Split parental leave between parents. Calculate ShPP payments for mother and partner. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator based on 2025/26 rates?', answer: 'Yes. This calculator uses the current 2025/26 UK tax year rates for income tax, National Insurance and other deductions, effective from 6 April 2025.' },
    { question: 'Does this include pension contributions?', answer: 'This calculator can factor in workplace pension contributions. Under auto-enrolment, the minimum is 8% total (5% employee + 3% employer) of qualifying earnings.' },
  ],
  'high-income-child-benefit-calculator': [
    { question: 'What does the High Income Child Benefit Charge Calculator do?', answer: 'Calculate HICBC clawback between £60K-£80K. See if you should still claim for NI credits. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Are benefit amounts accurate?', answer: 'This calculator uses the published 2025/26 benefit rates. However, actual entitlements depend on a full assessment by the Department for Work and Pensions (DWP) and may differ from estimates.' },
    { question: 'How do I claim this benefit?', answer: 'You can apply for most benefits through GOV.UK or your local Jobcentre Plus. Some benefits require an online application; others may require a phone call or paper form.' },
  ],
  'benefit-cap-calculator': [
    { question: 'What does the Benefit Cap Calculator do?', answer: 'Check if the benefit cap applies and how much your benefits will be reduced. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Are benefit amounts accurate?', answer: 'This calculator uses the published 2025/26 benefit rates. However, actual entitlements depend on a full assessment by the Department for Work and Pensions (DWP) and may differ from estimates.' },
    { question: 'How do I claim this benefit?', answer: 'You can apply for most benefits through GOV.UK or your local Jobcentre Plus. Some benefits require an online application; others may require a phone call or paper form.' },
  ],
  'trigonometry-calculator': [
    { question: 'What does the Trigonometry Calculator do?', answer: 'Calculate sin, cos, tan and inverse functions in degrees or radians. Includes sec, csc, cot. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'How accurate are the results?', answer: 'This calculator uses standard mathematical algorithms and provides results accurate to the precision shown. For very large numbers or high-precision requirements, results are rounded to a reasonable number of decimal places.' },
    { question: 'Can I use this for schoolwork?', answer: 'Yes. This calculator is suitable for GCSE, A-level and university-level mathematics. It follows standard mathematical conventions used in UK education.' },
  ],
  'freelance-tax-calculator': [
    { question: 'What does the Freelance Tax Calculator do?', answer: 'Calculate freelancer take-home pay from day rate. Includes tax, NI, expenses and VAT threshold warning. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator based on 2025/26 rates?', answer: 'Yes. This calculator uses the current 2025/26 UK tax year rates for income tax, National Insurance and other deductions, effective from 6 April 2025.' },
    { question: 'Does this include pension contributions?', answer: 'This calculator can factor in workplace pension contributions. Under auto-enrolment, the minimum is 8% total (5% employee + 3% employer) of qualifying earnings.' },
  ],
  'macro-calculator': [
    { question: 'What does the Macro Calculator — Protein, Carbs & Fat do?', answer: 'Calculate daily protein, carbs and fat targets based on your body stats, activity and goal. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this medical advice?', answer: 'No. This calculator is for informational purposes only and does not constitute medical advice. Always consult your GP or an appropriate healthcare professional for medical guidance.' },
    { question: 'Are the reference values from the NHS?', answer: 'Where applicable, this calculator uses reference values and guidelines from the NHS and other UK health authorities. Individual needs may vary based on personal health circumstances.' },
  ],
  'cost-of-living-calculator': [
    { question: 'What does the Cost of Living Calculator do?', answer: 'Track monthly expenses against take-home pay. See surplus or shortfall with editable UK average costs. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator free to use?', answer: 'Yes. All calculators on Calks.uk are completely free to use. No account or registration is required. All calculations run in your browser — no data is collected.' },
    { question: 'Can I use this on my phone?', answer: 'Yes. All our calculators are fully responsive and work on smartphones, tablets and desktop computers. The interface adapts to your screen size automatically.' },
  ],
  'smart-meter-calculator': [
    { question: 'What does the Smart Meter / Appliance Cost Calculator do?', answer: 'Calculate daily electricity cost from individual appliances. Adjust usage hours for each device. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Does this reflect the current energy price cap?', answer: 'This calculator uses representative energy prices. The Ofgem energy price cap changes quarterly — check Ofgem\'s website for the latest cap level applicable to your region and payment method.' },
    { question: 'Can I save money by switching tariff?', answer: 'Potentially yes. The energy market offers various fixed and variable tariffs. Use a comparison site authorised by Ofgem (such as Ofgem\'s own comparison tool) to check if switching could save you money.' },
  ],
  'gpa-calculator': [
    { question: 'What does the GPA Calculator (UK) do?', answer: 'Calculate UK GPA from module grades and credits. See degree classification equivalent. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this based on current student finance rates?', answer: 'Yes. This calculator uses Student Loans Company rates and thresholds for the 2025/26 academic and financial year. Thresholds and interest rates are updated annually.' },
    { question: 'Which student loan plan am I on?', answer: 'Plan 1 applies if you started before September 2012 (England/Wales) or are from Northern Ireland. Plan 2 applies from September 2012 in England/Wales. Plan 4 is for Scotland. Plan 5 applies from September 2023.' },
  ],
  'solicitor-fee-calculator': [
    { question: 'What does the Solicitor Fee Estimate Calculator do?', answer: 'Estimate solicitor fees for conveyancing, divorce, wills, probate and employment matters. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Are court fees accurate?', answer: 'This calculator uses the current UK court fee schedule. Fees are set by the Ministry of Justice and are reviewed periodically. Check GOV.UK for the very latest fee amounts.' },
    { question: 'Do I need a solicitor?', answer: 'Whether you need a solicitor depends on the complexity of your case. For straightforward matters you may be able to represent yourself, but for significant legal issues professional advice is recommended.' },
  ],
  'divorce-settlement-calculator': [
    { question: 'What does the Divorce Financial Settlement Calculator do?', answer: 'Estimate how assets might be split in a divorce — property, pensions, savings and debts. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Are court fees accurate?', answer: 'This calculator uses the current UK court fee schedule. Fees are set by the Ministry of Justice and are reviewed periodically. Check GOV.UK for the very latest fee amounts.' },
    { question: 'Do I need a solicitor?', answer: 'Whether you need a solicitor depends on the complexity of your case. For straightforward matters you may be able to represent yourself, but for significant legal issues professional advice is recommended.' },
  ],
  'uk-citizenship-calculator': [
    { question: 'What does the UK Citizenship Eligibility Calculator do?', answer: 'Check citizenship eligibility after ILR. See timeline, absence limits and total application costs. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Are visa fees up to date?', answer: 'This calculator uses the current UK visa and immigration fees as published by UK Visas and Immigration (UKVI). Fees are reviewed periodically — check GOV.UK for the very latest amounts.' },
    { question: 'Does this include the Immigration Health Surcharge?', answer: 'Yes. The Immigration Health Surcharge (IHS) is included in the total cost calculation where applicable. The current IHS rate is £1,035 per year for most visa categories.' },
  ],
  'free-school-meals-calculator': [
    { question: 'What does the Free School Meals Eligibility Calculator do?', answer: 'Check if your children qualify for free school meals. See annual savings and qualifying benefits. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Are benefit amounts accurate?', answer: 'This calculator uses the published 2025/26 benefit rates. However, actual entitlements depend on a full assessment by the Department for Work and Pensions (DWP) and may differ from estimates.' },
    { question: 'How do I claim this benefit?', answer: 'You can apply for most benefits through GOV.UK or your local Jobcentre Plus. Some benefits require an online application; others may require a phone call or paper form.' },
  ],
  'loft-conversion-calculator': [
    { question: 'What does the Loft Conversion Cost Calculator do?', answer: 'Estimate loft conversion costs by type (Velux, dormer, hip-to-gable, mansard). See ROI and value added. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Does this include waste allowance?', answer: 'Yes. Most building material calculations include a standard 10% waste allowance. You can adjust this figure depending on the complexity of your project and cutting requirements.' },
    { question: 'Are prices accurate?', answer: 'Material prices are indicative estimates based on average UK prices. Actual costs vary by region, supplier, brand and current market conditions. Always get quotes from local suppliers.' },
  ],
  'extension-cost-calculator': [
    { question: 'What does the Extension Cost Calculator do?', answer: 'Estimate home extension costs per m² for single/double storey, side return and wrap-around extensions. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Does this include waste allowance?', answer: 'Yes. Most building material calculations include a standard 10% waste allowance. You can adjust this figure depending on the complexity of your project and cutting requirements.' },
    { question: 'Are prices accurate?', answer: 'Material prices are indicative estimates based on average UK prices. Actual costs vary by region, supplier, brand and current market conditions. Always get quotes from local suppliers.' },
  ],
  'childcare-entitlement-calculator': [
    { question: 'What does the 30 Hours Free Childcare Calculator do?', answer: 'Check free childcare entitlement by age (15/30 hours). See savings with Tax-Free Childcare. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Are benefit amounts accurate?', answer: 'This calculator uses the published 2025/26 benefit rates. However, actual entitlements depend on a full assessment by the Department for Work and Pensions (DWP) and may differ from estimates.' },
    { question: 'How do I claim this benefit?', answer: 'You can apply for most benefits through GOV.UK or your local Jobcentre Plus. Some benefits require an online application; others may require a phone call or paper form.' },
  ],
  'stock-unit-calculator': [
    { question: 'What does the Livestock Stock Unit Calculator do?', answer: 'Calculate total livestock units for cattle, sheep, pigs and horses. See land requirement at 2 SU/ha. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Are these based on Defra rates?', answer: 'Where applicable, this calculator uses rates and data from Defra, the Rural Payments Agency and industry standard references for UK agriculture.' },
    { question: 'Does this account for regional variations?', answer: 'UK farming conditions vary by region, soil type and climate. This calculator provides national average figures — adjust for your specific location and circumstances.' },
  ],
  'agricultural-worker-wage-calculator': [
    { question: 'What does the Agricultural Worker Minimum Wage Calculator do?', answer: 'Calculate agricultural wages by AWO grade (1-6). Includes overtime at 1.5x and holiday entitlement. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Are these based on Defra rates?', answer: 'Where applicable, this calculator uses rates and data from Defra, the Rural Payments Agency and industry standard references for UK agriculture.' },
    { question: 'Does this account for regional variations?', answer: 'UK farming conditions vary by region, soil type and climate. This calculator provides national average figures — adjust for your specific location and circumstances.' },
  ],
  'mean-median-mode-calculator': [
    { question: 'What does the Mean, Median & Mode Calculator do?', answer: 'Calculate mean, median, mode, range, sum, min and max from a set of numbers. Shows sorted data. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'How accurate are the results?', answer: 'This calculator uses standard mathematical algorithms and provides results accurate to the precision shown. For very large numbers or high-precision requirements, results are rounded to a reasonable number of decimal places.' },
    { question: 'Can I use this for schoolwork?', answer: 'Yes. This calculator is suitable for GCSE, A-level and university-level mathematics. It follows standard mathematical conventions used in UK education.' },
  ],
  'prime-number-calculator': [
    { question: 'What does the Prime Number Checker do?', answer: 'Check if a number is prime, find prime factorisation, and list primes up to N. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'How accurate are the results?', answer: 'This calculator uses standard mathematical algorithms and provides results accurate to the precision shown. For very large numbers or high-precision requirements, results are rounded to a reasonable number of decimal places.' },
    { question: 'Can I use this for schoolwork?', answer: 'Yes. This calculator is suitable for GCSE, A-level and university-level mathematics. It follows standard mathematical conventions used in UK education.' },
  ],
  'waist-hip-ratio-calculator': [
    { question: 'What does the Waist-to-Hip Ratio Calculator do?', answer: 'Calculate your waist-to-hip ratio and cardiovascular disease risk using WHO guidelines. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this medical advice?', answer: 'No. This calculator is for informational purposes only and does not constitute medical advice. Always consult your GP or an appropriate healthcare professional for medical guidance.' },
    { question: 'Are the reference values from the NHS?', answer: 'Where applicable, this calculator uses reference values and guidelines from the NHS and other UK health authorities. Individual needs may vary based on personal health circumstances.' },
  ],
  'raised-bed-calculator': [
    { question: 'What does the Raised Bed Soil Calculator do?', answer: 'Calculate soil, bags and sleepers needed for raised garden beds with common size presets. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Does this include delivery costs?', answer: 'This calculator estimates material quantities and approximate costs. Delivery charges vary by supplier, quantity and location. Bulk orders often qualify for free or reduced delivery.' },
    { question: 'When is the best time for this project?', answer: 'Timing depends on the specific project. Generally, spring and autumn are ideal for lawn and planting work, while hard landscaping can be done year-round in dry conditions.' },
  ],
  'fence-paint-calculator': [
    { question: 'What does the Fence Paint Calculator do?', answer: 'Calculate fence paint or stain needed based on panels, height and number of coats. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Does this include delivery costs?', answer: 'This calculator estimates material quantities and approximate costs. Delivery charges vary by supplier, quantity and location. Bulk orders often qualify for free or reduced delivery.' },
    { question: 'When is the best time for this project?', answer: 'Timing depends on the specific project. Generally, spring and autumn are ideal for lawn and planting work, while hard landscaping can be done year-round in dry conditions.' },
  ],
  'clothing-size-converter': [
    { question: 'What does the Clothing Size Converter (UK/EU/US) do?', answer: 'Convert clothing sizes between UK, EU and US for women and men. Includes body measurements. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator free to use?', answer: 'Yes. All calculators on Calks.uk are completely free to use. No account or registration is required. All calculations run in your browser — no data is collected.' },
    { question: 'Can I use this on my phone?', answer: 'Yes. All our calculators are fully responsive and work on smartphones, tablets and desktop computers. The interface adapts to your screen size automatically.' },
  ],
  'volume-converter': [
    { question: 'What does the Volume Converter — Litres, Gallons & More do?', answer: 'Convert between ml, litres, pints, gallons, cups, tablespoons and cubic metres. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator free to use?', answer: 'Yes. All calculators on Calks.uk are completely free to use. No account or registration is required. All calculations run in your browser — no data is collected.' },
    { question: 'Can I use this on my phone?', answer: 'Yes. All our calculators are fully responsive and work on smartphones, tablets and desktop computers. The interface adapts to your screen size automatically.' },
  ],
  'birthday-calculator': [
    { question: 'What does the Birthday Calculator do?', answer: 'Find your day of birth, star sign, Chinese zodiac, days alive and upcoming milestone birthdays. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator free to use?', answer: 'Yes. All calculators on Calks.uk are completely free to use. No account or registration is required. All calculations run in your browser — no data is collected.' },
    { question: 'Can I use this on my phone?', answer: 'Yes. All our calculators are fully responsive and work on smartphones, tablets and desktop computers. The interface adapts to your screen size automatically.' },
  ],
  'car-insurance-estimate-calculator': [
    { question: 'What does the Car Insurance Estimate Calculator do?', answer: 'Estimate car insurance premiums by age, cover level, no claims bonus, insurance group and mileage. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Are these actual quotes?', answer: 'No. This calculator provides estimates based on typical UK insurance factors. Actual premiums depend on your specific circumstances. Always compare quotes from multiple insurers.' },
    { question: 'Is insurance required by law?', answer: 'Some insurance is legally required in the UK — such as motor insurance, employers\' liability insurance and buildings insurance (if you have a mortgage). Other types are optional but strongly recommended.' },
  ],
  'home-insurance-calculator': [
    { question: 'What does the Home Insurance Estimate Calculator do?', answer: 'Estimate home insurance premiums for buildings, contents or combined cover by property type. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Are these actual quotes?', answer: 'No. This calculator provides estimates based on typical UK insurance factors. Actual premiums depend on your specific circumstances. Always compare quotes from multiple insurers.' },
    { question: 'Is insurance required by law?', answer: 'Some insurance is legally required in the UK — such as motor insurance, employers\' liability insurance and buildings insurance (if you have a mortgage). Other types are optional but strongly recommended.' },
  ],
  'critical-illness-calculator': [
    { question: 'What does the Critical Illness Cover Calculator do?', answer: 'Estimate critical illness insurance premiums by age, cover amount, term and smoker status. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Are these actual quotes?', answer: 'No. This calculator provides estimates based on typical UK insurance factors. Actual premiums depend on your specific circumstances. Always compare quotes from multiple insurers.' },
    { question: 'Is insurance required by law?', answer: 'Some insurance is legally required in the UK — such as motor insurance, employers\' liability insurance and buildings insurance (if you have a mortgage). Other types are optional but strongly recommended.' },
  ],
  'property-cgt-calculator': [
    { question: 'What does the Capital Gains Tax on Property Calculator do?', answer: 'Calculate CGT on residential property sales with PPR relief, costs and improvements deductions. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator updated for the 2025/26 tax year?', answer: 'Yes. This calculator uses the latest HMRC rates and thresholds for the 2025/26 UK tax year, which runs from 6 April 2025 to 5 April 2026. Rates are verified against official HMRC publications.' },
    { question: 'Do I need to tell HMRC about this?', answer: 'Whether you need to report to HMRC depends on your individual circumstances. If you are unsure, check GOV.UK or contact HMRC directly. This calculator provides estimates for guidance only.' },
  ],
  'weighted-grade-calculator': [
    { question: 'What does the Weighted Average Grade Calculator do?', answer: 'Calculate weighted average from assessment components with different weightings. See UK degree classification. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this based on current student finance rates?', answer: 'Yes. This calculator uses Student Loans Company rates and thresholds for the 2025/26 academic and financial year. Thresholds and interest rates are updated annually.' },
    { question: 'Which student loan plan am I on?', answer: 'Plan 1 applies if you started before September 2012 (England/Wales) or are from Northern Ireland. Plan 2 applies from September 2012 in England/Wales. Plan 4 is for Scotland. Plan 5 applies from September 2023.' },
  ],
  'cost-of-living-comparison-calculator': [
    { question: 'What does the UK Cost of Living Comparison do?', answer: 'Compare cost of living between UK cities. See rent, food, transport differences and equivalent salary. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Are visa fees up to date?', answer: 'This calculator uses the current UK visa and immigration fees as published by UK Visas and Immigration (UKVI). Fees are reviewed periodically — check GOV.UK for the very latest amounts.' },
    { question: 'Does this include the Immigration Health Surcharge?', answer: 'Yes. The Immigration Health Surcharge (IHS) is included in the total cost calculation where applicable. The current IHS rate is £1,035 per year for most visa categories.' },
  ],
  'pension-annual-allowance-calculator': [
    { question: 'What does the Pension Annual Allowance Calculator do?', answer: 'Check your pension annual allowance (£60K), tapered allowance and MPAA. See if you face a tax charge. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Are these figures guaranteed?', answer: 'No. Pension projections are estimates based on assumed growth rates and current contribution levels. Actual returns depend on investment performance, fees and future policy changes.' },
    { question: 'What is the pension annual allowance?', answer: 'The pension annual allowance for 2025/26 is £60,000. This is the maximum you can contribute (including employer contributions) and receive tax relief. The allowance is tapered for high earners.' },
  ],
  'state-pension-age-calculator': [
    { question: 'What does the State Pension Age Calculator do?', answer: 'Find your State Pension age based on date of birth. See exact date and days remaining. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Are these figures guaranteed?', answer: 'No. Pension projections are estimates based on assumed growth rates and current contribution levels. Actual returns depend on investment performance, fees and future policy changes.' },
    { question: 'What is the pension annual allowance?', answer: 'The pension annual allowance for 2025/26 is £60,000. This is the maximum you can contribute (including employer contributions) and receive tax relief. The allowance is tapered for high earners.' },
  ],
  'student-loan-early-repay-calculator': [
    { question: 'What does the Should I Repay Student Loan Early? do?', answer: 'Compare total cost of normal repayments vs lump sum. See if early repayment saves money or wastes it. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Does this use current UK interest rates?', answer: 'You can enter any interest rate to model different scenarios. The Bank of England base rate and FCA guidelines influence typical lending rates available in the UK market.' },
    { question: 'Should I get professional debt advice?', answer: 'If you are struggling with debt, free professional advice is available from StepChange (0800 138 1111), Citizens Advice, and the National Debtline (0808 808 4000). This calculator provides estimates only.' },
  ],
  'pension-pot-calculator': [
    { question: 'What does the How Much Pension Do I Need? do?', answer: 'Calculate the pension pot needed for your target retirement income using drawdown, 4% rule or annuity. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Are these figures guaranteed?', answer: 'No. Pension projections are estimates based on assumed growth rates and current contribution levels. Actual returns depend on investment performance, fees and future policy changes.' },
    { question: 'What is the pension annual allowance?', answer: 'The pension annual allowance for 2025/26 is £60,000. This is the maximum you can contribute (including employer contributions) and receive tax relief. The allowance is tapered for high earners.' },
  ],
  'junior-isa-calculator': [
    { question: 'What does the Junior ISA Calculator do?', answer: 'Calculate how much a Junior ISA will be worth when your child turns 18. Tax-free growth with £9,000/year limit. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator suitable for financial decisions?', answer: 'This calculator provides estimates for guidance only. Investment returns are not guaranteed and your capital is at risk. Consider seeking independent financial advice before making investment decisions.' },
    { question: 'Are ISA contributions tax-free?', answer: 'Yes. The annual ISA allowance for 2025/26 is £20,000. Any interest, dividends or capital gains within an ISA are completely tax-free.' },
  ],
  'zero-hours-calculator': [
    { question: 'What does the Zero-Hours Contract Earnings Calculator do?', answer: 'Calculate annual earnings, tax and holiday pay accrual on a zero-hours contract. NMW check included. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator based on 2025/26 rates?', answer: 'Yes. This calculator uses the current 2025/26 UK tax year rates for income tax, National Insurance and other deductions, effective from 6 April 2025.' },
    { question: 'Does this include pension contributions?', answer: 'This calculator can factor in workplace pension contributions. Under auto-enrolment, the minimum is 8% total (5% employee + 3% employer) of qualifying earnings.' },
  ],
  'agency-worker-calculator': [
    { question: 'What does the Agency Worker Pay Calculator do?', answer: 'Calculate take-home pay as an agency worker. See what you actually earn after agency margin and deductions. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator based on 2025/26 rates?', answer: 'Yes. This calculator uses the current 2025/26 UK tax year rates for income tax, National Insurance and other deductions, effective from 6 April 2025.' },
    { question: 'Does this include pension contributions?', answer: 'This calculator can factor in workplace pension contributions. Under auto-enrolment, the minimum is 8% total (5% employee + 3% employer) of qualifying earnings.' },
  ],
  'settlement-agreement-calculator': [
    { question: 'What does the Settlement Agreement Calculator do?', answer: 'Estimate settlement package: redundancy, notice, holiday, ex-gratia and tax treatment (£30K tax-free). All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator based on 2025/26 rates?', answer: 'Yes. This calculator uses the current 2025/26 UK tax year rates for income tax, National Insurance and other deductions, effective from 6 April 2025.' },
    { question: 'Does this include pension contributions?', answer: 'This calculator can factor in workplace pension contributions. Under auto-enrolment, the minimum is 8% total (5% employee + 3% employer) of qualifying earnings.' },
  ],
  'buy-to-let-mortgage-calculator': [
    { question: 'What does the Buy-to-Let Mortgage Calculator do?', answer: 'Calculate BTL mortgage payments (interest-only and repayment). Check rental coverage stress test. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this based on current interest rates?', answer: 'You can enter any interest rate to model different scenarios. Check the Bank of England base rate and current mortgage deals from lenders for the latest rates.' },
    { question: 'Should I get professional advice?', answer: 'This calculator provides estimates for guidance only. For a formal mortgage offer, speak to a mortgage broker or lender who can assess your full circumstances and provide personalised advice.' },
  ],
  'house-price-sqft-calculator': [
    { question: 'What does the House Price per Square Foot Calculator do?', answer: 'Calculate price per square foot/metre to compare property value. See how it compares to UK averages. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this based on current interest rates?', answer: 'You can enter any interest rate to model different scenarios. Check the Bank of England base rate and current mortgage deals from lenders for the latest rates.' },
    { question: 'Should I get professional advice?', answer: 'This calculator provides estimates for guidance only. For a formal mortgage offer, speak to a mortgage broker or lender who can assess your full circumstances and provide personalised advice.' },
  ],
  'lease-extension-calculator': [
    { question: 'What does the Leasehold Extension Calculator do?', answer: 'Estimate lease extension premium including marriage value, ground rent and professional fees. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this based on current interest rates?', answer: 'You can enter any interest rate to model different scenarios. Check the Bank of England base rate and current mortgage deals from lenders for the latest rates.' },
    { question: 'Should I get professional advice?', answer: 'This calculator provides estimates for guidance only. For a formal mortgage offer, speak to a mortgage broker or lender who can assess your full circumstances and provide personalised advice.' },
  ],
  'student-loan-interest-calculator': [
    { question: 'What does the Student Loan Interest Calculator do?', answer: 'Calculate your student loan interest rate by income. See how fast your balance grows with compound interest. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Does this use current UK interest rates?', answer: 'You can enter any interest rate to model different scenarios. The Bank of England base rate and FCA guidelines influence typical lending rates available in the UK market.' },
    { question: 'Should I get professional debt advice?', answer: 'If you are struggling with debt, free professional advice is available from StepChange (0800 138 1111), Citizens Advice, and the National Debtline (0808 808 4000). This calculator provides estimates only.' },
  ],
  'debt-consolidation-calculator': [
    { question: 'What does the Debt Consolidation Calculator do?', answer: 'Compare current debt payments vs a consolidation loan. See if you save on monthly payments and total interest. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Does this use current UK interest rates?', answer: 'You can enter any interest rate to model different scenarios. The Bank of England base rate and FCA guidelines influence typical lending rates available in the UK market.' },
    { question: 'Should I get professional debt advice?', answer: 'If you are struggling with debt, free professional advice is available from StepChange (0800 138 1111), Citizens Advice, and the National Debtline (0808 808 4000). This calculator provides estimates only.' },
  ],
  'postgraduate-loan-calculator': [
    { question: 'What does the Postgraduate Loan Repayment Calculator do?', answer: 'Calculate postgraduate loan repayments at 6% above £21,000. See if your balance is growing or shrinking. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Does this use current UK interest rates?', answer: 'You can enter any interest rate to model different scenarios. The Bank of England base rate and FCA guidelines influence typical lending rates available in the UK market.' },
    { question: 'Should I get professional debt advice?', answer: 'If you are struggling with debt, free professional advice is available from StepChange (0800 138 1111), Citizens Advice, and the National Debtline (0808 808 4000). This calculator provides estimates only.' },
  ],
  'epc-calculator': [
    { question: 'What does the EPC Rating Improvement Calculator do?', answer: 'Estimate your EPC rating and see which upgrades will improve it most. Includes costs and annual savings. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Does this reflect the current energy price cap?', answer: 'This calculator uses representative energy prices. The Ofgem energy price cap changes quarterly — check Ofgem\'s website for the latest cap level applicable to your region and payment method.' },
    { question: 'Can I save money by switching tariff?', answer: 'Potentially yes. The energy market offers various fixed and variable tariffs. Use a comparison site authorised by Ofgem (such as Ofgem\'s own comparison tool) to check if switching could save you money.' },
  ],
  'bathroom-cost-calculator': [
    { question: 'What does the Bathroom Cost Calculator do?', answer: 'Estimate bathroom renovation costs for budget, mid-range and premium finishes with optional extras. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Does this include waste allowance?', answer: 'Yes. Most building material calculations include a standard 10% waste allowance. You can adjust this figure depending on the complexity of your project and cutting requirements.' },
    { question: 'Are prices accurate?', answer: 'Material prices are indicative estimates based on average UK prices. Actual costs vary by region, supplier, brand and current market conditions. Always get quotes from local suppliers.' },
  ],
  'kitchen-cost-calculator': [
    { question: 'What does the Kitchen Cost Calculator do?', answer: 'Estimate kitchen installation costs by budget level. Includes units, worktops, appliances and labour. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Does this include waste allowance?', answer: 'Yes. Most building material calculations include a standard 10% waste allowance. You can adjust this figure depending on the complexity of your project and cutting requirements.' },
    { question: 'Are prices accurate?', answer: 'Material prices are indicative estimates based on average UK prices. Actual costs vary by region, supplier, brand and current market conditions. Always get quotes from local suppliers.' },
  ],
  'timber-calculator': [
    { question: 'What does the Timber Calculator — Board Feet & Cost do?', answer: 'Calculate timber volume, total length and cost for construction projects. Common size presets included. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Does this include waste allowance?', answer: 'Yes. Most building material calculations include a standard 10% waste allowance. You can adjust this figure depending on the complexity of your project and cutting requirements.' },
    { question: 'Are prices accurate?', answer: 'Material prices are indicative estimates based on average UK prices. Actual costs vary by region, supplier, brand and current market conditions. Always get quotes from local suppliers.' },
  ],
  'underfloor-heating-calculator': [
    { question: 'What does the Underfloor Heating Calculator do?', answer: 'Compare water, electric mat and cable underfloor heating. See install costs and running costs vs radiators. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Does this include waste allowance?', answer: 'Yes. Most building material calculations include a standard 10% waste allowance. You can adjust this figure depending on the complexity of your project and cutting requirements.' },
    { question: 'Are prices accurate?', answer: 'Material prices are indicative estimates based on average UK prices. Actual costs vary by region, supplier, brand and current market conditions. Always get quotes from local suppliers.' },
  ],
  'student-allowance-calculator': [
    { question: 'What does the Bursary & Scholarship Impact Calculator do?', answer: 'Calculate total student support from maintenance loan plus NHS, teacher training, DSA and other bursaries. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this based on current student finance rates?', answer: 'Yes. This calculator uses Student Loans Company rates and thresholds for the 2025/26 academic and financial year. Thresholds and interest rates are updated annually.' },
    { question: 'Which student loan plan am I on?', answer: 'Plan 1 applies if you started before September 2012 (England/Wales) or are from Northern Ireland. Plan 2 applies from September 2012 in England/Wales. Plan 4 is for Scotland. Plan 5 applies from September 2023.' },
  ],
  'night-shift-calculator': [
    { question: 'What does the Night Shift Allowance Calculator do?', answer: 'Calculate night shift premium at 15-100% rates. See annual extra earnings from night work. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator based on 2025/26 rates?', answer: 'Yes. This calculator uses the current 2025/26 UK tax year rates for income tax, National Insurance and other deductions, effective from 6 April 2025.' },
    { question: 'Does this include pension contributions?', answer: 'This calculator can factor in workplace pension contributions. Under auto-enrolment, the minimum is 8% total (5% employee + 3% employer) of qualifying earnings.' },
  ],
  'benefits-in-kind-calculator': [
    { question: 'What does the Benefits in Kind (P11D) Calculator do?', answer: 'Calculate tax on company benefits — car, medical insurance, gym, phone and more. See monthly tax impact. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator based on 2025/26 rates?', answer: 'Yes. This calculator uses the current 2025/26 UK tax year rates for income tax, National Insurance and other deductions, effective from 6 April 2025.' },
    { question: 'Does this include pension contributions?', answer: 'This calculator can factor in workplace pension contributions. Under auto-enrolment, the minimum is 8% total (5% employee + 3% employer) of qualifying earnings.' },
  ],
  'regular-savings-calculator': [
    { question: 'What does the Regular Savings Calculator do?', answer: 'Calculate returns on a regular saver account with monthly deposits. See effective vs headline rate. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator suitable for financial decisions?', answer: 'This calculator provides estimates for guidance only. Investment returns are not guaranteed and your capital is at risk. Consider seeking independent financial advice before making investment decisions.' },
    { question: 'Are ISA contributions tax-free?', answer: 'Yes. The annual ISA allowance for 2025/26 is £20,000. Any interest, dividends or capital gains within an ISA are completely tax-free.' },
  ],
  'business-mileage-calculator': [
    { question: 'What does the Business Mileage Calculator do?', answer: 'Compare HMRC mileage allowance vs actual fuel costs. See if you profit or lose from the 45p/25p rates. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator based on 2025/26 rates?', answer: 'Yes. This calculator uses the current 2025/26 UK tax year rates for income tax, National Insurance and other deductions, effective from 6 April 2025.' },
    { question: 'Does this include pension contributions?', answer: 'This calculator can factor in workplace pension contributions. Under auto-enrolment, the minimum is 8% total (5% employee + 3% employer) of qualifying earnings.' },
  ],
  'wealth-growth-calculator': [
    { question: 'What does the Wealth Growth Projector do?', answer: 'Project wealth growth over time with annual savings and compound returns. See milestones (£100K, £1M). All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator suitable for financial decisions?', answer: 'This calculator provides estimates for guidance only. Investment returns are not guaranteed and your capital is at risk. Consider seeking independent financial advice before making investment decisions.' },
    { question: 'Are ISA contributions tax-free?', answer: 'Yes. The annual ISA allowance for 2025/26 is £20,000. Any interest, dividends or capital gains within an ISA are completely tax-free.' },
  ],
  'cgt-on-shares-calculator': [
    { question: 'What does the CGT on Shares Calculator do?', answer: 'Calculate capital gains tax on share sales. Includes annual exempt amount, basic/higher rates and ISA tip. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator suitable for financial decisions?', answer: 'This calculator provides estimates for guidance only. Investment returns are not guaranteed and your capital is at risk. Consider seeking independent financial advice before making investment decisions.' },
    { question: 'Are ISA contributions tax-free?', answer: 'Yes. The annual ISA allowance for 2025/26 is £20,000. Any interest, dividends or capital gains within an ISA are completely tax-free.' },
  ],
  'dividend-income-calculator': [
    { question: 'What does the Dividend Income Calculator do?', answer: 'Calculate annual dividend income and project portfolio growth with or without reinvestment (DRIP). All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator suitable for financial decisions?', answer: 'This calculator provides estimates for guidance only. Investment returns are not guaranteed and your capital is at risk. Consider seeking independent financial advice before making investment decisions.' },
    { question: 'Are ISA contributions tax-free?', answer: 'Yes. The annual ISA allowance for 2025/26 is £20,000. Any interest, dividends or capital gains within an ISA are completely tax-free.' },
  ],
  'non-dom-tax-calculator': [
    { question: 'What does the Non-Dom Tax Calculator (FIG Regime) do?', answer: 'Calculate tax under the new FIG regime for non-domiciled UK residents. 4-year foreign income exemption. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator updated for the 2025/26 tax year?', answer: 'Yes. This calculator uses the latest HMRC rates and thresholds for the 2025/26 UK tax year, which runs from 6 April 2025 to 5 April 2026. Rates are verified against official HMRC publications.' },
    { question: 'Do I need to tell HMRC about this?', answer: 'Whether you need to report to HMRC depends on your individual circumstances. If you are unsure, check GOV.UK or contact HMRC directly. This calculator provides estimates for guidance only.' },
  ],
  'annual-investment-allowance-calculator': [
    { question: 'What does the Annual Investment Allowance Calculator do?', answer: 'Calculate AIA tax relief on plant & machinery spending. 100% deduction on first £1M. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this suitable for my business?', answer: 'This calculator provides general estimates based on standard UK business rates and rules. Every business is different — consult your accountant for advice specific to your circumstances.' },
    { question: 'Does this use 2025/26 tax rates?', answer: 'Yes. All rates and thresholds are based on the current 2025/26 UK tax year. Corporation Tax main rate is 25% for profits over £250,000, with a 19% small profits rate.' },
  ],
  'mortgage-interest-rate-calculator': [
    { question: 'What does the Mortgage Interest Rate Comparison do?', answer: 'Compare monthly payments at different interest rates. See how rate changes affect your mortgage. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this based on current interest rates?', answer: 'You can enter any interest rate to model different scenarios. Check the Bank of England base rate and current mortgage deals from lenders for the latest rates.' },
    { question: 'Should I get professional advice?', answer: 'This calculator provides estimates for guidance only. For a formal mortgage offer, speak to a mortgage broker or lender who can assess your full circumstances and provide personalised advice.' },
  ],
  'sipp-calculator': [
    { question: 'What does the SIPP Calculator — Self-Invested Pension do?', answer: 'Project your Self-Invested Personal Pension with tax relief, employer contributions and growth. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Are these figures guaranteed?', answer: 'No. Pension projections are estimates based on assumed growth rates and current contribution levels. Actual returns depend on investment performance, fees and future policy changes.' },
    { question: 'What is the pension annual allowance?', answer: 'The pension annual allowance for 2025/26 is £60,000. This is the maximum you can contribute (including employer contributions) and receive tax relief. The allowance is tapered for high earners.' },
  ],
  'tax-credits-calculator': [
    { question: 'What does the Tax Credits Calculator (Legacy) do?', answer: 'Calculate Working Tax Credit and Child Tax Credit for existing claimants. Includes childcare element. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Are benefit amounts accurate?', answer: 'This calculator uses the published 2025/26 benefit rates. However, actual entitlements depend on a full assessment by the Department for Work and Pensions (DWP) and may differ from estimates.' },
    { question: 'How do I claim this benefit?', answer: 'You can apply for most benefits through GOV.UK or your local Jobcentre Plus. Some benefits require an online application; others may require a phone call or paper form.' },
  ],
  'stocks-shares-isa-calculator': [
    { question: 'What does the Stocks & Shares ISA Calculator do?', answer: 'Project Stocks & Shares ISA growth with capital appreciation and dividends. See tax saved vs taxable account. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator suitable for financial decisions?', answer: 'This calculator provides estimates for guidance only. Investment returns are not guaranteed and your capital is at risk. Consider seeking independent financial advice before making investment decisions.' },
    { question: 'Are ISA contributions tax-free?', answer: 'Yes. The annual ISA allowance for 2025/26 is £20,000. Any interest, dividends or capital gains within an ISA are completely tax-free.' },
  ],
  'epc-rating-comparison-calculator': [
    { question: 'What does the EPC Band Comparison Calculator do?', answer: 'Compare energy costs between EPC bands. See annual savings from upgrading your rating. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Does this reflect the current energy price cap?', answer: 'This calculator uses representative energy prices. The Ofgem energy price cap changes quarterly — check Ofgem\'s website for the latest cap level applicable to your region and payment method.' },
    { question: 'Can I save money by switching tariff?', answer: 'Potentially yes. The energy market offers various fixed and variable tariffs. Use a comparison site authorised by Ofgem (such as Ofgem\'s own comparison tool) to check if switching could save you money.' },
  ],
  'help-to-save-calculator': [
    { question: 'What does the Help to Save Calculator do?', answer: 'Calculate Help to Save returns with the 50% government bonus. Max £50/month for 4 years. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator suitable for financial decisions?', answer: 'This calculator provides estimates for guidance only. Investment returns are not guaranteed and your capital is at risk. Consider seeking independent financial advice before making investment decisions.' },
    { question: 'Are ISA contributions tax-free?', answer: 'Yes. The annual ISA allowance for 2025/26 is £20,000. Any interest, dividends or capital gains within an ISA are completely tax-free.' },
  ],
  'ns-i-savings-calculator': [
    { question: 'What does the NS&I Savings Calculator do?', answer: 'Calculate savings interest with different compounding frequencies. See AER vs nominal rate. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator suitable for financial decisions?', answer: 'This calculator provides estimates for guidance only. Investment returns are not guaranteed and your capital is at risk. Consider seeking independent financial advice before making investment decisions.' },
    { question: 'Are ISA contributions tax-free?', answer: 'Yes. The annual ISA allowance for 2025/26 is £20,000. Any interest, dividends or capital gains within an ISA are completely tax-free.' },
  ],
  'bmi-children-calculator': [
    { question: 'What does the BMI Calculator for Children do?', answer: 'Calculate BMI for children aged 2-18 with age and gender-adjusted interpretation. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this medical advice?', answer: 'No. This calculator is for informational purposes only and does not constitute medical advice. Always consult your GP or an appropriate healthcare professional for medical guidance.' },
    { question: 'Are the reference values from the NHS?', answer: 'Where applicable, this calculator uses reference values and guidelines from the NHS and other UK health authorities. Individual needs may vary based on personal health circumstances.' },
  ],
  'offset-mortgage-calculator': [
    { question: 'What does the Offset Mortgage Calculator do?', answer: 'Calculate interest saved by offsetting savings against your mortgage. See equivalent tax-free rate. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this based on current interest rates?', answer: 'You can enter any interest rate to model different scenarios. Check the Bank of England base rate and current mortgage deals from lenders for the latest rates.' },
    { question: 'Should I get professional advice?', answer: 'This calculator provides estimates for guidance only. For a formal mortgage offer, speak to a mortgage broker or lender who can assess your full circumstances and provide personalised advice.' },
  ],
  'ground-rent-calculator': [
    { question: 'What does the Ground Rent Calculator do?', answer: 'Calculate ground rent over time with escalation. Flag onerous rents. Includes doubling and RPI clauses. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this based on current interest rates?', answer: 'You can enter any interest rate to model different scenarios. Check the Bank of England base rate and current mortgage deals from lenders for the latest rates.' },
    { question: 'Should I get professional advice?', answer: 'This calculator provides estimates for guidance only. For a formal mortgage offer, speak to a mortgage broker or lender who can assess your full circumstances and provide personalised advice.' },
  ],
  'service-charge-calculator': [
    { question: 'What does the Service Charge Calculator do?', answer: 'Estimate your leasehold service charge from building costs. Includes insurance, maintenance and reserve fund. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this based on current interest rates?', answer: 'You can enter any interest rate to model different scenarios. Check the Bank of England base rate and current mortgage deals from lenders for the latest rates.' },
    { question: 'Should I get professional advice?', answer: 'This calculator provides estimates for guidance only. For a formal mortgage offer, speak to a mortgage broker or lender who can assess your full circumstances and provide personalised advice.' },
  ],
  'pension-consolidation-calculator': [
    { question: 'What does the Pension Consolidation Calculator do?', answer: 'Compare keeping multiple pension pots vs consolidating into one. See fee savings over time. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Are these figures guaranteed?', answer: 'No. Pension projections are estimates based on assumed growth rates and current contribution levels. Actual returns depend on investment performance, fees and future policy changes.' },
    { question: 'What is the pension annual allowance?', answer: 'The pension annual allowance for 2025/26 is £60,000. This is the maximum you can contribute (including employer contributions) and receive tax relief. The allowance is tapered for high earners.' },
  ],
  'employer-pension-contribution-calculator': [
    { question: 'What does the Employer Pension Contribution Calculator do?', answer: 'Calculate auto-enrolment pension contributions on qualifying earnings with tax relief. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Are these figures guaranteed?', answer: 'No. Pension projections are estimates based on assumed growth rates and current contribution levels. Actual returns depend on investment performance, fees and future policy changes.' },
    { question: 'What is the pension annual allowance?', answer: 'The pension annual allowance for 2025/26 is £60,000. This is the maximum you can contribute (including employer contributions) and receive tax relief. The allowance is tapered for high earners.' },
  ],
  'right-to-buy-calculator': [
    { question: 'What does the Right to Buy Calculator do?', answer: 'Calculate your Right to Buy discount for council/housing association properties. Up to 70% off. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this based on current interest rates?', answer: 'You can enter any interest rate to model different scenarios. Check the Bank of England base rate and current mortgage deals from lenders for the latest rates.' },
    { question: 'Should I get professional advice?', answer: 'This calculator provides estimates for guidance only. For a formal mortgage offer, speak to a mortgage broker or lender who can assess your full circumstances and provide personalised advice.' },
  ],
  'staircasing-calculator': [
    { question: 'What does the Shared Ownership Staircasing Calculator do?', answer: 'Calculate the cost of buying a bigger share of your shared ownership home and new rent. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this based on current interest rates?', answer: 'You can enter any interest rate to model different scenarios. Check the Bank of England base rate and current mortgage deals from lenders for the latest rates.' },
    { question: 'Should I get professional advice?', answer: 'This calculator provides estimates for guidance only. For a formal mortgage offer, speak to a mortgage broker or lender who can assess your full circumstances and provide personalised advice.' },
  ],
  'pension-lump-sum-calculator': [
    { question: 'What does the Pension Lump Sum Calculator (PCLS) do?', answer: 'Compare taking 0-100% as lump sum. See tax-free portion, tax on excess and remaining pot for drawdown. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Are these figures guaranteed?', answer: 'No. Pension projections are estimates based on assumed growth rates and current contribution levels. Actual returns depend on investment performance, fees and future policy changes.' },
    { question: 'What is the pension annual allowance?', answer: 'The pension annual allowance for 2025/26 is £60,000. This is the maximum you can contribute (including employer contributions) and receive tax relief. The allowance is tapered for high earners.' },
  ],
  'elm-payment-calculator': [
    { question: 'What does the BPS/ELM Payment Calculator do?', answer: 'Calculate Sustainable Farming Incentive and ELM payments for 10+ environmental actions. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Are these based on Defra rates?', answer: 'Where applicable, this calculator uses rates and data from Defra, the Rural Payments Agency and industry standard references for UK agriculture.' },
    { question: 'Does this account for regional variations?', answer: 'UK farming conditions vary by region, soil type and climate. This calculator provides national average figures — adjust for your specific location and circumstances.' },
  ],
  'farm-tenancy-calculator': [
    { question: 'What does the Farm Tenancy Rent Review Calculator do?', answer: 'Compare your farm rent to market rates. See rent as percentage of revenue for rent review preparation. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Are these based on Defra rates?', answer: 'Where applicable, this calculator uses rates and data from Defra, the Rural Payments Agency and industry standard references for UK agriculture.' },
    { question: 'Does this account for regional variations?', answer: 'UK farming conditions vary by region, soil type and climate. This calculator provides national average figures — adjust for your specific location and circumstances.' },
  ],
  'ev-salary-sacrifice-calculator': [
    { question: 'What does the EV Salary Sacrifice Calculator do?', answer: 'Calculate savings from EV salary sacrifice. See tax/NI savings, BiK at 3% and effective monthly cost. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator based on 2025/26 rates?', answer: 'Yes. This calculator uses the current 2025/26 UK tax year rates for income tax, National Insurance and other deductions, effective from 6 April 2025.' },
    { question: 'Does this include pension contributions?', answer: 'This calculator can factor in workplace pension contributions. Under auto-enrolment, the minimum is 8% total (5% employee + 3% employer) of qualifying earnings.' },
  ],
  'ulez-calculator': [
    { question: 'What does the ULEZ Compliance Checker do?', answer: 'Check if your car is ULEZ compliant and calculate annual ULEZ and Congestion Charge costs. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Does this use current UK rates?', answer: 'Yes. This calculator uses the latest UK rates for vehicle tax, fuel duty and other motoring costs as of the 2025/26 financial year.' },
    { question: 'Is this suitable for electric vehicles?', answer: 'From April 2025, electric vehicles are no longer exempt from Vehicle Excise Duty (road tax). This calculator accounts for EV-specific rates where applicable.' },
  ],
  'car-import-duty-calculator': [
    { question: 'What does the Car Import Duty Calculator do?', answer: 'Calculate total UK landing cost for imported cars — duty, VAT, VED and type approval. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Does this use current UK rates?', answer: 'Yes. This calculator uses the latest UK rates for vehicle tax, fuel duty and other motoring costs as of the 2025/26 financial year.' },
    { question: 'Is this suitable for electric vehicles?', answer: 'From April 2025, electric vehicles are no longer exempt from Vehicle Excise Duty (road tax). This calculator accounts for EV-specific rates where applicable.' },
  ],
  'road-trip-cost-calculator': [
    { question: 'What does the Road Trip Cost Calculator do?', answer: 'Calculate fuel cost, driving time and cost per person for road trips. Split costs easily. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Does this use current UK rates?', answer: 'Yes. This calculator uses the latest UK rates for vehicle tax, fuel duty and other motoring costs as of the 2025/26 financial year.' },
    { question: 'Is this suitable for electric vehicles?', answer: 'From April 2025, electric vehicles are no longer exempt from Vehicle Excise Duty (road tax). This calculator accounts for EV-specific rates where applicable.' },
  ],
  'making-tax-digital-calculator': [
    { question: 'What does the Making Tax Digital Readiness Calculator do?', answer: 'Check if MTD for Income Tax applies to you. See deadlines, requirements and software costs. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator updated for the 2025/26 tax year?', answer: 'Yes. This calculator uses the latest HMRC rates and thresholds for the 2025/26 UK tax year, which runs from 6 April 2025 to 5 April 2026. Rates are verified against official HMRC publications.' },
    { question: 'Do I need to tell HMRC about this?', answer: 'Whether you need to report to HMRC depends on your individual circumstances. If you are unsure, check GOV.UK or contact HMRC directly. This calculator provides estimates for guidance only.' },
  ],
  'tax-bracket-visualizer': [
    { question: 'What does the Tax Bracket Visualizer do?', answer: 'See your income split across tax bands with a visual bar. Highlights the 60% tax trap at £100-125K. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator updated for the 2025/26 tax year?', answer: 'Yes. This calculator uses the latest HMRC rates and thresholds for the 2025/26 UK tax year, which runs from 6 April 2025 to 5 April 2026. Rates are verified against official HMRC publications.' },
    { question: 'Do I need to tell HMRC about this?', answer: 'Whether you need to report to HMRC depends on your individual circumstances. If you are unsure, check GOV.UK or contact HMRC directly. This calculator provides estimates for guidance only.' },
  ],
  'business-mileage-record-calculator': [
    { question: 'What does the Business Mileage Log Calculator do?', answer: 'Log business trips with dates and mileage. Calculate HMRC mileage allowance claim automatically. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this suitable for my business?', answer: 'This calculator provides general estimates based on standard UK business rates and rules. Every business is different — consult your accountant for advice specific to your circumstances.' },
    { question: 'Does this use 2025/26 tax rates?', answer: 'Yes. All rates and thresholds are based on the current 2025/26 UK tax year. Corporation Tax main rate is 25% for profits over £250,000, with a 19% small profits rate.' },
  ],
  'pension-sharing-divorce-calculator': [
    { question: 'What does the Pension Sharing on Divorce Calculator do?', answer: 'Calculate pension division in divorce. Compare sharing orders with different splits. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Are these figures guaranteed?', answer: 'No. Pension projections are estimates based on assumed growth rates and current contribution levels. Actual returns depend on investment performance, fees and future policy changes.' },
    { question: 'What is the pension annual allowance?', answer: 'The pension annual allowance for 2025/26 is £60,000. This is the maximum you can contribute (including employer contributions) and receive tax relief. The allowance is tapered for high earners.' },
  ],
  'working-hours-benefits-calculator': [
    { question: 'What does the Working Hours & Benefits Threshold Calculator do?', answer: 'Check which benefit thresholds you meet based on working hours. UC conditionality and WTC eligibility. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Are benefit amounts accurate?', answer: 'This calculator uses the published 2025/26 benefit rates. However, actual entitlements depend on a full assessment by the Department for Work and Pensions (DWP) and may differ from estimates.' },
    { question: 'How do I claim this benefit?', answer: 'You can apply for most benefits through GOV.UK or your local Jobcentre Plus. Some benefits require an online application; others may require a phone call or paper form.' },
  ],
  'inheritance-tax-pension-calculator': [
    { question: 'What does the Inheritance Tax on Pensions Calculator (2027) do?', answer: 'Compare IHT before and after April 2027 when pensions enter the estate. See extra tax liability. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator updated for the 2025/26 tax year?', answer: 'Yes. This calculator uses the latest HMRC rates and thresholds for the 2025/26 UK tax year, which runs from 6 April 2025 to 5 April 2026. Rates are verified against official HMRC publications.' },
    { question: 'Do I need to tell HMRC about this?', answer: 'Whether you need to report to HMRC depends on your individual circumstances. If you are unsure, check GOV.UK or contact HMRC directly. This calculator provides estimates for guidance only.' },
  ],
  'mtd-readiness-calculator': [
    { question: 'What does the MTD Readiness Checklist do?', answer: 'Score your Making Tax Digital readiness across 10 key criteria. See what you still need to do. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this suitable for my business?', answer: 'This calculator provides general estimates based on standard UK business rates and rules. Every business is different — consult your accountant for advice specific to your circumstances.' },
    { question: 'Does this use 2025/26 tax rates?', answer: 'Yes. All rates and thresholds are based on the current 2025/26 UK tax year. Corporation Tax main rate is 25% for profits over £250,000, with a 19% small profits rate.' },
  ],
  'congestion-charge-calculator': [
    { question: 'What does the London Congestion Charge Calculator do?', answer: 'Calculate annual Congestion Charge cost. Check EV and Blue Badge exemptions. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Does this use current UK rates?', answer: 'Yes. This calculator uses the latest UK rates for vehicle tax, fuel duty and other motoring costs as of the 2025/26 financial year.' },
    { question: 'Is this suitable for electric vehicles?', answer: 'From April 2025, electric vehicles are no longer exempt from Vehicle Excise Duty (road tax). This calculator accounts for EV-specific rates where applicable.' },
  ],
  'a-level-grade-calculator': [
    { question: 'What does the A-Level Grade Calculator do?', answer: 'Calculate UCAS tariff points from A-Level grades. See which universities your grades qualify for. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this based on current student finance rates?', answer: 'Yes. This calculator uses Student Loans Company rates and thresholds for the 2025/26 academic and financial year. Thresholds and interest rates are updated annually.' },
    { question: 'Which student loan plan am I on?', answer: 'Plan 1 applies if you started before September 2012 (England/Wales) or are from Northern Ireland. Plan 2 applies from September 2012 in England/Wales. Plan 4 is for Scotland. Plan 5 applies from September 2023.' },
  ],
  'student-loan-plan4-calculator': [
    { question: 'What does the Student Loan Plan 4 (Scotland) Calculator do?', answer: 'Calculate Plan 4 (Scottish) student loan repayments at 9% above the £31,395 threshold for 2025/26. See monthly and annual deductions. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Does this use current UK interest rates?', answer: 'You can enter any interest rate to model different scenarios. The Bank of England base rate and FCA guidelines influence typical lending rates available in the UK market.' },
    { question: 'Should I get professional debt advice?', answer: 'If you are struggling with debt, free professional advice is available from StepChange (0800 138 1111), Citizens Advice, and the National Debtline (0808 808 4000). This calculator provides estimates only.' },
  ],
  'crypto-carf-calculator': [
    { question: 'What does the Crypto Tax CARF Calculator do?', answer: 'Track crypto disposals, calculate CGT and understand CARF automatic reporting from 2026. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator updated for the 2025/26 tax year?', answer: 'Yes. This calculator uses the latest HMRC rates and thresholds for the 2025/26 UK tax year, which runs from 6 April 2025 to 5 April 2026. Rates are verified against official HMRC publications.' },
    { question: 'Do I need to tell HMRC about this?', answer: 'Whether you need to report to HMRC depends on your individual circumstances. If you are unsure, check GOV.UK or contact HMRC directly. This calculator provides estimates for guidance only.' },
  ],
  'employer-ni-rise-calculator': [
    { question: 'What does the Employer NI Rise Impact Calculator (April 2025) do?', answer: 'Calculate the extra employer NI cost from the April 2025 rate rise (13.8% → 15%, threshold £9,100 → £5,000). All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator updated for the 2025/26 tax year?', answer: 'Yes. This calculator uses the latest HMRC rates and thresholds for the 2025/26 UK tax year, which runs from 6 April 2025 to 5 April 2026. Rates are verified against official HMRC publications.' },
    { question: 'Do I need to tell HMRC about this?', answer: 'Whether you need to report to HMRC depends on your individual circumstances. If you are unsure, check GOV.UK or contact HMRC directly. This calculator provides estimates for guidance only.' },
  ],
  'pay-per-mile-calculator': [
    { question: 'What does the EV Pay-Per-Mile Road Pricing Calculator do?', answer: 'Compare potential road pricing costs vs current VED and fuel duty. Prepare for future EV taxation. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Does this use current UK rates?', answer: 'Yes. This calculator uses the latest UK rates for vehicle tax, fuel duty and other motoring costs as of the 2025/26 financial year.' },
    { question: 'Is this suitable for electric vehicles?', answer: 'From April 2025, electric vehicles are no longer exempt from Vehicle Excise Duty (road tax). This calculator accounts for EV-specific rates where applicable.' },
  ],
  'high-council-tax-calculator': [
    { question: 'What does the High-Value Property Council Tax Calculator (2028) do?', answer: 'Estimate council tax with proposed surcharge for Band H+ properties. See all bands including new I and J. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator updated for the 2025/26 tax year?', answer: 'Yes. This calculator uses the latest HMRC rates and thresholds for the 2025/26 UK tax year, which runs from 6 April 2025 to 5 April 2026. Rates are verified against official HMRC publications.' },
    { question: 'Do I need to tell HMRC about this?', answer: 'Whether you need to report to HMRC depends on your individual circumstances. If you are unsure, check GOV.UK or contact HMRC directly. This calculator provides estimates for guidance only.' },
  ],
  'sole-trader-vs-ltd-comparison-calculator': [
    { question: 'What does the Sole Trader vs Ltd Comparison Table do?', answer: 'Side-by-side take-home pay comparison at 7 different profit levels (£20K-£100K). All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this suitable for my business?', answer: 'This calculator provides general estimates based on standard UK business rates and rules. Every business is different — consult your accountant for advice specific to your circumstances.' },
    { question: 'Does this use 2025/26 tax rates?', answer: 'Yes. All rates and thresholds are based on the current 2025/26 UK tax year. Corporation Tax main rate is 25% for profits over £250,000, with a 19% small profits rate.' },
  ],
  'apprenticeship-levy-calculator': [
    { question: 'What does the Apprenticeship Levy Calculator do?', answer: 'Calculate apprenticeship levy at 0.5% of pay bill over £3M. See government top-up and total training fund. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this suitable for my business?', answer: 'This calculator provides general estimates based on standard UK business rates and rules. Every business is different — consult your accountant for advice specific to your circumstances.' },
    { question: 'Does this use 2025/26 tax rates?', answer: 'Yes. All rates and thresholds are based on the current 2025/26 UK tax year. Corporation Tax main rate is 25% for profits over £250,000, with a 19% small profits rate.' },
  ],
  'shared-parental-pay-calculator': [
    { question: 'What does the Shared Parental Pay (ShPP) Quick Calculator do?', answer: 'Quick calculation of Shared Parental Pay at £187.18/week or 90% of salary. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator based on 2025/26 rates?', answer: 'Yes. This calculator uses the current 2025/26 UK tax year rates for income tax, National Insurance and other deductions, effective from 6 April 2025.' },
    { question: 'Does this include pension contributions?', answer: 'This calculator can factor in workplace pension contributions. Under auto-enrolment, the minimum is 8% total (5% employee + 3% employer) of qualifying earnings.' },
  ],
  'home-buying-total-cost-calculator': [
    { question: 'What does the Home Buying Total Cost Calculator do?', answer: 'Calculate every cost of buying a home — deposit, stamp duty, solicitor, survey, searches, and monthly mortgage. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this based on current interest rates?', answer: 'You can enter any interest rate to model different scenarios. Check the Bank of England base rate and current mortgage deals from lenders for the latest rates.' },
    { question: 'Should I get professional advice?', answer: 'This calculator provides estimates for guidance only. For a formal mortgage offer, speak to a mortgage broker or lender who can assess your full circumstances and provide personalised advice.' },
  ],
  'council-tax-reduction-calculator': [
    { question: 'What does the Council Tax Reduction Calculator do?', answer: 'Check which council tax discounts and exemptions you qualify for — single person, student, disabled, care leaver. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator updated for the 2025/26 tax year?', answer: 'Yes. This calculator uses the latest HMRC rates and thresholds for the 2025/26 UK tax year, which runs from 6 April 2025 to 5 April 2026. Rates are verified against official HMRC publications.' },
    { question: 'Do I need to tell HMRC about this?', answer: 'Whether you need to report to HMRC depends on your individual circumstances. If you are unsure, check GOV.UK or contact HMRC directly. This calculator provides estimates for guidance only.' },
  ],
  'student-budget-planner-calculator': [
    { question: 'What does the Student Budget Planner do?', answer: 'Plan your weekly student budget with income from loan, job and parents against term-time expenses. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this based on current student finance rates?', answer: 'Yes. This calculator uses Student Loans Company rates and thresholds for the 2025/26 academic and financial year. Thresholds and interest rates are updated annually.' },
    { question: 'Which student loan plan am I on?', answer: 'Plan 1 applies if you started before September 2012 (England/Wales) or are from Northern Ireland. Plan 2 applies from September 2012 in England/Wales. Plan 4 is for Scotland. Plan 5 applies from September 2023.' },
  ],
  'minimum-wage-calculator': [
    { question: 'What does the Minimum Wage Calculator (NMW/NLW) do?', answer: 'Calculate earnings at National Minimum/Living Wage rates by age group. Weekly, monthly and annual. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator based on 2025/26 rates?', answer: 'Yes. This calculator uses the current 2025/26 UK tax year rates for income tax, National Insurance and other deductions, effective from 6 April 2025.' },
    { question: 'Does this include pension contributions?', answer: 'This calculator can factor in workplace pension contributions. Under auto-enrolment, the minimum is 8% total (5% employee + 3% employer) of qualifying earnings.' },
  ],
  'first-homes-scheme-calculator': [
    { question: 'What does the First Homes Scheme Calculator do?', answer: 'Calculate First Homes discounted price (30-50% off). Check if you can afford with income and deposit. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this based on current interest rates?', answer: 'You can enter any interest rate to model different scenarios. Check the Bank of England base rate and current mortgage deals from lenders for the latest rates.' },
    { question: 'Should I get professional advice?', answer: 'This calculator provides estimates for guidance only. For a formal mortgage offer, speak to a mortgage broker or lender who can assess your full circumstances and provide personalised advice.' },
  ],
  'shared-ownership-affordability-calculator': [
    { question: 'What does the Shared Ownership Mortgage Affordability do?', answer: 'Check if you can afford shared ownership — mortgage on your share plus rent on unsold share. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this based on current interest rates?', answer: 'You can enter any interest rate to model different scenarios. Check the Bank of England base rate and current mortgage deals from lenders for the latest rates.' },
    { question: 'Should I get professional advice?', answer: 'This calculator provides estimates for guidance only. For a formal mortgage offer, speak to a mortgage broker or lender who can assess your full circumstances and provide personalised advice.' },
  ],
  'invoice-profit-calculator': [
    { question: 'What does the Invoice & Job Profit Calculator do?', answer: 'Calculate profit margin and markup on jobs. Add VAT and generate invoice total. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this suitable for my business?', answer: 'This calculator provides general estimates based on standard UK business rates and rules. Every business is different — consult your accountant for advice specific to your circumstances.' },
    { question: 'Does this use 2025/26 tax rates?', answer: 'Yes. All rates and thresholds are based on the current 2025/26 UK tax year. Corporation Tax main rate is 25% for profits over £250,000, with a 19% small profits rate.' },
  ],
  'employee-vs-contractor-calculator': [
    { question: 'What does the Employee vs Contractor Calculator do?', answer: 'Compare take-home pay as an employee vs contractor for the same total cost to the hiring company. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this suitable for my business?', answer: 'This calculator provides general estimates based on standard UK business rates and rules. Every business is different — consult your accountant for advice specific to your circumstances.' },
    { question: 'Does this use 2025/26 tax rates?', answer: 'Yes. All rates and thresholds are based on the current 2025/26 UK tax year. Corporation Tax main rate is 25% for profits over £250,000, with a 19% small profits rate.' },
  ],
  'standing-charge-savings-calculator': [
    { question: 'What does the Standing Charge Savings Calculator do?', answer: 'Calculate how much you pay in standing charges alone. Compare zero standing charge tariffs. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Does this reflect the current energy price cap?', answer: 'This calculator uses representative energy prices. The Ofgem energy price cap changes quarterly — check Ofgem\'s website for the latest cap level applicable to your region and payment method.' },
    { question: 'Can I save money by switching tariff?', answer: 'Potentially yes. The energy market offers various fixed and variable tariffs. Use a comparison site authorised by Ofgem (such as Ofgem\'s own comparison tool) to check if switching could save you money.' },
  ],
  'gas-cost-calculator': [
    { question: 'What does the Gas Cost Calculator do?', answer: 'Calculate annual gas bill from kWh usage, unit rate and standing charge. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Does this reflect the current energy price cap?', answer: 'This calculator uses representative energy prices. The Ofgem energy price cap changes quarterly — check Ofgem\'s website for the latest cap level applicable to your region and payment method.' },
    { question: 'Can I save money by switching tariff?', answer: 'Potentially yes. The energy market offers various fixed and variable tariffs. Use a comparison site authorised by Ofgem (such as Ofgem\'s own comparison tool) to check if switching could save you money.' },
  ],
  'exponent-calculator': [
    { question: 'What does the Exponent / Power Calculator do?', answer: 'Calculate any number raised to any power. See common powers of your base number. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'How accurate are the results?', answer: 'This calculator uses standard mathematical algorithms and provides results accurate to the precision shown. For very large numbers or high-precision requirements, results are rounded to a reasonable number of decimal places.' },
    { question: 'Can I use this for schoolwork?', answer: 'Yes. This calculator is suitable for GCSE, A-level and university-level mathematics. It follows standard mathematical conventions used in UK education.' },
  ],
  'logarithm-calculator': [
    { question: 'What does the Logarithm Calculator do?', answer: 'Calculate log₁₀, ln, log₂ and custom base logarithms. Includes antilog and log rules. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'How accurate are the results?', answer: 'This calculator uses standard mathematical algorithms and provides results accurate to the precision shown. For very large numbers or high-precision requirements, results are rounded to a reasonable number of decimal places.' },
    { question: 'Can I use this for schoolwork?', answer: 'Yes. This calculator is suitable for GCSE, A-level and university-level mathematics. It follows standard mathematical conventions used in UK education.' },
  ],
  'employee-cost-breakdown-calculator': [
    { question: 'What does the Employee Cost Breakdown Calculator do?', answer: 'Calculate true cost of employment including NI, pension, training, equipment and recruitment. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this suitable for my business?', answer: 'This calculator provides general estimates based on standard UK business rates and rules. Every business is different — consult your accountant for advice specific to your circumstances.' },
    { question: 'Does this use 2025/26 tax rates?', answer: 'Yes. All rates and thresholds are based on the current 2025/26 UK tax year. Corporation Tax main rate is 25% for profits over £250,000, with a 19% small profits rate.' },
  ],
  'contractor-vs-perm-calculator': [
    { question: 'What does the Contractor vs Permanent Salary Calculator do?', answer: 'Compare contractor day rate vs permanent salary. See the premium needed to match perm benefits. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this suitable for my business?', answer: 'This calculator provides general estimates based on standard UK business rates and rules. Every business is different — consult your accountant for advice specific to your circumstances.' },
    { question: 'Does this use 2025/26 tax rates?', answer: 'Yes. All rates and thresholds are based on the current 2025/26 UK tax year. Corporation Tax main rate is 25% for profits over £250,000, with a 19% small profits rate.' },
  ],
  'postgraduate-loan-cost-calculator': [
    { question: 'What does the Postgraduate Loan Total Cost Calculator do?', answer: 'Calculate total postgraduate loan repayment over 30 years with salary growth projections. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this based on current student finance rates?', answer: 'Yes. This calculator uses Student Loans Company rates and thresholds for the 2025/26 academic and financial year. Thresholds and interest rates are updated annually.' },
    { question: 'Which student loan plan am I on?', answer: 'Plan 1 applies if you started before September 2012 (England/Wales) or are from Northern Ireland. Plan 2 applies from September 2012 in England/Wales. Plan 4 is for Scotland. Plan 5 applies from September 2023.' },
  ],
  'wedding-cost-calculator': [
    { question: 'What does the Wedding Cost Calculator (Detailed) do?', answer: 'Calculate detailed wedding costs across 17 categories with per-guest items. See cost per guest. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator free to use?', answer: 'Yes. All calculators on Calks.uk are completely free to use. No account or registration is required. All calculations run in your browser — no data is collected.' },
    { question: 'Can I use this on my phone?', answer: 'Yes. All our calculators are fully responsive and work on smartphones, tablets and desktop computers. The interface adapts to your screen size automatically.' },
  ],
  'time-duration-calculator': [
    { question: 'What does the Time Duration Calculator do?', answer: 'Calculate hours and minutes between two times. Includes decimal hours for timesheets. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator free to use?', answer: 'Yes. All calculators on Calks.uk are completely free to use. No account or registration is required. All calculations run in your browser — no data is collected.' },
    { question: 'Can I use this on my phone?', answer: 'Yes. All our calculators are fully responsive and work on smartphones, tablets and desktop computers. The interface adapts to your screen size automatically.' },
  ],
  'split-bill-calculator': [
    { question: 'What does the Split Bill Calculator do?', answer: 'Split a bill between multiple people with itemised costs. Add people and items dynamically. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator free to use?', answer: 'Yes. All calculators on Calks.uk are completely free to use. No account or registration is required. All calculations run in your browser — no data is collected.' },
    { question: 'Can I use this on my phone?', answer: 'Yes. All our calculators are fully responsive and work on smartphones, tablets and desktop computers. The interface adapts to your screen size automatically.' },
  ],
  'speed-distance-time-calculator': [
    { question: 'What does the Speed, Distance & Time Calculator do?', answer: 'Calculate speed, distance or time from the other two. Miles and km with the SDT triangle formula. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this calculator free to use?', answer: 'Yes. All calculators on Calks.uk are completely free to use. No account or registration is required. All calculations run in your browser — no data is collected.' },
    { question: 'Can I use this on my phone?', answer: 'Yes. All our calculators are fully responsive and work on smartphones, tablets and desktop computers. The interface adapts to your screen size automatically.' },
  ],
  'profit-and-loss-calculator': [
    { question: 'What does the Profit & Loss Calculator do?', answer: 'Build a simple P&L statement. Enter revenue, COGS and overheads to see gross and net profit margins. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this suitable for my business?', answer: 'This calculator provides general estimates based on standard UK business rates and rules. Every business is different — consult your accountant for advice specific to your circumstances.' },
    { question: 'Does this use 2025/26 tax rates?', answer: 'Yes. All rates and thresholds are based on the current 2025/26 UK tax year. Corporation Tax main rate is 25% for profits over £250,000, with a 19% small profits rate.' },
  ],
  'freelance-quote-calculator': [
    { question: 'What does the Freelance Quote Calculator do?', answer: 'Build a quote from hourly rate, hours and materials. Add profit margin and VAT. All calculations are performed in your browser using official UK rates and thresholds.' },
    { question: 'Is this suitable for my business?', answer: 'This calculator provides general estimates based on standard UK business rates and rules. Every business is different — consult your accountant for advice specific to your circumstances.' },
    { question: 'Does this use 2025/26 tax rates?', answer: 'Yes. All rates and thresholds are based on the current 2025/26 UK tax year. Corporation Tax main rate is 25% for profits over £250,000, with a 19% small profits rate.' },
  ],
  'tax-code-checker': [
    { question: 'What does tax code 1257L mean?', answer: 'Tax code 1257L is the most common UK tax code for 2025/26. The number 1257 means your tax-free Personal Allowance is £12,570 (1257 × 10). The letter L confirms you have the standard allowance with no additional adjustments.' },
    { question: 'Why does my tax code start with K?', answer: 'A K prefix means you have a negative allowance — untaxed income or benefits (such as a company car or state pension) exceed your Personal Allowance. HMRC adds tax to your employment income to collect what is owed. The K code amount is added to your gross pay before tax is calculated.' },
    { question: 'What is an emergency tax code?', answer: 'Emergency tax codes (1257L W1, 1257L M1, or 1257L X) mean your employer taxes each pay period in isolation rather than cumulatively. This often happens when starting a new job without a P45. Contact HMRC or your employer to correct it and receive a refund of overpaid tax.' },
    { question: 'What does the S or C prefix on a tax code mean?', answer: 'An S prefix means Scottish income tax rates apply to your employment income. A C prefix means Welsh rates apply. If you live in Scotland or Wales but do not have this prefix, contact HMRC to update your record.' },
  ],
  'car-depreciation-calculator': [
    { question: 'How much does a new car depreciate in the first year?', answer: 'New cars typically lose 15–25% of their value in the first year. After three years, most cars have lost 40–60% of their original value. Depreciation slows considerably in subsequent years as the steepest drop occurs early.' },
    { question: 'Which cars depreciate the least in the UK?', answer: 'Cars that hold their value best in the UK include popular mainstream models with strong demand and low running costs: Toyota RAV4, Volkswagen Golf GTI, Porsche 911, and most Volkswagen Group vehicles. Limited-edition models and German premium brands often retain value well.' },
    { question: 'Do electric cars depreciate faster than petrol?', answer: 'Currently, EVs depreciate faster than equivalent petrol cars in the UK, primarily due to rapid battery technology improvements making older models feel outdated, range anxiety concerns about ageing batteries, and a less established used market. This is expected to stabilise as EV adoption increases.' },
    { question: 'How does depreciation affect car finance?', answer: 'Depreciation is the largest cost of car ownership and is built into PCP (Personal Contract Purchase) finance. PCP monthly payments are based on the difference between the purchase price and the Guaranteed Minimum Future Value (GMFV) at the end of the term, plus interest. Understanding depreciation helps you negotiate better PCP terms.' },
  ],
  'mpg-calculator': [
    { question: 'What is a good MPG for a UK car?', answer: 'A petrol or diesel car achieving 40–50 MPG is considered efficient in the UK. Small city cars often achieve 50–60+ MPG. SUVs and larger cars typically return 30–40 MPG. Performance cars and large SUVs may achieve only 20–30 MPG. Hybrids typically achieve 50–70 MPG in mixed driving.' },
    { question: 'How does MPG differ from L/100km?', answer: 'MPG and L/100km measure fuel efficiency in opposite ways: MPG is miles per unit of fuel (higher is better), while L/100km is fuel per unit of distance (lower is better). To convert: L/100km = 282.48 ÷ MPG (UK). A 40 MPG car uses approximately 7.1 L/100km.' },
    { question: 'Why is my real MPG lower than the official figure?', answer: 'Official WLTP figures are tested in controlled laboratory conditions. Real-world MPG is lower due to factors including driving style, frequent short trips (cold engine is less efficient), motorway speeds, air conditioning use, roof boxes or cycle carriers, passenger weight, and tyre pressure. Expect 10–25% less than the official figure.' },
  ],
  'carer-allowance-calculator': [
    { question: "How much is Carer's Allowance in 2025/26?", answer: "Carer's Allowance is £81.90 per week (£4,258.80 per year) for 2025/26. It is taxable but does not affect means-tested benefits — instead it is taken into account as income in calculations for Universal Credit and other income-related benefits." },
    { question: "What is the earnings limit for Carer's Allowance?", answer: "Your net weekly earnings must not exceed £151 per week to receive Carer's Allowance. Net earnings are calculated after deducting income tax, National Insurance, pension contributions, and 50% of any pension premium costs. Self-employed carers use their weekly profit after allowable expenses." },
    { question: "Can I claim Carer's Allowance if I receive a State Pension?", answer: "If your State Pension is the same amount as or higher than Carer's Allowance (£81.90/week), you cannot receive both — only the higher of the two is paid. However, you can still be 'underlying entitled' to Carer's Allowance, which triggers the Carer Element in Universal Credit (£198.31/month in 2025/26)." },
  ],
  'employers-liability-calculator': [
    { question: "Is employers' liability insurance compulsory?", answer: "Yes. Under the Employers' Liability (Compulsory Insurance) Act 1969, virtually all UK businesses with at least one employee must hold EL insurance with a minimum cover of £5 million. Exemptions include family businesses where all employees are close family members, and certain public sector bodies. The fine for non-compliance is up to £2,500 per day." },
    { question: "What does employers' liability insurance cover?", answer: "EL insurance covers compensation claims from employees (or former employees) who suffer injury, illness or death as a result of their work. This includes injuries from accidents, occupational diseases like repetitive strain injury, asbestos-related illness, and hearing loss from noise exposure. It does not cover third-party claims from customers or members of the public — that requires separate public liability insurance." },
    { question: "How is the employers' liability premium calculated?", answer: "Premiums are typically expressed as a percentage of your annual wage bill, adjusted for your industry risk classification. A professional services firm might pay 0.3–0.8% of payroll, while a construction business might pay 1.5–3.0%. Your claims history and safety record also affect the rate significantly." },
  ],
  'blind-persons-allowance-calculator': [
    { question: "What is Blind Person's Allowance for 2025/26?", answer: "Blind Person's Allowance (BPA) for 2025/26 is £3,070. It is an additional income tax allowance added on top of your standard Personal Allowance of £12,570, giving a total tax-free income of £15,640. It is worth up to £614 per year in tax savings at the basic rate, or £1,228 at the higher rate." },
    { question: "Who qualifies for Blind Person's Allowance?", answer: "You qualify if you are registered as severely sight impaired (blind) with your local council. In England and Wales this requires a CVI (Certificate of Vision Impairment). In Scotland an SOAVI form is used. You can also claim if an ophthalmologist certifies you as unable to perform any work requiring eyesight, even before formal registration is complete." },
    { question: "Can I transfer Blind Person's Allowance to my spouse?", answer: "Yes. If you cannot use all of your Blind Person's Allowance because your income is too low, you can transfer the unused amount to your spouse or civil partner. They do not need to be registered blind. The transfer can save up to £614/year (basic rate) or £1,228/year (higher rate) depending on their tax band." },
  ],
  'teachers-pension-calculator': [
    { question: "How is the Teachers' Pension calculated?", answer: "Under the 2015 career average scheme, you earn 1/57th of your pensionable salary each year as a pension accrual. That amount is revalued annually by CPI + 1.6% until retirement. For example, a year on £40,000 adds £701.75/year to your pension (£40,000 ÷ 57), which then grows with inflation plus 1.6% every year." },
    { question: "What are the Teachers' Pension contribution rates for 2025/26?", answer: "Member contribution rates for 2025/26 are: 7.4% (up to £32,135), 8.6% (£32,136–£43,259), 9.7% (£43,260–£51,292), 10.2% (£51,293–£67,431), 11.7% (£67,432–£92,297) and 12.4% (above £92,297). Employer contributions are 23.68%. All contributions attract income tax relief." },
    { question: "When can I access my Teachers' Pension?", answer: "Normal Pension Age for the 2015 career average scheme is linked to State Pension Age (currently 67, rising to 68 from 2044). You can take your pension earlier with an actuarial reduction, or later with an enhancement. The pension is CPI-linked in payment." },
  ],
  'student-loan-total-cost-calculator': [
    { question: 'Will I repay my student loan in full?', answer: 'Most Plan 5 graduates (post-2023) will not repay their loan in full before the 40-year write-off. Plan 2 graduates (2012–2022) face a 30-year write-off. Whether you repay in full depends on your lifetime earnings. High earners repay everything plus interest; those on median earnings often have a substantial balance written off.' },
    { question: 'How much interest is charged on a Plan 5 student loan?', answer: 'Plan 5 loans accrue interest at the rate of RPI inflation only, regardless of your income. This is more favourable than Plan 2, which charged RPI + up to 3% on higher incomes. The RPI rate is set annually and published by the Student Loans Company.' },
    { question: 'Is it worth making voluntary student loan overpayments?', answer: 'For most Plan 2 and Plan 5 borrowers, voluntary overpayments are rarely financially beneficial unless you expect to repay the full balance before the write-off date. If you are unlikely to clear the full loan, any overpayment reduces the amount eventually written off rather than reducing your lifetime repayment. Run the full projection before making overpayments.' },
  ],
  'ni-salary-sacrifice-2029-calculator': [
    { question: 'How does salary sacrifice save NI?', answer: 'When you make pension contributions through salary sacrifice, your contractual salary is reduced by the contribution amount before NI is calculated. This lowers the NI base for both you and your employer. At the 2025/26 employer NI rate of 15%, every £1,000 directed to a pension saves the employer £150 in NI. Many employers share this saving with employees.' },
    { question: 'What changes are proposed for salary sacrifice NI in 2029?', answer: 'The government has consulted on restricting the employer NI advantage on pension contributions made via salary sacrifice. Under the proposed change, pension contributions would not reduce the employer NI base, removing the NI saving currently available. No legislation has been passed as of April 2026 and the 2029 date is subject to change.' },
    { question: 'Should I increase salary sacrifice pension before 2029?', answer: 'If the proposed changes proceed, maximising salary sacrifice pension contributions while the NI advantage remains available could be beneficial — particularly if your employer passes the NI saving back to you as an enhanced contribution. Review your pension arrangement with a financial adviser before making significant changes.' },
  ],
  'mortgage-early-repayment-calculator': [
    { question: 'What is an Early Repayment Charge (ERC)?', answer: 'An Early Repayment Charge (ERC) is a fee your lender charges if you repay your mortgage early or overpay beyond your allowance during a fixed or tracker period. ERCs are typically 1–5% of the amount overpaid or the outstanding balance, declining each year through the fixed period. After the fixed period ends, most lenders allow unlimited overpayments without penalty.' },
    { question: 'How much can I overpay without an ERC?', answer: 'Most UK lenders allow annual overpayments of up to 10% of your outstanding mortgage balance without an ERC. For example, on a £200,000 mortgage you could overpay up to £20,000 per year penalty-free. Check your specific mortgage terms as this varies — some lenders allow more, some less.' },
    { question: 'Is it worth paying the ERC to remortgage early?', answer: 'It depends on the interest rate difference and how long remains on your fix. If interest rates have fallen significantly and you have several years left on a high fixed rate, the interest saved on a new deal can outweigh the ERC cost. Use this calculator to find the break-even point for your specific situation.' },
  ],
  'care-cost-calculator': [
    { question: 'What is the care home means-test threshold in England?', answer: 'In England, if your total assessable assets exceed £23,250 (the upper capital limit), you are fully self-funded and must pay the full cost of your care. Below £14,250, the local authority meets most of the cost. Between the two limits, a sliding scale applies where you contribute £1 per week for every £250 of assets above £14,250.' },
    { question: 'Is my home included in the care home means test?', answer: 'Your home is included in the means test if it will be empty when you enter permanent residential care. However, it is disregarded if a spouse or civil partner, a dependent child under 18, or a qualifying carer lives there. Even if included, a Deferred Payment Agreement (DPA) with the council can allow you to delay selling until after death.' },
    { question: 'What happened to the £86,000 care cost cap?', answer: 'The Dilnot Commission proposed a lifetime care cap of £86,000, originally due to take effect in October 2023. This was delayed to October 2025 and has since been indefinitely postponed. As of April 2026, the existing means-test thresholds (£23,250 upper, £14,250 lower) remain in force with no cap in place.' },
  ],
}
